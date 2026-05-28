/* ════════════════════════════════════════════════════════
   디테일 편집용 주석 모드 (공통)
   사용법: 페이지에 아래 한 줄을 넣으면 ?debug=1 일 때만 활성.
     <script src="debug-annotate.js"></script>
   동작: 요소 클릭 → 메모 입력 → 번호 핀 부착 → 우측 패널 누적 → 전체 복사
   - deck(.slide 있는 페이지)이면 위치를 "슬라이드 N"으로 표시
   - 그 외 페이지면 "페이지: <title/파일명>"으로 표시
   - 수강생 화면(?debug 없음)에는 전혀 영향 없음

   모달 임베드 대응:
   - 포털(부모) ?debug=1 → 카드 클릭으로 deck을 모달 iframe(?embed=1&debug=1)으로 띄움
   - 패널은 "모달 바깥"(포털 쪽)에 하나만 둔다. deck을 가리지 않도록.
   - 모달 안 deck(자식)은 패널을 그리지 않고, 클릭/메모만 잡아 부모 패널로 전송한다.
════════════════════════════════════════════════════════ */
(function () {
  if (new URLSearchParams(location.search).get('debug') !== '1') return;

  const IN_IFRAME = window.self !== window.top;

  // 페이지 식별 라벨
  const isDeck = !!document.querySelector('.slide');
  const pageName = (document.title || location.pathname.split('/').pop() || 'page').trim();

  let active = true;          // 주석 활성/일시정지
  let counter = 0;            // 핀 번호 (자식: 부모가 부여한 번호 사용)

  // ── 공통: 요소 selector 요약 (최대 3단계) ──
  function describe(el) {
    let parts = [], cur = el;
    for (let i = 0; i < 3 && cur && cur !== document.body; i++) {
      let p = cur.tagName.toLowerCase();
      if (cur.id) p += '#' + cur.id;
      else if (cur.className && typeof cur.className === 'string') {
        const c = cur.className.trim().split(/\s+/).filter(x => !x.startsWith('dbg')).join('.');
        if (c) p += '.' + c;
      }
      parts.unshift(p);
      cur = cur.parentElement;
    }
    return parts.join(' > ');
  }

  function locationLabel() {
    if (isDeck) {
      const a = document.querySelector('.slide.active');
      return a ? ('슬라이드 ' + (parseInt(a.dataset.index) + 1)) : '슬라이드 ?';
    }
    return '페이지: ' + pageName;
  }

  // ── 핀(번호 마커) — 클릭한 프레임 위에 찍는다 ──
  const pinStyle = document.createElement('style');
  pinStyle.textContent = `
    .dbg-pin{position:absolute;z-index:99998;transform:translate(-50%,-50%);
      width:22px;height:22px;line-height:22px;text-align:center;background:#ff3b6b;color:#fff;
      border-radius:50%;font:bold 12px sans-serif;box-shadow:0 2px 6px rgba(0,0,0,.4);pointer-events:none;}
    body.dbg-on *{cursor:crosshair !important;}
    .dbg-hi{outline:2px dashed #ff3b6b !important;outline-offset:2px;}`;
  document.head.appendChild(pinStyle);

  function placePin(n, x, y) {
    const pin = document.createElement('div');
    pin.className = 'dbg-pin';
    pin.textContent = n;
    pin.style.left = x + 'px';
    pin.style.top = y + 'px';
    document.body.appendChild(pin);
  }
  function clearPins() {
    document.querySelectorAll('.dbg-pin').forEach(p => p.remove());
  }

  // ── 하이라이트 + 클릭 캡처 (모든 모드 공통) ──
  let last = null;
  document.addEventListener('mouseover', e => {
    if (!active) return;
    if (window.__dbgInPanel && window.__dbgInPanel(e.target)) return;
    if (last) last.classList.remove('dbg-hi');
    last = e.target; last.classList.add('dbg-hi');
  });

  document.addEventListener('click', e => {
    if (!active) return;
    if (window.__dbgInPanel && window.__dbgInPanel(e.target)) return;
    e.preventDefault(); e.stopPropagation();
    const el = e.target;
    const memo = prompt('수정 요청을 적어주세요:\n\n[' + el.tagName.toLowerCase() + '] '
      + (el.textContent || '').trim().slice(0, 40));
    if (memo === null || memo.trim() === '') return;
    const rec = {
      where: locationLabel(),
      selector: describe(el),
      current: (el.textContent || '').trim().slice(0, 60),
      memo: memo.trim(), x: e.pageX, y: e.pageY
    };
    handleNote(rec);
  }, true);

  document.body.classList.add('dbg-on');

  /* ════════════════ 자식(모달 iframe) 모드 ════════════════
     패널을 그리지 않는다. 클릭 메모를 부모로 보내고, 핀만 자기 화면에 찍는다.
     일시정지/초기화는 부모 패널이 제어(부모→자식 명령 수신). */
  if (IN_IFRAME) {
    function handleNote(rec) {
      // 부모가 번호를 부여하고 목록에 누적. 핀은 부모가 다시 알려주면 찍는다.
      try { window.parent.postMessage({ __dbg: 'note', rec }, '*'); } catch (err) {}
    }
    // 부모 → 자식 명령
    window.addEventListener('message', (e) => {
      const d = e.data;
      if (!d || typeof d !== 'object') return;
      if (d.__dbg === 'pin')   placePin(d.n, d.x, d.y);
      if (d.__dbg === 'pause') { active = d.value === false ? false : !active;
        document.body.classList.toggle('dbg-on', active); }
      if (d.__dbg === 'setActive') { active = !!d.value;
        document.body.classList.toggle('dbg-on', active); }
      if (d.__dbg === 'clearPins') clearPins();
    });
    // Tab 단축키 → 부모에게 토글 요청 위임
    document.addEventListener('keydown', e => {
      if (e.key === 'Tab') { e.preventDefault(); try { window.parent.postMessage({ __dbg: 'tab-toggle' }, '*'); } catch (err) {} }
    });
    // 떴다/사라진다 통지
    try { window.parent.postMessage({ __dbg: 'child-on' }, '*'); } catch (err) {}
    window.addEventListener('pagehide', () => {
      try { window.parent.postMessage({ __dbg: 'child-off' }, '*'); } catch (err) {}
    });
    return; // 자식은 여기서 끝 (패널 없음)
  }

  /* ════════════════ 부모(포털) / 단독 deck 모드 ════════════════
     패널을 화면 우측에 그린다. 자식(모달)이 떠 있으면 자식 메모를 누적,
     없으면 자기 페이지 클릭을 누적. 패널은 항상 모달 "바깥"에 위치. */
  const notes = [];
  let childActive = false;     // 모달 deck이 debug로 떠 있는지
  let childWin = null;

  const css = document.createElement('style');
  css.textContent = `
    #dbg-panel{position:fixed;top:0;right:0;width:340px;height:100vh;z-index:2147483647;
      background:#15101f;color:#eee;font:13px/1.5 'Malgun Gothic',sans-serif;
      box-shadow:-4px 0 24px rgba(0,0,0,.4);display:flex;flex-direction:column;}
    #dbg-panel h4{margin:0;padding:14px 16px;background:#6020ff;color:#fff;font-size:14px;}
    #dbg-hint{padding:10px 16px;font-size:12px;color:#bba4ff;border-bottom:1px solid #2a2340;}
    #dbg-list{flex:1;overflow:auto;padding:8px 12px;}
    .dbg-item{background:#1f1830;border:1px solid #2a2340;border-radius:8px;padding:10px;margin-bottom:8px;}
    .dbg-item .num{display:inline-block;min-width:20px;height:20px;line-height:20px;text-align:center;
      background:#ff3b6b;color:#fff;border-radius:50%;font-weight:700;margin-right:6px;font-size:11px;}
    .dbg-item .meta{font-size:11px;color:#9a8fb5;word-break:break-all;margin-top:3px;}
    .dbg-item .memo{margin-top:5px;color:#fff;}
    #dbg-actions{display:flex;gap:8px;padding:12px;border-top:1px solid #2a2340;}
    #dbg-actions button{flex:1;padding:9px;border:0;border-radius:6px;cursor:pointer;font-weight:700;
      font:12px 'Malgun Gothic',sans-serif;}
    #dbg-copy{background:#6020ff;color:#fff;}
    #dbg-clear{background:#2a2340;color:#cbb9ff;}
    #dbg-toggle{position:fixed;bottom:16px;right:356px;z-index:2147483647;padding:8px 12px;
      background:#6020ff;color:#fff;border:0;border-radius:6px;cursor:pointer;font-weight:700;
      font:12px 'Malgun Gothic',sans-serif;box-shadow:0 2px 8px rgba(0,0,0,.4);}`;
  document.head.appendChild(css);

  const panel = document.createElement('div');
  panel.id = 'dbg-panel';
  panel.innerHTML = `
    <h4>주석 모드 · 클릭해서 메모</h4>
    <div id="dbg-hint">요소를 클릭하면 메모를 남길 수 있습니다.<br>다 적은 뒤 "전체 복사"를 눌러 전달하세요.<br><b>일시정지</b>를 누르면 평소처럼 클릭/조작이 됩니다.</div>
    <div id="dbg-list"></div>
    <div id="dbg-actions">
      <button id="dbg-copy">전체 복사</button>
      <button id="dbg-clear">초기화</button>
    </div>`;
  document.body.appendChild(panel);

  const toggle = document.createElement('button');
  toggle.id = 'dbg-toggle';
  toggle.textContent = '주석 일시정지';
  document.body.appendChild(toggle);

  // 패널 영역 클릭은 주석으로 잡지 않게 (부모 자기 페이지 클릭 처리용)
  window.__dbgInPanel = (el) => panel.contains(el) || el === toggle;

  function doToggle() {
    active = !active;
    toggle.textContent = active ? '주석 일시정지' : '주석 재개';
    document.body.classList.toggle('dbg-on', active);
    if (childActive && childWin) childWin.postMessage({ __dbg: 'setActive', value: active }, '*');
  }

  toggle.addEventListener('click', doToggle);

  // Tab 단축키 — 부모 페이지 직접 누를 때
  document.addEventListener('keydown', e => {
    if (e.key === 'Tab') { e.preventDefault(); doToggle(); }
  });

  function addNote(rec) {
    counter++;
    rec.n = counter;
    notes.push(rec);
    renderList();
    if (rec.fromChild && childWin) {
      // 핀은 자식 화면에 찍는다
      childWin.postMessage({ __dbg: 'pin', n: rec.n, x: rec.x, y: rec.y }, '*');
    } else {
      placePin(rec.n, rec.x, rec.y);
    }
  }

  // 부모 자기 페이지에서 클릭했을 때
  function handleNote(rec) {
    if (childActive) return; // 모달이 떠 있으면 부모 페이지 클릭은 무시(주석 대상은 deck)
    addNote(rec);
  }

  // 자식(모달 deck) 메시지 수신
  window.addEventListener('message', (e) => {
    const d = e.data;
    if (!d || typeof d !== 'object') return;
    if (d.__dbg === 'child-on')  { childActive = true;  childWin = e.source;
      // 부모 페이지 자체 하이라이트/크로스헤어는 끄되 패널은 유지
      document.body.classList.remove('dbg-on');
      if (childWin) childWin.postMessage({ __dbg: 'setActive', value: active }, '*'); }
    if (d.__dbg === 'child-off') { childActive = false; childWin = null;
      document.body.classList.toggle('dbg-on', active); }
    if (d.__dbg === 'note')      { const rec = d.rec; rec.fromChild = true; addNote(rec); }
    if (d.__dbg === 'tab-toggle') doToggle();
  });

  function renderList() {
    document.getElementById('dbg-list').innerHTML = notes.map(r => `
      <div class="dbg-item">
        <div><span class="num">${r.n}</span><b>${r.where}</b></div>
        <div class="meta">${r.selector}</div>
        ${r.current ? `<div class="meta">현재: "${r.current}"</div>` : ''}
        <div class="memo">→ ${r.memo}</div>
      </div>`).join('');
    const list = document.getElementById('dbg-list');
    list.scrollTop = list.scrollHeight;
  }

  document.getElementById('dbg-copy').addEventListener('click', () => {
    if (!notes.length) { alert('메모가 없습니다.'); return; }
    const text = notes.map(r =>
      `[${r.n}] ${r.where} | ${r.selector}\n`
      + (r.current ? `   현재: "${r.current}"\n` : '')
      + `   요청: ${r.memo}`
    ).join('\n\n');
    navigator.clipboard.writeText(text).then(
      () => alert('복사됐습니다. 채팅에 붙여넣어 전달하세요.'),
      () => prompt('아래 내용을 복사하세요:', text)
    );
  });

  document.getElementById('dbg-clear').addEventListener('click', () => {
    if (!confirm('메모를 모두 지울까요?')) return;
    notes.length = 0; counter = 0;
    clearPins();
    if (childActive && childWin) childWin.postMessage({ __dbg: 'clearPins' }, '*');
    renderList();
  });
})();
