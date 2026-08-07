<?php

namespace App\Services;

use App\Models\Trip;
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
                'pickup_lat' => $data['pickup_lat'] ?? null,
                'pickup_lng' => $data['pickup_lng'] ?? null,
                'delivery_location' => $data['delivery_location'],
                'delivery_lat' => $data['delivery_lat'] ?? null,
                'delivery_lng' => $data['delivery_lng'] ?? null,
                'distance_km' => $data['distance_km'] ?? null,
                'route_polyline' => $data['route_polyline'] ?? null,
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
                'pickup_lat' => $data['pickup_lat'] ?? null,
                'pickup_lng' => $data['pickup_lng'] ?? null,
                'delivery_location' => $data['delivery_location'],
                'delivery_lat' => $data['delivery_lat'] ?? null,
                'delivery_lng' => $data['delivery_lng'] ?? null,
                'distance_km' => $data['distance_km'] ?? null,
                'route_polyline' => $data['route_polyline'] ?? null,
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

            // JANGAN padam $trip->commission di sini. Sebelum ini ia dipadam lalu
            // dijana semula; kini tiada penjanaan semula, jadi memadam bermakna
            // rekod komisyen sejarah HILANG hanya kerana trip lama disunting.
            $this->calculateCommission($trip);

            return $trip->fresh(['vehicle', 'driver.user', 'customer']);
        });
    }

    /**
     * Model gaji harian (2026-08-07): trip tidak lagi menjana komisyen peratus.
     *
     * Trip menyumbang kepada gaji melalui hari bekerja, jumlah km harian
     * (elaun jarak jauh) dan nilai trip (bonus job besar) — semuanya dikira
     * dalam PayrollService terus daripada jadual `trips`.
     *
     * Kekal sebagai method kosong supaya pemanggil sedia ada tidak pecah, dan
     * supaya niatnya jelas kepada sesiapa yang mencari kod komisyen di sini.
     */
    protected function calculateCommission(Trip $trip): void
    {
        // Sengaja tiada operasi.
    }
}
