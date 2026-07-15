console.log("Aplicación iniciada");
// script.js
// Lógica de la aplicación Bitácora de Tareas.

const STORAGE_KEY = 'bitacora-tareas';

const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskDateInput = document.getElementById('task-date');
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

function crearTarea(texto, fechaVencimiento) {
  return {
    id: Date.now().toString(),
    texto,
    fechaVencimiento: fechaVencimiento || null,
    completada: false,
  };
}

// Da formato legible (dd/mm/aaaa) a una fecha en formato ISO (aaaa-mm-dd)
// e indica si la tarea ya está vencida, para resaltarlo en la interfaz.
function formatearVencimiento(fechaISO) {
  const [anio, mes, dia] = fechaISO.split('-');
  const vencida = new Date(fechaISO) < new Date(new Date().toDateString());
  return {
    texto: `${dia}/${mes}/${anio}`,
    vencida,
  };
}

// Eliminar y actualizar tareas, y el conteo de completadas, se
// incorporan en commits futuros.
function renderizarTareas() {
  taskList.innerHTML = '';

  tareas.forEach((tarea) => {
    const item = document.createElement('li');
    item.className = 'ticket-list__item';
    item.dataset.id = tarea.id;

    const texto = document.createElement('span');
    texto.className = 'ticket-list__text';
    texto.textContent = tarea.texto;
    item.appendChild(texto);

    const botonEditar = document.createElement('button');
    botonEditar.type = 'button';
    botonEditar.className = 'ticket-list__action ticket-list__action--edit';
    botonEditar.dataset.accion = 'editar';
    botonEditar.setAttribute('aria-label', 'Editar tarea');
    botonEditar.textContent = '✎';
    acciones.appendChild(botonEditar);

    const botonEliminar = document.createElement('button');
    botonEliminar.type = 'button';
    botonEliminar.className = 'ticket-list__action ticket-list__action--delete';
    botonEliminar.dataset.accion = 'eliminar';
    botonEliminar.setAttribute('aria-label', 'Eliminar tarea');
    botonEliminar.textContent = '✕';
    acciones.appendChild(botonEliminar);


    if (tarea.fechaVencimiento) {
      const { texto: fechaLegible, vencida } = formatearVencimiento(tarea.fechaVencimiento);
      const badge = document.createElement('span');
      badge.className = vencida
        ? 'ticket-list__due ticket-list__due--overdue'
        : 'ticket-list__due';
      badge.textContent = `Vence ${fechaLegible}`;
      item.appendChild(badge);
    }

    taskList.appendChild(item);
  });
}

taskForm.addEventListener('submit', (evento) => {
  evento.preventDefault();

  const texto = taskInput.value.trim();
  if (!texto) return;

  tareas.push(crearTarea(texto, taskDateInput.value));
  guardarTareas();
  renderizarTareas();

  taskForm.reset();
  taskInput.focus();
});

renderizarTareas();
