<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    { 
        
        if (!Schema::hasTable('products')) {
            Schema::create('products', function (Blueprint $table) {
                $table->engine = 'InnoDB';
                $table->id();
                $table->string('name');
                $table->string('handle')->unique();
                $table->string('sku')->unique();
                $table->text('description')->nullable();
                $table->decimal('cost', 8, 2)->default(0.0);
                $table->decimal('price', 8, 2);
                $table->integer('stock');
                $table->integer('stock_alert')->default(10);
                $table->foreignId('brand_id')->nullable()->constrained('brands')->restrictOnDelete();
                $table->boolean('featured')->default(false);
                $table->decimal('tax_rate', 5, 2)->default(0.0);
                $table->boolean('shipping_required')->default(true);
                $table->boolean('free_shipping')->default(false);
                $table->string('images')->nullable();
                $table->string('thumbnail')->default('no_image.png');
                $table->foreignId('collection_id')->nullable()->constrained('collections')->restrictOnDelete();
                $table->boolean('is_active')->default(true);
                $table->boolean('is_giftcard')->default(false);
                $table->timestamps();
                $table->softDeletes();
            });
        }

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('products');
    }
};
