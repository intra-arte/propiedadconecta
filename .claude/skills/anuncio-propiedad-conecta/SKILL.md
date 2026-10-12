---
name: anuncio-propiedad-conecta
description: Producir un anuncio en video (reel vertical en motion) de Propiedad Conecta con la fórmula y el motor del anuncio aprobado «Publica lo que buscas». Usar cuando pidan un anuncio, reel, video o variante nueva de Propiedad Conecta, o cambios a uno existente hecho con el motor (guion, voz, capturas, música, render, controles).
---

# Anuncio de Propiedad Conecta con la fórmula

Leer primero, completos: `anuncios/FORMULA.md` (la receta: cinco tiempos, el punto como hilo, reglas y proceso) y `anuncios/motor/README.md` (motor, comandos, contrato de cada archivo). La implementación de referencia de cada técnica es `anuncios/motor/ejemplo-publica-lo-que-buscas/`: el anuncio aprobado, portado al motor e idéntico al original.

## Reglas del usuario (vigentes en todos los anuncios)

- **No subir commits, no desplegar y no cambiar la visibilidad del repo sin autorización explícita.** Se trabaja con commits locales; antes de cualquier `git push`, preguntar.
- **No tocar nunca** `anuncios/reel-publica-tu-busqueda/animatic/v0/` ni `anuncios/reel-publica-tu-busqueda/motion-v1/`: el motor solo lee sus materiales. Cada anuncio va en su propia carpeta (`anuncios/<slug>/`) y su propia rama (`claude/propiedad-conecta-<slug>`). Antes de integrar ramas, revisar las diferencias y no sobrescribir archivos existentes.
- **Mostrar el concepto y la hoja de contactos antes de renderizar el video completo.**
- **No simular interfaz**, ni siquiera como recurso provisional: el producto se muestra solo con capturas reales. Mientras falten, queda un espacio reservado que no pueda confundirse con la app.
- **No inventar funciones, resultados, notificaciones, pantallas ni interacciones.** No prometer contactos garantizados ni afirmar que hay agentes activos si no está verificado.
- **«Gratis»** (y cualquier dato del producto) solo si está confirmado; mientras tanto, `PENDIENTE.gratis = 'pendiente'` lo marca en pantalla.
- **Logo original**, sin deformar ni reconstruir: siempre `LOGO.url`, con escala uniforme ≤ 100 % y sobre marfil.
- **Voz:** si no hay voz natural, se entrega una pista pendiente con los huecos y se dice. No se finge que existe, y no se arma una frase pegando palabras de otras tomas.
- Hablar con el usuario en español claro y dar números medidos, nunca estimados. Si algo no se pudo comprobar (por ejemplo, la transcripción de la voz), decirlo.

## Proceso

**0. Preparación.** `cd anuncios/motor && npm install` si falta `node_modules`. Si se va a tocar el motor, correr antes y después `node anuncios/motor/anuncio.mjs probar` y no seguir si falla sin una razón intencional.

**1. Brief y recursos.** Preguntar lo que falte: público, dolor (en una frase), mensaje, datos confirmados (¿gratis?), qué parte del producto se muestra. Revisar los recursos que haya y decir exactamente qué falta, con especificaciones:
- **Capturas:** a 1440 × 900 o más, el mismo encuadre para «vacía» y «llena» de cada tarjeta, y sin datos de prueba a la vista.
- **Voz:** cuándo se graba y en qué formato.

**2. Concepto (esperar aprobación).** Escribir `anuncios/<slug>/CONCEPTO.md` con:
- **La metáfora nueva del dolor y el giro.** No reciclar el muro de anuncios.
- **El recorrido del punto** por los cinco tiempos, terminando siempre en la cabeza del isotipo.
- **Los dos ganchos**, A directo y B curiosidad, que solo difieren en los primeros 3 s.
- **El guion con tiempos.** Ritmo natural de la voz ≤ 5,8 sílabas/s; la voz termina 1,5–2 s antes del final; algo nuevo cada 2–4 s.

Mostrar el concepto en lenguaje claro y esperar el visto bueno.

**3. Construir.** Crear la rama y luego el anuncio con `node anuncios/motor/anuncio.mjs nuevo anuncios/<slug>`: es una copia del ejemplo que ya renderiza. Después:
- **`guion.js`:**
  - `TITULO`, `ARCHIVO`, `EV` (eventos en beats), `APERTURA` y `COMUN`, `CTA`, `PENDIENTE`, `EVENTOS` y `CONTROL.impactos` (los golpes del punto que control.mjs debe encontrar).
  - `LOCUCION`: huecos planeados (`inicio`/`fin`, `toma: null`) hasta que lleguen las tomas.
  - `MATERIAL`, `CAPTURAS` y `LOCUCION.tomas`: apuntar a los materiales propios en cuanto existan.
- **`pelicula.js`:** reemplazar las escenas propias del ejemplo (muro, BUSCO, titular del gancho, titular con el punto en la «i», trayectoria del punto) por la metáfora nueva. Reutilizar `crearProducto` (una página de capturas) o `crearPantallas` (un flujo de pantallas sueltas, como en `anuncios/reel-agentes/`), además de `crearCierre`, `dibujarPunto` y `dibujarRevision`. Debe ser una función pura del tiempo: sin `setTimeout`, sin `requestAnimationFrame` y sin azar sin semilla.
- **`partitura.mjs`:** adaptar los actos al nuevo guion. Mantener la identidad sonora: la marimba del punto (`D.punto`) y la firma re–la–fa# en `isotipo`, `cta` y `nombre`.

**4. Hoja de contactos e iteración.** Correr `node anuncios/motor/anuncio.mjs voz|musica|beats` y después `hoja anuncios/<slug> --v A --muestras 6`, que da 32 fotogramas, uno por beat, más la versión a 390 px. Mirar las imágenes de verdad y puntuar los 8 criterios de 1 a 10: gancho, comprensión, legibilidad en teléfono, calidad del motion, variedad, marca, sincronía y CTA. Corregir los tres problemas principales y repetir hasta que todos lleguen a 8. Si una nota depende de un recurso que falta, marcarla con asterisco: no puede llegar a 8 honestamente. Para revisar transiciones, usar una hoja con `--desde/--hasta/--paso`; para la zona segura, `--rev`. Mostrar la hoja al usuario antes del render completo.

**5. Capturas.**
- **Formato:** extraerlas sin recomprimir. De un PDF, con `pdfimages -png`; comprobar que el perfil sea sRGB.
- **Desplazamientos:** medirlos comparando filas solapadas a resolución completa, y poner las costuras de `lleno` en filas de fondo liso que sean idénticas en las dos capturas.
- **Comprobaciones:** verificar en el borde del barrido que no haya saltos, y que no entren en cuadro rótulos sin terminar, indicadores de desarrollo ni datos de prueba.
- **Registro:** anotar todo en `capturas/LEEME.md`, siguiendo el modelo del de motion-v1.

**6. Voz.**
- **Pedirla:** con `textos` se genera `locucion/guion-locucion.txt`. Al usuario se le da cada línea con su tiempo, más el tono y cómo grabarla.
- **Guardar las tomas:** copiarlas sin editar a `locucion/tomas/` con prefijo de línea, y registrar SHA-256, formato y duración de voz.
- **Medir antes de colocar:** analizar pausas y ruidos de cada toma con la envolvente, la sonoridad y la periodicidad.
- **Colocar:** cortar en las pausas naturales y anclar cada frase a lo que nombra en pantalla (`{ b: EV.x, s }`, o `{ tras }` para la continuación). Dejar fuera con el `corte` los ruidos previos a la frase. No acelerar ni estirar la voz; si no entra, se acortan pausas o se mueve el ancla.
- **Correr y comprobar:** `voz` → `musica` → `beats` → `textos`. La voz tiene que quedar unos 10 dB sobre la música en cada frase, y el limitador de la mezcla no debe recortar más de unos 2 dB.
- **Transcripción:** aquí no hay reconocimiento de voz. Decir que el texto se verificó por duraciones y pausas, y pedir que lo escuchen.

**7. Render y controles.**
- **Correr** `todo`, o `render` + `control`, y abrir `salida/control-{A,B}.md`: todo tiene que dar OK.
  - Formato: 1080 × 1920, H.264 yuv420p, 30 fps.
  - Sonido: −14 ± 1 LUFS y pico real ≤ −1 dBTP.
  - Sincronía: el punto con menos de un fotograma de desvío; cada frase de voz en su sitio, con 0 ms de desfase en el MP4.
  - Logo: proporción con menos de 1 % de desvío, escala ≤ 100 % y dentro de la zona segura.
- **Hojas de revisión en `revision/`:** el paso `revision`, incluido en `todo`, genera tres hojas a partir de los MP4 finales: un fotograma por segundo, voz sobre imagen (un fotograma por frase con su texto) y momentos clave a 390 px (`REVISION.movil` en el guion). Las zonas seguras se ven con `hoja --rev --paso 2`. Revisarlas con la vista.
- **`informe-qa.md`:** notas por pasada, problemas corregidos, mediciones del archivo exportado, lo que no se pudo comprobar y pendientes.

**8. Entrega.**
- **Archivos en `entregables/`:**
  - Los MP4 de A y B.
  - En `audio/`, el FLAC de la mezcla, de la música sin voz y de los stems de música, SFX y voz.
  - Los subtítulos, que quedan en `subtitulos/`.
- **Documentación:** `README.md` y `CONCEPTO.md` actualizados.
- **Cierre:** commit local en la rama del anuncio, con el mensaje en español. Mostrar los videos al usuario (SendUserFile) y preguntar si se sube la rama.

## Trampas conocidas

- **Orden de los pasos:** la voz va antes que la música, porque la música baja bajo cada frase real. Los beats se miden sobre la música sin voz y, si cambian, hay que volver a renderizar.
- **Gancho B:** suele ser más largo que el A. Revisar que no pise la línea compartida siguiente.
- **CTA hablado:** tiene que empezar cuando su texto ya se lee (después de `EV.cta`), no antes.
- **Capturas de otra sesión:** cambian valores y posiciones. Siempre se vuelven a medir; no se reutilizan desplazamientos.
- **Mezclar resoluciones:** si falta un estado en alta resolución y se usa uno de baja, decirlo y pedir la captura.
- **Tomas de voz:** pueden traer ruidos antes de la frase. Se ven en la envolvente como un tramo corto con voz seguido de silencio.
- **Fotograma de revisión:** en `probar` se renderiza con 1 subfotograma; los demás, con 3.
