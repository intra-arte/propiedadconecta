# Ejemplo: «Publica lo que buscas»

El anuncio aprobado (v1 de motion, 11/10/2026), portado al motor. Sirve para dos cosas:

1. **Prueba del motor.** Con este motor sale idéntico al original: el MP4 de la versión A dio la misma huella SHA-256 que el de `reel-publica-tu-busqueda/motion-v1/entregables/`, y los 480 fotogramas y el audio coinciden. `node anuncios/motor/anuncio.mjs probar` lo vuelve a comprobar contra `referencia.json`.
2. **Modelo para anuncios nuevos.** `anuncio.mjs nuevo` copia esta carpeta. Todas las técnicas del anuncio están aquí: el guion como fuente única, la voz anclada a la imagen, el producto con capturas, el cierre de marca y los controles.

| Archivo | Qué es |
|---|---|
| `guion.js` | Escenas, eventos en beats, locución con cortes y anclas, CTA, capturas, impactos del punto que se controlan y tabla de eventos |
| `pelicula.js` | Lo propio del anuncio (el muro, BUSCO, los titulares y la trayectoria del punto) más las escenas del motor configuradas |
| `partitura.mjs` | Las notas y los SFX sobre los eventos |
| `beats.json`, `locucion/colocacion.json` | Generados: la cuadrícula medida y los tiempos reales de la voz |
| `referencia.json` | Huellas del anuncio aprobado para `probar` |

Los materiales (capturas y tomas de voz) se leen de `reel-publica-tu-busqueda/motion-v1/`, que no se toca. La documentación completa del anuncio (concepto, guion técnico, informe de calidad y entregables) está allí.
