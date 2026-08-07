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

class DashboardService
{
    public function getOwnerDashboard(): array
    {
        return [
            'kpis'              => $this->getKpis(),
            'monthlyTrend'      => $this->getMonthlyTrend(),
            'expenseBreakdown'  => $this->getExpenseBreakdown(),
            'topCustomers'      => $this->getTopCustomers(false),
            'topCustomersMonth' => $this->getTopCustomers(true),
            'vehicleAlerts'     => $this->getVehicleAlerts(),
            'recentTrips'       => $this->getRecentTrips(),
            'invoiceSummary'    => $this->getInvoiceSummary(),
            'commissionSummary' => $this->getCommissionSummary(),
            'driverLeaderboard' => $this->getDriverLeaderboard(),
        ];
    }

    // ── KPIs ──────────────────────────────────────────────────────────────────

    protected function getKpis(): array
    {
        $now       = Carbon::now();
        $lastMonth = Carbon::now()->subMonth();

        // This month
        $revenueThis  = (float) Trip::whereMonth('pickup_date', $now->month)->whereYear('pickup_date', $now->year)->sum('total_revenue');
        $expensesThis = (float) Expense::whereMonth('receipt_date', $now->month)->whereYear('receipt_date', $now->year)->sum('amount');
        $tripsThis    = Trip::whereMonth('pickup_date', $now->month)->whereYear('pickup_date', $now->year)->count();

        // Last month (MoM comparison)
        $revenueLast  = (float) Trip::whereMonth('pickup_date', $lastMonth->month)->whereYear('pickup_date', $lastMonth->year)->sum('total_revenue');
        $expensesLast = (float) Expense::whereMonth('receipt_date', $lastMonth->month)->whereYear('receipt_date', $lastMonth->year)->sum('amount');
        $tripsLast    = Trip::whereMonth('pickup_date', $lastMonth->month)->whereYear('pickup_date', $lastMonth->year)->count();

        // Net profit
        $profitThis = $revenueThis - $expensesThis;
        $profitLast = $revenueLast - $expensesLast;

        // Invoices
        $totalInvoices = Invoice::count();
        $paidInvoices  = Invoice::where('payment_status', 'paid')->count();

        // MoM helper — null = "new" (prev was 0), else percentage
        $mom = fn(float $cur, float $prev): ?float =>
            $prev > 0 ? round((($cur - $prev) / $prev) * 100, 1)
                      : ($cur > 0 ? null : 0.0);

        return [
            // Revenue
            'revenue_this_month'    => $revenueThis,
            'revenue_last_month'    => $revenueLast,
            'revenue_mom'           => $mom($revenueThis, $revenueLast),

            // Expenses
            'expenses_this_month'   => $expensesThis,
            'expenses_last_month'   => $expensesLast,
            'expenses_mom'          => $mom($expensesThis, $expensesLast),

            // Net Profit
            'net_profit_this_month' => $profitThis,
            'net_profit_last_month' => $profitLast,
            'net_profit_mom'        => abs($profitLast) > 0
                ? round((($profitThis - $profitLast) / abs($profitLast)) * 100, 1)
                : null,

            // Trips
            'trips_this_month'      => $tripsThis,
            'trips_last_month'      => $tripsLast,
            'trips_mom'             => $mom((float) $tripsThis, (float) $tripsLast),

            // Totals
            'total_trips'           => Trip::count(),
            'total_vehicles'        => Vehicle::count(),
            'total_drivers'         => Driver::count(),
            'total_customers'       => Customer::count(),

            // Financials
            'unpaid_invoices'       => (float) Invoice::where('payment_status', '!=', 'paid')->sum('total_amount'),
            'pending_commissions'   => (float) DriverCommission::where('status', 'pending')->sum('commission_amount'),

            // Collection rate
            'collection_rate'       => $totalInvoices > 0 ? round(($paidInvoices / $totalInvoices) * 100, 1) : 0.0,
            'total_invoices'        => $totalInvoices,
            'paid_invoices_count'   => $paidInvoices,
        ];
    }

    // ── Monthly Trend ─────────────────────────────────────────────────────────

    protected function getMonthlyTrend(): array
    {
        $months = collect();
        for ($i = 5; $i >= 0; $i--) {
            $months->push(Carbon::now()->subMonths($i)->format('Y-m'));
        }

        return $months->map(function ($month) {
            [$year, $m] = explode('-', $month);
            $revenue  = (float) Trip::whereMonth('pickup_date', $m)->whereYear('pickup_date', $year)->sum('total_revenue');
            $expenses = (float) Expense::whereMonth('receipt_date', $m)->whereYear('receipt_date', $year)->sum('amount');

            return [
                'month'    => $month,
                'label'    => Carbon::createFromFormat('Y-m', $month)->format('M Y'),
                'revenue'  => $revenue,
                'expenses' => $expenses,
                'profit'   => $revenue - $expenses,
            ];
        })->values()->toArray();
    }

    // ── Expense Breakdown ─────────────────────────────────────────────────────

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

    // ── Top Customers (all-time or this month) ────────────────────────────────

    protected function getTopCustomers(bool $thisMonth = false): array
    {
        $now   = Carbon::now();
        $query = Customer::select('customers.id', 'customers.name')
            ->selectRaw('SUM(trips.total_revenue) as total_revenue')
            ->selectRaw('COUNT(trips.id) as trip_count')
            ->join('trips', 'trips.customer_id', '=', 'customers.id')
            ->whereNull('trips.deleted_at');

        if ($thisMonth) {
            $query->whereMonth('trips.pickup_date', $now->month)
                  ->whereYear('trips.pickup_date', $now->year);
        }

        return $query->groupBy('customers.id', 'customers.name')
            ->orderByDesc('total_revenue')
            ->limit(5)
            ->get()
            ->toArray();
    }

    // ── Vehicle Alerts ────────────────────────────────────────────────────────

    protected function getVehicleAlerts(): array
    {
        $threshold = Carbon::now()->addDays(30);
        $today     = Carbon::today();
        $labels    = [
            'roadtax_expiry'     => 'Cukai Jalan',
            'insurance_expiry'   => 'Insurans',
            'permit_apad_expiry' => 'Permit APAD',
        ];

        $alerts = [];
        Vehicle::where(function ($q) use ($threshold) {
            $q->where('roadtax_expiry', '<=', $threshold)
              ->orWhere('insurance_expiry', '<=', $threshold)
              ->orWhere('permit_apad_expiry', '<=', $threshold);
        })->each(function ($vehicle) use ($threshold, $today, $labels, &$alerts) {
            foreach (array_keys($labels) as $field) {
                if ($vehicle->$field && Carbon::parse($vehicle->$field)->lte($threshold)) {
                    $expiry = Carbon::parse($vehicle->$field);
                    $alerts[] = [
                        'vehicle'     => $vehicle->plate_number,
                        'type'        => $labels[$field],
                        'expiry_date' => $expiry->format('Y-m-d'),
                        'days_left'   => (int) $today->diffInDays($expiry, false),
                        'is_expired'  => $expiry->lt($today),
                    ];
                }
            }
        });

        usort($alerts, fn($a, $b) => $a['days_left'] <=> $b['days_left']);
        return $alerts;
    }

    // ── Recent Trips ──────────────────────────────────────────────────────────

    protected function getRecentTrips(): array
    {
        return Trip::with(['vehicle:id,plate_number', 'customer:id,name', 'driver.user:id,name'])
            ->orderByDesc('pickup_date')
            ->limit(5)
            ->get()
            ->toArray();
    }

    // ── Invoice Summary + Overdue List ────────────────────────────────────────

    protected function getInvoiceSummary(): array
    {
        $today = Carbon::today();

        $overdueList = Invoice::with('customer:id,name')
            ->where('payment_status', '!=', 'paid')
            ->where('due_date', '<', $today)
            ->orderBy('due_date')
            ->limit(5)
            ->get()
            ->map(fn($inv) => [
                'id'             => $inv->id,
                'invoice_number' => $inv->invoice_number,
                'customer'       => $inv->customer?->name ?? '-',
                'total_amount'   => (float) $inv->total_amount,
                'due_date'       => $inv->due_date?->format('Y-m-d'),
                'days_overdue'   => (int) $today->diffInDays($inv->due_date),
            ])->toArray();

        return [
            'total'        => Invoice::count(),
            'paid'         => Invoice::where('payment_status', 'paid')->count(),
            'partial'      => Invoice::where('payment_status', 'partial')->count(),
            'unpaid'       => Invoice::where('payment_status', 'unpaid')->count(),
            'overdue'      => Invoice::where('payment_status', '!=', 'paid')
                ->where('due_date', '<', $today)
                ->count(),
            'overdue_list' => $overdueList,
        ];
    }

    // ── Commission Summary ────────────────────────────────────────────────────

    protected function getCommissionSummary(): array
    {
        return [
            'pending_total'   => (float) DriverCommission::where('status', 'pending')->sum('commission_amount'),
            'pending_count'   => DriverCommission::where('status', 'pending')->count(),
            'approved_total'  => (float) DriverCommission::where('status', 'approved')->sum('commission_amount'),
            'paid_this_month' => (float) DriverCommission::where('status', 'paid')
                ->where('month', Carbon::now()->format('Y-m'))
                ->sum('commission_amount'),
        ];
    }

    // ── Driver Leaderboard (this month) ───────────────────────────────────────

    protected function getDriverLeaderboard(): array
    {
        $now = Carbon::now();

        return Trip::select('driver_id')
            ->selectRaw('COUNT(*) as trip_count')
            ->selectRaw('SUM(total_revenue) as total_revenue')
            ->whereMonth('pickup_date', $now->month)
            ->whereYear('pickup_date', $now->year)
            ->whereNotNull('driver_id')
            ->groupBy('driver_id')
            ->orderByDesc('trip_count')
            ->orderByDesc('total_revenue')
            ->limit(5)
            ->with([
                'driver:id,user_id,daily_rate',
                'driver.user:id,name',
            ])
            ->get()
            ->map(fn($r) => [
                'name'            => $r->driver?->user?->name ?? 'Unknown',
                'trip_count'      => (int) $r->trip_count,
                'total_revenue'   => (float) $r->total_revenue,
                'daily_rate'      => (float) ($r->driver?->daily_rate ?? 0),
            ])
            ->toArray();
    }
}
