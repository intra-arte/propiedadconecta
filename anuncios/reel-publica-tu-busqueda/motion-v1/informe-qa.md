# Informe de control de calidad — v1 de motion (borrador de dirección)

Estado: **videos finales A y B renderizados, sin voz** (`entregables/`). Dirección aprobada, «gratis» confirmado y formulario real integrado. Las mediciones de abajo se tomaron sobre los **MP4 finales exportados** (30 fps, desenfoque de movimiento de 10 subfotogramas), no sobre el navegador.

## 1. Iteraciones (hojas de contactos, un fotograma por beat)

Puntuación de 1 a 10. Un asterisco (\*) indica que la nota depende de un recurso que falta y **no puede llegar a 8 honestamente** hasta tenerlo.

| Criterio | Pasada 1 | Pasada 2 | Pasada 3 | Pasada 4 (final) | Qué la limita hoy |
|---|---|---|---|---|---|
| Gancho en los primeros 2 s | 7 | 8 | 8 | **8** | — |
| Comprensión inmediata de la propuesta | 6\* | 7\* | 7\* | **8** | El formulario real muestra el «cómo»; la voz lo reforzará |
| Legibilidad en teléfono | 6 | 8 | 9 | **8** | El texto de las capturas se lee pero se ve blando: llegaron a 800 × 500 |
| Calidad y originalidad del motion | 6 | 7 | 8 | **8** | — |
| Variedad visual | 7 | 7 | 7\* | **8** | — |
| Precisión de marca | 8 | 8 | 9 | **9** | — |
| Sincronía imagen–sonido | 6 | 6 | 8 | **8** | Sin voz: la sincronía con la locución queda pendiente |
| Claridad del CTA | 7 | 8 | 8 | **9** | — |

**Problemas corregidos en cada pasada** (los tres principales):

| Pasada | Problema | Corrección |
|---|---|---|
| 1 → 2 | La composición estaba cargada hacia arriba: titulares y cierre en el tercio superior, medio cuadro vacío | Todo bajó hacia el centro sin salir de la zona segura (y ≤ 1248) |
| 1 → 2 | En A, los sellos de los anuncios competían con el titular | Velo degradado más denso detrás del texto; los sellos viejos bajan a la mitad de opacidad y solo el nuevo brilla; aro marfil en el punto sobre el muro oscuro |
| 1 → 2 | En B, la tarjeta «BUSCO», la imagen clave, quedaba apagada bajo el velo y se iba con el muro | La tarjeta se despega del muro, se acerca a la cámara y queda fija y nítida sobre el titular |
| 2 → 3 | A mitad del viaje del titular a la cabecera las palabras se veían desordenadas y el punto atravesaba «buscas» | Viaje más rápido y escalonado de arriba abajo; el punto pasa por detrás del texto |
| 2 → 3 | El isotipo quedaba solo a la izquierda 1,5 s y luego el nombre aparecía encima de él | El isotipo aparece centrado; el logo entero se desliza como una pieza mientras sube el nombre |
| 2 → 3 | En A, el punto llegaba a la «i» desde abajo: medido +155 ms tarde | Salto balístico que siempre baja sobre la «i»: medido +21 ms |
| 3 → 4 | Al bajar al botón, la ventana alta mostraba la tarjeta de contacto entera, con el rótulo «hasta X agentes» | La ventana se estrecha antes de bajar; el rótulo nunca entra en cuadro |
| 3 → 4 | «Publicar solicitud» se veía pequeño en el teléfono | La cámara se acerca 4× al botón |
| 3 → 4 | El acercamiento a las tarjetas recortaba la primera letra del título del formulario | El acercamiento empieza cuando el título ya salió de cuadro |

## 2. Mediciones automáticas (`node control.mjs`)

| Comprobación | A | B | Esperado |
|---|---|---|---|
| Resolución / códec | 1080 × 1920 · h264 · yuv420p | igual | 1080 × 1920 · H.264 yuv420p |
| Duración / fps | 16,000 s · 30 | igual | 15–20 s |
| Tamaño | 4,0 MB | 3,9 MB | — |
| Sonoridad integrada (sin voz) | −14,0 LUFS | −14,0 LUFS | ≈ −14 LUFS |
| Pico real | −1,4 dBTP | −1,5 dBTP | ≤ −1 dBTP |
| Cuadrícula de beats medida | 119,88 BPM, residuo 6,6 ms | desvío máx. 12,6 ms frente a A | < 1 fotograma (33 ms) |

**Sincronía del punto**, rastreado por color en el video exportado (1 fotograma = 33,3 ms):

| Impacto | Versión | Desvío medido |
|---|---|---|
| Salto 1 / 2 / 3 (cada uno sella un anuncio) | A | −10 / +6 / −11 ms |
| El punto cae en «BUSCO» | B | +6 ms |
| El punto cae como punto de la «i» | A · B | +22 ms · +22 ms |

**Logo**, medido en el último fotograma del MP4: contenido de 825 × 220 px, proporción 3,750 frente a 3,733 del original. El desvío de 0,45 % viene del redondeo de bordes al codificar, el mismo margen que en el v0. Escala 77,5 % (≤ 100 %), dentro de la zona segura, sobre marfil.

**Legibilidad en teléfono:** `revision/movil-1a1.jpg` muestra los momentos clave a 390 px de ancho, el de un iPhone de 6,1″. A ese tamaño, la mayúscula de los titulares del gancho mide 38 px y el texto del CTA 18,8 px de cuerpo, equivalente a 18,8 pt en un iPhone de 6,1″. La referencia de texto cómodo en iOS es 17 pt.

**Zonas seguras:** todos los textos y el logo están dentro de x 65–1015, y 270–1248 por construcción (`SEGURA` en la línea de tiempo). `revision/zonas-seguras-A.jpg` lo muestra fotograma a fotograma con la guía superpuesta. El muro de anuncios ocupa todo el cuadro, pero no lleva información necesaria.

**Locución (pendiente):** todas las líneas están a ritmo natural, entre 5,0 y 5,6 sílabas/s, con el mismo criterio del v0. La voz termina en 14,0 s y deja 2,0 s de cierre sin voz.

## 3. Pendientes

| Pendiente | Qué bloquea | Qué hago cuando llegue |
|---|---|---|
| **Voz** | Sincronía con la locución y mezcla final | Se graba con `locucion/guion-locucion-v1.txt` (seis líneas). La música ya baja 5 dB en cada línea; edito las tomas, las alineo y vuelvo a medir la sonoridad y el pico con la voz |
| **Capturas en alta resolución** | Nitidez del formulario (hoy legible pero blando) | Reemplazo los cinco archivos de `capturas/` y vuelvo a renderizar; la animación no cambia |
| Rótulo «hasta X agentes» en la app | Nada en el anuncio (no se muestra) | — |

v0 verificado intacto: las huellas SHA-256 de los 36 archivos que ya existían (animatic v0, marca, subtítulos, locución y documentos 00–07) no cambiaron.
