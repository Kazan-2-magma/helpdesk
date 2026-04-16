<?php

namespace App\Http\Permissions;

use App\Enums\UserRole;
use App\Models\User;

final class Abilities
{

    public const CreateTicket = "ticket:create";
    public const UpdateTicket = "ticket:update";
    public const DeleteTicket = "ticket:detele";
    public const ViewTicket = "ticket:view";

    public const CreateOwnTicket = "ticket:own:create";
    public const UpdateOwnTicket = "ticket:own:create";
    public const DeleteOwnTicket = "ticket:own:create";
    public const ViewOwnTicket = "ticket:own:view";

    public const CreateFaq = "faq:create";
    public const UpdateFaq = "faq:update";
    public const DeleteFaq = "faq:delete";

    public const CreateCategory = "category:create";
    public const UpdateCategory = "category:update";
    public const DeleteCategory = "category:delete";
    public const ViewCategory = "category:view";

    public const CreateUser = "user:create";
    public const UpdateUer = "user:update";
    public const DeleteUser = "user:delete";

    // public const AssignTicket = "ticket:"

    public static function getAbilities(User $user)
    {
        if ($user->role === UserRole::ADMIN) {
            return [
                self::CreateTicket,
                self::UpdateTicket,
                self::DeleteTicket,
                self::ViewTicket,
                self::CreateFaq,
                self::UpdateFaq,
                self::DeleteFaq,
                self::CreateUser,
                self::UpdateUer,
                self::DeleteUser,
            ];
        } else if ($user->role === UserRole::AGENT) {
            return [
                self::ViewTicket,
            ];
        } else {
            return [
                self::CreateOwnTicket,
                self::UpdateOwnTicket,
                self::DeleteOwnTicket,
                self::ViewOwnTicket,
                self::ViewCategory,
            ];
        }
    }
}
