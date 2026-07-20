import DriverLayout from '@/Layouts/DriverLayout';
import { compressImage } from '@/utils/compressImage';
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
        s.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_KEY}&libraries=places,geometry`;
        s.async = true;
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
    });
    return mapsPromise;
}

export default function LogJob({ lalamoveRate, sideJobRate, vehicles = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        job_type:          'lalamove',
        vehicle_id:        '',
        job_date:          new Date().toISOString().split('T')[0],
        pickup_location:   '',
        pickup_lat:        null,
        pickup_lng:        null,
        delivery_location: '',
        delivery_lat:      null,
        delivery_lng:      null,
        distance_km:       null,
        duration_min:      null,
        route_polyline:    null,
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
    const [nearbyPlaces, setNearbyPlaces] = useState([]);
    const [showNearby, setShowNearby] = useState(false);

    const pickupRef = useRef(null);
    const deliveryRef = useRef(null);
    const pickupCoords = useRef(null);
    const deliveryCoords = useRef(null);
    const mapRef = useRef(null);
    const mapObj = useRef(null);
    const dirRenderer = useRef(null);
    const dirService = useRef(null);

    const currentRate = data.job_type === 'lalamove' ? lalamoveRate : sideJobRate;
    const estimatedComm = data.gross_amount ? (parseFloat(data.gross_amount) * currentRate / 100).toFixed(2) : '0.00';

    // ── Google Maps: load + attach autocomplete ──
    useEffect(() => {
        if (!MAPS_KEY) return;
        let cancelled = false;
        loadGoogleMaps().then(() => {
            if (cancelled) return;
            setMapsReady(true);

            // Route map + directions (Directions API)
            if (mapRef.current && !mapObj.current) {
                mapObj.current = new window.google.maps.Map(mapRef.current, {
                    center: { lat: 3.139, lng: 101.687 }, zoom: 10, disableDefaultUI: true, zoomControl: true,
                });
                dirRenderer.current = new window.google.maps.DirectionsRenderer({ map: mapObj.current });
                dirService.current = new window.google.maps.DirectionsService();
            }

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
        if (!o || !dst || !dirService.current) return;
        setCalcStatus('calc');
        dirService.current.route({
            origin: o, destination: dst, travelMode: 'DRIVING',
        }, (res, status) => {
            const leg = res?.routes?.[0]?.legs?.[0];
            if (status === 'OK' && leg) {
                const km = +(leg.distance.value / 1000).toFixed(2);
                const min = Math.round(leg.duration.value / 60);
                // encode road route once → reused on admin map (no extra API call)
                const poly = window.google.maps.geometry?.encoding?.encodePath(res.routes[0].overview_path) || null;
                setData((d) => ({ ...d, distance_km: km, duration_min: min, route_polyline: poly }));
                setCalcStatus('done');
                if (dirRenderer.current) dirRenderer.current.setDirections(res); // lukis laluan atas peta
            } else {
                setCalcStatus('fail');
            }
        });
    };

    // ── GPS: "Lokasi Saya Sekarang" for pickup ──
    const setPickup = (name, lat, lng) => {
        pickupCoords.current = { lat, lng };
        if (pickupRef.current) pickupRef.current.value = name;
        setData((d) => ({ ...d, pickup_location: name, pickup_lat: lat, pickup_lng: lng }));
        tryComputeDistance();
    };

    const useMyLocation = () => {
        if (!navigator.geolocation || !window.google?.maps) return;
        setLocating(true);
        navigator.geolocation.getCurrentPosition((pos) => {
            const lat = pos.coords.latitude, lng = pos.coords.longitude;
            // default fill — reverse geocode
            new window.google.maps.Geocoder().geocode({ location: { lat, lng } }, (results, status) => {
                const addr = status === 'OK' && results[0] ? results[0].formatted_address : `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
                setPickup(addr, lat, lng);
                setLocating(false);
            });
            // nearby landmarks — driver boleh pilih yang lebih jelas
            if (mapObj.current) {
                new window.google.maps.places.PlacesService(mapObj.current).nearbySearch(
                    { location: { lat, lng }, radius: 350 },
                    (results, status) => {
                        if (status === 'OK' && results?.length) {
                            setNearbyPlaces(results.slice(0, 6));
                            setShowNearby(true);
                        }
                    }
                );
            }
        }, () => { setLocating(false); alert('Tak dapat akses lokasi. Benarkan GPS atau taip manual.'); }, { enableHighAccuracy: true, timeout: 10000 });
    };

    const pickNearby = (pl) => {
        const name = pl.vicinity ? `${pl.name}, ${pl.vicinity}` : pl.name;
        setPickup(name, pl.geometry.location.lat(), pl.geometry.location.lng());
        setShowNearby(false);
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

    const field = 'w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 transition-colors';
    const label = 'block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2';

    return (
        <DriverLayout title="Log Kerja">
            <div className="bg-gradient-to-b from-blue-900/35 via-indigo-950/15 to-transparent px-5 pt-8 pb-6">
                <h1 className="text-white text-2xl font-extrabold tracking-tight">Log Kerja</h1>
                <p className="text-blue-300/70 text-xs font-medium mt-1">Rekod trip anda untuk komisyen</p>
            </div>

            <form onSubmit={handleSubmit} className="px-5 -mt-1.5 space-y-4 pb-6 relative z-10">

                {/* Job Type Toggle */}
                <div className="grid grid-cols-2 gap-2.5">
                    {[
                        { value: 'lalamove', label: '🚚 Lalamove', rate: lalamoveRate },
                        { value: 'side_job', label: '💼 Job Tepi',  rate: sideJobRate },
                    ].map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => setData('job_type', opt.value)}
                            className={`rounded-2xl py-4 px-3 text-center border transition-all ${
                                data.job_type === opt.value
                                    ? 'border-blue-500/40 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 text-white shadow-lg shadow-blue-500/10'
                                    : 'border-white/[0.06] bg-white/[0.02] text-gray-400'
                            }`}
                        >
                            <p className="text-xl mb-1">{opt.label.split(' ')[0]}</p>
                            <p className="text-sm font-semibold">{opt.label.split(' ').slice(1).join(' ')}</p>
                            <p className="text-xs mt-1 opacity-70">Komisyen {opt.rate}%</p>
                        </button>
                    ))}
                </div>

                {/* Vehicle / Lori */}
                <div>
                    <label className={label}>
                        Kenderaan (Lori) <span className="text-red-400">*</span>
                    </label>
                    <select
                        value={data.vehicle_id}
                        onChange={(e) => setData('vehicle_id', e.target.value)}
                        className={field}
                    >
                        <option value="">-- Pilih Lori --</option>
                        {vehicles.map((v) => (
                            <option key={v.id} value={v.id}>
                                {v.plate_number}{v.make_model ? ` — ${v.make_model}` : ''}
                            </option>
                        ))}
                    </select>
                    {vehicles.length === 0 && (
                        <p className="mt-1 text-xs text-amber-500">Tiada lori aktif. Sila hubungi admin.</p>
                    )}
                    {errors.vehicle_id && <p className="mt-1 text-sm text-red-400">{errors.vehicle_id}</p>}
                </div>

                {/* Commission Preview */}
                {data.gross_amount > 0 && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-4 py-3 flex justify-between items-center">
                        <div>
                            <p className="text-xs text-emerald-400/80">Anggaran Komisyen</p>
                            <p className="text-xs text-emerald-400/60">{currentRate}% × RM {data.gross_amount}</p>
                        </div>
                        <p className="text-2xl font-bold text-emerald-400">RM {estimatedComm}</p>
                    </div>
                )}

                {/* Amount */}
                <div>
                    <label className={label}>
                        Jumlah Diterima (RM) <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">RM</span>
                        <input
                            type="number" min="0.01" step="0.01"
                            value={data.gross_amount}
                            onChange={(e) => setData('gross_amount', e.target.value)}
                            placeholder="0.00"
                            className={`${field} pl-12 text-lg font-bold`}
                        />
                    </div>
                    {errors.gross_amount && <p className="mt-1 text-sm text-red-400">{errors.gross_amount}</p>}
                </div>

                {/* Date */}
                <div>
                    <label className={label}>Tarikh <span className="text-red-400">*</span></label>
                    <input
                        type="date" value={data.job_date}
                        onChange={(e) => setData('job_date', e.target.value)}
                        className={field}
                    />
                    {errors.job_date && <p className="mt-1 text-sm text-red-400">{errors.job_date}</p>}
                </div>

                {/* Route */}
                <div className="bg-white/[0.02] border border-white/[0.06] backdrop-blur-md rounded-3xl p-4 shadow-xl space-y-3">
                    {/* Pickup */}
                    <div>
                        <div className="flex items-center justify-between mb-2.5">
                            <label className={`${label} mb-0`}>
                                Dari (Pickup) <span className="text-red-400">*</span>
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
                                className={`${field} pl-9`}
                            />
                        </div>
                        {showNearby && nearbyPlaces.length > 0 && (
                            <div className="mt-2 rounded-xl border border-white/[0.08] bg-[#12172a] p-2 shadow-lg">
                                <div className="flex items-center justify-between px-1 mb-1">
                                    <p className="text-[11px] text-gray-400">📍 Landmark berdekatan — pilih:</p>
                                    <button type="button" onClick={() => setShowNearby(false)} className="text-[11px] text-gray-500">tutup ✕</button>
                                </div>
                                <div className="max-h-44 overflow-y-auto space-y-0.5">
                                    {nearbyPlaces.map((pl) => (
                                        <button type="button" key={pl.place_id} onClick={() => pickNearby(pl)}
                                            className="w-full text-left px-2 py-2 rounded-lg hover:bg-white/[0.05] active:bg-white/[0.08]">
                                            <span className="text-sm font-semibold text-gray-200">{pl.name}</span>
                                            {pl.vicinity && <span className="block text-xs text-gray-500">{pl.vicinity}</span>}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        {errors.pickup_location && <p className="mt-1 text-sm text-red-400">{errors.pickup_location}</p>}
                    </div>
                    {/* Delivery */}
                    <div>
                        <label className={label}>
                            Ke (Hantar) <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-emerald-500" />
                            <input
                                ref={deliveryRef}
                                type="text" defaultValue={data.delivery_location}
                                onChange={(e) => { deliveryCoords.current = null; setData((d) => ({ ...d, delivery_location: e.target.value, delivery_lat: null, delivery_lng: null, distance_km: null, duration_min: null })); setCalcStatus(null); }}
                                placeholder={MAPS_KEY ? 'Cari tempat… cth: Shah Alam' : 'cth: Shah Alam, Selangor'}
                                className={`${field} pl-9`}
                            />
                        </div>
                        {errors.delivery_location && <p className="mt-1 text-sm text-red-400">{errors.delivery_location}</p>}
                    </div>

                    {/* Distance preview */}
                    {MAPS_KEY && (calcStatus === 'calc' || data.distance_km != null) && (
                        <div className="rounded-2xl bg-blue-500/10 border border-blue-500/20 px-4 py-3 flex items-center justify-between">
                            <span className="text-xs font-medium text-blue-400">🚗 Anggaran jarak (jalan)</span>
                            {calcStatus === 'calc'
                                ? <span className="text-sm font-semibold text-blue-400">Mengira…</span>
                                : <span className="text-lg font-bold text-blue-300">{data.distance_km} km<span className="text-xs font-medium text-blue-400"> · ~{data.duration_min} min</span></span>}
                        </div>
                    )}
                    {calcStatus === 'fail' && <p className="text-xs text-amber-500">Tak dapat kira jarak — boleh hantar tanpa KM.</p>}
                    {!MAPS_KEY && <p className="text-[11px] text-slate-500">ℹ️ Maps belum aktif — taip lokasi manual (KM tak auto-kira).</p>}
                    {MAPS_KEY && <div ref={mapRef} className="h-52 rounded-2xl overflow-hidden border border-white/[0.08]" />}
                </div>

                {/* Customer (side job only) */}
                {data.job_type === 'side_job' && (
                    <div>
                        <label className={label}>Nama Pelanggan</label>
                        <input
                            type="text" value={data.customer_name}
                            onChange={(e) => setData('customer_name', e.target.value)}
                            placeholder="cth: Syarikat ABC Sdn Bhd"
                            className={field}
                        />
                    </div>
                )}

                {/* Proof Image */}
                <div>
                    <label className={label}>
                        {data.job_type === 'lalamove' ? 'Screenshot Lalamove (Optional)' : 'Bukti Job (Optional)'}
                    </label>
                    <div className={`rounded-2xl border-2 border-dashed overflow-hidden transition-all ${preview ? 'border-blue-500/40' : 'border-white/[0.08]'}`}>
                        {preview ? (
                            <div className="relative">
                                <img src={preview} alt="Proof" className="w-full max-h-40 object-cover" />
                                <button
                                    type="button"
                                    onClick={() => { setData('proof_image', null); setPreview(null); }}
                                    className="absolute top-2 right-2 w-8 h-8 bg-rose-500 text-white rounded-full flex items-center justify-center text-lg shadow"
                                >×</button>
                            </div>
                        ) : (
                            <div className="flex gap-2 px-3 py-3 bg-white/[0.02]">
                                <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-gray-300 font-medium hover:bg-white/[0.06] transition-colors">
                                    📷 Kamera
                                    <input type="file" accept="image/*" capture="environment" onChange={handleFile} className="hidden" />
                                </label>
                                <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-gray-300 font-medium hover:bg-white/[0.06] transition-colors">
                                    🖼️ Galeri
                                    <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
                                </label>
                            </div>
                        )}
                    </div>
                </div>

                {/* Notes */}
                <div>
                    <label className={label}>Nota (Optional)</label>
                    <textarea
                        value={data.notes}
                        onChange={(e) => setData('notes', e.target.value)}
                        placeholder="Maklumat tambahan..."
                        rows={2}
                        className={`${field} resize-none`}
                    />
                </div>

                <button
                    type="submit"
                    disabled={processing || compressing}
                    className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-4 text-base font-bold text-white shadow-lg shadow-blue-500/20 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                    {compressing ? 'Memproses gambar...' : processing ? 'Menghantar...' : 'Log Kerja Ini'}
                </button>
            </form>
        </DriverLayout>
    );
}
