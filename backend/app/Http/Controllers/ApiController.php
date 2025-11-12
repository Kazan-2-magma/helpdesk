<?php

namespace App\Http\Controllers;

use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class ApiController extends Controller
{
    use ApiResponse;

    protected $policyClass;
    
    public function include(string $relationship) : bool {
        
        $param = request()->get("include");

        if(!isset($param)){
            return false;
        }

        $includeValues = explode(",",strtolower($param));

        return in_array(strtolower($relationship),$includeValues);
    }

    public function isAble($abiity,$targetModel){
        return $this->authorize($abiity,[$targetModel,$this->policyClass]);
    }
}
