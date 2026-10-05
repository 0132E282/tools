import CalendarWeek from './CalendarWeek';
import type { CalendarEvent } from '../types/calendar';

function getMockEvents(): CalendarEvent[] {
  const now = new Date();
  const makeDate = (dayOffset: number, hour: number, minute = 0) => {
    const d = new Date(now);
    d.setDate(d.getDate() + dayOffset);
    d.setHours(hour, minute, 0, 0);
    return d.toISOString();
  };

  return [
    {
      id: 'event-1',
      summary: 'Họp khởi động dự án',
      start: makeDate(0, 9, 0),
      end: makeDate(0, 10, 30),
    },
    {
      id: 'event-2',
      summary: 'Thảo luận thiết kế UI/UX',
      start: makeDate(0, 14, 0),
      end: makeDate(0, 15, 30),
    },
    {
      id: 'event-3',
      summary: 'Kiểm thử & Review tính năng Calendar',
      start: makeDate(1, 10, 0),
      end: makeDate(1, 11, 30),
    },
    {
      id: 'event-4',
      summary: 'Gặp gỡ đối tác & Khách hàng',
      start: makeDate(3, 15, 0),
      end: makeDate(3, 16, 30),
    },
    {
      id: 'event-5',
      summary: 'Sprint Planning & Task Assignment',
      start: makeDate(4, 11, 0),
      end: makeDate(4, 12, 0),
    },
  ];
}

export default function GoogleCalendar() {
  const events = getMockEvents();

  return (
    <section
      className="min-w-0 rounded border border-zinc-200 bg-white"
      id="calendar"
    >
      <div className="space-y-6 p-2 md:p-4">
        <CalendarWeek
          events={events}
          calendarName="Lịch cá nhân"
        />
      </div>
    </section>
  );
}
