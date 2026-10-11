# Guion técnico — v1 de motion

Generado desde [src/linea-de-tiempo.js](src/linea-de-tiempo.js) con `node generar-textos.mjs`. **No editar a mano.**

**16,0 s** · 120 BPM (1 beat = 0,5 s, 32 beats = 8 compases) · 1080 × 1920 · 30 fps · tiempos en segundos según la cuadrícula **medida** (`beats.json`: 119,87 BPM, desfase -6,3 ms).
Zona segura para texto y logo: x 65–1015, y 270–1248 (la misma del v0).

**Pendiente:** nada.

A y B comparten todo desde el beat 6 (3,00 s). Solo cambia la apertura.

## Versión A — directa

| Escena | Beats | Inicio (s) | Fin (s) | Texto en pantalla | Qué pasa |
|---|---|---|---|---|---|
| A1 · Gancho · el muro | 0,00–4,00 | 0,00 | 2,00 | «Deja de perseguir anuncios.» | Un anuncio en primer plano recibe el sello «YA SE ARRENDÓ»; la cámara se aleja y revela un muro infinito de anuncios que se desplaza. Los sellos caen en cascada. El punto verde persigue anuncios saltando de tarjeta en tarjeta; cada una que toca queda sellada. |
| A2 · Giro · el muro se da la vuelta | 4,00–6,00 | 2,00 | 3,00 | «Publica lo que buscas.» | Todo se congela en el beat. Desde el punto, una onda voltea cada anuncio: sus reversos marfil se unen en una superficie limpia. «Publica lo que buscas.» sube desde su línea base y el punto cae como el punto de la «i». |
| C1 · Titular | 6,00–8,00 | 3,00 | 4,00 | «Publica lo que buscas.» | Titular sostenido. El punto se agacha con la «i» y salta; las palabras viajan a su posición de cabecera. |
| C2 · El punto se vuelve marco | 8,00–9,25 | 4,00 | 4,62 | — | El punto aterriza en el centro y se estira hasta convertirse en el marco donde irá el formulario real. El verde se abre y deja ver el espacio reservado. |
| P · Producto · el formulario real | 9,25–19,50 | 4,62 | 9,75 | «Tipo de propiedad Ubicación Presupuesto Características» | El marco se abre sobre el formulario real («Cuéntanos qué propiedad estás buscando · Es gratis publicar»). La cabecera rueda al ritmo de la voz y la cámara encuadra cada tarjeta mientras el resto se atenúa; cada una pasa de vacía a llena con las capturas reales. Al final la ventana se estrecha sobre el botón «Publicar solicitud». |
| K1 · Puente al cierre | 19,50–22,00 | 9,75 | 11,01 | — | El marco se recoge en el punto. El punto vuela en arco hasta la cabeza verde clara del isotipo. |
| K2 · Cierre · marca + CTA | 22,00–32,00 | 11,01 | 16,00 | «Publica gratis tu búsqueda» | El punto aterriza exactamente sobre la cabeza clara del logo original; el isotipo se revela desde ahí. Sube el botón con el CTA y después el nombre. Fondo marfil del logo. Se sostiene 3 s completo. |

## Versión B — curiosidad

| Escena | Beats | Inicio (s) | Fin (s) | Texto en pantalla | Qué pasa |
|---|---|---|---|---|---|
| B1 · Gancho · el anuncio es tuyo | 0,00–4,00 | 0,00 | 2,00 | «Esta vez, el anuncio lo pones tú.» | El mismo muro y el mismo movimiento de cámara. Mientras la voz dice «el anuncio lo pones…», el punto cae sobre el anuncio central, que se voltea: ya no dice «SE ARRIENDA», dice «BUSCO». «Tú» cae cuando el muro se da la vuelta. |
| B2 · Giro · el muro se da la vuelta | 4,00–6,00 | 2,00 | 3,00 | «Publica lo que buscas.» | La onda sale del anuncio «BUSCO» y voltea todo el muro. «Publica lo que buscas.» sube y el punto cae como el punto de la «i». |
| C1 · Titular | 6,00–8,00 | 3,00 | 4,00 | «Publica lo que buscas.» | Titular sostenido. El punto se agacha con la «i» y salta; las palabras viajan a su posición de cabecera. |
| C2 · El punto se vuelve marco | 8,00–9,25 | 4,00 | 4,62 | — | El punto aterriza en el centro y se estira hasta convertirse en el marco donde irá el formulario real. El verde se abre y deja ver el espacio reservado. |
| P · Producto · el formulario real | 9,25–19,50 | 4,62 | 9,75 | «Tipo de propiedad Ubicación Presupuesto Características» | El marco se abre sobre el formulario real («Cuéntanos qué propiedad estás buscando · Es gratis publicar»). La cabecera rueda al ritmo de la voz y la cámara encuadra cada tarjeta mientras el resto se atenúa; cada una pasa de vacía a llena con las capturas reales. Al final la ventana se estrecha sobre el botón «Publicar solicitud». |
| K1 · Puente al cierre | 19,50–22,00 | 9,75 | 11,01 | — | El marco se recoge en el punto. El punto vuela en arco hasta la cabeza verde clara del isotipo. |
| K2 · Cierre · marca + CTA | 22,00–32,00 | 11,01 | 16,00 | «Publica gratis tu búsqueda» | El punto aterriza exactamente sobre la cabeza clara del logo original; el isotipo se revela desde ahí. Sube el botón con el CTA y después el nombre. Fondo marfil del logo. Se sostiene 3 s completo. |

## Eventos de imagen y sonido (beat → segundo)

| Evento | Beat | Segundo | Imagen | Sonido |
|---|---|---|---|---|
| Primer sello | 0,00 | 0,00 | «YA SE ARRENDÓ» cae sobre el anuncio en el primer fotograma | golpe de sello + grave |
| Sellos en cascada | 1 · 1,5 · 2,00 · 2,250 · 2,7500 · 3,25000 · 3,750000 | — | otros anuncios quedan sellados | sellos más livianos, abiertos en estéreo |
| A: el punto persigue | 3 · 3,0 · 3,50 | — | cada anuncio que toca el punto queda «NO DISPONIBLE» | marimba fa#–la–si + sello |
| B: el punto cae | 3,00 | 1,50 | la tarjeta se voltea a «BUSCO» y se despega del muro | marimba si + latigazo de volteo |
| Congela | 4,00 | 2,00 | todo se detiene | freno de cinta, silencio |
| Onda | 4,15 | 2,07 | los anuncios se voltean desde el punto; el fondo pasa a marfil | cascada de clics de papel |
| Titular | 5,00 | 2,50 | «Publica lo que buscas.» sube | acorde re mayor (piano FM) + bombo suave |
| Tilde | 5,50 | 2,75 | el punto cae como punto de la «i»; onda de peso en la palabra | marimba re (la voz del punto) |
| Salto | 7,50 | 3,75 | el punto deja la «i»; las palabras van a la cabecera | marimba la |
| Marco | 8,00 | 4,00 | el punto se estira hasta ser el marco | grave + barrido |
| Abre | 8,60 | 4,30 | el verde se abre: espacio reservado del formulario | arpegio re–fa#–la–re |
| Rótulos | 10 · 12,0 · 14,00 · 16,000 | — | la cabecera rueda: tipo · ubicación · presupuesto · características | marimba re–fa#–la–si |
| Recoge | 19,75 | 9,88 | el marco se recoge en el punto | platillo invertido + barrido |
| Vuelo | 20,25–22,00 | — | el punto vuela hasta la cabeza clara del isotipo | barrido + subida |
| Isotipo | 22,00 | 11,01 | aterriza; el isotipo original se revela desde la cabeza | firma sonora: re + acorde re mayor 9 |
| CTA | 22,50 | 11,26 | sube el botón | firma sonora: la |
| Nombre | 25,25 | 12,63 | el logo se acomoda y sube el nombre | firma sonora: fa# + campana |
| Empujes | 28 · 30,0 | — | la flecha del botón empuja | clic suave |

## Locución A

Tiempos reales de cada frase en la mezcla (`locucion/colocacion.json`). «Imagen» es el segundo nominal del evento al que se ancla la frase (la cuadrícula medida difiere en menos de 10 ms). Ritmo: «natural» ≤ 5,8 sílabas/s · «ágil» ≤ 6,3.

| Línea | Frase | Inicio (s) | Fin (s) | Ancla | Imagen (s) | Síl./s |
|---|---|---|---|---|---|---|
| L1 | Deja de perseguir anuncios. | 0,10 | 1,90 | 0,10 s | — | 5,0 |
| L2 | Publica lo que buscas. | 2,69 | 3,98 | tilde (beat 5,50) −0,06 s | 2,75 | 5,4 |
| L3 | Tipo de propiedad, | 4,82 | 5,97 | rotulos[0] (beat 10,00) −0,18 s | 5,00 | 5,2 |
| L3 | ubicación, | 6,09 | 7,05 | rotulos[1] (beat 12,00) +0,09 s | 6,00 | 4,1 |
| L3 | presupuesto… | 7,16 | 8,05 | rotulos[2] (beat 14,00) +0,16 s | 7,00 | 4,5 |
| L3 | y lo que no puede faltar. | 8,22 | 10,01 | rotulos[3] (beat 16,00) +0,22 s | 8,00 | 4,5 |
| L4 | Publica gratis tu búsqueda. | 11,40 | 13,12 | cta (beat 22,50) +0,15 s | 11,25 | 5,2 |
| L5 | En Propiedad Conecta. | 13,24 | 14,63 | 0,12 s después de la frase anterior | — | 5,0 |

La voz termina en 14,63 s: quedan 1,4 s de cierre sin voz con el logo y el CTA completos.

## Locución B

Tiempos reales de cada frase en la mezcla (`locucion/colocacion.json`). «Imagen» es el segundo nominal del evento al que se ancla la frase (la cuadrícula medida difiere en menos de 10 ms). Ritmo: «natural» ≤ 5,8 sílabas/s · «ágil» ≤ 6,3.

| Línea | Frase | Inicio (s) | Fin (s) | Ancla | Imagen (s) | Síl./s |
|---|---|---|---|---|---|---|
| LB1 | Esta vez, | 0,04 | 0,80 | 0,04 s | — | 3,9 |
| LB1 | el anuncio lo pones tú. | 0,90 | 2,54 | 0,10 s después de la frase anterior | — | 4,9 |
| L2 | Publica lo que buscas. | 2,69 | 3,98 | tilde (beat 5,50) −0,06 s | 2,75 | 5,4 |
| L3 | Tipo de propiedad, | 4,82 | 5,97 | rotulos[0] (beat 10,00) −0,18 s | 5,00 | 5,2 |
| L3 | ubicación, | 6,09 | 7,05 | rotulos[1] (beat 12,00) +0,09 s | 6,00 | 4,1 |
| L3 | presupuesto… | 7,16 | 8,05 | rotulos[2] (beat 14,00) +0,16 s | 7,00 | 4,5 |
| L3 | y lo que no puede faltar. | 8,22 | 10,01 | rotulos[3] (beat 16,00) +0,22 s | 8,00 | 4,5 |
| L4 | Publica gratis tu búsqueda. | 11,40 | 13,12 | cta (beat 22,50) +0,15 s | 11,25 | 5,2 |
| L5 | En Propiedad Conecta. | 13,24 | 14,63 | 0,12 s después de la frase anterior | — | 5,0 |

La voz termina en 14,63 s: quedan 1,4 s de cierre sin voz con el logo y el CTA completos.

Toda la locución aparece también como texto en pantalla (titulares, cabecera o botón). Los subtítulos `.srt` son para la plataforma; no se queman.
