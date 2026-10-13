// ─────────────────────────────────────────────
// 사이트 전체 설정 + 작업물 목록. 이 파일만 고치면 됩니다.
// ─────────────────────────────────────────────

window.SITE = {
  name: "NRP",                       // 로고
  fullName: "nk.jiun running photography", // 로고 옆 작은 글씨
  role: "Running Photographer",
  tagline: "달리는 순간을 기록합니다.",
  instagram: "nk.jiun",              // @ 없이
  // 문의 폼 전송 주소. formspree.io 에서 폼을 만들면 나오는 https://formspree.io/f/xxxxxxx
  formEndpoint: "",
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
// photos: photos/<slug>/ 폴더 안 파일명 목록 (scripts/optimize.sh 실행 시 자동 출력)
// cover: 생략하면 첫 번째 사진이 커버
window.PROJECTS = [
  {
    slug: "seoul-marathon-2026",
    title: "Seoul Marathon 2026",
    category: "race",
    date: "2026.03",
    location: "Seoul",
    description: "42.195km, 광화문에서 잠실까지.",
    photos: demo("seoul", 14),
  },
  {
    slug: "jeju-run-trip",
    title: "Jeju Run Trip",
    category: "trip",
    date: "2026.05",
    location: "Jeju",
    description: "해안도로를 따라 달린 2박 3일.",
    photos: demo("jeju", 10),
  },
  {
    slug: "night-run-event",
    title: "Night Run Party",
    category: "event",
    date: "2026.07",
    location: "Hangang Park",
    description: "한강 야간 러닝 이벤트.",
    photos: demo("night", 12),
  },
  {
    slug: "chuncheon-marathon-2025",
    title: "Chuncheon Marathon 2025",
    category: "race",
    date: "2025.10",
    location: "Chuncheon",
    description: "가을의 춘천.",
    photos: demo("chuncheon", 9),
  },
];

// 데모용 플레이스홀더 이미지. 실제 사진으로 바꾸면 이 함수는 지워도 됩니다.
function demo(seed, n) {
  const sizes = [[1600, 1067], [1067, 1600], [1600, 1067], [1600, 900], [1200, 1500]];
  return Array.from({ length: n }, (_, i) => {
    const [w, h] = sizes[i % sizes.length];
    return `https://picsum.photos/seed/${seed}${i}/${w}/${h}`;
  });
}
