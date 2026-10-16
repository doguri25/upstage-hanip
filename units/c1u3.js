// 과정 1 · 단원 3 · 파이썬으로 Solar 부르기
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
  // 터미널 상자: 검은 바탕에 글 줄
  function term(P, x, y, w, h, lines, size) {
    const s = size || 11;
    P.rrect(x, y, w, h, 6, { fill: 'ink', fs: 'solid' });
    (lines || []).forEach((l, i) => P.text(x + 8, y + s + 8 + i * (s + 6), l, { mono: true, size: s, anchor: 'start', c: 'paper' }));
  }
  // 노트북
  function laptop(P, x, y, w, h, fill) {
    P.rrect(x, y, w, h, 8, { fill: fill || 'paper', w: 2 });
    P.path(`M${x - 6} ${y + h} L${x + w + 6} ${y + h} L${x + w + 12} ${y + h + 12} L${x - 12} ${y + h + 12} Z`, { fill: 'soft', gap: 5 });
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
  // 글자가 든 동그란 단추
  function chip(P, x, y, w, h, label, fill, size, mono) {
    P.rrect(x, y, w, h, 8, { fill: fill || 'paper', gap: 5, w: 1.6 });
    P.text(x + w / 2, y + h / 2 + (size || 13) * 0.36, label, { size: size || 13, weight: 700, mono: !!mono });
  }
  // 흩어진 카드(순서 문제용)
  function card(P, x, y) { P.rrect(x, y, 92, 70, 10, { fill: 'paper' }); }
  function cardsAsk(P) {
    ask(P, 116, 40, 22, 'warm');
    ask(P, 226, 112, 22, 'bad');
    ask(P, 30, 110, 20, 'accent');
  }
  function cross(P, cx, cy, r, c) {
    P.line(cx - r, cy - r, cx + r, cy + r, { c: c || 'bad', w: 3 });
    P.line(cx + r, cy - r, cx - r, cy + r, { c: c || 'bad', w: 3 });
  }
  function tick(P, cx, cy, r) { P.path(`M${cx - r} ${cy} L${cx - r * 0.3} ${cy + r * 0.7} L${cx + r} ${cy - r * 0.7}`, { c: 'good', w: 3.2 }); }
  function ask(P, x, y, size, c) { P.text(x, y, '?', { size: size || 22, weight: 700, c: c || 'warm' }); }
  // 작은 해(Solar 표시)
  function sun(P, cx, cy, r) {
    P.circle(cx, cy, r * 2, { fill: 'warm', fs: 'solid', w: 1.6 });
    for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; P.line(cx + Math.cos(a) * (r + 3), cy + Math.sin(a) * (r + 3), cx + Math.cos(a) * (r + 8), cy + Math.sin(a) * (r + 8), { c: 'warm', w: 2 }); }
  }
  // 업스테이지 서버: 하늘색 상자 + 해 + 이름
  function server(P, x, y, w, h, label) {
    P.rrect(x, y, w, h, 12, { fill: 'sky', gap: 6 });
    sun(P, x + w / 2, y + h / 2 - (label ? 8 : 0), Math.min(w, h) * 0.16);
    if (label) P.text(x + w / 2, y + h - 9, label, { size: 12, weight: 700 });
  }
  // 열쇠(고리 가운데가 x, y)
  function keyIcon(P, x, y, s) {
    s = s || 1;
    P.circle(x, y, 20 * s, { fill: 'hi', fs: 'solid', w: 2 });
    P.line(x + 10 * s, y, x + 36 * s, y, { w: 3 });
    P.line(x + 28 * s, y, x + 28 * s, y + 8 * s, { w: 3 });
    P.line(x + 34 * s, y, x + 34 * s, y + 6 * s, { w: 3 });
  }
  // 돋보기
  function magnifier(P, cx, cy, d) {
    P.circle(cx, cy, d, { fill: 'sky', gap: 6, w: 2.6 });
    P.line(cx + d * 0.36, cy + d * 0.36, cx + d * 0.66, cy + d * 0.72, { w: 5 });
  }
  // 메시지 한 줄(역할 이름 + 내용)
  function msgRow(P, x, y, w, role, text, fill) {
    P.rrect(x, y, w, 28, 8, { fill: fill || 'paper', gap: 5, w: 1.6 });
    P.text(x + 10, y + 19, role, { mono: true, size: 11, weight: 700, anchor: 'start' });
    if (text) P.text(x + 90, y + 19, text, { size: 11, anchor: 'start' });
  }

  /* ---------- 모의 화면에서 되풀이하는 조각 ---------- */
  const GITIGNORE = src(['.env', '.venv/']);
  const ENV = 'UPSTAGE_API_KEY=up_••••••••7f3a';
  const T0 = ['$ git init', 'Initialized empty Git repository'];
  const HELLO = src([
    'import os',
    'from dotenv import load_dotenv',
    'from openai import OpenAI',
    '',
    'load_dotenv()',
    'client = OpenAI(',
    '  api_key=os.environ["UPSTAGE_API_KEY"],',
    '  base_url="https://api.upstage.ai/v1",',
    ')',
    'MODEL = "solar-pro4"',
    '',
    'q = "변수를 한 문장으로 설명해 줘"',
    'msgs = [{"role": "user", "content": q}]',
    'resp = client.chat.completions.create(',
    '  model=MODEL,',
    '  messages=msgs,',
    '  reasoning_effort="none",',
    ')',
    'print(resp.choices[0].message.content)',
    'print("토큰:", resp.usage.total_tokens)'
  ]);
  const LAB_FILES = ['.venv/', '.env', '.gitignore', 'hello_solar.py'];
  const EMPTY_PANEL = { mode: 'Agent', model: 'Auto', msgs: [], input: '' };
  const panel = o => Object.assign({}, EMPTY_PANEL, o);
  const MODE_MENU = { title: 'Mode', items: ['Agent', 'Ask', 'Plan', 'Debug'] };
  const RULE_Q = '맨 위에 AGENTS.md를 만들고 업스테이지 규칙을 적어 줘. 모델은 MODEL 변수에 "solar-pro4"(가벼운 일은 "solar-mini4"), base_url은 https://api.upstage.ai/v1, 키는 .env의 UPSTAGE_API_KEY에서 읽기, reasoning_effort는 늘 적기, solar-pro3·solar-mini·/v1/solar 같은 옛 이름은 쓰지 않기. 다른 파일은 바꾸지 마.';
  const RULE_A = '<code>AGENTS.md</code>를 만들었어요. 모델·주소·키 읽는 법·<code>reasoning_effort</code>·옛 이름 금지·확인 방법을 짧게 적었어요. 다른 파일은 그대로예요.';
  const RULE_DONE = { title: 'AGENTS.md 규칙 쓰기', status: 'done' };
  const QUIZ_Q = 'quiz.py를 만들어 줘. 중학교 정보 "변수와 자료형" 복습용 4지선다 3문제를 Solar로 만들어 터미널에 출력해. 계획부터 보여 줘.';
  const PLAN_BAD = '계획이에요. 업스테이지 쿡북의 예제를 참고했어요.<ol><li><code>quiz.py</code> 새로 만들기, 키는 <code>.env</code>에서 읽기</li><li><code>model="solar-pro3"</code>로 퀴즈 3문제 요청</li><li>문제·보기·정답을 보기 좋게 출력</li><li><code>python quiz.py</code>로 실행해 확인</li></ol>';
  const FIX = '2단계의 solar-pro3는 2026-10-30에 끝나는 옛 이름이야. @AGENTS.md 규칙대로 MODEL = "solar-pro4"로 두고 reasoning_effort도 적어서 계획을 다시 보여 줘.';
  const PLAN_OK = '고친 계획이에요. AGENTS.md 규칙을 따랐어요.<ol><li><code>quiz.py</code> 새로 만들기, 키는 <code>.env</code>의 <code>UPSTAGE_API_KEY</code></li><li><code>MODEL = "solar-pro4"</code>, <code>reasoning_effort="none"</code>으로 3문제 요청</li><li>문제·보기·정답을 보기 좋게 출력</li><li><code>python quiz.py</code>로 실행해 확인</li></ol>';
  const BUILT = '계획대로 <code>quiz.py</code>를 만들었어요. 4단계로 실행해 볼게요.';
  const RAN = '실행했어요.<br>1. 값에 이름을 붙여 담아 두는 것은? ① 변수 ② 함수 ③ 반복문 ④ 조건문 (정답 ①)<br>… 3문제가 나왔고, 토큰은 412개 썼어요.';

  HANIP.unit({
    id: 'c1u3',
    course: '과정 1 · 시작',
    title: '단원 3 · 파이썬으로 Solar 부르기',
    goals: ['upstage-lab에 가상 환경·패키지·.env를 갖추고 hello_solar.py로 Solar 부르기', '응답에서 답·finish_reason·토큰을 꺼내고 오류 번호별로 대처하기', '스트리밍 챗봇을 만들고 AGENTS.md로 Cursor 에이전트에게 업스테이지 코드 맡기기'],
    checked: { date: '2026-10-16' },
    sources: [
      'https://console.upstage.ai/docs/getting-started',
      'https://console.upstage.ai/docs/capabilities/generate/chat',
      'https://console.upstage.ai/api/chat',
      'https://console.upstage.ai/docs/resources/error-codes',
      'https://console.upstage.ai/docs/guides/rate-limits',
      'https://console.upstage.ai/docs/models',
      'https://console.upstage.ai/docs/models/history',
      'https://www.upstage.ai/pricing/api',
      'https://github.com/UpstageAI/Solar-Pro4-Cookbook',
      'https://github.com/UpstageAI/upstage-extensions-hub',
      'https://github.com/openai/openai-python',
      'https://pypi.org/project/openai/',
      'https://pypi.org/project/python-dotenv/',
      'https://pypi.org/project/requests/',
      'https://docs.python.org/3/library/venv.html',
      'https://cursor.com/docs/rules',
      'https://cursor.com/docs/agent/plan-mode',
      'https://cursor.com/docs/agent/agents-window'
    ],

    skip: [
      { t: 'q', kind: 'mc', fig: 'k_baseUrl', q: 'OpenAI 파이썬 SDK(<code>from openai import OpenAI</code>)로 Solar를 부르려 해요. 클라이언트를 만들 때 키 말고 <b>꼭 함께 적어야</b> 하는 것은?',
        opts: ['<code>organization="upstage"</code>', '<code>model="gpt"</code>를 그대로 두기', '<code>base_url="https://api.upstage.ai/v1"</code>', '<code>import upstage</code> 한 줄 더하기'], a: 2,
        why: 'Solar는 OpenAI 호환 API라서 SDK는 그대로 쓰고 <b>주소(base_url)만</b> 업스테이지로 바꿔요. 빼면 요청이 OpenAI 서버로 가요.',
        ex: ['organization은 OpenAI 쪽 조직을 고르는 칸이에요. 요청을 업스테이지로 보내 주지 않아요.', 'model에는 <code>solar-pro4</code> 같은 업스테이지 모델 이름을 적어요. 그리고 어디로 갈지는 주소가 정해요.', '', '따로 더할 패키지는 없어요. openai 패키지 하나로 불러요.'] },
      { t: 'q', kind: 'mc', fig: 'k_keySafe', q: 'upstage-lab에서 API 키를 다루는 방법으로 가장 알맞은 것은?',
        opts: ['hello_solar.py 맨 위에 <code>KEY = "up_…"</code>로 적어 둔다', '<code>.env</code>에 적고 <code>.gitignore</code>에 <code>.env</code>를 넣은 뒤 <code>os.environ</code>으로 읽는다', 'AGENTS.md에 적어 두어 에이전트가 알아서 쓰게 한다', '실행할 때마다 <code>input()</code>으로 키를 쳐 넣는다'], a: 1,
        why: '키는 코드 밖 <code>.env</code>에, <code>.env</code>는 Git이 모른 척하게 <code>.gitignore</code>에 넣어요. 코드는 <code>load_dotenv()</code> 뒤 <code>os.environ["UPSTAGE_API_KEY"]</code>로 읽어요.',
        ex: ['코드에 쓴 키는 커밋·공유·화면 공유 때 함께 새요.', '', 'AGENTS.md는 커밋되고, 에이전트가 읽을 때 모델 쪽으로 보내져요. 키를 적는 곳이 아니에요.', '치는 동안 키가 화면에 그대로 보이고, 매번 치기도 번거로워요. 키는 .env에 두고 읽어요.'] },
      { t: 'q', kind: 'mc', fig: 'k_memory', q: 'Solar API로 만든 챗봇이 "예를 하나 들어 줘"에서 앞에서 무슨 이야기를 했는지 몰라요. 가장 알맞은 고침은?',
        opts: ['<code>stream=True</code>를 켜서 대화를 이어 받는다', 'temperature를 0으로 내려 기억을 또렷하게 한다', '같은 키로 부르면 서버가 기억하니 키를 바꾸지 않는다', '주고받은 메시지를 리스트에 모아 요청마다 통째로 보낸다'], a: 3,
        why: 'API는 앞 대화를 기억하지 않아요. user 질문과 assistant 답을 리스트(history)에 차례로 붙여 두고, 요청마다 그 리스트를 통째로 보내요.',
        ex: ['스트리밍은 답을 조각으로 받는 방식일 뿐, 기억과 상관없어요.', 'temperature는 답의 무작위성이에요. 기억과 상관없어요.', '서버는 키와 상관없이 대화를 저장해 두지 않아요. 기록은 내 코드가 들고 있어요.', ''] }
    ],

    figs: {
      /* ---------- 이미 알아요 점검 그림 ---------- */
      k_baseUrl: { w: 340, h: 200, label: '파이썬 파일이 OpenAI SDK 플러그를 들고 Solar 서버 앞에서 어디로 보낼지 고민하는 모습', draw(P) {
        file(P, 14, 40, 72, 86, 'hello.py', 'smile', 'paper', 11);
        P.rrect(104, 64, 70, 36, 8, { fill: 'hi', gap: 5 });
        P.text(139, 87, 'SDK', { size: 14, weight: 700 });
        P.line(174, 74, 190, 74, { w: 3 });
        P.line(174, 90, 190, 90, { w: 3 });
        ask(P, 206, 92, 26);
        server(P, 224, 40, 100, 84, 'Solar');
        P.text(170, 166, '어디로 보내지?', { size: 14, c: 'ink2' });
      }},
      k_keySafe: { w: 340, h: 200, label: '열쇠를 코드 쪽지, .env 쪽지, GitHub 중 어디에 둘지 고민하는 얼굴', draw(P) {
        keyIcon(P, 34, 44, 1);
        ask(P, 52, 96, 24);
        file(P, 100, 26, 66, 80, 'app.py', null, 'paper', 11);
        file(P, 180, 26, 66, 80, '.env', null, 'hi', 12);
        P.rrect(258, 34, 70, 60, 14, { fill: 'soft', gap: 6 });
        P.text(293, 69, 'GitHub', { size: 12, weight: 700 });
        person(P, 213, 198, 'wow', 0.6);
        P.text(70, 150, '열쇠는 어디에?', { size: 14, c: 'ink2' });
      }},
      k_memory: { w: 340, h: 200, label: '지난 대화 쪽지 더미와 앞 대화를 모르는 로봇', draw(P) {
        P.rrect(24, 30, 130, 30, 8, { fill: 'sky', gap: 5, w: 1.6 });
        P.rrect(24, 70, 130, 30, 8, { fill: 'paper', w: 1.6 });
        P.rrect(24, 110, 130, 30, 8, { fill: 'sky', gap: 5, w: 1.6 });
        P.text(89, 50, '질문 1', { size: 12 });
        P.text(89, 90, '답 1', { size: 12 });
        P.text(89, 130, '예를 들어 줘', { size: 12 });
        P.arrow(162, 86, 210, 86, { c: 'accent', w: 2.4, head: 9 });
        P.robot(262, 92, 0.6, { mood: 'wow' });
        ask(P, 310, 46, 24);
        P.text(170, 182, '앞 대화를 어떻게 알게 할까?', { size: 13, c: 'ink2' });
      }},

      /* ---------- L1 설명 그림 ---------- */
      labTree: { w: 340, h: 200, label: 'upstage-lab 폴더에 단원마다 파일이 하나씩 늘어나는 계단', draw(P) {
        folder(P, 12, 46, 120, 100, 'hi');
        P.face(72, 102, 40, { mood: 'happy' });
        P.text(72, 170, 'upstage-lab', { mono: true, size: 13, weight: 700 });
        const st = [['hello_solar.py', 96, 'hi'], ['parse.py', 60, 'paper'], ['search.py', 66, 'paper'], ['app.py', 50, 'paper'], ['agent.py', 60, 'paper']];
        st.forEach(([n, w, f], i) => {
          const x = 146 + i * 24, y = 150 - i * 28;
          P.rrect(x, y, w, 22, 6, { fill: f, gap: 5, w: 1.4 });
          P.text(x + w / 2, y + 15, n, { mono: true, size: 10, weight: 700 });
        });
        P.sparkle(320, 160, 6, 'hi');
        P.text(250, 24, '단원마다 하나씩 늘어요', { size: 13, c: 'accent' });
      }},
      venvBox: { w: 340, h: 200, label: '내 컴퓨터 안에 upstage-lab의 .venv 상자가 따로 있고, 그 안에 패키지 셋이 든 모습', draw(P) {
        laptop(P, 20, 18, 300, 138);
        P.rrect(36, 34, 160, 106, 10, { fill: 'hi', gap: 6 });
        P.text(116, 56, 'upstage-lab/.venv', { mono: true, size: 11, weight: 700 });
        chip(P, 46, 68, 66, 24, 'openai', 'paper', 11);
        chip(P, 120, 68, 66, 24, 'dotenv', 'paper', 11);
        chip(P, 80, 102, 76, 24, 'requests', 'paper', 11);
        P.rrect(210, 34, 96, 106, 10, { fill: 'sky', gap: 6 });
        P.text(258, 56, '다른 폴더', { size: 12, weight: 700 });
        P.face(258, 98, 34, { mood: 'smile' });
        P.text(170, 192, '프로젝트마다 따로 담아요', { size: 13, c: 'accent' });
      }},
      threePkgs: { w: 340, h: 200, label: '세 패키지: openai는 Solar 부르기, python-dotenv는 .env 읽기, requests는 파일 보내기', draw(P) {
        [['openai', 'Solar 부르기', 'sky'], ['python-dotenv', '.env 읽기', 'hi'], ['requests', '파일 보내기', 'good']].forEach(([n, r, c], i) => {
          const x = 12 + i * 110;
          P.rrect(x, 26, 98, 118, 10, { fill: c, gap: 7 });
          P.text(x + 49, 48, n, { mono: true, size: 11, weight: 700 });
          P.text(x + 49, 134, r, { size: 12, weight: 700 });
        });
        sun(P, 61, 88, 12);
        file(P, 151, 62, 40, 50, '.env', null, 'paper', 10);
        P.note(258, 66, 30, 40, { fill: 'paper' });
        P.arrow(294, 86, 320, 86, { c: 'accent', w: 2.2, head: 8 });
        P.text(170, 178, 'pip install 한 줄로 셋 다', { size: 13, c: 'accent' });
      }},
      envGit: { w: 340, h: 200, label: '.env 쪽지의 열쇠는 내 컴퓨터에 남고, .gitignore가 GitHub로 가는 길을 막는 모습', draw(P) {
        laptop(P, 14, 36, 132, 96);
        file(P, 26, 46, 54, 74, '.env', null, 'hi', 11);
        keyIcon(P, 40, 98, 0.5);
        file(P, 88, 46, 50, 74, '.py', 'smile', 'paper', 11);
        P.arrow(152, 84, 240, 84, { c: 'soft', w: 2.4, head: 9 });
        P.rrect(172, 54, 44, 60, 6, { fill: 'paper', w: 2 });
        cross(P, 194, 84, 12, 'bad');
        P.text(194, 134, '.gitignore', { mono: true, size: 11, weight: 700 });
        P.rrect(246, 50, 82, 70, 14, { fill: 'soft', gap: 6 });
        P.text(287, 90, 'GitHub', { size: 13, weight: 700 });
        P.text(80, 166, '내 컴퓨터에만', { size: 13, weight: 700, c: 'good' });
        P.text(170, 192, '키는 코드 밖, 커밋 밖', { size: 13, c: 'accent' });
      }},

      /* ---------- L1 문제 그림 ---------- */
      q_winAct: { w: 340, h: 200, label: '학교 Windows 노트북 터미널 앞에서 켜는 명령이 떠오르지 않는 얼굴', draw(P) {
        laptop(P, 20, 26, 190, 124);
        P.text(115, 48, 'Windows', { size: 13, weight: 700 });
        term(P, 34, 58, 162, 80, ['> python -m venv .venv', '> ________'], 11);
        person(P, 280, 196, 'wow', 0.8);
        ask(P, 280, 62, 28);
        P.text(115, 186, '켜는 명령이 뭐였지?', { size: 13, c: 'ink2' });
      }},
      q_pkgName: { w: 340, h: 200, label: '터미널의 pip install 줄에 빈칸이 있고 옆에 .env 쪽지가 있는 모습', draw(P) {
        term(P, 14, 30, 220, 60, ['$ pip install openai', '  ______ requests'], 12);
        file(P, 252, 24, 70, 84, '.env', null, 'hi', 13);
        keyIcon(P, 268, 84, 0.6);
        P.face(124, 132, 40, { mood: 'wink' });
        P.text(170, 186, '.env를 읽어 줄 패키지 이름은?', { size: 13, c: 'ink2' });
      }},
      q_pkgRole: { w: 340, h: 200, label: '패키지 이름 셋과 쓰임 카드 셋 사이의 물음표', draw(P) {
        ['openai', 'python-dotenv', 'requests'].forEach((n, i) => {
          P.rrect(14, 22 + i * 52, 110, 34, 8, { fill: 'sky', gap: 5, w: 1.6 });
          P.text(69, 44 + i * 52, n, { mono: true, size: 11, weight: 700 });
        });
        ['파일 보내기', '.env 읽기', 'Solar 부르기'].forEach((n, i) => {
          P.rrect(216, 22 + i * 52, 110, 34, 8, { fill: 'hi', gap: 5, w: 1.6 });
          P.text(271, 44 + i * 52, n, { size: 12, weight: 700 });
        });
        ask(P, 170, 96, 34);
        P.text(170, 190, '어떻게 짝지을까?', { size: 13, c: 'ink2' });
      }},
      q_setupOrder: { w: 340, h: 200, label: '뒤섞인 카드: 폴더, .venv 상자, 켜진 스위치, 내려받기 화살표, 실행 단추', draw(P) {
        card(P, 14, 16);
        folder(P, 32, 28, 56, 42, 'hi');
        card(P, 126, 58);
        P.rrect(140, 72, 64, 40, 8, { fill: 'sky', gap: 5 });
        P.text(172, 97, '.venv', { mono: true, size: 12, weight: 700 });
        card(P, 238, 14);
        P.rrect(262, 38, 44, 22, 11, { fill: 'good', fs: 'solid', w: 1.4 });
        P.circle(294, 49, 18, { fill: 'paper', fs: 'solid', w: 1.2 });
        card(P, 46, 118);
        P.arrow(92, 126, 92, 158, { c: 'accent', w: 2.4, head: 8 });
        P.line(72, 170, 112, 170, { w: 2.4 });
        card(P, 214, 118);
        P.path('M248 132 L282 153 L248 174 Z', { fill: 'good', gap: 5, w: 2 });
        cardsAsk(P);
      }},

      /* ---------- L2 설명 그림 ---------- */
      compatPlug: { w: 340, h: 200, label: 'OpenAI SDK 모양 코드가 주소만 바꿔 업스테이지 Solar로 가는 모습', draw(P) {
        file(P, 14, 40, 84, 100, 'hello.py', 'smile', 'paper', 12);
        P.arrow(100, 90, 116, 90, { c: 'ink2', w: 2, head: 7 });
        P.rrect(118, 68, 84, 44, 8, { fill: 'hi', gap: 5 });
        P.text(160, 87, 'OpenAI', { size: 12, weight: 700 });
        P.text(160, 103, 'SDK', { size: 12, weight: 700 });
        P.arrow(204, 90, 228, 90, { c: 'accent', w: 2.4, head: 8 });
        server(P, 232, 44, 96, 92, 'Solar');
        P.text(170, 162, 'base_url만 업스테이지로', { size: 13, weight: 700, c: 'accent' });
        P.text(170, 188, 'api.upstage.ai/v1', { mono: true, size: 12, c: 'ink2' });
      }},
      respBox: { w: 340, h: 200, label: '응답 상자 속 choices, message, content가 겹겹이 들어 있고 옆에 usage 상자', draw(P) {
        P.rrect(10, 14, 220, 150, 12, { fill: 'paper', w: 2 });
        P.text(22, 34, 'resp', { mono: true, size: 13, weight: 700, anchor: 'start' });
        P.rrect(22, 44, 196, 110, 10, { fill: 'sky', gap: 7 });
        P.text(32, 62, 'choices[0]', { mono: true, size: 11, anchor: 'start' });
        P.rrect(34, 70, 172, 76, 8, { fill: 'paper', w: 1.6 });
        P.text(44, 88, 'message', { mono: true, size: 11, anchor: 'start' });
        P.rrect(46, 96, 148, 40, 6, { fill: 'hi', gap: 5 });
        P.text(120, 121, 'content = 답 글', { size: 12, weight: 700 });
        P.rrect(240, 14, 90, 92, 10, { fill: 'good', gap: 7 });
        P.text(285, 34, 'usage', { mono: true, size: 12, weight: 700 });
        P.text(285, 58, 'prompt', { mono: true, size: 10 });
        P.text(285, 76, 'completion', { mono: true, size: 10 });
        P.text(285, 94, 'total', { mono: true, size: 10 });
        P.text(285, 128, '토큰 = 돈', { size: 13, weight: 700, c: 'accent' });
        P.face(285, 158, 28, { mood: 'happy' });
        P.text(120, 190, 'resp.choices[0].message.content', { mono: true, size: 10, c: 'ink2' });
      }},

      /* ---------- L2 문제 그림 ---------- */
      q_modelVar: { w: 340, h: 200, label: '코드 쪽지 맨 위의 MODEL 한 줄과 왜 변수로 두는지 묻는 얼굴', draw(P) {
        file(P, 14, 30, 176, 130, 'hello_solar.py', null, 'paper', 11);
        P.text(28, 82, 'MODEL = "solar-pro4"', { mono: true, size: 11, anchor: 'start', c: 's' });
        P.text(28, 108, 'model=MODEL', { mono: true, size: 11, anchor: 'start' });
        P.text(28, 134, 'model=MODEL', { mono: true, size: 11, anchor: 'start' });
        person(P, 272, 198, 'wow', 0.8);
        P.bubble(214, 10, 116, 44, 258, 90);
        P.text(272, 38, '왜 변수로?', { size: 14, weight: 700 });
      }},
      q_contentBlank: { w: 340, h: 200, label: 'print 괄호 안이 빈칸이고, 겹겹 상자 속 답 글을 꺼내려는 얼굴', draw(P) {
        P.rrect(14, 20, 220, 34, 8, { fill: 'paper', w: 1.8 });
        P.text(26, 42, 'print(resp.______)', { mono: true, size: 12, anchor: 'start' });
        P.rrect(30, 72, 160, 110, 10, { fill: 'sky', gap: 7 });
        P.rrect(50, 92, 120, 76, 8, { fill: 'paper' });
        P.rrect(70, 112, 80, 38, 6, { fill: 'hi', gap: 5 });
        P.text(110, 136, '답 글', { size: 12, weight: 700 });
        person(P, 280, 198, 'smile', 0.8);
        ask(P, 226, 124, 26);
      }},
      q_hardKey: { w: 340, h: 200, label: '코드 쪽지를 돋보기로 살피며 어느 줄인지 찾는 얼굴', draw(P) {
        file(P, 20, 20, 170, 150, 'hello_solar.py', null, 'paper', 11);
        [64, 88, 112, 136].forEach((y, i) => P.line(36, y, 160 - (i % 2) * 24, y, { c: ['k', 's', 'n', 't'][i], w: 3 }));
        magnifier(P, 196, 118, 54);
        person(P, 290, 198, 'wow', 0.7);
        P.text(280, 52, '어느 줄?', { size: 14, weight: 700, c: 'warm' });
      }},
      q_helloOrder: { w: 340, h: 200, label: '뒤섞인 카드: .env 쪽지, 플러그, 해로 가는 화살표, 답 말풍선', draw(P) {
        card(P, 14, 16);
        file(P, 40, 22, 40, 50, '.env', null, 'hi', 10);
        card(P, 126, 58);
        P.rrect(142, 76, 52, 32, 8, { fill: 'hi', gap: 5 });
        P.line(194, 84, 206, 84, { w: 3 });
        P.line(194, 100, 206, 100, { w: 3 });
        card(P, 238, 14);
        P.arrow(250, 50, 290, 50, { c: 'accent', w: 2.4, head: 8 });
        sun(P, 312, 38, 6);
        card(P, 46, 118);
        P.bubble(60, 128, 64, 34, 78, 176);
        P.text(92, 150, '답', { size: 13, weight: 700 });
        card(P, 214, 118);
        P.face(260, 153, 36, { mood: 'happy' });
        cardsAsk(P);
      }},

      /* ---------- QA 그림 ---------- */
      qa_noBase: { w: 340, h: 200, label: 'base_url 없이 출발한 요청이 갈림길에서 어디로 갈지 모르는 모습', draw(P) {
        file(P, 14, 56, 70, 84, 'hello.py', 'smile', 'paper', 11);
        P.line(88, 98, 140, 98, { c: 'ink2', w: 2.4 });
        P.curveArrow(140, 98, 170, 52, 222, 50, { c: 'soft', w: 2 });
        P.curveArrow(140, 98, 170, 146, 222, 148, { c: 'soft', w: 2 });
        ask(P, 152, 104, 28);
        server(P, 230, 14, 96, 74, 'Solar');
        P.rrect(230, 112, 96, 74, 12, { fill: 'soft', gap: 6 });
        P.text(278, 154, '다른 서버', { size: 12, weight: 700 });
        P.text(60, 30, 'base_url 빠짐', { size: 12, weight: 700, c: 'warm' });
      }},
      qa_keyErr: { w: 340, h: 200, label: '터미널에 KeyError가 뜨고 .env 쪽지를 들여다보는 어지러운 얼굴', draw(P) {
        term(P, 14, 20, 214, 66, ['$ python hello_solar.py', "KeyError: 'UPSTAGE_API_KEY'"], 10);
        file(P, 40, 104, 80, 84, '.env', null, 'hi', 12);
        magnifier(P, 150, 150, 44);
        person(P, 282, 198, 'dizzy', 0.8);
      }},
      qa_printResp: { w: 340, h: 200, label: 'print(resp)를 했더니 터미널에 긴 글이 줄줄이 쏟아져 어지러운 얼굴', draw(P) {
        term(P, 14, 18, 220, 120, ['$ python hello_solar.py', 'ChatCompletion(id=...,', '  choices=[Choice(', '    message=...)],', '  usage=...)'], 10);
        person(P, 288, 198, 'dizzy', 0.75);
        P.text(124, 170, '답 글만 보고 싶은데', { size: 13, c: 'ink2' });
      }},

      /* ---------- L3 설명 그림 ---------- */
      stopSign: { w: 340, h: 200, label: '답이 멈춘 세 가지 까닭: 다 썼어요, 잘렸어요, 도구 부르기', draw(P) {
        [['stop', '다 썼어요', 'good'], ['length', '잘렸어요', 'warm'], ['tool_calls', '도구 부르기', 'sky']].forEach(([k, t, c], i) => {
          const x = 12 + i * 110;
          P.rrect(x, 22, 98, 124, 10, { fill: c, gap: 7 });
          P.text(x + 49, 44, k, { mono: true, size: 12, weight: 700 });
          P.text(x + 49, 136, t, { size: 12, weight: 700 });
        });
        P.note(38, 56, 46, 56, { fill: 'paper' });
        tick(P, 61, 86, 12);
        P.path('M146 56 L190 56 L190 96 L182 104 L174 94 L166 106 L158 96 L146 104 Z', { fill: 'paper', w: 2 });
        P.line(258, 104, 286, 72, { w: 5 });
        P.circle(290, 66, 18, { w: 3 });
        P.text(170, 180, 'finish_reason', { mono: true, size: 13, weight: 700, c: 'accent' });
      }},
      tokenMeter: { w: 340, h: 200, label: '보낸 토큰과 만든 토큰이 계량기를 지나 동전이 되는 모습, 만든 쪽이 더 비싸요', draw(P) {
        P.rrect(14, 28, 104, 48, 8, { fill: 'sky', gap: 5 });
        P.text(66, 48, '보낸 토큰', { size: 12, weight: 700 });
        P.text(66, 66, '$0.30', { mono: true, size: 11 });
        P.rrect(14, 98, 104, 48, 8, { fill: 'hi', gap: 5 });
        P.text(66, 118, '만든 토큰', { size: 12, weight: 700 });
        P.text(66, 136, '$1.20', { mono: true, size: 11, weight: 700, c: 'bad' });
        P.arrow(122, 54, 158, 80, { c: 'ink2', w: 2, head: 8 });
        P.arrow(122, 120, 158, 96, { c: 'ink2', w: 2, head: 8 });
        P.circle(200, 88, 72, { fill: 'paper', w: 2.2 });
        P.line(200, 88, 220, 70, { w: 3 });
        P.text(200, 112, 'usage', { mono: true, size: 11 });
        P.arrow(240, 88, 262, 88, { c: 'accent', w: 2.2, head: 8 });
        P.circle(290, 74, 32, { fill: 'warm', gap: 4 });
        P.circle(302, 106, 32, { fill: 'warm', gap: 4 });
        P.text(170, 186, '100만 토큰당, 2026년 10월 기준', { size: 11, c: 'ink2' });
      }},
      errorDoors: { w: 340, h: 200, label: '401, 403, 429, 500 네 문을 내가 고칠 문과 기다렸다 다시 할 문으로 나눈 모습', draw(P) {
        ['401', '403', '429', '500'].forEach((n, i) => {
          const x = 14 + i * 80;
          P.rrect(x, 26, 66, 100, 8, { fill: i < 2 ? 'hi' : 'sky', gap: 6 });
          P.text(x + 33, 52, n, { mono: true, size: 16, weight: 700 });
        });
        keyIcon(P, 36, 92, 0.6);
        P.circle(127, 94, 28, { fill: 'warm', gap: 4 });
        P.text(127, 99, '$', { size: 13, weight: 700 });
        P.circle(207, 94, 30, { fill: 'paper', w: 2 });
        P.line(207, 94, 207, 84, { w: 2 });
        P.line(207, 94, 215, 98, { w: 2 });
        P.face(287, 94, 32, { mood: 'dizzy' });
        P.line(14, 140, 160, 140, { c: 'warm', w: 3 });
        P.text(87, 160, '내가 고쳐요', { size: 13, weight: 700, c: 'warm' });
        P.line(174, 140, 320, 140, { c: 'accent', w: 3 });
        P.text(247, 160, '기다렸다 다시', { size: 13, weight: 700, c: 'accent' });
        P.text(170, 190, '오류 번호가 고칠 곳을 알려 줘요', { size: 12, c: 'ink2' });
      }},
      backoff: { w: 340, h: 200, label: '429가 올 때마다 1초, 2초, 4초로 기다림이 두 배씩 길어지고 마지막에 성공하는 계단', draw(P) {
        P.line(14, 150, 326, 150, { w: 2 });
        [['1초', 1], ['2초', 2], ['4초', 4]].forEach(([t, k], i) => {
          const x = 30 + i * 80;
          P.rrect(x, 150 - k * 24, 50, k * 24, 6, { fill: 'sky', gap: 5 });
          P.text(x + 25, 170, t, { size: 13, weight: 700 });
          P.text(x + 25, 150 - k * 24 - 8, '429', { mono: true, size: 11, weight: 700, c: 'bad' });
        });
        tick(P, 290, 122, 14);
        P.text(290, 170, '성공', { size: 13, weight: 700, c: 'good' });
        P.text(170, 194, '기다림을 두 배씩: 지수 백오프', { size: 12, c: 'accent' });
      }},

      /* ---------- L3 문제 그림 ---------- */
      q_length: { w: 340, h: 200, label: '퀴즈 종이가 7번에서 뚝 끊겨 있고 놀란 얼굴', draw(P) {
        P.path('M20 16 L180 16 L180 128 L166 138 L152 126 L138 140 L124 126 L110 140 L96 126 L82 140 L68 126 L54 140 L40 126 L20 138 Z', { fill: 'paper', w: 2 });
        P.text(32, 42, '5. 자료형이란?', { size: 12, anchor: 'start' });
        P.text(32, 70, '6. 정수와 실수', { size: 12, anchor: 'start' });
        P.text(32, 98, '7. 문자열을 더하', { size: 12, anchor: 'start' });
        P.text(100, 172, 'finish_reason: "length"', { mono: true, size: 11, c: 'warm' });
        person(P, 270, 198, 'wow', 0.8);
      }},
      q_errTable: { w: 340, h: 200, label: '오류 번호 메모를 돋보기로 살피며 어느 줄이 틀렸는지 찾는 얼굴', draw(P) {
        P.note(20, 16, 170, 168, { fill: 'hi' });
        ['401', '403', '429', '500'].forEach((n, i) => {
          P.text(36, 52 + i * 34, n, { mono: true, size: 13, weight: 700, anchor: 'start' });
          P.line(80, 48 + i * 34, 170 - (i % 2) * 20, 48 + i * 34, { c: 'ink2', w: 2.4 });
        });
        person(P, 284, 198, 'wow', 0.7);
        P.text(276, 52, '어느 줄?', { size: 14, weight: 700, c: 'warm' });
      }},
      q_usageBlank: { w: 340, h: 200, label: '내 코드와 Solar 서버 사이를 오가는 두 화살표에 빈 이름표가 붙은 모습', draw(P) {
        P.rrect(14, 56, 80, 70, 10, { fill: 'paper', w: 2 });
        P.face(54, 88, 34, { mood: 'smile' });
        P.text(54, 146, '내 코드', { size: 12, weight: 700 });
        server(P, 246, 46, 80, 84, 'Solar');
        P.arrow(100, 70, 240, 70, { c: 'accent', w: 2.4, head: 9 });
        P.rrect(126, 40, 88, 22, 5, { c: 'accent', w: 1.4 });
        P.text(170, 56, '1번 칸', { size: 11, weight: 700 });
        P.arrow(240, 110, 100, 110, { c: 'good', w: 2.4, head: 9 });
        P.rrect(126, 118, 88, 22, 5, { c: 'good', w: 1.4 });
        P.text(170, 134, '2번 칸', { size: 11, weight: 700 });
        P.text(170, 182, 'usage 속 두 이름은?', { size: 13, c: 'ink2' });
      }},
      q_backoffOrder: { w: 340, h: 200, label: '뒤섞인 카드: 보내는 화살표, 429 표지, 짧은 모래시계, 긴 모래시계, 멈춤 표시', draw(P) {
        card(P, 14, 16);
        P.arrow(30, 52, 92, 52, { c: 'accent', w: 2.6, head: 9 });
        card(P, 126, 58);
        P.text(172, 100, '429', { mono: true, size: 20, weight: 700, c: 'bad' });
        card(P, 238, 14);
        P.path('M270 24 L300 24 L288 46 L300 68 L270 68 L282 46 Z', { fill: 'hi', gap: 5, w: 2 });
        card(P, 46, 118);
        P.path('M72 124 L112 124 L96 154 L112 182 L72 182 L88 154 Z', { fill: 'warm', gap: 5, w: 2 });
        card(P, 214, 118);
        cross(P, 260, 153, 16, 'bad');
        cardsAsk(P);
      }},
      q_dotVsBracket: { w: 340, h: 200, label: '점으로 꺼내는 상자와 대괄호로 꺼내는 상자 사이에서 갸웃하는 얼굴', draw(P) {
        P.rrect(14, 30, 140, 76, 10, { fill: 'sky', gap: 6 });
        P.text(84, 74, 'resp.choices', { mono: true, size: 12, weight: 700 });
        P.text(84, 128, 'hello_solar.py', { mono: true, size: 11, c: 'ink2' });
        P.rrect(186, 30, 140, 76, 10, { fill: 'hi', gap: 6 });
        P.text(256, 74, 'resp["choices"]', { mono: true, size: 12, weight: 700 });
        P.text(256, 128, '연습장', { size: 12, c: 'ink2' });
        P.face(170, 166, 38, { mood: 'wow' });
        ask(P, 210, 172, 24);
      }},

      /* ---------- L4 설명 그림 ---------- */
      streamDrip: { w: 340, h: 200, label: '답이 한꺼번에 오지 않고 글자 조각이 하나씩 흘러나와 화면에 쌓이는 모습', draw(P) {
        server(P, 14, 24, 90, 84, 'Solar');
        [['변수', 'hi'], ['는', 'sky'], ['값을', 'good'], ['담는', 'pink']].forEach(([t, c], i) => chip(P, 116 + i * 46, 30 + i * 12, 40, 24, t, c, 11));
        P.rrect(150, 116, 176, 58, 8, { fill: 'ink', fs: 'solid' });
        P.text(162, 150, '변수는 값을 담는…', { size: 12, c: 'paper', anchor: 'start' });
        P.text(60, 140, 'stream=True', { mono: true, size: 12, weight: 700, c: 'accent' });
        P.text(60, 164, 'delta.content', { mono: true, size: 11, c: 'ink2' });
        P.text(238, 194, '오는 대로 바로 찍어요', { size: 12, c: 'accent' });
      }},
      historyStack: { w: 340, h: 200, label: 'system, user, assistant, user 메시지를 통째로 쌓아 Solar로 보내는 모습', draw(P) {
        msgRow(P, 12, 18, 208, 'system', '눈높이 규칙', 'soft');
        msgRow(P, 12, 52, 208, 'user', '반복문이 뭐예요?', 'sky');
        msgRow(P, 12, 86, 208, 'assistant', '같은 일을 되풀이…', 'hi');
        msgRow(P, 12, 120, 208, 'user', '예를 들어 줘', 'sky');
        P.line(226, 22, 226, 144, { c: 'accent', w: 2.4 });
        P.arrow(230, 84, 252, 84, { c: 'accent', w: 2.4, head: 8 });
        server(P, 256, 44, 72, 82, 'Solar');
        P.text(116, 178, '매번 통째로 보내요', { size: 13, weight: 700, c: 'accent' });
      }},
      chatLoop: { w: 340, h: 200, label: '질문 입력, user로 붙이기, 기록 통째로 요청, 답을 assistant로 붙이기가 도는 원', draw(P) {
        const box = (x, y, t, f) => { P.rrect(x, y, 130, 40, 10, { fill: f, gap: 5, w: 1.6 }); P.text(x + 65, y + 25, t, { size: 12, weight: 700 }); };
        box(20, 20, '1. 질문 입력', 'paper');
        box(190, 20, '2. user로 붙이기', 'sky');
        box(190, 124, '3. 통째로 요청', 'hi');
        box(20, 124, '4. 답을 assistant로', 'good');
        P.arrow(152, 40, 186, 40, { c: 'accent', w: 2.2, head: 8 });
        P.arrow(255, 62, 255, 120, { c: 'accent', w: 2.2, head: 8 });
        P.arrow(188, 144, 154, 144, { c: 'accent', w: 2.2, head: 8 });
        P.arrow(85, 122, 85, 64, { c: 'accent', w: 2.2, head: 8 });
        P.text(170, 96, '"끝"이면 멈춰요', { size: 11, c: 'ink2' });
        P.text(170, 190, 'while True: 한 바퀴가 한 턴', { size: 12, c: 'accent' });
      }},
      trimHistory: { w: 340, h: 200, label: '긴 대화 기록에서 system은 남기고 오래된 앞부분을 가위로 잘라 내는 모습', draw(P) {
        P.rrect(14, 60, 40, 54, 6, { fill: 'soft', gap: 5 });
        P.text(34, 132, 'system', { mono: true, size: 10, weight: 700 });
        for (let i = 0; i < 7; i++) P.rrect(64 + i * 38, 60, 32, 54, 6, { fill: i < 3 ? 'paper' : 'sky', gap: 5, w: 1.6 });
        P.line(176, 44, 176, 126, { c: 'bad', w: 2.4 });
        P.circle(168, 30, 14, { w: 2 });
        P.circle(184, 30, 14, { w: 2 });
        P.text(118, 150, '오래된 것', { size: 12, c: 'ink2' });
        P.text(254, 150, '최근 것만', { size: 12, weight: 700, c: 'accent' });
        P.text(170, 186, 'system은 남기고 앞을 잘라요', { size: 13, c: 'accent' });
      }},

      /* ---------- L4 문제 그림 ---------- */
      q_deltaWhere: { w: 340, h: 200, label: '흘러오는 조각 상자 하나를 열어 글이 어디 들었는지 들여다보는 모습', draw(P) {
        server(P, 14, 46, 80, 84, 'Solar');
        chip(P, 102, 50, 34, 22, '..', 'hi', 11);
        chip(P, 106, 100, 34, 22, '..', 'sky', 11);
        P.rrect(150, 30, 176, 120, 10, { fill: 'paper', w: 2 });
        P.text(162, 52, 'chunk', { mono: true, size: 13, weight: 700, anchor: 'start' });
        P.rrect(162, 62, 152, 76, 8, { fill: 'sky', gap: 6 });
        P.text(172, 82, 'choices[0]', { mono: true, size: 11, anchor: 'start' });
        P.rrect(176, 92, 124, 34, 6, { c: 'warm', w: 1.6 });
        ask(P, 238, 117, 20);
        P.text(170, 184, '새로 온 글은 어디에?', { size: 13, c: 'ink2' });
      }},
      q_endBlank: { w: 340, h: 200, label: '조각 글이 줄마다 하나씩 찍혀 세로로 길어진 터미널과 어지러운 얼굴', draw(P) {
        term(P, 14, 14, 150, 176, ['변수', '는', ' 값', '을', ' 담', '는', ' 상자'], 12);
        person(P, 262, 198, 'dizzy', 0.8);
        P.text(256, 52, '한 줄로 이으려면?', { size: 13, weight: 700, c: 'warm' });
      }},
      q_resetLine: { w: 340, h: 200, label: '"예를 들어 줘"에 무엇의 예냐고 되묻는 어지러운 로봇', draw(P) {
        P.rrect(14, 16, 170, 34, 10, { fill: 'sky', gap: 5 });
        P.text(99, 38, '나: 반복문이 뭐예요?', { size: 12 });
        P.rrect(14, 60, 170, 34, 10, { fill: 'paper', w: 1.6 });
        P.text(99, 82, 'Solar: 같은 일을…', { size: 12 });
        P.rrect(14, 104, 170, 34, 10, { fill: 'sky', gap: 5 });
        P.text(99, 126, '나: 예를 들어 줘', { size: 12 });
        P.rrect(14, 148, 170, 34, 10, { fill: 'paper', w: 1.6 });
        P.text(99, 170, 'Solar: 무엇의 예요?', { size: 12 });
        P.robot(266, 104, 0.6, { mood: 'dizzy' });
        ask(P, 318, 44, 24);
      }},
      q_turnOrder: { w: 340, h: 200, label: '뒤섞인 카드: 키보드, user 쪽지, 해로 가는 화살표, assistant 쪽지', draw(P) {
        card(P, 14, 16);
        P.rrect(28, 34, 64, 34, 6, { fill: 'paper', w: 1.6 });
        for (let i = 0; i < 3; i++) P.line(34, 42 + i * 9, 86, 42 + i * 9, { c: 'soft', w: 3 });
        card(P, 126, 58);
        P.rrect(138, 78, 68, 28, 8, { fill: 'sky', gap: 5 });
        P.text(172, 97, 'user', { mono: true, size: 12, weight: 700 });
        card(P, 238, 14);
        P.arrow(250, 50, 290, 50, { c: 'accent', w: 2.4, head: 8 });
        sun(P, 312, 38, 6);
        card(P, 46, 118);
        P.rrect(52, 138, 80, 28, 8, { fill: 'hi', gap: 5 });
        P.text(92, 157, 'assistant', { mono: true, size: 11, weight: 700 });
        P.robot(266, 150, 0.4, { mood: 'wow' });
        cardsAsk(P);
      }},
      q_trimWhy: { w: 340, h: 200, label: '끝없이 길어지는 대화 두루마리 앞에서 계속 쌓아도 되는지 묻는 얼굴', draw(P) {
        P.rrect(20, 12, 120, 176, 10, { fill: 'paper', w: 2 });
        for (let i = 0; i < 9; i++) P.line(32 + (i % 2) * 14, 30 + i * 18, 128 - ((i * 3) % 4) * 10, 30 + i * 18, { c: i % 2 ? 'soft' : 'sky', w: 4 });
        person(P, 252, 198, 'wow', 0.8);
        P.bubble(176, 14, 156, 44, 236, 92);
        P.text(254, 42, '계속 쌓아도 돼?', { size: 13, weight: 700 });
      }},

      /* ---------- QB 그림 ---------- */
      qb_streamWhen: { w: 340, h: 200, label: '챗봇 화면, 밤샘 요약 파일, 채점 표 세 장면 앞에서 고민하는 얼굴', draw(P) {
        P.rrect(14, 20, 96, 90, 10, { fill: 'paper', w: 2 });
        P.rrect(22, 30, 56, 20, 8, { fill: 'sky', gap: 4, w: 1.2 });
        P.rrect(46, 58, 56, 20, 8, { fill: 'hi', gap: 4, w: 1.2 });
        P.text(62, 128, '챗봇 화면', { size: 12, weight: 700 });
        P.rrect(122, 20, 96, 90, 10, { fill: 'paper', w: 2 });
        P.path('M150 40 Q140 56 152 70 Q134 66 136 50 Q138 38 150 40 Z', { fill: 'hi', fs: 'solid', w: 1.4 });
        P.note(176, 40, 30, 40, { fill: 'paper' });
        P.text(170, 128, '밤샘 요약', { size: 12, weight: 700 });
        P.rrect(230, 20, 96, 90, 10, { fill: 'paper', w: 2 });
        for (let i = 0; i < 3; i++) P.line(240, 40 + i * 20, 316, 40 + i * 20, { c: 'soft', w: 2 });
        P.line(278, 30, 278, 96, { c: 'soft', w: 2 });
        P.text(278, 128, '채점 JSON', { size: 12, weight: 700 });
        P.face(170, 164, 36, { mood: 'wow' });
        ask(P, 206, 172, 24);
      }},
      qb_appendLate: { w: 340, h: 200, label: '마지막 user 칸이 빈 채로 요청 화살표가 먼저 출발하고, user 쪽지가 뒤늦게 달려오는 모습', draw(P) {
        msgRow(P, 12, 20, 200, 'system', '', 'soft');
        msgRow(P, 12, 54, 200, 'user', '', 'sky');
        msgRow(P, 12, 88, 200, 'assistant', '', 'hi');
        P.rrect(12, 122, 200, 28, 8, { c: 'soft', w: 1.6 });
        P.arrow(218, 84, 248, 84, { c: 'accent', w: 2.4, head: 8 });
        server(P, 252, 44, 76, 82, 'Solar');
        P.rrect(90, 162, 70, 26, 8, { fill: 'sky', gap: 5, w: 1.6 });
        P.text(125, 180, 'user', { mono: true, size: 12, weight: 700 });
        P.line(60, 170, 82, 170, { c: 'soft', w: 2 });
        P.line(52, 180, 82, 180, { c: 'soft', w: 2 });
        P.face(200, 176, 26, { mood: 'wow' });
      }},
      qb_envVsVar: { w: 340, h: 200, label: '.env 쪽지와 os.environ 상자 사이가 어떻게 이어지는지 묻는 모습', draw(P) {
        file(P, 14, 36, 90, 104, '.env', null, 'hi', 13);
        keyIcon(P, 36, 104, 0.6);
        P.rrect(226, 50, 100, 80, 10, { fill: 'sky', gap: 6 });
        P.text(276, 96, 'os.environ', { mono: true, size: 12, weight: 700 });
        P.line(110, 90, 220, 90, { c: 'soft', w: 2 });
        ask(P, 165, 82, 30);
        P.text(170, 180, '둘은 어떻게 이어질까?', { size: 13, c: 'ink2' });
      }},

      /* ---------- L5 설명 그림 ---------- */
      oldExample: { w: 340, h: 200, label: '옛 예제 책에서 solar-pro3를 베껴 오는 로봇과 10월 30일에 끝나는 달력', draw(P) {
        P.rrect(14, 34, 110, 104, 8, { fill: 'soft', gap: 6 });
        P.text(69, 58, '옛 예제', { size: 13, weight: 700 });
        P.text(69, 90, 'solar-pro3', { mono: true, size: 11, c: 'bad' });
        P.text(69, 112, '/v1/solar', { mono: true, size: 11, c: 'bad' });
        P.arrow(128, 90, 150, 90, { c: 'ink2', w: 2, head: 7 });
        P.robot(186, 96, 0.55, { mood: 'wink' });
        P.rrect(240, 40, 86, 86, 8, { fill: 'paper', w: 2 });
        P.rect(241, 41, 84, 22, { fill: 'bad', fs: 'solid', c: null });
        P.text(283, 57, '10월', { size: 12, weight: 700, c: 'paper' });
        P.text(283, 104, '30', { size: 26, weight: 700 });
        P.text(283, 146, '옛 모델 종료', { size: 12, weight: 700, c: 'bad' });
        P.text(170, 186, '에이전트도 옛 예제를 닮기 쉬워요', { size: 12, c: 'accent' });
      }},
      agentsMdNote: { w: 340, h: 200, label: 'upstage-lab 맨 위 AGENTS.md를 에이전트가 일을 시작할 때마다 읽는 모습', draw(P) {
        folder(P, 14, 40, 150, 110, 'hi');
        file(P, 40, 62, 98, 76, 'AGENTS.md', 'happy', 'paper', 11);
        P.text(89, 172, 'upstage-lab', { mono: true, size: 12, weight: 700 });
        P.curveArrow(142, 80, 190, 48, 224, 74, { c: 'accent', w: 2 });
        P.robot(262, 92, 0.6, { mood: 'happy' });
        P.text(262, 172, '일하기 전에 먼저 읽어요', { size: 12, weight: 700, c: 'accent' });
      }},
      planFirst: { w: 340, h: 200, label: '계획 쪽지의 solar-pro3 줄을 고친 다음 Build 단추로 가는 순서', draw(P) {
        P.note(14, 16, 160, 160, { fill: 'paper' });
        P.text(28, 42, 'Plan', { size: 14, weight: 700, anchor: 'start' });
        P.text(28, 72, '1. quiz.py 만들기', { size: 11, anchor: 'start' });
        P.text(28, 98, '2. solar-pro3', { mono: true, size: 11, anchor: 'start', c: 'bad' });
        P.line(44, 94, 112, 94, { c: 'bad', w: 2 });
        P.text(44, 120, 'solar-pro4', { mono: true, size: 11, anchor: 'start', c: 'good' });
        P.text(28, 148, '3. 실행해 확인', { size: 11, anchor: 'start' });
        P.arrow(182, 96, 214, 96, { c: 'accent', w: 2.4, head: 9 });
        chip(P, 220, 80, 76, 32, 'Build', 'good', 14);
        P.text(258, 140, 'Build는 그다음', { size: 12, c: 'ink2' });
        P.face(258, 172, 26, { mood: 'happy' });
      }},
      verifyRun: { w: 340, h: 200, label: '에이전트가 다 됐다고 해도 내 터미널에서 실행·검색·git status로 직접 확인하는 모습', draw(P) {
        P.robot(56, 70, 0.5, { mood: 'proud' });
        P.bubble(10, 116, 96, 34, 56, 104);
        P.text(58, 138, '다 됐어요!', { size: 12, weight: 700 });
        term(P, 120, 28, 206, 92, ['$ python quiz.py', '$ grep -n solar quiz.py', '$ git status --short'], 11);
        [46, 63, 80].forEach(y => tick(P, 308, y, 6));
        P.text(222, 160, '확인은 내 손으로', { size: 14, weight: 700, c: 'accent' });
      }},

      /* ---------- L5 문제 그림 ---------- */
      q_whyRule: { w: 340, h: 200, label: 'AGENTS.md 쪽지를 앞에 두고 모델 이름까지 적어야 하는지 갸웃하는 얼굴', draw(P) {
        file(P, 30, 30, 120, 140, 'AGENTS.md', null, 'hi', 12);
        [76, 100, 124, 148].forEach((y, i) => P.line(46, y, 134 - (i % 2) * 20, y, { c: 'ink2', w: 2.4 }));
        person(P, 262, 198, 'wow', 0.8);
        P.bubble(190, 10, 140, 48, 250, 92);
        P.text(260, 40, '이것까지 적어?', { size: 13, weight: 700 });
      }},
      q_badRuleLine: { w: 340, h: 200, label: 'AGENTS.md 초안을 돋보기로 살피며 지울 줄을 찾는 얼굴', draw(P) {
        file(P, 20, 16, 170, 168, 'AGENTS.md', null, 'paper', 12);
        [66, 88, 110, 132, 154].forEach((y, i) => P.line(36, y, 166 - (i % 3) * 22, y, { c: ['k', 's', 'n', 't', 'k'][i], w: 3 }));
        magnifier(P, 196, 124, 52);
        person(P, 292, 198, 'wow', 0.65);
        P.text(284, 52, '어느 줄?', { size: 14, weight: 700, c: 'warm' });
      }},
      q_agentOrder: { w: 340, h: 200, label: '뒤섞인 카드: AGENTS.md 쪽지, Plan 말풍선, 빨간 펜, Build 단추, 터미널', draw(P) {
        card(P, 14, 16);
        P.note(36, 24, 46, 54, { fill: 'hi' });
        card(P, 126, 58);
        P.bubble(136, 66, 72, 34, 150, 116);
        P.text(172, 88, 'Plan', { size: 13, weight: 700 });
        card(P, 238, 14);
        P.line(256, 70, 300, 26, { c: 'bad', w: 5 });
        P.path('M252 74 L258 64 L262 70 Z', { fill: 'bad', fs: 'solid', w: 1.2 });
        card(P, 30, 120);
        chip(P, 42, 138, 68, 30, 'Build', 'good', 12);
        card(P, 214, 120);
        term(P, 224, 132, 72, 44, ['$ _'], 12);
        cardsAsk(P);
      }},
      q_trustRun: { w: 340, h: 200, label: '로봇이 다 됐다며 뿌듯해하고, 정말일까 고민하는 얼굴', draw(P) {
        P.robot(90, 106, 0.7, { mood: 'proud' });
        P.bubble(132, 14, 110, 40, 120, 64);
        P.text(187, 40, '잘 돌아요!', { size: 13, weight: 700 });
        person(P, 276, 198, 'wow', 0.8);
        ask(P, 306, 74, 26);
        P.sparkle(30, 30, 6, 'hi');
      }},

      /* ---------- T1 그림 ---------- */
      t_noModule: { w: 340, h: 200, label: '연수장 노트북 터미널에 ModuleNotFoundError가 뜬 모습과 어지러운 얼굴', draw(P) {
        term(P, 14, 20, 226, 82, ['$ python hello_solar.py', 'ModuleNotFoundError:', "No module named 'openai'"], 11);
        P.text(127, 130, '연수장 노트북', { size: 13, weight: 700 });
        P.text(127, 156, '어제는 깔았는데', { size: 12, c: 'ink2' });
        person(P, 292, 198, 'dizzy', 0.7);
      }},
      t_class429: { w: 340, h: 200, label: '학생 서른 명이 한 키로 동시에 요청을 보내 서버 앞이 막힌 모습', draw(P) {
        const moods = ['smile', 'happy', 'wink'];
        for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) P.face(26 + c * 30, 40 + r * 34, 24, { mood: moods[(r + c) % 3] });
        P.arrow(136, 60, 196, 70, { c: 'soft', w: 2, head: 8 });
        P.arrow(136, 80, 196, 80, { c: 'soft', w: 2, head: 8 });
        P.arrow(136, 100, 196, 90, { c: 'soft', w: 2, head: 8 });
        server(P, 206, 30, 112, 100, 'Solar');
        P.text(262, 158, '429', { mono: true, size: 22, weight: 700, c: 'bad' });
        P.text(70, 158, '학생 30명', { size: 13, weight: 700 });
        P.text(70, 184, '한 키로 동시에', { size: 12, c: 'ink2' });
      }},
      t_streamBlank: { w: 340, h: 200, label: '조각 상자에서 글을 꺼내 answer 그릇에 모으는 모습, 꺼내는 칸과 모으는 기호가 빈칸', draw(P) {
        P.rrect(14, 24, 130, 96, 10, { fill: 'paper', w: 2 });
        P.text(26, 46, 'chunk', { mono: true, size: 13, weight: 700, anchor: 'start' });
        P.rrect(26, 56, 106, 52, 8, { c: 'warm', w: 1.6 });
        ask(P, 79, 90, 22);
        P.arrow(150, 72, 196, 100, { c: 'accent', w: 2.4, head: 9 });
        P.path('M200 104 Q260 176 320 104 Z', { fill: 'hi', gap: 6, w: 2 });
        P.text(260, 128, 'answer', { mono: true, size: 12, weight: 700 });
        chip(P, 226, 40, 32, 22, '..', 'sky', 11);
        chip(P, 266, 54, 32, 22, '..', 'good', 11);
        P.text(170, 186, '조각을 모아 한 답으로', { size: 13, c: 'ink2' });
      }},
      t_streamOrder: { w: 340, h: 200, label: '뒤섞인 카드: user 쪽지, 물결 화살표, 조각이 담기는 그릇, assistant 쪽지', draw(P) {
        card(P, 14, 16);
        P.rrect(24, 38, 72, 28, 8, { fill: 'sky', gap: 5 });
        P.text(60, 57, 'user', { mono: true, size: 12, weight: 700 });
        card(P, 126, 58);
        P.path('M136 94 Q150 76 164 94 T192 94 T214 90', { c: 'accent', w: 2.6 });
        card(P, 238, 14);
        P.path('M250 44 Q284 90 318 44 Z', { fill: 'hi', gap: 5, w: 2 });
        P.rrect(270, 22, 14, 12, 3, { fill: 'good', fs: 'solid', w: 1 });
        card(P, 46, 118);
        P.rrect(52, 140, 80, 28, 8, { fill: 'hi', gap: 5 });
        P.text(92, 159, 'assistant', { mono: true, size: 11, weight: 700 });
        P.robot(266, 150, 0.4, { mood: 'happy' });
        cardsAsk(P);
      }},
      t_oldHandout: { w: 340, h: 200, label: '연수 전에 받은 옛 예제 종이를 돋보기로 살피는 얼굴과 11월 달력', draw(P) {
        P.note(16, 16, 160, 168, { fill: 'paper' });
        for (let i = 0; i < 7; i++) P.line(30 + (i % 3) * 8, 40 + i * 20, 158 - ((i * 5) % 4) * 14, 40 + i * 20, { c: ['k', 's', 'n', 't'][i % 4], w: 3 });
        magnifier(P, 182, 126, 50);
        P.rrect(250, 18, 76, 70, 8, { fill: 'paper', w: 2 });
        P.rect(251, 19, 74, 20, { fill: 'accent', fs: 'solid', c: null });
        P.text(288, 34, '11월', { size: 12, weight: 700, c: 'paper' });
        P.text(288, 72, '연수', { size: 16, weight: 700 });
        person(P, 282, 198, 'wow', 0.6);
      }},
      t_cutQuiz: { w: 340, h: 200, label: '학습지 20문항을 부탁했는데 15번 중간에서 끊긴 종이와 놀란 얼굴', draw(P) {
        P.path('M20 30 L190 30 L190 140 L176 150 L162 138 L148 152 L134 138 L120 152 L106 138 L92 152 L78 138 L64 152 L50 138 L20 150 Z', { fill: 'paper', w: 2 });
        P.text(34, 56, '13. …', { size: 12, anchor: 'start' });
        P.text(34, 84, '14. …', { size: 12, anchor: 'start' });
        P.text(34, 112, '15. 반복문으로', { size: 12, anchor: 'start' });
        P.text(105, 182, '20문항을 부탁했는데', { size: 13, c: 'ink2' });
        person(P, 274, 198, 'wow', 0.8);
      }},
      t_untracked: { w: 340, h: 200, label: 'git status의 Untracked files에 .env가 보여 놀란 얼굴', draw(P) {
        term(P, 14, 20, 222, 100, ['$ git status', 'Untracked files:', '  .env', '  quiz.py'], 11);
        P.text(125, 150, 'GitHub에 올리기 직전', { size: 13, c: 'ink2' });
        person(P, 290, 198, 'wow', 0.75);
      }},
      t_credit403: { w: 340, h: 200, label: '연수 2일차 오후, 노트북에 403이 떠서 갸웃하는 얼굴', draw(P) {
        laptop(P, 20, 26, 190, 118);
        term(P, 34, 40, 162, 90, ['$ python app.py', 'Error code: 403'], 11);
        P.text(115, 180, '어제까지 잘 됐는데', { size: 13, c: 'ink2' });
        person(P, 282, 196, 'wow', 0.8);
        ask(P, 282, 66, 26);
      }},
      t_404: { w: 340, h: 200, label: '로봇은 잘 된다는데 내 터미널에는 404가 뜬 모습', draw(P) {
        P.robot(66, 92, 0.6, { mood: 'proud' });
        P.bubble(14, 140, 108, 34, 66, 132);
        P.text(68, 162, '잘 돌아요!', { size: 12, weight: 700 });
        term(P, 140, 30, 186, 76, ['$ python quiz.py', 'Error code: 404'], 11);
        person(P, 234, 198, 'dizzy', 0.6);
      }},
      t_effortGone: { w: 340, h: 200, label: '코드에서 한 줄을 지웠더니 모래시계가 길어지고 토큰 막대가 커진 모습', draw(P) {
        P.rrect(14, 24, 196, 108, 8, { fill: 'paper', w: 2 });
        P.text(26, 50, 'model=MODEL,', { mono: true, size: 11, anchor: 'start' });
        P.text(26, 76, 'messages=msgs,', { mono: true, size: 11, anchor: 'start' });
        P.text(26, 102, 'reasoning_effort=…', { mono: true, size: 11, anchor: 'start', c: 'soft' });
        P.line(22, 98, 160, 98, { c: 'bad', w: 2.4 });
        P.path('M244 24 L294 24 L276 62 L294 100 L244 100 L262 62 Z', { fill: 'hi', gap: 5, w: 2 });
        P.rrect(232, 116, 22, 30, 4, { fill: 'sky', fs: 'solid', w: 1.2 });
        P.rrect(264, 86, 22, 60, 4, { fill: 'warm', fs: 'solid', w: 1.2 });
        P.text(276, 166, '토큰', { size: 12, weight: 700 });
        P.face(112, 166, 34, { mood: 'wow' });
      }}
    },

    items: [
    /* =================== L1 =================== */
    { id: 'L1', type: 'lesson', title: 'upstage-lab 만들기', sub: '연습 폴더, 가상 환경, 패키지 셋, .env와 .gitignore', min: 12, win: 'ide', steps: [
      { t: 'say', h: '연수 실습은 upstage-lab 폴더 하나에서 자라요', fig: 'labTree', p: [
        '기반연수 1일차 13:00 「Solar로 보는 LLM의 원리」 실습부터 2일차 트랙 실습까지, 이 과정은 <b>연습 폴더 <code>upstage-lab</code> 하나</b>에서 해요. 첫 파일은 이번 단원의 <code>hello_solar.py</code>이고, 단원마다 <code>parse.py</code>, <code>search.py</code>, <code>app.py</code>처럼 하나씩 늘어나요.',
        '폴더가 하나면 좋은 점이 셋이에요. 가상 환경과 키(<code>.env</code>)를 한 번만 준비하면 되고, 단원마다 커밋해 두면 되돌릴 수 있고, 에이전트 규칙(<code>AGENTS.md</code>)도 한곳에 모여요.',
        '폴더는 커서한입에서 익힌 대로 Cursor <b>IDE 창</b>으로 열고, 명령은 아래 터미널에서 쳐요. 터미널과 Git은 코딩한입에서 배운 그대로예요.'
      ], code: { lang: 'plain', src: src(['upstage-lab/', '  .venv/         ← 가상 환경, 커밋 안 함', '  .env           ← API 키, 커밋 안 함', '  .gitignore     ← Git이 모른 척할 목록', '  AGENTS.md      ← 에이전트 규칙(레슨 5)', '  hello_solar.py ← 오늘의 첫 파일']) } },
      { t: 'say', h: '가상 환경: 이 폴더만 쓰는 파이썬 상자', fig: 'venvBox', p: [
        '<b>가상 환경</b>은 프로젝트 폴더 안에 따로 만든 파이썬 상자예요. 여기에 깐 패키지는 이 폴더에서만 보여서 다른 프로젝트와 버전이 섞이지 않아요. 컴퓨터 전체에 깔 권한이 없는 학교 PC에서도 내 폴더 안에는 깔 수 있어요.',
        '<code>venv</code>로 <code>.venv</code> 폴더를 만들고, 터미널을 새로 열 때마다 <b>켜고</b> 써요. 켜지면 줄 앞에 <code>(.venv)</code>가 붙고, 끌 때는 <code>deactivate</code>를 쳐요.'
      ], table: { head: ['', 'Mac(집)', 'Windows(학교)'], rows: [
        ['만들기', '<code>python3 -m venv .venv</code>', '<code>python -m venv .venv</code>'],
        ['켜기', '<code>source .venv/bin/activate</code>', '<code>.venv\\Scripts\\activate</code>'],
        ['켜졌는지', '줄 앞에 <code>(.venv)</code>', '줄 앞에 <code>(.venv)</code>'] ] },
        tip: 'Windows PowerShell에서 켜기가 "스크립트를 실행할 수 없다"며 막히면 실행 정책 때문이에요(파이썬 공식 문서의 venv 안내에 나와요). 학교 PC라면 설정을 바꾸기 전에 학교의 정보 담당 선생님이나 관리 지침을 먼저 확인해요.' },
      { t: 'say', h: '패키지 셋: openai, python-dotenv, requests', fig: 'threePkgs', p: [
        '가상 환경을 켠 터미널에서 <code>pip install openai python-dotenv requests</code> 한 줄이면 셋이 다 깔려요. 꼭 <b>켠 다음에</b> 깔아야 <code>.venv</code> 안에 들어가요.',
        '<b>openai</b>는 OpenAI가 만든 파이썬 도구(SDK)인데, Solar가 같은 모양의 API를 쓰니 그대로 빌려 써요. <b>python-dotenv</b>는 <code>.env</code> 파일을 읽어 주고, <b>requests</b>는 과정 2에서 Document Parse에 파일을 올릴 때 써요.',
        '깔 때 이름과 코드에서 부르는 이름이 다른 것도 있어요. <code>python-dotenv</code>는 코드에서 <code>dotenv</code>로 불러요.'
      ], table: { head: ['깔 때 이름', '코드에서', '하는 일'], rows: [
        ['<code>openai</code>', '<code>from openai import OpenAI</code>', 'Solar 부르기(OpenAI 호환)'],
        ['<code>python-dotenv</code>', '<code>from dotenv import load_dotenv</code>', '<code>.env</code>를 환경 변수로 올리기'],
        ['<code>requests</code>', '<code>import requests</code>', '파일 보내기(과정 2)'] ] } },
      { t: 'say', h: '키는 .env에, .env는 .gitignore에', fig: 'envGit', p: [
        '단원 1에서 콘솔 <b>API keys</b>에서 만든 키를 <code>.env</code> 파일에 <code>UPSTAGE_API_KEY=키</code> 한 줄로 적어요. 코드는 키 대신 이 <b>이름</b>만 알고, 실행할 때 <code>load_dotenv()</code>가 값을 채워 줘요.',
        '<code>.gitignore</code>에는 <code>.env</code>와 <code>.venv/</code>를 적어요. 그러면 커밋해도 키와 무거운 가상 환경 폴더가 올라가지 않아요. <code>git status</code>에 <code>.env</code>가 안 보이면 잘 된 거예요.',
        '학교 PC에 설치가 막혀 있으면 브라우저에서 도는 <b>Google Colab</b> 노트북을 대안으로 써요. 셀에서 <code>!pip install openai</code>처럼 깔고, 키는 셀에 적지 말고 Colab의 비밀 보관 기능에 넣어 읽어요. 다만 연수와 이 과정은 Cursor와 <code>upstage-lab</code>이 기준이에요.'
      ], code: { lang: 'plain', src: src(['# .env  (따옴표·빈칸 없이 한 줄)', ENV, '', '# .gitignore', '.env', '.venv/']) },
        tip: '키가 보이는 스크린샷, 채팅방에 붙인 코드, GitHub에 올린 파일은 모두 "샌 키"예요. 샜다면 콘솔 API keys에서 바로 지우고 새로 만들어요.' },
      { t: 'sim', h: 'upstage-lab을 준비해 봐요', p: 'upstage-lab을 연 IDE 창이에요(Mac 기준). 아래 터미널에서 가상 환경을 만들어 켜고, 패키지를 깔고, .env를 만들어 확인해 보세요.',
        scene: { win: 'ide', folder: 'upstage-lab', files: ['.gitignore'], open: '.gitignore', lang: 'plain', code: GITIGNORE, term: T0, prompt: '' },
        steps: [
          { goal: '가상 환경을 만들어요', type: 'python3 -m venv .venv', into: 'term',
            then: { files: ['.venv/', '.gitignore'], term: [...T0, '$ python3 -m venv .venv'], prompt: '' },
            say: '<code>.venv</code> 폴더가 생겼어요. 이 폴더만 쓰는 파이썬 상자예요. 학교 Windows에서는 <code>python -m venv .venv</code>예요.' },
          { goal: '가상 환경을 켜요', type: 'source .venv/bin/activate', into: 'term',
            then: { term: ['$ python3 -m venv .venv', '$ source .venv/bin/activate'], prompt: '' },
            say: '진짜 터미널에서는 이제 줄 앞에 <code>(.venv)</code>가 붙어요. Windows는 <code>.venv\\Scripts\\activate</code>예요.' },
          { goal: '패키지 셋을 깔아요', type: 'pip install openai python-dotenv requests', into: 'term',
            then: { term: ['$ source .venv/bin/activate', '$ pip install openai python-dotenv requests', 'Successfully installed … openai-… python-dotenv-… requests-…'], prompt: '' },
            say: '켜진 상자 안에 깔렸어요. 함께 쓰는 패키지도 몇 개 따라 들어와요.' },
          { goal: '빈 .env 파일을 만들어요', type: 'touch .env', into: 'term',
            then: { files: ['.venv/', '.env', '.gitignore'], term: ['$ pip install openai python-dotenv requests', 'Successfully installed … openai-… python-dotenv-… requests-…', '$ touch .env'], prompt: '' },
            say: '파일 목록에 <code>.env</code>가 생겼어요. Windows라면 Cursor 탐색기의 새 파일 버튼으로 만들어요.' },
          { goal: '.env를 열어요', click: 'file:.env', then: { open: '.env', lang: 'plain', code: ENV },
            say: '콘솔에서 복사한 키를 붙여 넣었다고 쳐요(화면의 키는 가짜예요). 따옴표·빈칸 없이 한 줄, 이름은 <code>UPSTAGE_API_KEY</code>예요.' },
          { goal: 'Git이 .env를 모른 척하는지 봐요', type: 'git status --short', into: 'term',
            then: { term: ['$ touch .env', '$ git status --short', '?? .gitignore'], prompt: '' },
            say: '목록에 <code>.gitignore</code>만 있고 <code>.env</code>와 <code>.venv/</code>는 없어요. 커밋해도 키가 올라가지 않아요.' } ],
        end: '.env와 .venv/가 git status에 안 보이면 준비 끝이에요.' },
      { t: 'q', kind: 'mc', fig: 'q_winAct', q: '학교 Windows 노트북의 터미널에서 upstage-lab의 가상 환경을 <b>켜는</b> 명령은?',
        opts: ['<code>source .venv/bin/activate</code>', '<code>python -m venv .venv</code>', '<code>.venv\\Scripts\\activate</code>', '<code>pip install venv</code>'], a: 2,
        why: 'Windows는 <code>.venv\\Scripts\\activate</code>, Mac은 <code>source .venv/bin/activate</code>예요. 켜지면 줄 앞에 <code>(.venv)</code>가 붙어요.',
        ex: ['Mac(집)에서 쓰는 명령이에요. Windows의 .venv에는 bin 대신 Scripts 폴더가 생겨요.', '가상 환경을 <b>만드는</b> 명령이에요. 만든 뒤에 켜야 해요.', '', 'venv는 파이썬에 들어 있어서 따로 깔지 않아요.'] },
      { t: 'q', kind: 'blank', fig: 'q_pkgName', q: '패키지 셋을 까는 명령이에요. 빈칸에 들어갈 이름은?', lang: 'sh', code: '$ pip install openai [[1]] requests',
        opts: ['python-dotenv', 'dotenv-python', 'upstage', 'env'], a: 0,
        why: '<code>.env</code>를 읽어 주는 패키지 이름은 <b>python-dotenv</b>예요. 깔 때는 python-dotenv, 코드에서는 <code>from dotenv import load_dotenv</code>로 불러요. 이름이 달라 자주 헷갈려요.',
        ex: ['', '앞뒤가 바뀌었어요. 정확한 이름은 python-dotenv예요.', 'Solar는 openai 패키지로 불러요. 이 레슨의 세 패키지에 들지 않아요.', '이름만 비슷하게 치면 엉뚱한 패키지가 깔리거나 설치가 실패해요. .env를 읽는 건 python-dotenv예요.'] },
      { t: 'q', kind: 'mc', fig: 'q_pkgRole', q: '세 패키지와 하는 일을 바르게 짝지은 것은?',
        opts: ['openai: .env 읽기 / python-dotenv: Solar 부르기 / requests: 파일 보내기', 'openai: Solar 부르기 / python-dotenv: .env 읽기 / requests: 파일 보내기', 'openai: Solar 부르기 / python-dotenv: 파일 보내기 / requests: .env 읽기', 'openai: 파일 보내기 / python-dotenv: .env 읽기 / requests: Solar 부르기'], a: 1,
        why: 'openai는 OpenAI 호환인 Solar를 부르고, python-dotenv는 .env를 환경 변수로 올리고, requests는 과정 2에서 Document Parse에 파일을 올릴 때 써요.',
        ex: ['openai와 python-dotenv가 서로 바뀌었어요.', '', 'python-dotenv와 requests가 서로 바뀌었어요.', 'openai와 requests가 서로 바뀌었어요. Solar는 openai 패키지로 불러요.'] },
      { t: 'q', kind: 'order', fig: 'q_setupOrder', q: '새 노트북에서 upstage-lab을 준비해 첫 실행까지, 순서대로 쌓아 보세요.',
        items: ['upstage-lab 폴더를 만들어 Cursor로 연다', '터미널에서 venv로 가상 환경을 만든다', '가상 환경을 켜서 줄 앞에 (.venv)가 붙게 한다', '켜진 터미널에서 pip install로 패키지 셋을 깐다', 'python hello_solar.py로 실행한다'],
        why: '폴더가 있어야 상자를 만들고, 상자를 켜야 그 안에 패키지가 깔려요. 켜지 않고 깔면 다른 파이썬에 깔려서 나중에 "모듈이 없다"는 오류를 만나요.' },
      { t: 'sum', pts: ['실습은 <code>upstage-lab</code> 하나에서. 가상 환경은 <code>python -m venv .venv</code>로 만들고, Mac은 <code>source .venv/bin/activate</code>, Windows는 <code>.venv\\Scripts\\activate</code>로 켠다.', '켠 터미널에서 <code>pip install openai python-dotenv requests</code>. 깔 때는 python-dotenv, 코드에서는 dotenv.', '키는 <code>.env</code>에 <code>UPSTAGE_API_KEY=…</code> 한 줄, <code>.gitignore</code>에 <code>.env</code>와 <code>.venv/</code>. git status에 .env가 안 보이면 성공.'] }
    ]},

    /* =================== L2 =================== */
    { id: 'L2', type: 'lesson', title: '첫 호출 hello_solar.py', sub: '표준 코드 한 줄씩, MODEL 변수, 답과 토큰 꺼내기', min: 12, win: 'ide', steps: [
      { t: 'say', h: 'Solar는 OpenAI 호환이라 주소만 바꿔요', fig: 'compatPlug', p: [
        '파이썬에서 Solar를 부르는 길은 <b>Chat Completions API</b>예요. 업스테이지는 이 API를 OpenAI와 <b>같은 모양</b>으로 만들어 두어서, OpenAI 파이썬 SDK를 그대로 쓰고 주소(<code>base_url</code>)만 <code>https://api.upstage.ai/v1</code>로 바꾸면 돼요.',
        '같은 모양이라 다른 곳에서 익힌 코드와 예제도 주소와 모델 이름만 바꿔 읽을 수 있어요. 모델은 업스테이지 것이고, 부르는 도구만 빌려 쓰는 거예요.',
        '그래서 <code>base_url</code>을 빼먹으면 요청이 엉뚱한 곳으로 가요. 어떻게 되는지는 헷갈림 퀴즈에서 확인해요.'
      ]},
      { t: 'say', h: 'hello_solar.py ① 키를 읽고 클라이언트를 만들어요', code: { lang: 'py', src: src(['import os', 'from dotenv import load_dotenv', 'from openai import OpenAI', '', 'load_dotenv()', 'client = OpenAI(', '  api_key=os.environ["UPSTAGE_API_KEY"],', '  base_url="https://api.upstage.ai/v1",', ')', 'MODEL = "solar-pro4"']) }, p: [
        '<code>load_dotenv()</code>가 <code>.env</code>를 읽어 환경 변수로 올리고, <code>os.environ["UPSTAGE_API_KEY"]</code>가 그 값을 꺼내요. 이름이 없으면 바로 <code>KeyError</code>가 나서, 키 없이 엉뚱하게 도는 일이 없어요.',
        '<code>client</code>는 업스테이지 서버와 이야기할 창구예요. 키와 주소를 한 번 넣어 두면 계속 써요.',
        '<code>MODEL</code>은 모델 이름을 한 줄에 모아 둔 변수예요. 지금(2026년 10월) 대표 모델은 <code>solar-pro4</code>, 가벼운 일에는 <code>solar-mini4</code>예요. 이름이 바뀌면 이 줄만 고쳐요.'
      ]},
      { t: 'say', h: 'hello_solar.py ② 묻고, 답과 토큰을 꺼내요', code: { lang: 'py', src: src(['q = "변수를 한 문장으로 설명해 줘"', 'msgs = [{"role": "user", "content": q}]', 'resp = client.chat.completions.create(', '  model=MODEL,', '  messages=msgs,', '  reasoning_effort="none",', ')', 'print(resp.choices[0].message.content)', 'print("토큰:", resp.usage.total_tokens)']), out: '변수는 값을 담아 두고 이름으로 다시 꺼내\n쓰는 상자예요.\n토큰: 43' }, p: [
        '<code>messages</code>는 역할(<code>role</code>)과 내용(<code>content</code>)을 담은 딕셔너리의 리스트예요. 단원 2에서 본 system·user·assistant가 여기에 들어가요.',
        '<code>reasoning_effort="none"</code>은 추론을 끄라는 뜻이에요. 값을 빼면 어떻게 되는지 공식 자료끼리 설명이 달라서(쿡북 실측은 "빼면 high"), 이 과정은 <b>늘 직접 적어요</b>. 짧은 설명이나 채점은 <code>none</code>이면 충분해요.',
        '실행은 가상 환경을 켠 터미널에서 <code>python hello_solar.py</code>예요. 답은 실행할 때마다 조금씩 다르고, 토큰 수도 따라 달라져요.'
      ]},
      { t: 'say', h: '응답은 상자 속 상자예요', fig: 'respBox', table: { head: ['꺼내는 길', '들어 있는 것'], rows: [
        ['<code>resp.choices[0].message.content</code>', '답 글'],
        ['<code>resp.choices[0].finish_reason</code>', '멈춘 까닭(레슨 3)'],
        ['<code>resp.usage.total_tokens</code>', '이번에 쓴 토큰 수'],
        ['<code>resp.model</code>', '실제 버전 이름(예: <code>solar-pro4-260806</code>)'] ] }, p: [
        '<code>choices</code>는 목록이라 <code>[0]</code>으로 첫 칸을 고르고, 그 안 <code>message</code>의 <code>content</code>가 답 글이에요. <code>print(resp)</code>는 구조를 훑어볼 때만 써요.',
        '코드에는 별칭 <code>solar-pro4</code>를 썼지만 <code>resp.model</code>에는 실제 버전이 찍혀요. 별칭은 새 버전이 나오면 그쪽을 가리켜요.',
        '요금은 토큰으로 매겨요. 지금 요금(<code>solar-pro4</code>, 100만 토큰당 입력 $0.30·출력 $1.20)으로 어림하면, 이런 짧은 질문은 1,000번 해도 몇 센트예요.'
      ]},
      { t: 'sim', h: 'hello_solar.py를 돌려 봐요', p: '레슨 1에서 준비한 upstage-lab이에요. hello_solar.py를 열어 훑어본 뒤, 아래 터미널에서 두 번 실행해 보세요.',
        scene: { win: 'ide', folder: 'upstage-lab', files: LAB_FILES, open: '.gitignore', lang: 'plain', code: GITIGNORE, term: ['$ source .venv/bin/activate'], prompt: '' },
        steps: [
          { goal: 'hello_solar.py를 열어요', click: 'file:hello_solar.py', then: { open: 'hello_solar.py', lang: 'py', code: HELLO },
            say: '레슨에서 본 두 조각을 한 파일에 담았어요. 키는 <code>.env</code>에서 읽고, 모델 이름은 <code>MODEL</code> 한 줄에 있어요.' },
          { goal: '터미널에서 실행해요', type: 'python hello_solar.py', into: 'term',
            then: { term: ['$ source .venv/bin/activate', '$ python hello_solar.py', '변수는 값을 담아 두고 이름으로 다시 꺼내', '쓰는 상자예요.', '토큰: 43'], prompt: '' },
            say: '첫 호출 성공! 답 글과 토큰 수가 찍혔어요. 잠깐 걸리는 건 업스테이지 서버에 다녀오는 시간이에요.' },
          { goal: '한 번 더 실행해요', type: 'python hello_solar.py', into: 'term',
            then: { term: ['토큰: 43', '$ python hello_solar.py', '변수는 값에 이름을 붙여 저장해 두는', '공간이에요.', '토큰: 39'], prompt: '' },
            say: '같은 질문인데 답이 조금 달라졌어요. 단원 2에서 본 대로 다음 토큰을 확률로 골라서 그래요. 토큰 수도 따라 달라져요.' } ],
        end: '미션에서는 질문을 내 수업 단원 것으로 바꿔 돌려 봐요.' },
      { t: 'q', kind: 'mc', fig: 'q_modelVar', q: 'hello_solar.py는 모델 이름을 <code>MODEL = "solar-pro4"</code> 한 줄에 모아 두고 <code>model=MODEL</code>로 써요. 왜 그럴까요?',
        opts: ['모델 이름이 바뀔 때 한 곳만 고치면 돼서', '변수로 두면 요청이 더 빨리 가서', '대문자 변수만 API가 알아들어서', '키처럼 숨겨야 하는 비밀이라서'], a: 0,
        why: '모델 이름은 자주 바뀌어요. <code>solar-pro3</code>도 2026-10-30에 끝나요. 이름을 한 줄에 모아 두면 새 모델로 옮길 때 그 줄만 고치면 돼요.',
        ex: ['', '속도와는 상관없어요. 서버로 가는 글자는 똑같아요.', '대문자는 "바꾸지 않을 값"이라는 파이썬 관례일 뿐이에요. API는 글자만 받아요.', '모델 이름은 공개된 이름이라 숨길 필요 없어요. 숨겨야 하는 건 키예요.'] },
      { t: 'q', kind: 'blank', fig: 'q_contentBlank', q: '응답에서 <b>답 글만</b> 꺼내 출력하려 해요. 빈칸에 들어갈 것은?', lang: 'py', code: 'print(resp.[[1]])',
        opts: ['choices.content', 'message.content', 'usage.content', 'choices[0].message.content'], a: 3,
        why: '답은 <code>choices</code> 목록의 첫 칸(<code>[0]</code>) 속 <code>message</code>의 <code>content</code>에 있어요. 상자 속 상자를 차례로 열어요.',
        ex: ['choices는 목록이라 [0]으로 칸을 먼저 골라야 하고, content는 message 안에 있어요.', 'message는 resp 바로 아래가 아니라 choices[0] 안에 있어요.', 'usage에는 토큰 수가 있어요. 답 글은 없어요.', ''] },
      { t: 'q', kind: 'line', fig: 'q_hardKey', q: '동료가 보낸 hello_solar.py 앞부분이에요. <b>고쳐야 할 줄</b>을 눌러 보세요.', lang: 'py',
        code: src(['load_dotenv()', 'client = OpenAI(', '  api_key="up_••••••••7f3a",', '  base_url="https://api.upstage.ai/v1",', ')', 'MODEL = "solar-pro4"']), a: 2,
        why: '키를 코드에 바로 적으면 커밋·공유·화면 공유 때 함께 새요. <code>api_key=os.environ["UPSTAGE_API_KEY"]</code>로 바꾸고 키는 <code>.env</code>로 옮겨요. 이미 올렸다면 콘솔에서 그 키를 지우고 새로 만들어요.' },
      { t: 'q', kind: 'order', fig: 'q_helloOrder', q: 'hello_solar.py를 실행하면 안에서 일어나는 일이에요. 순서대로 쌓아 보세요.',
        items: ['load_dotenv()가 .env를 읽어 환경 변수로 올린다', '키와 base_url로 OpenAI 클라이언트를 만든다', '모델·메시지·reasoning_effort를 담아 요청을 보낸다', '응답의 choices[0].message.content를 출력한다'],
        why: '키를 읽어야 클라이언트를 만들고, 클라이언트가 있어야 요청을 보내고, 응답이 와야 답을 꺼내요.' },
      { t: 'sum', pts: ['Solar는 OpenAI 호환: openai SDK에 <code>base_url="https://api.upstage.ai/v1"</code>. 키는 <code>load_dotenv()</code> 뒤 <code>os.environ["UPSTAGE_API_KEY"]</code>.', '모델 이름은 <code>MODEL</code> 변수 한 줄에 모으고, <code>reasoning_effort</code>는 늘 직접 적는다.', '답은 <code>resp.choices[0].message.content</code>, 토큰은 <code>resp.usage</code>, 실제 버전은 <code>resp.model</code>.'] }
    ]},

    /* =================== QA =================== */
    { id: 'QA', type: 'quiz', title: '헷갈림 퀴즈 ①', sub: 'base_url 빼먹기, 키 이름 오타, print(resp)와 content', min: 4, steps: [
      { t: 'q', kind: 'mc', fig: 'qa_noBase', q: '<code>client = OpenAI(api_key=os.environ["UPSTAGE_API_KEY"])</code>처럼 <code>base_url</code>을 빼먹고 실행했어요. 무슨 일이 생길까요?',
        opts: ['키가 up_로 시작하니 SDK가 알아서 업스테이지로 보낸다', '요청이 OpenAI 서버로 가서 키를 인정받지 못하는 인증 오류가 난다', '모델 이름이 solar-pro4라서 업스테이지로 간다', '주소가 없어서 파이썬이 실행 전에 문법 오류를 낸다'], a: 1,
        why: 'SDK는 base_url이 없으면 OpenAI 서버로 보내요. 거기서는 업스테이지 키를 모르니 <b>인증 오류(401)</b>가 나요. 키가 맞는데 401이 나면 base_url부터 봐요.',
        ex: ['SDK는 키 모양으로 주소를 고르지 않아요. 기본 주소는 OpenAI예요.', '', '모델 이름은 요청 안에 담긴 글자일 뿐, 어느 서버로 갈지는 base_url이 정해요.', '문법은 맞아요. 실행은 되고, 서버에 다녀온 뒤에 오류가 나요.'] },
      { t: 'q', kind: 'mc', fig: 'qa_keyErr', q: '<code>.env</code>에 <code>UPSTAGE_KEY=up_••••7f3a</code>라고 적고 실행했더니 <code>KeyError: \'UPSTAGE_API_KEY\'</code>가 나요. 알맞은 설명은?',
        opts: ['키가 삭제돼서 서버가 401을 돌려준 것이다', '크레딧이 떨어져 서버가 막은 것이다', '.env의 이름이 코드가 찾는 이름과 달라 파이썬이 못 찾은 것이다', 'openai 패키지가 안 깔려서 생긴 오류다'], a: 2,
        why: 'KeyError는 서버에 가기도 전에 <b>내 컴퓨터에서</b> 난 파이썬 오류예요. 코드는 <code>UPSTAGE_API_KEY</code>를 찾는데 .env에는 <code>UPSTAGE_KEY</code>가 있어요. 이름을 한 글자도 다르지 않게 맞춰요.',
        ex: ['401은 서버가 키를 거절할 때예요. KeyError는 요청을 보내기 전에 났어요.', '크레딧 부족은 서버가 주는 403이에요. 이번엔 서버까지 가지도 못했어요.', '', '패키지가 없으면 ModuleNotFoundError가 나요.'] },
      { t: 'q', kind: 'mc', fig: 'qa_printResp', q: '<code>print(resp)</code>를 했더니 <code>ChatCompletion(id=…, choices=[Choice(…)], usage=…)</code> 같은 긴 글이 나왔어요. 답 글만 보려면?',
        opts: ['<code>print(resp.choices[0].message.content)</code>', '<code>print(resp.content)</code>', '<code>print(resp["content"])</code>', '<code>print(str(resp)[:50])</code>'], a: 0,
        why: 'resp는 응답 전체를 담은 객체예요. 답 글은 <code>choices[0].message.content</code>에 있어요. <code>print(resp)</code>는 구조를 살펴볼 때만 써요.',
        ex: ['', 'content는 resp 바로 아래에 있지 않아요. choices[0].message 안에 있어요.', '진짜 응답은 딕셔너리가 아니라 점(.)으로 읽는 객체예요. 대괄호로 읽으면 오류가 나요.', '앞 50글자를 자르면 답 대신 ChatCompletion(id=… 같은 구조 글이 보여요.'] }
    ]},

    /* =================== L3 =================== */
    { id: 'L3', type: 'lesson', title: '응답 읽기와 오류', sub: 'finish_reason과 usage, 오류 번호별 대처, 지수 백오프', min: 14, steps: [
      { t: 'say', h: 'finish_reason: 답이 왜 멈췄을까', fig: 'stopSign', table: { head: ['값', '뜻', '이럴 때'], rows: [
        ['<code>stop</code>', '할 말을 다 하고 멈췄어요', '정상'],
        ['<code>length</code>', '<code>max_tokens</code>에 닿아 잘렸어요', '상한을 늘리거나 나눠 부탁'],
        ['<code>tool_calls</code>', '도구를 부르려고 멈췄어요', '과정 5의 에이전트'] ] }, p: [
        '답이 끝나면 <code>resp.choices[0].finish_reason</code>에 멈춘 까닭이 적혀요. 보통은 <code>stop</code>이에요.',
        '<code>length</code>는 조심할 신호예요. 학습지 20문항을 만들게 했는데 15번에서 잘렸다면 남은 문항이 그냥 사라져요. 추론을 켜면 생각에 쓴 토큰도 <code>max_tokens</code>에 들어가서 더 일찍 잘릴 수 있어요(단원 2).',
        '그래서 수업 도구는 답을 쓰기 전에 <code>finish_reason</code>부터 확인하는 습관을 들여요.'
      ]},
      { t: 'say', h: 'usage: 토큰을 세면 돈이 보여요', fig: 'tokenMeter', p: [
        '<code>resp.usage</code>에는 보낸 쪽 <code>prompt_tokens</code>, 만든 쪽 <code>completion_tokens</code>, 둘을 더한 <code>total_tokens</code>가 있어요. 추론을 켜면 생각에 쓴 토큰도 <code>completion_tokens</code>에 들어가요.',
        '지금 요금으로 <code>solar-pro4</code>는 100만 토큰당 입력 $0.30, 출력 $1.20이라 <b>만든 쪽이 네 배</b> 비싸요. 학생 30명이 질문 10개씩(한 번에 입력 2천·출력 3백 토큰) 하면 약 $0.29로 어림돼요.',
        '가벼운 일은 <code>solar-mini4</code>(입력 $0.10·출력 $0.40)로 바꾸면 더 싸요. 요금은 바뀔 수 있으니 수업에 쓰기 전에 가격 페이지를 확인해요.'
      ]},
      { t: 'say', h: '오류 번호는 고칠 곳을 알려 줘요', fig: 'errorDoors', table: { head: ['번호', '뜻', '할 일'], rows: [
        ['<code>400</code>', '요청 모양이 틀림', '매개변수·메시지 모양 확인'],
        ['<code>401</code>', '키가 틀렸거나 지워짐', '<code>.env</code> 값, 콘솔 API keys 확인'],
        ['<code>403</code>', '크레딧 부족·결제 실패', '콘솔 Billing의 Credit 확인'],
        ['<code>404</code>', '주소가 틀림', '<code>base_url</code> 확인'],
        ['<code>429</code>', '너무 많은 요청', '기다렸다 다시(지수 백오프)'],
        ['<code>500</code>대', '서버 문제', '잠시 뒤 다시, 계속되면 문의'] ] }, p: [
        '번호를 두 무리로 나눠 기억해요. 400·401·403·404는 <b>내가 고쳐야</b> 하는 오류, 429와 500대는 <b>기다렸다 다시</b> 하면 나아지는 오류예요.',
        '429는 분당 요청 수나 토큰 수 한도를 넘었다는 뜻이에요. 한도는 등급마다 달라서 콘솔과 문서에서 직접 확인해요. 반 학생 30명이 한 키로 동시에 부르면 금방 걸릴 수 있어요.'
      ]},
      { t: 'try', lang: 'py', h: '연습장: 응답 읽고 오류에 대처하기', p: '흉내 낸 응답 딕셔너리에서 답·멈춘 까닭·토큰을 꺼내고, 오류 번호별 할 일을 고르는 함수를 돌려 보세요. <code>"stop"</code>을 <code>"length"</code>로 바꾸면 무엇이 더 찍히는지도 봐요.',
        src: src([
          '# Solar 응답을 흉내 낸 딕셔너리예요',
          'resp = {',
          '    "choices": [{',
          '        "message": {"content": "변수는 값에 이름표를 붙인 상자예요."},',
          '        "finish_reason": "stop"}],',
          '    "usage": {"prompt_tokens": 18,',
          '              "completion_tokens": 25,',
          '              "total_tokens": 43}}',
          '',
          'choice = resp["choices"][0]',
          'print("답:", choice["message"]["content"])',
          'if choice["finish_reason"] == "length":',
          '    print("주의: 답이 잘렸어요. max_tokens를 늘려요")',
          '',
          'u = resp["usage"]',
          'cost = (u["prompt_tokens"] * 0.30',
          '        + u["completion_tokens"] * 1.20) / 1000000',
          'print("토큰:", u["total_tokens"], f"/ 약 {cost:.6f}달러")',
          'print(f"1,000번이면 약 {cost * 1000:.3f}달러")',
          '',
          'def what_to_do(code):',
          '    if code == 401:',
          '        return "키 확인: .env의 이름·값, 지운 키인지"',
          '    elif code == 403:',
          '        return "크레딧 확인: 콘솔 Billing의 Credit"',
          '    elif code == 429:',
          '        return "기다렸다 다시: 1초, 2초, 4초…"',
          '    elif code >= 500:',
          '        return "서버 문제: 잠시 뒤 다시"',
          '    return "요청 모양·주소 확인"',
          '',
          'for code in [401, 403, 429, 500]:',
          '    print(code, "→", what_to_do(code))'
        ]),
        note: '진짜 응답은 <code>resp.choices[0]</code>처럼 점으로 읽지만, 여기 resp는 딕셔너리라 <code>resp["choices"][0]</code>로 읽어요. 404를 목록에 더해 마지막 줄이 나오는지도 봐요.' },
      { t: 'say', h: '오류는 try/except로 받아 알려 줘요', code: { lang: 'py', src: src(['import openai', 'chat = client.chat.completions', '', 'def ask(msgs):', '    return chat.create(', '      model=MODEL, messages=msgs,', '      reasoning_effort="none")', '', 'try:', '    resp = ask(msgs)', 'except openai.AuthenticationError:', '    print("401: .env의 키를 확인해요")']) }, p: [
        '자주 부를 호출은 <code>ask(msgs)</code> 함수로 묶어 두면 편해요. 긴 이름 <code>client.chat.completions</code>에는 <code>chat</code>이라는 짧은 별명을 붙였어요.',
        'openai 패키지는 오류마다 예외를 만들어 둬요. 401은 <code>openai.AuthenticationError</code>, 429는 <code>openai.RateLimitError</code>로 잡아서, 학생 화면에는 알아듣기 쉬운 말을 보여 줘요.'
      ]},
      { t: 'say', h: '429에는 지수 백오프: 1초, 2초, 4초', fig: 'backoff', code: { lang: 'py', src: src(['import time', '', 'def ask_retry(msgs, tries=4):', '    wait = 1', '    for i in range(tries):', '        try:', '            return ask(msgs)', '        except openai.RateLimitError:', '            if i == tries - 1:', '                raise', '            time.sleep(wait)', '            wait *= 2  # 1초 → 2초 → 4초']) }, p: [
        '429와 500대는 잠시 뒤에 다시 하면 되는 오류예요. 바로 다시 보내면 또 막히니, 기다림을 <b>두 배씩</b> 늘려요. 이걸 <b>지수 백오프</b>라고 해요.',
        '끝없이 다시 하지 않게 횟수(<code>tries</code>)를 정해 두고, 다 쓰면 <code>raise</code>로 오류를 그대로 알려요. 401·403처럼 기다려도 안 낫는 오류는 다시 하지 않아요.',
        '수업 도구라면 여기에 학생당 횟수 제한을 더해요. 과정 3 단원 3에서 해요.'
      ]},
      { t: 'q', kind: 'mc', fig: 'q_length', q: '정보 수업 퀴즈 10문제를 부탁했는데 7번에서 답이 끊겼고, <code>finish_reason</code>이 <code>"length"</code>예요. 무슨 뜻일까요?',
        opts: ['모델이 10문제를 다 썼다는 정상 신호다', '키가 틀려 서버가 답을 막았다', '모델이 도구를 부르려고 멈췄다', '<code>max_tokens</code>에 걸려 답이 중간에 잘렸다'], a: 3,
        why: '<code>length</code>는 만들 수 있는 토큰 상한(<code>max_tokens</code>)에 닿아 멈췄다는 뜻이에요. 상한을 늘리거나 5문제씩 나눠 부탁해요. 추론을 켰다면 추론 토큰도 이 상한에 들어가요.',
        ex: ['정상으로 끝나면 stop이에요.', '키가 틀리면 답 자체가 오지 않고 401 오류가 나요.', '도구를 부를 땐 tool_calls예요. 과정 5에서 만나요.', ''] },
      { t: 'q', kind: 'line', fig: 'q_errTable', q: '오류 번호별 할 일을 정리한 메모예요. <b>틀린 줄</b>을 눌러 보세요.', lang: 'plain',
        code: src(['401 → .env의 키 확인, 지웠으면 새 키', '403 → 콘솔 Billing에서 크레딧 확인', '429 → 키를 지우고 새로 만들기', '500 → 잠시 뒤 다시', '404 → base_url 주소 확인']), a: 2,
        why: '429는 너무 많이, 너무 빨리 보냈다는 뜻이에요. 키 문제가 아니니 <b>잠시 기다렸다 간격을 늘려</b> 다시 보내요(지수 백오프).' },
      { t: 'q', kind: 'blank', fig: 'q_usageBlank', q: '토큰 수를 꺼내는 코드예요. 두 빈칸을 채워 보세요.', lang: 'py',
        code: src(['u = resp.usage', 'print("보낸 토큰:", u.[[1]])', 'print("만든 토큰:", u.[[2]])']),
        opts: [['completion_tokens', 'prompt_tokens'], ['prompt_tokens', 'total_tokens'], ['prompt_tokens', 'completion_tokens'], ['input_tokens', 'output_tokens']], a: 2,
        why: '보낸 쪽(질문·기록)은 <code>prompt_tokens</code>, 만든 쪽(답, 추론 포함)은 <code>completion_tokens</code>, 둘을 더한 게 <code>total_tokens</code>예요. 지금 요금은 만든 쪽이 네 배 비싸요.',
        ex: ['두 칸이 서로 바뀌었어요.', '둘째 칸이 틀렸어요. total_tokens는 둘을 더한 값이에요.', '', 'Chat Completions 응답에서 쓰는 이름이 아니에요. 여기서는 prompt·completion이라고 불러요.'] },
      { t: 'q', kind: 'order', fig: 'q_backoffOrder', q: '429에 대비한 재시도 함수가 하는 일이에요. 순서대로 쌓아 보세요.',
        items: ['요청을 보낸다', '429가 오면 1초 기다렸다 다시 보낸다', '또 429면 2초 기다렸다 다시 보낸다', '정한 횟수를 다 쓰면 오류를 그대로 알린다'],
        why: '기다림을 1초, 2초, 4초처럼 두 배씩 늘려요(지수 백오프). 끝없이 다시 하지 않도록 횟수를 정해 두고, 다 쓰면 오류를 알려 사람이 보게 해요.' },
      { t: 'q', kind: 'mc', fig: 'q_dotVsBracket', q: '연습장에서는 <code>resp["choices"][0]</code>로, hello_solar.py에서는 <code>resp.choices[0]</code>로 꺼냈어요. 왜 다를까요?',
        opts: ['연습장은 딕셔너리, 진짜 응답은 SDK가 만든 객체라서', '파이썬 버전이 달라서 문법이 바뀐다', '점(.)이 더 빠른 방법이라 진짜 코드에서만 쓴다', '아무 차이 없다. 둘 다 어디서나 된다'], a: 0,
        why: '연습장의 resp는 응답을 흉내 낸 <b>딕셔너리</b>라 <code>["이름"]</code>으로, openai SDK가 돌려준 resp는 <b>객체</b>라 점(.)으로 읽어요. 과정 2에서 requests로 받는 <code>r.json()</code>은 딕셔너리라 대괄호로 읽어요.',
        ex: ['', '같은 파이썬에서도 담긴 것이 무엇이냐에 따라 달라요.', '속도 차이가 아니라 담긴 것의 종류 차이예요.', 'SDK 객체를 대괄호로 읽으면 오류가 나요.'] },
      { t: 'sum', pts: ['<code>finish_reason</code>: stop 정상, length 잘림(max_tokens·추론 토큰), tool_calls 도구. 답을 쓰기 전에 확인한다.', '<code>usage</code>의 prompt·completion·total 토큰으로 비용을 어림한다. 지금 solar-pro4는 출력이 입력의 네 배.', '400·401·403·404는 고치고, 429·500대는 기다렸다 다시(지수 백오프, 횟수 제한). <code>openai.AuthenticationError</code>·<code>RateLimitError</code>로 잡는다.'] }
    ]},

    /* =================== L4 =================== */
    { id: 'L4', type: 'lesson', title: '스트리밍과 대화 이어 가기', sub: 'stream=True와 delta, 대화 기록 리스트, 터미널 챗봇', min: 12, steps: [
      { t: 'say', h: '스트리밍: 답을 조각으로 받아 바로 보여 줘요', fig: 'streamDrip', code: { lang: 'py', src: src(['stream = client.chat.completions.create(', '  model=MODEL,', '  messages=msgs,', '  reasoning_effort="none",', '  stream=True,', ')', 'for chunk in stream:', '    t = chunk.choices[0].delta.content', '    if t:', '        print(t, end="", flush=True)', 'print()']) }, p: [
        '<code>stream=True</code>를 더하면 답이 다 만들어질 때까지 기다리지 않고, 만들어지는 대로 <b>조각</b>(<code>chunk</code>)으로 받아요. 학생이 보는 챗봇에서 첫 글자가 빨리 떠서 덜 답답해요.',
        '조각에는 <code>message</code> 대신 새로 더해진 부분 <code>delta</code>가 와요. 마지막 조각처럼 글이 없는 조각도 있어서 <code>if t:</code>로 거르고, <code>end=""</code>로 한 줄에 이어 찍어요.',
        '추론을 켜면 생각 조각(<code>delta.reasoning</code>)이 먼저 오고 답 조각이 뒤따라요. 받는 방식만 다를 뿐 만드는 토큰은 같아요.'
      ]},
      { t: 'say', h: 'API는 기억하지 않아요: 기록을 통째로 보내요', fig: 'historyStack', code: { lang: 'py', src: src(['history = [{"role": "system",', '  "content": "중학생 눈높이로 답해요"}]', '', 'def add(role, text):', '    history.append(', '      {"role": role, "content": text})', '', 'add("user", "변수가 뭐예요?")', 'resp = ask(history)', 'add("assistant",', '    resp.choices[0].message.content)']) }, p: [
        '단원 2에서 본 대로 API는 앞 대화를 <b>기억하지 않아요</b>. 대화를 이어 가려면 주고받은 메시지를 리스트(<code>history</code>)에 모아 두고, 요청마다 <b>통째로</b> 보내요.',
        '붙이는 순서가 중요해요. ① 질문을 <code>user</code>로 붙이고 → ② 기록 전체로 요청하고 → ③ 받은 답을 <code>assistant</code>로 붙여요. ③을 빼먹으면 다음 턴에 모델이 자기가 한 답을 못 봐요.',
        '<code>ask()</code>는 레슨 3에서 만든 함수예요. 맨 앞 <code>system</code> 메시지는 늘 남겨 두는 수업 규칙이에요.'
      ]},
      { t: 'say', h: '터미널 챗봇: 반복문 하나면 돼요', fig: 'chatLoop', code: { lang: 'py', src: src(['while True:', '    q = input("나: ")', '    if q == "끝":', '        break', '    add("user", q)', '    resp = ask(history)', '    a = resp.choices[0].message.content', '    print("Solar:", a)', '    add("assistant", a)']), out: '나: 반복문이 뭐예요?\nSolar: 같은 일을 되풀이하는 문법이에요.\n나: 예를 하나 들어 줘\nSolar: for i in range(3): 처럼 써요.\n나: 끝' }, p: [
        '<code>while True</code>로 계속 묻고 답하다가 "끝"을 치면 멈춰요. 두 번째 질문 "예를 하나 들어 줘"에 반복문 예가 나오는 건, 앞 대화가 기록에 담겨 함께 갔기 때문이에요.',
        '미션에서는 여기에 스트리밍을 붙여요. 조각을 찍으면서 <code>answer += t</code>로 모아 두었다가, 다 받으면 <code>answer</code>를 <code>assistant</code>로 붙이면 돼요.',
        '과정 3 단원 2에서는 이 기록을 Streamlit 화면으로 옮겨 웹 챗봇을 만들어요.'
      ]},
      { t: 'say', h: '기록이 길어지면 앞을 잘라요', fig: 'trimHistory', code: { lang: 'py', src: src(['MAX = 10  # 최근 메시지 10개만', '', 'def trim():', '    if len(history) > MAX + 1:', '        del history[1:-MAX]']) }, p: [
        '매번 기록 전체를 보내니 대화가 길수록 <b>입력 토큰</b>이 쌓여 느려지고 비싸져요. <code>solar-pro4</code>의 컨텍스트 창은 512K로 넉넉하지만, 넉넉하다고 공짜는 아니에요.',
        '그래서 맨 앞 <code>system</code>은 남기고 오래된 메시지를 지워요. <code>del history[1:-MAX]</code>는 0번(system)과 최근 <code>MAX</code>개만 남겨요. 요청하기 전에 <code>trim()</code>을 불러요.',
        '잘라 낸 대화는 모델이 더는 몰라요. 꼭 기억해야 할 것(학생 수준, 단원)은 <code>system</code>에 적어 두면 잘려도 남아요.'
      ]},
      { t: 'q', kind: 'mc', fig: 'q_deltaWhere', q: '<code>stream=True</code>로 받은 조각(<code>chunk</code>)에서 새로 온 글은 어디에 있을까요?',
        opts: ['<code>chunk.choices[0].message.content</code>', '<code>chunk.usage.content</code>', '<code>chunk.text</code>', '<code>chunk.choices[0].delta.content</code>'], a: 3,
        why: '스트리밍 조각은 <code>message</code> 대신 <code>delta</code>(새로 더해진 부분)를 담아요. 마지막 조각처럼 delta에 글이 없을 수 있어서 <code>if t:</code>로 걸러요.',
        ex: ['message는 스트리밍이 아닐 때 한꺼번에 받는 답이에요.', 'usage는 토큰 수예요. 글은 없어요.', 'Chat Completions 조각에는 text라는 칸이 없어요.', ''] },
      { t: 'q', kind: 'blank', fig: 'q_endBlank', q: '조각마다 줄이 바뀌어 세로로 길게 찍혀요. 한 줄로 이어 찍으려면 빈칸에 무엇을 넣을까요?', lang: 'py',
        code: src(['for chunk in stream:', '    t = chunk.choices[0].delta.content', '    if t:', '        print(t, end=[[1]], flush=True)']),
        opts: ['"\\n"', '""', '" "', 'None'], a: 1,
        why: '<code>print</code>는 끝에 줄바꿈을 붙여요. <code>end=""</code>로 아무것도 안 붙이면 조각이 한 줄로 이어져요. <code>flush=True</code>는 모아 두지 말고 바로 화면에 내보내라는 뜻이에요.',
        ex: ['"\\n"은 줄바꿈이라 지금처럼 세로로 찍혀요.', '', '조각 사이에 빈칸이 끼어 "변수 는 값 을"처럼 띄어져요.', 'end=None은 기본값과 같아서 줄이 바뀌어요.'] },
      { t: 'q', kind: 'line', fig: 'q_resetLine', q: '앞에서 한 말을 자꾸 잊는 터미널 챗봇이에요(<code>SYSTEM</code>은 system 메시지, <code>add</code>·<code>ask</code>는 레슨에서 만든 함수). <b>고쳐야 할 줄</b>을 눌러 보세요.', lang: 'py',
        code: src(['while True:', '    q = input("나: ")', '    history = [SYSTEM]', '    add("user", q)', '    resp = ask(history)', '    a = resp.choices[0].message.content', '    print("Solar:", a)', '    add("assistant", a)']), a: 2,
        why: '반복할 때마다 <code>history</code>를 새 리스트로 덮어써서 앞 대화가 지워져요. 기록은 반복문 <b>밖</b>에서 한 번만 만들고, 안에서는 붙이기만 해요.' },
      { t: 'q', kind: 'order', fig: 'q_turnOrder', q: '터미널 챗봇의 한 턴이에요. 순서대로 쌓아 보세요.',
        items: ['학생이 질문을 입력한다', '질문을 history에 user 메시지로 붙인다', 'history를 통째로 담아 요청을 보낸다', '받은 답을 history에 assistant 메시지로 붙인다'],
        why: '이번 질문이 기록에 들어가야 모델이 받고, 답을 기록에 붙여 둬야 다음 턴에 모델이 자기 답을 봐요.' },
      { t: 'q', kind: 'mc', fig: 'q_trimWhy', q: '한 학생이 수업 내내 챗봇과 대화해요. 기록을 하나도 자르지 않고 계속 보내면 어떻게 될까요?',
        opts: ['요청마다 보내는 토큰이 늘어 느려지고 비용이 커진다', '기록이 길수록 토큰이 줄어 점점 싸진다', '512K를 넘기 전까지는 아무 차이가 없다', '서버가 알아서 앞을 잘라 주니 신경 쓸 것 없다'], a: 0,
        why: '매번 기록 전체를 보내니 대화가 길수록 입력 토큰이 쌓여요. 컨텍스트 창(512K)에 한참 못 미쳐도 돈과 시간은 늘어요. system은 남기고 오래된 앞부분을 잘라요.',
        ex: ['', '거꾸로예요. 길수록 보내는 양이 늘어요.', '넘기 전에도 보낸 만큼 돈과 시간이 들어요.', '기록을 들고 있는 것도, 자르는 것도 내 코드예요.'] },
      { t: 'sum', pts: ['<code>stream=True</code>면 조각으로 받는다. 글은 <code>chunk.choices[0].delta.content</code>, <code>print(t, end="", flush=True)</code>로 이어 찍는다.', 'API는 기억하지 않는다. user 붙이기 → 기록 통째로 요청 → assistant 붙이기. 기록은 반복문 밖에서 한 번 만든다.', '기록이 길면 느리고 비싸다. system은 남기고 앞을 자른다(<code>del history[1:-MAX]</code>).'] }
    ]},

    /* =================== QB =================== */
    { id: 'QB', type: 'quiz', title: '헷갈림 퀴즈 ②', sub: '스트리밍과 아닌 것, 기록 붙이는 순서, .env와 환경 변수', min: 4, steps: [
      { t: 'q', kind: 'mc', fig: 'qb_streamWhen', q: '<code>stream=True</code>가 가장 잘 어울리는 곳은?',
        opts: ['학습지 30장을 밤새 요약해 파일로 저장하는 프로그램', '채점 결과를 JSON으로 받아 바로 점수를 더하는 프로그램', '학생이 질문하고 답을 기다리는 챗봇 화면', '토큰을 아껴 요금을 줄이고 싶은 모든 프로그램'], a: 2,
        why: '스트리밍은 답이 만들어지는 대로 보여 줘서 <b>기다리는 사람</b>이 덜 답답해요. 사람이 지켜보지 않거나, 다 받아야 쓸 수 있는 일(JSON 채점, 파일 저장)은 한꺼번에 받는 게 간단해요.',
        ex: ['아무도 지켜보지 않으니 조각으로 받을 까닭이 없어요.', 'JSON은 다 받아야 json.loads를 할 수 있어요. 조각을 모으는 수고만 늘어요.', '', '스트리밍은 받는 방식만 바꿔요. 만드는 토큰은 같아요.'] },
      { t: 'q', kind: 'mc', fig: 'qb_appendLate', q: '챗봇 코드에서 <code>add("user", q)</code> 줄을 <code>resp = ask(history)</code> <b>뒤로</b> 옮겼어요. 무슨 일이 생길까요?',
        opts: ['아무 일 없다. 붙이는 순서는 상관없다', '이번 질문이 빠진 기록이 가서, 질문과 엉뚱한 답이 온다', '파이썬이 순서가 틀렸다고 문법 오류를 낸다', '서버가 질문을 기다렸다가 다음 요청에 답한다'], a: 1,
        why: '요청은 그 순간의 history만 보내요. 이번 질문을 붙이기 전에 보내면 모델은 지난 대화까지만 보고 답해요. 순서는 user 붙이기 → 요청 → assistant 붙이기예요.',
        ex: ['보내는 순간의 기록이 답을 정하니 순서가 중요해요.', '', '문법은 맞아서 오류 없이 돌아요. 그래서 더 찾기 어려워요.', '서버는 질문을 기다려 주지 않아요. 받은 기록에 바로 답해요.'] },
      { t: 'q', kind: 'mc', fig: 'qb_envVsVar', q: '<code>.env</code> 파일과 환경 변수의 관계로 맞는 것은?',
        opts: ['.env를 만들면 컴퓨터 전체 환경 변수에 영구히 등록된다', 'os.environ은 .env 파일만 읽는 함수다', '.env가 같은 폴더에 있으면 load_dotenv() 없이도 읽힌다', 'load_dotenv()가 .env를 읽어 실행 중인 프로그램의 환경 변수로 올린다'], a: 3,
        why: '.env는 그냥 글 파일이에요. <code>load_dotenv()</code>가 읽어서 <b>그 프로그램이 도는 동안</b> 환경 변수로 올려 주고, 코드는 <code>os.environ</code>으로 꺼내요. 터미널에서 직접 정한 환경 변수도 os.environ으로 읽혀요.',
        ex: ['프로그램이 끝나면 사라져요. 컴퓨터 설정은 그대로예요.', 'os.environ은 환경 변수 전체를 담은 사전 같은 것이에요. .env는 load_dotenv()가 올려 줄 때만 들어가요.', '파이썬은 .env를 저절로 읽지 않아요. load_dotenv()를 불러야 해요.', ''] }
    ]},

    /* =================== L5 =================== */
    { id: 'L5', type: 'lesson', title: '에이전트 코딩: Cursor에게 업스테이지 코드 맡기기', sub: 'AGENTS.md에 업스테이지 규칙, Plan으로 계획 먼저, 옛 예제 바로잡기', min: 13, win: 'agents', steps: [
      { t: 'say', h: '에이전트는 옛 예제를 닮기 쉬워요', fig: 'oldExample', p: [
        '모델 이름은 자주 바뀌어요. <code>solar-pro3</code>, <code>solar-pro2</code>, <code>solar-mini</code>는 <b>2026-10-30(KST)</b>에 서비스가 끝나고, 공식 안내는 <code>solar-pro4</code>·<code>solar-mini4</code>로 옮기라는 거예요.',
        '그런데 인터넷과 옛 쿡북에는 <code>solar-pro3</code>, <code>solar-1-mini-chat</code>, <code>api.upstage.ai/v1/solar</code> 같은 옛 예제가 많아요. Cursor 에이전트를 움직이는 모델도 학습한 시점의 글을 바탕으로 코드를 이어 써서, 그대로 두면 옛 이름을 가져올 수 있어요.',
        '단원 2의 환각과 같은 이야기예요. 학습 데이터에 많던 모양을 그럴듯하게 이어 쓰는 거예요. 그래서 지금 이름을 <b>규칙으로 알려 주고</b>, 결과를 <b>확인</b>해요.'
      ]},
      { t: 'say', h: 'AGENTS.md에 업스테이지 규칙을 적어 둬요', fig: 'agentsMdNote', code: { lang: 'md', src: src(['# upstage-lab 규칙', '## 업스테이지 API', '- 모델: MODEL = "solar-pro4" 한 곳에', '- 가벼운 일: "solar-mini4"', '- base_url="https://api.upstage.ai/v1"', '- 키: os.environ["UPSTAGE_API_KEY"]', '- reasoning_effort는 늘 직접 적기', '- 옛 이름 금지: solar-pro3, solar-mini', '- 모르면 console.upstage.ai/docs 확인', '## 일하는 방식', '- 큰 일은 계획 먼저, 고친 뒤 실행해 확인', '- 키를 화면에 찍는 코드 금지']) }, p: [
        '커서한입 과정 2 단원 2에서 배운 <code>AGENTS.md</code>예요. 프로젝트 맨 위에 두면 에이전트가 일을 시작할 때 읽어요. upstage-lab에는 업스테이지 규칙을 적어요.',
        '좋은 규칙은 짧고 확인할 수 있어요. 지킬 것(모델·주소·키 읽는 법·<code>reasoning_effort</code>)과 <b>하지 말 것</b>(옛 이름), 모를 때 볼 곳(공식 문서)을 함께 적어요.',
        '키 <b>값</b>은 절대 적지 않아요. AGENTS.md는 커밋되고, 에이전트가 읽을 때 모델 쪽으로 보내져요. 적는 건 "어디서 읽는지"뿐이에요.'
      ]},
      { t: 'say', h: '큰 일은 Plan으로 계획부터 받아요', fig: 'planFirst', p: [
        '커서한입 과정 2 단원 3의 <b>Plan</b> 모드를 써요. <kbd>shift+tab</kbd>이나 모드 메뉴(<kbd>mod+.</kbd>)로 바꾸고 부탁하면, 에이전트가 살펴보고 되물은 뒤 계획을 내놓아요. <b>Build</b>를 누르기 전까지 파일은 그대로예요.',
        '업스테이지 코드라면 계획에서 세 가지를 봐요. 모델 이름이 <code>solar-pro4</code>(또는 <code>solar-mini4</code>)인지, 키를 <code>.env</code>에서 읽는지, <code>base_url</code>이 <code>/v1</code>인지예요. 틀린 게 있으면 Build 전에 "AGENTS.md 규칙대로 고쳐 줘"라고 해요.',
        '계획에서 잡는 실수가 가장 싸요. 코드가 다 써진 뒤에 고치면 바꿀 곳도, 다시 확인할 곳도 늘어요.'
      ]},
      { t: 'say', h: '결과는 내 터미널에서 직접 확인해요', fig: 'verifyRun', code: { lang: 'sh', src: src(['$ python quiz.py', '$ grep -n "solar" quiz.py', '5:MODEL = "solar-pro4"', '$ git status --short', '?? quiz.py']) }, p: [
        '에이전트가 "잘 돌아요"라고 해도 내 터미널에서 한 번 더 돌려요. 그다음 모델 이름을 찾아보고(Windows는 <kbd>mod+shift+f</kbd> 검색으로), <code>git status</code>로 <code>.env</code>가 목록에 없는지 봐요.',
        '확인이 끝나면 커밋해요. 다음 부탁에서 일이 꼬여도 이 지점으로 돌아올 수 있어요.'
      ]},
      { t: 'sim', h: 'AGENTS.md를 에이전트에게 맡겨 봐요', p: 'upstage-lab의 Agents Window예요. 업스테이지 규칙을 담은 AGENTS.md를 부탁하고, 바뀐 파일을 확인해 보세요.',
        scene: { win: 'agents', folder: 'upstage-lab', agents: [{ title: 'New Agent', on: true }], panel: EMPTY_PANEL },
        steps: [
          { goal: '규칙을 담은 부탁을 적어요', type: RULE_Q, into: 'chat',
            say: '무엇을(AGENTS.md), 어떤 규칙을, 무엇은 건드리지 말지까지 적었어요. 키 <b>값</b>은 부탁에도 넣지 않았어요.' },
          { goal: '보내요', click: 'btn:send',
            then: { agents: [Object.assign({ on: true }, RULE_DONE)], panel: panel({ msgs: [{ me: RULE_Q }, { ai: RULE_A }] }), changes: [{ file: 'AGENTS.md', add: 12, del: 0 }] },
            say: '오른쪽 Changes에 <code>AGENTS.md</code> 하나만 생겼어요. 다른 파일은 바꾸지 말라는 조건을 지켰어요.' },
          { goal: '바뀐 파일을 눌러 읽어요', click: 'file:AGENTS.md',
            say: '진짜 Cursor에서는 여기서 내용을 읽어요. 규칙은 에이전트가 썼어도 <b>내가 읽고 확인</b>해요. 키 값이 없는지, 옛 이름 금지가 있는지요.' } ],
        end: '규칙 파일도 커밋해 두면 다음 에이전트가 늘 읽어요.' },
      { t: 'sim', h: 'Plan으로 quiz.py를 맡겨 봐요', p: 'AGENTS.md가 있는 upstage-lab에서 Plan 모드로 quiz.py를 부탁해요. 계획에 옛 모델 이름이 섞이면 규칙으로 바로잡고 Build해 보세요.',
        scene: { win: 'agents', folder: 'upstage-lab', agents: [RULE_DONE, { title: 'New Agent', on: true }], panel: EMPTY_PANEL },
        steps: [
          { goal: '<kbd>mod+.</kbd>로 모드 메뉴를 열어요', key: 'mod+.', then: { menu: MODE_MENU },
            say: '모드 메뉴예요. 새 파일을 만드는 일이니 계획부터 받아요.' },
          { goal: 'Plan을 골라요', click: 'menu:Plan', then: { menu: null, panel: panel({ mode: 'Plan' }) },
            say: '<b>Plan</b> 모드예요. Build를 누르기 전까지 파일은 그대로예요.' },
          { goal: '부탁을 적어요', type: QUIZ_Q, into: 'chat', say: '무엇을, 누구를 위해, 어떻게 보여 줄지 적었어요.' },
          { goal: '보내요', click: 'btn:send',
            then: { agents: [RULE_DONE, { title: 'quiz.py 만들기', on: true }], panel: panel({ mode: 'Plan', msgs: [{ me: QUIZ_Q }, { ai: PLAN_BAD, btns: ['Build'] }] }) },
            say: '계획 2단계를 봐요. <code>solar-pro3</code>는 2026-10-30에 끝나는 옛 이름이에요. 규칙이 있어도 에이전트가 옛 예제를 닮을 수 있어요. Build 전에 잡았어요!' },
          { goal: '규칙을 짚어 고쳐 달라고 적어요', type: FIX, into: 'chat',
            say: '무엇이 왜 틀렸는지, 어느 규칙을 따를지 콕 집었어요.' },
          { goal: '보내요', click: 'btn:send',
            then: { panel: panel({ mode: 'Plan', msgs: [{ me: QUIZ_Q }, { ai: PLAN_BAD }, { me: FIX }, { ai: PLAN_OK, btns: ['Build'] }] }) },
            say: '모델 이름과 <code>reasoning_effort</code>를 고친 계획이 나왔어요. 이제 Build해도 돼요.' },
          { goal: 'Build를 눌러요', click: 'msg:Build',
            then: { agents: [RULE_DONE, { title: 'quiz.py 만들기', on: true, status: 'run' }], changes: [{ file: 'quiz.py', add: 26, del: 0 }],
              panel: panel({ mode: 'Plan', msgs: [{ me: QUIZ_Q }, { ai: PLAN_BAD }, { me: FIX }, { ai: PLAN_OK }, { ai: BUILT, run: 'python quiz.py' }] }) },
            say: '계획대로 <code>quiz.py</code>를 만들었어요. 실행 명령은 허락을 받고 돌려요.' },
          { goal: '실행을 허락해요', click: 'btn:run',
            then: { agents: [RULE_DONE, { title: 'quiz.py 만들기', on: true, status: 'done' }],
              panel: panel({ mode: 'Plan', msgs: [{ me: QUIZ_Q }, { ai: PLAN_BAD }, { me: FIX }, { ai: PLAN_OK }, { ai: RAN }] }) },
            say: '3문제가 나왔어요. 그래도 미션에서는 내 터미널에서 한 번 더 돌리고, 모델 이름을 찾아 확인해요.' } ],
        end: '계획에서 잡고, 결과는 내 터미널에서 한 번 더. 미션에서 진짜로 해 봐요.' },
      { t: 'q', kind: 'mc', fig: 'q_whyRule', q: 'AGENTS.md에 모델 이름과 base_url까지 적어 두는 까닭으로 가장 알맞은 것은?',
        opts: ['적어 두면 업스테이지 요금이 할인돼서', 'AGENTS.md가 없으면 Cursor가 파이썬을 못 돌려서', '에이전트가 학습한 옛 예제의 이름을 따라 쓰기 쉬워서', '규칙 파일이 키를 대신 보관해 줘서'], a: 2,
        why: '에이전트를 움직이는 모델도 학습한 시점의 글을 바탕으로 코드를 써요. 인터넷에는 <code>solar-pro3</code>, <code>/v1/solar</code> 같은 옛 예제가 많아서, 지금 이름을 규칙으로 알려 줘야 해요.',
        ex: ['요금은 규칙과 상관없어요. 쓴 토큰만큼 나가요.', 'AGENTS.md는 에이전트에게 주는 안내예요. 파이썬 실행과는 상관없어요.', '', '키는 AGENTS.md가 아니라 .env에 둬요. AGENTS.md에는 키 값을 절대 적지 않아요.'] },
      { t: 'q', kind: 'line', fig: 'q_badRuleLine', q: 'upstage-lab의 AGENTS.md 초안이에요. <b>지워야 할 줄</b>을 눌러 보세요.', lang: 'md',
        code: src(['# upstage-lab 규칙', '- 모델: MODEL = "solar-pro4" 한 곳에', '- base_url="https://api.upstage.ai/v1"', '- 키: up_••••••••7f3a', '- reasoning_effort는 늘 직접 적기', '- 옛 이름 금지: solar-pro3, solar-mini']), a: 3,
        why: 'AGENTS.md는 커밋되고, 에이전트가 읽을 때 모델 쪽으로 보내져요. 키 <b>값</b>은 절대 적지 않아요. "키는 .env의 UPSTAGE_API_KEY에서 읽기"처럼 <b>읽는 법</b>만 적어요.' },
      { t: 'q', kind: 'order', fig: 'q_agentOrder', q: '에이전트에게 quiz.py를 맡기는 흐름이에요. 순서대로 쌓아 보세요.',
        items: ['AGENTS.md에 업스테이지 규칙을 적고 커밋한다', 'Plan 모드로 quiz.py를 부탁해 계획을 받는다', '계획에서 모델 이름과 키 읽는 법을 확인하고 고친다', 'Build를 눌러 코드를 만들게 한다', '내 터미널에서 python quiz.py를 돌려 확인한다'],
        why: '규칙이 먼저 있어야 계획에 반영되고, 계획에서 잡은 실수가 가장 싸요. Build 뒤 결과는 내 손으로 돌려 봐요.' },
      { t: 'q', kind: 'mc', fig: 'q_trustRun', q: '에이전트가 "quiz.py를 만들었고 잘 돌아요!"라고 했어요. 다음에 할 일로 가장 알맞은 것은?',
        opts: ['내 터미널에서 실행하고, 모델 이름과 git status를 직접 확인한다', '잘 된다니 바로 GitHub에 올린다', '같은 부탁을 한 번 더 해서 답이 같은지 본다', 'Ask 모드로 바꿔 정말 잘 되냐고 묻는다'], a: 0,
        why: '에이전트의 말은 확인이 아니에요. 내 터미널에서 돌려 보고, 모델 이름이 지금 것인지, <code>.env</code>가 커밋 목록에 없는지 직접 봐요. 그다음 커밋해요.',
        ex: ['', '확인 없이 올리면 옛 모델 이름이나 키가 섞여 있어도 모르고 지나가요.', '같은 부탁을 다시 해도 결과를 확인한 게 아니에요. 돌려 봐야 알아요.', '말로 다시 묻는 것도 확인이 아니에요. 내 터미널에서 돌려 봐요.'] },
      { t: 'sum', pts: ['인터넷·옛 쿡북의 <code>solar-pro3</code>·<code>/v1/solar</code>를 에이전트가 따라 쓸 수 있다. 지금 이름을 AGENTS.md 규칙으로 알려 준다(키 값은 적지 않는다).', '큰 일은 Plan으로: 계획에서 모델 이름·키 읽는 법·base_url을 확인하고 고친 뒤 Build.', '결과는 내 터미널에서 실행·검색·git status로 확인하고 커밋한다.'] }
    ]},

    /* =================== M1 =================== */
    { id: 'M1', type: 'mission', title: 'upstage-lab에서 Solar 부르기', sub: '내 Cursor와 터미널에서 직접', min: 40,
      where: '업스테이지 콘솔(키) + upstage-lab 폴더',
      intro: '이번 단원에서 배운 것을 내 컴퓨터에서 진짜로 해 봐요. 연수 1일차 실습의 바탕이 되는 폴더예요. 키는 단원 1에서 만든 연수용 키를 쓰고, 끝낸 것부터 체크하며 한 줄 메모도 남겨요.',
      tasks: [
        { do: 'upstage-lab을 만들고 첫 커밋을 해요',
          how: 'Cursor IDE 창에서 새 폴더 <code>upstage-lab</code>을 열고 터미널에서 <code>git init</code>. <code>.gitignore</code>에 <code>.env</code>와 <code>.venv/</code> 두 줄을 적고 <code>git add .gitignore</code> → <code>git commit -m "시작"</code>. 이후 단계도 시작 전에 커밋해 두면 언제든 돌아올 수 있어요.',
          check: '<code>git log</code>에 첫 커밋이 보이면 성공.' },
        { do: '가상 환경을 켜고 패키지 셋과 .env를 갖춰요',
          how: 'Mac은 <code>python3 -m venv .venv</code> → <code>source .venv/bin/activate</code>, Windows는 <code>python -m venv .venv</code> → <code>.venv\\Scripts\\activate</code>. 켠 터미널에서 <code>pip install openai python-dotenv requests</code>. <code>.env</code>에 <code>UPSTAGE_API_KEY=</code> 뒤로 콘솔 <b>API keys</b>에서 복사한 키를 붙여요. 학교 PC가 막혀 있으면 Colab을 대안으로 써요.',
          check: '줄 앞에 <code>(.venv)</code>가 있고, <code>git status --short</code>에 <code>.env</code>와 <code>.venv/</code>가 안 보이면 성공.' },
        { do: 'hello_solar.py로 첫 호출을 해요',
          how: '레슨 2의 코드를 한 줄씩 직접 쳐요. 질문은 내 수업 단원 것으로 바꾸고(학생 이름은 넣지 않아요), 두세 번 돌려 답이 어떻게 달라지는지 봐요.',
          check: '답 글과 토큰 수가 찍히면 성공. <code>KeyError</code>면 .env의 이름, <code>401</code>이면 키 값과 base_url, <code>403</code>이면 Billing의 Credit을 확인해요.' },
        { do: 'AGENTS.md에 업스테이지 규칙을 적고 커밋해요',
          how: '레슨 5의 열두 줄을 upstage-lab 맨 위 <code>AGENTS.md</code>로 옮겨요. 직접 써도 되고 에이전트에게 맡겨도 되지만, 키 값이 없는지는 내가 읽어 확인해요.',
          check: 'AGENTS.md에 <code>solar-pro4</code>, <code>https://api.upstage.ai/v1</code>, <code>UPSTAGE_API_KEY</code>, 옛 이름 금지가 있고 커밋됐으면 성공.' },
        { do: '에이전트에게 스트리밍 챗봇 chat.py를 맡겨요',
          how: 'Agents Window에서 아래 부탁을 붙여 넣어요. 다 되면 내 터미널에서 <code>python chat.py</code>로 돌려요.',
          check: '답이 조각으로 흘러나오고, "반복문이 뭐예요?" 다음 "예를 하나 들어 줘"에 반복문 예가 나오면 성공.',
          prompt: 'upstage-lab에 터미널 챗봇 chat.py를 만들어 줘. 맥락: hello_solar.py처럼 OpenAI SDK로 업스테이지 Solar를 부르고, AGENTS.md의 업스테이지 규칙(MODEL = "solar-pro4", base_url, .env의 UPSTAGE_API_KEY, reasoning_effort)을 따라. 조건: ① stream=True로 답을 조각마다 바로 출력 ② 조각을 모은 전체 답을 history에 assistant로 붙이기 ③ system 메시지는 "중학생 눈높이로 짧게 답해요" ④ "끝"을 치면 종료 ⑤ history는 system과 최근 10개만 남기기 ⑥ 429가 나면 1·2·4초 기다렸다 다시 ⑦ 키를 화면에 찍지 않기. 확인: 다 만들면 실행 방법을 알려 주고, 모델 이름과 base_url이 몇 번째 줄에 있는지 알려 줘.' },
        { do: 'Plan 모드로 quiz.py를 맡기고 커밋해요',
          how: '모드를 Plan으로(<kbd>shift+tab</kbd> 또는 <kbd>mod+.</kbd>) 바꾸고 아래 부탁을 보내요. 계획에 <code>solar-pro3</code>·<code>solar-mini</code>·<code>/v1/solar</code>가 보이면 Build 전에 "AGENTS.md 규칙대로 고쳐 줘"라고 해요. 다 되면 <code>git status</code>로 <code>.env</code>가 빠졌는지 보고 커밋해요.',
          check: '내 터미널에서 <code>python quiz.py</code>가 3문제를 찍고, quiz.py에서 "solar"를 찾으면 <code>solar-pro4</code>(또는 <code>solar-mini4</code>)만 나오고, <code>git log</code>에 커밋이 있으면 성공.',
          prompt: 'quiz.py를 만들어 줘. 맥락: 중학교 정보 "변수와 자료형" 단원 복습용이고, upstage-lab의 AGENTS.md에 업스테이지 규칙이 있어. 조건: ① AGENTS.md 규칙(모델 이름, base_url, 키 읽는 법, reasoning_effort)을 그대로 따를 것 ② Solar에게 4지선다 3문제를 정답과 한 줄 해설까지 만들게 해서 터미널에 출력 ③ API 호출은 한 번만, 학생 개인정보는 넣지 않기 ④ 30줄 안팎. 확인: 먼저 계획을 보여 주고, 다 만든 뒤 python quiz.py 실행 결과와 쓴 토큰 수(usage.total_tokens)를 알려 줘.' }
      ],
      note: '예상 비용: 이 미션의 Solar 호출은 많아야 수십 번이고 한 번에 수백~수천 토큰이에요. 지금 요금(solar-pro4, 100만 토큰당 입력 $0.30·출력 $1.20, 2026년 10월 기준)으로 어림하면 몇 센트 안쪽이라 가입 크레딧 $10으로 넉넉해요. Cursor 에이전트 사용량은 Cursor 요금제에서 따로 빠져요. 키는 채팅·스크린샷·GitHub에 올리지 않고, 샜다면 콘솔 API keys에서 바로 지우고 새로 만들어요. 질문에 학생 이름·성적 같은 개인정보를 넣지 않아요.' },

    /* =================== T1 =================== */
    { id: 'T1', type: 'test', title: '단원 형성평가', sub: '10문제 · 7문제 이상 맞히면 통과', min: 12, pass: 0.7, steps: [
      { t: 'q', kind: 'mc', fig: 't_noModule', q: '연수장에서 옆자리 선생님이 어제 집에서 pip install까지 했다는데, 오늘 <code>python hello_solar.py</code>를 치니 <code>ModuleNotFoundError: No module named \'openai\'</code>가 나요. 터미널 줄 앞에 <code>(.venv)</code>가 없어요. 무엇부터 할까요?',
        opts: ['키가 틀렸으니 콘솔에서 새 키를 만든다', 'upstage-lab의 가상 환경을 다시 켜고 실행한다', 'hello_solar.py를 지우고 처음부터 다시 쓴다', 'openai 대신 requests로 코드를 바꾼다'], a: 1,
        why: '패키지는 가상 환경(<code>.venv</code>) 안에 깔렸는데, 터미널을 새로 열면 가상 환경이 꺼져 있어요. Mac은 <code>source .venv/bin/activate</code>, Windows는 <code>.venv\\Scripts\\activate</code>로 켜고 다시 실행해요.',
        ex: ['키는 서버에 가서야 확인돼요. 이 오류는 모듈을 못 찾은 것이라 키와 상관없어요.', '', '코드는 멀쩡해요. 파이썬이 패키지를 못 찾을 뿐이에요.', '바꿀 필요 없어요. 켜진 가상 환경 안에서는 openai가 보여요.'] },
      { t: 'q', kind: 'mc', fig: 't_class429', q: '수업에서 학생 30명이 내 키 하나로 만든 질문 도우미를 동시에 쓰자 몇 명에게 <code>429</code>가 떴어요. 가장 알맞은 대처는?',
        opts: ['키가 샌 것이니 바로 지우고 새로 만든다', '크레딧을 충전한다', '모델 이름을 solar-pro3로 바꿔 부담을 나눈다', '잠시 기다렸다 간격을 늘려 다시 보내고, 한 사람당 호출 수를 줄인다'], a: 3,
        why: '429는 분당 요청·토큰 한도를 넘었다는 뜻이에요. 한 키로 반 전체가 동시에 부르면 금방 걸릴 수 있어요. 지수 백오프로 다시 하고, 학생당 횟수 제한(과정 3 단원 3)을 둬요.',
        ex: ['키 문제는 401이에요. 429는 너무 빨리, 많이 보냈다는 신호예요.', '크레딧 부족은 403이에요.', 'solar-pro3는 2026-10-30에 끝나는 옛 모델이에요. 한도를 나누는 방법도 아니에요.', ''] },
      { t: 'q', kind: 'blank', fig: 't_streamBlank', q: '스트리밍 답을 화면에 찍으면서 <code>answer</code>에 모으는 코드예요. 두 빈칸을 채워 보세요.', lang: 'py',
        code: src(['answer = ""', 'for chunk in stream:', '    t = chunk.choices[0].[[1]].content', '    if t:', '        print(t, end="", flush=True)', '        answer [[2]] t']),
        opts: [['delta', '+='], ['message', '+='], ['delta', '='], ['message', '=']], a: 0,
        why: '조각의 새 글은 <code>delta.content</code>에 있고, <code>+=</code>로 이어 붙여야 다 모여요. 다 모은 <code>answer</code>를 history에 assistant로 붙여요.',
        ex: ['', '첫 칸이 틀렸어요. 스트리밍 조각에는 message 대신 delta가 와요.', '둘째 칸이 틀렸어요. =는 덮어써서 마지막 조각만 남아요.', '두 칸 다 틀렸어요. delta에서 꺼내 +=로 이어 붙여요.'] },
      { t: 'q', kind: 'order', fig: 't_streamOrder', q: '스트리밍 챗봇의 한 턴이에요. 순서대로 쌓아 보세요.',
        items: ['질문을 history에 user로 붙인다', 'stream=True로 요청을 보낸다', '조각을 찍으면서 answer에 이어 붙인다', '다 모은 answer를 history에 assistant로 붙인다'],
        why: '질문이 기록에 있어야 요청에 담기고, 조각이 다 모여야 온전한 답을 기록에 붙일 수 있어요.' },
      { t: 'q', kind: 'line', fig: 't_oldHandout', q: '연수 전에 인터넷에서 찾은 예제를 고쳐 왔어요(<code>msgs</code>는 위에서 만들었어요). 11월 연수에서 돌리면 <b>오류가 날 줄</b>을 눌러 보세요.', lang: 'py',
        code: src(['import os', 'from dotenv import load_dotenv', 'from openai import OpenAI', 'load_dotenv()', 'client = OpenAI(', '  api_key=os.environ["UPSTAGE_API_KEY"],', '  base_url="https://api.upstage.ai/v1")', 'resp = client.chat.completions.create(', '  model="solar-pro3",', '  messages=msgs,', '  reasoning_effort="none")']), a: 8,
        why: '<code>solar-pro3</code>는 2026-10-30(KST)에 서비스가 끝나요. 11월에 이 이름으로 부르면 오류가 나요. <code>MODEL = "solar-pro4"</code>를 위에 두고 <code>model=MODEL</code>로 바꿔요.' },
      { t: 'q', kind: 'mc', fig: 't_cutQuiz', q: '학습지 20문항을 한 번에 만들어 달랬더니 15번 중간에서 끊겼어요. <code>reasoning_effort="high"</code>, <code>max_tokens=2000</code>으로 불렀어요. 가장 알맞은 설명과 고침은?',
        opts: ['키가 만료됐다. 새 키로 바꾼다', 'temperature가 높아서 끊겼다. 0으로 내린다', '추론 토큰도 max_tokens에 들어가 상한에 닿았다. 상한을 늘리거나 나눠 부탁한다', '모델이 문항 수를 세지 못해서다. 문항 번호를 지운다'], a: 2,
        why: 'finish_reason이 length였을 거예요. 추론을 켜면 생각에 쓴 토큰도 max_tokens에 들어가 보이는 답이 일찍 끊겨요. 상한을 넉넉히 하거나, 10문항씩 나누거나, 이런 만들기에는 추론을 끄는(none) 것도 방법이에요.',
        ex: ['키가 문제면 답이 아예 오지 않고 401이 나요.', 'temperature는 답의 무작위성이에요. 길이가 잘리는 것과 상관없어요.', '', '번호를 지워도 쓸 수 있는 토큰 상한은 그대로예요.'] },
      { t: 'q', kind: 'mc', fig: 't_untracked', q: 'GitHub에 올리기 전에 <code>git status</code>를 보니 Untracked files에 <code>.env</code>가 보여요. 어떻게 할까요?',
        opts: ['그대로 커밋한다. 저장소를 비공개로 하면 괜찮다', '.env를 지우고 키를 코드에 옮겨 적는다', '.gitignore에 .env를 넣고 git status에서 사라졌는지 확인한다', '커밋 메시지에 "키 있음"이라고 적어 둔다'], a: 2,
        why: '.env가 목록에 보이면 Git이 커밋할 수 있다는 뜻이에요. <code>.gitignore</code>에 <code>.env</code>를 넣으면 목록에서 사라져요. 이미 커밋해 올렸다면 콘솔에서 그 키를 지우고 새로 만들어요.',
        ex: ['비공개여도 함께 쓰는 사람, 나중에 공개로 바꿀 때 키가 새요.', '키를 코드에 옮기면 더 쉽게 새요.', '', '적어 둔다고 키가 지켜지지 않아요. 아예 올라가지 않게 해야 해요.'] },
      { t: 'q', kind: 'mc', fig: 't_credit403', q: '연수 2일차 오후, 잘 되던 코드가 갑자기 <code>403</code>을 돌려줘요. 키 이름도 주소도 그대로예요. 먼저 볼 곳은?',
        opts: ['콘솔 Billing의 Credit에서 크레딧 잔액과 결제 상태', '<code>.gitignore</code> 파일', 'AGENTS.md의 모델 이름', '<code>max_tokens</code> 값'], a: 0,
        why: '403은 크레딧이 모자라거나 결제가 실패했을 때 와요. 콘솔 <b>Billing</b>의 <b>Credit</b>에서 잔액을 확인해요.',
        ex: ['', '.gitignore는 Git이 모른 척할 파일 목록이에요. 서버 응답과 상관없어요.', 'AGENTS.md는 에이전트에게 주는 안내예요. 이미 돌던 코드의 403과는 상관없어요.', 'max_tokens가 작으면 답이 잘릴(length) 뿐 403이 나지 않아요.'] },
      { t: 'q', kind: 'mc', fig: 't_404', q: '에이전트가 만든 quiz.py가 내 터미널에서 <code>404</code>를 내요. 에이전트는 "잘 돌아요"라고 했었어요. 먼저 확인할 것은?',
        opts: ['키를 새로 만든다', 'base_url 같은 주소가 AGENTS.md 규칙(https://api.upstage.ai/v1)과 같은지', '크레딧을 충전한다', 'reasoning_effort를 high로 올린다'], a: 1,
        why: '404는 주소가 틀렸다는 뜻이에요. 옛 예제를 닮은 <code>…/v1/solar</code>나 오타 난 주소가 흔해요. AGENTS.md 규칙과 대조해 고치고, 다음부터는 계획 단계에서 주소도 확인해요.',
        ex: ['키 문제는 401이에요.', '', '크레딧 문제는 403이에요.', '추론은 주소와 상관없어요. 느려지고 비싸지기만 해요.'] },
      { t: 'q', kind: 'mc', fig: 't_effortGone', q: 'hello_solar.py에서 <code>reasoning_effort="none"</code> 줄을 지웠더니 답이 느려지고 토큰이 크게 늘었어요. 왜일까요?',
        opts: ['그 줄을 지우면 스트리밍이 꺼져서', '빼면 temperature가 2로 올라가서', '빼면 다른 모델로 바뀌어서', '빼면 추론이 켜질 수 있어서(공식 쿡북 실측은 high)'], a: 3,
        why: 'solar-pro4는 값을 빼면 추론이 켜진다고 공식 쿡북이 실측했어요(문서끼리 설명이 달라요). 그래서 이 과정은 <code>reasoning_effort</code>를 <b>늘 직접</b> 적어요. 간단한 설명·채점은 none, 어려운 여러 단계 문제는 high.',
        ex: ['스트리밍은 stream=True로 따로 켜요. reasoning_effort와 상관없어요.', 'temperature는 따로 정하는 값이에요. 빼도 2가 되지 않아요.', '모델은 model=MODEL이 정해요. 그대로 solar-pro4예요.', ''] }
    ]}
    ]
  });
})();
