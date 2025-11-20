<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    // C - READ (Lectura de todos los elementos)
    public function index()
    {
        // Devuelve todas las tareas ordenadas por ID descendente
        return response()->json(Task::orderBy('id', 'desc')->get());
    }

    // R - CREATE (Creación de un nuevo elemento)
    public function store(Request $request)
    {
        // 1. Validación de datos obligatorios
        $request->validate([
            'title' => 'required|max:255',
        ]);

        $task = Task::create([
            'title' => $request->title,
            'description' => $request->description,
            'is_completed' => $request->is_completed ?? false, 
        ]);

        return response()->json($task, 201);
    }

    public function show(Task $task) 
    {
        return response()->json($task);
    }

    public function update(Request $request, Task $task)
    {
        $request->validate([
            'title' => 'required|max:255',
        ]);
        
        $task->update($request->all());

        return response()->json($task);
    }

    public function destroy(Task $task)
    {
        $task->delete();
        return response()->json(null, 204);
    }
}