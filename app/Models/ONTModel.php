<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ONTModel extends Model
{
    protected $table = 'ont';

    protected $fillable = [
        'kode_ont',
        'wilayah',
        'kecamatan',
        'kelurahan',
        'deskripsi_ont',
        'foto_ont_1',
        'foto_ont_2',
        'foto_ont_3',
        'foto_ont_4',
        'foto_ont_5',
        'latitude',
        'longitude',
        'nama_petugas',
        'status',
    ];
}
