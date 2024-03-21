<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Models\Brand;
use Illuminate\Http\Response;

class BrandsController extends Controller
{
    
    public function index(Request $request)
    {
        $pageSize = $request->limit ?? 50;
        $page = $request->page ?? 1;
        $orderBy = $request->order_by ?? 'id'; 
        $sort = $request->sort ?? 'desc';
      
        $brands = Brand::where(
                            function($query) use ($request) {
                                if($request->has('name')){
                                    $query->where('name', 'LIKE', "%{$request->name}%");
                                }
                                
                                if($request->has('short_name')){
                                    $query->where('short_name', 'LIKE', "%{$request->short_name}%");
                                }
                            })
                            ->orderBy($orderBy, $sort)
                            ->paginate($pageSize, page: $page);
      
        return response()->json( [
        'status' => 1,
          'brands' => $brands->items(),
          'meta' => [
            'page' => $brands->currentPage(),
            'pages' => $brands->lastPage(),  
            'limit' => $brands->perPage(),
            'total' => $brands->total(),
          ]
        ], Response::HTTP_OK);
    }
  
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'handle' => 'unique:brands'
        ], [
            'handle.unique' => 'El handle ya está en uso'
        ]);

        $handle = $request->handle;
        if(!$handle) $handle = $this->generateHandle($request->name);

        if(Brand::where('handle', $handle)->first())  return response()->json(['status' => 0, 'message' => 'El handle ya está en uso, proporcione uno'], Response::HTTP_UNPROCESSABLE_ENTITY);

        $brand = new Brand;
        $brand->name = $request->name;
        $brand->handle = strtolower($handle);
        $brand->short_name = $request->short_name ?? '';
        $brand->description = $request->description ?? null;
        $brand->image = $request->image ?? null;
        $brand->save();

        return response()->json(['status' => 1, 'id' =>  $brand->id], Response::HTTP_CREATED);
        
    }

    private function generateHandle($name){
        $handle = str_replace(' ', '-', $name);
        return $handle;
    }

   
    public function show($id)
    {
        $brand = Brand::find($id);

        if(!$brand) return response()->json(['status' => 0, 'message' => 'Marca no encontrada'], Response::HTTP_NOT_FOUND);

        return response($brand); 
    }


    public function update(Request $request, $id)
    {
        $brand = Brand::find($id);
    
        if(!$brand)  return response()->json(['status' => 0, 'message' => 'Marca no encontrada'], Response::HTTP_NOT_FOUND);

        $data = $request->validate([
            'name' => 'required',
            'handle' => ['unique:brands', Rule::unique('brands')->ignore($brand->id)],
            ], [
                'handle.unique' => 'El handle está en uso por otra marca' 
            ] 
        );
        
        $brand->update($data);

        return response()->json(['status' => 1, 'message' => 'Marca actualizada correctamente'], Response::HTTP_OK);
    }

    public function destroy($id)
    {
        $brand = Brand::find($id);

        if(!$brand) return response()->json(['status' => 0, 'message' => 'Marca no encontrada'], Response::HTTP_NOT_FOUND);

        $brand->delete();

        return response()->json(['status' => 1, 'message' => 'Marca eliminada correctamente'], Response::HTTP_OK);
    }
}
