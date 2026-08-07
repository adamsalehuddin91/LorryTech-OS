<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Tukar model gaji: bulanan tetap → kadar harian.
     *
     * `base_salary`, `commission_rate` dan `lalamove_commission_rate` SENGAJA
     * TIDAK dibuang — slip gaji lama merujuk padanya, dan kekalkan ia bermakna
     * migration ini boleh di-rollback tanpa kehilangan data sejarah.
     *
     * Setiap langkah dijaga `hasColumn` supaya migration boleh dijalankan semula
     * dengan selamat kalau ia gagal separuh jalan (lihat AP-026).
     */
    public function up(): void
    {
        Schema::table('drivers', function (Blueprint $table) {
            if (! Schema::hasColumn('drivers', 'daily_rate')) {
                $table->decimal('daily_rate', 10, 2)->default(150.00)->after('base_salary');
            }
            if (! Schema::hasColumn('drivers', 'socso_enabled')) {
                $table->boolean('socso_enabled')->default(true)->after('socso_no');
            }
        });

        // Pemandu sedia ada yang ada gaji bulanan: anggar kadar harian daripadanya
        // (26 hari kerja sebulan, dibundarkan ke RM5) supaya tak terjun ke default
        // RM150 secara senyap. Admin boleh betulkan dalam borang pemandu.
        //
        // Dikira dalam PHP, bukan SQL — GREATEST() wujud dalam PostgreSQL (prod)
        // tetapi TIDAK dalam SQLite (local dev).
        DB::table('drivers')
            ->where('base_salary', '>', 0)
            ->select('id', 'base_salary')
            ->orderBy('id')
            ->chunk(200, function ($drivers) {
                foreach ($drivers as $driver) {
                    $rate = max(round(((float) $driver->base_salary / 26) / 5) * 5, 1);

                    DB::table('drivers')->where('id', $driver->id)->update(['daily_rate' => $rate]);
                }
            });
    }

    public function down(): void
    {
        Schema::table('drivers', function (Blueprint $table) {
            $table->dropColumn(['daily_rate', 'socso_enabled']);
        });
    }
};
