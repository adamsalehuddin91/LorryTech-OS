import { Link, usePage, router } from '@inertiajs/react';
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
        label: 'Resit',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        ),
    },
    {
        href: 'driver.upload-receipt',
        label: 'Snap',
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
        label: 'Kerja',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
        ),
    },
    {
        href: 'driver.commissions',
        label: 'Komisyen',
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

    const handleLogout = () => {
        router.post(route('logout'));
    };

    return (
        <>
            <Head title={title ? `${title} — LorryTech` : 'LorryTech Driver'} />

            <div className="min-h-screen bg-gray-50 flex flex-col max-w-lg mx-auto relative">

                {/* Top Header */}
                <header className="sticky top-0 z-30 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                            </svg>
                        </div>
                        <span className="text-sm font-bold text-gray-800 tracking-tight">LorryTech</span>
                    </div>

                    <div className="flex items-center gap-3">
                        {auth?.user?.name && (
                            <span className="text-xs text-gray-500 truncate max-w-[120px]">{auth.user.name}</span>
                        )}
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-500 text-xs font-medium transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Keluar
                        </button>
                    </div>
                </header>

                {/* Flash Messages */}
                {flash?.success && (
                    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md">
                        <div className="rounded-xl bg-green-500 px-4 py-3 text-sm font-medium text-white shadow-lg text-center">
                            {flash.success}
                        </div>
                    </div>
                )}
                {flash?.error && (
                    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md">
                        <div className="rounded-xl bg-red-500 px-4 py-3 text-sm font-medium text-white shadow-lg text-center">
                            {flash.error}
                        </div>
                    </div>
                )}

                {/* Main Content */}
                <main className="flex-1 pb-24">
                    {children}
                </main>

                {/* Bottom Nav — 2 + center + 2 */}
                <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg bg-white border-t border-gray-200 z-40 shadow-[0_-1px_8px_rgba(0,0,0,0.06)]">
                    <div className="grid grid-cols-5 items-end px-1 py-2">
                        {NAV.map((item) => {
                            const active = isActive(item.href);

                            if (item.center) {
                                return (
                                    <Link
                                        key={item.href}
                                        href={route(item.href)}
                                        className="flex flex-col items-center justify-end col-start-3"
                                    >
                                        <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg -mt-6 transition-all ${
                                            active ? 'bg-blue-700 scale-105' : 'bg-blue-600'
                                        }`}>
                                            <span className="text-white">{item.icon}</span>
                                        </div>
                                        <span className={`text-[10px] font-medium mt-1 ${active ? 'text-blue-600' : 'text-gray-400'}`}>
                                            {item.label}
                                        </span>
                                    </Link>
                                );
                            }

                            return (
                                <Link
                                    key={item.href}
                                    href={route(item.href)}
                                    className="flex flex-col items-center gap-0.5 py-1 rounded-xl transition-all"
                                >
                                    <span className={active ? 'text-blue-600' : 'text-gray-400'}>{item.icon}</span>
                                    <span className={`text-[10px] font-medium ${active ? 'text-blue-600' : 'text-gray-400'}`}>
                                        {item.label}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </nav>

            </div>
        </>
    );
}
