<?php

declare(strict_types=1);

namespace App\Console\Commands\Lumina;

use App\Support\Lumina\ComposerJson;
use App\Support\Lumina\FoundationRepository;
use App\Support\Lumina\LocalPluginDirectory;
use App\Support\Lumina\LuminaManifest;
use App\Support\Lumina\PluginInstallation;
use App\Support\Lumina\PluginWorkspace;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Process;

class AddPluginCommand extends Command
{
    protected $signature = 'lumina:add
        {plugin : ID của plugin cần cài, ví dụ: customer}
        {--dry-run : Xem trước thay đổi, không ghi vào dự án}
        {--migrate : Chạy migration sau khi cài}
        {--plugins-path= : Thư mục chứa plugin nguồn (mặc định: config(lumina.plugins_path))}
        {--project-path= : Thư mục gốc dự án cần cài plugin vào (mặc định: base_path())}';

    protected $description = 'Tải một plugin phụ (ngoài core/cms) cùng dependency và cập nhật cấu hình';

    public function handle(): int
    {
        $pluginId = (string) $this->argument('plugin');
        $isDryRun = (bool) $this->option('dry-run');
        $pluginsPath = $this->option('plugins-path') ?: config('lumina.plugins_path');
        $projectPath = $this->option('project-path') ?: base_path();

        if (blank($pluginsPath)) {
            $this->error('Chưa cấu hình đường dẫn plugin. Dùng --plugins-path hoặc set LUMINA_PLUGINS_PATH trong .env.');

            return self::FAILURE;
        }

        $projectPath = realpath($projectPath) ?: $projectPath;
        if (! str_starts_with($pluginsPath, '/')) {
            $pluginsPath = $projectPath.'/'.ltrim($pluginsPath, '/');
        }

        $workspace = new PluginWorkspace($pluginsPath);
        $sourcePath = $workspace->sourcePath();

        $repository = new FoundationRepository(config('lumina.foundation_repository'));

        if (! is_dir($sourcePath)) {
            if ($isDryRun) {
                $this->line("  {$pluginsPath} chưa tồn tại — sẽ tự clone ".config('lumina.foundation_repository').' qua SSH vào đó.');

                return self::SUCCESS;
            }

            $this->line("Chưa có {$pluginsPath}, đang clone ".config('lumina.foundation_repository').' qua SSH...');
            $repository->ensureClonedInto($sourcePath);
        }

        if (! $isDryRun) {
            $repository->ensureClonedInto($sourcePath);
        }

        $descriptor = (new LocalPluginDirectory($sourcePath))->find($pluginId);

        if ($descriptor === null) {
            $this->error("Không tìm thấy plugin '{$pluginId}'. Dùng `php artisan lumina:list` để xem danh sách.");

            return self::FAILURE;
        }

        $this->line($isDryRun ? "Xem trước: lumina:add {$pluginId}" : "Cài plugin: {$pluginId}");
        $this->line("  Composer package: {$descriptor->packageName}");
        $this->line("  Nguồn: {$descriptor->path}");

        if ($isDryRun) {
            $this->line("  Sẽ thêm path repository trỏ về {$pluginsPath}/* và chạy `composer require {$descriptor->packageName}:@dev`.");
            $this->line($this->option('migrate')
                ? '  Sẽ chạy migration sau khi cài.'
                : '  Sẽ hiển thị lệnh migration, không tự chạy (thêm --migrate để chạy).');

            return self::SUCCESS;
        }

        $required = (new LocalPluginDirectory($sourcePath))->requiredFor($pluginId);
        $this->line('Tải nguồn plugin cần thiết: '.implode(', ', array_map(static fn ($plugin): string => $plugin->id, $required)));
        $repository->ensurePluginSources($sourcePath, $required);

        $workspace->publish($descriptor);
        $composer = new ComposerJson($projectPath);
        $composer->addPathRepositoryFor($pluginsPath);
        if ($sourcePath !== $pluginsPath) {
            $composer->addPathRepositoryFor($sourcePath);
        }

        $repair = (new PluginInstallation)->needingReinstall($projectPath, $required);

        $this->line('Đang chạy composer require (Composer tự giải dependency bắc cầu qua path repository)...');

        $result = Process::path($projectPath)->run(
            ['composer', 'require', "{$descriptor->packageName}:@dev", '--no-interaction'],
            fn (string $type, string $output) => $this->output->write($output),
        );

        if ($result->failed()) {
            $this->error("composer require thất bại (exit code {$result->exitCode()}).");

            return self::FAILURE;
        }

        if ($repair !== []) {
            $this->line('Khôi phục package thiếu hoặc chuyển symlink sang bản sao: '.implode(', ', $repair));
            $reinstall = Process::path($projectPath)->run(
                ['composer', 'reinstall', ...$repair, '--no-interaction'],
                fn (string $type, string $output) => $this->output->write($output),
            );
            if ($reinstall->failed()) {
                $this->error('Khôi phục plugin thất bại; hãy chạy lại lumina:add.');

                return self::FAILURE;
            }
        }

        (new LuminaManifest($projectPath))->addPlugin($pluginId, $descriptor->packageName);
        $this->info("Đã cài {$pluginId} và cập nhật lumina.json.");

        if ($this->option('migrate')) {
            $this->line('Đang chạy migration...');
            // The current Artisan process booted before Composer installed new providers.
            $migration = Process::path($projectPath)->run(
                [PHP_BINARY, 'artisan', 'migrate', '--force'],
                fn (string $type, string $output) => $this->output->write($output),
            );

            if ($migration->failed()) {
                return self::FAILURE;
            }
        } else {
            $this->comment('Chạy `php artisan migrate` để áp dụng migration của plugin (nếu có).');
        }

        return self::SUCCESS;
    }
}
