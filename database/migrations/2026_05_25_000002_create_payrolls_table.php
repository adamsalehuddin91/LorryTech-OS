<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payrolls', function (Blueprint $table) {
            $table->id();
            $table->foreignId('driver_id')->constrained()->onDelete('cascade');
            $table->foreignId('generated_by')->constrained('users');
            $table->string('month', 7); // YYYY-MM
            $table->decimal('base_salary', 10, 2)->default(0);
            $table->decimal('commission_amount', 10, 2)->default(0);
            $table->decimal('gross_salary', 10, 2)->default(0); // base + commission
            $table->decimal('kwsp_employee', 10, 2)->default(0);
            $table->decimal('kwsp_employer', 10, 2)->default(0);
            $table->decimal('socso_employee', 10, 2)->default(0);
            $table->decimal('socso_employer', 10, 2)->default(0);
            $table->decimal('eis_employee', 10, 2)->default(0);
            $table->decimal('eis_employer', 10, 2)->default(0);
            $table->decimal('total_deductions', 10, 2)->default(0); // employee deductions only
            $table->decimal('net_salary', 10, 2)->default(0); // base_salary - total_deductions
            $table->enum('status', ['draft', 'approved', 'paid'])->default('draft');
            $table->date('paid_date')->nullable();
            $table->text('notes')->nullable();
            $table->unique(['driver_id', 'month']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payrolls');
    }
};
