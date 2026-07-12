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
        'approval_status',
        'approved_by',
        'approved_at',
        'is_template',
        'recurrence_interval',
        'next_run_at',
    ];

    protected function casts(): array
    {
        return [
            'ordered_at' => 'datetime',
            'received_at' => 'datetime',
            'approved_at' => 'datetime',
            'next_run_at' => 'datetime',
            'is_template' => 'boolean',
        ];
    }

    public function items()
    {
        return $this->hasMany(PurchaseOrderItem::class, 'purchase_order_id');
    }

    public function receipts()
    {
        return $this->hasMany(PurchaseOrderReceipt::class, 'purchase_order_id');
    }

    public function amendments()
    {
        return $this->hasMany(PurchaseOrderAmendment::class, 'purchase_order_id');
    }

    public function getTotal()
    {
        return $this->items->sum(function ($item) {
            return $item->quantity_ordered * $item->unit_cost;
        });
    }

    public function scopeTemplates($query)
    {
        return $query->where('is_template', true);
    }
}
