import { useEffect, useState } from 'react';
import { status } from '../../api/calendar';
import type { CalendarStatus } from '../../types/calendar';

export default function LoginPage() {
  const [account, setAccount] = useState<CalendarStatus>();
  const [error, setError] = useState('');
  const [reload, setReload] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setAccount(undefined);
    setError('');
    status(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setAccount(data);
      })
      .catch((reason: unknown) => {
        if (!controller.signal.aborted)
          setError(
            reason instanceof Error
              ? reason.message
              : 'Không thể kiểm tra kết nối Google.',
          );
      });
    return () => controller.abort();
  }, [reload]);
  return (
    <div className="admin grid min-h-dvh place-items-center bg-zinc-100 p-6 text-sm text-zinc-900">
      <section className="grid w-full max-w-[880px] overflow-hidden rounded border border-zinc-200 bg-white md:grid-cols-2">
        <div className="p-6 md:p-12 [&_h1]:mt-10">
          <a
            className="flex items-center gap-2.5 text-lg font-semibold"
            href="#/"
          >
            <span className="grid size-8 place-items-center rounded bg-blue-600 text-white">
              t.
            </span>
            Tools
          </a>
          <h1>Chào mừng trở lại</h1>
          <p className="text-zinc-500">
            Tiếp tục với tài khoản Google của bạn.
          </p>
          <div className="mt-8">
            {!account && !error ? (
              <p className="text-sm text-zinc-500" role="status">
                Đang kiểm tra kết nối Google…
              </p>
            ) : error ? (
              <div>
                <p className="mb-4 text-sm text-red-700" role="alert">
                  {error}
                </p>
                <button
                  type="button"
                  className="secondary"
                  onClick={() => setReload((value) => value + 1)}
                >
                  Thử lại
                </button>
              </div>
            ) : account?.configured ? (
              <a
                className="flex w-full items-center justify-center gap-3 rounded border border-zinc-300 bg-white px-4 py-3 font-semibold text-zinc-700 hover:bg-zinc-50"
                href="/api/calendar/connect"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5">
                  <path
                    fill="#4285F4"
                    d="M21.6 12.23c0-.71-.06-1.39-.18-2.05H12v3.88h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.9-1.75 2.98-4.33 2.98-7.36Z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 22c2.7 0 4.96-.9 6.62-2.41l-3.24-2.51c-.9.6-2.04.96-3.38.96-2.6 0-4.8-1.76-5.59-4.12H3.07v2.59A10 10 0 0 0 12 22Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M6.41 13.92A6 6 0 0 1 6.1 12c0-.67.11-1.32.31-1.92V7.49H3.07A10 10 0 0 0 2 12c0 1.61.39 3.14 1.07 4.51l3.34-2.59Z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.96c1.47 0 2.79.51 3.82 1.51l2.87-2.87A9.6 9.6 0 0 0 12 2a10 10 0 0 0-8.93 5.49l3.34 2.59A5.99 5.99 0 0 1 12 5.96Z"
                  />
                </svg>
                Đăng nhập bằng Google
              </a>
            ) : (
              <p className="text-sm text-zinc-500" role="status">
                Đăng nhập Google chưa được cấu hình trên máy chủ.
              </p>
            )}
            {account?.connected && (
              <a
                className="mt-4 block text-center text-blue-600 hover:underline"
                href="#/admin/calendar"
              >
                Tiếp tục với tài khoản Google đã kết nối →
              </a>
            )}
          </div>
          <p className="mt-5 text-xs leading-relaxed text-zinc-500">
            Kết nối tài khoản Google để sử dụng Calendar trong workspace. Quyền
            quản trị Tools chưa được tích hợp vào luồng Google.
          </p>
        </div>
        <div className="hidden flex-col justify-center bg-[#1a1040] p-8 text-white md:flex">
          <div className="mb-8">
            <svg
              viewBox="0 0 320 220"
              className="w-full max-w-[280px] drop-shadow-2xl"
            >
              <rect
                x="0"
                y="0"
                width="320"
                height="220"
                rx="12"
                fill="#18181b"
                stroke="rgba(255,255,255,0.08)"
              />
              <rect
                x="0"
                y="0"
                width="72"
                height="220"
                rx="12"
                fill="#0f0f11"
              />
              <circle cx="26" cy="24" r="6" fill="#a78bfa" />
              <rect
                x="14"
                y="48"
                width="44"
                height="8"
                rx="4"
                fill="rgba(255,255,255,0.5)"
              />
              <rect
                x="14"
                y="68"
                width="44"
                height="8"
                rx="4"
                fill="rgba(255,255,255,0.18)"
              />
              <rect
                x="14"
                y="88"
                width="44"
                height="8"
                rx="4"
                fill="rgba(255,255,255,0.18)"
              />
              <rect
                x="14"
                y="108"
                width="44"
                height="8"
                rx="4"
                fill="rgba(255,255,255,0.18)"
              />

              <rect
                x="88"
                y="18"
                width="216"
                height="34"
                rx="8"
                fill="rgba(255,255,255,0.06)"
              />
              <circle cx="290" cy="35" r="10" fill="#a78bfa" />

              <rect
                x="88"
                y="66"
                width="66"
                height="46"
                rx="8"
                fill="rgba(167,139,250,0.18)"
                stroke="rgba(167,139,250,0.4)"
              />
              <rect x="98" y="76" width="30" height="6" rx="3" fill="#a78bfa" />
              <rect
                x="98"
                y="88"
                width="42"
                height="10"
                rx="3"
                fill="rgba(255,255,255,0.7)"
              />

              <rect
                x="166"
                y="66"
                width="66"
                height="46"
                rx="8"
                fill="rgba(255,255,255,0.06)"
              />
              <rect
                x="176"
                y="76"
                width="30"
                height="6"
                rx="3"
                fill="rgba(255,255,255,0.4)"
              />
              <rect
                x="176"
                y="88"
                width="42"
                height="10"
                rx="3"
                fill="rgba(255,255,255,0.7)"
              />

              <rect
                x="244"
                y="66"
                width="60"
                height="46"
                rx="8"
                fill="rgba(255,255,255,0.06)"
              />
              <rect
                x="254"
                y="76"
                width="30"
                height="6"
                rx="3"
                fill="rgba(255,255,255,0.4)"
              />
              <rect
                x="254"
                y="88"
                width="34"
                height="10"
                rx="3"
                fill="rgba(255,255,255,0.7)"
              />

              <rect
                x="88"
                y="126"
                width="216"
                height="78"
                rx="8"
                fill="rgba(255,255,255,0.05)"
              />
              <polyline
                points="98,180 122,160 146,172 170,140 194,150 218,124 242,146 266,132 290,150"
                fill="none"
                stroke="#a78bfa"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <polyline
                points="98,196 122,190 146,194 170,182 194,188 218,176 242,184 266,178 290,184"
                fill="none"
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold">
            Quản lý nội dung dễ dàng, mọi lúc mọi nơi.
          </h2>
          <p className="mt-2 text-sm text-white/70">
            Đăng nhập để tiếp tục quản lý workspace của bạn.
          </p>
        </div>
      </section>
    </div>
  );
}
