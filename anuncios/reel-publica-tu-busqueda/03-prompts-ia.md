# 4 · Prompts para generar cada clip con IA

## Cómo usar estos prompts

> **Todavía no se ejecutan.** Primero se aprueba el animatic v1 (`animatic/v1/`) y se responden las preguntas de [07-verificacion-de-producto.md](07-verificacion-de-producto.md).
>
> **Clips de la v1:** C01, C02, C03 y C06 (A), más C07 y C08 (B). C04 (agente) y C05 (suena el celular) **salieron de la v1**; se conservan abajo solo como referencia y no deben generarse. REF-02 y REF-04 tampoco hacen falta.

El flujo es **imagen → video**, no texto → video directo. Así se controla el personaje, el encuadre y la luz antes de gastar créditos de video.

1. **Referencias (REF):** generar las fichas de personaje y de locación como imágenes fijas. Aprobarlas.
2. **Fotogramas clave (KF):** generar el primer frame de cada clip usando las REF como referencia de personaje o de imagen. Aprobarlos lado a lado: misma persona, misma paleta.
3. **Video (C):** animar cada KF con su prompt de video (imagen a video), en 9:16, de 3 a 4 tomas por clip. Elegir con los criterios del final.

**Herramientas:** cualquier modelo de imagen que acepte referencia de personaje y cualquier modelo de imagen a video (por ejemplo Runway, Kling, Veo, Sora o Hailuo). **Usar el mismo modelo para todos los clips** para evitar saltos de look.

**Idioma:** los prompts están en inglés porque la mayoría de modelos sigue con más precisión las indicaciones de cámara y luz en inglés. Nada de lo que el público lee se genera con IA.

**Presupuesto estimado (v1):** 6 clips × 3–4 tomas ≈ 18–24 generaciones de video, más ~12 imágenes fijas.

---

## Bloques comunes

Pegar **al final de cada prompt** el bloque `[STYLE]` y, si la herramienta lo admite, el `[NEGATIVE]` en el campo de prompt negativo. Donde el prompt dice `[STYLE]`, sustituir por el bloque completo.

**[STYLE]**

```
Photorealistic premium TV commercial, shot on a digital cinema camera with prime lenses, shallow depth of field, natural skin texture with visible pores, realistic hands, restrained color palette of white, warm off-white, light oak wood, deep forest green, fresh leaf green and navy blue accents, clean and uncluttered modern spaces, soft natural contrast, subtle fine film grain, vertical 9:16 composition with the subject in the central third and clean space in the upper third, contemporary Quito, Ecuador. No text, no letters, no logos, no brand marks, no watermarks; phone and laptop screens are never visible to the camera.
```

**[NEGATIVE]**

```
text, letters, captions, subtitles, signage with words, logos, brand marks, apple logo, watermark, visible phone screen, visible laptop screen, extra fingers, fused fingers, deformed hands, warped face, plastic skin, airbrushed skin, oversaturated colors, HDR look, cartoon, illustration, 3D render, cheesy stock-photo smile, looking into the camera, talking to the camera, lip movement, fisheye, heavy camera shake, morphing objects, flickering, duplicated people, crowd
```

---

## Referencias (imágenes fijas)

### REF-01 · Daniela

Viste igual en todas las escenas: ayuda a que el modelo la mantenga consistente y se lee como un fin de semana.

```
Character reference sheet, photorealistic: the same 29-year-old Ecuadorian woman from Quito shown three times side by side (front view, three-quarter view, profile) on a plain light-grey studio background with soft even light. Mestiza, warm light-brown skin, dark brown eyes, shoulder-length straight dark-brown hair with soft natural waves, natural makeup, small gold stud earrings. Wardrobe: oversized cream cable-knit sweater over a white t-shirt, light-wash straight jeans, white sneakers. Expression: neutral and approachable. No text, no logos.
```

### REF-02 · Andrés

```
Character reference sheet, photorealistic: the same 40-year-old Ecuadorian man from Quito shown three times side by side (front view, three-quarter view, profile) on a plain light-grey studio background with soft even light. Mestizo, medium-brown skin, short neat black hair slightly greying at the temples, well-trimmed short beard, warm and professional look. Wardrobe: unstructured navy-blue blazer over a crisp white open-collar shirt, no tie, slim charcoal trousers, simple silver watch. Expression: attentive and friendly. No text, no logos.
```

### REF-03 · Departamento (día y noche)

```
Interior reference photo, vertical 9:16: small modern rented apartment in north Quito, Ecuador. Open living-dining area: beige fabric sofa with a navy-blue throw blanket, light oak dining table for two next to a large window, white walls, warm wooden parquet floor, two potted plants (monstera and a small olive tree), a minimal floor lamp. Through the window: neighbouring low-rise buildings and green Andean mountain slopes. Clean, tidy, lived-in. Soft morning daylight. [STYLE]
```

Variante de noche, con el mismo encuadre:

```
The same apartment and the same framing at night: only the warm floor lamp is on, scattered city lights on a dark hillside through the window, deep navy-blue shadows. [STYLE]
```

### REF-04 · Coworking

```
Interior reference photo, vertical 9:16: bright modern coworking office in north Quito, Ecuador. Light oak desks, white walls, green plants, a navy-blue accent chair, large windows with a soft out-of-focus view of the city and green mountain slopes. Calm late-morning daylight, uncluttered. [STYLE]
```

### REF-05 · Terraza

```
Location reference photo, vertical 9:16: rooftop terrace café in north Quito, Ecuador, with a glass railing, light wood tables, potted plants, and a wide view of the city and the green slopes of Pichincha volcano under a clear sky with light haze. Late-morning sun. [STYLE]
```

---

## Clips — Versión A

### C01 · E1 + E2 · Noche en el sofá

Se usa de 0,0 a 4,7 s. Generar 6–8 s si la herramienta lo permite. Si solo hace 5 s, usar una toma para E1 y otra para E2.

**KF01 (imagen):**

```
[Daniela from REF-01] half-reclined on the beige sofa of [REF-03 night], holding a smartphone in both hands at chest height, the screen facing her and not visible to the camera. The cool white glow of the phone lights her face from below; a warm dim floor lamp glows in the background; out-of-focus city lights through the window. Tired, slightly frustrated expression. Medium close-up, eye level, 50mm lens, f/2. Low-key cinematic lighting, shadows tinted toward navy blue, warm practical highlights. [STYLE]
```

**Video:**

```
She scrolls with her thumb, stops, reads for a moment, then lets out a tired sigh, lowers the phone to her chest and rests her head back on the sofa, eyes closing briefly. Natural micro-expressions and realistic breathing; slow, unhurried movements. Camera: very slow, smooth dolly-in toward her face, no shake. Lighting stays constant: phone glow on her face, warm lamp behind, city bokeh. [STYLE]
```

### C02 · E3 · La mañana siguiente

Se usa 1,7 s de 5 s.

**KF02:**

```
[Daniela, same wardrobe] the next morning in [REF-03 day], sitting at the light oak table next to the large window, a cup of coffee and her smartphone lying on the table, potted plants softly out of focus in the foreground. Calm, determined look. Medium shot, slightly below eye level, 35mm lens, f/2.8. High-key soft natural window light, 5600K, gentle shadows, clean whites, vivid green plants. [STYLE]
```

**Video:**

```
She picks up the phone from the table with a decisive gesture, a small confident smile appears, and she starts typing with both thumbs; the screen stays angled away from the camera. Camera: slow push-in with a gentle arc from left to right. Soft morning light, steady exposure. [STYLE]
```

### C03 · E4 · Fondo del formulario

Se usa 11,2 s, desenfocado detrás del formulario (E4 y E5). Generar 2 tomas de 6 s, o una de 10–12 s si la herramienta lo permite, para E5 con Daniela desenfocada revisando el celular.

**KF03:**

```
Over-the-shoulder close-up from behind [Daniela]'s right shoulder in [REF-03 day]: her hands holding a smartphone, thumbs typing; the screen is a soft, unreadable glow, completely out of focus. Background: bright window, green plants, creamy bokeh. 50mm lens, f/1.8. High-key, airy. [STYLE]
```

**Video:**

```
Her thumbs tap and scroll calmly on the phone; only subtle, natural hand movements. Camera: almost static, slow floating drift. Calm and bright throughout. [STYLE]
```

### C04 · E5 · El agente — fuera de la v1

No generar. Se conserva como referencia por si más adelante se muestra el lado del agente con capturas reales.

**KF04:**

```
[Andrés from REF-02] in [REF-04], seated at a light oak desk with an open laptop seen from the side and back (screen not visible, plain lid with no logo), a notebook, a coffee cup and his smartphone on the desk. Large window behind him with a soft out-of-focus view of the city and green mountains. Navy accent chair, green plants. Medium shot, three-quarter angle, 35mm lens, f/2.8. Soft daylight from the side window. [STYLE]
```

**Video:**

```
He reads something on the laptop, leans slightly forward with genuine interest, raises his eyebrows subtly, gives a small nod and reaches for his phone on the desk. Natural, understated acting. Camera: slow push-in. Steady daylight. [STYLE]
```

### C05 · E6 · Suena el celular — fuera de la v1

No generar. La v1 no muestra contactos, notificaciones ni llamadas.

**KF05:**

```
[Daniela, same wardrobe] sitting at a light wood table on [REF-05], relaxed, a cup of coffee in front of her and her smartphone lying on the table with the screen angled away from the camera. Behind her, a wide soft-focus view of the city and green mountain slopes under a clear sky. Medium shot, eye level, 50mm lens, f/2.2. Late-morning sun, soft warm backlight, light haze. [STYLE]
```

**Video:**

```
The phone on the table lights up and vibrates slightly; she looks down at it, picks it up, and reads the screen with a gentle, hopeful smile. Calm, natural reaction, not euphoric. Camera: static with very subtle stabilized handheld micro-movement. [STYLE]
```

### C06 · E6 · Alivio en la terraza

Se usa 2,4 s de 5 s. Daniela no espera ni recibe ningún contacto: deja el celular y disfruta la vista.

**KF06:**

```
Wide shot on [REF-05]: [Daniela, same wardrobe] stepping out onto the terrace with a cup of coffee in her hand, her phone left face-down on a table behind her, relaxed, with a slight smile and a light breeze in her hair. She occupies the lower-middle third of the vertical frame; behind her, a panoramic view of Quito and the green slopes of Pichincha volcano; clean clear sky in the upper third. 24mm lens, f/4. Late-morning sun, light haze, warm and green tones. [STYLE]
```

**Video:**

```
She walks slowly to the glass railing, sips her coffee and looks at the view, calm. Camera: slow pull-back with a slight crane-up revealing more of the city. Smooth and steady. [STYLE]
```

---

## Clips — Versión B (solo para la prueba A/B)

### C07 · B1 · Fachada con cartel en blanco

Se usa 2,4 s. El cartel «SE ARRIENDA» y su giro hacia la tarjeta real del formulario se componen en edición, con tracking planar sobre el cartel en blanco.

**KF07:**

```
Eye-level frontal shot of the ground-floor window of a modern five-story residential building in north Quito, Ecuador: white render and grey concrete, dark aluminium window frames, small glass balconies above, a planter with green shrubs by the entrance. Taped inside the glass, centered in the frame, a blank plain white rectangular cardboard sign with no text at all, about 40% of the frame width. Sunny morning, crisp clean shadows, quiet street. 35mm lens, f/5.6. [STYLE]
```

**Video:**

```
Locked-off tripod shot with a very slow push-in toward the sign. Gentle leaf shadows move slightly on the wall; nothing else moves. The sign stays perfectly flat, blank and in focus. [STYLE]
```

### C08 · B2 · Daniela en la calle

Se usa 2,3 s de 5 s.

**KF08:**

```
[Daniela, same wardrobe] walking on a sunny tree-lined residential street in north Quito: modern low-rise buildings in brick and white render, trees along the sidewalk, green mountain slopes in the background. She looks at her smartphone (screen not visible) with a thoughtful expression. Medium shot from the front, 35mm lens, f/2.8. Soft morning sun filtered through the trees. [STYLE]
```

**Video:**

```
She walks toward the camera looking at her phone, then slows down and looks up, thoughtful, as if an idea just occurred to her. Camera: smooth gimbal shot moving backwards in front of her at walking pace. [STYLE]
```

---

## Imágenes de anuncios genéricos (E2)

Seis imágenes fijas para las tarjetas que suben en loop. Se ven pequeñas y desenfocadas: solo tienen que parecer fotos de anuncio y no pertenecer a nadie. También sirve stock.

```
Typical real-estate listing photo, horizontal 4:3, of an empty modern apartment in Quito, Ecuador: {living room with parquet floor and a large window | small kitchen with white cabinets | bedroom with a built-in wardrobe | building exterior with balconies | small studio "suite" with kitchenette | living room at dusk}. Wide-angle 16mm, bright, slightly overexposed windows, straight verticals. No people, no text, no watermark, no logos.
```

---

## Criterios para elegir cada toma

- **Manos:** cinco dedos y un agarre natural del celular.
- **Rostro:** misma persona que en su REF (comparar lado a lado).
- **Sin morphing:** objetos que no aparecen ni desaparecen. Revisar los últimos 20 frames, donde suelen fallar, y cortar antes si hace falta.
- **Sin texto ni marcas:** ni manzana en la laptop, ni marcas de celular, ni carteles con letras.
- **Luz coherente** con su KF y con la escena vecina.
- **Movimiento lento:** mejor una toma tranquila que una espectacular; el ritmo lo da el montaje.

## Consejos

- Pedir **una o dos acciones por clip**. Las acciones encadenadas son las que más fallan.
- Mantener semilla, modelo y relación de aspecto entre tomas del mismo clip.
- Si la herramienta entrega 720p, escalar solo las tomas elegidas a 1080 × 1920 con un upscaler de video. La UI y el logo no se escalan: entran en su resolución nativa.
- Ninguna referencia ni prompt incluye el logo (ver [04-ia-vs-edicion-y-logo.md](04-ia-vs-edicion-y-logo.md)).
