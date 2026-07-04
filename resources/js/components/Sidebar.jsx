import {
    IconForklift,
    IconClipboard,
    IconUser,
    IconCoins,
    IconAdjustmentsHorizontal,
    IconLayoutDashboard,
    IconLogout,
    IconX,
} from "@tabler/icons-react";
import { Link, usePage, router } from "@inertiajs/react";

const data = [
    { link: "/dashboard", label: "Dashboard", icon: IconLayoutDashboard },
    { link: "/products",  label: "Products",  icon: IconClipboard },
    { link: "/sales",     label: "Sales",     icon: IconCoins },
    { link: "/suppliers", label: "Suppliers", icon: IconForklift },
    { link: "/employees", label: "Employees", icon: IconUser },
    { link: "/settings",  label: "Settings",  icon: IconAdjustmentsHorizontal },
];

export default function Sidebar({ onClose }) {
    const { url } = usePage();

    const handleLogout = (e) => {
        e.preventDefault();
        router.post("/logout");
    };

    return (
        <nav className="flex flex-col h-full w-64 bg-slate-900 shadow-2xl">
            {/* Brand header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-700/60">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                        <IconClipboard size={16} color="white" stroke={2} />
                    </div>
                    <span className="text-white font-bold text-lg tracking-tight">
                        Stock<span className="text-indigo-400">Flow</span>
                    </span>
                </div>
                {/* Mobile close */}
                {onClose && (
                    <button
                        onClick={onClose}
                        className="lg:hidden p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-md transition-colors"
                    >
                        <IconX size={18} />
                    </button>
                )}
            </div>

            {/* Navigation links */}
            <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                <p className="px-3 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Main Menu
                </p>
                {data.map((item) => {
                    const isActive = url.startsWith(item.link);
                    return (
                        <Link
                            key={item.label}
                            href={item.link}
                            onClick={onClose}
                            className={`
                                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                                transition-all duration-150 group
                                ${isActive
                                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/50"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                }
                            `}
                        >
                            <item.icon
                                size={19}
                                stroke={isActive ? 2 : 1.5}
                                className={isActive ? "text-white" : "text-slate-400 group-hover:text-white transition-colors"}
                            />
                            {item.label}
                            {isActive && (
                                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-300" />
                            )}
                        </Link>
                    );
                })}
            </div>

            {/* Footer */}
            <div className="px-3 pb-4 border-t border-slate-700/60 pt-3">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium
                               text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-150"
                >
                    <IconLogout size={19} stroke={1.5} />
                    Logout
                </button>
                <p className="text-center text-xs text-slate-600 mt-3">© 2025 StockFlow</p>
            </div>
        </nav>
    );
}
