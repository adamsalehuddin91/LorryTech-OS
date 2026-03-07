<?php

namespace App\Http\Controllers;

use App\Models\Driver;
use App\Models\DriverCommission;
use App\Models\Expense;
use App\Models\Trip;
use App\Services\ExpenseService;
use Illuminate\Http\Request;
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

        $trips = Trip::with(['vehicle', 'customer'])
            ->where('driver_id', $driver?->id)
            ->when($request->input('month'), function ($q, $month) {
                $q->whereRaw("strftime('%Y-%m', pickup_date) = ?", [$month]);
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
                ->whereNull('unassigned_date')
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

        $expenses = Expense::with('vehicle')
            ->where('driver_id', $driver?->id)
            ->orderByDesc('receipt_date')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('DriverPortal/MyReceipts', [
            'expenses' => $expenses,
        ]);
    }
}
