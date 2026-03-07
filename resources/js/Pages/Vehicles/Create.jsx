import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        plate_number: '',
        model: '',
        year: '',
        capacity: '',
        status: 'aktif',
        roadtax_expiry: '',
        insurance_expiry: '',
        permit_expiry: '',
        current_mileage: '',
        notes: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('vehicles.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Tambah Kenderaan
                </h2>
            }
        >
            <Head title="Tambah Kenderaan" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* No. Pendaftaran */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    No. Pendaftaran
                                </label>
                                <input
                                    type="text"
                                    value={data.plate_number}
                                    onChange={(e) => setData('plate_number', e.target.value.toUpperCase())}
                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    placeholder="cth: WA1234B"
                                />
                                {errors.plate_number && (
                                    <p className="mt-1 text-sm text-red-600">{errors.plate_number}</p>
                                )}
                            </div>

                            {/* Model & Tahun */}
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Model
                                    </label>
                                    <input
                                        type="text"
                                        value={data.model}
                                        onChange={(e) => setData('model', e.target.value)}
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        placeholder="cth: Isuzu NPR 71"
                                    />
                                    {errors.model && (
                                        <p className="mt-1 text-sm text-red-600">{errors.model}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Tahun
                                    </label>
                                    <input
                                        type="number"
                                        value={data.year}
                                        onChange={(e) => setData('year', e.target.value)}
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        placeholder="cth: 2022"
                                    />
                                    {errors.year && (
                                        <p className="mt-1 text-sm text-red-600">{errors.year}</p>
                                    )}
                                </div>
                            </div>

                            {/* Kapasiti & Status */}
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Kapasiti (kg)
                                    </label>
                                    <input
                                        type="number"
                                        value={data.capacity}
                                        onChange={(e) => setData('capacity', e.target.value)}
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        placeholder="cth: 5000"
                                    />
                                    {errors.capacity && (
                                        <p className="mt-1 text-sm text-red-600">{errors.capacity}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Status
                                    </label>
                                    <select
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    >
                                        <option value="aktif">Aktif</option>
                                        <option value="penyelenggaraan">Penyelenggaraan</option>
                                        <option value="tidak_aktif">Tidak Aktif</option>
                                    </select>
                                    {errors.status && (
                                        <p className="mt-1 text-sm text-red-600">{errors.status}</p>
                                    )}
                                </div>
                            </div>

                            {/* Document Expiry Dates */}
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Tamat Cukai Jalan
                                    </label>
                                    <input
                                        type="date"
                                        value={data.roadtax_expiry}
                                        onChange={(e) => setData('roadtax_expiry', e.target.value)}
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    />
                                    {errors.roadtax_expiry && (
                                        <p className="mt-1 text-sm text-red-600">{errors.roadtax_expiry}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Tamat Insurans
                                    </label>
                                    <input
                                        type="date"
                                        value={data.insurance_expiry}
                                        onChange={(e) => setData('insurance_expiry', e.target.value)}
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    />
                                    {errors.insurance_expiry && (
                                        <p className="mt-1 text-sm text-red-600">{errors.insurance_expiry}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Tamat Permit APAD
                                    </label>
                                    <input
                                        type="date"
                                        value={data.permit_expiry}
                                        onChange={(e) => setData('permit_expiry', e.target.value)}
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    />
                                    {errors.permit_expiry && (
                                        <p className="mt-1 text-sm text-red-600">{errors.permit_expiry}</p>
                                    )}
                                </div>
                            </div>

                            {/* Mileage */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Perbatuan Semasa
                                </label>
                                <input
                                    type="number"
                                    value={data.current_mileage}
                                    onChange={(e) => setData('current_mileage', e.target.value)}
                                    className="mt-1 block w-full max-w-xs rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    placeholder="cth: 125000"
                                />
                                {errors.current_mileage && (
                                    <p className="mt-1 text-sm text-red-600">{errors.current_mileage}</p>
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
                                    placeholder="Catatan tambahan..."
                                />
                                {errors.notes && (
                                    <p className="mt-1 text-sm text-red-600">{errors.notes}</p>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-3 border-t pt-6">
                                <Link
                                    href={route('vehicles.index')}
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
