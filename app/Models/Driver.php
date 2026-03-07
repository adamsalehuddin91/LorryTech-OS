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
    ];

    protected $casts = [
        'license_expiry' => 'date',
        'commission_rate' => 'decimal:2',
    ];

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
}
