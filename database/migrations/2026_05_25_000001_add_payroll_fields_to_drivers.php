<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('drivers', function (Blueprint $table) {
            $table->string('ic_number', 20)->nullable()->after('phone');
            $table->string('kwsp_no', 20)->nullable()->after('ic_number');
            $table->string('socso_no', 20)->nullable()->after('kwsp_no');
            $table->string('bank_name', 50)->nullable()->after('socso_no');
            $table->string('bank_account_no', 30)->nullable()->after('bank_name');
            $table->decimal('base_salary', 10, 2)->default(0)->after('bank_account_no');
        });
    }

    public function down(): void
    {
        Schema::table('drivers', function (Blueprint $table) {
            $table->dropColumn(['ic_number', 'kwsp_no', 'socso_no', 'bank_name', 'bank_account_no', 'base_salary']);
        });
    }
};
