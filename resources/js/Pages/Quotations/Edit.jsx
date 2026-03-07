import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ quotation, customers }) {
    const { data, setData, put, processing, errors } = useForm({
        customer_id: quotation.customer_id || '',
        valid_until: quotation.valid_until || '',
        tax_rate: quotation.tax_rate || 0,
        notes: quotation.notes || '',
        items: quotation.items?.length > 0
            ? quotation.items.map((item) => ({
                id: item.id || null,
                description: item.description || '',
                quantity: item.quantity || 1,
                unit_price: item.unit_price || 0,
            }))
            : [{ description: '', quantity: 1, unit_price: 0 }],
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

    const itemAmount = (item) => {
        return Number(item.quantity) * Number(item.unit_price);
    };

    const subtotal = data.items.reduce((sum, item) => sum + itemAmount(item), 0);
    const taxAmount = subtotal * (Number(data.tax_rate) / 100);
    const total = subtotal + taxAmount;

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('quotations.update', quotation.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Edit Sebut Harga
                </h2>
            }
        >
            <Head title="Edit Sebut Harga" />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Pelanggan & Tarikh */}
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
                                        Sah Sehingga
                                    </label>
                                    <input
                                        type="date"
                                        value={data.valid_until}
                                        onChange={(e) => setData('valid_until', e.target.value)}
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    />
                                    {errors.valid_until && (
                                        <p className="mt-1 text-sm text-red-600">{errors.valid_until}</p>
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

                            {/* Items Section */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-sm font-semibold text-gray-800">Item Sebut Harga</h3>
                                    <button
                                        type="button"
                                        onClick={addItem}
                                        className="inline-flex items-center rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-green-700"
                                    >
                                        + Tambah Item
                                    </button>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500 w-2/5">
                                                    Penerangan
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500 w-1/6">
                                                    Kuantiti
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500 w-1/5">
                                                    Harga Seunit (RM)
                                                </th>
                                                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500 w-1/5">
                                                    Jumlah (RM)
                                                </th>
                                                <th className="px-4 py-3 w-10"></th>
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
                                                            className="block w-full rounded-lg border-gray-300 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
                                                            className="block w-full rounded-lg border-gray-300 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                        />
                                                        {errors[`items.${index}.unit_price`] && (
                                                            <p className="mt-1 text-xs text-red-600">{errors[`items.${index}.unit_price`]}</p>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-2 text-right text-sm font-medium text-gray-900">
                                                        RM {itemAmount(item).toFixed(2)}
                                                    </td>
                                                    <td className="px-4 py-2 text-center">
                                                        {data.items.length > 1 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => removeItem(index)}
                                                                className="text-red-500 hover:text-red-700 text-lg font-bold"
                                                                title="Buang item"
                                                            >
                                                                &times;
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
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>Subtotal</span>
                                            <span>RM {subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>Cukai ({Number(data.tax_rate)}%)</span>
                                            <span>RM {taxAmount.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between border-t pt-2 text-base font-semibold text-gray-900">
                                            <span>Jumlah</span>
                                            <span>RM {total.toFixed(2)}</span>
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
                                    href={route('quotations.index')}
                                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                                >
                                    Batal
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                                >
                                    Kemaskini
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
