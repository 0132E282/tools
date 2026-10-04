import { Link, usePage } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import type * as React from 'react';

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';

type NavItem = {
    title: string;
    url: string;
    icon?: React.ComponentType<{ className?: string }>;
    isActive?: boolean;
    items?: { title: string; url: string }[];
};

function filterNavItems(items: NavItem[], query: string): NavItem[] {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
        return items;
    }

    return items.reduce<NavItem[]>((matches, item) => {
        if (item.title.toLowerCase().includes(normalized)) {
            matches.push(item);

            return matches;
        }

        const matchingSubItems = item.items?.filter((sub) =>
            sub.title.toLowerCase().includes(normalized),
        );

        if (matchingSubItems?.length) {
            matches.push({ ...item, items: matchingSubItems });
        }

        return matches;
    }, []);
}

export function NavMain({
    items,
    search,
}: {
    items: NavItem[];
    search?: string;
}) {
    const { url: currentUrl } = usePage();
    const currentPath = new URL(currentUrl, 'http://localhost').pathname;
    const matchesUrl = (url: string) =>
        url !== '#' &&
        (currentPath === url ||
            (url !== '/' && currentPath.startsWith(`${url}/`)));
    const isSearching = !!search?.trim();
    const filteredItems = isSearching
        ? filterNavItems(items, search ?? '')
        : items;

    return (
        <SidebarGroup className="px-2 py-1">
            <SidebarGroupContent className="flex flex-col gap-2">
                <SidebarMenu>
                    {filteredItems.length === 0 && (
                        <p
                            role="status"
                            className="px-2 py-4 text-sm text-muted-foreground"
                        >
                            Không tìm thấy mục phù hợp.
                        </p>
                    )}
                    {filteredItems.map((item) => {
                        const hasSubItems = !!item.items?.length;
                        const isChildActive = item.items?.some((sub) =>
                            matchesUrl(sub.url),
                        );
                        const isActive = matchesUrl(item.url);

                        if (!hasSubItems) {
                            return (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        className="h-9 px-3 py-0"
                                        asChild
                                        tooltip={item.title}
                                        isActive={isActive}
                                    >
                                        <Link
                                            href={item.url}
                                            aria-current={
                                                isActive ? 'page' : undefined
                                            }
                                        >
                                            {item.icon && <item.icon />}
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        }

                        return (
                            <Collapsible
                                key={`${item.title}-${isSearching}-${Boolean(isChildActive)}`}
                                asChild
                                defaultOpen={isChildActive || isSearching}
                                className="group/collapsible"
                            >
                                <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton
                                            className="h-9 px-3 py-0"
                                            tooltip={item.title}
                                            isActive={isChildActive}
                                        >
                                            {item.icon && <item.icon />}
                                            <span>{item.title}</span>
                                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {item.items?.map((subItem) => (
                                                <SidebarMenuSubItem
                                                    key={subItem.title}
                                                >
                                                    <SidebarMenuSubButton
                                                        className="px-3"
                                                        asChild
                                                        isActive={matchesUrl(
                                                            subItem.url,
                                                        )}
                                                    >
                                                        <Link
                                                            href={subItem.url}
                                                            aria-current={
                                                                matchesUrl(
                                                                    subItem.url,
                                                                )
                                                                    ? 'page'
                                                                    : undefined
                                                            }
                                                        >
                                                            <span>
                                                                {subItem.title}
                                                            </span>
                                                        </Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </SidebarMenuItem>
                            </Collapsible>
                        );
                    })}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
