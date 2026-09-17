<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserModel;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    // Login

    public function ProsesLogin(Request $request)
    {

        // Validasi

        $request->validate([
            'username' => 'required',
            'password' => 'required'
        ]);

        // Cari Username

        $user = UserModel::where('username', $request->username)->first();

        // Cek Username dan Password

        if (!$user || !Hash::check($request->password, $user->password))
            return back()->withErrors([
                'Username atau Password Salah'
            ]);

        $request->session()->regenerate();

        $request->session()->put([
            'login' => true,
            'user_id' => $user->id,
            'username' => $user->username
        ]);

        // Remember Me via database

        if ($request->boolean('remember')) {
            $plainToken = Str::random(60);
            $user->forceFill([
                'remember_token' => hash('sha256', $plainToken),
            ])->save();

            $cookieValue = $user->id . '|' . $plainToken;

            Cookie::queue(
                'gis_remember',
                $cookieValue,
                60 * 24 * 30, // Maks 30 Hari
                null,
                null,
                false,
                true,
                false,
                'lax'
            );
        } else {
            if ($user->remember_token) {
                $user->forceFill(['remember_token' => null])->save();
            }
            Cookie::queue(Cookie::forget('gis_remember'));
        }

        return redirect('home');
    }

    // Logout

    public function Logout(Request $request)
    {
        // Clear remember_token for current user if exists
        if ($request->session()->has('user_id')) {
            $user = UserModel::find($request->session()->get('user_id'));
            if ($user && $user->remember_token) {
                $user->forceFill(['remember_token' => null])->save();
            }
        }

        // Also handle remember cookie directly (covers auto-login sessions)
        if ($request->cookie('gis_remember')) {
            $parts = explode('|', $request->cookie('gis_remember'), 2);
            if (count($parts) === 2) {
                $user = UserModel::find($parts[0]);
                if ($user && $user->remember_token === hash('sha256', $parts[1])) {
                    $user->forceFill(['remember_token' => null])->save();
                }
            }
        }

        Cookie::queue(Cookie::forget('gis_remember'));

        $request->session()->flush();

        $request->session()->regenerate();

        return redirect('login');
    }
}
