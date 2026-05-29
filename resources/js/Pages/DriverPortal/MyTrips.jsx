import DriverLayout from '@/Layouts/DriverLayout';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';

const STATUS_MAP = {
    unpaid: { label: 'Belum Bayar', cls: 'bg-red-100 text-red-700' },
    paid:   { label: 'Telah Bayar', cls: 'bg-green-100 text-green-700' },
};

export default function MyTrips({ trips, filters }) {
    const [month, setMonth] = useState(filters?.month || '');

    const handleMonth = (value) => {
        setMonth(value);
        router.get(route('driver.trips'), { month: value }, { preserveState: true, preserveScroll: true });
    };

    return (
        <DriverLayout title="Perjalanan Saya">
            {/* Header */}
            <div className="bg-gradient-to-br from-blue-700 to-blue-900 px-5 pt-12 pb-6">
                <h1 className="text-white text-xl font-bold">Perjalanan Saya</h1>
                <p className="text-blue-200 text-sm mt-1">{trips.total ?? 0} rekod dijumpai</p>

                {/* Month filter */}
                <div className="mt-4">
                    <input
                        type="month"
                        value={month}
                        onChange={(e) => handleMonth(e.target.value)}
                        className="w-full rounded-xl bg-white/20 text-white placeholder-blue-200 px-4 py-2.5 text-sm border-0 focus:outline-none focus:ring-2 focus:ring-white/40"
                    />
                </div>
            </div>

            <div className="px-5 mt-4 space-y-3">
                {trips.data?.length > 0 ? (
                    <>
                        {trips.data.map((trip) => {
                            const status = STATUS_MAP[trip.payment_status] || { label: trip.payment_status, cls: 'bg-gray-100 text-gray-700' };
                            return (
                                <div key={trip.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                                    <div className="flex items-start justify-between mb-3">
                                        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                                            {trip.trip_number}
                                        </span>
                                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${status.cls}`}>
                                            {status.label}
                                        </span>
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                                            <p className="text-sm text-slate-300 font-medium truncate">{trip.pickup_location}</p>
                                        </div>
                                        <div className="flex items-center gap-2 pl-0.5">
                                            <div className="w-1 border-l-2 border-dashed border-gray-300 h-3 ml-0.5" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                                            <p className="text-sm text-slate-300 truncate">{trip.delivery_location}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                                        <div className="flex items-center gap-3 text-xs text-gray-400">
                                            <span>{trip.pickup_date?.split('T')[0] || trip.pickup_date}</span>
                                            <span>•</span>
                                            <span>{trip.vehicle?.plate_number || '-'}</span>
                                            {trip.customer?.name && <><span>•</span><span>{trip.customer.name}</span></>}
                                        </div>
                                        <p className="text-base font-bold text-gray-900">RM {Number(trip.total_revenue).toFixed(2)}</p>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Pagination */}
                        {trips.links && (
                            <div className="flex justify-center gap-1 pb-2">
                                {trips.links.map((link, i) => (
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
                        <p className="text-gray-400 text-sm">Tiada perjalanan dijumpai</p>
                        {month && (
                            <button onClick={() => handleMonth('')} className="mt-2 text-sm text-blue-600">
                                Papar semua
                            </button>
                        )}
                    </div>
                )}
            </div>
        </DriverLayout>
    );
}
