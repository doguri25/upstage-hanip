// 과정 5 · 단원 2 · 멀티에이전트: 역할 나누기
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
  // 문항 쪽지: 동그라미 보기 몇 줄
  function sheet(P, x, y, w, h, fill) {
    P.note(x, y, w, h, { fill: fill || 'paper' });
    const n = Math.max(1, Math.min(4, Math.floor((h - 12) / 11)));
    for (let i = 0; i < n; i++) {
      const yy = y + 12 + i * 11;
      P.circle(x + 8, yy, 5, { w: 1 });
      P.line(x + 14, yy, x + w - 6 - (i % 2) * 6, yy, { c: 'soft', w: 2 });
    }
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
  // 터미널 상자
  function term(P, x, y, w, h, line, size) {
    P.rrect(x, y, w, h, 6, { fill: 'ink', fs: 'solid' });
    if (line) P.text(x + 8, y + h / 2 + (size || 11) * 0.36, line, { mono: true, size: size || 11, anchor: 'start', c: 'paper' });
  }
  // 어두운 코드 상자(줄 여러 개)
  function jbox(P, x, y, w, h, lines, size) {
    size = size || 11;
    P.rrect(x, y, w, h, 8, { fill: 'ink', fs: 'solid' });
    lines.forEach((l, i) => P.text(x + 10, y + 22 + i * size * 1.6, l, { mono: true, size, anchor: 'start', c: 'paper' }));
  }
  // 동전(지름 d)
  function coin(P, cx, cy, d) {
    P.circle(cx, cy, d, { fill: 'hi', gap: 4, w: 1.8 });
    P.text(cx, cy + d * 0.17, '$', { size: Math.round(d * 0.46), weight: 700, c: 'warm' });
  }
  // 시계(지름 d)
  function clock(P, cx, cy, d) {
    P.circle(cx, cy, d, { fill: 'paper', fs: 'solid', w: 2.2 });
    P.line(cx, cy, cx, cy - d * 0.3, { w: 3 });
    P.line(cx, cy, cx + d * 0.22, cy + d * 0.12, { w: 3 });
  }
  // 돋보기(지름 d)
  function lens(P, cx, cy, d) {
    P.circle(cx, cy, d, { fill: 'sky', gap: 5, w: 2.2 });
    P.line(cx + d * 0.33, cy + d * 0.33, cx + d * 0.55, cy + d * 0.58, { w: 3.5 });
  }
  function cross(P, cx, cy, r, c) {
    P.line(cx - r, cy - r, cx + r, cy + r, { c: c || 'bad', w: 3 });
    P.line(cx + r, cy - r, cx - r, cy + r, { c: c || 'bad', w: 3 });
  }
  function tick(P, cx, cy, r) { P.path(`M${cx - r} ${cy} L${cx - r * 0.3} ${cy + r * 0.7} L${cx + r} ${cy - r * 0.7}`, { c: 'good', w: 3.2 }); }
  function ask(P, x, y, size, c) { P.text(x, y, '?', { size: size || 22, weight: 700, c: c || 'warm' }); }
  // 빗금 위에서도 읽히게 흰 바탕을 깐 글자
  function tw(str, size, mono) { let w = 0; for (const ch of str) w += ch === ' ' ? size * 0.3 : /[가-힯]/.test(ch) ? size * 0.95 : size * (mono ? 0.62 : 0.55); return w; }
  function tag(P, cx, y, str, o) {
    o = o || {};
    const size = o.size || 12, w = tw(str, size, o.mono) + 10;
    P.rrect(cx - w / 2, y - size * 0.95, w, size * 1.35, 4, { fill: 'paper', fs: 'solid', c: null });
    P.text(cx, y, str, { size, mono: !!o.mono, weight: o.weight || 700, c: o.c || 'ink' });
  }
  // 로봇 + 아래 이름표
  function bot(P, cx, cy, s, mood, label, size) {
    P.robot(cx, cy, s, { mood: mood || 'smile' });
    if (label) tag(P, cx, cy + 60 * s + (size || 11) + 2, label, { size: size || 11 });
  }
  // 흩어진 카드(순서 문제용). parts[i]를 i번 자리에 그린다(정답 순서와 다르게 섞어 넘긴다)
  function card(P, x, y) { P.rrect(x, y, 92, 70, 10, { fill: 'paper' }); }
  const SLOTS = [[14, 16], [126, 58], [238, 14], [56, 116]];
  function cards(P, parts) { SLOTS.forEach(([x, y], i) => { card(P, x, y); parts[i](x, y); }); }
  function scatterAsks(P) {
    ask(P, 116, 40, 22, 'warm');
    ask(P, 226, 112, 22, 'bad');
    ask(P, 30, 110, 20, 'accent');
  }
  /* ---------- 네 가지 모양(150×80 칸 안에 그린다) ---------- */
  function miniPipe(P, x, y) {
    [20, 75, 130].forEach((dx, i) => P.robot(x + dx, y + 44, 0.22, { mood: ['happy', 'proud', 'wink'][i] }));
    P.arrow(x + 33, y + 44, x + 61, y + 44, { c: 'accent', w: 1.8, head: 6 });
    P.arrow(x + 88, y + 44, x + 116, y + 44, { c: 'accent', w: 1.8, head: 6 });
  }
  function miniSup(P, x, y) {
    P.robot(x + 75, y + 18, 0.26, { mood: 'proud' });
    P.robot(x + 28, y + 64, 0.2, { mood: 'happy' });
    P.robot(x + 122, y + 64, 0.2, { mood: 'wink' });
    P.arrow(x + 62, y + 30, x + 38, y + 50, { c: 'accent', w: 1.6, head: 6 });
    P.arrow(x + 88, y + 30, x + 112, y + 50, { c: 'accent', w: 1.6, head: 6 });
  }
  function miniLoop(P, x, y) {
    P.robot(x + 32, y + 42, 0.22, { mood: 'happy' });
    P.robot(x + 118, y + 42, 0.22, { mood: 'wink' });
    P.curveArrow(x + 46, y + 28, x + 75, y + 2, x + 104, y + 28, { c: 'accent', w: 1.6, head: 6 });
    P.curveArrow(x + 104, y + 58, x + 75, y + 80, x + 46, y + 58, { c: 'warm', w: 1.6, head: 6 });
  }
  function miniFan(P, x, y) {
    P.note(x + 2, y + 28, 18, 24, { fill: 'hi' });
    [14, 40, 66].forEach(dy => {
      P.robot(x + 75, y + dy, 0.16, { mood: 'happy' });
      P.line(x + 22, y + 40, x + 64, y + dy, { c: 'accent', w: 1.4 });
      P.line(x + 86, y + dy, x + 128, y + 40, { c: 'good', w: 1.4 });
    });
    P.note(x + 130, y + 28, 18, 24, { fill: 'good' });
  }

  /* ---------- 모의 화면에서 되풀이하는 조각 ---------- */
  const EMPTY_PANEL = { mode: 'Agent', model: 'Auto', msgs: [], input: '' };
  const panel = (msgs, mode) => ({ mode: mode || 'Agent', model: 'Auto', msgs, input: '' });
  const MODE_MENU = { title: 'Mode', items: ['Agent', 'Ask', 'Plan', 'Debug'] };
  // L4: team.py를 돌리는 IDE 창
  const LAB_FILES = ['.gitignore', 'AGENTS.md', 'agent.py', 'team.py', 'cost.py'];
  const LAB_FILES2 = LAB_FILES.concat(['quiz.json', 'team_log.json']);
  const TEAM_TOP = src(['import json, os', 'from dotenv import load_dotenv', 'from openai import OpenAI', '', 'load_dotenv()', 'client = OpenAI(', '    api_key=os.environ["UPSTAGE_API_KEY"],', '    base_url="https://api.upstage.ai/v1",', ')', 'SUPERVISOR = "solar-pro4"', 'WORKER = "solar-mini4"', 'MAX_FIX = 2']);
  const RUN_CMD = 'python team.py --topic 반복문 --n 2';
  const RUN_OUT = ['$ ' + RUN_CMD, '[감독] 1번 → ask_writer', '[검토] 1번 1판: 고칠 점 1개', '[감독] 1번 → ask_writer (고치기)', '[검토] 1번 2판: 통과 → 확정', '[감독] 2번 → ask_writer', '[검토] 2번 1~3판: 같은 지적', '[끝] 2번: 고치기 2번 → 사람 확인', '확정 1 · 사람 확인 1 · 호출 21번', 'team_log.json, quiz.json 저장'];
  const COST_OUT = ['$ python cost.py', 'solar-pro4   11번  입력 19,800  출력 880', 'solar-mini4  10번  입력 9,000  출력 3,500', '합계 약 $0.0093', '모두 solar-pro4였다면 약 $0.0139'];
  const LOG_JSON = src(['[', '  {"role": "감독", "model": "solar-pro4",', '   "tokens_in": 1240, "tokens_out": 64},', '  {"role": "출제", "model": "solar-mini4",', '   "tokens_in": 820, "tokens_out": 380,', '   "item": 1},', '  {"role": "검토", "model": "solar-mini4",', '   "tokens_in": 960, "tokens_out": 70,', '   "item": 1, "pass": false},', '  …', ']']);
  const QUIZ_JSON = src(['[', '  {"id": 1, "ver": 2, "status": "확정",', '   "q": "for i in range(1, 5):는', '         몇 번 돌까요?"},', '  {"id": 2, "ver": 3,', '   "status": "사람 확인",', '   "issues": ["보기 ③이 모호해요"]}', ']']);
  // L5: Agents Window에서 출제·검토 에이전트를 나란히
  const A_W = '출제: 반복문 5문제';
  const A_R = '검토: 반복문 5문제';
  const WRITE_Q = '형성평가용 반복문 객관식 5문제를 quiz/loop.md에 써 줘. 문항마다 보기 4개, 정답 하나, 해설 한 줄.';
  const WRITE_A = '<code>quiz/loop.md</code>에 5문제를 썼어요. 문항마다 보기 4개, 정답, 해설 한 줄을 달았어요.';
  const NEXT_Q = '이어서 조건문 5문제를 같은 형식으로 quiz/if.md에 써 줘. quiz/loop.md는 건드리지 마.';
  const NEXT_RUN = '<code>quiz/if.md</code>를 쓰는 중이에요…';
  const NEXT_A = '<code>quiz/if.md</code>에 조건문 5문제를 썼어요. <code>quiz/loop.md</code>는 그대로예요.';
  const REVIEW_Q = '@quiz/loop.md 를 검토만 해 줘. 정답이 하나인지, 보기 길이가 비슷한지, 해설이 맞는지 보고 문항 번호별로 고칠 점만 적어 줘. 파일은 고치지 마.';
  const REVIEW_A = '고칠 점이에요.<br>2번: 보기 ②와 ④가 둘 다 정답으로 읽혀요.<br>4번: 해설에 <code>range(1, 5)</code>가 5번 돈다고 적혀 있어요. 실제로는 4번이에요.<br>나머지는 괜찮아요.';
  const W_MSGS = [{ me: WRITE_Q }, { ai: WRITE_A }];

  HANIP.unit({
    id: 'c5u2',
    course: '과정 5 · 에이전트와 대회',
    title: '단원 2 · 멀티에이전트: 역할 나누기',
    goals: ['역할을 나눌 때와 하나로 충분할 때를 가르기', '네 가지 모양으로 출제-검토 팀(team.py) 짜기', '모델 나눠 쓰기와 로그로 비용·실패 점검하기'],
    checked: { date: '2026-10-16' },
    sources: [
      'https://console.upstage.ai/docs/models',
      'https://console.upstage.ai/docs/models/history',
      'https://console.upstage.ai/docs/models/solar-mini-4',
      'https://console.upstage.ai/docs/capabilities/generate/chat',
      'https://console.upstage.ai/docs/capabilities/generate/tool-calling',
      'https://console.upstage.ai/docs/guides/rate-limits',
      'https://console.upstage.ai/docs/resources/error-codes',
      'https://www.upstage.ai/pricing/api',
      'https://www.upstage.ai/products/studio',
      'https://github.com/UpstageAI/Solar-Pro4-Cookbook',
      'https://cursor.com/docs/subagents',
      'https://cursor.com/docs/agent/agents-window',
      'https://cursor.com/help/ai-features/multi-agent'
    ],

    figs: {
      /* ---------- L1 설명 그림 ---------- */
      oneVsTeam: { w: 340, h: 212, label: '에이전트 하나가 도구 여럿을 쓰는 모습과, 역할을 나눈 에이전트 셋을 코드가 잇는 모습', draw(P) {
        P.text(80, 22, '에이전트 하나', { size: 14, weight: 700 });
        P.robot(80, 78, 0.48, { mood: 'happy' });
        chip(P, 12, 124, 44, 26, '검색', 'sky', 12);
        chip(P, 58, 124, 44, 26, '채점', 'hi', 12);
        chip(P, 104, 124, 44, 26, '퀴즈', 'good', 12);
        P.text(80, 174, '도구 여럿 (c5u1)', { size: 12, c: 'ink2' });
        P.line(166, 14, 166, 192, { c: 'soft', w: 1.4 });
        P.text(254, 22, '역할을 나눈 셋', { size: 14, weight: 700 });
        bot(P, 204, 66, 0.28, 'happy', '출제');
        bot(P, 254, 66, 0.28, 'wink', '검토');
        bot(P, 304, 66, 0.28, 'proud', '채점');
        P.line(204, 104, 226, 128, { c: 'soft', w: 1.6 });
        P.line(254, 104, 254, 128, { c: 'soft', w: 1.6 });
        P.line(304, 104, 282, 128, { c: 'soft', w: 1.6 });
        P.rrect(196, 128, 116, 28, 8, { fill: 'ink', fs: 'solid' });
        P.text(254, 147, 'team.py', { mono: true, size: 12, c: 'paper' });
        P.text(254, 178, '사이는 내 코드가 이어요', { size: 12, c: 'accent' });
        P.text(170, 206, '역할 = 시스템 프롬프트', { size: 12, weight: 700, c: 'warm' });
      }},
      threeGood: { w: 340, h: 200, label: '한 가지 일만 하는 로봇, 짧은 지시 쪽지, 다른 로봇이 돋보기로 다시 보는 모습', draw(P) {
        P.robot(56, 66, 0.36, { mood: 'proud' });
        sheet(P, 80, 42, 34, 44, 'hi');
        P.note(128, 22, 84, 76, { fill: 'hi' });
        P.line(142, 46, 196, 46, { c: 'ink2', w: 2.4 });
        P.line(142, 64, 184, 64, { c: 'ink2', w: 2.4 });
        P.line(142, 82, 190, 82, { c: 'soft', w: 2.4 });
        P.robot(256, 66, 0.3, { mood: 'wink' });
        lens(P, 298, 66, 32);
        P.text(60, 128, '역할 분리', { size: 14, weight: 700 });
        P.text(170, 128, '짧은 지시', { size: 14, weight: 700 });
        P.text(280, 128, '서로 검사', { size: 14, weight: 700 });
        P.text(60, 150, '한 가지 일만', { size: 11, c: 'ink2' });
        P.text(170, 150, '규칙을 덜 놓쳐요', { size: 11, c: 'ink2' });
        P.text(280, 150, '다른 눈으로 봐요', { size: 11, c: 'ink2' });
        P.text(170, 186, '형성평가 출제에 딱 맞는 세 가지', { size: 13, c: 'accent' });
      }},
      enoughOne: { w: 340, h: 200, label: '로봇 하나에 동전 하나, 로봇 셋에 동전 더미와 시계', draw(P) {
        P.robot(70, 70, 0.42, { mood: 'happy' });
        coin(P, 70, 128, 26);
        P.text(70, 168, '하나', { size: 14, weight: 700 });
        P.line(140, 20, 140, 170, { c: 'soft', w: 1.2 });
        [196, 246, 296].forEach((x, i) => P.robot(x, 70, 0.3, { mood: ['happy', 'wink', 'proud'][i] }));
        [180, 206, 232, 258].forEach(x => coin(P, x, 128, 26));
        clock(P, 300, 128, 30);
        P.text(246, 168, '셋', { size: 14, weight: 700 });
        P.text(170, 192, '하나로 충분할 때가 많아요', { size: 14, weight: 700, c: 'accent' });
      }},

      /* ---------- L1 문제 그림 ---------- */
      q_whatIs: { w: 340, h: 200, label: '콘솔 같은 창 앞에서 멀티에이전트를 켜는 곳을 찾는 얼굴', draw(P) {
        win(P, 14, 14, 200, 150);
        for (let i = 0; i < 4; i++) P.line(24, 50 + i * 18, 70, 50 + i * 18, { c: i ? 'soft' : 'accent', w: 3 });
        P.line(80, 36, 80, 164, { c: 'soft', w: 1.2 });
        P.rrect(98, 52, 100, 28, 6, { c: 'soft', w: 1.6 });
        P.rrect(98, 96, 100, 28, 6, { c: 'soft', w: 1.6 });
        ask(P, 148, 118, 22);
        person(P, 282, 196, 'wow', 0.75);
        P.bubble(220, 8, 114, 44, 268, 70);
        P.text(277, 36, '어디서 켜지?', { size: 13, weight: 700 });
        P.text(114, 188, '멀티에이전트 스위치…', { size: 12, c: 'ink2' });
      }},
      q_quick3: { w: 340, h: 200, label: '내일 1교시 쪽지와 작은 퀴즈 쪽지 셋, 어떻게 만들지 고민하는 얼굴', draw(P) {
        P.note(16, 18, 110, 56, { fill: 'hi' });
        P.text(66, 44, '내일 1교시', { size: 14, weight: 700 });
        P.text(66, 64, '반복문 도입', { size: 11, c: 'ink2' });
        sheet(P, 20, 96, 44, 60, 'paper');
        sheet(P, 72, 96, 44, 60, 'sky');
        sheet(P, 124, 96, 44, 60, 'paper');
        P.text(94, 184, '퀴즈 3문제', { size: 13, weight: 700 });
        person(P, 268, 196, 'smile', 0.8);
        P.bubble(196, 10, 136, 44, 252, 72);
        P.text(264, 38, '어떻게 만들까?', { size: 13, weight: 700 });
      }},
      q_whyReview: { w: 340, h: 200, label: '문항 쪽지를 든 출제 로봇과 비어 있는 검토자 자리, 물음표', draw(P) {
        P.robot(80, 80, 0.5, { mood: 'proud' });
        sheet(P, 112, 60, 50, 64, 'hi');
        P.text(80, 150, '출제자', { size: 13, weight: 700 });
        P.rrect(222, 60, 60, 54, 8, { c: 'soft', w: 2 });
        P.line(230, 114, 230, 146, { c: 'soft', w: 2 });
        P.line(274, 114, 274, 146, { c: 'soft', w: 2 });
        ask(P, 252, 96, 28);
        P.text(252, 170, '검토자 자리', { size: 13, weight: 700, c: 'ink2' });
        P.text(170, 194, '스스로 보면 안 될까?', { size: 13, c: 'ink2' });
      }},
      q_growOrder: { w: 340, h: 200, label: '뒤섞인 카드: 빨간 표시가 있는 기록장, 저울, 로봇 하나, 둘로 나뉜 로봇', draw(P) {
        cards(P, [
          (x, y) => { P.note(x + 24, y + 8, 44, 54, { fill: 'paper' }); cross(P, x + 38, y + 26, 5); cross(P, x + 54, y + 44, 5); },
          (x, y) => { P.line(x + 46, y + 14, x + 46, y + 56, { w: 2.4 }); P.line(x + 18, y + 22, x + 74, y + 22, { w: 2.4 }); P.circle(x + 20, y + 40, 22, { fill: 'hi', gap: 4, w: 1.6 }); P.circle(x + 72, y + 40, 22, { fill: 'sky', gap: 4, w: 1.6 }); P.line(x + 30, y + 60, x + 62, y + 60, { w: 2.4 }); },
          (x, y) => P.robot(x + 46, y + 36, 0.3, { mood: 'happy' }),
          (x, y) => { P.robot(x + 26, y + 36, 0.24, { mood: 'wink' }); P.robot(x + 66, y + 36, 0.24, { mood: 'proud' }); }
        ]);
        P.robot(270, 146, 0.5, { mood: 'wow' });
        scatterAsks(P);
      }},
      q_agentParts: { w: 340, h: 200, label: '로봇에 붙은 이름표 셋: 빈칸, 모델, 도구', draw(P) {
        P.robot(110, 96, 0.7, { mood: 'happy' });
        tag(P, 262, 52, '[  ?  ]', { size: 14 });
        tag(P, 262, 104, '모델', { size: 14 });
        tag(P, 262, 156, '도구', { size: 14 });
        P.line(150, 70, 228, 48, { c: 'soft', w: 1.6 });
        P.line(150, 100, 236, 100, { c: 'soft', w: 1.6 });
        P.line(150, 128, 236, 152, { c: 'soft', w: 1.6 });
        P.text(110, 186, '에이전트 하나', { size: 13, weight: 700 });
      }},

      /* ---------- L2 설명 그림 ---------- */
      pipeFig: { w: 340, h: 204, label: '학습지가 개념 뽑기, 문항 만들기, 형식 검사 로봇을 한 줄로 지나 문항 묶음이 되는 모습', draw(P) {
        P.note(10, 60, 40, 52, { fill: 'hi' });
        P.text(30, 130, '학습지', { size: 11, c: 'ink2' });
        bot(P, 100, 84, 0.28, 'happy', '개념 뽑기');
        bot(P, 180, 84, 0.28, 'proud', '문항 만들기');
        bot(P, 260, 84, 0.28, 'wink', '형식 검사');
        P.arrow(54, 84, 80, 84, { c: 'accent', w: 2, head: 7 });
        P.arrow(118, 84, 160, 84, { c: 'accent', w: 2, head: 7 });
        P.arrow(198, 84, 240, 84, { c: 'accent', w: 2, head: 7 });
        P.arrow(278, 84, 300, 84, { c: 'accent', w: 2, head: 7 });
        sheet(P, 302, 62, 32, 44, 'good');
        P.text(318, 130, '문항', { size: 11, c: 'ink2' });
        P.text(170, 162, '앞 결과가 다음 입력', { size: 14, weight: 700, c: 'accent' });
        P.text(170, 190, '순서는 코드가 정해요', { size: 12, c: 'ink2' });
      }},
      supFig: { w: 340, h: 212, label: '감독자 로봇이 출제자와 검토자 로봇에게 일을 맡기고 결과를 받는 모습', draw(P) {
        bot(P, 170, 58, 0.4, 'proud', '감독자');
        bot(P, 70, 150, 0.32, 'happy', '출제자');
        bot(P, 270, 150, 0.32, 'wink', '검토자');
        P.arrow(146, 66, 80, 122, { c: 'accent', w: 2, head: 8 });
        P.arrow(194, 66, 260, 122, { c: 'accent', w: 2, head: 8 });
        P.curveArrow(96, 142, 136, 136, 154, 108, { c: 'good', w: 1.8, head: 7 });
        P.curveArrow(244, 142, 204, 136, 186, 108, { c: 'good', w: 1.8, head: 7 });
        P.text(58, 84, 'ask_writer', { mono: true, size: 10, c: 'accent' });
        P.text(286, 84, 'ask_reviewer', { mono: true, size: 10, c: 'accent' });
        P.text(122, 150, '결과', { size: 11, weight: 700, c: 'good' });
        P.text(218, 150, '결과', { size: 11, weight: 700, c: 'good' });
        P.text(170, 206, '누구를 부를지 감독자가 골라요', { size: 12, c: 'ink2' });
      }},
      loopFig: { w: 340, h: 204, label: '출제자와 검토자가 문항과 고칠 점을 주고받고, 최대 2번이라는 표지판이 선 모습', draw(P) {
        bot(P, 70, 92, 0.38, 'happy', '출제자');
        bot(P, 270, 92, 0.38, 'wink', '검토자');
        P.curveArrow(98, 70, 170, 24, 242, 70, { c: 'accent', w: 2.2, head: 9 });
        P.text(170, 38, '문항', { size: 12, weight: 700, c: 'accent' });
        P.curveArrow(242, 116, 170, 160, 98, 116, { c: 'warm', w: 2.2, head: 9 });
        P.text(170, 160, '고칠 점', { size: 12, weight: 700, c: 'warm' });
        tick(P, 264, 26, 7);
        P.text(300, 30, '통과면 끝', { size: 12, weight: 700, c: 'good' });
        P.rrect(128, 172, 84, 26, 6, { fill: 'hi', gap: 5 });
        P.text(170, 190, '최대 2번', { size: 13, weight: 700 });
      }},
      fanFig: { w: 340, h: 204, label: '할 일 쪽지가 단원별 작업자 셋에게 나뉘어 동시에 처리되고, 합치기 쪽지에서 검사하는 모습', draw(P) {
        P.note(10, 66, 46, 58, { fill: 'hi' });
        P.text(33, 142, '할 일', { size: 11, c: 'ink2' });
        [36, 96, 156].forEach((y, i) => {
          P.robot(140, y, 0.24, { mood: ['happy', 'wink', 'proud'][i] });
          P.text(160, y + 4, ['변수', '조건문', '반복문'][i], { size: 12, anchor: 'start', weight: 700 });
          P.arrow(60, 95, 124, y, { c: 'accent', w: 1.8, head: 7 });
          P.arrow(206, y, 262, 95, { c: 'good', w: 1.8, head: 7 });
        });
        P.note(266, 66, 60, 58, { fill: 'good' });
        P.text(296, 100, '합치기', { size: 12, weight: 700 });
        P.text(296, 142, '겹침·빠짐 검사', { size: 11, c: 'ink2' });
        P.text(170, 196, '빨라져도 호출 수는 그대로', { size: 12, c: 'warm' });
      }},
      fourShapes: { w: 340, h: 220, label: '네 모양을 한 장에: 한 줄로 선 셋, 감독자 아래 둘, 주고받는 둘, 갈라졌다 모이는 셋', draw(P) {
        P.text(87, 16, '① 순차 파이프라인', { size: 12, weight: 700 });
        P.text(253, 16, '② 감독자-작업자', { size: 12, weight: 700 });
        miniPipe(P, 12, 24);
        miniSup(P, 178, 24);
        P.line(12, 112, 328, 112, { c: 'soft', w: 1 });
        P.line(170, 8, 170, 212, { c: 'soft', w: 1 });
        P.text(87, 130, '③ 만들기-검토 반복', { size: 12, weight: 700 });
        P.text(253, 130, '④ 나눠 하고 합치기', { size: 12, weight: 700 });
        miniLoop(P, 12, 136);
        miniFan(P, 178, 136);
      }},

      /* ---------- L2 문제 그림 ---------- */
      q_fourUnits: { w: 340, h: 200, label: '변수, 조건문, 반복문, 함수 쪽지 넷과 12문제 상자로 가는 물음표 화살표', draw(P) {
        ['변수', '조건문', '반복문', '함수'].forEach((t, i) => {
          const x = 14 + (i % 2) * 86, y = 18 + Math.floor(i / 2) * 76;
          P.note(x, y, 76, 62, { fill: ['hi', 'sky', 'paper', 'good'][i] });
          P.text(x + 38, y + 30, t, { size: 13, weight: 700 });
          P.text(x + 38, y + 50, '3문제', { size: 11, c: 'ink2' });
        });
        P.arrow(184, 94, 226, 94, { c: 'accent', w: 2.4, head: 9 });
        ask(P, 205, 82, 20);
        P.rrect(234, 54, 92, 80, 10, { fill: 'paper', w: 2 });
        P.text(280, 100, '12문제', { size: 15, weight: 700 });
        P.text(170, 186, '어떤 모양으로 만들까?', { size: 13, c: 'ink2' });
      }},
      q_router: { w: 340, h: 200, label: '자료 질문, 코드 제출, 잡담 말풍선이 들어오고, 갈림길 앞 로봇이 어느 담당에게 보낼지 고민하는 모습', draw(P) {
        [['자료 질문', 12], ['코드 제출', 76], ['잡담', 140]].forEach(([t, y]) => {
          P.bubble(8, y, 96, 34, 120, y + 17);
          P.text(56, y + 22, t, { size: 12, weight: 700 });
        });
        P.robot(166, 100, 0.4, { mood: 'wow' });
        ask(P, 166, 62, 22);
        [[40, '검색 담당'], [100, '채점 담당'], [160, '안내']].forEach(([y, t]) => {
          P.arrow(192, 100, 250, y, { c: 'soft', w: 1.8, head: 7 });
          P.text(296, y + 4, t, { size: 11, weight: 700 });
        });
        P.text(166, 192, '질문마다 길이 달라요', { size: 12, c: 'ink2' });
      }},
      q_pipeOrder: { w: 340, h: 200, label: '뒤섞인 카드: 문항 쪽지, PDF가 md로 바뀌는 화살표, 체크 표시가 붙은 json 상자, 개념 목록', draw(P) {
        cards(P, [
          (x, y) => sheet(P, x + 26, y + 8, 40, 54, 'hi'),
          (x, y) => { P.note(x + 8, y + 10, 28, 36, { fill: 'warm' }); P.text(x + 22, y + 60, 'PDF', { size: 10, weight: 700 }); P.arrow(x + 40, y + 28, x + 54, y + 28, { c: 'accent', w: 1.6, head: 6 }); P.note(x + 58, y + 10, 28, 36, { fill: 'paper' }); P.text(x + 72, y + 60, 'md', { mono: true, size: 10, weight: 700 }); },
          (x, y) => { P.rrect(x + 10, y + 12, 56, 44, 5, { fill: 'ink', fs: 'solid' }); P.text(x + 38, y + 39, '{ }', { mono: true, size: 14, c: 'paper' }); tick(P, x + 78, y + 34, 8); },
          (x, y) => { [0, 1, 2].forEach(i => { P.circle(x + 18, y + 18 + i * 16, 6, { fill: 'accent', fs: 'solid', c: null }); P.line(x + 28, y + 18 + i * 16, x + 74 - i * 8, y + 18 + i * 16, { c: 'ink2', w: 2.4 }); }); }
        ]);
        P.robot(270, 146, 0.5, { mood: 'wink' });
        scatterAsks(P);
      }},
      q_dupMerge: { w: 340, h: 200, label: '합친 문항 목록에서 거의 같은 문항 두 줄이 보여 놀란 얼굴', draw(P) {
        P.rrect(14, 14, 200, 160, 10, { fill: 'paper', w: 2 });
        P.text(114, 36, '합친 12문제', { size: 13, weight: 700 });
        for (let i = 0; i < 6; i++) {
          const y = 56 + i * 19;
          P.text(30, y + 4, `${i + 1}.`, { size: 11, anchor: 'start', c: 'ink2' });
          P.line(50, y, 190 - (i % 3) * 18, y, { c: i === 1 || i === 4 ? 'warm' : 'soft', w: 3 });
        }
        P.curveArrow(196, 76, 224, 104, 196, 132, { c: 'warm', w: 2, head: 7 });
        person(P, 282, 196, 'wow', 0.75);
        P.text(282, 54, '어? 똑같네', { size: 14, weight: 700, c: 'warm' });
      }},

      /* ---------- QA 그림 ---------- */
      qa_whoNext: { w: 340, h: 200, label: '위에는 정해진 화살표 길, 아래에는 갈림길 앞 로봇, 다음은 누가 정할지 묻는 물음표', draw(P) {
        [30, 100, 170].forEach(x => P.rrect(x, 24, 50, 30, 6, { fill: 'sky', gap: 5 }));
        P.arrow(82, 39, 98, 39, { c: 'accent', w: 2, head: 6 });
        P.arrow(152, 39, 168, 39, { c: 'accent', w: 2, head: 6 });
        P.text(272, 44, '정해진 길', { size: 13, weight: 700 });
        P.line(14, 76, 326, 76, { c: 'soft', w: 1.2 });
        P.robot(70, 132, 0.42, { mood: 'wow' });
        [[100, '출제'], [132, '검토'], [164, '끝']].forEach(([y, t]) => {
          P.arrow(100, 132, 164, y, { c: 'soft', w: 1.8, head: 7 });
          P.text(176, y + 4, t, { size: 12, weight: 700, anchor: 'start' });
        });
        P.text(272, 136, '갈림길', { size: 13, weight: 700 });
        ask(P, 300, 108, 24);
        P.text(170, 192, '다음은 누가 정할까?', { size: 13, c: 'ink2' });
      }},
      qa_stopLoop: { w: 340, h: 200, label: '출제 로봇과 검토 로봇 사이를 빙글빙글 도는 화살표와 언제 멈추냐는 물음표', draw(P) {
        P.robot(70, 96, 0.4, { mood: 'dizzy' });
        P.robot(270, 96, 0.4, { mood: 'dizzy' });
        P.curveArrow(98, 74, 170, 20, 242, 74, { c: 'accent', w: 2, head: 8 });
        P.curveArrow(242, 118, 170, 172, 98, 118, { c: 'warm', w: 2, head: 8 });
        P.curveArrow(110, 86, 170, 56, 230, 86, { c: 'soft', w: 1.6, head: 7 });
        P.curveArrow(230, 106, 170, 136, 110, 106, { c: 'soft', w: 1.6, head: 7 });
        ask(P, 170, 106, 30);
        P.text(170, 190, '언제 멈추지?', { size: 14, weight: 700, c: 'ink2' });
      }},
      qa_parallel: { w: 340, h: 200, label: '나란히 선 작업자 로봇 넷과, 시계와 동전 중 무엇이 줄어드는지 묻는 물음표', draw(P) {
        [50, 110, 170, 230].forEach((x, i) => P.robot(x, 60, 0.28, { mood: ['happy', 'wink', 'proud', 'smile'][i] }));
        P.text(140, 112, '작업자 넷이 나란히', { size: 12, c: 'ink2' });
        clock(P, 90, 156, 40);
        coin(P, 196, 156, 40);
        ask(P, 143, 164, 26);
        ask(P, 250, 164, 26);
        P.text(296, 70, '줄어드는 건?', { size: 13, weight: 700, c: 'warm' });
      }},

      /* ---------- L3 설명 그림 ---------- */
      teamPlan: { w: 340, h: 204, label: '출제자와 검토자 로봇 사이를 team.py 상자가 잇고, quiz.json과 team_log.json 쪽지가 나오는 모습', draw(P) {
        bot(P, 56, 64, 0.34, 'happy', '출제자');
        bot(P, 284, 64, 0.34, 'wink', '검토자');
        P.rrect(118, 40, 104, 48, 8, { fill: 'ink', fs: 'solid' });
        P.text(170, 69, 'team.py', { mono: true, size: 14, c: 'paper' });
        P.arrow(116, 56, 80, 56, { c: 'accent', w: 2, head: 7 });
        P.arrow(84, 72, 116, 72, { c: 'good', w: 2, head: 7 });
        P.arrow(224, 56, 260, 56, { c: 'accent', w: 2, head: 7 });
        P.arrow(256, 72, 224, 72, { c: 'good', w: 2, head: 7 });
        P.text(170, 112, '반복 · 멈춤 · 기록', { size: 12, weight: 700, c: 'accent' });
        P.arrow(150, 120, 110, 138, { c: 'soft', w: 1.8, head: 7 });
        P.arrow(190, 120, 230, 138, { c: 'soft', w: 1.8, head: 7 });
        file(P, 60, 140, 84, 46, 'quiz.json', null, 'hi', 11);
        file(P, 196, 140, 100, 46, 'team_log.json', null, 'sky', 11);
        P.text(170, 200, 'solar-mini4 둘 + 코드', { size: 11, c: 'ink2' });
      }},
      passGate: { w: 340, h: 200, label: '검토자가 pass 거짓과 고칠 점 목록을 내밀고, 코드가 if로 고치기와 확정 중 고르는 모습', draw(P) {
        P.robot(50, 84, 0.42, { mood: 'wink' });
        P.text(50, 136, '검토자', { size: 12, weight: 700 });
        jbox(P, 88, 30, 130, 76, ['"pass": false,', '"issues": [', '  "정답이 둘"]'], 11);
        P.arrow(222, 66, 252, 66, { c: 'accent', w: 2, head: 7 });
        P.text(286, 72, 'if', { mono: true, size: 18, weight: 700, c: 'accent' });
        P.arrow(286, 82, 254, 128, { c: 'warm', w: 2, head: 7 });
        P.arrow(286, 82, 318, 128, { c: 'good', w: 2, head: 7 });
        P.text(244, 150, '고치기', { size: 12, weight: 700, c: 'warm' });
        P.text(318, 150, '확정', { size: 12, weight: 700, c: 'good' });
        P.text(158, 188, '참·거짓 하나로 갈라요', { size: 13, c: 'accent' });
      }},
      roleCards: { w: 340, h: 200, label: '출제자 카드에는 만들기·고치기만, 검토자 카드에는 찾기만·고치지 않아요가 적힌 두 장의 역할 카드', draw(P) {
        P.rrect(16, 20, 146, 140, 12, { fill: 'hi', gap: 7 });
        P.robot(52, 64, 0.3, { mood: 'happy' });
        P.text(116, 64, '출제자', { size: 14, weight: 700 });
        tag(P, 89, 112, '만들기·고치기만', { size: 12 });
        tag(P, 89, 140, '검토는 안 해요', { size: 12, c: 'bad' });
        P.rrect(178, 20, 146, 140, 12, { fill: 'sky', gap: 7 });
        P.robot(214, 64, 0.3, { mood: 'wink' });
        P.text(278, 64, '검토자', { size: 14, weight: 700 });
        tag(P, 251, 112, '찾기만', { size: 12 });
        tag(P, 251, 140, '고치지 않아요', { size: 12, c: 'bad' });
        P.text(170, 188, '할 일과 하지 않을 일', { size: 13, c: 'accent' });
      }},
      oneFunc: { w: 340, h: 200, label: 'call_role() 함수 상자 하나에 모델, 프롬프트, 스키마 세 칸을 바꿔 끼우는 모습', draw(P) {
        P.text(60, 30, '출제자', { size: 13, weight: 700, c: 'accent' });
        P.text(280, 30, '검토자', { size: 13, weight: 700, c: 'warm' });
        P.arrow(80, 38, 110, 92, { c: 'accent', w: 1.8, head: 7 });
        P.arrow(260, 38, 230, 92, { c: 'warm', w: 1.8, head: 7 });
        P.rrect(70, 60, 200, 80, 12, { fill: 'paper', fs: 'solid', w: 2.2 });
        P.text(170, 84, 'call_role( )', { mono: true, size: 15, weight: 700 });
        chip(P, 82, 98, 56, 28, '모델', 'sky', 12);
        chip(P, 142, 98, 56, 28, '프롬프트', 'hi', 11);
        chip(P, 202, 98, 56, 28, '스키마', 'good', 12);
        P.text(170, 172, '바꾸는 건 세 칸뿐', { size: 14, weight: 700, c: 'accent' });
      }},

      /* ---------- L3 문제 그림 ---------- */
      q_whyPass: { w: 340, h: 200, label: '"괜찮아 보이긴 한데…" 말풍선과, 갈림길 앞에서 갸웃하는 코드 상자', draw(P) {
        P.robot(60, 112, 0.44, { mood: 'smile' });
        P.bubble(10, 10, 170, 50, 60, 78);
        P.text(95, 40, '괜찮아 보이긴 한데…', { size: 13 });
        P.rrect(210, 90, 60, 40, 6, { fill: 'ink', fs: 'solid' });
        P.text(240, 115, 'if ?', { mono: true, size: 14, c: 'paper' });
        P.arrow(240, 132, 210, 168, { c: 'soft', w: 1.8, head: 7 });
        P.arrow(240, 132, 270, 168, { c: 'soft', w: 1.8, head: 7 });
        ask(P, 300, 80, 26);
        P.text(240, 192, '멈출까? 고칠까?', { size: 12, c: 'ink2' });
      }},
      q_passType: { w: 340, h: 200, label: '스키마 쪽지의 pass 칸 타입이 빈칸이라 고민하는 얼굴', draw(P) {
        jbox(P, 14, 30, 204, 100, ['"pass": {', '  "type": ___', '},', '"issues": { ... }'], 12);
        person(P, 280, 196, 'wow', 0.8);
        ask(P, 280, 60, 28);
        P.text(116, 170, '통과 칸에는 어떤 타입?', { size: 13, c: 'ink2' });
      }},
      q_trueLine: { w: 340, h: 200, label: '통과 동그라미를 받은 문항들이 모두 사람 확인 상자로만 들어가 어지러운 얼굴', draw(P) {
        [20, 70, 120].forEach((x, i) => {
          sheet(P, x, 30 + i * 8, 40, 52, 'paper');
          P.circle(x + 30, 30 + i * 8 + 46, 18, { c: 'good', w: 2 });
        });
        P.text(90, 22, 'pass: true', { mono: true, size: 12, c: 'good', weight: 700 });
        P.arrow(172, 80, 212, 108, { c: 'warm', w: 2.2, head: 8 });
        P.rrect(214, 100, 110, 60, 10, { fill: 'warm', gap: 6 });
        P.text(269, 136, '사람 확인', { size: 14, weight: 700 });
        person(P, 90, 198, 'dizzy', 0.6);
        P.text(269, 186, '왜 다 여기로?', { size: 13, c: 'ink2' });
      }},
      q_loopOut: { w: 340, h: 200, label: '몇 번 돌지 모르는 고리 화살표와 출력 칸의 물음표', draw(P) {
        P.circle(100, 92, 120, { c: 'accent', w: 2.4 });
        P.arrow(150, 62, 158, 76, { c: 'accent', w: 2.4, head: 9 });
        P.text(100, 100, '× ?', { size: 24, weight: 700, c: 'accent' });
        term(P, 196, 50, 130, 84);
        ask(P, 261, 104, 30);
        P.text(261, 160, '무엇이 찍힐까?', { size: 13, c: 'ink2' });
      }},

      /* ---------- L4 설명 그림 ---------- */
      supTools: { w: 340, h: 204, label: '감독자 로봇의 도구 상자 안에 작은 출제자·검토자 로봇이 들어 있는 모습', draw(P) {
        bot(P, 74, 70, 0.5, 'proud', '감독자 solar-pro4', 11);
        P.text(248, 44, 'tools', { mono: true, size: 14, weight: 700 });
        P.rrect(222, 56, 52, 18, 6, { fill: 'paper', w: 2 });
        P.rrect(160, 70, 174, 96, 10, { fill: 'hi', gap: 7 });
        P.robot(204, 112, 0.28, { mood: 'happy' });
        P.robot(290, 112, 0.28, { mood: 'wink' });
        tag(P, 204, 152, 'ask_writer', { mono: true, size: 10 });
        tag(P, 290, 152, 'ask_reviewer', { mono: true, size: 10 });
        P.arrow(112, 80, 156, 100, { c: 'accent', w: 2, head: 8 });
        P.text(170, 196, '작업자 = 감독자의 도구', { size: 13, weight: 700, c: 'accent' });
      }},
      stateBoard: { w: 340, h: 200, label: '모두가 보는 상태 게시판: 주제, 지금 문항, 확정과 사람 확인 번호, 둘레의 로봇 셋', draw(P) {
        P.rrect(90, 16, 160, 124, 8, { fill: 'paper', w: 2.2 });
        P.text(170, 38, 'STATE', { mono: true, size: 13, weight: 700 });
        P.text(104, 62, '주제: 반복문', { size: 11, anchor: 'start' });
        P.text(104, 84, '지금: 4번 2판', { size: 11, anchor: 'start' });
        P.text(104, 106, '확정: 1, 3', { size: 11, anchor: 'start', c: 'good' });
        P.text(104, 128, '사람 확인: 2', { size: 11, anchor: 'start', c: 'warm' });
        bot(P, 44, 70, 0.3, 'proud', '감독자');
        bot(P, 296, 48, 0.26, 'happy', '출제자');
        bot(P, 296, 122, 0.26, 'wink', '검토자');
        P.text(170, 184, '필요한 부분만 잘라 넘겨요', { size: 13, c: 'accent' });
      }},
      logBook: { w: 340, h: 200, label: '호출마다 한 줄씩 쌓이는 기록장: 역할, 모델, 입력·출력 토큰', draw(P) {
        P.rrect(20, 14, 300, 140, 10, { fill: 'paper', w: 2 });
        P.line(20, 42, 320, 42, { w: 1.4 });
        ['역할', '모델', '입력', '출력'].forEach((t, i) => P.text(56 + i * 76, 34, t, { size: 12, weight: 700 }));
        [['감독', 'pro4', '1,240', '64'], ['출제', 'mini4', '820', '380'], ['검토', 'mini4', '960', '70'], ['감독', 'pro4', '1,610', '58']].forEach((r, j) => {
          r.forEach((t, i) => P.text(56 + i * 76, 64 + j * 24, t, { size: 11, mono: i > 0, c: i === 1 ? (t === 'pro4' ? 'accent' : 'good') : 'ink' }));
        });
        P.text(170, 182, '한 줄씩 쌓아 두면 숫자로 찾아요', { size: 13, c: 'accent' });
      }},
      costSplit: { w: 340, h: 204, label: '감독자 로봇 옆 큰 동전 더미와 작업자 로봇 옆 작은 동전 하나', draw(P) {
        bot(P, 70, 56, 0.36, 'proud', '감독자', 12);
        tag(P, 70, 114, 'solar-pro4', { mono: true, size: 11, c: 'accent' });
        [0, 1, 2].forEach(i => coin(P, 70, 176 - i * 14, 30));
        bot(P, 250, 56, 0.3, 'happy', '작업자', 12);
        tag(P, 250, 114, 'solar-mini4', { mono: true, size: 11, c: 'good' });
        coin(P, 250, 176, 22);
        P.text(160, 166, '같은 토큰이면', { size: 12, c: 'ink2' });
        P.text(160, 190, '3분의 1 값', { size: 13, weight: 700, c: 'good' });
      }},

      /* ---------- L4 문제 그림 ---------- */
      q_whoRuns: { w: 340, h: 200, label: '감독자 로봇의 ask_reviewer 말풍선과, 그 아래 비어 있는 실행 칸의 물음표', draw(P) {
        P.robot(70, 80, 0.46, { mood: 'proud' });
        P.bubble(110, 12, 150, 40, 100, 62);
        P.text(185, 38, 'ask_reviewer', { mono: true, size: 13, weight: 700 });
        P.arrow(110, 98, 144, 112, { c: 'accent', w: 2, head: 8 });
        P.rrect(150, 80, 170, 70, 10, { c: 'soft', w: 2 });
        ask(P, 235, 128, 34);
        P.text(235, 178, '검토자는 누가 부를까?', { size: 13, c: 'ink2' });
      }},
      q_supTurn: { w: 340, h: 200, label: '뒤섞인 카드: 실행 상자와 작은 로봇, 상태 쪽지가 큰 로봇으로, 기록장과 되돌아가는 화살표, 도구 이름 말풍선', draw(P) {
        cards(P, [
          (x, y) => { term(P, x + 8, y + 22, 40, 26, '>_', 10); P.arrow(x + 50, y + 35, x + 62, y + 35, { c: 'accent', w: 1.6, head: 5 }); P.robot(x + 76, y + 36, 0.2, { mood: 'wink' }); },
          (x, y) => { P.note(x + 8, y + 14, 26, 34, { fill: 'hi' }); P.arrow(x + 38, y + 32, x + 52, y + 32, { c: 'accent', w: 1.6, head: 5 }); P.robot(x + 70, y + 36, 0.28, { mood: 'proud' }); },
          (x, y) => { P.rrect(x + 10, y + 12, 40, 46, 4, { fill: 'paper', w: 1.6 }); [0, 1, 2].forEach(i => P.line(x + 16, y + 24 + i * 12, x + 44, y + 24 + i * 12, { c: 'soft', w: 2 })); P.curveArrow(x + 56, y + 50, x + 80, y + 40, x + 66, y + 16, { c: 'good', w: 1.6, head: 6 }); },
          (x, y) => { P.bubble(x + 6, y + 10, 80, 30, x + 30, y + 54); P.text(x + 46, y + 30, 'ask_rev…', { mono: true, size: 10 }); }
        ]);
        P.robot(270, 146, 0.5, { mood: 'wow' });
        scatterAsks(P);
      }},
      q_supCost: { w: 340, h: 200, label: '감독자 로봇 옆 입력 토큰 막대는 길고 출력 막대는 짧으며, 계산기 화면에 물음표', draw(P) {
        bot(P, 56, 66, 0.38, 'proud', '감독자');
        P.text(110, 52, '입력', { size: 12, anchor: 'start', weight: 700 });
        P.rrect(146, 40, 170, 16, 4, { fill: 'sky', fs: 'solid', w: 1.2 });
        P.text(110, 86, '출력', { size: 12, anchor: 'start', weight: 700 });
        P.rrect(146, 74, 10, 16, 4, { fill: 'warm', fs: 'solid', w: 1.2 });
        P.rrect(120, 112, 120, 74, 10, { fill: 'paper', w: 2 });
        P.rrect(130, 120, 100, 22, 4, { fill: 'ink', fs: 'solid' });
        P.text(222, 136, '$ ?', { mono: true, size: 13, anchor: 'end', c: 'paper' });
        [0, 1, 2].forEach(i => P.rrect(134 + i * 32, 152, 24, 22, 4, { c: 'soft', w: 1.4 }));
        P.text(292, 160, 'solar-pro4', { mono: true, size: 11, c: 'accent' });
      }},
      q_fullHist: { w: 340, h: 200, label: '긴 대화 두루마리를 통째로 받은 검토 로봇이 문항을 다시 쓰고 있는 어지러운 모습', draw(P) {
        P.rrect(14, 14, 80, 170, 8, { fill: 'paper', w: 1.8 });
        for (let i = 0; i < 9; i++) P.line(24, 32 + i * 17, 84 - (i % 3) * 12, 32 + i * 17, { c: i % 2 ? 'soft' : 'sky', w: 3 });
        P.arrow(100, 96, 150, 96, { c: 'warm', w: 3, head: 10 });
        P.robot(206, 96, 0.5, { mood: 'dizzy' });
        sheet(P, 252, 60, 50, 64, 'hi');
        P.line(262, 76, 296, 108, { c: 'bad', w: 2.4 });
        P.text(206, 160, '검토자', { size: 13, weight: 700 });
        P.text(260, 188, '왜 다시 쓰지?', { size: 13, c: 'ink2' });
      }},

      /* ---------- QB 그림 ---------- */
      qb_memory: { w: 340, h: 200, label: '출제 로봇만 조건 쪽지를 받았고, 검토 로봇 머리 위에 물음표', draw(P) {
        bot(P, 70, 90, 0.42, 'happy', '출제자');
        P.note(110, 30, 90, 50, { fill: 'hi' });
        P.text(155, 52, '보기 4개', { size: 12, weight: 700 });
        P.text(155, 70, '해설 한 줄', { size: 12, weight: 700 });
        bot(P, 270, 90, 0.42, 'wow', '검토자');
        ask(P, 270, 50, 26);
        P.text(170, 180, '검토자에게도 이 조건이 갈까?', { size: 13, c: 'ink2' });
      }},
      qb_miniSup: { w: 340, h: 200, label: '가벼운 모델로 바꾼 감독자 로봇이 같은 작업자를 자꾸 불러 고리가 길어지는 모습', draw(P) {
        bot(P, 80, 70, 0.32, 'dizzy', '감독자 mini4', 11);
        P.robot(250, 70, 0.3, { mood: 'sleepy' });
        [0, 1, 2].forEach(i => P.curveArrow(104, 60 + i * 6, 170, 18 + i * 10, 230, 60 + i * 6, { c: i === 2 ? 'warm' : 'soft', w: 1.6, head: 6 }));
        P.text(250, 112, '출제자', { size: 12, weight: 700 });
        P.text(170, 142, '또 출제자? 또?', { size: 14, weight: 700, c: 'warm' });
        P.text(170, 178, '턴이 길어지고 같은 부름이 되풀이', { size: 12, c: 'ink2' });
      }},
      qb_stateLog: { w: 340, h: 200, label: '고쳐 쓰는 칠판 하나와 한 줄씩 쌓이는 두루마리 하나, 각각 무엇인지 묻는 물음표', draw(P) {
        P.rrect(20, 30, 130, 96, 8, { fill: 'good', gap: 8, w: 2 });
        P.rrect(30, 40, 110, 76, 4, { fill: 'paper', fs: 'solid', w: 1.2 });
        P.text(85, 74, '4번 2판', { size: 14, weight: 700 });
        P.text(85, 98, '만드는 중', { size: 12, c: 'ink2' });
        P.rrect(200, 20, 120, 130, 8, { fill: 'paper', w: 1.8 });
        for (let i = 0; i < 6; i++) P.line(212, 40 + i * 18, 306 - (i % 3) * 14, 40 + i * 18, { c: 'soft', w: 3 });
        ask(P, 85, 160, 24);
        ask(P, 260, 176, 24);
        P.text(170, 194, '무엇이 상태고 무엇이 로그일까', { size: 12, c: 'ink2' });
      }},

      /* ---------- L5 설명 그림 ---------- */
      costCalc: { w: 340, h: 200, label: '문항 10개 곱하기 호출 4번 곱하기 토큰, 계산기에 나온 작은 금액', draw(P) {
        sheet(P, 14, 40, 50, 64, 'hi');
        P.text(39, 124, '문항 10', { size: 12, weight: 700 });
        P.text(80, 78, '×', { size: 20, weight: 700, c: 'accent' });
        P.robot(122, 70, 0.3, { mood: 'happy' });
        P.text(122, 124, '호출 4', { size: 12, weight: 700 });
        P.text(160, 78, '×', { size: 20, weight: 700, c: 'accent' });
        P.rrect(176, 54, 56, 14, 3, { fill: 'sky', fs: 'solid', w: 1 });
        P.rrect(176, 76, 22, 14, 3, { fill: 'warm', fs: 'solid', w: 1 });
        P.text(204, 124, '토큰', { size: 12, weight: 700 });
        P.text(248, 78, '=', { size: 20, weight: 700, c: 'accent' });
        P.rrect(262, 40, 66, 70, 8, { fill: 'paper', w: 2 });
        P.rrect(268, 48, 54, 20, 3, { fill: 'ink', fs: 'solid' });
        P.text(316, 63, '$', { mono: true, size: 12, anchor: 'end', c: 'paper' });
        P.text(170, 166, '호출 40번 · 입력 4만 · 출력 1만 6천', { size: 12, c: 'ink2' });
        P.text(170, 192, '곱셈 세 번이면 어림 끝', { size: 13, weight: 700, c: 'accent' });
      }},
      failThree: { w: 340, h: 204, label: '빙글빙글 도는 고리, 서로 하트를 주고받는 두 로봇, 출제자 모자를 쓴 검토 로봇', draw(P) {
        P.circle(56, 70, 72, { c: 'warm', w: 2.4 });
        P.arrow(86, 46, 92, 58, { c: 'warm', w: 2.4, head: 8 });
        P.robot(56, 74, 0.22, { mood: 'dizzy' });
        P.robot(150, 74, 0.26, { mood: 'happy' });
        P.robot(196, 74, 0.26, { mood: 'happy' });
        P.heart(173, 40, 7, 'pink');
        P.robot(286, 80, 0.32, { mood: 'wink' });
        P.path('M266 52 L306 52 L296 38 L276 38 Z', { fill: 'warm', gap: 4 });
        P.text(56, 136, '끝없는 반복', { size: 13, weight: 700 });
        P.text(173, 136, '서로 맞장구', { size: 13, weight: 700 });
        P.text(286, 136, '역할 섞임', { size: 13, weight: 700 });
        P.text(56, 158, '최대 횟수', { size: 11, c: 'ink2' });
        P.text(173, 158, '기준·깨끗한 입력', { size: 11, c: 'ink2' });
        P.text(286, 158, '하지 않을 일', { size: 11, c: 'ink2' });
        P.text(170, 192, '로그를 읽으면 모양이 보여요', { size: 13, c: 'accent' });
      }},
      humanGate: { w: 340, h: 200, label: '검토를 통과한 문항 더미가 확정 문 앞에서 선생님에게 마지막으로 읽히는 모습', draw(P) {
        [0, 1, 2].forEach(i => sheet(P, 20 + i * 10, 40 + i * 8, 54, 70, ['paper', 'hi', 'sky'][i]));
        P.text(60, 148, '검토 통과', { size: 12, weight: 700, c: 'good' });
        P.arrow(110, 80, 150, 80, { c: 'accent', w: 2.2, head: 8 });
        person(P, 196, 170, 'smile', 0.7);
        lens(P, 230, 66, 28);
        P.rrect(262, 30, 66, 120, 6, { fill: 'good', gap: 7 });
        P.text(295, 96, '확정', { size: 15, weight: 700 });
        P.text(170, 192, '학생에게 가기 전, 마지막 눈은 교사', { size: 13, c: 'accent' });
      }},
      cursorLink: { w: 340, h: 212, label: '왼쪽은 Cursor 부모 에이전트와 서브에이전트, 오른쪽은 team.py 감독자와 작업자, 같은 모양으로 나란히', draw(P) {
        P.text(85, 20, 'Cursor', { size: 14, weight: 700 });
        P.text(255, 20, 'team.py', { mono: true, size: 14, weight: 700 });
        bot(P, 85, 58, 0.3, 'happy', '부모');
        bot(P, 255, 58, 0.3, 'proud', '감독자');
        [45, 125].forEach((x, i) => { P.robot(x, 150, 0.22, { mood: i ? 'wink' : 'smile' }); P.line(85, 104, x, 132, { c: 'soft', w: 1.6 }); });
        [215, 295].forEach((x, i) => { P.robot(x, 150, 0.22, { mood: i ? 'wink' : 'smile' }); P.line(255, 104, x, 132, { c: 'soft', w: 1.6 }); });
        P.text(85, 186, '서브에이전트', { size: 12, weight: 700 });
        P.text(255, 186, '작업자', { size: 12, weight: 700 });
        P.line(170, 30, 170, 190, { c: 'soft', w: 1.2 });
        P.text(170, 206, '요약·JSON만 돌려줘요', { size: 12, c: 'accent' });
      }},

      /* ---------- L5 문제 그림 ---------- */
      q_quizCost: { w: 340, h: 200, label: '문항 20개 쪽지 더미와 작은 로봇, 계산기 화면의 물음표', draw(P) {
        [0, 1, 2, 3].forEach(i => sheet(P, 16 + i * 8, 30 + i * 6, 56, 72, ['paper', 'hi', 'sky', 'paper'][i]));
        P.text(60, 140, '문항 20', { size: 13, weight: 700 });
        P.robot(150, 70, 0.3, { mood: 'happy' });
        P.text(150, 124, 'solar-mini4', { mono: true, size: 11, c: 'good' });
        P.rrect(214, 30, 110, 120, 10, { fill: 'paper', w: 2 });
        P.rrect(224, 40, 90, 28, 4, { fill: 'ink', fs: 'solid' });
        P.text(306, 60, '$ ?', { mono: true, size: 14, anchor: 'end', c: 'paper' });
        for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) P.rrect(228 + c * 28, 80 + r * 30, 22, 22, 4, { c: 'soft', w: 1.4 });
        P.text(170, 184, '호출 5번씩, 얼마쯤?', { size: 13, c: 'ink2' });
      }},
      q_yesMan: { w: 340, h: 200, label: '출제 로봇의 "정답 맞아요!" 말을 들은 검토 로봇이 늘 통과 동그라미를 내미는 모습', draw(P) {
        bot(P, 60, 80, 0.4, 'proud', '출제자');
        P.bubble(96, 18, 120, 40, 86, 62);
        P.text(156, 43, '정답 맞아요!', { size: 13, weight: 700 });
        bot(P, 270, 80, 0.4, 'happy', '검토자');
        P.circle(210, 124, 40, { c: 'good', w: 2.6 });
        P.text(210, 129, 'pass', { mono: true, size: 12, weight: 700, c: 'good' });
        P.text(170, 182, '늘 1판에서 통과…', { size: 13, c: 'ink2' });
      }},
      q_mixLine: { w: 340, h: 200, label: '다섯 줄짜리 검토자 프롬프트 쪽지와, 출제자 모자를 쓰려는 검토 로봇', draw(P) {
        P.note(20, 20, 170, 160, { fill: 'sky' });
        [50, 78, 106, 134, 162].forEach((y, i) => P.line(40, y, 170 - (i % 3) * 14, y, { c: 'ink2', w: 2.4 }));
        P.robot(268, 118, 0.5, { mood: 'wink' });
        P.path('M246 74 L290 74 L280 58 L256 58 Z', { fill: 'warm', gap: 4 });
        ask(P, 312, 66, 22);
        P.text(268, 192, '어느 줄이 문제일까?', { size: 12, c: 'ink2' });
      }},
      q_sameIssue: { w: 340, h: 200, label: '1판, 2판, 3판 쪽지 위에 똑같은 지적 말풍선이 되풀이된 모습', draw(P) {
        ['1판', '2판', '3판'].forEach((t, i) => {
          const x = 20 + i * 104;
          sheet(P, x, 70, 70, 86, ['paper', 'hi', 'sky'][i]);
          P.text(x + 35, 174, t, { size: 13, weight: 700 });
          P.bubble(x - 4, 14, 92, 36, x + 40, 66);
          P.text(x + 42, 38, '보기 ③ 모호', { size: 11 });
        });
        P.text(170, 196, '같은 지적이 세 번', { size: 12, c: 'ink2' });
      }},

      /* ---------- T1 그림 ---------- */
      t_askSwitch: { w: 340, h: 200, label: '연수장 책상에 나란히 앉은 두 선생님, 한 명이 멀티에이전트는 어디서 켜냐고 묻는 모습', draw(P) {
        person(P, 80, 96, 'smile', 0.5);
        person(P, 262, 96, 'wow', 0.5);
        laptop(P, 34, 96, 92, 52, 'paper');
        laptop(P, 216, 96, 92, 52, 'paper');
        P.line(6, 164, 334, 164, { c: 'ink2', w: 2 });
        P.bubble(112, 8, 118, 38, 240, 36);
        P.text(171, 33, '어디서 켜요?', { size: 13, weight: 700 });
        P.text(170, 188, '연수 실습 시간', { size: 13, c: 'ink2' });
      }},
      t_answers120: { w: 340, h: 200, label: '번호만 남긴 답안 쪽지 더미 120장과 서둘러야 하는 시계', draw(P) {
        for (let i = 0; i < 5; i++) P.note(20 + i * 10, 40 + i * 8, 80, 96, { fill: i % 2 ? 'hi' : 'paper' });
        P.text(100, 120, '#120', { mono: true, size: 14, weight: 700 });
        P.text(80, 188, '답안 120개(번호만)', { size: 12, c: 'ink2' });
        clock(P, 230, 74, 70);
        P.text(230, 140, '빨리!', { size: 16, weight: 700, c: 'warm' });
        P.text(250, 188, '서로 상관없어요', { size: 12, c: 'ink2' });
      }},
      t_429: { w: 340, h: 200, label: '작업자 로봇 열 대가 한꺼번에 요청을 보내 429 표지판이 줄줄이 뜬 모습', draw(P) {
        for (let i = 0; i < 5; i++) for (let j = 0; j < 2; j++) P.robot(30 + i * 44, 50 + j * 64, 0.2, { mood: j ? 'wow' : 'happy' });
        [0, 1, 2].forEach(i => { P.rrect(250, 26 + i * 44, 70, 32, 6, { fill: 'bad', gap: 5 }); P.text(285, 48 + i * 44, '429', { mono: true, size: 16, weight: 700 }); });
        P.arrow(222, 80, 244, 80, { c: 'warm', w: 2.4, head: 8 });
        P.text(120, 166, '연수장에서 한꺼번에 보냈더니', { size: 12, c: 'ink2' });
        P.text(120, 190, '단원 10개 = 작업자 10개', { size: 12, weight: 700 });
      }},
      t_itemOrder: { w: 340, h: 200, label: '뒤섞인 카드: 돋보기 든 로봇, 기록장과 동그라미, 빨간 줄을 고치는 쪽지, 반짝이는 새 쪽지', draw(P) {
        cards(P, [
          (x, y) => { P.robot(x + 34, y + 36, 0.24, { mood: 'wink' }); lens(P, x + 68, y + 30, 22); },
          (x, y) => { P.rrect(x + 10, y + 10, 40, 50, 4, { fill: 'paper', w: 1.6 }); [0, 1, 2].forEach(i => P.line(x + 16, y + 22 + i * 12, x + 44, y + 22 + i * 12, { c: 'soft', w: 2 })); P.circle(x + 70, y + 36, 26, { c: 'good', w: 2.2 }); },
          (x, y) => { sheet(P, x + 14, y + 8, 40, 54, 'hi'); P.line(x + 22, y + 30, x + 50, y + 30, { c: 'bad', w: 2.4 }); P.line(x + 60, y + 52, x + 80, y + 20, { w: 3, c: 'ink2' }); },
          (x, y) => { sheet(P, x + 26, y + 8, 40, 54, 'paper'); P.sparkle(x + 76, y + 18, 7, 'hi'); P.sparkle(x + 16, y + 52, 5, 'warm'); }
        ]);
        P.robot(270, 146, 0.5, { mood: 'wow' });
        scatterAsks(P);
      }},
      t_oldModel: { w: 340, h: 200, label: '모델 이름 설정 쪽지와 10월 30일에 동그라미 친 달력', draw(P) {
        P.note(16, 20, 180, 140, { fill: 'paper' });
        [48, 74, 100, 126].forEach((y, i) => P.line(32, y, 172 - i * 14, y, { c: ['accent', 'good', 'soft', 'soft'][i], w: 3 }));
        P.text(106, 182, 'team.py 설정', { size: 12, c: 'ink2' });
        P.rrect(222, 30, 104, 110, 8, { fill: 'paper', w: 2 });
        P.rect(222, 30, 104, 24, { fill: 'bad', fs: 'solid', c: null });
        P.text(274, 48, '10월', { size: 13, weight: 700, c: 'paper' });
        P.text(274, 108, '30', { size: 34, weight: 700 });
        P.circle(274, 96, 58, { c: 'warm', w: 2.4 });
        P.text(274, 170, '이날 뒤엔?', { size: 13, weight: 700, c: 'warm' });
      }},
      t_schema2: { w: 340, h: 200, label: '스키마 쪽지 아래쪽 두 칸이 비어 있고, strict 자물쇠가 걸린 모습', draw(P) {
        jbox(P, 14, 20, 210, 150, ['"properties": {', '  "pass": …,', '  "issues": … },', '"required": ___,', '"additional…": ___'], 12);
        P.rrect(258, 80, 56, 48, 8, { fill: 'hi', gap: 5, w: 2 });
        P.path('M270 80 L270 66 Q286 46 302 66 L302 80', { w: 2.4 });
        P.text(286, 152, 'strict', { mono: true, size: 14, weight: 700, c: 'accent' });
      }},
      t_workerCost: { w: 340, h: 200, label: '작업자 로봇의 모델 이름표를 큰 모델에서 가벼운 모델로 바꿔 다는 모습과 동전', draw(P) {
        P.robot(70, 74, 0.46, { mood: 'happy' });
        tag(P, 70, 136, 'solar-pro4', { mono: true, size: 11, c: 'accent' });
        P.arrow(124, 82, 196, 82, { c: 'accent', w: 2.4, head: 9 });
        P.robot(250, 74, 0.46, { mood: 'happy' });
        tag(P, 250, 136, 'solar-mini4', { mono: true, size: 11, c: 'good' });
        [0, 1, 2].forEach(i => coin(P, 40 + i * 30, 174, 24));
        coin(P, 250, 174, 24);
        ask(P, 290, 182, 20);
      }},
      t_allPass: { w: 340, h: 200, label: '통과 표시가 가득한 검토 기록장과, 이 검토자를 믿어도 될지 고민하는 선생님', draw(P) {
        P.rrect(16, 20, 150, 150, 10, { fill: 'paper', w: 2 });
        for (let i = 0; i < 5; i++) { P.line(30, 46 + i * 26, 110, 46 + i * 26, { c: 'soft', w: 3 }); tick(P, 140, 46 + i * 26, 8); }
        P.robot(214, 96, 0.36, { mood: 'happy' });
        person(P, 292, 196, 'wow', 0.7);
        P.text(250, 40, '믿어도 될까?', { size: 13, weight: 700, c: 'warm' });
      }},
      t_cursorSub: { w: 340, h: 200, label: 'Cursor 창 속 부모와 서브에이전트, team.py 상자 속 감독자와 작업자 사이의 물음표', draw(P) {
        win(P, 14, 24, 130, 120);
        P.robot(56, 92, 0.26, { mood: 'happy' });
        P.robot(108, 112, 0.18, { mood: 'wink' });
        P.text(79, 166, 'Cursor 서브에이전트', { size: 11, weight: 700 });
        P.text(170, 92, '≈ ?', { size: 20, weight: 700, c: 'warm' });
        P.rrect(196, 24, 130, 120, 10, { fill: 'ink', fs: 'solid' });
        P.text(261, 46, 'team.py', { mono: true, size: 12, c: 'paper' });
        P.robot(238, 96, 0.26, { mood: 'proud' });
        P.robot(290, 112, 0.18, { mood: 'smile' });
        P.text(261, 166, '작업자 에이전트', { size: 11, weight: 700 });
        P.text(170, 192, '무엇이 닮았을까?', { size: 13, c: 'ink2' });
      }},
      t_compare: { w: 340, h: 200, label: '왼쪽은 로봇 하나와 동전 하나, 오른쪽은 로봇 셋과 동전 여럿, 양쪽 문항 쪽지에 빨간 표시가 하나씩', draw(P) {
        P.robot(56, 60, 0.32, { mood: 'happy' });
        sheet(P, 98, 30, 50, 64, 'paper');
        cross(P, 134, 80, 5);
        coin(P, 84, 130, 26);
        P.text(84, 172, '하나', { size: 13, weight: 700 });
        P.line(170, 20, 170, 180, { c: 'soft', w: 1.2 });
        [196, 228, 260].forEach((x, i) => P.robot(x, 60, 0.2, { mood: ['happy', 'wink', 'proud'][i] }));
        sheet(P, 278, 30, 50, 64, 'hi');
        cross(P, 314, 80, 5);
        [204, 228, 252, 276].forEach(x => coin(P, x, 130, 22));
        P.text(254, 172, '팀', { size: 13, weight: 700 });
        P.text(170, 196, '오류는 둘 다 1개', { size: 12, c: 'ink2' });
      }}
    },

    items: [
    /* =================== L1 =================== */
    { id: 'L1', type: 'lesson', title: '왜 여럿으로 나눌까', sub: '역할 분리·짧은 지시·서로 검사, 그리고 하나로 충분할 때', min: 12, steps: [
      { t: 'say', h: '멀티에이전트는 기능이 아니라 설계 방법이에요', fig: 'oneVsTeam', p: [
        'c5u1의 <code>agent.py</code>는 에이전트 하나가 도구 여럿을 골라 썼어요. <b>멀티에이전트</b>(multi-agent)는 역할을 나눈 에이전트 여럿이 일을 주고받는 구조예요.',
        '업스테이지 API에 "멀티에이전트" 스위치가 따로 있는 게 아니에요. 같은 Chat Completions를 <b>역할마다 다른 시스템 프롬프트</b>로 여러 번 부르고, 그 사이를 내 파이썬 코드가 이어요. 아래 코드가 뼈대의 전부예요.',
        'c5u1에서 본 Upstage Studio는 문서 처리 단계를 화면에서 잇는 노코드 도구예요. 이 단원은 그런 제품 기능이 아니라, 파이썬으로 역할을 나누는 <b>설계 방법</b>을 다뤄요.'
      ], code: { lang: 'py', src: src(['def agent(system, user, model=MODEL):', '    r = client.chat.completions.create(', '        model=model,', '        messages=[{"role": "system",', '                   "content": system},', '                  {"role": "user",', '                   "content": user}],', '        reasoning_effort="none")', '    return r.choices[0].message.content', '', 'draft = agent(WRITER, "반복문 1문제")', 'note = agent(REVIEWER, draft)']) },
        tip: '에이전트 하나 = <b>시스템 프롬프트(역할)</b> + 모델 + (있으면) 도구. 둘이 되면 그 사이를 잇는 코드가 생겨요. <code>client</code>와 <code>MODEL</code>은 c1u3의 <code>hello_solar.py</code>와 같아요.' },
      { t: 'say', h: '나누면 좋은 점은 세 가지예요', fig: 'threeGood', table: { head: ['좋은 점', '뜻', '형성평가 출제에서'], rows: [
        ['<b>역할 분리</b>', '에이전트마다 한 가지 일만', '출제자는 만들기만, 검토자는 찾기만'],
        ['<b>짧고 분명한 지시</b>', '시스템 프롬프트가 짧아져 규칙을 덜 놓쳐요', '"보기 4개·정답 1개" 같은 규칙이 묻히지 않아요'],
        ['<b>서로 검사</b>', '만든 쪽과 다른 지시·다른 입력으로 다시 봐요', '정답이 둘인 문항, 틀린 해설을 잡아요'] ] }, p: [
        '한 에이전트에게 "만들고, 검토하고, 고치고, 난이도도 맞춰"를 한꺼번에 시키면 시스템 프롬프트가 길어지고, 규칙 몇 개는 슬쩍 빠지기 쉬워요.',
        '나누면 각자 짧은 지시로 한 가지만 해요. 특히 자기가 쓴 글을 같은 대화에서 다시 보면 같은 실수를 지나치기 쉬워서, 검토는 <b>깨끗한 입력</b>으로 따로 부르는 게 좋아요.'
      ]},
      { t: 'say', h: '그래도 하나로 충분할 때가 많아요', fig: 'enoughOne', p: [
        '에이전트가 늘면 <b>호출 수(=토큰=돈)</b>, 기다리는 시간, 고칠 코드, 실패할 곳이 함께 늘어요. 셋으로 나누면 호출이 세 배를 넘기 쉬워요.',
        '퀴즈 3문제, 학습지 요약, 자료 한 개로 답하기처럼 <b>작고 내가 바로 확인할 수 있는 일</b>은 에이전트 하나 + 사람 확인이 가장 싸고 빨라요.',
        '그래서 순서는 늘 같아요. 하나로 먼저 해 보고, 어디서 자꾸 틀리는지 모은 뒤, <b>그 부분만</b> 떼어 내요.'
      ]},
      { t: 'say', h: '나누기 전에 네 가지를 물어봐요', table: { head: ['물어볼 것', '이럴 때 나눠요'], rows: [
        ['프롬프트를 고쳐 봤나?', '하나로 고쳐도 같은 실수가 되풀이될 때'],
        ['역할 경계가 분명한가?', '"만들기"와 "찾기"처럼 일이 확실히 갈릴 때'],
        ['결과를 코드로 잇기 쉬운가?', '주고받을 것이 JSON 하나로 정해질 때'],
        ['비용·시간을 감당할 만한가?', '호출이 몇 배가 돼도 그만큼 나아질 때'] ] }, p: [
        '넷 다 "예"일 때 나눠요. 하나라도 걸리면 프롬프트를 고치거나 사람 확인을 더하는 쪽이 싸요.',
        '수업에서는 형성평가 10문제처럼 양이 많고, "정답이 하나인가" 같은 검토 기준이 분명한 일이 나눌 만한 대표예요. 이 단원은 이 일로 끝까지 가요.'
      ]},
      { t: 'q', kind: 'mc', fig: 'q_whatIs', q: '출제·검토 두 역할로 멀티에이전트를 만들고 싶어요. 업스테이지 쪽에서 무엇이 필요할까요?',
        opts: ['콘솔 Playground에서 멀티에이전트 모드를 따로 켠다', '역할마다 다른 API 키를 새로 만들어 나눠 쓴다', '같은 Chat API를 역할별 시스템 프롬프트로 부른다', '멀티에이전트 전용 모델 이름을 찾아 바꿔 쓴다'], a: 2,
        why: '멀티에이전트는 <b>설계 방법</b>이에요. 같은 API를 역할마다 다른 시스템 프롬프트로 부르고, 결과를 다음 역할에 넘기는 건 내 파이썬 코드예요.',
        ex: ['Playground는 브라우저에서 모델을 써 보는 곳이에요. 켤 모드가 따로 없고, 나누고 잇는 건 내 코드예요.', '키는 하나면 돼요. 역할은 키가 아니라 시스템 프롬프트가 정해요.', '', '모델은 지금 쓰는 solar-pro4·solar-mini4 그대로예요. 역할은 프롬프트로 나눠요.'] },
      { t: 'q', kind: 'mc', fig: 'q_quick3', q: '내일 1교시 도입에 쓸 반복문 퀴즈 3문제가 필요해요. 가장 알맞은 방법은?',
        opts: ['출제·검토·감독 셋으로 팀을 짜고 검토 로그도 남긴다', 'solar-pro4 한 번으로 만들고 내가 읽어 고친다', '출제 에이전트 다섯을 나란히 돌려 가장 좋은 것을 고른다', '검토자가 통과를 줄 때까지 고치는 반복을 붙인다'], a: 1,
        why: '작고 금방 확인할 수 있는 일은 하나로 충분해요. 세 문제를 내가 읽는 데 1분이면, 검토 에이전트보다 내 눈이 싸고 빨라요.',
        ex: ['세 문제에 팀은 너무 커요. 호출·비용·고칠 코드만 늘어요.', '', '호출이 다섯 배에, 고르는 수고까지 더해져요. 세 문제엔 지나쳐요.', '내가 바로 읽을 수 있는 분량이라, 검토 반복이 할 일을 내가 더 빨리 해요.'] },
      { t: 'q', kind: 'mc', fig: 'q_whyReview', q: '출제자에게 "다 만들면 스스로 검토도 해"라고 하는 대신 검토자를 따로 두는 까닭으로 가장 알맞은 것은?',
        opts: ['검토자를 두면 모델 자체의 성능이 올라간다', '호출이 늘수록 답이 무조건 정확해진다', '검토자를 두면 사람 확인을 안 해도 된다', '다른 지시와 깨끗한 입력으로 보게 해 놓친 것을 찾기 쉽다'], a: 3,
        why: '자기가 쓴 글을 같은 대화에서 다시 보면 같은 실수를 지나치기 쉬워요. "검토만 하라"는 짧은 지시와 문항만 담은 입력이 <b>다른 눈</b>을 만들어요. 그래도 확정은 사람이 해요.',
        ex: ['모델은 그대로예요. 달라지는 건 지시와 입력이에요.', '호출을 늘린다고 늘 나아지지 않아요. 맞장구만 늘 수도 있어요(레슨 5).', '검토자도 틀려요. 학생에게 내기 전 사람 확인은 남겨요.', ''] },
      { t: 'q', kind: 'order', fig: 'q_growOrder', q: '에이전트 하나로 시작해 멀티에이전트로 키우는 순서대로 쌓아 보세요.',
        items: ['에이전트 하나로 먼저 만들어 돌려 본다', '어디서 자주 틀리는지 결과를 모아 적는다', '자주 틀리는 일만 떼어 역할을 나눈다', '나눈 뒤의 품질·비용을 하나일 때와 견준다'],
        why: '문제가 보여야 나눌 곳을 알고, 나눈 뒤엔 정말 나아졌는지 숫자로 봐요. 나아지지 않으면 하나로 돌아가요.' },
      { t: 'q', kind: 'blank', fig: 'q_agentParts', q: '이 단원은 "에이전트 하나"를 이렇게 봐요. 빈칸에 들어갈 것은?', lang: 'plain', code: '에이전트 하나\n= [[1]]\n+ 모델(solar-pro4 등)\n+ 도구(있으면)',
        opts: ['역할을 적은 시스템 프롬프트', 'API 키', '.env 파일', 'Git 브랜치'], a: 0,
        why: '역할은 시스템 프롬프트가 정해요. 같은 모델이어도 시스템 프롬프트가 다르면 다른 역할(출제자·검토자)이 돼요.',
        ex: ['', '키는 내 계정 것이라 역할마다 바뀌지 않아요.', '.env는 키를 보관하는 파일이에요. 역할과 상관없어요.', 'Git 브랜치는 코드 기록을 나누는 곳이에요. 에이전트의 역할과 상관없어요.'] },
      { t: 'sum', pts: ['멀티에이전트는 업스테이지 기능이 아니라 설계 방법. 같은 API를 역할별 시스템 프롬프트로 부르고 코드가 잇는다.', '나누면 역할 분리·짧은 지시·서로 검사가 좋아지지만, 호출·비용·시간·실패할 곳도 함께 는다.', '하나로 먼저 해 보고, 자꾸 틀리는 곳만 떼어 낸다. 작고 바로 확인할 일은 하나 + 사람 확인.'] }
    ]},

    /* =================== L2 =================== */
    { id: 'L2', type: 'lesson', title: '멀티에이전트의 네 가지 모양', sub: '순차 파이프라인, 감독자-작업자, 만들기-검토 반복, 나눠 하고 합치기', min: 12, steps: [
      { t: 'say', h: '① 순차 파이프라인: 앞 결과가 다음 입력이에요', fig: 'pipeFig', p: [
        '공장 컨베이어처럼 에이전트를 한 줄로 세워요. 학습지를 Document Parse로 읽고(c2u1) → 개념 뽑기 → 문항 만들기 → 형식 검사. 앞 단계의 결과가 다음 단계의 입력이에요.',
        '순서는 <b>내 코드가</b> 정해요. c3u1에서 본 워크플로와 같은 생각이에요. 단순하고 예측하기 쉬워서 처음 나눌 때 가장 무난해요.',
        '약점은 앞에서 틀린 게 뒤로 그대로 흘러간다는 것. 단계 사이에 형식 검사(JSON이 맞나, 빈칸은 없나)를 하나씩 끼워 둬요.'
      ]},
      { t: 'say', h: '② 감독자-작업자: 다음 일을 감독자가 골라요', fig: 'supFig', p: [
        '<b>감독자</b>(supervisor) 에이전트가 지금 상태를 보고 어느 <b>작업자</b>에게 무엇을 맡길지 고르고, 결과를 받아 다음을 정해요. 출제를 맡길지, 검토를 받을지, 끝낼지를 감독자가 골라요.',
        '만드는 법은 c5u1의 도구 호출 그대로예요. 작업자를 <code>tools</code>로 주면 돼요(레슨 4). 질문마다 할 일이 달라지는 도우미처럼 <b>길이 정해지지 않은 일</b>에 맞아요.',
        '대신 감독자가 엉뚱하게 고를 수 있고, 감독자 호출만큼 돈도 더 들어요. 최대 턴 수와 로그는 꼭 둬요.'
      ]},
      { t: 'say', h: '③ 만들기-검토 반복: 끝내는 조건을 먼저 정해요', fig: 'loopFig', p: [
        '만드는 쪽(출제자)과 보는 쪽(검토자)이 주고받아요. 검토가 통과를 주면 끝, 아니면 지적(issues)을 들고 출제자가 고쳐요. 형성평가 문항처럼 <b>틀린 곳을 찾기 쉬운 일</b>에 잘 맞아요.',
        '반드시 <b>출구 두 개</b>를 둬요. "통과"와 "최대 횟수". 이 단원은 고치기를 최대 2번으로 정하고, 그래도 못 넘으면 버리지 않고 <b>사람 확인</b>으로 넘겨요.',
        '출구가 "통과" 하나뿐이면 검토자가 새 지적을 낼 때마다 호출과 돈이 계속 나가요.'
      ]},
      { t: 'say', h: '④ 나눠 하고 합치기: 서로 상관없는 일은 나란히', fig: 'fanFig', p: [
        '일을 서로 상관없는 조각(단원별 문항, 답안 묶음)으로 나눠 작업자 여럿이 <b>동시에</b> 하고, 마지막에 합쳐요. 차례로 할 때보다 끝나는 시간이 짧아져요.',
        '하지만 할 일의 양은 그대로라 <b>호출 수와 토큰(돈)은 줄지 않아요</b>. 한꺼번에 많이 보내면 분당 제한에 걸려 <code>429</code>를 만나기도 쉬워요(c1u3).',
        '조각끼리는 서로를 모르니 비슷한 문항이 겹치거나 빠질 수 있어요. 합치는 단계에서 번호·겹침·빠짐을 검사해요.'
      ]},
      { t: 'say', h: '네 모양을 한눈에 봐요', fig: 'fourShapes', table: { head: ['모양', '다음 일은 누가 정하나', '조심할 것'], rows: [
        ['① 순차 파이프라인', '코드(정해진 순서)', '앞에서 틀리면 뒤로 흘러가요'],
        ['② 감독자-작업자', '감독자 모델', '엉뚱한 고르기, 최대 턴 필요'],
        ['③ 만들기-검토 반복', '코드(통과·횟수로 멈춤)', '끝내는 조건이 없으면 끝없이'],
        ['④ 나눠 하고 합치기', '코드(나누기·합치기)', '429, 겹침·빠짐, 비용은 그대로'] ] }, p: [
        '실제로는 섞어 써요. 단원별로 나눠 하고 합치되(④), 각 문항은 만들기-검토 반복(③)으로 다듬을 수 있어요.',
        '어느 모양이든 시작은 같아요. 에이전트 하나로 해 보고, 자꾸 틀리는 곳만 떼어 내요.'
      ]},
      { t: 'q', kind: 'mc', fig: 'q_fourUnits', q: '변수·조건문·반복문·함수 단원마다 3문제씩, 서로 상관없이 만들어 12문제로 모으려 해요. 빨리 끝내고 싶다면 어떤 모양이 가장 잘 맞을까요?',
        opts: ['순차 파이프라인', '감독자-작업자', '만들기-검토 반복', '나눠 하고 합치기'], a: 3,
        why: '서로 기다릴 필요 없는 조각이라 나란히 만들고 마지막에 합쳐요. 합칠 때 번호·겹침을 검사해요.',
        ex: ['단원끼리 앞 결과를 이어받을 일이 없어요. 한 줄로 세우면 기다리기만 길어져요.', '누구를 부를지 매번 고를 일이 없어요. 나누는 방법이 처음부터 정해져 있어요.', '주고받는 고치기는 문항 하나 안의 이야기예요. 이 질문은 단원끼리 어떻게 나누느냐예요.', ''] },
      { t: 'q', kind: 'mc', fig: 'q_router', q: '학생 질문 도우미를 만들어요. 질문마다 자료 검색 담당, 코드 채점 담당, 안내만 하는 답 중 무엇을, 몇 번, 어떤 순서로 쓸지가 달라요. 어떤 모양이 가장 잘 맞을까요?',
        opts: ['순차 파이프라인', '감독자-작업자', '만들기-검토 반복', '나눠 하고 합치기'], a: 1,
        why: '할 일과 순서가 질문마다 달라지면, 감독자가 상황을 보고 작업자(도구)를 골라요. c5u1의 도구 호출 루프와 같은 구조예요.',
        ex: ['순서가 늘 같을 때 맞는 모양이에요. 여기선 질문마다 길이 달라요.', '', '검토하며 고치는 일이 아니에요. 담당을 고르는 일이에요.', '한 질문을 조각내 나란히 할 일이 아니에요.'] },
      { t: 'q', kind: 'order', fig: 'q_pipeOrder', q: '학습지 PDF에서 형성평가 문항을 만드는 순차 파이프라인이에요. 순서대로 쌓아 보세요.',
        items: ['Document Parse로 학습지를 Markdown으로 바꾼다', '핵심 개념 목록을 뽑는다', '개념마다 문항을 만든다', '형식을 검사하고 quiz.json에 저장한다'],
        why: '앞 단계의 결과가 다음 단계의 입력이에요. 파싱한 글이 있어야 개념을 뽑고, 개념이 있어야 문항을 만들고, 문항이 있어야 검사해요.' },
      { t: 'q', kind: 'mc', fig: 'q_dupMerge', q: '나눠 하고 합치기로 단원 네 개의 문항을 만들었더니, 합친 12문제에 거의 같은 문항이 두 번 들어 있었어요. 어디서 막는 게 가장 알맞을까요?',
        opts: ['작업자를 넷에서 여덟로 늘린다', '작업자마다 temperature를 0으로 맞춘다', '합치는 단계에서 겹침·빠짐을 검사한다', '작업자에게 서로의 대화 기록을 모두 보여 준다'], a: 2,
        why: '조각끼리는 서로를 모르니 비슷한 걸 만들 수 있어요. 합치는 자리가 전체를 보는 유일한 곳이라, 겹침·빠짐·번호를 거기서 검사해요.',
        ex: ['작업자가 늘면 겹칠 기회도 늘어요.', 'temperature를 낮춰도 작업자끼리 서로를 보지 못하는 건 그대로예요.', '', '기록을 다 넘기면 토큰이 크게 늘고 역할이 섞여요. 전체를 보는 일은 합치는 단계에 맡겨요.'] },
      { t: 'sum', pts: ['① 순차 파이프라인: 코드가 정한 한 줄. 단계 사이에 형식 검사. ② 감독자-작업자: 감독자 모델이 다음 작업자를 고른다. 최대 턴·로그.', '③ 만들기-검토 반복: 출구는 "통과"와 "최대 횟수" 둘. 못 넘으면 사람 확인.', '④ 나눠 하고 합치기: 빨라지지만 호출·토큰은 그대로, 429와 겹침·빠짐에 주의. 실제로는 섞어 쓴다.'] }
    ]},

    /* =================== QA =================== */
    { id: 'QA', type: 'quiz', title: '헷갈림 퀴즈 ①', sub: '파이프라인 vs 감독자, 반복 끝내기, 나란히 하기', min: 4, steps: [
      { t: 'q', kind: 'mc', fig: 'qa_whoNext', q: '순차 파이프라인과 감독자-작업자는 둘 다 출제·검토 에이전트를 쓸 수 있어요. 가장 큰 차이는?',
        opts: ['파이프라인은 모델 하나만, 감독자 쪽은 모델 둘 이상을 쓴다', '다음 차례를 파이프라인은 코드가, 감독자 쪽은 모델이 고른다', '파이프라인에서는 단계마다 구조화 출력을 쓸 수 없다', '감독자-작업자는 작업자를 늘 동시에 돌려야 한다'], a: 1,
        why: '파이프라인은 내가 정한 순서대로 코드가 불러요(워크플로). 감독자-작업자는 감독자 모델이 상황을 보고 다음 작업자를 골라요(도구 호출).',
        ex: ['모델 수와 상관없어요. 둘 다 같은 모델 하나로도 만들 수 있어요.', '', '어느 모양이든 역할마다 구조화 출력을 쓸 수 있어요.', '감독자는 한 번에 하나를 부를 수도, 여럿을 부를 수도 있어요. 늘 나란히 돌리는 건 "나눠 하고 합치기"의 특징이에요.'] },
      { t: 'q', kind: 'mc', fig: 'qa_stopLoop', q: '출제-검토 반복을 끝내는 조건으로 가장 알맞은 것은?',
        opts: ['검토자가 통과를 줄 때까지 몇 번이든 계속 돌린다', '고치기를 1번만 하고 결과와 상관없이 확정한다', 'temperature를 0으로 두면 한 번에 끝나니 조건이 필요 없다', '통과하면 끝, 고치기 2번을 채워도 못 넘으면 사람 확인으로 넘긴다'], a: 3,
        why: '반복에는 늘 출구 두 개를 둬요. "통과"와 "최대 횟수". 최대 횟수에 닿으면 버리지 말고 사람에게 넘겨요.',
        ex: ['검토자가 끝없이 새 지적을 낼 수 있어요. 호출과 돈이 멈추지 않아요.', '못 넘은 문항을 그대로 확정하면 오류가 학생에게 가요.', 'temperature가 낮아도 검토가 늘 통과를 주지는 않아요.', ''] },
      { t: 'q', kind: 'mc', fig: 'qa_parallel', q: '단원 네 개의 문항을 차례로 만들던 것을 작업자 넷이 나란히 만들게 바꿨어요. 무엇이 줄어들까요?',
        opts: ['기다리는 시간. 호출 수와 토큰은 거의 그대로다', '토큰. 일을 나눠 보내면 토큰이 그만큼 덜 든다', '비용. 한꺼번에 보내면 값이 깎이는 규칙이 있다', '오류. 나란히 돌리면 429가 날 일이 줄어든다'], a: 0,
        why: '나란히 하면 끝나는 시간은 줄지만, 할 일의 양(호출·토큰)은 같아요. 오히려 한꺼번에 보내 <code>429</code>를 만나기 쉬워요.',
        ex: ['', '같은 일을 나눴을 뿐 토큰은 그대로예요. 합치는 단계가 더해지면 오히려 늘어요.', '가격은 토큰 수로 매겨져요. 동시에 보낸다고 깎이지 않아요.', '거꾸로예요. 한꺼번에 보내면 분당 제한에 걸려 429가 나기 쉬워요.'] }
    ]},

    /* =================== L3 =================== */
    { id: 'L3', type: 'lesson', title: 'team.py 출제 팀 만들기', sub: '출제 → 검토 {pass, issues} → 고치기(최대 2번) → 확정', min: 14, steps: [
      { t: 'say', h: '출제 팀 설계: 역할 둘, 반복은 코드가', fig: 'teamPlan', table: { head: ['누가', '하는 일', '모델', '내놓는 것'], rows: [
        ['출제자 <code>write()</code>', '문항 1개 만들기, 지적받으면 고치기', '<code>solar-mini4</code>', '문항 JSON'],
        ['검토자 <code>review()</code>', '오류 찾기만(고치지 않음)', '<code>solar-mini4</code>', '<code>{pass, issues}</code>'],
        ['<code>team.py</code> 코드', '반복·멈춤·기록', '(모델 아님)', '<code>quiz.json</code>, <code>team_log.json</code>'] ] }, p: [
        'c5u1의 <code>agent.py</code> 옆에 <code>team.py</code>를 만들어요. 정보 수업 형성평가 문항을 만들고, 검토 기록(로그)을 남기는 출제 팀이에요.',
        '역할 사이를 오가는 건 <b>문항 JSON 하나</b>예요. 모양이 정해져 있어야 다음 역할이 읽을 수 있으니 둘 다 구조화 출력으로 받아요. 반복을 이끄는 건 감독자 모델이 아니라 <b>내 코드</b>예요(③ 만들기-검토 반복).'
      ]},
      { t: 'say', h: '검토 결과는 pass와 issues로만 받아요', fig: 'passGate', p: [
        'c2u2에서 배운 구조화 출력 그대로예요. <code>response_format</code>에 <code>{"type": "json_schema", "json_schema": {"name": "review", "strict": True, "schema": REVIEW}}</code>를 넣어요. strict라서 모든 속성을 <code>required</code>에, <code>additionalProperties</code>는 <code>False</code>.',
        '"괜찮아 보이긴 한데…" 같은 글 대신 <code>pass</code>(참·거짓)가 오니, 코드가 <b>if 한 줄</b>로 멈출지 고칠지 정해요. <code>issues</code>는 그대로 출제자에게 넘길 고칠 점 목록이에요.'
      ], code: { lang: 'py', src: src(['REVIEW = {', '  "type": "object",', '  "properties": {', '    "pass": {"type": "boolean"},', '    "issues": {"type": "array",', '      "items": {"type": "string"}},', '  },', '  "required": ["pass", "issues"],', '  "additionalProperties": False,', '}']) } },
      { t: 'say', h: '역할 프롬프트에는 "하지 않을 일"도 적어요', fig: 'roleCards', p: [
        '역할을 나눠도 지시가 흐리면 검토자가 슬쩍 문항을 고치거나, 출제자가 "검토 완료"라고 적어요. 할 일과 함께 <b>하지 않을 일</b>을 한 줄씩 적어요.',
        '코딩한입에서 배운 프롬프트 기초(역할·맥락·형식) 그대로예요. 다른 점은 프롬프트가 여러 개라는 것뿐이에요.'
      ], code: { lang: 'md', src: src(['## 출제자(WRITER)', '- 너는 정보 수업 형성평가 출제자야.', '- 객관식 1문항: 보기 4개, 정답 1개.', '- 고칠 점이 오면 그것만 고쳐.', '- 검토·통과 판정은 하지 마.', '', '## 검토자(REVIEWER)', '- 너는 검토자야. 문항을 고치지 마.', '- 정답이 하나인지, 보기 길이, 해설을 봐.', '- 문제가 없으면 pass: true, issues: [].']) } },
      { t: 'say', h: '부르는 함수는 하나, 바꾸는 건 세 칸', fig: 'oneFunc', p: [
        '출제자와 검토자는 <code>call_role()</code> 하나를 같이 써요. 바뀌는 건 <b>모델·시스템 프롬프트·스키마</b> 세 칸뿐이에요. <code>write()</code>는 <code>call_role(WORKER, WRITER, …, Q_FMT)</code>, <code>review()</code>는 <code>call_role(WORKER, REVIEWER, …, R_FMT)</code>를 불러요(c5u1 <code>agent.py</code>의 <code>ask()</code>와 이름이 겹치지 않게 했어요).',
        '출제·검토는 정해진 일이라 <code>reasoning_effort="none"</code>에 낮은 temperature로 일정하게 받아요. 모델 이름은 위쪽 변수(<code>WORKER = "solar-mini4"</code>) 한곳에 모아요.'
      ], code: { lang: 'py', src: src(['def call_role(model, system, user, fmt):', '    msgs = [{"role": "system",', '             "content": system},', '            {"role": "user",', '             "content": user}]', '    r = client.chat.completions.create(', '        model=model, messages=msgs,', '        response_format=fmt,', '        reasoning_effort="none",', '        temperature=0.3)', '    text = r.choices[0].message.content', '    return json.loads(text)']) } },
      { t: 'try', lang: 'py', h: '고치기 반복을 흉내 내 봐요', p: '검토자 답을 미리 정한 딕셔너리 목록으로 두고 반복만 돌려 봐요. 실행한 뒤 세 번째 답의 <code>True</code>를 <code>False</code>로 바꿔 보세요. 고치기 2번 뒤 "사람 확인"으로 멈춰요.',
        src: src(['MAX_FIX = 2', '# 검토자 답(미리 정한 흉내)', 'reviews = [', '    {"pass": False, "issues": ["정답이 둘"]},', '    {"pass": False, "issues": ["해설 틀림"]},', '    {"pass": True, "issues": []},', ']', 'ver, log = 1, []', 'for rnd in range(MAX_FIX + 1):', '    rv = reviews[rnd]', '    log.append((ver, rv["pass"], rv["issues"]))', '    if rv["pass"]:', '        status = "확정"', '        break', '    if rnd == MAX_FIX:', '        status = "사람 확인"', '        break', '    ver += 1  # 지적을 들고 고친 새 판', 'for v, ok, issues in log:', '    print(f"{v}판:", "통과" if ok else issues)', 'print(f"결과: {status}, 고친 횟수 {ver - 1}")']),
        note: '진짜 team.py에서는 <code>reviews[rnd]</code> 자리에 <code>review(item)</code>가, <code>ver += 1</code> 자리에 <code>write(topic, rv["issues"])</code>가 들어가요.' },
      { t: 'q', kind: 'mc', fig: 'q_whyPass', q: '검토자에게 자유롭게 의견을 쓰게 하지 않고 <code>pass</code>와 <code>issues</code> 모양으로만 받는 가장 큰 까닭은?',
        opts: ['구조화 출력은 토큰을 쓰지 않아 공짜라서', '코드가 pass를 보고 멈출지 고칠지 정할 수 있어서', '모양을 정하면 검토자 모델이 더 정확해져서', '학생에게 검토 결과를 그대로 보여 줄 수 있어서'], a: 1,
        why: '반복을 이끄는 건 내 코드예요. "괜찮아 보이긴 한데…" 같은 글은 코드가 판단할 수 없지만, 참·거짓은 if 한 줄로 갈라요. issues는 그대로 출제자에게 넘겨요.',
        ex: ['구조화 출력도 출력 토큰만큼 값을 내요.', '', '모양을 정할 뿐, 찾아내는 힘이 좋아지진 않아요.', '검토 결과는 교사용 기록이에요. 학생 화면과는 따로예요.'] },
      { t: 'q', kind: 'blank', fig: 'q_passType', q: '검토 결과 스키마의 pass 칸이에요. 빈칸에 들어갈 타입은?', lang: 'py', code: '"pass": {"type": [[1]]},\n"issues": {"type": "array",\n  "items": {"type": "string"}},',
        opts: ['"boolean"', '"string"', '"integer"', '"array"'], a: 0,
        why: '통과냐 아니냐 둘 중 하나라 <code>boolean</code>이에요. <code>json.loads</code> 뒤에 파이썬 <code>True</code>·<code>False</code>가 돼서 if에 바로 써요.',
        ex: ['', 'string이면 "통과", "통과인 듯" 같은 글이 와서 코드가 판단하기 어려워요.', '0·1로 써도 되지만 2나 -1 같은 값이 올 틈이 생겨요. 참·거짓은 boolean이 딱 맞아요.', '목록은 issues 쪽이에요. pass는 값 하나예요.'] },
      { t: 'q', kind: 'line', fig: 'q_trueLine', q: '로그를 보면 검토가 <code>"pass": true</code>를 줬는데도 문항이 모두 "사람 확인"으로 끝나요. 틀린 줄을 눌러 보세요.', lang: 'py',
        code: src(['for rnd in range(MAX_FIX + 1):', '    rv = review(item)', '    log.append(rv)', '    if rv["pass"] == "true":', '        item["status"] = "확정"', '        break', '    if rnd == MAX_FIX:', '        item["status"] = "사람 확인"', '        break', '    item = write(topic, rv["issues"])']), a: 3,
        why: '<code>json.loads</code>로 읽으면 JSON의 <code>true</code>는 파이썬 <code>True</code>(불리언)가 돼요. 글자 <code>"true"</code>와 비교하면 늘 거짓이라 통과를 못 알아봐요. <code>if rv["pass"]:</code>로 써요.' },
      { t: 'q', kind: 'mc', mono: true, fig: 'q_loopOut', q: '검토가 세 번 모두 통과를 주지 않으면 무엇이 찍힐까요?', lang: 'py',
        code: src(['MAX_FIX = 2', 'reviews = [False, False, False, True]', 'fixes = 0', 'for rnd in range(MAX_FIX + 1):', '    if reviews[rnd]:', '        print("확정")', '        break', '    if rnd == MAX_FIX:', '        print("사람 확인")', '        break', '    fixes += 1', 'print("고친 횟수", fixes)']),
        opts: ['확정\n고친 횟수 3', '사람 확인\n고친 횟수 3', '사람 확인\n고친 횟수 2', '고친 횟수 2'], a: 2,
        why: '<code>range(3)</code>이라 rnd는 0, 1, 2예요. 0과 1에서 고치고(2번), 2에서 최대 횟수에 닿아 "사람 확인"을 찍고 멈춰요. 네 번째 True까지는 가지 않아요.',
        ex: ['네 번째 True까지 가지 않아요. 반복은 rnd 0, 1, 2 세 번뿐이에요.', '마지막 차례(rnd 2)에서는 고치지 않고 멈춰요. 고친 횟수는 2예요.', '', 'break 앞에서 "사람 확인"을 먼저 찍어요.'] },
      { t: 'sum', pts: ['team.py: 출제자 write()와 검토자 review()는 solar-mini4, 반복·멈춤·기록은 코드가 맡는다.', '검토는 {pass, issues} 구조화 출력(strict: required 전부, additionalProperties False). pass는 boolean.', '역할 프롬프트에 하지 않을 일까지 적고, 고치기는 최대 2번. 그래도 못 넘으면 사람 확인.'] }
    ]},

    /* =================== L4 =================== */
    { id: 'L4', type: 'lesson', title: '감독자 에이전트와 모델 나눠 쓰기', sub: '작업자를 도구처럼, 상태 JSON, 로그, 비용 줄이기', min: 14, steps: [
      { t: 'say', h: '작업자를 도구로 주면 감독자가 돼요', fig: 'supTools', p: [
        '감독자-작업자(②)는 c5u1의 도구 호출로 만들어요. 감독자(<code>solar-pro4</code>)에게 <code>tools</code>로 <code>ask_writer</code>, <code>ask_reviewer</code>를 주면, 감독자가 상태를 보고 다음에 부를 작업자를 골라요.',
        '도구 설명이 고르는 기준이에요(c5u1). <code>ask_reviewer</code>에는 "지금 판의 오류를 찾아요"처럼 무엇을 하는지 분명히 적어요. 끝낼 때 부르는 <code>finish</code> 도구를 하나 더 주는 것도 방법이에요.'
      ], code: { lang: 'py', src: src(['W_DESC = "문항을 만들거나 고쳐요"', 'TOOLS = [', '  {"type": "function", "function": {', '    "name": "ask_writer",', '    "description": W_DESC,', '    "parameters": {"type": "object",', '      "properties": {"note": {', '        "type": "string"}},', '      "required": ["note"]}}},', '  # ask_reviewer도 같은 모양', ']']) } },
      { t: 'say', h: '상태 JSON 하나를 모두가 봐요', fig: 'stateBoard', p: [
        'API는 대화를 기억하지 않아요(c1u2). 역할 사이에 오가는 것은 <b>상태</b>(state) 딕셔너리 하나에 모아 두고, 내 코드가 들고 다녀요.',
        '작업자에게는 대화 전체가 아니라 <b>필요한 부분만</b> 잘라 넘겨요. 검토자에게는 규칙과 지금 판(<code>draft</code>)만. 입력이 짧아 싸고, 다른 역할의 말이 섞이지 않아요.',
        '감독자에게는 상태를 짧게 요약해 보내요. 몇 번이 확정이고 몇 번이 사람 확인인지가 다음 행동을 고르는 근거예요.'
      ], code: { lang: 'json', src: src(['{', '  "topic": "반복문",', '  "rules": "보기 4개, 정답 1개",', '  "draft": {"no": 4, "ver": 2,', '            "fixes": 1},', '  "done": [1, 3],', '  "human": [2]', '}']) } },
      { t: 'say', h: '도구 실행 = 작업자 에이전트 부르기', p: [
        '감독자가 <code>tool_calls</code>로 작업자를 고르면, 실행은 늘 <b>내 코드</b>가 해요. 그 실행 안에서 작업자 에이전트(Solar 호출)가 한 번 더 일어나요.',
        'c5u1 <code>agent.py</code>의 <code>ask()</code>·<code>tool_msg()</code>·<code>run_tool()</code>·<code>MAX_TURNS</code>는 그대로 써요. <code>TOOL_FUNCS</code>에 작업자 함수만 바꿔 끼우면 돼요. <code>write()</code>와 <code>review()</code>는 상태에서 자기에게 필요한 칸만 꺼내 넘겨요.',
        'c5u1의 규칙도 그대로예요. assistant 메시지를 먼저 붙이고, 호출마다 <code>tool</code> 결과를 하나씩, <code>content</code>가 <code>None</code>이면 <code>""</code>, 그리고 최대 턴.'
      ], code: { lang: 'py', src: src(['def ask_writer(note):', '    STATE["draft"] = write(STATE, note)', '    return json.dumps(STATE["draft"],', '        ensure_ascii=False)', '', 'def ask_reviewer(note):', '    rv = review(STATE)', '    return json.dumps(rv,', '        ensure_ascii=False)', '', 'TOOL_FUNCS = {"ask_writer": ask_writer,', '    "ask_reviewer": ask_reviewer}']) } },
      { t: 'say', h: '로그: 누가, 어떤 모델로, 몇 토큰', fig: 'logBook', p: [
        '호출마다 역할·모델·입력·출력 토큰을 한 줄씩 쌓아요. 응답의 <code>usage.prompt_tokens</code>·<code>completion_tokens</code>를 그대로 적으면 돼요.',
        '로그가 있어야 끝없는 반복, 역할 섞임을 찾고 비용을 계산해요(레슨 5). API 키나 학생 이름 같은 건 로그에 남기지 않아요(c3u3).'
      ], code: { lang: 'py', src: src(['def log_call(role, model, r, **more):', '    u = r.usage', '    LOG.append(dict(', '        role=role, model=model,', '        tokens_in=u.prompt_tokens,', '        tokens_out=u.completion_tokens,', '        **more))', '', 'with open("team_log.json", "w",', '          encoding="utf-8") as f:', '    json.dump(LOG, f, indent=2,', '              ensure_ascii=False)']) } },
      { t: 'say', h: '모델을 나눠 쓰면 비용이 줄어요', fig: 'costSplit', table: { head: ['구성', '작업자', '감독자', '합계'], rows: [
        ['모두 <code>solar-pro4</code>', '약 $0.031', '약 $0.029', '약 $0.06'],
        ['작업자만 <code>solar-mini4</code>', '약 $0.010', '약 $0.029', '약 $0.04'],
        ['감독자 없이 코드가 순서(레슨 3)', '약 $0.010', '없음', '약 $0.01'] ] }, p: [
        '형성평가 10문제 어림이에요. 작업자 호출 40번(입력 1,000·출력 400씩), 감독자 호출 40번(입력 2,000·출력 100씩)을 지금 가격(100만 토큰당 <code>solar-pro4</code> 입력 $0.30·출력 $1.20, <code>solar-mini4</code> 입력 $0.10·출력 $0.40)으로 계산했어요.',
        '판단이 어려운 감독자는 대표 모델, 짧고 정해진 작업자 일은 가벼운 모델에 맡기면 같은 일이 싸져요. 감독자는 대화가 길어져 입력 몫이 커서, <b>순서가 늘 같다면 감독자를 빼는 게</b> 가장 큰 절약이에요.'
      ], tip: '모델을 바꾼 뒤에는 문항 품질을 꼭 견줘요. 싸졌는데 "사람 확인"이 늘면 아낀 게 아니에요. 가격은 2026년 10월 기준이라 바뀔 수 있어요.' },
      { t: 'sim', h: 'team.py를 돌리고 로그를 읽어요', p: 'IDE 창 아래 터미널에서 team.py를 2문항으로 짧게 시험하고, 남은 로그와 비용을 확인해요.',
        scene: { win: 'ide', folder: 'upstage-lab', files: LAB_FILES, open: 'team.py', lang: 'py', code: TEAM_TOP, term: ['$ git status', 'nothing to commit, working tree clean'] },
        steps: [
          { goal: '터미널에 team.py 실행 명령을 쳐요', type: RUN_CMD, into: 'term', then: { term: RUN_OUT, prompt: '', files: LAB_FILES2 },
            say: '감독자가 고른 일이 한 줄씩 찍혀요. 1번은 한 번 고쳐 통과, 2번은 같은 지적이 되풀이돼 고치기 2번 뒤 사람 확인으로 갔어요.' },
          { goal: 'team_log.json을 열어요', click: 'file:team_log.json', then: { open: 'team_log.json', lang: 'json', code: LOG_JSON },
            say: '호출마다 역할·모델·토큰이 한 줄씩 쌓였어요. 감독은 <code>solar-pro4</code>, 출제·검토는 <code>solar-mini4</code>예요.' },
          { goal: '비용 계산을 돌려요', type: 'python cost.py', into: 'term', then: { term: RUN_OUT.concat(COST_OUT), prompt: '' },
            say: '작업자를 가벼운 모델로 나눠 쓴 덕에 모두 <code>solar-pro4</code>일 때보다 싸요. 그래도 감독자 몫이 꽤 커요.' },
          { goal: 'quiz.json에서 사람 확인 문항을 찾아요', click: 'file:quiz.json', then: { open: 'quiz.json', lang: 'json', code: QUIZ_JSON },
            say: '"사람 확인" 문항은 버리지 않아요. 남은 지적을 보고 교사가 직접 고쳐 확정해요.' } ],
        end: '로그가 있으면 반복·비용·역할 섞임을 숫자로 찾을 수 있어요.' },
      { t: 'q', kind: 'mc', fig: 'q_whoRuns', q: '감독자가 <code>tool_calls</code>로 <code>ask_reviewer</code>를 골랐어요. 실제로 검토자 에이전트를 부르는 것은?',
        opts: ['내 코드가 run_tool로 ask_reviewer()를 실행한다', '감독자 모델이 업스테이지 서버 안에서 검토자를 직접 부른다', 'tool_choice를 "required"로 두면 검토자가 저절로 실행된다', '검토자 모델이 감독자 대화를 지켜보다가 알아서 시작한다'], a: 0,
        why: '모델은 "이 도구를 이 인자로 불러 줘"라고 돌려줄 뿐, 실행은 늘 내 코드가 해요(c5u1). <code>ask_reviewer()</code> 안의 <code>review()</code>가 검토자 에이전트(Solar)를 한 번 더 불러요.',
        ex: ['', '모델은 함수를 실행하지 않아요. tool_calls로 부탁만 해요.', 'required는 "도구를 꼭 하나 고르라"는 뜻이에요. 실행은 여전히 내 코드 몫이에요.', '호출끼리는 서로를 보지 못해요. 내 코드가 불러야 시작해요.'] },
      { t: 'q', kind: 'order', fig: 'q_supTurn', q: '감독자 한 턴이 도는 순서대로 쌓아 보세요.',
        items: ['상태 요약과 함께 감독자(solar-pro4)에게 요청을 보낸다', '감독자가 ask_reviewer 호출을 고른다', '내 코드가 ask_reviewer()로 검토자(solar-mini4)를 부른다', '결과를 tool 메시지로 붙이고 로그를 남긴 뒤 감독자에게 다시 보낸다'],
        why: 'c5u1의 도구 호출 루프 그대로예요. 다른 점은 도구 안에서 작업자 에이전트가 한 번 더 불린다는 것뿐이에요.' },
      { t: 'q', kind: 'mc', fig: 'q_supCost', q: '감독자 호출을 모두 더하니 입력 120,000 · 출력 5,000 토큰이에요. <code>solar-pro4</code> 지금 가격으로 감독자 비용은 대략 얼마일까요?',
        opts: ['약 $4.2', '약 $0.42', '약 $0.042', '약 $0.0042'], a: 2,
        why: '입력 120,000 × $0.30 ÷ 100만 = $0.036, 출력 5,000 × $1.20 ÷ 100만 = $0.006, 합쳐 약 $0.042예요. 감독자는 대화가 길어질수록 입력이 쌓여 입력 몫이 커요.',
        ex: ['100배 커요. 100만 토큰당 가격이라는 걸 놓쳤어요.', '10배 커요. 자릿수를 한 번 더 확인해요.', '', '10배 작아요. 입력 몫($0.036)만 해도 이보다 커요.'] },
      { t: 'q', kind: 'mc', fig: 'q_fullHist', q: '작업자에게 감독자의 대화 기록을 통째로 넘겼더니 비용이 크게 늘고, 검토자가 출제자처럼 문항을 다시 쓰기 시작했어요. 가장 알맞은 고침은?',
        opts: ['max_tokens를 크게 늘려 답이 잘리지 않게 한다', '모든 역할을 시스템 프롬프트 하나에 합친다', 'temperature를 높여 검토자가 다르게 말하게 한다', '상태 JSON에서 그 역할에 필요한 부분만 골라 넘긴다'], a: 3,
        why: '작업자는 맡은 일에 필요한 것만 받으면 돼요. 입력이 짧아 싸고, 다른 역할의 말이 섞이지 않아 역할이 흐려지지 않아요.',
        ex: ['잘리는 게 문제가 아니에요. 넘긴 게 너무 많고 섞였어요.', '역할을 합치면 나눈 뜻이 사라져요.', '무작위성을 올리면 역할이 더 흔들려요.', ''] },
      { t: 'sum', pts: ['감독자(solar-pro4)에게 작업자를 tools(ask_writer, ask_reviewer)로 준다. 실행은 내 코드, 그 안에서 작업자 호출.', '상태 JSON 하나를 코드가 들고 다니며 역할마다 필요한 부분만 넘긴다. 호출마다 역할·모델·토큰을 로그로.', '작업자는 solar-mini4로 나눠 쓰면 싸진다. 순서가 늘 같으면 감독자를 빼는 게 가장 큰 절약.'] }
    ]},

    /* =================== QB =================== */
    { id: 'QB', type: 'quiz', title: '헷갈림 퀴즈 ②', sub: '상태 공유, 모델 나눠 쓰기, 상태와 로그', min: 4, steps: [
      { t: 'q', kind: 'mc', fig: 'qb_memory', q: '출제자에게 "보기는 4개, 해설은 한 줄"이라는 조건을 보냈어요. 검토자를 부를 때도 이 조건이 함께 갈까요?',
        opts: ['간다. 같은 API 키를 쓰니 호출끼리 대화가 이어진다', '간다. 같은 모델이면 앞 호출의 내용이 남아 있다', '안 간다. 코드가 상태에서 조건을 꺼내 넣어야 한다', '안 간다. 그러니 조건 없이 보는 쪽이 더 공정하다'], a: 2,
        why: 'API는 대화를 기억하지 않아요(c1u2). 역할 사이에 함께 쓸 것(주제, 문항 조건, 지금 판)은 상태 JSON에 두고, 코드가 각 역할에게 필요한 만큼 넣어 보내요.',
        ex: ['키는 누가 쓰는지 확인할 뿐, 호출끼리 대화를 이어 주지 않아요.', '같은 모델이어도 호출마다 따로예요. 그 호출에 보낸 메시지만 봐요.', '', '기준이 없으면 검토할 수 없어요. 조건은 넘기되, 출제자의 설명까지 넘길 필요는 없어요.'] },
      { t: 'q', kind: 'mc', fig: 'qb_miniSup', q: '비용을 더 줄이려고 감독자까지 <code>solar-mini4</code>로 바꿨더니, 같은 작업자를 되풀이해 부르고 턴이 길어졌어요. 가장 알맞은 조치는?',
        opts: ['감독자는 solar-pro4로 되돌리고 작업자는 그대로 둔다', '감독자의 max_tokens를 줄여 턴을 빨리 끝내게 한다', '작업자도 모두 solar-pro4로 올려 모델을 맞춘다', '최대 턴 수를 없애 감독자가 끝까지 고르게 둔다'], a: 0,
        why: '다음 행동을 고르는 감독자는 판단이 어려운 자리라 대표 모델(<code>solar-pro4</code>)에, 짧고 정해진 일(출제 초안·검토)은 가벼운 모델(<code>solar-mini4</code>)에 맡겨요. 바꾼 뒤엔 로그로 결과와 비용을 함께 봐요.',
        ex: ['', 'max_tokens가 너무 작으면 답이 비거나 잘려요(finish_reason "length"). 고르는 일은 나아지지 않아요.', '비용만 늘어요. 문제는 작업자가 아니라 감독자의 고르기예요.', '최대 턴이 없으면 되풀이가 끝없이 이어져요. 오히려 더 위험해요.'] },
      { t: 'q', kind: 'mc', fig: 'qb_stateLog', q: '상태(state)와 로그(log)를 바르게 나눈 것은?',
        opts: ['상태는 일어난 일을 차례로 쌓고, 로그는 지금 모습만 고쳐 쓴다', '상태는 지금 모습을 고쳐 쓰고, 로그는 일어난 일을 차례로 쌓는다', '둘은 같은 것이라 하나만 두면 된다', '로그에는 문제가 생길 때를 대비해 API 키도 함께 남긴다'], a: 1,
        why: '상태는 "지금 어디까지"(문항별 판·상태)예요. 로그는 "무슨 일이 있었나"(호출마다 역할·모델·토큰·판정)예요. 로그로 반복·비용·역할 섞임을 찾아요.',
        ex: ['거꾸로예요. 지금 모습은 상태, 지난 일은 로그예요.', '', '하는 일이 달라요. 상태만 있으면 지난 일을 못 보고, 로그만 있으면 지금 모습을 매번 다시 계산해야 해요.', '키는 로그·화면·채팅 어디에도 남기지 않아요. 학생 이름 같은 개인정보도요.'] }
    ]},

    /* =================== L5 =================== */
    { id: 'L5', type: 'lesson', title: '평가와 비용, 그리고 사람 확인', sub: '토큰 어림, 실패 모양, 사람 확인, Cursor 서브에이전트와 잇기', min: 13, steps: [
      { t: 'say', h: '형성평가 10문제, 토큰과 돈을 어림해요', fig: 'costCalc', table: { head: ['방식', '호출', '입력 · 출력 토큰', '지금 가격으로'], rows: [
        ['에이전트 하나(<code>solar-pro4</code>)', '1번', '1,500 · 3,000', '약 $0.004(6원쯤)'],
        ['출제 팀(<code>solar-mini4</code>)', '40번', '40,000 · 16,000', '약 $0.010(15원쯤)'],
        ['출제 팀(모두 <code>solar-pro4</code>)', '40번', '40,000 · 16,000', '약 $0.031(44원쯤)'] ] }, p: [
        '어림은 곱셈 세 번이에요. 문항 하나에 출제 1번 + 검토 2번 + 고치기 1번 = <b>호출 4번</b>, 한 번에 입력 1,000 · 출력 400 토큰이라고 잡으면, 10문제는 호출 40번에 입력 40,000 · 출력 16,000 토큰이에요.',
        '금액은 작아도 <b>배수</b>는 그대로 쌓여요. 반 학생이 저마다 돌리거나 매주 돌리면 차이가 커지고, 호출이 차례로 이어져 기다리는 시간도 길어요.'
      ], tip: '추론을 켜면(<code>reasoning_effort</code>) 추론 토큰도 출력에 들어가 출력이 몇 배로 늘 수 있어요. 원화는 1달러 ≈ 1,400원으로 어림했어요(환율·가격은 바뀌어요).' },
      { t: 'say', h: '실패에는 모양이 있어요', fig: 'failThree', table: { head: ['실패 모양', '로그에서 보이는 것', '막는 법'], rows: [
        ['<b>끝없는 반복</b>', '같은 문항에서 고치기·검토가 이어지고 지적이 맴돌아요', '최대 횟수(고치기 2번), 같은 지적이 되풀이되면 사람에게'],
        ['<b>서로 맞장구</b>', '검토가 거의 늘 1판에서 통과, issues가 비어 있어요', '출제자 설명은 빼고 문항만, 볼 기준은 목록으로. 일부러 틀린 문항으로 시험'],
        ['<b>역할 섞임</b>', '검토자가 문항을 고쳐 보내거나, 출제자가 스스로 통과라고 적어요', '시스템 프롬프트에 하지 않을 일까지, 출력 스키마로 역할 묶기'] ] }, p: [
        '로그를 읽으면 실패에는 모양이 있어요. 이 셋만 알아 둬도 대부분 찾을 수 있어요.',
        '검토자를 믿을 수 있는지는 <b>정답을 아는 시험 문항</b>으로 확인해요. 정답이 둘인 문항을 일부러 섞어 넣고 잡아내는지 봐요. c3u1에서 질문 세트로 챗봇을 평가한 것과 같은 생각이에요.'
      ]},
      { t: 'say', h: '마지막 확인은 사람이 해요', fig: 'humanGate', p: [
        '검토 에이전트의 <code>pass</code>는 모델이 예측한 글일 뿐, 정답이 맞다는 보증이 아니에요(c1u2 환각). 출제자와 검토자가 같은 모델이면 같은 곳에서 함께 틀릴 수도 있어요.',
        '그래서 <b>확정은 교사</b>가 해요. "사람 확인"으로 넘어온 문항은 물론, 통과한 문항도 학생에게 내기 전에 정답·해설이 수업 내용과 맞는지 읽어요.',
        '수업에서는 만든 문항을 "초안"이라 부르고, 교사가 확정한 것만 학생 화면에 올려요. 문항·로그에 학생 이름이나 성적 같은 개인정보는 넣지 않아요.'
      ]},
      { t: 'say', h: 'Cursor 서브에이전트와 같은 생각이에요', fig: 'cursorLink', table: { head: ['커서한입(Cursor)', 'team.py'], rows: [
        ['부모 에이전트', '감독자(또는 반복을 이끄는 코드)'],
        ['서브에이전트: 자기 컨텍스트 창에서 깨끗하게 시작', '작업자: 상태에서 필요한 부분만 받아 시작'],
        ['결과는 요약만 부모에게', '결과는 JSON만 감독자에게'],
        ['다섯이 나란히 돌면 토큰도 대략 다섯 배', '역할·호출이 늘면 토큰도 그만큼'],
        ['같은 파일을 동시에 고치면 서로 덮어씀', '같은 문항을 동시에 고치면 판이 엉킴'] ] }, p: [
        '커서한입 과정 3 단원 4에서 Cursor 에이전트가 일의 한 조각을 <b>서브에이전트</b>에게 떼어 맡기는 걸 봤죠. 서브에이전트는 부모 대화를 보지 못하고, 맡은 일만 한 뒤 요약을 돌려줘요.',
        'team.py도 같은 설계예요. 그때 배운 감각("길고 나눌 수 있는 일에만", "서로 다른 곳을 맡기기")이 여기서도 그대로 통해요.'
      ]},
      { t: 'sim', h: 'Agents Window에서 출제·검토 에이전트를 나란히 돌려요', p: '출제 에이전트에게 다음 주제를 맡겨 두고, 새 에이전트를 열어 Ask 모드로 앞 문항을 검토만 하게 해 봐요.',
        scene: { win: 'agents', folder: 'upstage-lab', agents: [{ title: A_W, on: true, status: 'done' }], panel: panel(W_MSGS), changes: [{ file: 'quiz/loop.md', add: 41, del: 0 }] },
        steps: [
          { goal: '출제 담당에게 다음 주제를 적어요', type: NEXT_Q, into: 'chat',
            say: '반복문을 끝낸 출제 담당에게 조건문을 이어서 맡겨요. 다른 파일(<code>quiz/if.md</code>)이라 부딪칠 일이 없어요.' },
          { goal: '보내요', click: 'btn:send', then: { agents: [{ title: A_W, on: true, status: 'run' }], panel: panel(W_MSGS.concat([{ me: NEXT_Q }, { ai: NEXT_RUN }])) },
            say: '출제 담당이 일하는 동안 기다리지 않고 검토를 따로 시작해요.' },
          { goal: 'New Agent로 검토 담당을 열어요', click: 'btn:new-agent', then: { agents: [{ title: A_W, status: 'run' }, { title: 'New Agent', on: true }], panel: EMPTY_PANEL, changes: null },
            say: '새 에이전트는 출제 대화를 보지 못해요. 출제자의 설명에 끌려가지 않는 <b>깨끗한 눈</b>이에요.' },
          { goal: '모드 칸을 눌러요', click: 'btn:mode', then: { menu: MODE_MENU },
            say: '모드 메뉴가 열렸어요.' },
          { goal: 'Ask를 골라요', click: 'menu:Ask', then: { menu: null, panel: panel([], 'Ask') },
            say: '검토 담당은 고치지 않고 찾기만 해요. Ask 모드는 파일을 바꾸지 않아요.' },
          { goal: '검토 부탁을 적어요', type: REVIEW_Q, into: 'chat',
            say: '볼 기준을 목록으로 주고, "고치지 마"를 분명히 적었어요.' },
          { goal: '보내요', click: 'btn:send', then: { agents: [{ title: A_W, status: 'run' }, { title: A_R, on: true, status: 'done' }], panel: panel([{ me: REVIEW_Q }, { ai: REVIEW_A }], 'Ask') },
            say: '두 에이전트가 나란히 일했어요. 검토 담당은 문항 번호별 고칠 점만 돌려줬어요.' },
          { goal: '출제 담당으로 돌아가요', click: 'agent:' + A_W, then: { agents: [{ title: A_W, on: true, status: 'done' }, { title: A_R, status: 'done' }], panel: panel(W_MSGS.concat([{ me: NEXT_Q }, { ai: NEXT_A }])), changes: [{ file: 'quiz/loop.md', add: 41, del: 0 }, { file: 'quiz/if.md', add: 40, del: 0 }] },
            say: '출제 담당도 끝났어요. 이제 검토 결과를 붙여 2번·4번만 고쳐 달라고 하면 만들기-검토 반복이 한 바퀴 돌아요.' } ],
        end: '대화를 나누면 맥락이 섞이지 않아요. Cursor에서도 team.py에서도 같은 원리예요.' },
      { t: 'q', kind: 'mc', fig: 'q_quizCost', q: '문항 20개를 팀으로 만들어요. 문항마다 호출 5번, 한 번에 입력 800 · 출력 200 토큰, 모두 <code>solar-mini4</code>예요. 지금 가격으로 대략 얼마일까요?',
        opts: ['약 $0.0016', '약 $0.016', '약 $0.16', '약 $1.6'], a: 1,
        why: '호출 20 × 5 = 100번이에요. 입력 80,000 × $0.10 ÷ 100만 = $0.008, 출력 20,000 × $0.40 ÷ 100만 = $0.008, 합쳐 약 $0.016(20원쯤)이에요.',
        ex: ['10배 작게 셌어요. 호출이 20 × 5 = 100번이에요.', '', '10배 크게 셌어요. 100만 토큰당 가격이에요.', '100배 크게 셌어요. 자릿수를 다시 세 봐요.'] },
      { t: 'q', kind: 'mc', fig: 'q_yesMan', q: '검토 로그를 보니 검토자가 문항마다 "출제자의 설명대로 정답이 맞아요"라며 늘 1판에서 통과를 줘요. 어떤 실패 모양이고, 무엇부터 고칠까요?',
        opts: ['끝없는 반복. 최대 고치기 횟수를 줄인다', '역할 섞임. 검토자에게 문항을 직접 고치게 한다', '서로 맞장구. 출제자의 설명은 빼고 문항만, 볼 기준과 함께 넘긴다', '비용 폭주. 검토자 모델을 더 큰 것으로 바꾼다'], a: 2,
        why: '검토자가 출제자의 설명에 끌려가 늘 통과를 주는 맞장구예요. 설명은 빼고, 무엇을 볼지 기준을 주고, 일부러 틀린 문항으로 잡아내는지 시험해요.',
        ex: ['반복이 길어진 게 아니라 늘 1판에서 통과해요.', '그건 고침이 아니라 역할 섞임이라는 다른 실패를 만드는 일이에요.', '', '큰 모델도 출제자 설명을 그대로 받으면 끌려갈 수 있어요. 넘기는 입력부터 고쳐요.'] },
      { t: 'q', kind: 'line', fig: 'q_mixLine', q: '검토자 시스템 프롬프트예요. 역할이 섞이게 만드는 줄을 눌러 보세요.', lang: 'md',
        code: src(['너는 정보 수업 형성평가 검토자야.', '정답이 하나인지 확인해.', '보기 길이가 비슷한지 확인해.', '틀린 곳은 문항을 직접 고쳐서 돌려줘.', '결과는 pass와 issues로만 답해.']), a: 3,
        why: '검토자가 직접 고치면 출제자의 일과 섞여요. 누가 어느 판을 만들었는지 로그가 엉키고, 자기가 고친 걸 다시 통과시키기도 쉬워요. 검토자는 찾기만, 고치기는 출제자예요.' },
      { t: 'q', kind: 'mc', fig: 'q_sameIssue', q: '어떤 문항은 1판·2판·3판 검토에서 모두 "보기 ③이 모호해요"라는 같은 지적이 나와 "사람 확인"으로 넘어갔어요. 가장 알맞은 판단은?',
        opts: ['사람이 볼 문항이다. 지적이 구체적인지도 살핀다', '최대 고치기를 10번으로 늘려 통과할 때까지 돌린다', '검토자를 빼고 출제자 혼자 확정하게 바꾼다', '사람 확인 문항은 지우고 통과한 것만 학생에게 낸다'], a: 0,
        why: '같은 지적을 맴도는 건 끝없는 반복의 첫 모양이에요. 횟수 제한이 제 일을 한 거예요. "모호해요"처럼 흐린 지적이면 출제자가 무엇을 고칠지 몰라요. 검토 기준에 "어떻게 고칠지 한 줄"을 더하는 것도 방법이에요.',
        ex: ['', '같은 지적을 맴도는데 횟수만 늘리면 돈과 시간만 나가요.', '검토를 빼면 오류를 잡을 눈이 사라져요.', '버릴 일이 아니에요. 사람이 고치면 좋은 문항이 될 수 있어요.'] },
      { t: 'sum', pts: ['어림: 문항 수 × 문항당 호출 × (입력·출력 토큰 × 값). 10문제 팀은 몇 센트지만, 하나일 때의 몇 배가 그대로 쌓인다.', '실패 모양: 끝없는 반복(최대 횟수), 서로 맞장구(기준·깨끗한 입력·일부러 틀린 문항), 역할 섞임(하지 않을 일·스키마).', 'pass는 보증이 아니다. 확정은 교사. Cursor 서브에이전트처럼 작업자는 필요한 것만 받고 결과만 돌려준다.'] }
    ]},

    /* =================== M1 =================== */
    { id: 'M1', type: 'mission', title: 'team.py로 형성평가 출제 팀 돌리기', sub: '내 Cursor와 upstage-lab에서 직접', min: 40,
      where: 'upstage-lab 폴더 + 업스테이지 콘솔(Billing의 Usage)',
      intro: '이번 단원에서 배운 출제-검토 팀을 진짜로 만들어 돌려 봐요. 형성평가 10문제와 검토 로그를 만들고, 비용을 계산하고, 에이전트 하나로 만든 결과와 견줘요. 끝낸 것부터 체크하고 한 줄 메모를 남겨요.',
      tasks: [
        { do: '시작 전에 커밋하고 키가 안전한지 확인해요',
          how: 'upstage-lab에서 <code>git status</code>를 보고 <code>.env</code>가 목록에 없는지(.gitignore에 들어 있는지) 확인해요. 그다음 <code>git add -A</code>, <code>git commit -m "c5u2 시작 전"</code>.',
          check: '<code>git log --oneline</code> 맨 위에 방금 커밋이 보이고, <code>git ls-files</code>에 <code>.env</code>가 없으면 성공.' },
        { do: 'Cursor 에이전트에게 team.py를 맡겨요(Plan 먼저)',
          how: 'Agents Window에서 upstage-lab을 열고 모드를 <b>Plan</b>으로 바꿔 아래 부탁을 보내요. 계획에 역할 둘, 최대 2번 고치기, 로그 파일이 다 있는지 읽고 <b>Build</b>를 눌러요. 처음엔 <code>--n 2</code>로 짧게 시험해요.',
          check: '<code>python team.py --topic 반복문 --n 2</code>가 오류 없이 끝나고, <code>quiz.json</code>에 2문항, <code>team_log.json</code>에 호출 기록이 생기면 성공.',
          prompt: 'upstage-lab에 team.py를 만들어 줘. 정보 수업 형성평가 객관식 문항을 만드는 출제-검토 팀이야.\n\n맥락\n- agent.py처럼 OpenAI SDK, base_url="https://api.upstage.ai/v1", 키는 .env의 UPSTAGE_API_KEY. AGENTS.md 규칙을 따라.\n- 모델 이름은 위쪽 변수 한곳에: WORKER = "solar-mini4".\n\n할 일\n- 출제자 write(topic, issues): 문항 1개를 {q, choices(4개), answer, explain} 구조화 출력(strict)으로.\n- 검토자 review(item): 문항을 고치지 말고 {pass, issues}만 구조화 출력으로.\n- 문항마다 검토 → 통과 못 하면 issues를 넘겨 고치기. 고치기는 최대 2번, 그래도 못 넘으면 status를 "사람 확인"으로.\n- 호출마다 역할·모델·prompt_tokens·completion_tokens·pass를 team_log.json에 쌓고, 문항은 quiz.json에.\n\n조건\n- reasoning_effort="none"과 temperature를 직접 적어. 키를 print하지 마. 학생 이름 같은 개인정보는 넣지 마.\n- --topic과 --n(기본 2) 옵션.\n\n확인\n- python team.py --topic 반복문 --n 2를 실행해 quiz.json과 team_log.json 앞부분을 보여 줘.' },
        { do: '형성평가 10문제와 검토 로그를 만들어요',
          how: '<code>python team.py --topic 반복문 --n 10</code>. 끝나면 <code>team_log.json</code>에서 문항마다 몇 판 만에 통과했는지 봐요. 반복이 멈추지 않는 것 같으면 <kbd>ctrl+c</kbd>로 멈추고 최대 횟수 코드부터 확인해요.',
          check: '<code>quiz.json</code>에 10문항이 있고, "확정"과 "사람 확인"이 각각 몇 개인지 메모에 적었으면 성공.' },
        { do: '로그로 비용을 계산해요',
          how: '아래 부탁으로 <code>cost.py</code>를 만들어 돌려요. 가격은 2026년 10월 기준이라 바뀔 수 있어요. 콘솔 <b>Billing</b>의 <b>Usage</b>(사용량)에서 실제 사용량과도 견줘 봐요. 반영되는 때와 화면 모양은 직접 확인해요.',
          check: '호출 수, 입력·출력 토큰 합계, 달러 금액이 나오고, 메모에 "10문제에 대략 ○센트"를 적었으면 성공.',
          prompt: 'team_log.json을 읽어 모델별로 호출 수, prompt_tokens, completion_tokens 합계를 내고 비용을 계산하는 cost.py를 만들어 줘.\n- 가격은 100만 토큰당 solar-pro4 입력 0.30달러·출력 1.20달러, solar-mini4 입력 0.10달러·출력 0.40달러(2026년 10월 기준). 위쪽 딕셔너리 한곳에 둬.\n- 결과는 표처럼 출력하고, 같은 토큰을 모두 solar-pro4로 썼다면 얼마였을지도 한 줄 보여 줘.\n- 확인: python cost.py 결과를 보여 줘.' },
        { do: '에이전트 하나로 만든 결과와 견줘요',
          how: '같은 주제 10문제를 <code>solar-pro4</code> 한 번 호출로 만드는 <code>single.py</code>를 에이전트에게 부탁해 돌려요(같은 문항 스키마, <code>reasoning_effort</code> 직접 적기). 두 결과의 문항을 내가 직접 풀어 보며 정답이 둘인 문항·해설 오류·어색한 보기를 세요.',
          check: '메모에 두 줄 표(방식 · 호출 수 · 비용 · 걸린 시간 · 내가 찾은 오류 수)를 채우고, "이 일에는 ○○로 충분하다/팀이 낫다"를 한 문장으로 적었으면 성공.' },
        { do: '사람 확인을 마치고 커밋해요',
          how: '"사람 확인" 문항을 직접 고쳐 확정하고, 통과 문항도 학생에게 내기 전에 정답·해설이 수업 내용과 맞는지 읽어요. <code>git status</code>로 <code>.env</code>가 없는지 보고 커밋해요.',
          check: '<code>quiz.json</code>에 "사람 확인"이 하나도 남지 않고, 커밋에 <code>.env</code>가 없으면 성공.' }
      ],
      note: '예상 비용(지금 가격으로 어림, 바뀔 수 있어요): team.py로 10문제 한 번이 문항당 호출 4~6번이면 <code>solar-mini4</code>로 약 1~2센트, 에이전트 하나(<code>solar-pro4</code> 한 번)는 1센트 미만이에요. 반 학생이 한 키로 동시에 돌리면 429가 날 수 있으니, 수업에서는 교사가 미리 만들어 확정해 두는 쪽이 안전해요. 문항·로그에 학생 이름·성적 같은 개인정보를 넣지 않아요.' },

    /* =================== T1 =================== */
    { id: 'T1', type: 'test', title: '단원 형성평가', sub: '10문제 · 7문제 이상 맞히면 통과', min: 10, pass: 0.7, steps: [
      { t: 'q', kind: 'mc', fig: 't_askSwitch', q: '연수 실습 시간, 옆자리 선생님이 "멀티에이전트를 해 보려면 콘솔에서 뭘 켜야 해요?"라고 물어요. 가장 알맞은 대답은?',
        opts: ['Playground에서 멀티에이전트 모드를 고르면 돼요', 'API keys에서 에이전트마다 키를 하나씩 새로 만들어야 해요', '켤 건 없어요. 역할마다 프롬프트를 달리해 코드로 이어요', 'Upstage Studio에서만 만들 수 있어요. 코드로는 안 돼요'], a: 2,
        why: '멀티에이전트는 제품 기능이 아니라 <b>설계 방법</b>이에요. 역할마다 시스템 프롬프트(와 모델)를 정해 같은 API를 여러 번 부르고, 그 사이를 내 파이썬 코드가 이어요.',
        ex: ['Playground는 브라우저에서 모델을 써 보는 곳이에요. 역할을 나누는 건 내 코드예요.', '키는 하나로 충분해요. 키가 늘면 지킬 비밀만 늘어요.', '', 'Studio는 문서 처리 에이전트를 화면에서 만드는 노코드 도구예요. 파이썬으로 역할을 나누는 데는 콘솔 설정이 필요 없어요.'] },
      { t: 'q', kind: 'mc', fig: 't_answers120', q: '이름을 지우고 번호만 남긴 학생 파이썬 과제 답안 120개에 피드백 초안을 달려고 해요. 답안끼리는 서로 상관없고, 빨리 끝내고 싶어요. 어떤 모양이 가장 잘 맞을까요?',
        opts: ['나눠 하고 합치기', '만들기-검토 반복', '순차 파이프라인', '감독자-작업자'], a: 0,
        why: '서로 상관없는 일을 묶음으로 나눠 나란히 하고, 마지막에 합쳐요. 합칠 때 빠진 번호·겹친 번호를 검사하고, 한꺼번에 너무 많이 보내지 않게 조절해요.',
        ex: ['', '주고받으며 고치는 반복은 답안 하나를 다듬을 때 이야기예요. 묶음을 어떻게 나눌지가 먼저예요.', '앞 결과가 다음 입력이 되는 한 줄이 아니에요. 묶음끼리 서로 기다리지 않아요.', '다음 일을 모델이 고를 필요가 없어요. 나누는 방법이 처음부터 정해져 있어요.'] },
      { t: 'q', kind: 'mc', fig: 't_429', q: '연수 실습에서 단원 10개의 문항을 작업자 10개로 한꺼번에 나란히 보냈더니 <code>429</code>가 여러 개 났어요. 가장 알맞은 조치는?',
        opts: ['작업자를 20개로 늘려 더 빨리 끝낸다', 'API 키를 새로 만들어 바꿔 끼운다', 'reasoning_effort를 "high"로 올린다', '동시에 보내는 수를 줄이고, 429면 잠깐 기다렸다 다시 보낸다'], a: 3,
        why: '<code>429</code>는 분당 요청·토큰 제한에 걸렸다는 뜻이에요. 한꺼번에 보내는 수를 줄이고 1·2·4초처럼 기다렸다 다시 보내요(c1u3 지수 백오프). 나란히 하면 빨라지는 대신 이런 제한에 먼저 부딪쳐요.',
        ex: ['더 많이 한꺼번에 보내면 제한에 더 빨리 걸려요.', '키 문제(401)가 아니라 보내는 속도 문제예요. 키를 바꿔도 한꺼번에 보내는 건 그대로예요.', '추론을 켜면 토큰만 늘어요. 분당 토큰 제한에 오히려 더 빨리 걸릴 수 있어요.', ''] },
      { t: 'q', kind: 'order', fig: 't_itemOrder', q: '출제 팀(team.py)에서 문항 하나가 처리되는 순서대로 쌓아 보세요.',
        items: ['출제자가 문항 1판을 만든다', '검토자가 pass와 issues를 돌려준다', '통과하지 못하면 issues를 들고 출제자가 고친다', '통과하거나 고치기 2번을 채우면 상태를 정해 로그에 남긴다'],
        why: '만들어야 검토하고, 검토 결과가 있어야 고치고, 통과나 최대 횟수로 끝나야 상태(확정·사람 확인)를 정해요.' },
      { t: 'q', kind: 'line', fig: 't_oldModel', q: '연수에서 받은 예제를 고쳐 쓴 team.py 설정이에요. 곧 멈출 줄을 눌러 보세요.', lang: 'py',
        code: src(['SUPERVISOR = "solar-pro4"', 'WORKER = "solar-mini"', 'MAX_FIX = 2', 'EFFORT = "none"', 'LOG_FILE = "team_log.json"']), a: 1,
        why: '<code>solar-mini</code>는 2026-10-30(KST)에 서비스가 끝나는 옛 모델이에요. 가볍고 싼 작업자 모델은 지금 <code>solar-mini4</code>예요. 모델 이름을 변수 한곳에 모아 두면 이렇게 한 줄만 고치면 돼요.' },
      { t: 'q', kind: 'blank', fig: 't_schema2', q: '검토 결과 스키마예요. strict 구조화 출력이 받아들이게 두 빈칸을 채워 보세요.', lang: 'py',
        code: src(['REVIEW = {', '  "type": "object",', '  "properties": {', '    "pass": {"type": "boolean"},', '    "issues": {"type": "array",', '      "items": {"type": "string"}}},', '  "required": [[1]],', '  "additionalProperties": [[2]],', '}']),
        opts: [['["pass"]', 'False'], ['["pass", "issues"]', 'False'], ['["pass", "issues"]', 'True'], ['[]', 'False']], a: 1,
        why: 'strict에서는 모든 속성을 <code>required</code>에 넣고, 모든 object에 <code>"additionalProperties": False</code>를 둬요(c2u2).',
        ex: ['issues도 required에 넣어야 해요. strict는 모든 속성을 required에 둬요.', '', 'additionalProperties는 False여야 해요. True면 strict 규칙을 어겨요.', 'required를 비우면 안 돼요. 모든 속성을 넣어야 해요.'] },
      { t: 'q', kind: 'mc', fig: 't_workerCost', q: '작업자 호출을 모두 더하니 입력 60,000 · 출력 15,000 토큰이에요. 작업자 모델을 <code>solar-pro4</code>에서 <code>solar-mini4</code>로 바꾸면 작업자 비용은 지금 가격으로 어떻게 될까요?',
        opts: ['그대로다. 토큰 수가 같으니까', '절반쯤으로 준다', '약 3분의 1로 준다', '10분의 1로 준다'], a: 2,
        why: '100만 토큰당 <code>solar-pro4</code>는 입력 $0.30·출력 $1.20, <code>solar-mini4</code>는 입력 $0.10·출력 $0.40이라 둘 다 3분의 1이에요. $0.018 + $0.018 = $0.036이 $0.006 + $0.006 = $0.012가 돼요. 바꾼 뒤에는 품질이 괜찮은지 결과로 꼭 확인해요.',
        ex: ['토큰 수는 같아도 토큰값이 모델마다 달라요.', '입력·출력 모두 3분의 1 값이라 절반보다 더 줄어요.', '', '그만큼 싸지는 않아요. 지금 가격 차이는 3배예요.'] },
      { t: 'q', kind: 'mc', fig: 't_allPass', q: '검토 로그를 보니 통과가 아주 많아요. 이 검토자가 정말 오류를 잡는지 확인하는 방법으로 가장 알맞은 것은?',
        opts: ['로그의 pass 비율이 높을수록 좋은 검토자라고 본다', '정답이 둘인 문항처럼 일부러 틀린 문항을 섞어 잡아내는지 본다', '검토자 프롬프트에 "꼼꼼히 봐"라고 한 줄 더 적는다', '검토자와 출제자를 같은 대화에 넣어 서로 이야기하게 한다'], a: 1,
        why: '정답을 아는 시험 문항(일부러 넣은 오류)으로 검토자를 평가해요. c3u1에서 질문 세트로 챗봇을 평가한 것과 같은 생각이에요.',
        ex: ['pass가 많은 건 맞장구일 수도 있어요. 잡아야 할 걸 잡는지가 기준이에요.', '', '막연한 말은 기준이 아니에요. 무엇을 볼지 목록으로 주고, 결과로 확인해요.', '같은 대화에 넣으면 서로의 말에 끌려가 맞장구가 쉬워져요.'] },
      { t: 'q', kind: 'mc', fig: 't_cursorSub', q: '커서한입에서 배운 Cursor 서브에이전트와 team.py의 작업자 에이전트가 닮은 점으로 가장 알맞은 것은?',
        opts: ['둘 다 부모(감독자)의 대화 기록 전체를 그대로 이어받는다', '둘 다 업스테이지 콘솔에서 켜는 기능이다', '둘 다 여럿을 돌려도 토큰은 하나일 때와 같다', '둘 다 맡은 일만 자기 맥락에서 하고 결과만 돌려준다'], a: 3,
        why: 'Cursor 서브에이전트는 자기 컨텍스트 창에서 깨끗하게 시작해 요약만 부모에게 돌려줘요. team.py 작업자도 상태에서 필요한 부분만 받아 일하고 JSON 결과만 돌려줘요.',
        ex: ['거꾸로예요. 서브에이전트는 부모 대화를 볼 수 없고, 작업자에게도 필요한 부분만 넘겨요.', '서브에이전트는 Cursor 기능이고, team.py는 내 파이썬 코드예요. 콘솔에서 켜는 게 아니에요.', '각자 토큰을 써요. 다섯이면 대략 다섯 배예요.', ''] },
      { t: 'q', kind: 'mc', fig: 't_compare', q: '같은 주제 10문제를 두 방식으로 만들어 내가 직접 풀어 봤어요. 에이전트 하나(<code>solar-pro4</code> 한 번)와 출제 팀(호출 40번) 모두 내가 찾은 오류가 1개씩이고, 팀 쪽이 비용도 기다리는 시간도 몇 배였어요. 가장 알맞은 결론은?',
        opts: ['이 일에는 에이전트 하나 + 사람 확인으로 충분하다', '팀이 더 정교하니 비용이 들어도 늘 팀을 쓴다', '오류가 있었으니 둘 다 버리고 손으로만 만든다', '팀의 최대 고치기 횟수를 10번으로 늘리면 오류가 0이 된다'], a: 0,
        why: '나누는 건 결과가 나아질 때만 값을 해요. 품질이 같다면 단순한 쪽이 이겨요. 어느 쪽이든 마지막 사람 확인은 남겨요.',
        ex: ['', '품질이 같은데 비용·시간만 몇 배면 팀을 쓸 까닭이 약해요.', '오류 1개는 사람 확인으로 고치면 돼요. 도구를 버릴 일은 아니에요.', '횟수를 늘리면 비용만 늘고, 같은 지적을 맴도는 끝없는 반복이 될 수 있어요.'] }
    ]}
    ]
  });
})();
