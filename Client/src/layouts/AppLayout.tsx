import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { CalendarDays, LayoutDashboard, FileText, Menu, ChevronRight, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import GoogleAccount from '../components/GoogleAccount';
import { Button } from '../components/ui/button';
import { cn } from '../lib/utils';

const navigation = [
  { href: '#/admin', label: 'Tổng quan', icon: LayoutDashboard },
  { href: '#/admin/posts', label: 'Bài viết', icon: FileText },
  { href: '#/admin/calendar', label: 'Lịch', icon: CalendarDays },
];

export default function AppLayout({ route, children }: { route: string; children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  useEffect(() => setMenuOpen(false), [route]);
  const current = navigation.find((item) => item.href === route);
  return <div className="admin min-h-dvh bg-background text-sm text-foreground">
    <a className="fixed -top-24 left-4 z-50 rounded-md bg-card p-3 shadow focus:top-3" href="#admin-content" onClick={(event) => { event.preventDefault(); document.getElementById('admin-content')?.focus(); }}>Bỏ qua điều hướng</a>
    {menuOpen && <button type="button" className="!fixed inset-0 z-30 !rounded-none !bg-black/30 md:!hidden" aria-label="Đóng menu" onClick={() => setMenuOpen(false)} />}
    <aside id="admin-navigation" className={cn('fixed inset-y-0 left-0 z-40 flex flex-col border-r bg-card transition-all motion-reduce:transition-none md:translate-x-0', sidebarCollapsed ? 'w-16' : 'w-60', menuOpen ? 'translate-x-0' : '-translate-x-full')}>
      <div className="flex h-14 items-center border-b px-4">
        <a className="flex items-center gap-2.5 font-semibold overflow-hidden" href="#/admin">
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary text-lg text-primary-foreground">t.</span>
          {!sidebarCollapsed && <span className="text-base tracking-tight truncate">Tools workspace</span>}
        </a>
      </div>
      <div className="px-2 py-6">
        {!sidebarCollapsed && <p className="mb-3 px-3 text-xs font-medium text-muted-foreground">Quản lý workspace</p>}
        <nav aria-label="Điều hướng quản trị" className="space-y-1">
          {navigation.map((item) => <a key={item.href} href={item.href} aria-current={route === item.href ? 'page' : undefined} title={sidebarCollapsed ? item.label : undefined} className={cn('flex items-center gap-3 rounded-md px-3 py-2.5 transition-colors hover:bg-muted', route === item.href ? 'bg-accent font-medium text-accent-foreground' : 'text-zinc-600', sidebarCollapsed && 'justify-center px-0')}>
            <item.icon className="size-4 shrink-0" aria-hidden="true" />
            {!sidebarCollapsed && <span>{item.label}</span>}
          </a>)}
        </nav>
      </div>
    </aside>
    <div className={cn('min-w-0 transition-all', sidebarCollapsed ? 'md:ml-16' : 'md:ml-60')}>
      <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b bg-card px-4 md:px-6">
        <Button variant="ghost" size="icon-sm" className="md:hidden" aria-expanded={menuOpen} aria-controls="admin-navigation" aria-label="Mở menu" onClick={() => setMenuOpen(true)}>
          <Menu />
        </Button>
        <Button variant="ghost" size="icon-sm" className="hidden md:flex" aria-label={sidebarCollapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'} onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
          {sidebarCollapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
        </Button>
        <div className="flex items-center gap-2 text-sm">
          <a href="#/admin" className="text-muted-foreground hover:text-foreground">Workspace</a>
          <ChevronRight className="size-3 text-muted-foreground" />
          <span className="font-medium">{current?.label ?? 'Không tìm thấy trang'}</span>
        </div>
        <GoogleAccount />
      </header>
      <main id="admin-content" tabIndex={-1} className="mx-auto w-full max-w-[1600px] px-4 py-3 outline-none md:px-6">{children}</main>
    </div>
  </div>;
}
