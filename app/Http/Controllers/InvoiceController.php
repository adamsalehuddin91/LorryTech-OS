<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\Customer;
use App\Services\InvoiceService;
use App\Services\PdfService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InvoiceController extends Controller
{
    public function __construct(
        protected InvoiceService $invoiceService,
        protected PdfService $pdfService
    ) {}

    public function index(Request $request)
    {
        $query = Invoice::with('customer');

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('invoice_number', 'like', "%{$search}%")
                  ->orWhereHas('customer', fn($c) => $c->where('name', 'like', "%{$search}%"));
            });
        }

        if ($status = $request->input('payment_status')) {
            $query->where('payment_status', $status);
        }

        $invoices = $query->orderByDesc('created_at')->paginate(15)->withQueryString();

        return Inertia::render('Invoices/Index', [
            'invoices' => $invoices,
            'filters' => $request->only(['search', 'payment_status']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Invoices/Create', [
            'customers' => Customer::orderBy('name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'due_date' => 'required|date',
            'tax_rate' => 'nullable|numeric|min:0|max:100',
            'notes' => 'nullable|string|max:1000',
            'items' => 'required|array|min:1',
            'items.*.description' => 'required|string|max:255',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.unit_price' => 'required|numeric|min:0',
        ]);

        $this->invoiceService->createInvoice($validated);

        return redirect()->route('invoices.index')->with('success', 'Invois berjaya dibuat.');
    }

    public function show(Invoice $invoice)
    {
        $invoice->load(['customer', 'items', 'payments', 'trip', 'quotation']);

        return Inertia::render('Invoices/Show', [
            'invoice' => $invoice,
        ]);
    }

    public function edit(Invoice $invoice)
    {
        $invoice->load(['customer', 'items']);

        return Inertia::render('Invoices/Edit', [
            'invoice' => $invoice,
            'customers' => Customer::orderBy('name')->get(),
        ]);
    }

    public function update(Request $request, Invoice $invoice)
    {
        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'due_date' => 'required|date',
            'tax_rate' => 'nullable|numeric|min:0|max:100',
            'notes' => 'nullable|string|max:1000',
            'items' => 'required|array|min:1',
            'items.*.description' => 'required|string|max:255',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.unit_price' => 'required|numeric|min:0',
        ]);

        $this->invoiceService->updateInvoice($invoice, $validated);

        return redirect()->route('invoices.index')->with('success', 'Invois berjaya dikemaskini.');
    }

    public function destroy(Invoice $invoice)
    {
        $invoice->items()->delete();
        $invoice->payments()->delete();
        $invoice->delete();

        return redirect()->route('invoices.index')->with('success', 'Invois berjaya dipadam.');
    }

    public function recordPayment(Request $request, Invoice $invoice)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0.01',
            'payment_method' => 'required|in:cash,bank_transfer,cheque',
            'payment_date' => 'nullable|date',
            'reference_number' => 'nullable|string|max:100',
            'notes' => 'nullable|string|max:500',
        ]);

        $this->invoiceService->recordPayment($invoice, $validated);

        return back()->with('success', 'Bayaran berjaya direkod.');
    }

    public function pdf(Invoice $invoice)
    {
        $pdf = $this->pdfService->generateInvoicePdf($invoice);
        return $this->pdfService->streamPdf($pdf, "Invois-{$invoice->invoice_number}.pdf");
    }
}
