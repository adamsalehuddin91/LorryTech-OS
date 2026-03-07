import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

const categoryLabels = {
    fuel: 'Bahan Api',
    toll: 'Tol',
    maintenance: 'Penyelenggaraan',
    repair: 'Pembaikan',
    tyre: 'Tayar',
    insurance: 'Insurans',
    roadtax: 'Cukai Jalan',
    permit: 'Permit',
    parking: 'Parking',
    other: 'Lain-lain',
};

const categoryColors = {
    fuel: 'bg-orange-500',
    toll: 'bg-purple-500',
    maintenance: 'bg-blue-500',
    repair: 'bg-red-500',
    tyre: 'bg-gray-500',
    insurance: 'bg-teal-500',
    roadtax: 'bg-yellow-500',
    permit: 'bg-indigo-500',
    parking: 'bg-cyan-500',
    other: 'bg-gray-400',
};

export default function Dashboard({
    kpis,
    monthlyTrend,
    expenseBreakdown,
    topCustomers,
    vehicleAlerts,
    recentTrips,
    invoiceSummary,
    commissionSummary,
}) {
    const fmt = (v) => `RM ${Number(v || 0).toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    // Chart bar max for scaling
    const maxChartVal = Math.max(
        ...monthlyTrend.map((m) => Math.max(m.revenue, m.expenses)),
        1
    );

    // Expense breakdown total for percentage
    const expenseTotal = expenseBreakdown.reduce((sum, e) => sum + Number(e.total), 0);

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Papan Pemuka</h2>}
        >
            <Head title="Papan Pemuka" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">

                    {/* KPI Cards Row 1 — Financial */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <KpiCard
                            label="Hasil Bulan Ini"
                            value={fmt(kpis.revenue_this_month)}
                            sub={`${kpis.trips_this_month} trip`}
                            color="bg-blue-50 text-blue-700 border-blue-200"
                        />
                        <KpiCard
                            label="Perbelanjaan Bulan Ini"
                            value={fmt(kpis.expenses_this_month)}
                            sub="Semua kategori"
                            color="bg-red-50 text-red-700 border-red-200"
                        />
                        <KpiCard
                            label="Untung Bersih Bulan Ini"
                            value={fmt(kpis.net_profit_this_month)}
                            sub={kpis.net_profit_this_month >= 0 ? 'Positif' : 'Negatif'}
                            color={kpis.net_profit_this_month >= 0
                                ? 'bg-green-50 text-green-700 border-green-200'
                                : 'bg-red-50 text-red-700 border-red-200'
                            }
                        />
                        <KpiCard
                            label="Invois Belum Bayar"
                            value={fmt(kpis.unpaid_invoices)}
                            sub={`Komisyen tertangguh: ${fmt(kpis.pending_commissions)}`}
                            color="bg-yellow-50 text-yellow-700 border-yellow-200"
                        />
                    </div>

                    {/* KPI Cards Row 2 — Counts */}
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                        <MiniCard label="Jumlah Trip" value={kpis.total_trips} />
                        <MiniCard label="Kenderaan" value={kpis.total_vehicles} />
                        <MiniCard label="Pemandu" value={kpis.total_drivers} />
                        <MiniCard label="Pelanggan" value={kpis.total_customers} />
                    </div>

                    {/* Vehicle Alerts */}
                    {vehicleAlerts.length > 0 && (
                        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                            <h3 className="flex items-center gap-2 text-sm font-semibold text-amber-800 mb-3">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                                Amaran Dokumen Kenderaan
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
                                        <span className="font-bold">
                                            {alert.is_expired
                                                ? 'TAMAT'
                                                : `${alert.days_left} hari`}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Monthly P&L Bar Chart */}
                        <div className="lg:col-span-2 overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                                <h3 className="text-sm font-semibold text-gray-800">Hasil vs Perbelanjaan (6 Bulan)</h3>
                            </div>
                            <div className="p-6">
                                <div className="flex items-end gap-3 h-48">
                                    {monthlyTrend.map((m) => (
                                        <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                                            <div className="flex gap-1 items-end w-full justify-center h-40">
                                                <div
                                                    className="w-5 bg-blue-500 rounded-t"
                                                    style={{ height: `${(m.revenue / maxChartVal) * 100}%`, minHeight: m.revenue > 0 ? '4px' : '0' }}
                                                    title={`Hasil: ${fmt(m.revenue)}`}
                                                />
                                                <div
                                                    className="w-5 bg-red-400 rounded-t"
                                                    style={{ height: `${(m.expenses / maxChartVal) * 100}%`, minHeight: m.expenses > 0 ? '4px' : '0' }}
                                                    title={`Belanja: ${fmt(m.expenses)}`}
                                                />
                                            </div>
                                            <span className="text-xs text-gray-500 text-center leading-tight">{m.label}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 flex items-center justify-center gap-6 text-xs text-gray-500">
                                    <span className="flex items-center gap-1.5">
                                        <span className="inline-block w-3 h-3 rounded bg-blue-500" /> Hasil
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <span className="inline-block w-3 h-3 rounded bg-red-400" /> Perbelanjaan
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Expense Breakdown */}
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                                <h3 className="text-sm font-semibold text-gray-800">Pecahan Perbelanjaan (Bulan Ini)</h3>
                            </div>
                            <div className="p-6 space-y-3">
                                {expenseBreakdown.length > 0 ? (
                                    expenseBreakdown.map((exp) => {
                                        const pct = expenseTotal > 0 ? (Number(exp.total) / expenseTotal) * 100 : 0;
                                        return (
                                            <div key={exp.category}>
                                                <div className="flex items-center justify-between text-sm mb-1">
                                                    <span className="text-gray-700">{categoryLabels[exp.category] || exp.category}</span>
                                                    <span className="font-medium text-gray-900">{fmt(exp.total)}</span>
                                                </div>
                                                <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${categoryColors[exp.category] || 'bg-gray-400'}`}
                                                        style={{ width: `${pct}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p className="text-center text-sm text-gray-500 py-4">Tiada perbelanjaan bulan ini.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row — Invoice Summary + Commissions + Top Customers */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Invoice Summary */}
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                                <h3 className="text-sm font-semibold text-gray-800">Ringkasan Invois</h3>
                            </div>
                            <div className="p-6 space-y-3">
                                <SummaryRow label="Jumlah Invois" value={invoiceSummary.total} />
                                <SummaryRow label="Telah Bayar" value={invoiceSummary.paid} badge="bg-green-100 text-green-800" />
                                <SummaryRow label="Separa Bayar" value={invoiceSummary.partial} badge="bg-yellow-100 text-yellow-800" />
                                <SummaryRow label="Belum Bayar" value={invoiceSummary.unpaid} badge="bg-red-100 text-red-800" />
                                {invoiceSummary.overdue > 0 && (
                                    <SummaryRow label="Tertunggak" value={invoiceSummary.overdue} badge="bg-red-200 text-red-900 font-bold" />
                                )}
                            </div>
                        </div>

                        {/* Commission Summary */}
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                                <h3 className="text-sm font-semibold text-gray-800">Komisyen Pemandu</h3>
                            </div>
                            <div className="p-6 space-y-3">
                                <SummaryRow label="Menunggu Kelulusan" value={fmt(commissionSummary.pending_total)} sub={`${commissionSummary.pending_count} rekod`} />
                                <SummaryRow label="Diluluskan" value={fmt(commissionSummary.approved_total)} />
                                <SummaryRow label="Dibayar Bulan Ini" value={fmt(commissionSummary.paid_this_month)} />
                            </div>
                        </div>

                        {/* Top Customers */}
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                                <h3 className="text-sm font-semibold text-gray-800">Pelanggan Tertinggi</h3>
                            </div>
                            <div className="p-6">
                                {topCustomers.length > 0 ? (
                                    <div className="space-y-3">
                                        {topCustomers.map((cust, i) => (
                                            <div key={cust.id} className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                                                        i === 0 ? 'bg-yellow-100 text-yellow-700' :
                                                        i === 1 ? 'bg-gray-100 text-gray-600' :
                                                        'bg-orange-50 text-orange-600'
                                                    }`}>
                                                        {i + 1}
                                                    </span>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">{cust.name}</p>
                                                        <p className="text-xs text-gray-500">{cust.trip_count} trip</p>
                                                    </div>
                                                </div>
                                                <span className="text-sm font-semibold text-gray-900">{fmt(cust.total_revenue)}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-sm text-gray-500 py-4">Tiada data pelanggan.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Recent Trips */}
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
                                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Dari / Ke</th>
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
                                                    <td className="px-4 py-3 text-sm text-gray-700">{trip.pickup_date?.split('T')[0] || trip.pickup_date}</td>
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
                                                            trip.payment_status === 'paid'
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-red-100 text-red-800'
                                                        }`}>
                                                            {trip.payment_status === 'paid' ? 'Dibayar' : 'Belum'}
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

function KpiCard({ label, value, sub, color }) {
    return (
        <div className={`rounded-lg border p-4 ${color}`}>
            <p className="text-sm font-medium opacity-80">{label}</p>
            <p className="mt-1 text-2xl font-bold">{value}</p>
            <p className="mt-1 text-xs opacity-60">{sub}</p>
        </div>
    );
}

function MiniCard({ label, value }) {
    return (
        <div className="rounded-lg border border-gray-200 bg-white p-3 text-center">
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500">{label}</p>
        </div>
    );
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
