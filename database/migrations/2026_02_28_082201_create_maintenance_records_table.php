<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('maintenance_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicle_id')->constrained()->onDelete('cascade');
            $table->enum('service_type', ['scheduled', 'repair', 'tyre', 'inspection']);
            $table->string('description')->nullable();
            $table->decimal('cost', 12, 2)->default(0);
            $table->integer('mileage_at_service')->nullable();
            $table->date('service_date');
            $table->integer('next_service_mileage')->nullable();
            $table->date('next_service_date')->nullable();
            $table->string('vendor_name')->nullable();
            $table->string('receipt_image_url')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('maintenance_records');
    }
};
