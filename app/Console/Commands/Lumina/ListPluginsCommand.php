<?php

declare(strict_types=1);

namespace App\Console\Commands\Lumina;

use App\Support\Lumina\FoundationRepository;
use App\Support\Lumina\LocalPluginDirectory;
use App\Support\Lumina\PluginWorkspace;
use Illuminate\Console\Command;
use Symfony\Component\Console\Terminal;

class ListPluginsCommand extends Command
{
    protected $signature = 'lumina:list
        {--plugins-path= : Thư mục chứa plugin nguồn (mặc định: config(lumina.plugins_path))}';

    protected $description = 'Xem danh sách plugin có thể cài thêm vào template (customer, coupon, e-commerce, ...)';

    public function handle(): int
    {
        $pluginsPath = $this->option('plugins-path') ?: config('lumina.plugins_path');

        if (blank($pluginsPath)) {
            $this->error('Chưa cấu hình đường dẫn plugin. Dùng --plugins-path hoặc set LUMINA_PLUGINS_PATH trong .env.');

            return self::FAILURE;
        }

        if (! str_starts_with($pluginsPath, '/')) {
            $pluginsPath = base_path($pluginsPath);
        }
        $sourcePath = (new PluginWorkspace($pluginsPath))->sourcePath();

        if (! is_dir($sourcePath)) {
            $this->line("Chưa có {$pluginsPath}, đang clone ".config('lumina.foundation_repository').' qua SSH...');
            (new FoundationRepository(config('lumina.foundation_repository')))->ensureClonedInto($sourcePath);
        }

        $descriptors = (new LocalPluginDirectory($sourcePath))->all();

        if ($descriptors === []) {
            $this->warn("Không tìm thấy plugin nào trong {$pluginsPath}.");

            return self::SUCCESS;
        }

        $terminalWidth = (new Terminal)->getWidth();
        $idWidth = max(array_map(static fn ($descriptor): int => mb_strwidth($descriptor->id), $descriptors));
        $packageWidth = max(16, ...array_map(static fn ($descriptor): int => mb_strwidth($descriptor->packageName), $descriptors));
        $descriptionWidth = $terminalWidth - $idWidth - $packageWidth - 8;

        $this->newLine();
        $this->info('Plugin có thể cài ('.count($descriptors).')');

        if ($descriptionWidth < 20) {
            foreach ($descriptors as $descriptor) {
                $this->info($descriptor->id);
                $this->line('  '.$descriptor->packageName);
                $this->line('  '.mb_strimwidth($descriptor->description, 0, max(4, $terminalWidth - 4), '…'));
                $this->newLine();
            }

            return self::SUCCESS;
        }

        $this->table(
            ['ID', 'Composer package', 'Mô tả'],
            array_map(
                static fn ($descriptor): array => [
                    $descriptor->id,
                    $descriptor->packageName,
                    mb_strimwidth($descriptor->description, 0, min(80, $descriptionWidth), '…'),
                ],
                $descriptors,
            ),
            'compact',
        );

        return self::SUCCESS;
    }
}
