<?php

declare(strict_types=1);

namespace App\Support\Lumina;

use RuntimeException;

/**
 * * Giải dependency bắc cầu giữa các plugin (vd. customer -> taxonomies) được giao hẳn cho Composer:
 * * một path repository trỏ về `{pluginsPath}/*` cho phép `composer require lumina/x` tự kéo theo
 * * mọi `lumina/*` khác mà package đó khai báo trong `require`, không cần tự viết resolver riêng.
 */
final class ComposerJson
{
    public function __construct(
        private readonly string $projectPath,
    ) {}

    public function path(): string
    {
        return $this->projectPath.'/composer.json';
    }

    /**
     * @return array<string, mixed>
     */
    public function read(): array
    {
        if (! is_file($this->path())) {
            throw new RuntimeException("Không tìm thấy composer.json tại: {$this->path()}");
        }

        return json_decode(file_get_contents($this->path()) ?: '{}', true) ?? [];
    }

    public function hasPathRepositoryFor(string $pluginsPath): bool
    {
        foreach ($this->read()['repositories'] ?? [] as $repository) {
            if (($repository['type'] ?? null) === 'path' && ($repository['url'] ?? null) === $this->wildcard($pluginsPath)) {
                return true;
            }
        }

        return false;
    }

    public function addPathRepositoryFor(string $pluginsPath): void
    {
        $composer = $this->read();

        // Root stability governs transitive dependencies of local dev packages.
        $composer['minimum-stability'] = 'dev';
        $composer['prefer-stable'] = true;

        $found = false;
        foreach ($composer['repositories'] ?? [] as $key => $repository) {
            if (($repository['type'] ?? null) !== 'path') {
                continue;
            }
            $url = $repository['url'] ?? '';
            $absolute = str_starts_with($url, '/') ? $url : $this->projectPath.'/'.$url;
            if ($url === $this->wildcard($pluginsPath) || $absolute === $this->wildcard($pluginsPath)) {
                $composer['repositories'][$key]['options']['symlink'] = false;
                $composer['repositories'][$key]['options']['reference'] = 'config';
                $found = true;
            }
        }

        if (! $found) {
            $composer['repositories'] ??= [];
            $composer['repositories'][] = [
                'type' => 'path',
                'url' => $this->wildcard($pluginsPath),
                'options' => ['symlink' => false, 'reference' => 'config'],
            ];
        }

        $this->write($composer);
    }

    private function wildcard(string $pluginsPath): string
    {
        return rtrim($pluginsPath, '/').'/*';
    }

    /**
     * @param  array<string, mixed>  $composer
     */
    private function write(array $composer): void
    {
        file_put_contents(
            $this->path(),
            json_encode($composer, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE)."\n",
        );
    }
}
