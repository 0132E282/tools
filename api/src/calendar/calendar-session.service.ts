import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from 'node:crypto';
import type { Request, Response } from 'express';

@Injectable()
export class CalendarSessionService {
  constructor(private readonly config: ConfigService) {}

  private key(): Buffer {
    const secret = this.config.get<string>('GOOGLE_SESSION_SECRET', '');
    if (secret.length < 32)
      throw new ServiceUnavailableException('Chưa cấu hình Google Calendar.');
    return createHash('sha256').update(secret).digest();
  }

  private options(name: string) {
    return {
      httpOnly: true,
      secure: this.config.get<string>('APP_URL', '').startsWith('https:'),
      sameSite: 'lax' as const,
      path:
        name === 'tools_google_state' ? '/api/login/google' : '/api/calendar',
    };
  }

  write(
    response: Response,
    name: string,
    value: object,
    seconds: number,
  ): void {
    const iv = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', this.key(), iv);
    cipher.setAAD(Buffer.from(name));
    const body = Buffer.concat([
      cipher.update(
        JSON.stringify({ value, expires: Date.now() + seconds * 1000 }),
      ),
      cipher.final(),
    ]);
    const cookie = Buffer.concat([iv, cipher.getAuthTag(), body]).toString(
      'base64url',
    );
    if (cookie.length > 3800)
      throw new ServiceUnavailableException(
        'Phiên Google quá lớn. Vui lòng đăng nhập lại.',
      );
    response.cookie(name, cookie, {
      ...this.options(name),
      maxAge: seconds * 1000,
    });
  }

  read(request: Request, name: string): unknown {
    try {
      const entry = request.headers.cookie
        ?.split(';')
        .map((part) => part.trim())
        .find((part) => part.startsWith(`${name}=`));
      if (!entry) return undefined;
      const bytes = Buffer.from(
        decodeURIComponent(entry.slice(name.length + 1)),
        'base64url',
      );
      if (bytes.length < 29 || bytes.length > 4000) return undefined;
      const decipher = createDecipheriv(
        'aes-256-gcm',
        this.key(),
        bytes.subarray(0, 12),
      );
      decipher.setAAD(Buffer.from(name));
      decipher.setAuthTag(bytes.subarray(12, 28));
      const data: unknown = JSON.parse(
        Buffer.concat([
          decipher.update(bytes.subarray(28)),
          decipher.final(),
        ]).toString(),
      );
      if (
        typeof data !== 'object' ||
        data === null ||
        !('expires' in data) ||
        typeof data.expires !== 'number' ||
        data.expires < Date.now() ||
        !('value' in data)
      )
        return undefined;
      return data.value;
    } catch {
      return undefined;
    }
  }

  clear(response: Response, name: string): void {
    response.clearCookie(name, this.options(name));
  }
}
