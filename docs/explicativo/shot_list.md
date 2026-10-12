# Shot list: video explicativo «Qué es Propiedad Conecta» (32 s, 16:9) · v2

**Estilo:** la gramática de [`guia_de_estilo.md`](guia_de_estilo.md): negro + un acento + gris de estudio, un plano por idea, cortes secos en el pulso, titular condensado gigante, cierre quieto en silencio.
**Objetivo:** que alguien que nunca oyó de Propiedad Conecta entienda en 32 s **qué es**, **cómo funciona de los dos lados** y **para qué existe**:
- **Quien busca** publica gratis lo que necesita y elige cuántos agentes pueden contactarle.
- **El agente** ve solicitudes que coinciden con sus propiedades. Los datos de contacto están ocultos; si tiene algo que coincide, usa créditos para desbloquearlos y los dos reciben los datos del otro.
- **La idea:** dejar de perseguir anuncios. La búsqueda va al revés.

**Público:** los dos, con **quien busca como protagonista** y el agente como "lo que pasa del otro lado" (ver la recomendación al final).
**Formato:** 1920 × 1080, 60 fps, 32,00 s, español de Ecuador, **solo texto y música** (con espacio para sumar locución después). Música original a 140 BPM: un tiempo = 0,4286 s, un compás = 1,714 s. Todos los cortes caen en el pulso.

---

## Recursos (reales; nada se redibuja)

Capturas de 1440 × 900 en `anuncios/reel-publica-tu-busqueda/animatic/capturas/originales-1440/`:

| Archivo | Qué muestra | Plano |
|---|---|---|
| `01`, `02`, `04` | Formulario vacío y lleno; Características | 4, 6, 7 |
| `05-contacto-y-publicar` | Botón «Publicar solicitud» | 8 |
| `06-solicitud-publicada` | «¡Solicitud publicada!», estado «Buscando», «Máximo de agentes», «Pausar», «Ya encontré una propiedad / cerrar», «Agentes conectados (0/3)» | 9 |
| `07-agente-marketplace` | «Marketplace de solicitudes», tarjetas con «% · Muy alta compatibilidad», señales de confianza, «Desbloquear contacto» | 10 |
| `08-agente-detalle` | Detalle de una solicitud; «El nombre, teléfono y email del interesado permanecen ocultos hasta que desbloquees el contacto.» | 11 |
| `09-agente-desbloquear` | Diálogo «Desbloquear esta solicitud» → «Usar 10 créditos y desbloquear» | 12 |
| `10-agente-lead-desbloqueado` | Lead «Desbloqueada», «Contactar por WhatsApp», «Email» | 13 |

Además: logo horizontal e isotipo (`…/marca/`, solo sobre blanco o marfil, ≤ 100 %, sin efectos), Barlow Condensed 800 (OFL, npm) + Outfit, QR hacia `https://www.propiedadconecta.com/` generado con `segno`, música original con `compose.py`.

**Cuidado en los recortes:**
- Los indicadores de desarrollo (esquina inferior izquierda, x < 140 px, y > 840 px) quedan fuera de todos los recortes.
- En `10-agente-lead-desbloqueado`, el teléfono y el correo de prueba se difuminan (misma precaución que en el primer reel).
- En el marketplace solo se muestran las dos tarjetas de Quito: no se ven la cifra «13 solicitudes disponibles» ni las de otras ciudades, para no sugerir una actividad o una cobertura que todavía no existen.

---

## Línea de tiempo

| # | Entrada → salida (s) | Tiempos | Mundo | Imagen | Texto en pantalla | Transición |
|---|---|---|---|---|---|---|
| **ACTO 1 · EL PROBLEMA** | | | | | | |
| **1** | 0,00 → 1,71 | 4 | negro | **Línea que busca.** Un trazo marfil de 2 px recorre el negro dando vueltas, se devuelve y se cruza; en el último tiempo se endereza en un techo «^» (un chevrón, no el logo). | — | Desde negro. **Corte.** |
| **2** | 1,71 → 3,43 | 4 | gris | **Píldoras del problema.** Cuatro píldoras negras, una por tiempo, con rebote; la cámara empuja hacia la última. | «YA SE ARRENDÓ» · «NO CONTESTAN» · «ANUNCIO VIEJO» · «YA SE VENDIÓ» | R4. **Corte.** |
| **3** | 3,43 → 5,14 | 4 | negro | **Titular gigante** en Brote; un lente redondo de vidrio lo cruza y deforma las letras. | «DEJA DE PERSEGUIR / ANUNCIOS.» | Por corte; lente R5. **Corte.** |
| **ACTO 2 · LA IDEA** | | | | | | |
| **4** | 5,14 → 6,86 | 4 | negro → blanco | **Del ícono a la página.** La baldosa marfil con el isotipo llena el centro, se encoge hasta el lugar del logo en la cabecera real y la página real aparece alrededor: «Cuéntanos qué propiedad estás buscando» · «Es gratis publicar.» | (el texto es el de la página) | R3, con alejamiento. **Corte.** |
| **5** | 6,86 → 8,57 | 4 | gris → blanco | **Banda enmascarada.** Una línea cruza en diagonal y abre una banda blanca; dentro, una palabra gigante cortada por los bordes. La tarjeta real «¿Qué estás buscando?» la atraviesa por delante. | «AL REVÉS.» · pequeño debajo: «En los portales tú buscas. Aquí publicas lo que buscas.» | R8. **Corte.** |
| **ACTO 3 · QUIEN BUSCA** | | | | | | |
| **6** | 8,57 → 10,29 | 4 | gris | **De píldora a interfaz.** «COMPRAR» (negra) y «ALQUILAR» (Brote) crecen y se convierten en la tarjeta real «¿Qué estás buscando?» llena. | «01 · Cuéntanos qué buscas.» | R6. **Corte.** |
| **7** | 10,29 → 12,00 | 4 | gris | **Fila de tarjetas** reales (Ubicación · Presupuesto · Características) con barrido lateral y desenfoque; frena en Características. | «Zona · Presupuesto · Lo que no puede faltar» | R7. **Corte.** |
| **8** | 12,00 → 13,71 | 4 | negro | **Macro del botón** «Publicar solicitud»: poca profundidad de campo; se hunde 3 %. | «02 · Publica. Es gratis.» | **Corte.** |
| **9** | 13,71 → 15,43 | 4 | blanco | **Solicitud publicada.** Empuje hacia la captura real: banner «¡Solicitud publicada!» y luego «Máximo de agentes: 3». | «Tú eliges cuántos agentes: 1, 3 o 5.» | Empuje 1,0 → 1,3. **Corte.** |
| **ACTO 4 · DEL OTRO LADO, EL AGENTE** | | | | | | |
| **10** | 15,43 → 17,14 | 4 | gris | **Marketplace real.** Dos tarjetas de solicitudes de Quito; la cámara empuja hacia la etiqueta «100% · Muy alta compatibilidad». | «03 · Los agentes ven solicitudes que coinciden.» | Empuje. **Corte.** |
| **11** | 17,14 → 18,86 | 4 | blanco | **Detalle real.** Macro sobre «El nombre, teléfono y email del interesado permanecen ocultos…». | «Tus datos quedan ocultos.» | Paneo lento. **Corte.** |
| **12** | 18,86 → 22,29 | 8 | negro → blanco | **Desbloqueo.** El diálogo real «Desbloquear esta solicitud» sobre negro; el botón «Usar 10 créditos y desbloquear» se hunde; un candado gráfico en Brote se abre y la escena corta a blanco. | «04 · Si tiene algo que coincide, usa créditos y desbloquea tu contacto.» | El candado en 20,6 s (en el pulso). **Corte** a blanco en 21,4 s; el texto se queda. |
| **13** | 22,29 → 24,00 | 4 | blanco | **Lead desbloqueado** (real, con el teléfono y el correo difuminados): «Desbloqueada», «Contactar por WhatsApp», «Email». | «05 · Te contacta por WhatsApp, llamada o email.» | Píldoras de canal con rebote. **Corte.** |
| **14** | 24,00 → 25,71 | 4 | negro | **Titular gigante.** | «TÚ PUBLICAS. / EL AGENTE TE ENCUENTRA.» (Brote) | Por corte. **Corte.** |
| **ACTO 5 · MARCA Y LLAMADO** | | | | | | |
| **15** | 25,71 → 27,43 | 4 | marfil | **Póster editorial.** Logo horizontal real grande, filetes finos, «2026» y «propiedadconecta.com» en las esquinas, frase arriba a la derecha, párrafo abajo a la izquierda, QR abajo a la derecha. | Arriba: «PUBLICA LO QUE BUSCAS.» · Abajo: «Quien busca publica gratis. Los agentes con algo que coincide le contactan.» | Por corte; al final se levanta la esquina. |
| **16** | 27,43 → 29,14 | 4 | blanco | **Pases de página**, tres páginas tipográficas. | «1 · Publica gratis lo que buscas.» → «2 · Elige cuántos agentes.» → «3 · Te contacta quien tiene algo que coincide.» | R9 × 3 (0,57 s por página). La música se corta en seco en 29,14 s. |
| **17** | 29,14 → 32,00 | — | negro | **Cierre.** Retícula fina; línea pequeña blanca; luego la baldosa marfil con el isotipo y el dominio debajo; fundido a negro. | «Publica gratis tu búsqueda.» → [baldosa] «propiedadconecta.com» | R10: texto 29,4–30,6 s; baldosa y dominio 30,6–31,6 s; negro hasta 32,0 s. |

**Totales:** 17 planos; 15 de un compás (1,71 s), el desbloqueo de dos compases (3,43 s) y el cierre de 2,86 s. 15 cortes secos en el pulso y un pase de página. Interfaz real en 9 de los 17 planos.

**Lectura:** ningún rótulo de un plano de 1,71 s pasa de 8 palabras (contando el número de paso); el más largo (plano 12, 12 palabras) tiene 3,43 s.

---

## Música (original)

| Compases | t (s) | Qué pasa |
|---|---|---|
| 1 | 0–1,71 | Pad grave filtrado y pulso de sub; un "tic" suave sigue la línea |
| 2 | 1,71–3,43 | Entra el bombo half-time; un golpe corto por píldora |
| 3 | 3,43–5,14 | Golpe grave + barrido de filtro con el lente |
| 4–9 | 5,14–15,43 | Groove completo (bombo, palmas en el 3, hi-hats) y el arpegio del primer video, más oscuro, en Si menor |
| 10–13 | 15,43–22,29 | Lado del agente: el bajo cambia de figura; campana en Brote cuando se abre el candado (20,57 s) |
| 14–17 | 22,29–29,14 | Máxima energía; el póster entra en el tiempo 1; tres golpes de página; **corte seco** en 29,14 s |
| — | 29,14–32,00 | Silencio con cola de reverberación; una campana muy suave con el isotipo |

−14 LUFS, pico ≤ −1 dBTP, más grave que el primer video.

---

## Comprobación de afirmaciones

| Afirmación | Respaldo | Estado |
|---|---|---|
| «Es gratis publicar.» | Texto de la página (captura 02) | ✅ |
| «Tú eliges cuántos agentes: 1, 3 o 5.» | Formulario (05), «Máximo de agentes» (06), «Cupos disponibles 3/3» (08); confirmado por ti | ✅ |
| «Los agentes ven solicitudes que coinciden.» | Marketplace con porcentaje de compatibilidad (07); banner «Los agentes podrán encontrar tu solicitud si tienen una propiedad que coincida…» (06) | ✅ Describe el mecanismo; no afirma que hoy haya agentes activos. |
| «Tus datos quedan ocultos.» | Texto de 08 | ✅ |
| «Si tiene algo que coincide, usa créditos y desbloquea tu contacto.» | Página: «Los agentes pagan por desbloquear tu contacto, y solo lo hacen si tienen algo que realmente coincide.»; diálogo 09 | ✅ |
| «Te contacta por WhatsApp, llamada o email.» | Confirmado por ti; botones «Contactar por WhatsApp» y «Email» (10) | ✅ El chat interno queda fuera hasta que exista. |
| «El agente te encuentra.» | Mecanismo de 06–10 | ⚠️ Hoy no hay agentes activos; según lo que dices, los habrá en los próximos días. Conviene publicar el video cuando ya estén. |
| Marketplace con solicitudes | Datos de demostración | ⚠️ Solo se muestran dos tarjetas de Quito, sin el contador de solicitudes. |

---

## Recomendación sobre el público

**Un solo video para los dos, con quien busca como protagonista.** El concepto solo se entiende viendo los dos lados: que mis datos estén ocultos y que solo los desbloquee quien tiene algo que coincide es justamente lo que da confianza a quien busca. Y al agente le muestra en 8 segundos qué recibe: solicitudes con compatibilidad, señales de confianza y contactos reales.

Como todo sale del mismo código, después puedo armar **dos cortes de 15 s** con estos mismos planos:
- **Para quien busca** (anuncios en Meta): planos 1–3, 6, 8, 9, 11, 14, 17.
- **Para agentes:** planos 10–13, más un rótulo de la «Protección del lead» (si el interesado no responde, se puede pedir la devolución del crédito), y el cierre.

---

## Pregunta pendiente

1. **Cobertura:** ¿la quieres mostrar? El marketplace de demostración incluye Guayaquil y Samborondón. Por ahora el póster no menciona ciudades.
