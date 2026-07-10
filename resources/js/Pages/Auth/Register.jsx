import AuthLayout from "../../Layouts/AuthLayout";
import { Link, useForm } from "@inertiajs/react";
import {
    IconPackage, IconMail, IconLock, IconUser, IconArrowRight, IconAlertCircle,
} from "@tabler/icons-react";

export default function Register() {
    const { data, setData, post, errors, processing, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post("/register", { onFinish: () => reset("password", "password_confirmation") });
    };

    const hasErrors = Object.keys(errors).length > 0;

    return (
        <div className="min-h-screen flex">
            {/* Left panel */}
            <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-violet-600 to-indigo-700 p-12">
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                        <IconPackage size={18} color="white" stroke={2} />
                    </div>
                    <span className="font-bold text-xl text-white tracking-tight">StockFlow</span>
                </div>
                <div>
                    <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">
                        Start managing<br />smarter today.
                    </h2>
                    <p className="text-violet-200 text-sm leading-relaxed max-w-sm">
                        Create your free account and get access to inventory management, sales tracking,
                        supplier management, and real-time analytics.
                    </p>
                    <div className="mt-8 space-y-2">
                        {["No credit card required", "Unlimited products & employees", "Full CRUD management"].map(item => (
                            <div key={item} className="flex items-center gap-2 text-violet-200 text-sm">
                                <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
                                    <svg viewBox="0 0 12 10" width="8" fill="currentColor" className="text-white">
                                        <path d="M1 5l3 3 7-7" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
                <p className="text-violet-300 text-xs">© 2025 StockFlow. All rights reserved.</p>
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

                    <h2 className="text-2xl font-bold text-white mb-1.5">Create Account</h2>
                    <p className="text-slate-400 text-sm mb-7">Fill in the details below to get started</p>

                    {hasErrors && (
                        <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-5">
                            <IconAlertCircle size={16} stroke={2} className="shrink-0 mt-0.5" />
                            <div>{Object.values(errors)[0]}</div>
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
                            <div className="relative">
                                <IconUser size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type="text"
                                    required
                                    autoFocus
                                    value={data.name}
                                    onChange={e => setData("name", e.target.value)}
                                    placeholder="Jane Doe"
                                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm
                                               text-white placeholder-slate-500 focus:outline-none focus:ring-2
                                               focus:ring-indigo-500/40 focus:border-indigo-500/50 transition-all"
                                />
                            </div>
                        </div>

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
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
                            <div className="relative">
                                <IconLock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type="password"
                                    required
                                    value={data.password}
                                    onChange={e => setData("password", e.target.value)}
                                    placeholder="Min. 8 characters"
                                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm
                                               text-white placeholder-slate-500 focus:outline-none focus:ring-2
                                               focus:ring-indigo-500/40 focus:border-indigo-500/50 transition-all"
                                />
                            </div>
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
                                    placeholder="Repeat password"
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
                            {processing ? "Creating account…" : "Create Account"}
                            {!processing && <IconArrowRight size={16} stroke={2} />}
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-500 mt-6">
                        Already have an account?{" "}
                        <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

Register.layout = (page) => <AuthLayout children={page} />;
