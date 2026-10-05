import apiService from './apiService';
import type {
  Calendar,
  CalendarEvent,
  CalendarEvents,
  CalendarStatus,
  CreateCalendarEvent,
} from '../types/calendar';

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
export async function status(signal: AbortSignal): Promise<CalendarStatus> {
  const { data } = await apiService.get<unknown>('/calendar/status', {
    signal,
  });
  if (
    !record(data) ||
    typeof data.configured !== 'boolean' ||
    typeof data.connected !== 'boolean'
  )
    throw new Error('Phản hồi đăng nhập không hợp lệ.');
  return {
    configured: data.configured,
    connected: data.connected,
    ...(typeof data.csrf === 'string' ? { csrf: data.csrf } : {}),
  };
}
function isCalendar(value: unknown): value is Calendar {
  return (
    record(value) &&
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    typeof value.writable === 'boolean' &&
    typeof value.primary === 'boolean'
  );
}
function isEvent(value: unknown): value is CalendarEvent {
  return (
    record(value) &&
    typeof value.id === 'string' &&
    typeof value.summary === 'string' &&
    typeof value.start === 'string' &&
    typeof value.end === 'string'
  );
}
export async function calendars(signal: AbortSignal): Promise<Calendar[]> {
  const { data } = await apiService.get<unknown>('/calendar/calendars', {
    signal,
  });
  if (!Array.isArray(data) || !data.every(isCalendar))
    throw new Error('Danh sách lịch không hợp lệ.');
  return data;
}
export async function events(
  id: string,
  signal: AbortSignal,
): Promise<CalendarEvents> {
  const { data } = await apiService.get<unknown>(
    `/calendar/${encodeURIComponent(id)}/events`,
    { signal },
  );
  if (
    !record(data) ||
    !Array.isArray(data.items) ||
    !data.items.every(isEvent) ||
    typeof data.hasMore !== 'boolean'
  )
    throw new Error('Danh sách sự kiện không hợp lệ.');
  return { items: data.items, hasMore: data.hasMore };
}
export async function createEvent(
  id: string,
  csrf: string,
  event: CreateCalendarEvent,
): Promise<void> {
  await apiService.post<unknown>(
    `/calendar/${encodeURIComponent(id)}/events`,
    event,
    {
      headers: { 'X-CSRF-Token': csrf },
    },
  );
}
export async function logout(csrf: string): Promise<void> {
  await apiService.post<unknown>('/calendar/logout', undefined, {
    headers: { 'X-CSRF-Token': csrf },
  });
}
