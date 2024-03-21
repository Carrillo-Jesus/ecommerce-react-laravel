<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'sku',
        'description',
        'cost',
        'price',
        'handle',
        'stock',
        'stock_alert',
        'brand_id',
        'collection_id',
        'featured',
        'tax_rate',
        'shipping_required',
        'free_shipping',
        'images',
        'thumbnail',
        'is_active',
        'is_giftcard',
        'deleted_at',
        'created_at', 'update_at',
    ];

    protected $casts = [
        'shipping_required' => 'boolean',
        'is_giftcard' => 'boolean',
        'is_active' => 'boolean',
        'free_shipping' => 'boolean',
        'featured' => 'boolean',
    ];

    public function categories()
    {
        return $this->belongsToMany(Category::class, 'category_product');
    }

    public function brands(){
        return $this->BelongsTo(Brand::class);
    }

    public function collections(){
        return $this->BelongsTo(Collection::class);
    }

}
