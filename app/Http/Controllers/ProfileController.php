<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Helpers\NotifikasiHelper;
use App\Models\PasswordResetRequest;
use App\Models\UserModel;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class ProfileController extends Controller
{
    // Ajukan perubahan username (menunggu persetujuan admin)

    public function updateUsername(Request $request)
    {
        $userId = $request->session()->get('user_id');
        $user = $userId ? UserModel::find($userId) : null;

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

        $newUsername = trim($request->username);
        $currentUsername = $user->username;

        if ($newUsername === $currentUsername) {
            return back()->withErrors(['username' => 'Username baru sama dengan username saat ini.']);
        }

        $pending = PasswordResetRequest::where('status', 'pending')
            ->where('request_type', 'username_change')
            ->where(function ($q) use ($currentUsername) {
                $q->where('username', $currentUsername)
                    ->orWhere('requested_by', $currentUsername);
            })
            ->exists();

        if ($pending) {
            return back()->withErrors([
                'Permintaan ubah username untuk akun ini masih menunggu persetujuan admin.',
            ]);
        }

        $reset = PasswordResetRequest::create([
            'username' => $currentUsername,
            'password_hash' => null,
            'request_type' => 'username_change',
            'requested_by' => $currentUsername,
            'new_username' => $newUsername,
            'status' => 'pending',
            'requested_ip' => $request->ip(),
        ]);

        $notif = NotifikasiHelper::push(
            'Ubah Username Diminta',
            'akun',
            "Permintaan ubah username {$currentUsername} → {$newUsername} menunggu persetujuan.",
            $currentUsername
        );

        if ($notif) {
            $notif->update(['reset_request_id' => $reset->id]);
        }

        return redirect()
            ->back()
            ->with('success', 'Permintaan ubah username terkirim. Tunggu persetujuan admin sebelum berlaku.');
    }

    // Ajukan perubahan kata sandi (menunggu persetujuan admin)

    public function updatePassword(Request $request)
    {
        $userId = $request->session()->get('user_id');
        $user = $userId ? UserModel::find($userId) : null;

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

        $currentUsername = $user->username;

        $pending = PasswordResetRequest::where('status', 'pending')
            ->whereIn('request_type', ['password_change', 'password_reset'])
            ->where(function ($q) use ($currentUsername) {
                $q->where('username', $currentUsername)
                    ->orWhere('requested_by', $currentUsername);
            })
            ->exists();

        if ($pending) {
            return back()->withErrors([
                'Permintaan ubah kata sandi untuk akun ini masih menunggu persetujuan admin.',
            ]);
        }

        $reset = PasswordResetRequest::create([
            'username' => $currentUsername,
            'password_hash' => Hash::make($request->password),
            'request_type' => 'password_change',
            'requested_by' => $currentUsername,
            'new_username' => null,
            'status' => 'pending',
            'requested_ip' => $request->ip(),
        ]);

        $notif = NotifikasiHelper::push(
            'Ubah Kata Sandi Diminta',
            'akun',
            "Permintaan ubah kata sandi untuk username {$currentUsername} menunggu persetujuan.",
            $currentUsername
        );

        if ($notif) {
            $notif->update(['reset_request_id' => $reset->id]);
        }

        return redirect()
            ->back()
            ->with('success', 'Permintaan ubah kata sandi terkirim. Tunggu persetujuan admin sebelum berlaku.');
    }

    // Ajukan gabungan username + kata sandi dalam satu tombol (satu request)

    public function updateProfile(Request $request)
    {
        $userId = $request->session()->get('user_id');
        $user = $userId ? UserModel::find($userId) : null;

        if (!$user) {
            return back()->withErrors(['Sesi pengguna tidak ditemukan. Silakan masuk kembali.']);
        }

        $currentUsername = $user->username;
        $newUsername = trim((string) $request->input('username', ''));
        $wantsUsername = $newUsername !== '' && $newUsername !== $currentUsername;

        $currentPassword = (string) $request->input('current_password', '');
        $password = (string) $request->input('password', '');
        $passwordConfirmation = (string) $request->input('password_confirmation', '');
        $wantsPassword = $currentPassword !== '' || $password !== '' || $passwordConfirmation !== '';

        if (!$wantsUsername && !$wantsPassword) {
            return back()->withErrors(['Tidak ada perubahan yang diajukan.']);
        }

        if ($wantsUsername) {
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

            $pendingUsername = PasswordResetRequest::where('status', 'pending')
                ->where('request_type', 'username_change')
                ->where(function ($q) use ($currentUsername) {
                    $q->where('username', $currentUsername)
                        ->orWhere('requested_by', $currentUsername);
                })
                ->exists();

            if ($pendingUsername) {
                return back()->withErrors([
                    'Permintaan ubah username untuk akun ini masih menunggu persetujuan admin.',
                ]);
            }
        }

        if ($wantsPassword) {
            $request->validate([
                'current_password' => ['required', 'string'],
                'password' => ['required', 'string', 'min:8', 'confirmed'],
            ]);

            if (!Hash::check($currentPassword, $user->password)) {
                return back()->withErrors(['Password saat ini salah.']);
            }

            $pendingPassword = PasswordResetRequest::where('status', 'pending')
                ->whereIn('request_type', ['password_change', 'password_reset'])
                ->where(function ($q) use ($currentUsername) {
                    $q->where('username', $currentUsername)
                        ->orWhere('requested_by', $currentUsername);
                })
                ->exists();

            if ($pendingPassword) {
                return back()->withErrors([
                    'Permintaan ubah kata sandi untuk akun ini masih menunggu persetujuan admin.',
                ]);
            }
        }

        $created = [];

        if ($wantsUsername) {
            $reset = PasswordResetRequest::create([
                'username' => $currentUsername,
                'password_hash' => null,
                'request_type' => 'username_change',
                'requested_by' => $currentUsername,
                'new_username' => $newUsername,
                'status' => 'pending',
                'requested_ip' => $request->ip(),
            ]);

            $notif = NotifikasiHelper::push(
                'Ubah Username Diminta',
                'akun',
                "Permintaan ubah username {$currentUsername} → {$newUsername} menunggu persetujuan.",
                $currentUsername
            );

            if ($notif) {
                $notif->update(['reset_request_id' => $reset->id]);
            }

            $created[] = 'username';
        }

        if ($wantsPassword) {
            $reset = PasswordResetRequest::create([
                'username' => $currentUsername,
                'password_hash' => Hash::make($password),
                'request_type' => 'password_change',
                'requested_by' => $currentUsername,
                'new_username' => null,
                'status' => 'pending',
                'requested_ip' => $request->ip(),
            ]);

            $notif = NotifikasiHelper::push(
                'Ubah Kata Sandi Diminta',
                'akun',
                "Permintaan ubah kata sandi untuk username {$currentUsername} menunggu persetujuan.",
                $currentUsername
            );

            if ($notif) {
                $notif->update(['reset_request_id' => $reset->id]);
            }

            $created[] = 'kata sandi';
        }

        return redirect()
            ->back()
            ->with('success', 'Permintaan ubah ' . implode(' dan ', $created) . ' terkirim. Tunggu persetujuan admin sebelum berlaku.');
    }
}
