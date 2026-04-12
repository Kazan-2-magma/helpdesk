<?php

namespace App\Models;

use App\Http\Filters\V1\QueryFilters;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        "name",
    ];

    public function scopeFilter(Builder $builder,QueryFilters $queryFilters){
        return $queryFilters->apply($builder);
    }
}

