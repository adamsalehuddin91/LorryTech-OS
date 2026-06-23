<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function __construct()
    {
        $this->middleware('role:owner');
    }

    public function index(Request $request)
    {
        $customers = Customer::query()
            ->when($request->search, function ($q, $search) {
                $safe = $this->escapeLike($search);
                return $q->where('name', 'like', "%{$safe}%")
                         ->orWhere('company', 'like', "%{$safe}%")
                         ->orWhere('phone', 'like', "%{$safe}%");
            })
            ->withCount(['trips', 'invoices'])
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Customers/Index', [
            'customers' => $customers,
            'filters'   => $request->only('search'),
        ]);
    }

    public function create()
    {
        return Inertia::render('Customers/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'    => 'required|string|max:255',
            'company' => 'nullable|string|max:255',
            'phone'   => 'nullable|string|max:20',
            'email'   => 'nullable|email|max:255',
            'address' => 'nullable|string',
            'notes'   => 'nullable|string',
        ]);

        Customer::create($validated);

        return redirect()->route('customers.index')->with('success', 'Pelanggan berjaya ditambah.');
    }

    // Inline create from another form (e.g. quotation) — returns JSON, no redirect.
    public function quickStore(Request $request)
    {
        $validated = $request->validate([
            'name'    => 'required|string|max:255',
            'company' => 'nullable|string|max:255',
            'phone'   => 'nullable|string|max:20',
            'email'   => 'nullable|email|max:255',
        ]);

        $customer = Customer::create($validated);

        return response()->json($customer);
    }

    public function edit(Customer $customer)
    {
        return Inertia::render('Customers/Edit', ['customer' => $customer]);
    }

    public function update(Request $request, Customer $customer)
    {
        $validated = $request->validate([
            'name'    => 'required|string|max:255',
            'company' => 'nullable|string|max:255',
            'phone'   => 'nullable|string|max:20',
            'email'   => 'nullable|email|max:255',
            'address' => 'nullable|string',
            'notes'   => 'nullable|string',
        ]);

        $customer->update($validated);

        return redirect()->route('customers.index')->with('success', 'Pelanggan berjaya dikemaskini.');
    }

    public function destroy(Customer $customer)
    {
        $customer->delete();

        return redirect()->route('customers.index')->with('success', 'Pelanggan berjaya dipadam.');
    }
}
