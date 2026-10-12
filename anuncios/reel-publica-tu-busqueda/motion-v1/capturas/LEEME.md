# Capturas del formulario

Capturas reales de producto, usadas tal cual en la escena P. No se retocaron, no se reconstruyeron y no se generó ninguna interfaz.

**Versión en alta resolución (11/10/2026):** seis capturas de 1440 × 900 en un PDF de Google Docs, guardado sin cambios en `originales/capturas-1440x900-11-10-2026.pdf`. Las imágenes se extrajeron con `pdfimages -png`, sin recomprimir, y su perfil de color es sRGB. Son 1,8 veces más grandes que las primeras, de 800 × 500.

| Archivo | Qué muestra | Desplazamiento en la página | Origen |
|---|---|---|---|
| `formulario-1-vacio.png` | Formulario vacío: encabezado, ¿Qué estás buscando?, Ubicación, Presupuesto | 0 px | PDF, imagen 1 |
| `formulario-2-que-y-ubicacion.png` | Lo mismo, lleno: Comprar · Departamento · Pichincha · Quito · Cumbayá · 120000–160000 | 0 px | PDF, imagen 2 |
| `formulario-3-presupuesto.jpg` | Presupuesto lleno y Características **vacía**. Solo se usa la tarjeta de Características vacía | 264 px | Primera entrega, 800 × 500 |
| `formulario-4-caracteristicas.png` | Características llena: 3 · 2 · 100 · Amoblado · Seguridad | 398,9 px | PDF, imagen 4 |
| `formulario-5-contacto-y-publicar.png` | Sobre ti, datos de contacto vacíos, botón «Publicar solicitud» | 787,2 px | PDF, imagen 5 |

Del PDF no se usan dos imágenes. La 3 es igual a la 2, con el cursor en «Precio máximo». La 6 tiene los datos de contacto llenos con datos de prueba (un nombre y un correo `@propiedadconecta.test`); se usa la 5, con el contacto vacío, para que no aparezcan nunca.

**Desplazamientos.** Se midieron comparando las filas que se solapan, a resolución completa: 718 px y 1417 px en las de 1440, que equivalen a 398,9 y 787,2 px en unidades de 800. Con ellos, `src/film.js` (constantes `OFF`, `LLENO`, `TARJETAS` y `VACIO`) arma una sola página de 1287 px por la que se mueve la cámara. Las costuras entre capturas están en filas de fondo liso, idénticas en las dos imágenes: 443 y 812 px.

**Mezcla de entregas.** La nueva tanda no trae Características vacía, así que esa tarjeta sale de la primera entrega, de 800 × 500. El diseño y los tonos coinciden: fondo 247, 248, 251 en ambas. Aparece atenuada al pie del cuadro mientras la cámara está en Presupuesto (desde unos 6,9 s). Después queda medio segundo en primer plano, hasta que el barrido la llena (8,0–8,6 s). En esos momentos se ve más blanda que el resto. Con una captura nueva del mismo encuadre (Presupuesto lleno y Características vacía, a 1440 × 900) basta reemplazar el archivo (si llega en PNG, se cambia también la extensión en `src/main.js`).

## Notas sobre la aplicación

- **Versión de desarrollo.** Abajo a la izquierda aparece el indicador de Next.js «N · 1 Issue», que solo se ve en modo desarrollo. En el anuncio queda fuera de cuadro.
- **Rótulo sin terminar.** En «Tus datos de contacto» el rótulo dice literalmente «Quiero recibir contacto de hasta **X** agentes». El anuncio no lo muestra: la ventana se estrecha antes de pasar por ahí. Conviene corregirlo en la app.
- **Terminología.** La app dice «Publicar solicitud» y «Alquilar»; el anuncio dice «Publica gratis tu búsqueda» (el CTA aprobado). Si se prefiere unificar, se cambia en `src/linea-de-tiempo.js`.
