import React, { useState, useEffect } from 'react';

const API_URL = "http://127.0.0.1:8000/api/tasks";

function App() {
  const [newTitle, setNewTitle] = useState('');
  const [statusMessage, setStatusMessage] = useState('Full Stack inicializado.');
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error();
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      setStatusMessage("ERROR: No se pudo conectar con la API.");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTitle) return;

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle })
      });

      if (response.ok) {
        const newTask = await response.json();
        setStatusMessage(`Tarea creada con éxito! ID: ${newTask.id}`);
        setNewTitle('');
        fetchTasks();
      } else {
        setStatusMessage("Error al crear tarea.");
      }
    } catch {
      setStatusMessage("Error de conexión con la API.");
    }
  };

  const handleDelete = async (taskId) => {
    try {
      const response = await fetch(`${API_URL}/${taskId}`, { method: "DELETE" });
      if (response.status === 204) {
        setStatusMessage(`Tarea ID ${taskId} eliminada.`);
        fetchTasks();
      }
    } catch {}
  };

  const handleToggleComplete = async (task) => {
    try {
      const response = await fetch(`${API_URL}/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: task.title,
          is_completed: !task.is_completed,
        })
      });

      if (response.ok) {
        fetchTasks();
        setStatusMessage(
          `Tarea ${task.id} marcada como ${!task.is_completed ? "COMPLETADA" : "PENDIENTE"}.`
        );
      }
    } catch {}
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-neutral-800 p-8 text-gray-100">

      {/* HEADER */}
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">
          Gestor de Tareas
        </h1>
        <p className="text-gray-400">{statusMessage}</p>
      </header>

      {/* CARD PRINCIPAL */}
      <div className="bg-neutral-900/60 border border-neutral-700 backdrop-blur-xl rounded-2xl shadow-2xl p-8 max-w-2xl mx-auto">

        {/* FORMULARIO */}
        <form onSubmit={handleSubmit} className="mb-10">
          <label className="block text-sm font-medium mb-1">Nueva Tarea</label>

          <div className="flex gap-3">
            <input
              type="text"
              className="flex-grow bg-neutral-800 border border-neutral-600 px-4 py-2.5 rounded-xl text-gray-200
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Escribe un título..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 transition px-5 py-2 rounded-xl font-semibold"
            >
              Crear
            </button>
          </div>
        </form>

        {/* LISTA */}
        <h2 className="text-xl font-semibold mb-4">
          Tareas ({tasks.length})
        </h2>

        <ul className="space-y-4">
          {tasks.map(task => (
            <li
              key={task.id}
              className={`flex justify-between items-center p-4 rounded-xl border shadow-md transition
              ${task.is_completed
                ? "bg-neutral-800/70 border-neutral-700 opacity-70"
                : "bg-neutral-800 border-neutral-700 hover:bg-neutral-750"}
            `}
            >
              <div
                className="cursor-pointer flex flex-col"
                onClick={() => handleToggleComplete(task)}
              >
                <span className={`font-bold text-lg tracking-wide 
                  ${task.is_completed ? "line-through text-gray-400" : ""}`}>
                  {task.title}
                </span>
                <span className="text-xs text-gray-500">ID: {task.id}</span>
              </div>

              <button
                onClick={() => handleDelete(task.id)}
                className="bg-red-600 hover:bg-red-700 transition px-3 py-1.5 rounded-lg text-sm font-medium"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>

      </div>
    </div>
  );
}

export default App;