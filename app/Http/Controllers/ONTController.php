<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ONTModel;

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
            'status'          => 'required|in:Aktif,Nonaktif',
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

        // Upload foto 1
        if ($request->hasFile('foto_ont_1')) {
            $data['foto_ont_1'] = $request
                ->file('foto_ont_1')
                ->store('ont', 'public');
        }

        // Upload foto 2
        if ($request->hasFile('foto_ont_2')) {
            $data['foto_ont_2'] = $request
                ->file('foto_ont_2')
                ->store('ont', 'public');
        }

        // Upload foto 3
        if ($request->hasFile('foto_ont_3')) {
            $data['foto_ont_3'] = $request
                ->file('foto_ont_3')
                ->store('ont', 'public');
        }

        ONTModel::create($data);

        return redirect('data-ont')
            ->with('success', 'Data ONT berhasil disimpan.');
    }
}
