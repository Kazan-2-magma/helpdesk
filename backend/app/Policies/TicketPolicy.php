<?php

namespace App\Policies;

use App\Http\Permissions\Abilities;
use App\Models\Ticket;
use App\Models\User;


class TicketPolicy
{

    public function __construct() {}

    public function view(User $user, Ticket $ticket)
    {
        if ($user->tokenCan(Abilities::ViewTicket)) {
            return true;
        } else if ($user->tokenCan(Abilities::ViewOwnTicket)) {
            return $user->id === $ticket->user_id || $user->id === $ticket->agent_id;
        }
        return false;
    }

    public function update(User $user, Ticket $ticket)
    {
        if ($user->tokenCan(Abilities::UpdateTicket)) {
            return true;
        } else if ($user->tokenCan(Abilities::UpdateOwnTicket)) {
            return $user->id === $ticket->user_id;
        }
        return false;
    }

    public function store(User $user)
    {
        return $user->tokenCan(Abilities::CreateOwnTicket) || $user->tokenCan(Abilities::CreateTicket);
    }

    public function delete(User $user, Ticket $ticket)
    {
        if ($user->tokenCan(Abilities::DeleteTicket)) {
            return true;
        } else if ($user->tokenCan(Abilities::DeleteOwnTicket)) {
            return $user->id === $ticket->user_id;
        }
        return false;
    }
}
