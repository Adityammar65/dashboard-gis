<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\PageController;

Route::get('/Home', [PageController::class, 'Index']);
Route::get('/DataTiang', [PageController::class, 'DataTiang']);
Route::get('/peta', function () {
    return Inertia::render('Peta');
});