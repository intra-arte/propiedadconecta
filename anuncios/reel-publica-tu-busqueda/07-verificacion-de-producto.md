# Verificación de producto antes de la v1

**Objetivo:** que el anuncio muestre solo lo que Propiedad Conecta hace hoy, y que una persona de Quito entienda qué ofrece, cómo funciona y qué puede esperar después de publicar su búsqueda.

**Estado:** el animatic v0 queda congelado en [animatic/v0/](animatic/v0/LEEME.md). No se generan imágenes ni clips con IA. La v1 se arma cuando estén confirmadas las pantallas, el registro, el contacto y la disponibilidad de agentes (ver [sección 4](#4-plan-para-la-v1)).

Este documento reemplaza la lista de preguntas de [00-diagnostico.md](00-diagnostico.md).

---

## 1. Capturas que necesito, por prioridad

| # | Captura | Escena | Qué decide |
|---|---|---|---|
| 1 | **Formulario para publicar una búsqueda:** todas las pantallas o pasos, con las listas desplegadas. Ideal: una grabación de pantalla llenándolo de principio a fin. | E4 | Rótulos, orden, número de pasos y si compra/arriendo es un campo. La voz L4 se ajusta a esto. |
| 2 | **Botón de publicar y la pantalla que aparece justo después.** | Final de E4 | Qué ve la persona al publicar y qué le dice la app que va a pasar. |
| 3 | **Registro o inicio de sesión:** en qué momento aparece, qué datos pide y el texto en el que la persona acepta que los agentes puedan ver su contacto. | Destino del anuncio; quizá E4 | Si el registro va antes o después, qué botón usar en Meta y si la persona sabe con quién se comparte su contacto. |
| 4 | **Lado del agente,** con una búsqueda de prueba: cómo ve una búsqueda antes de desbloquearla (qué datos aparecen) y el paso de desbloquear. | E5 | Si se muestra este lado y qué se puede mostrar sin datos reales. |
| 5 | **Lo que recibe quien busca** cuando un agente desbloquea su contacto o le escribe: notificación, correo o mensaje, si existe. Si la app no avisa nada y el agente llama o escribe por fuera, basta con decírmelo. | E6 | Si en E6 ella contesta una llamada, lee un mensaje o ve una notificación. |
| 6 | Si existe: **«mis búsquedas»** o el estado de una búsqueda publicada. | Opcional | Qué puede esperar después de publicar. Solo se muestra si es real. |
| 7 | **La página a la que llevará el clic del anuncio** (URL o pantalla). | Fuera del video | Que lo que promete el anuncio coincida con lo primero que ve la persona. |

Las capturas 1–5 bloquean la v1; la 6 y la 7 pueden llegar después.

### Cómo obtenerlas

- **De la versión que estará activa cuando salga el anuncio.** Si algo existe solo en diseño (Figma u otra herramienta), dímelo: no entra en el anuncio hasta que funcione.
- **Grabación de pantalla en el celular:**
  - iPhone: Centro de control → Grabación de pantalla.
  - Android: Ajustes rápidos → Grabar pantalla.
  - En vertical y sin audio. También sirven capturas de pantalla de cada paso.
- **Cuenta de prueba y datos ficticios.** Nunca búsquedas, nombres ni teléfonos de usuarios reales, sobre todo en la vista del agente.
- Modo No molestar activado, sin notificaciones de otras apps y la app en español.
- **Envío:** para el animatic v1 alcanza con mandarlas aquí en el chat. Para la edición final hacen falta los archivos originales sin comprimir (Drive, AirDrop o cable; no por WhatsApp, que los comprime).
- **Nombres:** con la escena al inicio, por ejemplo `E4-01-formulario.png`, `E4-02-confirmacion.png`, `E5-01-agente-busqueda.png`. Las guardo en `animatic/capturas/`.

---

## 2. Confirmado y pendiente

### Confirmado

| Dato | Fuente |
|---|---|
| Publicar una búsqueda es gratis para quien busca | Tu brief |
| Se indican tipo de propiedad, ubicación, presupuesto y características | Tu brief |
| Los agentes inmobiliarios pueden descubrir las búsquedas | Tu brief |
| Los agentes desbloquean el contacto con créditos para comunicarse | Tu brief |
| Lanzamiento en Quito; público: personas que quieren comprar o arrendar | Tu brief |
| Concepto principal «Deja de perseguir anuncios. Publica lo que buscas.» y CTA «Publica gratis tu búsqueda» | Tus instrucciones |
| Animatic v0 de 22,0 s; logo sin deformar; CTA legible en celular; voz a ritmo natural | Verificado técnicamente ([informe](animatic/v0/informe-qa.md)) |

«Confirmado» significa que lo dijiste tú. Todavía no lo vi funcionar en la app: las capturas lo verifican.

### Depende de tu respuesta

| # | Pregunta | Qué cambia en el anuncio |
|---|---|---|
| 1 | ¿Hoy hay agentes inmobiliarios registrados y revisando búsquedas en Quito? | Si se puede decir «pueden ver tu búsqueda» en presente y si se mantienen E5 y E6 ([escenarios](#escenarios-según-la-disponibilidad-de-agentes)). |
| 2 | ¿Quiénes pueden desbloquear contactos: solo agentes o corredores, o también propietarios? | La palabra «agentes inmobiliarios» de L5. |
| 3 | ¿Quién ve una búsqueda publicada: solo agentes registrados o cualquiera? ¿Se publica al instante o pasa por una revisión? | L5, el cartel de la versión B y cuánto tarda en estar visible. |
| 4 | ¿Qué dato de contacto recibe el agente y por dónde se comunica? ¿Quien busca recibe algún aviso? | E6. |
| 5 | ¿El registro va antes o después de publicar? ¿Qué datos pide? ¿La persona acepta expresamente que los agentes vean su contacto? | Destino del anuncio, botón de Meta y transparencia sobre los datos. |
| 6 | ¿Publicar es gratis sin límite de búsquedas y sin cobros posteriores para quien busca? | «Gratis» en L7 y en el CTA. |
| 7 | ¿Qué cobertura tiene: todo Quito, valles (Cumbayá, Tumbaco, Los Chillos)? | «por todo Quito» en L2, el cartel de B y los ejemplos. |
| 8 | ¿La app dice «búsqueda» o «solicitud»? ¿«Ubicación» o «sector»? | L4, L5 y el CTA. |
| 9 | ¿Apruebas la estructura narrativa del v0 (8 escenas, ganchos A y B)? | Si la v1 solo reemplaza marcadores o también cambia escenas. |
| 10 | ¿El repositorio sigue público o pasa a privado? | Nada en el anuncio. No cambio la visibilidad sin tu autorización. |
| 11 | ¿Hay logo vectorial o dominio para el cierre? | El cierre (opcional). |

Las preguntas 1, 3, 4, 5 y 6 junto con las capturas 1–5 son el mínimo para la v1.

---

## 3. Revisión de promesas del guion

Se revisaron la voz, los textos en pantalla, las imágenes y el texto del anuncio en Meta ([05](05-prueba-ab.md#texto-del-anuncio-igual-para-a-y-b)). Riesgo = qué tan probable es que alguien entienda algo que hoy podría no ser cierto.

| Frase o imagen | Dónde | Qué puede entender alguien | Riesgo | Se mantiene si… | Si no se confirma |
|---|---|---|---|---|---|
| «Agentes inmobiliarios pueden ver tu búsqueda» | L5, E5, texto en Meta | Que hoy hay agentes revisando búsquedas en Quito | **Alto** | Pregunta 1 = sí, y la búsqueda les llega al publicarla (pregunta 3) | Ver escenarios abajo |
| Andrés mira la búsqueda con interés | E5 (imagen) | Lo mismo: hay agentes atentos | **Alto** | Igual que L5 | Se quita el agente o la escena |
| «y contactarte si tienen algo para ti» | L6, texto en Meta | Que es probable que la contacten | Medio | Agentes activos y canal confirmado. El condicional ya evita prometer un contacto. | Sin agentes activos, no se usa |
| El celular vibra y ella lo toma | E6 (imagen) | Que publicar lleva a un contacto, y **rápido**: en la secuencia pasa el mismo día | **Medio-alto** | Agentes activos y canal confirmado, quitando la sensación de inmediatez (ver abajo) | Se reemplaza la escena |
| «Publica gratis tu búsqueda» | L7, E7, E8, CTA | Gratis y sin costos ocultos | Medio | Pregunta 6 = sí | Aclarar la condición o quitar «gratis» |
| Cartel «BUSCO DEPA…» pegado en una ventana | B1 (versión B) | Que la búsqueda queda a la vista de cualquiera | Medio | Si la búsqueda es pública | Cambiar la imagen por una que muestre que la ven agentes |
| «Deja de perseguir anuncios por todo Quito» | L2, E2 | Que ya no hay que buscar por cuenta propia, y que cubre toda la ciudad | Bajo | Es una invitación, no un resultado; «por todo Quito» describe el problema | Si la cobertura es parcial, quitar «por todo Quito» |
| «Tipo de propiedad, sector, presupuesto… y lo que no puede faltar» | L4, E4 | Que la app pide esos datos | Bajo | Coincide con el formulario real | Se ajusta al formulario |
| «Mejor publica tú lo que buscas» | L3 | Una comparación con buscar por tu cuenta | Bajo | — | — |
| «¿Otra vez “ya se arrendó”?», burbujas, anuncios «NO DISPONIBLE» | E1, E2 | El problema, no el producto | Ninguno | Las burbujas y anuncios no imitan ninguna app ni portal real | — |

### Escenarios según la disponibilidad de agentes

1. **Hay agentes activos hoy.**
   - Se mantienen L5 y L6.
   - E6 deja de sugerir inmediatez: entre E5 y E6 va una transición que muestre que pasó tiempo (cambio de luz o de lugar), sin prometer un plazo.
   - En pantalla queda visible el condicional «si tienen algo para ti».
2. **Hay pocos agentes, todavía en incorporación.**
   - L5 se mantiene solo si es literalmente cierto que los agentes registrados ven la búsqueda.
   - E6 no muestra un contacto: Daniela sigue con su día y la voz o el texto dicen que un agente puede contactarla si tiene algo para ella.
   - Así no se dramatiza un resultado que hoy sería poco frecuente.
3. **Todavía no hay agentes activos.**
   - No se puede decir «pueden ver tu búsqueda» en presente, y E5 y E6 salen.
   - Recomendación honesta: **no lanzar todavía la campaña de registros con esta promesa**. Quien publica y no recibe nada pierde confianza en una marca que recién empieza.
   - Si igual quieres captar búsquedas desde ya, el anuncio se reformula como lanzamiento anticipado, en tiempo futuro y sin escena de contacto. La frase exacta la escribo con tu respuesta.

### Lo que una persona debería saber después de publicar

El video tiene 22 s y no alcanza a explicarlo todo. Entre el anuncio, la página de destino y la pantalla de confirmación, la persona debería saber:

1. **Quién ve su búsqueda:** agentes inmobiliarios registrados u otros (pregunta 3).
2. **Que un agente puede obtener su contacto** al desbloquearlo, y escribirle o llamarla (preguntas 4 y 5).
3. **Que no hay garantía de contacto ni de plazo.** El condicional «si tienen algo para ti» lo cubre en el video.
4. **Cómo pausar o borrar su búsqueda,** si la app lo permite.

Los puntos 1 y 3 están en el anuncio. Los puntos 2 y 4 corresponden a la página de destino, al texto de consentimiento y a la pantalla posterior a publicar.

Compartir el contacto de una persona con terceros requiere su consentimiento claro según la Ley Orgánica de Protección de Datos Personales de Ecuador. Conviene que quien lleve lo legal revise ese texto. No es asesoría legal.

---

## 4. Plan para la v1

Cuando estén las capturas 1–5 y las respuestas 1, 3, 4, 5 y 6:

1. **v0 queda intacto** en `animatic/v0/`. El generador se niega a sobrescribir esa carpeta.
2. Las capturas se guardan en `animatic/capturas/`.
3. En `animatic/linea-de-tiempo.js`:
   - `version` pasa a `'v1'`;
   - los marcadores de E4–E6 se reemplazan por las capturas reales;
   - las frases de la sección 3 se ajustan según cada respuesta.
4. `node animatic/generar.mjs` produce `animatic/v1/` (videos, hojas, informe) y actualiza subtítulos, locución y tabla de tiempos.
5. Se actualizan 01, 02, 05 y 06. Esta lista se marca así: cada fila de la sección 3 queda resuelta como «se mantiene», «se cambió» o «se quitó».
6. Te entrego la v1 para aprobar, todavía sin IA. Solo después de esa aprobación se generan fotogramas y clips.
