# Informe de control de calidad — anuncio para agentes

Estado: **videos completos A y B, todavía sin voz**, en `entregables/` (`*-sin-voz.mp4`). La imagen y la música son las finales. La música ya deja los huecos de las seis líneas de voz. Concepto aprobado y hoja de contactos aprobada el 12/10/2026; «gratis» confirmado. Las mediciones de abajo salen de los **MP4 exportados** (30 fps, con desenfoque de movimiento), no del navegador.

## 1. Iteraciones

Puntuación de 1 a 10. Un asterisco (\*) indica que la nota depende de un recurso que falta y **no puede llegar a 8 honestamente** hasta tenerlo.

| Criterio | Hoja de contactos | Video completo, sin voz | Qué la limita hoy |
|---|---|---|---|
| Gancho en los primeros 2 s | 8 | **8** | — |
| Comprensión inmediata de la propuesta | 7\* | **7\*** | Falta la voz: «Si no responde, puedes recuperar tus créditos» solo lo dice la voz |
| Legibilidad en teléfono | 7 | **7** | El texto de la tarjeta «Protección del lead» no se lee a tamaño de teléfono (ver abajo) |
| Calidad y originalidad del motion | 8 | **8** | — |
| Variedad visual | 8 | **8** | — |
| Precisión de marca | 9 | **9** | — |
| Sincronía imagen–sonido | 7\* | **7\*** | Falta la voz; la imagen y la música están en la cuadrícula |
| Claridad del CTA | 9 | **9** | — |

**Problemas corregidos antes de la hoja de contactos** (primera pasada → segunda):

| Problema | Corrección |
|---|---|
| Las monedas se veían chicas: en el teléfono no se reconocían como monedas | Monedas más grandes (radio 56 px) con «$», que giran mientras caen y que el anuncio se traga |
| Los anuncios seguían cayendo cuando subía el titular | Caen con gravedad, escalonados desde el punto, y el fondo marfil se abre desde el punto: salen antes del titular |
| El punto cruzaba por encima de las letras al saltar a la «i» y al dejarla | Salto balístico que baja siempre sobre la «i»; durante los saltos el punto pasa por detrás del texto |
| La onda de peso del titular tardaba unos 0,9 s en recorrer las 30 letras | Más rápida y con caída: se lee como un golpe, no como una ola |

**Revisión del video completo.** Se miró el archivo exportado con un fotograma por segundo (`revision/archivo-final-{A,B}-cada-1s.jpg`) y las transiciones del producto cada 0,1 s (de 6,9 a 9,2 s). No hay saltos ni pantallas a medio cargar: cada pantalla entra desde abajo mientras la anterior sale por arriba, la cámara se acerca al botón «Desbloquear contacto» sin cortar texto y ningún dato de prueba entra en cuadro. No hizo falta otra pasada.

## 2. Mediciones automáticas (`control.mjs` sobre los MP4)

| Comprobación | A | B | Esperado |
|---|---|---|---|
| Resolución / códec | 1080 × 1920 · h264 · yuv420p | igual | 1080 × 1920 · H.264 yuv420p |
| Duración / fps | 18,000 s · 30 | igual | 15–20 s |
| Tamaño | 3,1 MB | 3,1 MB | — |
| Sonoridad integrada (sin voz) | −14,0 LUFS | −14,0 LUFS | −14 ± 1 LUFS |
| Pico real | −2,0 dBTP | −2,0 dBTP | ≤ −1 dBTP |
| Cuadrícula de beats medida | 120,10 BPM, residuo 8,3 ms | desvío máx. 15,8 ms frente a A | < 1 fotograma (33 ms) |

**Sincronía del punto**, rastreado por color en el video exportado (1 fotograma = 33,3 ms): el punto cae en el lugar del punto de la «i» de «interesados» a los 2,767 s, frente a los 2,754 s del beat. Desvío: **+12 ms** en A y en B.

**Voz.** No hay tomas todavía. `control.mjs` marca las seis líneas como «falta la toma» y `revision/voz-sobre-imagen-{A,B}.jpg` muestra qué hay en pantalla en cada hueco. La música baja 5 dB en cada hueco (el ritmo y los SFX, el 60 % de eso), así que en el video sin voz se nota una bajada suave en esos tramos. Cuando lleguen las tomas, se colocan sobre esos huecos y se vuelve a renderizar: la imagen no cambia.

**Logo**, medido en el último fotograma del MP4: contenido de 825 × 220 px, proporción 3,750 frente a 3,733 del original. El desvío de 0,45 % viene del redondeo de bordes al codificar, el mismo margen que en el anuncio para compradores. Escala 77,5 % (≤ 100 %), dentro de la zona segura (x 128–952, y 686–905) y sobre marfil.

**Legibilidad en teléfono.** `revision/movil-1a1.jpg` muestra los momentos clave del MP4 a 390 px de ancho, el de un iPhone de 6,1″. A ese tamaño, el texto del botón «Regístrate gratis» mide 18,8 px de cuerpo y «Para agentes e inmobiliarias», 14,4 px. Se leen la tarjeta del marketplace (con el presupuesto), el aviso de contacto oculto, el botón, el diálogo de confirmación y «Contactar por WhatsApp». El texto de «Protección del lead» no se lee: sus líneas son largas y la tarjeta solo cabe entera a 1,4× de la captura. Se lee su título, y el mensaje lo llevan la cabecera «Protección» y la voz (L4).

## 3. Lo que no se pudo comprobar

- **Voz:** no hay tomas. Comprensión y sincronía quedan con asterisco hasta integrarlas.
- **Créditos en las capturas:** el detalle y el diálogo muestran «10 créditos», que es lo que la app cobra hoy por un interesado en comprar. El anuncio no dice precios, pero si el sistema cambia antes de publicar, hay que volver a capturar esas dos pantallas (`capturas/LEEME.md`).

## 4. Pendientes

1. Las seis tomas de voz (L1, LB1, L2, L3, L4, L5), con el guion de `locucion/guion-locucion.txt`. Al llegar: colocarlas, correr `todo` y reemplazar los `*-sin-voz.mp4` por los finales, con la mezcla y el stem de voz en `entregables/audio/`.
2. Subir la rama `claude/propiedad-conecta-agentes` a GitHub cuando el cliente lo autorice.
