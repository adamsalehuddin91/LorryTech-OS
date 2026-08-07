<?php

return [
    // Nama produk — fallback bila client belum isi Tetapan Syarikat.
    // Setiap client boleh papar jenama sendiri melalui CompanySetting;
    // nama ini hanya muncul bila tiada tetapan syarikat disimpan.
    'name' => 'SwiftFleet',
    'reg_no' => '',
    'tin' => '',
    'address' => '',
    'phone' => '',
    'email' => '',
    'logo_url' => '',
    'bank' => [
        'name' => '',
        'account_name' => '',
        'account_number' => '',
    ],
    'doc_prefix' => 'LT',
];
