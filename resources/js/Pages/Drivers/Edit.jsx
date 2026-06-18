import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Edit({ driver }) {
    const { data, setData, post, processing, errors } = useForm({
        _method:           'put', // POST + spoof — PHP can't parse multipart PUT (file upload)
        name:              driver.user?.name || '',
        email:             driver.user?.email || '',
        license_number:    driver.license_number || '',
        license_expiry:    driver.license_expiry || '',
        commission_rate:          driver.commission_rate ?? '',
        lalamove_commission_rate: driver.lalamove_commission_rate ?? '',
        phone:             driver.phone || '',
        emergency_contact: driver.emergency_contact || '',
        status:            driver.status || 'active',
        ic_number:         driver.ic_number || '',
        kwsp_no:           driver.kwsp_no || '',
        socso_no:          driver.socso_no || '',
        bank_name:         driver.bank_name || '',
        bank_account_no:   driver.bank_account_no || '',
        base_salary:       driver.base_salary ?? '',
        photo:             null,
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
        post(route('drivers.update', driver.id), { forceFormData: true });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Ubah Pemandu
                </h2>
            }
        >
            <Head title="Ubah Pemandu" />

            <div className="py-6">
                <div className="mx-auto max-w-3xl">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Kemaskini Maklumat Pemandu</h3>
                            <p className="mt-1 text-sm text-gray-500">Ubah maklumat pemandu sedia ada. Bahagian Penggajian diperlukan untuk jana slip gaji.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Gambar */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Gambar Pemandu</label>
                                <div className="flex items-center gap-4">
                                    {preview ? (
                                        <div className="relative w-20 h-20 flex-shrink-0">
                                            <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-full border-2 border-gray-200" />
                                            <button type="button" onClick={() => { setData('photo', null); setPreview(null); }}
                                                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center shadow">×</button>
                                        </div>
                                    ) : driver.photo ? (
                                        <img src={driver.photo} alt="Gambar sedia ada" className="w-20 h-20 object-cover rounded-full border-2 border-gray-200 flex-shrink-0" />
                                    ) : (
                                        <div className="w-20 h-20 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center flex-shrink-0 bg-gray-50 text-3xl">👤</div>
                                    )}
                                    <div>
                                        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            {driver.photo ? 'Tukar Gambar' : 'Pilih Gambar'}
                                            <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
                                        </label>
                                        <p className="mt-1.5 text-xs text-gray-400">JPG, PNG • Maks 5MB</p>
                                        {errors.photo && <p className="mt-1 text-sm text-red-600">{errors.photo}</p>}
                                    </div>
                                </div>
                            </div>

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

                            {/* Kadar Komisen */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Kadar Komisen Job Tepi (%)</label>
                                    <input
                                        type="number" step="0.01" min="0" max="100"
                                        value={data.commission_rate}
                                        onChange={(e) => setData('commission_rate', e.target.value)}
                                        className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 ${errors.commission_rate ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="0.00"
                                    />
                                    {errors.commission_rate && <p className="mt-1 text-sm text-red-600">{errors.commission_rate}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Kadar Komisen Lalamove (%)</label>
                                    <input
                                        type="number" step="0.01" min="0" max="100"
                                        value={data.lalamove_commission_rate}
                                        onChange={(e) => setData('lalamove_commission_rate', e.target.value)}
                                        className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 ${errors.lalamove_commission_rate ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="0.00"
                                    />
                                    {errors.lalamove_commission_rate && <p className="mt-1 text-sm text-red-600">{errors.lalamove_commission_rate}</p>}
                                </div>
                            </div>

                            {/* Telefon */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                            {/* ── Maklumat Penggajian ── */}
                            <div className="pt-4 border-t border-gray-200">
                                <h4 className="text-sm font-semibold text-gray-800 mb-4">Maklumat Penggajian</h4>

                                {/* IC & Gaji Pokok */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">No. IC</label>
                                        <input
                                            type="text"
                                            value={data.ic_number}
                                            onChange={(e) => setData('ic_number', e.target.value)}
                                            className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 ${errors.ic_number ? 'border-red-500' : 'border-gray-300'}`}
                                            placeholder="e.g. 851026-06-5431"
                                        />
                                        {errors.ic_number && <p className="mt-1 text-sm text-red-600">{errors.ic_number}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Gaji Pokok (RM/bulan)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={data.base_salary}
                                            onChange={(e) => setData('base_salary', e.target.value)}
                                            className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 ${errors.base_salary ? 'border-red-500' : 'border-gray-300'}`}
                                            placeholder="1700.00"
                                        />
                                        {errors.base_salary && <p className="mt-1 text-sm text-red-600">{errors.base_salary}</p>}
                                    </div>
                                </div>

                                {/* KWSP & SOCSO */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">No. KWSP Pekerja</label>
                                        <input
                                            type="text"
                                            value={data.kwsp_no}
                                            onChange={(e) => setData('kwsp_no', e.target.value)}
                                            className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 ${errors.kwsp_no ? 'border-red-500' : 'border-gray-300'}`}
                                            placeholder="e.g. 18554016"
                                        />
                                        {errors.kwsp_no && <p className="mt-1 text-sm text-red-600">{errors.kwsp_no}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">No. SOCSO Pekerja</label>
                                        <input
                                            type="text"
                                            value={data.socso_no}
                                            onChange={(e) => setData('socso_no', e.target.value)}
                                            className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 ${errors.socso_no ? 'border-red-500' : 'border-gray-300'}`}
                                            placeholder="e.g. 891121-06-5516"
                                        />
                                        {errors.socso_no && <p className="mt-1 text-sm text-red-600">{errors.socso_no}</p>}
                                    </div>
                                </div>

                                {/* Bank */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Bank</label>
                                        <input
                                            type="text"
                                            value={data.bank_name}
                                            onChange={(e) => setData('bank_name', e.target.value)}
                                            className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 ${errors.bank_name ? 'border-red-500' : 'border-gray-300'}`}
                                            placeholder="e.g. Maybank"
                                        />
                                        {errors.bank_name && <p className="mt-1 text-sm text-red-600">{errors.bank_name}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">No. Akaun Bank</label>
                                        <input
                                            type="text"
                                            value={data.bank_account_no}
                                            onChange={(e) => setData('bank_account_no', e.target.value)}
                                            className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 ${errors.bank_account_no ? 'border-red-500' : 'border-gray-300'}`}
                                            placeholder="e.g. 1623-8483-4071"
                                        />
                                        {errors.bank_account_no && <p className="mt-1 text-sm text-red-600">{errors.bank_account_no}</p>}
                                    </div>
                                </div>
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
                                    {processing ? 'Mengemaskini...' : 'Kemaskini'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
