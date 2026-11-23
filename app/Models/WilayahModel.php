<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class WilayahModel extends Model
{
    protected $table = 'wilayah';
    protected $primaryKey = 'kode_wilayah';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'nama_wilayah',
        'kode_wilayah'
    ];

    protected static function booted()
    {
        $clearCache = function ($model) {
            Cache::forget('wilayah:list');
            if ($model->kode_wilayah) {
                Cache::forget('wilayah:' . $model->kode_wilayah);
            }
            if ($model->nama_wilayah) {
                Cache::forget('wilayah:name:' . strtolower($model->nama_wilayah));
            }
            // clear old name on update
            if ($model->isDirty('nama_wilayah') && $model->getOriginal('nama_wilayah')) {
                Cache::forget('wilayah:name:' . strtolower($model->getOriginal('nama_wilayah')));
            }
        };

        static::saved($clearCache);
        static::deleted($clearCache);
    }
}
