<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\TiangModel;
use App\Models\ONTModel;
use App\Models\NotifikasiModel;
use App\Models\WilayahModel;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Cache;

class PageController extends Controller
{
    // Halaman Utama

    public function Index()
    {
        return Inertia::render('Home');
    }

    // Halaman Data Tiang

    public function DataTiang(Request $request)
    {
        $query = TiangModel::query()->select(['id', 'kode_tiang', 'wilayah', 'area', 'nama_petugas', 'status', 'foto_tiang_1', 'latitude', 'longitude']);

        if ($request->filled('wilayah')) {
            $wilayah = Cache::remember('wilayah:' . $request->wilayah, 3600, fn() => WilayahModel::find($request->wilayah));
            if ($wilayah) {
                $query->where('wilayah', $wilayah->nama_wilayah);
            }
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $dataTiang = $query->latest('id')->paginate(15)->withQueryString();
        $wilayah = Cache::remember('wilayah:list', 3600, fn() => WilayahModel::all());

        return Inertia::render('DataTiang', [
            'dataTiang' => $dataTiang,
            'wilayah' => $wilayah,
            'filter' => [
                'wilayah' => $request->wilayah ?? '',
                'status' => $request->status ?? '',
            ],
        ]);
    }

    // Halaman Data ONT

    public function DataONT(Request $request)
    {
        $query = ONTModel::query()->select(['id', 'kode_ont', 'wilayah', 'area', 'nama_petugas', 'status', 'foto_ont_1', 'latitude', 'longitude']);

        if ($request->filled('wilayah')) {
            $wilayah = Cache::remember('wilayah:' . $request->wilayah, 3600, fn() => WilayahModel::find($request->wilayah));
            if ($wilayah) {
                $query->where('wilayah', $wilayah->nama_wilayah);
            }
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $dataONT = $query->latest('id')->paginate(15)->withQueryString();
        $wilayah = Cache::remember('wilayah:list', 3600, fn() => WilayahModel::all());

        return Inertia::render('DataONT', [
            'dataONT' => $dataONT,
            'wilayah' => $wilayah,
            'filter' => [
                'wilayah' => $request->wilayah ?? '',
                'status' => $request->status ?? '',
            ],
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

    public function DetailTiang($id)
    {
        $tiang = TiangModel::findOrFail($id);

        return Inertia::render('DetailTiang', [
            'tiang' => $tiang,
        ]);
    }

    // Detail ONT

    public function DetailONT($id)
    {
        $ont = ONTModel::findOrFail($id);

        return Inertia::render('DetailONT', [
            'ont' => $ont,
        ]);
    }

    // Login

    public function Login(Request $request)
    {
        if ($request->session()->has('login')) {
            return redirect('home');
        }

        $cookie = $request->cookie('gis_remember');
        if ($cookie && str_contains($cookie, '|')) {
            [$id, $plainToken] = explode('|', $cookie, 2);
            $user = \App\Models\UserModel::find($id);
            if ($user && $user->remember_token && hash_equals($user->remember_token, hash('sha256', $plainToken))) {
                $request->session()->regenerate();
                $request->session()->put([
                    'login' => true,
                    'user_id' => $user->id,
                    'username' => $user->username,
                ]);
                return redirect('home');
            }
        }

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
        $wilayah = Cache::remember('wilayah:list', 3600, fn() => WilayahModel::all());
        $settings = Cache::remember('settings', 3600, function () {
            $path = storage_path('app/settings.json');
            if (!file_exists($path)) return [];
            return json_decode(file_get_contents($path), true) ?? [];
        });

        return Inertia::render('Pengaturan', [
            'wilayah' => $wilayah,
            'settings' => $settings,
        ]);
    }
}
