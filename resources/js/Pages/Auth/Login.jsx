import AuthLayout from "../../Layouts/AuthLayout";
import { Link, useForm } from "@inertiajs/react";
import { useRoute } from "../../../../vendor/tightenco/ziggy";
import { IconPackage, IconMail, IconLock, IconArrowRight, IconAlertCircle } from "@tabler/icons-react";

export default function Login() {
    const route = useRoute();
    const { data, setData, post, errors, processing, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("login"), { onFinish: () => reset("password") });
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
                        Welcome back to<br />your dashboard.
                    </h2>
                    <p className="text-indigo-200 text-sm leading-relaxed max-w-sm">
                        Sign in to manage your inventory, track sales, and keep your business running smoothly.
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

                    <h2 className="text-2xl font-bold text-white mb-1.5">Sign In</h2>
                    <p className="text-slate-400 text-sm mb-7">Enter your credentials to access your account</p>

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
                                    autoFocus
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
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
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
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-500
                                       disabled:opacity-60 text-white font-semibold rounded-xl shadow-lg shadow-indigo-900/50
                                       transition-all mt-2"
                        >
                            {processing ? "Signing in…" : "Sign In"}
                            {!processing && <IconArrowRight size={16} stroke={2} />}
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-500 mt-6">
                        Don't have an account?{" "}
                        <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

Login.layout = (page) => <AuthLayout children={page} />;
