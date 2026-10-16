// 과정 1 · 단원 1 · 소버린 AI와 업스테이지 콘솔
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
  // 콘솔 창: 왼쪽 메뉴 줄(on번째 강조) + 가운데 칸. 가운데 칸이 시작하는 x를 돌려준다
  function consoleWin(P, x, y, w, h, on) {
    win(P, x, y, w, h);
    const top = y + 22, a = x + Math.round(w * 0.3);
    P.line(a, top, a, y + h, { w: 1.4 });
    const n = Math.max(2, Math.min(4, Math.floor((h - 30) / 16)));
    for (let i = 0; i < n; i++) P.line(x + 8, top + 12 + i * 16, a - 8 - (i % 2) * 8, top + 12 + i * 16, { c: i === on ? 'accent' : 'soft', w: 3 });
    return a;
  }
  // 채팅 창(말풍선 두 개 + 입력칸)
  function chatWin(P, x, y, w, h) {
    win(P, x, y, w, h);
    P.rrect(x + w * 0.4, y + 32, w * 0.52, 16, 6, { fill: 'sky', gap: 4, w: 1.2 });
    P.rrect(x + 8, y + 56, w * 0.6, 16, 6, { c: 'soft', w: 1.4 });
    if (h > 90) P.rrect(x + 8, y + h - 22, w - 16, 14, 5, { c: 'soft', w: 1.2 });
  }
  // 사람(어깨 + 머리 + 얼굴). bottom = 어깨 아래 끝
  function person(P, cx, bottom, mood, s) {
    s = s || 1;
    P.path(`M${cx - 40 * s} ${bottom} Q${cx} ${bottom - 64 * s} ${cx + 40 * s} ${bottom}`, { fill: 'sky', gap: 6 });
    P.circle(cx, bottom - 90 * s, 62 * s, { fill: 'paper' });
    P.face(cx, bottom - 88 * s, 50 * s, { mood: mood || 'smile' });
  }
  // 열쇠(고리 가운데 = x, y)
  function key(P, x, y, s, fill) {
    s = s || 1;
    P.circle(x, y, 26 * s, { fill: fill || 'hi', gap: 4, w: 2 });
    P.circle(x, y, 9 * s, { fill: 'paper', fs: 'solid', w: 1.4 });
    P.line(x + 13 * s, y, x + 48 * s, y, { w: 3 });
    P.line(x + 38 * s, y, x + 38 * s, y + 9 * s, { w: 3 });
    P.line(x + 47 * s, y, x + 47 * s, y + 11 * s, { w: 3 });
  }
  // 문서 쪽지(이름 + 글 줄)
  function doc(P, x, y, w, h, name, fill, size) {
    P.note(x, y, w, h, { fill: fill || 'paper' });
    if (name) P.text(x + w / 2, y + 22, name, { mono: true, size: size || 11, weight: 700 });
    const t = name ? y + 34 : y + 18, n = Math.min(4, Math.floor((y + h - 8 - t) / 12) + 1);
    for (let i = 0; i < n; i++) P.line(x + 8, t + i * 12, x + w - 10 - (i % 2) * 10, t + i * 12, { c: 'soft', w: 2 });
  }
  // 글자가 든 단추
  function chip(P, x, y, w, h, label, fill, size) {
    P.rrect(x, y, w, h, 8, { fill: fill || 'paper', gap: 5, w: 1.6 });
    P.text(x + w / 2, y + h / 2 + (size || 13) * 0.36, label, { size: size || 13, weight: 700 });
  }
  // 노트북
  function laptop(P, x, y, w, h, fill) {
    P.rrect(x, y, w, h, 8, { fill: fill || 'paper', w: 2 });
    P.path(`M${x - 6} ${y + h} L${x + w + 6} ${y + h} L${x + w + 12} ${y + h + 12} L${x - 12} ${y + h + 12} Z`, { fill: 'soft', gap: 5 });
  }
  // 구름
  function cloud(P, cx, cy, w, h, fill) {
    const l = cx - w / 2, r = cx + w / 2, t = cy - h / 2, b = cy + h / 2;
    P.path(`M${l + w * 0.18} ${b} Q${l} ${b} ${l + w * 0.04} ${cy + h * 0.1} Q${l + w * 0.06} ${t + h * 0.2} ${l + w * 0.28} ${t + h * 0.22} Q${l + w * 0.38} ${t} ${cx + w * 0.06} ${t + h * 0.06} Q${r - w * 0.16} ${t} ${r - w * 0.14} ${t + h * 0.34} Q${r} ${t + h * 0.36} ${r - w * 0.02} ${cy + h * 0.24} Q${r - w * 0.02} ${b} ${r - w * 0.2} ${b} Z`, { fill: fill || 'sky', gap: 6, w: 2 });
  }
  // 동전
  function coin(P, cx, cy, d, label) {
    P.circle(cx, cy, d, { fill: 'hi', fs: 'solid', w: 2 });
    P.circle(cx, cy, d * 0.74, { c: 'warm', w: 1.2 });
    if (label) P.text(cx, cy + d * 0.13, label, { size: Math.round(d * 0.34), weight: 700 });
  }
  // 자물쇠(몸통 위 가운데 = cx, cy)
  function lock(P, cx, cy, s) {
    s = s || 1;
    P.path(`M${cx - 12 * s} ${cy} L${cx - 12 * s} ${cy - 12 * s} Q${cx} ${cy - 30 * s} ${cx + 12 * s} ${cy - 12 * s} L${cx + 12 * s} ${cy}`, { w: 3 });
    P.rrect(cx - 18 * s, cy, 36 * s, 28 * s, 5, { fill: 'warm', gap: 4 });
    P.circle(cx, cy + 12 * s, 6 * s, { fill: 'ink', fs: 'solid', c: null });
  }
  // 어두운 코드 상자(글 줄). 높이를 돌려준다
  function codeBox(P, x, y, w, lines, size) {
    size = size || 11;
    const h = 16 + lines.length * (size + 6);
    P.rrect(x, y, w, h, 8, { fill: 'ink', fs: 'solid' });
    lines.forEach((t, i) => P.text(x + 10, y + 8 + size + i * (size + 6), t, { mono: true, size, anchor: 'start', c: 'paper' }));
    return h;
  }
  // 어두운 상자에 색 줄(코드 모양)
  function codeLines(P, x, y, w, h, n) {
    P.rrect(x, y, w, h, 8, { fill: 'ink', fs: 'solid' });
    const cols = ['k', 's', 'n', 't', 'k'];
    for (let i = 0; i < n; i++) P.line(x + 16, y + 24 + i * 24, x + w * 0.7 - (i % 2) * 24, y + 24 + i * 24, { c: cols[i], w: 3 });
  }
  // 돋보기
  function lens(P, cx, cy, d) {
    P.circle(cx, cy, d, { fill: 'sky', gap: 5, w: 2.4 });
    P.line(cx + d * 0.35, cy + d * 0.35, cx + d * 0.62, cy + d * 0.65, { w: 4 });
  }
  // 동그란 머리 + 얼굴
  function head(P, cx, cy, d, mood) {
    P.circle(cx, cy, d * 1.2, { fill: 'paper' });
    P.face(cx, cy + d * 0.04, d, { mood: mood || 'smile' });
  }
  // 작은 머리 여러 개(학생들)
  function crowd(P, x, y, cols, rows, gap, size) {
    const moods = ['smile', 'happy', 'wink', 'wow', 'smile', 'sleepy'];
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) head(P, x + i * gap, y + j * gap, size, moods[(i + j * cols) % moods.length]);
  }
  // 달력(위 띠 + 큰 글자)
  function calendar(P, x, y, w, h, top, big, size) {
    P.rrect(x, y, w, h, 8, { fill: 'paper', fs: 'solid' });
    P.rect(x, y, w, 22, { fill: 'bad', fs: 'solid', c: null });
    if (top) P.text(x + w / 2, y + 16, top, { size: 13, weight: 700, c: 'paper' });
    P.text(x + w / 2, y + 22 + (h - 22) / 2 + (size || 22) * 0.36, big, { size: size || 22, weight: 700 });
  }
  // 흩어진 카드(순서 문제용)
  function card(P, x, y) { P.rrect(x, y, 92, 70, 10, { fill: 'paper' }); }
  function cross(P, cx, cy, r, c) {
    P.line(cx - r, cy - r, cx + r, cy + r, { c: c || 'bad', w: 3 });
    P.line(cx + r, cy - r, cx - r, cy + r, { c: c || 'bad', w: 3 });
  }
  function tick(P, cx, cy, r) { P.path(`M${cx - r} ${cy} L${cx - r * 0.3} ${cy + r * 0.7} L${cx + r} ${cy - r * 0.7}`, { c: 'good', w: 3.2 }); }
  function ask(P, x, y, size, c) { P.text(x, y, '?', { size: size || 22, weight: 700, c: c || 'warm' }); }
  // 휴지통
  function trash(P, x, y, w, h) {
    P.path(`M${x} ${y} L${x + w} ${y} L${x + w - 5} ${y + h} L${x + 5} ${y + h} Z`, { fill: 'soft', gap: 5 });
    P.line(x - 6, y, x + w + 6, y, { w: 3 });
    P.line(x + w * 0.35, y - 8, x + w * 0.65, y - 8, { w: 3 });
  }

  /* ---------- 모의 화면에서 되풀이하는 조각 ---------- */
  const NAV = ['Home', 'Playground', { name: 'Chat', sub: true }, { name: 'Document Parse', sub: true }, 'API keys', 'Billing', { name: 'Usage', sub: true }, { name: 'Credit', sub: true }];
  const HOME = [
    { k: 'h', text: 'Home' },
    { k: 'p', text: '콘솔 첫 화면이에요. 왼쪽 메뉴에서 써 볼 기능을 골라요.' },
    { k: 'note', text: '실제 Home 화면의 구성은 바뀔 수 있어요. 메뉴 이름을 보고 찾아요.' }
  ];
  const SCENE = { win: 'web', url: 'console.upstage.ai', brand: 'Upstage Console', nav: NAV, page: 'Home', blocks: HOME };
  const Q1 = '중학교 1학년에게 알고리즘을 두 문장으로 설명해 줘.';
  const A1 = '알고리즘은 어떤 문제를 풀기 위한 순서를 차례대로 적은 거예요. 라면 끓이는 순서처럼 단계를 정해 두면 누가 해도 같은 결과를 얻을 수 있어요.';
  const CHAT_H = { k: 'h', text: 'Chat', sub: 'Playground' };
  const KEYS_H = { k: 'h', text: 'API keys', btns: ['Create new key'] };

  HANIP.unit({
    id: 'c1u1',
    course: '과정 1 · 시작',
    title: '단원 1 · 소버린 AI와 업스테이지 콘솔',
    goals: ['AI 시대 정보 교사의 세 역할로 이 과정의 길 잡기', '소버린 AI의 뜻과 장단점을 근거로 따져 보기', '업스테이지 콘솔을 둘러보고 API 키를 안전하게 만들기'],
    checked: { date: '2026-10-16' },
    sources: [
      'https://console.upstage.ai/docs/getting-started',
      'https://console.upstage.ai/docs/models',
      'https://console.upstage.ai/docs/models/history',
      'https://console.upstage.ai/docs/models/solar-mini-4',
      'https://console.upstage.ai/docs/capabilities/generate/chat',
      'https://console.upstage.ai/docs/guides/rate-limits',
      'https://console.upstage.ai/docs/resources/error-codes',
      'https://console.upstage.ai/docs/capabilities/parse/document-parsing',
      'https://console.upstage.ai/docs/capabilities/extract/universal-extraction',
      'https://console.upstage.ai/docs/capabilities/embed',
      'https://www.upstage.ai/pricing/api',
      'https://www.upstage.ai/products/studio',
      'https://www.upstage.ai/blog/en/solar-open-2',
      'https://github.com/UpstageAI/upstage-extensions-hub',
      'https://github.com/UpstageAI/Solar-Pro4-Cookbook',
      'https://www.moe.go.kr/boardCnts/viewRenew.do?boardID=294&boardSeq=105007&lev=0&m=020'
    ],

    skip: [
      { t: 'q', kind: 'mc', fig: 'k_sov', q: '<b>소버린 AI</b>를 가장 잘 설명한 것은?',
        opts: ['정부가 만들어 국민에게 무료로 나눠 주는 챗봇', '데이터·모델·인프라를 스스로 만들고 통제할 수 있는 힘', '인터넷 연결 없이 내 컴퓨터에서만 도는 AI', '외국 모델은 쓰지 않고 국산 모델만 쓰자는 규칙'], a: 1,
        why: '소버린 AI는 AI를 이루는 데이터·모델·인프라를 스스로 만들고 다룰 수 있는 힘이에요. 국산만 쓰자는 규칙이 아니라, 선택지와 통제권의 이야기예요.',
        ex: ['정부의 무료 서비스 계획은 소버린 AI를 키우는 사업 중 하나일 뿐, 뜻 자체는 아니에요.', '', '내 컴퓨터에서 돌리기는 설치 방식 이야기예요. 소버린 AI와 다른 말이에요.', '외국 모델을 쓰지 말자는 뜻이 아니에요. 중요한 곳을 스스로 통제할 수 있느냐가 핵심이에요.'] },
      { t: 'q', kind: 'mc', fig: 'k_model', q: '업스테이지 모델 이름을 코드에 적는 좋은 습관은?',
        opts: ['응답에 찍힌 버전 이름 <code>solar-pro4-260806</code>을 파일마다 적는다', '인터넷 예제에 있던 <code>solar-pro3</code>를 그대로 쓴다', '별칭 <code>solar-pro4</code>를 <code>MODEL</code> 변수 하나에 모아 둔다', '<code>model=</code>이 나오는 줄마다 이름을 직접 적어 둔다'], a: 2,
        why: '공식 안내도 버전 이름 대신 별칭을 권해요. <code>MODEL = "solar-pro4"</code>처럼 한곳에 모아 두면 모델이 바뀔 때 한 줄만 고쳐요.',
        ex: ['버전 이름을 박아 두면 낡기 쉽고, 파일마다 적으면 고칠 곳도 많아져요.', '<code>solar-pro3</code>는 2026년 10월 30일에 서비스가 끝나요.', '', '작동은 하지만 이름이 바뀌면 여러 곳을 다 찾아 고쳐야 해요.'] },
      { t: 'q', kind: 'mc', fig: 'k_key', q: '콘솔에서 만든 API 키를 연수 실습에 쓰려고 해요. 어디에 두는 게 맞을까요?',
        opts: ['연습 폴더의 <code>.env</code>에 두고 <code>.gitignore</code>에 <code>.env</code>를 적는다', '잊지 않게 코드 맨 위에 <code>KEY = "up_…"</code>로 적어 둔다', '연수 단체 채팅방에 올려 두고 필요할 때 복사한다', 'GitHub 저장소의 README에 적고 저장소를 비공개로 바꾼다'], a: 0,
        why: '키는 <code>.env</code>에만 두고, <code>.gitignore</code>로 Git에 올라가지 않게 막아요. 코드는 <code>os.environ["UPSTAGE_API_KEY"]</code>로 꺼내 써요.',
        ex: ['', '코드에 적으면 코드를 공유하거나 커밋할 때 키도 함께 퍼져요.', '채팅방에 올린 키는 누구든 복사할 수 있어요. 새어 나간 거예요.', '비공개로 바꿔도 이미 올린 기록과 복사본이 남을 수 있어요.'] }
    ],

    figs: {
      /* ---------- 이미 알아요 점검 그림 ---------- */
      k_sov: { w: 340, h: 200, label: '지구 모양 안의 로봇과 둘레의 물음표, 한 줄로 말해 보려는 얼굴', draw(P) {
        P.circle(110, 92, 120, { fill: 'sky', gap: 7 });
        P.ellipse(110, 92, 50, 120, { c: 'soft', w: 1.4 });
        P.line(50, 92, 170, 92, { c: 'soft', w: 1.4 });
        P.robot(110, 96, 0.42, { mood: 'smile' });
        P.text(110, 186, 'Sovereign AI', { size: 16, weight: 700 });
        ask(P, 34, 40, 24);
        ask(P, 190, 36, 22, 'accent');
        ask(P, 26, 150, 20, 'bad');
        person(P, 280, 196, 'wow', 0.78);
        P.bubble(220, 8, 112, 44, 262, 70);
        P.text(276, 36, '한 줄로 하면?', { size: 13, weight: 700 });
      }},
      k_model: { w: 340, h: 200, label: '여러 파일에 흩어진 model 이름과 어디에 적을지 고민하는 얼굴', draw(P) {
        doc(P, 10, 24, 76, 80, 'quiz.py', 'hi', 11);
        doc(P, 94, 24, 76, 80, 'helper.py', 'sky', 10);
        doc(P, 178, 24, 76, 80, 'app.py', 'paper', 11);
        P.text(48, 124, 'model=?', { mono: true, size: 11, c: 'warm' });
        P.text(132, 124, 'model=?', { mono: true, size: 11, c: 'warm' });
        P.text(216, 124, 'model=?', { mono: true, size: 11, c: 'warm' });
        person(P, 300, 196, 'wow', 0.66);
        P.text(130, 184, '모델 이름, 어디에 어떻게 적지?', { size: 13, c: 'ink2' });
      }},
      k_key: { w: 340, h: 200, label: '새로 만든 API 키와 폴더·말풍선·창 세 곳, 어디에 둘지 고민하는 얼굴', draw(P) {
        key(P, 40, 50, 1.1, 'hi');
        P.text(66, 88, 'up_••••7f3a', { mono: true, size: 11 });
        P.path('M130 40 L130 76 L186 76 L186 40 L155 40 L151 32 L130 32 Z', { fill: 'sky', gap: 6 });
        P.bubble(198, 26, 54, 34, 212, 70);
        win(P, 130, 92, 64, 46);
        ask(P, 226, 124, 24);
        person(P, 290, 196, 'wow', 0.74);
        P.text(120, 184, '이 키, 어디에 둘까?', { size: 14, c: 'ink2' });
      }},

      /* ---------- L1 설명 그림 ---------- */
      journey: { w: 340, h: 212, label: '코드를 직접 짜던 코딩한입, 에이전트에게 맡기던 커서한입, AI를 부품으로 넣는 업스테이지한입', draw(P) {
        P.rrect(18, 24, 74, 70, 8, { fill: 'ink', fs: 'solid' });
        P.text(55, 66, '</>', { mono: true, size: 20, weight: 700, c: 'paper' });
        P.robot(170, 62, 0.46, { mood: 'happy' });
        win(P, 236, 22, 94, 74);
        P.robot(283, 70, 0.3, { mood: 'proud' });
        P.arrow(100, 60, 138, 60, { c: 'accent', w: 2.4, head: 9 });
        P.arrow(200, 60, 230, 60, { c: 'accent', w: 2.4, head: 9 });
        P.text(55, 122, '코딩한입', { size: 14, weight: 700 });
        P.text(170, 122, '커서한입', { size: 14, weight: 700 });
        P.text(283, 122, '업스테이지한입', { size: 14, weight: 700 });
        P.text(55, 144, '코드를 직접', { size: 12, c: 'ink2' });
        P.text(170, 144, '에이전트에게', { size: 12, c: 'ink2' });
        P.text(283, 144, 'AI를 부품으로', { size: 12, c: 'ink2' });
        P.text(170, 192, '이번엔 AI를 부품으로 넣은 수업 서비스', { size: 13, c: 'accent' });
        P.sparkle(324, 196, 6, 'hi');
      }},
      threeRoles: { w: 340, h: 200, label: '도구를 만드는 렌치, 원리를 비추는 돋보기, 학생을 지키는 방패', draw(P) {
        P.line(58, 50, 58, 106, { w: 7, c: 'warm' });
        P.rrect(28, 30, 60, 24, 5, { fill: 'ink2', fs: 'solid' });
        lens(P, 164, 58, 52);
        P.text(164, 64, 'AI', { size: 16, weight: 700 });
        P.path('M282 24 L314 38 Q314 80 282 100 Q250 80 250 38 Z', { fill: 'good', gap: 6 });
        tick(P, 282, 60, 13);
        P.text(58, 132, '도구 제작자', { size: 14, weight: 700 });
        P.text(170, 132, 'AI 리터러시 안내자', { size: 14, weight: 700 });
        P.text(282, 132, '안전 책임자', { size: 14, weight: 700 });
        P.text(58, 154, '만들고', { size: 12, c: 'ink2' });
        P.text(170, 154, '안내하고', { size: 12, c: 'ink2' });
        P.text(282, 154, '지켜요', { size: 12, c: 'ink2' });
        P.text(170, 190, '셋은 한 사람의 일', { size: 13, c: 'accent' });
      }},
      ownTool: { w: 340, h: 204, label: '무엇이든 답하는 범용 채팅과 내 학습지를 근거로 답하는 내 도구', draw(P) {
        chatWin(P, 12, 16, 140, 110);
        P.text(82, 146, '범용 AI 채팅', { size: 13, weight: 700 });
        P.text(82, 166, '우리 반을 몰라요', { size: 12, c: 'ink2' });
        P.text(170, 80, 'vs', { size: 16, weight: 700, c: 'warm' });
        doc(P, 186, 26, 60, 76, '학습지', 'hi', 11);
        P.arrow(250, 64, 270, 64, { c: 'accent', w: 2.2, head: 7 });
        P.robot(298, 70, 0.4, { mood: 'happy' });
        P.text(258, 146, '내가 만든 도구', { size: 13, weight: 700 });
        P.text(258, 166, '내 자료·내 규칙대로', { size: 12, c: 'ink2' });
        P.text(170, 196, '빈 곳만 작게 만들어 채워요', { size: 13, c: 'accent' });
      }},
      roadmap: { w: 340, h: 212, label: '과정 1부터 과정 5까지 오르는 징검다리와 자라는 upstage-lab 폴더', draw(P) {
        P.path('M14 26 L14 58 L78 58 L78 26 L42 26 L38 18 L14 18 Z', { fill: 'hi', gap: 6 });
        P.text(86, 44, 'upstage-lab이 자라요', { size: 12, anchor: 'start' });
        const names = ['시작', '자료→데이터', '수업도구', '연수 트랙', '에이전트·대회'];
        P.path('M10 140 Q90 128 170 140 Q250 152 330 140', { c: 'sky', w: 10 });
        names.forEach((nm, i) => {
          const x = 38 + i * 66, y = 128 + (i % 2) * 6;
          P.ellipse(x, y, 54, 26, { fill: i === 0 ? 'hi' : 'paper', fs: 'solid', w: 1.8 });
          P.text(x, y + 4, '과정 ' + (i + 1), { size: 11, weight: 700 });
          P.text(x, y + 32, nm, { size: 11, c: 'ink2' });
          if (i < 4) P.arrow(x + 22, y - 22, x + 44, y - 22, { c: 'soft', w: 1.6, head: 6 });
        });
        head(P, 38, 92, 26, 'happy');
        P.text(170, 204, '연수 15차시와 나란히 가요', { size: 13, c: 'accent' });
      }},

      /* ---------- L1 문제 그림 ---------- */
      q_roleLit: { w: 340, h: 200, label: '칠판에 적힌 AI의 틀린 계산과 이야기하는 교사와 학생들', draw(P) {
        P.rrect(14, 14, 190, 104, 8, { fill: 'good', gap: 8 });
        P.text(109, 56, '17 × 24 = 418 ?', { size: 16, weight: 700 });
        P.text(109, 94, '왜 틀렸을까?', { size: 14 });
        P.robot(240, 64, 0.4, { mood: 'proud' });
        person(P, 300, 196, 'smile', 0.62);
        head(P, 40, 158, 30, 'wow');
        head(P, 90, 164, 30, 'smile');
        head(P, 140, 158, 30, 'wink');
        head(P, 190, 164, 30, 'happy');
      }},
      q_roleSafe: { w: 340, h: 200, label: '학생 서른 명과 질문 도우미 로봇, 무엇을 챙길지 고민하는 교사', draw(P) {
        crowd(P, 20, 40, 5, 3, 26, 20);
        P.text(72, 140, '30명', { size: 14, weight: 700 });
        P.arrow(140, 80, 186, 80, { c: 'accent', w: 2.2, head: 8 });
        P.robot(222, 80, 0.44, { mood: 'smile' });
        person(P, 300, 196, 'wow', 0.62);
        ask(P, 300, 96, 20);
        P.text(150, 186, '무엇을 챙겨야 할까?', { size: 13, c: 'ink2' });
      }},
      q_route: { w: 340, h: 200, label: '뒤섞인 카드: 콘솔 창, 문서, 로봇, 트로피', draw(P) {
        card(P, 14, 16);
        consoleWin(P, 22, 24, 76, 52, 0);
        card(P, 126, 52);
        doc(P, 150, 58, 44, 58, null, 'hi');
        card(P, 238, 14);
        P.robot(284, 52, 0.3, { mood: 'happy' });
        card(P, 56, 116);
        P.path('M86 126 L126 126 L122 148 Q106 160 90 148 Z', { fill: 'hi', gap: 5 });
        P.line(106, 156, 106, 168, { w: 3 });
        P.line(94, 172, 118, 172, { w: 3 });
        head(P, 262, 150, 34, 'wow');
        ask(P, 116, 40, 22, 'warm');
        ask(P, 226, 112, 22, 'bad');
        ask(P, 30, 110, 20, 'accent');
      }},
      q_whyOwn: { w: 340, h: 200, label: '범용 채팅 창과 내 도구 상자 사이에서 고민하는 얼굴', draw(P) {
        chatWin(P, 12, 20, 120, 96);
        P.rrect(160, 56, 90, 60, 8, { fill: 'warm', gap: 6 });
        P.path('M185 56 L185 44 L225 44 L225 56', { w: 3 });
        P.text(205, 94, '내 도구', { size: 13, weight: 700 });
        person(P, 296, 196, 'wow', 0.66);
        ask(P, 296, 100, 22);
        P.text(130, 172, '언제 직접 만들까?', { size: 14, c: 'ink2' });
      }},

      /* ---------- L2 설명 그림 ---------- */
      sovLayers: { w: 340, h: 212, label: '데이터, 모델, 인프라 세 층을 스스로 다루는 사람', draw(P) {
        P.rrect(40, 20, 180, 40, 8, { fill: 'hi', gap: 6 });
        P.rrect(40, 70, 180, 40, 8, { fill: 'sky', gap: 6 });
        P.rrect(40, 120, 180, 40, 8, { fill: 'good', gap: 6 });
        P.note(50, 26, 22, 28, { fill: 'paper' });
        P.robot(64, 94, 0.2, { mood: 'smile' });
        P.rrect(50, 126, 24, 28, 3, { fill: 'paper', fs: 'solid', w: 1.4 });
        P.line(50, 136, 74, 136, { w: 1.2 });
        P.line(50, 145, 74, 145, { w: 1.2 });
        P.text(140, 46, '데이터', { size: 15, weight: 700 });
        P.text(140, 96, '모델', { size: 15, weight: 700 });
        P.text(140, 146, '인프라', { size: 15, weight: 700 });
        P.text(282, 40, '스스로', { size: 14, weight: 700, c: 'accent' });
        P.text(282, 60, '다룰 수 있는 힘', { size: 13, c: 'accent' });
        P.curveArrow(254, 126, 236, 100, 226, 70, { c: 'accent', w: 2, head: 8 });
        person(P, 290, 196, 'proud', 0.72);
        P.text(130, 190, '국산만이 아니라 선택지와 통제권', { size: 13, c: 'ink2' });
      }},
      stagePlan: { w: 340, h: 200, label: '다섯 팀에서 단계평가를 거쳐 최종 두 팀으로 줄어드는 계단', draw(P) {
        P.text(170, 18, '단계평가로 줄여 가요', { size: 13, weight: 700 });
        P.rrect(14, 30, 62, 92, 8, { c: 'soft', w: 1.6 });
        [[30, 52], [60, 52], [30, 76], [60, 76], [45, 100]].forEach(([x, y]) => P.circle(x, y, 16, { fill: 'sky', fs: 'solid', w: 1.2 }));
        P.rrect(94, 42, 62, 80, 8, { c: 'soft', w: 1.6 });
        [[110, 62], [140, 62], [110, 90]].forEach(([x, y]) => P.circle(x, y, 16, { fill: 'sky', fs: 'solid', w: 1.2 }));
        P.circle(140, 90, 16, { fill: 'warm', fs: 'solid', w: 1.2 });
        P.rrect(174, 54, 62, 68, 8, { c: 'soft', w: 1.6 });
        [[190, 74], [220, 74], [205, 100]].forEach(([x, y]) => P.circle(x, y, 16, { fill: 'sky', fs: 'solid', w: 1.2 }));
        P.rrect(256, 66, 70, 56, 8, { c: 'accent', w: 1.6 });
        P.circle(276, 86, 16, { fill: 'good', gap: 4, w: 1.2 });
        P.circle(306, 86, 16, { fill: 'good', gap: 4, w: 1.2 });
        P.text(291, 114, '?', { size: 14, weight: 700, c: 'warm' });
        P.arrow(78, 76, 92, 76, { c: 'accent', w: 2, head: 6 });
        P.arrow(158, 84, 172, 84, { c: 'accent', w: 2, head: 6 });
        P.arrow(238, 92, 254, 92, { c: 'accent', w: 2, head: 6 });
        P.text(45, 142, '출발 5팀', { size: 11, weight: 700 });
        P.text(125, 142, '2차 단계 4팀', { size: 11, weight: 700 });
        P.text(205, 142, '3차 단계 3팀', { size: 11, weight: 700 });
        P.text(291, 142, '최종 2팀(계획)', { size: 11, weight: 700 });
        P.text(170, 186, '2026년 10월 기준 · 방식은 바뀔 수 있어요', { size: 12, c: 'ink2' });
      }},
      openVsApi: { w: 340, h: 204, label: '누구나 내려받는 공개 모델과 인터넷으로 불러 쓰는 API 모델', draw(P) {
        P.rrect(24, 22, 100, 72, 10, { fill: 'hi', gap: 6 });
        P.text(74, 54, 'Solar Open', { size: 14, weight: 700 });
        P.text(74, 78, '가중치 공개', { size: 12 });
        P.arrow(74, 98, 74, 128, { c: 'accent', w: 2.4, head: 9 });
        P.rrect(44, 134, 60, 34, 6, { fill: 'sky', gap: 6 });
        P.line(44, 151, 104, 151, { w: 1.2 });
        P.text(74, 194, '내려받아 직접 돌려요', { size: 12, c: 'ink2' });
        cloud(P, 250, 56, 150, 72, 'sky');
        P.text(250, 62, 'solar-pro4', { mono: true, size: 13, weight: 700 });
        P.arrow(236, 124, 236, 100, { c: 'accent', w: 2, head: 7 });
        P.arrow(264, 100, 264, 124, { c: 'good', w: 2, head: 7 });
        win(P, 214, 128, 72, 44);
        P.text(250, 194, 'API로 불러 써요', { size: 12, c: 'ink2' });
      }},
      balance: { w: 340, h: 200, label: '기대할 점과 한계를 저울에 올려 보는 교사', draw(P) {
        P.line(130, 60, 130, 170, { w: 3 });
        P.line(100, 172, 160, 172, { w: 3 });
        P.line(40, 60, 220, 60, { w: 3 });
        P.circle(130, 60, 10, { fill: 'ink', fs: 'solid', c: null });
        P.line(40, 60, 22, 100, { w: 1.6 });
        P.line(40, 60, 58, 100, { w: 1.6 });
        P.path('M14 100 Q40 118 66 100 Z', { fill: 'good', gap: 5 });
        P.line(220, 60, 202, 100, { w: 1.6 });
        P.line(220, 60, 238, 100, { w: 1.6 });
        P.path('M194 100 Q220 118 246 100 Z', { fill: 'warm', gap: 5 });
        P.text(40, 140, '기대할 점', { size: 13, weight: 700, c: 'good' });
        P.text(220, 140, '한계', { size: 13, weight: 700, c: 'warm' });
        P.text(40, 160, '한국어·데이터', { size: 11, c: 'ink2' });
        P.text(220, 160, '국산≠저절로 안전', { size: 11, c: 'ink2' });
        P.text(296, 40, '판단은', { size: 13, weight: 700, c: 'accent' });
        P.text(296, 60, '교사가', { size: 13, weight: 700, c: 'accent' });
        person(P, 296, 196, 'smile', 0.66);
      }},

      /* ---------- L2 문제 그림 ---------- */
      q_finetune: { w: 340, h: 200, label: '해외 공개 모델에 한국어 자료를 더해 미세조정한 새 모델과 물음표 도장', draw(P) {
        P.robot(60, 80, 0.5, { mood: 'smile' });
        P.text(60, 142, '해외 공개 모델', { size: 12, weight: 700 });
        doc(P, 108, 50, 50, 60, null, 'hi');
        P.text(133, 126, '한국어 자료', { size: 11 });
        P.arrow(166, 84, 204, 84, { c: 'accent', w: 2.4, head: 8 });
        P.text(185, 72, '미세조정', { size: 11, c: 'accent' });
        P.robot(244, 84, 0.5, { mood: 'proud' });
        P.text(244, 142, '새 모델', { size: 12, weight: 700 });
        P.circle(298, 34, 46, { c: 'bad', w: 2 });
        P.text(298, 40, '독자?', { size: 14, weight: 700, c: 'bad' });
        P.text(170, 186, '독자 모델로 인정될까?', { size: 14, c: 'ink2' });
      }},
      q_privacy: { w: 340, h: 200, label: '학생 이름과 성적 목록을 AI에 넣으려는 동료와 걱정하는 얼굴', draw(P) {
        P.note(20, 30, 90, 110, { fill: 'paper' });
        P.text(65, 58, '이름 · 성적', { size: 12, weight: 700 });
        [80, 96, 112, 128].forEach(y => P.line(32, y, 96, y, { c: 'soft', w: 2 }));
        P.arrow(116, 84, 160, 84, { c: 'warm', w: 2.2, head: 8 });
        P.robot(196, 84, 0.42, { mood: 'smile' });
        P.bubble(224, 8, 112, 54, 270, 80);
        P.text(280, 30, '국산이니까', { size: 12, weight: 700 });
        P.text(280, 50, '괜찮겠죠?', { size: 12, weight: 700 });
        person(P, 296, 196, 'happy', 0.62);
        P.text(120, 186, '정말 괜찮을까?', { size: 13, c: 'ink2' });
      }},
      q_stage: { w: 340, h: 200, label: '국가 프로젝트 현황을 적은 수업 자료와 10월 달력, 기준 시점을 묻는 물음표', draw(P) {
        doc(P, 20, 20, 150, 140, '수업 자료', 'paper', 12);
        P.text(95, 128, '현재 3팀 경쟁 중', { size: 12, weight: 700, c: 'accent' });
        calendar(P, 204, 24, 90, 84, '2026', '10월', 22);
        head(P, 262, 150, 30, 'wink');
        ask(P, 312, 136, 24);
        P.text(170, 190, '언제 기준일까?', { size: 13, c: 'ink2' });
      }},
      q_claims: { w: 340, h: 200, label: '네 줄짜리 연수 메모를 돋보기로 살피는 얼굴', draw(P) {
        P.note(24, 20, 170, 150, { fill: 'hi' });
        [52, 82, 112, 142].forEach(y => P.line(44, y, 170, y, { c: 'ink2', w: 2.4 }));
        lens(P, 200, 120, 56);
        person(P, 294, 196, 'wow', 0.62);
        P.text(284, 60, '어느 줄?', { size: 14, weight: 700, c: 'warm' });
      }},

      /* ---------- QA 그림 ---------- */
      qa_openLocal: { w: 340, h: 200, label: '공개 모델 파일을 학교 노트북으로 내려받으려는 화살표와 물음표', draw(P) {
        P.rrect(20, 24, 110, 80, 10, { fill: 'hi', gap: 6 });
        P.text(75, 58, 'Solar Open 2', { size: 14, weight: 700 });
        P.text(75, 82, '가중치 공개', { size: 12 });
        P.curveArrow(134, 64, 186, 50, 220, 100, { c: 'accent', w: 2.4, head: 9 });
        laptop(P, 222, 106, 90, 56, 'paper');
        ask(P, 267, 142, 26);
        P.text(100, 186, '학교 노트북에서 바로?', { size: 14, c: 'ink2' });
      }},
      qa_chatApi: { w: 340, h: 200, label: '사람이 직접 쓰는 웹 채팅 창과 코드가 키를 들고 부르는 API', draw(P) {
        chatWin(P, 12, 18, 130, 100);
        head(P, 77, 146, 30, 'smile');
        P.text(77, 190, '사람이 화면에서', { size: 12, weight: 700 });
        P.text(170, 80, 'vs', { size: 16, weight: 700, c: 'warm' });
        codeBox(P, 196, 22, 134, ['MODEL = "solar-pro4"', 'ask(MODEL, q)'], 10);
        key(P, 214, 104, 0.8, 'hi');
        P.arrow(260, 104, 296, 104, { c: 'accent', w: 2.2, head: 8 });
        P.text(316, 109, 'API', { size: 12, weight: 700, c: 'accent' });
        P.text(262, 190, '코드가 키를 들고', { size: 12, weight: 700 });
      }},
      qa_modelService: { w: 340, h: 200, label: 'solar-pro4 모델 로봇과 Playground 화면 사이의 등호와 물음표', draw(P) {
        P.robot(70, 84, 0.56, { mood: 'happy' });
        P.text(70, 150, 'solar-pro4', { mono: true, size: 13, weight: 700 });
        ask(P, 160, 60, 22);
        P.text(160, 96, '=', { size: 28, weight: 700, c: 'warm' });
        consoleWin(P, 200, 30, 130, 100, 1);
        P.text(265, 150, 'Playground', { size: 13, weight: 700 });
        P.text(170, 188, '같은 걸까?', { size: 14, c: 'ink2' });
      }},

      /* ---------- L3 설명 그림 ---------- */
      family: { w: 340, h: 176, label: 'Solar 말풍선, 문서를 Markdown으로, 칸 채우기, 숫자 목록의 네 갈래', draw(P) {
        P.bubble(18, 30, 54, 40, 30, 84);
        P.text(45, 55, 'Solar', { size: 12, weight: 700 });
        doc(P, 98, 26, 38, 50, null, 'paper');
        P.arrow(140, 50, 152, 50, { c: 'accent', w: 2, head: 6 });
        P.text(161, 56, '#', { mono: true, size: 16, weight: 700, c: 'accent' });
        P.rrect(186, 26, 50, 56, 6, { fill: 'paper', fs: 'solid' });
        P.rrect(192, 34, 38, 10, 3, { c: 'soft', w: 1.2 });
        P.rrect(192, 50, 38, 10, 3, { fill: 'hi', fs: 'solid', w: 1.2 });
        P.rrect(192, 66, 38, 10, 3, { c: 'soft', w: 1.2 });
        P.text(294, 50, '[0.12,', { mono: true, size: 11 });
        P.text(294, 66, ' 0.87, …]', { mono: true, size: 11 });
        P.text(45, 112, 'Solar LLM', { size: 11, weight: 700 });
        P.text(128, 112, 'Document', { size: 11, weight: 700 });
        P.text(128, 126, 'Parse', { size: 11, weight: 700 });
        P.text(211, 112, 'Information', { size: 11, weight: 700 });
        P.text(211, 126, 'Extract', { size: 11, weight: 700 });
        P.text(294, 112, '임베딩', { size: 11, weight: 700 });
        P.text(170, 160, '모두 콘솔 API 하나로 불러요', { size: 13, c: 'accent' });
      }},
      proMini: { w: 340, h: 200, label: '큰 로봇 solar-pro4와 작고 날쌘 로봇 solar-mini4', draw(P) {
        P.robot(90, 92, 0.8, { mood: 'proud' });
        P.robot(250, 110, 0.5, { mood: 'happy' });
        P.line(198, 100, 214, 100, { c: 'soft', w: 2 });
        P.line(194, 116, 212, 116, { c: 'soft', w: 2 });
        P.line(198, 132, 214, 132, { c: 'soft', w: 2 });
        P.text(90, 168, 'solar-pro4', { mono: true, size: 14, weight: 700 });
        P.text(250, 168, 'solar-mini4', { mono: true, size: 14, weight: 700 });
        P.text(90, 190, '대표 · 어려운 일', { size: 12, c: 'ink2' });
        P.text(250, 190, '가볍고 싸게', { size: 12, c: 'ink2' });
      }},
      aliasFig: { w: 340, h: 190, label: '별칭 solar-pro4 이름표가 날짜가 붙은 버전 상자를 가리키는 모습', draw(P) {
        P.rrect(14, 40, 120, 40, 20, { fill: 'hi', gap: 5 });
        P.circle(30, 60, 8, { fill: 'paper', fs: 'solid' });
        P.text(82, 65, 'solar-pro4', { mono: true, size: 13, weight: 700 });
        P.text(74, 104, '별칭(코드에 써요)', { size: 12, c: 'accent' });
        P.arrow(140, 60, 186, 60, { c: 'accent', w: 2.6, head: 9 });
        P.rrect(192, 36, 136, 48, 8, { fill: 'sky', gap: 6 });
        P.text(260, 65, 'solar-pro4-260806', { mono: true, size: 12, weight: 700 });
        P.text(260, 104, '지금 가리키는 버전', { size: 12, c: 'ink2' });
        P.rrect(212, 128, 96, 34, 8, { c: 'soft', w: 1.4 });
        P.text(260, 150, '다음 버전?', { size: 12, c: 'soft' });
        P.curveArrow(138, 74, 172, 140, 208, 145, { c: 'soft', w: 1.8, head: 8 });
        P.text(80, 172, '260806 = 2026-08-06', { mono: true, size: 11, c: 'ink2' });
      }},
      retire: { w: 340, h: 176, label: '10월 30일 달력 앞에서 끝나는 옛 모델 이름표와 새 이름표', draw(P) {
        calendar(P, 14, 24, 90, 92, '2026', '10.30', 24);
        P.text(59, 136, '한국 시간', { size: 11, c: 'ink2' });
        chip(P, 120, 24, 100, 26, 'solar-pro3', 'soft', 12);
        chip(P, 120, 58, 100, 26, 'solar-pro2', 'soft', 12);
        chip(P, 120, 92, 100, 26, 'solar-mini', 'soft', 12);
        [37, 71, 105].forEach(y => P.line(124, y, 216, y, { c: 'bad', w: 2.4 }));
        P.arrow(228, 72, 252, 72, { c: 'accent', w: 2.4, head: 8 });
        chip(P, 256, 40, 76, 28, 'solar-pro4', 'good', 12);
        chip(P, 256, 80, 76, 28, 'solar-mini4', 'good', 12);
        P.text(200, 156, '옛 예제는 이름부터 확인', { size: 13, c: 'accent' });
      }},

      /* ---------- L3 문제 그림 ---------- */
      q_alias: { w: 340, h: 200, label: '코드에 쓴 이름과 응답에 찍힌 이름 사이의 물음표', draw(P) {
        codeBox(P, 14, 30, 150, ['MODEL = "solar-pro4"'], 11);
        P.text(89, 90, '내가 쓴 이름', { size: 12, weight: 700 });
        ask(P, 177, 76, 26);
        P.note(190, 24, 140, 80, { fill: 'sky' });
        P.text(198, 52, '"model":', { mono: true, size: 11, anchor: 'start' });
        P.text(198, 74, '"solar-pro4-260806"', { mono: true, size: 10, anchor: 'start' });
        P.text(260, 124, '응답에 찍힌 이름', { size: 12, weight: 700 });
        head(P, 170, 162, 34, 'wow');
      }},
      q_pickDP: { w: 340, h: 200, label: '표가 든 학습지 PDF와 Markdown 쪽지 사이의 물음표 상자', draw(P) {
        P.note(20, 24, 100, 130, { fill: 'paper' });
        P.text(70, 48, 'PDF', { size: 14, weight: 700, c: 'bad' });
        P.rect(32, 62, 76, 50, { c: 'ink2', w: 1.4 });
        P.line(32, 79, 108, 79, { w: 1.2 });
        P.line(32, 96, 108, 96, { w: 1.2 });
        P.line(70, 62, 70, 112, { w: 1.2 });
        P.line(32, 128, 100, 128, { c: 'soft', w: 2 });
        P.line(32, 140, 88, 140, { c: 'soft', w: 2 });
        P.arrow(126, 90, 150, 90, { c: 'accent', w: 2.2, head: 7 });
        P.rrect(154, 62, 52, 56, 10, { fill: 'hi', gap: 5 });
        P.text(180, 99, '?', { size: 26, weight: 700, c: 'warm' });
        P.arrow(210, 90, 232, 90, { c: 'accent', w: 2.2, head: 7 });
        P.note(236, 34, 92, 112, { fill: 'sky' });
        P.text(246, 62, '# 단원 3', { mono: true, size: 11, anchor: 'start' });
        P.text(246, 84, '| 번호 | 답 |', { mono: true, size: 10, anchor: 'start' });
        P.text(246, 104, '|---|---|', { mono: true, size: 10, anchor: 'start' });
        P.text(170, 186, '어느 제품이 할까?', { size: 14, c: 'ink2' });
      }},
      q_twoJobs: { w: 340, h: 190, label: '쪽지 500장 더미와 높은 산, 각각 어느 모델을 고를지 묻는 물음표', draw(P) {
        for (let i = 0; i < 4; i++) P.note(20 + i * 6, 40 - i * 6, 70, 54, { fill: i % 2 ? 'paper' : 'hi' });
        P.text(64, 118, '500개', { size: 14, weight: 700 });
        P.text(64, 138, '짧은 분류', { size: 12, c: 'ink2' });
        P.path('M180 110 L232 30 L258 70 L274 52 L320 110 Z', { fill: 'sky', gap: 6 });
        P.line(232, 30, 232, 14, { w: 2 });
        P.path('M232 14 L246 19 L232 24 Z', { fill: 'bad', fs: 'solid' });
        P.text(250, 138, '여러 단계 문제', { size: 12, c: 'ink2' });
        ask(P, 64, 172, 24);
        ask(P, 250, 172, 24);
      }},
      q_oldEx: { w: 340, h: 200, label: '11월 달력 옆, solar-pro3가 적힌 예제 코드를 보고 놀란 얼굴', draw(P) {
        win(P, 12, 14, 200, 120);
        P.text(24, 58, 'model=', { mono: true, size: 12, anchor: 'start' });
        P.text(24, 78, '"solar-pro3"', { mono: true, size: 12, anchor: 'start', c: 'bad' });
        P.line(24, 100, 180, 100, { c: 'soft', w: 3 });
        P.line(24, 116, 150, 116, { c: 'soft', w: 3 });
        calendar(P, 232, 18, 70, 64, '2026', '11월', 18);
        person(P, 280, 196, 'wow', 0.66);
        P.text(112, 170, '인터넷에서 찾은 예제', { size: 13, c: 'ink2' });
      }},
      q_constLine: { w: 340, h: 200, label: '설정 파일 네 줄과 돋보기, 고칠 줄을 찾는 얼굴', draw(P) {
        codeLines(P, 14, 24, 190, 120, 4);
        lens(P, 196, 128, 56);
        person(P, 296, 196, 'wow', 0.62);
        P.text(290, 56, '어느 줄?', { size: 14, weight: 700, c: 'warm' });
      }},

      /* ---------- L4 설명 그림 ---------- */
      consoleMap: { w: 340, h: 208, label: '콘솔 창 왼쪽에 Home, Playground, API keys, Billing 메뉴', draw(P) {
        win(P, 12, 10, 316, 172);
        P.line(120, 32, 120, 182, { w: 1.4 });
        P.text(22, 50, 'Upstage Console', { size: 11, weight: 700, anchor: 'start' });
        P.rrect(20, 62, 92, 20, 5, { fill: 'accent', gap: 4, w: 1.2 });
        P.text(28, 76, 'Home', { size: 12, anchor: 'start' });
        P.text(28, 100, 'Playground', { size: 12, anchor: 'start' });
        P.text(42, 120, 'Chat', { size: 11, anchor: 'start', c: 'ink2' });
        P.text(28, 144, 'API keys', { size: 12, anchor: 'start' });
        P.text(28, 168, 'Billing', { size: 12, anchor: 'start' });
        P.text(224, 58, 'console.upstage.ai', { mono: true, size: 11, c: 'ink2' });
        P.rrect(140, 74, 170, 16, 6, { c: 'soft', w: 1.4 });
        P.rrect(170, 98, 140, 16, 6, { fill: 'sky', gap: 4, w: 1.2 });
        key(P, 156, 146, 0.7, 'hi');
        coin(P, 236, 146, 30, '$');
        P.robot(292, 146, 0.24, { mood: 'happy' });
        P.text(170, 200, '영어 메뉴, 뜻만 알면 돼요', { size: 13, c: 'accent' });
      }},
      credit10: { w: 340, h: 200, label: '가입 선물 상자에서 나온 10달러 동전과 쓴 만큼 줄어드는 막대', draw(P) {
        P.rrect(20, 70, 90, 70, 6, { fill: 'pink', gap: 6 });
        P.rect(58, 70, 14, 70, { fill: 'bad', fs: 'solid', c: null });
        P.rrect(14, 56, 102, 18, 4, { fill: 'pink', gap: 5 });
        P.ellipse(52, 48, 26, 14, { c: 'bad', w: 2 });
        P.ellipse(78, 48, 26, 14, { c: 'bad', w: 2 });
        coin(P, 170, 80, 64, '$10');
        P.rrect(220, 62, 104, 22, 8, { c: 'ink', w: 1.6 });
        P.rrect(222, 64, 70, 18, 6, { fill: 'good', fs: 'solid', c: null });
        P.text(272, 108, '쓴 만큼 줄어요', { size: 12, c: 'ink2' });
        P.text(170, 168, '새 계정 무료 크레딧', { size: 13, weight: 700 });
        P.text(170, 188, '2026년 10월 기준', { size: 11, c: 'ink2' });
      }},
      pgFig: { w: 340, h: 200, label: '콘솔 Playground에서 코드 없이 질문을 주고받는 교사', draw(P) {
        consoleWin(P, 12, 12, 220, 150, 1);
        P.rrect(140, 50, 84, 18, 6, { fill: 'sky', gap: 4, w: 1.2 });
        P.text(182, 64, '중1에게?', { size: 11 });
        P.rrect(88, 78, 110, 34, 6, { c: 'soft', w: 1.4 });
        P.rrect(88, 136, 136, 18, 5, { c: 'accent', w: 1.4 });
        person(P, 290, 196, 'happy', 0.72);
        P.text(286, 46, '코드 없이', { size: 14, weight: 700, c: 'accent' });
        P.text(286, 68, '먼저 물어봐요', { size: 13, c: 'accent' });
        P.text(122, 190, 'Playground → Chat', { size: 13, weight: 700 });
      }},
      rateFig: { w: 340, h: 190, label: 'Usage 막대그래프, Credit 동전, 한꺼번에 몰려 429가 뜬 표지판', draw(P) {
        P.rect(24, 90, 18, 40, { fill: 'sky', gap: 4, w: 1.4 });
        P.rect(48, 70, 18, 60, { fill: 'sky', gap: 4, w: 1.4 });
        P.rect(72, 100, 18, 30, { fill: 'sky', gap: 4, w: 1.4 });
        P.rect(96, 60, 18, 70, { fill: 'sky', gap: 4, w: 1.4 });
        P.line(18, 130, 120, 130, { w: 2 });
        P.text(69, 152, 'Usage', { size: 14, weight: 700 });
        P.text(69, 172, '얼마나 썼나', { size: 12, c: 'ink2' });
        coin(P, 166, 84, 52, '$');
        coin(P, 190, 108, 40);
        P.text(176, 152, 'Credit', { size: 14, weight: 700 });
        P.text(176, 172, '얼마 남았나', { size: 12, c: 'ink2' });
        P.circle(282, 84, 72, { fill: 'bad', gap: 6 });
        P.text(282, 92, '429', { size: 22, weight: 700 });
        P.text(282, 152, '속도 제한', { size: 14, weight: 700 });
        P.text(282, 172, '1분에 너무 많이', { size: 12, c: 'ink2' });
      }},

      /* ---------- L4 문제 그림 ---------- */
      q_429: { w: 340, h: 180, label: '학생 서른 명의 화살표가 열쇠 하나로 몰려 어지러운 로봇', draw(P) {
        crowd(P, 20, 36, 4, 3, 28, 22);
        P.text(62, 140, '30명', { size: 13, weight: 700 });
        P.arrow(124, 50, 170, 84, { c: 'soft', w: 1.8, head: 7 });
        P.arrow(124, 92, 170, 92, { c: 'soft', w: 1.8, head: 7 });
        P.arrow(124, 128, 170, 100, { c: 'soft', w: 1.8, head: 7 });
        key(P, 186, 92, 0.9, 'hi');
        P.robot(284, 96, 0.48, { mood: 'dizzy' });
        P.text(318, 52, '!', { size: 22, weight: 700, c: 'bad' });
        P.text(180, 166, '수업 시작과 동시에 한꺼번에', { size: 13, c: 'ink2' });
      }},
      q_creditOut: { w: 340, h: 200, label: '0달러가 된 동전과 등록해 둔 결제 카드 사이의 물음표', draw(P) {
        coin(P, 70, 80, 70, '$0');
        P.text(70, 140, '무료 크레딧 끝', { size: 13, weight: 700 });
        P.arrow(116, 80, 190, 80, { c: 'soft', w: 2, head: 8 });
        ask(P, 152, 68, 26);
        P.rrect(200, 50, 110, 70, 10, { fill: 'sky', gap: 6 });
        P.rect(200, 66, 110, 14, { fill: 'ink', fs: 'solid', c: null });
        P.rrect(212, 92, 30, 18, 3, { fill: 'hi', fs: 'solid', w: 1.2 });
        P.text(255, 140, '등록한 카드', { size: 13, weight: 700 });
        P.text(170, 182, '다음 호출은 어떻게 될까?', { size: 13, c: 'ink2' });
      }},
      q_pgBlank: { w: 340, h: 200, label: '콘솔 메뉴의 빈칸과 수업 질문 말풍선', draw(P) {
        P.rrect(20, 16, 120, 164, 10, { fill: 'paper', fs: 'solid' });
        P.text(36, 46, 'Home', { size: 12, anchor: 'start' });
        P.rrect(30, 58, 100, 24, 6, { c: 'accent', w: 1.8 });
        P.text(80, 75, '? ? ?', { size: 13, weight: 700, c: 'warm' });
        P.text(48, 102, 'Chat', { size: 11, anchor: 'start', c: 'ink2' });
        P.text(36, 132, 'API keys', { size: 12, anchor: 'start' });
        P.text(36, 160, 'Billing', { size: 12, anchor: 'start' });
        P.bubble(166, 24, 160, 50, 208, 96);
        P.text(246, 55, '알고리즘이 뭐예요?', { size: 12 });
        person(P, 232, 196, 'smile', 0.7);
      }},

      /* ---------- QB 그림 ---------- */
      qb_keyPw: { w: 340, h: 200, label: '콘솔에 들어가는 비밀번호 자물쇠와 프로그램이 쓰는 API 키', draw(P) {
        lock(P, 70, 72, 1.4);
        P.text(70, 140, '로그인 비밀번호', { size: 13, weight: 700 });
        P.text(70, 160, '사람이 콘솔에', { size: 12, c: 'ink2' });
        ask(P, 170, 50, 20);
        P.text(170, 92, '≠', { size: 30, weight: 700, c: 'warm' });
        key(P, 236, 82, 1.3, 'hi');
        P.text(270, 140, 'API 키', { size: 13, weight: 700 });
        P.text(270, 160, '프로그램이 API에', { size: 12, c: 'ink2' });
        P.text(170, 190, '무엇이 새면 위험할까?', { size: 13, c: 'ink2' });
      }},
      qb_usageCredit: { w: 340, h: 190, label: 'Billing 아래 막대그래프 칸과 동전 칸, 이름표가 비어 있는 두 칸', draw(P) {
        P.text(170, 24, 'Billing', { size: 15, weight: 700 });
        P.rrect(30, 40, 120, 110, 10, { fill: 'paper', fs: 'solid' });
        P.rect(48, 92, 14, 24, { fill: 'sky', gap: 4, w: 1.2 });
        P.rect(68, 72, 14, 44, { fill: 'sky', gap: 4, w: 1.2 });
        P.rect(88, 84, 14, 32, { fill: 'sky', gap: 4, w: 1.2 });
        P.rect(108, 64, 14, 52, { fill: 'sky', gap: 4, w: 1.2 });
        P.rrect(46, 122, 88, 20, 5, { c: 'accent', w: 1.6 });
        P.text(90, 137, '[ 1 ]', { size: 12, weight: 700, c: 'accent' });
        P.rrect(190, 40, 120, 110, 10, { fill: 'paper', fs: 'solid' });
        coin(P, 236, 80, 44, '$');
        coin(P, 270, 96, 34);
        P.rrect(206, 122, 88, 20, 5, { c: 'accent', w: 1.6 });
        P.text(250, 137, '[ 2 ]', { size: 12, weight: 700, c: 'accent' });
        P.text(170, 178, '쓴 양과 남은 양', { size: 13, c: 'ink2' });
      }},
      qb_pgApi: { w: 340, h: 190, label: 'Playground 화면 하나와 학생 서른 명 사이를 잇는 방법을 묻는 물음표', draw(P) {
        consoleWin(P, 12, 20, 140, 110, 1);
        P.text(82, 152, 'Playground', { size: 13, weight: 700 });
        P.text(82, 172, '내가 시험한 곳', { size: 12, c: 'ink2' });
        ask(P, 182, 84, 28);
        crowd(P, 220, 40, 4, 3, 28, 22);
        P.text(262, 152, '학생 30명', { size: 13, weight: 700 });
        P.text(262, 172, '어떻게 쓰게 할까?', { size: 12, c: 'ink2' });
      }},

      /* ---------- L5 설명 그림 ---------- */
      keyDoor: { w: 340, h: 200, label: 'up_로 시작하는 열쇠로 API 문을 열면 내 크레딧 동전이 줄어드는 모습', draw(P) {
        key(P, 40, 70, 1.3, 'hi');
        P.text(66, 112, 'up_••••••7f3a', { mono: true, size: 11 });
        P.arrow(108, 70, 136, 70, { c: 'accent', w: 2.4, head: 8 });
        P.rrect(140, 24, 70, 110, 6, { fill: 'warm', gap: 6 });
        P.circle(196, 82, 8, { fill: 'ink', fs: 'solid', c: null });
        P.text(175, 154, 'API', { size: 14, weight: 700 });
        P.arrow(214, 70, 236, 70, { c: 'accent', w: 2.4, head: 8 });
        coin(P, 266, 66, 52, '$');
        P.arrow(266, 98, 266, 126, { c: 'bad', w: 2.4, head: 8 });
        P.text(266, 154, '내 크레딧', { size: 13, weight: 700 });
        P.text(170, 190, '키를 가진 사람이 내 크레딧으로', { size: 13, c: 'ink2' });
      }},
      createKey: { w: 340, h: 206, label: 'API keys에서 Create new key를 누르고 연수용 이름을 붙여 키를 받는 단계', draw(P) {
        chip(P, 10, 40, 92, 34, 'API keys', 'paper', 13);
        P.arrow(106, 57, 124, 57, { c: 'accent', w: 2, head: 7 });
        chip(P, 128, 40, 112, 34, 'Create new key', 'accent', 12);
        P.arrow(244, 57, 262, 57, { c: 'accent', w: 2, head: 7 });
        P.rrect(266, 40, 66, 34, 17, { fill: 'hi', gap: 5 });
        P.text(299, 62, '연수용', { size: 13, weight: 700 });
        P.text(56, 100, '① 메뉴', { size: 12, c: 'ink2' });
        P.text(184, 100, '② 새 키', { size: 12, c: 'ink2' });
        P.text(299, 100, '③ 용도 이름', { size: 12, c: 'ink2' });
        key(P, 140, 132, 1.2, 'good');
        P.text(170, 172, 'up_••••••7f3a', { mono: true, size: 12 });
        P.text(170, 198, '④ 복사해 바로 .env로', { size: 13, weight: 700, c: 'accent' });
      }},
      keyPlaces: { w: 340, h: 196, label: '.env 파일에는 동그라미, 코드·GitHub·단톡방·화면 공유에는 가위표', draw(P) {
        doc(P, 24, 24, 84, 104, '.env', 'hi', 13);
        tick(P, 66, 148, 14);
        P.text(66, 182, '여기에만', { size: 13, weight: 700, c: 'good' });
        P.rrect(150, 20, 76, 56, 8, { fill: 'ink', fs: 'solid' });
        P.text(188, 54, 'KEY=', { mono: true, size: 13, c: 'paper' });
        cloud(P, 284, 48, 84, 52, 'soft');
        P.text(284, 54, 'GitHub', { size: 12, weight: 700 });
        P.bubble(150, 94, 76, 44, 166, 152);
        P.text(188, 121, '단톡방', { size: 12, weight: 700 });
        win(P, 246, 94, 76, 56);
        P.text(284, 132, '공유', { size: 11, weight: 700 });
        cross(P, 222, 24, 6);
        cross(P, 322, 24, 6);
        cross(P, 222, 98, 6);
        cross(P, 322, 98, 6);
        P.text(236, 182, '여기엔 절대 안 돼요', { size: 13, weight: 700, c: 'bad' });
      }},
      leakFix: { w: 340, h: 200, label: '새어 나간 열쇠를 지우고 새 열쇠를 만들어 .env를 바꾸는 세 단계', draw(P) {
        key(P, 24, 60, 0.9, 'soft');
        P.drop(44, 88, 6);
        P.text(40, 124, '샌 키', { size: 12, weight: 700, c: 'bad' });
        P.arrow(74, 62, 96, 62, { c: 'accent', w: 2, head: 7 });
        trash(P, 104, 44, 44, 56);
        P.text(126, 124, '① 지우기', { size: 12, weight: 700 });
        P.arrow(158, 62, 180, 62, { c: 'accent', w: 2, head: 7 });
        key(P, 196, 60, 0.9, 'good');
        P.text(212, 124, '② 새로 만들기', { size: 12, weight: 700 });
        P.arrow(246, 62, 268, 62, { c: 'accent', w: 2, head: 7 });
        doc(P, 274, 34, 52, 64, '.env', 'hi', 11);
        P.text(300, 124, '③ 바꾸기', { size: 12, weight: 700 });
        P.text(170, 166, '글보다 키를 먼저 막아요', { size: 13, c: 'accent' });
        P.text(170, 188, '그다음 Usage 확인', { size: 12, c: 'ink2' });
      }},
      serverWall: { w: 340, h: 200, label: '학생 기기들은 화면만 쓰고, 키는 교사의 프로그램 안에만 있는 구조', draw(P) {
        for (let i = 0; i < 3; i++) {
          P.rrect(16, 30 + i * 48, 30, 42, 6, { fill: 'paper', fs: 'solid' });
          P.face(31, 51 + i * 48, 18, { mood: ['smile', 'happy', 'wink'][i] });
          P.arrow(52, 51 + i * 48, 110, 100, { c: 'soft', w: 1.6, head: 7 });
        }
        P.text(31, 190, '학생 화면', { size: 12, weight: 700 });
        P.rrect(116, 60, 100, 80, 10, { fill: 'sky', gap: 6 });
        P.text(166, 86, '내 프로그램', { size: 12, weight: 700 });
        key(P, 146, 114, 0.8, 'hi');
        P.text(166, 166, '키는 여기에만', { size: 13, weight: 700, c: 'accent' });
        P.arrow(222, 100, 250, 100, { c: 'accent', w: 2.2, head: 8 });
        cloud(P, 292, 100, 84, 56, 'hi');
        P.text(292, 106, 'Upstage', { size: 12, weight: 700 });
        P.text(292, 150, 'API', { size: 12, c: 'ink2' });
      }},

      /* ---------- L5 문제 그림 ---------- */
      q_leakGit: { w: 340, h: 200, label: 'GitHub 구름에 .env 쪽지가 올라간 것을 보고 놀란 얼굴', draw(P) {
        cloud(P, 120, 66, 190, 100, 'soft');
        P.text(84, 56, 'GitHub', { size: 14, weight: 700 });
        doc(P, 122, 42, 50, 54, '.env', 'hi', 11);
        laptop(P, 30, 138, 60, 34, 'paper');
        P.arrow(64, 134, 90, 112, { c: 'soft', w: 2, head: 7 });
        person(P, 282, 196, 'wow', 0.74);
        P.drop(324, 112, 6);
        P.text(184, 188, '.env까지 올라갔어요', { size: 13, c: 'ink2' });
      }},
      q_keyLine: { w: 340, h: 200, label: '다섯 줄짜리 코드와 돋보기로 고칠 줄을 찾는 얼굴', draw(P) {
        codeLines(P, 14, 20, 190, 144, 5);
        lens(P, 200, 126, 56);
        person(P, 296, 196, 'wow', 0.62);
        P.text(290, 56, '어느 줄?', { size: 14, weight: 700, c: 'warm' });
      }},
      q_leakOrder: { w: 340, h: 200, label: '뒤섞인 카드: 키가 든 말풍선, 휴지통, 새 열쇠, .env 쪽지', draw(P) {
        card(P, 14, 16);
        P.bubble(24, 24, 50, 30, 36, 62);
        key(P, 64, 70, 0.5, 'hi');
        card(P, 126, 52);
        trash(P, 156, 66, 32, 40);
        card(P, 238, 14);
        key(P, 262, 50, 0.7, 'good');
        card(P, 56, 116);
        doc(P, 82, 122, 40, 58, '.env', 'hi', 10);
        head(P, 262, 150, 34, 'wow');
        ask(P, 116, 40, 22, 'warm');
        ask(P, 226, 112, 22, 'bad');
        ask(P, 30, 110, 20, 'accent');
      }},
      q_neighbor: { w: 340, h: 200, label: '연수장 옆자리 선생님이 키를 같이 쓰자고 부탁하는 모습', draw(P) {
        key(P, 40, 40, 0.9, 'hi');
        person(P, 80, 196, 'smile', 0.8);
        P.bubble(150, 10, 182, 56, 236, 86);
        P.text(241, 34, '선생님 키,', { size: 13, weight: 700 });
        P.text(241, 54, '같이 써도 될까요?', { size: 13, weight: 700 });
        person(P, 250, 196, 'wink', 0.8);
        ask(P, 164, 124, 26);
      }},

      /* ---------- 형성평가 그림 ---------- */
      t_noBuild: { w: 340, h: 200, label: '이미 잘 도는 채점 화면과 "왜 틀렸지?" 빈칸, 무엇을 만들지 고민하는 얼굴', draw(P) {
        win(P, 12, 18, 200, 140);
        tick(P, 40, 60, 10);
        P.line(56, 60, 150, 60, { c: 'soft', w: 3 });
        tick(P, 40, 90, 10);
        P.line(56, 90, 140, 90, { c: 'soft', w: 3 });
        cross(P, 40, 121, 7);
        P.line(56, 121, 118, 121, { c: 'soft', w: 3 });
        P.rrect(128, 110, 76, 24, 6, { c: 'warm', w: 1.8 });
        P.text(166, 127, '왜 틀렸지?', { size: 11, c: 'warm' });
        person(P, 290, 196, 'wow', 0.7);
        ask(P, 290, 92, 22);
        P.text(112, 186, '채점은 이미 잘 돼요', { size: 13, c: 'ink2' });
      }},
      t_lecture: { w: 340, h: 190, label: '연수 강의실 화면의 소버린 AI와 손을 들고 질문하는 선생님', draw(P) {
        P.rrect(80, 10, 180, 90, 8, { fill: 'paper', fs: 'solid' });
        P.text(170, 50, '소버린 AI', { size: 18, weight: 700 });
        P.text(170, 76, '1일차 10:00', { size: 12, c: 'ink2' });
        const moods = ['smile', 'happy', 'sleepy', 'wow', 'wink', 'smile'];
        for (let i = 0; i < 6; i++) {
          const x = 40 + i * 52;
          P.circle(x, 160, 36, { fill: 'paper' });
          P.face(x, 161, 30, { mood: moods[i] });
        }
        P.line(196, 142, 210, 112, { w: 3 });
        P.circle(212, 108, 12, { fill: 'paper' });
        ask(P, 236, 128, 24);
      }},
      t_score: { w: 340, h: 200, label: '크게 적힌 110% 광고판과 돋보기로 살피는 얼굴', draw(P) {
        P.rrect(14, 20, 190, 110, 10, { fill: 'hi', gap: 7 });
        P.text(109, 82, '110%', { size: 40, weight: 700, c: 'bad' });
        P.text(109, 114, '한국어 점수!', { size: 13, weight: 700 });
        lens(P, 204, 120, 50);
        person(P, 296, 196, 'wow', 0.62);
        P.text(110, 180, '이 숫자, 그대로 옮겨도 될까?', { size: 13, c: 'ink2' });
      }},
      t_twoTasks: { w: 340, h: 190, label: '기말 학습지 PDF와 질문 쪽지 천 장, 각각 어느 도구일지 묻는 물음표', draw(P) {
        P.note(24, 24, 90, 110, { fill: 'paper' });
        P.text(69, 52, 'PDF', { size: 15, weight: 700, c: 'bad' });
        [72, 88, 104, 120].forEach(y => P.line(36, y, 100, y, { c: 'soft', w: 2 }));
        ask(P, 69, 170, 24);
        for (let i = 0; i < 5; i++) P.note(200 + i * 5, 40 - i * 5, 80, 60, { fill: i % 2 ? 'paper' : 'sky' });
        P.text(258, 128, '1,000개', { size: 14, weight: 700 });
        ask(P, 258, 170, 24);
      }},
      t_rules: { w: 340, h: 200, label: 'AGENTS.md 쪽지 네 줄과 돋보기, 놀란 에이전트 로봇', draw(P) {
        P.note(20, 16, 170, 150, { fill: 'paper' });
        P.text(105, 40, 'AGENTS.md', { mono: true, size: 12, weight: 700 });
        [66, 92, 118, 144].forEach(y => P.line(36, y, 170, y, { c: 'ink2', w: 2.4 }));
        lens(P, 196, 126, 52);
        P.robot(288, 80, 0.5, { mood: 'wow' });
        P.text(150, 192, '어느 규칙이 틀렸지?', { size: 13, c: 'ink2' });
      }},
      t_firstDay: { w: 340, h: 200, label: '뒤섞인 카드: 로그인 얼굴, 열쇠, .env 쪽지, 코드 상자', draw(P) {
        card(P, 14, 16);
        P.circle(60, 40, 24, { fill: 'sky', gap: 5 });
        P.face(60, 40, 18, { mood: 'happy' });
        P.rrect(34, 60, 52, 10, 4, { c: 'soft', w: 1.2 });
        card(P, 126, 52);
        key(P, 152, 88, 0.6, 'hi');
        card(P, 238, 14);
        doc(P, 262, 20, 44, 58, '.env', 'hi', 10);
        card(P, 56, 116);
        P.rrect(66, 126, 44, 30, 5, { fill: 'ink', fs: 'solid' });
        P.arrow(114, 141, 140, 141, { c: 'accent', w: 2, head: 6 });
        P.robot(272, 146, 0.48, { mood: 'happy' });
        ask(P, 116, 40, 22, 'warm');
        ask(P, 226, 112, 22, 'bad');
        ask(P, 30, 110, 20, 'accent');
      }},
      t_403: { w: 340, h: 196, label: '연수장 노트북 세 대 가운데 한 대에만 403이 뜬 모습', draw(P) {
        laptop(P, 18, 30, 70, 46, 'paper');
        laptop(P, 136, 30, 70, 46, 'paper');
        laptop(P, 254, 30, 70, 46, 'paper');
        tick(P, 53, 53, 10);
        P.text(171, 60, '403', { size: 18, weight: 700, c: 'bad' });
        tick(P, 289, 53, 10);
        head(P, 53, 126, 30, 'happy');
        head(P, 171, 126, 30, 'wow');
        head(P, 289, 126, 30, 'happy');
        P.text(171, 180, '나만 안 돼요', { size: 14, c: 'ink2' });
      }},
      t_agentPaste: { w: 340, h: 200, label: '에이전트 채팅 입력칸에 키를 붙여 넣으려는 모습과 놀란 로봇', draw(P) {
        win(P, 12, 16, 220, 140);
        P.robot(122, 72, 0.4, { mood: 'wow' });
        P.rrect(24, 118, 196, 26, 6, { c: 'accent', w: 1.6 });
        P.text(32, 136, '이 키로 짜 줘: up_••••', { size: 11, anchor: 'start' });
        person(P, 290, 100, 'smile', 0.6);
        key(P, 262, 126, 1.0, 'hi');
        P.curveArrow(258, 140, 244, 160, 222, 140, { c: 'bad', w: 2, head: 7 });
        P.text(122, 188, '붙여도 될까?', { size: 14, c: 'ink2' });
      }},
      t_version: { w: 340, h: 200, label: '버전 이름의 뒤 여섯 자리를 돋보기로 보는 모습', draw(P) {
        P.rrect(14, 50, 250, 44, 10, { fill: 'sky', gap: 6 });
        P.text(26, 79, 'solar-mini4-', { mono: true, size: 15, weight: 700, anchor: 'start' });
        P.text(136, 79, '260922', { mono: true, size: 15, weight: 700, anchor: 'start', c: 'warm' });
        lens(P, 160, 74, 66);
        ask(P, 150, 150, 28);
        person(P, 300, 196, 'wow', 0.62);
        P.text(150, 188, '이 여섯 자리는?', { size: 13, c: 'ink2' });
      }},
      t_expire: { w: 340, h: 200, label: '두 달 뒤 달력과 크레딧 동전 사이의 물음표', draw(P) {
        calendar(P, 20, 30, 100, 96, '+2', '두 달 뒤', 18);
        P.arrow(128, 80, 176, 80, { c: 'soft', w: 2, head: 8 });
        coin(P, 220, 80, 70, '$');
        ask(P, 220, 150, 26);
        person(P, 302, 196, 'wow', 0.6);
        P.text(110, 186, '그때도 남아 있을까?', { size: 13, c: 'ink2' });
      }}
    },

    items: [
    /* =================== L1 =================== */
    { id: 'L1', type: 'lesson', title: 'AI 시대, 정보 교사가 하는 일', sub: 'AI를 쓰는 사람에서 수업 도구를 만드는 사람으로', min: 8, steps: [
      { t: 'say', h: '이번엔 AI를 부품으로 넣은 서비스를 만들어요', fig: 'journey', p: [
        '코딩한입에서는 코드를 직접 짰고, 커서한입에서는 에이전트에게 코딩을 맡겼어요. 업스테이지한입에서는 한 걸음 더 가서, <b>AI를 부품으로 넣은 수업 서비스</b>를 만들어요.',
        '웹 채팅 창에서 AI에게 묻는 건 AI를 <b>쓰는</b> 일이에요. 내 프로그램이 학생 질문을 받아 AI에게 넘기고, 돌아온 답을 다듬어 보여 주는 건 AI를 <b>부르는</b> 일이에요. 프로그램이 AI를 부르는 창구를 <b>API</b>라고 해요.',
        '이 과정은 업스테이지 API로 질문 도우미, 자동채점, 자료 기반 챗봇, 에이전트까지 만들어요. 첫 목표는 업스테이지·팀모노리스·한국컴퓨터교육학회 기반연수를 끝까지 해내는 거예요.'
      ]},
      { t: 'say', h: '정보 교사의 세 역할: 만들고, 안내하고, 지켜요', fig: 'threeRoles', table: { head: ['역할', '하는 일', '이 과정에서'], rows: [
        ['<b>도구 제작자</b>', '내 수업에 맞는 작은 AI 도구를 직접 만들어요', '과정 2~4: 자료 읽히기, 질문 도우미, 자동채점, 학습 챗봇'],
        ['<b>AI 리터러시 안내자</b>', 'AI가 답을 만드는 원리와 한계, 확인하는 습관을 학생에게 알려 줘요', '단원 2: LLM의 원리와 환각'],
        ['<b>안전 책임자</b>', '학생 정보, API 키, 비용, 부적절한 답을 막는 장치를 챙겨요', '이 단원 레슨 5, 과정 3: 교실 안전장치'] ] }, p: [
        '셋은 따로 노는 역할이 아니에요. 도구를 만들면 학생이 그 도구를 어떻게 믿고 써야 하는지 알려 줘야 하고, 학생이 쓰는 순간부터 안전도 내 몫이 돼요.',
        '2026년 10월 보도된 한국교육과정평가원의 생성형 AI 활용 가이드라인도 "최종 판단은 교사 몫"이라고 해요. AI가 만든 결과를 쓸지 말지는 늘 교사가 정해요.'
      ], tip: '학생이 직접 쓰는 AI 도구에는 학교 절차가 있어요. 교육부 「학습지원 소프트웨어 선정 기준」(2026학년도 1학기부터)은 학생 개인정보를 처리하는 소프트웨어에 필수기준과 학교운영위원회 심의를 둬요. 내가 만든 도구가 여기에 해당하는지는 학교·교육청 지침을 먼저 확인해요.' },
      { t: 'say', h: '왜 직접 만들까: 범용 AI는 우리 반을 몰라요', fig: 'ownTool', p: [
        '범용 AI 채팅은 무엇이든 답하지만, <b>내 수업자료·우리 반 수준·내 채점 기준</b>은 몰라요. 학생이 물으면 정답 코드를 통째로 보여 줄 수도 있어요.',
        '직접 만들면 규칙을 내가 정해요. 내 학습지를 근거로만 답하게, 정답 대신 힌트부터 주게, 학생 이름은 받지 않게 할 수 있어요.',
        '그렇다고 다 만들 필요는 없어요. 학교에서 쓰는 플랫폼이 이미 잘하는 일은 그대로 쓰고, <b>빈 곳</b>만 작게 만들어 채워요.'
      ]},
      { t: 'say', h: '이 과정의 길: 연수 15차시와 나란히', fig: 'roadmap', p: [
        '과정 1에서 콘솔과 Solar를 익히고, 과정 2에서 수업자료를 데이터로 바꿔요. 과정 3에서 그 데이터로 답하는 수업 도구를, 과정 4에서 연수 2일차 트랙(A 자동채점+AI튜터, B 자료 기반 챗봇)을 만들어요. 과정 5는 에이전트와 대회예요.',
        '단원마다 연습 폴더 <code>upstage-lab</code>에 파일이 하나씩 늘어요. 단원 3의 <code>hello_solar.py</code>에서 시작해 대회용 저장소까지 자라요.',
        '이 단원은 연수 1일차 10시 「AI 시대의 정보교사 역할과 소버린 AI의 중요성」을 미리 보는 단원이에요. 차시와 단원의 짝은 <b>연수 지도</b> 탭에서 볼 수 있어요.'
      ]},
      { t: 'q', kind: 'mc', fig: 'q_roleLit', q: '정보 시간에 AI에게 계산 문제를 시켜 틀린 답이 나오는 장면을 보여 주고, 학생들과 "왜 틀렸을까, 어떻게 확인할까"를 이야기했어요. 세 역할 중 어디에 가장 가까울까요?',
        opts: ['도구 제작자', '안전 책임자', 'AI 리터러시 안내자', '역할과 상관없는 계산 연습'], a: 2,
        why: 'AI가 어떻게 답을 만들고 어디서 틀리는지, 어떻게 확인하는지 알려 주는 건 <b>AI 리터러시 안내자</b>의 일이에요.',
        ex: ['이번 활동은 도구를 만든 게 아니라 AI의 한계를 함께 살핀 거예요.', '막는 장치를 만든 게 아니라 AI를 읽는 눈을 길러 준 활동이에요.', '', '계산 문제를 썼지만 목표는 계산이 아니라, AI의 답을 의심하고 확인하는 눈을 기르는 거예요.'] },
      { t: 'q', kind: 'mc', fig: 'q_roleSafe', q: '반 학생 30명이 쓸 질문 도우미를 만들면서, 이름·전화번호는 입력하지 못하게 하고 한 사람당 하루 질문 수를 정했어요. 무엇을 챙긴 걸까요?',
        opts: ['안전 책임자로서 학생 정보와 비용을 지켰다', 'AI 리터러시 안내자로서 원리를 가르쳤다', '도구 제작자로서 화면을 예쁘게 꾸몄다', '학생에게 API 키 쓰는 법을 나눠 주었다'], a: 0,
        why: '개인정보를 받지 않고 사용 횟수를 정하는 건 학생 정보와 비용을 지키는 <b>안전 책임자</b>의 일이에요. 과정 3에서 이런 안전장치를 코드로 만들어요.',
        ex: ['', '원리를 가르친 게 아니라, 도구에 막는 장치를 넣은 거예요.', '화면 꾸미기와 상관없이, 정보와 비용을 막는 장치예요.', '학생에게 키를 나눠 주면 안 돼요. 레슨 5에서 자세히 봐요.'] },
      { t: 'q', kind: 'order', fig: 'q_route', q: '이 과정이 나아가는 순서예요. 앞 단계가 있어야 다음 단계가 되도록 쌓아 보세요.',
        items: ['콘솔에서 키를 만들고 Solar를 불러 본다', '수업자료를 Document Parse로 데이터로 바꾼다', '그 데이터를 근거로 답하는 수업 도구를 만든다', '도구를 스스로 골라 쓰는 에이전트로 키워 대회에 낸다'],
        why: '키가 있어야 API를 부르고, 자료가 데이터가 돼야 자료로 답하는 도구를 만들고, 도구가 있어야 에이전트가 그 도구를 골라 써요.' },
      { t: 'q', kind: 'mc', fig: 'q_whyOwn', q: '다음 중 범용 AI 채팅 대신 <b>직접 도구를 만드는 게</b> 가장 알맞은 경우는?',
        opts: ['"이진수가 뭐야?" 같은 일반 질문에 빨리 답을 받고 싶을 때', '내 학습지만 근거로, 정답 대신 힌트부터 주는 도우미가 필요할 때', '학교 플랫폼의 자동채점이 이미 잘 돌아가고 있을 때', 'AI 모델을 처음부터 새로 학습시켜 보고 싶을 때'], a: 1,
        why: '내 자료와 내 규칙(근거만 쓰기, 힌트 먼저)이 필요한 곳이 직접 만들 자리예요. 이미 잘 되는 건 그대로 쓰고 빈 곳만 채워요.',
        ex: ['일반 질문은 범용 채팅으로도 충분해요. 만들 이유가 약해요.', '', '이미 잘하는 도구가 있으면 그대로 써요. 빈 곳만 만들어요.', '이 과정은 모델을 학습시키지 않아요. 만들어진 모델을 API로 불러 써요.'] },
      { t: 'sum', pts: ['AI를 쓰는 사람에서 AI를 부품으로 넣은 수업 도구를 만드는 사람으로. 프로그램이 AI를 부르는 창구가 API다.', '정보 교사의 세 역할: 도구 제작자, AI 리터러시 안내자, 안전 책임자. 최종 판단은 교사 몫.', '다 만들 필요는 없다. 내 자료·내 규칙이 필요한 빈 곳만 작게 만든다.'] }
    ]},

    /* =================== L2 =================== */
    { id: 'L2', type: 'lesson', title: '소버린 AI가 왜 중요할까', sub: '뜻, 학교에 주는 의미, 기대할 점과 한계', min: 11, steps: [
      { t: 'say', h: '소버린 AI는 "AI를 스스로 다룰 수 있는 힘"이에요', fig: 'sovLayers', p: [
        '소버린(sovereign)은 "주권이 있는"이라는 뜻이에요. 소버린 AI는 AI를 이루는 <b>데이터·모델·인프라</b>(컴퓨터·데이터센터)를 스스로 만들고 통제할 수 있는 힘을 말해요.',
        '널리 합의된 한 줄 정의보다는 풀어 쓴 설명이 많아요. 모델만이 아니라 전력, 데이터센터, 클라우드, 그 위의 서비스까지 <b>생태계 전체</b>를 봐야 한다는 설명도 있어요.',
        '핵심은 "국산만 쓰자"가 아니라 <b>선택지와 통제권</b>이에요. 중요한 곳에서 다른 나라나 한 회사의 결정에만 기대지 않을 수 있느냐는 물음이에요.'
      ]},
      { t: 'say', h: '왜 중요할까: 네 가지 까닭', table: { head: ['까닭', '뜻', '학교에서는'], rows: [
        ['<b>언어·문화</b>', '한국어와 한국 문화, 우리 교육과정을 잘 이해하는 AI', '교과서 용어, 학교 맥락에 맞는 설명'],
        ['<b>데이터 보호</b>', '민감한 데이터가 어디서 처리되고 누가 다루는지 정할 수 있음', '학습 기록·성적·오답 같은 학생 데이터'],
        ['<b>공급 안정</b>', '다른 나라나 회사의 결정으로 서비스·가격·접근이 바뀌는 위험을 줄임', '수업 중에 쓰던 도구가 막히는 일'],
        ['<b>산업·인재</b>', '기술과 인재가 나라 안에 쌓임', '학생들이 일할 미래의 산업'] ] }, p: [
        '정부의 "모두의 AI" 계획도 한국어·한국 문화에 특화된 AI를 목표로 해요. 아래에서 볼 국가 프로젝트의 평가에도 한국어 분야 시험이 들어 있어요.',
        '공급 안정은 국내 AI 기업 쪽에서 특히 강조하는 까닭이에요. 기술을 가진 쪽이 마음먹으면 공급을 끊을 수 있다는 주장인데, <b>이해관계가 있는 쪽의 말</b>이라는 점도 함께 기억해요.'
      ]},
      { t: 'say', h: '나라가 하는 일: 독자 AI 파운데이션 모델 프로젝트', fig: 'stagePlan', p: [
        '과학기술정보통신부는 2025년 8월 정예팀 5곳을 뽑아, 6개월쯤마다 평가해 팀을 줄여 가는 방식으로 한국의 독자 AI 모델을 키우고 있어요. 평가는 시험 점수(벤치마크), 전문가 평가, 사용자 평가를 섞어요.',
        '2026년 10월 기준으로 LG AI연구원, SK텔레콤, 업스테이지 세 팀이 3차 단계에 있어요. 2027년 초 평가로 최종 2팀을 고른다는 계획이 발표됐지만, 방식은 바뀔 수 있어요.',
        '1차 평가에서는 "독자" 모델의 기준도 밝혔어요. 해외 모델을 가져와 미세조정만 한 파생 모델은 인정하지 않고, 공개된 구조를 쓰더라도 <b>가중치를 초기화한 뒤 처음부터 학습</b>해야 해요.'
      ], tip: '이런 현황은 금방 바뀌어요. 수업 자료에 쓸 때는 "2026년 10월 기준"처럼 시점을 붙이고, 과기정통부 발표로 다시 확인해요.' },
      { t: 'say', h: '업스테이지가 내놓은 것: 공개 모델과 API 모델', fig: 'openVsApi', p: [
        '업스테이지는 프로젝트의 1차·2차 결과물로 <b>Solar Open</b> 계열 모델(Solar Open 100B, Solar Open 2)을 공개했어요. 가중치를 누구나 내려받을 수 있는 공개 모델이에요.',
        '이 과정에서 부르는 건 콘솔 API의 <code>solar-pro4</code>예요. 내 컴퓨터에 내려받지 않고, 업스테이지 서버에서 돌아가는 모델을 인터넷으로 불러 써요.',
        '모델을 소개하는 점수는 대부분 <b>회사가 직접 발표한 것</b>이에요. 독립된 곳에서 검증한 점수인지, 어떤 시험인지 함께 읽어요.'
      ]},
      { t: 'say', h: '좋은 점만 있지는 않아요: 판단은 교사가', fig: 'balance', p: [
        '<b>기대할 점</b>은 한국어·교육 맥락에 맞는 답, 데이터가 어디서 처리되는지 따져 볼 수 있는 선택지, 한 곳이 막혀도 버틸 수 있는 여지예요.',
        '<b>한계</b>도 있어요. 모델 하나로는 생태계가 되지 않는다는 비판, 공공데이터가 학습에 바로 쓰기 어려운 형식이라는 지적이 있어요. 국산이라고 저절로 더 정확하거나 안전하지도 않아서, 개인정보 처리 방식과 약관은 도구마다 직접 확인해요.',
        '한 교육청 AI 서비스는 특정 모델에 묶이지 않게 만들고, 교사가 검증한 자료를 먼저 참고하며, 학생 데이터는 일정 기간 뒤 지운다고 설명했어요(2026년 9월 보도). 우리도 <code>MODEL</code> 변수 하나로 모델을 바꿀 수 있게 만드는 습관부터 들여요.'
      ]},
      { t: 'try', lang: 'md', h: '우리 학교 AI 도구 점검표를 써 봐요', p: '새 AI 도구를 수업에 들이기 전에 확인할 것을 내 말로 고치고 보태 보세요. 국산·외산을 따지기 전에 물어야 할 것부터예요.',
        src: src(['# AI 도구 점검표', '', '- [ ] 학생 개인정보 없이 쓸 수 있나?', '- [ ] 넣은 데이터는 어디에, 얼마나 남나?', '- [ ] 우리 학년 수준의 한국어 설명인가?', '- [ ] 막히면 다른 모델로 바꿀 수 있나?', '- [ ] 학교·교육청 지침과 절차를 봤나?']),
        note: '정답은 없어요. 레슨 5와 과정 3(교실 안전장치)에서 이 점검표를 다시 꺼내 써요.' },
      { t: 'q', kind: 'mc', fig: 'q_finetune', q: '어느 팀이 해외에서 공개한 모델을 가져와 한국어 자료로 <b>미세조정만</b> 해서 냈어요. 독자 AI 파운데이션 모델 프로젝트 1차 평가의 기준으로 보면?',
        opts: ['한국어로 더 학습했으니 독자 모델로 인정된다', '공개된 구조를 썼으니 처음부터 참가할 수 없다', '시험 점수가 높으면 독자 모델로 인정된다', '미세조정한 파생 모델이라 인정되지 않는다'], a: 3,
        why: '1차 평가 기준에서 해외 모델을 미세조정한 파생 모델은 독자 모델로 인정하지 않았어요. 공개된 구조를 쓰더라도 가중치를 초기화한 뒤 학습하는 게 최소 조건이에요.',
        ex: ['무엇으로 더 학습했느냐보다, 처음부터 학습했느냐가 기준이에요.', '공개된 구조를 쓰는 것 자체는 괜찮아요. 가중치를 초기화한 뒤 학습하면 돼요.', '점수와 별개로 독자성 기준이 따로 있어요.', ''] },
      { t: 'q', kind: 'mc', fig: 'q_privacy', q: '동료 선생님이 "이건 국산 모델이니까 학생 이름이랑 성적을 넣어도 안전하겠죠?"라고 해요. 어떻게 답할까요?',
        opts: ['국산이면 나라 안 서버에서 처리되니 그대로 넣어도 된다', '국산이어도 넣지 않는다. 약관·학교 지침부터 확인한다', '성적은 수업 자료라 괜찮고, 이름만 가명으로 바꾸면 된다', '학교 예산으로 유료 결제한 계정이면 넣어도 된다'], a: 1,
        why: '국산 여부가 안전을 보장하지 않아요. 학생 개인정보는 넣지 않고 쓰는 방법부터 찾고, 도구의 처리 방식·약관과 학교·교육청 지침을 확인해요.',
        ex: ['어디서 어떻게 처리되는지는 도구마다 직접 확인해야 해요. 국산이라고 저절로 안전하지 않아요.', '', '성적도 민감한 학생 데이터예요. 이름을 가려도 넣지 않는 방법부터 찾아요.', '결제 여부와 개인정보 보호는 다른 이야기예요.'] },
      { t: 'q', kind: 'mc', fig: 'q_stage', q: '2026년 10월에 수업 자료를 만들며 국가 AI 프로젝트 현황을 적으려 해요. 가장 좋은 쓰기는?',
        opts: ['"현재 3팀 경쟁 중"이라고만 적는다. 숫자는 바뀌지 않는다', '날짜 없이 "최종 2팀이 선정됐다"고 적는다', '"2026년 10월 기준"처럼 시점을 붙여 적는다', '확실하지 않으니 소버린 AI 이야기는 수업에서 빼 버린다'], a: 2,
        why: '단계마다 평가가 이어져서 숫자가 바뀌어요. 시점을 붙이고, 확정되지 않은 건 "바뀔 수 있음"으로 써요. 쓰기 전에 과기정통부 발표로 다시 확인해요.',
        ex: ['단계평가로 팀 수가 계속 바뀌어요. 시점이 없으면 금방 틀린 글이 돼요.', '2026년 10월 기준 최종 선정은 아직이에요. 계획만 발표됐어요.', '', '확실하지 않은 부분은 시점과 함께 조심스럽게 쓰면 돼요. 뺄 이유는 아니에요.'] },
      { t: 'q', kind: 'line', fig: 'q_claims', q: '소버린 AI 연수를 듣고 정리한 메모예요. <b>틀린 줄</b>을 눌러 보세요.', lang: 'plain',
        code: src(['소버린 AI: 데이터·모델·인프라를 스스로', '독자 모델: 가중치를 처음부터 학습', '공급 안정: 국산이면 끊길 일이 전혀 없다', '회사 발표 점수는 독립 검증과 구분해 읽기']), a: 2,
        why: '소버린 AI는 한 곳에 기대는 위험을 <b>줄이는</b> 거지, 없애 주지는 않아요. 국내 서비스도 바뀌거나 멈출 수 있으니, 모델을 바꿔 쓸 수 있게 만들어 두는 게 좋아요.' },
      { t: 'sum', pts: ['소버린 AI는 데이터·모델·인프라를 스스로 다룰 수 있는 힘. 핵심은 국산만이 아니라 선택지와 통제권.', '독자 AI 파운데이션 모델 프로젝트는 단계평가로 팀을 줄여 가는 중(2026년 10월 기준 3팀). 현황은 시점을 붙여 쓰고 다시 확인한다.', '기대할 점과 한계를 함께 본다. 국산이라고 저절로 안전·정확하지 않으니, 개인정보는 넣지 않고 모델은 바꿔 쓸 수 있게 만든다.'] }
    ]},

    /* =================== QA =================== */
    { id: 'QA', type: 'quiz', title: '헷갈림 퀴즈 ①', sub: '공개 모델과 내 컴퓨터, 웹 채팅과 API, 모델과 서비스', min: 3, steps: [
      { t: 'q', kind: 'mc', fig: 'qa_openLocal', q: 'Solar Open 2는 가중치가 공개된 모델이에요. 그러면 학교 노트북에 내려받아 수업에서 바로 돌릴 수 있을까요?',
        opts: ['네. 공개 모델은 어떤 컴퓨터에서든 가볍게 돈다', '아니요. 공개됐다고 작은 모델은 아니다', '네. 공개 모델은 인터넷 없이 도는 작은 모델만 뜻한다', '아니요. 공개 모델은 업스테이지 콘솔에서만 쓸 수 있다'], a: 1,
        why: '공개(오픈) 모델은 가중치를 내려받을 수 있다는 뜻이지, 작다는 뜻이 아니에요. Solar Open 2는 매개변수가 2,500억 개 규모라, 압축(양자화)해도 데이터센터용 GPU(H200) 2장은 있어야 돌릴 수 있다고 해요.',
        ex: ['크기에 따라 필요한 장비가 달라요. 큰 공개 모델은 노트북에서 돌리기 어려워요.', '', '공개 모델 중에도 아주 큰 모델이 많아요. 공개와 크기는 다른 이야기예요.', '공개 모델은 내려받아 직접 돌리는 게 핵심이에요. 콘솔 API로만 부르는 건 API 모델 쪽이에요.'] },
      { t: 'q', kind: 'mc', fig: 'qa_chatApi', q: '웹 채팅 서비스에 로그인해서 AI에게 묻는 것과, 내 프로그램이 <b>API</b>로 AI를 부르는 것의 차이로 맞는 것은?',
        opts: ['둘 다 사람이 매번 질문을 직접 쳐야 답이 나온다', 'API는 늘 무료이고 웹 채팅은 늘 유료다', 'API는 내 코드가 불러 결과를 이어 쓸 수 있다', 'API로 부르면 AI가 지난 대화를 저절로 기억해 이어 간다'], a: 2,
        why: '웹 채팅은 사람이 쓰는 완성된 화면이고, API는 프로그램이 AI를 부르는 창구예요. API로 받은 답은 채점·저장·화면 표시처럼 내 코드에서 이어 쓸 수 있어요. 대신 쓴 만큼 크레딧이 줄어요.',
        ex: ['API는 프로그램이 질문을 보내요. 사람이 매번 치지 않아도 돼요.', 'API는 쓴 토큰만큼 돈이 들어요. 무료 크레딧은 처음에 받는 것뿐이에요.', '', 'API는 대화를 기억하지 않아요. 이전 대화를 매번 함께 보내야 해요. 단원 2에서 자세히 봐요.'] },
      { t: 'q', kind: 'mc', fig: 'qa_modelService', q: '동료가 "Playground랑 <code>solar-pro4</code>는 같은 거죠?"라고 물어요. 바르게 구별한 것은?',
        opts: ['<code>solar-pro4</code>는 모델, Playground는 그걸 써 보는 화면', '둘은 같은 것을 부르는 두 이름이다', 'Playground가 모델이고 <code>solar-pro4</code>는 콘솔 메뉴 이름이다', '<code>solar-pro4</code>는 Playground에서만 쓸 수 있는 모델이다'], a: 0,
        why: '<b>모델</b>은 글을 만들어 내는 AI 그 자체이고, <b>서비스</b>는 그 모델을 쓰게 해 주는 화면이나 창구예요. 같은 <code>solar-pro4</code>를 Playground에서도, 내 파이썬 코드(API)에서도, Upstage Studio 같은 다른 서비스에서도 불러요.',
        ex: ['', '하나는 모델, 하나는 그 모델을 써 보는 화면이에요.', '거꾸로예요. Playground가 콘솔 메뉴, <code>solar-pro4</code>가 모델이에요.', '같은 모델을 API로 내 코드에서도 불러요. 이 과정이 하는 일이 바로 그거예요.'] }
    ]},

    /* =================== L3 =================== */
    { id: 'L3', type: 'lesson', title: '업스테이지와 Solar 가족', sub: '제품 네 갈래, 별칭과 버전, 종료 일정', min: 13, steps: [
      { t: 'say', h: '업스테이지는 무엇을 만드나요', fig: 'family', table: { head: ['제품', '하는 일', '이 과정에서'], rows: [
        ['<b>Solar</b> 언어 모델', '질문에 답하고 글을 만들어요', '과정 1~5 내내(<code>solar-pro4</code>, <code>solar-mini4</code>)'],
        ['<b>Document Parse</b>', 'PDF·이미지 문서를 LLM이 읽기 좋은 Markdown·HTML로 바꿔요', '과정 2: 학습지·교과서 쪽 읽히기'],
        ['<b>Information Extract</b>', '문서에서 정해 둔 칸(번호, 문항, 정답 등)만 뽑아요', '과정 2: 문항·정답 데이터'],
        ['<b>임베딩</b>', '글의 뜻을 숫자 목록으로 바꿔 비슷한 글을 찾게 해요', '과정 2~3: 자료에서 근거 찾기'] ] }, p: [
        '업스테이지는 2020년에 세워진 한국 AI 회사예요. 콘솔 API로 쓸 수 있는 제품을 크게 네 갈래로 보면 이 표와 같아요.',
        '코드 없이 화면에서 문서 처리 흐름을 만드는 <b>Upstage Studio</b>도 있어요. 과정 5에서 잠깐 만나요.'
      ]},
      { t: 'say', h: 'Solar 두 형제: solar-pro4와 solar-mini4', fig: 'proMini', table: { head: ['', '<code>solar-pro4</code>', '<code>solar-mini4</code>'], rows: [
        ['성격', '대표 모델. 에이전트·문서·코딩에 강하다고 소개해요', '가볍고 싼 모델'],
        ['한 번에 읽는 양', '512K 토큰', '512K 토큰'],
        ['가격(100만 토큰당)', '입력 $0.30 · 출력 $1.20', '입력 $0.10 · 출력 $0.40'],
        ['이럴 때', '여러 단계를 거치는 어려운 문제, 에이전트', '짧은 분류, 많이 부르는 가벼운 일'] ] }, p: [
        '둘 다 대화·추론·구조화 출력·도구 호출을 지원해요. 이 과정의 코드는 <code>solar-pro4</code>를 기본으로, 가벼운 일은 <code>solar-mini4</code>로 해요.',
        '가격은 2026년 10월 기준(부가세 별도)이고 바뀔 수 있어요. 돈은 글을 쪼갠 조각인 <b>토큰</b> 수로 매기는데, 토큰은 단원 2에서 자세히 봐요.'
      ]},
      { t: 'say', h: '별칭과 버전 이름: 코드에는 별칭을', fig: 'aliasFig', code: { lang: 'py', src: src(['MODEL = "solar-pro4"   # 별칭', '', '# 응답의 model 칸에는 실제 버전이', '# "solar-pro4-260806"']) }, p: [
        '<code>solar-pro4</code>는 <b>별칭</b>이에요. 지금은 2026년 8월 6일에 나온 버전 <code>solar-pro4-260806</code>을 가리키고, 응답의 <code>model</code> 칸에는 이 버전 이름이 찍혀요.',
        '버전 이름 뒤 여섯 자리는 날짜(260806 = 2026-08-06)예요. 모델은 자주 새로 나오니, 공식 안내도 버전 이름을 박아 두지 말고 별칭을 쓰라고 권해요.',
        '그래서 이 과정의 코드는 모델 이름을 <code>MODEL</code> 변수 <b>하나</b>에 모아요. 모델이 바뀌면 그 한 줄만 고치면 돼요.'
      ]},
      { t: 'say', h: '종료 일정을 읽어요: 옛 예제 조심', fig: 'retire', p: [
        '<code>solar-pro3</code>, <code>solar-pro2</code>, <code>solar-mini</code>는 <b>2026년 10월 30일(한국 시간) 서비스가 끝나요</b>. 공식 안내는 <code>solar-pro4</code>·<code>solar-mini4</code>로 옮기라는 거예요.',
        '인터넷의 옛 예제에는 <code>solar-pro3</code>, <code>solar-1-mini-chat</code> 같은 이름이나 <code>api.upstage.ai/v1/solar</code> 같은 옛 주소가 많아요. 끝난 모델 이름을 그대로 쓰면 오류가 나요. 지금 문서의 주소는 <code>https://api.upstage.ai/v1</code>이에요.',
        '모델이 언제 나오고 언제 끝나는지는 콘솔 문서의 <b>모델 기록</b>(models/history) 페이지에서 확인해요. 에이전트에게 코드를 맡길 때도 이 점을 꼭 알려 줘요(단원 3).'
      ]},
      { t: 'try', lang: 'py', h: '옛 모델 이름을 찾아 바꿔 봐요', p: '옛 이름을 넣으면 새 이름을 알려 주는 함수예요. 사전에 <code>"solar-pro2": "solar-pro4"</code>를 더해 마지막 줄 결과가 바뀌는지 보세요.',
        src: src(['OLD = {"solar-pro3": "solar-pro4",', '       "solar-mini": "solar-mini4"}', '', 'def check(name):', '    if name in OLD:', '        return name + " → " + OLD[name]', '    return name + " 그대로 써요"', '', 'for m in ["solar-pro3", "solar-mini4",', '          "solar-mini", "solar-pro2"]:', '    print(check(m))']),
        note: '<code>name in OLD</code>는 사전의 열쇠와 글자가 똑같은지 봐요. 일부만 같은 <code>solar-mini4</code>는 걸리지 않아요.' },
      { t: 'q', kind: 'mc', fig: 'q_alias', q: '코드에 <code>MODEL = "solar-pro4"</code>라고 썼는데, 응답의 <code>model</code> 칸에는 <code>solar-pro4-260806</code>이 찍혔어요. 왜일까요?',
        opts: ['별칭 <code>solar-pro4</code>가 가리키는 실제 버전이라서', '서버가 바빠서 다른 모델로 바꿔 답해서', '코드의 모델 이름이 틀려서 서버가 정한 기본 모델로 대신 답해서', '버전 이름으로 고쳐 쓰라는 경고라서'], a: 0,
        why: '코드에는 별칭을 쓰고, 응답에는 그 별칭이 지금 가리키는 실제 버전이 찍혀요. 정상이에요.',
        ex: ['', '다른 모델로 바뀐 게 아니에요. 같은 모델의 버전 이름이에요.', '이름이 틀렸다면 답 대신 오류가 왔을 거예요.', '경고가 아니에요. 공식 안내도 코드에는 별칭을 쓰라고 권해요.'] },
      { t: 'q', kind: 'mc', fig: 'q_pickDP', q: '표가 들어 있는 학습지 PDF를 LLM이 읽기 좋은 Markdown으로 바꾸고 싶어요. 어느 제품일까요?',
        opts: ['임베딩', '<code>solar-mini4</code>', 'Information Extract', 'Document Parse'], a: 3,
        why: '<b>Document Parse</b>는 문서를 문단·표·그림 같은 요소로 나눠 Markdown·HTML로 바꿔요. 과정 2 단원 1에서 해요.',
        ex: ['임베딩은 글의 뜻을 숫자로 바꿔 비슷한 글을 찾을 때 써요.', '언어 모델은 글을 받아 답해요. PDF를 구조 있는 글로 바꾸는 건 Document Parse예요.', 'Information Extract는 정해 둔 칸만 뽑아요. 문서 전체를 Markdown으로 바꾸진 않아요.', ''] },
      { t: 'q', kind: 'blank', fig: 'q_twoJobs', q: '두 가지 일에 알맞은 모델을 골라 빈칸을 채워 보세요.', lang: 'plain',
        code: src(['학생 질문 500개를 "개념/오류/기타"로', '짧게 분류하기: [[1]]', '여러 단계를 거치는 어려운 문제 풀이를', '자세히 설명하기: [[2]]']),
        opts: [['solar-mini4', 'solar-pro4'], ['solar-pro4', 'solar-mini4'], ['solar-mini4', 'Document Parse'], ['임베딩', 'solar-pro4']], a: 0,
        why: '많이 부르는 가벼운 분류는 싸고 가벼운 <code>solar-mini4</code>, 여러 단계를 거치는 어려운 일은 대표 모델 <code>solar-pro4</code>가 알맞아요.',
        ex: ['', '거꾸로예요. 500번 부르는 가벼운 일에 비싼 모델을 쓰면 돈이 많이 들어요.', 'Document Parse는 문서를 글로 바꾸는 제품이에요. 풀이 설명은 언어 모델의 일이에요.', '임베딩은 뜻을 숫자로 바꿀 뿐, 분류 결과를 말로 답하지는 않아요.'] },
      { t: 'q', kind: 'mc', fig: 'q_oldEx', q: '2026년 11월, 인터넷에서 찾은 예제 코드에 <code>model="solar-pro3"</code>가 있어요. 어떻게 할까요?',
        opts: ['공식 블로그에 있던 예제라 그대로 돌린다', '<code>solar-pro3-260323</code>처럼 버전 이름으로 바꿔 적는다', '<code>solar-pro4</code>로 바꾸고 주소도 지금 문서와 견준다', 'Solar는 그만 쓰고 다른 회사 모델로 옮긴다'], a: 2,
        why: '<code>solar-pro3</code>는 2026년 10월 30일에 서비스가 끝났어요. 지금 모델 <code>solar-pro4</code>로 바꾸고, 옛 예제의 주소나 매개변수도 지금 문서와 견줘 봐요.',
        ex: ['공식 자료라도 쓰인 때가 있어요. 끝난 모델은 공식 예제라도 돌지 않아요.', '버전 이름을 적어도 끝난 모델은 끝난 모델이에요.', '', '모델이 바뀌었을 뿐이에요. 이름을 새것으로 바꾸면 돼요.'] },
      { t: 'q', kind: 'line', fig: 'q_constLine', q: '<code>upstage-lab</code>의 설정 줄이에요. 2026년 11월에 <b>고쳐야 할 줄</b>을 눌러 보세요.', lang: 'py',
        code: src(['MODEL = "solar-pro4"', 'LIGHT = "solar-mini"', 'EMBED = "solar-embedding-2-passage"', 'URL = "https://api.upstage.ai/v1"']), a: 1,
        why: '<code>solar-mini</code>는 2026년 10월 30일에 끝났어요. 가벼운 모델은 지금 <code>solar-mini4</code>예요. 글자 하나 차이라 놓치기 쉬워요.' },
      { t: 'sum', pts: ['업스테이지 제품 네 갈래: Solar 언어 모델, Document Parse, Information Extract, 임베딩. 노코드 Upstage Studio도 있다.', 'solar-pro4는 대표, solar-mini4는 가볍고 싸다. 코드에는 별칭을 MODEL 변수 하나에 모은다.', 'solar-pro3·solar-pro2·solar-mini는 2026-10-30 종료. 옛 예제의 모델 이름과 주소를 지금 문서와 견준다.'] }
    ]},

    /* =================== L4 =================== */
    { id: 'L4', type: 'lesson', title: '콘솔 둘러보기', sub: 'Home, Playground, API keys, Billing', min: 9, win: 'console', steps: [
      { t: 'say', h: '콘솔은 업스테이지 API의 관리실이에요', fig: 'consoleMap', table: { head: ['메뉴', '뜻', '이럴 때'], rows: [
        ['<b>Home</b>', '첫 화면', '콘솔에 들어오면 처음 보는 곳'],
        ['<b>Playground</b>', '놀이터: 코드 없이 써 보기(아래에 Chat, Document Parse 등)', '모델과 문서 읽기를 먼저 맛볼 때'],
        ['<b>API keys</b>', 'API 키 관리', '키를 만들고, 보고, 지울 때(레슨 5)'],
        ['<b>Billing</b>', '요금(아래에 Usage, Credit 등)', '얼마나 썼는지, 얼마 남았는지 볼 때'] ] }, p: [
        '업스테이지 콘솔(<code>console.upstage.ai</code>)은 API를 쓰는 데 필요한 것을 한곳에 모은 곳이에요. 화면이 영어라서 메뉴 이름을 영어 그대로 쓰고 뜻을 함께 적어요.',
        '시작 안내는 네 단계예요. 가입하고, API 키를 만들고, 첫 요청을 보내고, 다른 기능을 둘러봐요. 가입은 오른쪽 위 <b>Log in</b>에서 시작해요.',
        '메뉴 모양과 위치는 바뀔 수 있어요. 이름이 조금 달라도 같은 뜻의 메뉴를 찾으면 돼요.'
      ]},
      { t: 'say', h: '새 계정에는 무료 크레딧 $10', fig: 'credit10', p: [
        '새로 가입하면 <b>무료 크레딧 $10</b>을 받아요(2026년 10월 기준). 크레딧은 API를 쓴 만큼 줄어드는 선불 금액이에요.',
        '지금 가격으로 어림하면(부가세 별도) 20쪽 학습지를 Document Parse로 읽히는 데 약 $0.2, 학생 30명이 <code>solar-pro4</code>에게 질문 10개씩(질문마다 입력 2천·출력 3백 토큰쯤) 하는 데 약 $0.3이에요. 연수 실습은 작은 파일로 하면 이 안에서 충분히 해 볼 수 있어요.',
        '크레딧의 유효 기간과 카드 등록이 필요한지는 문서에서 확인되지 않았어요. 콘솔의 <b>Billing → Credit</b>에서 직접 확인해요.'
      ], tip: '결제 수단을 등록해 두면 크레딧이 떨어져도 API가 멈추지 않고 그 수단으로 청구돼요. 결제 수단 없이 크레딧이 모자라면 <code>403</code> 오류가 나요.' },
      { t: 'say', h: 'Playground: 코드 짜기 전에 먼저 물어봐요', fig: 'pgFig', p: [
        '<b>Playground</b>에서는 브라우저에서 바로 Chat(대화)과 Document Parse(문서 읽기)를 써 볼 수 있어요. API 키 없이도 체험할 수 있다는 안내가 있어요.',
        '수업에 쓸 질문을 먼저 넣어 보며 답의 수준을 가늠해요. "중학교 1학년에게"처럼 대상을 붙였을 때 설명이 어떻게 달라지는지 보면, 나중에 코드에 넣을 프롬프트가 정해져요.',
        'Playground는 <b>내가 시험하는 곳</b>이에요. 학생이 쓸 도구는 내 프로그램이 API로 불러서 만들어요. 모델 고르기 같은 세부 칸은 바뀌기 쉬우니 실제 화면에서 확인해요.'
      ]},
      { t: 'say', h: 'Usage와 속도 제한도 알아 둬요', fig: 'rateFig', p: [
        '<b>Billing</b> 아래 <b>Usage</b>에서는 얼마나 썼는지와 한도를, <b>Credit</b>에서는 남은 크레딧과 내역을 봐요. 실습한 날에는 한 번씩 들여다보는 습관을 들여요.',
        'API에는 <b>속도 제한</b>이 있어요. 1분에 보낼 수 있는 요청 수(RPM)와 토큰 수(TPM)가 정해져 있고, 넘으면 <code>429</code> 오류가 나요. 지금 <code>solar-pro4</code>는 분당 100번 안팎인데, 등급마다 다르니 직접 확인해요.',
        '그래서 반 학생 30명이 <b>키 하나로 동시에</b> 부르는 도구는 금방 걸릴 수 있어요. 기다렸다 다시 보내는 방법은 단원 3, 학생당 횟수 제한은 과정 3에서 다뤄요.'
      ]},
      { t: 'sim', h: '콘솔을 한 바퀴 둘러봐요', p: 'Playground의 Chat에서 수업 질문을 하나 보내 보고, Billing 아래 Usage와 Credit도 열어 보세요.',
        scene: SCENE,
        steps: [
          { goal: 'Playground 아래 Chat을 눌러요', click: 'nav:Chat', then: { page: 'Chat', blocks: [CHAT_H, { k: 'chat', msgs: [], ph: '질문을 적어요', empty: '코드 없이 바로 물어볼 수 있어요' }] },
            say: '<b>Playground</b>는 코드 없이 브라우저에서 모델을 써 보는 곳이에요. 모델 고르기 같은 세부 칸은 실제 화면에서 확인해요.' },
          { goal: '수업 질문을 적어요', type: Q1, into: 'chat', say: '대상(중학교 1학년)과 길이(두 문장)를 정해 주는 질문이에요.' },
          { goal: '보내요', click: 'btn:send', then: { blocks: [CHAT_H, { k: 'chat', msgs: [{ me: Q1 }, { ai: A1 }], ph: '질문을 적어요' }] },
            say: '답이 왔어요. 그대로 쓰기 전에 맞는지, 우리 반 수준인지 직접 읽어 봐요.' },
          { goal: 'Billing 아래 Usage를 눌러요', click: 'nav:Usage', then: { page: 'Usage', blocks: [{ k: 'h', text: 'Usage', sub: 'Billing' }, { k: 'p', text: '얼마나 썼는지, 한도는 얼마인지 보는 곳이에요.' }, { k: 'note', text: '실제 표와 그래프 모양은 콘솔에서 직접 확인해요.' }] },
            say: '<b>Usage</b>(사용량)에서는 쓴 양과 한도를 봐요. 실습한 날에 한 번씩 들러요.' },
          { goal: 'Credit을 눌러요', click: 'nav:Credit', then: { page: 'Credit', blocks: [{ k: 'h', text: 'Credit', sub: 'Billing' }, { k: 'kv', rows: [['남은 크레딧', '$10.00 (예시)']] }, { k: 'note', text: '무료 크레딧의 유효 기간은 문서에 없어요. 이 화면에서 직접 확인해요.', tone: 'warn' }] },
            say: '<b>Credit</b>(크레딧)은 남은 금액과 내역을 보는 곳이에요. 새 계정은 $10을 받아요(2026년 10월 기준).' } ],
        end: 'Playground로 먼저 써 보고, Usage·Credit으로 쓴 만큼을 확인해요.' },
      { t: 'q', kind: 'mc', fig: 'q_429', q: '반 학생 30명이 내 키 하나로 만든 질문 도우미를 수업 시작과 동시에 한꺼번에 썼어요. 몇몇 학생 화면에 <code>429</code> 오류가 떴어요. 가장 그럴듯한 까닭은?',
        opts: ['크레딧이 수업 중에 다 떨어졌다', '학생들이 쓰는 API 키가 틀렸다', '속도 제한(분당 요청 수)을 넘었다', 'Playground에서 먼저 시험하지 않았다'], a: 2,
        why: '<code>429</code>는 너무 많은 요청, 곧 속도 제한에 걸렸다는 뜻이에요. 잠깐 기다렸다 다시 보내고, 학생당 횟수 제한을 둬요.',
        ex: ['크레딧 부족은 <code>403</code>이에요.', '키가 틀리면 <code>401</code>이에요. 몇몇 학생만 안 되는 것도 키 문제와 맞지 않아요.', '', 'Playground 시험 여부와 이 오류는 상관없어요. 한꺼번에 몰린 게 문제예요.'] },
      { t: 'q', kind: 'mc', fig: 'q_creditOut', q: '결제 카드를 등록해 둔 계정에서 무료 크레딧 $10을 다 썼어요. 그다음 API 호출은 어떻게 될까요?',
        opts: ['멈추지 않고, 등록한 결제 수단으로 청구된다', '모든 호출이 바로 멈추고 다음 달까지 기다린다', '무료 크레딧 $10이 저절로 다시 채워진다', 'Playground만 되고 API는 막힌다'], a: 0,
        why: '결제 수단이 있으면 크레딧이 떨어져도 멈추지 않고 청구돼요. 그래서 Usage를 자주 보고, 학생용 도구에는 횟수 제한을 둬요.',
        ex: ['', '결제 수단 없이 크레딧이 모자랄 때 <code>403</code>으로 막혀요. 이 계정은 카드가 있어요.', '무료 크레딧은 가입할 때 받는 거예요. 저절로 다시 채워진다는 안내는 없어요.', '결제 수단이 있으면 API도 계속 돼요. 대신 돈이 나가요.'] },
      { t: 'q', kind: 'blank', fig: 'q_pgBlank', q: '코드 없이 브라우저에서 Solar에게 수업 질문을 먼저 해 보려 해요. 빈칸에 들어갈 메뉴는?', lang: 'plain',
        code: src(['console.upstage.ai', '→ [[1]] → Chat', '→ 질문을 적고 보내기']),
        opts: ['Billing', 'API keys', 'Home', 'Playground'], a: 3,
        why: '<b>Playground</b> 아래 <b>Chat</b>에서 코드 없이 바로 물어볼 수 있어요. 같은 Playground 아래에 Document Parse도 있어요.',
        ex: ['Billing은 쓴 양과 남은 크레딧을 보는 곳이에요.', 'API keys는 키를 만들고 관리하는 곳이에요. 코드로 부를 때 필요해요.', 'Home은 첫 화면이에요. Chat은 Playground 아래에 있어요.', ''] },
      { t: 'sum', pts: ['콘솔 메뉴: Home, Playground(Chat·Document Parse), API keys, Billing(Usage·Credit). 영어 이름 그대로, 모양은 바뀔 수 있다.', '새 계정은 무료 크레딧 $10(2026년 10월 기준). 유효 기간은 Billing → Credit에서 직접 확인. 결제 수단이 있으면 다 써도 청구된다.', 'Playground는 내가 시험하는 곳, 학생 도구는 API로. 속도 제한을 넘으면 429, 키 하나로 30명이 동시에 쓰면 걸릴 수 있다.'] }
    ]},

    /* =================== QB =================== */
    { id: 'QB', type: 'quiz', title: '헷갈림 퀴즈 ②', sub: 'API 키와 비밀번호, Usage와 Credit, Playground와 API', min: 3, steps: [
      { t: 'q', kind: 'mc', fig: 'qb_keyPw', q: '동료가 "API 키가 채팅방에 올라갔지만 콘솔 비밀번호는 안 샜으니 괜찮아요"라고 해요. 어떻게 답할까요?',
        opts: ['맞아요. 비밀번호가 있어야 키를 쓸 수 있어요', '맞아요. 키는 콘솔 안에서만 쓰여요', '아니에요. 비밀번호를 바꾸면 키도 저절로 바뀌니 비밀번호부터 바꿔요', '아니에요. 키만 있으면 누구든 쓸 수 있으니 새 키로 바꿔요'], a: 3,
        why: '로그인 비밀번호는 <b>사람이 콘솔에 들어갈 때</b>, API 키는 <b>프로그램이 API를 부를 때</b> 쓰는 열쇠예요. 키는 비밀번호 없이도 혼자 통해요. 샜으면 API keys에서 지우고 새로 만들어요.',
        ex: ['API를 부를 때는 키만 보내요. 비밀번호는 쓰이지 않아요.', '키는 콘솔 밖, 어느 컴퓨터의 코드에서든 쓰여요. 그래서 위험해요.', '비밀번호를 바꾸면 키도 바뀐다는 안내는 없어요. 새어 나간 키는 직접 지워야 해요.', ''] },
      { t: 'q', kind: 'blank', fig: 'qb_usageCredit', q: 'Billing 아래 두 메뉴를 알맞게 짝지어 보세요.', lang: 'plain',
        code: src(['이번 주에 얼마나 썼고 한도는 얼마인지', '→ Billing → [[1]]', '무료 크레딧이 얼마 남았는지', '→ Billing → [[2]]']),
        opts: [['Credit', 'Usage'], ['Usage', 'Credit'], ['Usage', 'API keys'], ['Playground', 'Credit']], a: 1,
        why: '<b>Usage</b>는 쓴 양과 한도, <b>Credit</b>은 남은 크레딧과 내역이에요. 둘 다 Billing 아래에 있어요.',
        ex: ['두 칸이 서로 바뀌었어요.', '', '둘째 칸이 틀렸어요. API keys는 키를 만드는 곳이에요.', '첫 칸이 틀렸어요. Playground는 써 보는 곳이지 사용량을 보는 곳이 아니에요.'] },
      { t: 'q', kind: 'mc', fig: 'qb_pgApi', q: 'Playground에서 해 본 "힌트만 주는 설명"이 마음에 들었어요. 이걸 반 학생 30명이 쓰게 하려면?',
        opts: ['내 콘솔 계정을 학생들과 같이 써서 Playground에 들어오게 한다', '학생마다 내 API 키를 나눠 주고 각자 쓰게 한다', '같은 프롬프트로 내 프로그램이 API를 부르게 한다', 'Playground 화면을 녹화해 학생에게 보여 준다'], a: 2,
        why: 'Playground는 내가 시험하는 곳이에요. 학생이 쓸 도구는 내 프로그램이 키를 들고 API로 부르고, 학생은 그 화면만 써요. 과정 3에서 이렇게 만들어요.',
        ex: ['계정을 나눠 쓰면 누가 무엇을 했는지 모르고, 키·결제까지 다 열려요.', 'API 키는 학생에게 나눠 주지 않아요. 한 명만 퍼뜨려도 내 크레딧이 새요.', '', '녹화는 보여 줄 뿐, 학생이 직접 묻고 답을 받을 수 없어요.'] }
    ]},

    /* =================== L5 =================== */
    { id: 'L5', type: 'lesson', title: 'API 키 만들고 지키기', sub: 'Create new key, .env, 샜을 때', min: 10, win: 'console', steps: [
      { t: 'say', h: 'API 키는 내 계정으로 들어가는 열쇠예요', fig: 'keyDoor', p: [
        '<b>API 키</b>는 프로그램이 API를 부를 때 "누가 부르는지" 보여 주는 긴 문자열이에요. 업스테이지 키는 <code>up_</code>으로 시작해요.',
        '키로 부른 만큼 <b>그 키 주인의 크레딧</b>이 줄어요. 키를 손에 넣은 사람은 내 계정으로 마음껏 부를 수 있다는 뜻이에요.',
        '비밀번호와 달리 키는 코드·파일·스크린샷에 섞여 퍼지기 쉬워요. 그래서 <b>처음부터 둘 곳을 정해 두는</b> 게 중요해요.'
      ]},
      { t: 'say', h: '만드는 길: API keys → Create new key', fig: 'createKey', p: [
        '콘솔의 <b>API keys</b> 페이지에서 <b>Create new key</b>(새 키 만들기)를 눌러요. 만든 키도 이 페이지에서 봐요. 예전 문서에는 버튼 이름이 Create API Key로 나와 있어서, 화면이 이 앱과 조금 다를 수 있어요.',
        '이름을 붙일 수 있다면 <code>연수용</code>, <code>수업도구용</code>처럼 <b>용도</b>로 붙여요. 나중에 하나가 새도 어느 키를 지울지 바로 알아요.',
        '키가 보이면 복사해 <b>곧바로</b> <code>.env</code>에 붙여 넣어요. 메모장, 메신저 "나에게 보내기", 사진으로 따로 남기지 않아요.'
      ]},
      { t: 'say', h: '키는 .env에만, 다른 곳엔 절대', fig: 'keyPlaces', code: { lang: 'plain', src: src(['# .env  ← Git에 올리지 않는 파일', 'UPSTAGE_API_KEY=up_••••••••7f3a', '', '# .gitignore', '.env']) }, p: [
        '키는 연습 폴더의 <code>.env</code> 파일에 <code>UPSTAGE_API_KEY</code>라는 이름으로 적고, <code>.gitignore</code>에 <code>.env</code>를 적어 Git에 올라가지 않게 해요. 코드는 <code>os.environ["UPSTAGE_API_KEY"]</code>로 꺼내 써요(단원 3).',
        '<b>안 되는 곳</b>은 코드 안, GitHub, 연수 단체 채팅방, 화면 공유·스크린샷, 그리고 Cursor 에이전트 채팅 창이에요. 에이전트에게는 "키는 <code>.env</code>에 있어"라고만 말해요.'
      ]},
      { t: 'say', h: '샜다면 바로: 지우고, 새로 만들고, 바꿔요', fig: 'leakFix', p: [
        '키를 GitHub에 올렸거나 채팅방에 붙였다면, 커밋이나 메시지를 지워도 <b>이미 누가 복사했을 수 있어요</b>. 그래서 글을 지우는 것보다 <b>키를 지우는 게</b> 먼저예요.',
        '콘솔 <b>API keys</b>에서 새어 나간 키를 지우고, 새 키를 만들어 <code>.env</code>의 값을 바꿔요. 지운 키로 부르면 <code>401</code> 오류가 나니, 옛 키가 남은 곳도 금방 드러나요.',
        '그다음 <b>Usage</b>에서 내가 쓰지 않은 사용이 있었는지 보고, <code>.gitignore</code>에 <code>.env</code>가 빠져 있었다면 고쳐요.'
      ]},
      { t: 'say', h: '학생에게 내 키를 나눠 주지 않아요', fig: 'serverWall', p: [
        '학생 30명에게 키를 나눠 주면 누가 얼마나 썼는지 알 수 없고, 한 명만 퍼뜨려도 내 크레딧이 새요. 학생이 집에서 친구에게 넘겨도 막을 길이 없어요.',
        '그래서 키는 <b>내 프로그램(서버) 안에만</b> 두고, 학생은 그 프로그램의 화면만 써요. 학생 화면에서 질문이 오면 서버가 키를 들고 업스테이지에 대신 물어봐요. 과정 3의 Streamlit 앱이 이 구조예요.',
        '연수장에서도 같아요. 옆자리 선생님과 키를 같이 쓰지 말고, 각자 가입해 자기 키를 만들어요.'
      ]},
      { t: 'sim', h: '연수용 키를 만들어 봐요', p: 'API keys에서 Create new key를 눌러 <code>연수용</code> 키를 만들고, 복사까지 해 보세요.',
        scene: SCENE,
        steps: [
          { goal: 'API keys 메뉴를 눌러요', click: 'nav:API keys', then: { page: 'API keys', blocks: [KEYS_H, { k: 'p', text: '만든 키는 이 페이지에서 봐요.' }] },
            say: '키를 만들고 보는 <b>API keys</b> 페이지예요.' },
          { goal: 'Create new key를 눌러요', click: 'b:Create new key', then: { dlg: { title: 'Create new key', blocks: [{ k: 'field', id: 'name', label: '키 이름(용도)', ph: '예: 연수용' }, { k: 'btns', btns: ['만들기'] }] } },
            say: '<b>Create new key</b>(새 키 만들기)를 눌렀어요. 이름 칸과 확인 버튼의 실제 이름·모양은 조금 다를 수 있어요.' },
          { goal: '이름에 연수용을 적어요', type: '연수용', into: 'f:name', say: '용도로 이름을 붙이면 나중에 어떤 키를 지울지 헷갈리지 않아요.' },
          { goal: '만들기를 눌러요', click: 'b:만들기', then: { dlg: { title: 'Create new key', blocks: [{ k: 'note', text: '키를 복사해 바로 <code>.env</code>에 넣어요. 메모장·채팅방에는 붙이지 않아요.', tone: 'warn' }, { k: 'secret', value: 'up_••••••••••••7f3a', btn: '복사' }] } },
            say: '키가 만들어졌어요. 업스테이지 키는 <code>up_</code>으로 시작해요. 여기서는 가린 가짜 키예요.' },
          { goal: '키를 복사해요', click: 'b:복사', then: { toast: '복사했어요. 이제 .env에 붙여 넣어요.' },
            say: '복사한 키는 곧바로 <code>.env</code>에 붙여 넣어요. 다른 곳에 잠깐 붙여 두지 않아요.' },
          { goal: '창을 닫아요', click: 'btn:close', then: { dlg: null, toast: null, blocks: [KEYS_H, { k: 'table', head: ['이름', '키'], rows: [['연수용', 'up_••••••••7f3a']] }] },
            say: '목록에 <code>연수용</code> 키가 생겼어요. 샜다면 여기서 그 키를 지우고 새로 만들어요.' } ],
        end: '키는 복사해 곧바로 .env로. 코드·GitHub·채팅방·화면 공유에는 절대 올리지 않아요.' },
      { t: 'q', kind: 'mc', fig: 'q_leakGit', q: '수업 자료 저장소를 GitHub에 올렸는데, <code>.env</code>까지 함께 올라간 걸 발견했어요. 가장 먼저 할 일은?',
        opts: ['콘솔에서 그 키를 지우고 새 키를 만든다', '저장소에서 <code>.env</code>를 지우는 커밋을 하나 더 올린다', '저장소를 비공개로 바꾼다', '키 이름을 <code>연수용</code>에서 다른 이름으로 바꾼다'], a: 0,
        why: '올라간 순간 누가 복사했을 수 있어요. 파일을 지워도 기록과 복사본은 남으니, <b>키 자체를 지우고</b> 새로 만들어요. 그다음 <code>.gitignore</code>를 고쳐요.',
        ex: ['', '지우는 커밋을 올려도 지난 기록에 키가 남아 있어요. 키부터 막아요.', '비공개로 바꾸기 전에 이미 복사됐을 수 있어요.', '이름을 바꿔도 키 값은 그대로라 여전히 쓸 수 있어요.'] },
      { t: 'q', kind: 'line', fig: 'q_keyLine', q: '동료가 만든 <code>hello.py</code>의 위쪽이에요. <b>고쳐야 할 줄</b>을 눌러 보세요.', lang: 'py',
        code: src(['import os', 'MODEL = "solar-pro4"', 'URL = "https://api.upstage.ai/v1"', 'KEY = "up_••••••••7f3a"', 'print("모델:", MODEL)']), a: 3,
        why: '키를 코드에 직접 적으면 코드를 공유하거나 커밋할 때 키도 함께 퍼져요. 키는 <code>.env</code>에 두고 <code>os.environ["UPSTAGE_API_KEY"]</code>로 꺼내요.' },
      { t: 'q', kind: 'order', fig: 'q_leakOrder', q: '연수 단체 채팅방에 실수로 내 API 키를 붙였어요. 할 일을 순서대로 쌓아 보세요.',
        items: ['채팅방에 키를 붙였다는 걸 알아챈다', '콘솔 API keys에서 그 키를 지우고 새 키를 만든다', '.env의 키 값을 새 키로 바꾼다', '코드를 다시 돌려 새 키로 되는지 확인한다'],
        why: '알아채면 바로 새어 나간 키부터 막아요. 새 키가 있어야 .env를 바꾸고, 바꿔야 새 키로 되는지 확인할 수 있어요.' },
      { t: 'q', kind: 'mc', fig: 'q_neighbor', q: '연수장에서 옆자리 선생님이 "가입 메일이 아직 안 와서요. 선생님 키 좀 같이 써도 될까요?"라고 해요. 어떻게 할까요?',
        opts: ['내 키를 메신저로 보내 주고 연수가 끝나면 지운다', '내 노트북을 넘겨 내 키로 실습하게 한다', '내 <code>.env</code> 파일을 USB로 복사해 준다', '키는 나누지 않고, 가입부터 함께 해결한다'], a: 3,
        why: '키는 사람마다 따로예요. 나눠 준 키는 어디로 퍼질지 몰라요. 키 없이도 체험할 수 있다는 안내가 있는 Playground로 먼저 따라가고, 가입 문제는 연수 운영진과 함께 풀어요.',
        ex: ['메신저에 보낸 순간 키가 새어 나간 거예요. 기록에도 남아요.', '내 키로 부른 비용과 기록이 모두 내 계정에 쌓이고, 누가 무엇을 했는지도 섞여요.', '파일로 넘겨도 키를 나눠 준 건 같아요.', ''] },
      { t: 'sum', pts: ['API 키는 프로그램이 API를 부르는 열쇠(up_로 시작). 키로 부른 만큼 그 키 주인의 크레딧이 줄어든다.', 'API keys → Create new key, 이름은 용도로. 키는 .env에만, .gitignore에 .env. 코드·GitHub·채팅방·화면 공유·에이전트 채팅에는 절대 올리지 않는다.', '샜으면 글보다 키를 먼저 지우고 새로 만든다. 학생에게는 키를 주지 않고, 키는 내 프로그램(서버) 안에만 둔다.'] }
    ]},

    /* =================== M1 =================== */
    { id: 'M1', type: 'mission', title: '콘솔 가입부터 키 보관까지', sub: '콘솔과 내 Cursor에서 직접', min: 25,
      where: '업스테이지 콘솔 + upstage-lab 폴더',
      intro: '이번 단원에서 배운 것을 진짜 콘솔과 내 컴퓨터로 해 봐요. 학생 개인정보는 어디에도 넣지 않아요. 끝낸 것부터 체크하고, 한 줄 메모도 남겨요.',
      tasks: [
        { do: '업스테이지 콘솔에 가입하고 메뉴를 확인해요',
          how: '<code>console.upstage.ai</code>에 들어가 오른쪽 위 <b>Log in</b>에서 가입·로그인해요. 왼쪽 메뉴에서 Home, Playground, API keys, Billing을 찾아요.',
          check: '네 메뉴를 다 찾았으면 성공. 이름이 조금 다르면 같은 뜻의 메뉴 이름을 메모해 둬요.' },
        { do: 'Playground의 Chat에서 수업 질문 3개를 해 봐요',
          how: 'Playground → Chat. ① 개념 설명: "중학교 1학년에게 변수를 생활 속 비유로 설명해 줘." ② 문제 만들기: "반복문 이해를 확인하는 객관식 3문제를 만들어 줘." ③ 피드백: 가명 학생의 짧은 코드를 붙이고 "정답 대신 힌트 하나만 줘." 실제 학생 이름·답안은 넣지 않아요.',
          check: '세 답 가운데 그대로 쓰기 어려운 곳(틀린 내용, 수준이 안 맞는 말 등)을 하나 찾아 메모에 적으면 성공.' },
        { do: 'Billing에서 크레딧과 사용량을 확인해요',
          how: 'Billing → <b>Credit</b>에서 남은 크레딧과 유효 기간(보이면)을, <b>Usage</b>에서 방금 쓴 양이 잡혔는지 봐요.',
          check: '남은 크레딧과 유효 기간을 메모에 적으면 성공. 유효 기간이 안 보이면 "안 보임"이라고 적어요.' },
        { do: 'upstage-lab 폴더에 키 자리를 먼저 마련해요',
          how: '빈 폴더 <code>upstage-lab</code>을 만들어 Cursor로 열고, 아래 부탁을 에이전트에게 붙여 넣어요. 키는 아직 넣지 않아요. 파이썬 환경은 단원 3에서 더해요.',
          check: '터미널에서 <code>git log --oneline</code>에 커밋이 하나 있고, <code>git check-ignore .env</code>가 <code>.env</code>를 출력하면 성공.',
          prompt: '이 폴더(upstage-lab)는 업스테이지 API 실습 폴더야. 진짜 API 키는 내가 나중에 직접 .env에 넣을 거야.\n해 줄 일:\n1) git init\n2) .gitignore에 .env와 .venv/ 두 줄 넣기\n3) .env.example에 UPSTAGE_API_KEY= 한 줄 넣기(값은 비워 둬)\n4) 이 두 파일만 "실습 폴더 준비" 메시지로 첫 커밋\n조건: .env 파일은 만들지 말고, 키를 묻거나 어떤 파일에도 쓰지 마.\n확인: 끝나면 git status와 git check-ignore -v .env 결과를 보여 줘.' },
        { do: '연수용 키를 만들어 .env에만 넣어요',
          how: '콘솔 <b>API keys</b> → <b>Create new key</b>, 이름은 <code>연수용</code>. 키를 복사해 Cursor 편집기에서 <code>upstage-lab/.env</code> 파일을 새로 만들고 <code>UPSTAGE_API_KEY=</code> 뒤에 직접 붙여 넣어요. 에이전트 채팅 창에는 붙이지 않아요.',
          check: '<code>git status</code>에 <code>.env</code>가 보이지 않고, 키를 따로 적어 둔 메모·메신저가 없으면 성공.' },
        { do: '연수 지도의 준비물을 점검해요',
          how: '이 앱의 <b>연수 지도</b> 탭 → 연수 전 준비물에서 업스테이지 콘솔 계정 항목을 체크하고, 남은 항목(Cursor·Python, 개인정보 없는 수업자료 2~3개, 충전기·핫스팟)을 훑어봐요.',
          check: '아직 못 한 준비물을 메모에 적어 두면 성공.' }
      ],
      note: '예상 비용: Playground 질문이 크레딧에서 빠지는지는 문서에서 확인하지 못했어요. Usage에서 직접 봐요. 같은 질문 3개를 API로 부른다면 지금 가격으로 어림해 <code>solar-pro4</code>로 $0.01도 안 돼요(입력 600·출력 2,400토큰쯤 ≈ $0.003). 키가 샜다고 느끼면 망설이지 말고 API keys에서 지우고 새로 만들어요.' },

    /* =================== T1 =================== */
    { id: 'T1', type: 'test', title: '단원 형성평가', sub: '10문제 · 7문제 이상 맞히면 통과', min: 11, pass: 0.7, steps: [
      { t: 'q', kind: 'mc', fig: 't_noBuild', q: '학교에서 쓰는 코딩 수업 플랫폼에 자동채점이 이미 잘 돌아가요. 그런데 학생들이 채점 결과를 보고도 왜 틀렸는지 몰라 해요. 이 단원에서 배운 대로라면 무엇을 만들까요?',
        opts: ['자동채점까지 처음부터 새로 만든다', '채점 결과를 보고 힌트를 주는 작은 도우미만 만든다', '플랫폼을 그만 쓰고 범용 AI 채팅을 쓰게 한다', '학생에게 API 키를 나눠 준다'], a: 1,
        why: '이미 잘 되는 건 그대로 쓰고, 빈 곳(왜 틀렸는지 알려 주기)만 작게 만들어 채워요. 과정 4에서 채점 결과를 튜터에게 넘기는 흐름을 만들어요.',
        ex: ['이미 잘 되는 채점을 다시 만들 이유가 없어요. 빈 곳만 채워요.', '', '범용 채팅은 우리 반 채점 결과를 몰라요. 정답을 통째로 줄 수도 있어요.', '학생에게 키를 나눠 주면 안 돼요.'] },
      { t: 'q', kind: 'mc', fig: 't_lecture', q: '연수 1일차 강의 중 한 선생님이 물었어요. "소버린 AI가 중요하다면, 외국 모델로 만든 도구는 다 버려야 하나요?" 가장 알맞은 답은?',
        opts: ['아니요. 모델을 바꿔 쓸 수 있게 해 두면 돼요', '네. 소버린 AI는 외국 모델을 쓰지 않는 거예요', '아니요. 소버린 AI는 대기업 이야기라 학교와는 상관없어요', '네. 외국 모델은 한국어를 전혀 못 해요'], a: 0,
        why: '핵심은 선택지와 통제권이에요. 학생 데이터를 어디서 처리하는지 따지고, 한 모델에 묶이지 않게(<code>MODEL</code> 변수 하나로 바꿀 수 있게) 만들어 두면 돼요.',
        ex: ['', '외국 모델을 금지하자는 뜻이 아니에요.', '교육 데이터 보호, 한국어·교육 맥락, 공급 안정은 학교와도 바로 이어져요.', '외국 모델도 한국어를 해요. 얼마나 잘하는지는 따로 따져 봐요.'] },
      { t: 'q', kind: 'mc', fig: 't_score', q: '어느 모델 소개 글에 "한국어 점수가 경쟁 모델의 110%"라고 쓰여 있어요. 이 숫자를 수업 자료에 옮길 때 가장 먼저 확인할 것은?',
        opts: ['숫자가 클수록 좋으니 확인 없이 그대로 옮긴다', '모델 이름이 한국어 이름인지 영어 이름인지', '누가 어떤 시험으로 잰 점수인지', '그 모델이 경쟁 모델보다 값이 싼지'], a: 2,
        why: '모델 점수는 회사가 직접 발표한 경우가 많아요. 누가, 어떤 시험으로 쟀는지 밝히고 독립 검증과 구분해 적어요.',
        ex: ['출처와 시험을 모르면 숫자가 무엇을 뜻하는지 알 수 없어요.', '이름은 점수를 믿을 만한지와 상관없어요.', '', '가격은 다른 이야기예요. 점수를 옮길 때는 출처부터 봐요.'] },
      { t: 'q', kind: 'blank', fig: 't_twoTasks', q: '두 가지 일에 알맞은 것을 골라 빈칸을 채워 보세요.', lang: 'plain',
        code: src(['기말 학습지 PDF를 Markdown으로', '바꾸기: [[1]]', '학생 질문 1,000개를 "질문/잡담"으로', '가볍게 나누기: [[2]]']),
        opts: [['Information Extract', 'solar-pro4'], ['Document Parse', 'solar-mini4'], ['임베딩', 'solar-mini4'], ['Document Parse', 'Information Extract']], a: 1,
        why: '문서를 구조 있는 글로 바꾸는 건 <b>Document Parse</b>, 많이 부르는 가벼운 분류는 <code>solar-mini4</code>예요.',
        ex: ['첫 칸이 틀렸어요. Information Extract는 정한 칸만 뽑아요. 둘째 칸도 가벼운 일에 대표 모델은 비싸요.', '', '첫 칸이 틀렸어요. 임베딩은 뜻을 숫자로 바꿔요.', '둘째 칸이 틀렸어요. Information Extract는 문서에서 값을 뽑는 제품이에요.'] },
      { t: 'q', kind: 'line', fig: 't_rules', q: '단원 3에서 Cursor 에이전트에게 줄 <code>AGENTS.md</code> 규칙을 미리 적어 봤어요. <b>틀린 줄</b>을 눌러 보세요.', lang: 'md',
        code: src(['- 모델 이름은 MODEL 변수 하나에 모은다', '- 기본 모델은 solar-pro4', '- 키는 .env의 UPSTAGE_API_KEY', '- 주소는 https://api.upstage.ai/v1/solar']), a: 3,
        why: '옛 예제의 주소예요. 지금 문서의 주소는 <code>https://api.upstage.ai/v1</code>이에요. 에이전트가 옛 예제를 베껴 오지 않게 규칙에 정확히 적어요.' },
      { t: 'q', kind: 'order', fig: 't_firstDay', q: '연수 첫날 실습에서 Solar를 처음 부르기까지, 순서대로 쌓아 보세요.',
        items: ['콘솔에 가입하고 로그인한다', 'API keys에서 Create new key로 키를 만든다', '키를 복사해 upstage-lab의 .env에 붙여 넣는다', '코드가 .env에서 키를 읽어 첫 요청을 보낸다'],
        why: '계정이 있어야 키를 만들고, 키가 .env에 있어야 코드가 읽어 쓸 수 있어요. .gitignore는 키를 넣기 전에 미리 적어 둬요.' },
      { t: 'q', kind: 'mc', fig: 't_403', q: '연수장에서 다 같이 같은 코드를 돌렸는데, 한 선생님만 <code>403</code> 오류가 나요. 키 이름도 맞고, 다른 선생님들은 잘 돼요. 무엇부터 확인할까요?',
        opts: ['Billing에서 크레딧과 결제 상태', '코드의 모델 이름을 <code>solar-pro3</code>로 바꿔 보기', '30초 기다렸다 다시 보내기만 되풀이하기', '옆 선생님 키를 빌려 쓰기'], a: 0,
        why: '<code>403</code>은 크레딧 부족(결제 실패 등)일 때 나요. Billing의 Credit과 결제 상태부터 봐요.',
        ex: ['', '<code>solar-pro3</code>는 끝난 모델이에요. 모델 이름은 403의 까닭이 아니에요.', '기다렸다 다시 보내기는 <code>429</code>(너무 많은 요청)일 때 쓰는 방법이에요.', '키는 나눠 쓰지 않아요.'] },
      { t: 'q', kind: 'mc', fig: 't_agentPaste', q: 'Cursor 에이전트에게 "이 키로 Solar 부르는 코드 짜 줘: up_…"처럼 키를 붙여 부탁하려는 동료에게 알려 줄 말로 알맞은 것은?',
        opts: ['괜찮아요. 에이전트는 대화가 끝나면 키를 기억하지 않아요', '키 앞 몇 글자만 지우고 붙이면 안전해요', 'Ask 모드로 물으면 파일을 안 바꾸니 괜찮아요', '키 위치(.env)만 알려 주고 키는 붙이지 않아요'], a: 3,
        why: '채팅에 붙인 내용은 답을 만들려고 밖으로 보내지고 대화 기록에도 남아요. 에이전트에게는 키가 <b>어디 있는지</b>만 알려 주면 돼요.',
        ex: ['기억 여부와 상관없이, 붙인 순간 키가 내 컴퓨터 밖으로 나가요.', '글자를 지운 키는 쓸 수 없어서 결국 진짜 키를 다시 붙이게 돼요. 처음부터 .env로 해요.', 'Ask도 붙인 내용은 똑같이 보내요. 모드와 상관없어요.', ''] },
      { t: 'q', kind: 'mc', fig: 't_version', q: '응답의 <code>model</code> 칸에 <code>solar-mini4-260922</code>가 찍혔어요. 뒤의 <code>260922</code>가 알려 주는 것은?',
        opts: ['계정에 남은 크레딧', '한 번에 읽을 수 있는 토큰 수', '오늘 보낸 요청 수', '버전이 나온 날짜'], a: 3,
        why: '버전 이름 뒤 여섯 자리는 날짜예요. <code>solar-mini4-260922</code>는 2026년 9월 22일에 나온 버전이에요. 코드에는 별칭 <code>solar-mini4</code>를 써요.',
        ex: ['크레딧은 Billing → Credit에서 봐요.', '<code>solar-mini4</code>가 한 번에 읽는 양은 512K 토큰이에요. 이름에 들어 있지 않아요.', '요청 수는 Usage에서 봐요.', ''] },
      { t: 'q', kind: 'mc', fig: 't_expire', q: '연수 두 달 뒤 수업에서 쓰려는데, 가입 때 받은 무료 크레딧이 그때도 남아 있을지 궁금해요. 어떻게 알아볼까요?',
        opts: ['크레딧은 기한이 없으니 확인할 필요 없다', 'Playground에서 Solar에게 "내 크레딧 유효 기간 알려 줘"라고 묻는다', '콘솔 Billing → Credit에서 직접 확인한다', 'API keys에서 키를 새로 만들면 크레딧이 다시 생긴다'], a: 2,
        why: '무료 크레딧의 유효 기간은 문서에서 확인되지 않았어요. 내 계정의 <b>Billing → Credit</b>에서 직접 봐요.',
        ex: ['기한이 없다는 안내는 없어요. 직접 확인해요.', '모델은 내 계정 정보를 몰라요. 그럴듯하게 지어낼 수도 있어요.', '', '키를 새로 만들어도 크레딧은 늘지 않아요. 키와 크레딧은 따로예요.'] }
    ]}
    ]
  });
})();
