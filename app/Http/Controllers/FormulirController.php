<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\WilayahModel;
use App\Models\TiangModel;
use App\Models\ONTModel;
use Illuminate\Support\Facades\Cache;

class FormulirController extends Controller
{
    // Form Tambah Tiang

    public function TambahTiang()
    {
        $wilayah = Cache::remember('wilayah:list', 3600, fn() => WilayahModel::all());
        return Inertia::render('Formulir/FormulirTambahTiang', [
            'wilayah' => $wilayah
        ]);
    }

    // Form Tambah ONT

    public function TambahONT()
    {
        $wilayah = Cache::remember('wilayah:list', 3600, fn() => WilayahModel::all());
        return Inertia::render('Formulir/FormulirTambahONT', [
            'wilayah' => $wilayah
        ]);
    }

    // Form Edit Tiang

    public function EditTiang($id)
    {
        $tiang = \App\Models\TiangModel::findOrFail($id);
        $wilayah = Cache::remember('wilayah:list', 3600, fn() => WilayahModel::all());
        return Inertia::render('Formulir/FormulirUbahTiang', [
            'tiang' => $tiang,
            'wilayah' => $wilayah,
        ]);
    }

    // Form Edit ONT

    public function EditONT($id)
    {
        $ont = ONTModel::findOrFail($id);
        $wilayah = Cache::remember('wilayah:list', 3600, fn() => WilayahModel::all());
        return Inertia::render('Formulir/FormulirUbahONT', [
            'ont' => $ont,
            'wilayah' => $wilayah,
        ]);
    }

    // Form Tambah Wilayah

    public function TambahWilayah()
    {
        return Inertia::render('Formulir/FormulirTambahWilayah');
    }
}
