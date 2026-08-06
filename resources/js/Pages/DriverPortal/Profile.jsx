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

    const field = 'w-full rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 transition-colors';
    const label = 'block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2';

    return (
        <DriverLayout title="Profil Saya">
            <div className="bg-gradient-to-b from-blue-900/35 via-indigo-950/15 to-transparent px-5 pt-8 pb-6">
                <h1 className="text-white text-xl font-extrabold tracking-tight">Profil Saya</h1>
                <p className="text-blue-300/70 text-xs font-medium mt-1">Kemaskini maklumat & kata laluan</p>
            </div>

            <div className="px-5 -mt-1.5 space-y-4 pb-6 relative z-10">
                {/* Maklumat peribadi */}
                <form onSubmit={submitProfile} className="bg-white/[0.02] border border-white/[0.06] backdrop-blur-md rounded-3xl p-5 shadow-xl space-y-4">
                    <h2 className="text-sm font-bold text-gray-300 uppercase tracking-wider">Maklumat Peribadi</h2>
                    <div>
                        <label className={label}>Nama <span className="text-red-400">*</span></label>
                        <input type="text" value={profileForm.data.name}
                            onChange={(e) => profileForm.setData('name', e.target.value)} className={field} />
                        {profileForm.errors.name && <p className="mt-1 text-sm text-red-400">{profileForm.errors.name}</p>}
                    </div>
                    <div>
                        <label className={label}>Emel <span className="text-red-400">*</span></label>
                        <input type="email" value={profileForm.data.email}
                            onChange={(e) => profileForm.setData('email', e.target.value)} className={field} />
                        {profileForm.errors.email && <p className="mt-1 text-sm text-red-400">{profileForm.errors.email}</p>}
                    </div>
                    <div>
                        <label className={label}>Telefon</label>
                        <input type="tel" value={profileForm.data.phone}
                            onChange={(e) => profileForm.setData('phone', e.target.value)} className={field}
                            placeholder="cth: 0123456789" />
                        {profileForm.errors.phone && <p className="mt-1 text-sm text-red-400">{profileForm.errors.phone}</p>}
                    </div>
                    <button type="submit" disabled={profileForm.processing}
                        className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.98] transition-all disabled:opacity-50">
                        {profileForm.processing ? 'Menyimpan...' : 'Simpan Maklumat'}
                    </button>
                </form>

                {/* Tukar kata laluan */}
                <form onSubmit={submitPassword} className="bg-white/[0.02] border border-white/[0.06] backdrop-blur-md rounded-3xl p-5 shadow-xl space-y-4">
                    <h2 className="text-sm font-bold text-gray-300 uppercase tracking-wider">Tukar Kata Laluan</h2>
                    <div>
                        <label className={label}>Kata Laluan Semasa <span className="text-red-400">*</span></label>
                        <input type="password" value={passwordForm.data.current_password}
                            onChange={(e) => passwordForm.setData('current_password', e.target.value)} className={field} />
                        {passwordForm.errors.current_password && <p className="mt-1 text-sm text-red-400">{passwordForm.errors.current_password}</p>}
                    </div>
                    <div>
                        <label className={label}>Kata Laluan Baru <span className="text-red-400">*</span></label>
                        <input type="password" value={passwordForm.data.password}
                            onChange={(e) => passwordForm.setData('password', e.target.value)} className={field}
                            placeholder="Minimum 8 aksara" />
                        {passwordForm.errors.password && <p className="mt-1 text-sm text-red-400">{passwordForm.errors.password}</p>}
                    </div>
                    <div>
                        <label className={label}>Sahkan Kata Laluan Baru <span className="text-red-400">*</span></label>
                        <input type="password" value={passwordForm.data.password_confirmation}
                            onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)} className={field} />
                    </div>
                    <button type="submit" disabled={passwordForm.processing}
                        className="w-full rounded-2xl bg-white/[0.05] border border-white/[0.08] py-3.5 text-sm font-bold text-white hover:bg-white/[0.08] active:scale-[0.98] transition-all disabled:opacity-50">
                        {passwordForm.processing ? 'Menukar...' : 'Tukar Kata Laluan'}
                    </button>
                </form>
            </div>
        </DriverLayout>
    );
}
