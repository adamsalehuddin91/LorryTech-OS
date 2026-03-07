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
    </style>
</head>
<body>

    {{-- Company Header --}}
    <table style="width: 100%; margin-bottom: 20px;">
        <tr>
            <td style="width: 60%; vertical-align: top;">
                <span style="font-size: 18px; font-weight: bold;">{{ $company->name }}</span><br>
                @if($company->address)
                    {{ $company->address }}<br>
                @endif
                @if($company->phone)
                    Tel: {{ $company->phone }}<br>
                @endif
                @if($company->email)
                    Emel: {{ $company->email }}<br>
                @endif
                @if($company->registration_number)
                    No. Pendaftaran: {{ $company->registration_number }}<br>
                @endif
            </td>
            <td style="width: 40%; vertical-align: top; text-align: right;">
                <span style="font-size: 24px; font-weight: bold;">SEBUT HARGA</span><br><br>
                <table style="width: 100%;">
                    <tr>
                        <td style="text-align: right; padding: 2px 8px; font-weight: bold;">No. Sebut Harga:</td>
                        <td style="text-align: right; padding: 2px 0;">{{ $quotation->quotation_number }}</td>
                    </tr>
                    <tr>
                        <td style="text-align: right; padding: 2px 8px; font-weight: bold;">Tarikh:</td>
                        <td style="text-align: right; padding: 2px 0;">{{ date('d/m/Y', strtotime($quotation->date)) }}</td>
                    </tr>
                    <tr>
                        <td style="text-align: right; padding: 2px 8px; font-weight: bold;">Sah Sehingga:</td>
                        <td style="text-align: right; padding: 2px 0;">{{ date('d/m/Y', strtotime($quotation->valid_until)) }}</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    <hr style="border: none; border-top: 2px solid #333333; margin-bottom: 20px;">

    {{-- Customer Section --}}
    <table style="width: 100%; margin-bottom: 20px;">
        <tr>
            <td style="vertical-align: top;">
                <span style="font-weight: bold; font-size: 13px;">Bil Kepada:</span><br><br>
                <span style="font-weight: bold;">{{ $quotation->customer->name }}</span><br>
                @if($quotation->customer->company)
                    {{ $quotation->customer->company }}<br>
                @endif
                @if($quotation->customer->address)
                    {{ $quotation->customer->address }}<br>
                @endif
                @if($quotation->customer->phone)
                    Tel: {{ $quotation->customer->phone }}<br>
                @endif
                @if($quotation->customer->email)
                    Emel: {{ $quotation->customer->email }}<br>
                @endif
            </td>
        </tr>
    </table>

    {{-- Items Table --}}
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr>
            <td style="background-color: #2c3e50; color: #ffffff; font-weight: bold; padding: 10px 8px; border: 1px solid #2c3e50; text-align: center; width: 5%;">#</td>
            <td style="background-color: #2c3e50; color: #ffffff; font-weight: bold; padding: 10px 8px; border: 1px solid #2c3e50; text-align: left;">Penerangan</td>
            <td style="background-color: #2c3e50; color: #ffffff; font-weight: bold; padding: 10px 8px; border: 1px solid #2c3e50; text-align: center; width: 10%;">Kuantiti</td>
            <td style="background-color: #2c3e50; color: #ffffff; font-weight: bold; padding: 10px 8px; border: 1px solid #2c3e50; text-align: right; width: 18%;">Harga Seunit (RM)</td>
            <td style="background-color: #2c3e50; color: #ffffff; font-weight: bold; padding: 10px 8px; border: 1px solid #2c3e50; text-align: right; width: 18%;">Jumlah (RM)</td>
        </tr>
        @foreach($quotation->items as $index => $item)
            <tr>
                <td style="padding: 8px; border: 1px solid #dddddd; text-align: center;{{ $index % 2 === 1 ? ' background-color: #f9f9f9;' : '' }}">{{ $index + 1 }}</td>
                <td style="padding: 8px; border: 1px solid #dddddd; text-align: left;{{ $index % 2 === 1 ? ' background-color: #f9f9f9;' : '' }}">{{ $item->description }}</td>
                <td style="padding: 8px; border: 1px solid #dddddd; text-align: center;{{ $index % 2 === 1 ? ' background-color: #f9f9f9;' : '' }}">{{ $item->quantity }}</td>
                <td style="padding: 8px; border: 1px solid #dddddd; text-align: right;{{ $index % 2 === 1 ? ' background-color: #f9f9f9;' : '' }}">{{ number_format($item->unit_price, 2) }}</td>
                <td style="padding: 8px; border: 1px solid #dddddd; text-align: right;{{ $index % 2 === 1 ? ' background-color: #f9f9f9;' : '' }}">{{ number_format($item->quantity * $item->unit_price, 2) }}</td>
            </tr>
        @endforeach
    </table>

    {{-- Totals Section --}}
    <table style="width: 100%; margin-bottom: 20px;">
        <tr>
            <td style="width: 60%;"></td>
            <td style="width: 40%;">
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 6px 8px; text-align: right; border-bottom: 1px solid #dddddd;">Subtotal:</td>
                        <td style="padding: 6px 8px; text-align: right; border-bottom: 1px solid #dddddd; width: 40%;">RM {{ number_format($quotation->subtotal, 2) }}</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px 8px; text-align: right; border-bottom: 1px solid #dddddd;">Cukai:</td>
                        <td style="padding: 6px 8px; text-align: right; border-bottom: 1px solid #dddddd;">RM {{ number_format($quotation->tax ?? 0, 2) }}</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px 8px; text-align: right; font-weight: bold; font-size: 14px; border-top: 2px solid #333333;">Jumlah Keseluruhan:</td>
                        <td style="padding: 6px 8px; text-align: right; font-weight: bold; font-size: 14px; border-top: 2px solid #333333;">RM {{ number_format($quotation->total, 2) }}</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    {{-- Notes Section --}}
    @if($quotation->notes)
        <table style="width: 100%; margin-bottom: 20px;">
            <tr>
                <td style="padding: 10px; background-color: #fffde7; border: 1px solid #e0d97e;">
                    <span style="font-weight: bold;">Nota:</span><br>
                    {{ $quotation->notes }}
                </td>
            </tr>
        </table>
    @endif

    {{-- Footer --}}
    <table style="width: 100%; margin-top: 30px;">
        <tr>
            <td style="text-align: center; padding-top: 20px; border-top: 1px solid #dddddd; color: #777777; font-size: 11px;">
                Sebut harga ini sah sehingga tarikh yang dinyatakan.
            </td>
        </tr>
    </table>

</body>
</html>
