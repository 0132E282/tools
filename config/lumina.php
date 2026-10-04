<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Plugin Source Directory
    |--------------------------------------------------------------------------
    |
    | Used by the `lumina:list` and `lumina:add` commands to discover extra
    | Composer packages (customer, coupon, e-commerce, shipping, ...) that
    | are not baked into this template. Defaults to the `plugins/` folder at
    | the project root (where the lumina-foundation checkout is expected to
    | live), so most setups never need to set LUMINA_PLUGINS_PATH at all.
    | Each --plugins-path option overrides this default.
    |
    */
    'plugins_path' => env('LUMINA_PLUGINS_PATH', 'plugins'),

    /*
    |--------------------------------------------------------------------------
    | Plugin Source Repository
    |--------------------------------------------------------------------------
    |
    | SSH URL của repo lumina-foundation. Khi plugins_path chưa tồn tại,
    | `lumina:list`/`lumina:add` tự clone repo này vào đó qua SSH (cần tài
    | khoản git đã được cấp quyền Read trở lên trên repo private này).
    |
    */
    'foundation_repository' => env('LUMINA_FOUNDATION_REPOSITORY', 'git@github.com:0132E282/lumina-foundation.git'),
];
