import { Link, usePage } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    const { company } = usePage().props;

    return (
        <div className="flex min-h-screen flex-col items-center bg-gray-100 pt-6 sm:justify-center sm:pt-0">
            <div>
                <Link href="/" className="flex flex-col items-center gap-2">
                    {company?.logo_url ? (
                        <img
                            src={company.logo_url}
                            alt={company.name}
                            className="h-20 w-auto object-contain"
                        />
                    ) : (
                        <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg">
                            <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 17h.01M16 17h.01M3 11l1.5-5A2 2 0 016.4 4h11.2a2 2 0 011.9 1.4L21 11M3 11v6a1 1 0 001 1h1m16-7v6a1 1 0 01-1 1h-1M3 11h18" />
                            </svg>
                        </div>
                    )}
                    <span className="text-2xl font-bold text-gray-800 tracking-wide">
                        {company?.name || 'LorryTech'}
                    </span>
                    <span className="text-xs text-gray-500 tracking-widest uppercase -mt-1">Fleet Management OS</span>
                </Link>
            </div>

            <div className="mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}
