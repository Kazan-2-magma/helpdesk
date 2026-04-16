<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Attachment extends Model
{
    use HasFactory;

    protected $fillable = [
        "filename",
        "file_path",
        "file_size",
        "mime_type",
        "comment_id",
    ];

    protected $appends = ['url'];

    public function comment(): BelongsTo
    {
        return $this->belongsTo(Comment::class);
    }

    public function getUrlAttribute(): string
    {
        return route('attachments.download', $this->id);
    }
}
