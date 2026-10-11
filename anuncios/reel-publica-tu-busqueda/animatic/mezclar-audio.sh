#!/usr/bin/env bash
# Mezcla la locución y, si se entrega, la música sobre un animatic ya exportado.
# No genera audio: solo combina archivos que ya existen.
#
# Uso:
#   ./mezclar-audio.sh <video.mp4> <locucion.wav|m4a|mp3> [musica.wav|mp3] [salida.mp4]
#
# - La locución debe empezar en el segundo 0 del video. Por ejemplo, grabada de
#   corrido leyendo locucion/guion-locucion.txt mientras se reproduce el animatic.
# - La música se repite o recorta a la duración del video y baja 18 dB.
#   Mientras hay voz se atenúa todavía más (sidechain), y cierra con un fundido de 1,5 s.
# - Resultado: el video sin recodificar + audio AAC 48 kHz normalizado a −14 LUFS,
#   con pico ≤ −1 dBTP.
# - Los efectos de sonido se colocan en la edición final con la hoja de audio de
#   tabla-de-tiempos.md.
set -euo pipefail

video=${1:?Falta el video}
voz=${2:?Falta la locución}
musica=${3:-}
salida=${4:-${video%.mp4}-con-audio.mp4}

dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$video")
fundido=$(awk -v d="$dur" 'BEGIN { printf "%.2f", d - 1.5 }')
normalizar="loudnorm=I=-14:TP=-1:LRA=11"

if [[ -n "$musica" ]]; then
  ffmpeg -y -loglevel error -i "$video" -i "$voz" -stream_loop -1 -i "$musica" -filter_complex "\
[1:a]aresample=48000,apad,atrim=0:${dur},asplit=2[voz][llave];\
[2:a]aresample=48000,atrim=0:${dur},volume=-18dB,afade=t=out:st=${fundido}:d=1.5[mus];\
[mus][llave]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=300[musbaja];\
[voz][musbaja]amix=inputs=2:duration=first:normalize=0,${normalizar}[a]" \
    -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 320k -ar 48000 -shortest "$salida"
else
  ffmpeg -y -loglevel error -i "$video" -i "$voz" -filter_complex \
    "[1:a]aresample=48000,apad,atrim=0:${dur},${normalizar}[a]" \
    -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 320k -ar 48000 -shortest "$salida"
fi
echo "Listo: $salida"
