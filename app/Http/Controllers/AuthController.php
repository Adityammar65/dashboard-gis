<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserModel;
use Illuminate\Support\Facades\Hash;

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

        return redirect('home');
    }

    // Logout

    public function Logout(Request $request)
    {
        $request->session()->flush();

        $request->session()->regenerate();

        return redirect('login');
    }
}
