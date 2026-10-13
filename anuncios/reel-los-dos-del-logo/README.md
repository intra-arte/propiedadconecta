# «Los dos del logo»

Reel vertical de 20 s para agentes e inmobiliarias: las dos personas del logo (la que busca casa y el agente) se encuentran y, al conectar, forman el logo. Hecho con el motor (`anuncios/motor/`) y la fórmula (`anuncios/FORMULA.md`).

**Estado:** concepto y storyboard, pendientes de aprobación (13/10/2026). Todavía no hay película ni música.

| Archivo | Qué es |
|---|---|
| [CONCEPTO.md](CONCEPTO.md) | La idea, las piezas del logo, los cinco tiempos, la voz, el movimiento, el sonido y las decisiones pendientes |
| `revision/storyboard.jpg` | Diez cuadros clave con su tiempo, lo que pasa y la voz |
| `piezas.js` | Corta el isotipo en sus piezas a partir del archivo original del logo, en el render (sin copias) |
| `pelicula.js`, `guion.js` | Por ahora, solo los cuadros del storyboard (un cuadro por segundo) |

```sh
node anuncios/motor/herramientas/render.mjs --anuncio anuncios/reel-los-dos-del-logo --en 0.5,1.5,2.5,3.5,4.5,5.5,6.5,7.5,8.5,9.5
```
