<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Collection;
use Illuminate\Http\Response;
use Illuminate\Validation\Rule;

class CollectionsController extends Controller
{
 
    public function index(Request $request)
    {
        $pageSize = $request->limit ?? 15;
        $page = $request->page ?? 1;
        $orderBy = $request->order_by ?? 'id'; 
        $sort = $request->sort ?? 'desc';
      
        $collections = Collection::where(
                            function($query) use ($request) {
                                if($request->has('name')){
                                    $query->where('name', 'LIKE', "%{$request->name}%");
                                }
                            })
                            ->orderBy($orderBy, $sort)
                            ->paginate($pageSize, page: $page);
      
        return response()->json( [
        'status' => 1,
          'collections' => $collections->items(),
          'meta' => [
            'page' => $collections->currentPage(),
            'pages' => $collections->lastPage(),  
            'limit' => $collections->perPage(),
            'total' => $collections->total(),
          ]
        ], Response::HTTP_OK);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'handle' => 'unique:collections'
        ], [
            'handle.unique' => 'El handle ya está en uso'
        ]);

        $handle = $request->handle;
        if($handle == '') $handle = $this->generateHandle($request->name);

        if(Collection::where('handle', $handle)->first())  return response()->json(['status' => 0, 'message' => 'El handle ya está en uso, proporcione uno'], Response::HTTP_UNPROCESSABLE_ENTITY);

        $collection = new Collection;
        $collection->name = $request->name;
        $collection->handle = strtolower($handle);
        $collection->description = $request->description ?? null;
        $collection->image = $request->image ?? null;
        $collection->is_active = $request->is_active ?? 1;
        $collection->save();

        return response()->json(['status' => 1, 'id' =>  $collection->id], Response::HTTP_CREATED);
        
    }

    private function generateHandle($name){
        $handle = str_replace(' ', '-', $name);
        return $handle;
    }

    public function show($id)
    {
        $collection = Collection::find($id);

        if(!$collection) return response()->json(['status' => 0, 'message' => 'Colección no encontrada'], Response::HTTP_NOT_FOUND);

        return response($collection); 
    }

    public function update(Request $request, $id)
    {
        $collection = Collection::find($id);
    
        if(!$collection)  return response()->json(['status' => 0, 'message' => 'Colección no encontrada'], Response::HTTP_NOT_FOUND);

        $data = $request->validate([
            'name' => 'required',
            'handle' => ['unique:collections', Rule::unique('collections')->ignore($collection->id)],
            ], [
                'handle.unique' => 'El handle está en uso por otra marca' 
            ] 
        );
        
        $collection->update($data);

        return response()->json(['status' => 1, 'message' => 'Colección actualizada correctamente'], Response::HTTP_OK);
    }

    public function destroy($id)
    {
        $collection = Collection::find($id);

        if(!$collection) return response()->json(['status' => 0, 'message' => 'Colección no encontrada'], Response::HTTP_NOT_FOUND);

        $collection->delete();

        return response()->json(['status' => 1, 'message' => 'Colección eliminada correctamente'], Response::HTTP_OK);
    }
}
