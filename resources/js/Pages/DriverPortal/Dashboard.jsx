import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ stats, recentTrips, driverName }) {
    if (!stats) {
        return (
            <AuthenticatedLayout
                header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Papan Pemuka Pemandu</h2>}
            >
                <Head title="Papan Pemuka" />
                <div className="py-12">
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <div className="bg-white p-6 rounded-lg shadow-sm text-center text-gray-500">
                            Akaun pemandu belum dikonfigurasi. Sila hubungi pemilik.
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    const statCards = [
        { label: 'Perjalanan Bulan Ini', value: stats.trips_this_month, sub: `${stats.total_trips} jumlah`, color: 'bg-blue-50 text-blue-700 border-blue-200' },
        { label: 'Komisyen Bulan Ini', value: `RM ${Number(stats.commission_this_month).toFixed(2)}`, sub: `Kadar: ${stats.commission_rate}%`, color: 'bg-green-50 text-green-700 border-green-200' },
        { label: 'Komisyen Belum Bayar', value: `RM ${Number(stats.pending_commission).toFixed(2)}`, sub: `Jumlah diterima: RM ${Number(stats.total_earned).toFixed(2)}`, color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
        { label: 'Resit Dimuat Naik', value: stats.receipts_this_month, sub: 'Bulan ini', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    ];

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Selamat Datang, {driverName}
                </h2>
            }
        >
            <Head title="Papan Pemuka Pemandu" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    {/* Stat Cards */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {statCards.map((card) => (
                            <div key={card.label} className={`rounded-lg border p-4 ${card.color}`}>
                                <p className="text-sm font-medium opacity-80">{card.label}</p>
                                <p className="mt-1 text-2xl font-bold">{card.value}</p>
                                <p className="mt-1 text-xs opacity-60">{card.sub}</p>
                            </div>
                        ))}
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <Link
                            href={route('driver.upload-receipt')}
                            className="flex items-center gap-3 rounded-lg bg-blue-600 p-4 text-white shadow-sm hover:bg-blue-700 transition-colors"
                        >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <div>
                                <p className="font-semibold">Muat Naik Resit</p>
                                <p className="text-sm opacity-80">Snap gambar resit</p>
                            </div>
                        </Link>
                        <Link
                            href={route('driver.trips')}
                            className="flex items-center gap-3 rounded-lg bg-white border border-gray-200 p-4 text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
                        >
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                            </svg>
                            <div>
                                <p className="font-semibold">Perjalanan Saya</p>
                                <p className="text-sm text-gray-500">Lihat semua trip</p>
                            </div>
                        </Link>
                        <Link
                            href={route('driver.commissions')}
                            className="flex items-center gap-3 rounded-lg bg-white border border-gray-200 p-4 text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
                        >
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                                <p className="font-semibold">Komisyen</p>
                                <p className="text-sm text-gray-500">Semak pendapatan</p>
                            </div>
                        </Link>
                    </div>

                    {/* Recent Trips */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                            <h3 className="text-lg font-semibold text-gray-800">Perjalanan Terkini</h3>
                        </div>
                        <div className="p-6">
                            {recentTrips?.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">No. Trip</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Tarikh</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Dari / Ke</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Kenderaan</th>
                                                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">Jumlah (RM)</th>
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
                                                    <td className="px-4 py-3 text-sm text-gray-700">{trip.vehicle?.plate_number || '-'}</td>
                                                    <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">
                                                        RM {Number(trip.total_revenue).toFixed(2)}
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
