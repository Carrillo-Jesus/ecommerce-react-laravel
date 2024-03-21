<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\StoreProductRequest;
use App\Services\HandleGenerator;
use App\Services\ImageUploader;
use App\Models\Product;
use App\Models\Brand;
use Illuminate\Http\Response;
use Illuminate\Validation\Rule;
class ProductsController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index(Request $request)
    {

        $pageSize = $request->limit ?? 15;
        $page = $request->page ?? 1;
        $orderBy = $request->order_by ?? 'id';
        $sort = $request->sort ?? 'asc';

        $products = Product::where('deleted_at', null);

        if($request->has('search') && !empty($request->search)){
            $products->where(function($query) use ($request) {
                $query->where('name', 'LIKE', "%{$request->search}%")
                    ->orWhere('sku', 'LIKE', "%{$request->search}%");
            });
        }

        if($request->has('brand_id') && !empty($request->brand_id)){
            $products->where('brand_id', $request->brand_id);
        }

        if($request->has('collection_id') && !empty($request->collection_id)){
            $products->where('collection_id', $request->collection_id);
        }

        $products = $products->orderBy($orderBy, $sort)
                            ->paginate($pageSize, page: $page);

        $items = [];

        foreach( $products->items() as $product ) {
            $item = [];

            $item['id'] = $product->id;
            $item['name'] = $product->name;
            $item['sku'] = $product->sku;
            $item['thumbnail'] = $product->thumbnail;
            $item['price'] = $product->price;
            $item['cost'] = $product->cost;
            $item['brand'] = 'N/A';
            $item['brand_id'] = 'N/A';
            $item['is_giftcard'] = $product->is_giftcard ? true : false;
            $item['is_active'] = $product->is_active ? true : false;
            $item['featured'] = $product->featured ? true : false;
            $item['stock'] = $product->stock;
            $item['images'] = !$product->images ? [] : explode(',', $product->images);

            if( $product->stock <= 0 ) $item['inventoryStatus'] = 'OUTOFSTOCK';
            else if ( $product->stock <= $product->stock_alert ) $item['inventoryStatus'] = 'LOWSTOCK';
            else $item['inventoryStatus'] = 'INSTOCK';

            if( $product->brand_id ) {
                $brand = Brand::where( 'id', $product->brand_id )->whereNull( 'deleted_at' )->first()
                                ->makeHidden(['created_at', 'updated_at', 'deleted_at']);
                if ( $brand ) {
                    $item['brand'] = $brand;
                    $item['brand_id'] = $brand->id;
                }
            }

            $items[] = $item;
        }

        return response()->json( [
        'status' => 1,
        'products' => $items,
        'meta' => [
            'page' => $products->currentPage(),
            'pages' => $products->lastPage(),
            'limit' => $products->perPage(),
            'total' => $products->total(),
          ]
        ], Response::HTTP_OK);

    }

    public function store(StoreProductRequest $request, HandleGenerator $generator, ImageUploader $uploader){

        try {
            $request->validated();

            $results = $generator->generate($request->only(['name', 'handle']), new Product);

            if( $results['data'] ) return response()->json(['status' => 0, 'message' => 'El handle ya está en uso, proporcione uno'], Response::HTTP_UNPROCESSABLE_ENTITY);

            $image = $uploader->uploadThumbnails($request, '/images/products/');

            if(!$image) return response()->json(['status' => 0, 'message' => 'La imagen en miniatura es obligatoria'], Response::HTTP_UNPROCESSABLE_ENTITY);

            $images = $uploader->uploadImages($request);

            $product = new Product;
            $product->name = $request->name;
            $product->sku = $request->sku;
            $product->description = $request->description;
            $product->cost = $request->cost;
            $product->price = $request->price;
            $product->stock = $request->stock;
            $product->featured = $request->featured ? 1 : 0;
            $product->shipping_required = $request->shipping_required ? 1 : 0;;
            $product->free_shipping = $request->free_shipping ? 1 : 0;
            $product->is_active = $request->is_active ? 1 : 0;
            $product->is_giftcard = $request->is_giftcard ? 1 : 0;
            $product->handle = $results['handle'];
            $product->thumbnail = $image;
            $product->images = $images;
            $product->save();

            return response()->json(['status' => 1, 'id' =>  $product->id], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al crear producto',
                'error' => $e->getMessage()
            ], 500);
        }

    }

    public function update(Request $request, $id)
    {
        $product = Product::find($id);

        if(!$product)  return response()->json(['status' => 0, 'message' => 'Producto no encontrado'], Response::HTTP_NOT_FOUND);

        $data = $request->validate([
            'name' => 'required',
            'sku' => ['required', Rule::unique('products')->ignore($product->id)],
            'price' => 'required',
            'stock' => 'required'
            ], [
                'sku.unique' => 'El sku está en uso por otro producto'
            ]
        );

        $product->update($data);

        return response()->json(['status' => 1, 'message' => 'Producto actualizado correctamente'], Response::HTTP_OK);
    }

    public function show($id)
    {
        $product = Product::find($id);

        if(!$product) return response()->json(['status' => 0, 'message' => 'Producto no encontrado'], Response::HTTP_NOT_FOUND);

        return response($product);
    }

    public function destroy($id)
    {
        $product = Product::find($id);

        if(!$product) return response()->json(['status' => 0, 'message' => 'Producto no encontrado'], Response::HTTP_NOT_FOUND);

        $product->delete();

        return response()->json(['status' => 1, 'message' => 'Producto eliminado correctamente']);
    }

    public  function multipleDestroy(Request $request)
    {
        $ids = $request->ids;

        if( !is_array($ids) || count($ids) == 0 ) return response()->json(['status' => 0, 'message' => 'Debe seleccionar al menos un producto'], Response::HTTP_UNPROCESSABLE_ENTITY);

        Product::whereIn('id', $ids)->delete();

        return response()->json(['status' => 1, 'message' => 'Productos eliminados correctamente']);
    }
}


