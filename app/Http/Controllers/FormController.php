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
    public function EditTiang()
    {
        return Inertia::render('FormEditTiang');
    }
}
