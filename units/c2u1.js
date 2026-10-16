// 과정 2 · 단원 1 · Document Parse로 수업자료 읽히기
(function () {
  function src(a) { return a.join('\n'); }

  /* ---------- 그림 도우미 ---------- */
  // 창 틀(위 막대 + 점 세 개)
  function win(P, x, y, w, h) {
    P.rrect(x, y, w, h, 10, { fill: 'paper', fs: 'solid' });
    P.line(x, y + 22, x + w, y + 22, { w: 1.5 });
    P.circle(x + 12, y + 11, 7, { fill: 'bad', fs: 'solid', c: null });
    P.circle(x + 24, y + 11, 7, { fill: 'hi', fs: 'solid', c: null });
    P.circle(x + 36, y + 11, 7, { fill: 'good', fs: 'solid', c: null });
  }
  // 콘솔 창: 왼쪽 메뉴 칸(on번째 줄이 강조). 메뉴와 본문 경계 x를 돌려준다
  function consoleWin(P, x, y, w, h, on) {
    win(P, x, y, w, h);
    const a = x + Math.round(w * 0.32);
    P.line(a, y + 22, a, y + h, { w: 1.3 });
    const n = Math.max(3, Math.min(6, Math.floor((h - 34) / 14)));
    for (let i = 0; i < n; i++) {
      const sub = i === 2 || i === 3 ? 8 : 0;
      P.line(x + 8 + sub, y + 36 + i * 14, a - 8 - (i % 2) * 6, y + 36 + i * 14, { c: i === on ? 'accent' : 'soft', w: 3 });
    }
    return a;
  }
  // 학습지 한 쪽(머리말·제목·목록·표·순서도·꼬리말). show: true 또는 ['table'] → 요소 테두리. 칸 위치를 돌려준다
  function sheet(P, x, y, w, h, show) {
    P.rect(x, y, w, h, { fill: 'paper', fs: 'solid', w: 1.8 });
    const L = x + w * 0.1, cw = w * 0.8;
    const R = {
      header: [L, y + h * 0.03, cw * 0.55, h * 0.07],
      heading1: [L, y + h * 0.13, cw, h * 0.08],
      list: [L, y + h * 0.25, cw, h * 0.13],
      table: [L, y + h * 0.42, cw, h * 0.2],
      figure: [L + cw * 0.1, y + h * 0.66, cw * 0.8, h * 0.18],
      footer: [x + w * 0.42, y + h * 0.89, w * 0.16, h * 0.07]
    };
    const hd = R.header, t1 = R.heading1, ls = R.list, tb = R.table, fg = R.figure, ft = R.footer;
    P.line(hd[0] + 2, hd[1] + hd[3] / 2, hd[0] + hd[2] - 2, hd[1] + hd[3] / 2, { c: 'soft', w: 2 });
    P.line(t1[0] + 2, t1[1] + t1[3] / 2, t1[0] + t1[2] - 2, t1[1] + t1[3] / 2, { c: 'ink', w: 4 });
    for (let i = 0; i < 2; i++) {
      const yy = ls[1] + ls[3] * (0.3 + 0.4 * i);
      P.circle(ls[0] + 5, yy, 4, { fill: 'ink2', fs: 'solid', c: null });
      P.line(ls[0] + 12, yy, ls[0] + ls[2] * (0.85 - 0.15 * i), yy, { c: 'ink2', w: 2 });
    }
    const tw = tb[2] - 4, th = tb[3] - 4;
    P.rect(tb[0] + 2, tb[1] + 2, tw, th / 2, { fill: 'sky', fs: 'solid', c: null });
    P.rect(tb[0] + 2, tb[1] + 2, tw, th, { w: 1.4 });
    P.line(tb[0] + 2, tb[1] + 2 + th / 2, tb[0] + 2 + tw, tb[1] + 2 + th / 2, { w: 1.2 });
    P.line(tb[0] + 2 + tw / 3, tb[1] + 2, tb[0] + 2 + tw / 3, tb[1] + 2 + th, { w: 1.2 });
    P.line(tb[0] + 2 + tw * 2 / 3, tb[1] + 2, tb[0] + 2 + tw * 2 / 3, tb[1] + 2 + th, { w: 1.2 });
    const bw = fg[2] * 0.22, bh = fg[3] * 0.5, cy = fg[1] + fg[3] / 2;
    P.rrect(fg[0] + 2, cy - bh / 2, bw, bh, bh / 2, { w: 1.3 });
    P.arrow(fg[0] + 4 + bw, cy, fg[0] + fg[2] / 2 - bw / 2 - 2, cy, { w: 1.2, head: 4 });
    P.rect(fg[0] + fg[2] / 2 - bw / 2, cy - bh / 2, bw, bh, { w: 1.3 });
    P.arrow(fg[0] + fg[2] / 2 + bw / 2 + 2, cy, fg[0] + fg[2] - bw - 4, cy, { w: 1.2, head: 4 });
    P.rrect(fg[0] + fg[2] - 2 - bw, cy - bh / 2, bw, bh, bh / 2, { w: 1.3 });
    P.line(ft[0] + 2, ft[1] + ft[3] / 2, ft[0] + ft[2] - 2, ft[1] + ft[3] / 2, { c: 'soft', w: 2 });
    if (show) {
      const col = { header: 'warm', heading1: 'accent', list: 'good', table: 'k', figure: 'pink', footer: 'warm' };
      Object.keys(R).forEach(k => {
        if (show === true || show.includes(k)) { const r = R[k]; P.rrect(r[0] - 2, r[1] - 1, r[2] + 4, r[3] + 2, 3, { c: col[k], w: 1.8 }); }
      });
    }
    return R;
  }
  // 사람(어깨 + 머리 + 얼굴). bottom = 어깨 아래 끝
  function person(P, cx, bottom, mood, s) {
    s = s || 1;
    P.path(`M${cx - 40 * s} ${bottom} Q${cx} ${bottom - 64 * s} ${cx + 40 * s} ${bottom}`, { fill: 'sky', gap: 6 });
    P.circle(cx, bottom - 90 * s, 62 * s, { fill: 'paper' });
    P.face(cx, bottom - 88 * s, 50 * s, { mood: mood || 'smile' });
  }
  // 파일 쪽지(이름 + 얼굴)
  function file(P, x, y, w, h, name, mood, fill, size) {
    P.note(x, y, w, h, { fill: fill || 'paper' });
    if (name) P.text(x + w / 2, y + 24, name, { mono: true, size: size || 12, weight: 700 });
    if (mood) P.face(x + w / 2, y + h * 0.66, Math.min(w, h) * 0.4, { mood });
  }
  // 폴더(탭 달린 모양)
  function folder(P, x, y, w, h, fill) {
    P.path(`M${x} ${y + 10} L${x} ${y + h} L${x + w} ${y + h} L${x + w} ${y + 10} L${x + w * 0.45} ${y + 10} L${x + w * 0.38} ${y} L${x} ${y} Z`, { fill: fill || 'hi', gap: 7 });
  }
  // 노트북
  function laptop(P, x, y, w, h, fill) {
    P.rrect(x, y, w, h, 8, { fill: fill || 'paper', w: 2 });
    P.path(`M${x - 6} ${y + h} L${x + w + 6} ${y + h} L${x + w + 12} ${y + h + 12} L${x - 12} ${y + h + 12} Z`, { fill: 'soft', gap: 5 });
  }
  // 글자가 든 단추
  function chip(P, x, y, w, h, label, fill, size) {
    P.rrect(x, y, w, h, 8, { fill: fill || 'paper', gap: 5, w: 1.6 });
    P.text(x + w / 2, y + h / 2 + (size || 13) * 0.36, label, { size: size || 13, weight: 700 });
  }
  // 어두운 터미널 상자
  function term(P, x, y, w, h, lines, size) {
    const s = size || 11;
    P.rrect(x, y, w, h, 8, { fill: 'ink', fs: 'solid' });
    (lines || []).forEach((t, i) => P.text(x + 10, y + 20 + i * (s + 7), t, { mono: true, size: s, anchor: 'start', c: 'paper' }));
  }
  // 서버 상자(업스테이지 API 쪽)
  function server(P, x, y, w, h, label, size) {
    P.rrect(x, y, w, h, 10, { fill: 'sky', gap: 6 });
    for (let i = 0; i < 2; i++) {
      P.line(x + 12, y + 16 + i * 14, x + w - 26, y + 16 + i * 14, { c: 'ink2', w: 2 });
      P.circle(x + w - 16, y + 16 + i * 14, 6, { fill: 'good', fs: 'solid', c: null });
    }
    if (label) P.text(x + w / 2, y + h - 12, label, { size: size || 11, weight: 700 });
  }
  // 동전
  function coin(P, cx, cy, d) {
    P.circle(cx, cy, d, { fill: 'hi', fs: 'solid', w: 1.8 });
    P.text(cx, cy + d * 0.16, '$', { size: Math.round(d * 0.45), weight: 700 });
  }
  // 쪽이 겹친 두꺼운 문서
  function book(P, x, y, w, h, label) {
    P.rect(x + 8, y - 8, w, h, { fill: 'paper', fs: 'solid', w: 1.4 });
    P.rect(x + 4, y - 4, w, h, { fill: 'paper', fs: 'solid', w: 1.4 });
    P.rect(x, y, w, h, { fill: 'paper', fs: 'solid', w: 1.8 });
    if (label) P.text(x + w / 2, y + h / 2 + 6, label, { size: 16, weight: 700 });
  }
  // 손잡이(돌리는 다이얼)
  function knob(P, cx, cy, d, deg) {
    P.circle(cx, cy, d, { fill: 'paper', w: 2 });
    const r = d * 0.36, a = deg * Math.PI / 180;
    P.line(cx, cy, cx + r * Math.cos(a), cy + r * Math.sin(a), { c: 'accent', w: 3 });
    P.circle(cx, cy, 8, { fill: 'ink', fs: 'solid', c: null });
  }
  // 가위
  function scissors(P, cx, cy) {
    P.circle(cx - 8, cy + 14, 14, { w: 2 });
    P.circle(cx + 8, cy + 14, 14, { w: 2 });
    P.line(cx - 4, cy + 8, cx + 10, cy - 18, { w: 2.4 });
    P.line(cx + 4, cy + 8, cx - 10, cy - 18, { w: 2.4 });
  }
  // 돋보기
  function lens(P, cx, cy, d) {
    P.circle(cx, cy, d, { fill: 'sky', gap: 5, w: 2.4 });
    P.line(cx + d * 0.36, cy + d * 0.36, cx + d * 0.62, cy + d * 0.66, { w: 4 });
  }
  // 코드 상자를 돋보기로 살피는 얼굴(줄 고르기 문제용)
  function codeLook(P, n, mood) {
    P.rrect(14, 20, 190, 150, 10, { fill: 'ink', fs: 'solid' });
    for (let i = 0; i < n; i++) P.line(30 + (i % 3 === 2 ? 14 : 0), 44 + i * 22, 140 + ((i * 37) % 44), 44 + i * 22, { c: ['k', 's', 'n', 't'][i % 4], w: 3 });
    lens(P, 176, 122, 56);
    person(P, 290, 196, mood || 'wow', 0.7);
  }
  function card(P, x, y) { P.rrect(x, y, 92, 70, 10, { fill: 'paper' }); }
  function cross(P, cx, cy, r, c) {
    P.line(cx - r, cy - r, cx + r, cy + r, { c: c || 'bad', w: 3 });
    P.line(cx + r, cy - r, cx - r, cy + r, { c: c || 'bad', w: 3 });
  }
  function ask(P, x, y, size, c) { P.text(x, y, '?', { size: size || 22, weight: 700, c: c || 'warm' }); }
  // 흩어진 카드 넷 + 로봇(순서 문제용). draws[i](x, y)가 카드 안을 그린다
  function shuffled(P, draws, mood) {
    [[14, 16], [126, 58], [238, 14], [56, 116]].forEach((xy, i) => { card(P, xy[0], xy[1]); if (draws[i]) draws[i](xy[0], xy[1]); });
    P.robot(270, 146, 0.5, { mood: mood || 'wow' });
    ask(P, 116, 40, 22, 'warm');
    ask(P, 226, 112, 22, 'bad');
    ask(P, 30, 110, 20, 'accent');
  }

  /* ---------- 모의 화면에서 되풀이하는 조각 ---------- */
  const NAV = ['Home', 'Playground', { name: 'Chat', sub: true }, { name: 'Document Parse', sub: true }, 'API keys', 'Billing'];
  const DOCS = ['3단원_학습지.pdf', '수행평가_안내.hwp'];
  const H_DP = { k: 'h', text: 'Document Parse' };
  const FILES_ON = { k: 'files', id: 'doc', items: DOCS, on: '3단원_학습지.pdf' };
  const SHEET_ELS = [
    { cat: 'header', text: '한입고등학교 정보과' },
    { cat: 'heading1', text: '3단원 알고리즘과 프로그래밍 학습지' },
    { cat: 'list', items: ['문제를 입력·처리·출력으로 나눌 수 있다', '순서도로 알고리즘을 나타낼 수 있다'] },
    { cat: 'paragraph', text: '두 수를 입력받아 합을 출력하는 과정을 표로 정리해 봐요.' },
    { cat: 'table', rows: [['입력', '처리', '출력'], ['두 수', '더하기', '합']] },
    { cat: 'figure', text: '[순서도 그림]' },
    { cat: 'caption', text: '[그림 1] 두 수의 합 순서도' },
    { cat: 'footer', text: '- 1 -' }
  ];
  function pg(on) {
    return { k: 'page', label: '3단원_학습지.pdf · 1쪽', show: true, pick: true,
      els: SHEET_ELS.map((e, i) => (i + 1 === on ? Object.assign({}, e, { on: true }) : e)) };
  }
  const TABLE_HTML = src(['<table>', '  <tr><td>입력</td><td>처리</td><td>출력</td></tr>', '  <tr><td>두 수</td><td>더하기</td><td>합</td></tr>', '</table>']);
  const TABLE_MD = src(['| 입력 | 처리 | 출력 |', '| --- | --- | --- |', '| 두 수 | 더하기 | 합 |']);
  const PARA = '두 수를 입력받아 합을 출력하는 과정을 표로 정리해 봐요.';

  const LAB = ['.venv/', '.env', '.gitignore', 'hello_solar.py', 'parse.py', 'unit3.pdf'];
  const HELLO = src(['import os', 'from dotenv import load_dotenv', 'from openai import OpenAI', '', 'load_dotenv()', 'client = OpenAI(', '    api_key=os.environ["UPSTAGE_API_KEY"],', '    base_url="https://api.upstage.ai/v1",', ')', 'MODEL = "solar-pro4"']);
  const PARSE_PY = src(['import os, requests', 'from dotenv import load_dotenv', '', 'load_dotenv()', 'KEY = os.environ["UPSTAGE_API_KEY"]', 'URL = ("https://api.upstage.ai"', '       "/v1/document-digitization")', `FMT = '["markdown"]'`, 'opts = {"model": "document-parse",', '        "output_formats": FMT}', 'with open("unit3.pdf", "rb") as f:', '    r = requests.post(URL,', '        headers={"Authorization":', '                 f"Bearer {KEY}"},', '        files={"document": f},', '        data=opts)', 'r.raise_for_status()', 'data = r.json()', 'print("쪽수:", data["usage"]["pages"])', 'for e in data["elements"][:5]:', '    print(e["page"], e["category"])']);

  const PROMPT_PARSE = src([
    'upstage-lab 폴더에 parse.py를 만들어 줘.',
    '맥락: 업스테이지 Document Parse로 내 수업자료(PDF)를 Markdown으로 바꾸려고 해. 공식 문서: https://console.upstage.ai/docs/capabilities/parse/document-parsing',
    '조건:',
    `1) requests로 https://api.upstage.ai/v1/document-digitization 에 POST해. files의 document에 파일, data에 model="document-parse", output_formats='["markdown"]'.`,
    '2) 키는 .env의 UPSTAGE_API_KEY를 python-dotenv로 읽어. 키를 print하거나 파일에 쓰지 마.',
    '3) 파일 이름은 명령줄 인자로 받아(python parse.py unit3.pdf). --ocr force를 붙이면 data에 ocr="force"를 더해.',
    '4) r.raise_for_status() 뒤 응답 JSON 전체를 data/<원래 이름>.json에 utf-8로 저장하고, usage.pages와 앞 5개 요소의 page·category를 출력해.',
    '5) 새 패키지는 깔지 말고 AGENTS.md 규칙을 따라.',
    '확인 방법: 실행은 내가 직접 할 테니 실행 명령만 알려 줘. 2쪽짜리 PDF로 쪽수와 category가 찍히는지 볼게.'
  ]);
  const PROMPT_CLEAN = src([
    'upstage-lab에 clean.py를 만들어 줘.',
    '맥락: data/unit3.json에 Document Parse 응답 전체가 저장돼 있어. API는 다시 부르지 말고 이 파일만 읽어서 다듬고 싶어.',
    '조건:',
    '1) elements에서 category가 header·footer인 요소를 빼.',
    '2) 요소의 page가 바뀔 때마다 "[3쪽]" 같은 줄을 넣고, 각 요소의 content.markdown을 빈 줄 하나로 이어.',
    '3) data/unit3.md에 encoding="utf-8"로 저장하고, 뺀 요소 수·남은 요소 수·표(table) 수를 출력해.',
    '4) 파일 이름은 명령줄 인자로 받아(python clean.py data/unit3.json). 새 패키지는 깔지 마.',
    '확인 방법: 실행 뒤 unit3.md에서 학교 이름(머리말 글자)을 검색해 0개인지, [1쪽] 같은 쪽 표시가 들어갔는지 내가 볼게.'
  ]);

  HANIP.unit({
    id: 'c2u1',
    course: '과정 2 · 수업자료를 데이터로',
    title: '단원 1 · Document Parse로 수업자료 읽히기',
    goals: ['수업자료를 왜 파싱해야 하는지 설명하기', 'Playground와 parse.py로 문서를 요소·Markdown으로 바꾸기', 'elements를 다듬어 쪽 표시 달린 Markdown으로 저장하기'],
    checked: { date: '2026-10-16' },
    sources: [
      'https://console.upstage.ai/docs/capabilities/parse/document-parsing',
      'https://console.upstage.ai/api/parse/document-parsing',
      'https://console.upstage.ai/api/parse/document-parsing/async',
      'https://console.upstage.ai/docs/getting-started',
      'https://console.upstage.ai/docs/models/history',
      'https://console.upstage.ai/docs/resources/error-codes',
      'https://www.upstage.ai/pricing/api',
      'https://github.com/UpstageAI/upstage-extensions-hub'
    ],

    figs: {
      /* ---------- L1 설명 그림 ---------- */
      pdfCopy: { w: 340, h: 200, label: 'PDF 학습지의 표를 복사해 붙였더니 글자가 한 줄로 뭉개진 모습', draw(P) {
        sheet(P, 14, 14, 110, 150, null);
        P.text(69, 188, 'PDF 학습지', { size: 13, weight: 700 });
        P.arrow(132, 88, 186, 88, { c: 'accent', w: 2.4, head: 9 });
        P.text(159, 76, '복사', { size: 12, c: 'accent' });
        P.note(194, 26, 134, 112, { fill: 'hi' });
        P.text(204, 52, '입력 처리 출력', { size: 12, anchor: 'start' });
        P.text(204, 74, '두 수 더하기 합', { size: 12, anchor: 'start' });
        P.text(204, 96, '- 1 - 한입고', { size: 12, anchor: 'start', c: 'bad' });
        P.text(204, 118, '3단원 알고...', { size: 12, anchor: 'start' });
        P.face(306, 168, 34, { mood: 'dizzy' });
        P.text(236, 190, '표가 사라졌어요', { size: 12, c: 'ink2' });
      }},
      structured: { w: 340, h: 200, label: 'Markdown 표로 적힌 글을 로봇이 칸의 짝까지 읽는 모습', draw(P) {
        P.rrect(14, 24, 196, 124, 8, { fill: 'ink', fs: 'solid' });
        P.text(26, 50, '# 3단원 학습지', { mono: true, size: 12, anchor: 'start', c: 'paper' });
        P.text(26, 76, '| 입력 | 처리 | 출력 |', { mono: true, size: 12, anchor: 'start', c: 'paper' });
        P.text(26, 100, '| --- | --- | --- |', { mono: true, size: 12, anchor: 'start', c: 'paper' });
        P.text(26, 124, '| 두 수 | 더하기 | 합 |', { mono: true, size: 12, anchor: 'start', c: 'paper' });
        P.robot(276, 80, 0.5, { mood: 'happy' });
        P.text(276, 160, '짝이 보여요', { size: 13, weight: 700, c: 'good' });
        P.text(112, 180, '제목은 #, 표는 | 줄', { size: 13, c: 'accent' });
        P.sparkle(322, 30, 6, 'hi');
      }},
      parseFlow: { w: 340, h: 204, label: 'PDF와 HWP 문서가 Document Parse를 거쳐 요소와 HTML·Markdown·text로 나오는 길', draw(P) {
        file(P, 10, 16, 54, 64, 'PDF', null, 'paper', 12);
        file(P, 10, 92, 54, 64, 'HWP', null, 'hi', 12);
        P.arrow(68, 52, 108, 82, { c: 'accent', w: 2, head: 7 });
        P.arrow(68, 124, 108, 100, { c: 'accent', w: 2, head: 7 });
        server(P, 112, 54, 104, 70, 'Document Parse', 10);
        P.arrow(222, 89, 250, 89, { c: 'accent', w: 2.2, head: 8 });
        chip(P, 256, 14, 76, 26, 'heading1', 'paper', 11);
        chip(P, 256, 48, 76, 26, 'table', 'sky', 11);
        chip(P, 256, 82, 76, 26, 'figure', 'pink', 11);
        chip(P, 256, 116, 76, 26, '…', 'paper', 11);
        P.text(170, 170, 'HTML · Markdown · text', { size: 13, weight: 700, c: 'accent' });
        P.text(170, 194, '요소로 나눠 읽는 순서대로', { size: 12, c: 'ink2' });
      }},
      journey: { w: 340, h: 200, label: '학습지가 파싱을 거쳐 추출과 검색으로, 다시 보조 에이전트로 이어지는 단원 지도', draw(P) {
        file(P, 8, 58, 50, 62, null, 'smile', 'paper');
        P.text(33, 140, '학습지', { size: 12, weight: 700 });
        P.arrow(62, 90, 84, 90, { c: 'accent', w: 2, head: 7 });
        chip(P, 88, 74, 74, 32, 'c2u1 파싱', 'hi', 12);
        P.arrow(166, 82, 188, 52, { c: 'accent', w: 2, head: 7 });
        P.arrow(166, 98, 188, 128, { c: 'accent', w: 2, head: 7 });
        chip(P, 192, 28, 76, 32, 'c2u2 추출', 'sky', 12);
        chip(P, 192, 116, 76, 32, 'c2u3 검색', 'good', 12);
        P.arrow(272, 46, 294, 76, { c: 'accent', w: 2, head: 7 });
        P.arrow(272, 130, 294, 104, { c: 'accent', w: 2, head: 7 });
        P.robot(314, 90, 0.3, { mood: 'happy' });
        P.text(314, 128, 'c3u1', { size: 11, weight: 700 });
        P.text(170, 184, '첫 단추가 끝까지 가요', { size: 13, c: 'accent' });
      }},

      /* ---------- L1 문제 그림 ---------- */
      q_twoCol: { w: 340, h: 200, label: '2단 교과서 쪽과 뒤엉킨 읽기 순서 화살표 앞에서 놀란 얼굴', draw(P) {
        P.rect(14, 14, 170, 156, { fill: 'paper', fs: 'solid', w: 1.8 });
        for (let i = 0; i < 6; i++) {
          P.line(24, 34 + i * 22, 90, 34 + i * 22, { c: 'ink2', w: 2 });
          P.line(108, 34 + i * 22, 174, 34 + i * 22, { c: 'ink2', w: 2 });
        }
        P.line(99, 24, 99, 160, { c: 'soft', w: 1 });
        P.curveArrow(40, 40, 100, 24, 150, 48, { c: 'bad', w: 2 });
        P.curveArrow(150, 72, 100, 96, 44, 80, { c: 'bad', w: 2 });
        person(P, 270, 196, 'wow', 0.75);
        ask(P, 270, 64, 26);
        P.text(99, 192, '붙였더니 뒤섞였어요', { size: 12, c: 'ink2' });
      }},
      q_tableLLM: { w: 340, h: 200, label: '한 줄로 뭉개진 표 글을 받은 로봇이 어느 칸인지 헷갈려하는 모습', draw(P) {
        P.rrect(14, 24, 184, 40, 8, { fill: 'hi', gap: 6 });
        P.text(106, 50, '입력 처리 출력 두 수 더하기 합', { size: 11 });
        P.arrow(200, 46, 226, 84, { c: 'accent', w: 2, head: 7 });
        P.robot(262, 116, 0.55, { mood: 'dizzy' });
        ask(P, 262, 70, 24);
        P.rrect(24, 98, 166, 72, 8, { c: 'soft', w: 1.6 });
        P.text(107, 126, '두 수 → 어느 칸?', { size: 13 });
        P.text(107, 154, '합 → 어느 칸?', { size: 13 });
        P.text(170, 194, '이대로 Solar에게 주면?', { size: 12, c: 'ink2' });
      }},
      q_journey: { w: 340, h: 200, label: '뒤섞인 카드: 체, 쪽지, 말풍선, 문서 쪽', draw(P) {
        shuffled(P, [
          (x, y) => { P.path(`M${x + 16} ${y + 22} L${x + 76} ${y + 22} L${x + 62} ${y + 50} L${x + 30} ${y + 50} Z`, { fill: 'soft', gap: 4 }); },
          (x, y) => { P.bubble(x + 12, y + 10, 66, 32, x + 26, y + 58); },
          (x, y) => { P.rect(x + 30, y + 10, 34, 50, { fill: 'paper', fs: 'solid', w: 1.4 }); P.line(x + 36, y + 22, x + 58, y + 22, { w: 3 }); P.rect(x + 36, y + 32, 22, 14, { fill: 'sky', fs: 'solid', w: 1 }); },
          (x, y) => { for (let i = 0; i < 3; i++) P.rrect(x + 14 + i * 22, y + 20, 18, 30, 4, { fill: ['hi', 'good', 'pink'][i], gap: 4, w: 1.2 }); }
        ]);
      }},
      q_fmtBlank: { w: 340, h: 200, label: '학습지에서 두 갈래 길이 로봇과 웹 창으로 가고, 로봇 쪽 이름표가 비어 있는 모습', draw(P) {
        file(P, 14, 60, 70, 80, '학습지', null, 'paper', 12);
        P.arrow(90, 88, 150, 54, { c: 'accent', w: 2.2, head: 8 });
        P.arrow(90, 114, 150, 146, { c: 'accent', w: 2.2, head: 8 });
        P.robot(188, 50, 0.38, { mood: 'happy' });
        P.rrect(228, 30, 98, 36, 8, { c: 'warm', w: 2 });
        ask(P, 277, 56, 22);
        win(P, 156, 114, 106, 74);
        P.line(166, 150, 250, 150, { c: 'soft', w: 3 });
        P.line(166, 166, 230, 166, { c: 'soft', w: 3 });
        chip(P, 270, 134, 58, 30, 'html', 'sky', 13);
      }},

      /* ---------- L2 설명 그림 ---------- */
      consoleNav: { w: 340, h: 210, label: '콘솔 왼쪽 메뉴에서 Playground 아래 Document Parse를 고른 모습', draw(P) {
        win(P, 10, 10, 320, 166);
        P.text(56, 26, 'console.upstage.ai', { mono: true, size: 9, anchor: 'start', c: 'ink2' });
        P.line(122, 32, 122, 176, { w: 1.3 });
        P.text(20, 52, 'Home', { size: 11, anchor: 'start' });
        P.text(20, 72, 'Playground', { size: 11, anchor: 'start' });
        P.text(30, 92, 'Chat', { size: 10, anchor: 'start', c: 'ink2' });
        P.rrect(24, 100, 94, 18, 4, { fill: 'hi', gap: 4, w: 1.2 });
        P.text(30, 113, 'Document Parse', { size: 10, anchor: 'start', weight: 700 });
        P.text(20, 138, 'API keys', { size: 11, anchor: 'start' });
        P.text(20, 158, 'Billing', { size: 11, anchor: 'start' });
        P.rrect(138, 44, 178, 84, 8, { c: 'soft', w: 1.6 });
        file(P, 204, 52, 46, 60, 'PDF', null, 'paper', 11);
        P.text(196, 156, '키 없이 체험', { size: 13, weight: 700, c: 'accent' });
        P.face(290, 152, 30, { mood: 'happy' });
        P.text(170, 200, '화면 모양은 바뀔 수 있어요', { size: 12, c: 'ink2' });
      }},
      highlightFig: { w: 340, h: 210, label: '학습지 쪽 위 요소마다 색 테두리와 category 이름표가 붙은 모습', draw(P) {
        const R = sheet(P, 20, 10, 150, 190, true);
        const lab = [['header', 'warm'], ['heading1', 'accent'], ['list', 'good'], ['table', 'k'], ['figure', 'pink'], ['footer', 'warm']];
        lab.forEach(([k, c]) => {
          const r = R[k], cy = r[1] + r[3] / 2;
          P.line(r[0] + r[2] + 3, cy, 192, cy, { c: 'soft', w: 1.2 });
          P.text(196, cy + 4, k, { mono: true, size: 11, anchor: 'start', weight: 700, c });
        });
        P.face(292, 150, 34, { mood: 'happy' });
        P.text(286, 196, '이름표 = category', { size: 11, c: 'ink2' });
      }},
      checkFour: { w: 340, h: 200, label: '표, 읽는 순서, 머리말, 그림 네 곳을 돋보기로 살피는 모습', draw(P) {
        sheet(P, 20, 12, 130, 176, ['table', 'header', 'footer', 'figure']);
        lens(P, 200, 90, 70);
        chip(P, 246, 20, 84, 28, '표', 'sky', 12);
        chip(P, 246, 56, 84, 28, '읽는 순서', 'hi', 12);
        chip(P, 246, 92, 84, 28, '머리말', 'warm', 12);
        chip(P, 246, 128, 84, 28, '그림', 'pink', 12);
        P.text(250, 186, '먼저 눈으로 확인', { size: 12, c: 'accent' });
      }},

      /* ---------- L2 문제 그림 ---------- */
      q_noKey: { w: 340, h: 200, label: '열쇠가 없는 선생님 옆의 콘솔 창', draw(P) {
        consoleWin(P, 14, 14, 190, 140, 3);
        P.circle(236, 46, 26, { fill: 'hi', fs: 'solid', w: 2 });
        P.line(249, 46, 284, 46, { w: 3 });
        P.line(276, 46, 276, 56, { w: 3 });
        cross(P, 260, 46, 14, 'bad');
        person(P, 280, 196, 'wow', 0.7);
        P.text(109, 186, '결과부터 보고 싶어요', { size: 12, c: 'ink2' });
      }},
      q_headerTag: { w: 340, h: 200, label: '쪽 맨 위 테두리에 header 이름표가 붙은 학습지와 고민하는 얼굴', draw(P) {
        const R = sheet(P, 20, 10, 140, 180, ['header']);
        const r = R.header;
        P.text(r[0] + r[2] + 8, r[1] + r[3] / 2 + 4, 'header', { mono: true, size: 11, anchor: 'start', weight: 700, c: 'warm' });
        person(P, 270, 196, 'wow', 0.75);
        ask(P, 270, 64, 26);
      }},
      q_privacy: { w: 340, h: 200, label: '이름과 점수가 적힌 채점표를 콘솔에 올리려다 멈칫하는 모습', draw(P) {
        P.rect(14, 20, 150, 150, { fill: 'paper', fs: 'solid', w: 1.8 });
        P.text(89, 44, '수행평가 채점표', { size: 12, weight: 700 });
        for (let i = 0; i < 4; i++) {
          P.text(30, 74 + i * 24, '김○○', { size: 12, anchor: 'start' });
          P.text(146, 74 + i * 24, String(95 - i * 5), { size: 12, anchor: 'end' });
        }
        P.arrow(172, 100, 222, 100, { c: 'soft', w: 2.4, head: 9 });
        ask(P, 196, 88, 22);
        consoleWin(P, 228, 52, 102, 92, 3);
        P.face(279, 174, 30, { mood: 'wow' });
        P.text(89, 192, '이걸로 시험해도 될까?', { size: 12, c: 'ink2' });
      }},
      q_pgOrder: { w: 340, h: 200, label: '뒤섞인 카드: 메뉴 목록, 파일 쪽지, 색 테두리, 표', draw(P) {
        shuffled(P, [
          (x, y) => { for (let i = 0; i < 4; i++) P.line(x + 14 + (i === 2 ? 8 : 0), y + 16 + i * 12, x + 60, y + 16 + i * 12, { c: i === 2 ? 'accent' : 'soft', w: 3 }); },
          (x, y) => { P.note(x + 30, y + 8, 34, 44, { fill: 'hi' }); },
          (x, y) => { P.rect(x + 20, y + 10, 52, 50, { fill: 'paper', fs: 'solid', w: 1.2 }); P.rrect(x + 24, y + 14, 44, 10, 2, { c: 'warm', w: 1.6 }); P.rrect(x + 24, y + 30, 44, 22, 2, { c: 'accent', w: 1.6 }); },
          (x, y) => { P.rect(x + 16, y + 16, 60, 36, { w: 1.4 }); P.line(x + 16, y + 34, x + 76, y + 34, { w: 1.2 }); P.line(x + 36, y + 16, x + 36, y + 52, { w: 1.2 }); P.line(x + 56, y + 16, x + 56, y + 52, { w: 1.2 }); }
        ]);
      }},

      /* ---------- QA 그림 ---------- */
      qa_ocr: { w: 340, h: 200, label: '스캔한 쪽을 돋보기로 보는 모습과 OCR, Parse 두 단추', draw(P) {
        P.rect(14, 20, 120, 150, { fill: 'paper', fs: 'solid', w: 1.8 });
        P.text(74, 52, '가 A 1', { size: 16, weight: 700 });
        P.rect(30, 74, 88, 40, { w: 1.4 });
        P.line(74, 74, 74, 114, { w: 1.2 });
        P.line(30, 94, 118, 94, { w: 1.2 });
        P.line(30, 132, 110, 132, { c: 'ink2', w: 2 });
        P.line(30, 150, 96, 150, { c: 'ink2', w: 2 });
        lens(P, 112, 126, 56);
        chip(P, 176, 30, 70, 34, 'OCR', 'hi', 14);
        chip(P, 258, 30, 70, 34, 'Parse', 'sky', 14);
        ask(P, 211, 96, 26);
        ask(P, 293, 96, 26);
        P.face(252, 146, 34, { mood: 'wink' });
        P.text(252, 192, '같은 걸까?', { size: 13, c: 'ink2' });
      }},
      qa_three: { w: 340, h: 200, label: 'HTML, Markdown, text 세 쪽지 앞에서 고민하는 로봇', draw(P) {
        file(P, 14, 20, 92, 100, 'HTML', null, 'paper', 12);
        P.text(60, 80, '<table>', { mono: true, size: 10 });
        file(P, 124, 20, 92, 100, 'Markdown', null, 'hi', 12);
        P.text(170, 80, '| 입력 |', { mono: true, size: 10 });
        file(P, 234, 20, 92, 100, 'text', null, 'sky', 12);
        P.text(280, 80, '입력 처리', { mono: true, size: 10 });
        P.robot(150, 160, 0.3, { mood: 'wow' });
        ask(P, 190, 168, 24);
        P.text(270, 170, '챗봇 자료로는?', { size: 12, c: 'ink2' });
      }},
      qa_mode: { w: 340, h: 200, label: '글 위주인 쪽과 표·차트가 복잡한 쪽, 그리고 mode 손잡이', draw(P) {
        P.rect(14, 20, 110, 140, { fill: 'paper', fs: 'solid', w: 1.8 });
        for (let i = 0; i < 7; i++) P.line(26, 40 + i * 16, 112 - (i % 3) * 10, 40 + i * 16, { c: 'ink2', w: 2 });
        P.rect(138, 20, 110, 140, { fill: 'paper', fs: 'solid', w: 1.8 });
        P.rect(148, 30, 90, 56, { w: 1.4 });
        P.line(148, 48, 238, 48, { w: 1.2 });
        P.line(178, 48, 178, 86, { w: 1.2 });
        P.line(208, 30, 208, 86, { w: 1.2 });
        P.line(178, 66, 238, 66, { w: 1.2 });
        P.line(152, 150, 236, 150, { w: 1.6 });
        P.rect(160, 118, 14, 32, { fill: 'sky', fs: 'solid', w: 1 });
        P.rect(184, 102, 14, 48, { fill: 'good', fs: 'solid', w: 1 });
        P.rect(208, 128, 14, 22, { fill: 'warm', fs: 'solid', w: 1 });
        knob(P, 296, 70, 56, -60);
        P.text(296, 116, 'mode', { mono: true, size: 12, weight: 700 });
        P.face(296, 158, 28, { mood: 'wow' });
        P.text(69, 184, '글 위주', { size: 12, weight: 700 });
        P.text(193, 184, '복잡한 표·차트', { size: 12, weight: 700 });
      }},

      /* ---------- L3 설명 그림 ---------- */
      elemCard: { w: 340, h: 204, label: 'Playground의 테두리 하나가 elements 목록의 카드 하나라는 모습', draw(P) {
        P.rrect(30, 34, 176, 132, 10, { fill: 'paper', fs: 'solid', w: 1.4 });
        P.rrect(22, 26, 176, 132, 10, { fill: 'paper', fs: 'solid', w: 1.4 });
        P.rrect(14, 18, 176, 132, 10, { fill: 'hi', fs: 'solid', w: 1.8 });
        P.text(26, 42, 'id: 5', { mono: true, size: 11, anchor: 'start' });
        P.text(26, 64, 'category: table', { mono: true, size: 11, anchor: 'start', weight: 700 });
        P.text(26, 86, 'page: 1', { mono: true, size: 11, anchor: 'start' });
        P.text(26, 108, 'content: {…}', { mono: true, size: 11, anchor: 'start' });
        P.text(26, 130, 'coordinates: [4점]', { mono: true, size: 11, anchor: 'start' });
        sheet(P, 240, 24, 88, 118, ['table']);
        P.arrow(236, 86, 212, 86, { c: 'accent', w: 2.2, head: 8 });
        P.text(284, 162, 'Playground의', { size: 11, c: 'ink2' });
        P.text(284, 178, '테두리 하나', { size: 11, c: 'ink2' });
        P.text(108, 194, 'elements의 칸 하나', { size: 12, weight: 700, c: 'accent' });
      }},
      twelve: { w: 340, h: 200, label: '요소 이름 12가지 칩이 세 줄로 놓인 모습', draw(P) {
        const names = ['heading1', 'paragraph', 'list', 'table', 'figure', 'chart', 'equation', 'caption', 'header', 'footer', 'index', 'footnote'];
        const fills = ['hi', 'paper', 'good', 'sky', 'pink', 'pink', 'warm', 'paper', 'soft', 'soft', 'paper', 'paper'];
        names.forEach((n, i) => chip(P, 8 + (i % 4) * 82, 16 + Math.floor(i / 4) * 44, 76, 34, n, fills[i], 11));
        P.text(170, 172, '공식 문서의 요소 이름 전부', { size: 13, weight: 700, c: 'accent' });
        P.text(170, 194, 'heading2는 없어요', { size: 12, c: 'ink2' });
      }},
      chartEq: { w: 340, h: 200, label: '막대그래프는 표로, 수식은 LaTeX 글자로 바뀌는 모습', draw(P) {
        P.line(22, 24, 22, 92, { w: 2 });
        P.line(22, 92, 112, 92, { w: 2 });
        P.rect(32, 54, 16, 38, { fill: 'sky', fs: 'solid', w: 1.2 });
        P.rect(58, 38, 16, 54, { fill: 'good', fs: 'solid', w: 1.2 });
        P.rect(84, 66, 16, 26, { fill: 'warm', fs: 'solid', w: 1.2 });
        P.arrow(122, 60, 160, 60, { c: 'accent', w: 2.2, head: 8 });
        P.rect(168, 30, 156, 60, { fill: 'paper', fs: 'solid', w: 1.4 });
        P.line(168, 60, 324, 60, { w: 1.2 });
        P.line(207, 30, 207, 90, { w: 1.2 });
        P.line(246, 30, 246, 90, { w: 1.2 });
        P.line(285, 30, 285, 90, { w: 1.2 });
        P.text(187, 51, '반', { size: 12 });
        P.text(226, 51, '1', { size: 12 });
        P.text(265, 51, '2', { size: 12 });
        P.text(304, 51, '3', { size: 12 });
        P.text(187, 81, '명', { size: 12 });
        P.text(226, 81, '8', { size: 12 });
        P.text(265, 81, '12', { size: 12 });
        P.text(304, 81, '5', { size: 12 });
        P.text(66, 114, 'chart → 표', { size: 12, weight: 700, c: 'accent' });
        P.text(66, 152, 'O(n²)', { size: 20, weight: 700 });
        P.arrow(122, 146, 160, 146, { c: 'accent', w: 2.2, head: 8 });
        P.rrect(168, 126, 156, 36, 6, { fill: 'ink', fs: 'solid' });
        P.text(246, 149, '$$O(n^{2})$$', { mono: true, size: 12, c: 'paper' });
        P.text(170, 192, 'equation → LaTeX', { size: 12, weight: 700, c: 'accent' });
      }},
      coordBox: { w: 340, h: 204, label: '쪽 위 네모의 네 꼭짓점과 0~1 비율 눈금', draw(P) {
        P.rect(40, 22, 150, 170, { fill: 'paper', fs: 'solid', w: 1.8 });
        P.text(40, 16, '0', { size: 11, c: 'ink2' });
        P.text(190, 16, '1', { size: 11, c: 'ink2' });
        P.text(30, 196, '1', { size: 11, c: 'ink2' });
        P.rect(85, 90, 60, 51, { fill: 'pink', gap: 5, w: 2 });
        [[85, 90], [145, 90], [145, 141], [85, 141]].forEach(([x, y]) => P.circle(x, y, 8, { fill: 'accent', fs: 'solid', c: null }));
        P.text(80, 84, '①', { size: 11, anchor: 'end' });
        P.text(150, 84, '②', { size: 11, anchor: 'start' });
        P.text(150, 156, '③', { size: 11, anchor: 'start' });
        P.text(80, 156, '④', { size: 11, anchor: 'end' });
        P.text(206, 52, '① (0.3, 0.4)', { size: 11, anchor: 'start' });
        P.text(206, 74, '② (0.7, 0.4)', { size: 11, anchor: 'start' });
        P.text(206, 96, '③ (0.7, 0.7)', { size: 11, anchor: 'start' });
        P.text(206, 118, '④ (0.3, 0.7)', { size: 11, anchor: 'start' });
        P.text(266, 160, 'x × 쪽 너비', { size: 12, weight: 700, c: 'accent' });
        P.text(266, 182, 'y × 쪽 높이', { size: 12, weight: 700, c: 'accent' });
      }},

      /* ---------- L3 문제 그림 ---------- */
      q_twelveOdd: { w: 340, h: 200, label: '이름표 칩 사이에서 낯선 이름을 찾는 돋보기와 얼굴', draw(P) {
        for (let i = 0; i < 6; i++) P.rrect(14 + (i % 3) * 66, 24 + Math.floor(i / 3) * 50, 58, 34, 8, { fill: ['hi', 'sky', 'paper', 'good', 'pink', 'paper'][i], gap: 5, w: 1.6 });
        for (let i = 0; i < 6; i++) P.line(24 + (i % 3) * 66, 41 + Math.floor(i / 3) * 50, 62 + (i % 3) * 66, 41 + Math.floor(i / 3) * 50, { c: 'ink2', w: 2.4 });
        lens(P, 150, 150, 48);
        person(P, 280, 196, 'wow', 0.75);
        ask(P, 280, 60, 26);
      }},
      q_eqFmt: { w: 340, h: 200, label: 'O(n²) 식이 적힌 학습지와 markdown 칸의 물음표', draw(P) {
        P.rect(14, 20, 140, 150, { fill: 'paper', fs: 'solid', w: 1.8 });
        P.line(28, 44, 140, 44, { c: 'ink', w: 3 });
        P.text(84, 98, 'O(n²)', { size: 24, weight: 700 });
        P.rrect(40, 70, 88, 40, 4, { c: 'pink', w: 1.8 });
        P.line(28, 134, 136, 134, { c: 'ink2', w: 2 });
        P.line(28, 152, 116, 152, { c: 'ink2', w: 2 });
        P.arrow(160, 96, 196, 96, { c: 'accent', w: 2.2, head: 8 });
        P.rrect(202, 56, 124, 80, 8, { fill: 'ink', fs: 'solid' });
        P.text(214, 80, 'markdown:', { mono: true, size: 11, anchor: 'start', c: 'paper' });
        ask(P, 264, 120, 26, 'hi');
        P.face(264, 168, 30, { mood: 'wink' });
      }},
      q_ratio: { w: 340, h: 200, label: '쪽 너비 눈금 위 0.25 지점과 그 위의 물음표', draw(P) {
        P.text(170, 26, '쪽 너비 1240px', { size: 13, weight: 700 });
        P.rect(20, 36, 300, 96, { fill: 'paper', fs: 'solid', w: 1.8 });
        P.rect(95, 56, 110, 56, { fill: 'pink', gap: 5, w: 1.8 });
        P.line(20, 160, 320, 160, { w: 2 });
        [20, 95, 170, 245, 320].forEach(x => P.line(x, 154, x, 166, { w: 2 }));
        P.circle(95, 160, 10, { fill: 'accent', fs: 'solid', c: null });
        ask(P, 95, 150, 18);
        P.text(20, 184, '0', { size: 12 });
        P.text(95, 184, '0.25', { size: 12, weight: 700, c: 'accent' });
        P.text(320, 184, '1', { size: 12 });
        P.text(220, 190, '몇 px일까?', { size: 13, c: 'ink2' });
      }},
      q_chartFail: { w: 340, h: 200, label: '막대그래프가 그림으로 나와 축 글자만 남은 모습과 놀란 얼굴', draw(P) {
        P.line(22, 30, 22, 120, { w: 2 });
        P.line(22, 120, 130, 120, { w: 2 });
        P.rect(34, 76, 18, 44, { fill: 'sky', fs: 'solid', w: 1.2 });
        P.rect(64, 54, 18, 66, { fill: 'good', fs: 'solid', w: 1.2 });
        P.rect(94, 90, 18, 30, { fill: 'warm', fs: 'solid', w: 1.2 });
        P.text(76, 142, '1반 2반 3반', { size: 11, c: 'ink2' });
        P.arrow(140, 76, 176, 76, { c: 'accent', w: 2.2, head: 8 });
        P.rrect(182, 30, 144, 90, 8, { c: 'pink', w: 2 });
        P.text(254, 70, '1반 2반 3반', { size: 12 });
        P.text(254, 98, 'figure', { mono: true, size: 12, weight: 700, c: 'pink' });
        P.face(254, 160, 40, { mood: 'wow' });
      }},
      q_lineCoord: { w: 340, h: 200, label: '요소를 꺼내 찍는 코드를 돋보기로 살피는 얼굴과 TypeError', draw(P) {
        codeLook(P, 5, 'wow');
        P.text(290, 58, 'TypeError', { mono: true, size: 12, weight: 700, c: 'bad' });
      }},

      /* ---------- L4 설명 그림 ---------- */
      parseReq: { w: 340, h: 200, label: 'parse.py가 파일과 키를 실어 api.upstage.ai로 보내고 JSON을 받는 길', draw(P) {
        win(P, 10, 30, 120, 100);
        P.text(70, 72, 'parse.py', { mono: true, size: 12, weight: 700 });
        P.line(24, 92, 110, 92, { c: 'k', w: 3 });
        P.line(24, 110, 96, 110, { c: 's', w: 3 });
        P.arrow(136, 66, 210, 66, { c: 'accent', w: 2.4, head: 9 });
        P.text(173, 56, 'POST + 파일', { size: 11, c: 'accent' });
        P.arrow(210, 104, 136, 104, { c: 'good', w: 2.4, head: 9 });
        P.text(173, 124, 'JSON', { size: 12, weight: 700, c: 'good' });
        server(P, 216, 40, 114, 84, 'api.upstage.ai', 10);
        P.text(70, 156, 'Bearer 키는 .env에서', { size: 12, c: 'ink2' });
        P.text(273, 148, 'document-digitization', { mono: true, size: 9 });
        P.face(170, 178, 26, { mood: 'happy' });
      }},
      formData: { w: 340, h: 200, label: '보내는 꾸러미: files 칸의 문서 파일과 data 칸의 model, output_formats', draw(P) {
        P.rrect(14, 24, 122, 130, 10, { fill: 'hi', gap: 6 });
        P.text(75, 48, 'files', { mono: true, size: 13, weight: 700 });
        file(P, 44, 62, 62, 76, 'unit3', null, 'paper', 10);
        P.text(75, 130, 'document', { mono: true, size: 10 });
        P.rrect(150, 24, 178, 130, 10, { fill: 'sky', gap: 6 });
        P.text(239, 48, 'data', { mono: true, size: 13, weight: 700 });
        P.text(162, 80, 'model:', { mono: true, size: 11, anchor: 'start' });
        P.text(176, 98, 'document-parse', { mono: true, size: 11, anchor: 'start' });
        P.text(162, 120, 'output_formats:', { mono: true, size: 11, anchor: 'start' });
        P.text(176, 138, `'["markdown"]'`, { mono: true, size: 11, anchor: 'start' });
        P.text(170, 186, '파일은 files, 설정은 data', { size: 13, c: 'accent' });
      }},
      ocrMode: { w: 340, h: 200, label: 'ocr 손잡이와 mode 손잡이, 그리고 쌓인 동전', draw(P) {
        P.text(30, 30, 'auto', { size: 10, c: 'ink2' });
        P.text(110, 30, 'force', { size: 10, c: 'ink2' });
        knob(P, 70, 76, 68, -130);
        P.text(70, 132, 'ocr', { mono: true, size: 13, weight: 700 });
        P.text(158, 30, 'standard', { size: 10, c: 'ink2' });
        P.text(246, 30, 'enhanced', { size: 10, c: 'ink2' });
        knob(P, 200, 76, 68, -50);
        P.text(200, 132, 'mode', { mono: true, size: 13, weight: 700 });
        coin(P, 296, 92, 32);
        coin(P, 314, 112, 32);
        coin(P, 290, 124, 32);
        P.text(170, 172, '스캔본엔 ocr, 복잡한 표엔 mode', { size: 13, c: 'accent' });
        P.text(170, 194, 'enhanced는 쪽당 값이 더 비싸요', { size: 12, c: 'ink2' });
      }},
      bigDoc: { w: 340, h: 200, label: '300쪽 문서를 동기로 보내면 앞 100쪽만, 비동기로 보내면 번호표를 받고 10쪽 묶음으로 받는 모습', draw(P) {
        book(P, 14, 46, 84, 104, '300쪽');
        P.arrow(112, 70, 156, 70, { c: 'accent', w: 2.2, head: 8 });
        P.text(134, 60, '동기', { size: 11, weight: 700 });
        P.rect(162, 46, 72, 48, { fill: 'paper', fs: 'solid', w: 1.8 });
        P.text(198, 76, '100쪽만', { size: 12, weight: 700, c: 'bad' });
        P.arrow(112, 126, 156, 132, { c: 'accent', w: 2.2, head: 8 });
        P.text(134, 152, '비동기', { size: 11, weight: 700 });
        P.rrect(162, 112, 72, 40, 6, { fill: 'hi', gap: 5 });
        P.text(198, 136, 'request_id', { mono: true, size: 9 });
        P.arrow(238, 132, 256, 132, { c: 'accent', w: 2, head: 7 });
        P.rect(270, 104, 58, 40, { fill: 'paper', fs: 'solid', w: 1.2 });
        P.rect(266, 108, 58, 40, { fill: 'paper', fs: 'solid', w: 1.2 });
        P.rect(262, 112, 58, 40, { fill: 'paper', fs: 'solid', w: 1.6 });
        P.text(291, 137, '10쪽씩', { size: 11, weight: 700 });
        P.text(170, 188, '큰 문서는 비동기로', { size: 13, c: 'accent' });
      }},

      /* ---------- L4 문제 그림 ---------- */
      q_lineBug: { w: 340, h: 200, label: 'parse.py 끝부분을 돋보기로 살피는 얼굴과 KeyError', draw(P) {
        codeLook(P, 5, 'dizzy');
        P.text(290, 58, 'KeyError', { mono: true, size: 12, weight: 700, c: 'bad' });
      }},
      q_scan: { w: 340, h: 200, label: '기울고 얼룩진 옛 시험지 스캔본과 걱정하는 로봇', draw(P) {
        P.path('M24 34 L150 20 L166 168 L40 182 Z', { fill: 'paper', w: 2 });
        P.line(46, 56, 140, 46, { c: 'ink', w: 3 });
        P.line(48, 80, 136, 70, { c: 'ink2', w: 2 });
        P.line(50, 100, 130, 92, { c: 'ink2', w: 2 });
        P.line(52, 120, 140, 110, { c: 'ink2', w: 2 });
        P.line(54, 140, 120, 133, { c: 'ink2', w: 2 });
        P.circle(112, 118, 26, { fill: 'soft', fs: 'solid', c: null });
        P.robot(262, 92, 0.55, { mood: 'sad' });
        P.text(262, 178, '글자가 이상해요', { size: 12, c: 'ink2' });
      }},
      q_cost: { w: 340, h: 200, label: '단순한 학습지 30쪽 더미와 동전, 물음표', draw(P) {
        book(P, 26, 54, 92, 110, '30쪽');
        coin(P, 196, 96, 50);
        coin(P, 232, 116, 50);
        ask(P, 296, 110, 30);
        P.text(170, 192, '기본 mode로 30쪽이면?', { size: 13, c: 'ink2' });
      }},
      q_300: { w: 340, h: 200, label: '300쪽 교육과정 해설서 앞에서 어지러운 얼굴', draw(P) {
        book(P, 26, 44, 112, 130, '300쪽');
        person(P, 262, 196, 'dizzy', 0.8);
        P.text(262, 54, '한 번에 다?', { size: 14, weight: 700, c: 'warm' });
      }},

      /* ---------- QB 그림 ---------- */
      qb_ticket: { w: 340, h: 200, label: '번호표와 결과 종이 중 무엇이 먼저 올지 고민하는 모습', draw(P) {
        P.rrect(30, 50, 110, 60, 8, { fill: 'hi', gap: 6 });
        P.text(85, 86, '번호표', { size: 15, weight: 700 });
        P.rect(196, 30, 110, 132, { fill: 'paper', fs: 'solid', w: 1.8 });
        P.text(251, 58, '결과', { size: 15, weight: 700 });
        for (let i = 0; i < 4; i++) P.line(210, 82 + i * 18, 292 - (i % 2) * 14, 82 + i * 18, { c: 'ink2', w: 2 });
        ask(P, 168, 92, 26);
        P.face(85, 150, 34, { mood: 'wow' });
        P.text(170, 192, '비동기로 보내면 바로 오는 건?', { size: 12, c: 'ink2' });
      }},
      qb_twoKnobs: { w: 340, h: 200, label: 'output_formats 손잡이와 mode 손잡이, 어느 쪽인지 묻는 물음표', draw(P) {
        knob(P, 90, 84, 76, -40);
        P.text(90, 146, 'output_formats', { mono: true, size: 11, weight: 700 });
        knob(P, 250, 84, 76, -140);
        P.text(250, 146, 'mode', { mono: true, size: 11, weight: 700 });
        ask(P, 90, 36, 22);
        ask(P, 250, 36, 22);
        P.text(170, 186, '결과 꼴? 분석 방식?', { size: 13, c: 'ink2' });
      }},
      qb_whole: { w: 340, h: 200, label: '긴 두루마리 한 덩어리와 낱장 카드 묶음 사이의 가위', draw(P) {
        P.rrect(20, 20, 120, 150, 8, { fill: 'paper', w: 2 });
        for (let i = 0; i < 8; i++) P.line(32, 38 + i * 16, 128 - (i % 3) * 12, 38 + i * 16, { c: i % 4 === 0 ? 'warm' : 'ink2', w: 2 });
        P.text(80, 190, 'content.markdown', { mono: true, size: 10 });
        scissors(P, 170, 90);
        for (let i = 0; i < 4; i++) P.rrect(204, 22 + i * 36, 120, 28, 6, { fill: i % 3 === 0 ? 'warm' : 'paper', gap: 5, w: 1.4 });
        P.text(264, 190, 'elements', { mono: true, size: 10 });
      }},

      /* ---------- L5 설명 그림 ---------- */
      noise: { w: 340, h: 200, label: '쪽마다 되풀이되는 학교 이름 머리말에 어지러운 로봇', draw(P) {
        [[14, 14], [40, 34], [66, 54]].forEach(([x, y], i) => {
          P.rect(x, y, 110, 128, { fill: 'paper', fs: 'solid', w: 1.6 });
          P.text(x + 58, y + 16, '한입고 정보과', { size: 10, c: 'warm' });
          P.line(x + 12, y + 30, x + 98, y + 30, { c: 'ink2', w: 2 });
          P.text(x + 55, y + 120, `- ${i + 1} -`, { size: 10, c: 'warm' });
        });
        P.robot(262, 86, 0.55, { mood: 'dizzy' });
        P.text(262, 168, '또 학교 이름?', { size: 13, weight: 700, c: 'warm' });
      }},
      pageTag: { w: 340, h: 200, label: 'Markdown 사이사이 쪽 표시와 "2쪽에 있어요" 말풍선', draw(P) {
        P.rrect(14, 14, 176, 172, 8, { fill: 'ink', fs: 'solid' });
        P.text(26, 40, '[1쪽]', { mono: true, size: 12, anchor: 'start', c: 'hi', weight: 700 });
        P.text(26, 64, '# 3단원 학습지', { mono: true, size: 11, anchor: 'start', c: 'paper' });
        P.text(26, 88, '| 입력 | 출력 |', { mono: true, size: 11, anchor: 'start', c: 'paper' });
        P.text(26, 120, '[2쪽]', { mono: true, size: 12, anchor: 'start', c: 'hi', weight: 700 });
        P.text(26, 144, '순서도를 그려 봐요.', { mono: true, size: 11, anchor: 'start', c: 'paper' });
        P.bubble(204, 14, 128, 46, 250, 76);
        P.text(268, 43, '2쪽에 있어요', { size: 13, weight: 700 });
        P.robot(270, 128, 0.45, { mood: 'happy' });
      }},
      saveMd: { w: 340, h: 200, label: 'data 폴더 안 unit3.md와 utf-8 꼬리표', draw(P) {
        P.text(70, 38, 'data/', { mono: true, size: 13, weight: 700 });
        folder(P, 24, 46, 150, 116, 'hi');
        file(P, 64, 72, 72, 78, 'unit3.md', 'happy', 'paper', 11);
        P.line(176, 104, 208, 92, { w: 1.6 });
        P.rrect(208, 72, 104, 36, 8, { fill: 'good', gap: 5 });
        P.text(260, 96, 'utf-8', { mono: true, size: 14, weight: 700 });
        P.text(260, 140, 'Windows에서도', { size: 12, c: 'ink2' });
        P.text(260, 160, '한글 그대로', { size: 12, c: 'ink2' });
        P.sparkle(318, 40, 6, 'hi');
      }},

      /* ---------- L5 문제 그림 ---------- */
      q_whyPage: { w: 340, h: 200, label: '쪽 표시가 들어간 Markdown 쪽지와 왜 넣는지 궁금한 얼굴', draw(P) {
        P.note(20, 20, 170, 156, { fill: 'paper' });
        P.text(34, 50, '[3쪽]', { mono: true, size: 13, anchor: 'start', c: 'accent', weight: 700 });
        P.line(34, 74, 170, 74, { c: 'ink2', w: 2 });
        P.line(34, 94, 150, 94, { c: 'ink2', w: 2 });
        P.text(34, 126, '[4쪽]', { mono: true, size: 13, anchor: 'start', c: 'accent', weight: 700 });
        P.line(34, 150, 160, 150, { c: 'ink2', w: 2 });
        person(P, 272, 196, 'smile', 0.75);
        ask(P, 272, 64, 26);
      }},
      q_notIn: { w: 340, h: 200, label: '요소 카드들이 체를 지나가는 모습과 빈칸 하나', draw(P) {
        chip(P, 20, 18, 70, 28, 'header', 'soft', 11);
        chip(P, 98, 18, 70, 28, 'table', 'sky', 11);
        chip(P, 176, 18, 70, 28, 'list', 'good', 11);
        chip(P, 254, 18, 70, 28, 'footer', 'soft', 11);
        P.path('M40 82 L300 82 L262 126 L78 126 Z', { fill: 'soft', gap: 4, w: 2 });
        P.rrect(124, 140, 92, 30, 8, { c: 'warm', w: 2 });
        ask(P, 170, 162, 20);
        P.text(170, 192, '무엇을 남길까?', { size: 12, c: 'ink2' });
      }},
      q_cleanOrder: { w: 340, h: 200, label: '뒤섞인 카드: 폴더, 카드 묶음, 쪽 표시, 가위', draw(P) {
        shuffled(P, [
          (x, y) => { folder(P, x + 20, y + 14, 52, 42, 'hi'); },
          (x, y) => { for (let i = 0; i < 3; i++) P.rrect(x + 16 + i * 6, y + 12 + i * 8, 44, 26, 4, { fill: 'paper', fs: 'solid', w: 1.2 }); },
          (x, y) => { P.text(x + 46, y + 30, '[2쪽]', { mono: true, size: 12, weight: 700, c: 'accent' }); P.line(x + 16, y + 48, x + 76, y + 48, { c: 'ink2', w: 2 }); },
          (x, y) => { scissors(P, x + 46, y + 30); }
        ], 'smile');
      }},
      q_broken: { w: 340, h: 200, label: 'Windows 노트북 화면에 한글이 깨져 보이는 모습과 놀란 얼굴', draw(P) {
        laptop(P, 30, 30, 170, 110);
        P.text(115, 56, 'unit3.md', { mono: true, size: 12, weight: 700 });
        P.text(115, 90, 'ÇÐ½À Áö ¹®Á¦', { size: 15, c: 'bad' });
        P.text(115, 118, '| ÀÔ·Â |', { size: 13, c: 'bad' });
        person(P, 282, 196, 'wow', 0.75);
        P.text(115, 186, '학교 PC에서 열었더니', { size: 12, c: 'ink2' });
      }},

      /* ---------- T1 그림 ---------- */
      t_415: { w: 340, h: 200, label: '연수장 노트북 터미널의 415 오류와 lesson.key 파일', draw(P) {
        win(P, 10, 14, 224, 150);
        term(P, 18, 44, 208, 112, ['$ python parse.py', 'HTTPError:', '415 Client Error'], 11);
        file(P, 250, 28, 78, 88, 'lesson.key', 'wow', 'hi', 10);
        P.text(170, 190, '연수장, 옆자리 선생님 노트북', { size: 12, c: 'ink2' });
      }},
      t_100: { w: 340, h: 200, label: '120쪽 교과서와 쪽수 100이 찍힌 터미널', draw(P) {
        book(P, 18, 46, 92, 116, '120쪽');
        term(P, 136, 40, 190, 70, ['$ python parse.py', '쪽수: 100'], 11);
        ask(P, 231, 150, 28);
        P.text(170, 194, '연수 실습 중', { size: 12, c: 'ink2' });
      }},
      t_blank2: { w: 340, h: 200, label: 'data 꾸러미의 두 칸이 비어 있는 모습', draw(P) {
        P.rrect(20, 24, 222, 130, 10, { fill: 'sky', gap: 6 });
        P.text(131, 48, 'data', { mono: true, size: 13, weight: 700 });
        P.text(34, 88, 'model', { mono: true, size: 12, anchor: 'start' });
        P.rrect(130, 70, 100, 26, 6, { c: 'warm', w: 2 });
        ask(P, 180, 90, 18);
        P.text(34, 128, 'formats', { mono: true, size: 12, anchor: 'start' });
        P.rrect(130, 110, 100, 26, 6, { c: 'warm', w: 2 });
        ask(P, 180, 130, 18);
        person(P, 294, 196, 'smile', 0.65);
        P.text(131, 186, '두 칸을 채워요', { size: 12, c: 'ink2' });
      }},
      t_lineLoop: { w: 340, h: 200, label: '머리말·꼬리말만 남은 결과에 어리둥절해 코드를 살피는 얼굴', draw(P) {
        codeLook(P, 6, 'dizzy');
        P.text(290, 52, '머리말만', { size: 12, weight: 700, c: 'bad' });
        P.text(290, 70, '남았어요', { size: 12, weight: 700, c: 'bad' });
      }},
      t_asyncOrder: { w: 340, h: 200, label: '뒤섞인 카드: 번호표, 모래시계, 큰 문서, 내려받기 화살표', draw(P) {
        shuffled(P, [
          (x, y) => { P.rrect(x + 18, y + 18, 56, 30, 5, { fill: 'hi', gap: 4, w: 1.4 }); P.line(x + 28, y + 33, x + 64, y + 33, { c: 'ink2', w: 2 }); },
          (x, y) => { P.path(`M${x + 30} ${y + 10} L${x + 62} ${y + 10} L${x + 50} ${y + 34} L${x + 62} ${y + 58} L${x + 30} ${y + 58} L${x + 42} ${y + 34} Z`, { fill: 'sky', gap: 5, w: 1.6 }); },
          (x, y) => { P.rect(x + 34, y + 10, 30, 44, { fill: 'paper', fs: 'solid', w: 1.2 }); P.rect(x + 30, y + 14, 30, 44, { fill: 'paper', fs: 'solid', w: 1.6 }); },
          (x, y) => { P.arrow(x + 46, y + 12, x + 46, y + 44, { c: 'good', w: 3, head: 9 }); P.line(x + 24, y + 54, x + 68, y + 54, { w: 3 }); }
        ], 'proud');
      }},
      t_equation: { w: 340, h: 200, label: '이진수 식이 든 학습지를 돋보기로 보는 얼굴', draw(P) {
        P.rect(14, 18, 160, 160, { fill: 'paper', fs: 'solid', w: 1.8 });
        P.line(28, 42, 150, 42, { c: 'ink', w: 3 });
        P.text(94, 92, '1011₂ = 2³+2+1', { size: 15, weight: 700 });
        P.rrect(24, 70, 140, 32, 4, { c: 'pink', w: 1.8 });
        P.line(28, 128, 156, 128, { c: 'ink2', w: 2 });
        P.line(28, 148, 140, 148, { c: 'ink2', w: 2 });
        lens(P, 168, 140, 44);
        person(P, 278, 196, 'smile', 0.75);
        ask(P, 278, 60, 26);
      }},
      t_figureCrop: { w: 340, h: 200, label: '학습지의 순서도 그림을 가위로 오려 슬라이드에 넣으려는 모습', draw(P) {
        sheet(P, 14, 14, 120, 170, ['figure']);
        scissors(P, 158, 128);
        win(P, 196, 46, 132, 96);
        P.rrect(226, 80, 72, 44, 6, { fill: 'pink', gap: 5 });
        P.arrow(176, 112, 216, 100, { c: 'accent', w: 2, head: 7 });
        P.text(262, 172, '슬라이드에 넣고 싶어요', { size: 11, c: 'ink2' });
      }},
      t_autoMode: { w: 340, h: 200, label: '40쪽 중 4쪽만 표와 그래프가 복잡한 쪽 더미', draw(P) {
        const busy = [5, 18, 26, 37];
        for (let i = 0; i < 40; i++) {
          const x = 14 + (i % 8) * 39, y = 14 + Math.floor(i / 8) * 30;
          P.rect(x, y, 32, 24, { fill: busy.includes(i) ? 'warm' : 'paper', fs: 'solid', w: 1.2 });
          if (busy.includes(i)) { P.line(x + 6, y + 18, x + 6, y + 10, { w: 2 }); P.line(x + 14, y + 18, x + 14, y + 6, { w: 2 }); P.line(x + 22, y + 18, x + 22, y + 12, { w: 2 }); }
          else P.line(x + 6, y + 12, x + 26, y + 12, { c: 'soft', w: 2 });
        }
        P.text(170, 190, '40쪽 중 4쪽만 복잡해요', { size: 13, c: 'ink2' });
      }},
      t_web: { w: 340, h: 200, label: '학급 게시판 창에 학습지 표를 그대로 보여 주려는 모습', draw(P) {
        win(P, 14, 14, 220, 162);
        P.text(124, 52, '우리 반 게시판', { size: 13, weight: 700 });
        P.rect(34, 68, 180, 60, { w: 1.4 });
        P.rect(34, 68, 180, 20, { fill: 'sky', fs: 'solid', w: 1.2 });
        P.line(94, 68, 94, 128, { w: 1.2 });
        P.line(154, 68, 154, 128, { w: 1.2 });
        P.line(34, 108, 214, 108, { w: 1.2 });
        P.line(40, 152, 190, 152, { c: 'soft', w: 3 });
        person(P, 288, 196, 'smile', 0.7);
        ask(P, 288, 60, 24);
      }},
      t_privacy: { w: 340, h: 200, label: '연수 실습에 쓸 자료 네 개 앞에서 고르는 모습', draw(P) {
        [[14, 24, 'hi'], [84, 24, 'sky'], [14, 104, 'pink'], [84, 104, 'paper']].forEach(([x, y, f]) => file(P, x, y, 60, 70, null, null, f));
        for (let i = 0; i < 4; i++) {
          const x = 24 + (i % 2) * 70, y = 52 + Math.floor(i / 2) * 80;
          P.line(x, y, x + 36, y, { c: 'ink2', w: 2 });
          P.line(x, y + 14, x + 28, y + 14, { c: 'ink2', w: 2 });
        }
        lens(P, 186, 120, 48);
        person(P, 280, 196, 'smile', 0.75);
        P.text(280, 56, '어느 걸 올릴까?', { size: 13, weight: 700, c: 'warm' });
      }}
    },

    items: [
    /* =================== L1 =================== */
    { id: 'L1', type: 'lesson', title: 'PDF를 그대로 주면 안 되는 까닭', sub: '사람 눈용 문서와 LLM이 읽기 좋은 글', min: 10, steps: [
      { t: 'say', h: 'PDF는 사람 눈으로 보라고 만든 종이예요', fig: 'pdfCopy', p: [
        '정보 수업 학습지를 PDF로 저장하면 어느 컴퓨터에서나 똑같이 보여요. 대신 대부분의 PDF 안에는 "이 글자를 이 자리에 그려라"는 정보만 있고, "여기부터 표, 이건 제목" 같은 구조는 따로 없어요.',
        '그래서 복사해 붙이면 표가 한 줄로 뭉개지고, 2단 교과서는 왼쪽·오른쪽 단 문장이 섞이고, 쪽마다 있는 학교 이름과 쪽 번호가 본문 사이에 끼어들어요.',
        '스캔한 시험지는 더해요. 글자가 아니라 사진이라서 복사할 글자조차 없어요.'
      ]},
      { t: 'say', h: 'LLM에게는 구조가 살아 있는 글이 필요해요', fig: 'structured', p: [
        'c1u2에서 봤듯이 Solar는 글을 토큰으로 잘라 읽어요. "입력 처리 출력 두 수 더하기 합"처럼 뭉개진 표를 주면 어느 값이 어느 칸의 것인지 짝이 흐려져, 그럴듯하게 틀린 답을 낼 수 있어요.',
        '제목은 <code>#</code>, 표는 <code>|</code> 줄로 적는 <b>Markdown</b>이나, 태그로 감싸는 <b>HTML</b>로 바꿔 주면 구조가 글 속에 남아요. 공식 문서도 RAG·LLM에 넣을 때는 Markdown, 웹 화면에 보일 때는 HTML을 권해요.'
      ], code: { lang: 'md', src: src(['# 3단원 알고리즘과 프로그래밍', '| 입력 | 처리 | 출력 |', '| --- | --- | --- |', '| 두 수 | 더하기 | 합 |']) } },
      { t: 'say', h: 'Document Parse는 문서를 요소로 나눠 글로 바꿔요', fig: 'parseFlow', p: [
        '업스테이지 <b>Document Parse</b>는 PDF·이미지·오피스 문서를 받아 제목·문단·표·그림 같은 <b>요소</b>로 나누고, 사람이 읽는 순서대로 HTML·Markdown·text로 돌려줘요.',
        '사진 같은 이미지 파일은 <b>OCR</b>(그림 속 글자 읽기)로 글자를 먼저 알아봐요. 디지털로 만든 PDF는 안에 든 글자를 그대로 쓰고, 스캔한 PDF는 레슨 4의 <code>ocr</code> 설정으로 OCR을 하게 해요.',
        '코드에서 부르는 모델 이름은 <code>document-parse</code>예요. 2026년 10월 기준 이 별칭은 <code>document-parse-260930</code> 버전을 가리켜요. c1u1에서 본 별칭과 버전 이름 그대로예요.'
      ], table: { head: ['수업자료', '그냥 복사하면', '파싱하면'], rows: [
        ['학습지(표·빈칸)', '표가 한 줄로 뭉개져요', '표는 <code>table</code> 요소로'],
        ['교과서 한 쪽(2단·그림)', '단 순서가 섞여요', '읽는 순서대로, 그림 설명은 <code>caption</code>으로'],
        ['스캔한 시험지', '복사할 글자가 없어요', 'OCR로 글자를 읽어 요소로'],
        ['HWP 공문', '한글 프로그램 없이는 열기도 어려워요', 'HWP·HWPX도 받는다고 안내돼 있어요(2026년 5월 문서, 직접 확인)'] ] } },
      { t: 'say', h: '파싱한 글은 과정 2·3 내내 쓰여요', fig: 'journey', p: [
        '이번 단원에서 만든 Markdown은 다음 단원들의 재료예요. c2u2에서는 문항·정답을 뽑고, c2u3에서는 조각으로 나눠 검색하고, c3u1에서는 내 수업자료로 대답하는 보조 에이전트를 만들어요.',
        '연수 1일차 14:00 「수업자료를 데이터로」 차시가 바로 이 흐름이에요. 파싱이 엉망이면 뒤의 검색과 답도 엉망이 되니, 첫 단추를 잘 끼워요.',
        '<b>수업에서는</b> 학기 내내 쓴 학습지·활동지를 한 번 파싱해 두면 복습용 챗봇, 퀴즈 만들기, 평가 문항 정리에 두고두고 다시 써요.'
      ]},
      { t: 'q', kind: 'mc', fig: 'q_twoCol', q: '2단으로 짜인 교과서 PDF에서 한 쪽을 통째로 복사해 붙였더니, 왼쪽 단과 오른쪽 단 문장이 뒤섞였어요. 왜 이런 일이 생길까요?',
        opts: ['PDF에 복사 방지 암호가 걸려 있어 일부러 순서를 섞었다', '붙여 넣은 메모장이 한글 글꼴을 잘못 읽어 줄을 바꿨다', 'PDF에는 단 구분·읽는 순서 같은 구조가 따로 없다', '교과서 글꼴이 특이해서 컴퓨터가 글자를 못 알아봤다'], a: 2,
        why: '대부분의 PDF는 글자를 그릴 자리 위주로 담아서, 복사하면 단 구분과 읽는 순서가 사라질 수 있어요. Document Parse는 요소를 나누고 읽는 순서대로 이어 줘요.',
        ex: ['복사 방지는 복사 자체를 막을 뿐, 순서를 섞지 않아요. 문제는 PDF에 구조가 없다는 거예요.', '메모장은 받은 글을 그대로 보여 줄 뿐이에요. 섞인 건 복사해 온 문장의 순서예요.', '', '글자는 제대로 나왔어요. 순서가 섞인 건 글꼴 탓이 아니에요.'] },
      { t: 'q', kind: 'mc', fig: 'q_tableLLM', q: '입력·처리·출력 표를 복사했더니 "입력 처리 출력 두 수 더하기 합"처럼 한 줄이 됐어요. 이대로 Solar에게 주면 생길 수 있는 문제는?',
        opts: ['Solar가 한 줄로 이어진 한글을 못 읽어서 오류를 낸다', '칸의 짝이 흐려져 엉뚱한 짝으로 답할 수 있다', '글자가 줄어 토큰이 적어지니 오히려 요금이 더 나온다', '표였다는 사실을 Solar가 알아서 되살려 늘 정확히 답한다'], a: 1,
        why: 'LLM은 받은 글의 토큰을 읽고 다음 토큰을 예측할 뿐이에요. 칸의 짝이 사라진 글에서는 그럴듯하지만 틀린 짝을 지을 수 있어요. 표는 Markdown 표처럼 구조를 살려서 줘요.',
        ex: ['Solar는 한국어를 잘 읽어요. 문제는 글이 아니라 사라진 구조예요.', '', '요금은 토큰 수에 따라 늘어요. 짧다고 더 비싸지지 않아요.', '사라진 구조를 늘 되살린다는 보장은 없어요. 그래서 처음부터 구조를 살려 줘요.'] },
      { t: 'q', kind: 'order', fig: 'q_journey', q: '학습지 PDF가 챗봇의 근거 자료가 되기까지(과정 2·3), 순서대로 쌓아 보세요.',
        items: ['Document Parse로 학습지를 요소와 Markdown으로 바꾼다', '머리말·꼬리말을 빼고 쪽 표시를 달아 저장한다', '글을 조각으로 나눠 임베딩한다', '학생 질문과 가까운 조각을 찾아 Solar에게 근거로 준다'],
        why: '파싱해야 다듬을 글이 생기고, 다듬은 글을 조각내야 임베딩하고, 임베딩해 둬야 질문할 때 찾을 수 있어요. 이번 단원은 앞의 두 칸이에요.' },
      { t: 'q', kind: 'blank', fig: 'q_fmtBlank', q: '공식 권장표를 정리한 메모예요. 빈칸에 들어갈 것은?', lang: 'plain', code: 'RAG·LLM에 넣을 때: output_formats [[1]]\n웹 화면에 보일 때: output_formats html',
        opts: ['markdown', 'text', 'json', 'pdf'], a: 0,
        why: 'LLM에 넣을 때는 제목·표 구조를 글로 지키는 <b>markdown</b>, 웹 화면에 보일 때는 <b>html</b>을 권해요.',
        ex: ['', 'text는 글자만 남아 표 구조가 사라져요.', 'json은 응답 전체의 꼴이에요. output_formats에 고르는 값은 text·html·markdown이에요.', 'pdf는 넣는 파일 형식이에요. 결과 꼴이 아니에요.'] },
      { t: 'sum', pts: ['PDF는 그릴 자리 위주라, 복사하면 표가 뭉개지고 단 순서·머리말이 섞인다. 스캔본은 글자조차 없다.', 'LLM에는 구조가 살아 있는 글이 좋다. RAG·LLM에는 Markdown, 웹 화면에는 HTML(공식 권장).', 'Document Parse(document-parse)는 문서를 요소로 나눠 읽는 순서대로 HTML·Markdown·text로 준다. 결과는 c2u2·c2u3·c3u1의 재료.'] }
    ]},

    /* =================== L2 =================== */
    { id: 'L2', type: 'lesson', title: 'Playground에서 학습지 파싱해 보기', sub: '파일 고르기 → 요소 강조 → 요소별 결과', min: 12, steps: [
      { t: 'say', h: '콘솔 Playground에서 키 없이 먼저 해 봐요', fig: 'consoleNav', p: [
        'c1u1에서 둘러본 콘솔의 <b>Playground</b> 아래에 <b>Document Parse</b>가 있어요. 공식 안내에 따르면 견본이나 내 파일로 HTML·Markdown 변환을 API 키 없이 해 볼 수 있어요.',
        '콘솔 화면 모양은 바뀔 수 있어요. 메뉴 이름이나 단추 자리가 이 앱과 다르면, 왼쪽 메뉴에서 Playground 아래 Document Parse를 찾으면 돼요.',
        '코드를 짜기 전에 Playground로 "내 자료가 어떻게 읽히나"를 먼저 보면, 뒤에서 <code>mode</code>나 <code>ocr</code>을 고를 때 감이 와요.'
      ]},
      { t: 'say', h: '결과는 요소마다 테두리와 이름표로 보여요', fig: 'highlightFig', p: [
        '파싱이 끝나면 문서 쪽 위에 요소마다 강조 표시가 붙어요. 이름표는 Document Parse가 붙인 요소 이름(<code>category</code>)이에요. <code>header</code>는 머리말, <code>heading1</code>은 제목, <code>table</code>은 표예요.',
        '예전 안내에는 올린 문서의 첫 쪽을 보여 준다고 되어 있어요. 여러 쪽짜리 자료를 통째로 다루는 건 레슨 4의 <code>parse.py</code>로 해요.',
        '이 앱의 연습 화면에서는 요소를 누르면 그 요소의 HTML과 Markdown이 아래에 나와요. 진짜 콘솔에서 결과를 펼쳐 보는 방법은 다를 수 있어요.'
      ]},
      { t: 'say', h: 'Playground에서 눈여겨볼 네 가지', fig: 'checkFour', table: { head: ['볼 것', '왜'], rows: [
        ['표가 <code>table</code>로 나왔나', '칸의 짝이 살아야 채점·검색에 써요'],
        ['읽는 순서가 맞나', '2단·글상자 자료는 순서가 섞이기 쉬워요'],
        ['머리말·꼬리말', '쪽마다 되풀이돼서 자료로 쓸 땐 걸러요(레슨 5)'],
        ['그림·차트', '그래프는 표로 바뀌기도 해요(레슨 3)'] ] }, p: [
        '표가 복잡하거나 스캔본이라 결과가 엉성하면 <b>mode</b>를 바꿔 볼 수 있어요. 기본 <code>standard</code>는 싸고 빠르고, <code>enhanced</code>는 복잡한 표·차트·스캔본을 더 잘 다루는 대신 비싸요. 업스테이지 블로그에는 enhanced도 Playground에서 시험해 볼 수 있다고 나와 있어요.',
        '<b>학생 개인정보가 담긴 문서는 올리지 않아요.</b> 이름·성적·상담 기록이 든 파일 대신 내가 만든 학습지나 공개 자료로 시험하고, 학교·교육청 지침도 먼저 확인해요.'
      ]},
      { t: 'sim', h: 'Playground에서 학습지를 파싱해 봐요', p: '콘솔 왼쪽 메뉴의 Playground 아래 Document Parse로 가서 학습지를 고르고, 표·문단·머리말 요소를 하나씩 눌러 봐요.',
        scene: { win: 'web', url: 'console.upstage.ai', brand: 'Upstage Console', nav: NAV, page: 'Home', blocks: [{ k: 'h', text: 'Home' }] },
        steps: [
          { goal: 'Playground 아래 Document Parse를 눌러요', click: 'nav:Document Parse', then: { page: 'Document Parse', blocks: [H_DP, { k: 'files', id: 'doc', items: DOCS }] },
            say: '문서를 올려 파싱해 보는 곳이에요. 이 연습 화면은 내 컴퓨터에서 파일을 고르는 장면을 파일 목록으로 단순하게 옮겼어요.' },
          { goal: '<code>3단원_학습지.pdf</code>를 골라요', click: 'file:3단원_학습지.pdf', then: { blocks: [H_DP, FILES_ON, pg(0)] },
            say: '쪽 위에 요소마다 테두리와 이름표가 붙었어요. 이 연습 화면에서는 파일을 고르면 바로 결과가 나와요. 진짜 콘솔은 단추나 순서가 다를 수 있어요.' },
          { goal: '표 요소(<code>table</code>)를 눌러요', click: 'el:5', then: { blocks: [H_DP, FILES_ON, pg(5), { k: 'code', lang: 'html', label: 'table · HTML', src: TABLE_HTML }, { k: 'code', lang: 'md', label: 'table · Markdown', src: TABLE_MD }] },
            say: '표가 HTML에서는 <code>&lt;table&gt;</code>, Markdown에서는 <code>|</code> 줄로 나왔어요. 칸의 짝이 그대로 살아 있어요.' },
          { goal: '표 위의 문단 요소(<code>paragraph</code>)를 눌러요', click: 'el:4', then: { blocks: [H_DP, FILES_ON, pg(4), { k: 'code', lang: 'html', label: 'paragraph · HTML', src: '<p>' + PARA + '</p>' }, { k: 'code', lang: 'md', label: 'paragraph · Markdown', src: PARA }] },
            say: '문단은 HTML에서 <code>&lt;p&gt;</code>로 감싸이고, Markdown에서는 글 그대로예요. 연습 화면이라 줄였지만, 실제 결과에는 <code>id</code> 같은 속성이 더 붙을 수 있어요.' },
          { goal: '맨 위 머리말 요소(<code>header</code>)를 눌러요', click: 'el:1', then: { blocks: [H_DP, FILES_ON, pg(1), { k: 'code', lang: 'md', label: 'header · Markdown', src: '한입고등학교 정보과' }] },
            say: '<b>header</b>(머리말)예요. 쪽마다 되풀이되는 학교 이름이라, 자료로 쓸 땐 레슨 5에서 걸러 내요.' } ],
        end: '진짜 콘솔에서도 개인정보 없는 내 학습지로 해 봐요. 메뉴와 단추 모양은 바뀔 수 있어요.' },
      { t: 'q', kind: 'mc', fig: 'q_noKey', q: '연수장에서 아직 API 키를 못 만든 옆자리 선생님이 Document Parse가 어떤 결과를 내는지 먼저 보고 싶대요. 가장 빠른 방법은?',
        opts: ['parse.py를 먼저 짜서 .env의 키 자리를 비운 채 실행한다', 'Chat Playground에 PDF 내용을 복사해 붙인다', '키를 만들 때까지 기다렸다가 parse.py로만 한다', 'Playground의 Document Parse에서 해 본다'], a: 3,
        why: 'Playground의 Document Parse는 API 키 없이 견본이나 내 파일로 변환 결과를 볼 수 있다고 안내돼 있어요. 코드는 키가 생긴 뒤에 짜도 돼요.',
        ex: ['API는 키가 있어야 해요. 키 없이 보내면 401 같은 오류가 나요.', 'Chat은 Solar와 대화하는 곳이에요. 복사한 순간 이미 표 구조가 사라져서 파싱 결과를 볼 수 없어요.', '기다릴 필요 없어요. Playground는 키 없이도 체험할 수 있어요.', ''] },
      { t: 'q', kind: 'mc', fig: 'q_headerTag', q: 'Playground 결과에서 쪽 맨 위 "한입고등학교 정보과"에 <code>header</code> 이름표가 붙었어요. 이 요소를 어떻게 보면 좋을까요?',
        opts: ['학습지의 제목이니 가장 중요한 요소로 남긴다', '쪽마다 되풀이되는 머리말이라, 자료로 쓸 땐 걸러 낼 후보다', '파싱이 잘못된 것이니 enhanced로 다시 돌린다', 'header는 웹 페이지의 머리 정보라 화면에 안 보이는 글이다'], a: 1,
        why: '<code>header</code>는 쪽 위쪽 머리말이에요. 쪽마다 되풀이되니 검색·챗봇 자료에서는 소음이 돼요. 레슨 5에서 category로 걸러 내요.',
        ex: ['제목은 <code>heading1</code>이에요. header는 쪽마다 반복되는 머리말이에요.', '', '제대로 알아본 거예요. 머리말을 머리말이라고 이름 붙였을 뿐이에요.', '여기서 header는 문서 쪽의 머리말이에요. 화면에 보이는 학교 이름 그대로예요.'] },
      { t: 'q', kind: 'mc', fig: 'q_privacy', q: '학생 30명의 이름과 점수가 적힌 수행평가 채점표 스캔본으로 Playground의 표 인식을 시험해 보려 해요. 어떻게 할까요?',
        opts: ['Playground는 키 없이 쓰는 체험판이라 괜찮다', '이름 칸만 잘라 내면 지침은 따로 볼 필요 없다', '개인정보가 없는 내 수업자료나 같은 꼴의 가짜 표로 시험한다', '결과만 확인하고 Playground 화면을 닫으면 남지 않으니 괜찮다'], a: 2,
        why: '학생 개인정보는 AI 서비스에 넣지 않는 게 원칙이에요. 표 인식은 같은 꼴의 가짜 표(가명, 지어낸 점수)로도 충분히 시험할 수 있어요. 학교·교육청 지침도 먼저 확인해요.',
        ex: ['키가 없어도 파일은 서비스로 보내져요. 체험판이라고 개인정보를 넣어도 되는 건 아니에요.', '점수와 반·번호만으로도 학생을 알아볼 수 있어요. 지침 확인은 늘 먼저예요.', '', '화면을 닫아도 이미 서비스로 보낸 사실은 남아요. 처음부터 넣지 않아요.'] },
      { t: 'q', kind: 'order', fig: 'q_pgOrder', q: 'Playground로 내 학습지를 처음 파싱해 보는 순서예요. 순서대로 쌓아 보세요.',
        items: ['콘솔 왼쪽 메뉴에서 Playground 아래 Document Parse를 연다', '개인정보가 없는 내 학습지 파일을 올린다', '요소마다 붙은 테두리와 이름표를 훑어본다', '훑어본 요소 중 표를 골라 결과가 칸의 짝을 지켰는지 확인한다'],
        why: '화면을 열어야 올리고, 올려야 결과가 나오고, 전체를 훑은 뒤에 표처럼 중요한 요소를 자세히 봐요.' },
      { t: 'sum', pts: ['콘솔 Playground → Document Parse에서 키 없이 견본·내 파일로 먼저 시험한다. 화면 모양은 바뀔 수 있다.', '결과는 요소마다 강조 표시와 category 이름표. 표·읽는 순서·머리말·그림을 눈여겨본다.', '엉성하면 mode(standard ↔ enhanced)를 바꿔 본다. 학생 개인정보가 든 문서는 올리지 않는다.'] }
    ]},

    /* =================== QA =================== */
    { id: 'QA', type: 'quiz', title: '헷갈림 퀴즈 ①', sub: 'OCR과 파싱, 세 가지 결과 꼴, standard와 enhanced', min: 4, steps: [
      { t: 'q', kind: 'mc', fig: 'qa_ocr', q: '스캔한 학습지를 두고 동료가 "OCR이랑 Document Parse는 같은 거 아냐?"라고 물어요. 가장 정확한 설명은?',
        opts: ['둘은 같은 일이다. 이름만 다르고 돌려주는 결과도 똑같다', 'OCR은 디지털 PDF에만, 파싱은 사진·스캔본에만 쓰는 기능이다', '파싱은 글자를 못 읽어서 늘 OCR을 먼저 따로 돌려야 한다', 'OCR은 글자만 읽고, 파싱은 표·제목 같은 구조까지 나눈다'], a: 3,
        why: 'OCR은 그림 속 글자를 알아보는 일이에요. Document Parse는 필요하면 안에서 OCR을 하고, 그 위에 요소를 나누고 이름(category)을 붙여 구조 있는 글로 돌려줘요.',
        ex: ['결과가 달라요. 파싱은 요소마다 category를 붙이고 표를 표로 돌려줘요.', '거꾸로에 가까워요. 디지털 PDF는 안의 글자를 쓰고, 이미지·스캔본은 OCR로 읽어요. Document Parse는 둘 다 받아요.', 'Document Parse는 필요하면 안에서 OCR을 해요(<code>ocr</code> 기본값 <code>auto</code>). 따로 돌릴 필요 없어요.', ''] },
      { t: 'q', kind: 'mc', fig: 'qa_three', q: '학습지를 파싱해 Solar 챗봇의 근거 자료로 넣으려 해요. <code>output_formats</code>로 무엇을 받는 게 공식 권장일까요?',
        opts: ['text. 글자만 남겨야 토큰이 적고 싸다', 'html. 웹 페이지처럼 표를 꾸밀 수 있다', 'markdown. 구조를 살린 채 글로 읽힌다', '셋은 내용이 같으니 기본값 그대로 둬도 된다'], a: 2,
        why: 'RAG·LLM에 넣을 때는 <b>markdown</b>을 권해요. 구조는 살리면서 태그가 적어 읽기 쉬워요.',
        ex: ['text는 표 구조가 사라져 칸의 짝을 잃어요.', 'html은 웹 화면에 보일 때 권장하는 꼴이에요.', '', '기본값은 html이에요. 셋은 꼴이 달라서 쓰임도 달라요.'] },
      { t: 'q', kind: 'mc', fig: 'qa_mode', q: '셀을 합친 복잡한 표와 막대그래프가 가득한 진로 통계 자료를 파싱했더니 표가 엉망이에요. 먼저 바꿔 볼 것은?',
        opts: ['<code>output_formats</code>를 text로 바꿔 표를 글로 받는다', '<code>mode</code>를 enhanced로 바꿔 다시 해 본다', '<code>ocr</code>을 force로 바꾸면 표가 저절로 고쳐진다', '<code>model</code>을 solar-pro4로 바꾼다'], a: 1,
        why: '<code>standard</code>는 글 위주·단순한 표에 맞고, <code>enhanced</code>는 복잡한 표·차트·스캔본을 더 잘 다뤄요. 대신 쪽당 값이 더 들어요.',
        ex: ['결과 꼴을 바꿔도 표를 알아보는 실력은 그대로예요. text면 오히려 구조가 사라져요.', '', 'ocr은 글자를 어디서 읽을지 정할 뿐이에요. 표가 복잡한 디지털 PDF에는 mode가 먼저예요.', 'solar-pro4는 대화 모델이에요. 파싱 모델은 document-parse예요.'] }
    ]},

    /* =================== L3 =================== */
    { id: 'L3', type: 'lesson', title: '요소와 카테고리 읽기', sub: '12가지 이름, 차트·수식, 비율 좌표', min: 12, steps: [
      { t: 'say', h: '결과의 알맹이는 elements 목록이에요', fig: 'elemCard', p: [
        'API로 받은 결과에는 문서 전체를 이은 <code>content</code>와, 요소 하나하나를 담은 <code>elements</code> 목록이 함께 와요. Playground에서 본 테두리 하나가 elements의 칸 하나예요.',
        '요소마다 번호(<code>id</code>), 이름(<code>category</code>), 쪽(<code>page</code>), 내용(<code>content</code>의 text·html·markdown), 위치(<code>coordinates</code>)가 있어요.'
      ], code: { lang: 'json', src: src(['{', '  "id": 5,', '  "category": "table",', '  "page": 1,', '  "content": {', '    "markdown": "| 입력 | 처리 | ...",', '    "html": "<table>...</table>",', '    "text": "입력 처리 출력 ..."', '  },', '  "coordinates": [{…}, {…}, {…}, {…}]', '}']) } },
      { t: 'say', h: '요소 이름(category)은 12가지예요', fig: 'twelve', table: { head: ['category', '뜻', '학습지에서 예'], rows: [
        ['<code>heading1</code>', '제목', '3단원 알고리즘과 프로그래밍'],
        ['<code>paragraph</code>', '문단', '활동 안내 글'],
        ['<code>list</code>', '목록', '학습 목표 두 줄'],
        ['<code>table</code>', '표', '입력·처리·출력 표'],
        ['<code>figure</code>', '그림', '순서도'],
        ['<code>chart</code>', '차트', '막대그래프'],
        ['<code>equation</code>', '수식', 'O(n²) 같은 식'],
        ['<code>caption</code>', '그림·표 설명', '[그림 1] 두 수의 합 순서도'],
        ['<code>header</code>', '머리말', '학교 이름'],
        ['<code>footer</code>', '꼬리말', '쪽 번호'],
        ['<code>index</code>', '목차·찾아보기', '교과서 차례'],
        ['<code>footnote</code>', '각주', '쪽 아래 짧은 풀이'] ] }, p: [
        '이 12가지가 공식 문서의 요소 이름 전부예요. 제목은 <code>heading1</code> 하나뿐이고, <code>heading2</code> 같은 이름은 없어요.',
        '최근 버전 안내에는 소제목 깊이를 <code>sub_category</code>로 알려 준다는 말이 있어요. 쓸 일이 생기면 공식 문서를 직접 확인해요.'
      ]},
      { t: 'say', h: '차트는 표로, 수식은 LaTeX로 나와요', fig: 'chartEq', p: [
        '<code>chart_recognition</code>이 기본으로 켜져 있어서, 막대·꺾은선·원그래프를 알아보면 <code>chart</code> 요소로 만들고 값을 표로 바꿔 줘요. 알아보지 못하면 <code>figure</code>가 되고 그림 속 글자만 남아요.',
        '수식은 <code>equation</code> 요소의 html·markdown에 <b>LaTeX</b>(수식을 글자로 적는 약속)로 들어가요. <code>text</code>는 OCR 결과라 수식에는 부정확할 수 있어요.',
        '그림 자체가 필요하면 요청에 <code>base64_encoding</code>을 넣어 잘라낸 그림을 받을 수 있어요(레슨 4).'
      ], code: { lang: 'plain', src: src(['markdown: $$O(n^{2})$$', 'text:     O(n2)']) } },
      { t: 'say', h: '좌표는 0~1 비율이에요', fig: 'coordBox', p: [
        '<code>coordinates</code>는 요소를 둘러싼 네모의 꼭짓점 네 개예요(왼위·오른위·오른아래·왼아래). 값은 픽셀이 아니라 쪽 너비·높이에 대한 <b>0~1 비율</b>이라, 실제 위치는 <code>x × 쪽 너비</code>, <code>y × 쪽 높이</code>로 구해요.',
        '비율이라서 화면이나 그림 크기가 달라도 같은 값으로 써요. 학생 화면에 원본 쪽을 띄우고 "이 그림을 보세요" 하며 네모를 그려 줄 때 쓸 수 있어요.',
        '쪽마다 맨 위·맨 아래 같은 자리에 되풀이되는 <code>header</code>·<code>footer</code>는 자료로 쓸 땐 소음이에요. 이름(category)으로 걸러 내는 법은 레슨 5에서 해요.'
      ]},
      { t: 'try', lang: 'py', h: '비율 좌표를 픽셀로 바꿔 봐요', p: '그림 요소의 네 꼭짓점을 픽셀로 바꿔요. 실행한 뒤 <code>W, H</code>를 <code>620, 877</code>로 바꿔 다시 실행하면, 같은 비율이 다른 픽셀이 되는 걸 볼 수 있어요.',
        src: src([
          '# figure 요소의 coordinates (0~1 비율)',
          'coords = [{"x": 0.30, "y": 0.62},',
          '          {"x": 0.70, "y": 0.62},',
          '          {"x": 0.70, "y": 0.85},',
          '          {"x": 0.30, "y": 0.85}]',
          '',
          '# A4 한 쪽을 150 DPI 그림으로 본 크기',
          'W, H = 1240, 1754',
          'xs = [round(p["x"] * W) for p in coords]',
          'ys = [round(p["y"] * H) for p in coords]',
          'print("왼쪽 위:", xs[0], ys[0])',
          'print("오른쪽 아래:", xs[2], ys[2])',
          'print("너비:", xs[1] - xs[0], "px")',
          'print("높이:", ys[2] - ys[1], "px")'
        ]),
        note: '비율이라서 쪽 크기가 바뀌어도 coordinates 값은 그대로예요.' },
      { t: 'q', kind: 'mc', mono: true, fig: 'q_twelveOdd', q: 'Document Parse가 돌려주는 요소 이름(category) 12가지에 <b>없는</b> 것은?',
        opts: ['footnote', 'caption', 'heading2', 'index'], a: 2,
        why: '제목은 <code>heading1</code> 하나뿐이에요. <code>heading2</code>는 12가지에 없어요. 소제목 깊이는 최근 버전에서 <code>sub_category</code>로 온다는 안내가 있으니 필요하면 직접 확인해요.',
        ex: ['footnote는 각주예요. 12가지에 있어요.', 'caption은 그림·표 설명이에요. 12가지에 있어요.', '', 'index는 목차·찾아보기예요. 12가지에 있어요.'] },
      { t: 'q', kind: 'mc', fig: 'q_eqFmt', q: '정보 학습지의 시간 복잡도 식 O(n²)이 <code>equation</code> 요소로 나왔어요. 이 요소의 <code>content.markdown</code>에는 어떤 꼴로 들어 있을까요?',
        opts: ['식 그림 파일의 주소', 'LaTeX로 적은 식', '"수식"이라는 낱말 하나', '좌표 숫자 네 쌍'], a: 1,
        why: '수식은 html·markdown에 <b>LaTeX</b>로 들어가요. MathJax 같은 도구로 다시 식 모양으로 그릴 수 있어요. <code>text</code>는 OCR 결과라 부정확할 수 있어요.',
        ex: ['그림이 필요하면 <code>base64_encoding</code>으로 따로 받아요. markdown에는 식이 글자로 들어가요.', '', '이름은 <code>category</code>에 있어요. 내용에는 식 자체가 들어가요.', '좌표는 <code>coordinates</code>에 따로 있어요.'] },
      { t: 'q', kind: 'blank', fig: 'q_ratio', q: '쪽 너비가 1240픽셀인 학습지에서, 그림 요소 왼쪽 위 꼭짓점의 <code>x</code>가 0.25예요. 실제로는 몇 픽셀 지점일까요?', lang: 'plain', code: 'x 비율 0.25 × 쪽 너비 1240px\n= [[1]]px',
        opts: ['310', '0.25', '1240', '4960'], a: 0,
        why: '좌표는 0~1 비율이라 쪽 너비를 곱해요. 0.25 × 1240 = 310이에요.',
        ex: ['', '0.25는 비율 그대로예요. 픽셀로 바꾸려면 쪽 너비를 곱해요.', '1240은 쪽 너비 전체, 곧 비율 1인 오른쪽 끝이에요.', '1240 × 4예요. 비율은 곱하는 거지 나누는 게 아니에요.'] },
      { t: 'q', kind: 'mc', fig: 'q_chartFail', q: '막대그래프가 있는 진로 통계 쪽을 파싱했는데, 그래프가 <code>chart</code>가 아니라 <code>figure</code>로 나오고 축 글자만 있어요. 무슨 뜻일까요?',
        opts: ['차트는 원래 늘 figure로 나온다', 'output_formats에 chart를 넣지 않아서다', '좌표가 1을 넘어서 그림 밖으로 나갔다', '차트 인식이 실패해 그림으로 처리됐다. 표로 바꾼 값은 없다'], a: 3,
        why: '차트 인식에 성공하면 <code>chart</code> 요소와 값 표가 나오고, 실패하면 <code>figure</code>로 그림 속 글자만 남아요. 이럴 땐 <code>mode</code>를 enhanced로 바꿔 보거나, 값을 직접 표로 적어 둬요.',
        ex: ['chart도 12가지 요소 이름에 있어요. 인식에 성공하면 chart로 나와요.', 'output_formats는 text·html·markdown 중에서 골라요. chart는 그 값이 아니에요.', '좌표는 늘 0~1 사이예요. 그림 밖으로 나가는 일은 없어요.', ''] },
      { t: 'q', kind: 'line', fig: 'q_lineCoord', q: '요소 하나를 꺼내 찍는 코드예요. 실행하면 오류가 나요. <b>틀린 줄</b>을 눌러 보세요.', lang: 'py', code: src(['e = data["elements"][4]', 'print(e["category"])', 'print(e["page"])', 'print(e["content"]["markdown"])', 'print(e["coordinates"]["x"])']), a: 4,
        why: '<code>coordinates</code>는 꼭짓점 네 개가 든 <b>목록</b>이에요. 글자 키로 바로 꺼낼 수 없어서 TypeError가 나요. <code>e["coordinates"][0]["x"]</code>처럼 몇 번째 꼭짓점인지 먼저 골라요.' },
      { t: 'sum', pts: ['API 결과 = content(전체) + elements(요소 목록). 요소마다 id·category·page·content·coordinates.', 'category 12가지: heading1·paragraph·list·table·figure·chart·equation·caption·header·footer·index·footnote. heading2는 없다.', '차트는 표로(실패하면 figure), 수식은 LaTeX. 좌표는 꼭짓점 4개의 0~1 비율.'] }
    ]},

    /* =================== L4 =================== */
    { id: 'L4', type: 'lesson', title: 'parse.py로 파싱하기', sub: 'requests 한 번, ocr·mode·비용·쪽수·형식', min: 14, steps: [
      { t: 'say', h: 'parse.py ① 주소와 키를 준비해요', fig: 'parseReq', p: [
        'Solar는 OpenAI SDK로 불렀지만, Document Parse는 파일을 보내야 해서 c1u3에서 깐 <code>requests</code>로 직접 보내요. 주소는 <code>https://api.upstage.ai/v1/document-digitization</code>예요.',
        'Playground와 달리 API는 키가 있어야 해요. <code>hello_solar.py</code>처럼 <code>.env</code>의 <code>UPSTAGE_API_KEY</code>를 읽어, 헤더에 <code>Authorization: Bearer 키</code>로 실어 보내요.'
      ], code: { lang: 'py', src: src(['import os, requests', 'from dotenv import load_dotenv', '', 'load_dotenv()', 'KEY = os.environ["UPSTAGE_API_KEY"]', 'URL = ("https://api.upstage.ai"', '       "/v1/document-digitization")']) } },
      { t: 'say', h: 'parse.py ② 파일을 보내고 Markdown을 받아요', fig: 'formData', p: [
        '파일은 <code>files</code>의 <code>document</code> 칸에, 설정은 <code>data</code>에 담아요. <code>output_formats</code>는 파이썬 리스트가 아니라 <b>JSON 글자</b> <code>\'["markdown"]\'</code>로 적어요. 빼면 기본값 html만 와요.',
        '<code>r.raise_for_status()</code>는 오류 응답이면 바로 멈추게 해요. c1u3에서 본 401(키)·403(크레딧)·429(너무 많은 요청)에 더해, 파일 쪽 오류인 <b>415</b>(지원 안 하는 파일)와 <b>422</b>(손상된 파일)도 여기서 걸려요.',
        '응답에서 <code>content.markdown</code>은 문서 전체, <code>elements</code>는 요소 목록, <code>usage.pages</code>는 처리한 쪽수예요.'
      ], code: { lang: 'py', src: src([`FMT = '["markdown"]'`, 'opts = {"model": "document-parse",', '        "output_formats": FMT}', 'with open("unit3.pdf", "rb") as f:', '    r = requests.post(URL,', '        headers={"Authorization":', '                 f"Bearer {KEY}"},', '        files={"document": f},', '        data=opts)', 'r.raise_for_status()', 'data = r.json()', 'md = data["content"]["markdown"]']) } },
      { t: 'say', h: 'ocr과 mode로 스캔본과 복잡한 표를 다뤄요', fig: 'ocrMode', table: { head: ['매개변수', '값', '언제'], rows: [
        ['<code>ocr</code>', '<code>auto</code>(기본)', '이미지만 OCR, 디지털 PDF·DOCX는 안의 글자'],
        ['', '<code>force</code>', '늘 OCR. 스캔본, 글자가 이상하게 나올 때'],
        ['<code>mode</code>', '<code>standard</code>(기본)', '글 위주·단순한 표. 싸고 빠름'],
        ['', '<code>enhanced</code>', '복잡한 표·차트·스캔본. 더 비쌈'],
        ['', '<code>auto</code>', '쪽마다 둘 중 하나를 고름'],
        ['<code>base64_encoding</code>', `<code>'["figure"]'</code> 등`, '잘라낸 그림·표 이미지도 받기'] ] }, p: [
        '지금 가격(2026년 10월, 부가세 별도)으로 standard는 쪽당 $0.01, enhanced는 쪽당 $0.03이에요. 20쪽 학습지를 standard로 파싱하면 약 $0.2예요. 가격은 바뀔 수 있으니 업스테이지 가격 페이지에서 확인해요.',
        '처음엔 기본값으로 한두 쪽만 돌려 보고, 결과가 엉성한 자료만 설정을 바꿔 다시 해요. 좌표(<code>coordinates</code>)와 차트 인식(<code>chart_recognition</code>)은 기본으로 켜져 있어요.'
      ], code: { lang: 'py', src: src(['opts["ocr"] = "force"', 'opts["mode"] = "enhanced"']) } },
      { t: 'say', h: '쪽수 한도와 받는 파일 형식을 알아 둬요', fig: 'bigDoc', table: { head: ['', '동기', '비동기'], rows: [
        ['주소', '<code>…/document-digitization</code>', '<code>…/document-digitization/async</code>'],
        ['쪽수', '100쪽까지(넘으면 앞 100쪽만)', '큰 문서(한도는 직접 확인)'],
        ['받는 것', '결과 JSON 바로', '<code>request_id</code> → 상태 확인 → 10쪽 묶음마다 <code>download_url</code>(15분 유효)'] ] }, p: [
        '한 번에 결과를 받는 <b>동기</b> 요청은 100쪽까지예요. 교과서처럼 큰 문서는 <b>비동기</b> 주소로 보내고, 받은 <code>request_id</code>로 <code>GET …/requests/{request_id}</code>를 불러 상태를 확인한 뒤 묶음마다 결과를 받아요. 결과는 30일 보관돼요.',
        '받는 형식은 JPEG, PNG, BMP, PDF, TIFF, HEIC, DOCX, PPTX, XLSX, <b>HWP, HWPX</b>, 크기는 50MB까지예요. 다만 2026년 5월 문서 기준이라, 학교 공문 HWP를 넣기 전에 최신 공식 문서를 직접 확인해요.'
      ]},
      { t: 'sim', h: 'parse.py를 돌려 봐요', p: 'upstage-lab에서 parse.py를 열고, 아래 터미널에서 실행해 봐요. 칸을 누르면 명령이 저절로 쳐져요.',
        scene: { win: 'ide', folder: 'upstage-lab', files: LAB, open: 'hello_solar.py', lang: 'py', code: HELLO, term: [] },
        steps: [
          { goal: '파일 목록에서 <code>parse.py</code>를 열어요', click: 'file:parse.py', then: { open: 'parse.py', code: PARSE_PY },
            say: '레슨의 두 조각을 이은 parse.py예요. 끝에 쪽수와 앞 요소 다섯 개의 page·category를 찍게 했어요.' },
          { goal: '터미널에 <code>python parse.py</code>를 쳐요', type: 'python parse.py', into: 'term',
            then: { term: ['$ python parse.py', '쪽수: 2', '1 header', '1 heading1', '1 list', '1 paragraph', '1 table'], prompt: '' },
            say: '2쪽짜리 학습지라 <code>usage.pages</code>가 2예요. 요소는 읽는 순서대로 와요. 연습 화면이라 진짜 결과와 개수가 다를 수 있어요.' },
          { goal: '<code>.gitignore</code>를 열어 <code>.env</code>가 있는지 봐요', click: 'file:.gitignore', then: { open: '.gitignore', lang: 'plain', code: src(['.env', '.venv/', '__pycache__/']) },
            say: '키가 든 <code>.env</code>는 커밋되지 않아요. 수업자료 PDF와 결과를 저장소에 올릴지는 저작권과 학교 지침을 보고 정해요.' } ],
        end: '키는 .env에, 첫 실행은 짧은 파일로.' },
      { t: 'q', kind: 'line', fig: 'q_lineBug', q: 'parse.py 끝부분이에요. 실행하면 <code>KeyError</code>가 나요. <b>틀린 줄</b>을 눌러 보세요.', lang: 'py', code: src(['r.raise_for_status()', 'data = r.json()', 'print(data["usage"]["pages"], "쪽")', 'md = data["markdown"]', 'print(md[:100])']), a: 3,
        why: '문서 전체 결과는 <code>content</code> 아래에 있어요. <code>data["content"]["markdown"]</code>으로 꺼내요. 맨 위에 있는 건 <code>content</code>, <code>elements</code>, <code>usage</code> 같은 칸이에요.' },
      { t: 'q', kind: 'mc', fig: 'q_scan', q: '10년 전에 종이로 낸 시험지를 스캐너로 읽은 PDF예요. 파싱하니 글자가 엉뚱하게 나오거나 비어서 나와요. 먼저 해 볼 설정은?',
        opts: [`<code>output_formats</code>를 <code>'["text"]'</code>로 바꾼다`, '<code>coordinates</code>를 꺼서 좌표를 받지 않는다', '<code>ocr</code>을 <code>"force"</code>로 해서 쪽마다 그림으로 보고 늘 OCR하게 한다', '<code>model</code>을 <code>"solar-pro4"</code>로 바꾼다'], a: 2,
        why: '<code>ocr="force"</code>는 파일을 그림으로 보고 늘 OCR해요. 스캔본처럼 안에 쓸 만한 글자가 없는 파일에 맞아요. 표까지 복잡하면 <code>mode</code>도 바꿔 봐요.',
        ex: ['결과 꼴만 바뀌어요. 글자를 읽는 방식은 그대로예요.', '좌표는 위치 정보일 뿐, 글자 인식과 상관없어요.', '', 'solar-pro4는 대화 모델이에요. 파싱은 document-parse로 해요.'] },
      { t: 'q', kind: 'mc', fig: 'q_cost', q: '표가 단순한 학습지 30쪽을 기본 <code>mode</code>(standard)로 파싱하면, 지금 가격으로 어림해 얼마일까요?(부가세 별도)',
        opts: ['약 $0.03', '약 $0.3', '약 $0.9', '약 $3'], a: 1,
        why: 'standard는 쪽당 $0.01이라 30쪽이면 약 $0.3이에요. enhanced(쪽당 $0.03)였다면 약 $0.9예요. 가격은 바뀔 수 있으니 가격 페이지에서 확인해요.',
        ex: ['$0.03은 enhanced 한 쪽 값이에요.', '', '$0.9는 30쪽을 enhanced로 했을 때예요.', '$3은 쪽당 $0.1로 잘못 계산한 값이에요.'] },
      { t: 'q', kind: 'mc', fig: 'q_300', q: '교육과정 해설서 PDF가 300쪽이에요. 빠짐없이 파싱하려면?',
        opts: ['동기 parse.py로 보내면 알아서 300쪽을 다 처리한다', '<code>mode</code>를 enhanced로 하면 쪽수 한도가 사라진다', '300쪽을 한 장짜리 긴 이미지로 이어 붙여 한 번에 보낸다', '비동기로 보내고 <code>request_id</code>로 묶음별 결과를 받는다'], a: 3,
        why: '동기는 100쪽까지라 앞 100쪽만 처리돼요. 큰 문서는 비동기로 보내 <code>request_id</code>로 상태를 보고, 10쪽 묶음마다 <code>download_url</code>에서 결과를 받아요.',
        ex: ['동기는 100쪽까지예요. 나머지 200쪽은 처리되지 않아요.', 'mode는 분석 방식이에요. 쪽수 한도와 상관없고 값만 더 들어요.', '한 쪽 크기(픽셀)에도 한도가 있고, 글자가 너무 작아져 읽기 어려워요.', ''] },
      { t: 'sum', pts: ['parse.py = requests.post(…/v1/document-digitization) + Bearer 키 + files의 document + data의 model·output_formats(JSON 글자).', '스캔본은 ocr="force", 복잡한 표·차트는 mode="enhanced"(쪽당 $0.03, standard는 $0.01). 오류는 raise_for_status로 잡는다.', '동기 100쪽까지, 큰 문서는 비동기(request_id → 묶음 결과). 형식에 HWP·HWPX(2026년 5월 문서), 50MB — 최신 목록은 직접 확인.'] }
    ]},

    /* =================== QB =================== */
    { id: 'QB', type: 'quiz', title: '헷갈림 퀴즈 ②', sub: '동기와 비동기, output_formats와 mode, 전체와 요소', min: 4, steps: [
      { t: 'q', kind: 'mc', fig: 'qb_ticket', q: '250쪽 교과서 PDF를 비동기 주소(<code>…/document-digitization/async</code>)로 보냈어요. 응답으로 바로 받는 것은?',
        opts: ['250쪽 전체의 markdown', '앞 100쪽의 결과', '<code>request_id</code>(번호표)', '처리가 끝났다는 안내 메일'], a: 2,
        why: '비동기는 바로 <code>request_id</code>(번호표)를 줘요. 그걸로 상태를 확인하고, 끝난 묶음의 <code>download_url</code>에서 결과를 받아요. 주소는 15분만 유효하니 받으면 바로 저장해요.',
        ex: ['결과는 처리가 끝난 뒤 묶음마다 따로 받아요.', '앞 100쪽만 처리하는 건 동기 요청이에요.', '', '번호표로 내가 직접 상태를 확인해요.'] },
      { t: 'q', kind: 'mc', fig: 'qb_twoKnobs', q: '"결과를 Markdown으로 받고 싶다"와 "복잡한 표를 더 꼼꼼히 분석하고 싶다". 각각 어느 매개변수를 바꿀까요?',
        opts: ['<code>output_formats</code> / <code>mode</code>', '<code>mode</code> / <code>output_formats</code>', '둘 다 <code>output_formats</code>', '<code>ocr</code> / <code>output_formats</code>'], a: 0,
        why: '<code>output_formats</code>는 결과의 <b>꼴</b>(text·html·markdown), <code>mode</code>는 <b>분석 방식</b>(standard·enhanced·auto)이에요.',
        ex: ['', '거꾸로예요. 꼴은 output_formats, 분석 방식은 mode예요.', 'output_formats는 꼴만 정해요. 분석을 꼼꼼히 하는 건 mode예요.', 'ocr은 글자를 어디서 읽을지 정하고, 분석을 꼼꼼히 하는 건 mode예요.'] },
      { t: 'q', kind: 'mc', fig: 'qb_whole', q: '학습지 30쪽에서 쪽마다 붙은 학교 이름(머리말)을 빼고 저장하려 해요. 무엇을 쓰면 쉬울까요?',
        opts: ['<code>content.markdown</code> 전체에서 학교 이름을 눈으로 찾아 지운다', '<code>elements</code>에서 header·footer 요소를 빼고 잇는다', '<code>content.text</code>를 받아 첫 줄만 지운다', '<code>mode</code>를 enhanced로 바꾸면 머리말이 빠진다'], a: 1,
        why: '<code>elements</code>는 요소마다 <code>category</code>가 붙어 있어 머리말·꼬리말만 골라 뺄 수 있어요. <code>content.markdown</code>은 이미 한 덩어리로 이어진 글이에요.',
        ex: ['30쪽이면 30번 찾아야 하고, 본문 속 같은 글자까지 지울 수 있어요.', '', 'text도 한 덩어리라 머리말은 첫 줄뿐 아니라 쪽마다 끼어 있어요.', 'enhanced는 분석을 꼼꼼히 할 뿐, 머리말을 빼 주지 않아요.'] }
    ]},

    /* =================== L5 =================== */
    { id: 'L5', type: 'lesson', title: '결과 다듬어 저장하기', sub: '머리말·꼬리말 빼기, 쪽 표시, data/*.md', min: 12, steps: [
      { t: 'say', h: '머리말·꼬리말은 자료에선 소음이에요', fig: 'noise', p: [
        '30쪽 학습지를 그대로 이으면 "한입고등학교 정보과"가 30번, 쪽 번호가 30번 끼어들어요. 나중에 검색할 때 엉뚱한 조각이 뽑히고, Solar에게 넘길 토큰만 늘어요.',
        '<code>content.markdown</code> 한 덩어리에서 이걸 지우기는 어려워요. 대신 <code>elements</code>에서 <code>category</code>가 <code>header</code>·<code>footer</code>인 요소를 빼고 다시 이으면 깔끔해요.'
      ], code: { lang: 'py', src: src(['data = r.json()', 'SKIP = {"header", "footer"}', 'keep = [e for e in data["elements"]', '        if e["category"] not in SKIP]', 'print(f"{len(keep)}개 남김")']) } },
      { t: 'say', h: '쪽 표시를 달아 두면 출처가 돼요', fig: 'pageTag', p: [
        '쪽이 바뀔 때마다 <code>[3쪽]</code> 같은 줄을 넣어 두면, c3u1에서 만들 보조 에이전트가 "학습지 3쪽에 있어요"처럼 근거를 밝힐 수 있어요. 학생도 원본 쪽을 펴서 확인할 수 있고요.',
        '요소마다 <code>page</code>가 있으니, 앞 요소와 쪽이 달라질 때만 표시를 넣으면 돼요. 요소 사이는 빈 줄로 이어야 Markdown 표와 제목이 서로 들러붙지 않아요.'
      ], code: { lang: 'py', src: src(['parts, now = [], 0', 'for e in keep:', '    if e["page"] != now:', '        now = e["page"]', '        parts.append(f"[{now}쪽]")', '    text = e["content"]["markdown"]', '    parts.append(text)', 'md = "\\n\\n".join(parts)']) } },
      { t: 'say', h: '표만 모으고, data 폴더에 저장해요', fig: 'saveMd', p: [
        '<code>category</code>가 <code>table</code>인 요소만 모으면 학습지의 표만 따로 볼 수 있어요. c2u2에서 문항·정답을 뽑을 때 좋은 재료예요.',
        '결과는 <code>data/unit3.md</code>처럼 원본 이름을 따라 저장해요. 학교 Windows PC는 기본 인코딩이 달라 한글이 깨질 수 있으니 <code>encoding="utf-8"</code>을 꼭 적어요.'
      ], code: { lang: 'py', src: src(['from pathlib import Path', '', 'tables = [e for e in keep', '          if e["category"] == "table"]', 'out = Path("data") / "unit3.md"', 'out.parent.mkdir(exist_ok=True)', 'out.write_text(md, encoding="utf-8")', 'print("저장:", out)']) },
        tip: '응답 JSON 전체도 <code>data/unit3.json</code>으로 저장해 두면, 다듬는 코드를 고칠 때마다 API를 다시 부르지(돈을 쓰지) 않아도 돼요.' },
      { t: 'try', lang: 'py', h: '흉내 낸 elements를 다듬어 봐요', p: 'Document Parse 응답의 <code>elements</code>를 딕셔너리로 흉내 냈어요. 실행해 보고, <code>SKIP</code>에 <code>"caption"</code>을 더하거나 쪽 표시를 <code>[p.1]</code> 꼴로 바꿔 보세요.',
        src: src([
          '# Document Parse 응답의 elements 흉내',
          'def el(page, cat, md):',
          '    return {"page": page, "category": cat,',
          '            "content": {"markdown": md}}',
          '',
          'T = ("| 입력 | 출력 |\\n"',
          '     "| --- | --- |\\n"',
          '     "| 두 수 | 합 |")',
          'elements = [',
          '    el(1, "header", "한입고 정보과"),',
          '    el(1, "heading1", "# 3단원 학습지"),',
          '    el(1, "table", T),',
          '    el(1, "footer", "- 1 -"),',
          '    el(2, "header", "한입고 정보과"),',
          '    el(2, "paragraph", "순서도를 그려 봐요."),',
          '    el(2, "footer", "- 2 -"),',
          ']',
          '',
          'SKIP = {"header", "footer"}',
          'keep = [e for e in elements',
          '        if e["category"] not in SKIP]',
          '',
          'parts, now = [], 0',
          'for e in keep:',
          '    if e["page"] != now:',
          '        now = e["page"]',
          '        parts.append(f"[{now}쪽]")',
          '    parts.append(e["content"]["markdown"])',
          '',
          'print("\\n\\n".join(parts))',
          'print("=" * 20)',
          'tables = [e for e in keep',
          '          if e["category"] == "table"]',
          'print(f"뺀 요소: {len(elements) - len(keep)}개")',
          'print(f"표: {len(tables)}개")'
        ]),
        note: '진짜 parse.py에서는 elements 자리에 data["elements"]가 들어가요.' },
      { t: 'q', kind: 'mc', fig: 'q_whyPage', q: '저장한 Markdown에 <code>[3쪽]</code> 같은 쪽 표시를 넣어 두는 가장 큰 까닭은?',
        opts: ['Markdown 문법상 쪽 표시가 없으면 파일이 열리지 않는다', '쪽 표시를 넣으면 Document Parse 요금이 줄어든다', 'Solar는 쪽 표시가 있어야만 한국어를 읽는다', '나중에 챗봇이 "3쪽에 있어요"처럼 출처를 밝힐 수 있다'], a: 3,
        why: '쪽 표시는 근거의 주소예요. 보조 에이전트가 출처를 밝히고, 학생과 교사가 원본을 펴서 확인할 수 있게 해 줘요.',
        ex: ['Markdown은 쪽 표시 없이도 잘 열려요.', '요금은 파싱할 때 이미 쪽 수로 정해졌어요. 저장 모양과 상관없어요.', 'Solar는 쪽 표시와 상관없이 한국어를 읽어요.', ''] },
      { t: 'q', kind: 'blank', fig: 'q_notIn', q: '머리말·꼬리말을 뺀 요소만 남기려 해요. 빈칸에 알맞은 것은?', lang: 'py', code: src(['SKIP = {"header", "footer"}', 'keep = [e for e in elements', '        if e["category"] [[1]] SKIP]']),
        opts: ['not in', 'in', '!=', '=='], a: 0,
        why: '<code>not in</code>은 "SKIP 안에 없으면"이라는 뜻이에요. header·footer가 아닌 요소만 남아요.',
        ex: ['', '<code>in</code>이면 거꾸로 머리말·꼬리말만 남아요.', '글자와 집합을 <code>!=</code>로 비교하면 늘 True라서 아무것도 안 걸러져요.', '글자와 집합은 같을 일이 없어 늘 False라서 모두 빠져요.'] },
      { t: 'q', kind: 'order', fig: 'q_cleanOrder', q: 'parse.py의 결과를 자료 파일로 다듬는 순서예요. 순서대로 쌓아 보세요.',
        items: ['<code>r.json()</code>에서 <code>elements</code> 목록을 꺼낸다', 'category가 header·footer인 요소를 뺀다', '쪽이 바뀔 때마다 <code>[3쪽]</code> 같은 표시를 넣으며 markdown을 잇는다', '<code>data/unit3.md</code>에 utf-8로 저장한다'],
        why: '목록을 꺼내야 거를 수 있고, 걸러 낸 요소를 이어야 깨끗한 글이 되고, 다 이은 뒤에 저장해요. 잇고 나면 한 덩어리라 거르기 어려워서 거르기가 먼저예요.' },
      { t: 'q', kind: 'mc', fig: 'q_broken', q: '학교 Windows PC에서 parse.py가 저장한 <code>unit3.md</code>를 다른 프로그램으로 열었더니 한글이 깨져 보여요. parse.py에서 고칠 곳은?',
        opts: ['output_formats를 html로 바꿔 한글을 태그로 감싼다', '저장할 때 <code>encoding="utf-8"</code>을 적는다', '파일 이름을 영어로만 바꾸면 내용 한글도 고쳐진다', 'mode를 enhanced로 바꿔 다시 파싱한다'], a: 1,
        why: 'Windows는 인코딩을 적지 않으면 다른 기본값으로 저장할 수 있어요. <code>encoding="utf-8"</code>을 적으면 어느 컴퓨터에서나 한글이 그대로예요.',
        ex: ['결과 꼴을 바꿔도 저장할 때의 인코딩 문제는 그대로예요.', '', '파일 이름과 내용의 인코딩은 따로예요.', '파싱은 제대로 됐어요. 저장하는 순간의 인코딩 문제예요.'] },
      { t: 'sum', pts: ['header·footer는 elements에서 category로 걸러 낸다. content.markdown 한 덩어리보다 쉽다.', '쪽이 바뀔 때 [3쪽] 표시를 넣어 잇는다 → 나중에 출처가 된다. 요소 사이는 빈 줄.', '표만 모아 두면 c2u2의 재료. data/*.md에 encoding="utf-8"로 저장하고, 응답 JSON도 저장해 다시 부르지 않는다.'] }
    ]},

    /* =================== M1 =================== */
    { id: 'M1', type: 'mission', title: '내 수업자료를 Markdown으로 바꾸기', sub: '콘솔과 내 Cursor에서 직접', min: 35,
      where: '업스테이지 콘솔 + upstage-lab 폴더',
      intro: '이번 단원에서 배운 것을 진짜 콘솔과 내 Cursor로 해 봐요. 자료는 <b>학생 개인정보가 없는 내 수업자료</b>만 써요: 2~5쪽 학습지 PDF 하나, 같은 학습지의 스캔본이나 휴대폰 사진 하나. 끝낸 것부터 체크하고, 한 줄 메모를 남겨요.',
      tasks: [
        { do: '시작 전에 upstage-lab을 커밋하고 자료를 준비해요',
          how: 'Cursor 터미널에서 <code>git status</code>를 보고 <code>git add -A</code>, <code>git commit -m "c2u1 시작 전"</code>. 커밋한 뒤에 학습지 PDF를 <code>unit3.pdf</code>처럼 짧은 이름으로 폴더에 복사해 둬요.',
          check: '<code>git log --oneline</code> 맨 위에 방금 커밋이 보이고, <code>git status</code>에 <code>.env</code>가 한 번도 나오지 않으면 성공.' },
        { do: 'Playground에서 내 학습지를 파싱해 봐요',
          how: '콘솔 왼쪽 메뉴의 <b>Playground</b> 아래 <b>Document Parse</b>에서 학습지를 올려요. 화면 모양이 이 앱과 다르면 Playground 아래 Document Parse를 찾아요.',
          check: '표가 <code>table</code>로 나왔는지, <code>header</code>·<code>footer</code> 이름표가 어디 붙었는지 메모에 한 줄로 적었으면 성공(예: "표 1개 table, 학교 이름 header").' },
        { do: 'Cursor 에이전트에게 parse.py를 맡기고 직접 실행해요',
          how: 'upstage-lab을 Cursor로 열고 Agent에게 아래 부탁을 붙여 넣어요. 코드가 오면 키를 화면에 찍는 줄이 없는지 먼저 읽고, 터미널에서 <code>python parse.py unit3.pdf</code>를 직접 실행해요.',
          check: '쪽수와 앞 요소 다섯 개의 category가 찍히고, <code>data/unit3.json</code>이 생겼으면 성공.',
          prompt: PROMPT_PARSE },
        { do: '스캔본을 ocr force로 파싱해 디지털 PDF와 비교해요',
          how: '같은 학습지의 스캔본이나 사진(예: <code>unit3_scan.pdf</code>)을 폴더에 넣고 <code>python parse.py unit3_scan.pdf --ocr force</code>로 실행해요. 결과는 <code>data/unit3_scan.json</code>으로 따로 저장돼요.',
          check: '두 결과의 요소 개수와 표 칸 글자를 비교해, 다른 점 하나를 메모에 적었으면 성공(차이가 없다면 "같음"도 결과예요).' },
        { do: '에이전트에게 머리말·꼬리말 걸러 내기를 맡겨요',
          how: '아래 부탁을 보내고, 만들어진 코드에 <code>header</code>·<code>footer</code>를 빼는 줄과 <code>encoding="utf-8"</code>이 있는지 읽어 본 뒤 <code>python clean.py data/unit3.json</code>으로 실행해요. API를 다시 부르지 않으니 돈이 들지 않아요.',
          check: '<code>data/unit3.md</code>에 학교 이름(머리말 글자)이 남아 있지 않고, <code>[1쪽]</code> 같은 쪽 표시가 들어 있으면 성공.',
          prompt: PROMPT_CLEAN },
        { do: '쓴 비용을 확인하고 커밋해요',
          how: '콘솔 <b>Billing</b>의 <b>Usage</b>에서 오늘 사용량을 보고, 어림(standard 쪽당 $0.01)과 비교해요. 그다음 <code>parse.py</code>·<code>clean.py</code>를 커밋해요. 수업자료 원본과 <code>data/</code>를 저장소에 올릴지는 저작권과 학교 지침을 보고 정하고, 망설여지면 <code>.gitignore</code>에 <code>data/</code>와 <code>*.pdf</code>를 넣어요.',
          check: 'Usage에서 본 사용량과 내 어림을 메모에 적고, <code>.env</code> 없이 커밋이 끝났으면 성공.' }
      ],
      note: '예상 비용(지금 가격, 부가세 별도): 학습지 5쪽 standard ≈ $0.05, 스캔본 2쪽 ≈ $0.02. 실수로 enhanced로 돌리면 쪽당 세 배($0.03)예요. 모두 합쳐도 $0.1 안팎이라 새 계정 무료 크레딧 $10으로 넉넉해요. 처음엔 2쪽짜리 짧은 파일로 시험하고, 100쪽 넘는 교과서를 통째로 보내지 않아요. 키는 <code>.env</code>에만 두고 코드·스크린샷·채팅에 붙이지 않아요.' },

    /* =================== T1 =================== */
    { id: 'T1', type: 'test', title: '단원 형성평가', sub: '10문제 · 7문제 이상 맞히면 통과', min: 12, pass: 0.7, steps: [
      { t: 'q', kind: 'mc', fig: 't_415', q: '연수장에서 옆자리 선생님이 parse.py에 발표 자료 <code>lesson.key</code>(Keynote 파일)를 넣었더니 <code>415</code> 오류가 났어요. 가장 알맞은 대처는?',
        opts: ['API 키가 틀렸으니 새 키를 만든다', 'PDF로 내보낸 뒤 그 파일로 다시 보낸다', '크레딧이 떨어졌으니 Billing에서 충전한다', '잠시 기다렸다 같은 파일을 다시 보낸다'], a: 1,
        why: '415는 지원하지 않는 파일이라는 뜻이에요. Keynote 파일은 지원 형식에 없으니, PDF처럼 지원하는 형식으로 내보내 다시 보내요.',
        ex: ['키 문제는 401이에요.', '', '크레딧 부족은 403이에요.', '기다렸다 다시 보내는 건 429나 5xx일 때예요. 파일이 그대로면 결과도 그대로예요.'] },
      { t: 'q', kind: 'mc', fig: 't_100', q: '연수 실습에서 120쪽짜리 교과서 PDF를 parse.py(동기)로 보냈더니, 오류 없이 끝났는데 <code>usage.pages</code>가 100이에요. 왜일까요?',
        opts: ['PDF의 뒤 20쪽이 빈 쪽이라 세지 않았다', '연수장 와이파이가 느려 뒤 20쪽이 전송 중에 사라졌다', '무료 크레딧으로는 100쪽까지만 처리된다', '동기 요청은 100쪽까지라 앞 100쪽만 처리됐다'], a: 3,
        why: '동기 요청은 100쪽까지 처리해요. 남은 쪽까지 하려면 비동기로 보내거나, 파일을 나눠 보내요.',
        ex: ['빈 쪽 여부가 아니라 동기 요청의 쪽수 한도 때문이에요.', '네트워크가 느리면 오류가 나지, 쪽이 조용히 빠지지 않아요.', '크레딧과 쪽수 한도는 상관없어요.', ''] },
      { t: 'q', kind: 'blank', fig: 't_blank2', q: 'parse.py에서 Document Parse에 보낼 값을 적고 있어요. 두 빈칸을 채워 보세요.', lang: 'py', code: src(['opts = {"model": [[1]],', '        "output_formats": [[2]]}']),
        opts: [['"solar-pro4"', `'["markdown"]'`], ['"information-extract"', `'["html"]'`], ['"document-parse"', `'["markdown"]'`], ['"document-parse"', '"standard"']], a: 2,
        why: '모델은 <code>"document-parse"</code>, 결과 꼴은 JSON 글자 <code>\'["markdown"]\'</code>이에요.',
        ex: ['첫 칸이 틀렸어요. solar-pro4는 대화 모델이에요.', 'information-extract는 c2u2에서 쓸 추출 모델이에요. 주소와 부르는 법이 달라요.', '', '둘째 칸이 틀렸어요. "standard"는 mode의 값이에요. output_formats에는 받을 꼴을 적어요.'] },
      { t: 'q', kind: 'line', fig: 't_lineLoop', q: '머리말·꼬리말을 빼려고 쓴 코드인데, 결과에 머리말·꼬리말만 남았어요. <b>틀린 줄</b>을 눌러 보세요.', lang: 'py', code: src(['SKIP = {"header", "footer"}', 'keep = []', 'for e in data["elements"]:', '    if e["category"] in SKIP:', '        keep.append(e)', 'print(f"{len(keep)}개 남김")']), a: 3,
        why: '<code>in SKIP</code>이면 header·footer만 담겨요. 빼려면 <code>if e["category"] not in SKIP:</code>이어야 해요.' },
      { t: 'q', kind: 'order', fig: 't_asyncOrder', q: '300쪽 교육과정 해설서를 비동기로 파싱해요. 순서대로 쌓아 보세요.',
        items: ['<code>…/document-digitization/async</code>로 파일을 보낸다', '응답에서 <code>request_id</code>를 받아 둔다', '<code>GET …/requests/{request_id}</code>로 상태를 확인한다', '끝난 묶음의 <code>download_url</code>에서 결과 JSON을 받는다'],
        why: '보내야 번호표가 오고, 번호표가 있어야 상태를 확인하고, 끝난 묶음이 있어야 결과를 받아요. download_url은 15분만 유효해서 상태를 다시 보면 새 주소를 줘요.' },
      { t: 'q', kind: 'mc', fig: 't_equation', q: '이진수 식이 든 수학 융합 학습지를 파싱해, 식을 웹 화면에 정확히 다시 그리려 해요. <code>equation</code> 요소에서 어느 값을 쓰는 게 좋을까요?',
        opts: ['<code>content.text</code>. 사람이 보는 글자 그대로라 가장 정확하다', '<code>content.markdown</code>. 식이 LaTeX로 적혀 있다', '<code>coordinates</code>. 식의 위치가 곧 내용이다', '<code>category</code>. 이름에 식이 들어 있다'], a: 1,
        why: 'equation 요소의 html·markdown에는 식이 LaTeX로 들어가요. MathJax 같은 도구로 식 모양을 다시 그릴 수 있어요.',
        ex: ['text는 OCR 결과라 수식에는 부정확할 수 있어요.', '', '좌표는 위치일 뿐 식의 내용이 아니에요.', 'category는 "equation"이라는 이름뿐이에요.'] },
      { t: 'q', kind: 'mc', fig: 't_figureCrop', q: '학습지의 순서도 그림만 잘라 수업 슬라이드에 넣고 싶어요. 요청에 무엇을 더할까요?',
        opts: [`<code>"base64_encoding": '["figure"]'</code>`, '<code>"ocr": "force"</code>', '<code>"mode": "standard"</code>', `<code>"output_formats": '["html", "markdown"]'</code>`], a: 0,
        why: '<code>base64_encoding</code>에 요소 이름을 적으면 그 요소를 잘라낸 이미지를 함께 받아요. 응답이 커질 수 있으니 필요한 요소만 적어요.',
        ex: ['', 'ocr은 글자를 읽는 방식이에요. 그림을 잘라 주지 않아요.', 'standard는 기본 분석 방식이에요. 그림 이미지는 따로 청해야 와요.', '결과 꼴만 정해요. 잘라낸 그림 이미지는 base64_encoding으로 따로 청해요.'] },
      { t: 'q', kind: 'mc', fig: 't_autoMode', q: '40쪽 자료 중 4쪽만 표·그래프가 복잡해요. 전부 enhanced로 하면 지금 가격으로 약 $1.2예요. 비용을 아끼면서 복잡한 쪽도 챙기려면?',
        opts: ['<code>mode</code>를 <code>"auto"</code>로 해서 쪽마다 standard·enhanced 중 하나를 고르게 한다', '<code>ocr</code>을 force로 하면 enhanced 값이 붙지 않는다', 'output_formats를 text로 받으면 쪽당 가격이 내려간다', '40쪽 전부 enhanced로 하는 수밖에 없다'], a: 0,
        why: '<code>mode="auto"</code>는 쪽마다 standard와 enhanced 중 하나를 골라요. 복잡한 4쪽만 enhanced로 매겨진다면 약 $0.36 + $0.12 = $0.48 정도예요. 복잡한 쪽만 따로 떼어 보내는 방법도 있어요.',
        ex: ['', 'ocr과 mode는 따로예요. ocr을 바꿔도 mode 값은 그대로 매겨져요.', '가격은 쪽과 mode로 정해져요. 결과 꼴과 상관없어요.', 'auto로 쪽마다 고르거나 복잡한 쪽만 따로 보낼 수 있어요.'] },
      { t: 'q', kind: 'mc', fig: 't_web', q: '학급 게시판 웹 페이지에 학습지 내용을 표까지 그대로 보여 주려 해요. 공식 권장에 맞는 결과 꼴은?',
        opts: ['markdown', 'text', 'html', 'coordinates'], a: 2,
        why: '웹 화면에 보일 때는 <b>html</b>, LLM에 넣을 때는 <b>markdown</b>을 권해요.',
        ex: ['markdown은 LLM·RAG에 넣을 때 권장해요. 웹에 보이려면 한 번 더 바꿔야 해요.', 'text는 표 구조가 사라져요.', '', 'coordinates는 위치 정보예요. 결과 꼴이 아니에요.'] },
      { t: 'q', kind: 'mc', fig: 't_privacy', q: '연수 실습 시간에 "내 수업자료로 파싱해 보세요"라고 해요. 다음 중 올려도 되는 것은?',
        opts: ['학생 이름과 점수가 적힌 수행평가 채점표 스캔본', '학생 상담 내용을 정리한 HWP 파일', '학생이 이름을 적어 낸 손글씨 답안지 사진', '내가 만든 3단원 학습지 PDF(개인정보 없음)'], a: 3,
        why: '실습에는 개인정보가 없는 내 수업자료나 공개 자료만 써요. 학생 이름·성적·상담 기록은 넣지 않고, 학교·교육청 지침을 먼저 확인해요.',
        ex: ['이름과 점수는 학생 개인정보예요.', '상담 기록은 특히 민감한 학생 정보예요.', '이름이 적힌 답안지도 개인정보예요. 손글씨라고 다르지 않아요.', ''] }
    ]}
    ]
  });
})();
