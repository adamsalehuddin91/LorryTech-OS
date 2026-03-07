<?php

namespace App\Services;

use App\Models\Customer;
use App\Models\Driver;
use App\Models\DriverCommission;
use App\Models\Expense;
use App\Models\Invoice;
use App\Models\Trip;
use App\Models\Vehicle;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardService
{
    /**
     * Get all dashboard data for owner view.
     */
    public function getOwnerDashboard(): array
    {
        return [
            'kpis' => $this->getKpis(),
            'monthlyTrend' => $this->getMonthlyTrend(),
            'expenseBreakdown' => $this->getExpenseBreakdown(),
            'topCustomers' => $this->getTopCustomers(),
            'vehicleAlerts' => $this->getVehicleAlerts(),
            'recentTrips' => $this->getRecentTrips(),
            'invoiceSummary' => $this->getInvoiceSummary(),
            'commissionSummary' => $this->getCommissionSummary(),
        ];
    }

    /**
     * KPI stat cards — current month + all-time.
     */
    protected function getKpis(): array
    {
        $now = Carbon::now();

        // This month
        $revenueThisMonth = Trip::whereMonth('pickup_date', $now->month)
            ->whereYear('pickup_date', $now->year)
            ->sum('total_revenue');

        $expensesThisMonth = Expense::whereMonth('receipt_date', $now->month)
            ->whereYear('receipt_date', $now->year)
            ->sum('amount');

        $tripsThisMonth = Trip::whereMonth('pickup_date', $now->month)
            ->whereYear('pickup_date', $now->year)
            ->count();

        // All time
        $totalRevenue = Trip::sum('total_revenue');
        $totalExpenses = Expense::sum('amount');
        $totalTrips = Trip::count();

        // Invoices
        $unpaidInvoices = Invoice::where('payment_status', '!=', 'paid')->sum('total_amount');
        $paidInvoices = Invoice::where('payment_status', 'paid')->sum('total_amount');

        // Commissions
        $pendingCommissions = DriverCommission::where('status', 'pending')->sum('commission_amount');

        return [
            'revenue_this_month' => (float) $revenueThisMonth,
            'expenses_this_month' => (float) $expensesThisMonth,
            'net_profit_this_month' => (float) ($revenueThisMonth - $expensesThisMonth),
            'trips_this_month' => $tripsThisMonth,
            'total_revenue' => (float) $totalRevenue,
            'total_expenses' => (float) $totalExpenses,
            'total_trips' => $totalTrips,
            'unpaid_invoices' => (float) $unpaidInvoices,
            'pending_commissions' => (float) $pendingCommissions,
            'total_vehicles' => Vehicle::count(),
            'total_drivers' => Driver::count(),
            'total_customers' => Customer::count(),
        ];
    }

    /**
     * Monthly revenue vs expenses trend — last 6 months.
     */
    protected function getMonthlyTrend(): array
    {
        $months = collect();
        for ($i = 5; $i >= 0; $i--) {
            $months->push(Carbon::now()->subMonths($i)->format('Y-m'));
        }

        return $months->map(function ($month) {
            [$year, $m] = explode('-', $month);

            $revenue = Trip::whereMonth('pickup_date', $m)
                ->whereYear('pickup_date', $year)
                ->sum('total_revenue');

            $expenses = Expense::whereMonth('receipt_date', $m)
                ->whereYear('receipt_date', $year)
                ->sum('amount');

            return [
                'month' => $month,
                'label' => Carbon::createFromFormat('Y-m', $month)->translatedFormat('M Y'),
                'revenue' => (float) $revenue,
                'expenses' => (float) $expenses,
                'profit' => (float) ($revenue - $expenses),
            ];
        })->values()->toArray();
    }

    /**
     * Expense breakdown by category — current month.
     */
    protected function getExpenseBreakdown(): array
    {
        $now = Carbon::now();

        return Expense::selectRaw('category, SUM(amount) as total, COUNT(*) as count')
            ->whereMonth('receipt_date', $now->month)
            ->whereYear('receipt_date', $now->year)
            ->groupBy('category')
            ->orderByDesc('total')
            ->get()
            ->toArray();
    }

    /**
     * Top 5 customers by revenue.
     */
    protected function getTopCustomers(): array
    {
        return Customer::select('customers.id', 'customers.name')
            ->selectRaw('SUM(trips.total_revenue) as total_revenue')
            ->selectRaw('COUNT(trips.id) as trip_count')
            ->join('trips', 'trips.customer_id', '=', 'customers.id')
            ->groupBy('customers.id', 'customers.name')
            ->orderByDesc('total_revenue')
            ->limit(5)
            ->get()
            ->toArray();
    }

    /**
     * Vehicle alerts — expiring documents within 30 days.
     */
    protected function getVehicleAlerts(): array
    {
        $threshold = Carbon::now()->addDays(30);
        $today = Carbon::today();

        $alerts = [];

        $vehicles = Vehicle::where(function ($q) use ($threshold) {
            $q->where('roadtax_expiry', '<=', $threshold)
                ->orWhere('insurance_expiry', '<=', $threshold)
                ->orWhere('permit_apad_expiry', '<=', $threshold);
        })->get();

        foreach ($vehicles as $vehicle) {
            foreach (['roadtax_expiry', 'insurance_expiry', 'permit_apad_expiry'] as $field) {
                if ($vehicle->$field && Carbon::parse($vehicle->$field)->lte($threshold)) {
                    $expiry = Carbon::parse($vehicle->$field);
                    $labels = [
                        'roadtax_expiry' => 'Cukai Jalan',
                        'insurance_expiry' => 'Insurans',
                        'permit_apad_expiry' => 'Permit APAD',
                    ];
                    $alerts[] = [
                        'vehicle' => $vehicle->plate_number,
                        'type' => $labels[$field],
                        'expiry_date' => $expiry->format('Y-m-d'),
                        'days_left' => $today->diffInDays($expiry, false),
                        'is_expired' => $expiry->lt($today),
                    ];
                }
            }
        }

        // Sort by days_left ascending (most urgent first)
        usort($alerts, fn($a, $b) => $a['days_left'] <=> $b['days_left']);

        return $alerts;
    }

    /**
     * Recent 5 trips.
     */
    protected function getRecentTrips(): array
    {
        return Trip::with(['vehicle:id,plate_number', 'customer:id,name', 'driver:id,name'])
            ->orderByDesc('pickup_date')
            ->limit(5)
            ->get()
            ->toArray();
    }

    /**
     * Invoice payment summary.
     */
    protected function getInvoiceSummary(): array
    {
        return [
            'total' => Invoice::count(),
            'paid' => Invoice::where('payment_status', 'paid')->count(),
            'partial' => Invoice::where('payment_status', 'partial')->count(),
            'unpaid' => Invoice::where('payment_status', 'unpaid')->count(),
            'overdue' => Invoice::where('payment_status', '!=', 'paid')
                ->where('due_date', '<', Carbon::today())
                ->count(),
        ];
    }

    /**
     * Commission summary for owner view.
     */
    protected function getCommissionSummary(): array
    {
        return [
            'pending_total' => (float) DriverCommission::where('status', 'pending')->sum('commission_amount'),
            'pending_count' => DriverCommission::where('status', 'pending')->count(),
            'approved_total' => (float) DriverCommission::where('status', 'approved')->sum('commission_amount'),
            'paid_this_month' => (float) DriverCommission::where('status', 'paid')
                ->where('month', Carbon::now()->format('Y-m'))
                ->sum('commission_amount'),
        ];
    }
}
