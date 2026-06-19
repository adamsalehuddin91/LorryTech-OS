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
    fuel:        'bg-gradient-to-r from-orange-400 to-amber-500',
    toll:        'bg-gradient-to-r from-purple-400 to-indigo-500',
    maintenance: 'bg-gradient-to-r from-blue-400 to-blue-600',
    repair:      'bg-gradient-to-r from-rose-400 to-red-600',
    tyre:        'bg-gradient-to-r from-slate-400 to-slate-600',
    insurance:   'bg-gradient-to-r from-teal-400 to-teal-600',
    roadtax:     'bg-gradient-to-r from-yellow-400 to-yellow-600',
    permit:      'bg-gradient-to-r from-indigo-400 to-indigo-600',
    parking:     'bg-gradient-to-r from-cyan-400 to-cyan-600',
    other:       'bg-gradient-to-r from-gray-400 to-gray-500',
};

// Premium KPI accent palette — solid icon chip + matching colored shadow + soft glow.
const accentStyles = {
    blue:    { chip: 'from-blue-500 to-indigo-600',  shadow: 'shadow-blue-500/30',    glow: 'from-blue-400 to-indigo-500' },
    rose:    { chip: 'from-rose-500 to-red-600',      shadow: 'shadow-rose-500/30',    glow: 'from-rose-400 to-red-500' },
    emerald: { chip: 'from-emerald-500 to-teal-600',  shadow: 'shadow-emerald-500/30', glow: 'from-emerald-400 to-teal-500' },
    amber:   { chip: 'from-amber-500 to-orange-500',  shadow: 'shadow-amber-500/30',   glow: 'from-amber-400 to-orange-500' },
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
        if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`;
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
            header={
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 leading-tight">Papan Pemuka</h2>
                        <p className="text-sm text-gray-500 mt-1">Gambaran keseluruhan operasi dan analitis kewangan logistik anda.</p>
                    </div>
                    {/* Timestamp / Period badge */}
                    <div className="inline-flex items-center gap-1.5 rounded-xl bg-gray-100 px-3.5 py-1.5 text-xs font-semibold text-gray-600 border border-gray-200/50 self-start md:self-auto">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Semasa: Bulan Ini
                    </div>
                </div>
            }
        >
            <Head title="Papan Pemuka" />

            <div className="space-y-6">
                
                {/* ── Quick Actions ── */}
                <div className="flex flex-wrap gap-2 bg-white p-3.5 rounded-2xl border border-gray-200/50 shadow-sm">
                    <Link
                        href={route('trips.create')}
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/10 hover:from-blue-500 hover:to-indigo-500 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                    >
                        <PlusIcon /> Buat Trip Baru
                    </Link>
                    <Link
                        href={route('expenses.create')}
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-orange-500/10 hover:from-orange-400 hover:to-amber-400 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                    >
                        <PlusIcon /> Catat Belanja
                    </Link>
                    <Link
                        href={route('invoices.create')}
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-500/10 hover:from-emerald-500 hover:to-teal-500 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                    >
                        <PlusIcon /> Jana Invois
                    </Link>
                    <Link
                        href={route('quotations.index')}
                        className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    >
                        Sebut Harga
                    </Link>
                    <Link
                        href={route('drivers.index')}
                        className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    >
                        Urus Pemandu
                    </Link>
                </div>

                {/* ── KPI Row 1 — Financial ── */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <KpiCard
                        label="Hasil Bulan Ini"
                        value={fmt(kpis.revenue_this_month)}
                        sub={`${kpis.trips_this_month} trip diselesaikan`}
                        mom={kpis.revenue_mom}
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        }
                        accent="blue"
                        href={route('trips.index')}
                    />
                    <KpiCard
                        label="Perbelanjaan Bulan Ini"
                        value={fmt(kpis.expenses_this_month)}
                        sub="Semua kategori direkodkan"
                        mom={kpis.expenses_mom}
                        momInverse
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                        }
                        accent="rose"
                        href={route('expenses.index')}
                    />
                    <KpiCard
                        label="Untung Bersih"
                        value={fmt(kpis.net_profit_this_month)}
                        sub={kpis.net_profit_this_month >= 0 ? 'Status Aliran Tunai: Positif ✓' : 'Status Aliran Tunai: Negatif !'}
                        mom={kpis.net_profit_mom}
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        }
                        accent={kpis.net_profit_this_month >= 0 ? 'emerald' : 'rose'}
                    />
                    <KpiCard
                        label="Invois Belum Bayar"
                        value={fmt(kpis.unpaid_invoices)}
                        sub={`Komisyen tertangguh: ${fmt(kpis.pending_commissions)}`}
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        }
                        accent="amber"
                        href={route('invoices.index')}
                    />
                </div>

                {/* ── KPI Row 2 — Counts ── */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                    <MiniCard
                        label="Trip Bulan Ini"
                        value={kpis.trips_this_month}
                        mom={kpis.trips_mom}
                        icon="🗺️"
                        href={route('trips.index')}
                    />
                    <MiniCard
                        label="Kenderaan Lorry"
                        value={kpis.total_vehicles}
                        icon="🚚"
                        href={route('vehicles.index')}
                    />
                    <MiniCard
                        label="Jumlah Pemandu"
                        value={kpis.total_drivers}
                        icon="👤"
                        href={route('drivers.index')}
                    />
                    <MiniCard
                        label="Jumlah Pelanggan"
                        value={kpis.total_customers}
                        icon="🏢"
                    />
                    <MiniCard
                        label="Kadar Kutipan Invois"
                        value={`${kpis.collection_rate}%`}
                        sub={`${kpis.paid_invoices_count}/${kpis.total_invoices} invois dibayar`}
                        icon="📈"
                        href={route('invoices.index')}
                        valueColor={
                            kpis.collection_rate >= 70
                                ? 'text-emerald-600'
                                : kpis.collection_rate >= 40
                                ? 'text-amber-600'
                                : 'text-rose-600'
                        }
                    />
                </div>

                {/* ── Vehicle Alerts ── */}
                {vehicleAlerts.length > 0 && (
                    <div className="rounded-2xl border border-amber-200/80 bg-gradient-to-r from-amber-500/5 to-yellow-500/10 p-5 shadow-sm">
                        <h3 className="flex items-center gap-2.5 text-sm font-bold text-amber-800 mb-4">
                            <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600 border border-amber-500/20">
                                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            Amaran Dokumen Kenderaan ({vehicleAlerts.length})
                        </h3>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {vehicleAlerts.map((alert, i) => (
                                <div
                                    key={i}
                                    className={`flex items-center justify-between rounded-xl border px-4 py-3 text-xs transition-all ${
                                        alert.is_expired
                                            ? 'border-red-200 bg-red-500/5 text-red-800 shadow-sm shadow-red-500/5'
                                            : 'border-amber-200 bg-white text-amber-800'
                                    }`}
                                >
                                    <div>
                                        <span className="font-bold text-gray-900">{alert.vehicle}</span>
                                        <span className="mx-2 opacity-50">•</span>
                                        <span className="font-medium">{alert.type}</span>
                                    </div>
                                    <span className={`font-bold ml-3 px-2 py-0.5 rounded-full text-[10px] ${
                                        alert.is_expired
                                            ? 'bg-red-500/10 text-red-600 border border-red-500/20'
                                            : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                                    }`}>
                                        {alert.is_expired ? 'Tamat Tempoh' : `${alert.days_left} hari`}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── Charts Row ── */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                    {/* P&L Chart — Revenue, Expenses, Profit with Y-axis */}
                    <div className="lg:col-span-2 overflow-hidden bg-white border border-gray-200/60 rounded-2xl shadow-sm">
                        <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
                            <h3 className="text-sm font-bold text-gray-800">Perbandingan Hasil vs Perbelanjaan vs Untung (6 Bulan)</h3>
                        </div>
                        <div className="p-6">
                            <div className="flex gap-4">
                                {/* Y-axis labels */}
                                <div className="flex flex-col justify-between text-right text-[10px] text-gray-400 font-semibold shrink-0 w-12 h-44 select-none pr-2">
                                    <span>{fmtK(maxChartVal)}</span>
                                    <span>{fmtK(maxChartVal * 0.75)}</span>
                                    <span>{fmtK(maxChartVal * 0.5)}</span>
                                    <span>{fmtK(maxChartVal * 0.25)}</span>
                                    <span>0</span>
                                </div>
                                {/* Bar columns container */}
                                <div className="flex-1 flex items-end gap-3 border-l border-gray-100 pl-4 h-44 relative">
                                    {/* Horizontal grid lines helper */}
                                    <div className="absolute inset-x-0 top-0 border-t border-dashed border-gray-100 pointer-events-none" />
                                    <div className="absolute inset-x-0 top-1/4 border-t border-dashed border-gray-100 pointer-events-none" />
                                    <div className="absolute inset-x-0 top-2/4 border-t border-dashed border-gray-100 pointer-events-none" />
                                    <div className="absolute inset-x-0 top-3/4 border-t border-dashed border-gray-100 pointer-events-none" />

                                    {monthlyTrend.map((m) => (
                                        <div key={m.month} className="flex-1 flex flex-col items-center z-10 h-full justify-end">
                                            <div className="flex gap-1 items-end w-full justify-center h-full">
                                                <div
                                                    className="w-3.5 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t shadow-sm cursor-default hover:scale-y-[1.05] transition-all origin-bottom duration-200"
                                                    style={{ height: `${(m.revenue / maxChartVal) * 100}%`, minHeight: m.revenue > 0 ? '4px' : '0' }}
                                                    title={`Hasil: ${fmt(m.revenue)}`}
                                                />
                                                <div
                                                    className="w-3.5 bg-gradient-to-t from-rose-500 to-rose-400 rounded-t shadow-sm cursor-default hover:scale-y-[1.05] transition-all origin-bottom duration-200"
                                                    style={{ height: `${(m.expenses / maxChartVal) * 100}%`, minHeight: m.expenses > 0 ? '4px' : '0' }}
                                                    title={`Belanja: ${fmt(m.expenses)}`}
                                                />
                                                <div
                                                    className={`w-3.5 rounded-t shadow-sm cursor-default hover:scale-y-[1.05] transition-all origin-bottom duration-200 ${
                                                        m.profit >= 0 
                                                            ? 'from-emerald-500 to-emerald-400 bg-gradient-to-t' 
                                                            : 'from-orange-500 to-orange-400 bg-gradient-to-t'
                                                    }`}
                                                    style={{ height: `${(Math.abs(m.profit) / maxChartVal) * 100}%`, minHeight: Math.abs(m.profit) > 0 ? '4px' : '0' }}
                                                    title={`Untung: ${fmt(m.profit)}`}
                                                />
                                            </div>
                                            <span className="text-[10px] text-gray-500 text-center font-bold mt-2 select-none">{m.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="mt-6 flex items-center justify-center gap-6 text-xs text-gray-500 border-t border-gray-100 pt-4">
                                <span className="flex items-center gap-2">
                                    <span className="inline-block w-3 h-3 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400" /> Hasil Kasar
                                </span>
                                <span className="flex items-center gap-2">
                                    <span className="inline-block w-3 h-3 rounded-full bg-gradient-to-tr from-rose-500 to-rose-400" /> Perbelanjaan
                                </span>
                                <span className="flex items-center gap-2">
                                    <span className="inline-block w-3 h-3 rounded-full bg-gradient-to-tr from-emerald-500 to-emerald-400" /> Untung Bersih
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Expense Breakdown */}
                    <div className="overflow-hidden bg-white border border-gray-200/60 rounded-2xl shadow-sm flex flex-col justify-between">
                        <div>
                            <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4 flex items-center justify-between">
                                <h3 className="text-sm font-bold text-gray-800">Pecahan Perbelanjaan</h3>
                                <span className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">Bulan Ini</span>
                            </div>
                            <div className="p-6 space-y-4">
                                {expenseBreakdown.length > 0 ? (
                                    <>
                                        {expenseBreakdown.map((exp) => {
                                            const pct = expenseTotal > 0 ? (Number(exp.total) / expenseTotal) * 100 : 0;
                                            return (
                                                <div key={exp.category} className="space-y-1.5">
                                                    <div className="flex items-center justify-between text-xs">
                                                        <span className="text-gray-700 font-semibold">{categoryLabels[exp.category] || exp.category}</span>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[10px] text-gray-400 font-bold">{pct.toFixed(0)}%</span>
                                                            <span className="font-bold text-gray-900">{fmt(exp.total)}</span>
                                                        </div>
                                                    </div>
                                                    <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full transition-all duration-500 ${categoryColors[exp.category] || 'bg-gray-400'}`}
                                                            style={{ width: `${pct}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </>
                                ) : (
                                    <p className="text-center text-xs text-gray-400 py-8">Tiada rekod perbelanjaan dikesan bulan ini.</p>
                                )}
                            </div>
                        </div>
                        {expenseBreakdown.length > 0 && (
                            <div className="p-6 pt-0">
                                <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
                                    <span className="text-gray-500 font-semibold">Jumlah Keseluruhan</span>
                                    <span className="font-extrabold text-gray-900 text-base">{fmt(expenseTotal)}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Data Row — Invoice + Driver Leaderboard + Top Customers ── */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                    {/* Invoice Summary + Overdue List */}
                    <div className="overflow-hidden bg-white border border-gray-200/60 rounded-2xl shadow-sm">
                        <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4 flex items-center justify-between">
                            <h3 className="text-sm font-bold text-gray-800">Status Pengebilan</h3>
                            <Link href={route('invoices.index')} className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors">
                                Lihat Invois →
                            </Link>
                        </div>
                        <div className="p-6 space-y-3.5">
                            <SummaryRow label="Jumlah Invois Dijana" value={invoiceSummary.total} />
                            <SummaryRow label="Invois Dibayar Penuh" value={invoiceSummary.paid} badge="bg-emerald-50 text-emerald-700 border-emerald-100 border" />
                            <SummaryRow label="Bayaran Separa" value={invoiceSummary.partial} badge="bg-amber-50 text-amber-700 border-amber-100 border" />
                            <SummaryRow label="Belum Dibayar" value={invoiceSummary.unpaid} badge="bg-rose-50 text-rose-700 border-rose-100 border" />
                            {invoiceSummary.overdue > 0 && (
                                <SummaryRow label="Tertunggak" value={invoiceSummary.overdue} badge="bg-red-500 text-white font-bold" />
                            )}

                            {/* Overdue Detail List */}
                            {invoiceSummary.overdue_list?.length > 0 && (
                                <div className="pt-4 border-t border-gray-100">
                                    <p className="text-xs font-bold text-red-600 uppercase tracking-wider mb-2.5">Invois Tertunggak Amaran</p>
                                    <div className="space-y-2">
                                        {invoiceSummary.overdue_list.map((inv) => (
                                            <Link
                                                key={inv.id}
                                                href={route('invoices.show', inv.id)}
                                                className="flex items-center justify-between rounded-xl bg-red-500/5 border border-red-500/10 px-3.5 py-2.5 hover:bg-red-500/10 transition-colors group"
                                            >
                                                <div>
                                                    <p className="text-xs font-bold text-gray-900 group-hover:text-red-700 transition-colors">{inv.customer}</p>
                                                    <p className="text-[10px] text-red-500 font-semibold mt-0.5">{inv.days_overdue} hari tertunggak</p>
                                                </div>
                                                <span className="text-xs font-extrabold text-red-600 ml-2 shrink-0">{fmt(inv.total_amount)}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Driver Leaderboard */}
                    <div className="overflow-hidden bg-white border border-gray-200/60 rounded-2xl shadow-sm">
                        <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4 flex items-center justify-between">
                            <h3 className="text-sm font-bold text-gray-800">Prestasi Pemandu Lorry</h3>
                            <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2.5 py-0.5 rounded-full">Bulan Ini</span>
                        </div>
                        <div className="p-6">
                            {driverLeaderboard.length > 0 ? (
                                <div className="space-y-4">
                                    {driverLeaderboard.map((driver, i) => (
                                        <div key={i} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold border ${
                                                    i === 0 ? 'bg-amber-500/10 text-amber-700 border-amber-500/20 shadow-sm' :
                                                    i === 1 ? 'bg-slate-100 text-slate-600 border-slate-200'   :
                                                    i === 2 ? 'bg-orange-50 text-orange-600 border-orange-200' :
                                                              'bg-gray-50 text-gray-400 border-gray-100'
                                                }`}>
                                                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                                                </span>
                                                <div>
                                                    <p className="text-xs font-bold text-gray-900 leading-tight">{driver.name}</p>
                                                    <p className="text-[10px] text-gray-500 mt-0.5">
                                                        {driver.trip_count} trip diselesaikan · {driver.commission_rate}% komisyen
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="text-xs font-extrabold text-gray-900 ml-2">{fmt(driver.total_revenue)}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-xs text-gray-400 py-8">Tiada rekod perjalanan pemandu ditemui.</p>
                            )}
                        </div>
                    </div>

                    {/* Top Customers — with period toggle */}
                    <div className="overflow-hidden bg-white border border-gray-200/60 rounded-2xl shadow-sm">
                        <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4 flex items-center justify-between">
                            <h3 className="text-sm font-bold text-gray-800">Pelanggan Utama</h3>
                            <div className="flex overflow-hidden rounded-xl border border-gray-200 text-[10px] font-bold">
                                <button
                                    onClick={() => setCustomerPeriod('all')}
                                    className={`px-3 py-1 transition-all ${
                                        customerPeriod === 'all'
                                            ? 'bg-blue-600 text-white shadow-inner'
                                            : 'bg-white text-gray-500 hover:bg-gray-50'
                                    }`}
                                >
                                    Semua
                                </button>
                                <button
                                    onClick={() => setCustomerPeriod('month')}
                                    className={`px-3 py-1 border-l border-gray-200 transition-all ${
                                        customerPeriod === 'month'
                                            ? 'bg-blue-600 text-white shadow-inner'
                                            : 'bg-white text-gray-500 hover:bg-gray-50'
                                    }`}
                                >
                                    Bulan Ini
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            {displayedCustomers.length > 0 ? (
                                <div className="space-y-4">
                                    {displayedCustomers.map((cust, i) => (
                                        <div key={cust.id} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold border ${
                                                    i === 0 ? 'bg-amber-100 text-amber-800 border-amber-200' :
                                                    i === 1 ? 'bg-slate-100 text-slate-600 border-slate-200'   :
                                                              'bg-orange-50 text-orange-700 border-orange-200'
                                                }`}>
                                                    {i + 1}
                                                </span>
                                                <div>
                                                    <p className="text-xs font-bold text-gray-900 leading-tight">{cust.name}</p>
                                                    <p className="text-[10px] text-gray-500 mt-0.5">{cust.trip_count} trip dilaksanakan</p>
                                                </div>
                                            </div>
                                            <span className="text-xs font-extrabold text-gray-900 ml-2">{fmt(cust.total_revenue)}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-xs text-gray-400 py-8">
                                    {customerPeriod === 'month' ? 'Tiada data jualan bulan ini.' : 'Tiada data pelanggan direkodkan.'}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── Commission Summary ── */}
                <div className="overflow-hidden bg-white border border-gray-200/60 rounded-2xl shadow-sm">
                    <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
                        <h3 className="text-sm font-bold text-gray-800">Ringkasan Komisyen Pemandu</h3>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <CommissionStat
                                label="Menunggu Kelulusan"
                                value={fmt(commissionSummary.pending_total)}
                                sub={`${commissionSummary.pending_count} rekod resit/trip`}
                                color="text-amber-600"
                                badgeColor="bg-amber-500/10 text-amber-700 border-amber-200"
                            />
                            <CommissionStat
                                label="Diluluskan (Belum Bayar)"
                                value={fmt(commissionSummary.approved_total)}
                                sub="Menunggu proses penggajian"
                                color="text-indigo-600"
                                badgeColor="bg-indigo-500/10 text-indigo-700 border-indigo-200"
                            />
                            <CommissionStat
                                label="Telah Dibayar Bulan Ini"
                                value={fmt(commissionSummary.paid_this_month)}
                                sub="Selesai transaksi bayaran"
                                color="text-emerald-600"
                                badgeColor="bg-emerald-500/10 text-emerald-700 border-emerald-200"
                            />
                        </div>
                    </div>
                </div>

                {/* ── Recent Trips ── */}
                <div className="overflow-hidden bg-white border border-gray-200/60 rounded-2xl shadow-sm">
                    <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4 flex items-center justify-between">
                        <h3 className="text-sm font-bold text-gray-800">Senarai Perjalanan Terkini</h3>
                        <Link href={route('trips.index')} className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors">
                            Lihat Semua Trip →
                        </Link>
                    </div>
                    <div className="p-6">
                        {recentTrips.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-100">
                                    <thead>
                                        <tr className="bg-gray-50/50">
                                            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">No. Trip</th>
                                            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Tarikh</th>
                                            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Laluan (Dari → Ke)</th>
                                            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Pelanggan</th>
                                            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Lorry No</th>
                                            <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-gray-400">Hasil Bersih</th>
                                            <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-wider text-gray-400">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100/80">
                                        {recentTrips.map((trip) => (
                                            <tr key={trip.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-4 py-3 text-xs font-bold text-gray-900">{trip.trip_number}</td>
                                                <td className="px-4 py-3 text-xs text-gray-600">
                                                    {trip.pickup_date?.split('T')[0] || trip.pickup_date}
                                                </td>
                                                <td className="px-4 py-3 text-xs font-medium text-gray-800">
                                                    {trip.pickup_location} → {trip.delivery_location}
                                                </td>
                                                <td className="px-4 py-3 text-xs text-gray-600 font-medium">{trip.customer?.name || '-'}</td>
                                                <td className="px-4 py-3 text-xs text-gray-500 font-semibold">{trip.vehicle?.plate_number || '-'}</td>
                                                <td className="px-4 py-3 text-xs text-right font-bold text-gray-900">
                                                    {fmt(trip.total_revenue)}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold border ${
                                                        trip.payment_status === 'paid'    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'  :
                                                        trip.payment_status === 'partial' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                                                            'bg-rose-50 text-rose-700 border-rose-200'
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
                            <p className="text-center text-xs text-gray-400 py-8">Tiada perjalanan yang dijumpai.</p>
                        )}
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function PlusIcon() {
    return (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
        </svg>
    );
}

function MomBadge({ mom, inverse = false }) {
    if (mom === null || mom === undefined) return null;
    if (mom === 0) return <span className="text-[10px] font-bold text-gray-400 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-full">Sama</span>;
    const isUp   = mom > 0;
    const isGood = inverse ? !isUp : isUp;
    return (
        <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
            isGood 
                ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
                : 'bg-rose-500/10 text-rose-600 border-rose-500/20'
        }`}>
            {isUp ? '↑' : '↓'} {Math.abs(mom)}% m-o-m
        </span>
    );
}

function KpiCard({ label, value, sub, accent = 'blue', mom, momInverse = false, href, icon }) {
    const a = accentStyles[accent] || accentStyles.blue;
    const inner = (
        <div className="group relative h-full overflow-hidden rounded-2xl border border-gray-200/70 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gray-200/60">
            {/* Soft corner glow in the accent colour */}
            <div className={`pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br ${a.glow} opacity-[0.08] blur-2xl transition-opacity duration-300 group-hover:opacity-20`} />

            <div className="relative flex items-start justify-between">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${a.chip} text-white shadow-lg ${a.shadow} transition-transform duration-300 group-hover:scale-105`}>
                    {icon}
                </div>
                {mom !== undefined && <MomBadge mom={mom} inverse={momInverse} />}
            </div>

            <p className="relative mt-4 text-[11px] font-bold uppercase tracking-wider text-gray-400 leading-tight">{label}</p>
            <p className="relative mt-1 text-[1.6rem] font-extrabold leading-tight tracking-tight text-gray-900">{value}</p>
            {sub && <p className="relative mt-2 text-[11px] font-semibold text-gray-400 leading-tight">{sub}</p>}
        </div>
    );
    return href ? <Link href={href} className="block h-full">{inner}</Link> : inner;
}

function MiniCard({ label, value, sub, mom, href, valueColor = 'text-gray-900', icon }) {
    const inner = (
        <div className="group h-full rounded-2xl border border-gray-200/70 bg-white p-4 text-center shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md">
            {icon && (
                <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-xl border border-gray-100 bg-gray-50 text-base transition-colors duration-300 group-hover:bg-gray-100">
                    {icon}
                </div>
            )}
            <p className={`text-2xl font-extrabold tracking-tight ${valueColor}`}>{value}</p>
            {sub && <p className="text-[9px] text-gray-400 font-bold mt-1 leading-tight">{sub}</p>}
            <p className="text-[10px] text-gray-500 font-bold mt-1.5 uppercase tracking-wide leading-none">{label}</p>
            {mom !== undefined && (
                <div className="mt-2.5 flex justify-center">
                    <MomBadge mom={mom} />
                </div>
            )}
        </div>
    );
    return href ? <Link href={href}>{inner}</Link> : inner;
}

function SummaryRow({ label, value, sub, badge }) {
    return (
        <div className="flex items-center justify-between border-b border-gray-50 pb-2.5 last:border-b-0 last:pb-0">
            <span className="text-xs text-gray-500 font-semibold">{label}</span>
            <div className="flex items-center gap-2">
                {sub && <span className="text-[10px] text-gray-400 font-bold">{sub}</span>}
                {badge ? (
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold ${badge}`}>
                        {value}
                    </span>
                ) : (
                    <span className="text-xs font-bold text-gray-900">{value}</span>
                )}
            </div>
        </div>
    );
}

function CommissionStat({ label, value, sub, color, badgeColor }) {
    return (
        <div className="group rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-200/70 p-4 text-center flex flex-col justify-between shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
            <div>
                <p className={`text-xl font-extrabold tracking-tight ${color}`}>{value}</p>
                {sub && <p className="text-[10px] text-gray-400 font-semibold mt-1 leading-normal">{sub}</p>}
            </div>
            <div className="mt-3 flex justify-center">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}>
                    {label}
                </span>
            </div>
        </div>
    );
}
