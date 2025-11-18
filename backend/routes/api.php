<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TaskController; 


// Puedes dejarlo vacío o con la ruta de prueba si quieres
Route::get('/saludo-api', function () {
    return response()->json(['mensaje' => 'API temporal OK']);
});


Route::resource('tasks', TaskController::class);