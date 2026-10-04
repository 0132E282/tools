import { Info, MoreVertical } from 'lucide-react';
import { Fragment } from 'react';
import type { ReactNode } from 'react';
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuLabel,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from '@/components/ui/context-menu';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { FileItem } from '@/types';
import { BULK_ACTION_ITEMS, useItemActions } from './actions';
import type { BulkActions } from './actions';

export function ItemMenu({
    item,
    onMoveClick,
    onShareClick,
}: {
    item: FileItem;
    onMoveClick: () => void;
    onShareClick: () => void;
}) {
    const actions = useItemActions(item, onMoveClick, onShareClick);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    onClick={(e) => e.stopPropagation()}
                    className="text-muted-foreground hover:text-foreground rounded-full p-1"
                >
                    <MoreVertical className="size-3.5" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {actions.map((action) => (
                    <DropdownMenuItem
                        key={action.key}
                        onClick={action.onClick}
                        variant={action.destructive ? 'destructive' : 'default'}
                    >
                        <action.icon className="size-4" />
                        {action.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export function BulkMenuItems({ bulk }: { bulk: BulkActions }) {
    return (
        <>
            <ContextMenuLabel className="text-muted-foreground flex items-center gap-2">
                <Info className="size-4" />
                {bulk.count} mục đã chọn
            </ContextMenuLabel>
            {BULK_ACTION_ITEMS.map((action) => (
                <Fragment key={action.key}>
                    {action.separatorBefore && <ContextMenuSeparator />}
                    <ContextMenuItem
                        onClick={() => action.onClick(bulk)}
                        variant={action.destructive ? 'destructive' : 'default'}
                    >
                        <action.icon className="size-4" />
                        {action.label}
                    </ContextMenuItem>
                </Fragment>
            ))}
        </>
    );
}

export function ItemContextMenu({
    item,
    onMoveClick,
    onShareClick,
    bulk,
    children,
}: {
    item: FileItem;
    onMoveClick: () => void;
    onShareClick: () => void;
    bulk?: BulkActions;
    children: ReactNode;
}) {
    const actions = useItemActions(item, onMoveClick, onShareClick);

    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
            <ContextMenuContent>
                {bulk ? (
                    <BulkMenuItems bulk={bulk} />
                ) : (
                    actions.map((action) => (
                        <ContextMenuItem
                            key={action.key}
                            onClick={action.onClick}
                            variant={
                                action.destructive ? 'destructive' : 'default'
                            }
                        >
                            <action.icon className="size-4" />
                            {action.label}
                        </ContextMenuItem>
                    ))
                )}
            </ContextMenuContent>
        </ContextMenu>
    );
}
