<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = ['name','short_name','description','handle', 'created_at', 'update_at', 'image', 'deleted_at'];

    public function products()
    {
        return $this->belongsToMany(Product::class, 'category_product');
    }
}
