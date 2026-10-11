# Capturas del formulario (recibidas el 11/10/2026)

Capturas reales de producto, usadas tal cual en la escena P. No se retocaron, no se reconstruyeron y no se generó ninguna interfaz.

| Archivo | Qué muestra | Desplazamiento en la página |
|---|---|---|
| `formulario-1-vacio.jpg` | Formulario vacío: encabezado, ¿Qué estás buscando?, Ubicación, Presupuesto | 0 px |
| `formulario-2-que-y-ubicacion.jpg` | Lo mismo, lleno: Comprar · Departamento · Pichincha · Quito · Cumbayá · 120000 | 0 px |
| `formulario-3-presupuesto.jpg` | Presupuesto lleno (120000–180000), Características vacía | 264 px |
| `formulario-4-caracteristicas.jpg` | Características llena: 3 · 2 · 100 · Amoblado · Seguridad | 357 px |
| `formulario-5-contacto-y-publicar.jpg` | Sobre ti, datos de contacto, botón «Publicar solicitud» | 787 px |

Los desplazamientos se midieron comparando las filas que se solapan. Con ellos, `src/film.js` (constantes `OFF`, `LLENO`, `TARJETAS`, `VACIO`) arma una sola página de 1287 px por la que se mueve la cámara.

## Para la versión definitiva

- **Resolución.** Llegaron a 800 × 500 px en JPEG comprimido (unos 20 KB cada una). En el video la columna del formulario se amplía entre 2,5 y 4 veces y se ve blanda. Hacen falta los originales: idealmente el mismo recorrido a 1600 × 1000 o más, en PNG. Basta con reemplazar estos cinco archivos por versiones con los mismos nombres y el mismo encuadre; el código escala solo (`sf = ancho / 800`).
- **Versión de desarrollo.** Abajo a la izquierda aparece el indicador «N» de Next.js, que solo se ve en modo desarrollo. En el anuncio queda fuera de cuadro, pero conviene que las capturas definitivas sean de la versión que estará activa cuando salga el anuncio.
- **Rótulo sin terminar.** En «Tus datos de contacto» el rótulo dice literalmente «Quiero recibir contacto de hasta **X** agentes». El anuncio no lo muestra: la ventana se estrecha antes de pasar por ahí. Conviene corregirlo en la app.
- **Terminología.** La app dice «Publicar solicitud» y «Alquilar»; el anuncio dice «Publica gratis tu búsqueda» (el CTA aprobado). Si se prefiere unificar, se cambia en `src/linea-de-tiempo.js`.
