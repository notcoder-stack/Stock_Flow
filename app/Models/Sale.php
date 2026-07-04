<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\Tenantable;

class Sale extends Model
{
    /** @use HasFactory<\Database\Factories\SaleFactory> */
    use HasFactory, Tenantable;
    protected $fillable = [
        "user_id",
        "productName",
        "quantity",
        "price",
        "revenue",
        "date",
    ];
}
