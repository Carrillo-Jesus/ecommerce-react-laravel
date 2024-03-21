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
        Schema::create('sales', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->id();
            $table->date('date');
            $table->string('ref');
            $table->foreignId('user_id')->nullable()->constrained('users')->restrictOnDelete();
            $table->enum('payment_state', ['pending', 'paid', 'cancelled'])->default('pending');
            $table->decimal('discount', 8, 2)->default(0);
            $table->decimal('shipping', 8, 2)->default(0);
            $table->decimal('total', 8, 2)->default(0);
            $table->timestamps();
            $table->softDeletes();
            
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sales');
    }
};
