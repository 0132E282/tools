import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import Heading from '@/components/heading';
import { Separator } from '@/components/ui/separator';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn } from '@/lib/utils';
import type { NavItem } from '@/types';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Chung',
        href: '/settings/general',
    },
    {
        title: 'SMTP',
        href: '/settings/smtp',
    },
    {
        title: 'Google Search Console',
        href: '/settings/search-console',
    },
];

export default function SystemSettingsLayout({ children }: PropsWithChildren) {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <div className="px-4 py-6">
            <Heading
                title="Cấu hình hệ thống"
                description="Tên website, logo, favicon và cấu hình gửi email."
            />

            <div className="flex flex-col space-y-8 md:space-y-0 lg:flex-row lg:space-x-12 lg:space-y-0">
                <aside className="w-full max-w-xl lg:w-48">
                    <nav className="flex flex-col space-x-0 space-y-1">
                        {sidebarNavItems.map((item, index) => (
                            <Link
                                key={`${item.href}-${index}`}
                                href={item.href}
                                prefetch
                                className={cn(
                                    'hover:bg-muted w-full justify-start rounded-md px-3 py-2 text-sm font-medium transition-colors',
                                    {
                                        'bg-muted': isCurrentUrl(item.href),
                                    },
                                )}
                            >
                                {item.title}
                            </Link>
                        ))}
                    </nav>
                </aside>

                <Separator className="my-6 md:hidden" />

                <div className="flex-1 lg:max-w-4xl">
                    <section className="w-full space-y-12">{children}</section>
                </div>
            </div>
        </div>
    );
}
