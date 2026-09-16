<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TiangModel extends Model
{
    protected $table = 'tiang';

    protected $fillable = [
        'kode_tiang',
        'area',
        'wilayah',
        'deskripsi_tiang',
        'foto_tiang_1',
        'foto_tiang_2',
        'foto_tiang_3',
        'latitude',
        'longitude',
        'nama_petugas',
        'status',
    ];
}
