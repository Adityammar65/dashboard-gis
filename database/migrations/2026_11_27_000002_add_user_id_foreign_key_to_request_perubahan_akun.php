<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('request_perubahan_akun')
            ->join('user', 'request_perubahan_akun.requested_by', '=', 'user.username')
            ->update(['request_perubahan_akun.requested_by' => DB::raw('user.id_user')]);

        $unmatchedRequests = DB::table('request_perubahan_akun')
            ->leftJoin('user', 'request_perubahan_akun.requested_by', '=', 'user.id_user')
            ->whereNull('user.id_user')
            ->exists();

        if ($unmatchedRequests) {
            throw new RuntimeException(
                'Cannot add user foreign key: request records have no matching user.'
            );
        }

        Schema::table('request_perubahan_akun', function (Blueprint $table) {
            $table->foreign('requested_by')
                ->references('id_user')
                ->on('user')
                ->cascadeOnDelete()
                ->cascadeOnUpdate();
        });
    }

    public function down(): void
    {
        Schema::table('request_perubahan_akun', function (Blueprint $table) {
            $table->dropForeign(['requested_by']);
        });
    }
};
