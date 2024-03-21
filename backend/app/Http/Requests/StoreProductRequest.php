<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'name' => 'required',
            'sku' => 'required|unique:products',
            'handle' => 'unique:products',
            'price' => 'required',
            'stock' => 'required',
            'thumbnail' => 'required|image|mimes:jpeg,png,jpg,webp,avif|max:2048',
        ];
    }

    public function messages()
    {
        return [
            'sku.unique' => 'El sku ya está en uso',
            'handle.unique' => 'El handle ya está en uso',
            'name.required' => 'El nombre es obligatorio'
        ];
    }
}
