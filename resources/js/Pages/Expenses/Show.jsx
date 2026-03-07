import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';

export default function Show({ expense, categories }) {
    const { flash } = usePage().props;

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

    const handleVerify = () => {
        router.patch(route('expenses.verify', expense.id));
    };

    const handleDelete = () => {
        if (confirm('Adakah anda pasti mahu memadam perbelanjaan ini?')) {
            router.delete(route('expenses.destroy', expense.id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Maklumat Perbelanjaan
                    </h2>
                    <div className="flex gap-2">
                        <button
                            onClick={handleVerify}
                            className={`rounded-lg px-4 py-2 text-sm font-medium text-white shadow-sm ${
                                expense.verified
                                    ? 'bg-gray-500 hover:bg-gray-600'
                                    : 'bg-green-600 hover:bg-green-700'
                            }`}
                        >
                            {expense.verified ? 'Batal Sahkan' : 'Sahkan Resit'}
                        </button>
                        <Link
                            href={route('expenses.edit', expense.id)}
                            className="rounded-lg bg-yellow-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-yellow-600"
                        >
                            Edit
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700"
                        >
                            Padam
                        </button>
                        <Link
                            href={route('expenses.index')}
                            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                        >
                            Kembali
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Maklumat Perbelanjaan" />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8 space-y-6">
                    {/* Flash */}
                    {flash?.success && (
                        <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-sm text-green-700">
                            {flash.success}
                        </div>
                    )}

                    {/* Expense Details */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-800">Butiran Perbelanjaan</h3>
                                <div className="flex items-center gap-2">
                                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${categoryColors[expense.category] || 'bg-gray-100 text-gray-800'}`}>
                                        {categories[expense.category] || expense.category}
                                    </span>
                                    {expense.verified && (
                                        <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                                            Disahkan
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Kenderaan</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{expense.vehicle?.plate_number || '-'}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Pemandu</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{expense.driver?.name || 'Tiada'}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Jumlah</dt>
                                    <dd className="mt-1 text-lg font-bold text-gray-900">RM {Number(expense.amount).toFixed(2)}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Tarikh Resit</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{expense.receipt_date?.split('T')[0] || expense.receipt_date}</dd>
                                </div>
                                {expense.description && (
                                    <div className="sm:col-span-2">
                                        <dt className="text-sm font-medium text-gray-500">Penerangan</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{expense.description}</dd>
                                    </div>
                                )}
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Dimuat Naik Oleh</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{expense.uploader?.name || '-'}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Tarikh Direkod</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {expense.created_at ? new Date(expense.created_at).toLocaleDateString('ms-MY') : '-'}
                                    </dd>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Receipt Image */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                            <h3 className="text-lg font-semibold text-gray-800">Gambar Resit</h3>
                        </div>
                        <div className="p-6">
                            {expense.receipt_image_url ? (
                                <div className="flex flex-col items-center gap-4">
                                    <a
                                        href={expense.receipt_image_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block"
                                    >
                                        <img
                                            src={expense.receipt_image_url}
                                            alt="Resit"
                                            className="max-h-96 rounded-lg border border-gray-200 shadow-sm object-contain"
                                        />
                                    </a>
                                    <p className="text-xs text-gray-500">Klik gambar untuk buka saiz penuh</p>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p className="mt-2 text-sm text-gray-500">Tiada gambar resit dilampir</p>
                                    <Link
                                        href={route('expenses.edit', expense.id)}
                                        className="mt-2 inline-flex text-sm text-blue-600 hover:text-blue-800"
                                    >
                                        Muat naik resit
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
