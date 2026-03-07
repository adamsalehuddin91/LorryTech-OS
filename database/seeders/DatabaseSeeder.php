<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Driver;
use App\Models\Vehicle;
use App\Models\VehicleAssignment;
use App\Models\Customer;
use App\Models\Trip;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // ── 1. Owner user ──────────────────────────────────────
        $owner = User::create([
            'name'     => 'Adam',
            'email'    => 'admin@lorrytech.my',
            'password' => Hash::make('password'),
            'role'     => 'owner',
        ]);

        // ── 2. Driver users ────────────────────────────────────
        $userAli = User::create([
            'name'     => 'Ali bin Ahmad',
            'email'    => 'ali@lorrytech.my',
            'password' => Hash::make('password'),
            'role'     => 'driver',
        ]);

        $userAbu = User::create([
            'name'     => 'Abu bin Hassan',
            'email'    => 'abu@lorrytech.my',
            'password' => Hash::make('password'),
            'role'     => 'driver',
        ]);

        // ── 3. Driver records ──────────────────────────────────
        $driverAli = Driver::create([
            'user_id'         => $userAli->id,
            'license_number'  => 'D1234567',
            'license_expiry'  => '2027-06-30',
            'commission_rate' => 10.00,
            'phone'           => '0121234567',
            'status'          => 'active',
        ]);

        $driverAbu = Driver::create([
            'user_id'         => $userAbu->id,
            'license_number'  => 'D7654321',
            'license_expiry'  => '2027-12-31',
            'commission_rate' => 12.00,
            'phone'           => '0129876543',
            'status'          => 'active',
        ]);

        // ── 4. Vehicles ───────────────────────────────────────
        $vehicleA = Vehicle::create([
            'plate_number'  => 'WA1234B',
            'make_model'    => 'Isuzu NPR 75',
            'year'          => 2022,
            'capacity_kg'   => 7500,
            'status'        => 'active',
            'roadtax_expiry'  => '2026-09-30',
            'insurance_expiry' => '2026-09-30',
            'current_mileage'  => 45200,
        ]);

        $vehicleB = Vehicle::create([
            'plate_number'  => 'JQR5678',
            'make_model'    => 'Hino 300',
            'year'          => 2023,
            'capacity_kg'   => 5000,
            'status'        => 'active',
            'roadtax_expiry'  => '2026-11-15',
            'insurance_expiry' => '2026-11-15',
            'current_mileage'  => 22800,
        ]);

        // ── 5. Vehicle assignments ─────────────────────────────
        VehicleAssignment::create([
            'vehicle_id'    => $vehicleA->id,
            'driver_id'     => $driverAli->id,
            'assigned_date' => '2026-01-15',
        ]);

        VehicleAssignment::create([
            'vehicle_id'    => $vehicleB->id,
            'driver_id'     => $driverAbu->id,
            'assigned_date' => '2026-02-01',
        ]);

        // ── 6. Customers ──────────────────────────────────────
        $custABC = Customer::create([
            'name'    => 'Syarikat ABC Sdn Bhd',
            'phone'   => '0123456789',
            'address' => 'No 12, Jalan Industri 3, Shah Alam',
        ]);

        $custMaju = Customer::create([
            'name'    => 'Kedai Runcit Maju',
            'phone'   => '0198765432',
            'address' => 'Lot 5, Pekan Klang',
        ]);

        $custKilang = Customer::create([
            'name'    => 'Kilang Besi Utama',
            'phone'   => '0176543210',
            'address' => 'Kawasan Perindustrian Pasir Gudang, Johor',
        ]);

        // ── 7. Trips ──────────────────────────────────────────
        Trip::create([
            'trip_number'        => 'LT2602/001',
            'vehicle_id'         => $vehicleA->id,
            'driver_id'          => $driverAli->id,
            'customer_id'        => $custABC->id,
            'source'             => 'lalamove',
            'pickup_location'    => 'Shah Alam, Selangor',
            'delivery_location'  => 'Johor Bahru, Johor',
            'pickup_date'        => '2026-02-20',
            'delivery_date'      => '2026-02-20',
            'cargo_description'  => 'Barangan am - 50 kotak',
            'weight_kg'          => 3500,
            'base_charge'        => 850.00,
            'additional_charges' => 100.00,
            'toll_amount'        => 65.00,
            'total_revenue'      => 1015.00,
            'payment_status'     => 'paid',
        ]);

        Trip::create([
            'trip_number'        => 'LT2602/002',
            'vehicle_id'         => $vehicleB->id,
            'driver_id'          => $driverAbu->id,
            'customer_id'        => $custMaju->id,
            'source'             => 'side_job',
            'pickup_location'    => 'Penang, Pulau Pinang',
            'delivery_location'  => 'Kuala Lumpur',
            'pickup_date'        => '2026-02-21',
            'delivery_date'      => '2026-02-21',
            'cargo_description'  => 'Barang dapur kering',
            'weight_kg'          => 2000,
            'base_charge'        => 600.00,
            'additional_charges' => 50.00,
            'toll_amount'        => 45.00,
            'total_revenue'      => 695.00,
            'payment_status'     => 'paid',
        ]);

        Trip::create([
            'trip_number'        => 'LT2602/003',
            'vehicle_id'         => $vehicleA->id,
            'driver_id'          => $driverAli->id,
            'customer_id'        => $custKilang->id,
            'source'             => 'lalamove',
            'pickup_location'    => 'Shah Alam, Selangor',
            'delivery_location'  => 'Klang, Selangor',
            'pickup_date'        => '2026-02-23',
            'delivery_date'      => '2026-02-23',
            'cargo_description'  => 'Besi paip 20 batang',
            'weight_kg'          => 5000,
            'base_charge'        => 350.00,
            'additional_charges' => 0.00,
            'toll_amount'        => 10.00,
            'total_revenue'      => 360.00,
            'payment_status'     => 'unpaid',
        ]);

        Trip::create([
            'trip_number'        => 'LT2602/004',
            'vehicle_id'         => $vehicleB->id,
            'driver_id'          => $driverAbu->id,
            'customer_id'        => $custABC->id,
            'source'             => 'side_job',
            'pickup_location'    => 'Kuala Lumpur',
            'delivery_location'  => 'Ipoh, Perak',
            'pickup_date'        => '2026-02-25',
            'delivery_date'      => null,
            'cargo_description'  => 'Alat ganti jentera',
            'weight_kg'          => 1500,
            'base_charge'        => 500.00,
            'additional_charges' => 80.00,
            'toll_amount'        => 30.00,
            'total_revenue'      => 610.00,
            'payment_status'     => 'unpaid',
        ]);

        Trip::create([
            'trip_number'        => 'LT2602/005',
            'vehicle_id'         => $vehicleA->id,
            'driver_id'          => $driverAli->id,
            'customer_id'        => $custMaju->id,
            'source'             => 'lalamove',
            'pickup_location'    => 'Petaling Jaya, Selangor',
            'delivery_location'  => 'Melaka',
            'pickup_date'        => '2026-02-27',
            'delivery_date'      => '2026-02-27',
            'cargo_description'  => 'Barangan runcit pelbagai',
            'weight_kg'          => 4000,
            'base_charge'        => 450.00,
            'additional_charges' => 60.00,
            'toll_amount'        => 25.00,
            'total_revenue'      => 535.00,
            'payment_status'     => 'paid',
        ]);

        // ── 8. Company settings ────────────────────────────────
        DB::table('company_settings')->insert([
            'name'       => 'LorryTech Demo',
            'reg_no'     => 'SA0123456-X',
            'phone'      => '0321234567',
            'email'      => 'info@lorrytech.my',
            'address'    => 'No 1, Jalan Teknologi, Cyberjaya, Selangor',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
