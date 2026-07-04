import { useEffect, useState } from "react";
import { router } from "@inertiajs/react";
import { IconX, IconUpload } from "@tabler/icons-react";

function FormField({ label, children }) {
    return (
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
            {children}
        </div>
    );
}

const inputCls = "w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all";

export default function ProductModal({ isOpen, onClose, product }) {
    const [formData, setFormData] = useState({ name: "", price: "", stockQuantity: "", rating: "", image: "" });
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (product) {
            setFormData({ name: product.name, price: product.price, stockQuantity: product.stockQuantity, rating: product.rating, image: product.image || "" });
            setPreview(product.image || "");
            setSelectedFile(null);
        } else {
            setFormData({ name: "", price: "", stockQuantity: "", rating: "", image: "" });
            setPreview("");
            setSelectedFile(null);
        }
    }, [product, isOpen]);

    const handleChange = (e) => setFormData(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleFileChange = (e) => {
        if (e.target.files?.[0]) {
            setSelectedFile(e.target.files[0]);
            setPreview(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);
        const data = new FormData();
        Object.entries(formData).forEach(([k, v]) => { if (k !== "image") data.append(k, v); });
        if (selectedFile) data.append("image", selectedFile);

        const opts = {
            onSuccess: () => { onClose(); router.reload(); setSubmitting(false); },
            onError: () => setSubmitting(false),
        };

        if (product?.id) { data.append("_method", "PUT"); router.post(`/products/${product.id}`, data, opts); }
        else router.post("/products", data, opts);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                    <h3 className="text-base font-semibold text-slate-900">
                        {product ? "Edit Product" : "Add Product"}
                    </h3>
                    <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                        <IconX size={16} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                    <FormField label="Product Name">
                        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Wireless Headphones" required className={inputCls} />
                    </FormField>
                    <div className="grid grid-cols-2 gap-3">
                        <FormField label="Price ($)">
                            <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="0.00" required min="0" step="0.01" className={inputCls} />
                        </FormField>
                        <FormField label="Stock Qty">
                            <input type="number" name="stockQuantity" value={formData.stockQuantity} onChange={handleChange} placeholder="0" required min="0" className={inputCls} />
                        </FormField>
                    </div>
                    <FormField label="Rating (1–5)">
                        <input type="number" name="rating" value={formData.rating} onChange={handleChange} placeholder="0" min="0" max="5" className={inputCls} />
                    </FormField>
                    <FormField label="Product Image">
                        <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-200 rounded-xl p-5 cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/30 transition-all">
                            {preview ? (
                                <img src={preview} alt="Preview" className="w-24 h-24 object-cover rounded-lg" />
                            ) : (
                                <>
                                    <IconUpload size={20} className="text-slate-400" />
                                    <span className="text-xs text-slate-500">Click to upload image</span>
                                </>
                            )}
                            <input type="file" name="image" onChange={handleFileChange} className="hidden" accept="image/*" />
                        </label>
                    </FormField>

                    <div className="flex gap-3 pt-1">
                        <button type="button" onClick={onClose}
                            className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-xl transition-colors">
                            Cancel
                        </button>
                        <button type="submit" disabled={submitting}
                            className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-medium rounded-xl transition-colors">
                            {submitting ? "Saving…" : product ? "Update" : "Add Product"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
