import {
    IconCoin,
    IconReceipt2,
    IconUserPlus,
    IconPackage,
    IconTrendingUp,
} from "@tabler/icons-react";

const cards = [
    {
        title: "Total Revenue",
        icon: IconReceipt2,
        gradient: "from-indigo-500 to-indigo-600",
        bgLight: "bg-indigo-50",
        textColor: "text-indigo-600",
        format: (v) => `$${Number(v).toLocaleString()}`,
    },
    {
        title: "Total Sales",
        icon: IconCoin,
        gradient: "from-violet-500 to-violet-600",
        bgLight: "bg-violet-50",
        textColor: "text-violet-600",
        format: (v) => Number(v).toLocaleString(),
    },
    {
        title: "Products",
        icon: IconPackage,
        gradient: "from-sky-500 to-sky-600",
        bgLight: "bg-sky-50",
        textColor: "text-sky-600",
        format: (v) => Number(v).toLocaleString(),
    },
    {
        title: "Employees",
        icon: IconUserPlus,
        gradient: "from-emerald-500 to-emerald-600",
        bgLight: "bg-emerald-50",
        textColor: "text-emerald-600",
        format: (v) => Number(v).toLocaleString(),
    },
];

export function StatsGrid({ sums = [] }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {cards.map((card, index) => {
                const Icon = card.icon;
                const value = sums[index] ?? 0;
                return (
                    <div
                        key={card.title}
                        className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-200"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-slate-500">{card.title}</span>
                            <div className={`w-10 h-10 rounded-xl ${card.bgLight} flex items-center justify-center`}>
                                <Icon size={20} className={card.textColor} stroke={1.75} />
                            </div>
                        </div>
                        <div className="flex items-end justify-between">
                            <span className="text-3xl font-bold text-slate-900 tabular-nums">
                                {card.format(value)}
                            </span>
                            <div className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                                <IconTrendingUp size={12} stroke={2} />
                                <span className="font-medium">Active</span>
                            </div>
                        </div>
                        <div className={`mt-4 h-1 rounded-full bg-gradient-to-r ${card.gradient} opacity-60`} />
                    </div>
                );
            })}
        </div>
    );
}
