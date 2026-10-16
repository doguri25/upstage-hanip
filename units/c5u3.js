// 과정 5 · 단원 3 · 대회 준비: 공모전과 해커톤
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
  // 문서 쪽지(제목 + 흐린 줄)
  function doc(P, x, y, w, h, title, fill, size) {
    P.note(x, y, w, h, { fill: fill || 'paper' });
    let top = y + 16;
    if (title) { P.text(x + w / 2, y + 22, title, { size: size || 13, weight: 700 }); top = y + 38; }
    for (let i = 0, yy = top; yy < y + h - 8; i++, yy += 13) P.line(x + 10, yy, x + w - 12 - (i % 2) * 12, yy, { c: 'soft', w: 3 });
  }
  // 글자가 든 동그란 단추
  function chip(P, x, y, w, h, label, fill, size) {
    P.rrect(x, y, w, h, 8, { fill: fill || 'paper', gap: 5, w: 1.6 });
    P.text(x + w / 2, y + h / 2 + (size || 13) * 0.36, label, { size: size || 13, weight: 700 });
  }
  // 흩어진 카드(순서 문제용)
  function card(P, x, y) { P.rrect(x, y, 92, 70, 10, { fill: 'paper' }); }
  function cross(P, cx, cy, r, c) {
    P.line(cx - r, cy - r, cx + r, cy + r, { c: c || 'bad', w: 3 });
    P.line(cx + r, cy - r, cx - r, cy + r, { c: c || 'bad', w: 3 });
  }
  function ask(P, x, y, size, c) { P.text(x, y, '?', { size: size || 22, weight: 700, c: c || 'warm' }); }
  // 시계(지름 d)
  function clock(P, cx, cy, d, fill) {
    P.circle(cx, cy, d, { fill: fill || 'paper', fs: 'solid', w: 2.2 });
    P.line(cx, cy, cx, cy - d * 0.3, { w: 3 });
    P.line(cx, cy, cx + d * 0.22, cy + d * 0.12, { w: 3 });
  }
  // 돋보기(지름 d)
  function lens(P, cx, cy, d, fill) {
    P.circle(cx, cy, d, { fill: fill || 'sky', gap: 5, w: 2.2 });
    P.line(cx + d * 0.33, cy + d * 0.33, cx + d * 0.55, cy + d * 0.58, { w: 3.5 });
  }
  // 노트북
  function laptop(P, x, y, w, h, fill) {
    P.rrect(x, y, w, h, 8, { fill: fill || 'paper', w: 2 });
    P.path(`M${x - 6} ${y + h} L${x + w + 6} ${y + h} L${x + w + 12} ${y + h + 12} L${x - 12} ${y + h + 12} Z`, { fill: 'soft', gap: 5 });
  }
  // 발표 화면(받침대 포함)
  function screen(P, x, y, w, h, fill) {
    P.rrect(x, y, w, h, 6, { fill: fill || 'paper', fs: 'solid', w: 2 });
    P.line(x + w / 2, y + h, x + w / 2, y + h + 12, { w: 2 });
    P.line(x + w / 2 - 16, y + h + 12, x + w / 2 + 16, y + h + 12, { w: 2 });
  }
  // 재생 삼각형
  function play(P, cx, cy, s) { P.path(`M${cx - s * 0.45} ${cy - s * 0.55} L${cx + s * 0.55} ${cy} L${cx - s * 0.45} ${cy + s * 0.55} Z`, { fill: 'accent', fs: 'solid', w: 1.4 }); }
  // 막대그래프(base = 바닥 y)
  function bars(P, x, base, vals, bw, gap, fills) {
    vals.forEach((v, i) => P.rect(x + i * (bw + gap), base - v, bw, v, { fill: (fills && fills[i]) || 'sky', gap: 4, w: 1.4 }));
    P.line(x - 6, base, x + vals.length * (bw + gap), base, { w: 2 });
  }
  // 열쇠(API 키)
  function keyIcon(P, cx, cy, s) {
    s = s || 1;
    P.circle(cx, cy, 22 * s, { fill: 'hi', fs: 'solid', w: 2 });
    P.circle(cx, cy, 8 * s, { fill: 'paper', fs: 'solid', w: 1.4 });
    P.line(cx + 11 * s, cy, cx + 44 * s, cy, { w: 3 });
    P.line(cx + 34 * s, cy, cx + 34 * s, cy + 9 * s, { w: 3 });
    P.line(cx + 42 * s, cy, cx + 42 * s, cy + 7 * s, { w: 3 });
  }
  // 와이파이(ok가 false면 흐리고 X)
  function wifi(P, cx, cy, s, ok) {
    const c = ok === false ? 'soft' : 'accent';
    [10, 20, 30].forEach(r => P.path(`M${cx - r * s} ${cy - r * s * 0.4} Q${cx} ${cy - r * s * 1.5} ${cx + r * s} ${cy - r * s * 0.4}`, { c, w: 2.6 }));
    P.circle(cx, cy, 8 * s, { fill: c, fs: 'solid', c: null });
    if (ok === false) cross(P, cx + 22 * s, cy - 36 * s, 9 * s);
  }
  // 휴대폰
  function phone(P, x, y, w, h) {
    P.rrect(x, y, w, h, 8, { fill: 'paper', fs: 'solid', w: 2 });
    P.circle(x + w / 2, y + h - 8, 6, { c: 'soft', w: 1.4 });
  }
  // 트로피
  function trophy(P, cx, cy, s) {
    s = s || 1;
    P.path(`M${cx - 22 * s} ${cy - 24 * s} L${cx + 22 * s} ${cy - 24 * s} Q${cx + 22 * s} ${cy + 4 * s} ${cx} ${cy + 8 * s} Q${cx - 22 * s} ${cy + 4 * s} ${cx - 22 * s} ${cy - 24 * s} Z`, { fill: 'hi', gap: 5, w: 2 });
    P.line(cx, cy + 8 * s, cx, cy + 20 * s, { w: 3 });
    P.rrect(cx - 14 * s, cy + 20 * s, 28 * s, 8 * s, 3, { fill: 'warm', fs: 'solid', w: 1.4 });
  }
  // 폴더(탭 달린 모양)
  function folder(P, x, y, w, h, fill) {
    P.path(`M${x} ${y + 10} L${x} ${y + h} L${x + w} ${y + h} L${x + w} ${y + 10} L${x + w * 0.45} ${y + 10} L${x + w * 0.38} ${y} L${x} ${y} Z`, { fill: fill || 'hi', gap: 7 });
  }
  // 구름(저장소)
  function cloud(P, cx, cy, w, h, fill) {
    const l = cx - w / 2, r = cx + w / 2, t = cy - h / 2, b = cy + h / 2;
    P.path(`M${l + w * 0.18} ${b} Q${l} ${b} ${l + w * 0.04} ${cy + h * 0.1} Q${l + w * 0.06} ${t + h * 0.2} ${l + w * 0.28} ${t + h * 0.22} Q${l + w * 0.38} ${t} ${cx + w * 0.06} ${t + h * 0.06} Q${r - w * 0.16} ${t} ${r - w * 0.14} ${t + h * 0.34} Q${r} ${t + h * 0.36} ${r - w * 0.02} ${cy + h * 0.24} Q${r - w * 0.02} ${b} ${r - w * 0.2} ${b} Z`, { fill: fill || 'sky', gap: 6, w: 2 });
  }
  // 학교 건물
  function school(P, x, y, w, h) {
    P.path(`M${x} ${y + h * 0.35} L${x + w / 2} ${y} L${x + w} ${y + h * 0.35} Z`, { fill: 'warm', gap: 5, w: 1.8 });
    P.rect(x + 6, y + h * 0.35, w - 12, h * 0.65, { fill: 'paper', fs: 'solid', w: 1.8 });
    P.rect(x + 16, y + h * 0.48, w * 0.18, h * 0.14, { fill: 'sky', fs: 'solid', w: 1.2 });
    P.rect(x + w - 16 - w * 0.18, y + h * 0.48, w * 0.18, h * 0.14, { fill: 'sky', fs: 'solid', w: 1.2 });
    P.rect(x + w / 2 - 7, y + h - 18, 14, 18, { w: 1.4 });
  }
  // 터미널 상자
  function term(P, x, y, w, h, line) {
    P.rrect(x, y, w, h, 6, { fill: 'ink', fs: 'solid' });
    if (line) P.text(x + 10, y + h / 2 + 4, line, { mono: true, size: 11, anchor: 'start', c: 'paper' });
  }

  /* ---------- 모의 화면에서 되풀이하는 조각 ---------- */
  const EMPTY = { mode: 'Agent', model: 'Auto', msgs: [], input: '' };
  const panel = o => Object.assign({}, EMPTY, o);
  const MODE_MENU = { title: 'Mode', items: ['Agent', 'Ask', 'Plan', 'Debug'] };
  const MVP_Q = '@PLAN.md 기획서대로 MVP를 만들 거야. 기능은 셋만: ① 자료 근거로 답 + 출처 ② 자료 밖 질문은 선생님께 안내 ③ 교사용 질문 기록. app.py 하나로, 단계마다 확인할 질문을 붙여 계획만 세워 줘.';
  const MVP_PLAN = '계획이에요.<ol><li><code>search.py</code>로 자료를 찾아 <code>solar-pro4</code>로 답 + 출처(확인: 시연 질문 3개)</li><li>근거가 없으면 "선생님께 물어봐요"(확인: 자료 밖 질문 2개)</li><li>사이드바에 교사용 질문 기록(확인: 기록 3줄)</li></ol>키는 <code>.env</code>에서만 읽고, 한 단계씩 멈출게요.';
  const BUILT1 = '1단계를 만들었어요. <code>app.py</code>에 검색 → 답 → 출처를 넣었어요. 실행해서 확인해 주세요.';
  const OPENED = '앱이 열렸어요. 시연 질문을 넣어 확인해 주세요.';
  const COMMIT_Q = '시연 질문 3개 다 됐어. 1단계만 커밋해 줘.';
  const COMMITTED = '<code>MVP 1: 자료 근거 답 + 출처</code>로 커밋했어요. 다음은 2단계예요.';
  const APP_HTML = '<b>실습 질문 도우미</b><p>Q. range(1, 5)는 몇 번 돌아요?</p><p>1에서 시작해 5 앞에서 멈춰요. 직접 세어 볼까요?<br><small>출처: 반복문 학습지 2쪽</small></p>';

  HANIP.unit({
    id: 'c5u3',
    course: '과정 5 · 에이전트와 대회',
    title: '단원 3 · 대회 준비: 공모전과 해커톤',
    goals: ['공모전형과 해커톤형의 차이, 공고문 심사 기준 읽기', '한 장 기획서와 MVP, 에이전트 코딩으로 빠르게 만들기', '개인정보 없는 수업 증거, 3분 데모와 실패 대비'],
    checked: { date: '2026-10-16' },
    sources: [
      'https://www.upstage.ai/mabc-2026',
      'https://www.moe.go.kr/boardCnts/viewRenew.do?boardID=294&boardSeq=105007&lev=0&m=020',
      'https://www.upstage.ai/pricing/api',
      'https://console.upstage.ai/docs/models',
      'https://console.upstage.ai/docs/guides/rate-limits',
      'https://console.upstage.ai/docs/resources/error-codes',
      'https://console.upstage.ai/docs/capabilities/parse/document-parsing',
      'https://github.com/UpstageAI/upstage-extensions-hub',
      'https://cursor.com/docs/agent/plan-mode',
      'https://docs.streamlit.io'
    ],

    figs: {
      /* ---------- L1 설명 그림 ---------- */
      twoRoads: { w: 340, h: 200, label: '연수에서 만든 도구 로봇 앞에서 길이 공모전형과 해커톤형 두 갈래로 나뉘는 모습', draw(P) {
        P.robot(62, 96, 0.5, { mood: 'happy' });
        P.text(62, 158, '연수에서 만든 도구', { size: 13, weight: 700 });
        P.curveArrow(96, 88, 140, 34, 196, 44, { c: 'accent', w: 2.4, head: 9 });
        P.curveArrow(96, 112, 140, 166, 196, 154, { c: 'warm', w: 2.4, head: 9 });
        doc(P, 204, 12, 58, 70, '', 'paper');
        P.text(300, 44, '공모전형', { size: 14, weight: 700, c: 'accent' });
        P.text(300, 66, '서면 → 발표', { size: 11, c: 'ink2' });
        laptop(P, 208, 120, 54, 34, 'sky');
        P.text(300, 140, '해커톤형', { size: 14, weight: 700, c: 'warm' });
        P.text(300, 162, '제작 → 시연', { size: 11, c: 'ink2' });
        P.text(170, 192, '둘 다 글과 시연을 함께 준비해요', { size: 12, c: 'ink2' });
      }},
      compareBoard: { w: 340, h: 200, label: '공모전형 칸에는 보고서와 그래프, 해커톤형 칸에는 노트북 시연과 시계', draw(P) {
        P.rrect(10, 14, 150, 140, 12, { fill: 'sky', gap: 7 });
        P.rrect(180, 14, 150, 140, 12, { fill: 'hi', gap: 7 });
        doc(P, 24, 30, 56, 70, '', 'paper');
        doc(P, 40, 40, 56, 70, '', 'paper');
        bars(P, 108, 104, [22, 34, 48], 10, 5, ['soft', 'sky', 'good']);
        P.text(85, 134, '보고서 + 효과', { size: 12, weight: 700 });
        laptop(P, 196, 36, 70, 46, 'paper');
        play(P, 231, 59, 18);
        clock(P, 302, 62, 40);
        P.text(255, 134, '결과물 + 시연', { size: 12, weight: 700 });
        P.text(170, 88, 'vs', { size: 15, weight: 700, c: 'ink2' });
        P.text(85, 180, '공모전형', { size: 14, weight: 700, c: 'accent' });
        P.text(255, 180, '해커톤형', { size: 14, weight: 700, c: 'warm' });
      }},
      readNotice: { w: 340, h: 200, label: '공고문 쪽지에 자격, 내는 것, 심사 기준, 조건 순서가 있고 돋보기가 옆에 있는 모습', draw(P) {
        P.note(30, 10, 190, 180, { fill: 'paper' });
        P.text(125, 36, '공고문', { size: 15, weight: 700 });
        ['자격', '내는 것', '심사 기준', '조건'].forEach((r, i) => {
          const y = 66 + i * 34;
          P.circle(56, y - 5, 22, { fill: i === 2 ? 'hi' : 'sky', fs: 'solid', w: 1.4 });
          P.text(56, y, String(i + 1), { size: 13, weight: 700 });
          P.text(76, y, r, { size: 14, anchor: 'start', weight: 700 });
          P.line(150, y - 5, 204 - (i % 2) * 14, y - 5, { c: 'soft', w: 3 });
        });
        lens(P, 264, 116, 56);
        P.face(286, 42, 34, { mood: 'wink' });
        P.text(280, 186, '배점 큰 곳에 시간을', { size: 12, c: 'accent', weight: 700 });
      }},

      /* ---------- L1 문제 그림 ---------- */
      q_whichType: { w: 340, h: 200, label: '수업 기록 쪽지와 막대그래프를 가진 사람이 두 갈래 표지판 앞에서 고민하는 모습', draw(P) {
        doc(P, 16, 26, 70, 84, '기록', 'paper', 12);
        bars(P, 30, 172, [16, 28, 40], 12, 6, ['soft', 'sky', 'good']);
        P.line(196, 52, 196, 184, { w: 3 });
        P.path('M168 40 L236 40 L248 52 L236 64 L168 64 Z', { fill: 'sky', gap: 5, w: 1.6 });
        P.path('M224 82 L156 82 L144 94 L156 106 L224 106 Z', { fill: 'hi', gap: 5, w: 1.6 });
        P.text(206, 57, '공모전형', { size: 12, weight: 700 });
        P.text(186, 99, '해커톤형', { size: 12, weight: 700 });
        person(P, 292, 196, 'wow', 0.7);
        ask(P, 292, 98, 24);
      }},
      q_firstRead: { w: 340, h: 200, label: '공고문을 펼친 사람이 무엇부터 볼지 고민하는 모습', draw(P) {
        P.note(24, 14, 150, 156, { fill: 'paper' });
        P.text(99, 42, '공고문', { size: 15, weight: 700 });
        for (let i = 0; i < 6; i++) P.line(40, 66 + i * 17, 150 - (i % 3) * 18, 66 + i * 17, { c: 'soft', w: 3 });
        ask(P, 200, 70, 26);
        ask(P, 220, 108, 20, 'accent');
        person(P, 282, 196, 'wow', 0.75);
        P.text(150, 194, '무엇부터 볼까?', { size: 13, c: 'ink2' });
      }},
      q_blankSubmit: { w: 340, h: 200, label: '공모전 상자에는 기획서와 빈 칸, 해커톤 상자에는 노트북과 시연 화면', draw(P) {
        P.rrect(10, 20, 156, 130, 12, { fill: 'sky', gap: 7 });
        P.rrect(178, 20, 152, 130, 12, { fill: 'hi', gap: 7 });
        doc(P, 22, 40, 54, 70, '', 'paper');
        P.text(96, 82, '+', { size: 22, weight: 700 });
        P.rrect(114, 44, 42, 62, 8, { c: 'accent', w: 1.8 });
        ask(P, 135, 84, 24, 'accent');
        laptop(P, 196, 46, 56, 38, 'paper');
        P.text(276, 74, '+', { size: 22, weight: 700 });
        screen(P, 290, 42, 32, 30);
        play(P, 306, 57, 12);
        P.text(88, 178, '공모전형', { size: 14, weight: 700, c: 'accent' });
        P.text(254, 178, '해커톤형', { size: 14, weight: 700, c: 'warm' });
      }},
      q_weight: { w: 340, h: 200, label: '심사 항목 배점 막대 네 개와 남은 일주일 달력', draw(P) {
        const v = [96, 72, 48, 24];
        bars(P, 30, 150, v, 34, 12, ['good', 'sky', 'soft', 'soft']);
        ['효과', '적용', '기술', '발표'].forEach((t, i) => P.text(47 + i * 46, 170, t, { size: 12, weight: 700 }));
        [40, 30, 20, 10].forEach((n, i) => P.text(47 + i * 46, 150 - v[i] - 6, String(n), { size: 12, c: 'ink2' }));
        P.rrect(232, 30, 96, 80, 8, { fill: 'paper', fs: 'solid', w: 2 });
        P.rect(232, 30, 96, 18, { fill: 'warm', fs: 'solid', w: 1.4 });
        for (let i = 0; i < 7; i++) P.rect(240 + (i % 4) * 21, 56 + Math.floor(i / 4) * 24, 15, 15, { w: 1.2 });
        P.text(280, 132, '남은 일주일', { size: 13, weight: 700 });
        ask(P, 280, 178, 26);
      }},

      /* ---------- L2 설명 그림 ---------- */
      problemFirst: { w: 340, h: 200, label: '손 든 학생 다섯 명과 정신없는 교사 한 명', draw(P) {
        for (let i = 0; i < 5; i++) {
          const cx = 30 + i * 46, cy = 110;
          P.circle(cx, cy, 30, { fill: 'paper' });
          P.face(cx, cy, 26, { mood: i % 2 ? 'wow' : 'smile' });
          P.line(cx + 12, cy - 8, cx + 18, cy - 32, { w: 2.4 });
          P.circle(cx + 18, cy - 36, 9, { fill: 'paper', fs: 'solid', w: 1.4 });
        }
        P.text(122, 40, '선생님! 선생님!', { size: 14, weight: 700, c: 'warm' });
        person(P, 292, 168, 'dizzy', 0.7);
        P.drop(322, 88, 6);
        P.text(122, 160, '손 든 학생은 많고 교사는 한 명', { size: 12, c: 'ink2' });
        P.text(170, 190, '문제 = 장면이 보이는 한 줄', { size: 13, weight: 700, c: 'accent' });
      }},
      myEdge: { w: 340, h: 200, label: '뭐든 답하는 범용 챗봇과, 수업자료 쪽지를 들고 출처를 붙여 답하는 내 수업 도구', draw(P) {
        P.robot(70, 92, 0.5, { mood: 'smile' });
        P.bubble(20, 10, 100, 34, 70, 56);
        P.text(70, 33, '뭐든 답해요', { size: 12 });
        P.text(70, 150, '범용 챗봇', { size: 14, weight: 700 });
        P.text(155, 96, 'vs', { size: 15, weight: 700, c: 'ink2' });
        P.robot(240, 92, 0.5, { mood: 'happy' });
        doc(P, 276, 70, 46, 56, '', 'hi');
        P.bubble(180, 10, 124, 34, 236, 56);
        P.text(242, 33, '자료 2쪽에 따르면', { size: 12 });
        P.text(250, 150, '내 수업 도구', { size: 14, weight: 700, c: 'accent' });
        P.text(170, 186, '근거 · 출처 · 교사 확인', { size: 13, c: 'ink2' });
      }},
      fourParts: { w: 340, h: 200, label: '수업 쪽지를 가운데 두고 학생활동, 교사의 할, 자료, 평가 네 칸', draw(P) {
        doc(P, 135, 56, 70, 84, '수업', 'hi', 13);
        chip(P, 14, 24, 106, 40, '학생활동', 'sky', 14);
        chip(P, 220, 24, 106, 40, '교사의 할', 'good', 14);
        chip(P, 14, 132, 106, 40, '자료', 'paper', 14);
        chip(P, 220, 132, 106, 40, '평가', 'warm', 14);
        P.arrow(120, 52, 136, 66, { c: 'accent', w: 2, head: 7 });
        P.arrow(220, 52, 204, 66, { c: 'accent', w: 2, head: 7 });
        P.arrow(120, 146, 136, 132, { c: 'accent', w: 2, head: 7 });
        P.arrow(220, 146, 204, 132, { c: 'accent', w: 2, head: 7 });
        P.text(170, 192, '4요소가 곧 교육적 효과의 뼈대', { size: 12, c: 'accent' });
      }},
      onePager: { w: 340, h: 200, label: '한 장 기획서 쪽지에 문제, 대상, 해결, 4요소, API, 안전, 효과 측정, 확산 여덟 칸', draw(P) {
        P.note(50, 6, 240, 188, { fill: 'paper' });
        P.text(170, 30, '한 장 기획서', { size: 15, weight: 700 });
        ['문제', '대상', '해결', '4요소', 'API', '안전', '효과 측정', '확산'].forEach((c, i) => {
          const x = 64 + (i % 2) * 112, y = 44 + Math.floor(i / 2) * 36;
          P.rrect(x, y, 100, 28, 6, { fill: ['sky', 'hi', 'good', 'paper'][Math.floor(i / 2)], gap: 5, w: 1.3 });
          P.text(x + 50, y + 19, c, { size: 13, weight: 700 });
        });
        P.face(316, 170, 30, { mood: 'happy' });
      }},

      /* ---------- L2 문제 그림 ---------- */
      q_featProb: { w: 340, h: 200, label: '기획서 첫 줄 "문제:" 뒤가 비어 있고 무엇을 쓸지 고민하는 얼굴', draw(P) {
        P.note(20, 20, 200, 100, { fill: 'paper' });
        P.text(36, 54, '문제:', { size: 16, weight: 700, anchor: 'start' });
        P.line(84, 54, 200, 54, { c: 'accent', w: 2 });
        ask(P, 142, 46, 24, 'accent');
        P.line(36, 82, 190, 82, { c: 'soft', w: 3 });
        P.line(36, 102, 160, 102, { c: 'soft', w: 3 });
        person(P, 282, 196, 'wow', 0.75);
        P.text(120, 160, '첫 줄에 무엇을 쓸까?', { size: 14, c: 'ink2' });
        P.sparkle(30, 168, 6, 'hi');
      }},
      q_measure: { w: 340, h: 200, label: '효과 쪽지와 자, 무엇으로 잴지 고민하는 물음표', draw(P) {
        doc(P, 40, 16, 80, 100, '효과', 'paper', 13);
        P.arrow(130, 66, 186, 66, { c: 'accent', w: 2.4, head: 9 });
        ask(P, 210, 82, 40, 'warm');
        P.face(286, 72, 40, { mood: 'wow' });
        P.rect(20, 130, 300, 26, { fill: 'hi', gap: 5, w: 1.8 });
        for (let i = 0; i <= 15; i++) P.line(20 + i * 20, 130, 20 + i * 20, 130 + (i % 5 ? 8 : 14), { w: 1.4 });
        P.text(170, 190, '무엇으로 잴까?', { size: 13, c: 'ink2' });
      }},
      q_planLine: { w: 340, h: 200, label: '기획서 쪽지 다섯 줄을 돋보기로 살피는 모습', draw(P) {
        P.note(30, 14, 180, 172, { fill: 'paper' });
        P.text(120, 40, '기획서', { size: 15, weight: 700 });
        for (let i = 0; i < 5; i++) {
          P.circle(48, 66 + i * 26, 8, { fill: 'ink', fs: 'solid', c: null });
          P.line(60, 66 + i * 26, 190 - (i % 3) * 20, 66 + i * 26, { c: 'soft', w: 3 });
        }
        lens(P, 252, 104, 62);
        P.face(300, 44, 34, { mood: 'wink' });
        P.text(262, 180, '고칠 줄은?', { size: 13, c: 'ink2' });
      }},
      q_whichApi: { w: 340, h: 200, label: 'HWP 학습지 쪽지에서 물음표 상자를 지나 문항 카드로 가는 길', draw(P) {
        doc(P, 14, 40, 70, 90, 'HWP', 'paper', 13);
        P.arrow(92, 85, 124, 85, { c: 'accent', w: 2.4, head: 9 });
        P.rrect(130, 50, 80, 70, 12, { fill: 'hi', gap: 6 });
        ask(P, 170, 98, 34);
        P.arrow(216, 85, 248, 85, { c: 'accent', w: 2.4, head: 9 });
        ['문항 1', '문항 2', '정답'].forEach((t, i) => {
          P.rrect(254, 36 + i * 36, 70, 30, 6, { fill: 'paper', fs: 'solid', w: 1.6 });
          P.text(289, 56 + i * 36, t, { size: 12, weight: 700 });
        });
        P.text(170, 176, '어떤 API를 거칠까?', { size: 14, c: 'ink2' });
      }},

      /* ---------- QA 그림 ---------- */
      qa_featVsProb: { w: 340, h: 200, label: '쪽지 네 장 앞에서 문제인지 기능인지 고민하는 얼굴', draw(P) {
        for (let i = 0; i < 4; i++) {
          const x = 14 + i * 62, y = 26 + (i % 2) * 14;
          P.note(x, y, 52, 66, { fill: ['paper', 'hi', 'sky', 'paper'][i] });
          P.line(x + 8, y + 26, x + 40, y + 26, { c: 'soft', w: 3 });
          P.line(x + 8, y + 40, x + 34, y + 40, { c: 'soft', w: 3 });
        }
        person(P, 298, 196, 'wow', 0.7);
        ask(P, 298, 98, 24);
        P.text(130, 150, '문제일까, 기능일까?', { size: 14, c: 'ink2' });
      }},
      qa_edge: { w: 340, h: 200, label: '범용 챗봇 로봇과 쪽지를 든 내 도구 로봇, 차이를 묻는 심사위원', draw(P) {
        P.robot(60, 100, 0.45, { mood: 'smile' });
        P.robot(162, 100, 0.45, { mood: 'happy' });
        doc(P, 188, 92, 30, 36, '', 'hi');
        person(P, 290, 196, 'smile', 0.7);
        P.bubble(230, 14, 102, 40, 282, 86);
        P.text(281, 39, '차이가 뭐죠?', { size: 12 });
        P.text(60, 160, '범용 챗봇', { size: 13, weight: 700 });
        P.text(170, 160, '내 도구', { size: 13, weight: 700 });
      }},
      qa_target: { w: 340, h: 200, label: '과녁과 날아가는 화살, 누구를 겨냥할지 묻는 물음표', draw(P) {
        P.circle(110, 96, 140, { fill: 'paper', fs: 'solid', w: 2 });
        P.circle(110, 96, 98, { fill: 'sky', gap: 6, w: 2 });
        P.circle(110, 96, 56, { fill: 'warm', gap: 5, w: 2 });
        P.arrow(310, 30, 230, 70, { w: 3, head: 12 });
        ask(P, 254, 128, 30);
        P.text(250, 186, '누구를 겨냥할까?', { size: 13, c: 'ink2' });
      }},

      /* ---------- L3 설명 그림 ---------- */
      mvpCut: { w: 340, h: 200, label: '긴 기능 목록을 가위로 잘라 세 줄만 남긴 MVP 쪽지', draw(P) {
        P.note(16, 10, 110, 180, { fill: 'paper' });
        for (let i = 0; i < 9; i++) P.line(28, 30 + i * 18, 110 - (i % 3) * 16, 30 + i * 18, { c: i < 3 ? 'accent' : 'soft', w: 3 });
        P.line(10, 75, 132, 75, { c: 'bad', w: 2 });
        P.circle(148, 64, 16, { w: 2 });
        P.circle(148, 86, 16, { w: 2 });
        P.line(154, 70, 178, 82, { w: 2.4 });
        P.line(154, 80, 178, 68, { w: 2.4 });
        P.arrow(188, 75, 222, 75, { c: 'accent', w: 2.4, head: 9 });
        P.note(230, 36, 96, 80, { fill: 'hi' });
        for (let i = 0; i < 3; i++) P.line(244, 58 + i * 18, 306 - i * 8, 58 + i * 18, { c: 'accent', w: 3 });
        P.text(278, 146, 'MVP', { size: 18, weight: 700, c: 'accent' });
        P.text(278, 172, '세 개만, 끝까지', { size: 13, c: 'ink2' });
      }},
      loop4: { w: 340, h: 200, label: 'Plan, Build, 실행 확인, 커밋 네 칸이 도는 고리와 가운데 로봇', draw(P) {
        P.robot(170, 104, 0.4, { mood: 'happy' });
        chip(P, 120, 10, 100, 34, 'Plan', 'sky', 15);
        chip(P, 236, 84, 92, 34, 'Build', 'hi', 15);
        chip(P, 120, 156, 100, 34, '실행 확인', 'good', 14);
        chip(P, 12, 84, 92, 34, '커밋', 'warm', 15);
        P.curveArrow(222, 28, 276, 32, 282, 80, { c: 'accent', w: 2.2, head: 8 });
        P.curveArrow(282, 122, 278, 168, 224, 174, { c: 'accent', w: 2.2, head: 8 });
        P.curveArrow(116, 174, 62, 168, 58, 122, { c: 'accent', w: 2.2, head: 8 });
        P.curveArrow(58, 80, 64, 32, 116, 28, { c: 'accent', w: 2.2, head: 8 });
      }},
      prepBag: { w: 340, h: 200, label: '해커톤 가방에 템플릿 폴더, .env 예시 쪽지, 데모 자료, 핫스팟 휴대폰', draw(P) {
        P.path('M130 60 Q130 24 170 24 Q210 24 210 60', { w: 3 });
        P.rrect(20, 60, 300, 112, 16, { fill: 'sky', gap: 8 });
        folder(P, 36, 80, 64, 48, 'hi');
        P.text(68, 152, '템플릿', { size: 12, weight: 700 });
        P.note(112, 76, 54, 56, { fill: 'paper' });
        P.line(122, 98, 154, 98, { c: 'soft', w: 3 });
        P.line(122, 112, 146, 112, { c: 'soft', w: 3 });
        P.text(139, 152, '.env 예시', { size: 12, weight: 700 });
        doc(P, 182, 76, 50, 56, '', 'paper');
        P.text(207, 152, '데모 자료', { size: 12, weight: 700 });
        phone(P, 254, 72, 36, 62);
        P.path('M262 100 Q272 90 282 100', { c: 'accent', w: 2 });
        P.path('M266 106 Q272 100 278 106', { c: 'accent', w: 2 });
        P.circle(272, 112, 5, { fill: 'accent', fs: 'solid', c: null });
        P.text(272, 152, '핫스팟', { size: 12, weight: 700 });
        P.text(170, 194, '전날 챙겨 두면 첫 한 시간이 살아요', { size: 12, c: 'ink2' });
      }},
      timeTable: { w: 340, h: 200, label: '시계와 6시간 막대, 마지막 칸은 연습 시간이고 새 기능 금지', draw(P) {
        clock(P, 46, 56, 64);
        P.text(46, 112, '6시간 예', { size: 12, weight: 700 });
        const segs = [[1, 'sky'], [2.5, 'good'], [1.5, 'hi'], [1, 'warm']];
        let x = 104;
        segs.forEach(([hh, c]) => { const w = hh * 36.67; P.rect(x, 36, w, 36, { fill: c, fs: c === 'warm' ? 'solid' : 'hachure', gap: 5, w: 1.4 }); x += w; });
        P.text(122, 94, '계획', { size: 12, weight: 700 });
        P.text(186, 94, '만들기', { size: 12, weight: 700 });
        P.text(260, 94, '다듬기', { size: 12, weight: 700 });
        P.text(306, 94, '연습', { size: 12, weight: 700, c: 'warm' });
        P.arrow(306, 138, 306, 104, { c: 'warm', w: 2.2, head: 8 });
        P.text(200, 162, '마지막 한 시간은 새 기능 금지', { size: 14, weight: 700, c: 'warm' });
        P.face(60, 170, 34, { mood: 'proud' });
      }},

      /* ---------- L3 문제 그림 ---------- */
      q_mvpPick: { w: 340, h: 200, label: '기능 쪽지 여섯 장 중 세 칸 상자에 무엇을 담을지 고르는 얼굴', draw(P) {
        for (let i = 0; i < 6; i++) chip(P, 14 + (i % 3) * 74, 16 + Math.floor(i / 3) * 46, 64, 32, '기능 ' + (i + 1), ['sky', 'hi', 'paper'][i % 3], 12);
        P.rrect(40, 116, 186, 56, 10, { c: 'accent', w: 2 });
        for (let i = 0; i < 3; i++) P.rrect(50 + i * 60, 124, 48, 40, 6, { c: 'soft', w: 1.4 });
        P.text(133, 194, 'MVP 칸은 셋', { size: 13, weight: 700, c: 'accent' });
        person(P, 292, 196, 'wow', 0.7);
        ask(P, 292, 98, 24);
      }},
      q_agentFlow: { w: 340, h: 200, label: '뒤섞인 카드: 커밋 점들, 터미널, 계획 쪽지, 망치', draw(P) {
        card(P, 14, 16);
        P.line(26, 50, 94, 50, { w: 2.4 });
        [38, 60, 82].forEach(x => P.circle(x, 50, 14, { fill: 'warm', fs: 'solid', w: 1.4 }));
        card(P, 126, 54);
        term(P, 138, 74, 68, 30, '$ run');
        card(P, 238, 14);
        P.note(262, 22, 44, 54, { fill: 'hi' });
        P.text(284, 58, 'Plan', { size: 11, weight: 700 });
        card(P, 56, 118);
        P.rect(80, 132, 44, 16, { fill: 'ink2', fs: 'solid', w: 1.4 });
        P.line(102, 148, 102, 176, { w: 4 });
        P.robot(276, 150, 0.4, { mood: 'wow' });
        ask(P, 116, 40, 22, 'warm');
        ask(P, 228, 112, 22, 'bad');
        ask(P, 30, 112, 20, 'accent');
      }},
      q_envExample: { w: 340, h: 200, label: '저장소 구름 아래 app.py, .env, .env.example 쪽지와 열쇠, 무엇을 올릴지 묻는 물음표', draw(P) {
        cloud(P, 250, 46, 150, 70, 'sky');
        P.text(250, 54, 'GitHub', { size: 14, weight: 700 });
        P.note(20, 110, 70, 70, { fill: 'paper' });
        P.text(55, 150, 'app.py', { size: 11, mono: true, weight: 700 });
        P.note(104, 110, 70, 70, { fill: 'hi' });
        P.text(139, 140, '.env', { size: 11, mono: true, weight: 700 });
        keyIcon(P, 126, 160, 0.5);
        P.note(232, 110, 90, 70, { fill: 'paper' });
        P.text(277, 150, '.env.example', { size: 11, mono: true, weight: 700 });
        P.arrow(150, 100, 186, 76, { c: 'soft', w: 2, head: 8 });
        ask(P, 96, 70, 28);
      }},
      q_lastHour: { w: 340, h: 200, label: '남은 한 시간을 가리키는 시계, 두 층은 다 짓고 한 층은 비어 있는 탑, 고민하는 얼굴', draw(P) {
        clock(P, 60, 70, 84);
        P.text(60, 140, '남은 1시간', { size: 13, weight: 700, c: 'warm' });
        P.rect(150, 136, 70, 40, { fill: 'good', gap: 5, w: 2 });
        P.rect(150, 96, 70, 40, { fill: 'good', gap: 5, w: 2 });
        P.rect(150, 56, 70, 40, { c: 'soft', w: 1.6 });
        P.text(185, 162, '1', { size: 16, weight: 700 });
        P.text(185, 122, '2', { size: 16, weight: 700 });
        ask(P, 185, 84, 22, 'soft');
        person(P, 292, 196, 'wow', 0.7);
      }},

      /* ---------- L4 설명 그림 ---------- */
      evidenceBox: { w: 340, h: 200, label: '증거 상자에 차시 달력, 기록 숫자, 소감 말풍선, 성취 그래프', draw(P) {
        P.text(170, 22, '수업 적용 증거', { size: 14, weight: 700 });
        P.rrect(14, 32, 312, 150, 14, { fill: 'hi', gap: 8 });
        P.rrect(30, 50, 60, 54, 6, { fill: 'paper', fs: 'solid', w: 1.6 });
        P.rect(30, 50, 60, 12, { fill: 'warm', fs: 'solid', w: 1.2 });
        for (let i = 0; i < 6; i++) P.rect(36 + (i % 3) * 18, 68 + Math.floor(i / 3) * 16, 12, 12, { w: 1 });
        P.text(60, 128, '차시 계획', { size: 12, weight: 700 });
        P.rrect(106, 50, 60, 54, 6, { fill: 'paper', fs: 'solid', w: 1.6 });
        P.text(136, 86, '41', { size: 22, weight: 700, c: 'accent' });
        P.text(136, 128, '사용 기록', { size: 12, weight: 700 });
        P.bubble(182, 50, 64, 42, 196, 106);
        P.text(214, 77, '좋아요', { size: 12 });
        P.text(214, 128, '학생 반응', { size: 12, weight: 700 });
        bars(P, 266, 104, [20, 34, 48], 12, 5, ['soft', 'sky', 'good']);
        P.text(290, 128, '성취 자료', { size: 12, weight: 700 });
        P.text(170, 164, '수업 전에 무엇을 모을지 정해요', { size: 13, c: 'ink2' });
      }},
      noNames: { w: 340, h: 200, label: '이름 칸을 검게 가린 대화 기록이 반 통계 그래프로 바뀌는 모습', draw(P) {
        P.note(16, 24, 120, 140, { fill: 'paper' });
        P.text(76, 48, '대화 기록', { size: 13, weight: 700 });
        for (let i = 0; i < 4; i++) {
          const y = 76 + i * 22;
          P.rect(28, y - 8, 30, 12, { fill: 'ink', fs: 'solid', c: null });
          P.line(66, y - 2, 124 - (i % 2) * 14, y - 2, { c: 'soft', w: 3 });
        }
        P.arrow(146, 94, 190, 94, { c: 'accent', w: 2.6, head: 10 });
        P.note(200, 24, 124, 140, { fill: 'hi' });
        P.text(262, 48, '반 통계', { size: 13, weight: 700 });
        bars(P, 222, 146, [30, 52, 70], 18, 10, ['sky', 'sky', 'good']);
        P.text(170, 190, '이름·번호·얼굴은 빼고', { size: 13, c: 'accent', weight: 700 });
      }},
      beforeAfter: { w: 340, h: 200, label: '같은 자로 잰 사전과 사후 막대 두 개', draw(P) {
        bars(P, 60, 150, [50, 82], 50, 40, ['soft', 'good']);
        P.text(85, 172, '사전', { size: 14, weight: 700 });
        P.text(175, 172, '사후', { size: 14, weight: 700 });
        P.rect(270, 30, 26, 120, { fill: 'hi', gap: 5, w: 1.8 });
        for (let i = 0; i <= 6; i++) P.line(270, 30 + i * 20, 270 + (i % 3 ? 8 : 14), 30 + i * 20, { w: 1.4 });
        P.text(283, 172, '같은 자', { size: 13, weight: 700, c: 'accent' });
        P.text(150, 196, '같은 문항, 같은 기준', { size: 13, c: 'ink2' });
        P.sparkle(30, 40, 7, 'hi');
      }},
      reportSix: { w: 340, h: 200, label: '보고서 쪽지에 1부터 6까지 여섯 칸이 쌓인 모습', draw(P) {
        P.note(60, 6, 220, 190, { fill: 'paper' });
        ['문제와 배경', '도구 설계', '수업 적용', '결과', '안전과 윤리', '한계와 확산'].forEach((s, i) => {
          const y = 18 + i * 29;
          P.rrect(76, y, 186, 24, 6, { fill: i === 2 || i === 3 ? 'hi' : 'sky', gap: 5, w: 1.2 });
          P.text(92, y + 17, String(i + 1), { size: 13, weight: 700 });
          P.text(110, y + 17, s, { size: 13, anchor: 'start' });
        });
        P.face(312, 168, 34, { mood: 'smile' });
      }},

      /* ---------- L4 문제 그림 ---------- */
      q_bestEvidence: { w: 340, h: 200, label: '결과 폴더 앞에 쪽지, 사진, 그래프가 흩어져 있고 무엇을 넣을지 고민하는 얼굴', draw(P) {
        folder(P, 20, 70, 130, 100, 'hi');
        P.text(85, 130, '결과', { size: 16, weight: 700 });
        P.note(166, 16, 50, 60, { fill: 'paper' });
        P.line(174, 40, 204, 40, { c: 'soft', w: 3 });
        P.line(174, 54, 198, 54, { c: 'soft', w: 3 });
        P.rrect(228, 22, 60, 46, 4, { fill: 'sky', gap: 5, w: 1.6 });
        P.path('M232 64 L248 42 L260 56 L270 46 L284 64', { w: 1.6 });
        bars(P, 172, 160, [16, 26, 36], 10, 6, ['soft', 'sky', 'good']);
        ask(P, 246, 120, 26);
        person(P, 296, 196, 'wow', 0.7);
      }},
      q_reportLine: { w: 340, h: 200, label: '보고서 메모 쪽지를 돋보기로 살피는 얼굴', draw(P) {
        P.note(130, 14, 190, 172, { fill: 'paper' });
        P.text(225, 40, '보고서 메모', { size: 14, weight: 700 });
        for (let i = 0; i < 5; i++) P.line(148, 66 + i * 24, 300 - (i % 2) * 20, 66 + i * 24, { c: 'soft', w: 3 });
        lens(P, 70, 86, 70);
        P.face(56, 168, 34, { mood: 'wow' });
      }},
      q_overclaim: { w: 340, h: 200, label: '조금 오른 막대 두 개와 크게 외치려는 확성기, 어떻게 쓸지 묻는 물음표', draw(P) {
        bars(P, 30, 156, [60, 84], 40, 20, ['soft', 'good']);
        P.text(50, 178, '2.7', { size: 13, weight: 700 });
        P.text(110, 178, '3.6', { size: 13, weight: 700 });
        P.rect(154, 92, 16, 20, { fill: 'paper', fs: 'solid', w: 2 });
        P.path('M170 92 L230 62 L230 142 L170 112 Z', { fill: 'hi', gap: 5, w: 2 });
        ask(P, 274, 110, 44, 'warm');
        P.text(260, 178, '어떻게 쓸까?', { size: 13, c: 'ink2' });
      }},
      q_reportBlank: { w: 340, h: 200, label: '여섯 칸 보고서에서 셋째 칸이 비어 있는 모습', draw(P) {
        P.note(70, 8, 200, 186, { fill: 'paper' });
        for (let i = 0; i < 6; i++) {
          const y = 20 + i * 28;
          if (i === 2) { P.rrect(86, y, 168, 22, 6, { c: 'accent', w: 1.6 }); ask(P, 176, y + 18, 17, 'accent'); }
          else P.rrect(86, y, 168, 22, 6, { fill: 'sky', gap: 5, w: 1.2 });
          P.text(100, y + 16, String(i + 1), { size: 12, weight: 700 });
        }
        P.face(304, 160, 34, { mood: 'wink' });
      }},

      /* ---------- QB 그림 ---------- */
      qb_demoEvid: { w: 340, h: 200, label: '시연 화면과 기록 폴더 사이의 물음표', draw(P) {
        screen(P, 20, 30, 120, 80);
        play(P, 80, 70, 26);
        P.text(80, 150, '데모', { size: 15, weight: 700 });
        folder(P, 200, 40, 120, 80, 'hi');
        doc(P, 230, 56, 40, 50, '', 'paper');
        P.text(260, 150, '증거', { size: 15, weight: 700 });
        ask(P, 170, 84, 30);
        P.text(170, 186, '무엇이 다를까?', { size: 13, c: 'ink2' });
      }},
      qb_mvpMean: { w: 340, h: 200, label: 'MVP 글자 상자 주위의 물음표 셋과 놀란 얼굴', draw(P) {
        P.rrect(100, 60, 140, 70, 14, { fill: 'hi', gap: 6 });
        P.text(170, 108, 'MVP', { size: 34, weight: 700, c: 'accent' });
        ask(P, 60, 60, 30);
        ask(P, 290, 80, 26, 'accent');
        ask(P, 250, 176, 24, 'bad');
        P.face(70, 152, 40, { mood: 'wow' });
      }},
      qb_spread: { w: 340, h: 200, label: '학교 건물 하나와 작은 학교 건물 사이의 물음표', draw(P) {
        school(P, 24, 56, 110, 110);
        school(P, 236, 96, 70, 70);
        P.curveArrow(140, 100, 186, 50, 230, 104, { c: 'accent', w: 2.2, head: 8 });
        ask(P, 186, 110, 28);
        P.text(170, 192, '확산 가능성이란?', { size: 13, c: 'ink2' });
      }},

      /* ---------- L5 설명 그림 ---------- */
      threeMin: { w: 340, h: 200, label: '3분 시계와 문제 30초, 시연 90초, 효과 40초, 확산 20초로 나눈 막대', draw(P) {
        clock(P, 44, 56, 70);
        P.text(44, 116, '3분', { size: 16, weight: 700, c: 'accent' });
        const k = 228 / 180;
        let x = 100;
        [[30, 'soft', '문제'], [90, 'good', '시연'], [40, 'sky', '효과'], [20, 'hi', '확산']].forEach(([s, c, t]) => {
          const w = s * k;
          P.rect(x, 40, w, 40, { fill: c, gap: 5, w: 1.4 });
          P.text(x + w / 2, 66, s + '초', { size: 11 });
          P.text(x + w / 2, 100, t, { size: 12, weight: 700 });
          x += w;
        });
        P.text(200, 150, '한 줄기만, 정한 질문으로', { size: 14, weight: 700, c: 'accent' });
        P.face(60, 168, 34, { mood: 'happy' });
      }},
      backupPlan: { w: 340, h: 200, label: '끊긴 와이파이 옆에 녹화본, 미리 받은 답, 핫스팟 세 겹의 대비', draw(P) {
        wifi(P, 64, 90, 1.2, false);
        P.text(64, 132, '막혀도', { size: 13, weight: 700 });
        P.text(64, 154, '보여 줄 길', { size: 13, weight: 700 });
        [['녹화본', 'sky'], ['미리 받은 답', 'hi'], ['핫스팟', 'good']].forEach(([t, c], i) => {
          const y = 20 + i * 58;
          P.rrect(140, y, 186, 46, 10, { fill: c, gap: 6, w: 1.6 });
          P.text(198, y + 29, t, { size: 14, weight: 700, anchor: 'start' });
        });
        play(P, 168, 43, 18);
        P.text(168, 106, '{ }', { size: 14, weight: 700, mono: true });
        phone(P, 156, 140, 22, 34);
      }},
      qnaCards: { w: 340, h: 200, label: '안전, 비용, 확산, 소버린, 한국어 다섯 장의 예상 질문 카드', draw(P) {
        P.text(170, 26, '예상 질문 다섯', { size: 14, weight: 700 });
        [['안전', 'bad'], ['비용', 'hi'], ['확산', 'good'], ['소버린', 'sky'], ['한국어', 'warm']].forEach(([t, c], i) => {
          const x = 9 + i * 66;
          P.rrect(x, 40, 58, 80, 10, { fill: 'paper', fs: 'solid', w: 1.8 });
          P.rrect(x + 4, 44, 50, 16, 5, { fill: c, fs: 'solid', w: 1 });
          ask(P, x + 29, 100, 26);
          P.text(x + 29, 142, t, { size: 12, weight: 700 });
        });
        P.text(170, 184, '답의 뼈대를 미리 써 둬요', { size: 13, c: 'accent' });
      }},
      readmeKey: { w: 340, h: 200, label: 'README 쪽지는 GitHub 구름으로 올라가고, 열쇠에는 X 표시', draw(P) {
        doc(P, 20, 30, 120, 150, 'README.md', 'paper', 12);
        cloud(P, 262, 48, 130, 64, 'sky');
        P.text(262, 56, 'GitHub', { size: 13, weight: 700 });
        P.arrow(150, 110, 210, 84, { c: 'accent', w: 2.4, head: 9 });
        keyIcon(P, 222, 146, 0.8);
        cross(P, 240, 146, 18);
        P.text(262, 192, '.env는 빼고', { size: 13, weight: 700, c: 'bad' });
      }},

      /* ---------- L5 문제 그림 ---------- */
      q_wifiDown: { w: 340, h: 200, label: '끊긴 와이파이와 시연 화면, 놀란 발표자', draw(P) {
        wifi(P, 70, 86, 1.3, false);
        screen(P, 138, 30, 112, 76);
        play(P, 194, 68, 24);
        person(P, 294, 196, 'wow', 0.7);
        P.drop(326, 110, 6);
        P.text(150, 168, '시연 직전, 와이파이가 끊겼다', { size: 13, c: 'ink2' });
      }},
      q_costAns: { w: 340, h: 200, label: '동전 더미와 한 학기 비용을 묻는 심사위원', draw(P) {
        [0, 1, 2, 3].forEach(i => P.ellipse(70, 150 - i * 14, 70, 22, { fill: 'hi', fs: 'solid', w: 1.8 }));
        P.text(70, 80, '$', { size: 30, weight: 700, c: 'warm' });
        ask(P, 160, 120, 28);
        person(P, 282, 196, 'smile', 0.7);
        P.bubble(186, 14, 140, 44, 272, 88);
        P.text(256, 41, '한 학기 얼마예요?', { size: 12 });
      }},
      q_readmeLine: { w: 340, h: 200, label: 'README 쪽지 옆의 열쇠와 물음표, 놀란 얼굴', draw(P) {
        doc(P, 30, 12, 170, 176, 'README', 'paper', 14);
        keyIcon(P, 236, 100, 0.9);
        ask(P, 262, 70, 24, 'bad');
        P.face(292, 160, 38, { mood: 'wow' });
      }},
      q_sovAns: { w: 340, h: 200, label: '지구본과 왜 이 모델인지 묻는 심사위원', draw(P) {
        P.circle(80, 96, 110, { fill: 'sky', gap: 7, w: 2 });
        P.ellipse(80, 96, 50, 110, { w: 1.4 });
        P.line(25, 96, 135, 96, { w: 1.4 });
        person(P, 272, 196, 'smile', 0.75);
        P.bubble(180, 14, 150, 50, 264, 100);
        P.text(255, 45, '왜 이 모델이에요?', { size: 13 });
        ask(P, 160, 176, 22);
      }},

      /* ---------- 형성평가 그림 ---------- */
      t_trainEnd: { w: 340, h: 200, label: '연수장 노트북 속 챗봇 로봇과, 트로피를 떠올리는 교사', draw(P) {
        laptop(P, 24, 64, 120, 76, 'paper');
        P.robot(84, 106, 0.36, { mood: 'happy' });
        P.text(84, 180, '연수 2일차 끝', { size: 13, weight: 700 });
        person(P, 282, 196, 'smile', 0.75);
        P.bubble(176, 10, 110, 72, 250, 104);
        trophy(P, 216, 44, 0.8);
        ask(P, 266, 56, 20);
      }},
      t_planBlank: { w: 340, h: 200, label: '기획서 쪽지의 칸 이름 중 두 곳이 비어 있는 모습', draw(P) {
        P.note(30, 14, 200, 172, { fill: 'paper' });
        P.text(130, 40, '기획서', { size: 15, weight: 700 });
        for (let i = 0; i < 4; i++) {
          const y = 72 + i * 30;
          if (i === 1 || i === 3) { P.rrect(46, y - 14, 48, 22, 5, { c: 'accent', w: 1.6 }); ask(P, 70, y + 4, 16, 'accent'); }
          else P.rrect(46, y - 14, 48, 22, 5, { fill: 'sky', gap: 5, w: 1.2 });
          P.line(104, y - 3, 210 - (i % 2) * 20, y - 3, { c: 'soft', w: 3 });
        }
        P.face(286, 100, 44, { mood: 'wink' });
        P.sparkle(300, 160, 7, 'hi');
      }},
      t_hackOrder: { w: 340, h: 200, label: '뒤섞인 카드: 템플릿 폴더, 시계, 도는 화살표, 발표 화면, 뿌듯한 얼굴', draw(P) {
        card(P, 12, 14);
        folder(P, 30, 26, 56, 44, 'hi');
        card(P, 124, 48);
        clock(P, 170, 83, 46);
        card(P, 236, 12);
        P.curveArrow(256, 56, 282, 18, 310, 52, { c: 'accent', w: 2.2, head: 8 });
        P.curveArrow(310, 62, 284, 80, 258, 64, { c: 'accent', w: 2.2, head: 8 });
        card(P, 50, 120);
        screen(P, 70, 128, 52, 30);
        play(P, 96, 143, 14);
        card(P, 196, 122);
        P.face(242, 157, 40, { mood: 'proud' });
        ask(P, 114, 42, 20, 'warm');
        ask(P, 226, 110, 20, 'bad');
        ask(P, 318, 152, 22, 'accent');
      }},
      t_oldModel: { w: 340, h: 200, label: '모델 이름이 물음표인 코드 창과 옛 예제에 어지러운 로봇', draw(P) {
        win(P, 14, 14, 200, 140);
        P.text(28, 60, 'MODEL = "?"', { mono: true, size: 13, anchor: 'start', c: 'k' });
        P.line(28, 84, 170, 84, { c: 'soft', w: 3 });
        P.line(28, 106, 150, 106, { c: 'soft', w: 3 });
        P.line(28, 128, 180, 128, { c: 'soft', w: 3 });
        P.robot(274, 92, 0.5, { mood: 'dizzy' });
        P.text(274, 152, '옛 예제', { size: 13, weight: 700, c: 'bad' });
        P.text(114, 186, '연수장에서 급하게 맡겼더니', { size: 12, c: 'ink2' });
      }},
      t_consentLine: { w: 340, h: 200, label: '보고서에 실을 자료 점검표와 카메라, 물음표', draw(P) {
        P.note(20, 12, 200, 176, { fill: 'paper' });
        P.text(120, 38, '실을 자료 점검', { size: 14, weight: 700 });
        for (let i = 0; i < 5; i++) {
          const y = 64 + i * 25;
          P.rect(36, y - 10, 14, 14, { w: 1.4 });
          P.line(60, y - 3, 200 - (i % 2) * 24, y - 3, { c: 'soft', w: 3 });
        }
        P.rect(254, 62, 20, 10, { w: 1.6 });
        P.rrect(240, 70, 80, 56, 8, { fill: 'sky', gap: 5, w: 2 });
        P.circle(280, 98, 30, { fill: 'paper', fs: 'solid', w: 2 });
        ask(P, 280, 166, 26);
      }},
      t_compare: { w: 340, h: 200, label: '눈금 간격이 다른 두 자와 사전·사후 막대, 물음표', draw(P) {
        P.rect(30, 30, 24, 130, { fill: 'hi', gap: 5, w: 1.6 });
        for (let i = 0; i <= 5; i++) P.line(30, 30 + i * 26, 40, 30 + i * 26, { w: 1.4 });
        P.text(42, 182, '쉬운 잣대', { size: 12, weight: 700 });
        P.rect(130, 30, 24, 130, { fill: 'warm', gap: 5, w: 1.6 });
        for (let i = 0; i <= 10; i++) P.line(130, 30 + i * 13, 138, 30 + i * 13, { w: 1.4 });
        P.text(142, 182, '어려운 잣대', { size: 12, weight: 700 });
        bars(P, 200, 160, [80, 56], 30, 16, ['soft', 'bad']);
        P.text(215, 182, '사전', { size: 12, weight: 700 });
        P.text(261, 182, '사후', { size: 12, weight: 700 });
        ask(P, 312, 90, 30);
      }},
      t_rate429: { w: 340, h: 200, label: '얼굴 다섯이 한꺼번에 API 상자로 화살표를 보내고 429 딱지가 붙은 모습', draw(P) {
        for (let i = 0; i < 5; i++) {
          const y = 26 + i * 32;
          P.face(36, y, 26, { mood: 'smile' });
          P.arrow(54, y, 150, 100 + (i - 2) * 6, { c: 'soft', w: 1.8, head: 7 });
        }
        P.rrect(160, 60, 80, 80, 12, { fill: 'sky', gap: 6 });
        P.text(200, 108, 'API', { size: 16, weight: 700 });
        P.rrect(250, 40, 76, 36, 8, { fill: 'bad', fs: 'solid', w: 1.6 });
        P.text(288, 64, '429', { size: 18, weight: 700, c: 'paper' });
        P.face(288, 140, 44, { mood: 'dizzy' });
      }},
      t_spreadQ: { w: 340, h: 200, label: '학교 건물과 우리 학교에서도 되는지 묻는 심사위원', draw(P) {
        school(P, 20, 70, 100, 100);
        ask(P, 150, 110, 28);
        person(P, 284, 196, 'smile', 0.7);
        P.bubble(196, 14, 134, 46, 276, 100);
        P.text(263, 43, '우리 학교도요?', { size: 12 });
      }},
      t_demoHonest: { w: 340, h: 200, label: '미리 받은 답 파일을 띄운 화면과 말하려는 발표자', draw(P) {
        screen(P, 20, 30, 140, 90);
        P.text(90, 70, '{ }', { size: 22, weight: 700, mono: true, c: 'accent' });
        P.text(90, 100, 'demo_answers', { size: 11, mono: true });
        person(P, 272, 196, 'smile', 0.75);
        P.bubble(180, 14, 140, 50, 264, 100);
        ask(P, 250, 48, 22);
      }},
      t_oldKey: { w: 340, h: 200, label: 'Git 기록의 커밋 점들 중 석 달 전 점에 열쇠가 붙어 있고, 공개할지 묻는 구름', draw(P) {
        P.line(20, 120, 250, 120, { w: 2.4 });
        [40, 90, 140, 190, 240].forEach((x, i) => P.circle(x, 120, 18, { fill: i === 1 ? 'warm' : 'good', fs: 'solid', w: 1.4 }));
        keyIcon(P, 80, 84, 0.7);
        P.text(90, 152, '석 달 전', { size: 12, weight: 700, c: 'warm' });
        P.text(240, 152, '지금', { size: 12, weight: 700 });
        cloud(P, 270, 50, 120, 60, 'sky');
        P.text(270, 56, '공개?', { size: 14, weight: 700 });
        P.face(300, 170, 34, { mood: 'wow' });
      }}
    },

    items: [
    /* =================== L1 =================== */
    { id: 'L1', type: 'lesson', title: '공모전형과 해커톤형', sub: '내는 것, 심사에서 보는 것, 준비 기간', min: 8, steps: [
      { t: 'say', h: '연수에서 만든 도구, 대회로 키워 봐요', fig: 'twoRoads', p: [
        '기반연수에서 자동채점·AI 튜터(트랙 A)나 자료 기반 챗봇(트랙 B)을 만들었죠. 과정 5에서는 도구를 쓰는 에이전트(c5u1)와 역할을 나눈 팀(c5u2)까지 해 봤어요. 이제 이걸 <b>대회</b>에 내서 다른 교사들에게 보여 줄 차례예요.',
        '교사가 나갈 만한 대회는 크게 두 갈래예요. 기획서와 수업 적용 결과를 내고 심사받는 <b>공모전형</b>, 정해진 시간 안에 만들어 시연하는 <b>해커톤형</b>이에요. 서면 심사 뒤 발표·시연을 하는 대회가 많아서, 어느 쪽이든 <b>글과 시연</b>을 함께 준비하게 돼요.',
        '이 단원은 두 쪽을 함께 대비해요. L2에서 두 대회에 다 쓰는 한 장 기획서를, L3에서 해커톤용 빠른 제작을, L4에서 공모전용 증거를, L5에서 발표를 준비해요.'
      ]},
      { t: 'say', h: '두 갈래는 내는 것도, 보는 것도 달라요', fig: 'compareBoard', table: { head: ['', '공모전형', '해커톤형'], rows: [
        ['내는 것', '기획서·수업설계안, 수업 적용 보고서(서면)', '돌아가는 결과물, 시연, 짧은 소개 자료'],
        ['심사에서 보는 것(예)', '교육적 효과, 현장 적용, 확산 가능성', '완성도, 기술, 창의성, 발표'],
        ['준비 기간', '수업에 써 보고 결과를 모으는 몇 주~한 학기', '행사는 하루짜리부터 몇 주짜리까지, 준비는 미리'] ] }, p: [
        '표의 심사 항목은 준비를 돕는 <b>예</b>예요. 실제 항목과 배점은 대회마다 다르고 해마다 바뀌어요. 배점을 미리 공개하지 않는 대회도 많아요.',
        '공모전형은 "수업에서 정말 도움이 됐나"를 <b>증거</b>로 보여 주는 싸움이에요. 해커톤형은 "짧은 시간에 진짜 돌아가는 걸 만들었나"를 <b>눈앞에서</b> 보여 주는 싸움이에요.'
      ], tip: '어느 대회든 첫 할 일은 같아요. <b>공고문의 심사 기준을 먼저 읽어요.</b>' },
      { t: 'say', h: '2026년에 열린 대회로 보는 유형 예', table: { head: ['유형', '2026년 기준 예(주최)', '형식'], rows: [
        ['교육 데이터 아이디어 공모', '교육 공공데이터 AI 활용대회(교육부·시도교육청 주최, KERIS 주관)', '교사도 일반부 아이디어 기획으로 참가, 서면 심사 → 발표 심사'],
        ['교육청 해커톤', '서울시교육청 AI·데이터 활용 누구나 개발자 해커톤', '학교 현장 문제를 AI·데이터로 풀기, 결과물은 오픈소스로 공유'],
        ['기업·정부가 함께하는 챌린지', 'MABC(업스테이지·타임리, 과기정통부와 함께)', '코딩 없이 Solar 기반 에이전트 만들기, 예선 → 결선 → 발표'],
        ['여러 대회 묶음', '전국민 AI 경진대회(과기정통부 주최)', '세부 대회마다 대상·형식이 달라요'] ] }, p: [
        '이 표는 홍보가 아니라 <b>유형을 보여 주는 예</b>예요. 날짜와 상, 자세한 참가 자격은 해마다 바뀌니 적지 않았어요. 내년에 비슷한 대회가 열릴지도 공고를 직접 확인해야 해요.',
        '참가 자격을 꼭 봐요. 만 19세 이상만, 예비교원만, 1~3인 팀처럼 조건이 다 달라요. 연수를 함께 들은 동료와 팀을 짜는 것도 좋은 방법이에요.'
      ]},
      { t: 'say', h: '공고문은 이 순서로 읽어요', fig: 'readNotice', p: [
        '<b>① 참가 자격</b>(교사도 되나, 팀은 몇 명) → <b>② 내는 것</b>(서식, 쪽수, 영상 길이) → <b>③ 심사 기준과 배점</b> → <b>④ 조건</b>(써야 하는 데이터·도구, 결과물 공개·권리) 순서로 읽어요.',
        '심사 기준은 표로 옮겨 적고, <b>배점이 큰 항목에 시간을 많이</b> 써요. 예를 들어 "교육적 효과 40점"이라면 기능을 하나 더 넣기보다 수업 증거를 하나 더 모으는 게 이득이에요.',
        '④ 조건은 놓치기 쉬워요. 써야 할 데이터가 정해져 있거나, 결과물을 공개 저장소로 내라는 대회가 있어요. 공개해야 한다면 키와 학생 자료가 들어가지 않게 L5에서 정리해요.'
      ]},
      { t: 'q', kind: 'mc', fig: 'q_whichType', q: '1학기에 내 질문 도우미를 두 반 수업에 써 봤고, 학생 설문과 사전·사후 점수가 있어요. 이 자료가 가장 빛나는 대회 유형은?',
        opts: ['이틀 동안 새로 만들어 시연하는 해커톤형', '기획서와 수업 적용 결과를 서면으로 내는 공모전형', '코딩 없이 에이전트를 만드는 챌린지형', '어느 유형이든 결과물만 보니 상관없다'], a: 1,
        why: '수업에 써 본 기록과 전후 비교는 공모전형이 보는 <b>교육적 효과·현장 적용</b>의 증거예요. 해커톤 소개에 한 줄 쓸 수는 있지만, 가장 빛나는 곳은 공모전이에요.',
        ex: ['해커톤은 그 자리에서 만든 결과물과 시연이 중심이에요. 한 학기 수업 기록을 펼칠 시간은 짧아요.', '', '노코드 챌린지는 에이전트 결과물을 봐요. 수업 증거가 중심은 아니에요.', '대회마다 보는 것이 달라요. 그래서 공고문의 심사 기준부터 읽어요.'] },
      { t: 'q', kind: 'mc', fig: 'q_firstRead', q: '마음에 드는 대회 공고문을 찾았어요. 기획서를 쓰기 전에 가장 먼저 확인할 것은?',
        opts: ['작년 수상작의 화면 디자인', '결선 발표장의 위치와 교통편', '상금 액수와 시상식 날짜', '참가 자격과 심사 기준·배점'], a: 3,
        why: '교사가 낼 수 있는지(자격)부터 보고, 무엇으로 점수를 매기는지(심사 기준·배점)를 알아야 기획서에서 무엇을 힘줘 쓸지 정할 수 있어요.',
        ex: ['참고는 되지만 올해 심사 기준이 다를 수 있어요.', '결선에 간 다음에 봐도 늦지 않아요.', '동기는 되지만 준비 방향을 정해 주지는 않아요.', ''] },
      { t: 'q', kind: 'blank', fig: 'q_blankSubmit', q: '두 유형에서 내는 것을 정리했어요. 빈칸에 들어갈 것은?', lang: 'plain', code: '공모전형: 기획서 + [[1]]\n해커톤형: 결과물 + 시연',
        opts: ['수업 적용 보고서', '3분 녹화 영상만', '소스 코드 전체', '학생 명단'], a: 0,
        why: '공모전형은 기획서와 함께 <b>수업에 적용한 결과</b>를 서면으로 내요. 해커톤형은 돌아가는 결과물을 시연으로 보여 줘요.',
        ex: ['', '영상을 함께 내는 대회도 있지만 공모전의 중심은 수업 적용 결과예요.', '코드는 해커톤 쪽에서 더 중요해요. 공모전은 수업에서의 효과를 봐요.', '학생 명단은 개인정보라 내지 않아요.'] },
      { t: 'q', kind: 'mc', fig: 'q_weight', q: '어떤 공고문에 "교육적 효과 40, 현장 적용 30, 기술 20, 발표 10"이라고 적혀 있다고 해 봐요. 마감까지 일주일, 무엇에 시간을 가장 많이 쓸까요?',
        opts: ['로그인·통계 같은 기능을 더 붙여 기술 점수를 올린다', '발표 화면 디자인과 글꼴을 공들여 다듬는다', '수업 기록과 학생 반응을 정리해 효과를 보여 준다', '모델을 바꿔 가며 가장 똑똑한 답을 찾는다'], a: 2,
        why: '배점이 큰 항목(교육적 효과·현장 적용 70점)에 시간을 많이 써요. 이미 돌아가는 도구라면 기능 하나보다 수업 증거 하나가 점수에 더 닿아요.',
        ex: ['기술은 20점이에요. 이미 돌아간다면 기능을 더 붙이는 효과가 작아요.', '발표는 10점이에요. 깔끔하면 좋지만 가장 큰 몫은 아니에요.', '', '모델 비교는 기술 쪽 이야기예요. 배점이 큰 교육적 효과와 거리가 멀어요.'] },
      { t: 'sum', pts: ['대회는 두 갈래: 공모전형(기획서·수업 적용 보고서 → 교육적 효과·현장 적용·확산)과 해커톤형(결과물·시연 → 완성도·기술·창의성·발표).', '대회 이름·날짜·배점은 해마다 바뀐다. 2026년 대회는 유형을 보여 주는 예일 뿐, 지금 열리는 공고문을 직접 찾는다.', '공고문은 참가 자격 → 내는 것 → 심사 기준·배점 → 조건 순서로 읽고, 배점이 큰 항목에 시간을 쓴다.'] }
    ]},

    /* =================== L2 =================== */
    { id: 'L2', type: 'lesson', title: '문제부터 쓰는 한 장 기획서', sub: '현장 문제, 차별점, 4요소, 기획서 여덟 칸', min: 10, steps: [
      { t: 'say', h: '기능이 아니라 문제부터 써요', fig: 'problemFirst', p: [
        '"Solar로 챗봇을 만들었어요"는 <b>기능</b>이에요. 심사위원이 궁금한 건 "그래서 교실의 무엇이 나아졌나"예요. 그러니 첫 줄은 <b>현장 문제</b>로 시작해요.',
        '좋은 문제는 장면이 보여요. "파이썬 실습 시간에 손 든 학생은 많은데 교사는 한 명이라, 기다리다 포기하는 학생이 생긴다"처럼 <b>누가, 언제, 무엇이</b> 어려운지가 들어가요.',
        '문제가 분명하면 해결도 작아져요. "모든 과목 AI 도우미"가 아니라 "이 단원 실습 자료를 근거로 힌트를 주는 질문 도우미"처럼요.'
      ]},
      { t: 'say', h: '차별점: 범용 챗봇이 아니라 내 수업의 도구', fig: 'myEdge', p: [
        '심사에서 자주 나올 질문이 "그냥 범용 AI 챗봇을 쓰면 되지 않나요?"예요. 답은 차별점이에요. <b>내 수업자료를 근거로 답하고(RAG)</b>, 출처를 보여 주고, 정답을 통째로 주지 않고, 교사가 기록을 확인하는 구조가 범용 챗봇과 다른 점이에요.',
        '한국어 자료도 강점이 될 수 있어요. 학습지·공문이 HWP여도 Document Parse가 읽고(지원 형식은 직접 확인), Solar는 한국어를 다뤄요. 다만 "국산이라 좋다"로 끝내지 말고 <b>이 수업에서 왜 중요한지</b>를 말해요.',
        '소버린 AI를 내세운다면 c1u1에서 본 대로 <b>선택지와 통제권</b>으로 말해요. 학생 데이터를 어디로 보내는지 알고 골랐다는 점, 모델 이름을 <code>MODEL</code> 한 줄에 모아 바꿀 수 있다는 점처럼 구체적으로요.'
      ]},
      { t: 'say', h: '4요소로 수업 장면을 채워요', fig: 'fourParts', table: { head: ['요소', '기획서에 적을 것', '예(질문 도우미)'], rows: [
        ['학생활동', '학생이 도구로 무엇을 하나', '실습 중 막히면 질문하고, 힌트를 받아 다시 시도'],
        ['교사의 할', '교사가 언제 무엇을 확인하나', '쉬는 시간에 질문 기록을 보고 다음 차시 설명 보강'],
        ['자료', '도구가 근거로 삼는 자료', '내가 만든 단원 학습지·실습 안내(개인정보 없음)'],
        ['평가', '잘 됐는지 무엇으로 보나', '실습 완료율, 사전·사후 문항, 학생 설문'] ] }, p: [
        'c3u2에서 배운 4요소예요. 대회 기획서에서는 이게 곧 <b>교육적 효과와 현장 적용</b>을 설명하는 뼈대가 돼요.',
        '"평가" 칸은 L4의 증거와 바로 이어져요. 지금 적은 방법대로 수업에서 자료를 모으면 보고서 쓰기가 쉬워져요.'
      ]},
      { t: 'say', h: '한 장 기획서는 여덟 칸이에요', fig: 'onePager', table: { head: ['칸', '한두 줄로'], rows: [
        ['문제', '누가, 언제, 무엇이 어렵나'], ['대상', '학년·과목·단원, 몇 명'], ['해결', '도구가 하는 일 한 문장 + 핵심 흐름'], ['4요소', '학생활동·교사의 할·자료·평가'],
        ['쓰는 API', '<code>solar-pro4</code>, Document Parse, 임베딩 등 실제로 쓰는 것만'], ['안전', '개인정보 가리기, 입력·출력 검사, 교사 확인'], ['효과 측정', '무엇을 전후로 비교하나'], ['확산', '다른 교사가 쓰려면 무엇이 필요한가'] ] }, p: [
        '공모전 서식이 따로 있어도 이 여덟 칸이 차 있으면 옮겨 적기만 하면 돼요. 해커톤에서는 이 한 장이 MVP를 자르는 기준이 되고, Cursor 에이전트에게 주는 맥락이 돼요.',
        '"쓰는 API" 칸에는 정말 쓰는 것만 적어요. 많이 적는다고 점수가 오르지 않고, 받을 질문만 늘어요.'
      ]},
      { t: 'try', lang: 'md', h: '내 한 장 기획서 쓰기', p: '예시를 내 도구로 바꿔 써 보세요. 칸마다 한두 줄이면 충분해요. 다 되면 미션에서 대회용 저장소의 <code>PLAN.md</code>로 저장해요.',
        src: src(['# 실습 질문 도우미 (한 장 기획서)', '', '- 문제: 파이썬 실습 때 질문이 몰려, 기다리다 포기하는 학생이 생긴다', '- 대상: 고1 정보, 반복문 단원, 한 반 28명', '- 해결: 실습 자료를 근거로 힌트와 출처를 주는 질문 도우미', '- 4요소: 막히면 질문(학생) / 기록 보고 보강(교사) / 단원 학습지(자료) / 완료율·설문(평가)', '- 쓰는 API: solar-pro4, 임베딩(solar-embedding-2-passage·query)', '- 안전: 이름·번호 가리기, 자료 밖 질문은 선생님께, 정답 코드 통째로 안 주기', '- 효과 측정: 실습 완료율, 사전·사후 5문항, 학생 설문', '- 확산: data/ 자료만 바꾸면 다른 단원에도, README에 설치법']),
        note: '넣지 말 것: 학생 이름·사진, API 키, "모든 과목 모든 학생"처럼 넓은 대상.' },
      { t: 'q', kind: 'mc', fig: 'q_featProb', q: '기획서 첫 줄 "문제" 칸으로 가장 알맞은 것은?',
        opts: ['Solar와 임베딩으로 내 자료 기반 RAG 챗봇을 만든다', 'Streamlit으로 보기 좋은 질문 화면을 만든다', '실습 중 질문이 몰려 기다리다 포기하는 학생이 생긴다', '최신 AI 기술을 교실 수업에 적극적으로 들여온다'], a: 2,
        why: '문제 칸에는 교실의 어려움을 장면으로 적어요. 나머지 셋은 해결 방법(기능)이거나 너무 넓은 구호예요.',
        ex: ['쓰는 기술이에요. "해결"이나 "쓰는 API" 칸에 들어가요.', '화면은 해결 방법의 일부예요. 무엇이 어려운지가 빠졌어요.', '', '구호처럼 넓어서 누가 무엇이 어려운지 보이지 않아요.'] },
      { t: 'q', kind: 'mc', fig: 'q_measure', q: '"효과 측정" 칸에 적기에 가장 알맞은 것은?',
        opts: ['학생들이 도구를 무척 좋아하고 즐거워했다', '같은 문항으로 잰 사전·사후 점수와 완료율', '질문 도우미가 하루 동안 쓴 토큰 수와 요금 합계', '대회 심사위원과 동료 교사들의 반응'], a: 1,
        why: '같은 잣대로 전후를 비교할 수 있는 숫자를 적어요. 학생 반응은 그 숫자를 받쳐 주는 자료로 함께 모아요. L4에서 이대로 자료를 모아요.',
        ex: ['느낌만 있고 무엇을 어떻게 셀지가 없어요. 설문 문항으로 바꾸면 쓸 수 있어요.', '', '토큰 수는 비용 이야기예요. 배움이 나아졌는지는 말해 주지 않아요.', '대회 뒤에야 알 수 있고, 수업 효과도 아니에요.'] },
      { t: 'q', kind: 'line', fig: 'q_planLine', q: '동료가 쓴 한 장 기획서예요. <b>고쳐야 할 줄</b>을 눌러 보세요.', lang: 'md', code: src(['- 문제: 서술형 피드백이 늦다', '- 대상: 중2 정보, 한 반 26명', '- 자료: 학생 답안 원본(이름 포함)', '- 쓰는 API: solar-pro4', '- 안전: 이름 가리기, 교사 확인']), a: 2,
        why: '이름이 든 학생 답안 원본은 개인정보예요. 도구의 근거 자료는 내 수업자료나 공개 자료로 하고, 학생 글이 꼭 필요하면 이름을 지운 뒤 동의 절차를 학교·교육청 지침대로 확인해요.' },
      { t: 'q', kind: 'mc', fig: 'q_whichApi', q: '학습지가 HWP 파일이에요. 거기서 문항과 정답을 뽑아 퀴즈로 바꾸는 도구라면, "쓰는 API" 칸에 알맞은 것은?',
        opts: ['임베딩만 쓴다. 뜻으로 찾으면 문항이 나온다', 'Solar 채팅에 HWP 파일 이름과 경로만 알려 준다', 'HWP 글을 복사해 Solar에 그대로 붙인다', 'Document Parse + Solar 구조화 출력'], a: 3,
        why: '파일은 Document Parse로 구조 있는 글로 바꾸고(c2u1), 글에서 칸을 맞춰 뽑을 땐 Solar 구조화 출력을 써요(c2u2). HWP 지원 여부는 최신 문서에서 확인해요.',
        ex: ['임베딩은 비슷한 조각을 찾는 데 써요. 문항·정답을 칸에 맞춰 뽑지는 않아요.', 'Solar는 파일 이름만으로 내용을 볼 수 없어요. 글을 넘겨줘야 해요.', '복사하면 표가 깨지고 순서가 섞이기 쉬워요(c2u1). 그래서 파싱해요.', ''] },
      { t: 'sum', pts: ['첫 줄은 기능이 아니라 현장 문제: 누가, 언제, 무엇이 어려운지 장면으로.', '차별점은 "내 수업자료 근거·출처·교사 확인". 한국어 자료·소버린 AI는 이 수업에서 왜 중요한지로 말한다.', '한 장 기획서 여덟 칸: 문제·대상·해결·4요소·쓰는 API·안전·효과 측정·확산. 공모전 서식과 해커톤 MVP의 공통 뼈대.'] }
    ]},

    /* =================== QA =================== */
    { id: 'QA', type: 'quiz', title: '헷갈림 퀴즈 ①', sub: '기능 vs 문제, 차별점, 대상', min: 3, steps: [
      { t: 'q', kind: 'mc', fig: 'qa_featVsProb', q: '다음 중 <b>문제</b>가 아니라 <b>기능</b>인 것은?',
        opts: ['서술형 과제 피드백이 2주 뒤에 와서 고쳐 쓸 기회가 없다', '학생이 올린 코드를 자동으로 채점해 점수를 보여 준다', '실습 중 같은 오류 질문이 반복돼 교사가 다른 학생을 못 본다', '수행평가 안내문이 길어 학생들이 기준을 놓친다'], a: 1,
        why: '"자동으로 채점해 보여 준다"는 도구가 하는 일(기능)이에요. 나머지는 교실에서 겪는 어려움(문제)이에요. 기획서에서는 문제를 먼저, 기능은 해결 칸에 써요.',
        ex: ['피드백이 늦는 어려움, 곧 문제예요.', '', '교사가 시간을 빼앗기는 어려움, 곧 문제예요.', '학생이 기준을 놓치는 어려움, 곧 문제예요.'] },
      { t: 'q', kind: 'mc', fig: 'qa_edge', q: '심사위원이 "그냥 범용 AI 챗봇을 쓰면 되지 않나요?"라고 물었어요. 차별점으로 가장 알맞은 답은?',
        opts: ['단원 자료를 근거로 출처와 함께 답하고, 교사가 기록을 확인해요', '우리 도구는 Solar를 써서 어떤 질문이든 더 정확하게 답해요', '화면 색을 학교 상징색으로 바꿔서 친근해요', '학생들이 AI를 처음 써 봐서 수업 내내 무척 신기해했어요'], a: 0,
        why: '차별점은 <b>수업에서 하는 일이 다른 점</b>이에요. 내 자료 근거, 출처, 교사 확인은 범용 챗봇이 그대로는 해 주지 않는 부분이에요.',
        ex: ['', '모델 이름만으로는 차별점이 안 돼요. "늘 더 정확하다"는 증거 없이 말하기 어려워요.', '꾸밈은 차별점이 되기 어려워요. 수업에서 하는 일이 달라야 해요.', '처음이라 신기한 건 금방 사라져요. 도구가 하는 일이 아니에요.'] },
      { t: 'q', kind: 'mc', fig: 'qa_target', q: '기획서의 "대상" 칸으로 가장 알맞은 것은?',
        opts: ['전국 모든 학교의 모든 학년 학생', 'AI에 관심 있는 사람이라면 누구나', '정보 교사와 학생, 학부모와 교육청 모두', '고1 정보, 반복문 단원, 한 반 28명'], a: 3,
        why: '대상이 좁고 분명해야 해결이 작아지고 효과도 잴 수 있어요. 처음엔 내 수업 한 단원으로 시작하고, 넓히는 계획은 "확산" 칸에 적어요.',
        ex: ['너무 넓어서 무엇을 만들지, 무엇으로 효과를 볼지 정할 수 없어요.', '대상이 흐려요. 학년·과목·단원이 없어요.', '세 집단이 바라는 게 서로 달라요. 한 집단부터 정해요.', ''] }
    ]},

    /* =================== L3 =================== */
    { id: 'L3', type: 'lesson', title: '해커톤: MVP를 빠르게', sub: 'MVP 자르기, Plan → 작게 → 확인 → 커밋, 미리 준비할 것', min: 11, win: 'agents', steps: [
      { t: 'say', h: 'MVP: 한 줄기가 끝까지 도는 가장 작은 판', fig: 'mvpCut', p: [
        '<b>MVP</b>(Minimum Viable Product, 최소 기능 제품)는 핵심 흐름 하나가 처음부터 끝까지 진짜로 도는 가장 작은 판이에요. 질문 도우미라면 "질문 → 자료 검색 → Solar 답 + 출처 → 화면"이 한 줄기예요.',
        '해커톤에서 아프게 실패하는 모양은 기능 열 개를 반쯤 만들고 시연 때 하나도 안 도는 거예요. 기능 목록을 <b>꼭 · 있으면 좋음 · 다음에</b>로 나누고, "꼭"은 세 개 안으로 잘라요.'
      ], table: { head: ['꼭(MVP)', '있으면 좋음', '다음에'], rows: [
        ['자료 근거로 답 + 출처', '답 아래 이해 확인 질문', '로그인·학생별 통계'],
        ['자료 밖 질문은 선생님께 안내', '대화 기록 내려받기', '문항 자동 생성'],
        ['교사 화면에서 질문 기록 보기', '화면 색·글꼴 꾸미기', '다른 과목 자료 연결'] ] } },
      { t: 'say', h: '에이전트 코딩은 Plan → 작게 → 확인 → 커밋', fig: 'loop4', p: [
        '커서한입에서 배운 흐름을 시간에 쫓기는 해커톤에 맞춰 써요. 먼저 <b>Plan</b> 모드로 한 장 기획서를 붙여 계획을 받고, 단계가 맞는지 읽은 뒤 <b>Build</b>해요.',
        '한 번에 다 만들게 하지 말고 <b>기능 하나씩</b> 부탁해요. 하나가 끝나면 <code>streamlit run app.py</code>로 <b>직접 실행해 확인</b>하고, 되면 바로 <b>커밋</b>해요. 다음 기능에서 꼬이면 그 커밋으로 돌아오면 돼요.',
        '<code>AGENTS.md</code>에 c1u3에서 쓴 규칙(모델 <code>solar-pro4</code>, <code>base_url</code>, 키는 <code>.env</code>, 옛 모델 이름 금지)을 넣어 두면, 급할 때 에이전트가 인터넷의 옛 예제를 베껴 오는 일을 줄여요.'
      ]},
      { t: 'say', h: '해커톤 전에 준비해 두는 네 가지', fig: 'prepBag', table: { head: ['준비물', '무엇', '왜'], rows: [
        ['템플릿 저장소', '빈 Streamlit 앱, <code>AGENTS.md</code>, <code>requirements.txt</code>, <code>.gitignore</code>', '첫 한 시간을 설치·설정에 쓰지 않으려고'],
        ['<code>.env</code> 예시', '키 이름만 적은 <code>.env.example</code>', '팀원이 키 이름을 맞추고, 진짜 키는 올리지 않으려고'],
        ['데모 자료', '내 자료·공개 자료로 만든 학습지, 시연 질문 3개', '그 자리에서 자료를 찾느라 헤매지 않으려고'],
        ['오프라인 대체', '미리 받은 응답, 녹화본, 휴대폰 핫스팟', '인터넷이나 API가 막혀도 보여 주려고'] ] },
        code: { lang: 'sh', src: src(['$ cat .env.example', 'UPSTAGE_API_KEY=여기에_내_키', '$ cat .gitignore', '.env', '.venv/']) }, p: [
        '템플릿 저장소는 연수에서 키운 <code>upstage-lab</code>에서 필요한 파일만 골라 새로 만들어요. 대회가 "행사장에서 새로 만든 코드"만 인정하는지는 공고문에서 확인해요.',
        '키는 팀원마다 자기 키를 자기 <code>.env</code>에 넣어요. 키를 메신저로 돌리지 않아요.'
      ]},
      { t: 'say', h: '시간표는 거꾸로 짜요: 마지막 한 시간은 새 기능 금지', fig: 'timeTable', table: { head: ['시간(6시간 예)', '할 일'], rows: [
        ['0:00~0:30', '문제와 MVP 세 기능 확정, 역할 나누기'], ['0:30~1:00', 'Plan으로 계획 받기, 단계 다듬기'], ['1:00~3:30', '기능 1 → 2 → 3, 기능마다 실행 확인과 커밋'],
        ['3:30~4:30', '시연 흐름 다듬기, 미리 받은 응답 저장'], ['4:30~5:00', '녹화본 만들기, README 정리'], ['5:00~6:00', '새 기능 금지: 발표 연습 두 번, 키 검사'] ] }, p: [
        '시간표는 발표에서 거꾸로 짜요. 시연과 연습 시간을 먼저 떼어 두고, 남은 시간에 만들어요. 행사 시간이 다르면 비율만 맞춰요.',
        '시간이 남으면 "있으면 좋음"에서 하나씩 꺼내요. 모자라면 "꼭"을 줄이기보다 꾸밈을 줄여요.'
      ]},
      { t: 'sim', h: 'Plan으로 MVP를 받고 Build해요', p: '대회용 저장소에서 Plan 모드로 MVP 계획을 받고, Build로 첫 단계를 만든 뒤 직접 실행해 확인하고 커밋까지 해 봐요.',
        scene: { win: 'agents', folder: 'contest-app', agents: [{ title: 'MVP 만들기', on: true }], panel: EMPTY },
        steps: [
          { goal: '입력칸 아래 모드 버튼을 눌러요', click: 'btn:mode', then: { menu: MODE_MENU },
            say: '커서한입에서 쓰던 모드 메뉴예요.' },
          { goal: 'Plan을 골라요', click: 'menu:Plan', then: { menu: null, panel: panel({ mode: 'Plan' }) },
            say: '이제 보내는 부탁은 코드가 아니라 <b>계획</b>이 돼요. 시간에 쫓길수록 계획부터예요.' },
          { goal: '기획서를 붙여 MVP를 부탁해요', type: MVP_Q, into: 'chat',
            say: '<code>@PLAN.md</code>로 한 장 기획서를 붙이고, 기능을 셋으로 못 박았어요. 단계마다 확인할 질문도 달라고 했어요.' },
          { goal: '보내요', click: 'btn:send', then: { panel: panel({ mode: 'Plan', msgs: [{ me: MVP_Q }, { ai: MVP_PLAN, btns: ['Build'] }] }) },
            say: '계획이 나왔어요. 기능이 셋뿐인지, 단계마다 확인 방법이 있는지, 키를 <code>.env</code>에서 읽는지 읽어요.' },
          { goal: '계획이 맞으면 Build를 눌러요', click: 'msg:Build',
            then: { agents: [{ title: 'MVP 만들기', on: true, status: 'run' }], changes: [{ file: 'app.py', add: 48, del: 0 }],
              panel: panel({ mode: 'Plan', msgs: [{ me: MVP_Q }, { ai: MVP_PLAN }, { ai: BUILT1, run: 'streamlit run app.py' }] }) },
            hint: '계획 아래 첫 버튼이에요.',
            say: '1단계만 만들고 멈췄어요. 바뀐 파일이 <code>app.py</code> 하나뿐인지 오른쪽에서 봐요.' },
          { goal: '실행 명령을 허락해요', click: 'btn:run',
            then: { changes: null, browser: { url: 'localhost:8501', html: APP_HTML },
              panel: panel({ mode: 'Plan', msgs: [{ me: MVP_Q }, { ai: MVP_PLAN }, { ai: BUILT1 }, { ai: OPENED }] }) },
            say: '내 앱이 떴어요. 답에 출처가 붙는지, 정답을 통째로 주지 않는지 <b>내 눈으로</b> 확인해요.' },
          { goal: '확인했으면 커밋을 부탁해요', type: COMMIT_Q, into: 'chat',
            say: '확인한 단계는 바로 커밋해요. 다음 단계에서 꼬이면 여기로 돌아오면 돼요.' },
          { goal: '보내요', click: 'btn:send',
            then: { agents: [{ title: 'MVP 만들기', on: true, status: 'done' }],
              panel: panel({ mode: 'Plan', msgs: [{ me: MVP_Q }, { ai: MVP_PLAN }, { ai: BUILT1 }, { ai: OPENED }, { me: COMMIT_Q }, { ai: COMMITTED }] }) },
            say: '1단계가 커밋으로 남았어요. 진짜 Cursor에서는 Run Mode에 따라 명령 승인을 물을 수 있어요. 2·3단계도 같은 고리로 돌려요.' } ],
        end: 'Plan → 한 단계 Build → 직접 실행 → 커밋. 해커톤 내내 이 고리를 돌려요.' },
      { t: 'q', kind: 'mc', fig: 'q_mvpPick', q: '6시간 해커톤에서 "AI 튜터"를 만들어요. MVP로 남길 것으로 가장 알맞은 묶음은?',
        opts: ['코드 제출 → 채점 → 힌트, 이 한 줄기만', '로그인, 학생별 통계, 학부모 알림 보내기', '다섯 과목 지원, 음성 입력, 다크 모드 화면', '채점은 빼고 화면 디자인과 소개 영상부터'], a: 0,
        why: 'MVP는 핵심 흐름 하나가 끝까지 도는 것이에요. 트랙 A에서 만든 채점기와 튜터를 잇는 한 줄기면 시연할 거리가 생겨요.',
        ex: ['', '있으면 좋지만 핵심 흐름이 아니에요. 로그인은 시간을 많이 먹고 개인정보 문제도 생겨요.', '범위만 넓어지고 핵심 흐름은 그대로예요. "다음에" 칸이에요.', '돌아가는 게 없으면 해커톤 시연이 안 돼요. 꾸밈은 마지막에.'] },
      { t: 'q', kind: 'order', fig: 'q_agentFlow', q: '해커톤에서 기능 하나를 에이전트와 만드는 순서로 쌓아 보세요.',
        items: ['Plan 모드로 기획서를 붙여 계획을 받는다', '계획을 읽고 고친 뒤 Build로 한 단계만 만든다', 'streamlit run으로 직접 실행해 시연 질문을 넣어 본다', '되면 커밋하고 다음 기능으로 넘어간다'],
        why: '계획을 봐야 Build할 수 있고, 만들어야 실행해 보고, 확인해야 커밋할 가치가 있어요. 커밋은 다음 기능에서 꼬였을 때 돌아올 자리예요.' },
      { t: 'q', kind: 'mc', fig: 'q_envExample', q: '팀 저장소를 GitHub에 올리기 전이에요. 키와 관련해 바르게 준비한 것은?',
        opts: ['<code>.env</code>도 함께 올려서 팀원 모두가 같은 키 하나를 쓰게 한다', '키를 <code>app.py</code> 맨 위에 적어 두고, 저장소는 비공개로 바꿔 둔다', '키 이름만 적은 <code>.env.example</code>을 올리고 <code>.env</code>는 뺀다', '키를 README에 적되 앞뒤 몇 글자만 남기고 가린다'], a: 2,
        why: '진짜 키는 각자 <code>.env</code>에만 두고 <code>.gitignore</code>로 막아요. <code>.env.example</code>은 "키 이름이 이것"이라는 안내라 올려도 돼요.',
        ex: ['키가 저장소 기록에 남아요. 팀원은 각자 자기 키를 써요.', '비공개 저장소도 나중에 공개로 바뀌거나 공유될 수 있어요. 코드에 키를 쓰지 않아요.', '', '일부를 가려도 키를 문서에 적는 건 위험해요. 키 이름만 안내해요.'] },
      { t: 'q', kind: 'mc', fig: 'q_lastHour', q: '6시간 해커톤, 마지막 한 시간이 남았어요. 기능 ①②는 잘 돌고 ③은 아직이에요. 무엇을 할까요?',
        opts: ['③을 서둘러 붙이고 발표는 즉석에서 한다', '①②로 시연을 연습하고 녹화본을 만들어 둔다', '모델을 바꿔 답이 더 나은지 비교한다', '처음부터 구조를 새로 짜서 깔끔하게 만든다'], a: 1,
        why: '돌아가는 ①②로 시연을 완성하는 게 반쯤 된 ③보다 나아요. 마지막 한 시간은 새 기능 없이 연습, 녹화본, 키 검사에 써요.',
        ex: ['반쯤 된 ③이 시연 중에 멈추면 ①②까지 흔들려요.', '', '모델 비교는 시간이 오래 걸리고 시연 준비를 밀어내요.', '마지막 한 시간에 구조를 바꾸면 돌던 것까지 멈출 수 있어요.'] },
      { t: 'sum', pts: ['MVP는 핵심 흐름 하나가 끝까지 도는 가장 작은 판. 기능은 꼭·있으면 좋음·다음에로 나누고 "꼭"은 셋 안으로.', '에이전트 코딩은 Plan → 한 단계씩 Build → 직접 실행 확인 → 커밋. AGENTS.md 규칙으로 옛 예제를 막는다.', '미리 준비: 템플릿 저장소, .env.example, 데모 자료, 오프라인 대체. 시간표는 거꾸로, 마지막 한 시간은 새 기능 금지.'] }
    ]},

    /* =================== L4 =================== */
    { id: 'L4', type: 'lesson', title: '공모전: 수업 적용 증거', sub: '차시 계획, 개인정보 없는 기록, 전후 비교, 보고서 구조', min: 10, steps: [
      { t: 'say', h: '공모전은 "정말 수업에서 됐나"를 증거로 보여요', fig: 'evidenceBox', table: { head: ['증거', '무엇', '모으는 법'], rows: [
        ['차시 계획', '몇 차시, 어느 활동에 도구를 썼나', '수업 지도안에 도구 쓰는 자리 표시'],
        ['사용 기록', '질문 수, 질문 유형, 자료 밖 질문 비율', '앱 기록을 반 단위 숫자로 묶기'],
        ['학생 반응', '설문 응답, 소감 몇 줄', '익명 설문, 소감은 이름 없이 골라 싣기'],
        ['성취 자료', '같은 문항의 사전·사후 결과, 과제 완료율', '이름·번호를 지우고 반 통계로'] ] }, p: [
        '해커톤은 시연으로 보여 주지만, 공모전은 서면으로 보여 줘야 해요. 그래서 "써 봤더니 좋았다"가 아니라 <b>무엇을 어떻게 썼고 무엇이 달라졌는지</b>를 자료로 남겨요.',
        '증거는 수업이 끝난 뒤가 아니라 <b>수업 전에</b> 무엇을 모을지 정해야 모여요. L2 기획서의 "효과 측정" 칸이 바로 그 계획이에요.'
      ]},
      { t: 'say', h: '학생 자료는 개인정보 없이', fig: 'noNames', p: [
        '보고서에는 학생 이름·학번·얼굴 사진을 넣지 않아요. 기록은 <b>반 전체 숫자</b>(평균, 비율)로 묶고, 소감은 이름을 지운 뒤 몇 줄만 골라요. 대화 기록 원문에는 학생이 적은 이름·전화번호가 섞일 수 있으니 c3u3의 가리기를 거친 뒤 써요.',
        '학생 작품·소감·사진을 싣거나 수업에 AI 도구를 들일 때는 동의가 필요할 수 있어요. 만 14세 미만 학생의 개인정보는 법정대리인 동의가 필요하다는 규정(개인정보 보호법)도 있어요. 구체적인 절차는 <b>학교·교육청 지침을 먼저 확인해요</b>.',
        '학생 데이터를 앱에 오래 쌓아 두지 않는 것도 방법이에요. 필요한 통계만 남기고 원문 기록은 정한 기간 뒤 지우는 식이에요.'
      ]},
      { t: 'say', h: '전후 비교는 같은 잣대로', fig: 'beforeAfter', p: [
        '도구를 쓰기 전과 뒤에 <b>같은 문항, 같은 기준</b>으로 재요. 사전 문항과 사후 문항의 난이도가 다르면 비교가 안 돼요.',
        '숫자는 조심해서 말해요. 한 반에서 오른 점수는 도구 덕분일 수도, 수업이 진행돼서일 수도 있어요. "효과를 입증했다"보다 "이런 변화가 있었고, 학생 반응은 이랬다"처럼 <b>있는 그대로</b> 쓰고, 한계 칸에 다른 이유를 적어요.',
        '숫자 옆에 관찰을 붙이면 힘이 생겨요. "자료 밖 질문 비율이 줄었다" 옆에 "학생들이 학습지 쪽 번호를 같이 묻기 시작했다" 같은 장면이요.'
      ]},
      { t: 'try', lang: 'py', h: '사전·사후 결과를 반 통계로', p: '이름도 번호도 없는 연습용 점수 목록이에요. 실행해 평균과 오른 학생 수를 보고, 숫자를 바꿔 가며 "평균 차이"와 "오른 학생 수"가 따로 움직이는 것도 봐요.',
        src: src(['pre = [2, 3, 1, 4, 2, 3, 2, 5, 3, 2]', 'post = [3, 4, 3, 4, 2, 5, 3, 5, 4, 3]', '', 'def avg(xs):', '    return sum(xs) / len(xs)', '', 'up = 0', 'for a, b in zip(pre, post):', '    if b > a:', '        up += 1', '', 'print(f"사전 평균 {avg(pre):.1f}")', 'print(f"사후 평균 {avg(post):.1f}")', 'print(f"평균 차이 {avg(post) - avg(pre):.1f}")', 'print(f"오른 학생 {up}명 / {len(pre)}명")']),
        note: '진짜 학생 점수는 여기 붙이지 않아요. 보고서에는 이렇게 묶은 숫자만 실어요.' },
      { t: 'say', h: '보고서는 여섯 칸 뼈대로', fig: 'reportSix', table: { head: ['순서', '칸', '담을 것'], rows: [
        ['1', '문제와 배경', '현장 문제, 대상(한 장 기획서의 앞 칸)'], ['2', '도구 설계', '4요소, 구조 그림, 쓰는 API와 모델'], ['3', '수업 적용', '차시 계획, 도구를 쓴 장면'],
        ['4', '결과', '전후 비교, 사용 기록 통계, 학생 반응'], ['5', '안전과 윤리', '개인정보 가리기, 안전장치, 동의, AI 사용 표시'], ['6', '한계와 확산', '잘 안 된 점, 다른 교사가 쓰는 법'] ] }, p: [
        '공모전마다 서식이 있으면 서식을 따르되, 이 여섯 칸이 빠지지 않았는지 확인해요. 한계를 솔직히 쓰면 오히려 믿음이 생겨요.',
        '<b>저작권도 확인해요.</b> 교과서 쪽, 남의 그림·글꼴을 도구나 보고서에 넣었다면 출처를 밝히고 쓸 수 있는 조건인지 봐요. AI로 만든 글·그림은 그렇다고 밝혀요(평가원 가이드라인의 "투명하게 사용하라").'
      ]},
      { t: 'q', kind: 'mc', fig: 'q_bestEvidence', q: '공모전 보고서의 "결과" 칸에 넣을 증거로 가장 알맞은 것은?',
        opts: ['학생 대화 기록 원문을 이름 그대로 전부 붙인다', '반 단위 질문 통계와 이름을 지운 소감 몇 줄', '도구가 돌아가는 화면을 캡처한 사진 열 장', '"학생들이 매우 좋아했다"는 교사 소감 한 줄'], a: 1,
        why: '반 단위 숫자와 이름 없는 소감이 개인정보를 지키면서 무엇이 달라졌는지 보여 줘요.',
        ex: ['이름이 든 원문은 개인정보예요. 숫자로 묶고, 필요한 몇 줄만 이름을 지워 실어요.', '', '화면은 도구 설계 칸에 한두 장이면 돼요. 무엇이 달라졌는지는 보여 주지 못해요.', '느낌만으로는 증거가 되기 어려워요. 설문·기록 숫자로 받쳐요.'] },
      { t: 'q', kind: 'line', fig: 'q_reportLine', q: '공모전 보고서 초안의 메모예요. <b>개인정보 문제가 있는 줄</b>을 눌러 보세요.', lang: 'plain', code: src(['사용 기간: 3주, 6차시', '질문 수: 한 차시 평균 41개', '자료 밖 질문: 18% → 9%', '소감: "힌트가 좋았어요"(3반 12번)', '설문: 82%가 다시 쓰고 싶다']), a: 3,
        why: '반과 번호만으로도 학교 안에서는 누구인지 알 수 있어요. 소감은 반·번호까지 지우고 실어요.' },
      { t: 'q', kind: 'mc', fig: 'q_overclaim', q: '한 반에서 도구를 쓴 뒤 평균이 2.7점에서 3.6점으로 올랐어요. 보고서에 쓰기 가장 알맞은 문장은?',
        opts: ['도구의 효과가 과학적으로 확실하게 입증되었다', '같은 도구를 쓰면 모든 학교에서 같은 효과가 날 것이다', '평균이 0.9점 올랐고, 다른 이유도 한계에 적었다', '점수가 올랐으니 학생 반응은 따로 볼 필요가 없다'], a: 2,
        why: '한 반의 변화는 있는 그대로 쓰고, 다른 이유가 있을 수 있음을 한계 칸에 적어요. 그래야 심사위원이 숫자를 믿어요.',
        ex: ['비교반도 없이 한 반 결과로 "입증"이라 하기는 어려워요.', '한 반 결과로 모든 학교를 말할 수 없어요. 넓히는 건 확산 계획으로 써요.', '', '숫자만으로는 왜 올랐는지 몰라요. 학생 반응과 관찰이 이유를 보여 줘요.'] },
      { t: 'q', kind: 'blank', fig: 'q_reportBlank', q: '공모전 보고서 여섯 칸이에요. 빈칸에 들어갈 것은?', lang: 'plain', code: src(['1 문제와 배경', '2 도구 설계', '3 [[1]]', '4 결과', '5 안전과 윤리', '6 한계와 확산']),
        opts: ['수업 적용', '심사 기준', '소스 코드', '수상 실적'], a: 0,
        why: '설계 다음엔 실제로 수업에 어떻게 썼는지(차시 계획, 쓴 장면)를 적어요. 그래야 4번 결과가 어디서 나왔는지 보여요.',
        ex: ['', '심사 기준은 공고문에서 읽는 것이에요. 보고서 칸이 아니에요.', '코드는 부록이나 저장소 주소로 충분해요. 공모전 본문의 중심은 수업이에요.', '보고서는 이번 도구가 수업에서 한 일의 이야기예요.'] },
      { t: 'sum', pts: ['공모전 증거: 차시 계획, 사용 기록, 학생 반응, 성취 자료. 무엇을 모을지 수업 전에 정한다.', '개인정보 없이: 반 단위 숫자, 이름·번호를 지운 소감, 동의는 학교·교육청 지침부터. 전후 비교는 같은 잣대로, 결과는 있는 그대로.', '보고서 여섯 칸: 문제와 배경 → 도구 설계 → 수업 적용 → 결과 → 안전과 윤리 → 한계와 확산. 저작권·AI 사용 표시도 확인.'] }
    ]},

    /* =================== QB =================== */
    { id: 'QB', type: 'quiz', title: '헷갈림 퀴즈 ②', sub: '데모 vs 증거, MVP, 확산 가능성', min: 3, steps: [
      { t: 'q', kind: 'mc', fig: 'qb_demoEvid', q: '"데모"와 "증거"를 바르게 짝지은 것은?',
        opts: ['데모: 수업 전후 점수표와 설문 / 증거: 화면에서 도는 시연', '데모: 화면에서 도는 시연 / 증거: 수업 뒤 모은 기록·반응', '둘은 같은 말이라 화면만 잘 보여 주면 된다', '데모: 미리 찍은 녹화본 / 증거: 저장소의 소스 코드'], a: 1,
        why: '데모는 "이렇게 돌아가요"를 눈앞에 보여 주는 것, 증거는 "수업에서 이렇게 달라졌어요"를 자료로 보여 주는 것이에요. 해커톤은 데모가, 공모전은 증거가 중심이에요.',
        ex: ['거꾸로예요. 점수표는 증거, 시연은 데모예요.', '', '잘 도는 것과 수업에 도움이 된 것은 다른 이야기예요.', '녹화본은 데모의 한 방법이지만, 코드는 수업 효과의 증거가 아니에요.'] },
      { t: 'q', kind: 'mc', fig: 'qb_mvpMean', q: 'MVP에 대한 설명으로 맞는 것은?',
        opts: ['쓸 만한 기능을 최대한 많이 넣어 만든 첫 판', '돌아가진 않아도 디자인부터 완성한 화면 시안', '핵심 흐름 하나가 끝까지 도는 가장 작은 판', '발표 슬라이드에 그려 넣은 완성품 상상도'], a: 2,
        why: 'MVP는 적게, 그러나 끝까지 진짜로 돌아요. 해커톤에서는 이게 있어야 시연할 수 있어요.',
        ex: ['많이 넣을수록 다 반쯤 되기 쉬워요. MVP는 적게, 끝까지.', '화면만 있고 돌지 않으면 MVP가 아니에요.', '', '그림은 돌지 않아요. MVP는 진짜로 실행돼요.'] },
      { t: 'q', kind: 'mc', fig: 'qb_spread', q: '심사 기준의 "확산 가능성"을 보여 주는 것으로 가장 알맞은 것은?',
        opts: ['다른 교사가 README대로 자기 자료로 바꿔 쓴다', '내 반 학생들이 도구를 아주 많이 썼다', '모델 이름이 지금 나와 있는 것 중 가장 최신이다', '화면이 화려하고 움직임이 많아서 눈에 잘 띈다'], a: 0,
        why: '확산은 "나 말고 다른 교실에서도 쓸 수 있나"예요. 설치법·자료 바꾸는 법이 적힌 README와 학교 도입 때 확인할 절차를 보여 주면 좋아요.',
        ex: ['', '내 반에서 많이 쓴 건 현장 적용·효과 쪽 증거예요.', '모델은 바뀌어요. 확산은 다른 사람이 쓸 수 있느냐예요.', '눈에 띄는 것과 다른 교실로 퍼지는 것은 달라요.'] }
    ]},

    /* =================== L5 =================== */
    { id: 'L5', type: 'lesson', title: '3분 발표와 시연', sub: '데모 대본, 실패 대비, 예상 질문, README 정리', min: 13, steps: [
      { t: 'say', h: '3분 데모 대본은 문제 → 시연 → 효과 → 확산', fig: 'threeMin', table: { head: ['시간', '할 말', '화면'], rows: [
        ['0:00~0:30', '문제 장면 한 줄: "실습 시간, 손 든 학생은 많고 교사는 한 명"', '교실 사진 대신 그림이나 문장'],
        ['0:30~2:00', '시연: 질문 → 근거 있는 답 + 출처 → 자료 밖 질문 안내 → 교사 기록', '내 앱(<code>localhost:8501</code>)'],
        ['2:00~2:40', '효과와 안전: 숫자 하나, 안전장치 하나', '그래프 한 장'],
        ['2:40~3:00', '확산과 마무리: 다른 교사가 쓰는 법', 'README 주소'] ] }, p: [
        '3분은 짧아요. 기능을 다 보여 주려 하지 말고 <b>한 줄기</b>만 보여 줘요. 시연 질문은 미리 정해 두고 그대로 쳐요. 즉석 질문은 질문 시간에 받아요.',
        '대본을 쓰고 소리 내어 읽으며 초시계로 재요. 3분을 넘으면 문장을 줄이기보다 장면을 하나 빼요.'
      ]},
      { t: 'say', h: '시연은 막힐 수 있다고 생각하고 준비해요', fig: 'backupPlan', code: { lang: 'py', src: src(['import json, os', 'DEMO = os.environ.get("DEMO") == "1"', 'SAVED = "demo_answers.json"', '', 'def answer(q):', '    if DEMO:  # 미리 받은 응답', '        with open(SAVED) as f:', '            return json.load(f)[q]', '    return ask_solar(q)  # 진짜 호출']) }, p: [
        '행사장 와이파이가 막히거나, 크레딧이 떨어지거나(<code>403</code>), 요청이 몰려 <code>429</code>가 날 수 있어요. 그래서 대비를 세 겹으로 둬요. ① 미리 찍은 <b>녹화본</b> ② <b>미리 받은 응답</b>으로 보여 주는 데모 모드 ③ 휴대폰 <b>핫스팟</b>이에요.',
        '데모 모드는 시연 질문 3개의 진짜 응답을 미리 받아 <code>demo_answers.json</code>에 저장해 두고, 인터넷이 없을 때 그걸 보여 주는 거예요(<code>ask_solar</code>는 Solar를 부르는 내 함수). 쓸 때는 "미리 받은 답이에요"라고 <b>꼭 밝혀요</b>. 숨기면 시연이 아니라 연출이 돼요.',
        '전날 콘솔 <b>Billing</b>에서 크레딧을 확인하고, 시연 노트북의 <code>.env</code>에 키가 있는지 봐요. 화면 공유 중에는 <code>.env</code>를 열지 않아요.'
      ]},
      { t: 'say', h: '예상 질문 다섯 개는 답을 미리 써 둬요', fig: 'qnaCards', table: { head: ['질문', '답의 뼈대'], rows: [
        ['안전: 학생이 이상한 걸 물으면요?', '입력 검사 → 시스템 프롬프트 → 출력 검사 → 교사 확인(c3u3), 레드팀 시험 결과 한 줄'],
        ['비용: 반 전체가 쓰면 얼마예요?', '지금 가격으로 어림: 30명 × 질문 10개(입력 2천·출력 3백 토큰)면 <code>solar-pro4</code>로 약 0.29달러'],
        ['확산: 우리 학교에서도 돼요?', 'README대로 설치하고 <code>data/</code> 자료만 바꾸기. 학교 도입은 학교 절차부터 확인'],
        ['소버린 AI: 왜 이 모델이에요?', '한국어 자료를 다루고, 데이터가 어디로 가는지 알고 골랐다. <code>MODEL</code> 한 줄이라 바꿀 수도 있다'],
        ['한국어 자료: 다른 도구와 뭐가 달라요?', 'HWP 학습지도 Document Parse로 읽어 근거로 쓴다(지원 형식은 확인)'] ] }, p: [
        '비용은 "지금 가격으로 어림하면"과 근거(가격 페이지)를 함께 말해요. 가격은 바뀌니 발표 전에 다시 확인해요.',
        '학교에 도구를 들일 때는 2026학년도부터 교육부 「학습지원 소프트웨어 선정 기준」과 학교운영위원회 심의 절차가 있어요. 내가 만든 도구가 여기에 해당하는지는 <b>학교·교육청 지침을 먼저 확인해요</b>.',
        '소버린 AI 질문에는 "무조건 국산이 낫다"가 아니라 <b>선택지와 통제권</b>으로 답해요. 모르는 건 "확인해 보겠습니다"가 좋은 답이에요.'
      ]},
      { t: 'say', h: 'README와 GitHub 정리: 키는 빼고', fig: 'readmeKey', code: { lang: 'md', src: src(['# 실습 질문 도우미', '반복문 실습 중 질문에 자료로 답해요', '', '## 실행', '1. .env.example을 .env로 복사해 키 넣기', '2. pip install -r requirements.txt', '3. streamlit run app.py', '', '## 쓰는 것과 안전', '- solar-pro4(MODEL 변수), 임베딩 2', '- 이름·번호 가리기, 자료 밖 질문 안내']) }, p: [
        'README에는 무엇·누구·실행 방법·쓰는 API와 모델·안전장치·한계를 짧게 적어요. 심사위원과 다른 교사가 처음 보는 쪽이에요. 결과물을 오픈소스로 공유하는 해커톤도 있으니, 공개해도 되는 상태로 만들어 둬요.',
        '올리기 전에 <b>키 검사</b>를 해요. <code>git status</code>에 <code>.env</code>가 안 보이는지, <code>git grep -n "up_"</code>로 키 조각이 없는지 봐요(다른 낱말도 걸리니 눈으로 골라요). 예전 커밋에 한 번이라도 키가 들어갔다면 지워도 기록에 남아요. 콘솔 <b>API keys</b>에서 그 키를 지우고 새로 만들어요.',
        '학생 자료(대화 기록, 점수표)와 쓸 조건을 모르는 남의 자료도 저장소에서 빼요. 데모 자료는 내가 만든 것이나 공개 자료만 넣어요.'
      ]},
      { t: 'try', lang: 'md', h: '내 3분 데모 대본 쓰기', p: '예시 대본을 내 도구로 바꿔 보세요. 다 쓰면 소리 내어 읽으며 초시계로 재요. 미션에서 <code>DEMO.md</code>로 저장해요.',
        src: src(['# 3분 데모 대본', '', '## 0:00 문제 (30초)', '실습 시간, 손 든 학생은 많고 교사는 한 명이에요.', '', '## 0:30 시연 (90초)', '1. "range(1, 5)는 몇 번 돌아요?" → 힌트 + 출처', '2. "내일 급식 뭐야?" → 선생님께 물어봐요 안내', '3. 교사 화면에서 오늘 질문 기록 보기', '', '## 2:00 효과와 안전 (40초)', '자료 밖 질문 18% → 9%, 이름·번호는 자동으로 가려요.', '', '## 2:40 확산 (20초)', 'data/ 자료만 바꾸면 다른 단원에도 써요. 설치법은 README에.', '', '(대비: 녹화본, DEMO=1, 핫스팟)']),
        note: '시연 질문은 미리 정해 두고 그대로 쳐요. 미리 받은 응답을 쓰면 그렇다고 말해요.' },
      { t: 'q', kind: 'mc', fig: 'q_wifiDown', q: '본선 시연 직전, 행사장 와이파이가 끊겼어요. 미리 준비한 것으로 가장 알맞게 대처한 것은?',
        opts: ['"인터넷이 안 돼서 못 보여 드려요"라고 하고 넘어간다', '핫스팟을 켜고, 안 되면 밝히고 데모 모드로 보여 준다', '미리 받은 응답을 진짜 호출인 것처럼 보여 준다', '와이파이가 돌아올 때까지 발표 순서를 미뤄 달라고 한다'], a: 1,
        why: '핫스팟 → 데모 모드(밝히고) → 녹화본 순서로 대비를 꺼내요. 준비한 길이 있으면 막혀도 보여 줄 수 있어요.',
        ex: ['준비한 대체 수단이 있어요. 그냥 넘기면 보여 줄 기회를 잃어요.', '', '숨기면 시연이 아니라 연출이에요. 미리 받은 답이라고 밝혀요.', '일정이 정해진 행사라 기다려 주기 어려워요. 대비를 쓰는 게 먼저예요.'] },
      { t: 'q', kind: 'mc', fig: 'q_costAns', q: '심사위원이 "한 반 30명이 한 학기 쓰면 비용이 얼마나 들어요?"라고 물었어요. 가장 좋은 답은?',
        opts: ['AI는 무료라서 비용 걱정은 따로 하지 않아도 돼요', '싸다고 들었는데 정확한 숫자는 따로 계산해 보지 않았어요', '학교 예산으로 처리하면 되니 크게 상관없어요', '지금 가격으로 한 차시 약 0.3달러, 곱해서 어림했어요'], a: 3,
        why: '토큰 수와 지금 가격으로 어림한 숫자, 그리고 근거를 말해요. 가격은 바뀌니 "지금 가격으로"를 붙여요.',
        ex: ['쓰는 만큼 크레딧이 줄어요. 무료가 아니에요.', '비용은 확산의 핵심 질문이에요. 어림이라도 숫자로 답해요.', '다른 학교가 따라 쓰려면 얼마인지가 중요해요.', ''] },
      { t: 'q', kind: 'line', fig: 'q_readmeLine', q: 'GitHub에 올리기 직전 README의 일부예요. <b>올리면 안 되는 줄</b>을 눌러 보세요.', lang: 'md', code: src(['## 실행', '1. pip install -r requirements.txt', '2. .env.example을 .env로 복사', '3. UPSTAGE_API_KEY=up_••••7f3a', '4. streamlit run app.py']), a: 3,
        why: '키는 README에도 코드에도 적지 않아요(여기서는 연습이라 가려 보였어요). <code>.env.example</code>처럼 키 이름만 안내하고, 키는 각자 <code>.env</code>에 넣어요.' },
      { t: 'q', kind: 'mc', fig: 'q_sovAns', q: '"왜 굳이 국산 모델을 썼나요?"라는 질문에 가장 균형 잡힌 답은?',
        opts: ['한국어 자료와 데이터 통제를 보고 골랐어요. 바꿀 수도 있어요', '국산 모델이 모든 면에서 외국 모델보다 훨씬 뛰어나기 때문이에요', '외국 모델은 교실에서 쓰면 법에 어긋나기 때문이에요', '대회 심사에서 국산 모델에 가산점을 주기 때문이에요'], a: 0,
        why: '"무조건 국산"이 아니라 이 수업에서 왜 맞는지(한국어 자료, 데이터가 어디로 가는지)와 바꿀 수 있는 구조를 말해요. 그게 선택지와 통제권이에요.',
        ex: ['', '"모든 면에서"는 증거 없이 말하기 어려워요. 이 수업에 맞는 이유로 말해요.', '근거 없이 법을 말하면 안 돼요. 도구 도입 절차는 학교·교육청 지침에서 확인해요.', '공고문에 없는 가산점을 짐작으로 말하면 안 돼요.'] },
      { t: 'sum', pts: ['3분 대본: 문제 30초 → 시연 90초(한 줄기, 정한 질문) → 효과·안전 40초 → 확산 20초. 초시계로 재며 연습한다.', '실패 대비는 녹화본·미리 받은 응답(밝히고 쓰기)·핫스팟. 예상 질문은 답을 미리 쓰고, README는 키와 학생 자료를 뺀 채 올린다.', '앞으로의 길: 대회가 끝나도 도구는 수업에서 자라요. 학생 반응으로 고치고, 동료와 나누고, 모델 기록을 보며 MODEL 한 줄을 새로 맞춰요. 여기까지 온 걸 축하해요!'] }
    ]},

    /* =================== M1 =================== */
    { id: 'M1', type: 'mission', title: '내 대회 계획 세우기', sub: '기획서부터 연습 발표까지, 내 Cursor에서 직접', min: 90,
      where: '대회용 저장소 contest-app(upstage-lab에서 시작) + 업스테이지 콘솔',
      intro: '이번 단원에서 배운 것으로 진짜 내 대회를 준비해요. 나갈 대회 하나를 정해 공고문을 옆에 두고 시작해요. 하루에 다 하지 않아도 돼요. 끝낸 것부터 체크하고, 한 줄 메모도 남겨요.',
      tasks: [
        { do: '공고문을 읽고 한 장 기획서를 써요',
          how: '지금 열려 있거나 곧 열릴 대회 공고문을 찾아 <b>참가 자격 → 내는 것 → 심사 기준·배점 → 조건</b> 순서로 읽어요. L2 연습장의 여덟 칸으로 <code>PLAN.md</code>를 쓰고, 맨 아래에 심사 기준을 표로 옮겨요. 학생 이름·사진은 넣지 않아요.',
          check: '<code>PLAN.md</code>의 여덟 칸이 다 차 있고, 배점이 가장 큰 항목에 무엇으로 답할지 한 줄 적었으면 성공.' },
        { do: '대회용 저장소를 만들고 첫 커밋을 해요',
          how: '새 폴더 <code>contest-app</code>을 만들고 <code>upstage-lab</code>에서 쓸 파일만 복사해요(예: <code>search.py</code>, <code>guard.py</code>, <code>AGENTS.md</code>, <code>PLAN.md</code>). <code>.gitignore</code>에 <code>.env</code>와 <code>.venv/</code>를 넣고, 키 이름만 적은 <code>.env.example</code>을 만든 뒤 <code>git init</code> → 첫 커밋. 진짜 키는 <code>.env</code>에만 둬요.',
          check: '<code>git status</code>가 깨끗하고, <code>git ls-files</code>에 <code>.env</code>는 없고 <code>.env.example</code>은 있으면 성공.' },
        { do: 'Plan 모드로 MVP 기능 3개를 한 단계씩 만들어요',
          how: 'Agents Window에서 모드를 <b>Plan</b>으로 바꾸고 아래 부탁을 붙여 넣어요. 내 도구가 다르면 기능 세 줄만 바꿔요. 계획을 읽고 고친 뒤 <b>Build</b>, 단계마다 <code>streamlit run app.py</code>로 시연 질문을 넣어 보고 되면 커밋해요. 시험 호출은 짧은 질문으로 몇십 번이면 충분해요.',
          check: '<code>git log --oneline</code>에 기능 세 개가 각각 커밋으로 남아 있고, 시연 질문 3개가 모두 기대한 대로 나오면 성공.',
          prompt: '@PLAN.md 이 기획서대로 대회용 MVP를 만들 거야. 기능은 세 개만: ① 내 수업자료를 근거로 답하고 출처(파일·쪽) 표시 ② 근거가 없으면 "선생님께 물어봐요"로 안내 ③ 교사용 질문 기록 보기. Streamlit app.py 하나로, 이미 있는 search.py와 guard.py를 써 줘. AGENTS.md 규칙을 지켜 줘: 모델은 MODEL = "solar-pro4" 변수 하나, reasoning_effort는 직접 적기, 키는 os.environ["UPSTAGE_API_KEY"](.env)에서만, 옛 모델 이름 금지. 계획의 단계마다 확인 방법(넣어 볼 질문)을 붙이고, Build하면 한 단계씩 멈춰서 내가 실행해 확인하게 해 줘. 키를 화면이나 로그에 찍는 코드는 쓰지 마.' },
        { do: '3분 데모 대본과 실패 대비를 준비해요',
          how: 'L5 연습장 대본을 내 도구로 고쳐 <code>DEMO.md</code>로 저장해요. 아래 부탁으로 데모 모드를 넣고, 시연 질문 3개의 진짜 응답을 <code>demo_answers.json</code>에 저장해요. 휴대폰 핫스팟으로 앱이 도는지도 한 번 봐요.',
          check: '인터넷을 끄고 <code>DEMO=1 streamlit run app.py</code>(Windows PowerShell은 <code>$env:DEMO="1"</code> 뒤 실행)로 시연 질문 3개가 "미리 받은 답" 표시와 함께 나오면 성공.',
          prompt: '시연이 인터넷 없이도 되게 데모 모드를 넣어 줘. DEMO 환경 변수가 "1"이면 Solar를 부르지 말고 demo_answers.json에서 질문별 답을 읽어 보여 주고, 답 위에 "미리 받은 답이에요" 표시를 붙여 줘. DEMO.md에 적은 시연 질문 3개를 지금 진짜로 한 번씩 호출해 답을 demo_answers.json에 저장하는 save_demo.py도 따로 만들어 줘. 키는 .env에서만 읽고, DEMO가 없으면 지금처럼 동작해야 해. 바꾼 파일과 확인 방법을 알려 줘.' },
        { do: 'README를 쓰고 키·학생 자료가 없는지 검사해요',
          how: '아래 부탁으로 README 초안을 받은 뒤 내 말로 고쳐요. 올리기 전에 <code>git status</code>, <code>git grep -n "up_"</code>로 키 조각이 없는지, <code>data/</code>에 학생 자료가 없는지 눈으로 확인해요. 예전 커밋에 키가 들어간 적이 있으면 콘솔 <b>API keys</b>에서 그 키를 지우고 새로 만들어요.',
          check: 'README에 무엇·누구·실행 방법·쓰는 API·안전장치·한계가 있고, 키 검사에서 걸린 줄 가운데 진짜 키가 하나도 없으면 성공.',
          prompt: '이 저장소의 README.md를 써 줘. 처음 보는 정보 교사가 따라 할 수 있게: 무엇을 하는 도구인지 한 줄, 대상 수업, 실행 방법(.env.example 복사 → pip install -r requirements.txt → streamlit run app.py), 쓰는 API와 모델(MODEL 변수 위치), 안전장치, 한계, 자료 바꾸는 법. 키 값이나 학생 정보는 절대 넣지 마. 그리고 저장소에서 키처럼 보이는 문자열이 있는지, .env가 Git에 추적되고 있지 않은지 검사해서 결과만 알려 줘. 파일은 README.md만 바꿔.' },
        { do: '연습 발표를 녹화하고 다시 봐요',
          how: '대본대로 3분 발표를 화면 녹화해요(시연 포함). 이 녹화본이 그대로 실패 대비용이 돼요. 다시 보며 넘친 시간, 안 보인 글자, 예상 질문 다섯 개 중 막힌 답을 메모해요. 녹화할 때 <code>.env</code>나 콘솔 키 화면이 나오지 않게 해요.',
          check: '녹화본이 3분 안쪽이고, 고칠 점 세 가지와 예상 질문 다섯 개의 답을 메모했으면 성공.' }
      ],
      note: '예상 비용: MVP 시험으로 짧은 호출 50번(입력 2천·출력 5백 토큰)이면 <code>solar-pro4</code> 지금 가격으로 약 0.06달러, 20쪽 자료 파싱은 약 0.2달러예요. 모두 합쳐 1달러 안쪽이지만 가격은 바뀌니 콘솔 Billing에서 확인해요. 학생 개인정보가 담긴 자료는 쓰지 않아요. 대회 결과와 상관없이, 만든 도구를 내 수업에서 한 번 더 써 보는 게 가장 큰 상이에요.' },

    /* =================== T1 =================== */
    { id: 'T1', type: 'test', title: '단원 형성평가', sub: '10문제 · 7문제 이상 맞히면 통과', min: 11, pass: 0.7, steps: [
      { t: 'q', kind: 'mc', fig: 't_trainEnd', q: '연수 2일차 마지막 차시, 트랙 B 챗봇을 끝까지 만들었어요. "이걸로 대회에 나가 볼까?" 싶을 때 다음 주에 할 첫 일로 알맞은 것은?',
        opts: ['챗봇에 쓸 만한 기능을 다섯 개쯤 더 붙여 둔다', '나갈 대회의 공고문에서 자격과 심사 기준을 읽는다', '발표 슬라이드 디자인과 글꼴부터 먼저 고른다', '모델을 바꿔 가며 답 비교표를 만든다'], a: 1,
        why: '무엇으로 점수를 매기는지 알아야 무엇을 더 할지 정할 수 있어요. 공고문의 심사 기준이 준비의 지도예요.',
        ex: ['심사 기준을 모른 채 붙인 기능은 점수와 상관없을 수 있어요.', '', '발표 꾸밈은 맨 나중이에요. 무엇을 보여 줄지부터 정해요.', '대회가 기술보다 교육적 효과를 크게 본다면 시간만 쓰게 돼요.'] },
      { t: 'q', kind: 'blank', fig: 't_planBlank', q: '한 장 기획서의 일부예요. 두 빈칸을 채워 보세요.', lang: 'plain', code: src(['- 문제: 서술형 피드백이 늦다', '- [[1]]: 중2 정보, 26명', '- 해결: 루브릭 기반 즉시 피드백', '- [[2]]: 고쳐 쓴 비율, 사전·사후 점수']),
        opts: [['대상', '효과 측정'], ['효과 측정', '대상'], ['대상', '확산'], ['자료', '효과 측정']], a: 0,
        why: '"중2 정보, 26명"은 누구를 위한 도구인지(<b>대상</b>), "고쳐 쓴 비율, 사전·사후 점수"는 무엇으로 효과를 잴지(<b>효과 측정</b>)예요.',
        ex: ['', '두 칸이 서로 바뀌었어요. "중2 정보, 26명"은 누구를 위한 것인지예요.', '둘째 칸이 틀렸어요. 확산은 다른 교사·학교로 넓히는 계획이에요.', '첫 칸이 틀렸어요. 자료는 도구가 근거로 삼는 수업자료예요.'] },
      { t: 'q', kind: 'order', fig: 't_hackOrder', q: '해커톤 전날부터 발표까지, 순서대로 쌓아 보세요.',
        items: ['템플릿 저장소와 .env.example, 데모 자료를 준비한다', '행사 시작 30분 안에 MVP 기능 셋을 정한다', '기능마다 Plan → Build → 실행 확인 → 커밋한다', '마지막 한 시간은 새 기능 없이 연습하고 녹화본을 만든다', '발표에서 정해 둔 질문으로 한 줄기를 시연한다'],
        why: '준비물은 전날, MVP는 시작하자마자, 만들기는 기능마다 고리로, 마지막 한 시간은 연습, 그다음이 발표예요.' },
      { t: 'q', kind: 'mc', fig: 't_oldModel', q: '연수장에서 급하게 에이전트에게 "Solar 챗봇 만들어 줘"라고만 했더니, 코드에 곧 끝나는 옛 모델 이름과 옛 주소가 들어 있었어요. 대회 저장소에서 같은 일을 막는 방법은?',
        opts: ['<code>AGENTS.md</code>에 모델·주소 규칙을 적어 둔다', '에이전트 코드는 늘 최신이니 그대로 믿고 쓴다', '발표 직전에 옛 이름을 한꺼번에 찾아서 고친다', '모델 이름을 파일마다 직접 적어서 눈에 띄게 둔다'], a: 0,
        why: '템플릿 저장소의 <code>AGENTS.md</code>에 c1u3의 규칙(<code>MODEL = "solar-pro4"</code>, <code>base_url</code>, 키는 <code>.env</code>, 옛 이름 금지)을 적어 두면 에이전트가 처음부터 맞게 써요. Plan으로 계획을 받으면 Build 전에 한 번 더 걸러져요.',
        ex: ['', '에이전트는 인터넷의 옛 예제를 베껴 올 수 있어요. 늘 확인해요.', '시간에 쫓기면 놓치기 쉬워요. 처음부터 규칙으로 막는 게 빨라요.', '이름을 <code>MODEL</code> 변수 하나에 모아야 바꾸기 쉬워요.'] },
      { t: 'q', kind: 'line', fig: 't_consentLine', q: '공모전 보고서에 실을 자료 점검표예요. <b>바르지 않은 줄</b>을 눌러 보세요.', lang: 'plain', code: src(['설문: 익명, 반 전체 비율만', '소감: 이름·번호 지우고 3줄', '사진: 학생 얼굴이 보이는 수업 장면', '기록: 질문 유형별 숫자로', '그림: 출처와 이용 조건 확인']), a: 2,
        why: '얼굴이 보이는 사진은 학생을 알아볼 수 있어요. 손이나 화면만 보이게 찍고, 꼭 실어야 한다면 동의 절차를 학교·교육청 지침대로 확인해요.' },
      { t: 'q', kind: 'mc', fig: 't_compare', q: '사전 평가는 쉬운 5문항, 사후 평가는 어려운 5문항으로 쟀더니 평균이 떨어졌어요. 바른 해석은?',
        opts: ['도구가 오히려 학생들의 학습을 방해했다', '문항이 달라 전후를 비교할 수 없다', '학생들이 도구를 잘못된 방법으로 썼다', '평균 대신 반에서 가장 높은 점수만 보면 된다'], a: 1,
        why: '잣대(문항 난이도)가 다르면 전후 차이가 도구 때문인지 문항 때문인지 알 수 없어요. 같은 문항, 같은 기준으로 다시 재요.',
        ex: ['잣대가 달라서 떨어진 것일 수 있어요. 이것만으로는 알 수 없어요.', '', '근거 없는 짐작이에요. 먼저 잣대를 맞춰요.', '최고점만 보면 반 전체 변화를 놓쳐요. 잣대를 같게 하는 게 먼저예요.'] },
      { t: 'q', kind: 'mc', fig: 't_rate429', q: '연수 마지막 발표 시간, 동료 교사 20명이 한 키로 도는 내 챗봇에 한꺼번에 질문하자 <code>429</code>가 떴어요. 무슨 뜻이고, 대회 시연에선 어떻게 대비할까요?',
        opts: ['키가 틀렸다는 뜻. 시연 전에 키를 새로 만들어 둔다', '크레딧이 떨어졌다는 뜻. 충전만 미리 해 두면 된다', '요청이 몰렸다는 뜻. 정한 질문과 대체 답을 둔다', '서버가 고장 났다는 뜻. 따로 대비할 방법이 없다'], a: 2,
        why: '<code>429</code>는 짧은 시간에 요청이 너무 많다는 뜻이에요. 시연은 정한 질문으로 차분히 하고, 미리 받은 응답과 녹화본을 대체로 둬요.',
        ex: ['키가 틀리면 <code>401</code>이에요.', '크레딧 부족은 <code>403</code>이에요.', '', '서버 문제는 <code>5xx</code>예요. 그때도 녹화본·미리 받은 응답으로 대비할 수 있어요.'] },
      { t: 'q', kind: 'mc', fig: 't_spreadQ', q: '심사위원이 "다른 학교 선생님도 바로 쓸 수 있나요?"라고 물었어요. 가장 알맞은 답은?',
        opts: ['제 API 키를 같이 나눠 드리면 바로 쓰실 수 있어요', '제 노트북에서만 돌아가니 빌려 드릴게요', '다른 학교는 아직 생각해 보지 않았어요', 'README대로 깔고 data/ 자료만 바꾸면 돼요'], a: 3,
        why: '확산은 다른 교사가 스스로 쓸 수 있느냐예요. README와 자료 바꾸는 법을 보여 주고, 학교 도입 절차는 그 학교 지침을 확인하라고 덧붙여요.',
        ex: ['키는 나눠 주지 않아요. 각자 자기 키를 <code>.env</code>에 넣어요.', '노트북을 빌려서는 다른 교실로 퍼지지 않아요. README로 해결해요.', '솔직하지만 확산을 보여 주지 못해요. README와 자료 바꾸는 법을 준비해요.', ''] },
      { t: 'q', kind: 'mc', fig: 't_demoHonest', q: '와이파이가 끊겨 데모 모드(미리 받은 응답)로 시연하게 됐어요. 바른 태도는?',
        opts: ['"미리 받은 답을 보여 드릴게요"라고 밝힌다', '진짜 호출인 것처럼 아무 말 없이 보여 준다', '미리 받은 답을 더 그럴듯하게 손봐 둔다', '반칙이니 데모 모드는 절대 쓰지 않는다'], a: 0,
        why: '대체 수단은 밝히고 쓰면 정직한 시연이에요. 받은 답은 손대지 않고 그대로 저장해요.',
        ex: ['', '숨기면 시연이 아니라 연출이에요. 들키면 믿음을 잃어요.', '손으로 고친 답은 도구의 진짜 실력이 아니에요. 받은 그대로 저장해요.', '밝히고 쓰면 반칙이 아니에요. 막혔을 때 보여 줄 길이에요.'] },
      { t: 'q', kind: 'mc', fig: 't_oldKey', q: '대회 저장소를 공개로 바꾸기 직전, 석 달 전 커밋에 키가 들어 있었다는 걸 알았어요. 지금 파일에서는 이미 지웠어요. 어떻게 할까요?',
        opts: ['지금 파일에서는 지웠으니 그대로 공개로 바꾼다', 'README에 "옛 키는 쓰지 마세요"라고 크게 적는다', '저장소 이름을 바꿔 찾기 어렵게 한다', '콘솔 API keys에서 그 키를 지우고 새로 만든다'], a: 3,
        why: 'Git 기록에는 지운 키도 남아 있어요. 샌 키는 콘솔 <b>API keys</b>에서 지우고 새로 만들어 <code>.env</code>에 넣어요(c1u1). 그래야 옛 키가 쓸모없어져요.',
        ex: ['지난 커밋을 열면 키가 그대로 보여요.', '안내문은 키를 막지 못해요. 누구든 기록에서 꺼내 쓸 수 있어요.', '이름을 바꿔도 기록은 그대로예요.', ''] }
    ]}
    ]
  });
})();
