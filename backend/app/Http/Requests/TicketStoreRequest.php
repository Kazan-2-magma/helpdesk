<?php

namespace App\Http\Requests;

use App\Enums\PriorityEnum;
use App\Enums\StatusEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rules\Enum;

class TicketStoreRequest extends ApiRequest
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
            "title" => "required|string",
            "description" => "required|string",
            'status' => ['required', new Enum(StatusEnum::class)],
            'priority' => ['required', new Enum(PriorityEnum::class)],
            "user_id" => "required|integer|exists:users,id",
            "category_id" => "required|integer|exists:categories,id"
        ];
    }
}
