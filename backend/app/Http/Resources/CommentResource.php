<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CommentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id" => $this->id,
            "message" => $this->message,
            "user_id" => $this->user_id,
            "ticket_id" => $this->ticket_id,
            "user_name" => $this->user?->name,
            "user" => new UserResource($this->whenLoaded("user")),
            "attachments" => AttachmentResource::collection($this->whenLoaded("attachments")),
            "created_at" => $this->created_at->toIso8601String(),
        ];
    }
}
