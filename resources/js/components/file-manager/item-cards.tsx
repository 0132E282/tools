import { Link } from '@inertiajs/react';
import { CheckSquare, Folder, Share2, Square } from 'lucide-react';
import { FileViewer } from '@/components/file-viewer';
import { cn } from '@/lib/utils';
import type { FileItem } from '@/types';
import type { BulkActions } from './actions';
import { formatDate, formatSize, thumbnailUrl } from './format';
import { ItemContextMenu, ItemMenu } from './item-menu';

type ItemCardProps = {
    item: FileItem;
    selectable: boolean;
    selected: boolean;
    bulk?: BulkActions;
    onToggleSelect: () => void;
    onMoveClick: () => void;
    onShareClick: () => void;
    registerRef: (id: number, el: HTMLElement | null) => void;
    /** * Picker mode: clicking the thumbnail toggles selection instead of opening the menu. */
    onPick?: () => void;
    picked?: boolean;
    /** * Query string kept on folder links while embedded, e.g. `&picker=1&multiple=1`. */
    pickerQuery?: string;
};

export function FolderRow({
    item,
    selectable,
    selected,
    bulk,
    onToggleSelect,
    onMoveClick,
    onShareClick,
    registerRef,
    pickerQuery,
}: ItemCardProps) {
    const href = `/file-manager?folder=${item.id}${pickerQuery ?? ''}`;

    return (
        <ItemContextMenu
            item={item}
            onMoveClick={onMoveClick}
            onShareClick={onShareClick}
            bulk={selected ? bulk : undefined}
        >
            <div
                ref={(el) => registerRef(item.id, el)}
                data-selectable-id={item.id}
                className="border-input bg-muted/30 hover:border-primary hover:bg-muted group flex items-center gap-2 rounded-md border px-3 py-2.5 transition-colors"
            >
                {selectable && (
                    <button
                        type="button"
                        onClick={onToggleSelect}
                        className="text-foreground shrink-0"
                    >
                        {selected ? (
                            <CheckSquare className="size-4" />
                        ) : (
                            <Square className="size-4" />
                        )}
                    </button>
                )}
                <Link
                    href={href}
                    preserveState={false}
                    className="flex flex-1 items-center gap-2 overflow-hidden"
                >
                    <Folder className="text-muted-foreground size-4 shrink-0" />
                    <span className="flex-1 truncate text-sm">{item.name}</span>
                    {item.shared && (
                        <span title="Đã chia sẻ">
                            <Share2 className="text-muted-foreground size-3.5 shrink-0" />
                        </span>
                    )}
                </Link>
                <ItemMenu
                    item={item}
                    onMoveClick={onMoveClick}
                    onShareClick={onShareClick}
                />
            </div>
        </ItemContextMenu>
    );
}

export function FileCard({
    item,
    selectable,
    selected,
    bulk,
    onToggleSelect,
    onMoveClick,
    onShareClick,
    registerRef,
    onPick,
    picked,
}: ItemCardProps) {
    const card = (
        <div
            ref={(el) => registerRef(item.id, el)}
            data-selectable-id={item.id}
            className={cn(
                'border-input group relative flex flex-col gap-2 rounded-md border p-2 transition-colors',
                onPick &&
                    !picked &&
                    'has-[button:hover]:border-primary has-[button:focus-visible]:border-primary has-[button:active]:bg-accent',
                picked && 'border-primary ring-primary ring-2',
            )}
        >
            <div className="bg-muted/30 relative aspect-square overflow-hidden rounded-md">
                {selectable && (
                    <button
                        type="button"
                        onClick={onToggleSelect}
                        className="bg-background/90 text-foreground absolute left-1 top-1 z-10 rounded p-0.5 shadow-sm"
                    >
                        {selected ? (
                            <CheckSquare className="size-4" />
                        ) : (
                            <Square className="size-4" />
                        )}
                    </button>
                )}
                {onPick ? (
                    <button
                        type="button"
                        onClick={onPick}
                        className="focus-visible:ring-primary size-full cursor-pointer outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 active:opacity-75"
                    >
                        <FileViewer
                            file={{
                                url: thumbnailUrl(item),
                                name: item.original_name ?? item.name,
                                alt: item.alt ?? undefined,
                            }}
                            className="size-full"
                        />
                    </button>
                ) : (
                    <FileViewer
                        file={{
                            url: thumbnailUrl(item),
                            name: item.original_name ?? item.name,
                            alt: item.alt ?? undefined,
                        }}
                        className="size-full"
                    />
                )}
                {picked && (
                    <span className="bg-primary text-primary-foreground absolute right-1 top-1 z-10 rounded-full p-0.5 shadow-sm">
                        <CheckSquare className="size-4" />
                    </span>
                )}
                <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[0.65rem] text-white">
                    {formatDate(item.created_at)}
                </span>
            </div>

            {!onPick && (
                <div className="bg-background/90 absolute right-1 top-1 rounded-full shadow-sm">
                    <ItemMenu
                        item={item}
                        onMoveClick={onMoveClick}
                        onShareClick={onShareClick}
                    />
                </div>
            )}

            <div className="space-y-0.5">
                <p className="truncate text-xs font-medium" title={item.name}>
                    {item.name}
                </p>
                <p className="text-muted-foreground text-[0.7rem]">
                    {formatSize(item.size)}
                </p>
            </div>
        </div>
    );

    if (onPick) {
        return card;
    }

    return (
        <ItemContextMenu
            item={item}
            onMoveClick={onMoveClick}
            onShareClick={onShareClick}
            bulk={selected ? bulk : undefined}
        >
            {card}
        </ItemContextMenu>
    );
}
