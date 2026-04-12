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

            $ticket = Ticket::create($data);

            return $this->success($ticket, "Ticket added successfully");
        } catch (Exception $e) {
            $this->error("error", $e->getMessage());
        } catch (AuthorizationException $e) {
            $this->error("You are not authorized to create this", $e->getMessage(), 401);
        }
    }

    public function show(Ticket $ticket)
    {
        if ($this->include("user")) {
            return new TicketResource($ticket->load("user"));
        }

        return new TicketResource($ticket);
    }


    public function update(TicketUpdateRequest $request, Ticket $ticket)
    {
        try {

            $this->isAble("update", $ticket);

            $ticket->update($request->validated());

            return $this->success($ticket, "Ticket updated successfully");
        } catch (NotFoundHttpException $e) {

            return $this->error("Ticket connot be found");
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
        try{
            Log::info("dkfdk");
            $userId = auth()->id();
            return TicketResource::collection(
                Ticket::where('user_id', $userId)
                    ->filter($filters)
                    ->paginate()
            );
        }catch(Exception $e){
            Log::info($e->getMessage());
        }
    }
}
