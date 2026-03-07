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
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->string('plate_number')->unique();
            $table->string('make_model');
            $table->integer('year')->nullable();
            $table->decimal('capacity_kg', 10, 2)->nullable();
            $table->enum('status', ['active', 'maintenance', 'inactive'])->default('active');
            $table->date('roadtax_expiry')->nullable();
            $table->date('insurance_expiry')->nullable();
            $table->date('permit_apad_expiry')->nullable();
            $table->integer('current_mileage')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicles');
    }
};
