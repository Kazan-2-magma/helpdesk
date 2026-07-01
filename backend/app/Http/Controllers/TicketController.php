<?php

namespace App\Http\Controllers;

use App\Http\Filters\V1\TicketFilters;
use App\Http\Requests\TicketStoreRequest;
use App\Http\Requests\TicketUpdateRequest;
use App\Http\Resources\TicketResource;
use App\Models\Ticket;
use App\Policies\TicketPolicy;
use Exception;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class TicketController extends ApiController
{

    protected $policyClass = TicketPolicy::class;

    public function index(TicketFilters $ticketFilters)
    {
        return TicketResource::collection(Ticket::filter($ticketFilters)->paginate());
    }

    public function store(TicketStoreRequest $request)
    {
        try {

            $check = $this->isAble("store", Ticket::class);

            Log::info($check);

            $data = $request->validated();

            $data["user_id"] = auth()->id();

            $ticket = Ticket::create($data);

            $ticket->load(["user", "category", "agent"]);

            return $this->success(new TicketResource($ticket), "Ticket added successfully", 201);
        } catch (AuthorizationException $e) {
            return $this->error("You are not authorized to create this", $e->getMessage(), 403);
        } catch (Exception $e) {
            return $this->error("error", $e->getMessage());
        }
    }

    public function show(Ticket $ticket)
    {
        if ($this->include("user")) {
            $ticket = $ticket->load("user");
        }

        if ($this->include("comments")) {
            $ticket = $ticket->load(["comments" => function ($query) {
                $query->with("user")->with("attachments");
            }]);
        }

        return new TicketResource($ticket);
    }


    public function update(TicketUpdateRequest $request, Ticket $ticket)
    {
        try {

            $this->isAble("update", $ticket);

            $ticket->update($request->validated());

            $ticket->load(["user", "category", "agent"]);

            return $this->success(new TicketResource($ticket), "Ticket updated successfully");
        } catch (AuthorizationException $e) {
            return $this->error("You are not authorized to update this ticket", $e->getMessage(), 403);
        } catch (NotFoundHttpException $e) {
            return $this->error("Ticket cannot be found");
        }
    }

    public function destroy(Ticket $ticket)
    {
        try {

            $ticket = Ticket::findOrFail($ticket->id);
            $this->isAble("delete", $ticket);
            $ticket->delete();
            return $this->success(null, "Ticket deleted successfully");
        } catch (ModelNotFoundException $e) {
            Log::info("ldkfld");
        }
    }

    public function userTickets(TicketFilters $filters)
    {
        try {
            Log::info("dkfdk");
            $userId = auth()->id();
            return TicketResource::collection(
                Ticket::where('user_id', $userId)
                    ->filter($filters)
                    ->paginate()
            );
        } catch (Exception $e) {
            Log::info($e->getMessage());
        }
    }

    public function agentTickets(TicketFilters $filters)
    {
        try {
            $agentId = auth()->id();
            return TicketResource::collection(
                Ticket::where('agent_id', $agentId)
                    ->filter($filters)
                    ->paginate()
            );
        } catch (Exception $e) {
            Log::info($e->getMessage());
        }
    }
}
