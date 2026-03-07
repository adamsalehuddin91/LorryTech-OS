<?php

namespace App\Http\Controllers;

use App\Models\Vehicle;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VehicleController extends Controller
{
    public function index(Request $request)
    {
        $vehicles = Vehicle::query()
            ->when($request->search, fn($q, $search) => $q->where('plate_number', 'like', "%{$search}%")->orWhere('make_model', 'like', "%{$search}%"))
            ->when($request->status, fn($q, $status) => $q->where('status', $status))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Vehicles/Index', ['vehicles' => $vehicles, 'filters' => $request->only(['search', 'status'])]);
    }

    public function create()
    {
        return Inertia::render('Vehicles/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'plate_number' => 'required|string|unique:vehicles',
            'make_model' => 'required|string',
            'year' => 'nullable|integer|min:1990|max:2030',
            'capacity_kg' => 'nullable|numeric|min:0',
            'status' => 'required|in:active,maintenance,inactive',
            'roadtax_expiry' => 'nullable|date',
            'insurance_expiry' => 'nullable|date',
            'permit_apad_expiry' => 'nullable|date',
            'current_mileage' => 'nullable|integer|min:0',
            'notes' => 'nullable|string',
        ]);

        Vehicle::create($validated);
        return redirect()->route('vehicles.index')->with('success', 'Kenderaan berjaya ditambah.');
    }

    public function show(Vehicle $vehicle)
    {
        $vehicle->load(['assignments.driver.user', 'maintenanceRecords', 'lease']);
        return Inertia::render('Vehicles/Show', ['vehicle' => $vehicle]);
    }

    public function edit(Vehicle $vehicle)
    {
        return Inertia::render('Vehicles/Edit', ['vehicle' => $vehicle]);
    }

    public function update(Request $request, Vehicle $vehicle)
    {
        $validated = $request->validate([
            'plate_number' => 'required|string|unique:vehicles,plate_number,' . $vehicle->id,
            'make_model' => 'required|string',
            'year' => 'nullable|integer|min:1990|max:2030',
            'capacity_kg' => 'nullable|numeric|min:0',
            'status' => 'required|in:active,maintenance,inactive',
            'roadtax_expiry' => 'nullable|date',
            'insurance_expiry' => 'nullable|date',
            'permit_apad_expiry' => 'nullable|date',
            'current_mileage' => 'nullable|integer|min:0',
            'notes' => 'nullable|string',
        ]);

        $vehicle->update($validated);
        return redirect()->route('vehicles.index')->with('success', 'Kenderaan berjaya dikemaskini.');
    }

    public function destroy(Vehicle $vehicle)
    {
        $vehicle->delete();
        return redirect()->route('vehicles.index')->with('success', 'Kenderaan berjaya dipadam.');
    }
}
