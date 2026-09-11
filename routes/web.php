<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PageController;

// Navigasi

Route::get('/Home', [PageController::class, 'Index']);
Route::get('/DataTiang', [PageController::class, 'DataTiang']);
Route::get('/DataONT', [PageController::class, 'DataONT']);
Route::get('/Peta', [PageController::class, 'Peta']);
Route::get('/Wilayah', [PageController::class, 'Wilayah']);
Route::get('/PetaSebaranAset', [PageController::class, 'PetaSebaranAset']);
