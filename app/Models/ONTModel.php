<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ONTModel extends Model
{
    protected $table = 'ont';

    protected $fillable = [
        'kode_ont',
        'nomor_ont',
        'area',
        'deskripsi_ont',
        'foto_tiang_1', 
        'foto_tiang_2', 
        'foto_tiang_3',
        'latitude',
        'logitude',
        'nama_petugas',
        'status',
    ];
}
