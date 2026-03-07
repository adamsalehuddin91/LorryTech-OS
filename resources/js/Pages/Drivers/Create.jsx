import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        license_number: '',
        license_expiry: '',
        commission_rate: '',
        phone: '',
        emergency_contact: '',
        status: 'active',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('drivers.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Tambah Pemandu
                </h2>
            }
        >
            <Head title="Tambah Pemandu" />

            <div className="py-6">
                <div className="mx-auto max-w-3xl">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Maklumat Pemandu</h3>
                            <p className="mt-1 text-sm text-gray-500">Isi maklumat pemandu baharu.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Nama */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nama <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.name ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Nama penuh pemandu"
                                />
                                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.email ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="emel@contoh.com"
                                />
                                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                            </div>

                            {/* Kata Laluan */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Kata Laluan <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.password ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Minimum 8 aksara"
                                />
                                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                            </div>

                            {/* No. Lesen & Tamat Lesen */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        No. Lesen <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.license_number}
                                        onChange={(e) => setData('license_number', e.target.value)}
                                        className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 ${
                                            errors.license_number ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Nombor lesen memandu"
                                    />
                                    {errors.license_number && <p className="mt-1 text-sm text-red-600">{errors.license_number}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tamat Lesen <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={data.license_expiry}
                                        onChange={(e) => setData('license_expiry', e.target.value)}
                                        className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 ${
                                            errors.license_expiry ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    />
                                    {errors.license_expiry && <p className="mt-1 text-sm text-red-600">{errors.license_expiry}</p>}
                                </div>
                            </div>

                            {/* Kadar Komisen & Telefon */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Kadar Komisen (%)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="100"
                                        value={data.commission_rate}
                                        onChange={(e) => setData('commission_rate', e.target.value)}
                                        className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 ${
                                            errors.commission_rate ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="0.00"
                                    />
                                    {errors.commission_rate && <p className="mt-1 text-sm text-red-600">{errors.commission_rate}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Telefon
                                    </label>
                                    <input
                                        type="text"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 ${
                                            errors.phone ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="012-3456789"
                                    />
                                    {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                                </div>
                            </div>

                            {/* Kenalan Kecemasan */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Kenalan Kecemasan
                                </label>
                                <input
                                    type="text"
                                    value={data.emergency_contact}
                                    onChange={(e) => setData('emergency_contact', e.target.value)}
                                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.emergency_contact ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Nama & nombor telefon kenalan kecemasan"
                                />
                                {errors.emergency_contact && <p className="mt-1 text-sm text-red-600">{errors.emergency_contact}</p>}
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Status
                                </label>
                                <select
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.status ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                >
                                    <option value="active">Aktif</option>
                                    <option value="inactive">Tidak Aktif</option>
                                </select>
                                {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status}</p>}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                                <Link
                                    href={route('drivers.index')}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Batal
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
