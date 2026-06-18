<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Saved encoded route polyline (computed once at log time) — reused on admin map
// to draw the real road route without extra Directions API calls.
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('driver_jobs', function (Blueprint $table) {
            $table->text('route_polyline')->nullable()->after('duration_min');
        });
    }

    public function down(): void
    {
        Schema::table('driver_jobs', function (Blueprint $table) {
            $table->dropColumn('route_polyline');
        });
    }
};
