import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Show({ invoice }) {
    const [showPaymentForm, setShowPaymentForm] = useState(false);

    const paymentForm = useForm({
        amount: '',
        payment_method: 'cash',
        payment_date: new Date().toISOString().split('T')[0],
        reference_number: '',
        notes: '',
    });

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
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${classes}`}>
                {label}
            </span>
        );
    };

    const subtotal = (invoice.items || []).reduce((sum, item) => {
        return sum + (Number(item.quantity) * Number(item.unit_price));
    }, 0);

    const taxAmount = subtotal * (Number(invoice.tax_rate || 0) / 100);
    const grandTotal = Number(invoice.total_amount || (subtotal + taxAmount));

    const totalPaid = (invoice.payments || []).reduce((sum, payment) => {
        return sum + Number(payment.amount);
    }, 0);

    const remainingBalance = grandTotal - totalPaid;

    const handleDelete = () => {
        if (confirm('Adakah anda pasti mahu memadam invois ini?')) {
            router.delete(route('invoices.destroy', invoice.id));
        }
    };

    const handlePaymentSubmit = (e) => {
        e.preventDefault();
        paymentForm.post(route('invoices.payment', invoice.id), {
            onSuccess: () => {
                setShowPaymentForm(false);
                paymentForm.reset();
            },
        });
    };

    const handleWhatsAppShare = () => {
        const items = (invoice.items || []).map((item) =>
            `- ${item.description}: ${Number(item.quantity)} x RM ${Number(item.unit_price).toFixed(2)} = RM ${(Number(item.quantity) * Number(item.unit_price)).toFixed(2)}`
        ).join('\n');

        const text = [
            `INVOIS: ${invoice.invoice_number}`,
            `Pelanggan: ${invoice.customer?.name || '-'}`,
            `Tarikh Akhir: ${invoice.due_date || '-'}`,
            '',
            'Item:',
            items,
            '',
            `Subtotal: RM ${subtotal.toFixed(2)}`,
            invoice.tax_rate > 0 ? `Cukai (${Number(invoice.tax_rate)}%): RM ${taxAmount.toFixed(2)}` : null,
            `Jumlah Keseluruhan: RM ${grandTotal.toFixed(2)}`,
            totalPaid > 0 ? `Telah Dibayar: RM ${totalPaid.toFixed(2)}` : null,
            remainingBalance > 0 ? `Baki: RM ${remainingBalance.toFixed(2)}` : null,
        ].filter(Boolean).join('\n');

        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Maklumat Invois
                    </h2>
                    <div className="flex gap-2">
                        <button
                            onClick={handleWhatsAppShare}
                            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700"
                        >
                            WhatsApp
                        </button>
                        <a
                            href={route('invoices.pdf', invoice.id)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700"
                        >
                            PDF
                        </a>
                        <Link
                            href={route('invoices.edit', invoice.id)}
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
                            href={route('invoices.index')}
                            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                        >
                            Kembali
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Invois - ${invoice.invoice_number}`} />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8 space-y-6">
                    {/* Invoice Header */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    {invoice.invoice_number}
                                </h3>
                                {paymentBadge(invoice.payment_status)}
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Pelanggan</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {invoice.customer?.name || '-'}
                                    </dd>
                                    {invoice.customer?.phone && (
                                        <dd className="text-sm text-gray-600">{invoice.customer.phone}</dd>
                                    )}
                                    {invoice.customer?.email && (
                                        <dd className="text-sm text-gray-600">{invoice.customer.email}</dd>
                                    )}
                                    {invoice.customer?.address && (
                                        <dd className="text-sm text-gray-600">{invoice.customer.address}</dd>
                                    )}
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Tarikh Akhir</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{invoice.due_date || '-'}</dd>
                                </div>
                            </div>

                            {/* Related Links */}
                            {(invoice.trip_id || invoice.quotation_id) && (
                                <div className="mt-4 flex gap-4 border-t pt-4">
                                    {invoice.trip_id && (
                                        <Link
                                            href={route('trips.show', invoice.trip_id)}
                                            className="text-sm text-blue-600 hover:text-blue-800"
                                        >
                                            Lihat Perjalanan Berkaitan
                                        </Link>
                                    )}
                                    {invoice.quotation_id && (
                                        <Link
                                            href={route('quotations.show', invoice.quotation_id)}
                                            className="text-sm text-blue-600 hover:text-blue-800"
                                        >
                                            Lihat Sebut Harga Berkaitan
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Invoice Items */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                            <h3 className="text-lg font-semibold text-gray-800">Item Invois</h3>
                        </div>
                        <div className="p-6">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                                                Penerangan
                                            </th>
                                            <th className="px-4 py-3 text-center text-xs font-medium uppercase text-gray-500">
                                                Kuantiti
                                            </th>
                                            <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">
                                                Harga Seunit (RM)
                                            </th>
                                            <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">
                                                Jumlah (RM)
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {(invoice.items || []).map((item) => (
                                            <tr key={item.id}>
                                                <td className="px-4 py-3 text-sm text-gray-900">
                                                    {item.description}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-center text-gray-700">
                                                    {item.quantity}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-right text-gray-700">
                                                    RM {Number(item.unit_price).toFixed(2)}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">
                                                    RM {(Number(item.quantity) * Number(item.unit_price)).toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                                        {(!invoice.items || invoice.items.length === 0) && (
                                            <tr>
                                                <td colSpan="4" className="px-4 py-6 text-center text-sm text-gray-500">
                                                    Tiada item.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Totals */}
                            <div className="mt-4 flex justify-end">
                                <div className="w-72 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-medium text-gray-900">RM {subtotal.toFixed(2)}</span>
                                    </div>
                                    {Number(invoice.tax_rate) > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Cukai ({Number(invoice.tax_rate)}%)</span>
                                            <span className="font-medium text-gray-900">RM {taxAmount.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between border-t pt-2 text-base font-bold">
                                        <span>Jumlah Keseluruhan</span>
                                        <span>RM {grandTotal.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Notes */}
                            {invoice.notes && (
                                <div className="mt-6 border-t pt-4">
                                    <dt className="text-sm font-medium text-gray-500">Nota</dt>
                                    <dd className="mt-1 text-sm text-gray-900 whitespace-pre-line">{invoice.notes}</dd>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Payment History */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-800">Sejarah Pembayaran</h3>
                                <div className="text-sm">
                                    <span className="text-gray-600">Baki: </span>
                                    <span className={`font-bold ${remainingBalance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                        RM {remainingBalance.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            {/* Payment Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                                                Tarikh
                                            </th>
                                            <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">
                                                Jumlah (RM)
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                                                Kaedah
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                                                No. Rujukan
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {(invoice.payments || []).length > 0 ? (
                                            invoice.payments.map((payment) => (
                                                <tr key={payment.id}>
                                                    <td className="px-4 py-3 text-sm text-gray-900">
                                                        {payment.payment_date || '-'}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">
                                                        RM {Number(payment.amount).toFixed(2)}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-700">
                                                        {{ cash: 'Tunai', bank_transfer: 'Pindahan Bank', cheque: 'Cek' }[payment.payment_method] || payment.payment_method || '-'}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-700">
                                                        {payment.reference_number || '-'}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="px-4 py-6 text-center text-sm text-gray-500">
                                                    Tiada rekod pembayaran.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Summary Row */}
                            {(invoice.payments || []).length > 0 && (
                                <div className="mt-3 flex justify-end">
                                    <div className="w-72 space-y-1">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Jumlah Dibayar</span>
                                            <span className="font-medium text-green-700">RM {totalPaid.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm border-t pt-1">
                                            <span className="text-gray-600">Baki Tertunggak</span>
                                            <span className={`font-bold ${remainingBalance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                RM {remainingBalance.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Record Payment Toggle */}
                            {remainingBalance > 0 && (
                                <div className="mt-6 border-t pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowPaymentForm(!showPaymentForm)}
                                        className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                                    >
                                        {showPaymentForm ? 'Tutup Borang' : '+ Rekod Pembayaran'}
                                    </button>

                                    {showPaymentForm && (
                                        <form onSubmit={handlePaymentSubmit} className="mt-4 space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
                                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Jumlah Bayaran (RM)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        min="0.01"
                                                        max={remainingBalance}
                                                        step="0.01"
                                                        value={paymentForm.data.amount}
                                                        onChange={(e) => paymentForm.setData('amount', e.target.value)}
                                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                        placeholder={`Maks: RM ${remainingBalance.toFixed(2)}`}
                                                    />
                                                    {paymentForm.errors.amount && (
                                                        <p className="mt-1 text-sm text-red-600">{paymentForm.errors.amount}</p>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Kaedah Pembayaran
                                                    </label>
                                                    <select
                                                        value={paymentForm.data.payment_method}
                                                        onChange={(e) => paymentForm.setData('payment_method', e.target.value)}
                                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                    >
                                                        <option value="cash">Tunai</option>
                                                        <option value="bank_transfer">Pindahan Bank</option>
                                                        <option value="cheque">Cek</option>
                                                    </select>
                                                    {paymentForm.errors.payment_method && (
                                                        <p className="mt-1 text-sm text-red-600">{paymentForm.errors.payment_method}</p>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Tarikh Pembayaran
                                                    </label>
                                                    <input
                                                        type="date"
                                                        value={paymentForm.data.payment_date}
                                                        onChange={(e) => paymentForm.setData('payment_date', e.target.value)}
                                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                    />
                                                    {paymentForm.errors.payment_date && (
                                                        <p className="mt-1 text-sm text-red-600">{paymentForm.errors.payment_date}</p>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        No. Rujukan
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={paymentForm.data.reference_number}
                                                        onChange={(e) => paymentForm.setData('reference_number', e.target.value)}
                                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                        placeholder="cth: TRF-001234"
                                                    />
                                                    {paymentForm.errors.reference_number && (
                                                        <p className="mt-1 text-sm text-red-600">{paymentForm.errors.reference_number}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Nota
                                                </label>
                                                <textarea
                                                    value={paymentForm.data.notes}
                                                    onChange={(e) => paymentForm.setData('notes', e.target.value)}
                                                    rows={2}
                                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                    placeholder="Catatan pembayaran..."
                                                />
                                                {paymentForm.errors.notes && (
                                                    <p className="mt-1 text-sm text-red-600">{paymentForm.errors.notes}</p>
                                                )}
                                            </div>
                                            <div className="flex justify-end">
                                                <button
                                                    type="submit"
                                                    disabled={paymentForm.processing}
                                                    className="rounded-lg bg-green-600 px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 disabled:opacity-50"
                                                >
                                                    Rekod Bayaran
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
