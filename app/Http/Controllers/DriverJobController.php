<?php

namespace App\Http\Controllers;

use App\Models\DriverCommission;
use App\Models\DriverJob;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DriverJobController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->get('status', 'pending');

        $jobs = DriverJob::with(['driver.user'])
            ->when($status !== 'all', fn($q) => $q->where('status', $status))
            ->when($request->job_type, fn($q, $t) => $q->where('job_type', $t))
            ->orderByDesc('job_date')
            ->paginate(20)
            ->withQueryString()
            ->through(fn($j) => [
                'id'               => $j->id,
                'driver_name'      => $j->driver->user->name ?? '-',
                'job_type'         => $j->job_type,
                'job_type_label'   => $j->job_type_label,
                'job_date'         => $j->job_date->format('d/m/Y'),
                'pickup_location'  => $j->pickup_location,
                'delivery_location'=> $j->delivery_location,
                'pickup_lat'       => $j->pickup_lat,
                'pickup_lng'       => $j->pickup_lng,
                'delivery_lat'     => $j->delivery_lat,
                'delivery_lng'     => $j->delivery_lng,
                'distance_km'      => $j->distance_km,
                'duration_min'     => $j->duration_min,
                'customer_name'    => $j->customer_name,
                'gross_amount'     => $j->gross_amount,
                'commission_rate'  => $j->commission_rate,
                'commission_amount'=> $j->commission_amount,
                'proof_image'      => $j->proof_image,
                'notes'            => $j->notes,
                'status'           => $j->status,
                'rejection_reason' => $j->rejection_reason,
                'verified_at'      => $j->verified_at?->format('d/m/Y H:i'),
                'created_at'       => $j->created_at->format('d/m/Y'),
            ]);

        $counts = [
            'pending'  => DriverJob::where('status', 'pending')->count(),
            'verified' => DriverJob::where('status', 'verified')->count(),
            'rejected' => DriverJob::where('status', 'rejected')->count(),
        ];

        return Inertia::render('DriverJobs/Index', [
            'jobs'    => $jobs,
            'counts'  => $counts,
            'filters' => $request->only(['status', 'job_type']),
        ]);
    }

    // Admin map — today's (or a date's) jobs that have route coords.
    public function map(Request $request)
    {
        $date = $request->get('date', now()->toDateString());

        $jobs = DriverJob::with('driver.user')
            ->whereDate('job_date', $date)
            ->whereNotNull('pickup_lat')->whereNotNull('delivery_lat')
            ->orderBy('created_at')
            ->get()
            ->map(fn ($j) => [
                'id'                => $j->id,
                'driver_name'       => $j->driver->user->name ?? '-',
                'job_type_label'    => $j->job_type_label,
                'pickup_location'   => $j->pickup_location,
                'delivery_location' => $j->delivery_location,
                'pickup'            => ['lat' => (float) $j->pickup_lat, 'lng' => (float) $j->pickup_lng],
                'delivery'          => ['lat' => (float) $j->delivery_lat, 'lng' => (float) $j->delivery_lng],
                'distance_km'       => (float) $j->distance_km,
                'route_polyline'    => $j->route_polyline,
                'status'            => $j->status,
            ]);

        // Anggaran kos minyak (RM/km — minyak + susut nilai). Laras ikut fleet.
        $costPerKm = 0.50;

        $all = DriverJob::with('driver.user')->whereDate('job_date', $date)->get();
        $summary = $all->groupBy(fn ($j) => $j->driver->user->name ?? '-')
            ->map(fn ($g, $name) => [
                'driver'     => $name,
                'jobs'       => $g->count(),
                'km'         => round($g->sum('distance_km'), 1),
                'cost'       => round($g->sum('distance_km') * $costPerKm, 2),
                'commission' => round($g->sum('commission_amount'), 2),
            ])->sortByDesc('km')->values();
        $totalKm = round($all->sum('distance_km'), 1);

        return Inertia::render('DriverJobs/Map', [
            'date'        => $date,
            'jobs'        => $jobs,
            'total_km'    => $totalKm,
            'total_cost'  => round($totalKm * $costPerKm, 2),
            'cost_per_km' => $costPerKm,
            'summary'     => $summary,
        ]);
    }

    // Backfill: save a route polyline computed client-side (for jobs logged without one).
    public function savePolyline(Request $request, DriverJob $driverJob)
    {
        $data = $request->validate(['route_polyline' => 'required|string|max:65000']);
        $driverJob->update(['route_polyline' => $data['route_polyline']]);
        return response()->json(['ok' => true]);
    }

    public function verify(Request $request, DriverJob $driverJob)
    {
        abort_unless($driverJob->status === 'pending', 422, 'Hanya job pending boleh disahkan.');

        // Auto-create DriverCommission record
        $month = $driverJob->job_date->format('Y-m');
        $commission = DriverCommission::create([
            'driver_id'         => $driverJob->driver_id,
            'trip_id'           => null,
            'commission_rate'   => $driverJob->commission_rate,
            'trip_revenue'      => $driverJob->gross_amount,
            'commission_amount' => $driverJob->commission_amount,
            'month'             => $month,
            'status'            => 'approved',
            'paid_date'         => null,
        ]);

        $driverJob->update([
            'status'               => 'verified',
            'verified_by'          => auth()->id(),
            'verified_at'          => now(),
            'driver_commission_id' => $commission->id,
        ]);

        return back()->with('success', 'Job disahkan dan komisyen telah direkod.');
    }

    public function reject(Request $request, DriverJob $driverJob)
    {
        $request->validate(['reason' => 'nullable|string|max:255']);
        abort_unless($driverJob->status === 'pending', 422, 'Hanya job pending boleh ditolak.');

        $driverJob->update([
            'status'           => 'rejected',
            'rejection_reason' => $request->reason,
            'verified_by'      => auth()->id(),
            'verified_at'      => now(),
        ]);

        return back()->with('success', 'Job telah ditolak.');
    }
}
