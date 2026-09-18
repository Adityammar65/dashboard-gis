<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\FormController;
use App\Http\Controllers\ONTController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\TiangController;

// Auth

Route::get('/login', [PageController::class, 'Login']);
Route::post('/proses-login', [AuthController::class, 'ProsesLogin']);
Route::get('/logout', [AuthController::class, 'Logout']);

// Protected Routes

Route::middleware('cek_login')->group(function () {

    // Navigasi

    Route::get('/home', [PageController::class, 'Index']);
    Route::get('/data-tiang', [PageController::class, 'DataTiang']);
    Route::get('/data-ont', [PageController::class, 'DataONT']);
    Route::get('/Peta', [PageController::class, 'Peta']);
    Route::get('/wilayah', [PageController::class, 'Wilayah']);
    Route::get('/peta-sebaran-aset', [PageController::class, 'PetaSebaranAset']);
    Route::get('/detail-tiang/{id}', [PageController::class, 'DetailTiang']);
    Route::get('/detail-ont/{id}', [PageController::class, 'DetailONT']);
    Route::get('/notifikasi', [PageController::class, 'Notifikasi']);
    Route::get('/detail-notifikasi/{id}', [PageController::class, 'DetailNotifikasi']);
    Route::post('/notifikasi/baca-semua', [PageController::class, 'TandaiSemuaDibaca']);
    Route::delete('/notifikasi/hapus-dibaca', [PageController::class, 'HapusSudahDibaca']);
    Route::get('/pengaturan', [PageController::class, 'Pengaturan']);

    // Form

    Route::get('/tambah-tiang', [FormController::class, 'TambahTiang']);
    Route::get('/tambah-ont', [FormController::class, 'TambahONT']);
    Route::get('/edit-tiang/{id}', [FormController::class, 'EditTiang']);
    Route::get('/edit-ont/{id}', [FormController::class, 'EditONT']);

    // Settings

    Route::post('/update-pengaturan', [SettingsController::class, 'updateWilayah']);

    // CRUD Tiang

    Route::post('/simpan-tiang', [TiangController::class, 'SimpanTiang']);
    Route::post('/update-tiang/{id}', [TiangController::class, 'UpdateTiang']);
    Route::get('/hapus-tiang/{id}', [TiangController::class, 'HapusTiang']);

    // CRUD ONT

    Route::post('/simpan-ont', [ONTController::class, 'SimpanONT']);
    Route::post('/update-ont/{id}', [ONTController::class, 'UpdateONT']);
    Route::get('/hapus-ont/{id}', [ONTController::class, 'HapusONT']);
});
