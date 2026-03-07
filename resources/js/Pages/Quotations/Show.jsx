import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';

export default function Show({ quotation }) {
    const { flash } = usePage().props;

    const statusBadge = (statusVal) => {
        const map = {
            draft: 'bg-gray-100 text-gray-800',
            sent: 'bg-blue-100 text-blue-800',
            accepted: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800',
            converted: 'bg-purple-100 text-purple-800',
        };
        const labelMap = {
            draft: 'Draf',
            sent: 'Dihantar',
            accepted: 'Diterima',
            rejected: 'Ditolak',
            converted: 'Ditukar',
        };
        const classes = map[statusVal] || 'bg-gray-100 text-gray-800';
        const label = labelMap[statusVal] || statusVal;
        return (
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${classes}`}>
                {label}
            </span>
        );
    };

    const handleStatusUpdate = (newStatus) => {
        const confirmMessages = {
            sent: 'Adakah anda pasti mahu menghantar sebut harga ini?',
            accepted: 'Adakah anda pasti mahu menerima sebut harga ini?',
            rejected: 'Adakah anda pasti mahu menolak sebut harga ini?',
        };
        if (confirm(confirmMessages[newStatus] || 'Teruskan?')) {
            router.patch(route('quotations.status', quotation.id), { status: newStatus });
        }
    };

    const handleConvert = () => {
        if (confirm('Adakah anda pasti mahu menukar sebut harga ini ke invois?')) {
            router.post(route('quotations.convert', quotation.id));
        }
    };

    const handleDelete = () => {
        if (confirm('Adakah anda pasti mahu memadam sebut harga ini?')) {
            router.delete(route('quotations.destroy', quotation.id));
        }
    };

    const subtotal = quotation.items?.reduce(
        (sum, item) => sum + Number(item.quantity) * Number(item.unit_price),
        0
    ) || 0;
    const taxAmount = subtotal * (Number(quotation.tax_rate) / 100);
    const total = subtotal + taxAmount;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Sebut Harga: {quotation.quotation_number}
                    </h2>
                    <Link
                        href={route('quotations.index')}
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                    >
                        Kembali
                    </Link>
                </div>
            }
        >
            <Head title={`Sebut Harga - ${quotation.quotation_number}`} />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8 space-y-6">
                    {/* Flash Messages */}
                    {flash?.success && (
                        <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-sm text-green-700">
                            {flash.success}
                        </div>
                    )}
                    {flash?.error && (
                        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
                            {flash.error}
                        </div>
                    )}

                    {/* Header Card */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-800">Maklumat Sebut Harga</h3>
                                {statusBadge(quotation.status)}
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">No. Sebut Harga</dt>
                                    <dd className="mt-1 text-lg font-bold text-gray-900">{quotation.quotation_number}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Sah Sehingga</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{quotation.valid_until || '-'}</dd>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Customer Card */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                            <h3 className="text-lg font-semibold text-gray-800">Maklumat Pelanggan</h3>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Nama</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{quotation.customer?.name || '-'}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Syarikat</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{quotation.customer?.company || '-'}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Telefon</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{quotation.customer?.phone || '-'}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Emel</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{quotation.customer?.email || '-'}</dd>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                            <h3 className="text-lg font-semibold text-gray-800">Item Sebut Harga</h3>
                        </div>
                        <div className="p-6">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">#</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Penerangan</th>
                                            <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">Kuantiti</th>
                                            <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">Harga Seunit (RM)</th>
                                            <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">Jumlah (RM)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {quotation.items?.map((item, index) => (
                                            <tr key={item.id || index}>
                                                <td className="px-4 py-3 text-sm text-gray-500">{index + 1}</td>
                                                <td className="px-4 py-3 text-sm text-gray-900">{item.description}</td>
                                                <td className="px-4 py-3 text-sm text-right text-gray-700">{item.quantity}</td>
                                                <td className="px-4 py-3 text-sm text-right text-gray-700">
                                                    RM {Number(item.unit_price).toFixed(2)}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">
                                                    RM {(Number(item.quantity) * Number(item.unit_price)).toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Totals */}
                            <div className="mt-4 flex justify-end">
                                <div className="w-72 space-y-2">
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Subtotal</span>
                                        <span>RM {subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Cukai ({Number(quotation.tax_rate)}%)</span>
                                        <span>RM {taxAmount.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between border-t pt-2 text-base font-bold text-gray-900">
                                        <span>Jumlah Keseluruhan</span>
                                        <span>RM {total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    {quotation.notes && (
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                                <h3 className="text-lg font-semibold text-gray-800">Nota</h3>
                            </div>
                            <div className="p-6">
                                <p className="text-sm text-gray-700 whitespace-pre-line">{quotation.notes}</p>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex flex-wrap gap-3">
                                {/* PDF Button - always visible */}
                                <a
                                    href={route('quotations.pdf', quotation.id)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700"
                                >
                                    Muat Turun PDF
                                </a>

                                {/* Draft actions */}
                                {quotation.status === 'draft' && (
                                    <>
                                        <Link
                                            href={route('quotations.edit', quotation.id)}
                                            className="inline-flex items-center rounded-lg bg-yellow-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-yellow-600"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleStatusUpdate('sent')}
                                            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                                        >
                                            Hantar
                                        </button>
                                        <button
                                            onClick={handleDelete}
                                            className="inline-flex items-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700"
                                        >
                                            Padam
                                        </button>
                                    </>
                                )}

                                {/* Sent actions */}
                                {quotation.status === 'sent' && (
                                    <>
                                        <button
                                            onClick={() => handleStatusUpdate('accepted')}
                                            className="inline-flex items-center rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700"
                                        >
                                            Terima
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate('rejected')}
                                            className="inline-flex items-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700"
                                        >
                                            Tolak
                                        </button>
                                    </>
                                )}

                                {/* Accepted actions */}
                                {quotation.status === 'accepted' && (
                                    <button
                                        onClick={handleConvert}
                                        className="inline-flex items-center rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700"
                                    >
                                        Tukar ke Invois
                                    </button>
                                )}

                                {/* Converted - link to invoice */}
                                {quotation.status === 'converted' && quotation.invoice_id && (
                                    <Link
                                        href={route('invoices.show', quotation.invoice_id)}
                                        className="inline-flex items-center rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700"
                                    >
                                        Lihat Invois
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
