# Diagnóstico de recursos — 11 de octubre de 2026

*Actualizado tras el animatic v0 (22 s): secciones 3, 4 y 6.*

## 1. Qué hay realmente disponible

| Recurso | Estado |
|---|---|
| Repositorio `intra-arte/propiedadconecta` | **Público.** Tiene una sola rama (`claude/propiedad-conecta-ad-j91f1t`) y un solo commit: los documentos de este anuncio. No hay rama principal ni código. Estaba vacío antes de la primera sesión. |
| Código de la app | **No disponible.** No hay otro repositorio de Propiedad Conecta en la cuenta. Los otros dos repositorios (`prosperidad-regenerativa`, `somos-uno-sanpablo`) no parecen relacionados por el nombre y no se abrieron. |
| Interfaz de la app (pantallas, capturas, diseños) | **No disponible.** Los conectores de Figma y Wix de esta sesión están configurados pero no se conectaron: la política de red del entorno los bloquea. |
| Información de producto | Solo el brief escrito (ver sección 2). |
| Logo | Una imagen `.webp` de 1536 × 1024 (raster, sin vector) y los PNG derivados en `marca/`. |
| Herramientas en este entorno | ffmpeg, Chromium, Node, Python, ImageMagick y acceso a Google Fonts: alcanza para armar un animatic. **No hay generación de voz, imagen ni video con IA.** |

**Conclusión: no tengo acceso al código ni a la interfaz de la aplicación, y no conozco su funcionamiento actual más allá del brief.**

## 2. Lo único confirmado sobre el producto (brief)

1. Las personas publican **gratis** lo que buscan.
2. Indican **tipo de propiedad, ubicación, presupuesto y características**.
3. Los agentes inmobiliarios pueden **descubrir** esas solicitudes.
4. Los agentes **desbloquean el contacto con créditos** para comunicarse.
5. Se lanza en **Quito**, para personas que quieren **comprar o arrendar**.

## 3. Estado de los documentos de producción

| Documento | Estado |
|---|---|
| Animatic v0 (`animatic/`) | **Hecho:** 22,0 s, versión A (prueba y revisión) y B (revisión), sin audio, con marcadores en E4–E6. Control automático en `animatic/salida/informe-qa.md`. |
| Línea de tiempo y tabla de tiempos | **Hechas.** `animatic/linea-de-tiempo.js` es la fuente única; la tabla, los `.srt` y la locución se generan desde ella. |
| 01 · Concepto y voz en off | Actualizado a 22 s. |
| 02 · Guion técnico | Reescrito a 22 s. Los supuestos de producto se retiraron y quedaron como marcadores. |
| 03 · Prompts IA | Duraciones actualizadas; E6 y E7 con acción neutral respecto del canal de contacto. **No se ejecutó ninguno.** |
| 04 · IA vs edición y logo | Actualizado (tamaño del logo en el cierre). El logo sigue siendo raster. |
| 05 · Prueba A/B | Actualizado a 22 s. |
| 06 · Montaje y control de calidad | Actualizado a 22 s. |
| Voz guía, música | **No iniciado.** No hay voz sintética en este entorno. |
| Imágenes y clips IA | **No iniciado** (a propósito). |

## 4. Supuestos en los documentos

| Supuesto | Dónde | Estado |
|---|---|---|
| Rótulos, valores de ejemplo, botón «Publicar gratis», pantalla «Búsqueda publicada», logo en la cabecera de la app | 02 E4 | **Retirados.** E4 es un marcador «CAPTURA PENDIENTE» con los cuatro datos del brief. |
| Tarjeta del agente con candado | 02 E5 | **Retirada.** E5 es un marcador «CAPTURA PENDIENTE». |
| El agente llama y ella contesta | 02 E6, 03 C05/C06 | **Retirado.** La acción es neutral (el celular vibra, ella lo toma y mira); canal POR CONFIRMAR. |
| «Ahora en Quito» | 02 E8 | **Retirado** del cierre hasta confirmar cobertura. |
| La palabra «sector» en la voz L4 | 01, locución | Se mantiene por ser natural en Quito. Si la app dice «Ubicación», se cambia. |
| El agente trabaja en laptop | 02 E5, 03 C04 | Es solo el plano ilustrativo. Se ajusta si los agentes usan la app en el celular. |
| «Cumbayá · hasta $700» en el cartel de B | 05 B1 | Ejemplo de una búsqueda, no dato de la app. Se cambia si la cobertura no incluye los valles. |
| Botón de Meta «Registrarte» y clic directo al formulario | 05, 06 | Depende del flujo real de registro (pregunta 5). |

## 5. Preguntas para el proyecto original

Las marcadas con ★ bloquean el guion; las demás, solo la edición.

**Acceso**

1. ★ ¿Dónde está hoy la app: otro repositorio, Figma, Wix u otra herramienta? ¿Está publicada, en beta o solo diseñada?
2. ¿El repositorio `propiedadconecta` debe seguir público? Hoy cualquiera puede ver el plan del anuncio y el logo.

**Capturas** (desde el celular, tal como las vería un usuario)

3. ★ Todas las pantallas del formulario para publicar una búsqueda, con las listas desplegadas (por ejemplo, tipos de propiedad).
4. ★ El botón final y la pantalla que aparece después de publicar.
5. La pantalla donde aterriza quien llega desde un enlace, y el registro: ¿va antes o después de publicar? ¿Qué datos pide?
6. La vista del agente: cómo ve una búsqueda y cómo desbloquea el contacto. Si prefieres no mostrar ese lado en el anuncio, dímelo.

**Datos**

7. ★ ¿Qué dato de contacto recibe el agente y por dónde se comunica (llamada, WhatsApp, correo, dentro de la app)?
8. ★ ¿Los agentes ya pueden usar la plataforma hoy? Si todavía no, no podemos decir en presente «pueden ver tu búsqueda».
9. ★ ¿Publicar es gratis sin límites ni cobros posteriores para quien busca?
10. ¿Qué cobertura tiene: Quito urbano, valles (Cumbayá, Tumbaco, Los Chillos)?
11. ¿La app dice «búsqueda» o «solicitud»?
12. ¿Hay logo vectorial, tipografía oficial o un dominio para el cierre?

## 6. Siguiente paso recomendado

1. **Hecho:** guion ajustado a 22 s y animatic v0 (ver [README](README.md#ver-el-animatic)). La propuesta de ajuste de la versión anterior de este diagnóstico se reemplazó por la [tabla de tiempos definitiva](animatic/tabla-de-tiempos.md). Para que la voz suene natural se quitó «¿Ya se vendió?» de la locución; queda como burbuja en pantalla.
2. **Tú:**
   - revisar `animatic/salida/animatic-A-v0.mp4` y aprobar o corregir la estructura narrativa;
   - enviar las capturas y respuestas marcadas con ★;
   - decidir la visibilidad del repositorio (pregunta 2).
3. **Validación con personas:** mostrar `animatic-A-v0.mp4` en un celular a 3–5 personas del público, primero sin sonido. Preguntar «¿qué hace esta app?», «¿cuánto cuesta publicar?» y «¿qué harías después de verlo?». Explicar antes que los recuadros son partes que todavía se van a filmar o capturar.
4. **Opcional:** grabar con el celular una voz guía leyendo `locucion/guion-locucion.txt` sobre el video, para comprobar el ritmo real.
5. **Con las capturas:** reemplazar los marcadores en la línea de tiempo, regenerar (animatic v1, `.srt`, locución, tabla) y aprobar. **Solo después** se generan fotogramas clave y clips con IA.
