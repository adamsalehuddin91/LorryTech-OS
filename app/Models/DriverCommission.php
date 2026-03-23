<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DriverCommission extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'driver_id',
        'trip_id',
        'commission_rate',
        'trip_revenue',
        'commission_amount',
        'month',
        'status',
        'paid_date',
    ];

    protected $casts = [
        'commission_rate' => 'decimal:2',
        'trip_revenue' => 'decimal:2',
        'commission_amount' => 'decimal:2',
        'paid_date' => 'date',
    ];

    public function driver()
    {
        return $this->belongsTo(Driver::class);
    }

    public function trip()
    {
        return $this->belongsTo(Trip::class);
    }
}
