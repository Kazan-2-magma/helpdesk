<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\FaqController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware("admin")->prefix("admin")->group(function (){

    Route::apiResource("faqs", FaqController::class);
    Route::apiResource("categories",CategoryController::class);
    Route::apiResource("users",UserController::class);
});

Route::apiResource("tickets", TicketController::class);

