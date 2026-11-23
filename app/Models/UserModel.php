<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class UserModel extends Model
{
    protected $table = 'user';
    protected $primaryKey = 'id_user';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id_user',
        'username',
        'password',
        'remember_token',
    ];

    protected $hidden = [
        'password',
        'remember_token'
    ];

    protected static function booted(): void
    {
        static::creating(function ($model) {
            $model->id_user ??= 'USR-' . strtoupper(Str::uuid());
        });
    }

    protected $casts = [
        'password' => 'hashed',
    ];
}
