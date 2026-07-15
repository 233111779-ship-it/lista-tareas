// script.js
// Lógica de la aplicación Bitácora de Tareas.

const STORAGE_KEY = 'bitacora-tareas';

const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');

// El estado de las tareas vive en memoria y se sincroniza con
// localStorage para que no se pierda al recargar la página.
let tareas = cargarTareas();

function cargarTareas() {
  const guardadas = localStorage.getItem(STORAGE_KEY);
  return guardadas ? JSON.parse(guardadas) : [];
}

function guardarTareas() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tareas));
}

function crearTarea(texto) {
  return {
    id: Date.now().toString(),
    texto,
    completada: false,
  };
}

// Únicamente agrega tareas por ahora: eliminar, actualizar, fecha de
// vencimiento y conteo de completadas se incorporan en commits futuros.
function renderizarTareas() {
  taskList.innerHTML = '';

  tareas.forEach((tarea) => {
    const item = document.createElement('li');
    item.className = 'ticket-list__item';
    item.dataset.id = tarea.id;
    item.textContent = tarea.texto;
    taskList.appendChild(item);
  });
}

taskForm.addEventListener('submit', (evento) => {
  evento.preventDefault();

  const texto = taskInput.value.trim();
  if (!texto) return;

  tareas.push(crearTarea(texto));
  guardarTareas();
  renderizarTareas();

  taskForm.reset();
  taskInput.focus();
});

renderizarTareas();
