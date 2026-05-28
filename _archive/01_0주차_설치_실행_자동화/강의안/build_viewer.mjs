// 세부내용 18개 .md를 하나의 자기완결 HTML 뷰어로 묶는다.
// 더블클릭만으로 열리도록 마크다운 원문을 HTML 안에 임베드한다.
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = join(__dirname, "세부내용");
const OUT = join(__dirname, "../산출물/0주차_세부내용_뷰어.html");

const files = (await readdir(SRC))
  .filter((f) => f.endsWith(".md"))
  .sort((a, b) => a.localeCompare(b, "ko", { numeric: true }));

const docs = [];
for (const f of files) {
  const raw = await readFile(join(SRC, f), "utf8");
  // 파일명 앞 번호 + 제목 추출
  const m = f.match(/^(\d+)_(.+)_세부내용\.md$/);
  const num = m ? m[1] : "";
  const title = m ? m[2] : f.replace(/\.md$/, "");
  docs.push({ id: f, num, title, raw });
}

const dataJson = JSON.stringify(docs);

const html = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ainspire 4기 0주차 — 세부내용 뷰어</title>
<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
<style>
  :root{
    --bg:#0f1117; --panel:#171a23; --panel2:#1e222e; --line:#2a2f3d;
    --text:#e7e9ee; --muted:#9aa2b1; --accent:#6c8cff; --accent2:#22d3ee;
    --chip:#242938;
  }
  *{box-sizing:border-box}
  html,body{margin:0;height:100%}
  body{
    font-family:"Pretendard","Segoe UI",-apple-system,system-ui,sans-serif;
    background:var(--bg); color:var(--text); display:flex; height:100vh; overflow:hidden;
  }
  /* sidebar */
  aside{
    width:300px; flex-shrink:0; background:var(--panel); border-right:1px solid var(--line);
    display:flex; flex-direction:column; height:100%;
  }
  .brand{padding:20px 18px 14px; border-bottom:1px solid var(--line)}
  .brand .k{font-size:11px; letter-spacing:.18em; color:var(--accent2); font-weight:700}
  .brand h1{margin:6px 0 2px; font-size:17px; font-weight:800}
  .brand p{margin:0; font-size:12px; color:var(--muted)}
  .search{padding:12px 14px; border-bottom:1px solid var(--line)}
  .search input{
    width:100%; padding:9px 12px; border-radius:9px; border:1px solid var(--line);
    background:var(--panel2); color:var(--text); font-size:13px; outline:none;
  }
  .search input:focus{border-color:var(--accent)}
  nav{overflow-y:auto; padding:8px; flex:1}
  .item{
    display:flex; gap:10px; align-items:center; padding:9px 11px; border-radius:9px;
    cursor:pointer; color:var(--muted); font-size:13px; line-height:1.35;
  }
  .item:hover{background:var(--panel2); color:var(--text)}
  .item.active{background:linear-gradient(90deg,rgba(108,140,255,.22),rgba(34,211,238,.10)); color:#fff}
  .item .badge{
    flex-shrink:0; width:30px; height:30px; border-radius:8px; background:var(--chip);
    display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:800; color:var(--accent2);
  }
  .item.active .badge{background:var(--accent); color:#fff}
  .item .t{font-weight:600}
  /* main */
  main{flex:1; overflow-y:auto; height:100%}
  .topbar{
    position:sticky; top:0; z-index:5; backdrop-filter:blur(8px);
    background:rgba(15,17,23,.78); border-bottom:1px solid var(--line);
    padding:14px 28px; display:flex; align-items:center; gap:12px;
  }
  .topbar .num{
    width:34px;height:34px;border-radius:9px;background:var(--accent);color:#fff;
    display:flex;align-items:center;justify-content:center;font-weight:800;font-size:14px;
  }
  .topbar h2{margin:0;font-size:16px;font-weight:700}
  .wrap{max-width:880px; margin:0 auto; padding:34px 28px 90px}
  /* markdown */
  .md h1{font-size:26px;font-weight:800;margin:0 0 6px;line-height:1.3}
  .md h2{font-size:21px;font-weight:800;margin:34px 0 12px;padding-bottom:8px;border-bottom:1px solid var(--line)}
  .md h3{font-size:17px;font-weight:700;margin:26px 0 8px;color:#fff}
  .md h4{font-size:14px;font-weight:700;margin:18px 0 6px;color:var(--accent2);letter-spacing:.02em}
  .md p{line-height:1.75;color:#d4d8e1;margin:10px 0}
  .md ul,.md ol{line-height:1.75;color:#d4d8e1;padding-left:22px}
  .md li{margin:4px 0}
  .md strong{color:#fff}
  .md hr{border:none;border-top:1px dashed var(--line);margin:26px 0}
  .md code{background:var(--panel2);border:1px solid var(--line);padding:1px 6px;border-radius:5px;font-size:13px;color:#ffd9a0}
  .md pre{background:#0b0d13;border:1px solid var(--line);border-radius:10px;padding:14px 16px;overflow:auto}
  .md pre code{background:none;border:none;padding:0;color:#cfe3ff}
  .md table{border-collapse:collapse;width:100%;margin:14px 0;font-size:13.5px}
  .md th,.md td{border:1px solid var(--line);padding:9px 11px;text-align:left;vertical-align:top}
  .md th{background:var(--panel2);color:#fff;font-weight:700}
  .md tr:nth-child(even) td{background:rgba(255,255,255,.02)}
  .md blockquote{border-left:3px solid var(--accent);margin:12px 0;padding:6px 14px;color:var(--muted);background:var(--panel2);border-radius:0 8px 8px 0}
  /* PPT 메모 / 캡쳐 플레이스홀더 강조 */
  .md h2:contains{}
  ::-webkit-scrollbar{width:10px;height:10px}
  ::-webkit-scrollbar-thumb{background:#2a2f3d;border-radius:6px}
  ::-webkit-scrollbar-track{background:transparent}
  .empty{color:var(--muted);text-align:center;margin-top:120px}
</style>
</head>
<body>
  <aside>
    <div class="brand">
      <div class="k">AINSPIRE 4기 · 0주차</div>
      <h1>세부내용 뷰어</h1>
      <p>설치 / 실행 / 자동화 · 18개 문서</p>
    </div>
    <div class="search"><input id="q" type="text" placeholder="문서 검색…"></div>
    <nav id="nav"></nav>
  </aside>
  <main>
    <div class="topbar"><div class="num" id="topnum">–</div><h2 id="toptitle">문서를 선택하세요</h2></div>
    <div class="wrap"><div class="md" id="content"><p class="empty">왼쪽에서 문서를 선택하세요.</p></div></div>
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
    document.querySelector('main').scrollTop = 0;
    render(filtered());
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
console.log("뷰어 생성 완료:", OUT, "/ 문서", docs.length, "개");
