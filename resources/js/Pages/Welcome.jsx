import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome({ auth }) {
    const { company } = usePage().props;
    // Jenama client kalau Tetapan Syarikat diisi; kalau tidak, nama produk.
    const brand = company?.name || 'SwiftFleet';

    return (
        <>
            <Head title="Sistem Pengurusan Armada Lorry Terbaik" />
            <div className="min-h-screen bg-[#0B0F19] text-gray-100 overflow-x-hidden selection:bg-blue-600 selection:text-white font-sans">
                
                {/* Background decorative elements */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none overflow-hidden z-0">
                    <div className="absolute top-[-10%] left-[10%] w-[400px] h-[400px] rounded-full bg-blue-600/10 blur-[120px] animate-blob" />
                    <div className="absolute top-[20%] right-[10%] w-[350px] h-[350px] rounded-full bg-indigo-600/10 blur-[100px] animate-blob animation-delay-2000" />
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370a_1px,transparent_1px),linear-gradient(to_bottom,#1f29370a_1px,transparent_1px)] bg-[size:24px_24px] opacity-30" />
                </div>

                {/* Navbar */}
                <header className="relative z-10 border-b border-gray-800 bg-[#0B0F19]/80 backdrop-blur-md sticky top-0">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-20 items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 17h.01M16 17h.01M3 11l1.5-5A2 2 0 016.4 4h11.2a2 2 0 011.9 1.4L21 11M3 11v6a1 1 0 001 1h1m16-7v6a1 1 0 01-1 1h-1M3 11h18" />
                                    </svg>
                                </div>
                                <span className="text-xl font-extrabold text-white tracking-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text">{brand}</span>
                            </div>

                            <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-400">
                                <a href="#ciri" className="hover:text-white transition-colors">Ciri Platform</a>
                                <a href="#pemandu" className="hover:text-white transition-colors">Portal Pemandu</a>
                                <a href="#prestasi" className="hover:text-white transition-colors">Kelebihan</a>
                                <a href="#harga" className="hover:text-white transition-colors">Harga</a>
                            </nav>

                            <div className="flex items-center gap-4">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:from-blue-500 hover:to-indigo-500 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                                    >
                                        Papan Pemuka
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="text-sm font-semibold text-gray-300 hover:text-white transition-colors px-3 py-2"
                                        >
                                            Log Masuk
                                        </Link>
                                        <Link
                                            href={route('login')}
                                            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg shadow-blue-600/10"
                                        >
                                            Mula Percuma
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="relative z-10 pt-16 pb-20 sm:pt-24 sm:pb-28">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-400 border border-blue-500/20 mb-6">
                            🚀 Generasi Baru Pengurusan Logistik
                        </span>
                        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl max-w-4xl mx-auto leading-tight">
                            Urus Armada Lorry Anda dengan{' '}
                            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                                Pintar & Sistematik
                            </span>
                        </h1>
                        <p className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                            Satukan pengurusan kenderaan, tugasan perjalanan, sebut harga, invois automatik, perbelanjaan, dan komisyen pemandu dalam satu sistem operasi bersepadu.
                        </p>

                        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href={route('login')}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-blue-500/20 hover:from-blue-500 hover:to-indigo-500 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
                            >
                                Mulakan Sekarang
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </Link>
                            <a
                                href="#ciri"
                                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-gray-800 bg-gray-900/50 hover:bg-gray-900 px-8 py-4 text-base font-semibold text-gray-300 hover:text-white transition-all duration-300"
                            >
                                Lihat Ciri-ciri
                            </a>
                        </div>

                        {/* Interactive Hero Mockup Card */}
                        <div className="mt-16 sm:mt-20 relative rounded-2xl border border-gray-800 bg-gray-900/40 p-4 sm:p-6 shadow-2xl backdrop-blur-md max-w-5xl mx-auto overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/5 to-indigo-600/5 pointer-events-none" />
                            
                            {/* Window header */}
                            <div className="flex items-center justify-between pb-4 border-b border-gray-800/80 mb-6">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-red-500/80" />
                                    <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                    <span className="w-3 h-3 rounded-full bg-green-500/80" />
                                    <span className="text-xs text-gray-500 font-medium ml-2">lorrytech-os-dashboard.png</span>
                                </div>
                                <div className="flex gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-700" />
                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-700" />
                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-700" />
                                </div>
                            </div>

                            {/* Inner Mockup UI */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-left">
                                {/* Side mockup navigation */}
                                <div className="hidden md:block space-y-2 border-r border-gray-800/80 pr-4">
                                    <div className="h-8 rounded bg-blue-600/20 border border-blue-500/30 flex items-center px-3 text-xs font-semibold text-blue-400">Papan Pemuka</div>
                                    <div className="h-8 rounded hover:bg-gray-800/40 flex items-center px-3 text-xs text-gray-500 transition-colors">Urusan Armada</div>
                                    <div className="h-8 rounded hover:bg-gray-800/40 flex items-center px-3 text-xs text-gray-500 transition-colors">Tugasan Pemandu</div>
                                    <div className="h-8 rounded hover:bg-gray-800/40 flex items-center px-3 text-xs text-gray-500 transition-colors">Sebut Harga & Invois</div>
                                    <div className="h-8 rounded hover:bg-gray-800/40 flex items-center px-3 text-xs text-gray-500 transition-colors">Penggajian</div>
                                    <div className="h-8 rounded hover:bg-gray-800/40 flex items-center px-3 text-xs text-gray-500 transition-colors">Laporan Belanja</div>
                                </div>

                                {/* Mockup content */}
                                <div className="md:col-span-3 space-y-6">
                                    {/* Stat Grid */}
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="bg-gray-950/60 border border-gray-800 rounded-xl p-3 sm:p-4">
                                            <p className="text-[10px] sm:text-xs text-gray-500 font-semibold uppercase">Hasil Bulan Ini</p>
                                            <p className="text-sm sm:text-xl font-bold text-emerald-400 mt-1">RM 48,250.00</p>
                                            <span className="text-[8px] sm:text-[10px] text-green-500 flex items-center gap-0.5 mt-1">↑ 12% vs lalu</span>
                                        </div>
                                        <div className="bg-gray-950/60 border border-gray-800 rounded-xl p-3 sm:p-4">
                                            <p className="text-[10px] sm:text-xs text-gray-500 font-semibold uppercase">Trip Selesai</p>
                                            <p className="text-sm sm:text-xl font-bold text-blue-400 mt-1">142 Trip</p>
                                            <span className="text-[8px] sm:text-[10px] text-gray-500 flex items-center gap-0.5 mt-1">Selesai 99.8%</span>
                                        </div>
                                        <div className="bg-gray-950/60 border border-gray-800 rounded-xl p-3 sm:p-4">
                                            <p className="text-[10px] sm:text-xs text-gray-500 font-semibold uppercase">Belum Berinvois</p>
                                            <p className="text-sm sm:text-xl font-bold text-amber-500 mt-1">RM 8,400.00</p>
                                            <span className="text-[8px] sm:text-[10px] text-amber-500 flex items-center gap-0.5 mt-1">3 Tugasan aktif</span>
                                        </div>
                                    </div>

                                    {/* Table Mockup */}
                                    <div className="bg-gray-950/60 border border-gray-800 rounded-xl p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-xs font-bold text-gray-300">Jadual Perjalanan Terkini</span>
                                            <span className="text-[10px] text-blue-400 font-semibold">Urus Semua</span>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-xs bg-gray-900/60 p-2.5 rounded-lg border border-gray-800/50">
                                                <div className="font-semibold text-gray-300">TRIP-2026-0042</div>
                                                <div className="text-gray-500 text-[10px] sm:text-xs hidden sm:block">Ipoh → Shah Alam</div>
                                                <div className="font-medium text-gray-300">RM 1,200</div>
                                                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-medium">Selesai</span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs bg-gray-900/60 p-2.5 rounded-lg border border-gray-800/50">
                                                <div className="font-semibold text-gray-300">TRIP-2026-0043</div>
                                                <div className="text-gray-500 text-[10px] sm:text-xs hidden sm:block">Pelabuhan Klang → Johor</div>
                                                <div className="font-medium text-gray-300">RM 2,850</div>
                                                <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-medium">Dalam Transit</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Ciri-Ciri Utama */}
                <section id="ciri" className="relative z-10 py-20 sm:py-24 border-t border-gray-900 bg-gray-950/40">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <span className="text-sm font-bold text-blue-500 uppercase tracking-widest">KEUPAYAAN SISTEM</span>
                            <h2 className="text-3xl font-extrabold text-white mt-3 sm:text-4xl">Semua Alat Pengurusan Armada Lorry Dalam Satu Tempat</h2>
                            <p className="text-gray-400 mt-4 leading-relaxed">
                                Dihasilkan khas untuk pengusaha logistik darat bagi meminimumkan bebanan pentadbiran dan memantau kewangan secara tepat.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Card 1 */}
                            <div className="bg-gray-900/30 border border-gray-800 hover:border-gray-700 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 shadow-lg group">
                                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">Pengurusan Armada</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    Pantau tarikh tamat cukai jalan, permit, insurans lorry, serta rekod servis penyelenggaraan berkala.
                                </p>
                            </div>

                            {/* Card 2 */}
                            <div className="bg-gray-900/30 border border-gray-800 hover:border-gray-700 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 shadow-lg group">
                                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">Invois & Sebut Harga</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    Jana sebut harga dan tukarkannya kepada invois rasmi PDF dalam satu klik. Jejaki invois tertunggak secara automatik.
                                </p>
                            </div>

                            {/* Card 3 */}
                            <div className="bg-gray-900/30 border border-gray-800 hover:border-gray-700 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 shadow-lg group">
                                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-6 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">Penggajian & Komisyen</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    Kira komisyen pemandu secara automatik berdasarkan peratusan perjalanan atau trip yang diselesaikan.
                                </p>
                            </div>

                            {/* Card 4 */}
                            <div className="bg-gray-900/30 border border-gray-800 hover:border-gray-700 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 shadow-lg group">
                                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">Pantau Belanja & Kos</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    Log perbelanjaan bahan api (diesel), tol, tayar dan penyelenggaraan untuk mengetahui untung rugi bersih yang sebenar.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Portal Pemandu (PWA) Showcase */}
                <section id="pemandu" className="relative z-10 py-20 sm:py-24 border-t border-gray-900">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            
                            {/* Mobile Mockup visual */}
                            <div className="relative flex justify-center order-2 lg:order-1">
                                <div className="absolute w-[280px] h-[280px] bg-blue-500/20 rounded-full blur-[80px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0" />
                                
                                {/* Device container */}
                                <div className="relative w-[300px] h-[600px] rounded-[40px] border-8 border-gray-800 bg-[#0B0F19] shadow-2xl overflow-hidden z-10">
                                    <div className="absolute top-0 inset-x-0 h-6 bg-gray-800 flex justify-center items-center">
                                        <div className="w-20 h-4 rounded-full bg-[#0B0F19]" />
                                    </div>
                                    
                                    {/* App UI */}
                                    <div className="pt-8 px-4 h-full flex flex-col justify-between pb-8">
                                        <div className="space-y-4">
                                            {/* App header */}
                                            <div className="flex justify-between items-center bg-gray-900/60 p-2.5 rounded-xl border border-gray-800">
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center text-[10px] text-white">L</div>
                                                    <span className="text-[10px] font-bold text-white">Driver Portal</span>
                                                </div>
                                                <span className="text-[9px] text-emerald-400 font-semibold bg-emerald-400/10 px-1.5 py-0.5 rounded">Aktif</span>
                                            </div>

                                            {/* Driver stats block */}
                                            <div className="bg-gradient-to-br from-blue-700 to-indigo-900 rounded-2xl p-4 text-left shadow-lg text-white">
                                                <p className="text-[9px] text-blue-200">Trip Bulan Ini</p>
                                                <p className="text-xl font-bold mt-0.5">18 Trip</p>
                                                <div className="border-t border-white/10 mt-2 pt-2 flex justify-between items-center text-[9px] text-blue-200">
                                                    <span>Komisyen Berhak</span>
                                                    <span className="font-bold text-white">RM 2,480.00</span>
                                                </div>
                                            </div>

                                            {/* Driver menu */}
                                            <div className="space-y-2">
                                                <div className="bg-gray-900/80 p-3 rounded-xl border border-gray-800 flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">📷</div>
                                                    <div className="text-left">
                                                        <p className="text-xs font-semibold text-white">Muat Naik Resit</p>
                                                        <p className="text-[9px] text-gray-500">Snap & lapor belanja perjalanan</p>
                                                    </div>
                                                </div>
                                                <div className="bg-gray-900/80 p-3 rounded-xl border border-gray-800 flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">🗺️</div>
                                                    <div className="text-left">
                                                        <p className="text-xs font-semibold text-white">Tugasan Perjalanan</p>
                                                        <p className="text-[9px] text-gray-500">Jadual trip Ipoh → K.Lumpur</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* App Bottom nav bar */}
                                        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-2 flex justify-around items-center">
                                            <span className="text-[10px] text-blue-500 font-bold">Utama</span>
                                            <span className="text-[10px] text-gray-500">Resit</span>
                                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-extrabold">+</div>
                                            <span className="text-[10px] text-gray-500">Kerja</span>
                                            <span className="text-[10px] text-gray-500">Gaji</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Description text */}
                            <div className="space-y-6 text-left order-1 lg:order-2">
                                <span className="text-sm font-bold text-indigo-400 uppercase tracking-widest">Portal Pemandu (PWA)</span>
                                <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Mudahkan Pemandu Anda Melaporkan Kerja & Resit</h2>
                                <p className="text-gray-400 leading-relaxed">
                                    Portal Pemandu yang dioptimumkan untuk telefon pintar. Pemandu boleh menyemak senarai trip, melihat anggaran komisyen bulanan, dan memuat naik gambar resit diesel/tol/penyelenggaraan secara terus dari jalan raya.
                                </p>
                                <ul className="space-y-3 text-sm text-gray-300">
                                    <li className="flex items-center gap-2">
                                        <svg className="w-5 h-5 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                        </svg>
                                        Pasang terus sebagai aplikasi skrin utama (PWA)
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <svg className="w-5 h-5 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                        </svg>
                                        Snap gambar resit perbelanjaan dengan kamera telefon
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <svg className="w-5 h-5 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                        </svg>
                                        Kekal telus dengan penyata komisyen peribadi pemandu
                                    </li>
                                </ul>
                            </div>

                        </div>
                    </div>
                </section>

                {/* Stats / Prestasi */}
                <section id="prestasi" className="relative z-10 py-16 sm:py-20 border-t border-gray-900 bg-gray-950/40">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
                            <div>
                                <p className="text-4xl font-extrabold text-white sm:text-5xl">5,000+</p>
                                <p className="text-sm font-semibold text-blue-400 uppercase tracking-wider mt-2">Jumlah Trip Selesai</p>
                                <p className="text-xs text-gray-500 mt-1">Urusan harian yang lancar dan selamat</p>
                            </div>
                            <div>
                                <p className="text-4xl font-extrabold text-white sm:text-5xl">99.8%</p>
                                <p className="text-sm font-semibold text-indigo-400 uppercase tracking-wider mt-2">Ketepatan Rekod</p>
                                <p className="text-xs text-gray-500 mt-1">Mengurangkan kesilapan manual invois & gaji</p>
                            </div>
                            <div>
                                <p className="text-4xl font-extrabold text-white sm:text-5xl">45%</p>
                                <p className="text-sm font-semibold text-purple-400 uppercase tracking-wider mt-2">Jimat Masa Pentadbiran</p>
                                <p className="text-xs text-gray-500 mt-1">Sebut harga bertukar kepada invois automatik</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Pelan Harga */}
                <section id="harga" className="relative z-10 py-20 sm:py-24 border-t border-gray-900">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <span className="text-sm font-bold text-blue-500 uppercase tracking-widest">PILIHAN PELAN</span>
                            <h2 className="text-3xl font-extrabold text-white mt-3 sm:text-4xl">Sesuai untuk Segala Skala Armada Lorry</h2>
                            <p className="text-gray-400 mt-4">
                                Pelan bulanan yang telus tanpa yuran tersembunyi. Naik taraf atau batalkan pelan pada bila-bila masa.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            {/* Plan 1 */}
                            <div className="bg-gray-900/20 border border-gray-800 rounded-3xl p-8 flex flex-col justify-between text-left">
                                <div>
                                    <h3 className="text-lg font-bold text-white">Syarikat Kecil</h3>
                                    <p className="text-xs text-gray-500 mt-1">Maksimum 5 buah lorry</p>
                                    <div className="my-6">
                                        <span className="text-3xl font-extrabold text-white">RM 99</span>
                                        <span className="text-sm text-gray-500"> / bulan</span>
                                    </div>
                                    <ul className="space-y-3 text-sm text-gray-400">
                                        <li className="flex items-center gap-2">✓ Pengurusan 5 Lorry</li>
                                        <li className="flex items-center gap-2">✓ Maksimum 2 Pemandu</li>
                                        <li className="flex items-center gap-2">✓ Sebut Harga & Invois PDF</li>
                                        <li className="flex items-center gap-2">✓ Log Perjalanan & Kos</li>
                                    </ul>
                                </div>
                                <Link href={route('login')} className="w-full mt-8 py-3 rounded-xl border border-gray-800 bg-gray-950 hover:bg-gray-900 hover:text-white text-center text-sm font-bold text-gray-300 transition-colors">Mulakan Percuma</Link>
                            </div>

                            {/* Plan 2 */}
                            <div className="bg-gray-900/40 border-2 border-blue-600 rounded-3xl p-8 flex flex-col justify-between text-left relative shadow-xl shadow-blue-500/5">
                                <span className="absolute top-0 right-8 -translate-y-1/2 bg-blue-600 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">Terlaris</span>
                                <div>
                                    <h3 className="text-lg font-bold text-white">Armada Sederhana</h3>
                                    <p className="text-xs text-gray-400 mt-1">Maksimum 25 buah lorry</p>
                                    <div className="my-6">
                                        <span className="text-3xl font-extrabold text-white">RM 249</span>
                                        <span className="text-sm text-gray-500"> / bulan</span>
                                    </div>
                                    <ul className="space-y-3 text-sm text-gray-300">
                                        <li className="flex items-center gap-2">✓ Pengurusan 25 Lorry</li>
                                        <li className="flex items-center gap-2">✓ Pemandu Tanpa Had</li>
                                        <li className="flex items-center gap-2">✓ Portal Pemandu PWA Bersepadu</li>
                                        <li className="flex items-center gap-2">✓ Sistem Komisyen & Gaji</li>
                                        <li className="flex items-center gap-2">✓ Analitis Penyelenggaraan</li>
                                    </ul>
                                </div>
                                <Link href={route('login')} className="w-full mt-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-center text-sm font-bold text-white transition-all shadow-md shadow-blue-500/10">Pilih Pelan</Link>
                            </div>

                            {/* Plan 3 */}
                            <div className="bg-gray-900/20 border border-gray-800 rounded-3xl p-8 flex flex-col justify-between text-left">
                                <div>
                                    <h3 className="text-lg font-bold text-white">Enterprise</h3>
                                    <p className="text-xs text-gray-500 mt-1">Armada Lorry skala besar</p>
                                    <div className="my-6">
                                        <span className="text-3xl font-extrabold text-white">Hubungi Kami</span>
                                    </div>
                                    <ul className="space-y-3 text-sm text-gray-400">
                                        <li className="flex items-center gap-2">✓ Lorry & Pemandu Tanpa Had</li>
                                        <li className="flex items-center gap-2">✓ Rekod API Khas</li>
                                        <li className="flex items-center gap-2">✓ Pengurus Akaun Dedikasi</li>
                                        <li className="flex items-center gap-2">✓ Integrasi GPS Pihak Ketiga</li>
                                    </ul>
                                </div>
                                <a href="mailto:sales@lorrytech.os" className="w-full mt-8 py-3 rounded-xl border border-gray-800 bg-gray-950 hover:bg-gray-900 hover:text-white text-center text-sm font-bold text-gray-300 transition-colors">Hubungi Jualan</a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer CTA */}
                <section className="relative z-10 py-20 bg-gradient-to-b from-[#0B0F19] to-black border-t border-gray-900">
                    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
                        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Bersedia untuk Mengurus Secara Sistematik?</h2>
                        <p className="text-gray-400 max-w-xl mx-auto leading-relaxed">
                            Cipta akaun anda hari ini dan rasai perubahan dalam operasi armada lorry anda serta ketelusan dengan pemandu.
                        </p>
                        <div>
                            <Link
                                href={route('login')}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-8 py-3.5 text-sm font-bold text-white shadow-lg transition-colors duration-300"
                            >
                                Mula Secara Percuma
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="relative z-10 py-10 bg-black text-center text-xs text-gray-600 border-t border-gray-950">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <p>© {new Date().getFullYear()} {brand}. Hak Cipta Terpelihara. Sistem Operasi Armada Logistik Darat.</p>
                    </div>
                </footer>

            </div>
        </>
    );
}
