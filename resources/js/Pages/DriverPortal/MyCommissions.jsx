import DriverLayout from '@/Layouts/DriverLayout';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';

const STATUS_MAP = {
    pending:  { label: 'Menunggu',   cls: 'bg-yellow-100 text-yellow-700' },
    approved: { label: 'Diluluskan', cls: 'bg-blue-100 text-blue-700' },
    paid:     { label: 'Dibayar',    cls: 'bg-green-100 text-green-700' },
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
            <div className="bg-gradient-to-br from-blue-700 to-blue-900 px-5 pt-12 pb-6">
                <h1 className="text-white text-xl font-bold">Komisyen Saya</h1>

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
                                    className={`rounded-xl px-4 py-3 text-left transition-all ${
                                        month === item.month
                                            ? 'bg-white text-blue-700 shadow-md'
                                            : 'bg-white/20 text-white'
                                    }`}
                                >
                                    <p className="text-xs font-medium opacity-80">{item.month}</p>
                                    <p className="text-base font-bold mt-0.5">RM {Number(item.total).toFixed(0)}</p>
                                    <p className="text-xs opacity-60 mt-0.5">{item.trip_count} trip</p>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Filters */}
            <div className="px-5 mt-4 flex gap-2">
                <select
                    value={status}
                    onChange={(e) => { setStatus(e.target.value); applyFilters({ status: e.target.value }); }}
                    className="flex-1 rounded-xl border border-gray-200 bg-white text-sm px-3 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Semua Status</option>
                    <option value="pending">Menunggu</option>
                    <option value="approved">Diluluskan</option>
                    <option value="paid">Dibayar</option>
                </select>
                {(month || status) && (
                    <button
                        onClick={() => { setMonth(''); setStatus(''); applyFilters({ month: '', status: '' }); }}
                        className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-500"
                    >
                        Reset
                    </button>
                )}
            </div>

            {/* Summary Bar */}
            {commissions.data?.length > 0 && (
                <div className="mx-5 mt-3 bg-blue-50 rounded-xl px-4 py-3 flex justify-between items-center">
                    <p className="text-sm text-blue-700">{commissions.total} rekod</p>
                    <p className="text-sm font-bold text-blue-800">RM {totalThisFilter.toFixed(2)}</p>
                </div>
            )}

            {/* Commission Cards */}
            <div className="px-5 mt-3 space-y-3">
                {commissions.data?.length > 0 ? (
                    <>
                        {commissions.data.map((comm) => {
                            const s = STATUS_MAP[comm.status] || { label: comm.status, cls: 'bg-gray-100 text-gray-700' };
                            return (
                                <div key={comm.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <p className="text-xs text-gray-400">{comm.month}</p>
                                            <p className="text-sm font-semibold text-gray-900 mt-0.5">
                                                {comm.trip?.trip_number || 'Trip'}
                                            </p>
                                        </div>
                                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${s.cls}`}>{s.label}</span>
                                    </div>
                                    <div className="flex items-end justify-between mt-3 pt-3 border-t border-gray-100">
                                        <div className="text-xs text-gray-400 space-y-0.5">
                                            <p>Hasil trip: RM {Number(comm.trip_revenue).toFixed(2)}</p>
                                            <p>Kadar: {Number(comm.commission_rate).toFixed(1)}%</p>
                                            {comm.paid_date && <p>Dibayar: {comm.paid_date?.split('T')[0] || comm.paid_date}</p>}
                                        </div>
                                        <p className="text-xl font-bold text-green-600">RM {Number(comm.commission_amount).toFixed(2)}</p>
                                    </div>
                                </div>
                            );
                        })}

                        {commissions.links && (
                            <div className="flex justify-center gap-1 pb-2">
                                {commissions.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url || '#'}
                                        className={`px-3 py-1.5 rounded-lg text-sm ${link.active ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200'} ${!link.url ? 'opacity-40 pointer-events-none' : ''}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
                        <p className="text-gray-400 text-sm">Tiada rekod komisyen dijumpai</p>
                    </div>
                )}
            </div>
        </DriverLayout>
    );
}
