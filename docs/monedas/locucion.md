# Locución · «Monedas al aire» (32 s)

Voz: la toma que generaste en ElevenLabs (`toma-c.mp3`, la que se usa). Antes: **Gael** (español latino neutro, publicidad, `eleven_v4`) en `toma-a.mp3` y `toma-b.mp3`.
Tono: cercano y seguro, sin gritar. La voz acompaña a los titulares: dice lo mismo que se lee, o lo une, y nunca dice más de lo que se ve.

Cada línea entra en el momento en que aparece su imagen o su titular. Los tiempos son la entrada de la voz.

| # | Entra | Plano | Locución |
|---|---|---|---|
| 1 | 1,3 s | La moneda sube | ¿Cara o cruz? |
| 2 | 3,4 s | Las monedas entran a la máquina; los visores: ? ? ? | Pagas portales. Pagas anuncios… ¿y funcionará? |
| 3 | 7,1 s | DEJA DE TIRAR MONEDAS AL AIRE. | Deja de tirar monedas al aire. |
| 4 | 11,0 s | El campo de personas | Invierte solo en quien ya busca lo que tienes. |
| 5 | 13,9 s | La moneda gira: es un reloj | Y si buscas casa… tu moneda es el tiempo. |
| 6 | 17,1 s | DEJA DE REGALAR TUS HORAS. | Deja de regalar tus horas. |
| 7 | 19,1 s | La losa con forma de casa | Publica lo que necesitas. |
| 8 | 22,4 s | Clic: encaja | Y te contactan solo si encaja. |
| 9 | 25,7 s | POR FIN, ENCAJAN. | Por fin, encajan. |
| 10 | 27,6 s | Logo | Propiedad Conecta. |
| 11 | 29,3 s | propiedadconecta.com | propiedadconecta.com |

## Texto que se manda a ElevenLabs (una sola toma)

Se graba todo seguido y después `video/monedas/locucion/mezcla.py` lo acelera un 10 %, lo corta por los silencios, agrupa los trozos en las once líneas según su duración, acorta las pausas internas y coloca cada línea en su tiempo. La música baja 8 dB mientras se habla y la mezcla queda a −14 LUFS con picos a −1 dBFS.

Hay tres tomas en `video/monedas/locucion/`: `toma-c.mp3` (la tuya, la que se usa), y `toma-a.mp3` y `toma-b.mp3` (las primeras, con la voz Gael). Para probar otra: `python3 video/monedas/locucion/mezcla.py video/monedas/locucion/toma-b.mp3`.

```
¿Cara o cruz?
[pause] Pagas portales. Pagas anuncios… ¿y funcionará?
[pause] Deja de tirar monedas al aire.
[pause] Invierte solo en quien ya busca lo que tienes.
[pause] Y si buscas casa… tu moneda es el tiempo.
[pause] Deja de regalar tus horas.
[pause] Publica lo que necesitas.
[pause] Y te contactan solo si encaja.
[pause] Por fin, encajan.
[pause] Propiedad Conecta.
[pause] propiedadconecta.com
```
