<?php

namespace App\Http\Filters\V1;

use Illuminate\Support\Facades\Log;

class FaqFilters extends QueryFilters{

    public function include($value){
        $this->builder->with($value);
    }

    public function category($value){
        return $this->builder->whereIn("category_id",explode(",",$value));
    }

    public function q($value)
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
            $query->where("question","like",$likeStr)
            ->orWhere("answer","like",$likeStr)
            ->orWhereHas("category",function($q) use ($likeStr){
                $q->where("name","like",$likeStr);
            });
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
