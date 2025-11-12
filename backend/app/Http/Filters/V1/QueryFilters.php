<?php

namespace App\Http\Filters\V1;

use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

abstract class QueryFilters{

    protected $builder;
    protected $request;

    public function __construct(Request $request) {
        $this->request = $request;
    }

    public function filter($arr){
        Log::info('Filter array passed to filter():', $arr);
        foreach($arr as $key => $value){
            
            if(method_exists($this,$key)){
                Log::info("Applying filter: {$key} => {$value}");
                $this->$key($value);
            }else {
                Log::warning("Unknown filter: {$key}");
            }

        }
        return $this->builder;
    }

    public function apply(Builder $builder){
        $this->builder = $builder;

        foreach($this->request->all() as $key => $value){
            if(method_exists($this,$key)){
                $this->$key($value);
            }
        }

        return $this->builder;
    }

}

