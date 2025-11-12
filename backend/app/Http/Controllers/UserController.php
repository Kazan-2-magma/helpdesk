<?php

namespace App\Http\Controllers;

use App\Http\Filters\V1\UserFilters;
use App\Http\Requests\UserStoreRequest;
use App\Http\Requests\UserUpdateRequest;
use App\Http\Resources\UserResource;
use App\Models\Faq;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class UserController extends ApiController
{
    /**
     * Display a listing of the resource.
     */

    
    public function index(UserFilters $userFilters)
    {
        return UserResource::collection(User::filter($userFilters)->paginate());
    }


    public function store(UserStoreRequest $request)
    {
        $validatedData = $request->validated();

        $validatedData["password"] = Hash::make($validatedData["password"]);

        $user = User::create($validatedData);

        return $this->success(new UserResource($user),"User Created Successsfully");
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }



    public function update(UserUpdateRequest $request, User $user)
    {
        $user->update($request->validated());

        return $this->success(new UserResource($user),"User Updated Successfully");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        if(!$user){
            return $this->error("Error","User Not exists");
        }

        $user->delete();
        return $this->success("User Deleted Successfully");
    }
}
