<?php

namespace App\Http\Controllers;

use App\Models\Driver;
use App\Models\DriverCommission;
use App\Models\DriverJob;
use App\Models\Expense;
use App\Models\Trip;
use App\Services\ExpenseService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class DriverPortalController extends Controller
{
    public function __construct(
        protected ExpenseService $expenseService
    ) {}

    protected function getDriver(Request $request): ?Driver
    {
        return Driver::where('user_id', $request->user()->id)->first();
    }

    public function dashboard(Request $request)
    {
        $driver = $this->getDriver($request);

        if (!$driver) {
            return Inertia::render('DriverPortal/Dashboard', [
                'stats' => null,
                'recentTrips' => [],
            ]);
        }

        $currentMonth = now()->format('Y-m');

        $totalTrips = Trip::where('driver_id', $driver->id)->count();
        $tripsThisMonth = Trip::where('driver_id', $driver->id)
            ->whereMonth('pickup_date', now()->month)
            ->whereYear('pickup_date', now()->year)
            ->count();

        $commissionThisMonth = DriverCommission::where('driver_id', $driver->id)
            ->where('month', $currentMonth)
            ->sum('commission_amount');

        $pendingCommission = DriverCommission::where('driver_id', $driver->id)
            ->where('status', 'pending')
            ->sum('commission_amount');

        $totalEarned = DriverCommission::where('driver_id', $driver->id)
            ->where('status', 'paid')
            ->sum('commission_amount');

        $receiptsThisMonth = Expense::where('driver_id', $driver->id)
            ->whereMonth('receipt_date', now()->month)
            ->whereYear('receipt_date', now()->year)
            ->count();

        $recentTrips = Trip::with(['vehicle', 'customer'])
            ->where('driver_id', $driver->id)
            ->orderByDesc('pickup_date')
            ->limit(5)
            ->get();

        return Inertia::render('DriverPortal/Dashboard', [
            'stats' => [
                'total_trips' => $totalTrips,
                'trips_this_month' => $tripsThisMonth,
                'commission_this_month' => $commissionThisMonth,
                'pending_commission' => $pendingCommission,
                'total_earned' => $totalEarned,
                'receipts_this_month' => $receiptsThisMonth,
                'commission_rate' => $driver->commission_rate,
            ],
            'recentTrips' => $recentTrips,
            'driverName' => $request->user()->name,
        ]);
    }

    public function myTrips(Request $request)
    {
        $driver = $this->getDriver($request);
        abort_unless($driver, 403, 'Tiada profil pemandu dikaitkan.');

        $trips = Trip::with(['vehicle', 'customer'])
            ->where('driver_id', $driver?->id)
            ->when($request->input('month'), function ($q, $month) {
                $start = Carbon::parse($month . '-01')->startOfMonth();
                $end = (clone $start)->endOfMonth();
                $q->whereBetween('pickup_date', [$start, $end]);
            })
            ->orderByDesc('pickup_date')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('DriverPortal/MyTrips', [
            'trips' => $trips,
            'filters' => $request->only(['month']),
        ]);
    }

    public function myCommissions(Request $request)
    {
        $driver = $this->getDriver($request);
        abort_unless($driver, 403, 'Tiada profil pemandu dikaitkan.');

        $commissions = DriverCommission::with('trip')
            ->where('driver_id', $driver?->id)
            ->when($request->input('month'), fn($q, $month) => $q->where('month', $month))
            ->when($request->input('status'), fn($q, $status) => $q->where('status', $status))
            ->orderByDesc('created_at')
            ->paginate(15)
            ->withQueryString();

        // Monthly summary
        $monthlySummary = DriverCommission::selectRaw('month, SUM(commission_amount) as total, COUNT(*) as trip_count')
            ->where('driver_id', $driver?->id)
            ->groupBy('month')
            ->orderByDesc('month')
            ->limit(6)
            ->get();

        return Inertia::render('DriverPortal/MyCommissions', [
            'commissions' => $commissions,
            'monthlySummary' => $monthlySummary,
            'filters' => $request->only(['month', 'status']),
        ]);
    }

    public function uploadReceipt(Request $request)
    {
        $driver = $this->getDriver($request);
        abort_unless($driver, 403, 'Tiada profil pemandu dikaitkan.');

        $categories = [
            'fuel' => 'Bahan Api (Diesel)',
            'toll' => 'Tol',
            'maintenance' => 'Penyelenggaraan',
            'repair' => 'Pembaikan',
            'tyre' => 'Tayar',
            'parking' => 'Parking',
            'other' => 'Lain-lain',
        ];

        // Get vehicles assigned to this driver
        $vehicles = $driver
            ? $driver->assignments()
                ->with('vehicle:id,plate_number')
                ->whereNull('returned_date')
                ->get()
                ->pluck('vehicle')
                ->filter()
            : collect();

        return Inertia::render('DriverPortal/UploadReceipt', [
            'categories' => $categories,
            'vehicles' => $vehicles->values(),
        ]);
    }

    public function storeReceipt(Request $request)
    {
        $driver = $this->getDriver($request);
        abort_unless($driver, 403, 'Tiada profil pemandu dikaitkan.');

        $validated = $request->validate([
            'vehicle_id' => 'required|exists:vehicles,id',
            'category' => 'required|in:fuel,toll,maintenance,repair,tyre,parking,other',
            'amount' => 'required|numeric|min:0.01',
            'receipt_date' => 'required|date',
            'description' => 'nullable|string|max:255',
            'receipt_image' => 'required|image|max:5120',
        ]);

        $receipt = $request->file('receipt_image');
        unset($validated['receipt_image']);

        $validated['driver_id'] = $driver?->id;
        $validated['uploaded_by'] = $request->user()->id;

        $this->expenseService->createExpense($validated, $receipt);

        return redirect()->route('driver.dashboard')->with('success', 'Resit berjaya dimuat naik.');
    }

    public function myReceipts(Request $request)
    {
        $driver = $this->getDriver($request);
        abort_unless($driver, 403, 'Tiada profil pemandu dikaitkan.');

        $expenses = Expense::with('vehicle')
            ->where('driver_id', $driver?->id)
            ->orderByDesc('receipt_date')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('DriverPortal/MyReceipts', [
            'expenses' => $expenses,
        ]);
    }

    public function logJob(Request $request)
    {
        $driver = $this->getDriver($request);
        abort_unless($driver, 403, 'Tiada profil pemandu dikaitkan.');

        return Inertia::render('DriverPortal/LogJob', [
            'lalamoveRate' => (float) $driver->lalamove_commission_rate,
            'sideJobRate'  => (float) $driver->commission_rate,
        ]);
    }

    public function storeJob(Request $request)
    {
        $driver = $this->getDriver($request);
        abort_unless($driver, 403, 'Tiada profil pemandu dikaitkan.');

        $validated = $request->validate([
            'job_type'          => 'required|in:lalamove,side_job',
            'job_date'          => 'required|date',
            'pickup_location'   => 'required|string|max:255',
            'delivery_location' => 'required|string|max:255',
            'pickup_lat'        => 'nullable|numeric|between:-90,90',
            'pickup_lng'        => 'nullable|numeric|between:-180,180',
            'delivery_lat'      => 'nullable|numeric|between:-90,90',
            'delivery_lng'      => 'nullable|numeric|between:-180,180',
            'distance_km'       => 'nullable|numeric|min:0|max:99999',
            'duration_min'      => 'nullable|integer|min:0',
            'route_polyline'    => 'nullable|string|max:65000',
            'customer_name'     => 'nullable|string|max:255',
            'gross_amount'      => 'required|numeric|min:0.01',
            'notes'             => 'nullable|string|max:500',
            'proof_image'       => 'nullable|image|max:5120',
        ]);

        $rate = $validated['job_type'] === 'lalamove'
            ? (float) $driver->lalamove_commission_rate
            : (float) $driver->commission_rate;

        $commissionAmount = round($validated['gross_amount'] * $rate / 100, 2);

        $proofPath = null;
        if ($request->hasFile('proof_image')) {
            $proofPath = '/storage/' . $request->file('proof_image')->store('driver-jobs', 'public');
        }

        DriverJob::create([
            'driver_id'         => $driver->id,
            'job_type'          => $validated['job_type'],
            'job_date'          => $validated['job_date'],
            'pickup_location'   => $validated['pickup_location'],
            'delivery_location' => $validated['delivery_location'],
            'pickup_lat'        => $validated['pickup_lat'] ?? null,
            'pickup_lng'        => $validated['pickup_lng'] ?? null,
            'delivery_lat'      => $validated['delivery_lat'] ?? null,
            'delivery_lng'      => $validated['delivery_lng'] ?? null,
            'distance_km'       => $validated['distance_km'] ?? null,
            'duration_min'      => $validated['duration_min'] ?? null,
            'route_polyline'    => $validated['route_polyline'] ?? null,
            'customer_name'     => $validated['customer_name'] ?? null,
            'gross_amount'      => $validated['gross_amount'],
            'commission_rate'   => $rate,
            'commission_amount' => $commissionAmount,
            'proof_image'       => $proofPath,
            'notes'             => $validated['notes'] ?? null,
            'status'            => 'pending',
        ]);

        return redirect()->route('driver.work')->with('success', 'Kerja berjaya dilog. Menunggu pengesahan.');
    }

    public function myWork(Request $request)
    {
        $driver = $this->getDriver($request);
        abort_unless($driver, 403, 'Tiada profil pemandu dikaitkan.');

        $trips = Trip::with(['vehicle', 'customer'])
            ->where('driver_id', $driver->id)
            ->when($request->input('month'), function ($q, $month) {
                $start = Carbon::parse($month . '-01')->startOfMonth();
                $end = (clone $start)->endOfMonth();
                $q->whereBetween('pickup_date', [$start, $end]);
            })
            ->orderByDesc('pickup_date')
            ->paginate(15)
            ->withQueryString();

        $jobs = DriverJob::where('driver_id', $driver->id)
            ->orderByDesc('job_date')
            ->paginate(15)
            ->withQueryString()
            ->through(fn($j) => [
                'id'               => $j->id,
                'job_type'         => $j->job_type,
                'job_type_label'   => $j->job_type_label,
                'job_date'         => $j->job_date->format('d/m/Y'),
                'pickup_location'  => $j->pickup_location,
                'delivery_location'=> $j->delivery_location,
                'distance_km'      => $j->distance_km,
                'duration_min'     => $j->duration_min,
                'customer_name'    => $j->customer_name,
                'gross_amount'     => $j->gross_amount,
                'commission_rate'  => $j->commission_rate,
                'commission_amount'=> $j->commission_amount,
                'proof_image'      => $j->proof_image,
                'status'           => $j->status,
                'rejection_reason' => $j->rejection_reason,
            ]);

        return Inertia::render('DriverPortal/MyWork', [
            'trips'   => $trips,
            'jobs'    => $jobs,
            'filters' => $request->only(['tab', 'month']),
        ]);
    }
}
