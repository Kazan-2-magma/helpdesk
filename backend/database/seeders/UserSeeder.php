<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        /// Admin Demo Data
        User::create([
            "name" => "Admin",
            "email" => "admin@example.com",
            "password" => Hash::make("Admin123!"),
            "role" => UserRole::ADMIN->value,
        ]);

        /// Agent Demo Data
        User::create([
            "name" => "Agent",
            "email" => "agent@example.com",
            "password" => Hash::make("Agent123!"),
            "role" => UserRole::AGENT->value,
        ]);        
        
        /// User Demo Data
        User::create([
            "name" => "user",
            "email" => "user@example.com",
            "password" => Hash::make("User123!"),
            "role" => UserRole::USER->value,
        ]);
    }

}
