<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Purchase_Order extends Model
{
    /** @use HasFactory<\Database\Factories\PurchaseOrderFactory> */
    use HasFactory;

    protected $fillable = [
        'status',
        'supplier_id',
        'ordered_at',
        'received_at',
        'notes',
        'created_by',
    ];

    public function items()
    {
        return $this->hasMany(PurchaseOrderItem::class, 'purchase_order_id');
    }

    public function receipts()
    {
        return $this->hasMany(PurchaseOrderReceipt::class, 'purchase_order_id');
    }
}
