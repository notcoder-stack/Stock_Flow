import Header from "../components/Header";
import { useForm, usePage } from "@inertiajs/react";
import { IconLock, IconShield, IconCheck, IconAlertCircle } from "@tabler/icons-react";

function FormField({ label, error, children }) {
    return (
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
            {children}
            {error && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    <IconAlertCircle size={12} stroke={2} /> {error}
                </p>
            )}
        </div>
    );
}

const inputCls = "w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all";

export default function Settings() {
    const { flash } = usePage().props;

    const { data, setData, put, processing, errors, reset, wasSuccessful } = useForm({
        current: "",
        password: "",
        password_confirmation: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put("/settings/password", {
            onSuccess: () => reset(),
        });
    };

    return (
        <div className="space-y-5 max-w-2xl">
            <Header name="Settings" subtitle="Manage your account preferences" />

            {/* Success banner */}
            {(wasSuccessful || flash?.success) && (
                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-xl">
                    <IconCheck size={16} stroke={2} />
                    {flash?.success || "Password updated successfully."}
                </div>
            )}

            {/* Password card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
                    <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                        <IconLock size={16} className="text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-slate-900">Change Password</h3>
                        <p className="text-xs text-slate-500">Update your account password</p>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    <FormField label="Current Password" error={errors.current}>
                        <input
                            type="password"
                            autoComplete="current-password"
                            placeholder="Enter current password"
                            value={data.current}
                            onChange={e => setData("current", e.target.value)}
                            required
                            className={`${inputCls} ${errors.current ? "border-red-300 focus:border-red-400 focus:ring-red-500/20" : ""}`}
                        />
                    </FormField>
                    <FormField label="New Password" error={errors.password}>
                        <input
                            type="password"
                            autoComplete="new-password"
                            placeholder="Min. 8 characters"
                            value={data.password}
                            onChange={e => setData("password", e.target.value)}
                            required
                            className={`${inputCls} ${errors.password ? "border-red-300 focus:border-red-400 focus:ring-red-500/20" : ""}`}
                        />
                    </FormField>
                    <FormField label="Confirm New Password" error={errors.password_confirmation}>
                        <input
                            type="password"
                            autoComplete="new-password"
                            placeholder="Repeat new password"
                            value={data.password_confirmation}
                            onChange={e => setData("password_confirmation", e.target.value)}
                            required
                            className={inputCls}
                        />
                    </FormField>
                    <button
                        type="submit"
                        disabled={processing}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium
                                   bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white shadow-sm transition-colors"
                    >
                        {processing ? "Saving…" : "Update Password"}
                    </button>
                </form>
            </div>

            {/* App info */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
                    <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center">
                        <IconShield size={16} className="text-slate-600" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-slate-900">About</h3>
                        <p className="text-xs text-slate-500">Application information</p>
                    </div>
                </div>
                <div className="p-5 space-y-3">
                    {[
                        { label: "Application", value: "StockFlow v1.0" },
                        { label: "Framework", value: "Laravel 12 + Inertia.js + React" },
                        { label: "Support", value: "help@stockflow.app" },
                    ].map(({ label, value }) => (
                        <div key={label} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                            <span className="text-sm text-slate-500">{label}</span>
                            <span className="text-sm font-medium text-slate-800">{value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
