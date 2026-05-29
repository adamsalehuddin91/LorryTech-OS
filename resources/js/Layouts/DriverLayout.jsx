import { Link, usePage } from '@inertiajs/react';
import { Head } from '@inertiajs/react';

// Utama | Resit | [Snap center] | Kerja | Komisyen — 2+center+2 balanced
const NAV = [
    {
        href: 'driver.dashboard',
        label: 'Utama',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        ),
    },
    {
        href: 'driver.receipts',
        label: 'Resit Saya',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        ),
    },
    {
        href: 'driver.upload-receipt',
        label: 'Muat Naik',
        center: true,
        icon: (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
    },
    {
        href: 'driver.work',
        label: 'Tugasan',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
        ),
    },
    {
        href: 'driver.commissions',
        label: 'Gaji',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    },
];

export default function DriverLayout({ title, children }) {
    const { url } = usePage();
    const { flash, auth } = usePage().props;

    const isActive = (routeName) => {
        try {
            return url.startsWith(route(routeName).replace(window.location.origin, ''));
        } catch {
            return false;
        }
    };

    return (
        <>
            <Head title={title ? `${title} — LorryTech Pemandu` : 'LorryTech Pemandu'} />

            {/* Wrapper styled as centered smartphone frame boundary */}
            <div className="min-h-screen bg-[#060814] flex justify-center">
                <div className="w-full max-w-md bg-[#0B0F19] text-gray-100 flex flex-col h-screen shadow-[0_0_40px_rgba(0,0,0,0.8)] border-x border-white/[0.03]">

                    {/* Glassmorphic Top Header */}
                    <header className="shrink-0 bg-[#0B0F19]/80 backdrop-blur-md border-b border-white/[0.06] px-5 py-4 flex items-center justify-between shadow-sm z-30">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/20">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 17h.01M16 17h.01M3 11l1.5-5A2 2 0 016.4 4h11.2a2 2 0 011.9 1.4L21 11M3 11v6a1 1 0 001 1h1m16-7v6a1 1 0 01-1 1h-1M3 11h18" />
                                </svg>
                            </div>
                            <span className="text-sm font-extrabold text-white tracking-wide">LorryTech</span>
                        </div>

                        <div className="flex items-center gap-3">
                            {auth?.user?.name && (
                                <span className="text-xs text-gray-400 font-semibold bg-white/[0.03] border border-white/[0.06] px-2.5 py-1 rounded-xl max-w-[100px] truncate">
                                    {auth.user.name.split(' ')[0]}
                                </span>
                            )}
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="flex items-center justify-center p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                                title="Log Keluar"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            </Link>
                        </div>
                    </header>

                    {/* Floating Alert Messages */}
                    {flash?.success && (
                        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm px-4">
                            <div className="rounded-2xl bg-emerald-500 border border-emerald-400 px-4 py-3.5 text-xs font-bold text-white shadow-xl text-center backdrop-blur-md bg-opacity-95">
                                {flash.success}
                            </div>
                        </div>
                    )}
                    {flash?.error && (
                        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm px-4">
                            <div className="rounded-2xl bg-rose-500 border border-rose-400 px-4 py-3.5 text-xs font-bold text-white shadow-xl text-center backdrop-blur-md bg-opacity-95">
                                {flash.error}
                            </div>
                        </div>
                    )}

                    {/* Main Scrollable Content */}
                    <main className="flex-1 overflow-y-auto pb-4">
                        {children}
                    </main>

                    {/* Bottom Nav — 2 + center + 2 */}
                    <nav className="shrink-0 bg-slate-900/90 backdrop-blur-xl border-t border-white/[0.08] z-40 shadow-[0_-5px_25px_rgba(0,0,0,0.5)] rounded-t-3xl">
                        <div className="grid grid-cols-5 items-end px-2 py-3">
                            {NAV.map((item) => {
                                const active = isActive(item.href);

                                if (item.center) {
                                    return (
                                        <Link
                                            key={item.href}
                                            href={route(item.href)}
                                            className="flex flex-col items-center justify-end col-start-3 group"
                                        >
                                            <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/25 -mt-8 transition-all duration-200 hover:scale-105 active:scale-95 ${
                                                active 
                                                    ? 'bg-gradient-to-tr from-blue-700 to-indigo-700 text-white border-2 border-blue-400' 
                                                    : 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white'
                                            }`}>
                                                {item.icon}
                                            </div>
                                            <span className={`text-[10px] font-bold mt-1.5 transition-colors ${active ? 'text-blue-400' : 'text-gray-500 group-hover:text-gray-300'}`}>
                                                {item.label}
                                            </span>
                                        </Link>
                                    );
                                }

                                return (
                                    <Link
                                        key={item.href}
                                        href={route(item.href)}
                                        className="flex flex-col items-center gap-1.5 py-1 rounded-2xl transition-all group"
                                    >
                                        <span className={`transition-all duration-200 group-hover:scale-105 ${active ? 'text-blue-400' : 'text-gray-500 group-hover:text-gray-300'}`}>
                                            {item.icon}
                                        </span>
                                        <span className={`text-[10px] font-bold transition-colors ${active ? 'text-blue-400' : 'text-gray-500 group-hover:text-gray-300'}`}>
                                            {item.label}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    </nav>

                </div>
            </div>
        </>
    );
}
