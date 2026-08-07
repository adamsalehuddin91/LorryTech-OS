import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const statusBadge = (status) => {
    const map = {
        draft:    'bg-gray-100 text-gray-700',
        approved: 'bg-blue-100 text-blue-800',
        paid:     'bg-green-100 text-green-800',
    };
    const label = { draft: 'Draft', approved: 'Diluluskan', paid: 'Dibayar' };
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${map[status] || 'bg-gray-100 text-gray-700'}`}>
            {label[status] || status}
        </span>
    );
};

const fmt = (val) => 'RM ' + parseFloat(val || 0).toLocaleString('ms-MY', { minimumFractionDigits: 2 });

export default function Index({ payrolls, drivers, currentMonth, rules }) {
    const { flash } = usePage().props;
    const [month, setMonth] = useState(currentMonth);
    const [generating, setGenerating] = useState(false);
    const [selectedDriver, setSelectedDriver] = useState('');
    const [days, setDays] = useState('');

    const driver  = drivers.find(d => String(d.id) === String(selectedDriver));
    const preview = driver?.preview ?? null;

    // Bila pemandu bertukar, isi semula bilangan hari dengan kiraan auto dia.
    useEffect(() => {
        setDays(preview ? String(preview.days_worked) : '');
    }, [selectedDriver]);

    const handleMonthChange = (val) => {
        setMonth(val);
        setSelectedDriver('');
        router.get(route('payroll.index'), { month: val }, { preserveState: true, preserveScroll: true });
    };

    const handleGenerate = (e) => {
        e.preventDefault();
        if (!selectedDriver) return;
        router.post(route('payroll.generate'), {
            driver_id: selectedDriver,
            month,
            days_worked: days === '' ? null : Number(days),
        }, {
            onStart:  () => setGenerating(true),
            onFinish: () => setGenerating(false),
        });
    };

    // Kira semula di klien supaya admin nampak kesan override serta-merta.
    const daysNum   = days === '' ? 0 : Number(days);
    const wage      = preview ? daysNum * parseFloat(preview.daily_rate) : 0;
    const base      = preview ? parseFloat(preview.base_salary || 0) : 0;
    const allowance = preview ? parseFloat(preview.long_distance_allowance) : 0;
    const bonus     = preview ? parseFloat(preview.big_job_bonus) : 0;
    const gross     = base + wage + allowance + bonus;
    const overridden = preview && daysNum !== preview.days_worked;

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Penggajian</h2>}>
            <Head title="Penggajian" />

            {flash?.success && (
                <div className="mb-4 rounded-md bg-green-50 px-4 py-3 text-sm text-green-800 border border-green-200">
                    {flash.success}
                </div>
            )}
            {flash?.error && (
                <div className="mb-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-800 border border-red-200">
                    {flash.error}
                </div>
            )}

            {/* Ringkasan peraturan aktif — supaya admin tahu angka datang dari mana */}
            <div className="mb-6 rounded-lg border border-gray-200 bg-white px-5 py-3 text-xs text-gray-600 flex flex-wrap gap-x-6 gap-y-1">
                <span className="font-semibold text-gray-800">Peraturan gaji:</span>
                <span>Kadar harian ikut pemandu</span>
                <span>Jumlah &gt; {rules.long_distance_km}km sehari → <b className="text-gray-800">+{fmt(rules.long_distance_allowance)}</b></span>
                <span>Job ≥ {fmt(rules.big_job_threshold)} → <b className="text-gray-800">+{fmt(rules.big_job_bonus)}</b> setiap satu</span>
            </div>

            <div className="mb-6 flex flex-wrap items-end gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bulan</label>
                    <input
                        type="month"
                        value={month}
                        onChange={e => handleMonthChange(e.target.value)}
                        className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>

                <form onSubmit={handleGenerate} className="flex items-end gap-2 border-l border-gray-200 pl-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Jana Slip Gaji</label>
                        <select
                            value={selectedDriver}
                            onChange={e => setSelectedDriver(e.target.value)}
                            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                            <option value="">Pilih Pemandu...</option>
                            {drivers.map(d => (
                                <option key={d.id} value={d.id} disabled={d.has_payroll}>
                                    {d.name}{d.has_payroll ? ' (sudah jana)' : ` — ${fmt(d.daily_rate)}/hari`}
                                </option>
                            ))}
                        </select>
                    </div>

                    {preview && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Hari bekerja
                                {overridden && <span className="ml-1 text-amber-600 font-normal">(diubah)</span>}
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="31"
                                value={days}
                                onChange={e => setDays(e.target.value)}
                                className="w-24 rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={generating || !selectedDriver}
                        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {generating ? 'Jana...' : '+ Jana'}
                    </button>
                </form>
            </div>

            {/* Pratonton kiraan — angka yang dilihat = angka yang akan disimpan */}
            {preview && (
                <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50/60 px-5 py-4">
                    <p className="text-sm font-semibold text-gray-900 mb-3">
                        Pratonton — {driver.name}, {month}
                    </p>
                    <div className="grid gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-4 text-sm">
                        {base > 0 && (
                            <div>
                                <p className="text-xs text-gray-500">Gaji pokok</p>
                                <p className="font-medium text-gray-900">{fmt(base)}</p>
                            </div>
                        )}
                        <div>
                            <p className="text-xs text-gray-500">Gaji harian</p>
                            <p className="font-medium text-gray-900">
                                {daysNum} hari × {fmt(preview.daily_rate)} = {fmt(wage)}
                            </p>
                            {overridden && (
                                <p className="text-[11px] text-amber-700 mt-0.5">
                                    Kiraan auto: {preview.days_worked} hari ada kerja disahkan
                                </p>
                            )}
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Elaun jarak jauh</p>
                            <p className="font-medium text-gray-900">
                                {preview.long_distance_days} hari &gt; {rules.long_distance_km}km = {fmt(allowance)}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Bonus job besar</p>
                            <p className="font-medium text-gray-900">
                                {preview.big_job_count} job = {fmt(bonus)}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Gross</p>
                            <p className="font-bold text-gray-900">{fmt(gross)}</p>
                            <p className="text-[11px] text-gray-500 mt-0.5">
                                {driver.socso_enabled ? 'SOCSO/EIS aktif' : 'SOCSO/EIS dimatikan'}
                            </p>
                        </div>
                    </div>
                    {preview.days_worked === 0 && (
                        <p className="mt-3 text-xs text-amber-700">
                            ⚠️ Tiada kerja disahkan untuk bulan ini. Sahkan kerja pemandu dahulu, atau isi bilangan hari secara manual.
                        </p>
                    )}
                </div>
            )}

            {payrolls.length === 0 ? (
                <div className="rounded-lg bg-white border border-gray-200 p-12 text-center text-gray-500">
                    Tiada slip gaji untuk bulan ini. Jana slip gaji di atas.
                </div>
            ) : (
                <div className="space-y-3">
                    {payrolls.map(p => (
                        <div key={p.id} className="rounded-lg bg-white border border-gray-200 px-5 py-4 flex flex-wrap items-center gap-4">
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900">{p.driver_name}</p>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    {parseFloat(p.base_salary) > 0 && <>pokok {fmt(p.base_salary)} &nbsp;+&nbsp; </>}
                                    {p.days_worked} hari × {fmt(p.daily_rate)} = {fmt(p.daily_wage_total)}
                                    {parseFloat(p.long_distance_allowance) > 0 && <> &nbsp;+&nbsp; elaun {fmt(p.long_distance_allowance)}</>}
                                    {parseFloat(p.big_job_bonus) > 0 && <> &nbsp;+&nbsp; bonus {fmt(p.big_job_bonus)}</>}
                                </p>
                                <p className="text-xs text-gray-500">
                                    Bersih: <span className="font-medium text-gray-800">{fmt(p.net_salary)}</span>
                                    &nbsp;|&nbsp; Potongan: {fmt(p.total_deductions)}
                                    &nbsp;|&nbsp; Gross: {fmt(p.gross_salary)}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                {statusBadge(p.status)}
                                {p.paid_date && <span className="text-xs text-gray-400">Bayar: {p.paid_date}</span>}
                                <Link
                                    href={route('payroll.show', p.id)}
                                    className="rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200"
                                >
                                    Lihat Slip
                                </Link>
                                <a
                                    href={route('payroll.pdf', p.id)}
                                    target="_blank"
                                    className="rounded-md bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100"
                                >
                                    PDF
                                </a>
                                {p.status === 'draft' && (
                                    <button
                                        onClick={() => confirm('Padam slip gaji ini?') && router.delete(route('payroll.destroy', p.id))}
                                        className="rounded-md bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100"
                                    >
                                        Padam
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {drivers.filter(d => !d.has_payroll && d.daily_rate <= 0).length > 0 && (
                <div className="mt-6 rounded-md bg-yellow-50 border border-yellow-200 px-4 py-3 text-sm text-yellow-800">
                    ⚠️ Pemandu berikut belum ditetapkan kadar harian:{' '}
                    {drivers.filter(d => !d.has_payroll && d.daily_rate <= 0).map(d => d.name).join(', ')}
                    . Kemaskini profil pemandu terlebih dahulu.
                </div>
            )}
        </AuthenticatedLayout>
    );
}
