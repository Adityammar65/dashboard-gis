<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TiangModel;
use App\Helpers\NotifikasiHelper;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\QueryException;
use App\Services\GambarService;

class TiangController extends Controller
{
    // Tambah Tiang

    public function SimpanTiang(Request $request)
    {
        $berkasTersimpan = [];
        try {
            $tervalidasi = $request->validate([
                'kode_tiang'      => 'required|string|max:255|unique:tiang,kode_tiang',
                'wilayah'         => 'required|string|max:255',
                'kecamatan'       => 'required|string|max:255',
                'kelurahan'       => 'required|string|max:255',
                'deskripsi_tiang' => 'required|string',
                'foto_tiang_1'    => 'required|image|mimes:jpg,jpeg,png,webp|max:5120',
                'foto_tiang_2'    => 'required|image|mimes:jpg,jpeg,png,webp|max:5120',
                'foto_tiang_3'    => 'required|image|mimes:jpg,jpeg,png,webp|max:5120',
                'foto_tiang_4'    => 'required|image|mimes:jpg,jpeg,png,webp|max:5120',
                'foto_tiang_5'    => 'required|image|mimes:jpg,jpeg,png,webp|max:5120',
                'latitude'        => 'required|numeric',
                'longitude'       => 'required|numeric',
                'nama_petugas'    => 'required|string|max:255',
                'status' => 'required|in:Aktif,Nonaktif,aktif,nonaktif',
            ], [
                'kode_tiang.required' => 'Kode Tiang wajib diisi.',
                'kode_tiang.unique' => 'Kode Tiang sudah digunakan.',
                'kecamatan.required' => 'Kecamatan wajib diisi.',
                'kelurahan.required' => 'Kelurahan wajib diisi.',
                'wilayah.required' => 'Wilayah wajib diisi.',
                'deskripsi_tiang.required' => 'Deskripsi Tiang wajib diisi.',
                'foto_tiang_1.required' => 'Foto Tiang 1 wajib diisi.',
                'foto_tiang_2.required' => 'Foto Tiang 2 wajib diisi.',
                'foto_tiang_3.required' => 'Foto Tiang 3 wajib diisi.',
                'foto_tiang_4.required' => 'Foto Tiang 4 wajib diisi.',
                'foto_tiang_5.required' => 'Foto Tiang 5 wajib diisi.',
                'foto_tiang_1.image' => 'Foto Tiang 1 harus berupa gambar.',
                'foto_tiang_2.image' => 'Foto Tiang 2 harus berupa gambar.',
                'foto_tiang_3.image' => 'Foto Tiang 3 harus berupa gambar.',
                'foto_tiang_4.image' => 'Foto Tiang 4 harus berupa gambar.',
                'foto_tiang_5.image' => 'Foto Tiang 5 harus berupa gambar.',
                'latitude.required' => 'Latitude wajib diisi.',
                'latitude.numeric' => 'Latitude harus berupa angka.',
                'longitude.required' => 'Longitude wajib diisi.',
                'longitude.numeric' => 'Longitude harus berupa angka.',
                'nama_petugas.required' => 'Nama Petugas wajib diisi.',
                'status.required' => 'Status wajib diisi.',
                'status.in' => 'Status tidak valid.',
            ]);
            $tervalidasi['status'] = strtolower($tervalidasi['status']);
            $data = [
                'kode_tiang'      => $tervalidasi['kode_tiang'],
                'wilayah'         => $tervalidasi['wilayah'],
                'kecamatan'       => $tervalidasi['kecamatan'],
                'kelurahan'       => $tervalidasi['kelurahan'],
                'deskripsi_tiang' => $tervalidasi['deskripsi_tiang'],
                'latitude'        => $tervalidasi['latitude'],
                'longitude'       => $tervalidasi['longitude'],
                'nama_petugas'    => $tervalidasi['nama_petugas'],
                'status'          => $tervalidasi['status'],
            ];
            if (!Storage::disk('public')->exists('tiang')) Storage::disk('public')->makeDirectory('tiang');
            if ($request->hasFile('foto_tiang_1')) {
                $path = app(GambarService::class)->simpanWebPTeroptimasi($request->file('foto_tiang_1'), 'tiang');
                $data['foto_tiang_1'] = $path;
                $berkasTersimpan[] = $path;
            }
            if ($request->hasFile('foto_tiang_2')) {
                $path = app(GambarService::class)->simpanWebPTeroptimasi($request->file('foto_tiang_2'), 'tiang');
                $data['foto_tiang_2'] = $path;
                $berkasTersimpan[] = $path;
            }
            if ($request->hasFile('foto_tiang_3')) {
                $path = app(GambarService::class)->simpanWebPTeroptimasi($request->file('foto_tiang_3'), 'tiang');
                $data['foto_tiang_3'] = $path;
                $berkasTersimpan[] = $path;
            }
            if ($request->hasFile('foto_tiang_4')) {
                $path = app(GambarService::class)->simpanWebPTeroptimasi($request->file('foto_tiang_4'), 'tiang');
                $data['foto_tiang_4'] = $path;
                $berkasTersimpan[] = $path;
            }
            if ($request->hasFile('foto_tiang_5')) {
                $path = app(GambarService::class)->simpanWebPTeroptimasi($request->file('foto_tiang_5'), 'tiang');
                $data['foto_tiang_5'] = $path;
                $berkasTersimpan[] = $path;
            }
            TiangModel::create($data);
            NotifikasiHelper::kirim('Data Tiang Ditambahkan', 'tiang', NotifikasiHelper::detailPesan('ditambahkan', 'tiang', [], $data));
            return redirect('data-tiang')->with('success', NotifikasiHelper::pesanKeberhasilan('ditambahkan', 'tiang', $data['kode_tiang'], $data['nama_petugas']));
        } catch (QueryException $e) {
            $this->bersihkanBerkas($berkasTersimpan);
            Log::error('SimpanTiang KesalahanKueri: ' . $e->getMessage());
            return redirect()->back()->withErrors($this->uraiKesalahanKueri($e))->withInput();
        } catch (\Throwable $e) {
            if ($e instanceof \Illuminate\Validation\ValidationException) {
                $this->bersihkanBerkas($berkasTersimpan);
                throw $e;
            }
            $this->bersihkanBerkas($berkasTersimpan);
            Log::error('SimpanTiang Galat: ' . $e->getMessage());
            return redirect()->back()->withErrors(['error' => $e->getMessage()])->withInput();
        }
    }

    // Update Data Tiang

    public function PerbaruiTiang(Request $request, $id)
    {
        $berkasBaru = [];
        $berkasLamaDihapus = [];
        try {
            $tiang = TiangModel::findOrFail($id);
            $tervalidasi = $request->validate([
                'kode_tiang'      => 'required|string|max:255|unique:tiang,kode_tiang,' . $id,
                'wilayah'         => 'required|string|max:255',
                'kecamatan'       => 'required|string|max:255',
                'kelurahan'       => 'required|string|max:255',
                'deskripsi_tiang' => 'required|string',
                'foto_tiang_1'    => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
                'foto_tiang_2'    => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
                'foto_tiang_3'    => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
                'foto_tiang_4'    => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
                'foto_tiang_5'    => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
                'hapus_foto_1'    => 'nullable|boolean',
                'hapus_foto_2'    => 'nullable|boolean',
                'hapus_foto_3'    => 'nullable|boolean',
                'hapus_foto_4'    => 'nullable|boolean',
                'hapus_foto_5'    => 'nullable|boolean',
                'latitude'        => 'required|numeric',
                'longitude'       => 'required|numeric',
                'nama_petugas'    => 'required|string|max:255',
                'status'          => 'required|in:aktif,nonaktif',
            ], [
                'kode_tiang.required' => 'Kode Tiang wajib diisi.',
                'kode_tiang.unique' => 'Kode Tiang sudah digunakan.',
                'kecamatan.required' => 'Kecamatan wajib diisi.',
                'kelurahan.required' => 'Kelurahan wajib diisi.',
                'wilayah.required' => 'Wilayah wajib diisi.',
                'deskripsi_tiang.required' => 'Deskripsi Tiang wajib diisi.',
                'latitude.required' => 'Latitude wajib diisi.',
                'latitude.numeric' => 'Latitude harus berupa angka.',
                'longitude.required' => 'Longitude wajib diisi.',
                'longitude.numeric' => 'Longitude harus berupa angka.',
                'nama_petugas.required' => 'Nama Petugas wajib diisi.',
                'status.required' => 'Status wajib diisi.',
                'status.in' => 'Status tidak valid.',
            ]);
            $data = [
                'kode_tiang'      => $tervalidasi['kode_tiang'],
                'wilayah'         => $tervalidasi['wilayah'],
                'kecamatan'       => $tervalidasi['kecamatan'],
                'kelurahan'       => $tervalidasi['kelurahan'],
                'deskripsi_tiang' => $tervalidasi['deskripsi_tiang'],
                'latitude'        => $tervalidasi['latitude'],
                'longitude'       => $tervalidasi['longitude'],
                'nama_petugas'    => $tervalidasi['nama_petugas'],
                'status'          => $tervalidasi['status'],
            ];
            if (!Storage::disk('public')->exists('tiang')) Storage::disk('public')->makeDirectory('tiang');
            if ($request->hasFile('foto_tiang_1')) {
                $path = app(GambarService::class)->simpanWebPTeroptimasi($request->file('foto_tiang_1'), 'tiang');
                $data['foto_tiang_1'] = $path;
                $berkasBaru[] = $path;
                if ($tiang->foto_tiang_1) $berkasLamaDihapus[] = $tiang->foto_tiang_1;
            } elseif ($request->boolean('hapus_foto_1')) {
                if ($tiang->foto_tiang_1) $berkasLamaDihapus[] = $tiang->foto_tiang_1;
                $data['foto_tiang_1'] = null;
            }
            if ($request->hasFile('foto_tiang_2')) {
                $path = app(GambarService::class)->simpanWebPTeroptimasi($request->file('foto_tiang_2'), 'tiang');
                $data['foto_tiang_2'] = $path;
                $berkasBaru[] = $path;
                if ($tiang->foto_tiang_2) $berkasLamaDihapus[] = $tiang->foto_tiang_2;
            } elseif ($request->boolean('hapus_foto_2')) {
                if ($tiang->foto_tiang_2) $berkasLamaDihapus[] = $tiang->foto_tiang_2;
                $data['foto_tiang_2'] = null;
            }
            if ($request->hasFile('foto_tiang_3')) {
                $path = app(GambarService::class)->simpanWebPTeroptimasi($request->file('foto_tiang_3'), 'tiang');
                $data['foto_tiang_3'] = $path;
                $berkasBaru[] = $path;
                if ($tiang->foto_tiang_3) $berkasLamaDihapus[] = $tiang->foto_tiang_3;
            } elseif ($request->boolean('hapus_foto_3')) {
                if ($tiang->foto_tiang_3) $berkasLamaDihapus[] = $tiang->foto_tiang_3;
                $data['foto_tiang_3'] = null;
            }
            if ($request->hasFile('foto_tiang_4')) {
                $path = app(GambarService::class)->simpanWebPTeroptimasi($request->file('foto_tiang_4'), 'tiang');
                $data['foto_tiang_4'] = $path;
                $berkasBaru[] = $path;
                if ($tiang->foto_tiang_4) $berkasLamaDihapus[] = $tiang->foto_tiang_4;
            } elseif ($request->boolean('hapus_foto_4')) {
                if ($tiang->foto_tiang_4) $berkasLamaDihapus[] = $tiang->foto_tiang_4;
                $data['foto_tiang_4'] = null;
            }
            if ($request->hasFile('foto_tiang_5')) {
                $path = app(GambarService::class)->simpanWebPTeroptimasi($request->file('foto_tiang_5'), 'tiang');
                $data['foto_tiang_5'] = $path;
                $berkasBaru[] = $path;
                if ($tiang->foto_tiang_5) $berkasLamaDihapus[] = $tiang->foto_tiang_5;
            } elseif ($request->boolean('hapus_foto_5')) {
                if ($tiang->foto_tiang_5) $berkasLamaDihapus[] = $tiang->foto_tiang_5;
                $data['foto_tiang_5'] = null;
            }
            $lama = $tiang->toArray();
            $tiang->update($data);
            $this->bersihkanBerkas($berkasLamaDihapus);
            NotifikasiHelper::kirim('Data Tiang Diperbarui', 'tiang', NotifikasiHelper::detailPesan('diperbarui', 'tiang', $lama, $data));
            return redirect('data-tiang')->with('success', NotifikasiHelper::pesanKeberhasilan('diperbarui', 'tiang', $data['kode_tiang'], $data['nama_petugas']));
        } catch (QueryException $e) {
            $this->bersihkanBerkas($berkasBaru);
            Log::error('PerbaruiTiang KesalahanKueri: ' . $e->getMessage());
            return redirect()->back()->withErrors($this->uraiKesalahanKueri($e))->withInput();
        } catch (\Throwable $e) {
            if ($e instanceof \Illuminate\Validation\ValidationException) {
                $this->bersihkanBerkas($berkasBaru);
                throw $e;
            }
            $this->bersihkanBerkas($berkasBaru);
            Log::error('PerbaruiTiang Galat: ' . $e->getMessage());
            return redirect()->back()->withErrors(['error' => $e->getMessage()])->withInput();
        }
    }

    // Hapus Tiang

    public function HapusTiang($id)
    {
        $tiang = TiangModel::findOrFail($id);
        $kode = $tiang->kode_tiang;
        $lama = $tiang->toArray();
        $daftarBerkas = array_filter([$tiang->foto_tiang_1, $tiang->foto_tiang_2, $tiang->foto_tiang_3, $tiang->foto_tiang_4, $tiang->foto_tiang_5]);
        $tiang->delete();
        $this->bersihkanBerkas($daftarBerkas);
        NotifikasiHelper::kirim('Data Tiang Dihapus', 'tiang', NotifikasiHelper::detailPesan('dihapus', 'tiang', $lama, []));
        return redirect('data-tiang')->with('success', NotifikasiHelper::pesanKeberhasilan('dihapus', 'tiang', $kode));
    }

    // Tangani Pesan Kesalahan

    private function uraiKesalahanKueri(QueryException $e): array
    {
        $pesan = $e->getMessage();
        if (str_contains($pesan, 'cannot be null') || str_contains($pesan, "doesn't have a default value") || str_contains($pesan, '1048') || str_contains($pesan, '1364') || preg_match("/(Column|Field) '[^']+' (cannot be null|doesn't have a default value)/", $pesan)) {
            if (preg_match("/(?:Column|Field) '([^']+)'/", $pesan, $m)) {
                $col = $m[1];
                $labels = ['kode_tiang' => 'Kode Tiang', 'wilayah' => 'Wilayah', 'kecamatan' => 'Kecamatan', 'kelurahan' => 'Kelurahan', 'deskripsi_tiang' => 'Deskripsi Tiang', 'foto_tiang_1' => 'Foto Tiang 1', 'foto_tiang_2' => 'Foto Tiang 2', 'foto_tiang_3' => 'Foto Tiang 3', 'foto_tiang_4' => 'Foto Tiang 4', 'foto_tiang_5' => 'Foto Tiang 5', 'latitude' => 'Latitude', 'longitude' => 'Longitude', 'nama_petugas' => 'Nama Petugas', 'status' => 'Status'];
                return [$col => ($labels[$col] ?? $col) . ' wajib diisi.'];
            }
            return ['error' => 'Ada field wajib yang belum diisi.'];
        }
        if (str_contains($pesan, 'Duplicate entry') || str_contains($pesan, 'UNIQUE') || str_contains($pesan, 'unique constraint') || str_contains($pesan, '1062')) {
            if (str_contains($pesan, 'kode_tiang')) return ['kode_tiang' => 'Kode Tiang sudah digunakan. Gunakan kode lain.'];
            if (str_contains($pesan, 'kode_ont')) return ['kode_ont' => 'Kode ONT sudah digunakan.'];
            if (preg_match("/for key '[^']*\.([^']+)'/", $pesan, $m)) {
                $col = $m[1];
                return [$col => ucfirst(str_replace('_', ' ', $col)) . ' sudah digunakan.'];
            }
            return ['error' => 'Data sudah ada (duplikat). Periksa kembali kode unik.'];
        }
        if (str_contains($pesan, 'foreign key') || str_contains($pesan, '1452')) return ['error' => 'Data relasi tidak valid.'];
        Log::warning('KesalahanKueri Tiang tak terpetakan: ' . $pesan);
        return ['error' => 'Gagal menyimpan data tiang: ' . $this->ambilRincianSql($pesan)];
    }

    private function ambilRincianSql(string $pesan): string
    {
        if (preg_match('/SQLSTATE\[.*?\]:\s*(.+?)(?:\s*\(|$)/', $pesan, $m)) return trim($m[1]);
        return mb_substr($pesan, -200);
    }

    private function formatKesalahanKueri(QueryException $e): string
    {
        return array_values($this->uraiKesalahanKueri($e))[0];
    }

    // Tangani Hapus Berkas

    private function bersihkanBerkas(array $daftarJalur): void
    {
        foreach ($daftarJalur as $jalur) {
            if (!$jalur) continue;
            try {
                if (Storage::disk('public')->exists($jalur)) Storage::disk('public')->delete($jalur);
            } catch (\Throwable $e) {
                Log::warning('Gagal membersihkan berkas: ' . $jalur . ' - ' . $e->getMessage());
            }
        }
    }
}
