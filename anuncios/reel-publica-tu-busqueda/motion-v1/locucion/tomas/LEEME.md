# Tomas de voz

Archivos entregados por el cliente el 11/10/2026. Solo se les cambió el nombre para que empiecen por su línea; el contenido está **sin editar**. Los cortes, el nivel y la colocación los hace `node voz.mjs`, sin tocar estos archivos.

Todas son MP3 de 128 kbps, 44,1 kHz y mono.

| Archivo | Línea | Duración del archivo | Voz | SHA-256 (primeros 16) |
|---|---|---|---|---|
| `L1-deja-de-perseguir-anuncios.mp3` | L1 (A) «Deja de perseguir anuncios.» | 2,04 s | 1,80 s | `1019bd2e3b9da01c` |
| `LB1-esta-vez-el-anuncio-lo-pones-tu.mp3` | LB1 (B) «Esta vez, el anuncio lo pones tú.» | 2,93 s | 2,54 s | `6f87b16080d4efe1` |
| `L3-tipo-de-propiedad-ubicacion-presupuesto-y-lo-que-no-puede-faltar.mp3` | L3 «Tipo de propiedad, ubicación, presupuesto… y lo que no puede faltar.» | 5,64 s | 5,40 s | `b63b9322d3b1a953` |
| `L4-publica-gratis-tu-busqueda.mp3` | L4 «Publica gratis tu búsqueda.» | 2,19 s | 1,72 s | `a539395e2b26e2a1` |
| `L5-en-propiedad-conecta.mp3` | L5 «En Propiedad Conecta.» | 1,65 s | 1,40 s | `01c091379e295d3f` |
| — | **L2 «Publica lo que buscas.»: falta** | | | |

**Falta L2.** Cuando llegue, va aquí como `L2-publica-lo-que-buscas.mp3` y en `src/linea-de-tiempo.js` se cambia `toma: null` por ese nombre. Después se corre la secuencia del [README](../../README.md). La música ya deja su hueco: no cambia nada más.

**Texto:** este entorno no tiene reconocimiento de voz. Que cada archivo diga su texto se comprobó por el nombre, por la duración y por la posición de las pausas, no por transcripción. En L3 las tres pausas caen donde el guion pone una coma o los puntos suspensivos, y en esos cortes se separan las frases. Conviene escuchar la mezcla final para confirmarlo.
