<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ONTModel;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\QueryException;

class ONTController extends Controller
{
    // Tambah ONT

    public function SimpanONT(Request $request)
    {
        $storedFiles = [];

        try {
            $validated = $request->validate([
                'kode_ont'      => 'required|string|max:255|unique:ont,kode_ont',
                'area'            => 'required|string|max:255',
                'wilayah'         => 'required|string|max:255',
                'deskripsi_ont' => 'required|string',
                'foto_ont_1'    => 'required|image|mimes:jpg,jpeg,png|max:5120',
                'foto_ont_2'    => 'required|image|mimes:jpg,jpeg,png|max:5120',
                'foto_ont_3'    => 'required|image|mimes:jpg,jpeg,png|max:5120',
                'latitude'        => 'required|numeric',
                'longitude'       => 'required|numeric',
                'nama_petugas'    => 'required|string|max:255',
                'status'          => 'required|in:aktif,nonaktif',
            ], [
                'kode_ont.required' => 'Kode ONT wajib diisi.',
                'kode_ont.unique' => 'Kode ONT sudah digunakan.',
                'area.required' => 'Area wajib diisi.',
                'wilayah.required' => 'Wilayah wajib diisi.',
                'deskripsi_ont.required' => 'Deskripsi ONT wajib diisi.',
                'foto_ont_1.required' => 'Foto ONT 1 wajib diisi.',
                'foto_ont_2.required' => 'Foto ONT 2 wajib diisi.',
                'foto_ont_3.required' => 'Foto ONT 3 wajib diisi.',
                'foto_ont_1.image' => 'Foto ONT 1 harus berupa gambar.',
                'foto_ont_2.image' => 'Foto ONT 2 harus berupa gambar.',
                'foto_ont_3.image' => 'Foto ONT 3 harus berupa gambar.',
                'latitude.required' => 'Latitude wajib diisi.',
                'latitude.numeric' => 'Latitude harus berupa angka.',
                'longitude.required' => 'Longitude wajib diisi.',
                'longitude.numeric' => 'Longitude harus berupa angka.',
                'nama_petugas.required' => 'Nama Petugas wajib diisi.',
                'status.required' => 'Status wajib diisi.',
                'status.in' => 'Status tidak valid.',
            ]);

            $data = [
                'kode_ont'      => $validated['kode_ont'],
                'area'            => $validated['area'],
                'wilayah'         => $validated['wilayah'],
                'deskripsi_ont' => $validated['deskripsi_ont'],
                'latitude'        => $validated['latitude'],
                'longitude'       => $validated['longitude'],
                'nama_petugas'    => $validated['nama_petugas'],
                'status'          => $validated['status'],
            ];

            if ($request->hasFile('foto_ont_1')) {
                $path = $request->file('foto_ont_1')->store('ont', 'public');
                $data['foto_ont_1'] = $path;
                $storedFiles[] = $path;
            }

            if ($request->hasFile('foto_ont_2')) {
                $path = $request->file('foto_ont_2')->store('ont', 'public');
                $data['foto_ont_2'] = $path;
                $storedFiles[] = $path;
            }

            if ($request->hasFile('foto_ont_3')) {
                $path = $request->file('foto_ont_3')->store('ont', 'public');
                $data['foto_ont_3'] = $path;
                $storedFiles[] = $path;
            }

            ONTModel::create($data);

            return redirect('data-ont')
                ->with('success', 'Data ONT berhasil disimpan.');
        } catch (QueryException $e) {
            $this->cleanupFiles($storedFiles);
            Log::error('SimpanONT QueryException: ' . $e->getMessage());
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
            Log::error('SimpanONT Error: ' . $e->getMessage());
            return redirect()->back()
                ->withErrors(['error' => 'Gagal menyimpan ONT: ' . $e->getMessage()])
                ->withInput();
        }
    }

    // Update Data ONT

    public function UpdateONT(Request $request, $id)
    {
        $newFiles = [];
        $oldFilesToDelete = [];

        try {
            $ont = ONTModel::findOrFail($id);

            $validated = $request->validate([
                'kode_ont'      => 'required|string|max:255|unique:ont,kode_ont,' . $id,
                'area'            => 'required|string|max:255',
                'wilayah'         => 'required|string|max:255',
                'deskripsi_ont' => 'required|string',
                'foto_ont_1'    => 'nullable|image|mimes:jpg,jpeg,png|max:5120',
                'foto_ont_2'    => 'nullable|image|mimes:jpg,jpeg,png|max:5120',
                'foto_ont_3'    => 'nullable|image|mimes:jpg,jpeg,png|max:5120',
                'latitude'        => 'required|numeric',
                'longitude'       => 'required|numeric',
                'nama_petugas'    => 'required|string|max:255',
                'status'          => 'required|in:aktif,nonaktif',
            ], [
                'kode_ont.required' => 'Kode ONT wajib diisi.',
                'kode_ont.unique' => 'Kode ONT sudah digunakan.',
                'area.required' => 'Area wajib diisi.',
                'wilayah.required' => 'Wilayah wajib diisi.',
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
                'kode_ont'      => $validated['kode_ont'],
                'wilayah'         => $validated['wilayah'],
                'area'            => $validated['area'],
                'deskripsi_ont' => $validated['deskripsi_ont'],
                'latitude'        => $validated['latitude'],
                'longitude'       => $validated['longitude'],
                'nama_petugas'    => $validated['nama_petugas'],
                'status'          => $validated['status'],
            ];

            if ($request->hasFile('foto_ont_1')) {
                $path = $request->file('foto_ont_1')->store('ont', 'public');
                $data['foto_ont_1'] = $path;
                $newFiles[] = $path;
                if ($ont->foto_ont_1) {
                    $oldFilesToDelete[] = $ont->foto_ont_1;
                }
            }

            if ($request->hasFile('foto_ont_2')) {
                $path = $request->file('foto_ont_2')->store('ont', 'public');
                $data['foto_ont_2'] = $path;
                $newFiles[] = $path;
                if ($ont->foto_ont_2) {
                    $oldFilesToDelete[] = $ont->foto_ont_2;
                }
            }

            if ($request->hasFile('foto_ont_3')) {
                $path = $request->file('foto_ont_3')->store('ont', 'public');
                $data['foto_ont_3'] = $path;
                $newFiles[] = $path;
                if ($ont->foto_ont_3) {
                    $oldFilesToDelete[] = $ont->foto_ont_3;
                }
            }

            $ont->update($data);

            $this->cleanupFiles($oldFilesToDelete);

            return redirect('data-ont')
                ->with('success', 'Data ONT berhasil diperbarui.');
        } catch (QueryException $e) {
            $this->cleanupFiles($newFiles);
            Log::error('UpdateONT QueryException: ' . $e->getMessage());
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
            Log::error('UpdateONT Error: ' . $e->getMessage());
            return redirect()->back()
                ->withErrors(['error' => 'Gagal memperbarui ONT: ' . $e->getMessage()])
                ->withInput();
        }
    }

    // Hapus ONT

    public function HapusONT($id)
    {
        $ont = ONTModel::findOrFail($id);

        $files = array_filter([
            $ont->foto_ont_1,
            $ont->foto_ont_2,
            $ont->foto_ont_3,
        ]);

        $ont->delete();

        $this->cleanupFiles($files);

        return redirect('data-ont')
            ->with('success', 'Data ONT berhasil dihapus.');
    }

    // Handle Error Message

    private function parseQueryError(QueryException $e): array
    {
        $msg = $e->getMessage();

        if (str_contains($msg, 'cannot be null') || str_contains($msg, '1048') || preg_match("/Column '[^']+' cannot be null/", $msg)) {
            if (preg_match("/Column '([^']+)'/", $msg, $m)) {
                $col = $m[1];
                $labels = [
                    'kode_ont' => 'Kode ONT',
                    'area' => 'Area',
                    'wilayah' => 'Wilayah',
                    'deskripsi_ont' => 'Deskripsi ONT',
                    'foto_ont_1' => 'Foto ONT 1',
                    'foto_ont_2' => 'Foto ONT 2',
                    'foto_ont_3' => 'Foto ONT 3',
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
            if (str_contains($msg, 'kode_ont')) {
                return ['kode_ont' => 'Kode ONT sudah digunakan. Gunakan kode lain.'];
            }
            if (str_contains($msg, 'kode_tiang')) {
                return ['kode_tiang' => 'Kode Tiang sudah digunakan.'];
            }
            if (preg_match("/for key '[^']*\.([^']+)'/", $msg, $m)) {
                $col = $m[1];
                return [$col => ucfirst(str_replace('_',' ',$col)) . ' sudah digunakan.'];
            }
            return ['error' => 'Data sudah ada (duplikat). Periksa kembali kode unik.'];
        }

        if (str_contains($msg, 'foreign key') || str_contains($msg, '1452')) {
            return ['error' => 'Data relasi tidak valid.'];
        }

        return ['error' => 'Gagal menyimpan data ONT. Periksa kembali isian form.'];
    }

    private function formatQueryError(QueryException $e): string
    {
        return array_values($this->parseQueryError($e))[0];
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
