#!/bin/zsh
# 원본 사진 폴더를 웹용으로 줄여서 photos/<slug>/ 에 넣고, site.js에 붙일 목록을 출력합니다.
# 사용법: ./scripts/optimize.sh ~/Desktop/서울마라톤_셀렉 seoul-marathon-2026
set -euo pipefail

src=${1:?원본 폴더 경로를 넣어주세요}
slug=${2:?slug(영문 폴더명)를 넣어주세요}
root=${0:A:h:h}
out="$root/photos/$slug"
mkdir -p "$out/thumb"

files=()
for f in "$src"/*.(jpg|jpeg|JPG|JPEG|png|PNG|heic|HEIC)(N); do
  name="${${f:t:r}// /-}.jpg"
  # 원본: 긴 변 2000px, 썸네일: 긴 변 900px
  sips -s format jpeg -s formatOptions 82 -Z 2000 "$f" --out "$out/$name" >/dev/null
  sips -s format jpeg -s formatOptions 75 -Z 900 "$f" --out "$out/thumb/$name" >/dev/null
  files+=("\"$name\"")
done

echo "✓ ${#files} 장 → photos/$slug/"
echo
echo "data/site.js 에 붙여넣기:"
echo "    photos: [${(j:, :)files}],"
