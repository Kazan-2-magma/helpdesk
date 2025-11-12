<?php

namespace App\Http\Controllers;

use App\Http\Filters\V1\FaqFilters;
use App\Http\Requests\FaqStoreRequest;
use App\Http\Requests\FaqUpdateRequest;
use App\Http\Resources\FaqResource;
use App\Models\Faq;


class FaqController extends ApiController
{

    public function index(FaqFilters $filters)
    {
        return FaqResource::collection(Faq::filter($filters)->paginate());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(FaqStoreRequest $request)
    {
        $validatedData = $request->validated();

        $faq = Faq::updateOrCreate($validatedData);

        return $this->success($faq, "FAQ created successfully", 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Faq $faq)
    {
        if ($this->include("category")) {
            return new FaqResource($faq->load("category"));
        }

        return new FaqResource($faq);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(FaqUpdateRequest $request, Faq $faq)
    {
        $faq->update($request->validated());

       
        $faq->load('category');

        
        return $this->success(new FaqResource($faq), "FAQ updated successfully");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Faq $faq)
    {
        if(!$faq){
            return $this->error("Error : Faq Not found");
        }
        $faq->delete();
        return $this->success("Faq deleted successfully");
    }
}
