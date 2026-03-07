<?php

namespace App\Http\Controllers;

use App\Models\Trip;
use App\Models\Vehicle;
use App\Models\Driver;
use App\Models\Customer;
use App\Services\TripService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TripController extends Controller
{
    public function __construct(
        protected TripService $tripService
    ) {}

    public function index(Request $request)
    {
        $query = Trip::with(['vehicle', 'driver.user', 'customer']);

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('trip_number', 'like', "%{$search}%")
                  ->orWhere('pickup_location', 'like', "%{$search}%")
                  ->orWhere('delivery_location', 'like', "%{$search}%");
            });
        }

        if ($source = $request->input('source')) {
            $query->where('source', $source);
        }

        if ($status = $request->input('payment_status')) {
            $query->where('payment_status', $status);
        }

        $trips = $query->orderByDesc('pickup_date')->paginate(15)->withQueryString();

        return Inertia::render('Trips/Index', [
            'trips' => $trips,
            'filters' => $request->only(['search', 'source', 'payment_status']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Trips/Create', [
            'vehicles' => Vehicle::where('status', 'active')->get(),
            'drivers' => Driver::with('user')->where('status', 'active')->get(),
            'customers' => Customer::orderBy('name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'vehicle_id' => 'required|exists:vehicles,id',
            'driver_id' => 'required|exists:drivers,id',
            'customer_id' => 'nullable|exists:customers,id',
            'source' => 'required|in:lalamove,side_job',
            'pickup_location' => 'required|string|max:255',
            'delivery_location' => 'required|string|max:255',
            'pickup_date' => 'required|date',
            'delivery_date' => 'nullable|date',
            'cargo_description' => 'nullable|string|max:500',
            'weight_kg' => 'nullable|numeric|min:0',
            'base_charge' => 'required|numeric|min:0',
            'additional_charges' => 'nullable|numeric|min:0',
            'toll_amount' => 'nullable|numeric|min:0',
            'payment_status' => 'nullable|in:unpaid,partial,paid',
            'notes' => 'nullable|string|max:1000',
        ]);

        $this->tripService->createTrip($validated);

        return redirect()->route('trips.index')->with('success', 'Perjalanan berjaya ditambah.');
    }

    public function show(Trip $trip)
    {
        $trip->load(['vehicle', 'driver.user', 'customer', 'commission', 'invoice']);

        return Inertia::render('Trips/Show', [
            'trip' => $trip,
        ]);
    }

    public function edit(Trip $trip)
    {
        $trip->load(['vehicle', 'driver.user', 'customer']);

        return Inertia::render('Trips/Edit', [
            'trip' => $trip,
            'vehicles' => Vehicle::where('status', 'active')->get(),
            'drivers' => Driver::with('user')->where('status', 'active')->get(),
            'customers' => Customer::orderBy('name')->get(),
        ]);
    }

    public function update(Request $request, Trip $trip)
    {
        $validated = $request->validate([
            'vehicle_id' => 'required|exists:vehicles,id',
            'driver_id' => 'required|exists:drivers,id',
            'customer_id' => 'nullable|exists:customers,id',
            'source' => 'required|in:lalamove,side_job',
            'pickup_location' => 'required|string|max:255',
            'delivery_location' => 'required|string|max:255',
            'pickup_date' => 'required|date',
            'delivery_date' => 'nullable|date',
            'cargo_description' => 'nullable|string|max:500',
            'weight_kg' => 'nullable|numeric|min:0',
            'base_charge' => 'required|numeric|min:0',
            'additional_charges' => 'nullable|numeric|min:0',
            'toll_amount' => 'nullable|numeric|min:0',
            'payment_status' => 'nullable|in:unpaid,partial,paid',
            'notes' => 'nullable|string|max:1000',
        ]);

        $this->tripService->updateTrip($trip, $validated);

        return redirect()->route('trips.index')->with('success', 'Perjalanan berjaya dikemaskini.');
    }

    public function destroy(Trip $trip)
    {
        $trip->commission()->delete();
        $trip->delete();

        return redirect()->route('trips.index')->with('success', 'Perjalanan berjaya dipadam.');
    }
}
