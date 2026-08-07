<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Penanda eksplisit model gaji yang digunakan oleh setiap slip.
     *
     * Sebelum ini paparan slip meneka model daripada `days_worked > 0`. Tekaan
     * itu pecah untuk kes sah: pemandu bergaji pokok sahaja yang tiada hari
     * kerja direkod dalam sebulan akan dipapar sebagai slip model lama.
     *
     * Slip yang wujud sebelum migration ini semuanya model lama (gaji bulanan
     * tetap + komisyen), jadi default `false` sudah betul untuk semuanya.
     */
    public function up(): void
    {
        Schema::table('payrolls', function (Blueprint $table) {
            if (! Schema::hasColumn('payrolls', 'uses_daily_model')) {
                $table->boolean('uses_daily_model')->default(false)->after('days_overridden');
            }
        });
    }

    public function down(): void
    {
        Schema::table('payrolls', function (Blueprint $table) {
            $table->dropColumn('uses_daily_model');
        });
    }
};
