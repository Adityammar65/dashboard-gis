<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PasswordResetRequest extends Model
{
    protected $table = 'password_reset_requests';

    protected $fillable = [
        'username',
        'password_hash',
        'status',
        'requested_ip',
        'handled_by',
        'handled_at',
    ];

    protected $casts = [
        'handled_at' => 'datetime',
    ];

    public function isPending(): bool
    {
        return $this->status === 'pending';
    }
}
