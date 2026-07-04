<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\Tenantable;

class Product extends Model
{
    /** @use HasFactory<\Database\Factories\ProductFactory> */
    use HasFactory, Tenantable;
    protected $fillable = [
        "user_id",
        "name",
        "price",
        "stockQuantity",
        "rating",
        "image",
        "image_original_name",
    ];
}
