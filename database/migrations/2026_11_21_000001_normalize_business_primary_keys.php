
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (DB::getDriverName() !== 'mysql') {
            throw new RuntimeException('This migration requires MySQL.');
        }

        // 1. Validate region mapping.
        foreach (['tiang', 'ont'] as $table) {
            $unmatched = DB::table($table)
                ->leftJoin('wilayah', "$table.wilayah", '=', 'wilayah.nama_wilayah')
                ->whereNull('wilayah.kode_wilayah')
                ->distinct()
                ->pluck("$table.wilayah");

            if ($unmatched->isNotEmpty()) {
                throw new RuntimeException(
                    "Cannot normalize {$table}: unmatched wilayah: " .
                        $unmatched->implode(', ')
                );
            }
        }

        // 2. Populate kode_wilayah.
        foreach (['tiang', 'ont'] as $table) {
            DB::statement("
                UPDATE `{$table}` AS asset
                INNER JOIN `wilayah` AS region
                    ON asset.`wilayah` = region.`nama_wilayah`
                SET asset.`kode_wilayah` = region.`kode_wilayah`
                WHERE asset.`kode_wilayah` IS NULL
                   OR asset.`kode_wilayah` <> region.`kode_wilayah`
            ");
        }

        // 3. Ensure user IDs exist.
        if (!Schema::hasColumn('user', 'id_user')) {
            Schema::table('user', function ($table) {
                $table->string('id_user', 40)->nullable();
            });
        }

        DB::statement("
            UPDATE `user`
            SET `id_user` = CONCAT('USR-', UPPER(UUID()))
            WHERE `id_user` IS NULL OR `id_user` = ''
        ");

        $invalidUserIds = DB::table('user')
            ->whereNull('id_user')
            ->orWhere('id_user', '')
            ->exists();

        if ($invalidUserIds) {
            throw new RuntimeException(
                'Cannot normalize user: empty id_user values exist.'
            );
        }

        $duplicateUserIds = DB::table('user')
            ->select('id_user')
            ->groupBy('id_user')
            ->havingRaw('COUNT(*) > 1')
            ->exists();

        if ($duplicateUserIds) {
            throw new RuntimeException(
                'Cannot normalize user: duplicate id_user values exist.'
            );
        }

        // 4. Remove existing asset foreign keys.
        foreach (['tiang', 'ont'] as $table) {
            foreach ($this->foreignKeysForColumn($table, 'kode_wilayah') as $foreignKey) {
                DB::statement(
                    "ALTER TABLE `{$table}` DROP FOREIGN KEY `{$foreignKey}`"
                );
            }
        }

        // 5. wilayah primary key.
        $this->replacePrimaryKey('wilayah', 'kode_wilayah', 'id');

        // 6. tiang and ont primary keys.
        foreach (['tiang' => 'kode_tiang', 'ont' => 'kode_ont'] as $table => $businessKey) {
            $this->dropIndexIfExists(
                $table,
                "{$table}_{$businessKey}_unique"
            );

            DB::statement(
                "ALTER TABLE `{$table}` MODIFY `kode_wilayah` VARCHAR(255) NOT NULL"
            );

            $this->replacePrimaryKey($table, $businessKey, 'id');

            if (!$this->foreignKeyExists(
                $table,
                'kode_wilayah',
                'wilayah',
                'kode_wilayah'
            )) {
                DB::statement(
                    "ALTER TABLE `{$table}` ADD CONSTRAINT `{$table}_kode_wilayah_foreign` " .
                        "FOREIGN KEY (`kode_wilayah`) REFERENCES `wilayah` (`kode_wilayah`) " .
                        'ON DELETE RESTRICT ON UPDATE CASCADE'
                );
            }
        }

        // 7. user primary key.
        $this->dropIndexIfExists('user', 'user_id_user_unique');

        $this->replacePrimaryKey('user', 'id_user', 'id');

        DB::statement(
            "ALTER TABLE `user` MODIFY `id_user` VARCHAR(40) NOT NULL"
        );

        // 8. notifikasi foreign key.
        $danglingRequests = DB::table('notifikasi')
            ->leftJoin(
                'request_perubahan_akun',
                'notifikasi.reset_request_id',
                '=',
                'request_perubahan_akun.id'
            )
            ->whereNotNull('notifikasi.reset_request_id')
            ->whereNull('request_perubahan_akun.id')
            ->count();

        if ($danglingRequests > 0) {
            throw new RuntimeException(
                "Cannot add notifikasi foreign key: {$danglingRequests} invalid references."
            );
        }

        if (!$this->foreignKeyExists(
            'notifikasi',
            'reset_request_id',
            'request_perubahan_akun',
            'id'
        )) {
            DB::statement(
                'ALTER TABLE `notifikasi` ADD CONSTRAINT `notifikasi_reset_request_id_foreign` ' .
                    'FOREIGN KEY (`reset_request_id`) REFERENCES `request_perubahan_akun` (`id`) ' .
                    'ON DELETE SET NULL ON UPDATE CASCADE'
            );
        }
    }

    private function replacePrimaryKey(
        string $table,
        string $newKey,
        ?string $oldIdColumn = null
    ): void {
        $currentPrimaryKey = $this->primaryKeyColumn($table);

        $hasOldId = $oldIdColumn !== null
            && $oldIdColumn !== $newKey
            && Schema::hasColumn($table, $oldIdColumn);

        if ($currentPrimaryKey !== $newKey && $currentPrimaryKey !== null) {
            if ($hasOldId && $currentPrimaryKey === $oldIdColumn) {
                DB::statement(
                    "ALTER TABLE `{$table}` DROP PRIMARY KEY, DROP COLUMN `{$oldIdColumn}`"
                );

                $hasOldId = false;
            } else {
                DB::statement(
                    "ALTER TABLE `{$table}` DROP PRIMARY KEY"
                );
            }
        }

        if ($hasOldId) {
            DB::statement(
                "ALTER TABLE `{$table}` DROP COLUMN `{$oldIdColumn}`"
            );
        }

        if ($this->primaryKeyColumn($table) !== $newKey) {
            DB::statement(
                "ALTER TABLE `{$table}` ADD PRIMARY KEY (`{$newKey}`)"
            );
        }
    }

    private function primaryKeyColumn(string $table): ?string
    {
        $columns = DB::select(
            'SELECT COLUMN_NAME FROM information_schema.KEY_COLUMN_USAGE ' .
                'WHERE TABLE_SCHEMA = DATABASE() ' .
                'AND TABLE_NAME = ? AND CONSTRAINT_NAME = ? ' .
                'ORDER BY ORDINAL_POSITION',
            [$table, 'PRIMARY']
        );

        if (count($columns) !== 1) {
            return null;
        }

        return $columns[0]->COLUMN_NAME;
    }

    private function dropIndexIfExists(
        string $table,
        string $index
    ): void {
        $exists = DB::table('information_schema.statistics')
            ->where('TABLE_SCHEMA', DB::raw('DATABASE()'))
            ->where('TABLE_NAME', $table)
            ->where('INDEX_NAME', $index)
            ->exists();

        if ($exists) {
            DB::statement(
                "ALTER TABLE `{$table}` DROP INDEX `{$index}`"
            );
        }
    }

    private function foreignKeysForColumn(
        string $table,
        string $column
    ): array {
        return collect(DB::select(
            'SELECT DISTINCT CONSTRAINT_NAME ' .
                'FROM information_schema.KEY_COLUMN_USAGE ' .
                'WHERE TABLE_SCHEMA = DATABASE() ' .
                'AND TABLE_NAME = ? AND COLUMN_NAME = ? ' .
                'AND REFERENCED_TABLE_NAME IS NOT NULL',
            [$table, $column]
        ))->pluck('CONSTRAINT_NAME')->all();
    }

    private function foreignKeyExists(
        string $table,
        string $column,
        string $referencedTable,
        string $referencedColumn
    ): bool {
        return DB::table('information_schema.KEY_COLUMN_USAGE')
            ->where('TABLE_SCHEMA', DB::raw('DATABASE()'))
            ->where('TABLE_NAME', $table)
            ->where('COLUMN_NAME', $column)
            ->where('REFERENCED_TABLE_NAME', $referencedTable)
            ->where('REFERENCED_COLUMN_NAME', $referencedColumn)
            ->exists();
    }

    public function down(): void
    {
        throw new RuntimeException(
            'This migration is intentionally irreversible. Restore a database backup to revert primary-key changes.'
        );
    }
};
