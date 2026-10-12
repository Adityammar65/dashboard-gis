<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\WilayahModel;

class WilayahApiController extends Controller
{
    // Ambil Wilayah Saat Ini

    private function ambilWilayahSaatIni(): ?WilayahModel
    {
        $settings = Cache::remember('settings', 3600, function () {
            $path = storage_path('app/settings.json');
            if (!file_exists($path)) return [];
            return json_decode(file_get_contents($path), true) ?? [];
        });
        $id = $settings['id'] ?? null;
        $nama = $settings['nama_wilayah'] ?? null;
        if ($id) {
            $w = WilayahModel::find($id);
            if ($w) return $w;
        }
        if ($nama) {
            return WilayahModel::where('nama_wilayah', $nama)->first();
        }
        return WilayahModel::first();
    }

    // Uraikan Kode Kemendagri

    private function uraikanKodeKemendagri(WilayahModel $wilayah): ?string
    {
        if (isset($wilayah->kemendagri_code) && $wilayah->kemendagri_code) {
            return (string) $wilayah->kemendagri_code;
        }
        $peta = config('regions.map', [
            'yogyakarta' => '3471',
            'sleman' => '3404',
            'bantul' => '3402',
            'kulon progo' => '3401',
            'gunungkidul' => '3403',
            'jepara' => '3320',
            'sukoharjo' => '3311',
            'magelang' => '3308',
        ]);
        $kunci = strtolower(trim($wilayah->nama_wilayah));
        return $peta[$kunci] ?? null;
    }

    // Kecamatan Berdasarkan Kabupaten

    public function kecamatanBerdasarkanKabupaten(Request $request, $kode)
    {
        $masukan = trim((string) $kode);
        $wilayah = WilayahModel::where('kode_wilayah', $masukan)->orWhere('nama_wilayah', $masukan)->first();
        $kodeKemendagri = null;
        $wilayahUntukMeta = $wilayah;
        if ($wilayah) {
            $kodeKemendagri = $this->uraikanKodeKemendagri($wilayah);
        } else {
            $kodeKemendagri = $masukan;
            $wilayahUntukMeta = null;
        }
        if (!$kodeKemendagri) {
            return response()->json(['data' => [], 'meta' => ['source' => 'fallback', 'warning' => 'Kode Kemendagri tidak ditemukan untuk wilayah ' . $masukan]]);
        }

        $kunciTembolok = "regions:kecamatan:kabupaten:$kodeKemendagri";
        $hasil = Cache::remember($kunciTembolok, 86400, function () use ($kodeKemendagri) {
            $apiKey = config('services.api_indonesia.key') ?? env('API_INDONESIA_KEY');
            if ($apiKey) {
                try {
                    $res = Http::withHeaders(['x-api-key' => $apiKey])
                        ->timeout(5)
                        ->get("https://use.apiindonesia.id/api/v1/wilayah/kecamatan", [
                            'kabupaten_id' => $kode,
                            'per_page' => 100,
                        ]);
                    if ($res->successful()) {
                        $json = $res->json();
                        $data = $json['data'] ?? [];
                        $norm = collect($data)->map(fn($it) => [
                            'code' => $it['code'] ?? $it['id'] ?? '',
                            'name' => $it['name'] ?? $it['alt_name'] ?? '',
                            '_raw' => $it,
                        ])->values()->all();
                        return ['data' => $norm, 'source' => 'api_indonesia', 'meta' => $json['meta'] ?? []];
                    }
                    Log::warning("API Wilayah Indonesia kecamatan gagal: " . $res->status() . " " . $res->body());
                } catch (\Throwable $e) {
                    Log::warning("Pengecualian API Wilayah Indonesia: " . $e->getMessage());
                }
            }

            $kodeWilayahId = $this->formatUntukIdWilayah($kode, 'kabupaten');
            foreach ([$kode, $kodeWilayahId] as $kodeCoba) {
                try {
                    $res = Http::timeout(5)->get("https://wilayah.id/api/districts/{$kodeCoba}.json");
                    if ($res->successful()) {
                        $json = $res->json();
                        $data = $json['data'] ?? [];
                        $norm = collect($data)->map(fn($it) => [
                            'code' => $it['code'] ?? '',
                            'name' => $it['name'] ?? '',
                            '_raw' => $it,
                        ])->values()->all();
                        if (!empty($norm)) return ['data' => $norm, 'source' => 'wilayah.id', 'meta' => $json['meta'] ?? []];
                    }
                } catch (\Throwable $e) {
                    Log::warning("Pengambilan distrik Wilayah.id gagal: " . $e->getMessage());
                }
            }

            return null;
        });

        if ($hasil && !empty($hasil['data'])) {
            return response()->json([
                'data' => $hasil['data'],
                'meta' => array_merge($hasil['meta'] ?? [], ['source' => $hasil['source'], 'kabupaten' => $wilayahUntukMeta?->nama_wilayah ?? $masukan, 'kabupaten_code' => $kodeKemendagri]),
            ]);
        }
        return response()->json([
            'data' => [],
            'meta' => ['source' => 'fallback', 'warning' => 'Gagal memuat kecamatan dari API, silakan isi manual', 'kabupaten' => $wilayahUntukMeta?->nama_wilayah ?? $masukan],
        ]);
    }

    // Format Kode untuk Wilayah.id

    private function formatUntukIdWilayah(string $kode, string $tingkat): string
    {
        $angka = preg_replace('/[^0-9]/', '', $kode);
        if ($tingkat === 'kabupaten' && strlen($angka) === 4) return substr($angka, 0, 2) . '.' . substr($angka, 2);
        if ($tingkat === 'kecamatan' && strlen($angka) === 7) return substr($angka, 0, 2) . '.' . substr($angka, 2, 2) . '.' . substr($angka, 4);
        if ($tingkat === 'kecamatan' && strlen($angka) === 6) return substr($angka, 0, 2) . '.' . substr($angka, 2, 2) . '.' . substr($angka, 4);

        if (str_contains($kode, '.')) return $kode;
        return $kode;
    }

    // Kecamatan Wilayah Aktif

    public function kecamatanSaatIni(Request $request)
    {
        $wilayah = $this->ambilWilayahSaatIni();
        if (!$wilayah) {
            return response()->json(['data' => [], 'meta' => ['source' => 'fallback', 'warning' => 'Wilayah tidak ditemukan']]);
        }

        $kode = $request->query('kabupaten_id') ?? $this->uraikanKodeKemendagri($wilayah);
        if (!$kode) {
            return response()->json(['data' => [], 'meta' => ['source' => 'fallback', 'warning' => 'Kode Kemendagri tidak ditemukan untuk wilayah ' . $wilayah->nama_wilayah]]);
        }

        $kunciTembolok = "regions:kecamatan:kabupaten:$kode";
        $hasil = Cache::remember($kunciTembolok, 86400, function () use ($kode) {
            $apiKey = config('services.api_indonesia.key') ?? env('API_INDONESIA_KEY');
            if ($apiKey) {
                try {
                    $res = Http::withHeaders(['x-api-key' => $apiKey])
                        ->timeout(5)
                        ->get("https://use.apiindonesia.id/api/v1/wilayah/kecamatan", [
                            'kabupaten_id' => $kode,
                            'per_page' => 100,
                        ]);
                    if ($res->successful()) {
                        $json = $res->json();
                        $data = $json['data'] ?? [];
                        $norm = collect($data)->map(fn($it) => [
                            'code' => $it['code'] ?? $it['id'] ?? '',
                            'name' => $it['name'] ?? $it['alt_name'] ?? '',
                            '_raw' => $it,
                        ])->values()->all();
                        return ['data' => $norm, 'source' => 'api_indonesia', 'meta' => $json['meta'] ?? []];
                    }
                    Log::warning("API Wilayah Indonesia kecamatan gagal: " . $res->status() . " " . $res->body());
                } catch (\Throwable $e) {
                    Log::warning("Pengecualian API Wilayah Indonesia: " . $e->getMessage());
                }
            }

            $kodeWilayahId = $this->formatUntukIdWilayah($kode, 'kabupaten');
            foreach ([$kode, $kodeWilayahId] as $kodeCoba) {
                try {
                    $res = Http::timeout(5)->get("https://wilayah.id/api/districts/{$kodeCoba}.json");
                    if ($res->successful()) {
                        $json = $res->json();
                        $data = $json['data'] ?? [];
                        $norm = collect($data)->map(fn($it) => [
                            'code' => $it['code'] ?? '',
                            'name' => $it['name'] ?? '',
                            '_raw' => $it,
                        ])->values()->all();
                        if (!empty($norm)) return ['data' => $norm, 'source' => 'wilayah.id', 'meta' => $json['meta'] ?? []];
                    }
                } catch (\Throwable $e) {
                    Log::warning("Pengambilan distrik Wilayah.id gagal: " . $e->getMessage());
                }
            }
            return null;
        });

        if ($hasil && !empty($hasil['data'])) {
            return response()->json([
                'data' => $hasil['data'],
                'meta' => array_merge($hasil['meta'] ?? [], ['source' => $hasil['source'], 'kabupaten' => $wilayah->nama_wilayah, 'kabupaten_code' => $kode]),
            ]);
        }

        return response()->json([
            'data' => [],
            'meta' => ['source' => 'fallback', 'warning' => 'Gagal memuat kecamatan dari API, silakan isi manual', 'kabupaten' => $wilayah->nama_wilayah],
        ]);
    }

    // Kelurahan Berdasarkan Kecamatan

    public function kelurahanBerdasarkanKecamatan(Request $request, $kode)
    {
        $kode = trim((string) $kode);
        if ($kode === '') {
            return response()->json(['data' => [], 'meta' => ['source' => 'fallback', 'warning' => 'Kode kecamatan kosong']]);
        }

        $kunciTembolok = "regions:kelurahan:kecamatan:$kode";
        $hasil = Cache::remember($kunciTembolok, 86400, function () use ($kode) {
            $apiKey = config('services.api_indonesia.key') ?? env('API_INDONESIA_KEY');
            if ($apiKey) {
                try {
                    $res = Http::withHeaders(['x-api-key' => $apiKey])
                        ->timeout(5)
                        ->get("https://use.apiindonesia.id/api/v1/wilayah/kelurahan", [
                            'kecamatan_id' => $kode,
                            'per_page' => 100,
                        ]);
                    if ($res->successful()) {
                        $json = $res->json();
                        $data = $json['data'] ?? [];
                        $norm = collect($data)->map(fn($it) => [
                            'code' => $it['code'] ?? $it['id'] ?? '',
                            'name' => $it['name'] ?? $it['alt_name'] ?? '',
                            '_raw' => $it,
                        ])->values()->all();
                        return ['data' => $norm, 'source' => 'api_indonesia', 'meta' => $json['meta'] ?? []];
                    }
                    Log::warning("API Wilayah Indonesia kelurahan gagal: " . $res->status());
                } catch (\Throwable $e) {
                    Log::warning("Pengecualian API kelurahan Wilayah: " . $e->getMessage());
                }
            }

            $kodeWilayahId = $this->formatUntukIdWilayah($kode, 'kecamatan');
            foreach ([$kode, $kodeWilayahId] as $kodeCoba) {
                try {
                    $res = Http::timeout(5)->get("https://wilayah.id/api/villages/{$kodeCoba}.json");
                    if ($res->successful()) {
                        $json = $res->json();
                        $data = $json['data'] ?? [];
                        $norm = collect($data)->map(fn($it) => [
                            'code' => $it['code'] ?? '',
                            'name' => $it['name'] ?? '',
                            '_raw' => $it,
                        ])->values()->all();
                        if (!empty($norm)) return ['data' => $norm, 'source' => 'wilayah.id', 'meta' => $json['meta'] ?? []];
                    }
                } catch (\Throwable $e) {
                    Log::warning("Pengambilan desa Wilayah.id gagal: " . $e->getMessage());
                }
            }
            return null;
        });

        if ($hasil && isset($hasil['data'])) {
            return response()->json([
                'data' => $hasil['data'],
                'meta' => array_merge($hasil['meta'] ?? [], ['source' => $hasil['source'], 'kecamatan_code' => $kode]),
            ]);
        }

        return response()->json([
            'data' => [],
            'meta' => ['source' => 'fallback', 'warning' => 'Gagal memuat kelurahan dari API, silakan isi manual', 'kecamatan_code' => $kode],
        ]);
    }
}
