<?php

namespace App\Models;

use App\Http\Filters\V1\FaqFilters;
use App\Http\Filters\V1\QueryFilters;
use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Faq extends Model
{
    use HasFactory;

    protected $fillable = [
        "question",
        "answer",
        "category_id",
    ];


    public function category() : BelongsTo {
        return $this->belongsTo(Category::class);
    }

    public function scopeFilter(Builder $builder,QueryFilters $filter){
        return $filter->apply($builder);
    }
}

