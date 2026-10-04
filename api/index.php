<?php

declare(strict_types=1);

use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Assets built by the community runtime are bundled inside the function.
$path = rawurldecode(parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/');
$public = realpath(__DIR__.'/../public');
$asset = realpath(__DIR__.'/../public'.$path);
$types = [
    'css' => 'text/css',
    'js' => 'application/javascript',
    'woff' => 'font/woff',
    'woff2' => 'font/woff2',
    'png' => 'image/png',
    'jpg' => 'image/jpeg',
    'jpeg' => 'image/jpeg',
    'webp' => 'image/webp',
    'svg' => 'image/svg+xml',
    'ico' => 'image/x-icon',
    'txt' => 'text/plain',
];
$extension = pathinfo($asset ?: '', PATHINFO_EXTENSION);

if (in_array($_SERVER['REQUEST_METHOD'] ?? 'GET', ['GET', 'HEAD'], true)
    && $public && $asset && str_starts_with($asset, $public.DIRECTORY_SEPARATOR)
    && is_file($asset) && isset($types[$extension])) {
    header('Content-Type: '.$types[$extension]);
    header('X-Content-Type-Options: nosniff');
    header('Cache-Control: '.(str_starts_with($path, '/build/assets/')
        ? 'public, max-age=31536000, immutable'
        : 'public, max-age=3600'));

    if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'HEAD') {
        readfile($asset);
    }

    exit;
}

$storage = sys_get_temp_dir().'/tools-storage';
foreach (['framework/cache/data', 'framework/sessions', 'framework/views', 'logs', 'app/private', 'app/public', 'app/tmp'] as $directory) {
    $directory = $storage.'/'.$directory;
    if (! is_dir($directory) && ! mkdir($directory, 0755, true) && ! is_dir($directory)) {
        throw new RuntimeException('Cannot create Laravel runtime directory.');
    }
}
$_ENV['LARAVEL_STORAGE_PATH'] = $storage;
$_SERVER['LARAVEL_STORAGE_PATH'] = $storage;

require __DIR__.'/../vendor/autoload.php';
$app = require __DIR__.'/../bootstrap/app.php';
$app->handleRequest(Request::capture());
