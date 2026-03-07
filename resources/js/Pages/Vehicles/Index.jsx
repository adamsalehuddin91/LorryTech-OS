import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ vehicles, filters }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters?.search || '');
    const [status, setStatus] = useState(filters?.status || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('vehicles.index'), { search, status }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleStatusChange = (value) => {
        setStatus(value);
        router.get(route('vehicles.index'), { search, status: value }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleDelete = (id) => {
        if (confirm('Adakah anda pasti mahu memadam kenderaan ini?')) {
            router.delete(route('vehicles.destroy', id));
        }
    };

    const isExpiringSoon = (dateStr) => {
        if (!dateStr) return false;
        const expiry = new Date(dateStr);
        const now = new Date();
        const diffDays = (expiry - now) / (1000 * 60 * 60 * 24);
        return diffDays < 30;
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
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${classes}`}>
                {label}
            </span>
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Armada
                </h2>
            }
        >
            <Head title="Armada" />

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
                                <form onSubmit={handleSearch} className="flex flex-1 gap-2">
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Cari no. pendaftaran / model..."
                                        className="w-full max-w-xs rounded-lg border-gray-300 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    <select
                                        value={status}
                                        onChange={(e) => handleStatusChange(e.target.value)}
                                        className="rounded-lg border-gray-300 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="">Semua</option>
                                        <option value="aktif">Aktif</option>
                                        <option value="penyelenggaraan">Penyelenggaraan</option>
                                        <option value="tidak_aktif">Tidak Aktif</option>
                                    </select>
                                    <button
                                        type="submit"
                                        className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                                    >
                                        Cari
                                    </button>
                                </form>

                                <Link
                                    href={route('vehicles.create')}
                                    className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    + Tambah Kenderaan
                                </Link>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                No. Pendaftaran
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Model
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Kapasiti (kg)
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Tamat Cukai Jalan
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Tindakan
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {vehicles.data?.length > 0 ? (
                                            vehicles.data.map((vehicle) => (
                                                <tr key={vehicle.id} className="hover:bg-gray-50">
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                                        {vehicle.plate_number}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                                                        {vehicle.model}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                                                        {vehicle.capacity ? Number(vehicle.capacity).toLocaleString() : '-'}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                        {statusBadge(vehicle.status)}
                                                    </td>
                                                    <td className={`whitespace-nowrap px-6 py-4 text-sm ${isExpiringSoon(vehicle.roadtax_expiry) ? 'font-semibold text-red-600' : 'text-gray-700'}`}>
                                                        {vehicle.roadtax_expiry || '-'}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                                                        <Link
                                                            href={route('vehicles.show', vehicle.id)}
                                                            className="mr-2 text-blue-600 hover:text-blue-800"
                                                        >
                                                            Lihat
                                                        </Link>
                                                        <Link
                                                            href={route('vehicles.edit', vehicle.id)}
                                                            className="mr-2 text-yellow-600 hover:text-yellow-800"
                                                        >
                                                            Ubah
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(vehicle.id)}
                                                            className="text-red-600 hover:text-red-800"
                                                        >
                                                            Padam
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-8 text-center text-sm text-gray-500">
                                                    Tiada kenderaan dijumpai.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {vehicles.links && (
                                <div className="flex justify-center gap-1 mt-6">
                                    {vehicles.links.map((link, i) => (
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
