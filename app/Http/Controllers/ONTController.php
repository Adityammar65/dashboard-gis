<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ONTModel;
use App\Helpers\NotifikasiHelper;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\QueryException;
use App\Services\GambarService;

class ONTController extends Controller
{
    // Tambah ONT

    public function SimpanONT(Request $request)
    {
        $berkasTersimpan = [];
        try {
            $tervalidasi = $request->validate([
                'kode_ont'      => 'required|string|max:255|unique:ont,kode_ont',
                'wilayah'         => 'required|string|max:255',
                'kecamatan'       => 'required|string|max:255',
                'kelurahan'       => 'required|string|max:255',
                'deskripsi_ont' => 'required|string',
                'foto_ont_1'    => 'required|image|mimes:jpg,jpeg,png,webp|max:5120',
                'foto_ont_2'    => 'required|image|mimes:jpg,jpeg,png,webp|max:5120',
                'foto_ont_3'    => 'required|image|mimes:jpg,jpeg,png,webp|max:5120',
                'foto_ont_4'    => 'required|image|mimes:jpg,jpeg,png,webp|max:5120',
                'foto_ont_5'    => 'required|image|mimes:jpg,jpeg,png,webp|max:5120',
                'latitude'        => 'required|numeric',
                'longitude'       => 'required|numeric',
                'nama_petugas'    => 'required|string|max:255',
                'status'          => 'required|in:aktif,nonaktif',
            ], [
                'kode_ont.required' => 'Kode ONT wajib diisi.',
                'kode_ont.unique' => 'Kode ONT sudah digunakan.',
                'wilayah.required' => 'Wilayah wajib diisi.',
                'kecamatan.required' => 'Kecamatan wajib diisi.',
                'kelurahan.required' => 'Kelurahan wajib diisi.',
                'deskripsi_ont.required' => 'Deskripsi ONT wajib diisi.',
                'foto_ont_1.required' => 'Foto ONT 1 wajib diisi.',
                'foto_ont_2.required' => 'Foto ONT 2 wajib diisi.',
                'foto_ont_3.required' => 'Foto ONT 3 wajib diisi.',
                'foto_ont_4.required' => 'Foto ONT 4 wajib diisi.',
                'foto_ont_5.required' => 'Foto ONT 5 wajib diisi.',
                'foto_ont_1.image' => 'Foto ONT 1 harus berupa gambar.',
                'foto_ont_2.image' => 'Foto ONT 2 harus berupa gambar.',
                'foto_ont_3.image' => 'Foto ONT 3 harus berupa gambar.',
                'foto_ont_4.image' => 'Foto ONT 4 harus berupa gambar.',
                'foto_ont_5.image' => 'Foto ONT 5 harus berupa gambar.',
                'latitude.required' => 'Latitude wajib diisi.',
                'latitude.numeric' => 'Latitude harus berupa angka.',
                'longitude.required' => 'Longitude wajib diisi.',
                'longitude.numeric' => 'Longitude harus berupa angka.',
                'nama_petugas.required' => 'Nama Petugas wajib diisi.',
                'status.required' => 'Status wajib diisi.',
                'status.in' => 'Status tidak valid.',
            ]);
            $data = [
                'kode_ont'      => $tervalidasi['kode_ont'],
                'wilayah'         => $tervalidasi['wilayah'],
                'kecamatan'       => $tervalidasi['kecamatan'],
                'kelurahan'       => $tervalidasi['kelurahan'],
                'deskripsi_ont' => $tervalidasi['deskripsi_ont'],
                'latitude'        => $tervalidasi['latitude'],
                'longitude'       => $tervalidasi['longitude'],
                'nama_petugas'    => $tervalidasi['nama_petugas'],
                'status'          => $tervalidasi['status'],
            ];
            if (!Storage::disk('public')->exists('ont')) Storage::disk('public')->makeDirectory('ont');
            if ($request->hasFile('foto_ont_1')) {
                $path = app(GambarService::class)->simpanWebPTeroptimasi($request->file('foto_ont_1'), 'ont');
                $data['foto_ont_1'] = $path;
                $berkasTersimpan[] = $path;
            }
            if ($request->hasFile('foto_ont_2')) {
                $path = app(GambarService::class)->simpanWebPTeroptimasi($request->file('foto_ont_2'), 'ont');
                $data['foto_ont_2'] = $path;
                $berkasTersimpan[] = $path;
            }
            if ($request->hasFile('foto_ont_3')) {
                $path = app(GambarService::class)->simpanWebPTeroptimasi($request->file('foto_ont_3'), 'ont');
                $data['foto_ont_3'] = $path;
                $berkasTersimpan[] = $path;
            }
            if ($request->hasFile('foto_ont_4')) {
                $path = app(GambarService::class)->simpanWebPTeroptimasi($request->file('foto_ont_4'), 'ont');
                $data['foto_ont_4'] = $path;
                $berkasTersimpan[] = $path;
            }
            if ($request->hasFile('foto_ont_5')) {
                $path = app(GambarService::class)->simpanWebPTeroptimasi($request->file('foto_ont_5'), 'ont');
                $data['foto_ont_5'] = $path;
                $berkasTersimpan[] = $path;
            }
            ONTModel::create($data);
            NotifikasiHelper::kirim('Data ONT Ditambahkan', 'ont', NotifikasiHelper::detailPesan('ditambahkan', 'ont', [], $data));
            return redirect('data-ont')->with('success', NotifikasiHelper::pesanKeberhasilan('ditambahkan', 'ont', $data['kode_ont'], $data['nama_petugas']));
        } catch (QueryException $e) {
            $this->bersihkanBerkas($berkasTersimpan);
            Log::error('SimpanONT KesalahanKueri: ' . $e->getMessage());
            return redirect()->back()->withErrors($this->uraiKesalahanKueri($e))->withInput();
        } catch (\Throwable $e) {
            if ($e instanceof \Illuminate\Validation\ValidationException) {
                $this->bersihkanBerkas($berkasTersimpan);
                throw $e;
            }
            $this->bersihkanBerkas($berkasTersimpan);
            Log::error('SimpanONT Galat: ' . $e->getMessage());
            return redirect()->back()->withErrors(['error' => $e->getMessage()])->withInput();
        }
    }

    // Update Data ONT

    public function PerbaruiONT(Request $request, $id)
    {
        $berkasBaru = [];
        $berkasLamaDihapus = [];
        try {
            $ont = ONTModel::findOrFail($id);
            $tervalidasi = $request->validate([
                'kode_ont'      => 'required|string|max:255|unique:ont,kode_ont,' . $id,
                'wilayah'         => 'required|string|max:255',
                'kecamatan'       => 'required|string|max:255',
                'kelurahan'       => 'required|string|max:255',
                'deskripsi_ont' => 'required|string',
                'foto_ont_1'    => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
                'foto_ont_2'    => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
                'foto_ont_3'    => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
                'foto_ont_4'    => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
                'foto_ont_5'    => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
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
                'kode_ont.required' => 'Kode ONT wajib diisi.',
                'kode_ont.unique' => 'Kode ONT sudah digunakan.',
                'wilayah.required' => 'Wilayah wajib diisi.',
                'kecamatan.required' => 'Kecamatan wajib diisi.',
                'kelurahan.required' => 'Kelurahan wajib diisi.',
                'deskripsi_ont.required' => 'Deskripsi ONT wajib diisi.',
                'latitude.required' => 'Latitude wajib diisi.',
                'latitude.numeric' => 'Latitude harus berupa angka.',
                'longitude.required' => 'Longitude wajib diisi.',
                'longitude.numeric' => 'Longitude harus berupa angka.',
                'nama_petugas.required' => 'Nama Petugas wajib diisi.',
                'status.required' => 'Status wajib diisi.',
                'status.in' => 'Status tidak valid.',
            ]);
            $data = [
                'kode_ont'      => $tervalidasi['kode_ont'],
                'wilayah'         => $tervalidasi['wilayah'],
                'kecamatan'       => $tervalidasi['kecamatan'],
                'kelurahan'       => $tervalidasi['kelurahan'],
                'deskripsi_ont' => $tervalidasi['deskripsi_ont'],
                'latitude'        => $tervalidasi['latitude'],
                'longitude'       => $tervalidasi['longitude'],
                'nama_petugas'    => $tervalidasi['nama_petugas'],
                'status'          => $tervalidasi['status'],
            ];
            if (!Storage::disk('public')->exists('ont')) Storage::disk('public')->makeDirectory('ont');
            if ($request->hasFile('foto_ont_1')) {
                $path = app(GambarService::class)->simpanWebPTeroptimasi($request->file('foto_ont_1'), 'ont');
                $data['foto_ont_1'] = $path;
                $berkasBaru[] = $path;
                if ($ont->foto_ont_1) $berkasLamaDihapus[] = $ont->foto_ont_1;
            } elseif ($request->boolean('hapus_foto_1')) {
                if ($ont->foto_ont_1) $berkasLamaDihapus[] = $ont->foto_ont_1;
                $data['foto_ont_1'] = null;
            }
            if ($request->hasFile('foto_ont_2')) {
                $path = app(GambarService::class)->simpanWebPTeroptimasi($request->file('foto_ont_2'), 'ont');
                $data['foto_ont_2'] = $path;
                $berkasBaru[] = $path;
                if ($ont->foto_ont_2) $berkasLamaDihapus[] = $ont->foto_ont_2;
            } elseif ($request->boolean('hapus_foto_2')) {
                if ($ont->foto_ont_2) $berkasLamaDihapus[] = $ont->foto_ont_2;
                $data['foto_ont_2'] = null;
            }
            if ($request->hasFile('foto_ont_3')) {
                $path = app(GambarService::class)->simpanWebPTeroptimasi($request->file('foto_ont_3'), 'ont');
                $data['foto_ont_3'] = $path;
                $berkasBaru[] = $path;
                if ($ont->foto_ont_3) $berkasLamaDihapus[] = $ont->foto_ont_3;
            } elseif ($request->boolean('hapus_foto_3')) {
                if ($ont->foto_ont_3) $berkasLamaDihapus[] = $ont->foto_ont_3;
                $data['foto_ont_3'] = null;
            }
            if ($request->hasFile('foto_ont_4')) {
                $path = app(GambarService::class)->simpanWebPTeroptimasi($request->file('foto_ont_4'), 'ont');
                $data['foto_ont_4'] = $path;
                $berkasBaru[] = $path;
                if ($ont->foto_ont_4) $berkasLamaDihapus[] = $ont->foto_ont_4;
            } elseif ($request->boolean('hapus_foto_4')) {
                if ($ont->foto_ont_4) $berkasLamaDihapus[] = $ont->foto_ont_4;
                $data['foto_ont_4'] = null;
            }
            if ($request->hasFile('foto_ont_5')) {
                $path = app(GambarService::class)->simpanWebPTeroptimasi($request->file('foto_ont_5'), 'ont');
                $data['foto_ont_5'] = $path;
                $berkasBaru[] = $path;
                if ($ont->foto_ont_5) $berkasLamaDihapus[] = $ont->foto_ont_5;
            } elseif ($request->boolean('hapus_foto_5')) {
                if ($ont->foto_ont_5) $berkasLamaDihapus[] = $ont->foto_ont_5;
                $data['foto_ont_5'] = null;
            }
            $lama = $ont->toArray();
            $ont->update($data);
            $this->bersihkanBerkas($berkasLamaDihapus);
            NotifikasiHelper::kirim('Data ONT Diperbarui', 'ont', NotifikasiHelper::detailPesan('diperbarui', 'ont', $lama, $data));
            return redirect('data-ont')->with('success', NotifikasiHelper::pesanKeberhasilan('diperbarui', 'ont', $data['kode_ont'], $data['nama_petugas']));
        } catch (QueryException $e) {
            $this->bersihkanBerkas($berkasBaru);
            Log::error('PerbaruiONT KesalahanKueri: ' . $e->getMessage());
            return redirect()->back()->withErrors($this->uraiKesalahanKueri($e))->withInput();
        } catch (\Throwable $e) {
            if ($e instanceof \Illuminate\Validation\ValidationException) {
                $this->bersihkanBerkas($berkasBaru);
                throw $e;
            }
            $this->bersihkanBerkas($berkasBaru);
            Log::error('PerbaruiONT Galat: ' . $e->getMessage());
            return redirect()->back()->withErrors(['error' => $e->getMessage()])->withInput();
        }
    }

    // Hapus ONT

    public function HapusONT($id)
    {
        $ont = ONTModel::findOrFail($id);
        $kode = $ont->kode_ont;
        $lama = $ont->toArray();
        $daftarBerkas = array_filter([$ont->foto_ont_1, $ont->foto_ont_2, $ont->foto_ont_3, $ont->foto_ont_4, $ont->foto_ont_5]);
        $ont->delete();
        $this->bersihkanBerkas($daftarBerkas);
        NotifikasiHelper::kirim('Data ONT Dihapus', 'ont', NotifikasiHelper::detailPesan('dihapus', 'ont', $lama, []));
        return redirect('data-ont')->with('success', NotifikasiHelper::pesanKeberhasilan('dihapus', 'ont', $kode));
    }

    // Tangani Pesan Kesalahan

    private function uraiKesalahanKueri(QueryException $e): array
    {
        $pesan = $e->getMessage();
        if (str_contains($pesan, 'cannot be null') || str_contains($pesan, "doesn't have a default value") || str_contains($pesan, '1048') || str_contains($pesan, '1364') || preg_match("/(Column|Field) '[^']+' (cannot be null|doesn't have a default value)/", $pesan)) {
            if (preg_match("/(?:Column|Field) '([^']+)'/", $pesan, $m)) {
                $col = $m[1];
                $labels = ['kode_ont' => 'Kode ONT', 'wilayah' => 'Wilayah', 'kecamatan' => 'Kecamatan', 'kelurahan' => 'Kelurahan', 'deskripsi_ont' => 'Deskripsi ONT', 'foto_ont_1' => 'Foto ONT 1', 'foto_ont_2' => 'Foto ONT 2', 'foto_ont_3' => 'Foto ONT 3', 'foto_ont_4' => 'Foto ONT 4', 'foto_ont_5' => 'Foto ONT 5', 'latitude' => 'Latitude', 'longitude' => 'Longitude', 'nama_petugas' => 'Nama Petugas', 'status' => 'Status'];
                return [$col => ($labels[$col] ?? $col) . ' wajib diisi.'];
            }
            return ['error' => 'Ada field wajib yang belum diisi.'];
        }
        if (str_contains($pesan, 'Duplicate entry') || str_contains($pesan, 'UNIQUE') || str_contains($pesan, 'unique constraint') || str_contains($pesan, '1062')) {
            if (str_contains($pesan, 'kode_ont')) return ['kode_ont' => 'Kode ONT sudah digunakan. Gunakan kode lain.'];
            if (str_contains($pesan, 'kode_tiang')) return ['kode_tiang' => 'Kode Tiang sudah digunakan.'];
            if (preg_match("/for key '[^']*\.([^']+)'/", $pesan, $m)) {
                $col = $m[1];
                return [$col => ucfirst(str_replace('_', ' ', $col)) . ' sudah digunakan.'];
            }
            return ['error' => 'Data sudah ada (duplikat). Periksa kembali kode unik.'];
        }
        if (str_contains($pesan, 'foreign key') || str_contains($pesan, '1452')) return ['error' => 'Data relasi tidak valid.'];
        Log::warning('KesalahanKueri ONT tak terpetakan: ' . $pesan);
        return ['error' => 'Gagal menyimpan data ONT: ' . $this->ambilRincianSql($pesan)];
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
