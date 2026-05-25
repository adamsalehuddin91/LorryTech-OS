<?php

namespace App\Services;

use App\Models\Driver;
use App\Models\DriverCommission;
use App\Models\Payroll;
use Carbon\Carbon;

class PayrollService
{
    /**
     * Generate payroll for a driver for the given month (YYYY-MM).
     * Throws if a payroll already exists for that month.
     */
    public function generate(Driver $driver, string $month, int $generatedBy): Payroll
    {
        if (Payroll::where('driver_id', $driver->id)->where('month', $month)->exists()) {
            throw new \RuntimeException("Penggajian untuk {$driver->user->name} bulan {$month} sudah wujud.");
        }

        $baseSalary = (float) $driver->base_salary;
        $commissionAmount = (float) DriverCommission::where('driver_id', $driver->id)
            ->where('month', $month)
            ->sum('commission_amount');

        $kwsp   = $this->calcKwsp($baseSalary);
        $socso  = $this->calcSocso($baseSalary);
        $eis    = $this->calcEis($baseSalary);

        $totalDeductions = $kwsp['employee'] + $socso['employee'] + $eis['employee'];
        $netSalary       = $baseSalary - $totalDeductions;

        return Payroll::create([
            'driver_id'        => $driver->id,
            'generated_by'     => $generatedBy,
            'month'            => $month,
            'base_salary'      => $baseSalary,
            'commission_amount'=> $commissionAmount,
            'gross_salary'     => $baseSalary + $commissionAmount,
            'kwsp_employee'    => $kwsp['employee'],
            'kwsp_employer'    => $kwsp['employer'],
            'socso_employee'   => $socso['employee'],
            'socso_employer'   => $socso['employer'],
            'eis_employee'     => $eis['employee'],
            'eis_employer'     => $eis['employer'],
            'total_deductions' => $totalDeductions,
            'net_salary'       => $netSalary,
            'status'           => 'draft',
        ]);
    }

    // ─── Calculation Helpers ────────────────────────────────────────────────

    /**
     * KWSP (EPF):
     *   Employee 11%, Employer 13% (salary ≤ RM5000)
     *   Rounded to nearest RM1.
     */
    private function calcKwsp(float $salary): array
    {
        $employee = round($salary * 0.11);
        $employer = round($salary * 0.13);
        return ['employee' => $employee, 'employer' => $employer];
    }

    /**
     * SOCSO (PERKESO):
     *   Based on PERKESO bracket table using midpoint formula.
     *   Employee ≈ 0.5%, Employer ≈ 1.75% of bracket midpoint.
     *   Insured wage capped at RM5000.
     *   Rounded down to nearest 5 sen.
     */
    private function calcSocso(float $salary): array
    {
        $insured  = min($salary, 5000);
        $midpoint = $this->bracketMidpoint($insured);

        $employee = $this->floorToFiveSen($midpoint * 0.005);
        $employer = $this->floorToFiveSen($midpoint * 0.0175);

        return ['employee' => $employee, 'employer' => $employer];
    }

    /**
     * EIS (Employment Insurance System):
     *   Employee 0.2%, Employer 0.2% of bracket midpoint.
     *   Insured wage capped at RM5000.
     *   Rounded down to nearest 5 sen.
     */
    private function calcEis(float $salary): array
    {
        $insured  = min($salary, 5000);
        $midpoint = $this->bracketMidpoint($insured);

        $amount = $this->floorToFiveSen($midpoint * 0.002);

        return ['employee' => $amount, 'employer' => $amount];
    }

    /**
     * PERKESO bracket midpoint:
     *   Brackets are RM100-wide above RM200.
     *   Midpoint = floor((salary-1)/100) * 100 + 50
     *   e.g. RM1700 → bracket [1600.01,1700] → midpoint 1650
     */
    private function bracketMidpoint(float $salary): float
    {
        if ($salary <= 30)  return 15;
        if ($salary <= 50)  return 40;
        if ($salary <= 70)  return 60;
        if ($salary <= 100) return 85;
        if ($salary <= 140) return 120;
        if ($salary <= 200) return 170;

        // 100-wide bands from 200.01 onwards
        $bandNum  = (int) floor(($salary - 0.01) / 100);
        return $bandNum * 100 + 50;
    }

    private function floorToFiveSen(float $value): float
    {
        return floor($value * 20) / 20;
    }
}
