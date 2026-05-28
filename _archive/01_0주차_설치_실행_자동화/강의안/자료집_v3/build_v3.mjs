// V3 자료집: 0~4장 md를 합쳐 통합본 + 사이드바 HTML 뷰어 생성.
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const DIR = import.meta.dirname;
const CHAPTERS = ["art_0장.md", "art_1장.md", "art_2장.md", "art_3장.md", "art_4장.md"];
const MERGED = join(DIR, "자료집_v3_통합.md");
const OUT = join(DIR, "../../산출물/자료집_v3_뷰어.html");

// 합치기
const parts = [];
for (const f of CHAPTERS) {
  const t = (await readFile(join(DIR, f), "utf8")).trim();
  parts.push(t);
}
const raw = parts.join("\n\n---\n\n");
await writeFile(MERGED, raw, "utf8");

// "## N. 제목"으로 분할
const lines = raw.split("\n");
const docs = [];
let cur = null;
for (const line of lines) {
  // 장 헤딩만: "## 2." 는 잡고 "## 2.1" 소제목은 제외
  const m = line.match(/^##\s+(\d+)\.\s+(?!\d)(.*)$/);
  if (m) {
    if (cur) docs.push(cur);
    cur = { num: m[1], title: m[2].trim(), body: [line] };
  } else if (cur) {
    cur.body.push(line);
  }
}
if (cur) docs.push(cur);
// 본문 내 "## N.M 소제목"은 "### N.M"으로 낮춤
for (const d of docs) {
  d.raw = d.body.map((l) => l.replace(/^##\s+(\d+\.\d+)\s+/, "### $1 ")).join("\n");
}

const dataJson = JSON.stringify(
  docs.map((d) => ({ id: "ch" + d.num, num: d.num, title: d.title, raw: d.raw }))
);

const html = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ainspire 4기 — 로컬 AI 자료집 V3</title>
<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
<style>
  :root{
    --bg:#0f1117; --panel:#171a23; --panel2:#1e222e; --line:#2a2f3d;
    --text:#e7e9ee; --muted:#9aa2b1; --accent:#6c8cff; --accent2:#22d3ee; --chip:#242938;
  }
  *{box-sizing:border-box}
  html,body{margin:0;height:100%}
  body{font-family:"Pretendard","Segoe UI",-apple-system,system-ui,sans-serif;
    background:var(--bg); color:var(--text); display:flex; height:100vh; overflow:hidden;}
  aside{width:340px; flex-shrink:0; background:var(--panel); border-right:1px solid var(--line);
    display:flex; flex-direction:column; height:100%;}
  .brand{padding:20px 18px 14px; border-bottom:1px solid var(--line)}
  .brand .k{font-size:11px; letter-spacing:.18em; color:var(--accent2); font-weight:700}
  .brand h1{margin:6px 0 2px; font-size:17px; font-weight:800}
  .brand p{margin:0; font-size:12px; color:var(--muted)}
  .search{padding:12px 14px; border-bottom:1px solid var(--line)}
  .search input{width:100%; padding:9px 12px; border-radius:9px; border:1px solid var(--line);
    background:var(--panel2); color:var(--text); font-size:13px; outline:none;}
  .search input:focus{border-color:var(--accent)}
  nav{overflow-y:auto; padding:8px; flex:1}
  .item{display:flex; gap:10px; align-items:center; padding:9px 11px; border-radius:9px;
    cursor:pointer; color:var(--muted); font-size:13px; line-height:1.35;}
  .item:hover{background:var(--panel2); color:var(--text)}
  .item.active{background:linear-gradient(90deg,rgba(108,140,255,.22),rgba(34,211,238,.10)); color:#fff}
  .item .badge{flex-shrink:0; width:30px; height:30px; border-radius:8px; background:var(--chip);
    display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:800; color:var(--accent2);}
  .item.active .badge{background:var(--accent); color:#fff}
  .item .t{font-weight:600}
  main{flex:1; overflow-y:auto; height:100%}
  .topbar{position:sticky; top:0; z-index:5; backdrop-filter:blur(8px);
    background:rgba(15,17,23,.78); border-bottom:1px solid var(--line);
    padding:14px 28px; display:flex; align-items:center; gap:12px;}
  .topbar .num{width:34px;height:34px;border-radius:9px;background:var(--accent);color:#fff;
    display:flex;align-items:center;justify-content:center;font-weight:800;font-size:14px;}
  .topbar h2{margin:0;font-size:16px;font-weight:700}
  .wrap{max-width:760px; margin:0 auto; padding:44px 28px 110px}
  .md{font-size:16.5px}
  .md h2{font-size:23px;font-weight:800;margin:46px 0 16px;line-height:1.4}
  .md h3{font-size:18.5px;font-weight:800;margin:34px 0 12px;line-height:1.45}
  .md h4{font-size:14px;font-weight:700;margin:22px 0 6px;color:var(--accent2);letter-spacing:.02em}
  .md p{line-height:1.85;color:#d4d8e1;margin:18px 0;word-break:keep-all}
  /* 리스트 → 카드 박스 (토스 aside 패턴, 다크) */
  .md ul,.md ol{background:var(--panel2);border:1px solid var(--line);border-radius:14px;
    padding:20px 22px 20px 40px;margin:20px 0;line-height:1.8;color:#d4d8e1}
  .md li{margin:6px 0}
  .md li::marker{color:var(--accent2);font-weight:700}
  .md ul ul,.md ol ol,.md ul ol,.md ol ul{background:none;border:none;padding:4px 0 4px 20px;margin:3px 0}
  .md strong{color:#fff;font-weight:700}
  .md em{color:var(--accent2);font-style:normal}
  .md hr{border:none;border-top:1px dashed var(--line);margin:26px 0}
  .md code{background:var(--panel2);border:1px solid var(--line);padding:1px 6px;border-radius:5px;font-size:13px;color:#ffd9a0}
  .md pre{background:#0b0d13;border:1px solid var(--line);border-radius:10px;padding:14px 16px;overflow:auto}
  .md pre code{background:none;border:none;padding:0;color:#cfe3ff}
  .md table{border-collapse:collapse;width:100%;margin:14px 0;font-size:13.5px}
  .md th,.md td{border:1px solid var(--line);padding:9px 11px;text-align:left;vertical-align:top}
  .md th{background:var(--panel2);color:#fff;font-weight:700}
  .md tr:nth-child(even) td{background:rgba(255,255,255,.02)}
  .md blockquote{border-left:3px solid var(--accent);margin:12px 0;padding:6px 14px;color:var(--muted);background:var(--panel2);border-radius:0 8px 8px 0}
  .md img{display:block;max-width:100%;margin:22px auto 4px;border-radius:12px;border:1px solid var(--line);background:#fff}
  .md video{display:block;max-width:100%;margin:22px auto 4px;border-radius:12px;border:1px solid var(--line);background:#000}
  .md img + em, .md video + em, .media-grid + em{display:block;text-align:center;color:var(--muted);font-size:12.5px;margin:0 0 26px;font-style:normal}
  /* 연속 미디어 → 그리드 */
  .media-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin:22px 0 4px}
  .media-grid img, .media-grid video{margin:0;width:100%}
  .media-grid:has(> :nth-child(3):last-child) , .media-grid:has(> :nth-child(3)){grid-template-columns:repeat(3,1fr)}
  /* 인터랙티브 위젯 */
  .widget{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:18px 18px 16px;margin:24px 0;font-size:14px}
  .wg-title{font-weight:800;color:#fff;font-size:14px;margin-bottom:12px}
  .wg-row{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}
  .widget button{background:var(--accent);color:#fff;border:none;border-radius:8px;padding:8px 14px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit}
  .widget button:hover{filter:brightness(1.1)}
  .wg-note{margin-top:10px;color:var(--muted);font-size:12.5px;line-height:1.5}
  /* 터미널 */
  .wg-term{background:#0b0d13;border:1px solid var(--line);border-radius:10px;overflow:hidden}
  .wg-term-bar{display:flex;gap:6px;padding:9px 12px;background:#161a23;border-bottom:1px solid var(--line)}
  .wg-term-bar span{width:11px;height:11px;border-radius:50%;background:#3a4150}
  .wg-term-body{padding:14px 16px;font-family:ui-monospace,Consolas,Menlo,monospace;font-size:13px;min-height:84px;line-height:1.7}
  .wg-line{white-space:pre-wrap;word-break:break-all}
  .wg-prompt{color:var(--accent2);font-weight:700}
  .wg-cmd{color:#cfe3ff}
  .wg-muted{color:var(--muted)}
  .wg-result{color:#9be39b;margin-top:6px}
  /* 토큰 */
  .wg-input{width:100%;background:var(--panel2);border:1px solid var(--line);border-radius:8px;color:#fff;padding:9px 12px;font-size:14px;font-family:inherit;outline:none}
  .wg-input:focus{border-color:var(--accent)}
  .wg-tokens{display:flex;flex-wrap:wrap;gap:6px;margin-top:12px}
  .wg-tok{background:rgba(34,211,238,.14);border:1px solid rgba(34,211,238,.4);color:#bdeefb;border-radius:6px;padding:3px 9px;font-size:13px;font-family:ui-monospace,monospace}
  /* 컨텍스트 책상 */
  .wg-desk{display:flex;flex-wrap:wrap;gap:8px;min-height:84px;align-content:flex-start;background:var(--panel2);border:1px dashed var(--line);border-radius:10px;padding:12px}
  .wg-doc{background:#fff;color:#1a1a1a;border-radius:5px;padding:6px 10px;font-size:12.5px;font-weight:600;box-shadow:0 2px 6px rgba(0,0,0,.3)}
  .wg-bar{height:8px;background:var(--panel2);border-radius:5px;margin-top:10px;overflow:hidden}
  .wg-fill{height:100%;width:0;background:linear-gradient(90deg,var(--accent),var(--accent2));transition:width .3s}
  /* 에이전트 */
  .wg-goal{background:var(--panel2);border-left:3px solid var(--accent);border-radius:0 8px 8px 0;padding:9px 13px;color:#d4d8e1;font-size:13px;margin-bottom:12px}
  .wg-steps{display:flex;flex-direction:column;gap:8px}
  .wg-step{display:flex;align-items:center;gap:10px;background:var(--panel2);border:1px solid var(--line);border-radius:9px;padding:10px 12px;color:var(--muted);font-size:13.5px;transition:all .25s}
  .wg-step-n{width:22px;height:22px;border-radius:50%;background:var(--line);color:#fff;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;flex-shrink:0}
  .wg-step.active{border-color:var(--accent2);color:#fff}
  .wg-step.active .wg-step-n{background:var(--accent2)}
  .wg-step.done{color:#9be39b}
  .wg-step.done .wg-step-n{background:#2e7d32}
  ::-webkit-scrollbar{width:10px;height:10px}
  ::-webkit-scrollbar-thumb{background:#2a2f3d;border-radius:6px}
  ::-webkit-scrollbar-track{background:transparent}
  .empty{color:var(--muted);text-align:center;margin-top:120px}
</style>
</head>
<body>
  <aside>
    <div class="brand">
      <div class="k">AINSPIRE 4기</div>
      <h1>로컬 AI 자료집 (V3)</h1>
      <p>영상 크리에이터를 위한 로컬 AI 입문 · ${docs.length}개 장</p>
    </div>
    <div class="search"><input id="q" type="text" placeholder="자료집 검색…"></div>
    <nav id="nav"></nav>
  </aside>
  <main>
    <div class="topbar"><div class="num" id="topnum">–</div><h2 id="toptitle">장을 선택하세요</h2></div>
    <div class="wrap"><div class="md" id="content"><p class="empty">왼쪽에서 장을 선택하세요.</p></div></div>
  </main>
<script>
  const DOCS = ${dataJson};
  const nav = document.getElementById('nav');
  const content = document.getElementById('content');
  const topnum = document.getElementById('topnum');
  const toptitle = document.getElementById('toptitle');
  const q = document.getElementById('q');
  let active = null;
  function render(list){
    nav.innerHTML = '';
    list.forEach(d=>{
      const el = document.createElement('div');
      el.className = 'item' + (active===d.id?' active':'');
      el.innerHTML = '<span class="badge">'+d.num+'</span><span class="t">'+d.title+'</span>';
      el.onclick = ()=>open(d.id);
      nav.appendChild(el);
    });
  }
  function open(id){
    const d = DOCS.find(x=>x.id===id);
    if(!d) return;
    active = id;
    topnum.textContent = d.num;
    toptitle.textContent = d.title;
    content.innerHTML = marked.parse(d.raw);
    enhanceMedia(content);
    document.querySelector('main').scrollTop = 0;
    render(filtered());
  }
  // mp4 이미지 → video, 연속 이미지 → 그리드
  function enhanceMedia(root){
    // .mp4를 가리키는 img를 video로 교체
    root.querySelectorAll('img').forEach(img=>{
      if(/\.(mp4|webm|mov)$/i.test(img.getAttribute('src')||'')){
        const v=document.createElement('video');
        v.src=img.getAttribute('src'); v.controls=true; v.preload='metadata';
        v.playsInline=true; v.muted=true;
        img.replaceWith(v);
      }
    });
    // 연속한 미디어(p 안의 단일 img/video가 줄줄이) → grid로 묶기
    const blocks=[...root.children];
    let i=0;
    while(i<blocks.length){
      const isMedia=el=>el && el.tagName==='P' && el.children.length===1 &&
        (el.children[0].tagName==='IMG'||el.children[0].tagName==='VIDEO') &&
        el.textContent.trim()==='';
      if(isMedia(blocks[i])){
        let j=i; while(isMedia(blocks[j+1])) j++;
        if(j>i){ // 2개 이상 연속 → 그리드
          const grid=document.createElement('div');
          grid.className='media-grid';
          for(let k=i;k<=j;k++){ grid.appendChild(blocks[k].children[0]); }
          blocks[i].replaceWith(grid);
          for(let k=i+1;k<=j;k++){ blocks[k].remove(); }
        }
      }
      i++;
    }
  }
  function filtered(){
    const k = q.value.trim().toLowerCase();
    if(!k) return DOCS;
    return DOCS.filter(d=> (d.title+d.raw).toLowerCase().includes(k));
  }
  q.addEventListener('input', ()=>render(filtered()));
  render(DOCS);
  open(DOCS[0].id);
</script>
</body>
</html>`;

await writeFile(OUT, html, "utf8");
console.log("V3 통합:", MERGED, "/", raw.length, "자");
console.log("V3 뷰어 생성:", OUT, "/ 장", docs.length, "개");
