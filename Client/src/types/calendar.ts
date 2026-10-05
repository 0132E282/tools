export interface CalendarStatus {
  configured: boolean;
  connected: boolean;
  csrf?: string;
}
export interface Calendar {
  id: string;
  name: string;
  writable: boolean;
  primary: boolean;
}
export interface CalendarEvent {
  id: string;
  summary: string;
  start: string;
  end: string;
  postIds?: string[]; // N - N relationship with Post
}
export interface CalendarEvents {
  items: CalendarEvent[];
  hasMore: boolean;
}
export interface CreateCalendarEvent {
  summary: string;
  description: string;
  start: string;
  end: string;
}
