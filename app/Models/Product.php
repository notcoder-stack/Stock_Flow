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

    public function scopeFilter($query, array $filters)
    {
        $query->when($filters['search'] ?? false, function ($query, $search) {
            $query->where('name', 'like', '%' . $search . '%');
        });

        $query->when($filters['min_rating'] ?? false, function ($query, $minRating) {
            $query->where('rating', '>=', $minRating);
        });

        $query->when($filters['max_price'] ?? false, function ($query, $maxPrice) {
            $query->where('price', '<=', $maxPrice);
        });
    }
}
