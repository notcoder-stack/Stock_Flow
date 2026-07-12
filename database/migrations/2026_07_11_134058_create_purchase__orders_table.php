<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('purchase__orders', function (Blueprint $table) {
            $table->id();
            $table->enum('status', ['draft', 'submitted', 'partially_received', 'fully_received', 'closed', 'cancelled']);
            $table->foreignId('supplier_id')->constrained('suppliers')->cascadeOnDelete();
            $table->dateTime('ordered_at');
            $table->dateTime('received_at')->nullable();
            $table->text('notes')->nullable();
            $table->string('created_by');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchase__orders');
    }
};
