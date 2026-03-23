import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function MyCommissions({ commissions, monthlySummary, filters }) {
    const [month, setMonth] = useState(filters?.month || '');
    const [status, setStatus] = useState(filters?.status || '');

    const applyFilters = (overrides = {}) => {
        router.get(route('driver.commissions'), { month, status, ...overrides }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const statusBadge = (val) => {
        const map = {
            pending: 'bg-yellow-100 text-yellow-800',
            approved: 'bg-blue-100 text-blue-800',
            paid: 'bg-green-100 text-green-800',
        };
        const labelMap = {
            pending: 'Menunggu',
            approved: 'Diluluskan',
            paid: 'Dibayar',
        };
        return (
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${map[val] || 'bg-gray-100 text-gray-800'}`}>
                {labelMap[val] || val}
            </span>
        );
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Komisyen Saya</h2>}
        >
            <Head title="Komisyen Saya" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    {/* Monthly Summary Cards */}
                    {monthlySummary?.length > 0 && (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                            {monthlySummary.map((item) => (
                                <div key={item.month} className="rounded-lg border border-gray-200 bg-white p-4 text-center shadow-sm">
                                    <p className="text-xs font-medium text-gray-500">{item.month}</p>
                                    <p className="mt-1 text-lg font-bold text-gray-900">RM {Number(item.total).toFixed(2)}</p>
                                    <p className="text-xs text-gray-400">{item.trip_count} trip</p>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Filters */}
                            <div className="mb-6 flex flex-wrap items-center gap-3">
                                <label className="text-sm font-medium text-gray-700">Bulan:</label>
                                <input
                                    type="month"
                                    value={month}
                                    onChange={(e) => {
                                        setMonth(e.target.value);
                                        applyFilters({ month: e.target.value });
                                    }}
                                    className="rounded-lg border-gray-300 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                                <select
                                    value={status}
                                    onChange={(e) => {
                                        setStatus(e.target.value);
                                        applyFilters({ status: e.target.value });
                                    }}
                                    className="rounded-lg border-gray-300 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="">Semua Status</option>
                                    <option value="pending">Menunggu</option>
                                    <option value="approved">Diluluskan</option>
                                    <option value="paid">Dibayar</option>
                                </select>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Bulan</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">No. Trip</th>
                                            <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">Hasil Trip (RM)</th>
                                            <th className="px-4 py-3 text-center text-xs font-medium uppercase text-gray-500">Kadar (%)</th>
                                            <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">Komisyen (RM)</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Tarikh Bayar</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {commissions.data?.length > 0 ? (
                                            commissions.data.map((comm) => (
                                                <tr key={comm.id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 text-sm text-gray-700">{comm.month}</td>
                                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                                        {comm.trip?.trip_number || '-'}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-right text-gray-700">
                                                        RM {Number(comm.trip_revenue).toFixed(2)}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-center text-gray-700">
                                                        {Number(comm.commission_rate).toFixed(1)}%
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-right font-bold text-gray-900">
                                                        RM {Number(comm.commission_amount).toFixed(2)}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm">{statusBadge(comm.status)}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-700">
                                                        {comm.paid_date?.split('T')[0] || comm.paid_date || '-'}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="7" className="px-4 py-8 text-center text-sm text-gray-500">
                                                    Tiada rekod komisyen dijumpai.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {commissions.links && (
                                <div className="flex justify-center gap-1 mt-6">
                                    {commissions.links.map((link, i) => (
                                        <Link
                                            key={i}
                                            href={link.url || '#'}
                                            className={`px-3 py-1 rounded text-sm ${link.active ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'} ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            children={link.label.replace(/&laquo;/g, '\u00AB').replace(/&raquo;/g, '\u00BB')}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
