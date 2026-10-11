# Reel «Publica tu búsqueda» — Propiedad Conecta (Quito)

Anuncio vertical 9:16 de **23,5 s** para Instagram y Facebook (Reels y Stories). Objetivo: que personas que buscan comprar o alquilar en Quito entiendan la propuesta y entren a publicar lo que necesitan.

**Estado:**
- **Animatic v1 terminado**, con las capturas reales del formulario, versiones A y B, en [animatic/v1/](animatic/v1/).
- La v0 queda congelada en [animatic/v0/](animatic/v0/LEEME.md).
- Todavía no se generaron imágenes, clips ni audio con IA, a propósito.
- La v1 se centra en quien busca: no muestra agentes, contactos ni notificaciones, y no afirma que haya agentes activos.
- Pendientes y comprobación de cada afirmación: [07-verificacion-de-producto.md](07-verificacion-de-producto.md).

## Ver el animatic v1

| Archivo (en `animatic/v1/`) | Para qué |
|---|---|
| `animatic-A-v1.mp4` | **Versión A para mostrar a personas.** Limpia, sin datos técnicos. |
| `animatic-B-v1.mp4` | Versión B (gancho alternativo), para mostrar. |
| `animatic-A-v1-revision.mp4`, `animatic-B-v1-revision.mp4` | Revisión interna: tiempo, escena, línea de voz y zonas seguras sobre cada frame. |
| `hoja-de-contactos-A.jpg`, `hoja-de-contactos-B.jpg` | Un fotograma por escena. |
| `informe-qa.md` | Control automático: duración, ritmo de la voz, zonas seguras, logo, CTA y capturas usadas. |
| `../animatic.html` | Reproductor interactivo. Se abre con doble clic en Chrome o Edge: play/pausa (barra espaciadora), línea de tiempo, versión A/B y modo prueba/revisión. |

**Los videos no tienen audio**, porque en este entorno no se puede generar voz ni música de forma fiable. El montaje está preparado para agregarlos:
- **Voz guía:** basta grabarla con el celular leyendo [locucion/guion-locucion.txt](locucion/guion-locucion.txt).
- **Mezcla:** `animatic/mezclar-audio.sh <video> <voz> [música]` la mezcla con el video a −14 LUFS.
- **Efectos y música:** sus tiempos están en la hoja de audio de la [tabla de tiempos](animatic/tabla-de-tiempos.md#hoja-de-audio-para-la-mezcla).

**Cómo cambiar algo:** todos los tiempos y textos viven en [animatic/linea-de-tiempo.js](animatic/linea-de-tiempo.js). Después de editarla, `node animatic/generar.mjs` regenera:
- los subtítulos, la locución y la tabla de tiempos;
- los videos y el informe, en `animatic/<versión>/`.

Necesita Node, Playwright con Chromium, ffmpeg e ImageMagick; con `--solo-textos` no genera video. Los recortes de las capturas se regeneran con `python3 animatic/capturas/preparar.py`.

## En resumen

- **Concepto:** «Deja de perseguir anuncios. Publica lo que buscas.» ([por qué](01-concepto-y-voz-en-off.md)).
- **Versión A (principal):** «¿Otra vez “ya se arrendó”? ¿“Ya se vendió”?» → «Deja de perseguir anuncios. Publica lo que buscas.»
- **Versión B (para probar después):** «Esta vez, el anuncio lo pones tú. ¿Vas a comprar o alquilar en Quito?»
- **Demostración:** el formulario real ([08](08-capturas-y-secuencia-v1.md)): compra o alquiler, tipo, ubicación, presupuesto, características, datos de contacto y la opción de 1, 3 o 5 agentes.
- **El papel del agente, en condicional:** «Si un agente tiene algo para ti, puede contactarte. Tú eliges hasta cuántos.»
- **CTA:** «Publica gratis tu búsqueda.» La gratuidad la confirma la propia página.
- A y B comparten todo desde el segundo 4,7.

## Documentos

| Punto | Documento |
|---|---|
| Revisión de capturas y secuencia visual de la v1 | [08-capturas-y-secuencia-v1.md](08-capturas-y-secuencia-v1.md) |
| **Confirmado vs pendiente y comprobación de afirmaciones** | [07-verificacion-de-producto.md](07-verificacion-de-producto.md) |
| **Tiempos definitivos y hoja de audio (generados)** | [animatic/tabla-de-tiempos.md](animatic/tabla-de-tiempos.md) |
| 1 · Concepto · 2 · Locución definitiva | [01-concepto-y-voz-en-off.md](01-concepto-y-voz-en-off.md) |
| 3 · Guion técnico escena por escena | [02-guion-tecnico.md](02-guion-tecnico.md) |
| 4 · Prompts por clip (en espera) | [03-prompts-ia.md](03-prompts-ia.md) |
| 5 · IA vs edición · 6 · Logo | [04-ia-vs-edicion-y-logo.md](04-ia-vs-edicion-y-logo.md) |
| 7 · Versión B y prueba A/B | [05-prueba-ab.md](05-prueba-ab.md) |
| 8 · Montaje, **recursos que faltan** y control de calidad | [06-montaje-y-control-de-calidad.md](06-montaje-y-control-de-calidad.md) |
| Diagnóstico inicial | [00-diagnostico.md](00-diagnostico.md) |

## Recursos

- `subtitulos/version-a.srt`, `subtitulos/version-b.srt`: todas las líneas, sincronizadas. Solo se queman los bloques que indica la tabla de tiempos.
- `locucion/guion-locucion.txt`: texto para la locutora, con tiempos, dirección y ritmo por línea.
- `animatic/capturas/`:
  - `originales/`: las capturas tal como llegaron;
  - `recortes/`: generados por `preparar.py`, sin redibujar, con el teléfono de ejemplo difuminado.
- `marca/`: logo original y versiones recortadas ([reglas de uso](04-ia-vs-edicion-y-logo.md#6--cómo-incorporar-el-logo-sin-deformarlo)).
- `animatic/fuentes/`: tipografía Outfit (licencia OFL, incluida).

## Pendientes

Lo que falta confirmar está en [07](07-verificacion-de-producto.md#depende-de-tu-respuesta). Lo que falta producir está en [06](06-montaje-y-control-de-calidad.md#recursos-que-faltan-para-el-anuncio-final).
