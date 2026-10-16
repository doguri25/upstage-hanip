// 과정 1 · 단원 2 · Solar로 보는 LLM의 원리
(function () {
  function src(a) { return a.join('\n'); }
  // 글자 폭 어림(검사기와 같은 셈): 한글 size×0.95, 영문 size×0.5(고정폭 0.55), 빈칸 size×0.3
  function tw(s, size, mono) { return [...s].reduce((a, ch) => a + (ch === ' ' ? size * 0.3 : /[가-힣]/.test(ch) ? size * 0.95 : size * (mono ? 0.55 : 0.5)), 0); }
  // 창 틀(위 막대 + 점 세 개)
  function win(P, x, y, w, h) {
    P.rrect(x, y, w, h, 10, { fill: 'paper', fs: 'solid' });
    P.line(x, y + 22, x + w, y + 22, { w: 1.5 });
    P.circle(x + 12, y + 11, 7, { fill: 'bad', fs: 'solid', c: null });
    P.circle(x + 24, y + 11, 7, { fill: 'hi', fs: 'solid', c: null });
    P.circle(x + 36, y + 11, 7, { fill: 'good', fs: 'solid', c: null });
  }
  // 토큰 조각(글자 + 둥근 칸). 너비를 돌려준다
  function tok(P, x, y, label, fill, size) {
    size = size || 13;
    const w = Math.round(tw(label, size) + 14), h = size + 12;
    P.rrect(x, y, w, h, 6, { fill: fill || 'paper', gap: 5, w: 1.5 });
    P.text(x + w / 2, y + h / 2 + size * 0.36, label, { size, weight: 700 });
    return w;
  }
  // 토큰 줄: 왼쪽부터 늘어놓고 끝 x를 돌려준다
  function toks(P, x, y, list, fill, size, gap) {
    list.forEach((t, i) => { x += tok(P, x, y, t, Array.isArray(fill) ? fill[i % fill.length] : fill, size) + (gap == null ? 4 : gap); });
    return x;
  }
  // 확률 막대: 바닥 y, 가장 큰 높이 H, items = [[이름, 확률]]
  function bars(P, x, y, H, items, o) {
    o = o || {};
    const bw = o.bw || 30, gap = o.gap || 12, size = o.size || 12;
    const end = x + items.length * (bw + gap) - gap;
    P.line(x - 4, y, end + 4, y, { w: 1.6 });
    items.forEach(([name, p], i) => {
      const bx = x + i * (bw + gap), h = Math.max(3, p * H);
      P.rect(bx, y - h, bw, h, { fill: o.pick === i ? 'accent' : (o.fill || 'sky'), gap: 4, w: 1.5 });
      if (name) P.text(bx + bw / 2, y + size + 3, name, { size, weight: 700 });
      if (o.pct) P.text(bx + bw / 2, y - h - 4, Math.round(p * 100) + '%', { size: size - 1, c: 'ink2' });
    });
    return end;
  }
  // 메시지 상자: 왼쪽에 역할 이름, 오른쪽에 내용
  function msgBox(P, x, y, w, role, text, fill) {
    P.rrect(x, y, w, 28, 7, { fill: fill || 'paper', gap: 6, w: 1.5 });
    P.text(x + 8, y + 19, role, { size: 11, mono: true, weight: 700, anchor: 'start' });
    if (text) P.text(x + 18 + tw(role, 11, true), y + 19, text, { size: 12, anchor: 'start' });
  }
  // max_tokens 상자: 칸마다 [비율, 색, 글]
  function budget(P, x, y, w, h, parts) {
    let cx = x;
    parts.forEach(([f, fill, label]) => {
      const pw = w * f;
      P.rect(cx, y, pw, h, { fill, gap: 5, w: 1.2, c: 'ink2' });
      if (label) P.text(cx + pw / 2, y + h / 2 + 5, label, { size: 13, weight: 700 });
      cx += pw;
    });
    P.rrect(x - 3, y - 3, w + 6, h + 6, 6, { w: 2 });
  }
  // 사람(어깨 + 머리 + 얼굴). bottom = 어깨 아래 끝
  function person(P, cx, bottom, mood, s) {
    s = s || 1;
    P.path(`M${cx - 40 * s} ${bottom} Q${cx} ${bottom - 64 * s} ${cx + 40 * s} ${bottom}`, { fill: 'sky', gap: 6 });
    P.circle(cx, bottom - 90 * s, 62 * s, { fill: 'paper' });
    P.face(cx, bottom - 88 * s, 50 * s, { mood: mood || 'smile' });
  }
  // 동그란 얼굴(머리 + 표정). s = 표정 크기
  function head(P, cx, cy, s, o) {
    P.circle(cx, cy, s * 1.25, { fill: 'paper' });
    P.face(cx, cy + s * 0.04, s, o);
  }
  // 글 쪽지(제목 + 줄)
  function doc(P, x, y, w, h, title, fill) {
    P.note(x, y, w, h, { fill: fill || 'paper' });
    if (title) P.text(x + w / 2, y + 22, title, { size: 12, weight: 700 });
    const n = Math.floor((h - 34) / 12);
    for (let i = 0; i < n; i++) P.line(x + 10, y + 36 + i * 12, x + w - 12 - (i % 2) * 10, y + 36 + i * 12, { c: 'soft', w: 2.2 });
  }
  // 달력
  function cal(P, x, y, w, h, label) {
    P.rrect(x, y, w, h, 6, { fill: 'paper', w: 2 });
    P.rect(x, y, w, 16, { fill: 'bad', fs: 'solid', w: 1.4 });
    P.text(x + w / 2, y + h / 2 + 14, label, { size: 15, weight: 700 });
  }
  // 시계, 동전, 온도계
  function clock(P, cx, cy, d) {
    P.circle(cx, cy, d, { fill: 'paper', w: 2 });
    P.line(cx, cy, cx, cy - d * 0.32, { w: 2 });
    P.line(cx, cy, cx + d * 0.24, cy, { w: 2 });
  }
  function coin(P, cx, cy, d, label) {
    P.circle(cx, cy, d, { fill: 'hi', gap: 4, w: 1.8 });
    P.text(cx, cy + d * 0.18, label || '$', { size: Math.round(d * 0.5), weight: 700 });
  }
  function thermo(P, x, y, h, level, fill) {
    P.rrect(x - 7, y, 14, h, 7, { fill: 'paper', w: 1.8 });
    if (level) P.rect(x - 3, y + h - h * level, 6, h * level, { fill: fill || 'bad', fs: 'solid', c: null });
    P.circle(x, y + h + 6, 22, { fill: fill || 'bad', fs: 'solid', w: 1.8 });
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
  function shuffled(P) {
    ask(P, 116, 40, 22, 'warm');
    ask(P, 226, 112, 22, 'bad');
    ask(P, 30, 110, 20, 'accent');
  }
  // 후보 넷(다음 조각)과 확률
  const CANDS = [['반복', 0.72], ['여러', 0.15], ['계속', 0.09], ['한', 0.04]];

  /* ---------- 모의 화면에서 되풀이하는 조각 ---------- */
  const MEM = src([
    '# client·MODEL 준비는 단원 3에서 해요',
    'def ask(msgs):',
    '    r = client.chat.completions.create(',
    '        model=MODEL, messages=msgs,',
    '        reasoning_effort="none")',
    '    return r.choices[0].message.content',
    '',
    '# 요청 ①, 요청 ②를 따로 보내요',
    'print(ask([{"role": "user",',
    '    "content": "나는 정보 교사 하늘이야."}]))',
    'print(ask([{"role": "user",',
    '    "content": "내 이름이 뭐였지?"}]))']);
  const MEM_FIX = src([
    '# 앞 대화를 붙여서 한 요청으로 보내요',
    'msgs = [{"role": "user",',
    '         "content": "나는 정보 교사 하늘이야."}]',
    'answer = ask(msgs)',
    'msgs.append({"role": "assistant",',
    '             "content": answer})',
    'msgs.append({"role": "user",',
    '             "content": "내 이름이 뭐였지?"})',
    'print(ask(msgs))']);
  const MEM_OUT = ['$ python memory_test.py', '반가워요, 하늘 선생님! 무엇을 도와드릴까요?', '죄송하지만 이름을 알려 주신 적이 없어요.'];
  const TEMP = src([
    'import sys',
    '# client·MODEL 준비는 단원 3에서 해요',
    't = float(sys.argv[1])  # 0.2 또는 1.5',
    'q = "변수를 중학생에게 한 문장으로 비유해 줘"',
    'for i in range(3):',
    '    r = client.chat.completions.create(',
    '        model=MODEL,',
    '        messages=[{"role": "user", "content": q}],',
    '        temperature=t,',
    '        reasoning_effort="none")',
    '    print(i + 1, r.choices[0].message.content)']);
  const LOW_OUT = ['$ python temp_test.py 0.2', '1 변수는 값을 넣어 두는 이름표 붙은 상자예요.', '2 변수는 값을 넣어 두는 이름표 붙은 상자예요.', '3 변수는 값을 담아 두는 이름표 붙은 상자예요.'];
  const HIGH_OUT = ['$ python temp_test.py 1.5', '1 변수는 내용물을 바꿔 넣는 사물함이에요.', '2 변수는 이름이 적힌 칠판 한 칸 같아요.', '3 변수는 점수를 적었다 지웠다 하는 메모지예요.'];
  const PG_NAV = ['Playground', { name: 'Chat', sub: true }, { name: 'Document Parse', sub: true }, 'API keys', 'Usage'];
  const PG_ASIDE = [{ k: 'select', id: 'model', label: 'Model', value: 'Solar Pro 4' }];
  const Q_GUESS = '우리 학교 2학기 정보 수행평가는 언제, 무엇을 해?';
  const A_GUESS = '2학기 정보 수행평가는 11월 셋째 주에 "반복문으로 구구단 만들기"로 진행돼요. 배점은 30점이에요.';
  const Q_DOC = '아래 공지로만 답해 줘. 공지에 없으면 "공지에 없어요"라고 해 줘. [공지] 2학기 정보 수행평가: 12월 첫째 주, 리스트로 출석부 만들기. 질문: 언제, 무엇을 하고, 배점은 몇 점이야?';
  const A_DOC = '12월 첫째 주에 "리스트로 출석부 만들기"를 해요. 배점은 공지에 없어요.';
  const pgChat = (msgs) => [{ k: 'h', text: 'Chat', sub: 'Playground' }, { k: 'chat', msgs, input: '', ph: 'Type a message', empty: '질문을 보내 보세요' }];

  HANIP.unit({
    id: 'c1u2',
    course: '과정 1 · 시작',
    title: '단원 2 · Solar로 보는 LLM의 원리',
    goals: ['LLM이 토큰 확률로 다음 조각을 고르는 원리 알기', 'messages·temperature·max_tokens·reasoning_effort 읽고 고르기', '환각을 알아채고 근거 자료로 줄이는 습관 들이기'],
    checked: { date: '2026-10-16' },
    sources: [
      'https://console.upstage.ai/docs/capabilities/generate/chat',
      'https://console.upstage.ai/docs/capabilities/generate/reasoning',
      'https://console.upstage.ai/docs/resources/faq',
      'https://console.upstage.ai/api/chat',
      'https://console.upstage.ai/docs/models',
      'https://console.upstage.ai/docs/models/history',
      'https://console.upstage.ai/docs/getting-started',
      'https://github.com/UpstageAI/Solar-Pro4-Cookbook',
      'https://github.com/UpstageAI/Solar-Pro4-Cookbook/blob/main/capabilities/parameters/guide.ipynb',
      'https://www.upstage.ai/pricing/api'
    ],

    skip: [
      { t: 'q', kind: 'mc', fig: 'k_same', q: '<code>solar-pro4</code>에게 같은 질문을 보낼 때마다 답이 조금씩 달라요. 까닭으로 가장 알맞은 것은?',
        opts: ['질문을 받을 때마다 모델이 그 자리에서 새로 학습해서', '다음 토큰을 확률대로 뽑아 이어 쓰기 때문에', '서버가 여러 대라 서로 다른 모델이 답해서', '앞서 받은 질문을 기억해 일부러 바꿔서'], a: 1,
        why: 'LLM은 다음 토큰 후보마다 확률을 매기고 그 확률대로 뽑아요. 한 조각이 다르게 뽑히면 뒤의 글이 모두 달라져요. temperature를 낮추면 덜 달라져요.',
        ex: ['요청을 받을 때 모델이 다시 학습하지 않아요. 모델은 그대로예요.', '', '같은 별칭이면 같은 모델 버전이 답해요. 달라지는 건 뽑는 과정 때문이에요.', 'API는 앞 요청을 기억하지 않아요.'] },
      { t: 'q', kind: 'mc', fig: 'k_turn', q: '수업 챗봇이 학생의 두 번째 질문에 앞 대화를 이어 답하게 하려면?',
        opts: ['API가 알아서 기억하니 두 번째 질문만 보낸다', 'system에 "앞 대화를 꼭 기억해 둬"라는 규칙을 적어 둔다', '같은 API 키로 보내면 대화가 저절로 이어진다', '앞 질문과 앞 답을 messages에 붙여 함께 보낸다'], a: 3,
        why: 'API는 요청마다 따로라서 지난 대화를 기억하지 않아요. 앞 질문과 답을 messages에 차례로 붙이고 새 질문을 더해 한 요청으로 보내요.',
        ex: ['API는 기억하지 않아요. 두 번째 질문만 보내면 처음 만나는 셈이에요.', '규칙을 적어도 앞 대화가 요청 안에 없으면 읽을 수가 없어요.', 'API 키는 누가 부르는지 확인할 뿐, 대화를 이어 주지 않아요.', ''] },
      { t: 'q', kind: 'mc', fig: 'k_empty', q: '<code>reasoning_effort="high"</code>, <code>max_tokens=100</code>으로 보냈더니 <code>content</code>가 <code>None</code>이고 <code>finish_reason</code>이 <code>"length"</code>예요. 알맞은 설명과 고치기는?',
        opts: ['추론 토큰이 100개를 다 썼다. max_tokens를 넉넉히 준다', 'temperature가 높아 답이 흩어졌다. temperature를 0으로 낮춘다', 'API 키가 잘못돼 답이 막혔다. 키를 새로 만든다', '질문이 짧아 쓸 말이 없었다. 질문을 더 자세히 쓴다'], a: 0,
        why: '추론을 켜면 추론 토큰도 max_tokens 안에서 써요. 100개를 추론이 다 쓰면 답 자리가 없어 <code>content</code>가 <code>None</code>으로 와요. 추론이 필요하면 max_tokens를 넉넉히, 필요 없으면 <code>reasoning_effort="none"</code>으로 꺼요.',
        ex: ['', 'temperature는 뽑는 방식을 바꿀 뿐, 답 자리를 없애지 않아요.', '키가 틀리면 401 오류가 나요. 응답이 왔으니 키는 멀쩡해요.', '질문 길이는 입력 토큰이에요. 만들 자리(max_tokens)가 모자란 게 문제예요.'] }
    ],

    figs: {
      /* ---------- 이미 알아요 점검 그림 ---------- */
      k_same: { w: 340, h: 200, label: '같은 질문을 두 번 보냈더니 서로 다른 답 두 개가 나와 놀란 얼굴', draw(P) {
        [24, 104].forEach((y, i) => {
          P.rrect(12, y, 104, 30, 8, { fill: 'sky', gap: 5, w: 1.5 });
          P.text(64, y + 20, '변수가 뭐야?', { size: 13 });
          P.arrow(120, y + 15, 148, y + 15, { c: 'accent', w: 2, head: 7 });
          P.rrect(154, y - 8, 110, 46, 10, { fill: 'paper', w: 1.6 });
          P.line(164, y + 8, i ? 236 : 252, y + 8, { c: i ? 'warm' : 'k', w: 3 });
          P.line(164, y + 22, i ? 250 : 222, y + 22, { c: i ? 'warm' : 'k', w: 3 });
        });
        ask(P, 300, 100, 26);
        person(P, 300, 196, 'wow', 0.6);
        P.text(140, 186, '같은 질문, 다른 답', { size: 13, c: 'ink2' });
      }},
      k_turn: { w: 340, h: 200, label: '두 번째 질문만 받은 로봇이 첫 대화가 어디 있는지 두리번거리는 모습', draw(P) {
        P.robot(80, 110, 0.7, { mood: 'wow' });
        ask(P, 80, 40, 24);
        msgBox(P, 140, 40, 186, 'user', '내 이름이 뭐였지?', 'sky');
        P.rrect(140, 90, 186, 28, 7, { c: 'soft', w: 1.4 });
        P.text(233, 109, '첫 대화: ?', { size: 12, c: 'ink2' });
        P.text(233, 150, '두 번째 요청', { size: 13, c: 'ink2' });
        P.text(170, 190, '이어서 답하게 하려면?', { size: 13, c: 'accent' });
      }},
      k_empty: { w: 340, h: 200, label: '답이 없는 말풍선과 finish_reason "length" 표, 갸웃하는 로봇', draw(P) {
        P.bubble(20, 20, 150, 70, 60, 110);
        P.text(95, 60, 'content = None', { mono: true, size: 13, c: 'ink2' });
        P.robot(60, 150, 0.45, { mood: 'dizzy' });
        P.rrect(190, 40, 136, 56, 8, { fill: 'paper', w: 1.8 });
        P.text(258, 62, 'finish_reason', { mono: true, size: 12, weight: 700 });
        P.text(258, 84, '"length"', { mono: true, size: 13, weight: 700, c: 'bad' });
        P.text(258, 124, 'max_tokens=100', { mono: true, size: 12 });
        P.text(150, 190, '답은 어디 갔을까?', { size: 13, c: 'ink2' });
        head(P, 290, 166, 34, { mood: 'wow' });
      }},

      /* ---------- L1 설명 그림 ---------- */
      nextToken: { w: 340, h: 200, label: '"for 문은 같은 일을" 뒤에 올 다음 조각을 후보 넷 중에서 고르려는 로봇', draw(P) {
        P.text(12, 20, '지금까지의 글', { size: 12, c: 'ink2', anchor: 'start' });
        const end = toks(P, 12, 30, ['for', '문은', '같은', '일을'], 'paper', 13);
        P.rrect(end, 30, 40, 25, 6, { c: 'accent', w: 2 });
        P.text(end + 20, 48, '?', { size: 16, weight: 700, c: 'accent' });
        P.robot(286, 70, 0.5, { mood: 'happy' });
        P.arrow(end + 20, 62, 150, 112, { c: 'accent', w: 2, head: 8 });
        toks(P, 40, 118, CANDS.map(c => c[0]), 'hi', 13, 10);
        P.text(170, 186, '앞의 글을 보고 다음 조각을 예측해요', { size: 13, c: 'accent' });
      }},
      tokenSplit: { w: 340, h: 200, label: '"변수에 값을 넣어요" 문장이 여섯 조각으로 잘린 예', draw(P) {
        P.text(170, 34, '변수에 값을 넣어요', { size: 18, weight: 700 });
        P.arrow(170, 44, 170, 70, { c: 'accent', w: 2.2, head: 8 });
        toks(P, 64, 78, ['변수', '에', '값', '을', '넣', '어요'], ['sky', 'hi'], 13, 6);
        P.text(170, 136, '조각 6개 (한 가지 예)', { size: 14, weight: 700, c: 'accent' });
        P.text(170, 162, '글자 수 8 ≠ 토큰 수 6', { size: 13 });
        P.text(170, 190, '자르는 방식은 모델마다 달라요', { size: 12, c: 'ink2' });
      }},
      probBars: { w: 340, h: 200, label: '"for 문은 같은 일을" 다음 후보 넷의 확률 막대: 반복 72, 여러 15, 계속 9, 한 4', draw(P) {
        P.text(170, 26, 'for 문은 같은 일을 ___', { size: 15, weight: 700 });
        P.robot(42, 120, 0.4, { mood: 'happy' });
        bars(P, 90, 160, 110, CANDS, { bw: 34, gap: 16, pct: true, pick: 0 });
        P.text(310, 120, '합 100%', { size: 12, c: 'ink2' });
      }},
      loopWrite: { w: 340, h: 200, label: '확률 매기기, 하나 고르기, 글 뒤에 붙이기를 되풀이하다 끝 조각이나 max_tokens에서 멈추는 고리', draw(P) {
        P.rrect(115, 14, 110, 34, 10, { fill: 'sky', gap: 6 });
        P.text(170, 36, '① 확률 매기기', { size: 13, weight: 700 });
        P.rrect(214, 104, 112, 34, 10, { fill: 'hi', gap: 6 });
        P.text(270, 126, '② 하나 고르기', { size: 13, weight: 700 });
        P.rrect(14, 104, 116, 34, 10, { fill: 'good', gap: 6 });
        P.text(72, 126, '③ 글 뒤에 붙이기', { size: 13, weight: 700 });
        P.curveArrow(226, 40, 280, 52, 274, 100, { c: 'accent', w: 2, head: 8 });
        P.curveArrow(212, 134, 170, 160, 132, 134, { c: 'accent', w: 2, head: 8 });
        P.curveArrow(66, 100, 66, 50, 112, 34, { c: 'accent', w: 2, head: 8 });
        P.robot(170, 86, 0.36, { mood: 'proud' });
        P.text(170, 172, '되풀이', { size: 13, weight: 700, c: 'accent' });
        P.arrow(300, 140, 300, 174, { c: 'bad', w: 2, head: 7 });
        P.text(292, 192, '끝 조각·max_tokens면 멈춤', { size: 11, c: 'bad', anchor: 'end' });
      }},
      tokenCost: { w: 340, h: 200, label: '입력은 동전 하나, 출력은 동전 넷: 100만 토큰당 $0.30과 $1.20', draw(P) {
        P.text(85, 28, '입력(보낸 글)', { size: 13, weight: 700 });
        P.text(255, 28, '출력(만든 답)', { size: 13, weight: 700 });
        coin(P, 85, 78, 40);
        [0, 1, 2, 3].forEach(i => coin(P, 210 + i * 30, 78, 40));
        P.text(85, 126, '$0.30', { size: 16, weight: 700 });
        P.text(255, 126, '$1.20', { size: 16, weight: 700, c: 'bad' });
        P.text(170, 154, '100만 토큰당 · solar-pro4 · 정가', { size: 12, c: 'ink2' });
        clock(P, 46, 182, 26);
        P.text(196, 188, '답이 길수록 돈도 시간도 더 들어요', { size: 12, c: 'accent' });
      }},

      /* ---------- L1 문제 그림 ---------- */
      q_howAnswer: { w: 340, h: 200, label: '질문 말풍선이 로봇에게 들어가고 답 말풍선은 물음표인 모습', draw(P) {
        P.bubble(14, 30, 100, 44, 60, 92, { fill: 'sky' });
        P.text(64, 58, '질문', { size: 14, weight: 700 });
        P.robot(170, 110, 0.6, { mood: 'proud' });
        P.bubble(226, 30, 100, 44, 250, 92);
        ask(P, 276, 62, 24);
        P.arrow(70, 120, 124, 120, { c: 'accent', w: 2, head: 8 });
        P.arrow(216, 120, 270, 120, { c: 'accent', w: 2, head: 8 });
        P.text(170, 186, '답은 어떻게 만들어질까?', { size: 14, c: 'ink2' });
      }},
      q_stepOrder: { w: 340, h: 200, label: '뒤섞인 카드: 확률 막대, 붙이는 조각, 가위, 하나 집어 올리기', draw(P) {
        card(P, 14, 16);
        bars(P, 30, 76, 44, [['', 0.8], ['', 0.4], ['', 0.2]], { bw: 14, gap: 8 });
        card(P, 126, 58);
        tok(P, 146, 80, '+일을', 'hi', 12);
        card(P, 238, 14);
        P.circle(262, 36, 16, { w: 1.8 });
        P.circle(262, 62, 16, { w: 1.8 });
        P.line(268, 42, 312, 66, { w: 2 });
        P.line(268, 56, 312, 32, { w: 2 });
        card(P, 56, 116);
        P.circle(102, 168, 18, { fill: 'accent', fs: 'solid' });
        P.arrow(102, 156, 102, 128, { w: 2, head: 7 });
        P.robot(270, 146, 0.5, { mood: 'wow' });
        shuffled(P);
      }},
      q_count: { w: 340, h: 200, label: '글자 1,000자 학습지가 몇 토큰일지 고민하는 얼굴', draw(P) {
        doc(P, 24, 24, 110, 140, '학습지');
        P.text(79, 186, '글자 1,000자', { size: 13, weight: 700 });
        P.arrow(146, 94, 196, 94, { c: 'accent', w: 2.4, head: 9 });
        P.rrect(206, 60, 120, 68, 10, { fill: 'hi', gap: 6 });
        P.text(266, 102, '? 토큰', { size: 20, weight: 700 });
        head(P, 266, 160, 34, { mood: 'wow' });
      }},
      q_usageBlank: { w: 340, h: 200, label: 'usage 상자에 보낸 쪽 이름은 있고, 만든 쪽 이름 칸은 비어 있는 모습', draw(P) {
        P.rrect(20, 24, 200, 130, 10, { fill: 'paper', w: 2 });
        P.text(36, 50, 'usage', { mono: true, size: 15, weight: 700, anchor: 'start' });
        P.line(20, 62, 220, 62, { c: 'soft', w: 1.4 });
        P.text(36, 92, 'prompt_tokens', { mono: true, size: 12, anchor: 'start' });
        P.text(200, 92, '25', { mono: true, size: 13, weight: 700, anchor: 'end' });
        P.rrect(32, 112, 100, 22, 5, { c: 'accent', w: 1.6 });
        ask(P, 82, 129, 16, 'accent');
        P.text(200, 129, '8', { mono: true, size: 13, weight: 700, anchor: 'end' });
        person(P, 284, 196, 'smile', 0.7);
        P.text(120, 186, '만든 쪽은 어디에?', { size: 13, c: 'ink2' });
      }},
      q_inOut: { w: 340, h: 200, label: '보낸 글 1,000토큰과 만든 답 1,000토큰을 단 저울, 어느 쪽이 비쌀지 물음표', draw(P) {
        P.line(170, 46, 170, 146, { w: 3 });
        P.path('M140 166 L200 166 L170 146 Z', { fill: 'soft', gap: 5 });
        P.line(70, 50, 270, 50, { w: 3 });
        [70, 270].forEach((x, i) => {
          P.line(x, 50, x - 20, 100, { w: 1.4 });
          P.line(x, 50, x + 20, 100, { w: 1.4 });
          P.path(`M${x - 30} 100 Q${x} 120 ${x + 30} 100 Z`, { fill: i ? 'hi' : 'sky', gap: 5 });
          coin(P, x, 86, 26, '?');
        });
        P.text(70, 140, '보낸 글', { size: 13, weight: 700 });
        P.text(270, 140, '만든 답', { size: 13, weight: 700 });
        P.text(70, 160, '1,000토큰', { size: 12, c: 'ink2' });
        P.text(270, 160, '1,000토큰', { size: 12, c: 'ink2' });
        P.text(170, 192, '어느 쪽이 더 비쌀까?', { size: 13, c: 'accent' });
      }},

      /* ---------- L2 설명 그림 ---------- */
      roleBoxes: { w: 340, h: 200, label: 'messages 목록 안에 system, user, assistant 상자가 차례로 담긴 모습', draw(P) {
        P.text(20, 26, 'messages = [', { mono: true, size: 13, weight: 700, anchor: 'start' });
        msgBox(P, 36, 40, 280, 'system', '너는 정보 선생님이야.', 'hi');
        P.text(308, 59, '규칙', { size: 11, c: 'ink2', anchor: 'end' });
        msgBox(P, 36, 76, 280, 'user', '변수가 뭐예요?', 'sky');
        P.text(308, 95, '사용자 말', { size: 11, c: 'ink2', anchor: 'end' });
        msgBox(P, 36, 112, 280, 'assistant', '값을 담는 이름표예요.', 'good');
        P.text(308, 131, '모델의 앞선 답', { size: 11, c: 'ink2', anchor: 'end' });
        P.text(20, 162, ']', { mono: true, size: 13, weight: 700, anchor: 'start' });
        P.text(170, 190, '차례로 이어 붙인 긴 글을 모델이 읽어요', { size: 12, c: 'accent' });
      }},
      noMemory: { w: 340, h: 200, label: '따로 보낸 요청은 앞 요청을 모르고, 이으려면 지난 대화 묶음을 통째로 보내는 모습', draw(P) {
        P.text(85, 24, '따로 보낸 요청', { size: 13, weight: 700 });
        P.rrect(18, 40, 60, 26, 6, { fill: 'sky', gap: 5 });
        P.text(48, 58, '요청 ①', { size: 11, weight: 700 });
        P.rrect(18, 80, 60, 26, 6, { fill: 'sky', gap: 5 });
        P.text(48, 98, '요청 ②', { size: 11, weight: 700 });
        P.arrow(80, 93, 102, 96, { c: 'accent', w: 1.8, head: 7 });
        P.robot(128, 96, 0.42, { mood: 'wow' });
        ask(P, 152, 62, 20);
        P.text(85, 150, '앞 요청은 몰라요', { size: 12, c: 'ink2' });
        P.line(170, 20, 170, 166, { c: 'soft', w: 1.4 });
        P.text(255, 24, '이으려면 통째로', { size: 13, weight: 700 });
        P.rrect(180, 34, 82, 74, 8, { c: 'accent', w: 2 });
        P.rrect(186, 40, 70, 18, 4, { fill: 'sky', gap: 4, w: 1.2 });
        P.text(221, 53, 'user', { mono: true, size: 10 });
        P.rrect(186, 62, 70, 18, 4, { fill: 'good', gap: 4, w: 1.2 });
        P.text(221, 75, 'assistant', { mono: true, size: 10 });
        P.rrect(186, 84, 70, 18, 4, { fill: 'sky', gap: 4, w: 1.2 });
        P.text(221, 97, 'user', { mono: true, size: 10 });
        P.arrow(266, 72, 282, 72, { c: 'accent', w: 2, head: 7 });
        P.robot(305, 96, 0.38, { mood: 'happy' });
        P.text(255, 150, '매번 다 보내요', { size: 12, c: 'ink2' });
        P.text(170, 190, '모델은 받은 messages만 봐요', { size: 13, c: 'accent' });
      }},
      contextWindow: { w: 340, h: 200, label: '컨텍스트 창이라는 책상 위에 보낸 글 쪽지들과 만들 답 자리가 함께 놓인 모습', draw(P) {
        P.text(170, 22, '컨텍스트 창 = 한 요청의 책상', { size: 13, weight: 700 });
        P.rrect(14, 30, 312, 120, 12, { fill: 'hi', gap: 8 });
        doc(P, 30, 46, 54, 74, 'system');
        doc(P, 92, 46, 54, 74, 'user');
        doc(P, 154, 46, 54, 74, '자료');
        P.rrect(226, 46, 86, 74, 8, { fill: 'paper', fs: 'solid', c: 'accent', w: 2 });
        P.text(269, 80, '만들 답', { size: 12, weight: 700, c: 'accent' });
        P.text(269, 100, 'max_tokens', { mono: true, size: 10, c: 'accent' });
        P.text(118, 140, '보낸 글(입력)', { size: 12, weight: 700 });
        P.text(269, 140, '만들 글', { size: 12, weight: 700 });
        P.text(170, 172, '입력 + max_tokens가 책상 안에 들어가야 해요', { size: 12, c: 'accent' });
        P.text(170, 194, '책상 위 내용은 이번 요청에서만 보여요', { size: 12, c: 'ink2' });
      }},
      longCost: { w: 340, h: 200, label: '질문할 때마다 보내는 묶음이 한 칸씩 높아지는 계단과 땀 흘리는 얼굴', draw(P) {
        P.text(150, 22, '질문할 때마다 보내는 글', { size: 13, weight: 700 });
        for (let i = 0; i < 5; i++) {
          const x = 30 + i * 58;
          for (let k = 0; k <= i; k++) P.rect(x, 150 - (k + 1) * 18, 40, 16, { fill: k % 2 ? 'good' : 'sky', gap: 4, w: 1.2 });
          P.text(x + 20, 168, (i + 1) + '번째', { size: 12, weight: 700 });
        }
        head(P, 318, 38, 28, { mood: 'dizzy' });
        P.drop(330, 62, 6);
        P.text(170, 192, '대화가 길수록 요청이 무거워져요', { size: 13, c: 'accent' });
      }},

      /* ---------- L2 문제 그림 ---------- */
      q_forget: { w: 340, h: 200, label: '요청 ①과 요청 ②가 따로 가고, 두 번째 요청을 받은 로봇이 모른다고 하는 모습', draw(P) {
        msgBox(P, 14, 24, 200, 'user', '나는 하늘이야', 'sky');
        P.text(222, 43, '요청 ①', { size: 11, c: 'ink2', anchor: 'start' });
        msgBox(P, 14, 70, 200, 'user', '내 이름이 뭐였지?', 'sky');
        P.text(222, 89, '요청 ②', { size: 11, c: 'ink2', anchor: 'start' });
        P.robot(90, 150, 0.4, { mood: 'dizzy' });
        P.bubble(130, 120, 120, 40, 112, 150);
        P.text(190, 145, '음… 몰라요', { size: 13 });
        person(P, 296, 198, 'wow', 0.6);
        P.text(170, 194, '왜 모를까?', { size: 13, c: 'ink2' });
      }},
      q_roleBlank: { w: 340, h: 200, label: 'messages에 모델의 앞선 답을 넣으려는데 역할 칸이 비어 있는 모습', draw(P) {
        msgBox(P, 20, 30, 300, 'system', '정보 선생님', 'hi');
        msgBox(P, 20, 66, 300, 'user', '변수가 뭐야?', 'sky');
        P.rrect(20, 102, 300, 28, 7, { c: 'accent', w: 2 });
        P.rrect(28, 106, 64, 20, 5, { c: 'warm', w: 1.6 });
        ask(P, 60, 122, 16, 'warm');
        P.text(104, 121, '값을 담는 이름표예요.', { size: 12, anchor: 'start' });
        P.robot(60, 168, 0.3, { mood: 'smile' });
        P.text(200, 172, '모델이 했던 답', { size: 13, c: 'ink2' });
      }},
      q_desk: { w: 340, h: 200, label: '512K라고 적힌 넓은 책상과 무엇의 한도인지 고민하는 얼굴', draw(P) {
        P.text(120, 40, 'solar-pro4 컨텍스트', { size: 13, weight: 700 });
        P.rrect(20, 60, 200, 90, 12, { fill: 'hi', gap: 8 });
        P.text(120, 114, '512K', { size: 30, weight: 700 });
        P.line(40, 150, 40, 182, { w: 3 });
        P.line(200, 150, 200, 182, { w: 3 });
        P.bubble(232, 14, 100, 44, 270, 84);
        P.text(282, 42, '무슨 한도?', { size: 13, weight: 700 });
        person(P, 284, 196, 'wow', 0.75);
      }},

      /* ---------- QA 그림 ---------- */
      qa_tokChar: { w: 340, h: 200, label: '"반복문" 세 글자가 토큰 몇 개인지 물음표', draw(P) {
        P.text(90, 70, '반복문', { size: 32, weight: 700 });
        P.text(90, 104, '글자 3개', { size: 13, c: 'ink2' });
        P.arrow(150, 64, 196, 64, { c: 'accent', w: 2.4, head: 9 });
        P.rrect(206, 44, 116, 40, 8, { c: 'accent', w: 1.8 });
        P.text(264, 71, '? 토큰', { size: 18, weight: 700 });
        head(P, 170, 158, 44, { mood: 'wow' });
      }},
      qa_sysUser: { w: 340, h: 200, label: '"중학생 눈높이로, 세 문장 이내" 쪽지를 세 역할 상자 중 어디에 넣을지 고민', draw(P) {
        P.note(14, 20, 150, 66, { fill: 'hi' });
        P.text(86, 46, '중학생 눈높이로,', { size: 13, weight: 700 });
        P.text(86, 70, '세 문장 이내', { size: 13, weight: 700 });
        ['system', 'user', 'assistant'].forEach((r, i) => {
          P.rrect(200, 20 + i * 44, 126, 32, 7, { fill: ['hi', 'sky', 'good'][i], gap: 6, w: 1.5 });
          P.text(263, 41 + i * 44, r, { mono: true, size: 12, weight: 700 });
        });
        ask(P, 182, 120, 22);
        person(P, 80, 198, 'wow', 0.7);
      }},
      qa_ctxTrain: { w: 340, h: 200, label: '오늘 책상 위의 자료와 다음 날 빈 책상, 모델의 책장(학습 데이터)은 그대로', draw(P) {
        P.text(80, 24, '오늘', { size: 14, weight: 700 });
        P.rrect(14, 34, 132, 70, 10, { fill: 'hi', gap: 7 });
        doc(P, 52, 42, 56, 56, '자료');
        P.text(250, 24, '다음 날', { size: 14, weight: 700 });
        P.rrect(184, 34, 132, 70, 10, { fill: 'hi', gap: 7 });
        ask(P, 250, 78, 24);
        P.rrect(110, 128, 120, 46, 8, { fill: 'sky', gap: 6 });
        ['warm', 'good', 'hi', 'paper', 'pink'].forEach((c, i) => P.rect(122 + i * 20, 136, 14, 30, { fill: c, fs: 'solid', w: 1.2 }));
        P.text(170, 194, '학습 데이터(책장)', { size: 12, c: 'ink2' });
        P.robot(52, 158, 0.34, { mood: 'smile' });
      }},

      /* ---------- L3 설명 그림 ---------- */
      sampling: { w: 340, h: 200, label: '확률대로 공을 뽑는 뽑기 통: 파란 공이 많지만 이번엔 노란 공이 뽑힌 모습', draw(P) {
        P.rrect(34, 48, 132, 14, 5, { fill: 'soft', gap: 4 });
        P.path('M40 60 L40 160 Q40 176 56 176 L144 176 Q160 176 160 160 L160 60', { w: 2.2 });
        const balls = [[58, 160, 'sky'], [80, 162, 'sky'], [102, 160, 'sky'], [124, 162, 'sky'], [146, 158, 'hi'], [66, 140, 'sky'], [90, 140, 'sky'], [114, 142, 'good'], [138, 140, 'sky'],
          [56, 120, 'sky'], [78, 118, 'hi'], [102, 120, 'sky'], [126, 120, 'sky'], [146, 122, 'pink'], [68, 98, 'sky'], [92, 98, 'sky'], [116, 100, 'good'], [140, 98, 'sky']];
        balls.forEach(([x, y, c]) => P.circle(x, y, 20, { fill: c, fs: 'solid', w: 1.4 }));
        P.arrow(168, 84, 220, 64, { c: 'accent', w: 2.2, head: 8 });
        P.circle(244, 54, 30, { fill: 'hi', fs: 'solid', w: 1.8 });
        P.text(244, 59, '여러', { size: 12, weight: 700 });
        P.text(296, 44, '이번엔', { size: 12, c: 'ink2' });
        P.text(244, 96, '15%도 가끔 뽑혀요', { size: 12, c: 'accent' });
        [['sky', '반복 72%'], ['hi', '여러 15%'], ['good', '계속 9%'], ['pink', '한 4%']].forEach(([c, t], i) => {
          const x = 206 + (i >> 1) * 70, y = 132 + (i % 2) * 24;
          P.circle(x, y - 4, 14, { fill: c, fs: 'solid', w: 1.2 });
          P.text(x + 12, y, t, { size: 12, anchor: 'start' });
        });
        P.text(170, 196, '확률대로 뽑기 = 표집(샘플링)', { size: 12, c: 'ink2' });
      }},
      tempBars: { w: 340, h: 200, label: '같은 점수를 temperature 0.2는 뾰족하게, 1.0은 보통, 1.5는 평평하게 만든 확률 막대 세 묶음', draw(P) {
        P.text(170, 24, '같은 점수, temperature만 다르게', { size: 13, weight: 700 });
        [['0.2', [0.99, 0.01, 0.003], '뾰족'], ['1.0', [0.63, 0.23, 0.14], '보통'], ['1.5', [0.53, 0.27, 0.2], '평평']].forEach(([t, ps, name], i) => {
          const x0 = 22 + i * 108;
          bars(P, x0, 140, 100, ps.map(p => ['', p]), { bw: 22, gap: 8, fill: i ? 'sky' : 'accent' });
          P.text(x0 + 37, 160, 't = ' + t, { size: 12 });
          P.text(x0 + 37, 184, name, { size: 14, weight: 700, c: i ? 'ink' : 'accent' });
        });
      }},
      topP: { w: 340, h: 200, label: '확률 순으로 줄 세운 후보를 위에서부터 더해 0.8에 닿으면 자르는 선', draw(P) {
        CANDS.forEach(([n, p], i) => {
          const y = 22 + i * 32;
          P.text(60, y + 16, n, { size: 13, weight: 700, anchor: 'end' });
          P.rect(70, y, p * 220, 22, { fill: i < 2 ? 'sky' : 'soft', gap: 5, w: 1.4 });
          P.text(78 + p * 220, y + 16, Math.round(p * 100) + '%', { size: 12, anchor: 'start', c: 'ink2' });
        });
        P.line(20, 83, 320, 83, { c: 'bad', w: 2.2 });
        P.text(316, 104, 'top_p=0.8이면 여기까지', { size: 12, c: 'bad', anchor: 'end' });
        P.text(170, 172, '위에서부터 더해 0.8에 닿을 때까지만 남겨요', { size: 12, c: 'accent' });
        P.text(170, 194, '1.0이면 아무도 안 잘라요', { size: 12, c: 'ink2' });
      }},
      maxTokens: { w: 340, h: 200, label: '답 조각이 max_tokens 상자 끝에서 잘리고 finish_reason이 "length"인 모습', draw(P) {
        P.text(118, 32, 'max_tokens', { mono: true, size: 12, weight: 700 });
        P.rrect(14, 40, 216, 40, 8, { w: 2 });
        toks(P, 22, 48, ['변수는', '값을', '담는', '이름', '표'], 'sky', 12, 4);
        tok(P, 240, 48, '예요', 'soft', 12);
        cross(P, 258, 60, 10);
        P.rrect(40, 104, 260, 60, 10, { fill: 'paper', w: 1.8 });
        P.text(56, 128, 'finish_reason', { mono: true, size: 13, anchor: 'start' });
        P.text(286, 128, '"length"', { mono: true, size: 14, weight: 700, c: 'bad', anchor: 'end' });
        P.text(56, 152, '다 끝나면', { size: 12, anchor: 'start', c: 'ink2' });
        P.text(286, 152, '"stop"', { mono: true, size: 13, anchor: 'end', c: 'good' });
        P.text(170, 192, '상한에 닿으면 문장 중간에서 멈춰요', { size: 12, c: 'accent' });
      }},
      classUse: { w: 340, h: 200, label: '낮은 온도계 옆 채점 쪽지, 높은 온도계 옆 아이디어 전구', draw(P) {
        thermo(P, 40, 40, 100, 0.15, 'sky');
        doc(P, 64, 50, 96, 96, '채점');
        tick(P, 140, 120, 10);
        P.text(100, 182, '낮게: 채점·추출', { size: 13, weight: 700 });
        thermo(P, 200, 40, 100, 0.8, 'bad');
        P.circle(270, 84, 56, { fill: 'hi', gap: 5, w: 2 });
        P.rect(258, 112, 24, 16, { w: 1.8 });
        P.sparkle(310, 50, 7, 'hi');
        P.sparkle(234, 46, 5, 'warm');
        P.text(260, 182, '높게: 아이디어', { size: 13, weight: 700 });
      }},

      /* ---------- L3 문제 그림 ---------- */
      q_flatPeak: { w: 340, h: 200, label: 'temperature 손잡이를 0.2에서 1.5로 돌리고, 막대 모양은 가려진 상자', draw(P) {
        P.circle(70, 90, 80, { fill: 'paper', w: 2.2 });
        P.line(70, 90, 100, 66, { w: 3, c: 'accent' });
        P.curveArrow(36, 54, 70, 30, 104, 54, { c: 'accent', w: 2, head: 8 });
        P.text(30, 150, '0.2', { size: 13, weight: 700 });
        P.text(110, 150, '1.5', { size: 13, weight: 700 });
        P.text(70, 182, 'temperature', { mono: true, size: 12 });
        P.rrect(170, 40, 150, 110, 10, { c: 'soft', w: 1.6 });
        P.text(245, 112, '?', { size: 44, weight: 700, c: 'warm' });
        P.text(245, 176, '막대 모양은?', { size: 13, c: 'ink2' });
      }},
      q_gradeTemp: { w: 340, h: 200, label: '쌓인 과제 답안과 눈금이 빈 온도계, 어디에 맞출지 고민하는 얼굴', draw(P) {
        [0, 1, 2].forEach(i => doc(P, 20 + i * 14, 24 + i * 10, 90, 110, i === 2 ? '과제 답안' : ''));
        thermo(P, 190, 30, 110, 0, 'warm');
        ask(P, 222, 92, 28);
        person(P, 290, 198, 'wow', 0.7);
        P.text(100, 186, '통과 / 다시', { size: 14, weight: 700 });
      }},
      q_cut: { w: 340, h: 200, label: '문장 중간에서 끊긴 답 쪽지와 가위', draw(P) {
        P.rrect(20, 40, 220, 80, 10, { fill: 'paper', w: 2 });
        P.text(36, 72, '변수는 값을 담는 이름표', { size: 14, anchor: 'start' });
        P.text(36, 100, '라서 예를 들면 점수를 저', { size: 14, anchor: 'start' });
        P.line(240, 30, 240, 130, { c: 'bad', w: 2.4 });
        P.circle(262, 46, 16, { w: 1.8 });
        P.circle(262, 70, 16, { w: 1.8 });
        P.line(268, 52, 304, 74, { w: 2 });
        P.line(268, 64, 304, 42, { w: 2 });
        P.text(130, 150, 'finish_reason = ?', { mono: true, size: 13 });
        person(P, 290, 198, 'wow', 0.6);
      }},
      q_topp: { w: 340, h: 200, label: 'top_p=0.1 쪽지와 확률 순으로 줄 선 후보들, 어디까지 남길지 물음표', draw(P) {
        P.note(14, 20, 120, 50, { fill: 'hi' });
        P.text(70, 52, 'top_p=0.1', { mono: true, size: 14, weight: 700 });
        CANDS.forEach(([n, p], i) => {
          const y = 24 + i * 30;
          P.text(196, y + 15, n, { size: 12, weight: 700, anchor: 'end' });
          P.rect(204, y, p * 120, 20, { fill: 'sky', gap: 5, w: 1.3 });
        });
        ask(P, 310, 90, 26);
        person(P, 80, 198, 'wow', 0.7);
        P.text(240, 176, '어디까지 남길까?', { size: 13, c: 'ink2' });
      }},

      /* ---------- L4 설명 그림 ---------- */
      thinkFirst: { w: 340, h: 200, label: '로봇이 reasoning 쪽지를 먼저 쓰고 그다음 content 답을 쓰는 모습', draw(P) {
        P.robot(56, 104, 0.6, { mood: 'proud' });
        P.note(110, 20, 140, 86, { fill: 'sky' });
        P.text(180, 42, 'reasoning', { mono: true, size: 12, weight: 700 });
        for (let i = 0; i < 4; i++) P.line(122, 58 + i * 12, 236 - (i % 2) * 20, 58 + i * 12, { c: 'ink2', w: 2 });
        P.text(290, 40, '① 먼저', { size: 13, weight: 700, c: 'accent' });
        P.arrow(200, 108, 210, 122, { c: 'accent', w: 2, head: 7 });
        P.rrect(150, 124, 170, 44, 10, { fill: 'good', gap: 6 });
        P.text(235, 142, 'content', { mono: true, size: 12, weight: 700 });
        P.text(235, 160, '보이는 답', { size: 12, weight: 700 });
        P.text(102, 152, '② 그다음', { size: 13, weight: 700, c: 'accent' });
        P.text(170, 194, '추론 글도 토큰이에요', { size: 13, c: 'ink2' });
      }},
      effortScale: { w: 340, h: 200, label: 'reasoning_effort 눈금: none·minimal은 추론 꺼짐, low부터 max까지 켜짐', draw(P) {
        P.text(170, 20, 'reasoning_effort', { mono: true, size: 13, weight: 700 });
        P.text(54, 46, '추론 꺼짐', { size: 13, weight: 700 });
        P.text(216, 46, '추론 켜짐', { size: 13, weight: 700, c: 'good' });
        P.line(20, 56, 88, 56, { c: 'soft', w: 3 });
        P.line(110, 56, 322, 56, { c: 'good', w: 3 });
        P.line(20, 100, 320, 100, { w: 3 });
        ['none', 'minimal', 'low', 'medium', 'high', 'xhigh', 'max'].forEach((v, i) => {
          const x = 30 + i * 46.6;
          P.circle(x, 100, 14, { fill: i < 2 ? 'soft' : 'good', fs: 'solid', w: 1.4 });
          P.text(x, i % 2 ? 136 : 82, v, { mono: true, size: 11 });
        });
        P.arrow(130, 162, 310, 162, { c: 'accent', w: 2.2, head: 8 });
        P.text(220, 188, '뒤로 갈수록 더 많이', { size: 12, c: 'accent' });
      }},
      budget: { w: 340, h: 200, label: 'max_tokens 상자에 추론이 먼저 차고 남은 자리에 답이 들어가는 경우와, 작아서 답 자리가 없는 경우', draw(P) {
        P.text(14, 64, '넉넉하면', { size: 12, weight: 700, anchor: 'start' });
        budget(P, 76, 44, 250, 30, [[0.6, 'sky', '추론'], [0.3, 'good', '답'], [0.1, 'paper', '']]);
        P.text(14, 124, '작으면', { size: 12, weight: 700, anchor: 'start' });
        budget(P, 76, 104, 120, 30, [[1, 'sky', '추론']]);
        P.text(210, 124, '답 자리 없음', { size: 12, c: 'bad', anchor: 'start' });
        P.text(170, 22, 'max_tokens 상자', { size: 13, weight: 700 });
        P.text(170, 166, 'finish_reason = "length", content = None', { mono: true, size: 11 });
        P.text(170, 192, '추론 토큰도 completion_tokens에 세져요', { size: 12, c: 'ink2' });
      }},
      cookbookRace: { w: 340, h: 200, label: '같은 계산 문제: none은 0.86초에 틀린 답, high는 12.85초에 맞는 답', draw(P) {
        P.text(85, 24, '"none"', { mono: true, size: 14, weight: 700 });
        P.robot(85, 82, 0.46, { mood: 'happy' });
        clock(P, 44, 140, 30);
        P.text(68, 146, '0.86초', { size: 14, weight: 700, anchor: 'start' });
        P.text(85, 182, '답 틀림', { size: 14, weight: 700, c: 'bad' });
        P.line(170, 20, 170, 190, { c: 'soft', w: 1.4 });
        P.text(255, 24, '"high"', { mono: true, size: 14, weight: 700 });
        P.robot(250, 82, 0.46, { mood: 'proud' });
        P.note(284, 40, 42, 52, { fill: 'sky' });
        clock(P, 206, 140, 30);
        P.text(230, 146, '12.85초', { size: 14, weight: 700, anchor: 'start' });
        P.text(255, 182, '답 맞음', { size: 14, weight: 700, c: 'good' });
      }},
      alwaysWrite: { w: 340, h: 200, label: '안 적으면 꺼진다는 공식 문서 쪽지와 의도가 안 보이는 코드 쪽지, 그래서 reasoning_effort를 직접 적은 코드', draw(P) {
        P.note(14, 20, 104, 70, { fill: 'paper' });
        P.text(66, 44, '공식 문서', { size: 12, weight: 700 });
        P.text(66, 72, '안 적으면 꺼짐', { size: 13, weight: 700, c: 'accent' });
        P.note(130, 20, 104, 70, { fill: 'paper' });
        P.text(182, 44, '코드만 보면', { size: 12, weight: 700 });
        P.text(182, 72, '의도가 안 보여', { size: 13, weight: 700, c: 'warm' });
        head(P, 284, 56, 44, { mood: 'wow' });
        P.rrect(40, 112, 260, 50, 8, { fill: 'ink', fs: 'solid' });
        P.text(56, 142, 'reasoning_effort="none"', { mono: true, size: 14, c: 'paper', anchor: 'start' });
        tick(P, 272, 136, 12);
        P.text(170, 190, '그래서 늘 직접 적어요', { size: 13, c: 'accent' });
      }},

      /* ---------- L4 문제 그림 ---------- */
      q_effortBlank: { w: 340, h: 200, label: '수업 공지 글에서 날짜 한 줄만 칠한 모습과 effort 빈칸', draw(P) {
        doc(P, 20, 20, 140, 120, '수업 공지');
        P.rect(28, 86, 80, 12, { fill: 'hi', fs: 'solid', c: null });
        P.text(90, 166, '날짜만 뽑기', { size: 13, weight: 700 });
        P.rrect(180, 50, 146, 44, 8, { fill: 'ink', fs: 'solid' });
        P.text(192, 77, 'effort="___"', { mono: true, size: 13, c: 'paper', anchor: 'start' });
        person(P, 270, 198, 'smile', 0.6);
      }},
      q_emptyAns: { w: 340, h: 200, label: 'high와 max_tokens=50으로 보냈더니 content가 None으로 돌아와 놀란 얼굴', draw(P) {
        P.rrect(14, 24, 160, 64, 8, { fill: 'ink', fs: 'solid' });
        P.text(26, 48, 'effort="high"', { mono: true, size: 12, c: 'paper', anchor: 'start' });
        P.text(26, 72, 'max_tokens=50', { mono: true, size: 12, c: 'paper', anchor: 'start' });
        P.arrow(180, 56, 210, 56, { c: 'accent', w: 2.2, head: 8 });
        P.rrect(216, 24, 110, 64, 8, { fill: 'paper', w: 2 });
        P.text(271, 48, 'content', { mono: true, size: 12, weight: 700 });
        P.text(271, 76, 'None', { mono: true, size: 18, weight: 700, c: 'bad' });
        person(P, 170, 198, 'wow', 0.7);
        ask(P, 236, 150, 26);
      }},
      q_whenOn: { w: 340, h: 200, label: '네 가지 수업 일 카드와 추론 스위치', draw(P) {
        P.rrect(14, 24, 70, 80, 10, { fill: 'hi', gap: 6 });
        P.text(49, 70, 'A/B', { size: 16, weight: 700 });
        P.rrect(96, 24, 70, 80, 10, { fill: 'sky', gap: 6 });
        [32, 58, 84].forEach(y => P.rect(121, y, 20, 12, { fill: 'paper', fs: 'solid', w: 1.2 }));
        P.line(131, 44, 131, 58, { w: 1.4 });
        P.line(131, 70, 131, 84, { w: 1.4 });
        P.rrect(178, 24, 70, 80, 10, { fill: 'good', gap: 6 });
        cal(P, 191, 36, 44, 56, '12/1');
        P.rrect(260, 24, 70, 80, 10, { fill: 'pink', gap: 6 });
        P.text(295, 70, '안녕', { size: 16, weight: 700 });
        P.rrect(140, 128, 60, 30, 15, { fill: 'good', fs: 'solid', w: 1.6 });
        P.circle(185, 143, 24, { fill: 'paper', fs: 'solid', w: 1.4 });
        P.text(170, 190, '어디에 추론을 켤까?', { size: 13, c: 'ink2' });
      }},
      q_allHigh: { w: 340, h: 200, label: '"모든 요청을 high로!" 외치는 말풍선과 시계, 쌓이는 동전', draw(P) {
        P.bubble(14, 14, 190, 50, 60, 84, { fill: 'hi' });
        P.text(109, 46, '모든 요청을 high로!', { size: 14, weight: 700 });
        person(P, 60, 198, 'happy', 0.7);
        clock(P, 260, 60, 50);
        coin(P, 244, 150, 30);
        coin(P, 274, 150, 30);
        coin(P, 259, 124, 30);
        ask(P, 170, 140, 30);
      }},

      /* ---------- QB 그림 ---------- */
      qb_tempVsEffort: { w: 340, h: 200, label: '매번 다른 답 세 개와 temperature, reasoning_effort 손잡이 두 개', draw(P) {
        [0, 1, 2].forEach(i => {
          P.rrect(14, 20 + i * 36, 120, 28, 8, { fill: 'paper', w: 1.5 });
          P.line(24, 34 + i * 36, 70 + i * 22, 34 + i * 36, { c: ['k', 'warm', 'good'][i], w: 3 });
        });
        P.text(74, 146, '매번 달라요', { size: 13, c: 'ink2' });
        P.circle(200, 70, 56, { fill: 'paper', w: 2 });
        P.line(200, 70, 214, 50, { w: 3, c: 'accent' });
        P.text(200, 118, 'temperature', { mono: true, size: 11 });
        P.circle(290, 70, 56, { fill: 'paper', w: 2 });
        P.line(290, 70, 304, 50, { w: 3, c: 'accent' });
        P.text(290, 118, 'reasoning_effort', { mono: true, size: 10 });
        ask(P, 245, 166, 28);
      }},
      qb_maxVsCtx: { w: 340, h: 200, label: '큰 책상 안의 보낸 글 칸과 만들 글 칸, 두 이름표에 물음표', draw(P) {
        P.rrect(14, 30, 312, 110, 12, { fill: 'hi', gap: 8 });
        P.rrect(30, 50, 160, 70, 8, { fill: 'paper', w: 1.6 });
        P.text(110, 92, '보낸 글', { size: 14, weight: 700 });
        P.rrect(204, 50, 106, 70, 8, { fill: 'paper', fs: 'solid', c: 'accent', w: 2 });
        P.text(257, 92, '만들 글', { size: 14, weight: 700, c: 'accent' });
        P.line(80, 140, 80, 154, { w: 1.6 });
        P.line(257, 120, 257, 154, { w: 1.6 });
        P.rrect(20, 154, 120, 32, 8, { fill: 'paper', w: 1.6 });
        P.text(80, 176, '전체: ?', { size: 14, weight: 700 });
        P.rrect(200, 154, 120, 32, 8, { fill: 'paper', w: 1.6 });
        P.text(260, 176, '이 칸: ?', { size: 14, weight: 700 });
      }},
      qb_reasonVsContent: { w: 340, h: 200, label: '응답 상자 안의 긴 칸과 짧은 칸, 학생 화면에는 어느 칸을 보여 줄지 물음표', draw(P) {
        P.rrect(14, 16, 200, 166, 10, { fill: 'paper', w: 2 });
        P.text(28, 40, 'message', { mono: true, size: 13, weight: 700, anchor: 'start' });
        P.rrect(28, 52, 172, 70, 8, { fill: 'sky', gap: 6 });
        for (let i = 0; i < 4; i++) P.line(40, 68 + i * 14, 184 - i * 16, 68 + i * 14, { c: 'ink2', w: 2.4 });
        P.rrect(28, 134, 172, 36, 8, { fill: 'good', gap: 6 });
        P.line(40, 152, 120, 152, { w: 3 });
        P.rrect(240, 40, 86, 120, 10, { fill: 'paper', w: 2 });
        P.text(283, 66, '학생 화면', { size: 12, weight: 700 });
        ask(P, 283, 122, 30);
        P.curveArrow(204, 88, 222, 70, 236, 96, { c: 'soft', w: 1.8, head: 7 });
        P.curveArrow(204, 152, 222, 168, 236, 130, { c: 'soft', w: 1.8, head: 7 });
      }},

      /* ---------- L5 설명 그림 ---------- */
      hallucination: { w: 340, h: 200, label: '자신 있게 말하는 로봇의 매끄러운 말풍선과, 그 내용이 지어낸 것임을 알아챈 얼굴', draw(P) {
        P.robot(60, 110, 0.6, { mood: 'proud' });
        P.bubble(110, 16, 216, 96, 90, 96);
        P.text(218, 48, '2학기 수행평가는', { size: 14 });
        P.text(218, 74, '11월 셋째 주예요!', { size: 14, weight: 700 });
        P.text(218, 100, '(지어낸 내용)', { size: 12, c: 'bad' });
        person(P, 280, 198, 'wow', 0.6);
        P.text(130, 186, '매끄럽다 ≠ 맞다', { size: 15, weight: 700, c: 'accent' });
      }},
      cutoff: { w: 340, h: 200, label: '2026-02에서 멈춘 달력과 그 뒤의 소식 쪽지들에 물음표', draw(P) {
        cal(P, 84, 20, 72, 70, '2026-02');
        P.line(20, 110, 120, 110, { c: 'good', w: 5 });
        P.line(120, 110, 320, 110, { c: 'soft', w: 2.4 });
        P.circle(120, 110, 14, { fill: 'accent', fs: 'solid' });
        P.text(120, 140, '학습 데이터 기준', { size: 12, weight: 700 });
        P.note(200, 40, 50, 56, { fill: 'paper' });
        ask(P, 225, 78, 20);
        P.note(262, 40, 50, 56, { fill: 'paper' });
        ask(P, 287, 78, 20);
        P.text(256, 140, '그 뒤의 소식', { size: 12, weight: 700 });
        P.text(170, 186, 'solar-pro4 · 모델 문서 기준', { size: 12, c: 'ink2' });
      }},
      calcSource: { w: 340, h: 200, label: '틀린 곱셈 쪽지와 열리지 않는 주소 창', draw(P) {
        P.note(14, 24, 140, 92, { fill: 'paper' });
        P.text(84, 56, '3847 × 2961', { size: 16, weight: 700 });
        P.text(84, 88, '= 11,389,967', { size: 15, weight: 700, c: 'bad' });
        P.text(84, 140, '계산기로 확인!', { size: 12, c: 'accent' });
        win(P, 180, 24, 146, 92);
        P.text(253, 74, '404', { size: 24, weight: 700, c: 'bad' });
        P.text(253, 100, '없는 페이지', { size: 12, c: 'ink2' });
        P.text(253, 140, '주소는 직접 열어 보기', { size: 12, c: 'accent' });
        head(P, 170, 176, 34, { mood: 'dizzy' });
      }},
      groundDoc: { w: 340, h: 200, label: '공지 자료 쪽지를 함께 받은 로봇이 자료에 있는 것만 답하고 없는 것은 없다고 하는 모습', draw(P) {
        doc(P, 14, 30, 96, 110, '공지 자료', 'hi');
        P.arrow(116, 84, 146, 84, { c: 'accent', w: 2.2, head: 8 });
        P.robot(190, 90, 0.55, { mood: 'happy' });
        P.bubble(232, 24, 96, 46, 214, 70);
        P.text(280, 52, '12월 1주', { size: 13, weight: 700 });
        P.bubble(232, 86, 96, 46, 214, 100);
        P.text(280, 114, '공지에 없어요', { size: 12, weight: 700 });
        P.text(62, 162, '근거 자료', { size: 13, weight: 700 });
        P.text(170, 192, '자료로만 답하고, 없으면 없다고', { size: 13, c: 'accent' });
      }},
      checkHabit: { w: 340, h: 200, label: '날짜·숫자·출처 세 칸 체크리스트와 돋보기를 든 교사', draw(P) {
        P.note(20, 20, 180, 150, { fill: 'paper' });
        ['① 날짜·최신 정보', '② 숫자·계산', '③ 출처 주소'].forEach((r, i) => {
          P.rect(36, 44 + i * 40, 18, 18, { w: 1.6 });
          tick(P, 45, 53 + i * 40, 8);
          P.text(64, 59 + i * 40, r, { size: 13, anchor: 'start' });
        });
        person(P, 262, 196, 'proud', 0.8);
        P.circle(312, 56, 36, { fill: 'sky', gap: 5, w: 2.4 });
        P.line(324, 70, 334, 86, { w: 4 });
        P.text(110, 192, '마지막 판단은 교사', { size: 13, c: 'accent' });
      }},

      /* ---------- L5 문제 그림 ---------- */
      q_newsAfter: { w: 340, h: 200, label: '2026-10 달력 옆에서 로봇이 지난달 발표된 지침을 자세히 말하는 모습', draw(P) {
        cal(P, 20, 30, 80, 76, '2026-10');
        P.bubble(120, 20, 206, 64, 150, 104);
        P.text(223, 46, '지난달 발표된 지침은', { size: 13 });
        P.text(223, 70, '첫째, … 둘째, …', { size: 13 });
        P.robot(150, 152, 0.45, { mood: 'proud' });
        person(P, 280, 198, 'wow', 0.6);
        ask(P, 60, 150, 26);
      }},
      q_fakeLink: { w: 340, h: 200, label: '퀴즈 해설 끝에 붙은 참고 주소와 돋보기', draw(P) {
        doc(P, 20, 20, 170, 150, '퀴즈 해설');
        P.rrect(30, 124, 150, 36, 6, { fill: 'hi', fs: 'solid', w: 1.4 });
        P.text(105, 147, '참고: https://…', { size: 12, mono: true });
        P.circle(250, 96, 60, { fill: 'sky', gap: 5, w: 2.4 });
        P.line(272, 118, 300, 146, { w: 5 });
        P.text(260, 186, '진짜 있을까?', { size: 13, c: 'ink2' });
      }},
      q_checkOrder: { w: 340, h: 200, label: '뒤섞인 카드: 돋보기, 쪽지 더미, 로봇과 쪽지, 학생에게 건네는 쪽지', draw(P) {
        card(P, 14, 16);
        P.circle(52, 46, 30, { fill: 'sky', gap: 5, w: 2 });
        P.line(62, 56, 76, 72, { w: 3.5 });
        card(P, 126, 58);
        P.note(146, 66, 30, 40, { fill: 'paper' });
        P.note(158, 74, 30, 40, { fill: 'hi' });
        card(P, 238, 14);
        P.robot(266, 52, 0.28, { mood: 'smile' });
        P.note(290, 26, 18, 24, { fill: 'hi' });
        card(P, 56, 116);
        P.note(68, 126, 30, 38, { fill: 'paper' });
        P.arrow(102, 146, 122, 146, { c: 'accent', w: 2, head: 7 });
        head(P, 134, 150, 20, { mood: 'happy' });
        P.robot(270, 146, 0.5, { mood: 'wow' });
        shuffled(P);
      }},
      q_avgCalc: { w: 340, h: 200, label: '이름 없는 점수표와 계산기, 로봇 중 누구에게 맡길지 물음표', draw(P) {
        P.rrect(14, 24, 120, 130, 8, { fill: 'paper', w: 2 });
        for (let i = 0; i < 7; i++) P.line(26, 44 + i * 16, 122, 44 + i * 16, { c: 'soft', w: 1.4 });
        P.text(74, 176, '점수 30개', { size: 13, weight: 700 });
        P.rrect(170, 30, 70, 100, 10, { fill: 'sky', gap: 6 });
        P.rrect(180, 40, 50, 22, 4, { fill: 'paper', fs: 'solid', w: 1.4 });
        for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) P.rect(180 + c * 18, 70 + r * 18, 14, 14, { w: 1.2 });
        P.robot(290, 80, 0.5, { mood: 'smile' });
        ask(P, 205, 162, 24);
        ask(P, 290, 162, 24);
      }},

      /* ---------- T1 그림 ---------- */
      t_diffAns: { w: 340, h: 200, label: '연수장 옆자리 노트북 두 대, 같은 코드인데 다른 답 말풍선', draw(P) {
        P.rrect(30, 14, 100, 34, 8, { fill: 'sky', gap: 5 });
        P.line(42, 31, 110, 31, { c: 'k', w: 3 });
        P.rrect(210, 14, 100, 34, 8, { fill: 'hi', gap: 5 });
        P.line(222, 31, 280, 31, { c: 'warm', w: 3 });
        P.text(170, 40, '≠', { size: 24, weight: 700, c: 'bad' });
        laptop(P, 20, 60, 120, 70);
        laptop(P, 200, 60, 120, 70);
        P.text(80, 86, 'same.py', { mono: true, size: 12 });
        P.text(260, 86, 'same.py', { mono: true, size: 12 });
        head(P, 80, 110, 24, { mood: 'smile' });
        head(P, 260, 110, 24, { mood: 'wow' });
        P.text(170, 172, '연수장 옆자리', { size: 13, c: 'ink2' });
      }},
      t_gradeBlank: { w: 340, h: 200, label: '통과·다시 도장과 두 칸이 빈 설정', draw(P) {
        P.circle(60, 60, 70, { fill: 'good', gap: 6, w: 2 });
        P.text(60, 66, '통과', { size: 16, weight: 700 });
        P.circle(60, 140, 70, { fill: 'warm', gap: 6, w: 2 });
        P.text(60, 146, '다시', { size: 16, weight: 700 });
        P.rrect(120, 40, 206, 120, 10, { fill: 'ink', fs: 'solid' });
        P.text(136, 84, 'temperature=[1]', { mono: true, size: 13, c: 'paper', anchor: 'start' });
        P.text(136, 124, 'effort="[2]"', { mono: true, size: 13, c: 'paper', anchor: 'start' });
        P.text(222, 188, '두 칸을 채워요', { size: 13, c: 'ink2' });
      }},
      t_roleLine: { w: 340, h: 200, label: '메시지 상자 네 개 중 어긋난 줄을 돋보기로 찾는 얼굴', draw(P) {
        [0, 1, 2, 3].forEach(i => {
          P.rrect(20, 20 + i * 38, 190, 28, 7, { fill: i ? 'sky' : 'hi', gap: 6, w: 1.4 });
          P.line(32, 34 + i * 38, 140 - (i % 2) * 30, 34 + i * 38, { c: 'ink2', w: 2.4 });
        });
        P.circle(226, 110, 56, { fill: 'sky', gap: 6, w: 2.4 });
        P.line(246, 130, 266, 152, { w: 5 });
        person(P, 300, 198, 'wow', 0.6);
        P.text(110, 186, '어느 줄이 어긋났지?', { size: 13, c: 'ink2' });
      }},
      t_turnOrder: { w: 340, h: 200, label: '뒤섞인 카드: 규칙 쪽지, 로봇의 답, 학생의 첫 질문, 학생의 두 번째 질문', draw(P) {
        card(P, 14, 16);
        P.note(34, 24, 52, 52, { fill: 'hi' });
        P.text(60, 56, '규칙', { size: 13, weight: 700 });
        card(P, 126, 58);
        P.robot(172, 96, 0.3, { mood: 'happy' });
        card(P, 238, 14);
        head(P, 272, 48, 34, { mood: 'smile' });
        P.text(306, 54, '1', { size: 16, weight: 700 });
        card(P, 56, 116);
        head(P, 90, 150, 34, { mood: 'wow' });
        P.text(124, 156, '2', { size: 16, weight: 700 });
        P.robot(270, 146, 0.5, { mood: 'wink' });
        shuffled(P);
      }},
      t_emptyTrain: { w: 340, h: 200, label: '연수장 화면에 None인 content와 "length"가 뜨고 지켜보는 얼굴들', draw(P) {
        P.rrect(40, 14, 260, 110, 8, { fill: 'paper', w: 2 });
        P.text(60, 48, 'content: None', { mono: true, size: 14, anchor: 'start' });
        P.text(60, 80, 'finish_reason: "length"', { mono: true, size: 14, anchor: 'start', c: 'bad' });
        P.text(60, 108, 'effort="high", max_tokens=200', { mono: true, size: 12, anchor: 'start', c: 'ink2' });
        P.line(170, 124, 170, 140, { w: 3 });
        [50, 110, 230, 290].forEach((x, i) => head(P, x, 164, 34, { mood: i === 1 ? 'wow' : 'smile' }));
        P.text(170, 172, '연수 실습 중', { size: 12, c: 'ink2' });
      }},
      t_slowChat: { w: 340, h: 200, label: '길게 쌓인 대화 기록과 커진 시계, 동전 더미', draw(P) {
        for (let i = 0; i < 6; i++) P.rrect(20 + (i % 2) * 30, 14 + i * 26, 150, 20, 6, { fill: i % 2 ? 'good' : 'sky', gap: 5, w: 1.2 });
        clock(P, 260, 70, 70);
        P.drop(308, 36, 7);
        coin(P, 244, 150, 30);
        coin(P, 276, 150, 30);
        coin(P, 260, 126, 30);
        P.text(110, 190, '대화가 길어질수록', { size: 12, c: 'ink2' });
      }},
      t_calc: { w: 340, h: 200, label: '학생이 "AI가 그랬어요"라며 곱셈 답 쪽지를 들고 온 모습', draw(P) {
        person(P, 64, 198, 'happy', 0.75);
        P.note(120, 20, 206, 90, { fill: 'hi' });
        P.text(223, 52, 'AI가 그랬어요', { size: 14, weight: 700 });
        P.text(223, 84, '3847 × 2961 = 11,389,967', { size: 13 });
        head(P, 240, 158, 44, { mood: 'wink' });
        ask(P, 296, 150, 24);
      }},
      t_costCalc: { w: 340, h: 200, label: '학생 얼굴 여섯과 입력·출력 토큰 쪽지, 동전과 물음표', draw(P) {
        for (let i = 0; i < 6; i++) head(P, 30 + (i % 3) * 30, 40 + Math.floor(i / 3) * 30, 22, { mood: 'smile' });
        P.text(60, 104, '학생 30명', { size: 13, weight: 700 });
        P.text(60, 124, '질문 10개씩', { size: 12, c: 'ink2' });
        P.note(130, 20, 120, 110, { fill: 'paper' });
        P.text(190, 50, '입력 2천', { size: 13 });
        P.text(190, 76, '출력 3백', { size: 13 });
        P.text(190, 108, '토큰 / 질문', { size: 12, c: 'ink2' });
        coin(P, 290, 60, 40);
        coin(P, 290, 108, 40, '?');
        P.text(170, 180, '대략 얼마일까?', { size: 14, c: 'accent' });
      }},
      t_bothKnobs: { w: 340, h: 200, label: 'temperature와 top_p 손잡이를 한꺼번에 크게 돌려 어지러운 얼굴', draw(P) {
        P.circle(70, 80, 70, { fill: 'paper', w: 2 });
        P.line(70, 80, 96, 64, { w: 3, c: 'accent' });
        P.text(70, 136, 'temperature', { mono: true, size: 11 });
        P.circle(180, 80, 70, { fill: 'paper', w: 2 });
        P.line(180, 80, 156, 62, { w: 3, c: 'accent' });
        P.text(180, 136, 'top_p', { mono: true, size: 11 });
        P.curveArrow(40, 34, 70, 14, 100, 34, { c: 'bad', w: 2, head: 7 });
        P.curveArrow(210, 34, 180, 14, 150, 34, { c: 'bad', w: 2, head: 7 });
        person(P, 284, 196, 'dizzy', 0.75);
        P.text(125, 180, '무엇 때문에 달라졌지?', { size: 13, c: 'ink2' });
      }},
      t_ground: { w: 340, h: 200, label: '"우리 반 시간표 알려 줘"에 로봇이 지어낸 답을 하고, 옆에 시간표 자료 쪽지가 있는 모습', draw(P) {
        P.bubble(14, 14, 170, 50, 60, 84, { fill: 'sky' });
        P.text(99, 45, '우리 반 시간표 알려 줘', { size: 12 });
        person(P, 60, 198, 'smile', 0.65);
        P.bubble(196, 20, 130, 50, 210, 96);
        P.text(261, 50, '월 1교시는 정보!', { size: 12 });
        P.robot(200, 134, 0.5, { mood: 'proud' });
        doc(P, 252, 100, 74, 80, '시간표', 'hi');
      }},
    },

    items: [
    /* =================== L1 =================== */
    { id: 'L1', type: 'lesson', title: '다음 토큰 맞히기', sub: '토큰, 확률, 한 조각씩 이어 쓰기, 토큰 = 돈과 시간', min: 10, steps: [
      { t: 'say', h: 'LLM은 다음 조각을 맞히는 프로그램이에요', fig: 'nextToken', p: [
        '코딩한입에서 프롬프트 쓰는 법(역할·맥락·예시·형식)을 익혔죠. 이번 단원은 그 프롬프트를 받는 쪽, <b>LLM</b>(큰 언어 모델)의 속을 들여다봐요. 연수 1일차 13:00 「Solar로 보는 LLM의 원리」를 미리 공부하는 단원이에요.',
        'LLM이 하는 일은 하나예요. 지금까지의 글을 보고 <b>다음에 올 글 조각을 예측</b>해요. 업스테이지의 대표 모델 <code>solar-pro4</code>도 같은 원리로 움직여요.',
        '그래서 "안다", "생각한다"보다 "예측한다"가 정확한 말이에요. 답이 매번 다른 까닭, 돈이 드는 까닭, 틀린 말을 매끄럽게 하는 까닭이 모두 이 한 문장에서 나와요.'
      ]},
      { t: 'say', h: '글은 토큰이라는 조각으로 잘려요', fig: 'tokenSplit', p: [
        'LLM은 글을 글자나 낱말이 아니라 <b>토큰</b>(token)이라는 조각으로 다뤄요. 글을 토큰으로 자르는 도구를 <b>토크나이저</b>라고 해요.',
        '어떻게 자르는지는 모델마다 달라요. 그림은 이해를 돕는 한 가지 예예요. 자주 나오는 말은 한 조각이 되고, 드문 말은 여러 조각으로 쪼개지는 식이에요.',
        '그래서 <b>글자 수와 토큰 수는 같지 않아요</b>. 같은 뜻이라도 한국어와 영어의 토큰 수가 다를 수 있어요. 짐작하지 말고, 응답의 <code>usage</code>에 찍힌 숫자로 확인해요.'
      ]},
      { t: 'say', h: '다음 조각마다 확률이 매겨져요', fig: 'probBars', p: [
        '"for 문은 같은 일을" 다음 조각을 맞힌다고 해 봐요. 모델은 하나만 떠올리지 않고, 후보마다 <b>확률</b>을 매겨요. "반복" 72%, "여러" 15%, "계속" 9%처럼요.',
        '후보 전체의 확률을 더하면 100%예요. 이렇게 후보마다 확률을 나눠 준 것을 <b>확률 분포</b>라고 해요.',
        '이 확률은 학습 때 읽은 아주 많은 글에서 "이런 글 다음엔 보통 이런 말이 왔다"는 경향을 익힌 결과예요. 그림의 숫자는 설명을 위해 지어낸 예예요.'
      ]},
      { t: 'say', h: '하나 고르고, 붙이고, 다시 맞혀요', fig: 'loopWrite', p: [
        '후보 중 하나를 고르면 글 뒤에 붙여요. 그리고 <b>늘어난 글 전체</b>를 보고 다시 다음 조각을 맞혀요. 답은 이 되풀이로 한 조각씩 자라요.',
        '끝을 뜻하는 조각이 나오거나, 만들 수 있는 토큰 수(<code>max_tokens</code>, 레슨 3)에 닿으면 멈춰요.',
        '답이 길수록 되풀이도 많아서 시간이 더 걸려요. 채팅 화면에 글이 조금씩 흘러나오는 것도, 만들어지는 대로 보여 주기 때문이에요(스트리밍은 이 과정 단원 3에서).'
      ]},
      { t: 'say', h: '토큰은 곧 돈이고 시간이에요', fig: 'tokenCost', p: [
        '업스테이지 API는 <b>토큰 수로 값을 매겨요</b>. 내가 보낸 글(입력)과 모델이 만든 글(출력)을 따로 세고, 응답의 <code>usage</code>에 둘 다 찍혀 와요.',
        '정가로는 출력이 입력보다 4배 비싸요(지금은 할인 행사 중이라 실제로는 더 쌀 수 있어요). 그래서 "길게 써 줘"보다 "세 문장으로"가 돈도 시간도 아껴요.'
      ], table: { head: ['100만 토큰당', '<code>solar-pro4</code>', '<code>solar-mini4</code>'], rows: [
        ['입력(보낸 글)', '$0.30', '$0.10'],
        ['출력(만든 글)', '$1.20', '$0.40'] ] },
        code: { lang: 'json', src: src(['"usage": {', '  "prompt_tokens": 25,', '  "completion_tokens": 8,', '  "total_tokens": 33', '}']) },
        tip: '어림 예: 학생 30명 × 질문 10개 × (입력 2천 + 출력 3백 토큰) ≈ 입력 60만·출력 9만 토큰 ≈ <code>solar-pro4</code>로 약 $0.29예요(정가 기준, 부가세 별도). 할인 행사 중엔 더 쌀 수 있고 가격은 바뀌니, 수업 전에 업스테이지 가격 페이지를 확인해요.' },
      { t: 'q', kind: 'mc', fig: 'q_howAnswer', q: '<code>solar-pro4</code>가 답을 만드는 방식을 가장 정확하게 말한 것은?',
        opts: ['질문과 같은 글을 인터넷에서 검색해 찾아서 그대로 옮겨 온다', '앞의 글을 보고 다음 토큰을 하나씩 골라 이어 붙인다', '답 전체를 먼저 다 정해 두고 한 번에 꺼낸다', '학습 때 외운 문답표에서 같은 질문을 찾아 꺼낸다'], a: 1,
        why: 'LLM은 지금까지의 글을 보고 다음 토큰 후보마다 확률을 매기고, 하나 골라 붙이고, 다시 맞히기를 되풀이해요.',
        ex: ['검색해서 옮기는 게 아니에요. 글을 한 조각씩 새로 만들어요. 그래서 세상에 없던 문장도 나와요.', '', '한 조각씩 만들어요. 앞에서 고른 조각이 다음 조각에 영향을 줘요.', '문답표를 찾는 게 아니에요. 처음 보는 질문에도 그럴듯한 다음 조각을 예측해요.'] },
      { t: 'q', kind: 'order', fig: 'q_stepOrder', q: '모델이 답의 다음 조각 하나를 만드는 순서로 쌓아 보세요.',
        items: ['지금까지의 글을 토큰으로 자른다', '다음 토큰 후보마다 확률을 매긴다', '확률에 따라 토큰 하나를 고른다', '고른 토큰을 글 뒤에 붙인다'],
        why: '조각으로 잘라야 읽을 수 있고, 확률을 매겨야 고를 수 있고, 골라야 붙일 수 있어요. 붙인 뒤에는 늘어난 글로 이 순서를 다시 되풀이해요.' },
      { t: 'q', kind: 'mc', fig: 'q_count', q: '학습지 글 1,000자를 보내려 해요. 몇 토큰인지 가장 정확히 아는 방법은?',
        opts: ['글자 수가 곧 토큰 수라서 1,000토큰이다', '한국어는 늘 두 글자가 1토큰이라 500토큰이다', '띄어쓰기로 나눈 낱말 수가 곧 토큰 수다', '한 번 보내 보고 응답의 usage에서 확인한다'], a: 3,
        why: '토큰을 자르는 방식은 모델마다 달라서 글자 수로 정확히 알 수 없어요. 응답의 <code>usage.prompt_tokens</code>에 보낸 토큰 수가 찍혀요.',
        ex: ['글자 수와 토큰 수는 같지 않아요. 한 글자가 여러 조각일 수도, 여러 글자가 한 조각일 수도 있어요.', '그런 고정 비율은 없어요. 자르는 방식은 모델마다 달라요.', '낱말과 토큰은 달라요. 긴 낱말은 여러 조각으로 쪼개지기도 해요.', ''] },
      { t: 'q', kind: 'blank', fig: 'q_usageBlank', q: '응답에서 모델이 <b>만든</b> 토큰 수를 보려 해요. 빈칸에 들어갈 이름은?', lang: 'py',
        code: src(['u = resp.usage', 'print(u.prompt_tokens)  # 보낸 글', 'print(u.[[1]])  # 만든 글']),
        opts: ['total_tokens', 'max_tokens', 'completion_tokens', 'reasoning_effort'], a: 2,
        why: '<code>prompt_tokens</code>는 보낸 글(입력), <code>completion_tokens</code>는 만든 글(출력), <code>total_tokens</code>는 둘을 더한 값이에요.',
        ex: ['total_tokens는 입력과 출력을 더한 값이에요.', 'max_tokens는 응답이 아니라 요청에 적는 상한이에요.', '', 'reasoning_effort는 요청에 적는 추론 설정이에요. usage에 찍히는 숫자가 아니에요.'] },
      { t: 'q', kind: 'mc', fig: 'q_inOut', q: '<code>solar-pro4</code> 정가로, 같은 1,000토큰이라도 값이 더 비싼 쪽은?',
        opts: ['모델이 만든 답(출력) 1,000토큰', '내가 보낸 글(입력) 1,000토큰', '입력과 출력은 늘 같은 값이다', '토큰과 상관없이 요청 한 번에 값이 정해진다'], a: 0,
        why: '100만 토큰당 입력 $0.30, 출력 $1.20이라 출력이 4배 비싸요(정가 기준). 답을 짧게 받으면 돈과 시간이 함께 줄어요.',
        ex: ['', '입력은 출력의 4분의 1 값이에요.', '입력과 출력을 따로 세고 값도 달라요.', '값은 토큰 수로 매겨요. 요청 횟수가 같아도 글 길이에 따라 달라요.'] },
      { t: 'sum', pts: ['LLM은 지금까지의 글을 보고 다음 토큰을 예측한다. 후보마다 확률을 매기고, 하나 골라 붙이고, 다시 맞히기를 되풀이한다.', '토큰은 모델이 다루는 글 조각. 자르는 방식이 모델마다 달라 글자 수와 토큰 수가 다르다. 정확한 수는 usage로 확인한다.', '값은 토큰 수로 매기고 입력·출력을 따로 센다. 지금 solar-pro4는 출력이 입력의 4배. 답이 길수록 느리고 비싸다.'] }
    ]},

    /* =================== L2 =================== */
    { id: 'L2', type: 'lesson', title: '메시지와 역할, 컨텍스트', sub: 'system·user·assistant, 기억하지 않는 API, 512K 책상', min: 9, steps: [
      { t: 'say', h: '메시지는 역할이 붙은 상자예요', fig: 'roleBoxes', p: [
        'Solar에 보내는 요청의 중심은 <code>messages</code>예요. 글 상자 여러 개를 차례로 담은 목록이고, 상자마다 <b>역할</b>(<code>role</code>)이 붙어요.',
        '<code>system</code>은 모델이 지킬 규칙과 역할, <code>user</code>는 사용자의 말, <code>assistant</code>는 모델이 앞서 한 답이에요. 코딩한입에서 배운 "역할·맥락·형식 주기"는 주로 system에 들어가요. 도구 결과를 담는 <code>tool</code> 역할은 과정 5에서 만나요.',
        '모델 쪽에서 보면 이 상자들을 차례로 이은 긴 글이 "지금까지의 글"이에요. 그 뒤에 올 assistant의 말을 다음 토큰 맞히기로 써 내려가요.'
      ], code: { lang: 'py', src: src(['msgs = [', '  {"role": "system",', '   "content": "너는 정보 선생님이야."},', '  {"role": "user",', '   "content": "변수가 뭐예요?"},', ']']) } },
      { t: 'say', h: 'API는 지난 대화를 기억하지 않아요', fig: 'noMemory', p: [
        'API는 요청 하나하나를 따로 처리해요. 앞 요청에서 무슨 말이 오갔는지 <b>기억하지 않아요</b>. 요청마다 처음 만나는 셈이에요.',
        '그래서 대화를 이어 가려면 <b>지난 대화를 매번 통째로 다시 보내요</b>. 앞 질문(user)과 앞 답(assistant)을 messages에 차례로 붙이고, 새 질문을 맨 끝에 더해요.',
        '웹 채팅 서비스가 대화를 기억하는 것처럼 보이는 것도 화면 뒤에서 이 일을 대신 해 주기 때문이에요. 내 도구를 만들 땐 내 코드가 해요(이 과정 단원 3).'
      ], code: { lang: 'py', src: src(['msgs.append({', '    "role": "assistant",', '    "content": "값을 담는 이름표예요."})', 'msgs.append({', '    "role": "user",', '    "content": "예를 들어 줘요."})']) } },
      { t: 'say', h: '컨텍스트 창은 한 번에 펼치는 책상이에요', fig: 'contextWindow', p: [
        '모델이 한 요청에서 볼 수 있는 토큰의 한도를 <b>컨텍스트 창</b>(context window)이라고 해요. 보낸 messages 전체와 새로 만들 답이 모두 이 책상 위에 올라가야 해요.',
        '지금 <code>solar-pro4</code>와 <code>solar-mini4</code>의 컨텍스트는 <b>512K</b>(50만 토큰이 넘는 양)예요. 공식 쿡북 표에도 "입력 토큰 + <code>max_tokens</code>가 컨텍스트 길이 안에 있어야 한다"고 적혀 있어요.',
        '책상이 넓어서 긴 수업자료도 꽤 올릴 수 있어요. 하지만 책상에 올린 것은 <b>이번 요청에서만</b> 보여요. 모델이 배운 것(학습 데이터)이 늘어나는 게 아니에요.'
      ]},
      { t: 'say', h: '책상에 많이 올릴수록 돈과 시간이 들어요', fig: 'longCost', p: [
        '입력 토큰도 값을 내요. 대화를 이어 갈 때는 지난 대화를 매번 다시 보내니, <b>열 번째 질문 때는 앞의 아홉 번 문답이 함께 실려 가요</b>.',
        '그래서 대화가 길어질수록 요청 하나가 무거워지고 답도 늦어져요. 512K까지 된다고 다 올리는 게 좋은 건 아니에요.',
        '수업 도구에서는 오래된 대화를 잘라 내고, 필요한 자료만 골라 넣어요. 자료를 골라 넣는 방법이 과정 2·3에서 만들 검색과 RAG예요.'
      ]},
      { t: 'sim', h: '기억 실험을 돌려 봐요', p: 'IDE 터미널에서 두 파일을 실행해 봐요. 칸을 누르면 명령이 저절로 쳐져요. 파일은 이 과정 단원 3에서 직접 만들 수 있고, 실제 답의 말투는 다를 수 있어요.',
        scene: { win: 'ide', folder: 'upstage-lab', files: ['.env', '.gitignore', 'memory_test.py', 'memory_fix.py'], open: 'memory_test.py', lang: 'py', code: MEM, term: [] },
        steps: [
          { goal: '<code>memory_test.py</code>를 실행해요', type: 'python memory_test.py', into: 'term', then: { term: MEM_OUT, prompt: '' },
            say: '두 번째 요청에는 첫 대화가 들어 있지 않았어요. 모델은 그 요청에 담긴 messages만 봐요.' },
          { goal: '<code>memory_fix.py</code>를 열어요', click: 'file:memory_fix.py', then: { open: 'memory_fix.py', code: MEM_FIX },
            say: '첫 질문과 답을 messages에 붙인 뒤 두 번째 질문을 더해 <b>한 요청</b>으로 보내요.' },
          { goal: '<code>memory_fix.py</code>를 실행해요', type: 'python memory_fix.py', into: 'term', then: { term: MEM_OUT.concat(['$ python memory_fix.py', '하늘 선생님이라고 하셨어요.']), prompt: '' },
            say: '이번엔 알아요. 기억한 게 아니라, 이번 요청 안에 앞 대화가 들어 있어서 읽은 거예요.' } ],
        end: 'API는 기억하지 않아요. 이어 가려면 지난 대화를 함께 보내요.' },
      { t: 'q', kind: 'mc', fig: 'q_forget', q: '첫 요청에 "나는 하늘이야", 두 번째 요청에 "내 이름이 뭐였지?"만 보냈더니 모른대요. 왜일까요?',
        opts: ['solar-pro4는 한국어 이름을 다루지 못하게 막혀 있다', 'temperature가 높아서 이름을 잊어버렸다', 'API는 요청마다 따로라서 두 번째 요청엔 첫 대화가 없었다', '첫 요청의 답을 print하지 않아서 저장이 안 됐다'], a: 2,
        why: '두 요청은 서로 모르는 사이예요. 두 번째 요청의 messages에는 "내 이름이 뭐였지?"만 있었으니 이름을 알 길이 없어요.',
        ex: ['이름을 막는 규칙이 아니에요. 같은 요청 안에 넣으면 잘 알아요.', 'temperature는 다음 토큰을 뽑는 방식이에요. 기억과는 상관없어요.', '', 'print는 화면에 찍을 뿐이에요. 모델에 다시 보내려면 messages에 붙여야 해요.'] },
      { t: 'q', kind: 'blank', fig: 'q_roleBlank', q: '앞 대화를 이어 보내려 해요. 모델이 앞서 한 답을 넣는 상자의 역할은?', lang: 'py',
        code: src(['msgs.append({', '    "role": "[[1]]",', '    "content": prev_answer})']),
        opts: ['system', 'assistant', 'user', 'tool'], a: 1,
        why: '모델이 한 말은 <code>assistant</code>예요. 앞 질문은 user, 앞 답은 assistant로 차례를 지켜 붙여요.',
        ex: ['system은 규칙과 역할을 주는 상자예요. 앞 답을 넣는 곳이 아니에요.', '', 'user는 사용자의 말이에요. 모델의 답을 user로 넣으면 학생이 한 말로 읽혀요.', 'tool은 도구를 실행한 결과를 돌려줄 때 써요(과정 5).'] },
      { t: 'q', kind: 'mc', fig: 'q_desk', q: '<code>solar-pro4</code>의 컨텍스트가 512K라는 말을 바르게 이해한 것은?',
        opts: ['512K 토큰까지 보낸 글은 모델이 다음 요청에서도 계속 기억해 준다', '512K는 하루에 쓸 수 있는 토큰 한도다', '512K는 학습 데이터의 크기라서 내 요청과 상관없다', '한 요청에서 보낸 글과 만들 답이 함께 들어가는 한도다'], a: 3,
        why: '컨텍스트 창은 한 요청의 책상 크기예요. 입력 토큰과 <code>max_tokens</code>를 더해 그 안에 들어가야 해요.',
        ex: ['한 요청 안에서만 봐요. 다음 요청엔 다시 보내야 해요.', '하루 한도가 아니에요. 사용량 제한은 분당 요청 수·토큰 수(속도 제한)로 따로 있어요.', '학습 데이터 크기가 아니라 한 요청의 책상 크기예요.', ''] },
      { t: 'sum', pts: ['messages는 역할이 붙은 상자 목록. system(규칙)·user(사용자 말)·assistant(앞선 답)를 차례로 담는다.', 'API는 기억하지 않는다. 대화를 이으려면 앞 질문과 답을 messages에 붙여 매번 다시 보낸다.', '컨텍스트 창은 한 요청의 책상 크기(solar-pro4 512K). 입력 + max_tokens가 그 안에 들어가야 하고, 많이 올릴수록 비싸고 느리다.'] }
    ]},

    /* =================== QA =================== */
    { id: 'QA', type: 'quiz', title: '헷갈림 퀴즈 ①', sub: '토큰과 글자, system과 user, 컨텍스트 창과 학습 데이터', min: 3, steps: [
      { t: 'q', kind: 'mc', fig: 'qa_tokChar', q: '"반복문"이라는 세 글자에 대한 설명으로 맞는 것은?',
        opts: ['모델의 토크나이저가 자르는 방식에 달렸다', '글자가 셋이니 어느 모델에서든 언제나 3토큰이다', '한국어 낱말은 길이와 상관없이 늘 1토큰이다', '띄어쓰기가 없으니 토큰으로 세지 않는다'], a: 0,
        why: '토큰은 모델이 정한 조각이라, 같은 글도 모델마다 토큰 수가 다를 수 있어요. 정확한 수는 응답의 <code>usage</code>로 봐요.',
        ex: ['', '글자 수와 토큰 수는 달라요. 모델에 따라 한 조각일 수도, 여러 조각일 수도 있어요.', '그런 규칙은 없어요. 드문 낱말은 여러 조각으로 쪼개지기도 해요.', '띄어쓰기가 없어도 글은 모두 토큰으로 잘리고 값이 매겨져요.'] },
      { t: 'q', kind: 'mc', fig: 'qa_sysUser', q: '수업 챗봇이 어떤 질문이든 "중학생 눈높이로, 세 문장 이내"로 답하게 하고 싶어요. 이 지시는 어느 상자에 넣는 게 알맞을까요?',
        opts: ['user: 학생 질문마다 끝에 덧붙인다', 'assistant: 모델이 했던 말인 것처럼 넣는다', 'system: 늘 지킬 규칙으로 맨 앞에 둔다', '어느 상자든 같으니 아무 데나 넣는다'], a: 2,
        why: '대화 내내 지킬 규칙과 역할은 <code>system</code>에 둬요. 학생의 말은 user, 모델의 앞선 답은 assistant예요.',
        ex: ['되긴 하지만 학생 질문과 섞여서 규칙인지 질문인지 흐려져요. 늘 지킬 규칙은 system이에요.', 'assistant는 모델이 앞서 한 답이에요. 규칙을 넣는 곳이 아니에요.', '', '역할마다 모델이 읽는 뜻이 달라요. 규칙은 system, 질문은 user예요.'] },
      { t: 'q', kind: 'mc', fig: 'qa_ctxTrain', q: '수업자료 글을 messages에 넣어 보냈더니 그 내용으로 잘 답했어요. 다음 날 자료 없이 같은 질문만 보내면?',
        opts: ['어제 넣은 자료가 학습 데이터에 더해져 그대로 잘 답한다', '어제 자료는 그 요청의 컨텍스트에만 있었으니 다시 넣어야 한다', '512K 안의 자료는 한 달 동안 모델이 기억해 준다', '같은 API 키로 보내면 어제 자료를 저절로 붙여 준다'], a: 1,
        why: '요청에 넣은 자료는 그 요청의 책상(컨텍스트)에만 올라가요. 모델의 학습 데이터는 바뀌지 않으니, 필요할 때마다 자료를 다시 넣어요.',
        ex: ['요청에 넣은 글로 모델이 그 자리에서 다시 배우지는 않아요. 학습 데이터는 그대로예요.', '', 'API는 대화나 자료를 기억해 두지 않아요. 512K는 한 요청의 한도예요.', 'API 키는 누가 부르는지 확인할 뿐, 자료를 붙여 주지 않아요.'] }
    ]},

    /* =================== L3 =================== */
    { id: 'L3', type: 'lesson', title: 'temperature·top_p·max_tokens', sub: '확률대로 뽑기, 뾰족하게·평평하게, 잘린 답', min: 12, steps: [
      { t: 'say', h: '확률대로 뽑아서 답이 매번 달라요', fig: 'sampling', p: [
        '모델은 늘 1등 후보만 고르지 않아요. 확률 분포에 따라 <b>뽑아요</b>. 이걸 <b>표집</b>(샘플링, sampling)이라고 해요. 72%짜리가 자주 뽑히지만 15%짜리도 가끔 뽑혀요.',
        '한 조각이 다르게 뽑히면 그 뒤의 글이 모두 달라져요. 그래서 같은 질문에도 답이 매번 조금씩 달라요. 고장이 아니라 원래 그래요.',
        '이 뽑는 방식을 조절하는 매개변수가 <code>temperature</code>와 <code>top_p</code>예요.'
      ]},
      { t: 'say', h: 'temperature는 확률 막대를 뾰족하게도, 평평하게도 해요', fig: 'tempBars', p: [
        '<code>temperature</code>는 0~2, <code>solar-pro4</code>의 기본값은 1.0이에요. 공식 쿡북은 <b>낮으면(0.2 이하) 일정하게, 높으면(0.8 이상) 더 무작위로</b> 나온다고 설명해요.',
        '속에서는 보통 후보마다의 점수(<b>logit</b>)를 temperature로 나눈 뒤 확률로 바꿔요. 작은 수로 나누면 점수 차이가 커져 1등에게 몰리고(뾰족), 큰 수로 나누면 차이가 줄어 고르게 퍼져요(평평).',
        '낮춘다고 늘 글자 하나까지 같은 답이 보장되지는 않아요. "거의 같은 답"이 필요할 때 낮춰요.'
      ]},
      { t: 'try', lang: 'py', h: '점수를 temperature로 나눠 봐요', p: '세 후보의 점수를 temperature 0.2, 1.0, 1.5로 나눈 뒤 확률(%)로 바꿔요. 실행한 뒤 <code>scores</code>나 temperature 목록을 바꿔 다시 돌려 보세요.',
        src: src(['import math', '', 'words = ["반복", "여러", "계속"]', 'scores = [2.0, 1.0, 0.5]  # 점수(logit)', '', 'for t in [0.2, 1.0, 1.5]:', '    e = [math.exp(s / t) for s in scores]', '    total = sum(e)', '    print(f"temperature {t}")', '    for w, x in zip(words, e):', '        p = round(x / total * 100)', '        print(f"  {w} {\'#\' * (p // 5)} {p}%")']),
        note: '<code>math.exp(x)</code>는 e의 x제곱(<code>math.e ** x</code>)이에요. 0.2에서 1등이 99%로 몰리는지, 1.5에서 막대가 고르게 퍼지는지 보세요.' },
      { t: 'say', h: 'top_p는 위쪽 후보만 남기고 잘라요', fig: 'topP', p: [
        '<code>top_p</code>는 0~1, 기본값 1.0이에요. 후보를 확률 높은 순으로 줄 세우고, 위에서부터 확률을 더해 <code>top_p</code>에 닿을 때까지만 남겨요. 공식 쿡북의 예로 0.1이면 위쪽 10%를 이루는 후보만 봐요.',
        '1.0이면 아무것도 자르지 않아요. 낮출수록 확률이 낮은 엉뚱한 후보가 빠져요.',
        '공식 쿡북은 <b>temperature와 top_p 중 하나만 조절</b>하는 게 보통이라고 해요. 둘을 한꺼번에 바꾸면 무엇 때문에 달라졌는지 알기 어려워요.'
      ]},
      { t: 'say', h: 'max_tokens에 닿으면 답이 잘려요', fig: 'maxTokens', p: [
        '<code>max_tokens</code>는 모델이 <b>만들 수 있는 토큰의 상한</b>이에요. 답이 끝나기 전에 여기에 닿으면 문장 중간에서 멈춰요.',
        '그때 응답의 <code>finish_reason</code>이 <code>"length"</code>로 와요. 끝까지 잘 끝났으면 <code>"stop"</code>이에요. 답이 이상하게 끊겼다면 이것부터 봐요.',
        'max_tokens는 비용의 안전띠이기도 해요. 학생이 "만 자로 써 줘"라고 해도 상한을 넘겨 만들지 않아요.'
      ], code: { lang: 'py', src: src(['c = resp.choices[0]', 'if c.finish_reason == "length":', '    print("잘렸어요! max_tokens 확인")']) } },
      { t: 'say', h: '수업에서는 일에 맞춰 골라요', fig: 'classUse', p: [
        '채점·추출·분류처럼 <b>답이 하나로 정해진 일</b>은 낮게, 아이디어 내기처럼 <b>여러 갈래가 좋은 일</b>은 높게 둬요.',
        '높이면 다양해지는 대신 확률 낮은 엉뚱한 조각이 뽑힐 가능성도 커져요. 학생에게 바로 보여 줄 답이라면 너무 높이지 않아요.'
      ], table: { head: ['수업 일', 'temperature', '까닭'], rows: [
        ['파이썬 과제 채점, 정답 뽑기', '낮게(0.2 이하)', '같은 답안엔 같은 판정'],
        ['퀴즈 아이디어, 이야기 예시', '높게(0.8 이상)', '여러 가지가 나와야 좋음'],
        ['잘 모르겠을 때', '기본 1.0에서 시작', '하나씩 바꿔 비교'] ] } },
      { t: 'sim', h: '같은 질문을 temperature만 바꿔 세 번씩', p: 'IDE 터미널에서 같은 질문을 temperature 0.2와 1.5로 세 번씩 보내는 장면이에요. 실제 답의 문장은 다를 수 있어요.',
        scene: { win: 'ide', folder: 'upstage-lab', files: ['.env', '.gitignore', 'temp_test.py'], term: [] },
        steps: [
          { goal: '<code>temp_test.py</code>를 열어요', click: 'file:temp_test.py', then: { open: 'temp_test.py', lang: 'py', code: TEMP },
            say: '같은 질문을 세 번 보내요. 명령 뒤에 적은 숫자가 temperature로 들어가고, 추론은 꺼 뒀어요.' },
          { goal: 'temperature 0.2로 실행해요', type: 'python temp_test.py 0.2', into: 'term', then: { term: LOW_OUT, prompt: '' },
            say: '세 답이 거의 같아요. 1등 후보에게 확률이 몰려서예요.' },
          { goal: 'temperature 1.5로 실행해요', type: 'python temp_test.py 1.5', into: 'term', then: { term: LOW_OUT.concat(HIGH_OUT), prompt: '' },
            say: '사물함, 칠판, 메모지… 비유가 매번 달라졌어요. 확률 막대가 평평해져 다른 후보도 자주 뽑혀요.' } ],
        end: '채점엔 낮게, 아이디어엔 높게.' },
      { t: 'q', kind: 'mc', fig: 'q_flatPeak', q: 'temperature를 0.2에서 1.5로 올리면 다음 토큰 확률 막대는 어떻게 바뀔까요?',
        opts: ['1등 막대가 더 길어져 뾰족해진다', '후보가 하나만 남고 나머지는 사라진다', '막대 모양은 그대로이고 답만 길어진다', '막대 높이가 서로 비슷해져 평평해진다'], a: 3,
        why: '점수를 큰 수로 나누면 차이가 줄어 확률이 고르게 퍼져요. 연습장에서 1등이 99%에서 53%로 내려간 것처럼요.',
        ex: ['그건 temperature를 낮출 때예요.', '후보를 잘라 내는 건 top_p예요. temperature는 막대 높이를 바꿔요.', '답 길이는 max_tokens와 내용에 달렸어요. temperature는 확률 모양을 바꿔요.', ''] },
      { t: 'q', kind: 'mc', fig: 'q_gradeTemp', q: '학생 50명의 파이썬 과제를 "통과/다시"로 판정하게 하려 해요. temperature로 알맞은 것은?',
        opts: ['0.2 이하: 같은 답안에 같은 판정이 나오게', '1.5: 여러 관점으로 꼼꼼히 보게', '2.0: 가장 높여야 실수가 줄어든다', '아무 값이나: temperature는 판정과 상관없다'], a: 0,
        why: '정해진 판정은 일정함이 먼저예요. 낮은 temperature로 같은 답안에 같은 판정이 나오게 해요(공식 쿡북도 추출·분류엔 낮게를 권해요).',
        ex: ['', '높이면 같은 답안에도 판정이 흔들릴 수 있어요. 꼼꼼함과는 다른 이야기예요.', '높을수록 더 무작위로 뽑아요. 실수가 줄지 않아요.', '확률대로 뽑는 방식이 바뀌니 판정도 흔들릴 수 있어요.'] },
      { t: 'q', kind: 'blank', fig: 'q_cut', q: '답이 문장 중간에서 끊겼는지 확인하는 코드예요. 빈칸에 들어갈 값은?', lang: 'py',
        code: src(['c = resp.choices[0]', 'if c.finish_reason == "[[1]]":', '    print("잘렸어요!")']),
        opts: ['stop', 'length', 'tool_calls', 'max_tokens'], a: 1,
        why: 'max_tokens에 닿아 멈추면 <code>finish_reason</code>이 <code>"length"</code>예요. 잘 끝나면 <code>"stop"</code>이에요.',
        ex: ['"stop"은 끝까지 잘 끝났다는 뜻이에요.', '', '"tool_calls"는 도구를 부르려고 멈췄을 때예요(과정 5).', 'max_tokens는 요청에 적는 매개변수 이름이에요. 이때 finish_reason 값은 "length"예요.'] },
      { t: 'q', kind: 'mc', fig: 'q_topp', q: '<code>top_p=0.1</code>로 보냈어요. 무슨 뜻일까요?',
        opts: ['답을 10% 길이로 줄인다', '후보 10개 중에서만 뽑는다', '확률 위쪽 10%를 이루는 후보 안에서만 뽑는다', '열 번에 한 번만 무작위로 뽑는다'], a: 2,
        why: '확률 높은 순으로 줄 세워 위에서부터 더해 0.1에 닿을 때까지만 남겨요. 그 안에서만 뽑으니 아주 일정해져요.',
        ex: ['길이는 max_tokens가 정해요.', '개수가 아니라 확률을 더한 양으로 잘라요.', '', '횟수가 아니라 어떤 후보를 남길지 정하는 값이에요.'] },
      { t: 'sum', pts: ['모델은 확률대로 다음 토큰을 뽑는다(표집). 그래서 같은 질문에도 답이 달라질 수 있다.', 'temperature(0~2, 기본 1.0)는 낮으면 뾰족·일정, 높으면 평평·다양. top_p(0~1, 기본 1.0)는 위쪽 후보만 남긴다. 둘 중 하나만 조절한다.', 'max_tokens에 닿으면 답이 잘리고 finish_reason이 "length". 채점·추출은 낮게, 아이디어는 높게.'] }
    ]},

    /* =================== L4 =================== */
    { id: 'L4', type: 'lesson', title: '추론(reasoning) 모드', sub: 'reasoning_effort 값, max_tokens 안의 추론 토큰, 늘 직접 적기', min: 10, steps: [
      { t: 'say', h: '추론을 켜면 답 앞에 풀이 글을 먼저 써요', fig: 'thinkFirst', p: [
        '<code>solar-pro4</code>에는 <b>추론 모드</b>가 있어요. 켜면 답(<code>content</code>)을 쓰기 전에 풀이 과정 같은 글을 먼저 토큰으로 만들어요. 이 글을 <b>추론</b>(reasoning)이라고 불러요.',
        '추론 글도 다음 토큰 맞히기로 만들어져요. 다만 중간 단계를 글로 먼저 늘어놓고 그걸 읽으며 답을 이어 쓰니, 여러 단계가 필요한 문제에서 도움이 될 때가 있어요.',
        '응답에서 추론 글은 <code>message.reasoning</code>, 추론에 쓴 토큰 수는 <code>usage.completion_tokens_details.reasoning_tokens</code>에 와요.'
      ]},
      { t: 'say', h: 'reasoning_effort: 끄는 값 둘, 켜는 값 다섯', fig: 'effortScale', p: [
        '추론은 <code>reasoning_effort</code>로 정해요. <code>solar-pro4</code> 공식 쿡북(2026년 8월)에 적힌 값은 일곱 가지예요.',
        '쿡북의 권장은 이래요. 정해진 추출·분류에는 낮은 temperature와 <code>"none"</code>(또는 <code>"minimal"</code>), 어려운 여러 단계 문제에는 <code>"high"</code> 이상과 넉넉한 <code>max_tokens</code>.'
      ], table: { head: ['값', '추론'], rows: [
        ['<code>"none"</code>, <code>"minimal"</code>', '꺼요'],
        ['<code>"low"</code>, <code>"medium"</code>', '켜요'],
        ['<code>"high"</code>, <code>"xhigh"</code>, <code>"max"</code>', '켜요(뒤로 갈수록 더 많이)'] ] } },
      { t: 'say', h: '추론 토큰도 max_tokens 안에서 써요', fig: 'budget', p: [
        '추론 글도 모델이 만든 토큰이라 <code>max_tokens</code> 한도 안에서 써요. 추론이 먼저 자리를 차지하고, <b>남은 자리에 답</b>이 들어가요.',
        '그래서 추론을 켰는데 max_tokens가 작으면 추론만 하다 끝나요. 이때 답 <code>content</code>는 <b><code>None</code>(값 없음)</b>으로 오고 <code>finish_reason</code>은 <code>"length"</code>예요. 공식 문서도 이 경우를 따로 경고해요.',
        '추론 토큰은 <code>completion_tokens</code>에 함께 세져요. 화면에 안 보여도 모델이 만든 토큰이라 그만큼 사용량이 늘어요.'
      ], code: { lang: 'json', src: src(['"message": { "content": null },', '"finish_reason": "length",', '"usage": {', '  "completion_tokens": 100,', '  "completion_tokens_details": {', '    "reasoning_tokens": 100', '  }', '}']) } },
      { t: 'say', h: '켜면 느려지고 비싸져요: 공식 쿡북의 실험', fig: 'cookbookRace', p: [
        '공식 쿡북은 <b>같은 계산 문제</b>를 추론을 끄고(<code>"none"</code>) 한 번, 켜고(<code>"high"</code>) 한 번 보내 비교했어요.',
        '켜니 정답을 맞혔지만 시간은 15배쯤, 토큰은 12배 가까이 들었어요. 쿡북도 높은 effort는 토큰·시간·비용을 늘리고 <b>더 좋은 답을 보장하지 않는다</b>고 적어 두었어요.'
      ], table: { head: ['', '<code>"none"</code>', '<code>"high"</code>'], rows: [
        ['걸린 시간', '0.86초', '12.85초'],
        ['토큰', '전체 119', '추론 1,274 · 전체 1,392'],
        ['답', '틀림', '맞음'] ] } },
      { t: 'say', h: '안 적으면 꺼져요. 그래도 늘 직접 적어요', fig: 'alwaysWrite', p: [
        '<code>reasoning_effort</code>를 안 적거나 <code>null</code>로 보내면 <code>solar-pro4</code>·<code>solar-mini4</code> 모두 <b>추론이 꺼져요</b>(공식 reasoning 문서). 켜려면 <code>"low"</code>~<code>"max"</code> 가운데 하나를 적어야 해요.',
        '그래도 이 앱의 규칙은 하나예요. <b><code>reasoning_effort</code>를 늘 직접 적어요.</b> 코드만 읽어도 추론을 켰는지 껐는지 의도가 드러나고, 모델이나 기본값이 바뀌어도 내가 정한 대로 움직여요.',
        '수업 도구 대부분(채점·추출·짧은 설명)은 <code>"none"</code>으로 시작하고, 정말 여러 단계가 필요한 일만 켜서 결과와 시간을 비교해요.'
      ], code: { lang: 'py', src: src(['MODEL = "solar-pro4"', 'resp = client.chat.completions.create(', '    model=MODEL,', '    messages=msgs,', '    reasoning_effort="none",', ')']) },
        tip: '연수장에서 옆 사람과 속도·결과가 다르면 <code>reasoning_effort</code> 값부터 비교해요. 곧 끝나는 옛 <code>solar-mini</code>는 이 값을 아예 받지 않아 400 오류가 나요.' },
      { t: 'q', kind: 'blank', fig: 'q_effortBlank', q: '수업 공지 글에서 날짜만 뽑는 정해진 일이에요. 공식 쿡북 권장에 맞게 빈칸을 채우면?', lang: 'py',
        code: src(['resp = client.chat.completions.create(', '    model=MODEL, messages=msgs,', '    temperature=0.1,', '    reasoning_effort="[[1]]")']),
        opts: ['high', 'max', 'none', 'xhigh'], a: 2,
        why: '정해진 추출·분류는 낮은 temperature와 추론 끄기(<code>"none"</code>)가 쿡북의 권장이에요. 빠르고 토큰도 적게 들어요.',
        ex: ['"high"는 어려운 여러 단계 문제에 쓰는 값이에요. 날짜 뽑기엔 느리고 비싸기만 해요.', '"max"는 추론을 가장 많이 하는 쪽이에요. 정해진 추출엔 맞지 않아요.', '', '"xhigh"도 추론을 많이 켜는 값이에요.'] },
      { t: 'q', kind: 'mc', fig: 'q_emptyAns', q: '<code>reasoning_effort="high"</code>, <code>max_tokens=50</code>으로 보냈더니 <code>content</code>가 <code>None</code>이에요. 왜일까요?',
        opts: ['추론 토큰이 50개를 먼저 다 써서 답 자리가 없었다', 'high에서는 답이 늘 reasoning에만 담긴다', '크레딧이 다 떨어져 답이 지워졌다', 'temperature를 안 적어서 답을 고르지 못했다'], a: 0,
        why: '추론 토큰도 max_tokens 안에서 써요. 50개를 추론이 다 쓰면 답 자리가 남지 않아요. 추론이 필요하면 max_tokens를 넉넉히, 아니면 <code>"none"</code>으로 꺼요.',
        ex: ['', 'reasoning은 추론 글이고 답은 content예요. 자리가 넉넉하면 답도 content에 와요.', '크레딧이 모자라면 401·403 오류가 나요. 응답 자체가 오지 않아요.', 'temperature를 안 적으면 기본 1.0으로 뽑아요. 빈 답의 까닭이 아니에요.'] },
      { t: 'q', kind: 'mc', fig: 'q_whenOn', q: '추론을 켜서(<code>"high"</code>) 시간과 결과를 비교해 볼 만한 일은?',
        opts: ['학생 질문이 수업 질문인지 잡담인지 둘 중 하나로 나누기', '여러 단계로 풀어야 하는 알고리즘 문제의 풀이 검토하기', '공지 글에서 날짜와 장소만 뽑기', '"안녕하세요" 인사말 한 줄 만들기'], a: 1,
        why: '쿡북은 어려운 여러 단계 문제에 high 이상을 권해요. 그래도 늘 낫다는 보장은 없으니 none과 결과·시간을 비교해 봐요.',
        ex: ['정해진 분류예요. "none"과 낮은 temperature가 권장이에요.', '', '정해진 추출이에요. 추론을 켜면 느리고 비싸기만 해요.', '한 줄 인사에 풀이 글은 필요 없어요.'] },
      { t: 'q', kind: 'mc', fig: 'q_allHigh', q: '"쿡북 실험에서 high가 정답을 맞혔으니, 우리 챗봇은 모든 요청을 high로 하자"는 의견에 대한 답으로 알맞은 것은?',
        opts: ['맞다. high는 늘 더 좋은 답을 보장한다', '맞다. 추론 토큰은 사용량에 세지 않아 손해가 없다', '틀리다. high에서는 추론 토큰이 max_tokens 밖에서 따로 늘어 위험하다', '틀리다. 15배쯤 느리고 토큰이 늘며, 좋은 답이 보장되지도 않는다'], a: 3,
        why: '추론은 일에 맞춰 켜요. 학생이 기다리는 챗봇에서 매번 10초 넘게 걸리면 수업이 멈추고, 토큰도 크게 늘어요.',
        ex: ['쿡북도 더 좋은 답을 보장하지 않는다고 적었어요.', '추론 토큰도 completion_tokens에 세져요.', '반대예요. 추론 토큰은 max_tokens 안에서 써요.', ''] },
      { t: 'sum', pts: ['추론을 켜면 답(content) 전에 추론 글(reasoning)을 먼저 만든다. none·minimal은 끄고, low·medium·high·xhigh·max는 켠다.', '추론 토큰도 max_tokens 안에서 쓰고 completion_tokens에 세진다. 추론을 켰는데 작으면 content가 None, finish_reason이 "length".', '켜면 느리고 비싸며 더 좋은 답을 보장하지 않는다(쿡북: none 0.86초 오답, high 12.85초 정답). 안 적으면 꺼지지만, 의도를 드러내려 늘 직접 적는다.'] }
    ]},

    /* =================== QB =================== */
    { id: 'QB', type: 'quiz', title: '헷갈림 퀴즈 ②', sub: 'temperature와 reasoning_effort, max_tokens와 컨텍스트, 추론 글과 답', min: 3, steps: [
      { t: 'q', kind: 'mc', fig: 'qb_tempVsEffort', q: '"같은 질문인데 답이 매번 너무 달라요." 먼저 손볼 것은?',
        opts: ['temperature를 0.2 이하로 낮춘다', 'reasoning_effort를 "max"로 올린다', 'max_tokens를 두 배로 늘린다', 'messages에서 system을 지운다'], a: 0,
        why: '답이 얼마나 들쭉날쭉한지는 뽑는 방식, 곧 <code>temperature</code>가 정해요. reasoning_effort는 답 전에 추론 글을 얼마나 쓸지예요.',
        ex: ['', '추론을 늘린다고 들쭉날쭉이 줄지 않아요. 느려지고 토큰만 늘 수 있어요.', 'max_tokens는 길이 상한이에요. 답이 달라지는 것과는 상관없어요.', 'system을 지우면 규칙이 사라져 오히려 더 들쭉날쭉해질 수 있어요.'] },
      { t: 'q', kind: 'mc', fig: 'qb_maxVsCtx', q: '<code>max_tokens</code>와 컨텍스트 창을 바르게 구분한 것은?',
        opts: ['둘은 같은 말이다. max_tokens에 512K를 적으면 된다', 'max_tokens는 보낼 글 상한, 컨텍스트 창은 만들 글 상한이다', '컨텍스트 창은 하루 사용량, max_tokens는 한 번 사용량이다', 'max_tokens는 답 상한, 컨텍스트 창은 보낸 글+답의 한도다'], a: 3,
        why: '입력 토큰 + <code>max_tokens</code>가 컨텍스트 창 안에 들어가야 해요. 책상(컨텍스트) 위에 답 자리(max_tokens)가 있는 그림을 떠올려요.',
        ex: ['다른 말이에요. 입력까지 합쳐 컨텍스트 안에 들어가야 하니, max_tokens에 512K를 다 줄 수는 없어요.', '반대예요. max_tokens는 모델이 만들 토큰의 상한이에요.', '둘 다 한 요청 안의 한도예요. 하루 사용량이 아니에요.', ''] },
      { t: 'q', kind: 'mc', fig: 'qb_reasonVsContent', q: '추론을 켠 요청의 응답이에요. 학생 화면에 보여 줄 <b>답</b>은 어디에 있을까요?',
        opts: ['<code>message.reasoning</code>', '<code>message.content</code>', '<code>usage.completion_tokens</code>', '<code>finish_reason</code>'], a: 1,
        why: '답은 <code>message.content</code>, 추론 글은 <code>message.reasoning</code>에 따로 와요. 학생 화면엔 content를 보여 줘요.',
        ex: ['답 전에 만든 풀이 같은 글이에요. 길고, 학생에게 보여 줄 답이 아니에요.', '', '만든 토큰 수예요. 글이 아니에요.', '왜 멈췄는지(stop·length 등)를 알려 주는 값이에요.'] }
    ]},

    /* =================== L5 =================== */
    { id: 'L5', type: 'lesson', title: '환각과 한계', sub: '그럴듯한 틀린 답, 학습 데이터 기준 시점, 근거 자료 주기', min: 9, steps: [
      { t: 'say', h: '환각: 그럴듯하지만 틀린 답', fig: 'hallucination', p: [
        'LLM은 <b>그럴듯한 다음 조각</b>을 이어 쓰는 프로그램이에요. 문장이 매끄러운지와 내용이 사실인지는 따로예요. 사실과 다른 내용을 자신 있게 쓰는 일을 <b>환각</b>(hallucination)이라고 해요.',
        '모르는 내용이어도 "모른다"보다 그럴듯한 답이 이어질 확률이 높으면 모델은 그쪽을 써요. 날짜·이름·숫자처럼 구체적일수록 더 믿음직해 보여서 위험해요.',
        '학생이 AI 답을 그대로 믿지 않게 가르치는 것도 정보 교사의 몫이에요. 오늘 배운 원리가 그 설명의 바탕이 돼요.'
      ]},
      { t: 'say', h: '학습 데이터에는 기준 시점이 있어요', fig: 'cutoff', p: [
        '모델은 어느 시점까지 모은 글로 학습해요. 모델 문서에 따르면 <code>solar-pro4</code>의 <b>학습 데이터 기준 시점은 2026년 2월</b>이에요.',
        '그 뒤에 나온 소식, 예를 들어 2026년 가을에 나온 교육 정책이나 새 교육 자료는 학습 데이터에 없어요. 물으면 모른다고 하거나, 그럴듯하게 지어낼 수 있어요.',
        '"최근", "올해", "이번 학기"가 들어간 질문은 특히 조심해요. 공식 누리집에서 직접 확인하거나, 확인한 자료를 함께 넣어 줘요.'
      ]},
      { t: 'say', h: '계산과 출처에도 약해요', fig: 'calcSource', p: [
        '<b>계산</b>: 모델은 숫자도 토큰으로 이어 쓸 뿐, 계산기를 돌리지 않아요. 큰 수 곱셈이나 여러 단계 계산은 틀리기 쉬워요. 공식 쿡북 실험에서도 추론을 끈 쪽이 계산 문제를 틀렸어요.',
        '<b>출처</b>: 논문 제목, 책 쪽수, 누리집 주소도 그럴듯하게 지어낼 수 있어요. 주소는 직접 열어 보고, 그 내용이 답과 맞는지 확인해요.',
        '수업 도구에서 평균·등급 같은 계산은 파이썬 코드로 하고, LLM에게는 결과를 설명하는 일만 맡기는 게 안전해요.'
      ]},
      { t: 'say', h: '근거 자료를 함께 주면 나아져요', fig: 'groundDoc', p: [
        '모델이 학습하지 않은 내용도 <b>컨텍스트에 자료로 넣어 주면</b> 그 자료를 읽고 답할 수 있어요. 레슨 2의 책상에 자료를 올려 주는 거예요.',
        'system에 "<b>주어진 자료로만 답하고, 자료에 없으면 모른다고 말해</b>"를 함께 적으면 지어내는 일이 줄어요. 줄어들 뿐 없어지지는 않으니 확인은 계속해요.',
        '수업자료에서 질문에 맞는 부분을 찾아 자동으로 넣어 주는 방법이 <b>RAG</b>(검색 증강 생성)예요. 과정 3 단원 1에서 내 수업자료로 답하는 보조 에이전트로 만들어요.'
      ]},
      { t: 'say', h: '확인 습관: 마지막 판단은 교사가', fig: 'checkHabit', p: [
        'AI 답을 수업에 쓰기 전에 세 가지를 확인해요. <b>① 날짜·최신 정보</b>는 공식 누리집에서, <b>② 숫자·계산</b>은 직접 계산이나 코드로, <b>③ 출처</b>는 직접 열어서.',
        '여러 교육청·기관의 AI 활용 안내에도 "AI 정보는 공식 출처로 사실 확인", "최종 판단은 교사"가 들어 있어요. 우리 학교·교육청 지침을 먼저 확인해요.',
        '학생에게도 같은 습관을 가르쳐요. "AI가 그랬어요"가 아니라 "AI가 이렇게 말했는데, 확인해 보니…"로 말하게요.'
      ]},
      { t: 'sim', h: 'Playground에서 지어낸 답과 근거 있는 답 비교하기', p: '콘솔 Playground의 Chat에서 같은 걸 두 번 물어봐요. 처음엔 그냥, 다음엔 공지 자료를 붙여서요. 실제로는 Solar Pro 4를 고르면 Solar Chat 새 탭에서 답하고, 답도 다를 수 있어요.',
        scene: { win: 'web', url: 'console.upstage.ai', brand: 'Upstage Console', nav: PG_NAV, page: 'Chat', blocks: pgChat([]), aside: PG_ASIDE },
        steps: [
          { goal: '우리 학교 수행평가를 물어요', type: Q_GUESS, into: 'chat', say: '모델은 우리 학교 계획을 본 적이 없어요. 어떻게 답할까요? (실제 화면에서는 solar-pro4를 고르면 Solar Chat 새 탭에서 답해요.)' },
          { goal: '보내요', click: 'btn:send', then: { blocks: pgChat([{ me: Q_GUESS }, { ai: A_GUESS }]) },
            say: '날짜·주제·배점까지 매끄럽게 썼지만 모두 지어낸 내용이에요. 이게 <b>환각</b>이에요.' },
          { goal: '공지를 붙여 다시 물어요', type: Q_DOC, into: 'chat', say: '근거 자료와 "없으면 없다고"를 함께 적었어요.' },
          { goal: '보내요', click: 'btn:send', then: { blocks: pgChat([{ me: Q_GUESS }, { ai: A_GUESS }, { me: Q_DOC }, { ai: A_DOC }]) },
            say: '공지에 있는 것만 답하고, 배점은 공지에 없다고 했어요.' } ],
        end: '근거를 주고, 없으면 없다고. 그래도 확인은 교사가.' },
      { t: 'q', kind: 'mc', fig: 'q_newsAfter', q: '<code>solar-pro4</code>에게 "지난달 발표된 교육부 AI 지침의 핵심 3가지"를 물었더니 자세히 답했어요. 오늘은 2026년 10월이에요. 먼저 의심할 점은?',
        opts: ['답이 자세하니 최신 자료로 다시 학습한 것이다', 'temperature가 낮으면 최신 정보도 정확하게 알려 준다', '기준 시점(2026년 2월) 뒤의 일이라 지어냈을 수 있다', 'API 키를 새로 만들면 최신 정보가 함께 온다'], a: 2,
        why: '지난달(2026년 9월) 일은 학습 데이터에 없어요. 자세한 답일수록 공식 누리집에서 직접 확인해요.',
        ex: ['요청을 받을 때마다 다시 학습하지 않아요. 자세한 것과 맞는 것은 달라요.', 'temperature는 뽑는 방식이에요. 학습 데이터에 없는 일을 알게 해 주지 않아요.', '', 'API 키는 누가 부르는지 확인할 뿐이에요.'] },
      { t: 'q', kind: 'mc', fig: 'q_fakeLink', q: '수업 퀴즈 해설 끝에 참고 논문 제목과 주소가 붙어 있어요. 알맞은 대처는?',
        opts: ['주소를 직접 열어 있는지, 내용이 맞는지 본다', '제목이 그럴듯하고 저자 이름까지 있으면 실제 논문이다', '주소가 https로 시작하면 믿을 만한 진짜 주소다', '추론을 켜고 받은 출처라면 확인하지 않아도 된다'], a: 0,
        why: 'LLM은 그럴듯한 제목과 주소도 지어낼 수 있어요. 열어 보고, 그 내용이 해설과 맞는지까지 봐요.',
        ex: ['', '그럴듯한 제목과 저자 이름도 지어낼 수 있어요.', 'https는 연결 방식일 뿐, 그런 페이지가 있는지 알려 주지 않아요.', '추론을 켜도 출처를 지어낼 수 있어요. 늘 직접 확인해요.'] },
      { t: 'q', kind: 'order', fig: 'q_checkOrder', q: 'LLM으로 만든 학습지 해설을 학생에게 나눠 주기까지, 순서대로 쌓아 보세요.',
        items: ['해설에 쓸 근거 자료를 모은다', '근거 자료와 함께 해설을 부탁한다', '날짜·숫자·출처를 공식 자료와 계산으로 확인한다', '틀린 곳을 고치고 학생에게 나눠 준다'],
        why: '자료가 있어야 함께 부탁할 수 있고, 받은 해설을 확인해야 고칠 곳이 보여요. 학생에게는 교사가 확인한 뒤에 나가요.' },
      { t: 'q', kind: 'mc', fig: 'q_avgCalc', q: '학생 30명의 수행평가 점수로 평균과 등급을 내려 해요. 가장 안전한 방법은?',
        opts: ['점수 30개를 붙여 넣고 LLM에게 평균과 등급을 계산하게 한다', 'temperature를 0으로 하면 LLM 계산도 늘 맞는다', 'reasoning_effort를 "max"로 하면 계산 확인은 필요 없다', '평균·등급은 파이썬 코드로 계산하고, LLM은 설명만 맡긴다'], a: 3,
        why: '계산은 코드가 정확해요. LLM은 숫자도 토큰으로 이어 쓰니 틀릴 수 있어요. 학생 점수 같은 개인정보를 밖으로 보내지 않는 것도 중요해요.',
        ex: ['계산을 틀릴 수 있고, 학생 점수를 밖으로 보내는 일이기도 해요.', '낮은 temperature는 일정하게 만들 뿐, 계산이 맞는다는 보장은 아니에요.', '추론이 계산을 도울 때도 있지만 보장하지 않아요. 확인은 늘 필요해요.', ''] },
      { t: 'sum', pts: ['환각은 그럴듯하지만 틀린 답. 다음 조각을 그럴듯하게 이어 쓰는 원리에서 나온다. 날짜·숫자·출처가 특히 위험하다.', 'solar-pro4의 학습 데이터 기준 시점은 2026년 2월. 그 뒤의 일, 계산, 출처는 직접 확인한다.', '근거 자료를 넣고 "없으면 모른다고"를 부탁하면 줄어든다(과정 3 단원 1의 RAG). 마지막 판단은 교사.'] }
    ]},

    /* =================== M1 =================== */
    { id: 'M1', type: 'mission', title: 'Playground에서 LLM 원리 실험하기', sub: '콘솔과 내 Cursor에서 직접', min: 25,
      where: '업스테이지 콘솔 Playground + upstage-lab 폴더',
      intro: '이번 단원에서 배운 원리를 진짜로 확인해 봐요. 1~3번은 콘솔 <b>Playground</b>에서, 5번은 내 Cursor에서 해요. 끝낸 것부터 체크하고 한 줄 메모를 남겨요. 학생 이름·성적 같은 개인정보는 어디에도 넣지 않아요.',
      tasks: [
        { do: 'Playground Chat에서 같은 질문을 세 번 보내 비교해요',
          how: '콘솔 위쪽 막대의 <b>Playground</b>에서 <b>Chat</b>을 열고 Solar Pro 4를 골라요. 질문은 <b>Solar Chat</b> 새 탭으로 열려 거기서 답해요(화면 모양은 바뀔 수 있어요). 새 대화를 열 때마다 같은 질문을 보내요: <code>파이썬 변수를 중학생에게 한 문장 비유로 설명해 줘</code>.',
          check: '세 답을 메모에 옮기고 같은 점·다른 점을 한 줄씩 적었으면 성공. 답이 다르면 레슨 3의 표집 때문이에요.' },
        { do: '(선택) Playground의 모델 목록과 설정 칸을 살펴봐요',
          how: 'Chat의 모델 목록을 열어 봐요. Solar Pro 4·Solar Mini 4는 질문을 Solar Chat 새 탭으로 보내고, System Prompt·Temperature 같은 설정 칸은 곧 끝나는 옛 모델(Solar Pro 3 등)을 골랐을 때만 보여요. 그래서 temperature 실험은 이 과정 단원 3에서 코드로 해요(레슨 3 모의 화면의 <code>temp_test.py</code>).',
          check: '모델 목록에 무엇이 있는지, Solar Pro 4를 골랐을 때 설정 칸이 보이는지 메모했으면 성공.' },
        { do: '환각을 부르는 질문 셋을 보내고 기록해요',
          how: '① 2026년 2월 뒤의 일(예: "2026년 9월에 나온 교육 정책 소식 3가지") ② 큰 수 계산(예: <code>4782 × 3659</code>) ③ 출처(예: "변수 개념을 다룬 논문 두 편을 제목과 주소까지"). 계산은 계산기나 파이썬으로, 주소는 직접 열어 확인해요.',
          check: '질문마다 "맞음 / 틀림 / 모른다고 함"을 표로 적었으면 성공. 지어낸 답이 나왔다면 그것도 좋은 수업 자료예요.' },
        { do: '내 수업으로 토큰과 비용을 어림해요',
          how: '<code>solar-pro4</code> 정가(100만 토큰당 입력 $0.30, 출력 $1.20)로 먼저 예시를 계산해요: 학생 30명 × 질문 10개 × (입력 2천 + 출력 3백 토큰). 그다음 내 반 학생 수·질문 수로 바꿔 한 번 더 해요.',
          check: '예시가 약 $0.29로 나오고 내 수업 숫자로도 계산했으면 성공. 지금은 할인 행사 중이라 실제로는 더 쌀 수 있으니 <code>upstage.ai/pricing/api</code>에서 확인해요.' },
        { do: 'Cursor 에이전트에게 temperature 계산 스크립트를 맡겨요',
          how: 'Cursor로 <code>upstage-lab</code> 폴더를 열어요(아직 없으면 빈 폴더를 만들고 <code>git init</code>). 시작 전에 <code>git status</code>를 보고 바뀐 게 있으면 먼저 커밋해요. 이 스크립트는 API를 부르지 않아서 키도 돈도 들지 않아요.',
          check: '<code>python temp_lab.py</code>(Mac에서 안 되면 <code>python3</code>)를 돌렸을 때 0.2에서 1등 확률이 가장 크고 1.5에서 가장 작으면 성공. 확인했으면 커밋해요.',
          prompt: '업스테이지한입 c1u2에서 배운 temperature 계산을 확인하고 싶어. upstage-lab 폴더에 temp_lab.py를 만들어 줘.\n- 조건: 파이썬 표준 라이브러리 math만 쓰고, API·인터넷·API 키는 쓰지 마.\n- 다음 조각 후보 4개 "반복", "여러", "계속", "한"의 점수(logit)는 2.0, 1.0, 0.5, 0.1이야.\n- temperature 0.2, 1.0, 1.5마다 점수를 temperature로 나누고 math.exp로 확률을 계산해서, 후보별 확률을 소수 첫째 자리까지 %로 출력해.\n- 주석은 한국어로, 20줄 이내로.\n- 다른 파일은 바꾸지 마.\n- 다 만들면 직접 실행해서 출력을 보여 주고, temperature가 낮을수록 1등 확률이 커지는지 한 줄로 확인해 줘.' },
        { do: '연수에서 물어볼 질문을 메모해요',
          how: '오늘 헷갈렸거나 문서끼리 달랐던 것을 질문으로 바꿔요. 예: "Solar Chat에서 받은 답과 API로 받은 답이 다른 까닭은 무엇일까요?", "학생 30명이 동시에 쓰려면 어느 등급(Tier)이 필요할까요?"',
          check: '1일차 13:00 「Solar로 보는 LLM의 원리」 시간에 물을 질문 3개를 메모했으면 성공.' }
      ],
      note: '예상 비용: Playground는 무료라 크레딧이 줄지 않아요. Chat은 로그인 없이도 써 볼 수 있어요. 다만 Playground에 넣은 글은 모델 개선에 쓰일 수 있으니 학생 정보는 넣지 않아요. 이 미션은 API 키를 쓰지 않아요. 키를 채팅 칸이나 메모에 붙이지 않아요.' },

    /* =================== T1 =================== */
    { id: 'T1', type: 'test', title: '단원 형성평가', sub: '10문제 · 7문제 이상 맞히면 통과', min: 12, pass: 0.7, steps: [
      { t: 'q', kind: 'mc', fig: 't_diffAns', q: '연수 실습에서 옆자리 선생님과 똑같은 코드로 같은 질문을 보냈는데 답이 달라요. temperature는 둘 다 적지 않았어요. 가장 알맞은 설명은?',
        opts: ['한 사람의 API 키가 잘못돼서 다른 모델이 답했다', '기본 temperature 1.0에서 확률대로 뽑기 때문이다', '연수장 와이파이가 느려서 두 사람의 답이 서로 섞였다', '먼저 보낸 사람의 질문을 모델이 기억해서 바꿔 답했다'], a: 1,
        why: 'temperature를 안 적으면 기본 1.0이에요. 확률대로 다음 토큰을 뽑으니 같은 질문에도 답이 달라질 수 있어요. 비슷한 답이 필요하면 0.2 이하로 낮춰요.',
        ex: ['키가 틀리면 401 오류가 나지, 다른 모델이 답하지 않아요.', '', '느린 네트워크는 답을 늦게 할 뿐 섞지 않아요.', 'API는 요청마다 따로예요. 다른 사람의 질문을 기억하지 않아요.'] },
      { t: 'q', kind: 'blank', fig: 't_gradeBlank', q: '파이썬 과제 답을 "통과/다시" 한 단어로만 판정받으려 해요. 공식 쿡북 권장에 맞게 두 빈칸을 채워 보세요.', lang: 'py',
        code: src(['resp = client.chat.completions.create(', '    model=MODEL, messages=msgs,', '    temperature=[[1]],', '    reasoning_effort="[[2]]")']),
        opts: [['1.5', 'none'], ['0.1', 'high'], ['1.5', 'max'], ['0.1', 'none']], a: 3,
        why: '정해진 분류·채점은 낮은 temperature와 추론 끄기(<code>"none"</code>)가 쿡북의 권장이에요. 같은 답안엔 같은 판정이 나오고, 빠르고 싸요.',
        ex: ['첫 칸이 틀렸어요. 1.5는 답을 다양하게 만들어 같은 답안에 다른 판정이 나올 수 있어요.', '둘째 칸이 아쉬워요. 한 단어 판정에 추론을 켜면 느리고 토큰만 늘어요.', '둘 다 반대예요. 다양하게, 오래 추론하는 설정이에요.', ''] },
      { t: 'q', kind: 'line', fig: 't_roleLine', q: '수업 챗봇에 보낼 대화 기록이에요. <b>틀린 줄</b>을 눌러 보세요.', lang: 'py',
        code: src(['msgs = [', '  {"role": "system",', '   "content": "너는 정보 선생님"},', '  {"role": "user",', '   "content": "변수가 뭐야?"},', '  {"role": "user",', '   "content": "값을 담는 이름표예요."},', '  {"role": "user",', '   "content": "예시를 들어 줘"},', ']']), a: 5,
        why: '"값을 담는 이름표예요."는 모델이 앞서 한 답이에요. 그 상자의 역할은 <code>assistant</code>여야 해요. user로 넣으면 모델은 학생이 그 말을 한 것으로 읽어요.' },
      { t: 'q', kind: 'order', fig: 't_turnOrder', q: '수업 챗봇이 학생의 두 번째 질문에 앞 대화를 이어 답하도록, messages를 만드는 순서로 쌓아 보세요.',
        items: ['system에 선생님 역할과 규칙을 넣는다', '학생의 첫 질문을 user로 넣는다', '모델의 첫 답을 assistant로 붙인다', '학생의 두 번째 질문을 user로 붙여 보낸다'],
        why: '규칙은 맨 앞, 그다음 대화가 오간 차례 그대로 붙여요. API는 기억하지 않으니 이 목록 전체를 한 요청으로 보내요.' },
      { t: 'q', kind: 'mc', fig: 't_emptyTrain', q: '연수 실습에서 공지 글의 날짜만 뽑으려고 <code>reasoning_effort="high"</code>, <code>max_tokens=200</code>으로 보냈더니, <code>content</code>가 <code>None</code>이고 <code>finish_reason</code>이 <code>"length"</code>예요. 먼저 할 일은?',
        opts: ['API 키를 지우고 콘솔에서 새 키를 만들어 바꾼다', 'temperature를 0으로 낮춰 답이 나오게 한다', 'reasoning_effort를 "none"으로 바꿔 추론을 끈다', 'base_url 끝에 /solar를 붙여 다시 보내 본다'], a: 2,
        why: '추론을 켜면 추론 토큰도 max_tokens 안에서 써요. 200개를 추론이 다 써서 답 자리가 없었던 거예요. 날짜 뽑기엔 추론이 필요 없으니 <code>"none"</code>으로 꺼요(추론이 필요한 일이면 max_tokens를 넉넉히).',
        ex: ['키 문제면 401 오류가 나요. 응답이 왔으니 키는 멀쩡해요.', 'temperature는 뽑는 방식을 바꿀 뿐, 추론 토큰이 자리를 차지하는 문제는 그대로예요.', '', '옛 예제의 주소예요. 지금은 https://api.upstage.ai/v1을 써요.'] },
      { t: 'q', kind: 'mc', fig: 't_slowChat', q: '학생 질문을 받는 챗봇이 대화가 길어질수록 느려지고 사용량이 빨리 늘어요. 왜일까요?',
        opts: ['매번 앞의 대화를 모두 다시 보내 입력 토큰이 쌓여서', '모델이 대화를 기억하느라 저장 요금이 붙어서', 'temperature가 대화마다 저절로 올라가서', '질문이 50개를 넘으면 그때부터 값이 두 배가 되어서'], a: 0,
        why: 'API는 기억하지 않아서 이어 가려면 지난 대화를 매번 보내요. 대화가 길수록 요청마다 입력 토큰이 늘어 느리고 비싸져요. 오래된 대화는 잘라 내요.',
        ex: ['', 'API는 대화를 기억하지 않아요. 저장 요금이 아니라 매번 보내는 글이 길어진 거예요.', 'temperature는 내가 정한 값 그대로예요.', '그런 가격 규칙은 없어요. 값은 토큰 수로 매겨요.'] },
      { t: 'q', kind: 'mc', fig: 't_calc', q: '학생이 "AI가 3847 × 2961은 11,389,967이래요"라며 가져왔어요. 지도 방법으로 알맞은 것은?',
        opts: ['AI가 계산한 것이니 맞다고 알려 준다', '계산기나 코드로 직접 확인해 보게 한다', 'temperature를 0으로 다시 물으면 늘 맞는다고 알려 준다', '자릿수가 많아서 틀린 것이니 짧은 곱셈은 믿어도 된다고 알려 준다'], a: 1,
        why: 'LLM은 계산기를 돌리지 않고 숫자 토큰을 이어 써요. 실제 답은 11,390,967이에요. 확인하는 습관이 AI 리터러시의 시작이에요.',
        ex: ['실제로 계산해 보면 11,390,967이에요. AI 답도 확인이 필요해요.', '', '낮은 temperature는 일정하게 만들 뿐, 계산이 맞는다는 보장은 아니에요.', '짧은 계산도 틀릴 수 있어요. 숫자는 늘 확인해요.'] },
      { t: 'q', kind: 'mc', fig: 't_costCalc', q: '<code>solar-pro4</code> 정가(100만 토큰당 입력 $0.30, 출력 $1.20)로 어림해요. 학생 30명이 질문 10개씩, 한 번에 입력 2천·출력 3백 토큰이면 대략 얼마일까요?',
        opts: ['약 $2.9', '약 $0.03', '약 $29', '약 $0.29'], a: 3,
        why: '입력 30 × 10 × 2,000 = 60만 토큰 → $0.18, 출력 30 × 10 × 300 = 9만 토큰 → 약 $0.11. 합쳐서 약 $0.29예요(정가·부가세 별도라 할인 중엔 실제로 더 쌀 수 있어요).',
        ex: ['열 배 많아요. 100만으로 나눌 때 0을 하나 덜 뗐어요.', '열 배 적어요. 입력 60만 토큰만 해도 $0.18이에요.', '백 배 많아요. 토큰 수를 100만으로 나누는 걸 잊었어요.', ''] },
      { t: 'q', kind: 'mc', fig: 't_bothKnobs', q: '연수 실습에서 답이 들쭉날쭉해서 temperature와 top_p를 한꺼번에 크게 바꿨더니, 무엇 때문에 달라졌는지 모르겠어요. 공식 쿡북 권장에 맞는 방법은?',
        opts: ['둘 중 하나만 조절하고 하나씩 바꿔 비교한다', 'top_p는 0으로, temperature는 2로 둘 다 끝까지 바꾼다', 'reasoning_effort를 "max"로 올리면 들쭉날쭉이 사라진다', 'max_tokens를 줄이면 답이 일정해진다'], a: 0,
        why: '쿡북은 temperature나 top_p 중 하나만 조절하는 게 보통이라고 해요. 하나씩 바꿔야 무엇이 효과였는지 알 수 있어요.',
        ex: ['', '둘 다 끝까지 바꾸면 무엇 때문인지 더 알 수 없어요.', '추론은 들쭉날쭉과 상관없어요. 느려지고 토큰만 늘 수 있어요.', 'max_tokens는 길이 상한이에요. 답이 잘릴 뿐 일정해지지 않아요.'] },
      { t: 'q', kind: 'mc', fig: 't_ground', q: '학생용 도우미에게 "우리 반 시간표"를 물었더니 그럴듯한 시간표를 지어내요. 가장 알맞은 고치기는?',
        opts: ['temperature를 2.0으로 올려 여러 답 중에서 고른다', 'reasoning_effort를 "max"로 올리면 모르는 일도 알게 된다', '시간표 자료를 함께 보내고, 자료에 없으면 모른다고 하게 한다', 'max_tokens를 줄여 지어낸 말이 짧아지게 한다'], a: 2,
        why: '모델은 우리 반 시간표를 학습한 적이 없어요. 자료를 컨텍스트에 넣고 "없으면 모른다고"를 system에 적어요. 과정 3 단원 1의 RAG가 이걸 자동으로 해요.',
        ex: ['높일수록 더 무작위로 지어내요.', '추론을 늘려도 학습하지 않은 사실은 생기지 않아요.', '', '짧아질 뿐 여전히 지어낸 말이에요.'] }
    ]}
    ]
  });
})();
