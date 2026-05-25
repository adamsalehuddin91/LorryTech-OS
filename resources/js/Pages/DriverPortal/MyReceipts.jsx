import DriverLayout from '@/Layouts/DriverLayout';
import { Link } from '@inertiajs/react';

const CATEGORIES = {
    fuel:        { icon: '⛽', label: 'Bahan Api',    cls: 'bg-orange-100 text-orange-700' },
    toll:        { icon: '🛣️', label: 'Tol',          cls: 'bg-purple-100 text-purple-700' },
    maintenance: { icon: '🔧', label: 'Selenggara',   cls: 'bg-blue-100 text-blue-700' },
    repair:      { icon: '🔩', label: 'Pembaikan',    cls: 'bg-red-100 text-red-700' },
    tyre:        { icon: '🛞', label: 'Tayar',        cls: 'bg-gray-100 text-gray-700' },
    parking:     { icon: '🅿️', label: 'Parking',     cls: 'bg-cyan-100 text-cyan-700' },
    other:       { icon: '📦', label: 'Lain-lain',    cls: 'bg-gray-100 text-gray-600' },
};

export default function MyReceipts({ expenses }) {
    const total = expenses.data?.reduce((s, e) => s + Number(e.amount), 0) || 0;

    return (
        <DriverLayout title="Resit Saya">
            {/* Header */}
            <div className="bg-gradient-to-br from-blue-700 to-blue-900 px-5 pt-12 pb-6">
                <h1 className="text-white text-xl font-bold">Resit Saya</h1>
                <div className="flex items-end justify-between mt-4">
                    <div>
                        <p className="text-blue-200 text-xs">Jumlah perbelanjaan (halaman ini)</p>
                        <p className="text-white text-2xl font-bold mt-0.5">RM {total.toFixed(2)}</p>
                    </div>
                    <Link
                        href={route('driver.upload-receipt')}
                        className="flex items-center gap-2 bg-white text-blue-700 text-sm font-semibold px-4 py-2 rounded-xl shadow"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Tambah
                    </Link>
                </div>
            </div>

            <div className="px-5 mt-4 space-y-3">
                {expenses.data?.length > 0 ? (
                    <>
                        {expenses.data.map((exp) => {
                            const cat = CATEGORIES[exp.category] || { icon: '📦', label: exp.category, cls: 'bg-gray-100 text-gray-600' };
                            return (
                                <div key={exp.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                                    <div className="flex items-start gap-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${cat.cls}`}>
                                            {cat.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900">{cat.label}</p>
                                                    {exp.description && (
                                                        <p className="text-xs text-gray-500 mt-0.5 truncate">{exp.description}</p>
                                                    )}
                                                </div>
                                                <p className="text-base font-bold text-gray-900 ml-2 flex-shrink-0">
                                                    RM {Number(exp.amount).toFixed(2)}
                                                </p>
                                            </div>
                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                                    <span>{exp.receipt_date?.split('T')[0] || exp.receipt_date}</span>
                                                    {exp.vehicle?.plate_number && (
                                                        <><span>•</span><span>{exp.vehicle.plate_number}</span></>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    {exp.receipt_image_url && (
                                                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">📎 Ada resit</span>
                                                    )}
                                                    <span className={`text-xs px-2 py-0.5 rounded-full ${exp.is_verified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                        {exp.is_verified ? '✓ Disahkan' : 'Belum sahkan'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {expenses.links && (
                            <div className="flex justify-center gap-1 pb-2">
                                {expenses.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url || '#'}
                                        className={`px-3 py-1.5 rounded-lg text-sm ${link.active ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200'} ${!link.url ? 'opacity-40 pointer-events-none' : ''}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
                        <p className="text-4xl mb-3">🧾</p>
                        <p className="text-gray-500 text-sm font-medium">Tiada resit lagi</p>
                        <Link href={route('driver.upload-receipt')} className="mt-3 inline-block text-sm text-blue-600 font-semibold">
                            Muat naik resit pertama →
                        </Link>
                    </div>
                )}
            </div>
        </DriverLayout>
    );
}
