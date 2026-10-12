# Guía de estilo: video explicativo (referencia 2)

**Referencia:** video de lanzamiento de una app de pagos (archivo subido, `refs/ref2/ref2.mp4`, fuera de git). 38,6 s, 1920 × 1080, 60 fps.
**Material estudiado:** `refs/ref2/frames/f_001.jpg … f_077.jpg`, un cuadro cada 0,5 s (`f_NNN` = segundo `(NNN − 1) × 0,5`), más la curva de movimiento a 10 fps, la detección de cortes y el análisis del audio, todo hecho sobre el MP4 original.
**Alcance:** igual que en el primer video, este documento registra la **gramática** de la referencia (ritmo, cortes, transiciones, tipografía, color, sonido). Su texto, su logo, sus tarjetas, sus fotos y su música no se reutilizan. Cada sección termina con su traducción a Propiedad Conecta.

Los valores marcados *medido* se obtuvieron con un script; los marcados *est.* se leyeron a ojo.

---

## 1. La película en un párrafo

Es un video de **pulso fuerte y cortes secos**: 9 cortes duros en 38 s (*medido*: 2,47 · 4,68 · 7,25 · 11,0 · 13,05 · 15,03 · 19,38 · 23,47 s, más la secuencia final). Alterna **tres mundos**: negro puro con un solo color de acento, gris claro de estudio y algún blanco. Cada plano es **una idea**: un objeto, una palabra gigante o un fragmento de interfaz. Abre con una línea que se dibuja sobre negro y cierra en silencio, con texto pequeño y el logo sobre negro. La música (~140 BPM, mucho grave) se corta en seco unos 8 s antes del final.

Es lo opuesto al primer video: aquel era un plano continuo sobre blanco; este es un montaje percutido de fragmentos.

---

## 2. Paleta

### 2.1 Referencia (*medido*)

| Rol | Hex | Dónde |
|---|---|---|
| Negro (fondo dominante) | `#000000` | f_001–f_005, f_016, f_027, f_065 |
| Acento único, neón | `#E0FF38` | ícono, titulares, tarjetas, póster (f_007, f_016, f_056) |
| Gris de estudio | `#E2E3E6` | escenas de píldoras y de interfaz (f_010, f_023, f_048) |
| Blanco | `#FDFDFD` | escena de intercambio entre dos personas (f_035) |
| Tarjeta de interfaz oscura | `#111111` | lista de tarjetas (f_008) |
| Degradado de estudio (objetos 3D) | `#B2B2B2` → `#FCFCFC` | tarjetas cayendo, mano con teléfono (f_031, f_054) |
| Imágenes en duotono | azul violeta + blanco | fotos dentro de tarjetas y pósteres |

### 2.2 Lógica del color

1. **Un solo acento.** Todo es negro, gris o blanco, salvo el neón. El acento marca lo que importa: el ícono, la palabra clave, el botón.
2. **El acento nunca es fondo de texto pequeño**, salvo en el póster final, donde el texto es negro.
3. **El negro es negro puro**, sin degradados (solo luces de borde en los macros de producto).
4. **Los mundos se alternan por corte:** negro → gris → negro → gris… El cambio de mundo marca el cambio de idea.

### 2.3 Traducción a Propiedad Conecta

| Rol | Valor PC | Por qué |
|---|---|---|
| Negro | Bosque profundo `#0B1712` | Casi negro, pero verde: mantiene el contraste de la referencia con la temperatura de la marca. |
| Acento único | Brote `#92CE58` | El verde más luminoso de la marca: sobre `#0B1712` el contraste es ~10:1. |
| Gris de estudio | `#E4E7E2` (gris con un punto de verde) | Mismo valor que `#E2E3E6`, sin que se vea frío. |
| Blanco / marfil | `#FFFFFF` / Marfil `#FAF9F5` | El logo solo puede ir sobre blanco o marfil (regla 4 de `04-ia-vs-edicion-y-logo.md`). |
| Texto sobre claro | Bosque `#142A22` | — |

**Restricción de marca:** en la referencia el logo aparece sobre negro. Aquí **el logo nunca va sobre fondo oscuro**. Donde la referencia pone su ícono sobre negro, nosotros ponemos el isotipo dentro de una **baldosa marfil** con esquinas redondeadas: el logo queda sobre marfil y la baldosa cumple el rol del ícono de app.

---

## 3. Tipografía

### 3.1 Referencia (*est.* salvo indicación)

| Uso | Comportamiento |
|---|---|
| **Titular gigante** | Grotesca **condensada, extranegra, MAYÚSCULAS**, en el acento sobre negro. Dos líneas con interlineado casi pegado (~1,0). Altura de mayúscula **~128 px** a 1080p (*medido*, f_016), bloque de ~1200 px de ancho. |
| **Palabra enmascarada** | La misma familia, aún más condensada, negro sobre una banda blanca. Altura de mayúscula **~525 px** (49 % del cuadro, *medido*): la palabra no cabe y se corta en los bordes de la banda. |
| **Interfaz y píldoras** | Grotesca normal; píldoras en MAYÚSCULAS pequeñas, blancas sobre negro, con tracking abierto (~+4 %). |
| **Texto editorial** | Póster: MAYÚSCULAS pequeñas arriba a la derecha, párrafo pequeño abajo a la izquierda, año y sección en las esquinas, filetes finos. Todo en negro sobre el acento. |
| **Cierre** | Una línea pequeña (~30 px), blanca, centrada sobre negro, sin peso. |

Nunca hay más de una línea de titular por plano, salvo el titular gigante de dos líneas.

### 3.2 Traducción

- **Titulares y palabra enmascarada: Barlow Condensed 800** (OFL, `@fontsource/barlow-condensed`), MAYÚSCULAS, tracking −1 %, interlineado 0,92.
- **Interfaz, píldoras, editorial y cierre: Outfit** 400/500/600 (ya en el repo). Píldoras en MAYÚSCULAS, 600, tracking +4 %.
- Textos en español de Ecuador. Los titulares en mayúsculas terminan con punto.

---

## 4. Duración de planos y ritmo

### 4.1 Mapa de planos de la referencia (*medido*)

| t (s) | Dur. | Mundo | Plano | Cuadros |
|---|---|---|---|---|
| 0,0–2,5 | 2,5 | negro | Una línea blanca fina se dibuja y serpentea | f_001–f_005 |
| 2,5–4,7 | 2,2 | gris → negro | El logo garabateado → ícono de app en acento → se aleja y queda dentro de una lista de tarjetas | f_006–f_009 |
| 4,7–7,3 | 2,6 | gris | Píldoras que aparecen con rebote; la cámara empuja hacia una | f_010–f_015 |
| 7,3–9,2 | 1,9 | negro | Titular gigante en acento; un objeto de vidrio lo cruza y lo refracta | f_016–f_018 |
| 9,2–11,0 | 1,8 | foto | Macro de la pantalla de inicio de un teléfono: el ícono se enciende | f_019–f_022 |
| 11,0–13,1 | 2,1 | gris | Dos píldoras se transforman en la interfaz de la app | f_023–f_026 |
| 13,1–15,0 | 1,9 | negro | Macro del canto del teléfono, solo luz de borde | f_027–f_030 |
| 15,0–16,5 | 1,5 | estudio | Tarjetas 3D que caen girando | f_031–f_033 |
| 16,5–19,4 | 2,9 | blanco | Dos nodos (marca y persona) intercambian valor; los contadores ruedan | f_034–f_039 |
| 19,4–23,5 | 4,1 | negro | Una publicación social aparece y la cámara entra en su imagen | f_040–f_047 |
| 23,5–24,5 | 1,0 | gris | Cuatro pósteres en fila, barrido con desenfoque de movimiento | f_048–f_049 |
| 24,5–26,5 | 2,0 | gris/blanco | Una línea corta el cuadro y abre una banda con una palabra gigante; una tarjeta la atraviesa | f_050–f_053 |
| 26,5–27,7 | 1,2 | estudio | Mano sosteniendo el teléfono | f_054–f_055 |
| 27,7–29,5 | 1,8 | acento | Póster editorial a sangre con la marca gigante | f_056–f_059 |
| 29,5–31,5 | 2,0 | blanco | Pases de página (esquina que se pela), tres páginas | f_060–f_064 |
| 31,5–34,0 | 2,5 | negro | Retícula fina, una línea de texto pequeña, logo pequeño | f_065–f_069 |
| 34,0–38,6 | 4,6 | negro | Negro y silencio | f_070–f_077 |

### 4.2 Reglas

- **Planos de 1,0 a 2,9 s**, mediana ~2 s. Solo el plano de la publicación social pasa de 4 s.
- **El corte cae en el pulso** (140 BPM, 0,43 s): los cortes medidos caen en tiempos o medios tiempos de la música.
- **Dentro de cada plano hay un solo movimiento** fuerte: un rebote, un empuje, un paso de objeto.
- **Movimiento a ráfagas** (*medido*): segundos con mucho movimiento (diferencia media 20–65) alternan con planos casi quietos (0–2). Nunca hay movimiento constante.
- **Cierre largo y quieto:** los últimos ~7 s (18 %) son texto pequeño, logo y negro, sin música.

---

## 5. Transiciones

| # | Transición | Cómo se comporta | Referencia |
|---|---|---|---|
| R1 | **Corte seco en el pulso** | La transición por defecto. Casi siempre cambia de mundo (negro ↔ gris). | todos los cortes medidos |
| R2 | **Línea que se dibuja** | Un trazo fino de 2 px recorre el negro y cambia de forma; anticipa el símbolo de la marca sin dibujarlo. | f_001–f_005 |
| R3 | **Del ícono a la lista** | El ícono llena el cuadro, se aleja y queda como una fila más de una lista que se desplaza. | f_007–f_009 |
| R4 | **Píldora con rebote** | Las píldoras nacen pequeñas, se estiran (squash & stretch) y se acomodan en ~0,3 s; luego la cámara empuja hacia la última. | f_010–f_015 |
| R5 | **Objeto que refracta el texto** | Una forma de vidrio cruza el titular y lo deforma bajo ella. | f_017–f_018 |
| R6 | **Morfosis de forma a interfaz** | Dos píldoras simples crecen y se convierten en los botones de la interfaz real. | f_023–f_026 |
| R7 | **Barrido con desenfoque** | Una fila de tarjetas pasa de lado muy rápido con desenfoque de movimiento. | f_048–f_049 |
| R8 | **Banda enmascarada** | Una línea fina cruza en diagonal, abre una banda blanca y dentro aparece una palabra gigante cortada por los bordes; un objeto la atraviesa por delante. | f_050–f_053 |
| R9 | **Pase de página** | Una esquina se levanta y la página se pela en diagonal, mostrando la siguiente debajo; ~0,5 s por página. | f_060–f_064 |
| R10 | **Fundido a negro** | Solo en el cierre: el texto pequeño y el logo aparecen y se van con fundidos lentos (~0,6 s). | f_065–f_070 |

**Curvas:** entradas con *ease-out* fuerte (back-out con ~8 % de rebote en las píldoras), salidas con *ease-in* corto. Los objetos 3D giran a velocidad constante.

---

## 6. Cámara

| Movimiento | Uso |
|---|---|
| **Fija** | Titulares y póster. |
| **Empuje rápido** | Hacia una píldora o un botón, ~1,0 → 1,6 en 0,8 s, *ease-in-out*. |
| **Alejamiento** | Del ícono a la lista; de la píldora a la interfaz. |
| **Macro con poca profundidad de campo** | Pantalla del teléfono y su canto: casi todo el cuadro desenfocado, un detalle nítido, luz de borde. |
| **Paneo lento** | En los macros oscuros. |
| **Barrido lateral** | La fila de pósteres. |

No hay cámara en mano. La mano que sostiene el teléfono es un plano fijo.

---

## 7. Textura

- **Sin grano** (σ del ruido de alta frecuencia ≈ 0–0,2 sobre 255 en fondos lisos, *medido*). Acabado digital limpio.
- **Profundidad** con desenfoque de lente en los macros y sombras suaves bajo los objetos.
- **Fotos en duotono** (azul violeta + blanco) dentro de tarjetas y pósteres: una sola tinta.
- **Retícula fina** (1 px, ~8 % de blanco) en el cierre sobre negro.

**Traducción:** sin fotos de stock ni personas reales (la referencia usa una foto de una persona). Donde haya personas usamos nodos gráficos: círculos con un pictograma. El duotono, si hace falta, va en Bosque + Marfil.

---

## 8. Cómo entra y sale el texto

| Entrada | Mecánica |
|---|---|
| **Corte** (por defecto) | El titular gigante ya está completo en el primer cuadro del plano. |
| **Banda enmascarada** | La palabra aparece porque la banda se abre (R8), no porque ella se mueva. |
| **Rebote** | Píldoras (R4). |
| **Fundido** | Solo en el cierre, ~0,6 s. |

| Salida | Mecánica |
|---|---|
| **Corte** (por defecto) | El texto no "sale": el plano se corta. |
| **Refracción** | El objeto de vidrio deforma el texto justo antes del corte. |
| **Fundido a negro** | Cierre. |

**Nunca:** máquina de escribir, palabra por palabra, sombras, contornos ni texto encima de fotos con mucho detalle. (Es lo contrario del primer video: allí el texto se construía palabra a palabra; aquí llega entero y de golpe.)

---

## 9. Sonido

*Medido* sobre el audio de la referencia, solo para captar su energía:

| Rasgo | Valor |
|---|---|
| Tempo | **~140 BPM** (se siente a 70: half-time) |
| Sonoridad | −15,5 LUFS integrados, rango 9 LU |
| Balance | **~90 % de la energía bajo 150 Hz**: bajo y bombo dominan; muy poco brillo (<1 % sobre 4 kHz) |
| Forma | Arranca suave (0–3 s a −26 dB), entra completa a los 3 s, se mantiene pareja hasta ~30 s y **se corta en seco**; el cierre queda casi en silencio |

**Traducción:** música **original**, hecha con el mismo motor de síntesis del primer video (`video/music/compose.py`), para que los dos videos compartan identidad sonora. Va a 140 BPM en half-time, con más grave y más oscura que el primero, cortes en el pulso y silencio en el cierre. No se copia ninguna melodía ni sonido de la referencia.

---

## 10. Qué tomamos y qué dejamos

| Tomamos (gramática) | Dejamos (su contenido) |
|---|---|
| Negro + un acento + gris de estudio; cortes en el pulso | Su color neón, su logo, su ícono, su nombre |
| Titular condensado gigante; banda enmascarada; píldoras con rebote; morfosis forma → interfaz; pase de página; retícula de cierre | Sus textos, tarjetas de pago, billetes, monumentos, fotos y la publicación social |
| Nodos que intercambian algo; póster editorial con QR | Su foto de una persona real, sus contadores y cifras |
| 140 BPM, mucho grave, silencio final | Su pista musical |
