<?php
namespace App\Services;

use Illuminate\Http\Request;
use App\Http\Requests\StoreProductRequest;

class ImageUploader
{

    public function uploadThumbnails(StoreProductRequest $request, string $route)
    {
        $imageName = null;
        if ($request->hasFile('thumbnail')) {
            $file = $request->file('thumbnail');
            $name =  'thumbnail' . uniqid() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path($route.'thumbnails/'), $name);
            $imageName = $name;
        }
        return $imageName;
    }

    public function uploadImages(StoreProductRequest $request)
    {
        $imagePaths = [];
        $processedImages = null;

        if ($request->hasFile('images')) {
            $images = $request->file('images');
            foreach ($images as $file) {
                $name =  'image' . uniqid() . '.' . $file->getClientOriginalExtension();
                $file->move(public_path('/images/products/images/'), $name);
                $imagePaths[] = $name;
            }

        }

        if (!empty($imagePaths)) {
            $processedImages = implode(',', $imagePaths);
        }

        return $processedImages;
    }

}
