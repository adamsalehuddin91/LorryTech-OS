import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

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

export default function Index({ payrolls, drivers, currentMonth }) {
    const { flash } = usePage().props;
    const [month, setMonth] = useState(currentMonth);
    const [generating, setGenerating] = useState(false);
    const [selectedDriver, setSelectedDriver] = useState('');
    const [genMonth, setGenMonth] = useState(currentMonth);

    const handleMonthChange = (val) => {
        setMonth(val);
        router.get(route('payroll.index'), { month: val }, { preserveState: true, preserveScroll: true });
    };

    const handleGenerate = (e) => {
        e.preventDefault();
        if (!selectedDriver) return;
        router.post(route('payroll.generate'), { driver_id: selectedDriver, month: genMonth }, {
            onStart: () => setGenerating(true),
            onFinish: () => setGenerating(false),
        });
    };

    const availableDrivers = drivers;

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

            {/* Controls row */}
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

                {/* Generate form */}
                <form onSubmit={handleGenerate} className="flex items-end gap-2 border-l border-gray-200 pl-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Jana Slip Gaji</label>
                        <select
                            value={selectedDriver}
                            onChange={e => setSelectedDriver(e.target.value)}
                            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                            <option value="">Pilih Pemandu...</option>
                            {availableDrivers.map(d => (
                                <option key={d.id} value={d.id}>
                                    {d.name} {d.has_payroll ? '(Sudah Jana)' : d.base_salary > 0 ? `(RM${parseFloat(d.base_salary).toFixed(0)}/bln)` : '(Gaji belum ditetapkan)'}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <input
                            type="month"
                            value={genMonth}
                            onChange={e => setGenMonth(e.target.value)}
                            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={generating || !selectedDriver}
                        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {generating ? 'Jana...' : '+ Jana'}
                    </button>
                </form>
            </div>

            {/* Payroll cards */}
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
                                    Gaji: {fmt(p.base_salary)} &nbsp;|&nbsp; Komisyen: {fmt(p.commission_amount)}
                                </p>
                                <p className="text-xs text-gray-500">
                                    Bersih: <span className="font-medium text-gray-800">{fmt(p.net_salary)}</span>
                                    &nbsp;|&nbsp; Potongan: {fmt(p.total_deductions)}
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
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Drivers without payroll this month */}
            {drivers.filter(d => d.has_payroll === false && d.base_salary == 0).length > 0 && (
                <div className="mt-6 rounded-md bg-yellow-50 border border-yellow-200 px-4 py-3 text-sm text-yellow-800">
                    ⚠️ Pemandu berikut belum ditetapkan gaji pokok:{' '}
                    {drivers.filter(d => !d.has_payroll && d.base_salary == 0).map(d => d.name).join(', ')}
                    . Kemaskini profil pemandu terlebih dahulu.
                </div>
            )}
        </AuthenticatedLayout>
    );
}
