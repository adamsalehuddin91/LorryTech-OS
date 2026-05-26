import DriverLayout from '@/Layouts/DriverLayout';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Dashboard({ stats, recentTrips, driverName }) {
    const [installPrompt, setInstallPrompt] = useState(null);
    const [showInstall, setShowInstall] = useState(false);

    useEffect(() => {
        const handler = (e) => { e.preventDefault(); setInstallPrompt(e); setShowInstall(true); };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
        if (!installPrompt) return;
        installPrompt.prompt();
        const { outcome } = await installPrompt.userChoice;
        if (outcome === 'accepted') setShowInstall(false);
        setInstallPrompt(null);
    };

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Selamat Pagi' : hour < 17 ? 'Selamat Tengahari' : 'Selamat Petang';
    const firstName = driverName?.split(' ')[0] || 'Pemandu';

    if (!stats) {
        return (
            <DriverLayout title="Papan Pemuka">
                <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <p className="text-gray-500 text-sm">Akaun pemandu belum dikonfigurasi.<br />Sila hubungi pemilik.</p>
                </div>
            </DriverLayout>
        );
    }

    return (
        <DriverLayout title="Papan Pemuka">
            {/* Header */}
            <div className="bg-gradient-to-br from-blue-700 to-blue-900 px-5 pt-12 pb-8">
                <p className="text-blue-200 text-sm">{greeting} 👋</p>
                <h1 className="text-white text-2xl font-bold mt-0.5">{firstName}</h1>

                {/* PWA Install Banner */}
                {showInstall && (
                    <div className="mt-4 bg-white/15 backdrop-blur rounded-xl p-3 flex items-center justify-between">
                        <div>
                            <p className="text-white text-sm font-semibold">Pasang Aplikasi</p>
                            <p className="text-blue-200 text-xs">Akses pantas dari skrin utama</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={handleInstall} className="bg-white text-blue-700 text-xs font-bold px-3 py-1.5 rounded-lg">
                                Pasang
                            </button>
                            <button onClick={() => setShowInstall(false)} className="text-white/60 text-xs px-1">✕</button>
                        </div>
                    </div>
                )}

                {/* Stat Grid */}
                <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="bg-white/15 backdrop-blur rounded-2xl p-4">
                        <p className="text-blue-200 text-xs">Trip Bulan Ini</p>
                        <p className="text-white text-3xl font-bold mt-1">{stats.trips_this_month}</p>
                        <p className="text-blue-300 text-xs mt-1">{stats.total_trips} jumlah keseluruhan</p>
                    </div>
                    <div className="bg-white/15 backdrop-blur rounded-2xl p-4">
                        <p className="text-blue-200 text-xs">Komisyen Bulan Ini</p>
                        <p className="text-white text-2xl font-bold mt-1">RM {Number(stats.commission_this_month).toFixed(2)}</p>
                        <p className="text-blue-300 text-xs mt-1">Kadar {stats.commission_rate}%</p>
                    </div>
                    <div className="bg-white/15 backdrop-blur rounded-2xl p-4">
                        <p className="text-blue-200 text-xs">Komisyen Belum Bayar</p>
                        <p className="text-white text-2xl font-bold mt-1">RM {Number(stats.pending_commission).toFixed(2)}</p>
                        <p className="text-blue-300 text-xs mt-1">Diterima: RM {Number(stats.total_earned).toFixed(2)}</p>
                    </div>
                    <div className="bg-white/15 backdrop-blur rounded-2xl p-4">
                        <p className="text-blue-200 text-xs">Resit Dimuat Naik</p>
                        <p className="text-white text-3xl font-bold mt-1">{stats.receipts_this_month}</p>
                        <p className="text-blue-300 text-xs mt-1">Bulan ini</p>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="px-5 -mt-4">
                <Link
                    href={route('driver.upload-receipt')}
                    className="flex items-center gap-4 bg-white rounded-2xl shadow-md p-4 border border-gray-100"
                >
                    <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <p className="font-semibold text-gray-900">Muat Naik Resit</p>
                        <p className="text-sm text-gray-500">Snap gambar resit sekarang</p>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
            </div>

            {/* Recent Trips */}
            <div className="px-5 mt-6">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-base font-bold text-gray-900">Perjalanan Terkini</h2>
                    <Link href={route('driver.work', { tab: 'tugasan' })} className="text-sm text-blue-600 font-medium">Lihat semua</Link>
                </div>

                {recentTrips?.length > 0 ? (
                    <div className="space-y-3">
                        {recentTrips.map((trip) => (
                            <div key={trip.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-blue-600">{trip.trip_number}</p>
                                        <p className="text-sm font-semibold text-gray-900 mt-0.5 truncate">
                                            {trip.pickup_location}
                                        </p>
                                        <div className="flex items-center gap-1 text-gray-400">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                            </svg>
                                            <p className="text-sm text-gray-600 truncate">{trip.delivery_location}</p>
                                        </div>
                                    </div>
                                    <div className="text-right ml-3 flex-shrink-0">
                                        <p className="text-base font-bold text-gray-900">RM {Number(trip.total_revenue).toFixed(2)}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">{trip.vehicle?.plate_number || '-'}</p>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-400 mt-2">{trip.pickup_date?.split('T')[0] || trip.pickup_date}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
                        <p className="text-gray-400 text-sm">Tiada perjalanan lagi</p>
                    </div>
                )}
            </div>
        </DriverLayout>
    );
}
