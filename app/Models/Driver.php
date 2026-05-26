<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Driver extends Model
{
    protected $fillable = [
        'user_id',
        'license_number',
        'license_expiry',
        'commission_rate',
        'phone',
        'emergency_contact',
        'status',
        'ic_number',
        'kwsp_no',
        'socso_no',
        'bank_name',
        'bank_account_no',
        'base_salary',
        'lalamove_commission_rate',
        'photo',
    ];

    protected $casts = [
        'license_expiry'           => 'date',
        'commission_rate'          => 'decimal:2',
        'lalamove_commission_rate' => 'decimal:2',
        'base_salary'              => 'decimal:2',
    ];

    public function payrolls()
    {
        return $this->hasMany(\App\Models\Payroll::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function trips()
    {
        return $this->hasMany(Trip::class);
    }

    public function commissions()
    {
        return $this->hasMany(DriverCommission::class);
    }

    public function assignments()
    {
        return $this->hasMany(VehicleAssignment::class);
    }

    public function expenses()
    {
        return $this->hasMany(Expense::class);
    }

    public function jobs()
    {
        return $this->hasMany(DriverJob::class);
    }
}
