import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        plate_number: '',
        make_model: '',
        year: '',
        capacity_kg: '',
        status: 'active',
        roadtax_expiry: '',
        insurance_expiry: '',
        permit_apad_expiry: '',
        current_mileage: '',
        notes: '',
        photo: null,
    });

    const [preview, setPreview] = useState(null);

    const handlePhoto = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setData('photo', file);
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('vehicles.store'), { forceFormData: true });
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
                            {/* Gambar */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Gambar Kenderaan</label>
                                <div className="flex items-start gap-4">
                                    {preview ? (
                                        <div className="relative w-32 h-24 flex-shrink-0">
                                            <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-xl border border-gray-200" />
                                            <button type="button" onClick={() => { setData('photo', null); setPreview(null); }}
                                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-sm flex items-center justify-center shadow">×</button>
                                        </div>
                                    ) : (
                                        <div className="w-32 h-24 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center flex-shrink-0 bg-gray-50 text-3xl">🚛</div>
                                    )}
                                    <div>
                                        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            Pilih Gambar
                                            <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
                                        </label>
                                        <p className="mt-1.5 text-xs text-gray-400">JPG, PNG • Maks 5MB</p>
                                        {errors.photo && <p className="mt-1 text-sm text-red-600">{errors.photo}</p>}
                                    </div>
                                </div>
                            </div>

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
                                        value={data.make_model}
                                        onChange={(e) => setData('make_model', e.target.value)}
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        placeholder="cth: Isuzu NPR 71"
                                    />
                                    {errors.make_model && (
                                        <p className="mt-1 text-sm text-red-600">{errors.make_model}</p>
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
                                        value={data.capacity_kg}
                                        onChange={(e) => setData('capacity_kg', e.target.value)}
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        placeholder="cth: 5000"
                                    />
                                    {errors.capacity_kg && (
                                        <p className="mt-1 text-sm text-red-600">{errors.capacity_kg}</p>
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
                                        <option value="active">Aktif</option>
                                        <option value="maintenance">Penyelenggaraan</option>
                                        <option value="inactive">Tidak Aktif</option>
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
                                        value={data.permit_apad_expiry}
                                        onChange={(e) => setData('permit_apad_expiry', e.target.value)}
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    />
                                    {errors.permit_apad_expiry && (
                                        <p className="mt-1 text-sm text-red-600">{errors.permit_apad_expiry}</p>
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
