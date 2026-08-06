import DriverLayout from '@/Layouts/DriverLayout';
import StatusBadge from '@/Components/StatusBadge';
import PaginationLinks from '@/Components/PaginationLinks';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';

const TRIP_STATUS = {
    unpaid: { label: 'Belum Bayar', cls: 'bg-rose-500/10 text-rose-400 border border-rose-500/20' },
    paid:   { label: 'Telah Bayar', cls: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' },
};

const JOB_STATUS = {
    pending:  { label: 'Menunggu',  cls: 'bg-amber-500/10 text-amber-400 border border-amber-500/20' },
    verified: { label: 'Disahkan',  cls: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' },
    rejected: { label: 'Ditolak',   cls: 'bg-rose-500/10 text-rose-400 border border-rose-500/20' },
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
            <div className="bg-gradient-to-b from-blue-900/35 via-indigo-950/15 to-transparent px-5 pt-8 pb-5">
                <div className="flex items-start justify-between mb-5">
                    <div>
                        <h1 className="text-white text-xl font-extrabold tracking-tight">Kerja Saya</h1>
                        <p className="text-blue-300/70 text-xs font-medium mt-1">
                            {tab === 'log'
                                ? `Komisyen disahkan: RM ${totalVerifiedComm.toFixed(2)}`
                                : `${trips.total ?? 0} tugasan dijumpai`}
                        </p>
                    </div>
                    {tab === 'log' && (
                        <Link
                            href={route('driver.log-job')}
                            className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold px-4 py-2 rounded-xl shadow-lg shadow-blue-500/20"
                        >
                            + Log Kerja
                        </Link>
                    )}
                </div>

                {/* Tab switcher */}
                <div className="flex bg-white/[0.04] border border-white/[0.06] rounded-2xl p-1 gap-1">
                    <button
                        onClick={() => switchTab('log')}
                        className={`flex-1 text-sm font-semibold py-2 rounded-xl transition-all ${
                            tab === 'log' ? 'bg-white/[0.08] text-white shadow-sm' : 'text-gray-400'
                        }`}
                    >
                        Log Saya
                    </button>
                    <button
                        onClick={() => switchTab('tugasan')}
                        className={`flex-1 text-sm font-semibold py-2 rounded-xl transition-all ${
                            tab === 'tugasan' ? 'bg-white/[0.08] text-white shadow-sm' : 'text-gray-400'
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
                            className="w-full rounded-xl bg-white/[0.04] border border-white/[0.06] text-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        />
                    </div>
                )}
            </div>

            <div className="px-5 mt-1 space-y-3 relative z-10">
                {tab === 'log' ? (
                    jobs.data?.length > 0 ? (
                        <>
                            {jobs.data.map((job) => {
                                return (
                                    <div key={job.id} className="bg-white/[0.02] border border-white/[0.06] backdrop-blur-md rounded-3xl p-4 shadow-xl">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full">
                                                    {job.job_type_label}
                                                </span>
                                                {job.vehicle_plate && (
                                                    <span className="text-xs font-semibold bg-white/[0.05] text-gray-300 px-2 py-0.5 rounded-full">
                                                        🚛 {job.vehicle_plate}
                                                    </span>
                                                )}
                                                <span className="text-xs text-gray-500">{job.job_date}</span>
                                            </div>
                                            <StatusBadge status={job.status} map={JOB_STATUS} />
                                        </div>

                                        <div className="space-y-1 my-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                                                <p className="text-sm text-gray-300 truncate">{job.pickup_location}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                                                <p className="text-sm text-gray-300 truncate">{job.delivery_location}</p>
                                            </div>
                                            {job.customer_name && (
                                                <p className="text-xs text-gray-500 pl-4">👤 {job.customer_name}</p>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                                            <p className="text-xs text-gray-500">
                                                RM {Number(job.gross_amount).toFixed(2)} × {Number(job.commission_rate).toFixed(1)}%
                                            </p>
                                            <p className={`text-base font-bold ${job.status === 'verified' ? 'text-emerald-400' : 'text-white'}`}>
                                                RM {Number(job.commission_amount).toFixed(2)}
                                            </p>
                                        </div>

                                        {job.status === 'rejected' && job.rejection_reason && (
                                            <div className="mt-2 bg-rose-500/10 border border-rose-500/20 rounded-xl px-3 py-2">
                                                <p className="text-xs text-rose-400">Sebab: {job.rejection_reason}</p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                            <PaginationLinks links={jobs.links} />
                        </>
                    ) : (
                        <div className="bg-white/[0.01] rounded-3xl py-12 text-center border border-dashed border-white/[0.06]">
                            <p className="text-3xl mb-3 opacity-60">🚚</p>
                            <p className="text-gray-400 text-sm font-medium">Belum ada kerja dilog</p>
                            <Link href={route('driver.log-job')} className="mt-3 inline-block text-sm text-blue-400 font-semibold">
                                Log kerja pertama →
                            </Link>
                        </div>
                    )
                ) : (
                    trips.data?.length > 0 ? (
                        <>
                            {trips.data.map((trip) => {
                                return (
                                    <div key={trip.id} className="bg-white/[0.02] border border-white/[0.06] backdrop-blur-md rounded-3xl p-4 shadow-xl">
                                        <div className="flex items-start justify-between mb-3">
                                            <span className="text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full">
                                                {trip.trip_number}
                                            </span>
                                            <StatusBadge status={trip.payment_status} map={TRIP_STATUS} />
                                        </div>

                                        <div className="space-y-1.5">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                                                <p className="text-sm text-gray-300 font-medium truncate">{trip.pickup_location}</p>
                                            </div>
                                            <div className="pl-[5px]">
                                                <div className="border-l-2 border-dashed border-white/[0.1] h-3 ml-[1px]" />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                                                <p className="text-sm text-gray-300 truncate">{trip.delivery_location}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.06]">
                                            <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
                                                <span>{trip.pickup_date?.split('T')[0] || trip.pickup_date}</span>
                                                {trip.vehicle?.plate_number && <><span>•</span><span>{trip.vehicle.plate_number}</span></>}
                                                {trip.customer?.name && <><span>•</span><span>{trip.customer.name}</span></>}
                                            </div>
                                            <p className="text-base font-bold text-white ml-2 flex-shrink-0">
                                                RM {Number(trip.total_revenue).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                            <PaginationLinks links={trips.links} />
                        </>
                    ) : (
                        <div className="bg-white/[0.01] rounded-3xl py-12 text-center border border-dashed border-white/[0.06]">
                            <p className="text-gray-500 text-sm">Tiada tugasan dijumpai</p>
                            {month && (
                                <button onClick={() => handleMonth('')} className="mt-2 text-sm text-blue-400">
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
