<?php

namespace App\Http\Controllers;

use App\Models\Driver;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class DriverController extends Controller
{
    public function index(Request $request)
    {
        $drivers = Driver::with('user')
            ->when($request->search, fn($q, $search) => $q->whereHas('user', fn($q2) => $q2->where('name', 'like', "%{$search}%"))->orWhere('license_number', 'like', "%{$search}%"))
            ->when($request->status, fn($q, $status) => $q->where('status', $status))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Drivers/Index', ['drivers' => $drivers, 'filters' => $request->only(['search', 'status'])]);
    }

    public function create()
    {
        return Inertia::render('Drivers/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'license_number' => 'nullable|string',
            'license_expiry' => 'nullable|date',
            'commission_rate' => 'required|numeric|min:0|max:100',
            'phone' => 'nullable|string|max:20',
            'emergency_contact' => 'nullable|string',
            'status' => 'required|in:active,inactive',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'driver',
        ]);

        Driver::create([
            'user_id' => $user->id,
            'license_number' => $validated['license_number'],
            'license_expiry' => $validated['license_expiry'],
            'commission_rate' => $validated['commission_rate'],
            'phone' => $validated['phone'],
            'emergency_contact' => $validated['emergency_contact'],
            'status' => $validated['status'],
        ]);

        return redirect()->route('drivers.index')->with('success', 'Pemandu berjaya ditambah.');
    }

    public function show(Driver $driver)
    {
        $driver->load(['user', 'trips', 'commissions', 'assignments.vehicle']);
        return Inertia::render('Drivers/Show', ['driver' => $driver]);
    }

    public function edit(Driver $driver)
    {
        $driver->load('user');
        return Inertia::render('Drivers/Edit', ['driver' => $driver]);
    }

    public function update(Request $request, Driver $driver)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $driver->user_id,
            'license_number' => 'nullable|string',
            'license_expiry' => 'nullable|date',
            'commission_rate' => 'required|numeric|min:0|max:100',
            'phone' => 'nullable|string|max:20',
            'emergency_contact' => 'nullable|string',
            'status' => 'required|in:active,inactive',
        ]);

        $driver->user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
        ]);

        $driver->update([
            'license_number' => $validated['license_number'],
            'license_expiry' => $validated['license_expiry'],
            'commission_rate' => $validated['commission_rate'],
            'phone' => $validated['phone'],
            'emergency_contact' => $validated['emergency_contact'],
            'status' => $validated['status'],
        ]);

        return redirect()->route('drivers.index')->with('success', 'Pemandu berjaya dikemaskini.');
    }

    public function destroy(Driver $driver)
    {
        $driver->user->delete(); // cascade deletes driver too
        return redirect()->route('drivers.index')->with('success', 'Pemandu berjaya dipadam.');
    }
}
