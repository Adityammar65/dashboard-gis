<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Helpers\NotifikasiHelper;
use App\Models\RequestPerubahanAkun;
use App\Models\UserModel;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class ProfilController extends Controller
{
    // Ajukan perubahan username (menunggu persetujuan admin)

    public function perbaruiUser(Request $request)
    {
        $idUser = $request->session()->get('user_id');
        $user = $idUser ? UserModel::find($idUser) : null;

        if (!$user) {
            return back()->withErrors(['Sesi pengguna tidak ditemukan. Silakan masuk kembali.']);
        }

        $request->validate([
            'username' => [
                'required',
                'string',
                'min:3',
                'max:255',
                Rule::unique('user', 'username')->ignore($user->id),
            ],
        ], [
            'username.unique' => 'Username sudah digunakan.',
        ]);

        $userBaru = trim($request->username);
        $userSaatIni = $user->username;

        if ($userBaru === $userSaatIni) {
            return back()->withErrors(['username' => 'Username baru sama dengan username saat ini.']);
        }

        $menunggu = RequestPerubahanAkun::where('status', 'pending')
            ->where('tipe_request', 'username_change')
            ->where(function ($q) use ($userSaatIni) {
                $q->where('username', $userSaatIni)
                    ->orWhere('requested_by', $userSaatIni);
            })
            ->exists();

        if ($menunggu) {
            return back()->withErrors([
                'Permintaan ubah username untuk akun ini masih menunggu persetujuan admin.',
            ]);
        }

        $reset = RequestPerubahanAkun::create([
            'username' => $userSaatIni,
            'password_baru' => null,
            'tipe_request' => 'username_change',
            'requested_by' => $userSaatIni,
            'username_baru' => $userBaru,
            'status' => 'pending',
            'requested_ip' => $request->ip(),
        ]);

        $notif = NotifikasiHelper::kirim(
            'Ubah Username Diminta',
            'akun',
            "Permintaan ubah username {$userSaatIni} → {$userBaru} menunggu persetujuan.",
            $userSaatIni
        );

        if ($notif) {
            $notif->update(['reset_request_id' => $reset->id]);
        }

        return redirect()
            ->back()
            ->with('success', 'Permintaan ubah username terkirim. Tunggu persetujuan admin sebelum berlaku.');
    }

    // Ajukan perubahan kata sandi (menunggu persetujuan admin)

    public function perbaruiKataSandi(Request $request)
    {
        $idUser = $request->session()->get('user_id');
        $user = $idUser ? UserModel::find($idUser) : null;

        if (!$user) {
            return back()->withErrors(['Sesi pengguna tidak ditemukan. Silakan masuk kembali.']);
        }

        $request->validate([
            'current_password' => ['required', 'string'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        if (!Hash::check($request->current_password, $user->password)) {
            return back()->withErrors(['Password saat ini salah.']);
        }

        $userSaatIni = $user->username;

        $menunggu = RequestPerubahanAkun::where('status', 'pending')
            ->whereIn('tipe_request', ['password_change', 'password_reset'])
            ->where(function ($q) use ($userSaatIni) {
                $q->where('username', $userSaatIni)
                    ->orWhere('requested_by', $userSaatIni);
            })
            ->exists();

        if ($menunggu) {
            return back()->withErrors([
                'Permintaan ubah kata sandi untuk akun ini masih menunggu persetujuan admin.',
            ]);
        }

        $reset = RequestPerubahanAkun::create([
            'username' => $userSaatIni,
            'password_baru' => Hash::make($request->password),
            'tipe_request' => 'password_change',
            'requested_by' => $userSaatIni,
            'username_baru' => null,
            'status' => 'pending',
            'requested_ip' => $request->ip(),
        ]);

        $notif = NotifikasiHelper::kirim(
            'Ubah Kata Sandi Diminta',
            'akun',
            "Permintaan ubah kata sandi untuk username {$userSaatIni} menunggu persetujuan.",
            $userSaatIni
        );

        if ($notif) {
            $notif->update(['reset_request_id' => $reset->id]);
        }

        return redirect()
            ->back()
            ->with('success', 'Permintaan ubah kata sandi terkirim. Tunggu persetujuan admin sebelum berlaku.');
    }

    // Ajukan gabungan username + kata sandi dalam satu tombol (satu request)

    public function perbaruiProfil(Request $request)
    {
        $idUser = $request->session()->get('user_id');
        $user = $idUser ? UserModel::find($idUser) : null;

        if (!$user) {
            return back()->withErrors(['Sesi pengguna tidak ditemukan. Silakan masuk kembali.']);
        }

        $userSaatIni = $user->username;
        $userBaru = trim((string) $request->input('username', ''));
        $inginUser = $userBaru !== '' && $userBaru !== $userSaatIni;

        $kataSandiSaatIni = (string) $request->input('current_password', '');
        $password = (string) $request->input('password', '');
        $konfirmasiKataSandi = (string) $request->input('password_confirmation', '');
        $inginKataSandi = $kataSandiSaatIni !== '' || $password !== '' || $konfirmasiKataSandi !== '';

        if (!$inginUser && !$inginKataSandi) {
            return back()->withErrors(['Tidak ada perubahan yang diajukan.']);
        }

        if ($inginUser) {
            $request->validate([
                'username' => [
                    'required',
                    'string',
                    'min:3',
                    'max:255',
                    Rule::unique('user', 'username')->ignore($user->id),
                ],
            ], [
                'username.unique' => 'Username sudah digunakan.',
            ]);

            $menungguUser = RequestPerubahanAkun::where('status', 'pending')
                ->where('tipe_request', 'username_change')
                ->where(function ($q) use ($userSaatIni) {
                    $q->where('username', $userSaatIni)
                        ->orWhere('requested_by', $userSaatIni);
                })
                ->exists();

            if ($menungguUser) {
                return back()->withErrors([
                    'Permintaan ubah username untuk akun ini masih menunggu persetujuan admin.',
                ]);
            }
        }

        if ($inginKataSandi) {
            $request->validate([
                'current_password' => ['required', 'string'],
                'password' => ['required', 'string', 'min:8', 'confirmed'],
            ]);

            if (!Hash::check($kataSandiSaatIni, $user->password)) {
                return back()->withErrors(['Password saat ini salah.']);
            }

            $menungguKataSandi = RequestPerubahanAkun::where('status', 'pending')
                ->whereIn('tipe_request', ['password_change', 'password_reset'])
                ->where(function ($q) use ($userSaatIni) {
                    $q->where('username', $userSaatIni)
                        ->orWhere('requested_by', $userSaatIni);
                })
                ->exists();

            if ($menungguKataSandi) {
                return back()->withErrors([
                    'Permintaan ubah kata sandi untuk akun ini masih menunggu persetujuan admin.',
                ]);
            }
        }

        $dibuat = [];

        if ($inginUser) {
            $reset = RequestPerubahanAkun::create([
                'username' => $userSaatIni,
                'password_baru' => null,
                'tipe_request' => 'username_change',
                'requested_by' => $userSaatIni,
                'username_baru' => $userBaru,
                'status' => 'pending',
                'requested_ip' => $request->ip(),
            ]);

            $notif = NotifikasiHelper::kirim(
                'Ubah Username Diminta',
                'akun',
                "Permintaan ubah username {$userSaatIni} → {$userBaru} menunggu persetujuan.",
                $userSaatIni
            );

            if ($notif) {
                $notif->update(['reset_request_id' => $reset->id]);
            }

            $dibuat[] = 'username';
        }

        if ($inginKataSandi) {
            $reset = RequestPerubahanAkun::create([
                'username' => $userSaatIni,
                'password_baru' => Hash::make($password),
                'tipe_request' => 'password_change',
                'requested_by' => $userSaatIni,
                'username_baru' => null,
                'status' => 'pending',
                'requested_ip' => $request->ip(),
            ]);

            $notif = NotifikasiHelper::kirim(
                'Ubah Kata Sandi Diminta',
                'akun',
                "Permintaan ubah kata sandi untuk username {$userSaatIni} menunggu persetujuan.",
                $userSaatIni
            );

            if ($notif) {
                $notif->update(['reset_request_id' => $reset->id]);
            }

            $dibuat[] = 'kata sandi';
        }

        return redirect()
            ->back()
            ->with('success', 'Permintaan ubah ' . implode(' dan ', $dibuat) . ' terkirim. Tunggu persetujuan admin sebelum berlaku.');
    }
}
