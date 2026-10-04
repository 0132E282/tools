'use client';

import { usePage } from '@inertiajs/react';
import { Search } from 'lucide-react';
import * as React from 'react';

import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Input } from '@/components/ui/input';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from '@/components/ui/sidebar';
import { useSidebarFullyHidden } from '@/contexts/sidebar-collapse-context';
import { ICON_MAP } from '@/lib/icon-map';
import type { NavigationConfig } from '@/lib/navigation';
import type { Auth } from '@/types';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { auth, setting, navigation } = usePage<{
        auth: Auth;
        setting?: { site_name?: string; logo_url?: string };
        navigation: NavigationConfig;
    }>().props;
    const [search, setSearch] = React.useState('');
    const [fullyHidden] = useSidebarFullyHidden();

    // * `icon` comes from PHP config as a lucide-react export name and is resolved to the component here.
    const navMain = React.useMemo(
        () =>
            navigation.main.map((item) => ({
                ...item,
                icon: item.icon ? ICON_MAP[item.icon] : undefined,
            })),
        [navigation.main],
    );
    const navFooter = React.useMemo(
        () =>
            navigation.footer.map((item) => ({
                ...item,
                icon: item.icon ? ICON_MAP[item.icon] : undefined,
            })),
        [navigation.footer],
    );
    const isSearching = Boolean(search.trim());

    const user = {
        name: auth?.user?.name || 'System Admin',
        email: auth?.user?.email || 'admin@example.com',
        avatar: auth?.user?.avatar || '',
    };

    const siteName = setting?.site_name || 'CMS';
    const logoUrl = setting?.logo_url;

    return (
        <Sidebar collapsible={fullyHidden ? 'offcanvas' : 'icon'} {...props}>
            <SidebarHeader className="flex flex-row items-center justify-between gap-3 px-2 py-3">
                <div className="flex min-w-0 items-center gap-2">
                    {logoUrl ? (
                        <img
                            src={logoUrl}
                            alt={siteName}
                            className="size-6 shrink-0 rounded object-contain"
                        />
                    ) : (
                        <div className="flex size-6 shrink-0 items-center justify-center rounded bg-primary text-xs font-semibold text-primary-foreground">
                            {siteName.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <span className="truncate text-sm font-semibold group-data-[collapsible=icon]:hidden">
                        {siteName}
                    </span>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <div className="px-1 py-1 group-data-[collapsible=icon]:hidden">
                    <div className="relative">
                        <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            aria-label="Tìm trong menu"
                            placeholder="Tìm trong menu..."
                            className="h-9 rounded-md border-transparent bg-background pl-8 shadow-none"
                        />
                    </div>
                </div>
                <NavMain
                    items={isSearching ? [...navMain, ...navFooter] : navMain}
                    search={search}
                />
            </SidebarContent>
            <SidebarFooter className="border-t border-sidebar-border p-0 py-2">
                {!isSearching && <NavFooter items={navFooter} />}
                <div className="px-2">
                    <NavUser user={user} />
                </div>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
