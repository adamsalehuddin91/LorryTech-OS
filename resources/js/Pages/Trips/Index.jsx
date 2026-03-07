import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ trips, filters }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters?.search || '');
    const [source, setSource] = useState(filters?.source || '');
    const [paymentStatus, setPaymentStatus] = useState(filters?.payment_status || '');

    const applyFilters = (overrides = {}) => {
        const params = {
            search,
            source,
            payment_status: paymentStatus,
            ...overrides,
        };
        // Remove empty values
        Object.keys(params).forEach((key) => {
            if (!params[key]) delete params[key];
        });
        router.get(route('trips.index'), params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        applyFilters();
    };

    const handleSourceChange = (value) => {
        setSource(value);
        applyFilters({ source: value });
    };

    const handlePaymentStatusChange = (value) => {
        setPaymentStatus(value);
        applyFilters({ payment_status: value });
    };

    const handleDelete = (id) => {
        if (confirm('Adakah anda pasti mahu memadam perjalanan ini?')) {
            router.delete(route('trips.destroy', id));
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
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${classes}`}>
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
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${classes}`}>
                {label}
            </span>
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Perjalanan
                </h2>
            }
        >
            <Head title="Perjalanan" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Flash Message */}
                    {flash?.success && (
                        <div className="mb-4 rounded-lg bg-green-50 border border-green-200 p-4 text-sm text-green-700">
                            {flash.success}
                        </div>
                    )}

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Toolbar */}
                            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <form onSubmit={handleSearch} className="flex flex-1 flex-wrap gap-2">
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Cari no. perjalanan / lokasi..."
                                        className="w-full max-w-xs rounded-lg border-gray-300 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    <select
                                        value={source}
                                        onChange={(e) => handleSourceChange(e.target.value)}
                                        className="rounded-lg border-gray-300 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="">Semua Sumber</option>
                                        <option value="lalamove">Lalamove</option>
                                        <option value="side_job">Kerja Sampingan</option>
                                    </select>
                                    <select
                                        value={paymentStatus}
                                        onChange={(e) => handlePaymentStatusChange(e.target.value)}
                                        className="rounded-lg border-gray-300 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="">Semua Status</option>
                                        <option value="unpaid">Belum Bayar</option>
                                        <option value="partial">Separa</option>
                                        <option value="paid">Sudah Bayar</option>
                                    </select>
                                    <button
                                        type="submit"
                                        className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                                    >
                                        Cari
                                    </button>
                                </form>

                                <Link
                                    href={route('trips.create')}
                                    className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    + Tambah Perjalanan
                                </Link>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                No. Perjalanan
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Sumber
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Kenderaan
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Pemandu
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Dari / Ke
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Tarikh
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Jumlah (RM)
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Status Bayaran
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Tindakan
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {trips.data?.length > 0 ? (
                                            trips.data.map((trip) => (
                                                <tr key={trip.id} className="hover:bg-gray-50">
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                                        {trip.trip_number}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                        {sourceBadge(trip.source)}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                                                        {trip.vehicle?.plate_number || '-'}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                                                        {trip.driver?.user?.name || '-'}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-700">
                                                        <span>{trip.pickup_location || '-'}</span>
                                                        <span className="mx-1 text-gray-400">&rarr;</span>
                                                        <span>{trip.delivery_location || '-'}</span>
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                                                        {trip.pickup_date || '-'}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-right text-gray-900">
                                                        RM {Number(trip.total_revenue || 0).toFixed(2)}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                        {paymentBadge(trip.payment_status)}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                                                        <Link
                                                            href={route('trips.show', trip.id)}
                                                            className="mr-2 text-blue-600 hover:text-blue-800"
                                                        >
                                                            Lihat
                                                        </Link>
                                                        <Link
                                                            href={route('trips.edit', trip.id)}
                                                            className="mr-2 text-yellow-600 hover:text-yellow-800"
                                                        >
                                                            Ubah
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(trip.id)}
                                                            className="text-red-600 hover:text-red-800"
                                                        >
                                                            Padam
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="9" className="px-6 py-8 text-center text-sm text-gray-500">
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
                                            dangerouslySetInnerHTML={{ __html: link.label }}
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
