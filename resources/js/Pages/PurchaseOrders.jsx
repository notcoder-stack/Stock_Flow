import { useState } from "react";
import Header from "../components/Header.jsx";
import PurchaseOrderModal from "../components/PurchaseOrderModal.jsx";
import { Link, router } from "@inertiajs/react";
import { useDisclosure } from "@mantine/hooks";
import {
    IconCirclePlus, IconEdit, IconTrash, IconSearch,
    IconReceipt, IconCheck, IconX, IconClock
} from "@tabler/icons-react";

function StatusBadge({ status }) {
    const statusConfig = {
        draft: { color: "bg-slate-100 text-slate-700", label: "Draft" },
        submitted: { color: "bg-blue-100 text-blue-700", label: "Submitted" },
        partially_received: { color: "bg-orange-100 text-orange-700", label: "Partially Received" },
        fully_received: { color: "bg-green-100 text-green-700", label: "Fully Received" },
        closed: { color: "bg-slate-100 text-slate-700", label: "Closed" },
        cancelled: { color: "bg-red-100 text-red-700", label: "Cancelled" },
        partially_cancelled: { color: "bg-red-100 text-red-700", label: "Partially Cancelled" },
    };

    const config = statusConfig[status] || statusConfig.draft;

    return (
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${config.color}`}>
            {config.label}
        </span>
    );
}

function ApprovalBadge({ status }) {
    if (status === 'not_required') return null;
    
    const config = {
        pending: { color: "bg-amber-100 text-amber-700", icon: IconClock, label: "Pending Approval" },
        approved: { color: "bg-emerald-100 text-emerald-700", icon: IconCheck, label: "Approved" },
        rejected: { color: "bg-rose-100 text-rose-700", icon: IconX, label: "Rejected" },
    }[status];

    if (!config) return null;
    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md mt-1 ${config.color}`}>
            <Icon size={10} stroke={3} />
            {config.label}
        </span>
    );
}

export default function PurchaseOrders({ purchaseOrders, suppliers, products, errors }) {
    const [opened, { open, close }] = useDisclosure(false);
    const [selectedPO, setSelectedPO] = useState(null);
    const [search, setSearch] = useState("");
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const filtered = purchaseOrders?.data?.filter(po =>
        po.id.toString().includes(search) ||
        (suppliers.find(s => s.id === po.supplier_id)?.name || "").toLowerCase().includes(search.toLowerCase())
    ) || [];

    const openModal = (po = null) => { setSelectedPO(po); open(); };

    const handleDelete = (id) => {
        if (deleteConfirm !== id) { setDeleteConfirm(id); return; }
        router.delete(`/purchase-orders/${id}`, {
            onSuccess: () => { setDeleteConfirm(null); router.reload(); },
        });
    };

    const calculateTotal = (items) => {
        return items.reduce((sum, item) => sum + (item.quantity_ordered * item.unit_cost), 0);
    };

    return (
        <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <Header name="Purchase Orders" subtitle={`${purchaseOrders?.total || 0} purchase orders`} />
                <button
                    onClick={() => openModal(null)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700
                               text-white text-sm font-medium rounded-xl shadow-sm transition-colors shrink-0"
                >
                    <IconCirclePlus size={18} stroke={2} />
                    Create PO
                </button>
            </div>

            {/* Errors from Duplicate Detection */}
            {errors?.duplicates && (
                <div className="p-4 mb-4 text-sm text-amber-800 rounded-xl bg-amber-50 border border-amber-200">
                    <span className="font-medium">Warning:</span> {errors.duplicates}
                </div>
            )}

            {/* Search */}
            <div className="relative max-w-sm">
                <IconSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search by ID or Supplier..."
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
                        <IconReceipt size={40} stroke={1} />
                        <p className="text-sm font-medium mt-3">No purchase orders found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3.5">PO #</th>
                                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3.5">Supplier</th>
                                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3.5">Total</th>
                                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3.5">Status</th>
                                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3.5 hidden md:table-cell">Dates</th>
                                    <th className="px-5 py-3.5" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filtered.map((po) => {
                                    const supplier = suppliers.find(s => s.id === po.supplier_id);
                                    return (
                                    <tr key={po.id} className="hover:bg-slate-50/60 transition-colors">
                                        <td className="px-5 py-3.5 text-sm font-medium text-slate-900">
                                            PO-{po.id.toString().padStart(4, '0')}
                                            {po.is_template && <span className="ml-2 text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded uppercase font-bold">Template</span>}
                                        </td>
                                        <td className="px-5 py-3.5 text-sm text-slate-600">
                                            {supplier?.name || "Unknown"}
                                        </td>
                                        <td className="px-5 py-3.5 text-sm font-medium text-slate-900">
                                            ${calculateTotal(po.items).toFixed(2)}
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <div className="flex flex-col items-start">
                                                <StatusBadge status={po.status} />
                                                <ApprovalBadge status={po.approval_status} />
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5 hidden md:table-cell text-xs text-slate-500">
                                            <div>Ord: {new Date(po.ordered_at).toLocaleDateString()}</div>
                                            {po.received_at && <div>Rcv: {new Date(po.received_at).toLocaleDateString()}</div>}
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-1.5 justify-end">
                                                <button onClick={() => openModal(po)}
                                                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                                    <IconEdit size={15} stroke={1.75} />
                                                </button>
                                                <button onClick={() => handleDelete(po.id)}
                                                    className={`p-1.5 rounded-lg transition-colors
                                                        ${deleteConfirm === po.id
                                                            ? "bg-red-500 text-white"
                                                            : "text-slate-400 hover:text-red-500 hover:bg-red-50"}`}>
                                                    <IconTrash size={15} stroke={1.75} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )})}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-1">
                {purchaseOrders?.links?.map((link) =>
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

            <PurchaseOrderModal isOpen={opened} onClose={close} purchaseOrder={selectedPO} suppliers={suppliers} products={products} />
        </div>
    );
}
