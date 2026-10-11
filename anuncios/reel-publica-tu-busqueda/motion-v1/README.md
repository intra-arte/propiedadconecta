# v1 de motion — «El punto»

Reel vertical de 16 s para Propiedad Conecta, construido íntegramente en código con el motor del showreel. **Estado: borrador para revisar la dirección creativa.** La escena del formulario es un espacio reservado, la voz está pendiente y «gratis» está marcado como pendiente.

- **Concepto y justificación:** [CONCEPTO.md](CONCEPTO.md)
- **Guion técnico con tiempos exactos (generado):** [guion-tecnico.md](guion-tecnico.md)
- **Control de calidad:** [informe-qa.md](informe-qa.md)
- **Hojas de contactos revisadas:** [revision/](revision/)

| Archivo en `revision/` | Qué es |
|---|---|
| `hoja-de-contactos-A.jpg` | Versión A, un fotograma por beat (32), con desenfoque de movimiento |
| `hoja-de-contactos-B-apertura.jpg` | Versión B, apertura (beats 0–8) cada medio beat; desde el beat 6 es igual a A |
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
| `musica.mjs`, `src/dsp.mjs` | Partitura y SFX sintetizados; mezcla normalizada a −14 LUFS con pico ≤ −1 dBTP; huecos para la voz |
| `medir-beats.mjs` → `beats.json` | Cuadrícula de beats **medida** sobre el audio renderizado; la película toma de aquí el tiempo de cada golpe |
| `generar-textos.mjs` | Genera `guion-tecnico.md`, `subtitulos/v1-{A,B}.srt` y `locucion/guion-locucion-v1.txt` |
| `render.mjs` | Render con Chromium sin interfaz → H.264 yuv420p CRF 16; hojas de contactos |
| `control.mjs` | Controles sobre el MP4 exportado: formato, sonoridad, sincronía del punto, proporción del logo |
| `fuentes/` | Outfit (OFL) y JetBrains Mono (OFL), con sus licencias |

El logo se lee directamente de `../marca/logo-horizontal-transparente.png`, el archivo original: no hay copia ni versión retocada.

## Reproducir

Requisitos: Node 22, ffmpeg e ImageMagick. Chromium lo provee Playwright; en este entorno ya está instalado.

```sh
cd motion-v1
npm install
node hornear-glifos.mjs        # solo si cambia la fuente o el juego de caracteres
node musica.mjs                # salida/musica-{A,B}.wav + stems de música y SFX
node medir-beats.mjs A         # beats.json (medido); «node medir-beats.mjs B» verifica que B coincida
node generar-textos.mjs        # guion técnico, subtítulos y locución
node render.mjs --hoja --v A   # salida/hoja-A.png y hoja-A-movil.png
node render.mjs --v A          # película: salida/propiedad-conecta-v1-A.mp4 (30 fps, desenfoque de 10 subfotogramas)
node control.mjs salida/propiedad-conecta-v1-A.mp4 A
```

Más opciones: `--rev` (zonas seguras y rótulos de revisión), `--en 1.5,3.2` (fotogramas sueltos), `--muestras 1` (vista previa rápida sin desenfoque), `--desde/--hasta/--paso/--desfase` (rango de la hoja en beats). Para ver la película en el navegador, servir la carpeta del reel (no `motion-v1`) y abrir `motion-v1/index.html?v=B`.

## Cuando lleguen los pendientes

- **«gratis»:** en `src/linea-de-tiempo.js`, `PENDIENTE.gratis = 'confirmado'` (o `'no'`, que deja «Publica tu búsqueda»). Después se regeneran textos, música y render.
- **Capturas:** van en `motion-v1/capturas/`. La escena P (beats 9,25–19,5) es donde se encuadran; los rótulos de `COMUN[2].texto` y la línea L3 se ajustan a los rótulos reales.
- **Voz:** se graba con `locucion/guion-locucion-v1.txt`. La música ya baja 5 dB en cada línea; con la voz incorporada se vuelve a medir la sonoridad final.
