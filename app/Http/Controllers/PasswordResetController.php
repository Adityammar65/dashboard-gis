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

        if ($approver && $approver === $reset->username) {
            return back()->withErrors(['Tidak dapat menyetujui permintaan reset akun sendiri.']);
        }

        $user = UserModel::where('username', $reset->username)->first();

        if (!$user) {
            return back()->withErrors(['Akun tidak ditemukan (mungkin sudah dihapus).']);
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

        if ($approver && $approver === $reset->username) {
            return back()->withErrors(['Tidak dapat menolak permintaan reset akun sendiri.']);
        }

        $reset->update([
            'status' => 'rejected',
            'handled_by' => $approver,
            'handled_at' => now(),
        ]);

        return back()->with('success', "Permintaan reset akun {$reset->username} ditolak.");
    }
}
