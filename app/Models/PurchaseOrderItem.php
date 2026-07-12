<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PurchaseOrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'purchase_order_id',
        'product_id',
        'quantity_ordered',
        'quantity_received',
        'unit_cost',
    ];

    public function purchaseOrder()
    {
        return $this->belongsTo(Purchase_Order::class, 'purchase_order_id');
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function receiptItems()
    {
        return $this->hasMany(PurchaseOrderReceiptItem::class, 'purchase_order_item_id');
    }
}
