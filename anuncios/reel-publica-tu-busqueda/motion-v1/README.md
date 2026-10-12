# v1 de motion — «El punto»

Reel vertical de 16 s para Propiedad Conecta, construido íntegramente en código con el motor del showreel. **Estado: videos finales A y B, con voz completa y las capturas del formulario en alta resolución.** Dirección aprobada y «gratis» confirmado.

**Videos:** `entregables/propiedad-conecta-v1-A.mp4` y `entregables/propiedad-conecta-v1-B.mp4`. En `entregables/audio/` están, en FLAC, la mezcla con voz, la mezcla sin voz y los stems de música, SFX y voz. Los subtítulos están en `subtitulos/`.

- **Concepto y justificación:** [CONCEPTO.md](CONCEPTO.md)
- **Guion técnico con tiempos exactos (generado):** [guion-tecnico.md](guion-tecnico.md)
- **Control de calidad:** [informe-qa.md](informe-qa.md)
- **Hojas de contactos revisadas:** [revision/](revision/)

| Archivo en `revision/` | Qué es |
|---|---|
| `hoja-de-contactos-A.jpg` | Versión A, un fotograma por beat (32), con desenfoque de movimiento |
| `hoja-de-contactos-B-apertura.jpg` | Versión B, apertura (beats 0–8) cada medio beat; desde el beat 6 es igual a A |
| `transicion-producto.jpg` | El formulario real, cada medio beat |
| `voz-sobre-imagen-A.jpg`, `voz-sobre-imagen-B.jpg` | Un fotograma del MP4 final cuando suena cada frase, con su texto |
| `capturas-antes-y-ahora.jpg` | El mismo recorte del video a tamaño real, con las capturas de 800 y de 1440 px |
| `archivo-final-A-cada-1s.jpg`, `archivo-final-B-cada-1s.jpg` | Un fotograma por segundo extraído del MP4 final |
| `transicion-giro-A.jpg`, `transicion-marco.jpg`, `transicion-cierre.jpg` | Las transiciones clave cada 1/8 o 1/4 de beat |
| `movil-1a1.jpg` | Momentos clave a 390 px de ancho, tamaño real de un teléfono |
| `zonas-seguras-A.jpg` | Cada 2 beats, con la zona segura de Reels y Stories superpuesta |

El v0 (`../animatic/v0/`) no se toca: esta carpeta y su rama local (`claude/propiedad-conecta-motion-v1`) son independientes.

## Estructura

| Archivo | Para qué |
|---|---|
| `src/linea-de-tiempo.js` | **Fuente única:** escenas, eventos en beats, locución, CTA, pendientes y zona segura. Todo lo demás se deriva de aquí |
| `src/film.js` | La película: `draw(ctx, t)` pinta el fotograma *t* y depende solo de *t* |
| `src/main.js`, `index.html` | `window.seek(t)` con desenfoque de movimiento real (subfotogramas promediados en luz lineal); parámetros `?v=A|B`, `&rev=1`, `&t=` |
| `src/tipo.js`, `hornear-glifos.mjs` | Outfit horneado en contornos compatibles e interpolado por letra en el eje de peso |
| `voz.mjs` → `locucion/colocacion.json` | Corta las tomas en frases, las coloca según su ancla en la imagen y las procesa (paso alto, nivel, compresión suave, limitador de picos) |
| `musica.mjs`, `src/dsp.mjs` | Partitura y SFX sintetizados. La música baja bajo cada frase y la voz queda 10 dB por delante. Mezcla a −14 LUFS con pico ≤ −1 dBTP |
| `locucion/` | Tomas originales ([LEEME](locucion/tomas/LEEME.md)), guion de locución generado y tiempos reales de cada frase |
| `medir-beats.mjs` → `beats.json` | Cuadrícula de beats **medida** sobre el audio renderizado; la película toma de aquí el tiempo de cada golpe |
| `generar-textos.mjs` | Genera `guion-tecnico.md`, `subtitulos/v1-{A,B}.srt` y `locucion/guion-locucion-v1.txt` |
| `render.mjs` | Render con Chromium sin interfaz → H.264 yuv420p CRF 16; hojas de contactos |
| `control.mjs` | Controles sobre el MP4 exportado: formato, sonoridad, sincronía del punto, posición de cada frase de la voz en el audio exportado, voz frente a música, proporción del logo |
| `fuentes/` | Outfit (OFL) y JetBrains Mono (OFL), con sus licencias |
| `capturas/` | Las cinco capturas reales del formulario (cuatro de 1440 × 900 y una de 800 × 500), el PDF original y su [LEEME](capturas/LEEME.md) |

El logo se lee directamente de `../marca/logo-horizontal-transparente.png`, el archivo original: no hay copia ni versión retocada.

## Reproducir

Requisitos: Node 22, ffmpeg e ImageMagick. Chromium lo provee Playwright; en este entorno ya está instalado.

```sh
cd motion-v1
npm install
node hornear-glifos.mjs        # solo si cambia la fuente o el juego de caracteres
node voz.mjs                   # salida/voz-{A,B}.wav + locucion/colocacion.json
node musica.mjs                # salida/musica-{A,B}.wav (sin voz), mezcla-{A,B}.wav (con voz) y stems
node medir-beats.mjs A         # beats.json, medido sobre la música sin voz; «node medir-beats.mjs B» verifica que B coincida
node generar-textos.mjs        # guion técnico, subtítulos y locución
node render.mjs --hoja --v A   # salida/hoja-A.png y hoja-A-movil.png
node render.mjs --v A          # película con la mezcla: salida/propiedad-conecta-v1-A.mp4 (30 fps, desenfoque de 10 subfotogramas)
node control.mjs salida/propiedad-conecta-v1-A.mp4 A
```

Más opciones: `--rev` (zonas seguras y rótulos de revisión), `--en 1.5,3.2` (fotogramas sueltos), `--muestras 1` (vista previa rápida sin desenfoque), `--desde/--hasta/--paso/--desfase` (rango de la hoja en beats). Para ver la película en el navegador, servir la carpeta del reel (no `motion-v1`) y abrir `motion-v1/index.html?v=B`.

## Cambios habituales

- **Cambiar una toma o su sitio:** cada frase tiene en la línea de tiempo su `corte` (tramo de la toma) y su `ancla` (evento de la imagen + segundos). `voz.mjs` no deja que dos frases queden a menos de 80 ms. Después se corre la secuencia de arriba desde `node voz.mjs`.
- **Reemplazar una captura:** mismo encuadre, mismo nombre (la extensión se ajusta en `src/main.js`). Si cambia el desplazamiento, se vuelve a medir y se actualiza `OFF` en `src/film.js` (ver [capturas/LEEME](capturas/LEEME.md)). La única que sigue en 800 × 500 es `formulario-3-presupuesto.jpg`.
- **Cambiar «gratis»:** `PENDIENTE.gratis` en `src/linea-de-tiempo.js` (`'no'` deja «Publica tu búsqueda»).
