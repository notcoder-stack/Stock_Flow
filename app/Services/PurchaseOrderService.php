<?php

namespace App\Services;

use App\Models\Purchase_Order;
use App\Models\PurchaseOrderAmendment;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Exception;

class PurchaseOrderService
{
    /**
     * Threshold for manager approval.
     */
    protected $approvalThreshold = 1000.00;

    /**
     * Submit a PO for approval or automatically approve it.
     */
    public function submit(Purchase_Order $po)
    {
        if ($po->getTotal() >= $this->approvalThreshold) {
            $po->approval_status = 'pending';
            $po->status = 'submitted'; // Or keep it as draft depending on business logic
        } else {
            $po->approval_status = 'not_required';
            $po->status = 'submitted';
        }
        
        $po->save();
        return $po;
    }

    /**
     * Approve a PO.
     */
    public function approve(Purchase_Order $po, $approverId)
    {
        $po->approval_status = 'approved';
        $po->approved_by = $approverId;
        $po->approved_at = now();
        $po->status = 'submitted';
        $po->save();
        
        return $po;
    }

    /**
     * Amend an existing PO.
     */
    public function amend(Purchase_Order $po, $amenderId, string $reason, array $newItemsData)
    {
        // Must be done in a transaction
        return DB::transaction(function () use ($po, $amenderId, $reason, $newItemsData) {
            // Create a snapshot
            $snapshotData = [
                'po' => $po->toArray(),
                'items' => $po->items->toArray(),
            ];

            PurchaseOrderAmendment::create([
                'purchase_order_id' => $po->id,
                'amended_by' => $amenderId,
                'reason' => $reason,
                'previous_data' => $snapshotData,
            ]);

            // Clear old items and recreate (or update existing)
            $po->items()->delete();
            foreach ($newItemsData as $itemData) {
                $po->items()->create($itemData);
            }

            // Update PO total or any other relevant info if needed
            // If the new total is above threshold, we might need re-approval:
            if ($po->getTotal() >= $this->approvalThreshold) {
                $po->approval_status = 'pending';
                // Need a manager to approve the amendment
            }

            $po->save();
            return $po;
        });
    }

    /**
     * Cancel a PO.
     */
    public function cancel(Purchase_Order $po)
    {
        // If some items were already received
        $hasReceipts = $po->receipts()->exists();

        if ($hasReceipts) {
            $po->status = 'partially_cancelled';
        } else {
            $po->status = 'cancelled';
        }
        
        $po->save();
        return $po;
    }

    /**
     * Check for recent duplicates.
     */
    public function findPotentialDuplicates($supplierId, array $productIds, $days = 7)
    {
        $recentThreshold = Carbon::now()->subDays($days);
        
        return Purchase_Order::where('supplier_id', $supplierId)
            ->where('created_at', '>=', $recentThreshold)
            ->whereHas('items', function ($query) use ($productIds) {
                $query->whereIn('product_id', $productIds);
            })
            ->get();
    }
}
