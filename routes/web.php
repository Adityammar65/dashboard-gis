<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PageController;
use App\Http\Controllers\FormController;

// Navigasi

Route::get('/home', [PageController::class, 'Index']);
Route::get('/data-tiang', [PageController::class, 'DataTiang']);
Route::get('/data-ont', [PageController::class, 'DataONT']);
Route::get('/Peta', [PageController::class, 'Peta']);
Route::get('/wilayah', [PageController::class, 'Wilayah']);
Route::get('/peta-sebaran-aset', [PageController::class, 'PetaSebaranAset']);
Route::get('/detail-tiang', [PageController::class, 'DetailTiang']);
Route::get('/detail-ont', [PageController::class, 'DetailONT']);
Route::get('/notifikasi', [PageController::class, 'Notifikasi']);
Route::get('/tambah-tiang', [FormController::class, 'TambahTiang']);
Route::get('/tambah-ont', [FormController::class, 'TambahONT']);
Route::get('/edit-tiang', [FormController::class, 'EditTiang']);

// Auth

Route::get('/login', [PageController::class, 'Login']);
