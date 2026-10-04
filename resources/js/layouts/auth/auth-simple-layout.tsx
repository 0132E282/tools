import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({ children }: AuthLayoutProps) {
    return <div className="bg-background min-h-svh w-full">{children}</div>;
}
