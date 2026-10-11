# Concepto — «El punto»

**Propiedad Conecta · Reel vertical de 16 s · v1 de motion. Dirección aprobada y «gratis» confirmado el 11/10/2026. Voz integrada el mismo día, salvo la toma L2.**

## La idea en una frase

Un punto verde, la persona que busca, se pierde persiguiendo anuncios en un muro interminable. El muro se da la vuelta, el punto se vuelve el punto de la «i» de «Publica» y termina siendo la cabeza verde del isotipo. **Deja de perseguir anuncios: tú eres quien publica.**

## Por qué funciona como publicidad, no solo como animación

| Momento | Qué entiende la persona | Cómo lo cuenta el movimiento |
|---|---|---|
| 0,0 s | «Eso me pasó a mí.» | El primer fotograma ya es el dolor: un anuncio con el sello **YA SE ARRENDÓ**. No hay intro ni logo de entrada. |
| 0–2 s | Buscar entre anuncios es una persecución que se pierde. | La cámara se aleja y revela un muro infinito que se desplaza. El punto salta de anuncio en anuncio y cada uno que toca queda sellado. |
| 2–3 s | Hay otra forma. | Todo se congela en el beat. Desde el punto, una onda voltea cada anuncio y sus reversos en blanco forman una página limpia. Es la inversión del producto hecha imagen: ya no recorres anuncios, publicas el tuyo. |
| 2,5–4 s | «Publica lo que buscas.» | El titular sube desde su línea base y el punto cae como el punto de la «i». El verbo del producto lleva literalmente al protagonista. |
| 4–10 s | Cómo se hace. | El punto se estira hasta ser el marco que se abre sobre **el formulario real** («Cuéntanos qué propiedad estás buscando · Es gratis publicar»). La cabecera nombra cada sección al ritmo de la voz mientras la cámara la encuadra y la llena con las capturas reales. Al final la ventana se estrecha sobre **«Publicar solicitud»** y se recoge en el punto. |
| 10–16 s | Quién lo hace y qué hago ahora. | El marco se recoge en el punto, que vuela hasta la cabeza clara del isotipo original; la marca se revela desde ahí. El botón con el CTA queda 4,6 s en pantalla y el cierre completo se sostiene 3 s. |

El hilo es siempre el mismo objeto. Nunca hay un corte que obligue a reorientarse: cada transición es el punto haciendo algo. Eso es lo que hace que la marca se recuerde. Al final, el punto que vimos perseguir anuncios **es** el verde de Propiedad Conecta.

## Qué se tomó del showreel y qué cambió

| Se conserva | Cambia |
|---|---|
| El motor: cada fotograma es función del tiempo (`window.seek(t)`), desenfoque de movimiento real, cuadrícula de beats **medida** sobre el audio, control automático de sincronía | Formato vertical 1080 × 1920 con zonas seguras de Reels y Stories (las mismas del v0) |
| La tipografía cinética con interpolación continua del grosor por letra | La familia: **Outfit**, coherente con el nombre del logo. JetBrains Mono queda solo como textura de datos en los anuncios |
| El oficio: resortes, anticipación, aplastar y estirar, máscaras desde la línea base, el punto como tilde | La paleta: verdes muestreados del logo (#4C9F2D, #142A22) y marfil (#F9FAF5). Nada de bermellón |
| La disciplina de iterar con hojas de contactos y medir | El tono: sobrio y comercial. Cada movimiento cuenta algo de la propuesta |

## Gancho A y gancho B (prueba A/B)

| | A — Directa | B — Curiosidad |
|---|---|---|
| Texto (0–2 s) | «Deja de perseguir anuncios.» | «Esta vez, el anuncio lo pones tú.» |
| Imagen | El punto persigue y sella anuncios | El punto cae en un anuncio que se voltea: ya no dice «SE ARRIENDA», dice **«BUSCO»**, y se despega del muro |
| Desde 3,0 s | Idéntico | Idéntico |

Comparten el primer fotograma (el sello), el muro, la cámara, la duración, el CTA y todo desde el beat 6. Así la prueba mide el gancho y nada más. Hipótesis: A gana en reconocimiento del dolor; B, en curiosidad y en explicar la inversión.

## Sonido

En el primer acto, un pulso apagado en si menor y un sello que suena en cada anuncio perdido. En el giro, un freno de cinta, silencio y una cascada de clics de papel; luego abre a **re mayor**. El punto tiene voz propia, una marimba de vidrio, y firma la marca con el motivo **re–la–fa#** cuando aterriza, cuando sube el botón y cuando aparece el nombre.

**La voz va delante.** Cada frase se ancla a lo que pasa en pantalla: «Tipo de propiedad», «ubicación», «presupuesto» y «lo que no puede faltar» suenan cuando la cabecera nombra cada tarjeta, y el CTA cuando sube el texto del botón. La música baja bajo cada frase y la voz queda unos 10 dB por encima en todas.

## Restricciones respetadas

- **Sin interfaz simulada:** el producto se muestra solo con las cinco capturas reales; el paso de vacío a lleno es un barrido entre dos capturas reales de la misma pantalla. No hay toques, cursores ni pantallas inventadas.
- **Sin promesas:** no se afirma que haya agentes activos, contactos ni resultados.
- **«gratis»:** confirmado por producto. El formulario real también lo dice («Es gratis publicar»).
- **Logo original sin tocar:** solo traslaciones y máscaras, nunca escala no uniforme. Escala 76–77,5 % (≤ 100 %) y siempre sobre marfil.
- **v0 intacto:** esta versión vive en `motion-v1/`, en una rama local propia.

## Lo que falta

1. **La toma L2 de la voz** («Publica lo que buscas.»), con la misma voz de las demás. La música y la imagen ya le dejan el hueco, entre 2,69 y 4,10 s.
2. **Capturas en alta resolución:** las recibidas son de 800 × 500 y se ven blandas al ampliarlas. Se reemplazan sin tocar la animación (ver `capturas/LEEME.md`).
