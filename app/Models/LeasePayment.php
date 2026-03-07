<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LeasePayment extends Model
{
    protected $fillable = [
        'vehicle_lease_id',
        'amount',
        'payment_date',
        'payment_method',
        'reference_number',
        'status',
    ];

    protected $casts = [
        'payment_date' => 'date',
        'amount' => 'decimal:2',
    ];

    public function lease()
    {
        return $this->belongsTo(VehicleLease::class, 'vehicle_lease_id');
    }
}
