<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Models\Category;
use Illuminate\Validation\Rule;
use App\Services\HandleGenerator;
use Illuminate\Support\Carbon;

class CategoriesController extends Controller
{

    public function index(Request $request)
    {
        $pageSize = $request->limit ?? 50;
        $page = $request->page ?? 1;
        $orderBy = $request->order_by ?? 'id';
        $sort = $request->sort ?? 'desc';

        $categories = Category::where(
                            function($query) use ($request) {
                                if($request->has('search')){
                                    $query->where('name', 'LIKE', "%{$request->seacrh}%")
                                    ->orWhere('short_name', 'LIKE', "%{$request->search}%");
                                }
                            })
                            ->whereNull('deleted_at')
                            ->orderBy($orderBy, $sort)
                            ->paginate($pageSize, page: $page);

        return response()->json( [
        'status' => 1,
          'categories' => $categories->items(),
          'meta' => [
            'page' => $categories->currentPage(),
            'pages' => $categories->lastPage(),
            'limit' => $categories->perPage(),
            'total' => $categories->total(),
          ]
        ], Response::HTTP_OK);
    }


    public function store(Request $request, HandleGenerator $generator)
    {
        $request->validate([
            'name' => 'required',
            'handle' => 'unique:categories',
        ], [
            'handle.unique' => 'El handle ya está en uso',
            'name.required' => 'Proporcione un nombre',
        ]);

        if ($request->hasFile('image')) {
            $request->validate([
                'image' => 'image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            ], [
                'image.image' => 'El archivo debe ser una imagen válida (jpeg, png, jpg, gif, webp).',
                'image.mimes' => 'El archivo debe tener uno de los siguientes formatos: jpeg, png, jpg, gif, web.',
                'image.max' => 'El tamaño del archivo no debe superar los 2 MB.',
            ]);
        }


        $results = $generator->generate($request->only(['name', 'handle']), new Category);

        if( $results['data'] ) return response()->json(['status' => 0, 'message' => 'El handle ya está en uso, proporcione uno'], Response::HTTP_UNPROCESSABLE_ENTITY);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $name =  'image' . uniqid() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('images/categories/'), $name);
            $imagePath  = $name;
        }

        $category = new Category;
        $category->name = $request->name;
        $category->handle = $results['handle'];
        $category->short_name = $request->short_name ?? '';
        $category->description = $request->description ?? null;
        $category->image = $imagePath;
        $category->save();

        return response()->json(['status' => 1, 'id' =>  $category->id], Response::HTTP_CREATED);

    }

    public function show($id)
    {
        $category = Category::find($id);

        if(!$category) return response()->json(['status' => 0, 'message' => 'Categoría no encontrada'], Response::HTTP_NOT_FOUND);

        return response($category);
    }

    public function update(Request $request, $id)
    {
        $category = Category::find($id);

        if(!$category)  return response()->json(['status' => 0, 'message' => 'categoría no encontrada'], Response::HTTP_NOT_FOUND);

        $request->validate([
            'name' => 'required',
            'handle' => Rule::unique('categories')->ignore($category->id, 'id'),

            ], [
                'handle.unique' => 'El handle está en uso por otra categoría',
                'name.required' => 'Proporcione un nombre',
            ]
        );

        $category->update($request->all());

        return response()->json(['status' => 1, 'message' => 'Categoría actualizada correctamente'], Response::HTTP_OK);
    }

    public function destroy($id)
    {
        $category = Category::find($id);

        if(!$category) return response()->json(['status' => 0, 'message' => 'Categoría no encontrada'], Response::HTTP_NOT_FOUND);

        $category->deleted_at = Carbon::now();

        $category->save();

        return response()->json(['status' => 1, 'message' => 'Categoría eliminada correctamente'], Response::HTTP_OK);
    }
}
