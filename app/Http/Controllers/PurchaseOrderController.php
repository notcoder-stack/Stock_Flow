<?php

namespace App\Http\Controllers;

use App\Models\Purchase_Order;
use App\Http\Requests\StorePurchase_OrderRequest;
use App\Http\Requests\UpdatePurchase_OrderRequest;
use App\Services\PurchaseOrderService;
use Illuminate\Http\Request;

class PurchaseOrderController extends Controller
{
    protected PurchaseOrderService $service;

    public function __construct(PurchaseOrderService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        return response()->json(Purchase_Order::with('items')->get());
    }

    public function store(StorePurchase_OrderRequest $request)
    {
        $data = $request->validated();
        
        // Example Duplicate detection (expects 'items' in request)
        if (isset($data['items']) && isset($data['supplier_id'])) {
            $productIds = collect($data['items'])->pluck('product_id')->toArray();
            $duplicates = $this->service->findPotentialDuplicates($data['supplier_id'], $productIds);
            
            if ($duplicates->isNotEmpty() && !$request->boolean('ignore_duplicates')) {
                return response()->json([
                    'message' => 'Potential duplicate Purchase Orders found.',
                    'duplicates' => $duplicates,
                    'requires_confirmation' => true
                ], 409);
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

        return response()->json($po->load('items'), 201);
    }

    public function show(Purchase_Order $purchase_Order)
    {
        return response()->json($purchase_Order->load(['items', 'amendments']));
    }

    public function approve(Purchase_Order $purchase_Order, Request $request)
    {
        $this->service->approve($purchase_Order, $request->user()?->id ?? 'manager');
        return response()->json($purchase_Order);
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

        return response()->json($purchase_Order->load(['items', 'amendments']));
    }

    public function cancel(Purchase_Order $purchase_Order)
    {
        $this->service->cancel($purchase_Order);
        return response()->json($purchase_Order);
    }

    public function destroy(Purchase_Order $purchase_Order)
    {
        $purchase_Order->delete();
        return response()->json(null, 204);
    }
}
