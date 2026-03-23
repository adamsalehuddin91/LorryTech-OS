import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ invoices, filters }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters?.search || '');
    const [paymentStatus, setPaymentStatus] = useState(filters?.payment_status || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('invoices.index'), { search, payment_status: paymentStatus }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleStatusChange = (value) => {
        setPaymentStatus(value);
        router.get(route('invoices.index'), { search, payment_status: value }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleDelete = (id) => {
        if (confirm('Adakah anda pasti mahu memadam invois ini?')) {
            router.delete(route('invoices.destroy', id));
        }
    };

    const paymentBadge = (status) => {
        const map = {
            unpaid: 'bg-red-100 text-red-800',
            partial: 'bg-yellow-100 text-yellow-800',
            paid: 'bg-green-100 text-green-800',
        };
        const labelMap = {
            unpaid: 'Belum Bayar',
            partial: 'Separa Bayar',
            paid: 'Telah Bayar',
        };
        const classes = map[status] || 'bg-gray-100 text-gray-800';
        const label = labelMap[status] || status;
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
                    Invois
                </h2>
            }
        >
            <Head title="Invois" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Flash Message */}
                    {flash?.success && (
                        <div className="mb-4 rounded-lg bg-green-50 border border-green-200 p-4 text-sm text-green-700">
                            {flash.success}
                        </div>
                    )}
                    {flash?.error && (
                        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
                            {flash.error}
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
                                        placeholder="Cari no. invois / pelanggan..."
                                        className="w-full max-w-xs rounded-lg border-gray-300 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    <select
                                        value={paymentStatus}
                                        onChange={(e) => handleStatusChange(e.target.value)}
                                        className="rounded-lg border-gray-300 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="">Semua Status</option>
                                        <option value="unpaid">Belum Bayar</option>
                                        <option value="partial">Separa Bayar</option>
                                        <option value="paid">Telah Bayar</option>
                                    </select>
                                    <button
                                        type="submit"
                                        className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                                    >
                                        Cari
                                    </button>
                                </form>

                                <Link
                                    href={route('invoices.create')}
                                    className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    + Buat Invois
                                </Link>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                No. Invois
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Pelanggan
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Jumlah (RM)
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Status Bayaran
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Tarikh Akhir
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Tindakan
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {invoices.data?.length > 0 ? (
                                            invoices.data.map((invoice) => (
                                                <tr key={invoice.id} className="hover:bg-gray-50">
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                                        {invoice.invoice_number}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                                                        {invoice.customer?.name || '-'}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-right text-gray-900 font-medium">
                                                        RM {Number(invoice.total_amount).toFixed(2)}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                        {paymentBadge(invoice.payment_status)}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                                                        {invoice.due_date || '-'}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                                                        <Link
                                                            href={route('invoices.show', invoice.id)}
                                                            className="mr-2 text-blue-600 hover:text-blue-800"
                                                        >
                                                            Lihat
                                                        </Link>
                                                        <Link
                                                            href={route('invoices.edit', invoice.id)}
                                                            className="mr-2 text-yellow-600 hover:text-yellow-800"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(invoice.id)}
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
                                                    Tiada invois dijumpai.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {invoices.links && (
                                <div className="flex justify-center gap-1 mt-6">
                                    {invoices.links.map((link, i) => (
                                        <Link
                                            key={i}
                                            href={link.url || '#'}
                                            className={`px-3 py-1 rounded text-sm ${link.active ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'} ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            children={link.label.replace(/&laquo;/g, '\u00AB').replace(/&raquo;/g, '\u00BB')}
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
