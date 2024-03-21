<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\RoleController;

Route::prefix('admin')->group(function() {
    Route::resource('users', UserController::class);
    Route::resource('roles', RoleController::class);
});
