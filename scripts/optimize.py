"""원본 사진 폴더를 웹용으로 줄여 photos/<slug>/ 에 넣고, site.js 에 붙일 목록을 출력한다.

- 긴 변 2000px(원본 보기) + 900px(썸네일)
- 회전 정보는 픽셀에 반영하고, EXIF/GPS 등 메타데이터는 모두 제거 (색 프로파일만 유지)
- 파일명은 01.jpg, 02.jpg ... (원본 파일명 순서)

사용법: .venv/bin/python scripts/optimize.py <원본폴더> <slug>
"""

import sys
from pathlib import Path

from PIL import Image, ImageOps

SIZES = {"": (2000, 82), "thumb": (900, 75)}  # 하위폴더: (긴 변, JPEG 품질)
EXTS = {".jpg", ".jpeg", ".png", ".heic", ".tif", ".tiff"}


def main(src: Path, slug: str) -> None:
    out = Path(__file__).resolve().parent.parent / "photos" / slug
    files = sorted(p for p in src.iterdir() if p.suffix.lower() in EXTS)
    if not files:
        sys.exit(f"사진이 없습니다: {src}")

    names = []
    for i, path in enumerate(files, 1):
        name = f"{i:02d}.jpg"
        with Image.open(path) as img:
            icc = img.info.get("icc_profile")
            img = ImageOps.exif_transpose(img).convert("RGB")
            for sub, (edge, quality) in SIZES.items():
                dest = out / sub / name
                dest.parent.mkdir(parents=True, exist_ok=True)
                copy = img.copy()
                copy.thumbnail((edge, edge), Image.LANCZOS)
                # exif를 넘기지 않으므로 메타데이터는 저장되지 않는다
                copy.save(dest, "JPEG", quality=quality, optimize=True, progressive=True, icc_profile=icc)
        names.append(name)
        print(f"  {name} ← {path.name}")

    print(f"\n✓ {len(names)}장 → photos/{slug}/\n")
    print("data/site.js 에 붙여넣기:")
    print("    photos: [" + ", ".join(f'"{n}"' for n in names) + "],")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    main(Path(sys.argv[1]).expanduser(), sys.argv[2])
