<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class FormController extends Controller
{
    // Form Tambah Tiang

    public function TambahTiang()
    {
        return Inertia::render('Forms/FormTambahTiang');
    }

    // Form Tambah ONT

    public function TambahONT()
    {
        return Inertia::render('Forms/FormTambahONT');
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
