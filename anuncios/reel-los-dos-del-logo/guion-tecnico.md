# Guion técnico — Propiedad Conecta · «Los dos del logo» · agentes

Generado desde [guion.js](guion.js) con `generar-textos.mjs` del motor. **No editar a mano.**

**20,0 s** · 120 BPM (1 beat = 0,50 s, 40 beats = 10 compases) · 1080 × 1920 · 30 fps · tiempos en segundos según la cuadrícula **medida** (`beats.json`: 119,99 BPM, desfase 4,1 ms).
Zona segura para texto y logo: x 65–1015, y 270–1248 (la de la marca, en `motor/nucleo/marca.js`).

**Pendiente:** nada.

Un solo gancho: no hay versión B.

## Versión A — directa

| Escena | Beats | Inicio (s) | Fin (s) | Texto en pantalla | Qué pasa |
|---|---|---|---|---|---|
| A1 · Gancho · ya están buscando | 0,00–6,00 | 0,00 | 3,00 | «Tus próximos clientes ya están buscando.» | Fondo marfil. Tres clientes (la persona verde oscura del logo) caen uno por beat en una fila, cada uno con una burbuja de lo que busca: casa, departamento, arriendo. El cuerpo claro brota del suelo y el punto verde cae sobre él: es la cabeza del agente. |
| C1 · Elige | 6,00–11,00 | 3,00 | 5,50 | «Qué busca Su presupuesto» | El agente pasa saltando frente a los clientes; cada burbuja crece cuando pasa. Se queda con el del medio: su burbuja sube y se abre en la app real (la tarjeta del marketplace, después su presupuesto). |
| C2 · La moneda | 11,00–16,00 | 5,50 | 8,01 | «Tú eliges Desbloqueas» | A cada cliente le aparece un candado. Arriba, el contacto oculto y el botón «Desbloquear contacto»; después, el diálogo. El agente lanza una moneda que gira en el aire y entra en el candado del elegido: se abre. |
| C3 · No responde | 16,00–20,00 | 8,01 | 10,01 | «Protección» | El cliente muestra «…» y se apaga: no contesta. Arriba, la tarjeta «Protección del lead». La moneda sale y vuelve a la mano del agente. |
| C4 · Responde | 20,00–25,00 | 10,01 | 12,51 | «Contactas» | La misma moneda abre el candado del cliente de la izquierda. Contesta (globo de chat) y salta. Arriba, «Contactar por WhatsApp». Los otros se apartan y los dos van al centro; la cámara se acerca. |
| C5 · Se forma el logo | 25,00–29,50 | 12,51 | 14,76 | — | Se agachan, saltan uno hacia el otro y sus brazos se juntan en el vértice: el techo. La app baja y se vuelve la ventana, que se enciende cuadro a cuadro. Es el logo original. |
| K · Cierre · marca + CTA | 29,50–40,00 | 14,76 | 20,00 | «Regístrate gratis Para agentes e inmobiliarias» | El logo va a su lugar. Suben el botón «Regístrate gratis», la línea «Para agentes e inmobiliarias» y el nombre. Fondo marfil; se sostiene completo. |

## Eventos de imagen y sonido (beat → segundo)

| Evento | Beat | Segundo | Imagen | Sonido |
|---|---|---|---|---|
| Clientes | 0,50 · 1,50 · 2,50 | — | cada cliente cae en su lugar y le brota la burbuja de lo que busca | madera grave + burbuja |
| Agente | 3,00 · 4,00 | — | el cuerpo claro brota y el punto cae sobre él: es la cabeza | caída + marimba re (la voz del punto) |
| Saltos | 6,50 · 7,00 · 7,50 · 8,00 | — | el agente pasa saltando frente a los clientes | marimba en escala |
| Burbuja | 8,25 | 4,13 | la burbuja del elegido sube y se abre en la app real | barrido brillante |
| Pasos | 9,00 · 10,00 · 11,50 · 13,50 · 17,50 · 22,50 | — | qué busca · su presupuesto · tú eliges · desbloqueas · protección · contactas | marimba por paso |
| Candados | 11,00 · 11,25 · 11,50 | — | a cada cliente le aparece un candado | tres clics |
| Moneda | 13,75 · 14,50 · 14,75 | — | la moneda sale de la mano, gira, entra en el candado y lo abre | moneda + clic + marimba |
| No contesta | 15,50 · 17,25 | — | «…» y se apaga | tres toques suaves + tono que se apaga |
| Vuelve | 20,00 · 21,00 | — | la moneda sale del candado y vuelve a la mano | moneda al revés |
| Otra vez | 21,25 · 22,00 · 22,25 | — | la misma moneda abre al otro cliente | moneda + clic |
| Responde | 22,75 | 11,38 | globo de chat y un salto | marimba la |
| Al centro | 23,50 · 24,00 | — | los otros se apartan; los dos saltan al centro y la cámara se acerca | pasos + subida |
| Se juntan | 26,50 | 13,26 | saltan y los brazos se juntan en el vértice: el techo | acorde re mayor + grave |
| Ventana | 26,75 · 27,00 · 27,25 · 27,50 | — | la app baja y se vuelve la ventana, cuadro a cuadro | re–fa#–la–re |
| CTA | 30,00 | 15,01 | sube el botón «Regístrate gratis» | firma sonora: la |
| Nota | 31,00 | 15,51 | sube «Para agentes e inmobiliarias» | — |
| Nombre | 32,50 | 16,26 | el logo se acomoda y sube el nombre | firma sonora: fa# + campana |
| Empujes | 35,00 · 37,00 | — | la flecha del botón empuja | clic suave |

## Locución A

Tiempos reales de cada frase en la mezcla (`locucion/colocacion.json`). «Imagen» es el segundo nominal del evento al que se ancla la frase (la cuadrícula medida difiere en menos de 10 ms). Ritmo: «natural» ≤ 5,8 sílabas/s · «ágil» ≤ 6,3.

| Línea | Frase | Inicio (s) | Fin (s) | Ancla | Imagen (s) | Síl./s |
|---|---|---|---|---|---|---|
| L1 | Tus próximos clientes ya están buscando. | 0,10 | 2,71 | 0,10 s | — | 4,6 |
| L2 | Ves qué buscan y cuánto quieren invertir. | 2,90 | 5,93 | beat 6 (beat 6,00) −0,10 s | 3,00 | 4,0 |
| L3 | Pagas solo por el cliente que eliges. | 6,15 | 8,77 | pasos[2] (beat 11,50) +0,40 s | 5,75 | 4,6 |
| L4 | Si no responde, puedes recuperar tus créditos. | 8,93 | 12,04 | silencio (beat 17,25) +0,30 s | 8,63 | 4,8 |

La voz termina en 12,04 s: quedan 8,0 s de cierre sin voz con el logo y el CTA completos.

Toda la locución aparece también como texto en pantalla (titulares, cabecera o botón). Los subtítulos `.srt` son para la plataforma; no se queman.
