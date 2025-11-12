<?php

namespace App\Http\Requests;

use App\Traits\ApiResponse;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class ApiRequest extends FormRequest
{

    use ApiResponse;

    protected function failedValidation(Validator $validator)
    {

        throw new HttpResponseException(
            $this->error(
                "Validation failed",
                $validator->errors(),
                422
            )
        );
    }
}