import { Link, usePage } from '@inertiajs/react';
import { Head } from '@inertiajs/react';

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
        href: 'driver.trips',
        label: 'Trip',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
        ),
    },
    {
        href: 'driver.upload-receipt',
        label: '',
        center: true,
        icon: (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
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
    {
        href: 'driver.receipts',
        label: 'Resit',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        ),
    },
];

export default function DriverLayout({ title, children, hideHeader = false }) {
    const { url } = usePage();
    const { flash } = usePage().props;

    const isActive = (routeName) => {
        try {
            return url.startsWith(route(routeName).replace(window.location.origin, ''));
        } catch {
            return false;
        }
    };

    return (
        <>
            <Head title={title ? `${title} — LorryTech` : 'LorryTech Driver'} />

            <div className="min-h-screen bg-gray-50 flex flex-col max-w-lg mx-auto relative">
                {/* Flash */}
                {flash?.success && (
                    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md">
                        <div className="rounded-xl bg-green-500 px-4 py-3 text-sm font-medium text-white shadow-lg text-center">
                            {flash.success}
                        </div>
                    </div>
                )}
                {flash?.error && (
                    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md">
                        <div className="rounded-xl bg-red-500 px-4 py-3 text-sm font-medium text-white shadow-lg text-center">
                            {flash.error}
                        </div>
                    </div>
                )}

                {/* Main content */}
                <main className="flex-1 pb-24">
                    {children}
                </main>

                {/* Bottom Nav */}
                <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg bg-white border-t border-gray-200 z-40">
                    <div className="flex items-end justify-around px-2 py-2">
                        {NAV.map((item) => {
                            const active = isActive(item.href);
                            if (item.center) {
                                return (
                                    <Link key={item.href} href={route(item.href)} className="flex flex-col items-center -mt-5">
                                        <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all ${
                                            active ? 'bg-blue-700' : 'bg-blue-600'
                                        }`}>
                                            <span className="text-white">{item.icon}</span>
                                        </div>
                                        <span className="text-xs text-gray-500 mt-1">Snap</span>
                                    </Link>
                                );
                            }
                            return (
                                <Link key={item.href} href={route(item.href)} className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all">
                                    <span className={active ? 'text-blue-600' : 'text-gray-400'}>{item.icon}</span>
                                    <span className={`text-xs font-medium ${active ? 'text-blue-600' : 'text-gray-400'}`}>{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </nav>
            </div>
        </>
    );
}
