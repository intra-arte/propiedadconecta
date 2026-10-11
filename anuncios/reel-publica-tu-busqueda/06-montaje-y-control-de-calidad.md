# 8 · Flujo de producción, montaje y control de calidad

## Flujo de producción (orden más eficiente)

| Fase | Qué se hace | Se aprueba antes de seguir |
|---|---|---|
| **0 · Confirmaciones** | Responder las preguntas de [07-verificacion-de-producto.md](07-verificacion-de-producto.md). Las preguntas 1, 2, 5 y 6 bloquean la versión final. | Agentes activos, límite de agentes, registro, gratuidad. |
| **1 · Animatic** | **v0 congelado** en `animatic/v0/` (22,0 s, con marcadores). **v1 hecho** en `animatic/v1/` (23,5 s, con las capturas reales del formulario, A y B). Falta la voz guía, que se agrega con `animatic/mezclar-audio.sh`. Se regenera con `node animatic/generar.mjs`. | La historia se entiende sin sonido; cada texto se alcanza a leer; ninguna frase promete más de lo confirmado. |
| **1b · Prueba rápida** | Mostrar el animatic en un celular a 3–5 personas del público, en Quito. Preguntar: «¿Qué hace esta app?», «¿Cuánto cuesta publicar?», «¿Qué pasa con tu teléfono al publicar?» y «¿Te van a contactar seguro?». | Si no lo responden, o si entienden una garantía, se corrige el guion, no el montaje. |
| **2 · Imágenes** | REF-01, 03 y 05 → KF01, 02, 03 y 06 (y KF07–08 para B). La v1 ya no usa a Andrés ni C04/C05. | Misma persona y misma paleta en todos los KF. |
| **3 · Video IA** | Animar cada KF, 3–4 tomas por clip; elegir y escalar a 1080 × 1920. | Criterios de [03](03-prompts-ia.md#criterios-para-elegir-cada-toma). |
| **3b · UI (en paralelo)** | Capturas finales del formulario: del sitio publicado, en alta resolución, idealmente en el celular. Se recortan con `animatic/capturas/preparar.py` (ajustando las coordenadas) y se animan igual que en la v1. | Coincidencia 1:1 con la app; datos ficticios. |
| **4 · Locución final** | Grabar sobre el animatic aprobado. | Cada línea dentro de su ventana. |
| **5 · Montaje** | Montaje, color, gráficos, subtítulos, mezcla. | Lista de control (abajo). |
| **6 · Entrega** | Exportar A y B → control de calidad → subir. | — |

**Por qué este orden:** el timing se fija antes de gastar créditos de IA. Generar imagen → video desde fotogramas aprobados da control de personaje y encuadre; el texto → video directo da resultados inconsistentes entre escenas. Y como A y B comparten 18,8 s, la versión B solo cuesta 2 clips más.

---

## Montaje

### Configuración

- Secuencia 1080 × 1920 a la cadencia nativa de los clips IA: normalmente 24 fps; si salen a 30, usar 30. No mezclar cadencias sin convertir.
- Espacio de color Rec.709.
- Capa guía con las zonas seguras (270 px arriba, 672 px abajo, 65 px a los lados), desactivada al exportar.

### Pistas

| Pista | Contenido |
|---|---|
| V1 | Clips IA |
| V2 | Capa de ajuste de color (afecta solo a V1) |
| V3 | Gráficos de escena: tarjetas UI, burbujas, carteles, anuncios en loop |
| V4 | Titulares |
| V5 | Subtítulos |
| V6 | Barridos chevrón |
| V7 | Cierre y logo, por encima de todo y sin ajustes de color |
| A1 · A2 · A3 · A4 | Locución · SFX · ambientes · música |

### Paso a paso

1. **Locución primero.** Colocar la voz final y poner un marcador al inicio de cada línea (L1–L7; LB1–LB3 en B). Todo se cuadra contra la voz.
2. **Música.** Editarla para que el beat entre en 4,7 s y resuelva en ~22,0 s (ver la hoja de audio de la [tabla de tiempos](animatic/tabla-de-tiempos.md)). Recortar compases, no estirar el audio.
3. **Clips.** Montar cada escena con los tiempos de [02](02-guion-tecnico.md). Cuando el cambio de escena lo permita, cortar en el beat (±2 frames).
4. **Color.** Primero la corrección base clip por clip (exposición, balance, piel); después un look común con dos variantes: noche (E1–E2) y día (E3–E7).
5. **Gráficos.** Crear los componentes una sola vez (tarjeta, chip, botón, burbuja, titular, subtítulo) y reutilizarlos. Animaciones de 6–10 frames con salida suave; nada rebota más de una vez.
6. **UI de E4.** Sincronizar cada campo con la palabra que lo nombra (±3 frames).
7. **Subtítulos.** Importar `subtitulos/version-a.srt`, aplicar el estilo y **dejar solo los bloques que indica la [tabla de tiempos](animatic/tabla-de-tiempos.md)** (L5 y L6; en B, también LB2). El resto ya aparece como titular, burbuja, captura o logo. Los SRT completos sirven de referencia de tiempos.
8. **Cierre.** Logo desde `marca/`, escala uniforme, en V7.
9. **Mezcla.** Música entre 18 y 20 dB por debajo de la voz mientras hay voz. SFX sutiles, nunca encima de una palabra. Final: −14 LUFS integrados, pico real ≤ −1 dBTP.
10. **Versión B.** Duplicar la secuencia, reemplazar solo 0–4,7 s (B1 y B2) y no tocar nada después de 4,7 s.

### Exportación

- MP4 (H.264 High), 1080 × 1920, cadencia constante igual a la secuencia, VBR de 2 pasadas a 16–20 Mbps, audio AAC-LC 48 kHz 320 kbps estéreo, Rec.709, **duración exacta 23,5 s**.
- Nombres: `PC_Reel_PublicaBusqueda_A-Dolor_9x16_23s_v01.mp4` y `PC_Reel_PublicaBusqueda_B-Inversion_9x16_23s_v01.mp4`.
- Los subtítulos van quemados en el video. **No subir los `.srt` a Meta**: se duplicarían en pantalla.

---

## Recursos que faltan para el anuncio final

| Recurso | Estado | Quién / cómo |
|---|---|---|
| **Respuestas 1, 2, 5 y 6** de [07](07-verificacion-de-producto.md#depende-de-tu-respuesta): agentes activos, límite de agentes, registro, gratuidad | Pendiente | Tú |
| **Aprobación del animatic v1** (estructura y locución) | Pendiente | Tú, después de la prueba con 3–5 personas |
| **Capturas finales del formulario:** sitio publicado, alta resolución y versión móvil, sin indicador de desarrollo, con el rótulo «hasta X agentes» corregido y, si se decide, la fecha en dd/mm/aaaa | Pendiente | Equipo de producto; se recortan con `capturas/preparar.py` |
| Pantalla posterior a publicar y página de destino | Pendiente (no salen en el video) | Para la coherencia anuncio–destino |
| **Voz guía** para el animatic | Pendiente | Grabada con el celular leyendo `locucion/guion-locucion.txt`; se mezcla con `animatic/mezclar-audio.sh` |
| **Locución final** | Pendiente | Locutora quiteña o latinoamericana neutra (casting en [01](01-concepto-y-voz-en-off.md#casting-y-grabación)) |
| **Música** con licencia para pauta | Pendiente | Librería comercial o Sound Collection de Meta; estructura en la hoja de audio |
| **Efectos de sonido** | Pendiente | Librería; lista con tiempos en la hoja de audio |
| **Clips IA:** C01, C02, C03, C06 (y C07, C08 para B) | Pendiente, a propósito | Solo después de aprobar la v1 ([03](03-prompts-ia.md)) |
| Toma real de Quito (alternativa a C06) | Opcional | Stock con licencia, si la ciudad generada no convence |
| Logo vectorial (SVG/PDF) | Pendiente | Diseñador; los PNG actuales sirven mientras tanto |
| Dominio o URL para el cierre | Opcional | Tú |

---

## Lista de control antes de publicar

### Mensaje y afirmaciones

- [ ] Sin testimonios, clientes reales, cifras de éxito ni resultados garantizados.
- [ ] El agente aparece solo en condicional («Si un agente tiene algo para ti, puede contactarte»). No hay frases como «te contactarán», «recibirás ofertas», «hay agentes esperando» ni «cientos de agentes».
- [ ] No aparecen agentes, notificaciones, llamadas, mensajes ni conversaciones.
- [ ] La UI es la real (rótulos, botón, flujo). No aparecen funciones sin confirmar: notificaciones, chat, verificación, coincidencias.
- [ ] E4 y E5 muestran solo recortes de capturas reales del sitio publicado: sin campos agregados, sin indicador de desarrollo, sin la «X» del rótulo y con datos ficticios.
- [ ] Si el límite de 1, 3 o 5 agentes no se aplica, se quitaron la voz L6 y la lupa.
- [ ] Publicar es gratis para quien busca en el momento de lanzar el anuncio.
- [ ] Si se agrega «Ahora en Quito» o una URL al cierre, están confirmados.
- [ ] Se decidió si se unifica «búsqueda» (anuncio) con «solicitud» (botón de la app).

### Gancho y comprensión

- [ ] El frame 0 ya muestra a la persona (o el cartel) y el titular, sin fundido desde negro.
- [ ] Con el audio apagado se entiende la historia completa.
- [ ] Visto en un celular a velocidad normal, se entiende qué hace la app antes del segundo 12.

### Legibilidad

- [ ] Todo texto está dentro de las zonas seguras, verificado con la plantilla de Meta en Reels y en Stories.
- [ ] Cada bloque de texto dura ≥ 0,8 s y cada titular ≥ 1,5 s.
- [ ] Ortografía revisada: tildes y signos de apertura (¿ ¡), «búsqueda», «arrendó», «Cumbayá».
- [ ] Todo texto sobre video tiene caja o contraste suficiente.
- [ ] Toda la locución aparece en pantalla de alguna forma, y ninguna línea aparece dos veces.

### Marca

- [ ] Logo desde `marca/`, escala idéntica en ambos ejes, sin rotación ni efectos, ≤ 100 % de su tamaño de archivo.
- [ ] Logo solo sobre blanco o marfil, con su margen de protección.
- [ ] El logo está por encima de la capa de color: el grading no lo alteró.
- [ ] Los colores de los gráficos coinciden con los HEX de la paleta.
- [ ] El logo no fue generado ni retocado con IA.

### Calidad de la IA

- [ ] Manos con cinco dedos y agarre natural del celular.
- [ ] Daniela y Andrés se ven como la misma persona en todas sus escenas.
- [ ] Sin morphing, objetos que aparecen o desaparecen, ni deformaciones en los últimos frames.
- [ ] Sin texto ilegible, logos de marcas (manzana en la laptop, marcas de celular) ni carteles generados.
- [ ] Quito se ve como Quito (arquitectura, montañas, luz), revisado por alguien de la ciudad.
- [ ] Ninguna persona generada se parece a alguien real o conocido.

### Audio

- [ ] La voz se entiende con el celular a volumen bajo.
- [ ] −14 LUFS integrados, pico ≤ −1 dBTP, sin saturación.
- [ ] Música y SFX con licencia para publicidad pagada; ningún sonido de otras marcas (WhatsApp, iPhone).
- [ ] El beat entra en el giro (4,7 s).

### Técnico

- [ ] 1080 × 1920, 23,5 s, cadencia constante, sin frames negros ni saltos.
- [ ] A y B son idénticos desde 4,7 s.
- [ ] Revisado en iPhone y Android, en Reels y Stories (vista previa de Ads Manager).

### Meta y conversión

- [ ] Revisar en Ads Manager si la campaña debe declararse en la categoría especial de **Vivienda**. Meta la exige en varios países y ha ido ampliando su alcance; si aplica, la segmentación por edad, género y ubicación queda limitada.
- [ ] El botón lleva directo al formulario para publicar la búsqueda, no a la home, y el primer texto de la página repite la promesa del anuncio.
- [ ] El evento de conversión se dispara al publicar la búsqueda, y está probado.
- [ ] Las mejoras creativas automáticas están revisadas o desactivadas, al menos durante la prueba A/B.
- [ ] Revisada la política vigente de Meta sobre etiquetado de contenido generado con IA.
