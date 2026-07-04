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

export default function EmployeeModal({ isOpen, onClose, employee }) {
    const [formData, setFormData] = useState({ name: "", address: "", email: "", department: "" });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        setFormData(employee
            ? { name: employee.name, address: employee.address, email: employee.email, department: employee.department }
            : { name: "", address: "", email: "", department: "" }
        );
    }, [employee, isOpen]);

    const handleChange = (e) => setFormData(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);
        const data = new FormData();
        Object.entries(formData).forEach(([k, v]) => data.append(k, v));

        const opts = {
            onSuccess: () => { onClose(); router.reload(); setSubmitting(false); },
            onError: () => setSubmitting(false),
        };

        if (employee?.id) { data.append("_method", "PUT"); router.post(`/employees/${employee.id}`, data, opts); }
        else router.post("/employees", data, opts);
    };

    if (!isOpen) return null;

    const DEPARTMENTS = ["Engineering", "Marketing", "Sales", "HR", "Finance", "Operations", "Other"];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                    <h3 className="text-base font-semibold text-slate-900">
                        {employee ? "Edit Employee" : "Add Employee"}
                    </h3>
                    <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                        <IconX size={16} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    <FormField label="Full Name">
                        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Jane Doe" required className={inputCls} />
                    </FormField>
                    <FormField label="Email">
                        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="jane@example.com" required className={inputCls} />
                    </FormField>
                    <FormField label="Department">
                        <select name="department" value={formData.department} onChange={handleChange} required className={inputCls}>
                            <option value="">Select department…</option>
                            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </FormField>
                    <FormField label="Address">
                        <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="123 Main St, City" required className={inputCls} />
                    </FormField>

                    <div className="flex gap-3 pt-1">
                        <button type="button" onClick={onClose}
                            className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-xl transition-colors">
                            Cancel
                        </button>
                        <button type="submit" disabled={submitting}
                            className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-medium rounded-xl transition-colors">
                            {submitting ? "Saving…" : employee ? "Update" : "Add Employee"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
