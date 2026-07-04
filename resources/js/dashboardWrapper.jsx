import { useState } from "react";
import Sidebar from "./components/Sidebar.jsx";
import { IconMenu2, IconX } from "@tabler/icons-react";

const DashboardWrapper = ({ children }) => {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="flex w-full min-h-screen bg-slate-50">
            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={`
                    fixed inset-y-0 left-0 z-30 lg:static lg:z-auto
                    transform transition-transform duration-200 ease-out
                    ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                `}
            >
                <Sidebar onClose={() => setMobileOpen(false)} />
            </div>

            {/* Main content */}
            <div className="flex flex-col flex-1 min-w-0 lg:ml-0">
                {/* Mobile top bar */}
                <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-slate-200 shadow-sm">
                    <button
                        onClick={() => setMobileOpen(true)}
                        className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                        <IconMenu2 size={22} />
                    </button>
                    <span className="font-bold text-indigo-600 text-lg tracking-tight">STOCKFLOW</span>
                </div>

                <main className="flex-1 p-6 lg:p-8 animate-fade-in-up">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardWrapper;
