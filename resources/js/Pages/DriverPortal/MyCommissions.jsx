import DriverLayout from '@/Layouts/DriverLayout';
import StatusBadge from '@/Components/StatusBadge';
import PaginationLinks from '@/Components/PaginationLinks';
import { router } from '@inertiajs/react';
import { useState } from 'react';

const STATUS_MAP = {
    pending:  { label: 'Menunggu',   cls: 'bg-amber-500/10 text-amber-400 border border-amber-500/20' },
    approved: { label: 'Diluluskan', cls: 'bg-blue-500/10 text-blue-400 border border-blue-500/20' },
    paid:     { label: 'Dibayar',    cls: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' },
};

export default function MyCommissions({ commissions, monthlySummary, filters }) {
    const [month, setMonth] = useState(filters?.month || '');
    const [status, setStatus] = useState(filters?.status || '');

    const applyFilters = (overrides = {}) => {
        router.get(route('driver.commissions'), { month, status, ...overrides }, { preserveState: true, preserveScroll: true });
    };

    const totalThisFilter = commissions.data?.reduce((s, c) => s + Number(c.commission_amount), 0) || 0;

    return (
        <DriverLayout title="Komisyen Saya">
            {/* Header */}
            <div className="bg-gradient-to-b from-blue-900/35 via-indigo-950/15 to-transparent px-5 pt-8 pb-6">
                <h1 className="text-white text-2xl font-extrabold tracking-tight">Komisyen Saya</h1>

                {/* Monthly Summary Horizontal Scroll */}
                {monthlySummary?.length > 0 && (
                    <div className="mt-4 -mx-5 px-5 overflow-x-auto pb-2">
                        <div className="flex gap-3" style={{ width: 'max-content' }}>
                            {monthlySummary.map((item) => (
                                <button
                                    key={item.month}
                                    onClick={() => {
                                        const val = item.month === month ? '' : item.month;
                                        setMonth(val);
                                        applyFilters({ month: val });
                                    }}
                                    className={`rounded-xl px-4 py-3 text-left transition-all border ${
                                        month === item.month
                                            ? 'bg-gradient-to-br from-blue-600/25 to-indigo-600/25 border-blue-500/30 text-white shadow-md'
                                            : 'bg-white/[0.03] border-white/[0.06] text-gray-300'
                                    }`}
                                >
                                    <p className="text-xs font-medium opacity-70">{item.month}</p>
                                    <p className="text-base font-bold mt-0.5">RM {Number(item.total).toFixed(0)}</p>
                                    <p className="text-xs opacity-50 mt-0.5">{item.trip_count} trip</p>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Filters */}
            <div className="px-5 -mt-1.5 flex gap-2 relative z-10">
                <select
                    value={status}
                    onChange={(e) => { setStatus(e.target.value); applyFilters({ status: e.target.value }); }}
                    className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.03] text-sm px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                    <option value="">Semua Status</option>
                    <option value="pending">Menunggu</option>
                    <option value="approved">Diluluskan</option>
                    <option value="paid">Dibayar</option>
                </select>
                {(month || status) && (
                    <button
                        onClick={() => { setMonth(''); setStatus(''); applyFilters({ month: '', status: '' }); }}
                        className="px-3 py-2 rounded-xl border border-white/[0.08] bg-white/[0.03] text-sm text-gray-400"
                    >
                        Reset
                    </button>
                )}
            </div>

            {/* Summary Bar */}
            {commissions.data?.length > 0 && (
                <div className="mx-5 mt-3 bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-3 flex justify-between items-center relative z-10">
                    <p className="text-sm text-blue-300">{commissions.total} rekod</p>
                    <p className="text-sm font-bold text-blue-200">RM {totalThisFilter.toFixed(2)}</p>
                </div>
            )}

            {/* Commission Cards */}
            <div className="px-5 mt-3 space-y-3 relative z-10">
                {commissions.data?.length > 0 ? (
                    <>
                        {commissions.data.map((comm) => {
                            return (
                                <div key={comm.id} className="bg-white/[0.02] border border-white/[0.06] backdrop-blur-md rounded-3xl p-4 shadow-xl">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <p className="text-xs text-gray-500">{comm.month}</p>
                                            <p className="text-sm font-semibold text-white mt-0.5">
                                                {comm.trip?.trip_number || 'Trip'}
                                            </p>
                                        </div>
                                        <StatusBadge status={comm.status} map={STATUS_MAP} />
                                    </div>
                                    <div className="flex items-end justify-between mt-3 pt-3 border-t border-white/[0.06]">
                                        <div className="text-xs text-gray-500 space-y-0.5">
                                            <p>Hasil trip: RM {Number(comm.trip_revenue).toFixed(2)}</p>
                                            <p>Kadar: {Number(comm.commission_rate).toFixed(1)}%</p>
                                            {comm.paid_date && <p>Dibayar: {comm.paid_date?.split('T')[0] || comm.paid_date}</p>}
                                        </div>
                                        <p className="text-xl font-bold text-emerald-400">RM {Number(comm.commission_amount).toFixed(2)}</p>
                                    </div>
                                </div>
                            );
                        })}

                        <PaginationLinks links={commissions.links} />
                    </>
                ) : (
                    <div className="bg-white/[0.01] rounded-3xl py-12 text-center border border-dashed border-white/[0.06]">
                        <p className="text-gray-500 text-sm">Tiada rekod komisyen dijumpai</p>
                    </div>
                )}
            </div>
        </DriverLayout>
    );
}
