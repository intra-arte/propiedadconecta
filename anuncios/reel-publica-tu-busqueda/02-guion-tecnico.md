# 3 · Guion técnico por escenas — Versión A

Formato 1080 × 1920 (9:16), 25,0 s. Personajes: **Daniela** (29, busca dónde vivir) y **Andrés** (40, agente inmobiliario). Las referencias visuales de ambos están en [03-prompts-ia.md](03-prompts-ia.md).

## Resumen

| Escena | Tiempo (s) | Qué pasa | Voz | Texto en pantalla | Fuente |
|---|---|---|---|---|---|
| E1 Gancho | 0,0–2,2 | Noche: Daniela lee «ya se arrendó» | L1 | «¿Otra vez?» + burbujas | Clip C01 + gráficos |
| E2 Agitación | 2,2–4,8 | Baja el celular, exhala; anuncios en loop | L2 | Titular L2 | C01 + gráficos |
| E3 Giro | 4,8–6,8 | Mañana: toma el celular decidida | L3 | Titular L3 | C02 |
| E4 Así funciona | 6,8–12,0 | Formulario en 4 campos + «Publicar gratis» | L4 | Rótulos de la UI | UI real + C03 |
| E5 Del otro lado | 12,0–14,9 | Un agente ve la búsqueda | L5 | Subtítulos | C04 + tarjeta UI |
| E6 Contacto | 14,9–17,8 | El celular de Daniela vibra; contesta | L6 | Subtítulos | C05 |
| E7 Alivio + CTA | 17,8–20,1 | Plano abierto con Quito de fondo | L7a | «Publica gratis tu búsqueda» | C06 |
| E8 Cierre | 20,1–25,0 | Logo + botón CTA | L7b | Botón + «Ahora en Quito» | Edición |

**Toda la locución aparece en pantalla de alguna forma** (titular, burbuja, campo de UI o subtítulo), así el anuncio se entiende sin sonido. Para no duplicar texto, cada línea se muestra **una sola vez**:

| Línea | Se muestra como | Bloques del SRT que se queman |
|---|---|---|
| L1 | Titular «¿Otra vez?» + burbujas | — |
| L2, L3 | Titular | — |
| L4 | Rótulos y valores de la UI | — |
| L5, L6 | Subtítulo | 10–13 de `version-a.srt` |
| L7a | Titular | — |
| L7b | Logo | — |

---

## Sistema visual

### Paleta

Muestreada del logo. El azul marino se suma a pedido de la marca.

| Token | HEX | Origen | Uso |
|---|---|---|---|
| Verde bosque | `#142A22` | Texto del logo | Texto principal, botón CTA, primera capa del barrido |
| Verde conecta | `#4DA22D` | Círculo-persona claro | Íconos, checks, acentos. No para texto pequeño sobre blanco (contraste 3:1). |
| Verde brote | `#92CE58` | Zona clara del techo | Palabra resaltada, flecha del CTA, segunda capa del barrido |
| Azul marino | `#10213F` | Propuesto (no está en el logo) | Caja de subtítulos y sombras del «mundo problema» |
| Blanco | `#FFFFFF` | — | Tarjetas de UI; texto sobre marino o bosque |
| Marfil | `#FAF9F5` | Fondo del logo | Fondo del cierre |

Contrastes: blanco sobre marino 16:1 · blanco sobre bosque 15:1 · bosque sobre brote 8:1 · brote sobre marino 8,5:1.

**Proporción en pantalla:** ~60 % imagen real clara y neutra · ~30 % blanco o marfil (UI y cierre) · ~10 % verdes de acento. El marino solo va en subtítulos y en el color de las escenas nocturnas.

### Color de imagen

- **Mundo problema (E1–E2, noche):** sombras hacia azul marino, saturación −15 %, contraste suave. La única luz cálida es una lámpara.
- **Mundo solución (E3–E7, día):** luz natural, blancos limpios, verdes vivos de plantas, piel natural. Sin filtros de moda.
- Todos los clips pasan por una **corrección base común** (exposición, balance, piel) antes del look, para que parezcan rodados con la misma cámara.

### Tipografía

- **Outfit** (Google Fonts, licencia OFL, gratuita): geométrica y con «a» de un piso, como el logotipo. Es compatible, **no** es la letra del logo: nunca se escribe «Propiedad Conecta» con ella en lugar del logo.
- Titulares: Outfit Bold 92–104 px, interlineado 1,05, máximo 3 líneas, centrados.
- Subtítulos: Outfit SemiBold 60 px.
- UI: la tipografía real de la app.

### Subtítulos

- Texto blanco sobre caja `#10213F` al 88 %, radio 20 px, relleno 14 × 28 px.
- Una línea preferida (≤ 28 caracteres), máximo dos. Mínimo 0,8 s por bloque.
- Centro de la caja en y ≈ 1140 px (borde inferior ≤ 1240 px).
- Opcional: palabra activa en verde brote `#92CE58`.

### Zonas seguras

Sin texto ni logo en los **270 px superiores, los 672 px inferiores y 65 px a cada lado** (zona de Reels según la guía de Meta; cubre también Stories). Todo texto vive entre y = 270 y y = 1248. Verificar con la plantilla oficial de zonas seguras.

### Componentes gráficos

Se diseñan una vez y se reutilizan en todas las escenas.

- **Tarjeta UI:** blanca, radio 28 px, sombra `0 12 32 rgba(20,42,34,.18)`, relleno 32 px.
- **Chip:** fondo `#EAF5E1`, texto `#142A22`, totalmente redondeado.
- **Botón CTA:** fondo `#142A22`, texto blanco Outfit SemiBold, flecha `#92CE58`, alto 112 px, totalmente redondeado.
- **Burbuja de chat (E1):** genérica, blanca con texto `#142A22`. Sin interfaz ni colores de ninguna app de mensajería real.
- **Barrido chevrón:** dos formas en V invertida (el techo del logo), `#142A22` y `#92CE58` desfasadas 3 frames, de abajo hacia arriba en 10 frames, con curva suave al entrar y salir. **Solo dos usos:** E2→E3 y E7→E8.

### Música y sonido

- **Música:** electrónica minimal o house suave, 100–110 BPM, sin voces, cálida (pluck, Rhodes, bajo redondo). Optimista pero sobria.
- **Estructura:** 0–4,8 s filtrada y casi inaudible → **4,8 s se abre el filtro y entra el beat** (el giro también se escucha) → 17,8 s pequeña subida → ~23,5 s resolución y cola hasta 25,0 s.
- Licencia válida para publicidad pagada (librería comercial o Sound Collection de Meta). Nada de canciones en tendencia con derechos.
- **SFX** genéricos de librería; nunca el tono de WhatsApp, del iPhone ni de otras marcas.

---

## Escenas

### E1 · Gancho — 0,0 → 2,2 s (2,2 s)

- **Fuente:** clip C01 (primeros 2,2 s) + gráficos.
- **Qué se ve:** de noche, plano medio corto de Daniela recostada en el sofá de su departamento actual, con la cara iluminada por el celular. Mira la pantalla con cansancio. **En el frame 0 ya están la persona y el titular** (sin fundido desde negro).
- **Cámara:** dolly-in muy lento hacia el rostro, 50 mm, a la altura de los ojos.
- **Iluminación:** clave baja. Luz fría del celular desde abajo, lámpara cálida tenue al fondo, luces de la ciudad desenfocadas por la ventana. Sombras hacia el marino.
- **Sonido:** ambiente nocturno de interior; «pop» de mensaje en 0,2 s y 1,2 s; música casi inaudible y filtrada. Voz L1.
- **Texto:** titular «¿Otra vez?» (blanco, y ≈ 360 px). Burbujas junto al teléfono, con rebote leve: 0,2 s «Ya se arrendó.» · 1,2 s «Ese ya se vendió.» Sin subtítulos.
- **Transición:** ninguna; sigue el mismo clip.

### E2 · Agitación — 2,2 → 4,8 s (2,6 s)

- **Fuente:** C01 (continúa) + gráficos.
- **Qué se ve:** Daniela baja el celular al pecho, apoya la cabeza en el sofá y exhala. A los lados, por delante del video, suben en loop rápido tarjetas de anuncios genéricos (fotos IMG-01…06), algunas con sello «NO DISPONIBLE», con desenfoque leve y 70 % de opacidad para no competir con el titular (no hace falta recortar a la actriz). Las burbujas de E1 salen hacia arriba con el scroll.
- **Cámara:** el push-in termina y se asienta.
- **Iluminación:** igual que E1.
- **Sonido:** whooshes cortos y suaves del scroll, suspiro natural; música aún filtrada. Voz L2.
- **Texto:** titular «Deja de perseguir anuncios por todo Quito.» («perseguir anuncios» en verde brote).
- **Transición → E3:** barrido chevrón de abajo hacia arriba con whoosh. Al terminar, la música abre el filtro y entra el beat (4,8 s).

### E3 · Giro — 4,8 → 6,8 s (2,0 s)

- **Fuente:** C02.
- **Qué se ve:** a la mañana siguiente, el mismo departamento lleno de luz. Daniela, en la mesa junto a la ventana, toma el celular con decisión, sonríe apenas y empieza a escribir. La pantalla no se ve.
- **Cámara:** push-in lento con un arco leve de izquierda a derecha, 35 mm.
- **Iluminación:** clave alta, luz natural de ventana (5600 K), sombras suaves, plantas verdes desenfocadas en primer plano.
- **Sonido:** entra el beat; ambiente diurno sutil (ciudad lejana, pájaros). Voz L3.
- **Texto:** titular «Mejor publica tú lo que buscas.» («tú» en verde brote).
- **Transición → E4:** zoom digital hacia el celular (100 → 130 % en 6 frames) mientras la tarjeta del formulario nace desde el teléfono y crece hasta su tamaño final (10 frames).

### E4 · Así funciona — 6,8 → 12,0 s (5,2 s)

- **Fuente:** UI real (grabación de pantalla) o réplica fiel; de fondo, C03 con desenfoque fuerte (~40 px) y aclarado 10 %.
- **Qué se ve:** tarjeta del formulario de ~880 px de ancho, centrada. Los campos se completan sincronizados con la voz:

  | Tiempo | Campo | Valor de ejemplo |
  |---|---|---|
  | 7,0 s | Tipo de propiedad | Departamento · Arriendo |
  | 8,3 s | Sector | Cumbayá, Quito |
  | 9,1 s | Presupuesto | Hasta $700 al mes |
  | 9,9 s | Características | 2 habitaciones · Parqueadero · Acepta mascotas |
  | 11,4 s | Toque en «Publicar gratis» | Indicador de toque |
  | 11,7 s | Confirmación | «Búsqueda publicada» + check `#4DA22D` |

  Los valores son ejemplos. **Los rótulos, el botón y el flujo deben ser exactamente los de la app.** Se permite recortar o ampliar la pantalla para mostrar solo estos campos; no se permite agregar campos ni funciones. Si la app dice «Ubicación», la voz cambia «sector» por «ubicación».
- **Cámara:** el fondo deriva lento; la tarjeta queda fija y cada campo aparece en 200 ms con salida suave.
- **Iluminación:** fondo claro.
- **Sonido:** tap suave por campo, click en el botón, chime corto y cálido en la confirmación. Voz L4.
- **Texto:** los rótulos de la UI (la voz lee esos mismos rótulos). Sin subtítulos.
- **Transición → E5:** la tarjeta se compacta en un resumen y sale por la derecha (8 frames); en E5 entra la misma tarjeta por la izquierda. La búsqueda «viaja» hasta el agente.

### E5 · Del otro lado — 12,0 → 14,9 s (2,9 s)

- **Fuente:** C04 + tarjeta UI.
- **Qué se ve:** Andrés, agente inmobiliario, en un coworking luminoso. Mira su laptop (pantalla no visible), se inclina con interés, asiente leve y alcanza su celular. La tarjeta-resumen entra flotando y queda junto a él: «Departamento en arriendo · Cumbayá · Hasta $700 · 2 hab · Parqueadero · Mascotas». **Solo si la app lo muestra así**, una fila «Contacto» con ícono de candado. Sin nombre ni datos de Daniela.
- **Cámara:** plano medio en 3/4, push-in lento, 35 mm.
- **Iluminación:** luz lateral de ventana, de día; acentos marino (silla, blazer) y verdes (plantas); montañas desenfocadas al fondo.
- **Sonido:** ambiente de oficina muy bajo, whoosh suave de la tarjeta. Voz L5.
- **Texto:** subtítulos «Agentes inmobiliarios» / «pueden ver tu búsqueda».
- **Transición → E6:** la vibración del celular de E6 se escucha 4 frames antes del corte.

### E6 · Contacto — 14,9 → 17,8 s (2,9 s)

- **Fuente:** C05.
- **Qué se ve:** de día, Daniela en la terraza de un café con vista a la ciudad y a las montañas. El celular sobre la mesa vibra; lo toma, mira la pantalla (no visible), sonríe levemente y contesta.
- **Qué NO se muestra:** nombre de quien llama, notificaciones de la app, varias llamadas o mensajes seguidos, ni una reacción eufórica. Eso sería prometer un resultado.
- **Cámara:** plano medio casi estático, con el micro-movimiento de una cámara en mano estabilizada, 50 mm.
- **Iluminación:** media mañana, sol suave con contraluz cálido.
- **Sonido:** vibración (dos pulsos), ambiente exterior suave. Voz L6. Al terminar la voz, la música sube 2 dB.
- **Texto:** subtítulos «y contactarte» / «si tienen algo para ti.»
- **Transición → E7:** corte directo en el beat.

### E7 · Alivio + CTA — 17,8 → 20,1 s (2,3 s)

- **Fuente:** C06. Si la ciudad generada no se ve como Quito, se reemplaza por una toma real de stock.
- **Qué se ve:** plano abierto. Daniela al teléfono, relajada, apoyada en la baranda de vidrio; detrás, Quito y las laderas verdes del Pichincha. Cielo limpio en el tercio superior para el titular.
- **Cámara:** pull-back lento con ligera subida, 24–28 mm.
- **Iluminación:** sol de media mañana, bruma ligera, tonos cálidos y verdes.
- **Sonido:** la música en su punto más abierto. Voz L7, primera mitad: «Publica gratis tu búsqueda».
- **Texto:** titular grande «Publica gratis tu búsqueda» («gratis» en verde brote) sobre el cielo.
- **Transición → E8:** barrido chevrón (segundo y último uso) que deja el fondo marfil.

### E8 · Cierre — 20,1 → 25,0 s (4,9 s)

- **Fuente:** 100 % edición.
- **Qué se ve:** fondo marfil `#FAF9F5` liso.
  - 20,2 s: el logo horizontal entra centrado (760 px de ancho, centro en y ≈ 780 px) con fundido y escala 96 → 100 % en 12 frames, justo cuando la voz dice «en Propiedad Conecta».
  - 21,2 s: aparece el botón «Publica gratis tu búsqueda →» (~760 px de ancho, y ≈ 1040 px).
  - Debajo, «Ahora en Quito» (Outfit Medium 40 px, `#142A22`), **solo si se confirma**.
  - 22,6 s: pulso sutil del botón (100 → 104 → 100 %).
- **Cámara / iluminación:** no aplica.
- **Sonido:** voz L7, segunda mitad. Opcional: firma sonora de dos notas (grave y aguda, como los dos círculos del logo) al aparecer el logo. Acorde final en ~23,5 s y cola hasta 25,0 s.
- **Texto:** botón CTA + «Ahora en Quito». Sin URL, salvo que se confirme el dominio.
- **Transición:** ninguna. El último frame es el cierre completo y funciona como frame de loop.
