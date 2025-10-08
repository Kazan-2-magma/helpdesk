<?php

namespace App\Models;

use App\Enums\PriorityEnum;
use App\Enums\StatusEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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

    protected $casts = [
        "status" => StatusEnum::class,
        "priority" => PriorityEnum::class
    ];


}
