<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageService
{
    /**
     * Resolved encoder binary paths, keyed by encoder name.
     *
     * @var array<string, string|null>|null
     */
    private static ?array $binaries = null;

    /**
     * Store an uploaded image resized and re-encoded as WebP.
     */
    public function storeOptimizedWebP(UploadedFile $file, string $directory): string
    {
        $realPath = $file->getRealPath();
        if ($realPath === false || ! is_file($realPath)) {
            throw new \RuntimeException('Gagal membaca file upload: path tidak valid.');
        }

        $disk = (string) config('image.disk', 'public');

        if (! Storage::disk($disk)->exists($directory)) {
            Storage::disk($disk)->makeDirectory($directory);
        }

        $storagePath = $directory.'/'.Str::uuid()->toString().'.webp';
        $absolutePath = Storage::disk($disk)->path($storagePath);

        $absoluteDir = dirname($absolutePath);
        if (! is_dir($absoluteDir)) {
            mkdir($absoluteDir, 0755, true);
        }

        $failures = [];

        foreach ((array) config('image.fallbacks', ['cwebp', 'magick']) as $encoder) {
            if (! $this->encoderAvailable($encoder)) {
                continue;
            }

            try {
                $expected = $this->encode($encoder, $realPath, $absolutePath);

                $this->validateWebP($absolutePath, $encoder, $expected);

                return $storagePath;
            } catch (\Throwable $e) {
                $failures[] = $encoder.': '.$e->getMessage();

                Log::error('ImageService '.$encoder.' conversion failed: '.$e->getMessage(), [
                    'original' => $file->getClientOriginalName(),
                    'directory' => $directory,
                ]);

                if (is_file($absolutePath)) {
                    @unlink($absolutePath);
                }
            }
        }

        $this->ensureWebPSupport();

        throw new \RuntimeException(
            'Gagal mengoptimalkan gambar: tidak ada encoder WebP yang tersedia.'
            .($failures ? ' ('.implode('; ', $failures).')' : '')
        );
    }

    /**
     * Run the configured encoder, resizing as a side effect of encoding.
     *
     * @return array{0: int, 1: int} dimensions to verify the output against,
     *                                  or an empty array when unknown
     */
    private function encode(string $encoder, string $realPath, string $absolutePath): array
    {
        $size = $this->targetSize($realPath);

        $quality = (int) config('image.quality', 85);

        if ($encoder === 'cwebp') {
            $this->encodeViaCwebp($realPath, $absolutePath, $size[0], $size[1], $quality);

            return $size;
        }

        $this->encodeViaMagick($realPath, $absolutePath, $quality);

        return [];
    }

    /**
     * Compute the target dimensions, preserving aspect ratio.
     *
     * @return array{0: int, 1: int}
     */
    private function targetSize(string $realPath): array
    {
        $dimensions = @getimagesize($realPath);
        if ($dimensions === false || empty($dimensions[0]) || empty($dimensions[1])) {
            throw new \RuntimeException('Dimensi gambar tidak dapat dibaca.');
        }

        $width = (int) $dimensions[0];
        $height = (int) $dimensions[1];

        $max = (int) config('image.max_longest_side', 1600);
        if ($max <= 0) {
            return [$width, $height];
        }

        $longest = max($width, $height);
        if ($longest <= $max) {
            return [$width, $height];
        }

        $ratio = $max / $longest;

        return [
            max(1, (int) floor($width * $ratio)),
            max(1, (int) floor($height * $ratio)),
        ];
    }

    /**
     * Encode with cwebp.
     */
    private function encodeViaCwebp(
        string $realPath,
        string $absolutePath,
        int $width,
        int $height,
        int $quality
    ): void {
        $bin = $this->binary('cwebp');
        if ($bin === null) {
            throw new \RuntimeException('Binary cwebp tidak ditemukan.');
        }

        $metadata = config('image.preserve_metadata', true)
            ? '-metadata exif '
            : '-metadata none ';

        $sharpYuv = config('image.sharp_yuv', false) ? '-sharp_yuv ' : '';

        $method = (int) config('image.method', 4);
        $effort = $method > 0 ? sprintf('-m %d ', min(6, $method)) : '';

        $cmd = sprintf(
            '%s -quiet -q %d %s%s%s-resize %d %d %s -o %s 2>&1',
            escapeshellarg($bin),
            $quality,
            $sharpYuv,
            $effort,
            $metadata,
            $width,
            $height,
            escapeshellarg($realPath),
            escapeshellarg($absolutePath)
        );

        $output = [];
        $code = 0;
        exec($cmd, $output, $code);

        if ($code !== 0) {
            throw new \RuntimeException('cwebp gagal: '.trim(implode("\n", $output)));
        }
    }

    /**
     * Encode with the ImageMagick CLI.
     */
    private function encodeViaMagick(string $realPath, string $absolutePath, int $quality): void
    {
        $bin = $this->binary('magick');
        if ($bin === null) {
            throw new \RuntimeException('Binary ImageMagick tidak ditemukan.');
        }

        $max = (int) config('image.max_longest_side', 1600);
        $geometry = $max > 0
            ? sprintf('"%dx%d>"', $max, $max)
            : sprintf('"%dx%d>"', PHP_INT_MAX, PHP_INT_MAX);

        $cmd = sprintf(
            '%s %s -auto-orient -strip -filter %s -resize %s -quality %d %s 2>&1',
            escapeshellarg($bin),
            escapeshellarg($realPath),
            'Lanczos',
            $geometry,
            $quality,
            escapeshellarg($absolutePath)
        );

        $output = [];
        $code = 0;
        exec($cmd, $output, $code);

        if ($code !== 0) {
            throw new \RuntimeException('ImageMagick CLI gagal: '.trim(implode("\n", $output)));
        }
    }

    /**
     * Assert the encoder produced a usable WebP file.
     */
    private function validateWebP(string $absolutePath, string $encoder, array $expected = []): void
    {
        if (! is_file($absolutePath) || filesize($absolutePath) === 0) {
            throw new \RuntimeException('Encoder '.$encoder.' tidak menghasilkan file.');
        }

        $header = file_get_contents($absolutePath, false, null, 0, 12);
        if ($header === false || substr($header, 0, 4) !== 'RIFF' || substr($header, 8, 4) !== 'WEBP') {
            throw new \RuntimeException('Output '.$encoder.' bukan file WebP yang valid.');
        }

        $size = @getimagesize($absolutePath);
        if ($size === false || ($size[0] ?? 0) < 1 || ($size[1] ?? 0) < 1) {
            throw new \RuntimeException('Output '.$encoder.' tidak dapat didekode.');
        }

        if ($expected !== [] && ((int) $size[0] !== $expected[0] || (int) $size[1] !== $expected[1])) {
            throw new \RuntimeException(sprintf(
                'Output %s berukuran %dx%d, seharusnya %dx%d.',
                $encoder,
                $size[0],
                $size[1],
                $expected[0],
                $expected[1]
            ));
        }
    }

    private function encoderAvailable(string $encoder): bool
    {
        return in_array($encoder, ['cwebp', 'magick'], true)
            && $this->binary($encoder) !== null;
    }

    /**
     * Whether the named encoder can be used on this host.
     */
    public function hasEncoder(string $encoder): bool
    {
        return $this->encoderAvailable($encoder);
    }

    /**
     * Resolve an encoder binary, memoized for the process lifetime.
     */
    private function binary(string $encoder): ?string
    {
        if (self::$binaries === null) {
            self::$binaries = [
                'cwebp' => $this->locateCwebpBinary(),
                'magick' => $this->locateMagickBinary(),
            ];
        }

        return self::$binaries[$encoder] ?? null;
    }

    private function locateCwebpBinary(): ?string
    {
        $candidates = ['/opt/lampp/bin/cwebp', '/usr/bin/cwebp', '/usr/local/bin/cwebp', 'cwebp'];

        foreach ($candidates as $bin) {
            if (str_contains($bin, '/')) {
                if (is_executable($bin)) {
                    return $bin;
                }

                continue;
            }

            $resolved = $this->which($bin);
            if ($resolved !== null) {
                return $resolved;
            }
        }

        return null;
    }

    private function locateMagickBinary(): ?string
    {
        $candidates = ['/opt/lampp/bin/magick', '/usr/bin/magick', '/usr/local/bin/magick', 'magick', 'convert'];

        foreach ($candidates as $bin) {
            if (str_contains($bin, '/')) {
                if (is_executable($bin)) {
                    return $bin;
                }

                continue;
            }

            $resolved = $this->which($bin);
            if ($resolved !== null) {
                return $resolved;
            }
        }

        return null;
    }

    /**
     * Locate an executable on PATH without shelling out when possible.
     */
    private function which(string $bin): ?string
    {
        $path = getenv('PATH');
        if (! is_string($path) || $path === '') {
            return null;
        }

        foreach (explode(PATH_SEPARATOR, $path) as $dir) {
            if ($dir === '') {
                continue;
            }

            $candidate = rtrim($dir, '/').'/'.$bin;
            if (is_file($candidate) && is_executable($candidate)) {
                return $candidate;
            }
        }

        return null;
    }

    /**
     * Fail loudly when no WebP encoder can be used at all.
     */
    public function ensureWebPSupport(): void
    {
        if ($this->encoderAvailable('cwebp')) {
            return;
        }

        if ($this->encoderAvailable('magick')) {
            return;
        }

        throw new \RuntimeException(
            'Tidak ada encoder WebP yang tersedia. Diperlukan cwebp atau ImageMagick CLI. '
            .'Ekstensi Imagick dan WebP pada GD tidak digunakan oleh aplikasi ini.'
        );
    }

    /**
     * Whether at least one usable WebP encoder is present.
     */
    public static function isWebPSupported(): bool
    {
        $service = new self;

        return $service->encoderAvailable('cwebp') || $service->encoderAvailable('magick');
    }
}
