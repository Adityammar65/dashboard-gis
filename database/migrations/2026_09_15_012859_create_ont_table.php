<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('ont', function (Blueprint $table) {
            $table->id();
            $table->string('kode_ont')->unique();
            $table->string('area');
            $table->text('deskripsi_ont');
            $table->string('foto_ont_1');
            $table->string('foto_ont_2');
            $table->string('foto_ont_3');
            $table->string('latitude');
            $table->string('longitude');
            $table->string('nama_petugas');
            $table->enum(
                'status',
                [
                    'aktif',
                    'nonaktif'
                ]
            )->default('aktif');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ont');
    }
};
