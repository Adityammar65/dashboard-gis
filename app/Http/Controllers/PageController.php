<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\TiangModel;
use App\Models\ONTModel;
use App\Models\NotifikasiModel;
use App\Models\WilayahModel;
use Illuminate\Support\Facades\Storage;

class PageController extends Controller
{
    // Halaman Utama

    public function Index()
    {
        return Inertia::render('Home');
    }

    // Halaman Data Tiang

    public function DataTiang()
    {
        $tiang = TiangModel::all();

        return Inertia::render('DataTiang', [
            'dataTiang' => $tiang
        ]);
    }

    // Halaman Data ONT

    public function DataONT()
    {
        $ont = ONTModel::all();

        return Inertia::render('DataONT', [
            'dataONT' => $ont
        ]);
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

    // Peta Sebaran Aset

    public function PetaSebaranAset()
    {
        return Inertia::render('PetaSebaranAset');
    }

    // Detail Tiang

    public function DetailTiang()
    {
        return Inertia::render('DetailTiang');
    }

    // Detail ONT

    public function DetailONT()
    {
        return Inertia::render('DetailONT');
    }

    // Login

    public function Login()
    {
        return Inertia::render('Login');
    }

    // Notifikasi

    public function Notifikasi()
    {
        return Inertia::render('Notifikasi');
    }

    // Pengaturan

    public function Pengaturan()
    {
        $wilayah = WilayahModel::all();

        $path = storage_path('app/settings.json');

        $settings = [];

        if (file_exists($path)) {
            $settings = json_decode(
                file_get_contents($path),
                true
            ) ?? [];
        }

        return Inertia::render('Pengaturan', [
            'wilayah' => $wilayah,
            'settings' => $settings,
        ]);
    }
}
