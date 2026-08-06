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
                <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
                    <div className="w-20 h-20 rounded-3xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center mb-5 shadow-2xl">
                        <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-white">Akaun Belum Diaktifkan</h3>
                    <p className="text-gray-400 text-xs mt-2 leading-relaxed">Sila hubungi pentadbir syarikat atau pemilik kenderaan untuk mengkonfigurasi maklumat pemandu anda.</p>
                </div>
            </DriverLayout>
        );
    }

    return (
        <DriverLayout title="Papan Pemuka">
            {/* Header greeting & PWA */}
            <div className="bg-gradient-to-b from-blue-900/35 via-indigo-950/15 to-transparent px-5 pt-8 pb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-blue-400 text-xs font-bold uppercase tracking-wider">{greeting} 👋</p>
                        <h1 className="text-white text-xl font-extrabold mt-1 tracking-tight">{firstName}</h1>
                    </div>
                    {/* Small user avatar */}
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-sm font-extrabold text-white shadow-md shadow-blue-500/20">
                        {firstName.charAt(0).toUpperCase()}
                    </div>
                </div>

                {/* PWA Install Banner */}
                {showInstall && (
                    <div className="mt-5 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/30 backdrop-blur-md rounded-2xl p-4 flex items-center justify-between shadow-lg">
                        <div className="space-y-0.5">
                            <p className="text-white text-xs font-bold">Pasang Aplikasi LorryTech</p>
                            <p className="text-blue-300 text-[10px]">Akses pantas tugasan & komisyen anda</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={handleInstall} className="bg-white text-slate-900 text-[10px] font-extrabold px-3.5 py-2 rounded-xl shadow hover:bg-gray-100 transition-colors">
                                Pasang
                            </button>
                            <button onClick={() => setShowInstall(false)} className="text-white/40 hover:text-white text-sm px-2 py-1">✕</button>
                        </div>
                    </div>
                )}

                {/* Stat Grid */}
                <div className="mt-6 grid grid-cols-2 gap-3.5">
                    <div className="bg-white/[0.02] border border-white/[0.06] backdrop-blur-md rounded-3xl p-4 hover:bg-white/[0.04] transition-colors shadow-xl">
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Trip Bulan Ini</p>
                        <p className="text-white text-2xl font-extrabold mt-2.5 tracking-tight">{stats.trips_this_month}</p>
                        <p className="text-slate-500 text-[10px] font-medium mt-1.5">{stats.total_trips} trip keseluruhan</p>
                    </div>
                    
                    <div className="bg-white/[0.02] border border-white/[0.06] backdrop-blur-md rounded-3xl p-4 hover:bg-white/[0.04] transition-colors shadow-xl">
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Komisyen Bulanan</p>
                        <p className="text-emerald-400 text-lg font-extrabold mt-3 tracking-tight">
                            RM {Number(stats.commission_this_month).toLocaleString('en-MY', { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-slate-500 text-[10px] font-medium mt-1.5">Kadar semasa: {stats.commission_rate}%</p>
                    </div>

                    <div className="bg-white/[0.02] border border-white/[0.06] backdrop-blur-md rounded-3xl p-4 hover:bg-white/[0.04] transition-colors shadow-xl col-span-2 flex justify-between items-center">
                        <div>
                            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Komisyen Belum Bayar</p>
                            <p className="text-white text-lg font-extrabold mt-1.5 tracking-tight">
                                RM {Number(stats.pending_commission).toLocaleString('en-MY', { minimumFractionDigits: 2 })}
                            </p>
                            <p className="text-slate-500 text-[10px] font-medium mt-1">Diterima: RM {Number(stats.total_earned).toLocaleString('en-MY', { minimumFractionDigits: 2 })}</p>
                        </div>
                        <div className="bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0">
                            Menunggu Gaji
                        </div>
                    </div>
                    
                    <div className="bg-white/[0.02] border border-white/[0.06] backdrop-blur-md rounded-3xl p-4 hover:bg-white/[0.04] transition-colors shadow-xl col-span-2 flex justify-between items-center">
                        <div>
                            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Laporan Resit</p>
                            <p className="text-white text-lg font-extrabold mt-1.5 tracking-tight">{stats.receipts_this_month} Resit</p>
                            <p className="text-slate-500 text-[10px] font-medium mt-1">Telah dihantar untuk kelulusan bulan ini</p>
                        </div>
                        <span className="text-lg">🧾</span>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="px-5 -mt-1.5 relative z-10">
                <Link
                    href={route('driver.upload-receipt')}
                    className="flex items-center gap-4 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 active:scale-[0.98] rounded-3xl p-4 shadow-xl border border-white/[0.05] transition-all"
                >
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/10">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <div className="flex-1 text-left">
                        <p className="font-bold text-white text-sm">Hantar Resit Perbelanjaan</p>
                        <p className="text-xs text-gray-400 mt-0.5">Snap bil diesel, tol, atau maintenance</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white font-bold text-sm">
                        →
                    </div>
                </Link>
            </div>

            {/* Recent Trips Timeline Feed */}
            <div className="px-5 mt-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-bold text-gray-300 uppercase tracking-wider">Perjalanan Terkini</h2>
                    <Link href={route('driver.work', { tab: 'tugasan' })} className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors">Lihat Semua →</Link>
                </div>

                {recentTrips?.length > 0 ? (
                    <div className="space-y-4">
                        {recentTrips.map((trip) => (
                            <div key={trip.id} className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-5 shadow-lg text-left">
                                <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.05]">
                                    <div>
                                        <p className="text-[10px] font-bold text-blue-400 tracking-wider uppercase">{trip.trip_number}</p>
                                        <p className="text-[10px] text-gray-500 mt-0.5">{trip.pickup_date?.split('T')[0] || trip.pickup_date}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-extrabold text-white">RM {Number(trip.total_revenue).toFixed(2)}</p>
                                        <p className="text-[9px] text-gray-400 font-semibold mt-0.5">No Lorry: {trip.vehicle?.plate_number || '-'}</p>
                                    </div>
                                </div>

                                {/* Custom timeline route path indicator */}
                                <div className="mt-4 flex gap-3">
                                    <div className="flex flex-col items-center">
                                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-[#0B0F19] ring-2 ring-blue-500/20" />
                                        <span className="w-0.5 h-7 bg-dashed border-l border-white/[0.08]" />
                                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#0B0F19] ring-2 ring-emerald-500/20" />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between text-xs h-[48px]">
                                        <div className="font-semibold text-gray-300 truncate -mt-0.5">{trip.pickup_location}</div>
                                        <div className="font-semibold text-gray-400 truncate mt-1">{trip.delivery_location}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white/[0.01] rounded-3xl py-12 text-center border border-dashed border-white/[0.06]">
                        <span className="text-xl opacity-40">🚚</span>
                        <p className="text-gray-500 text-xs mt-2.5">Tiada perjalanan dijadualkan setakat ini.</p>
                    </div>
                )}
            </div>
        </DriverLayout>
    );
}
