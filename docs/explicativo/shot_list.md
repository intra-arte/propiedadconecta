# Shot list: video explicativo «Qué es Propiedad Conecta» (32 s, 16:9)

**Estilo:** la gramática de [`guia_de_estilo.md`](guia_de_estilo.md): negro + un acento + gris de estudio, un plano por idea, cortes secos en el pulso, titular condensado gigante, cierre quieto en silencio.
**Objetivo:** que alguien que nunca oyó de Propiedad Conecta entienda en 32 s **qué es** (una plataforma donde quien busca casa publica lo que necesita), **cómo funciona** (formulario gratis → los agentes revisan → quien tiene algo que coincide desbloquea el contacto) y **para qué existe** (dejar de perseguir anuncios; invertir la búsqueda).
**Formato:** 1920 × 1080, 60 fps, 32,00 s, español de Ecuador, sin locución (solo texto en pantalla y música). Música original a 140 BPM: un tiempo = 0,4286 s; un compás = 1,714 s. Todos los cortes caen en el pulso.

---

## Recursos (reales; nada se redibuja)

| Recurso | Archivo | Notas |
|---|---|---|
| Logo horizontal | `anuncios/reel-publica-tu-busqueda/marca/logo-horizontal-transparente.png` | Solo sobre blanco o marfil, ≤ 100 %, escala uniforme, sin efectos ni partes animadas. |
| Isotipo | `…/marca/isotipo-transparente.png` | Dentro de una **baldosa marfil** cuando el fondo es oscuro. |
| Tarjetas del formulario (vacías y llenas) | `video/assets/*.png`, recortadas de las capturas 1440 × 900 | ¿Qué estás buscando? · Ubicación · Presupuesto · Características |
| Botón «Publicar solicitud» | `video/assets/publicar.png` | |
| Cabecera real con «Para agentes» | `video/assets/header.png` | Prueba de que existe el lado del agente. |
| Tipografías | Barlow Condensed 800 (OFL, npm) · Outfit (ya en el repo) | |
| QR | Generado con `segno` hacia `https://www.propiedadconecta.com/` | Vectorial, negro sobre marfil. |
| Música | Original, `compose.py` (mismo motor del primer video) | 140 BPM half-time, se corta en 29,14 s. |

---

## Línea de tiempo

Notación de tiempos: compás.tiempo de la música (1.1 = inicio).

| # | Entrada → salida (s) | Dur. | Mundo | Imagen | Texto en pantalla | Transición |
|---|---|---|---|---|---|---|
| **ACTO 1 · EL PROBLEMA** | | | | | | |
| **1** | 0,00 → 2,57 | 2,57 | negro | **Línea que busca.** Un trazo fino de 2 px, marfil, entra por la izquierda y recorre el negro dando vueltas, se devuelve y se cruza, como alguien que busca sin rumbo. En el último tiempo se endereza y forma un techo «^» (un chevrón, no el logo). | — | Entra desde negro. Sale con **corte** en 2,57 (tiempo 7). |
| **2** | 2,57 → 4,29 | 1,71 | gris | **Píldoras del problema.** Cuatro píldoras negras aparecen una por tiempo con rebote, desordenadas en el cuadro; la cámara empuja hacia la última. | «YA SE ARRENDÓ» · «NO CONTESTAN» · «ANUNCIO VIEJO» · «YA SE VENDIÓ» (Outfit 600, MAYÚSCULAS) | Píldoras **R4** (back-out, 0,3 s c/u, una cada 0,43 s). Empuje 1,0 → 1,5 en el último tiempo. **Corte.** |
| **3** | 4,29 → 6,86 | 2,57 | negro | **Titular gigante.** Bloque de dos líneas en Brote. Un lente redondo de vidrio (una lupa, sin mango) lo cruza de izquierda a derecha y deforma las letras bajo él. | «DEJA DE PERSEGUIR / ANUNCIOS.» (Barlow Condensed 800, altura de mayúscula ~150 px) | Texto entra **por corte**, completo. Lente **R5** entre 5,1 y 6,6 s. **Corte.** |
| **ACTO 2 · LA IDEA** | | | | | | |
| **4** | 6,86 → 8,57 | 1,71 | negro | **Del ícono a la lista.** La baldosa marfil con el isotipo llena el centro; se aleja y queda como la primera fila de una lista de tarjetas oscuras que sube. | Filas: «Propiedad Conecta — Publica lo que buscas» · «Para quien busca — Es gratis» · «Para agentes — Contactos que coinciden» | **R3**: alejamiento 1,0 → 0,4 + desplazamiento de la lista. **Corte.** |
| **5** | 8,57 → 10,29 | 1,71 | gris → blanco | **Banda enmascarada.** Una línea fina cruza en diagonal y abre una banda blanca; dentro, una palabra gigante cortada por los bordes. La tarjeta real «¿Qué estás buscando?» la atraviesa por delante. | «AL REVÉS.» (Barlow Condensed 800, altura de mayúscula ~520 px); abajo, pequeño: «En los portales tú buscas. Aquí publicas lo que buscas.» | **R8.** **Corte.** |
| **ACTO 3 · CÓMO FUNCIONA (QUIEN BUSCA)** | | | | | | |
| **6** | 10,29 → 12,00 | 1,71 | gris | **De píldora a interfaz.** Dos píldoras, «COMPRAR» (negra) y «ALQUILAR» (Brote), crecen y se transforman en la tarjeta real «¿Qué estás buscando?» llena. | Etiqueta arriba a la izquierda: «01 · Cuéntanos qué buscas» | **R6** (0,6 s). **Corte.** |
| **7** | 12,00 → 15,43 | 3,43 | gris | **Fila de tarjetas.** Las cuatro tarjetas reales llenas (Qué · Ubicación · Presupuesto · Características) en una fila en perspectiva; barrido lateral con desenfoque; se detiene en Características (Amoblado ✓, Seguridad ✓). | Bajo cada tarjeta, pequeño: «Tipo» · «Zona» · «Presupuesto» · «Lo que no puede faltar» | **R7** (barrido 0,5 s, frena con *ease-out*). **Corte.** |
| **8** | 15,43 → 17,14 | 1,71 | negro | **Macro del botón.** El botón real «Publicar solicitud» en primerísimo plano, casi todo desenfocado salvo el texto; se hunde 3 % (pulsación). | «02 · Publica. Es gratis.» | Desenfoque de lente variable. **Corte.** |
| **9** | 17,14 → 20,57 | 3,43 | blanco | **Nodos.** Al centro, una tarjeta-resumen de la búsqueda («Comprar · Departamento · Cumbayá · USD 120.000–160.000»). Alrededor aparecen 5 nodos-agente (círculos con un pictograma de casa). Las líneas la conectan con todos; **uno se enciende en Brote** («tiene algo que coincide») y un candado se abre sobre la línea hacia la búsqueda. | «03 · Los agentes ven tu búsqueda.» → «Solo quien tiene algo que coincide paga por tu contacto.» | Nodos con rebote (uno por tiempo). Candado en 19,3 s. **Corte.** |
| **ACTO 4 · PARA QUÉ (LOS DOS LADOS)** | | | | | | |
| **10** | 20,57 → 22,29 | 1,71 | negro | **Te contactan.** La línea encendida llega a la tarjeta-resumen; aparecen tres píldoras de canal a elegir, que salen de la tarjeta real «Tus datos de contacto». | «04 · Te contactan por donde prefieras.» · píldoras: «WHATSAPP» · «LLAMADA» · «EMAIL» (⚠️ pendiente, ver pregunta 3) | Píldoras R4. **Corte.** |
| **11** | 22,29 → 24,00 | 1,71 | negro | **Titular gigante, dos lados.** | «TÚ PUBLICAS. / EL AGENTE TE ENCUENTRA.» (Brote) | Por corte; sin objeto. **Corte.** |
| **12** | 24,00 → 25,71 | 1,71 | gris | **Macro de la cabecera real.** Paneo lento por la cabecera del sitio, de «Propiedad Conecta» a «Para agentes». | Abajo a la derecha: «Para agentes: personas que ya saben qué quieren y cuánto pueden pagar.» | Paneo 0,6 → 1,0. **Corte.** |
| **ACTO 5 · MARCA Y LLAMADO** | | | | | | |
| **13** | 25,71 → 27,43 | 1,71 | marfil | **Póster editorial.** Marfil a sangre: logo horizontal real grande (≤ 100 % del archivo), filetes finos, «QUITO» y «2026» en las esquinas, frase arriba a la derecha, párrafo abajo a la izquierda, QR abajo a la derecha. | Arriba: «PUBLICA LO QUE BUSCAS.» · Abajo: «Propiedad Conecta une a quien busca casa con agentes que tienen una propiedad que coincide. Publicar es gratis.» | Por corte. Al final, la esquina inferior derecha se levanta. |
| **14** | 27,43 → 29,14 | 1,71 | blanco | **Pases de página**, tres páginas tipográficas: | «1 · Publica gratis lo que buscas.» → «2 · Los agentes revisan tu búsqueda.» → «3 · Si tienen algo que coincide, te contactan.» | **R9** × 3 (0,57 s por página). La música se corta en seco en 29,14 s. |
| **15** | 29,14 → 32,00 | 2,86 | negro | **Cierre.** Retícula fina; una línea pequeña blanca; luego la baldosa marfil con el isotipo (pequeña) y el dominio en blanco debajo. Fundido a negro. | «Publica gratis tu búsqueda.» → [baldosa] «propiedadconecta.com» | **R10**: texto 29,4–30,6 s; baldosa y dominio 30,6–31,6 s; negro 31,6–32,0 s. Solo una cola de reverberación. |

**Totales:** 15 planos, mediana 1,71 s (un compás). 13 cortes secos en el pulso y un pase de página. Titulares gigantes 13 % del tiempo · interfaz real 27 % · marca y cierre 20 %.

---

## Música (original)

| Compases | t (s) | Qué pasa |
|---|---|---|
| 1–2 | 0–2,57 | Solo un pad grave filtrado y un pulso de sub; un "tic" suave sigue la línea |
| 2.3 | 2,57 | Entra el bombo (half-time) con las píldoras; un golpe corto por píldora |
| 3.3 | 4,29 | Golpe grave + el lente: barrido de filtro |
| 5–9 | 6,86–15,43 | Groove completo (bombo, palmas en el 3, hi-hats); el arpegio del primer video, más oscuro, en Si menor |
| 10–12 | 15,43–20,57 | Se abre un poco: el botón tiene su golpe; los nodos, una nota por nodo; el candado, una campana en Brote |
| 13–16 | 20,57–27,43 | Máxima energía; el póster entra en el tiempo 1 del compás 16 |
| 17 | 27,43–29,14 | Tres golpes de página; **corte seco** en 29,14 s |
| — | 29,14–32,00 | Silencio con la cola de reverberación; una campana muy suave con el isotipo |

−14 LUFS, pico ≤ −1 dBTP, mucho más grave que el primer video (≈ 65–75 % de la energía bajo 150 Hz).

---

## Comprobación de afirmaciones (contra `07-verificacion-de-producto.md`)

| Afirmación | Estado |
|---|---|
| Publicar es gratis | ✅ Página: «Es gratis publicar.» ⚠️ Pregunta 6 de la verificación: ¿gratis sin límites ni cobros posteriores? |
| Los agentes pagan por desbloquear tu contacto, solo si tienen algo que coincide | ✅ Página: «Los agentes pagan por desbloquear tu contacto, y solo lo hacen si tienen algo que realmente coincide.» |
| Campos del formulario y datos de ejemplo | ✅ Capturas reales (datos de prueba). |
| «Te contactan por donde prefieras» | ⚠️ El campo «Preferencia de contacto» existe; **no está verificado** que los agentes lo respeten ni qué canales hay además de WhatsApp. |
| «Los agentes ven tu búsqueda» / «El agente te encuentra» | ⚠️ Depende de que haya agentes activos (pregunta 1 de la verificación). |
| Para agentes: «personas que ya saben qué quieren y cuánto pueden pagar» | ✅ Se desprende de los campos del formulario (tipo, zona, presupuesto). |
| Lo que pasa después de «Publicar solicitud» | No se muestra (sin captura). |
| Límite de 1, 3 o 5 agentes | No se menciona (efecto sin verificar). |

---

## Preguntas abiertas (cambian el guion)

1. **Lado del agente.** ¿Tienes capturas de lo que ve un agente: la lista de solicitudes, el botón para desbloquear un contacto, el precio? Si las hay, los planos 9 y 12 usan la interfaz real en vez de nodos gráficos.
2. **Después de publicar.** ¿Qué ve la persona al tocar «Publicar solicitud»: confirmación, crear cuenta, verificar el teléfono? Una captura de esa pantalla cerraría el acto 3.
3. **Canales de contacto.** ¿Qué opciones tiene «Preferencia de contacto» además de WhatsApp, y los agentes la respetan? Si no está garantizado, el plano 10 dirá «Te contactan con los datos que dejaste».
4. **Agentes y cobertura.** ¿Hay agentes activos hoy? ¿Solo Quito? (El póster dice «QUITO».)
5. **Público.** ¿El video habla sobre todo a quien busca, o igual a los agentes? Si es más para agentes, el acto 4 crece.
6. **Duración y voz.** ¿32 s te sirve? ¿Lo quieres solo con texto y música, o con locución?
7. **Límite de 1, 3 o 5 agentes.** Si funciona, sumo «Tú eliges cuántos agentes te contactan» al plano 9.
