# Verificación de producto — v1

**Objetivo:** que el anuncio muestre solo lo que Propiedad Conecta hace hoy, y que una persona de Quito entienda qué ofrece, cómo funciona y qué puede esperar después de publicar su búsqueda.

**Estado:**
- La v1 está construida con las capturas reales del formulario ([08](08-capturas-y-secuencia-v1.md)), centrada en quien busca y sin escenas del lado del agente.
- La v0 sigue congelada en [animatic/v0/](animatic/v0/LEEME.md).
- No se generaron imágenes ni clips con IA.

Este documento reemplaza la lista de preguntas de [00-diagnostico.md](00-diagnostico.md).

---

## 1. Capturas: recibidas y pendientes

| Captura | Estado | Para qué |
|---|---|---|
| Formulario completo, vacío y lleno | **Recibido** (5 capturas) | E4, E5 y el dorso del cartel de B |
| Pantalla que aparece después de tocar «Publicar solicitud» | Pendiente | La v1 no la muestra. Sirve para saber qué le dice la app a la persona al publicar. |
| Registro o inicio de sesión (si existe) | Pendiente | Destino del anuncio y botón de Meta |
| Página a la que llevará el clic | Pendiente | Que el anuncio y lo primero que se ve coincidan |
| Lado del agente | **No hace falta para la v1** | El anuncio se centra en quien busca |
| Lo que recibe quien busca cuando un agente la contacta | **No se usa** | El anuncio no muestra notificaciones ni conversaciones. Solo sirve para saber qué esperar. |
| **Versiones finales de las capturas del formulario** | Pendiente | Del sitio publicado, en alta resolución, idealmente en el celular, sin el indicador de desarrollo y con el rótulo «hasta X agentes» corregido ([08](08-capturas-y-secuencia-v1.md#detalles-de-la-interfaz-a-revisar-antes-de-grabar-el-final)) |

**Cómo obtenerlas:**
- Grabación de pantalla del celular (iPhone: Centro de control; Android: Ajustes rápidos).
- Cuenta de prueba y datos ficticios.
- Archivos originales, sin pasar por WhatsApp.

---

## 2. Confirmado y pendiente

### Confirmado

| Dato | Fuente |
|---|---|
| Publicar es gratis para quien busca | Brief y texto de la página: «Es gratis publicar.» |
| Los agentes pagan por desbloquear el contacto | Brief y texto de la página: «Los agentes pagan por desbloquear tu contacto…» |
| Los campos del formulario y sus nombres (lista en [08](08-capturas-y-secuencia-v1.md#qué-confirman-las-capturas)) | Capturas |
| Quien busca deja nombre, teléfono / WhatsApp, email (opcional) y preferencia de contacto en el mismo formulario | Captura `05` |
| Existe la opción «recibir contacto de hasta 1, 3 o 5 agentes» | Captura `05` (la opción se ve; su efecto no está verificado) |
| El botón final dice «Publicar solicitud» | Captura `05` |
| Lanzamiento en Quito; público: comprar o alquilar | Brief; el formulario permite elegir provincia y ciudad |
| Concepto «Deja de perseguir anuncios. Publica lo que buscas.» y CTA «Publica gratis tu búsqueda» | Tus instrucciones |

### Depende de tu respuesta

| # | Pregunta | Qué cambia |
|---|---|---|
| 1 | ¿Hoy hay agentes registrados y revisando búsquedas en Quito? | El anuncio no lo afirma, pero si no hay agentes, quien publica puede no recibir nada (ver sección 3). |
| 2 | ¿El límite de 1, 3 o 5 agentes se aplica de verdad? | Si no, salen la voz L6 («Tú eliges hasta cuántos») y la lupa. |
| 3 | ¿Los agentes respetan la preferencia de contacto (WhatsApp u otra)? | Lo que la persona puede esperar. El anuncio no lo promete. |
| 4 | ¿Quién ve una búsqueda publicada: solo agentes registrados? ¿Pasa por una revisión antes? | La metáfora del cartel de B y lo que se dice en la página de destino. |
| 5 | ¿Qué pasa después de publicar: hay que crear cuenta o verificar el teléfono? ¿Se puede pausar o borrar la búsqueda? | Destino del anuncio, botón de Meta y expectativas. |
| 6 | ¿Publicar es gratis sin límite de búsquedas y sin cobros posteriores para quien busca? | «Gratis» en el CTA. |
| 7 | ¿Dónde acepta la persona que los agentes vean su contacto? En las capturas solo aparece el texto de arriba de la página. | Transparencia y consentimiento (Ley Orgánica de Protección de Datos Personales; que lo revise quien lleve lo legal). |
| 8 | ¿Cobertura: solo Quito o más ciudades? | El texto del anuncio y la segmentación. |
| 9 | ¿Unificar «búsqueda» y «solicitud»? | CTA y botón de la app. |
| 10 | ¿El repositorio sigue público? | Nada en el anuncio. Ahora contiene también las capturas del formulario. No cambio la visibilidad sin tu autorización. |
| 11 | ¿Hay logo vectorial o dominio para el cierre? | El cierre (opcional). |

Para el anuncio final: las preguntas 1, 2, 5 y 6 y las capturas en alta resolución.

---

## 3. Comprobación de afirmaciones de la v1

Se revisan la voz, los textos en pantalla, las imágenes y el texto del anuncio en Meta.

| # | Afirmación o imagen | Dónde | Respaldo | Estado |
|---|---|---|---|---|
| 1 | «¿Otra vez “ya se arrendó”? ¿“Ya se vendió”?», burbujas y anuncios «NO DISPONIBLE» | L1, E1–E2 | Describe el problema, no el producto. Burbujas y anuncios genéricos, sin imitar ninguna app ni portal. | ✅ Sin afirmación de producto |
| 2 | «Deja de perseguir anuncios.» | L2, E2 | Es una invitación, no un resultado. | ✅ |
| 3 | «Publica lo que buscas.» | L3, E3 | La app tiene un formulario para eso: «Cuéntanos qué propiedad estás buscando» y el botón «Publicar solicitud». | ✅ Capturas |
| 4 | «Comprar o alquilar, tipo de propiedad, sector, presupuesto… y lo que no puede faltar.» | L4, E4 | Campos reales: ¿Qué deseas hacer? (Comprar / Alquilar), Tipo de propiedad, Sector / zona, Presupuesto (USD), Características. | ✅ Capturas |
| 5 | Formulario lleno: Comprar · Departamento · Pichincha · Quito · Cumbayá · 120000–180000 · 3 hab · 2 baños · 100 m² · Amoblado · Seguridad | E4 | Capturas reales con datos de prueba. Son un ejemplo, no una oferta ni una zona de cobertura. | ✅ Datos ficticios |
| 6 | «Si un agente tiene algo para ti, puede contactarte.» | L5, E5, texto en Meta | Brief: los agentes descubren solicitudes y desbloquean el contacto. Página: «Los agentes pagan por desbloquear tu contacto». Formulario: teléfono / WhatsApp. | ✅ Como posibilidad. No dice que haya agentes, cuántos, ni que vayan a contactar. ⚠️ Ver pregunta 1. |
| 7 | Anillo sobre «Teléfono / WhatsApp» y «Preferencia de contacto» | E5 | Campos reales. Muestra con honestidad que el contacto se comparte. | ✅ |
| 8 | «Tú eliges hasta cuántos.» y lupa sobre 1 / 3 / 5 agentes | L6, E5, texto en Meta | La opción se ve en el formulario. | ⚠️ **Visible, pero sin verificar que se aplique** (pregunta 2). Si no se aplica, se quita. |
| 9 | Toque en «Publicar solicitud» | E5 | Botón real. No se muestra qué pasa después. | ✅ |
| 10 | «Publica gratis tu búsqueda» | L7, E6, E7, título en Meta | Página: «Es gratis publicar.» | ✅ ⚠️ Confirmar que no hay límites ni cobros posteriores (pregunta 6). |
| 11 | Logo y «en Propiedad Conecta» | E7 | Logo oficial, sin deformar (informe de QA). | ✅ |
| 12 | Daniela tranquila en la terraza | E6 | Imagen emocional. No muestra contacto, oferta ni resultado. | ✅ |
| 13 | B: «Esta vez, el anuncio lo pones tú.» y el cartel que gira hacia la tarjeta real | B1 | La persona publica una solicitud que ven los agentes (brief y página). | ⚠️ La metáfora sugiere visibilidad pública (pregunta 4). |
| 14 | B: «¿Vas a comprar o alquilar en Quito?» | B2 | Opciones del formulario; Quito como ciudad del formulario. | ✅ |
| 15 | Texto en Meta: «…tú eliges de hasta cuántos agentes.» | Texto del anuncio | Igual que el 8. | ⚠️ Igual que el 8. |

**Qué se quitó por no estar respaldado (respecto de la v0):**
- «Agentes inmobiliarios pueden ver tu búsqueda» en presente.
- La escena del agente.
- El celular que vibra (contacto).
- El cartel «BUSCO DEPA» con datos inventados.
- «por todo Quito».
- «Ahora en Quito».

**Sobre la pregunta 1:** el anuncio ya no afirma que haya agentes activos. Aun así, si hoy no los hay, quien publique puede no recibir ningún contacto, y eso daña la confianza en una marca nueva. Mantengo la recomendación: lanzar la pauta cuando haya agentes usando la plataforma.

### Qué puede esperar una persona después de publicar

| Lo que el anuncio y la app dicen hoy | Lo que falta aclarar (en la app o en la página de destino) |
|---|---|
| Publicar es gratis | Si hay límites o cobros posteriores |
| Deja su teléfono o WhatsApp en el formulario, y los agentes pagan por desbloquearlo | Dónde acepta compartirlo (consentimiento claro) |
| Un agente puede contactarla si tiene algo para ella; no se promete contacto ni plazo | Qué le confirma la app al publicar y si la avisa cuando alguien desbloquea su contacto |
| Elige de hasta cuántos agentes quiere recibir contacto | Que el límite se aplique; cómo pausar o borrar la búsqueda |

La página dice «…y solo lo hacen si tienen algo que realmente coincide». El anuncio no lo repite, porque es una afirmación absoluta que la app no puede garantizar ([08](08-capturas-y-secuencia-v1.md#detalles-de-la-interfaz-a-revisar-antes-de-grabar-el-final)).

---

## 4. Siguientes pasos

1. **Tú:**
   - revisar y aprobar el animatic v1 (`animatic/v1/`);
   - responder las preguntas 1, 2, 5 y 6;
   - decidir la visibilidad del repositorio.
2. **Validación:** mostrar `animatic-A-v1.mp4` a 3–5 personas de Quito, primero sin sonido, y preguntar:
   - ¿Qué hace esta app?
   - ¿Cuánto cuesta publicar?
   - ¿Qué pasa con tu teléfono al publicar?
   - ¿Te van a contactar seguro?

   La última pregunta comprueba que nadie entienda una garantía.
3. **Producción final:** con las respuestas y las capturas finales, se ajusta la línea de tiempo (v2, si hace falta) y solo entonces se generan fotogramas y clips con IA. Recursos faltantes en [06](06-montaje-y-control-de-calidad.md#recursos-que-faltan-para-el-anuncio-final).
