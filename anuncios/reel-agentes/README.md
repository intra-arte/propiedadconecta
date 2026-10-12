# Anuncio para agentes: «La moneda se da vuelta»

Reel vertical de 18 s para agentes e inmobiliarias, hecho con el motor (`anuncios/motor/`) y la fórmula (`anuncios/FORMULA.md`). Es la contraparte del anuncio para compradores, «Publica lo que buscas».

**Estado:** concepto aprobado el 12/10/2026. Imagen y música en revisión, con la hoja de contactos. La voz está por grabar: su guion, con los tiempos, está en `locucion/guion-locucion.txt`.

| Archivo | Qué es |
|---|---|
| [CONCEPTO.md](CONCEPTO.md) | La idea, lo confirmado frente a lo que no se dice, los cinco tiempos, los ganchos A/B y el guion de voz |
| `guion.js` | Fuente única: escenas, eventos en beats, locución, CTA, capturas y controles |
| `pelicula.js` | Lo propio de este anuncio (anuncios y monedas, el giro, los titulares, el punto) más las escenas del motor: pantallas reales y cierre |
| `partitura.mjs` | Música y SFX sobre los eventos |
| [capturas/](capturas/LEEME.md) | Las cuatro capturas reales, los recortes que usa el anuncio y lo que queda fuera de cuadro |
| `revision/` | Hoja de contactos de A (un fotograma por beat), apertura de B y momentos clave a tamaño de teléfono |
| `guion-tecnico.md`, `subtitulos/`, `locucion/` | Generados con el motor |

```sh
node anuncios/motor/anuncio.mjs todo anuncios/reel-agentes      # voz → música → beats → textos → render → controles → hojas
node anuncios/motor/anuncio.mjs hoja anuncios/reel-agentes --v A --muestras 6
```
