import DriverLayout from '@/Layouts/DriverLayout';
import { useForm } from '@inertiajs/react';

export default function Profile({ driver }) {
    const profileForm = useForm({
        name:  driver.name || '',
        email: driver.email || '',
        phone: driver.phone || '',
    });

    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submitProfile = (e) => {
        e.preventDefault();
        profileForm.patch(route('driver.profile.update'), { preserveScroll: true });
    };

    const submitPassword = (e) => {
        e.preventDefault();
        passwordForm.patch(route('driver.password.update'), {
            preserveScroll: true,
            onSuccess: () => passwordForm.reset(),
        });
    };

    const field = 'w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500';
    const label = 'block text-sm font-semibold text-slate-200 mb-2';

    return (
        <DriverLayout title="Profil Saya">
            <div className="bg-gradient-to-br from-blue-700 to-blue-900 px-5 pt-12 pb-6">
                <h1 className="text-white text-xl font-bold">Profil Saya</h1>
                <p className="text-blue-200 text-sm mt-1">Kemaskini maklumat & kata laluan</p>
            </div>

            <div className="px-5 mt-5 space-y-6 pb-6">
                {/* Maklumat peribadi */}
                <form onSubmit={submitProfile} className="space-y-4">
                    <h2 className="text-sm font-bold text-slate-300">Maklumat Peribadi</h2>
                    <div>
                        <label className={label}>Nama <span className="text-red-500">*</span></label>
                        <input type="text" value={profileForm.data.name}
                            onChange={(e) => profileForm.setData('name', e.target.value)} className={field} />
                        {profileForm.errors.name && <p className="mt-1 text-sm text-red-500">{profileForm.errors.name}</p>}
                    </div>
                    <div>
                        <label className={label}>Emel <span className="text-red-500">*</span></label>
                        <input type="email" value={profileForm.data.email}
                            onChange={(e) => profileForm.setData('email', e.target.value)} className={field} />
                        {profileForm.errors.email && <p className="mt-1 text-sm text-red-500">{profileForm.errors.email}</p>}
                    </div>
                    <div>
                        <label className={label}>Telefon</label>
                        <input type="tel" value={profileForm.data.phone}
                            onChange={(e) => profileForm.setData('phone', e.target.value)} className={field}
                            placeholder="cth: 0123456789" />
                        {profileForm.errors.phone && <p className="mt-1 text-sm text-red-500">{profileForm.errors.phone}</p>}
                    </div>
                    <button type="submit" disabled={profileForm.processing}
                        className="w-full rounded-2xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50">
                        {profileForm.processing ? 'Menyimpan...' : 'Simpan Maklumat'}
                    </button>
                </form>

                <div className="border-t border-white/10" />

                {/* Tukar kata laluan */}
                <form onSubmit={submitPassword} className="space-y-4">
                    <h2 className="text-sm font-bold text-slate-300">Tukar Kata Laluan</h2>
                    <div>
                        <label className={label}>Kata Laluan Semasa <span className="text-red-500">*</span></label>
                        <input type="password" value={passwordForm.data.current_password}
                            onChange={(e) => passwordForm.setData('current_password', e.target.value)} className={field} />
                        {passwordForm.errors.current_password && <p className="mt-1 text-sm text-red-500">{passwordForm.errors.current_password}</p>}
                    </div>
                    <div>
                        <label className={label}>Kata Laluan Baru <span className="text-red-500">*</span></label>
                        <input type="password" value={passwordForm.data.password}
                            onChange={(e) => passwordForm.setData('password', e.target.value)} className={field}
                            placeholder="Minimum 8 aksara" />
                        {passwordForm.errors.password && <p className="mt-1 text-sm text-red-500">{passwordForm.errors.password}</p>}
                    </div>
                    <div>
                        <label className={label}>Sahkan Kata Laluan Baru <span className="text-red-500">*</span></label>
                        <input type="password" value={passwordForm.data.password_confirmation}
                            onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)} className={field} />
                    </div>
                    <button type="submit" disabled={passwordForm.processing}
                        className="w-full rounded-2xl bg-slate-700 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-slate-600 active:scale-95 transition-all disabled:opacity-50">
                        {passwordForm.processing ? 'Menukar...' : 'Tukar Kata Laluan'}
                    </button>
                </form>
            </div>
        </DriverLayout>
    );
}
