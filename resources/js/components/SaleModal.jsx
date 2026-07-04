import { useEffect, useState } from "react";
import { router } from "@inertiajs/react";
import { IconX } from "@tabler/icons-react";

const inputCls = "w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all";

function FormField({ label, children }) {
    return (
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
            {children}
        </div>
    );
}

export default function SaleModal({ isOpen, onClose, sale }) {
    const [formData, setFormData] = useState({ productName: "", quantity: "", price: "", revenue: "", date: "" });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        setFormData(sale
            ? { productName: sale.productName, quantity: sale.quantity, price: sale.price, revenue: sale.revenue, date: sale.date }
            : { productName: "", quantity: "", price: "", revenue: "", date: "" }
        );
    }, [sale, isOpen]);

    const handleChange = (e) => {
        const updated = { ...formData, [e.target.name]: e.target.value };
        // Auto-calculate revenue
        if ((e.target.name === "price" || e.target.name === "quantity") && updated.price && updated.quantity) {
            updated.revenue = (parseFloat(updated.price) * parseInt(updated.quantity)).toFixed(2);
        }
        setFormData(updated);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);
        const data = new FormData();
        Object.entries(formData).forEach(([k, v]) => data.append(k, v));

        const opts = {
            onSuccess: () => { onClose(); router.reload(); setSubmitting(false); },
            onError: () => setSubmitting(false),
        };

        if (sale?.id) { data.append("_method", "PUT"); router.post(`/sales/${sale.id}`, data, opts); }
        else router.post("/sales", data, opts);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                    <h3 className="text-base font-semibold text-slate-900">
                        {sale ? "Edit Sale" : "Record Sale"}
                    </h3>
                    <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                        <IconX size={16} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    <FormField label="Product Name">
                        <input type="text" name="productName" value={formData.productName} onChange={handleChange} placeholder="Product name" required className={inputCls} />
                    </FormField>
                    <div className="grid grid-cols-2 gap-3">
                        <FormField label="Quantity">
                            <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} placeholder="0" required min="1" className={inputCls} />
                        </FormField>
                        <FormField label="Unit Price ($)">
                            <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="0.00" required min="0" step="0.01" className={inputCls} />
                        </FormField>
                    </div>
                    <FormField label="Total Revenue ($)">
                        <input type="number" name="revenue" value={formData.revenue} onChange={handleChange} placeholder="Auto-calculated" min="0" step="0.01" className={`${inputCls} bg-emerald-50 border-emerald-200 text-emerald-700 font-medium`} />
                        <p className="text-xs text-slate-400 mt-1">Auto-calculated from qty × price</p>
                    </FormField>
                    <FormField label="Date">
                        <input type="date" name="date" value={formData.date} onChange={handleChange} required className={inputCls} />
                    </FormField>

                    <div className="flex gap-3 pt-1">
                        <button type="button" onClick={onClose}
                            className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-xl transition-colors">
                            Cancel
                        </button>
                        <button type="submit" disabled={submitting}
                            className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-medium rounded-xl transition-colors">
                            {submitting ? "Saving…" : sale ? "Update" : "Record Sale"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
