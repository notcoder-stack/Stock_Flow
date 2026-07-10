import { useState } from "react";
import Header from "../components/Header.jsx";
import EmployeeModal from "../components/EmployeeModal.jsx";
import { Link, router } from "@inertiajs/react";
import { useDisclosure } from "@mantine/hooks";
import {
    IconCirclePlus, IconEdit, IconTrash, IconSearch,
    IconUsers, IconMail, IconMapPin, IconBriefcase,
} from "@tabler/icons-react";

function Avatar({ name }) {
    const initials = name?.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase() || "?";
    const colors = [
        "bg-indigo-100 text-indigo-600", "bg-violet-100 text-violet-600",
        "bg-sky-100 text-sky-600", "bg-emerald-100 text-emerald-600",
        "bg-amber-100 text-amber-600", "bg-pink-100 text-pink-600",
    ];
    const color = colors[name?.charCodeAt(0) % colors.length] || colors[0];
    return (
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${color}`}>
            {initials}
        </div>
    );
}

const DEPT_COLORS = {
    Engineering: "bg-blue-50 text-blue-600",
    Marketing: "bg-pink-50 text-pink-600",
    Sales: "bg-emerald-50 text-emerald-600",
    HR: "bg-violet-50 text-violet-600",
    Finance: "bg-amber-50 text-amber-600",
    Operations: "bg-sky-50 text-sky-600",
};

export default function Employees({ employees }) {
    const [opened, { open, close }] = useDisclosure(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [search, setSearch] = useState("");
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    if (!employees) return (
        <div className="text-center text-red-500 py-10">Failed to fetch employees</div>
    );

    const filtered = employees.data.filter(e =>
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.department?.toLowerCase().includes(search.toLowerCase()) ||
        e.email?.toLowerCase().includes(search.toLowerCase())
    );

    const openModal = (employee = null) => { setSelectedEmployee(employee); open(); };

    const handleDelete = (id) => {
        if (deleteConfirm !== id) { setDeleteConfirm(id); return; }
        router.delete(`/employees/${id}`, {
            onSuccess: () => { setDeleteConfirm(null); router.reload(); },
        });
    };

    return (
        <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <Header name="Employees" subtitle={`${employees.data.length} team members`} />
                <button
                    onClick={() => openModal(null)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700
                               text-white text-sm font-medium rounded-xl shadow-sm transition-colors shrink-0"
                >
                    <IconCirclePlus size={18} stroke={2} />
                    Add Employee
                </button>
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
                <IconSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search by name, dept, email..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm
                               text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2
                               focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                        <IconUsers size={40} stroke={1} />
                        <p className="text-sm font-medium mt-3">No employees found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3.5">Employee</th>
                                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3.5 hidden sm:table-cell">Department</th>
                                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3.5 hidden md:table-cell">Email</th>
                                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3.5 hidden lg:table-cell">Address</th>
                                    <th className="px-5 py-3.5" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filtered.map((employee) => {
                                    const deptColor = DEPT_COLORS[employee.department] || "bg-slate-100 text-slate-600";
                                    return (
                                        <tr key={employee.id} className="hover:bg-slate-50/60 transition-colors">
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    <Avatar name={employee.name} />
                                                    <span className="text-sm font-medium text-slate-900">{employee.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5 hidden sm:table-cell">
                                                <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${deptColor}`}>
                                                    <IconBriefcase size={10} stroke={2} />
                                                    {employee.department}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5 hidden md:table-cell">
                                                <div className="flex items-center gap-1.5 text-sm text-slate-600">
                                                    <IconMail size={13} className="text-slate-400" />
                                                    {employee.email}
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5 hidden lg:table-cell">
                                                <div className="flex items-center gap-1.5 text-sm text-slate-500">
                                                    <IconMapPin size={13} className="text-slate-400" />
                                                    {employee.address}
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-1.5 justify-end">
                                                    <button
                                                        onClick={() => openModal(employee)}
                                                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                    >
                                                        <IconEdit size={15} stroke={1.75} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(employee.id)}
                                                        className={`p-1.5 rounded-lg transition-colors
                                                            ${deleteConfirm === employee.id
                                                                ? "bg-red-500 text-white"
                                                                : "text-slate-400 hover:text-red-500 hover:bg-red-50"}`}
                                                        title={deleteConfirm === employee.id ? "Click again to confirm" : "Delete"}
                                                    >
                                                        <IconTrash size={15} stroke={1.75} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-1">
                {employees.links.map((link) =>
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

            <EmployeeModal isOpen={opened} onClose={close} employee={selectedEmployee} />
        </div>
    );
}
