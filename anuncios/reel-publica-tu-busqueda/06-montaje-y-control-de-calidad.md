# 8 · Flujo de producción, montaje y control de calidad

## Flujo de producción (orden más eficiente)

| Fase | Qué se hace | Se aprueba antes de seguir |
|---|---|---|
| **0 · Confirmaciones** | Resolver los pendientes de producto del [README](README.md#pendientes-de-confirmar-con-producto). Bloquean E4, E5 y E8. | Rótulos de la UI, cobertura, terminología. |
| **1 · Animatic** | Voz temporal (TTS) + imágenes de referencia o bocetos + música temporal + **textos finales**, montados a los tiempos de [02](02-guion-tecnico.md). | Duración exacta de 25,0 s; cada texto se alcanza a leer; la historia se entiende sin sonido. |
| **1b · Prueba rápida** | Mostrar el animatic en un celular a 3–5 personas del público, en Quito. Preguntar: «¿Qué hace esta app?» y «¿Cuánto cuesta publicar?». | Si no lo responden, se corrige el guion, no el montaje. |
| **2 · Imágenes** | REF-01…05 → KF01…06 (y KF07–08 para B). | Misma persona y misma paleta en todos los KF. |
| **3 · Video IA** | Animar cada KF, 3–4 tomas por clip; elegir y escalar a 1080 × 1920. | Criterios de [03](03-prompts-ia.md#criterios-para-elegir-cada-toma). |
| **3b · UI (en paralelo)** | Grabar la app real a 1080 × 1920, o replicarla fielmente en Figma y animarla. Diseñar tarjetas, burbujas, carteles y botones. | Coincidencia 1:1 con la app. |
| **4 · Locución final** | Grabar sobre el animatic aprobado. | Cada línea dentro de su ventana. |
| **5 · Montaje** | Montaje, color, gráficos, subtítulos, mezcla. | Lista de control (abajo). |
| **6 · Entrega** | Exportar A y B → control de calidad → subir. | — |

**Por qué este orden:** el timing se fija antes de gastar créditos de IA. Generar imagen → video desde fotogramas aprobados da control de personaje y encuadre; el texto → video directo da resultados inconsistentes entre escenas. Y como A y B comparten 18,2 s, la versión B solo cuesta 2 clips más.

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
2. **Música.** Editarla para que el beat entre en 4,8 s y resuelva en ~23,5 s. Recortar compases, no estirar el audio.
3. **Clips.** Montar cada escena con los tiempos de [02](02-guion-tecnico.md). Cuando el cambio de escena lo permita, cortar en el beat (±2 frames).
4. **Color.** Primero la corrección base clip por clip (exposición, balance, piel); después un look común con dos variantes: noche (E1–E2) y día (E3–E7).
5. **Gráficos.** Crear los componentes una sola vez (tarjeta, chip, botón, burbuja, titular, subtítulo) y reutilizarlos. Animaciones de 6–10 frames con salida suave; nada rebota más de una vez.
6. **UI de E4.** Sincronizar cada campo con la palabra que lo nombra (±3 frames).
7. **Subtítulos.** Importar `subtitulos/version-a.srt`, aplicar el estilo y **dejar solo los bloques 10–13**. El resto ya aparece como titular, burbuja, UI o logo (en B, bloques 2–3 y 9–12). Los SRT completos sirven de referencia de tiempos.
8. **Cierre.** Logo desde `marca/`, escala uniforme, en V7.
9. **Mezcla.** Música entre 18 y 20 dB por debajo de la voz mientras hay voz. SFX sutiles, nunca encima de una palabra. Final: −14 LUFS integrados, pico real ≤ −1 dBTP.
10. **Versión B.** Duplicar la secuencia, reemplazar solo 0–6,8 s (B1, B2 y E3 con LB3) y no tocar nada después de 6,8 s.

### Exportación

- MP4 (H.264 High), 1080 × 1920, cadencia constante igual a la secuencia, VBR de 2 pasadas a 16–20 Mbps, audio AAC-LC 48 kHz 320 kbps estéreo, Rec.709, **duración exacta 25,0 s**.
- Nombres: `PC_Reel_PublicaBusqueda_A-Dolor_9x16_25s_v01.mp4` y `PC_Reel_PublicaBusqueda_B-Inversion_9x16_25s_v01.mp4`.
- Los subtítulos van quemados en el video. **No subir los `.srt` a Meta**: se duplicarían en pantalla.

---

## Lista de control antes de publicar

### Mensaje y afirmaciones

- [ ] Sin testimonios, clientes reales, cifras de éxito ni resultados garantizados.
- [ ] Se mantienen «pueden» y «si tienen algo para ti». No hay frases como «te contactarán», «recibirás ofertas» ni «cientos de agentes».
- [ ] Solo aparecen un agente y una llamada.
- [ ] La UI es la real (rótulos, botón, flujo). No aparecen funciones sin confirmar: notificaciones, chat, verificación, coincidencias.
- [ ] El candado de E5 aparece solo si existe en la app real.
- [ ] Publicar es gratis para quien busca en el momento de lanzar el anuncio.
- [ ] «Ahora en Quito» está confirmado, o se eliminó.
- [ ] «Búsqueda» es la palabra que usan el anuncio, la landing y la app.

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
- [ ] El beat entra en el giro (4,8 s).

### Técnico

- [ ] 1080 × 1920, 25,0 s, cadencia constante, sin frames negros ni saltos.
- [ ] A y B son idénticos desde 6,8 s.
- [ ] Revisado en iPhone y Android, en Reels y Stories (vista previa de Ads Manager).

### Meta y conversión

- [ ] Revisar en Ads Manager si la campaña debe declararse en la categoría especial de **Vivienda**. Meta la exige en varios países y ha ido ampliando su alcance; si aplica, la segmentación por edad, género y ubicación queda limitada.
- [ ] El botón lleva directo al formulario para publicar la búsqueda, no a la home, y el primer texto de la página repite la promesa del anuncio.
- [ ] El evento de conversión se dispara al publicar la búsqueda, y está probado.
- [ ] Las mejoras creativas automáticas están revisadas o desactivadas, al menos durante la prueba A/B.
- [ ] Revisada la política vigente de Meta sobre etiquetado de contenido generado con IA.
