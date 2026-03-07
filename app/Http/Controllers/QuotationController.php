<?php

namespace App\Http\Controllers;

use App\Models\Quotation;
use App\Models\Customer;
use App\Services\QuotationService;
use App\Services\PdfService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QuotationController extends Controller
{
    public function __construct(
        protected QuotationService $quotationService,
        protected PdfService $pdfService
    ) {}

    public function index(Request $request)
    {
        $query = Quotation::with('customer');

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('quotation_number', 'like', "%{$search}%")
                  ->orWhereHas('customer', fn($c) => $c->where('name', 'like', "%{$search}%"));
            });
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        $quotations = $query->orderByDesc('created_at')->paginate(15)->withQueryString();

        return Inertia::render('Quotations/Index', [
            'quotations' => $quotations,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Quotations/Create', [
            'customers' => Customer::orderBy('name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'valid_until' => 'nullable|date',
            'tax_rate' => 'nullable|numeric|min:0|max:100',
            'notes' => 'nullable|string|max:1000',
            'items' => 'required|array|min:1',
            'items.*.description' => 'required|string|max:255',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.unit_price' => 'required|numeric|min:0',
        ]);

        $this->quotationService->createQuotation($validated);

        return redirect()->route('quotations.index')->with('success', 'Sebut harga berjaya dibuat.');
    }

    public function show(Quotation $quotation)
    {
        $quotation->load(['customer', 'items']);

        return Inertia::render('Quotations/Show', [
            'quotation' => $quotation,
        ]);
    }

    public function edit(Quotation $quotation)
    {
        $quotation->load(['customer', 'items']);

        return Inertia::render('Quotations/Edit', [
            'quotation' => $quotation,
            'customers' => Customer::orderBy('name')->get(),
        ]);
    }

    public function update(Request $request, Quotation $quotation)
    {
        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'valid_until' => 'nullable|date',
            'tax_rate' => 'nullable|numeric|min:0|max:100',
            'notes' => 'nullable|string|max:1000',
            'items' => 'required|array|min:1',
            'items.*.description' => 'required|string|max:255',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.unit_price' => 'required|numeric|min:0',
        ]);

        $this->quotationService->updateQuotation($quotation, $validated);

        return redirect()->route('quotations.index')->with('success', 'Sebut harga berjaya dikemaskini.');
    }

    public function destroy(Quotation $quotation)
    {
        $quotation->items()->delete();
        $quotation->delete();

        return redirect()->route('quotations.index')->with('success', 'Sebut harga berjaya dipadam.');
    }

    public function updateStatus(Request $request, Quotation $quotation)
    {
        $validated = $request->validate([
            'status' => 'required|in:draft,sent,accepted,rejected',
        ]);

        $this->quotationService->updateStatus($quotation, $validated['status']);

        return back()->with('success', 'Status berjaya dikemaskini.');
    }

    public function convertToInvoice(Quotation $quotation)
    {
        $invoice = $this->quotationService->convertToInvoice($quotation);

        return redirect()->route('invoices.show', $invoice)->with('success', 'Sebut harga berjaya ditukar ke invois.');
    }

    public function pdf(Quotation $quotation)
    {
        $pdf = $this->pdfService->generateQuotationPdf($quotation);
        return $this->pdfService->streamPdf($pdf, "Sebut-Harga-{$quotation->quotation_number}.pdf");
    }
}
