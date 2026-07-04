<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;

trait Tenantable
{
    /**
     * Boot the tenantable trait for a model.
     *
     * @return void
     */
    protected static function bootTenantable()
    {
        // Automatically scope queries to the currently authenticated user
        static::addGlobalScope('user_id', function (Builder $builder) {
            if (auth()->check()) {
                $builder->where('user_id', auth()->id());
            }
        });

        // Automatically assign the user_id upon creation
        static::creating(function ($model) {
            if (auth()->check()) {
                $model->user_id = auth()->id();
            }
        });
    }
}
