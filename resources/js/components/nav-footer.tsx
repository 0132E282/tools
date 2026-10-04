import { Link, usePage } from '@inertiajs/react';
import type * as React from 'react';

import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';

type NavFooterItem = {
    title: string;
    url: string;
    icon?: React.ComponentType<{ className?: string }>;
};

export function NavFooter({ items }: { items: NavFooterItem[] }) {
    const { url: currentUrl } = usePage();

    const currentPath = new URL(currentUrl, 'http://localhost').pathname;
    const matchesUrl = (url: string) =>
        currentPath === url ||
        (url !== '/' && currentPath.startsWith(`${url}/`));

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                className="h-9 px-3 py-0"
                                asChild
                                tooltip={item.title}
                                isActive={matchesUrl(item.url)}
                            >
                                <Link
                                    href={item.url}
                                    aria-current={
                                        matchesUrl(item.url)
                                            ? 'page'
                                            : undefined
                                    }
                                >
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
