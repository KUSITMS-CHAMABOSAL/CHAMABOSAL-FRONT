#!/usr/bin/env bash
# 영상이나 스크린샷 폴더를 한 장의 격자 이미지로 모아요. 이 이미지 한 장만 읽으면 움직임 전체를 볼 수 있어요.
# 사용: contact-sheet.sh <영상 파일 | png 폴더> <출력.png> [열 수=6] [초당 장수=4, 영상만] [crop=w:h:x:y, 영상만]
# 예: contact-sheet.sh prototype.mov sheet.png 12 4 790:1660:1345:265
set -euo pipefail

input=$1
out=$2
cols=${3:-6}
fps=${4:-4}
crop=${5:-}
tile_width=200

if [[ -d $input ]]; then
  count=$(find "$input" -maxdepth 1 -name '*.png' | wc -l | tr -d ' ')
  rows=$(((count + cols - 1) / cols))
  ffmpeg -v error -y -framerate 1 -pattern_type glob -i "$input/*.png" \
    -vf "scale=$tile_width:-1,tile=${cols}x${rows}" -frames:v 1 "$out"
else
  duration=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$input")
  count=$(awk -v d="$duration" -v f="$fps" 'BEGIN { printf "%d", d * f + 0.999 }')
  rows=$(((count + cols - 1) / cols))
  filter="fps=$fps,scale=$tile_width:-1,tile=${cols}x${rows}"
  [[ -n $crop ]] && filter="crop=$crop,$filter"
  ffmpeg -v error -y -i "$input" -vf "$filter" -frames:v 1 "$out"
fi

echo "$out (${count}장, ${cols}열)"
