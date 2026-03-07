import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ vehicle }) {
    const isExpiringSoon = (dateStr) => {
        if (!dateStr) return false;
        const expiry = new Date(dateStr);
        const now = new Date();
        const diffDays = (expiry - now) / (1000 * 60 * 60 * 24);
        return diffDays < 30;
    };

    const isExpired = (dateStr) => {
        if (!dateStr) return false;
        return new Date(dateStr) < new Date();
    };

    const statusBadge = (statusVal) => {
        const map = {
            aktif: 'bg-green-100 text-green-800',
            penyelenggaraan: 'bg-yellow-100 text-yellow-800',
            tidak_aktif: 'bg-red-100 text-red-800',
        };
        const labelMap = {
            aktif: 'Aktif',
            penyelenggaraan: 'Penyelenggaraan',
            tidak_aktif: 'Tidak Aktif',
        };
        const classes = map[statusVal] || 'bg-gray-100 text-gray-800';
        const label = labelMap[statusVal] || statusVal;
        return (
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${classes}`}>
                {label}
            </span>
        );
    };

    const expiryLabel = (dateStr, label) => {
        if (!dateStr) return { text: 'Tidak ditetapkan', color: 'text-gray-400' };
        if (isExpired(dateStr)) return { text: `${dateStr} — TAMAT TEMPOH`, color: 'text-red-600 font-bold' };
        if (isExpiringSoon(dateStr)) return { text: `${dateStr} — Hampir tamat`, color: 'text-red-600 font-semibold' };
        return { text: dateStr, color: 'text-gray-900' };
    };

    const roadtax = expiryLabel(vehicle.roadtax_expiry);
    const insurance = expiryLabel(vehicle.insurance_expiry);
    const permit = expiryLabel(vehicle.permit_expiry);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Maklumat Kenderaan
                    </h2>
                    <div className="flex gap-2">
                        <Link
                            href={route('vehicles.edit', vehicle.id)}
                            className="rounded-lg bg-yellow-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-yellow-600"
                        >
                            Ubah
                        </Link>
                        <Link
                            href={route('vehicles.index')}
                            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                        >
                            Kembali
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Kenderaan - ${vehicle.plate_number}`} />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8 space-y-6">
                    {/* Vehicle Details Card */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                            <h3 className="text-lg font-semibold text-gray-800">Butiran Kenderaan</h3>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">No. Pendaftaran</dt>
                                    <dd className="mt-1 text-lg font-bold text-gray-900">{vehicle.plate_number}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                                    <dd className="mt-1">{statusBadge(vehicle.status)}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Model</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{vehicle.model || '-'}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Tahun</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{vehicle.year || '-'}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Kapasiti (kg)</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {vehicle.capacity ? Number(vehicle.capacity).toLocaleString() + ' kg' : '-'}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Perbatuan Semasa</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {vehicle.current_mileage ? Number(vehicle.current_mileage).toLocaleString() + ' km' : '-'}
                                    </dd>
                                </div>
                            </div>
                            {vehicle.notes && (
                                <div className="mt-6 border-t pt-4">
                                    <dt className="text-sm font-medium text-gray-500">Nota</dt>
                                    <dd className="mt-1 text-sm text-gray-900 whitespace-pre-line">{vehicle.notes}</dd>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Document Expiry Card */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                            <h3 className="text-lg font-semibold text-gray-800">Tarikh Luput Dokumen</h3>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                                <div className="rounded-lg border p-4">
                                    <dt className="text-sm font-medium text-gray-500">Cukai Jalan</dt>
                                    <dd className={`mt-1 text-sm ${roadtax.color}`}>{roadtax.text}</dd>
                                </div>
                                <div className="rounded-lg border p-4">
                                    <dt className="text-sm font-medium text-gray-500">Insurans</dt>
                                    <dd className={`mt-1 text-sm ${insurance.color}`}>{insurance.text}</dd>
                                </div>
                                <div className="rounded-lg border p-4">
                                    <dt className="text-sm font-medium text-gray-500">Permit APAD</dt>
                                    <dd className={`mt-1 text-sm ${permit.color}`}>{permit.text}</dd>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Assignments Card */}
                    {vehicle.assignments && vehicle.assignments.length > 0 && (
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                                <h3 className="text-lg font-semibold text-gray-800">Tugasan Terkini</h3>
                            </div>
                            <div className="p-6">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Pemandu</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Laluan</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Tarikh</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {vehicle.assignments.map((assignment) => (
                                                <tr key={assignment.id}>
                                                    <td className="px-4 py-3 text-sm text-gray-900">{assignment.driver_name || '-'}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-700">{assignment.route || '-'}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-700">{assignment.date || '-'}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-700">{assignment.status || '-'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Maintenance History Card */}
                    {vehicle.maintenance_history && vehicle.maintenance_history.length > 0 && (
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                                <h3 className="text-lg font-semibold text-gray-800">Sejarah Penyelenggaraan</h3>
                            </div>
                            <div className="p-6">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Tarikh</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Jenis</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Keterangan</th>
                                                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">Kos (RM)</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {vehicle.maintenance_history.map((record) => (
                                                <tr key={record.id}>
                                                    <td className="px-4 py-3 text-sm text-gray-900">{record.date || '-'}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-700">{record.type || '-'}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-700">{record.description || '-'}</td>
                                                    <td className="px-4 py-3 text-sm text-right text-gray-700">
                                                        {record.cost ? Number(record.cost).toLocaleString('ms-MY', { minimumFractionDigits: 2 }) : '-'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
