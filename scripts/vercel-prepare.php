<?php

declare(strict_types=1);

// The uploaded project excludes local storage and generated cache files.
foreach (['bootstrap/cache', 'storage/framework/cache/data', 'storage/framework/sessions', 'storage/framework/views', 'storage/logs'] as $directory) {
    $directory = dirname(__DIR__).'/'.$directory;
    if (! is_dir($directory) && ! mkdir($directory, 0755, true) && ! is_dir($directory)) {
        throw new RuntimeException('Cannot create Laravel build directory.');
    }
}
