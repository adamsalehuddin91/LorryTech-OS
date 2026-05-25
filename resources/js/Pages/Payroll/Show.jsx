import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';

const fmt = (val) => 'RM ' + parseFloat(val || 0).toLocaleString('ms-MY', { minimumFractionDigits: 2 });

const statusBadge = (status) => {
    const map = {
        draft:    'bg-gray-100 text-gray-700',
        approved: 'bg-blue-100 text-blue-800',
        paid:     'bg-green-100 text-green-800',
    };
    const label = { draft: 'Draft', approved: 'Diluluskan', paid: 'Dibayar' };
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${map[status] || ''}`}>
            {label[status] || status}
        </span>
    );
};

export default function Show({ payroll }) {
    const { flash } = usePage().props;

    const handleApprove = () => {
        if (confirm('Luluskan slip gaji ini?')) {
            router.patch(route('payroll.approve', payroll.id));
        }
    };

    const handleMarkPaid = () => {
        if (confirm('Tandakan slip gaji ini sebagai DIBAYAR?')) {
            router.patch(route('payroll.mark-paid', payroll.id));
        }
    };

    const handleDelete = () => {
        if (confirm('Padam slip gaji ini? Tindakan ini tidak boleh dibatalkan.')) {
            router.delete(route('payroll.destroy', payroll.id));
        }
    };

    const totalEmployerContrib = (
        parseFloat(payroll.kwsp_employer) +
        parseFloat(payroll.socso_employer) +
        parseFloat(payroll.eis_employer)
    );

    return (
        <AuthenticatedLayout header={
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">
                    Slip Gaji — {payroll.driver.name}
                </h2>
                <Link href={route('payroll.index')} className="text-sm text-gray-500 hover:text-gray-700">
                    ← Kembali
                </Link>
            </div>
        }>
            <Head title={`Slip Gaji - ${payroll.driver.name}`} />

            {flash?.success && (
                <div className="mb-4 rounded-md bg-green-50 px-4 py-3 text-sm text-green-800 border border-green-200">
                    {flash.success}
                </div>
            )}

            <div className="max-w-3xl mx-auto space-y-4">

                {/* Header card */}
                <div className="rounded-lg bg-white border border-gray-200 px-6 py-5">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">{payroll.driver.name}</h3>
                            <p className="text-sm text-gray-500">IC: {payroll.driver.ic_number || '-'} &nbsp;|&nbsp; Jawatan: Pemandu</p>
                            <p className="text-sm text-gray-500 mt-1">Bulan: <span className="font-medium text-gray-700">{payroll.month}</span></p>
                        </div>
                        <div className="text-right">
                            {statusBadge(payroll.status)}
                            {payroll.paid_date && <p className="text-xs text-gray-400 mt-1">Dibayar: {payroll.paid_date}</p>}
                        </div>
                    </div>
                </div>

                {/* Pendapatan & Pemotongan */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Pendapatan */}
                    <div className="rounded-lg bg-white border border-gray-200 overflow-hidden">
                        <div className="bg-gray-800 text-white text-center text-sm font-semibold py-2">PENDAPATAN</div>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-xs text-gray-500">
                                    <th className="px-4 py-2 text-left">Bil</th>
                                    <th className="px-4 py-2 text-left">Butiran</th>
                                    <th className="px-4 py-2 text-right">RM</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                <tr>
                                    <td className="px-4 py-2 text-gray-500">1-</td>
                                    <td className="px-4 py-2">Gaji</td>
                                    <td className="px-4 py-2 text-right font-medium">{parseFloat(payroll.base_salary).toFixed(2)}</td>
                                </tr>
                                <tr className="bg-gray-50">
                                    <td className="px-4 py-2 text-gray-500">2-</td>
                                    <td className="px-4 py-2">Komisyen</td>
                                    <td className="px-4 py-2 text-right font-medium">{parseFloat(payroll.commission_amount).toFixed(2)}</td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr className="bg-gray-100 font-semibold">
                                    <td colSpan={2} className="px-4 py-2 text-right">Jumlah (RM)</td>
                                    <td className="px-4 py-2 text-right">{parseFloat(payroll.gross_salary).toFixed(2)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    {/* Pemotongan */}
                    <div className="rounded-lg bg-white border border-gray-200 overflow-hidden">
                        <div className="bg-gray-800 text-white text-center text-sm font-semibold py-2">PEMOTONGAN</div>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-xs text-gray-500">
                                    <th className="px-4 py-2 text-left">Bil</th>
                                    <th className="px-4 py-2 text-left">Butiran</th>
                                    <th className="px-4 py-2 text-right">RM</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                <tr>
                                    <td className="px-4 py-2 text-gray-500">1-</td>
                                    <td className="px-4 py-2">KWSP Caruman Pekerja</td>
                                    <td className="px-4 py-2 text-right">{parseFloat(payroll.kwsp_employee).toFixed(2)}</td>
                                </tr>
                                <tr className="bg-gray-50">
                                    <td className="px-4 py-2 text-gray-500">2-</td>
                                    <td className="px-4 py-2">SOCSO Caruman Pekerja</td>
                                    <td className="px-4 py-2 text-right">{parseFloat(payroll.socso_employee).toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-2 text-gray-500">3-</td>
                                    <td className="px-4 py-2">EIS</td>
                                    <td className="px-4 py-2 text-right">{parseFloat(payroll.eis_employee).toFixed(2)}</td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr className="bg-gray-100 font-semibold">
                                    <td colSpan={2} className="px-4 py-2 text-right">Jumlah</td>
                                    <td className="px-4 py-2 text-right">{parseFloat(payroll.total_deductions).toFixed(2)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                {/* Account info & Employer contributions */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Account */}
                    <div className="rounded-lg bg-white border border-gray-200 px-4 py-4 text-sm space-y-2">
                        <InfoRow label="NO KWSP Pekerja" value={payroll.driver.kwsp_no || '-'} />
                        <InfoRow label="NO Socso Pekerja" value={payroll.driver.socso_no || '-'} />
                        <InfoRow label="Bank" value={payroll.driver.bank_name || '-'} />
                        <InfoRow label="No Akaun Bank" value={payroll.driver.bank_account_no || '-'} />
                    </div>

                    {/* Employer contributions */}
                    <div className="rounded-lg bg-white border border-gray-200 overflow-hidden">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-xs text-gray-500">
                                    <th className="px-4 py-2 text-left">Bil</th>
                                    <th className="px-4 py-2 text-left">Butiran</th>
                                    <th className="px-4 py-2 text-right">RM</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                <tr>
                                    <td className="px-4 py-2 text-gray-500">1-</td>
                                    <td className="px-4 py-2">KWSP Caruman Majikan</td>
                                    <td className="px-4 py-2 text-right">{parseFloat(payroll.kwsp_employer).toFixed(2)}</td>
                                </tr>
                                <tr className="bg-gray-50">
                                    <td className="px-4 py-2 text-gray-500">2-</td>
                                    <td className="px-4 py-2">SOCSO Caruman Majikan</td>
                                    <td className="px-4 py-2 text-right">{parseFloat(payroll.socso_employer).toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-2 text-gray-500">3-</td>
                                    <td className="px-4 py-2">EIS</td>
                                    <td className="px-4 py-2 text-right">{parseFloat(payroll.eis_employer).toFixed(2)}</td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr className="bg-gray-100 font-semibold">
                                    <td colSpan={2} className="px-4 py-2 text-right">Jumlah</td>
                                    <td className="px-4 py-2 text-right">{totalEmployerContrib.toFixed(2)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                {/* Net Salary */}
                <div className="rounded-lg bg-blue-50 border border-blue-200 px-6 py-4 flex items-center justify-between">
                    <span className="text-base font-semibold text-blue-900">Gaji Bersih (RM)</span>
                    <span className="text-2xl font-bold text-blue-900">{parseFloat(payroll.net_salary).toFixed(2)}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-2">
                    <a
                        href={route('payroll.pdf', payroll.id)}
                        target="_blank"
                        className="rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
                    >
                        Cetak / Muat Turun PDF
                    </a>

                    {payroll.status === 'draft' && (
                        <button
                            onClick={handleApprove}
                            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                            ✅ Luluskan
                        </button>
                    )}

                    {payroll.status === 'approved' && (
                        <button
                            onClick={handleMarkPaid}
                            className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                        >
                            💸 Tandakan Dibayar
                        </button>
                    )}

                    {payroll.status === 'draft' && (
                        <button
                            onClick={handleDelete}
                            className="rounded-md bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 ml-auto"
                        >
                            Padam
                        </button>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function InfoRow({ label, value }) {
    return (
        <div className="flex items-start gap-2">
            <span className="text-gray-500 w-36 shrink-0">{label}</span>
            <span className="font-medium text-gray-800">{value}</span>
        </div>
    );
}
