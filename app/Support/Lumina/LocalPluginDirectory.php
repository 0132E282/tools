<?php

declare(strict_types=1);

namespace App\Support\Lumina;

use RuntimeException;

/**
 * * No remote plugin registry exists yet, so the plugin source is read straight from a local
 * * directory of Composer packages (each a subfolder with its own composer.json).
 */
final class LocalPluginDirectory
{
    public function __construct(
        private readonly string $pluginsPath,
    ) {}

    /**
     * @return array<int, PluginDescriptor>
     */
    public function all(): array
    {
        if (! is_dir($this->pluginsPath)) {
            throw new RuntimeException("Không tìm thấy thư mục plugin: {$this->pluginsPath}");
        }

        $descriptors = [];

        foreach (scandir($this->pluginsPath) ?: [] as $entry) {
            if ($entry === '.' || $entry === '..') {
                continue;
            }

            $pluginPath = $this->pluginsPath.'/'.$entry;
            $composerFile = $pluginPath.'/composer.json';

            if (! is_dir($pluginPath) || ! is_file($composerFile)) {
                continue;
            }

            $descriptors[] = $this->toDescriptor($entry, $pluginPath, $composerFile);
        }

        return $descriptors;
    }

    public function find(string $id): ?PluginDescriptor
    {
        foreach ($this->all() as $descriptor) {
            if ($descriptor->id === $id) {
                return $descriptor;
            }
        }

        return null;
    }

    /**
     * Source selection follows required local packages; Composer still resolves versions.
     *
     * @return array<int, PluginDescriptor>
     */
    public function requiredFor(string $id): array
    {
        $plugins = $this->all();
        $byPackage = [];
        foreach ($plugins as $plugin) {
            $byPackage[$plugin->packageName] = $plugin;
        }

        $selected = [];
        $visit = function (PluginDescriptor $plugin) use (&$visit, &$selected, $byPackage): void {
            if (isset($selected[$plugin->packageName])) {
                return;
            }

            $selected[$plugin->packageName] = $plugin;
            $composer = json_decode(file_get_contents($plugin->path.'/composer.json') ?: '{}', true, flags: JSON_THROW_ON_ERROR);
            foreach (array_keys($composer['require'] ?? []) as $package) {
                if (isset($byPackage[$package])) {
                    $visit($byPackage[$package]);
                }
            }
        };

        $plugin = $this->find($id);
        if ($plugin === null) {
            throw new RuntimeException("Không tìm thấy plugin '{$id}'.");
        }

        $visit($plugin);

        return array_values($selected);
    }

    private function toDescriptor(string $id, string $path, string $composerFile): PluginDescriptor
    {
        $composer = json_decode(file_get_contents($composerFile) ?: '{}', true) ?? [];

        return new PluginDescriptor(
            id: $id,
            packageName: $composer['name'] ?? "lumina/{$id}",
            description: $composer['description'] ?? '',
            path: $path,
        );
    }
}
