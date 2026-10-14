# Running Photo Portfolio

빌드 없는 정적 사이트. `data/site.js` 하나만 고치면 됩니다.

## 로컬 미리보기
```sh
python3 -m http.server 8000   # → http://localhost:8000
```

## 사진 추가
1. 셀렉한 원본을 폴더 하나에 모은다
2. `.venv/bin/python scripts/optimize.py <원본폴더> <slug>` → `photos/<slug>/`에 웹용(2000px) + 썸네일(900px) 생성, 위치정보 등 메타데이터 제거
   (처음 한 번: `python3 -m venv .venv && .venv/bin/pip install pillow`)
3. 출력된 `photos: [...]` 줄을 `data/site.js`의 해당 프로젝트에 붙여넣기

## 구조
- `index.html` — 메인(히어로 / Work 그리드 + 카테고리 필터 / About / Contact)
- `project.html?p=<slug>` — 갤러리 + 라이트박스(모바일 스와이프)
- `assets/css/style.css` — `--accent` 색 하나로 분위기 변경

## 배포
`main` 브랜치에 push하면 GitHub Pages(https://nk-jiun.github.io)에 자동 반영됩니다.

## 문의 폼
`scripts/contact-form.gs`를 Google Apps Script 웹 앱으로 배포해 메일로 받습니다. 받는 주소는 Apps Script의 스크립트 속성 `TO_EMAIL`에만 저장하고, 웹 앱 주소는 `data/site.js`의 `formEndpoint`.
