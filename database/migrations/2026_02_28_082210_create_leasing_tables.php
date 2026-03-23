<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vehicle_leases', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicle_id')->constrained()->onDelete('cascade');
            $table->string('lessor_name');
            $table->decimal('monthly_payment', 12, 2);
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->integer('payment_day')->default(1);
            $table->decimal('deposit_amount', 12, 2)->default(0);
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('lease_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicle_lease_id')->constrained('vehicle_leases')->onDelete('cascade');
            $table->decimal('amount', 12, 2);
            $table->date('payment_date');
            $table->enum('payment_method', ['cash', 'bank_transfer', 'cheque'])->nullable();
            $table->string('reference_number')->nullable();
            $table->enum('status', ['pending', 'paid', 'overdue'])->default('pending');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lease_payments');
        Schema::dropIfExists('vehicle_leases');
    }
};
