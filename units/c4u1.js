// 과정 4 · 단원 1 · 트랙 A ① 파이썬 자동채점
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
  // 글자가 든 둥근 단추
  function chip(P, x, y, w, h, label, fill, size) {
    P.rrect(x, y, w, h, 8, { fill: fill || 'paper', gap: 5, w: 1.6 });
    P.text(x + w / 2, y + h / 2 + (size || 13) * 0.36, label, { size: size || 13, weight: 700 });
  }
  // 이름표가 든 상자(프로그램·서버)
  function box(P, x, y, w, h, label, fill, size) {
    P.rrect(x, y, w, h, 10, { fill: fill || 'paper', gap: 6, w: 2 });
    if (label) P.text(x + w / 2, y + h / 2 + (size || 13) * 0.36, label, { size: size || 13, weight: 700 });
  }
  // 흩어진 카드(순서 문제용)
  function card(P, x, y) { P.rrect(x, y, 92, 70, 10, { fill: 'paper' }); }
  function cross(P, cx, cy, r, c) {
    P.line(cx - r, cy - r, cx + r, cy + r, { c: c || 'bad', w: 3 });
    P.line(cx + r, cy - r, cx - r, cy + r, { c: c || 'bad', w: 3 });
  }
  function tick(P, cx, cy, r) { P.path(`M${cx - r} ${cy} L${cx - r * 0.3} ${cy + r * 0.7} L${cx + r} ${cy - r * 0.7}`, { c: 'good', w: 3.2 }); }
  function ask(P, x, y, size, c) { P.text(x, y, '?', { size: size || 22, weight: 700, c: c || 'warm' }); }
  // 돋보기(지름 d)
  function lens(P, cx, cy, d, fill) {
    P.circle(cx, cy, d, { fill: fill || 'sky', gap: 5, w: 2.2 });
    P.line(cx + d * 0.33, cy + d * 0.33, cx + d * 0.55, cy + d * 0.58, { w: 3.5 });
  }
  // 시계(지름 d)
  function clock(P, cx, cy, d, fill) {
    P.circle(cx, cy, d, { fill: fill || 'paper', fs: 'solid', w: 2.2 });
    P.line(cx, cy, cx, cy - d * 0.3, { w: 3 });
    P.line(cx, cy, cx + d * 0.22, cy + d * 0.12, { w: 3 });
  }
  // 터미널 상자(어두운 바탕 + 고정폭 줄)
  function term(P, x, y, w, h, lines, size) {
    const s = size || 11;
    P.rrect(x, y, w, h, 8, { fill: 'ink', fs: 'solid' });
    (lines || []).forEach((t, i) => P.text(x + 10, y + 8 + s * 1.2 + i * s * 1.55, t, { mono: true, size: s, anchor: 'start', c: 'paper' }));
  }
  // 막대(전체 칸 + 채운 만큼)
  function bar(P, x, y, w, h, frac, c) {
    P.rrect(x, y, w, h, 4, { c: 'soft', w: 1.2 });
    if (frac > 0) P.rrect(x, y, w * frac, h, 4, { fill: c || 'good', fs: 'solid', w: 1 });
  }
  // 테스트 케이스 한 줄: 입력 … 기대값 + 통과·실패 표시
  function caseRow(P, x, y, w, inp, exp, ok) {
    P.rrect(x, y, w, 26, 6, { fill: 'paper', w: 1.4 });
    P.text(x + 8, y + 18, inp, { mono: true, size: 11, anchor: 'start' });
    P.text(x + w - 30, y + 18, exp, { mono: true, size: 11, anchor: 'end' });
    if (ok === true) tick(P, x + w - 14, y + 13, 6);
    else if (ok === false) cross(P, x + w - 14, y + 13, 5);
  }
  // 점수표 격자
  function sheet(P, x, y, w, h, rows, cols) {
    P.rrect(x, y, w, h, 8, { fill: 'paper', w: 1.8 });
    for (let i = 1; i < rows; i++) P.line(x, y + h * i / rows, x + w, y + h * i / rows, { c: 'soft', w: 1.2 });
    for (let j = 1; j < cols; j++) P.line(x + w * j / cols, y, x + w * j / cols, y + h, { c: 'soft', w: 1.2 });
  }
  // 정리 깔때기
  function funnel(P, cx, top, w, h, label) {
    P.path(`M${cx - w / 2} ${top} L${cx + w / 2} ${top} L${cx + w / 6} ${top + h} L${cx - w / 6} ${top + h} Z`, { fill: 'sky', gap: 7 });
    if (label) P.text(cx, top + h / 2 + 4, label, { mono: true, size: 12, weight: 700 });
  }
  // 노트북
  function laptop(P, x, y, w, h, fill) {
    P.rrect(x, y, w, h, 8, { fill: fill || 'paper', w: 2 });
    P.path(`M${x - 6} ${y + h} L${x + w + 6} ${y + h} L${x + w + 12} ${y + h + 12} L${x - 12} ${y + h + 12} Z`, { fill: 'soft', gap: 5 });
  }
  // 순서 문제: 흩어진 카드 다섯 장(그림 함수는 카드 가운데 좌표를 받는다)
  const SPOTS = [[10, 12], [124, 40], [238, 8], [50, 112], [190, 116]];
  function scatter(P, icons) {
    icons.forEach((f, i) => { const [x, y] = SPOTS[i]; card(P, x, y); f(x + 46, y + 35); });
    ask(P, 113, 100, 20, 'warm');
    ask(P, 302, 104, 20, 'bad');
    ask(P, 166, 196, 20, 'accent');
  }
  // 줄 고르기 문제: 메모 + 돋보기 + 사람
  function memo(P, fill, n, title) {
    P.note(16, 14, 186, 172, { fill: fill || 'hi' });
    const top = title ? 64 : 44;
    if (title) P.text(109, 40, title, { mono: true, size: 12, weight: 700 });
    for (let i = 0; i < n; i++) P.line(34, top + i * 22, 184 - (i % 3) * 18, top + i * 22, { c: 'ink2', w: 2.4 });
    lens(P, 206, 126, 58);
    person(P, 292, 198, 'wow', 0.62);
    P.text(286, 52, '어느 줄?', { size: 14, weight: 700, c: 'warm' });
  }

  /* ---------- 모의 화면에서 되풀이하는 조각 ---------- */
  const EMPTY_PANEL = { mode: 'Agent', model: 'Auto', msgs: [], input: '' };
  const panel = o => Object.assign({}, EMPTY_PANEL, o);
  const L3_FILES = ['problems.json', 'solution.py', 'check_cases.py', 'submissions/'];
  const GFILES = ['problems.json', 'solution.py', 'check_cases.py', 'runner.py', 'grade.py', 'submissions/', 'sandbox/'];
  const P2_HEAD = ['  {', '    "id": "p2",', '    "title": "점수 평균(빈 리스트는 0)",', '    "func": "average",', '    "cases": ['];
  const P2_TAIL = ['    ],', '    "points": 3,', '    "hints": ["sum과 len을 떠올려요"]', '  },'];
  const CASE_1 = '      {"args": [[80, 90]], "expected": 85}';
  const CASES_NEW = ['      {"args": [[80, 90]], "expected": 85},', '      {"args": [[100]], "expected": 100},', '      {"args": [[]], "expected": 0}'];
  const P2_JSON = src([...P2_HEAD, CASE_1, ...P2_TAIL]);
  const P2_JSON_NEW = src([...P2_HEAD, ...CASES_NEW, ...P2_TAIL]);
  const AGENT_Q = 'problems.json의 p2(average)에 경계 케이스 2개(점수가 하나뿐, 빈 리스트)를 더해 줘. 기대값은 solution.py의 정답 함수로 계산해. 다른 문제는 건드리지 마.';
  const AGENT_A = '<code>solution.py</code>의 <code>average</code>로 기대값을 계산해 p2에 케이스 2개(점수가 하나뿐, 빈 리스트)를 더했어요. 다른 문제는 그대로예요.';
  const RUN_IO = src(['import subprocess, sys', '', 'for name in ["s1.py", "s2.py", "s3.py"]:', '    try:', '        r = subprocess.run(', '            [sys.executable, name],', '            cwd="sandbox", input="5\\n",', '            capture_output=True,', '            text=True, timeout=2)', '    except subprocess.TimeoutExpired:', '        print(name, "시간 초과(2초)")', '        continue', '    out = r.stdout.strip()', '    if out == "15":', '        print(name, "통과")', '    else:', '        print(name, "실패:", out)']);
  const S2 = src(['# 1부터 n까지 더하기', 'n = int(input())', 'total = 0', 'for i in range(1, n + 1):', '    total += i', 'print("합계:", total)']);
  const S3 = src(['# 1부터 n까지 더하기', 'n = int(input())', 'total = 0', 'i = 1', 'while i <= n:', '    total += i', 'print(total)']);
  const GRADE_PY = src(['# grade.py: 답안 × 문제마다 따로 실행해 채점', 'import csv, json, subprocess, sys', 'from pathlib import Path', '', 'probs = json.loads(Path("problems.json")', '                   .read_text("utf-8"))', 'subs = sorted(Path("sandbox").glob("s*.py"))', '', 'def run(sub, prob):', '    cmd = [sys.executable, "runner.py",', '           str(sub), prob["id"]]', '    try:', '        r = subprocess.run(cmd,', '            capture_output=True, text=True,', '            timeout=2)', '    except subprocess.TimeoutExpired:', '        return None  # 시간 초과', '    return json.loads(r.stdout)']);
  const GRADE_OUT = ['$ python grade.py', '번호  p1  p2  p3  합계', 's01   3   3   3   9', 's02   3   2   3   8', 's03   3   2   2   7', 's04   3   3   2   8', 's05   3   0   3   6  p2 시간 초과', '많이 틀린 케이스: p2 [] 3명, p3 60점 2명', 'report.csv에 저장했어요'];
  const REPORT_CSV = src(['번호,p1,p2,p3,합계,메모', 's01,3,3,3,9,', 's02,3,2,3,8,', 's03,3,2,2,7,', 's04,3,3,2,8,', 's05,3,0,3,6,p2 시간 초과']);

  HANIP.unit({
    id: 'c4u1',
    course: '과정 4 · 2일차 트랙 A 실습',
    title: '단원 1 · 트랙 A ① 파이썬 자동채점',
    goals: ['정답 비교·테스트 케이스·루브릭 채점을 나누고 채점 로직 설계하기', 'problems.json으로 문제·정답 데이터를 만들고 questions.json과 함께 쓰기', '학생 코드를 시간 제한 안에서 따로 돌리고 채점 리포트 만들기'],
    checked: { date: '2026-10-16' },
    sources: [
      'https://docs.python.org/3/library/subprocess.html',
      'https://docs.python.org/3/library/json.html',
      'https://docs.python.org/3/library/csv.html',
      'https://docs.python.org/3/library/importlib.html',
      'https://docs.python.org/3/library/functions.html',
      'https://docs.python.org/3/library/sys.html',
      'https://console.upstage.ai/docs/capabilities/generate/chat',
      'https://console.upstage.ai/docs/capabilities/extract/universal-extraction',
      'https://github.com/UpstageAI/Solar-Pro4-Cookbook',
      'https://www.upstage.ai/pricing/api',
      'https://cursor.com/docs/agent/overview'
    ],

    figs: {
      /* ---------- L1 설명 그림 ---------- */
      f_pile: { w: 340, h: 200, label: '답안 90개 더미 앞에서 어지러운 얼굴과, 결과를 바로 돌려주는 채점 로봇', draw(P) {
        [0, 1, 2].forEach(i => P.note(20 + i * 8, 46 - i * 8, 90, 104, { fill: ['paper', 'sky', 'hi'][i] }));
        P.text(81, 22, '답안 90개', { size: 14, weight: 700 });
        P.face(81, 104, 34, { mood: 'dizzy' });
        P.arrow(136, 100, 186, 100, { c: 'accent', w: 3, head: 10 });
        P.robot(250, 92, 0.55, { mood: 'happy' });
        tick(P, 304, 50, 10);
        P.text(250, 160, '바로 결과', { size: 14, weight: 700, c: 'good' });
        P.text(74, 186, '손으로 하면 며칠', { size: 12, c: 'ink2' });
        P.text(250, 186, '틀린 곳까지', { size: 12, c: 'ink2' });
      }},
      f_threeKinds: { w: 340, h: 200, label: '정답 비교, 테스트 케이스, 루브릭 채점 세 갈래', draw(P) {
        P.rrect(14, 20, 92, 112, 10, { fill: 'sky', gap: 7 });
        P.text(60, 84, '② = ②', { size: 18, weight: 700 });
        P.rrect(124, 20, 92, 112, 10, { fill: 'hi', gap: 7 });
        P.text(170, 56, 'f(1, 2)', { mono: true, size: 12, weight: 700 });
        P.arrow(170, 64, 170, 88, { c: 'accent', w: 2.2, head: 7 });
        P.text(170, 110, '3 = 3', { mono: true, size: 13, weight: 700 });
        P.rrect(234, 20, 92, 112, 10, { fill: 'warm', gap: 7 });
        [48, 76, 104].forEach(y => { P.rect(248, y - 9, 12, 12, { w: 1.4 }); P.line(268, y - 3, 312, y - 3, { c: 'ink2', w: 2.4 }); });
        P.text(60, 158, '정답 비교', { size: 13, weight: 700 });
        P.text(170, 158, '테스트 케이스', { size: 13, weight: 700 });
        P.text(280, 158, '루브릭 채점', { size: 13, weight: 700 });
        P.text(60, 182, '객관식·단답형', { size: 11, c: 'ink2' });
        P.text(170, 182, '코드 과제', { size: 11, c: 'ink2' });
        P.text(280, 182, '서술형', { size: 11, c: 'ink2' });
      }},
      f_rubric: { w: 340, h: 200, label: '루브릭과 학생 답이 로봇에게 가고, 점수와 이유가 나온 뒤 교사가 확인하는 흐름', draw(P) {
        P.note(14, 16, 100, 108, { fill: 'hi' });
        P.text(64, 40, '루브릭', { size: 14, weight: 700 });
        [62, 82, 102].forEach(y => P.line(28, y, 100, y, { c: 'ink2', w: 2.4 }));
        P.note(14, 136, 100, 46, { fill: 'paper' });
        P.text(64, 164, '학생 답', { size: 12, weight: 700 });
        P.arrow(120, 96, 164, 96, { c: 'accent', w: 2.4, head: 8 });
        P.robot(198, 90, 0.42, { mood: 'proud' });
        P.arrow(226, 96, 252, 96, { c: 'accent', w: 2.4, head: 8 });
        P.rrect(256, 62, 76, 62, 8, { fill: 'paper', w: 1.6 });
        P.text(294, 88, '점수 3', { size: 12, weight: 700 });
        P.text(294, 110, '이유 …', { size: 11 });
        P.face(294, 158, 30, { mood: 'wink' });
        P.text(206, 164, '교사 확인', { size: 12, weight: 700, c: 'warm' });
      }},
      f_split: { w: 340, h: 200, label: '채점기가 맡을 일과 교사가 할 일을 양쪽으로 나눈 모습', draw(P) {
        P.robot(70, 66, 0.42, { mood: 'happy' });
        chip(P, 14, 110, 112, 26, '케이스 확인', 'sky', 12);
        chip(P, 14, 144, 112, 26, '바로 피드백', 'sky', 12);
        P.line(170, 16, 170, 176, { c: 'soft', w: 1.4 });
        person(P, 270, 100, 'smile', 0.6);
        chip(P, 214, 110, 112, 26, '점수 확정', 'hi', 12);
        chip(P, 214, 144, 112, 26, '이상한 것 살피기', 'hi', 12);
        P.text(70, 192, '채점기', { size: 13, weight: 700, c: 'accent' });
        P.text(270, 192, '교사', { size: 13, weight: 700, c: 'warm' });
      }},

      /* ---------- L1 문제 그림 ---------- */
      q_kindPick: { w: 340, h: 200, label: '보기 동그라미, 함수 코드, 글줄이 담긴 문항 카드 세 장과 방식 단추 세 개', draw(P) {
        ['㉠', '㉡', '㉢'].forEach((t, i) => { card(P, 14 + i * 110, 14); P.text(30 + i * 110, 36, t, { size: 15, weight: 700 }); });
        [0, 1, 2, 3].forEach(k => P.circle(40 + k * 18, 62, 11, { c: 'ink2', w: 1.4 }));
        P.text(140, 64, 'def f(n):', { mono: true, size: 11, anchor: 'start' });
        [50, 62, 74].forEach((y, k) => P.line(250, y, 312 - k * 10, y, { c: 'soft', w: 3 }));
        ask(P, 60, 122, 22);
        ask(P, 170, 122, 22);
        ask(P, 280, 122, 22);
        person(P, 300, 198, 'wow', 0.42);
        P.text(150, 170, '세 방식 중 어느 것?', { size: 13, weight: 700, c: 'warm' });
        P.text(150, 192, '어느 문항에 어느 방식?', { size: 12, c: 'ink2' });
      }},
      q_codeText: { w: 340, h: 200, label: '정답 코드와 생김새가 다른 학생 코드 사이의 같지 않음 표시', draw(P) {
        file(P, 14, 20, 120, 90, '정답 코드', null, 'sky', 12);
        P.text(74, 76, 'sum(nums)', { mono: true, size: 11 });
        file(P, 176, 20, 150, 90, '학생 코드', null, 'hi', 12);
        P.text(196, 68, 'for n in nums:', { mono: true, size: 11, anchor: 'start' });
        P.text(196, 88, '    t += n', { mono: true, size: 11, anchor: 'start' });
        P.text(155, 72, '≠', { size: 22, weight: 700, c: 'bad' });
        person(P, 292, 198, 'wow', 0.6);
        P.text(110, 160, '글자가 다르면 틀린 걸까?', { size: 13, c: 'ink2' });
      }},
      q_llmOnly: { w: 340, h: 200, label: '서술형 답안 더미가 로봇을 거쳐 점수 카드가 되고, 바로 성적에 넣을지 망설이는 모습', draw(P) {
        [0, 1, 2].forEach(i => P.note(14 + i * 6, 30 - i * 6, 70, 86, { fill: ['paper', 'sky', 'hi'][i] }));
        P.text(55, 140, '서술형 10문항', { size: 12, weight: 700 });
        P.arrow(100, 70, 132, 70, { c: 'accent', w: 2.2, head: 8 });
        P.robot(166, 74, 0.42, { mood: 'proud' });
        P.arrow(196, 70, 224, 70, { c: 'accent', w: 2.2, head: 8 });
        P.rrect(228, 36, 96, 70, 8, { fill: 'paper', w: 1.6 });
        P.text(276, 64, '점수', { size: 13, weight: 700 });
        P.text(276, 90, '9 · 7 · 8 …', { size: 12 });
        P.text(276, 140, '바로 성적에?', { size: 14, weight: 700, c: 'warm' });
        person(P, 170, 198, 'wow', 0.42);
      }},
      q_roleLine: { w: 340, h: 200, label: '다섯 줄짜리 역할 나눔 메모를 돋보기로 살피는 얼굴', draw(P) { memo(P, 'hi', 5, '누가 할까'); } },

      /* ---------- L2 설명 그림 ---------- */
      f_case: { w: 340, h: 200, label: '입력 [80, 90]이 average를 거쳐 85가 나오고 기대값 85와 맞는 테스트 케이스 하나', draw(P) {
        P.text(59, 50, '입력', { size: 12, weight: 700, c: 'ink2' });
        P.rrect(14, 60, 90, 40, 8, { fill: 'sky', gap: 5 });
        P.text(59, 85, '[80, 90]', { mono: true, size: 13 });
        P.arrow(108, 80, 136, 80, { c: 'accent', w: 2.4, head: 8 });
        P.rrect(140, 56, 90, 48, 10, { fill: 'hi', gap: 6, w: 2 });
        P.text(185, 85, 'average', { mono: true, size: 13, weight: 700 });
        P.arrow(234, 80, 262, 80, { c: 'accent', w: 2.4, head: 8 });
        P.text(296, 50, '실제', { size: 12, weight: 700, c: 'ink2' });
        P.rrect(266, 60, 60, 40, 8, { fill: 'paper', w: 1.6 });
        P.text(296, 86, '85', { mono: true, size: 15, weight: 700 });
        P.text(296, 130, '기대 85', { size: 12, weight: 700 });
        tick(P, 296, 154, 10);
        P.text(140, 152, '입력 + 기대 출력 = 케이스 하나', { size: 13, c: 'accent' });
      }},
      f_normalize: { w: 340, h: 200, label: '모양이 다른 두 답이 정리 깔때기를 지나 같은 글자가 되는 모습', draw(P) {
        P.text(90, 34, '" Append,Insert "', { mono: true, size: 12 });
        P.text(254, 34, 'APPEND, insert', { mono: true, size: 12 });
        funnel(P, 170, 50, 220, 60, 'normalize');
        P.arrow(170, 114, 170, 138, { c: 'accent', w: 2.4, head: 8 });
        P.rrect(100, 142, 140, 30, 8, { fill: 'good', gap: 5 });
        P.text(170, 162, 'append, insert', { mono: true, size: 12 });
        P.text(170, 194, '공백·대소문자·쉼표 뒤 띄어쓰기', { size: 11, c: 'ink2' });
      }},
      f_partial: { w: 340, h: 200, label: '케이스 세 줄 중 둘은 통과, 하나는 실패하고 막대가 3분의 2만 찬 모습', draw(P) {
        caseRow(P, 20, 24, 200, '(1, 5)', '"2, 4"', true);
        caseRow(P, 20, 58, 200, '(2, 8)', '"2, 4, 6, 8"', false);
        caseRow(P, 20, 92, 200, '(7, 7)', '""', true);
        P.text(282, 60, '통과 2/3', { size: 15, weight: 700 });
        bar(P, 240, 76, 86, 18, 2 / 3, 'good');
        P.text(282, 120, '6점 중 4점', { size: 13, c: 'accent' });
        P.face(282, 162, 34, { mood: 'smile' });
        P.text(120, 150, '틀린 케이스는 입력·기대·실제를 남겨요', { size: 11, c: 'ink2' });
      }},

      /* ---------- L2 문제 그림 ---------- */
      q_norm: { w: 340, h: 200, label: '학생 답 쪽지 네 장이 정리 깔때기로 들어가 정답과 비교되는 모습', draw(P) {
        ['①', '②', '③', '④'].forEach((t, i) => { P.note(20 + i * 78, 12, 64, 40, { fill: ['paper', 'sky', 'hi', 'paper'][i] }); P.text(52 + i * 78, 38, t, { size: 15, weight: 700 }); });
        funnel(P, 170, 62, 200, 50, 'normalize');
        P.arrow(170, 116, 170, 138, { c: 'accent', w: 2.4, head: 8 });
        P.rrect(90, 142, 160, 30, 8, { fill: 'good', gap: 5 });
        P.text(170, 162, '"python, java"', { mono: true, size: 12 });
        ask(P, 284, 166, 22);
        P.text(170, 194, '정리한 뒤에도 다른 건?', { size: 12, c: 'ink2' });
      }},
      q_double: { w: 340, h: 200, label: '채점 코드를 돌린 터미널에 몇 개가 통과했는지 물음표로 나온 모습', draw(P) {
        term(P, 20, 30, 200, 110, ['$ python check.py', '?/3'], 13);
        P.face(280, 92, 60, { mood: 'wink' });
        ask(P, 280, 44, 26);
        P.text(120, 178, '몇 개가 통과할까?', { size: 13, c: 'ink2' });
      }},
      q_caseOrder: { w: 340, h: 200, label: '뒤섞인 카드: 입력 목록, 함수 상자, 깔때기, 통과·실패 표시, 점수 막대', draw(P) {
        scatter(P, [
          (x, y) => { tick(P, x - 16, y, 9); cross(P, x + 18, y, 8); },
          (x, y) => { P.rrect(x - 30, y - 14, 60, 28, 6, { fill: 'sky', gap: 4 }); P.text(x, y + 5, 'f( )', { mono: true, size: 12, weight: 700 }); },
          (x, y) => { P.text(x, y + 5, '[1, 5]', { mono: true, size: 13, weight: 700 }); },
          (x, y) => bar(P, x - 34, y - 8, 68, 16, 0.66, 'good'),
          (x, y) => funnel(P, x, y - 18, 60, 36, '')
        ]);
      }},
      q_floatBlank: { w: 340, h: 200, label: '0.1 더하기 0.2가 0.30000000000000004로 나와 0.3과 아주 조금 다른 모습', draw(P) {
        P.text(150, 40, '0.1 + 0.2', { mono: true, size: 16, weight: 700 });
        P.arrow(150, 50, 150, 66, { c: 'accent', w: 2.2, head: 7 });
        P.text(150, 88, '0.30000000000000004', { mono: true, size: 13 });
        P.text(120, 126, '0.3', { mono: true, size: 16, weight: 700 });
        P.text(176, 126, '≈ ?', { size: 18, weight: 700, c: 'warm' });
        P.face(290, 150, 40, { mood: 'wow' });
        P.text(130, 172, '아주 조금 달라요', { size: 13, c: 'ink2' });
      }},
      q_hardcode: { w: 340, h: 200, label: '케이스 값만 if로 외워 둔 답안 쪽지와 공개된 예시 케이스, 놀란 얼굴', draw(P) {
        file(P, 14, 16, 180, 128, 'add.py', null, 'paper', 11);
        P.text(28, 66, 'if a == 1 and b == 2:', { mono: true, size: 10, anchor: 'start' });
        P.text(28, 86, '    return 3', { mono: true, size: 10, anchor: 'start' });
        P.text(28, 106, 'if a == -1 and b == 1:', { mono: true, size: 10, anchor: 'start' });
        P.text(28, 126, '    return 0', { mono: true, size: 10, anchor: 'start' });
        chip(P, 212, 20, 116, 28, '공개 케이스 3개', 'hi', 11);
        person(P, 270, 196, 'wow', 0.62);
        P.text(104, 174, '케이스만 외운 답안', { size: 13, c: 'ink2' });
      }},

      /* ---------- QA 그림 ---------- */
      qa_twoWays: { w: 340, h: 200, label: '단답형 쪽지와 코드 과제 쪽지 앞에서 채점 방법을 고민하는 얼굴', draw(P) {
        P.note(14, 24, 120, 80, { fill: 'hi' });
        P.text(74, 54, '단답형', { size: 13, weight: 700 });
        P.text(74, 82, '답: ____', { mono: true, size: 12 });
        P.note(150, 24, 120, 80, { fill: 'sky' });
        P.text(210, 54, '코드 과제', { size: 13, weight: 700 });
        P.text(210, 82, 'def length(xs):', { mono: true, size: 10 });
        ask(P, 142, 136, 26);
        person(P, 300, 198, 'wow', 0.55);
        P.text(110, 182, '둘 다 같은 방법으로?', { size: 13, c: 'ink2' });
      }},
      qa_weight: { w: 340, h: 200, label: '무게가 다른 케이스 블록 네 개와 합계를 묻는 물음표', draw(P) {
        P.rrect(20, 90, 44, 40, 6, { fill: 'sky', gap: 5 });
        P.text(42, 116, '1점', { size: 12, weight: 700 });
        P.rrect(72, 90, 44, 40, 6, { fill: 'sky', gap: 5 });
        P.text(94, 116, '1점', { size: 12, weight: 700 });
        P.rrect(130, 60, 70, 70, 8, { fill: 'hi', gap: 6 });
        P.text(165, 101, '2점', { size: 14, weight: 700 });
        P.rrect(210, 60, 70, 70, 8, { fill: 'hi', gap: 6 });
        P.text(245, 101, '2점', { size: 14, weight: 700 });
        P.text(68, 152, '보통 케이스', { size: 12, c: 'ink2' });
        P.text(205, 152, '경계 케이스', { size: 12, c: 'ink2' });
        P.text(170, 32, '배점 6점', { size: 14, weight: 700 });
        P.text(170, 186, '합계는 몇 점?', { size: 13, weight: 700, c: 'warm' });
        P.face(312, 100, 30, { mood: 'wink' });
      }},
      qa_overNorm: { w: 340, h: 200, label: '대소문자까지 맞춰야 하는 출력 문제에 정리 깔때기를 그대로 쓰려는 모습', draw(P) {
        P.rrect(60, 14, 220, 30, 8, { fill: 'good', gap: 5 });
        P.text(170, 35, 'Hello, World!', { mono: true, size: 13, weight: 700 });
        funnel(P, 170, 60, 200, 50, 'normalize');
        P.text(170, 140, '대소문자까지 똑같이?', { size: 13, weight: 700, c: 'warm' });
        person(P, 60, 198, 'wow', 0.5);
        person(P, 282, 198, 'smile', 0.5);
      }},

      /* ---------- L3 설명 그림 ---------- */
      f_dataSplit: { w: 340, h: 200, label: '문제·정답 데이터 파일과 채점 코드 파일을 나누고, 코드가 데이터를 읽는 모습', draw(P) {
        file(P, 20, 30, 110, 120, 'problems.json', null, 'hi', 11);
        [74, 94, 114].forEach(y => P.line(34, y, 116, y, { c: 'ink2', w: 2.4 }));
        file(P, 210, 30, 110, 120, 'grade.py', null, 'sky', 11);
        [74, 94, 114].forEach((y, i) => P.line(224 + i * 8, y, 306, y, { c: ['k', 's', 'n'][i], w: 3 }));
        P.arrow(206, 92, 136, 92, { c: 'accent', w: 2.4, head: 9 });
        P.text(170, 82, '읽기', { size: 12, weight: 700, c: 'accent' });
        P.text(75, 176, '문제·정답(데이터)', { size: 12, weight: 700 });
        P.text(265, 176, '채점 방법(코드)', { size: 12, weight: 700 });
      }},
      f_argsWrap: { w: 340, h: 200, label: 'add(1, 2)는 [1, 2], average([80, 90])는 [[80, 90]]처럼 상자 안 상자로 감싼 모습', draw(P) {
        P.text(80, 39, 'add(1, 2)', { mono: true, size: 13, weight: 700 });
        P.arrow(140, 34, 164, 34, { c: 'accent', w: 2.2, head: 7 });
        P.rrect(170, 18, 150, 30, 8, { fill: 'sky', gap: 5 });
        P.text(245, 38, '[1, 2]', { mono: true, size: 13 });
        P.text(80, 115, 'average([80, 90])', { mono: true, size: 12, weight: 700 });
        P.arrow(140, 110, 156, 110, { c: 'accent', w: 2.2, head: 7 });
        P.rrect(160, 80, 170, 64, 10, { fill: 'sky', gap: 6 });
        P.rrect(186, 96, 118, 32, 8, { fill: 'hi', gap: 5 });
        P.text(245, 117, '[80, 90]', { mono: true, size: 13 });
        P.text(245, 164, '한 번 더 감싸요', { size: 12, c: 'accent' });
        P.text(170, 192, 'args = 인자 목록', { size: 13, weight: 700 });
      }},
      f_twoFiles: { w: 340, h: 200, label: 'questions.json과 problems.json이 한 채점기로 들어가 점수표 하나가 되는 모습', draw(P) {
        file(P, 14, 14, 100, 70, 'questions.json', null, 'hi', 10);
        P.text(64, 66, '정답 비교', { size: 11, c: 'ink2' });
        file(P, 14, 112, 100, 70, 'problems.json', null, 'sky', 10);
        P.text(64, 164, '테스트 케이스', { size: 11, c: 'ink2' });
        P.arrow(118, 50, 168, 88, { c: 'accent', w: 2.2, head: 8 });
        P.arrow(118, 146, 168, 108, { c: 'accent', w: 2.2, head: 8 });
        P.robot(200, 98, 0.42, { mood: 'happy' });
        P.arrow(228, 98, 252, 98, { c: 'accent', w: 2.2, head: 8 });
        sheet(P, 256, 60, 72, 76, 4, 3);
        P.text(292, 160, '점수표 하나', { size: 12, weight: 700 });
      }},

      /* ---------- L3 문제 그림 ---------- */
      q_argsWrong: { w: 340, h: 200, label: 'args 칸이 average 호출로 바뀌다 번개처럼 오류가 난 모습', draw(P) {
        P.rrect(14, 30, 200, 40, 8, { fill: 'hi', gap: 5 });
        P.text(114, 55, '"args": [80, 90]', { mono: true, size: 12 });
        P.arrow(114, 74, 114, 102, { c: 'accent', w: 2.2, head: 7 });
        P.rrect(14, 106, 200, 40, 8, { fill: 'sky', gap: 5 });
        P.text(114, 131, 'average( ? )', { mono: true, size: 12 });
        P.path('M246 40 L232 76 L250 78 L236 116', { c: 'bad', w: 3 });
        person(P, 290, 198, 'dizzy', 0.6);
        P.text(114, 180, '정답 코드도 오류!', { size: 13, weight: 700, c: 'bad' });
      }},
      q_jsonLine: { w: 340, h: 200, label: 'JSON 메모를 돋보기로 살피는 얼굴', draw(P) { memo(P, 'sky', 5, 'problems.json'); } },
      q_whySplit: { w: 340, h: 200, label: '"한 파일이면 편하지 않아요?" 하고 묻는 동료와 나뉜 두 파일', draw(P) {
        P.bubble(14, 10, 204, 48, 70, 84);
        P.text(116, 40, '한 파일이면 편하지 않아요?', { size: 12 });
        person(P, 70, 198, 'smile', 0.68);
        file(P, 186, 86, 64, 76, 'grade.py', null, 'sky', 9);
        file(P, 262, 86, 70, 76, 'problems', null, 'hi', 9);
        P.text(297, 136, '.json', { mono: true, size: 9, weight: 700 });
        ask(P, 258, 74, 22);
      }},
      q_agentCase: { w: 340, h: 200, label: '로봇이 만든 케이스 카드를 그대로 써도 될지 망설이는 얼굴', draw(P) {
        P.robot(70, 80, 0.5, { mood: 'proud' });
        P.rrect(130, 40, 194, 36, 8, { fill: 'hi', gap: 5 });
        P.text(227, 63, '[[70, 75]] → 72', { mono: true, size: 12 });
        P.text(227, 110, '이대로 써도 될까?', { size: 13, weight: 700, c: 'warm' });
        P.face(227, 156, 36, { mood: 'wow' });
      }},

      /* ---------- L4 설명 그림 ---------- */
      f_twoWays: { w: 340, h: 200, label: '함수를 불러 돌려준 값을 보는 채점과, 프로그램에 입력을 넣고 출력을 보는 채점', draw(P) {
        P.text(85, 24, '함수 호출', { size: 14, weight: 700 });
        P.rrect(30, 40, 110, 50, 10, { fill: 'sky', gap: 6, w: 2 });
        P.text(85, 70, 'def add', { mono: true, size: 13, weight: 700 });
        P.arrow(85, 94, 85, 120, { c: 'accent', w: 2.2, head: 8 });
        P.text(85, 142, '돌려준 값 3', { size: 13, weight: 700 });
        P.line(170, 14, 170, 156, { c: 'soft', w: 1.4 });
        P.text(255, 24, '표준 입출력', { size: 14, weight: 700 });
        term(P, 196, 40, 122, 70, ['$ python s1.py', '5', '15'], 11);
        P.arrow(255, 114, 255, 124, { c: 'accent', w: 2.2, head: 6 });
        P.text(255, 142, '출력된 글 15', { size: 13, weight: 700 });
        P.text(170, 184, '무엇을 비교하나가 달라요', { size: 12, c: 'ink2' });
      }},
      f_rooms: { w: 340, h: 200, label: 'importlib·exec는 학생 코드가 채점기 안에서 돌아 같이 멈추고, subprocess는 따로 돌아 채점기가 멀쩡한 모습', draw(P) {
        P.text(85, 22, 'importlib·exec', { mono: true, size: 12, weight: 700 });
        P.rrect(14, 32, 142, 114, 12, { fill: 'sky', gap: 7 });
        P.text(85, 54, '채점기', { size: 13, weight: 700 });
        file(P, 40, 64, 90, 70, 'while True', null, 'paper', 10);
        P.face(85, 114, 22, { mood: 'dizzy' });
        P.text(85, 170, '같이 멈춰요', { size: 12, weight: 700, c: 'bad' });
        P.line(170, 14, 170, 186, { c: 'soft', w: 1.4 });
        P.text(255, 22, 'subprocess', { mono: true, size: 12, weight: 700 });
        box(P, 186, 40, 64, 56, '채점기', 'sky', 12);
        box(P, 266, 40, 64, 56, '학생', 'hi', 12);
        P.arrow(250, 68, 264, 68, { c: 'accent', w: 2, head: 6 });
        P.face(218, 126, 30, { mood: 'happy' });
        clock(P, 298, 126, 34);
        P.text(255, 170, '따로 돌아요', { size: 12, weight: 700, c: 'good' });
      }},
      f_timer: { w: 340, h: 200, label: '끝나지 않는 반복을 2초 시계가 끊고 시간 초과로 적는 모습', draw(P) {
        P.rrect(16, 48, 124, 84, 10, { fill: 'hi', gap: 6, w: 2 });
        P.text(78, 82, 'while i <= n:', { mono: true, size: 11 });
        P.curveArrow(116, 104, 78, 126, 40, 104, { c: 'bad', w: 2.2, head: 7 });
        clock(P, 200, 88, 60);
        P.text(200, 142, '2초', { size: 16, weight: 700 });
        P.arrow(236, 88, 266, 88, { c: 'accent', w: 2.4, head: 8 });
        chip(P, 270, 72, 60, 32, '끊기', 'bad', 13);
        P.text(170, 186, 'TimeoutExpired → 시간 초과로 적기', { size: 11, c: 'ink2' });
      }},
      f_safety: { w: 340, h: 200, label: '격리된 서버 안에 시간 제한, 그 안에 sandbox 폴더, 그 안에 학생 파일과 돋보기가 겹겹이 든 모습', draw(P) {
        P.rrect(14, 14, 312, 172, 14, { fill: 'sky', gap: 9 });
        P.text(24, 34, '격리된 채점 서버·검증된 서비스', { size: 12, weight: 700, anchor: 'start' });
        P.rrect(34, 46, 272, 126, 12, { fill: 'hi', gap: 8 });
        P.text(44, 66, '시간 제한 timeout=2', { size: 12, weight: 700, anchor: 'start' });
        P.rrect(54, 78, 232, 84, 10, { fill: 'paper', fs: 'solid' });
        P.text(64, 98, 'sandbox 폴더', { size: 12, weight: 700, anchor: 'start' });
        file(P, 136, 100, 70, 56, 's01.py', null, 'paper', 10);
        P.text(258, 98, '훑어보기', { size: 11, weight: 700 });
        lens(P, 250, 128, 34);
      }},

      /* ---------- L4 문제 그림 ---------- */
      q_import: { w: 340, h: 200, label: '맨 위에 print와 input이 있는 학생 파일을 불러온 채점기가 잠든 듯 기다리는 모습', draw(P) {
        file(P, 14, 20, 124, 120, 's07.py', null, 'paper', 11);
        P.text(26, 70, 'print("안녕")', { mono: true, size: 10, anchor: 'start' });
        P.text(26, 92, 'input()', { mono: true, size: 10, anchor: 'start' });
        P.text(26, 114, 'def add(a, b):', { mono: true, size: 10, anchor: 'start' });
        P.text(160, 66, 'import', { mono: true, size: 10, c: 'accent' });
        P.arrow(142, 80, 178, 80, { c: 'accent', w: 2.2, head: 8 });
        box(P, 182, 44, 100, 72, '채점기', 'sky', 13);
        clock(P, 304, 52, 32);
        P.face(232, 150, 34, { mood: 'sleepy' });
        P.text(232, 190, '입력을 기다리는 중…', { size: 12, c: 'ink2' });
      }},
      q_runBlank: { w: 340, h: 200, label: 'subprocess.run 코드의 빈칸과 학생 파일, 5를 넣는 화살표', draw(P) {
        term(P, 14, 20, 226, 116, ['subprocess.run(', '  [python, s01.py],', '  ____="5\\n",', '  text=True)'], 11);
        P.arrow(244, 76, 258, 76, { c: 'accent', w: 2.2, head: 7 });
        file(P, 262, 30, 66, 84, 's01.py', 'smile', 'hi', 10);
        P.text(150, 172, '5를 넣고, 출력은 글자로', { size: 12, c: 'ink2' });
      }},
      q_returncode: { w: 340, h: 200, label: 'returncode 1, 빈 stdout, stderr가 적힌 결과 카드와 놀란 얼굴', draw(P) {
        P.rrect(14, 24, 204, 120, 8, { fill: 'paper', w: 1.8 });
        P.text(26, 56, 'returncode: 1', { mono: true, size: 12, anchor: 'start' });
        P.text(26, 86, 'stdout: ""', { mono: true, size: 12, anchor: 'start' });
        P.text(26, 116, 'stderr: ...', { mono: true, size: 12, anchor: 'start' });
        person(P, 282, 198, 'wow', 0.66);
        ask(P, 282, 48, 26);
        P.text(116, 176, '무엇부터 볼까?', { size: 13, c: 'ink2' });
      }},
      q_resultOrder: { w: 340, h: 200, label: '뒤섞인 카드: 비교 기호, 시계, 실행 화살표, 0이라는 숫자, 터미널', draw(P) {
        scatter(P, [
          (x, y) => P.text(x, y + 8, '= ?', { size: 20, weight: 700 }),
          (x, y) => clock(P, x, y, 40),
          (x, y) => P.text(x, y + 6, 'returncode', { mono: true, size: 11, weight: 700 }),
          (x, y) => term(P, x - 36, y - 20, 72, 40, ['>_'], 12),
          (x, y) => { P.text(x, y + 6, 'stdout', { mono: true, size: 12, weight: 700 }); }
        ]);
      }},

      /* ---------- QB 그림 ---------- */
      qb_room: { w: 340, h: 200, label: 'exec와 subprocess.run 두 이름표 앞에서 무엇이 다른지 묻는 얼굴', draw(P) {
        chip(P, 20, 40, 120, 40, 'exec', 'sky', 15);
        chip(P, 186, 40, 140, 40, 'subprocess.run', 'hi', 13);
        P.text(163, 66, 'vs', { size: 14, weight: 700, c: 'ink2' });
        file(P, 50, 100, 60, 70, 's01.py', 'smile', 'paper', 9);
        ask(P, 170, 150, 26);
        person(P, 270, 198, 'wow', 0.6);
      }},
      qb_timeout: { w: 340, h: 200, label: '2초 시계와 지워질 것 같은 grade.py 쪽지, 물음표', draw(P) {
        clock(P, 70, 80, 70);
        P.text(70, 140, 'timeout=2', { mono: true, size: 12, weight: 700 });
        file(P, 140, 30, 80, 96, 'grade.py', 'wow', 'sky', 10);
        P.text(180, 150, 'os.remove', { mono: true, size: 12, weight: 700, c: 'bad' });
        ask(P, 238, 70, 26);
        person(P, 292, 198, 'dizzy', 0.55);
        P.text(150, 186, '2초면 괜찮을까?', { size: 13, c: 'ink2' });
      }},
      qb_prompt: { w: 340, h: 200, label: '학생 프로그램의 출력에 안내 문구가 섞여 나온 터미널과 놀란 얼굴', draw(P) {
        term(P, 14, 24, 220, 96, ['input: "3\\n5\\n"', 'stdout:', '첫 수: 둘째 수: 8'], 12);
        P.face(286, 70, 54, { mood: 'wow' });
        P.text(124, 150, '기대 출력은 8인데', { size: 13, c: 'ink2' });
        ask(P, 286, 140, 24);
      }},

      /* ---------- L5 설명 그림 ---------- */
      f_twoReports: { w: 340, h: 200, label: '왼쪽은 모두가 나온 교사용 점수표, 오른쪽은 내 결과와 힌트만 나온 학생용 카드', draw(P) {
        P.text(90, 22, '교사용', { size: 13, weight: 700 });
        sheet(P, 14, 32, 152, 132, 6, 5);
        P.rrect(106, 144, 26, 16, 3, { fill: 'warm', fs: 'solid', w: 1 });
        P.text(256, 22, '학생용', { size: 13, weight: 700 });
        P.rrect(186, 32, 140, 132, 10, { fill: 'hi', gap: 6 });
        P.text(256, 58, '내 점수 8/9', { size: 12, weight: 700 });
        P.text(198, 88, '틀린 케이스', { size: 11, anchor: 'start' });
        P.text(198, 110, 'average([])', { mono: true, size: 11, anchor: 'start' });
        cross(P, 306, 106, 6);
        P.text(256, 146, '힌트: 빈 리스트는?', { size: 11 });
        P.text(170, 190, '같은 결과, 다른 화면', { size: 12, c: 'ink2' });
      }},
      f_hotCase: { w: 340, h: 200, label: '케이스별로 틀린 사람 수를 막대로 그려 빈 리스트 케이스가 가장 긴 모습', draw(P) {
        P.text(170, 26, '케이스별로 틀린 사람 수', { size: 13, weight: 700 });
        [['p2 []', 3, 'bad'], ['p3 60점', 2, 'warm'], ['p2 [100]', 1, 'hi']].forEach(([t, n, c], i) => {
          const y = 62 + i * 40;
          P.text(96, y + 5, t, { size: 12, weight: 700, anchor: 'end' });
          P.rrect(106, y - 10, n * 60, 20, 4, { fill: c, fs: 'solid', w: 1.2 });
          P.text(114 + n * 60, y + 5, `${n}명`, { size: 12, anchor: 'start' });
        });
        P.text(170, 186, '다음 수업에서 다시 짚을 곳', { size: 12, c: 'accent' });
      }},
      f_teacherCheck: { w: 340, h: 200, label: '0점, 시간 초과, 모두 틀림 표시가 붙은 점수표와 확인한 뒤 반영하겠다는 교사', draw(P) {
        sheet(P, 14, 20, 170, 140, 5, 4);
        chip(P, 24, 30, 54, 22, '0점', 'bad', 11);
        chip(P, 66, 86, 84, 22, '시간 초과', 'warm', 11);
        chip(P, 94, 130, 84, 22, '모두 틀림', 'hi', 11);
        person(P, 266, 196, 'smile', 0.78);
        P.bubble(204, 8, 130, 44, 250, 76);
        P.text(269, 36, '확인한 뒤 반영', { size: 13, weight: 700 });
        P.text(98, 188, '기계가 먼저, 교사가 마지막', { size: 12, c: 'ink2' });
      }},

      /* ---------- L5 문제 그림 ---------- */
      q_allFail: { w: 340, h: 200, label: '다섯 줄 모두 같은 칸에 가위표가 있는 점수표 앞의 놀란 얼굴', draw(P) {
        sheet(P, 14, 20, 200, 150, 5, 3);
        for (let i = 0; i < 5; i++) { tick(P, 48, 35 + i * 30, 7); tick(P, 114, 35 + i * 30, 7); cross(P, 181, 35 + i * 30, 6); }
        person(P, 280, 198, 'wow', 0.66);
        P.text(280, 52, '다섯 명 모두?', { size: 13, weight: 700, c: 'warm' });
        P.text(114, 192, 'p3의 [60] 케이스', { size: 12, c: 'ink2' });
      }},
      q_csvLine: { w: 340, h: 200, label: '스프레드시트 칸에 한글이 깨져 보이고, 코드 메모를 돋보기로 살피는 모습', draw(P) {
        sheet(P, 14, 16, 186, 70, 2, 3);
        P.text(45, 40, '??', { size: 14, weight: 700, c: 'bad' });
        P.text(107, 40, '??', { size: 14, weight: 700, c: 'bad' });
        P.text(45, 75, '??', { size: 14, weight: 700, c: 'bad' });
        P.text(107, 75, '9', { size: 14, weight: 700 });
        P.note(14, 100, 186, 86, { fill: 'hi' });
        [122, 142, 162].forEach((y, i) => P.line(30, y, 180 - i * 20, y, { c: 'ink2', w: 2.4 }));
        lens(P, 216, 140, 50);
        person(P, 292, 198, 'dizzy', 0.6);
        P.text(270, 40, '한글이 깨져요', { size: 13, weight: 700, c: 'warm' });
      }},
      q_studentView: { w: 340, h: 200, label: '학생 휴대폰 화면에 무엇을 보여 줄지 고민하는 교사', draw(P) {
        P.rrect(30, 14, 110, 176, 16, { fill: 'paper', w: 2.2 });
        P.rrect(42, 34, 86, 128, 6, { fill: 'hi', gap: 5 });
        [56, 80, 104, 128].forEach(y => P.line(52, y, 118, y, { c: 'soft', w: 3 }));
        P.circle(85, 176, 12, { c: 'ink2', w: 1.6 });
        ask(P, 85, 98, 30);
        person(P, 262, 196, 'smile', 0.75);
        P.bubble(176, 10, 156, 44, 240, 80);
        P.text(254, 38, '무엇을 보여 줄까?', { size: 13, weight: 700 });
      }},
      q_countBlank: { w: 340, h: 200, label: '케이스 이름마다 바를 정 자처럼 표시를 세는 딕셔너리 상자', draw(P) {
        P.rrect(20, 24, 220, 130, 10, { fill: 'paper', w: 1.8 });
        P.text(36, 54, '"p2 []"', { mono: true, size: 12, anchor: 'start' });
        P.text(36, 94, '"p3 60점"', { mono: true, size: 12, anchor: 'start' });
        P.text(36, 134, '"p2 [100]"', { mono: true, size: 12, anchor: 'start' });
        [[50, 3], [90, 2], [130, 1]].forEach(([y, n]) => { for (let k = 0; k < n; k++) P.line(160 + k * 14, y - 12, 160 + k * 14, y + 4, { c: 'accent', w: 3 }); });
        P.text(130, 184, '없으면 0부터 세기', { size: 12, c: 'ink2' });
        P.face(290, 90, 50, { mood: 'wink' });
      }},

      /* ---------- 형성평가 그림 ---------- */
      t_freeze: { w: 340, h: 200, label: '연수장 책상 위 노트북이 멈춰 빙글빙글 도는 모습과 어지러운 얼굴', draw(P) {
        laptop(P, 30, 40, 160, 100, 'paper');
        P.circle(110, 90, 40, { c: 'accent', w: 3 });
        P.path('M110 70 L110 76', { c: 'accent', w: 3 });
        P.text(110, 176, 'exec(답안)', { mono: true, size: 12, weight: 700 });
        person(P, 272, 196, 'dizzy', 0.75);
        P.text(268, 40, '연수장', { size: 13, weight: 700, c: 'ink2' });
        P.drop(316, 96, 6);
      }},
      t_blank2: { w: 340, h: 200, label: 'subprocess.run 코드의 두 빈칸과 2초 시계', draw(P) {
        term(P, 14, 20, 230, 132, ['subprocess.run(', '  [python, s01.py],', '  input="5\\n",', '  ①=True, text=True,', '  ②=2)'], 11);
        clock(P, 292, 70, 56);
        P.text(292, 126, '2초', { size: 14, weight: 700 });
        P.text(150, 182, '받아 두기, 그리고 끊기', { size: 12, c: 'ink2' });
      }},
      t_flow: { w: 340, h: 200, label: '뒤섞인 카드: 점수표, JSON 쪽지, 시계, 돋보기, 통과·실패 표시', draw(P) {
        scatter(P, [
          (x, y) => sheet(P, x - 32, y - 22, 64, 44, 3, 3),
          (x, y) => lens(P, x - 6, y - 4, 36),
          (x, y) => P.text(x, y + 6, '{ json }', { mono: true, size: 13, weight: 700 }),
          (x, y) => { tick(P, x - 16, y, 9); cross(P, x + 18, y, 8); },
          (x, y) => clock(P, x, y, 40)
        ]);
      }},
      t_exceptLine: { w: 340, h: 200, label: '예외를 잡는 코드 메모를 돋보기로 살피는 얼굴', draw(P) { memo(P, 'paper', 6, 'grade.py'); } },
      t_essay: { w: 340, h: 200, label: '세 문장짜리 서술형 답안 쪽지와 세 가지 채점 도구 앞의 물음표', draw(P) {
        P.note(14, 20, 120, 150, { fill: 'hi' });
        P.text(74, 46, '서술형', { size: 13, weight: 700 });
        [72, 96, 120, 144].forEach((y, i) => P.line(28, y, 120 - (i % 2) * 18, y, { c: 'ink2', w: 2.4 }));
        chip(P, 156, 20, 80, 30, '=', 'sky', 15);
        chip(P, 156, 60, 80, 30, '>_', 'paper', 13);
        chip(P, 156, 100, 80, 30, '기준표', 'warm', 12);
        chip(P, 156, 140, 80, 30, '글자 수', 'hi', 12);
        ask(P, 262, 90, 24);
        person(P, 294, 198, 'wow', 0.5);
      }},
      t_shortAns: { w: 340, h: 200, label: '모양이 조금씩 다른 답 쪽지 세 장과 정답 쪽지 하나', draw(P) {
        P.note(30, 20, 104, 40, { fill: 'paper' });
        P.text(82, 46, 'append()', { mono: true, size: 12 });
        P.note(206, 20, 104, 40, { fill: 'paper' });
        P.text(258, 46, '.append', { mono: true, size: 12 });
        P.rrect(110, 100, 120, 36, 8, { fill: 'good', gap: 5 });
        P.text(170, 124, 'append', { mono: true, size: 13, weight: 700 });
        P.text(170, 92, '정답', { size: 12, weight: 700, c: 'ink2' });
        ask(P, 82, 92, 20);
        ask(P, 258, 92, 20);
        P.text(170, 176, '이것들도 맞게 보고 싶어요', { size: 12, c: 'ink2' });
      }},
      t_args: { w: 340, h: 200, label: '연수장 노트북 화면에 TypeError가 줄줄이 뜬 모습과 어리둥절한 얼굴', draw(P) {
        laptop(P, 24, 30, 180, 110, 'paper');
        [56, 76, 96, 116].forEach(y => P.text(36, y, 'TypeError', { mono: true, size: 11, weight: 700, anchor: 'start', c: 'bad' }));
        P.text(114, 178, '정답 코드까지 모두', { size: 12, c: 'ink2' });
        person(P, 280, 196, 'dizzy', 0.7);
        P.text(280, 36, '11:00 실습', { size: 13, weight: 700, c: 'ink2' });
      }},
      t_realClass: { w: 340, h: 200, label: '학교 건물과 답안 30개, 연수 때 만든 노트북 채점기 사이의 물음표', draw(P) {
        P.path('M20 80 L90 40 L160 80 Z', { fill: 'warm', gap: 6 });
        P.rrect(30, 80, 120, 80, 4, { fill: 'paper', w: 2 });
        [48, 82, 116].forEach(x => P.rect(x, 96, 16, 16, { w: 1.4 }));
        P.rect(80, 130, 20, 30, { w: 1.4 });
        P.text(90, 184, '반 전체 30명', { size: 12, weight: 700 });
        ask(P, 190, 110, 26);
        laptop(P, 222, 70, 100, 64, 'paper');
        P.text(272, 106, 'grader', { mono: true, size: 12, weight: 700 });
        P.text(272, 172, '이대로 써도 될까?', { size: 12, c: 'ink2' });
      }},
      t_rate: { w: 340, h: 200, label: '1 나누기 3이 끝없는 소수가 되어 기대값 0.33과 다른 모습', draw(P) {
        P.text(110, 44, 'rate(1, 3)', { mono: true, size: 15, weight: 700 });
        P.arrow(110, 54, 110, 72, { c: 'accent', w: 2.2, head: 7 });
        P.text(110, 94, '0.3333333333333333', { mono: true, size: 12 });
        P.text(110, 132, '기대 0.33', { size: 14, weight: 700 });
        cross(P, 190, 127, 8);
        P.face(280, 96, 56, { mood: 'wow' });
        P.text(150, 178, '10:00 실습, 정답 코드도 실패', { size: 12, c: 'ink2' });
      }},
      t_attrErr: { w: 340, h: 200, label: '0점 답안의 실행 기록에 AttributeError가 남은 터미널과 돋보기', draw(P) {
        term(P, 14, 24, 230, 96, ['s03.py  p2  0점', 'AttributeError:', "  no attribute 'average'"], 12);
        lens(P, 286, 76, 56);
        P.text(130, 156, '0점인 까닭은?', { size: 14, weight: 700, c: 'warm' });
        P.face(290, 160, 30, { mood: 'wow' });
      }}
    },

    items: [
    /* =================== L1 =================== */
    { id: 'L1', type: 'lesson', title: '자동채점의 세 갈래', sub: '정답 비교·테스트 케이스·루브릭, 사람이 할 일', min: 8, steps: [
      { t: 'say', h: '자동채점은 피드백을 빠르게 돌려주려고 써요', fig: 'f_pile', p: [
        '정보 수업에서 파이썬 과제를 내면 학생 30명 × 3문제, 답안 90개가 쌓여요. 손으로 하나씩 돌려 보면 결과를 돌려주는 데 며칠이 걸리고, 그사이 학생은 무엇이 틀렸는지 잊어요.',
        '<b>자동채점</b>은 정해진 규칙으로 답안을 확인해 <b>점수와 틀린 곳을 바로</b> 알려 주는 프로그램이에요. 반복 확인은 프로그램에 맡기고, 교사는 막힌 학생을 돕는 데 시간을 써요.',
        '연수 2일차 트랙 A의 오전 세 시간(09:00 파이썬 자동채점 기초, 10:00 자동채점 로직 설계, 11:00 문제·정답 데이터 구성)이 이 단원이에요. 오후에는 c4u2에서 채점 결과를 AI 튜터에 이어요.'
      ]},
      { t: 'say', h: '채점 방식은 크게 세 갈래예요', fig: 'f_threeKinds', table: { head: ['방식', '이런 문항', '어떻게'], rows: [
        ['<b>정답 비교</b>', '객관식·단답형', '학생 답을 정답과 비교해요(공백·대소문자를 정리한 뒤)'],
        ['<b>테스트 케이스</b>', '코드 과제', '학생 코드에 입력을 넣어 실행하고, 나온 값을 기대값과 비교해요'],
        ['<b>루브릭 채점</b>', '서술형·설명', '채점 기준표(루브릭)를 주고 LLM이 점수와 이유를 제안해요'] ] }, p: [
        '객관식·단답형은 c2u2에서 학습지로 만든 <code>questions.json</code>의 정답과 비교하면 돼요. 이 단원의 주인공은 코드 과제를 채점하는 <b>테스트 케이스</b>예요.',
        '코드 과제는 학생 코드의 <b>글자</b>를 정답 코드와 비교하지 않아요. 같은 일을 하는 코드는 여러 모양이니까요. 코드를 <b>실행해 본 결과</b>를 비교해요.'
      ]},
      { t: 'say', h: '루브릭 채점은 LLM이 기준표를 보고 점수를 제안해요', fig: 'f_rubric', p: [
        '"반복문이 왜 필요한지 설명하시오" 같은 서술형은 정답이 하나가 아니에요. 그래서 <b>루브릭</b>(기준마다 점수와 설명을 적은 채점 기준표)을 만들고, LLM에게 기준표와 학생 답을 함께 보내 점수와 이유를 받아요.',
        '채점처럼 일정해야 하는 일은 <code>solar-pro4</code>에 <code>reasoning_effort="none"</code>, 낮은 <code>temperature</code>, 구조화 출력(<code>{score, reason}</code>)으로 부르는 게 기본이에요(c1u2·c2u2). 그래도 같은 답에 점수가 달라질 수 있어서 <b>교사 확인</b>이 꼭 필요해요.',
        '이 단원은 테스트 케이스 채점에 집중해요. 루브릭 채점은 c4u2(채점 결과를 튜터와 잇기)와 c5u2(출제·검토·채점 역할 나누기)에서 이어 가요.'
      ]},
      { t: 'say', h: '기계가 할 일과 교사가 할 일을 나눠요', fig: 'f_split', table: { head: ['자동채점에 맡겨요', '교사가 해요'], rows: [
        ['정해진 입력에 정해진 답이 나오는지 확인', '최종 점수 확정, 성적 반영'],
        ['틀린 케이스를 바로 알려 주기', '0점·시간 초과·모두 틀린 케이스 살펴보기'],
        ['30명을 같은 기준으로 똑같이', '풀이 방식·읽기 쉬운 코드 같은 질 판단, 이의 신청'] ] }, p: [
        '자동채점 점수는 <b>초안</b>이에요. 채점기도 사람이 만든 코드라 기대값이나 정리 규칙이 틀릴 수 있어요. 평가에 반영할 때는 학교 평가 규정과 지침을 먼저 확인해요.',
        '학생에게도 미리 알려요. "점수는 채점기가 먼저 매기고, 이상한 건 선생님이 다시 봐요." 그래야 학생이 채점기를 속이려 하기보다 문제를 풀어요.'
      ]},
      { t: 'q', kind: 'mc', fig: 'q_kindPick', q: '세 문항을 자동채점하려 해요. ㉠ "print가 하는 일은?"(4지선다) ㉡ "1부터 n까지 더하는 함수 만들기" ㉢ "for와 while의 차이를 두 문장으로 설명하기". 방식을 바르게 짝지은 것은?',
        opts: ['㉠ 테스트 케이스, ㉡ 정답 비교, ㉢ 루브릭', '㉠ 정답 비교, ㉡ 테스트 케이스, ㉢ 루브릭', '㉠ 정답 비교, ㉡ 루브릭, ㉢ 테스트 케이스', '셋 다 루브릭(LLM)으로 한 번에 채점한다'], a: 1,
        why: '선택형은 <b>정답 비교</b>, 함수 만들기는 실행해 보는 <b>테스트 케이스</b>, 설명은 기준표로 매기는 <b>루브릭</b>이에요.',
        ex: ['객관식은 실행할 코드가 없어요. 고른 번호를 정답과 비교해요. 함수는 거꾸로 실행해 봐야 해요.', '', '함수 과제는 실행 결과로 정확히 매길 수 있어요. 설명 글은 실행할 수 없어요.', '정답이 정해진 문항까지 LLM에 맡기면 돈과 시간이 들고 점수가 흔들릴 수 있어요.'] },
      { t: 'q', kind: 'mc', fig: 'q_codeText', q: '함수 과제를 채점하면서, 교사의 정답 코드와 학생 코드를 <b>글자 그대로</b> 비교해 같으면 맞음으로 처리했어요. 무엇이 문제일까요?',
        opts: ['같은 일을 하는 다른 모양의 코드를 틀렸다고 한다', '글자 비교는 너무 느려서 30명을 다 못 한다', '파이썬에는 글자를 비교하는 방법이 없다', '띄어쓰기만 맞추면 아무 문제가 없다'], a: 0,
        why: '<code>sum(nums)</code>와 <code>for</code> 반복은 생김새가 달라도 결과가 같아요. 코드 과제는 <b>실행 결과</b>를 비교해야 공정해요.',
        ex: ['', '속도 문제가 아니에요. 맞는 코드를 틀렸다고 하는 게 문제예요.', '<code>==</code>로 글자를 비교할 수 있어요. 비교할 대상이 잘못됐어요.', '띄어쓰기를 맞춰도 다른 방법으로 푼 코드는 여전히 틀렸다고 나와요.'] },
      { t: 'q', kind: 'mc', fig: 'q_llmOnly', q: '서술형 10문항을 루브릭과 함께 LLM으로 채점했어요. 받은 점수를 바로 성적에 반영해도 될까요?',
        opts: ['된다. temperature를 낮췄으니 늘 같은 점수가 나온다', '된다. 구조화 출력으로 받았으니 점수가 정확하다', '안 된다. 제안 점수로 보고 교사가 확인한 뒤 반영한다', '안 된다. LLM은 한국어 서술형을 읽지 못한다'], a: 2,
        why: 'LLM 채점은 <b>제안</b>이에요. 같은 답에 점수가 달라지거나 기준을 잘못 읽을 수 있어서, 교사가 확인한 점수만 반영해요.',
        ex: ['낮은 temperature는 흔들림을 줄일 뿐, 늘 같은 점수를 보장하지 않아요.', '구조화 출력은 모양(<code>{score, reason}</code>)을 맞춰 줄 뿐, 점수가 맞는지는 보장하지 않아요.', '', '<code>solar-pro4</code>는 한국어를 잘 다뤄요. 문제는 점수가 흔들릴 수 있다는 거예요.'] },
      { t: 'q', kind: 'line', fig: 'q_roleLine', q: '자동채점과 교사의 역할을 나눈 메모예요. <b>틀린 줄</b>을 눌러 보세요.', lang: 'plain',
        code: src(['객관식 정답 확인 → 자동채점', '함수 과제 결과 확인 → 자동채점', '모두 틀린 케이스 살펴보기 → 교사', '최종 점수 확정 → 자동채점', '이의 신청 받기 → 교사']), a: 3,
        why: '최종 점수는 <b>교사</b>가 확정해요. 자동채점 점수는 초안이고, 이상한 곳을 확인한 뒤 반영해요.' },
      { t: 'sum', pts: ['자동채점은 점수와 틀린 곳을 바로 돌려주는 도구. 반복 확인은 기계, 지도는 교사.', '정답 비교(객관식·단답형), 테스트 케이스(코드 과제, 실행 결과 비교), 루브릭 채점(서술형, LLM 제안 → c4u2·c5u2).', '자동 점수는 초안. 최종 확정·이상한 결과 확인·이의 신청은 교사, 반영 전 학교 평가 규정 확인.'] }
    ]},

    /* =================== L2 =================== */
    { id: 'L2', type: 'lesson', title: '채점 로직 설계', sub: '테스트 케이스, 정리(normalize), 부분 점수', min: 15, steps: [
      { t: 'say', h: '테스트 케이스는 입력과 기대 출력의 짝이에요', fig: 'f_case', table: { head: ['종류', '<code>average(nums)</code>의 예', '왜 넣나'], rows: [
        ['보통 값', '<code>[80, 90]</code> → <code>85</code>', '기본 동작 확인'],
        ['경계 값', '<code>[100]</code> → <code>100</code>', '하나뿐이거나 끝에 걸린 값'],
        ['특이한 값', '<code>[]</code> → <code>0</code>', '빈 리스트에서 0으로 나누기 오류'] ] }, p: [
        '문제 <code>average(nums)</code>는 "점수 리스트의 평균, 빈 리스트면 0"이에요. 테스트 케이스 하나는 <b>넣을 값(입력)</b>과 <b>나와야 할 값(기대 출력)</b>의 짝이에요.',
        '보통 값만 넣으면 대부분 통과해서 실수를 못 찾아요. 학생이 자주 틀리는 <b>경계 값</b>과 <b>특이한 값</b>을 꼭 섞어요. 단, "빈 리스트면 0"처럼 특이한 값의 답은 <b>문제에 미리 적어 둬야</b> 공정해요.'
      ], tip: '코딩한입에서 학점 계산기에 90, 89처럼 경계 점수를 넣어 봤죠? 테스트 케이스도 같은 요령이에요.' },
      { t: 'say', h: '비교하기 전에 양쪽을 같은 규칙으로 정리해요', fig: 'f_normalize', code: { lang: 'py', src: src(['def normalize(s):', '    s = s.strip().lower()', '    parts = s.split(",")', '    parts = [p.strip() for p in parts]', '    return ", ".join(parts)', '', 'print(normalize(" Append,Insert "))', 'print(normalize("append, insert"))']), out: 'append, insert\nappend, insert' }, p: [
        '단답형 "리스트에 값을 더하는 메서드 두 개"의 정답이 <code>append, insert</code>예요. 학생이 <code>" Append,Insert "</code>라고 썼다면 틀린 걸까요? 뜻은 맞고 <b>앞뒤 공백·대소문자·쉼표 뒤 띄어쓰기</b>만 달라요.',
        '그래서 비교 전에 학생 답과 정답을 <b>같은 함수로 정리(normalize)</b>해요. <code>strip()</code>으로 앞뒤 공백을, <code>lower()</code>로 대소문자를 없애고, 쉼표로 나눠 <code>", "</code>로 다시 이어 띄어쓰기를 맞춰요.',
        '정리 규칙은 <b>문제마다</b> 정해요. "Hello, World!를 똑같이 출력하기"처럼 형식 자체가 목표라면 정리하지 않아요. 정한 규칙은 학생에게도 미리 알려요.'
      ]},
      { t: 'say', h: '실수는 ==보다 오차를 허용해 비교해요', code: { lang: 'py', src: src(['print(0.1 + 0.2 == 0.3)', '', 'got, want = 0.1 + 0.2, 0.3', 'print(abs(got - want) < 1e-9)']), out: 'False\nTrue' }, p: [
        '실수(float)는 컴퓨터 안에서 아주 조금 어긋날 수 있어요. <code>0.1 + 0.2</code>는 <code>0.30000000000000004</code>라서 <code>==</code>로 비교하면 맞는 답도 틀렸다고 나와요.',
        '그래서 기대값이 실수인 케이스는 <b>차이가 아주 작으면 같다</b>고 봐요. <code>abs(got - want) &lt; 1e-9</code>처럼요. 문제에 "소수 둘째 자리에서 반올림"을 적어 두고 <code>round()</code>로 맞춰 비교하는 방법도 있어요.'
      ]},
      { t: 'say', h: '부분 점수를 주고, 실패는 까닭과 함께 남겨요', fig: 'f_partial', code: { lang: 'py', src: src(['def run_case(func, case):', '    try:', '        got = func(*case["args"])', '    except Exception as e:', '        return False, f"오류: {e}"', '    return got == case["expected"], got']) }, p: [
        '케이스 셋 중 둘을 통과했다면 0점보다 "어디까지 했는지"를 보여 주는 게 좋아요. 보통 <b>배점 × 통과 비율</b>로 주고, 경계 케이스에 무게를 더 주기도 해요.',
        '학생 함수가 오류를 내도 채점기가 멈추면 안 돼요. <code>try/except</code>로 잡아 그 케이스만 실패로 적고 다음으로 가요. <code>*case["args"]</code>는 인자 목록을 풀어 함수에 넣는 문법이에요.',
        '실패한 케이스는 <b>입력·기대값·실제값</b>을 함께 남겨요. 학생에게는 고칠 실마리, c4u2의 AI 튜터에게는 힌트 재료가 돼요.'
      ], tip: '케이스를 전부 공개하면 케이스 값만 맞추는 코드(<code>if a == 1: return 3</code>)가 나올 수 있어요. 예시 케이스는 공개하고, 채점에는 공개하지 않은 <b>숨은 케이스</b>를 더 써요.' },
      { t: 'try', lang: 'py', h: '채점 함수를 돌려 봐요', p: '학생 함수 <code>student_evens</code>는 start부터 end까지(end 포함) 짝수를 쉼표로 이어 돌려줘야 해요. 실행해 케이스별 통과·실패와 부분 점수를 본 뒤, 학생 함수의 <code>range(start, end)</code>를 <code>range(start, end + 1)</code>로 고쳐 다시 돌려 보세요.',
        src: src([
          'def normalize(s):',
          '    s = s.strip().lower()',
          '    parts = s.split(",")',
          '    parts = [p.strip() for p in parts]',
          '    return ", ".join(parts)',
          '',
          '# 학생 답 흉내: start~end 짝수 잇기',
          'def student_evens(start, end):',
          '    nums = range(start, end)',
          '    return ",".join(str(n) for n in nums',
          '                    if n % 2 == 0)',
          '',
          'cases = [',
          '    {"args": [1, 5], "expected": "2, 4"},',
          '    {"args": [2, 8],',
          '     "expected": "2, 4, 6, 8"},',
          '    {"args": [7, 7], "expected": ""},',
          ']',
          'points = 6',
          'ok = 0',
          'for i, c in enumerate(cases, 1):',
          '    a, b = c["args"]',
          '    got = student_evens(a, b)',
          '    want = c["expected"]',
          '    if normalize(got) == normalize(want):',
          '        ok += 1',
          '        print(f"케이스 {i}: 통과")',
          '    else:',
          '        print(f"케이스 {i}: 실패 → {got}")',
          'score = points * ok // len(cases)',
          'print(f"통과 {ok}/{len(cases)}, {score}점")']),
        note: '연습장은 학생 파일을 불러올 수 없어서, 학생 답을 미리 만든 함수로 흉내 냈어요. normalize를 빼고 == 로만 비교하면 몇 점이 될까요?' },
      { t: 'q', kind: 'mc', fig: 'q_norm', q: '정답이 <code>"python, java"</code>인 단답형이에요. 레슨의 <code>normalize</code>로 양쪽을 정리한 뒤 비교할 때, <b>틀렸다고</b> 나오는 학생 답은?',
        opts: ['<code>"Python,Java"</code>', '<code>" python , java "</code>', '<code>"PYTHON, JAVA"</code>', '<code>"python java"</code>'], a: 3,
        why: '<code>normalize</code>는 쉼표를 기준으로 나눠 다시 이어요. 쉼표가 아예 없는 <code>"python java"</code>는 <code>"python java"</code> 그대로라 정답과 달라요.',
        ex: ['쉼표 뒤 띄어쓰기와 대소문자는 정리돼서 <code>"python, java"</code>가 돼요.', '쉼표 앞뒤 공백까지 조각마다 <code>strip()</code>으로 지워져요.', '<code>lower()</code>가 대문자를 모두 소문자로 바꿔요.', ''] },
      { t: 'q', kind: 'mc', mono: true, fig: 'q_double', q: '실행하면 무엇이 나올까요?', lang: 'py',
        code: src(['def student_double(n):', '    return n + n if n > 0 else n', '', 'cases = [(3, 6), (0, 0), (-2, -4)]', 'ok = 0', 'for n, want in cases:', '    if student_double(n) == want:', '        ok += 1', 'print(f"{ok}/{len(cases)}")']),
        opts: ['3/3', '2/3', '1/3', '0/3'], a: 1,
        why: '3은 6, 0은 0이라 통과해요. -2는 <code>else</code>로 가서 -2를 그대로 돌려줘 기대값 -4와 달라요. 음수 같은 특이한 값을 넣어야 잡히는 실수예요.',
        ex: ['-2 케이스에서 학생 함수는 -2를 돌려줘요. 기대값은 -4예요.', '', '0은 <code>else</code>로 가지만 0을 돌려줘서 기대값 0과 같아요.', '3과 0 케이스는 통과해요.'] },
      { t: 'q', kind: 'order', fig: 'q_caseOrder', q: '케이스 하나를 채점하는 순서로 쌓아 보세요.',
        items: ['케이스에서 입력(args)과 기대값을 꺼낸다', '입력을 넣어 학생 함수를 부른다(오류는 잡는다)', '나온 값과 기대값을 같은 규칙으로 정리한다', '둘을 비교해 통과·실패를 기록한다', '통과한 케이스 수로 부분 점수를 계산한다'],
        why: '입력이 있어야 함수를 부르고, 나온 값이 있어야 정리·비교를 하고, 통과 기록이 모여야 점수를 내요.' },
      { t: 'q', kind: 'blank', fig: 'q_floatBlank', q: '평균처럼 실수가 나오는 케이스를 비교하는 줄이에요. 빈칸에 들어갈 함수는?', lang: 'py', code: 'ok = [[1]](got - want) < 1e-9',
        opts: ['abs', 'round', 'int', 'len'], a: 0,
        why: '<code>abs</code>는 절댓값이에요. 차이가 음수여도 크기만 보고, 아주 작으면 같다고 봐요.',
        ex: ['', '<code>round(got - want)</code>는 0.4만큼 달라도 0이 돼서 틀린 답까지 맞다고 해요.', '<code>int</code>도 소수 부분을 버려 0.9만큼 달라도 0이 돼요.', '<code>len</code>은 길이를 재는 함수라 숫자에 쓰면 오류가 나요.'] },
      { t: 'q', kind: 'mc', fig: 'q_hardcode', q: '예시 케이스 3개를 모두 공개했더니, 한 학생이 케이스 값만 <code>if</code>로 외운 답안을 냈어요. 이걸 막는 설계로 가장 알맞은 것은?',
        opts: ['케이스를 하나로 줄여 외울 게 없게 한다', 'normalize를 더 세게 걸어 비교한다', '공개하지 않은 숨은 케이스를 채점에 더 쓴다', '<code>if</code>가 들어간 답안은 모두 0점 처리한다'], a: 2,
        why: '예시 케이스는 이해를 돕게 공개하고, 채점에는 <b>숨은 케이스</b>를 더 써요. 외운 답은 처음 보는 입력에서 틀려요.',
        ex: ['케이스가 적을수록 외우기는 더 쉬워요.', '정리는 표기 차이를 맞출 뿐, 외운 답을 가려내지 못해요.', '', '<code>if</code>는 정상적인 풀이에도 쓰여요. 맞게 푼 학생까지 0점이 돼요.'] },
      { t: 'sum', pts: ['테스트 케이스 = 입력 + 기대 출력. 보통 값에 경계 값·특이한 값을 섞고, 특이한 값의 답은 문제에 미리 적는다.', '비교 전 정리(normalize): 앞뒤 공백·대소문자·쉼표 뒤 띄어쓰기. 형식이 목표인 문제는 정리하지 않는다. 실수는 abs(got - want)로 오차를 허용한다.', '부분 점수는 배점 × 통과 비율. 오류도 실패로 잡아 입력·기대값·실제값을 남기고, 채점에는 숨은 케이스도 쓴다.'] }
    ]},

    /* =================== QA =================== */
    { id: 'QA', type: 'quiz', title: '헷갈림 퀴즈 ①', sub: '정답 비교와 테스트 케이스, 부분 점수, 정리', min: 3, steps: [
      { t: 'q', kind: 'mc', fig: 'qa_twoWays', q: '단답형 "리스트 길이를 구하는 내장 함수는?"(정답 <code>len</code>)과 코드 과제 "리스트 길이를 구하는 함수 만들기"를 채점해요. 바른 짝은?',
        opts: ['단답형은 정답 비교, 코드 과제는 실행 결과 비교', '둘 다 학생이 쓴 글자를 정답 글자와 비교한다', '단답형은 학생 답을 실행해 보고, 코드 과제는 글자를 비교한다', '둘 다 LLM 루브릭 채점으로 해야 공정하다'], a: 0,
        why: '단답형은 정해진 낱말이라 정리한 뒤 <b>정답 비교</b>, 코드 과제는 여러 모양으로 풀 수 있어 <b>실행 결과</b>를 비교해요.',
        ex: ['', '코드 과제를 글자로 비교하면 다르게 푼 맞는 코드가 틀려요.', '거꾸로예요. 단답형 낱말은 실행할 코드가 아니에요.', '정답이 정해진 문항은 비교나 실행으로 정확히 매길 수 있어요.'] },
      { t: 'q', kind: 'mc', fig: 'qa_weight', q: '배점 6점 문제에 케이스가 넷이에요. 보통 케이스 둘은 각 1점, 경계 케이스 둘은 각 2점이에요. 보통 둘과 경계 하나를 통과하면 몇 점일까요?',
        opts: ['3점', '4점', '4.5점', '6점'], a: 1,
        why: '보통 둘(1 + 1)과 경계 하나(2)를 더해 <b>4점</b>이에요. 무게가 다르면 통과한 케이스의 점수를 더해요.',
        ex: ['통과한 케이스 수(3)를 그대로 점수로 셌어요. 무게가 달라요.', '', '배점 × 통과 비율(6 × 3/4)은 케이스 무게가 모두 같을 때의 계산이에요.', '경계 케이스 하나를 틀렸어요.'] },
      { t: 'q', kind: 'mc', fig: 'qa_overNorm', q: '"Hello, World!를 대소문자까지 똑같이 출력하기" 문제에 레슨의 <code>normalize</code>를 그대로 썼어요. 어떤 일이 생길까요?',
        opts: ['아무 문제 없다. 정리는 늘 많이 할수록 공정하다', '쉼표 뒤 띄어쓰기가 있어서 정답도 틀렸다고 나온다', '<code>hello, world!</code>라고 쓴 답도 맞았다고 나온다', 'normalize가 느낌표를 지워서 모든 답이 틀린다'], a: 2,
        why: '<code>lower()</code>가 대소문자를 없애서, 문제의 목표(대소문자까지 똑같이)를 어긴 답도 통과해요. 정리 규칙은 문제의 목표에 맞춰 정해요.',
        ex: ['정리를 많이 할수록 문제의 목표까지 지워질 수 있어요.', '정답도 같은 규칙으로 정리되니 정답은 통과해요. 문제는 틀린 답도 통과한다는 거예요.', '', 'normalize는 공백·대소문자·쉼표 뒤 띄어쓰기만 다뤄요. 느낌표는 그대로예요.'] }
    ]},

    /* =================== L3 =================== */
    { id: 'L3', type: 'lesson', title: '문제·정답 데이터 만들기', sub: 'problems.json 모양, args 감싸기, questions.json과 함께', min: 16, steps: [
      { t: 'say', h: '문제는 코드 밖, 데이터 파일에 따로 둬요', fig: 'f_dataSplit', p: [
        '문제와 케이스를 <code>grade.py</code> 안에 적어 두면 문제 하나 고칠 때마다 채점 코드를 건드려야 해요. 그래서 문제·정답은 <b><code>problems.json</code></b>에, 채점 방법은 <code>grade.py</code>에 나눠요.',
        '나눠 두면 다음 학기·다른 반에 파일만 바꿔 쓰고, 동료 교사와 문제를 나누고, c4u2의 AI 튜터도 같은 파일에서 힌트를 읽어요.',
        'JSON은 c2u2에서 Information Extract 결과를 <code>json.loads</code>로 읽을 때 만났죠. 파일은 <code>json.load</code>로 읽으면 리스트·딕셔너리가 돼요.'
      ]},
      { t: 'say', h: 'problems.json은 문제마다 여섯 칸이에요', code: { lang: 'json', src: src(['{', '  "id": "p1",', '  "title": "두 수의 합",', '  "func": "add",', '  "cases": [', '    {"args": [1, 2], "expected": 3},', '    {"args": [-1, 1], "expected": 0}', '  ],', '  "points": 3,', '  "hints": ["return을 썼나요?"]', '}']) }, table: { head: ['칸', '뜻'], rows: [
        ['<code>id</code>', '문제 번호. 결과표와 튜터가 이 이름으로 가리켜요'],
        ['<code>title</code>', '학생에게 보이는 문제. 조건까지 적어요("빈 리스트는 0")'],
        ['<code>func</code>', '학생이 만들 함수 이름. 채점기가 이 이름으로 불러요'],
        ['<code>cases</code>', '케이스 목록. <code>args</code>는 넣을 인자 목록, <code>expected</code>는 기대값'],
        ['<code>points</code>', '배점'],
        ['<code>hints</code>', '단계별 힌트. c4u2의 튜터가 써요'] ] }, p: [
        '위는 문제 하나예요. <code>problems.json</code>은 이런 문제들을 <code>[ ]</code>로 묶은 목록이에요.',
        '키 이름은 내가 정하기 나름이지만, 한 번 정하면 <code>grade.py</code>·튜터·에이전트에게 하는 부탁에서 <b>똑같이</b> 써요. 이 단원은 <code>id, title, func, cases, points, hints</code>로 맞춰요.'
      ], tip: 'JSON은 큰따옴표만 쓰고, <code>true</code>·<code>false</code>·<code>null</code>은 소문자, 마지막 항목 뒤에는 쉼표를 붙이지 않아요. 파이썬의 <code>True</code>나 작은따옴표를 그대로 쓰면 읽다가 오류가 나요.' },
      { t: 'say', h: 'args는 인자 목록이라, 리스트 하나도 한 번 더 감싸요', fig: 'f_argsWrap', code: { lang: 'plain', src: src(['add(1, 2)          ← "args": [1, 2]', 'pass_fail(60)      ← "args": [60]', 'average([80, 90])  ← "args": [[80, 90]]']) }, p: [
        '<code>args</code>는 함수 괄호 안에 들어갈 값을 <b>차례대로</b> 담은 목록이에요. <code>add(1, 2)</code>는 <code>[1, 2]</code>, 값이 하나인 <code>pass_fail(60)</code>도 <code>[60]</code>처럼 목록으로 적어요.',
        '리스트 하나를 받는 <code>average</code>는 조심해요. <code>[80, 90]</code>라고 적으면 <code>average(80, 90)</code>으로 불려 오류가 나요. 리스트를 통째로 넣으려면 <code>[[80, 90]]</code>처럼 <b>한 번 더 감싸요</b>.',
        '채점기는 <code>func(*case["args"])</code>로 목록을 풀어 넣어요. 그래서 인자 수가 다른 문제도 같은 코드 한 줄로 불러요.'
      ]},
      { t: 'say', h: 'c2u2의 questions.json과 한 채점기에서 함께 써요', fig: 'f_twoFiles', code: { lang: 'py', src: src(['import json', '', 'def load(p):', '    with open(p, encoding="utf-8") as f:', '        return json.load(f)', '', '# c2u2에서 만든 객관식·단답형', 'quiz = load("questions.json")["items"]', 'code = load("problems.json")']) }, table: { head: ['문항', '어느 파일', '채점 방식'], rows: [
        ['객관식', '<code>questions.json</code>', '고른 번호를 정답과 비교'],
        ['단답형', '<code>questions.json</code>', '정리한 뒤 정답 비교(허용 답을 여러 개 둘 수 있어요)'],
        ['코드', '<code>problems.json</code>', '테스트 케이스'] ] }, p: [
        'c2u2에서 학습지를 Information Extract로 뽑아 만든 <code>questions.json</code>에는 <code>items</code> 목록 안에 객관식·단답형 문항(<code>no, question, choices, answer, points</code>)이 있어요. 두 파일을 함께 읽어 점수를 <b>한 표</b>에 더해요.',
        '두 파일은 키 이름이 달라요(<code>answer</code>·<code>points</code> 대 <code>cases</code>·<code>points</code>). 내 스키마를 바꿨다면 그 이름대로 읽어요. 처음 한 번은 Cursor 에이전트에게 두 파일을 보여 주고 "둘을 함께 읽는 함수"를 부탁하면 빨라요.'
      ]},
      { t: 'sim', h: '에이전트에게 케이스를 더 만들게 해요', p: 'IDE 창에서 Agent에게 p2의 경계 케이스를 부탁하고, 바뀐 내용을 받아들인 뒤 정답 함수로 기대값을 확인해 봐요.',
        scene: { win: 'ide', folder: 'grader', files: L3_FILES, open: 'problems.json', lang: 'json', code: P2_JSON, panel: EMPTY_PANEL, term: [] },
        steps: [
          { goal: '에이전트에게 부탁을 적어요', type: AGENT_Q, into: 'chat',
            say: '무엇을(p2 경계 케이스), 어떻게(정답 함수로 기대값), 하지 말 것(다른 문제)까지 적었어요.' },
          { goal: '보내요', click: 'btn:send',
            then: { panel: panel({ msgs: [{ me: AGENT_Q }, { ai: AGENT_A }] }), diff: { line: 6, del: [CASE_1], add: CASES_NEW } },
            say: '편집기에 더한 줄(초록)이 떴어요. 커서한입에서 본 대로, 에이전트의 수정은 이미 파일에 들어가 있어요.' },
          { goal: '바뀐 내용을 읽고 Accept를 눌러요', click: 'btn:accept', then: { diff: null, code: P2_JSON_NEW },
            say: '빈 리스트 → 0은 문제 title에 적힌 조건과 맞아요. 이제 p2도 보통 값·경계 값·특이한 값이 하나씩이에요.' },
          { goal: '터미널에서 기대값을 확인해요', type: 'python check_cases.py', into: 'term',
            then: { term: ['$ python check_cases.py', 'p1 add: 3개 모두 일치', 'p2 average: 3개 모두 일치', 'p3 pass_fail: 3개 모두 일치'], prompt: '' },
            say: '<code>check_cases.py</code>는 내 정답 함수로 모든 기대값을 다시 계산해요. 하나라도 다르면 케이스나 정답 함수 중 하나가 틀린 거예요.' } ],
        end: 'AI가 만든 케이스도 기대값은 내 정답 코드로 확인해요.' },
      { t: 'try', lang: 'py', h: '문제 데이터를 JSON으로 봐요', p: '문제 하나를 딕셔너리로 만들고 <code>json.dumps</code>로 바꿔 봐요. <code>ensure_ascii=False</code>가 있을 때와 없을 때 한글이 어떻게 보이는지, <code>args</code>가 어떻게 겹쳐 있는지 확인해요.',
        src: src([
          'import json',
          '',
          'p = {',
          '    "id": "p2",',
          '    "title": "점수 평균(빈 리스트는 0)",',
          '    "func": "average",',
          '    "cases": [{"args": [[80, 90]],',
          '               "expected": 85}],',
          '    "points": 3,',
          '    "hints": ["sum과 len을 떠올려요"],',
          '}',
          'print(json.dumps(p["title"]))',
          'print(json.dumps(p, ensure_ascii=False,',
          '                 indent=2))',
          '',
          '# c2u2 questions.json 흉내',
          'quiz = {"title": "3단원 형성평가", "items": [',
          '    {"no": 1, "answer": "2", "points": 2},',
          '    {"no": 2, "answer": "len", "points": 2}]}',
          'items = quiz["items"]',
          'total = sum(q["points"] for q in items)',
          'total += p["points"]',
          'print(f"문항 {len(items) + 1}개, 만점 {total}점")']),
        note: 'questions.json은 c2u2에서 만든 모양(items 안에 no·question·choices·answer·points)을 줄여 흉내 냈어요. 내 스키마를 바꿨다면 그 키 이름으로 읽어요.' },
      { t: 'q', kind: 'mc', fig: 'q_argsWrong', q: '<code>average</code> 문제의 케이스를 <code>{"args": [80, 90], "expected": 85}</code>로 적었더니, 정답 코드로 돌려도 오류가 나요. 왜일까요?',
        opts: ['<code>average(80, 90)</code>으로 불려서', 'JSON에서는 85를 85.0으로 적어야 해서', '<code>expected</code>는 글자라서 "85"로 적어야 해서', '<code>args</code>에는 숫자를 하나만 넣을 수 있어서'], a: 0,
        why: '<code>args</code>는 인자 목록이라 <code>[80, 90]</code>은 인자 두 개로 풀려요. 리스트 하나를 넣으려면 <code>[[80, 90]]</code>처럼 감싸요.',
        ex: ['', '파이썬에서 <code>85 == 85.0</code>은 True라서 문제가 아니에요.', '평균은 숫자로 돌려주니 기대값도 숫자 85가 맞아요.', '<code>add</code>처럼 인자가 둘이면 <code>[1, 2]</code>로 두 개를 넣어요.'] },
      { t: 'q', kind: 'line', fig: 'q_jsonLine', q: '<code>problems.json</code>을 읽다가 오류가 났어요. <b>틀린 줄</b>을 눌러 보세요.', lang: 'json',
        code: src(['{', '  "id": "p3",', '  "func": "pass_fail",', '  "cases": [', '    {"args": [60], "expected": "통과"}', '  ],', '  "points": 3,', "  \"hints\": ['60점은 통과일까요?']", '}']), a: 7,
        why: 'JSON의 글자는 <b>큰따옴표</b>로만 감싸요. 작은따옴표는 파이썬에서는 되지만 JSON에서는 오류예요.' },
      { t: 'q', kind: 'mc', fig: 'q_whySplit', q: '동료 선생님이 "문제랑 케이스를 그냥 grade.py 안에 적으면 파일 하나라 편하지 않아요?"라고 물어요. <code>problems.json</code>으로 나누는 까닭으로 가장 알맞은 것은?',
        opts: ['JSON 파일은 파이썬 파일보다 빨리 실행되어서', '문제만 바꿔 끼우고, 튜터·다른 반에서 다시 써서', '파이썬 코드 안에는 리스트와 딕셔너리를 적을 수 없어서', 'JSON으로 적으면 학생이 문제를 볼 수 없어서'], a: 1,
        why: '데이터와 코드를 나누면 문제만 바꿔 끼우고, 같은 파일을 튜터(c4u2)·다른 반·동료와 함께 써요.',
        ex: ['JSON은 실행되는 파일이 아니라 읽히는 데이터예요.', '', '파이썬 안에도 적을 수 있어요. 나누는 까닭은 고치고 다시 쓰기 쉬워서예요.', '파일 형식이 학생에게 보이고 말고를 정하지 않아요.'] },
      { t: 'q', kind: 'mc', fig: 'q_agentCase', q: '에이전트에게 케이스를 더 만들어 달라고 했더니 <code>{"args": [[70, 75]], "expected": 72}</code>가 들어왔어요. 어떻게 할까요?',
        opts: ['에이전트가 계산했으니 그대로 채점에 쓴다', '일단 채점해 보고 학생들이 틀리면 그때 고친다', '정답 함수로 다시 계산해 72.5로 고친다', '소수가 나오는 케이스는 아예 빼 버린다'], a: 2,
        why: '(70 + 75) ÷ 2 = 72.5예요. AI가 만든 기대값은 틀릴 수 있으니 <b>정답 함수로 다시 계산</b>해 맞춰요(<code>check_cases.py</code>).',
        ex: ['에이전트도 계산을 틀릴 수 있어요. 틀린 기대값이면 맞는 답안이 0점이 돼요.', '그러면 맞게 푼 학생이 먼저 억울하게 틀려요.', '', '소수 평균은 학생이 자주 만나는 상황이라 좋은 케이스예요. 고쳐서 써요.'] },
      { t: 'sum', pts: ['problems.json: 문제마다 id, title, func, cases[{args, expected}], points, hints. 문제는 데이터, 채점 방법은 grade.py.', 'args는 인자 목록. 리스트 하나를 받는 함수는 [[80, 90]]처럼 한 번 더 감싼다. JSON은 큰따옴표·소문자 true/false/null·끝 쉼표 금지.', 'questions.json(정답 비교)과 problems.json(테스트 케이스)을 한 채점기에서 읽는다. 에이전트가 만든 케이스도 정답 함수로 기대값을 확인한다.'] }
    ]},

    /* =================== L4 =================== */
    { id: 'L4', type: 'lesson', title: '학생 코드를 안전하게 실행하기', sub: '함수 호출과 표준 입출력, 시간 제한, 위험한 코드', min: 14, steps: [
      { t: 'say', h: '학생 코드를 채점하는 두 가지 길', fig: 'f_twoWays', table: { head: ['', '함수 호출 채점', '표준 입출력 채점'], rows: [
        ['학생이 내는 것', '함수(<code>def average(nums):</code>)', '프로그램 전체(<code>input()</code>으로 받고 <code>print()</code>로 출력)'],
        ['채점기가 보는 것', '함수가 <b>돌려준 값</b>', '프로그램이 <b>출력한 글</b>'],
        ['좋은 점', '값으로 비교해 정확해요(<code>85 == 85.0</code>도 맞음)', '코딩한입식 input·print 과제를 그대로 써요'],
        ['조심할 점', '학생 파일을 불러와야 해요', '출력 형식과 <code>input()</code> 안내 문구가 섞여요'] ] }, p: [
        '<code>problems.json</code>은 함수 호출 채점용이에요. 표준 입출력 채점은 케이스를 "넣을 글 <code>5</code>, 나와야 할 글 <code>15</code>"처럼 글자로 적어요.',
        '<code>input("숫자: ")</code>처럼 안내 문구를 쓰면 그 글도 출력에 섞여 나와요. 표준 입출력 문제에는 "안내 문구 없이 <code>input()</code>만", "답만 출력" 같은 규칙을 적어 둬요.'
      ]},
      { t: 'say', h: 'importlib·exec는 학생 코드를 채점기 안에서 돌려요', fig: 'f_rooms', code: { lang: 'py', src: src(['import importlib', 'mod = importlib.import_module("s01")', 'print(mod.add(1, 2))  # 함수 부르기', '', 'src = open("s01.py").read()', 'ns = {}', 'exec(src, ns)  # 글자를 코드로 실행', 'print(ns["add"](1, 2))']) }, p: [
        '가장 쉬운 방법은 학생 파일을 모듈처럼 불러오는 <code>importlib</code>나, 글자로 읽은 코드를 그대로 실행하는 <code>exec</code>예요. 몇 줄이면 학생 함수를 부를 수 있어요.',
        '문제는 학생 코드가 <b>채점기와 같은 프로그램 안에서</b> 돈다는 거예요. 불러오는 순간 파일 맨 위 코드가 실행되고, 거기 끝나지 않는 반복이 있으면 채점기 전체가 멈춰요. 파일을 지우는 코드도 내 권한 그대로 실행돼요.',
        '그래서 채점기 안에서 바로 쓰는 건 내가 쓴 코드나 믿을 수 있는 코드에만 해요. 학생 코드는 <b>따로 떼어</b> 돌려요.'
      ]},
      { t: 'say', h: 'subprocess는 학생 코드를 다른 프로그램으로 따로 돌려요', code: { lang: 'py', src: src(['import subprocess, sys', '', 'r = subprocess.run(', '    [sys.executable, "s01.py"],', '    input="5\\n",', '    capture_output=True,', '    text=True,', '    timeout=2,', ')', 'print(r.returncode)  # 0이면 정상 끝', 'print(r.stdout)      # 학생이 print한 글']) }, p: [
        '<code>subprocess.run</code>은 학생 파일을 <b>새 파이썬 프로그램</b>으로 실행해요. 학생 코드가 멈추거나 오류를 내도 채점기는 멀쩡해요.',
        '<code>input</code>은 학생 프로그램의 <code>input()</code>에 넣을 글, <code>capture_output=True</code>는 출력을 화면 대신 받아 두기, <code>text=True</code>는 글자(str)로 받기예요. 결과의 <code>stdout</code>에 출력, <code>stderr</code>에 오류 메시지, <code>returncode</code>에 끝난 상태(0이면 정상)가 담겨요.',
        '함수 과제도 같은 방법으로 해요. 학생 함수를 불러 결과를 출력하는 작은 실행 파일(<code>runner.py</code>)을 subprocess로 돌리고, 채점기는 그 출력만 받아요. <code>runner.py</code> 안에서 <code>importlib</code>를 써도, 멈추면 timeout으로 그 프로그램만 끝내요.'
      ], tip: '<code>sys.executable</code>은 지금 채점기를 돌리는 파이썬(가상 환경 포함)의 경로예요. Mac의 <code>python3</code>, Windows의 <code>python</code>처럼 이름이 달라 헷갈릴 일이 없어요.' },
      { t: 'say', h: 'timeout으로 끝나지 않는 반복을 끊어요', fig: 'f_timer', code: { lang: 'py', src: src(['try:', '    r = subprocess.run(cmd, input=data,', '        capture_output=True, text=True,', '        timeout=2)', 'except subprocess.TimeoutExpired:', '    result = "시간 초과"', 'else:', '    ok = r.stdout.strip() == want', '    result = "통과" if ok else "실패"']) }, p: [
        '<code>timeout=2</code>를 주면 2초 안에 끝나지 않은 학생 프로그램을 <b>끝내고</b> <code>TimeoutExpired</code> 예외를 내요. 잡아서 "시간 초과"로 적고 다음 학생으로 넘어가요.',
        '시간 제한이 없으면 <code>while</code> 조건을 잘못 쓴 답안 하나 때문에 30명 채점이 끝나지 않아요. 보통 수업 과제는 1~2초면 넉넉해요.',
        '<code>returncode</code>가 0이 아니면 학생 코드에서 오류가 난 거예요. <code>stderr</code>의 마지막 줄(예: <code>ValueError: …</code>)을 결과에 같이 남기면 학생이 고치기 쉬워요.'
      ]},
      { t: 'say', h: '시간 제한은 파일 지우기를 막지 못해요: 안전 원칙', fig: 'f_safety', table: { head: ['원칙', '왜'], rows: [
        ['별도 폴더(복사본)에서 실행: <code>cwd="sandbox"</code>', '학생 코드가 만들거나 지우는 파일이 채점 파일과 섞이지 않게'],
        ['시간 제한: <code>timeout=2</code>', '끝나지 않는 반복 하나가 채점 전체를 멈추지 않게'],
        ['돌리기 전에 훑어보기', '<code>os.remove</code>, <code>shutil</code>, <code>open(…, "w")</code>, <code>subprocess</code>처럼 파일·명령을 건드리는 줄'],
        ['실제 운영은 격리된 곳에서', '반 전체·평가 반영은 격리된 채점 서버나 학교에서 검증된 서비스로'] ] }, p: [
        'subprocess로 떼어 돌려도 학생 프로그램은 <b>내 컴퓨터 계정의 권한</b>으로 돌아요. 폴더를 바꿔도 다른 폴더의 파일을 읽거나 지울 수 있고, 2초면 충분해요. timeout은 시간만 막아요.',
        '그래서 내 노트북의 채점기는 <b>연수·연습용</b>이에요. 반 전체 코드를 받아 평가에 반영할 때는 내 파일과 떨어진 격리된 채점 서버나 검증된 서비스를 써요. 어떤 서비스를 쓸지는 학교·교육청 지침을 먼저 확인해요.'
      ]},
      { t: 'sim', h: '표준 입출력 채점을 돌려 봐요', p: 'IDE 창 아래 터미널에서 run_io.py를 돌리고, 실패한 답안을 열어 까닭을 찾아봐요. 문제는 "n을 입력받아 1부터 n까지의 합만 출력"이에요.',
        scene: { win: 'ide', folder: 'grader', files: ['run_io.py', 'sandbox/', 'sandbox/s1.py', 'sandbox/s2.py', 'sandbox/s3.py'], open: 'run_io.py', lang: 'py', code: RUN_IO, term: [] },
        steps: [
          { goal: '터미널에 <code>python run_io.py</code>를 쳐요', type: 'python run_io.py', into: 'term',
            then: { term: ['$ python run_io.py', 's1.py 통과', 's2.py 실패: 합계: 15', 's3.py 시간 초과(2초)'], prompt: '' },
            say: '세 답안을 하나씩 따로 돌렸어요. s3.py는 2초가 지나 끊겼지만 채점기는 끝까지 왔어요.' },
          { goal: '시간 초과가 난 <code>s3.py</code>를 열어요', click: 'file:sandbox/s3.py', then: { open: 'sandbox/s3.py', code: S3 },
            say: '<code>while</code> 안에서 <code>i</code>를 늘리지 않아 끝나지 않아요. timeout이 없었다면 채점기도 함께 멈췄을 거예요.' },
          { goal: '실패한 <code>s2.py</code>도 열어요', click: 'file:sandbox/s2.py', then: { open: 'sandbox/s2.py', code: S2 },
            say: '계산은 맞는데 "합계:"를 붙여 출력했어요. 문제에 "답만 출력"을 적어 뒀는지 보고, 피드백에 출력 형식을 알려 줘요.' } ],
        end: '시간 초과·실패 까닭이 남아야 교사가 다시 볼 수 있어요.' },
      { t: 'q', kind: 'mc', fig: 'q_import', q: '학생 파일 맨 위에 <code>print("안녕")</code>과 <code>input()</code>이 있어요. 채점기가 <code>importlib</code>로 이 파일을 불러오자, 채점기가 입력을 기다리며 멈췄어요. 왜일까요?',
        opts: ['<code>importlib</code>는 함수만 골라 불러오는데 함수를 못 찾아서', '<code>print</code>가 있는 파일은 불러올 수 없어서', '불러오는 순간 파일 맨 위 코드가 채점기 안에서 실행돼서', '<code>importlib</code>가 함수를 부를 때마다 입력을 묻게 되어 있어서'], a: 2,
        why: '모듈을 불러오면 파일의 맨 위 코드가 모두 실행돼요. <code>input()</code>이 채점기 안에서 돌아 입력을 기다려요. 학생 코드는 subprocess로 따로 돌려요.',
        ex: ['함수만 골라 불러오지 않아요. 파일 전체가 실행돼요.', '<code>print</code>가 있어도 불러올 수 있어요. 출력이 채점기 화면에 섞일 뿐이에요.', '', '<code>input()</code>은 함수를 부를 때가 아니라 불러오는 순간 실행된 거예요.'] },
      { t: 'q', kind: 'blank', fig: 'q_runBlank', q: 'subprocess로 학생 프로그램의 <code>input()</code>에 5를 넣고, 출력을 글자로 받으려 해요. 빈칸에 들어갈 이름은?', lang: 'py',
        code: src(['r = subprocess.run(', '    [sys.executable, "s01.py"],', '    [[1]]="5\\n",', '    capture_output=True,', '    text=True, timeout=2)']),
        opts: ['input', 'stdin', 'args', 'stdout'], a: 0,
        why: '<code>input=</code>에 준 글이 학생 프로그램의 표준 입력으로 들어가요. 줄마다 <code>input()</code> 하나씩 읽어요.',
        ex: ['', '<code>stdin</code>은 파일 같은 입력 통로를 넘기는 자리예요. 글을 바로 넣을 땐 <code>input</code>이에요.', '<code>args</code>는 실행할 명령 목록(첫 인자)을 가리키는 이름이에요.', '<code>stdout</code>은 출력 쪽이에요. 출력은 <code>capture_output</code>으로 받아요.'] },
      { t: 'q', kind: 'mc', fig: 'q_returncode', q: 'subprocess 결과에서 <code>returncode</code>가 1이고 <code>stdout</code>은 비어 있어요. 무엇을 먼저 볼까요?',
        opts: ['<code>timeout</code>을 10초로 늘려 다시 돌린다', '<code>stderr</code>의 마지막 줄에서 오류 이름을 본다', '<code>stdout</code>이 비었으니 정답으로 처리한다', '<code>capture_output</code>을 빼고 다시 돌린다'], a: 1,
        why: '0이 아닌 <code>returncode</code>는 학생 코드에서 오류가 났다는 뜻이에요. <code>stderr</code>의 마지막 줄(예: <code>ZeroDivisionError</code>)이 까닭을 알려 줘요.',
        ex: ['시간 초과라면 <code>TimeoutExpired</code>가 났을 거예요. 이건 오류로 끝난 경우예요.', '', '빈 출력은 기대 출력과 달라요. 오류로 끝난 답안이에요.', '빼면 오류가 화면에만 찍히고 결과로 남지 않아요.'] },
      { t: 'q', kind: 'order', fig: 'q_resultOrder', q: '표준 입출력 답안 하나를 채점하는 순서로 쌓아 보세요.',
        items: ['timeout을 걸어 subprocess로 학생 프로그램을 실행한다', '2초를 넘겨 TimeoutExpired가 나면 "시간 초과"로 적는다', '제때 끝났다면 returncode가 0인지 본다', 'returncode가 0이면 stdout을 정리해 기대 출력과 비교한다'],
        why: '실행해야 결과가 생기고, 시간 안에 끝나야 returncode가 생기고, 정상으로 끝났을 때만 출력을 비교할 뜻이 있어요.' },
      { t: 'sum', pts: ['함수 호출 채점은 돌려준 값, 표준 입출력 채점은 출력된 글을 비교한다. input()의 안내 문구도 출력에 섞인다.', 'importlib·exec를 채점기 안에서 쓰면 학생 코드가 같은 프로그램에서 돈다. subprocess.run(…, input=…, capture_output=True, text=True, timeout=2)로 따로 돌린다.', 'timeout은 시간만 막는다. 별도 폴더·훑어보기·시간 제한, 실제 운영은 격리된 채점 서버나 검증된 서비스.'] }
    ]},

    /* =================== QB =================== */
    { id: 'QB', type: 'quiz', title: '헷갈림 퀴즈 ②', sub: 'exec와 subprocess, timeout, 표준 입출력', min: 3, steps: [
      { t: 'q', kind: 'mc', fig: 'qb_room', q: '<code>exec</code>와 <code>subprocess.run</code>의 차이를 바르게 말한 것은?',
        opts: ['둘 다 새 파이썬 프로그램을 띄워 돌리니 안전한 정도는 같다', '<code>exec</code>는 파일만, <code>subprocess</code>는 글자로 된 코드만 돌릴 수 있다', '<code>subprocess</code>는 학생 코드를 실행하지 않고 읽기만 한다', '<code>exec</code>는 채점기 안에서, <code>subprocess</code>는 따로 띄운 파이썬에서 돌린다'], a: 3,
        why: '<code>exec</code>로 돌린 코드는 채점기와 한 몸이라 멈추면 같이 멈춰요. <code>subprocess</code>는 새 프로그램이라 끊어 낼 수 있어요.',
        ex: ['<code>exec</code>는 새 프로그램을 띄우지 않아요. 채점기 안에서 바로 실행해요.', '거꾸로에 가까워요. <code>exec</code>는 글자로 된 코드를, <code>subprocess</code>는 파일·명령을 실행해요.', '<code>subprocess</code>는 실제로 실행해요. 그래서 시간 제한과 안전 원칙이 필요해요.', ''] },
      { t: 'q', kind: 'mc', fig: 'qb_timeout', q: '<code>timeout=2</code>를 걸었으니, 학생 코드에 <code>os.remove("grade.py")</code>가 있어도 괜찮을까요?',
        opts: ['괜찮다. 2초 안에는 파일을 지울 수 없다', '괜찮다. subprocess로 돌리면 파일을 건드리지 못한다', '안 괜찮다. timeout은 시간만 막는다', '안 괜찮다. 시간 초과가 나면 채점기 파일이 대신 지워진다'], a: 2,
        why: 'timeout은 <b>오래 도는 것</b>만 끊어요. 파일 지우기는 눈 깜짝할 새 끝나요. 별도 폴더·훑어보기·격리된 곳에서 실행하기를 함께 써요.',
        ex: ['파일 하나 지우는 데는 아주 짧은 시간이면 돼요.', 'subprocess로 돌려도 내 계정 권한 그대로라 파일을 지울 수 있어요.', '', '시간 초과는 학생 프로그램을 끝낼 뿐, 다른 파일을 지우지 않아요.'] },
      { t: 'q', kind: 'mc', fig: 'qb_prompt', q: '"두 수를 입력받아 합만 출력" 문제에 <code>input="3\\n5\\n"</code>을 넣었더니, 계산이 맞는 답안의 stdout이 <code>첫 수: 둘째 수: 8</code>이에요. 왜일까요?',
        opts: ['학생이 <code>print</code>를 세 번 썼다', '<code>input()</code>의 안내 문구도 출력(stdout)으로 나온다', '<code>capture_output=True</code>가 입력 글까지 출력에 붙인다', '<code>text=True</code>가 숫자를 글자로 바꾸며 이름표를 붙인다'], a: 1,
        why: '<code>input("첫 수: ")</code>의 안내 문구는 출력으로 나가요. 표준 입출력 문제는 "안내 문구 없이 <code>input()</code>만"을 규칙으로 적거나, 출력의 마지막 줄만 비교해요.',
        ex: ['줄바꿈 없이 한 줄로 이어진 걸 보면 <code>print</code> 세 번이 아니에요. 안내 문구 두 개와 답이에요.', '', '<code>capture_output</code>은 출력을 받아 둘 뿐 입력을 붙이지 않아요. 입력한 3과 5는 보이지 않죠.', '<code>text=True</code>는 받은 출력을 글자(str)로 바꿀 뿐이에요.'] }
    ]},

    /* =================== L5 =================== */
    { id: 'L5', type: 'lesson', title: '채점 리포트와 교사 확인', sub: '점수표, 많이 틀린 케이스, CSV, 마지막은 사람이', min: 13, steps: [
      { t: 'say', h: '점수표는 교사용과 학생용이 달라요', fig: 'f_twoReports', p: [
        '<b>교사용</b>은 학생 × 문제 표에 합계와 시간 초과·오류 표시까지 한눈에 봐요. <b>학생용</b>은 자기 결과만, 틀린 케이스의 입력·기대값·실제값과 힌트로 보여 줘요.',
        '숨은 케이스는 학생용에 입력을 다 보여 주지 않아요. "빈 리스트일 때를 생각해 봐요"처럼 방향만 알려 줘요. c4u2의 AI 튜터가 이 일을 맡아요.',
        '표에는 이름 대신 번호나 가명을 써요. 답안 파일도 <code>s01.py</code>처럼 번호로 받으면 결과를 화면에 띄워도 안심이에요.'
      ]},
      { t: 'say', h: '많이 틀린 케이스는 다음 수업의 신호예요', fig: 'f_hotCase', p: [
        '케이스마다 몇 명이 틀렸는지 세면 반 전체가 어디서 막혔는지 보여요. 다섯 명 중 셋이 빈 리스트 케이스를 틀렸다면, 다음 시간 도입에서 "0으로 나누기"를 다시 짚어요.',
        '거의 <b>모두</b> 틀린 케이스는 거꾸로 의심해요. 기대값이 틀렸거나 문제 설명에 조건이 빠졌을 수 있어요. 정답 함수로 케이스부터 다시 확인해요.',
        '점수 분포도 같이 봐요. 대부분 만점이면 다음엔 케이스를 더 까다롭게, 0점이 몰려 있으면 함수 이름·파일 이름 같은 제출 조건부터 의심해요.'
      ]},
      { t: 'say', h: 'CSV로 저장하면 스프레드시트에서 열려요', code: { lang: 'py', src: src(['import csv', '', 'rows = [', '    ["학생", "p1", "p2", "p3", "합계"],', '    ["가람", 3, 3, 3, 9],', '    ["나래", 3, 2, 3, 8],', ']', 'with open("report.csv", "w", newline="",', '          encoding="utf-8-sig") as f:', '    csv.writer(f).writerows(rows)']) }, p: [
        'CSV는 쉼표로 칸을 나눈 표 파일이에요. <code>csv</code> 모듈로 쓰면 학교에서 쓰는 스프레드시트 프로그램에서 바로 열려요.',
        '<code>newline=""</code>은 줄이 두 번씩 바뀌는 걸 막아요(<code>csv</code> 공식 문서의 권장). <code>encoding="utf-8-sig"</code>는 엑셀이 한글을 알아보게 파일 맨 앞에 표시를 붙여요. 그냥 <code>"utf-8"</code>이면 엑셀에서 한글이 깨져 보일 수 있어요.'
      ]},
      { t: 'say', h: '점수는 채점기가 먼저, 확정은 교사가', fig: 'f_teacherCheck', p: [
        '리포트를 받으면 먼저 <b>0점</b>(함수 이름이 다르거나 파일을 잘못 낸 경우), <b>시간 초과</b>, <b>거의 모두 틀린 케이스</b>를 열어 봐요. 채점기 탓인지 답안 탓인지 가려요.',
        '그다음 답안 몇 개를 골라 읽어요. 케이스 값만 외운 코드, 다른 답안과 똑같은 코드처럼 숫자로는 안 보이는 것은 교사가 판단해요.',
        '확인한 점수만 반영하고, 학생이 결과를 보고 이의를 말할 길도 열어 둬요. 이 채점기는 c4u2에서 튜터와, c5u1에서 에이전트의 도구(<code>grade_code</code>)로 다시 써요.'
      ]},
      { t: 'sim', h: '점수표를 뽑아 봐요', p: 'IDE 창 터미널에서 grade.py를 돌려 점수표와 report.csv를 만들고, 많이 틀린 케이스의 조건을 확인해 봐요.',
        scene: { win: 'ide', folder: 'grader', files: GFILES, open: 'grade.py', lang: 'py', code: GRADE_PY, term: [] },
        steps: [
          { goal: '터미널에 <code>python grade.py</code>를 쳐요', type: 'python grade.py', into: 'term',
            then: { term: GRADE_OUT, prompt: '', files: [...GFILES, 'report.csv'] },
            say: '다섯 답안을 문제마다 따로 돌려 점수표를 찍고, 많이 틀린 케이스를 세어 <code>report.csv</code>로 저장했어요. s05는 p2에서 시간 초과예요.' },
          { goal: '<code>report.csv</code>를 열어요', click: 'file:report.csv', then: { open: 'report.csv', lang: 'plain', code: REPORT_CSV },
            say: '쉼표로 칸을 나눈 표예요. 스프레드시트에서 열면 칸이 나뉘어 보이고, 메모 칸에 시간 초과가 남아 있어요.' },
          { goal: '<code>problems.json</code>을 열어 p2 조건을 확인해요', click: 'file:problems.json', then: { open: 'problems.json', lang: 'json', code: P2_JSON_NEW },
            say: '"빈 리스트는 0"이 제목에 적혀 있어요. 조건은 알렸으니 기대값 탓은 아니에요. 다음 시간에 빈 리스트를 다시 짚어요.' } ],
        end: '숫자는 채점기가, 다음 수업은 교사가 정해요.' },
      { t: 'try', lang: 'py', h: '점수 분포와 많이 틀린 케이스를 뽑아 봐요', p: '학생 다섯 명(가명)이 틀린 케이스 목록이에요. 실행해 점수 분포와 많이 틀린 케이스를 보고, 마루의 목록을 비워(<code>[]</code>) 다시 돌려 보세요.',
        src: src([
          '# 학생별로 틀린 케이스(채점 결과 흉내)',
          'results = {',
          '    "가람": [],',
          '    "나래": ["p2 []"],',
          '    "다온": ["p2 []", "p3 60점"],',
          '    "라희": ["p3 60점"],',
          '    "마루": ["p2 [80,90]", "p2 [100]",',
          '             "p2 []"],',
          '}',
          'TOTAL = 9  # 케이스 9개, 하나에 1점',
          '',
          'dist = {}',
          'for fails in results.values():',
          '    s = TOTAL - len(fails)',
          '    dist[s] = dist.get(s, 0) + 1',
          'print("점수 분포")',
          'for s in sorted(dist, reverse=True):',
          '    print(f"{s}점 " + "■" * dist[s])',
          '',
          'count = {}',
          'for fails in results.values():',
          '    for c in fails:',
          '        count[c] = count.get(c, 0) + 1',
          'print("많이 틀린 케이스")',
          'top = sorted(count.items(),',
          '             key=lambda x: -x[1])',
          'for c, n in top:',
          '    print(f"- {c}: {n}명")']),
        note: '진짜 grade.py에서는 이 목록을 채점 결과에서 모아요. 가장 많이 틀린 케이스가 다음 수업 도입 거리예요.' },
      { t: 'q', kind: 'mc', fig: 'q_allFail', q: '다섯 명 모두 p3의 <code>[60] → "통과"</code> 케이스 하나만 틀렸어요. 먼저 할 일은?',
        opts: ['모두 틀렸으니 그 케이스를 점수에서 바로 뺀다', '학생 다섯 명에게 60점 경계를 처음부터 다시 가르친다', '그 케이스의 기대값과 문제 설명부터 확인한다', 'timeout을 늘려 다시 돌린다'], a: 2,
        why: '모두가 같은 케이스만 틀렸다면 채점기 쪽을 먼저 의심해요. 기대값이 틀렸거나, 문제에 "60점 이상"이 아니라 "60점 초과"로 적혔을 수 있어요.',
        ex: ['까닭을 모른 채 빼면, 진짜로 경계를 놓친 학생에게 알려 줄 기회도 사라져요.', '가르치기 전에 문제·기대값이 맞는지부터 봐야 헛수고가 없어요.', '', '다른 케이스는 다 통과했으니 시간 문제가 아니에요.'] },
      { t: 'q', kind: 'line', fig: 'q_csvLine', q: '선생님이 만든 report.csv를 엑셀로 열었더니 한글이 깨져 보여요. <b>원인이 된 줄</b>을 눌러 보세요.', lang: 'py',
        code: src(['import csv', '', 'rows = [["학생", "합계"], ["가람", 9]]', 'with open("report.csv", "w", newline="",', '          encoding="utf-8") as f:', '    csv.writer(f).writerows(rows)']), a: 4,
        why: '엑셀이 한글을 바로 알아보게 하려면 <code>encoding="utf-8-sig"</code>로 저장해요. 파일 맨 앞의 표시를 보고 UTF-8로 읽어요.' },
      { t: 'q', kind: 'mc', fig: 'q_studentView', q: '학생에게 채점 결과 화면을 보여 주려 해요. 학생용 화면에 <b>넣지 않는</b> 것은?',
        opts: ['내가 틀린 케이스의 입력·기대값·실제값', '반 친구들의 이름과 점수가 모두 나온 표', '숨은 케이스는 입력 대신 방향을 알려 주는 힌트', '내 점수와 통과한 케이스 수'], a: 1,
        why: '다른 학생의 이름과 점수는 개인정보예요. 학생용 화면에는 <b>자기 결과</b>만 보여 줘요.',
        ex: ['틀린 케이스의 자세한 내용은 스스로 고칠 실마리라 넣어요.', '', '숨은 케이스는 입력을 숨기고 방향만 알려 주는 게 좋아요.', '자기 점수와 통과 수는 넣어요.'] },
      { t: 'q', kind: 'blank', fig: 'q_countBlank', q: '케이스마다 틀린 사람 수를 세는 줄이에요. 처음 나온 케이스도 오류 없이 세려면 빈칸에 무엇이 들어갈까요?', lang: 'py', code: 'count[c] = count.[[1]](c, 0) + 1',
        opts: ['get', 'pop', 'keys', 'items'], a: 0,
        why: '<code>count.get(c, 0)</code>은 키가 없으면 0을 돌려줘요. 그래서 처음 나온 케이스는 1, 다음부터는 하나씩 늘어요.',
        ex: ['', '<code>pop</code>은 값을 꺼내며 지워요. 세는 중인 값이 사라져요.', '<code>keys()</code>는 키 목록을 줄 뿐 인자를 받지 않아요.', '<code>items()</code>는 (키, 값) 짝 목록을 줄 뿐 인자를 받지 않아요.'] },
      { t: 'sum', pts: ['교사용은 학생×문제 표와 시간 초과·오류, 학생용은 내 결과와 틀린 케이스·힌트. 이름 대신 번호·가명.', '케이스별 틀린 사람 수는 다음 수업 신호. 모두 틀린 케이스는 기대값·문제 설명부터 의심한다.', 'CSV는 csv 모듈, newline="", encoding="utf-8-sig". 자동 점수는 초안, 0점·시간 초과·이상한 케이스를 교사가 확인한 뒤 반영한다.'] }
    ]},

    /* =================== M1 =================== */
    { id: 'M1', type: 'mission', title: 'grader/ 채점기 만들기', sub: 'upstage-lab과 내 Cursor에서 직접', min: 45,
      where: 'upstage-lab 폴더(grader/) + 내 Cursor',
      intro: '이번 단원에서 배운 채점기를 진짜로 만들어 봐요. 연수 2일차 트랙 A 오전 실습과 같은 흐름이에요. 학생 답안은 <b>내가 만든 가짜 답안</b>만 써요(진짜 학생 파일·이름은 쓰지 않아요). 끝낸 것부터 체크하고 한 줄 메모를 남겨요.',
      tasks: [
        { do: '시작 전에 Git 커밋하고 grader 폴더를 만들어요',
          how: 'upstage-lab 폴더의 터미널에서 <code>git status</code>로 깨끗한지 보고, 바뀐 게 있으면 먼저 커밋해요. 그다음 <code>grader/</code>와 그 안에 <code>submissions/</code>, <code>sandbox/</code> 폴더를 만들어요. 이 채점기는 API 키가 필요 없으니 <code>.env</code>를 grader 안으로 복사하지 않아요.',
          check: '<code>git status</code>가 깨끗하고, grader/submissions와 grader/sandbox 폴더가 보이면 성공.' },
        { do: 'problems.json 3문제와 정답 코드를 만들어요',
          how: 'IDE 창에서 <kbd>mod+i</kbd>로 Agent 패널을 열고 아래 부탁을 붙여 넣어요. 다 되면 기대값이 맞는지 직접 한두 개 계산해 봐요.',
          check: '<code>python check_cases.py</code>가 세 문제 모두 "일치"를 찍으면 성공. 다르면 케이스와 정답 함수 중 어느 쪽이 틀렸는지 메모해요.',
          prompt: 'upstage-lab/grader 폴더에서 일해 줘. 파이썬 자동채점 연습용이야.\n1) problems.json: 문제 3개. p1 add(a, b) 두 수의 합, p2 average(nums) 점수 평균(빈 리스트면 0), p3 pass_fail(score) 60점 이상이면 "통과" 아니면 "재도전". 문제마다 id, title, func, cases[{args, expected}], points(3), hints(2단계)를 넣어 줘. 케이스는 보통 값·경계 값·특이한 값을 섞어 3개씩. args는 인자 목록이라 리스트 하나는 [[80, 90]]처럼 감싸 줘. 문제 조건(빈 리스트면 0 등)은 title에 적어 줘.\n2) solution.py: 세 함수의 정답 코드.\n3) check_cases.py: solution.py로 모든 케이스의 기대값을 다시 계산해 문제마다 일치/불일치를 출력.\n조건: 표준 라이브러리만, 주석은 한국어, JSON은 ensure_ascii=False, indent=2로 저장. 끝나면 python check_cases.py를 실행해 결과를 보여 줘.' },
        { do: '가짜 학생 답안 5개를 만들어요',
          how: '아래 부탁으로 <code>submissions/s01.py</code>~<code>s05.py</code>를 만들어요. 흔한 실수를 일부러 섞어요.',
          check: '파일 5개가 생기고, 파일마다 맨 위 주석에 일부러 넣은 실수가 적혀 있으면 성공.',
          prompt: 'grader/submissions에 가짜 학생 답안 s01.py~s05.py를 만들어 줘. 파일마다 add, average, pass_fail 세 함수를 넣고 실수를 이렇게 섞어 줘: s01 모두 맞음, s02 average가 빈 리스트에서 0으로 나누기 오류, s03 빈 리스트 오류에 pass_fail이 60점을 "재도전"으로, s04 pass_fail 경계 실수만, s05 average 안에 끝나지 않는 while 반복. 학생 이름이나 개인정보는 넣지 마. 파일 맨 위 주석에 일부러 넣은 실수를 적어 줘. 다른 파일은 바꾸지 마.' },
        { do: 'grade.py로 답안을 따로 돌려 채점해요',
          how: 'Agent에게 아래 부탁을 보내요. 에이전트가 터미널 명령 실행을 물으면 명령을 읽고 허락해요. 일이 커 보이면 커서한입에서 배운 Plan 모드로 계획부터 받아도 좋아요.',
          check: '<code>python grade.py</code>가 다섯 답안의 점수표를 찍고, s05가 2초쯤 뒤 "시간 초과"로 나온 뒤에도 채점이 끝까지 가면 성공.',
          prompt: 'grader에 runner.py와 grade.py를 만들어 줘.\n- runner.py: 명령줄로 답안 파일 경로와 문제 id를 받아, 그 답안을 importlib로 불러 problems.json의 해당 문제 케이스를 모두 돌리고, 케이스마다 통과 여부와 실제값(오류면 오류 이름)을 JSON 한 줄로 출력.\n- grade.py: submissions의 답안을 sandbox로 복사하고, 답안 × 문제마다 subprocess.run([sys.executable, "runner.py", …], capture_output=True, text=True, timeout=2)로 따로 실행. 시간 초과는 "시간 초과"로 적고 다음으로 넘어가. 케이스마다 1점, 답안 × 문제 점수표를 터미널에 출력.\n조건: grade.py 안에서 exec나 importlib로 답안을 직접 부르지 마, 표준 라이브러리만, 주석은 한국어. 끝나면 python grade.py를 실행해 결과를 보여 줘.' },
        { do: 'report.csv와 많이 틀린 케이스를 뽑아요',
          how: '아래 부탁을 이어서 보내고, 저장된 report.csv를 스프레드시트 프로그램으로 열어 봐요.',
          check: 'report.csv의 한글이 깨지지 않고, 터미널에 많이 틀린 케이스가 사람 수와 함께 나오면 성공. 가장 많이 틀린 케이스를 메모해요.',
          prompt: 'grade.py가 끝에 report.csv(번호, p1, p2, p3, 합계, 메모)를 csv 모듈로 저장하게 고쳐 줘. newline="", encoding="utf-8-sig"로 저장하고, 시간 초과·오류는 메모 칸에 적어. 케이스별로 틀린 답안 수를 세어 많이 틀린 순서로 터미널에 출력해 줘. 다른 파일은 바꾸지 마. 끝나면 python grade.py를 다시 실행해 보여 줘.' },
        { do: '교사 확인을 하고 Git 커밋해요',
          how: '0점·시간 초과·많이 틀린 케이스를 하나씩 열어 채점기 탓인지 답안 탓인지 메모해요. 그다음 <code>git status</code>로 바뀐 파일을 보고 커밋해요. 진짜 학생 결과가 담긴 report.csv라면 저장소에 올리지 않아요(이번 것은 가짜 답안 결과예요).',
          check: '메모에 "확인한 것 3가지"가 있고, <code>git log</code>에 새 커밋이 보이면 성공.' }
      ],
      note: '비용: 이 미션은 Solar를 부르지 않아 업스테이지 요금이 들지 않아요(Cursor 사용량만 빠져요). c4u2에서 튜터를 붙이면 요금이 생겨요. 지금 가격으로 어림하면 학생 30명 × 힌트 3번 × (입력 1,500 + 출력 300 토큰) ≈ <code>solar-pro4</code>로 약 $0.07이에요(가격은 바뀔 수 있으니 upstage.ai/pricing/api에서 확인). 안전: 이번 답안은 내가 만든 가짜라 괜찮지만, 진짜 학생 코드는 <code>.env</code>와 내 파일이 있는 노트북에서 돌리지 않아요. 학생 코드도 내 파일을 읽을 수 있어서 키를 빼 갈 수 있어요.' },

    /* =================== T1 =================== */
    { id: 'T1', type: 'test', title: '단원 형성평가', sub: '10문제 · 7문제 이상 맞히면 통과', min: 12, pass: 0.7, steps: [
      { t: 'q', kind: 'mc', fig: 't_freeze', q: '연수장 09:00 실습에서 옆자리 선생님이 학생 답안을 <code>exec</code>로 차례로 돌리는 채점기를 만들었어요. 그런데 한 답안에서 노트북이 멈춘 듯 아무 반응이 없어요. 가장 알맞은 조언은?',
        opts: ['노트북 성능이 낮아서다. 더 빠른 컴퓨터로 바꾼다', '<code>subprocess</code>로 따로 돌리고 <code>timeout=2</code>처럼 시간을 건다', '답안을 둘로 나눠 <code>exec</code>를 두 번 부른다', '<code>print</code>를 답안 곳곳에 넣어 어디서 멈췄는지 찾아본다'], a: 1,
        why: '끝나지 않는 반복이 채점기 안에서 돌고 있을 가능성이 커요. 따로 띄운 프로그램에 시간 제한을 걸면 그 답안만 "시간 초과"로 적고 넘어가요.',
        ex: ['끝나지 않는 반복은 아무리 빠른 컴퓨터에서도 끝나지 않아요.', '', '나눠도 같은 채점기 안이라 그 답안에서 또 멈춰요.', '어디서 멈췄는지 알아도 채점기는 여전히 멈춰 있어요. 구조를 바꿔야 해요.'] },
      { t: 'q', kind: 'blank', fig: 't_blank2', q: '학생 프로그램에 입력을 넣고, 출력을 받아 두고, 2초가 넘으면 끊으려 해요. 두 빈칸을 채워 보세요.', lang: 'py',
        code: src(['r = subprocess.run(', '    [sys.executable, "s01.py"],', '    input="5\\n",', '    [[1]]=True, text=True,', '    [[2]]=2)']),
        opts: [['stdout', 'timeout'], ['capture_output', 'wait'], ['capture_output', 'timeout'], ['shell', 'timeout']], a: 2,
        why: '출력을 받아 두는 건 <code>capture_output=True</code>, 시간 제한은 <code>timeout=2</code>예요.',
        ex: ['첫 칸이 틀렸어요. 출력과 오류를 한 번에 받아 두는 건 <code>capture_output=True</code>예요.', '둘째 칸이 틀렸어요. 시간 제한의 이름은 <code>timeout</code>이에요.', '', '<code>shell=True</code>는 명령을 셸로 실행하는 설정이에요. 학생 코드 채점에는 쓰지 않고, 출력은 <code>capture_output</code>으로 받아요.'] },
      { t: 'q', kind: 'order', fig: 't_flow', q: '<code>grade.py</code>로 반 답안을 채점해 반영하기까지, 순서대로 쌓아 보세요.',
        items: ['problems.json을 읽어 문제와 케이스를 준비한다', '답안마다 문제별로 timeout을 걸어 따로 실행한다', '케이스마다 통과·실패를 세어 부분 점수를 낸다', '점수표를 찍고 report.csv로 저장한다', '교사가 0점·시간 초과·많이 틀린 케이스를 확인한다'],
        why: '케이스가 있어야 실행하고, 실행 결과가 있어야 점수를 내고, 점수가 저장돼야 교사가 보고 확인해요. 확인은 늘 반영 전 마지막이에요.' },
      { t: 'q', kind: 'line', fig: 't_exceptLine', q: '채점기의 한 부분이에요. 시간 초과가 나면 이 코드가 잡지 못하고 채점기가 오류로 멈춰요. <b>틀린 줄</b>을 눌러 보세요.', lang: 'py',
        code: src(['try:', '    r = subprocess.run(cmd, input=data,', '        capture_output=True, text=True,', '        timeout=2)', 'except ValueError:', '    result = "시간 초과"']), a: 4,
        why: '시간 초과는 <code>subprocess.TimeoutExpired</code> 예외로 와요. <code>except subprocess.TimeoutExpired:</code>로 잡아야 해요.' },
      { t: 'q', kind: 'mc', fig: 't_essay', q: '"리스트와 튜플의 차이를 세 문장으로 설명하시오" 10문항을 자동으로 채점하고 싶어요. 알맞은 방법은?',
        opts: ['모범 답안과 글자가 같은지 normalize 뒤 비교한다', '학생 답을 subprocess로 실행해 출력을 본다', '루브릭으로 LLM 점수를 받고 교사가 확인한다', '글자 수가 많을수록 높은 점수를 준다'], a: 2,
        why: '서술형은 정답이 하나가 아니라 기준표(루브릭)로 매겨요. LLM의 점수는 제안이니 교사가 확인해요(c4u2·c5u2).',
        ex: ['같은 뜻을 다르게 쓴 답이 모두 틀려요.', '서술형 답은 실행할 코드가 아니에요.', '', '길이는 내용의 질과 상관없어요. 길게 쓰기만 해도 점수가 올라가요.'] },
      { t: 'q', kind: 'mc', fig: 't_shortAns', q: '단답형 정답이 <code>append</code>인데, <code>append()</code>나 <code>.append</code>라고 쓴 답도 맞게 보고 싶어요. 가장 알맞은 방법은?',
        opts: ['허용 답 목록을 두고 그중 하나와 같으면 맞음', 'normalize에 <code>lower()</code>를 한 번 더 넣는다', '"append"라는 글자가 들어 있기만 하면 모두 맞음으로 한다', '단답형은 자동채점하지 않고 모두 0점 처리한다'], a: 0,
        why: '정답 칸을 <code>["append", "append()", ".append"]</code>처럼 <b>허용 답 목록</b>으로 두면, 인정할 답을 교사가 정확히 정할 수 있어요.',
        ex: ['', '<code>lower()</code>는 대소문자만 맞춰요. 괄호나 점은 그대로예요.', '"append를 안 써요" 같은 답까지 맞음이 돼요. 너무 너그러워요.', '정답이 정해진 단답형은 자동채점하기 좋은 문항이에요.'] },
      { t: 'q', kind: 'mc', fig: 't_args', q: '연수 11:00 「문제·정답 데이터 구성」 실습에서 <code>average</code> 케이스를 다 적고 채점기를 돌렸더니, 정답 코드까지 모든 케이스에서 <code>TypeError</code>가 나요. 무엇부터 볼까요?',
        opts: ['모든 답안이 틀렸으니 그 문제를 없앤다', '<code>expected</code>를 글자("85")로 바꿔 다시 돌린다', '<code>timeout</code>을 늘려 다시 돌린다', '<code>args</code>를 <code>[[80, 90]]</code>로 감쌌는지 본다'], a: 3,
        why: '<code>args</code>를 <code>[80, 90]</code>으로 적으면 <code>average(80, 90)</code>으로 불려 인자 개수 오류(<code>TypeError</code>)가 나요.',
        ex: ['정답 코드까지 오류라면 문제가 아니라 데이터를 의심해요.', '기대값의 형식은 비교 단계 이야기예요. 함수를 부르다 난 오류와 상관없어요.', '시간 초과가 아니라 부르는 순간 난 오류예요.', ''] },
      { t: 'q', kind: 'mc', fig: 't_realClass', q: '연수 뒤 학교에서 반 전체 30명의 코드를 받아 수행평가에 반영하려 해요. 연수 때 만든 노트북 채점기로 그대로 돌려도 될까요?',
        opts: ['된다. timeout을 걸었으니 위험한 코드도 막힌다', '된다. sandbox 폴더에서 돌리니 다른 파일은 안전하다', '안 된다. 격리된 채점 환경을 쓰고 학교 지침을 확인한다', '학생들에게 위험한 코드를 쓰지 말라고 공지하면 된다'], a: 2,
        why: '내 노트북의 채점기는 연습용이에요. 학생 코드는 내 권한으로 돌아 파일을 읽고 지울 수 있어서, 실제 평가는 격리된 곳에서 하고 학교 지침을 따라요.',
        ex: ['timeout은 시간만 막아요. 파일 지우기·읽기는 2초 안에도 돼요.', '폴더를 바꿔도 다른 폴더의 파일을 건드릴 수 있어요.', '', '실수로 들어간 위험한 코드도 있을 수 있어요. 공지만으로는 막지 못해요.'] },
      { t: 'q', kind: 'mc', fig: 't_rate', q: '연수 10:00 「자동채점 로직 설계」 실습에서 정답률 함수 <code>rate(1, 3)</code>의 기대값을 <code>0.33</code>으로 적었더니 정답 코드도 실패해요. 어떻게 고칠까요?',
        opts: ['기대값을 0.3333333333333333까지 다 적는 수밖에 없다', '반올림 규칙을 정하거나 오차를 허용해 비교한다', '실수는 자동채점할 수 없으니 그 문제를 뺀다', '정답 코드가 틀렸으니 정답 코드를 고친다'], a: 1,
        why: '1 ÷ 3은 끝없는 소수라 0.33과 같지 않아요. 반올림 규칙을 문제에 적어 양쪽을 맞추거나 <code>abs(got - want)</code>로 오차를 허용해요.',
        ex: ['적을 수는 있지만 계산 방법이 조금만 달라도 끝자리가 어긋날 수 있어요. 규칙을 정하는 게 안전해요.', '', '오차 허용이나 반올림 규칙이면 실수도 채점할 수 있어요.', '정답 코드는 맞아요. 기대값과 비교 방법이 문제예요.'] },
      { t: 'q', kind: 'mc', fig: 't_attrErr', q: '리포트에서 0점인 답안을 열어 보니, runner가 <code>AttributeError: … has no attribute \'average\'</code>를 남겼어요. 무엇을 의심할까요?',
        opts: ['학생 함수 이름이 <code>func</code>와 다르다', '케이스의 기대값이 틀렸다', '<code>timeout</code>이 너무 짧다', 'CSV 인코딩이 <code>utf-8-sig</code>가 아니다'], a: 0,
        why: '불러온 답안에 <code>average</code>라는 이름이 없다는 오류예요. 함수 이름이 다르면 계산이 맞아도 0점이 되니, 교사가 확인하고 이름 규칙을 다시 알려요.',
        ex: ['', '기대값이 틀렸다면 함수는 불려서 값이 비교됐을 거예요. 이건 함수를 찾지도 못한 오류예요.', '시간 초과라면 <code>TimeoutExpired</code>로 나와요.', 'CSV 인코딩은 리포트 파일을 여는 문제라 채점 결과에 이런 오류를 남기지 않아요.'] }
    ]}
    ]
  });
})();
