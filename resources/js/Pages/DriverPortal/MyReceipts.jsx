import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function MyReceipts({ expenses }) {
    const categoryLabels = {
        fuel: 'Bahan Api',
        toll: 'Tol',
        maintenance: 'Penyelenggaraan',
        repair: 'Pembaikan',
        tyre: 'Tayar',
        parking: 'Parking',
        other: 'Lain-lain',
    };

    const categoryColors = {
        fuel: 'bg-orange-100 text-orange-800',
        toll: 'bg-purple-100 text-purple-800',
        maintenance: 'bg-blue-100 text-blue-800',
        repair: 'bg-red-100 text-red-800',
        tyre: 'bg-gray-100 text-gray-800',
        parking: 'bg-cyan-100 text-cyan-800',
        other: 'bg-gray-100 text-gray-600',
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Resit Saya</h2>}
        >
            <Head title="Resit Saya" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-4 flex justify-end">
                        <Link
                            href={route('driver.upload-receipt')}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Muat Naik Resit
                        </Link>
                    </div>

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Tarikh</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Kategori</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Penerangan</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Kenderaan</th>
                                            <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">Jumlah (RM)</th>
                                            <th className="px-4 py-3 text-center text-xs font-medium uppercase text-gray-500">Resit</th>
                                            <th className="px-4 py-3 text-center text-xs font-medium uppercase text-gray-500">Disahkan</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {expenses.data?.length > 0 ? (
                                            expenses.data.map((exp) => (
                                                <tr key={exp.id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 text-sm text-gray-700">
                                                        {exp.receipt_date?.split('T')[0] || exp.receipt_date}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm">
                                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${categoryColors[exp.category] || 'bg-gray-100 text-gray-800'}`}>
                                                            {categoryLabels[exp.category] || exp.category}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-700">{exp.description || '-'}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-700">{exp.vehicle?.plate_number || '-'}</td>
                                                    <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">
                                                        RM {Number(exp.amount).toFixed(2)}
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        {exp.receipt_image_url ? (
                                                            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-100">
                                                                <svg className="h-3 w-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                </svg>
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-100">
                                                                <svg className="h-3 w-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                                </svg>
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        {exp.is_verified ? (
                                                            <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                                                                Ya
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
                                                                Belum
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="7" className="px-4 py-8 text-center text-sm text-gray-500">
                                                    Tiada resit dijumpai. Muat naik resit pertama anda!
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
