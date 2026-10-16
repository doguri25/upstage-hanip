// 과정 3 · 단원 2 · 수업 도구의 4요소와 제작 절차
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
  // 브라우저 창: 창 틀 + 주소창
  function browser(P, x, y, w, h, url) {
    win(P, x, y, w, h);
    P.rrect(x + 46, y + 5, w - 54, 13, 5, { c: 'soft', w: 1.2 });
    if (url) P.text(x + 52, y + 15, url, { mono: true, size: 9, anchor: 'start', c: 'ink2' });
  }
  // 터미널(어두운 상자 + 글 줄)
  function term(P, x, y, w, h, lines, size) {
    const s = size || 11;
    P.rrect(x, y, w, h, 8, { fill: 'ink', fs: 'solid' });
    (lines || []).forEach((l, i) => P.text(x + 10, y + 8 + s + i * (s + 7), l, { mono: true, size: s, anchor: 'start', c: 'paper' }));
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
  // 글자가 든 단추
  function chip(P, x, y, w, h, label, fill, size) {
    P.rrect(x, y, w, h, 8, { fill: fill || 'paper', gap: 5, w: 1.6 });
    P.text(x + w / 2, y + h / 2 + (size || 13) * 0.36, label, { size: size || 13, weight: 700 });
  }
  // 단추를 화살표로 잇기
  function flowRow(P, items, x, y, bw, bh, gap, size, fills) {
    items.forEach((t, i) => {
      const bx = x + i * (bw + gap);
      chip(P, bx, y, bw, bh, t, fills ? fills[i % fills.length] : 'paper', size);
      if (i < items.length - 1) P.arrow(bx + bw + 2, y + bh / 2, bx + bw + gap - 2, y + bh / 2, { c: 'accent', w: 1.8, head: 6 });
    });
  }
  // 노트북
  function laptop(P, x, y, w, h, fill) {
    P.rrect(x, y, w, h, 8, { fill: fill || 'paper', w: 2 });
    P.path(`M${x - 6} ${y + h} L${x + w + 6} ${y + h} L${x + w + 12} ${y + h + 12} L${x - 12} ${y + h + 12} Z`, { fill: 'soft', gap: 5 });
  }
  // 구름(업스테이지 API 쪽)
  function cloud(P, cx, cy, w, h, fill) {
    const l = cx - w / 2, r = cx + w / 2, t = cy - h / 2, b = cy + h / 2;
    P.path(`M${l + w * 0.18} ${b} Q${l} ${b} ${l + w * 0.04} ${cy + h * 0.1} Q${l + w * 0.06} ${t + h * 0.2} ${l + w * 0.28} ${t + h * 0.22} Q${l + w * 0.38} ${t} ${cx + w * 0.06} ${t + h * 0.06} Q${r - w * 0.16} ${t} ${r - w * 0.14} ${t + h * 0.34} Q${r} ${t + h * 0.36} ${r - w * 0.02} ${cy + h * 0.24} Q${r - w * 0.02} ${b} ${r - w * 0.2} ${b} Z`, { fill: fill || 'sky', gap: 6, w: 2 });
  }
  // 열쇠(API 키)
  function keyIcon(P, x, y, s, c) {
    s = s || 1;
    P.circle(x, y, 16 * s, { fill: c || 'hi', fs: 'solid', w: 1.8 });
    P.line(x + 8 * s, y, x + 28 * s, y, { w: 2.6 });
    P.line(x + 20 * s, y, x + 20 * s, y + 7 * s, { w: 2.4 });
    P.line(x + 26 * s, y, x + 26 * s, y + 5 * s, { w: 2.4 });
  }
  // 4요소 캔버스(2×2 칸)
  const EL4 = [['학생활동', 'sky'], ['교사의 할', 'hi'], ['자료', 'good'], ['평가', 'warm']];
  function canvas4(P, x, y, w, h, o) {
    o = o || {};
    const cw = w / 2, ch = h / 2, size = o.size || 14;
    EL4.forEach(([name, fill], i) => {
      const cx = x + (i % 2) * cw, cy = y + Math.floor(i / 2) * ch;
      P.rrect(cx + 3, cy + 3, cw - 6, ch - 6, 8, { fill, gap: 7, w: 1.6 });
      if (o.labels !== false) P.text(cx + cw / 2, cy + ch / 2 + size * 0.36, name, { size, weight: 700 });
    });
  }
  // 줄 몇 개가 적힌 메모 + 돋보기 + 사람(틀린 줄 찾기)
  function memo(P, fill, mood) {
    P.note(18, 16, 190, 164, { fill: fill || 'hi' });
    [44, 72, 100, 128, 156].forEach((y, i) => P.line(36, y, 186 - (i % 3) * 18, y, { c: 'ink2', w: 2.4 }));
    P.circle(206, 118, 54, { fill: 'sky', gap: 6, w: 2.4 });
    P.line(225, 137, 246, 160, { w: 5 });
    person(P, 292, 196, mood || 'wow', 0.65);
  }
  // 말풍선 네 개(어느 문장이 맞을까)
  function fourBubbles(P, fills) {
    [[14, 14], [120, 14], [14, 90], [120, 90]].forEach(([x, y], i) => {
      P.rrect(x, y, 96, 60, 12, { fill: fills[i], gap: 6, w: 1.6 });
      P.line(x + 12, y + 24, x + 80, y + 24, { c: 'ink2', w: 2.4 });
      P.line(x + 12, y + 40, x + 64 - (i % 2) * 14, y + 40, { c: 'ink2', w: 2.4 });
    });
  }
  // 교실 책상 네 개(노트북 + 학생 얼굴). n번 학생은 손을 든다
  function desks(P, n) {
    for (let i = 0; i < 4; i++) {
      const x = 16 + (i % 2) * 84, y = 52 + Math.floor(i / 2) * 76;
      head(P, x + 28, y - 14, 26, i === n ? 'sad' : 'smile');
      laptop(P, x, y, 56, 34, 'paper');
      if (i === n) { P.line(x + 40, y - 16, x + 62, y - 32, { w: 2.2 }); P.circle(x + 64, y - 35, 9, { fill: 'paper' }); }
    }
  }
  // 흩어진 카드(순서 문제용)
  function card(P, x, y) { P.rrect(x, y, 92, 70, 10, { fill: 'paper' }); }
  function cross(P, cx, cy, r, c) {
    P.line(cx - r, cy - r, cx + r, cy + r, { c: c || 'bad', w: 3 });
    P.line(cx + r, cy - r, cx - r, cy + r, { c: c || 'bad', w: 3 });
  }
  function tick(P, cx, cy, r) { P.path(`M${cx - r} ${cy} L${cx - r * 0.3} ${cy + r * 0.7} L${cx + r} ${cy - r * 0.7}`, { c: 'good', w: 3.2 }); }
  // 동그란 머리 + 얼굴
  function head(P, x, y, d, mood) {
    P.circle(x, y, d, { fill: 'paper', w: 1.6 });
    P.face(x, y + d * 0.04, d * 0.8, { mood: mood || 'smile' });
  }
  function ask(P, x, y, size, c) { P.text(x, y, '?', { size: size || 22, weight: 700, c: c || 'warm' }); }

  /* ---------- 모의 화면에서 되풀이하는 조각 ---------- */
  const LAB_FILES = ['.env', '.gitignore', 'AGENTS.md', 'chunks.json', 'vectors.json', 'helper.py', 'app.py'];
  const APP_SRC = src([
    'import streamlit as st',
    'from helper import ask',
    '',
    'st.title("정보 수업 도우미")',
    'if "msgs" not in st.session_state:',
    '    st.session_state.msgs = []',
    'for m in st.session_state.msgs:',
    '    with st.chat_message(m["role"]):',
    '        st.markdown(m["content"])',
    '',
    'def say(role, text):',
    '    st.chat_message(role).markdown(text)',
    '    st.session_state.msgs.append(',
    '        {"role": role, "content": text})',
    '',
    'if q := st.chat_input("질문을 적어요"):',
    '    say("user", q)',
    '    say("assistant", ask(q))']);
  const PLAN_Q = 'helper.py로 Streamlit 채팅 앱 app.py를 만들 계획을 세워 줘. 키는 .env에서만 읽고, 새 패키지는 streamlit 하나만. 코드는 아직 쓰지 마.';
  const PLAN_A = '계획이에요.<br>1. <code>pip install streamlit</code><br>2. <code>app.py</code>: 제목, 대화 기록(<code>st.session_state</code>), 말풍선, 입력칸(<code>st.chat_input</code>)<br>3. 답은 <code>helper.py</code>의 함수로 만들고, 키·모델 이름은 손대지 않음<br>4. 확인: <code>streamlit run app.py</code>로 질문 2개';
  const BUILT = '<code>app.py</code>를 만들었어요(18줄). <code>helper.py</code>와 <code>.env</code>는 건드리지 않았어요. 실행은 직접 확인해 주세요.';
  const APP_HEAD = { k: 'h', text: '정보 수업 도우미', sub: '2학년 반복문 단원 자료로 답해요' };
  const chatBlocks = msgs => [APP_HEAD, { k: 'chat', msgs, input: '', ph: '질문을 적어요', empty: '실습하다 막힌 곳을 물어보세요. 답에는 근거 쪽이 붙어요.' }];
  const Q1 = 'range(1, 5)면 몇 번 돌아요?';
  const A1 = '4번 돌아요. <code>range(1, 5)</code>는 1에서 시작해 5 <b>바로 앞</b>인 4에서 멈춰요. (근거: 반복문 학습지 2쪽)';
  const Q2 = '1부터 5까지 찍으려면 range를 어떻게 써요?';
  const A2 = '<code>range(1, 6)</code>처럼 끝 숫자를 하나 크게 적어요. 바꿔 실행해 보고 몇 번 찍히는지 세어 봐요. (근거: 반복문 학습지 2쪽)';
  const Q3 = '내일 급식 메뉴 알려 줘';
  const A3 = '수업자료에 없는 내용이라 답할 수 없어요. 반복문에서 막힌 곳을 물어봐 줘요.';

  HANIP.unit({
    id: 'c3u2',
    course: '과정 3 · AI 수업도구 만들기',
    title: '단원 2 · 수업 도구의 4요소와 제작 절차',
    goals: ['AI 수업도구 사례마다 쓰는 API와 위험 가려내기', '학생활동·교사의 할·자료·평가로 도구 기획하기', 'helper를 Streamlit 화면으로 바꿔 수업에 넣기'],
    checked: { date: '2026-10-16' },
    sources: [
      'https://console.upstage.ai/docs/models',
      'https://console.upstage.ai/docs/capabilities/generate/chat',
      'https://console.upstage.ai/docs/capabilities/parse/document-parsing',
      'https://console.upstage.ai/docs/capabilities/extract/universal-extraction',
      'https://console.upstage.ai/docs/capabilities/embed',
      'https://console.upstage.ai/docs/guides/rate-limits',
      'https://console.upstage.ai/docs/resources/error-codes',
      'https://www.upstage.ai/pricing/api',
      'https://docs.streamlit.io',
      'https://docs.streamlit.io/develop/api-reference/chat/st.chat_input',
      'https://docs.streamlit.io/develop/api-reference/chat/st.chat_message',
      'https://docs.streamlit.io/develop/api-reference/caching-and-state/st.session_state',
      'https://docs.streamlit.io/develop/api-reference/cli/run',
      'https://www.moe.go.kr/boardCnts/viewRenew.do?boardID=294&boardSeq=105007&lev=0&m=020'
    ],

    figs: {
      /* ---------- L1 설명 그림 ---------- */
      partsTool: { w: 340, h: 204, label: 'Solar, Parse, IE, 임베딩 부품이 수업 한 장면으로 모이는 모습', draw(P) {
        ['Solar', 'Parse', 'IE', '임베딩'].forEach((t, i) => chip(P, 14, 14 + i * 40, 84, 30, t, ['sky', 'hi', 'good', 'pink'][i], 13));
        [29, 69, 109, 149].forEach(y => P.arrow(102, y, 150, 88, { c: 'accent', w: 1.6, head: 7 }));
        P.rrect(156, 18, 170, 140, 12, { fill: 'hi', gap: 8 });
        P.text(241, 44, '수업 한 장면', { size: 14, weight: 700 });
        person(P, 241, 150, 'happy', 0.6);
        P.text(170, 190, '부품을 장면에 맞게 엮어요', { size: 13, c: 'accent' });
      }},
      pickFlow: { w: 340, h: 200, label: '파일은 Parse나 IE로, 글은 Solar로, 정답이 정해진 일은 파이썬 코드로', draw(P) {
        [['PDF·사진 파일', 'Parse 또는 IE', 'hi'], ['질문·글', 'Solar', 'sky'], ['정답이 정해진 일', '파이썬 코드로 비교', 'good']].forEach(([a, b, f], i) => {
          const y = 16 + i * 52;
          chip(P, 12, y, 120, 36, a, 'paper', 12);
          P.arrow(138, y + 18, 184, y + 18, { c: 'accent', w: 2, head: 8 });
          chip(P, 190, y, 138, 36, b, f, 12);
        });
        P.text(170, 190, '넣는 것과 받을 것으로 골라요', { size: 13, c: 'accent' });
      }},
      riskBag: { w: 340, h: 200, label: '놀란 로봇 둘레의 환각, 대리 숙제, 개인정보, 비용과 429 꼬리표', draw(P) {
        P.robot(170, 92, 0.55, { mood: 'wow' });
        chip(P, 14, 24, 96, 32, '환각', 'warm', 13);
        chip(P, 230, 24, 96, 32, '대리 숙제', 'pink', 13);
        chip(P, 14, 108, 96, 32, '개인정보', 'sky', 13);
        chip(P, 230, 108, 96, 32, '비용·429', 'hi', 13);
        P.text(170, 186, '틀렸을 때 누가 알아채나?', { size: 13, c: 'accent' });
      }},

      /* ---------- L1 문제 그림 ---------- */
      q_gradeCode: { w: 340, h: 200, label: '쌓인 학생 코드 쪽지와 물음표가 붙은 테스트 다섯 칸', draw(P) {
        for (let i = 0; i < 4; i++) P.note(16 + i * 10, 18 + i * 8, 84, 100, { fill: i === 3 ? 'hi' : 'paper' });
        P.line(56, 72, 110, 72, { c: 'k', w: 3 });
        P.line(64, 90, 120, 90, { c: 's', w: 3 });
        P.line(56, 108, 104, 108, { c: 'n', w: 3 });
        P.text(72, 160, '학생 코드 20개', { size: 12, c: 'ink2' });
        for (let i = 0; i < 5; i++) { P.rrect(160 + i * 32, 26, 26, 26, 5, { c: 'soft', w: 1.6 }); ask(P, 173 + i * 32, 46, 16); }
        P.text(228, 78, '테스트 5개', { size: 12, weight: 700 });
        person(P, 262, 196, 'wow', 0.6);
        P.text(100, 190, '어떻게 확인할까?', { size: 13, c: 'ink2' });
      }},
      q_scanSheet: { w: 340, h: 200, label: '스캔한 학습지에서 번호, 문항, 정답 칸이 빈 표로 가는 화살표', draw(P) {
        P.note(16, 20, 96, 124, { fill: 'paper' });
        for (let i = 0; i < 5; i++) P.line(28, 46 + i * 18, 98 - (i % 2) * 16, 46 + i * 18, { c: 'soft', w: 3 });
        P.text(64, 166, '스캔한 학습지', { size: 12, c: 'ink2' });
        P.arrow(120, 82, 160, 82, { c: 'accent', w: 2.4, head: 9 });
        P.rrect(168, 30, 156, 104, 6, { fill: 'paper', w: 2 });
        ['번호', '문항', '정답'].forEach((t, i) => P.text(194 + i * 52, 52, t, { size: 12, weight: 700 }));
        P.line(168, 60, 324, 60, { w: 1.4 });
        P.line(220, 30, 220, 134, { w: 1.2, c: 'soft' });
        P.line(272, 30, 272, 134, { w: 1.2, c: 'soft' });
        [88, 118].forEach(y => [194, 246, 298].forEach(x => ask(P, x, y, 16)));
        P.text(246, 166, '칸에 맞춰 뽑으려면?', { size: 12, c: 'ink2' });
      }},
      q_helperChain: { w: 340, h: 200, label: 'PDF에서 Solar까지 이어진 다섯 칸 중 하나가 물음표인 흐름', draw(P) {
        flowRow(P, ['PDF', 'Parse', '?', '찾기', 'Solar'], 12, 52, 52, 40, 14, 13, ['paper', 'hi', 'paper', 'sky', 'sky']);
        P.robot(170, 140, 0.4, { mood: 'smile' });
        P.text(170, 192, '어느 부품이 빠졌을까?', { size: 13, c: 'ink2' });
      }},
      q_caseMemo: { w: 340, h: 200, label: '다섯 줄 메모를 돋보기로 살피는 얼굴', draw(P) {
        memo(P, 'hi', 'wow');
        P.text(292, 52, '어느 줄?', { size: 14, weight: 700, c: 'warm' });
      }},

      /* ---------- L2 설명 그림 ---------- */
      canvas4: { w: 340, h: 204, label: '학생활동, 교사의 할, 자료, 평가 네 칸 가운데의 수업', draw(P) {
        canvas4(P, 40, 8, 260, 150, { size: 15 });
        P.circle(170, 83, 54, { fill: 'paper', fs: 'solid', w: 2 });
        P.text(170, 89, '수업', { size: 16, weight: 700, c: 'accent' });
        P.text(170, 190, '네 칸이 다 차야 수업이 돼요', { size: 13, c: 'ink2' });
      }},
      verbs: { w: 340, h: 200, label: '학생이 먼저 예측을 적고, 도우미에게 묻고, 근거를 확인하는 흐름', draw(P) {
        person(P, 46, 150, 'smile', 0.55);
        flowRow(P, ['예측 적기', '묻기', '근거 확인'], 100, 46, 68, 34, 16, 12, ['sky', 'hi', 'good']);
        P.robot(218, 134, 0.4, { mood: 'happy' });
        P.text(170, 190, '학생이 먼저, 도구는 그다음', { size: 13, c: 'accent' });
      }},
      teacherTimes: { w: 340, h: 204, label: '수업 전 자료 준비, 수업 중 돌며 살피기, 수업 후 기록 보기 시간줄', draw(P) {
        P.note(46, 30, 48, 60, { fill: 'hi' });
        P.line(54, 54, 84, 54, { c: 'ink2', w: 2.4 });
        P.line(54, 70, 78, 70, { c: 'ink2', w: 2.4 });
        person(P, 170, 106, 'smile', 0.55);
        P.note(244, 34, 40, 52, { fill: 'paper' });
        P.circle(282, 72, 30, { fill: 'sky', gap: 5, w: 2 });
        P.line(293, 83, 304, 96, { w: 3.5 });
        P.line(16, 120, 324, 120, { w: 2.4 });
        [70, 170, 270].forEach(x => P.circle(x, 120, 12, { fill: 'accent', fs: 'solid', c: null }));
        P.text(70, 146, '수업 전', { size: 13, weight: 700 });
        P.text(170, 146, '수업 중', { size: 13, weight: 700 });
        P.text(270, 146, '수업 후', { size: 13, weight: 700 });
        P.text(70, 168, '자료·규칙 준비', { size: 11, c: 'ink2' });
        P.text(170, 168, '돌며 살피기', { size: 11, c: 'ink2' });
        P.text(270, 168, '기록 보고 고치기', { size: 11, c: 'ink2' });
        P.text(170, 194, '도구가 생겨도 교사의 일은 남아요', { size: 12, c: 'accent' });
      }},
      dataEval: { w: 340, h: 200, label: '도구가 기대는 근거 문서인 자료, 배움을 보여 주는 출구 카드인 평가', draw(P) {
        P.note(16, 40, 64, 80, { fill: 'good' });
        P.note(26, 30, 64, 80, { fill: 'paper' });
        P.line(36, 56, 76, 56, { c: 'soft', w: 3 });
        P.line(36, 72, 70, 72, { c: 'soft', w: 3 });
        P.line(36, 88, 74, 88, { c: 'soft', w: 3 });
        P.arrow(96, 72, 126, 72, { c: 'accent', w: 2, head: 8 });
        P.robot(170, 78, 0.45, { mood: 'smile' });
        P.text(58, 140, '자료', { size: 15, weight: 700 });
        P.text(58, 160, '도구의 근거', { size: 11, c: 'ink2' });
        P.line(222, 20, 222, 166, { c: 'soft', w: 1.4 });
        P.rrect(240, 30, 84, 94, 8, { fill: 'warm', gap: 7 });
        [54, 78, 102].forEach(y => { tick(P, 256, y, 7); P.line(270, y, 312, y, { c: 'ink2', w: 2.4 }); });
        P.text(282, 140, '평가', { size: 15, weight: 700 });
        P.text(282, 160, '배움의 증거', { size: 11, c: 'ink2' });
        P.text(170, 192, '근거와 증거는 다른 칸', { size: 13, c: 'accent' });
      }},

      /* ---------- L2 문제 그림 ---------- */
      q_whichEl: { w: 340, h: 200, label: '학습지에 "3번?" 예측을 적는 학생과 이름이 빠진 네 칸', draw(P) {
        P.note(20, 34, 110, 124, { fill: 'paper' });
        P.text(75, 70, 'for i in', { mono: true, size: 12 });
        P.text(75, 88, 'range(3):', { mono: true, size: 12 });
        P.text(75, 130, '3번?', { size: 16, weight: 700, c: 'warm' });
        person(P, 186, 196, 'smile', 0.7);
        canvas4(P, 236, 20, 96, 80, { labels: false });
        ask(P, 284, 134, 26);
      }},
      q_badVerb: { w: 340, h: 200, label: '네 문장 말풍선 앞에서 어느 게 좋은지 고민하는 얼굴', draw(P) {
        fourBubbles(P, ['sky', 'hi', 'paper', 'pink']);
        person(P, 282, 196, 'wow', 0.75);
        P.text(282, 50, '어느 게 좋을까?', { size: 13, weight: 700, c: 'warm' });
      }},
      q_canvasBlank: { w: 340, h: 200, label: '퀴즈 쪽지를 만드는 로봇과 이름표가 물음표인 칸', draw(P) {
        P.note(20, 24, 90, 120, { fill: 'paper' });
        P.text(65, 54, '퀴즈', { size: 14, weight: 700 });
        P.line(32, 78, 96, 78, { c: 'soft', w: 3 });
        P.line(32, 98, 88, 98, { c: 'soft', w: 3 });
        P.line(32, 118, 92, 118, { c: 'soft', w: 3 });
        P.arrow(140, 84, 116, 84, { c: 'accent', w: 2, head: 8 });
        P.robot(170, 90, 0.5, { mood: 'proud' });
        P.rrect(232, 50, 92, 70, 10, { c: 'warm', w: 2 });
        ask(P, 278, 96, 30);
        P.text(170, 186, '이 칸의 이름은?', { size: 13, c: 'ink2' });
      }},
      q_canvasLine: { w: 340, h: 200, label: '네 줄 캔버스 메모를 돋보기로 살피는 얼굴', draw(P) {
        memo(P, 'sky', 'smile');
        P.text(292, 52, '고칠 줄?', { size: 14, weight: 700, c: 'warm' });
      }},

      /* ---------- QA 그림 ---------- */
      qa_walk: { w: 340, h: 200, label: '노트북 앞 학생들 사이로 다가가는 교사와 손 든 학생', draw(P) {
        desks(P, 3);
        P.bubble(206, 10, 124, 40, 250, 72);
        P.text(268, 36, '같이 볼까요?', { size: 13 });
        person(P, 260, 196, 'smile', 0.75);
      }},
      qa_pdfCard: { w: 340, h: 200, label: '(가) 학습지 PDF와 (나) 출구 카드, 오른쪽의 빈 칸 두 개', draw(P) {
        file(P, 24, 30, 76, 92, 'PDF', null, 'paper', 13);
        P.line(36, 84, 88, 84, { c: 'soft', w: 3 });
        P.line(36, 102, 80, 102, { c: 'soft', w: 3 });
        P.text(62, 146, '(가) 학습지', { size: 12, weight: 700 });
        P.rrect(130, 40, 80, 70, 8, { fill: 'warm', gap: 6 });
        [60, 76, 92].forEach(y => P.line(142, y, 198, y, { c: 'ink2', w: 2.4 }));
        P.text(170, 146, '(나) 출구 카드', { size: 12, weight: 700 });
        chip(P, 240, 34, 86, 34, '자료 ?', 'paper', 12);
        chip(P, 240, 88, 86, 34, '평가 ?', 'paper', 12);
        P.text(170, 186, '어느 쪽이 어느 칸?', { size: 13, c: 'ink2' });
      }},
      qa_toolLesson: { w: 340, h: 200, label: '반짝이는 앱 창 옆에 물음표가 든 빈 칸 세 개', draw(P) {
        browser(P, 16, 22, 176, 134, 'localhost:8501');
        P.rrect(84, 58, 96, 20, 8, { fill: 'sky', gap: 5, w: 1.2 });
        P.rrect(30, 88, 116, 20, 8, { c: 'ink2', w: 1.2 });
        P.rrect(28, 128, 152, 18, 6, { c: 'accent', w: 1.4 });
        P.sparkle(198, 22, 9, 'hi');
        P.sparkle(24, 176, 6, 'warm');
        [26, 80, 134].forEach(y => { P.rrect(226, y, 98, 40, 8, { c: 'soft', w: 1.6 }); ask(P, 275, y + 28, 20); });
      }},

      /* ---------- L3 설명 그림 ---------- */
      sixSteps: { w: 340, h: 204, label: '문제 정의, 4요소, 시제품, 화면, 시범, 고치기 여섯 단계와 되풀이 화살표', draw(P) {
        ['1. 문제 정의', '2. 4요소', '3. 시제품'].forEach((t, i) => chip(P, 12 + i * 112, 24, 92, 36, t, ['paper', 'hi', 'sky'][i], 12));
        P.arrow(106, 42, 122, 42, { c: 'accent', w: 1.8, head: 6 });
        P.arrow(218, 42, 234, 42, { c: 'accent', w: 1.8, head: 6 });
        P.arrow(282, 64, 282, 100, { c: 'accent', w: 1.8, head: 7 });
        ['6. 고치기', '5. 시범', '4. 화면'].forEach((t, i) => chip(P, 12 + i * 112, 104, 92, 36, t, ['good', 'warm', 'pink'][i], 12));
        P.arrow(234, 122, 218, 122, { c: 'accent', w: 1.8, head: 6 });
        P.arrow(122, 122, 106, 122, { c: 'accent', w: 1.8, head: 6 });
        P.curveArrow(58, 144, 110, 184, 160, 146, { c: 'warm', w: 2, head: 8 });
        P.text(244, 186, '시범과 고치기는 되풀이', { size: 12, c: 'accent' });
      }},
      problemLine: { w: 340, h: 200, label: '손 든 학생 여럿과 다 돌아보지 못해 어지러운 교사', draw(P) {
        for (let i = 0; i < 6; i++) {
          const x = 20 + (i % 3) * 58, y = 62 + Math.floor(i / 3) * 62;
          head(P, x + 16, y, 30, i % 2 ? 'sad' : 'wow');
          P.line(x + 30, y - 4, x + 40, y - 26, { w: 2.2 });
          P.circle(x + 41, y - 30, 9, { fill: 'paper' });
        }
        person(P, 282, 190, 'dizzy', 0.75);
        P.drop(322, 96, 6);
        P.text(100, 188, '손 든 학생 10명+', { size: 13, weight: 700, c: 'warm' });
      }},
      termFirst: { w: 340, h: 200, label: '먼저 터미널에서 helper로 답을 보고, 나중에 화면을 붙이는 순서', draw(P) {
        term(P, 12, 24, 164, 104, ['$ python helper.py', '질문> for문이 뭐예요?', '답> 같은 일을 되풀이…'], 10);
        P.arrow(182, 76, 198, 76, { c: 'accent', w: 2, head: 7 });
        win(P, 204, 34, 124, 84);
        P.line(218, 74, 300, 74, { c: 'soft', w: 3 });
        P.line(218, 94, 280, 94, { c: 'soft', w: 3 });
        P.text(94, 152, '먼저', { size: 14, weight: 700, c: 'accent' });
        P.text(266, 152, '나중에', { size: 14, weight: 700, c: 'ink2' });
        P.text(170, 190, '답이 좋아야 화면도 쓸모 있어요', { size: 12, c: 'ink2' });
      }},
      planSmall: { w: 340, h: 200, label: 'Plan, 작게 Build, 직접 확인, 커밋을 한 단계씩 되풀이하는 고리', draw(P) {
        P.text(170, 40, '한 단계씩 되풀이', { size: 14, weight: 700, c: 'accent' });
        flowRow(P, ['Plan', '작게 Build', '직접 확인', '커밋'], 6, 64, 72, 40, 14, 12, ['sky', 'hi', 'good', 'paper']);
        P.curveArrow(296, 110, 170, 172, 44, 110, { c: 'soft', w: 2, head: 8 });
        P.text(170, 192, '다음 단계로', { size: 12, c: 'ink2' });
      }},
      pilot: { w: 340, h: 214, label: '학생 역할 동료가 "답만 줘!"라고 하고, 만든 교사는 지켜보며 적는 시범', draw(P) {
        person(P, 80, 186, 'wink', 0.75);
        P.bubble(20, 14, 120, 42, 80, 86);
        P.text(80, 41, '답만 줘!', { size: 14, weight: 700 });
        P.note(180, 30, 78, 98, { fill: 'hi' });
        [58, 78, 98].forEach(y => P.line(192, y, 244, y, { c: 'ink2', w: 2.4 }));
        person(P, 292, 186, 'smile', 0.6);
        P.text(80, 206, '학생 역할 동료', { size: 12, weight: 700 });
        P.text(258, 206, '지켜보며 적기', { size: 12, weight: 700 });
      }},

      /* ---------- L3 문제 그림 ---------- */
      q_probDef: { w: 340, h: 200, label: '네 문장 말풍선 앞에서 문제인지 해결책인지 고민하는 얼굴', draw(P) {
        fourBubbles(P, ['hi', 'sky', 'pink', 'paper']);
        person(P, 282, 196, 'wow', 0.75);
        P.text(282, 50, '문제? 해결책?', { size: 13, weight: 700, c: 'warm' });
        P.text(116, 188, '어느 문장이 문제 정의일까?', { size: 12, c: 'ink2' });
      }},
      q_agentOrder: { w: 340, h: 200, label: '뒤섞인 카드: 계획 쪽지, Build 단추, 터미널, 커밋 동그라미', draw(P) {
        card(P, 14, 16);
        P.note(36, 24, 46, 52, { fill: 'sky' });
        P.text(59, 58, 'Plan', { size: 11, weight: 700 });
        card(P, 126, 58);
        P.rrect(140, 82, 64, 22, 6, { fill: 'accent', gap: 4, w: 1.4 });
        P.text(172, 98, 'Build', { size: 11, weight: 700 });
        card(P, 238, 14);
        P.rrect(248, 24, 72, 50, 5, { fill: 'ink', fs: 'solid' });
        P.text(256, 54, '$ run', { mono: true, size: 10, anchor: 'start', c: 'paper' });
        card(P, 56, 116);
        P.line(102, 128, 102, 174, { w: 2 });
        P.circle(102, 151, 26, { fill: 'good', gap: 5 });
        P.robot(270, 146, 0.5, { mood: 'wow' });
        ask(P, 116, 40, 22, 'warm');
        ask(P, 226, 112, 22, 'bad');
        ask(P, 30, 110, 20, 'accent');
      }},
      q_screenFirst: { w: 340, h: 200, label: '반짝이는 앱 화면에 엉뚱한 답이 떠서 어지러운 얼굴', draw(P) {
        browser(P, 14, 20, 196, 144, 'localhost:8501');
        P.rrect(96, 58, 100, 22, 8, { fill: 'sky', gap: 5, w: 1.2 });
        P.rrect(28, 94, 130, 40, 8, { c: 'bad', w: 1.6 });
        P.text(93, 119, '엉뚱한 답', { size: 12, weight: 700, c: 'bad' });
        P.sparkle(204, 22, 8, 'hi');
        P.sparkle(26, 176, 6, 'warm');
        person(P, 282, 196, 'dizzy', 0.75);
        P.text(282, 50, '예쁜데…', { size: 14, weight: 700, c: 'warm' });
      }},

      /* ---------- L4 설명 그림 ---------- */
      pyToWeb: { w: 340, h: 200, label: 'app.py 파일 하나가 브라우저 속 채팅 화면이 되는 모습', draw(P) {
        file(P, 16, 40, 80, 100, 'app.py', 'smile', 'hi', 12);
        P.arrow(104, 90, 144, 90, { c: 'accent', w: 2.4, head: 9 });
        browser(P, 150, 24, 178, 142, 'localhost:8501');
        P.rrect(208, 58, 108, 20, 8, { fill: 'sky', gap: 5, w: 1.2 });
        P.rrect(162, 88, 120, 20, 8, { c: 'ink2', w: 1.2 });
        P.rrect(162, 136, 154, 18, 6, { c: 'accent', w: 1.4 });
        P.text(170, 190, '파이썬 파일 하나 → 웹 화면', { size: 13, c: 'accent' });
      }},
      rerun: { w: 340, h: 200, label: '코드가 맨 위부터 다시 돌고, session_state 상자만 남아 있는 모습', draw(P) {
        P.rrect(20, 14, 190, 160, 10, { fill: 'paper', w: 2 });
        ['k', 's', 'n', 't', 'k', 's', 'n'].forEach((c, i) => P.line(34 + (i % 3) * 10, 34 + i * 20, 120 + ((i * 37) % 60), 34 + i * 20, { c, w: 3 }));
        P.curveArrow(222, 140, 300, 84, 222, 24, { c: 'accent', w: 2.6, head: 10 });
        P.text(300, 92, '다시', { size: 14, weight: 700, c: 'accent' });
        P.rrect(232, 148, 100, 34, 8, { fill: 'hi', gap: 6 });
        P.text(282, 170, 'session_state', { mono: true, size: 10, weight: 700 });
        P.text(115, 194, '보낼 때마다 맨 위부터 다시', { size: 12, c: 'ink2' });
      }},
      keyPath: { w: 340, h: 210, label: '학생 브라우저에는 화면과 글만, 키는 교사 컴퓨터의 .env에만, 요청은 업스테이지 API로', draw(P) {
        browser(P, 8, 20, 76, 60);
        browser(P, 8, 100, 76, 60);
        P.arrow(128, 74, 88, 52, { c: 'good', w: 2, head: 8 });
        P.arrow(128, 100, 88, 128, { c: 'good', w: 2, head: 8 });
        P.text(108, 92, '화면·글', { size: 10, c: 'good', weight: 700 });
        laptop(P, 134, 50, 92, 64, 'paper');
        keyIcon(P, 156, 80, 0.9, 'hi');
        P.text(202, 86, '.env', { mono: true, size: 11, weight: 700 });
        P.arrow(232, 74, 252, 74, { c: 'accent', w: 2, head: 7 });
        P.arrow(252, 92, 232, 92, { c: 'accent', w: 2, head: 7 });
        cloud(P, 294, 82, 76, 58, 'sky');
        P.text(294, 88, 'API', { size: 13, weight: 700 });
        P.text(46, 184, '학생 브라우저', { size: 12, weight: 700 });
        P.text(180, 154, '교사 컴퓨터', { size: 12, weight: 700 });
        P.text(180, 172, '키는 여기에만', { size: 11, c: 'accent', weight: 700 });
        P.text(294, 140, '업스테이지', { size: 12, weight: 700 });
      }},
      twoUrls: { w: 340, h: 200, label: '터미널의 Local URL은 이 컴퓨터로, Network URL은 같은 네트워크의 다른 기기로', draw(P) {
        term(P, 12, 12, 316, 80, ['$ streamlit run app.py', 'Local URL: http://localhost:8501', 'Network URL: http://192.168.0.12:8501'], 10);
        P.arrow(80, 98, 80, 114, { c: 'accent', w: 2, head: 7 });
        laptop(P, 40, 118, 80, 44, 'paper');
        P.arrow(260, 98, 260, 112, { c: 'accent', w: 2, head: 7 });
        laptop(P, 196, 124, 54, 36, 'paper');
        P.rrect(272, 116, 34, 52, 7, { fill: 'paper', w: 2 });
        P.text(80, 192, '이 컴퓨터', { size: 12, weight: 700 });
        P.text(254, 192, '같은 네트워크의 다른 기기', { size: 12, weight: 700 });
      }},

      /* ---------- L4 문제 그림 ---------- */
      q_forgetful: { w: 340, h: 200, label: '앞 대화가 흐릿하게 사라지고 새 말풍선 하나만 남은 앱과 시무룩한 얼굴', draw(P) {
        browser(P, 14, 16, 200, 164, 'localhost:8501');
        P.rrect(96, 52, 104, 20, 8, { c: 'soft', w: 1.2 });
        P.rrect(28, 82, 120, 20, 8, { c: 'soft', w: 1.2 });
        P.rrect(96, 118, 104, 20, 8, { fill: 'sky', gap: 5, w: 1.2 });
        P.rrect(28, 152, 172, 18, 6, { c: 'accent', w: 1.4 });
        person(P, 282, 196, 'sad', 0.75);
        P.text(282, 50, '앞 대화는?', { size: 14, weight: 700, c: 'warm' });
      }},
      q_keyLine: { w: 340, h: 200, label: 'app.py에서 열쇠가 학생 브라우저 화면으로 날아간 모습', draw(P) {
        file(P, 14, 40, 80, 100, 'app.py', null, 'hi', 12);
        P.line(26, 86, 80, 86, { c: 'k', w: 3 });
        P.line(26, 104, 72, 104, { c: 's', w: 3 });
        browser(P, 150, 40, 176, 120, 'localhost:8501');
        keyIcon(P, 214, 104, 1.2, 'hi');
        P.curveArrow(98, 70, 140, 24, 196, 92, { c: 'bad', w: 2.2, head: 8 });
        P.drop(300, 80, 7);
        P.text(170, 188, '키가 어디서 샜을까?', { size: 13, c: 'ink2' });
      }},
      q_stateBlank: { w: 340, h: 200, label: '앱 화면 아래쪽 입력칸 자리에 물음표', draw(P) {
        browser(P, 14, 16, 220, 164, 'localhost:8501');
        P.text(34, 56, '정보 수업 도우미', { size: 13, weight: 700, anchor: 'start' });
        P.rrect(110, 74, 110, 20, 8, { fill: 'sky', gap: 5, w: 1.2 });
        P.rrect(28, 104, 130, 20, 8, { c: 'ink2', w: 1.2 });
        P.rrect(26, 144, 196, 26, 8, { c: 'accent', w: 1.8 });
        ask(P, 124, 164, 18);
        person(P, 290, 196, 'smile', 0.65);
      }},
      q_devtools: { w: 340, h: 200, label: '노트북의 개발자 도구 칸과 열쇠 옆 물음표, 궁금한 학생 얼굴', draw(P) {
        laptop(P, 20, 40, 140, 92, 'paper');
        P.rrect(30, 50, 66, 20, 6, { fill: 'sky', gap: 5, w: 1.2 });
        P.rect(102, 46, 52, 82, { fill: 'soft', gap: 4, w: 1.2 });
        [62, 78, 94, 110].forEach(y => P.line(108, y, 148, y, { c: 'ink2', w: 2 }));
        keyIcon(P, 196, 70, 1.1, 'hi');
        ask(P, 250, 82, 26);
        person(P, 292, 196, 'wink', 0.65);
        P.text(100, 186, '개발자 도구로 보일까?', { size: 12, c: 'ink2' });
      }},

      /* ---------- QB 그림 ---------- */
      qb_refresh: { w: 340, h: 200, label: '새로고침 화살표 뒤 텅 빈 채팅 화면과 놀란 얼굴', draw(P) {
        browser(P, 14, 16, 210, 164, 'localhost:8501');
        P.curveArrow(154, 98, 120, 44, 84, 98, { c: 'accent', w: 3, head: 10 });
        P.text(119, 140, '대화가 사라졌어요', { size: 12, c: 'ink2' });
        P.rrect(28, 152, 182, 18, 6, { c: 'accent', w: 1.4 });
        person(P, 284, 196, 'wow', 0.75);
      }},
      qb_runCmd: { w: 340, h: 200, label: 'python app.py 뒤 경고 몇 줄과 빈 브라우저 창', draw(P) {
        term(P, 12, 20, 206, 104, ['$ python app.py', 'Warning: to view', 'this Streamlit app…'], 10);
        browser(P, 232, 30, 96, 84);
        ask(P, 280, 92, 26);
        head(P, 70, 158, 40, 'wow');
        P.text(190, 166, '화면이 안 떠요', { size: 13, c: 'ink2' });
      }},
      qb_teacherView: { w: 340, h: 200, label: '학생 화면과 반 전체 질문 표를 합치려는 모습', draw(P) {
        browser(P, 10, 24, 150, 120);
        P.rrect(70, 58, 80, 18, 7, { fill: 'sky', gap: 5, w: 1.2 });
        P.rrect(20, 86, 100, 18, 7, { c: 'ink2', w: 1.2 });
        P.rrect(20, 120, 130, 16, 6, { c: 'accent', w: 1.4 });
        P.text(170, 92, '+', { size: 24, weight: 700, c: 'warm' });
        P.rrect(180, 24, 150, 120, 8, { fill: 'paper', w: 2 });
        P.line(180, 48, 330, 48, { w: 1.4 });
        [66, 84, 102, 120].forEach(y => P.line(192, y, 316, y, { c: 'soft', w: 2.4 }));
        P.text(85, 170, '학생 화면', { size: 13, weight: 700 });
        P.text(255, 170, '반 전체 질문 표', { size: 13, weight: 700 });
      }},

      /* ---------- L5 설명 그림 ---------- */
      lessonFlow: { w: 340, h: 200, label: '도입, 전개, 정리 세 칸과 반짝이는 한 칸', draw(P) {
        P.sparkle(161, 34, 10, 'hi');
        P.rrect(12, 56, 70, 44, 8, { fill: 'sky', gap: 6 });
        P.rrect(86, 56, 150, 44, 8, { fill: 'hi', gap: 6 });
        P.rrect(240, 56, 88, 44, 8, { fill: 'good', gap: 6 });
        P.text(47, 84, '도입', { size: 14, weight: 700 });
        P.text(161, 84, '전개', { size: 14, weight: 700 });
        P.text(284, 84, '정리', { size: 14, weight: 700 });
        P.text(47, 124, '퀴즈', { size: 11, c: 'ink2' });
        P.text(161, 124, '막히면 도우미', { size: 11, c: 'ink2' });
        P.text(284, 124, '고쳐 쓰기', { size: 11, c: 'ink2' });
        P.text(170, 176, '한 차시엔 한 장면에만', { size: 13, c: 'accent' });
      }},
      logFile: { w: 340, h: 200, label: 'log.csv 기록표를 돋보기로 훑어보는 교사', draw(P) {
        P.note(16, 16, 190, 150, { fill: 'paper' });
        P.text(30, 40, 'log.csv', { mono: true, size: 12, weight: 700, anchor: 'start' });
        P.text(52, 66, '시간', { size: 11, weight: 700 });
        P.text(116, 66, '질문', { size: 11, weight: 700 });
        P.text(176, 66, '모름', { size: 11, weight: 700 });
        P.line(26, 74, 196, 74, { w: 1.4 });
        [94, 114, 134, 154].forEach(y => P.line(30, y, 190 - (y % 3) * 10, y, { c: 'soft', w: 2.4 }));
        P.circle(232, 110, 50, { fill: 'sky', gap: 5, w: 2.4 });
        P.line(250, 128, 266, 148, { w: 5 });
        person(P, 300, 196, 'smile', 0.6);
        P.text(110, 190, '이름 대신 자리 번호', { size: 12, c: 'accent' });
      }},
      checkList: { w: 340, h: 200, label: '네트워크, 기기, 동시 요청, 비용, 지침 다섯 칸 확인표', draw(P) {
        P.rrect(20, 24, 170, 164, 10, { fill: 'paper', w: 2 });
        P.rrect(80, 14, 50, 20, 6, { fill: 'soft', fs: 'solid' });
        ['네트워크', '기기', '동시 요청', '비용', '지침'].forEach((t, i) => {
          const y = 56 + i * 28;
          P.rect(36, y - 12, 14, 14, { w: 1.6 });
          P.text(62, y, t, { size: 13, anchor: 'start' });
        });
        P.bubble(208, 14, 124, 40, 260, 78);
        P.text(270, 40, '수업 전날 확인!', { size: 12, weight: 700 });
        person(P, 270, 196, 'smile', 0.8);
      }},
      schoolSteps: { w: 340, h: 200, label: '교원 의견 수렴, 기준 충족 확인, 학운위 심의, 학교장 확정 계단', draw(P) {
        ['교원 의견 수렴', '기준 충족 확인', '학운위 심의', '학교장 확정'].forEach((t, i) => {
          const x = 8 + i * 78, y = 18 + i * 34;
          chip(P, x, y, 96, 30, t, ['sky', 'hi', 'good', 'warm'][i], 11);
          if (i < 3) P.arrow(x + 70, y + 32, x + 90, y + 40, { c: 'accent', w: 1.8, head: 6 });
        });
        P.text(170, 186, '교사가 만든 챗봇도? 학교에 먼저 물어요', { size: 12, c: 'accent' });
      }},
      trackPick: { w: 340, h: 200, label: '트랙 A 자동채점·튜터와 트랙 B 자료 기반 챗봇 갈림길 표지판과 4요소 캔버스', draw(P) {
        P.line(170, 30, 170, 184, { w: 4 });
        P.path('M170 30 L300 30 L318 48 L300 66 L170 66 Z', { fill: 'sky', gap: 6 });
        P.text(240, 54, 'A 자동채점·튜터', { size: 12, weight: 700 });
        P.path('M170 80 L40 80 L22 98 L40 116 L170 116 Z', { fill: 'hi', gap: 6 });
        P.text(100, 104, 'B 자료 기반 챗봇', { size: 12, weight: 700 });
        canvas4(P, 232, 112, 76, 60, { labels: false });
        P.text(90, 162, '학생활동을 보고 골라요', { size: 12, c: 'accent' });
      }},

      /* ---------- L5 문제 그림 ---------- */
      q_whereUse: { w: 340, h: 200, label: '실습 시작하자마자 손을 드는 학생과 0분을 가리키는 시계', draw(P) {
        laptop(P, 30, 84, 110, 66, 'paper');
        head(P, 85, 60, 36, 'wow');
        P.line(106, 60, 122, 30, { w: 2.4 });
        P.circle(124, 26, 10, { fill: 'paper' });
        P.circle(250, 72, 72, { fill: 'paper', w: 2 });
        P.line(250, 72, 250, 46, { w: 2.4 });
        P.line(250, 72, 268, 72, { w: 2.4 });
        P.text(250, 132, '실습 시작 0분', { size: 12, weight: 700 });
        P.text(170, 188, '바로 물어도 될까?', { size: 13, c: 'ink2' });
      }},
      q_logWhat: { w: 340, h: 200, label: 'log.csv의 칸 이름이 모두 물음표인 기록표', draw(P) {
        P.note(20, 20, 200, 140, { fill: 'paper' });
        P.text(36, 44, 'log.csv', { mono: true, size: 12, weight: 700, anchor: 'start' });
        [0, 1, 2, 3].forEach(i => { P.rrect(34 + i * 44, 58, 38, 24, 4, { c: 'soft', w: 1.4 }); ask(P, 53 + i * 44, 76, 15); });
        [104, 124, 144].forEach(y => P.line(34, y, 200, y, { c: 'soft', w: 2.4 }));
        person(P, 282, 196, 'smile', 0.75);
        P.text(282, 50, '무엇을 남길까?', { size: 13, weight: 700, c: 'warm' });
      }},
      q_cost: { w: 340, h: 200, label: '반 학생 얼굴들과 물음표가 든 달러 동전', draw(P) {
        for (let r = 0; r < 3; r++) for (let c = 0; c < 5; c++) head(P, 26 + c * 30, 32 + r * 32, 24, (r + c) % 3 ? 'smile' : 'happy');
        P.text(86, 136, '30명 × 질문 10개', { size: 12, weight: 700 });
        P.circle(262, 78, 84, { fill: 'hi', gap: 6, w: 2.4 });
        P.text(262, 88, '$?', { size: 28, weight: 700, c: 'warm' });
        P.text(170, 186, '토큰을 달러로 바꾸면?', { size: 13, c: 'ink2' });
      }},
      q_schoolRule: { w: 340, h: 200, label: '이름 입력칸이 있는 앱 창과 학교 건물 사이의 물음표', draw(P) {
        browser(P, 12, 20, 164, 130, 'localhost:8501');
        P.rrect(28, 66, 132, 24, 6, { c: 'accent', w: 1.6 });
        P.text(36, 83, '이름:', { size: 12, anchor: 'start' });
        P.rrect(28, 104, 132, 20, 7, { c: 'soft', w: 1.2 });
        P.path('M216 90 L270 54 L324 90 Z', { fill: 'warm', gap: 6 });
        P.rrect(224, 90, 92, 70, 4, { fill: 'paper', w: 2 });
        P.rect(260, 126, 20, 34, { w: 1.6 });
        P.rect(236, 100, 16, 14, { w: 1.4 });
        P.rect(288, 100, 16, 14, { w: 1.4 });
        ask(P, 196, 108, 26);
        P.text(170, 188, '학생에게 쓰게 하기 전에', { size: 12, c: 'ink2' });
      }},

      /* ---------- T1 그림 ---------- */
      t_demoIE: { w: 340, h: 200, label: '학습지 사진이 번호·문항·정답 표가 되는 연수 시연, 가운데 물음표', draw(P) {
        P.rrect(16, 40, 100, 80, 10, { fill: 'paper', w: 2 });
        P.rect(30, 30, 26, 10, { fill: 'soft', fs: 'solid', w: 1.4 });
        P.circle(66, 80, 44, { fill: 'sky', gap: 5, w: 2 });
        P.text(66, 144, '학습지 사진', { size: 12, c: 'ink2' });
        P.arrow(124, 80, 164, 80, { c: 'accent', w: 2.4, head: 9 });
        ask(P, 144, 66, 20);
        P.rrect(172, 30, 152, 100, 6, { fill: 'paper', w: 2 });
        ['번호', '문항', '정답'].forEach((t, i) => P.text(197 + i * 51, 52, t, { size: 12, weight: 700 }));
        P.line(172, 60, 324, 60, { w: 1.4 });
        [80, 100, 120].forEach(y => P.line(184, y, 312, y, { c: 'soft', w: 2.4 }));
        P.text(170, 186, '1일차 11:00 사례 시연', { size: 12, c: 'accent' });
      }},
      t_teacherRole: { w: 340, h: 200, label: '노트북 앞 학생들과 무엇을 할지 고민하는 교사', draw(P) {
        desks(P, 1);
        person(P, 262, 196, 'wow', 0.75);
        P.text(262, 50, '그동안 나는?', { size: 14, weight: 700, c: 'warm' });
      }},
      t_canvasLine: { w: 340, h: 200, label: '자료 요약 도구의 네 줄 캔버스를 돋보기로 살피는 얼굴', draw(P) {
        memo(P, 'good', 'wink');
        P.text(292, 52, '어디가 문제?', { size: 13, weight: 700, c: 'warm' });
      }},
      t_sixOrder: { w: 340, h: 200, label: '뒤섞인 카드 여섯 장: 말풍선, 네 칸, 터미널, 창, 두 얼굴, 렌치', draw(P) {
        card(P, 12, 12);
        P.bubble(26, 22, 60, 30, 40, 62);
        card(P, 124, 24);
        canvas4(P, 136, 32, 68, 54, { labels: false });
        card(P, 236, 10);
        P.rrect(248, 20, 68, 48, 5, { fill: 'ink', fs: 'solid' });
        P.text(256, 48, '$ py', { mono: true, size: 10, anchor: 'start', c: 'paper' });
        card(P, 30, 110);
        win(P, 40, 118, 72, 52);
        card(P, 140, 118);
        head(P, 166, 152, 28, 'smile');
        head(P, 206, 152, 28, 'wink');
        card(P, 246, 104);
        P.line(268, 160, 310, 118, { w: 4, c: 'ink2' });
        P.circle(312, 116, 14, { c: 'ink2', w: 3 });
        ask(P, 116, 106, 20, 'warm');
        ask(P, 230, 96, 20, 'bad');
      }},
      t_appBlank: { w: 340, h: 200, label: 'app.py 코드 줄 두 곳이 빈칸인 편집기', draw(P) {
        P.rrect(14, 20, 220, 150, 10, { fill: 'paper', w: 2 });
        P.text(28, 44, 'app.py', { mono: true, size: 12, weight: 700, anchor: 'start' });
        P.line(14, 54, 234, 54, { w: 1.4, c: 'soft' });
        P.line(28, 76, 70, 76, { c: 'k', w: 3 });
        P.rrect(76, 66, 70, 18, 5, { c: 'warm', w: 1.8 });
        ask(P, 111, 81, 14);
        P.line(152, 76, 210, 76, { c: 's', w: 3 });
        P.line(44, 106, 64, 106, { c: 'k', w: 3 });
        P.rrect(70, 96, 84, 18, 5, { c: 'warm', w: 1.8 });
        ask(P, 112, 111, 14);
        P.line(160, 106, 214, 106, { c: 'n', w: 3 });
        P.line(60, 136, 200, 136, { c: 't', w: 3 });
        person(P, 290, 196, 'smile', 0.7);
      }},
      t_localhost: { w: 340, h: 200, label: '내 노트북과 옆자리 노트북, 옆자리 화면의 localhost에 X 표시', draw(P) {
        laptop(P, 20, 46, 120, 78, 'paper');
        P.text(80, 82, 'streamlit', { mono: true, size: 11 });
        P.text(80, 100, 'run app.py', { mono: true, size: 11 });
        laptop(P, 200, 46, 120, 78, 'paper');
        P.text(260, 76, 'localhost', { mono: true, size: 11 });
        P.text(260, 92, ':8501', { mono: true, size: 11 });
        cross(P, 260, 110, 7);
        P.path('M154 70 Q170 56 186 70', { c: 'accent', w: 2 });
        P.path('M160 82 Q170 74 180 82', { c: 'accent', w: 2 });
        P.text(80, 164, '내 노트북', { size: 12, weight: 700 });
        P.text(260, 164, '옆자리 선생님', { size: 12, weight: 700 });
        P.text(170, 190, '연수장 와이파이', { size: 12, c: 'accent' });
      }},
      t_429: { w: 340, h: 200, label: '여러 얼굴의 화살표가 한 노트북으로 몰리고 화면에 429', draw(P) {
        for (let i = 0; i < 6; i++) {
          head(P, 24, 22 + i * 28, 22, i % 2 ? 'smile' : 'wow');
          P.arrow(42, 22 + i * 28, 140, 92, { c: 'soft', w: 1.4, head: 6 });
        }
        laptop(P, 146, 60, 96, 62, 'paper');
        P.text(194, 100, '429', { size: 22, weight: 700, c: 'bad', mono: true });
        cloud(P, 296, 90, 64, 48, 'sky');
        P.text(194, 160, '한 키로 동시에', { size: 12, weight: 700 });
        P.text(194, 188, '2일차 오후 실습', { size: 12, c: 'accent' });
      }},
      t_problemDef: { w: 340, h: 200, label: '네 문장 말풍선 중 해결책부터 말한 것을 찾는 얼굴', draw(P) {
        fourBubbles(P, ['paper', 'good', 'sky', 'hi']);
        person(P, 282, 196, 'wink', 0.75);
        P.text(282, 50, '해결책부터?', { size: 13, weight: 700, c: 'warm' });
      }},
      t_cheatTutor: { w: 340, h: 200, label: '"정답 코드만 줘"라는 말에 로봇이 코드 쪽지를 그대로 건네는 모습', draw(P) {
        person(P, 70, 190, 'wink', 0.7);
        P.bubble(14, 14, 130, 44, 70, 94);
        P.text(79, 42, '정답 코드만 줘', { size: 13, weight: 700 });
        file(P, 156, 96, 64, 72, 'answer.py', null, 'hi', 9);
        P.robot(266, 86, 0.6, { mood: 'happy' });
        P.text(258, 186, '그대로 줘 버렸어요', { size: 12, c: 'bad' });
      }},
      t_shareKey: { w: 340, h: 200, label: '반 단체방에 app.py, helper.py, 열쇠가 든 .env를 올리려는 모습', draw(P) {
        win(P, 14, 14, 206, 168);
        P.text(117, 54, '반 단체방', { size: 13, weight: 700 });
        chip(P, 28, 70, 84, 28, 'app.py', 'paper', 11);
        chip(P, 120, 70, 88, 28, 'helper.py', 'paper', 11);
        chip(P, 28, 112, 84, 28, '.env', 'warm', 11);
        keyIcon(P, 136, 126, 0.9, 'hi');
        person(P, 284, 196, 'wow', 0.75);
        P.text(284, 50, '올려도 될까?', { size: 13, weight: 700, c: 'warm' });
      }}
    },

    items: [
    /* =================== L1 =================== */
    { id: 'L1', type: 'lesson', title: 'AI 수업도구 사례 살펴보기', sub: '질문 도우미·자동채점·퀴즈·피드백·요약, 각각 무슨 부품을 쓸까', min: 9, steps: [
      { t: 'say', h: 'AI 수업도구는 수업 한 장면에 API 부품을 엮은 것', fig: 'partsTool', p: [
        '과정 1·2에서 부품을 하나씩 익혔어요. 글로 답하는 <b>Solar</b>, 문서를 글로 바꾸는 <b>Document Parse</b>(줄여서 Parse), 정해진 칸을 뽑는 <b>Information Extract</b>(IE), 뜻으로 찾는 <b>임베딩</b>이요. c3u1에서는 이걸 엮어 <code>helper.py</code>를 만들었죠.',
        '<b>AI 수업도구</b>는 이 부품들을 <b>수업 한 장면</b>에 맞게 엮은 프로그램이에요. 출발점은 부품이 아니라 장면이에요. "Solar로 뭘 만들까?"보다 "실습 시간에 손 든 학생이 너무 많아"가 먼저예요.',
        '연수 1일차 11:00 「AI 수업도구 사례 시연과 제작 절차」에서 여러 도구를 보게 돼요. 다음 표를 옆에 두고 "이건 어느 부품이지?"를 짚어 보면 시연이 훨씬 잘 보여요.'
      ]},
      { t: 'say', h: '다섯 가지 사례와 쓰는 부품', table: { head: ['도구', '학생이 하는 일', '쓰는 API', '위험'], rows: [
        ['<b>질문 도우미</b>', '실습 중 막힌 개념을 묻고, 답에 붙은 근거 쪽을 찾아 읽어요', 'Parse → 임베딩 → Solar', '자료 밖 질문에 그럴듯한 틀린 답, 과제를 통째로 맡기기'],
        ['<b>자동채점 + 힌트</b>', '코드를 내고, 틀린 테스트를 보고 고쳐요', '채점은 파이썬 코드, 힌트는 Solar(문제·정답 정리는 IE)', '힌트가 정답 코드를 통째로 알려 주기'],
        ['<b>퀴즈 생성</b>', '교사가 확인한 퀴즈를 풀어요', 'Solar 구조화 출력(자료가 PDF면 Parse 먼저)', '틀린 정답, 수준에 안 맞는 문제'],
        ['<b>서술형 피드백</b>', '설명을 쓰고, 피드백을 받아 고쳐 써요', 'Solar(루브릭을 함께 넣기)', 'AI 점수를 그대로 성적에 쓰기'],
        ['<b>자료 요약</b>', '긴 읽기 자료의 요약을 보고 원문에서 핵심을 찾아요', 'Parse → Solar', '빠진 내용, 원문을 안 읽게 됨'] ] }, p: [
        '같은 Solar라도 도구마다 맡는 일이 달라요. 자동채점처럼 <b>정답이 정해진 일은 AI보다 코드</b>가 더 정확하고 싸요.',
        '연수를 함께 여는 팀모노리스는 자동 채점과 AI 튜터가 들어 있는 코딩 교육 서비스를 만드는 에듀테크 기업이에요. 2일차 트랙 A(자동채점 + AI튜터)에서 표의 둘째 줄을 직접 만들어 봐요(c4u1·c4u2).'
      ]},
      { t: 'say', h: '부품은 "무엇을 넣고 무엇을 받나"로 골라요', fig: 'pickFlow', p: [
        '넣는 것이 <b>파일</b>(PDF·스캔·사진)이면 먼저 Parse로 글로 바꾸거나, 정해진 칸만 필요하면 IE로 바로 뽑아요. 넣는 것이 <b>글</b>이면 Solar가 받아요.',
        '받고 싶은 것이 <b>자유로운 답</b>이면 Solar, <b>정해진 칸</b>(문항·정답·점수)이면 구조화 출력이나 IE예요. 답에 <b>자료 속 근거</b>가 필요하면 임베딩 검색이 앞에 붙어요.',
        '맞고 틀림이 분명한 일(코드 실행 결과, 객관식 정답)은 AI에게 묻지 말고 <b>파이썬 코드</b>로 비교해요. 빠르고, 공짜고, 늘 같은 답을 줘요.'
      ], tip: '임베딩은 찾기만 하고 글을 쓰지 않아요. 답 글은 언제나 Solar가 써요(c2u3).' },
      { t: 'say', h: '사례마다 위험이 따라와요', fig: 'riskBag', p: [
        '표의 오른쪽 칸을 다시 봐요. 환각(그럴듯한 틀린 답), 대리 숙제, 학생 개인정보, 비용과 요청 수 제한(<code>429</code>)은 거의 모든 도구에 붙어 다녀요.',
        '그래서 도구를 고를 때 "얼마나 똑똑한가"만큼 "틀렸을 때 누가 어떻게 알아채나"를 같이 정해요. 이게 다음 레슨의 <b>교사의 할</b>과 <b>평가</b>로 이어져요.',
        '막는 방법(입력·출력 검사, 기록, 횟수 제한)은 다음 단원 c3u3에서 하나씩 만들어요.'
      ]},
      { t: 'q', kind: 'mc', fig: 'q_gradeCode', q: '학생 20명이 낸 파이썬 함수가 테스트 5개를 통과하는지 보려 해요. 가장 알맞은 방법은?',
        opts: ['Solar에게 코드를 보여 주고 맞았는지 묻는다', '테스트 케이스를 파이썬 코드로 돌려 결과를 비교한다', '학생 코드와 정답 코드를 임베딩해 유사도를 본다', 'IE에 학생 코드를 넣어 정답 칸을 뽑는다'], a: 1,
        why: '실행 결과가 맞는지는 정해져 있어요. 테스트를 코드로 돌려 비교하면 빠르고, 공짜고, 늘 같은 결과예요. Solar는 틀린 테스트를 보고 <b>힌트</b>를 줄 때 써요(c4u1·c4u2).',
        ex: ['그럴듯하게 판정하지만 틀릴 수 있고, 물을 때마다 돈이 들어요.', '', '모양이 비슷해도 틀린 코드, 모양이 달라도 맞는 코드가 있어요. 뜻이 가깝다고 정답은 아니에요.', 'IE는 문서에서 정해진 칸을 뽑는 도구예요. 코드를 실행하지 않아요.'] },
      { t: 'q', kind: 'mc', fig: 'q_scanSheet', q: '지난 학기 종이 학습지를 스캔한 PDF 20쪽이 있어요. 여기서 <b>번호·문항·정답</b>을 칸에 맞춰 뽑아 문제 은행을 만들려면?',
        opts: ['임베딩으로 비슷한 문항끼리 묶는다', 'Document Parse만 돌리면 번호·문항·정답 칸이 저절로 나뉜다', 'Information Extract에 스키마를 주고 칸대로 뽑는다', 'Solar에게 PDF 파일 이름만 알려 주고 정리해 달라고 한다'], a: 2,
        why: '파일에서 <b>정해진 칸</b>을 뽑는 게 IE의 일이에요(c2u2). 스키마에 번호·문항·정답을 적어 주면 그 모양으로 돌려줘요.',
        ex: ['임베딩은 뜻이 가까운 것을 찾을 뿐, 칸을 채워 주지 않아요.', 'Parse는 문서를 제목·문단·표 같은 요소로 나눠 글로 바꿔요. 번호·정답 같은 내 칸은 IE나 구조화 출력이 채워요.', '', 'Solar는 파일 이름만으로 내용을 볼 수 없어요. 글로 바꾼 내용을 넣어야 해요.'] },
      { t: 'q', kind: 'blank', fig: 'q_helperChain', q: '질문 도우미(c3u1의 helper)가 준비하고 답하는 흐름이에요. 빈칸에 들어갈 부품은?', lang: 'plain', code: src(['수업자료 PDF', '→ Parse로 글로 바꾸기', '→ 조각 나누고 [[1]]', '→ 질문과 가까운 조각 찾기', '→ Solar가 답 쓰기']),
        opts: ['임베딩', 'IE 추출', '구조화 출력', '자동채점'], a: 0,
        why: '조각을 <b>임베딩</b>(뜻을 숫자 목록으로)해 두어야 질문과 뜻이 가까운 조각을 찾을 수 있어요. 찾은 조각을 넣고 Solar가 답을 써요.',
        ex: ['', 'IE는 정해진 칸을 뽑는 일이에요. 검색할 준비가 아니에요.', '구조화 출력은 답의 모양을 JSON으로 정하는 기능이에요. 찾기와는 달라요.', '자동채점은 학생 코드를 테스트하는 일이에요.'] },
      { t: 'q', kind: 'line', fig: 'q_caseMemo', q: '연수 사례 시연을 보며 적은 메모예요. <b>틀린 줄</b>을 눌러 보세요.', lang: 'plain', code: src(['자료 요약: Parse로 글 → Solar가 요약', '퀴즈 생성: Solar 구조화 출력', '질문 도우미: 임베딩이 답 글을 쓴다', '자동채점: 테스트는 파이썬 코드로', '서술형 피드백: 루브릭을 넣고 Solar']), a: 2,
        why: '임베딩은 뜻이 가까운 조각을 <b>찾을</b> 뿐, 글을 쓰지 않아요. 답 글은 찾은 조각을 받은 <b>Solar</b>가 써요.' },
      { t: 'sum', pts: ['AI 수업도구 = 수업 한 장면 + API 부품. 출발점은 부품이 아니라 막히는 장면.', '파일은 Parse·IE, 글은 Solar, 근거 찾기는 임베딩, 정답이 정해진 일은 파이썬 코드.', '모든 사례에 환각·대리 숙제·개인정보·비용(429)이 따라오니, 틀렸을 때 누가 알아챌지 함께 정한다.'] }
    ]},

    /* =================== L2 =================== */
    { id: 'L2', type: 'lesson', title: '4요소로 수업 도구 설계하기', sub: '학생활동·교사의 할·자료·평가', min: 9, steps: [
      { t: 'say', h: '도구가 아니라 수업을 설계해요', fig: 'canvas4', p: [
        '연수 1일차 16:00 「수업 도구의 4요소」는 도구를 네 칸으로 나눠 봐요. <b>학생활동, 교사의 할, 자료, 평가</b>예요. 앱이 잘 돌아가도 이 네 칸이 비어 있으면 수업이 되지 않아요.',
        '네 칸은 수업을 설계할 때 늘 묻는 질문과 같아요. 학생은 무엇을 하나, 교사는 무엇을 맡나, 도구는 무엇에 기대나, 배웠는지 어떻게 아나.'
      ], table: { head: ['요소', '묻는 질문', '반복문 질문 도우미라면'], rows: [
        ['<b>학생활동</b>', '학생이 도구로 무엇을 하나요?', '막히면 먼저 예측을 적고, 도우미에게 묻고, 근거 쪽을 찾아 확인해요'],
        ['<b>교사의 할</b>', '수업 전·중·후에 교사가 맡을 일은?', '자료·규칙 준비, 교실을 돌며 막힌 학생 살피기, 질문 기록 보기'],
        ['<b>자료</b>', '도구가 무엇에 기대어 답하나요?', '반복문 단원 학습지(개인정보 없음), 시스템 규칙'],
        ['<b>평가</b>', '목표에 닿았는지 어떻게 보나요?', '정리 시간 출구 카드 3문제, 질문 기록에서 오개념 찾기'] ] },
        tip: '여기 적은 4요소의 뜻은 교육학 상식 수준으로 풀어 쓴 거예요. 연수에서 나오는 정의와 맞춰 보세요.' },
      { t: 'say', h: '학생활동은 동사로, 학생이 먼저 생각하게', fig: 'verbs', p: [
        '학생활동은 학생이 도구로 <b>무엇을 하는지</b>를 동사로 적어요. "도우미를 쓴다"는 너무 넓어요. "예측을 적는다 → 묻는다 → 근거 쪽을 찾아 확인한다"처럼 쪼개요.',
        'AI가 답을 먼저 주면 학생은 생각할 틈이 없어요. <b>학생이 먼저 시도하고</b> 도구는 그다음에 오게 순서를 짜요. c4u2의 AI 튜터가 정답 대신 힌트를 단계로 주는 것도 같은 까닭이에요.',
        '혼자 쓰는 활동만 있는 건 아니에요. 짝과 도우미의 답을 비교해 틀린 곳을 찾는 활동은 AI 답을 의심하는 습관도 길러요.'
      ]},
      { t: 'say', h: '교사의 할은 수업 전·중·후로 나눠 적어요', fig: 'teacherTimes', p: [
        '<b>교사의 할</b>은 교사가 맡을 일이에요. 도구를 만들었다고 교사의 일이 줄지 않아요. 일의 모양이 바뀔 뿐이에요.',
        '<b>수업 전</b>: 자료 고르기, 시스템 규칙 쓰기, 직접 질문해 보기. <b>수업 중</b>: 교실을 돌며 막힌 학생 살피기, 엉뚱한 답이 보이면 멈추고 함께 짚기. <b>수업 후</b>: 기록을 보고 다음 시간 고치기.',
        '판단·관계·안전은 AI가 대신할 수 없어요. 교육청과 평가원이 낸 생성형 AI 활용 자료들도 최종 판단과 책임은 교사에게 있다고 적고 있어요.'
      ]},
      { t: 'say', h: '자료는 도구의 근거, 평가는 배움의 증거', fig: 'dataEval', p: [
        '<b>자료</b>는 도구가 기대는 근거예요. 수업자료(학습지·교과서 쪽), 시스템 규칙, 문제·정답·루브릭이 여기 들어가요. 학생 개인정보가 담긴 문서는 넣지 않아요.',
        '<b>평가</b>는 학생이 목표에 닿았는지 보는 방법이에요. 출구 카드, 자동채점 결과, 관찰, 질문 기록에서 찾은 오개념이 증거가 돼요.',
        '네 칸은 서로 맞물려야 해요. 목표가 "반복 횟수를 예측한다"인데 평가가 "코드를 외워 쓴다"면 어긋난 거예요. 그리고 AI가 매긴 점수나 문장을 그대로 성적에 쓰지 않아요.'
      ]},
      { t: 'try', lang: 'md', h: '4요소 캔버스를 채워 봐요', p: '내 수업 한 차시를 골라 칸을 채워 보세요. 다 쓰면 복사해 두었다가 미션에서 <code>plan.md</code>로 옮겨요.',
        src: src(['# 4요소 기획 캔버스', '', '- 도구 이름: (예: 반복문 질문 도우미)', '- 수업: (학년·단원·차시)', '- 막히는 장면: (누가·언제·무엇에서)', '', '## 학생활동 (동사로, 순서대로)', '1. ', '2. ', '', '## 교사의 할', '- 수업 전: ', '- 수업 중: ', '- 수업 후: ', '', '## 자료 (개인정보 없는 것만)', '- 수업자료: ', '- 시스템 규칙: ', '', '## 평가 (목표에 닿았나)', '- ']),
        note: '학생활동이 "답을 받는다"로 끝나면 다시 써 봐요. 학생이 먼저 하는 일이 하나는 있어야 해요.' },
      { t: 'q', kind: 'mc', fig: 'q_whichEl', q: '"학생이 도우미에게 묻기 전에, 반복문이 몇 번 돌지 예측을 학습지에 먼저 적는다"는 4요소 중 어디에 적을까요?',
        opts: ['교사의 할', '자료', '평가', '학생활동'], a: 3,
        why: '학생이 도구와 함께 <b>하는 일</b>이라 학생활동이에요. 묻기 전에 먼저 생각하게 하는 순서까지 적어 두면 좋아요.',
        ex: ['교사가 하는 일이 아니라 학생이 하는 일이에요.', '자료는 도구가 기대는 근거(학습지·규칙)예요. 예측을 적는 행동이 아니에요.', '예측이 맞았는지 보면 평가에 쓸 수 있지만, 이 문장은 활동 자체예요.', ''] },
      { t: 'q', kind: 'mc', fig: 'q_badVerb', q: '학생활동 칸을 가장 잘 쓴 것은?',
        opts: ['도우미를 수업에 활용한다', '스스로 코드를 고쳐 본 뒤, 막힌 줄을 도우미에게 묻고 짝과 답을 비교한다', 'AI와 함께 즐겁게 배우며 프로그래밍에 대한 흥미와 자신감을 높인다', '도우미가 보여 주는 정답 코드를 그대로 따라 친다'], a: 1,
        why: '학생이 무엇을 어떤 순서로 하는지 <b>동사로</b> 보이고, 학생이 먼저 시도해요. 교실에서 그대로 따라 할 수 있는 문장이에요.',
        ex: ['너무 넓어요. 학생이 무엇을 어떤 순서로 하는지 안 보여요.', '', '바람이지 활동이 아니에요. 학생이 실제로 하는 일이 안 보여요.', '동사는 있지만 생각은 AI가 하고 학생은 따라 치기만 해요.'] },
      { t: 'q', kind: 'blank', fig: 'q_canvasBlank', q: '반복문 퀴즈 도구의 캔버스예요. 빈칸에 들어갈 요소는?', lang: 'plain', code: src(['학생활동: 퀴즈를 풀고 틀린 것을 다시', '교사의 할: 만든 문제를 수업 전 검토', '[[1]]: 반복문 학습지, 출제 규칙', '평가: 다시 푼 문제의 정답률']),
        opts: ['자료', '학생활동', '평가', '교사의 할'], a: 0,
        why: '도구가 문제를 만들 때 <b>기대는 근거</b>(학습지)와 규칙이니 자료예요.',
        ex: ['', '학생활동은 이미 첫 줄에 있어요. 학습지는 학생의 행동이 아니라 도구가 쓰는 근거예요.', '평가는 마지막 줄에 있어요. 근거 자료와 다른 칸이에요.', '교사의 할은 둘째 줄에 있어요. 학습지 자체는 도구의 자료예요.'] },
      { t: 'q', kind: 'line', fig: 'q_canvasLine', q: '서술형 피드백 도구의 4요소 메모예요. <b>고쳐야 할 줄</b>을 눌러 보세요.', lang: 'plain', code: src(['학생활동: 설명 쓰기 → 피드백 → 고쳐 쓰기', '교사의 할: 루브릭 만들기, 피드백 훑기', '자료: 루브릭, 단원 핵심 개념 정리', '평가: Solar 점수를 그대로 수행평가로']), a: 3,
        why: 'AI가 매긴 점수는 참고일 뿐이에요. 고쳐 쓰기 전후를 교사가 루브릭으로 확인하고, 최종 판단은 교사가 해요.' },
      { t: 'sum', pts: ['4요소: 학생활동(학생이 무엇을), 교사의 할(전·중·후), 자료(도구의 근거), 평가(배움의 증거).', '학생활동은 동사로, 학생이 먼저 시도하게. 자료에는 학생 개인정보를 넣지 않는다.', '네 칸이 서로 맞물려야 하고, AI 점수·문장은 그대로 성적에 쓰지 않는다.'] }
    ]},

    /* =================== QA =================== */
    { id: 'QA', type: 'quiz', title: '헷갈림 퀴즈 ①', sub: '학생활동과 교사의 할, 자료와 평가, 도구와 수업', min: 3, steps: [
      { t: 'q', kind: 'mc', fig: 'qa_walk', q: '"도우미 대화 화면을 띄워 두고 교실을 돌며, 같은 질문을 세 번 한 학생에게 다가가 함께 코드를 본다." 4요소 중 어디일까요?',
        opts: ['학생활동. 문장에 학생이 나오니까', '교사의 할. 교사가 맡는 일이니까', '자료. 도우미 대화 화면에 기대어 하니까', '평가. 학생을 지켜보며 막힌 정도를 재니까'], a: 1,
        why: '학생이 나오는 문장이라도 <b>하는 사람</b>이 교사면 교사의 할이에요. 수업 중 살피고 다가가는 건 AI가 대신 못 하는 교사의 일이에요.',
        ex: ['문장의 주어를 봐요. 다가가는 사람은 교사예요.', '', '화면은 교사가 보는 도구일 뿐, 도구가 기대는 근거(자료)가 아니에요.', '관찰이 평가의 증거가 될 수는 있지만, 이 문장은 교사가 다가가 돕는 일이에요.'] },
      { t: 'q', kind: 'mc', fig: 'qa_pdfCard', q: '(가) 도우미가 답할 때 근거로 삼는 반복문 학습지 PDF, (나) 수업 끝에 푸는 출구 카드 3문제. 바르게 짝지은 것은?',
        opts: ['(가) 평가, (나) 자료', '(가) 자료, (나) 학생활동', '(가) 자료, (나) 평가', '(가) 평가, (나) 평가'], a: 2,
        why: '(가)는 도구가 기대는 <b>근거</b>라 자료, (나)는 목표에 닿았는지 보는 <b>증거</b>라 평가예요. 학습지 안에 문제가 있어도, 도구가 근거로 쓰면 자료예요.',
        ex: ['거꾸로예요. 학습지는 도구의 근거, 출구 카드는 배움을 확인하는 방법이에요.', '출구 카드를 푸는 것도 활동이지만, 목적이 배웠는지 확인하는 것이라 평가 칸에 적어요.', '', '학습지 PDF는 도우미가 읽는 근거예요. 학생을 평가하려고 쓰는 게 아니에요.'] },
      { t: 'q', kind: 'mc', fig: 'qa_toolLesson', q: '질문 도우미 앱이 어떤 질문에도 잘 답해요. 그런데도 "수업 준비가 끝났다"고 하기 어려운 까닭은?',
        opts: ['쓰는 순서·교사의 할·평가가 아직 정해지지 않았다', '앱이 잘 돌면 학생이 알아서 쓰니 수업은 저절로 된다', '앱 화면을 더 예쁘게 꾸며야 학생이 수업에 집중한다', '모델을 더 비싼 것으로 바꿔야 수업에 쓸 만해진다'], a: 0,
        why: '도구는 수업의 <b>한 부품</b>이에요. 학생이 언제 어떤 순서로 쓰는지, 그동안 교사는 무엇을 하는지, 배웠는지 어떻게 보는지가 정해져야 수업이 돼요.',
        ex: ['', '잘 돌아가는 앱도 쓰는 순서와 평가가 없으면 "답 받아 적기"로 끝나기 쉬워요.', '화면보다 활동 설계가 먼저예요. 제작 절차에서도 화면은 뒤쪽 단계예요.', '모델을 바꿔도 수업 설계는 생기지 않아요.'] }
    ]},

    /* =================== L3 =================== */
    { id: 'L3', type: 'lesson', title: '제작 절차: 작게 만들고 시범하기', sub: '문제 정의부터 고치기까지, 에이전트 코딩으로 빠르게', min: 9, steps: [
      { t: 'say', h: '여섯 단계로 만들어요', fig: 'sixSteps', table: { head: ['단계', '하는 일', '끝났다는 신호'], rows: [
        ['1. 문제 정의', '수업에서 막히는 장면을 한 문장으로', '누가·언제·무엇이 문장에 다 있다'],
        ['2. 4요소 설계', '레슨 2의 캔버스 채우기', '네 칸이 서로 맞물린다'],
        ['3. 작은 시제품', '터미널에서 도는 helper로 답의 질 보기', '시험 질문 10개에 쓸 만한 답'],
        ['4. 화면', 'Streamlit으로 학생이 쓸 화면 붙이기', '브라우저에서 대화가 쌓인다'],
        ['5. 시범', '동료 교사에게 학생 역할로 써 보게 하기', '피드백이 기록으로 남았다'],
        ['6. 고치기', '피드백을 하나씩 고치고 다시 시범', '고친 점이 커밋으로 남았다'] ] }, p: [
        '연수 1일차 11:00에 보는 제작 절차도 이런 흐름이에요. 단계 이름과 개수는 연수 자료와 다를 수 있으니, 연수에서 나온 단계를 옆에 나란히 적어 비교해 봐요.',
        '핵심은 <b>화면이 뒤쪽</b>이라는 거예요. 답이 엉망이면 화면이 예뻐도 쓸 수 없어요.'
      ]},
      { t: 'say', h: '문제 정의: "무엇을 만들까"보다 "어디서 막히나"', fig: 'problemLine', p: [
        '좋은 문제 정의에는 <b>누가, 언제, 무엇에서 막히는지</b>가 한 문장에 다 있어요. "AI 챗봇을 만들고 싶다"는 문제가 아니라 해결책이에요.',
        '예: "2학년 정보 반복문 실습 시간에 손 드는 학생이 열 명이 넘어, 내가 다 돌아보기 전에 몇몇은 손을 내려 버린다." 이 문장에서 도구가 할 일(기다리는 동안 첫 힌트)이 보여요.',
        '문제가 분명하면 <b>만들지 않는 결정</b>도 할 수 있어요. 학습지 한 장이나 짝 활동으로 풀리는 문제라면 그게 더 좋은 답이에요.'
      ]},
      { t: 'say', h: '화면보다 먼저, 터미널에서 작게', fig: 'termFirst', p: [
        'c3u1의 <code>helper.py</code>가 바로 작은 시제품이에요. 화면 없이 터미널에서 질문 10개를 넣어 보고, 답이 쓸 만한지, 출처가 맞는지, 자료 밖 질문에 "모른다"고 하는지 봐요.',
        '고칠 곳(조각 크기, 시스템 규칙, top-k)은 여기서 먼저 고쳐 둬요. 화면을 붙인 뒤에 고치면 살펴볼 곳이 두 배가 돼요.',
        '시제품 단계부터 <b>비용</b>도 어림해요. 질문 하나에 입력·출력 토큰이 얼마나 드는지 <code>usage</code>를 찍어 보면 한 반 한 차시 비용이 보여요(레슨 5).'
      ]},
      { t: 'say', h: '에이전트 코딩으로 빠르게: Plan → 작게 → 확인', fig: 'planSmall', p: [
        '커서한입에서 배운 흐름 그대로예요. <b>Plan</b> 모드로 계획을 먼저 받고, 계획에서 <b>한 단계만</b> 맡기고, 결과를 <b>직접 실행</b>해 확인해요. 확인이 끝나면 Git 커밋.',
        '부탁에는 맥락(helper.py가 이미 있다), 조건(키는 <code>.env</code>, 모델은 <code>solar-pro4</code>, 새 패키지는 하나만), 확인 방법(무엇이 보이면 성공)을 넣어요. c1u3에서 만든 <code>AGENTS.md</code> 규칙도 에이전트가 함께 읽어요.',
        '에이전트가 인터넷의 옛 예제를 베껴 <code>solar-pro3</code>나 옛 주소를 쓰면 그 자리에서 고치게 해요. <code>solar-pro3</code>는 2026-10-30에 서비스가 끝나요.'
      ]},
      { t: 'say', h: '시범은 학생 역할로, 기록을 남기며', fig: 'pilot', p: [
        '만든 사람은 자기 도구의 빈틈을 잘 못 봐요. 동료 교사에게 <b>학생 역할</b>을 부탁해요. 엉뚱한 질문, "답만 줘" 같은 질문, 아주 쉬운 질문을 섞어 달라고 해요.',
        '시범 중에는 끼어들지 말고 지켜보며 적어요. 어디서 멈칫했는지, 어떤 답에 고개를 갸웃했는지가 다음 고치기 목록이에요.',
        '고치기는 <b>한 번에 하나씩</b>. 고치고, 같은 질문으로 다시 시험하고, 커밋해요.'
      ]},
      { t: 'sim', h: 'Plan으로 app.py 계획부터 받아 봐요', p: 'Plan 모드에서 app.py 계획을 부탁하고, 계획을 읽은 뒤 Build로 맡겨 봐요. 바뀐 파일도 열어 봐요.',
        scene: { win: 'agents', folder: 'upstage-lab', agents: [{ title: '정보 수업 도우미 화면', on: true }, { title: 'helper 출처 표시' }], panel: { mode: 'Plan', model: 'Auto', msgs: [], input: '' } },
        steps: [
          { goal: '부탁을 적어요', type: PLAN_Q, into: 'chat',
            say: '맥락(helper.py), 조건(.env, 패키지 하나), 멈출 곳(코드는 아직)을 함께 적었어요.' },
          { goal: '보내요', click: 'btn:send', then: { panel: { mode: 'Plan', model: 'Auto', msgs: [{ me: PLAN_Q }, { ai: PLAN_A, btns: ['Build'] }], input: '' } },
            say: '계획에 단계와 확인 방법이 다 있어요. "키·모델 이름은 손대지 않음" 줄도 꼭 확인해요.' },
          { goal: '계획이 괜찮으니 Build를 눌러요', click: 'msg:Build', then: { panel: { mode: 'Agent', model: 'Auto', msgs: [{ me: PLAN_Q }, { ai: PLAN_A }, { ai: BUILT }], input: '' }, changes: [{ file: 'app.py', add: 18, del: 0 }] },
            say: '오른쪽 Changes에 <code>app.py</code> 하나만 생겼어요. 부탁한 범위 그대로예요.' },
          { goal: '바뀐 파일 app.py를 눌러 봐요', click: 'file:app.py',
            say: '키가 코드에 직접 적히지 않았는지, 모델 이름이 helper 밖으로 새지 않았는지 봐요. 실행은 레슨 4에서 직접 해요.' } ],
        end: 'Plan으로 받고, 작게 Build하고, 직접 확인해요. 확인한 것만 커밋해요.' },
      { t: 'q', kind: 'mc', fig: 'q_probDef', q: '문제 정의로 가장 알맞은 문장은?',
        opts: ['Solar로 학생들이 좋아할 멋진 챗봇을 하나 만들어 보고 싶다', '요즘 AI가 대세니 정보 수업에도 AI 도구를 꼭 넣어야 한다', '1학년 조건문 수행평가 전, 서술형을 고쳐 볼 기회가 없다', '학생들이 AI를 좋아하니 과제는 무엇이든 AI로 하게 한다'], a: 2,
        why: '<b>누가</b>(1학년), <b>언제</b>(조건문 수행평가 전), <b>무엇에서</b>(서술형을 고쳐 볼 기회가 없음) 막히는지가 다 있어요. 여기서 "피드백 도구"라는 할 일이 나와요.',
        ex: ['해결책(챗봇)이 먼저 나왔어요. 어떤 수업 장면이 막히는지가 없어요.', '흐름일 뿐 수업에서 막히는 장면이 없어요.', '', '대상과 장면이 없고, 도구가 무엇을 도울지 알 수 없어요.'] },
      { t: 'q', kind: 'order', fig: 'q_agentOrder', q: 'Cursor 에이전트에게 app.py를 맡기는 한 고리를 순서대로 쌓아 보세요.',
        items: ['Plan 모드로 계획만 먼저 받는다', '계획을 읽고 첫 단계만 Build로 맡긴다', 'streamlit run app.py로 직접 실행해 확인한다', '잘 되면 Git 커밋하고 다음 단계로 간다'],
        why: '계획이 있어야 맡길 단계를 고르고, 만들어야 확인할 수 있고, 확인한 것만 커밋해요. 이 고리를 단계마다 되풀이해요.' },
      { t: 'q', kind: 'mc', fig: 'q_screenFirst', q: '시제품 없이 Streamlit 화면부터 만들었더니 답이 자주 엉뚱해요. 무엇이 잘못됐을까요?',
        opts: ['화면을 먼저 만들면 Solar가 화면 모양을 보고 헷갈린다', 'Streamlit은 화면 도구라 RAG 검색 결과를 넘겨받지 못해서다', '화면은 늘 마지막 단계라, 지우고 처음부터 다시 만들어야 한다', '답은 helper가 만드니 터미널에서 먼저 다듬었어야 한다'], a: 3,
        why: '답은 helper(검색·프롬프트·Solar)가 만들어요. 터미널 시제품에서 질문 10개로 답을 먼저 다듬어야, 화면을 붙인 뒤 고칠 곳이 한곳으로 줄어요.',
        ex: ['Solar는 화면을 보지 않아요. 받은 메시지 글만 봐요.', 'Streamlit은 화면일 뿐, 뒤에서 helper의 RAG를 그대로 부를 수 있어요.', '지울 필요 없어요. 화면은 두고 helper를 터미널에서 따로 시험해 고치면 돼요.', ''] },
      { t: 'sum', pts: ['제작 절차: 문제 정의 → 4요소 설계 → 터미널 시제품 → 화면 → 시범 → 고치기. 화면은 뒤쪽.', '문제 정의는 누가·언제·무엇에서 막히나. 해결책(챗봇)부터 말하지 않는다.', '에이전트 코딩은 Plan → 한 단계 Build → 직접 실행 확인 → 커밋을 되풀이. 시범은 학생 역할로, 고치기는 하나씩.'] }
    ]},

    /* =================== L4 =================== */
    { id: 'L4', type: 'lesson', title: 'Streamlit으로 학생 화면 만들기', sub: 'st.chat_input·st.chat_message·st.session_state, 키는 서버 쪽에만', min: 18, steps: [
      { t: 'say', h: 'Streamlit: 파이썬 파일 하나로 웹 화면을', fig: 'pyToWeb', p: [
        '<b>Streamlit</b>은 파이썬 코드만으로 웹 화면을 만드는 도구예요. HTML·CSS·JavaScript를 따로 쓰지 않아도 입력칸, 버튼, 채팅 화면이 생겨요. 설치는 <code>pip install streamlit</code>.',
        '채팅에 쓰는 것은 셋이에요. <code>st.chat_input</code>은 아래쪽 입력칸, <code>st.chat_message</code>는 말풍선 하나, <code>st.session_state</code>는 대화 기록을 담아 두는 상자예요.',
        '학생은 브라우저로 이 화면에 들어와요. <code>helper.py</code>와 키는 교사 컴퓨터에 그대로 있어요. 이 구조가 이 레슨의 핵심이에요.'
      ]},
      { t: 'say', h: '보낼 때마다 파일이 맨 위부터 다시 돌아요', fig: 'rerun', code: { lang: 'py', src: src([
        'import streamlit as st',
        'from helper import ask  # c3u1의 답 함수',
        '',
        'st.title("정보 수업 도우미")',
        'if "msgs" not in st.session_state:',
        '    st.session_state.msgs = []',
        'for m in st.session_state.msgs:',
        '    with st.chat_message(m["role"]):',
        '        st.markdown(m["content"])']) }, p: [
        'Streamlit은 학생이 질문을 보낼 때마다 <code>app.py</code>를 <b>맨 위부터 끝까지 다시</b> 실행해요. 그래서 그냥 변수 <code>msgs = []</code>에 담으면 돌 때마다 빈 목록이 돼요.',
        '<code>st.session_state</code>는 다시 돌아도 남아 있는 상자예요. 처음 한 번만 빈 목록을 만들고(<code>if ... not in</code>), 그 뒤로는 거기에 쌓아요. 쌓인 기록은 <code>for</code>로 말풍선을 다시 그려요.',
        '<code>helper</code>의 함수 이름은 c3u1에서 만든 것에 맞춰요. 여기서는 <code>ask(질문)</code>이 답 글을 돌려준다고 할게요.'
      ]},
      { t: 'try', lang: 'py', h: '다시 도는 앱을 흉내 내 봐요', p: '함수 <code>run_app</code>을 앱이 한 번 도는 것이라고 생각해요. 그냥 변수와 <code>state</code>(session_state 흉내)에 쌓인 개수를 비교해 보세요.',
        src: src(['state = {}  # st.session_state 흉내', '', 'def run_app(q):  # 보낼 때마다 다시', '    msgs = []  # 그냥 변수', '    if "msgs" not in state:', '        state["msgs"] = []', '    if q:', '        msgs.append(q)', '        state["msgs"].append(q)', '    print("변수", len(msgs), "/ state", len(state["msgs"]))', '', 'for q in [None, "for문이 뭐예요?", "예시도요"]:', '    run_app(q)']),
        note: '그냥 변수는 늘 0이나 1, state는 1, 2로 쌓여요. 진짜 Streamlit도 똑같이 움직여요.' },
      { t: 'say', h: '입력을 받아 답하고, 기록에 쌓아요', code: { lang: 'py', src: src([
        'def say(role, text):  # 보여 주고 쌓기',
        '    st.chat_message(role).markdown(text)',
        '    st.session_state.msgs.append(',
        '        {"role": role, "content": text})',
        '',
        'if q := st.chat_input("질문을 적어요"):',
        '    say("user", q)',
        '    say("assistant", ask(q))']) }, p: [
        '<code>st.chat_input</code>은 학생이 보내기 전에는 <code>None</code>, 보내면 그 글을 돌려줘요. <code>if q := ...</code>는 "받은 값이 있으면 q에 담고 실행"이라는 한 줄 문법이라, 보냈을 때만 답을 만들어요.',
        '<code>say</code> 함수는 말풍선을 그리고 기록에도 쌓아요. 다음에 다시 돌 때 위쪽 <code>for</code>가 쌓인 기록을 다시 그려 줘서 대화가 이어져 보여요.',
        '후속 질문("그럼 1부터 5까지는요?")을 알아듣게 하려면 질문만이 아니라 기록을 helper에 넘겨야 해요. c3u1 레슨 4의 후속 질문 다루기를 여기에 이어 붙이면 돼요.'
      ]},
      { t: 'say', h: '키는 교사 컴퓨터의 .env에만 있어요', fig: 'keyPath', code: { lang: 'py', src: src([
        '# helper.py (교사 컴퓨터에만 있어요)',
        'load_dotenv()  # .env에서 키를 읽어요',
        'KEY = os.environ["UPSTAGE_API_KEY"]',
        'URL = "https://api.upstage.ai/v1"',
        'client = OpenAI(',
        '    api_key=KEY, base_url=URL)',
        'MODEL = "solar-pro4"']) }, p: [
        'Streamlit 앱의 파이썬 코드는 <b>교사 컴퓨터(서버)</b>에서 돌아요. 학생 브라우저로 가는 건 화면과 글뿐이에요. 그래서 키는 교사 컴퓨터의 <code>.env</code>에만 있으면 되고, 학생에게 나눠 줄 일이 없어요.',
        '단, 내가 화면에 찍으면 그대로 학생에게 가요. 키를 <code>st.write</code>로 출력하는 줄, 오류 메시지에 키를 담는 줄은 쓰지 않아요.',
        'c1u1에서 "학생에게 내 키를 나눠 주지 않는다"고 했던 약속을 이 구조가 지켜 줘요. 반대로 학생 PC마다 <code>app.py</code>와 키를 복사해 돌리게 하면 키가 서른 곳으로 퍼져요.'
      ]},
      { t: 'say', h: 'streamlit run으로 켜고, 주소 두 개를 읽어요', fig: 'twoUrls', p: [
        '앱은 <code>python app.py</code>가 아니라 <code>streamlit run app.py</code>로 켜요. 그러면 웹 서버가 뜨고 기본 주소 <code>localhost:8501</code>이 열려요.',
        '터미널에 주소가 둘 나와요. <b>Local URL</b>은 이 컴퓨터에서, <b>Network URL</b>은 같은 네트워크의 다른 기기(학생 PC·휴대폰)에서 여는 주소예요. 학생 PC에서 <code>localhost</code>를 치면 학생 자기 컴퓨터를 찾아요.',
        '<code>app.py</code>를 고쳐 저장하면 브라우저에서 다시 실행할 수 있어요. 끌 때는 터미널에서 <kbd>ctrl+c</kbd>예요.'
      ], tip: '처음 한 번은 터미널이 이메일 주소를 물을 수 있어요. 비워 두고 <kbd>enter</kbd>를 누르면 넘어가요. 연수장에서 "멈췄어요"의 흔한 까닭이에요.' },
      { t: 'sim', h: '터미널에서 앱을 켜 봐요', p: '아래 터미널에 먼저 늘 하던 대로 <code>python app.py</code>를 쳐 보고, 다음엔 <code>streamlit run app.py</code>로 켜 보세요.',
        scene: { win: 'ide', folder: 'upstage-lab', files: LAB_FILES, open: 'app.py', lang: 'py', code: APP_SRC, term: [], prompt: '' },
        steps: [
          { goal: '<code>python app.py</code>를 쳐 봐요', type: 'python app.py', into: 'term',
            then: { term: ['$ python app.py', 'Warning: to view this Streamlit app on a', 'browser, run it with the following command:', '', '    streamlit run app.py [ARGUMENTS]'], prompt: '' },
            say: '경고만 나오고 화면은 안 떠요. <code>python</code>은 코드를 한 번 돌리고 끝나요.' },
          { goal: '<code>streamlit run app.py</code>로 켜요', type: 'streamlit run app.py', into: 'term',
            then: { term: ['$ streamlit run app.py', '', '  You can now view your Streamlit app in your browser.', '', '  Local URL: http://localhost:8501', '  Network URL: http://192.168.0.12:8501'], prompt: '' },
            say: '웹 서버가 떴어요. Local URL은 이 컴퓨터, Network URL은 같은 네트워크의 다른 기기용 주소예요.' } ],
        end: '앱은 <code>streamlit run</code>으로 켜고, 끌 때는 <kbd>ctrl+c</kbd>예요.' },
      { t: 'sim', h: '학생 화면에서 써 봐요', p: '브라우저에 뜬 학생 화면이에요. 반복문 질문 두 개와 수업과 상관없는 질문 하나를 보내 보세요.',
        scene: { win: 'web', url: 'localhost:8501', title: '정보 수업 도우미', blocks: chatBlocks([]) },
        steps: [
          { goal: '첫 질문을 적어요', type: Q1, into: 'chat',
            say: '학생 화면에는 키도 코드도 없어요. 제목, 말풍선, 입력칸뿐이에요.' },
          { goal: '보내요', click: 'btn:send', then: { blocks: chatBlocks([{ me: Q1 }, { ai: A1 }]) },
            say: '답에 근거 쪽이 붙었어요. 학생은 학습지 2쪽을 펴서 확인해요. 이게 학생활동이에요.' },
          { goal: '두 번째 질문을 적어요', type: Q2, into: 'chat',
            say: '앞 대화가 위에 그대로 있어요.' },
          { goal: '보내요', click: 'btn:send', then: { blocks: chatBlocks([{ me: Q1 }, { ai: A1 }, { me: Q2 }, { ai: A2 }]) },
            say: '보낼 때마다 <code>app.py</code>가 다시 돌아도, 기록은 <code>st.session_state</code>에 남아 있어요.' },
          { goal: '수업과 상관없는 질문을 적어요', type: Q3, into: 'chat',
            say: '자료 밖 질문이에요. 어떻게 답하는지 봐요.' },
          { goal: '보내요', click: 'btn:send', then: { blocks: chatBlocks([{ me: Q1 }, { ai: A1 }, { me: Q2 }, { ai: A2 }, { me: Q3 }, { ai: A3 }]) },
            say: 'c3u1에서 넣은 "자료에 없으면 모른다고" 규칙이 화면에서도 그대로 지켜져요.' } ],
        end: '학생은 이 화면만 봐요. 키와 helper.py는 선생님 컴퓨터에 있어요.' },
      { t: 'q', kind: 'mc', fig: 'q_forgetful', q: '<code>msgs = []</code>를 그냥 변수로 두고 대화를 쌓았더니, 질문할 때마다 앞 대화가 사라져요. 왜일까요?',
        opts: ['API는 대화를 기억하지 않으니 Solar가 앞 대화를 잊어서다', '보낼 때마다 app.py가 다시 돌며 msgs가 새로 비워져서다', '학생 브라우저에 방문 기록을 지우는 설정이 켜져 있어서다', '<code>st.chat_message</code>는 말풍선을 하나만 그릴 수 있어서다'], a: 1,
        why: 'Streamlit은 보낼 때마다 파일을 맨 위부터 다시 실행해요. 그냥 변수는 그때마다 새로 만들어지니, 다시 돌아도 남는 <code>st.session_state</code>에 담아야 해요.',
        ex: ['API가 기억하지 않는 건 맞지만, 지금은 화면 기록이 사라지는 문제예요. 기록은 내 코드가 담아야 하고, 그 그릇이 session_state예요.', '', '브라우저 설정 문제가 아니에요. 서버에서 코드가 다시 돌며 변수가 새로 만들어져요.', '말풍선은 몇 개든 그릴 수 있어요.'] },
      { t: 'q', kind: 'line', fig: 'q_keyLine', q: 'app.py의 앞부분이에요. 학생 화면으로 <b>키가 새어 나가는 줄</b>을 눌러 보세요.', lang: 'py', code: src(['import os', 'import streamlit as st', 'from helper import ask', '', 'st.title("정보 수업 도우미")', 'st.caption("반복문 자료로 답해요")', 'st.write(os.environ["UPSTAGE_API_KEY"])', 'q = st.chat_input("질문을 적어요")']), a: 6,
        why: '<code>st.write</code>로 찍은 것은 학생 브라우저 화면으로 그대로 가요. 키는 helper가 <code>.env</code>에서 읽어 쓰기만 하고 어디에도 찍지 않아요. 이 줄을 지우고, 이미 학생 화면에 떴다면 콘솔에서 그 키를 지우고 새로 만들어요.' },
      { t: 'q', kind: 'blank', fig: 'q_stateBlank', q: '학생이 질문을 적는 칸을 만드는 줄이에요. 빈칸에 들어갈 함수는?', lang: 'py', code: src(['if "msgs" not in st.session_state:', '    st.session_state.msgs = []', 'q = st.[[1]]("질문을 적어요")']),
        opts: ['chat_message', 'session_state', 'chat_input', 'title'], a: 2,
        why: '<code>st.chat_input</code>이 화면 아래 입력칸을 만들고, 학생이 보내면 그 글을 돌려줘요. 보내기 전에는 <code>None</code>이에요.',
        ex: ['<code>st.chat_message</code>는 말풍선 하나를 그리는 그릇이에요. 입력칸이 아니에요.', '<code>st.session_state</code>는 기록을 담는 상자예요. 함수처럼 부르지 않아요.', '', '<code>st.title</code>은 맨 위 제목 글자예요.'] },
      { t: 'q', kind: 'mc', fig: 'q_devtools', q: '정보 동아리 학생이 "브라우저 개발자 도구를 열면 선생님 API 키가 보이죠?"라고 물어요. 키를 어디에도 찍지 않는 이 앱에 대해 맞는 답은?',
        opts: ['아니요. 키는 교사 컴퓨터에서만 쓰이고, 브라우저로는 화면과 글만 가요', '네. Streamlit은 환경 변수도 브라우저로 보내요', '네. 학생이 받은 Network URL 주소 끝에 키가 붙어 있어요', '아니요. 다만 그건 키가 너무 길어 브라우저가 받지 못해서예요'], a: 0,
        why: '파이썬 코드와 <code>.env</code>는 교사 컴퓨터에서만 쓰여요. 브라우저가 받는 건 화면에 그린 것뿐이에요. 그래서 화면에 키를 찍거나 오류 메시지에 담지 않는 게 중요해요(앞 문제).',
        ex: ['', 'Streamlit은 화면에 그린 것만 보내요. 환경 변수를 통째로 보내지 않아요.', 'Network URL은 교사 컴퓨터 주소와 포트 번호(8501)일 뿐이에요.', '길이와 상관없어요. 애초에 브라우저로 보내지 않기 때문이에요.'] },
      { t: 'sum', pts: ['Streamlit 채팅: <code>st.chat_input</code>(입력칸), <code>st.chat_message</code>(말풍선), <code>st.session_state</code>(다시 돌아도 남는 기록).', '보낼 때마다 app.py가 맨 위부터 다시 돈다. 켜기는 <code>streamlit run app.py</code>, 학생은 Network URL로 들어온다.', '코드와 키는 교사 컴퓨터(서버)에만, 학생 브라우저엔 화면과 글만. 키를 화면에 찍지 않는다.'] }
    ]},

    /* =================== QB =================== */
    { id: 'QB', type: 'quiz', title: '헷갈림 퀴즈 ②', sub: 'session_state, streamlit run과 python, 학생 화면과 교사 화면', min: 3, steps: [
      { t: 'q', kind: 'mc', fig: 'qb_refresh', q: '수업 중 한 학생이 새로고침을 눌렀더니 대화가 다 사라졌어요. 알맞은 설명은?',
        opts: ['session_state는 반 전체가 하나를 함께 쓰니, 다른 학생이 지운 것이다', 'API 키의 유효 시간이 끝나 대화가 지워진 것이다', 'helper.py가 대화를 파일에 저장하다 실패한 것이다', '새로고침은 새 접속이라 session_state가 빈 채로 시작한다'], a: 3,
        why: '<code>st.session_state</code>는 브라우저 접속(세션)마다 따로 있어서, 학생끼리 대화가 섞이지 않아요. 대신 새로고침하면 새 접속이라 기록이 비어요. 수업 기록을 남기려면 파일 같은 곳에 따로 저장해요(레슨 5).',
        ex: ['학생마다 따로예요. 그래서 다른 학생의 대화가 내 화면에 보이지 않아요.', '키에는 그런 유효 시간이 없어요. 대화 기록은 화면 쪽 문제예요.', '지금 코드는 파일에 저장하지 않아요. 기록은 session_state에만 있었어요.', ''] },
      { t: 'q', kind: 'mc', fig: 'qb_runCmd', q: '연수 실습에서 <code>python app.py</code>를 쳤더니 경고 몇 줄만 나오고 브라우저 화면이 안 떠요. 어떻게 할까요?',
        opts: ['<code>python3 app.py</code>로 숫자만 붙여 다시 친다', '<code>streamlit run app.py</code>로 다시 켠다', '<code>pip install streamlit</code>을 한 번 더 한다', 'app.py 맨 아래에 <code>input()</code>을 넣어 창이 닫히지 않게 한다'], a: 1,
        why: 'Streamlit 앱은 <code>streamlit run</code>이 웹 서버를 띄우고 그 안에서 파일을 돌려요. <code>python</code>으로 돌리면 코드만 한 번 돌고 화면은 뜨지 않아요.',
        ex: ['python3도 같은 파이썬이에요. 웹 서버를 띄우지 않는 건 똑같아요.', '', '설치는 이미 됐어요. Streamlit의 경고가 나왔다는 건 깔려 있다는 뜻이에요.', '창이 닫히는 문제가 아니라 웹 서버가 없는 문제예요.'] },
      { t: 'q', kind: 'mc', fig: 'qb_teacherView', q: '학생 화면 맨 아래에 "오늘 우리 반 질문 전체 목록" 표를 붙이면 교사가 보기 편하겠다고 생각했어요. 문제는?',
        opts: ['문제없다. 서로의 질문을 보면 반 전체가 함께 배울 수 있다', 'Streamlit은 한 화면에 표와 채팅을 함께 둘 수 없다', '모든 학생에게 남의 질문이 보인다. 교사용은 따로 둔다', '표를 붙이면 Solar를 부르는 비용이 두 배가 된다'], a: 2,
        why: '학생 화면은 학생 한 사람의 대화만, 교사 화면(또는 교사만 여는 기록 파일)은 반 전체를 봐요. 질문에는 남에게 보이기 싫은 내용이 섞일 수 있으니 나눠 둬요. 함께 보고 싶다면 교사가 골라 이름 없이 보여 줘요.',
        ex: ['질문에는 학생이 남에게 보이기 싫은 내용이 섞일 수 있어요. 공유는 교사가 골라서 해요.', '둘 다 한 화면에 둘 수 있어요. 문제는 누가 무엇을 보느냐예요.', '', '표를 보여 주는 건 Solar를 부르지 않아요. 비용과 상관없어요.'] }
    ]},

    /* =================== L5 =================== */
    { id: 'L5', type: 'lesson', title: '수업에 넣기', sub: '도입·전개·정리 배치, 기록과 평가, 학교에서 확인할 것', min: 12, steps: [
      { t: 'say', h: '도입·전개·정리 중 한 곳에 넣어요', fig: 'lessonFlow', table: { head: ['어디에', '이렇게 쓰면', '주의'], rows: [
        ['<b>도입</b>(5분)', '지난 시간 퀴즈 3문제를 도구가 내고, 학생이 풀어요', '교사가 먼저 문제를 확인해요'],
        ['<b>전개</b>(실습 중)', '스스로 정해진 시간 시도한 뒤, 막히면 도우미에게 물어요', '바로 묻게 하면 생각할 틈이 없어요'],
        ['<b>정리</b>(10분)', '배운 것을 자기 말로 쓰고 피드백을 받아 고쳐 써요', '피드백은 참고, 확인은 교사가 해요'] ] }, p: [
        '한 차시에 도구를 여기저기 다 쓰지 않아요. 4요소 캔버스의 학생활동이 가장 잘 맞는 <b>한 장면</b>에 넣어요.',
        '처음 쓰는 날은 5분쯤 교사 시연으로 사용법과 규칙("먼저 스스로", "답만 달라고 하지 않기", "이름 쓰지 않기")을 알려 줘요.'
      ]},
      { t: 'say', h: '기록을 남겨야 다음 수업이 좋아져요', fig: 'logFile', p: [
        '<code>st.session_state</code>는 새로고침하면 사라지니, 기록은 따로 파일(예: <code>log.csv</code>)에 남겨요. 시간, 질문, 답이 "모른다"였는지 정도면 충분해요. 이름·학번은 받지 않고, 필요하면 자리 번호만 써요.',
        '수업이 끝나면 기록을 훑어봐요. 같은 질문이 몰린 곳은 설명이 부족했던 곳, "모른다"가 많은 곳은 자료가 빈 곳이에요. 이게 4요소의 <b>평가</b>와 <b>교사의 할</b>을 잇는 고리예요.',
        'AI가 쓴 문장이나 점수를 성적·학생부에 그대로 옮기지 않아요. 2026학년도 학생부 기재요령에도 AI로 만든 문장을 그대로 옮겨 적지 말라는 내용이 있다고 알려졌으니, 정확한 문구는 학교 지침에서 확인해요.'
      ]},
      { t: 'say', h: '교실에서 돌리기 전에 확인할 것', fig: 'checkList', table: { head: ['확인할 것', '왜'], rows: [
        ['<b>네트워크</b>: 학생 기기에서 Network URL이 열리나', '학교망은 기기끼리 접속을 막거나, 교사망·학생망이 나뉘어 있을 수 있어요'],
        ['<b>기기</b>: 교사 컴퓨터가 수업 내내 켜져 있나', '교사 컴퓨터가 곧 서버예요. 덮개를 닫거나 잠들면 앱도 멈춰요'],
        ['<b>동시 요청</b>: 한 키로 반 전체가 부르나', '분당 요청·토큰 수 제한을 넘으면 <code>429</code>가 나요. 등급마다 달라 콘솔에서 확인해요'],
        ['<b>비용</b>: 한 차시에 얼마나', '아래 연습장으로 어림하고, 실제는 콘솔 Billing의 Usage에서 봐요'],
        ['<b>지침</b>: 학교·교육청의 생성형 AI 지침', '학교급·나이에 따라 학생이 직접 써도 되는지가 다를 수 있어요'] ] }, p: [
        '연수장에서 잘 되던 앱이 학교에서 안 열리는 일이 흔해요. 수업 전날 학생 기기 한 대로 미리 접속해 봐요.',
        '<code>429</code>가 나면 잠시 기다렸다 다시 보내게(c1u3의 지수 백오프) 하고, 활동 순서를 나눠 한꺼번에 몰리지 않게 해요.'
      ]},
      { t: 'say', h: '학교 절차: 학습지원 소프트웨어 선정 기준', fig: 'schoolSteps', p: [
        '교육부는 2025년 12월 「학습지원 소프트웨어 선정 기준」을 안내했고, 2026학년도 1학기부터 적용하고 있어요. 학생 개인정보를 처리하거나 교과 성취기준과 관련된 콘텐츠를 주는 소프트웨어가 대상이에요.',
        '대상이면 교원 의견 수렴 → 기준 충족 확인(개인정보 최소 수집, 아동 개인정보 보호 절차 같은 필수기준) → 학교운영위원회 심의 → 학교장 확정 순서를 거쳐요.',
        '<b>교사가 직접 만든 챗봇</b>이 여기에 해당하는지는 아직 분명하지 않아요. 학생 개인정보를 다룬다면 해당할 가능성이 커요. 학생에게 쓰게 하기 전에, 그리고 인터넷에 올려 배포하기 전에 학교·교육청 지침을 먼저 확인해요.'
      ]},
      { t: 'say', h: '연수 2일차 트랙도 4요소로 골라요', fig: 'trackPick', p: [
        '연수 2일차는 트랙 A(파이썬 자동채점 + AI튜터)와 트랙 B(자료 기반 AI학습 챗봇) 중 하나를 골라요. 2일차 14:00에는 트랙마다 4요소 차시가 있어요(A: 수업 활동과 자동채점 연결, B: 학습자료와 챗봇 연결).',
        '내 캔버스의 학생활동이 "코드를 내고 틀린 곳을 고친다"면 A(c4u1~c4u3), "자료를 읽고 묻고 확인한다"면 B(c4u4, 선택)가 잘 맞아요. 이 단원의 캔버스를 들고 가면 그 차시가 훨씬 빨라져요.'
      ]},
      { t: 'try', lang: 'py', h: '한 차시 비용을 어림해 봐요', p: '지금 가격(2026년 10월 기준, 바뀔 수 있어요)으로 한 반 한 차시 비용을 계산해요. 학생 수·질문 수·토큰 수를 바꿔 보고, <code>solar-mini4</code> 가격(입력 0.10, 출력 0.40)으로도 바꿔 보세요.',
        src: src(['# 100만 토큰당 달러(solar-pro4)', 'PRICE_IN, PRICE_OUT = 0.30, 1.20', 'students, questions = 30, 10', 'tok_in, tok_out = 2000, 300  # 질문 하나', '', 'n = students * questions', 'total_in = n * tok_in', 'total_out = n * tok_out', 'cost = (total_in * PRICE_IN', '        + total_out * PRICE_OUT) / 1_000_000', 'print(f"입력 {total_in:,} / 출력 {total_out:,} 토큰")', 'print(f"한 차시 약 ${cost:.2f}")']),
        note: '입력이 큰 까닭은 검색한 자료 조각과 시스템 규칙이 질문마다 함께 가기 때문이에요. 실제 사용량은 콘솔 Billing의 Usage에서 확인해요.' },
      { t: 'q', kind: 'mc', fig: 'q_whereUse', q: '전개 단계 실습을 시작하자마자 "막히면 바로 도우미에게 물어요"라고 안내하려 해요. 더 나은 안내는?',
        opts: ['그대로 둔다. 빨리 물을수록 실습 시간이 절약되고 진도가 빨라진다', '먼저 스스로 시도하고, 막힌 줄과 내 생각을 적은 뒤 묻게 한다', '도우미는 정리 단계에만 쓰게 하고 실습 중에는 아예 꺼 둔다', '질문을 한 사람당 한 번으로 정해 아껴 쓰게 한다'], a: 1,
        why: '학생이 먼저 시도해야 배움이 일어나요. "막힌 줄 + 내 생각"을 적고 물으면 도우미의 답도 더 정확해지고, 기록에도 오개념이 남아요.',
        ex: ['바로 물으면 생각할 틈 없이 답을 받아 적기 쉬워요.', '', '실습 중 막힐 때가 도우미가 가장 쓸모 있는 때예요. 끌 까닭은 없어요.', '횟수 제한은 비용·과의존을 막는 데 쓸 수 있지만, 한 번은 너무 적고 "먼저 시도"가 빠졌어요.'] },
      { t: 'q', kind: 'mc', fig: 'q_logWhat', q: '질문 기록을 <code>log.csv</code>에 남기려 해요. 어떤 칸을 남기는 게 가장 알맞을까요?',
        opts: ['시간, 자리 번호, 질문, 답이 "모른다"였는지', '이름, 학번, 질문과 답 전체(누가 물었는지 알려고)', '이름, 보호자 전화번호, 질문(나중에 연락하려고)', '아무것도 남기지 않는다. 기록은 모두 감시다'], a: 0,
        why: '다음 수업을 고치는 데 필요한 것만 남겨요. 누가 물었는지보다 <b>무엇이 몰렸는지</b>가 중요해요. 이름·학번 같은 개인정보는 받지 않고, 기록을 남긴다는 것도 학생에게 미리 알려요.',
        ex: ['', '수업 개선에 이름·학번은 필요 없어요. 개인정보를 모으면 지킬 책임도 커져요.', '수업 도구에 연락처는 필요 없어요. 모으지 않아요.', '목적과 범위를 알리고 꼭 필요한 것만 남기는 기록은 수업을 고치는 근거예요(c3u3에서 더 봐요).'] },
      { t: 'q', kind: 'blank', fig: 'q_cost', q: '한 반 30명이 질문 10개씩, 질문마다 입력 2천·출력 3백 토큰이에요. <code>solar-pro4</code>(100만 토큰당 입력 $0.30, 출력 $1.20)로 어림한 값은?', lang: 'plain', code: src(['입력: 30 × 10 × 2,000 = 600,000 토큰', '출력: 30 × 10 × 300 = 90,000 토큰', '비용: 약 [[1]]']),
        opts: ['$2.90', '$0.11', '$0.29', '$29'], a: 2,
        why: '입력 60만 토큰은 0.6 × $0.30 = $0.18, 출력 9만 토큰은 0.09 × $1.20 ≈ $0.11. 합쳐 약 $0.29예요. 가격은 바뀔 수 있으니 콘솔에서 실제 사용량을 확인해요.',
        ex: ['열 배 많아요. 100만 토큰 단위로 나눌 때 자리를 하나 덜 옮겼어요.', '출력 값만 셈했어요. 입력 60만 토큰 값도 더해요.', '', '백 배 많아요. 100만 토큰 단위로 나누는 걸 잊었어요.'] },
      { t: 'q', kind: 'mc', fig: 'q_schoolRule', q: '내가 만든 도우미를 학생들이 쓰게 하려 해요. 이름을 입력받아 학생별 기록을 남기는 기능도 넣었어요. 먼저 할 일로 가장 알맞은 것은?',
        opts: ['내가 만든 도구라 학교 소프트웨어 절차와는 상관없다', '지침을 보고, 선정 절차 대상인지 학교에 먼저 묻는다', '학생과 보호자에게 동의만 받으면 바로 쓸 수 있다', '인터넷에 공개 배포해 누구나 쓰게 하면 절차가 필요 없다'], a: 1,
        why: '학생 개인정보를 처리하는 소프트웨어는 교육부 선정 기준과 학운위 심의 대상이 될 수 있어요. 교사가 만든 도구가 해당하는지는 아직 분명하지 않으니 단정하지 말고 학교에 먼저 물어요. 이름이 꼭 필요한지도 다시 봐요.',
        ex: ['만든 사람이 누구든 학생 개인정보를 다루면 지켜야 할 절차가 있을 수 있어요.', '', '동의는 필요할 수 있는 것 중 하나일 뿐, 학교·교육청 지침과 절차 확인이 먼저예요.', '공개 배포는 확인할 것이 더 많아요. 배포는 학교 지침에 따라요.'] },
      { t: 'sum', pts: ['도구는 도입·전개·정리 중 학생활동이 가장 잘 맞는 한 장면에. 전개에서는 "먼저 시도, 그다음 질문".', '기록은 파일로, 필요한 칸만(이름 대신 자리 번호). AI 문장·점수를 그대로 성적에 쓰지 않는다.', '교실 전에 네트워크·기기·429·비용·지침 확인. 학습지원 소프트웨어 선정 절차 대상인지는 학교·교육청에 먼저 묻는다.'] }
    ]},

    /* =================== M1 =================== */
    { id: 'M1', type: 'mission', title: '4요소 기획서와 Streamlit 앱 시범', sub: '내 Cursor와 브라우저에서 직접', min: 50,
      where: 'upstage-lab 폴더 + 내 Cursor + 브라우저',
      intro: '이번 단원에서 배운 것을 진짜로 해 봐요. 기획서를 쓰고, c3u1의 helper를 Streamlit 앱으로 바꾸고, 동료에게 시범해요. 끝낸 것부터 체크하고 한 줄 메모도 남겨요.',
      tasks: [
        { do: '시작 전에 upstage-lab을 커밋해 둬요',
          how: '터미널에서 <code>upstage-lab</code> 폴더로 가서 <code>git status</code>. 바뀐 게 있으면 <code>git add -A</code> 뒤 <code>git commit -m "c3u2 시작 전"</code>. 목록에 <code>.env</code>가 보이면 멈추고 <code>.gitignore</code>부터 고쳐요.',
          check: '<code>git status</code>가 깨끗하고, <code>.env</code>가 한 번도 목록에 안 보였으면 성공.' },
        { do: '4요소 기획서 plan.md를 써요',
          how: '레슨 2의 캔버스를 <code>plan.md</code>로 옮겨 채워요. 맨 위에 문제 정의 한 문장(누가·언제·무엇에서 막히나), 그다음 학생활동·교사의 할·자료·평가. 학생 이름은 쓰지 않아요.',
          check: '네 칸이 다 차 있고, 학생활동이 동사로 적혀 있고, 평가가 목표와 맞물리면 성공. 맨 끝에 고른 2일차 트랙(A 또는 B)도 한 줄 적어요.' },
        { do: '에이전트에게 app.py를 맡겨요(Plan → Build)',
          how: 'Agents Window에서 New Agent, 모드를 <b>Plan</b>으로 바꾸고 아래 부탁을 붙여 넣어요. 계획에 키·모델 이름을 건드리는 단계가 있으면 빼 달라고 하고, 괜찮으면 <b>Build</b>.',
          check: 'Changes에 <code>app.py</code>만 생기고 <code>helper.py</code>·<code>.env</code>는 그대로면 성공.',
          prompt: 'upstage-lab 폴더에 Streamlit 채팅 앱 app.py를 만들어 줘. 먼저 계획만 보여 주고, 내가 허락하면 만들어.\n\n맥락: helper.py에 수업자료(반복문 단원)로 답하는 함수가 이미 있어. 학생은 브라우저로 이 앱에 들어와 질문해. 앱은 내 컴퓨터에서만 돌려.\n\n조건:\n- st.chat_input, st.chat_message, st.session_state로 대화 기록을 쌓아 보여 줘\n- 답은 helper.py의 함수를 불러 만들어. 모델 이름, reasoning_effort, 키 읽는 코드는 helper.py에 있는 그대로 둬\n- API 키를 화면·로그·print 어디에도 찍지 마. .env는 열지도 고치지도 마\n- 새 패키지는 streamlit 하나만\n- 화면 제목은 "정보 수업 도우미"\n\n확인 방법: 내가 streamlit run app.py로 켜서 질문 2개를 했을 때 대화가 위로 쌓이면 성공이야. 실행은 내가 직접 할게.' },
        { do: 'streamlit run으로 켜고 질문 5개로 시험해요',
          how: '<code>pip install streamlit</code> 뒤 <code>streamlit run app.py</code>. 처음 한 번 이메일을 물으면 비워 두고 <kbd>enter</kbd>. 브라우저에서 자료 안 질문 3개, 자료 밖 질문 2개를 해 보고, 다 하면 터미널에서 <kbd>ctrl+c</kbd>로 꺼요.',
          check: '대화가 위로 쌓이고, 자료 안 질문엔 근거 쪽이, 자료 밖 질문엔 "모른다"는 답이 나오면 성공. 결과를 메모에 한 줄로 적어요.' },
        { do: '동료에게 학생 역할로 시범을 부탁해요',
          how: '같은 와이파이에서 동료(또는 내 휴대폰)가 터미널의 <b>Network URL</b>로 들어와요. 5분 동안 엉뚱한 질문, "답만 줘", 아주 쉬운 질문을 섞어 달라고 하고, 나는 끼어들지 않고 지켜보며 적어요. 안 열리면 방화벽이나 공유기 설정 때문일 수 있으니, 이번엔 내 컴퓨터 브라우저로 동료가 써 봐도 돼요.',
          check: '<code>feedback.md</code>에 시범 중 본 것 3가지(멈칫한 곳, 이상한 답, 좋았던 점)가 이름 없이 적혀 있으면 성공.' },
        { do: '피드백 하나를 고치고 커밋해요',
          how: '<code>feedback.md</code>에서 가장 작은 것 하나를 골라, 아래 부탁의 괄호를 채워 에이전트에게 맡겨요. 같은 질문으로 다시 시험한 뒤 <code>git add -A</code>, <code>git commit</code>.',
          check: '<code>git log</code>에 커밋이 남고, <code>git show --stat</code>에 <code>.env</code>가 없으면 성공.',
          prompt: '동료 시범에서 나온 피드백이야: (여기에 한 줄). 이걸 app.py에서만 고쳐 줘.\n\n조건: helper.py와 .env는 건드리지 마. 키나 모델 이름을 화면에 찍지 마. 바꾼 줄이 몇 줄인지와 이유를 짧게 알려 줘.\n\n확인 방법: 내가 streamlit run app.py로 같은 질문을 다시 해서 확인할게. 무엇이 보이면 고쳐진 건지 한 줄로 알려 줘.' }
      ],
      note: '예상 비용: 시험·시범 질문을 다 합쳐 20번 안팎이면, 질문마다 입력 2천·출력 3백 토큰으로 어림해 <code>solar-pro4</code>로 약 $0.02예요(2026년 10월 가격, 바뀔 수 있어요). 실제는 콘솔 Billing의 Usage에서 확인해요. 키는 <code>.env</code>에만 두고, 화면 공유·스크린샷에 <code>.env</code>가 보이지 않게 해요. 시범에는 학생 개인정보가 든 자료를 쓰지 않아요.' },

    /* =================== T1 =================== */
    { id: 'T1', type: 'test', title: '단원 형성평가', sub: '10문제 · 7문제 이상 맞히면 통과', min: 11, pass: 0.7, steps: [
      { t: 'q', kind: 'mc', fig: 't_demoIE', q: '연수 1일차 11:00 사례 시연에서 "학습지 사진을 올리면 번호·문항·정답이 칸에 맞춰 표로 정리되는" 도구를 봤어요. 이 도구의 핵심 부품은?',
        opts: ['임베딩 검색', 'Streamlit 화면', 'IE(정보 추출)', 'Document Parse만'], a: 2,
        why: '파일·이미지에서 <b>정해진 칸</b>(번호·문항·정답)을 뽑는 부품이 Information Extract(IE)예요(c2u2). 스키마에 칸을 적어 주면 그 모양으로 돌려줘요.',
        ex: ['임베딩은 뜻이 가까운 조각을 찾는 부품이에요. 칸을 채우지 않아요.', 'Streamlit은 화면이에요. 칸을 뽑는 일은 뒤에서 API가 해요.', '', 'Parse는 문서를 제목·문단·표 같은 요소의 글로 바꿔요. 번호·정답 같은 내 칸은 IE가 채워요.'] },
      { t: 'q', kind: 'mc', fig: 't_teacherRole', q: '도우미를 쓰는 실습 시간, <b>교사의 할</b>로 가장 알맞은 것은?',
        opts: ['도우미가 다 답하니 교탁에서 다음 차시 자료를 만들며 기다린다', '교실을 돌며 막힌 학생과 엉뚱한 답을 찾아 함께 짚는다', '학생 대신 도우미에게 질문을 넣어 답을 받아 준다', '도우미가 할 답을 모두 미리 외워 둔다'], a: 1,
        why: '도구가 답하는 동안 교사는 관찰하고 개입해요. 엉뚱한 답을 함께 짚는 순간이 AI 답을 의심하는 법을 배우는 순간이에요.',
        ex: ['도구가 있어도 수업 중 교사의 일은 남아요. 막힌 학생과 이상한 답은 교사가 찾아요.', '', '학생이 먼저 생각하고 직접 묻는 게 학생활동이에요. 교사가 대신하면 활동이 사라져요.', '외울 필요도, 외울 수도 없어요. 대신 이상한 답을 알아채고 함께 짚어요.'] },
      { t: 'q', kind: 'line', fig: 't_canvasLine', q: '자료 요약 도구의 4요소 캔버스예요. <b>고쳐야 할 줄</b>을 눌러 보세요.', lang: 'plain', code: src(['학생활동: 요약 보고 원문에서 근거 찾기', '교사의 할: 요약이 빠뜨린 곳 미리 확인', '자료: 작년 학생 답안지(이름 그대로)', '평가: 원문에서 찾은 근거 3개 확인']), a: 2,
        why: '자료에 학생 개인정보가 든 문서를 넣지 않아요. 내 수업자료나 공개 자료만 쓰고, 꼭 필요하면 이름을 지운 것만 써요.' },
      { t: 'q', kind: 'order', fig: 't_sixOrder', q: '서술형 피드백 도구를 처음부터 만드는 순서로 쌓아 보세요.',
        items: ['조건문 서술형을 고쳐 볼 기회가 없다는 문제를 한 문장으로 적는다', '4요소 캔버스를 채운다', '터미널에서 피드백 함수를 루브릭과 함께 시험한다', 'Streamlit으로 학생 화면을 붙인다', '동료에게 학생 역할로 시범을 부탁한다', '시범 피드백 하나를 고치고 다시 시험한다'],
        why: '문제가 분명해야 4요소를 정하고, 터미널에서 답을 다듬은 뒤 화면을 붙여요. 시범을 해야 고칠 거리가 생겨요.' },
      { t: 'q', kind: 'blank', fig: 't_appBlank', q: 'app.py에서 질문을 받아 기록에 쌓는 부분이에요. 두 빈칸을 채워 보세요.', lang: 'py', code: src(['if q := st.[[1]]("질문을 적어요"):', '    st.[[2]].msgs.append(', '        {"role": "user", "content": q})']),
        opts: [['chat_message', 'session_state'], ['session_state', 'chat_input'], ['chat_input', 'chat_message'], ['chat_input', 'session_state']], a: 3,
        why: '입력칸은 <code>st.chat_input</code>, 다시 돌아도 남는 기록 상자는 <code>st.session_state</code>예요.',
        ex: ['첫 칸이 틀렸어요. <code>st.chat_message</code>는 말풍선 그릇이라 입력을 돌려주지 않아요.', '두 칸이 서로 바뀌었어요.', '둘째 칸이 틀렸어요. 말풍선 그릇에는 기록 목록이 없어요.', ''] },
      { t: 'q', kind: 'mc', fig: 't_localhost', q: '연수장에서 옆자리 선생님이 내 앱을 써 보겠다며 자기 노트북 브라우저에 <code>localhost:8501</code>을 쳤는데 안 열려요. 무엇을 알려 줄까요?',
        opts: ['내 터미널에 나온 Network URL을 알려 준다(같은 와이파이일 때)', '<code>localhost:8502</code>로 숫자를 하나 올려 쳐 보라고 한다', '내 <code>.env</code> 파일을 보내 주면 열린다고 한다', '그 노트북에서 <code>streamlit run</code>을 쳐 보라고 한다'], a: 0,
        why: '<code>localhost</code>는 "지금 이 컴퓨터"라서 옆 선생님 노트북 자신을 찾아요. 같은 네트워크라면 Network URL로 들어와요. 연수장·학교망이 기기끼리 접속을 막으면 그것도 안 될 수 있어요.',
        ex: ['', '포트 번호를 바꿔도 여전히 그 노트북 자신을 찾아요.', '키를 보내면 안 돼요. 키 없이도 화면은 내 컴퓨터가 보여 줘요.', '그 노트북에는 내 app.py와 helper가 없어요. 돌린다 해도 그건 그 노트북의 앱이에요.'] },
      { t: 'q', kind: 'mc', fig: 't_429', q: '연수 2일차 실습에서 선생님 30명이 한 분의 앱에 동시에 질문을 보내자 오류가 쏟아졌어요. 터미널에 <code>429</code>가 보여요. 알맞은 설명과 대처는?',
        opts: ['키가 틀렸다. 콘솔에서 새 키를 만들어 .env를 바꾼다', '한 키로 한꺼번에 너무 많이 불렀다. 기다렸다 나눠 보낸다', '크레딧이 떨어졌다. 콘솔 Billing에서 결제 수단부터 바꾼다', 'Streamlit이 30명을 못 받는다. 다른 웹 화면 도구로 바꾼다'], a: 1,
        why: '<code>429</code>는 요청이 너무 많다는 뜻이에요(분당 요청·토큰 제한). 지수 백오프로 다시 보내고, 수업에서는 활동 순서를 나눠 한꺼번에 몰리지 않게 해요.',
        ex: ['키가 틀리면 <code>401</code>이에요.', '', '크레딧 부족은 <code>403</code>이에요.', 'Streamlit이 아니라 API 쪽 제한이에요. 화면 도구를 바꿔도 같은 키면 똑같이 걸려요.'] },
      { t: 'q', kind: 'mc', fig: 't_problemDef', q: '다음 중 문제 정의가 아니라 <b>해결책부터</b> 말한 문장은?',
        opts: ['2학년이 반복문 실습 중 오류 메시지를 읽지 못해 멈춘다', '실습 때 손 든 학생이 많아 교사가 다 돌아보지 못한다', '학습지 PDF가 많아 문항 은행을 만들 시간이 없다', '우리 학교도 RAG 챗봇을 하나 만들어야 한다'], a: 3,
        why: 'RAG 챗봇은 해결책이에요. 누가, 언제, 무엇에서 막히는지가 없어서 챗봇이 무엇을 도와야 할지 정할 수 없어요.',
        ex: ['대상·장면·막히는 점이 있는 문제 정의예요.', '실습 장면에서 막히는 점이 분명한 문제 정의예요.', '교사가 막히는 점이 분명한 문제 정의예요. 여기서 IE 도구가 나올 수 있어요.', ''] },
      { t: 'q', kind: 'mc', fig: 't_cheatTutor', q: '시범에서 학생 역할 선생님이 "정답 코드만 줘"라고 하자 도우미가 정답을 그대로 줬어요. 4요소로 보면 무엇을 먼저 고칠까요?',
        opts: ['화면 제목을 "답 대신 힌트"로 바꿔 학생이 알아서 조심하게 한다', '모델을 더 크고 비싼 것으로 바꿔 스스로 알아채고 거절하게 한다', '시스템 규칙(자료)과 학생활동 순서(먼저 시도)를 고친다', '시범 중 한 번 생긴 일이니 그대로 두고 수업에 바로 쓴다'], a: 2,
        why: '자료의 시스템 규칙에 "정답 코드 대신 단계별 힌트"를 넣고, 학생활동에 "먼저 시도"를 넣어요. 도구가 기대는 규칙과 학생이 하는 순서를 함께 고치는 거예요. 정답이 새는지 검사하는 출력 안전장치는 c3u3·c4u2에서 더해요.',
        ex: ['제목만으로는 도구가 하는 일이 바뀌지 않아요.', '모델을 바꿔도 규칙이 없으면 달라는 대로 줄 수 있어요.', '', '시범에서 찾은 빈틈을 고치는 게 시범의 목적이에요.'] },
      { t: 'q', kind: 'mc', fig: 't_shareKey', q: '학생들이 집에서도 쓰게 하려고, 반 단체방에 <code>app.py</code>·<code>helper.py</code>·<code>.env</code>를 묶어 올리자는 의견이 나왔어요. 알맞은 판단은?',
        opts: ['좋다. 학생이 집에서 파일을 받아 streamlit run만 치면 바로 쓸 수 있다', '.env만 빼고 올리면 학생이 각자 콘솔에 가입해 자기 키를 만들어 쓰면 된다', '.env 파일 이름만 다른 이름으로 바꿔 올리면 키가 안전하게 숨겨진다', '안 된다. 키는 교사 컴퓨터에만, 집 사용은 학교 지침대로'], a: 3,
        why: '<code>.env</code>를 올리는 순간 키가 반 전체에 퍼지고, 누가 얼마나 부르든 내 크레딧에서 빠져요. 키는 서버(교사 컴퓨터)에만 두는 게 이 단원의 구조예요.',
        ex: ['키가 든 .env까지 퍼져요. 학생 PC마다 키가 생기는 셈이에요.', '학생에게 콘솔 가입과 키 관리를 맡기는 일이 돼요. 약관의 나이 조건과 학교 지침부터 확인해야 해요.', '이름을 바꿔도 안의 키는 그대로예요.', ''] }
    ]}
    ]
  });
})();
