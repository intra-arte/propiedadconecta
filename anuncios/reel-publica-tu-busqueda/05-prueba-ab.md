# 7 · Gancho alternativo para la prueba A/B

## Las dos versiones

| | **A · Dolor** (principal) | **B · Inversión** (alternativa) |
|---|---|---|
| Primeras palabras | «¿Otra vez “ya se arrendó”?» | «Esta vez, el anuncio lo pones tú.» |
| Imagen del gancho | Daniela de noche, con burbujas de «ya se arrendó» | Un cartel «SE ARRIENDA» que gira y se convierte en «BUSCO DEPA · 2 hab · Cumbayá · hasta $700» |
| Hipótesis | Conecta con quien ya está buscando y está cansado. Se espera mejor retención y registros más calificados. | La novedad explica el producto en un segundo. Se espera más gente que se detiene y más clics. |
| Riesgo | Si el público aún no sufre la búsqueda, el gancho le dice poco. | Puede atraer a **propietarios** que quieren anunciar su inmueble. Lo mitiga la segunda línea, que nombra a compradores y arrendatarios. |

**Solo cambian los primeros 6,6 s.** De 6,6 a 22,0 s ambas versiones son idénticas: mismo render, misma música, mismo cierre. En la línea de tiempo salen del mismo bloque, así que no pueden desincronizarse. B solo necesita 2 clips extra (C07 y C08). Su animatic de revisión es `animatic/salida/animatic-B-v0-revision.mp4`.

## Versión B — locución y escenas (0,0 → 6,6 s)

| # | Tiempo (s) | Locución | Síl./s | Dirección |
|---|---|---|---|---|
| LB1 | 0,10–2,30 | Esta vez, el anuncio lo pones tú. | 5,0 | Segura, con complicidad. Peso en «tú». |
| LB2 | 2,50–4,45 | ¿Vas a comprar o arrendar en Quito? | 5,6 | Pregunta directa y cercana. |
| LB3 | 4,85–6,25 | Publica lo que buscas. | 5,0 | Igual que L3 en A. |

Desde 6,90 s sigue con L4–L7 exactamente como en la versión A.

### B1 · Gancho — 0,0 → 2,4 s

- **Fuente:** C07 (fachada con cartel en blanco) + carteles compuestos en edición con tracking planar.
- **Qué se ve:** ventana de planta baja de un edificio residencial del norte de Quito, con un cartel clásico **«SE ARRIENDA»** (letras rojas sobre cartulina blanca; sin teléfono o con uno claramente ficticio, tipo 09•• ••• •••). En 0,5 s el cartel **gira en 3D** (8 frames) y se convierte en una tarjeta de la marca: **«BUSCO DEPA»** en `#142A22` y Outfit Bold, más «2 hab · Cumbayá · hasta $700» y un punto verde brote.
- **Cámara:** trípode con push-in muy lento.
- **Iluminación:** mañana soleada, sombras limpias.
- **Sonido:** ambiente de calle con tráfico lejano; sonido de cartulina + whoosh en el giro; música filtrada. Voz LB1.
- **Texto:** titular «Esta vez, el anuncio lo pones tú.» («tú» con marcador verde brote), desde el frame 0. Sin subtítulos.
- **Transición:** corte directo.

### B2 · Pregunta — 2,4 → 4,6 s

- **Fuente:** C08.
- **Qué se ve:** Daniela camina por una calle residencial arbolada del norte de Quito mirando su celular; baja el ritmo y levanta la vista, pensativa.
- **Cámara:** gimbal retrocediendo frente a ella, plano medio, 35 mm.
- **Iluminación:** sol suave filtrado por los árboles.
- **Sonido:** ambiente de calle, pasos; música aún filtrada. Voz LB2.
- **Texto:** subtítulos «¿Vas a comprar o arrendar» / «en Quito?» (bloques 2–3 de `version-b.srt`).
- **Transición → E3:** barrido chevrón, igual que en A; al terminar entra el beat.

### E3 en la versión B — 4,6 → 6,6 s

El mismo clip C02, con la voz LB3 y el titular «Publica lo que buscas.» desde 4,85 s.

«Cumbayá» y «hasta $700» en el cartel son un ejemplo de lo que alguien buscaría, no datos de la app. Se cambian si la cobertura no incluye los valles.

**Subtítulos que se queman en B:** bloques 2–3 y 9–12 de `version-b.srt`.

---

## Cómo correr la prueba en Meta

- **Herramienta:** prueba A/B de Ads Manager con la variable *creatividad*. Reparte el público sin solaparlo. Dos anuncios en el mismo conjunto no sirven como prueba: el algoritmo favorece a uno muy pronto.
- **Todo lo demás igual:** público, presupuesto, ubicaciones (Reels + Stories), texto del anuncio, título y botón.
- **Mejoras creativas automáticas (Advantage+) desactivadas** durante la prueba, para que Meta no agregue música, recortes ni textos distintos a cada versión.
- **Duración:** al menos 7 días, y hasta que cada versión acumule un volumen de registros que permita comparar (como referencia, 30–50 por versión). Con menos, la diferencia puede ser azar.

## Qué medir

| Métrica | Qué indica |
|---|---|
| **Tasa de gancho** = reproducciones de 3 s ÷ impresiones | Si el inicio detiene el scroll. Es la primera lectura y la más directa del gancho. |
| **Retención** = ThruPlays ÷ reproducciones de 3 s, y curva a 3 s / 7 s | Si el gancho lleva bien hacia la explicación. |
| **CTR de enlace** | Si el anuncio genera intención. |
| **Costo por búsqueda publicada** (evento de conversión) | **La métrica que decide.** |
| **Calidad:** % de registros que completan la búsqueda; mezcla compra/arriendo; % de registros equivocados (propietarios, agentes) | Evita que gane un gancho que trae clics baratos pero que no sirven. |

Comparar las versiones entre sí, no contra promedios de otras industrias.

**Regla de decisión:** gana la versión con **menor costo por búsqueda publicada**, siempre que su calidad no sea peor. Si una gana en tasa de gancho pero pierde en costo por búsqueda, se conserva la ganadora en costo y se itera el gancho de la otra.

## Siguientes pruebas sugeridas (una variable a la vez)

1. Versiones específicas para **arriendo** y para **compra** (formulario y ejemplo distintos).
2. **Tú vs. usted** para compradores de más de 40 años.
3. Voz femenina vs. masculina.

## Texto del anuncio (igual para A y B)

- **Texto principal:** ¿Vas a comprar o arrendar en Quito? Publica gratis lo que buscas: tipo de propiedad, sector, presupuesto y características. Agentes inmobiliarios pueden ver tu búsqueda y contactarte si tienen algo para ti.
- **Título:** Publica gratis tu búsqueda
- **Botón:** Registrarte
- **Destino:** directo al formulario para publicar la búsqueda, no a la home. El primer texto de la página repite la promesa del anuncio. El evento de conversión se dispara al publicar la búsqueda.
