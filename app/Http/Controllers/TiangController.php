<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TiangModel;


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
            'status'          => 'required|in:Aktif,Nonaktif',
        ]);

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

        // Upload foto 1
        if ($request->hasFile('foto_tiang_1')) {
            $data['foto_tiang_1'] = $request
                ->file('foto_tiang_1')
                ->store('tiang', 'public');
        }

        // Upload foto 2
        if ($request->hasFile('foto_tiang_2')) {
            $data['foto_tiang_2'] = $request
                ->file('foto_tiang_2')
                ->store('tiang', 'public');
        }

        // Upload foto 3
        if ($request->hasFile('foto_tiang_3')) {
            $data['foto_tiang_3'] = $request
                ->file('foto_tiang_3')
                ->store('tiang', 'public');
        }

        TiangModel::create($data);

        return redirect('data-tiang')
            ->with('success', 'Data tiang berhasil disimpan.');
    }

    // Hapus Tiang

    public function HapusTiang($id)
    {
        $tiang = TiangModel::findOrFail($id);

        $tiang->delete();

        return redirect('data-tiang')
            ->with('success', 'Data tiang berhasil dihapus.');
    }
}
