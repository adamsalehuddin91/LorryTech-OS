import DriverLayout from '@/Layouts/DriverLayout';
import { Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

const CATEGORY_ICONS = {
    fuel:        { icon: '⛽', label: 'Bahan Api' },
    toll:        { icon: '🛣️', label: 'Tol' },
    maintenance: { icon: '🔧', label: 'Selenggara' },
    repair:      { icon: '🔩', label: 'Pembaikan' },
    tyre:        { icon: '🛞', label: 'Tayar' },
    parking:     { icon: '🅿️', label: 'Parking' },
    other:       { icon: '📦', label: 'Lain-lain' },
};

const compressImage = (file) =>
    new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const maxW = 1200;
                let w = img.width, h = img.height;
                if (w > maxW) { h = (h * maxW) / w; w = maxW; }
                const canvas = document.createElement('canvas');
                canvas.width = w; canvas.height = h;
                canvas.getContext('2d').drawImage(img, 0, 0, w, h);
                canvas.toBlob((blob) => resolve(new File([blob], file.name, { type: 'image/jpeg' })), 'image/jpeg', 0.7);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });

export default function UploadReceipt({ categories, vehicles }) {
    const { data, setData, post, processing, errors } = useForm({
        vehicle_id: '',
        category: '',
        amount: '',
        receipt_date: new Date().toISOString().split('T')[0],
        description: '',
        receipt_image: null,
    });

    const [preview, setPreview] = useState(null);
    const [compressing, setCompressing] = useState(false);

    const handleFile = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setCompressing(true);
        const compressed = await compressImage(file);
        setData('receipt_image', compressed);
        setCompressing(false);
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(compressed);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('driver.store-receipt'), { forceFormData: true });
    };

    return (
        <DriverLayout title="Muat Naik Resit">
            {/* Header */}
            <div className="bg-gradient-to-br from-blue-700 to-blue-900 px-5 pt-12 pb-6">
                <h1 className="text-white text-xl font-bold">Muat Naik Resit</h1>
                <p className="text-blue-200 text-sm mt-1">Snap gambar resit anda</p>
            </div>

            <form onSubmit={handleSubmit} className="px-5 mt-5 space-y-5 pb-6">
                {/* Camera Area */}
                <label className="block cursor-pointer">
                    <div className={`rounded-2xl border-2 border-dashed overflow-hidden transition-all ${
                        preview ? 'border-blue-400' : errors.receipt_image ? 'border-red-400' : 'border-gray-300'
                    }`}>
                        {preview ? (
                            <div className="relative">
                                <img src={preview} alt="Preview" className="w-full max-h-56 object-cover" />
                                <button
                                    type="button"
                                    onClick={(e) => { e.preventDefault(); setData('receipt_image', null); setPreview(null); }}
                                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-lg leading-none shadow"
                                >
                                    ×
                                </button>
                                {compressing && (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                        <p className="text-white text-sm font-medium">Mengecilkan...</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-10 px-6 bg-gray-50">
                                <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mb-3">
                                    <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <p className="text-sm font-semibold text-gray-700">Tap untuk snap atau pilih gambar</p>
                                <p className="text-xs text-gray-400 mt-1">Auto compress • JPG, PNG</p>
                            </div>
                        )}
                    </div>
                    <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
                    {errors.receipt_image && <p className="mt-1.5 text-sm text-red-500">{errors.receipt_image}</p>}
                </label>

                {/* Category Grid */}
                <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-3">Kategori</label>
                    <div className="grid grid-cols-4 gap-2">
                        {Object.entries(CATEGORY_ICONS).map(([key, { icon, label }]) => (
                            <button
                                key={key}
                                type="button"
                                onClick={() => setData('category', key)}
                                className={`flex flex-col items-center gap-1 rounded-xl py-3 transition-all border ${
                                    data.category === key
                                        ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                                        : 'bg-white border-gray-200 text-gray-600'
                                }`}
                            >
                                <span className="text-xl">{icon}</span>
                                <span className="text-xs font-medium leading-tight text-center">{label}</span>
                            </button>
                        ))}
                    </div>
                    {errors.category && <p className="mt-1.5 text-sm text-red-500">{errors.category}</p>}
                </div>

                {/* Amount */}
                <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">Jumlah (RM)</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">RM</span>
                        <input
                            type="number" min="0.01" step="0.01"
                            value={data.amount}
                            onChange={(e) => setData('amount', e.target.value)}
                            placeholder="0.00"
                            className="w-full rounded-xl border border-gray-200 pl-12 pr-4 py-3.5 text-lg font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    {errors.amount && <p className="mt-1.5 text-sm text-red-500">{errors.amount}</p>}
                </div>

                {/* Vehicle */}
                <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">Kenderaan</label>
                    <select
                        value={data.vehicle_id}
                        onChange={(e) => setData('vehicle_id', e.target.value)}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                        <option value="">-- Pilih Kenderaan --</option>
                        {vehicles?.map((v) => <option key={v.id} value={v.id}>{v.plate_number}</option>)}
                    </select>
                    {errors.vehicle_id && <p className="mt-1.5 text-sm text-red-500">{errors.vehicle_id}</p>}
                </div>

                {/* Date & Desc */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">Tarikh Resit</label>
                        <input
                            type="date" value={data.receipt_date}
                            onChange={(e) => setData('receipt_date', e.target.value)}
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.receipt_date && <p className="mt-1 text-xs text-red-500">{errors.receipt_date}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">Nota</label>
                        <input
                            type="text" value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="cth: Shell Rawang"
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={processing || compressing}
                    className="w-full rounded-2xl bg-blue-600 py-4 text-base font-bold text-white shadow-lg hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {compressing ? 'Mengecilkan imej...' : processing ? 'Memuat naik...' : 'Hantar Resit'}
                </button>
            </form>
        </DriverLayout>
    );
}
