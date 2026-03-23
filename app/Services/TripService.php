<?php

namespace App\Services;

use App\Models\Trip;
use App\Models\DriverCommission;
use App\Models\Driver;
use Illuminate\Support\Facades\DB;

class TripService
{
    public function generateTripNumber(): string
    {
        $prefix = config('company.doc_prefix', 'LT');
        $yy = now()->format('y');
        $mm = now()->format('m');
        $docPrefix = "{$prefix}{$yy}{$mm}/";

        $last = Trip::where('trip_number', 'like', "{$docPrefix}%")
            ->orderByDesc('id')
            ->first();

        if ($last) {
            $lastNumber = (int) str_replace($docPrefix, '', $last->trip_number);
            $newNumber = str_pad($lastNumber + 1, 3, '0', STR_PAD_LEFT);
        } else {
            $newNumber = '001';
        }

        return $docPrefix . $newNumber;
    }

    public function createTrip(array $data): Trip
    {
        return DB::transaction(function () use ($data) {
            $tripNumber = $this->generateTripNumber();

            $baseCharge = $data['base_charge'] ?? 0;
            $additionalCharges = $data['additional_charges'] ?? 0;
            $tollAmount = $data['toll_amount'] ?? 0;
            $totalRevenue = $baseCharge + $additionalCharges + $tollAmount;

            $trip = Trip::create([
                'trip_number' => $tripNumber,
                'vehicle_id' => $data['vehicle_id'],
                'driver_id' => $data['driver_id'],
                'customer_id' => $data['customer_id'] ?? null,
                'source' => $data['source'],
                'pickup_location' => $data['pickup_location'],
                'delivery_location' => $data['delivery_location'],
                'pickup_date' => $data['pickup_date'],
                'delivery_date' => $data['delivery_date'] ?? null,
                'cargo_description' => $data['cargo_description'] ?? null,
                'weight_kg' => $data['weight_kg'] ?? null,
                'base_charge' => $baseCharge,
                'additional_charges' => $additionalCharges,
                'toll_amount' => $tollAmount,
                'total_revenue' => $totalRevenue,
                'payment_status' => $data['payment_status'] ?? 'unpaid',
                'notes' => $data['notes'] ?? null,
            ]);

            // Auto-calculate commission
            $this->calculateCommission($trip);

            return $trip->fresh(['vehicle', 'driver.user', 'customer']);
        });
    }

    public function updateTrip(Trip $trip, array $data): Trip
    {
        return DB::transaction(function () use ($trip, $data) {
            $baseCharge = $data['base_charge'] ?? 0;
            $additionalCharges = $data['additional_charges'] ?? 0;
            $tollAmount = $data['toll_amount'] ?? 0;
            $totalRevenue = $baseCharge + $additionalCharges + $tollAmount;

            $trip->update([
                'vehicle_id' => $data['vehicle_id'],
                'driver_id' => $data['driver_id'],
                'customer_id' => $data['customer_id'] ?? null,
                'source' => $data['source'],
                'pickup_location' => $data['pickup_location'],
                'delivery_location' => $data['delivery_location'],
                'pickup_date' => $data['pickup_date'],
                'delivery_date' => $data['delivery_date'] ?? null,
                'cargo_description' => $data['cargo_description'] ?? null,
                'weight_kg' => $data['weight_kg'] ?? null,
                'base_charge' => $baseCharge,
                'additional_charges' => $additionalCharges,
                'toll_amount' => $tollAmount,
                'total_revenue' => $totalRevenue,
                'payment_status' => $data['payment_status'] ?? $trip->payment_status,
                'notes' => $data['notes'] ?? null,
            ]);

            // Recalculate commission
            $trip->commission?->delete();
            $this->calculateCommission($trip);

            return $trip->fresh(['vehicle', 'driver.user', 'customer']);
        });
    }

    protected function calculateCommission(Trip $trip): void
    {
        $driver = Driver::find($trip->driver_id);
        if (!$driver || $driver->commission_rate <= 0) return;

        DriverCommission::create([
            'driver_id' => $trip->driver_id,
            'trip_id' => $trip->id,
            'commission_rate' => $driver->commission_rate,
            'trip_revenue' => $trip->total_revenue,
            'commission_amount' => $trip->total_revenue * ($driver->commission_rate / 100),
            'month' => $trip->pickup_date instanceof \Carbon\Carbon
                ? $trip->pickup_date->format('Y-m')
                : date('Y-m', strtotime($trip->pickup_date)),
            'status' => 'pending',
        ]);
    }
}
