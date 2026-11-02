# Registro de Gastos Personales



Aplicación web sencilla para registrar gastos personales, clasificarlos por categoría y ver el total.

Desarrollada para la asignatura Herramientas Avanzadas para el Desarrollo de Aplicaciones (102HAD1), UTLA, Ciclo II-2026.



## Funcionalidades

\- Agregar un gasto con descripción, monto, fecha (por defecto la de hoy) y categoría.

\- Listar los gastos ordenados del más reciente al más antiguo, y filtrarlos por categoría, con el total actualizado.

\- Eliminar gastos.

\- Validación de datos: no acepta descripciones vacías o de más de 60 caracteres, ni montos vacíos, negativos, cero o mayores a $1,000,000. Los montos se redondean a centavos.

\- Los datos se conservan en el navegador (localStorage) y la app no se rompe si esos datos están dañados.



## Tecnologías

HTML, CSS y JavaScript (sin dependencias).



## Cómo ejecutarla

1\. Clona el repositorio: `git clone https://github.com/marcelasarair-design/gastos-app.git`

2\. Abre el archivo `index.html` en cualquier navegador. No requiere instalación.



## Estructura

\- `index.html`: estructura de la página.

\- `style.css`: estilos.

\- `app.js`: lógica (agregar, listar/filtrar/ordenar, eliminar, validaciones y carga de datos).



\## Cómo usé la IA

Usé un asistente de IA (Claude) como apoyo para proponer la estructura del proyecto, generar el código y explicarlo. Yo revisé y probé cada cambio antes de incorporarlo.



\*\*1. Elegir la tecnología.\*\* Le pedí ayuda para guiarme en la creación de la tarea y propuso una app de gastos en HTML, CSS y JavaScript. Pregunté si la tarea exigía React; se comprobó en el documento que la tecnología es a elección, y decidí mantener JavaScript puro porque no requiere instalación y reduce el riesgo de errores.



\*\*2. Agregar fechas.\*\* Instrucción: "Agrega a cada gasto un campo de fecha y muestra la fecha en la lista, ordenando los gastos del más reciente al más antiguo. Explícame qué cambias en cada archivo." Probé en el navegador que la fecha por defecto fuera la de hoy y que la lista se ordenara correctamente. Los gastos guardados antes del cambio aparecen como "Sin fecha" y quedan al final; acepté ese comportamiento.



\*\*3. Revisión de errores.\*\* Instrucción: "Revisa app.js buscando errores o casos que puedan fallar (montos negativos, campos vacíos, datos corruptos en localStorage). Dime qué encontraste y cómo lo corriges." La IA encontró que la app dejaba de cargar si los datos guardados estaban dañados, y que faltaban límites en la descripción y el monto. Los montos negativos y los campos vacíos ya se validaban. Comprobé el arreglo guardando datos dañados desde la consola con `localStorage.setItem("gastos", "{{{")` y con `localStorage.setItem("gastos", "\[null]")`, y recargando la página: la app abrió vacía, con total $0.00 y sin errores en la consola. También probé que se rechazan el monto 0 y las descripciones de más de 60 caracteres, y que un monto como 0.007 se acepta y se redondea a $0.01.



