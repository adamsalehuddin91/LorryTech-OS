import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

const STATUS_TABS = [
    { value: 'pending',  label: 'Pending' },
    { value: 'verified', label: 'Disahkan' },
    { value: 'rejected', label: 'Ditolak' },
    { value: 'all',      label: 'Semua' },
];

const JOB_TYPE = {
    lalamove: { label: 'Lalamove', cls: 'bg-orange-100 text-orange-700' },
    side_job:  { label: 'Job Tepi', cls: 'bg-purple-100 text-purple-700' },
};

const STATUS_BADGE = {
    pending:  'bg-yellow-100 text-yellow-700',
    verified: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
};

function RejectModal({ job, onClose, onConfirm }) {
    const [reason, setReason] = useState('');
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
                <h3 className="text-base font-bold text-gray-900 mb-1">Tolak Job</h3>
                <p className="text-sm text-gray-500 mb-4">{job.driver_name} — {job.job_date}</p>
                <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Sebab penolakan (optional)"
                    rows={3}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
                />
                <div className="flex gap-3 mt-4">
                    <button onClick={onClose} className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600">
                        Batal
                    </button>
                    <button
                        onClick={() => onConfirm(reason)}
                        className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-bold text-white"
                    >
                        Tolak Job
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function Index({ jobs, counts, filters }) {
    const [activeStatus, setActiveStatus] = useState(filters?.status || 'pending');
    const [rejectTarget, setRejectTarget] = useState(null);
    const [imageModal, setImageModal] = useState(null);

    const switchTab = (status) => {
        setActiveStatus(status);
        router.get(route('driver-jobs.index'), { status }, { preserveState: true });
    };

    const handleVerify = (id) => {
        router.patch(route('driver-jobs.verify', id), {}, {
            preserveScroll: true,
        });
    };

    const handleReject = (id, reason) => {
        router.patch(route('driver-jobs.reject', id), { reason }, {
            preserveScroll: true,
            onSuccess: () => setRejectTarget(null),
        });
    };

    return (
        <AuthenticatedLayout header={
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">Semak Kerja Pemandu</h2>
                <Link href={route('driver-jobs.map')} className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700">🗺️ Peta Hari Ini</Link>
            </div>
        }>
            <Head title="Semak Kerja Pemandu" />

            {/* Image Modal */}
            {imageModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setImageModal(null)}>
                    <img src={imageModal} alt="Proof" className="max-w-full max-h-full rounded-xl shadow-2xl" />
                </div>
            )}

            {/* Reject Modal */}
            {rejectTarget && (
                <RejectModal
                    job={rejectTarget}
                    onClose={() => setRejectTarget(null)}
                    onConfirm={(reason) => handleReject(rejectTarget.id, reason)}
                />
            )}

            {/* Status Tabs */}
            <div className="flex gap-1 mb-6 bg-gray-100 rounded-xl p-1 w-fit">
                {STATUS_TABS.map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => switchTab(tab.value)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            activeStatus === tab.value ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        {tab.label}
                        {tab.value !== 'all' && counts[tab.value] > 0 && (
                            <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${
                                tab.value === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-200 text-gray-600'
                            }`}>
                                {counts[tab.value]}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Jobs Table */}
            {jobs.data?.length > 0 ? (
                <div className="space-y-3">
                    {jobs.data.map((job) => {
                        const jt = JOB_TYPE[job.job_type] || { label: job.job_type, cls: 'bg-gray-100 text-gray-600' };
                        return (
                            <div key={job.id} className="bg-white rounded-xl border border-gray-200 p-4">
                                <div className="flex items-start justify-between flex-wrap gap-2">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${jt.cls}`}>{jt.label}</span>
                                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_BADGE[job.status]}`}>
                                            {job.status === 'pending' ? 'Pending' : job.status === 'verified' ? 'Disahkan' : 'Ditolak'}
                                        </span>
                                        <span className="text-sm font-semibold text-gray-900">{job.driver_name}</span>
                                        <span className="text-xs text-gray-400">{job.job_date}</span>
                                    </div>
                                    <p className="text-lg font-bold text-gray-900">RM {Number(job.commission_amount).toFixed(2)}</p>
                                </div>

                                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                                        {job.pickup_location}
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                                        {job.delivery_location}
                                    </div>
                                </div>
                                {job.distance_km && (
                                    <p className="mt-2 text-xs font-bold text-blue-600">🚗 {job.distance_km} km{job.duration_min ? ` · ~${job.duration_min} min` : ''} <span className="font-normal text-gray-400">(anggaran)</span></p>
                                )}

                                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400">
                                    <span>Jumlah: RM {Number(job.gross_amount).toFixed(2)}</span>
                                    <span>Kadar: {Number(job.commission_rate).toFixed(1)}%</span>
                                    {job.customer_name && <span>👤 {job.customer_name}</span>}
                                    {job.notes && <span>📝 {job.notes}</span>}
                                </div>

                                <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
                                    <div className="flex items-center gap-2">
                                        {job.proof_image && (
                                            <button
                                                onClick={() => setImageModal(job.proof_image)}
                                                className="text-xs text-blue-600 underline"
                                            >
                                                📎 Lihat bukti
                                            </button>
                                        )}
                                        {job.status === 'rejected' && job.rejection_reason && (
                                            <span className="text-xs text-red-500">Sebab: {job.rejection_reason}</span>
                                        )}
                                        {job.status === 'verified' && job.verified_at && (
                                            <span className="text-xs text-green-600">✓ Disahkan {job.verified_at}</span>
                                        )}
                                    </div>

                                    {job.status === 'pending' && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setRejectTarget(job)}
                                                className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 text-xs font-medium hover:bg-red-50"
                                            >
                                                Tolak
                                            </button>
                                            <button
                                                onClick={() => handleVerify(job.id)}
                                                className="px-4 py-1.5 rounded-lg bg-green-600 text-white text-xs font-bold hover:bg-green-700"
                                            >
                                                Sahkan ✓
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {/* Pagination */}
                    {jobs.links && (
                        <div className="flex justify-center gap-1 mt-4">
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
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                    <p className="text-gray-400 text-sm">Tiada job {activeStatus === 'all' ? '' : activeStatus} dijumpai</p>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
