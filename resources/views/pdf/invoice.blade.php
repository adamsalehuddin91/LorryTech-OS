<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice {{ $invoice->invoice_number }}</title>
    <style>
        @page {
            size: A4 portrait;
            margin: 20mm 18mm;
        }
        body {
            font-family: sans-serif;
            font-size: 12px;
            color: #333333;
            margin: 0;
            padding: 0;
        }
        .header-table { width: 100%; margin-bottom: 16px; border-collapse: collapse; }
        .company-name { font-size: 17px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; }
        .divider { border: none; border-top: 2px solid #333333; margin: 14px 0; }
        .invoice-meta-table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
        .section-label { font-weight: bold; font-size: 12px; }
        .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .items-table th {
            background-color: #2c3e50;
            color: #ffffff;
            font-weight: bold;
            padding: 9px 8px;
            border: 1px solid #2c3e50;
        }
        .items-table td { padding: 8px; border: 1px solid #dddddd; }
        .items-table tr.alt td { background-color: #f7f7f7; }
        .totals-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .payment-box {
            border: 1px solid #bbbbbb;
            padding: 10px 14px;
            background-color: #f5f5f5;
            display: inline-block;
        }
        .total-amount-label { font-weight: bold; font-size: 13px; }
        .total-amount-value { font-weight: bold; font-size: 15px; }
        .footer-note { font-size: 10px; color: #888888; text-align: center; border-top: 1px solid #dddddd; padding-top: 10px; margin-top: 30px; }
    </style>
</head>
<body>

    {{-- Company Header: Logo LEFT | Company info RIGHT --}}
    <table class="header-table">
        <tr>
            <td style="width: 22%; vertical-align: middle;">
                @if(!empty($company->logo_url))
                    <img src="{{ $company->logo_url }}"
                         style="max-width: 110px; max-height: 80px;">
                @endif
            </td>
            <td style="width: 78%; vertical-align: top; padding-left: 14px;">
                <span class="company-name">
                    {{ $company->name }}
                    @if($company->registration_number)
                        <span style="font-size: 12px; font-weight: normal;">({{ $company->registration_number }})</span>
                    @endif
                </span><br>
                @if($company->address)
                    <span style="font-size: 11px;">{{ $company->address }}</span><br>
                @endif
                @if($company->email)
                    <span style="font-size: 11px;">Email : {{ $company->email }}</span><br>
                @endif
                @if($company->phone)
                    <span style="font-size: 11px;">Tel No : {{ $company->phone }}</span>
                @endif
            </td>
        </tr>
    </table>

    {{-- Invoice label + Date + Number --}}
    <table class="invoice-meta-table">
        <tr>
            <td style="vertical-align: top; width: 60%;">
                <span style="font-size: 14px; font-weight: bold; text-decoration: underline;">Invoice</span><br>
                <span style="margin-top: 4px; display: inline-block;">Date: {{ date('d/m/Y', strtotime($invoice->date)) }}</span>
            </td>
            <td style="vertical-align: top; width: 40%; text-align: right;">
                Invoice Number : {{ $invoice->invoice_number }}
            </td>
        </tr>
    </table>

    <hr class="divider">

    {{-- Billing Address --}}
    <table style="width: 100%; margin-bottom: 20px;">
        <tr>
            <td>
                <span class="section-label">Billing Address :</span><br>
                {{ $invoice->customer->name }}
                @if($invoice->customer->company)
                    <br>{{ $invoice->customer->company }}
                @endif
                @if($invoice->customer->address)
                    <br>{{ $invoice->customer->address }}
                @endif
            </td>
        </tr>
    </table>

    {{-- Items Table --}}
    <table class="items-table">
        <thead>
            <tr>
                <th style="text-align: center; width: 6%;">BIL</th>
                <th style="text-align: left;">SERVICE ( TRANSPORT )</th>
                <th style="text-align: center; width: 12%;">QUANTITY</th>
                <th style="text-align: right; width: 20%;">PRICE</th>
            </tr>
        </thead>
        <tbody>
            @foreach($invoice->items as $index => $item)
                <tr class="{{ $index % 2 === 1 ? 'alt' : '' }}">
                    <td style="text-align: center;">{{ $index + 1 }}.</td>
                    <td style="text-align: left;">{{ $item->description }}</td>
                    <td style="text-align: center;">{{ $item->quantity }}</td>
                    <td style="text-align: right;">RM{{ number_format($item->quantity * $item->unit_price, 2) }}</td>
                </tr>
            @endforeach
            {{-- Blank rows to fill table (min 3 rows shown) --}}
            @for($i = count($invoice->items); $i < 3; $i++)
                <tr>
                    <td style="height: 28px;">&nbsp;</td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            @endfor
        </tbody>
    </table>

    {{-- Sub-Total row --}}
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr>
            <td style="width: 62%;"></td>
            <td style="width: 38%; text-align: right; padding: 4px 0;">
                Sub-Total :&nbsp;&nbsp;&nbsp; RM{{ number_format($invoice->subtotal, 2) }}
            </td>
        </tr>
    </table>

    {{-- Payment Method box (left) + Total Amount (right) --}}
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <tr>
            <td style="width: 50%; vertical-align: bottom;">
                @if(!empty($company->bank_details))
                    <table style="border: 1px solid #bbbbbb; padding: 10px 14px; background-color: #f5f5f5; border-collapse: collapse;">
                        <tr>
                            <td colspan="2" style="font-weight: bold; padding-bottom: 6px;">Payment Method:</td>
                        </tr>
                        @if($company->bank_details->account_name ?? null)
                            <tr>
                                <td style="padding: 2px 6px 2px 0;">Name :</td>
                                <td>{{ $company->bank_details->account_name }}</td>
                            </tr>
                        @endif
                        @if(($company->bank_details->account_number ?? null) && ($company->bank_details->bank_name ?? null))
                            <tr>
                                <td style="padding: 2px 6px 2px 0;">Account No :</td>
                                <td>{{ $company->bank_details->account_number }} ( {{ $company->bank_details->bank_name }} )</td>
                            </tr>
                        @endif
                    </table>
                @endif
            </td>
            <td style="width: 50%; vertical-align: bottom; text-align: right;">
                <hr style="border: none; border-top: 1px solid #333333; margin-bottom: 6px;">
                <span class="total-amount-label">Total Amount</span>&nbsp;&nbsp;&nbsp;
                <span class="total-amount-value">RM{{ number_format($invoice->subtotal + ($invoice->tax_amount ?? 0), 2) }}</span>
                <hr style="border: none; border-top: 1px solid #333333; margin-top: 6px;">
            </td>
        </tr>
    </table>

    {{-- Notes --}}
    @if($invoice->notes)
        <table style="width: 100%; margin-bottom: 16px;">
            <tr>
                <td style="padding: 8px 10px; background-color: #fffde7; border: 1px solid #e0d97e; font-size: 11px;">
                    <strong>Note:</strong> {{ $invoice->notes }}
                </td>
            </tr>
        </table>
    @endif

    {{-- Thank you --}}
    <p style="font-weight: bold; font-size: 12px; margin-top: 10px;">Thank you for Your Business</p>

    {{-- Footer --}}
    <p class="footer-note">THIS IS COMPUTER GENERATED INVOICE SIGNATURE NOT REQUIRE</p>

</body>
</html>
