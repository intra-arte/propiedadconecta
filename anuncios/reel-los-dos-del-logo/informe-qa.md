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

MEDICIONES

## 3. Lo que no se pudo comprobar

- **El texto de la voz** se verificó por duraciones y pausas; aquí no hay reconocimiento de voz. Hay que escuchar las cuatro líneas.
- **L5** no existe todavía.

## 4. Pendientes

1. **L5** con la misma voz (Arturo Casares, `eleven_v4`), generada desde la cuenta del cliente: «Regístrate gratis en Propiedad Conecta.». Al llegar se coloca después de que sube el botón y se vuelve a renderizar.
2. Subir las ramas a GitHub cuando el cliente lo autorice.
