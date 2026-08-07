import DriverLayout from '@/Layouts/DriverLayout';
import { router } from '@inertiajs/react';

const rm = (v) => 'RM ' + Number(v || 0).toLocaleString('en-MY', { minimumFractionDigits: 2 });

const monthLabel = (m) => {
    const [y, mo] = m.split('-');
    const names = ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ogos', 'Sep', 'Okt', 'Nov', 'Dis'];
    return `${names[Number(mo) - 1]} ${y}`;
};

export default function MyEarnings({ current, history, rules, filters }) {
    const go = (month) => router.get(route('driver.earnings'), { month }, { preserveScroll: true });

    return (
        <DriverLayout title="Pendapatan Saya">
            <div className="bg-gradient-to-b from-blue-900/35 via-indigo-950/15 to-transparent px-5 pt-8 pb-6">
                <h1 className="text-white text-xl font-extrabold tracking-tight">Pendapatan Saya</h1>
                <p className="text-blue-300/70 text-xs font-medium mt-1">{monthLabel(current.month)}</p>

                <div className="mt-4 flex items-end justify-between">
                    <div>
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                            {current.is_final ? 'Gaji bersih' : 'Anggaran setakat ini'}
                        </p>
                        <p className="text-emerald-400 text-2xl font-extrabold mt-1 tracking-tight">
                            {rm(current.is_final ? current.net_salary : current.gross_salary)}
                        </p>
                    </div>
                    {current.is_final ? (
                        <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-[10px] font-bold text-emerald-400">
                            {current.status === 'paid' ? 'DIBAYAR' : current.status === 'approved' ? 'DILULUSKAN' : 'SLIP DIJANA'}
                        </span>
                    ) : (
                        <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 text-[10px] font-bold text-amber-400">
                            BELUM MUKTAMAD
                        </span>
                    )}
                </div>
            </div>

            <div className="px-5 pb-6 space-y-4">
                {/* Pecahan */}
                <div className="bg-white/[0.02] border border-white/[0.06] backdrop-blur-md rounded-3xl p-5">
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-4">Pecahan</p>

                    <div className="space-y-3.5">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-white text-sm font-semibold">Gaji harian</p>
                                <p className="text-slate-500 text-[11px] mt-0.5">
                                    {current.days_worked} hari × {rm(current.daily_rate)}
                                </p>
                            </div>
                            <p className="text-white text-sm font-bold whitespace-nowrap">{rm(current.daily_wage_total)}</p>
                        </div>

                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-white text-sm font-semibold">Elaun jarak jauh</p>
                                <p className="text-slate-500 text-[11px] mt-0.5">
                                    {current.long_distance_days} hari melebihi {rules.long_distance_km}km
                                </p>
                            </div>
                            <p className="text-white text-sm font-bold whitespace-nowrap">{rm(current.long_distance_allowance)}</p>
                        </div>

                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-white text-sm font-semibold">Bonus job besar</p>
                                <p className="text-slate-500 text-[11px] mt-0.5">
                                    {current.big_job_count} job bernilai {rm(rules.big_job_threshold)} ke atas
                                </p>
                            </div>
                            <p className="text-white text-sm font-bold whitespace-nowrap">{rm(current.big_job_bonus)}</p>
                        </div>

                        <div className="border-t border-white/[0.06] pt-3.5 flex items-center justify-between">
                            <p className="text-white text-sm font-bold">Jumlah kasar</p>
                            <p className="text-emerald-400 text-lg font-extrabold">{rm(current.gross_salary)}</p>
                        </div>

                        {current.is_final && (
                            <>
                                <div className="flex items-center justify-between">
                                    <p className="text-gray-400 text-sm">Potongan (KWSP/SOCSO/EIS)</p>
                                    <p className="text-rose-400 text-sm font-semibold">− {rm(current.total_deductions)}</p>
                                </div>
                                <div className="border-t border-white/[0.06] pt-3.5 flex items-center justify-between">
                                    <p className="text-white text-sm font-bold">Gaji bersih</p>
                                    <p className="text-emerald-400 text-lg font-extrabold">{rm(current.net_salary)}</p>
                                </div>
                            </>
                        )}
                    </div>

                    {!current.is_final && (
                        <p className="mt-4 text-[11px] text-amber-400/80 leading-relaxed">
                            Angka ini anggaran daripada kerja yang telah disahkan. Potongan KWSP/SOCSO/EIS akan
                            ditolak apabila slip gaji dijana pada hujung bulan.
                        </p>
                    )}
                </div>

                {/* Cara gaji dikira */}
                <div className="bg-white/[0.01] border border-dashed border-white/[0.06] rounded-3xl p-5">
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-3">Cara gaji dikira</p>
                    <ul className="space-y-2 text-[11px] text-slate-400 leading-relaxed">
                        <li>• Setiap hari anda ada kerja disahkan dibayar kadar harian anda.</li>
                        <li>• Jumlah jarak melebihi <span className="text-slate-200">{rules.long_distance_km}km</span> dalam satu hari
                            menambah <span className="text-slate-200">{rm(rules.long_distance_allowance)}</span> — sekali sehari,
                            bukan setiap trip.</li>
                        <li>• Setiap job bernilai <span className="text-slate-200">{rm(rules.big_job_threshold)}</span> ke atas
                            menambah <span className="text-slate-200">{rm(rules.big_job_bonus)}</span>.</li>
                    </ul>
                </div>

                {/* Sejarah 6 bulan */}
                <div>
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-3 px-1">6 bulan lepas</p>
                    <div className="space-y-2">
                        {history.map((h) => (
                            <button
                                key={h.month}
                                onClick={() => go(h.month)}
                                className={`w-full text-left bg-white/[0.02] border rounded-2xl px-4 py-3 flex items-center justify-between transition-colors ${
                                    h.month === current.month
                                        ? 'border-blue-500/40 bg-blue-500/[0.06]'
                                        : 'border-white/[0.06] hover:bg-white/[0.04]'
                                }`}
                            >
                                <div>
                                    <p className="text-white text-sm font-semibold">{monthLabel(h.month)}</p>
                                    <p className="text-slate-500 text-[11px] mt-0.5">
                                        {h.days_worked} hari
                                        {h.long_distance_days > 0 && ` · ${h.long_distance_days} hari jauh`}
                                        {h.big_job_count > 0 && ` · ${h.big_job_count} job besar`}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-white text-sm font-bold">
                                        {rm(h.is_final ? h.net_salary : h.gross_salary)}
                                    </p>
                                    <p className={`text-[10px] font-medium mt-0.5 ${h.is_final ? 'text-emerald-400/70' : 'text-amber-400/70'}`}>
                                        {h.is_final ? (h.status === 'paid' ? 'dibayar' : 'slip dijana') : 'anggaran'}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </DriverLayout>
    );
}
