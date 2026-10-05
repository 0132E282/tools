export interface CalendarSession {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
  csrf: string;
}

export interface OAuthState {
  state: string;
  verifier: string;
}
