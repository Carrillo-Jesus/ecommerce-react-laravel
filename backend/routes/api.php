<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductsController;
use App\Http\Controllers\BrandsController;
use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\CollectionsController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});


Route::resource('categories', CategoriesController::class)->only(['index', 'show', 'store', 'update', 'destroy']);
Route::resource('brands', BrandsController::class)->only(['index', 'show', 'store', 'update', 'destroy']);
Route::resource('collections', CollectionsController::class)->only(['index', 'show', 'store', 'update', 'destroy']);
Route::resource('products', ProductsController::class)->only(['index', 'show', 'store', 'update', 'destroy']);
Route::post('/products/multipleElimination', [ProductsController::class, 'multipleDestroy']);
