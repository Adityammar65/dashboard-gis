<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class PageController extends Controller
{
    // Halaman Utama

    public function Index()
    {
        return Inertia::render('Dashboard');
    }

    // Halaman Data Tiang

    public function DataTiang()
    {
        return Inertia::render('DataTiang');
    }

    // Halaman Data ONT

    public function DataONT()
    {
        return Inertia::render('DataONT');
    }

    // Preview Peta

    public function Peta()
    {
        return Inertia::render('Peta');
    }

    // Wilayah

    public function Wilayah()
    {
        return Inertia::render('Wilayah');
    }

    // PetaSebaranAset

    public function PetaSebaranAset()
    {
        return Inertia::render('PetaSebaranAset');
    }
}
