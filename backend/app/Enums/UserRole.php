<?php

namespace App\Enums;

enum UserRole :string {

    case AGENT = "agent";
    case USER = "user";
    case ADMIN = "admin";
    
}