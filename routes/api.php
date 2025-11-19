<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PatientController;
use App\Http\Controllers\VisitController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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

Route::post('/tes', [AuthController::class,'index']);
Route::post('/login', [AuthController::class,'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class,'logout']);

    // Patients
    Route::get('/patients', [PatientController::class,'index']);
    Route::get('/patients/search/{no}', [PatientController::class, 'search']);
    Route::post('/patients', [PatientController::class,'store']);
    Route::get('/patients/{patient}', [PatientController::class,'show']);

    // Visits
    Route::get('/visits', [VisitController::class,'index']);
    Route::post('/visits', [VisitController::class,'store']);
    Route::get('/visits/{visit}', [VisitController::class,'show']);
});
