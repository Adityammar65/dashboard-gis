<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class PageController extends Controller
{
    public function Index()
    {
        return Inertia::render('Dashboard');
    }

    public function DataTiang()
    {
        return Inertia::render('DataTiang');
    }
}
