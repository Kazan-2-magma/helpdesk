<?php

namespace App\Traits;


trait ApiResponse
{

    // SUCCESs
    protected function success($data = null, string $message = 'success', int $statusCode = 200)
    {
        $response = [
            'success' => true,
            'message' => $message,
        ];

        if (!is_null($data)) {
            $response['data'] = $data;
        }

        return response()->json($response,$statusCode);
    }


    /// ERROR
    protected function error(string $message = 'error', $errors = null, int $statusCode = 500)
    {
        $response = [
            'success' => false,
            'message' => $message,
        ];

        if (!is_null($errors)) {
            $response['errors'] = $errors;
        }

        return response()->json($response, $statusCode);
    }
}
