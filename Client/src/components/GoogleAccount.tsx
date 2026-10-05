import { useEffect, useState, useRef } from 'react';
import { status, logout } from '../api/calendar';
import { Button } from './ui/button';
import { Bell, MoreVertical, LogOut, User } from 'lucide-react';
import type { CalendarStatus } from '../types/calendar';

export default function GoogleAccount() {
  const [account, setAccount] = useState<CalendarStatus>();
  const [pending, setPending] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hasNoti, setHasNoti] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    status(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setAccount(data);
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function signOut() {
    if (!account?.csrf || pending) return;
    setPending(true);
    try {
      await logout(account.csrf);
      window.location.assign('/');
    } catch {
      setPending(false);
    }
  }

  return (
    <div className="ml-auto flex items-center gap-2">
      {/* Nút thông báo Noti */}
      <div className="relative">
        <Button
          variant="ghost"
          size="icon-sm"
          className="relative text-muted-foreground hover:text-foreground"
          aria-label="Thông báo"
          onClick={() => setHasNoti(false)}
        >
          <Bell className="size-4.5" />
          {hasNoti && (
            <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-red-500 ring-2 ring-background" />
          )}
        </Button>
      </div>

      {/* User photo / avatar */}
      <div className="flex items-center gap-2 pl-1 border-l">
        <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs border border-primary/20 overflow-hidden">
          <User className="size-4" />
        </div>

        {/* Nút 3 chấm menu */}
        <div className="relative" ref={menuRef}>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Tùy chọn tài khoản"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <MoreVertical className="size-4 text-muted-foreground" />
          </Button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-44 rounded-md border border-border bg-card p-1 shadow-md z-50 animate-in fade-in-50 zoom-in-95">
              {account?.connected ? (
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => void signOut()}
                  className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-xs text-red-600 hover:bg-muted font-medium transition-colors disabled:opacity-50"
                >
                  <LogOut className="size-3.5" />
                  {pending ? 'Đang đăng xuất…' : 'Đăng xuất'}
                </button>
              ) : (
                <a
                  href="#/"
                  className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-xs text-foreground hover:bg-muted font-medium transition-colors"
                >
                  Đăng nhập Google
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
