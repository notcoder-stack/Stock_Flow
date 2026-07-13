import { useState, useEffect } from "react";
import { Modal } from "@mantine/core";
import { router, useForm } from "@inertiajs/react";
import {
    IconReceipt, IconPlus, IconTrash, IconCheck, IconX, IconEdit
} from "@tabler/icons-react";

export default function PurchaseOrderModal({ isOpen, onClose, purchaseOrder, suppliers, products }) {
    const isEditing = !!purchaseOrder;
    
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        supplier_id: "",
        notes: "",
        is_template: false,
        recurrence_interval: "",
        items: [{ product_id: "", quantity_ordered: 1, unit_cost: 0 }],
        ignore_duplicates: false,
        reason: "", // For amendments
    });

    const [mode, setMode] = useState(isEditing ? 'view' : 'create'); // create, view, amend

    useEffect(() => {
        if (isOpen) {
            clearErrors();
            if (purchaseOrder) {
                setMode('view');
                setData({
                    supplier_id: purchaseOrder.supplier_id,
                    notes: purchaseOrder.notes || "",
                    is_template: purchaseOrder.is_template || false,
                    recurrence_interval: purchaseOrder.recurrence_interval || "",
                    items: purchaseOrder.items || [],
                    ignore_duplicates: false,
                    reason: "",
                });
            } else {
                setMode('create');
                reset();
            }
        }
    }, [isOpen, purchaseOrder]);

    const calculateTotal = () => {
        return data.items.reduce((sum, item) => sum + (item.quantity_ordered * item.unit_cost), 0);
    };

    const addItem = () => {
        setData('items', [...data.items, { product_id: "", quantity_ordered: 1, unit_cost: 0 }]);
    };

    const removeItem = (index) => {
        const newItems = [...data.items];
        newItems.splice(index, 1);
        setData('items', newItems);
    };

    const updateItem = (index, field, value) => {
        const newItems = [...data.items];
        newItems[index][field] = value;
        // Auto-fill unit cost if product is selected
        if (field === 'product_id') {
            const product = products.find(p => p.id.toString() === value.toString());
            if (product) {
                newItems[index]['unit_cost'] = product.cost_price || 0;
            }
        }
        setData('items', newItems);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (mode === 'create') {
            post("/purchase-orders", {
                onSuccess: () => onClose(),
            });
        } else if (mode === 'amend') {
            post(`/purchase-orders/${purchaseOrder.id}/amend`, {
                onSuccess: () => {
                    setMode('view');
                    router.reload(); // To refresh data if modal stays open, though usually it closes or updates
                    onClose();
                },
            });
        }
    };

    const handleApprove = () => {
        router.post(`/purchase-orders/${purchaseOrder.id}/approve`, {}, {
            onSuccess: () => onClose()
        });
    };

    const handleCancel = () => {
        if(confirm('Are you sure you want to cancel this PO?')) {
            router.post(`/purchase-orders/${purchaseOrder.id}/cancel`, {}, {
                onSuccess: () => onClose()
            });
        }
    };

    return (
        <Modal
            opened={isOpen}
            onClose={onClose}
            title={
                <div className="flex items-center gap-2 text-slate-800 font-semibold text-lg">
                    <IconReceipt className="text-indigo-600" />
                    {mode === 'create' ? "Create Purchase Order" : 
                     mode === 'amend' ? `Amend PO-${purchaseOrder?.id.toString().padStart(4, '0')}` :
                     `View PO-${purchaseOrder?.id.toString().padStart(4, '0')}`}
                </div>
            }
            size="xl"
            radius="md"
            overlayProps={{ blur: 3, opacity: 0.4 }}
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                
                {mode === 'amend' && (
                    <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                        <label className="block text-sm font-medium text-amber-800 mb-1">Reason for Amendment *</label>
                        <input
                            type="text"
                            required
                            value={data.reason}
                            onChange={e => setData('reason', e.target.value)}
                            className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            placeholder="e.g. Supplier changed price"
                        />
                        {errors.reason && <p className="text-red-500 text-xs mt-1">{errors.reason}</p>}
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Supplier</label>
                        <select
                            value={data.supplier_id}
                            onChange={e => setData('supplier_id', e.target.value)}
                            disabled={mode === 'view'}
                            required
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors disabled:opacity-70"
                        >
                            <option value="">Select a supplier...</option>
                            {suppliers?.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                        {errors.supplier_id && <p className="text-red-500 text-xs mt-1">{errors.supplier_id}</p>}
                    </div>

                    {(mode === 'create' || data.is_template) && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-2">
                                <input 
                                    type="checkbox" 
                                    checked={data.is_template}
                                    onChange={e => setData('is_template', e.target.checked)}
                                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                Save as Template
                            </label>
                            {data.is_template && (
                                <select
                                    value={data.recurrence_interval}
                                    onChange={e => setData('recurrence_interval', e.target.value)}
                                    className="w-full px-3 py-2 mt-1 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                                >
                                    <option value="">No Recurrence</option>
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="monthly">Monthly</option>
                                </select>
                            )}
                        </div>
                    )}
                </div>

                {/* Items List */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <h3 className="text-sm font-semibold text-slate-800">Order Items</h3>
                        {mode !== 'view' && (
                            <button type="button" onClick={addItem} className="text-indigo-600 text-xs font-medium flex items-center gap-1 hover:text-indigo-700">
                                <IconPlus size={14} /> Add Item
                            </button>
                        )}
                    </div>
                    
                    <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-100/50 border-b border-slate-200 text-slate-500">
                                <tr>
                                    <th className="px-4 py-2 font-medium">Product</th>
                                    <th className="px-4 py-2 font-medium w-24">Qty</th>
                                    <th className="px-4 py-2 font-medium w-32">Unit Cost</th>
                                    <th className="px-4 py-2 font-medium w-24">Total</th>
                                    {mode !== 'view' && <th className="px-4 py-2 w-10"></th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {data.items.map((item, index) => (
                                    <tr key={index}>
                                        <td className="px-4 py-2">
                                            {mode === 'view' ? (
                                                products.find(p => p.id == item.product_id)?.name || item.product_id
                                            ) : (
                                                <select
                                                    value={item.product_id}
                                                    onChange={e => updateItem(index, 'product_id', e.target.value)}
                                                    required
                                                    className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-sm"
                                                >
                                                    <option value="">Select...</option>
                                                    {products?.map(p => (
                                                        <option key={p.id} value={p.id}>{p.name}</option>
                                                    ))}
                                                </select>
                                            )}
                                        </td>
                                        <td className="px-4 py-2">
                                            {mode === 'view' ? (
                                                item.quantity_ordered
                                            ) : (
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={item.quantity_ordered}
                                                    onChange={e => updateItem(index, 'quantity_ordered', e.target.value)}
                                                    required
                                                    className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-sm"
                                                />
                                            )}
                                        </td>
                                        <td className="px-4 py-2">
                                            {mode === 'view' ? (
                                                `$${parseFloat(item.unit_cost).toFixed(2)}`
                                            ) : (
                                                <div className="relative">
                                                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        value={item.unit_cost}
                                                        onChange={e => updateItem(index, 'unit_cost', e.target.value)}
                                                        required
                                                        className="w-full pl-6 pr-2 py-1.5 border border-slate-200 rounded-lg text-sm"
                                                    />
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-2 font-medium">
                                            ${(item.quantity_ordered * item.unit_cost).toFixed(2)}
                                        </td>
                                        {mode !== 'view' && (
                                            <td className="px-4 py-2 text-right">
                                                <button type="button" onClick={() => removeItem(index)} className="text-red-400 hover:text-red-600">
                                                    <IconTrash size={16} />
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                                {data.items.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-4 py-6 text-center text-slate-400 text-sm">
                                            No items added yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                            <tfoot className="bg-slate-50 border-t border-slate-200">
                                <tr>
                                    <td colSpan="3" className="px-4 py-3 text-right font-medium text-slate-600">Total Amount:</td>
                                    <td colSpan={mode !== 'view' ? "2" : "1"} className="px-4 py-3 font-bold text-slate-900 text-lg">
                                        ${calculateTotal().toFixed(2)}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    {errors.items && <p className="text-red-500 text-xs mt-1">{errors.items}</p>}
                </div>

                {/* Amendments History in View Mode */}
                {mode === 'view' && purchaseOrder?.amendments?.length > 0 && (
                    <div className="mt-6 border-t border-slate-200 pt-6">
                        <h3 className="text-sm font-semibold text-slate-800 mb-3">Amendment History</h3>
                        <div className="space-y-3">
                            {purchaseOrder.amendments.map(am => (
                                <div key={am.id} className="bg-white border border-slate-200 p-3 rounded-lg text-sm shadow-sm">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-medium text-slate-700">By User ID: {am.amended_by}</span>
                                        <span className="text-xs text-slate-400">{new Date(am.created_at).toLocaleString()}</span>
                                    </div>
                                    <p className="text-slate-600"><span className="font-medium">Reason:</span> {am.reason}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                        {mode === 'view' ? 'Close' : 'Cancel'}
                    </button>
                    
                    {mode === 'view' ? (
                        <>
                            {purchaseOrder.status !== 'cancelled' && purchaseOrder.status !== 'closed' && (
                                <button
                                    type="button"
                                    onClick={() => setMode('amend')}
                                    className="px-4 py-2.5 text-sm font-medium bg-amber-100 text-amber-700 hover:bg-amber-200 rounded-xl transition-colors flex items-center gap-2"
                                >
                                    <IconEdit size={16} /> Amend PO
                                </button>
                            )}
                            
                            {purchaseOrder.approval_status === 'pending' && (
                                <button
                                    type="button"
                                    onClick={handleApprove}
                                    className="px-4 py-2.5 text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl transition-colors flex items-center gap-2"
                                >
                                    <IconCheck size={16} /> Approve
                                </button>
                            )}

                            {purchaseOrder.status !== 'cancelled' && (
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="px-4 py-2.5 text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 rounded-xl transition-colors flex items-center gap-2"
                                >
                                    <IconX size={16} /> Cancel PO
                                </button>
                            )}
                        </>
                    ) : (
                        <button
                            type="submit"
                            disabled={processing || data.items.length === 0}
                            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {processing ? "Saving..." : mode === 'amend' ? "Save Amendment" : "Create PO"}
                        </button>
                    )}
                </div>
            </form>
        </Modal>
    );
}
