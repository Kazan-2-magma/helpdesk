<?php

namespace App\Http\Requests;

use App\Enums\PriorityEnum;
use App\Enums\StatusEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class TicketUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            
            "title" => "sometimes|required|string",
            "description" => "sometimes|required|string",
            'status' => ["sometimes",'required', new Enum(StatusEnum::class)],
            'priority' => ["sometimes",'required', new Enum(PriorityEnum::class)],
            "category_id" => "sometimes|required|exists:categories,id",
            // "user_id" => "required|integer|exists:users,id",
            "category_id" => "sometimes|required|integer|exists:categories,id"
        ];

    }
}
