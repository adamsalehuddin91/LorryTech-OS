import DriverLayout from '@/Layouts/DriverLayout';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';

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
                canvas.toBlob((blob) => resolve(new File([blob], file.name, { type: 'image/jpeg' })), 'image/jpeg', 0.75);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });

export default function LogJob({ lalamoveRate, sideJobRate }) {
    const { data, setData, post, processing, errors } = useForm({
        job_type:          'lalamove',
        job_date:          new Date().toISOString().split('T')[0],
        pickup_location:   '',
        delivery_location: '',
        customer_name:     '',
        gross_amount:      '',
        notes:             '',
        proof_image:       null,
    });

    const [preview, setPreview] = useState(null);
    const [compressing, setCompressing] = useState(false);

    const currentRate = data.job_type === 'lalamove' ? lalamoveRate : sideJobRate;
    const estimatedComm = data.gross_amount ? (parseFloat(data.gross_amount) * currentRate / 100).toFixed(2) : '0.00';

    const handleFile = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setCompressing(true);
        const compressed = await compressImage(file);
        setData('proof_image', compressed);
        setCompressing(false);
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(compressed);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('driver.store-job'), { forceFormData: true });
    };

    return (
        <DriverLayout title="Log Kerja">
            <div className="bg-gradient-to-br from-blue-700 to-blue-900 px-5 pt-12 pb-6">
                <h1 className="text-white text-xl font-bold">Log Kerja</h1>
                <p className="text-blue-200 text-sm mt-1">Rekod trip anda untuk komisyen</p>
            </div>

            <form onSubmit={handleSubmit} className="px-5 mt-5 space-y-5 pb-6">

                {/* Job Type Toggle */}
                <div className="grid grid-cols-2 gap-2">
                    {[
                        { value: 'lalamove', label: '🚚 Lalamove', rate: lalamoveRate },
                        { value: 'side_job', label: '💼 Job Tepi',  rate: sideJobRate },
                    ].map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => setData('job_type', opt.value)}
                            className={`rounded-2xl py-4 px-3 text-center border-2 transition-all ${
                                data.job_type === opt.value
                                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                                    : 'border-gray-200 bg-white text-gray-600'
                            }`}
                        >
                            <p className="text-xl mb-1">{opt.label.split(' ')[0]}</p>
                            <p className="text-sm font-semibold">{opt.label.split(' ').slice(1).join(' ')}</p>
                            <p className="text-xs mt-1 opacity-70">Komisyen {opt.rate}%</p>
                        </button>
                    ))}
                </div>

                {/* Commission Preview */}
                {data.gross_amount > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-2xl px-4 py-3 flex justify-between items-center">
                        <div>
                            <p className="text-xs text-green-600">Anggaran Komisyen</p>
                            <p className="text-xs text-green-500">{currentRate}% × RM {data.gross_amount}</p>
                        </div>
                        <p className="text-2xl font-bold text-green-700">RM {estimatedComm}</p>
                    </div>
                )}

                {/* Amount */}
                <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                        Jumlah Diterima (RM) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">RM</span>
                        <input
                            type="number" min="0.01" step="0.01"
                            value={data.gross_amount}
                            onChange={(e) => setData('gross_amount', e.target.value)}
                            placeholder="0.00"
                            className="w-full rounded-xl border border-gray-200 pl-12 pr-4 py-3.5 text-lg font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    {errors.gross_amount && <p className="mt-1 text-sm text-red-500">{errors.gross_amount}</p>}
                </div>

                {/* Date */}
                <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">Tarikh <span className="text-red-500">*</span></label>
                    <input
                        type="date" value={data.job_date}
                        onChange={(e) => setData('job_date', e.target.value)}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.job_date && <p className="mt-1 text-sm text-red-500">{errors.job_date}</p>}
                </div>

                {/* Route */}
                <div className="space-y-3">
                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                            Dari (Pickup) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-blue-500" />
                            <input
                                type="text" value={data.pickup_location}
                                onChange={(e) => setData('pickup_location', e.target.value)}
                                placeholder="cth: Klang, Selangor"
                                className="w-full rounded-xl border border-gray-200 pl-9 pr-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        {errors.pickup_location && <p className="mt-1 text-sm text-red-500">{errors.pickup_location}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                            Ke (Hantar) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-green-500" />
                            <input
                                type="text" value={data.delivery_location}
                                onChange={(e) => setData('delivery_location', e.target.value)}
                                placeholder="cth: Shah Alam, Selangor"
                                className="w-full rounded-xl border border-gray-200 pl-9 pr-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        {errors.delivery_location && <p className="mt-1 text-sm text-red-500">{errors.delivery_location}</p>}
                    </div>
                </div>

                {/* Customer (side job only) */}
                {data.job_type === 'side_job' && (
                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">Nama Pelanggan</label>
                        <input
                            type="text" value={data.customer_name}
                            onChange={(e) => setData('customer_name', e.target.value)}
                            placeholder="cth: Syarikat ABC Sdn Bhd"
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                )}

                {/* Proof Image */}
                <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                        {data.job_type === 'lalamove' ? 'Screenshot Lalamove (Optional)' : 'Bukti Job (Optional)'}
                    </label>
                    <label className="block cursor-pointer">
                        <div className={`rounded-2xl border-2 border-dashed overflow-hidden transition-all ${preview ? 'border-blue-400' : 'border-gray-200'}`}>
                            {preview ? (
                                <div className="relative">
                                    <img src={preview} alt="Proof" className="w-full max-h-40 object-cover" />
                                    <button
                                        type="button"
                                        onClick={(e) => { e.preventDefault(); setData('proof_image', null); setPreview(null); }}
                                        className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-lg shadow"
                                    >×</button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3 px-4 py-4 bg-gray-50">
                                    <div className="w-10 h-10 rounded-xl bg-gray-200 flex items-center justify-center text-xl">📷</div>
                                    <div>
                                        <p className="text-sm text-gray-600 font-medium">Tap untuk upload gambar</p>
                                        <p className="text-xs text-gray-400">Screenshot, resit, atau bukti job</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        <input type="file" accept="image/*" capture="environment" onChange={handleFile} className="hidden" />
                    </label>
                </div>

                {/* Notes */}
                <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">Nota (Optional)</label>
                    <textarea
                        value={data.notes}
                        onChange={(e) => setData('notes', e.target.value)}
                        placeholder="Maklumat tambahan..."
                        rows={2}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                </div>

                <button
                    type="submit"
                    disabled={processing || compressing}
                    className="w-full rounded-2xl bg-blue-600 py-4 text-base font-bold text-white shadow-lg hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50"
                >
                    {compressing ? 'Memproses gambar...' : processing ? 'Menghantar...' : 'Log Kerja Ini'}
                </button>
            </form>
        </DriverLayout>
    );
}
