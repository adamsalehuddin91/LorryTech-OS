<?php

namespace App\Services;

use App\Models\Driver;
use App\Models\Payroll;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

/**
 * Model gaji harian (2026-08-07).
 *
 *   Gaji harian      hari bekerja × kadar harian pemandu
 * + Elaun jarak jauh setiap hari jumlah km > 400  → +RM30 (sekali sehari)
 * + Bonus job besar  setiap job bernilai >= RM1,000 → +RM50
 * − KWSP / SOCSO / EIS
 *
 * Komisyen peratus (Lalamove/job tepi) DIBUANG daripada kiraan gaji.
 * Rekod `driver_commissions` lama kekal untuk sejarah, tetapi tidak lagi
 * mempengaruhi slip baharu.
 */
class PayrollService
{
    /**
     * Jana slip gaji untuk sebulan (YYYY-MM).
     *
     * @param int|null $daysOverride Bilangan hari yang admin tetapkan sendiri.
     *                               null = guna kiraan auto daripada rekod kerja.
     */
    public function generate(Driver $driver, string $month, int $generatedBy, ?int $daysOverride = null): Payroll
    {
        if (Payroll::where('driver_id', $driver->id)->where('month', $month)->exists()) {
            throw new \RuntimeException("Penggajian untuk {$driver->user->name} bulan {$month} sudah wujud.");
        }

        $calc = $this->calculate($driver, $month, $daysOverride);

        // Medan diagnostik, bukan medan slip — buang sebelum simpan.
        unset($calc['days_without_km']);

        return Payroll::create(array_merge($calc, [
            'driver_id'        => $driver->id,
            'generated_by'     => $generatedBy,
            'month'            => $month,
            'status'           => 'draft',
            'uses_daily_model' => true,

            // Komisyen peratus dibuang daripada model gaji.
            'commission_amount' => 0,
        ]));
    }

    /**
     * Kira semua angka slip tanpa menyimpannya.
     * Digunakan oleh skrin penggajian untuk papar pratonton sebelum admin
     * tekan "Jana", supaya angka yang dilihat = angka yang disimpan.
     */
    public function calculate(Driver $driver, string $month, ?int $daysOverride = null): array
    {
        $summary = $this->workSummary($driver, $month);

        $daysWorked = $daysOverride ?? $summary['days_worked'];
        $dailyRate  = (float) ($driver->daily_rate ?: config('payroll.daily_rate'));

        // Gaji pokok adalah PILIHAN. Kebanyakan pemandu bergaji harian sepenuhnya
        // (base 0); yang ada gaji pokok mendapat ia DI ATAS gaji harian. Bila 0,
        // barisnya tidak dipapar langsung pada slip.
        $baseSalary = (float) $driver->base_salary;

        $dailyWageTotal        = round($daysWorked * $dailyRate, 2);
        $longDistanceAllowance = round($summary['long_distance_days'] * config('payroll.long_distance.allowance'), 2);
        $bigJobBonus           = round($summary['big_job_count'] * config('payroll.big_job.bonus'), 2);

        $gross = round($baseSalary + $dailyWageTotal + $longDistanceAllowance + $bigJobBonus, 2);

        // Upah berkanun — bukan semestinya sama dengan gross. Lihat config/payroll.php.
        // Gaji pokok sentiasa upah, jadi sentiasa dicarum.
        $statutoryWage = $baseSalary + $dailyWageTotal
            + (config('payroll.statutory_includes_long_distance_allowance') ? $longDistanceAllowance : 0)
            + (config('payroll.statutory_includes_big_job_bonus') ? $bigJobBonus : 0);

        $kwsp  = $this->calcKwsp($statutoryWage);
        $socso = $driver->socso_enabled
            ? $this->calcSocso($statutoryWage)
            : ['employee' => 0.0, 'employer' => 0.0];
        $eis   = $driver->socso_enabled
            ? $this->calcEis($statutoryWage)
            : ['employee' => 0.0, 'employer' => 0.0];

        $totalDeductions = round($kwsp['employee'] + $socso['employee'] + $eis['employee'], 2);

        return [
            'base_salary'             => $baseSalary,
            'days_worked'             => $daysWorked,
            'daily_rate'              => $dailyRate,
            'daily_wage_total'        => $dailyWageTotal,
            'long_distance_days'      => $summary['long_distance_days'],
            'long_distance_allowance' => $longDistanceAllowance,
            'big_job_count'           => $summary['big_job_count'],
            'big_job_bonus'           => $bigJobBonus,
            // Bukan medan slip — untuk amaran admin sahaja (km terlupa diisi).
            'days_without_km'         => $summary['days_without_km'],
            'days_overridden'         => $daysOverride !== null && $daysOverride !== $summary['days_worked'],

            'gross_salary'     => $gross,
            'kwsp_employee'    => $kwsp['employee'],
            'kwsp_employer'    => $kwsp['employer'],
            'socso_employee'   => $socso['employee'],
            'socso_employer'   => $socso['employer'],
            'eis_employee'     => $eis['employee'],
            'eis_employer'     => $eis['employer'],
            'total_deductions' => $totalDeductions,

            // Bug lama: net dikira daripada base sahaja, jadi komisyen hilang
            // daripada bayaran walaupun muncul dalam gross. Net mesti daripada GROSS.
            'net_salary'       => round($gross - $totalDeductions, 2),
        ];
    }

    /**
     * Ringkasan kerja sebenar pemandu untuk sebulan.
     *
     * Dua sumber digabung — kedua-duanya kerja pemandu yang sama:
     *   driver_jobs  pemandu log sendiri (Lalamove / job tepi), kira yang VERIFIED sahaja
     *   trips        owner cipta untuk pemandu
     *
     * Satu hari dikira SEKALI walaupun ada kerja dalam kedua-dua sumber.
     *
     * HARI BEKERJA DITENTUKAN OLEH KILOMETER, bukan sekadar wujudnya rekod:
     * hari dengan jumlah km 0 (atau tiada km direkod) bermakna pemandu tidak
     * memandu hari itu, jadi tiada gaji harian untuk hari tersebut. Admin masih
     * boleh override bilangan hari kalau ada sebab sah (standby, kerja garaj).
     */
    public function workSummary(Driver $driver, string $month): array
    {
        [$start, $end] = $this->monthRange($month);

        // Km + nilai per hari, digabung dua sumber.
        $rows = DB::query()
            ->fromSub(
                DB::table('driver_jobs')
                    ->selectRaw('job_date as work_date, COALESCE(distance_km, 0) as km, COALESCE(gross_amount, 0) as value')
                    ->where('driver_id', $driver->id)
                    ->where('status', 'verified')
                    ->whereBetween('job_date', [$start, $end])
                    ->unionAll(
                        DB::table('trips')
                            ->selectRaw('pickup_date as work_date, COALESCE(distance_km, 0) as km, COALESCE(total_revenue, 0) as value')
                            ->where('driver_id', $driver->id)
                            ->whereBetween('pickup_date', [$start, $end])
                    ),
                'work'
            )
            ->selectRaw('work_date, SUM(km) as total_km, COUNT(*) as job_count')
            ->groupBy('work_date')
            ->get();

        $threshold = (float) config('payroll.long_distance.threshold_km');

        // Hanya hari yang ada km sebenar dikira sebagai hari bekerja.
        $daysWithKm = $rows->filter(fn($r) => (float) $r->total_km > 0);

        return [
            'days_worked'        => $daysWithKm->count(),
            'long_distance_days' => $daysWithKm->filter(fn($r) => (float) $r->total_km > $threshold)->count(),
            'big_job_count'      => $this->bigJobCount($driver, $start, $end),
            'total_km'           => round((float) $rows->sum('total_km'), 2),
            // Hari yang ada rekod kerja tetapi 0 km — dibendera supaya admin
            // boleh semak sama ada km terlupa diisi, bukan hilang senyap.
            'days_without_km'    => $rows->count() - $daysWithKm->count(),
        ];
    }

    /**
     * Bilangan job bernilai >= threshold. Dikira PER JOB (bukan per hari),
     * jadi dua job besar dalam satu hari = dua bonus.
     */
    private function bigJobCount(Driver $driver, string $start, string $end): int
    {
        $threshold = (float) config('payroll.big_job.threshold');

        $fromJobs = DB::table('driver_jobs')
            ->where('driver_id', $driver->id)
            ->where('status', 'verified')
            ->whereBetween('job_date', [$start, $end])
            ->where('gross_amount', '>=', $threshold)
            ->count();

        $fromTrips = DB::table('trips')
            ->where('driver_id', $driver->id)
            ->whereBetween('pickup_date', [$start, $end])
            ->where('total_revenue', '>=', $threshold)
            ->count();

        return $fromJobs + $fromTrips;
    }

    /** @return array{0:string,1:string} tarikh mula & akhir bulan (Y-m-d) */
    private function monthRange(string $month): array
    {
        $start = Carbon::createFromFormat('Y-m', $month)->startOfMonth();

        return [$start->toDateString(), $start->copy()->endOfMonth()->toDateString()];
    }

    // ─── Caruman Berkanun ───────────────────────────────────────────────────

    /**
     * KWSP (EPF): Pekerja 11%, Majikan 13% (upah <= RM5000).
     * Dibundarkan ke RM1 terdekat.
     */
    private function calcKwsp(float $wage): array
    {
        return [
            'employee' => round($wage * 0.11),
            'employer' => round($wage * 0.13),
        ];
    }

    /**
     * SOCSO (PERKESO): guna titik tengah jadual bracket.
     * Pekerja ~0.5%, Majikan ~1.75%. Upah berinsurans dihadkan RM5000.
     * Dibundarkan ke bawah kepada 5 sen terdekat.
     */
    private function calcSocso(float $wage): array
    {
        $midpoint = $this->bracketMidpoint(min($wage, 5000));

        return [
            'employee' => $this->floorToFiveSen($midpoint * 0.005),
            'employer' => $this->floorToFiveSen($midpoint * 0.0175),
        ];
    }

    /**
     * EIS (SIP): Pekerja 0.2%, Majikan 0.2% atas titik tengah bracket.
     */
    private function calcEis(float $wage): array
    {
        $amount = $this->floorToFiveSen($this->bracketMidpoint(min($wage, 5000)) * 0.002);

        return ['employee' => $amount, 'employer' => $amount];
    }

    /**
     * Titik tengah bracket PERKESO — band selebar RM100 selepas RM200.
     * cth RM1700 → bracket [1600.01, 1700] → titik tengah 1650.
     */
    private function bracketMidpoint(float $wage): float
    {
        if ($wage <= 30)  return 15;
        if ($wage <= 50)  return 40;
        if ($wage <= 70)  return 60;
        if ($wage <= 100) return 85;
        if ($wage <= 140) return 120;
        if ($wage <= 200) return 170;

        return (int) floor(($wage - 0.01) / 100) * 100 + 50;
    }

    private function floorToFiveSen(float $value): float
    {
        return floor($value * 20) / 20;
    }
}
