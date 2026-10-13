# «Los dos del logo»

Reel vertical de 20 s para agentes e inmobiliarias: las dos personas del logo (la que busca casa y el agente) se encuentran y, al conectar, forman el logo. Hecho con el motor (`anuncios/motor/`) y la fórmula (`anuncios/FORMULA.md`).

**Estado:** terminado, en `entregables/propiedad-conecta-los-dos-del-logo.mp4`, con la voz de L1–L4 (ElevenLabs, voz Arturo Casares); todos los controles en OK ([informe-qa.md](informe-qa.md)). El CTA va solo en pantalla (botón «Regístrate gratis», «Para agentes e inmobiliarias» y el nombre): el cliente decidió no agregar la frase hablada, así que la música ya no le deja hueco.

| Archivo | Qué es |
|---|---|
| [CONCEPTO.md](CONCEPTO.md) | La idea, las piezas del logo, los cinco tiempos, la voz, el movimiento, el sonido y las decisiones pendientes |
| `revision/storyboard.jpg` | El storyboard del concepto (todavía con el gancho B, que quedó fuera) |
| `revision/hoja-de-contactos.jpg`, `se-forma-el-logo.jpg` | Un fotograma por beat y el final, cuadro a cuadro |
| `revision/archivo-final-A-cada-1s.jpg`, `voz-sobre-imagen-A.jpg`, `movil-1a1.jpg` | Del MP4 final: un fotograma por segundo, cada frase de voz con lo que hay en pantalla y momentos clave a tamaño de teléfono |
| `partitura.mjs` | Música y SFX sobre los eventos |
| [locucion/tomas/](locucion/tomas/LEEME.md) | Las tomas de ElevenLabs sin editar, con su SHA-256 y cuál se usa |
| `entregables/` | El video y, en `audio/`, la mezcla, la música sin voz y los stems (música, SFX, voz) en FLAC |
| [informe-qa.md](informe-qa.md) | Notas por pasada, mediciones del MP4, lo que no se pudo comprobar y pendientes |
| `piezas.js` | Corta el isotipo en sus piezas a partir del archivo original del logo, en el render (sin copias) |
| `guion.js`, `pelicula.js` | El guion (fuente única) y la película: personajes, moneda, app y logo que se arma |

```sh
node anuncios/motor/anuncio.mjs todo anuncios/reel-los-dos-del-logo
node anuncios/motor/anuncio.mjs hoja anuncios/reel-los-dos-del-logo --v A --muestras 6
```
