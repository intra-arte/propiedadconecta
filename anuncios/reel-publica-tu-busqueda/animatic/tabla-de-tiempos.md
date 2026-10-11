# Tabla de tiempos definitiva — animatic v1

Generada desde [linea-de-tiempo.js](linea-de-tiempo.js) con `node generar.mjs`. **No editar a mano:** cambiar la línea de tiempo y volver a generar.

**Duración: 23,5 s exactos** · 30 fps · 705 frames · 1080 × 1920. La voz termina en 21,45 s; los últimos 2,1 s son el cierre sin voz.

## Versión A — escenas

| Escena | Inicio (s) | Fin (s) | Duración (s) | Fuente | Texto en pantalla | Salida |
|---|---|---|---|---|---|---|
| E1 Gancho | 0,0 | 2,4 | 2,4 | Clip C01 (primera parte) | Titular «¿Otra vez?» · Burbuja «Ya se arrendó.» · Burbuja «Ese ya se vendió.» | Sigue el mismo plano |
| E2 Agitación | 2,4 | 4,7 | 2,3 | Clip C01 (continúa) | Anuncios genéricos «NO DISPONIBLE» · Titular «Deja de perseguir anuncios.» | Barrido chevrón; entra el beat |
| E3 Giro | 4,7 | 6,4 | 1,7 | Clip C02 | Titular «Publica lo que buscas.» | Zoom hacia el celular; entra el formulario |
| E4 El formulario real | 6,4 | 11,9 | 5,5 | Capturas reales del formulario + clip C03 desenfocado | Capturas reales: cabecera de la app, «¿Qué estás buscando?», «Ubicación», «Presupuesto (USD)», «Características», «Tus datos de contacto», botón «Publicar solicitud»; lupa sobre «1 agente · 3 agentes · 5 agentes» | El formulario sigue en E5 |
| E5 Tus datos y tu control | 11,9 | 17,6 | 5,7 | Capturas reales: datos de contacto, opciones de agentes y botón | Subtítulo «Si un agente tiene algo para ti, puede contactarte.» · Subtítulo «Tú eliges hasta cuántos.» | Corte en el beat |
| E6 Alivio + CTA | 17,6 | 20,0 | 2,4 | Clip C06 (o stock real de Quito) | Titular «Publica gratis tu búsqueda» | Barrido chevrón al cierre |
| E7 Cierre | 20,0 | 23,5 | 3,5 | Edición: logo original + botón | Logo · Botón «Publica gratis tu búsqueda →» | El último frame sirve de frame de loop |

## Versión A — locución

Ritmo: «natural» ≤ 5,8 sílabas/s · «ágil» ≤ 6,3 · más rápido = acelerado.

| Línea | Inicio (s) | Fin (s) | Texto | Sílabas | Síl./s | Ritmo | En pantalla como |
|---|---|---|---|---|---|---|---|
| L1 | 0,10 | 2,30 | ¿Otra vez «ya se arrendó»? ¿«Ya se vendió»? | 12 | 5,5 | natural | Titular «¿Otra vez?» + burbujas |
| L2 | 2,55 | 4,25 | Deja de perseguir anuncios. | 9 | 5,3 | natural | Titular |
| L3 | 4,90 | 6,20 | Publica lo que buscas. | 7 | 5,4 | natural | Titular |
| L4 | 6,80 | 11,70 | Comprar o alquilar, tipo de propiedad, sector, presupuesto… y lo que no puede faltar. | 26 | 5,3 | natural | Capturas reales del formulario, con anillos |
| L5 | 12,10 | 15,30 | Si un agente tiene algo para ti, puede contactarte. | 18 | 5,6 | natural | Subtítulo |
| L6 | 15,55 | 16,95 | Tú eliges hasta cuántos. | 8 | 5,7 | natural | Subtítulo |
| L7a | 17,85 | 19,45 | Publica gratis tu búsqueda… | 9 | 5,6 | natural | Titular |
| L7b | 20,15 | 21,45 | en Propiedad Conecta. | 7 | 5,4 | natural | Logo |

**Subtítulos que se queman:** bloques 9–11 de `subtitulos/version-a.srt`. El resto de la voz ya aparece como titular, burbuja, captura o logo.

## Versión B — lo que cambia (0,0–4,7 s)

Desde 4,7 s, B es idéntica a A: las mismas escenas y la misma locución salen del mismo bloque de la línea de tiempo.

| Escena | Inicio (s) | Fin (s) | Duración (s) | Fuente | Texto en pantalla | Salida |
|---|---|---|---|---|---|---|
| B1 Gancho B | 0,0 | 2,4 | 2,4 | Clip C07 + cartel compuesto en edición + captura real | Titular «Esta vez, el anuncio lo pones tú.» · Cartel «SE ARRIENDA» → captura real «¿Qué estás buscando?» | Corte directo |
| B2 Pregunta | 2,4 | 4,7 | 2,3 | Clip C08 | Subtítulo «¿Vas a comprar o alquilar en Quito?» | Barrido chevrón; entra el beat |

| Línea | Inicio (s) | Fin (s) | Texto | Sílabas | Síl./s | Ritmo | En pantalla como |
|---|---|---|---|---|---|---|---|
| LB1 | 0,10 | 2,30 | Esta vez, el anuncio lo pones tú. | 11 | 5,0 | natural | Titular |
| LB2 | 2,50 | 4,50 | ¿Vas a comprar o alquilar en Quito? | 11 | 5,5 | natural | Subtítulo |

**Subtítulos que se queman en B:** bloques 2–3, 9–11 de `subtitulos/version-b.srt`.

## Hoja de audio (para la mezcla)

Música (con licencia para pauta, sin voces, 100–110 BPM). Mientras hay voz, va de 18 a 20 dB por debajo. Mezcla final: −14 LUFS integrados, pico ≤ −1 dBTP.

| Tiempo (s) | Música |
|---|---|
| 0,00 | Filtrada y casi inaudible (mundo problema) |
| 4,70 | Se abre el filtro y entra el beat, con el barrido |
| 17,60 | Pequeña subida al pasar al cierre |
| 22,00 | Resolución; cola hasta el final |

Efectos (genéricos de librería; nunca sonidos de otras marcas):

| Tiempo (s) | Escena | Efecto |
|---|---|---|
| 0,00 | E1 | Ambiente nocturno de interior |
| 0,20 | E1 | Pop de mensaje (sonido genérico) |
| 1,25 | E1 | Pop de mensaje |
| 2,40 | E2 | Whooshes suaves del scroll de anuncios |
| 2,60 | E2 | Suspiro (del clip) |
| 4,55 | E2 | Whoosh del barrido |
| 4,70 | E3 | Entra el beat; ambiente diurno sutil |
| 6,40 | E4 | Whoosh suave: entra el formulario |
| 6,85 | E4 | Tic suave de foco |
| 7,15 | E4 | Clic: se marca «Comprar una propiedad» |
| 9,00 | E4 | Tic de foco |
| 9,75 | E4 | Tic de foco |
| 10,45 | E4 | Tic de foco |
| 10,60 | E4 | Clic: se marcan las casillas |
| 11,90 | E5 | Tic de foco |
| 15,45 | E5 | Zoom suave (lupa sobre las opciones) |
| 17,25 | E5 | Clic: «Publicar solicitud» |
| 17,60 | E6 | Subida musical; ambiente exterior suave |
| 19,85 | E6 | Whoosh del barrido |
| 20,15 | E7 | Firma sonora opcional de dos notas |
| 22,00 | E7 | Resolución de la música |

Efectos del gancho B (reemplazan a los de E1–E2):

| Tiempo (s) | Escena | Efecto |
|---|---|---|
| 0,00 | B1 | Ambiente de calle, tráfico lejano |
| 0,50 | B1 | Cartulina que gira + whoosh |
| 2,40 | B2 | Pasos y ambiente de calle |
| 4,55 | B2 | Whoosh del barrido |

Locución A (para colocarla en la mezcla):

| Tiempo (s) | Línea | Texto |
|---|---|---|
| 0,10–2,30 | L1 | ¿Otra vez «ya se arrendó»? ¿«Ya se vendió»? |
| 2,55–4,25 | L2 | Deja de perseguir anuncios. |
| 4,90–6,20 | L3 | Publica lo que buscas. |
| 6,80–11,70 | L4 | Comprar o alquilar, tipo de propiedad, sector, presupuesto… y lo que no puede faltar. |
| 12,10–15,30 | L5 | Si un agente tiene algo para ti, puede contactarte. |
| 15,55–16,95 | L6 | Tú eliges hasta cuántos. |
| 17,85–19,45 | L7a | Publica gratis tu búsqueda… |
| 20,15–21,45 | L7b | en Propiedad Conecta. |
