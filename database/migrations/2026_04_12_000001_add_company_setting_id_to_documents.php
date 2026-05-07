<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            $table->foreignId('company_setting_id')
                ->nullable()
                ->after('id')
                ->constrained('company_settings')
                ->nullOnDelete();
        });

        Schema::table('quotations', function (Blueprint $table) {
            $table->foreignId('company_setting_id')
                ->nullable()
                ->after('id')
                ->constrained('company_settings')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            $table->dropForeignIdFor(\App\Models\CompanySetting::class);
            $table->dropColumn('company_setting_id');
        });

        Schema::table('quotations', function (Blueprint $table) {
            $table->dropForeignIdFor(\App\Models\CompanySetting::class);
            $table->dropColumn('company_setting_id');
        });
    }
};
