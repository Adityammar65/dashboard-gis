<?php

namespace App\Http\Controllers;

use App\Helpers\NotifikasiHelper;
use App\Models\PasswordResetRequest;
use App\Models\UserModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class PasswordResetController extends Controller
{
    // Request reset password

    public function request(Request $request)
    {
        $request->validate([
            'username' => ['required', 'string', 'exists:user,username'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ], [
            'username.exists' => 'Username tidak ditemukan.',
            'password.min' => 'Kata sandi baru minimal 8 karakter.',
            'password.confirmed' => 'Konfirmasi kata sandi tidak cocok.',
        ]);

        $username = $request->username;

        $pending = PasswordResetRequest::where('username', $username)
            ->where('status', 'pending')
            ->exists();

        if ($pending) {
            return back()->withErrors([
                'Permintaan reset untuk username ini masih menunggu persetujuan admin.',
            ]);
        }

        $reset = PasswordResetRequest::create([
            'username' => $username,
            'password_hash' => Hash::make($request->password),
            'request_type' => 'password_reset',
            'requested_by' => $username,
            'new_username' => null,
            'status' => 'pending',
            'requested_ip' => $request->ip(),
        ]);

        $notif = NotifikasiHelper::push(
            'Reset Kata Sandi Diminta',
            'akun',
            "Permintaan reset kata sandi untuk username {$username} menunggu persetujuan.",
            $username
        );

        if ($notif) {
            $notif->update(['reset_request_id' => $reset->id]);
        }

        return back()->with('success', 'Permintaan reset terkirim. Tunggu persetujuan admin, lalu masuk dengan kata sandi baru.');
    }

    // Setujui request

    public function approve(Request $request, $id)
    {
        $reset = PasswordResetRequest::findOrFail($id);

        if (!$reset->isPending()) {
            return back()->withErrors(['Permintaan ini sudah ditindaklanjuti.']);
        }

        $approver = $request->session()->get('username');
        $requester = $reset->requested_by ?: $reset->username;
        $type = $reset->request_type ?: 'password_reset';

        if ($approver && ($approver === $reset->username || $approver === $requester)) {
            return back()->withErrors(['Tidak dapat menyetujui permintaan akun sendiri.']);
        }

        $user = UserModel::where('username', $reset->username)->first();

        if (!$user) {
            return back()->withErrors(['Akun tidak ditemukan (mungkin sudah dihapus).']);
        }

        if ($type === 'username_change') {
            $newUsername = trim((string) ($reset->new_username ?? ''));

            if ($newUsername === '' || $newUsername === $user->username) {
                return back()->withErrors(['Username baru tidak valid.']);
            }

            $taken = UserModel::where('username', $newUsername)
                ->where('id', '!=', $user->id)
                ->exists();

            if ($taken) {
                return back()->withErrors(['Username baru sudah digunakan pengguna lain.']);
            }

            DB::table('user')->where('id', $user->id)->update([
                'username' => $newUsername,
                'updated_at' => now(),
            ]);

            $reset->update([
                'status' => 'approved',
                'handled_by' => $approver,
                'handled_at' => now(),
            ]);

            return back()->with('success', "Username {$reset->username} berhasil diubah menjadi {$newUsername}.");
        }

        if (!$reset->password_hash) {
            return back()->withErrors(['Data kata sandi pada permintaan tidak valid.']);
        }

        DB::table('user')->where('id', $user->id)->update([
            'password' => $reset->password_hash,
            'remember_token' => null,
            'updated_at' => now(),
        ]);

        $reset->update([
            'status' => 'approved',
            'handled_by' => $approver,
            'handled_at' => now(),
        ]);

        return back()->with('success', "Kata sandi akun {$reset->username} berhasil diatur ulang.");
    }

    // Tolak request

    public function reject(Request $request, $id)
    {
        $reset = PasswordResetRequest::findOrFail($id);

        if (!$reset->isPending()) {
            return back()->withErrors(['Permintaan ini sudah ditindaklanjuti.']);
        }

        $approver = $request->session()->get('username');
        $requester = $reset->requested_by ?: $reset->username;

        if ($approver && ($approver === $reset->username || $approver === $requester)) {
            return back()->withErrors(['Tidak dapat menolak permintaan akun sendiri.']);
        }

        $reset->update([
            'status' => 'rejected',
            'handled_by' => $approver,
            'handled_at' => now(),
        ]);

        return back()->with('success', "Permintaan akun {$reset->username} ditolak.");
    }
}
