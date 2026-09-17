<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TiangModel;
use Illuminate\Support\Facades\Storage;

class TiangController extends Controller
{
    // Tambah Tiang

    public function SimpanTiang(Request $request)
    {
        $validated = $request->validate([

            'kode_tiang'      => 'required|string|max:255',
            'area'            => 'required|string|max:255',
            'wilayah'         => 'required',
            'deskripsi_tiang' => 'nullable|string',

            'foto_tiang_1'    => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'foto_tiang_2'    => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'foto_tiang_3'    => 'nullable|image|mimes:jpg,jpeg,png|max:2048',

            'latitude'        => 'required|numeric',
            'longitude'       => 'required|numeric',
            'nama_petugas'    => 'required|string|max:255',
            'status' => 'required|in:Aktif,Nonaktif,aktif,nonaktif',
        ]);
        $validated['status'] = strtolower($validated['status']);

        $data = [
            'kode_tiang'      => $validated['kode_tiang'],
            'area'            => $validated['area'],
            'wilayah'         => $validated['wilayah'],
            'deskripsi_tiang' => $validated['deskripsi_tiang'] ?? null,
            'latitude'        => $validated['latitude'],
            'longitude'       => $validated['longitude'],
            'nama_petugas'    => $validated['nama_petugas'],
            'status'          => $validated['status'],
        ];

        if ($request->hasFile('foto_tiang_1')) {
            $data['foto_tiang_1'] = $request
                ->file('foto_tiang_1')
                ->store('tiang', 'public');
        }

        if ($request->hasFile('foto_tiang_2')) {
            $data['foto_tiang_2'] = $request
                ->file('foto_tiang_2')
                ->store('tiang', 'public');
        }

        if ($request->hasFile('foto_tiang_3')) {
            $data['foto_tiang_3'] = $request
                ->file('foto_tiang_3')
                ->store('tiang', 'public');
        }

        TiangModel::create($data);

        return redirect('data-tiang')
            ->with('success', 'Data tiang berhasil disimpan.');
    }

    // Update Data Tiang

    public function UpdateTiang(Request $request, $id)
    {
        $tiang = TiangModel::findOrFail($id);

        $validated = $request->validate([
            'kode_tiang'      => 'required|string|max:255|unique:tiang,kode_tiang,' . $id,
            'area'            => 'required|string|max:255',
            'wilayah'         => 'required|string',
            'deskripsi_tiang' => 'nullable|string',

            'foto_tiang_1'    => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'foto_tiang_2'    => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'foto_tiang_3'    => 'nullable|image|mimes:jpg,jpeg,png|max:2048',

            'latitude'        => 'required|numeric',
            'longitude'       => 'required|numeric',
            'nama_petugas'    => 'required|string|max:255',
            'status'          => 'required|in:aktif,nonaktif',
        ]);

        $data = [
            'kode_tiang'      => $validated['kode_tiang'],
            'wilayah'         => $validated['wilayah'],
            'area'            => $validated['area'],
            'deskripsi_tiang' => $validated['deskripsi_tiang'] ?? null,
            'latitude'        => $validated['latitude'],
            'longitude'       => $validated['longitude'],
            'nama_petugas'    => $validated['nama_petugas'],
            'status'          => $validated['status'],
        ];

        if ($request->hasFile('foto_tiang_1')) {
            if ($tiang->foto_tiang_1) {
                Storage::disk('public')->delete($tiang->foto_tiang_1);
            }

            $data['foto_tiang_1'] = $request
                ->file('foto_tiang_1')
                ->store('tiang', 'public');
        }

        if ($request->hasFile('foto_tiang_2')) {
            if ($tiang->foto_tiang_2) {
                Storage::disk('public')->delete($tiang->foto_tiang_2);
            }

            $data['foto_tiang_2'] = $request
                ->file('foto_tiang_2')
                ->store('tiang', 'public');
        }

        if ($request->hasFile('foto_tiang_3')) {
            if ($tiang->foto_tiang_3) {
                Storage::disk('public')->delete($tiang->foto_tiang_3);
            }

            $data['foto_tiang_3'] = $request
                ->file('foto_tiang_3')
                ->store('tiang', 'public');
        }

        $tiang->update($data);

        return redirect('data-tiang')
            ->with('success', 'Data tiang berhasil diperbarui.');
    }

    // Hapus Tiang

    public function HapusTiang($id)
    {
        $tiang = TiangModel::findOrFail($id);

        if ($tiang->foto_tiang_1) {
            Storage::disk('public')->delete($tiang->foto_tiang_1);
        }

        if ($tiang->foto_tiang_2) {
            Storage::disk('public')->delete($tiang->foto_tiang_2);
        }

        if ($tiang->foto_tiang_3) {
            Storage::disk('public')->delete($tiang->foto_tiang_3);
        }

        $tiang->delete();

        return redirect('data-tiang')
            ->with('success', 'Data tiang berhasil dihapus.');
    }
}
