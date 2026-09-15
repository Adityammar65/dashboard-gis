<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\WilayahModel;

class WilayahSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $wilayah = [
            [
                'nama_wilayah' => 'yogyakarta',
                'kode_wilayah' => 'YOG'
            ],
            [
                'nama_wilayah' => 'sleman',
                'kode_wilayah' => 'SLM'
            ],
            [
                'nama_wilayah' => 'bantul',
                'kode_wilayah' => 'BNT'
            ],
            [
                'nama_wilayah' => 'kulon progo',
                'kode_wilayah' => 'KPR'
            ],
            [
                'nama_wilayah' => 'gunungkidul',
                'kode_wilayah' => 'GNK'
            ],
            [
                'nama_wilayah' => 'jepara',
                'kode_wilayah' => 'JPR'
            ],
            [
                'nama_wilayah' => 'sukoharjo',
                'kode_wilayah' => 'SHJ'
            ],
            [
                'nama_wilayah' => 'magelang',
                'kode_wilayah' => 'MGL'
            ]
        ];

        foreach ($wilayah as $item) {
            WilayahModel::create($item);
        }
    }
}
