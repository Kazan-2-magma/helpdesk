<?php

namespace App\Http\Resources;

use App\Enums\StatusEnum;
use App\Models\Ticket;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\CommentResource;

class TicketResource extends JsonResource
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
            "title" => $this->title,
            "description" => $this->description,
            "priority" => $this->priority,
            "status" => $this->status,
            "created" => Carbon::parse($this->created_at)->format("d M,Y"),
            "comments" => CommentResource::collection($this->whenLoaded("comments")),
            // "totalTickets" => count(Ticket::all()),
            // "totalOpen" => count(Ticket::where("status",StatusEnum::OPEN)->get()),
            // "totalClosed" => count(Ticket::where("status",StatusEnum::CLOSED)->get()),
            // "totalResolved" => count(Ticket::where("status",StatusEnum::RESOLVED)->get()),
            "includes" => [
                "user" => new UserResource($this->whenLoaded("user")),
                "agent" => new UserResource($this->whenLoaded("agent")),
                "category" => new CategoryResource($this->whenLoaded("category")),
            ]
        ];
    }
}
