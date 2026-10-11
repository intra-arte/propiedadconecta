# Revisión de capturas y secuencia visual — v1

## Capturas recibidas

Están en `animatic/capturas/originales/`, con nombre descriptivo. Los recortes los genera `animatic/capturas/preparar.py`.

| Archivo | Qué muestra | Dónde se usa |
|---|---|---|
| `01-formulario-vacio.jpg` | Cabecera, título y las tarjetas «¿Qué estás buscando?», «Ubicación» y «Presupuesto (USD)» vacías | E4: estado «antes» de cada tarjeta |
| `02-formulario-lleno-arriba.jpg` | Las mismas tarjetas completas: Comprar · Departamento · Pichincha · Quito · Cumbayá · 120000–180000 | E4: estado «después»; B1: dorso del cartel |
| `03-caracteristicas-vacio.jpg` | «Características» vacía | E4: «antes» |
| `04-caracteristicas-lleno.jpg` | 3 habitaciones · 2 baños · 100 m² mínimos · Amoblado · Seguridad | E4: «después» |
| `05-contacto-y-publicar.jpg` | «Cuéntales un poco sobre ti» (opcional), «Tus datos de contacto», opciones de 1, 3 o 5 agentes y botón «Publicar solicitud» | E5 |

**Datos personales:** los datos de ejemplo son ficticios y los campos de nombre y correo están vacíos. El teléfono de ejemplo «0991234567» se difuminó por precaución.

## Qué confirman las capturas

- **Gratuidad**, en el texto de la propia página: «Es gratis publicar.»
- **Cómo se comparte el contacto**, también en la página: «Los agentes pagan por desbloquear tu contacto…».
- **Campos del formulario:**
  - ¿Qué deseas hacer? (Comprar una propiedad / Alquilar una propiedad) y Tipo de propiedad.
  - Ubicación: Provincia, Ciudad y Sector / zona (opcional).
  - Presupuesto (USD): precio mínimo y máximo.
  - Características: habitaciones, baños, metros cuadrados mínimos, parqueaderos, antigüedad máxima (opcional), fecha aproximada (opcional), Amoblado / Ascensor / Piscina / Seguridad y otra característica (opcional).
  - Cuéntales un poco sobre ti (opcional).
  - Tus datos de contacto: nombre, teléfono / WhatsApp, email (opcional), preferencia de contacto y «recibir contacto de hasta 1, 3 o 5 agentes».
  - Botón «Publicar solicitud».
- **Los datos de contacto se dejan en el mismo formulario.**

## Qué no muestran (sigue pendiente)

- Qué pasa después de tocar «Publicar solicitud»: confirmación, creación de cuenta, verificación.
- Si hace falta registrarse o iniciar sesión (en la cabecera aparece «Mi cuenta»).
- El lado del agente (en la cabecera aparece «Para agentes»).
- Si el límite de 1, 3 o 5 agentes se aplica en la práctica.
- Si hoy hay agentes activos.

## Detalles de la interfaz a revisar antes de grabar el final

Son de la app; no los cambio. El animatic los esquiva recortando, sin redibujar nada.

1. **«Quiero recibir contacto de hasta X agentes»:** la X es literal. En el animatic se recortó y solo se ve la fila de opciones (1 / 3 / 5 agentes).
2. **Fecha en formato de EE. UU.:** el campo de fecha muestra «mm/dd/yyyy»; en Ecuador se usa dd/mm/aaaa. Se ve en la tarjeta de Características.
3. **Afirmación absoluta:** la página dice «…y solo lo hacen si tienen algo que realmente coincide». Es una afirmación sobre lo que harán los agentes, que la app no puede garantizar. El anuncio no la repite: el recorte de la cabecera deja fuera ese texto. Una alternativa más prudente: «Como pagan por desbloquearlo, lo hacen cuando creen que tienen algo para ti.»
4. **Indicador «N» de Next.js en la esquina:** las capturas parecen del entorno de desarrollo. Las del anuncio final deben ser del sitio publicado.
5. **«Alquilar» frente a «arrendar»:** la app dice «Alquilar una propiedad»; en Quito se dice más «arrendar». El anuncio usa «alquilar» cuando describe el formulario, para coincidir con la pantalla, y «ya se arrendó» en el gancho, que es cómo habla la gente.
6. **«Publicar solicitud» frente a «Publica gratis tu búsqueda»:** son dos palabras para lo mismo. Funciona, pero conviene unificar.
7. **Resolución:** 800 × 500 px y JPG muy comprimido; al ampliar, el texto se ve suave. Para el final hacen falta capturas en alta resolución, idealmente de la versión móvil.

## Secuencia visual elegida

| Momento | Escenas | Qué se ve |
|---|---|---|
| Problema | E1–E2 (0–4,7 s) | Noche: burbujas «Ya se arrendó.» / «Ese ya se vendió.» y anuncios genéricos «NO DISPONIBLE». Todavía no aparece la app. |
| Giro | E3 (4,7–6,4 s) | De día: «Publica lo que buscas.» |
| Solución: el formulario real | E4 (6,4–11,9 s) | La página se desplaza como al llenarla:<br>1. Vista general (cabecera con logo y título).<br>2. «¿Qué estás buscando?»: pasa de vacía a «Comprar» marcado; anillo en compra o alquiler y luego en tipo.<br>3. «Ubicación».<br>4. «Presupuesto».<br>5. «Características»: anillo en los números y luego en las casillas. |
| Demostración: tus datos y tu control | E5 (11,9–17,6 s) | «Tus datos de contacto», con anillo en teléfono / WhatsApp y preferencia de contacto. Luego una lupa sobre «1 agente · 3 agentes · 5 agentes» y un toque en «Publicar solicitud». |
| Cierre | E6–E7 (17,6–23,5 s) | Daniela tranquila y «Publica gratis tu búsqueda»; luego logo y botón. |

**Por qué así:**
- Cuatro tarjetas para los cuatro datos que nombra la voz, y cada una aparece cuando se la nombra.
- El paso de vacío a lleno usa dos capturas reales del mismo formulario. Muestra la acción de completarlo sin inventar animaciones de escritura.
- «Cuéntales un poco sobre ti» queda fuera: es opcional, no cambia la promesa y alargaría la demostración.
- «Tus datos de contacto» se muestra a propósito: deja ver que, al publicar, se comparte un teléfono o WhatsApp con agentes.
- No se muestra nada después de publicar: no hay captura de esa pantalla, y el anuncio no la necesita.
- Ya no hay escena del agente ni de contacto. El anuncio queda centrado en quien busca y no dramatiza resultados.
