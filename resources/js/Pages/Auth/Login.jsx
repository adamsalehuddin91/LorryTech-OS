import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [activeDemo, setActiveDemo] = useState(null);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const handleQuickLogin = (role) => {
        setActiveDemo(role);
        if (role === 'owner') {
            setData({
                ...data,
                email: 'admin@lorrytech.my',
                password: 'password',
            });
        } else if (role === 'driver') {
            setData({
                ...data,
                email: 'ali@lorrytech.my',
                password: 'password',
            });
        }
    };

    return (
        <GuestLayout>
            <Head title="Log Masuk" />

            <div className="mb-6 text-center">
                <h2 className="text-xl font-extrabold text-white tracking-tight">Selamat Kembali</h2>
                <p className="text-xs text-gray-400 mt-1">Sila log masuk untuk mengakses sistem operasi anda.</p>
            </div>

            {/* Quick Demo Login Tabs */}
            <div className="mb-6 p-2 rounded-2xl bg-white/[0.02] border border-white/[0.04] space-y-2">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center py-1">
                    Log Masuk Demo Pintar
                </p>
                <div className="grid grid-cols-2 gap-2">
                    <button
                        type="button"
                        onClick={() => handleQuickLogin('owner')}
                        className={`flex flex-col items-center justify-center py-2.5 px-3 rounded-xl border text-xs font-bold transition-all duration-200 ${
                            activeDemo === 'owner'
                                ? 'bg-blue-600/10 border-blue-500/50 text-blue-400 shadow-lg shadow-blue-500/5'
                                : 'bg-white/[0.01] border-white/[0.06] text-gray-400 hover:bg-white/[0.03] hover:text-white'
                        }`}
                    >
                        <span className="text-lg mb-0.5">💼</span>
                        <span>Sebagai Pemilik</span>
                    </button>
                    
                    <button
                        type="button"
                        onClick={() => handleQuickLogin('driver')}
                        className={`flex flex-col items-center justify-center py-2.5 px-3 rounded-xl border text-xs font-bold transition-all duration-200 ${
                            activeDemo === 'driver'
                                ? 'bg-indigo-600/10 border-indigo-500/50 text-indigo-400 shadow-lg shadow-indigo-500/5'
                                : 'bg-white/[0.01] border-white/[0.06] text-gray-400 hover:bg-white/[0.03] hover:text-white'
                        }`}
                    >
                        <span className="text-lg mb-0.5">🚚</span>
                        <span>Sebagai Pemandu</span>
                    </button>
                </div>
            </div>

            {status && (
                <div className="mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-sm font-medium text-emerald-400 text-center">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                {/* Email Address */}
                <div>
                    <label htmlFor="email" className="block text-[11px] font-bold tracking-wider text-gray-400 uppercase mb-1.5">
                        Alamat E-mel
                    </label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        placeholder="admin@lorrytech.my"
                        className="w-full px-4 py-3.5 bg-white/[0.02] border border-white/10 rounded-xl focus:border-blue-500 focus:bg-white/[0.04] text-white transition-all outline-none text-sm placeholder-gray-600 focus:ring-1 focus:ring-blue-500"
                        autoComplete="username"
                        required
                        onChange={(e) => {
                            setData('email', e.target.value);
                            setActiveDemo(null);
                        }}
                    />
                    <InputError message={errors.email} className="mt-2 text-xs text-red-400" />
                </div>

                {/* Password */}
                <div>
                    <div className="flex justify-between items-center mb-1.5">
                        <label htmlFor="password" className="block text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                            Kata Laluan
                        </label>
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-[11px] text-blue-400 hover:text-blue-300 hover:underline transition-colors font-medium"
                            >
                                Lupa Kata Laluan?
                            </Link>
                        )}
                    </div>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        placeholder="••••••••"
                        className="w-full px-4 py-3.5 bg-white/[0.02] border border-white/10 rounded-xl focus:border-blue-500 focus:bg-white/[0.04] text-white transition-all outline-none text-sm placeholder-gray-600 focus:ring-1 focus:ring-blue-500"
                        autoComplete="current-password"
                        required
                        onChange={(e) => {
                            setData('password', e.target.value);
                            setActiveDemo(null);
                        }}
                    />
                    <InputError message={errors.password} className="mt-2 text-xs text-red-400" />
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center cursor-pointer select-none">
                        <input
                            type="checkbox"
                            name="remember"
                            checked={data.remember}
                            className="w-4 h-4 rounded border-white/10 bg-white/[0.02] text-blue-600 focus:ring-0 focus:ring-offset-0 transition-colors cursor-pointer"
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        <span className="ms-2.5 text-xs text-gray-400 hover:text-gray-300 transition-colors">
                            Ingat saya pada peranti ini
                        </span>
                    </label>
                </div>

                {/* Submit button */}
                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-sm font-bold text-white transition-all shadow-lg hover:shadow-blue-500/25 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
                    >
                        {processing ? (
                            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                        ) : (
                            'Log Masuk'
                        )}
                    </button>
                </div>
            </form>
        </GuestLayout>
    );
}
