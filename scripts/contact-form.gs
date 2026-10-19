/**
 * 포트폴리오 문의 폼 → 메일 전달 (Google Apps Script 웹 앱)
 *
 * 받는 주소는 코드에 두지 않고 스크립트 속성 TO_EMAIL 에 저장한다.
 * (프로젝트 설정 → 스크립트 속성 → TO_EMAIL)
 *
 * 배포: 배포 → 새 배포 → 웹 앱 / 실행: 나 / 액세스: 모든 사용자
 */

const HOURLY_LIMIT = 20; // 시간당 최대 전송 수. 넘으면 그 시간엔 접수 중단

function doPost(e) {
  const p = (e && e.parameter) || {};

  // 봇이 숨김 칸을 채운 경우: 성공한 척만 한다
  if (p._gotcha) return json({ ok: true });

  const name = clip(p.name, 50);
  const phone = clip(p.phone, 20);
  const email = clip(p.email, 100);
  const message = clip(p.message, 5000);
  if (!name || !message || !isValidPhone(phone) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ ok: false, error: "invalid" });
  }

  // 전체 전송량 제한 (시간 단위로 카운트)
  const cache = CacheService.getScriptCache();
  const key = "count-" + Utilities.formatDate(new Date(), "Asia/Seoul", "yyyyMMddHH");
  const count = Number(cache.get(key) || 0);
  if (count >= HOURLY_LIMIT) return json({ ok: false, error: "rate" });
  cache.put(key, String(count + 1), 3600);

  const subject = clip(p._subject, 100) || "(제목 없음)";
  MailApp.sendEmail({
    to: PropertiesService.getScriptProperties().getProperty("TO_EMAIL"),
    replyTo: email, // 답장 누르면 문의자에게
    name: "NRP 촬영 문의",
    subject: "[NRP 문의] " + subject,
    body: [
      "이름: " + name,
      "연락처: " + phone,
      "이메일: " + email,
      "문의 유형: " + clip(p.type, 30),
      "제목: " + subject,
      "",
      message,
    ].join("\n"),
  });

  return json({ ok: true });
}

// 편집기에서 한 번 실행해 권한을 승인하고 메일이 오는지 확인하는 용도
function testSend() {
  doPost({
    parameter: {
      name: "테스트",
      phone: "010-2345-6789",
      email: Session.getActiveUser().getEmail() || "test@example.com",
      type: "기타",
      _subject: "연결 테스트",
      message: "이 메일이 보이면 정상입니다.",
    },
  });
}

// 사이트와 같은 규칙: 010-[2-9]XXX-XXXX, 011/016~019는 가운데 3~4자리, 같은 숫자 반복 거부
function isValidPhone(value) {
  const d = String(value).replace(/\D/g, "");
  const ok = /^010[2-9]\d{7}$/.test(d) || /^01[16789][2-9]\d{6,7}$/.test(d);
  return ok && !/^(\d)\1{7}$/.test(d.slice(-8));
}

function clip(value, max) {
  return String(value || "").trim().slice(0, max);
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
