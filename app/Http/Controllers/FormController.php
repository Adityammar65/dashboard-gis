<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\WilayahModel;

class FormController extends Controller
{
    // Form Tambah Tiang

    public function TambahTiang()
    {
        $wilayah = WilayahModel::all();

        return Inertia::render('Forms/FormTambahTiang', [
            'wilayah' => $wilayah
        ]);
    }

    // Form Tambah ONT

    public function TambahONT()
    {
        $wilayah = WilayahModel::all();

        return Inertia::render('Forms/FormTambahONT', [
            'wilayah' => $wilayah
        ]);
    }

    // Form Edit Tiang

    public function EditTiang()
    {
        return Inertia::render('Forms/FormEditTiang');
    }

    // Form Edit ONT

    public function EditONT()
    {
        return Inertia::render('Forms/FormEditONT');
    }
}
