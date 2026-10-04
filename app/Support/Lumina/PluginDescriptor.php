<?php

declare(strict_types=1);

namespace App\Support\Lumina;

final class PluginDescriptor
{
    public function __construct(
        public readonly string $id,
        public readonly string $packageName,
        public readonly string $description,
        public readonly string $path,
    ) {}
}
