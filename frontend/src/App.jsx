import React, { useState, useEffect } from 'react';

// URL de la API de Laravel (asegúrate de que el puerto sea el 8000)
const API_URL = "http://127.0.0.1:8000/api/tasks"; 

function App() {
  const [newTitle, setNewTitle] = useState('');
  const [statusMessage, setStatusMessage] = useState('Full Stack inicializado.');
  const [tasks, setTasks] = useState([]);

  // ------------------------------------
  // FUNCIÓN 1: CARGAR TODAS LAS TAREAS (READ)
  // ------------------------------------
  const fetchTasks = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! Estado: ${response.status}`);
      }
      const data = await response.json();
      setTasks(data); // Guarda la lista
    } catch (error) {
      console.error('Error al cargar tareas:', error);
      setStatusMessage('ERROR: No se pudo conectar con la API de Laravel.');
    }
  };

  // Carga inicial al montar el componente
  useEffect(() => {
    fetchTasks();
  }, []);

  // ------------------------------------
  // FUNCIÓN 2: MANEJAR ENVÍO (CREATE)
  // ------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    if (!newTitle) return;

    try {
      const response = await fetch(API_URL, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
          // 'Accept': 'application/json', // Opcional
        },
        body: JSON.stringify({ title: newTitle }),
      });

      if (response.ok) {
        const newTask = await response.json();
        setStatusMessage(`Tarea creada con éxito! ID: ${newTask.id}`);
        setNewTitle(''); 
        fetchTasks(); // Recarga la lista
      } else {
        const errorData = await response.json();
        setStatusMessage(`Error en la creación: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error de red o CORS:', error);
      setStatusMessage('Error de conexión con la API.');
    }
  };

  // ------------------------------------
  // FUNCIÓN 3: ELIMINAR TAREA (DELETE)
  // ------------------------------------
  const handleDelete = async (taskId) => {
    const url = `${API_URL}/${taskId}`;

    try {
      const response = await fetch(url, {
        method: 'DELETE',
      });

      if (response.status === 204) { // Laravel devuelve 204 No Content
        setStatusMessage(`Tarea ID ${taskId} eliminada.`);
        fetchTasks(); // Recarga la lista
      } else {
        setStatusMessage(`Error al eliminar ID ${taskId}.`);
      }
    } catch (error) {
      console.error('Error de red al eliminar:', error);
    }
  };

  // ------------------------------------
  // FUNCIÓN 4: ACTUALIZAR ESTADO (UPDATE)
  // ------------------------------------
  const handleToggleComplete = async (task) => {
    const url = `${API_URL}/${task.id}`; 
    const newStatus = !task.is_completed; // Invertir el estado

    try {
      const response = await fetch(url, {
        method: 'PUT', // PUT/PATCH para actualizar
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: task.title, // Mandar el título de vuelta para pasar la validación
          is_completed: newStatus,
        }),
      });

      if (response.ok) {
        setStatusMessage(`Tarea ID ${task.id} marcada como ${newStatus ? 'Completada' : 'Pendiente'}.`);
        fetchTasks(); // Recarga la lista
      } else {
        setStatusMessage(`Error al actualizar ID ${task.id}.`);
      }
    } catch (error) {
      console.error('Error de red al actualizar:', error);
    }
  };

  // ------------------------------------
  // RENDERIZADO DEL COMPONENTE
  // ------------------------------------
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <h1>CRUD de Tareas (React + Laravel)</h1>
      <p style={{ fontWeight: 'bold' }}>{statusMessage}</p>

      {/* Formulario de Creación */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '40px' }}>
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Título de la nueva tarea"
          required
          style={{ flexGrow: 1, padding: '10px' }}
        />
        <button type="submit" style={{ padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>Crear Tarea</button>
      </form>
      
      <hr />

      {/* Listado de Tareas */}
      <h2>Lista de Tareas ({tasks.length})</h2>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {tasks.map(task => (
          <li 
            key={task.id} 
            // Aplica estilos de la lista CSS y la clase 'completed-task'
            className={task.is_completed ? 'completed-task' : ''} 
            style={{ padding: '15px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: task.is_completed ? '#2a2a2a' : '#1e1e1e' }}
          >
            <div 
              style={{ textDecoration: task.is_completed ? 'line-through' : 'none', color: task.is_completed ? '#999' : 'inherit' }}>
              
              {/* Actualizar estado al hacer clic en el título */}
              <strong 
                onClick={() => handleToggleComplete(task)} 
                style={{ cursor: 'pointer', marginRight: '10px' }}>
                {task.title}
              </strong> 
              (ID: {task.id}) - Estado: {task.is_completed ? 'COMPLETADA' : 'PENDIENTE'}
            </div>
            
            {/* Botón Eliminar */}
            <button 
              onClick={() => handleDelete(task.id)} 
              style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;