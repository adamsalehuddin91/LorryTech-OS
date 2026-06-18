<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Driver-job commissions have no trip → trip_id must be nullable.
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('driver_commissions', function (Blueprint $table) {
            $table->unsignedBigInteger('trip_id')->nullable()->change();
        });
    }

    public function down(): void
    {
        // Leave nullable (driver-job commissions rely on it).
    }
};
