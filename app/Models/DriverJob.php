<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DriverJob extends Model
{
    protected $fillable = [
        'driver_id',
        'job_type',
        'job_date',
        'pickup_location',
        'pickup_lat',
        'pickup_lng',
        'delivery_location',
        'delivery_lat',
        'delivery_lng',
        'distance_km',
        'duration_min',
        'route_polyline',
        'customer_name',
        'gross_amount',
        'commission_rate',
        'commission_amount',
        'proof_image',
        'notes',
        'status',
        'rejection_reason',
        'verified_by',
        'verified_at',
        'driver_commission_id',
    ];

    protected $casts = [
        'job_date'          => 'date',
        'gross_amount'      => 'decimal:2',
        'commission_rate'   => 'decimal:2',
        'commission_amount' => 'decimal:2',
        'pickup_lat'        => 'decimal:7',
        'pickup_lng'        => 'decimal:7',
        'delivery_lat'      => 'decimal:7',
        'delivery_lng'      => 'decimal:7',
        'distance_km'       => 'decimal:2',
        'duration_min'      => 'integer',
        'verified_at'       => 'datetime',
    ];

    public function driver()    { return $this->belongsTo(Driver::class); }
    public function verifiedBy(){ return $this->belongsTo(User::class, 'verified_by'); }
    public function commission() { return $this->belongsTo(DriverCommission::class, 'driver_commission_id'); }

    public function getJobTypeLabelAttribute(): string
    {
        return $this->job_type === 'lalamove' ? 'Lalamove' : 'Job Tepi';
    }
}
