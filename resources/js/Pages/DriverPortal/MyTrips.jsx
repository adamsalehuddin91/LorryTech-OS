import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function MyTrips({ trips, filters }) {
    const [month, setMonth] = useState(filters?.month || '');

    const handleMonthChange = (value) => {
        setMonth(value);
        router.get(route('driver.trips'), { month: value }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const paymentBadge = (status) => {
        const map = {
            unpaid: 'bg-red-100 text-red-800',
            paid: 'bg-green-100 text-green-800',
        };
        const labelMap = {
            unpaid: 'Belum Bayar',
            paid: 'Telah Bayar',
        };
        return (
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${map[status] || 'bg-gray-100 text-gray-800'}`}>
                {labelMap[status] || status}
            </span>
        );
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Perjalanan Saya</h2>}
        >
            <Head title="Perjalanan Saya" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Filter */}
                            <div className="mb-6 flex items-center gap-3">
                                <label className="text-sm font-medium text-gray-700">Bulan:</label>
                                <input
                                    type="month"
                                    value={month}
                                    onChange={(e) => handleMonthChange(e.target.value)}
                                    className="rounded-lg border-gray-300 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                                {month && (
                                    <button
                                        onClick={() => handleMonthChange('')}
                                        className="text-sm text-gray-500 hover:text-gray-700"
                                    >
                                        Papar semua
                                    </button>
                                )}
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">No. Trip</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Tarikh</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Dari</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Ke</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Kenderaan</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Pelanggan</th>
                                            <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">Jumlah (RM)</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {trips.data?.length > 0 ? (
                                            trips.data.map((trip) => (
                                                <tr key={trip.id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{trip.trip_number}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-700">{trip.pickup_date?.split('T')[0] || trip.pickup_date}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-700">{trip.pickup_location}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-700">{trip.delivery_location}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-700">{trip.vehicle?.plate_number || '-'}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-700">{trip.customer?.name || '-'}</td>
                                                    <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">
                                                        RM {Number(trip.total_revenue).toFixed(2)}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm">{paymentBadge(trip.payment_status)}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="8" className="px-4 py-8 text-center text-sm text-gray-500">
                                                    Tiada perjalanan dijumpai.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {trips.links && (
                                <div className="flex justify-center gap-1 mt-6">
                                    {trips.links.map((link, i) => (
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
