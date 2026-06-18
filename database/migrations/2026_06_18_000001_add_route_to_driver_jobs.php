<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Route mapping for driver jobs — pickup/delivery coords + auto-calculated distance.
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('driver_jobs', function (Blueprint $table) {
            $table->decimal('pickup_lat', 10, 7)->nullable()->after('pickup_location');
            $table->decimal('pickup_lng', 10, 7)->nullable()->after('pickup_lat');
            $table->decimal('delivery_lat', 10, 7)->nullable()->after('delivery_location');
            $table->decimal('delivery_lng', 10, 7)->nullable()->after('delivery_lat');
            $table->decimal('distance_km', 8, 2)->nullable()->after('delivery_lng');
            $table->integer('duration_min')->nullable()->after('distance_km');
        });
    }

    public function down(): void
    {
        Schema::table('driver_jobs', function (Blueprint $table) {
            $table->dropColumn(['pickup_lat', 'pickup_lng', 'delivery_lat', 'delivery_lng', 'distance_km', 'duration_min']);
        });
    }
};
