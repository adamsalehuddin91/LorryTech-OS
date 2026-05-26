import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function Company({ company }) {
    const { flash } = usePage().props;
    const fileRef = useRef(null);
    const [preview, setPreview] = useState(company.logo_url || null);

    const { data, setData, post, processing, errors } = useForm({
        name:                 company.name || '',
        reg_no:               company.reg_no || '',
        tin:                  company.tin || '',
        address:              company.address || '',
        phone:                company.phone || '',
        email:                company.email || '',
        logo:                 null,
        bank_name:            company.bank_name || '',
        bank_account_name:    company.bank_account_name || '',
        bank_account_number:  company.bank_account_number || '',
    });

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setData('logo', file);
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('settings.company.update'), { forceFormData: true });
    };

    const inputClass = (field) =>
        `w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none ${
            errors[field] ? 'border-red-500' : 'border-gray-300'
        }`;

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Tetapan Syarikat</h2>}>
            <Head title="Tetapan Syarikat" />

            {flash?.success && (
                <div className="mb-4 rounded-md bg-green-50 px-4 py-3 text-sm text-green-800 border border-green-200">
                    {flash.success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">

                {/* Logo */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-sm font-semibold text-gray-800 mb-4">Logo Syarikat</h3>
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50">
                            {preview ? (
                                <img src={preview} alt="Logo" className="w-full h-full object-contain p-1" />
                            ) : (
                                <span className="text-xs text-gray-400 text-center px-2">Tiada logo</span>
                            )}
                        </div>
                        <div>
                            <button
                                type="button"
                                onClick={() => fileRef.current?.click()}
                                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Muat Naik Logo
                            </button>
                            <p className="mt-1 text-xs text-gray-400">PNG, JPG atau SVG. Maks 2MB.</p>
                            <p className="text-xs text-gray-400">Logo ini akan muncul di halaman login & PDF.</p>
                            {errors.logo && <p className="mt-1 text-sm text-red-600">{errors.logo}</p>}
                        </div>
                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                            className="hidden"
                            onChange={handleLogoChange}
                        />
                    </div>
                </div>

                {/* Maklumat Syarikat */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Maklumat Syarikat</h3>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Syarikat <span className="text-red-500">*</span></label>
                        <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className={inputClass('name')} placeholder="Hanif Machinery Enterprise" />
                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">No. Pendaftaran (SSM)</label>
                            <input type="text" value={data.reg_no} onChange={e => setData('reg_no', e.target.value)} className={inputClass('reg_no')} placeholder="002675203-T" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">No. TIN (LHDN)</label>
                            <input type="text" value={data.tin} onChange={e => setData('tin', e.target.value)} className={inputClass('tin')} placeholder="C2345678900" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                        <textarea rows={2} value={data.address} onChange={e => setData('address', e.target.value)} className={inputClass('address')} placeholder="No52 Jln Prima Saujana 2/4, 43000 Kajang Selangor" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                            <input type="text" value={data.phone} onChange={e => setData('phone', e.target.value)} className={inputClass('phone')} placeholder="0122112454" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className={inputClass('email')} placeholder="info@syarikat.com" />
                        </div>
                    </div>
                </div>

                {/* Maklumat Bank */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Maklumat Bank (untuk PDF Invoice)</h3>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Bank</label>
                        <input type="text" value={data.bank_name} onChange={e => setData('bank_name', e.target.value)} className={inputClass('bank_name')} placeholder="Maybank" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Akaun</label>
                            <input type="text" value={data.bank_account_name} onChange={e => setData('bank_account_name', e.target.value)} className={inputClass('bank_account_name')} placeholder="HanifMachinery" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">No. Akaun</label>
                            <input type="text" value={data.bank_account_number} onChange={e => setData('bank_account_number', e.target.value)} className={inputClass('bank_account_number')} placeholder="5644 8141 2581" />
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {processing ? 'Menyimpan...' : 'Simpan Tetapan'}
                    </button>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
