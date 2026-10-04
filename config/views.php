<?php

// * Source of truth for the admin sidebar and the `/system` shortcuts grid.
return [
    'sidebar' => [
        'main' => [
            [
                'title' => 'Dashboard',
                'url' => '/',
                'icon' => 'LayoutDashboard',
            ],
        ],

        'footer' => [
            [
                'title' => 'File Manager',
                'url' => '/file-manager',
                'icon' => 'FolderOpen',
            ],
            [
                'title' => 'Hệ thống',
                'url' => '/system',
                'icon' => 'ShieldCheck',
            ],
        ],
    ],

    'systems' => [
        [
            'key' => 'admins',
            'title' => 'Quản lý Admin',
            'description' => 'Danh sách quản trị viên, phân quyền theo vai trò.',
            'url' => '/admins',
            'icon' => 'Users',
        ],
        [
            'key' => 'roles',
            'title' => 'Quản lý Vai trò',
            'description' => 'Vai trò, quyền hạn và phân quyền thư mục.',
            'url' => '/roles',
            'icon' => 'ShieldCheck',
        ],
        [
            'key' => 'activity-logs',
            'title' => 'Lịch sử hoạt động',
            'description' => 'Nhật ký tạo/sửa/xóa Admin, Vai trò và đăng nhập hệ thống.',
            'url' => '/activity-logs',
            'icon' => 'History',
        ],
        [
            'key' => 'general-settings',
            'title' => 'Cấu hình hệ thống',
            'description' => 'Tên website, logo và favicon hiển thị trên toàn hệ thống.',
            'url' => '/settings/general',
            'icon' => 'SlidersHorizontal',
        ],
        [
            'key' => 'smtp-settings',
            'title' => 'Cấu hình SMTP',
            'confirmPassword' => true,
            'description' => 'Máy chủ gửi email cho thông báo và xác thực tài khoản.',
            'url' => '/settings/smtp',
            'icon' => 'Mail',
        ],
        [
            'key' => 'search-console-settings',
            'title' => 'Google Search Console',
            'confirmPassword' => true,
            'description' => 'Kiểm tra trạng thái index của URL qua Search Console.',
            'url' => '/settings/search-console',
            'icon' => 'Search',
        ],
        [
            'key' => 'log-viewer',
            'title' => 'Log Viewer',
            'confirmPassword' => true,
            'description' => 'Xem log lỗi/hoạt động của ứng dụng (laravel.log).',
            'url' => '/log-viewer',
            'icon' => 'FileText',
        ],
        [
            'key' => 'api-keys',
            'title' => 'Quản lý API Keys',
            'confirmPassword' => true,
            'description' => 'Tạo và quản lý Key xác thực / Key bảo mật cho API Public (/api/items).',
            'url' => '/api-keys',
            'icon' => 'Key',
        ],
    ],
];
