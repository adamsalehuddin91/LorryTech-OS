import DriverLayout from '@/Layouts/DriverLayout';
import { Link } from '@inertiajs/react';

const STATUS = {
    pending:  { label: 'Menunggu',   cls: 'bg-yellow-100 text-yellow-700' },
    verified: { label: 'Disahkan',   cls: 'bg-green-100 text-green-700' },
    rejected: { label: 'Ditolak',    cls: 'bg-red-100 text-red-700' },
};

export default function MyJobs({ jobs }) {
    const totalComm = jobs.data?.filter(j => j.status === 'verified')
        .reduce((s, j) => s + Number(j.commission_amount), 0) || 0;

    return (
        <DriverLayout title="Kerja Saya">
            <div className="bg-gradient-to-br from-blue-700 to-blue-900 px-5 pt-12 pb-6">
                <h1 className="text-white text-xl font-bold">Kerja Saya</h1>
                <div className="flex items-end justify-between mt-4">
                    <div>
                        <p className="text-blue-200 text-xs">Komisyen Disahkan</p>
                        <p className="text-white text-2xl font-bold mt-0.5">RM {totalComm.toFixed(2)}</p>
                    </div>
                    <Link
                        href={route('driver.log-job')}
                        className="flex items-center gap-2 bg-white text-blue-700 text-sm font-bold px-4 py-2 rounded-xl shadow"
                    >
                        + Log Kerja
                    </Link>
                </div>
            </div>

            <div className="px-5 mt-4 space-y-3">
                {jobs.data?.length > 0 ? (
                    <>
                        {jobs.data.map((job) => {
                            const s = STATUS[job.status] || { label: job.status, cls: 'bg-gray-100 text-gray-700' };
                            return (
                                <div key={job.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-semibold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                                                {job.job_type_label}
                                            </span>
                                            <span className="text-xs text-gray-400">{job.job_date}</span>
                                        </div>
                                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${s.cls}`}>{s.label}</span>
                                    </div>

                                    <div className="space-y-1 my-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                                            <p className="text-sm text-slate-300 truncate">{job.pickup_location}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                                            <p className="text-sm text-slate-300 truncate">{job.delivery_location}</p>
                                        </div>
                                        {job.customer_name && (
                                            <p className="text-xs text-gray-400 pl-4">👤 {job.customer_name}</p>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                        <div className="text-xs text-gray-400">
                                            <span>RM {Number(job.gross_amount).toFixed(2)}</span>
                                            <span className="mx-1">×</span>
                                            <span>{Number(job.commission_rate).toFixed(1)}%</span>
                                        </div>
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

                        {jobs.links && (
                            <div className="flex justify-center gap-1 pb-2">
                                {jobs.links.map((link, i) => (
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
                        <p className="text-4xl mb-3">🚚</p>
                        <p className="text-gray-500 text-sm font-medium">Belum ada kerja dilog</p>
                        <Link href={route('driver.log-job')} className="mt-3 inline-block text-sm text-blue-600 font-semibold">
                            Log kerja pertama →
                        </Link>
                    </div>
                )}
            </div>
        </DriverLayout>
    );
}
