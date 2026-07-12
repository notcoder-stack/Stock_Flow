<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PurchaseOrderAmendment extends Model
{
    use HasFactory;

    protected $fillable = [
        'purchase_order_id',
        'amended_by',
        'reason',
        'previous_data',
    ];

    protected function casts(): array
    {
        return [
            'previous_data' => 'array',
        ];
    }

    public function purchaseOrder()
    {
        return $this->belongsTo(Purchase_Order::class, 'purchase_order_id');
    }
}
