import * as React from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { HeaderActionsProvider } from '@/contexts/header-actions';
import { LocaleProvider } from '@/contexts/locale-context';
import { SidebarFullyHiddenContext } from '@/contexts/sidebar-collapse-context';

export default function Page({ children }: { children: React.ReactNode }) {
    const fullyHiddenState = React.useState(false);

    return (
        <LocaleProvider>
            <HeaderActionsProvider>
                <SidebarFullyHiddenContext.Provider value={fullyHiddenState}>
                    <SidebarProvider
                        style={
                            {
                                '--sidebar-width': 'calc(var(--spacing) * 60)',
                                '--header-height': 'calc(var(--spacing) * 14)',
                            } as React.CSSProperties
                        }
                    >
                        <a
                            href="#admin-content"
                            className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
                        >
                            Đi đến nội dung
                        </a>
                        <AppSidebar variant="sidebar" />
                        <SidebarInset
                            id="admin-content"
                            tabIndex={-1}
                            className="overflow-hidden border border-border shadow-none outline-none"
                        >
                            <SiteHeader />
                            <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto outline-none">
                                {children}
                            </div>
                        </SidebarInset>
                    </SidebarProvider>
                </SidebarFullyHiddenContext.Provider>
            </HeaderActionsProvider>
        </LocaleProvider>
    );
}
