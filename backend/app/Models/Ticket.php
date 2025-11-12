<?php

namespace App\Models;

use App\Http\Filters\V1\QueryFilters;
use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Ticket extends Model
{
    use HasFactory;

    protected $fillable = [
        "title",
        "description",
        "priority",
        "status",
        "user_id",
        "agent_id",
        "category_id",
    ];

    // protected $casts = [
    //     "status" => StatusEnum::class,
    //     "priority" => PriorityEnum::class
    // ];

    public function user() : BelongsTo {
        return $this->belongsTo(User::class);
    }
    public function category() : BelongsTo {
        return $this->belongsTo(Category::class);
    }
    public function agent() : BelongsTo {
        return $this->belongsTo(User::class,"agent_id");
    }

    public function scopeFilter(Builder $builder, QueryFilters $filter)
    {
        return $filter->apply($builder);
    }

}
