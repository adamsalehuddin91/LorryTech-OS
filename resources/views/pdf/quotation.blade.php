<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Sebut Harga {{ $quotation->quotation_number }}</title>
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
        .meta-table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
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
        .signature-table { width: 100%; border-collapse: collapse; margin-top: 30px; }
        .signature-box {
            border: 1px solid #cccccc;
            padding: 10px 14px;
            min-height: 70px;
        }
        .footer-note { font-size: 10px; color: #888888; text-align: center; border-top: 1px solid #dddddd; padding-top: 10px; margin-top: 20px; }
    </style>
</head>
<body>

    {{-- Company Header: Logo LEFT | Company info RIGHT --}}
    <table class="header-table">
        <tr>
            <td style="width: 22%; vertical-align: middle;">
                @if(!empty($logo))
                    <img src="{{ $logo }}"
                         style="max-width: 110px; max-height: 80px;">
                @endif
            </td>
            <td style="width: 78%; vertical-align: top; padding-left: 14px;">
                <span class="company-name">
                    {{ $company->name }}
                    @if($company->reg_no)
                        <span style="font-size: 12px; font-weight: normal;">({{ $company->reg_no }})</span>
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

    {{-- Quotation label + Date + Number + Valid Until --}}
    <table class="meta-table">
        <tr>
            <td style="vertical-align: top; width: 60%;">
                <span style="font-size: 14px; font-weight: bold; text-decoration: underline;">Sebut Harga</span><br>
                <span style="margin-top: 4px; display: inline-block;">Date: {{ optional($quotation->created_at)->format('d/m/Y') }}</span>
            </td>
            <td style="vertical-align: top; width: 40%; text-align: right;">
                No. Sebut Harga : {{ $quotation->quotation_number }}<br>
                <span style="font-size: 11px; color: #666666;">
                    Sah Sehingga : {{ date('d/m/Y', strtotime($quotation->valid_until)) }}
                </span>
            </td>
        </tr>
    </table>

    <hr class="divider">

    {{-- Billing Address --}}
    <table style="width: 100%; margin-bottom: 20px;">
        <tr>
            <td>
                <span class="section-label">Bil Kepada :</span><br>
                {{ $quotation->customer->name }}
                @if($quotation->customer->company)
                    <br>{{ $quotation->customer->company }}
                @endif
                @if($quotation->customer->address)
                    <br>{{ $quotation->customer->address }}
                @endif
                @if($quotation->customer->phone)
                    <br>Tel: {{ $quotation->customer->phone }}
                @endif
            </td>
        </tr>
    </table>

    {{-- Items Table --}}
    <table class="items-table">
        <thead>
            <tr>
                <th style="text-align: center; width: 6%;">BIL</th>
                <th style="text-align: left;">PERKHIDMATAN ( PENGANGKUTAN )</th>
                <th style="text-align: center; width: 12%;">KUANTITI</th>
                <th style="text-align: right; width: 20%;">HARGA SEUNIT (RM)</th>
                <th style="text-align: right; width: 18%;">JUMLAH (RM)</th>
            </tr>
        </thead>
        <tbody>
            @foreach($quotation->items as $index => $item)
                <tr class="{{ $index % 2 === 1 ? 'alt' : '' }}">
                    <td style="text-align: center;">{{ $index + 1 }}.</td>
                    <td style="text-align: left;">{{ $item->description }}</td>
                    <td style="text-align: center;">{{ $item->quantity }}</td>
                    <td style="text-align: right;">{{ number_format($item->unit_price, 2) }}</td>
                    <td style="text-align: right;">{{ number_format($item->quantity * $item->unit_price, 2) }}</td>
                </tr>
            @endforeach
            {{-- Blank rows (min 3 rows shown) --}}
            @for($i = count($quotation->items); $i < 3; $i++)
                <tr>
                    <td style="height: 28px;">&nbsp;</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            @endfor
        </tbody>
    </table>

    {{-- Totals --}}
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr>
            <td style="width: 62%;"></td>
            <td style="width: 38%;">
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 4px 8px; text-align: right; border-bottom: 1px solid #dddddd;">Sub-Total :</td>
                        <td style="padding: 4px 0; text-align: right; border-bottom: 1px solid #dddddd; white-space: nowrap;">
                            RM{{ number_format($quotation->subtotal, 2) }}
                        </td>
                    </tr>
                    @if(($quotation->tax_amount ?? 0) > 0)
                        <tr>
                            <td style="padding: 4px 8px; text-align: right; border-bottom: 1px solid #dddddd;">Cukai :</td>
                            <td style="padding: 4px 0; text-align: right; border-bottom: 1px solid #dddddd; white-space: nowrap;">
                                RM{{ number_format($quotation->tax_amount, 2) }}
                            </td>
                        </tr>
                    @endif
                    <tr>
                        <td style="padding: 6px 8px; text-align: right; font-weight: bold; font-size: 13px; border-top: 2px solid #333333;">
                            Jumlah Keseluruhan :
                        </td>
                        <td style="padding: 6px 0; text-align: right; font-weight: bold; font-size: 13px; border-top: 2px solid #333333; white-space: nowrap;">
                            RM{{ number_format($quotation->total_amount, 2) }}
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    {{-- Notes --}}
    @if($quotation->notes)
        <table style="width: 100%; margin-bottom: 16px;">
            <tr>
                <td style="padding: 8px 10px; background-color: #fffde7; border: 1px solid #e0d97e; font-size: 11px;">
                    <strong>Nota:</strong> {{ $quotation->notes }}
                </td>
            </tr>
        </table>
    @endif

    {{-- Signature Block --}}
    <table class="signature-table">
        <tr>
            {{-- Syarikat — auto-isi nama + tarikh jana, tinggal ruang tandatangan & cop --}}
            <td style="width: 48%; vertical-align: top; padding-right: 10px;">
                <div class="signature-box">
                    <strong>Tandatangan &amp; Cop Syarikat:</strong><br><br><br>
                    <hr style="border: none; border-top: 1px solid #aaaaaa; margin: 6px 0;">
                    Nama&nbsp;&nbsp;: {{ $company->name }}<br>
                    Tarikh : {{ optional($quotation->created_at)->format('d/m/Y') }}<br>
                    Cop&nbsp;&nbsp;&nbsp;&nbsp;:
                </div>
            </td>
            <td style="width: 4%;"></td>
            {{-- Pelanggan — sign-back tanda terima/setuju --}}
            <td style="width: 48%; vertical-align: top; padding-left: 10px;">
                <div class="signature-box">
                    <strong>Diterima oleh (Pelanggan):</strong><br><br><br>
                    <hr style="border: none; border-top: 1px solid #aaaaaa; margin: 6px 0;">
                    Nama&nbsp;&nbsp;: {{ $quotation->customer->name }}<br>
                    Tarikh : ................................<br>
                    Cop&nbsp;&nbsp;&nbsp;&nbsp;:
                </div>
            </td>
        </tr>
    </table>

    {{-- Footer --}}
    <p class="footer-note">Sebut harga ini sah sehingga tarikh yang dinyatakan. Harga tertakluk kepada pengesahan.</p>

</body>
</html>
