<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TiangModel;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\QueryException;

class TiangController extends Controller
{
    // Tambah Tiang

    public function SimpanTiang(Request $request)
    {
        $storedFiles = [];

        try {
            $validated = $request->validate([
                'kode_tiang'      => 'required|string|max:255|unique:tiang,kode_tiang',
                'area'            => 'required|string|max:255',
                'wilayah'         => 'required|string|max:255',
                'deskripsi_tiang' => 'required|string',
                'foto_tiang_1'    => 'required|image|mimes:jpg,jpeg,png|max:5120',
                'foto_tiang_2'    => 'required|image|mimes:jpg,jpeg,png|max:5120',
                'foto_tiang_3'    => 'required|image|mimes:jpg,jpeg,png|max:5120',
                'latitude'        => 'required|numeric',
                'longitude'       => 'required|numeric',
                'nama_petugas'    => 'required|string|max:255',
                'status' => 'required|in:Aktif,Nonaktif,aktif,nonaktif',
            ], [
                'kode_tiang.required' => 'Kode Tiang wajib diisi.',
                'kode_tiang.unique' => 'Kode Tiang sudah digunakan.',
                'area.required' => 'Area wajib diisi.',
                'wilayah.required' => 'Wilayah wajib diisi.',
                'deskripsi_tiang.required' => 'Deskripsi Tiang wajib diisi.',
                'foto_tiang_1.required' => 'Foto Tiang 1 wajib diisi.',
                'foto_tiang_2.required' => 'Foto Tiang 2 wajib diisi.',
                'foto_tiang_3.required' => 'Foto Tiang 3 wajib diisi.',
                'foto_tiang_1.image' => 'Foto Tiang 1 harus berupa gambar.',
                'foto_tiang_2.image' => 'Foto Tiang 2 harus berupa gambar.',
                'foto_tiang_3.image' => 'Foto Tiang 3 harus berupa gambar.',
                'latitude.required' => 'Latitude wajib diisi.',
                'latitude.numeric' => 'Latitude harus berupa angka.',
                'longitude.required' => 'Longitude wajib diisi.',
                'longitude.numeric' => 'Longitude harus berupa angka.',
                'nama_petugas.required' => 'Nama Petugas wajib diisi.',
                'status.required' => 'Status wajib diisi.',
                'status.in' => 'Status tidak valid.',
            ]);

            $validated['status'] = strtolower($validated['status']);

            $data = [
                'kode_tiang'      => $validated['kode_tiang'],
                'area'            => $validated['area'],
                'wilayah'         => $validated['wilayah'],
                'deskripsi_tiang' => $validated['deskripsi_tiang'],
                'latitude'        => $validated['latitude'],
                'longitude'       => $validated['longitude'],
                'nama_petugas'    => $validated['nama_petugas'],
                'status'          => $validated['status'],
            ];

            if ($request->hasFile('foto_tiang_1')) {
                $path = $request->file('foto_tiang_1')->store('tiang', 'public');
                $data['foto_tiang_1'] = $path;
                $storedFiles[] = $path;
            }

            if ($request->hasFile('foto_tiang_2')) {
                $path = $request->file('foto_tiang_2')->store('tiang', 'public');
                $data['foto_tiang_2'] = $path;
                $storedFiles[] = $path;
            }

            if ($request->hasFile('foto_tiang_3')) {
                $path = $request->file('foto_tiang_3')->store('tiang', 'public');
                $data['foto_tiang_3'] = $path;
                $storedFiles[] = $path;
            }

            TiangModel::create($data);

            return redirect('data-tiang')
                ->with('success', 'Data tiang berhasil disimpan.');
        } catch (QueryException $e) {
            $this->cleanupFiles($storedFiles);
            Log::error('SimpanTiang QueryException: ' . $e->getMessage());
            $fieldErrors = $this->parseQueryError($e);
            return redirect()->back()
                ->withErrors($fieldErrors)
                ->withInput();
        } catch (\Throwable $e) {
            if ($e instanceof \Illuminate\Validation\ValidationException) {
                $this->cleanupFiles($storedFiles);
                throw $e;
            }
            $this->cleanupFiles($storedFiles);
            Log::error('SimpanTiang Error: ' . $e->getMessage());
            return redirect()->back()
                ->withErrors(['error' => 'Gagal menyimpan tiang: ' . $e->getMessage()])
                ->withInput();
        }
    }

    // Update Data Tiang

    public function UpdateTiang(Request $request, $id)
    {
        $newFiles = [];
        $oldFilesToDelete = [];

        try {
            $tiang = TiangModel::findOrFail($id);

            $validated = $request->validate([
                'kode_tiang'      => 'required|string|max:255|unique:tiang,kode_tiang,' . $id,
                'area'            => 'required|string|max:255',
                'wilayah'         => 'required|string|max:255',
                'deskripsi_tiang' => 'required|string',
                'foto_tiang_1'    => 'nullable|image|mimes:jpg,jpeg,png|max:5120',
                'foto_tiang_2'    => 'nullable|image|mimes:jpg,jpeg,png|max:5120',
                'foto_tiang_3'    => 'nullable|image|mimes:jpg,jpeg,png|max:5120',
                'latitude'        => 'required|numeric',
                'longitude'       => 'required|numeric',
                'nama_petugas'    => 'required|string|max:255',
                'status'          => 'required|in:aktif,nonaktif',
            ], [
                'kode_tiang.required' => 'Kode Tiang wajib diisi.',
                'kode_tiang.unique' => 'Kode Tiang sudah digunakan.',
                'area.required' => 'Area wajib diisi.',
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
                'kode_tiang'      => $validated['kode_tiang'],
                'wilayah'         => $validated['wilayah'],
                'area'            => $validated['area'],
                'deskripsi_tiang' => $validated['deskripsi_tiang'],
                'latitude'        => $validated['latitude'],
                'longitude'       => $validated['longitude'],
                'nama_petugas'    => $validated['nama_petugas'],
                'status'          => $validated['status'],
            ];

            if ($request->hasFile('foto_tiang_1')) {
                $path = $request->file('foto_tiang_1')->store('tiang', 'public');
                $data['foto_tiang_1'] = $path;
                $newFiles[] = $path;
                if ($tiang->foto_tiang_1) {
                    $oldFilesToDelete[] = $tiang->foto_tiang_1;
                }
            }

            if ($request->hasFile('foto_tiang_2')) {
                $path = $request->file('foto_tiang_2')->store('tiang', 'public');
                $data['foto_tiang_2'] = $path;
                $newFiles[] = $path;
                if ($tiang->foto_tiang_2) {
                    $oldFilesToDelete[] = $tiang->foto_tiang_2;
                }
            }

            if ($request->hasFile('foto_tiang_3')) {
                $path = $request->file('foto_tiang_3')->store('tiang', 'public');
                $data['foto_tiang_3'] = $path;
                $newFiles[] = $path;
                if ($tiang->foto_tiang_3) {
                    $oldFilesToDelete[] = $tiang->foto_tiang_3;
                }
            }

            $tiang->update($data);

            $this->cleanupFiles($oldFilesToDelete);

            return redirect('data-tiang')
                ->with('success', 'Data tiang berhasil diperbarui.');
        } catch (QueryException $e) {
            $this->cleanupFiles($newFiles);
            Log::error('UpdateTiang QueryException: ' . $e->getMessage());
            $fieldErrors = $this->parseQueryError($e);
            return redirect()->back()
                ->withErrors($fieldErrors)
                ->withInput();
        } catch (\Throwable $e) {
            if ($e instanceof \Illuminate\Validation\ValidationException) {
                $this->cleanupFiles($newFiles);
                throw $e;
            }
            $this->cleanupFiles($newFiles);
            Log::error('UpdateTiang Error: ' . $e->getMessage());
            return redirect()->back()
                ->withErrors(['error' => 'Gagal memperbarui tiang: ' . $e->getMessage()])
                ->withInput();
        }
    }

    // Hapus Tiang

    public function HapusTiang($id)
    {
        $tiang = TiangModel::findOrFail($id);

        $files = array_filter([
            $tiang->foto_tiang_1,
            $tiang->foto_tiang_2,
            $tiang->foto_tiang_3,
        ]);

        $tiang->delete();

        $this->cleanupFiles($files);

        return redirect('data-tiang')
            ->with('success', 'Data tiang berhasil dihapus.');
    }

    // Handle Error Message

    private function parseQueryError(QueryException $e): array
    {
        $msg = $e->getMessage();

        if (str_contains($msg, 'cannot be null') || str_contains($msg, '1048') || preg_match("/Column '[^']+' cannot be null/", $msg)) {
            if (preg_match("/Column '([^']+)'/", $msg, $m)) {
                $col = $m[1];
                $labels = [
                    'kode_tiang' => 'Kode Tiang',
                    'area' => 'Area',
                    'wilayah' => 'Wilayah',
                    'deskripsi_tiang' => 'Deskripsi Tiang',
                    'foto_tiang_1' => 'Foto Tiang 1',
                    'foto_tiang_2' => 'Foto Tiang 2',
                    'foto_tiang_3' => 'Foto Tiang 3',
                    'latitude' => 'Latitude',
                    'longitude' => 'Longitude',
                    'nama_petugas' => 'Nama Petugas',
                    'status' => 'Status',
                ];
                $label = $labels[$col] ?? $col;

                return [$col => $label . ' wajib diisi.'];
            }
            return ['error' => 'Ada field wajib yang belum diisi.'];
        }

        if (str_contains($msg, 'Duplicate entry') || str_contains($msg, 'UNIQUE') || str_contains($msg, 'unique constraint')) {
            if (str_contains($msg, 'kode_tiang')) {
                return ['kode_tiang' => 'Kode Tiang sudah digunakan. Gunakan kode lain.'];
            }
            if (str_contains($msg, 'kode_ont')) {
                return ['kode_ont' => 'Kode ONT sudah digunakan.'];
            }
            if (preg_match("/for key '[^']*\.([^']+)'/", $msg, $m)) {
                $col = $m[1];
                return [$col => ucfirst(str_replace('_', ' ', $col)) . ' sudah digunakan.'];
            }
            return ['error' => 'Data sudah ada (duplikat). Periksa kembali kode unik.'];
        }

        if (str_contains($msg, 'foreign key') || str_contains($msg, '1452')) {
            return ['error' => 'Data relasi tidak valid.'];
        }

        return ['error' => 'Gagal menyimpan data tiang. Periksa kembali isian form.'];
    }

    private function formatQueryError(QueryException $e): string
    {
        $arr = $this->parseQueryError($e);
        return array_values($arr)[0];
    }

    // Handle Delete File

    private function cleanupFiles(array $paths): void
    {
        foreach ($paths as $path) {
            if (!$path) continue;
            try {
                if (Storage::disk('public')->exists($path)) {
                    Storage::disk('public')->delete($path);
                }
            } catch (\Throwable $e) {
                Log::warning('Failed to cleanup file: ' . $path . ' - ' . $e->getMessage());
            }
        }
    }
}
