import { useState } from 'react';
import type { Post } from '../../types/posts';
import type { CalendarEvent } from '../../types/calendar';
import { Button } from '../../components/ui/button';
import { Plus, Edit3, Trash2, Globe, Send, Sparkles, Check, FileText, Calendar } from 'lucide-react';
import { Textarea } from '../../components/ui/textarea';
import { Input } from '../../components/ui/input';

interface PlatformModule {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}

const MOCK_CALENDAR_EVENTS: CalendarEvent[] = [
  { id: 'event-1', summary: 'Họp khởi động dự án', start: '2026-10-06T09:00:00.000Z', end: '2026-10-06T10:30:00.000Z' },
  { id: 'event-2', summary: 'Thảo luận thiết kế UI/UX', start: '2026-10-06T14:00:00.000Z', end: '2026-10-06T15:30:00.000Z' },
  { id: 'event-3', summary: 'Kiểm thử & Review tính năng Calendar', start: '2026-10-07T10:00:00.000Z', end: '2026-10-07T11:30:00.000Z' },
  { id: 'event-4', summary: 'Gặp gỡ đối tác & Khách hàng', start: '2026-10-09T15:00:00.000Z', end: '2026-10-09T16:30:00.000Z' },
];

const AVAILABLE_PLATFORMS: PlatformModule[] = [
  {
    id: 'facebook',
    name: 'Facebook Page / Group',
    icon: '📘',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    description: 'Tự động đăng bài viết, hình ảnh & video lên Facebook Fanpage hoặc Nhóm',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn Profile & Company',
    icon: '💼',
    color: 'bg-sky-50 text-sky-800 border-sky-200',
    description: 'Phát hành bài viết chuyên nghiệp cho trang cá nhân hoặc tài khoản Doanh nghiệp',
  },
  {
    id: 'tiktok',
    name: 'TikTok Video & Article',
    icon: '🎵',
    color: 'bg-zinc-100 text-zinc-900 border-zinc-300',
    description: 'Đăng tải nội dung ngắn & caption đính kèm bài viết lên kênh TikTok',
  },
  {
    id: 'instagram',
    name: 'Instagram Feed & Reels',
    icon: '📸',
    color: 'bg-pink-50 text-pink-700 border-pink-200',
    description: 'Chia sẻ bài viết kèm bộ Hashtags tối ưu lên Instagram',
  },
  {
    id: 'x_twitter',
    name: 'X (Twitter) Thread',
    icon: '🐦',
    color: 'bg-zinc-50 text-zinc-800 border-zinc-200',
    description: 'Đăng bài viết ngắn hoặc các chuỗi bài viết (Thread) lên X',
  },
  {
    id: 'youtube',
    name: 'YouTube Community & Shorts',
    icon: '▶️',
    color: 'bg-red-50 text-red-700 border-red-200',
    description: 'Phát hành thông báo cộng đồng và mô tả video YouTube',
  },
  {
    id: 'website',
    name: 'Website / CMS Blog',
    icon: '🌐',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    description: 'Xuất bản bài viết trực tiếp lên hệ thống Website tin tức / CMS',
  },
  {
    id: 'medium',
    name: 'Medium Article',
    icon: '✍️',
    color: 'bg-amber-50 text-amber-800 border-amber-200',
    description: 'Đăng các bài viết phân tích chuyên sâu chuẩn SEO trên Medium',
  },
];

const INITIAL_POSTS: Post[] = [
  {
    id: 'post-1',
    title: 'Hướng dẫn tối ưu hóa hiệu năng ứng dụng React & NestJS 2026',
    content: 'Bài viết chia sẻ các kỹ thuật tối ưu hóa render trong React 19, kết hợp với Caching Redis & GraphQL Subscriptions trong NestJS giúp tăng tốc độ phản hồi gấp 3 lần...',
    platforms: ['facebook', 'linkedin', 'website'],
    status: 'published',
    createdAt: new Date().toLocaleDateString('vi-VN'),
    calendarEventIds: ['event-1', 'event-3'],
  },
  {
    id: 'post-2',
    title: 'Cập nhật tính năng mới: Module Đăng bài Đa nền tảng',
    content: 'Chúng tôi vừa chính thức phát hành công cụ giúp bạn tạo bài viết một lần và tự động đồng bộ xuất bản lên Facebook, LinkedIn, TikTok, X và Website chỉ với 1 cú click!',
    platforms: ['facebook', 'linkedin', 'tiktok', 'x_twitter'],
    status: 'draft',
    createdAt: new Date().toLocaleDateString('vi-VN'),
    calendarEventIds: ['event-2'],
  },
];

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [editingPost, setEditingPost] = useState<Post | null | undefined>();
  const [isPlatformModalOpen, setIsPlatformModalOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedCalendarEvents, setSelectedCalendarEvents] = useState<string[]>([]);
  const [status, setStatus] = useState<'draft' | 'scheduled' | 'published'>('draft');

  const openForm = (post?: Post | null) => {
    if (post) {
      setEditingPost(post);
      setTitle(post.title);
      setContent(post.content);
      setSelectedPlatforms(post.platforms);
      setSelectedCalendarEvents(post.calendarEventIds ?? []);
      setStatus(post.status);
    } else {
      setEditingPost(null);
      setTitle('');
      setContent('');
      setSelectedPlatforms(['facebook', 'linkedin']);
      setSelectedCalendarEvents([]);
      setStatus('draft');
    }
  };

  const closeForm = () => {
    setEditingPost(undefined);
  };

  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    if (editingPost) {
      setPosts((prev) =>
        prev.map((item) =>
          item.id === editingPost.id
            ? {
                ...item,
                title: title.trim(),
                content: content.trim(),
                platforms: selectedPlatforms,
                calendarEventIds: selectedCalendarEvents,
                status,
              }
            : item,
        ),
      );
    } else {
      const newPost: Post = {
        id: `post-${Date.now()}`,
        title: title.trim(),
        content: content.trim(),
        platforms: selectedPlatforms.length > 0 ? selectedPlatforms : ['facebook'],
        calendarEventIds: selectedCalendarEvents,
        status,
        createdAt: new Date().toLocaleDateString('vi-VN'),
      };
      setPosts((prev) => [newPost, ...prev]);
    }

    closeForm();
  };

  const handleDeletePost = (id: string) => {
    setPosts((prev) => prev.filter((item) => item.id !== id));
  };

  const togglePlatform = (id: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  return (
    <>
      {/* Header Trang Công Cụ / Đăng Bài */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2.5 text-xl font-bold text-foreground">
            Quản lý & Đăng bài viết <Sparkles className="size-5 text-blue-600" />
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Soạn thảo bài viết và tự động phát hành đồng thời trên các nền tảng mạng xã hội (Facebook, LinkedIn, TikTok, X...).
          </p>
        </div>
        <Button type="button" onClick={() => openForm(null)}>
          <Plus className="mr-1 size-4" /> Thêm bài viết mới
        </Button>
      </div>

      {/* POPUP MODAL TẠO / SỬA BÀI VIẾT */}
      {editingPost !== undefined && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={closeForm}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto space-y-4 rounded-lg border border-border bg-card p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <FileText className="size-5 text-blue-600" />
                {editingPost ? 'Chỉnh sửa bài viết' : 'Soạn bài viết mới'}
              </h2>
              <Button variant="ghost" size="sm" onClick={closeForm}>
                ✕
              </Button>
            </div>

            <form onSubmit={handleSavePost} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground" htmlFor="post-title">
                  Tiêu đề bài viết *
                </label>
                <Input
                  id="post-title"
                  required
                  autoFocus
                  placeholder="Nhập tiêu đề bài viết..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground" htmlFor="post-content">
                  Nội dung bài viết *
                </label>
                <Textarea
                  id="post-content"
                  rows={5}
                  required
                  placeholder="Nhập nội dung chi tiết bài viết..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                <p className="mt-1 text-xs text-muted-foreground text-right">
                  Độ dài: {content.length} ký tự
                </p>
              </div>

              {/* Chọn Nền Tảng Module */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <label className="text-sm font-medium text-foreground">
                    Nền tảng xuất bản (Module Nền tảng)
                  </label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs text-blue-600 border-blue-200 hover:bg-blue-50"
                    onClick={() => setIsPlatformModalOpen(true)}
                  >
                    <Plus className="mr-1 size-3.5" /> Thêm / Chọn Module nền tảng (Popup)
                  </Button>
                </div>

                {selectedPlatforms.length > 0 ? (
                  <div className="flex flex-wrap gap-2 p-3 rounded-md border border-border bg-muted/30">
                    {selectedPlatforms.map((platId) => {
                      const info = AVAILABLE_PLATFORMS.find((p) => p.id === platId);
                      if (!info) return null;
                      return (
                        <span
                          key={platId}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${info.color}`}
                        >
                          <span>{info.icon}</span>
                          <span>{info.name}</span>
                          <button
                            type="button"
                            className="ml-1 text-zinc-400 hover:text-red-500 font-bold"
                            onClick={() => togglePlatform(platId)}
                          >
                            ✕
                          </button>
                        </span>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-4 text-center rounded-md border border-dashed border-border text-xs text-muted-foreground">
                    Chưa chọn nền tảng nào. Bấm nút phía trên để chọn Facebook, LinkedIn, TikTok...
                  </div>
                )}
              </div>

              {/* Liên kết Sự kiện Lịch (N - N Relationship with Calendar) */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Liên kết Sự kiện Lịch (Liên kết N - N)
                </label>
                <div className="space-y-1.5 p-3 rounded-md border border-border bg-muted/20 max-h-36 overflow-y-auto">
                  {MOCK_CALENDAR_EVENTS.map((calEv) => {
                    const isChecked = selectedCalendarEvents.includes(calEv.id);
                    return (
                      <label
                        key={calEv.id}
                        className="flex items-center gap-2 text-xs text-foreground cursor-pointer hover:bg-muted p-1.5 rounded transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            setSelectedCalendarEvents((prev) =>
                              prev.includes(calEv.id)
                                ? prev.filter((id) => id !== calEv.id)
                                : [...prev, calEv.id],
                            );
                          }}
                          className="rounded border-input text-blue-600 focus:ring-blue-500"
                        />
                        <Calendar className="size-3.5 text-blue-600 shrink-0" />
                        <span className="font-medium truncate">{calEv.summary}</span>
                        <span className="text-muted-foreground text-[11px] ml-auto shrink-0">
                          {new Date(calEv.start).toLocaleDateString('vi-VN')}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Trạng thái bài viết */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground" htmlFor="post-status">
                  Trạng thái
                </label>
                <select
                  id="post-status"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'draft' | 'scheduled' | 'published')}
                >
                  <option value="draft">Bản nháp (Draft)</option>
                  <option value="published">Đã xuất bản (Published)</option>
                  <option value="scheduled">Lên lịch (Scheduled)</option>
                </select>
              </div>

              {/* Nút lưu */}
              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <Button type="button" variant="outline" onClick={closeForm}>
                  Hủy
                </Button>
                <Button type="submit">
                  <Send className="mr-1.5 size-4" />
                  {editingPost ? 'Cập nhật bài viết' : 'Lưu bài viết'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Danh sách bài viết đã có */}
      <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-foreground">Danh sách bài viết</h2>

        {posts.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-border rounded-lg text-muted-foreground">
            Chưa có bài viết nào. Bấm <strong>"Thêm bài viết mới"</strong> để bắt đầu soạn bài.
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="flex flex-col gap-3 rounded-lg border border-border p-4 hover:border-blue-200 transition-colors md:flex-row md:items-center md:justify-between"
              >
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-foreground">{post.title}</h3>
                    <span
                      className={`inline-block px-2 py-0.5 text-[11px] font-medium rounded-full ${
                        post.status === 'published'
                          ? 'bg-emerald-100 text-emerald-800'
                          : post.status === 'scheduled'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-zinc-100 text-zinc-600'
                      }`}
                    >
                      {post.status === 'published'
                        ? 'Đã đăng'
                        : post.status === 'scheduled'
                          ? 'Đã lên lịch'
                          : 'Bản nháp'}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{post.content}</p>

                  {/* Danh sách Platform badges & Linked Calendar Events */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {post.platforms.map((platId) => {
                      const info = AVAILABLE_PLATFORMS.find((p) => p.id === platId);
                      if (!info) return null;
                      return (
                        <span
                          key={platId}
                          className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-muted text-muted-foreground"
                        >
                          <span>{info.icon}</span>
                          <span>{info.name.split(' ')[0]}</span>
                        </span>
                      );
                    })}

                    {post.calendarEventIds && post.calendarEventIds.length > 0 && (
                      <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                        <Calendar className="size-3 text-blue-600" />
                        <span>{post.calendarEventIds.length} sự kiện lịch liên kết</span>
                      </span>
                    )}

                    <span className="text-[11px] text-muted-foreground ml-2">
                      • {post.createdAt}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => openForm(post)}
                  >
                    <Edit3 className="mr-1 size-3.5" /> Sửa
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => handleDeletePost(post.id)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* POPUP MODAL CHỌN MODULE NỀN TẢNG (Facebook, LinkedIn, TikTok, X...) */}
      {isPlatformModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setIsPlatformModalOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-xl space-y-4 rounded-lg border border-border bg-card p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Globe className="size-5 text-blue-600" /> Chọn Module Nền Tảng Mạng Xã Hội
                </h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Tích chọn các nền tảng mạng xã hội bạn muốn đồng bộ phát hành bài viết này.
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsPlatformModalOpen(false)}
              >
                ✕
              </Button>
            </div>

            {/* Grid Nền Tảng Mạng Xã Hội */}
            <div className="grid gap-3 max-h-80 overflow-y-auto p-1 sm:grid-cols-2">
              {AVAILABLE_PLATFORMS.map((platform) => {
                const isSelected = selectedPlatforms.includes(platform.id);
                return (
                  <div
                    key={platform.id}
                    onClick={() => togglePlatform(platform.id)}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/20 ring-1 ring-blue-600'
                        : 'border-border bg-background hover:border-zinc-400'
                    }`}
                  >
                    <div className="text-2xl shrink-0">{platform.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-foreground truncate">
                          {platform.name}
                        </h4>
                        {isSelected && <Check className="size-4 text-blue-600 shrink-0" />}
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                        {platform.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between border-t border-border pt-4">
              <span className="text-xs font-medium text-muted-foreground">
                Đã chọn: <strong className="text-blue-600">{selectedPlatforms.length}</strong> nền tảng
              </span>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsPlatformModalOpen(false)}
                >
                  Hủy
                </Button>
                <Button
                  type="button"
                  onClick={() => setIsPlatformModalOpen(false)}
                >
                  Xác nhận chọn Module
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
