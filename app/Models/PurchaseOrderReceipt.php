<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PurchaseOrderReceipt extends Model
{
    protected $fillable = [
        'purchase_order_id',
        'received_by',
        'received_at',
        'notes',
    ];

    public function purchaseOrder()
    {
        return $this->belongsTo(Purchase_Order::class, 'purchase_order_id');
    }

    public function receiptItems()
    {
        return $this->hasMany(PurchaseOrderReceiptItem::class, 'purchase_order_receipt_id');
    }
}
