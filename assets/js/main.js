const IG_ICON = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none"/></svg>`;

const isRemote = (p) => /^https?:\/\//.test(p);

// 로컬 사진은 photos/<slug>/ 에서, 썸네일은 photos/<slug>/thumb/ 에서 읽는다
function photoUrl(project, file, thumb = false) {
  if (isRemote(file)) return file;
  return `photos/${project.slug}/${thumb ? "thumb/" : ""}${file}`;
}

function coverUrl(project) {
  return photoUrl(project, project.cover || project.photos[0], true);
}

function fillSiteFields() {
  document.querySelectorAll("[data-site]").forEach((el) => {
    const value = SITE[el.dataset.site];
    if (el.tagName === "IMG") el.src = value;
    else el.textContent = value;
  });
  document.getElementById("year").textContent = new Date().getFullYear();
  document.querySelectorAll("[data-ig]").forEach((el) => {
    el.href = `https://instagram.com/${SITE.instagram}`;
    el.innerHTML = el.id === "ig-link" ? `${IG_ICON}<span>@${SITE.instagram}</span>` : IG_ICON;
  });
}

function categoryLabel(key) {
  return CATEGORIES.find((c) => c.key === key)?.label ?? key;
}

function renderHome() {
  fillSiteFields();
  document.title = `${SITE.name} — ${SITE.fullName}`;

  const grid = document.getElementById("grid");
  const filters = document.getElementById("filters");

  const drawGrid = (cat) => {
    grid.innerHTML = PROJECTS.filter((p) => cat === "all" || p.category === cat)
      .map(
        (p) => `
        <a class="card" href="project.html?p=${encodeURIComponent(p.slug)}">
          <div class="card-img"><img src="${coverUrl(p)}" alt="${p.title}" loading="lazy"></div>
          <div class="card-meta">
            <span>${categoryLabel(p.category)} · ${p.date}</span>
            <h3>${p.title}</h3>
          </div>
        </a>`
      )
      .join("");
  };

  filters.innerHTML = [{ key: "all", label: "All" }, ...CATEGORIES.filter((c) => PROJECTS.some((p) => p.category === c.key))]
    .map((c, i) => `<button data-cat="${c.key}" class="${i === 0 ? "active" : ""}">${c.label}</button>`)
    .join("");
  filters.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    filters.querySelectorAll("button").forEach((b) => b.classList.toggle("active", b === btn));
    drawGrid(btn.dataset.cat);
  });
  drawGrid("all");

  document.getElementById("about-text").innerHTML = SITE.about.map((t) => `<p>${t}</p>`).join("");
  document.getElementById("history").innerHTML = SITE.history
    .map((h) => `<li><span>${h.year}</span>${h.text}</li>`)
    .join("");

  setupMailModal();

  // 스크롤하면 상단 메뉴에 배경
  const nav = document.querySelector(".nav");
  const onScroll = () => nav.classList.toggle("solid", window.scrollY > 40);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

function setupMailModal() {
  const modal = document.getElementById("mail-modal");
  const form = document.getElementById("mail-form");
  const done = modal.querySelector(".modal-done");
  const status = form.querySelector(".form-status");

  let openedAt = 0;

  document.getElementById("mail-open").onclick = () => {
    form.hidden = false;
    done.hidden = true;
    status.textContent = "";
    openedAt = Date.now();
    modal.showModal();
  };
  modal.querySelectorAll("[data-close]").forEach((b) => (b.onclick = () => modal.close()));
  // 바깥 영역 클릭 시 닫기
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.close();
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const body = new FormData(form);
    const showDone = () => {
      form.hidden = true;
      done.hidden = false;
    };

    // 봇 차단: 숨김 칸이 채워졌거나 창을 연 지 3초 안에 제출하면 보내지 않고 완료인 척만 한다
    if (body.get("_gotcha") || Date.now() - openedAt < 3000) return showDone();

    // 연속 전송 제한: 같은 브라우저에서 1분에 1번, 하루 3번까지
    const sent = recentSends();
    if (sent.length >= 3 || (sent.length && Date.now() - sent[sent.length - 1] < 60_000)) {
      status.textContent = "이미 문의를 보내주셨어요. 급한 건은 인스타 DM 부탁드려요.";
      return;
    }

    // 바로 완료 화면을 보여주고, 실패했을 때만 폼으로 되돌린다
    showDone();
    try {
      if (!SITE.formEndpoint) throw new Error("formEndpoint 미설정");
      // 구글 Apps Script(scripts/contact-form.gs)가 받아서 메일로 전달.
      // urlencoded로 보내야 CORS 사전 요청 없이 Apps Script가 e.parameter로 읽는다
      const res = await fetch(SITE.formEndpoint, {
        method: "POST",
        body: new URLSearchParams(body),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || res.status);
      form.reset();
      recordSend(sent);
    } catch {
      form.hidden = false;
      done.hidden = true;
      status.textContent = "전송에 실패했어요. 인스타 DM으로 연락 부탁드려요.";
    }
  });
}

// 최근 24시간 안에 이 브라우저에서 보낸 시각 목록
function recentSends() {
  try {
    const list = JSON.parse(localStorage.getItem("nrp-sent") || "[]");
    return list.filter((t) => Date.now() - t < 86_400_000);
  } catch {
    return [];
  }
}

function recordSend(list) {
  try {
    localStorage.setItem("nrp-sent", JSON.stringify([...list, Date.now()]));
  } catch {}
}

function renderProject() {
  fillSiteFields();
  const slug = new URLSearchParams(location.search).get("p");
  const idx = PROJECTS.findIndex((p) => p.slug === slug);
  if (idx === -1) {
    location.replace("./#work");
    return;
  }
  const project = PROJECTS[idx];
  document.title = `${project.title} — ${SITE.name}`;
  document.getElementById("p-meta").textContent = [categoryLabel(project.category), project.date, project.location]
    .filter(Boolean)
    .join(" · ");
  document.getElementById("p-title").textContent = project.title;
  document.getElementById("p-desc").textContent = project.description || "";

  const photos = document.getElementById("photos");
  photos.innerHTML = project.photos
    .map(
      (f, i) =>
        `<button class="tile" data-i="${i}"><img src="${photoUrl(project, f, true)}" alt="${project.title} ${i + 1}" loading="lazy"></button>`
    )
    .join("");

  const prev = PROJECTS[idx - 1];
  const next = PROJECTS[idx + 1];
  document.getElementById("pager").innerHTML = `
    ${prev ? `<a href="project.html?p=${prev.slug}">← ${prev.title}</a>` : "<span></span>"}
    ${next ? `<a href="project.html?p=${next.slug}">${next.title} →</a>` : "<span></span>"}`;

  setupLightbox(project.photos.map((f) => photoUrl(project, f)), photos);
}

function setupLightbox(urls, container) {
  const box = document.getElementById("lightbox");
  const img = box.querySelector("img");
  const count = box.querySelector(".lb-count");
  let current = 0;

  const show = (i) => {
    current = (i + urls.length) % urls.length;
    img.src = urls[current];
    count.textContent = `${current + 1} / ${urls.length}`;
    // 다음 사진 미리 로드
    new Image().src = urls[(current + 1) % urls.length];
  };
  const open = (i) => {
    box.hidden = false;
    document.body.style.overflow = "hidden";
    show(i);
  };
  const close = () => {
    box.hidden = true;
    document.body.style.overflow = "";
  };

  container.addEventListener("click", (e) => {
    const tile = e.target.closest(".tile");
    if (tile) open(Number(tile.dataset.i));
  });
  box.querySelector(".lb-close").onclick = close;
  box.querySelector(".lb-prev").onclick = () => show(current - 1);
  box.querySelector(".lb-next").onclick = () => show(current + 1);
  box.addEventListener("click", (e) => {
    if (e.target === box) close();
  });
  document.addEventListener("keydown", (e) => {
    if (box.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(current - 1);
    if (e.key === "ArrowRight") show(current + 1);
  });

  // 모바일 스와이프
  let startX = null;
  box.addEventListener("touchstart", (e) => (startX = e.touches[0].clientX), { passive: true });
  box.addEventListener("touchend", (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
    startX = null;
  });
}
