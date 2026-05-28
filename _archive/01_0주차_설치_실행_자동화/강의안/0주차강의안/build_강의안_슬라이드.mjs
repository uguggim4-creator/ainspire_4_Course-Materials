// 0주차 강의안 목차(0주차_강의안_목차.md)를 16:9 발표용 슬라이드 HTML로 만든다.
// 구조: 표지 → (장마다) 장 섹션표지 + 소제목 슬라이드 → 마무리
// 키보드 ←/→/Space 이동, F 전체화면.
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const DIR = import.meta.dirname;
const SRC = join(DIR, "0주차_강의안_목차.md");
const OUT = join(DIR, "0주차_강의안_슬라이드.html");
const IMG = "이미지"; // 강의안 폴더 내 이미지 (배포 시 자기완결)

const md = await readFile(SRC, "utf8");
const lines = md.split("\n");

// 헤더 인용블록(>)에서 안내문 수집
const intro = [];
for (const l of lines) {
  if (l.startsWith("> ")) intro.push(l.replace(/^>\s*/, "").replace(/\*\*/g, ""));
}

// 장(## N. 제목) + 목표 + 소제목(### N.M ...) 파싱
const chapters = [];
let cur = null;
for (let i = 0; i < lines.length; i++) {
  const l = lines[i];
  const ch = l.match(/^##\s+(\d+)\.\s*(.+)$/);
  if (ch) {
    cur = { num: ch[1], title: ch[2].trim(), goal: "", subs: [] };
    chapters.push(cur);
    // 다음 줄들 중 (목표: ...) 찾기
    for (let j = i + 1; j < Math.min(i + 4, lines.length); j++) {
      const g = lines[j].match(/^\(목표:\s*(.+)\)\s*$/);
      if (g) { cur.goal = g[1].trim(); break; }
    }
    continue;
  }
  const sub = l.match(/^###\s+(\d+\.\d+)\s+(.+)$/);
  if (sub && cur) {
    // 소제목 뒤에 붙은 부연(다음 줄들 중 일반 텍스트)은 생략, 제목만
    cur.subs.push({ no: sub[1], text: sub[2].trim() });
  }
}

// 장별 대표 이미지 매핑 (자료집 이미지 재사용)
const CH_IMG = {
  "1": `${IMG}/I1_표지.png`,
  "4": `${IMG}/D8_폴더구조.png`,
  "5": `${IMG}/D7_4도구비교.png`,
  "7": `${IMG}/D9_MD_HTML.png`,
};

// --- 슬라이드 HTML 조각 생성 ---
const slides = [];

// 표지
slides.push(`
<section class="slide cover">
  <div class="cover-badge">AINSPIRE 4기 · 0주차</div>
  <h1>설치 · 실행 · AI 작업 환경</h1>
  <p class="cover-sub">비개발자를 위한 첫 시작 — 설치부터 결과물까지</p>
  <div class="cover-meta">${intro.map((t) => `<span>${t}</span>`).join("")}</div>
</section>`);

// 목차 슬라이드
slides.push(`
<section class="slide agenda">
  <h2 class="agenda-title">오늘의 흐름</h2>
  <div class="agenda-grid">
    ${chapters
      .map(
        (c) =>
          `<div class="agenda-item"><span class="an">${c.num}</span><span class="at">${c.title}</span></div>`
      )
      .join("")}
  </div>
</section>`);

// 장별 슬라이드
for (const c of chapters) {
  const img = CH_IMG[c.num];
  // 장 섹션 표지
  slides.push(`
<section class="slide chapter">
  <div class="chap-num">${c.num}</div>
  <h2 class="chap-title">${c.title}</h2>
  ${c.goal ? `<p class="chap-goal">${c.goal}</p>` : ""}
</section>`);

  // 소제목 슬라이드 (이미지 있으면 좌우 분할)
  const subList = c.subs
    .map((s) => `<li><span class="sn">${s.no}</span> ${s.text}</li>`)
    .join("");
  if (img) {
    slides.push(`
<section class="slide content split">
  <div class="content-head"><span class="ch-badge">${c.num}</span><h3>${c.title}</h3></div>
  <div class="split-body">
    <ul class="sublist">${subList}</ul>
    <div class="split-img"><img src="${img}" alt="${c.title}"></div>
  </div>
</section>`);
  } else {
    slides.push(`
<section class="slide content">
  <div class="content-head"><span class="ch-badge">${c.num}</span><h3>${c.title}</h3></div>
  <ul class="sublist wide">${subList}</ul>
</section>`);
  }
}

// 마무리
slides.push(`
<section class="slide closing">
  <h2>오늘 만든 결과물</h2>
  <div class="closing-cards">
    <div class="cc"><div class="cc-ico">📄</div><div class="cc-t">README.md</div></div>
    <div class="cc"><div class="cc-ico">🌐</div><div class="cc-t">index.html</div></div>
    <div class="cc"><div class="cc-ico">🖥️</div><div class="cc-t">브라우저 확인</div></div>
  </div>
  <p class="closing-msg">설치 → 폴더 → 파일 생성 → 확인 → 수정 → 저장.<br>오늘 이 흐름을 직접 경험했습니다.</p>
</section>`);

const total = slides.length;

const html = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ainspire 4기 0주차 — 강의안 슬라이드</title>
<link rel="preconnect" href="https://cdn.jsdelivr.net">
<style>
  @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
  :root{
    --grad:linear-gradient(135deg,#6020ff 0%,#5028f0 45%,#00b4d8 100%);
    --purple:#6020ff; --cyan:#00b4d8; --yellow:#ffe600;
    --ink:#15171f; --muted:#6b7280; --line:#e6e8ee; --bg:#f4f6fb;
  }
  *{box-sizing:border-box;margin:0;padding:0}
  html,body{height:100%}
  body{font-family:"Pretendard",-apple-system,system-ui,sans-serif;background:#0c0e14;color:var(--ink);overflow:hidden}
  #deck{width:100vw;height:100vh;position:relative}
  .slide{
    position:absolute;inset:0;display:none;flex-direction:column;
    width:100%;height:100%;padding:6vh 7vw;background:var(--bg);
  }
  .slide.active{display:flex}
  /* 표지 */
  .cover{justify-content:center;align-items:flex-start;background:var(--grad);color:#fff}
  .cover-badge{font-size:1.1vw;letter-spacing:.25em;font-weight:700;color:var(--yellow);margin-bottom:2vh}
  .cover h1{font-size:5.2vw;font-weight:900;line-height:1.1;letter-spacing:-.02em}
  .cover-sub{font-size:1.8vw;margin-top:2vh;opacity:.92;font-weight:500}
  .cover-meta{margin-top:5vh;display:flex;flex-direction:column;gap:.8vh}
  .cover-meta span{font-size:1.05vw;opacity:.8;border-left:3px solid var(--yellow);padding-left:1vw}
  /* 목차 */
  .agenda-title{font-size:3vw;font-weight:900;margin-bottom:4vh;color:var(--purple)}
  .agenda-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:1.4vh 3vw}
  .agenda-item{display:flex;align-items:center;gap:1.2vw;font-size:1.5vw;font-weight:600}
  .agenda-item .an{width:2.6vw;height:2.6vw;border-radius:.6vw;background:var(--grad);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:1.3vw;flex-shrink:0}
  /* 장 표지 */
  .chapter{justify-content:center;background:var(--grad);color:#fff}
  .chap-num{font-size:9vw;font-weight:900;line-height:1;opacity:.35}
  .chap-title{font-size:4.2vw;font-weight:900;margin-top:1vh;letter-spacing:-.02em}
  .chap-goal{font-size:1.7vw;margin-top:3vh;opacity:.92;max-width:70%;line-height:1.5;border-left:4px solid var(--yellow);padding-left:1.5vw}
  /* 내용 */
  .content-head{display:flex;align-items:center;gap:1.2vw;margin-bottom:4vh}
  .ch-badge{width:3vw;height:3vw;border-radius:.7vw;background:var(--grad);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:1.5vw}
  .content-head h3{font-size:2.6vw;font-weight:800;color:var(--ink)}
  .sublist{list-style:none;display:flex;flex-direction:column;gap:1.6vh}
  .sublist.wide{max-width:80%}
  .sublist li{font-size:1.55vw;font-weight:500;line-height:1.45;display:flex;gap:1vw;align-items:baseline;color:#2a2e3a}
  .sublist .sn{color:var(--cyan);font-weight:800;font-size:1.3vw;flex-shrink:0}
  .split-body{display:flex;gap:3vw;flex:1;align-items:center}
  .split-body .sublist{flex:1}
  .split-img{flex:1;display:flex;align-items:center;justify-content:center}
  .split-img img{max-width:100%;max-height:62vh;border-radius:1vw;border:1px solid var(--line);box-shadow:0 1vw 3vw rgba(0,0,0,.12)}
  /* 마무리 */
  .closing{justify-content:center;align-items:center;text-align:center;background:var(--grad);color:#fff}
  .closing h2{font-size:3.4vw;font-weight:900}
  .closing-cards{display:flex;gap:2.5vw;margin:5vh 0}
  .cc{background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.25);border-radius:1.2vw;padding:3vh 3vw;backdrop-filter:blur(6px)}
  .cc-ico{font-size:3vw}
  .cc-t{font-size:1.4vw;font-weight:700;margin-top:1vh}
  .closing-msg{font-size:1.6vw;line-height:1.6;opacity:.95}
  /* 진행 표시 */
  #bar{position:fixed;bottom:0;left:0;height:.5vh;background:var(--yellow);z-index:20;transition:width .25s}
  #pageno{position:fixed;bottom:1.5vh;right:2vw;font-size:1vw;color:var(--muted);z-index:20;font-weight:600}
  .cover #pageno,.chapter #pageno,.closing #pageno{color:rgba(255,255,255,.7)}
  #hint{position:fixed;bottom:1.5vh;left:2vw;font-size:.85vw;color:var(--muted);z-index:20}
</style>
</head>
<body>
<div id="deck">${slides.join("\n")}</div>
<div id="bar"></div>
<div id="pageno"></div>
<div id="hint">← → 또는 Space 이동 · F 전체화면</div>
<script>
  const slides=[...document.querySelectorAll('.slide')];
  let i=0; const total=slides.length;
  function show(n){
    i=Math.max(0,Math.min(total-1,n));
    slides.forEach((s,k)=>s.classList.toggle('active',k===i));
    document.getElementById('bar').style.width=((i+1)/total*100)+'%';
    document.getElementById('pageno').textContent=(i+1)+' / '+total;
  }
  document.addEventListener('keydown',e=>{
    if(e.key==='ArrowRight'||e.key===' '||e.key==='PageDown'){show(i+1);e.preventDefault();}
    else if(e.key==='ArrowLeft'||e.key==='PageUp'){show(i-1);}
    else if(e.key==='Home'){show(0);}
    else if(e.key==='End'){show(total-1);}
    else if(e.key==='f'||e.key==='F'){if(!document.fullscreenElement)document.documentElement.requestFullscreen();else document.exitFullscreen();}
  });
  document.addEventListener('click',e=>{ if(e.clientX > window.innerWidth*0.5) show(i+1); else show(i-1); });
  show(0);
</script>
</body>
</html>`;

await writeFile(OUT, html, "utf8");
console.log("슬라이드 생성 완료:", OUT, "/ 슬라이드", total, "장");
