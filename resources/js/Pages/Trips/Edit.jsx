import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ trip, vehicles, drivers, customers }) {
    const { data, setData, put, processing, errors } = useForm({
        vehicle_id: trip.vehicle_id || '',
        driver_id: trip.driver_id || '',
        customer_id: trip.customer_id || '',
        source: trip.source || 'lalamove',
        pickup_location: trip.pickup_location || '',
        delivery_location: trip.delivery_location || '',
        pickup_date: trip.pickup_date || '',
        delivery_date: trip.delivery_date || '',
        cargo_description: trip.cargo_description || '',
        weight_kg: trip.weight_kg || '',
        base_charge: trip.base_charge || '',
        additional_charges: trip.additional_charges || '',
        toll_amount: trip.toll_amount || '',
        payment_status: trip.payment_status || 'unpaid',
        notes: trip.notes || '',
    });

    const totalRevenue = (
        Number(data.base_charge || 0) +
        Number(data.additional_charges || 0) +
        Number(data.toll_amount || 0)
    ).toFixed(2);

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('trips.update', trip.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Edit Perjalanan
                </h2>
            }
        >
            <Head title="Edit Perjalanan" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Sumber */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Sumber Perjalanan
                                </label>
                                <div className="flex gap-6">
                                    <label className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            name="source"
                                            value="lalamove"
                                            checked={data.source === 'lalamove'}
                                            onChange={(e) => setData('source', e.target.value)}
                                            className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">Lalamove</span>
                                    </label>
                                    <label className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            name="source"
                                            value="side_job"
                                            checked={data.source === 'side_job'}
                                            onChange={(e) => setData('source', e.target.value)}
                                            className="h-4 w-4 border-gray-300 text-green-600 focus:ring-green-500"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">Kerja Sampingan</span>
                                    </label>
                                </div>
                                {errors.source && (
                                    <p className="mt-1 text-sm text-red-600">{errors.source}</p>
                                )}
                            </div>

                            {/* Kenderaan & Pemandu */}
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Kenderaan
                                    </label>
                                    <select
                                        value={data.vehicle_id}
                                        onChange={(e) => setData('vehicle_id', e.target.value)}
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    >
                                        <option value="">-- Pilih Kenderaan --</option>
                                        {vehicles?.map((vehicle) => (
                                            <option key={vehicle.id} value={vehicle.id}>
                                                {vehicle.plate_number}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.vehicle_id && (
                                        <p className="mt-1 text-sm text-red-600">{errors.vehicle_id}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Pemandu
                                    </label>
                                    <select
                                        value={data.driver_id}
                                        onChange={(e) => setData('driver_id', e.target.value)}
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    >
                                        <option value="">-- Pilih Pemandu --</option>
                                        {drivers?.map((driver) => (
                                            <option key={driver.id} value={driver.id}>
                                                {driver.user?.name || driver.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.driver_id && (
                                        <p className="mt-1 text-sm text-red-600">{errors.driver_id}</p>
                                    )}
                                </div>
                            </div>

                            {/* Pelanggan */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Pelanggan <span className="text-gray-400">(pilihan)</span>
                                </label>
                                <select
                                    value={data.customer_id}
                                    onChange={(e) => setData('customer_id', e.target.value)}
                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                >
                                    <option value="">-- Tiada Pelanggan --</option>
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

                            {/* Lokasi */}
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Lokasi Ambil
                                    </label>
                                    <input
                                        type="text"
                                        value={data.pickup_location}
                                        onChange={(e) => setData('pickup_location', e.target.value)}
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        placeholder="cth: Shah Alam, Selangor"
                                    />
                                    {errors.pickup_location && (
                                        <p className="mt-1 text-sm text-red-600">{errors.pickup_location}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Lokasi Hantar
                                    </label>
                                    <input
                                        type="text"
                                        value={data.delivery_location}
                                        onChange={(e) => setData('delivery_location', e.target.value)}
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        placeholder="cth: Johor Bahru, Johor"
                                    />
                                    {errors.delivery_location && (
                                        <p className="mt-1 text-sm text-red-600">{errors.delivery_location}</p>
                                    )}
                                </div>
                            </div>

                            {/* Tarikh */}
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Tarikh Ambil
                                    </label>
                                    <input
                                        type="date"
                                        value={data.pickup_date}
                                        onChange={(e) => setData('pickup_date', e.target.value)}
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    />
                                    {errors.pickup_date && (
                                        <p className="mt-1 text-sm text-red-600">{errors.pickup_date}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Tarikh Hantar
                                    </label>
                                    <input
                                        type="date"
                                        value={data.delivery_date}
                                        onChange={(e) => setData('delivery_date', e.target.value)}
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    />
                                    {errors.delivery_date && (
                                        <p className="mt-1 text-sm text-red-600">{errors.delivery_date}</p>
                                    )}
                                </div>
                            </div>

                            {/* Kargo & Berat */}
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Keterangan Kargo
                                    </label>
                                    <textarea
                                        value={data.cargo_description}
                                        onChange={(e) => setData('cargo_description', e.target.value)}
                                        rows={2}
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        placeholder="cth: Bahan binaan, 10 palet"
                                    />
                                    {errors.cargo_description && (
                                        <p className="mt-1 text-sm text-red-600">{errors.cargo_description}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Berat (kg)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={data.weight_kg}
                                        onChange={(e) => setData('weight_kg', e.target.value)}
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        placeholder="cth: 2500"
                                    />
                                    {errors.weight_kg && (
                                        <p className="mt-1 text-sm text-red-600">{errors.weight_kg}</p>
                                    )}
                                </div>
                            </div>

                            {/* Kewangan */}
                            <div className="border-t pt-6">
                                <h3 className="mb-4 text-sm font-semibold text-gray-800 uppercase tracking-wider">
                                    Maklumat Kewangan
                                </h3>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Cas Asas
                                        </label>
                                        <div className="relative mt-1">
                                            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-gray-500">
                                                RM
                                            </span>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={data.base_charge}
                                                onChange={(e) => setData('base_charge', e.target.value)}
                                                className="block w-full rounded-lg border-gray-300 pl-10 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                placeholder="0.00"
                                            />
                                        </div>
                                        {errors.base_charge && (
                                            <p className="mt-1 text-sm text-red-600">{errors.base_charge}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Cas Tambahan
                                        </label>
                                        <div className="relative mt-1">
                                            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-gray-500">
                                                RM
                                            </span>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={data.additional_charges}
                                                onChange={(e) => setData('additional_charges', e.target.value)}
                                                className="block w-full rounded-lg border-gray-300 pl-10 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                placeholder="0.00"
                                            />
                                        </div>
                                        {errors.additional_charges && (
                                            <p className="mt-1 text-sm text-red-600">{errors.additional_charges}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Tol
                                        </label>
                                        <div className="relative mt-1">
                                            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-gray-500">
                                                RM
                                            </span>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={data.toll_amount}
                                                onChange={(e) => setData('toll_amount', e.target.value)}
                                                className="block w-full rounded-lg border-gray-300 pl-10 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                placeholder="0.00"
                                            />
                                        </div>
                                        {errors.toll_amount && (
                                            <p className="mt-1 text-sm text-red-600">{errors.toll_amount}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Jumlah */}
                                <div className="mt-4 flex items-center justify-end rounded-lg bg-gray-50 px-4 py-3">
                                    <span className="text-sm font-medium text-gray-600 mr-3">Jumlah Hasil:</span>
                                    <span className="text-lg font-bold text-gray-900">RM {totalRevenue}</span>
                                </div>
                            </div>

                            {/* Status Bayaran */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Status Bayaran
                                </label>
                                <select
                                    value={data.payment_status}
                                    onChange={(e) => setData('payment_status', e.target.value)}
                                    className="mt-1 block w-full max-w-xs rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                >
                                    <option value="unpaid">Belum Bayar</option>
                                    <option value="partial">Separa</option>
                                    <option value="paid">Sudah Bayar</option>
                                </select>
                                {errors.payment_status && (
                                    <p className="mt-1 text-sm text-red-600">{errors.payment_status}</p>
                                )}
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
                                />
                                {errors.notes && (
                                    <p className="mt-1 text-sm text-red-600">{errors.notes}</p>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-3 border-t pt-6">
                                <Link
                                    href={route('trips.index')}
                                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                                >
                                    Batal
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                                >
                                    Kemaskini Perjalanan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
