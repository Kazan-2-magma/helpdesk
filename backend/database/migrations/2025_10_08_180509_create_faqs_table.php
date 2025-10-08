<?php

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
        Schema::create('faqs', function (Blueprint $table) {
            $table->id();
            $table->string("question",255);
            $table->text("answer");
            $table->foreignId("category_id")->constrained("categories");
            $table->index(["category_id"]);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('faqs');
    }
};



// Table faqs {
//   id integer [pk,not null,increment]
//   question varchar(255) [not null]
//   answer varchar(255) [not null]
//   category_id integer [ref :> category.id]
//   created_at datetime 
//   updated_at datetime
  

//   indexes {
//     category_id 
//   }
// }