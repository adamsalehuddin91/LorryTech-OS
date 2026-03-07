<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MaintenanceRecord extends Model
{
    protected $fillable = [
        'vehicle_id',
        'service_type',
        'description',
        'cost',
        'mileage_at_service',
        'service_date',
        'next_service_mileage',
        'next_service_date',
        'vendor_name',
        'receipt_image_url',
    ];

    protected $casts = [
        'service_date' => 'date',
        'next_service_date' => 'date',
        'cost' => 'decimal:2',
    ];

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }
}
