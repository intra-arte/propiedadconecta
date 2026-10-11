# Informe de control de calidad — v1 de motion

Estado: **videos A y B con voz, provisionales porque falta la toma L2** («Publica lo que buscas.»). Están en `entregables/`. Dirección aprobada, «gratis» confirmado y formulario real integrado. Las mediciones de abajo se tomaron sobre los **MP4 finales exportados** (30 fps, desenfoque de movimiento de 10 subfotogramas), no sobre el navegador.

## 1. Iteraciones

Puntuación de 1 a 10. Un asterisco (\*) indica que la nota depende de un recurso que falta y **no puede llegar a 8 honestamente** hasta tenerlo.

| Criterio | Pasada 1 | Pasada 2 | Pasada 3 | Pasada 4 | Pasada 5 (voz) | Qué la limita hoy |
|---|---|---|---|---|---|---|
| Gancho en los primeros 2 s | 7 | 8 | 8 | 8 | **8** | — |
| Comprensión inmediata de la propuesta | 6\* | 7\* | 7\* | 8 | **8** | La voz ya nombra cada dato y el CTA. Falta que diga la idea central, L2 |
| Legibilidad en teléfono | 6 | 8 | 9 | 8 | **8** | El texto de las capturas se lee, pero se ve blando: llegaron a 800 × 500 |
| Calidad y originalidad del motion | 6 | 7 | 8 | 8 | **8** | — |
| Variedad visual | 7 | 7 | 7\* | 8 | **8** | — |
| Precisión de marca | 8 | 8 | 9 | 9 | **9** | — |
| Sincronía imagen–sonido | 6 | 6 | 8 | 8 | **8** | Cada frase cae con su tarjeta; falta L2 sobre el punto de la «i» |
| Claridad del CTA | 7 | 8 | 8 | 9 | **9** | — |

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
| 4 → 5 | La toma L3 dura 5,4 s y las tarjetas cambian cada 1,0 s: entera, «y lo que no puede faltar» llegaba 0,6 s después de «Características» | Se corta en sus cuatro frases, por las pausas naturales de la toma, y cada una se ancla a su tarjeta: de −0,18 a +0,22 s. Solo se acorta la pausa de los puntos suspensivos, de 0,38 a 0,17 s. No se estira ni se acelera la voz |
| 4 → 5 | En el gancho, los sellos y el pulso tapaban la voz: quedaba 6,8 dB sobre la música. El limitador de la mezcla recortaba hasta 6,3 dB en los picos de la voz | Los SFX también bajan bajo la voz, y una ganancia por frase lleva cada una a unos 10 dB sobre la música. La voz tiene su propio limitador, así que el de la mezcla recorta como máximo 2,3 dB |
| 4 → 5 | En B, la toma (2,5 s) pisaba L2. El CTA hablado empezaba 0,25 s antes de que se leyera el texto del botón | En B, la pausa después de «Esta vez,» pasa de 0,15 a 0,10 s: «el anuncio lo pones…» suena mientras la tarjeta se voltea a BUSCO y «tú» (2,3 s) cae en el giro del muro. L4 empieza cuando sube el texto del botón, y L5 la sigue como una sola frase |

## 2. Mediciones automáticas (`node control.mjs`)

| Comprobación | A | B | Esperado |
|---|---|---|---|
| Resolución / códec | 1080 × 1920 · h264 · yuv420p | igual | 1080 × 1920 · H.264 yuv420p |
| Duración / fps | 16,000 s · 30 | igual | 15–20 s |
| Tamaño | 4,1 MB | 4,0 MB | — |
| Sonoridad integrada (con voz) | −14,0 LUFS | −14,0 LUFS | ≈ −14 LUFS |
| Pico real | −1,9 dBTP | −2,0 dBTP | ≤ −1 dBTP |
| Cuadrícula de beats medida | 119,87 BPM, residuo 6,5 ms | desvío máx. 16,1 ms frente a A | < 1 fotograma (33 ms) |

**Sincronía del punto**, rastreado por color en el video exportado (1 fotograma = 33,3 ms):

| Impacto | Versión | Desvío medido |
|---|---|---|
| Salto 1 / 2 / 3 (cada uno sella un anuncio) | A | +22 / +5 / +21 ms |
| El punto cae en «BUSCO» | B | +5 ms |
| El punto cae como punto de la «i» | A · B | +20 ms · +20 ms |

**Voz.** Cada frase del stem de voz se buscó en el audio del MP4 exportado, por correlación, en ±60 ms. «Frente a la imagen» compara el inicio de la frase con el evento al que se ancla.

| Frase | Inicio (s) | Desfase en el MP4 | Frente a la imagen | Voz sobre música (A · B) |
|---|---|---|---|---|
| L1 «Deja de perseguir anuncios.» (A) | 0,10 | 0,0 ms | sale con el titular | 10,0 dB |
| LB1 «Esta vez,» / «el anuncio lo pones tú.» (B) | 0,04 / 0,90 | 0,0 ms | la segunda frase suena mientras la tarjeta se voltea a BUSCO (1,50 s) | 10,0 dB |
| L2 «Publica lo que buscas.» | — | **falta la toma** | hueco 2,69–4,10 s | — |
| L3 «Tipo de propiedad,» | 4,82 | 0,0 ms | −0,18 s (la tarjeta ya está en cuadro desde 4,3 s) | 10,0 dB |
| L3 «ubicación,» | 6,09 | 0,0 ms | +0,09 s | 10,0 dB |
| L3 «presupuesto…» | 7,16 | 0,0 ms | +0,16 s | 10,0 dB |
| L3 «y lo que no puede faltar.» | 8,22 | 0,0 ms | +0,22 s | 10,0 dB |
| L4 «Publica gratis tu búsqueda.» | 11,40 | 0,0 ms | +0,15 s después del botón; sale con su texto | 10,0 dB |
| L5 «En Propiedad Conecta.» | 13,24 | 0,0 ms | sigue a L4; el nombre ya subió en 12,63 s | 12,7 · 12,8 dB |

La correlación entre stem y audio exportado va de 0,84 a 0,96 en todas las frases. Procesamiento de la voz: paso alto a 80 Hz, el mismo nivel para todas las líneas, compresión de 2,5:1 (3–4,4 dB en las sílabas más fuertes) y un limitador de picos propio. La música baja 5 dB bajo cada frase, y el ritmo y los SFX bajan el 60 % de eso. La voz termina en 14,6 s y deja 1,4 s de cierre sin voz. `revision/voz-sobre-imagen-A.jpg` y `-B.jpg` muestran qué hay en pantalla cuando suena cada frase.

**Logo**, medido en el último fotograma del MP4: contenido de 825 × 220 px, proporción 3,750 frente a 3,733 del original. El desvío de 0,45 % viene del redondeo de bordes al codificar, el mismo margen que en el v0. Escala 77,5 % (≤ 100 %), dentro de la zona segura, sobre marfil.

**Legibilidad en teléfono:** `revision/movil-1a1.jpg` muestra los momentos clave a 390 px de ancho, el de un iPhone de 6,1″. A ese tamaño, la mayúscula de los titulares del gancho mide 38 px y el texto del CTA 18,8 px de cuerpo, equivalente a 18,8 pt en un iPhone de 6,1″. La referencia de texto cómodo en iOS es 17 pt.

**Zonas seguras:** todos los textos y el logo están dentro de x 65–1015, y 270–1248 por construcción (`SEGURA` en la línea de tiempo). `revision/zonas-seguras-A.jpg` lo muestra fotograma a fotograma con la guía superpuesta. El muro de anuncios ocupa todo el cuadro, pero no lleva información necesaria.

**Lo que no se pudo comprobar aquí:** este entorno no tiene reconocimiento de voz. Que cada toma diga su texto se verificó por el nombre del archivo, la duración y las pausas, no por transcripción. Hay que escucharlo.

## 3. Pendientes

| Pendiente | Qué bloquea | Qué hago cuando llegue |
|---|---|---|
| **Toma L2** «Publica lo que buscas.» | La voz de la idea central y su sincronía con el punto en la «i» | Va a `locucion/tomas/` y se corre la secuencia desde `node voz.mjs`. La música y la imagen ya le dejan el hueco (2,69–4,10 s) |
| **Origen de la voz** | Uso comercial, si la voz es sintética | Confirmar que la licencia de la herramienta permite publicidad pagada |
| **Capturas en alta resolución** | Nitidez del formulario (hoy legible, pero blando) | Reemplazo los cinco archivos de `capturas/` y vuelvo a renderizar; la animación no cambia |
| Rótulo «hasta X agentes» en la app | Nada en el anuncio (no se muestra) | — |

v0 verificado intacto: las huellas SHA-256 de los 36 archivos que ya existían (animatic v0, marca, subtítulos, locución y documentos 00–07) no cambiaron.
