import GoogleCalendar from '../components/GoogleCalendar';
import { useEffect, useState } from 'react';
import { getTools } from '../api/tools';
import type { Tool } from '../types/tools';

export default function ToolsLibraryPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    getTools(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setTools(data);
      })
      .catch((reason: unknown) => {
        if (!controller.signal.aborted)
          setError(
            reason instanceof Error
              ? reason.message
              : 'Không thể kết nối máy chủ.',
          );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [reload]);

  const search = query.trim().toLocaleLowerCase('vi');
  const filtered = tools.filter((tool) =>
    `${tool.name} ${tool.description ?? ''}`
      .toLocaleLowerCase('vi')
      .includes(search),
  );

  return (
    <>
      <header className="header">
        <a className="brand" href="/" aria-label="Tools — Trang chủ">
          <span className="logo">t.</span>tools
        </a>
        <span className="header-label">Thư viện công cụ</span>
        <a href="#/admin/login">Quản trị</a>
      </header>
      <main>
        <div className="heading">
          <p className="eyebrow">Tools workspace</p>
          <h1>Khám phá công cụ</h1>
          <p className="muted">Tìm công cụ phù hợp với nhu cầu của bạn.</p>
        </div>
        <section
          className="panel"
          aria-label="Danh sách công cụ"
          aria-busy={loading}
        >
          <div className="toolbar">
            <label className="search" htmlFor="search">
              Tìm kiếm công cụ
              <input
                id="search"
                type="search"
                placeholder="Tìm theo tên hoặc mô tả…"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
            {!loading && !error && (
              <p className="muted" role="status">
                {filtered.length} công cụ
              </p>
            )}
          </div>
          {loading ? (
            <p className="message" role="status">
              Đang tải công cụ…
            </p>
          ) : error ? (
            <div className="message">
              <p role="alert">{error}</p>
              <button
                type="button"
                onClick={() => setReload((value) => value + 1)}
              >
                Thử lại
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <p className="message" role="status">
              {tools.length === 0
                ? 'Chưa có công cụ trong thư viện.'
                : 'Không tìm thấy công cụ phù hợp.'}
            </p>
          ) : (
            <div className="tool-grid">
              {filtered.map((tool) => (
                <article className="tool-card" key={tool.id}>
                  <h2>{tool.name}</h2>
                  <p className="muted">
                    {tool.description || 'Chưa có mô tả.'}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>
        <GoogleCalendar />
      </main>
      <footer>© {new Date().getFullYear()} Tools</footer>
    </>
  );
}
