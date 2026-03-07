<?php

namespace App\Services;

use App\Models\Invoice;
use App\Models\Quotation;
use App\Models\CompanySetting;
use Barryvdh\DomPDF\Facade\Pdf;

class PdfService
{
    public function generateInvoicePdf(Invoice $invoice)
    {
        $invoice->load(['customer', 'items']);
        $company = CompanySetting::first();

        return Pdf::loadView('pdf.invoice', [
            'invoice' => $invoice,
            'company' => $company,
        ])->setPaper('a4', 'portrait');
    }

    public function generateQuotationPdf(Quotation $quotation)
    {
        $quotation->load(['customer', 'items']);
        $company = CompanySetting::first();

        return Pdf::loadView('pdf.quotation', [
            'quotation' => $quotation,
            'company' => $company,
        ])->setPaper('a4', 'portrait');
    }

    public function streamPdf($pdf, string $filename)
    {
        return $pdf->stream(str_replace(['/', '\\'], '-', $filename));
    }

    public function downloadPdf($pdf, string $filename)
    {
        return $pdf->download(str_replace(['/', '\\'], '-', $filename));
    }
}
