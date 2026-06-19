<?php

namespace App\Http\Middleware;

use App\Models\CompanySetting;
use App\Models\DriverJob;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $company = CompanySetting::first();
        $user = $request->user();

        // Pending driver-logged jobs awaiting owner verification (sidebar badge).
        $pendingJobsCount = ($user && !$user->isDriver())
            ? DriverJob::where('status', 'pending')->count()
            : 0;

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
            ],
            'company' => $company ? [
                'name'      => $company->name,
                'logo_url'  => $company->logo_url,
            ] : null,
            'pendingJobsCount' => $pendingJobsCount,
            'flash' => [
                'success' => $request->session()->get('success'),
                'error'   => $request->session()->get('error'),
            ],
        ];
    }
}
