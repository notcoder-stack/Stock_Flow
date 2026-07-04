import { useState } from "react";
import Header from "../components/Header.jsx";
import SaleModal from "../components/SaleModal.jsx";
import { Link, router } from "@inertiajs/react";
import { useDisclosure } from "@mantine/hooks";
import {
    IconCirclePlus, IconEdit, IconTrash, IconSearch,
    IconShoppingCart, IconCalendar,
} from "@tabler/icons-react";

export default function Sales({ sales }) {
    const [opened, { open, close }] = useDisclosure(false);
    const [selectedSale, setSelectedSale] = useState(null);
    const [search, setSearch] = useState("");
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    if (!sales) return (
        <div className="text-center text-red-500 py-10">Failed to fetch sales</div>
    );

    const filtered = sales.data.filter(s =>
        s.productName.toLowerCase().includes(search.toLowerCase())
    );

    const openModal = (sale = null) => { setSelectedSale(sale); open(); };

    const handleDelete = (id) => {
        if (deleteConfirm !== id) { setDeleteConfirm(id); return; }
        router.delete(`/sales/${id}`, {
            onSuccess: () => { setDeleteConfirm(null); router.reload(); },
        });
    };

    return (
        <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <Header name="Sales" subtitle={`${sales.data.length} transactions recorded`} />
                <button
                    onClick={() => openModal(null)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700
                               text-white text-sm font-medium rounded-xl shadow-sm transition-colors shrink-0"
                >
                    <IconCirclePlus size={18} stroke={2} />
                    Add Sale
                </button>
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
                <IconSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search by product name..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm
                               text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2
                               focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
                />
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                        <IconShoppingCart size={40} stroke={1} />
                        <p className="text-sm font-medium mt-3">No sales found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    {["Product", "Qty", "Price", "Revenue", "Date", ""].map(h => (
                                        <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3.5">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filtered.map((sale) => (
                                    <tr key={sale.id} className="hover:bg-slate-50/60 transition-colors">
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                                                    <IconShoppingCart size={14} className="text-indigo-500" />
                                                </div>
                                                <span className="text-sm font-medium text-slate-900">{sale.productName}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className="inline-flex items-center text-xs font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                                                ×{sale.quantity}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-sm text-slate-600 font-medium">${sale.price}</td>
                                        <td className="px-5 py-3.5">
                                            <span className="text-sm font-semibold text-emerald-600">${sale.revenue}</span>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-1.5 text-sm text-slate-500">
                                                <IconCalendar size={13} className="text-slate-400" />
                                                {sale.date}
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-1.5 justify-end">
                                                <button onClick={() => openModal(sale)}
                                                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                                    <IconEdit size={15} stroke={1.75} />
                                                </button>
                                                <button onClick={() => handleDelete(sale.id)}
                                                    className={`p-1.5 rounded-lg transition-colors
                                                        ${deleteConfirm === sale.id
                                                            ? "bg-red-500 text-white"
                                                            : "text-slate-400 hover:text-red-500 hover:bg-red-50"}`}>
                                                    <IconTrash size={15} stroke={1.75} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Pagination */}
            <div className="flex items-center gap-1">
                {sales.links.map((link) =>
                    link.url ? (
                        <Link key={link.label} href={link.url}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                                ${link.active ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-slate-100"}`}
                        />
                    ) : (
                        <span key={link.label} dangerouslySetInnerHTML={{ __html: link.label }}
                            className="px-3 py-1.5 text-sm text-slate-300" />
                    )
                )}
            </div>

            <SaleModal isOpen={opened} onClose={close} sale={selectedSale} />
        </div>
    );
}
