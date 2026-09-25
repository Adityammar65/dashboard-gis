<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Drivers\Gd\Driver as GdDriver;
use Intervention\Image\Drivers\Imagick\Driver as ImagickDriver;
use Intervention\Image\ImageManager;

class ImageService
{
    private const MAX_LONGEST_SIDE = 1600;
    private const WEBP_QUALITY = 82;

    public function storeOptimizedWebP(UploadedFile $file, string $directory): string
    {
        $realPath = $file->getRealPath();
        if ($realPath === false || !is_file($realPath)) {
            throw new \RuntimeException('Gagal membaca file upload: path tidak valid.');
        }

        if (!Storage::disk('public')->exists($directory)) {
            Storage::disk('public')->makeDirectory($directory);
        }

        $filename = Str::uuid()->toString() . '.webp';
        $storagePath = $directory . '/' . $filename;
        $absolutePath = Storage::disk('public')->path($storagePath);

        $absoluteDir = dirname($absolutePath);
        if (!is_dir($absoluteDir)) {
            mkdir($absoluteDir, 0755, true);
        }

        if (extension_loaded('imagick')) {
            try {
                return $this->storeViaIntervention($realPath, $storagePath, new ImagickDriver());
            } catch (\Throwable $e) {
                Log::error('ImageService Imagick conversion failed, trying next encoder: ' . $e->getMessage(), [
                    'original' => $file->getClientOriginalName(),
                    'directory' => $directory,
                ]);
            }
        }

        if (self::isWebPSupported()) {
            try {
                return $this->storeViaIntervention($realPath, $storagePath, new GdDriver());
            } catch (\Throwable $e) {
                Log::error('ImageService GD WebP conversion failed, trying CLI fallback: ' . $e->getMessage(), [
                    'original' => $file->getClientOriginalName(),
                    'directory' => $directory,
                ]);
                if (!$this->isMagickAvailable() && !$this->isCwebpAvailable()) {
                    if ($e instanceof \RuntimeException && str_contains($e->getMessage(), 'Gagal')) {
                        throw $e;
                    }
                    throw new \RuntimeException('Gagal mengoptimalkan gambar: ' . $e->getMessage(), 0, $e);
                }
            }
        }

        if ($this->isCwebpAvailable()) {
            try {
                return $this->storeViaCwebp($realPath, $storagePath, $absolutePath);
            } catch (\Throwable $e) {
                Log::error('ImageService cwebp conversion failed, trying ImageMagick CLI: ' . $e->getMessage(), [
                    'original' => $file->getClientOriginalName(),
                    'directory' => $directory,
                ]);
            }
        }

        if ($this->isMagickAvailable()) {
            try {
                return $this->storeViaMagickCli($realPath, $storagePath, $absolutePath);
            } catch (\Throwable $e) {
                Log::error('ImageService CLI magick failed: ' . $e->getMessage(), [
                    'original' => $file->getClientOriginalName(),
                    'directory' => $directory,
                ]);
                throw new \RuntimeException('Gagal mengoptimalkan gambar: ' . $e->getMessage(), 0, $e);
            }
        }

        $this->ensureWebPSupport();
        throw new \RuntimeException('Gagal mengoptimalkan gambar: tidak ada encoder WebP yang tersedia.');
    }

    private function storeViaIntervention(string $realPath, string $storagePath, $driver): string
    {
        $manager = new ImageManager($driver);
        $image = $manager->read($realPath);

        $width = $image->width();
        $height = $image->height();

        $longest = max($width, $height);
        if ($longest > self::MAX_LONGEST_SIDE) {
            if ($width >= $height) {
                $image->scale(width: self::MAX_LONGEST_SIDE);
            } else {
                $image->scale(height: self::MAX_LONGEST_SIDE);
            }
        }

        $encoded = $image->toWebp(quality: self::WEBP_QUALITY);

        $stored = Storage::disk('public')->put($storagePath, (string) $encoded);
        if (!$stored) {
            throw new \RuntimeException('Gagal menyimpan gambar WebP ke storage.');
        }

        return $storagePath;
    }

    private function isMagickAvailable(): bool
    {
        $candidates = ['magick', 'convert'];
        foreach ($candidates as $bin) {
            $out = [];
            $code = 0;
            @exec('command -v ' . escapeshellarg($bin) . ' 2>&1', $out, $code);
            if ($code === 0 && !empty($out)) {
                return true;
            }
            @exec('which ' . escapeshellarg($bin) . ' 2>&1', $out, $code);
            if ($code === 0 && !empty($out)) {
                return true;
            }
        }
        if (is_executable('/usr/bin/magick') || is_executable('/usr/bin/convert') || is_executable('/opt/lampp/bin/magick')) {
            return true;
        }
        return false;
    }

    private function findCwebpBinary(): ?string
    {
        $candidates = ['/opt/lampp/bin/cwebp', '/usr/bin/cwebp', '/usr/local/bin/cwebp', 'cwebp'];
        foreach ($candidates as $bin) {
            if (str_contains($bin, '/')) {
                if (is_executable($bin)) {
                    return $bin;
                }
                continue;
            }

            $out = [];
            $code = 0;
            @exec('command -v ' . escapeshellarg($bin) . ' 2>&1', $out, $code);
            if ($code === 0 && !empty($out)) {
                return trim($out[0]);
            }
        }

        return null;
    }

    private function isCwebpAvailable(): bool
    {
        return $this->findCwebpBinary() !== null;
    }

    private function storeViaCwebp(string $realPath, string $storagePath, string $absolutePath): string
    {
        $bin = $this->findCwebpBinary();
        if ($bin === null) {
            throw new \RuntimeException('Binary cwebp tidak ditemukan.');
        }

        $dimensions = @getimagesize($realPath);
        if ($dimensions === false || empty($dimensions[0]) || empty($dimensions[1])) {
            throw new \RuntimeException('Dimensi gambar tidak dapat dibaca.');
        }

        $width = (int) $dimensions[0];
        $height = (int) $dimensions[1];
        $longest = max($width, $height);
        if ($longest > self::MAX_LONGEST_SIDE) {
            $ratio = self::MAX_LONGEST_SIDE / $longest;
            $width = max(1, (int) round($width * $ratio));
            $height = max(1, (int) round($height * $ratio));
        }

        $cmd = sprintf(
            '%s -q %d -resize %d %d %s -o %s 2>&1',
            escapeshellarg($bin),
            self::WEBP_QUALITY,
            $width,
            $height,
            escapeshellarg($realPath),
            escapeshellarg($absolutePath)
        );

        $output = [];
        $code = 0;
        exec($cmd, $output, $code);

        if ($code !== 0) {
            throw new \RuntimeException('cwebp gagal: ' . implode("\n", $output));
        }

        if (!is_file($absolutePath) || filesize($absolutePath) === 0) {
            throw new \RuntimeException('cwebp tidak menghasilkan file WebP.');
        }

        $header = file_get_contents($absolutePath, false, null, 0, 12);
        if ($header === false || substr($header, 0, 4) !== 'RIFF' || substr($header, 8, 4) !== 'WEBP') {
            throw new \RuntimeException('Output cwebp bukan file WebP yang valid.');
        }

        return $storagePath;
    }

    private function detectMagickBinary(): string
    {
        $candidates = ['/usr/bin/magick', '/usr/bin/convert', '/opt/lampp/bin/magick', 'magick', 'convert'];
        foreach ($candidates as $bin) {
            $out = [];
            $code = 0;
            @exec('command -v ' . escapeshellarg($bin) . ' 2>&1', $out, $code);
            if ($code === 0 && !empty($out)) {
                return $bin;
            }
            if (is_executable($bin)) {
                return $bin;
            }
        }
        return 'magick';
    }

    private function storeViaMagickCli(string $realPath, string $storagePath, string $absolutePath): string
    {
        $bin = $this->detectMagickBinary();
        $isMagick7 = str_contains($bin, 'magick') && !str_contains($bin, 'convert');

        if ($isMagick7) {
            $cmd = sprintf(
                '%s %s -auto-orient -resize "1600x1600>" -quality %d %s 2>&1',
                escapeshellcmd($bin),
                escapeshellarg($realPath),
                self::WEBP_QUALITY,
                escapeshellarg($absolutePath)
            );
        } else {
            $cmd = sprintf(
                '%s %s -auto-orient -resize "1600x1600>" -quality %d %s 2>&1',
                escapeshellcmd($bin),
                escapeshellarg($realPath),
                self::WEBP_QUALITY,
                escapeshellarg($absolutePath)
            );
        }

        $output = [];
        $code = 0;
        exec($cmd, $output, $code);

        if ($code !== 0) {
            throw new \RuntimeException('ImageMagick CLI gagal: ' . implode("\n", $output));
        }

        if (!is_file($absolutePath) || filesize($absolutePath) === 0) {
            throw new \RuntimeException('ImageMagick CLI tidak menghasilkan file WebP.');
        }
        return $storagePath;
    }

    public function ensureWebPSupport(): void
    {
        if (extension_loaded('imagick')) {
            return;
        }

        if (self::isWebPSupported()) {
            return;
        }

        if ($this->isCwebpAvailable()) {
            return;
        }

        if ($this->isMagickAvailable()) {
            return;
        }

        if (!function_exists('gd_info')) {
            throw new \RuntimeException('Ekstensi GD tidak tersedia dan tidak ada encoder WebP CLI/Imagick yang ditemukan.');
        }

        $info = gd_info();
        $webpSupported = $info['WebP Support'] ?? false;

        if (!$webpSupported) {
            throw new \RuntimeException('GD WebP tidak didukung dan encoder WebP CLI/Imagick tidak tersedia. Perlu php-gd dengan WebP enabled, cwebp, atau ImageMagick/Imagick.');
        }

        if (!function_exists('imagewebp')) {
            throw new \RuntimeException('Fungsi imagewebp tidak tersedia di instalasi GD saat ini.');
        }
    }

    public static function isWebPSupported(): bool
    {
        if (!function_exists('gd_info') || !function_exists('imagewebp')) {
            return false;
        }
        $info = gd_info();
        return (bool) ($info['WebP Support'] ?? false);
    }
}
