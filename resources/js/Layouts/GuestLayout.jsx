import { Link, usePage } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    const { company } = usePage().props;

    return (
        <div className="min-h-screen w-screen flex flex-col lg:flex-row overflow-hidden bg-[#060913] text-gray-100 font-sans">
            
            {/* ── Left Pane: Marketing, Infographics & Testimonials (Hidden on Mobile) ── */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0F172A] via-[#0E1325] to-[#1E1B4B] p-12 flex-col justify-between relative overflow-hidden border-r border-white/[0.04]">
                
                {/* Background animated blobs and grid lines */}
                <div className="absolute top-[-10%] left-[-10%] w-[350px] h-[350px] rounded-full bg-blue-600/10 blur-[100px] animate-blob pointer-events-none" />
                <div className="absolute bottom-[10%] right-[-10%] w-[300px] h-[300px] rounded-full bg-indigo-600/10 blur-[100px] animate-blob animation-delay-2000 pointer-events-none" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:32px_32px] opacity-40 pointer-events-none" />

                {/* Logo & Header */}
                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <svg className="w-5.5 h-5.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 17h.01M16 17h.01M3 11l1.5-5A2 2 0 016.4 4h11.2a2 2 0 011.9 1.4L21 11M3 11v6a1 1 0 001 1h1m16-7v6a1 1 0 01-1 1h-1M3 11h18" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white">LorryTech OS</span>
                </div>

                {/* Interactive CSS Logistics Graphic */}
                <div className="relative z-10 my-auto max-w-md w-full mx-auto space-y-6">
                    <div className="space-y-2 text-left">
                        <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
                            Mudah. Pantas. <br />
                            Sistematik.
                        </h2>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Sistem pengurusan logistik bersepadu untuk pemandu, pentadbir pejabat, dan pengurus armada syarikat.
                        </p>
                    </div>

                    {/* Timeline visualization card */}
                    <div className="bg-white/[0.02] border border-white/[0.06] backdrop-blur-md rounded-2xl p-5 shadow-2xl relative">
                        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/10 text-[9px] font-bold text-blue-400 border border-blue-500/20">
                            <span className="w-1 h-1 rounded-full bg-blue-400 animate-ping" />
                            Dalam Transit
                        </div>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Tugasan Aktif</p>
                        <p className="text-xs font-bold text-white mt-1">TRIP-2026-0043</p>

                        <div className="mt-4 flex gap-3.5">
                            <div className="flex flex-col items-center py-1">
                                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-[#0B0F19] ring-2 ring-blue-500/20" />
                                <span className="w-0.5 h-8 bg-blue-500/30" />
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#0B0F19] ring-2 ring-emerald-500/20" />
                            </div>
                            <div className="flex-1 flex flex-col justify-between h-[52px] text-left">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 leading-none">Pelabuhan Klang, Selangor</p>
                                    <p className="text-[9px] text-gray-500 leading-none mt-0.5">Pickup: 08:30 AM</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-300 leading-none">Johor Bahru, Johor</p>
                                    <p className="text-[9px] text-gray-500 leading-none mt-0.5">Est. Delivery: 03:30 PM</p>
                                </div>
                            </div>
                        </div>

                        {/* Floating mini stats overlay inside card */}
                        <div className="mt-4 pt-3 border-t border-white/[0.05] flex justify-between items-center text-xs">
                            <span className="text-gray-400 font-semibold">Komisyen Pemandu</span>
                            <span className="text-emerald-400 font-extrabold">+RM 285.00</span>
                        </div>
                    </div>

                    {/* User review block */}
                    <div className="border-l-2 border-blue-500 pl-4 py-1 text-left">
                        <p className="text-xs italic text-gray-400 leading-relaxed">
                            "LorryTech OS mengubah cara kami menyelaraskan perjalanan dan gaji pemandu. Data sentiasa telus dan tepat!"
                        </p>
                        <p className="text-[10px] font-bold text-white mt-2 leading-none">
                            — Megah Logistik Sdn Bhd
                        </p>
                    </div>
                </div>

                {/* Stats Grid at Bottom */}
                <div className="relative z-10 grid grid-cols-3 gap-4 border-t border-white/[0.08] pt-6">
                    <div>
                        <p className="text-lg font-extrabold text-white">5,000+</p>
                        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">Trip Selesai</p>
                    </div>
                    <div>
                        <p className="text-lg font-extrabold text-white">99.8%</p>
                        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">Tepat Masa</p>
                    </div>
                    <div>
                        <p className="text-lg font-extrabold text-white">45%</p>
                        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">Kos Jimat</p>
                    </div>
                </div>

            </div>

            {/* ── Right Pane: Authentication Cards ── */}
            <div className="w-full lg:w-1/2 min-h-screen lg:min-h-0 bg-[#060913] flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-y-auto">
                
                {/* Background decorative blob for mobile */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-blue-600/5 blur-[80px] pointer-events-none lg:hidden" />
                
                <div className="relative z-10 w-full max-w-md flex flex-col items-center">
                    
                    {/* Tiny logo block for mobile screens */}
                    <div className="flex flex-col items-center gap-2 mb-6 lg:hidden">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 17h.01M16 17h.01M3 11l1.5-5A2 2 0 016.4 4h11.2a2 2 0 011.9 1.4L21 11M3 11v6a1 1 0 001 1h1m16-7v6a1 1 0 01-1 1h-1M3 11h18" />
                            </svg>
                        </div>
                        <span className="text-2xl font-black text-white tracking-tight">{company?.name || 'LorryTech'}</span>
                    </div>

                    {/* Main Children Form */}
                    <div className="w-full overflow-hidden rounded-3xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-xl p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                        {children}
                    </div>

                    {/* Small footer notice */}
                    <div className="mt-8 text-center text-[10px] text-gray-600 select-none">
                        &copy; {new Date().getFullYear()} LorryTech OS. Hak Cipta Terpelihara.
                    </div>
                </div>

            </div>

        </div>
    );
}
