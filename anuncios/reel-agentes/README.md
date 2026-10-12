# Anuncio para agentes: «La moneda se da vuelta»

Reel vertical de 18 s para agentes e inmobiliarias, hecho con el motor (`anuncios/motor/`) y la fórmula (`anuncios/FORMULA.md`). Es la contraparte del anuncio para compradores, «Publica lo que buscas».

**Estado:** videos completos A y B **sin voz** en `entregables/` (`*-sin-voz.mp4`): concepto y hoja de contactos aprobados el 12/10/2026, imagen y música finales y todos los controles en OK ([informe-qa.md](informe-qa.md)). La voz está por grabar: su guion, con los tiempos, está en `locucion/guion-locucion.txt`, y la música ya deja sus huecos. Cuando lleguen las tomas, se colocan y se vuelve a renderizar; la imagen no cambia.

| Archivo | Qué es |
|---|---|
| [CONCEPTO.md](CONCEPTO.md) | La idea, lo confirmado frente a lo que no se dice, los cinco tiempos, los ganchos A/B y el guion de voz |
| `guion.js` | Fuente única: escenas, eventos en beats, locución, CTA, capturas y controles |
| `pelicula.js` | Lo propio de este anuncio (anuncios y monedas, el giro, los titulares, el punto) más las escenas del motor: pantallas reales y cierre |
| `partitura.mjs` | Música y SFX sobre los eventos |
| [capturas/](capturas/LEEME.md) | Las cuatro capturas reales, los recortes que usa el anuncio y lo que queda fuera de cuadro |
| `entregables/` | Los videos A y B sin voz y, en `audio/`, la música completa (con SFX) y sus stems de música y SFX, en FLAC |
| [informe-qa.md](informe-qa.md) | Notas por pasada, mediciones de los MP4, lo que no se pudo comprobar y pendientes |
| `revision/` | Hoja de contactos de A (un fotograma por beat) y apertura de B; del archivo final: un fotograma por segundo, cada hueco de voz con su texto y momentos clave a tamaño de teléfono |
| `guion-tecnico.md`, `subtitulos/`, `locucion/` | Generados con el motor |

```sh
node anuncios/motor/anuncio.mjs todo anuncios/reel-agentes      # voz → música → beats → textos → render → controles → hojas
node anuncios/motor/anuncio.mjs hoja anuncios/reel-agentes --v A --muestras 6
```
