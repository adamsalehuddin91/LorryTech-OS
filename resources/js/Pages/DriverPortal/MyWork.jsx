import DriverLayout from '@/Layouts/DriverLayout';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';

const TRIP_STATUS = {
    unpaid: { label: 'Belum Bayar', cls: 'bg-red-100 text-red-700' },
    paid:   { label: 'Telah Bayar', cls: 'bg-green-100 text-green-700' },
};

const JOB_STATUS = {
    pending:  { label: 'Menunggu',  cls: 'bg-yellow-100 text-yellow-700' },
    verified: { label: 'Disahkan',  cls: 'bg-green-100 text-green-700' },
    rejected: { label: 'Ditolak',   cls: 'bg-red-100 text-red-700' },
};

export default function MyWork({ trips, jobs, filters }) {
    const [tab, setTab]     = useState(filters?.tab || 'log');
    const [month, setMonth] = useState(filters?.month || '');

    const switchTab = (t) => {
        setTab(t);
        router.get(route('driver.work'), { tab: t, month }, { preserveState: true, preserveScroll: true });
    };

    const handleMonth = (value) => {
        setMonth(value);
        router.get(route('driver.work'), { tab, month: value }, { preserveState: true, preserveScroll: true });
    };

    const totalVerifiedComm = jobs.data
        ?.filter(j => j.status === 'verified')
        .reduce((s, j) => s + Number(j.commission_amount), 0) || 0;

    return (
        <DriverLayout title="Kerja Saya">
            {/* Header */}
            <div className="bg-gradient-to-br from-blue-700 to-blue-900 px-5 pt-6 pb-4">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h1 className="text-white text-xl font-bold">Kerja Saya</h1>
                        <p className="text-blue-200 text-xs mt-0.5">
                            {tab === 'log'
                                ? `Komisyen disahkan: RM ${totalVerifiedComm.toFixed(2)}`
                                : `${trips.total ?? 0} tugasan dijumpai`}
                        </p>
                    </div>
                    {tab === 'log' && (
                        <Link
                            href={route('driver.log-job')}
                            className="flex items-center gap-1.5 bg-white text-blue-700 text-sm font-bold px-4 py-2 rounded-xl shadow"
                        >
                            + Log Kerja
                        </Link>
                    )}
                </div>

                {/* Tab switcher */}
                <div className="flex bg-white/20 rounded-xl p-1 gap-1">
                    <button
                        onClick={() => switchTab('log')}
                        className={`flex-1 text-sm font-semibold py-2 rounded-lg transition-all ${
                            tab === 'log' ? 'bg-white text-blue-700 shadow-sm' : 'text-white/80'
                        }`}
                    >
                        Log Saya
                    </button>
                    <button
                        onClick={() => switchTab('tugasan')}
                        className={`flex-1 text-sm font-semibold py-2 rounded-lg transition-all ${
                            tab === 'tugasan' ? 'bg-white text-blue-700 shadow-sm' : 'text-white/80'
                        }`}
                    >
                        Tugasan
                    </button>
                </div>

                {/* Month filter — Tugasan tab only */}
                {tab === 'tugasan' && (
                    <div className="mt-3">
                        <input
                            type="month"
                            value={month}
                            onChange={(e) => handleMonth(e.target.value)}
                            className="w-full rounded-xl bg-white/20 text-white px-4 py-2.5 text-sm border-0 focus:outline-none focus:ring-2 focus:ring-white/40"
                        />
                    </div>
                )}
            </div>

            <div className="px-5 mt-4 space-y-3">
                {tab === 'log' ? (
                    jobs.data?.length > 0 ? (
                        <>
                            {jobs.data.map((job) => {
                                const s = JOB_STATUS[job.status] || { label: job.status, cls: 'bg-gray-100 text-gray-700' };
                                return (
                                    <div key={job.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-semibold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                                                    {job.job_type_label}
                                                </span>
                                                <span className="text-xs text-gray-400">{job.job_date}</span>
                                            </div>
                                            <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${s.cls}`}>
                                                {s.label}
                                            </span>
                                        </div>

                                        <div className="space-y-1 my-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                                                <p className="text-sm text-gray-800 truncate">{job.pickup_location}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                                                <p className="text-sm text-gray-800 truncate">{job.delivery_location}</p>
                                            </div>
                                            {job.customer_name && (
                                                <p className="text-xs text-gray-400 pl-4">👤 {job.customer_name}</p>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                            <p className="text-xs text-gray-400">
                                                RM {Number(job.gross_amount).toFixed(2)} × {Number(job.commission_rate).toFixed(1)}%
                                            </p>
                                            <p className={`text-base font-bold ${job.status === 'verified' ? 'text-green-600' : 'text-gray-700'}`}>
                                                RM {Number(job.commission_amount).toFixed(2)}
                                            </p>
                                        </div>

                                        {job.status === 'rejected' && job.rejection_reason && (
                                            <div className="mt-2 bg-red-50 rounded-xl px-3 py-2">
                                                <p className="text-xs text-red-600">Sebab: {job.rejection_reason}</p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                            <PaginationLinks links={jobs.links} />
                        </>
                    ) : (
                        <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
                            <p className="text-4xl mb-3">🚚</p>
                            <p className="text-gray-500 text-sm font-medium">Belum ada kerja dilog</p>
                            <Link href={route('driver.log-job')} className="mt-3 inline-block text-sm text-blue-600 font-semibold">
                                Log kerja pertama →
                            </Link>
                        </div>
                    )
                ) : (
                    trips.data?.length > 0 ? (
                        <>
                            {trips.data.map((trip) => {
                                const s = TRIP_STATUS[trip.payment_status] || { label: trip.payment_status, cls: 'bg-gray-100 text-gray-700' };
                                return (
                                    <div key={trip.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                                        <div className="flex items-start justify-between mb-3">
                                            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                                                {trip.trip_number}
                                            </span>
                                            <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${s.cls}`}>
                                                {s.label}
                                            </span>
                                        </div>

                                        <div className="space-y-1.5">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                                                <p className="text-sm text-gray-800 font-medium truncate">{trip.pickup_location}</p>
                                            </div>
                                            <div className="pl-[5px]">
                                                <div className="border-l-2 border-dashed border-gray-300 h-3 ml-[1px]" />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                                                <p className="text-sm text-gray-800 truncate">{trip.delivery_location}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                                            <div className="flex items-center gap-2 text-xs text-gray-400 flex-wrap">
                                                <span>{trip.pickup_date?.split('T')[0] || trip.pickup_date}</span>
                                                {trip.vehicle?.plate_number && <><span>•</span><span>{trip.vehicle.plate_number}</span></>}
                                                {trip.customer?.name && <><span>•</span><span>{trip.customer.name}</span></>}
                                            </div>
                                            <p className="text-base font-bold text-gray-900 ml-2 flex-shrink-0">
                                                RM {Number(trip.total_revenue).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                            <PaginationLinks links={trips.links} />
                        </>
                    ) : (
                        <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
                            <p className="text-gray-400 text-sm">Tiada tugasan dijumpai</p>
                            {month && (
                                <button onClick={() => handleMonth('')} className="mt-2 text-sm text-blue-600">
                                    Papar semua
                                </button>
                            )}
                        </div>
                    )
                )}
            </div>
        </DriverLayout>
    );
}

function PaginationLinks({ links }) {
    if (!links?.length) return null;
    return (
        <div className="flex justify-center gap-1 pb-2 flex-wrap">
            {links.map((link, i) => (
                <Link
                    key={i}
                    href={link.url || '#'}
                    className={`px-3 py-1.5 rounded-lg text-sm ${link.active ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200'} ${!link.url ? 'opacity-40 pointer-events-none' : ''}`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                />
            ))}
        </div>
    );
}
