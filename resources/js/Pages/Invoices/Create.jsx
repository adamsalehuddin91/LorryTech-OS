import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create({ customers }) {
    const { data, setData, post, processing, errors } = useForm({
        customer_id: '',
        due_date: '',
        tax_rate: 0,
        notes: '',
        items: [{ description: '', quantity: 1, unit_price: 0 }],
    });

    const addItem = () => {
        setData('items', [...data.items, { description: '', quantity: 1, unit_price: 0 }]);
    };

    const removeItem = (index) => {
        if (data.items.length <= 1) return;
        setData('items', data.items.filter((_, i) => i !== index));
    };

    const updateItem = (index, field, value) => {
        const updated = data.items.map((item, i) => {
            if (i === index) {
                return { ...item, [field]: value };
            }
            return item;
        });
        setData('items', updated);
    };

    const subtotal = data.items.reduce((sum, item) => {
        return sum + (Number(item.quantity) * Number(item.unit_price));
    }, 0);

    const taxAmount = subtotal * (Number(data.tax_rate) / 100);
    const grandTotal = subtotal + taxAmount;

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('invoices.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Buat Invois
                </h2>
            }
        >
            <Head title="Buat Invois" />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Pelanggan & Tarikh Akhir */}
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Pelanggan
                                    </label>
                                    <select
                                        value={data.customer_id}
                                        onChange={(e) => setData('customer_id', e.target.value)}
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    >
                                        <option value="">-- Pilih Pelanggan --</option>
                                        {customers?.map((customer) => (
                                            <option key={customer.id} value={customer.id}>
                                                {customer.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.customer_id && (
                                        <p className="mt-1 text-sm text-red-600">{errors.customer_id}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Tarikh Akhir
                                    </label>
                                    <input
                                        type="date"
                                        value={data.due_date}
                                        onChange={(e) => setData('due_date', e.target.value)}
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    />
                                    {errors.due_date && (
                                        <p className="mt-1 text-sm text-red-600">{errors.due_date}</p>
                                    )}
                                </div>
                            </div>

                            {/* Kadar Cukai */}
                            <div className="max-w-xs">
                                <label className="block text-sm font-medium text-gray-700">
                                    Kadar Cukai (%)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={data.tax_rate}
                                    onChange={(e) => setData('tax_rate', e.target.value)}
                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                />
                                {errors.tax_rate && (
                                    <p className="mt-1 text-sm text-red-600">{errors.tax_rate}</p>
                                )}
                            </div>

                            {/* Item Invois */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-sm font-semibold text-gray-800">Item Invois</h3>
                                    <button
                                        type="button"
                                        onClick={addItem}
                                        className="inline-flex items-center rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700"
                                    >
                                        + Tambah Item
                                    </button>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500 w-1/2">
                                                    Penerangan
                                                </th>
                                                <th className="px-4 py-3 text-center text-xs font-medium uppercase text-gray-500 w-24">
                                                    Kuantiti
                                                </th>
                                                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500 w-36">
                                                    Harga Seunit (RM)
                                                </th>
                                                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500 w-36">
                                                    Jumlah (RM)
                                                </th>
                                                <th className="px-4 py-3 w-16"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {data.items.map((item, index) => (
                                                <tr key={index}>
                                                    <td className="px-4 py-2">
                                                        <input
                                                            type="text"
                                                            value={item.description}
                                                            onChange={(e) => updateItem(index, 'description', e.target.value)}
                                                            placeholder="Penerangan item"
                                                            className="block w-full rounded-lg border-gray-300 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                        />
                                                        {errors[`items.${index}.description`] && (
                                                            <p className="mt-1 text-xs text-red-600">{errors[`items.${index}.description`]}</p>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            value={item.quantity}
                                                            onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                                                            className="block w-full rounded-lg border-gray-300 text-sm text-center shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                        />
                                                        {errors[`items.${index}.quantity`] && (
                                                            <p className="mt-1 text-xs text-red-600">{errors[`items.${index}.quantity`]}</p>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            step="0.01"
                                                            value={item.unit_price}
                                                            onChange={(e) => updateItem(index, 'unit_price', e.target.value)}
                                                            className="block w-full rounded-lg border-gray-300 text-sm text-right shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                        />
                                                        {errors[`items.${index}.unit_price`] && (
                                                            <p className="mt-1 text-xs text-red-600">{errors[`items.${index}.unit_price`]}</p>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-2 text-right text-sm font-medium text-gray-900">
                                                        RM {(Number(item.quantity) * Number(item.unit_price)).toFixed(2)}
                                                    </td>
                                                    <td className="px-4 py-2 text-center">
                                                        {data.items.length > 1 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => removeItem(index)}
                                                                className="text-red-500 hover:text-red-700 text-sm font-medium"
                                                            >
                                                                Buang
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
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
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Cukai ({Number(data.tax_rate)}%)</span>
                                            <span className="font-medium text-gray-900">RM {taxAmount.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between border-t pt-2 text-base font-bold">
                                            <span>Jumlah</span>
                                            <span>RM {grandTotal.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Nota */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Nota
                                </label>
                                <textarea
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    rows={3}
                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    placeholder="Catatan tambahan..."
                                />
                                {errors.notes && (
                                    <p className="mt-1 text-sm text-red-600">{errors.notes}</p>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-3 border-t pt-6">
                                <Link
                                    href={route('invoices.index')}
                                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                                >
                                    Batal
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                                >
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
