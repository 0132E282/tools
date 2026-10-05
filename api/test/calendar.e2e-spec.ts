import { GoogleLoginController } from '../src/calendar/google-login.controller.js';
import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import type { INestApplication } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import request from 'supertest';
import { CalendarController } from '../src/calendar/calendar.controller.js';
import { CalendarService } from '../src/calendar/calendar.service.js';
import { CalendarSessionService } from '../src/calendar/calendar-session.service.js';
import { configureApp } from '../src/configure-app.js';

const settings = {
  APP_URL: 'http://localhost:3000',
  GOOGLE_CLIENT_ID: 'test-id',
  GOOGLE_CLIENT_SECRET: 'test-secret',
  GOOGLE_SESSION_SECRET: 'test-session-key-with-at-least-32-characters',
};

function csrfToken(value: unknown): string {
  if (
    typeof value !== 'object' ||
    value === null ||
    !('csrf' in value) ||
    typeof value.csrf !== 'string'
  )
    throw new Error('Missing CSRF token');
  return value.csrf;
}

describe('Google Calendar (e2e)', () => {
  let app: INestApplication;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [CalendarController, GoogleLoginController],
      providers: [
        CalendarService,
        CalendarSessionService,
        { provide: ConfigService, useValue: new ConfigService(settings) },
      ],
    }).compile();
    app = module.createNestApplication();
    configureApp(app);
    await app.init();
  });
  afterEach(async () => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    await app.close();
  });

  async function login() {
    const agent = request.agent(app.getHttpServer());
    const connect = await agent.get('/api/calendar/connect').expect(302);
    const location: unknown = connect.headers.location;
    if (typeof location !== 'string')
      throw new Error('Missing Google redirect');
    const url = new URL(location);
    expect(url.hostname).toBe('accounts.google.com');
    expect(url.searchParams.get('redirect_uri')).toBe(
      'http://localhost:3000/api/login/google/callback',
    );
    expect(url.searchParams.get('code_challenge_method')).toBe('S256');
    expect(url.searchParams.get('code_challenge')).toBeTruthy();
    vi.spyOn(OAuth2Client.prototype, 'getToken').mockImplementation(() =>
      Promise.resolve({
        tokens: {
          access_token: 'private-access',
          refresh_token: 'private-refresh',
          expiry_date: Date.now() + 3600000,
        },
        res: null,
      }),
    );
    await agent
      .get('/api/login/google/callback')
      .query({ code: 'test-code', state: url.searchParams.get('state') })
      .expect(302);
    return agent;
  }

  it('rejects unauthenticated calendar access', async () => {
    await request(app.getHttpServer())
      .get('/api/calendar/calendars')
      .expect(401);
    const status = await request(app.getHttpServer())
      .get('/api/calendar/status')
      .expect(200);
    expect(status.body).toEqual({ configured: true, connected: false });
  });

  it('rejects forged OAuth callbacks before exchanging a code', async () => {
    const exchange = vi.spyOn(OAuth2Client.prototype, 'getToken');
    await request(app.getHttpServer())
      .get('/api/login/google/callback?state=forged&code=forged')
      .expect(302)
      .expect('Location', '/?calendar=error#/admin/calendar');
    expect(exchange).not.toHaveBeenCalled();
  });

  it('keeps tokens private and rejects cross-origin and missing-CSRF writes', async () => {
    const agent = await login();
    const status = await agent.get('/api/calendar/status').expect(200);
    expect(status.body.connected).toBe(true);
    expect(status.text).not.toContain('private-access');
    expect(status.text).not.toContain('private-refresh');
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);
    const event = {
      summary: 'Meeting',
      start: '2026-10-20T08:00:00Z',
      end: '2026-10-20T09:00:00Z',
    };
    await agent
      .post('/api/calendar/primary/events')
      .set('Origin', settings.APP_URL)
      .send(event)
      .expect(403);
    await agent
      .post('/api/calendar/primary/events')
      .set('Origin', 'https://attacker.example')
      .set('X-CSRF-Token', csrfToken(status.body))
      .send(event)
      .expect(403);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('validates dates and creates one event through Google with a valid session', async () => {
    const agent = await login();
    const status = await agent.get('/api/calendar/status').expect(200);
    const fetchSpy = vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify({ id: 'google-event' }), { status: 200 }),
      );
    vi.stubGlobal('fetch', fetchSpy);
    const event = {
      summary: 'Meeting',
      start: '2026-10-20T08:00:00Z',
      end: '2026-10-20T09:00:00Z',
    };
    await agent
      .post('/api/calendar/primary/events')
      .set('Origin', settings.APP_URL)
      .set('X-CSRF-Token', csrfToken(status.body))
      .send({ ...event, end: event.start })
      .expect(400);
    expect(fetchSpy).not.toHaveBeenCalled();
    await agent
      .post('/api/calendar/primary/events')
      .set('Origin', settings.APP_URL)
      .set('X-CSRF-Token', csrfToken(status.body))
      .send(event)
      .expect(201)
      .expect({ id: 'google-event' });
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    await agent
      .post('/api/calendar/logout')
      .set('Origin', settings.APP_URL)
      .set('X-CSRF-Token', csrfToken(status.body))
      .expect(201);
    await agent.get('/api/calendar/calendars').expect(401);
  });
});
