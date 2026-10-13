# «Los dos del logo»

Reel vertical de 20 s para agentes e inmobiliarias: las dos personas del logo (la que busca casa y el agente) se encuentran y, al conectar, forman el logo. Hecho con el motor (`anuncios/motor/`) y la fórmula (`anuncios/FORMULA.md`).

**Estado:** concepto aprobado (13/10/2026) con un solo gancho. Película y música armadas; hoja de contactos en revisión antes del render completo. La voz está por grabar (`locucion/guion-locucion.txt`).

| Archivo | Qué es |
|---|---|
| [CONCEPTO.md](CONCEPTO.md) | La idea, las piezas del logo, los cinco tiempos, la voz, el movimiento, el sonido y las decisiones pendientes |
| `revision/storyboard.jpg` | El storyboard del concepto (todavía con el gancho B, que quedó fuera) |
| `revision/hoja-de-contactos.jpg`, `movil-1a1.jpg`, `se-forma-el-logo.jpg` | Un fotograma por beat, momentos clave a tamaño de teléfono y el final, cuadro a cuadro |
| `partitura.mjs` | Música y SFX sobre los eventos |
| `piezas.js` | Corta el isotipo en sus piezas a partir del archivo original del logo, en el render (sin copias) |
| `guion.js`, `pelicula.js` | El guion (fuente única) y la película: personajes, moneda, app y logo que se arma |

```sh
node anuncios/motor/anuncio.mjs todo anuncios/reel-los-dos-del-logo
node anuncios/motor/anuncio.mjs hoja anuncios/reel-los-dos-del-logo --v A --muestras 6
```
