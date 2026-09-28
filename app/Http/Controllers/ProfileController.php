<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserModel;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class ProfileController extends Controller
{
    // Ubah username pengguna yang sedang masuk

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

        $user->username = $request->username;
        $user->save();

        $request->session()->put(['username' => $user->username]);

        return redirect()
            ->back()
            ->with('success', 'Username berhasil diperbarui.');
    }

    // Ubah kata sandi pengguna yang sedang masuk

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

        $user->password = $request->password;
        $user->save();

        return redirect()
            ->back()
            ->with('success', 'Kata sandi berhasil diperbarui.');
    }
}
