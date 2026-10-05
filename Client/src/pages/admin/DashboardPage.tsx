export default function DashboardPage() {
  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1>Tổng quan</h1>
        <p className="text-zinc-500">
          Quản lý công cụ và lịch làm việc trong một workspace.
        </p>
      </div>
      <div className="grid gap-5 md:grid-cols-2 [&_a:hover]:border-blue-600 [&_span]:mt-8 [&_span]:block [&_span]:text-blue-600">
        <a
          className="min-w-0 rounded border border-zinc-200 bg-white p-6"
          href="#/admin/tools"
        >
          <h2>Công cụ</h2>
          <p className="text-zinc-500">
            Danh sách, tìm kiếm và form thêm / chỉnh sửa.
          </p>
          <span>Quản lý công cụ →</span>
        </a>
        <a
          className="min-w-0 rounded border border-zinc-200 bg-white p-6"
          href="#/admin/calendar"
        >
          <h2>Google Calendar</h2>
          <p className="text-zinc-500">
            Kết nối tài khoản và quản lý lịch làm việc.
          </p>
          <span>Mở lịch →</span>
        </a>
      </div>
    </>
  );
}
