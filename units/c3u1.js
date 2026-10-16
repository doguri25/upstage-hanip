// 과정 3 · 단원 1 · 내 수업자료로 대답하는 보조 에이전트
(function () {
  function src(a) { return a.join('\n'); }
  // 창 틀(위 막대 + 점 세 개)
  function win(P, x, y, w, h) {
    P.rrect(x, y, w, h, 10, { fill: 'paper', fs: 'solid' });
    P.line(x, y + 20, x + w, y + 20, { w: 1.5 });
    P.circle(x + 11, y + 10, 7, { fill: 'bad', fs: 'solid', c: null });
    P.circle(x + 22, y + 10, 7, { fill: 'hi', fs: 'solid', c: null });
    P.circle(x + 33, y + 10, 7, { fill: 'good', fs: 'solid', c: null });
  }
  // 문서 쪽지(이름 + 글줄)
  function doc(P, x, y, w, h, name, fill, size) {
    P.note(x, y, w, h, { fill: fill || 'paper' });
    if (name) P.text(x + w / 2, y + 20, name, { size: size || 12, weight: 700 });
    let i = 0;
    for (let yy = name ? y + 34 : y + 16; yy < y + h - 8; yy += 12, i++) P.line(x + 10, yy, x + w - (i % 2 ? 22 : 12), yy, { c: 'soft', w: 2 });
  }
  // 자료 조각 카드([번호] + 글줄 두 개)
  function piece(P, x, y, w, h, n, fill) {
    P.rrect(x, y, w, h, 6, { fill: fill || 'hi', gap: 5, w: 1.4 });
    const s = n != null ? x + 28 : x + 8;
    if (n != null) P.text(x + 6, y + h / 2 + 4, '[' + n + ']', { size: 11, weight: 700, mono: true, anchor: 'start' });
    P.line(s, y + h / 2 - 3, x + w - 8, y + h / 2 - 3, { c: 'ink2', w: 1.6 });
    P.line(s, y + h / 2 + 4, x + w - 18, y + h / 2 + 4, { c: 'ink2', w: 1.6 });
  }
  // 글자 상자
  function chip(P, x, y, w, h, label, fill, size, c) {
    P.rrect(x, y, w, h, 8, { fill: fill || 'paper', gap: 5, w: 1.6 });
    P.text(x + w / 2, y + h / 2 + (size || 13) * 0.36, label, { size: size || 13, weight: 700, c: c || 'ink' });
  }
  // 두 줄 상자(제목 + 작은 설명)
  function box2(P, x, y, w, h, title, sub, fill) {
    P.rrect(x, y, w, h, 8, { fill: fill || 'paper', gap: 5, w: 1.6 });
    P.text(x + w / 2, y + h / 2 - 2, title, { size: 12, weight: 700 });
    P.text(x + w / 2, y + h / 2 + 13, sub, { size: 9, c: 'ink2' });
  }
  // 사람(어깨 + 머리 + 얼굴). bottom = 어깨 아래 끝
  function person(P, cx, bottom, mood, s) {
    s = s || 1;
    P.path(`M${cx - 40 * s} ${bottom} Q${cx} ${bottom - 64 * s} ${cx + 40 * s} ${bottom}`, { fill: 'sky', gap: 6 });
    P.circle(cx, bottom - 90 * s, 62 * s, { fill: 'paper' });
    P.face(cx, bottom - 88 * s, 50 * s, { mood: mood || 'smile' });
  }
  // 돋보기(검색)
  function lens(P, cx, cy, r) {
    P.circle(cx, cy, r * 2, { fill: 'sky', gap: 5, w: 2 });
    P.line(cx + r * 0.72, cy + r * 0.72, cx + r * 1.45, cy + r * 1.45, { w: 4.5 });
  }
  // 벡터(숫자 목록) 막대
  function vec(P, x, y, c) { [10, 18, 7, 14, 11].forEach((hh, i) => P.rect(x + i * 6, y - hh, 4, hh, { fill: c || 'accent', fs: 'solid', w: 1 })); }
  // 저장소(원통)
  function db(P, x, y, w, h, fill) {
    P.rect(x, y + 6, w, h - 12, { fill: fill || 'sky', fs: 'solid', c: null });
    P.line(x, y + 6, x, y + h - 6, { w: 1.6 });
    P.line(x + w, y + 6, x + w, y + h - 6, { w: 1.6 });
    P.ellipse(x + w / 2, y + h - 6, w, 12, { fill: fill || 'sky', fs: 'solid', w: 1.6 });
    P.ellipse(x + w / 2, y + 6, w, 12, { fill: 'paper', fs: 'solid', w: 1.6 });
  }
  // 손잡이(매개변수). a = 바늘 각도(0이 위), null이면 바늘 없음
  function dial(P, cx, cy, d, a) {
    P.circle(cx, cy, d, { fill: 'paper', w: 2 });
    for (let i = 0; i < 5; i++) { const t = -1.2 + i * 0.6, r1 = d / 2 - 4, r2 = d / 2 - 10; P.line(cx + r1 * Math.sin(t), cy - r1 * Math.cos(t), cx + r2 * Math.sin(t), cy - r2 * Math.cos(t), { c: 'soft', w: 1.6 }); }
    if (a != null) { const r = d / 2 - 12; P.line(cx, cy, cx + r * Math.sin(a), cy - r * Math.cos(a), { c: 'bad', w: 3 }); P.circle(cx, cy, 8, { fill: 'ink', fs: 'solid', c: null }); }
  }
  // 노트북
  function laptop(P, x, y, w, h, fill) {
    P.rrect(x, y, w, h, 8, { fill: fill || 'paper', w: 2 });
    P.path(`M${x - 6} ${y + h} L${x + w + 6} ${y + h} L${x + w + 12} ${y + h + 12} L${x - 12} ${y + h + 12} Z`, { fill: 'soft', gap: 5 });
  }
  // 흩어진 카드(순서 문제용)
  function card(P, x, y) { P.rrect(x, y, 92, 64, 10, { fill: 'paper' }); }
  function ask(P, x, y, size, c) { P.text(x, y, '?', { size: size || 22, weight: 700, c: c || 'warm' }); }
  function tick(P, cx, cy, r) { P.path(`M${cx - r} ${cy} L${cx - r * 0.3} ${cy + r * 0.7} L${cx + r} ${cy - r * 0.7}`, { c: 'good', w: 3.2 }); }
  function cross(P, cx, cy, r, c) {
    P.line(cx - r, cy - r, cx + r, cy + r, { c: c || 'bad', w: 3 });
    P.line(cx + r, cy - r, cx - r, cy + r, { c: c || 'bad', w: 3 });
  }

  /* ---------- 모의 화면에서 되풀이하는 조각 ---------- */
  const LAB = 'upstage-lab';
  const Q_IN = 'for와 while은 언제 달라요?';
  const Q_OUT = '다음 주 수행평가 날짜가 언제예요?';
  const Q_AMB = '이거 몇 번 반복해요?';
  const RUN_IN = `python helper.py "${Q_IN}"`;
  const RUN_OUT = `python helper.py "${Q_OUT}"`;
  const RUN_AMB = `python helper.py "${Q_AMB}"`;
  const REQ = `search.py와 vectors.json으로 helper.py를 만들어 줘. 질문과 가까운 조각 3개에 [1]부터 번호를 붙여 넣고, 규칙은 "자료로만 답하고, 없으면 '자료에 없어요.', 문장 끝에 근거 번호". MODEL = "solar-pro4", reasoning_effort="none", temperature=0.2. 답 함수는 ask(question)으로, 답 아래에 번호·파일·쪽을 붙여 돌려줘. 다 되면 python helper.py로 한 번 실행해 확인해 줘.`;
  const AI_MADE = '<code>search.py</code>와 <code>vectors.json</code>의 모양을 읽고 <code>helper.py</code>를 만들었어요. 검색 <code>search()</code> → 조립 <code>build()</code> → 호출 <code>ask()</code> 순서예요. 확인하려고 실행해 볼게요.';
  const AI_RUN = '실행 결과예요.<br>for는 반복할 횟수가 정해졌을 때 써요[1]. while은 조건이 참인 동안 반복해요[2].<br>--- 출처 ---<br>[1] 반복문_학습지.pdf 2쪽<br>[2] 반복문_학습지.pdf 3쪽<br>[3] 리스트_학습지.pdf 1쪽';
  const EMPTY = { mode: 'Agent', model: 'Auto', msgs: [], input: '' };
  const T_IN = ['$ ' + RUN_IN, 'for는 반복할 횟수가 정해졌을 때 써요[1].', 'while은 조건이 참인 동안 반복해요[2].', '--- 출처 ---', '[1] 반복문_학습지.pdf 2쪽 (0.83)', '[2] 반복문_학습지.pdf 3쪽 (0.71)', '[3] 리스트_학습지.pdf 1쪽 (0.52)'];
  const T_OUT = ['$ ' + RUN_OUT, '자료에 없어요.'];
  const T_AMB = ['$ ' + RUN_AMB, '어떤 코드를 말하는지 알려 줄래요? 학습지 2쪽의 for 예제라면 5번 반복해요[1].', '--- 출처 ---', '[1] 반복문_학습지.pdf 2쪽 (0.58)'];

  /* ---------- 미션에서 Cursor 에이전트에게 줄 부탁 ---------- */
  const P_HELPER = src([
    'upstage-lab 폴더에 helper.py를 만들어 줘.',
    '',
    '맥락: 같은 폴더에 search.py(코사인 함수)와 vectors.json(조각마다 text·file·page·vec)이 있어. 키는 .env의 UPSTAGE_API_KEY야.',
    '',
    '할 일:',
    '1. search(q, k=3): 질문을 solar-embedding-2-query로 임베딩하고 코사인 점수가 높은 조각 3개를 돌려줘.',
    '2. build(q, hits): 조각에 [1]부터 번호와 "파일 쪽"을 붙여 [자료]로, 그 아래 [질문]을 넣은 messages를 만들어. system 규칙은 "[자료]에 있는 내용으로만 답해. 자료에 없으면 \'자료에 없어요.\'라고만 답해. 문장 끝에 [1]처럼 근거 번호를 붙여. 질문이 애매하면 무엇을 묻는지 되물어."',
    '3. ask(question): search → build → MODEL = "solar-pro4", reasoning_effort="none", temperature=0.2로 호출하고, 답 글 아래에 [번호] 파일 쪽 목록을 붙인 글자 하나로 돌려줘. 함수 이름은 꼭 ask로 해 줘(다음 단원의 Streamlit 화면이 from helper import ask로 불러).',
    '4. python helper.py "질문"으로 실행하면 ask()의 결과를 찍어. 다른 파일이 import할 때는 돌지 않게 if __name__ == "__main__": 아래에 둬.',
    '',
    '조건: 모델 이름은 MODEL 변수 하나에. 옛 모델 이름(solar-pro3, solar-mini)은 쓰지 마. 키를 화면에 찍는 코드는 넣지 마. 새 패키지는 설치하지 마.',
    '',
    '확인: 다 되면 vectors.json에 실제로 있는 내용을 묻는 질문 하나로 실행해서 결과를 보여 줘.'
  ]);
  const P_CUT = src([
    'helper.py를 고쳐 줘. 지금은 자료 밖 질문에도 출처가 3개 찍혀.',
    '1. 출처 줄 끝에 코사인 점수를 소수 둘째 자리까지 같이 찍어 줘.',
    '2. CUT = 0.5 변수를 두고, 점수가 CUT보다 낮은 조각은 빼. 남는 조각이 없으면 Solar를 부르지 말고 "자료에 없어요."만 돌려줘.',
    '조건: ask(question)의 이름과 돌려주는 모양은 그대로 두고, 다른 동작은 바꾸지 마.',
    '확인: 자료 안 질문 하나, 자료 밖 질문 하나로 실행해 두 결과를 보여 줘. CUT 값은 내가 점수를 보고 정할게.'
  ]);
  const P_CHAT = src([
    'helper.py에 대화 모드를 더해 줘.',
    '1. 인자 없이 python helper.py로 켜면 "질문> "으로 계속 묻고, 빈 줄이면 끝내.',
    '2. 두 번째 질문부터는 최근 대화 4개(history[-4:])와 새 질문을 solar-mini4에 주고 "혼자 읽어도 뜻이 통하는 질문 한 문장"으로 다시 쓴 뒤, 그 질문으로 검색하고 답해. reasoning_effort="none", temperature=0.',
    '3. 다시 쓴 질문을 "다시 쓴 질문:"으로 화면에 찍어.',
    '조건: 인자를 주면 지금처럼 한 번만 답해. ask(question)의 이름과 돌려주는 모양은 바꾸지 마. 대화 모드는 내가 직접 돌려 볼 테니, 확인하는 방법만 알려 줘.'
  ]);
  const P_EVAL = src([
    '오늘 시험한 결과로 eval.md를 만들어 줘.',
    '표 칸: 번호, 질문, 종류(안·밖·애매), 기대한 답, 실제 답 요약, 근거 번호가 맞나(○/×), 판정(통과/실패), 메모.',
    '아래에 붙인 결과만 쓰고, 없는 내용은 지어내지 마. 맨 아래에 통과 수와 고칠 점 3가지를 적어 줘.',
    '다 되면 git status를 보여 주고, .env가 목록에 없는지 확인한 뒤 "c3u1 평가 기록"으로 커밋해 줘.',
    '',
    '(여기에 질문과 결과를 붙여요)'
  ]);

  HANIP.unit({
    id: 'c3u1',
    course: '과정 3 · AI 수업도구 만들기',
    title: '단원 1 · 내 수업자료로 대답하는 보조 에이전트',
    goals: ['RAG의 준비 단계와 질문 단계를 그려 설명하기', '번호 붙인 근거로 출처까지 답하는 helper.py 만들기', '자료 안·밖·애매한 질문으로 평가하고 고치기'],
    checked: { date: '2026-10-16' },
    sources: [
      'https://console.upstage.ai/docs/capabilities/generate/chat',
      'https://console.upstage.ai/docs/capabilities/generate/reasoning',
      'https://console.upstage.ai/api/chat',
      'https://console.upstage.ai/docs/capabilities/embed',
      'https://console.upstage.ai/api/embeddings',
      'https://console.upstage.ai/docs/models',
      'https://console.upstage.ai/docs/models/history',
      'https://console.upstage.ai/docs/capabilities/parse/document-parsing',
      'https://console.upstage.ai/docs/getting-started',
      'https://www.upstage.ai/pricing/api',
      'https://github.com/UpstageAI/Solar-Pro4-Cookbook',
      'https://github.com/UpstageAI/cookbook',
      'https://github.com/UpstageAI/upstage-extensions-hub'
    ],

    figs: {
      /* ---------- L1 설명 그림 ---------- */
      noKnow: { w: 340, h: 200, label: '학생이 우리 반 일을 묻지만 로봇은 그 학습지를 본 적이 없어 어지러워하는 모습', draw(P) {
        person(P, 54, 196, 'smile', 0.7);
        P.bubble(8, 8, 150, 44, 58, 108);
        P.text(83, 36, '수행평가 범위는?', { size: 14, weight: 700 });
        P.robot(196, 96, 0.62, { mood: 'dizzy' });
        ask(P, 238, 40, 26);
        doc(P, 262, 70, 66, 84, '학습지', 'hi', 12);
        P.text(196, 186, '본 적 없는 자료예요', { size: 13, c: 'ink2' });
      }},
      ragFlow: { w: 340, h: 240, label: '준비 단계(파싱, 조각, 임베딩, 저장)와 질문 단계(임베딩, 검색, 조립, Solar, 답과 출처)의 두 줄 흐름도', draw(P) {
        P.text(12, 18, '① 준비: 자료가 바뀔 때만', { size: 13, weight: 700, c: 'accent', anchor: 'start' });
        [['파싱', 'Document Parse'], ['조각', '파일·쪽 붙이기'], ['임베딩', 'passage'], ['저장', 'vectors.json']].forEach(([t, s], i) => {
          box2(P, 11 + i * 83, 28, 70, 42, t, s, i === 3 ? 'sky' : 'paper');
          if (i < 3) P.arrow(82 + i * 83, 49, 93 + i * 83, 49, { w: 1.8, head: 5 });
        });
        [['임베딩', 'query'], ['검색', 'top-k'], ['조립', '규칙+조각'], ['Solar', 'solar-pro4'], ['답', '+ 출처']].forEach(([t, s], i) => {
          box2(P, 14 + i * 65, 150, 52, 42, t, s, i === 4 ? 'hi' : 'paper');
          if (i < 4) P.arrow(67 + i * 65, 171, 78 + i * 65, 171, { w: 1.6, head: 5 });
        });
        P.curveArrow(295, 74, 220, 128, 105, 147, { c: 'accent', w: 2, head: 8 });
        P.text(176, 104, '여기서 찾아요', { size: 11, c: 'accent', weight: 700 });
        P.text(12, 214, '② 질문할 때: 질문마다', { size: 13, weight: 700, c: 'warm', anchor: 'start' });
        P.face(306, 220, 26, { mood: 'happy' });
      }},
      askTrip: { w: 340, h: 200, label: '학생 질문으로 조각 세 개를 찾아 붙이고 로봇이 근거 번호를 단 답을 내는 모습', draw(P) {
        P.bubble(8, 10, 112, 40, 44, 114);
        P.text(64, 36, 'for와 while 차이?', { size: 12, weight: 700 });
        person(P, 44, 196, 'smile', 0.62);
        P.text(152, 52, '검색한 조각', { size: 11, c: 'ink2' });
        piece(P, 104, 62, 92, 24, 1, 'hi');
        piece(P, 104, 92, 92, 24, 2, 'hi');
        piece(P, 104, 122, 92, 24, 3, 'paper');
        P.arrow(74, 120, 100, 104, { c: 'accent', w: 2, head: 7 });
        P.arrow(200, 104, 228, 100, { c: 'accent', w: 2, head: 7 });
        P.robot(282, 92, 0.5, { mood: 'happy' });
        P.bubble(190, 148, 144, 44, 272, 126);
        P.text(262, 175, 'for는 횟수가 정해질 때[1]', { size: 11, weight: 700 });
      }},
      fineVsRag: { w: 340, h: 200, label: '모델을 다시 학습시키는 길과 필요한 자료 조각을 찾아 옆에 놓아 주는 길 비교', draw(P) {
        P.rrect(8, 10, 156, 150, 12, { fill: 'soft', gap: 8 });
        P.text(86, 32, '다시 학습', { size: 14, weight: 700 });
        doc(P, 16, 50, 36, 46, null, 'hi');
        P.robot(100, 96, 0.5, { mood: 'sleepy' });
        P.text(86, 150, '오래·비싸게', { size: 12, c: 'ink2' });
        P.rrect(176, 10, 156, 150, 12, { fill: 'hi', gap: 8 });
        P.text(254, 32, '자료 찾아 주기(RAG)', { size: 13, weight: 700 });
        P.robot(222, 96, 0.5, { mood: 'happy' });
        piece(P, 266, 58, 58, 20, 1, 'paper');
        piece(P, 266, 84, 58, 20, 2, 'paper');
        piece(P, 266, 110, 58, 20, 3, 'paper');
        P.text(254, 150, '바꾸기 쉽고 출처도', { size: 12, c: 'ink2' });
        P.text(170, 188, '자료가 자주 바뀌는 수업에는?', { size: 13, c: 'accent' });
      }},
      wholeVsRag: { w: 340, h: 200, label: '자료를 통째로 넣는 길과 조각 몇 개만 넣는 길을 동전 수로 비교', draw(P) {
        P.text(86, 22, '통째로 넣기', { size: 14, weight: 700 });
        for (let i = 0; i < 5; i++) doc(P, 12 + i * 6, 36 + i * 6, 56, 70, null, i === 4 ? 'hi' : 'paper');
        P.arrow(100, 86, 116, 86, { w: 2, head: 7 });
        P.robot(140, 86, 0.44, { mood: 'wow' });
        for (let i = 0; i < 5; i++) { P.circle(30 + i * 24, 152, 20, { fill: 'hi', fs: 'solid', w: 1.4 }); P.text(30 + i * 24, 156, '$', { size: 11, weight: 700 }); }
        P.text(86, 186, '질문마다 자료 전체', { size: 12, c: 'ink2' });
        P.line(170, 30, 170, 190, { c: 'soft', w: 1.5 });
        P.text(255, 22, '조각만 넣기(RAG)', { size: 13, weight: 700 });
        piece(P, 186, 46, 70, 20, 1, 'hi');
        piece(P, 186, 74, 70, 20, 2, 'hi');
        piece(P, 186, 102, 70, 20, 3, 'hi');
        P.arrow(260, 86, 276, 86, { w: 2, head: 7 });
        P.robot(304, 86, 0.44, { mood: 'happy' });
        P.circle(255, 152, 20, { fill: 'hi', fs: 'solid', w: 1.4 });
        P.text(255, 156, '$', { size: 11, weight: 700 });
        P.text(255, 186, '질문마다 조각 몇 개', { size: 12, c: 'ink2' });
      }},

      /* ---------- L1 문제 그림 ---------- */
      q_fakeDate: { w: 340, h: 200, label: '자료 없이 질문을 받은 로봇이 자신 있게 범위를 말하는 모습', draw(P) {
        person(P, 50, 196, 'smile', 0.7);
        P.bubble(8, 10, 140, 44, 50, 110);
        P.text(78, 38, '수행평가 범위는?', { size: 13, weight: 700 });
        P.robot(220, 102, 0.6, { mood: 'proud' });
        P.bubble(180, 10, 150, 40, 220, 62);
        P.text(255, 36, '3단원 전체예요!', { size: 13, weight: 700 });
        P.sparkle(318, 72, 7, 'hi');
        ask(P, 300, 156, 26, 'bad');
        P.text(220, 190, '정말일까?', { size: 13, c: 'ink2' });
      }},
      q_askOrder: { w: 340, h: 200, label: '뒤섞인 카드: 숫자 막대, 돋보기, 로봇, 번호 붙은 조각, 쪽 번호, 메시지 상자', draw(P) {
        card(P, 14, 14);
        vec(P, 44, 62);
        card(P, 124, 44);
        lens(P, 164, 72, 14);
        card(P, 236, 12);
        P.robot(282, 46, 0.3, { mood: 'happy' });
        card(P, 30, 116);
        piece(P, 40, 124, 72, 20, 1, 'hi');
        piece(P, 40, 150, 72, 20, 2, 'hi');
        card(P, 140, 124);
        P.text(186, 156, '2쪽', { size: 14, weight: 700 });
        P.rrect(244, 104, 92, 64, 10, { fill: 'paper' });
        P.rrect(256, 114, 68, 18, 5, { fill: 'sky', fs: 'solid', w: 1.2 });
        P.rrect(256, 138, 68, 22, 5, { fill: 'hi', fs: 'solid', w: 1.2 });
        ask(P, 116, 36, 20, 'warm');
        ask(P, 228, 110, 20, 'bad');
      }},
      q_reprep: { w: 340, h: 200, label: '오타를 고친 학습지 새 판이 나왔고 무엇을 다시 할지 고민하는 얼굴', draw(P) {
        doc(P, 20, 20, 90, 116, '학습지 v1', 'paper', 12);
        doc(P, 130, 30, 90, 116, '학습지 v2', 'hi', 12);
        P.arrow(112, 84, 127, 84, { w: 2, head: 7 });
        P.text(175, 172, '오타를 고쳤어요', { size: 13, c: 'ink2' });
        person(P, 290, 196, 'wow', 0.72);
        ask(P, 290, 84, 28);
      }},
      q_shortDoc: { w: 340, h: 200, label: '학습지 묶음과 조각 세 개 사이에 vs 표시', draw(P) {
        for (let i = 0; i < 3; i++) doc(P, 20 + i * 8, 24 + i * 8, 70, 90, null, i === 2 ? 'sky' : 'paper');
        P.text(70, 150, '통째로', { size: 14, weight: 700 });
        piece(P, 236, 34, 84, 22, 1, 'hi');
        piece(P, 236, 64, 84, 22, 2, 'hi');
        piece(P, 236, 94, 84, 22, 3, 'hi');
        P.text(278, 150, '조각만', { size: 14, weight: 700 });
        P.circle(170, 80, 64, { fill: 'paper', w: 2 });
        P.text(170, 88, 'vs', { size: 20, weight: 700, c: 'accent' });
        P.text(170, 186, '512K 창이 있다면?', { size: 13, c: 'ink2' });
      }},

      /* ---------- L2 설명 그림 ---------- */
      msgSandwich: { w: 340, h: 200, label: 'system 칸에 규칙, user 칸에 번호 붙은 자료 조각과 질문이 든 messages', draw(P) {
        P.rrect(10, 10, 220, 52, 10, { fill: 'sky', gap: 6 });
        P.text(24, 30, 'system', { size: 12, weight: 700, mono: true, anchor: 'start' });
        P.text(24, 50, '규칙: 자료로만·모르면 모른다고', { size: 11, anchor: 'start' });
        P.rrect(10, 70, 220, 122, 10, { fill: 'hi', gap: 6 });
        P.text(24, 90, 'user', { size: 12, weight: 700, mono: true, anchor: 'start' });
        P.text(70, 90, '[자료]', { size: 11, weight: 700, anchor: 'start' });
        piece(P, 22, 98, 196, 18, 1, 'paper');
        piece(P, 22, 120, 196, 18, 2, 'paper');
        piece(P, 22, 142, 196, 18, 3, 'paper');
        P.text(24, 180, '[질문] for와 while 차이?', { size: 11, weight: 700, anchor: 'start' });
        P.arrow(236, 100, 262, 100, { w: 2.2, head: 8 });
        P.robot(298, 100, 0.48, { mood: 'happy' });
        P.text(298, 160, 'Solar', { size: 13, weight: 700 });
      }},
      ruleNo: { w: 340, h: 200, label: '자료에 없는 질문에 지어낸 날짜 대신 자료에 없어요라고 말하는 로봇', draw(P) {
        doc(P, 14, 40, 80, 100, '자료', 'paper', 12);
        P.robot(150, 96, 0.56, { mood: 'smile' });
        P.bubble(206, 18, 120, 40, 182, 70);
        P.text(266, 44, '자료에 없어요.', { size: 13, weight: 700 });
        tick(P, 322, 72, 8);
        P.bubble(206, 100, 120, 40, 182, 108);
        P.text(266, 126, '11월 3일이에요', { size: 13, c: 'soft' });
        cross(P, 322, 154, 7);
        P.text(150, 188, '없으면 없다고, 꾸미지 않기', { size: 13, c: 'accent' });
      }},
      numCite: { w: 340, h: 200, label: '답 속의 [1] 번호를 코드가 파일 이름과 쪽으로 이어 주는 모습', draw(P) {
        P.rrect(10, 14, 200, 56, 10, { fill: 'paper', w: 1.8 });
        P.text(20, 38, 'for는 횟수가 정해질 때', { size: 12, anchor: 'start' });
        P.text(20, 60, '써요', { size: 12, anchor: 'start' });
        P.rrect(48, 46, 26, 18, 5, { fill: 'hi', fs: 'solid', w: 1.4 });
        P.text(61, 59, '[1]', { size: 11, weight: 700, mono: true });
        P.curveArrow(61, 68, 80, 120, 150, 120, { c: 'accent', w: 2, head: 8 });
        chip(P, 154, 104, 56, 32, '코드', 'sky', 13);
        P.arrow(214, 120, 240, 120, { w: 2, head: 7 });
        doc(P, 246, 64, 84, 110, '학습지 2쪽', 'hi', 12);
        P.text(170, 190, '번호는 모델이, 파일·쪽은 코드가', { size: 13, c: 'accent' });
      }},
      sysUser: { w: 340, h: 200, label: '질문이 바뀌어도 system 규칙은 그대로, user의 자료와 질문만 바뀌는 모습', draw(P) {
        P.rrect(10, 20, 110, 150, 12, { fill: 'sky', gap: 6 });
        P.text(65, 44, 'system', { size: 13, weight: 700, mono: true });
        P.text(65, 70, '규칙', { size: 14, weight: 700 });
        P.text(65, 92, '늘 같아요', { size: 12, c: 'ink2' });
        P.face(65, 136, 36, { mood: 'smile' });
        ['질문 1', '질문 2', '질문 3'].forEach((t, i) => {
          const y = 20 + i * 52;
          P.rrect(140, y, 190, 44, 10, { fill: 'hi', gap: 6 });
          P.text(150, y + 18, 'user', { size: 11, weight: 700, mono: true, anchor: 'start' });
          P.text(150, y + 36, t, { size: 11, anchor: 'start' });
          for (let k = 0; k < 3; k++) { P.rrect(204 + k * 40, y + 12, 34, 20, 5, { fill: 'paper', fs: 'solid', w: 1.2 }); P.text(221 + k * 40, y + 26, '[' + (k + 1) + ']', { size: 10, mono: true }); }
        });
        P.text(170, 192, '바뀌는 건 user 쪽', { size: 13, c: 'accent' });
      }},

      /* ---------- L2 문제 그림 ---------- */
      q_noRule: { w: 340, h: 200, label: '규칙 쪽지에서 한 줄을 지우개로 지운 모습과 고민하는 얼굴', draw(P) {
        P.note(20, 16, 170, 150, { fill: 'hi' });
        P.text(105, 40, '시스템 규칙', { size: 14, weight: 700 });
        [62, 88, 114, 140].forEach((y, i) => P.line(36, y, i === 1 ? 116 : 172, y, { c: i === 1 ? 'soft' : 'ink2', w: 2.4 }));
        P.rrect(118, 78, 46, 20, 5, { fill: 'pink', fs: 'solid', w: 1.4 });
        person(P, 268, 196, 'wow', 0.75);
        ask(P, 268, 70, 28);
        P.text(105, 190, '이 줄을 빼면?', { size: 13, c: 'ink2' });
      }},
      q_ruleLine: { w: 340, h: 200, label: '다섯 줄짜리 규칙 초안을 돋보기로 살피는 모습', draw(P) {
        P.note(24, 14, 190, 172, { fill: 'paper' });
        for (let i = 0; i < 5; i++) {
          P.text(40, 50 + i * 28, String(i + 1), { size: 12, weight: 700, c: 'accent', anchor: 'start' });
          P.line(56, 46 + i * 28, 190 - (i % 2) * 24, 46 + i * 28, { c: 'ink2', w: 2.2 });
        }
        lens(P, 252, 74, 22);
        person(P, 296, 196, 'smile', 0.58);
      }},
      q_enumBlank: { w: 340, h: 200, label: '조각 세 개에 붙일 번호가 몇부터 시작할지 묻는 모습', draw(P) {
        [0, 1, 2].forEach(i => {
          const y = 22 + i * 48;
          P.rrect(24, y, 176, 38, 8, { fill: 'hi', gap: 5, w: 1.4 });
          P.rrect(34, y + 9, 30, 20, 5, { fill: 'paper', fs: 'solid', w: 1.4 });
          P.text(49, y + 24, '?', { size: 13, weight: 700, c: 'warm' });
          P.line(76, y + 15, 186, y + 15, { c: 'ink2', w: 1.6 });
          P.line(76, y + 25, 160, y + 25, { c: 'ink2', w: 1.6 });
        });
        P.robot(270, 92, 0.55, { mood: 'wow' });
        P.text(270, 176, '몇 번부터?', { size: 13, c: 'ink2' });
      }},
      q_whyNum: { w: 340, h: 200, label: '짧은 번호 표와 긴 파일 이름 표를 놓고 누가 쓸지 고민하는 모습', draw(P) {
        chip(P, 24, 30, 70, 44, '[1]', 'hi', 18);
        ask(P, 122, 60, 22);
        chip(P, 148, 30, 180, 44, '반복문_학습지.pdf 2쪽', 'sky', 12);
        P.text(170, 108, '누가 쓸까?', { size: 13, c: 'ink2' });
        P.robot(90, 142, 0.45, { mood: 'wow' });
        person(P, 250, 196, 'smile', 0.6);
      }},

      /* ---------- QA 그림 ---------- */
      qa_searchGen: { w: 340, h: 200, label: '돋보기가 엉뚱한 조각을 집어 와 로봇이 곤란해하는 모습', draw(P) {
        lens(P, 56, 66, 28);
        P.text(56, 146, '검색', { size: 14, weight: 700 });
        piece(P, 112, 40, 84, 20, null, 'soft');
        piece(P, 112, 66, 84, 20, null, 'soft');
        piece(P, 112, 92, 84, 20, null, 'soft');
        ask(P, 154, 140, 22, 'bad');
        P.arrow(202, 76, 226, 76, { w: 2, head: 7 });
        P.robot(276, 80, 0.5, { mood: 'dizzy' });
        P.text(276, 146, '생성', { size: 14, weight: 700 });
        P.text(170, 188, '어디부터 고칠까?', { size: 13, c: 'ink2' });
      }},
      qa_sysData: { w: 340, h: 200, label: '규칙 쪽지와 학습지 쪽지를 user와 system 서랍 중 어디에 넣을지 고민하는 모습', draw(P) {
        P.note(24, 12, 116, 60, { fill: 'hi' });
        P.text(82, 38, '모르면', { size: 12, weight: 700 });
        P.text(82, 58, '모른다고', { size: 12, weight: 700 });
        doc(P, 214, 8, 100, 70, '학습지 2쪽', 'paper', 11);
        ask(P, 170, 64, 26);
        P.rrect(24, 110, 120, 56, 10, { fill: 'sky', gap: 6 });
        P.text(84, 144, 'user', { size: 14, weight: 700, mono: true });
        P.rrect(196, 110, 120, 56, 10, { fill: 'sky', gap: 6 });
        P.text(256, 144, 'system', { size: 14, weight: 700, mono: true });
        P.text(170, 192, '어디에 둘까?', { size: 13, c: 'ink2' });
      }},
      qa_whole: { w: 340, h: 200, label: '쌓인 학습지 더미와 많은 학생 얼굴, 어떻게 넣을지 고민하는 모습', draw(P) {
        for (let i = 0; i < 6; i++) doc(P, 14 + i * 10, 14 + i * 10, 70, 90, null, i === 5 ? 'hi' : 'paper');
        P.text(76, 182, '학습지 60개', { size: 13, weight: 700 });
        ask(P, 170, 104, 24);
        const moods = ['smile', 'happy', 'wow', 'wink', 'smile', 'happy'];
        for (let i = 0; i < 6; i++) P.face(212 + (i % 3) * 40, 50 + Math.floor(i / 3) * 44, 30, { mood: moods[i] });
        P.text(252, 144, '학생 150명', { size: 13, weight: 700 });
      }},

      /* ---------- L3 설명 그림 ---------- */
      helperParts: { w: 340, h: 200, label: 'helper.py를 이루는 검색, 프롬프트 조립, Solar 호출 세 부분', draw(P) {
        P.text(170, 22, 'helper.py', { size: 15, weight: 700, mono: true });
        const xs = [14, 124, 234], fills = ['sky', 'hi', 'paper'];
        ['① 검색', '② 프롬프트', '③ 호출'].forEach((t, i) => {
          P.rrect(xs[i], 36, 92, 120, 12, { fill: fills[i], gap: 6 });
          P.text(xs[i] + 46, 58, t, { size: 13, weight: 700 });
          if (i < 2) P.arrow(xs[i] + 94, 96, xs[i] + 108, 96, { w: 2, head: 7 });
        });
        lens(P, 56, 102, 17);
        P.note(146, 72, 48, 64, { fill: 'paper' });
        P.text(166, 96, '[1]', { size: 11, weight: 700, mono: true });
        P.text(166, 120, '[2]', { size: 11, weight: 700, mono: true });
        P.robot(280, 108, 0.38, { mood: 'happy' });
        P.text(60, 182, 'search()', { size: 12, mono: true });
        P.text(170, 182, 'build()', { size: 12, mono: true });
        P.text(280, 182, 'ask()', { size: 12, mono: true });
      }},
      topK: { w: 340, h: 200, label: '점수 순으로 줄 세운 조각 중 위의 세 개만 고르는 모습', draw(P) {
        [0.83, 0.71, 0.52, 0.31, 0.24, 0.18].forEach((s, i) => {
          const y = 14 + i * 26;
          P.rrect(70, y, Math.round(200 * s), 18, 5, { fill: i < 3 ? 'hi' : 'soft', gap: i < 3 ? 5 : 8, w: 1.4 });
          P.text(62, y + 14, s.toFixed(2), { size: 11, mono: true, anchor: 'end' });
        });
        P.line(244, 14, 254, 14, { c: 'accent', w: 2 });
        P.line(254, 14, 254, 84, { c: 'accent', w: 2 });
        P.line(244, 84, 254, 84, { c: 'accent', w: 2 });
        P.text(290, 56, 'k=3', { size: 15, weight: 700, mono: true, c: 'accent' });
        P.text(170, 190, '가까운 순으로 몇 개만', { size: 13, c: 'ink2' });
      }},
      srcTerm: { w: 340, h: 200, label: '터미널에 찍힌 답과 그 아래 번호별 파일과 쪽 목록', draw(P) {
        P.rrect(14, 12, 312, 152, 10, { fill: 'ink', fs: 'solid' });
        P.text(28, 38, '$ python helper.py "…"', { size: 12, mono: true, c: 'paper', anchor: 'start' });
        P.text(28, 66, 'for는 …때 써요[1]', { size: 12, c: 'paper', anchor: 'start' });
        P.text(28, 88, 'while은 …반복해요[2]', { size: 12, c: 'paper', anchor: 'start' });
        P.text(28, 120, '[1] 반복문_학습지.pdf 2쪽', { size: 12, c: 'hi', anchor: 'start' });
        P.text(28, 144, '[2] 반복문_학습지.pdf 3쪽', { size: 12, c: 'hi', anchor: 'start' });
        P.text(170, 190, '번호 → 파일·쪽은 코드가', { size: 13, c: 'accent' });
      }},

      /* ---------- L3 문제 그림 ---------- */
      q_effort: { w: 340, h: 200, label: '추론 손잡이와 temperature 손잡이를 모두 낮게 돌려 둔 모습과 까닭을 묻는 얼굴', draw(P) {
        dial(P, 76, 82, 84, -1.1);
        P.text(76, 150, 'reasoning', { size: 12, mono: true });
        dial(P, 192, 82, 84, -0.8);
        P.text(192, 150, 'temperature', { size: 12, mono: true });
        person(P, 296, 196, 'wow', 0.6);
        ask(P, 296, 70, 26);
        P.text(134, 186, '왜 둘 다 낮게?', { size: 13, c: 'ink2' });
      }},
      q_bigK: { w: 340, h: 200, label: '조각 서른 개를 한꺼번에 밀어 넣는 모습', draw(P) {
        for (let i = 0; i < 12; i++) piece(P, 14 + (i % 3) * 52, 14 + Math.floor(i / 3) * 34, 46, 22, null, i < 3 ? 'hi' : 'soft');
        P.text(88, 164, 'k = 30', { size: 14, weight: 700, mono: true });
        P.arrow(172, 80, 200, 80, { w: 2.4, head: 8 });
        P.robot(258, 82, 0.55, { mood: 'wow' });
        P.text(258, 164, '많을수록 좋을까?', { size: 13, c: 'ink2' });
      }},
      q_queryBlank: { w: 340, h: 200, label: '학생 질문 말풍선과 저장된 조각 사이에 임베딩 모델 이름표가 놓인 모습', draw(P) {
        P.bubble(14, 16, 120, 44, 60, 76);
        P.text(74, 44, '학생 질문', { size: 13, weight: 700 });
        piece(P, 14, 108, 120, 22, null, 'paper');
        piece(P, 22, 136, 120, 22, null, 'paper');
        P.text(80, 184, '저장된 조각', { size: 12, c: 'ink2' });
        chip(P, 172, 30, 156, 32, 'solar-embedding-2-?', 'hi', 11);
        vec(P, 214, 140);
        ask(P, 290, 136, 26);
      }},

      /* ---------- L4 설명 그림 ---------- */
      flowAgent: { w: 340, h: 204, label: '정해진 순서로 흐르는 워크플로와 모델이 다음 할 일을 고르는 에이전트', draw(P) {
        P.text(80, 20, '워크플로', { size: 14, weight: 700 });
        ['검색', '조립', '답'].forEach((t, i) => {
          chip(P, 40, 34 + i * 50, 80, 32, t, 'sky', 13);
          if (i < 2) P.arrow(80, 68 + i * 50, 80, 82 + i * 50, { w: 2, head: 7 });
        });
        P.text(80, 192, '코드가 순서를 정해요', { size: 12, c: 'ink2' });
        P.line(170, 14, 170, 196, { c: 'soft', w: 1.5 });
        P.text(256, 20, '에이전트', { size: 14, weight: 700 });
        chip(P, 186, 36, 52, 26, '검색', 'paper', 11);
        chip(P, 276, 36, 52, 26, '퀴즈', 'paper', 11);
        chip(P, 186, 136, 52, 26, '채점', 'paper', 11);
        chip(P, 276, 136, 52, 26, '답', 'paper', 11);
        P.robot(256, 98, 0.46, { mood: 'proud' });
        P.arrow(236, 76, 222, 66, { c: 'accent', w: 1.8, head: 6 });
        P.arrow(276, 76, 290, 66, { c: 'accent', w: 1.8, head: 6 });
        P.text(256, 192, '모델이 다음 일을 골라요', { size: 12, c: 'ink2' });
      }},
      followUp: { w: 340, h: 200, label: '후속 질문 그거 예시 더를 그대로 검색해 엉뚱한 조각이 나온 모습', draw(P) {
        P.bubble(14, 12, 140, 36, 30, 62, { fill: 'paper' });
        P.text(84, 36, 'for 문이 뭐예요?', { size: 12 });
        P.bubble(14, 70, 140, 36, 34, 124, { fill: 'hi' });
        P.text(84, 94, '그거 예시 더!', { size: 13, weight: 700 });
        person(P, 40, 196, 'smile', 0.55);
        P.arrow(160, 88, 194, 88, { w: 2, head: 7 });
        lens(P, 220, 70, 16);
        piece(P, 256, 40, 72, 22, null, 'soft');
        piece(P, 256, 70, 72, 22, null, 'soft');
        piece(P, 256, 100, 72, 22, null, 'soft');
        ask(P, 292, 152, 24, 'bad');
        P.text(220, 190, '"그거"가 뭐지?', { size: 13, c: 'ink2' });
      }},
      rewriteFig: { w: 340, h: 200, label: '앞 대화를 보고 후속 질문을 혼자 읽히는 질문으로 다시 쓰는 모습', draw(P) {
        chip(P, 14, 20, 124, 36, '그거 예시 더!', 'paper', 13);
        P.text(76, 76, '+ 앞 대화', { size: 12, c: 'ink2' });
        P.arrow(142, 40, 172, 40, { w: 2, head: 7 });
        P.robot(214, 44, 0.42, { mood: 'happy' });
        P.text(214, 92, 'solar-mini4', { size: 11, mono: true });
        P.arrow(214, 98, 214, 118, { w: 2, head: 7 });
        chip(P, 40, 122, 240, 38, 'for 문 예시를 하나 더 보여 줘', 'hi', 13);
        lens(P, 306, 140, 14);
        P.text(170, 188, '이제 검색이 알아들어요', { size: 13, c: 'accent' });
      }},
      keepRecent: { w: 340, h: 200, label: '길게 쌓인 대화 기록 중 아래쪽 최근 네 개만 골라 넣는 모습', draw(P) {
        P.rrect(30, 8, 170, 186, 10, { fill: 'paper', w: 1.6 });
        for (let i = 0; i < 8; i++) { const me = i % 2 === 0; P.rrect(me ? 90 : 42, 18 + i * 21, 100, 15, 6, { fill: i >= 4 ? (me ? 'hi' : 'sky') : 'soft', fs: 'solid', w: 1 }); }
        P.line(208, 102, 216, 102, { c: 'accent', w: 2 });
        P.line(216, 102, 216, 180, { c: 'accent', w: 2 });
        P.line(208, 180, 216, 180, { c: 'accent', w: 2 });
        P.text(274, 52, '오래된 말', { size: 12, c: 'soft' });
        P.text(276, 134, 'history[-4:]', { size: 12, mono: true });
        P.text(276, 158, '최근 4개만', { size: 13, weight: 700, c: 'accent' });
      }},

      /* ---------- L4 문제 그림 ---------- */
      q_whoDecides: { w: 340, h: 200, label: 'helper.py 쪽지를 들여다보며 이것이 무엇인지 묻는 얼굴', draw(P) {
        doc(P, 30, 20, 120, 150, 'helper.py', 'hi', 14);
        lens(P, 196, 92, 24);
        person(P, 286, 196, 'wow', 0.7);
        ask(P, 286, 70, 26);
      }},
      q_followSearch: { w: 340, h: 200, label: '그거 예시 더 보여 줘로 검색했더니 엉뚱한 조각이 온 모습', draw(P) {
        P.bubble(14, 14, 170, 40, 60, 74, { fill: 'hi' });
        P.text(99, 40, '그거 예시 더 보여 줘', { size: 13, weight: 700 });
        lens(P, 60, 112, 22);
        piece(P, 120, 90, 90, 22, null, 'soft');
        piece(P, 120, 118, 90, 22, null, 'soft');
        piece(P, 120, 146, 90, 22, null, 'soft');
        P.robot(276, 100, 0.55, { mood: 'wow' });
        ask(P, 230, 56, 24, 'bad');
      }},
      q_turnOrder: { w: 340, h: 200, label: '뒤섞인 카드: 말풍선, 작은 로봇, 돋보기, 로봇과 조각, 쌓인 기록', draw(P) {
        card(P, 14, 12);
        P.bubble(28, 22, 64, 28, 40, 64);
        card(P, 126, 22);
        P.robot(172, 56, 0.28, { mood: 'happy' });
        card(P, 238, 10);
        lens(P, 280, 40, 13);
        card(P, 46, 110);
        P.robot(76, 142, 0.28, { mood: 'proud' });
        piece(P, 98, 133, 32, 18, null, 'hi');
        card(P, 186, 116);
        P.rrect(200, 126, 60, 10, 4, { fill: 'hi', fs: 'solid', w: 1 });
        P.rrect(214, 142, 56, 10, 4, { fill: 'sky', fs: 'solid', w: 1 });
        P.rrect(200, 158, 60, 10, 4, { fill: 'hi', fs: 'solid', w: 1 });
        ask(P, 116, 100, 20, 'warm');
        ask(P, 314, 124, 22, 'bad');
      }},
      q_historyLong: { w: 340, h: 200, label: '끝없이 길어진 대화 기록과 땀 흘리는 로봇', draw(P) {
        P.rrect(30, 8, 120, 184, 10, { fill: 'paper' });
        for (let i = 0; i < 9; i++) P.rrect(i % 2 ? 70 : 40, 16 + i * 19, 70, 13, 5, { fill: i % 2 ? 'hi' : 'sky', fs: 'solid', w: 1 });
        P.robot(250, 88, 0.6, { mood: 'dizzy' });
        P.drop(302, 46, 7);
        P.text(250, 180, '기록이 너무 길어요', { size: 13, c: 'ink2' });
      }},

      /* ---------- QB 그림 ---------- */
      qb_agentWho: { w: 340, h: 200, label: 'Cursor 창 속 에이전트와 내가 만든 helper.py 쪽지를 나란히 두고 묻는 모습', draw(P) {
        win(P, 14, 20, 140, 120);
        P.robot(84, 90, 0.44, { mood: 'proud' });
        P.text(84, 164, 'Cursor 에이전트', { size: 13, weight: 700 });
        doc(P, 210, 20, 110, 120, 'helper.py', 'hi', 13);
        P.text(265, 164, '내가 만든 것', { size: 13, weight: 700 });
        ask(P, 182, 88, 26);
        P.text(170, 192, '어느 쪽이 에이전트?', { size: 13, c: 'ink2' });
      }},
      qb_rewriteUse: { w: 340, h: 200, label: '다시 쓴 질문 쪽지가 돋보기, 저장소, 기록장 중 어디로 갈지 고민하는 모습', draw(P) {
        chip(P, 50, 14, 240, 36, 'for 문 예시를 하나 더 보여 줘', 'hi', 13);
        P.arrow(140, 56, 86, 92, { c: 'soft', w: 2, head: 7 });
        P.arrow(170, 56, 172, 90, { c: 'soft', w: 2, head: 7 });
        P.arrow(200, 56, 258, 92, { c: 'soft', w: 2, head: 7 });
        lens(P, 68, 120, 18);
        db(P, 148, 96, 50, 56, 'sky');
        P.note(240, 96, 58, 60, { fill: 'paper' });
        P.line(250, 116, 286, 116, { c: 'soft', w: 2 });
        P.line(250, 130, 276, 130, { c: 'soft', w: 2 });
        P.line(250, 144, 286, 144, { c: 'soft', w: 2 });
        ask(P, 172, 190, 22);
      }},
      qb_pageFake: { w: 340, h: 200, label: '답에 적힌 7쪽과 다섯 쪽뿐인 학습지를 견주어 보는 모습', draw(P) {
        P.bubble(14, 12, 200, 40, 58, 86);
        P.text(114, 38, '반복문_학습지.pdf 7쪽', { size: 12, weight: 700 });
        P.robot(56, 118, 0.42, { mood: 'proud' });
        for (let i = 0; i < 5; i++) { P.note(110 + i * 44, 92, 38, 50, { fill: 'paper' }); P.text(129 + i * 44, 124, String(i + 1), { size: 14, weight: 700 }); }
        ask(P, 300, 48, 28, 'bad');
        P.text(220, 176, '학습지는 5쪽까지', { size: 13, c: 'ink2' });
      }},

      /* ---------- L5 설명 그림 ---------- */
      testSet: { w: 340, h: 204, label: '자료 안 질문, 자료 밖 질문, 애매한 질문 세 종류 카드', draw(P) {
        [['자료 안', 'good'], ['자료 밖', 'warm'], ['애매', 'sky']].forEach(([n, c], i) => {
          const x = 14 + i * 110;
          P.rrect(x, 16, 96, 132, 12, { fill: c, gap: 7 });
          P.text(x + 48, 40, n, { size: 14, weight: 700 });
        });
        doc(P, 36, 52, 52, 64, null, 'paper');
        P.text(62, 136, '[1]', { size: 13, weight: 700, mono: true });
        doc(P, 140, 52, 52, 64, null, 'paper');
        ask(P, 206, 90, 22, 'ink');
        P.bubble(250, 56, 64, 44, 272, 118);
        ask(P, 282, 88, 24, 'ink');
        P.text(62, 172, '근거 번호로 답', { size: 12 });
        P.text(172, 172, '자료에 없어요', { size: 12 });
        P.text(282, 172, '되묻기', { size: 12 });
        P.text(170, 196, '세 종류를 섞어 시험해요', { size: 12, c: 'accent' });
      }},
      scoreSheet: { w: 340, h: 200, label: '질문마다 종류, 질문, 근거, 판정 칸이 있는 채점표', draw(P) {
        P.rrect(14, 14, 312, 170, 8, { fill: 'paper', w: 1.8 });
        P.line(14, 40, 326, 40, { w: 1.6 });
        [74, 174, 244].forEach(x => P.line(x, 14, x, 184, { c: 'soft', w: 1.4 }));
        [['종류', 44], ['질문', 124], ['근거', 209], ['판정', 285]].forEach(([t, x]) => P.text(x, 32, t, { size: 12, weight: 700 }));
        const rows = [['안', 'ok', '통과'], ['밖', '-', '통과'], ['애매', '-', '통과'], ['안', 'no', '실패']];
        rows.forEach(([k, g, j], i) => {
          const y = 40 + i * 36;
          if (i) P.line(14, y, 326, y, { c: 'soft', w: 1.2 });
          P.text(44, y + 23, k, { size: 12 });
          P.line(86, y + 18, 162 - (i % 2) * 20, y + 18, { c: 'ink2', w: 2 });
          if (g === 'ok') tick(P, 209, y + 18, 8); else if (g === 'no') cross(P, 209, y + 18, 7); else P.line(201, y + 18, 217, y + 18, { c: 'soft', w: 2 });
          P.text(285, y + 23, j, { size: 12, weight: 700, c: j === '통과' ? 'good' : 'bad' });
        });
      }},
      cutLine: { w: 340, h: 200, label: '자료 안 질문과 자료 밖 질문의 조각 점수 막대와 기준선', draw(P) {
        [[0.83, 0.71, 0.52, 40], [0.34, 0.29, 0.22, 206]].forEach(g => {
          for (let i = 0; i < 3; i++) { const hh = Math.round(g[i] * 150); P.rect(g[3] + i * 32, 160 - hh, 24, hh, { fill: g[3] < 100 ? 'hi' : 'soft', w: 1.4 }); }
        });
        P.line(24, 160, 316, 160, { w: 1.8 });
        P.line(24, 85, 316, 85, { c: 'bad', w: 2 });
        P.text(318, 78, 'CUT 0.5', { size: 11, weight: 700, c: 'bad', anchor: 'end' });
        P.text(84, 184, '자료 안 질문', { size: 13, weight: 700 });
        P.text(250, 184, '자료 밖 질문', { size: 13, weight: 700 });
      }},
      judgeFig: { w: 340, h: 200, label: '채점 로봇이 자료와 답을 비교하고 선생님이 몇 개를 다시 확인하는 모습', draw(P) {
        doc(P, 14, 16, 70, 84, '자료', 'paper', 12);
        P.rrect(14, 112, 70, 50, 8, { fill: 'hi', gap: 5 });
        P.text(49, 142, '답', { size: 14, weight: 700 });
        P.arrow(90, 90, 114, 90, { w: 2, head: 7 });
        P.robot(158, 88, 0.5, { mood: 'proud' });
        chip(P, 196, 40, 70, 30, '통과', 'good', 13);
        chip(P, 196, 82, 70, 30, '불통과', 'warm', 13);
        person(P, 302, 196, 'smile', 0.58);
        P.text(160, 190, '사람이 몇 개는 다시 봐요', { size: 12, c: 'ink2' });
      }},

      /* ---------- L5 문제 그림 ---------- */
      q_outQ: { w: 340, h: 200, label: '반복문 학습지를 둘러싼 울타리와 그 안팎을 가늠하는 얼굴', draw(P) {
        P.circle(120, 94, 164, { c: 'accent', w: 2 });
        doc(P, 82, 44, 76, 100, '반복문', 'hi', 13);
        person(P, 286, 196, 'wow', 0.7);
        ask(P, 250, 60, 26);
        P.text(120, 194, '자료의 울타리', { size: 13, c: 'ink2' });
      }},
      q_cutWhy: { w: 340, h: 200, label: '자료에 없어요라는 답 아래에 출처 세 줄이 찍힌 터미널과 갸웃하는 얼굴', draw(P) {
        P.rrect(12, 14, 232, 132, 10, { fill: 'ink', fs: 'solid' });
        P.text(24, 40, '$ python helper.py "급식…"', { size: 11, mono: true, c: 'paper', anchor: 'start' });
        P.text(24, 66, '자료에 없어요.', { size: 12, c: 'paper', anchor: 'start' });
        ['[1] 반복문_학습지.pdf 2쪽', '[2] 반복문_학습지.pdf 4쪽', '[3] 리스트_학습지.pdf 1쪽'].forEach((t, i) => P.text(24, 94 + i * 18, t, { size: 11, c: 'hi', anchor: 'start' }));
        person(P, 294, 196, 'wow', 0.64);
        ask(P, 294, 62, 26);
      }},
      q_sheetLine: { w: 340, h: 200, label: '다섯 줄짜리 채점표 클립보드와 연필', draw(P) {
        P.rrect(30, 20, 180, 172, 10, { fill: 'paper', w: 2 });
        P.rrect(90, 10, 60, 18, 5, { fill: 'soft', fs: 'solid', w: 1.4 });
        for (let i = 0; i < 5; i++) {
          const y = 56 + i * 28;
          P.line(44, y, 124, y, { c: 'ink2', w: 2 });
          P.rrect(146, y - 10, 48, 16, 5, { fill: 'hi', fs: 'solid', w: 1.2 });
        }
        P.line(250, 150, 300, 70, { c: 'warm', w: 9 });
        P.line(246, 156, 250, 150, { c: 'ink', w: 3 });
        P.face(292, 170, 32, { mood: 'wow' });
      }},

      /* ---------- 형성평가 그림 ---------- */
      t_fest: { w: 340, h: 200, label: '연수장 노트북 속 helper가 축제 날짜를 자신 있게 답하고 옆자리 선생님이 놀란 모습', draw(P) {
        P.text(14, 20, '연수 1일차 15:00', { size: 12, weight: 700, c: 'accent', anchor: 'start' });
        laptop(P, 30, 40, 170, 100, 'paper');
        P.text(115, 76, '축제가 언제예요?', { size: 12, c: 'ink2' });
        P.text(115, 110, '10월 24일이에요[1]', { size: 13, weight: 700 });
        person(P, 272, 196, 'wow', 0.72);
        P.drop(310, 100, 6);
      }},
      t_prepOrder: { w: 340, h: 200, label: '뒤섞인 카드: 저장소, PDF 쪽지, 숫자 막대, 조각 두 개', draw(P) {
        card(P, 20, 14);
        db(P, 44, 22, 44, 48, 'sky');
        card(P, 140, 30);
        doc(P, 166, 36, 40, 52, 'PDF', 'paper', 10);
        card(P, 240, 14);
        vec(P, 272, 62);
        card(P, 100, 112);
        piece(P, 110, 120, 72, 18, null, 'hi');
        piece(P, 110, 146, 72, 18, null, 'hi');
        ask(P, 60, 124, 20, 'warm');
        ask(P, 254, 150, 24, 'bad');
      }},
      t_paramBlank: { w: 340, h: 200, label: '빈칸 두 개를 뜻하는 바늘 없는 손잡이 두 개', draw(P) {
        dial(P, 92, 80, 84, null);
        P.text(92, 90, '?', { size: 26, weight: 700, c: 'warm' });
        P.text(92, 148, '빈칸 ①', { size: 13, weight: 700 });
        dial(P, 236, 80, 84, null);
        P.text(236, 90, '?', { size: 26, weight: 700, c: 'warm' });
        P.text(236, 148, '빈칸 ②', { size: 13, weight: 700 });
        P.text(164, 186, '자료를 읽고 정리하는 일이라면?', { size: 12, c: 'ink2' });
      }},
      t_designLine: { w: 340, h: 200, label: '다섯 줄짜리 설계 메모와 갸웃하는 로봇', draw(P) {
        P.note(24, 14, 196, 172, { fill: 'hi' });
        P.text(122, 38, '설계 메모', { size: 14, weight: 700 });
        for (let i = 0; i < 5; i++) {
          P.text(40, 70 + i * 24, String(i + 1), { size: 12, weight: 700, c: 'accent', anchor: 'start' });
          P.line(56, 66 + i * 24, 196 - (i % 3) * 20, 66 + i * 24, { c: 'ink2', w: 2 });
        }
        P.robot(282, 100, 0.5, { mood: 'wow' });
        ask(P, 282, 182, 24);
      }},
      t_agentLab: { w: 340, h: 200, label: '연수 1일차 보조 agent 실습장 화이트보드에 두 칸 표가 비어 있는 모습', draw(P) {
        P.rrect(14, 14, 250, 150, 8, { fill: 'paper', w: 2 });
        P.line(139, 24, 139, 154, { w: 1.6 });
        P.text(76, 40, '자료가 바뀌면', { size: 13, weight: 700 });
        P.text(202, 40, '질문마다', { size: 13, weight: 700 });
        [64, 96, 128].forEach(y => {
          P.rrect(28, y - 10, 96, 20, 5, { c: 'soft', w: 1.4 });
          P.rrect(154, y - 10, 96, 20, 5, { c: 'soft', w: 1.4 });
        });
        P.circle(302, 36, 40, { fill: 'accent', fs: 'solid', w: 1.6 });
        P.text(302, 44, '1', { size: 20, weight: 700, c: 'paper' });
        person(P, 302, 196, 'smile', 0.6);
        P.text(139, 188, '1일차 15:00 보조 agent 실습', { size: 12, c: 'ink2' });
      }},
      t_followUp: { w: 340, h: 200, label: '앞 질문 다음의 짧은 후속 질문과 엉뚱한 조각을 집은 돋보기', draw(P) {
        P.bubble(14, 12, 150, 34, 30, 60, { fill: 'paper' });
        P.text(89, 34, 'for 문이 뭐예요?', { size: 12 });
        P.bubble(14, 66, 180, 36, 34, 120, { fill: 'hi' });
        P.text(104, 90, '그럼 예시 하나만 더요', { size: 12, weight: 700 });
        person(P, 40, 196, 'smile', 0.55);
        lens(P, 236, 70, 16);
        piece(P, 210, 110, 110, 22, null, 'soft');
        piece(P, 210, 138, 110, 22, null, 'soft');
        ask(P, 300, 52, 24, 'bad');
      }},
      t_agentLater: { w: 340, h: 200, label: '대회 트로피를 바라보며 helper를 어떻게 키울지 고민하는 모습', draw(P) {
        doc(P, 20, 40, 90, 110, 'helper', 'hi', 13);
        P.arrow(118, 96, 168, 96, { w: 2.4, head: 9, c: 'accent' });
        P.path('M196 46 L256 46 L250 92 Q226 112 202 92 Z', { fill: 'hi', gap: 5 });
        P.path('M196 54 Q178 62 198 78', { w: 2 });
        P.path('M256 54 Q274 62 254 78', { w: 2 });
        P.rect(220, 104, 12, 16, { w: 1.6 });
        P.rrect(206, 120, 40, 12, 4, { fill: 'soft', fs: 'solid', w: 1.4 });
        ask(P, 226, 166, 24);
        person(P, 304, 196, 'wow', 0.56);
      }},
      t_shortDoc2: { w: 340, h: 200, label: '네 쪽짜리 학습지와 오늘 안에라고 적힌 시계', draw(P) {
        for (let i = 0; i < 4; i++) P.note(20 + i * 12, 30 + i * 8, 70, 92, { fill: i === 3 ? 'hi' : 'paper' });
        P.text(73, 172, '학습지 4쪽', { size: 13, weight: 700 });
        P.circle(196, 84, 70, { fill: 'paper', w: 2 });
        P.line(196, 84, 196, 60, { w: 2.4 });
        P.line(196, 84, 214, 92, { w: 2.4 });
        P.text(196, 146, '오늘 안에', { size: 13, weight: 700, c: 'warm' });
        person(P, 292, 196, 'wow', 0.6);
      }},
      t_cite4: { w: 340, h: 200, label: '조각은 세 개인데 답 끝에 [5]가 붙은 모습', draw(P) {
        P.bubble(14, 14, 190, 44, 80, 90);
        P.text(109, 42, '0부터 4까지 반복해요[5]', { size: 12, weight: 700 });
        P.robot(80, 124, 0.42, { mood: 'proud' });
        piece(P, 210, 76, 110, 24, 1, 'hi');
        piece(P, 210, 106, 110, 24, 2, 'hi');
        piece(P, 210, 136, 110, 24, 3, 'hi');
        ask(P, 300, 50, 28, 'bad');
        P.text(265, 186, '넣은 조각은 셋', { size: 12, c: 'ink2' });
      }},
      t_judge: { w: 340, h: 200, label: '질문 40개 묶음과 38개 통과라는 채점 로봇, 갸웃하는 선생님', draw(P) {
        for (let i = 0; i < 4; i++) P.note(16 + i * 8, 24 + i * 8, 70, 90, { fill: i === 3 ? 'sky' : 'paper' });
        P.text(75, 92, '40', { size: 24, weight: 700 });
        P.text(75, 160, '질문 40개', { size: 13, weight: 700 });
        P.arrow(126, 80, 148, 80, { w: 2, head: 7 });
        P.robot(184, 80, 0.48, { mood: 'proud' });
        chip(P, 136, 128, 96, 30, '38개 통과', 'good', 13);
        person(P, 292, 196, 'wow', 0.62);
        ask(P, 292, 70, 26);
      }}
    },

    items: [
    /* =================== L1 =================== */
    { id: 'L1', type: 'lesson', title: 'RAG 한눈에', sub: '준비 단계와 질문 단계, 다시 학습 대신 찾아 주기', min: 10, steps: [
      { t: 'say', h: '모델은 내 수업자료를 몰라요', fig: 'noKnow', p: [
        'Solar는 많은 글로 학습했지만, <b>우리 반 학습지와 수행평가 안내문은 본 적이 없어요</b>. <code>solar-pro4</code>의 학습 데이터는 2026년 2월 기준이고, 내 컴퓨터 속 PDF는 그 안에 없어요.',
        '그래도 물으면 멈추지 않고 그럴듯한 다음 글자 조각을 이어 써요. 과정 1 단원 2에서 본 <b>환각</b>이에요. "이번 수행평가 범위는?"에 그럴듯한 범위를 지어내는 식이죠.',
        '고치는 길은 단순해요. 답에 필요한 자료를 <b>질문과 함께 프롬프트에 넣어 주는 것</b>. 필요한 조각을 찾아(Retrieval) 덧붙여(Augmented) 답을 만들게(Generation) 하는 이 방법을 <b>RAG</b>(검색 증강 생성)라고 불러요.'
      ]},
      { t: 'say', h: 'RAG는 두 줄로 일해요: 준비 단계와 질문 단계', fig: 'ragFlow', table: { head: ['', '하는 일', '언제', '배운 곳'], rows: [
        ['① 준비', 'Document Parse로 읽기 → 조각 나누기(파일·쪽 붙이기) → <code>passage</code> 임베딩 → <code>vectors.json</code>에 저장', '자료가 바뀔 때만', '과정 2 단원 1·3'],
        ['② 질문', '질문 임베딩(<code>query</code>) → 가까운 조각 검색 → 프롬프트 조립 → Solar → 답 + 출처', '질문마다', '이번 단원'] ] }, p: [
        '위 줄은 도서관에 책을 꽂고 색인 카드를 만들어 두는 일, 아래 줄은 질문이 올 때마다 카드를 뒤져 필요한 쪽만 펼쳐 주는 일이에요.',
        '준비 단계는 앞 단원에서 거의 다 했어요. 이번 단원은 아래 줄을 이어 붙여 <code>helper.py</code>를 완성해요. 업스테이지 공식 자료의 RAG 예제도 같은 모양이에요: 읽기 → 나누기 → 임베딩 → 검색 → 답.'
      ]},
      { t: 'say', h: '질문 하나에 일어나는 일', fig: 'askTrip', p: [
        '학생이 "for와 while은 언제 달라요?"라고 물으면, 먼저 질문을 <code>solar-embedding-2-query</code>로 숫자 목록(벡터)으로 바꿔요. 저장해 둔 조각 벡터들과 코사인 유사도를 재서 가장 가까운 조각 몇 개(<b>top-k</b>)를 골라요.',
        '고른 조각에 [1] [2] [3] 번호를 붙여 규칙·질문과 함께 <code>messages</code>로 묶고 <code>solar-pro4</code>에 보내요. Solar는 그 조각을 근거로 답하고, 문장 끝에 근거 번호를 달아요.',
        '마지막으로 코드가 번호를 파일 이름과 쪽으로 바꿔 답 아래에 찍어요. 학생은 "학습지 2쪽"을 펼쳐 직접 확인할 수 있어요. 수업에서는 이게 <b>출처를 확인하는 습관</b>으로 이어져요.'
      ]},
      { t: 'say', h: '왜 모델을 다시 학습시키지 않을까요', fig: 'fineVsRag', table: { head: ['', '다시 학습(파인튜닝)', 'RAG(찾아서 넣어 주기)'], rows: [
        ['자료가 바뀌면', '다시 학습해야 해요', '바뀐 파일만 다시 준비해요'],
        ['출처 보여 주기', '어려워요(배운 것이 섞여요)', '조각마다 파일·쪽이 붙어 있어요'],
        ['드는 것', '학습 데이터·시간·비용', '임베딩 비용(아주 싸요)과 조금 긴 프롬프트'],
        ['잘 맞는 일', '말투·형식 길들이기', '"이 자료에 따르면" 답하기'] ] }, p: [
        '"내 자료를 모델에 가르치면 되지 않나?" 싶지만, 수업자료는 해마다, 단원마다 바뀌어요. 바뀔 때마다 모델을 다시 학습시키는 건 너무 무거워요.',
        'RAG는 모델은 그대로 두고 <b>필요한 자료를 그때그때 옆에 펼쳐 주는</b> 방식이에요. 오픈북 시험을 떠올리면 돼요. 학습지를 고치면 그 파일만 다시 파싱·임베딩하면 끝이에요.'
      ]},
      { t: 'say', h: '자료가 짧으면 통째로 넣어도 돼요', fig: 'wholeVsRag', table: { head: ['', '통째로 넣기', 'RAG'], rows: [
        ['준비', '파싱만', '파싱·조각·임베딩·저장'],
        ['질문당 비용', '자료 전체만큼', '조각 몇 개만큼'],
        ['출처', '쪽 번호를 달아 넣으면 돼요', '조각마다 파일·쪽'],
        ['잘 맞을 때', '학습지 몇 장, 한두 차시', '여러 단원·여러 해 자료'] ] }, p: [
        '<code>solar-pro4</code>의 컨텍스트 창은 <b>512K</b> 토큰이에요(과정 1 단원 2). 학습지 몇 장 정도면 검색 없이 Document Parse로 얻은 markdown을 <b>통째로</b> 넣어도 돼요. 공식 자료에도 markdown을 Chat API에 바로 넣어 묻는 방법이 나와요.',
        '대신 질문할 때마다 자료 전체가 입력 토큰으로 들어가요. 정가(지금은 할인 중이라 더 쌀 수 있어요)로 어림하면, 학생 30명이 10번씩 물을 때 자료가 5만 토큰이면 약 $4.6, 조각 몇 개만 넣는 RAG(질문당 입력 약 2천 토큰)는 약 $0.29예요.',
        '자료가 길수록 관련 없는 글이 섞여 답이 흐려지고 느려지기도 해요. <b>짧고 잠깐 쓸 자료는 통째로, 많고 오래 쓸 자료는 RAG</b>로 골라요.'
      ]},
      { t: 'q', kind: 'mc', fig: 'q_fakeDate', q: '자료를 넣지 않은 수업 챗봇에 학생이 "이번 수행평가 범위가 어디까지예요?"라고 물었더니, Solar가 그럴듯한 범위를 말했어요. 왜 이런 일이 생길까요?',
        opts: ['Solar가 우리 학교 누리집을 찾아보고 답했다', '우리 반 자료를 본 적이 없어, 그럴듯한 다음 글을 이어 썼다', 'temperature가 낮아서 늘 맞는 답이 나왔다', '학습 데이터 기준 시점 뒤의 일이라 일부러 꾸며 냈다'], a: 1,
        why: '모델은 우리 반 자료를 본 적이 없어요. 그래도 물으면 그럴듯한 다음 글자 조각을 이어 써요. 그래서 근거 자료를 함께 넣어 주는 RAG가 필요해요.',
        ex: ['이 챗봇은 인터넷을 찾아보지 않아요. 받은 프롬프트로만 답을 만들어요.', '', 'temperature는 무작위성만 정해요. 낮아도 모르는 사실이 맞게 나오지 않아요.', '"일부러"가 아니에요. 모델은 다음 조각을 예측할 뿐, 꾸밀 뜻이 없어요.'] },
      { t: 'q', kind: 'order', fig: 'q_askOrder', q: '학생이 질문을 보낸 뒤 helper가 하는 일을 순서대로 쌓아 보세요.',
        items: ['질문을 query 모델로 임베딩한다', '질문 벡터와 가까운 조각 k개를 고른다', '규칙·번호 붙인 조각·질문으로 messages를 만든다', 'Solar가 조각을 근거로 답을 만든다', '답 아래에 번호별 파일·쪽을 보여 준다'],
        why: '벡터가 있어야 가까운 조각을 고르고, 조각이 있어야 messages를 만들고, 답이 나와야 그 번호를 파일·쪽으로 바꿔 보여 줄 수 있어요.' },
      { t: 'q', kind: 'mc', fig: 'q_reprep', q: '3단원 학습지의 오타를 고쳐 새 PDF로 바꿨어요. helper가 고친 내용으로 답하게 하려면 무엇을 다시 해야 할까요?',
        opts: ['Solar 모델을 새 학습지로 다시 학습시킨다', '시스템 규칙에 "새 학습지를 봐"라고 적는다', '바뀐 학습지만 다시 파싱·조각·임베딩해 저장한다', '아무것도 안 해도 Solar가 새 PDF를 읽는다'], a: 2,
        why: '자료가 바뀌면 준비 단계만 다시 해요. 바뀐 파일을 파싱하고, 조각 내고, passage로 임베딩해 <code>vectors.json</code>을 고치면 질문 단계는 그대로 써요.',
        ex: ['모델은 그대로 둬요. 자료를 찾아 넣어 주는 게 RAG예요.', '규칙을 바꿔도 저장된 조각은 옛 학습지 그대로예요.', '', 'Solar는 내 폴더의 PDF를 직접 읽지 않아요. 저장된 조각만 받아요.'] },
      { t: 'q', kind: 'mc', fig: 'q_shortDoc', q: '통째로 넣기와 RAG를 비교한 말로 <b>맞는</b> 것은?',
        opts: ['통째로 넣기는 512K를 넘는 큰 자료도 알아서 잘라 모두 넣어 준다', 'RAG는 질문마다 자료 전체를 보내서 통째로 넣기보다 늘 더 비싸다', '512K 창이 있으니 이제 RAG는 쓸 일이 없다', '통째로 넣기는 준비가 쉽지만, 질문마다 자료 전체 토큰이 든다'], a: 3,
        why: '통째로 넣기는 파싱만 하면 되지만, 질문할 때마다 자료 전체가 입력 토큰으로 들어가요. 자료가 짧고 잠깐 쓸 때 잘 맞아요.',
        ex: ['창이 512K라는 건 그만큼까지만 들어간다는 뜻이에요. 알아서 잘라 주지 않아요.', '거꾸로예요. RAG는 관련 조각 몇 개만 보내요.', '자료가 많거나 오래 쓰면 RAG가 비용·정확도에서 유리해요.', ''] },
      { t: 'sum', pts: ['모델은 내 수업자료를 모른다. RAG는 질문에 맞는 조각을 찾아(검색) 프롬프트에 붙여(증강) 답하게(생성) 한다.', '준비 단계(파싱 → 조각 → passage 임베딩 → 저장)는 자료가 바뀔 때만, 질문 단계(query 임베딩 → 검색 → 조립 → Solar → 답 + 출처)는 질문마다.', '다시 학습 대신 자료를 찾아 넣어 준다. 자료가 짧으면 512K 창에 통째로 넣어도 되지만 질문마다 비용이 쌓인다.'] }
    ]},

    /* =================== L2 =================== */
    { id: 'L2', type: 'lesson', title: 'messages 조립하기', sub: '시스템 규칙, 번호 붙인 근거, 출처 표시', min: 12, steps: [
      { t: 'say', h: '조립한 messages는 이렇게 생겼어요', fig: 'msgSandwich', code: { lang: 'plain', src: src([
        'system: (규칙 다섯 줄)',
        'user:',
        '  [자료]',
        '  [1] 반복문_학습지.pdf 2쪽',
        '  for는 반복할 횟수가 정해졌을 때 써요.',
        '  [2] 반복문_학습지.pdf 3쪽',
        '  while은 조건이 참인 동안 반복해요.',
        '  [질문]',
        '  for와 while은 언제 달라요?'
      ]) }, p: [
        '프롬프트 조립은 검색 결과를 Solar가 읽을 <code>messages</code> 목록으로 바꾸는 일이에요. 과정 1에서 본 <code>system</code>·<code>user</code> 역할을 그대로 써요.',
        '<code>system</code>에는 늘 같은 <b>규칙</b>, <code>user</code>에는 질문마다 바뀌는 <b>[자료]</b>와 <b>[질문]</b>이 들어가요. [자료]·[질문] 같은 표시는 프롬프트 기초에서 배운 칸 나누기예요. 어디까지가 자료이고 어디부터 질문인지 헷갈리지 않게 해요.'
      ]},
      { t: 'say', h: '규칙 ①: 자료로만, 없으면 "자료에 없어요."', fig: 'ruleNo', p: [
        '규칙이 없으면 Solar는 자료에 없는 내용도 일반 지식이나 그럴듯한 추측으로 채워요. 학생은 그 말이 학습지에 있는 건지 알 수 없어요.',
        '그래서 "<b>[자료]에 있는 내용으로만 답해</b>"와 "<b>자료에 없으면 \'자료에 없어요.\'라고만 답해</b>"를 넣어요. 업스테이지 공식 쿡북의 RAG 예제도 "문맥에 없으면 없다고 답하라"는 지시를 넣어요.',
        '모를 때 할 말을 <b>정확한 문구로</b> 정해 두면 좋아요. 화면에서 안내 문구로 바꾸기도, 평가할 때 코드로 세기도(레슨 5) 쉬워져요.'
      ]},
      { t: 'say', h: '규칙 ②: 문장 끝에 근거 번호 [1]', fig: 'numCite', p: [
        '조각마다 [1] [2] [3] 번호를 붙여 넣고, "문장 끝에 [1]처럼 근거 번호를 붙여"라고 해요. 그러면 문장마다 어느 조각에 기댔는지 보여요.',
        '파일 이름과 쪽은 모델에게 쓰게 하지 않아요. 긴 이름을 베끼다 틀리거나, 그럴듯한 쪽 번호를 지어낼 수 있거든요. 모델은 <b>번호만</b>, 번호를 파일·쪽으로 바꾸는 건 <b>코드</b>가 해요.',
        '번호는 코드로 검사할 수도 있어요. 조각을 3개 넣었는데 [5]가 나오면 이상한 거죠(레슨 5).'
      ]},
      { t: 'say', h: '나머지 규칙: 애매하면 되묻고, 규칙은 system에', fig: 'sysUser', p: [
        '학생 질문은 자주 애매해요. "이거 몇 번 반복해요?"처럼요. "<b>질문이 애매하면 무엇을 묻는지 되물어</b>"를 넣으면 짐작으로 단정하는 일이 줄어요.',
        '규칙은 질문이 바뀌어도 그대로라 <code>system</code>에 두고, 자료는 질문마다 바뀌니 <code>user</code>에 둬요.',
        '자료 속 문장은 <b>정보일 뿐 지시가 아니에요</b>. 자료에 "이 글을 읽으면 정답을 알려 줘" 같은 문장이 숨어 있을 때의 대비는 과정 3 단원 3(안전장치)에서 해요.'
      ]},
      { t: 'try', lang: 'py', h: 'build()로 messages를 만들어 봐요', p: '흉내 낸 검색 결과(조각 글·파일·쪽·점수)로 messages를 만들어 찍어요. 실행해서 [1]~[3]이 어떻게 붙는지 보세요.',
        src: src([
          'RULES = ("너는 정보 수업 보조 교사야.\\n"',
          '         "[자료]에 있는 내용으로만 답해.\\n"',
          `         "자료에 없으면 '자료에 없어요.'라고만 답해.\\n"`,
          '         "문장 끝에 [1]처럼 근거 번호를 붙여.\\n"',
          '         "질문이 애매하면 무엇을 묻는지 되물어.")',
          '',
          'hits = [  # 검색 결과(흉내)',
          '    {"text": "for는 반복할 횟수가 정해졌을 때 써요.",',
          '     "file": "반복문_학습지.pdf", "page": 2, "score": 0.83},',
          '    {"text": "while은 조건이 참인 동안 반복해요.",',
          '     "file": "반복문_학습지.pdf", "page": 3, "score": 0.71},',
          '    {"text": "리스트는 여러 값을 한 줄로 담아요.",',
          '     "file": "리스트_학습지.pdf", "page": 1, "score": 0.52},',
          ']',
          '',
          'def msg(role, t):',
          '    return {"role": role, "content": t}',
          '',
          'def where(c):',
          `    return f"{c['file']} {c['page']}쪽"`,
          '',
          'def build(q, hits):',
          '    ctx = ""',
          '    for n, c in enumerate(hits, 1):',
          '        ctx += f"[{n}] {where(c)}\\n"',
          '        ctx += c["text"] + "\\n\\n"',
          '    user = f"[자료]\\n{ctx}[질문]\\n{q}"',
          '    return [msg("system", RULES),',
          '            msg("user", user)]',
          '',
          'msgs = build("for와 while은 언제 달라요?", hits)',
          'for m in msgs:',
          '    print("=====", m["role"], "=====")',
          '    print(m["content"])'
        ]),
        note: '해 볼 것: ① 질문을 바꿔 보세요. ② build()가 score 0.6보다 낮은 조각은 빼도록 고쳐 보세요(레슨 5에서 다시 만나요). ③ RULES에서 한 줄을 지우고, 그 줄이 맡던 일을 말해 봐요.' },
      { t: 'q', kind: 'mc', fig: 'q_noRule', q: '시스템 규칙에서 "자료에 없으면 \'자료에 없어요.\'라고만 답해"를 빼면 어떤 일이 생기기 쉬울까요?',
        opts: ['자료 밖 질문에 일반 지식이나 지어낸 내용으로 답한다', '검색이 조각을 하나도 찾지 못한다', '모든 질문에 "자료에 없어요."라고 답한다', 'API가 요청 모양이 틀렸다며 400 오류를 낸다'], a: 0,
        why: '모를 때 할 일을 정해 주지 않으면 Solar는 빈칸을 그럴듯한 글로 채워요. 학생은 그게 자료에 있는 말인지 구별하기 어려워요.',
        ex: ['', '검색은 규칙과 상관없이 가까운 조각을 찾아요.', '거꾸로예요. 규칙을 넣었을 때 자료 밖 질문에 이렇게 답해요.', '규칙 문장은 내용일 뿐이에요. 빼도 요청 모양은 그대로예요.'] },
      { t: 'q', kind: 'line', fig: 'q_ruleLine', q: '보조 에이전트의 시스템 규칙 초안이에요. <b>빼야 할 줄</b>을 눌러 보세요.', lang: 'plain', code: src([
        '너는 정보 수업 보조 교사야.',
        '[자료]에 있는 내용으로만 답해.',
        '자료에 없으면 네가 아는 걸로 채워 줘.',
        '문장 끝에 [1]처럼 근거 번호를 붙여.',
        '질문이 애매하면 무엇을 묻는지 되물어.'
      ]), a: 2,
        why: '"아는 걸로 채워 줘"는 자료 밖 내용을 섞으라는 말이라 둘째 줄과 부딪쳐요. 학생은 어디까지가 자료인지 알 수 없게 돼요. "자료에 없으면 \'자료에 없어요.\'라고만 답해"로 바꿔요.' },
      { t: 'q', kind: 'blank', fig: 'q_enumBlank', q: '조각에 [1]부터 번호를 붙이려 해요. 빈칸에 들어갈 것은?', lang: 'py', code: src([
        'for n, c in enumerate(hits, [[1]]):',
        '    ctx += f"[{n}] {where(c)}\\n"'
      ]),
        opts: ['0', '3', '1', 'n'], a: 2,
        why: '<code>enumerate</code>의 둘째 값은 번호를 몇부터 셀지예요. 1을 주면 [1] [2] [3]이 붙어 규칙의 "[1]처럼"과 맞아요.',
        ex: ['0이면 [0]부터 붙어요. 사람에게 보여 줄 번호로는 어색하고 규칙 예시와도 어긋나요.', '3이면 [3] [4] [5]가 붙어, 넣은 조각 수와 번호가 맞지 않아요.', '', 'n은 반복하면서 생기는 이름이라 여기서는 아직 없어요(NameError).'] },
      { t: 'q', kind: 'mc', fig: 'q_whyNum', q: '모델에게는 "[1]" 같은 번호만 쓰게 하고, 파일 이름·쪽은 코드가 붙이는 까닭으로 가장 알맞은 것은?',
        opts: ['번호가 파일 이름보다 토큰이 더 많이 들어 답이 자세해지니까', '모델은 이름·쪽을 지어낼 수 있고, 번호는 코드로 확인돼서', 'Solar는 한국어로 된 파일 이름이나 쪽 번호를 쓰지 못해서', '번호를 쓰게 하면 검색 단계에서 조각을 더 정확히 찾아서'], a: 1,
        why: '파일·쪽은 조각에 이미 정확히 붙어 있어요. 모델은 번호만 가리키고, 코드가 그 번호로 조각 정보를 찾아 찍으면 틀릴 일이 없어요. 번호가 범위 안인지도 코드로 검사해요.',
        ex: ['번호는 오히려 더 짧아요. 짧고 확인하기 쉬워서 써요.', '', 'Solar는 한국어를 잘 써요. 문제는 정확하게 베끼느냐예요.', '번호는 답을 만든 뒤의 일이라 검색과는 상관없어요.'] },
      { t: 'sum', pts: ['messages = system(늘 같은 규칙) + user([자료]에 번호 붙인 조각 + [질문]).', '규칙: 자료로만 답하기, 없으면 "자료에 없어요.", 문장 끝에 [1] 근거 번호, 애매하면 되묻기.', '모델은 번호만 쓰고, 번호 → 파일·쪽은 코드가 붙인다. 번호는 1부터, 넣은 조각 수 안에서.'] }
    ]},

    /* =================== QA =================== */
    { id: 'QA', type: 'quiz', title: '헷갈림 퀴즈 ①', sub: '검색과 생성, 규칙과 자료, 통째로 넣기와 RAG', min: 3, steps: [
      { t: 'q', kind: 'mc', fig: 'qa_searchGen', q: 'helper가 엉뚱한 답을 해서 검색된 조각을 찍어 보니, 질문과 상관없는 조각 셋이었어요. 먼저 고칠 쪽은?',
        opts: ['생성 쪽: temperature를 0으로 낮춘다', '생성 쪽: 시스템 규칙을 더 길고 자세하게 쓴다', '생성 쪽: reasoning_effort를 "high"로 올린다', '검색 쪽: 조각 나누기·제목 붙이기·질문 다듬기를 본다'], a: 3,
        why: '검색은 재료를 찾는 일, 생성은 그 재료로 글을 쓰는 일이에요. 재료(조각)부터 엉뚱하면 생성 쪽을 아무리 바꿔도 답이 나아지지 않아요. 과정 2 단원 3의 검색 점검으로 돌아가요.',
        ex: ['재료가 틀렸는데 무작위성만 줄이면, 틀린 답이 일정하게 나올 뿐이에요.', '규칙이 좋아도 넣어 준 조각이 엉뚱하면 근거가 없어요.', '추론을 켜도 엉뚱한 조각에서 맞는 근거가 생기지 않아요. 느리고 비싸지기만 해요.', ''] },
      { t: 'q', kind: 'mc', fig: 'qa_sysData', q: '"자료에 없으면 \'자료에 없어요.\'라고만 답해"라는 규칙과, 검색된 "반복문 학습지 2쪽" 조각은 각각 어디에 두는 게 알맞을까요?',
        opts: ['둘 다 system에. 둘 다 늘 지켜야 하니까', '규칙은 system에, 학습지 조각은 질문마다 user의 [자료]에', '규칙은 질문마다 user 끝에 붙이고, 학습지 조각은 system에 한 번만 넣는다', '둘 다 assistant 메시지로 넣는다'], a: 1,
        why: '규칙은 질문이 바뀌어도 그대로라 <code>system</code>, 조각은 질문마다 검색 결과가 달라지니 <code>user</code>의 [자료]에 넣어요.',
        ex: ['조각은 질문마다 바뀌어요. 늘 같은 자리에 둘 것과 바뀌는 것을 나눠요.', '', '거꾸로예요. 조각은 질문마다 달라져서 한 번만 넣을 수 없어요.', 'assistant는 모델이 했던 답을 넣는 자리예요.'] },
      { t: 'q', kind: 'mc', fig: 'qa_whole', q: '1년 동안 쓴 학습지 60개를 넣은 챗봇을 학생 150명이 한 학기 동안 쓸 거예요. 알맞은 선택은?',
        opts: ['RAG로 질문마다 관련 조각 몇 개만 넣는다', '모두 통째로 넣는다. 512K면 무엇이든 들어간다', '학습지 하나만 골라 통째로 넣고 나머지는 뺀다', '자료 없이 Solar의 일반 지식으로 답하게 한다'], a: 0,
        why: '자료가 많고 오래, 많이 쓰면 RAG가 맞아요. 질문마다 관련 조각만 넣으니 비용이 적고, 엉뚱한 글이 섞일 일도 줄어요.',
        ex: ['', '60개면 창에 다 들어가지 않을 수 있고, 들어가도 질문마다 자료 전체 비용이 들어요.', '나머지 59개에 있는 내용을 물으면 답할 수 없어요.', '그러면 우리 수업자료에 따른 답이 아니게 돼요.'] }
    ]},

    /* =================== L3 =================== */
    { id: 'L3', type: 'lesson', title: 'helper.py 완성', sub: '검색 + Solar 호출, 출처 찍기, top-k만 넣는 까닭', min: 14, steps: [
      { t: 'say', h: 'helper.py는 세 부분이에요: 검색, 프롬프트, 호출', fig: 'helperParts', code: { lang: 'py', src: src([
        '# helper.py 맨 위(앞 단원에서 가져와요)',
        'import json, math, os, sys',
        '# … 과정 1 단원 3: client, MODEL',
        '# … 과정 2 단원 3: cos(a, b)',
        'with open("vectors.json",',
        '          encoding="utf-8") as f:',
        '    CHUNKS = json.load(f)',
        '# 조각 = {"text", "file", "page", "vec"}'
      ]) }, p: [
        '파일 위쪽은 앞에서 만든 것을 그대로 가져와요. 과정 1 단원 3의 시작 코드(<code>.env</code>의 키로 만든 <code>client</code>, <code>MODEL = "solar-pro4"</code>), 과정 2 단원 3의 <code>cos()</code>와 <code>vectors.json</code>이에요.',
        '조각 하나는 글(<code>text</code>), 파일 이름(<code>file</code>), 쪽(<code>page</code>), 벡터(<code>vec</code>)를 가진 딕셔너리라고 할게요. 내 <code>vectors.json</code>의 이름표가 다르면 거기에 맞춰 바꿔요.',
        '그 아래에 ① 검색 <code>search()</code>, ② 프롬프트 <code>build()</code>, ③ 호출 <code>ask()</code>를 차례로 써요.'
      ], tip: '학교 Windows에서는 <code>encoding="utf-8"</code>을 빼면 한글이 든 JSON을 읽다 오류가 날 수 있어요. 늘 적어요.' },
      { t: 'say', h: '① 검색: 질문도 임베딩해서 가까운 조각 k개만', fig: 'topK', code: { lang: 'py', src: src([
        '# ① 검색: 질문과 가까운 조각 k개',
        'def search(q, k=3):',
        '    qv = client.embeddings.create(',
        '        model="solar-embedding-2-query",',
        '        input=[q]).data[0].embedding',
        '    for c in CHUNKS:',
        '        c["score"] = cos(qv, c["vec"])',
        '    CHUNKS.sort(reverse=True,',
        '        key=lambda c: c["score"])',
        '    return CHUNKS[:k]'
      ]) }, p: [
        '질문은 <code>solar-embedding-2-query</code>, 조각은 <code>solar-embedding-2-passage</code>로 임베딩하는 짝을 지켜요(과정 2 단원 3). 조각마다 질문과의 코사인 점수를 <code>score</code>에 적고, 점수 순으로 세워 앞의 k개만 돌려줘요.',
        '왜 다 넣지 않고 k개만일까요? 넣는 조각이 많을수록 <b>입력 토큰(비용·시간)</b>이 늘고, 관련 없는 조각이 섞여 <b>답이 흐려지기</b> 쉬워요. 너무 적으면 필요한 근거를 놓치고요.',
        '처음엔 3~5개로 시작해서 레슨 5의 평가 결과를 보고 맞춰요.'
      ]},
      { t: 'say', h: '② 프롬프트: 레슨 2의 build()를 그대로 옮겨요', code: { lang: 'py', src: src([
        '# ② 프롬프트: 번호 붙인 자료 + 질문',
        'def where(c):',
        `    return f"{c['file']} {c['page']}쪽"`,
        '',
        'def build(q, hits):',
        '    ctx = ""',
        '    for n, c in enumerate(hits, 1):',
        '        ctx += f"[{n}] {where(c)}\\n"',
        '        ctx += c["text"] + "\\n\\n"',
        '    user = f"[자료]\\n{ctx}[질문]\\n{q}"',
        '    return [msg("system", RULES),',
        '            msg("user", user)]'
      ]) }, p: [
        '연습장에서 만든 그대로예요. <code>RULES</code>(규칙 다섯 줄)와 <code>msg()</code>(역할과 글로 딕셔너리를 만드는 두 줄짜리 도우미)도 함께 옮겨 둬요.',
        '<code>enumerate(hits, 1)</code>로 번호를 1부터 매겨요. 규칙의 "[1]처럼"과 번호가 맞아야 모델도 헷갈리지 않아요.'
      ]},
      { t: 'say', h: '③ 호출: 추론은 끄고, temperature는 낮게', code: { lang: 'py', src: src([
        '# ③ 호출: 검색 → 조립 → Solar',
        'def ask(question):',
        '    hits = search(question, k=3)',
        '    r = client.chat.completions.create(',
        '        model=MODEL,',
        '        messages=build(question, hits),',
        '        reasoning_effort="none",',
        '        temperature=0.2)',
        '    text = r.choices[0].message.content',
        '    return text + sources(hits)'
      ]) }, p: [
        '<code>reasoning_effort="none"</code>: 찾은 자료를 읽고 정리하는 일이라 긴 추론이 필요 없어요. 추론을 켜면 느려지고 토큰이 늘어요. 값을 빼도 꺼지지만, 의도가 코드에 드러나고 모델·기본값이 바뀌어도 똑같이 돌도록 <b>늘 직접 적어요</b>(과정 1 단원 2).',
        '<code>temperature=0.2</code>: 같은 질문에 비슷한 답이 나오게 낮춰요. 학생마다 설명이 들쭉날쭉하면 수업에서 곤란하니까요.',
        '모델 이름은 <code>MODEL</code> 변수 하나로만 써요. <code>ask(question)</code>은 답 글 아래에 출처 목록을 붙인 <b>글자 하나</b>를 돌려줘요. 다음 단원의 Streamlit 화면도 이 함수를 그대로 불러 써요.'
      ]},
      { t: 'say', h: '출처는 모델이 아니라 코드가 붙여요', fig: 'srcTerm', code: { lang: 'py', src: src([
        '# ④ 출처 붙이기와 실행',
        'def sources(hits):',
        '    out = "\\n--- 출처 ---"',
        '    for n, c in enumerate(hits, 1):',
        '        out += f"\\n[{n}] {where(c)}"',
        '    return out',
        '',
        '# 실행: python helper.py "질문"',
        'if __name__ == "__main__":',
        '    print(ask(sys.argv[1]))'
      ]) }, p: [
        '출처 목록은 Solar가 쓴 게 아니라 <code>hits</code>에 든 파일·쪽을 <b>코드가</b> 붙인 거예요. 그래서 없는 쪽 번호가 나올 수 없어요. 답 속 [1]과 아래 [1]을 맞춰 보면 돼요.',
        '터미널에서 <code>python helper.py "for와 while은 언제 달라요?"</code>처럼 질문을 따옴표로 감싸 넘겨요. <code>sys.argv[1]</code>이 그 질문이에요.',
        '<code>if __name__ == "__main__":</code> 아래는 이 파일을 직접 실행할 때만 돌아요. 다른 파일이 <code>from helper import ask</code>로 불러 쓸 때는 돌지 않아요.'
      ]},
      { t: 'sim', h: 'Cursor 에이전트에게 helper.py를 맡겨요', p: 'Agents Window에서 helper.py를 부탁하고, 에이전트가 실행하려는 명령을 읽은 뒤 Run을 눌러 결과를 봐요.',
        scene: { win: 'agents', folder: LAB, agents: [{ title: 'helper.py 만들기', on: true }], panel: EMPTY },
        steps: [
          { goal: '부탁을 적어요', type: REQ, into: 'chat', say: '만들 파일, 지킬 조건(모델·매개변수·규칙), 확인 방법까지 한 번에 적었어요.' },
          { goal: '보내요', click: 'btn:send',
            then: { panel: { mode: 'Agent', model: 'Auto', msgs: [{ me: REQ }, { ai: AI_MADE, run: RUN_IN }], input: '' }, changes: [{ file: 'helper.py', add: 46, del: 0 }] },
            say: '에이전트가 파일을 읽고 <code>helper.py</code>를 만들었어요(+46). 실행 승인 상자가 떴어요. 명령이 질문 하나로 helper를 돌리는 것인지 읽어요.' },
          { goal: '명령을 읽고 Run을 눌러요', click: 'btn:run',
            then: { panel: { mode: 'Agent', model: 'Auto', msgs: [{ me: REQ }, { ai: AI_MADE }, { ai: AI_RUN }], input: '' } },
            say: '답 문장 끝에 [1] [2], 아래에 번호별 파일·쪽이 찍혔어요. [3]은 넣었지만 답에 쓰이지 않은 조각이에요.' },
          { goal: '바뀐 파일을 눌러 diff를 봐요', click: 'file:helper.py',
            say: '실행이 됐어도 diff는 내 눈으로 봐요. <code>MODEL = "solar-pro4"</code>, <code>reasoning_effort="none"</code>, 키를 <code>os.environ</code>에서 읽는지 세 곳만 확인해도 든든해요.' } ],
        end: '부탁은 맥락·조건·확인 방법까지, 결과는 실행과 diff로 직접 확인해요.' },
      { t: 'q', kind: 'mc', fig: 'q_effort', q: 'helper의 <code>ask()</code>에 <code>reasoning_effort="none"</code>과 <code>temperature=0.2</code>를 적은 까닭으로 알맞은 것은?',
        opts: ['"none"이 가장 똑똑한 설정이고, 0.2가 가장 창의적인 값이라서', '값을 빼면 추론이 가장 깊게(max) 켜져서 막아 둔 것', '찾은 자료를 정리하는 일이라 추론 없이 빠르고 싸게, 답은 일정하게', 'temperature를 낮추면 자료 밖 질문에도 지어내지 않아서'], a: 2,
        why: '자료를 읽고 정리하는 일에는 긴 추론이 필요 없어요. 추론을 끄면 빠르고 싸요. temperature를 낮추면 같은 질문에 비슷한 답이 나와요.',
        ex: ['"none"은 추론을 끄는 값이에요. 0.2는 낮은 값이라 오히려 일정한 답을 내요.', '값을 빼거나 null이면 추론은 꺼져요. 그래도 의도를 드러내려고 늘 직접 적어요.', '', 'temperature는 무작위성만 줄여요. 지어내지 않게 하는 건 규칙과 점수 기준이에요.'] },
      { t: 'q', kind: 'mc', fig: 'q_bigK', q: '더 정확해지라고 <code>k</code>를 3에서 30으로 올렸어요. 생기기 쉬운 일은?',
        opts: ['검색 정확도가 열 배로 오른다', 'Solar가 앞쪽 3개만 읽고 나머지 27개는 버리니 비용도 답도 그대로다', 'Solar 비용은 그대로고 임베딩 비용만 는다', '입력 토큰이 늘어 비싸지고, 관련 없는 조각이 섞여 답이 흐려진다'], a: 3,
        why: '조각 30개가 모두 입력 토큰으로 들어가요. 관련 없는 조각도 섞여서 답이 흐려지기 쉬워요. k는 3~5개로 시작해 평가로 맞춰요.',
        ex: ['검색 순위는 그대로예요. 뒤쪽의 덜 관련된 조각까지 더 넣을 뿐이에요.', '넣은 조각은 모두 읽혀요. 그만큼 입력 토큰도 들어요.', '거꾸로예요. 질문 임베딩은 한 번 그대로고, Solar 입력 토큰이 늘어요.', ''] },
      { t: 'q', kind: 'blank', fig: 'q_queryBlank', q: '<code>search()</code>에서 질문을 임베딩하는 부분이에요. 빈칸은?', lang: 'py', code: src([
        'qv = client.embeddings.create(',
        '    model="solar-embedding-2-[[1]]",',
        '    input=[q]).data[0].embedding'
      ]),
        opts: ['passage', 'query', 'large', 'pro4'], a: 1,
        why: '질문은 <code>query</code>, 저장할 조각은 <code>passage</code>로 임베딩하는 짝이에요. 질문 쪽을 바꾸면 검색 점수가 엇나가요.',
        ex: ['passage는 문서 조각을 저장할 때 쓰는 쪽이에요(과정 2 단원 3).', '', '옛 임베딩 이름에서 온 말이에요. 지금 2세대에는 query와 passage가 있어요.', 'solar-pro4는 대화 모델이에요. 임베딩 모델이 아니에요.'] },
      { t: 'sum', pts: ['helper.py = ① search(): query 임베딩 → 코사인 점수 → 앞의 k개 ② build(): 규칙 + 번호 붙인 조각 + 질문 ③ ask(question): Solar 호출 + 출처.', '호출은 MODEL 변수 하나로, reasoning_effort="none"과 낮은 temperature를 늘 직접 적는다.', 'k는 3~5개로 시작한다(많으면 비싸고 흐려지고, 적으면 근거를 놓친다). 출처 파일·쪽은 코드가 찍는다.'] }
    ]},

    /* =================== L4 =================== */
    { id: 'L4', type: 'lesson', title: '"보조 agent"의 정체', sub: '정해진 순서의 워크플로, 대화 기록과 후속 질문 다시 쓰기', min: 10, steps: [
      { t: 'say', h: '연수 제목의 "보조 agent", 지금은 정해진 순서예요', fig: 'flowAgent', p: [
        '연수 1일차 15:00 차시 이름은 "내 수업자료로 대답하는 나만의 보조 agent 제작하기"예요. 그런데 지금 만든 helper.py는 질문이 오면 <b>늘 같은 순서</b>로 움직여요. 검색 → 조립 → 답. 그 순서는 우리가 코드로 정해 뒀어요.',
        '이런 구조를 <b>워크플로</b>라고 해요. <b>에이전트</b>는 모델이 결과를 보고 다음 할 일을 스스로 골라요. 다시 검색할지, 퀴즈 도구를 쓸지, 그냥 답할지를요.',
        '말 그대로의 에이전트는 과정 5 단원 1에서 만들어요. 그때 이 helper가 <code>search_materials</code>라는 도구 하나로 들어가요.'
      ]},
      { t: 'say', h: '워크플로와 에이전트, 무엇이 다를까요', table: { head: ['', '워크플로(지금 helper)', '에이전트(과정 5)'], rows: [
        ['순서는 누가', '코드가 정해 둬요', '모델이 그때그때 골라요'],
        ['예측하기', '쉬워요. 늘 같은 길', '어려워요. 길이 달라져요'],
        ['비용·속도', '질문당 호출 수가 정해져 있어요', '반복하는 만큼 늘어요'],
        ['시험하기', '단계마다 따로 시험해요', '여러 길을 다 시험해야 해요'],
        ['잘 맞는 일', '자료 질문에 답하기', '여러 도구를 섞어 쓰는 일'] ] }, p: [
        '수업 도구는 <b>예측할 수 있고, 싸고, 시험하기 쉬운</b> 쪽이 먼저예요. 정해진 길로 충분하면 워크플로로 시작해요.',
        '커서한입에서 쓴 Cursor 에이전트는 진짜 에이전트예요. 파일을 읽을지, 고칠지, 명령을 실행할지 스스로 골라요. 레슨 3에서 helper.py를 만들어 준 것도 그 에이전트였죠.'
      ]},
      { t: 'say', h: '검색은 지금 질문 글만 봐요', fig: 'followUp', p: [
        'API는 대화를 기억하지 않아서, 대화를 이어 가려면 지난 대화를 리스트에 모아 함께 보내요(과정 1 단원 3).',
        '그런데 RAG에는 함정이 하나 더 있어요. 학생이 "for 문이 뭐예요?" 다음에 "<b>그거 예시 더 보여 줘</b>"라고 하면, 검색은 이 글만 임베딩해요. "그거"가 무엇인지는 앞 대화에만 있으니 엉뚱한 조각이 와요.',
        '답을 만드는 Solar에게 기록을 함께 보내도, 재료(조각)가 엉뚱하면 답도 흔들려요. 그래서 검색 <b>전에</b> 손봐야 해요.'
      ]},
      { t: 'say', h: '후속 질문을 혼자 읽히는 질문으로 다시 써요', fig: 'rewriteFig', code: { lang: 'py', src: src([
        '# 후속 질문 → 혼자 읽히는 질문',
        'def rewrite(history, q):',
        '    last = history[-4:]  # 최근 대화만',
        '    ask = {"role": "user", "content":',
        '           REWRITE + "\\n질문: " + q}',
        '    r = client.chat.completions.create(',
        '        model="solar-mini4",',
        '        messages=last + [ask],',
        '        reasoning_effort="none",',
        '        temperature=0)',
        '    return r.choices[0].message.content'
      ]) }, p: [
        '검색하기 전에 앞 대화와 새 질문을 주고 "<b>앞 대화를 보고 마지막 질문을 혼자 읽어도 뜻이 통하는 한 문장으로 다시 써. 질문만 써.</b>"라고 부탁해요. <code>REWRITE</code>가 이 부탁 문장이에요.',
        '"그거 예시 더 보여 줘" → "for 문 예시를 하나 더 보여 줘". 이 질문으로 검색하면 for 문 조각이 와요.',
        '짧고 쉬운 일이라 가볍고 싼 <code>solar-mini4</code>를 써요. 정가로 보면 입력 토큰값이 <code>solar-pro4</code>의 3분의 1이에요.'
      ]},
      { t: 'say', h: '대화 모드: 기록은 최근 몇 개만', fig: 'keepRecent', code: { lang: 'py', src: src([
        '# 대화 모드: 인자 없이 python helper.py',
        'history = []',
        'while True:',
        '    q = input("질문> ").strip()',
        '    if not q: break',
        '    if history:',
        '        q = rewrite(history, q)',
        '        print("다시 쓴 질문:", q)',
        '    text = ask(q)',
        '    print(text)',
        '    history += [msg("user", q),',
        '                msg("assistant", text)]'
      ]) }, p: [
        '레슨 3의 실행 부분(<code>if __name__ == "__main__":</code> 아래)을 고쳐, 질문 인자가 있으면 한 번만 답하고 없으면 이 대화 모드가 돌게 해요. 빈 줄을 치면 끝나요.',
        '<code>rewrite()</code>에는 <code>history[-4:]</code>, 곧 최근 두 번의 주고받기만 넣어요. 기록 전체를 보내면 갈수록 느려지고 토큰이 늘어요.',
        '다시 쓴 질문을 화면에 보여 주면 학생도 선생님도 무엇으로 검색했는지 알 수 있어요. 엉뚱하게 다시 썼을 때 바로 눈에 띄어요.'
      ]},
      { t: 'q', kind: 'mc', fig: 'q_whoDecides', q: '지금까지 만든 helper.py를 가장 정확히 설명한 것은?',
        opts: ['모델이 검색할지 말지를 스스로 고르는 에이전트', 'Cursor처럼 파일을 고치고 명령을 실행하는 에이전트', '검색 → 조립 → 답 순서를 코드가 정해 둔 워크플로', '내 수업자료로 다시 학습한 새 모델'], a: 2,
        why: 'helper.py는 질문이 오면 늘 검색하고, 조립하고, 답해요. 모델은 답 글을 쓸 뿐 다음 할 일을 고르지 않아요. 그래서 워크플로예요.',
        ex: ['검색 여부는 코드가 정해요. 모델은 고르지 않아요.', 'helper.py는 파일을 고치거나 명령을 실행하지 않아요. 그건 Cursor 에이전트예요.', '', '모델은 그대로예요. 자료를 찾아 넣어 줄 뿐이에요.'] },
      { t: 'q', kind: 'mc', fig: 'q_followSearch', q: '"그거 예시 더 보여 줘"를 그대로 검색했더니 엉뚱한 조각이 왔어요. 가장 알맞은 까닭은?',
        opts: ['query 모델은 짧은 글을 임베딩하지 못해서', '검색은 이 글만 보는데, "그거"가 무엇인지는 앞 대화에만 있어서', '대화 기록이 vectors.json에 저장되지 않아서', 'temperature를 0.2로 낮춰 두어서'], a: 1,
        why: '검색은 지금 들어온 글만 임베딩해요. "그거"의 뜻은 앞 대화에 있으니, 검색 전에 혼자 읽히는 질문으로 다시 써요.',
        ex: ['짧은 글도 임베딩돼요. 다만 뜻이 앞 대화에 기대고 있어서 문제예요.', '', '대화 기록은 검색할 자료가 아니에요. 질문을 다시 쓰는 데 써요.', 'temperature는 답을 만들 때의 무작위성이에요. 검색과는 상관없어요.'] },
      { t: 'q', kind: 'order', fig: 'q_turnOrder', q: '대화 모드에서 학생의 두 번째 질문을 처리하는 순서로 쌓아 보세요.',
        items: ['학생의 후속 질문을 받는다', '앞 대화를 보고 혼자 읽히는 질문으로 다시 쓴다', '다시 쓴 질문으로 조각을 검색한다', '조각과 질문으로 Solar가 답을 만든다', '다시 쓴 질문과 그 답을 대화 기록에 붙인다'],
        why: '받아야 다시 쓰고, 다시 써야 제대로 검색하고, 조각이 있어야 답하고, 답이 나와야 기록에 붙일 수 있어요.' },
      { t: 'q', kind: 'mc', fig: 'q_historyLong', q: '대화 모드에서 수업 끝까지 기록을 전부 다시 쓰기 부탁에 넣었더니 갈수록 느려지고 토큰이 많이 들어요. 알맞은 고침은?',
        opts: ['기록을 모두 지우고 매번 첫 질문처럼 다룬다', 'reasoning_effort를 "high"로 올려 기록을 더 잘 읽게 한다', '기록을 vectors.json에 넣어 함께 검색되게 한다', '최근 몇 개(예: history[-4:])만 넣는다'], a: 3,
        why: '후속 질문의 뜻은 대개 바로 앞 대화에 있어요. 최근 몇 개만 넣으면 뜻은 살리고 토큰은 아껴요.',
        ex: ['그러면 "그거"가 무엇인지 알 수 없어 후속 질문을 못 받아요.', '추론을 켜면 오히려 더 느려지고 토큰이 늘어요.', '대화 기록은 수업자료가 아니에요. 섞이면 검색이 흐려져요.', ''] },
      { t: 'sum', pts: ['지금 helper는 순서를 코드가 정한 워크플로(검색 → 조립 → 답)다. 모델이 다음 일을 고르는 에이전트는 과정 5 단원 1에서.', '검색은 지금 질문 글만 본다. "그거 예시 더" 같은 후속 질문은 검색 전에 solar-mini4로 혼자 읽히는 질문으로 다시 쓴다.', '대화 기록은 리스트에 모으고 최근 몇 개만 넣는다. 다시 쓴 질문은 화면에 보여 준다.'] }
    ]},

    /* =================== QB =================== */
    { id: 'QB', type: 'quiz', title: '헷갈림 퀴즈 ②', sub: '워크플로와 에이전트, 후속 질문, 출처 표시', min: 3, steps: [
      { t: 'q', kind: 'mc', fig: 'qb_agentWho', q: 'Cursor 에이전트에게 helper.py를 만들어 달라고 했어요. Cursor 에이전트와 helper.py를 바르게 설명한 것은?',
        opts: ['둘 다 순서가 정해진 워크플로다. 부탁받은 일만 하니까', 'Cursor 쪽은 에이전트, helper.py는 워크플로다', 'helper.py는 에이전트, Cursor 쪽은 워크플로다', '둘 다 에이전트다. 연수 제목에 agent가 붙었으니까'], a: 1,
        why: 'Cursor 에이전트는 파일을 읽을지, 고칠지, 명령을 실행할지 스스로 골라요. helper.py는 늘 검색 → 조립 → 답이에요. 이름이 아니라 누가 다음 일을 고르느냐로 나눠요.',
        ex: ['Cursor 에이전트는 상황을 보고 파일 읽기·고치기·실행을 스스로 골라요.', '', '거꾸로예요. 순서가 고정된 쪽이 helper.py예요.', '이름표가 아니라 누가 다음 일을 고르느냐로 나눠요.'] },
      { t: 'q', kind: 'mc', fig: 'qb_rewriteUse', q: '다시 쓴 질문("for 문 예시를 하나 더 보여 줘")은 어디에 쓰나요?',
        opts: ['vectors.json에 새 조각으로 저장하는 데', '대화 기록에서 앞 질문을 지우는 데', '검색과 답 만들기에. 화면에도 보여 준다', '교사 기록에만 남기고, 검색은 원래 질문으로'], a: 2,
        why: '다시 쓴 질문으로 검색해야 맞는 조각이 와요. 같은 질문으로 답도 만들고, 화면에 보여 주면 엉뚱하게 다시 썼을 때 바로 알 수 있어요.',
        ex: ['질문은 수업자료가 아니에요. 조각으로 저장하지 않아요.', '기록은 그대로 둬요. 다음 후속 질문에도 필요해요.', '', '원래 질문("그거 예시 더")으로 검색하면 다시 쓴 보람이 없어요.'] },
      { t: 'q', kind: 'mc', fig: 'qb_pageFake', q: 'Solar에게 "출처를 파일 이름과 쪽으로 직접 써"라고 했더니 "반복문_학습지.pdf 7쪽"이 나왔어요. 학습지는 5쪽짜리예요. 알맞은 고침은?',
        opts: ['Solar가 PDF를 다시 읽고 찾은 쪽이니 그대로 믿는다', 'temperature를 1.0으로 올려 다른 쪽 번호가 나오게 한다', 'Document Parse가 쪽을 잘못 매겼을 테니 다시 파싱한다', '모델은 번호만 쓰게 하고, 파일·쪽은 코드가 조각 정보로 붙인다'], a: 3,
        why: '모델에게 쪽 번호를 쓰게 하면 그럴듯하게 지어낼 수 있어요. 모델은 [1] 같은 번호만, 코드는 그 번호의 조각에 붙은 파일·쪽을 찍어요.',
        ex: ['Solar는 PDF를 직접 읽지 않아요. 넣어 준 조각만 봐요.', '무작위성을 올리면 지어내는 쪽 번호가 더 다양해질 뿐이에요.', '조각에 붙은 쪽은 맞아요. 문제는 모델이 쪽을 직접 쓴 거예요.', ''] }
    ]},

    /* =================== L5 =================== */
    { id: 'L5', type: 'lesson', title: '보조 에이전트 평가하기', sub: '자료 안·밖·애매한 질문, 채점표, 점수 기준과 LLM 채점', min: 14, steps: [
      { t: 'say', h: '질문 세트는 세 종류를 섞어요', fig: 'testSet', table: { head: ['종류', '예시(반복문 학습지)', '좋은 답'], rows: [
        ['자료 안', '"for와 while은 언제 달라요?"', '맞는 내용 + 맞는 근거 번호'],
        ['자료 밖', '"다음 주 수행평가 날짜가 언제예요?"', '"자료에 없어요."'],
        ['애매', '"이거 몇 번 반복해요?"', '무엇을 묻는지 되묻기'] ] }, p: [
        '평가하려면 질문을 미리 정해 둬요. 과정 2 단원 3의 검색 시험표처럼 10개쯤이면 시작하기 좋아요. 예: 자료 안 6개, 자료 밖 2개, 애매 2개.',
        '<b>자료 밖 질문</b>을 꼭 넣어요. 자료 안 질문만 시험하면 지어내는 버릇이 보이지 않아요. 수업에서 학생은 자료 밖 질문을 아주 자주 해요.',
        '질문은 학생 말투로 써요. 띄어쓰기를 틀리거나 줄여 쓴 질문도 섞어 봐요.'
      ]},
      { t: 'say', h: '채점표: 답, 근거, 모른다고 했나', fig: 'scoreSheet', table: { head: ['칸', '보는 것'], rows: [
        ['답이 맞나', '자료 안 질문: 내용이 자료와 맞나(○ △ ×)'],
        ['근거가 맞나', '[번호]가 있고, 그 조각에 정말 그 내용이 있나(직접 펼쳐 확인)'],
        ['모른다고 했나', '자료 밖 질문: "자료에 없어요."라고 했나, 지어냈나'],
        ['되물었나', '애매한 질문: 단정하지 않고 되물었나'],
        ['판정·메모', '통과/실패, 고칠 곳(검색·규칙·조각)'] ] }, p: [
        '가장 위험한 실패는 <b>자료 밖 질문에 그럴듯하게 지어낸 답</b>이에요. 출처가 붙은 듯한 답은 학생이 더 쉽게 믿어요.',
        '실패마다 원인을 적어 두면 고칠 곳이 보여요. 검색된 조각부터 엉뚱하면 검색 쪽(과정 2 단원 3), 조각은 맞는데 답이 틀리면 규칙·프롬프트 쪽이에요.'
      ]},
      { t: 'say', h: '자료 밖 질문에도 출처가 찍힌다면: 점수 기준', fig: 'cutLine', code: { lang: 'py', src: src([
        'CUT = 0.5  # 예시 값: 내 자료로 정해요',
        '',
        'def ask(question):',
        '    hits = [c for c in search(question)',
        '            if c["score"] >= CUT]',
        '    if not hits:  # Solar 안 불러요',
        '        return "자료에 없어요."',
        '    # (아래는 레슨 3의 ask()와 같아요)'
      ]) }, p: [
        '검색은 아무리 멀어도 "가장 가까운 k개"를 늘 돌려줘요. 그래서 "급식 메뉴가 뭐예요?"에도 학습지 조각 3개가 붙어 가고, 출처도 찍혀요.',
        '점수가 기준(<code>CUT</code>)보다 낮은 조각은 빼고, 남는 게 없으면 Solar를 부르지 않고 바로 "자료에 없어요."라고 해요. 코드(점수)와 프롬프트(규칙)로 <b>두 겹</b> 막는 거예요. 호출을 아끼니 비용도 줄어요.',
        '0.5는 예시예요. <code>sources()</code>가 출처 옆에 점수도 찍게 고쳐 두고, 자료 안·밖 질문의 점수를 견주어 내 자료에 맞게 정해요.'
      ]},
      { t: 'say', h: 'LLM으로 채점 맛보기', fig: 'judgeFig', code: { lang: 'py', src: src([
        '# JUDGE: 채점 부탁 문장(아래 설명)',
        'def judge(data, text):',
        '    q = JUDGE + "\\n[자료]\\n" + data',
        '    q += "\\n[답]\\n" + text',
        '    r = client.chat.completions.create(',
        '        model="solar-mini4",',
        '        messages=[msg("user", q)],',
        '        reasoning_effort="none",',
        '        temperature=0)',
        '    return r.choices[0].message.content'
      ]) }, p: [
        '질문이 많아지면 근거 확인을 Solar에게 맡겨 볼 수 있어요. [자료]와 [답]을 주고 "<b>답의 내용이 모두 자료에 있으면 통과, 아니면 불통과라고만 써</b>"라고 부탁해요. <code>JUDGE</code>가 그 부탁 문장이에요.',
        'LLM 채점도 틀려요. 처음엔 <b>사람이 채점한 10개쯤과 견주어</b> 얼마나 맞는지 보고 써요. 자료 밖 질문은 "자료에 없어요." 문구가 있는지 코드로 세는 편이 더 정확해요.'
      ], tip: '옛 예제에 나오는 근거 확인 전용 API(Groundedness Check)는 2025년 10월 21일에 지원이 끝났어요. 근거 확인은 이렇게 프롬프트와 코드로 직접 만들어요.' },
      { t: 'sim', h: '세 종류 질문으로 시험해요', p: '점수 기준을 넣은 helper.py예요. 자료 안, 자료 밖, 애매한 질문을 차례로 넣고 결과를 채점표 눈으로 읽어 봐요.',
        scene: { win: 'term', folder: LAB, term: [] },
        steps: [
          { goal: '자료 안 질문을 해요', type: RUN_IN, into: 'term', then: { term: T_IN, prompt: '' },
            say: '근거 번호 [1] [2]가 붙었고, 아래에 파일·쪽·점수가 찍혔어요. 채점표에는 학습지 2·3쪽을 펼쳐 정말 그 내용이 있는지까지 확인해 적어요.' },
          { goal: '자료 밖 질문을 해요', type: RUN_OUT, into: 'term', then: { term: [...T_IN, ...T_OUT], prompt: '' },
            say: '기준을 넘는 조각이 없어서 Solar를 부르지도 않고 "자료에 없어요."라고 했어요. 통과!' },
          { goal: '애매한 질문을 해요', type: RUN_AMB, into: 'term', then: { term: [...T_IN, ...T_OUT, ...T_AMB], prompt: '' },
            say: '무엇을 묻는지 되묻고, 짐작한 범위는 근거와 함께 말했어요. 단정해서 엉뚱한 답을 하지 않았으니 통과예요.' } ],
        end: '세 종류 질문을 섞어 시험해야 약한 곳이 보여요.' },
      { t: 'try', lang: 'py', h: '근거 번호를 코드로 검사해요', p: '흉내 낸 평가 결과에서, 자료 안 질문은 근거 번호가 있고 넣은 조각 수(n) 안에 있는지, 자료 밖 질문은 "자료에 없어요."라고 했는지 자동으로 판정해요.',
        src: src([
          'results = [',
          '    {"kind": "안", "q": "for와 while 차이", "n": 3,',
          '     "answer": "for는 횟수가 정해졌을 때 써요[1]."},',
          '    {"kind": "안", "q": "range(5)의 뜻", "n": 3,',
          '     "answer": "0부터 4까지 다섯 번 돌아요[5]."},',
          '    {"kind": "안", "q": "break의 쓰임", "n": 3,',
          '     "answer": "반복을 바로 멈춰요."},',
          '    {"kind": "밖", "q": "급식 메뉴", "n": 0,',
          '     "answer": "자료에 없어요."},',
          '    {"kind": "밖", "q": "수행평가 날짜", "n": 2,',
          '     "answer": "11월 3일이에요."},',
          ']',
          '',
          'def cites(text):',
          '    nums = []',
          '    for part in text.split("[")[1:]:',
          '        num = part.split("]")[0]',
          '        if num.isdigit():',
          '            nums.append(int(num))',
          '    return nums',
          '',
          'def check(r):',
          '    if r["kind"] == "밖":',
          '        return "자료에 없어요" in r["answer"]',
          '    nums = cites(r["answer"])',
          '    if not nums:',
          '        return False',
          '    return all(1 <= k <= r["n"] for k in nums)',
          '',
          'ok = 0',
          'for r in results:',
          '    good = check(r)',
          '    if good:',
          '        ok += 1',
          '    mark = "통과" if good else "실패"',
          '    print(mark, r["kind"], r["q"])',
          'print(f"통과 {ok}/{len(results)}")'
        ]),
        note: '해 볼 것: ① 셋째 결과의 답 끝에 [2]를 붙여 다시 실행해 보세요. ② 애매한 질문(kind "애매")도 판정해 보세요. 답에 "?"가 있으면 되물은 것으로 칠까요? 그 기준의 약점도 생각해 봐요. ③ 이 검사는 번호가 범위 안인지만 봐요. 그 조각에 정말 그 내용이 있는지는 사람이나 LLM 채점이 확인해요.' },
      { t: 'q', kind: 'mc', fig: 'q_outQ', q: '반복문 학습지만 넣은 helper를 평가하려 해요. "자료 밖 질문"으로 알맞은 것은?',
        opts: ['for 문에서 range(5)는 몇 번 반복해요?', 'while 문이 안 끝나면 어떻게 해요?', '학습지 3쪽 연습 문제 답이 뭐예요?', '다음 주 체육대회 준비물이 뭐예요?'], a: 3,
        why: '체육대회 준비물은 반복문 학습지에 없는 내용이에요. 이런 질문에 "자료에 없어요."라고 하는지 봐야 지어내는 버릇을 잡아요.',
        ex: ['range(5)는 반복문 학습지에 나올 법한 자료 안 질문이에요.', '끝나지 않는 while 반복은 반복문 자료에서 다루는 내용이에요.', '학습지 안의 문제를 묻는 자료 안 질문이에요.', ''] },
      { t: 'q', kind: 'mc', fig: 'q_cutWhy', q: '점수 기준 없이 "급식 메뉴가 뭐예요?"를 물었더니, 답은 "자료에 없어요."인데 아래에 출처가 3개 찍혔어요. 왜일까요?',
        opts: ['Solar가 출처 목록까지 지어내서', '검색은 아무리 멀어도 가까운 k개를 늘 돌려줘서', 'vectors.json에 급식 메뉴가 들어 있어서', 'reasoning_effort를 "none"으로 두어 먼 조각을 걸러 내지 못해서'], a: 1,
        why: '검색은 "가장 가까운 3개"를 늘 돌려줘요. 그 조각이 질문과 멀어도요. 그래서 점수 기준(CUT)으로 먼 조각을 빼야 출처도 함께 사라져요.',
        ex: ['출처 목록은 코드가 hits에서 찍은 거예요. 모델이 쓴 게 아니에요.', '', '들어 있었다면 Solar가 그 내용으로 답했겠죠. 답은 "자료에 없어요."였어요.', '추론 설정은 검색 결과와 상관없어요. 먼 조각을 거르는 건 점수 기준이에요.'] },
      { t: 'q', kind: 'line', fig: 'q_sheetLine', q: '평가 채점표 일부예요(종류·질문·결과·판정). <b>판정이 잘못된 줄</b>을 눌러 보세요.', lang: 'plain', code: src([
        '안·for와 while 차이·[1][2] 맞음·통과',
        '밖·급식 메뉴·자료에 없어요·통과',
        '밖·수행평가 날짜·11월 3일이에요·통과',
        '애매·몇 번 돌아요?·되물음·통과',
        '안·range(5) 뜻·근거 번호 없음·실패'
      ]), a: 2,
        why: '자료 밖 질문에 날짜를 지어냈으니 실패예요. 가장 위험한 실패라 꼭 잡아야 해요. 점수 기준과 규칙을 다시 봐요.' },
      { t: 'sum', pts: ['질문 세트 = 자료 안 + 자료 밖 + 애매. 자료 밖 질문을 꼭 넣는다(지어내기가 가장 위험하다).', '채점표: 답이 맞나, 근거 번호와 그 조각이 맞나, 모른다고·되물었나. 실패마다 고칠 곳(검색·규칙·조각)을 적는다.', '점수 기준(CUT)으로 먼 조각을 빼고, 남는 게 없으면 Solar 없이 "자료에 없어요.". LLM 채점은 사람 채점과 먼저 견준다. Groundedness Check API는 끝났다.'] }
    ]},

    /* =================== M1 =================== */
    { id: 'M1', type: 'mission', title: '내 수업자료로 답하는 helper.py', sub: '콘솔과 내 Cursor에서 직접', min: 45,
      where: '업스테이지 콘솔 + upstage-lab 폴더',
      intro: '과정 2 단원 3에서 만든 <code>vectors.json</code>으로 진짜 보조 에이전트를 만들어요. 끝낸 것부터 체크하고, 한 줄 메모(질문과 결과)를 남겨요. 학생 개인정보가 든 자료는 쓰지 않아요.',
      tasks: [
        { do: '시작 전에 준비물을 확인하고 Git 커밋해요',
          how: 'Cursor로 <code>upstage-lab</code>을 열고 터미널에서 <code>git status</code>. <code>vectors.json</code>(조각마다 글·파일·쪽·벡터), <code>search.py</code>, <code>.env</code>가 있는지 봐요. <code>git check-ignore .env</code>가 <code>.env</code>를 찍으면 키는 커밋되지 않아요. 그다음 <code>git add -A</code> → <code>git commit -m "c3u1 시작 전"</code>.',
          check: '<code>git status</code>가 깨끗하고(nothing to commit), <code>git check-ignore .env</code>가 <code>.env</code>를 찍으면 성공. <code>vectors.json</code>에 벡터가 없으면 과정 2 단원 3 미션부터 마쳐요.' },
        { do: 'Cursor 에이전트에게 helper.py를 맡겨요',
          how: 'Agents Window에서 아래 부탁을 붙여 넣어요. 에이전트가 실행하려는 명령은 읽고 Run을 눌러요. 끝나면 diff에서 <code>MODEL</code>, <code>reasoning_effort="none"</code>, <code>os.environ["UPSTAGE_API_KEY"]</code> 세 곳을 직접 확인해요.',
          check: '내가 직접 <code>python helper.py "내 자료에 있는 질문"</code>을 실행했을 때 답 끝에 [1] 같은 번호가 붙고, 아래에 번호·파일·쪽 목록이 찍히면 성공.',
          prompt: P_HELPER },
        { do: '자료 안 질문 3개로 출처를 확인해요',
          how: '내 자료에 답이 있는 질문 세 개를 학생 말투로 만들어 물어요. 답에 붙은 번호마다 아래 목록의 파일·쪽을 실제로 펼쳐 봐요.',
          check: '세 질문 모두 근거 번호의 쪽에 정말 그 내용이 있으면 성공. 아니면 메모에 "질문 / 번호 / 실제 쪽 내용"을 적어요.' },
        { do: '자료 밖·애매한 질문을 시험하고 점수 기준을 넣어요',
          how: '자료 밖 질문 2개(예: 급식 메뉴, 다음 주 일정)와 애매한 질문 1개(예: "이거 몇 번 돌아요?")를 물어요. 자료 밖 질문에도 출처가 찍히면 아래 부탁으로 점수 기준을 넣고, 찍힌 점수를 보며 <code>CUT</code>을 정해요.',
          check: '자료 밖 질문 2개에 "자료에 없어요."만 나오고, 자료 안 질문은 여전히 근거와 함께 답하면 성공. 정한 CUT 값을 메모에 적어요.',
          prompt: P_CUT },
        { do: '(선택) 대화 모드와 후속 질문 다시 쓰기를 더해요',
          how: '아래 부탁으로 대화 모드를 넣고, 터미널에서 <code>python helper.py</code>로 켜서 "for 문이 뭐예요?" → "그거 예시 더 보여 줘"처럼 이어서 물어요(내 자료의 주제로 바꿔요).',
          check: '두 번째 질문에서 "다시 쓴 질문:"이 앞 대화의 주제를 담아 찍히고, 답도 그 주제로 나오면 성공.',
          prompt: P_CHAT },
        { do: '결과를 정리하고 커밋해요',
          how: '질문 세트(자료 안·밖·애매) 결과를 아래 부탁 끝에 붙여 <code>eval.md</code> 정리를 맡겨요. 콘솔 왼쪽 메뉴 <b>Usage</b>(사용량)에서 오늘 쓴 양도 확인해요.',
          check: '<code>eval.md</code>에 표와 통과 수, 고칠 점이 있고, <code>git log --oneline</code>에 새 커밋이 보이고, 커밋한 파일 목록에 <code>.env</code>가 없으면 성공.',
          prompt: P_EVAL }
      ],
      note: '예상 비용: 정가로 어림하면 질문 한 번(입력 약 2천 + 출력 약 3백 토큰)에 <code>solar-pro4</code>로 약 $0.001, 이 미션에서 20번쯤 물어도 약 $0.02예요. 질문 임베딩과 <code>solar-mini4</code> 다시 쓰기는 이보다 훨씬 싸요. Cursor 에이전트 사용량은 Cursor 요금제에서 따로 빠져요. 자료는 내 수업자료·공개 자료만 쓰고, 키는 <code>.env</code>에만 두고 채팅·스크린샷에 붙이지 않아요.' },

    /* =================== T1 =================== */
    { id: 'T1', type: 'test', title: '단원 형성평가', sub: '10문제 · 7문제 이상 맞히면 통과', min: 12, pass: 0.7, steps: [
      { t: 'q', kind: 'mc', fig: 't_fest', q: '연수 1일차 15:00 실습 시간이에요. 옆자리 선생님의 helper.py가 "우리 학교 축제가 언제예요?"에 "10월 24일이에요[1]"라고 답했어요. 넣은 자료에는 축제 이야기가 없어요. 먼저 살펴볼 곳으로 가장 알맞은 것은?',
        opts: ['temperature를 1.5로 올려 다른 답이 나오는지 본다', 'reasoning_effort를 "high"로 바꿔 더 깊이 생각하게 한다', '"자료에 없으면 \'자료에 없어요.\'" 규칙과 점수 기준(CUT)이 있는지 본다', '질문 임베딩 모델을 solar-embedding-2-passage로 바꾼다'], a: 2,
        why: '자료 밖 질문에 지어낸 답이에요. 프롬프트 규칙("자료에 없으면…")과 코드의 점수 기준이 두 겹으로 막는지부터 봐요.',
        ex: ['무작위성을 올리면 지어낸 답이 더 다양해질 뿐이에요.', '추론을 켜도 자료에 없는 사실이 생기지 않아요. 느리고 비싸지기만 해요.', '', '질문은 query 모델이 맞아요. 모델을 바꿔도 지어내기는 막히지 않아요.'] },
      { t: 'q', kind: 'order', fig: 't_prepOrder', q: '새 단원 학습지 PDF를 helper에 더하려 해요. 준비 단계를 순서대로 쌓아 보세요.',
        items: ['Document Parse로 PDF를 markdown으로 바꾼다', '글을 조각으로 나누고 파일·쪽을 붙인다', '조각마다 solar-embedding-2-passage로 임베딩한다', '조각과 벡터를 vectors.json에 더해 저장한다'],
        why: '글이 있어야 나누고, 조각이 있어야 임베딩하고, 벡터가 있어야 저장해요. 질문 단계는 그대로 써요.' },
      { t: 'q', kind: 'blank', fig: 't_paramBlank', q: 'helper.py의 <code>ask()</code>예요. 찾은 자료를 읽고 정리하는 일에 맞게 두 빈칸을 채워 보세요.', lang: 'py', code: src([
        'r = client.chat.completions.create(',
        '    model=MODEL,',
        '    messages=build(question, hits),',
        '    reasoning_effort=[[1]],',
        '    temperature=[[2]])'
      ]),
        opts: [['"high"', '0.2'], ['"none"', '1.8'], ['"max"', '1.0'], ['"none"', '0.2']], a: 3,
        why: '자료를 정리하는 일이라 추론은 끄고(<code>"none"</code>), 같은 질문에 비슷한 답이 나오게 temperature는 낮게(<code>0.2</code>) 둬요.',
        ex: ['첫 칸이 틀렸어요. 추론을 켜면 느려지고 토큰이 늘어요.', '둘째 칸이 틀렸어요. 1.8이면 답이 들쭉날쭉해요.', '두 칸 다 틀렸어요. 가장 깊은 추론에 기본 무작위성이에요.', ''] },
      { t: 'q', kind: 'line', fig: 't_designLine', q: 'helper.py 설계 메모예요. <b>틀린 줄</b>을 눌러 보세요.', lang: 'plain', code: src([
        '1. 질문은 query 모델로 임베딩',
        '2. 점수가 높은 조각 3개만 넣기',
        '3. 조각마다 [1] [2] [3] 번호 붙이기',
        '4. 출처 파일·쪽은 Solar가 쓰게 하기',
        '5. reasoning_effort는 늘 직접 적기'
      ]), a: 3,
        why: '모델에게 파일·쪽을 쓰게 하면 틀리거나 지어낼 수 있어요. 모델은 번호만 쓰고, 번호 → 파일·쪽은 코드가 붙여요.' },
      { t: 'q', kind: 'mc', fig: 't_agentLab', q: '연수 1일차 15:00 보조 agent 실습 시간이에요. 강사가 "자료가 바뀌면 다시 할 일"과 "질문마다 할 일"을 나눠 보래요. 바르게 나눈 것은?',
        opts: ['바뀌면: 파싱·조각·passage 임베딩·저장 / 질문마다: query 임베딩·검색·조립·Solar 호출', '바뀌면: 파싱만 / 질문마다: 조각 나누기·passage 임베딩·검색·조립·Solar 호출', '바뀌면: 새 자료로 Solar를 다시 학습 / 질문마다: query 임베딩·검색·조립·Solar 호출', '바뀌면: 아무것도 안 함 / 질문마다: 파싱·조각·임베딩·검색·조립·Solar 호출까지 전부'], a: 0,
        why: '준비 단계(파싱 → 조각 → passage 임베딩 → 저장)는 자료가 바뀔 때만, 질문 단계(query 임베딩 → 검색 → 조립 → Solar)는 질문마다 해요.',
        ex: ['', '조각 나누기와 조각 임베딩은 자료 쪽 일이에요. 질문마다 하면 시간과 비용이 낭비돼요.', '모델은 다시 학습하지 않아요. 자료를 찾아 넣어 줘요.', '질문마다 파싱하면 느리고 비싸요. 한 번 준비해 저장해요.'] },
      { t: 'q', kind: 'mc', fig: 't_followUp', q: '학생이 "for 문이 뭐예요?" 다음에 "그럼 예시 하나만 더요"라고 했더니, 검색에 엉뚱한 조각이 왔어요. 알맞은 고침은?',
        opts: ['k를 3에서 20으로 늘려 맞는 조각이 섞이길 기다린다', '앞 대화를 보고 "for 문 예시를 하나 더 보여 줘"처럼 다시 쓴 뒤 검색한다', '대화 기록을 모두 지워 매번 첫 질문처럼 다룬다', '후속 질문이면 검색을 건너뛰고 일반 지식으로 답하게 한다'], a: 1,
        why: '검색은 지금 질문 글만 봐요. 앞 대화를 보고 혼자 읽히는 질문으로 다시 쓰면 맞는 조각이 와요.',
        ex: ['엉뚱한 조각만 더 늘어요. 비용도 늘고요.', '', '그러면 "예시 하나만 더"가 무엇의 예시인지 알 수 없어요.', '그러면 자료에 따른 답이 아니게 되고 지어낼 위험이 커져요.'] },
      { t: 'q', kind: 'mc', fig: 't_agentLater', q: '대회용으로 키우려 해요. "질문에 따라 자료를 검색할지, 퀴즈 만들기 도구를 쓸지, 한 번 더 검색할지 모델이 고르게" 하고 싶어요. 무엇으로 바꾸는 일이고, 어디서 배울까요?',
        opts: ['temperature를 올린 워크플로. 이 단원 레슨 3', '대화 기록 다시 쓰기. 이 단원 레슨 4', '도구를 쓰는 에이전트. 과정 5 단원 1', '정보 추출(Information Extract). 과정 2 단원 2'], a: 2,
        why: '모델이 다음 할 일(도구)을 고르게 하는 건 에이전트예요. 도구 정의와 반복 루프를 과정 5 단원 1에서 배우고, 그때 helper가 검색 도구로 들어가요.',
        ex: ['temperature는 무작위성일 뿐, 순서를 모델이 고르게 하지 않아요.', '다시 쓰기는 검색 질문을 다듬을 뿐, 할 일을 고르게 하지 않아요.', '', '정보 추출은 문서에서 칸을 뽑는 기능이에요.'] },
      { t: 'q', kind: 'mc', fig: 't_shortDoc2', q: '한 차시만 쓸 4쪽짜리 학습지로 질문 도우미를 오늘 안에 만들어야 해요. 가장 알맞은 선택은?',
        opts: ['쪽 번호를 달아 markdown을 통째로 넣는다', '학습지로 모델을 다시 학습(파인튜닝)시킨다', '한 줄씩 아주 잘게 나눠 k=50으로 검색해 정확도를 올린다', '자료 없이 시스템 규칙만 잘 써 둔다'], a: 0,
        why: '짧고 잠깐 쓸 자료는 512K 창에 통째로 넣는 게 가장 빨라요. 쪽 번호를 달아 넣으면 출처도 보여 줄 수 있어요.',
        ex: ['', '하루 안에, 한 차시를 위해 하기에는 너무 무거워요.', '조각을 너무 잘게 나누면 뜻이 끊기고, 50개면 통째로 넣는 것과 다를 게 없어요.', '자료가 없으면 학습지에 따른 답을 할 수 없어요.'] },
      { t: 'q', kind: 'mc', fig: 't_cite4', q: '연수장에서 helper.py를 돌렸더니 답 끝에 [5]가 붙어 나왔어요. 넣은 조각은 3개뿐이에요. 어떻게 볼까요?',
        opts: ['5번째로 가까운 조각을 모델이 직접 찾아본 것이다', '없는 번호라 지어낸 근거일 수 있다. 번호가 범위 안인지 코드로 검사한다', '[5]를 쓴 건 자료를 다섯 번 읽었다는 뜻이니 믿는다', 'temperature가 낮아서 생긴 일이니 1.0으로 올린다'], a: 1,
        why: '넣은 조각은 [1]~[3]뿐이에요. [5]는 가리킬 조각이 없는 번호라 믿을 수 없어요. 레슨 5의 cites()처럼 번호 범위를 코드로 검사하고 실패로 적어요.',
        ex: ['Solar는 넣어 준 조각만 봐요. 스스로 더 찾아보지 않아요.', '', '번호는 조각을 가리킬 뿐, 읽은 횟수가 아니에요.', '무작위성을 올리면 이상한 번호가 더 자주 나올 수 있어요.'] },
      { t: 'q', kind: 'mc', fig: 't_judge', q: '질문 40개의 답을 <code>solar-mini4</code>로 채점하게 했더니 38개가 "통과"래요. 이 결과를 믿기 전에 할 일은?',
        opts: ['통과율 95%니 바로 학생에게 연다', '채점 모델을 바꾸면 확인 없이 믿어도 되니 solar-pro4로 바꾼다', '실패한 2개만 지우고 다시 채점한다', '사람이 직접 채점한 10개쯤과 견주어 채점기가 맞는지 본다'], a: 3,
        why: 'LLM 채점도 틀려요. 사람 채점과 먼저 견주어 얼마나 맞는지 확인하고 써요. 자료 밖 질문은 "자료에 없어요." 문구를 코드로 세는 편이 더 정확해요.',
        ex: ['채점기가 맞는지 모르는 채로 연 거예요. 통과가 진짜 통과인지 먼저 확인해요.', '어느 모델이든 채점이 틀릴 수 있어요. 확인은 그대로 필요해요.', '실패를 지우면 약한 곳을 감출 뿐이에요.', ''] }
    ]}
    ]
  });
})();
