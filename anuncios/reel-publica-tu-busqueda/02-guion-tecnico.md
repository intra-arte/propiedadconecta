# 3 · Guion técnico por escenas — v1 (23,5 s)

Formato 1080 × 1920 (9:16), **23,5 s**, para Reels y Stories. Personaje: **Daniela** (29, busca dónde vivir). La v1 ya no tiene escena de agente ni de contacto. Las referencias visuales están en [03-prompts-ia.md](03-prompts-ia.md).

> **Fuente de tiempos:** [animatic/linea-de-tiempo.js](animatic/linea-de-tiempo.js). La tabla definitiva, generada a partir de ella, es [animatic/tabla-de-tiempos.md](animatic/tabla-de-tiempos.md) y también trae la hoja de audio. Si este documento y la tabla no coinciden, manda la tabla.
>
> **Interfaz real:** E4 y E5 usan solo recortes de las capturas del formulario ([08](08-capturas-y-secuencia-v1.md)), sin redibujar nada. La v0 sigue congelada en [animatic/v0/](animatic/v0/LEEME.md).

## Resumen — versión A

| Escena | Tiempo (s) | Qué pasa | Voz | Texto en pantalla | Fuente |
|---|---|---|---|---|---|
| E1 Gancho | 0,0–2,4 | Noche: Daniela lee «ya se arrendó» / «ya se vendió» | L1 | «¿Otra vez?» + burbujas | Clip C01 + gráficos |
| E2 Agitación | 2,4–4,7 | Baja el celular y exhala; anuncios «NO DISPONIBLE» en loop | L2 | «Deja de perseguir anuncios.» | C01 + gráficos |
| E3 Giro | 4,7–6,4 | Mañana: abre Propiedad Conecta | L3 | «Publica lo que buscas.» | C02 |
| E4 El formulario real | 6,4–11,9 | La página se desplaza; cada tarjeta pasa de vacía a llena con un anillo | L4 | Las propias capturas | Capturas + C03 |
| E5 Tus datos y tu control | 11,9–17,6 | Datos de contacto, lupa sobre 1/3/5 agentes, toque en «Publicar solicitud» | L5, L6 | Subtítulos | Capturas |
| E6 Alivio + CTA | 17,6–20,0 | Daniela deja el celular y sale tranquila a la terraza | L7a | «Publica gratis tu búsqueda» | C06 |
| E7 Cierre | 20,0–23,5 | Logo + botón | L7b | Botón CTA | Edición |

**Versión B:** cambia solo 0–4,7 s (B1 y B2, ver [05](05-prueba-ab.md)); desde E3 es idéntica.

**Toda la locución aparece en pantalla** (titular, burbuja, captura o subtítulo), y cada línea se muestra una sola vez:

| Línea | Se muestra como | Bloques del SRT que se queman |
|---|---|---|
| L1 | Titular «¿Otra vez?» + burbujas «Ya se arrendó.» y «Ese ya se vendió.» | — |
| L2, L3, L7a | Titular | — |
| L4 | Las tarjetas reales del formulario, cada una cuando se la nombra | — |
| L5, L6 | Subtítulo | Los que indica la [tabla de tiempos](animatic/tabla-de-tiempos.md) |
| L7b | Logo | — |

---

## Sistema visual

Igual que en v0, más los componentes para mostrar la interfaz real.

### Paleta

| Token | HEX | Uso |
|---|---|---|
| Verde bosque | `#142A22` | Texto sobre fondos claros, botón CTA, telón del barrido |
| Verde conecta | `#4DA22D` | Anillos sobre la interfaz, íconos y acentos (no para texto pequeño sobre blanco) |
| Verde brote | `#92CE58` | Marcador de palabra resaltada, flecha del CTA, franja del barrido, brillo de los anillos |
| Azul marino | `#10213F` | Caja de subtítulos y sombras del «mundo problema» |
| Blanco / Marfil | `#FFFFFF` / `#FAF9F5` | Tarjetas, fondo del cierre |

### Tipografía, titulares y subtítulos

- **Outfit** (OFL; archivo en `animatic/fuentes/`).
  - Titulares: Bold 96 px (132 px en «¿Otra vez?»), con el borde superior en y = 300 px.
  - Subtítulos: SemiBold 60 px sobre caja marino al 88 %, con el centro en y ≈ 1140 px.
- **Resaltados:**
  - sobre fondo oscuro, la palabra en verde brote;
  - sobre fondo claro, marcador verde brote detrás de la palabra, con el texto en bosque.
- **Zonas seguras:** 270 px arriba, 672 px abajo y 65 px a los lados. El animatic las verifica cada 0,1 s.

### La interfaz real en pantalla

- **Recortes:** cada tarjeta del formulario es un recorte de una captura real, ampliado con Lanczos (`capturas/preparar.py`). No se redibuja, no se cambian textos y no se agregan campos.
- **Columna:** las tarjetas van apiladas, a 950 px de ancho y en el orden real de la página, dentro de una ventana que ocupa la zona segura (y 270–1248) con bordes desvanecidos.
- **Foco:** la columna se desplaza en 0,35 s para dejar cada tarjeta a y = 450 px; las demás quedan al 40 %.
- **Vacío → lleno:** fundido de 0,3 s entre la captura vacía y la llena del mismo formulario.
- **Anillo:** borde verde conecta de 5 px con brillo verde brote, alrededor de los campos que nombra la voz.
- **Lupa:** ampliación de un detalle real (la fila de 1/3/5 agentes) en una tarjeta blanca, a 4,5×.
- **Toque:** círculo verde brote que se expande sobre «Publicar solicitud».
- **Barrido chevrón:** telón verde bosque en V con franja verde brote, de 0,3 s. Se usa en E2 → E3 y en E6 → E7.

### Música y sonido

La música y los efectos van en la [hoja de audio](animatic/tabla-de-tiempos.md#hoja-de-audio-para-la-mezcla):
- 0–4,7 s: filtrada;
- 4,7 s: entra el beat;
- 17,6 s: pequeña subida;
- ~22 s: resolución.

Con licencia para pauta; efectos genéricos, nunca de otras marcas. Música 18–20 dB bajo la voz; mezcla final a −14 LUFS.

---

## Escenas

### E1 · Gancho — 0,0 → 2,4 s

- **Fuente:** clip C01 (primera parte) + gráficos.
- **Qué se ve:** de noche, plano medio corto de Daniela recostada en el sofá, con la cara iluminada por el celular. En el frame 0 ya están la persona y el titular.
- **Cámara:** dolly-in muy lento hacia el rostro, 50 mm.
- **Iluminación:** clave baja; luz fría del celular, lámpara cálida al fondo, sombras hacia el marino.
- **Sonido:** ambiente nocturno; «pop» de mensaje en 0,2 s y 1,25 s; música filtrada. Voz L1 (0,10–2,30 s).
- **Texto:** titular «¿Otra vez?». Burbujas: 0,2 s «Ya se arrendó.» · 1,25 s «Ese ya se vendió.». Entre 2,4 y 3,1 s suben y se desvanecen.
- **Transición:** ninguna; sigue el mismo plano.

### E2 · Agitación — 2,4 → 4,7 s

- **Fuente:** C01 (continúa) + gráficos.
- **Qué se ve:** Daniela baja el celular, apoya la cabeza y exhala. A los lados suben tarjetas de anuncios genéricos con sello «NO DISPONIBLE»; no imitan ningún portal real.
- **Sonido:** whooshes suaves del scroll, suspiro. Voz L2 (2,55–4,25 s).
- **Texto:** «Deja de perseguir anuncios.» («perseguir anuncios» en verde brote).
- **Transición → E3:** barrido chevrón centrado en 4,7 s; al terminar entra el beat.

### E3 · Giro — 4,7 → 6,4 s

- **Fuente:** C02.
- **Qué se ve:** a la mañana siguiente, junto a la ventana, Daniela abre Propiedad Conecta en su celular. La pantalla no se ve.
- **Cámara:** push-in lento con arco leve, 35 mm. Luz natural de ventana, clave alta.
- **Sonido:** entra el beat. Voz L3 (4,90–6,20 s).
- **Texto:** «Publica lo que buscas.».
- **Transición → E4:** zoom hacia el celular en los últimos 0,2 s; entra el formulario desde abajo.

### E4 · El formulario real — 6,4 → 11,9 s

- **Fuente:** recortes de las capturas reales sobre el clip C03 (manos escribiendo, muy desenfocado).
- **Qué se ve:**

  | Tiempo (s) | Tarjeta en foco | Qué pasa |
  |---|---|---|
  | 6,4–6,85 | Vista general | Entran la cabecera de la app (logo, «Para agentes», «Mi cuenta», «Cuéntanos qué propiedad estás buscando») y las primeras tarjetas |
  | 6,85–9,0 | «¿Qué estás buscando?» | 7,15: pasa de vacía a «Comprar una propiedad» marcado. Anillo en «¿Qué deseas hacer?» (6,85–7,9) y luego en «Tipo de propiedad: Departamento» (7,9–9,0) |
  | 9,0–9,75 | «Ubicación» | Vacía → Pichincha · Quito · Cumbayá; anillo en la fila |
  | 9,75–10,45 | «Presupuesto (USD)» | Vacía → 120000 / 180000; anillo en la fila |
  | 10,45–11,9 | «Características» | Vacía → 3 · 2 · 100 y casillas Amoblado y Seguridad; anillo en los números (10,5–11,1) y luego en las casillas (11,1–11,9) |

- **Sonido:** whoosh de entrada, tic suave en cada foco, clics al marcar. Voz L4 (6,80–11,70 s).
- **Texto:** el de las capturas; sin subtítulos.
- **Transición → E5:** continua: la página sigue desplazándose.

### E5 · Tus datos y tu control — 11,9 → 17,6 s

- **Fuente:** recortes reales de «Tus datos de contacto» (cortado antes del rótulo con la «X»), de la fila de 1/3/5 agentes y del botón «Publicar solicitud». Fondo: Daniela desenfocada.
- **Qué se ve:**
  - 11,9 s: foco en «Tus datos de contacto».
  - 12,1–15,4 s: anillo en «Teléfono / WhatsApp» y «Preferencia de contacto». Se ve qué dato recibe un agente. El teléfono de ejemplo está difuminado.
  - 15,45–17,0 s: la columna se atenúa y una lupa amplía «1 agente · 3 agentes · 5 agentes», con «3 agentes» marcado (tal como está en la captura).
  - 17,0 s: foco en «Publicar solicitud»; toque en 17,25 s.
  - No se muestra lo que pasa después, porque no hay captura de esa pantalla.
- **Sonido:** tic de foco, zoom suave en la lupa, clic al publicar. Voz L5 (12,10–15,30 s) y L6 (15,55–16,95 s).
- **Texto:** subtítulos «Si un agente tiene algo para ti,» / «puede contactarte.» y luego «Tú eliges hasta cuántos.».
- **Qué NO se muestra:** notificaciones, llamadas, mensajes ni conversaciones de agentes.
- **Transición → E6:** corte en el beat.

### E6 · Alivio + CTA — 17,6 → 20,0 s

- **Fuente:** C06, o una toma real de stock de Quito si la ciudad generada no convence.
- **Qué se ve:** Daniela deja el celular sobre la mesa y sale tranquila a la terraza con su café; Quito y el Pichincha de fondo, con el cielo limpio arriba para el titular. No espera ni recibe ningún contacto: deja de perseguir anuncios.
- **Cámara:** pull-back lento con ligera subida, 24–28 mm.
- **Sonido:** subida musical. Voz L7a (17,85–19,45 s).
- **Texto:** «Publica gratis tu búsqueda» («gratis» con marcador).
- **Transición → E7:** barrido chevrón centrado en 20,0 s.

### E7 · Cierre — 20,0 → 23,5 s

- **Fuente:** edición.
- **Qué se ve:** fondo marfil.
  - 20,15 s: logo (`marca/logo-horizontal-transparente.png` a 800 px, escala uniforme del 66 %), centrado en y ≈ 760, con fundido y escala 96 → 100 %, cuando la voz dice «en Propiedad Conecta».
  - 20,7 s: botón «Publica gratis tu búsqueda →» (759 × 120 px, borde superior en y = 1000).
  - 21,8 s: pulso sutil del botón.
- **Sonido:** voz L7b (20,15–21,45 s); firma sonora opcional; resolución musical en ~22 s.
- **Texto:** solo el botón. La URL o el dominio se agregan cuando estén confirmados.
- **Transición:** ninguna; el último frame sirve de frame de loop.
