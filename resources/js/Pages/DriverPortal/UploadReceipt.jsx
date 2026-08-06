import DriverLayout from '@/Layouts/DriverLayout';
import { compressImage } from '@/utils/compressImage';
import { useForm } from '@inertiajs/react';
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
        const compressed = await compressImage(file, { quality: 0.7 });
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

    const field = 'w-full rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 transition-colors';
    const label = 'block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5';

    return (
        <DriverLayout title="Muat Naik Resit">
            {/* Header */}
            <div className="bg-gradient-to-b from-blue-900/35 via-indigo-950/15 to-transparent px-5 pt-8 pb-6">
                <h1 className="text-white text-xl font-extrabold tracking-tight">Muat Naik Resit</h1>
                <p className="text-blue-300/70 text-xs font-medium mt-1">Snap gambar resit anda</p>
            </div>

            <form onSubmit={handleSubmit} className="px-5 -mt-1.5 space-y-4 pb-6 relative z-10">
                {/* Camera Area */}
                <div className="bg-white/[0.02] border border-white/[0.06] backdrop-blur-md rounded-3xl p-3 shadow-xl">
                    <div className={`rounded-2xl border-2 border-dashed overflow-hidden transition-all ${
                        preview ? 'border-blue-500/40' : errors.receipt_image ? 'border-red-500/40' : 'border-white/[0.08]'
                    }`}>
                        {preview ? (
                            <div className="relative">
                                <img src={preview} alt="Preview" className="w-full max-h-56 object-cover" />
                                <button
                                    type="button"
                                    onClick={() => { setData('receipt_image', null); setPreview(null); }}
                                    className="absolute top-2 right-2 w-8 h-8 bg-rose-500 text-white rounded-full flex items-center justify-center text-lg leading-none shadow"
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
                            <div className="flex gap-2 px-3 py-3">
                                <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 py-4 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-gray-300 font-medium hover:bg-white/[0.06] transition-colors">
                                    📷 Kamera
                                    <input type="file" accept="image/*" capture="environment" onChange={handleFile} className="hidden" />
                                </label>
                                <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 py-4 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-gray-300 font-medium hover:bg-white/[0.06] transition-colors">
                                    🖼️ Galeri
                                    <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
                                </label>
                            </div>
                        )}
                    </div>
                    {errors.receipt_image && <p className="mt-1.5 text-sm text-red-400 px-1">{errors.receipt_image}</p>}
                </div>

                {/* Category Grid */}
                <div className="bg-white/[0.02] border border-white/[0.06] backdrop-blur-md rounded-3xl p-4 shadow-xl">
                    <label className={label}>Kategori</label>
                    <div className="grid grid-cols-4 gap-2">
                        {Object.entries(CATEGORY_ICONS).map(([key, { icon, label: catLabel }]) => (
                            <button
                                key={key}
                                type="button"
                                onClick={() => setData('category', key)}
                                className={`flex flex-col items-center gap-1 rounded-xl py-3 transition-all border ${
                                    data.category === key
                                        ? 'bg-gradient-to-br from-blue-600 to-indigo-600 border-blue-500/40 text-white shadow-md shadow-blue-500/20'
                                        : 'bg-white/[0.02] border-white/[0.06] text-gray-400'
                                }`}
                            >
                                <span className="text-lg">{icon}</span>
                                <span className="text-[11px] font-medium leading-tight text-center">{catLabel}</span>
                            </button>
                        ))}
                    </div>
                    {errors.category && <p className="mt-2 text-sm text-red-400">{errors.category}</p>}
                </div>

                {/* Amount */}
                <div>
                    <label className={label}>Jumlah (RM)</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">RM</span>
                        <input
                            type="number" min="0.01" step="0.01"
                            value={data.amount}
                            onChange={(e) => setData('amount', e.target.value)}
                            placeholder="0.00"
                            className={`${field} pl-12 text-lg font-bold`}
                        />
                    </div>
                    {errors.amount && <p className="mt-1.5 text-sm text-red-400">{errors.amount}</p>}
                </div>

                {/* Vehicle */}
                <div>
                    <label className={label}>Kenderaan</label>
                    <select
                        value={data.vehicle_id}
                        onChange={(e) => setData('vehicle_id', e.target.value)}
                        className={field}
                    >
                        <option value="">-- Pilih Kenderaan --</option>
                        {vehicles?.map((v) => <option key={v.id} value={v.id}>{v.plate_number}</option>)}
                    </select>
                    {errors.vehicle_id && <p className="mt-1.5 text-sm text-red-400">{errors.vehicle_id}</p>}
                </div>

                {/* Date & Desc */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className={label}>Tarikh Resit</label>
                        <input
                            type="date" value={data.receipt_date}
                            onChange={(e) => setData('receipt_date', e.target.value)}
                            className={field}
                        />
                        {errors.receipt_date && <p className="mt-1 text-xs text-red-400">{errors.receipt_date}</p>}
                    </div>
                    <div>
                        <label className={label}>Nota</label>
                        <input
                            type="text" value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="cth: Shell Rawang"
                            className={field}
                        />
                    </div>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={processing || compressing}
                    className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-4 text-base font-bold text-white shadow-lg shadow-blue-500/20 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {compressing ? 'Mengecilkan imej...' : processing ? 'Memuat naik...' : 'Hantar Resit'}
                </button>
            </form>
        </DriverLayout>
    );
}
