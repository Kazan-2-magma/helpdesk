<?php

use App\Enums\PriorityEnum;
use App\Enums\StatusEnum;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->string("title",255);
            $table->text("description");
            $table->string("priority",20)->default(PriorityEnum::MEDIUM->value);
            $table->string("status")->default(StatusEnum::OPEN->value);

            // If a user is deleted >>> delete their tickets.
            $table->foreignId("user_id")
                ->constrained("users")
                ->cascadeOnDelete();

            $table->foreignId("agent_id")
                    ->nullable()
                    ->constrained("users")
                    ->nullOnDelete();

            // If a category is deleted>>> block it until tickets are reassigned.
            $table->foreignId("category_id")
            ->constrained("categories")
            ->restrictOnDelete();

            // indexes (tickets (status, category, created_at)
            $table->index(["status","category_id","created_at"]);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};

