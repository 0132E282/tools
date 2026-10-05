import {
  BadGatewayException,
  BadRequestException,
  ForbiddenException,
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CodeChallengeMethod, OAuth2Client } from 'google-auth-library';
import { randomBytes, timingSafeEqual } from 'node:crypto';
import type { Request, Response } from 'express';
import type { CalendarSession } from './types/calendar.js';
import { CalendarSessionService } from './calendar-session.service.js';
import type { CreateEventDto } from './dto/create-event.dto.js';

const SESSION = 'tools_google_session';
const STATE = 'tools_google_state';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function equal(left: string, right: string): boolean {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

@Injectable()
export class CalendarService {
  constructor(
    private readonly config: ConfigService,
    private readonly sessions: CalendarSessionService,
  ) {}

  configured(): boolean {
    return Boolean(
      this.config.get('GOOGLE_CLIENT_ID') &&
      this.config.get('GOOGLE_CLIENT_SECRET') &&
      this.config.get<string>('GOOGLE_SESSION_SECRET', '').length >= 32 &&
      this.config.get('APP_URL'),
    );
  }

  private origin(): string {
    return new URL(this.config.getOrThrow<string>('APP_URL')).origin;
  }

  private oauth(): OAuth2Client {
    if (!this.configured())
      throw new ServiceUnavailableException(
        'Điền GOOGLE_CLIENT_ID và GOOGLE_CLIENT_SECRET vào .env để kết nối Google Calendar.',
      );
    return new OAuth2Client(
      this.config.getOrThrow<string>('GOOGLE_CLIENT_ID'),
      this.config.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
      `${this.origin()}/api/login/google/callback`,
    );
  }

  private session(request: Request): CalendarSession {
    const data = this.sessions.read(request, SESSION);
    if (
      !isRecord(data) ||
      typeof data.accessToken !== 'string' ||
      typeof data.expiresAt !== 'number' ||
      typeof data.csrf !== 'string' ||
      (data.refreshToken !== undefined && typeof data.refreshToken !== 'string')
    )
      throw new UnauthorizedException('Vui lòng kết nối lại Google Calendar.');
    return {
      accessToken: data.accessToken,
      expiresAt: data.expiresAt,
      csrf: data.csrf,
      ...(typeof data.refreshToken === 'string'
        ? { refreshToken: data.refreshToken }
        : {}),
    };
  }

  status(request: Request) {
    try {
      const session = this.session(request);
      return {
        configured: this.configured(),
        connected: true,
        csrf: session.csrf,
      };
    } catch {
      return { configured: this.configured(), connected: false };
    }
  }

  async connect(response: Response): Promise<string> {
    const client = this.oauth();
    const state = randomBytes(32).toString('base64url');
    const { codeVerifier, codeChallenge } =
      await client.generateCodeVerifierAsync();
    this.sessions.write(
      response,
      STATE,
      { state, verifier: codeVerifier },
      600,
    );
    return client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      state,
      code_challenge: codeChallenge,
      code_challenge_method: CodeChallengeMethod.S256,
      scope: [
        'https://www.googleapis.com/auth/calendar.calendarlist.readonly',
        'https://www.googleapis.com/auth/calendar.events',
      ],
    });
  }

  async callback(request: Request, response: Response): Promise<void> {
    const saved = this.sessions.read(request, STATE);
    this.sessions.clear(response, STATE);
    if (
      !isRecord(saved) ||
      typeof saved.state !== 'string' ||
      typeof saved.verifier !== 'string' ||
      typeof request.query.state !== 'string' ||
      !equal(saved.state, request.query.state) ||
      typeof request.query.code !== 'string' ||
      request.query.error
    )
      throw new BadRequestException(
        'Phiên đăng nhập Google không hợp lệ hoặc đã bị hủy.',
      );
    const client = this.oauth();
    try {
      const { tokens } = await client.getToken({
        code: request.query.code,
        codeVerifier: saved.verifier,
      });
      if (!tokens.access_token || !tokens.expiry_date)
        throw new Error('Missing tokens');
      this.sessions.write(
        response,
        SESSION,
        {
          accessToken: tokens.access_token,
          expiresAt: tokens.expiry_date,
          ...(tokens.refresh_token
            ? { refreshToken: tokens.refresh_token }
            : {}),
          csrf: randomBytes(32).toString('base64url'),
        },
        7 * 24 * 3600,
      );
    } catch {
      throw new UnauthorizedException(
        'Không thể kết nối Google. Vui lòng thử lại.',
      );
    }
  }

  private async token(request: Request, response: Response): Promise<string> {
    const session = this.session(request);
    if (session.expiresAt > Date.now() + 60000) return session.accessToken;
    if (!session.refreshToken)
      throw new UnauthorizedException(
        'Phiên Google đã hết hạn. Vui lòng kết nối lại.',
      );
    try {
      const client = this.oauth();
      client.setCredentials({ refresh_token: session.refreshToken });
      const { credentials } = await client.refreshAccessToken();
      if (!credentials.access_token || !credentials.expiry_date)
        throw new Error('Missing tokens');
      session.accessToken = credentials.access_token;
      session.expiresAt = credentials.expiry_date;
      this.sessions.write(response, SESSION, session, 7 * 24 * 3600);
      return session.accessToken;
    } catch {
      this.sessions.clear(response, SESSION);
      throw new UnauthorizedException(
        'Phiên Google đã hết hạn. Vui lòng kết nối lại.',
      );
    }
  }

  private csrf(request: Request): void {
    const session = this.session(request);
    const csrf = request.headers['x-csrf-token'];
    if (
      request.headers.origin !== this.origin() ||
      typeof csrf !== 'string' ||
      !equal(session.csrf, csrf)
    )
      throw new ForbiddenException(
        'Yêu cầu không hợp lệ. Vui lòng tải lại trang.',
      );
  }

  private async google(
    request: Request,
    response: Response,
    path: string,
    init: RequestInit = {},
  ): Promise<Record<string, unknown>> {
    const token = await this.token(request, response);
    let result: globalThis.Response;
    try {
      result = await fetch(`https://www.googleapis.com/calendar/v3/${path}`, {
        ...init,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(10000),
      });
    } catch {
      throw new BadGatewayException('Không thể kết nối Google Calendar.');
    }
    if (result.status === 401) {
      this.sessions.clear(response, SESSION);
      throw new UnauthorizedException('Vui lòng kết nối lại Google Calendar.');
    }
    if (result.status === 403)
      throw new ForbiddenException('Google chưa cấp quyền truy cập lịch này.');
    if (!result.ok)
      throw new BadGatewayException(
        'Google Calendar không xử lý được yêu cầu.',
      );
    const data: unknown = await result.json();
    if (!isRecord(data))
      throw new BadGatewayException('Phản hồi Google không hợp lệ.');
    return data;
  }

  async calendars(request: Request, response: Response) {
    const data = await this.google(
      request,
      response,
      'users/me/calendarList?maxResults=250',
    );
    const items = Array.isArray(data.items) ? data.items : [];
    return items
      .filter(isRecord)
      .filter((item) => typeof item.id === 'string')
      .map((item) => ({
        id: item.id,
        name: typeof item.summary === 'string' ? item.summary : item.id,
        writable: item.accessRole === 'owner' || item.accessRole === 'writer',
        primary: item.primary === true,
      }));
  }

  async events(request: Request, response: Response, calendarId: string) {
    const query = new URLSearchParams({
      timeMin: new Date().toISOString(),
      timeMax: new Date(Date.now() + 30 * 86400000).toISOString(),
      singleEvents: 'true',
      orderBy: 'startTime',
      maxResults: '100',
    });
    const data = await this.google(
      request,
      response,
      `calendars/${encodeURIComponent(calendarId)}/events?${query}`,
    );
    return {
      items: Array.isArray(data.items)
        ? data.items
            .filter(isRecord)
            .filter((item) => item.status !== 'cancelled')
            .map((item) => ({
              id: item.id,
              summary: item.summary ?? '(Không có tiêu đề)',
              start: isRecord(item.start)
                ? (item.start.dateTime ?? item.start.date)
                : '',
              end: isRecord(item.end)
                ? (item.end.dateTime ?? item.end.date)
                : '',
            }))
        : [],
      hasMore: typeof data.nextPageToken === 'string',
    };
  }

  async create(
    request: Request,
    response: Response,
    calendarId: string,
    dto: CreateEventDto,
  ) {
    this.csrf(request);
    if (
      !dto.summary.trim() ||
      !/T.*(?:Z|[+-]\d\d:\d\d)$/.test(dto.start) ||
      !/T.*(?:Z|[+-]\d\d:\d\d)$/.test(dto.end) ||
      Date.parse(dto.end) <= Date.parse(dto.start)
    )
      throw new BadRequestException(
        'Tiêu đề và thời gian kết thúc sau thời gian bắt đầu là bắt buộc.',
      );
    const data = await this.google(
      request,
      response,
      `calendars/${encodeURIComponent(calendarId)}/events`,
      {
        method: 'POST',
        body: JSON.stringify({
          summary: dto.summary.trim(),
          description: dto.description,
          start: { dateTime: dto.start },
          end: { dateTime: dto.end },
        }),
      },
    );
    return { id: data.id };
  }

  logout(request: Request, response: Response) {
    this.csrf(request);
    this.sessions.clear(response, SESSION);
    return { connected: false };
  }
}
