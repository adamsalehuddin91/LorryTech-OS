<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    protected $fillable = [
        'plate_number',
        'make_model',
        'year',
        'capacity_kg',
        'status',
        'roadtax_expiry',
        'insurance_expiry',
        'permit_apad_expiry',
        'current_mileage',
        'notes',
    ];

    protected $casts = [
        'roadtax_expiry' => 'date',
        'insurance_expiry' => 'date',
        'permit_apad_expiry' => 'date',
    ];

    public function trips()
    {
        return $this->hasMany(Trip::class);
    }

    public function expenses()
    {
        return $this->hasMany(Expense::class);
    }

    public function maintenanceRecords()
    {
        return $this->hasMany(MaintenanceRecord::class);
    }

    public function assignments()
    {
        return $this->hasMany(VehicleAssignment::class);
    }

    public function lease()
    {
        return $this->hasOne(VehicleLease::class);
    }
}
