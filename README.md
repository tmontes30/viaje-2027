# Luna de miel 2027: El Nido + Indonesia

Planificador con mapa para el viaje de mayo/junio de 2027. Es un sitio estático: HTML, CSS y JS, sin build ni servidor.

## Archivos

- `index.html`: estructura de la página.
- `styles.css`: estilos (modo claro y oscuro).
- `app.js`: mapa, itinerario, optimizador, presupuesto y compartir.
- `data/destinos.js`: catálogo de destinos (clima, qué hacer, alojamientos), conexiones entre ellos y plan sugerido. **Para sumar un destino o corregir un dato, se edita este archivo.**

## Verlo en la compu

Hacé doble clic en `index.html` y se abre en el navegador.

## Publicarlo en GitHub Pages (sin instalar nada)

1. Entrá a https://github.com/new, creá un repo (por ejemplo `luna-de-miel`) y dejalo como **Public**, que es lo que requiere Pages en la cuenta gratis.
2. En el repo vacío, tocá **"uploading an existing file"** y arrastrá `index.html`, `styles.css`, `app.js`, `README.md` y la carpeta `data`. Después tocá **Commit changes**.
3. Andá a **Settings → Pages**. En *Source* elegí **Deploy from a branch**, en *Branch* elegí `main` y la carpeta `/ (root)`, y tocá **Save**.
4. En 1 o 2 minutos queda publicada en `https://TU-USUARIO.github.io/luna-de-miel/`.

Para actualizarla, volvé a subir los archivos que cambiaron con *Add file → Upload files*.

## Cómo se guardan los datos

- Lo que cargan (destinos, noches, hoteles, precios) se guarda **en el navegador** de cada uno. No queda en el repo, así que el repo público no tiene datos privados.
- **Compartir link** copia una URL que tiene el plan adentro. Si tu pareja la abre, ve exactamente el mismo plan. Cada vez que hagan cambios, vuelvan a compartir el link.
- **⋯ → Exportar / Importar** guarda y carga el plan como archivo JSON, para tener un backup.
