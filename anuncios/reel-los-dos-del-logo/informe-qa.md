# Informe de control de calidad — «Los dos del logo»

Estado: **video completo** en `entregables/propiedad-conecta-los-dos-del-logo-sin-cta-hablado.mp4`, con la voz de L1–L4. **Falta L5**, el CTA hablado («Regístrate gratis en Propiedad Conecta.»): ElevenLabs desactivó la cuenta gratuita antes de generarla. En pantalla el CTA está completo (botón, línea para agentes y nombre); en ese tramo la música ya deja el hueco de la voz. Concepto y hoja de contactos aprobados el 13/10/2026. Las mediciones salen del **MP4 exportado** (30 fps, con desenfoque de movimiento).

## 1. Iteraciones

Puntuación de 1 a 10. Un asterisco (\*) indica que la nota depende de un recurso que falta y **no puede llegar a 8 honestamente** hasta tenerlo.

| Criterio | Hoja de contactos | Video con voz (sin L5) | Qué la limita hoy |
|---|---|---|---|
| Gancho en los primeros 2 s | 8 | **8** | — |
| Comprensión inmediata de la propuesta | 7\* | **8** | La voz ya dice qué ve el agente, que paga solo por el que elige y que recupera los créditos |
| Legibilidad en teléfono | 7 | **7** | El texto del diálogo y de «Protección del lead» queda chico; se leen sus títulos y botones |
| Calidad y originalidad del motion | 8 | **9** | — |
| Variedad visual | 8 | **8** | — |
| Precisión de marca | 9 | **9** | — |
| Sincronía imagen–sonido | 7\* | **8** | — |
| Claridad del CTA | 9 | **8\*** | Falta el CTA hablado (L5) |

**Problemas corregidos:**

| Pasada | Problema | Corrección |
|---|---|---|
| 1 → 2 | El agente quedaba montado sobre los clientes; parecían cuatro figuras apretadas | Los clientes van más a la izquierda y el agente se acerca a saltitos sin pasar entre ellos; crece la burbuja del cliente que mira |
| 1 → 2 | Justo antes del salto final, la ventana de la app tapaba las cabezas de los dos | Mientras la cámara se acerca, la app se achica y sube; después baja a la casa |
| 1 → 2 | La medición de beats quedaba corrida un cuarto de beat (129 ms), porque esta música no arranca con un golpe en el 0 | La herramienta del motor ahora ancla la cuadrícula al beat 0: desfase 4,4 ms |
| 2 → 3 | La moneda volaba bajo, a la altura de las cabezas, y se veía chica | Arcos más altos y moneda de radio 40 px |
| 3 → voz | La voz de ElevenLabs es pausada: cada línea dura entre 2,6 y 3,1 s, más que los huecos planeados | Se colocaron enteras, sin acelerar. Se corrieron eventos para que cada frase caiga sobre lo que nombra: el cliente se calla en 8,6 s, la moneda vuelve con «puedes recuperar» (10,0–10,5 s) y el segundo cliente contesta en 11,4 s |
| voz → final | El control marcaba «revisar» en dos aterrizajes (+62 y +95 ms): el cuerpo se hundía durante 160 ms después del contacto y el rastreo mide el punto más bajo | El cuerpo se hunde de golpe en 70 ms; el asentamiento suave queda en la cabeza, que llega un instante después |

## 2. Mediciones automáticas (`control.mjs` sobre el MP4)

| Comprobación | Resultado | Esperado |
|---|---|---|
| Resolución / códec | 1080 × 1920 · h264 · yuv420p | 1080 × 1920 · H.264 yuv420p |
| Duración / fps | 20,000 s · 30 | 15–20 s |
| Tamaño | 3,0 MB | — |
| Sonoridad integrada (con voz) | −14,0 LUFS | −14 ± 1 LUFS |
| Pico real | −2,2 dBTP | ≤ −1 dBTP |
| Cuadrícula de beats medida | 119,98 BPM, desfase 4,0 ms, residuo 6,1 ms | < 1 fotograma (33 ms) |

**Sincronía**, rastreando el verde claro del agente en el video exportado (1 fotograma = 33,3 ms):

| Impacto | Desvío medido |
|---|---|
| El punto aterriza sobre el cuerpo claro: es la cabeza del agente | −4 ms |
| Saltos del agente frente a los clientes (2.º, 3.º y 4.º) | −5 · +12 · +29 ms |

**Voz.** Cada frase del stem de voz se buscó en el audio del MP4 por correlación (±60 ms):

| Frase | Suena | Desfase en el MP4 | Correlación | Frente a la imagen | Voz sobre música |
|---|---|---|---|---|---|
| L1 «Tus próximos clientes ya están buscando.» | 0,10–2,71 s | 0,0 ms | 0,94 | sale con el titular | 10,0 dB |
| L2 «Ves qué buscan y cuánto quieren invertir.» | 2,90–5,94 s | 0,0 ms | 0,94 | «Ves qué buscan» mientras el agente mira a cada cliente; «cuánto quieren invertir» con «Su presupuesto» (5,0 s) | 10,0 dB |
| L3 «Pagas solo por el cliente que eliges.» | 6,15–8,77 s | 0,0 ms | 0,94 | la moneda entra en el candado en 7,25 s, en «por el cliente» | 10,0 dB |
| L4 «Si no responde, puedes recuperar tus créditos.» | 8,93–12,05 s | 0,0 ms | 0,94 | empieza 0,30 s después de que el cliente se calla; la moneda sale del candado en 10,0 s | 10,0 dB |
| L5 «Regístrate gratis en Propiedad Conecta.» | — | **falta la toma** | — | — | — |

La voz queda en conjunto 10,0 dB sobre la música y el limitador de la mezcla recorta como máximo 1,3 dB. Procesamiento: paso alto a 80 Hz, el mismo nivel para todas las líneas, compresión suave y un limitador propio. La música baja 5 dB bajo cada frase. Entre 12,05 y 20 s no hay voz: la conexión y el logo se cuentan con música, y el CTA está en pantalla. `revision/voz-sobre-imagen-A.jpg` muestra qué hay en pantalla cuando empieza cada frase.

**Logo**, medido en el último fotograma: contenido de 825 × 220 px, proporción 3,750 frente a 3,733 del original (desvío de 0,45 %, del redondeo de bordes al codificar). Escala 77,5 % (≤ 100 %), dentro de la zona segura, sobre marfil. Desde que los brazos se juntan, el logo se dibuja del archivo original, no de las piezas, así que no hay costura en el vértice.

**Legibilidad en teléfono:** `revision/movil-1a1.jpg` (390 px de ancho). El texto del botón «Regístrate gratis» mide 18,8 px de cuerpo y «Para agentes e inmobiliarias», 14,4 px.

## 3. Lo que no se pudo comprobar

- **El texto de la voz** se verificó por duraciones y pausas; aquí no hay reconocimiento de voz. Hay que escuchar las cuatro líneas.
- **L5** no existe todavía.

## 4. Pendientes

1. **L5** con la misma voz (Arturo Casares, `eleven_v4`), generada desde la cuenta del cliente: «Regístrate gratis en Propiedad Conecta.». Al llegar se coloca después de que sube el botón y se vuelve a renderizar.
2. Subir las ramas a GitHub cuando el cliente lo autorice.
