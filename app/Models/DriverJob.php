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
        'delivery_location',
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
