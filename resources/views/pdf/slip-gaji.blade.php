<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Slip Gaji {{ $payroll->driver->user->name ?? '' }} - {{ $payroll->month }}</title>
    <style>
        @page { size: A4 portrait; margin: 18mm 16mm; }
        body { font-family: sans-serif; font-size: 11px; color: #333; margin: 0; padding: 0; }
        .header-banner {
            background-color: #2c3e50;
            color: #ffffff;
            text-align: center;
            padding: 14px 10px 8px;
            margin-bottom: 4px;
        }
        .header-banner h1 { margin: 0; font-size: 20px; letter-spacing: 2px; text-transform: uppercase; }
        .header-address { text-align: center; font-size: 10px; color: #444; padding: 4px 0 12px; border-bottom: 1px solid #ccc; margin-bottom: 10px; }
        table { border-collapse: collapse; }
        .info-table { width: 100%; margin-bottom: 12px; }
        .info-table td { padding: 4px 8px; border: 1px solid #ccc; }
        .info-label { font-weight: bold; background-color: #f0f0f0; width: 18%; }
        .section-header {
            background-color: #2c3e50;
            color: #ffffff;
            font-weight: bold;
            text-align: center;
            padding: 6px;
            font-size: 11px;
        }
        .contrib-table { width: 100%; margin-bottom: 10px; }
        .contrib-table td { padding: 5px 8px; border: 1px solid #ccc; }
        .contrib-table .row-alt { background-color: #f7f7f7; }
        .contrib-table .total-row td { font-weight: bold; background-color: #e8e8e8; }
        .net-salary-box {
            text-align: right;
            font-size: 13px;
            font-weight: bold;
            padding: 8px 12px;
            border: 1.5px solid #2c3e50;
            background-color: #eaf0fb;
            margin-top: 6px;
        }
        .employer-section { margin-top: 8px; }
        .account-table { width: 100%; }
        .account-table td { padding: 3px 8px; font-size: 10px; }
    </style>
</head>
<body>

    {{-- Company Header --}}
    <div class="header-banner">
        <h1>{{ strtoupper($company->name) }}</h1>
    </div>
    <div class="header-address">
        {{ $company->address }}
        @if($company->phone) &nbsp;|&nbsp; Phone : {{ $company->phone }} @endif
        @if($company->email) &nbsp;|&nbsp; Email: {{ $company->email }} @endif
    </div>

    {{-- Employee Info --}}
    <table class="info-table">
        <tr>
            <td class="info-label">Nama Pekerja</td>
            <td>{{ $payroll->driver->user->name ?? '-' }}</td>
            <td class="info-label">Jawatan</td>
            <td>Pemandu</td>
        </tr>
        <tr>
            <td class="info-label">IC Pekerja</td>
            <td>{{ $payroll->driver->ic_number ?? '-' }}</td>
            <td class="info-label">Gaji Bulan</td>
            <td>{{ \Carbon\Carbon::createFromFormat('Y-m', $payroll->month)->format('d-M-Y') }}</td>
        </tr>
    </table>

    {{-- PENDAPATAN & PEMOTONGAN (side by side) --}}
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 0;">
        <tr>
            <td style="width: 49%; vertical-align: top; padding-right: 4px;">
                <table class="contrib-table" style="width: 100%;">
                    <tr><td colspan="3" class="section-header">PENDAPATAN</td></tr>
                    <tr><td style="font-weight:bold; padding:5px 8px; border:1px solid #ccc; width:8%;">Bil</td>
                        <td style="font-weight:bold; padding:5px 8px; border:1px solid #ccc;">Butiran</td>
                        <td style="font-weight:bold; padding:5px 8px; border:1px solid #ccc; text-align:right; width:30%;">RM</td></tr>
                    <tr>
                        <td style="padding:5px 8px; border:1px solid #ccc;">1-</td>
                        <td style="padding:5px 8px; border:1px solid #ccc;">Gaji</td>
                        <td style="padding:5px 8px; border:1px solid #ccc; text-align:right;">{{ number_format($payroll->base_salary, 2) }}</td>
                    </tr>
                    <tr class="row-alt">
                        <td style="padding:5px 8px; border:1px solid #ccc;">2-</td>
                        <td style="padding:5px 8px; border:1px solid #ccc;">Komisyen</td>
                        <td style="padding:5px 8px; border:1px solid #ccc; text-align:right;">{{ number_format($payroll->commission_amount, 2) }}</td>
                    </tr>
                    <tr class="total-row">
                        <td colspan="2" style="padding:5px 8px; border:1px solid #ccc; text-align:right;">Jumlah (RM)</td>
                        <td style="padding:5px 8px; border:1px solid #ccc; text-align:right;">{{ number_format($payroll->gross_salary, 2) }}</td>
                    </tr>
                </table>
            </td>
            <td style="width: 2%;"></td>
            <td style="width: 49%; vertical-align: top; padding-left: 4px;">
                <table class="contrib-table" style="width: 100%;">
                    <tr><td colspan="3" class="section-header">PEMOTONGAN</td></tr>
                    <tr><td style="font-weight:bold; padding:5px 8px; border:1px solid #ccc; width:8%;">Bil</td>
                        <td style="font-weight:bold; padding:5px 8px; border:1px solid #ccc;">Butiran</td>
                        <td style="font-weight:bold; padding:5px 8px; border:1px solid #ccc; text-align:right; width:30%;">RM</td></tr>
                    <tr>
                        <td style="padding:5px 8px; border:1px solid #ccc;">1-</td>
                        <td style="padding:5px 8px; border:1px solid #ccc;">KWSP Caruman Pekerja</td>
                        <td style="padding:5px 8px; border:1px solid #ccc; text-align:right;">{{ number_format($payroll->kwsp_employee, 2) }}</td>
                    </tr>
                    <tr class="row-alt">
                        <td style="padding:5px 8px; border:1px solid #ccc;">2-</td>
                        <td style="padding:5px 8px; border:1px solid #ccc;">SOCSO Caruman Pekerja</td>
                        <td style="padding:5px 8px; border:1px solid #ccc; text-align:right;">{{ number_format($payroll->socso_employee, 2) }}</td>
                    </tr>
                    <tr>
                        <td style="padding:5px 8px; border:1px solid #ccc;">3-</td>
                        <td style="padding:5px 8px; border:1px solid #ccc;">EIS</td>
                        <td style="padding:5px 8px; border:1px solid #ccc; text-align:right;">{{ number_format($payroll->eis_employee, 2) }}</td>
                    </tr>
                    <tr class="total-row">
                        <td colspan="2" style="padding:5px 8px; border:1px solid #ccc; text-align:right;">Jumlah</td>
                        <td style="padding:5px 8px; border:1px solid #ccc; text-align:right;">{{ number_format($payroll->total_deductions, 2) }}</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    {{-- Account info (left) + Employer contributions (right) --}}
    <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
        <tr>
            <td style="width: 49%; vertical-align: top; padding-right: 4px;">
                <table style="width: 100%; border-collapse: collapse; font-size: 10px;">
                    <tr>
                        <td style="padding:3px 8px; border:1px solid #ccc; font-weight:bold; background:#f0f0f0; width:45%;">NO KWSP Pekerja</td>
                        <td style="padding:3px 8px; border:1px solid #ccc;">{{ $payroll->driver->kwsp_no ?? '-' }}</td>
                    </tr>
                    <tr>
                        <td style="padding:3px 8px; border:1px solid #ccc; font-weight:bold; background:#f0f0f0;">NO Socso Pekerja</td>
                        <td style="padding:3px 8px; border:1px solid #ccc;">{{ $payroll->driver->socso_no ?? '-' }}</td>
                    </tr>
                    <tr>
                        <td style="padding:3px 8px; border:1px solid #ccc; font-weight:bold; background:#f0f0f0;">Bank</td>
                        <td style="padding:3px 8px; border:1px solid #ccc;">{{ $payroll->driver->bank_name ?? '-' }}</td>
                    </tr>
                    <tr>
                        <td style="padding:3px 8px; border:1px solid #ccc; font-weight:bold; background:#f0f0f0;">No Akaun Bank</td>
                        <td style="padding:3px 8px; border:1px solid #ccc;">{{ $payroll->driver->bank_account_no ?? '-' }}</td>
                    </tr>
                </table>
            </td>
            <td style="width: 2%;"></td>
            <td style="width: 49%; vertical-align: top; padding-left: 4px;">
                <table class="contrib-table" style="width: 100%; font-size: 10px;">
                    <tr><td style="font-weight:bold; padding:4px 8px; border:1px solid #ccc; width:8%;">Bil</td>
                        <td style="font-weight:bold; padding:4px 8px; border:1px solid #ccc;">Butiran</td>
                        <td style="font-weight:bold; padding:4px 8px; border:1px solid #ccc; text-align:right; width:30%;">RM</td></tr>
                    <tr>
                        <td style="padding:4px 8px; border:1px solid #ccc;">1-</td>
                        <td style="padding:4px 8px; border:1px solid #ccc;">KWSP Caruman Majikan</td>
                        <td style="padding:4px 8px; border:1px solid #ccc; text-align:right;">{{ number_format($payroll->kwsp_employer, 2) }}</td>
                    </tr>
                    <tr class="row-alt">
                        <td style="padding:4px 8px; border:1px solid #ccc;">2-</td>
                        <td style="padding:4px 8px; border:1px solid #ccc;">SOCSO Caruman Majikan</td>
                        <td style="padding:4px 8px; border:1px solid #ccc; text-align:right;">{{ number_format($payroll->socso_employer, 2) }}</td>
                    </tr>
                    <tr>
                        <td style="padding:4px 8px; border:1px solid #ccc;">3-</td>
                        <td style="padding:4px 8px; border:1px solid #ccc;">EIS</td>
                        <td style="padding:4px 8px; border:1px solid #ccc; text-align:right;">{{ number_format($payroll->eis_employer, 2) }}</td>
                    </tr>
                    <tr class="total-row">
                        <td colspan="2" style="padding:4px 8px; border:1px solid #ccc; text-align:right;">Jumlah</td>
                        <td style="padding:4px 8px; border:1px solid #ccc; text-align:right;">
                            {{ number_format($payroll->kwsp_employer + $payroll->socso_employer + $payroll->eis_employer, 2) }}
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    {{-- Net Salary --}}
    <div class="net-salary-box">
        Gaji Bersih (RM)&nbsp;&nbsp;&nbsp;&nbsp;{{ number_format($payroll->net_salary, 2) }}
    </div>

</body>
</html>
