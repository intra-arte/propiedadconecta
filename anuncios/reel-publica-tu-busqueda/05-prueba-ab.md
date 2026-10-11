# 7 · Gancho alternativo para la prueba A/B (v1)

## Las dos versiones

| | **A · Dolor** (principal) | **B · Inversión** (propuesta para probar después) |
|---|---|---|
| Primeras palabras | «¿Otra vez “ya se arrendó”? ¿“Ya se vendió”?» | «Esta vez, el anuncio lo pones tú.» |
| Imagen del gancho | Daniela de noche, con burbujas de «ya se arrendó» y «ya se vendió» | Un cartel «SE ARRIENDA» en una ventana de Quito que gira y se convierte en la tarjeta real «¿Qué estás buscando?» de la app |
| Hipótesis | Conecta con quien ya está buscando y está cansado. Se espera mejor retención y registros más calificados. | La novedad explica el producto en un segundo y lo une a la pantalla real. Se espera más gente que se detiene y más clics. |
| Riesgo | Si el público aún no sufre la búsqueda, el gancho le dice poco. | Puede atraer a **propietarios** que quieren anunciar su inmueble. Lo mitiga la segunda línea, que nombra a quien compra o alquila. |

**Solo cambian los primeros 4,7 s.** Desde 4,7 s («Publica lo que buscas») hasta 23,5 s, A y B son idénticas: mismo render, misma música, mismo cierre. En la línea de tiempo salen del mismo bloque, así que no pueden desincronizarse. B necesita 2 clips extra (C07 y C08).

**Animatics:**
- `animatic/v1/animatic-B-v1.mp4`, para mostrar;
- `animatic/v1/animatic-B-v1-revision.mp4`, para revisión.

## Versión B — locución y escenas (0,0 → 4,7 s)

| # | Tiempo (s) | Locución | Síl./s | Dirección |
|---|---|---|---|---|
| LB1 | 0,10–2,30 | Esta vez, el anuncio lo pones tú. | 5,0 | Segura, con complicidad. Peso en «tú». |
| LB2 | 2,50–4,50 | ¿Vas a comprar o alquilar en Quito? | 5,5 | Pregunta directa y cercana. |

Desde 4,90 s sigue con L3 («Publica lo que buscas.») y el resto exactamente como en la versión A. Se dice «alquilar» para que coincida con la opción de la app.

### B1 · Gancho — 0,0 → 2,4 s

- **Fuente:** C07 (fachada con un cartel en blanco), más el cartel «SE ARRIENDA» compuesto en edición con tracking planar y la captura real de la tarjeta «¿Qué estás buscando?».
- **Qué se ve:** la ventana de planta baja de un edificio residencial del norte de Quito, con un cartel clásico «SE ARRIENDA» (letras rojas; sin teléfono, o con uno claramente ficticio). En 0,5 s el cartel gira en 3D y su dorso es la **tarjeta real del formulario**, con «Comprar una propiedad» y «Departamento». Ya no se usa un cartel «BUSCO DEPA» inventado: el giro lleva directo a la app.
- **Cámara:** trípode con push-in muy lento.
- **Sonido:** ambiente de calle; cartulina que gira y whoosh. Voz LB1.
- **Texto:** titular «Esta vez, el anuncio lo pones tú.» («tú» con marcador), desde el frame 0.
- **Transición:** corte directo.

### B2 · Pregunta — 2,4 → 4,7 s

- **Fuente:** C08.
- **Qué se ve:** Daniela camina por una calle arbolada del norte de Quito mirando su celular, y levanta la vista, pensativa.
- **Cámara:** gimbal retrocediendo frente a ella.
- **Sonido:** pasos y ambiente de calle. Voz LB2.
- **Texto:** subtítulos «¿Vas a comprar o alquilar» / «en Quito?».
- **Transición → E3:** barrido chevrón, igual que en A; al terminar entra el beat.

**Nota de honestidad:** la metáfora del cartel sugiere que la búsqueda queda «a la vista». Según la app, la ven los agentes, que pagan por desbloquear el contacto. Si se confirma que solo la ven agentes, la metáfora funciona como «un anuncio para agentes». Aun así, en la prueba con personas conviene comprobar que nadie entienda que su búsqueda o su teléfono quedan públicos. Ver [07](07-verificacion-de-producto.md#3-comprobación-de-afirmaciones-de-la-v1).

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

Mismas reglas que el video: sin afirmar que hay agentes activos y con el papel del agente en condicional. El botón «Registrarte» depende del flujo real de registro, que sigue pendiente.

- **Texto principal:** ¿Vas a comprar o alquilar en Quito? Publica gratis lo que buscas: tipo de propiedad, ubicación, presupuesto y características. Si un agente tiene algo para ti, puede contactarte, y tú eliges de hasta cuántos agentes.
- **Título:** Publica gratis tu búsqueda
- **Botón:** Registrarte
- **Destino:** directo al formulario para publicar la búsqueda, no a la home. El primer texto de la página repite la promesa del anuncio. El evento de conversión se dispara al publicar la búsqueda.
