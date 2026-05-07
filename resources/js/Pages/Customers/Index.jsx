import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ customers, filters }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters?.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('customers.index'), { search }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleDelete = (id) => {
        if (confirm('Adakah anda pasti mahu memadam pelanggan ini?')) {
            router.delete(route('customers.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Pelanggan</h2>}>
            <Head title="Pelanggan" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {flash?.success && (
                        <div className="mb-4 rounded-lg bg-green-50 border border-green-200 p-4 text-sm text-green-700">
                            {flash.success}
                        </div>
                    )}

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <form onSubmit={handleSearch} className="flex flex-1 gap-2">
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Cari nama / syarikat / telefon..."
                                        className="w-full max-w-xs rounded-lg border-gray-300 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    <button
                                        type="submit"
                                        className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                                    >
                                        Cari
                                    </button>
                                </form>

                                <Link
                                    href={route('customers.create')}
                                    className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                                >
                                    + Tambah Pelanggan
                                </Link>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Nama</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Syarikat</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Telefon</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Perjalanan</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Invois</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Tindakan</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {customers.data?.length > 0 ? (
                                            customers.data.map((c) => (
                                                <tr key={c.id} className="hover:bg-gray-50">
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{c.name}</td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">{c.company || '-'}</td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">{c.phone || '-'}</td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">{c.trips_count}</td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">{c.invoices_count}</td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                                                        <Link
                                                            href={route('customers.edit', c.id)}
                                                            className="mr-3 text-yellow-600 hover:text-yellow-800"
                                                        >
                                                            Ubah
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(c.id)}
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
                                                    Tiada pelanggan dijumpai.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {customers.links && (
                                <div className="flex justify-center gap-1 mt-6">
                                    {customers.links.map((link, i) => (
                                        <Link
                                            key={i}
                                            href={link.url || '#'}
                                            className={`px-3 py-1 rounded text-sm ${link.active ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'} ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            children={link.label.replace(/&laquo;/g, '«').replace(/&raquo;/g, '»')}
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
