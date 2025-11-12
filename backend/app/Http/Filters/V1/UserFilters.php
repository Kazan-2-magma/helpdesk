<?php 

namespace App\Http\Filters\V1;

class UserFilters extends QueryFilters {

    public function include($value){
        return $this->builder->with($value);
    }

    public function userFilter($value){

        $likeStr = str_replace("*","%",$value);

        if(!str_starts_with($likeStr,"%")){
            $likeStr = '%' . $likeStr;
        }

        if(!str_ends_with($likeStr,"%")){
            $likeStr = $likeStr . '%';
        }

        return $this->builder->where(function($query) use ($likeStr){
            $query->where("name","like",$likeStr)
            ->orWhere("email","like",$likeStr)
            ->orWhere("role","like",$likeStr);
        });

    }

    public function role($value){
        return $this->builder->where("role", "=" , $value);
    }
}