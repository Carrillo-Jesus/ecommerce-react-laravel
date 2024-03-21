<?php

namespace App\Services;

use Illuminate\Database\Eloquent\Model;

class HandleGenerator
{
    public function generate($data, Model $model)
    {
        $handle = $data['handle'];
        if(!$handle) $handle = $this->generateHandle($data['name']);

        $result = $model->where('handle', $handle)->first();
        return [
            'data' => $result,
            'handle' => $handle 
          ];
    }

    private function generateHandle($name) {
        $handle = strtolower(str_replace(' ', '-', $name));
        return $handle;
    }
}