<?php

declare(strict_types=1);

namespace App\Console\Commands\Lumina;

use App\Support\Lumina\AvailablePluginManifest;
use Illuminate\Console\Command;
use Illuminate\Foundation\PackageManifest;

class DoctorCommand extends Command
{
    private const MINIMUM_PHP_VERSION = '8.3.0';

    protected $signature = 'lumina:doctor';

    protected $description = 'Kiểm tra môi trường, cấu hình và dependency cần cho lumina:add/list';

    public function handle(): int
    {
        $checks = $this->runChecks();

        $this->table(
            ['Kiểm tra', 'Trạng thái', 'Chi tiết'],
            array_map(
                static fn (array $check): array => [$check['label'], $check['passed'] ? 'OK' : 'LỖI', $check['detail']],
                $checks,
            ),
        );

        $failedChecks = array_filter($checks, static fn (array $check): bool => ! $check['passed']);

        if ($failedChecks !== []) {
            $this->error('Một số kiểm tra chưa đạt. Xem bảng phía trên.');

            return self::FAILURE;
        }

        $manifest = $this->laravel->make(PackageManifest::class);
        if ($manifest instanceof AvailablePluginManifest && $manifest->missingPlugins() !== []) {
            $this->warn('Plugin thiếu file hoặc dependency: '.implode(', ', $manifest->missingPlugins()));
            $this->line('CMS vẫn chạy; dùng lumina:add <id> để khôi phục plugin bị thiếu.');

            return self::FAILURE;
        }

        $this->info('Môi trường sẵn sàng.');

        return self::SUCCESS;
    }

    /**
     * @return array<int, array{label: string, passed: bool, detail: string}>
     */
    private function runChecks(): array
    {
        return [
            $this->checkPhpVersion(),
            $this->checkBinaryAvailable('composer'),
            $this->checkBinaryAvailable('node'),
            $this->checkBinaryAvailable('npm'),
            $this->checkBinaryAvailable('git'),
            $this->checkPluginsPath(),
        ];
    }

    /**
     * @return array{label: string, passed: bool, detail: string}
     */
    private function checkPhpVersion(): array
    {
        $passed = version_compare(PHP_VERSION, self::MINIMUM_PHP_VERSION, '>=');

        return [
            'label' => 'Phiên bản PHP',
            'passed' => $passed,
            'detail' => $passed ? PHP_VERSION : 'Cần PHP >= '.self::MINIMUM_PHP_VERSION.', hiện tại '.PHP_VERSION,
        ];
    }

    /**
     * ! `command -v` chỉ hoạt động trên shell POSIX (bash/zsh); chưa hỗ trợ Windows cmd/PowerShell.
     *
     * @return array{label: string, passed: bool, detail: string}
     */
    private function checkBinaryAvailable(string $binary): array
    {
        exec(sprintf('command -v %s 2>/dev/null', escapeshellarg($binary)), $output, $exitCode);

        $passed = $exitCode === 0 && $output !== [];

        return [
            'label' => "Lệnh `{$binary}`",
            'passed' => $passed,
            'detail' => $passed ? trim($output[0]) : "Không tìm thấy `{$binary}` trong PATH",
        ];
    }

    /**
     * ! Thư mục chưa tồn tại không phải lỗi — lumina:list/lumina:add tự clone qua SSH khi cần.
     *
     * @return array{label: string, passed: bool, detail: string}
     */
    private function checkPluginsPath(): array
    {
        $path = (string) config('lumina.plugins_path');
        $passed = filled($path);

        return [
            'label' => 'config(lumina.plugins_path)',
            'passed' => $passed,
            'detail' => match (true) {
                ! $passed => 'Chưa set — set LUMINA_PLUGINS_PATH trong .env.',
                is_dir($path) => $path,
                default => "{$path} (chưa tồn tại — sẽ tự clone qua SSH khi chạy lumina:list/lumina:add)",
            },
        ];
    }
}
