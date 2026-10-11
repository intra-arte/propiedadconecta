# Reel «Publica tu búsqueda» — Propiedad Conecta (Quito)

Anuncio vertical 9:16 de **22 s** para Instagram y Facebook (Reels y Stories). Objetivo: registros de personas que quieren comprar o arrendar en Quito.

**Estado:** animatic v0 listo para validar con personas. Todavía no se generaron imágenes ni clips con IA, a propósito. **No hay acceso al código ni a la interfaz de la app:** las escenas que dependen de ella (E4–E6) usan marcadores «CAPTURA PENDIENTE» y «POR CONFIRMAR». Ver [00-diagnostico.md](00-diagnostico.md).

## Ver el animatic

| Archivo | Para qué |
|---|---|
| `animatic/salida/animatic-A-v0.mp4` | **Versión para mostrar a personas.** Limpia, sin datos técnicos. |
| `animatic/salida/animatic-A-v0-revision.mp4` | Revisión interna: tiempo, escena, línea de voz y zonas seguras sobre cada frame. |
| `animatic/salida/animatic-B-v0-revision.mp4` | Gancho B, guardado para la prueba A/B posterior. |
| `animatic/salida/hoja-de-contactos-A.jpg` / `-B.jpg` | Un fotograma por escena, para revisar de un vistazo. |
| `animatic/salida/informe-qa.md` | Control automático: duración, ritmo de la voz, zonas seguras, proporción del logo y tamaño del CTA. |
| `animatic/animatic.html` | Reproductor interactivo. Se abre con doble clic en Chrome o Edge: play/pausa (barra espaciadora), línea de tiempo, versión A/B y modo prueba/revisión. |

Los videos no tienen audio: v0 valida si la historia se entiende **sin sonido**. Para la v1, una voz guía grabada con el celular leyendo [locucion/guion-locucion.txt](locucion/guion-locucion.txt) se sincroniza sobre el mismo video.

**Cómo cambiar algo:** todos los tiempos y textos viven en [animatic/linea-de-tiempo.js](animatic/linea-de-tiempo.js). Después de editarla se ejecuta `node animatic/generar.mjs`, que regenera:
- los subtítulos;
- el guion de locución;
- la [tabla de tiempos](animatic/tabla-de-tiempos.md);
- los videos y el informe.

Necesita Node, Playwright con Chromium, ffmpeg e ImageMagick. Con `--solo-textos` regenera todo menos el video.

## En resumen

- **Concepto:** «Deja de perseguir anuncios. Publica lo que buscas.» ([por qué](01-concepto-y-voz-en-off.md)).
- **Versión A (principal, gancho de dolor):** «¿Otra vez “ya se arrendó”?»
- **Versión B (prueba A/B, gancho de inversión):** «Esta vez, el anuncio lo pones tú.»
- **CTA:** «Publica gratis tu búsqueda.»
- **Producción:** la IA solo generará personas y ambientes, y solo después de aprobar el animatic. Textos, interfaz, logo, carteles, subtítulos y transiciones se hacen en edición.
- A y B comparten todo desde el segundo 6,6.

## Documentos

| Punto | Documento |
|---|---|
| Diagnóstico de recursos, supuestos y preguntas | [00-diagnostico.md](00-diagnostico.md) |
| **Tiempos definitivos (generados)** | [animatic/tabla-de-tiempos.md](animatic/tabla-de-tiempos.md) |
| 1 · Evaluación del concepto · 2 · Voz en off | [01-concepto-y-voz-en-off.md](01-concepto-y-voz-en-off.md) |
| 3 · Escenas (duración, visual, cámara, luz, sonido, texto, transición) | [02-guion-tecnico.md](02-guion-tecnico.md) |
| 4 · Prompts por clip (en espera) | [03-prompts-ia.md](03-prompts-ia.md) |
| 5 · IA vs edición · 6 · Logo | [04-ia-vs-edicion-y-logo.md](04-ia-vs-edicion-y-logo.md) |
| 7 · Gancho alternativo y prueba A/B | [05-prueba-ab.md](05-prueba-ab.md) |
| 8 · Flujo, montaje y control de calidad | [06-montaje-y-control-de-calidad.md](06-montaje-y-control-de-calidad.md) |

## Recursos

- `subtitulos/version-a.srt`, `subtitulos/version-b.srt`: tiempos de todas las líneas, generados desde la línea de tiempo. Solo se queman los bloques que indica la tabla de tiempos.
- `locucion/guion-locucion.txt`: texto para la locutora, con tiempos, dirección y ritmo por línea.
- `marca/`: logo original y versiones recortadas ([reglas de uso](04-ia-vs-edicion-y-logo.md#6--cómo-incorporar-el-logo-sin-deformarlo)).
- `animatic/fuentes/`: tipografía Outfit (licencia OFL, incluida).

## Pendientes de confirmar con producto

Las preguntas y capturas que faltan, y qué decisión depende de cada una, están en [00-diagnostico.md](00-diagnostico.md#5-preguntas-para-el-proyecto-original).
