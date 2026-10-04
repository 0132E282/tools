# Thiết kế lại giao diện admin

## Mục tiêu và nguồn tham chiếu

Giao diện đơn giản, dễ đọc, ưu tiên thao tác quản trị. Tham khảo agent `.claude/agents/ux-ui-designer.md`, `.claude/agents/coding-agent.md` và skill `minimalist-ui`, `redesign-existing-projects`, `coding-frontend`. Không có mẫu Figma được cung cấp; thiết kế dựa trên component và luồng hiện có của Lumina CMS.

## Hướng thiết kế đã triển khai

- Bo góc các khối và control thống nhất 2px; giữ avatar, badge dạng pill và chấm trạng thái tròn.
- Nền trung tính ấm, bề mặt nội dung sáng, đường viền nhẹ; giữ font Instrument Sans và hệ icon đang dùng. Không thêm thư viện, ảnh trang trí hoặc hiệu ứng chuyển động khi cuộn.
- Sidebar rộng 240px trên desktop; menu chính ở phía trên; File Manager và Hệ thống nằm dưới, ngay trên tài khoản. Bỏ padding ngoài container/menu để nền hover phủ hết chiều rộng; giữ padding ngang 12px bên trong mục menu, tìm kiếm có nhãn, nhóm menu thu gọn khi không chứa trang hiện tại. Tìm kiếm áp dụng cho toàn bộ menu. Mục đang mở dùng nền trung tính và chữ đậm, hover nhẹ. Menu mở khi tìm kiếm hoặc chứa trang đang truy cập; URL gốc chỉ active tại dashboard. Kết quả tìm kiếm rỗng có thông báo.
- Header nền card, các hành động tự xuống dòng khi thiếu chỗ; giữ cơ chế header action, locale và thao tác file manager.
- Dashboard bỏ khối heading và mô tả trong nội dung, hiển thị trực tiếp số liệu thật từ prop `stats`, các card số liệu có liên kết quản trị viên/vai trò/tệp; bỏ toàn bộ mục “Quản lý nhanh” và liên kết cấu hình hệ thống bên trong dashboard. Không tạo số liệu hoặc trạng thái hệ thống giả.
- Trang hệ thống dùng grid shortcut 3 cột trên desktop, 2 cột trên tablet và 1 cột trên mobile, padding 16px và icon 32px. Khu vực cần xác nhận mật khẩu có biểu tượng khóa; giữ luồng xác nhận hiện tại.
- Bảng dùng bề mặt card, header nền muted, padding và chiều cao dòng nhất quán. Giữ tìm kiếm, lọc, kéo cột, lựa chọn, phân trang và các hành động hiện có.
- Form dùng cùng card/input/button; tăng khoảng cách nội dung trên desktop và cho cột co lại trên mobile. Giữ schema, validation, submit và preview.
- Có link bỏ qua điều hướng, nhãn tìm kiếm, `aria-current` cho menu và focus bàn phím. Card phẳng; button dùng chuyển màu và tôn trọng reduced motion.

## Kiểm chứng và giới hạn

- Build frontend thành công.
- Type checker toàn repo đang báo lỗi tại `app.tsx`, `use-app-form.ts` và các trang auth, nằm ngoài các file logic đã sửa trong redesign này.
- Lint bảng/form dùng chung báo ba cảnh báo ở logic có sẵn: biểu thức pagination, chuyển recordLabel thành chuỗi và promise tải badge chưa xử lý lỗi.
- Đã đăng nhập bằng tài khoản kiểm thử người dùng cung cấp và mở dashboard, hệ thống, quản trị viên, form tạo quản trị viên, vai trò và file manager trong Chrome local. Kiểm tra ở 1440px và 390px: không tràn ngang toàn trang, không có lỗi JavaScript. Đã kiểm tra trạng thái tìm kiếm menu không có kết quả.
- Ảnh kiểm chứng nằm trong `output/playwright/`. Chưa thử lưu/xóa/upload hoặc thay đổi quyền; kiểm thử giao diện không tạo hay xóa bản ghi nghiệp vụ.
- Lint/format tám file điều hướng, layout, toolbar và trang dashboard/hệ thống đã pass; `git diff --check` pass.
