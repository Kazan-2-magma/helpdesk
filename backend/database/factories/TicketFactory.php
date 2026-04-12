<?php

namespace Database\Factories;

use App\Enums\PriorityEnum;
use App\Enums\StatusEnum;
use App\Enums\UserRole;
use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Ticket>
 */
class TicketFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->sentence(),
            'description' => fake()->paragraph(),
            'priority' => fake()->randomElement(PriorityEnum::cases())->value,
            'status' => fake()->randomElement(StatusEnum::cases())->value,
            'user_id' => User::inRandomOrder()->first()->id,
            'category_id' => Category::inRandomOrder()->first()->id,
            'agent_id' => fake()->optional(0.5)->randomElement(User::where('role', UserRole::AGENT->value)->pluck('id')->toArray()),
        ];
    }
}