<?php

namespace App\Http\Controllers;

use App\Models\Purchase_Order;
use App\Http\Requests\StorePurchase_OrderRequest;
use App\Http\Requests\UpdatePurchase_OrderRequest;
use App\Services\PurchaseOrderService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PurchaseOrderController extends Controller
{
    protected PurchaseOrderService $service;

    public function __construct(PurchaseOrderService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        $purchaseOrders = Purchase_Order::with(['items', 'amendments', 'items.product'])->latest()->paginate(10);
        $suppliers = \App\Models\Supplier::all();
        $products = \App\Models\Product::all();
        
        return Inertia::render('PurchaseOrders', [
            'purchaseOrders' => $purchaseOrders,
            'suppliers' => $suppliers,
            'products' => $products
        ]);
    }

    public function store(StorePurchase_OrderRequest $request)
    {
        $data = $request->validated();
        
        // Example Duplicate detection (expects 'items' in request)
        if (isset($data['items']) && isset($data['supplier_id'])) {
            $productIds = collect($data['items'])->pluck('product_id')->toArray();
            $duplicates = $this->service->findPotentialDuplicates($data['supplier_id'], $productIds);
            
            if ($duplicates->isNotEmpty() && !$request->boolean('ignore_duplicates')) {
                return redirect()->back()->withErrors([
                    'duplicates' => 'Potential duplicate Purchase Orders found.'
                ]);
            }
        }

        // Create PO
        $po = Purchase_Order::create([
            'supplier_id' => $data['supplier_id'],
            'status' => 'draft',
            'ordered_at' => now(),
            'notes' => $data['notes'] ?? null,
            'created_by' => $request->user()?->id ?? 'system',
            'is_template' => $request->boolean('is_template', false),
            'recurrence_interval' => $data['recurrence_interval'] ?? null,
        ]);

        if (isset($data['items'])) {
            foreach ($data['items'] as $item) {
                $po->items()->create($item);
            }
        }

        if (!$po->is_template) {
            $this->service->submit($po);
        }

        return redirect()->back()->with('success', 'Purchase order created successfully.');
    }

    public function show(Purchase_Order $purchase_Order)
    {
        return Inertia::render('PurchaseOrders/Show', [
            'purchaseOrder' => $purchase_Order->load(['items.product', 'amendments', 'receipts'])
        ]);
    }

    public function approve(Purchase_Order $purchase_Order, Request $request)
    {
        $this->service->approve($purchase_Order, $request->user()?->id ?? 'manager');
        return redirect()->back()->with('success', 'Purchase order approved.');
    }

    public function amend(Purchase_Order $purchase_Order, Request $request)
    {
        $request->validate([
            'reason' => 'required|string',
            'items' => 'required|array',
        ]);

        $this->service->amend(
            $purchase_Order, 
            $request->user()?->id ?? 'system', 
            $request->input('reason'), 
            $request->input('items')
        );

        return redirect()->back()->with('success', 'Purchase order amended.');
    }

    public function cancel(Purchase_Order $purchase_Order)
    {
        $this->service->cancel($purchase_Order);
        return redirect()->back()->with('success', 'Purchase order cancelled.');
    }

    public function destroy(Purchase_Order $purchase_Order)
    {
        $purchase_Order->delete();
        return redirect()->back()->with('success', 'Purchase order deleted.');
    }
}
