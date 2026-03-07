<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VehicleLease extends Model
{
    protected $fillable = [
        'vehicle_id',
        'lessor_name',
        'monthly_payment',
        'start_date',
        'end_date',
        'payment_day',
        'deposit_amount',
        'notes',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'monthly_payment' => 'decimal:2',
        'deposit_amount' => 'decimal:2',
    ];

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function payments()
    {
        return $this->hasMany(LeasePayment::class);
    }
}
