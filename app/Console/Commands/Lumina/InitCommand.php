<?php

declare(strict_types=1);

namespace App\Console\Commands\Lumina;

use App\Support\Lumina\LuminaManifest;
use Illuminate\Console\Command;

class InitCommand extends Command
{
    protected $signature = 'lumina:init {--force : Ghi đè lumina.json nếu đã tồn tại}';

    protected $description = 'Tạo lumina.json để bắt đầu theo dõi các plugin phụ cài thêm vào template này';

    public function handle(): int
    {
        $manifest = new LuminaManifest(base_path());

        if ($manifest->exists() && ! $this->option('force')) {
            $this->warn("{$manifest->path()} đã tồn tại. Dùng --force để ghi đè.");

            return self::FAILURE;
        }

        $manifest->write($manifest->default());
        $this->info("Đã tạo {$manifest->path()}.");

        return self::SUCCESS;
    }
}
