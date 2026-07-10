import AuthLayout from "../../Layouts/AuthLayout";
import { useForm } from "@inertiajs/react";
import { IconPackage, IconLock, IconMail, IconArrowRight, IconAlertCircle } from "@tabler/icons-react";

export default function ResetPassword({ token, email }) {
    const { data, setData, post, errors, processing, reset } = useForm({
        token: token,
        email: email || "",
        password: "",
        password_confirmation: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post("/reset-password", {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <div className="min-h-screen flex">
            {/* Left panel */}
            <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-indigo-600 to-violet-700 p-12">
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                        <IconPackage size={18} color="white" stroke={2} />
                    </div>
                    <span className="font-bold text-xl text-white tracking-tight">StockFlow</span>
                </div>
                <div>
                    <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">
                        Choose a new password.
                    </h2>
                    <p className="text-indigo-200 text-sm leading-relaxed max-w-sm">
                        Make sure it's at least 8 characters long and something you won't forget.
                    </p>
                </div>
                <p className="text-indigo-300 text-xs">© 2025 StockFlow. All rights reserved.</p>
            </div>

            {/* Right panel */}
            <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
                <div className="w-full max-w-sm">
                    {/* Mobile logo */}
                    <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
                        <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                            <IconPackage size={16} color="white" stroke={2} />
                        </div>
                        <span className="font-bold text-lg text-white tracking-tight">
                            Stock<span className="text-indigo-400">Flow</span>
                        </span>
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-1.5">New Password</h2>
                    <p className="text-slate-400 text-sm mb-7">Enter your new password below</p>

                    {errors.email && (
                        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-5">
                            <IconAlertCircle size={16} stroke={2} />
                            {errors.email}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
                            <div className="relative">
                                <IconMail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type="email"
                                    required
                                    value={data.email}
                                    onChange={e => setData("email", e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm
                                               text-white placeholder-slate-500 focus:outline-none focus:ring-2
                                               focus:ring-indigo-500/40 focus:border-indigo-500/50 transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">New Password</label>
                            <div className="relative">
                                <IconLock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type="password"
                                    required
                                    value={data.password}
                                    onChange={e => setData("password", e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm
                                               text-white placeholder-slate-500 focus:outline-none focus:ring-2
                                               focus:ring-indigo-500/40 focus:border-indigo-500/50 transition-all"
                                />
                            </div>
                            {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Confirm Password</label>
                            <div className="relative">
                                <IconLock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type="password"
                                    required
                                    value={data.password_confirmation}
                                    onChange={e => setData("password_confirmation", e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm
                                               text-white placeholder-slate-500 focus:outline-none focus:ring-2
                                               focus:ring-indigo-500/40 focus:border-indigo-500/50 transition-all"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-500
                                       disabled:opacity-60 text-white font-semibold rounded-xl shadow-lg shadow-indigo-900/50
                                       transition-all mt-2"
                        >
                            {processing ? "Resetting…" : "Reset Password"}
                            {!processing && <IconArrowRight size={16} stroke={2} />}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

ResetPassword.layout = (page) => <AuthLayout children={page} />;
