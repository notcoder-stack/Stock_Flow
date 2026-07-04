import { IconShoppingCart } from "@tabler/icons-react";

export default function RecentSales({ sales }) {
    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 h-full">
            <div className="mb-4">
                <h3 className="text-base font-semibold text-slate-900">Recent Sales</h3>
                <p className="text-xs text-slate-500 mt-0.5">Latest transactions</p>
            </div>
            {sales.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                    <IconShoppingCart size={32} stroke={1.25} />
                    <p className="text-sm mt-2">No sales yet</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {sales.map((sale, i) => (
                        <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                                    <IconShoppingCart size={14} className="text-indigo-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-800 leading-tight">{sale.productName}</p>
                                    <p className="text-xs text-slate-400">{sale.date}</p>
                                </div>
                            </div>
                            <span className="text-sm font-semibold text-emerald-600">+${sale.revenue}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
