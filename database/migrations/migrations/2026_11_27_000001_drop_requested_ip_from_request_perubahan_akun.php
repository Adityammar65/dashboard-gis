<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('request_perubahan_akun', function (Blueprint $table) {
            $table->dropColumn('requested_ip');
        });
    }

    public function down(): void
    {
        Schema::table('request_perubahan_akun', function (Blueprint $table) {
            $table->string('requested_ip', 45)->nullable();
        });
    }
};