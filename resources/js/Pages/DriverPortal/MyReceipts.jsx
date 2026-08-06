import DriverLayout from '@/Layouts/DriverLayout';
import PaginationLinks from '@/Components/PaginationLinks';
import { Link } from '@inertiajs/react';

const CATEGORIES = {
    fuel:        { icon: '⛽', label: 'Bahan Api',    cls: 'bg-orange-500/10 text-orange-400' },
    toll:        { icon: '🛣️', label: 'Tol',          cls: 'bg-purple-500/10 text-purple-400' },
    maintenance: { icon: '🔧', label: 'Selenggara',   cls: 'bg-blue-500/10 text-blue-400' },
    repair:      { icon: '🔩', label: 'Pembaikan',    cls: 'bg-rose-500/10 text-rose-400' },
    tyre:        { icon: '🛞', label: 'Tayar',        cls: 'bg-white/[0.05] text-gray-300' },
    parking:     { icon: '🅿️', label: 'Parking',     cls: 'bg-cyan-500/10 text-cyan-400' },
    other:       { icon: '📦', label: 'Lain-lain',    cls: 'bg-white/[0.05] text-gray-400' },
};

export default function MyReceipts({ expenses }) {
    const total = expenses.data?.reduce((s, e) => s + Number(e.amount), 0) || 0;

    return (
        <DriverLayout title="Resit Saya">
            {/* Header */}
            <div className="bg-gradient-to-b from-blue-900/35 via-indigo-950/15 to-transparent px-5 pt-8 pb-6">
                <h1 className="text-white text-xl font-extrabold tracking-tight">Resit Saya</h1>
                <div className="flex items-end justify-between mt-4">
                    <div>
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Jumlah perbelanjaan (halaman ini)</p>
                        <p className="text-white text-xl font-extrabold mt-1 tracking-tight">RM {total.toFixed(2)}</p>
                    </div>
                    <Link
                        href={route('driver.upload-receipt')}
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-lg shadow-blue-500/20"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Tambah
                    </Link>
                </div>
            </div>

            <div className="px-5 -mt-1.5 space-y-3 pb-6 relative z-10">
                {expenses.data?.length > 0 ? (
                    <>
                        {expenses.data.map((exp) => {
                            const cat = CATEGORIES[exp.category] || { icon: '📦', label: exp.category, cls: 'bg-white/[0.05] text-gray-400' };
                            return (
                                <div key={exp.id} className="bg-white/[0.02] border border-white/[0.06] backdrop-blur-md rounded-3xl p-4 shadow-xl">
                                    <div className="flex items-start gap-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${cat.cls}`}>
                                            {cat.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <p className="text-sm font-semibold text-white">{cat.label}</p>
                                                    {exp.description && (
                                                        <p className="text-xs text-gray-500 mt-0.5 truncate">{exp.description}</p>
                                                    )}
                                                </div>
                                                <p className="text-base font-bold text-white ml-2 flex-shrink-0">
                                                    RM {Number(exp.amount).toFixed(2)}
                                                </p>
                                            </div>
                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                                    <span>{exp.receipt_date?.split('T')[0] || exp.receipt_date}</span>
                                                    {exp.vehicle?.plate_number && (
                                                        <><span>•</span><span>{exp.vehicle.plate_number}</span></>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    {exp.receipt_image_url && (
                                                        <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">📎 Ada resit</span>
                                                    )}
                                                    <span className={`text-xs px-2 py-0.5 rounded-full border ${exp.is_verified ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                                                        {exp.is_verified ? '✓ Disahkan' : 'Belum sahkan'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        <PaginationLinks links={expenses.links} />
                    </>
                ) : (
                    <div className="bg-white/[0.01] rounded-3xl py-12 text-center border border-dashed border-white/[0.06]">
                        <p className="text-3xl mb-3 opacity-60">🧾</p>
                        <p className="text-gray-400 text-sm font-medium">Tiada resit lagi</p>
                        <Link href={route('driver.upload-receipt')} className="mt-3 inline-block text-sm text-blue-400 font-semibold">
                            Muat naik resit pertama →
                        </Link>
                    </div>
                )}
            </div>
        </DriverLayout>
    );
}
