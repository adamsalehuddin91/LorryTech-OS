<?php

namespace App\Services;

use App\Models\Invoice;
use App\Models\Payroll;
use App\Models\Quotation;
use App\Models\CompanySetting;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;

class PdfService
{
    public function generateInvoicePdf(Invoice $invoice)
    {
        $invoice->load(['customer', 'items', 'companySetting']);
        $company = $invoice->companySetting ?? CompanySetting::first();

        return Pdf::loadView('pdf.invoice', [
            'invoice' => $invoice,
            'company' => $company,
            'logo'    => $this->companyLogoDataUri($company),
        ])->setOptions(['isRemoteEnabled' => true])->setPaper('a4', 'portrait');
    }

    public function generateQuotationPdf(Quotation $quotation)
    {
        $quotation->load(['customer', 'items', 'companySetting']);
        $company = $quotation->companySetting ?? CompanySetting::first();

        return Pdf::loadView('pdf.quotation', [
            'quotation' => $quotation,
            'company'   => $company,
            'logo'      => $this->companyLogoDataUri($company),
        ])->setOptions(['isRemoteEnabled' => true])->setPaper('a4', 'portrait');
    }

    public function generatePayrollPdf(Payroll $payroll)
    {
        $company = CompanySetting::first();

        return Pdf::loadView('pdf.slip-gaji', [
            'payroll' => $payroll,
            'company' => $company,
            'logo'    => $this->companyLogoDataUri($company),
        ])->setOptions(['isRemoteEnabled' => true])->setPaper('a4', 'portrait');
    }

    /**
     * Convert the company logo to a base64 data URI.
     * dompdf can't resolve the stored "/storage/..." relative path, so we embed
     * the image bytes directly — works regardless of storage symlink/host/chroot.
     */
    protected function companyLogoDataUri(?CompanySetting $company): ?string
    {
        if (!$company || empty($company->logo_url)) {
            return null;
        }

        // Stored as "/storage/logos/xxx.png" → relative path on the public disk.
        $relative = ltrim(str_replace('/storage/', '', $company->logo_url), '/');

        if (!Storage::disk('public')->exists($relative)) {
            return null;
        }

        $mime = Storage::disk('public')->mimeType($relative) ?: 'image/png';

        return 'data:' . $mime . ';base64,' . base64_encode(Storage::disk('public')->get($relative));
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
