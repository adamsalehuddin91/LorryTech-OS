import DriverLayout from '@/Layouts/DriverLayout';
import { useForm } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';

const MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Load Google Maps JS (Places) once.
let mapsPromise = null;
function loadGoogleMaps() {
    if (!MAPS_KEY) return Promise.reject('no-key');
    if (window.google?.maps?.places) return Promise.resolve();
    if (mapsPromise) return mapsPromise;
    mapsPromise = new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_KEY}&libraries=places`;
        s.async = true;
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
    });
    return mapsPromise;
}

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
        pickup_lat:        null,
        pickup_lng:        null,
        delivery_location: '',
        delivery_lat:      null,
        delivery_lng:      null,
        distance_km:       null,
        duration_min:      null,
        customer_name:     '',
        gross_amount:      '',
        notes:             '',
        proof_image:       null,
    });

    const [preview, setPreview] = useState(null);
    const [compressing, setCompressing] = useState(false);
    const [mapsReady, setMapsReady] = useState(false);
    const [locating, setLocating] = useState(false);
    const [calcStatus, setCalcStatus] = useState(null); // null | 'calc' | 'done' | 'fail'

    const pickupRef = useRef(null);
    const deliveryRef = useRef(null);
    const pickupCoords = useRef(null);
    const deliveryCoords = useRef(null);

    const currentRate = data.job_type === 'lalamove' ? lalamoveRate : sideJobRate;
    const estimatedComm = data.gross_amount ? (parseFloat(data.gross_amount) * currentRate / 100).toFixed(2) : '0.00';

    // ── Google Maps: load + attach autocomplete ──
    useEffect(() => {
        if (!MAPS_KEY) return;
        let cancelled = false;
        loadGoogleMaps().then(() => {
            if (cancelled) return;
            setMapsReady(true);
            const opts = { fields: ['geometry', 'formatted_address'], componentRestrictions: { country: 'my' } };

            if (pickupRef.current) {
                const ac = new window.google.maps.places.Autocomplete(pickupRef.current, opts);
                ac.addListener('place_changed', () => {
                    const p = ac.getPlace();
                    if (!p.geometry) return;
                    pickupCoords.current = { lat: p.geometry.location.lat(), lng: p.geometry.location.lng() };
                    setData((d) => ({ ...d, pickup_location: p.formatted_address || d.pickup_location, pickup_lat: pickupCoords.current.lat, pickup_lng: pickupCoords.current.lng }));
                    tryComputeDistance();
                });
            }
            if (deliveryRef.current) {
                const ac = new window.google.maps.places.Autocomplete(deliveryRef.current, opts);
                ac.addListener('place_changed', () => {
                    const p = ac.getPlace();
                    if (!p.geometry) return;
                    deliveryCoords.current = { lat: p.geometry.location.lat(), lng: p.geometry.location.lng() };
                    setData((d) => ({ ...d, delivery_location: p.formatted_address || d.delivery_location, delivery_lat: deliveryCoords.current.lat, delivery_lng: deliveryCoords.current.lng }));
                    tryComputeDistance();
                });
            }
        }).catch(() => {});
        return () => { cancelled = true; };
    }, []);

    // ── Auto-calculate driving distance once both points set ──
    const tryComputeDistance = () => {
        const o = pickupCoords.current, dst = deliveryCoords.current;
        if (!o || !dst || !window.google?.maps) return;
        setCalcStatus('calc');
        new window.google.maps.DistanceMatrixService().getDistanceMatrix({
            origins: [o], destinations: [dst], travelMode: 'DRIVING',
        }, (res, status) => {
            const el = res?.rows?.[0]?.elements?.[0];
            if (status === 'OK' && el?.status === 'OK') {
                const km = +(el.distance.value / 1000).toFixed(2);
                const min = Math.round(el.duration.value / 60);
                setData((d) => ({ ...d, distance_km: km, duration_min: min }));
                setCalcStatus('done');
            } else {
                setCalcStatus('fail');
            }
        });
    };

    // ── GPS: "Lokasi Saya Sekarang" for pickup ──
    const useMyLocation = () => {
        if (!navigator.geolocation || !window.google?.maps) return;
        setLocating(true);
        navigator.geolocation.getCurrentPosition((pos) => {
            const lat = pos.coords.latitude, lng = pos.coords.longitude;
            pickupCoords.current = { lat, lng };
            new window.google.maps.Geocoder().geocode({ location: { lat, lng } }, (results, status) => {
                const addr = status === 'OK' && results[0] ? results[0].formatted_address : `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
                if (pickupRef.current) pickupRef.current.value = addr;
                setData((d) => ({ ...d, pickup_location: addr, pickup_lat: lat, pickup_lng: lng }));
                setLocating(false);
                tryComputeDistance();
            });
        }, () => { setLocating(false); alert('Tak dapat akses lokasi. Benarkan GPS atau taip manual.'); }, { enableHighAccuracy: true, timeout: 10000 });
    };

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
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
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
                    <label className="block text-sm font-semibold text-slate-200 mb-2">Tarikh <span className="text-red-500">*</span></label>
                    <input
                        type="date" value={data.job_date}
                        onChange={(e) => setData('job_date', e.target.value)}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.job_date && <p className="mt-1 text-sm text-red-500">{errors.job_date}</p>}
                </div>

                {/* Route */}
                <div className="space-y-3">
                    {/* Pickup */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-semibold text-slate-200">
                                Dari (Pickup) <span className="text-red-500">*</span>
                            </label>
                            {MAPS_KEY && (
                                <button type="button" onClick={useMyLocation} disabled={locating}
                                    className="text-xs font-semibold text-blue-400 flex items-center gap-1 disabled:opacity-50">
                                    📍 {locating ? 'Mencari…' : 'Lokasi Saya'}
                                </button>
                            )}
                        </div>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-blue-500" />
                            <input
                                ref={pickupRef}
                                type="text" defaultValue={data.pickup_location}
                                onChange={(e) => { pickupCoords.current = null; setData((d) => ({ ...d, pickup_location: e.target.value, pickup_lat: null, pickup_lng: null, distance_km: null, duration_min: null })); setCalcStatus(null); }}
                                placeholder={MAPS_KEY ? 'Cari tempat… cth: Klang' : 'cth: Klang, Selangor'}
                                className="w-full rounded-xl border border-gray-200 pl-9 pr-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        {errors.pickup_location && <p className="mt-1 text-sm text-red-500">{errors.pickup_location}</p>}
                    </div>
                    {/* Delivery */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-200 mb-2">
                            Ke (Hantar) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-green-500" />
                            <input
                                ref={deliveryRef}
                                type="text" defaultValue={data.delivery_location}
                                onChange={(e) => { deliveryCoords.current = null; setData((d) => ({ ...d, delivery_location: e.target.value, delivery_lat: null, delivery_lng: null, distance_km: null, duration_min: null })); setCalcStatus(null); }}
                                placeholder={MAPS_KEY ? 'Cari tempat… cth: Shah Alam' : 'cth: Shah Alam, Selangor'}
                                className="w-full rounded-xl border border-gray-200 pl-9 pr-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        {errors.delivery_location && <p className="mt-1 text-sm text-red-500">{errors.delivery_location}</p>}
                    </div>

                    {/* Distance preview */}
                    {MAPS_KEY && (calcStatus === 'calc' || data.distance_km != null) && (
                        <div className="rounded-2xl bg-blue-50 border border-blue-200 px-4 py-3 flex items-center justify-between">
                            <span className="text-xs font-medium text-blue-600">🚗 Anggaran jarak (jalan)</span>
                            {calcStatus === 'calc'
                                ? <span className="text-sm font-semibold text-blue-500">Mengira…</span>
                                : <span className="text-lg font-bold text-blue-700">{data.distance_km} km<span className="text-xs font-medium text-blue-500"> · ~{data.duration_min} min</span></span>}
                        </div>
                    )}
                    {calcStatus === 'fail' && <p className="text-xs text-amber-500">Tak dapat kira jarak — boleh hantar tanpa KM.</p>}
                    {!MAPS_KEY && <p className="text-[11px] text-slate-400">ℹ️ Maps belum aktif — taip lokasi manual (KM tak auto-kira).</p>}
                </div>

                {/* Customer (side job only) */}
                {data.job_type === 'side_job' && (
                    <div>
                        <label className="block text-sm font-semibold text-slate-200 mb-2">Nama Pelanggan</label>
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
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                        {data.job_type === 'lalamove' ? 'Screenshot Lalamove (Optional)' : 'Bukti Job (Optional)'}
                    </label>
                    <div className={`rounded-2xl border-2 border-dashed overflow-hidden transition-all ${preview ? 'border-blue-400' : 'border-gray-200'}`}>
                        {preview ? (
                            <div className="relative">
                                <img src={preview} alt="Proof" className="w-full max-h-40 object-cover" />
                                <button
                                    type="button"
                                    onClick={() => { setData('proof_image', null); setPreview(null); }}
                                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-lg shadow"
                                >×</button>
                            </div>
                        ) : (
                            <div className="flex gap-2 px-4 py-4 bg-gray-50">
                                <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 py-3 rounded-xl bg-white border border-gray-200 text-sm text-gray-600 font-medium hover:bg-gray-50">
                                    📷 Kamera
                                    <input type="file" accept="image/*" capture="environment" onChange={handleFile} className="hidden" />
                                </label>
                                <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 py-3 rounded-xl bg-white border border-gray-200 text-sm text-gray-600 font-medium hover:bg-gray-50">
                                    🖼️ Galeri
                                    <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
                                </label>
                            </div>
                        )}
                    </div>
                </div>

                {/* Notes */}
                <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">Nota (Optional)</label>
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
