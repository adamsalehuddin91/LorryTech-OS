<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payroll extends Model
{
    protected $fillable = [
        'driver_id',
        'generated_by',
        'month',
        'base_salary',
        'commission_amount',
        'days_worked',
        'daily_rate',
        'daily_wage_total',
        'long_distance_days',
        'long_distance_allowance',
        'big_job_count',
        'big_job_bonus',
        'days_overridden',
        'uses_daily_model',
        'gross_salary',
        'kwsp_employee',
        'kwsp_employer',
        'socso_employee',
        'socso_employer',
        'eis_employee',
        'eis_employer',
        'total_deductions',
        'net_salary',
        'status',
        'paid_date',
        'notes',
    ];

    protected $casts = [
        'base_salary'             => 'decimal:2',
        'commission_amount'       => 'decimal:2',
        'daily_rate'              => 'decimal:2',
        'daily_wage_total'        => 'decimal:2',
        'long_distance_allowance' => 'decimal:2',
        'big_job_bonus'           => 'decimal:2',
        'days_overridden'         => 'boolean',
        'uses_daily_model'        => 'boolean',
        'gross_salary'      => 'decimal:2',
        'kwsp_employee'     => 'decimal:2',
        'kwsp_employer'     => 'decimal:2',
        'socso_employee'    => 'decimal:2',
        'socso_employer'    => 'decimal:2',
        'eis_employee'      => 'decimal:2',
        'eis_employer'      => 'decimal:2',
        'total_deductions'  => 'decimal:2',
        'net_salary'        => 'decimal:2',
        'paid_date'         => 'date',
    ];

    public function driver()
    {
        return $this->belongsTo(Driver::class);
    }

    public function generatedBy()
    {
        return $this->belongsTo(User::class, 'generated_by');
    }

    public function getMonthLabelAttribute(): string
    {
        return \Carbon\Carbon::createFromFormat('Y-m', $this->month)->translatedFormat('F Y');
    }
}
