import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Show({ trip }) {
    const handleDelete = () => {
        if (confirm('Adakah anda pasti mahu memadam perjalanan ini?')) {
            router.delete(route('trips.destroy', trip.id));
        }
    };

    const sourceBadge = (sourceVal) => {
        const map = {
            lalamove: 'bg-blue-100 text-blue-800',
            side_job: 'bg-green-100 text-green-800',
        };
        const labelMap = {
            lalamove: 'Lalamove',
            side_job: 'Kerja Sampingan',
        };
        const classes = map[sourceVal] || 'bg-gray-100 text-gray-800';
        const label = labelMap[sourceVal] || sourceVal;
        return (
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${classes}`}>
                {label}
            </span>
        );
    };

    const paymentBadge = (statusVal) => {
        const map = {
            unpaid: 'bg-red-100 text-red-800',
            partial: 'bg-yellow-100 text-yellow-800',
            paid: 'bg-green-100 text-green-800',
        };
        const labelMap = {
            unpaid: 'Belum Bayar',
            partial: 'Separa',
            paid: 'Sudah Bayar',
        };
        const classes = map[statusVal] || 'bg-gray-100 text-gray-800';
        const label = labelMap[statusVal] || statusVal;
        return (
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${classes}`}>
                {label}
            </span>
        );
    };

    const commissionStatusBadge = (statusVal) => {
        const map = {
            pending: 'bg-yellow-100 text-yellow-800',
            paid: 'bg-green-100 text-green-800',
        };
        const labelMap = {
            pending: 'Belum Bayar',
            paid: 'Sudah Bayar',
        };
        const classes = map[statusVal] || 'bg-gray-100 text-gray-800';
        const label = labelMap[statusVal] || statusVal;
        return (
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${classes}`}>
                {label}
            </span>
        );
    };

    const formatRM = (amount) => `RM ${Number(amount || 0).toFixed(2)}`;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Maklumat Perjalanan
                    </h2>
                    <div className="flex gap-2">
                        <Link
                            href={route('trips.edit', trip.id)}
                            className="rounded-lg bg-yellow-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-yellow-600"
                        >
                            Ubah
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-600"
                        >
                            Padam
                        </button>
                        <Link
                            href={route('trips.index')}
                            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                        >
                            Kembali
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Perjalanan - ${trip.trip_number}`} />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8 space-y-6">
                    {/* Trip Header */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-800">
                                {trip.trip_number}
                            </h3>
                            {sourceBadge(trip.source)}
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Kenderaan</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {trip.vehicle?.plate_number || '-'}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Pemandu</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {trip.driver?.user?.name || '-'}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Pelanggan</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {trip.customer?.name || '-'}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Dari</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {trip.pickup_location || '-'}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Ke</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {trip.delivery_location || '-'}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Tarikh Ambil</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {trip.pickup_date || '-'}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Tarikh Hantar</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {trip.delivery_date || '-'}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Kargo</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {trip.cargo_description || '-'}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Berat</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {trip.weight_kg ? `${Number(trip.weight_kg).toLocaleString()} kg` : '-'}
                                    </dd>
                                </div>
                            </div>
                            {trip.notes && (
                                <div className="mt-6 border-t pt-4">
                                    <dt className="text-sm font-medium text-gray-500">Nota</dt>
                                    <dd className="mt-1 text-sm text-gray-900 whitespace-pre-line">{trip.notes}</dd>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Kewangan */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                            <h3 className="text-lg font-semibold text-gray-800">Maklumat Kewangan</h3>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div className="rounded-lg border p-4">
                                    <dt className="text-sm font-medium text-gray-500">Cas Asas</dt>
                                    <dd className="mt-1 text-sm font-semibold text-gray-900">
                                        {formatRM(trip.base_charge)}
                                    </dd>
                                </div>
                                <div className="rounded-lg border p-4">
                                    <dt className="text-sm font-medium text-gray-500">Cas Tambahan</dt>
                                    <dd className="mt-1 text-sm font-semibold text-gray-900">
                                        {formatRM(trip.additional_charges)}
                                    </dd>
                                </div>
                                <div className="rounded-lg border p-4">
                                    <dt className="text-sm font-medium text-gray-500">Tol</dt>
                                    <dd className="mt-1 text-sm font-semibold text-gray-900">
                                        {formatRM(trip.toll_amount)}
                                    </dd>
                                </div>
                                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                                    <dt className="text-sm font-medium text-blue-700">Jumlah Hasil</dt>
                                    <dd className="mt-1 text-lg font-bold text-blue-900">
                                        {formatRM(trip.total_revenue)}
                                    </dd>
                                </div>
                            </div>
                            <div className="mt-4">
                                <dt className="text-sm font-medium text-gray-500">Status Bayaran</dt>
                                <dd className="mt-1">{paymentBadge(trip.payment_status)}</dd>
                            </div>
                        </div>
                    </div>

                    {/* Komisen */}
                    {trip.commission && (
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                                <h3 className="text-lg font-semibold text-gray-800">Komisen Pemandu</h3>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                                    <div className="rounded-lg border p-4">
                                        <dt className="text-sm font-medium text-gray-500">Kadar Komisen</dt>
                                        <dd className="mt-1 text-sm font-semibold text-gray-900">
                                            {trip.commission.rate != null ? `${trip.commission.rate}%` : '-'}
                                        </dd>
                                    </div>
                                    <div className="rounded-lg border p-4">
                                        <dt className="text-sm font-medium text-gray-500">Jumlah Komisen</dt>
                                        <dd className="mt-1 text-sm font-semibold text-gray-900">
                                            {formatRM(trip.commission.amount)}
                                        </dd>
                                    </div>
                                    <div className="rounded-lg border p-4">
                                        <dt className="text-sm font-medium text-gray-500">Status</dt>
                                        <dd className="mt-1">
                                            {commissionStatusBadge(trip.commission.status)}
                                        </dd>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Pautan Invois */}
                    {trip.invoice && (
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                                <h3 className="text-lg font-semibold text-gray-800">Invois Berkaitan</h3>
                            </div>
                            <div className="p-6">
                                <Link
                                    href={route('invoices.show', trip.invoice.id)}
                                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm"
                                >
                                    {trip.invoice.invoice_number || 'Lihat Invois'}
                                    <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
