<?php

namespace App\Services;

use App\Models\Quotation;
use App\Models\QuotationItem;
use Illuminate\Support\Facades\DB;

class QuotationService
{
    public function __construct(
        protected InvoiceService $invoiceService
    ) {}

    public function generateQuotationNumber(): string
    {
        $prefix = config('company.doc_prefix', 'LT');
        $yy = now()->format('y');
        $mm = now()->format('m');
        $docPrefix = "{$prefix}Q{$yy}{$mm}/";

        $last = Quotation::where('quotation_number', 'like', "{$docPrefix}%")
            ->orderByDesc('id')
            ->first();

        if ($last) {
            $lastNumber = (int) str_replace($docPrefix, '', $last->quotation_number);
            $newNumber = $lastNumber + 1;
        } else {
            $newNumber = 1;
        }

        return $docPrefix . $newNumber;
    }

    public function createQuotation(array $data): Quotation
    {
        return DB::transaction(function () use ($data) {
            $quotationNumber = $this->generateQuotationNumber();

            $subtotal = 0;
            foreach ($data['items'] as $item) {
                $subtotal += $item['quantity'] * $item['unit_price'];
            }

            $taxRate = $data['tax_rate'] ?? 0;
            $taxAmount = $subtotal * ($taxRate / 100);
            $totalAmount = $subtotal + $taxAmount;

            $quotation = Quotation::create([
                'quotation_number' => $quotationNumber,
                'customer_id' => $data['customer_id'],
                'subtotal' => $subtotal,
                'tax_amount' => $taxAmount,
                'total_amount' => $totalAmount,
                'status' => 'draft',
                'valid_until' => $data['valid_until'] ?? null,
                'notes' => $data['notes'] ?? null,
            ]);

            foreach ($data['items'] as $item) {
                QuotationItem::create([
                    'quotation_id' => $quotation->id,
                    'description' => $item['description'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'amount' => $item['quantity'] * $item['unit_price'],
                ]);
            }

            return $quotation->fresh(['items', 'customer']);
        });
    }

    public function updateQuotation(Quotation $quotation, array $data): Quotation
    {
        return DB::transaction(function () use ($quotation, $data) {
            $subtotal = 0;
            foreach ($data['items'] as $item) {
                $subtotal += $item['quantity'] * $item['unit_price'];
            }

            $taxRate = $data['tax_rate'] ?? 0;
            $taxAmount = $subtotal * ($taxRate / 100);
            $totalAmount = $subtotal + $taxAmount;

            $quotation->update([
                'customer_id' => $data['customer_id'],
                'subtotal' => $subtotal,
                'tax_amount' => $taxAmount,
                'total_amount' => $totalAmount,
                'valid_until' => $data['valid_until'] ?? null,
                'notes' => $data['notes'] ?? null,
            ]);

            $quotation->items()->delete();

            foreach ($data['items'] as $item) {
                QuotationItem::create([
                    'quotation_id' => $quotation->id,
                    'description' => $item['description'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'amount' => $item['quantity'] * $item['unit_price'],
                ]);
            }

            return $quotation->fresh(['items', 'customer']);
        });
    }

    public function updateStatus(Quotation $quotation, string $status): Quotation
    {
        $quotation->update(['status' => $status]);
        return $quotation->fresh();
    }

    public function convertToInvoice(Quotation $quotation): \App\Models\Invoice
    {
        return DB::transaction(function () use ($quotation) {
            $quotation->load(['items', 'customer']);

            $invoiceData = [
                'customer_id' => $quotation->customer_id,
                'quotation_id' => $quotation->id,
                'due_date' => now()->addDays(30)->toDateString(),
                'tax_rate' => $quotation->subtotal > 0
                    ? ($quotation->tax_amount / $quotation->subtotal) * 100
                    : 0,
                'notes' => "Dari Sebut Harga {$quotation->quotation_number}",
                'items' => $quotation->items->map(fn($item) => [
                    'description' => $item->description,
                    'quantity' => $item->quantity,
                    'unit_price' => $item->unit_price,
                ])->toArray(),
            ];

            $invoice = $this->invoiceService->createInvoice($invoiceData);

            $quotation->update([
                'status' => 'converted',
                'converted_invoice_id' => $invoice->id,
            ]);

            return $invoice;
        });
    }
}
