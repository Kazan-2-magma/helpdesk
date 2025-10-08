<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{

    use ApiResponse;


    public function login(LoginRequest $request){

        $validateData = $request->validated();


        $user = User::where("email",$validateData["email"],)->first();

        if(!$user || !Hash::check($validateData["password"],$user->password)){
            return $this->error("error", "Invalid email or password",401);
        }

        $token = $user->createToken("auh_token")->plainTextToken;

        return $this->success([
            "user" => $user,
            "token" =>$token,
        ]);
    }

    public function logout(Request $request){
        
        $request->user()->currentAccessToken()->delete();

        return $this->success(message: "Logged out successfully");
    }
}
