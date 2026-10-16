// 과정 2 · 단원 2 · Information Extract로 문항·정답 뽑기
(function () {
  function src(a) { return a.join('\n'); }
  // 창 틀(위 막대 + 점 세 개)
  function win(P, x, y, w, h) {
    P.rrect(x, y, w, h, 10, { fill: 'paper', fs: 'solid' });
    P.line(x, y + 22, x + w, y + 22, { w: 1.5 });
    P.circle(x + 12, y + 11, 7, { fill: 'bad', fs: 'solid', c: null });
    P.circle(x + 24, y + 11, 7, { fill: 'hi', fs: 'solid', c: null });
    P.circle(x + 36, y + 11, 7, { fill: 'good', fs: 'solid', c: null });
  }
  // 형성평가지 쪽지: 제목 줄 + 번호 동그라미 + 문항 줄
  function sheet(P, x, y, w, h, fill) {
    P.note(x, y, w, h, { fill: fill || 'paper' });
    P.line(x + 12, y + 18, x + w * 0.62, y + 18, { c: 'ink2', w: 3 });
    const n = Math.max(2, Math.min(5, Math.floor((h - 34) / 18)));
    for (let i = 0; i < n; i++) {
      const yy = y + 38 + i * 18;
      P.circle(x + 16, yy, 7, { c: 'accent', w: 1.3 });
      P.line(x + 26, yy, x + w - 14 - (i % 2) * 12, yy, { c: 'soft', w: 2.4 });
    }
  }
  // JSON 결과 상자(어두운 칸에 { } 와 색 줄)
  function jsonBox(P, x, y, w, h) {
    P.rrect(x, y, w, h, 8, { fill: 'ink', fs: 'solid' });
    P.text(x + 10, y + 20, '{', { mono: true, size: 14, c: 'paper', anchor: 'start' });
    P.text(x + 10, y + h - 8, '}', { mono: true, size: 14, c: 'paper', anchor: 'start' });
    const cols = ['k', 's', 'n', 't'];
    const n = Math.max(1, Math.min(4, Math.floor((h - 40) / 14)));
    for (let i = 0; i < n; i++) P.line(x + 22, y + 30 + i * 14, x + w * (0.5 + 0.1 * (i % 3)) + 8, y + 30 + i * 14, { c: cols[i], w: 3 });
  }
  // 빈 서식: 칸 이름 + 비어 있는 칸
  function form(P, x, y, w, rows, fill) {
    const h = 30 + rows.length * 24;
    P.rrect(x, y, w, h, 8, { fill: fill || 'paper', gap: 6 });
    rows.forEach((r, i) => {
      const yy = y + 22 + i * 24;
      P.text(x + 10, yy + 12, r, { size: 11, mono: true, anchor: 'start' });
      P.rrect(x + w * 0.5, yy, w * 0.5 - 10, 16, 4, { c: 'soft', w: 1.4 });
    });
    return h;
  }
  // 터미널 상자
  function termBox(P, x, y, w, h) {
    P.rrect(x, y, w, h, 8, { fill: 'ink', fs: 'solid' });
    P.text(x + 10, y + 20, '$', { mono: true, size: 13, c: 'good', anchor: 'start' });
  }
  // 서버 상자(이름표 달린 기계)
  function server(P, x, y, w, h, label, fill, size) {
    P.rrect(x, y, w, h, 10, { fill: fill || 'sky', gap: 6 });
    P.line(x + 10, y + h - 14, x + w - 10, y + h - 14, { c: 'ink2', w: 1.4 });
    P.circle(x + w - 16, y + h - 7, 6, { fill: 'good', fs: 'solid', w: 1 });
    if (label) P.text(x + w / 2, y + h / 2 + 2, label, { size: size || 13, weight: 700 });
  }
  // 동전
  function coin(P, cx, cy, d, label) {
    P.circle(cx, cy, d, { fill: 'hi', fs: 'solid', w: 1.6 });
    P.circle(cx, cy, d * 0.72, { c: 'warm', w: 1.2 });
    if (label) P.text(cx, cy + 5, label, { size: 13, weight: 700 });
  }
  // 사람(어깨 + 머리 + 얼굴). bottom = 어깨 아래 끝
  function person(P, cx, bottom, mood, s) {
    s = s || 1;
    P.path(`M${cx - 40 * s} ${bottom} Q${cx} ${bottom - 64 * s} ${cx + 40 * s} ${bottom}`, { fill: 'sky', gap: 6 });
    P.circle(cx, bottom - 90 * s, 62 * s, { fill: 'paper' });
    P.face(cx, bottom - 88 * s, 50 * s, { mood: mood || 'smile' });
  }
  // 글자가 든 동그란 단추
  function chip(P, x, y, w, h, label, fill, size) {
    P.rrect(x, y, w, h, 8, { fill: fill || 'paper', gap: 5, w: 1.6 });
    P.text(x + w / 2, y + h / 2 + (size || 13) * 0.36, label, { size: size || 13, weight: 700 });
  }
  // 켜고 끄는 스위치(40×20)
  function toggle(P, x, y, on) {
    P.rrect(x, y, 40, 20, 10, { fill: on ? 'good' : 'soft', fs: 'solid', w: 1.4 });
    P.circle(on ? x + 30 : x + 10, y + 10, 16, { fill: 'paper', fs: 'solid', w: 1.2 });
  }
  // 노트북
  function laptop(P, x, y, w, h, fill) {
    P.rrect(x, y, w, h, 8, { fill: fill || 'paper', w: 2 });
    P.path(`M${x - 6} ${y + h} L${x + w + 6} ${y + h} L${x + w + 12} ${y + h + 12} L${x - 12} ${y + h + 12} Z`, { fill: 'soft', gap: 5 });
  }
  // 흩어진 카드(순서 문제용)
  function card(P, x, y) { P.rrect(x, y, 92, 70, 10, { fill: 'paper' }); }
  function cross(P, cx, cy, r, c) {
    P.line(cx - r, cy - r, cx + r, cy + r, { c: c || 'bad', w: 3 });
    P.line(cx + r, cy - r, cx - r, cy + r, { c: c || 'bad', w: 3 });
  }
  function tick(P, cx, cy, r) { P.path(`M${cx - r} ${cy} L${cx - r * 0.3} ${cy + r * 0.7} L${cx + r} ${cy - r * 0.7}`, { c: 'good', w: 3.2 }); }
  function ask(P, x, y, size, c) { P.text(x, y, '?', { size: size || 22, weight: 700, c: c || 'warm' }); }
  // 자물쇠(strict)
  function lock(P, x, y) {
    P.path(`M${x + 12} ${y + 2} L${x + 12} ${y - 14} Q${x + 12} ${y - 32} ${x + 30} ${y - 32} Q${x + 48} ${y - 32} ${x + 48} ${y - 14} L${x + 48} ${y + 2}`, { w: 2.8 });
    P.rrect(x, y, 60, 46, 7, { fill: 'hi', gap: 5, w: 1.8 });
    P.circle(x + 30, y + 20, 10, { fill: 'ink', fs: 'solid', c: null });
    P.line(x + 30, y + 24, x + 30, y + 36, { w: 3 });
  }

  /* ---------- 모의 화면에서 되풀이하는 조각 ---------- */
  const LAB = ['data/', 'quiz3.pdf', '.env', '.gitignore', 'parse.py', 'extract.py', 'schema.json'];
  const LAB2 = ['data/', 'quiz3.pdf', '.env', 'extract.py', 'check.py', 'schema.json', 'questions.json'];
  const EXTRACT_TAIL = src([
    '# extract.py (아랫부분)',
    'resp = client.chat.completions.create(',
    '    model="information-extract",',
    '    messages=[msg],',
    '    response_format=FMT,',
    ')',
    'data = json.loads(',
    '    resp.choices[0].message.content)',
    'print(json.dumps(data, indent=2,',
    '                 ensure_ascii=False))']);
  const SCHEMA_JSON = src([
    '{',
    '  "type": "object",',
    '  "properties": {',
    '    "title": {"type": "string"},',
    '    "items": {"type": "array",',
    '      "items": {"type": "object",',
    '        "properties": {',
    '          "no": {"type": "integer"},',
    '          "question": {"type": "string"},',
    '          "choices": {"type": "string"},',
    '          "answer": {"type": "string"},',
    '          "points": {"type": "integer"}',
    '        }}}',
    '  }',
    '}']);
  const RUN1 = ['$ python extract.py', '{', '  "title": "3단원 형성평가",', '  "items": [', '    {', '      "no": 1,', '      "question": "1바이트는 몇 비트?",',
    '      "choices": "①4 ②8 ③16 ④32",', '      "answer": "2",', '      "points": 2', '    },', '    … (2~4번도 같은 모양)', '  ]', '}'];
  const CHECK_PY = src([
    '# check.py: questions.json 규칙 검사',
    'import json',
    'TOTAL = 10',
    'OK = ["1", "2", "3", "4"]',
    'with open("questions.json",',
    '          encoding="utf-8") as f:',
    '    items = json.load(f)["items"]',
    '# 빈 답·보기 번호·배점 합계를 보고',
    '# 걸린 것을 "교사 확인 목록"으로 출력']);
  const QJ = a => src([
    '{',
    '  "title": "3단원 형성평가",',
    '  "items": [',
    '    { "no": 1, … },',
    '    { "no": 2, … },',
    '    {',
    '      "no": 3,',
    '      "question": "리스트 길이 함수는?",',
    '      "choices": "",',
    `      "answer": "${a}",`,
    '      "points": 3',
    '    },',
    '    { "no": 4, … }',
    '  ]',
    '}']);

  HANIP.unit({
    id: 'c2u2',
    course: '과정 2 · 수업자료를 데이터로',
    title: '단원 2 · Information Extract로 문항·정답 뽑기',
    goals: ['파싱과 추출의 차이를 알고 문항 스키마 설계하기', 'extract.py로 형성평가지에서 문항·정답 JSON 뽑기', 'Solar 구조화 출력과 골라 쓰고, 검증해 questions.json 만들기'],
    checked: { date: '2026-10-16' },
    sources: [
      'https://console.upstage.ai/docs/capabilities/extract/universal-extraction',
      'https://console.upstage.ai/docs/capabilities/parse/document-parsing',
      'https://console.upstage.ai/docs/capabilities/generate/chat',
      'https://console.upstage.ai/api/chat',
      'https://console.upstage.ai/docs/models',
      'https://console.upstage.ai/docs/models/history',
      'https://www.upstage.ai/pricing/api',
      'https://github.com/UpstageAI/upstage-extensions-hub',
      'https://github.com/UpstageAI/Solar-Pro4-Cookbook',
      'https://docs.python.org/3/library/base64.html',
      'https://docs.python.org/3/library/json.html'
    ],

    figs: {
      /* ---------- L1 설명 그림 ---------- */
      parseVsExtract: { w: 340, h: 200, label: '같은 형성평가지가 Document Parse로는 전체 글, Information Extract로는 칸만 채운 JSON이 되는 모습', draw(P) {
        sheet(P, 12, 8, 64, 82, 'paper');
        P.arrow(84, 49, 126, 49, { c: 'accent', w: 2.4, head: 9 });
        P.note(132, 8, 74, 82, { fill: 'paper' });
        for (let i = 0; i < 5; i++) P.line(142, 26 + i * 13, 196 - (i % 2) * 14, 26 + i * 13, { c: 'soft', w: 2.4 });
        P.text(272, 42, 'Document Parse', { size: 12, weight: 700 });
        P.text(272, 64, '전체 글', { size: 13, c: 'ink2' });
        P.line(12, 100, 328, 100, { c: 'soft', w: 1.2 });
        sheet(P, 12, 110, 64, 82, 'paper');
        P.arrow(84, 151, 126, 151, { c: 'warm', w: 2.4, head: 9 });
        jsonBox(P, 132, 112, 74, 78);
        P.text(272, 144, 'Information Extract', { size: 12, weight: 700 });
        P.text(272, 166, '원하는 칸만', { size: 13, c: 'ink2' });
      }},
      blankForm: { w: 340, h: 204, label: '칸 이름만 있는 빈 서식과 형성평가지를 IE가 읽고 칸을 채우는 모습', draw(P) {
        form(P, 12, 14, 128, ['title', 'no', 'answer', 'points']);
        P.text(76, 164, '빈 서식(스키마)', { size: 13, weight: 700 });
        P.robot(196, 84, 0.42, { mood: 'happy' });
        P.arrow(146, 78, 170, 82, { c: 'accent', w: 2, head: 7 });
        sheet(P, 252, 24, 76, 104, 'hi');
        P.arrow(248, 80, 224, 82, { c: 'accent', w: 2, head: 7 });
        P.text(290, 150, '형성평가지', { size: 12, weight: 700 });
        P.text(170, 194, 'IE가 문서를 읽고 칸을 채워요', { size: 13, c: 'accent' });
      }},
      sheetToJson: { w: 340, h: 204, label: '형성평가지 한 장이 번호·정답·배점 칸이 있는 JSON 목록이 되는 모습', draw(P) {
        sheet(P, 12, 14, 110, 150, 'paper');
        P.arrow(130, 90, 168, 90, { c: 'accent', w: 3, head: 11 });
        P.rrect(176, 14, 152, 150, 10, { fill: 'ink', fs: 'solid' });
        ['{', ' "no": 1,', ' "answer": "2",', ' "points": 2', '},', '{ "no": 2, … }'].forEach((r, i) =>
          P.text(188, 38 + i * 22, r, { mono: true, size: 12, c: i % 4 === 0 ? 'paper' : 's', anchor: 'start' }));
        P.text(170, 192, '평가지 한 장 → 문항 목록', { size: 13, c: 'accent' });
      }},

      /* ---------- L1 문제 그림 ---------- */
      q_whichTool: { w: 340, h: 200, label: '형성평가지 PDF 옆에 번호·정답·배점 칸만 필요하다는 단추와 고민하는 얼굴', draw(P) {
        sheet(P, 14, 16, 96, 130, 'paper');
        P.text(62, 168, 'quiz3.pdf', { mono: true, size: 12 });
        chip(P, 130, 24, 64, 28, '번호', 'sky', 13);
        chip(P, 130, 60, 64, 28, '정답', 'hi', 13);
        chip(P, 130, 96, 64, 28, '배점', 'good', 13);
        P.text(162, 148, '이것만!', { size: 13, weight: 700, c: 'accent' });
        person(P, 282, 196, 'wow', 0.75);
        ask(P, 282, 62, 30);
      }},
      q_schemaIs: { w: 340, h: 200, label: '열쇠, 분류 카드, 서식 종이, 결과 상자 넷 앞에서 스키마가 뭔지 묻는 얼굴', draw(P) {
        P.circle(40, 46, 26, { fill: 'hi', gap: 5, w: 2 });
        P.line(53, 46, 92, 46, { w: 3 });
        P.line(84, 46, 84, 58, { w: 3 });
        P.line(76, 46, 76, 56, { w: 3 });
        [0, 1, 2].forEach(i => P.rrect(118 + i * 8, 22 + i * 8, 44, 34, 5, { fill: 'paper', w: 1.6 }));
        P.rrect(18, 100, 76, 78, 6, { fill: 'paper', w: 1.6 });
        [0, 1, 2].forEach(i => { P.line(26, 120 + i * 20, 50, 120 + i * 20, { c: 'ink2', w: 2 }); P.rrect(56, 112 + i * 20, 30, 14, 3, { c: 'soft', w: 1.2 }); });
        jsonBox(P, 118, 104, 64, 74);
        person(P, 272, 196, 'wow', 0.72);
        P.bubble(214, 10, 116, 44, 256, 76);
        P.text(272, 38, '스키마가 뭐죠?', { size: 13, weight: 700 });
      }},
      q_fieldBlank: { w: 340, h: 200, label: '1번 문항의 보기 ②에 정답 동그라미가 쳐진 평가지와 answer 칸이 빈 결과 상자', draw(P) {
        P.note(12, 16, 168, 112, { fill: 'paper' });
        P.text(24, 44, '1. 1바이트는 몇 비트?', { size: 12, anchor: 'start', weight: 700 });
        ['①4', '②8', '③16', '④32'].forEach((t, i) => P.text(44 + i * 38, 76, t, { size: 13 }));
        P.circle(82, 72, 34, { c: 'bad', w: 2.2 });
        P.text(24, 108, '배점 2점', { size: 12, anchor: 'start', c: 'ink2' });
        P.arrow(188, 72, 214, 72, { c: 'accent', w: 2.4, head: 9 });
        P.rrect(220, 40, 110, 70, 8, { fill: 'ink', fs: 'solid' });
        P.text(232, 66, '"answer":', { mono: true, size: 12, c: 'paper', anchor: 'start' });
        ask(P, 262, 98, 20);
        P.text(170, 160, '설명: 객관식은 보기 번호를 숫자 글자로', { size: 12, c: 'ink2' });
      }},
      q_parseEnough: { w: 340, h: 200, label: '문항이 다 들어 있는 긴 Markdown 글과 IE가 왜 또 필요하냐고 묻는 동료', draw(P) {
        P.note(14, 14, 150, 160, { fill: 'paper' });
        P.text(26, 38, '# 3단원 형성평가', { size: 12, weight: 700, anchor: 'start' });
        for (let i = 0; i < 7; i++) P.line(26, 58 + i * 16, 150 - (i % 3) * 18, 58 + i * 16, { c: 'soft', w: 2.4 });
        person(P, 268, 196, 'smile', 0.75);
        P.bubble(184, 12, 148, 48, 244, 82);
        P.text(258, 42, 'IE는 왜 또 필요해요?', { size: 12, weight: 700 });
      }},

      /* ---------- L2 설명 그림 ---------- */
      typeChips: { w: 340, h: 204, label: 'string, integer, number, array, object 다섯 type 단추와 뜻', draw(P) {
        [['string', '글자', 'sky'], ['integer', '정수', 'hi'], ['number', '소수도 되는 수', 'good'], ['array', '목록', 'warm'], ['object', '이름 붙은 칸 묶음', 'pink']].forEach(([n, k, f], i) => {
          const x = i < 3 ? 12 + i * 108 : 66 + (i - 3) * 108, y = i < 3 ? 14 : 96;
          chip(P, x, y, 100, 34, n, f, 14);
          P.text(x + 50, y + 56, k, { size: 12, c: 'ink2' });
        });
        P.text(170, 194, '칸마다 type + description', { size: 13, weight: 700, c: 'accent' });
      }},
      ieRules: { w: 340, h: 204, label: '맨 위 object는 되고, 첫 단계 object와 배열 안 배열은 안 되는 세 그림', draw(P) {
        P.rrect(12, 14, 100, 110, 10, { fill: 'sky', gap: 6 });
        P.text(62, 78, '{ }', { mono: true, size: 24, weight: 700 });
        P.rrect(122, 14, 100, 110, 10, { fill: 'paper', w: 1.8 });
        P.text(172, 44, '{', { mono: true, size: 18, weight: 700 });
        P.rrect(140, 56, 64, 40, 8, { fill: 'warm', gap: 5 });
        P.text(172, 82, '{ }', { mono: true, size: 14 });
        P.rrect(232, 14, 100, 110, 10, { fill: 'paper', w: 1.8 });
        P.text(282, 78, '[ [ ] ]', { mono: true, size: 18, weight: 700 });
        P.text(62, 148, '맨 위 object', { size: 12, weight: 700 });
        P.text(172, 148, '첫 단계 object', { size: 12, weight: 700 });
        P.text(282, 148, '배열 안 배열', { size: 12, weight: 700 });
        tick(P, 62, 178, 12);
        cross(P, 172, 178, 10);
        cross(P, 282, 178, 10);
      }},
      twoDesigns: { w: 340, h: 204, label: '보기 목록을 한 줄 글자로 합친 설계와 첫 단계에 따로 배열을 둔 설계', draw(P) {
        P.rrect(12, 14, 150, 120, 10, { fill: 'paper', w: 1.8 });
        P.text(24, 40, 'choices', { mono: true, size: 12, weight: 700, anchor: 'start' });
        P.rrect(22, 56, 130, 30, 14, { fill: 'hi', gap: 5 });
        P.text(87, 76, '①4 ②8 ③16 ④32', { mono: true, size: 11 });
        P.face(87, 112, 28, { mood: 'happy' });
        P.rrect(178, 14, 150, 120, 10, { fill: 'paper', w: 1.8 });
        P.text(190, 40, 'choice_list', { mono: true, size: 12, weight: 700, anchor: 'start' });
        [['no', 'mark', 'text'], ['1', '1', '4'], ['1', '2', '8'], ['2', '1', '101']].forEach((r, i) =>
          r.forEach((v, j) => P.text([204, 244, 292][j], 64 + i * 18, v, { mono: true, size: 11, c: i ? 'ink' : 'accent' })));
        P.text(87, 160, '① 한 줄 글자로', { size: 13, weight: 700 });
        P.text(253, 160, '② 첫 단계에 따로', { size: 13, weight: 700 });
        P.text(170, 192, '둘 다 IE 규칙에 맞아요', { size: 12, c: 'ink2' });
      }},

      /* ---------- L2 문제 그림 ---------- */
      q_badSchema: { w: 340, h: 200, label: '스키마 첫 단계 자리에 놓인 칸 넷과 고민하는 얼굴', draw(P) {
        P.rrect(14, 16, 200, 160, 10, { fill: 'paper', w: 1.8 });
        P.text(26, 40, 'properties', { mono: true, size: 12, weight: 700, anchor: 'start', c: 'accent' });
        ['title', 'total', 'exam', 'items'].forEach((k, i) => chip(P, 30 + (i % 2) * 92, 56 + Math.floor(i / 2) * 56, 80, 36, k, 'sky', 13));
        person(P, 284, 196, 'wow', 0.7);
        ask(P, 284, 70, 28);
      }},
      q_lineSchema: { w: 340, h: 200, label: 'JSON 서식 종이를 돋보기로 한 줄씩 살피는 모습', draw(P) {
        P.note(20, 14, 150, 170, { fill: 'paper' });
        for (let i = 0; i < 8; i++) P.line(34 + (i % 3) * 10, 36 + i * 18, 150 - (i % 4) * 14, 36 + i * 18, { c: ['k', 's', 'n', 't'][i % 4], w: 3 });
        P.circle(226, 90, 70, { fill: 'sky', gap: 5, w: 2.6 });
        P.line(250, 116, 280, 150, { w: 5 });
        P.face(226, 90, 40, { mood: 'wow' });
        P.text(270, 188, '규칙에 걸리는 줄?', { size: 13, weight: 700, c: 'warm' });
      }},
      q_vague: { w: 340, h: 200, label: 'answer 칸에 "2", "②", "8비트"가 제각각 들어와 어지러운 얼굴', draw(P) {
        chip(P, 20, 24, 70, 34, '"2"', 'sky', 14);
        chip(P, 110, 60, 70, 34, '"②"', 'hi', 14);
        chip(P, 30, 104, 96, 34, '"8비트"', 'warm', 14);
        P.text(100, 172, 'answer 칸이 제각각', { size: 13, weight: 700 });
        person(P, 270, 196, 'dizzy', 0.8);
        P.drop(318, 96, 7);
      }},
      q_typeBlank: { w: 340, h: 200, label: '배점 2점과 3점 쪽지, 그리고 type 칸이 비어 있는 서식', draw(P) {
        P.note(18, 22, 70, 56, { fill: 'hi' });
        P.text(53, 58, '2점', { size: 18, weight: 700 });
        P.note(18, 98, 70, 56, { fill: 'hi' });
        P.text(53, 134, '3점', { size: 18, weight: 700 });
        P.arrow(98, 88, 140, 88, { c: 'accent', w: 2.6, head: 10 });
        P.rrect(148, 40, 180, 96, 10, { fill: 'paper', w: 1.8 });
        P.text(160, 66, '"points"', { mono: true, size: 13, weight: 700, anchor: 'start' });
        P.text(160, 102, 'type:', { mono: true, size: 13, anchor: 'start' });
        P.rrect(208, 84, 100, 26, 6, { c: 'warm', w: 2, gap: 4 });
        ask(P, 258, 104, 20);
        P.text(170, 182, '정수로 받고 싶어요', { size: 13, c: 'ink2' });
      }},

      /* ---------- QA 그림 ---------- */
      qa_units: { w: 340, h: 200, label: '평가지 머리의 평가 범위 줄과 단원을 하나씩 세고 싶은 얼굴', draw(P) {
        P.rrect(14, 24, 210, 60, 8, { fill: 'paper', w: 1.8 });
        P.text(119, 60, '평가 범위: 2단원, 3단원', { size: 14, weight: 700 });
        P.line(30, 104, 210, 104, { c: 'soft', w: 2.4 });
        P.line(30, 122, 180, 122, { c: 'soft', w: 2.4 });
        P.line(30, 140, 196, 140, { c: 'soft', w: 2.4 });
        person(P, 282, 196, 'smile', 0.72);
        P.bubble(236, 14, 98, 48, 270, 84);
        P.text(285, 44, '하나씩 셀래요', { size: 12, weight: 700 });
      }},
      qa_desc: { w: 340, h: 200, label: 'answer 칸에 끈으로 매단 description 쪽지와 그 쪽지가 무슨 일을 하는지 궁금한 얼굴', draw(P) {
        P.rrect(14, 30, 170, 50, 8, { fill: 'paper', w: 1.8 });
        P.text(30, 62, '"answer"', { mono: true, size: 14, weight: 700, anchor: 'start' });
        P.line(120, 80, 120, 96, { w: 2 });
        P.note(60, 96, 150, 70, { fill: 'hi' });
        P.text(135, 124, 'description', { mono: true, size: 12, weight: 700 });
        P.line(78, 146, 192, 146, { c: 'ink2', w: 2.4 });
        person(P, 282, 196, 'wow', 0.72);
        ask(P, 282, 62, 30);
      }},
      qa_flatten: { w: 340, h: 200, label: '맨 위 상자 안 첫 단계 자리에 exam 상자가 또 들어 있고 경고 표시가 붙은 모습', draw(P) {
        P.rrect(14, 16, 220, 160, 12, { fill: 'paper', w: 2 });
        P.text(28, 40, '{ 맨 위 }', { size: 13, weight: 700, anchor: 'start' });
        chip(P, 30, 52, 80, 30, 'title', 'sky', 13);
        P.rrect(30, 94, 190, 72, 10, { fill: 'warm', gap: 6, w: 1.8 });
        P.text(44, 116, 'exam', { mono: true, size: 13, weight: 700, anchor: 'start' });
        chip(P, 44, 126, 76, 28, 'subject', 'paper', 12);
        chip(P, 130, 126, 76, 28, 'unit', 'paper', 12);
        P.path('M282 30 L318 94 L246 94 Z', { fill: 'hi', w: 2.4 });
        P.text(282, 86, '!', { size: 30, weight: 700, c: 'bad' });
        person(P, 282, 196, 'wow', 0.6);
      }},

      /* ---------- L3 설명 그림 ---------- */
      twoDoors: { w: 340, h: 204, label: '같은 openai 패키지로 주소만 다른 두 문, Solar와 IE', draw(P) {
        P.text(84, 22, '…/v1', { mono: true, size: 12 });
        P.text(256, 22, '…/v1/information-extraction', { mono: true, size: 10 });
        server(P, 14, 32, 140, 70, 'Solar', 'sky', 15);
        server(P, 186, 32, 140, 70, 'IE', 'hi', 15);
        chip(P, 110, 150, 120, 30, 'openai 패키지', 'paper', 12);
        P.arrow(140, 148, 92, 108, { c: 'accent', w: 2, head: 8 });
        P.arrow(200, 148, 248, 108, { c: 'accent', w: 2, head: 8 });
        P.text(170, 198, '부르는 법은 같고 주소만 달라요', { size: 12, c: 'ink2' });
      }},
      b64Fig: { w: 340, h: 204, label: 'PDF 파일이 base64 글자로 바뀌고 앞에 data URL 머리가 붙는 모습', draw(P) {
        P.note(14, 30, 72, 92, { fill: 'hi' });
        P.text(50, 64, 'quiz3', { mono: true, size: 12, weight: 700 });
        P.text(50, 82, '.pdf', { mono: true, size: 12 });
        P.arrow(94, 76, 142, 76, { c: 'accent', w: 2.6, head: 10 });
        P.text(118, 62, 'base64', { size: 12, weight: 700, c: 'accent' });
        P.rrect(150, 56, 178, 40, 8, { fill: 'ink', fs: 'solid' });
        P.text(160, 82, 'JVBERi0xLjcKJeLj…', { mono: true, size: 12, c: 'paper', anchor: 'start' });
        P.text(239, 124, 'data:application/', { mono: true, size: 10, c: 'ink2' });
        P.text(239, 140, 'octet-stream;base64,…', { mono: true, size: 10, c: 'ink2' });
        P.text(170, 190, '파일을 글자로 바꿔 JSON에 담아요', { size: 13, c: 'accent' });
      }},
      hiLow: { w: 340, h: 204, label: '뽑은 값마다 high와 low 표시가 붙고, low를 돋보기로 들여다보는 얼굴', draw(P) {
        P.rrect(12, 12, 214, 150, 10, { fill: 'paper', w: 1.8 });
        [['title', 'high'], ['1.answer', 'high'], ['3.answer', 'low'], ['4.points', 'low']].forEach(([k, v], i) => {
          const y = 26 + i * 33;
          P.text(24, y + 15, k, { mono: true, size: 12, anchor: 'start' });
          chip(P, 152, y, 62, 22, v, v === 'high' ? 'good' : 'warm', 12);
        });
        P.circle(252, 104, 34, { fill: 'sky', gap: 5, w: 2.2 });
        P.line(264, 116, 278, 132, { w: 3.6 });
        person(P, 294, 200, 'smile', 0.62);
        P.text(117, 190, 'low = 사람이 한 번 봐 줘', { size: 13, weight: 700, c: 'warm' });
      }},

      /* ---------- L3 문제 그림 ---------- */
      q_whyB64: { w: 340, h: 200, label: 'PDF 쪽지가 알 수 없는 영문 글자 줄로 바뀌는 것을 보고 왜인지 묻는 얼굴', draw(P) {
        P.note(16, 30, 76, 96, { fill: 'hi' });
        P.text(54, 84, 'PDF', { size: 16, weight: 700 });
        P.arrow(100, 78, 140, 78, { c: 'accent', w: 2.6, head: 10 });
        ask(P, 120, 62, 22);
        P.rrect(146, 54, 150, 46, 8, { fill: 'ink', fs: 'solid' });
        P.text(156, 83, 'JVBERi0xLjcK…', { mono: true, size: 12, c: 'paper', anchor: 'start' });
        P.text(140, 170, '이 글자들은 왜?', { size: 13, c: 'ink2' });
        person(P, 296, 196, 'wow', 0.62);
      }},
      q_baseUrl: { w: 340, h: 200, label: '주소창의 api.upstage.ai 뒤가 비어 있고 세 문 앞에서 고민하는 얼굴', draw(P) {
        P.rrect(14, 20, 312, 40, 20, { fill: 'paper', w: 2 });
        P.text(32, 46, 'https://api.upstage.ai', { mono: true, size: 13, anchor: 'start' });
        P.rrect(196, 28, 116, 24, 6, { c: 'warm', w: 2, gap: 4 });
        ask(P, 254, 47, 18);
        [30, 110, 190].forEach((x, i) => {
          P.rrect(x, 84, 60, 100, 6, { fill: ['sky', 'hi', 'good'][i], gap: 6, w: 1.8 });
          P.circle(x + 48, 136, 8, { fill: 'ink', fs: 'solid', c: null });
        });
        person(P, 296, 196, 'wow', 0.6);
      }},
      q_confCode: { w: 340, h: 200, label: 'confidence 스위치를 어디에 달아야 할지 코드 앞에서 고민하는 얼굴', draw(P) {
        win(P, 14, 14, 200, 150);
        [0, 1, 2, 3, 4].forEach(i => P.line(28 + (i % 2) * 14, 52 + i * 20, 170 - (i % 3) * 20, 52 + i * 20, { c: ['k', 's', 'n', 't', 'k'][i], w: 3 }));
        P.text(272, 34, 'confidence', { mono: true, size: 13, weight: 700 });
        toggle(P, 252, 48, false);
        ask(P, 310, 66, 20);
        person(P, 272, 196, 'wow', 0.66);
      }},
      q_extractOrder: { w: 340, h: 200, label: '뒤섞인 카드: 결과 상자, 글자 줄, PDF 쪽지, 서식을 담은 봉투', draw(P) {
        card(P, 14, 16);
        jsonBox(P, 24, 24, 72, 54);
        card(P, 126, 54);
        P.rrect(134, 74, 76, 24, 5, { fill: 'ink', fs: 'solid' });
        P.text(172, 91, 'JVBER…', { mono: true, size: 11, c: 'paper' });
        card(P, 236, 14);
        P.note(258, 22, 46, 54, { fill: 'hi' });
        card(P, 60, 112);
        P.rrect(72, 126, 68, 44, 4, { fill: 'sky', gap: 5 });
        P.path('M72 126 L106 150 L140 126', { w: 1.6 });
        P.robot(262, 146, 0.46, { mood: 'wow' });
        ask(P, 116, 40, 22, 'warm');
        ask(P, 226, 112, 22, 'bad');
        ask(P, 30, 110, 20, 'accent');
      }},

      /* ---------- L4 설명 그림 ---------- */
      twoRoads: { w: 340, h: 214, label: '파일·이미지는 IE로, 이미 파싱한 글은 solar-pro4로 가서 둘 다 JSON이 되는 갈림길', draw(P) {
        sheet(P, 14, 12, 64, 76, 'hi');
        P.text(46, 104, '파일·이미지', { size: 12, weight: 700 });
        P.arrow(84, 50, 150, 50, { c: 'warm', w: 2.4, head: 9 });
        server(P, 156, 22, 104, 56, 'IE', 'hi', 14);
        P.note(14, 118, 64, 70, { fill: 'paper' });
        for (let i = 0; i < 4; i++) P.line(22, 136 + i * 12, 68 - (i % 2) * 10, 136 + i * 12, { c: 'soft', w: 2.2 });
        P.text(46, 206, 'Markdown 글', { size: 12, weight: 700 });
        P.arrow(84, 152, 150, 152, { c: 'accent', w: 2.4, head: 9 });
        server(P, 156, 124, 104, 56, 'solar-pro4', 'sky', 12);
        jsonBox(P, 280, 64, 52, 86);
        P.arrow(262, 52, 278, 76, { c: 'ink2', w: 2, head: 7 });
        P.arrow(262, 152, 278, 138, { c: 'ink2', w: 2, head: 7 });
      }},
      strictLock: { w: 340, h: 210, label: '칸 셋이 모두 required에 들고 자물쇠로 다른 칸은 못 들어오게 잠근 object', draw(P) {
        P.rrect(14, 16, 190, 132, 10, { fill: 'paper', w: 1.8 });
        P.text(26, 40, 'object', { mono: true, size: 12, weight: 700, anchor: 'start', c: 'accent' });
        ['no', 'question', 'answer'].forEach((k, i) => {
          chip(P, 26, 52 + i * 30, 110, 24, k, 'sky', 12);
          tick(P, 160, 64 + i * 30, 9);
        });
        lock(P, 236, 72);
        P.text(110, 176, 'required = 모든 칸', { size: 12, weight: 700 });
        P.text(170, 200, '"additionalProperties": False', { mono: true, size: 11, c: 'warm' });
      }},
      coins: { w: 340, h: 204, label: '형성평가지 20쪽을 뽑을 때 IE는 동전 넷, Parse와 Solar는 동전 하나쯤인 비교', draw(P) {
        P.text(170, 30, '20쪽 어림 · 부가세 별도', { size: 12, c: 'ink2' });
        for (let i = 0; i < 4; i++) coin(P, 84, 134 - i * 20, 46);
        P.text(84, 174, 'IE', { size: 14, weight: 700 });
        P.text(84, 196, '약 $0.80', { size: 13, c: 'warm', weight: 700 });
        coin(P, 252, 134, 46);
        P.text(252, 174, 'Parse + Solar', { size: 14, weight: 700 });
        P.text(252, 196, '약 $0.21', { size: 13, c: 'accent', weight: 700 });
      }},

      /* ---------- L4 문제 그림 ---------- */
      q_mdReady: { w: 340, h: 200, label: '파싱해 둔 quiz3.md 글 파일에서 문항 JSON으로 가는 길을 찾는 모습', draw(P) {
        P.note(16, 24, 96, 130, { fill: 'paper' });
        P.text(64, 50, 'quiz3.md', { mono: true, size: 12, weight: 700 });
        for (let i = 0; i < 5; i++) P.line(28, 72 + i * 14, 100 - (i % 2) * 14, 72 + i * 14, { c: 'soft', w: 2.4 });
        P.curveArrow(120, 96, 170, 50, 216, 96, { c: 'soft', w: 2.4, head: 9 });
        ask(P, 170, 46, 24);
        jsonBox(P, 224, 54, 100, 90);
        P.text(170, 186, 'c2u1에서 만든 글이 있어요', { size: 13, c: 'ink2' });
      }},
      q_strictLine: { w: 340, h: 200, label: '자물쇠 달린 서식 종이를 돋보기로 살피는 모습', draw(P) {
        P.note(20, 20, 150, 160, { fill: 'paper' });
        for (let i = 0; i < 7; i++) P.line(34 + (i % 2) * 12, 44 + i * 18, 152 - (i % 3) * 16, 44 + i * 18, { c: ['k', 's', 'n', 't'][i % 4], w: 3 });
        lock(P, 196, 46);
        P.circle(276, 138, 60, { fill: 'sky', gap: 5, w: 2.4 });
        P.line(296, 160, 318, 186, { w: 5 });
        ask(P, 276, 148, 26);
      }},
      q_effortBlank: { w: 340, h: 200, label: '생각의 양을 정하는 다이얼과 형성평가 글에서 칸을 뽑는 로봇', draw(P) {
        P.circle(90, 96, 120, { fill: 'paper', w: 2.2 });
        for (let i = 0; i < 7; i++) { const a = Math.PI * (1 - i / 6); P.line(90 + 46 * Math.cos(a), 96 - 46 * Math.sin(a), 90 + 54 * Math.cos(a), 96 - 54 * Math.sin(a), { w: 2 }); }
        P.line(90, 96, 90, 54, { c: 'warm', w: 3 });
        P.circle(90, 96, 12, { fill: 'ink', fs: 'solid', c: null });
        ask(P, 90, 140, 24);
        P.robot(250, 92, 0.6, { mood: 'happy' });
        P.text(250, 186, '칸만 뽑으면 되는 일', { size: 13, c: 'ink2' });
      }},
      q_cost: { w: 340, h: 200, label: '3쪽짜리 평가지 다섯 장과 쪽당 동전, 합이 얼마인지 묻는 물음표', draw(P) {
        for (let i = 0; i < 5; i++) sheet(P, 14 + i * 22, 20 + i * 8, 70, 90, i === 4 ? 'hi' : 'paper');
        P.text(93, 166, '3쪽 × 5장', { size: 14, weight: 700 });
        coin(P, 236, 76, 52, '$0.04');
        P.text(236, 124, '쪽당', { size: 12, c: 'ink2' });
        ask(P, 304, 90, 32);
      }},
      q_photo: { w: 340, h: 200, label: '휴대폰으로 찍은 종이 평가지 사진에서 문항 JSON까지 가는 길을 찾는 모습', draw(P) {
        P.rrect(20, 14, 80, 152, 14, { fill: 'ink', fs: 'solid' });
        P.rrect(28, 30, 64, 110, 4, { fill: 'paper', fs: 'solid', c: null });
        for (let i = 0; i < 4; i++) P.line(36, 50 + i * 22, 84 - (i % 2) * 12, 50 + i * 22, { c: 'soft', w: 2.4 });
        P.circle(60, 153, 10, { c: 'paper', w: 1.4 });
        P.text(60, 188, 'quiz3.jpg', { mono: true, size: 12 });
        P.curveArrow(110, 90, 168, 40, 220, 90, { c: 'soft', w: 2.4, head: 9 });
        ask(P, 166, 50, 24);
        jsonBox(P, 228, 50, 96, 90);
      }},

      /* ---------- QB 그림 ---------- */
      qb_twoJson: { w: 340, h: 200, label: 'IE와 Solar 두 기계가 각각 JSON 상자를 내놓고 무엇이 다른지 묻는 모습', draw(P) {
        server(P, 14, 16, 120, 60, 'IE', 'hi', 15);
        server(P, 206, 16, 120, 60, 'Solar', 'sky', 15);
        P.arrow(74, 82, 74, 106, { c: 'ink2', w: 2, head: 7 });
        P.arrow(266, 82, 266, 106, { c: 'ink2', w: 2, head: 7 });
        jsonBox(P, 34, 112, 80, 70);
        jsonBox(P, 226, 112, 80, 70);
        P.text(170, 152, '무엇이 달라요?', { size: 14, weight: 700, c: 'warm' });
      }},
      qb_strictErr: { w: 340, h: 200, label: 'schema.json을 Solar에 strict로 보냈더니 빨간 오류 말풍선이 돌아온 모습', draw(P) {
        P.note(16, 22, 80, 92, { fill: 'hi' });
        P.text(56, 56, 'schema', { mono: true, size: 12, weight: 700 });
        P.text(56, 74, '.json', { mono: true, size: 12 });
        P.arrow(104, 88, 164, 88, { c: 'accent', w: 2.4, head: 9 });
        P.text(134, 76, 'strict', { mono: true, size: 11, c: 'accent' });
        server(P, 170, 54, 110, 68, 'Solar', 'sky', 15);
        P.bubble(220, 140, 100, 44, 244, 126);
        cross(P, 270, 162, 10);
        person(P, 60, 198, 'wow', 0.5);
      }},
      qb_lowMean: { w: 340, h: 200, label: '3번 정답 값에 low 표시가 붙은 쪽지와 어떻게 할지 고민하는 얼굴', draw(P) {
        P.rrect(16, 40, 190, 70, 10, { fill: 'paper', w: 1.8 });
        P.text(30, 82, '3.answer', { mono: true, size: 14, weight: 700, anchor: 'start' });
        chip(P, 128, 60, 66, 30, 'low', 'warm', 14);
        person(P, 272, 196, 'wow', 0.75);
        ask(P, 272, 52, 30);
        P.text(110, 160, '어떻게 할까요?', { size: 14, c: 'ink2' });
      }},

      /* ---------- L5 설명 그림 ---------- */
      shapeVsValue: { w: 340, h: 204, label: 'JSON 모양은 맞지만 빈 정답과 이상한 배점 값이 눈에 띄는 모습', draw(P) {
        P.rrect(12, 14, 200, 150, 10, { fill: 'ink', fs: 'solid' });
        P.rrect(20, 64, 160, 24, 5, { fill: 'warm', fs: 'solid', c: null });
        P.rrect(20, 118, 160, 24, 5, { fill: 'warm', fs: 'solid', c: null });
        ['{ "no": 3,', '  "answer": "",', '  "choices": "",', '  "points": 8 }'].forEach((r, i) => P.text(26, 52 + i * 27, r, { mono: true, size: 12, c: 'paper', anchor: 'start' }));
        P.text(272, 52, '모양 ✓', { size: 14, weight: 700, c: 'good' });
        P.text(272, 88, '값 ?', { size: 14, weight: 700, c: 'warm' });
        person(P, 272, 200, 'wow', 0.6);
        P.text(112, 190, '모양은 지켜도 값은 틀릴 수 있어요', { size: 12, c: 'ink2' });
      }},
      checkList: { w: 340, h: 204, label: '값이 잔뜩인 결과에서 코드가 걸러 낸 몇 개만 교사에게 가는 흐름', draw(P) {
        for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) P.rrect(14 + c * 24, 36 + r * 24, 18, 16, 4, { fill: (r === 1 && c === 2) || (r === 2 && c === 0) ? 'warm' : 'sky', fs: 'solid', w: 1.2 });
        P.arrow(112, 64, 150, 64, { c: 'accent', w: 2.4, head: 9 });
        P.robot(184, 64, 0.4, { mood: 'happy' });
        P.arrow(216, 64, 240, 64, { c: 'accent', w: 2.4, head: 9 });
        P.rrect(246, 44, 18, 16, 4, { fill: 'warm', fs: 'solid', w: 1.2 });
        P.rrect(246, 68, 18, 16, 4, { fill: 'warm', fs: 'solid', w: 1.2 });
        person(P, 304, 120, 'smile', 0.55);
        P.text(58, 126, '뽑은 값 전부', { size: 12, weight: 700 });
        P.text(184, 126, '코드 검사', { size: 12, weight: 700 });
        P.text(300, 142, '교사', { size: 12, weight: 700 });
        P.text(170, 186, '교사는 걸러진 것과 low만 봐요', { size: 13, c: 'accent' });
      }},
      saveJson: { w: 340, h: 204, label: 'questions.json 파일이 트랙 A 채점기로 넘어가는 모습', draw(P) {
        P.note(20, 24, 104, 120, { fill: 'hi' });
        P.text(72, 64, 'questions', { mono: true, size: 12, weight: 700 });
        P.text(72, 82, '.json', { mono: true, size: 12 });
        P.face(72, 116, 30, { mood: 'happy' });
        P.arrow(132, 84, 192, 84, { c: 'accent', w: 3, head: 11 });
        server(P, 198, 44, 128, 80, '채점기', 'sky', 15);
        P.text(262, 148, 'c4u1 · 트랙 A', { size: 12, weight: 700, c: 'accent' });
        P.text(170, 190, 'ensure_ascii=False로 한글 그대로', { size: 12, c: 'ink2' });
      }},

      /* ---------- L5 문제 그림 ---------- */
      q_whoChecks: { w: 340, h: 200, label: '터미널에 배점 합계가 안 맞는다는 줄이 뜨고 4번 배점에 low가 붙은 모습', draw(P) {
        termBox(P, 14, 20, 220, 110);
        P.text(26, 62, '배점 합계 15 ≠ 10', { size: 13, c: 'warm', anchor: 'start' });
        P.text(26, 94, '4.points: low', { mono: true, size: 12, c: 'paper', anchor: 'start' });
        person(P, 290, 196, 'wow', 0.7);
        P.text(124, 170, '어떻게 고칠까요?', { size: 13, c: 'ink2' });
      }},
      q_asciiBlank: { w: 340, h: 200, label: '파일을 열었더니 한글 대신 역슬래시 u 글자가 늘어선 화면과 어지러운 얼굴', draw(P) {
        win(P, 14, 14, 214, 140);
        P.text(26, 62, '"\\uc815\\ub2f5"', { mono: true, size: 12, anchor: 'start' });
        P.text(26, 90, '"\\ub9ac\\uc2a4"', { mono: true, size: 12, anchor: 'start' });
        P.text(26, 118, '"\\uae38\\uc774"', { mono: true, size: 12, anchor: 'start' });
        person(P, 284, 196, 'dizzy', 0.7);
        P.text(121, 182, '한글이 어디 갔지?', { size: 13, c: 'ink2' });
      }},
      q_pipeline: { w: 340, h: 200, label: '뒤섞인 카드: 파일 쪽지, 사람 얼굴, 터미널, 로봇과 평가지', draw(P) {
        card(P, 14, 16);
        P.note(38, 24, 44, 54, { fill: 'hi' });
        card(P, 126, 54);
        P.face(172, 89, 40, { mood: 'smile' });
        card(P, 236, 14);
        termBox(P, 246, 24, 72, 50);
        card(P, 60, 112);
        P.robot(86, 147, 0.26, { mood: 'happy' });
        sheet(P, 104, 118, 40, 60, 'paper');
        ask(P, 116, 40, 22, 'warm');
        ask(P, 226, 112, 22, 'bad');
        ask(P, 30, 110, 20, 'accent');
      }},
      q_privacy: { w: 340, h: 200, label: '이름 칸이 있는 학생 답안지 더미 앞에서 써도 되는지 망설이는 얼굴', draw(P) {
        for (let i = 0; i < 4; i++) P.note(20 + i * 14, 16 + i * 10, 110, 124, { fill: 'paper' });
        P.text(74, 78, '이름:', { size: 12, anchor: 'start', weight: 700 });
        P.rrect(108, 66, 50, 16, 3, { fill: 'soft', fs: 'solid', c: null });
        for (let i = 0; i < 4; i++) P.line(74, 104 + i * 16, 156 - (i % 2) * 14, 104 + i * 16, { c: 'soft', w: 2.4 });
        P.text(110, 192, '학생 30명 답안지', { size: 13, c: 'ink2' });
        person(P, 280, 196, 'wow', 0.75);
        ask(P, 280, 60, 30);
      }},

      /* ---------- T1 그림 ---------- */
      t_wrongUrl: { w: 340, h: 200, label: '연수장에서 복사한 코드를 실행했더니 빨간 오류가 떠서 두 선생님이 화면을 보는 모습', draw(P) {
        laptop(P, 90, 20, 160, 100);
        P.line(104, 42, 200, 42, { c: 'k', w: 3 });
        P.line(104, 58, 220, 58, { c: 's', w: 3 });
        P.rrect(104, 76, 132, 28, 6, { fill: 'bad', gap: 5, w: 1.6 });
        P.text(170, 95, 'Error', { mono: true, size: 13, weight: 700 });
        person(P, 44, 196, 'wow', 0.6);
        person(P, 296, 196, 'sad', 0.6);
        P.text(170, 176, '연수 1일차 14:00', { size: 13, c: 'ink2' });
      }},
      t_strictBlank: { w: 340, h: 200, label: '자물쇠 서식의 두 칸이 비어 있는 코드 카드', draw(P) {
        P.rrect(16, 20, 214, 150, 10, { fill: 'ink', fs: 'solid' });
        P.text(28, 56, '"strict":', { mono: true, size: 13, c: 'paper', anchor: 'start' });
        P.rrect(118, 38, 70, 26, 5, { c: 'hi', w: 2, gap: 4 });
        P.text(153, 57, '①', { size: 14, c: 'hi', weight: 700 });
        P.line(28, 88, 180, 88, { c: 's', w: 3 });
        P.line(28, 108, 160, 108, { c: 'n', w: 3 });
        P.text(28, 142, '"additional…":', { mono: true, size: 13, c: 'paper', anchor: 'start' });
        P.rrect(150, 124, 64, 26, 5, { c: 'hi', w: 2, gap: 4 });
        P.text(182, 143, '②', { size: 14, c: 'hi', weight: 700 });
        lock(P, 256, 92);
      }},
      t_lowFix: { w: 340, h: 200, label: '뒤섞인 카드: 깃 커밋 점, 종이 원본, 터미널, 고친 JSON 상자', draw(P) {
        card(P, 14, 16);
        P.line(36, 51, 84, 51, { w: 2.4 });
        [36, 60, 84].forEach(x => P.circle(x, 51, 14, { fill: 'good', fs: 'solid', w: 1.4 }));
        card(P, 126, 54);
        sheet(P, 150, 60, 44, 60, 'paper');
        card(P, 236, 14);
        termBox(P, 246, 24, 72, 50);
        card(P, 60, 112);
        jsonBox(P, 70, 120, 72, 54);
        ask(P, 116, 40, 22, 'warm');
        ask(P, 226, 112, 22, 'bad');
        ask(P, 30, 110, 20, 'accent');
      }},
      t_loadsLine: { w: 340, h: 200, label: '터미널 마지막 줄에 TypeError가 뜨고 코드 줄을 거슬러 올라가 보는 모습', draw(P) {
        termBox(P, 14, 14, 230, 120);
        P.text(26, 62, 'Traceback …', { mono: true, size: 12, c: 'paper', anchor: 'start' });
        P.text(26, 92, 'TypeError', { mono: true, size: 14, weight: 700, c: 'bad', anchor: 'start' });
        P.line(26, 114, 200, 114, { c: 'soft', w: 2.4 });
        P.curveArrow(254, 120, 300, 80, 256, 40, { c: 'warm', w: 2.4, head: 9 });
        person(P, 290, 200, 'wow', 0.6);
        P.text(120, 172, '어느 줄 때문일까?', { size: 13, c: 'ink2' });
      }},
      t_rubric: { w: 340, h: 200, label: '기준 이름·최고점·단계 설명이 줄마다 있는 채점 기준표와 고민하는 얼굴', draw(P) {
        P.rrect(14, 16, 230, 150, 8, { fill: 'paper', w: 1.8 });
        P.line(74, 16, 74, 166, { w: 1.2 });
        P.line(134, 16, 134, 166, { w: 1.2 });
        P.text(44, 40, '기준', { size: 12, weight: 700 });
        P.text(104, 40, '최고점', { size: 12, weight: 700 });
        P.text(189, 40, '단계 설명', { size: 12, weight: 700 });
        P.line(14, 50, 244, 50, { w: 1.4 });
        ['5', '3', '2'].forEach((v, r) => {
          const y = 76 + r * 30;
          P.line(26, y, 64, y, { c: 'soft', w: 2.4 });
          P.text(104, y + 5, v, { size: 13, weight: 700 });
          P.line(144, y, 232 - r * 10, y, { c: 'soft', w: 2.4 });
        });
        person(P, 292, 196, 'wow', 0.66);
        ask(P, 292, 62, 28);
      }},
      t_hwp: { w: 340, h: 200, label: 'HWP 공문 쪽지에서 날짜·장소·대상 칸만 뽑아 표로 만들고 싶은 모습', draw(P) {
        P.note(16, 16, 110, 140, { fill: 'paper' });
        P.text(71, 42, '공문.hwp', { size: 13, weight: 700 });
        for (let i = 0; i < 5; i++) P.line(28, 64 + i * 16, 114 - (i % 2) * 14, 64 + i * 16, { c: 'soft', w: 2.4 });
        P.arrow(134, 90, 176, 90, { c: 'accent', w: 2.4, head: 9 });
        ask(P, 155, 76, 20);
        P.rrect(184, 36, 140, 108, 8, { fill: 'paper', w: 1.8 });
        [['날짜', 66], ['장소', 98], ['대상', 130]].forEach(([k, y]) => {
          P.text(208, y, k, { size: 12, weight: 700 });
          P.rrect(232, y - 14, 80, 20, 4, { c: 'soft', w: 1.4 });
        });
        P.text(170, 186, '날짜·장소·대상만 표로', { size: 13, c: 'ink2' });
      }},
      t_lowRate: { w: 340, h: 200, label: 'low 표시 다섯 개 중 셋에는 동그라미, 둘에는 가위표를 친 대조 결과', draw(P) {
        for (let i = 0; i < 5; i++) {
          const x = 20 + i * 62;
          chip(P, x, 36, 54, 28, 'low', 'warm', 13);
          if (i < 3) P.circle(x + 27, 98, 30, { c: 'good', w: 2.6 }); else cross(P, x + 27, 98, 11);
        }
        P.text(170, 148, '원본과 대조: 셋은 맞았어요', { size: 13, weight: 700 });
        P.face(170, 180, 26, { mood: 'wink' });
      }},
      t_ascii: { w: 340, h: 200, label: '연수장에서 두 선생님이 역슬래시 u 글자가 늘어선 JSON 화면을 함께 보는 모습', draw(P) {
        laptop(P, 90, 20, 160, 100);
        P.text(170, 56, '"\\ub9ac\\uc2a4\\ud2b8"', { mono: true, size: 11 });
        P.text(170, 82, '"\\uc815\\ub2f5"', { mono: true, size: 11 });
        person(P, 44, 196, 'wow', 0.6);
        person(P, 296, 196, 'dizzy', 0.6);
        P.text(170, 176, '연수 2일차 트랙 A', { size: 13, c: 'ink2' });
      }},
      t_cost: { w: 340, h: 200, label: '2쪽 평가지를 다섯 번 되풀이해 뽑는 고리와 물음표 동전', draw(P) {
        sheet(P, 30, 40, 70, 90, 'paper');
        sheet(P, 20, 30, 70, 90, 'hi');
        P.text(60, 160, '2쪽', { size: 14, weight: 700 });
        P.curveArrow(120, 70, 170, 24, 220, 70, { c: 'accent', w: 2.4, head: 9 });
        P.curveArrow(220, 116, 170, 162, 120, 116, { c: 'accent', w: 2.4, head: 9 });
        P.text(170, 98, '× 5번', { size: 16, weight: 700, c: 'accent' });
        coin(P, 282, 92, 56, '?');
      }},
      t_parseVsIe: { w: 340, h: 200, label: '학생 질문에 답하는 챗봇과 형성평가 정답표, 각각 어떤 도구와 짝인지 묻는 모습', draw(P) {
        P.rrect(14, 20, 140, 110, 10, { fill: 'paper', w: 1.8 });
        P.bubble(24, 30, 90, 30, 40, 68);
        P.bubble(50, 76, 94, 30, 130, 112);
        P.text(84, 152, '자료 챗봇', { size: 13, weight: 700 });
        P.rrect(186, 20, 140, 110, 10, { fill: 'paper', w: 1.8 });
        P.line(186, 52, 326, 52, { w: 1.4 });
        P.line(186, 84, 326, 84, { w: 1.2 });
        P.line(234, 20, 234, 130, { w: 1.2 });
        P.line(282, 20, 282, 130, { w: 1.2 });
        P.text(256, 152, '정답표 데이터', { size: 13, weight: 700 });
        ask(P, 84, 188, 22);
        ask(P, 256, 188, 22);
      }}
    },

    items: [
    /* =================== L1 =================== */
    { id: 'L1', type: 'lesson', title: '파싱 vs 추출', sub: '전체 글과 원하는 칸, 스키마는 빈 서식', min: 11, steps: [
      { t: 'say', h: '파싱은 전체 글, 추출은 원하는 칸만', fig: 'parseVsExtract', p: [
        'c2u1에서 <b>Document Parse</b>로 학습지를 통째로 Markdown 글로 바꿨죠. 사람이 읽거나 LLM에 넣기에는 좋지만, 채점 프로그램이 바로 쓰기에는 아직 글 덩어리예요.',
        '채점 프로그램이 알고 싶은 건 "1번 문항의 정답은 2번 보기, 배점 2점" 같은 <b>칸</b>이에요. 글 덩어리에서 이걸 찾으려면 코드를 또 짜야 해요.',
        '<b>Information Extract</b>(정보 추출, 줄여서 IE)는 처음부터 원하는 칸만 골라 <b>JSON</b>으로 돌려줘요. 파일을 주며 "이 칸들을 채워 줘"라고 부탁하는 셈이에요.'
      ]},
      { t: 'say', h: '스키마는 IE에게 주는 빈 서식이에요', fig: 'blankForm', p: [
        '무엇을 뽑을지는 <b>스키마</b>(schema)로 알려 줘요. 칸 이름, 칸에 들어갈 값의 종류, 칸 설명을 적은 <b>빈 서식</b>이에요.',
        '학교 출장 신청서를 떠올려 봐요. 칸만 있는 빈 서식을 건네면 사람이 채워 오듯, IE는 문서를 읽고 스키마의 칸을 채워 와요.',
        '서식은 JSON Schema라는 표준 문법으로 적어요. 다음 레슨에서 직접 만들어요.'
      ], table: { head: ['', 'Document Parse(c2u1)', 'Information Extract'], rows: [
        ['돌려주는 것', '문서 전체 글(Markdown·HTML·text)', '스키마의 칸만 채운 JSON'],
        ['내가 줄 것', '파일', '파일 + 스키마'],
        ['잘 맞는 일', 'RAG 자료, 요약, 읽기 쉬운 글', '문항·정답, 공문의 날짜·장소 같은 정해진 칸'],
        ['모델 이름', '<code>document-parse</code>', '<code>information-extract</code>'] ] } },
      { t: 'say', h: '형성평가지 한 장이 문항 목록이 돼요', fig: 'sheetToJson', p: [
        '이 단원의 예는 정보 교과 <b>3단원 형성평가</b>예요. 객관식 두 문항(1바이트는 몇 비트? / 10진수 5를 2진수로?)과 단답형 두 문항(리스트 길이 함수 / 조건문 예약어), 모두 10점이에요.',
        '뽑고 싶은 모양은 맨 위에 제목 <code>title</code>, 그 아래 문항 목록 <code>items</code>예요. 문항마다 번호 <code>no</code>, 문항 글 <code>question</code>, 보기 <code>choices</code>, 정답 <code>answer</code>, 배점 <code>points</code>가 있어요.'
      ], code: { lang: 'json', src: src([
        '{',
        '  "title": "3단원 형성평가",',
        '  "items": [',
        '    {"no": 1, "question": "1바이트는?",',
        '     "choices": "①4 ②8 ③16 ④32",',
        '     "answer": "2", "points": 2},',
        '    {"no": 3, "question": "길이 함수?",',
        '     "choices": "",',
        '     "answer": "len", "points": 3}',
        '  ]',
        '}']) } },
      { t: 'say', h: '수업에서는 문제·정답 데이터가 돼요', p: [
        '정답·배점이 칸으로 정리되면 쓸 곳이 많아요. 연수 2일차 트랙 A의 <b>자동채점</b>은 이 데이터(<code>questions.json</code>)에서 시작해요(c4u1).',
        '문항별 정답률 표, 같은 성취기준 문항을 모은 문제은행, 보기 순서를 섞은 다른 반 시험지도 칸이 있어야 쉽게 만들어요.',
        'IE는 지금 <code>information-extract</code>라는 별칭으로 불러요(2026년 10월 기준 <code>information-extract-260904</code>를 가리켜요). 영수증 전용 같은 예전 Prebuilt 추출은 2026년 5월에 지원이 끝났고, 지금은 스키마를 내가 주는 방식(Universal)이 주력이에요.'
      ], tip: '학생 답안지처럼 개인정보가 든 문서는 넣지 않아요. 이 단원은 <b>내가 만든 문제지·정답표</b>만 써요.' },
      { t: 'q', kind: 'mc', fig: 'q_whichTool', q: '정보 형성평가지 PDF가 있어요. 채점 프로그램에 넣을 <b>문항 번호·정답·배점</b>만 필요해요. 가장 알맞은 것은?',
        opts: ['Document Parse로 Markdown을 받아 눈으로 옮겨 적는다', 'Information Extract에 파일과 스키마를 함께 준다', 'Solar Chat에 PDF 파일 이름을 알려 주고 정답을 묻는다', 'Document Parse의 <code>elements</code>를 그대로 채점에 쓴다'], a: 1,
        why: '원하는 칸만 JSON으로 받는 일은 IE가 맞아요. 파일과 함께 "번호·정답·배점" 칸이 있는 스키마를 줘요.',
        ex: ['되긴 하지만 사람이 옮겨 적는 수고가 그대로 남아요. 옮기다 틀리기도 쉬워요.', '', '파일 이름만으로는 모델이 문서 내용을 볼 수 없어요.', '<code>elements</code>는 문단·표 같은 레이아웃 조각이에요. 정답·배점 칸으로 나뉘어 있지 않아요.'] },
      { t: 'q', kind: 'mc', fig: 'q_schemaIs', q: 'IE에서 말하는 <b>스키마</b>에 대한 설명으로 맞는 것은?',
        opts: ['문서에서 채울 칸의 이름·종류·설명을 적은 빈 서식', 'IE가 문서를 읽고 돌려준 결과 JSON을 부르는 다른 이름', 'API 키와 base_url 주소를 담아 두는 설정 파일', 'Document Parse가 나누는 요소 12가지의 분류표'], a: 0,
        why: '스키마는 "이런 칸을 채워 줘"라고 건네는 빈 서식이에요. 칸 이름, type, description을 적어요.',
        ex: ['', '결과는 스키마의 칸이 <b>채워진</b> JSON이에요. 스키마는 비어 있는 서식이에요.', '키는 <code>.env</code>, 주소는 코드의 <code>base_url</code>에 둬요. 스키마와 상관없어요.', '그건 Document Parse의 <code>category</code>예요(c2u1).'] },
      { t: 'q', kind: 'blank', fig: 'q_fieldBlank', q: '1번은 "1바이트는 몇 비트? ①4 ②8 ③16 ④32", 정답 ②, 배점 2점이에요. 스키마 설명대로 객관식 정답은 <b>보기 번호를 숫자 글자로</b> 받기로 했어요. 빈칸에 알맞은 것은?', lang: 'json',
        code: src(['{"no": 1,', ' "choices": "①4 ②8 ③16 ④32",', ' "answer": [[1]],', ' "points": 2}']),
        opts: ['"8"', '2', '"2"', '"②"'], a: 2,
        why: 'answer 칸은 글자(string)이고, 객관식은 보기 번호를 숫자 글자로 받기로 했어요. 그래서 <code>"2"</code>예요. 단답형 정답(<code>"len"</code>)도 같은 칸에 담으려고 글자로 정했어요.',
        ex: ['보기의 내용(8비트)이에요. 번호로 받기로 했어요.', '따옴표 없는 2는 숫자(integer)예요. answer 칸은 글자로 정했어요.', '', '동그라미 숫자는 프로그램에서 1~4와 비교하기 불편해요. 숫자 글자로 받아요.'] },
      { t: 'q', kind: 'mc', fig: 'q_parseEnough', q: '"Document Parse로 받은 Markdown에 문항이 다 들어 있는데, IE가 왜 또 필요해요?" 동료 선생님의 질문에 가장 알맞은 답은?',
        opts: ['Markdown으로 바꾸면 정답이 빠지고 문제만 남아서', 'IE가 Document Parse보다 언제나 더 정확해서', 'IE를 거쳐야만 PDF 파일을 읽을 수 있어서', '글 덩어리라 채점할 칸을 다시 찾아야 해서'], a: 3,
        why: '둘은 하는 일이 달라요. Parse는 전체 글, IE는 원하는 칸만. 채점처럼 칸이 필요한 일은 IE가 한 번에 해 줘요.',
        ex: ['Parse는 문서의 글을 그대로 옮겨요. 정답이 문서에 있다면 Markdown에도 있어요.', '"언제나 더 정확"하다는 근거는 없어요. 돌려주는 모양이 다를 뿐이에요.', 'Document Parse도 PDF를 읽어요. c2u1에서 해 봤어요.', ''] },
      { t: 'sum', pts: ['Document Parse는 문서 전체를 글로, Information Extract는 스키마의 칸만 채운 JSON으로 돌려준다.', '스키마 = 빈 서식. 칸 이름·값의 종류·설명을 적어 무엇을 뽑을지 알려 준다.', '형성평가지 → {title, items:[{no, question, choices, answer, points}]} → 트랙 A 채점 데이터. 학생 개인정보 문서는 넣지 않는다.'] }
    ]},

    /* =================== L2 =================== */
    { id: 'L2', type: 'lesson', title: '스키마 설계', sub: 'type·description, 배열 안 object, IE 첫 단계 규칙', min: 13, steps: [
      { t: 'say', h: 'JSON Schema는 type과 description부터', fig: 'typeChips', p: [
        '스키마도 JSON이에요. 칸마다 <code>type</code>(값의 종류)과 <code>description</code>(무엇을 넣을지 설명)을 적고, 칸들은 <code>properties</code> 안에 모아요.',
        '자주 쓰는 type은 <code>string</code>(글자), <code>integer</code>(정수), <code>number</code>(소수도 되는 수), <code>array</code>(목록), <code>object</code>(이름 붙은 칸 묶음)예요.',
        '<b>description이 정확도를 좌우해요.</b> IE는 칸 이름과 설명을 읽고 문서에서 맞는 값을 찾아요. 사람에게 서식을 줄 때 "예: 2026-03-02"처럼 적어 주는 것과 같아요.'
      ], code: { lang: 'json', src: src([
        '{',
        '  "type": "object",',
        '  "properties": {',
        '    "title": {',
        '      "type": "string",',
        '      "description": "평가지 맨 위 제목"',
        '    }',
        '  }',
        '}']) } },
      { t: 'say', h: '문항 목록은 배열 안에 object', p: [
        '문항은 여러 개고, 문항마다 번호·글·보기·정답·배점이 있어요. 그래서 <code>items</code>를 <b>array</b>로 만들고, 배열에 들어갈 칸 하나하나를 <b>object</b>로 적어요.',
        '배열에 들어갈 모양은 <code>"items"</code>라는 키에 적어요. 바깥 칸 이름도 items라 헷갈리는데, 안쪽 <code>"items"</code>는 JSON Schema 문법이에요. properties에는 아래 표의 다섯 칸을 모두 적어요(코드에는 둘만 보였어요).'
      ], code: { lang: 'json', src: src([
        '"items": {',
        '  "type": "array",',
        '  "description": "문항 목록",',
        '  "items": {',
        '    "type": "object",',
        '    "properties": {',
        '      "no": {"type": "integer"},',
        '      "answer": {"type": "string"}',
        '    }',
        '  }',
        '}']) }, table: { head: ['칸', 'type', 'description 예'], rows: [
        ['<code>no</code>', 'integer', '문항 번호'],
        ['<code>question</code>', 'string', '문항 글, 보기는 빼고'],
        ['<code>choices</code>', 'string', '보기 전부를 한 줄로. 단답형은 비움'],
        ['<code>answer</code>', 'string', '객관식은 1~4 숫자, 단답형은 낱말'],
        ['<code>points</code>', 'integer', '배점, 숫자만'] ] } },
      { t: 'say', h: 'IE 스키마에는 세 가지 규칙이 있어요', fig: 'ieRules', p: [
        'IE 스키마는 일반 JSON Schema보다 좁은 규칙을 지켜야 해요. 설계할 때 이 셋부터 확인해요.',
        '첫 단계에 묶음(object)이 필요하면 칸을 펴요. <code>exam: {subject, unit}</code> 대신 <code>subject</code>, <code>unit</code> 두 string 칸으로요.',
        '한도도 있어요. 한 번에(동기) 100쪽, 칸 100개, 스키마 글자 15,000자까지예요.'
      ], table: { head: ['규칙', '되는 예', '안 되는 예'], rows: [
        ['맨 위는 object', '<code>{"type": "object", …}</code>', '맨 위가 array'],
        ['첫 단계 칸은 string·integer·number·array만', '<code>title</code>: string, <code>items</code>: array', '<code>exam</code>: object'],
        ['배열 안에 배열은 안 돼요', '배열 안 object(문항 목록)', '<code>[["4", "8"], ["101"]]</code> 모양'] ] } },
      { t: 'say', h: '보기 목록은 한 줄 글자로, 아니면 따로', fig: 'twoDesigns', p: [
        '문항마다 보기 네 개를 또 배열로 넣고 싶어져요. 그런데 문항 목록이 이미 배열이라 "배열 안 배열"에 걸리기 쉬워요. 문서는 "배열이 배열을 품으면 안 된다"고만 해서, 이 단원은 안전한 두 길을 써요.',
        '① <b>한 줄 글자로 합치기</b>: <code>"choices": "①4 ②8 ③16 ④32"</code>. 가장 단순하고, 채점에는 정답 번호만 있으면 돼요.',
        '② <b>첫 단계에 따로 두기</b>: <code>choice_list</code> 배열을 하나 더 두고 칸마다 문항 번호 <code>no</code>, 보기 번호 <code>mark</code>, 보기 글 <code>text</code>를 적어요. 보기별 오답 분석까지 하고 싶을 때 써요.'
      ], code: { lang: 'json', src: src([
        '"choice_list": {',
        '  "type": "array",',
        '  "items": {',
        '    "type": "object",',
        '    "properties": {',
        '      "no": {"type": "integer"},',
        '      "mark": {"type": "integer"},',
        '      "text": {"type": "string"}',
        '    }',
        '  }',
        '}']) }, tip: '견본 문서를 주면 스키마 초안을 만들어 주는 기능도 있어요. 다만 부르는 방법이 공식 자료끼리 달라서, 쓸 때는 콘솔과 공식 문서에서 지금 방법을 직접 확인해요.' },
      { t: 'try', lang: 'py', h: '규칙 검사기로 스키마 고치기', p: '<code>props</code>는 스키마 첫 단계 칸들이에요. 실행해 걸린 칸을 보고, 규칙에 맞게 고쳐 모두 "통과"가 나오게 해 보세요.',
        src: src([
          'props = {',
          '    "title": {"type": "string"},',
          '    "exam": {"type": "object"},',
          '    "items": {"type": "array",',
          '        "items": {"type": "array"}},',
          '}',
          'OK = ["string", "integer",',
          '      "number", "array"]',
          'for name, p in props.items():',
          '    inner = p.get("items", {})',
          '    if p["type"] not in OK:',
          '        print(name, "→ 첫 단계 금지")',
          '    elif inner.get("type") == "array":',
          '        print(name, "→ 배열 안 배열")',
          '    else:',
          '        print(name, "→ 통과")']),
        note: '<code>exam</code> 줄은 <code>"subject"</code>, <code>"unit"</code> 두 string 칸으로 펴고, items 안쪽 type은 <code>"object"</code>로 바꿔 보세요.' },
      { t: 'q', kind: 'mc', fig: 'q_badSchema', q: '형성평가지 스키마의 <b>첫 단계</b>에 넣으려는 칸이에요. IE 규칙에 <b>어긋나는</b> 것은?',
        opts: ['<code>"title": {"type": "string"}</code>', '<code>"total": {"type": "integer"}</code>', '<code>"exam": {"type": "object", …}</code>', '<code>"items": {"type": "array", …}</code>'], a: 2,
        why: '첫 단계 칸은 string·integer·number·array만 돼요. object는 첫 단계에 못 둬요. 묶음은 <code>subject</code>, <code>unit</code>처럼 칸을 펴요.',
        ex: ['글자(string)는 첫 단계에 돼요.', '정수(integer)도 첫 단계에 돼요. 총점 같은 칸에 써요.', '', '배열은 첫 단계에 돼요. 문항 목록이 바로 이 모양이에요.'] },
      { t: 'q', kind: 'line', fig: 'q_lineSchema', q: '형성평가지 스키마예요. IE 규칙에 걸리는 줄을 눌러 보세요.', lang: 'json',
        code: src(['{', '  "type": "object",', '  "properties": {', '    "title": {"type": "string"},', '    "items": {', '      "type": "array",', '      "items": {"type": "array"}', '    }', '  }', '}']), a: 6,
        why: '배열(<code>items</code>)이 품는 칸이 또 배열이에요. 배열 안에 배열은 안 돼요. 문항 목록이면 안쪽을 <code>{"type": "object", …}</code>로 바꿔요.' },
      { t: 'q', kind: 'mc', fig: 'q_vague', q: '<code>answer</code> 칸의 description을 비워 뒀더니 결과가 <code>"2"</code>, <code>"②"</code>, <code>"8비트"</code>처럼 제각각이에요. 가장 먼저 할 일은?',
        opts: ['answer의 type을 array로 바꿔 값을 여러 개 받는다', 'description에 원하는 모양을 예와 함께 적는다', '칸 이름을 <code>answer</code>에서 <code>a</code>로 줄인다', '같은 파일을 여러 번 뽑아 가장 많이 나온 값을 쓴다'], a: 1,
        why: 'IE는 칸 이름과 description을 읽고 값을 찾아요. "객관식은 1~4 숫자, 단답형은 낱말"처럼 원하는 모양을 설명에 분명히 적는 게 첫걸음이에요.',
        ex: ['목록으로 바꾼다고 모양이 통일되지 않아요. 무엇을 넣을지 알려 주는 게 먼저예요.', '', '이름이 짧아지면 오히려 뜻이 흐려져요. 칸 이름도 설명 역할을 해요.', '여러 번 부르면 쪽마다 돈이 들고, 제각각인 원인은 그대로예요.'] },
      { t: 'q', kind: 'blank', fig: 'q_typeBlank', q: '배점 칸이에요. 2, 3처럼 <b>정수</b>로 받고 싶어요. 빈칸에 들어갈 type은?', lang: 'json',
        code: src(['"points": {', '  "type": "[[1]]",', '  "description": "배점, 숫자만"', '}']),
        opts: ['boolean', 'string', 'object', 'integer'], a: 3,
        why: '정수는 <code>integer</code>예요. 받은 값을 바로 더해 배점 합계를 낼 수 있어요.',
        ex: ['boolean은 참·거짓 두 값만 담는 종류예요.', '글자로 받으면 "3점"처럼 올 수 있고, 더하기 전에 숫자로 바꿔야 해요.', 'object는 이름 붙은 칸 묶음이에요. 숫자 하나에는 맞지 않아요.', ''] },
      { t: 'sum', pts: ['칸마다 type(string·integer·number·array·object)과 description. description이 정확도를 좌우한다.', '문항 목록은 array의 items에 object. IE는 맨 위 object, 첫 단계는 string·integer·number·array만, 배열 안 배열 금지.', '보기 목록은 한 줄 글자로 합치거나 첫 단계에 따로 배열을 둔다. 스키마 자동 생성은 콘솔·문서에서 지금 방법을 확인한다.'] }
    ]},

    /* =================== QA =================== */
    { id: 'QA', type: 'quiz', title: '헷갈림 퀴즈 ①', sub: 'string vs array, description의 역할, 첫 단계 object 금지', min: 4, steps: [
      { t: 'q', kind: 'mc', fig: 'qa_units', q: '평가지 머리에 "평가 범위: 2단원, 3단원"이 적혀 있어요. 단원을 <b>하나씩 따로</b> 받아 세고 싶다면 첫 단계 칸을 어떻게 만들까요?',
        opts: ['<code>"units": {"type": "string"}</code>로 받아 그대로 쓴다', '<code>"units": {"type": "object"}</code>로 받는다', '<code>"units"</code>를 array로, 안쪽 <code>items</code>는 string으로', '<code>"units": {"type": "integer"}</code>로 단원 수만 받는다'], a: 2,
        why: '여러 값을 하나씩 받으려면 array, 그 안의 값이 글자면 items에 string이에요. 배열 안 글자는 규칙에 맞아요.',
        ex: ['"2단원, 3단원"이 한 덩어리 글자로 와요. 하나씩 세려면 다시 잘라야 해요.', '첫 단계에는 object를 둘 수 없어요.', '', '개수만 오고 어떤 단원인지는 사라져요.'] },
      { t: 'q', kind: 'mc', fig: 'qa_desc', q: 'IE 스키마의 <code>description</code>에 대한 설명으로 맞는 것은?',
        opts: ['IE가 읽고 값을 찾는 안내라 정확도에 영향을 준다', '사람이 읽으라고 남기는 메모일 뿐이라 결과에는 영향이 없다', 'type을 대신하므로 둘 중 하나만 적으면 된다', '길게 쓸수록 요금이 크게 늘어 비워 두는 게 좋다'], a: 0,
        why: 'IE는 칸 이름과 description을 함께 읽고 문서에서 값을 찾아요. 모양(예: 1~4 숫자)까지 적으면 결과가 고르게 와요.',
        ex: ['', 'IE도 이 글을 읽어요. 그래서 설명을 바꾸면 결과가 달라져요.', 'type은 값의 종류, description은 무엇을 넣을지 설명이에요. 둘 다 적어요.', 'IE 요금은 쪽당이에요. 설명을 적는다고 값이 늘지 않아요(스키마는 15,000자까지).'] },
      { t: 'q', kind: 'mc', fig: 'qa_flatten', q: '출제 정보를 <code>"exam": {"subject": …, "unit": …}</code>처럼 첫 단계 object로 묶었어요. IE 규칙에 맞게 고친 것은?',
        opts: ['<code>exam</code>을 array로 바꾸고 그 안에 다시 array를 둔다', '<code>exam</code>을 풀어 <code>subject</code>, <code>unit</code> 두 string 칸으로 편다', '<code>exam</code>을 <code>items</code> 배열 안 object로 옮겨 문항마다 둔다', 'object 대신 <code>"type": "dict"</code>로 적어 파이썬처럼 쓴다'], a: 1,
        why: '첫 단계에는 object를 못 두니, 묶음을 풀어 string 칸 둘로 펴요. 평가지에 하나뿐인 값은 첫 단계 칸이 딱 맞아요.',
        ex: ['배열 안 배열은 안 되는 모양이에요. 게다가 이름 붙은 값이 순서만 있는 목록이 돼요.', '', '문항마다 같은 출제 정보가 되풀이돼요. 평가지에 하나뿐인 값은 첫 단계에 둬요.', 'JSON Schema에는 dict라는 type이 없어요. 파이썬 이름이에요.'] }
    ]},

    /* =================== L3 =================== */
    { id: 'L3', type: 'lesson', title: 'extract.py로 문항 뽑기', sub: 'base64 data URL, response_format, json.loads, confidence', min: 14, steps: [
      { t: 'say', h: 'IE도 OpenAI SDK로, 주소만 달라요', fig: 'twoDoors', p: [
        'IE는 Chat Completions와 같은 꼴로 불러요. c1u3에서 쓴 <code>openai</code> 패키지 그대로, <code>base_url</code>만 <code>https://api.upstage.ai/v1/information-extraction</code>으로 바꿔요.',
        '화면 폭 때문에 주소를 두 줄로 나눠 적었어요. 괄호 안에 붙여 쓴 글자 둘은 파이썬이 하나로 이어 줘요. 키는 늘 <code>.env</code>에서 읽고 화면에 찍지 않아요.',
        'Solar를 부르는 client(주소 <code>…/v1</code>)와는 다른 client예요. 한 파일에서 둘 다 쓰면 <code>ie_client</code>처럼 이름을 나눠요.'
      ], code: { lang: 'py', src: src([
        'import os, json, base64',
        'from dotenv import load_dotenv',
        'from openai import OpenAI',
        '',
        'load_dotenv()',
        'URL = ("https://api.upstage.ai/v1"',
        '       "/information-extraction")',
        'KEY = os.environ["UPSTAGE_API_KEY"]',
        'client = OpenAI(api_key=KEY,',
        '                base_url=URL)']) } },
      { t: 'say', h: '파일은 base64 글자로 바꿔 보내요', fig: 'b64Fig', p: [
        'API 요청은 JSON 글자예요. PDF·사진 같은 파일(바이트)을 글자 속에 담으려고 <b>base64</b>로 바꿔요. 크기는 1.3배쯤 커지지만 어디에나 끼워 넣을 수 있는 글자가 돼요.',
        '바꾼 글자 앞에 <code>data:application/octet-stream;base64,</code>를 붙이면 <b>data URL</b>이에요. 이걸 메시지의 <code>image_url</code> 칸에 넣어요. PDF여도 칸 이름은 image_url이에요.',
        '받는 형식은 PDF·이미지(JPEG·PNG 등)·HWP 등이고, 한 번에 100쪽까지예요. 최신 목록은 공식 문서에서 확인해요.'
      ], code: { lang: 'py', src: src([
        'with open("data/quiz3.pdf", "rb") as f:',
        '    raw = f.read()',
        'b64 = base64.b64encode(raw).decode()',
        'HEAD = "data:application/octet-stream"',
        'url = HEAD + ";base64," + b64',
        '',
        'msg = {"role": "user", "content": [',
        '    {"type": "image_url",',
        '     "image_url": {"url": url}}]}']) } },
      { t: 'say', h: '스키마는 response_format에 담아요', p: [
        'L2에서 만든 스키마는 <code>schema.json</code> 파일에 따로 두고 읽어 와요. 코드는 그대로 두고 서식만 고치며 실험할 수 있어요.',
        '<code>response_format</code>은 <code>"type": "json_schema"</code>와 <code>json_schema</code> 묶음(<code>name</code>, <code>schema</code>)이에요. name은 영문·숫자·밑줄·대시로 64자까지예요.',
        '학교 윈도우 PC에서 한글 설명이 든 파일을 읽을 때는 <code>encoding="utf-8"</code>을 꼭 적어요.'
      ], code: { lang: 'py', src: src([
        'with open("schema.json",',
        '          encoding="utf-8") as f:',
        '    SCHEMA = json.load(f)',
        'FMT = {',
        '    "type": "json_schema",',
        '    "json_schema": {"name": "quiz",',
        '                    "schema": SCHEMA},',
        '}']) } },
      { t: 'say', h: '결과는 JSON 글자라 json.loads로 풀어요', p: [
        '부르는 모양은 Chat과 같아요. <code>model="information-extract"</code>, 메시지 하나, <code>response_format</code>이에요. IE 요청 칸 목록에는 <code>reasoning_effort</code>나 <code>temperature</code>가 없어요.',
        '답은 <code>resp.choices[0].message.content</code>에 <b>JSON 모양의 글자</b>로 와요. <code>json.loads</code>로 풀어야 <code>data["items"][0]["answer"]</code>처럼 꺼낼 수 있어요.',
        '응답의 <code>model</code>에는 실제 버전 이름이 찍혀요. 코드에는 별칭을 써요.'
      ], code: { lang: 'py', src: src([
        'resp = client.chat.completions.create(',
        '    model="information-extract",',
        '    messages=[msg],',
        '    response_format=FMT,',
        ')',
        'data = json.loads(',
        '    resp.choices[0].message.content)',
        'print(json.dumps(data, indent=2,',
        '                 ensure_ascii=False))']) } },
      { t: 'sim', h: 'extract.py를 실행해 봐요', p: 'upstage-lab 폴더예요. 서식 파일을 먼저 보고, 터미널에서 extract.py를 돌려 결과를 확인해 봐요.',
        scene: { win: 'ide', folder: 'upstage-lab', files: LAB, open: 'extract.py', lang: 'py', code: EXTRACT_TAIL, term: [] },
        steps: [
          { goal: '<code>schema.json</code>을 눌러 열어요', click: 'file:schema.json', then: { open: 'schema.json', lang: 'json', code: SCHEMA_JSON },
            say: '값은 없고 칸 이름과 type만 있는 빈 서식이에요. 화면에는 줄여 보였지만 진짜 파일에는 칸마다 description도 있어요.' },
          { goal: '다시 <code>extract.py</code>를 열어요', click: 'file:extract.py', then: { open: 'extract.py', lang: 'py', code: EXTRACT_TAIL },
            say: '코드는 이 서식을 읽어 <code>response_format</code>에 담아 보내요. 서식을 고쳐도 코드는 그대로예요.' },
          { goal: '터미널에 <code>python extract.py</code>를 쳐요', type: 'python extract.py', into: 'term', then: { term: RUN1, prompt: '' },
            say: '서식의 칸이 채워져 돌아왔어요. <code>json.loads</code>로 푼 딕셔너리를 보기 좋게 찍은 거예요.' } ],
        end: '서식은 schema.json, 부르기는 extract.py. 결과는 터미널에서 바로 확인해요.' },
      { t: 'say', h: 'confidence를 켜면 값마다 high·low가 붙어요', fig: 'hiLow', p: [
        '베타 기능인 <code>confidence</code>를 켜면 뽑은 값마다 <code>"high"</code> 또는 <code>"low"</code>가 붙어요. 0.87 같은 숫자가 아니라 두 글자 중 하나예요.',
        'OpenAI SDK에 없는 칸이라 <code>extra_body</code>에 넣어 보내요. 켜면 값마다 <code>_value</code>와 <code>confidence</code>가 짝인 자세한 결과가 함께 와요. 문서 사본에는 content가 아닌 다른 자리로 온다고 적혀 있으니, 받는 자리는 공식 문서 예시를 보고 맞춰요.',
        '<b>low는 "틀렸다"가 아니라 "사람이 한 번 봐 줘"예요.</b> 2026년 5월 공식 문서 사본에 따르면 low 표시는 틀린 값을 놓치지 않는 쪽으로 맞춰져 있어서, 실제로는 맞은 값에도 꽤 붙어요.'
      ], code: { lang: 'py', src: src([
        'resp = client.chat.completions.create(',
        '    model="information-extract",',
        '    messages=[msg],',
        '    response_format=FMT,',
        '    extra_body={"confidence": True},',
        ')',
        '# 값 하나의 모양(문서 예시 꼴)',
        '# {"_value": "len", "confidence": "low"}']) },
        tip: '복잡한 표나 손글씨가 많으면 <code>extra_body</code>에 <code>"mode": "enhanced"</code>(베타)를 넣을 수 있어요. 쪽당 값이 더 비싸요(레슨 4).' },
      { t: 'q', kind: 'mc', fig: 'q_whyB64', q: 'extract.py에서 PDF를 base64로 바꾸는 까닭으로 가장 알맞은 것은?',
        opts: ['파일을 암호화해서 남이 못 보게 하려고', 'JSON 요청 글자 안에 파일 내용을 담으려고', '파일 크기를 줄여 요금을 아끼려고', 'PDF를 이미지로 바꿔야 IE가 읽을 수 있어서'], a: 1,
        why: '요청은 JSON 글자라서 바이트로 된 파일을 그대로 못 넣어요. base64로 글자가 된 파일을 data URL로 만들어 <code>image_url</code> 칸에 넣어요.',
        ex: ['base64는 누구나 바로 되돌릴 수 있는 바꿔 쓰기예요. 암호가 아니에요.', '', '오히려 1.3배쯤 커져요. IE 요금은 쪽당이라 크기와도 상관없어요.', 'PDF 그대로 보내요. 칸 이름만 image_url일 뿐이에요.'] },
      { t: 'q', kind: 'blank', fig: 'q_baseUrl', q: 'IE를 부르는 client예요. 빈칸에 알맞은 주소 끝부분은?', lang: 'py',
        code: src(['client = OpenAI(', '    api_key=KEY,', '    base_url="https://api.upstage.ai"', '             "[[1]]")']),
        opts: ['/v1/information-extraction', '/v1', '/v1/document-digitization', '/v1/solar'], a: 0,
        why: 'IE 주소는 <code>https://api.upstage.ai/v1/information-extraction</code>이에요. 모델은 <code>information-extract</code>예요.',
        ex: ['', 'Solar(Chat)를 부르는 주소예요. IE는 뒤에 더 붙어요.', 'Document Parse 주소예요(c2u1). 하는 일이 달라요.', '예전 주소예요. 인터넷의 옛 예제를 그대로 따라 하지 않아요.'] },
      { t: 'q', kind: 'mc', fig: 'q_confCode', q: 'IE 결과에 값마다 high·low를 받고 싶어요. 바른 코드는?',
        opts: ['create()에 <code>confidence=True</code>를 바로 적는다', '<code>response_format</code> 안에 <code>"confidence": "high"</code>를 적는다', '<code>reasoning_effort="high"</code>로 바꾼다', '<code>extra_body={"confidence": True}</code>로 보낸다'], a: 3,
        why: 'confidence는 OpenAI SDK에 없는 IE만의 칸이라 <code>extra_body</code>에 넣어 보내요. mode·location 같은 다른 IE 선택 칸도 같아요.',
        ex: ['SDK의 create()에는 confidence라는 칸이 없어서 오류가 나요. SDK 밖 칸은 extra_body로 보내요.', 'response_format은 결과 모양(스키마)을 정하는 칸이에요. high·low는 IE가 붙여 주는 값이에요.', 'reasoning_effort는 Solar의 추론 칸이에요. IE의 confidence와 상관없어요.', ''] },
      { t: 'q', kind: 'order', fig: 'q_extractOrder', q: 'extract.py가 하는 일을 순서대로 쌓아 보세요.',
        items: ['PDF를 <code>"rb"</code>로 열어 바이트를 읽는다', 'base64 글자로 바꿔 data URL을 만든다', 'response_format에 스키마를 담아 IE에 요청한다', 'content의 JSON 글자를 json.loads로 푼다'],
        why: '파일을 읽어야 바꿀 수 있고, 바꿔야 메시지에 담을 수 있어요. 결과 글자는 받은 뒤에야 풀 수 있어요.' },
      { t: 'sum', pts: ['IE는 OpenAI SDK + base_url ".../v1/information-extraction", model "information-extract".', '파일은 base64 data URL로 image_url 칸에, 스키마는 response_format(json_schema)에. 결과는 JSON 글자라 json.loads.', 'extra_body={"confidence": True}면 값마다 high/low. low는 "사람이 한 번 봐 줘".'] }
    ]},

    /* =================== L4 =================== */
    { id: 'L4', type: 'lesson', title: 'Solar 구조화 출력과 고르기', sub: '글은 solar-pro4, 파일·이미지는 IE, 비용 비교', min: 13, steps: [
      { t: 'say', h: 'JSON을 받는 길은 둘이에요', fig: 'twoRoads', p: [
        'c2u1의 <code>parse.py</code>로 형성평가지를 이미 Markdown(<code>data/quiz3.md</code>)으로 바꿔 뒀다면, 그 <b>글</b>을 Solar에게 주고 스키마대로 답하게 할 수도 있어요. 이걸 <b>구조화 출력</b>(structured outputs)이라고 해요.',
        '고르는 기준은 간단해요. <b>파일·이미지 그대로면 IE</b>, <b>이미 글로 바꿨으면 Solar 구조화 출력</b>이에요.'
      ], table: { head: ['', 'Information Extract', 'Solar 구조화 출력'], rows: [
        ['넣는 것', '파일·이미지(base64)', '글(파싱한 Markdown 등)'],
        ['주소·모델', '<code>…/v1/information-extraction</code>, <code>information-extract</code>', '<code>…/v1</code>, <code>solar-pro4</code>'],
        ['스키마 규칙', '첫 단계·배열 안 배열 규칙', '<code>strict: True</code>, object마다 <code>additionalProperties: False</code>, 모든 칸 required'],
        ['값 확인', 'confidence(high/low, 베타)', 'confidence 칸 없음 → 코드로 검사'],
        ['요금', '쪽당', '토큰당'] ] } },
      { t: 'say', h: 'strict 서식은 칸을 빠짐없이 적어요', fig: 'strictLock', p: [
        'Solar 구조화 출력은 <code>"strict": True</code>로 켜요. 대신 서식이 더 엄격해요. <b>모든 object에 <code>"additionalProperties": False</code></b>(적힌 칸 말고는 못 넣음), <b>모든 칸을 <code>required</code></b>에 넣어요.',
        'IE용 <code>schema.json</code>에는 이 두 가지가 없어요. 같은 서식을 Solar에 쓰려면 문항 object와 맨 위 object 둘 다에 더해요. 아래는 칸 셋만 보였어요. choices·points도 같은 꼴로 더하고 required에도 넣어요.'
      ], code: { lang: 'py', src: src([
        'ITEM = {',
        '    "type": "object",',
        '    "properties": {',
        '        "no": {"type": "integer"},',
        '        "question": {"type": "string"},',
        '        "answer": {"type": "string"},',
        '    },',
        '    "required": ["no", "question",',
        '                 "answer"],',
        '    "additionalProperties": False,',
        '}']) } },
      { t: 'say', h: 'solar-pro4에 글과 서식을 함께 보내요', p: [
        'client는 c1u3의 <code>hello_solar.py</code>와 같아요(주소 <code>https://api.upstage.ai/v1</code>). 추출에는 <code>reasoning_effort="none"</code>과 낮은 <code>temperature</code>가 어울려요. 추론을 켜면 느려지고 토큰이 늘어요.',
        '<code>md</code>는 <code>data/quiz3.md</code>를 <code>encoding="utf-8"</code>로 읽은 글이에요. 맨 위 서식 <code>SCHEMA</code>도 같은 꼴(<code>title</code>, <code>items</code> 배열에 <code>ITEM</code>, required, additionalProperties)로 만들고, 결과는 IE처럼 <code>json.loads</code>로 풀어요.'
      ], code: { lang: 'py', src: src([
        'MODEL = "solar-pro4"',
        'JS = {"name": "quiz", "strict": True,',
        '      "schema": SCHEMA}',
        'FMT = {"type": "json_schema",',
        '       "json_schema": JS}',
        'ask = "문항을 뽑아 줘.\\n" + md',
        'resp = client.chat.completions.create(',
        '    model=MODEL, temperature=0.2,',
        '    messages=[{"role": "user",',
        '               "content": ask}],',
        '    reasoning_effort="none",',
        '    response_format=FMT)']) } },
      { t: 'say', h: '비용은 둘 다 적어요, 기준은 정확도', fig: 'coins', p: [
        '지금 가격(2026년 10월, 부가세 별도)으로 어림해 봐요. IE는 standard 쪽당 <b>$0.04</b>(enhanced $0.06), Document Parse는 쪽당 $0.01, <code>solar-pro4</code>는 100만 토큰당 입력 $0.30·출력 $1.20이에요.',
        '한 학기 형성평가지 10장(장마다 2쪽, 모두 20쪽)이면 IE는 20 × $0.04 = <b>약 $0.80</b>이에요. Parse 뒤 Solar는 Parse 약 $0.20 + Solar(입력 2만·출력 5천 토큰 어림) 약 $0.01 = <b>약 $0.21</b>이에요.',
        '어느 쪽이든 1달러가 안 돼요. 그러니 돈보다 <b>정확도와 확인 시간</b>으로 골라요. 사진·스캔본이나 표가 복잡하면 IE, 이미 깔끔한 글이 있으면 Solar가 편해요.'
      ], tip: '가격은 자주 바뀌어요. 쓰기 전에 <code>upstage.ai/pricing/api</code>에서 지금 값을 확인해요.' },
      { t: 'q', kind: 'mc', fig: 'q_mdReady', q: 'c2u1에서 만든 <code>data/quiz3.md</code>(형성평가지를 파싱한 글)가 있어요. 여기서 문항 JSON을 뽑을 때 가장 알맞은 길은?',
        opts: ['<code>quiz3.md</code>를 base64로 바꿔 IE에 보낸다', 'Solar Chat에 "JSON으로 줘"라고만 적고 서식은 주지 않는다', '<code>solar-pro4</code>에 글과 strict 서식을 함께 보낸다', '<code>quiz3.md</code>를 다시 Document Parse에 넣는다'], a: 2,
        why: '이미 글이 있으면 Solar 구조화 출력이 짧은 길이에요. strict 서식을 <code>response_format</code>에 담아 주면 정한 칸 모양 그대로 받아요.',
        ex: ['.md 글 파일은 IE가 받는 형식(PDF·이미지·HWP 등) 목록에 없어요. 이미 글이라면 Solar 쪽이 맞아요.', '모양을 정해 주지 않으면 칸 이름·모양이 그때그때 달라질 수 있어요.', '', 'Parse는 이미 했어요. 다시 넣어도 또 글이 나올 뿐이에요.'] },
      { t: 'q', kind: 'line', fig: 'q_strictLine', q: 'Solar strict용 문항 서식이에요. 이대로 보내면 규칙에 어긋나는 줄을 눌러 보세요.', lang: 'py',
        code: src(['ITEM = {', '    "type": "object",', '    "properties": {', '        "no": {"type": "integer"},', '        "points": {"type": "integer"},', '    },', '    "required": ["no"],', '    "additionalProperties": False,', '}']), a: 6,
        why: 'strict에서는 모든 칸을 required에 넣어요. <code>points</code>가 빠졌어요. <code>["no", "points"]</code>로 고쳐요.' },
      { t: 'q', kind: 'blank', fig: 'q_effortBlank', q: '형성평가 글에서 문항을 뽑는 Solar 요청이에요. 빈칸에 가장 알맞은 값은?', lang: 'py',
        code: src(['resp = client.chat.completions.create(', '    model=MODEL,', '    messages=msgs,', '    reasoning_effort="[[1]]",', '    temperature=0.2,', '    response_format=FMT)']),
        opts: ['none', 'high', 'max', 'strict'], a: 0,
        why: '추출·분류·채점처럼 정해진 칸을 채우는 일은 추론을 끄고(<code>"none"</code>) 낮은 temperature로 해요. 빠르고 토큰이 적게 들어요.',
        ex: ['', '여러 단계 추론이 필요한 일이 아니라, 느려지고 토큰만 늘어요.', '가장 오래 생각하는 값이라 추출에는 지나쳐요. 시간과 돈이 많이 들어요.', 'strict는 response_format 안 json_schema의 칸이에요. reasoning_effort 값이 아니에요.'] },
      { t: 'q', kind: 'mc', fig: 'q_cost', q: '3쪽짜리 형성평가지 5장을 IE standard로 한 번씩 뽑아요. 지금 가격(쪽당 $0.04)으로 어림하면?',
        opts: ['약 $0.12', '약 $6.00', '약 $0.20', '약 $0.60'], a: 3,
        why: '3쪽 × 5장 = 15쪽, 15 × $0.04 = $0.60이에요(부가세 별도). IE는 쪽 수로 값을 매겨요.',
        ex: ['한 장(3쪽)만 셌어요. 5장이면 15쪽이에요.', '쪽당 $0.40으로 계산했어요. 열 배예요.', '5쪽만 셌어요. 3쪽 × 5장 = 15쪽이에요.', ''] },
      { t: 'q', kind: 'mc', fig: 'q_photo', q: '종이 형성평가지를 휴대폰으로 찍은 사진(JPEG)만 있어요. 문항 JSON을 얻는 가장 짧은 길은?',
        opts: ['사진 파일 이름을 solar-pro4 메시지에 적어 보낸다', '사진을 base64 data URL로 IE에 보내 스키마대로 받는다', '사진 파일의 확장자를 .md로 바꿔 Solar에 보낸다', 'confidence를 켜서 사진을 글로 바꾼 뒤 Solar에 보낸다'], a: 1,
        why: '파일·이미지 그대로면 IE예요. 사진을 data URL로 보내면 스키마의 칸을 채워 돌려줘요.',
        ex: ['이름만으로는 사진 내용이 가지 않아요.', '', '확장자를 바꿔도 내용은 그림 그대로예요. 글이 아니에요.', 'confidence는 값마다 high/low를 붙이는 기능이에요. 사진을 글로 바꾸지 않아요.'] },
      { t: 'sum', pts: ['파일·이미지 그대로면 IE, 이미 파싱한 글이면 solar-pro4 구조화 출력(response_format).', 'Solar strict: "strict": True, 모든 object에 additionalProperties: False, 모든 칸 required. 추출은 reasoning_effort="none" + 낮은 temperature.', '지금 가격으로 20쪽: IE 약 $0.80, Parse+Solar 약 $0.21. 둘 다 싸니 정확도·확인 시간으로 고른다.'] }
    ]},

    /* =================== QB =================== */
    { id: 'QB', type: 'quiz', title: '헷갈림 퀴즈 ②', sub: 'IE vs 구조화 출력, strict 규칙, confidence 뜻', min: 4, steps: [
      { t: 'q', kind: 'mc', fig: 'qb_twoJson', q: 'IE와 Solar 구조화 출력은 둘 다 <code>response_format</code>에 json_schema를 넣어요. 둘의 차이로 맞는 것은?',
        opts: ['IE는 결과가 딕셔너리로 와서 json.loads가 필요 없다', '둘은 주소와 모델 이름만 다른 같은 기능이다', 'Solar 구조화 출력도 값마다 confidence를 붙여 준다', 'IE는 파일(data URL)을, Solar는 글을 받는다'], a: 3,
        why: 'IE는 파일·이미지에서, Solar는 글에서 뽑아요. 스키마 규칙(IE 첫 단계 규칙 vs Solar strict)과 요금 단위(쪽당 vs 토큰당)도 달라요.',
        ex: ['둘 다 content에 JSON 글자로 와요. 둘 다 json.loads가 필요해요.', '넣는 것(파일 vs 글), 스키마 규칙, 요금 단위가 달라요.', 'confidence는 IE의 베타 기능이에요. Solar에는 그런 칸이 없어요.', ''] },
      { t: 'q', kind: 'mc', fig: 'qb_strictErr', q: 'IE용 <code>schema.json</code>을 그대로 Solar에 <code>"strict": True</code>로 보냈더니 요청이 오류로 돌아왔어요. 서식에서 먼저 확인할 곳은?',
        opts: ['모든 object에 additionalProperties: False와 모든 칸 required가 있는지', '첫 단계에 object가 있는지', 'description이 한국어인지', '<code>reasoning_effort</code>가 "high"인지'], a: 0,
        why: 'strict 구조화 출력은 object마다 <code>"additionalProperties": False</code>, 모든 칸을 <code>required</code>에 넣어야 해요. IE용 서식에는 둘 다 없어요.',
        ex: ['', 'IE 규칙대로 만든 서식이라 첫 단계 object는 이미 없어요.', 'strict 규칙에는 설명 언어에 대한 조건이 없어요.', 'reasoning_effort는 추론 양이에요. 서식 규칙과 상관없어요.'] },
      { t: 'q', kind: 'mc', fig: 'qb_lowMean', q: 'IE 결과에서 3번 정답 값에 <code>"confidence": "low"</code>가 붙었어요. 바르게 다룬 것은?',
        opts: ['틀린 값이니 바로 지우고 빈칸으로 둔다', '원본 평가지와 대조해 맞으면 두고, 틀리면 고친다', '30% 확률로 맞는다는 뜻이니 그대로 쓴다', 'high가 될 때까지 같은 파일을 여러 번 다시 뽑는다'], a: 1,
        why: 'low는 "사람이 한 번 봐 줘"라는 표시예요. 원본과 대조해 맞으면 그대로, 틀리면 고쳐요.',
        ex: ['low여도 맞은 값일 때가 꽤 있어요. 지우면 맞은 값까지 잃어요.', '', 'confidence는 숫자가 아니라 high/low 두 글자예요.', '부를 때마다 쪽당 돈이 들고, high가 된다고 맞는다는 보장도 없어요.'] }
    ]},

    /* =================== L5 =================== */
    { id: 'L5', type: 'lesson', title: '검증하고 사람이 확인해요', sub: '규칙 검사, low만 교사 확인, questions.json', min: 15, steps: [
      { t: 'say', h: '모양이 맞아도 값은 틀릴 수 있어요', fig: 'shapeVsValue', p: [
        'IE는 서식의 모양은 지켜 줘요. 하지만 흐린 인쇄, 손으로 고친 정답, 두 단으로 나뉜 문항 때문에 <b>값</b>은 틀릴 수 있어요.',
        '자주 보는 실수는 넷이에요. 정답 칸이 비어 있음, <code>"②"</code>처럼 정한 모양과 다름, 보기 수보다 큰 번호, 배점을 잘못 읽어 합계가 안 맞음.',
        '이런 건 <b>코드로 먼저 걸러요</b>. 사람은 코드가 걸러 준 것과 low만 보면 돼요.'
      ]},
      { t: 'say', h: '교사는 확인 목록만 봐요', fig: 'checkList', p: [
        '코드가 걸러 낸 것과 low인 값을 모아 <b>교사 확인 목록</b>으로 출력해요. 모든 값을 다 대조하면 자동으로 뽑는 보람이 없으니까요.',
        '다만 처음 몇 장은 전체를 원본과 대조해 봐요. 내 평가지 모양에서 IE가 어디를 잘 틀리는지 알아야 description도 고칠 수 있어요.'
      ], table: { head: ['검사', '무엇을 보나', '누가'], rows: [
        ['정답 빈칸', '<code>answer</code>가 빈 글자인가', '코드'],
        ['보기 번호 범위', '객관식 정답이 "1"~"4" 안인가', '코드'],
        ['배점 합계', '배점을 더하면 평가지 총점(예: 10점)인가', '코드'],
        ['confidence low', 'low가 붙은 값', '교사(원본과 대조)'] ] } },
      { t: 'try', lang: 'py', h: '교사 확인 목록 만들기', p: 'IE 결과를 흉내 낸 <code>items</code>(question 칸은 줄였어요)와 값마다 붙은 confidence를 모은 <code>conf</code>예요. 실행해 목록을 본 뒤, 원본대로 2번 답 <code>"1"</code>, 3번 답 <code>"len"</code>, 4번 배점 3으로 고치고 확인한 칸의 <code>"low"</code>를 <code>"ok"</code>로 바꿔 목록이 비는지 봐요.',
        src: src([
          'items = [',
          '  {"no": 1, "answer": "2", "points": 2,',
          '   "choices": "①4 ②8 ③16 ④32"},',
          '  {"no": 2, "answer": "①", "points": 2,',
          '   "choices": "①101 ②110 ③011 ④111"},',
          '  {"no": 3, "answer": "", "points": 3,',
          '   "choices": ""},',
          '  {"no": 4, "answer": "if", "points": 8,',
          '   "choices": ""},',
          ']',
          'conf = {"1.answer": "high",',
          '        "2.answer": "high",',
          '        "3.answer": "low",',
          '        "4.points": "low"}',
          'OK = ["1", "2", "3", "4"]',
          '',
          'def check(it):',
          '    no, a = it["no"], it["answer"]',
          '    if a == "":',
          '        return f"{no}번 답이 비었어요"',
          '    if it["choices"] and a not in OK:',
          '        return f"{no}번 답 {a}: 범위 밖"',
          '    return ""',
          '',
          'todo = [check(it) for it in items]',
          'todo = [t for t in todo if t]',
          's = sum(it["points"] for it in items)',
          'if s != 10:',
          '    todo.append(f"배점 합계 {s} ≠ 10")',
          'for k, v in conf.items():',
          '    if v == "low":',
          '        todo.append(f"{k}: low")',
          'print("교사 확인 목록(원본과 대조)")',
          'for t in todo:',
          '    print("-", t)',
          'if not todo:',
          '    print("- 없음! 저장해도 돼요")']),
        note: '2번은 high인데도 걸렸어요. confidence만 믿지 않고 규칙 검사를 함께 하는 까닭이에요.' },
      { t: 'say', h: '다 고쳤으면 questions.json으로 저장해요', fig: 'saveJson', p: [
        '검사와 확인을 마친 결과를 <code>questions.json</code>으로 저장해요. <code>ensure_ascii=False</code>는 한글을 <code>\\uc815</code> 같은 글자로 바꾸지 않고 그대로 두게 해요.',
        '이 파일이 연수 2일차 <b>트랙 A</b>의 문제·정답 데이터예요. c4u1에서 여기에 테스트 케이스·힌트를 더해 <code>problems.json</code>을 만들고 채점기를 돌려요.'
      ], code: { lang: 'py', src: src([
        'with open("questions.json", "w",',
        '          encoding="utf-8") as f:',
        '    json.dump(data, f, indent=2,',
        '              ensure_ascii=False)']) },
        tip: '학생이 푼 답안지는 넣지 않아요. 이름·답이 담긴 개인정보예요. 꼭 써야 한다면 학교·교육청 지침을 먼저 확인해요.' },
      { t: 'sim', h: 'low인 값을 원본과 대조해 고쳐요', p: 'confidence를 켠 extract.py로 문항을 뽑고, low로 나온 값을 원본 평가지와 대조해 고친 뒤 다시 검사해 봐요.',
        scene: { win: 'ide', folder: 'upstage-lab', files: LAB2, open: 'check.py', lang: 'py', code: CHECK_PY, term: [] },
        steps: [
          { goal: '<code>python extract.py</code>를 쳐요', type: 'python extract.py', into: 'term',
            then: { term: ['$ python extract.py', 'questions.json 저장: 4문항', 'low 1개: 3.answer'], prompt: '' },
            say: '값마다 붙은 confidence 중 low만 골라 알려 줘요. 종이 원본을 보니 3번 정답은 <code>len</code>이에요.' },
          { goal: '<code>questions.json</code>을 열어요', click: 'file:questions.json', then: { open: 'questions.json', lang: 'json', code: QJ('') },
            say: '3번 문항의 <code>"answer": ""</code>가 보여요. 흐리게 인쇄된 칸이라 못 읽었나 봐요. 이 줄을 골라 둔 상태예요.' },
          { goal: '<kbd>mod+k</kbd>로 인라인 편집을 열어요', key: 'mod+k', then: { inline: { line: 10, text: '' } },
            say: '커서한입에서 배운 <b>인라인 편집</b>이에요. 짧은 값이라 직접 고쳐도 되지만, 여기서는 부탁해 봐요.' },
          { goal: '고칠 값을 적어요', type: '3번 answer를 "len"으로', into: 'inline', say: '원본에서 확인한 값을 그대로 적었어요.' },
          { goal: '<kbd>enter</kbd>로 보내요', key: 'enter', then: { inline: { line: 10, text: '' }, diff: { line: 10, del: ['      "answer": "",'], add: ['      "answer": "len",'] } },
            say: '빨간 줄이 빠지고 초록 줄이 들어가요. 바뀐 게 이 한 줄뿐인지 봐요.' },
          { goal: 'Accept를 눌러요', click: 'btn:accept', then: { inline: null, diff: null, code: QJ('len') },
            say: '받아들였어요. 원본과 같은 값이 됐어요.' },
          { goal: '<code>python check.py</code>로 다시 검사해요', type: 'python check.py', into: 'term',
            then: { term: ['low 1개: 3.answer', '$ python check.py', '교사 확인 목록(원본과 대조)', '- 없음! 저장해도 돼요'], prompt: '' },
            say: '규칙 검사를 통과했어요. 이제 이 파일이 트랙 A의 문제·정답 데이터예요.' } ],
        end: '뽑고 → low와 걸린 값만 원본과 대조 → 고치고 → 다시 검사.' },
      { t: 'q', kind: 'mc', fig: 'q_whoChecks', q: '검사 결과 "배점 합계 15 ≠ 10"이 나왔고, 4번 배점에는 low가 붙어 있어요. 어떻게 할까요?',
        opts: ['합계를 맞추려고 아무 문항 배점이나 줄인다', '원본 평가지에서 4번 배점을 확인해 고친다', '검사의 총점을 15로 바꿔 통과시킨다', 'confidence를 끄고 다시 뽑는다'], a: 1,
        why: '코드가 "어딘가 틀렸다"를 찾고, low가 "어디일지"를 짚어 줬어요. 고치는 기준은 늘 원본이에요.',
        ex: ['어느 문항이 틀렸는지 모른 채 고치면 채점이 엉켜요.', '', '검사를 바꾸면 틀린 데이터가 그대로 채점에 들어가요.', '표시만 사라질 뿐 틀린 값은 그대로예요. 다시 뽑으면 돈도 들어요.'] },
      { t: 'q', kind: 'blank', fig: 'q_asciiBlank', q: '저장한 questions.json을 열었더니 한글이 <code>\\uc815\\ub2f5</code>처럼 보여요. 빈칸에 알맞은 값은?', lang: 'py',
        code: src(['json.dump(data, f, indent=2,', '          ensure_ascii=[[1]])']),
        opts: ['False', 'True', '"utf-8"', '"ko"'], a: 0,
        why: '<code>ensure_ascii</code>의 기본값은 True라서 한글이 \\u 글자로 바뀌어요. False로 두면 한글이 그대로 저장돼요.',
        ex: ['', '기본값이 True라서 지금처럼 \\u 글자로 바뀐 거예요.', '글자 인코딩은 open()의 <code>encoding</code> 칸에 적어요.', '언어 이름을 받는 칸이 아니에요. 참·거짓 값을 받아요.'] },
      { t: 'q', kind: 'order', fig: 'q_pipeline', q: '형성평가지에서 트랙 A 채점 데이터까지, 순서대로 쌓아 보세요.',
        items: ['IE로 형성평가지에서 문항·정답을 뽑는다', '검사 코드로 빈 정답·보기 번호·배점 합계를 거른다', '교사가 걸린 값과 low 값을 원본과 대조해 고친다', 'questions.json으로 저장해 채점기에 넘긴다'],
        why: '뽑아야 검사할 수 있고, 코드가 걸러 준 목록이 있어야 교사가 그것만 대조해요. 확인을 마친 데이터만 저장해 채점에 써요.' },
      { t: 'q', kind: 'mc', fig: 'q_privacy', q: '실습 자료로 지난 학기 학생 30명이 푼 형성평가 답안지를 스캔해 IE로 정답률을 뽑으려 해요. 가장 알맞은 판단은?',
        opts: ['연수 실습이니 그대로 써도 된다', '이름만 가리면 아무 문제 없다', '쓰지 않고 내 문제지·정답표로 실습한다', 'IE는 개인정보를 저장하지 않으니 괜찮다'], a: 2,
        why: '답안지에는 이름과 학생의 답이 담겨 있어요. 실습은 내 문제지·정답표로 하고, 학생 자료는 학교·교육청 지침을 먼저 확인해요.',
        ex: ['연수 실습이라도 학생 개인정보가 담긴 문서는 쓰지 않아요.', '이름 말고도 글씨·답 내용 등으로 누군지 알 수 있어요. 지침을 먼저 확인해요.', '', '어디에 얼마나 보관되는지 확인하지 않고 단정할 수 없어요. 개인정보 문서는 넣지 않는 게 원칙이에요.'] },
      { t: 'sum', pts: ['IE는 모양은 지키지만 값은 틀릴 수 있다. 빈 정답·보기 번호 범위·배점 합계는 코드로 거른다.', 'low 값과 코드가 걸러 낸 것만 모아 교사 확인 목록. 처음 몇 장은 전체를 원본과 대조한다.', 'questions.json은 ensure_ascii=False로 저장해 트랙 A(c4u1) 채점 데이터로. 학생 답안지는 넣지 않는다.'] }
    ]},

    /* =================== M1 =================== */
    { id: 'M1', type: 'mission', title: '내 형성평가지로 questions.json 만들기', sub: '내 Cursor와 upstage-lab에서 직접', min: 30,
      where: 'upstage-lab 폴더 + 내 Cursor + 업스테이지 콘솔(Billing)',
      intro: '이번 단원에서 배운 것을 진짜로 해 봐요. 학생 개인정보가 없는 <b>내 형성평가지(문제지·정답표)</b> 1~2쪽만 써요. 끝낸 것부터 체크하고 한 줄 메모를 남겨요.',
      tasks: [
        { do: '시작 전에 커밋하고 평가지를 준비해요',
          how: '<code>upstage-lab</code>에서 <code>git status</code>가 깨끗한지 보고, 아니면 먼저 커밋해요. 정답·배점이 함께 적힌 내 형성평가지 PDF나 사진(1~2쪽)을 <code>data/</code>에 넣어요. 학생 이름·답안이 있는 파일은 쓰지 않아요.',
          check: '<code>git log -1</code>에 방금 커밋이 보이고, <code>git status</code>에 <code>.env</code>가 나오지 않으면 성공.' },
        { do: '에이전트에게 schema.json을 부탁해요',
          how: 'Cursor 에이전트를 Plan 모드로 두고 아래 부탁을 붙여 넣어요. 계획이 괜찮으면 진행하고, 만든 서식이 레슨 2 규칙에 맞는지 직접 읽어요.',
          check: '<code>schema.json</code>의 첫 단계에 object가 없고, 배열 안 배열이 없고, 칸마다 description이 있으면 성공.',
          prompt: 'upstage-lab 폴더에 Upstage Information Extract용 schema.json을 만들어 줘.\n- 뽑을 것: 형성평가지의 title(string)과 items(array). items의 각 칸은 object이고 no(integer), question(string), choices(string), answer(string), points(integer)를 둬.\n- IE 규칙: 맨 위는 object, 첫 단계 속성은 string·integer·number·array만, 배열 안에 배열 금지.\n- 칸마다 한국어 description. choices는 "보기 전부를 한 줄로, 단답형은 빈 글자", answer는 "객관식은 1~4 숫자, 단답형은 정답 낱말".\n- 파일만 만들고 코드는 아직 쓰지 마. 다 되면 세 규칙을 어떻게 지켰는지 짧게 알려 줘.' },
        { do: 'extract.py를 만들어 내 평가지를 뽑아요',
          how: '아래 부탁을 붙여 넣고, 에이전트가 쓴 코드가 레슨 3의 모양(주소·모델·response_format·json.loads)과 같은지 읽은 뒤 터미널에서 <code>python extract.py</code>로 직접 실행해요.',
          check: '터미널에 문항 JSON과 low 목록이 찍히고 <code>questions.json</code>이 생기면 성공. 키가 화면이나 파일에 찍히지 않았는지도 봐요.',
          prompt: 'upstage-lab에 extract.py를 만들어 줘.\n- OpenAI SDK, base_url은 "https://api.upstage.ai/v1/information-extraction", model은 "information-extract". 키는 .env의 UPSTAGE_API_KEY를 python-dotenv로 읽고 절대 출력하지 마.\n- data/ 안의 평가지 파일을 base64 data URL(data:application/octet-stream;base64,…)로 만들어 image_url에 넣어.\n- schema.json을 utf-8로 읽어 response_format={"type": "json_schema", "json_schema": {"name": "quiz", "schema": …}}로 보내.\n- extra_body={"confidence": True}를 켜. 응답 모양은 공식 문서(https://console.upstage.ai/docs/capabilities/extract/universal-extraction)를 확인해 값과 confidence를 나눠 읽고, low인 칸은 "3.answer"처럼 모아 출력해.\n- 값은 questions.json에 ensure_ascii=False, indent=2로 저장해.\n- 옛 이름(solar-pro3, /v1/solar)은 쓰지 마. 실행은 내가 직접 할게.' },
        { do: '서식을 두 번 고치며 정확도를 기록해요',
          how: '원본과 대조해 맞은 칸 수를 세요(예: 4문항 × 5칸 = 20칸 중 몇 칸). 틀린 칸의 description을 더 분명하게 고쳐 다시 실행하고, 한 번 더 고쳐 다시 실행해요.',
          check: '메모에 "1회 16/20 → 2회 19/20 → 3회 20/20"처럼 세 번의 기록이 있으면 성공.' },
        { do: 'check.py로 검증하고 low를 대조해요',
          how: '아래 부탁으로 레슨 5 연습장의 검사를 파일로 만들고, 걸린 값과 low 값을 원본과 대조해 <code>questions.json</code>을 고쳐요. 마지막에 <code>git add</code>와 <code>git commit</code>(.env가 빠졌는지 확인).',
          check: '<code>python check.py</code>가 "없음"을 출력하고, 고친 값이 원본과 같고, 커밋이 남았으면 성공.',
          prompt: 'upstage-lab에 check.py를 만들어 줘. questions.json을 utf-8로 읽어 문항마다 (1) answer가 빈 글자인지 (2) choices가 있는 객관식이면 answer가 "1"~"4" 중 하나인지 검사하고, (3) points 합계가 맨 위에 적어 둔 TOTAL(예: 10)과 같은지 봐. 걸린 것을 "교사 확인 목록"으로 한 줄씩 출력하고, 없으면 "없음"을 출력해. 파일은 고치지 말고 읽기만 해. 일부러 틀린 예시 questions.json으로 시험해 보는 방법도 알려 줘.' }
      ],
      note: '예상 비용: IE standard는 지금 쪽당 $0.04(부가세 별도, 2026년 10월 기준)예요. 2쪽 평가지를 세 번 뽑으면 6쪽 × $0.04 ≈ $0.24예요. 먼저 1쪽짜리로 시험하고, 콘솔 <b>Billing</b>의 <b>Usage</b>에서 쓴 만큼을 확인해요. 키는 <code>.env</code>에만 두고 화면 공유·채팅에 올리지 않아요.' },

    /* =================== T1 =================== */
    { id: 'T1', type: 'test', title: '단원 형성평가', sub: '10문제 · 7문제 이상 맞히면 통과', min: 12, pass: 0.7, steps: [
      { t: 'q', kind: 'mc', fig: 't_wrongUrl', q: '연수 1일차 14:00 실습. 옆 선생님이 <code>hello_solar.py</code>를 복사해 <code>model</code>만 <code>"information-extract"</code>로 바꾸고 PDF를 보냈더니 오류가 나요. 가장 먼저 확인할 곳은?',
        opts: ['<code>reasoning_effort</code> 값이 "none"인지', 'client의 <code>base_url</code>이 IE 주소인지', '<code>temperature</code>가 0인지', '<code>MODEL</code>을 <code>solar-pro4</code>로 되돌렸는지'], a: 1,
        why: 'hello_solar.py의 client는 Solar 주소(<code>…/v1</code>)를 가리켜요. IE는 주소가 <code>…/v1/information-extraction</code>이라 client부터 바꿔야 해요.',
        ex: ['IE 요청 칸 목록에 없는 Solar 쪽 매개변수예요. 먼저 볼 곳은 주소예요.', '', 'temperature는 이 오류의 원인이 아니에요. 주소를 먼저 봐요.', 'solar-pro4는 IE 모델이 아니에요. 모델은 information-extract가 맞아요.'] },
      { t: 'q', kind: 'blank', fig: 't_strictBlank', q: 'Solar 구조화 출력용 서식이에요. 두 빈칸을 채워 보세요.', lang: 'py',
        code: src(['JS = {"name": "quiz",', '      "strict": [[1]],', '      "schema": {', '        "type": "object",', '        "properties": PROPS,', '        "required": ["title", "items"],', '        "additionalProperties": [[2]]}}']),
        opts: [['False', 'True'], ['True', 'True'], ['True', 'False'], ['False', 'False']], a: 2,
        why: 'strict는 켜고(<code>True</code>), 적힌 칸 말고는 못 들어오게 <code>additionalProperties</code>는 <code>False</code>예요.',
        ex: ['둘 다 거꾸로예요. strict는 켜고, 적지 않은 칸은 막아요.', '둘째 칸이 틀렸어요. additionalProperties가 False여야 다른 칸이 끼어들지 않아요.', '', '첫 칸이 틀렸어요. 구조화 출력은 strict를 True로 켜요.'] },
      { t: 'q', kind: 'order', fig: 't_lowFix', q: '검사에서 "3번 답이 비었어요"와 "3.answer: low"가 나왔어요. 할 일을 순서대로 쌓아 보세요.',
        items: ['원본 평가지에서 3번 정답을 찾아 읽는다', 'questions.json의 3번 answer를 원본대로 고친다', 'check.py를 다시 돌려 목록이 비었는지 본다', 'git commit으로 고친 데이터를 남긴다'],
        why: '고치는 기준은 원본이라 원본부터 봐요. 고친 뒤 다시 검사해 통과한 것만 커밋해요.' },
      { t: 'q', kind: 'line', fig: 't_loadsLine', q: 'extract.py의 마지막 줄에서 <code>TypeError</code>가 나요. <b>원인이 된 줄</b>을 눌러 보세요.', lang: 'py',
        code: src(['resp = client.chat.completions.create(', '    model="information-extract",', '    messages=[msg],', '    response_format=FMT,', ')', 'data = resp.choices[0].message.content', 'print(data["items"][0]["answer"])']), a: 5,
        why: 'content는 JSON 모양의 <b>글자</b>예요. 글자에 <code>["items"]</code>를 쓰면 TypeError가 나요. <code>json.loads(…content)</code>로 풀어야 딕셔너리가 돼요.' },
      { t: 'q', kind: 'mc', fig: 't_rubric', q: '수행평가 채점 기준표(기준마다 이름·최고점·단계 설명)를 IE로 뽑으려 해요. 규칙에 맞는 설계는?',
        opts: ['<code>criteria</code>: array, 칸은 object(levels는 한 줄 글자)', '<code>criteria</code>: 첫 단계 object, 기준 이름을 키로', '<code>criteria</code>: array, 칸은 array(<code>["이름", 5, "설명"]</code>)', '<code>name</code>·<code>max</code>·<code>levels</code>를 묶은 첫 단계 object 하나'], a: 0,
        why: '기준이 여러 개라 첫 단계 array, 기준 하나는 object(<code>name</code>, <code>max</code>, <code>levels</code>)예요. 단계 설명은 한 줄 글자로 합쳐 배열 안 배열을 피해요.',
        ex: ['', '첫 단계에는 object를 둘 수 없어요.', '배열 안에 배열은 안 돼요.', '첫 단계 object는 안 되고, 기준이 여러 개라 목록이 필요해요.'] },
      { t: 'q', kind: 'mc', fig: 't_hwp', q: '교육청 연수 안내 공문(HWP 파일)에서 날짜·장소·대상만 뽑아 표로 정리하려 해요. 가장 짧은 길은?',
        opts: ['HWP를 열어 글을 복사해 Solar Chat에 붙이고 표로 달라고 한다', 'HWP는 지원하지 않으니 PDF로 바꿀 방법부터 찾는다', 'Document Parse 결과의 elements를 그대로 표로 쓴다', 'HWP 파일 그대로 IE에 스키마와 함께 보낸다'], a: 3,
        why: '파일 그대로 정해진 칸을 뽑는 일은 IE예요. HWP를 base64 data URL로 바꾸고, 날짜·장소·대상 칸을 스키마에 적어 보내요.',
        ex: ['되긴 하지만 복사하다 표·순서가 섞이기 쉽고, 칸 모양도 정해지지 않아요.', '지금 문서 기준으로 IE는 HWP·HWPX도 받아요(동기 요청).', 'elements는 문단·표 같은 조각이라 날짜·장소 칸으로 나뉘어 있지 않아요.', ''] },
      { t: 'q', kind: 'mc', fig: 't_lowRate', q: '20칸 중 5칸에 low가 붙었는데, 원본과 대조해 보니 그중 3칸은 맞았어요. 어떻게 받아들일까요?',
        opts: ['IE가 고장 났으니 confidence를 끈다', '흔한 일이다. low만 대조하는 흐름을 그대로 둔다', 'low인 값은 모두 틀렸다고 보고 지운다', 'high인 값은 앞으로 다시 볼 필요가 전혀 없다고 정한다'], a: 1,
        why: 'low는 틀린 값을 놓치지 않으려고 넉넉히 붙는 표시예요. 맞은 값에도 붙을 수 있으니 대조해서 고를 뿐이에요.',
        ex: ['고장이 아니에요. low는 "봐 달라"는 표시라 맞은 값에도 붙어요.', '', '5칸 중 3칸은 맞았어요. 지우면 맞은 값까지 잃어요.', 'high여도 규칙 검사는 하고, 처음 몇 장은 전체를 대조해요.'] },
      { t: 'q', kind: 'mc', fig: 't_ascii', q: '연수 2일차 트랙 A 11:00 「문제·정답 데이터 구성」. 내가 만든 questions.json을 옆 선생님과 열어 보니 문항 글이 <code>\\ub9ac\\uc2a4\\ud2b8</code>처럼 보여요. 원인은?',
        opts: ['저장할 때 <code>ensure_ascii=False</code>를 빼먹었다', 'IE가 한글을 읽지 못해 \\u 글자로 바꿔 돌려보냈다', '윈도우에서는 한글이 든 JSON 파일을 열 수 없다', 'confidence를 켜면 값이 \\u 글자로 숨겨진다'], a: 0,
        why: '<code>json.dump</code>의 <code>ensure_ascii</code> 기본값이 True라서 한글이 \\u 글자로 저장돼요. False로 저장하면 그대로 보여요.',
        ex: ['', 'IE는 한글 값을 그대로 돌려줘요. 저장할 때 바뀐 거예요.', '파일은 열려요. 저장 방식 때문에 \\u 글자로 보일 뿐이에요.', 'confidence는 값마다 high/low를 붙일 뿐 값을 숨기지 않아요.'] },
      { t: 'q', kind: 'mc', fig: 't_cost', q: '연수에서 2쪽짜리 형성평가지를 서식을 바꿔 가며 IE standard로 5번 뽑았어요. 지금 가격(쪽당 $0.04)으로 어림하면?',
        opts: ['약 $0.04', '약 $0.08', '약 $0.20', '약 $0.40'], a: 3,
        why: '2쪽 × 5번 = 10쪽, 10 × $0.04 = $0.40이에요(부가세 별도). 같은 파일이라도 부를 때마다 쪽 수만큼 매겨요.',
        ex: ['한 쪽 한 번 값이에요.', '2쪽 한 번 값이에요. 5번 뽑았어요.', '5쪽만 셌어요. 2쪽 × 5번 = 10쪽이에요.', ''] },
      { t: 'q', kind: 'mc', fig: 't_parseVsIe', q: '"학습지 전체 내용으로 학생 질문에 답하는 챗봇"과 "형성평가 정답표 데이터", 각각에 맞는 짝은?',
        opts: ['챗봇: IE / 정답표: Document Parse', '둘 다 IE', '챗봇: Document Parse / 정답표: IE', '둘 다 Document Parse'], a: 2,
        why: '챗봇은 학습지의 모든 글이 근거가 되니 전체 글(Document Parse, c2u3·c3u1로 이어져요), 정답표는 정해진 칸이니 IE예요.',
        ex: ['거꾸로예요. 챗봇은 전체 글, 정답표는 정해진 칸이 필요해요.', '챗봇에는 학습지의 모든 글이 필요해서 칸만 뽑으면 부족해요.', '', '정답표를 글 덩어리로 받으면 채점 프로그램이 칸을 다시 찾아야 해요.'] }
    ]}
    ]
  });
})();
