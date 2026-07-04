export default function Header({ name, subtitle }) {
    return (
        <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{name}</h1>
            {subtitle && (
                <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
            )}
        </div>
    );
}
