<?php


namespace App\Enums;


enum StatusEnum : string {

    case OPEN = "open";
    case RESOLVED = "resolved";
    case CLOSED = "closed";
}
