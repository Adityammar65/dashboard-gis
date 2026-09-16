<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TiangModel;


class TiangController extends Controller
{
    public function HapusTiang($id)
    {
        $tiang = TiangModel::findOrFail($id);

        $tiang->delete();

        return redirect('data-tiang')
            ->with('success', 'Data tiang berhasil dihapus.');
    }
}
