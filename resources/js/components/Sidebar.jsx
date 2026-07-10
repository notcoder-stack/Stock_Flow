import { useState, useEffect } from "react";
import {
    IconForklift,
    IconClipboard,
    IconUser,
    IconCoins,
    IconAdjustmentsHorizontal,
    IconLayoutDashboard,
    IconLogout,
    IconX,
    IconSun,
    IconMoon,
    IconChevronUp,
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
    const { url, props } = usePage();
    const { auth } = props;
    
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const isDarkMode = document.documentElement.classList.contains("dark");
        setIsDark(isDarkMode);
    }, []);

    const toggleTheme = () => {
        const root = document.documentElement;
        if (root.classList.contains("dark")) {
            root.classList.remove("dark");
            root.setAttribute("data-mantine-color-scheme", "light");
            localStorage.setItem("theme", "light");
            setIsDark(false);
        } else {
            root.classList.add("dark");
            root.setAttribute("data-mantine-color-scheme", "dark");
            localStorage.setItem("theme", "dark");
            setIsDark(true);
        }
    };

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
            <div className="px-3 pb-4 border-t border-slate-700/60 pt-3 relative">
                {isDropdownOpen && (
                    <div className="absolute bottom-full left-3 right-3 mb-2 bg-slate-800 border border-slate-700 rounded-xl p-1.5 shadow-xl animate-in fade-in slide-in-from-bottom-2">
                        <button
                            onClick={toggleTheme}
                            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium
                                       text-slate-300 hover:bg-slate-700 hover:text-white transition-all duration-150"
                        >
                            {isDark ? <IconSun size={17} stroke={1.5} /> : <IconMoon size={17} stroke={1.5} />}
                            {isDark ? "Light Mode" : "Dark Mode"}
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium
                                       text-slate-300 hover:bg-red-500/10 hover:text-red-400 transition-all duration-150 mt-1"
                        >
                            <IconLogout size={17} stroke={1.5} />
                            Logout
                        </button>
                    </div>
                )}
                
                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center justify-between px-3 py-2.5 w-full rounded-xl text-sm font-medium
                               bg-slate-800/50 text-slate-300 hover:bg-slate-800 hover:text-white transition-all duration-150"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center text-xs text-white font-bold">
                            {auth?.user?.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <span className="truncate max-w-[120px]">{auth?.user?.name || "User"}</span>
                    </div>
                    <IconChevronUp size={16} className={`transition-transform duration-200 text-slate-500 ${isDropdownOpen ? "rotate-180" : ""}`} />
                </button>
            </div>
        </nav>
    );
}
