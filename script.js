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
    if (tarea.completada) item.classList.add('ticket-list__item--completada');
    item.dataset.id = tarea.id;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'ticket-list__check';
    checkbox.checked = tarea.completada;
    checkbox.setAttribute('aria-label', 'Marcar tarea como completada');
    checkbox.dataset.accion = 'completar';
    item.appendChild(checkbox);

    const texto = document.createElement('span');
    texto.className = 'ticket-list__text';
    texto.textContent = tarea.texto;
    item.appendChild(texto);

    if (tarea.fechaVencimiento) {
      const { texto: fechaLegible, vencida } = formatearVencimiento(tarea.fechaVencimiento);
      const badge = document.createElement('span');
      badge.className = vencida
        ? 'ticket-list__due ticket-list__due--overdue'
        : 'ticket-list__due';
      badge.textContent = `Vence ${fechaLegible}`;
      item.appendChild(badge);
    }

    const acciones = document.createElement('span');
    acciones.className = 'ticket-list__actions';

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

    item.appendChild(acciones);
    taskList.appendChild(item);
  });
}

function buscarTarea(id) {
  return tareas.find((tarea) => tarea.id === id);
}

// Delegación de eventos: un solo listener en el contenedor atiende
// completar, editar y eliminar sin importar cuántas tareas existan.
taskList.addEventListener('click', (evento) => {
  const boton = evento.target.closest('button[data-accion]');
  if (!boton) return;

  const item = evento.target.closest('.ticket-list__item');
  const tarea = buscarTarea(item.dataset.id);
  if (!tarea) return;

  if (boton.dataset.accion === 'eliminar') {
    tareas = tareas.filter((t) => t.id !== tarea.id);
    guardarTareas();
    renderizarTareas();
  }

  if (boton.dataset.accion === 'editar') {
    const nuevoTexto = window.prompt('Actualizar tarea:', tarea.texto);
    if (nuevoTexto === null) return; // el usuario canceló
    const textoLimpio = nuevoTexto.trim();
    if (!textoLimpio) return;

    tarea.texto = textoLimpio;
    guardarTareas();
    renderizarTareas();
  }
});

taskList.addEventListener('change', (evento) => {
  if (evento.target.dataset.accion !== 'completar') return;

  const item = evento.target.closest('.ticket-list__item');
  const tarea = buscarTarea(item.dataset.id);
  if (!tarea) return;

  tarea.completada = evento.target.checked;
  guardarTareas();
  renderizarTareas();
});

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
