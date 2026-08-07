<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Model Gaji Harian
    |--------------------------------------------------------------------------
    | Pemandu dibayar kadar HARIAN (bukan gaji bulanan tetap), campur elaun
    | jarak jauh dan bonus job besar. Komisyen peratus DIBUANG (2026-08-07).
    |
    | Kadar harian di sini adalah default sistem — setiap pemandu boleh ada
    | kadar sendiri melalui `drivers.daily_rate`.
    */

    'daily_rate' => (float) env('PAYROLL_DAILY_RATE', 150.00),

    /*
    | Elaun jarak jauh — dikira PER HARI, sekali sahaja.
    | Campur SEMUA km hari itu (driver_jobs + trips). Lebih threshold → elaun.
    | Contoh: 3 trip 180+150+120 = 450km → +RM30 (bukan RM90).
    */
    'long_distance' => [
        'threshold_km' => (float) env('PAYROLL_LONG_DISTANCE_KM', 400),
        'allowance'    => (float) env('PAYROLL_LONG_DISTANCE_ALLOWANCE', 30.00),
    ],

    /*
    | Bonus job besar — dikira PER JOB.
    | Setiap job bernilai >= threshold dapat bonus tetap (bukan peratus).
    */
    'big_job' => [
        'threshold' => (float) env('PAYROLL_BIG_JOB_THRESHOLD', 1000.00),
        'bonus'     => (float) env('PAYROLL_BIG_JOB_BONUS', 50.00),
    ],

    /*
    |--------------------------------------------------------------------------
    | Asas Caruman Berkanun (KWSP / SOCSO / EIS)
    |--------------------------------------------------------------------------
    | Bahagian gross yang mana dikenakan caruman.
    |
    | DEFAULT: gaji harian + bonus job besar DIKENAKAN caruman;
    |          elaun jarak jauh TIDAK.
    |
    | Sebabnya: elaun perjalanan lazimnya dikecualikan KWSP, manakala bonus
    | prestasi dikira sebagai upah. Ini tafsiran lazim, BUKAN nasihat cukai —
    | sahkan dengan akauntan sebelum guna untuk pemfailan sebenar.
    | Tukar ke true kalau akauntan kata elaun patut dicarum sekali.
    */
    'statutory_includes_long_distance_allowance' => (bool) env('PAYROLL_STATUTORY_INCLUDES_ALLOWANCE', false),
    'statutory_includes_big_job_bonus'           => (bool) env('PAYROLL_STATUTORY_INCLUDES_BONUS', true),

];
