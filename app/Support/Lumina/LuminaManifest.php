<?php

declare(strict_types=1);

namespace App\Support\Lumina;

final class LuminaManifest
{
    private const FILE_NAME = 'lumina.json';

    public function __construct(
        private readonly string $projectPath,
    ) {}

    public function path(): string
    {
        return $this->projectPath.'/'.self::FILE_NAME;
    }

    public function exists(): bool
    {
        return is_file($this->path());
    }

    /**
     * @param  array<string, mixed>  $manifest
     */
    public function write(array $manifest): void
    {
        file_put_contents(
            $this->path(),
            json_encode($manifest, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE)."\n",
        );
    }

    /**
     * @return array<string, mixed>
     */
    public function default(): array
    {
        return [
            'registry' => null,
            'pluginsDir' => 'plugins',
            // * core and cms are baked into app/ in this template, so they never appear here.
            'plugins' => [],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function read(): array
    {
        if (! $this->exists()) {
            return $this->default();
        }

        return json_decode(file_get_contents($this->path()) ?: '{}', true) ?? $this->default();
    }

    public function addPlugin(string $id, string $packageName): void
    {
        $manifest = $this->read();
        $manifest['plugins'][$id] = [
            'package' => $packageName,
            'installedAt' => now()->toIso8601String(),
        ];

        $this->write($manifest);
    }
}
