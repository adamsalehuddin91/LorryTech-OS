<?php

namespace App\Http\Controllers;

use App\Services\DashboardService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __construct(
        protected DashboardService $dashboardService
    ) {}

    public function __invoke(Request $request)
    {
        if ($request->user()->isDriver()) {
            return redirect()->route('driver.dashboard');
        }

        $data = $this->dashboardService->getOwnerDashboard();

        return Inertia::render('Dashboard', $data);
    }
}
