<?php

declare(strict_types=1);

namespace App\Support\Lumina;

final class PluginInstallation
{
    /**
     * @param  array<int, PluginDescriptor>  $plugins
     * @return array<int, string>
     */
    public function needingReinstall(string $projectPath, array $plugins): array
    {
        $composer = (new ComposerJson($projectPath))->read();
        $vendorPath = $composer['config']['vendor-dir'] ?? 'vendor';
        if (! str_starts_with($vendorPath, '/')) {
            $vendorPath = $projectPath.'/'.$vendorPath;
        }
        $file = $vendorPath.'/composer/installed.json';
        $data = is_file($file) ? json_decode(file_get_contents($file), true) : [];
        $installed = array_column($data['packages'] ?? $data, null, 'name');
        $result = [];
        foreach ($plugins as $plugin) {
            $package = $installed[$plugin->packageName] ?? null;
            if ($package === null) {
                continue;
            }
            $path = $vendorPath.'/composer/'.($package['install-path'] ?? '../'.$plugin->packageName);
            $missing = ! is_file($path.'/composer.json');
            foreach ($package['extra']['laravel']['providers'] ?? [] as $provider) {
                foreach ($package['autoload']['psr-4'] ?? [] as $namespace => $directories) {
                    if (str_starts_with($provider, $namespace)) {
                        $relative = str_replace('\\', '/', substr($provider, strlen($namespace))).'.php';
                        $exists = false;
                        foreach ((array) $directories as $directory) {
                            $exists = $exists || is_file($path.'/'.$directory.'/'.$relative);
                        }
                        $missing = $missing || ! $exists;
                    }
                }
            }
            if (is_link($path) || $missing) {
                $result[] = $plugin->packageName;
            }
        }

        return $result;
    }
}
