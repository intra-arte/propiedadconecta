# Motor de anuncios de Propiedad Conecta

El motor con el que se hizo «Publica lo que buscas», separado del anuncio para hacer otros con la misma calidad. La receta creativa está en [../FORMULA.md](../FORMULA.md). Claude trabaja con la skill `anuncio-propiedad-conecta` (`.claude/skills/` en la raíz del repo).

**Garantía:** `ejemplo-publica-lo-que-buscas/` es el anuncio aprobado portado al motor. Sale idéntico al original: los fotogramas píxel a píxel y el audio bit a bit. `node anuncios/motor/anuncio.mjs probar` lo comprueba; hay que correrlo después de cualquier cambio en el motor.

## Qué es del motor y qué es de cada anuncio

| Del motor (igual en todos los anuncios) | De cada anuncio (su carpeta) |
|---|---|
| `nucleo/marca.js`: formato, zona segura, colores y logo original | `guion.js`: textos, escenas, eventos en beats, locución, CTA, capturas, controles |
| `nucleo/reloj.js`: cuadrícula de beats medida, variante, capturas | `pelicula.js`: `draw(ctx, t)`; las escenas propias (la metáfora) y el armado |
| `nucleo/tipo.js` y `glifos.js`: Outfit con peso interpolado letra por letra | `partitura.mjs`: `componer()`, las notas y los SFX sobre los eventos |
| `nucleo/dsp.mjs`: síntesis, voces de la marca, reverb, sonoridad, limitador | `capturas/`, `locucion/tomas/`: materiales reales, sin editar |
| `escenas/punto.js`: el punto verde (estiramiento, impactos, aro) | `beats.json`, `locucion/colocacion.json`: generados, se versionan |
| `escenas/producto.js`: marco + página de capturas apiladas + cabecera + foco + barridos + botón | `guion-tecnico.md`, `subtitulos/`, `locucion/guion-locucion.txt`: generados |
| `escenas/pantallas.js`: marco + pantallas sueltas (un recorte por paso, en el orden del flujo) + cabecera | |
| `escenas/cierre.js`: punto → isotipo, nombre, botón CTA | `salida/`: renders (no se versiona) |
| `escenas/revision.js`, `main.js`, `index.html`: desenfoque de movimiento y carga del anuncio | `entregables/`, `revision/`, `informe-qa.md`: lo que se entrega |
| `herramientas/`: voz, música, beats, textos, render, controles | |

## Comandos

Todo desde la raíz del repo (necesita Node 22, ffmpeg e ImageMagick; Chromium lo trae Playwright: `cd anuncios/motor && npm install`).

```sh
node anuncios/motor/anuncio.mjs nuevo anuncios/<carpeta>    # crea un anuncio a partir del ejemplo (ya renderiza)
node anuncios/motor/anuncio.mjs todo anuncios/<carpeta>     # voz → música → beats → textos → render A/B → controles
node anuncios/motor/anuncio.mjs hoja anuncios/<carpeta> --v A [--desde 8 --hasta 20 --paso 0.5 --muestras 6 --rev]
node anuncios/motor/anuncio.mjs render anuncios/<carpeta> [--v B]
node anuncios/motor/anuncio.mjs probar                      # el motor sigue reproduciendo el anuncio aprobado
```

Pasos sueltos: `voz`, `musica`, `beats`, `textos`, `control`. El orden importa: la voz va antes que la música (la música baja bajo cada frase real) y los beats se miden sobre la música sin voz. Para un fotograma suelto: `node anuncios/motor/herramientas/render.mjs --anuncio anuncios/<carpeta> --en 4.2,8.1 --v A`.

Vista previa en el navegador: servir `anuncios/` y abrir `/motor/index.html?anuncio=<carpeta>&v=A` (`&t=4.2` para un fotograma fijo, `&rev=1` para la zona segura).

## Un anuncio nuevo, archivo por archivo

**`guion.js`**: sin dependencias, porque lo leen Node y el navegador. Exporta:

- `TITULO`, `ETIQUETA` (capa de revisión), `ARCHIVO` (nombre de los videos), `BPM`, `BEATS`, `DURACION` y `PENDIENTE` (lo no confirmado: `'pendiente'`, `'confirmado'`, `'no'`).
- `CTA` y `ctaTexto()`.
- `APERTURA.A` y `APERTURA.B` (las escenas del gancho), y `COMUN` (las escenas compartidas). Cada escena: `{ id, nombre, b0, b1, texto[], visual }`.
- `EV`: los eventos en beats, que comparten imagen, sonido y voz.
- `LOCUCION`: cada línea con `toma` y `frases` (`corte` en segundos de la toma y `ancla` `{ b, s }` o `{ tras }`); `lineasVoz(v)`.
- `CAPTURAS` (rutas, en el orden que usa la película), `CONTROL.impactos` (los golpes del punto que se miden en el video) y `EVENTOS` (la tabla del guion técnico).

**`pelicula.js`**: importa el motor como `motor/...` (mapa de importación de `index.html`) y exporta `draw(ctx, t)` y `W, H`. Las escenas del motor se configuran con datos:

```js
const PRODUCTO = crearProducto({ marco, ev, pagina, desplazamientos, lleno, tarjetas, vacio, camara, boton, barrido, foco, rotulos, cabecera });
const PANTALLAS = crearPantallas({ centro, max, escalaMax, ev, pasos: [{ b, captura, recorte, acerca?, corte?, rotulo }], fondo, cabecera });
const CIERRE = crearCierre({ ev: { isotipo, cta, nombre, empujes, fin }, escala, yLogo, anclaZoom, cta, marcarGratis, nota? });
dibujarPunto(ctx, t, trayectoria, { estirarHasta, aro });   // la trayectoria del punto es del anuncio
```

`draw()` tiene que ser una función pura del tiempo: nada de estado entre fotogramas, `setTimeout`, `requestAnimationFrame` ni azar sin semilla (`hash`, `mulberry32`). Todos los tiempos salen de `B(beat)`.

**`partitura.mjs`**: `componer({ VAR, place, B, D, M, EV, rnd, musica, ritmo, sfx })` coloca las voces de `nucleo/dsp.mjs` sobre los eventos. La mezcla es del motor: cesión ante la voz, reverb, −14 LUFS, limitador, voz 10 dB delante con ganancia por frase y stems.

**¿`producto` o `pantallas`?** `crearProducto` sirve cuando las capturas son una sola página que se recorre (el formulario del ejemplo). `crearPantallas` sirve para un flujo de pantallas distintas (el anuncio para agentes: marketplace → detalle → confirmación → lead). Ahí cada paso es un recorte, el marco toma su tamaño y la pantalla nueva entra desde abajo.

**Capturas en la escena del producto.** Las coordenadas de página están en px de una captura de 800 de ancho (`pagina.unidad`); cada captura se escala según su propio ancho. Los `desplazamientos` se miden comparando las filas que se solapan, a resolución completa, y las costuras de `lleno` van en filas de fondo liso que sean idénticas en ambas capturas. Ver `reel-publica-tu-busqueda/motion-v1/capturas/LEEME.md`.

## Reglas de la carpeta

- `reel-publica-tu-busqueda/animatic/v0/` y `reel-publica-tu-busqueda/motion-v1/` están congelados: el motor lee sus materiales, pero no los modifica.
- El logo se lee siempre del archivo original (`LOGO.url` en `nucleo/marca.js`), nunca de una copia.
- Un cambio en el motor que altere el ejemplo tiene que ser intencional. Si `probar` falla, se revisa antes de seguir.
