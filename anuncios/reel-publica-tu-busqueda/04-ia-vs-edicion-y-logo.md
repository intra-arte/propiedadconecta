# 5 · Qué se genera con IA y qué se hace en edición · 6 · Logo

## 5 · IA vs edición

**Regla general:** la IA hace personas y lugares. Todo lo que se lee, todo lo que representa al producto y todo lo que es marca se hace en edición.

| Elemento | Cómo se hace | Por qué |
|---|---|---|
| Personas (Daniela, Andrés) | **IA:** referencia → fotograma clave → video | Es lo más caro de rodar; con referencias se mantiene la consistencia. |
| Ambientes (departamento, coworking, terraza, calle, fachada) | **IA**, dentro de los mismos clips | Control total de paleta y luz. |
| Vista de Quito (E7) | **IA, revisada por alguien de Quito.** Si no convence, stock real con licencia. | Un quiteño detecta al instante una ciudad «falsa», y eso resta confianza. |
| Fotos de anuncios genéricos (E2) | IA (imagen fija) o stock | Se ven pequeñas y desenfocadas; no deben pertenecer a nadie. |
| Interfaz de la app (E4, E5) | **Edición:** grabación real o réplica fiel en Figma / After Effects | La IA deforma el texto y podría inventar funciones. La UI debe ser la real. |
| Burbujas de chat (E1) | Edición | Texto exacto y legible, sin imitar ninguna app real. |
| Carteles «SE ARRIENDA» / «BUSCO» (B1) | Edición, con tracking sobre el cartel en blanco | La IA no escribe texto confiable. |
| Titulares, subtítulos, botón CTA | Edición | Control de tipografía, tiempos y zonas seguras. |
| Logo | Edición, con el archivo original | La IA lo deformaría. |
| Barridos chevrón y animaciones de UI | Edición | Elemento de marca, preciso al frame. |
| Vibración del celular (E6) | Luz y gesto del clip + SFX + micro-sacudida en edición | La IA no la resuelve de forma convincente. |
| Locución | Locutora humana (recomendado) o voz IA revisada | Acento quiteño natural y buena entonación de las preguntas. |
| Música y SFX | Librería con licencia comercial | Derechos para pauta pagada. |
| Color | Edición | Unifica clips generados por separado. |

---

## 6 · Cómo incorporar el logo sin deformarlo

### Archivos preparados (`marca/`)

| Archivo | Qué es | Cuándo usarlo |
|---|---|---|
| `logo-original.webp` | El archivo recibido, sin tocar (1536 × 1024) | Referencia oficial. No va directo al video. |
| `logo-horizontal-fondo-marfil.png` | Recorte del original con margen de protección; píxeles intactos (1208 × 431) | Cierre, si el fondo es exactamente marfil `#FAF9F5`. |
| `logo-horizontal-transparente.png` | El mismo recorte con fondo transparente y bordes suavizados | Cierre sobre blanco o marfil (opción recomendada). |
| `isotipo-transparente.png` | Solo el símbolo (465 × 431) | Usos pequeños sobre fondo claro, si hicieran falta. |

El margen incluido (72 px) equivale al diámetro de un círculo-persona del isotipo. La versión transparente se revisó sobre blanco, marfil y gris: sin halos visibles.

> **Importante:** el interior de la casa del isotipo es fondo, no blanco. En la versión transparente, sobre cualquier fondo que no sea claro, la casa se «llena» con el color de detrás. Otra razón para usar el logo solo sobre blanco o marfil.

### Reglas

1. **Nunca pasar el logo por la IA**, ni como referencia ni en un prompt: los modelos lo redibujan y lo deforman. Entra solo en edición, como archivo.
2. **Escala uniforme**, con la proporción bloqueada. Comprobar en propiedades que la escala horizontal y la vertical sean idénticas.
3. **No escalar por encima del 100 %** del archivo: el original es una imagen comprimida, no un vector. En el cierre el archivo se usa a 800 px de ancho (66 % de su tamaño; el dibujo del logo mide ~705 px) y se ve nítido. El informe del animatic (`animatic/v0/informe-qa.md`) verifica que la escala sea uniforme y mide la proporción en el video exportado.
4. **Solo sobre blanco o marfil.** Nunca sobre video, marino ni verde: el texto `#142A22` desaparece y la casa toma el color del fondo.
5. **Sin efectos:** sin sombras, brillos, contornos, biseles ni recoloreos. El logo va en una capa por encima del ajuste de color, para que el grading no lo altere.
6. **No animar sus partes** (círculos, techo, letras) mientras no exista el vector y la aprobación de marca. Animación permitida: fundido + escala uniforme 96 → 100 % en 12 frames, con salida suave.
7. Rotación 0°, sin recortes, sin cambiar el orden símbolo + texto.
8. **Revisión final:** exportar un frame del cierre y verlo al 100 %. Bordes sin halo y verdes iguales a la paleta (comparar HEX).

### Dónde aparece la marca

- **E4:** solo si la cabecera de la app real muestra el logo; se ve como parte de la interfaz, no se agrega encima.
- **E8:** logo horizontal + voz «en Propiedad Conecta» en el mismo instante. Decir el nombre mientras aparece el logo refuerza el recuerdo de marca.
- No se usa marca de agua durante el video: Meta ya muestra el nombre y la foto de la página. La foto de perfil debería ser el isotipo sobre blanco.

### Recomendación

Pedir al diseñador el **logo vectorial** (SVG o PDF) y sus versiones oficiales: horizontal, isotipo y, si existe, una versión para fondo oscuro. Cuando lleguen, reemplazar los PNG 1:1. Solo con una versión en negativo aprobada se podría usar el logo sobre fondos oscuros.
