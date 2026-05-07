import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

const categoryLabels = {
    fuel:        'Bahan Api',
    toll:        'Tol',
    maintenance: 'Penyelenggaraan',
    repair:      'Pembaikan',
    tyre:        'Tayar',
    insurance:   'Insurans',
    roadtax:     'Cukai Jalan',
    permit:      'Permit',
    parking:     'Parking',
    other:       'Lain-lain',
};

const categoryColors = {
    fuel:        'bg-orange-500',
    toll:        'bg-purple-500',
    maintenance: 'bg-blue-500',
    repair:      'bg-red-500',
    tyre:        'bg-gray-500',
    insurance:   'bg-teal-500',
    roadtax:     'bg-yellow-500',
    permit:      'bg-indigo-500',
    parking:     'bg-cyan-500',
    other:       'bg-gray-400',
};

export default function Dashboard({
    kpis,
    monthlyTrend,
    expenseBreakdown,
    topCustomers,
    topCustomersMonth,
    vehicleAlerts,
    recentTrips,
    invoiceSummary,
    commissionSummary,
    driverLeaderboard,
}) {
    const [customerPeriod, setCustomerPeriod] = useState('all');

    const fmt = (v) =>
        `RM ${Number(v || 0).toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const fmtK = (v) => {
        const n = Number(v || 0);
        if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
        if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}K`;
        return String(Math.round(n));
    };

    const maxChartVal = Math.max(
        ...monthlyTrend.map((m) => Math.max(m.revenue, m.expenses, Math.abs(m.profit))),
        1
    );

    const expenseTotal = expenseBreakdown.reduce((sum, e) => sum + Number(e.total), 0);
    const displayedCustomers = customerPeriod === 'month' ? topCustomersMonth : topCustomers;

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Papan Pemuka</h2>}
        >
            <Head title="Papan Pemuka" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-5">

                    {/* ── Quick Actions ── */}
                    <div className="flex flex-wrap gap-2">
                        <Link
                            href={route('trips.create')}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition"
                        >
                            <PlusIcon /> Buat Trip
                        </Link>
                        <Link
                            href={route('expenses.create')}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-600 transition"
                        >
                            <PlusIcon /> Catat Belanja
                        </Link>
                        <Link
                            href={route('invoices.create')}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 transition"
                        >
                            <PlusIcon /> Jana Invois
                        </Link>
                        <Link
                            href={route('quotations.index')}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition"
                        >
                            Sebut Harga
                        </Link>
                        <Link
                            href={route('drivers.index')}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition"
                        >
                            Pemandu
                        </Link>
                    </div>

                    {/* ── KPI Row 1 — Financial ── */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <KpiCard
                            label="Hasil Bulan Ini"
                            value={fmt(kpis.revenue_this_month)}
                            sub={`${kpis.trips_this_month} trip`}
                            mom={kpis.revenue_mom}
                            color="bg-blue-50 text-blue-700 border-blue-200"
                            href={route('trips.index')}
                        />
                        <KpiCard
                            label="Perbelanjaan Bulan Ini"
                            value={fmt(kpis.expenses_this_month)}
                            sub="Semua kategori"
                            mom={kpis.expenses_mom}
                            momInverse
                            color="bg-red-50 text-red-700 border-red-200"
                            href={route('expenses.index')}
                        />
                        <KpiCard
                            label="Untung Bersih Bulan Ini"
                            value={fmt(kpis.net_profit_this_month)}
                            sub={kpis.net_profit_this_month >= 0 ? 'Positif ✓' : 'Negatif !'}
                            mom={kpis.net_profit_mom}
                            color={
                                kpis.net_profit_this_month >= 0
                                    ? 'bg-green-50 text-green-700 border-green-200'
                                    : 'bg-red-50 text-red-700 border-red-200'
                            }
                        />
                        <KpiCard
                            label="Invois Belum Bayar"
                            value={fmt(kpis.unpaid_invoices)}
                            sub={`Komisyen tertangguh: ${fmt(kpis.pending_commissions)}`}
                            color="bg-yellow-50 text-yellow-700 border-yellow-200"
                            href={route('invoices.index')}
                        />
                    </div>

                    {/* ── KPI Row 2 — Counts ── */}
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                        <MiniCard
                            label="Trip Bulan Ini"
                            value={kpis.trips_this_month}
                            mom={kpis.trips_mom}
                            href={route('trips.index')}
                        />
                        <MiniCard
                            label="Kenderaan"
                            value={kpis.total_vehicles}
                            href={route('vehicles.index')}
                        />
                        <MiniCard
                            label="Pemandu"
                            value={kpis.total_drivers}
                            href={route('drivers.index')}
                        />
                        <MiniCard
                            label="Pelanggan"
                            value={kpis.total_customers}
                        />
                        <MiniCard
                            label="Kadar Kutipan"
                            value={`${kpis.collection_rate}%`}
                            sub={`${kpis.paid_invoices_count}/${kpis.total_invoices} invois`}
                            href={route('invoices.index')}
                            valueColor={
                                kpis.collection_rate >= 70
                                    ? 'text-green-700'
                                    : kpis.collection_rate >= 40
                                    ? 'text-yellow-700'
                                    : 'text-red-700'
                            }
                        />
                    </div>

                    {/* ── Vehicle Alerts ── */}
                    {vehicleAlerts.length > 0 && (
                        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                            <h3 className="flex items-center gap-2 text-sm font-semibold text-amber-800 mb-3">
                                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                                Amaran Dokumen Kenderaan ({vehicleAlerts.length})
                            </h3>
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                {vehicleAlerts.map((alert, i) => (
                                    <div
                                        key={i}
                                        className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm ${
                                            alert.is_expired
                                                ? 'border-red-300 bg-red-50 text-red-800'
                                                : 'border-amber-300 bg-white text-amber-800'
                                        }`}
                                    >
                                        <div>
                                            <span className="font-medium">{alert.vehicle}</span>
                                            <span className="mx-1">—</span>
                                            <span>{alert.type}</span>
                                        </div>
                                        <span className="font-bold ml-3 shrink-0">
                                            {alert.is_expired ? 'TAMAT' : `${alert.days_left}h`}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── Charts Row ── */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                        {/* P&L Chart — Revenue, Expenses, Profit with Y-axis */}
                        <div className="lg:col-span-2 overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                                <h3 className="text-sm font-semibold text-gray-800">Hasil vs Perbelanjaan vs Untung (6 Bulan)</h3>
                            </div>
                            <div className="p-6">
                                <div className="flex gap-3">
                                    {/* Y-axis labels */}
                                    <div className="flex flex-col justify-between text-right text-[10px] text-gray-400 shrink-0 w-10 h-40 select-none">
                                        <span>{fmtK(maxChartVal)}</span>
                                        <span>{fmtK(maxChartVal * 0.75)}</span>
                                        <span>{fmtK(maxChartVal * 0.5)}</span>
                                        <span>{fmtK(maxChartVal * 0.25)}</span>
                                        <span>0</span>
                                    </div>
                                    {/* Bar columns */}
                                    <div className="flex-1 flex items-end gap-1.5 border-l border-gray-100 pl-2">
                                        {monthlyTrend.map((m) => (
                                            <div key={m.month} className="flex-1 flex flex-col items-center">
                                                <div className="flex gap-0.5 items-end w-full justify-center h-40">
                                                    <div
                                                        className="w-3 bg-blue-500 rounded-t cursor-default"
                                                        style={{ height: `${(m.revenue / maxChartVal) * 100}%`, minHeight: m.revenue > 0 ? '3px' : '0' }}
                                                        title={`Hasil: ${fmt(m.revenue)}`}
                                                    />
                                                    <div
                                                        className="w-3 bg-red-400 rounded-t cursor-default"
                                                        style={{ height: `${(m.expenses / maxChartVal) * 100}%`, minHeight: m.expenses > 0 ? '3px' : '0' }}
                                                        title={`Belanja: ${fmt(m.expenses)}`}
                                                    />
                                                    <div
                                                        className={`w-3 rounded-t cursor-default ${m.profit >= 0 ? 'bg-emerald-400' : 'bg-orange-400'}`}
                                                        style={{ height: `${(Math.abs(m.profit) / maxChartVal) * 100}%`, minHeight: Math.abs(m.profit) > 0 ? '3px' : '0' }}
                                                        title={`Untung: ${fmt(m.profit)}`}
                                                    />
                                                </div>
                                                <span className="text-[10px] text-gray-500 text-center leading-tight mt-1">{m.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center justify-center gap-5 text-xs text-gray-500">
                                    <span className="flex items-center gap-1.5">
                                        <span className="inline-block w-3 h-3 rounded bg-blue-500" /> Hasil
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <span className="inline-block w-3 h-3 rounded bg-red-400" /> Perbelanjaan
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <span className="inline-block w-3 h-3 rounded bg-emerald-400" /> Untung
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Expense Breakdown */}
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-gray-800">Pecahan Perbelanjaan</h3>
                                <span className="text-xs text-gray-400">Bulan Ini</span>
                            </div>
                            <div className="p-6 space-y-3">
                                {expenseBreakdown.length > 0 ? (
                                    <>
                                        {expenseBreakdown.map((exp) => {
                                            const pct = expenseTotal > 0 ? (Number(exp.total) / expenseTotal) * 100 : 0;
                                            return (
                                                <div key={exp.category}>
                                                    <div className="flex items-center justify-between text-sm mb-1">
                                                        <span className="text-gray-700">{categoryLabels[exp.category] || exp.category}</span>
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="text-xs text-gray-400">{pct.toFixed(0)}%</span>
                                                            <span className="font-medium text-gray-900">{fmt(exp.total)}</span>
                                                        </div>
                                                    </div>
                                                    <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full ${categoryColors[exp.category] || 'bg-gray-400'}`}
                                                            style={{ width: `${pct}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-sm">
                                            <span className="text-gray-500">Jumlah</span>
                                            <span className="font-bold text-gray-900">{fmt(expenseTotal)}</span>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-center text-sm text-gray-500 py-4">Tiada perbelanjaan bulan ini.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ── Data Row — Invoice + Driver Leaderboard + Top Customers ── */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                        {/* Invoice Summary + Overdue List */}
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-gray-800">Ringkasan Invois</h3>
                                <Link href={route('invoices.index')} className="text-xs text-blue-600 hover:text-blue-800">
                                    Lihat Semua →
                                </Link>
                            </div>
                            <div className="p-6 space-y-3">
                                <SummaryRow label="Jumlah Invois" value={invoiceSummary.total} />
                                <SummaryRow label="Telah Bayar" value={invoiceSummary.paid} badge="bg-green-100 text-green-800" />
                                <SummaryRow label="Separa Bayar" value={invoiceSummary.partial} badge="bg-yellow-100 text-yellow-800" />
                                <SummaryRow label="Belum Bayar" value={invoiceSummary.unpaid} badge="bg-red-100 text-red-800" />
                                {invoiceSummary.overdue > 0 && (
                                    <SummaryRow label="Tertunggak" value={invoiceSummary.overdue} badge="bg-red-200 text-red-900 font-bold" />
                                )}

                                {/* Overdue Detail List */}
                                {invoiceSummary.overdue_list?.length > 0 && (
                                    <div className="pt-3 border-t border-red-100">
                                        <p className="text-xs font-semibold text-red-700 mb-2">Invois Tertunggak</p>
                                        <div className="space-y-1.5">
                                            {invoiceSummary.overdue_list.map((inv) => (
                                                <Link
                                                    key={inv.id}
                                                    href={route('invoices.show', inv.id)}
                                                    className="flex items-center justify-between rounded-md bg-red-50 px-3 py-2 hover:bg-red-100 transition"
                                                >
                                                    <div>
                                                        <p className="text-xs font-medium text-gray-800">{inv.customer}</p>
                                                        <p className="text-[10px] text-red-600">{inv.days_overdue} hari tertunggak</p>
                                                    </div>
                                                    <span className="text-xs font-semibold text-red-800 ml-2 shrink-0">{fmt(inv.total_amount)}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Driver Leaderboard */}
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-gray-800">Prestasi Pemandu</h3>
                                <span className="text-xs text-gray-400">Bulan Ini</span>
                            </div>
                            <div className="p-6">
                                {driverLeaderboard.length > 0 ? (
                                    <div className="space-y-3">
                                        {driverLeaderboard.map((driver, i) => (
                                            <div key={i} className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                                                        i === 0 ? 'bg-yellow-100 text-yellow-700' :
                                                        i === 1 ? 'bg-gray-100 text-gray-600'   :
                                                        i === 2 ? 'bg-orange-50 text-orange-600' :
                                                                  'bg-gray-50 text-gray-400'
                                                    }`}>
                                                        {i + 1}
                                                    </span>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">{driver.name}</p>
                                                        <p className="text-xs text-gray-500">
                                                            {driver.trip_count} trip · {driver.commission_rate}% komisyen
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className="text-sm font-semibold text-gray-900 ml-2">{fmt(driver.total_revenue)}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-sm text-gray-500 py-4">Tiada perjalanan bulan ini.</p>
                                )}
                            </div>
                        </div>

                        {/* Top Customers — with period toggle */}
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-gray-800">Pelanggan Tertinggi</h3>
                                <div className="flex overflow-hidden rounded border border-gray-200 text-xs">
                                    <button
                                        onClick={() => setCustomerPeriod('all')}
                                        className={`px-2.5 py-1 transition ${
                                            customerPeriod === 'all'
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-white text-gray-600 hover:bg-gray-50'
                                        }`}
                                    >
                                        Semua
                                    </button>
                                    <button
                                        onClick={() => setCustomerPeriod('month')}
                                        className={`px-2.5 py-1 border-l border-gray-200 transition ${
                                            customerPeriod === 'month'
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-white text-gray-600 hover:bg-gray-50'
                                        }`}
                                    >
                                        Bulan Ini
                                    </button>
                                </div>
                            </div>
                            <div className="p-6">
                                {displayedCustomers.length > 0 ? (
                                    <div className="space-y-3">
                                        {displayedCustomers.map((cust, i) => (
                                            <div key={cust.id} className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                                                        i === 0 ? 'bg-yellow-100 text-yellow-700' :
                                                        i === 1 ? 'bg-gray-100 text-gray-600'   :
                                                                  'bg-orange-50 text-orange-600'
                                                    }`}>
                                                        {i + 1}
                                                    </span>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">{cust.name}</p>
                                                        <p className="text-xs text-gray-500">{cust.trip_count} trip</p>
                                                    </div>
                                                </div>
                                                <span className="text-sm font-semibold text-gray-900 ml-2">{fmt(cust.total_revenue)}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-sm text-gray-500 py-4">
                                        {customerPeriod === 'month' ? 'Tiada data bulan ini.' : 'Tiada data pelanggan.'}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ── Commission Summary ── */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                            <h3 className="text-sm font-semibold text-gray-800">Komisyen Pemandu</h3>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <CommissionStat
                                    label="Menunggu Kelulusan"
                                    value={fmt(commissionSummary.pending_total)}
                                    sub={`${commissionSummary.pending_count} rekod`}
                                    color="text-yellow-700"
                                />
                                <CommissionStat
                                    label="Diluluskan"
                                    value={fmt(commissionSummary.approved_total)}
                                    color="text-blue-700"
                                />
                                <CommissionStat
                                    label="Dibayar Bulan Ini"
                                    value={fmt(commissionSummary.paid_this_month)}
                                    color="text-green-700"
                                />
                            </div>
                        </div>
                    </div>

                    {/* ── Recent Trips ── */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-gray-800">Perjalanan Terkini</h3>
                            <Link href={route('trips.index')} className="text-xs text-blue-600 hover:text-blue-800">
                                Lihat Semua →
                            </Link>
                        </div>
                        <div className="p-6">
                            {recentTrips.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">No. Trip</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Tarikh</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Dari → Ke</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Pelanggan</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Kenderaan</th>
                                                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">Jumlah (RM)</th>
                                                <th className="px-4 py-3 text-center text-xs font-medium uppercase text-gray-500">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {recentTrips.map((trip) => (
                                                <tr key={trip.id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{trip.trip_number}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-700">
                                                        {trip.pickup_date?.split('T')[0] || trip.pickup_date}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-700">
                                                        {trip.pickup_location} → {trip.delivery_location}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-700">{trip.customer?.name || '-'}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-700">{trip.vehicle?.plate_number || '-'}</td>
                                                    <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">
                                                        {fmt(trip.total_revenue)}
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                            trip.payment_status === 'paid'    ? 'bg-green-100 text-green-800'  :
                                                            trip.payment_status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                                                                                                'bg-red-100 text-red-800'
                                                        }`}>
                                                            {trip.payment_status === 'paid'    ? 'Dibayar'     :
                                                             trip.payment_status === 'partial' ? 'Separa'      : 'Belum Bayar'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-center text-sm text-gray-500 py-4">Tiada perjalanan dijumpai.</p>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function PlusIcon() {
    return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
        </svg>
    );
}

function MomBadge({ mom, inverse = false }) {
    if (mom === null || mom === undefined) return null;
    if (mom === 0) return <span className="text-xs text-gray-400">Sama</span>;
    const isUp   = mom > 0;
    const isGood = inverse ? !isUp : isUp;
    return (
        <span className={`text-xs font-medium ${isGood ? 'text-green-600' : 'text-red-500'}`}>
            {isUp ? '↑' : '↓'} {Math.abs(mom)}% vs lalu
        </span>
    );
}

function KpiCard({ label, value, sub, color, mom, momInverse = false, href }) {
    const inner = (
        <div className={`rounded-lg border p-4 ${color} ${href ? 'hover:shadow-md transition' : ''}`}>
            <p className="text-sm font-medium opacity-80">{label}</p>
            <p className="mt-1 text-2xl font-bold">{value}</p>
            <div className="mt-1 flex flex-wrap items-center gap-2">
                <p className="text-xs opacity-60">{sub}</p>
                {mom !== undefined && <MomBadge mom={mom} inverse={momInverse} />}
            </div>
        </div>
    );
    return href ? <Link href={href}>{inner}</Link> : inner;
}

function MiniCard({ label, value, sub, mom, href, valueColor = 'text-gray-900' }) {
    const inner = (
        <div className={`rounded-lg border border-gray-200 bg-white p-3 text-center ${href ? 'hover:shadow-md hover:border-blue-200 transition cursor-pointer' : ''}`}>
            <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
            {sub && <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>}
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            {mom !== undefined && (
                <div className="mt-1 flex justify-center">
                    <MomBadge mom={mom} />
                </div>
            )}
        </div>
    );
    return href ? <Link href={href}>{inner}</Link> : inner;
}

function SummaryRow({ label, value, sub, badge }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{label}</span>
            <div className="flex items-center gap-2">
                {sub && <span className="text-xs text-gray-400">{sub}</span>}
                {badge ? (
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badge}`}>
                        {value}
                    </span>
                ) : (
                    <span className="text-sm font-semibold text-gray-900">{value}</span>
                )}
            </div>
        </div>
    );
}

function CommissionStat({ label, value, sub, color }) {
    return (
        <div className="rounded-lg bg-gray-50 p-4 text-center">
            <p className={`text-xl font-bold ${color}`}>{value}</p>
            {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
            <p className="text-sm text-gray-600 mt-1">{label}</p>
        </div>
    );
}
