# Requirement Analysis — Tăng font-weight chữ menu sidebar lên 500

## 1. Context đã tóm tắt

- **Nguyên văn**: "front-weidthj tnag lên đậm 500", hiểu là "font-weight tăng lên đậm 500" (Tailwind: `font-medium`).
- **Mạch hội thoại**: các lượt trước đang chỉnh sidebar admin (`nav-main.tsx`, `nav-footer.tsx`), vừa đồng bộ padding (`SidebarGroup` dùng `px-2`, nút dùng `px-3`).
- **Còn mơ hồ**: yêu cầu không nói rõ áp dụng cho phần tử nào. Tab `README.md` đang mở trong IDE coi như không liên quan.

## 2. Phân tích

### Mục đích (why)

Có thể người dùng muốn chữ trong menu sidebar đậm hơn, dễ đọc hơn. Hiện mục thường chỉ ở weight 400 và chỉ đậm 500 khi active. Đây là **giả định** suy từ mạch hội thoại, chưa được người dùng xác nhận.

### Trạng thái hiện tại (đã xác minh trong code)

- `resources/js/components/ui/sidebar.tsx:491` (`sidebarMenuButtonVariants`): class nền không set weight, nên mặc định là 400. Chỉ có `data-[active=true]:font-medium`.
- `resources/js/components/ui/sidebar.tsx:709-710` (`SidebarMenuSubButton`): class nền không set weight, chỉ có `data-[active=true]:font-medium`.
- `resources/js/components/nav-main.tsx:96`, `:125` và `nav-footer.tsx:33`: `className="h-9 px-3 py-0"`, không có font-weight. `nav-main.tsx:141`: `className="px-3"`, cũng không có.
- Các phần đã ở mức 500 trở lên: `SidebarGroupLabel` (`sidebar.tsx:422` `font-medium`), badge (`sidebar.tsx:606`), `nav-user.tsx:57,85` (`font-medium`), tên app ở `app-sidebar.tsx:71,75` (`font-semibold`).

### Cần làm gì (what), bản nháp

- REQ-001: các mục menu sidebar không active hiển thị với weight 500 (`font-medium`). Phạm vi chính xác còn chờ người dùng xác nhận.

### Ở đâu (where), các ứng viên

| #   | Phần tử                                              | Vị trí sửa đề xuất                                                                                                                                           |
| --- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| A   | Mục cấp 1 ở menu chính (Dashboard, nhóm collapsible) | `nav-main.tsx:96`, `:125` thêm `font-medium`                                                                                                                 |
| B   | Mục con (sub-item)                                   | `nav-main.tsx:141` thêm `font-medium`                                                                                                                        |
| C   | Mục footer (File Manager, Hệ thống)                  | `nav-footer.tsx:33` thêm `font-medium`                                                                                                                       |
| D   | Toàn bộ sidebar (cách khác)                          | Sửa base class ở `ui/sidebar.tsx:491` và `:709`. Lưu ý: file shadcn `components/ui/*` không bị lint, và sửa ở đây ảnh hưởng mọi nơi dùng `SidebarMenuButton` |

### Câu hỏi mở

1. Áp dụng cho phần nào: chỉ mục cấp 1, cả mục con, cả footer, hay toàn bộ sidebar?
2. Có phải là phần tử khác ngoài sidebar không (header, bảng, form)?
3. Sửa ở nơi dùng (`nav-*.tsx`, giữ nguyên file shadcn) hay sửa base trong `ui/sidebar.tsx`?
4. Khi mọi mục đã là 500, mục active có cần đậm hơn nữa (`font-semibold`) để vẫn phân biệt được không? Hiện active chỉ khác nhờ nền và màu `text-primary`.

## 3. Phân loại

**Fix/thay đổi nhỏ**: chỉ thêm một class Tailwind vào 1–4 dòng, không đổi kiến trúc, dữ liệu hay API. Không cần `system-design`/`planner`. Sau khi người dùng chốt phạm vi, giao thẳng `coding-agent` rồi `reviewer`, kiểm chứng bằng `pnpm run check` và `pnpm run types:check`.
