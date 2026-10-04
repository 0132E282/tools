<?php

declare(strict_types=1);

namespace App\Support\Lumina;

use Composer\Autoload\ClassLoader;
use Illuminate\Foundation\PackageManifest;

final class AvailablePluginManifest extends PackageManifest
{
    /** @var array<string, bool> */
    private array $missingPlugins = [];

    /** @return array<int, string> */
    public function missingPlugins(): array
    {
        $this->getManifest();

        return array_keys($this->missingPlugins);
    }

    protected function getManifest(): array
    {
        $manifest = parent::getManifest();
        $missing = [];
        foreach ($manifest as $package => $configuration) {
            if (! str_starts_with($package, 'lumina/')) {
                continue;
            }
            foreach ($configuration['providers'] ?? [] as $provider) {
                if (! $this->providerFileExists($provider)) {
                    $missing[$package] = true;
                }
            }
        }

        $installedFile = $this->vendorPath.'/composer/installed.json';
        $installed = is_file($installedFile) ? json_decode($this->files->get($installedFile), true) : [];
        $packages = $installed['packages'] ?? $installed;
        do {
            $count = count($missing);
            foreach ($packages as $package) {
                if (! str_starts_with($package['name'], 'lumina/')) {
                    continue;
                }
                foreach (array_keys($package['require'] ?? []) as $dependency) {
                    if (isset($missing[$dependency])) {
                        $missing[$package['name']] = true;
                    }
                }
            }
        } while (count($missing) !== $count);

        $this->missingPlugins = $missing;

        return array_diff_key($manifest, $missing);
    }

    private function providerFileExists(string $provider): bool
    {
        foreach (ClassLoader::getRegisteredLoaders() as $loader) {
            $file = $loader->findFile($provider);
            if ($file !== false && is_file($file)) {
                return true;
            }
        }

        return false;
    }
}
