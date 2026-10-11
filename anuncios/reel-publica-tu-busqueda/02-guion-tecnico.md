# 3 · Guion técnico por escenas — Versión A (22 s)

Formato 1080 × 1920 (9:16), **22,0 s**. Personajes: **Daniela** (29, busca dónde vivir) y **Andrés** (40, agente inmobiliario). Sus referencias visuales están en [03-prompts-ia.md](03-prompts-ia.md).

> **Fuente de tiempos:** [animatic/linea-de-tiempo.js](animatic/linea-de-tiempo.js). La tabla definitiva, generada a partir de ella, está en [animatic/tabla-de-tiempos.md](animatic/tabla-de-tiempos.md). Si este documento y la tabla no coinciden, manda la tabla.
>
> **Sin acceso a la app:** E4, E5 y E6 usan marcadores «CAPTURA PENDIENTE» y «POR CONFIRMAR» en lugar de pantallas. No se describe ningún campo, botón, pantalla ni canal de contacto que no esté confirmado (ver [00-diagnostico.md](00-diagnostico.md)).

## Resumen

| Escena | Tiempo (s) | Qué pasa | Voz | Texto en pantalla | Fuente |
|---|---|---|---|---|---|
| E1 Gancho | 0,0–1,8 | Noche: Daniela lee «ya se arrendó» | L1 | «¿Otra vez?» + burbujas | Clip C01 + gráficos |
| E2 Agitación | 1,8–4,6 | Baja el celular y exhala; anuncios «NO DISPONIBLE» en loop | L2 | Titular L2 | C01 + gráficos |
| E3 Giro | 4,6–6,6 | Mañana: toma el celular decidida | L3 | Titular L3 | C02 |
| E4 Así funciona | 6,6–11,6 | **CAPTURA PENDIENTE:** formulario para publicar una búsqueda, y botón y pantalla posterior | L4 | La captura real | UI real + C03 |
| E5 Del otro lado | 11,6–14,4 | Un agente ve la búsqueda. **CAPTURA PENDIENTE:** vista del agente | L5 | Subtítulos | C04 + UI real |
| E6 Contacto | 14,4–17,0 | El celular de Daniela vibra; lo toma y mira la pantalla | L6 | Subtítulos | C05 |
| E7 Alivio + CTA | 17,0–19,3 | Plano abierto con Quito de fondo | L7a | «Publica gratis tu búsqueda» | C06 |
| E8 Cierre | 19,3–22,0 | Logo + botón CTA | L7b | Botón | Edición |

**Toda la locución aparece en pantalla de alguna forma**, así el anuncio se entiende sin sonido. Cada línea se muestra una sola vez:

| Línea | Se muestra como | Bloques del SRT que se queman |
|---|---|---|
| L1 | Titular «¿Otra vez?» + burbuja «Ya se arrendó.» (la burbuja «Ese ya se vendió.» es solo visual) | — |
| L2, L3, L7a | Titular | — |
| L4 | La captura del formulario (en el animatic: el marcador con los cuatro datos del brief) | — |
| L5, L6 | Subtítulo | 9–12 de `version-a.srt` |
| L7b | Logo | — |

---

## Sistema visual

### Paleta

Muestreada del logo. El azul marino se suma a pedido de la marca.

| Token | HEX | Origen | Uso |
|---|---|---|---|
| Verde bosque | `#142A22` | Texto del logo | Texto sobre fondos claros, botón CTA, telón del barrido |
| Verde conecta | `#4DA22D` | Círculo-persona claro | Íconos y acentos. No para texto pequeño sobre blanco (contraste 3:1). |
| Verde brote | `#92CE58` | Zona clara del techo | Resaltado de palabras, flecha del CTA, franja del barrido |
| Azul marino | `#10213F` | Propuesto (no está en el logo) | Caja de subtítulos y sombras del «mundo problema» |
| Blanco | `#FFFFFF` | — | Tarjetas; texto sobre marino o bosque |
| Marfil | `#FAF9F5` | Fondo del logo | Fondo del cierre |

Contrastes: blanco sobre marino 16:1 · blanco sobre bosque 15:1 · bosque sobre brote 8:1 · brote sobre marino 8,5:1.

**Proporción en pantalla:** ~60 % imagen real clara y neutra · ~30 % blanco o marfil · ~10 % verdes de acento. El marino solo va en subtítulos y en el color de las escenas nocturnas.

### Color de imagen

- **Mundo problema (E1–E2, noche):** sombras hacia azul marino, saturación −15 %, contraste suave. La única luz cálida es una lámpara.
- **Mundo solución (E3–E7, día):** luz natural, blancos limpios, verdes vivos de plantas, piel natural.
- Todos los clips pasan por una corrección base común antes del look.

### Tipografía

- **Outfit** (Google Fonts, licencia OFL): geométrica y con «a» de un piso, como el logotipo. Es compatible, **no** es la letra del logo. El archivo está en `animatic/fuentes/`.
- Titulares: Outfit Bold 96 px (el «¿Otra vez?» de E1, 132 px), interlineado 1,05, centrados, borde superior en y = 300 px.
- Subtítulos: Outfit SemiBold 60 px.
- UI: la tipografía real de la app.

### Titulares y resaltados

- Sobre fondos oscuros, texto blanco y palabra resaltada en verde brote.
- Sobre fondos claros, texto verde bosque y la palabra resaltada con un **marcador verde brote detrás** (texto bosque sobre brote, 8:1). Nunca texto verde brote sobre fondo claro: su contraste es menor a 2:1.
- Sobre video real con fondo cargado, el titular lleva una caja o un degradado suave detrás.

### Subtítulos

- Texto blanco sobre caja `#10213F` al 88 %, radio 20 px, relleno 14 × 28 px; centro de la caja en y ≈ 1140 px.
- Una línea (≤ 28 caracteres preferido, 32 máximo). Mínimo 0,8 s por bloque.

### Zonas seguras

Sin texto ni logo en los **270 px superiores, los 672 px inferiores y 65 px a cada lado** (Reels; cubre Stories). El animatic lo verifica automáticamente cada 0,1 s (ver `animatic/salida/informe-qa.md`).

### Componentes gráficos

- **Burbuja de chat (E1):** genérica, blanca con texto `#142A22`. Sin interfaz ni colores de ninguna app de mensajería real.
- **Anuncios genéricos (E2):** tarjetas blancas con foto gris y sello «NO DISPONIBLE», a los lados y desenfocadas; no imitan ningún portal real.
- **Botón CTA (E8):** fondo `#142A22`, texto blanco Outfit SemiBold 50 px, flecha `#92CE58`, alto 120 px, totalmente redondeado. Es un elemento gráfico del anuncio, no un botón de la app.
- **Barrido chevrón:** un telón verde bosque con borde en V (la pendiente del techo del logo) y una franja verde brote detrás. Sube en 0,3 s y cubre toda la pantalla justo en el frame del corte. **Solo dos usos:** E2 → E3 y E7 → E8.
- **Marcadores del animatic:** «CAPTURA PENDIENTE» (amarillo) para pantallas de la app que hay que reemplazar por capturas reales; «POR CONFIRMAR» (celeste) para datos de producto. «IMAGEN POR PRODUCIR» describe el plano que luego será un clip. Ninguno existe en el anuncio final.

### Música y sonido

- **Música:** electrónica minimal o house suave, 100–110 BPM, sin voces, cálida. Optimista pero sobria. Con licencia para pauta pagada (librería comercial o Sound Collection de Meta).
- **Estructura:** 0–4,6 s filtrada y casi inaudible → **4,6 s se abre el filtro y entra el beat**, con el barrido → 17,0 s pequeña subida → ~21,0 s resolución y cola hasta 22,0 s.
- **SFX** genéricos de librería; nunca el tono de WhatsApp, del iPhone ni de otras marcas.

---

## Escenas

### E1 · Gancho — 0,0 → 1,8 s

- **Fuente:** clip C01 (primera parte) + gráficos.
- **Qué se ve:** de noche, plano medio corto de Daniela recostada en el sofá, con la cara iluminada por el celular. **En el frame 0 ya están la persona y el titular.**
- **Cámara:** dolly-in muy lento hacia el rostro, 50 mm.
- **Iluminación:** clave baja; luz fría del celular, lámpara cálida tenue al fondo, sombras hacia el marino.
- **Sonido:** ambiente nocturno; «pop» de mensaje en 0,2 s y 0,9 s; música casi inaudible. Voz L1 (0,10–1,60 s).
- **Texto:** titular «¿Otra vez?» (blanco, 132 px). Burbujas junto al teléfono: 0,2 s «Ya se arrendó.» · 0,9 s «Ese ya se vendió.». Entre 1,9 y 2,6 s suben y se desvanecen.
- **Transición:** ninguna; sigue el mismo plano.

### E2 · Agitación — 1,8 → 4,6 s

- **Fuente:** C01 (continúa) + gráficos.
- **Qué se ve:** Daniela baja el celular al pecho, apoya la cabeza y exhala. A los lados suben en loop tarjetas de anuncios genéricos con sello «NO DISPONIBLE», desenfocadas y semitransparentes.
- **Cámara:** el push-in termina y se asienta.
- **Sonido:** whooshes suaves del scroll, suspiro natural; música filtrada. Voz L2 (1,80–4,40 s).
- **Texto:** titular «Deja de perseguir anuncios por todo Quito.» («perseguir anuncios» en verde brote).
- **Transición → E3:** barrido chevrón centrado en 4,6 s; al terminar entra el beat.

### E3 · Giro — 4,6 → 6,6 s

- **Fuente:** C02.
- **Qué se ve:** a la mañana siguiente, el mismo departamento lleno de luz. Daniela, junto a la ventana, toma el celular con decisión y empieza a escribir. La pantalla no se ve.
- **Cámara:** push-in lento con un arco leve, 35 mm.
- **Iluminación:** clave alta, luz natural de ventana, plantas verdes en primer plano.
- **Sonido:** entra el beat; ambiente diurno sutil. Voz L3 (4,75–6,55 s).
- **Texto:** titular «Mejor publica tú lo que buscas.» («tú» con marcador verde brote).
- **Transición → E4:** zoom hacia el celular en los últimos 0,2 s; la pantalla «crece» hasta ocupar el cuadro.

### E4 · Así funciona — 6,6 → 11,6 s · CAPTURA PENDIENTE

- **Fuente:** pantallas reales de la app (captura o grabación) sobre el clip C03 muy desenfocado.
- **Qué debe mostrar:** el formulario real para publicar una búsqueda, completándose en sincronía con la voz con los cuatro datos del brief: tipo de propiedad, ubicación, presupuesto y características. Desde 10,8 s, el botón real para publicar y la pantalla real que aparece después.
- **En el animatic:** marcador «CAPTURA PENDIENTE · Formulario para publicar una búsqueda». Los cuatro datos aparecen en 6,9 / 8,2 / 9,0 / 9,8 s, cuando la voz los nombra. Desde 10,8 s, un segundo marcador: «CAPTURA PENDIENTE · Botón para publicar y pantalla que aparece después».
- **Pendiente de la captura:** nombres exactos de los campos (si la app dice «Ubicación», la voz cambia «sector» por «ubicación»), cuántos pasos tiene el formulario, si hay selector de compra o arriendo, cómo se ingresan presupuesto y características, el texto del botón y la pantalla de después. **No se agregan campos ni funciones que no estén en la captura.** Recortar o ampliar la pantalla para mostrar solo lo relevante está permitido.
- **Sonido:** tap suave por dato, click al publicar. Voz L4 (6,90–11,10 s).
- **Texto:** el de la propia captura. Sin subtítulos.
- **Transición → E5:** el contenido sale por la derecha (11,35–11,6 s) y lo de E5 entra por la izquierda.

### E5 · Del otro lado — 11,6 → 14,4 s · CAPTURA PENDIENTE + POR CONFIRMAR

- **Fuente:** C04 + la vista real del agente (si se decide mostrarla).
- **Qué se ve:** Andrés, agente inmobiliario, en una oficina luminosa, mira su laptop con interés. La pantalla no se ve.
- **En el animatic:** «CAPTURA PENDIENTE · Cómo ve el agente una búsqueda» y «POR CONFIRMAR · ¿Los agentes ya usan la plataforma hoy?».
- **Pendiente:** si los agentes todavía no usan la plataforma, la voz «pueden ver tu búsqueda» no se puede decir en presente y esta escena cambia. Mostrar el lado del agente es opcional: si no hay captura o se prefiere no mostrarlo, queda solo el plano de Andrés.
- **Cámara:** plano medio en 3/4, push-in lento, 35 mm.
- **Sonido:** ambiente de oficina muy bajo. Voz L5 (11,70–14,35 s).
- **Texto:** subtítulos «Agentes inmobiliarios» / «pueden ver tu búsqueda».
- **Transición → E6:** corte; la vibración del celular se oye 4 frames antes.

### E6 · Contacto — 14,4 → 17,0 s · POR CONFIRMAR

- **Fuente:** C05.
- **Qué se ve:** de día, Daniela en una terraza con vista a la ciudad. El celular vibra sobre la mesa; lo toma y mira la pantalla (no visible), con una sonrisa leve.
- **En el animatic:** «POR CONFIRMAR · Canal de contacto: llamada, WhatsApp, correo o dentro de la app».
- **Pendiente:** el canal real define si ella contesta una llamada o lee un mensaje. La acción quedó neutral a propósito.
- **Qué NO se muestra:** nombre de quien contacta, notificaciones de la app, varios contactos seguidos, ni una reacción eufórica.
- **Cámara:** plano medio casi estático, 50 mm.
- **Sonido:** vibración (dos pulsos), ambiente exterior suave. Voz L6 (14,50–16,90 s).
- **Texto:** subtítulos «y contactarte» / «si tienen algo para ti.».
- **Transición → E7:** corte en el beat.

### E7 · Alivio + CTA — 17,0 → 19,3 s

- **Fuente:** C06, o una toma real de stock de Quito si la ciudad generada no convence.
- **Qué se ve:** plano abierto; Daniela, tranquila, con el celular en la mano; detrás, Quito y las laderas del Pichincha. Cielo limpio en el tercio superior para el titular.
- **Cámara:** pull-back lento con ligera subida, 24–28 mm.
- **Sonido:** la música en su punto más abierto. Voz L7a (17,30–18,90 s).
- **Texto:** titular «Publica gratis tu búsqueda» («gratis» con marcador verde brote), desde 17,25 s.
- **Transición → E8:** barrido chevrón centrado en 19,3 s.

### E8 · Cierre — 19,3 → 22,0 s

- **Fuente:** 100 % edición.
- **Qué se ve:** fondo marfil `#FAF9F5`.
  - 19,4 s: logo horizontal (archivo `marca/logo-horizontal-transparente.png` a 800 px de ancho, escala 66 %; el dibujo mide ~705 px), centrado con su centro en y ≈ 760 px. Entra con fundido y escala uniforme 96 → 100 % en 0,4 s, justo cuando la voz dice «en Propiedad Conecta».
  - 19,9 s: botón «Publica gratis tu búsqueda →» (759 × 120 px, borde superior en y = 1000 px).
  - 21,0 s: pulso sutil del botón (100 → 104 → 100 %).
- **Sonido:** voz L7b (19,40–20,70 s); firma sonora opcional de dos notas al aparecer el logo; resolución de la música en ~21,0 s.
- **Texto:** solo el botón. «Ahora en Quito» y la URL quedan fuera hasta confirmar cobertura y dominio.
- **Transición:** ninguna. El último frame es el cierre completo y funciona como frame de loop.
