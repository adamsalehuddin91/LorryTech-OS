<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\Vehicle;
use App\Models\Driver;
use App\Services\ExpenseService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExpenseController extends Controller
{
    public function __construct(
        protected ExpenseService $expenseService
    ) {}

    public function index(Request $request)
    {
        $query = Expense::with(['vehicle', 'driver']);

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('description', 'like', "%{$search}%")
                  ->orWhereHas('vehicle', fn($v) => $v->where('plate_number', 'like', "%{$search}%"));
            });
        }

        if ($category = $request->input('category')) {
            $query->where('category', $category);
        }

        if ($vehicleId = $request->input('vehicle_id')) {
            $query->where('vehicle_id', $vehicleId);
        }

        if ($verified = $request->input('verified')) {
            $query->where('verified', $verified === 'yes');
        }

        $expenses = $query->orderByDesc('receipt_date')->paginate(15)->withQueryString();

        $auditScore = $this->expenseService->getAuditScore();

        return Inertia::render('Expenses/Index', [
            'expenses' => $expenses,
            'filters' => $request->only(['search', 'category', 'vehicle_id', 'verified']),
            'vehicles' => Vehicle::orderBy('plate_number')->get(['id', 'plate_number']),
            'auditScore' => $auditScore,
        ]);
    }

    public function create()
    {
        return Inertia::render('Expenses/Create', [
            'vehicles' => Vehicle::orderBy('plate_number')->get(['id', 'plate_number', 'brand', 'model']),
            'drivers' => Driver::orderBy('name')->get(['id', 'name']),
            'categories' => $this->categoryOptions(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'vehicle_id' => 'required|exists:vehicles,id',
            'driver_id' => 'nullable|exists:drivers,id',
            'category' => 'required|in:fuel,toll,maintenance,repair,tyre,insurance,roadtax,permit,parking,other',
            'amount' => 'required|numeric|min:0.01',
            'receipt_date' => 'required|date',
            'description' => 'nullable|string|max:255',
            'receipt_image' => 'nullable|image|max:5120',
        ]);

        $receipt = $request->file('receipt_image');
        unset($validated['receipt_image']);

        $validated['uploaded_by'] = $request->user()->id;

        $this->expenseService->createExpense($validated, $receipt);

        return redirect()->route('expenses.index')->with('success', 'Perbelanjaan berjaya ditambah.');
    }

    public function show(Expense $expense)
    {
        $expense->load(['vehicle', 'driver', 'uploader']);

        return Inertia::render('Expenses/Show', [
            'expense' => $expense,
            'categories' => $this->categoryOptions(),
        ]);
    }

    public function edit(Expense $expense)
    {
        $expense->load(['vehicle', 'driver']);

        return Inertia::render('Expenses/Edit', [
            'expense' => $expense,
            'vehicles' => Vehicle::orderBy('plate_number')->get(['id', 'plate_number', 'brand', 'model']),
            'drivers' => Driver::orderBy('name')->get(['id', 'name']),
            'categories' => $this->categoryOptions(),
        ]);
    }

    public function update(Request $request, Expense $expense)
    {
        $validated = $request->validate([
            'vehicle_id' => 'required|exists:vehicles,id',
            'driver_id' => 'nullable|exists:drivers,id',
            'category' => 'required|in:fuel,toll,maintenance,repair,tyre,insurance,roadtax,permit,parking,other',
            'amount' => 'required|numeric|min:0.01',
            'receipt_date' => 'required|date',
            'description' => 'nullable|string|max:255',
            'receipt_image' => 'nullable|image|max:5120',
        ]);

        $receipt = $request->file('receipt_image');
        unset($validated['receipt_image']);

        $this->expenseService->updateExpense($expense, $validated, $receipt);

        return redirect()->route('expenses.index')->with('success', 'Perbelanjaan berjaya dikemaskini.');
    }

    public function destroy(Expense $expense)
    {
        $this->expenseService->deleteExpense($expense);

        return redirect()->route('expenses.index')->with('success', 'Perbelanjaan berjaya dipadam.');
    }

    public function toggleVerify(Expense $expense)
    {
        $expense->update(['verified' => !$expense->verified]);

        return back()->with('success', $expense->verified ? 'Resit disahkan.' : 'Pengesahan dibatalkan.');
    }

    protected function categoryOptions(): array
    {
        return [
            'fuel' => 'Bahan Api (Diesel)',
            'toll' => 'Tol',
            'maintenance' => 'Penyelenggaraan',
            'repair' => 'Pembaikan',
            'tyre' => 'Tayar',
            'insurance' => 'Insurans',
            'roadtax' => 'Cukai Jalan',
            'permit' => 'Permit (APAD)',
            'parking' => 'Parking',
            'other' => 'Lain-lain',
        ];
    }
}
