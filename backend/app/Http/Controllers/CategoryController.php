<?php

namespace App\Http\Controllers;

use App\Http\Filters\V1\CategoriyFilter;
use App\Http\Requests\CategoryStoreRequest;
use App\Http\Requests\CategoryUpdateRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends ApiController
{
    /**
     * Display a listing of the resource.
     */
    public function index(CategoriyFilter $categoriyFilter)
    {
        return CategoryResource::collection(Category::filter($categoriyFilter)->paginate());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CategoryStoreRequest $request)
    {
        $validatedData = $request->validated();

        $category = Category::create($validatedData);

        return $this->success($category, "Category created successfully", 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {
        return new CategoryResource($category);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Category $category)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CategoryUpdateRequest $request, Category $category)
    {
        $category->update($request->validated());

        return $this->success(new CategoryResource($category), "Category updated successfully");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        if (!$category) {
            return $this->error("Error: Category not found");
        }

        $category->delete();

        return $this->success("Category deleted successfully");
    }
}
