import { Head, Link } from '@inertiajs/react';
import { ArrowUpRight, Files, ShieldCheck, Users } from 'lucide-react';

interface DashboardProps {
    stats: {
        admins: number;
        roles: number;
        files: number;
    };
}

const sections = [
    {
        key: 'admins',
        label: 'Quản trị viên',
        href: '/admins',
        icon: Users,
    },
    {
        key: 'roles',
        label: 'Vai trò & phân quyền',
        href: '/roles',
        icon: ShieldCheck,
    },
    {
        key: 'files',
        label: 'Thư viện tệp',
        href: '/file-manager',
        icon: Files,
    },
] as const;

export default function Dashboard({ stats }: DashboardProps) {
    return (
        <div className="flex w-full flex-1 flex-col gap-8 p-4 md:p-6">
            <Head title="Tổng quan" />
            <section
                aria-label="Số liệu tổng quan"
                className="grid divide-y overflow-hidden rounded-lg border bg-card sm:grid-cols-3 sm:divide-x sm:divide-y-0"
            >
                {sections.map(({ key, label, href, icon: Icon }) => (
                    <Link
                        key={key}
                        href={href}
                        className="group flex flex-col gap-5 p-6 transition-colors hover:bg-muted/50 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring"
                    >
                        <div className="flex items-center justify-between gap-3">
                            <span className="text-sm font-medium text-muted-foreground">
                                {label}
                            </span>
                            <Icon
                                aria-hidden="true"
                                className="size-4 text-muted-foreground"
                            />
                        </div>
                        <div className="flex items-end justify-between">
                            <span className="text-4xl font-semibold tracking-tight tabular-nums">
                                {stats[key].toLocaleString('vi-VN')}
                            </span>
                            <ArrowUpRight
                                aria-hidden="true"
                                className="size-4 text-muted-foreground group-hover:text-foreground"
                            />
                        </div>
                    </Link>
                ))}
            </section>
        </div>
    );
}
