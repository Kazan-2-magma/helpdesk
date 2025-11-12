<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            'Account & Billing',
            'Technical Support',
            'Product Usage',
            'Security & Access',
            'Feedback & Suggestions',
            'Integration & API',
        ];

        foreach ($categories as $name) {
            Category::create(['name' => $name]);
        }
    }
}
