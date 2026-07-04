import AuthLayout from "../../Layouts/AuthLayout";
import { Link } from "@inertiajs/react";
import {
    IconPackage, IconUsers, IconCoin, IconTruck,
    IconChartBar, IconShieldCheck, IconArrowRight,
    IconBolt,
} from "@tabler/icons-react";

const features = [
    { icon: IconPackage,    title: "Product Management",    desc: "Track all your products with images, pricing, stock levels, and ratings in one place.", color: "from-indigo-500 to-indigo-600" },
    { icon: IconTruck,      title: "Supplier Management",   desc: "Manage supplier contacts, purchase orders, and procurement all in one dashboard.", color: "from-violet-500 to-violet-600" },
    { icon: IconCoin,       title: "Sales Tracking",        desc: "Record every sale, monitor revenue trends, and get real-time insights into performance.", color: "from-sky-500 to-sky-600" },
    { icon: IconUsers,      title: "Employee Management",   desc: "Organize your team by department, manage contacts and access levels effortlessly.", color: "from-emerald-500 to-emerald-600" },
    { icon: IconChartBar,   title: "Analytics & Reports",   desc: "Visualize revenue trends and business metrics with beautiful interactive charts.", color: "from-amber-500 to-orange-500" },
    { icon: IconShieldCheck, title: "Secure & Reliable",   desc: "Enterprise-grade security with role-based access and encrypted data storage.", color: "from-rose-500 to-pink-500" },
];

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
            {/* Nav */}
            <nav className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-white/5">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center shadow-lg">
                        <IconPackage size={16} color="white" stroke={2} />
                    </div>
                    <span className="font-bold text-lg tracking-tight">
                        Stock<span className="text-indigo-400">Flow</span>
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/login"
                        className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/5">
                        Sign In
                    </Link>
                    <Link href="/register"
                        className="text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-colors shadow-lg shadow-indigo-900/50">
                        Get Started
                    </Link>
                </div>
            </nav>

            {/* Hero */}
            <section className="px-6 md:px-12 py-20 md:py-28 max-w-6xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-full mb-6">
                    <IconBolt size={12} stroke={2} />
                    Inventory Management, Reimagined
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight mb-6">
                    Take Control of Your{" "}
                    <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                        Stock.
                    </span>
                    <br />Effortlessly.
                </h1>
                <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
                    Streamline inventory, track sales, manage employees and suppliers — all from one
                    beautiful dashboard. Say goodbye to spreadsheets.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href="/register"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-xl shadow-indigo-900/50 transition-all hover:-translate-y-0.5">
                        Start for Free
                        <IconArrowRight size={18} stroke={2} />
                    </Link>
                    <Link href="/login"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl border border-white/10 transition-all">
                        Sign In
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto mt-16 text-center">
                    {[["100%", "Uptime"], ["∞", "Products"], ["Free", "To use"]].map(([val, lbl]) => (
                        <div key={lbl}>
                            <div className="text-2xl font-bold text-white">{val}</div>
                            <div className="text-xs text-slate-500 mt-0.5">{lbl}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features */}
            <section className="px-6 md:px-12 py-16 max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold">Everything You Need to Run Your Business</h2>
                    <p className="text-slate-400 mt-3 max-w-xl mx-auto text-sm">
                        Six powerful modules working together so you can focus on what matters.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {features.map((f) => (
                        <div key={f.title}
                            className="bg-white/5 hover:bg-white/8 border border-white/10 rounded-2xl p-5 transition-all hover:-translate-y-1 group">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 shadow-lg`}>
                                <f.icon size={18} color="white" stroke={1.75} />
                            </div>
                            <h3 className="text-sm font-semibold text-white mb-2">{f.title}</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="px-6 md:px-12 py-16 max-w-6xl mx-auto text-center">
                <div className="bg-gradient-to-r from-indigo-600/30 to-violet-600/30 border border-indigo-500/20 rounded-3xl p-10 md:p-14">
                    <h2 className="text-2xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
                    <p className="text-slate-400 mb-8 max-w-md mx-auto text-sm">
                        Join businesses already saving time and money with StockFlow.
                    </p>
                    <Link href="/register"
                        className="inline-flex items-center gap-2 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-xl shadow-indigo-900/50 transition-all hover:-translate-y-0.5">
                        Create Free Account
                        <IconArrowRight size={18} stroke={2} />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="text-center py-8 text-xs text-slate-600 border-t border-white/5">
                © 2025 StockFlow. All rights reserved.
            </footer>
        </div>
    );
}

HomePage.layout = (page) => <AuthLayout children={page} />;
