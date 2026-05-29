<?php

namespace App\Http\Controllers;

use App\Models\Driver;
use App\Models\Payroll;
use App\Services\PayrollService;
use App\Services\PdfService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PayrollController extends Controller
{
    public function __construct(
        private PayrollService $payrollService,
        private PdfService $pdfService,
    ) {}

    public function index(Request $request)
    {
        $month = $request->get('month', now()->format('Y-m'));

        $payrolls = Payroll::with(['driver.user'])
            ->where('month', $month)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($p) => [
                'id'               => $p->id,
                'driver_name'      => $p->driver->user->name ?? '-',
                'month'            => $p->month,
                'base_salary'      => $p->base_salary,
                'commission_amount'=> $p->commission_amount,
                'gross_salary'     => $p->gross_salary,
                'total_deductions' => $p->total_deductions,
                'net_salary'       => $p->net_salary,
                'status'           => $p->status,
                'paid_date'        => $p->paid_date?->format('d/m/Y'),
            ]);

        $drivers = DB::table('drivers')
            ->join('users', 'drivers.user_id', '=', 'users.id')
            ->select('drivers.id', 'drivers.base_salary', 'users.name')
            ->get()
            ->map(fn($d) => [
                'id'          => $d->id,
                'name'        => $d->name,
                'base_salary' => $d->base_salary,
                'has_payroll' => Payroll::where('driver_id', $d->id)->where('month', $month)->exists(),
            ]);

        return Inertia::render('Payroll/Index', [
            'payrolls'     => $payrolls,
            'drivers'      => $drivers,
            'currentMonth' => $month,
        ]);
    }

    public function generate(Request $request)
    {
        $request->validate([
            'driver_id' => 'required|exists:drivers,id',
            'month'     => 'required|date_format:Y-m',
        ]);

        $driver = Driver::findOrFail($request->driver_id);

        try {
            $payroll = $this->payrollService->generate($driver, $request->month, auth()->id());
            return redirect()->route('payroll.show', $payroll->id)
                ->with('success', 'Slip gaji berjaya dijana.');
        } catch (\RuntimeException $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function show(Payroll $payroll)
    {
        $payroll->load(['driver.user', 'generatedBy']);

        return Inertia::render('Payroll/Show', [
            'payroll' => [
                'id'                => $payroll->id,
                'month'             => $payroll->month,
                'status'            => $payroll->status,
                'paid_date'         => $payroll->paid_date?->format('d/m/Y'),
                'notes'             => $payroll->notes,
                'base_salary'       => $payroll->base_salary,
                'commission_amount' => $payroll->commission_amount,
                'gross_salary'      => $payroll->gross_salary,
                'kwsp_employee'     => $payroll->kwsp_employee,
                'kwsp_employer'     => $payroll->kwsp_employer,
                'socso_employee'    => $payroll->socso_employee,
                'socso_employer'    => $payroll->socso_employer,
                'eis_employee'      => $payroll->eis_employee,
                'eis_employer'      => $payroll->eis_employer,
                'total_deductions'  => $payroll->total_deductions,
                'net_salary'        => $payroll->net_salary,
                'driver' => [
                    'name'           => $payroll->driver->user->name ?? '-',
                    'ic_number'      => $payroll->driver->ic_number,
                    'kwsp_no'        => $payroll->driver->kwsp_no,
                    'socso_no'       => $payroll->driver->socso_no,
                    'bank_name'      => $payroll->driver->bank_name,
                    'bank_account_no'=> $payroll->driver->bank_account_no,
                ],
                'generated_by' => $payroll->generatedBy->name ?? '-',
            ],
        ]);
    }

    public function approve(Payroll $payroll)
    {
        abort_unless($payroll->status === 'draft', 422, 'Hanya slip draft boleh diluluskan.');
        $payroll->update(['status' => 'approved']);
        return back()->with('success', 'Slip gaji diluluskan.');
    }

    public function markPaid(Request $request, Payroll $payroll)
    {
        abort_unless($payroll->status === 'approved', 422, 'Hanya slip diluluskan boleh ditanda dibayar.');
        $payroll->update([
            'status'    => 'paid',
            'paid_date' => $request->get('paid_date', now()->toDateString()),
        ]);
        return back()->with('success', 'Slip gaji ditanda sebagai dibayar.');
    }

    public function destroy(Payroll $payroll)
    {
        abort_unless($payroll->status === 'draft', 422, 'Hanya slip draft boleh dipadam.');
        $payroll->delete();
        return redirect()->route('payroll.index')->with('success', 'Slip gaji dipadam.');
    }

    public function pdf(Payroll $payroll)
    {
        $payroll->load(['driver.user', 'generatedBy']);
        $pdf = $this->pdfService->generatePayrollPdf($payroll);
        return $this->pdfService->streamPdf($pdf, "SlipGaji-{$payroll->driver->user->name}-{$payroll->month}.pdf");
    }
}
