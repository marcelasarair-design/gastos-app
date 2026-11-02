// Registro de Gastos Personales
// Estado: arreglo de gastos guardado en localStorage del navegador.
const CATEGORIAS = ["Alimentación", "Transporte", "Estudios", "Ocio", "Otros"];
const MAX_DESCRIPCION = 60;
const MAX_MONTO = 1000000;

// Comprueba que un registro leído de localStorage tenga la forma esperada
function esGastoValido(g) {
  return (
    g !== null &&
    typeof g === "object" &&
    typeof g.id === "number" &&
    typeof g.descripcion === "string" && g.descripcion.trim() !== "" &&
    typeof g.monto === "number" && isFinite(g.monto) && g.monto > 0 &&
    typeof g.categoria === "string"
  );
}

// Lee los gastos guardados. Si los datos están dañados, no rompe la app:
// descarta los registros inválidos y, si todo está dañado, empieza vacío.
function cargarGastos() {
  try {
    const datos = JSON.parse(localStorage.getItem("gastos"));
    if (!Array.isArray(datos)) return [];
    return datos.filter(esGastoValido).map((g) => ({
      id: g.id,
      descripcion: g.descripcion,
      monto: g.monto,
      categoria: CATEGORIAS.includes(g.categoria) ? g.categoria : "Otros",
      fecha: typeof g.fecha === "string" && /^\d{4}-\d{2}-\d{2}$/.test(g.fecha) ? g.fecha : "",
    }));
  } catch (error) {
    return [];
  }
}

let gastos = cargarGastos();

const inputDescripcion = document.getElementById("descripcion");
const inputMonto = document.getElementById("monto");
const inputFecha = document.getElementById("fecha");
const selectCategoria = document.getElementById("categoria");
const selectFiltro = document.getElementById("filtro");
const lista = document.getElementById("lista");
const total = document.getElementById("total");
const mensaje = document.getElementById("mensaje");

// Guarda el arreglo actual en localStorage
// Devuelve true si se pudo guardar. Puede fallar si el almacenamiento está lleno o bloqueado.
function guardar() {
  try {
    localStorage.setItem("gastos", JSON.stringify(gastos));
    return true;
  } catch (error) {
    mensaje.textContent = "No se pudo guardar en el navegador: los datos se perderán al cerrar la página.";
    return false;
  }
}

// Devuelve la fecha de hoy en formato AAAA-MM-DD (hora local)
function fechaHoy() {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, "0");
  const dia = String(hoy.getDate()).padStart(2, "0");
  return hoy.getFullYear() + "-" + mes + "-" + dia;
}

// Convierte AAAA-MM-DD a DD/MM/AAAA para mostrarla en la lista.
// Los gastos guardados antes de agregar la fecha no la tienen.
function formatearFecha(fecha) {
  if (!fecha) return "Sin fecha";
  const partes = fecha.split("-");
  return partes[2] + "/" + partes[1] + "/" + partes[0];
}

// Funcionalidad 1: agregar un gasto validando los datos
function agregarGasto() {
  const descripcion = inputDescripcion.value.trim();
  // Se redondea a centavos para evitar montos como 1.005 o 0.001
  const monto = Math.round(parseFloat(inputMonto.value) * 100) / 100;

  if (descripcion === "" || isNaN(monto) || monto <= 0) {
    mensaje.textContent = "Ingresa una descripción y un monto mayor que 0.";
    return;
  }
  if (descripcion.length > MAX_DESCRIPCION) {
    mensaje.textContent = "La descripción puede tener máximo " + MAX_DESCRIPCION + " caracteres.";
    return;
  }
  if (monto > MAX_MONTO) {
    mensaje.textContent = "El monto máximo permitido es $" + MAX_MONTO + ".";
    return;
  }

  gastos.push({
    id: Date.now(),
    descripcion: descripcion,
    monto: monto,
    categoria: selectCategoria.value,
    fecha: inputFecha.value || fechaHoy(), // si no eligen fecha, se usa hoy
  });

  const guardado = guardar();
  inputDescripcion.value = "";
  inputMonto.value = "";
  inputFecha.value = fechaHoy();
  if (guardado) mensaje.textContent = "";
  mostrarGastos();
}

// Funcionalidad 3: eliminar un gasto por su id
function eliminarGasto(id) {
  gastos = gastos.filter((g) => g.id !== id);
  guardar();
  mostrarGastos();
}

// Funcionalidad 2: listar (con filtro por categoría), ordenar por fecha y calcular el total
function mostrarGastos() {
  const filtro = selectFiltro.value;
  const visibles = gastos
    .filter((g) => filtro === "Todas" || g.categoria === filtro)
    // Más reciente primero; si la fecha es igual, el agregado último va arriba
    .sort((a, b) => (b.fecha || "").localeCompare(a.fecha || "") || b.id - a.id);

  lista.innerHTML = "";

  if (visibles.length === 0) {
    const vacio = document.createElement("li");
    vacio.className = "vacio";
    vacio.textContent = "No hay gastos registrados.";
    lista.appendChild(vacio);
  }

  let suma = 0;
  visibles.forEach((g) => {
    suma += g.monto;

    const li = document.createElement("li");
    const texto = document.createElement("span");
    texto.textContent = g.descripcion + " — $" + g.monto.toFixed(2);

    const fecha = document.createElement("span");
    fecha.className = "fecha";
    fecha.textContent = formatearFecha(g.fecha);
    texto.appendChild(fecha);

    const etiqueta = document.createElement("span");
    etiqueta.className = "etiqueta";
    etiqueta.textContent = g.categoria;
    texto.appendChild(etiqueta);

    const boton = document.createElement("button");
    boton.textContent = "Eliminar";
    boton.addEventListener("click", () => eliminarGasto(g.id));

    li.appendChild(texto);
    li.appendChild(boton);
    lista.appendChild(li);
  });

  total.textContent = "$" + suma.toFixed(2);
}

document.getElementById("btn-agregar").addEventListener("click", agregarGasto);
selectFiltro.addEventListener("change", mostrarGastos);

inputFecha.value = fechaHoy(); // la fecha de hoy aparece por defecto
mostrarGastos();

//en el 5, me gusto que se agregara la fecha asi es mas ordenado y se puede ver en que dias se gasto mas en comparacioon a otros