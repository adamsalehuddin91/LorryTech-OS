import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ expenses, filters, vehicles, auditScore }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters?.search || '');
    const [category, setCategory] = useState(filters?.category || '');
    const [vehicleId, setVehicleId] = useState(filters?.vehicle_id || '');

    const categoryLabels = {
        fuel: 'Bahan Api',
        toll: 'Tol',
        maintenance: 'Penyelenggaraan',
        repair: 'Pembaikan',
        tyre: 'Tayar',
        insurance: 'Insurans',
        roadtax: 'Cukai Jalan',
        permit: 'Permit',
        parking: 'Parking',
        other: 'Lain-lain',
    };

    const categoryColors = {
        fuel: 'bg-orange-100 text-orange-800',
        toll: 'bg-blue-100 text-blue-800',
        maintenance: 'bg-yellow-100 text-yellow-800',
        repair: 'bg-red-100 text-red-800',
        tyre: 'bg-gray-100 text-gray-800',
        insurance: 'bg-purple-100 text-purple-800',
        roadtax: 'bg-green-100 text-green-800',
        permit: 'bg-indigo-100 text-indigo-800',
        parking: 'bg-cyan-100 text-cyan-800',
        other: 'bg-gray-100 text-gray-600',
    };

    const applyFilters = (overrides = {}) => {
        router.get(route('expenses.index'), {
            search,
            category,
            vehicle_id: vehicleId,
            ...overrides,
        }, { preserveState: true, preserveScroll: true });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        applyFilters();
    };

    const handleDelete = (id) => {
        if (confirm('Adakah anda pasti mahu memadam perbelanjaan ini?')) {
            router.delete(route('expenses.destroy', id));
        }
    };

    const scoreColor = auditScore.score >= 80 ? 'text-green-600' : auditScore.score >= 50 ? 'text-yellow-600' : 'text-red-600';
    const scoreBg = auditScore.score >= 80 ? 'bg-green-50 border-green-200' : auditScore.score >= 50 ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200';

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Perbelanjaan
                </h2>
            }
        >
            <Head title="Perbelanjaan" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    {/* Flash */}
                    {flash?.success && (
                        <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-sm text-green-700">
                            {flash.success}
                        </div>
                    )}

                    {/* Audit Score Widget */}
                    <div className={`rounded-lg border p-4 ${scoreBg}`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700">Skor Audit LHDN — Bulan Ini</h3>
                                <p className="mt-1 text-xs text-gray-500">
                                    {auditScore.with_receipt}/{auditScore.total_expenses} resit dilampir
                                    {' · '}
                                    {auditScore.verified} disahkan
                                    {auditScore.without_receipt > 0 && (
                                        <span className="text-red-600 font-medium"> · {auditScore.without_receipt} tiada resit</span>
                                    )}
                                </p>
                            </div>
                            <div className="text-right">
                                <span className={`text-3xl font-bold ${scoreColor}`}>{auditScore.score}%</span>
                                <p className="text-xs text-gray-500">Skor</p>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Toolbar */}
                            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <form onSubmit={handleSearch} className="flex flex-1 flex-wrap gap-2">
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Cari penerangan / no. plat..."
                                        className="w-full max-w-xs rounded-lg border-gray-300 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    <select
                                        value={category}
                                        onChange={(e) => {
                                            setCategory(e.target.value);
                                            applyFilters({ category: e.target.value });
                                        }}
                                        className="rounded-lg border-gray-300 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="">Semua Kategori</option>
                                        {Object.entries(categoryLabels).map(([key, label]) => (
                                            <option key={key} value={key}>{label}</option>
                                        ))}
                                    </select>
                                    <select
                                        value={vehicleId}
                                        onChange={(e) => {
                                            setVehicleId(e.target.value);
                                            applyFilters({ vehicle_id: e.target.value });
                                        }}
                                        className="rounded-lg border-gray-300 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="">Semua Kenderaan</option>
                                        {vehicles?.map((v) => (
                                            <option key={v.id} value={v.id}>{v.plate_number}</option>
                                        ))}
                                    </select>
                                    <button
                                        type="submit"
                                        className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                                    >
                                        Cari
                                    </button>
                                </form>

                                <Link
                                    href={route('expenses.create')}
                                    className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    + Tambah Perbelanjaan
                                </Link>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Tarikh
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Kategori
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Kenderaan
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Penerangan
                                            </th>
                                            <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Jumlah (RM)
                                            </th>
                                            <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Resit
                                            </th>
                                            <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Tindakan
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {expenses.data?.length > 0 ? (
                                            expenses.data.map((expense) => (
                                                <tr key={expense.id} className="hover:bg-gray-50">
                                                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                                                        {expense.receipt_date?.split('T')[0] || expense.receipt_date}
                                                    </td>
                                                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${categoryColors[expense.category] || 'bg-gray-100 text-gray-800'}`}>
                                                            {categoryLabels[expense.category] || expense.category}
                                                        </span>
                                                    </td>
                                                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                                                        {expense.vehicle?.plate_number || '-'}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-700 max-w-xs truncate">
                                                        {expense.description || '-'}
                                                    </td>
                                                    <td className="whitespace-nowrap px-4 py-3 text-sm text-right font-medium text-gray-900">
                                                        RM {Number(expense.amount).toFixed(2)}
                                                    </td>
                                                    <td className="whitespace-nowrap px-4 py-3 text-sm text-center">
                                                        {expense.receipt_image_url ? (
                                                            <span className="inline-flex items-center gap-1">
                                                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                                                {expense.verified && (
                                                                    <span className="text-xs text-green-600 font-medium">Sah</span>
                                                                )}
                                                            </span>
                                                        ) : (
                                                            <span className="w-2 h-2 rounded-full bg-red-400 inline-block"></span>
                                                        )}
                                                    </td>
                                                    <td className="whitespace-nowrap px-4 py-3 text-right text-sm">
                                                        <Link
                                                            href={route('expenses.show', expense.id)}
                                                            className="mr-2 text-blue-600 hover:text-blue-800"
                                                        >
                                                            Lihat
                                                        </Link>
                                                        <Link
                                                            href={route('expenses.edit', expense.id)}
                                                            className="mr-2 text-yellow-600 hover:text-yellow-800"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(expense.id)}
                                                            className="text-red-600 hover:text-red-800"
                                                        >
                                                            Padam
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="7" className="px-4 py-8 text-center text-sm text-gray-500">
                                                    Tiada perbelanjaan dijumpai.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {expenses.links && (
                                <div className="flex justify-center gap-1 mt-6">
                                    {expenses.links.map((link, i) => (
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
