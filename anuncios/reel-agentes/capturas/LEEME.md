# Capturas de lo que ve el agente

Capturas reales de producto, entregadas el 12/10/2026 en un PDF de Google Docs, que se guarda sin cambios en `originales/agentes-1440x900-12-10-2026.pdf`. Las imágenes se extrajeron con `pdfimages -png`, sin recomprimir. Son de 1440 × 900 y su perfil de color es sRGB.

La película no las usa enteras: muestra recortes, uno por paso, en el orden real del flujo (`pelicula.js`, constante `PANTALLAS`). No se retoca ni se dibuja nada encima.

| Archivo | Qué muestra | Recortes que usa el anuncio (px, x0 y0 x1 y1) |
|---|---|---|
| `agente-1-marketplace.png` | Marketplace de solicitudes: filtros y seis tarjetas | La primera tarjeta entera (160 331 523 611) y, dentro de ella, presupuesto y señales (170 432 512 532) |
| `agente-2-detalle.png` | Detalle de una solicitud, con el contacto oculto y el botón «Desbloquear contacto — 10 créditos» | El aviso de contacto oculto y el botón (400 715 1041 882); después, el botón solo (560 826 880 882) |
| `agente-3-confirmar.png` | El diálogo «Desbloquear esta solicitud» sobre el detalle | El diálogo solo (0 0 384 276) |
| `agente-4-lead.png` | Lead desbloqueado: contacto, acciones y «Protección del lead» | «Contactar por WhatsApp» y «Email» (398 334 684 378); la tarjeta «Protección del lead» (400 595 1041 773) |

## Lo que queda fuera de cuadro a propósito

- **Datos de demostración.** El nombre del agente («Carlos Vega») está en la cabecera. El nombre del interesado, su teléfono (0991234567) y un correo `@propiedadconecta.test` están en la pantalla del lead. Ningún recorte los incluye; entre el botón de WhatsApp y la protección la película corta, sin pasar la cámara por encima.
- **Indicadores de desarrollo.** La «N» de Next.js aparece en las cuatro capturas y «Compiling…» en la del lead.
- **El diálogo.** Aparece pegado a la esquina superior izquierda y cortado por el borde; parece un error de diseño de la app. El recorte muestra solo el diálogo.
- **Una tarjeta.** Dice «Departamento en quito», con minúscula; no se usa.

## Para tener en cuenta

- **Precios.** Las capturas muestran «10 créditos», que es lo que la app cobra hoy por un interesado en comprar. El cliente avisó que el sistema va a cambiar según el precio de lo que se busca. Cuando cambie, hay que volver a capturar el detalle y el diálogo.
- **Legibilidad.** A tamaño de teléfono se leen la tarjeta, el presupuesto, el botón ampliado, el diálogo y WhatsApp. El texto de «Protección del lead» queda chico, porque sus líneas son largas y no admiten más acercamiento: el mensaje lo llevan la cabecera y la voz.
