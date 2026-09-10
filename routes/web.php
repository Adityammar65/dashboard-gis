<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\PageController;

Route::get('/Dashboard', [PageController::class, 'Index']);
Route::get('/DataTiang', [PageController::class, 'DataTiang']);
