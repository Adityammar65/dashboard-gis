<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\WilayahModel;
use App\Models\TiangModel;
use App\Models\ONTModel;
use App\Helpers\NotifikasiHelper;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use Illuminate\Database\QueryException;

class WilayahController extends Controller
{
    // Tambah Wilayah

    public function SimpanWilayah(Request $request)
    {
        try {
            $tervalidasi = $request->validate([
                'nama_wilayah' => 'required|string|max:255|unique:wilayah,nama_wilayah',
                'kode_wilayah' => 'required|string|max:255|unique:wilayah,kode_wilayah',
            ], [
                'nama_wilayah.required' => 'Nama Wilayah wajib diisi.',
                'nama_wilayah.unique' => 'Nama Wilayah sudah digunakan.',
                'kode_wilayah.required' => 'Kode Wilayah wajib diisi.',
                'kode_wilayah.unique' => 'Kode Wilayah sudah digunakan.',
            ]);

            $data = [
                'nama_wilayah' => $tervalidasi['nama_wilayah'],
                'kode_wilayah' => $tervalidasi['kode_wilayah'],
            ];

            WilayahModel::create($data);

            Cache::forget('wilayah:list');
            Cache::forget('wilayah:name:' . strtolower($data['nama_wilayah']));

            NotifikasiHelper::kirim('Data Wilayah Ditambahkan', 'wilayah', "Wilayah {$data['nama_wilayah']} ({$data['kode_wilayah']}) berhasil ditambahkan.");

            return redirect('wilayah')->with('success', 'Data wilayah berhasil ditambahkan.');
        } catch (QueryException $e) {
            Log::error('SimpanWilayah KesalahanKueri: ' . $e->getMessage());
            return redirect()->back()->withErrors($this->uraiKesalahanKueri($e))->withInput();
        } catch (\Throwable $e) {
            if ($e instanceof \Illuminate\Validation\ValidationException) {
                throw $e;
            }
            Log::error('SimpanWilayah Galat: ' . $e->getMessage());
            return redirect()->back()->withErrors(['error' => $e->getMessage()])->withInput();
        }
    }

    // Hapus Wilayah

    public function HapusWilayah($id)
    {
        $wilayah = WilayahModel::findOrFail($id);
        $nama = $wilayah->nama_wilayah;
        $kode = $wilayah->kode_wilayah;

        $tiangCount = TiangModel::where('wilayah', $nama)->count();
        $ontCount = ONTModel::where('wilayah', $nama)->count();

        if ($tiangCount > 0 || $ontCount > 0) {
            $parts = [];
            if ($tiangCount > 0) $parts[] = $tiangCount . ' data tiang';
            if ($ontCount > 0) $parts[] = $ontCount . ' data ONT';
            $detail = implode(' dan ', $parts);
            $pesan = "Wilayah \"{$nama}\" tidak dapat dihapus karena masih memiliki {$detail}. Hapus atau pindahkan data terkait terlebih dahulu.";
            return redirect()->back()->withErrors(['error' => $pesan])->with('error', $pesan);
        }

        $wilayah->delete();

        Cache::forget('wilayah:list');
        Cache::forget('wilayah:' . $id);
        Cache::forget('wilayah:name:' . strtolower($nama));

        NotifikasiHelper::kirim('Data Wilayah Dihapus', 'wilayah', "Wilayah {$nama} ({$kode}) berhasil dihapus.");

        return redirect('wilayah')->with('success', 'Data wilayah berhasil dihapus.');
    }

    // Tangani Pesan Kesalahan

    private function uraiKesalahanKueri(QueryException $e): array
    {
        $pesan = $e->getMessage();
        if (str_contains($pesan, 'cannot be null') || str_contains($pesan, "doesn't have a default value") || str_contains($pesan, '1048') || str_contains($pesan, '1364') || preg_match("/(Column|Field) '[^']+' (cannot be null|doesn't have a default value)/", $pesan)) {
            if (preg_match("/(?:Column|Field) '([^']+)'/", $pesan, $m)) {
                $col = $m[1];
                $labels = ['nama_wilayah' => 'Nama Wilayah', 'kode_wilayah' => 'Kode Wilayah'];
                return [$col => ($labels[$col] ?? $col) . ' wajib diisi.'];
            }
            return ['error' => 'Ada field wajib yang belum diisi.'];
        }
        if (str_contains($pesan, 'Duplicate entry') || str_contains($pesan, 'UNIQUE') || str_contains($pesan, 'unique constraint') || str_contains($pesan, '1062')) {
            if (str_contains($pesan, 'nama_wilayah')) return ['nama_wilayah' => 'Nama Wilayah sudah digunakan. Gunakan nama lain.'];
            if (str_contains($pesan, 'kode_wilayah')) return ['kode_wilayah' => 'Kode Wilayah sudah digunakan. Gunakan kode lain.'];
            if (preg_match("/for key '[^']*\.([^']+)'/", $pesan, $m)) {
                $col = $m[1];
                return [$col => ucfirst(str_replace('_', ' ', $col)) . ' sudah digunakan.'];
            }
            return ['error' => 'Data sudah ada (duplikat). Periksa kembali kode unik.'];
        }
        if (str_contains($pesan, 'foreign key') || str_contains($pesan, '1452')) return ['error' => 'Data relasi tidak valid.'];
        Log::warning('KesalahanKueri Wilayah tak terpetakan: ' . $pesan);
        return ['error' => 'Gagal menyimpan data wilayah: ' . $this->ambilRincianSql($pesan)];
    }

    private function ambilRincianSql(string $pesan): string
    {
        if (preg_match('/SQLSTATE\[.*?\]:\s*(.+?)(?:\s*\(|$)/', $pesan, $m)) return trim($m[1]);
        return mb_substr($pesan, -200);
    }
}
