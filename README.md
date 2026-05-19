# Descripción

CustomStanding Overlay para Kapps. Tabla de posiciones en vivo para iRacing con datos de telemetría en tiempo real.

![preview](img/image.png)

Muestra la parrilla en vivo con:

- Posición y clase (filtro multiclase por el auto enfocado)
- Número de auto, marca, nombre del piloto con bandera y licencia
- iRating con delta esperado (+/- ganancia/pérdida estimada)
- Gap al líder y gap con el auto de adelante (INT)
- Última vuelta y mejor vuelta
- Compuesto de neumático (WET/DRY)
- Estado de pits con cronómetro y número de vuelta
- Lap GAP: diferencia vuelta a vuelta contra el auto enfocado (últimas 3 vueltas)

En sesiones de práctica/clasificación muestra diferencia de mejor vuelta al líder.
En carrera muestra gaps de tiempo real.
Si la carrera no ha comenzado, muestra la parrilla de clasificación.

# Instalación

- Crear una carpeta sobre la cual Kapps creará un enlace simbólico.
  (Recomiendo crear la carpeta CustomApps en Documentos de iRacing para no perderla.)

- Extraer la carpeta de la app CustomStanding.
  Debería verse así: Documents\iRacing\CustomApps\CustomStanding. Dentro de "CustomStanding" deben estar las carpetas 'libs' y 'assets'; los archivos 'app.js', 'index.html' y 'style.css'.

- Ejecutar Kapps como administrador (Kapps necesita crear un symlink). En la pestaña 'App' abrir 'Settings'. Agregar la carpeta en 'App Folder'. Seleccionar la carpeta que crearon en el primer paso (CustomApps). Guardar con 'Save'.
  Para verificar que funcionó, ir a `%AppData%\Kapps\iRacingBrowserApps`. Allí debe haber un acceso directo 'apps' que apunte a su carpeta. Si no aparece, intentar cerrar y volver a abrir Kapps como administrador. O crear el enlace manualmente.

- Ir a 'Racing Overlay'. Bajar y agregar 'Add Custom Overlay'. Ingresar nombre, URL y marcar las opciones necesarias ('not in iRacing' seguramente).
  - El nombre puede ser cualquiera.
  - La URL debe ser 'http://127.0.0.1:8182/CustomStanding/'

Ahora pueden abrir el overlay y ajustar el nuevo cuadro en la escena.

## Parámetros

Se pueden agregar parámetros en la URL para modificar el comportamiento. Agregar al final de la URL "?" seguido del parámetro y su valor. Múltiples parámetros se separan con "&".

Parámetros:

`bgOpacity=0.5` - opacidad del fondo de la tabla, de 0.0 a 1 (predeterminado: 0.85)

Ejemplo: `http://127.0.0.1:8182/CustomStanding/?bgOpacity=0.5`

---

# Description

CustomStanding Overlay for Kapps. Live standings table for iRacing with real-time telemetry data.

Shows the live grid with:

- Position and class (multi-class filtered by focus car)
- Car number, brand, driver name with flag and license badge
- iRating with expected delta (+/- estimated gain/loss)
- Gap to leader and gap to car ahead (INT)
- Last lap and best lap
- Tire compound (WET/DRY)
- Pit status with timer and lap number
- Lap GAP: lap-by-lap difference against focus car (last 3 laps)

In practice/qualifying sessions it shows best lap delta to leader.
In race sessions it shows real-time time gaps.
If the race hasn't started yet, it shows the qualifying grid.

# Install

- Create a folder that Kapps will symlink to.
  (Recommend creating a CustomApps folder in iRacing Documents so you don't lose it.)

- Extract the CustomStanding app folder.
  Should look like: Documents\iRacing\CustomApps\CustomStanding. Inside "CustomStanding" there should be folders 'libs' and 'assets'; files 'app.js', 'index.html' and 'style.css'.

- Run Kapps as administrator (Kapps needs to create a symlink). In the 'App' tab open 'Settings'. Add the folder to 'App Folder'. Select the folder created in step one (CustomApps). Click 'Save'.
  To verify it worked, go to `%AppData%\Kapps\iRacingBrowserApps`. There should be a shortcut 'apps' pointing to your folder. If not, try closing and re-running Kapps as admin, or create the link manually.

- Go to 'Racing Overlay'. Scroll down and click 'Add Custom Overlay'. Enter a name, URL, and check the required options ('not in iRacing' likely).
  - Name can be anything.
  - URL must be 'http://127.0.0.1:8182/CustomStanding/'

Now you can open the overlay and configure the new box in your scene.

## Options

You can add URL parameters to modify behavior. Append "?" to the URL followed by the parameter and value. Multiple parameters are separated with "&".

Parameters:

`bgOpacity=0.5` - table background opacity, from 0.0 to 1 (default: 0.85)

Example: `http://127.0.0.1:8182/CustomStanding/?bgOpacity=0.5`

---

Author: Bastian Benitez
