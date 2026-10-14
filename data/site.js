// ─────────────────────────────────────────────
// 사이트 전체 설정 + 작업물 목록. 이 파일만 고치면 됩니다.
// ─────────────────────────────────────────────

window.SITE = {
  name: "NRP",                       // 로고
  fullName: "nk.jiun running photography", // 로고 옆 작은 글씨
  role: "Running Photographer",
  tagline: "달리는 순간을 기록합니다.",
  instagram: "nk.jiun",              // @ 없이
  // 문의 폼 전송 주소. scripts/contact-form.gs 를 Apps Script 웹 앱으로 배포한 https://script.google.com/macros/s/.../exec
  formEndpoint: "https://script.google.com/macros/s/AKfycbwAtqN2rSIMsDOPE8DfxY-27T06LmVLqZkqi4BvgOw5i2DuWL4YuNJe8fFvxsn-DV4J/exec",
  heroImage: "photos/hero.jpg",
  about: [
    "러닝을 좋아하고, 달리는 사람을 찍습니다.",
    "마라톤 대회, 런트립, 러닝 크루·브랜드 이벤트 현장에서 촬영하고 있습니다.",
  ],
  // 소개 섹션의 이력. 필요 없으면 빈 배열로.
  history: [
    { year: "2026", text: "OO 마라톤 공식 포토그래퍼" },
    { year: "2026", text: "OO 러닝크루 제주 런트립 촬영" },
    { year: "2025", text: "OO 브랜드 러닝 팝업 이벤트 촬영" },
  ],
};

// category 값은 아래 CATEGORIES의 key 중 하나
window.CATEGORIES = [
  { key: "race", label: "Race" },
  { key: "trip", label: "Run Trip" },
  { key: "event", label: "Event" },
];

// 위에 있을수록 먼저 노출됩니다.
// photos: photos/<slug>/ 폴더 안 파일명 목록 (scripts/optimize.py 실행 시 자동 출력)
// cover: 생략하면 첫 번째 사진이 커버
window.PROJECTS = [
  {
    slug: "goodmorning-10k-2026",
    title: "굿몰닝 10K",
    category: "race",
    date: "2026.08.30",
    location: "",
    description: "",
    cover: "02.jpg",
    photos: ["01.jpg", "02.jpg", "03.jpg", "04.jpg", "05.jpg", "06.jpg", "07.jpg", "08.jpg", "09.jpg", "10.jpg", "11.jpg", "12.jpg", "13.jpg", "14.jpg", "15.jpg", "16.jpg", "17.jpg", "18.jpg", "19.jpg", "20.jpg", "21.jpg", "22.jpg", "23.jpg", "24.jpg"],
  },
];
