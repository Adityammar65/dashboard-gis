<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PageController;
use App\Http\Controllers\FormController;
use App\Http\Controllers\TiangController;
use App\Http\Controllers\SettingsController;

Route::middleware('cek_login')->group(function () {

    // Navigasi

    Route::get('/home', [PageController::class, 'Index']);
    Route::get('/data-tiang', [PageController::class, 'DataTiang']);
    Route::get('/data-ont', [PageController::class, 'DataONT']);
    Route::get('/Peta', [PageController::class, 'Peta']);
    Route::get('/wilayah', [PageController::class, 'Wilayah']);
    Route::get('/peta-sebaran-aset', [PageController::class, 'PetaSebaranAset']);
    Route::get('/detail-tiang/{id}', [PageController::class, 'DetailTiang']);
    Route::get('/detail-ont', [PageController::class, 'DetailONT']);
    Route::get('/notifikasi', [PageController::class, 'Notifikasi']);
    Route::get('/pengaturan', [PageController::class, 'Pengaturan']);

    // CRUD

    Route::get('/tambah-tiang', [FormController::class, 'TambahTiang']);
    Route::get('/tambah-ont', [FormController::class, 'TambahONT']);
    Route::get('/edit-tiang/{id}', [FormController::class, 'EditTiang']);
    Route::get('/edit-ont', [FormController::class, 'EditONT']);
    Route::post('/update-pengaturan', [SettingsController::class, 'updateWilayah']);
    Route::post('/simpan-tiang', [TiangController::class, 'SimpanTiang']);
    Route::post('/update-tiang/{id}', [TiangController::class, 'UpdateTiang']);
    Route::get('/hapus-tiang/{id}', [TiangController::class, 'HapusTiang']);
});

// Auth

Route::get('/login', [PageController::class, 'Login']);
Route::post('/proses-login', [AuthController::class, 'ProsesLogin']);
Route::get('/logout', [AuthController::class, 'Logout']);
