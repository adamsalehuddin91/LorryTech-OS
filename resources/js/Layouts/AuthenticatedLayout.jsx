import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

const ownerNavItems = [
    {
        label: 'Papan Pemuka',
        routeName: 'dashboard',
        href: null,
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
        ),
    },
    {
        label: 'Armada Lorry',
        routeName: 'vehicles.index',
        href: null,
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 17h.01M16 17h.01M3 11l1.5-5A2 2 0 016.4 4h11.2a2 2 0 011.9 1.4L21 11M3 11v6a1 1 0 001 1h1m16-7v6a1 1 0 01-1 1h-1M3 11h18" />
            </svg>
        ),
    },
    {
        label: 'Pemandu',
        routeName: 'drivers.index',
        href: null,
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
        ),
    },
    {
        label: 'Pelanggan',
        routeName: 'customers.index',
        href: null,
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
    },
    {
        label: 'Perjalanan',
        routeName: 'trips.index',
        href: null,
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
        ),
    },
    {
        label: 'Sebut Harga',
        routeName: 'quotations.index',
        href: null,
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        ),
    },
    {
        label: 'Invois',
        routeName: 'invoices.index',
        href: null,
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
        ),
    },
    {
        label: 'Penggajian',
        routeName: 'payroll.index',
        href: null,
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
        ),
    },
    {
        label: 'Laporan Belanja',
        routeName: 'expenses.index',
        href: null,
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
        ),
    },
    {
        label: 'Semak Kerja',
        routeName: 'driver-jobs.index',
        href: null,
        badgeKey: 'pendingJobsCount',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
        ),
    },
    {
        label: 'Tetapan',
        routeName: 'settings.company',
        href: null,
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
    },
];

const driverNavItems = [
    {
        label: 'Papan Pemuka',
        routeName: 'driver.dashboard',
        href: null,
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
        ),
    },
    {
        label: 'Perjalanan Saya',
        routeName: 'driver.work',
        href: null,
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
        ),
    },
    {
        label: 'Pendapatan',
        routeName: 'driver.earnings',
        href: null,
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    },
    {
        label: 'Muat Naik Resit',
        routeName: 'driver.upload-receipt',
        href: null,
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
    },
    {
        label: 'Resit Saya',
        routeName: 'driver.receipts',
        href: null,
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
        ),
    },
];

function isActive(item) {
    if (!item.routeName) return false;
    try {
        if (route().current(item.routeName)) return true;
        const prefix = item.routeName.split('.')[0];
        if (prefix !== item.routeName && route().current(prefix + '.*')) return true;
    } catch {
        return false;
    }
    return false;
}

function getHref(item) {
    if (item.href) return item.href;
    try {
        return route(item.routeName);
    } catch {
        return '#';
    }
}

export default function AuthenticatedLayout({ header, children }) {
    const pageProps = usePage().props;
    const user = pageProps.auth.user;
    // Jenama client kalau Tetapan Syarikat diisi; kalau tidak, nama produk.
    const brand = pageProps.company?.name || 'SwiftFleet';
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navItems = user.role === 'driver' ? driverNavItems : ownerNavItems;

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-[#0B0F19] text-gray-300">
            {/* Logo / Brand */}
            <div className="flex items-center h-20 px-6 border-b border-gray-800/80">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 17h.01M16 17h.01M3 11l1.5-5A2 2 0 016.4 4h11.2a2 2 0 011.9 1.4L21 11M3 11v6a1 1 0 001 1h1m16-7v6a1 1 0 01-1 1h-1M3 11h18" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text">{brand}</span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
                {navItems.map((item) => {
                    const active = isActive(item);
                    const href = getHref(item);
                    const isPlaceholder = item.href === '#';
                    const badgeCount = item.badgeKey ? Number(pageProps[item.badgeKey] || 0) : 0;

                    const className = `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                        active
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/10'
                            : 'text-gray-400 hover:bg-gray-800/40 hover:text-white'
                    }`;

                    if (isPlaceholder) {
                        return (
                            <a
                                key={item.label}
                                href="#"
                                className={className}
                                onClick={(e) => e.preventDefault()}
                            >
                                <span className={active ? 'text-white' : 'text-gray-500 group-hover:text-white transition-colors'}>
                                    {item.icon}
                                </span>
                                <span>{item.label}</span>
                                <span className="ml-auto text-[9px] font-bold bg-gray-800 text-gray-500 px-2 py-0.5 rounded-full border border-gray-700">
                                    Akan Datang
                                </span>
                            </a>
                        );
                    }

                    return (
                        <Link
                            key={item.label}
                            href={href}
                            className={className}
                            onClick={() => setSidebarOpen(false)}
                        >
                            <span className={active ? 'text-white scale-105' : 'text-gray-500 group-hover:text-white transition-all group-hover:scale-105 duration-200'}>
                                {item.icon}
                            </span>
                            <span>{item.label}</span>
                            {badgeCount > 0 && (
                                <span className={`ml-auto inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-bold rounded-full shadow-sm ${
                                    active
                                        ? 'bg-white text-blue-700'
                                        : 'bg-red-500 text-white shadow-red-500/30 animate-pulse'
                                }`}>
                                    {badgeCount > 99 ? '99+' : badgeCount}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* User section at bottom */}
            <div className="border-t border-gray-800/80 p-5 bg-gray-950/20">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-gray-800 to-slate-700 flex items-center justify-center text-sm font-bold text-white border border-gray-700/50 shadow-inner">
                        {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate leading-tight">{user.name}</p>
                        <p className="text-[10px] text-gray-500 truncate mt-0.5">{user.email}</p>
                    </div>
                </div>
                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl border border-gray-800 hover:border-red-500/20 transition-all duration-200"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Log Keluar
                </Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex text-gray-800 font-sans">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 lg:hidden backdrop-blur-sm transition-opacity duration-300"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar - mobile (slide-in) */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:hidden ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <SidebarContent />
            </aside>

            {/* Sidebar - desktop (always visible) */}
            <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:block lg:w-64 border-r border-gray-800/10">
                <SidebarContent />
            </aside>

            {/* Main content area */}
            <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
                {/* Header for mobile hamburger + optional header */}
                <div className="sticky top-0 z-20 flex items-center justify-between h-20 bg-white/80 backdrop-blur-md border-b border-gray-200/60 px-6 lg:hidden">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 -ml-2 text-gray-500 hover:text-gray-800 focus:outline-none rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    {header ? (
                        <div className="text-lg font-bold text-gray-900 tracking-tight">
                            {header}
                        </div>
                    ) : (
                        <span className="text-base font-bold text-gray-900 tracking-tight">{brand}</span>
                    )}
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-700">
                        {user.name?.charAt(0)?.toUpperCase()}
                    </div>
                </div>

                {/* Desktop Header */}
                {header && (
                    <header className="hidden lg:block bg-white/70 backdrop-blur-md border-b border-gray-200/60 sticky top-0 z-10">
                        <div className="px-8 py-6">
                            {header}
                        </div>
                    </header>
                )}

                {/* Page content */}
                <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
