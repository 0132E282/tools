# Tools

Dự án Tools dùng template Laravel Lumina CMS từ `../lumina-cms`.
Bản NestJS trước khi chuyển đổi được lưu riêng trong `../tools-nestjs-backup-20261004-225516`; repository Git của Tools được giữ nguyên.

## Chạy Tools local

```bash
cd /Users/hoangphuc01975/Documents/developers/tools
php84 artisan serve --host=127.0.0.1 --port=8000
```

Mở `http://localhost:8000`. Admin mặc định: `admin@admin.com` / `admin@admin.com`.
Máy hiện tại có `php84`; PHP mặc định của Composer đang là 8.3. Khi chạy Composer, dùng `php84 /opt/homebrew/bin/composer <lệnh>`. Trên máy khác, chọn PHP >= 8.4.1 trước khi chạy các lệnh bên dưới.

Dự án dùng `.env`, APP_KEY và SQLite riêng tại `database/database.sqlite`.
Các dependency đã được cài và frontend đã build. Để cài trên máy mới:

```bash
composer install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate --seed
php artisan storage:link
pnpm install --frozen-lockfile
pnpm run build
```

## Deploy Laravel lên Vercel

`vercel.json` dùng community runtime `vercel-php@0.9.0` (PHP 8.5, Node 22), entrypoint `api/index.php`. Theo [tài liệu runtime](https://github.com/vercel-community/php), runtime cài Composer production rồi gọi script `composer vercel`. Script tạo thư mục build, discover package, cài npm từ lockfile và build Vite/Wayfinder bằng PHP đi kèm runtime. Assets build được phục vụ qua entrypoint PHP vì file tạo trong Composer hook không trở thành static output của Vercel.

Trong Vercel chọn Root Directory trỏ tới project `tools`, Framework Preset **Other**, Node.js **22.x**. Không đặt thêm Build Command, Install Command hoặc Output Directory; cấu hình `builds` sử dụng builder riêng. Import repository rồi khai báo Environment Variables cho từng môi trường:

| Biến | Giá trị |
| --- | --- |
| `APP_NAME` | `Tools` |
| `APP_KEY` | Khóa cố định, tạo bằng `php artisan key:generate --show`; không đổi qua mỗi deploy |
| `APP_URL` | URL HTTPS của deployment/domain |
| `DB_CONNECTION` | `pgsql` hoặc `mysql` |
| `DB_HOST`, `DB_PORT` | Host và port database bên ngoài |
| `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` | Thông tin kết nối database |
| `DB_SSLMODE` | `require` nếu dùng PostgreSQL có SSL |

Production/debug, stderr logging, database session/cache, secure cookie, queue sync và tắt Inertia SSR đã được đặt trong `vercel.json`. Không dùng SQLite local trên Vercel. Từ máy có PHP >= 8.4.1, chạy `php artisan migrate --force` với biến môi trường của database production trước khi sử dụng CMS. Không tự seed tài khoản admin mặc định lên production; tạo admin với mật khẩu riêng.

Có thể deploy bằng CLI từ thư mục này:

```bash
npx vercel
npx vercel --prod
```

Runtime ghi view/cache tạm vào `/tmp/tools-storage`. File manager của template hiện dùng disk `public` và một số thao tác ZIP cần đường dẫn local: upload, avatar, logo và credential lưu local **không tồn tại bền vững qua các instance/deploy trên Vercel**. Muốn sử dụng các chức năng này trong production cần chuyển các luồng lưu file sang object storage và điều chỉnh thao tác ZIP; chỉ đổi `FILESYSTEM_DISK=s3` chưa đủ. Queue đang chạy đồng bộ, không có worker hoặc SSR server nền. Cấu hình đã chuẩn bị trong repo; chưa deploy hay thay đổi database production.

## Template Lumina CMS

Template CMS dùng Laravel 13, React 19 và Inertia 3. Dự án tích hợp sẵn giao diện quản trị, xác thực, quản lý admin, phân quyền, quản lý file, trình soạn thảo nội dung và nhật ký hoạt động.

Code CMS nằm trực tiếp trong `app/` và `resources/js/`. Các plugin nghiệp vụ được cài thêm từ repository [lumina-foundation](https://github.com/0132E282/lumina-foundation) qua các lệnh `lumina:*`. Hướng dẫn dùng chung nằm trong [setup của foundation](https://github.com/0132E282/lumina-foundation/blob/main/docs/setup.md).

## Yêu cầu

- PHP 8.4.1 trở lên (theo dependency lock hiện tại) và Composer 2.
- Node.js phù hợp với Vite Plus: `^20.19.0`, `^22.18.0` hoặc `>=24.11.0`; pnpm (cần có trong `PATH` trước khi tạo dự án).
- Git và SSH key có quyền truy cập repository Lumina trên GitHub.
- SQLite cho cấu hình mặc định; có thể cấu hình database khác trong `.env`.

## Bắt đầu nhanh

### Tạo dự án bằng Laravel Installer

Cài Laravel Installer nếu chưa có, rồi đăng ký repository Composer. Chỉ cần thực hiện một lần trên mỗi máy:

```bash
composer global require laravel/installer
composer config --global repositories.lumina-cms vcs git@github.com:0132E282/lumina-cms.git
```

Tạo và chạy dự án:

```bash
laravel new my-app --using=lumina/cms
cd my-app
php artisan db:seed
composer run dev
```

Composer chọn phiên bản phù hợp từ repository; nếu cần code mới nhất trên `main`, dùng cách clone bên dưới.

Trong quá trình tạo dự án, Composer cài dependency PHP; các hook của template tạo `APP_KEY`, file SQLite, chạy migration và `pnpm install`.

Nếu Laravel Installer hỏi chạy `npm install` và `npm run build`, chọn **No** vì dependency frontend đã được cài bằng pnpm. Khi phát triển local, `composer run dev` chạy Vite nên không cần build trước.

Nếu dùng database khác SQLite, sửa `.env` và chạy `php artisan migrate` trước khi seed.

### Clone repository template

Dùng cách này để phát triển trực tiếp trên code của template:

```bash
git clone git@github.com:0132E282/lumina-cms.git
cd lumina-cms
composer run setup
php artisan db:seed
composer run dev
```

`composer run setup` cài dependency PHP và frontend, tạo `.env` nếu thiếu, tạo `APP_KEY`, tạo file SQLite nếu thiếu và chạy migration.

Lệnh setup tạo lại `APP_KEY` mỗi lần chạy. Với dự án đã có dữ liệu, hãy chạy riêng các bước cần cập nhật: `composer install`, `pnpm install` và `php artisan migrate`.

## Đăng nhập admin

Mở `http://localhost:8000` sau khi chạy môi trường phát triển.

Seeder tạo admin từ `config('cms.system_admin')`, mặc định:

- Email: `admin@admin.com`
- Mật khẩu: `admin@admin.com`

Để chọn email khác, thêm vào `.env` trước khi chạy `php artisan db:seed`:

```dotenv
SYSTEM_ADMIN=admin@example.com
```

Có thể khai báo nhiều email, ngăn cách bằng dấu phẩy. Với mỗi admin mới, seeder đặt mật khẩu bằng email; tài khoản đã tồn tại được giữ nguyên. Đổi mật khẩu sau lần đăng nhập đầu tiên và trước khi đưa hệ thống vào sử dụng.

## Cài plugin

Chạy các lệnh từ thư mục gốc dự án:

```bash
php artisan lumina:doctor
php artisan lumina:list
php artisan lumina:add customer --dry-run
php artisan lumina:add customer --migrate
```

Khi thư mục nguồn chưa tồn tại, `lumina:list` và `lumina:add` tự clone metadata bằng `git clone --depth=1 --filter=blob:none --sparse` vào thư mục ẩn `plugins/.foundation`; metadata danh sách và nguồn dependency nằm trong cache này. Máy cần có quyền truy cập repository đó. Thư mục `plugins/` đã được bỏ qua trong `.gitignore`.

`lumina:add` thực hiện các bước:

1. Tìm plugin theo ID; tải mã nguồn của plugin đó và các dependency bắt buộc bằng sparse checkout. Mã nguồn plugin không liên quan không được checkout. Chỉ plugin được yêu cầu được đưa ra `plugins/<id>`; metadata và nguồn dependency nằm trong `plugins/.foundation`, bản cài runtime nằm trong `vendor`.
2. Thêm Composer path repository trỏ tới `plugins/*` và cache ẩn `plugins/.foundation/*`, dùng bản sao trong `vendor` (`symlink: false`); đặt `minimum-stability: dev` và `prefer-stable: true` để chấp nhận dependency dev của plugin và ưu tiên bản stable khi có.
3. Chạy `composer require <package>:@dev`; Composer giải quyết dependency của plugin.
4. Ghi plugin được yêu cầu vào `lumina.json` sau khi Composer thành công.
5. Chạy migration trong tiến trình Artisan mới nếu có `--migrate` để nạp các provider vừa cài; nếu không, hiển thị hướng dẫn chạy thủ công.

Bản cài plugin trong `vendor` độc lập với thư mục nguồn. Xóa nguồn không làm bản cài mất file; cần nguồn khi cập nhật hoặc cài lại. Lệnh không xóa nguồn đã tải; checkout đầy đủ có sẵn được giữ nguyên để bảo vệ chỉnh sửa cục bộ. `customer` cần `otp`, `social`, `taxonomies`; nguồn dependency được giữ trong cache ẩn, Composer cài chúng vào `vendor` và chỉ `customer` hiện trong `plugins/`. Checkout foundation riêng truyền qua `--plugins-path` vẫn được giữ nguyên.

### Cấu hình nguồn plugin

Cấu hình mặc định trong `.env.example` và `config/lumina.php`:

```dotenv
LUMINA_PLUGINS_PATH=plugins
# LUMINA_FOUNDATION_REPOSITORY=git@github.com:0132E282/lumina-foundation.git
```

Nếu đã checkout nguồn plugin ở nơi khác, dùng đường dẫn tuyệt đối:

```dotenv
LUMINA_PLUGINS_PATH=/absolute/path/to/lumina-foundation
```

Hoặc ghi đè đường dẫn cho từng lệnh:

```bash
php artisan lumina:list --plugins-path=/absolute/path/to/lumina-foundation
php artisan lumina:add customer --plugins-path=/absolute/path/to/lumina-foundation
```

Lệnh chỉ clone khi thư mục chưa tồn tại, không tự cập nhật checkout có sẵn. Một thư mục rỗng đã tồn tại cũng không kích hoạt clone.

### Tham chiếu lệnh

| Lệnh              | Chức năng                                                                          |
| ----------------- | ---------------------------------------------------------------------------------- |
| `lumina:doctor`   | Kiểm tra PHP, sự hiện diện của Composer/Node/npm/Git và cấu hình đường dẫn plugin. |
| `lumina:list`     | Liệt kê ID, tên package và mô tả; tự điều chỉnh theo chiều rộng terminal.          |
| `lumina:add <id>` | Cài plugin và ghi vào `lumina.json`.                                               |
| `lumina:init`     | Tạo manifest mặc định nếu chưa có.                                                 |

Các tùy chọn của `lumina:add`:

| Tùy chọn          | Ý nghĩa                                                                                                       |
| ----------------- | ------------------------------------------------------------------------------------------------------------- |
| `--dry-run`       | Xem trước, không clone hoặc ghi file. Nếu nguồn chưa tồn tại, chỉ thông báo bước clone, chưa kiểm tra plugin. |
| `--migrate`       | Chạy `migrate --force` trên ứng dụng đang chạy lệnh sau khi cài.                                              |
| `--plugins-path=` | Ghi đè thư mục nguồn plugin.                                                                                  |
| `--project-path=` | Chọn dự án được sửa `composer.json`, chạy Composer và ghi manifest. Không đổi ứng dụng chạy migration.        |

Không cần chạy `lumina:init` trước khi cài: `lumina:add` tự tạo manifest khi cần. `lumina:init --force` ghi đè manifest hiện tại bằng dữ liệu mặc định.

## Phát triển và kiểm tra code

```bash
composer run dev          # chạy môi trường phát triển
composer run lint         # format PHP bằng Pint
composer run lint:check   # kiểm tra format PHP
composer run types:check  # phân tích PHP bằng PHPStan/Larastan
pnpm run format          # format file đang thay đổi bằng Prettier
pnpm run format:check    # kiểm tra format file đang thay đổi bằng Prettier
pnpm run format:all      # chỉ dùng khi muốn format toàn dự án
pnpm run check           # kiểm tra frontend bằng Vite Plus
pnpm run check:fix       # áp dụng các sửa lỗi frontend tự động
pnpm run types:check     # kiểm tra TypeScript
pnpm run build           # build frontend
```

`composer run setup` và hook tạo dự án chỉ cài dependency frontend; chạy `pnpm run build` khi cần assets đã build.

Thư mục `tests/` hiện đã được xóa. Các script `composer run test` và `composer run ci:check` vẫn gọi bộ chạy test trong `composer.json`; cần khôi phục bộ test hoặc cập nhật các script này trước khi dùng làm kiểm tra CI.

## Xử lý lỗi thường gặp

- **Clone thất bại:** kiểm tra SSH key, quyền truy cập repository và URL trong `LUMINA_FOUNDATION_REPOSITORY`.
- **Không có plugin trong danh sách:** kiểm tra thư mục nguồn có chứa các package với `composer.json`. Lệnh không tự clone vào một thư mục đã tồn tại.
- **Composer không cài được plugin:** xem thông báo dependency. Core/CMS đã nằm trong template; plugin còn yêu cầu package riêng như `lumina/core` cần được điều chỉnh để tương thích.
- **Cấu hình `.env` chưa có hiệu lực:** chạy `php artisan config:clear`, rồi thử lại.
- **Setup báo thiếu pnpm:** bảo đảm `pnpm --version` chạy được trong cùng terminal trước khi chạy setup hoặc tạo dự án.
- **Doctor báo thiếu binary:** thêm Composer, Node, npm hoặc Git vào `PATH`. Doctor vẫn kiểm tra npm dù setup dùng pnpm; lệnh này không kiểm tra pnpm hoặc quyền SSH. Kiểm tra binary của Doctor hiện dùng shell POSIX, phù hợp với macOS/Linux.

Nếu `composer require` thất bại, manifest chưa được cập nhật nhưng path repository đã có thể được thêm vào `composer.json`. Kiểm tra diff trước khi thử lại hoặc hoàn tác thay đổi.

### Xóa nguồn hoặc cài lại plugin

- `plugins/` là nguồn cài đặt, không phải thư mục runtime. Package được copy vào `vendor` để việc xóa nguồn không làm CMS mất provider.
- Nếu bản cài cũ dùng symlink hoặc package trong `vendor` bị xóa, ứng dụng bỏ qua plugin thiếu và các plugin phụ thuộc nó; core và plugin không liên quan vẫn được nạp. `php artisan lumina:doctor` báo các plugin bị thiếu. Chạy lại `php artisan lumina:add <id>` để khôi phục các package liên quan.
- `lumina:add` khôi phục file nguồn bị mất từ checkout Git, giữ file chỉnh sửa còn tồn tại, rồi reinstall package bị thiếu hoặc còn dùng symlink. Cài lại không xóa bảng/dữ liệu; `--migrate` chỉ chạy migration chưa áp dụng.
- Gỡ plugin bằng `composer remove lumina/<package>`, thay vì xóa thủ công trong `vendor`. Composer kiểm tra dependency trước khi gỡ.
- Sau khi sửa mã trong nguồn `plugins/`, chạy `composer reinstall lumina/<package>` để cập nhật bản sao trong `vendor`.
