<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Trip extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'trip_number',
        'vehicle_id',
        'driver_id',
        'customer_id',
        'source',
        'pickup_location',
        'pickup_lat',
        'pickup_lng',
        'delivery_location',
        'delivery_lat',
        'delivery_lng',
        'distance_km',
        'route_polyline',
        'pickup_date',
        'delivery_date',
        'cargo_description',
        'weight_kg',
        'base_charge',
        'additional_charges',
        'toll_amount',
        'total_revenue',
        'payment_status',
        'notes',
    ];

    protected $casts = [
        'pickup_date' => 'date',
        'delivery_date' => 'date',
        'pickup_lat' => 'decimal:7',
        'pickup_lng' => 'decimal:7',
        'delivery_lat' => 'decimal:7',
        'delivery_lng' => 'decimal:7',
        'distance_km' => 'decimal:2',
        'base_charge' => 'decimal:2',
        'additional_charges' => 'decimal:2',
        'toll_amount' => 'decimal:2',
        'total_revenue' => 'decimal:2',
    ];

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function driver()
    {
        return $this->belongsTo(Driver::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function invoice()
    {
        return $this->hasOne(Invoice::class);
    }

    public function commission()
    {
        return $this->hasOne(DriverCommission::class);
    }
}
