<?php

namespace App\Services;

use App\Models\Expense;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class ExpenseService
{
    protected function getDisk(): string
    {
        return config('filesystems.disks.r2.key') ? 'r2' : 'public';
    }

    public function createExpense(array $data, ?UploadedFile $receipt = null): Expense
    {
        if ($receipt) {
            $data['receipt_image_url'] = $this->uploadReceipt($receipt);
        }

        return Expense::create($data);
    }

    public function updateExpense(Expense $expense, array $data, ?UploadedFile $receipt = null): Expense
    {
        if ($receipt) {
            $this->deleteReceipt($expense->receipt_image_url);
            $data['receipt_image_url'] = $this->uploadReceipt($receipt);
        }

        $expense->update($data);
        return $expense->fresh();
    }

    public function deleteExpense(Expense $expense): void
    {
        $this->deleteReceipt($expense->receipt_image_url);
        $expense->delete();
    }

    public function uploadReceipt(UploadedFile $file): string
    {
        $disk = $this->getDisk();
        $path = $file->store('receipts/' . now()->format('Y/m'), $disk);

        if ($disk === 'r2') {
            return Storage::disk('r2')->url($path);
        }

        return Storage::disk('public')->url($path);
    }

    public function deleteReceipt(?string $url): void
    {
        if (!$url) return;

        $disk = $this->getDisk();

        if ($disk === 'r2') {
            $path = parse_url($url, PHP_URL_PATH);
            $path = ltrim($path, '/');
            Storage::disk('r2')->delete($path);
        } else {
            $path = str_replace('/storage/', '', parse_url($url, PHP_URL_PATH));
            Storage::disk('public')->delete($path);
        }
    }

    public function getAuditScore(int $month = null, int $year = null): array
    {
        $month = $month ?? now()->month;
        $year = $year ?? now()->year;

        $total = Expense::whereMonth('receipt_date', $month)
            ->whereYear('receipt_date', $year)
            ->count();

        $withReceipt = Expense::whereMonth('receipt_date', $month)
            ->whereYear('receipt_date', $year)
            ->whereNotNull('receipt_image_url')
            ->count();

        $verified = Expense::whereMonth('receipt_date', $month)
            ->whereYear('receipt_date', $year)
            ->where('verified', true)
            ->count();

        $score = $total > 0 ? round(($withReceipt / $total) * 100) : 100;

        return [
            'total_expenses' => $total,
            'with_receipt' => $withReceipt,
            'without_receipt' => $total - $withReceipt,
            'verified' => $verified,
            'score' => $score,
            'month' => $month,
            'year' => $year,
        ];
    }
}
