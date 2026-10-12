# La fórmula de los anuncios de Propiedad Conecta

La receta del anuncio «Publica lo que buscas» (v1 de motion, aprobada el 11/10/2026), escrita para repetirla. La primera parte es la idea; la segunda, las reglas; la tercera, cómo se pide un anuncio nuevo y qué se recibe.

Para pedir uno basta con decirle a Claude «nuevo anuncio: …». Claude sigue esta fórmula con la skill `anuncio-propiedad-conecta` y el motor de `anuncios/motor/`.

## 1. La idea en cinco tiempos

Reel vertical de 15 a 20 s (el aprobado dura 16 s: 32 beats a 120 BPM, 8 compases).

| Tiempo | Qué tiene que pasar | En «Publica lo que buscas» |
|---|---|---|
| **1. Gancho** (0–2 s) | El dolor en el primer fotograma: sin intro, sin logo. Una frase directa, dicha y escrita | Un anuncio con el sello «YA SE ARRENDÓ» y un muro infinito de anuncios que se pierden |
| **2. Giro** (2–3 s) | Todo se congela en el beat y se invierte. Es la idea del producto convertida en una imagen | El muro se da la vuelta: los anuncios se voltean y queda una página limpia |
| **3. Promesa** (3–4,5 s) | El titular con el verbo del producto. El protagonista entra en la tipografía | «Publica lo que buscas.» y el punto cae como el punto de la «i» |
| **4. Prueba** (4,5–10 s) | El producto real, con pantallas reales. Cada parte se ve cuando la voz la nombra | El formulario, tarjeta por tarjeta, de vacía a llena |
| **5. Cierre** (10–16 s) | El protagonista se vuelve la marca. CTA hablado y escrito; el cierre completo, quieto 3 s | El punto aterriza en la cabeza del isotipo; «Publica gratis tu búsqueda» |

**El hilo es el punto verde.** En Propiedad Conecta el protagonista es siempre el punto: es la cabeza clara del isotipo. Hace todas las transiciones (salta, se vuelve letra, se estira en marco, se recoge) y termina en el logo. No hay cortes que obliguen a reorientarse, y al final el espectador entiende que lo que vio durante todo el anuncio **era** la marca.

**Lo que cambia en cada anuncio es la metáfora.** El muro y el volteo pertenecen a este mensaje. Un anuncio nuevo necesita su propia imagen del dolor y su propio giro; si se repite el muro, todos los anuncios se ven iguales. Se mantienen la estructura, el punto, la escena del producto y el cierre.

**A/B limpio.** Cada anuncio sale en dos versiones que solo cambian el gancho (los primeros 3 s). Desde ahí son idénticas, así la prueba mide el gancho y nada más. En el aprobado: A, directa («Deja de perseguir anuncios.»), y B, curiosidad («Esta vez, el anuncio lo pones tú.»).

## 2. Las reglas

**Honestidad (no se negocia)**
- El producto se muestra solo con capturas reales. Se permiten recortes, cámara, foco y barridos entre dos capturas reales; no se dibuja, completa ni simula ninguna interfaz, ni siquiera como recurso provisional.
- No se prometen resultados ni contactos garantizados, ni se afirma que haya agentes activos si no está verificado.
- «Gratis» o cualquier dato del producto se dice solo si está confirmado. Mientras no lo esté, se marca en pantalla como pendiente.
- Se usa el logo original, con escala uniforme (≤ 100 %), sobre marfil. Nunca se reconstruye ni se deforma.
- Los datos de prueba (nombres, correos) no salen nunca en cuadro.

**Marca**
- Marfil `#F9FAF5`, tinta `#142A22`, verde punto `#4C9F2D` (muestreados del logo). Un solo color de acento: el verde.
- Outfit (la del logotipo) para todo lo que se lee; JetBrains Mono solo como textura de datos.
- Texto y logo dentro de la zona segura de Reels y Stories: x 65–1015, y 270–1248 en 1080 × 1920.

**Sonido**
- La voz va delante: unos 10 dB por encima de la música en cada frase. La música baja bajo la voz.
- Cada frase suena cuando aparece en pantalla lo que nombra (con menos de 0,25 s de diferencia).
- El punto tiene su sonido (marimba de vidrio) y la marca firma con re–la–fa#: al aterrizar en el isotipo, al subir el CTA y al aparecer el nombre.
- Mezcla final a −14 LUFS, con el pico real a −1 dBTP o menos.

**Tiempo**
- Todo cae en el beat. La cuadrícula se mide sobre la música renderizada y la imagen la sigue: el punto golpea en el beat con menos de un fotograma de error.
- Algo nuevo cada 2–4 s.
- La voz va a ritmo natural (hasta 5,8 sílabas por segundo) y termina 1,5–2 s antes del final.

**Calidad**
- Antes de renderizar el video completo se muestran el concepto y una hoja de contactos.
- Ocho criterios con nota de 1 a 10, y se itera hasta que todos lleguen a 8: gancho, comprensión, legibilidad en teléfono, calidad del motion, variedad, marca, sincronía y CTA.
- Los controles se hacen sobre el archivo exportado, no sobre la vista previa: formato, sonoridad, pico, sincronía del punto, cada frase de voz en su sitio y logo sin deformar.

## 3. Cómo se pide un anuncio nuevo

**Lo que hace falta para empezar**
1. **El mensaje:** a quién le habla y qué dolor resuelve, en una frase.
2. **Los datos confirmados:** qué se puede prometer y qué no (por ejemplo, si es gratis).
3. **Las capturas reales** de la parte del producto que se va a mostrar, a 1440 × 900 o más y sin datos de prueba visibles. Para cada parte que pasa de vacía a llena hacen falta las dos capturas del mismo encuadre: vacía y llena.

**Lo que llega después**
4. **La voz:** cuando el guion esté aprobado, Claude da el texto exacto de cada línea con su tiempo. Se graba una toma por línea (mejor tres); con una nota de voz del teléfono en un cuarto silencioso alcanza.

**El proceso**
1. Claude propone el concepto: la metáfora del dolor, el giro, los dos ganchos y el guion con tiempos. **Tú apruebas.**
2. Hoja de contactos, un fotograma por beat. **Tú apruebas** antes del render completo.
3. Pide las capturas y la voz que falten, y te dice exactamente qué debe decir cada línea.
4. Render final, A y B, con los controles y el informe de calidad.

**Lo que se entrega:** las versiones A y B en MP4 (1080 × 1920, H.264), los subtítulos `.srt`, el audio en FLAC (mezcla y stems de música, SFX y voz), el guion técnico con los tiempos, las hojas de revisión y el informe de calidad con las notas de cada pasada.

## 4. Lo que aprendimos en el primero

- Una toma de voz larga se corta en sus pausas naturales y cada frase se ancla a lo que nombra. No se acelera la voz.
- Las tomas pueden traer ruidos antes de la frase: se dejan fuera con el corte, sin tocar el archivo.
- Las capturas de otra sesión cambian valores y posiciones: se vuelve a medir dónde cae cada una.
- El CTA hablado tiene que empezar cuando su texto ya se lee, no antes.
- El gancho B suele ser más largo que el A: hay que revisar que no pise la línea siguiente.
