import { useState, useEffect } from 'react';
import type { CalendarEvent } from '../types/calendar';

function addDays(date: Date, count: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + count);
  return result;
}
function dayKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
function weekStart(date: Date) {
  const result = addDays(date, -((date.getDay() + 6) % 7));
  result.setHours(0, 0, 0, 0);
  return result;
}
const clock = (date: string) =>
  new Date(date).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  });

interface NewSlotInfo {
  day: Date;
  startHour: number;
}

interface SlotEventsModalInfo {
  day: Date;
  startHour: number;
  events: CalendarEvent[];
}

export default function CalendarWeek({
  events,
  calendarName,
}: {
  events: CalendarEvent[];
  calendarName: string;
}) {
  const [localEvents, setLocalEvents] = useState<CalendarEvent[]>(events);
  const [anchor, setAnchor] = useState(() => new Date());
  const [detail, setDetail] = useState<CalendarEvent>();
  const [createSlot, setCreateSlot] = useState<NewSlotInfo>();
  const [slotModal, setSlotModal] = useState<SlotEventsModalInfo>();
  const [newSummary, setNewSummary] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editSummary, setEditSummary] = useState('');

  useEffect(() => {
    setLocalEvents(events);
  }, [events]);

  const openDetail = (event: CalendarEvent) => {
    setDetail(event);
    setIsEditing(false);
    setEditSummary(event.summary);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!detail || !editSummary.trim()) return;
    const updatedSummary = editSummary.trim();
    setLocalEvents((prev) =>
      prev.map((item) =>
        item.id === detail.id ? { ...item, summary: updatedSummary } : item,
      ),
    );
    setDetail((prev) => (prev ? { ...prev, summary: updatedSummary } : undefined));
    setIsEditing(false);
  };

  const today = new Date();
  const start = weekStart(anchor);
  const days = Array.from({ length: 7 }, (_, index) => addDays(start, index));
  const monthStart = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  const miniStart = weekStart(monthStart);
  const miniDays = Array.from({ length: 42 }, (_, index) =>
    addDays(miniStart, index),
  );
  const maxDate = addDays(today, 30);
  const weekEvents = localEvents.filter(
    (event) =>
      new Date(event.start) < addDays(start, 7) && new Date(event.end) > start,
  );

  const handleColumnClick = (day: Date, e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetY = e.clientY - rect.top;
    const hour = Math.min(23, Math.max(0, Math.floor(offsetY / 48)));

    const slotStart = new Date(day);
    slotStart.setHours(hour, 0, 0, 0);
    const slotEnd = new Date(day);
    slotEnd.setHours(hour + 1, 0, 0, 0);

    const existingInSlot = weekEvents.filter((ev) => {
      const evStart = new Date(ev.start);
      const evEnd = new Date(ev.end);
      return evStart < slotEnd && evEnd > slotStart;
    });

    if (existingInSlot.length > 0) {
      setSlotModal({ day, startHour: hour, events: existingInSlot });
    } else {
      setCreateSlot({ day, startHour: hour });
      setNewSummary('');
    }
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createSlot || !newSummary.trim()) return;
    const startDate = new Date(createSlot.day);
    startDate.setHours(createSlot.startHour, 0, 0, 0);

    const endDate = new Date(createSlot.day);
    endDate.setHours(createSlot.startHour + 1, 0, 0, 0);

    const newEv: CalendarEvent = {
      id: `created-${Date.now()}`,
      summary: newSummary.trim(),
      start: startDate.toISOString(),
      end: endDate.toISOString(),
    };

    setLocalEvents((prev) => [...prev, newEv]);
    setCreateSlot(undefined);
    setNewSummary('');
  };

  const handleDeleteEvent = (id: string) => {
    setLocalEvents((prev) => prev.filter((item) => item.id !== id));
    setDetail(undefined);
  };

  return (
    <div className="rounded border border-zinc-200">
      <div className="flex flex-wrap items-center gap-3 border-b border-zinc-200 p-4">
        <button
          type="button"
          className="secondary"
          onClick={() => setAnchor(new Date())}
        >
          Hôm nay
        </button>
        <button
          type="button"
          className="secondary"
          aria-label="Tuần trước"
          disabled={start <= weekStart(today)}
          onClick={() => setAnchor(addDays(start, -7))}
        >
          ‹
        </button>
        <button
          type="button"
          className="secondary"
          aria-label="Tuần sau"
          disabled={addDays(start, 7) > maxDate}
          onClick={() => setAnchor(addDays(start, 7))}
        >
          ›
        </button>
        <h2 className="!mb-0">
          {anchor.toLocaleDateString('vi-VN', {
            month: 'long',
            year: 'numeric',
          })}
        </h2>
        <span className="ml-auto rounded border border-zinc-200 px-3 py-2 text-xs text-zinc-500">
          Chế độ tuần
        </span>
      </div>
      <div className="grid lg:grid-cols-[200px_minmax(0,1fr)]">
        <aside
          className="hidden border-r border-zinc-200 p-4 lg:block"
          aria-label="Lịch nhỏ"
        >
          <p className="mb-4 text-sm font-semibold">
            {anchor.toLocaleDateString('vi-VN', {
              month: 'long',
              year: 'numeric',
            })}
          </p>
          <div className="grid grid-cols-7 gap-y-2 text-center text-[11px]">
            {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day) => (
              <span key={day} className="text-zinc-400">
                {day}
              </span>
            ))}
            {miniDays.map((date) => (
              <button
                key={dayKey(date)}
                type="button"
                disabled={date < weekStart(today) || date > maxDate}
                onClick={() => setAnchor(date)}
                aria-label={date.toLocaleDateString('vi-VN')}
                aria-pressed={dayKey(date) === dayKey(anchor)}
                className={`mini-day ${dayKey(date) === dayKey(today) ? '!bg-blue-600 !text-white' : dayKey(date) === dayKey(anchor) ? '!bg-blue-50 !text-blue-700' : '!bg-transparent !text-zinc-600'} ${date.getMonth() !== anchor.getMonth() ? 'opacity-40' : ''}`}
              >
                {date.getDate()}
              </button>
            ))}
          </div>
          <div className="mt-7 border-t border-zinc-200 pt-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
              Lịch đang xem
            </p>
            <p className="mt-3 flex items-center gap-2 text-sm">
              <span className="size-3 shrink-0 rounded-sm bg-blue-500" />
              {calendarName}
            </p>
          </div>
        </aside>
        <div className="min-w-0 overflow-x-auto">
          <div className="min-w-[760px]">
            <div className="grid grid-cols-[56px_repeat(7,minmax(0,1fr))] border-b border-zinc-200">
              <div />
              <div className="contents">
                {days.map((day) => (
                  <div
                    key={dayKey(day)}
                    className={`border-l border-zinc-200 py-3 text-center ${dayKey(day) === dayKey(today) ? 'bg-blue-50 text-blue-600' : 'text-zinc-600'}`}
                  >
                    <p className="text-[11px] uppercase">
                      {day.toLocaleDateString('vi-VN', { weekday: 'short' })}
                    </p>
                    <span className="text-3xl font-normal">
                      {day.getDate()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-[56px_repeat(7,minmax(0,1fr))] border-b border-zinc-200 bg-zinc-50/50">
              <span className="p-2 text-[10px] text-zinc-400">Cả ngày</span>
              {days.map((day) => (
                <div
                  key={dayKey(day)}
                  className="min-h-10 space-y-1 border-l border-zinc-200 p-1"
                >
                  {weekEvents
                    .filter(
                      (event) =>
                        /^\d{4}-\d{2}-\d{2}$/.test(event.start) &&
                        event.start <= dayKey(day) &&
                        event.end > dayKey(day),
                    )
                    .map((event) => (
                      <button
                        key={event.id}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDetail(event);
                        }}
                        className="calendar-all-day"
                      >
                        {event.summary}
                      </button>
                    ))}
                </div>
              ))}
            </div>
            <div className="max-h-[600px] overflow-y-auto">
              <div className="grid grid-cols-[56px_repeat(7,minmax(0,1fr))]">
                <div className="relative h-[1152px]">
                  {Array.from({ length: 24 }, (_, hour) => (
                    <span
                      key={hour}
                      className="absolute right-2 text-[10px] text-zinc-400"
                      style={{ top: hour * 48 }}
                    >
                      {String(hour).padStart(2, '0')}:00
                    </span>
                  ))}
                </div>
                {days.map((day) => {
                  const dayEnd = addDays(day, 1);
                  const items = weekEvents
                    .filter(
                      (event) =>
                        event.start.includes('T') &&
                        new Date(event.start) < dayEnd &&
                        new Date(event.end) > day,
                    )
                    .sort((a, b) => Date.parse(a.start) - Date.parse(b.start));
                  return (
                    <div
                      key={dayKey(day)}
                      onClick={(e) => handleColumnClick(day, e)}
                      className={`relative h-[1152px] cursor-pointer border-l border-zinc-200 bg-[repeating-linear-gradient(to_bottom,transparent_0px,transparent_47px,#e4e4e7_47px,#e4e4e7_48px)] ${dayKey(day) === dayKey(today) ? 'bg-blue-50/30' : ''}`}
                    >
                      {items.map((event) => {
                        const eventStart = new Date(event.start);
                        const eventEnd = new Date(event.end);
                        const from =
                          eventStart < day
                            ? 0
                            : eventStart.getHours() * 60 +
                              eventStart.getMinutes();
                        const to =
                          eventEnd >= dayEnd
                            ? 1440
                            : eventEnd.getHours() * 60 + eventEnd.getMinutes();
                        const overlaps = [event];
                        let groupStart = eventStart.getTime();
                        let groupEnd = eventEnd.getTime();
                        let expanded = true;
                        while (expanded) {
                          expanded = false;
                          for (const other of items) {
                            if (
                              overlaps.some((member) => member.id === other.id)
                            )
                              continue;
                            const otherStart = Date.parse(other.start);
                            const otherEnd = Date.parse(other.end);
                            if (
                              otherStart < groupEnd &&
                              otherEnd > groupStart
                            ) {
                              overlaps.push(other);
                              groupStart = Math.min(groupStart, otherStart);
                              groupEnd = Math.max(groupEnd, otherEnd);
                              expanded = true;
                            }
                          }
                        }
                        overlaps.sort(
                          (a, b) =>
                            Date.parse(a.start) - Date.parse(b.start) ||
                            a.id.localeCompare(b.id),
                        );
                        const lane = overlaps.findIndex(
                          (other) => other.id === event.id,
                        );
                        return (
                          <button
                            key={event.id}
                            type="button"
                            className="calendar-time-event"
                            style={{
                              top: from * 0.8,
                              height: Math.max(18, (to - from) * 0.8),
                              left: `${(lane * 100) / overlaps.length}%`,
                              width: `${100 / overlaps.length}%`,
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              openDetail(event);
                            }}
                            aria-label={`${event.summary}, ${clock(event.start)} đến ${clock(event.end)}`}
                          >
                            <strong className="block truncate">
                              {event.summary}
                            </strong>
                            <span className="block truncate">
                              {clock(event.start)} – {clock(event.end)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      {weekEvents.length === 0 && (
        <p
          className="border-t border-zinc-200 p-3 text-sm text-zinc-500"
          role="status"
        >
          Không có sự kiện trong tuần này thuộc khoảng dữ liệu đã tải.
        </p>
      )}

      {/* Modal Popup Tạo Sự Kiện Mới Khi Click Vào Ô Trống */}
      {createSlot && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setCreateSlot(undefined)}
          role="dialog"
          aria-modal="true"
        >
          <form
            className="w-full max-w-xl space-y-4 rounded-lg border border-zinc-200 bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleCreateEvent}
          >
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h3 className="text-lg font-semibold text-zinc-900">Tạo sự kiện mới</h3>
              <button
                type="button"
                className="secondary"
                onClick={() => setCreateSlot(undefined)}
              >
                ✕
              </button>
            </div>
            <div>
              <p className="inline-block rounded bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600">
                {createSlot.day.toLocaleDateString('vi-VN')} · {String(createSlot.startHour).padStart(2, '0')}:00 – {String(createSlot.startHour + 1).padStart(2, '0')}:00
              </p>
            </div>
            <div>
              <label htmlFor="new-event-title" className="mb-1 block text-sm font-medium text-zinc-700">
                Tiêu đề sự kiện
              </label>
              <input
                id="new-event-title"
                type="text"
                required
                autoFocus
                placeholder="Nhập tên sự kiện..."
                className="w-full rounded border border-zinc-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
                value={newSummary}
                onChange={(e) => setNewSummary(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                className="secondary"
                onClick={() => setCreateSlot(undefined)}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Tạo sự kiện
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal Popup Xem Chi Tiết, Chỉnh Sửa & Xóa Sự Kiện */}
      {detail && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setDetail(undefined)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-event-title"
        >
          <div
            className="w-full max-w-xl space-y-4 rounded-lg border border-zinc-200 bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-zinc-100 pb-3">
              <h3 id="modal-event-title" className="text-lg font-semibold text-zinc-900">
                {isEditing ? 'Chỉnh sửa sự kiện' : 'Chi tiết sự kiện'}
              </h3>
              <button
                type="button"
                className="secondary"
                onClick={() => setDetail(undefined)}
              >
                ✕
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div>
                  <p className="mb-2 inline-block rounded bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600">
                    {new Date(detail.start).toLocaleDateString('vi-VN')} ·{' '}
                    {detail.start.includes('T')
                      ? `${clock(detail.start)} – ${clock(detail.end)}`
                      : 'Cả ngày'}
                  </p>
                  <label htmlFor="edit-event-title" className="mb-1 block text-sm font-medium text-zinc-700">
                    Tiêu đề mới
                  </label>
                  <input
                    id="edit-event-title"
                    type="text"
                    required
                    autoFocus
                    className="w-full rounded border border-zinc-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
                    value={editSummary}
                    onChange={(e) => setEditSummary(e.target.value)}
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100">
                  <button
                    type="button"
                    className="secondary"
                    onClick={() => setIsEditing(false)}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Lưu thay đổi
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div>
                  <h4 className="text-base font-medium text-zinc-900">
                    {detail.summary}
                  </h4>
                  <p className="mt-1 text-sm text-zinc-600">
                    {new Date(detail.start).toLocaleDateString('vi-VN')} ·{' '}
                    {detail.start.includes('T')
                      ? `${clock(detail.start)} – ${clock(detail.end)}`
                      : 'Cả ngày'}
                  </p>
                  <p className="mt-2 inline-block rounded bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600">
                    {calendarName}
                  </p>
                </div>
                <div className="flex items-center justify-between border-t border-zinc-100 pt-3">
                  <button
                    type="button"
                    className="rounded bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100"
                    onClick={() => handleDeleteEvent(detail.id)}
                  >
                    Xóa sự kiện
                  </button>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="rounded bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                      onClick={() => setIsEditing(true)}
                    >
                      Sửa
                    </button>
                    <button
                      type="button"
                      className="secondary"
                      onClick={() => setDetail(undefined)}
                    >
                      Đóng
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Modal Popup Danh Sách Nhiều Sự Kiện Trong Ô Khung Giờ */}
      {slotModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSlotModal(undefined)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-xl space-y-4 rounded-lg border border-zinc-200 bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div>
                <h3 className="text-lg font-semibold text-zinc-900">Danh sách sự kiện</h3>
                <p className="mt-0.5 text-xs text-zinc-500">
                  {slotModal.day.toLocaleDateString('vi-VN')} · {String(slotModal.startHour).padStart(2, '0')}:00 – {String(slotModal.startHour + 1).padStart(2, '0')}:00
                </p>
              </div>
              <button
                type="button"
                className="secondary"
                onClick={() => setSlotModal(undefined)}
              >
                ✕
              </button>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2">
              {slotModal.events.map((ev) => (
                <div
                  key={ev.id}
                  className="flex items-center justify-between rounded border border-zinc-200 bg-zinc-50 p-3 hover:bg-zinc-100/80 transition-colors"
                >
                  <div>
                    <h4 className="text-sm font-medium text-zinc-900">{ev.summary}</h4>
                    <p className="text-xs text-zinc-500">
                      {clock(ev.start)} – {clock(ev.end)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      className="rounded bg-blue-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-blue-700"
                      onClick={() => {
                        setSlotModal(undefined);
                        openDetail(ev);
                      }}
                    >
                      Xem / Sửa
                    </button>
                    <button
                      type="button"
                      className="rounded bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-100"
                      onClick={() => {
                        handleDeleteEvent(ev.id);
                        setSlotModal((prev) =>
                          prev
                            ? { ...prev, events: prev.events.filter((item) => item.id !== ev.id) }
                            : undefined,
                        );
                      }}
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between border-t border-zinc-100 pt-3">
              <button
                type="button"
                className="rounded bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                onClick={() => {
                  const day = slotModal.day;
                  const startHour = slotModal.startHour;
                  setSlotModal(undefined);
                  setCreateSlot({ day, startHour });
                  setNewSummary('');
                }}
              >
                + Thêm sự kiện khác
              </button>
              <button
                type="button"
                className="secondary"
                onClick={() => setSlotModal(undefined)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
