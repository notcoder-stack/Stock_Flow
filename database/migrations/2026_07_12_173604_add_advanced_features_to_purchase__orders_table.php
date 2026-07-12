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
        Schema::table('purchase__orders', function (Blueprint $table) {
            $table->string('approval_status')->default('not_required');
            $table->string('approved_by')->nullable();
            $table->dateTime('approved_at')->nullable();
            
            $table->boolean('is_template')->default(false);
            $table->string('recurrence_interval')->nullable();
            $table->dateTime('next_run_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('purchase__orders', function (Blueprint $table) {
            $table->dropColumn([
                'approval_status',
                'approved_by',
                'approved_at',
                'is_template',
                'recurrence_interval',
                'next_run_at'
            ]);
        });
    }
};
