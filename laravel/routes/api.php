<?php

use App\Http\Controllers\UsersController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

// Define a POST route for storing users
Route::post('users', [UsersController::class, 'store']);

// Define a GET route for listing user Details
Route::get('users', [UsersController::class, 'index']);

// Define a GET route for listing users
Route::get('allUsers', [UsersController::class, 'allUsers']);
