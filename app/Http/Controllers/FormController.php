<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class FormController extends Controller
{
    // Form Tambah Tiang

    public function TambahTiang()
    {
        return Inertia::render('FormTambahTiang');
    }

    // Form Tambah ONT

    public function TambahONT()
    {
        return Inertia::render('FormTambahONT');
    }

    // Form Edit Tiang

    public function EditTiang()
    {
        return Inertia::render('FormEditTiang');
    }

    // Form Edit ONT

    public function EditONT()
    {
        return Inertia::render('FormEditONT');
    }
}
