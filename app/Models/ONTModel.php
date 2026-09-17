<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ONTModel extends Model
{
    protected $table = 'ont';

    protected $fillable = [
        'kode_ont',
        'area',
        'wilayah',
        'deskripsi_ont',
        'foto_ont_1',
        'foto_ont_2',
        'foto_ont_3',
        'latitude',
        'longitude',
        'nama_petugas',
        'status',
    ];
}
