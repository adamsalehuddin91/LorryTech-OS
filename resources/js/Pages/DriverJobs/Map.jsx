import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useRef } from 'react';

const MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

let mapsPromise = null;
function loadGoogleMaps() {
    if (!MAPS_KEY) return Promise.reject('no-key');
    if (window.google?.maps) return Promise.resolve();
    if (mapsPromise) return mapsPromise;
    mapsPromise = new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_KEY}`;
        s.async = true; s.onload = resolve; s.onerror = reject;
        document.head.appendChild(s);
    });
    return mapsPromise;
}

const COLORS = ['#2563eb', '#16a34a', '#db2777', '#ea580c', '#7c3aed', '#0891b2', '#ca8a04'];

export default function Map({ date, jobs, total_km }) {
    const mapRef = useRef(null);

    useEffect(() => {
        if (!MAPS_KEY) return;
        let cancelled = false;
        loadGoogleMaps().then(() => {
            if (cancelled || !mapRef.current) return;
            const map = new window.google.maps.Map(mapRef.current, {
                center: { lat: 3.139, lng: 101.687 }, zoom: 11, disableDefaultUI: false, streetViewControl: false, mapTypeControl: false,
            });
            const bounds = new window.google.maps.LatLngBounds();
            const driverColor = {};
            let ci = 0;
            jobs.forEach((j) => {
                if (!driverColor[j.driver_name]) driverColor[j.driver_name] = COLORS[ci++ % COLORS.length];
                const color = driverColor[j.driver_name];
                new window.google.maps.Marker({ position: j.pickup, map, label: { text: 'A', color: '#fff', fontSize: '10px', fontWeight: 'bold' }, title: `${j.driver_name} (Dari): ${j.pickup_location}` });
                new window.google.maps.Marker({ position: j.delivery, map, label: { text: 'B', color: '#fff', fontSize: '10px', fontWeight: 'bold' }, title: `${j.driver_name} (Ke): ${j.delivery_location}` });
                new window.google.maps.Polyline({ path: [j.pickup, j.delivery], map, geodesic: true, strokeColor: color, strokeOpacity: 0.85, strokeWeight: 3 });
                bounds.extend(j.pickup); bounds.extend(j.delivery);
            });
            if (jobs.length) map.fitBounds(bounds);
        }).catch(() => {});
        return () => { cancelled = true; };
    }, [jobs]);

    return (
        <AuthenticatedLayout>
            <Head title="Peta Kerja Driver" />
            <div className="p-4 space-y-4 max-w-5xl mx-auto">
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                        <h1 className="text-xl font-bold text-slate-100">Peta Kerja Driver</h1>
                        <p className="text-sm text-slate-400">Laluan & jarak kerja driver mengikut tarikh</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="date" value={date}
                            onChange={(e) => router.get(route('driver-jobs.map'), { date: e.target.value }, { preserveState: true })}
                            className="rounded-lg border-gray-300 text-sm text-gray-700"
                        />
                        <Link href={route('driver-jobs.index')} className="rounded-lg bg-white/10 border border-white/10 px-3 py-2 text-sm text-slate-200">Senarai</Link>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                        <p className="text-xs text-slate-400 uppercase">Jumlah Job</p>
                        <p className="text-xl font-bold text-slate-100">{jobs.length}</p>
                    </div>
                    <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                        <p className="text-xs text-slate-400 uppercase">Jumlah KM (anggaran)</p>
                        <p className="text-xl font-bold text-blue-400">{total_km} km</p>
                    </div>
                </div>

                {MAPS_KEY
                    ? <div ref={mapRef} className="h-[440px] rounded-2xl border border-white/10 bg-gray-100" />
                    : <p className="text-amber-400 text-sm rounded-xl bg-amber-500/10 border border-amber-500/20 p-3">Maps key belum di-set (VITE_GOOGLE_MAPS_API_KEY).</p>}

                <div className="space-y-2">
                    {jobs.length === 0 && (
                        <p className="text-slate-400 text-sm text-center py-8">Tiada kerja (berlokasi peta) untuk tarikh ini.</p>
                    )}
                    {jobs.map((j) => (
                        <div key={j.id} className="rounded-xl bg-white/5 border border-white/10 p-3 flex items-center justify-between gap-3">
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-slate-100">
                                    {j.driver_name} <span className="text-xs font-normal text-slate-400">· {j.job_type_label}</span>
                                </p>
                                <p className="text-xs text-slate-400 truncate">{j.pickup_location} → {j.delivery_location}</p>
                            </div>
                            <span className="text-sm font-bold text-blue-400 shrink-0">{j.distance_km} km</span>
                        </div>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
