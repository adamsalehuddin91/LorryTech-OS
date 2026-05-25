<?php

namespace App\Http\Controllers;

use App\Models\CompanySetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CompanySettingController extends Controller
{
    public function __construct()
    {
        $this->middleware('role:owner');
    }

    public function edit()
    {
        $company = CompanySetting::first() ?? new CompanySetting();

        return Inertia::render('Settings/Company', [
            'company' => [
                'id'                  => $company->id,
                'name'                => $company->name ?? '',
                'reg_no'              => $company->reg_no ?? '',
                'tin'                 => $company->tin ?? '',
                'address'             => $company->address ?? '',
                'phone'               => $company->phone ?? '',
                'email'               => $company->email ?? '',
                'logo_url'            => $company->logo_url ?? '',
                'bank_name'           => $company->bank_details['bank_name'] ?? '',
                'bank_account_name'   => $company->bank_details['account_name'] ?? '',
                'bank_account_number' => $company->bank_details['account_number'] ?? '',
            ],
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'name'                => 'required|string|max:255',
            'reg_no'              => 'nullable|string|max:50',
            'tin'                 => 'nullable|string|max:30',
            'address'             => 'nullable|string',
            'phone'               => 'nullable|string|max:20',
            'email'               => 'nullable|email',
            'logo'                => 'nullable|image|mimes:png,jpg,jpeg,svg|max:2048',
            'bank_name'           => 'nullable|string|max:50',
            'bank_account_name'   => 'nullable|string|max:100',
            'bank_account_number' => 'nullable|string|max:30',
        ]);

        $company = CompanySetting::first() ?? new CompanySetting();

        $logoUrl = $company->logo_url;
        if ($request->hasFile('logo')) {
            // Delete old logo
            if ($logoUrl && str_starts_with($logoUrl, '/storage/')) {
                $oldPath = str_replace('/storage/', '', $logoUrl);
                Storage::disk('public')->delete($oldPath);
            }
            $path    = $request->file('logo')->store('logos', 'public');
            $logoUrl = '/storage/' . $path;
        }

        $company->fill([
            'name'         => $request->name,
            'reg_no'       => $request->reg_no,
            'tin'          => $request->tin,
            'address'      => $request->address,
            'phone'        => $request->phone,
            'email'        => $request->email,
            'logo_url'     => $logoUrl,
            'bank_details' => [
                'bank_name'      => $request->bank_name,
                'account_name'   => $request->bank_account_name,
                'account_number' => $request->bank_account_number,
            ],
        ])->save();

        return redirect()->route('settings.company')->with('success', 'Tetapan syarikat berjaya dikemaskini.');
    }
}
