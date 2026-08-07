<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Pecahan gaji harian pada slip.
     *
     * `base_salary` + `commission_amount` DIKEKALKAN — slip gaji yang dijana
     * sebelum 2026-08-07 guna model lama dan mesti kekal boleh dibaca.
     * Slip baru tinggalkan dua field itu 0 dan isi pecahan di bawah.
     */
    public function up(): void
    {
        // Setiap column dijaga `hasColumn` supaya selamat dijalankan semula
        // kalau migration gagal separuh jalan (lihat AP-026).
        Schema::table('payrolls', function (Blueprint $table) {
            if (! Schema::hasColumn('payrolls', 'days_worked')) {
                $table->unsignedSmallInteger('days_worked')->default(0)->after('base_salary');
            }
            if (! Schema::hasColumn('payrolls', 'daily_rate')) {
                $table->decimal('daily_rate', 10, 2)->default(0)->after('days_worked');
            }
            if (! Schema::hasColumn('payrolls', 'daily_wage_total')) {
                $table->decimal('daily_wage_total', 10, 2)->default(0)->after('daily_rate');
            }
            if (! Schema::hasColumn('payrolls', 'long_distance_days')) {
                $table->unsignedSmallInteger('long_distance_days')->default(0)->after('daily_wage_total');
            }
            if (! Schema::hasColumn('payrolls', 'long_distance_allowance')) {
                $table->decimal('long_distance_allowance', 10, 2)->default(0)->after('long_distance_days');
            }
            if (! Schema::hasColumn('payrolls', 'big_job_count')) {
                $table->unsignedSmallInteger('big_job_count')->default(0)->after('long_distance_allowance');
            }
            if (! Schema::hasColumn('payrolls', 'big_job_bonus')) {
                $table->decimal('big_job_bonus', 10, 2)->default(0)->after('big_job_count');
            }
            // Betul/tidak admin ubah bilangan hari daripada kiraan auto — untuk audit.
            if (! Schema::hasColumn('payrolls', 'days_overridden')) {
                $table->boolean('days_overridden')->default(false)->after('big_job_bonus');
            }
        });
    }

    public function down(): void
    {
        Schema::table('payrolls', function (Blueprint $table) {
            $table->dropColumn([
                'days_worked',
                'daily_rate',
                'daily_wage_total',
                'long_distance_days',
                'long_distance_allowance',
                'big_job_count',
                'big_job_bonus',
                'days_overridden',
            ]);
        });
    }
};
