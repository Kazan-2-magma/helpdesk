<?php

namespace App\Http\Filters\V1;

use Illuminate\Support\Facades\Log;

class CategoriyFilter extends QueryFilters{

    public function include($value){
        $this->builder->with($value);
    }


    public function category($value)
    {
        // Replace * with % for SQL wildcard
        $likeStr = str_replace('*', '%', $value);

        // Ensure it starts and ends with % if user didn't include them
        if (!str_starts_with($likeStr, '%')) {
            $likeStr = '%' . $likeStr;
        }
        if (!str_ends_with($likeStr, '%')) {
            $likeStr = $likeStr . '%';
        }

        return $this->builder->where(function($query) use ($likeStr){
            $query->where("name","like",$likeStr);
        });
    }

    public function createdAt($value){
        $dates = explode(",",$value);

        if(count($dates) > 1){
            return $this->builder->whereBetween("created_at",$dates);
        }
        return $this->builder->whereDate("created_at",$value); 
    }
}
