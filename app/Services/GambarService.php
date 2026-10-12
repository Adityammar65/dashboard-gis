<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class GambarService
{
    private static ?array $daftarBiner = null;

    // Simpan WebP Teroptimasi

    public function simpanWebPTeroptimasi(UploadedFile $berkas, string $direktori): string
    {
        $jalurAsli = $berkas->getRealPath();
        if ($jalurAsli === false || ! is_file($jalurAsli)) {
            throw new \RuntimeException('Gagal membaca file upload: path tidak valid.');
        }

        $disk = (string) config('image.disk', 'public');

        if (! Storage::disk($disk)->exists($direktori)) {
            Storage::disk($disk)->makeDirectory($direktori);
        }

        $jalurSimpan = $direktori . '/' . Str::uuid()->toString() . '.webp';
        $jalurMutlak = Storage::disk($disk)->path($jalurSimpan);

        $direktoriMutlak = dirname($jalurMutlak);
        if (! is_dir($direktoriMutlak)) {
            mkdir($direktoriMutlak, 0755, true);
        }

        $kegagalan = [];

        foreach ((array) config('image.fallbacks', ['cwebp', 'magick']) as $penkode) {
            if (! $this->penkodeTersedia($penkode)) {
                continue;
            }

            try {
                $diharapkan = $this->kodekan($penkode, $jalurAsli, $jalurMutlak);

                $this->validasiWebP($jalurMutlak, $penkode, $diharapkan);

                return $jalurSimpan;
            } catch (\Throwable $e) {
                $kegagalan[] = $penkode . ': ' . $e->getMessage();

                Log::error('GambarService ' . $penkode . ' konversi gagal: ' . $e->getMessage(), [
                    'asli' => $berkas->getClientOriginalName(),
                    'direktori' => $direktori,
                ]);

                if (is_file($jalurMutlak)) {
                    @unlink($jalurMutlak);
                }
            }
        }

        $this->pastikanDukunganWebP();

        throw new \RuntimeException(
            'Gagal mengoptimalkan gambar: tidak ada penkode WebP yang tersedia.'
                . ($kegagalan ? ' (' . implode('; ', $kegagalan) . ')' : '')
        );
    }

    // Kodekan Gambar

    private function kodekan(string $penkode, string $jalurAsli, string $jalurMutlak): array
    {
        $ukuran = $this->ukuranTarget($jalurAsli);

        $kualitas = (int) config('image.quality', 85);

        if ($penkode === 'cwebp') {
            $this->kodekanViaCwebp($jalurAsli, $jalurMutlak, $ukuran[0], $ukuran[1], $kualitas);

            return $ukuran;
        }

        $this->kodekanViaMagick($jalurAsli, $jalurMutlak, $kualitas);

        return [];
    }

    // Hitung Ukuran Target

    private function ukuranTarget(string $jalurAsli): array
    {
        $dimensi = @getimagesize($jalurAsli);
        if ($dimensi === false || empty($dimensi[0]) || empty($dimensi[1])) {
            throw new \RuntimeException('Dimensi gambar tidak dapat dibaca.');
        }

        $lebar = (int) $dimensi[0];
        $tinggi = (int) $dimensi[1];

        $maks = (int) config('image.max_longest_side', 1600);
        if ($maks <= 0) {
            return [$lebar, $tinggi];
        }

        $terpanjang = max($lebar, $tinggi);
        if ($terpanjang <= $maks) {
            return [$lebar, $tinggi];
        }

        $rasio = $maks / $terpanjang;

        return [
            max(1, (int) floor($lebar * $rasio)),
            max(1, (int) floor($tinggi * $rasio)),
        ];
    }

    // Kodekan via Cwebp

    private function kodekanViaCwebp(
        string $jalurAsli,
        string $jalurMutlak,
        int $lebar,
        int $tinggi,
        int $kualitas
    ): void {
        $biner = $this->biner('cwebp');
        if ($biner === null) {
            throw new \RuntimeException('Biner cwebp tidak ditemukan.');
        }

        $metadata = config('image.preserve_metadata', true)
            ? '-metadata exif '
            : '-metadata none ';

        $sharpYuv = config('image.sharp_yuv', false) ? '-sharp_yuv ' : '';

        $method = (int) config('image.method', 4);
        $effort = $method > 0 ? sprintf('-m %d ', min(6, $method)) : '';

        $perintah = sprintf(
            '%s -quiet -q %d %s%s%s-resize %d %d %s -o %s 2>&1',
            escapeshellarg($biner),
            $kualitas,
            $sharpYuv,
            $effort,
            $metadata,
            $lebar,
            $tinggi,
            escapeshellarg($jalurAsli),
            escapeshellarg($jalurMutlak)
        );

        $keluaran = [];
        $kode = 0;
        exec($perintah, $keluaran, $kode);

        if ($kode !== 0) {
            throw new \RuntimeException('cwebp gagal: ' . trim(implode("\n", $keluaran)));
        }
    }

    // Kodekan via ImageMagick

    private function kodekanViaMagick(string $jalurAsli, string $jalurMutlak, int $kualitas): void
    {
        $biner = $this->biner('magick');
        if ($biner === null) {
            throw new \RuntimeException('Biner ImageMagick tidak ditemukan.');
        }

        $maks = (int) config('image.max_longest_side', 1600);
        $geometri = $maks > 0
            ? sprintf('"%dx%d>"', $maks, $maks)
            : sprintf('"%dx%d>"', PHP_INT_MAX, PHP_INT_MAX);

        $perintah = sprintf(
            '%s %s -auto-orient -strip -filter %s -resize %s -quality %d %s 2>&1',
            escapeshellarg($biner),
            escapeshellarg($jalurAsli),
            'Lanczos',
            $geometri,
            $kualitas,
            escapeshellarg($jalurMutlak)
        );

        $keluaran = [];
        $kode = 0;
        exec($perintah, $keluaran, $kode);

        if ($kode !== 0) {
            throw new \RuntimeException('ImageMagick CLI gagal: ' . trim(implode("\n", $keluaran)));
        }
    }

    // Validasi WebP

    private function validasiWebP(string $jalurMutlak, string $penkode, array $diharapkan = []): void
    {
        if (! is_file($jalurMutlak) || filesize($jalurMutlak) === 0) {
            throw new \RuntimeException('Penkode ' . $penkode . ' tidak menghasilkan berkas.');
        }

        $kepala = file_get_contents($jalurMutlak, false, null, 0, 12);
        if ($kepala === false || substr($kepala, 0, 4) !== 'RIFF' || substr($kepala, 8, 4) !== 'WEBP') {
            throw new \RuntimeException('Keluaran ' . $penkode . ' bukan berkas WebP yang valid.');
        }

        $ukuran = @getimagesize($jalurMutlak);
        if ($ukuran === false || ($ukuran[0] ?? 0) < 1 || ($ukuran[1] ?? 0) < 1) {
            throw new \RuntimeException('Keluaran ' . $penkode . ' tidak dapat didekode.');
        }

        if ($diharapkan !== [] && ((int) $ukuran[0] !== $diharapkan[0] || (int) $ukuran[1] !== $diharapkan[1])) {
            throw new \RuntimeException(sprintf(
                'Keluaran %s berukuran %dx%d, seharusnya %dx%d.',
                $penkode,
                $ukuran[0],
                $ukuran[1],
                $diharapkan[0],
                $diharapkan[1]
            ));
        }
    }

    // Cek Penkode Tersedia

    private function penkodeTersedia(string $penkode): bool
    {
        return in_array($penkode, ['cwebp', 'magick'], true)
            && $this->biner($penkode) !== null;
    }

    // Cek Penkode Publik

    public function memilikiPenkode(string $penkode): bool
    {
        return $this->penkodeTersedia($penkode);
    }

    // Ambil Biner Penkode

    private function biner(string $penkode): ?string
    {
        if (self::$daftarBiner === null) {
            self::$daftarBiner = [
                'cwebp' => $this->cariBinerCwebp(),
                'magick' => $this->cariBinerMagick(),
            ];
        }

        return self::$daftarBiner[$penkode] ?? null;
    }

    // Cari Biner Cwebp

    private function cariBinerCwebp(): ?string
    {
        $kandidat = ['/opt/lampp/bin/cwebp', '/usr/bin/cwebp', '/usr/local/bin/cwebp', 'cwebp'];

        foreach ($kandidat as $biner) {
            if (str_contains($biner, '/')) {
                if (is_executable($biner)) {
                    return $biner;
                }

                continue;
            }

            $terpecahkan = $this->cariDiPath($biner);
            if ($terpecahkan !== null) {
                return $terpecahkan;
            }
        }

        return null;
    }

    // Cari Biner ImageMagick

    private function cariBinerMagick(): ?string
    {
        $kandidat = ['/opt/lampp/bin/magick', '/usr/bin/magick', '/usr/local/bin/magick', 'magick', 'convert'];

        foreach ($kandidat as $biner) {
            if (str_contains($biner, '/')) {
                if (is_executable($biner)) {
                    return $biner;
                }

                continue;
            }

            $terpecahkan = $this->cariDiPath($biner);
            if ($terpecahkan !== null) {
                return $terpecahkan;
            }
        }

        return null;
    }

    // Cari di PATH

    private function cariDiPath(string $biner): ?string
    {
        $path = getenv('PATH');
        if (! is_string($path) || $path === '') {
            return null;
        }

        foreach (explode(PATH_SEPARATOR, $path) as $direktori) {
            if ($direktori === '') {
                continue;
            }

            $kandidatTunggal = rtrim($direktori, '/') . '/' . $biner;
            if (is_file($kandidatTunggal) && is_executable($kandidatTunggal)) {
                return $kandidatTunggal;
            }
        }

        return null;
    }

    // Pastikan Dukungan WebP

    public function pastikanDukunganWebP(): void
    {
        if ($this->penkodeTersedia('cwebp')) {
            return;
        }

        if ($this->penkodeTersedia('magick')) {
            return;
        }

        throw new \RuntimeException(
            'Tidak ada penkode WebP yang tersedia. Diperlukan cwebp atau ImageMagick CLI. '
                . 'Ekstensi Imagick dan WebP pada GD tidak digunakan oleh aplikasi ini.'
        );
    }

    // Cek Dukungan WebP Statis

    public static function apakahWebPDidukung(): bool
    {
        $service = new self;

        return $service->penkodeTersedia('cwebp') || $service->penkodeTersedia('magick');
    }
}
