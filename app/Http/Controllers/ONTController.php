<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ONTModel;
use Illuminate\Support\Facades\Storage;

class ONTController extends Controller
{
    // Tambah ONT

    public function SimpanONT(Request $request)
    {
        $validated = $request->validate([
            'kode_ont'      => 'required|string|max:255',
            'area'            => 'required|string|max:255',
            'wilayah'         => 'required',
            'deskripsi_ont' => 'nullable|string',

            'foto_ont_1'    => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'foto_ont_2'    => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'foto_ont_3'    => 'nullable|image|mimes:jpg,jpeg,png|max:2048',

            'latitude'        => 'required|numeric',
            'longitude'       => 'required|numeric',

            'nama_petugas'    => 'required|string|max:255',
            'status'          => 'required|in:aktif,nonaktif',
        ]);

        $data = [
            'kode_ont'      => $validated['kode_ont'],
            'area'            => $validated['area'],
            'wilayah'         => $validated['wilayah'],
            'deskripsi_ont' => $validated['deskripsi_ont'] ?? null,
            'latitude'        => $validated['latitude'],
            'longitude'       => $validated['longitude'],
            'nama_petugas'    => $validated['nama_petugas'],
            'status'          => $validated['status'],
        ];

        if ($request->hasFile('foto_ont_1')) {
            $data['foto_ont_1'] = $request
                ->file('foto_ont_1')
                ->store('ont', 'public');
        }

        if ($request->hasFile('foto_ont_2')) {
            $data['foto_ont_2'] = $request
                ->file('foto_ont_2')
                ->store('ont', 'public');
        }

        if ($request->hasFile('foto_ont_3')) {
            $data['foto_ont_3'] = $request
                ->file('foto_ont_3')
                ->store('ont', 'public');
        }

        ONTModel::create($data);

        return redirect('data-ont')
            ->with('success', 'Data ONT berhasil disimpan.');
    }

    // Update Data ONT

    public function UpdateONT(Request $request, $id)
    {
        $ont = ONTModel::findOrFail($id);

        $validated = $request->validate([
            'kode_ont'      => 'required|string|max:255|unique:ont,kode_ont,' . $id,
            'area'            => 'required|string|max:255',
            'wilayah'         => 'required|string',
            'deskripsi_ont' => 'nullable|string',

            'foto_ont_1'    => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'foto_ont_2'    => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'foto_ont_3'    => 'nullable|image|mimes:jpg,jpeg,png|max:2048',

            'latitude'        => 'required|numeric',
            'longitude'       => 'required|numeric',
            'nama_petugas'    => 'required|string|max:255',
            'status'          => 'required|in:aktif,nonaktif',
        ]);

        $data = [
            'kode_ont'      => $validated['kode_ont'],
            'wilayah'         => $validated['wilayah'],
            'area'            => $validated['area'],
            'deskripsi_ont' => $validated['deskripsi_ont'] ?? null,
            'latitude'        => $validated['latitude'],
            'longitude'       => $validated['longitude'],
            'nama_petugas'    => $validated['nama_petugas'],
            'status'          => $validated['status'],
        ];

        if ($request->hasFile('foto_ont_1')) {
            if ($ont->foto_ont_1) {
                Storage::disk('public')->delete($ont->foto_ont_1);
            }

            $data['foto_ont_1'] = $request
                ->file('foto_ont_1')
                ->store('ont', 'public');
        }

        if ($request->hasFile('foto_ont_2')) {
            if ($ont->foto_ont_2) {
                Storage::disk('public')->delete($ont->foto_ont_2);
            }

            $data['foto_ont_2'] = $request
                ->file('foto_ont_2')
                ->store('ont', 'public');
        }

        if ($request->hasFile('foto_ont_3')) {
            if ($ont->foto_ont_3) {
                Storage::disk('public')->delete($ont->foto_ont_3);
            }

            $data['foto_ont_3'] = $request
                ->file('foto_ont_3')
                ->store('ont', 'public');
        }

        $ont->update($data);

        return redirect('data-ont')
            ->with('success', 'Data ONT berhasil diperbarui.');
    }

    // Hapus ONT

    public function HapusONT($id)
    {
        $ont = ONTModel::findOrFail($id);

        $ont->delete();

        return redirect('data-ont')
            ->with('success', 'Data ONT berhasil dihapus.');
    }
}
