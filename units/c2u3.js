// 과정 2 · 단원 3 · 임베딩과 검색: 자료에서 근거 찾기
(function () {
  function src(a) { return a.join('\n'); }

  /* ---------- 그림 도우미 ---------- */
  // 학습지 쪽지 위의 흐린 줄
  function lines(P, x, y, w, n, gap) {
    for (let i = 0; i < n; i++) P.line(x, y + i * (gap || 12), x + w - (i % 3) * 8, y + i * (gap || 12), { c: 'soft', w: 2 });
  }
  // 잘라 낸 조각(종이 띠)
  function piece(P, x, y, w, h, fill, label, size) {
    P.rrect(x, y, w, h, 4, { fill: fill || 'paper', gap: 4, w: 1.4 });
    if (label) P.text(x + w / 2, y + h / 2 + (size || 12) * 0.36, label, { size: size || 12, weight: 700 });
  }
  // 조각 더미(5장)
  function pile(P, x, y, fill) {
    for (let i = 0; i < 5; i++) P.rrect(x + i * 3, y + i * 8, 70, 14, 4, { fill: fill || 'hi', gap: 4, w: 1.3 });
  }
  // 숫자 목록(벡터) 칸
  function cells(P, x, y, vals, cw, fill) {
    vals.forEach((v, i) => {
      P.rect(x + i * cw, y, cw, 22, { w: 1.4, fill: fill, gap: 6 });
      P.text(x + i * cw + cw / 2, y + 15, v, { size: 10, mono: true });
    });
  }
  // 뜻 지도의 점(+ 이름표)
  function dot(P, x, y, c, label, left, size) {
    P.circle(x, y, 10, { fill: c || 'accent', fs: 'solid', w: 1.2 });
    if (label) P.text(left ? x - 9 : x + 9, y + 4, label, { size: size || 11, anchor: left ? 'end' : 'start' });
  }
  // 질문 별
  function star(P, cx, cy, r, c) {
    let d = '';
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r;
      d += (i ? ' L' : 'M') + (cx + rr * Math.cos(a)).toFixed(1) + ' ' + (cy + rr * Math.sin(a)).toFixed(1);
    }
    P.path(d + ' Z', { fill: c || 'warm', fs: 'solid', w: 1.4 });
  }
  // 원점에서 뻗는 화살표(deg: 오른쪽 0, 위쪽 90)
  function ray(P, ox, oy, len, deg, c, w) {
    const r = deg * Math.PI / 180, x = ox + len * Math.cos(r), y = oy - len * Math.sin(r);
    P.arrow(ox, oy, x, y, { c: c || 'accent', w: w || 2.6, head: 10 });
    return [x, y];
  }
  // 두 화살표 사이 각도 호
  function arc(P, ox, oy, r, d1, d2, c) {
    const pt = (d, rr) => [ox + rr * Math.cos(d * Math.PI / 180), oy - rr * Math.sin(d * Math.PI / 180)];
    const n = Math.ceil((d2 - d1) / 60), st = (d2 - d1) / n;
    for (let i = 0; i < n; i++) {
      const a = d1 + i * st, b = a + st, k = r / Math.cos(st / 2 * Math.PI / 180);
      const [x1, y1] = pt(a, r), [cx, cy] = pt((a + b) / 2, k), [x2, y2] = pt(b, r);
      P.path(`M${x1.toFixed(1)} ${y1.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`, { c: c || 'warm', w: 2 });
    }
  }
  // 점수 막대(이름은 왼쪽, hi개까지 초록)
  function bars(P, x, y, rows, hi, bw, num) {
    rows.forEach((r, i) => {
      const yy = y + i * 24, len = Math.max(6, bw * r[1]);
      P.text(x + 76, yy + 13, r[0], { size: 12, anchor: 'end' });
      P.rrect(x + 82, yy + 2, len, 14, 4, { fill: i < hi ? 'good' : 'soft', fs: 'solid', w: 1.2 });
      if (num !== false) P.text(x + 88 + len, yy + 13, r[1].toFixed(2), { size: 11, mono: true, anchor: 'start' });
    });
  }
  // 검색창
  function searchBox(P, x, y, w, q, size) {
    P.rrect(x, y, w, 30, 15, { fill: 'paper', fs: 'solid', w: 1.8 });
    P.circle(x + 18, y + 14, 12, { w: 1.8 });
    P.line(x + 22, y + 18, x + 27, y + 23, { w: 2.2 });
    if (q) P.text(x + 34, y + 20, q, { size: size || 12, anchor: 'start' });
  }
  // 터미널 상자와 한 줄
  function term(P, x, y, w, h) { P.rrect(x, y, w, h, 8, { fill: 'ink', fs: 'solid' }); }
  function tline(P, x, y, s, c, size) { P.text(x, y, s, { mono: true, size: size || 11, anchor: 'start', c: c || 'paper' }); }
  // 사람(어깨 + 머리 + 얼굴). bottom = 어깨 아래 끝
  function person(P, cx, bottom, mood, s) {
    s = s || 1;
    P.path(`M${cx - 40 * s} ${bottom} Q${cx} ${bottom - 64 * s} ${cx + 40 * s} ${bottom}`, { fill: 'sky', gap: 6 });
    P.circle(cx, bottom - 90 * s, 62 * s, { fill: 'paper' });
    P.face(cx, bottom - 88 * s, 50 * s, { mood: mood || 'smile' });
  }
  // 글자가 든 단추
  function chip(P, x, y, w, h, label, fill, size) {
    P.rrect(x, y, w, h, 8, { fill: fill || 'paper', gap: 5, w: 1.6 });
    P.text(x + w / 2, y + h / 2 + (size || 13) * 0.36, label, { size: size || 13, weight: 700 });
  }
  // 동전
  function coin(P, x, y, d) {
    P.circle(x, y, d, { fill: 'hi', fs: 'solid', w: 1.8 });
    P.text(x, y + d * 0.16, '$', { size: Math.round(d * 0.45), weight: 700 });
  }
  // 폴더
  function folder(P, x, y, w, h, fill) {
    P.path(`M${x} ${y + 10} L${x} ${y + h} L${x + w} ${y + h} L${x + w} ${y + 10} L${x + w * 0.45} ${y + 10} L${x + w * 0.38} ${y} L${x} ${y} Z`, { fill: fill || 'hi', gap: 7 });
  }
  // 흩어진 카드(순서 문제용)
  function card(P, x, y) { P.rrect(x, y, 92, 70, 10, { fill: 'paper' }); }
  function cross(P, cx, cy, r, c) {
    P.line(cx - r, cy - r, cx + r, cy + r, { c: c || 'bad', w: 3 });
    P.line(cx + r, cy - r, cx - r, cy + r, { c: c || 'bad', w: 3 });
  }
  function tick(P, cx, cy, r) { P.path(`M${cx - r} ${cy} L${cx - r * 0.3} ${cy + r * 0.7} L${cx + r} ${cy - r * 0.7}`, { c: 'good', w: 3.2 }); }
  function ask(P, x, y, size, c) { P.text(x, y, '?', { size: size || 22, weight: 700, c: c || 'warm' }); }

  /* ---------- 모의 화면에서 되풀이하는 조각 ---------- */
  const LAB1 = ['.env', '.gitignore', 'AGENTS.md', 'hello_solar.py', 'parse.py', 'extract.py', 'embed.py', 'data/'];
  const HELLO = src(['import os', 'from dotenv import load_dotenv', 'from openai import OpenAI', '', 'load_dotenv()', 'client = OpenAI(', '    api_key=os.environ["UPSTAGE_API_KEY"],', '    base_url="https://api.upstage.ai/v1",', ')', 'MODEL = "solar-pro4"']);
  const EMBED_PY = src([
    'import os',
    'from dotenv import load_dotenv',
    'from openai import OpenAI',
    '',
    'load_dotenv()',
    'client = OpenAI(',
    '    api_key=os.environ["UPSTAGE_API_KEY"],',
    '    base_url="https://api.upstage.ai/v1",',
    ')',
    'Q_MODEL = "solar-embedding-2-query"',
    'P_MODEL = "solar-embedding-2-passage"',
    '',
    'q = client.embeddings.create(',
    '    model=Q_MODEL, input=["반복문은 언제 끝나요?"])',
    'print("질문 벡터 길이:", len(q.data[0].embedding))',
    '',
    'chunks = ["while은 조건이 거짓이면 멈춰요.",',
    '          "for는 정해진 횟수만큼 반복해요.",',
    '          "자료를 가공하면 정보가 돼요."]',
    'p = client.embeddings.create(model=P_MODEL, input=chunks)',
    'print(f"조각 {len(chunks)}개 → 벡터 {len(p.data)}개")'
  ]);
  const AGENTS_MD = src([
    '# upstage-lab 규칙',
    '- 답과 설명은 한국어로',
    '- 채팅 모델: MODEL = "solar-pro4"',
    '- 임베딩: Q_MODEL = "solar-embedding-2-query"',
    '  P_MODEL = "solar-embedding-2-passage"',
    '- 옛 이름(embedding-query, solar-embedding-1-large,',
    '  solar-pro3)은 쓰지 않기',
    '- 키는 .env의 UPSTAGE_API_KEY. 코드·출력에 키 금지'
  ]);
  const LAB2 = ['.env', '.gitignore', 'AGENTS.md', 'chunks.json', 'vectors.json', 'embed.py', 'search.py', 'data/'];
  const SEARCH_PY = src([
    'import json, math, os, sys',
    'from dotenv import load_dotenv',
    'from openai import OpenAI',
    '',
    'load_dotenv()',
    'client = OpenAI(',
    '    api_key=os.environ["UPSTAGE_API_KEY"],',
    '    base_url="https://api.upstage.ai/v1",',
    ')',
    'Q_MODEL = "solar-embedding-2-query"',
    '',
    'with open("vectors.json", encoding="utf-8") as f:',
    '    chunks = json.load(f)',
    '',
    'def length(v):',
    '    s = sum(x * x for x in v)',
    '    return math.sqrt(s)',
    '',
    'def cos(a, b):',
    '    dot = sum(x*y for x, y in zip(a, b))',
    '    return dot / (length(a) * length(b))',
    '',
    'def search(question, k=3):',
    '    resp = client.embeddings.create(',
    '        model=Q_MODEL, input=[question])',
    '    q = resp.data[0].embedding',
    '    scored = [(cos(q, c["vec"]), c) for c in chunks]',
    '    scored.sort(key=lambda x: x[0], reverse=True)',
    '    return scored[:k]',
    '',
    'for s, c in search(sys.argv[1]):',
    '    print(round(s, 3), c["title"], c["file"])'
  ]);
  const TERM0 = ['$ python embed.py', '조각 42개 → vectors.json 저장'];
  const Q1 = 'python search.py "반복문 언제 끝나요?"';
  const R1 = ['$ ' + Q1, '0.612 반복 구조 algo.md', '0.548 반복 구조 algo.md', '0.391 조건 구조 algo.md'];
  const Q2 = 'python search.py "자료랑 정보 뭐가 달라요?"';
  const R2 = ['$ ' + Q2, '0.587 자료와 정보 info.md', '0.502 정보의 가치 info.md', '0.344 자료의 수집 info.md'];
  const Q3 = 'python search.py "다음 주 수행평가 언제예요?"';
  const R3 = ['$ ' + Q3, '0.214 반복 구조 algo.md', '0.198 정보의 가치 info.md', '0.187 조건 구조 algo.md'];

  HANIP.unit({
    id: 'c2u3',
    course: '과정 2 · 수업자료를 데이터로',
    title: '단원 3 · 임베딩과 검색: 자료에서 근거 찾기',
    goals: ['임베딩이 뜻을 숫자 목록으로 바꾸는 원리와 query·passage 짝 알기', '수업자료를 겹치며 조각내고 코사인 유사도로 top-k 찾기', '질문 10개 점검표로 검색 품질을 재고 고칠 곳 고르기'],
    checked: { date: '2026-10-16' },
    sources: [
      'https://console.upstage.ai/docs/capabilities/embed',
      'https://console.upstage.ai/api/embeddings',
      'https://console.upstage.ai/docs/models/history',
      'https://console.upstage.ai/docs/guides/rate-limits',
      'https://console.upstage.ai/docs/capabilities/parse/document-parsing',
      'https://www.upstage.ai/pricing/api',
      'https://github.com/UpstageAI/upstage-extensions-hub',
      'https://github.com/UpstageAI/cookbook',
      'https://docs.python.org/3/library/math.html',
      'https://docs.python.org/3/library/json.html'
    ],

    figs: {
      /* ---------- L1 설명 그림 ---------- */
      keyMiss: { w: 340, h: 200, label: '검색창의 "반복문 언제 끝나요?"와 학습지의 "조건식이 거짓이 되면 while 문을 빠져나온다", 결과 없음', draw(P) {
        searchBox(P, 10, 14, 196, '반복문 언제 끝나요?', 12);
        ask(P, 214, 36, 20);
        cross(P, 40, 69, 7);
        P.text(118, 74, '키워드 검색 결과 없음', { size: 13, weight: 700, c: 'bad' });
        person(P, 110, 196, 'sad', 0.72);
        P.note(222, 12, 108, 140, { fill: 'paper' });
        P.text(276, 36, '학습지', { size: 12, weight: 700 });
        P.rrect(232, 58, 88, 58, 6, { fill: 'hi', gap: 5, w: 1.2 });
        P.text(276, 74, '조건식이 거짓이', { size: 11 });
        P.text(276, 92, '되면 while 문을', { size: 11 });
        P.text(276, 110, '빠져나온다', { size: 11 });
        lines(P, 234, 128, 84, 2, 10);
        P.text(276, 178, '낱말이 하나도 안 겹쳐요', { size: 11, c: 'ink2' });
      }},
      numList: { w: 340, h: 200, label: '문장이 임베딩 모델을 거쳐 숫자 칸이 늘어선 목록이 되는 모습', draw(P) {
        P.rrect(10, 18, 150, 54, 10, { fill: 'hi', gap: 6 });
        P.text(85, 40, 'for 문은 정해진', { size: 12, weight: 700 });
        P.text(85, 60, '횟수만큼 반복한다', { size: 12, weight: 700 });
        P.arrow(164, 45, 194, 45, { c: 'accent', w: 2.4, head: 9 });
        P.rrect(198, 18, 132, 54, 12, { fill: 'sky', gap: 6 });
        P.text(264, 40, '임베딩 모델', { size: 13, weight: 700 });
        P.text(264, 60, 'solar-embedding-2', { size: 10, mono: true });
        P.arrow(264, 76, 264, 100, { c: 'accent', w: 2.4, head: 9 });
        cells(P, 26, 104, ['0.12', '-0.08', '0.31', '0.05', '…', '0.27'], 48, 'sky');
        P.text(170, 150, '숫자 1,024개짜리 목록(벡터)', { size: 13, weight: 700, c: 'accent' });
        P.text(170, 174, '뜻이 비슷하면 숫자도 비슷해요', { size: 12, c: 'ink2' });
        P.text(170, 194, '(숫자는 예시)', { size: 10, c: 'ink2' });
      }},
      meaningMap: { w: 340, h: 214, label: '뜻 지도: 반복 구조 문장들과 자료와 정보 문장들이 따로 모이고, 학생 질문 별이 반복 구조 무리 가까이에 있다', draw(P) {
        P.rrect(10, 10, 320, 172, 12, { fill: 'paper', fs: 'solid', c: 'soft', w: 1.6 });
        P.ellipse(92, 72, 156, 92, { c: 'accent', w: 1.4 });
        dot(P, 34, 44, 'accent', 'while은 참인 동안');
        dot(P, 52, 70, 'accent', 'for 정해진 횟수');
        dot(P, 36, 96, 'accent', '거짓이면 빠져나옴');
        P.text(64, 140, '반복 구조', { size: 13, weight: 700, c: 'accent' });
        star(P, 152, 70, 11, 'warm');
        P.text(172, 74, '학생 질문', { size: 12, weight: 700, c: 'warm', anchor: 'start' });
        P.text(172, 92, '언제 끝나요?', { size: 11, c: 'ink2', anchor: 'start' });
        P.ellipse(240, 140, 150, 66, { c: 'good', w: 1.4 });
        dot(P, 192, 122, 'good', '자료 → 정보');
        dot(P, 204, 150, 'good', '정보의 가치');
        dot(P, 262, 136, 'good', '자료 수집');
        P.text(290, 98, '자료와 정보', { size: 13, weight: 700, c: 'good' });
        P.text(170, 204, '1,024차원을 2차원으로 줄여 그린 그림', { size: 12, c: 'ink2' });
      }},
      twoPhase: { w: 340, h: 214, label: '미리: 학습지를 조각내 임베딩해 json에 저장. 물을 때: 질문을 임베딩해 가까운 조각 k개를 고른다', draw(P) {
        P.text(28, 46, '미리', { size: 13, weight: 700, c: 'accent' });
        P.note(50, 18, 40, 50, { fill: 'paper' });
        lines(P, 56, 36, 26, 3, 10);
        P.arrow(94, 43, 112, 43, { c: 'accent', w: 2.2, head: 8 });
        [20, 36, 52].forEach(y => piece(P, 116, y, 46, 12, 'hi'));
        P.arrow(166, 43, 182, 43, { c: 'accent', w: 2.2, head: 8 });
        cells(P, 186, 32, ['0.1', '…'], 28, 'sky');
        P.arrow(246, 43, 262, 43, { c: 'accent', w: 2.2, head: 8 });
        P.note(266, 18, 62, 50, { fill: 'hi' });
        P.text(297, 48, 'json', { size: 12, mono: true, weight: 700 });
        P.text(186, 86, '자료가 바뀔 때만 한 번', { size: 11, c: 'ink2' });
        P.line(14, 98, 326, 98, { c: 'soft', w: 1.4 });
        P.text(34, 146, '물을 때', { size: 13, weight: 700, c: 'warm' });
        P.bubble(62, 118, 64, 40, 74, 166);
        P.text(94, 143, '질문', { size: 12, weight: 700 });
        P.arrow(130, 138, 150, 138, { c: 'warm', w: 2.2, head: 8 });
        cells(P, 154, 127, ['0.3', '…'], 28, 'sky');
        P.arrow(214, 138, 232, 138, { c: 'warm', w: 2.2, head: 8 });
        piece(P, 236, 116, 44, 12, 'good');
        piece(P, 236, 132, 44, 12, 'good');
        piece(P, 236, 148, 44, 12);
        P.text(306, 142, 'top-k', { size: 12, mono: true, weight: 700 });
        P.text(186, 186, '질문마다 빠르게', { size: 11, c: 'ink2' });
        P.text(170, 208, '답 쓰기는 c3u1에서', { size: 12, c: 'accent' });
      }},

      /* ---------- L1 문제 그림 ---------- */
      q_synonym: { w: 340, h: 200, label: '학생의 "반복문 언제 끝나요?"와 학습지 문장 사이에서 돋보기가 갸웃하는 모습', draw(P) {
        P.bubble(10, 16, 132, 46, 40, 84);
        P.text(76, 45, '반복문 언제 끝나요?', { size: 12, weight: 700 });
        person(P, 44, 196, 'smile', 0.62);
        P.note(206, 14, 124, 120, { fill: 'paper' });
        P.text(268, 40, '학습지', { size: 12, weight: 700 });
        P.text(268, 68, '조건식이 거짓이 되면', { size: 11 });
        P.text(268, 88, 'while 문을 빠져나온다', { size: 11 });
        lines(P, 218, 106, 96, 2, 12);
        P.circle(166, 104, 36, { fill: 'sky', gap: 5, w: 2.2 });
        P.line(178, 117, 192, 133, { w: 4 });
        ask(P, 166, 112, 22);
        P.text(166, 186, '왜 못 찾을까?', { size: 13, c: 'ink2' });
      }},
      q_mapNear: { w: 340, h: 200, label: '뜻 지도에 학생 질문 별과 이름 없는 점 네 개, 어느 점이 가까울지 묻는 얼굴', draw(P) {
        P.rrect(10, 10, 230, 180, 12, { fill: 'paper', fs: 'solid', c: 'soft', w: 1.6 });
        dot(P, 44, 40, 'accent');
        dot(P, 206, 44, 'good');
        dot(P, 52, 162, 'pink');
        dot(P, 198, 160, 'sky');
        star(P, 125, 96, 11, 'warm');
        P.text(125, 74, '학생 질문', { size: 12, weight: 700, c: 'warm' });
        P.text(125, 132, '가장 가까운 점은?', { size: 12, c: 'ink2' });
        ask(P, 286, 84, 30);
        person(P, 290, 196, 'wow', 0.6);
      }},
      q_flowOrder: { w: 340, h: 200, label: '뒤섞인 카드: 조각 띠, 숫자 칸, 질문 말풍선, 골라 낸 조각', draw(P) {
        card(P, 14, 18);
        [32, 46, 60].forEach(y => P.rrect(34, y, 52, 10, 3, { fill: 'hi', gap: 4, w: 1.2 }));
        card(P, 126, 54);
        cells(P, 140, 78, ['…', '…'], 32, 'sky');
        card(P, 236, 14);
        P.bubble(250, 24, 62, 34, 262, 72);
        P.text(281, 46, '질문', { size: 11, weight: 700 });
        card(P, 60, 112);
        P.rrect(76, 128, 46, 10, 3, { fill: 'good', gap: 4, w: 1.2 });
        P.rrect(76, 146, 46, 10, 3, { fill: 'good', gap: 4, w: 1.2 });
        tick(P, 138, 140, 7);
        P.robot(272, 142, 0.46, { mood: 'wow' });
        ask(P, 116, 42, 22, 'warm');
        ask(P, 228, 108, 22, 'bad');
        ask(P, 32, 112, 20, 'accent');
      }},
      q_whatOut: { w: 340, h: 200, label: '문장 쪽지가 임베딩 모델 로봇을 거쳐 물음표 상자로 가는 모습', draw(P) {
        P.note(10, 30, 120, 80, { fill: 'hi' });
        P.text(70, 62, 'for 문은 정해진', { size: 11, weight: 700 });
        P.text(70, 82, '횟수만큼 반복한다', { size: 11, weight: 700 });
        P.arrow(136, 70, 166, 70, { c: 'accent', w: 2.4, head: 9 });
        P.robot(206, 76, 0.5, { mood: 'smile' });
        P.text(206, 128, '임베딩 모델', { size: 12, weight: 700 });
        P.arrow(236, 70, 262, 70, { c: 'accent', w: 2.4, head: 9 });
        P.rrect(266, 40, 62, 62, 10, { c: 'soft', w: 1.8 });
        ask(P, 297, 84, 30);
        P.text(170, 182, '무엇이 돌아올까?', { size: 13, c: 'ink2' });
      }},

      /* ---------- L2 설명 그림 ---------- */
      twoModels: { w: 340, h: 214, label: '학생 질문은 query, 학습지 조각은 passage 모델을 거쳐 같은 뜻 지도에 모인다', draw(P) {
        P.bubble(12, 14, 96, 36, 30, 62);
        P.text(60, 37, '언제 끝나요?', { size: 11, weight: 700 });
        P.arrow(60, 64, 60, 84, { c: 'warm', w: 2.2, head: 8 });
        P.rrect(14, 88, 92, 34, 8, { fill: 'warm', gap: 5 });
        P.text(60, 110, 'query', { size: 13, mono: true, weight: 700 });
        P.text(60, 142, '학생 질문용', { size: 11, c: 'ink2' });
        P.note(234, 12, 92, 46, { fill: 'hi' });
        P.text(280, 40, '학습지 조각', { size: 11, weight: 700 });
        P.arrow(280, 62, 280, 84, { c: 'good', w: 2.2, head: 8 });
        P.rrect(226, 88, 108, 34, 8, { fill: 'good', gap: 5 });
        P.text(280, 110, 'passage', { size: 13, mono: true, weight: 700 });
        P.text(280, 142, '수업자료 조각용', { size: 11, c: 'ink2' });
        P.circle(170, 150, 84, { fill: 'paper', fs: 'solid', c: 'soft', w: 1.6 });
        P.arrow(108, 116, 146, 140, { c: 'warm', w: 2.2, head: 8 });
        P.arrow(232, 116, 194, 140, { c: 'good', w: 2.2, head: 8 });
        star(P, 160, 148, 9, 'warm');
        dot(P, 182, 156, 'good');
        P.text(170, 182, '같은 뜻 지도', { size: 11, weight: 700 });
        P.text(170, 206, '둘 다 1,024칸', { size: 12, c: 'accent' });
      }},
      batch100: { w: 340, h: 200, label: '조각 250개를 100개, 100개, 50개 세 묶음으로 나눠 세 번 요청하는 모습', draw(P) {
        pile(P, 14, 30);
        P.text(52, 104, '조각 250개', { size: 12, weight: 700 });
        P.text(52, 130, '한 번에', { size: 11, c: 'accent' });
        P.text(52, 148, '100개까지', { size: 11, c: 'accent' });
        P.arrow(96, 58, 122, 58, { c: 'accent', w: 2.2, head: 8 });
        [[128, '100개'], [196, '100개'], [264, '50개']].forEach(([x, t], i) => {
          P.rrect(x, 30, 60, 56, 8, { fill: 'sky', gap: 6 });
          P.text(x + 30, 64, t, { size: 13, weight: 700 });
          P.arrow(x + 30, 92, x + 30, 118, { c: 'accent', w: 2, head: 7 });
          P.text(x + 30, 136, '요청 ' + (i + 1), { size: 11, c: 'ink2' });
        });
        P.rrect(128, 148, 196, 30, 8, { fill: 'paper', fs: 'solid', w: 1.8 });
        P.text(226, 168, 'api.upstage.ai', { size: 11, mono: true });
      }},
      oldName: { w: 340, h: 200, label: '옛 예제 쪽지의 embedding-query와 4096차원에 줄을 긋고, 지금 쪽지에 solar-embedding-2-query와 1,024차원', draw(P) {
        P.note(12, 20, 140, 120, { fill: 'soft' });
        P.text(82, 44, '옛 예제', { size: 13, weight: 700 });
        P.text(82, 76, 'embedding-query', { size: 11, mono: true });
        P.line(34, 72, 130, 72, { c: 'bad', w: 2.4 });
        P.text(82, 106, '4096차원', { size: 12 });
        P.line(56, 102, 108, 102, { c: 'bad', w: 2.4 });
        P.arrow(158, 80, 184, 80, { c: 'accent', w: 2.6, head: 10 });
        P.note(190, 20, 140, 120, { fill: 'paper' });
        P.text(260, 44, '지금', { size: 13, weight: 700, c: 'accent' });
        P.text(260, 74, 'solar-embedding', { size: 11, mono: true });
        P.text(260, 90, '-2-query', { size: 11, mono: true });
        P.text(260, 118, '1,024차원', { size: 12, weight: 700 });
        P.text(160, 174, '이름과 숫자를 바꿔 읽어요', { size: 13, c: 'ink2' });
        P.face(306, 172, 26, { mood: 'wink' });
      }},

      /* ---------- L2 문제 그림 ---------- */
      q_whichModel: { w: 340, h: 200, label: '학생이 "알고리즘이 뭐예요?"라고 묻고, query·passage·solar-pro4 상자 앞에서 고민하는 화살표', draw(P) {
        P.bubble(10, 14, 160, 42, 40, 78);
        P.text(90, 41, '알고리즘이 뭐예요?', { size: 12, weight: 700 });
        person(P, 50, 196, 'smile', 0.6);
        P.rrect(196, 30, 130, 36, 8, { fill: 'warm', gap: 5 });
        P.text(261, 53, 'query', { size: 13, mono: true, weight: 700 });
        P.rrect(196, 82, 130, 36, 8, { fill: 'good', gap: 5 });
        P.text(261, 105, 'passage', { size: 13, mono: true, weight: 700 });
        P.rrect(196, 134, 130, 36, 8, { fill: 'sky', gap: 5 });
        P.text(261, 157, 'solar-pro4', { size: 12, mono: true, weight: 700 });
        P.curveArrow(132, 70, 160, 100, 188, 100, { c: 'soft', w: 2, head: 8 });
        ask(P, 156, 140, 26);
      }},
      q_blankModel: { w: 340, h: 200, label: '조각 60개가 물음표 모델 상자를 거쳐 json에 저장되는 모습', draw(P) {
        pile(P, 14, 30);
        P.text(52, 104, '조각 60개', { size: 12, weight: 700 });
        P.arrow(96, 58, 124, 58, { c: 'accent', w: 2.2, head: 8 });
        P.rrect(128, 28, 96, 60, 10, { c: 'soft', w: 2 });
        ask(P, 176, 68, 30);
        P.text(176, 108, 'model = ?', { size: 12, mono: true });
        P.arrow(228, 58, 252, 58, { c: 'accent', w: 2.2, head: 8 });
        P.note(256, 28, 70, 60, { fill: 'hi' });
        P.text(291, 63, 'json', { size: 12, mono: true, weight: 700 });
        P.text(170, 160, '저장용으로 임베딩하려면?', { size: 13, c: 'ink2' });
        P.sparkle(30, 160, 6, 'hi');
      }},
      q_250: { w: 340, h: 200, label: '조각 250개 더미와 임베딩 API 상자 사이에 물음표, 고민하는 얼굴', draw(P) {
        pile(P, 14, 30);
        P.text(52, 104, '조각 250개', { size: 12, weight: 700 });
        P.arrow(100, 60, 150, 60, { c: 'soft', w: 2.4, head: 9 });
        ask(P, 125, 48, 20);
        P.rrect(158, 26, 100, 70, 10, { fill: 'paper', fs: 'solid', w: 2 });
        P.text(208, 56, 'embeddings', { size: 11, mono: true });
        P.text(208, 78, 'API', { size: 12, mono: true, weight: 700 });
        person(P, 290, 196, 'wow', 0.62);
        P.text(120, 170, '어떻게 보낼까?', { size: 13, c: 'ink2' });
      }},
      q_dataRead: { w: 340, h: 200, label: '터미널에 len(resp.data)는 3, len(resp.data[0].embedding)은 1024가 찍힌 화면과 갸웃하는 얼굴', draw(P) {
        term(P, 12, 16, 222, 116);
        tline(P, 24, 42, '>>> len(resp.data)');
        tline(P, 24, 62, '3', 'hi', 13);
        tline(P, 24, 90, '>>> len(resp.data[0].embedding)');
        tline(P, 24, 112, '1024', 'hi', 13);
        person(P, 290, 196, 'wow', 0.66);
        ask(P, 290, 70, 26);
        P.text(122, 168, '3과 1024는 각각 뭘까?', { size: 13, c: 'ink2' });
      }},

      /* ---------- QA 그림 ---------- */
      qa_wrongSide: { w: 340, h: 200, label: '조각 저장도 학생 질문도 query 상자를 거쳐 뜻 지도로 가고, 어지러운 얼굴', draw(P) {
        P.text(64, 22, '조각 저장', { size: 11, c: 'ink2' });
        P.rrect(14, 30, 100, 34, 8, { fill: 'warm', gap: 5 });
        P.text(64, 52, 'query', { size: 13, mono: true, weight: 700 });
        P.text(64, 102, '학생 질문', { size: 11, c: 'ink2' });
        P.rrect(14, 110, 100, 34, 8, { fill: 'warm', gap: 5 });
        P.text(64, 132, 'query', { size: 13, mono: true, weight: 700 });
        P.arrow(118, 47, 168, 78, { c: 'warm', w: 2.2, head: 8 });
        P.arrow(118, 127, 168, 102, { c: 'warm', w: 2.2, head: 8 });
        P.circle(212, 90, 84, { fill: 'paper', fs: 'solid', c: 'soft', w: 1.6 });
        dot(P, 196, 102, 'warm');
        star(P, 228, 104, 9, 'warm');
        ask(P, 212, 76, 20, 'bad');
        person(P, 298, 196, 'dizzy', 0.62);
        P.text(150, 186, '에러는 없는데 검색이 별로', { size: 12, c: 'ink2' });
      }},
      qa_dims: { w: 340, h: 200, label: '긴 조각 쪽지와 짧은 질문 말풍선이 각각 숫자 칸 목록이 되는데, 길이가 물음표', draw(P) {
        P.note(12, 14, 150, 64, { fill: 'hi' });
        P.text(87, 40, '긴 조각', { size: 12, weight: 700 });
        P.text(87, 62, '300토큰', { size: 11, c: 'ink2' });
        P.bubble(200, 14, 100, 40, 220, 66);
        P.text(250, 39, '짧은 질문', { size: 12, weight: 700 });
        P.text(292, 90, '10토큰', { size: 11, c: 'ink2' });
        P.arrow(87, 82, 87, 106, { c: 'accent', w: 2, head: 7 });
        P.arrow(250, 70, 250, 106, { c: 'accent', w: 2, head: 7 });
        cells(P, 20, 110, ['…', '…', '…', '?'], 32, 'sky');
        cells(P, 218, 110, ['…', '?'], 32, 'sky');
        P.text(170, 172, '숫자 목록 길이는?', { size: 13, c: 'ink2' });
      }},
      qa_noAnswer: { w: 340, h: 200, label: '"반복문을 쉽게 설명해 줘"를 embeddings에 보내고 무엇이 올지 물음표', draw(P) {
        P.bubble(10, 20, 150, 44, 40, 86);
        P.text(85, 48, '반복문을 쉽게 설명해 줘', { size: 11, weight: 700 });
        person(P, 70, 196, 'smile', 0.66);
        P.arrow(166, 42, 192, 42, { c: 'accent', w: 2.2, head: 8 });
        P.rrect(196, 20, 134, 46, 10, { fill: 'sky', gap: 6 });
        P.text(263, 48, 'embeddings', { size: 12, mono: true, weight: 700 });
        P.arrow(263, 70, 263, 96, { c: 'accent', w: 2.2, head: 8 });
        P.rrect(214, 100, 98, 60, 10, { c: 'soft', w: 2 });
        ask(P, 263, 140, 30);
      }},

      /* ---------- L3 설명 그림 ---------- */
      sizeGoldi: { w: 340, h: 214, label: '통째로는 흐린 점 하나, 알맞게는 조각마다 또렷한 점, 너무 잘게는 흩어진 부스러기', draw(P) {
        P.note(24, 18, 72, 90, { fill: 'paper' });
        lines(P, 32, 40, 54, 5, 12);
        P.arrow(60, 112, 60, 132, { c: 'accent', w: 2, head: 7 });
        P.circle(60, 152, 30, { fill: 'soft', gap: 4 });
        P.text(60, 188, '통째로', { size: 13, weight: 700 });
        P.text(60, 206, '뜻이 뭉개짐', { size: 11, c: 'bad' });
        [24, 52, 80].forEach(y => piece(P, 138, y, 64, 20, 'hi'));
        P.arrow(170, 112, 170, 132, { c: 'accent', w: 2, head: 7 });
        dot(P, 154, 150, 'accent');
        dot(P, 172, 158, 'accent');
        dot(P, 188, 146, 'accent');
        P.text(170, 188, '알맞게', { size: 13, weight: 700, c: 'good' });
        P.text(170, 206, '한 조각 한 뜻', { size: 11, c: 'good' });
        [[250, 30], [290, 40], [262, 62], [300, 72], [248, 92], [284, 96]].forEach(([x, y]) => P.rrect(x, y, 22, 10, 3, { fill: 'hi', gap: 3, w: 1.2 }));
        P.arrow(280, 112, 280, 132, { c: 'accent', w: 2, head: 7 });
        [[262, 146], [282, 160], [300, 142], [272, 168], [296, 166]].forEach(([x, y]) => P.circle(x, y, 6, { fill: 'soft', fs: 'solid', w: 1 }));
        P.text(280, 188, '너무 잘게', { size: 13, weight: 700 });
        P.text(280, 206, '맥락을 잃음', { size: 11, c: 'bad' });
      }},
      cutWays: { w: 340, h: 214, label: '왼쪽 학습지는 제목마다 자르고, 오른쪽 학습지는 같은 길이마다 자른다', draw(P) {
        P.note(16, 16, 140, 150, { fill: 'paper' });
        P.rrect(28, 28, 70, 12, 3, { fill: 'accent', fs: 'solid', w: 1 });
        lines(P, 28, 52, 110, 2, 12);
        for (let x = 10; x < 160; x += 12) P.line(x, 86, x + 6, 86, { c: 'bad', w: 1.8 });
        P.rrect(28, 96, 70, 12, 3, { fill: 'accent', fs: 'solid', w: 1 });
        lines(P, 28, 120, 110, 3, 12);
        P.text(86, 188, '제목 단위', { size: 13, weight: 700 });
        P.note(184, 16, 140, 150, { fill: 'paper' });
        lines(P, 196, 32, 110, 10, 12);
        [62, 98, 134].forEach(y => { for (let x = 178; x < 328; x += 12) P.line(x, y, x + 6, y, { c: 'bad', w: 1.8 }); });
        P.text(254, 188, '길이 단위', { size: 13, weight: 700 });
        P.text(170, 208, '둘을 섞으면 무난해요', { size: 12, c: 'accent' });
      }},
      overlapFig: { w: 340, h: 200, label: '긴 글 띠 위에 조각 1과 조각 2가 겹치는 부분(overlap)이 있고, 시작 위치는 size - overlap씩 움직인다', draw(P) {
        P.text(94, 22, 'size', { size: 12, mono: true, weight: 700 });
        P.line(14, 30, 174, 30, { c: 'ink2', w: 1.6 });
        P.rrect(14, 40, 160, 22, 6, { fill: 'hi', gap: 5 });
        P.text(94, 56, '조각 1', { size: 12, weight: 700 });
        P.rrect(14, 70, 312, 30, 6, { fill: 'paper', fs: 'solid', w: 1.8 });
        P.rrect(134, 70, 40, 30, 4, { fill: 'warm', gap: 4, w: 1.2 });
        for (let i = 0; i < 25; i++) P.line(20 + i * 12.4, 85, 27 + i * 12.4, 85, { c: 'soft', w: 3 });
        P.rrect(134, 108, 160, 22, 6, { fill: 'sky', gap: 5 });
        P.text(214, 124, '조각 2', { size: 12, weight: 700 });
        P.arrow(154, 140, 154, 104, { c: 'warm', w: 2, head: 7 });
        P.text(154, 156, 'overlap', { size: 12, mono: true, weight: 700, c: 'warm' });
        P.arrow(14, 168, 134, 168, { c: 'accent', w: 2, head: 8 });
        P.text(80, 188, 'step = size - overlap', { size: 11, mono: true });
        P.text(270, 170, '경계 문장이', { size: 11, c: 'ink2' });
        P.text(270, 186, '두 조각에 다 들어가요', { size: 11, c: 'ink2' });
      }},
      titleTag: { w: 340, h: 200, label: '조각 맨 앞에 [반복 구조] 꼬리표, 아래에 파일·쪽·제목 이름표가 달린 모습', draw(P) {
        P.text(64, 40, '제목을 앞에', { size: 12, weight: 700, c: 'accent' });
        P.rrect(14, 56, 230, 46, 8, { fill: 'paper', fs: 'solid', w: 2 });
        P.rrect(22, 64, 84, 30, 6, { fill: 'hi', gap: 4, w: 1.4 });
        P.text(64, 84, '[반복 구조]', { size: 12, weight: 700 });
        P.text(174, 84, '조건식이 거짓이면 …', { size: 11 });
        P.line(75, 102, 75, 128, { c: 'soft', w: 1.6 });
        P.line(160, 102, 160, 128, { c: 'soft', w: 1.6 });
        P.line(230, 102, 240, 128, { c: 'soft', w: 1.6 });
        chip(P, 30, 128, 90, 26, 'algo.md', 'sky', 11);
        chip(P, 130, 128, 60, 26, '2쪽', 'sky', 11);
        chip(P, 200, 128, 90, 26, '반복 구조', 'sky', 11);
        P.text(160, 184, '출처(메타데이터)는 옆에', { size: 12, c: 'accent' });
        P.arrow(248, 78, 262, 78, { c: 'accent', w: 2, head: 7 });
        P.note(266, 44, 64, 70, { fill: 'hi' });
        P.text(298, 84, 'json', { size: 12, mono: true, weight: 700 });
      }},

      /* ---------- L3 문제 그림 ---------- */
      q_wholeSheet: { w: 340, h: 200, label: '학습지 다섯 장이 각각 점 하나가 되고, 어디가 근거인지 묻는 얼굴', draw(P) {
        for (let i = 0; i < 5; i++) { P.note(12 + i * 40, 20, 34, 44, { fill: 'paper' }); lines(P, 18 + i * 40, 36, 20, 2, 10); }
        P.text(106, 86, '학습지 5개 = 조각 5개', { size: 12, weight: 700 });
        P.arrow(106, 94, 106, 114, { c: 'accent', w: 2, head: 7 });
        [36, 70, 106, 142, 176].forEach(x => P.circle(x, 132, 18, { fill: 'soft', gap: 4 }));
        star(P, 106, 170, 9, 'warm');
        P.bubble(220, 14, 112, 44, 262, 74);
        P.text(276, 41, '어디가 근거?', { size: 12, weight: 700 });
        person(P, 280, 196, 'wow', 0.66);
      }},
      q_startPos: { w: 340, h: 200, label: '자 위에 400자짜리 조각들이 겹치며 놓이고, 두 번째 시작 위치가 물음표', draw(P) {
        P.text(74, 50, '400자', { size: 12, weight: 700 });
        P.rrect(14, 60, 120, 16, 4, { fill: 'hi', gap: 4, w: 1.4 });
        P.rrect(110, 82, 120, 16, 4, { fill: 'sky', gap: 4, w: 1.4 });
        P.rrect(206, 60, 120, 16, 4, { fill: 'hi', gap: 4, w: 1.4 });
        P.line(14, 112, 326, 112, { w: 2 });
        [14, 110, 206, 302].forEach(x => P.line(x, 106, x, 118, { w: 2 }));
        P.text(14, 136, '0', { size: 12, mono: true });
        P.text(110, 138, '?', { size: 16, weight: 700, c: 'warm' });
        P.text(206, 136, '640', { size: 12, mono: true });
        P.text(302, 136, '960', { size: 12, mono: true });
        P.text(170, 180, '400자씩, 80자 겹치기', { size: 13, c: 'ink2' });
      }},
      q_abcd: { w: 340, h: 200, label: 'A부터 J까지 글자 칸 열 개와 size 4, overlap 1 이름표, 물음표', draw(P) {
        P.text(170, 40, 'size 4, overlap 1', { size: 12, mono: true });
        'ABCDEFGHIJ'.split('').forEach((ch, i) => {
          P.rect(20 + i * 30, 60, 28, 32, { w: 1.6, fill: i % 2 ? 'sky' : 'hi', gap: 6 });
          P.text(34 + i * 30, 82, ch, { size: 14, mono: true, weight: 700 });
        });
        ask(P, 170, 142, 30);
        P.text(170, 182, '어떤 조각들이 나올까?', { size: 13, c: 'ink2' });
      }},
      q_lostContext: { w: 340, h: 200, label: '"이때 결과는 거짓이 되어 …" 조각이 검색에서 아래로 밀려나 슬픈 얼굴', draw(P) {
        P.rrect(14, 24, 200, 40, 8, { fill: 'paper', fs: 'solid', w: 1.8 });
        P.text(114, 49, '이때 결과는 거짓이 되어 …', { size: 11 });
        ask(P, 236, 52, 26);
        P.arrow(114, 72, 114, 128, { c: 'bad', w: 2.4, head: 9 });
        P.text(150, 104, '순위가 밀려요', { size: 11, c: 'bad', anchor: 'start' });
        P.text(114, 176, '"반복문 언제 끝나요?"에서 자꾸 밀려요', { size: 12, c: 'ink2' });
        person(P, 290, 196, 'sad', 0.66);
      }},

      /* ---------- L4 설명 그림 ---------- */
      cosAngle: { w: 340, h: 214, label: '원점에서 뻗은 질문 화살표, 각도가 작은 조각 A 화살표, 각도가 큰 조각 B 화살표', draw(P) {
        P.line(70, 176, 240, 176, { c: 'soft', w: 1.4 });
        P.line(90, 196, 90, 24, { c: 'soft', w: 1.4 });
        const q = ray(P, 90, 176, 140, 32, 'warm', 3);
        const a = ray(P, 90, 176, 130, 46, 'accent', 2.6);
        const b = ray(P, 90, 176, 120, 104, 'good', 2.6);
        arc(P, 90, 176, 56, 32, 46, 'accent');
        arc(P, 90, 176, 34, 32, 104, 'good');
        P.text(q[0] + 6, q[1] + 6, '질문', { size: 12, weight: 700, c: 'warm', anchor: 'start' });
        P.text(a[0] + 4, a[1] - 6, '조각 A', { size: 12, weight: 700, c: 'accent', anchor: 'start' });
        P.text(b[0] - 4, b[1] - 6, '조각 B', { size: 12, weight: 700, c: 'good', anchor: 'end' });
        P.text(276, 58, '작은 각도', { size: 12, weight: 700, c: 'accent' });
        P.text(276, 78, '= 비슷한 뜻', { size: 12 });
        P.text(276, 118, '큰 각도', { size: 12, weight: 700, c: 'good' });
        P.text(276, 138, '= 덜 비슷한 뜻', { size: 12 });
        P.text(170, 206, '길이는 상관없고 방향만 봐요', { size: 12, c: 'ink2' });
      }},
      cosScale: { w: 340, h: 200, label: '같은 쪽이면 1, 직각이면 0, 정반대면 -1인 세 그림', draw(P) {
        [[60, 40, '1', '같은 쪽', 'accent'], [170, 120, '0', '직각', 'good'], [280, 210, '-1', '정반대', 'bad']].forEach(([cx, d, n, word, c]) => {
          P.rrect(cx - 52, 24, 104, 120, 10, { c: 'soft', w: 1.4 });
          ray(P, cx, 88, 40, 30, 'warm', 2.6);
          ray(P, cx, 88, 36, d, c, 2.6);
          P.circle(cx, 88, 5, { fill: 'ink', fs: 'solid', c: null });
          P.text(cx, 172, n, { size: 20, weight: 700, mono: true, c: c });
          P.text(cx, 194, word, { size: 12, c: 'ink2' });
        });
      }},
      topk: { w: 340, h: 200, label: '조각 점수 막대를 큰 순으로 세우고 위의 세 개를 top-3로 묶은 모습', draw(P) {
        P.text(170, 20, '질문과 조각들의 코사인 점수', { size: 12, c: 'ink2' });
        bars(P, 14, 32, [['반복 구조', 0.61], ['반복 구조', 0.55], ['조건 구조', 0.39], ['자료와 정보', 0.21], ['정보의 가치', 0.18]], 3, 150);
        P.path('M244 34 L254 34 L254 102 L244 102', { c: 'good', w: 2 });
        P.text(290, 74, 'top-3', { size: 13, mono: true, weight: 700, c: 'good' });
        P.text(170, 186, '큰 순으로 줄 세워 앞에서 k개', { size: 13, c: 'accent' });
      }},
      searchPy: { w: 340, h: 200, label: 'vectors.json은 한 번 저장, search.py는 질문마다 json을 읽고 질문만 임베딩해 top-3를 고른다', draw(P) {
        P.note(14, 28, 88, 96, { fill: 'hi' });
        P.text(58, 58, 'vectors', { size: 12, mono: true, weight: 700 });
        P.text(58, 74, '.json', { size: 12, mono: true });
        cells(P, 22, 88, ['…', '…'], 36, 'sky');
        P.text(58, 148, '한 번 저장', { size: 12, weight: 700, c: 'accent' });
        P.text(58, 166, '자료가 바뀔 때만', { size: 11, c: 'ink2' });
        P.arrow(106, 76, 136, 76, { c: 'accent', w: 2.2, head: 8 });
        P.note(140, 28, 84, 96, { fill: 'paper' });
        P.text(182, 58, 'search', { size: 12, mono: true, weight: 700 });
        P.text(182, 74, '.py', { size: 12, mono: true });
        lines(P, 150, 92, 60, 2, 12);
        P.text(182, 148, '질문마다', { size: 12, weight: 700, c: 'warm' });
        P.text(182, 166, 'query만 임베딩', { size: 11, c: 'ink2' });
        P.bubble(244, 14, 86, 36, 256, 62);
        P.text(287, 37, '질문', { size: 12, weight: 700 });
        P.arrow(252, 66, 230, 78, { c: 'warm', w: 2, head: 7 });
        P.arrow(228, 104, 242, 104, { c: 'good', w: 2, head: 7 });
        [88, 104, 120].forEach(y => piece(P, 246, y, 76, 12, 'good'));
        P.text(284, 150, 'top-3', { size: 12, mono: true, weight: 700, c: 'good' });
        P.text(170, 194, 'json 파일과 파이썬만으로', { size: 12, c: 'accent' });
      }},

      /* ---------- L4 문제 그림 ---------- */
      q_cosMeaning: { w: 340, h: 200, label: '거의 직각으로 벌어진 질문 화살표와 조각 화살표, 점수를 묻는 얼굴', draw(P) {
        P.line(50, 160, 200, 160, { c: 'soft', w: 1.4 });
        const q = ray(P, 70, 160, 110, 8, 'warm', 3);
        const c = ray(P, 70, 160, 110, 96, 'accent', 3);
        arc(P, 70, 160, 30, 8, 96, 'warm');
        P.text(q[0] - 10, q[1] - 12, '질문', { size: 12, weight: 700, c: 'warm' });
        P.text(c[0] + 10, c[1] + 4, '조각', { size: 12, weight: 700, c: 'accent', anchor: 'start' });
        ask(P, 246, 84, 34);
        person(P, 292, 196, 'wow', 0.6);
        P.text(130, 192, '각도가 거의 90도', { size: 12, c: 'ink2' });
      }},
      q_orth: { w: 340, h: 200, label: '숫자 칸 [1, 0, 1]과 [0, 1, 0], 코사인이 얼마냐는 물음', draw(P) {
        P.text(30, 54, 'a', { size: 16, mono: true, weight: 700 });
        cells(P, 50, 38, ['1', '0', '1'], 40, 'hi');
        P.text(30, 104, 'b', { size: 16, mono: true, weight: 700 });
        cells(P, 50, 88, ['0', '1', '0'], 40, 'sky');
        P.text(250, 76, 'cos(a, b) = ?', { size: 14, mono: true, weight: 700 });
        P.face(250, 150, 44, { mood: 'wow' });
        P.text(100, 160, '세 칸짜리 벡터', { size: 12, c: 'ink2' });
      }},
      q_slice: { w: 340, h: 200, label: '점수 큰 순으로 정렬된 다섯 줄과 k = 3, 무엇을 꺼낼지 묻는 물음표', draw(P) {
        [0.61, 0.55, 0.39, 0.21, 0.18].forEach((s, i) => {
          P.rrect(14, 16 + i * 30, 180, 24, 6, { c: 'soft', w: 1.4 });
          P.text(28, 33 + i * 30, (i + 1) + '등', { size: 11, anchor: 'start' });
          P.text(176, 33 + i * 30, s.toFixed(2), { size: 11, mono: true, anchor: 'end' });
        });
        P.text(270, 64, 'k = 3', { size: 14, mono: true, weight: 700 });
        ask(P, 270, 118, 30);
        P.text(170, 188, '큰 순으로 정렬해 뒀어요', { size: 12, c: 'ink2' });
      }},
      q_reembed: { w: 340, h: 200, label: '질문이 올 때마다 조각 300개를 다시 임베딩하느라 빙글빙글 도는 지친 로봇', draw(P) {
        P.note(14, 40, 80, 90, { fill: 'hi' });
        P.text(54, 76, '조각', { size: 13, weight: 700 });
        P.text(54, 98, '300개', { size: 13, weight: 700 });
        P.curveArrow(104, 60, 150, 16, 196, 60, { c: 'bad', w: 2.4, head: 9 });
        P.curveArrow(196, 114, 150, 156, 104, 114, { c: 'bad', w: 2.4, head: 9 });
        P.robot(150, 92, 0.36, { mood: 'dizzy' });
        P.drop(176, 64, 6);
        P.bubble(222, 30, 108, 40, 230, 82);
        P.text(276, 55, '질문 왔어요!', { size: 12, weight: 700 });
        P.text(170, 186, '질문마다 300개를 다시?', { size: 13, c: 'ink2' });
      }},

      /* ---------- QB 그림 ---------- */
      qb_distance: { w: 340, h: 200, label: '거리 자 위의 가까운 점과 먼 점, 시상대 1등 자리에 엉뚱한 점이 올라 어지러운 얼굴', draw(P) {
        P.text(170, 30, '거리(distance) 점수', { size: 12, weight: 700 });
        P.line(20, 66, 320, 66, { w: 2 });
        star(P, 22, 66, 9, 'warm');
        dot(P, 80, 66, 'good');
        dot(P, 262, 66, 'bad');
        P.text(80, 92, '가까운 조각', { size: 11, c: 'ink2' });
        P.text(262, 92, '먼 조각', { size: 11, c: 'ink2' });
        P.rrect(110, 140, 60, 46, 6, { fill: 'hi', gap: 5 });
        P.text(140, 168, '1등', { size: 13, weight: 700 });
        dot(P, 140, 128, 'bad');
        ask(P, 196, 140, 26);
        person(P, 286, 196, 'dizzy', 0.6);
      }},
      qb_k1: { w: 340, h: 200, label: 'while 설명 조각(2쪽)과 for 설명 조각(3쪽)이 k = 1 칸 하나로 들어가려는 모습', draw(P) {
        P.rrect(14, 30, 124, 40, 8, { fill: 'hi', gap: 5 });
        P.text(76, 55, 'while 설명 (2쪽)', { size: 11, weight: 700 });
        P.rrect(14, 90, 124, 40, 8, { fill: 'sky', gap: 5 });
        P.text(76, 115, 'for 설명 (3쪽)', { size: 11, weight: 700 });
        P.arrow(142, 50, 196, 76, { c: 'accent', w: 2.2, head: 8 });
        P.arrow(142, 110, 196, 92, { c: 'accent', w: 2.2, head: 8 });
        P.text(240, 52, 'k = 1', { size: 13, mono: true, weight: 700 });
        P.rrect(200, 60, 80, 48, 8, { w: 2.2 });
        ask(P, 240, 92, 24);
        P.text(170, 172, 'while이랑 for 뭐가 달라요?', { size: 12, c: 'ink2' });
      }},
      qb_tiny: { w: 340, h: 200, label: '아주 잘게 자른 부스러기 조각들과 "그래서 이것은 …" 말풍선, 어지러운 얼굴', draw(P) {
        [[20, 24], [70, 30], [126, 22], [34, 56], [96, 62], [150, 54], [22, 92], [76, 98], [136, 90], [52, 124], [112, 128]].forEach(([x, y], i) => P.rrect(x, y, 34, 12, 3, { fill: i % 2 ? 'hi' : 'sky', gap: 3, w: 1.2 }));
        P.bubble(190, 20, 140, 46, 214, 86);
        P.text(260, 48, '그래서 이것은 …', { size: 12, weight: 700 });
        person(P, 276, 196, 'dizzy', 0.6);
        P.text(100, 180, '문장 하나씩 잘랐더니', { size: 12, c: 'ink2' });
      }},

      /* ---------- L5 설명 그림 ---------- */
      checkTable: { w: 340, h: 210, label: '질문마다 맞음·틀림 표시가 있는 점검표와 7 / 10 점수', draw(P) {
        P.rrect(20, 20, 200, 172, 10, { fill: 'paper', fs: 'solid', w: 2 });
        P.rrect(90, 12, 60, 18, 5, { fill: 'soft', fs: 'solid', w: 1.4 });
        [1, 1, 0, 1, 1, 0, 1].forEach((ok, i) => {
          const y = 50 + i * 20;
          P.text(34, y, '질문 ' + (i + 1), { size: 11, anchor: 'start' });
          P.line(96, y - 4, 166, y - 4, { c: 'soft', w: 3 });
          if (ok) tick(P, 192, y - 4, 6); else cross(P, 192, y - 4, 5);
        });
        P.text(120, 188, '…', { size: 12 });
        P.text(282, 82, '7 / 10', { size: 24, weight: 700, mono: true, c: 'good' });
        P.text(282, 112, 'top-3 안에', { size: 12 });
        P.text(282, 130, '정답 조각', { size: 12 });
        P.face(282, 170, 34, { mood: 'happy' });
      }},
      fixMap: { w: 340, h: 200, label: '조각 크기, 겹치기, 제목 붙이기, 질문 다듬기 네 손잡이', draw(P) {
        [[50, '조각 크기', 'hi'], [130, '겹치기', 'sky'], [210, '제목 붙이기', 'good'], [290, '질문 다듬기', 'pink']].forEach(([cx, t, c]) => {
          P.circle(cx, 60, 48, { fill: c, gap: 5, w: 2 });
          P.line(cx, 60, cx + 12, 44, { w: 3 });
          P.circle(cx, 60, 8, { fill: 'ink', fs: 'solid', c: null });
          P.text(cx, 106, t, { size: 12, weight: 700 });
        });
        P.text(170, 148, '한 번에 하나만 돌리고', { size: 13, c: 'accent' });
        P.text(170, 172, '같은 질문 10개로 다시 재요', { size: 13, c: 'accent' });
        P.sparkle(30, 160, 6, 'hi');
      }},
      costFig: { w: 340, h: 200, label: '작은 동전은 임베딩, 중간 동전은 파싱 20쪽, 큰 동전은 학생 30명 답 쓰기', draw(P) {
        coin(P, 60, 74, 22);
        coin(P, 170, 74, 46);
        coin(P, 280, 70, 74);
        P.text(60, 130, '임베딩', { size: 12, weight: 700 });
        P.text(60, 148, '$0.0006', { size: 11, mono: true });
        P.text(170, 130, '파싱 20쪽', { size: 12, weight: 700 });
        P.text(170, 148, '$0.2', { size: 11, mono: true });
        P.text(280, 130, '답 쓰기', { size: 12, weight: 700 });
        P.text(280, 148, '≈ $0.29', { size: 11, mono: true });
        P.text(170, 184, '정가로 어림(바뀔 수 있어요)', { size: 12, c: 'ink2' });
      }},

      /* ---------- L5 문제 그림 ---------- */
      q_lowHit: { w: 340, h: 200, label: '3 / 10 점검표와, 긴 조각들이 위를 차지하고 정답 조각이 아래로 밀린 막대', draw(P) {
        P.rrect(14, 20, 110, 150, 8, { fill: 'paper', fs: 'solid', w: 2 });
        P.text(69, 52, '3 / 10', { size: 20, weight: 700, mono: true, c: 'bad' });
        [76, 96, 116, 136].forEach((y, i) => { P.line(28, y, 88, y, { c: 'soft', w: 3 }); if (i === 1) tick(P, 104, y, 5); else cross(P, 104, y, 4); });
        bars(P, 140, 30, [['긴 조각', 0.58], ['긴 조각', 0.55], ['긴 조각', 0.52], ['정답 조각', 0.31]], 0, 100);
        P.text(236, 150, '긴 조각이 늘 1등', { size: 12, c: 'ink2' });
        ask(P, 236, 186, 22);
      }},
      q_cost500: { w: 340, h: 200, label: '조각 500개 × 400토큰 더미와 100만 토큰당 $0.02, 물음표 동전', draw(P) {
        pile(P, 14, 30);
        P.text(52, 104, '조각 500개', { size: 12, weight: 700 });
        P.text(52, 124, '× 400토큰', { size: 11 });
        P.text(170, 64, '$0.02', { size: 16, mono: true, weight: 700 });
        P.text(170, 86, '100만 토큰당', { size: 12 });
        coin(P, 282, 70, 60);
        ask(P, 282, 140, 26);
        P.text(170, 182, '모두 얼마쯤?', { size: 13, c: 'ink2' });
      }},
      q_loopOrder: { w: 340, h: 200, label: '뒤섞인 카드: 점검표, 맞음·틀림, 돋보기, 고치는 손잡이, 다시 재는 화살표', draw(P) {
        card(P, 14, 14);
        lines(P, 28, 32, 60, 3, 12);
        card(P, 234, 14);
        tick(P, 262, 46, 8);
        cross(P, 296, 48, 6);
        card(P, 124, 66);
        P.circle(166, 96, 30, { fill: 'sky', gap: 5, w: 2 });
        P.line(176, 106, 190, 120, { w: 3.4 });
        card(P, 30, 120);
        P.circle(76, 155, 34, { fill: 'hi', gap: 5, w: 2 });
        P.line(76, 155, 86, 143, { w: 3 });
        card(P, 214, 118);
        P.curveArrow(236, 166, 260, 124, 284, 166, { c: 'accent', w: 2.2, head: 8 });
        ask(P, 116, 40, 22, 'warm');
        ask(P, 226, 104, 22, 'bad');
        ask(P, 160, 178, 20, 'accent');
      }},
      q_offTopic: { w: 340, h: 200, label: '"다음 주 수행평가 언제예요?" 질문에 짧은 막대 세 개가 나오고 갸웃하는 얼굴', draw(P) {
        P.bubble(10, 14, 190, 40, 40, 72);
        P.text(105, 40, '다음 주 수행평가 언제예요?', { size: 12, weight: 700 });
        bars(P, 30, 92, [['반복 구조', 0.22], ['정보의 가치', 0.2], ['조건 구조', 0.18]], 0, 140, false);
        person(P, 292, 196, 'wow', 0.62);
        ask(P, 292, 84, 24);
        P.text(120, 182, '자료에 없는 질문인데', { size: 12, c: 'ink2' });
      }},

      /* ---------- T1 그림 ---------- */
      t_old1024: { w: 340, h: 200, label: '블로그 예제 쪽지에는 길이 4096, 터미널에는 1024가 찍혀 놀란 얼굴', draw(P) {
        P.note(12, 20, 120, 110, { fill: 'paper' });
        P.text(72, 46, '블로그 예제', { size: 12, weight: 700 });
        P.text(72, 76, '길이: 4096', { size: 12, mono: true });
        lines(P, 24, 96, 90, 2, 12);
        term(P, 148, 30, 124, 70);
        tline(P, 158, 56, '>>> len(vec)');
        tline(P, 158, 82, '1024', 'hi', 13);
        person(P, 304, 196, 'wow', 0.6);
        ask(P, 304, 64, 24);
        P.text(140, 170, '숫자가 달라요!', { size: 13, c: 'ink2' });
      }},
      t_stepLine: { w: 340, h: 200, label: '글 띠 위의 조각들 사이에 빈틈이 생겨 글이 빠지는 모습', draw(P) {
        P.text(170, 40, 'size 400, overlap 80', { size: 12, mono: true });
        P.rrect(14, 70, 312, 26, 6, { c: 'soft', w: 1.4 });
        P.rrect(14, 70, 100, 26, 6, { fill: 'hi', gap: 5 });
        P.rrect(114, 70, 20, 26, 3, { fill: 'bad', gap: 3, w: 1 });
        P.rrect(134, 70, 100, 26, 6, { fill: 'hi', gap: 5 });
        P.rrect(234, 70, 20, 26, 3, { fill: 'bad', gap: 3, w: 1 });
        P.rrect(254, 70, 72, 26, 6, { fill: 'hi', gap: 5 });
        P.text(124, 120, '빠짐', { size: 11, c: 'bad' });
        P.text(244, 120, '빠짐', { size: 11, c: 'bad' });
        P.text(170, 172, '겹치기는커녕 글이 빠져요', { size: 13, c: 'ink2' });
      }},
      t_cosBlank: { w: 340, h: 200, label: '두 화살표 사이 각도와, 내적을 무언가로 나누는 분수의 빈칸', draw(P) {
        P.line(30, 150, 150, 150, { c: 'soft', w: 1.4 });
        ray(P, 40, 150, 100, 20, 'warm', 2.6);
        ray(P, 40, 150, 90, 70, 'accent', 2.6);
        arc(P, 40, 150, 30, 20, 70, 'warm');
        P.text(250, 62, '내적', { size: 16, weight: 700 });
        P.line(196, 76, 304, 76, { w: 2.4 });
        P.text(250, 106, '?', { size: 20, weight: 700, c: 'warm' });
        P.text(170, 52, 'cos =', { size: 14, mono: true, weight: 700, anchor: 'end' });
        P.text(250, 160, '길이는 어떻게?', { size: 12, c: 'ink2' });
      }},
      t_prepOrder: { w: 340, h: 200, label: '뒤섞인 카드: PDF 문서, 자른 조각, 이름표, json 파일, 돋보기', draw(P) {
        card(P, 14, 14);
        P.note(36, 22, 34, 44, { fill: 'paper' });
        P.text(53, 52, 'PDF', { size: 10, mono: true, weight: 700 });
        card(P, 236, 12);
        [24, 38, 52].forEach(y => P.rrect(254, y, 54, 10, 3, { fill: 'hi', gap: 4, w: 1.2 }));
        card(P, 126, 60);
        chip(P, 136, 78, 72, 24, '2쪽', 'sky', 11);
        card(P, 24, 118);
        P.note(54, 126, 36, 46, { fill: 'hi' });
        P.text(72, 156, 'json', { size: 10, mono: true, weight: 700 });
        card(P, 222, 112);
        P.circle(264, 142, 30, { fill: 'sky', gap: 5, w: 2 });
        P.line(274, 152, 288, 166, { w: 3.4 });
        ask(P, 116, 40, 22, 'warm');
        ask(P, 230, 98, 22, 'bad');
        ask(P, 160, 172, 20, 'accent');
      }},
      t_cos45: { w: 340, h: 200, label: '숫자 칸 q = [1, 1, 0]과 c = [1, 0, 0], 반올림한 코사인을 묻는 얼굴', draw(P) {
        P.text(30, 54, 'q', { size: 16, mono: true, weight: 700 });
        cells(P, 50, 38, ['1', '1', '0'], 40, 'hi');
        P.text(30, 104, 'c', { size: 16, mono: true, weight: 700 });
        cells(P, 50, 88, ['1', '0', '0'], 40, 'sky');
        P.text(250, 70, 'round(cos, 3)', { size: 13, mono: true, weight: 700 });
        ask(P, 250, 108, 28);
        P.face(250, 158, 40, { mood: 'smile' });
      }},
      t_429: { w: 340, h: 200, label: '로봇이 요청 화살표를 잔뜩 쏘고 서버에 429 표시가 뜬 모습', draw(P) {
        P.robot(56, 100, 0.5, { mood: 'dizzy' });
        for (let i = 0; i < 6; i++) P.arrow(96, 52 + i * 18, 218, 52 + i * 18, { c: i % 2 ? 'soft' : 'ink2', w: 1.8, head: 7 });
        P.rrect(226, 34, 98, 116, 10, { fill: 'paper', fs: 'solid', w: 2 });
        P.text(275, 98, '429', { size: 26, mono: true, weight: 700, c: 'bad' });
        P.text(170, 182, '조각 1,000개를 한 개씩', { size: 12, c: 'ink2' });
      }},
      t_slang: { w: 340, h: 200, label: '"while 탈출 언제?"는 못 찾고 "while 문은 언제 종료되나요?"는 찾는 모습', draw(P) {
        P.bubble(10, 16, 150, 42, 40, 76);
        P.text(85, 43, 'while 탈출 언제?', { size: 12, weight: 700 });
        cross(P, 180, 37, 9);
        P.bubble(10, 96, 214, 42, 40, 156);
        P.text(117, 123, 'while 문은 언제 종료되나요?', { size: 12 });
        tick(P, 244, 117, 10);
        person(P, 298, 196, 'wow', 0.6);
        P.text(130, 186, '같은 뜻, 다른 결과', { size: 13, c: 'ink2' });
      }},
      t_meta: { w: 340, h: 200, label: '찾은 조각 카드에 "출처: ?" 칸이 비어 있는 모습', draw(P) {
        P.rrect(14, 30, 220, 110, 10, { fill: 'paper', fs: 'solid', w: 2 });
        P.text(124, 58, '반복문은 조건이 거짓이면', { size: 12 });
        P.text(124, 78, '끝나요.', { size: 12 });
        P.rrect(28, 96, 192, 30, 6, { fill: 'hi', gap: 5 });
        P.text(124, 116, '출처: ?', { size: 12, weight: 700 });
        person(P, 290, 196, 'smile', 0.62);
        P.text(124, 172, '어느 학습지 몇 쪽?', { size: 13, c: 'ink2' });
      }},
      t_update: { w: 340, h: 200, label: '학습지 3쪽을 연필로 고쳤고, 옆의 vectors.json이 그대로라 물음표', draw(P) {
        P.note(14, 24, 100, 120, { fill: 'paper' });
        P.text(64, 50, '3쪽', { size: 13, weight: 700 });
        lines(P, 26, 70, 76, 5, 12);
        P.line(96, 136, 130, 100, { c: 'warm', w: 6 });
        P.line(130, 100, 136, 94, { c: 'ink', w: 6 });
        P.arrow(146, 84, 180, 84, { c: 'accent', w: 2.2, head: 8 });
        P.note(186, 34, 90, 100, { fill: 'hi' });
        P.text(231, 72, 'vectors', { size: 11, mono: true, weight: 700 });
        P.text(231, 88, '.json', { size: 11, mono: true });
        ask(P, 304, 94, 26);
        P.text(170, 180, '고친 내용이 검색에 나오려면?', { size: 12, c: 'ink2' });
      }},
      t_privacy: { w: 340, h: 200, label: '이름·학번이 붙은 수행평가 답안 폴더가 검색 자료 상자로 가려 하고, 경고 삼각형', draw(P) {
        folder(P, 20, 40, 130, 100, 'hi');
        P.text(85, 96, '수행평가 답안', { size: 12, weight: 700 });
        chip(P, 40, 112, 90, 24, '이름·학번', 'pink', 11);
        P.arrow(158, 90, 196, 90, { c: 'soft', w: 2.4, head: 9 });
        P.rrect(200, 60, 60, 60, 10, { c: 'soft', w: 2 });
        ask(P, 230, 100, 26);
        P.path('M302 60 L332 116 L272 116 Z', { fill: 'hi', w: 2 });
        P.text(302, 108, '!', { size: 22, weight: 700, c: 'bad' });
        P.text(170, 176, '검색 자료로 넣어도 될까?', { size: 13, c: 'ink2' });
      }}
    },

    items: [
    /* =================== L1 =================== */
    { id: 'L1', type: 'lesson', title: '뜻으로 찾기', sub: '키워드 검색의 한계, 임베딩과 뜻 지도', min: 8, steps: [
      { t: 'say', h: '키워드 검색은 같은 낱말만 찾아요', fig: 'keyMiss', p: [
        'c1u2에서 근거 자료를 함께 주면 환각이 줄어든다고 했죠. 그러려면 먼저 학생 질문에 맞는 <b>근거 조각</b>을 수업자료에서 찾아야 해요. 이번 단원이 그 "찾기"예요.',
        '가장 쉬운 방법은 <kbd>mod+f</kbd> 같은 <b>키워드 검색</b>이에요. 그런데 학생은 "반복문 언제 끝나요?"라고 묻고, 학습지에는 "조건식이 거짓이 되면 while 문을 빠져나온다"라고 적혀 있어요. 겹치는 낱말이 하나도 없어서 못 찾아요.',
        '키워드 검색은 <b>동의어</b>(끝나다·빠져나오다), <b>풀어 쓴 질문</b>, 영어와 한글 섞어 쓰기(while·반복문)에 약해요. 그래서 낱말이 아니라 <b>뜻</b>으로 찾는 방법이 필요해요.'
      ]},
      { t: 'say', h: '임베딩은 글의 뜻을 숫자 목록으로 바꿔요', fig: 'numList', p: [
        '<b>임베딩</b>(embedding)은 글 한 덩어리를 <b>숫자 목록</b>(벡터) 하나로 바꾸는 일이에요. 지금 업스테이지 임베딩 모델은 글을 넣으면 숫자 <b>1,024개</b>를 돌려줘요.',
        '임베딩 모델은 많은 글로 학습해서, <b>뜻이 비슷한 글은 비슷한 숫자 목록</b>이 되게 만들어졌어요. "언제 끝나요?"와 "빠져나온다"처럼 낱말이 달라도 뜻이 가까우면 숫자도 가까워요.',
        '숫자 칸 하나하나에 "3번째 칸은 반복" 같은 이름표는 없어요. 숫자 목록은 <b>다른 목록과 비교할 때</b>만 쓸모가 있어요.'
      ]},
      { t: 'say', h: '뜻 지도: 비슷한 문장은 가까이 모여요', fig: 'meaningMap', p: [
        '숫자 1,024개는 그림으로 그릴 수 없으니, 2차원으로 줄여 그린 <b>뜻 지도</b>를 떠올려 봐요. 문장 하나가 점 하나예요.',
        '반복 구조 문장들은 한쪽에, 자료와 정보 문장들은 다른 쪽에 모여요. 학생 질문도 점이 되어 지도에 놓이고, <b>가장 가까운 점</b>이 근거 조각 후보예요.'
      ], table: { head: ['학생 질문', '키워드 검색', '뜻으로 찾기'], rows: [
        ['반복문 언제 끝나요?', '못 찾아요(낱말이 달라요)', '"조건식이 거짓이 되면 …" 조각'],
        ['자료랑 정보 뭐가 달라요?', '"자료"가 든 조각이 너무 많아요', '"자료를 가공하면 정보" 조각'] ] } },
      { t: 'say', h: '찾기는 미리 하는 일과 물을 때 하는 일로 나뉘어요', fig: 'twoPhase', p: [
        '<b>미리</b>: 수업자료를 조각으로 나누고(레슨 3), 조각마다 임베딩해서 파일에 저장해 둬요. 자료가 바뀔 때만 다시 해요.',
        '<b>물을 때</b>: 학생 질문을 임베딩하고, 저장해 둔 조각들과 비교해 가장 가까운 조각 몇 개(top-k)를 골라요(레슨 4).',
        '찾은 조각으로 Solar가 답을 쓰는 건 c3u1 「보조 에이전트」에서 해요. 연수 1일차 15:00 「나만의 보조 agent」 실습이 바로 이 찾기 위에 서 있어요.'
      ], tip: '임베딩은 <b>답을 만들지 않아요</b>. 숫자 목록을 돌려줄 뿐이에요. 찾기(임베딩)와 답 쓰기(Solar)는 따로예요.' },
      { t: 'q', kind: 'mc', fig: 'q_synonym', q: '학습지에 "조건식이 거짓이 되면 while 문을 빠져나온다"가 있어요. 학생이 "반복문 언제 끝나요?"를 쳤는데 키워드 검색으로는 안 나와요. 가장 알맞은 까닭은?',
        opts: ['학습지가 PDF라서 글자 검색이 안 된다', '질문과 문장에 겹치는 낱말이 없다', '질문 끝의 물음표 때문에 검색이 막혔다', '문장이 너무 짧아서 검색 대상에서 빠졌다'], a: 1,
        why: '키워드 검색은 같은 낱말이 있어야 찾아요. "끝나요"와 "빠져나온다", "반복문"과 "while 문"은 뜻은 가깝지만 글자가 달라요.',
        ex: ['c2u1에서 markdown으로 바꿔 두었다면 글자 검색은 돼요. 문제는 낱말이 다르다는 거예요.', '', '물음표를 빼도 "끝나요"와 "빠져나온다"는 여전히 다른 낱말이에요.', '짧은 문장도 같은 낱말이 있으면 찾아요.'] },
      { t: 'q', kind: 'mc', fig: 'q_mapNear', q: '뜻 지도에 학생 질문 "while이랑 for는 뭐가 달라요?"를 점으로 놓았어요. 가장 가까이 놓일 조각은?',
        opts: ['자료를 가공해 목적에 맞게 쓸모 있게 만든 것이 정보다', '정보는 정확하고 제때 나와야 가치가 있다', '저장 장치는 자료를 0과 1로 기록한다', 'for는 횟수, while은 조건으로 반복한다'], a: 3,
        why: '질문과 뜻이 가장 가까운 건 while과 for를 함께 설명하는 반복 구조 조각이에요. 뜻 지도에서는 주제가 같은 글끼리 모여요.',
        ex: ['자료와 정보 단원 문장이에요. 반복 구조와는 뜻이 멀어요.', '정보의 가치 문장이에요. 질문과 주제가 달라요.', '컴퓨터 구조 쪽 문장이에요. 반복과는 뜻이 멀어요.', ''] },
      { t: 'q', kind: 'order', fig: 'q_flowOrder', q: '학습지를 미리 준비해 두고, 학생 질문이 오면 근거를 뜻으로 찾아요. 순서대로 쌓아 보세요.',
        items: ['[미리] 학습지를 작은 조각으로 나눈다', '[미리] 조각마다 임베딩해 숫자 목록을 저장한다', '[물을 때] 학생 질문을 임베딩한다', '[물을 때] 저장한 조각 중 질문과 가장 가까운 것을 고른다'],
        why: '조각이 있어야 임베딩하고, 저장한 조각 벡터가 있어야 질문과 비교할 수 있어요. 질문을 숫자로 바꾼 뒤에야 가까운 조각을 고를 수 있어요.' },
      { t: 'q', kind: 'mc', fig: 'q_whatOut', q: '임베딩 모델에 "for 문은 정해진 횟수만큼 반복한다"를 보내면 무엇을 돌려받을까요?',
        opts: ['그 문장을 쉽게 풀어 쓴 설명 글', '문장에서 뽑은 중요한 낱말 목록', '숫자 1,024개짜리 목록 하나', '문장과 비슷한 다른 문장 세 개'], a: 2,
        why: '임베딩은 글을 숫자 목록(벡터)으로 바꿔요. 지금 모델은 1,024개예요. 비슷한 문장을 찾는 일은 이 숫자들을 비교해서 내가 직접 해요.',
        ex: ['글을 쓰는 건 Solar 같은 생성 모델이에요. 임베딩은 글을 돌려주지 않아요.', '낱말 목록이 아니라 숫자 목록이에요. 칸마다 낱말 이름표도 없어요.', '', '비슷한 문장 찾기는 숫자 목록을 받아서 비교하는 다음 단계예요.'] },
      { t: 'sum', pts: ['키워드 검색은 같은 낱말만 찾는다. 동의어·풀어 쓴 질문·영어 한글 섞기에 약하다.', '임베딩은 글을 숫자 목록(지금 모델은 1,024개)으로 바꾼다. 뜻이 비슷하면 숫자도 가깝다. 칸마다 이름표는 없다.', '찾기는 둘로: 미리(조각 → 임베딩 → 저장), 물을 때(질문 임베딩 → 가까운 조각 k개). 답 쓰기는 c3u1.'] }
    ]},

    /* =================== L2 =================== */
    { id: 'L2', type: 'lesson', title: 'query와 passage', sub: '두 모델, 1,024차원, 100개씩, embed.py', min: 12, steps: [
      { t: 'say', h: '질문은 query, 조각은 passage: 모델이 둘이에요', fig: 'twoModels', table: { head: ['모델 이름(2026년 10월 기준)', '넣는 글', '언제'], rows: [
        ['<code>solar-embedding-2-passage</code>', '수업자료 조각', '미리, 저장할 때'],
        ['<code>solar-embedding-2-query</code>', '학생 질문', '물을 때마다'] ] }, p: [
        '업스테이지 임베딩은 짝을 이루는 모델 두 개예요. 문서 조각은 <code>solar-embedding-2-passage</code>, 질문은 <code>solar-embedding-2-query</code>로 바꿔요. 둘 다 2026년 6월에 나왔고 숫자 <b>1,024개</b>를 돌려줘요.',
        '질문은 짧고 묻는 꼴, 조각은 길고 설명하는 꼴이에요. query는 질문에, passage는 찾을 문서에 맞춰 다듬어진 짝이라서 <b>조각은 passage로 저장하고, 질문은 query로 찾는다</b>를 꼭 지켜요.',
        '코드에서는 c1u3의 <code>MODEL</code> 습관 그대로, 모델 이름을 변수 두 개(<code>Q_MODEL</code>, <code>P_MODEL</code>)에 모아 둬요.'
      ]},
      { t: 'say', h: 'embed.py: 질문 하나를 임베딩해 봐요', p: [
        'c1u3의 <code>hello_solar.py</code>와 같은 <code>client</code>(같은 <code>base_url</code>, 같은 키)를 써요. 부르는 곳만 <code>client.chat.completions</code>가 아니라 <code>client.embeddings</code>예요.',
        '<code>input</code>에는 글 목록을 줘요. 결과는 <code>resp.data[0].embedding</code>에 숫자 목록으로 와요. <code>len(vec)</code>이 1024면 성공이에요(아래 숫자 세 개는 예시예요).',
        '임베딩 요청에는 <code>model</code>과 <code>input</code>만 적어요. <code>reasoning_effort</code>·<code>temperature</code>는 Solar가 글을 만들 때 쓰는 값이라 여기서는 쓰지 않아요.'
      ], code: { lang: 'py', src: src(['# client는 hello_solar.py와 같아요', 'Q_MODEL = "solar-embedding-2-query"', 'P_MODEL = "solar-embedding-2-passage"', '', 'resp = client.embeddings.create(', '    model=Q_MODEL,', '    input=["반복문 언제 끝나요?"],', ')', 'vec = resp.data[0].embedding', 'print(len(vec))', 'print(vec[:3])']), out: '1024\n[0.0123, -0.0311, 0.0087]' } },
      { t: 'say', h: '조각은 한 번에 100개까지 묶어 보내요', fig: 'batch100', p: [
        '조각 여러 개는 목록째 한 번에 보내요. <code>resp.data</code>에서 넣은 순서대로 하나씩 꺼내면 돼요.',
        '한 요청에 글은 <b>100개까지</b>예요. 조각이 250개라면 100·100·50으로 세 번 나눠 보내요. 조각 하나는 수백 토큰 안쪽으로 짧게 두는 게 좋아요(정확한 상한은 API 문서에서 직접 확인해요).',
        '임베딩도 분당 요청 수 제한이 있어서 너무 자주 부르면 <code>429</code>가 나요. 하나씩 1,000번 부르기보다 100개씩 묶어 10번 부르는 게 빠르고 안전해요. 429가 나면 c1u3에서 배운 대로 잠깐 기다렸다 다시 보내요.'
      ], code: { lang: 'py', src: src(['chunks = [', '    "while은 조건이 거짓이면 멈춰요.",', '    "for는 정해진 횟수만큼 반복해요.",', '    "자료를 가공하면 정보가 돼요.",', ']', 'resp = client.embeddings.create(', '    model=P_MODEL, input=chunks)', 'vecs = [d.embedding for d in resp.data]', 'print(len(vecs), len(vecs[0]))']), out: '3 1024' } },
      { t: 'say', h: '옛 예제의 모델 이름은 바꿔 읽어요', fig: 'oldName', table: { head: ['옛 예제에서 보이는 이름', '지금 쓸 이름'], rows: [
        ['<code>embedding-query</code>, <code>solar-embedding-1-large-query</code>', '<code>solar-embedding-2-query</code>'],
        ['<code>embedding-passage</code>, <code>solar-embedding-1-large-passage</code>', '<code>solar-embedding-2-passage</code>'] ] }, p: [
        '인터넷 예제와 옛 쿡북에는 <code>embedding-query</code>, <code>solar-embedding-1-large-query</code> 같은 이름이 많아요. <code>solar-embedding-1-large</code> 쪽은 2026년 12월 31일에 끝나기로 되어 있어요.',
        '옛 문서에는 차원이 4096이라고 적힌 것도 있지만 지금 모델은 1,024예요. 옛 숫자에 맞추지 말고 <b>지금 이름과 지금 숫자</b>로 바꿔 읽어요.',
        'LangChain 같은 도구는 기본 이름이 옛것일 수 있어요. 이 과정은 OpenAI SDK로 모델 이름을 직접 적어요. Cursor 에이전트가 옛 이름을 가져오지 않게 c1u3의 <code>AGENTS.md</code>에 임베딩 이름도 적어 둬요.'
      ]},
      { t: 'sim', h: 'embed.py를 돌려 봐요', p: 'upstage-lab에서 embed.py를 열어 모델 이름을 보고, 터미널에서 실행한 뒤 AGENTS.md에 적힌 규칙도 확인해요.',
        scene: { win: 'ide', folder: 'upstage-lab', files: LAB1, open: 'hello_solar.py', lang: 'py', code: HELLO, term: [] },
        steps: [
          { goal: '파일 목록에서 embed.py를 열어요', click: 'file:embed.py', then: { open: 'embed.py', code: EMBED_PY },
            say: '<code>client</code>는 hello_solar.py와 같고, 모델 이름이 <code>Q_MODEL</code>·<code>P_MODEL</code> 두 개예요.' },
          { goal: '터미널에 <code>python embed.py</code>를 쳐요', type: 'python embed.py', into: 'term',
            then: { term: ['$ python embed.py', '질문 벡터 길이: 1024', '조각 3개 → 벡터 3개'], prompt: '' },
            say: '질문 하나는 숫자 1,024개, 조각 세 개는 벡터 세 개가 됐어요. 키는 화면에 찍지 않았어요.' },
          { goal: 'AGENTS.md를 열어 임베딩 규칙을 봐요', click: 'file:AGENTS.md', then: { open: 'AGENTS.md', lang: 'md', code: AGENTS_MD },
            say: '임베딩 모델 두 이름과 옛 이름 금지를 적어 두면, 에이전트가 코드를 만들 때 이 규칙을 따라요.' } ],
        end: '조각은 passage, 질문은 query. 이름은 변수와 AGENTS.md에 모아 둬요.' },
      { t: 'q', kind: 'mc', fig: 'q_whichModel', q: '정보 수업 챗봇에서 학생이 "알고리즘이 뭐예요?"라고 물었어요. 이 질문을 임베딩할 모델은?',
        opts: ['<code>solar-embedding-2-passage</code>', '<code>solar-pro4</code>', '<code>solar-embedding-2-query</code>', '<code>embedding-query</code>'], a: 2,
        why: '학생 질문은 <code>solar-embedding-2-query</code>로 바꿔요. 수업자료 조각은 미리 <code>solar-embedding-2-passage</code>로 저장해 둔 짝이에요.',
        ex: ['passage는 수업자료 조각을 저장할 때 써요. 질문은 query 짝이에요.', '<code>solar-pro4</code>는 글을 쓰는 모델이에요. 임베딩은 임베딩 모델이 만들어요.', '', '옛 예제에서 보이는 이름이에요. 지금 이름으로 바꿔 읽어요.'] },
      { t: 'q', kind: 'blank', fig: 'q_blankModel', q: '학습지 조각 60개를 저장용으로 임베딩하려 해요. 빈칸에 들어갈 것은?', lang: 'py', code: src(['resp = client.embeddings.create(', '    model=[[1]],', '    input=chunks)']),
        opts: ['Q_MODEL', 'P_MODEL', 'MODEL', '"solar-embedding-1-large"'], a: 1,
        why: '저장할 수업자료 조각은 passage 짝(<code>P_MODEL = "solar-embedding-2-passage"</code>)으로 임베딩해요. 60개면 한 요청(100개까지)으로 충분해요.',
        ex: ['Q_MODEL은 학생 질문용이에요. 조각은 passage 짝으로 저장해요.', '', 'MODEL은 c1u3에서 만든 <code>solar-pro4</code> 변수예요. 글을 쓰는 모델이에요.', '옛 이름이에요. 2026년 말에 끝나기로 되어 있어요.'] },
      { t: 'q', kind: 'mc', fig: 'q_250', q: '수업자료를 나눴더니 조각이 250개예요. 가장 알맞은 보내기 방법은?',
        opts: ['250개를 목록 하나에 담아 한 번에 보낸다', '250개를 긴 글 하나로 이어 붙여 한 번에 보낸다', '조각마다 하나씩 250번 보낸다', '100개, 100개, 50개로 나눠 세 번 보낸다'], a: 3,
        why: '한 요청에는 글이 100개까지예요. 100개씩 묶으면 요청 수가 적어 분당 요청 제한(429)에도 덜 걸려요.',
        ex: ['한 요청에 100개를 넘으면 안 돼요.', '이어 붙이면 조각 250개가 벡터 하나로 뭉개져요. 조각마다 따로 벡터가 있어야 찾을 수 있어요.', '되긴 하지만 느리고, 분당 요청 수 제한(429)에 걸리기 쉬워요.', ''] },
      { t: 'q', kind: 'mc', fig: 'q_dataRead', q: '조각 몇 개를 passage로 임베딩한 뒤 <code>len(resp.data)</code>는 3, <code>len(resp.data[0].embedding)</code>은 1024가 나왔어요. 바르게 읽은 것은?',
        opts: ['조각 3개, 조각마다 숫자 1,024개', '숫자 3개짜리 벡터가 1,024개 왔다', '조각 하나를 1,024토큰씩 세 번 나눠 보냈다', '조각 3개 중 앞의 1,024자만 임베딩됐다'], a: 0,
        why: '<code>resp.data</code>에는 넣은 글마다 결과가 하나씩 들어 있어요. 그 안의 <code>embedding</code>이 숫자 1,024개짜리 목록이에요.',
        ex: ['', '거꾸로 읽었어요. 바깥 목록이 조각 수, 안쪽 목록이 숫자 개수예요.', '1,024는 토큰 수가 아니라 벡터의 칸 수(차원)예요.', '1,024는 글자 수가 아니에요. 글 길이와 상관없이 늘 1,024칸이에요.'] },
      { t: 'sum', pts: ['조각은 solar-embedding-2-passage로 저장하고, 질문은 solar-embedding-2-query로 찾는다. 둘 다 숫자 1,024개.', 'client는 hello_solar.py와 같고 client.embeddings.create(model, input)를 부른다. 결과는 resp.data[i].embedding.', '한 요청에 100개까지 묶어 보낸다. 옛 이름(embedding-query, solar-embedding-1-large)과 옛 숫자(4096)는 바꿔 읽는다.'] }
    ]},

    /* =================== QA =================== */
    { id: 'QA', type: 'quiz', title: '헷갈림 퀴즈 ①', sub: 'query와 passage, 차원과 토큰, 임베딩과 생성', min: 3, steps: [
      { t: 'q', kind: 'mc', fig: 'qa_wrongSide', q: '옆 반 선생님이 조각도 질문도 모두 <code>solar-embedding-2-query</code>로 임베딩했어요. 에러는 안 나는데 검색이 영 시원찮대요. 어떻게 고칠까요?',
        opts: ['질문도 passage로 바꿔 둘을 같은 모델로 맞춘다', '조각만 passage로 다시 임베딩해 저장한다', 'query로 저장했으니 top-k를 크게 늘려 보완한다', '모델은 그대로 두고 조각을 더 길게 자른다'], a: 1,
        why: '두 모델은 짝이에요. 찾을 대상(조각)은 passage, 찾는 말(질문)은 query로 바꿔야 서로 맞게 비교돼요. 조각을 고쳐 저장했으니 다시 임베딩해요.',
        ex: ['같은 모델로 맞추는 게 아니라 짝을 지키는 거예요. 조각은 passage, 질문은 query.', '', 'k를 늘려도 짝이 어긋난 건 그대로예요. 잡음만 늘어요.', '조각 길이는 다른 문제예요. 먼저 모델 짝부터 바로잡아요.'] },
      { t: 'q', kind: 'mc', fig: 'qa_dims', q: '300토큰짜리 긴 조각과 10토큰짜리 짧은 질문을 임베딩했어요. 돌아온 숫자 목록의 길이는?',
        opts: ['조각은 300개, 질문은 10개', '조각 쪽이 더 길다. 글이 길수록 숫자가 많다', '둘 다 1,024개', '둘 다 4096개'], a: 2,
        why: '벡터 길이(차원)는 모델이 정해요. 글이 길든 짧든 지금 모델은 늘 1,024개를 돌려줘요. 길이가 같아야 서로 비교할 수 있어요.',
        ex: ['토큰 수와 벡터 길이(차원)는 서로 다른 거예요.', '글 길이와 상관없이 같은 모델은 늘 같은 개수를 돌려줘요.', '', '옛 문서에 적힌 숫자예요. 지금 모델은 1,024예요.'] },
      { t: 'q', kind: 'mc', fig: 'qa_noAnswer', q: '<code>client.embeddings.create</code>에 "반복문을 쉽게 설명해 줘"를 보냈어요. 무엇이 올까요?',
        opts: ['숫자 1,024개짜리 목록 하나', '반복문을 쉽게 설명한 답 글', '설명 글과 숫자 목록 둘 다', '"질문에는 답할 수 없어요"라는 오류'], a: 0,
        why: '임베딩은 부탁을 따르지 않고, 받은 글의 뜻을 숫자로 바꿀 뿐이에요. 설명 글이 필요하면 <code>client.chat.completions</code>로 Solar를 불러요.',
        ex: ['', '답 글을 쓰는 건 생성 모델(Solar)이에요.', '임베딩 응답에는 숫자 목록만 와요.', '오류 없이 숫자 목록이 와요. 질문이든 설명이든 글이면 다 숫자로 바꿔요.'] }
    ]},

    /* =================== L3 =================== */
    { id: 'L3', type: 'lesson', title: '조각 나누기', sub: '제목·길이·겹치기, 제목 붙이기와 메타데이터', min: 12, steps: [
      { t: 'say', h: '자료를 통째로 임베딩하면 뜻이 흐려져요', fig: 'sizeGoldi', p: [
        '학습지 20쪽을 벡터 하나로 만들면 반복·조건·자료·정보가 한 점에 뭉개져요. 어떤 질문과도 조금씩만 비슷해서, 어디가 근거인지 집어내지 못해요.',
        '반대로 문장 하나씩 너무 잘게 자르면 "그래서 이것은 거짓이 된다"처럼 앞뒤를 모르는 조각이 생겨요. <b>한 조각에 한 뜻</b>이 담기면서도 혼자 읽혀야 좋은 조각이에요.',
        '조각 크기는 나중에 근거 크기가 돼요. c3u1에서 찾은 조각을 Solar에게 넣어 주니, 조각이 크면 토큰(돈)도 늘어요. 처음엔 <b>문단 몇 개, 수백 자</b>로 시작해 레슨 5의 점검으로 맞춰요.'
      ]},
      { t: 'say', h: '나누는 기준: 제목, 길이, 둘 다', fig: 'cutWays', table: { head: ['방법', '어떻게', '좋은 점·조심할 점'], rows: [
        ['<b>제목 단위</b>', 'Document Parse의 <code>heading1</code> 요소나 markdown의 <code>#</code> 줄에서 자른다', '한 주제가 한 조각에 모여요. 절이 길면 조각도 커져요'],
        ['<b>길이 단위</b>', '정해진 글자 수(예: 400자)마다 자른다', '크기가 고르지만 문장 중간에서 잘려요'],
        ['<b>둘 다</b>', '제목으로 먼저 나누고, 긴 절만 길이로 한 번 더', '수업자료에 가장 무난해요'] ] }, p: [
        'c2u1 L3에서 본 요소를 떠올려요. <code>heading1</code>은 제목, <code>paragraph</code>는 문단, <code>table</code>은 표예요. 학습지는 보통 "1. 자료와 정보", "2. 정보의 가치"처럼 제목이 있어서 제목 단위가 잘 맞아요.',
        'c2u1 L5에서 걸러 낸 머리말·꼬리말(<code>header</code>·<code>footer</code>)은 조각에 넣지 않아요. 쪽마다 되풀이되는 "○○고 정보 2학년" 같은 글은 검색만 흐려요.'
      ]},
      { t: 'say', h: '겹치기: 경계에서 잘린 뜻을 이어 줘요', fig: 'overlapFig', p: [
        '길이로 자르면 "조건식이 거짓이 | 되면 반복을 끝낸다"처럼 문장 하나가 두 조각으로 갈라질 수 있어요. 그러면 어느 조각도 그 뜻을 온전히 갖지 못해요.',
        '그래서 다음 조각을 <b>앞 조각의 끝 일부</b>부터 시작해요. 이 겹친 부분이 <b>overlap</b>이에요. 400자씩 자르며 80자를 겹치면 시작 위치가 0, 320, 640, …으로 <code>size - overlap</code>씩 움직여요.',
        '겹치기가 크면 조각 수가 늘어 저장과 비용도 늘어요. 업스테이지 쿡북의 한 예제는 1,000자 조각에 100자를 겹쳤어요. 내 자료에서는 점검표로 맞춰요.'
      ]},
      { t: 'say', h: '조각 앞에 제목을, 옆에 출처를 붙여요', fig: 'titleTag', p: [
        '"조건식이 거짓이면 빠져나온다"만 있는 조각은 무엇의 이야기인지 몰라요. 맨 앞에 <b>[반복 구조]</b>처럼 제목을 붙이면 그 뜻이 숫자 목록에도 담겨 "반복문" 질문과 더 가까워져요.',
        '조각마다 <b>메타데이터</b>(어느 파일, 몇 쪽, 어떤 제목)를 함께 저장해요. 숫자 목록에는 출처가 없어서, c3u1에서 "알고리즘 학습지 2쪽"처럼 출처를 보여 주려면 지금 적어 둬야 해요.',
        '이 목록을 <code>chunks.json</code>으로 저장해요. 미션에서 내 수업자료로 만들어요.'
      ], code: { lang: 'json', src: src(['[', '  {', '    "id": "algo-2-1",', '    "file": "algo.md",', '    "page": 2,', '    "title": "반복 구조",', '    "text": "[반복 구조] while은 …"', '  }', ']']) } },
      { t: 'try', lang: 'py', h: '연습장: 겹치며 자르고 제목 붙이기', p: '긴 글을 정해진 글자 수로 자르고, 겹치기와 제목을 붙이는 함수예요. 실행한 뒤 <code>size</code>와 <code>overlap</code>을 바꿔 조각이 어떻게 달라지는지 봐요.',
        src: src([
          'def chunk(text, title, size=24, overlap=6):',
          '    out = []',
          '    step = size - overlap',
          '    for s in range(0, len(text), step):',
          '        out.append(f"[{title}] " + text[s:s + size])',
          '        if s + size >= len(text):',
          '            break',
          '    return out',
          '',
          'doc = ("while은 조건이 참인 동안 되풀이해요. "',
          '       "조건이 거짓이 되면 반복을 멈춰요.")',
          'for c in chunk(doc, "반복 구조"):',
          '    print(c)'
        ]),
        note: 'overlap을 0으로 바꾸면 경계에서 낱말이 잘린 채 끝나요. 진짜 자료에서는 size를 수백 자로 둬요.' },
      { t: 'q', kind: 'mc', fig: 'q_wholeSheet', q: '정보 교과 학습지 다섯 개를 파일마다 조각 하나로 임베딩했어요(조각 5개). "while은 언제 끝나요?"라고 물으면 알고리즘 학습지 전체가 나와요. 무엇이 문제일까요?',
        opts: ['query 대신 passage로 질문을 임베딩했다', '조각이 너무 작아 앞뒤 맥락을 잃었다', '조각이 너무 커서 여러 주제가 한 벡터에 섞였다', '임베딩 모델이 학습지 파일을 읽지 못했다'], a: 2,
        why: '학습지 한 장 전체가 벡터 하나라서 반복·조건·순서도가 한 점에 뭉개졌어요. 어디가 근거인지 알려 주지도 못해요. 제목 단위로 나눠 다시 임베딩해요.',
        ex: ['모델 짝 문제가 아니라 조각 크기 문제예요.', '거꾸로예요. 학습지 한 장 통째라 너무 커요.', '', '읽었기에 알고리즘 학습지가 나온 거예요. 다만 너무 크게 나와요.'] },
      { t: 'q', kind: 'blank', fig: 'q_startPos', q: '400자씩 자르고 80자를 겹쳐요. 조각이 시작하는 위치를 채워 보세요.', lang: 'plain', code: '0, [[1]], 640, 960, …',
        opts: ['400', '320', '480', '80'], a: 1,
        why: '다음 조각은 앞 조각 끝에서 80자 물러난 곳에서 시작해요. 걸음은 <code>size - overlap</code> = 400 - 80 = 320이에요.',
        ex: ['겹치기가 없을 때(400자씩 그대로) 위치예요.', '', '400에 80을 더하면 오히려 80자가 빠져요.', '80은 겹치는 길이예요. 시작 위치는 320씩 움직여요.'] },
      { t: 'q', kind: 'mc', mono: true, fig: 'q_abcd', q: '실행하면 무엇이 나올까요?', lang: 'py', code: src(['def chunk(text, size, overlap):', '    out, step = [], size - overlap', '    for s in range(0, len(text), step):', '        out.append(text[s:s + size])', '        if s + size >= len(text):', '            break', '    return out', '', 'print(chunk("ABCDEFGHIJ", 4, 1))']),
        opts: ["['ABCD', 'EFGH', 'IJ']", "['ABCD', 'CDEF', 'EFGH', 'GHIJ']", "['ABCD', 'DEFG', 'GHIJ', 'J']", "['ABCD', 'DEFG', 'GHIJ']"], a: 3,
        why: '걸음은 4 - 1 = 3이라 0, 3, 6에서 시작해요. 6에서 자른 GHIJ가 글 끝(10)에 닿아 멈춰요. 이웃한 조각끼리 한 글자(D, G)씩 겹쳐요.',
        ex: ['겹치기가 없을 때(overlap 0) 결과예요.', '두 글자씩 겹칠 때(overlap 2) 결과예요.', 'GHIJ가 끝에 닿으면 break로 멈춰서 J만 남은 조각은 생기지 않아요.', ''] },
      { t: 'q', kind: 'mc', fig: 'q_lostContext', q: '"이때 결과는 거짓이 되어 빠져나온다"라는 조각이 "반복문 언제 끝나요?" 검색에서 자꾸 아래로 밀려요. 가장 먼저 해 볼 고침은?',
        opts: ['조각 앞에 제목을 붙여 다시 임베딩한다', '이 질문만 passage 모델로 임베딩한다', '이 조각을 지우고 다른 조각만 남긴다', 'top-k를 1로 줄여 1등만 보게 한다'], a: 0,
        why: '"이때"가 무엇인지 조각만 봐서는 몰라요. 제목을 붙이면 반복 구조의 이야기라는 뜻이 숫자 목록에 담겨 질문과 가까워져요.',
        ex: ['', '질문은 늘 query예요. 짝을 바꾸면 더 나빠져요.', '정답이 든 조각이에요. 지우면 근거가 사라져요.', 'k를 줄이면 밀려난 조각은 더 안 나와요.'] },
      { t: 'sum', pts: ['통째로는 뜻이 뭉개지고, 너무 잘게는 맥락을 잃는다. 한 조각에 한 뜻, 수백 자에서 시작한다.', '제목(heading1, #) 단위로 먼저 나누고 긴 절만 길이로 자른다. 머리말·꼬리말은 뺀다. 겹치기 걸음은 size - overlap.', '조각 앞에 [제목]을 붙이고, 파일·쪽·제목을 메타데이터로 chunks.json에 함께 저장한다.'] }
    ]},

    /* =================== L4 =================== */
    { id: 'L4', type: 'lesson', title: '코사인 유사도와 top-k', sub: '화살표 사이 각도, 점수 정렬, search.py', min: 15, steps: [
      { t: 'say', h: '숫자 목록은 화살표, 뜻이 비슷하면 같은 쪽을 가리켜요', fig: 'cosAngle', p: [
        '숫자 목록(벡터)은 원점에서 뻗은 <b>화살표</b>로 볼 수 있어요. 숫자가 2개면 종이 위 화살표, 1,024개면 머릿속에서만 그릴 수 있는 화살표예요.',
        '뜻이 비슷한 글은 화살표가 <b>비슷한 쪽</b>을 가리켜요. 그래서 질문 화살표와 조각 화살표 사이 <b>각도</b>가 작을수록 가까운 뜻이에요.',
        '각도를 점수로 바꾼 것이 <b>코사인 유사도</b>예요. 같은 쪽이면 1, 직각이면 0, 정반대면 -1이에요. 화살표 길이는 상관없고 방향만 봐요.'
      ]},
      { t: 'say', h: '코사인 = 내적 ÷ (길이 × 길이)', fig: 'cosScale', p: [
        '<b>내적</b>은 같은 칸끼리 곱해서 모두 더한 값이에요. [1, 2, 0]과 [2, 1, 1]이면 1×2 + 2×1 + 0×1 = 4예요.',
        '<b>길이</b>는 칸마다 제곱해 더한 뒤 제곱근(<code>math.sqrt</code>)을 씌워요. 내적을 두 길이의 곱으로 나누면 길이가 지워지고 방향(각도)만 남아요.',
        '업스테이지 임베딩은 길이가 1로 맞춰져 나온다는 설명이 있어서 내적만으로도 같은 값이 돼요. 그래도 이 과정은 어떤 벡터에도 맞는 코사인 공식을 그대로 써요.'
      ], code: { lang: 'py', src: src(['import math', '', 'def length(v):', '    s = sum(x * x for x in v)', '    return math.sqrt(s)', '', 'def cos(a, b):', '    dot = sum(x*y for x, y in zip(a, b))', '    return dot / (length(a) * length(b))', '', 'a, b = [1, 2, 0], [2, 1, 1]', 'print(round(cos(a, b), 3))']), out: '0.73' } },
      { t: 'try', lang: 'py', h: '연습장: 장난감 벡터로 top-2 찾기', p: '진짜 벡터는 1,024칸이지만 여기서는 4칸짜리 장난감 벡터로 해 봐요. 칸마다 [반복, 조건, 자료, 가치] 느낌을 일부러 정했어요(진짜 임베딩 칸에는 이런 이름표가 없어요).',
        src: src([
          'import math',
          '',
          'def cos(a, b):',
          '    dot = sum(x * y for x, y in zip(a, b))',
          '    na = math.sqrt(sum(x * x for x in a))',
          '    nb = math.sqrt(sum(x * x for x in b))',
          '    return dot / (na * nb)',
          '',
          'chunks = {',
          '    "반복 구조": [0.9, 0.1, 0.0, 0.2],',
          '    "조건 구조": [0.6, 0.6, 0.1, 0.1],',
          '    "자료와 정보": [0.1, 0.0, 0.9, 0.3],',
          '    "정보의 가치": [0.2, 0.1, 0.6, 0.7],',
          '}',
          'q = [0.8, 0.3, 0.1, 0.1]  # 반복문 언제 끝나요?',
          '',
          'scores = []',
          'for title, vec in chunks.items():',
          '    scores.append((round(cos(q, vec), 3), title))',
          'scores.sort(reverse=True)',
          'for s, title in scores[:2]:',
          '    print(title, s)'
        ]),
        note: 'q를 [0.1, 0.0, 0.8, 0.5]("자료랑 정보 뭐가 달라요?")로 바꿔 실행해 봐요. 1등과 2등이 바뀌나요?' },
      { t: 'say', h: 'top-k: 점수 큰 순으로 줄 세워 앞에서 k개', fig: 'topk', p: [
        '질문 벡터와 모든 조각 벡터의 코사인을 구하고, <b>점수가 큰 순</b>으로 정렬해 앞에서 k개를 골라요. 이것이 <b>top-k</b> 검색이에요.',
        'k가 작으면 근거가 두 조각에 나뉘어 있을 때 하나를 놓쳐요. k가 크면 관련 없는 조각이 섞이고, c3u1에서 Solar에게 넣을 글(토큰)도 늘어요. 처음엔 <b>3</b>쯤으로 시작해 점검표로 맞춰요.',
        '검색은 늘 k개를 돌려줘요. 자료에 없는 질문에도 "그나마 가까운" 조각이 나오니 점수를 같이 보는 습관을 들여요.'
      ]},
      { t: 'say', h: 'search.py ① 조각 벡터는 한 번 만들어 json에 저장해요', fig: 'searchPy', p: [
        '<code>chunks.json</code>의 조각을 passage 모델로 임베딩해, 조각마다 <code>"vec"</code> 칸에 숫자 목록을 붙여 <code>vectors.json</code>으로 저장해요. 조각이 100개를 넘으면 100개씩 나눠 보내요.',
        '이 일은 <b>자료가 바뀔 때만</b> 해요. 질문할 때마다 조각을 다시 임베딩하면 시간과 돈이 새요.',
        '벡터 DB 같은 따로 된 도구 없이 json 파일과 파이썬만 써요. 수업자료 몇백 조각이면 이걸로 충분하고, 무엇이 어떻게 도는지 눈으로 보여요.'
      ], code: { lang: 'py', src: src(['import json', 'texts = [c["text"] for c in chunks]', 'resp = client.embeddings.create(', '    model=P_MODEL, input=texts)', 'for c, d in zip(chunks, resp.data):', '    c["vec"] = d.embedding', '', 'with open("vectors.json", "w",', '          encoding="utf-8") as f:', '    json.dump(chunks, f,', '              ensure_ascii=False)']) },
        tip: '<code>encoding="utf-8"</code>을 꼭 적어요. 학교 Windows PC에서 한글이 깨지는 걸 막아요.' },
      { t: 'say', h: 'search.py ② 질문만 임베딩해 top-k를 골라요', p: [
        '<code>vectors.json</code>을 읽어 <code>chunks</code>에 담고, 질문 하나만 query 모델로 임베딩해요. 위에서 만든 <code>cos</code>로 모든 조각과 점수를 매기고, 큰 순으로 정렬해 앞에서 k개를 돌려줘요.',
        '파일 맨 아래에는 <code>sys.argv[1]</code>로 질문을 받아 점수·제목·파일을 찍는 두 줄을 붙여요. 그러면 <code>python search.py "질문"</code>으로 바로 시험할 수 있어요.'
      ], code: { lang: 'py', src: src(['with open("vectors.json",', '          encoding="utf-8") as f:', '    chunks = json.load(f)', 'def search(question, k=3):', '    resp = client.embeddings.create(', '        model=Q_MODEL, input=[question])', '    q = resp.data[0].embedding', '    scored = [(cos(q, c["vec"]), c)', '              for c in chunks]', '    scored.sort(key=lambda x: x[0],', '                reverse=True)', '    return scored[:k]']) } },
      { t: 'sim', h: 'search.py로 찾아봐요', p: '터미널에서 질문 세 개를 차례로 검색해 봐요. 입력칸을 누르면 명령이 쳐져요(점수는 예시예요).',
        scene: { win: 'ide', folder: 'upstage-lab', files: LAB2, open: 'search.py', lang: 'py', code: SEARCH_PY, term: TERM0 },
        steps: [
          { goal: '반복 구조 질문을 검색해요', type: Q1, into: 'term', then: { term: TERM0.concat(R1), prompt: '' },
            say: '반복 구조 조각 둘이 위에 있어요. 긴 절이 두 조각으로 나뉘어 둘 다 나왔어요.' },
          { goal: '자료와 정보 질문을 검색해요', type: Q2, into: 'term', then: { term: TERM0.concat(R1, R2), prompt: '' },
            say: '"자료랑"처럼 말로 물어도 자료와 정보 조각이 1등이에요. 낱말이 아니라 뜻으로 찾았어요.' },
          { goal: '자료에 없는 질문을 검색해요', type: Q3, into: 'term', then: { term: TERM0.concat(R1, R2, R3), prompt: '' },
            say: '자료에 없는 질문에도 세 개가 나와요. 대신 점수가 다른 질문보다 확 낮아요. 이 차이는 레슨 5에서 점검해요.' } ],
        end: '조각은 한 번 저장, 질문은 매번 query로. 결과는 점수와 함께 봐요.' },
      { t: 'q', kind: 'mc', fig: 'q_cosMeaning', q: '질문 화살표와 조각 화살표가 거의 <b>직각</b>을 이뤄요. 코사인 유사도와 그 뜻으로 알맞은 것은?',
        opts: ['1 근처. 거의 같은 뜻이다', '-1 근처. 정반대 뜻이다', '0 근처. 뜻이 별로 상관없다', '90 근처. 각도가 크니 점수도 크다'], a: 2,
        why: '코사인은 같은 쪽이면 1, 직각이면 0, 정반대면 -1이에요. 직각이면 0 근처라 이 조각은 근거로 쓰기 어려워요.',
        ex: ['1은 두 화살표가 같은 쪽을 가리킬 때예요.', '-1은 정반대 쪽일 때예요.', '', '코사인은 -1에서 1 사이 값이에요. 각도를 그대로 쓰지 않아요.'] },
      { t: 'q', kind: 'mc', mono: true, fig: 'q_orth', q: '레슨의 <code>cos</code> 함수로 실행하면 무엇이 나올까요?', lang: 'py', code: 'print(cos([1, 0, 1], [0, 1, 0]))',
        opts: ['0.0', '1.0', '-1.0', '0.5'], a: 0,
        why: '같은 칸끼리 곱하면 1×0, 0×1, 1×0이라 내적이 0이에요. 0을 무엇으로 나눠도 0이라 0.0이 나와요. 두 화살표가 직각이에요.',
        ex: ['', '1.0은 같은 쪽일 때예요. 이 둘은 겹치는 칸이 없어요.', '-1.0은 [-1, 0, -1]처럼 정반대일 때예요.', '내적이 0이면 점수도 0이에요.'] },
      { t: 'q', kind: 'blank', fig: 'q_slice', q: '점수 큰 순으로 정렬해 둔 <code>scored</code>에서 top-k를 꺼내요. 빈칸은?', lang: 'py', code: src(['scored.sort(key=lambda x: x[0],', '            reverse=True)', 'top = [[1]]']),
        opts: ['scored[k:]', 'scored[-k:]', 'scored[:k]', 'scored[k]'], a: 2,
        why: '큰 순으로 정렬했으니 앞에서 k개(<code>[:k]</code>)가 점수가 가장 높은 조각들이에요.',
        ex: ['k번째 뒤의 나머지예요. 점수가 낮은 쪽이에요.', '큰 순 정렬이라 맨 뒤 k개는 점수가 가장 낮아요.', '', '조각 하나(k+1등)만 꺼내요.'] },
      { t: 'q', kind: 'mc', fig: 'q_reembed', q: '학생 질문이 들어올 때마다 search.py가 조각 300개를 모두 다시 임베딩하고 있어요. 어떻게 바꿀까요?',
        opts: ['질문을 저장해 두고, 조각을 매번 query로 임베딩한다', '조각 벡터는 저장본을 읽고, 질문만 임베딩한다', '조각을 30개로 줄여 매번 임베딩한다', '검색을 그만두고 조각 300개를 모두 Solar에게 넣는다'], a: 1,
        why: '조각 벡터는 자료가 바뀔 때만 만들어 저장해요. 질문할 때는 질문 하나만 임베딩하면 돼서 빠르고 싸요.',
        ex: ['조각을 query로 바꾸면 짝도 어긋나고, 여전히 매번 300개를 보내요.', '', '조각을 줄이면 근거가 빠져요. 저장해 두고 다시 쓰면 돼요.', '자료가 짧으면 통째로 넣기도 되지만(c3u1), 이 문제는 다시 임베딩을 멈추면 풀려요.'] },
      { t: 'sum', pts: ['벡터는 화살표. 코사인 유사도는 각도를 점수로: 같은 쪽 1, 직각 0, 정반대 -1. 길이는 상관없다.', '코사인 = 내적 ÷ (길이 × 길이), 길이는 math.sqrt(제곱 합). 점수 큰 순 정렬 뒤 [:k]가 top-k.', 'search.py: 조각 벡터는 vectors.json에 한 번 저장, 질문만 query로 임베딩. 검색은 늘 k개를 돌려주니 점수도 본다.'] }
    ]},

    /* =================== QB =================== */
    { id: 'QB', type: 'quiz', title: '헷갈림 퀴즈 ②', sub: '코사인과 거리, top-k 크기, 조각 크기', min: 3, steps: [
      { t: 'q', kind: 'mc', fig: 'qb_distance', q: '다른 도구에서 받은 <b>거리</b>(distance) 점수를 코사인 때처럼 <b>큰 순</b>으로 정렬했더니 가장 엉뚱한 조각이 1등이에요. 왜일까요?',
        opts: ['거리는 작을수록 가깝다. 작은 순으로 정렬해야 한다', '거리 점수는 늘 0이라 정렬이 안 된다', '거리는 query 모델에서만 나온다', '코사인과 거리는 같은 값이라 다른 곳이 틀렸다'], a: 0,
        why: '코사인 유사도는 <b>클수록</b> 비슷하고, 거리는 <b>작을수록</b> 가까워요. 점수 이름을 보고 정렬 방향을 정해요.',
        ex: ['', '거리 점수도 조각마다 달라요. 방향이 거꾸로일 뿐이에요.', '거리는 두 벡터 사이를 재는 방법이에요. 모델 종류와 상관없어요.', '둘은 다른 값이에요. 코사인은 클수록, 거리는 작을수록 가까워요.'] },
      { t: 'q', kind: 'mc', fig: 'qb_k1', q: '"while이랑 for 뭐가 달라요?"를 물었어요. 학습지에서 while 설명(2쪽)과 for 설명(3쪽)이 다른 조각에 있어요. top-k를 1로 두면?',
        opts: ['두 조각이 하나로 합쳐져 나온다', '한 조각만 나와 근거 절반을 놓친다', '점수가 같아서 오류가 난다', 'k는 작을수록 늘 정확하니 문제없다'], a: 1,
        why: 'k=1이면 가장 높은 조각 하나만 와요. 두 조각에 걸친 질문은 근거가 반쪽이 돼요. 처음엔 k=3쯤으로 시작해요.',
        ex: ['검색은 조각을 합치지 않아요. 점수 순으로 골라 올 뿐이에요.', '', '점수가 같아도 정렬은 돼요. 오류가 나지 않아요.', 'k가 작으면 잡음은 줄지만 근거를 놓칠 수 있어요.'] },
      { t: 'q', kind: 'mc', fig: 'qb_tiny', q: '조각을 문장 하나(30자 안팎)씩 아주 잘게 잘랐더니 "그래서 이것은 거짓이 된다" 같은 조각이 1등으로 나와요. 무엇이 문제일까요?',
        opts: ['조각이 너무 커서 주제가 섞였다', '겹치기를 너무 크게 줬다', '조각이 너무 작아 맥락을 잃었다', 'query와 passage를 바꿔 썼다'], a: 2,
        why: '너무 작은 조각은 "이것", "그래서"처럼 앞을 가리키는 말만 남아 뜻이 흐려요. 문단 단위로 키우고 제목을 붙여요.',
        ex: ['거꾸로예요. 문장 하나라 너무 작아요.', '겹치기는 경계를 잇는 일이에요. 이 조각은 혼자 읽히지 않는 게 문제예요.', '', '모델 짝이 아니라 조각 크기 문제예요.'] }
    ]},

    /* =================== L5 =================== */
    { id: 'L5', type: 'lesson', title: '검색 품질 점검', sub: '질문 10개 시험표, 고칠 곳, 비용 어림', min: 10, steps: [
      { t: 'say', h: '답보다 검색을 먼저 재요', fig: 'checkTable', p: [
        '검색이 엉뚱한 조각을 가져오면, c3u1에서 Solar가 아무리 잘 써도 답이 틀리거나 지어낸 말이 섞여요. 그래서 <b>답을 붙이기 전에 검색부터</b> 점검해요.',
        '방법은 간단해요. 질문 10개를 정하고, 질문마다 <b>정답 조각</b>을 사람이 미리 정해요. search.py로 top-3를 뽑아 정답 조각이 그 안에 있으면 O예요.',
        'O의 개수가 이 검색기의 점수예요. 무엇을 고친 뒤에는 <b>같은 질문 10개</b>로 다시 재야 나아졌는지 알 수 있어요.'
      ]},
      { t: 'say', h: '질문은 학생 말투로, 자료에 없는 질문도 섞어요', table: { head: ['질문 종류', '예(정보 교과)', '왜'], rows: [
        ['교과서 말 그대로', '자료와 정보의 차이는?', '기본은 되는지'],
        ['학생 말투·줄임말', 'while 언제 탈출해요?', '실제 질문은 이렇게 와요'],
        ['풀어 쓴 질문', '같은 일을 여러 번 시키는 코드는?', '낱말이 달라도 찾는지'],
        ['두 조각에 걸친 질문', 'while이랑 for 뭐가 달라요?', 'k가 넉넉한지'],
        ['자료에 없는 질문', '다음 주 수행평가 언제예요?', '점수가 낮게 나오는지'] ] }, p: [
        '학생은 교과서 낱말로 묻지 않아요. 수업에서 실제로 받은 질문을 모아 쓰면 가장 좋아요. 학생 이름은 빼요.',
        '<b>자료에 없는 질문</b>도 한두 개 넣어요. 이때 top-3 점수가 다른 질문보다 낮게 나오는지 봐요. 이 차이로 c3u1에서 "자료에 없어요"라고 답하게 만들어요.'
      ]},
      { t: 'try', lang: 'md', h: '연습장: 내 검색 점검표', p: '내 수업 단원으로 바꿔 질문을 채워 보세요. 미션에서 이 표에 진짜 결과를 적어요.',
        src: src([
          '# 검색 점검표 (알고리즘 단원)',
          '',
          '| # | 질문 | 정답 조각 | top-3 안? | 몇 등 |',
          '|---|---|---|---|---|',
          '| 1 | 반복문 언제 끝나요? | 반복 구조 2쪽 | O | 1 |',
          '| 2 | while이랑 for 뭐가 달라요? | 반복 구조 2·3쪽 | O | 2 |',
          '| 3 | 같은 일을 여러 번 시키려면? | 반복 구조 2쪽 | X | - |',
          '| 4 | 다음 주 수행평가 언제예요? | (자료에 없음) | - | - |',
          '',
          '적중: 2 / 3 (자료에 없는 질문 빼고)',
          '고칠 곳 하나: '
        ]) },
      { t: 'say', h: '못 찾을 때 고칠 곳', fig: 'fixMap', table: { head: ['이런 모습이면', '여기를 고쳐요'], rows: [
        ['긴 조각 몇 개가 거의 모든 질문에서 1등', '<b>조각 크기</b>를 줄여요'],
        ['정답 문장이 두 조각 경계에서 잘림', '<b>겹치기</b>를 줘요'],
        ['"이때 …"처럼 맥락 없는 조각이 밀려남', '조각 앞에 <b>제목</b>을 붙여요'],
        ['학생 줄임말 질문만 못 찾음', '<b>질문 다듬기</b>: 검색 전에 줄임말을 풀어요'],
        ['"○○고 2학년" 같은 머리말 조각이 자꾸 나옴', 'c2u1처럼 <code>header</code>·<code>footer</code>를 빼요'] ] }, p: [
        '한 번에 <b>한 가지만</b> 고치고 다시 재요. 여러 개를 한꺼번에 바꾸면 무엇 때문에 나아졌는지 몰라요.',
        '조각을 고치면 <b>다시 임베딩</b>해요(chunks.json → vectors.json). 질문 다듬기는 질문 쪽만 바꾸니 다시 임베딩할 필요가 없어요.',
        '키워드 점수와 임베딩 점수를 섞는 방법은 c4u4(2일차 트랙 B 엿보기)에서 해요.'
      ]},
      { t: 'say', h: '임베딩 비용은 아주 싸요', fig: 'costFig', p: [
        '정가로 임베딩 2는 <b>100만 토큰당 $0.02</b>예요(바뀔 수 있어요). <code>solar-pro4</code> 입력값($0.30)의 15분의 1이에요.',
        '학습지 20쪽을 조각 100개 × 300토큰으로 나누면 3만 토큰, 어림하면 <b>$0.0006</b>이에요. 학생 질문은 한 번에 수십 토큰이라 거의 0원이에요.',
        '같은 학습지를 standard로 파싱하는 값(쪽당 $0.01 × 20쪽 = $0.2)이나, 학생 30명이 질문 10개씩 할 때 <code>solar-pro4</code>로 답을 쓰는 값(약 $0.29)이 훨씬 커요. 조각을 고쳐 다시 임베딩하는 건 아까워하지 않아도 돼요.'
      ], tip: '가격은 자주 바뀌어요. 수업에 쓰기 전에 업스테이지 가격 페이지와 콘솔 <b>Usage</b>를 직접 확인해요.' },
      { t: 'q', kind: 'mc', fig: 'q_lowHit', q: '점검표가 3 / 10이에요. 틀린 질문들을 보니 1,500자가 넘는 긴 조각 서너 개가 거의 모든 질문에서 1등을 차지해요. 먼저 고칠 곳은?',
        opts: ['조각 크기를 줄여 다시 나누고 다시 임베딩한다', 'top-k를 10으로 늘린다', '질문 10개를 더 쉬운 것으로 바꾼다', '질문도 passage 모델로 임베딩한다'], a: 0,
        why: '긴 조각은 여러 주제가 섞여 어떤 질문과도 그럭저럭 비슷해요. 조각을 줄여 한 조각에 한 뜻이 담기게 한 뒤, 같은 질문 10개로 다시 재요.',
        ex: ['', 'k를 늘려도 긴 조각이 그대로 위에 있고 잡음만 늘어요.', '점검표를 쉽게 바꾸면 점수만 오르고 검색은 그대로예요.', '질문은 query 짝이 맞아요. 문제는 조각 크기예요.'] },
      { t: 'q', kind: 'mc', fig: 'q_cost500', q: '조각 500개, 조각마다 400토큰이에요. 임베딩 2 가격(100만 토큰당 $0.02)으로 어림한 비용은?',
        opts: ['약 $0.0004', '약 $0.04', '약 $0.004', '약 $4'], a: 2,
        why: '500 × 400 = 20만 토큰이에요. 20만 ÷ 100만 × $0.02 = $0.004. 학습지 파싱 값보다도 훨씬 적어요.',
        ex: ['10배 작게 셌어요. 20만 토큰은 100만의 0.2배라 0.2 × $0.02 = $0.004예요.', '10배 크게 셌어요. 0.2 × $0.02 = $0.004예요.', '', '1,000배 크게 셌어요. 임베딩은 아주 싸요.'] },
      { t: 'q', kind: 'order', fig: 'q_loopOrder', q: '검색 품질을 올리는 한 바퀴를 순서대로 쌓아 보세요.',
        items: ['질문 10개와 질문마다 정답 조각을 정한다', 'search.py로 top-3를 뽑아 O·X를 적는다', '틀린 질문들의 공통점을 찾는다', '한 가지만 고치고, 조각을 바꿨다면 다시 임베딩한다', '같은 질문 10개로 다시 잰다'],
        why: '정답을 먼저 정해야 O·X를 매길 수 있고, 틀린 것들을 봐야 고칠 곳을 고를 수 있어요. 고친 뒤에는 같은 질문으로 다시 재야 비교가 돼요.' },
      { t: 'q', kind: 'mc', fig: 'q_offTopic', q: '자료에 없는 "다음 주 수행평가 언제예요?"로 검색했더니 top-3에 반복 구조 조각들이 나왔어요. 점수는 다른 질문들보다 확 낮아요. 알맞은 해석은?',
        opts: ['검색기가 고장 났다. 자료에 없는 질문이면 빈 목록이 나와야 정상이다', '검색은 늘 k개를 돌려준다. 점수가 낮으면 자료에 없다는 신호로 본다', '반복 구조 조각 어딘가에 수행평가 날짜가 숨어 있다', 'k를 1로 줄이면 엉뚱한 조각이 사라진다'], a: 1,
        why: 'top-k는 점수 순으로 k개를 늘 골라 와요. 그래서 점수를 함께 보고, 낮으면 "자료에 없어요"로 답하게 만들어요(c3u1).',
        ex: ['고장이 아니에요. top-k는 늘 k개를 골라요.', '', '점수가 낮다는 건 뜻이 멀다는 거예요. 날짜가 숨어 있다는 뜻이 아니에요.', 'k=1이어도 가장 가까운 엉뚱한 조각 하나가 나와요.'] },
      { t: 'sum', pts: ['답보다 검색을 먼저 잰다. 질문 10개마다 정답 조각을 정하고, top-3 안에 있으면 O. 자료에 없는 질문도 섞는다.', '고칠 곳: 조각 크기, 겹치기, 제목 붙이기, 질문 다듬기, 머리말 빼기. 한 번에 하나만 바꾸고 같은 질문으로 다시 잰다.', '임베딩 2는 100만 토큰당 $0.02(2026-10 기준). 학습지 20쪽은 약 $0.0006으로 파싱·답 쓰기보다 훨씬 싸다.'] }
    ]},

    /* =================== M1 =================== */
    { id: 'M1', type: 'mission', title: '내 수업자료로 검색기 만들기', sub: '콘솔과 내 Cursor에서 직접', min: 40,
      where: '업스테이지 콘솔 + upstage-lab 폴더',
      intro: '이번 단원에서 배운 것을 내 수업자료로 진짜 해 봐요. c2u1에서 만든 <code>data/*.md</code>(학생 개인정보가 없는 내 학습지)를 써요. 끝낸 것부터 체크하고, 한 줄 메모도 남겨요.',
      tasks: [
        { do: '시작 전에 커밋하고, 임베딩 모델 이름을 AGENTS.md에 적어요',
          how: '터미널에서 <code>git status</code>로 <code>.env</code>가 목록에 없는지 보고 <code>git add -A</code> → <code>git commit -m "c2u3 시작 전"</code>. 그다음 <code>AGENTS.md</code>에 한 줄 더해요: 임베딩은 <code>solar-embedding-2-query</code>(질문)·<code>solar-embedding-2-passage</code>(조각), 옛 이름(<code>embedding-query</code>, <code>solar-embedding-1-large</code>)은 쓰지 않기.',
          check: '<code>git log</code> 맨 위에 커밋이 있고, AGENTS.md에 두 모델 이름이 있으면 성공.' },
        { do: '수업자료를 조각내 chunks.json을 만들어요',
          how: 'Cursor 에이전트에게 아래 부탁을 붙여 넣어요. API를 부르지 않는 일이라 비용이 없어요. 계획을 먼저 보고, 괜찮으면 진행하게 해요.',
          check: '<code>chunks.json</code>이 생기고, 조각이 대부분 400자 안팎이며, 이웃한 두 조각의 끝과 앞이 80자쯤 겹치면 성공.',
          prompt: 'upstage-lab의 data/ 폴더에 있는 .md 파일(c2u1에서 parse.py로 만든 내 수업자료)로 검색용 조각을 만드는 chunk.py를 만들어 줘.\n- 나누기: #으로 시작하는 제목 줄에서 새 조각을 시작하고, 한 조각이 400자를 넘으면 400자씩 자르되 80자를 겹쳐 줘.\n- 조각마다 id, file, title, text를 저장하고, text 맨 앞에 "[제목] "을 붙여 줘. 쪽 번호가 있으면 page도.\n- 결과는 chunks.json(UTF-8, ensure_ascii=False)으로 저장해.\n- API는 부르지 말고, 표준 라이브러리만 써.\n- 확인: 실행하면 조각 개수와 앞의 조각 2개를 출력해 줘.\n코드를 쓰기 전에 계획부터 보여 줘.' },
        { do: '조각을 임베딩해 vectors.json에 저장해요',
          how: '에이전트에게 아래 부탁을 줘요. 먼저 <code>--test</code>로 조각 5개만 보내 보고, 문제없으면 전체를 돌려요.',
          check: '<code>vectors.json</code>이 생기고, 아무 조각이나 하나의 <code>vec</code> 길이가 1024면 성공. 터미널이나 코드 어디에도 키가 찍히지 않았는지도 봐요.',
          prompt: 'chunks.json의 text를 업스테이지 임베딩으로 바꿔 vectors.json에 저장하는 embed.py를 만들어 줘.\n- OpenAI SDK, base_url="https://api.upstage.ai/v1", 키는 .env의 UPSTAGE_API_KEY(키를 출력하지 마).\n- 모델은 변수로: P_MODEL = "solar-embedding-2-passage". embedding-passage, solar-embedding-1-large 같은 옛 이름은 쓰지 마.\n- 한 요청에 100개씩 나눠 보내고, 429가 나면 1·2·4초 기다렸다 다시 보내.\n- 조각마다 "vec" 칸에 숫자 목록을 붙여 UTF-8로 저장해.\n- --test 옵션을 주면 앞의 5개만 처리해 줘.\n- 확인: 끝나면 조각 수와 첫 벡터 길이를 출력해 줘.' },
        { do: 'search.py로 top-3를 찾아요',
          how: '에이전트에게 아래 부탁을 줘요. 다 되면 <code>python search.py "질문"</code>으로 직접 돌려 봐요.',
          check: '내 자료의 소제목 하나를 그대로 질문했을 때 그 조각이 1등으로 나오면 성공.',
          prompt: 'vectors.json을 읽어 질문과 가장 비슷한 조각 3개를 찾는 search.py를 만들어 줘.\n- 질문만 Q_MODEL = "solar-embedding-2-query"로 임베딩하고, 조각은 다시 임베딩하지 마.\n- 코사인 유사도는 math.sqrt로 직접 계산해(numpy, 벡터 DB 쓰지 마).\n- python search.py "질문"으로 실행하면 점수(소수 셋째 자리), title, file을 3줄로 출력해.\n- 확인: data 자료의 소제목 하나를 그대로 질문해 그 조각이 1등인지 보여 줘.' },
        { do: '질문 5개로 점검표를 채워요',
          how: '<code>results.md</code>에 표로 적어요: 질문 | 정답 조각(미리 내가 정함) | top-3 | O·X. 학생 말투 질문 2개, 교과서 말 질문 2개, 자료에 없는 질문 1개. 시간이 나면 10개로 늘려요.',
          check: '표가 다 채워지고, O가 몇 개인지와 틀린 질문에 고칠 곳 하나를 메모에 적으면 성공.' },
        { do: '비용을 확인해요',
          how: '콘솔 <b>Usage</b>나 BILLING의 <b>Credit</b>에서 이번 실습으로 얼마나 썼는지 봐요. 어림값(조각 수 × 조각당 토큰 × $0.02 ÷ 100만)과 견줘요. 화면 모양과 반영 시점은 바뀔 수 있어요.',
          check: '쓴 돈이 어림처럼 아주 작다는 걸 확인했으면 성공. 마지막으로 <code>git status</code>에 <code>.env</code>가 없는지 보고 커밋해요.' }
      ],
      note: '예상 비용: 학습지 20쪽 ≈ 조각 100개 × 300토큰 = 3만 토큰 → 임베딩 2(100만 토큰당 $0.02, 정가 기준, 바뀔 수 있어요)로 약 $0.0006. 질문은 거의 0원이에요. 이름·학번이 있는 학생 자료(답안, 상담 기록)는 쓰지 말고, 키는 <code>.env</code>에만 둬요. <code>vectors.json</code>은 다시 만들 수 있으니 파일이 크면 <code>.gitignore</code>에 넣어도 돼요.' },

    /* =================== T1 =================== */
    { id: 'T1', type: 'test', title: '단원 형성평가', sub: '10문제 · 7문제 이상 맞히면 통과', min: 12, pass: 0.7, steps: [
      { t: 'q', kind: 'mc', fig: 't_old1024', q: '연수 1일차 15:00 실습이에요. 블로그에서 복사한 임베딩 예제를 모델 이름만 지금 것으로 바꿔 돌렸더니 <code>len(vec)</code>이 1024로 나왔어요. 블로그에는 4096이라고 적혀 있었어요. 어떻게 할까요?',
        opts: ['코드가 잘못됐다. 4096이 나올 때까지 모델 이름을 바꿔 본다', '지금 모델은 1,024차원이니 그대로 쓴다', '1024칸 뒤에 0을 붙여 4096칸으로 늘려 저장한다', '옛 이름 embedding-query로 되돌려야 맞는 결과가 나온다'], a: 1,
        why: '4096은 옛 문서의 숫자예요. 지금 <code>solar-embedding-2-query</code>·<code>-passage</code>는 1,024차원이에요. 조각과 질문을 같은 짝으로 만들었다면 길이가 같아 바로 비교할 수 있어요.',
        ex: ['모델은 맞게 바꿨어요. 옛 숫자에 맞출 이유가 없어요.', '', '0을 붙여도 뜻이 늘지 않아요. 저장 공간만 커져요.', '옛 이름은 지금 이름으로 바꿔 읽어요. 되돌리지 않아요.'] },
      { t: 'q', kind: 'line', fig: 't_stepLine', q: '400자씩 자르며 80자를 겹치려고 만든 함수예요. 그런데 결과를 보니 겹치기는커녕 조각 사이 80자가 통째로 빠져요. <b>틀린 줄</b>을 눌러 보세요.', lang: 'py',
        code: src(['def chunk(text, size=400, overlap=80):', '    out = []', '    step = size + overlap', '    for s in range(0, len(text), step):', '        out.append(text[s:s + size])', '        if s + size >= len(text):', '            break', '    return out']), a: 2,
        why: '다음 조각은 앞 조각 끝에서 overlap만큼 <b>물러나</b> 시작해야 해요. 걸음은 <code>size - overlap</code>(320)이에요. <code>size + overlap</code>(480)이면 400~480자 사이가 빠져요.' },
      { t: 'q', kind: 'blank', fig: 't_cosBlank', q: '코사인 유사도 함수예요. 두 빈칸을 채워 보세요.', lang: 'py',
        code: src(['def length(v):', '    s = sum(x * x for x in v)', '    return math.[[1]](s)', '', 'def cos(a, b):', '    dot = sum(x*y for x, y in zip(a, b))', '    return dot / ([[2]])']),
        opts: [['sqrt', 'length(a) + length(b)'], ['abs', 'length(a) * length(b)'], ['pow', 'dot * dot'], ['sqrt', 'length(a) * length(b)']], a: 3,
        why: '길이는 제곱 합의 제곱근(<code>math.sqrt</code>)이고, 코사인은 내적을 두 길이의 <b>곱</b>으로 나눠요.',
        ex: ['첫 칸은 맞아요. 길이는 더하지 않고 곱해서 나눠요.', '길이는 제곱 합의 제곱근이에요. abs는 절댓값이에요.', 'pow는 거듭제곱이에요. 내적끼리 곱한 값으로 나누면 코사인이 아니에요.', ''] },
      { t: 'q', kind: 'order', fig: 't_prepOrder', q: '연수 1일차 15:00 「내 수업자료로 대답하는 나만의 보조 agent」 실습이에요. 정보 교과서 PDF 한 단원을 검색할 수 있게 준비하는 순서로 쌓아 보세요.',
        items: ['Document Parse로 PDF를 markdown으로 바꾼다', '머리말·꼬리말을 빼고 제목 단위로 조각을 나눈다', '조각마다 제목·쪽을 붙여 chunks.json에 저장한다', 'passage 모델로 조각을 임베딩해 vectors.json에 저장한다', 'query 모델로 시험 질문을 임베딩해 top-3를 확인한다'],
        why: '글이 있어야 나누고, 조각이 있어야 출처를 붙여 저장하고, 저장한 조각을 임베딩해야 질문과 비교할 수 있어요. 시험 질문은 준비가 다 된 뒤에 해요.' },
      { t: 'q', kind: 'mc', mono: true, fig: 't_cos45', q: '레슨의 <code>cos</code> 함수로 실행하면 무엇이 나올까요?', lang: 'py', code: src(['q = [1, 1, 0]', 'c = [1, 0, 0]', 'print(round(cos(q, c), 3))']),
        opts: ['1.0', '1.414', '0.707', '0.0'], a: 2,
        why: '내적은 1×1 + 1×0 + 0×0 = 1, 길이는 √2(약 1.414)와 1이에요. 1 ÷ 1.414 ≈ 0.707. 두 화살표 사이가 45도예요.',
        ex: ['1.0은 같은 쪽일 때예요. q에는 c에 없는 칸이 하나 더 있어요.', '1.414는 q의 길이(√2)예요. 내적 1을 이 길이로 나눠야 해요.', '', '내적이 1이라 0이 아니에요.'] },
      { t: 'q', kind: 'mc', fig: 't_429', q: '연수장에서 조각 1,000개를 for 문으로 한 개씩 임베딩 요청했더니 중간에 <code>429</code>가 쏟아졌어요. 가장 알맞은 고침은?',
        opts: ['100개씩 묶어 보내고, 429면 기다렸다 다시', '요청 사이에 기다리지 말고 더 빨리 보낸다', '모델을 solar-pro4로 바꿔 임베딩한다', '429는 키가 틀렸다는 뜻이니 .env를 다시 적는다'], a: 0,
        why: '429는 너무 많은 요청이에요. 한 요청에 100개까지 묶으면 요청 수가 10분의 1로 줄고, 그래도 걸리면 1·2·4초 기다렸다 다시 보내요.',
        ex: ['', '더 빨리 보내면 한도에 더 자주 걸려요.', 'solar-pro4는 글을 쓰는 모델이에요. 임베딩은 solar-embedding-2로 만들어요.', '키가 틀리면 401이에요. 429는 요청이 너무 많다는 뜻이에요.'] },
      { t: 'q', kind: 'mc', fig: 't_slang', q: '점검표를 보니 "while 탈출 언제?"처럼 줄여 쓴 학생 질문만 정답 조각을 못 찾고, 교과서 낱말로 물으면 잘 찾아요. 먼저 고칠 곳은?',
        opts: ['조각 크기를 두 배로 키운다', 'top-k를 3에서 30으로 늘린다', '검색 전에 질문을 교과서 말로 풀어 쓰게 한다', '임베딩 모델을 solar-pro4로 바꾼다'], a: 2,
        why: '교과서 낱말로는 잘 찾으니 조각 쪽은 괜찮아요. 줄임말을 풀어 쓰는 질문 다듬기가 먼저예요. 질문 쪽만 바꾸니 다시 임베딩할 필요도 없어요.',
        ex: ['조각 쪽 문제가 아니에요. 교과서 낱말로는 잘 찾잖아요.', 'k를 크게 하면 잡음이 늘고 c3u1에서 넣을 글도 길어져요.', '', 'solar-pro4는 글을 쓰는 모델이에요. 임베딩은 solar-embedding-2가 만들어요.'] },
      { t: 'q', kind: 'mc', fig: 't_meta', q: '검색 결과를 학생에게 보여 줄 때 "알고리즘 학습지 2쪽"처럼 출처를 달고 싶어요. 언제 무엇을 해 둬야 할까요?',
        opts: ['검색할 때마다 Solar에게 이 조각의 출처를 물어본다', '벡터의 첫 칸에 쪽 번호를 넣어 둔다', 'query 모델이 출처를 함께 돌려주니 따로 할 일이 없다', '조각을 만들 때 파일·쪽을 함께 저장한다'], a: 3,
        why: '임베딩 결과에는 숫자만 있어요. 출처는 조각을 만들 때 메타데이터로 chunks.json에 함께 적어 둬야 나중에 보여 줄 수 있어요.',
        ex: ['모델은 조각이 어느 파일에서 왔는지 몰라요. 그럴듯하게 지어낼 수도 있어요.', '벡터 칸은 모델이 정한 뜻 숫자예요. 손대면 비교가 망가져요.', '임베딩 응답에는 숫자 목록만 와요.', ''] },
      { t: 'q', kind: 'mc', fig: 't_update', q: '알고리즘 학습지 3쪽 내용을 고쳤어요. 고친 내용이 검색에 나오게 하려면?',
        opts: ['바뀐 조각을 passage로 다시 임베딩한다', '질문을 임베딩하는 query 모델 설정만 다시 한다', 'search.py의 k를 하나 늘린다', '아무것도 안 해도 임베딩 모델이 새 내용을 알아서 읽는다'], a: 0,
        why: '검색은 저장해 둔 조각 벡터와 비교해요. 자료가 바뀌면 그 조각을 다시 나누고 다시 임베딩해 vectors.json을 새로 써야 해요.',
        ex: ['', '질문 쪽은 그대로예요. 바뀐 건 조각 쪽이에요.', 'k를 늘려도 옛 조각만 더 나와요.', '모델은 내 파일을 읽지 않아요. 내가 보낸 글만 숫자로 바꿔요.'] },
      { t: 'q', kind: 'mc', fig: 't_privacy', q: '학생 30명의 수행평가 답안(이름·학번 포함)을 검색 자료로 넣으면 "잘 쓴 답 예시"를 찾아 줄 수 있겠다는 생각이 들었어요. 알맞은 판단은?',
        opts: ['임베딩은 숫자라서 개인정보 걱정이 없다', '쓰지 않고, 학교·교육청 지침부터 확인한다', '학번만 지우면 어디에 써도 괜찮다', 'vectors.json으로 저장하면 암호화되니 괜찮다'], a: 1,
        why: '임베딩하려면 원문을 API로 보내고, chunks.json에도 원문이 남아요. 학생 개인정보가 담긴 자료는 쓰지 않고, 쓰려면 학교·교육청 지침부터 확인해요.',
        ex: ['보내는 순간 원문이 밖으로 나가고, 원문 text도 파일에 함께 저장돼요.', '', '이름이 남아 있고, 답안 내용으로도 누구인지 알 수 있어요. 지침부터 확인해요.', 'json은 그냥 글 파일이에요. 암호화되지 않아요.'] }
    ]}
    ]
  });
})();
