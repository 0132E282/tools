<?php

declare(strict_types=1);

namespace App\Support\Lumina;

use Illuminate\Contracts\Process\ProcessResult;
use Illuminate\Support\Facades\Process;
use RuntimeException;

/**
 * * lumina-foundation là private repo: chỉ clone được qua SSH với tài khoản đã
 * * được cấp quyền Read trở lên, giống hệt `laravel new --using=` cho lumina-cms.
 */
final class FoundationRepository
{
    public function __construct(
        private readonly string $repositoryUrl,
    ) {}

    /**
     * @return bool true nếu vừa clone (thư mục chưa tồn tại trước đó)
     */
    public function ensureClonedInto(string $pluginsPath): bool
    {
        if (is_dir($pluginsPath)) {
            $this->restoreMissingFiles($pluginsPath, null);

            return false;
        }

        $result = $this->clone($pluginsPath);

        if ($result->failed()) {
            throw new RuntimeException(
                "Không clone được {$this->repositoryUrl} qua SSH vào {$pluginsPath}: ".$result->errorOutput(),
            );
        }

        $this->runGit($pluginsPath, ['sparse-checkout', 'set', '--no-cone', '/*/composer.json']);

        return true;
    }

    /**
     * @param  array<int, PluginDescriptor>  $plugins
     */
    public function ensurePluginSources(string $pluginsPath, array $plugins): void
    {
        $sparse = Process::path($pluginsPath)->run(['git', 'config', '--bool', 'core.sparseCheckout']);

        // An existing full checkout may contain local edits; preserve it as supplied.
        if (trim($sparse->output()) !== 'true') {
            $this->restoreMissingFiles($pluginsPath, array_map(static fn (PluginDescriptor $plugin): string => $plugin->id, $plugins));

            return;
        }

        $patterns = array_map(static fn (PluginDescriptor $plugin): string => '/'.$plugin->id.'/', $plugins);
        $this->runGit($pluginsPath, ['sparse-checkout', 'add', ...$patterns]);
        $this->restoreMissingFiles($pluginsPath, array_map(static fn (PluginDescriptor $plugin): string => $plugin->id, $plugins));
    }

    /** @param array<int, string>|null $ids */
    private function restoreMissingFiles(string $pluginsPath, ?array $ids): void
    {
        $tree = Process::path($pluginsPath)->run(['git', 'ls-tree', '-r', '--name-only', '-z', 'HEAD']);
        if ($tree->failed()) {
            return; // Locally supplied package directories need not be Git checkouts.
        }
        $missing = [];
        foreach (explode("\0", $tree->output()) as $path) {
            $selected = $ids === null
                ? preg_match('~^[^/]+/composer\.json$~', $path) === 1
                : in_array(explode('/', $path)[0], $ids, true);
            if ($selected && $path !== '' && ! file_exists($pluginsPath.'/'.$path)) {
                $missing[] = $path;
            }
        }
        foreach (array_chunk($missing, 100) as $paths) {
            $this->runGit($pluginsPath, ['restore', '--worktree', '--', ...$paths]);
        }
    }

    /** @param array<int, string> $arguments */
    private function runGit(string $pluginsPath, array $arguments): void
    {
        $result = Process::path($pluginsPath)->run(['git', ...$arguments]);

        if ($result->failed()) {
            throw new RuntimeException('Không tải được nguồn plugin: '.$result->errorOutput());
        }
    }

    private function clone(string $pluginsPath): ProcessResult
    {
        return Process::run(['git', 'clone', '--depth=1', '--filter=blob:none', '--sparse', $this->repositoryUrl, $pluginsPath]);
    }
}
