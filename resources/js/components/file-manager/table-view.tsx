import { Link } from '@inertiajs/react';
import { CheckSquare, Folder, Share2, Square } from 'lucide-react';
import { FileViewer } from '@/components/file-viewer';
import type { FileItem } from '@/types';
import type { BulkActions } from './actions';
import { formatDate, formatSize, thumbnailUrl } from './format';
import { ItemContextMenu, ItemMenu } from './item-menu';

export function TableView({
    folders,
    files,
    selectable,
    selectedIds,
    bulk,
    onToggleSelect,
    onMoveClick,
    onShareClick,
    registerRef,
}: {
    folders: FileItem[];
    files: FileItem[];
    selectable: boolean;
    selectedIds: number[];
    bulk?: BulkActions;
    onToggleSelect: (id: number) => void;
    onMoveClick: (id: number) => void;
    onShareClick: (id: number) => void;
    registerRef: (id: number, el: HTMLElement | null) => void;
}) {
    const rows = [...folders, ...files];

    return (
        <div className="border-input overflow-x-auto rounded-md border">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-input bg-muted/30 text-muted-foreground border-b text-left text-xs">
                        <th className="w-8 px-3 py-2" />
                        <th className="px-3 py-2 font-medium">Tên</th>
                        <th className="px-3 py-2 font-medium">Loại</th>
                        <th className="px-3 py-2 font-medium">Dung lượng</th>
                        <th className="px-3 py-2 font-medium">Ngày tạo</th>
                        <th className="w-10 px-3 py-2" />
                    </tr>
                </thead>
                <tbody>
                    {rows.map((item) => {
                        const selected = selectedIds.includes(item.id);
                        const isFolder = item.type === 'folder';

                        return (
                            <ItemContextMenu
                                key={item.id}
                                item={item}
                                onMoveClick={() => onMoveClick(item.id)}
                                onShareClick={() => onShareClick(item.id)}
                                bulk={selected ? bulk : undefined}
                            >
                                <tr
                                    ref={(el) => registerRef(item.id, el)}
                                    data-selectable-id={item.id}
                                    className="border-input hover:bg-muted/40 border-b last:border-0"
                                >
                                    <td className="px-3 py-2">
                                        {selectable && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onToggleSelect(item.id)
                                                }
                                                className="text-foreground"
                                            >
                                                {selected ? (
                                                    <CheckSquare className="size-4" />
                                                ) : (
                                                    <Square className="size-4" />
                                                )}
                                            </button>
                                        )}
                                    </td>
                                    <td className="px-3 py-2">
                                        {isFolder ? (
                                            <Link
                                                href={`/file-manager?folder=${item.id}`}
                                                preserveState={false}
                                                className="hover:text-foreground flex items-center gap-2"
                                            >
                                                <Folder className="text-muted-foreground size-4 shrink-0" />
                                                <span className="truncate">
                                                    {item.name}
                                                </span>
                                                {item.shared && (
                                                    <span title="Đã chia sẻ">
                                                        <Share2 className="text-muted-foreground size-3.5 shrink-0" />
                                                    </span>
                                                )}
                                            </Link>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <div className="bg-muted/30 size-8 shrink-0 overflow-hidden rounded">
                                                    <FileViewer
                                                        file={{
                                                            url: thumbnailUrl(
                                                                item,
                                                            ),
                                                            name:
                                                                item.original_name ??
                                                                item.name,
                                                            alt:
                                                                item.alt ??
                                                                undefined,
                                                        }}
                                                        className="size-full"
                                                    />
                                                </div>
                                                <span
                                                    className="truncate"
                                                    title={item.name}
                                                >
                                                    {item.name}
                                                </span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="text-muted-foreground px-3 py-2">
                                        {isFolder
                                            ? 'Thư mục'
                                            : (item.extension ?? '—')}
                                    </td>
                                    <td className="text-muted-foreground px-3 py-2">
                                        {isFolder ? '—' : formatSize(item.size)}
                                    </td>
                                    <td className="text-muted-foreground px-3 py-2">
                                        {formatDate(item.created_at)}
                                    </td>
                                    <td className="px-3 py-2">
                                        <ItemMenu
                                            item={item}
                                            onMoveClick={() =>
                                                onMoveClick(item.id)
                                            }
                                            onShareClick={() =>
                                                onShareClick(item.id)
                                            }
                                        />
                                    </td>
                                </tr>
                            </ItemContextMenu>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
