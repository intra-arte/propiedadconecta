# Diagnóstico de recursos — 11 de octubre de 2026

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
| 01 · Concepto y voz en off | Terminado para **25 s**. Falta adaptarlo a ~22 s. |
| 02 · Guion técnico (8 escenas, sistema visual) | Terminado para 25 s. **E4, E5, E6 y E8 contienen supuestos** (sección 4). |
| 03 · Prompts IA | Terminado. **No se ejecutó ninguno** (es lo correcto en esta etapa). |
| 04 · IA vs edición y logo | Terminado. El logo sigue siendo raster. |
| 05 · Prueba A/B | Terminado para 25 s. |
| 06 · Montaje y control de calidad | Terminado. Supone que la app existe y se puede grabar. |
| Subtítulos `.srt` y guion de locución | Terminados para 25 s. Faltan los de 22 s. |
| Animatic | **No iniciado.** |
| Locución (guía o final), música | **No iniciado.** |
| Imágenes y clips IA | **No iniciado** (a propósito). |

## 4. Supuestos en los documentos que hay que reemplazar

No salen del brief. Son marcadores que se cambian por lo que muestren las capturas.

| Supuesto | Dónde | Qué falta saber |
|---|---|---|
| Rótulo «Sector» | 02 E4, voz L4 | El nombre real del campo de ubicación |
| «Departamento · Arriendo» como un mismo campo | 02 E4 | Si compra/arriendo es un campo y cómo se elige |
| Características como opciones («2 habitaciones», «Parqueadero»…) | 02 E4 | Si es texto libre, opciones o ambos |
| «Hasta $700 al mes» | 02 E4 | Si el presupuesto es un máximo o un rango |
| Botón «Publicar gratis» y pantalla «Búsqueda publicada» | 02 E4 | Botón y pantalla reales |
| Logo en la cabecera de la app | 02 E4 | Si existe |
| Tarjeta de la búsqueda vista por el agente, fila «Contacto» con candado, agente en laptop | 02 E5 | Cómo ve el agente la búsqueda y en qué dispositivo |
| El agente **llama** y ella contesta | 02 E6 | El canal real de contacto |
| «Ahora en Quito» y ejemplo «Cumbayá» | 02 E4 y E8 | La cobertura |
| El clic va directo al formulario; botón «Registrarte» | 05, 06 | El flujo real de registro |

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

1. **Tú:** enviar las capturas y respuestas marcadas con ★. Con eso se cierra el guion.
2. **Yo, en paralelo y sin créditos de IA:** ajustar el guion a 22 s (propuesta abajo) y armar un **animatic v0** de 1080 × 1920:
   - tarjetas con el texto de la locución y la descripción de cada plano;
   - los tiempos exactos de cada escena;
   - recuadros grises «captura pendiente» en E4–E6, con solo los cuatro datos del brief y sin rótulos inventados.
3. **Voz guía:** aquí no puedo generar voz. Puedes grabarla con el celular leyendo `locucion/guion-locucion.txt` y la sincronizo; si no, el animatic va sin audio, con el texto en pantalla.
4. **Validación:** mostrar el animatic a 3–5 personas del público y preguntar «¿qué hace esta app?» y «¿cuánto cuesta publicar?».
5. **Con las capturas:** reemplazar los recuadros, actualizar 02, 05, `.srt` y locución a 22 s, y aprobar el animatic v1. **Solo después** se generan fotogramas clave y clips.

### Propuesta de ajuste a 22 s

El concepto y el texto de la locución no cambian. Los 3 s salen de las pausas (−1,7 s) y del cierre (−1,3 s).

| Escena | 25 s (actual) | 22 s (propuesta) | Locución en 22 s |
|---|---|---|---|
| E1 Gancho | 0,0–2,2 | 0,0–2,2 | L1 0,1–2,1 |
| E2 Agitación | 2,2–4,8 | 2,2–4,7 | L2 2,3–4,6 |
| E3 Giro | 4,8–6,8 | 4,7–6,5 | L3 4,8–6,4 |
| E4 Así funciona | 6,8–12,0 | 6,5–11,3 | L4 6,7–10,8 |
| E5 Del otro lado | 12,0–14,9 | 11,3–13,9 | L5 11,4–13,8 |
| E6 Contacto | 14,9–17,8 | 13,9–16,4 | L6 14,0–16,3 |
| E7 Alivio + CTA | 17,8–20,1 | 16,4–18,4 | L7a 16,6–18,2 |
| E8 Cierre | 20,1–25,0 | 18,4–22,0 | L7b 18,5–19,8 |

- La voz termina en 19,8 s y deja 2,2 s de cierre sin voz.
- La línea más ajustada es L2 (6 sílabas por segundo). Si en la voz guía suena apurada, se usa «Deja de perseguir anuncios.».
- **E4–E6 pueden cambiar** con las capturas: si el formulario tiene más pasos o el contacto no es una llamada, se ajustan esas escenas, no el concepto.
