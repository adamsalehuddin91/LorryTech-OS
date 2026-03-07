<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompanySetting extends Model
{
    protected $fillable = [
        'name',
        'reg_no',
        'tin',
        'address',
        'phone',
        'email',
        'logo_url',
        'bank_details',
    ];

    protected $casts = [
        'bank_details' => 'array',
    ];
}
