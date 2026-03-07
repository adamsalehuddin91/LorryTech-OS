import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ driver }) {
    const isLicenseExpiringSoon = () => {
        if (!driver.license_expiry) return false;
        const expiry = new Date(driver.license_expiry);
        const now = new Date();
        const diffDays = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
        return diffDays < 30;
    };

    const assignedVehicle = driver.assignments?.[0]?.vehicle || null;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Profil Pemandu
                </h2>
            }
        >
            <Head title={`Pemandu - ${driver.user?.name || ''}`} />

            <div className="py-6">
                <div className="mx-auto max-w-3xl">
                    {/* Driver profile card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
                                        <span className="text-xl font-bold text-blue-600">
                                            {driver.user?.name?.charAt(0)?.toUpperCase() || 'P'}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {driver.user?.name || '-'}
                                        </h3>
                                        <p className="text-sm text-gray-500">{driver.user?.email || '-'}</p>
                                    </div>
                                </div>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                    driver.status === 'active'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                }`}>
                                    {driver.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                                </span>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* License expiry alert */}
                            {isLicenseExpiringSoon() && (
                                <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        <p className="text-sm font-medium text-red-800">
                                            Lesen memandu hampir tamat tempoh! Sila perbaharui sebelum {driver.license_expiry}.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Details grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">No. Lesen</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{driver.license_number || '-'}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Tamat Lesen</dt>
                                    <dd className={`mt-1 text-sm ${isLicenseExpiringSoon() ? 'text-red-600 font-semibold' : 'text-gray-900'}`}>
                                        {driver.license_expiry || '-'}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Kadar Komisen</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {driver.commission_rate != null ? `${driver.commission_rate}%` : '-'}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Telefon</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{driver.phone || '-'}</dd>
                                </div>
                                <div className="sm:col-span-2">
                                    <dt className="text-sm font-medium text-gray-500">Kenalan Kecemasan</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{driver.emergency_contact || '-'}</dd>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Assigned vehicle card */}
                    <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Kenderaan Ditugaskan</h3>
                        </div>
                        <div className="p-6">
                            {assignedVehicle ? (
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 17h.01M16 17h.01M3 11l1.5-5A2 2 0 016.4 4h11.2a2 2 0 011.9 1.4L21 11M3 11v6a1 1 0 001 1h1m16-7v6a1 1 0 01-1 1h-1M3 11h18" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {assignedVehicle.plate_number || assignedVehicle.registration_number || '-'}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {[assignedVehicle.brand, assignedVehicle.model].filter(Boolean).join(' ') || 'Tiada maklumat'}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">Tiada kenderaan ditugaskan.</p>
                            )}
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="mt-6 flex items-center gap-3">
                        <Link
                            href={route('drivers.index')}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Kembali
                        </Link>
                        <Link
                            href={route('drivers.edit', driver.id)}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Ubah
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
