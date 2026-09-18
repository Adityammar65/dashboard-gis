<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\TiangModel;
use App\Models\ONTModel;
use App\Models\NotifikasiModel;
use App\Models\WilayahModel;
use App\Models\UserModel;
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

    public function Wilayah(Request $request)
    {
        $wilayahList = Cache::remember('wilayah:list', 3600, fn() => WilayahModel::all());

        $tiangGrouped = TiangModel::selectRaw("wilayah, COUNT(*) as total, SUM(CASE WHEN LOWER(status)='aktif' THEN 1 ELSE 0 END) as aktif, SUM(CASE WHEN LOWER(status)='nonaktif' THEN 1 ELSE 0 END) as nonaktif")
            ->groupBy('wilayah')
            ->get()
            ->keyBy('wilayah');

        $ontGrouped = ONTModel::selectRaw("wilayah, COUNT(*) as total, SUM(CASE WHEN LOWER(status)='aktif' THEN 1 ELSE 0 END) as aktif, SUM(CASE WHEN LOWER(status)='nonaktif' THEN 1 ELSE 0 END) as nonaktif")
            ->groupBy('wilayah')
            ->get()
            ->keyBy('wilayah');

        $rows = collect($wilayahList)->map(function ($w) use ($tiangGrouped, $ontGrouped) {
            $nama = $w->nama_wilayah;
            $tg = $tiangGrouped->get($nama);
            $og = $ontGrouped->get($nama);
            $totalTiang = $tg ? (int) $tg->total : 0;
            $totalOnt = $og ? (int) $og->total : 0;
            $aktif = (int) ($tg->aktif ?? 0) + (int) ($og->aktif ?? 0);
            $nonaktif = (int) ($tg->nonaktif ?? 0) + (int) ($og->nonaktif ?? 0);
            return [
                'id' => $w->id,
                'nama_wilayah' => $nama,
                'kode_wilayah' => $w->kode_wilayah,
                'total_tiang' => $totalTiang,
                'total_ont' => $totalOnt,
                'total_aset' => $totalTiang + $totalOnt,
                'aset_aktif' => $aktif,
                'aset_nonaktif' => $nonaktif,
            ];
        });

        $filterWilayah = $request->query('wilayah', '');
        $filterAset = $request->query('aset', '');

        if ($request->filled('wilayah')) {
            $wilayahFilter = Cache::remember('wilayah:' . $request->wilayah, 3600, fn() => WilayahModel::find($request->wilayah));
            if ($wilayahFilter) {
                $rows = $rows->where('id', (int) $wilayahFilter->id)->values();
            } else {
                $rows = $rows->where('nama_wilayah', $request->wilayah)->values();
            }
        }

        if ($request->filled('aset') && in_array($request->aset, ['tiang', 'ont'])) {
            if ($request->aset === 'tiang') {
                $rows = $rows->filter(fn($r) => $r['total_tiang'] > 0)->values();
                if ($request->filled('wilayah') && $rows->isEmpty()) {
                    $rows = collect($wilayahList)->map(function ($w) use ($tiangGrouped, $ontGrouped) {
                        $nama = $w->nama_wilayah;
                        $tg = $tiangGrouped->get($nama);
                        $og = $ontGrouped->get($nama);
                        return [
                            'id' => $w->id,
                            'nama_wilayah' => $nama,
                            'kode_wilayah' => $w->kode_wilayah,
                            'total_tiang' => $tg ? (int) $tg->total : 0,
                            'total_ont' => $og ? (int) $og->total : 0,
                            'total_aset' => ($tg ? (int) $tg->total : 0) + ($og ? (int) $og->total : 0),
                            'aset_aktif' => (int) ($tg->aktif ?? 0) + (int) ($og->aktif ?? 0),
                            'aset_nonaktif' => (int) ($tg->nonaktif ?? 0) + (int) ($og->nonaktif ?? 0),
                        ];
                    })->where('id', (int) $request->wilayah)->values();
                }
            }

            if ($request->aset === 'ont') {
                $rows = $rows->filter(fn($r) => $r['total_ont'] > 0)->values();
                if ($request->filled('wilayah') && $rows->isEmpty()) {
                    $rows = collect($wilayahList)->map(function ($w) use ($tiangGrouped, $ontGrouped) {
                        $nama = $w->nama_wilayah;
                        $tg = $tiangGrouped->get($nama);
                        $og = $ontGrouped->get($nama);
                        return [
                            'id' => $w->id,
                            'nama_wilayah' => $nama,
                            'kode_wilayah' => $w->kode_wilayah,
                            'total_tiang' => $tg ? (int) $tg->total : 0,
                            'total_ont' => $og ? (int) $og->total : 0,
                            'total_aset' => ($tg ? (int) $tg->total : 0) + ($og ? (int) $og->total : 0),
                            'aset_aktif' => (int) ($tg->aktif ?? 0) + (int) ($og->aktif ?? 0),
                            'aset_nonaktif' => (int) ($tg->nonaktif ?? 0) + (int) ($og->nonaktif ?? 0),
                        ];
                    })->where('id', (int) $request->wilayah)->values();
                }
            }
        }

        $page = max(1, (int) $request->query('page', 1));
        $perPage = 15;
        $totalRows = $rows->count();
        $paginatedRows = $rows->forPage($page, $perPage)->values();
        $paginator = new \Illuminate\Pagination\LengthAwarePaginator(
            $paginatedRows,
            $totalRows,
            $perPage,
            $page,
            ['path' => $request->url(), 'query' => $request->query()]
        );

        return Inertia::render('Wilayah', [
            'dataWilayah' => $paginator,
            'wilayah' => $wilayahList,
            'filter' => [
                'wilayah' => $filterWilayah,
                'aset' => $filterAset,
            ],
        ]);
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
            $user = UserModel::find($id);
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
        $notifikasi = NotifikasiModel::orderByRaw("CASE WHEN status = 'belum_dibaca' THEN 0 ELSE 1 END")->orderByDesc('id')->limit(100)->get();
        return Inertia::render('Notifikasi', [
            'notifikasi' => $notifikasi,
        ]);
    }

    // Detail Notifikasi

    public function DetailNotifikasi($id)
    {
        $notifikasi = NotifikasiModel::findOrFail($id);
        if ($notifikasi->status === 'belum_dibaca') {
            $notifikasi->update(['status' => 'dibaca']);
            $notifikasi->refresh();
        }
        return Inertia::render('DetailNotifikasi', [
            'notifikasi' => $notifikasi,
        ]);
    }

    // Tandai Semua Notifikasi Dibaca

    public function TandaiSemuaDibaca()
    {
        NotifikasiModel::where('status', 'belum_dibaca')->update(['status' => 'dibaca']);
        return redirect('notifikasi');
    }

    // Hapus Semua Notifikasi yang Sudah Dibaca

    public function HapusSudahDibaca()
    {
        NotifikasiModel::where('status', 'dibaca')->delete();
        return redirect('notifikasi');
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
