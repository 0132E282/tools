<?php

declare(strict_types=1);

namespace App\Support\Lumina;

use Illuminate\Filesystem\Filesystem;
use RuntimeException;

final class PluginWorkspace
{
    public function __construct(private readonly string $path) {}

    public function sourcePath(): string
    {
        // Keep explicitly supplied foundation checkouts compatible.
        if (is_dir($this->path.'/.foundation') || is_file($this->path.'/.lumina-workspace.json')) {
            return $this->path.'/.foundation';
        }

        return is_dir($this->path.'/.git') || (glob($this->path.'/*/composer.json') ?: []) !== []
            ? $this->path
            : $this->path.'/.foundation';
    }

    public function publish(PluginDescriptor $plugin): void
    {
        if ($this->sourcePath() === $this->path) {
            return;
        }
        $files = new Filesystem;
        $files->ensureDirectoryExists($this->path);
        if (! is_file($this->path.'/.lumina-workspace.json')) {
            if ($files->put($this->path.'/.lumina-workspace.json', "{\"version\":1}\n") === false) {
                throw new RuntimeException('Không ghi được thông tin workspace plugin.');
            }
        }
        $target = $this->path.'/'.$plugin->id;
        $files->ensureDirectoryExists($target);
        foreach ($files->allFiles($plugin->path, true) as $file) {
            $destination = $target.'/'.$file->getRelativePathname();
            // Existing source edits belong to the application developer.
            if (! is_file($destination)) {
                $files->ensureDirectoryExists(dirname($destination));
                if (! $files->copy($file->getPathname(), $destination)) {
                    throw new RuntimeException("Không copy được nguồn plugin: {$destination}");
                }
            }
        }
    }
}
