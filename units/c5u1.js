// 과정 5 · 단원 1 · 도구를 쓰는 에이전트
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
  // 글자가 든 단추
  function chip(P, x, y, w, h, label, fill, size, mono) {
    P.rrect(x, y, w, h, 8, { fill: fill || 'paper', gap: 5, w: 1.6 });
    P.text(x + w / 2, y + h / 2 + (size || 13) * 0.36, label, { size: size || 13, weight: 700, mono: !!mono });
  }
  // 도구 상자(손잡이 + 상자 + 이름)
  function toolbox(P, x, y, w, h, label, fill, size) {
    P.path(`M${x + w * 0.34} ${y} L${x + w * 0.34} ${y - 10} L${x + w * 0.66} ${y - 10} L${x + w * 0.66} ${y}`, { w: 2.2 });
    P.rrect(x, y, w, h, 8, { fill: fill || 'warm', gap: 6 });
    P.line(x, y + 14, x + w, y + 14, { w: 1.4 });
    if (label) P.text(x + w / 2, y + 14 + (h - 14) / 2 + 4, label, { mono: true, size: size || 11, weight: 700 });
  }
  // 메시지 막대(역할 이름표)
  function msg(P, x, y, w, role, fill) {
    P.rrect(x, y, w, 22, 6, { fill: fill || 'paper', gap: 4, w: 1.4 });
    P.text(x + 10, y + 15, role, { mono: true, size: 11, anchor: 'start', weight: 700 });
  }
  // 노트북(화면에 파일 이름)
  function laptop(P, x, y, w, h, label) {
    P.rrect(x, y, w, h, 8, { fill: 'paper', w: 2 });
    P.path(`M${x - 6} ${y + h} L${x + w + 6} ${y + h} L${x + w + 12} ${y + h + 10} L${x - 12} ${y + h + 10} Z`, { fill: 'soft', gap: 5 });
    if (label) P.text(x + w / 2, y + h / 2 + 4, label, { mono: true, size: 11, weight: 700 });
  }
  // 터미널 상자
  function term(P, x, y, w, h, line, size, c) {
    P.rrect(x, y, w, h, 6, { fill: 'ink', fs: 'solid' });
    if (line) P.text(x + 10, y + h / 2 + 4, line, { mono: true, size: size || 11, anchor: 'start', c: c || 'paper' });
  }
  // MCP 서버 상자
  function server(P, x, y, w, h, label, fill) {
    P.rrect(x, y, w, h, 8, { fill: fill || 'sky', gap: 6 });
    for (let i = 0; i < 2; i++) {
      P.line(x + 10, y + 14 + i * 14, x + w * 0.5, y + 14 + i * 14, { c: 'ink2', w: 2 });
      P.circle(x + w - 14, y + 14 + i * 14, 7, { fill: 'good', fs: 'solid', c: null });
    }
    if (label) P.text(x + w / 2, y + h - 10, label, { mono: true, size: 10, weight: 700 });
  }
  // 레일(침목 있는 두 줄)
  function rails(P, x1, x2, y) {
    for (let x = x1 + 6; x < x2; x += 16) P.line(x, y - 4, x, y + 14, { c: 'soft', w: 2 });
    P.line(x1, y, x2, y, { w: 2.4 });
    P.line(x1, y + 10, x2, y + 10, { w: 2.4 });
  }
  // 돋보기
  function lens(P, cx, cy, d) {
    P.circle(cx, cy, d, { fill: 'sky', gap: 5, w: 2.2 });
    P.line(cx + d * 0.33, cy + d * 0.33, cx + d * 0.55, cy + d * 0.58, { w: 3.5 });
  }
  // 열쇠
  function keyIcon(P, x, y) {
    P.circle(x, y, 22, { fill: 'hi', fs: 'solid', w: 2 });
    P.line(x + 11, y, x + 38, y, { w: 3 });
    P.line(x + 30, y, x + 30, y + 9, { w: 3 });
  }
  // 빨간 오류 딱지
  function badge(P, x, y, w, label) {
    P.rrect(x, y, w, 24, 12, { fill: 'bad', fs: 'solid', c: null });
    P.text(x + w / 2, y + 17, label, { mono: true, size: 12, weight: 700, c: 'paper' });
  }
  // 흩어진 카드(순서 문제용)
  function card(P, x, y) { P.rrect(x, y, 92, 70, 10, { fill: 'paper' }); }
  function cross(P, cx, cy, r, c) {
    P.line(cx - r, cy - r, cx + r, cy + r, { c: c || 'bad', w: 3 });
    P.line(cx + r, cy - r, cx - r, cy + r, { c: c || 'bad', w: 3 });
  }
  function tick(P, cx, cy, r) { P.path(`M${cx - r} ${cy} L${cx - r * 0.3} ${cy + r * 0.7} L${cx + r} ${cy - r * 0.7}`, { c: 'good', w: 3.2 }); }
  function ask(P, x, y, size, c) { P.text(x, y, '?', { size: size || 22, weight: 700, c: c || 'warm' }); }
  function asks(P) { ask(P, 116, 40, 22, 'warm'); ask(P, 226, 112, 22, 'bad'); ask(P, 30, 110, 20, 'accent'); }

  /* ---------- 코드 조각 ---------- */
  const TOOL_DEF = src([
    'TOOLS = [{',
    '  "type": "function",',
    '  "function": {',
    '    "name": "search_materials",',
    '    "description": "정보 수업자료에서"',
    '      " 질문과 관련된 조각을 찾아요",',
    '    "parameters": {',
    '      "type": "object",',
    '      "properties": {"query": {',
    '        "type": "string",',
    '        "description": "찾을 말"}},',
    '      "required": ["query"]}}}]']);
  const CALL_JSON = src([
    '"content": null,',
    '"tool_calls": [{',
    '  "id": "call_abc123",',
    '  "type": "function",',
    '  "function": {',
    '    "name": "search_materials",',
    '    "arguments":',
    '      "{\\"query\\": \\"반복문\\"}"',
    '  }',
    '}]']);
  const LOOP = src([
    'for turn in range(MAX_TURNS):',
    '    msg = ask(messages)',
    '    if msg.content is None:',
    '        msg.content = ""',
    '    messages.append(msg)',
    '    if not msg.tool_calls:',
    '        print(msg.content)',
    '        break',
    '    for c in msg.tool_calls:',
    '        messages.append(tool_msg(c))']);
  const ASK = src([
    'MODEL = "solar-pro4"',
    'MAX_TURNS = 5',
    '',
    'def ask(messages):',
    '    r = client.chat.completions.create(',
    '        model=MODEL,',
    '        messages=messages,',
    '        tools=TOOLS,',
    '        tool_choice="auto",',
    '        reasoning_effort="medium",',
    '    )',
    '    return r.choices[0].message']);
  const TOOL_MSG = src([
    'def tool_msg(c):',
    '    f = c.function',
    '    args = json.loads(f.arguments)',
    '    result = run_tool(f.name, args)',
    '    return {"role": "tool",',
    '            "tool_call_id": c.id,',
    '            "name": f.name,',
    '            "content": str(result)}']);
  const RUN_TOOL = src([
    'TOOL_FUNCS = {',
    '  "search_materials": search_materials,',
    '  "grade_code": grade_code,',
    '}',
    'def run_tool(name, args):',
    '    f = TOOL_FUNCS.get(name)',
    '    if f is None:',
    '        return f"모르는 도구: {name}"',
    '    try:',
    '        return f(**args)',
    '    except Exception as e:',
    '        return f"도구 오류: {e}"']);
  const NEED_OK = src([
    'NEED_OK = {"save_quiz"}',
    '',
    'def run_tool(name, args):',
    '    if name in NEED_OK:',
    '        print("하려는 일:", name, args)',
    '        ok = input("실행할까요? (y/n) ")',
    '        if ok != "y":',
    '            return "교사가 멈췄어요"',
    '    ...  # 아래는 레슨 3과 같아요']);
  const MCP_JSON = src([
    '{',
    '  "mcpServers": {',
    '    "mcp-upstage": {',
    '      "command": "uvx",',
    '      "args": ["mcp-upstage"],',
    '      "env": {',
    '        "UPSTAGE_API_KEY":',
    '          "${env:UPSTAGE_API_KEY}"',
    '      }',
    '    }',
    '  }',
    '}']);
  // 연습장: 흉내 낸 Solar 응답으로 루프 돌리기
  const PLAY = src([
    'import json',
    '',
    'def search_materials(query):',
    '    notes = {"반복문": "for는 정한 횟수만큼 돌아요",',
    '             "조건문": "if는 참일 때만 실행해요"}',
    '    return notes.get(query, "자료에 없어요")',
    '',
    'def count_points(items):',
    '    return sum(items)',
    '',
    'def run_tool(name, args):',
    '    if name == "search_materials":',
    '        return search_materials(args["query"])',
    '    if name == "count_points":',
    '        return count_points(args["items"])',
    '    return "모르는 도구예요"',
    '',
    'def call(cid, name, args):   # 도구 호출 하나 흉내',
    '    text = json.dumps(args, ensure_ascii=False)',
    '    return {"id": cid, "type": "function",',
    '            "function": {"name": name, "arguments": text}}',
    '',
    '# 흉내 낸 Solar 응답 2개: 도구 2개 → 최종 답',
    'FAKE = [',
    '    {"role": "assistant", "content": None,',
    '     "tool_calls": [',
    '         call("call_1", "search_materials", {"query": "반복문"}),',
    '         call("call_2", "count_points", {"items": [3, 5, 2]})]},',
    '    {"role": "assistant", "tool_calls": [],',
    '     "content": "for는 정한 횟수만큼 돌아요. 배점 합계는 10점!"}]',
    '',
    'messages = [{"role": "user",',
    '             "content": "반복문 자료 찾고 배점 3, 5, 2 더해 줘"}]',
    '',
    'for turn in range(3):              # 최대 턴 수',
    '    msg = FAKE[turn]               # 진짜라면 ask(messages)',
    '    if msg["content"] is None:',
    '        msg["content"] = ""        # 도구만 부른 턴',
    '    messages.append(msg)           # assistant 먼저',
    '    if not msg["tool_calls"]:',
    '        break',
    '    for c in msg["tool_calls"]:    # 호출마다 결과 하나',
    '        name = c["function"]["name"]',
    '        args = json.loads(c["function"]["arguments"])',
    '        result = run_tool(name, args)',
    '        print(f"[턴 {turn + 1}] {name}({args}) → {result}")',
    '        messages.append({"role": "tool",',
    '                         "tool_call_id": c["id"],',
    '                         "name": name,',
    '                         "content": str(result)})',
    '',
    'print("--- messages ---")',
    'for m in messages:',
    '    if m["role"] == "tool":',
    '        print("tool     ", m["tool_call_id"], m["content"])',
    '    elif m.get("tool_calls"):',
    '        n = len(m["tool_calls"])',
    '        print("assistant", f"도구 요청 {n}개")',
    '    else:',
    '        print(m["role"].ljust(9), m["content"])']);

  /* ---------- 모의 화면에서 되풀이하는 조각 ---------- */
  const LAB_FILES = ['.cursor/', 'data/', 'grader/', '.env', '.gitignore', 'AGENTS.md', 'agent.py', 'search.py'];
  const AGENT_PY = src([
    'done = False',
    'for turn in range(1, MAX_TURNS + 1):',
    '    msg = ask(messages)',
    '    if msg.content is None:',
    '        msg.content = ""',
    '    messages.append(msg)',
    '    if not msg.tool_calls:',
    '        print(f"[턴 {turn}] 최종 답")',
    '        print(msg.content)',
    '        done = True',
    '        break',
    '    names = [c.function.name',
    '             for c in msg.tool_calls]',
    '    print(f"[턴 {turn}] 도구:", ", ".join(names))',
    '    for c in msg.tool_calls:',
    '        messages.append(tool_msg(c))',
    'if not done:',
    '    print(f"최대 {MAX_TURNS}턴에 닿아 멈췄어요.")']);
  const RUN1 = 'python agent.py "반복문 자료 찾고 퀴즈 2개"';
  const RUN2 = 'python agent.py "안녕하세요"';
  const RUN3 = 'python agent.py "모든 단원 자료를 하나씩 다 찾아 줘"';
  const OUT1 = ['$ ' + RUN1, '[턴 1] 도구: search_materials, make_quiz', '[턴 2] 최종 답', '반복문은 같은 일을 여러 번 하게 해요. (출처: unit3.md 2쪽)', '퀴즈 1. for i in range(3): 은 몇 번 돌까요?', '퀴즈 2. while 문이 멈추려면 무엇이 필요할까요?'];
  const OUT2 = ['퀴즈 2. while 문이 멈추려면 무엇이 필요할까요?', '$ ' + RUN2, '[턴 1] 최종 답', '안녕하세요! 정보 수업에서 궁금한 걸 물어보세요.'];
  const OUT3 = ['$ ' + RUN3, '[턴 1] 도구: search_materials', '[턴 2] 도구: search_materials', '[턴 3] 도구: search_materials', '[턴 4] 도구: search_materials', '[턴 5] 도구: search_materials', '최대 5턴에 닿아 멈췄어요.'];
  const CUS_NAV = ['Plugins', 'Rules', 'Skills', 'MCPs'];
  const EMPTY_PANEL = { mode: 'Agent', model: 'Auto', msgs: [], input: '' };
  const panel = o => Object.assign({}, EMPTY_PANEL, o);
  const MCP_OFF = [{ id: 'mcp-upstage', title: 'mcp-upstage', desc: 'parse_document · extract_information', toggle: false }];
  const MCP_Q = 'mcp-upstage의 parse_document로 data/unit3_loop.pdf를 읽고, 학생용 세 줄 요약과 핵심 용어 3개를 알려 줘. 학습지에 없는 내용은 덧붙이지 말고 파일은 바꾸지 마.';
  const MCP_A = '<b>mcp-upstage</b>의 <code>parse_document</code> 도구로 <code>data/unit3_loop.pdf</code>를 읽었어요.<ol><li>반복문은 같은 일을 여러 번 하게 해요.</li><li><code>for</code>와 <code>range()</code>로 도는 횟수를 정해요.</li><li><code>while</code>은 조건이 참인 동안 돌아요.</li></ol>핵심 용어: 반복문, <code>range</code>, 조건. 파일은 바꾸지 않았어요.';

  HANIP.unit({
    id: 'c5u1',
    course: '과정 5 · 에이전트와 대회',
    title: '단원 1 · 도구를 쓰는 에이전트',
    goals: ['워크플로와 에이전트를 구분하고 도구 호출 루프 이해하기', 'tools를 정의하고 agent.py 루프를 순서대로 짜기', '수업 도구를 안전하게 설계하고 MCP로 Cursor에 잇기'],
    checked: { date: '2026-10-16' },
    sources: [
      'https://console.upstage.ai/docs/capabilities/generate/tool-calling',
      'https://console.upstage.ai/api/chat',
      'https://console.upstage.ai/docs/capabilities/generate/chat',
      'https://console.upstage.ai/docs/models',
      'https://github.com/UpstageAI/Solar-Pro4-Cookbook',
      'https://console.upstage.ai/docs/guides/mcp-server',
      'https://github.com/UpstageAI/mcp-upstage',
      'https://pypi.org/project/mcp-upstage/',
      'https://www.upstage.ai/products/studio',
      'https://console.upstage.ai/docs/studio',
      'https://www.upstage.ai/pricing/api',
      'https://cursor.com/docs/mcp'
    ],

    figs: {
      /* ---------- L1 설명 그림 ---------- */
      rail: { w: 340, h: 200, label: '검색, 조립, 답 세 역이 한 줄 레일로 이어지고 기차가 그 위를 달리는 모습', draw(P) {
        P.text(170, 24, '워크플로: 코드가 깐 레일', { size: 14, weight: 700, c: 'accent' });
        chip(P, 22, 44, 78, 32, '① 검색', 'sky', 13);
        chip(P, 131, 44, 78, 32, '② 조립', 'hi', 13);
        chip(P, 240, 44, 78, 32, '③ 답', 'good', 13);
        P.arrow(102, 60, 128, 60, { c: 'ink2', w: 2, head: 7 });
        P.arrow(211, 60, 237, 60, { c: 'ink2', w: 2, head: 7 });
        rails(P, 14, 326, 132);
        P.rrect(140, 96, 78, 32, 8, { fill: 'warm', gap: 5 });
        P.face(179, 112, 22, { mood: 'happy' });
        P.circle(154, 134, 12, { fill: 'ink', fs: 'solid', c: null });
        P.circle(204, 134, 12, { fill: 'ink', fs: 'solid', c: null });
        P.text(170, 172, '늘 같은 역, 같은 순서', { size: 13, c: 'ink2' });
        P.text(170, 192, 'c3u1 helper.py', { mono: true, size: 11 });
      }},
      fork: { w: 340, h: 204, label: '갈림길 앞의 로봇이 자료 찾기, 채점, 퀴즈, 바로 답 표지판을 바라보는 모습', draw(P) {
        P.text(170, 22, '에이전트: 갈림길에서 골라요', { size: 14, weight: 700, c: 'warm' });
        chip(P, 8, 40, 78, 30, '자료 찾기', 'sky', 12);
        chip(P, 94, 40, 66, 30, '채점', 'hi', 12);
        chip(P, 180, 40, 66, 30, '퀴즈', 'pink', 12);
        chip(P, 254, 40, 78, 30, '바로 답', 'good', 12);
        P.arrow(160, 116, 50, 74, { c: 'soft', w: 2, head: 7 });
        P.arrow(166, 112, 128, 74, { c: 'soft', w: 2, head: 7 });
        P.arrow(176, 112, 212, 74, { c: 'soft', w: 2, head: 7 });
        P.arrow(182, 116, 292, 74, { c: 'soft', w: 2, head: 7 });
        P.robot(170, 146, 0.46, { mood: 'wow' });
        ask(P, 214, 140, 22);
        P.text(170, 196, '다음 행동을 모델이 골라요', { size: 13, c: 'ink2' });
      }},
      loop: { w: 340, h: 204, label: 'Solar 로봇, 내 코드가 든 노트북, 도구 상자 사이를 화살표가 오가는 에이전트 루프', draw(P) {
        P.robot(48, 86, 0.5, { mood: 'happy' });
        P.text(48, 150, 'Solar', { size: 13, weight: 700 });
        laptop(P, 128, 60, 84, 54, 'agent.py');
        P.text(170, 150, '내 코드', { size: 13, weight: 700 });
        toolbox(P, 262, 70, 68, 46, 'def', 'warm', 12);
        P.text(296, 150, '도구(함수)', { size: 13, weight: 700 });
        P.arrow(78, 74, 122, 74, { c: 'accent', w: 2.2, head: 8 });
        P.text(100, 64, 'tool_calls', { mono: true, size: 9, c: 'accent' });
        P.arrow(122, 104, 78, 104, { c: 'good', w: 2.2, head: 8 });
        P.text(100, 124, '결과', { size: 11, c: 'good' });
        P.arrow(218, 80, 256, 80, { c: 'accent', w: 2.2, head: 8 });
        P.text(237, 70, '실행', { size: 11, c: 'accent' });
        P.arrow(256, 104, 218, 104, { c: 'good', w: 2.2, head: 8 });
        P.text(237, 124, '결과', { size: 11, c: 'good' });
        P.curveArrow(296, 162, 170, 186, 44, 162, { c: 'soft', w: 2, head: 8 });
        P.text(170, 198, '최종 답이 나올 때까지 되풀이', { size: 13, c: 'accent' });
      }},

      /* ---------- L1 문제 그림 ---------- */
      q_whoOrder: { w: 340, h: 200, label: 'helper.py 쪽지 옆에 검색, 조립, 답 칸이 한 줄로 서 있고, 누가 순서를 정했는지 궁금한 얼굴', draw(P) {
        file(P, 16, 30, 86, 104, 'helper.py', 'smile', 'hi', 12);
        chip(P, 120, 30, 64, 28, '검색', 'sky', 12);
        chip(P, 120, 70, 64, 28, '조립', 'hi', 12);
        chip(P, 120, 110, 64, 28, '답', 'good', 12);
        P.arrow(152, 60, 152, 68, { c: 'ink2', w: 2, head: 5 });
        P.arrow(152, 100, 152, 108, { c: 'ink2', w: 2, head: 5 });
        person(P, 270, 196, 'wow', 0.75);
        ask(P, 230, 70, 26);
        P.text(110, 184, '누가 정한 순서일까?', { size: 13, c: 'ink2' });
      }},
      q_pickOne: { w: 340, h: 200, label: '레일 그림과 갈림길 그림 사이에서 어느 쪽인지 고민하는 얼굴', draw(P) {
        rails(P, 14, 140, 70);
        chip(P, 30, 30, 34, 26, '1', 'sky', 12);
        chip(P, 90, 30, 34, 26, '2', 'hi', 12);
        P.text(77, 116, '레일', { size: 14, weight: 700 });
        P.arrow(260, 110, 210, 50, { c: 'soft', w: 2, head: 7 });
        P.arrow(260, 110, 260, 44, { c: 'soft', w: 2, head: 7 });
        P.arrow(260, 110, 310, 50, { c: 'soft', w: 2, head: 7 });
        P.circle(260, 114, 14, { fill: 'warm', fs: 'solid', w: 1.4 });
        P.text(260, 146, '갈림길', { size: 14, weight: 700 });
        person(P, 170, 200, 'wow', 0.55);
        ask(P, 170, 110, 22);
      }},
      q_returns: { w: 340, h: 200, label: 'Solar 로봇의 말풍선 속 빈칸과 노트북으로 가는 화살표', draw(P) {
        P.robot(64, 110, 0.6, { mood: 'happy' });
        P.bubble(110, 14, 130, 54, 100, 84);
        P.text(175, 47, '[ ? ]', { mono: true, size: 18, weight: 700, c: 'warm' });
        P.arrow(150, 112, 214, 112, { c: 'accent', w: 2.4, head: 9 });
        laptop(P, 226, 84, 90, 56, 'agent.py');
        P.text(170, 186, '도구가 필요할 때 Solar가 돌려주는 것은?', { size: 12, c: 'ink2' });
      }},
      q_cost: { w: 340, h: 200, label: '같은 질문인데 영수증이 길어져 놀란 얼굴', draw(P) {
        P.note(20, 30, 80, 70, { fill: 'paper' });
        P.text(60, 56, '워크플로', { size: 11, weight: 700 });
        P.line(32, 74, 88, 74, { c: 'soft', w: 3 });
        P.note(120, 20, 90, 150, { fill: 'hi' });
        P.text(165, 46, '에이전트', { size: 11, weight: 700 });
        [64, 84, 104, 124, 144].forEach(y => P.line(132, y, 198, y, { c: 'ink2', w: 3 }));
        person(P, 276, 196, 'wow', 0.75);
        P.text(276, 70, '$ $ $', { size: 18, weight: 700, c: 'warm' });
        P.text(110, 190, '같은 질문, 다른 요금', { size: 13, c: 'ink2' });
      }},

      /* ---------- L2 설명 그림 ---------- */
      toolCard: { w: 340, h: 200, label: 'search_materials 안내 카드에 name, description, parameters 세 칸이 있고 로봇이 읽는 모습', draw(P) {
        P.note(14, 16, 210, 166, { fill: 'paper' });
        P.text(119, 44, 'search_materials', { mono: true, size: 13, weight: 700 });
        chip(P, 28, 58, 182, 30, 'name: 이름', 'sky', 12);
        chip(P, 28, 96, 182, 30, 'description: 설명', 'hi', 12);
        chip(P, 28, 134, 182, 30, 'parameters: 받을 값', 'good', 12);
        P.robot(284, 92, 0.56, { mood: 'happy' });
        P.text(284, 172, '도구 = 안내 카드', { size: 13, c: 'accent' });
      }},
      descRead: { w: 340, h: 204, label: 'tools 카드는 로봇에게 가고, search.py 함수 코드는 가지 않는 모습', draw(P) {
        file(P, 14, 30, 90, 100, 'tools', null, 'hi', 13);
        P.line(28, 66, 90, 66, { c: 'ink2', w: 2.4 });
        P.line(28, 84, 80, 84, { c: 'ink2', w: 2.4 });
        P.line(28, 102, 86, 102, { c: 'ink2', w: 2.4 });
        P.arrow(110, 80, 148, 80, { c: 'good', w: 2.4, head: 9 });
        P.robot(184, 80, 0.5, { mood: 'happy' });
        file(P, 236, 30, 90, 100, 'search.py', null, 'paper', 11);
        P.text(281, 74, 'def …', { mono: true, size: 11, c: 'k' });
        cross(P, 281, 104, 14, 'bad');
        P.text(59, 154, '보내요', { size: 13, weight: 700, c: 'good' });
        P.text(281, 154, '안 보내요', { size: 13, weight: 700, c: 'bad' });
        P.text(170, 192, '고를 때 보는 건 이름과 설명', { size: 13, c: 'accent' });
      }},

      /* ---------- L2 문제 그림 ---------- */
      q_seeWhat: { w: 340, h: 200, label: '돋보기를 든 로봇 앞에 tools 카드, 함수 파일, 지난 기록이 놓인 모습', draw(P) {
        P.robot(56, 96, 0.56, { mood: 'wow' });
        lens(P, 112, 70, 34);
        file(P, 150, 24, 54, 64, 'tools', null, 'hi', 11);
        file(P, 214, 24, 54, 64, '.py', null, 'paper', 11);
        file(P, 278, 24, 54, 64, 'log', null, 'sky', 11);
        ask(P, 177, 120, 22);
        ask(P, 241, 120, 22, 'bad');
        ask(P, 305, 120, 22, 'accent');
        P.text(196, 176, 'Solar는 무엇을 보고 고를까?', { size: 13, c: 'ink2' });
      }},
      q_paramBlank: { w: 340, h: 200, label: '도구 카드 속 한 칸이 비어 있고 물음표가 붙은 모습', draw(P) {
        P.note(24, 20, 190, 160, { fill: 'paper' });
        P.text(119, 48, 'make_quiz', { mono: true, size: 14, weight: 700 });
        P.line(44, 72, 194, 72, { c: 'soft', w: 3 });
        P.rrect(44, 90, 150, 28, 6, { c: 'warm', w: 2 });
        P.text(119, 109, '"____"', { mono: true, size: 13, c: 'warm' });
        P.line(60, 136, 190, 136, { c: 'soft', w: 3 });
        P.line(60, 154, 170, 154, { c: 'soft', w: 3 });
        person(P, 280, 196, 'smile', 0.7);
        ask(P, 280, 66, 26);
      }},
      q_nameLine: { w: 340, h: 200, label: '도구 이름 네 줄이 적힌 쪽지를 돋보기로 살피는 얼굴', draw(P) {
        P.note(24, 20, 170, 150, { fill: 'hi' });
        [52, 82, 112, 142].forEach(y => P.line(44, y, 170, y, { c: 'ink2', w: 2.4 }));
        lens(P, 200, 120, 56);
        person(P, 290, 196, 'wow', 0.7);
        P.text(280, 60, '어느 이름?', { size: 14, weight: 700, c: 'warm' });
      }},
      q_quizBtn: { w: 340, h: 200, label: '웹 화면의 퀴즈 만들기 버튼과 여러 도구 상자 앞의 로봇', draw(P) {
        win(P, 10, 16, 150, 110);
        P.text(85, 58, 'localhost:8501', { mono: true, size: 10, c: 'ink2' });
        chip(P, 30, 74, 110, 32, '퀴즈 만들기', 'accent', 12);
        toolbox(P, 196, 40, 60, 36, null, 'sky');
        toolbox(P, 268, 40, 60, 36, null, 'pink');
        P.robot(262, 136, 0.42, { mood: 'wow' });
        ask(P, 310, 130, 22);
        P.text(85, 164, '누르면 꼭 퀴즈 도구로', { size: 12, c: 'ink2' });
      }},

      /* ---------- QA 그림 ---------- */
      qa_emptyAns: { w: 340, h: 200, label: '학생 질문 아래 답 칸이 비어 있어 놀란 얼굴', draw(P) {
        win(P, 10, 14, 200, 160);
        P.rrect(80, 46, 120, 30, 10, { fill: 'sky', gap: 5, w: 1.4 });
        P.text(140, 66, 'for가 뭐예요?', { size: 12 });
        P.rrect(20, 90, 130, 34, 10, { c: 'soft', w: 1.6 });
        P.text(85, 112, '…', { size: 16, c: 'soft' });
        person(P, 280, 196, 'wow', 0.75);
        P.text(280, 60, '답이 없어요', { size: 13, weight: 700, c: 'warm' });
        P.text(110, 156, 'content: None', { mono: true, size: 11, c: 'bad' });
      }},
      qa_hello: { w: 340, h: 200, label: '안녕하세요 인사에도 도구 상자로 달려가는 로봇과 갸웃하는 얼굴', draw(P) {
        P.bubble(14, 14, 120, 40, 40, 72);
        P.text(74, 39, '안녕하세요!', { size: 13 });
        person(P, 60, 196, 'smile', 0.6);
        P.robot(184, 110, 0.5, { mood: 'dizzy' });
        P.drop(214, 70, 6);
        P.arrow(214, 120, 252, 120, { c: 'warm', w: 2.4, head: 9 });
        toolbox(P, 258, 100, 72, 46, 'search', 'sky', 10);
        P.text(220, 186, '인사인데 왜 검색을?', { size: 13, c: 'ink2' });
      }},
      qa_whereRun: { w: 340, h: 200, label: 'print("채점 시작") 쪽지와 이 글이 어디에 찍힐지 고민하는 얼굴', draw(P) {
        file(P, 16, 26, 170, 96, 'grade_code', null, 'hi', 12);
        P.text(101, 82, 'print("채점 시작")', { mono: true, size: 12 });
        P.curveArrow(190, 70, 222, 40, 254, 60, { c: 'soft', w: 2 });
        ask(P, 266, 64, 26);
        person(P, 280, 196, 'wow', 0.65);
        P.text(100, 160, '어디에 찍힐까?', { size: 14, c: 'ink2' });
      }},

      /* ---------- L3 설명 그림 ---------- */
      msgStack: { w: 340, h: 200, label: 'messages에 user, assistant, tool, tool, assistant가 위에서 아래로 쌓이는 모습', draw(P) {
        const rows = [['user', '질문', 'sky'], ['assistant', 'tool_calls 2개', 'hi'], ['tool', 'call_1의 결과', 'good'], ['tool', 'call_2의 결과', 'good'], ['assistant', '최종 답', 'hi']];
        rows.forEach(([r, n, f], i) => { msg(P, 40, 10 + i * 32, 140, r, f); P.text(196, 26 + i * 32, n, { size: 12, anchor: 'start' }); });
        P.arrow(22, 14, 22, 166, { c: 'accent', w: 2.2, head: 8 });
        P.text(170, 192, 'messages는 이 순서로 쌓여요', { size: 13, c: 'accent' });
      }},
      parallel: { w: 340, h: 200, label: 'tool_calls 속 호출 두 개가 결과 두 개와 하나씩 짝을 맞추는 모습', draw(P) {
        P.rrect(12, 26, 132, 116, 10, { fill: 'hi', gap: 6 });
        P.text(78, 48, 'tool_calls', { mono: true, size: 12, weight: 700 });
        chip(P, 24, 62, 108, 28, 'id: call_1', 'paper', 11, true);
        chip(P, 24, 102, 108, 28, 'id: call_2', 'paper', 11, true);
        P.arrow(140, 76, 188, 76, { c: 'good', w: 2.2, head: 8 });
        P.arrow(140, 116, 188, 116, { c: 'good', w: 2.2, head: 8 });
        chip(P, 194, 62, 134, 28, 'tool · call_1', 'good', 11, true);
        chip(P, 194, 102, 134, 28, 'tool · call_2', 'good', 11, true);
        P.text(170, 172, '호출 하나에 결과 하나', { size: 14, weight: 700, c: 'accent' });
        P.text(170, 194, 'tool_call_id로 짝을 맞춰요', { size: 12, c: 'ink2' });
      }},
      maxTurns: { w: 340, h: 200, label: '1부터 5까지 턴 동그라미가 이어지다가 멈춤 표지판에서 끝나는 모습', draw(P) {
        [0, 1, 2, 3, 4].forEach(i => {
          P.circle(34 + i * 52, 80, 36, { fill: i < 4 ? 'sky' : 'warm', gap: 5 });
          P.text(34 + i * 52, 86, String(i + 1), { size: 16, weight: 700 });
          if (i < 4) P.arrow(54 + i * 52, 80, 66 + i * 52, 80, { c: 'ink2', w: 2, head: 5 });
        });
        P.path('M286 62 L300 56 L314 62 L320 76 L314 90 L300 96 L286 90 L280 76 Z', { fill: 'bad', fs: 'solid', w: 1.6 });
        P.text(300, 81, '멈춤', { size: 11, weight: 700, c: 'paper' });
        P.text(150, 136, 'MAX_TURNS = 5', { mono: true, size: 14, weight: 700 });
        P.text(170, 176, '끝없는 반복과 비용을 막아요', { size: 13, c: 'ink2' });
      }},

      /* ---------- L3 문제 그림 ---------- */
      q_orderLine: { w: 340, h: 200, label: '여섯 줄 코드 쪽지와 빨간 400 딱지, 돋보기로 살피는 얼굴', draw(P) {
        P.note(20, 20, 170, 156, { fill: 'paper' });
        [46, 68, 90, 112, 134, 156].forEach((y, i) => P.line(36, y, 160 - (i % 3) * 18, y, { c: ['k', 's', 'n', 't', 'k', 's'][i], w: 3 }));
        badge(P, 210, 24, 56, '400');
        lens(P, 206, 130, 48);
        person(P, 296, 196, 'wow', 0.6);
      }},
      q_loopStuck: { w: 340, h: 200, label: '같은 도구 상자 둘레를 빙빙 도는 어지러운 로봇', draw(P) {
        P.curveArrow(80, 60, 170, 4, 260, 60, { c: 'warm', w: 2.4 });
        P.curveArrow(260, 130, 170, 186, 80, 130, { c: 'warm', w: 2.4 });
        toolbox(P, 132, 76, 76, 46, 'search', 'sky', 11);
        P.robot(56, 96, 0.4, { mood: 'dizzy' });
        P.drop(30, 60, 6);
        P.text(296, 100, '또?', { size: 18, weight: 700, c: 'bad' });
      }},
      q_argsType: { w: 340, h: 200, label: '따옴표로 둘러싸인 arguments와 빨간 TypeError 딱지', draw(P) {
        P.rrect(16, 40, 210, 52, 8, { fill: 'paper', w: 2 });
        P.text(121, 72, '"{\\"query\\": \\"반복문\\"}"', { mono: true, size: 11 });
        P.text(121, 30, 'c.function.arguments', { mono: true, size: 11, c: 'ink2' });
        badge(P, 40, 112, 100, 'TypeError');
        person(P, 280, 196, 'dizzy', 0.75);
        P.text(110, 176, '["query"]로 꺼냈는데', { size: 13, c: 'ink2' });
      }},

      /* ---------- L4 설명 그림 ---------- */
      classTools: { w: 340, h: 200, label: '앞 단원에서 만든 검색, 채점, 퀴즈 함수가 도구 상자 셋이 된 모습', draw(P) {
        P.text(170, 22, '앞 단원 함수 → 도구', { size: 14, weight: 700, c: 'accent' });
        toolbox(P, 8, 58, 104, 58, 'search_materials', 'sky', 10);
        toolbox(P, 118, 58, 104, 58, 'grade_code', 'hi', 11);
        toolbox(P, 228, 58, 104, 58, 'make_quiz', 'pink', 11);
        P.text(60, 140, 'c2u3 · c3u1', { size: 11, c: 'ink2' });
        P.text(170, 140, 'c4u1', { size: 11, c: 'ink2' });
        P.text(280, 140, 'c2u2', { size: 11, c: 'ink2' });
        P.text(170, 182, '이름·설명·매개변수만 붙이면 돼요', { size: 13, c: 'accent' });
      }},
      leastPriv: { w: 340, h: 200, label: '주는 도구 상자에는 찾기, 채점, 퀴즈만 있고 지우기, 메일, 성적 고치기는 엑스 표시로 빠진 모습', draw(P) {
        P.text(92, 36, '주는 도구', { size: 14, weight: 700, c: 'good' });
        toolbox(P, 16, 60, 152, 100, null, 'good');
        chip(P, 28, 84, 128, 22, '찾기', 'paper', 11);
        chip(P, 28, 110, 128, 22, '채점', 'paper', 11);
        chip(P, 28, 136, 128, 18, '퀴즈', 'paper', 11);
        P.text(262, 26, '안 주는 도구', { size: 14, weight: 700, c: 'bad' });
        ['파일 지우기', '메일 보내기', '성적 고치기'].forEach((t, i) => {
          chip(P, 198, 42 + i * 46, 104, 32, t, 'paper', 12);
          cross(P, 316, 58 + i * 46, 9, 'bad');
        });
        P.text(170, 192, '도구가 할 수 있는 일 = 사고의 최대 크기', { size: 12, c: 'ink2' });
      }},
      humanGate: { w: 340, h: 200, label: '로봇이 만든 초안을 교사가 확인한 뒤에야 저장되는 모습', draw(P) {
        P.robot(44, 84, 0.46, { mood: 'happy' });
        file(P, 84, 46, 60, 72, '초안', null, 'hi', 12);
        P.arrow(150, 84, 188, 84, { c: 'accent', w: 2.2, head: 8 });
        person(P, 230, 150, 'smile', 0.66);
        P.bubble(186, 6, 90, 34, 214, 56);
        P.text(231, 29, 'y / n ?', { mono: true, size: 13, weight: 700 });
        P.arrow(270, 104, 300, 104, { c: 'good', w: 2.2, head: 8 });
        tick(P, 318, 104, 10);
        P.text(44, 150, '에이전트', { size: 12, weight: 700 });
        P.text(230, 172, '교사 확인', { size: 12, weight: 700 });
        P.text(310, 136, '저장', { size: 12, weight: 700, c: 'good' });
        P.text(124, 192, '되돌리기 어려운 일 앞에', { size: 12, c: 'ink2' });
      }},

      /* ---------- L4 문제 그림 ---------- */
      q_whichNot: { w: 340, h: 200, label: '도구 상자 네 개 앞에서 어느 것을 빼야 할지 고민하는 얼굴', draw(P) {
        ['sky', 'hi', 'pink', 'good'].forEach((c, i) => {
          toolbox(P, 14 + (i % 2) * 96, 30 + Math.floor(i / 2) * 76, 84, 50, null, c);
          ask(P, 56 + (i % 2) * 96, 72 + Math.floor(i / 2) * 76, 18, 'ink2');
        });
        person(P, 280, 196, 'wow', 0.75);
        P.text(280, 64, '뭘 빼지?', { size: 14, weight: 700, c: 'warm' });
      }},
      q_gate: { w: 340, h: 200, label: '로봇이 만든 퀴즈 쪽지와 학급 게시판, 그 사이의 물음표', draw(P) {
        P.robot(50, 96, 0.5, { mood: 'proud' });
        file(P, 90, 50, 60, 76, 'quiz', null, 'hi', 11);
        P.arrow(156, 88, 196, 88, { c: 'soft', w: 2.2, head: 8 });
        ask(P, 176, 76, 20);
        P.rrect(204, 30, 126, 100, 8, { fill: 'warm', gap: 7 });
        P.text(267, 52, '학급 게시판', { size: 12, weight: 700 });
        P.note(218, 64, 40, 50, { fill: 'paper' });
        P.note(270, 64, 40, 50, { fill: 'sky' });
        P.text(170, 176, '어떻게 올리게 할까?', { size: 13, c: 'ink2' });
      }},
      q_toolsLine: { w: 340, h: 200, label: '도구 다섯 줄이 적힌 메모를 돋보기로 살피는 얼굴', draw(P) {
        P.note(20, 16, 176, 160, { fill: 'paper' });
        [44, 72, 100, 128, 156].forEach(y => P.line(38, y, 176, y, { c: 'ink2', w: 2.4 }));
        lens(P, 210, 126, 52);
        person(P, 292, 196, 'smile', 0.66);
        P.text(282, 54, '어느 줄?', { size: 14, weight: 700, c: 'warm' });
      }},
      q_descFix: { w: 340, h: 200, label: '개념 질문에 로봇이 grade_code 상자를 집어 들어 갸웃하는 얼굴', draw(P) {
        P.bubble(10, 10, 140, 40, 40, 66);
        P.text(80, 35, 'for문이 뭐예요?', { size: 12 });
        P.robot(90, 120, 0.5, { mood: 'wink' });
        toolbox(P, 146, 96, 96, 48, 'grade_code', 'hi', 11);
        person(P, 292, 196, 'wow', 0.6);
        ask(P, 292, 74, 22);
        P.text(150, 186, '왜 채점 도구를?', { size: 13, c: 'ink2' });
      }},

      /* ---------- QB 그림 ---------- */
      qb_bigTool: { w: 340, h: 200, label: '커다란 run_python 상자 하나와 작은 도구 상자 셋을 저울에 단 모습', draw(P) {
        P.line(170, 40, 170, 150, { w: 3 });
        P.line(60, 60, 280, 60, { w: 3 });
        P.path('M150 150 L190 150 L180 140 L160 140 Z', { fill: 'soft', gap: 4 });
        toolbox(P, 18, 82, 104, 58, 'run_python', 'bad', 11);
        P.line(70, 60, 70, 72, { w: 2 });
        P.line(270, 60, 270, 72, { w: 2 });
        toolbox(P, 222, 90, 30, 30, null, 'sky');
        toolbox(P, 256, 90, 30, 30, null, 'hi');
        toolbox(P, 290, 90, 30, 30, null, 'pink');
        ask(P, 170, 32, 22);
        P.text(70, 168, '하나로 다?', { size: 13, weight: 700 });
        P.text(270, 168, '셋으로?', { size: 13, weight: 700 });
      }},
      qb_confirm: { w: 340, h: 200, label: '도구 상자 네 개와 문지기처럼 선 교사, 누구를 멈춰 세울지 고민하는 모습', draw(P) {
        ['sky', 'hi', 'pink', 'good'].forEach((c, i) => toolbox(P, 12 + i * 62, 70, 52, 40, null, c));
        P.line(268, 40, 268, 150, { c: 'warm', w: 3 });
        person(P, 304, 196, 'smile', 0.6);
        ask(P, 304, 100, 20);
        P.text(130, 150, '누구 앞에서 물을까?', { size: 13, c: 'ink2' });
      }},
      qb_twoSearch: { w: 340, h: 200, label: '이름이 비슷한 search 도구 상자 두 개 앞에서 어지러운 로봇', draw(P) {
        P.text(170, 24, '학생: "반복문이 뭐예요?"', { size: 13, weight: 700 });
        toolbox(P, 14, 56, 150, 50, 'search_materials', 'sky', 10);
        toolbox(P, 14, 132, 150, 50, 'search_questions', 'sky', 10);
        P.robot(250, 120, 0.56, { mood: 'dizzy' });
        P.drop(290, 76, 6);
        ask(P, 196, 112, 24);
      }},

      /* ---------- L5 설명 그림 ---------- */
      mcpBridge: { w: 340, h: 204, label: 'Cursor 에이전트 창이 MCP로 mcp-upstage 서버에 이어지고, 서버가 업스테이지 API를 부르는 모습', draw(P) {
        win(P, 8, 34, 116, 96);
        P.robot(66, 92, 0.36, { mood: 'happy' });
        P.text(66, 152, 'Cursor 에이전트', { size: 12, weight: 700 });
        P.arrow(128, 70, 176, 70, { c: 'accent', w: 2.2, head: 8 });
        P.text(152, 60, 'MCP', { size: 11, weight: 700, c: 'accent' });
        P.arrow(176, 102, 128, 102, { c: 'good', w: 2.2, head: 8 });
        P.text(152, 122, '결과', { size: 11, c: 'good' });
        server(P, 182, 46, 86, 76, 'mcp-upstage', 'sky');
        P.arrow(272, 84, 292, 84, { c: 'ink2', w: 2, head: 7 });
        P.rrect(294, 62, 40, 44, 8, { fill: 'hi', gap: 5 });
        P.text(314, 89, 'API', { size: 11, weight: 700 });
        P.text(225, 152, '문서 읽기·뽑기', { size: 12, weight: 700 });
        P.text(170, 192, '루프의 "내 코드" 자리를 Cursor가 맡아요', { size: 12, c: 'accent' });
      }},
      studioFlow: { w: 340, h: 200, label: 'Parse, Classify, Extract, Instruct 네 칸을 화면에서 선으로 이어 붙이는 모습', draw(P) {
        P.text(170, 26, 'Upstage Studio', { size: 15, weight: 700 });
        chip(P, 8, 64, 72, 40, 'Parse', 'sky', 12);
        chip(P, 90, 64, 72, 40, 'Classify', 'hi', 12);
        chip(P, 172, 64, 72, 40, 'Extract', 'good', 12);
        chip(P, 254, 64, 72, 40, 'Instruct', 'pink', 12);
        P.arrow(81, 84, 89, 84, { c: 'ink2', w: 2, head: 5 });
        P.arrow(163, 84, 171, 84, { c: 'ink2', w: 2, head: 5 });
        P.arrow(245, 84, 253, 84, { c: 'ink2', w: 2, head: 5 });
        P.text(44, 128, '읽기', { size: 12, c: 'ink2' });
        P.text(126, 128, '나누기', { size: 12, c: 'ink2' });
        P.text(208, 128, '뽑기', { size: 12, c: 'ink2' });
        P.text(290, 128, '요약·판단', { size: 12, c: 'ink2' });
        P.text(170, 176, '코드 없이 화면에서 이어 붙여요', { size: 13, c: 'accent' });
      }},

      /* ---------- L5 문제 그림 ---------- */
      q_mcpTools: { w: 340, h: 200, label: 'Cursor 창에 mcp-upstage 서버를 꽂았고, 새로 생길 도구 칸이 비어 있는 모습', draw(P) {
        win(P, 10, 20, 140, 120);
        P.robot(80, 86, 0.38, { mood: 'happy' });
        P.line(150, 80, 186, 80, { w: 3 });
        server(P, 188, 40, 92, 80, 'mcp-upstage', 'sky');
        P.rrect(80, 154, 180, 34, 8, { c: 'warm', w: 2 });
        P.text(170, 176, '새 도구: ____ · ____', { size: 12, c: 'warm' });
        ask(P, 306, 90, 26);
      }},
      q_cmdBlank: { w: 340, h: 200, label: 'mcp.json 쪽지의 command 칸이 비어 있고 터미널을 바라보는 얼굴', draw(P) {
        file(P, 16, 16, 170, 150, 'mcp.json', null, 'paper', 13);
        P.text(36, 70, '"command":', { mono: true, size: 12, anchor: 'start' });
        P.rrect(36, 82, 110, 26, 6, { c: 'warm', w: 2 });
        P.text(91, 100, '?', { size: 16, weight: 700, c: 'warm' });
        P.text(36, 136, '"args": [...]', { mono: true, size: 12, anchor: 'start' });
        person(P, 270, 196, 'smile', 0.7);
        P.text(270, 60, '어떤 명령?', { size: 13, weight: 700, c: 'warm' });
      }},
      q_keyCommit: { w: 340, h: 200, label: '열쇠가 든 mcp.json이 커밋 목록에 올라 있고 깃허브 구름으로 가려는 모습', draw(P) {
        file(P, 16, 26, 110, 120, 'mcp.json', null, 'paper', 12);
        keyIcon(P, 52, 96);
        P.curveArrow(132, 70, 180, 30, 226, 64, { c: 'bad', w: 2.2 });
        P.rrect(230, 40, 96, 60, 30, { fill: 'sky', gap: 6 });
        P.text(278, 76, 'GitHub', { size: 13, weight: 700 });
        term(P, 150, 120, 176, 30, 'git status', 11);
        P.text(170, 184, '이대로 커밋해도 될까?', { size: 13, c: 'ink2' });
      }},
      q_studioPick: { w: 340, h: 200, label: 'PDF 묶음과 이틀 남은 달력 앞에서 코드 없이 시연하고 싶은 얼굴', draw(P) {
        [0, 1, 2].forEach(i => P.note(18 + i * 14, 30 + i * 12, 70, 90, { fill: ['paper', 'hi', 'sky'][i] }));
        P.text(81, 106, 'PDF', { size: 14, weight: 700 });
        P.rrect(144, 40, 70, 70, 8, { fill: 'paper', w: 2 });
        P.rect(144, 40, 70, 18, { fill: 'bad', fs: 'solid', c: null });
        P.text(179, 92, 'D-2', { size: 18, weight: 700 });
        person(P, 280, 196, 'wow', 0.7);
        P.text(110, 170, '코드 없이 빨리 보여 주고 싶어요', { size: 12, c: 'ink2' });
      }},

      /* ---------- T1 그림 ---------- */
      t_400: { w: 340, h: 200, label: '노트북 터미널에 400 오류가 떠서 어지러운 얼굴', draw(P) {
        laptop(P, 20, 40, 180, 100);
        term(P, 32, 54, 156, 30, '$ python agent.py', 11);
        badge(P, 60, 96, 100, 'Error 400');
        person(P, 276, 196, 'dizzy', 0.75);
        chip(P, 220, 14, 112, 26, '연수 2일차', 'hi', 12);
        P.text(110, 182, '둘째 요청에서 멈췄어요', { size: 13, c: 'ink2' });
      }},
      t_uvx: { w: 340, h: 200, label: '터미널에 uvx를 찾을 수 없다는 글이 떠 있고 강사 시연을 따라 하던 얼굴', draw(P) {
        term(P, 12, 40, 210, 70, null);
        P.text(24, 66, '$ uvx mcp-upstage', { mono: true, size: 11, anchor: 'start', c: 'paper' });
        P.text(24, 92, 'uvx: command not found', { mono: true, size: 11, anchor: 'start', c: 'warm' });
        chip(P, 232, 14, 98, 26, '연수장', 'hi', 12);
        person(P, 280, 196, 'wow', 0.7);
        P.text(110, 150, '시연대로 했는데', { size: 13, c: 'ink2' });
      }},
      t_quizFlow: { w: 340, h: 200, label: '뒤섞인 카드: 로봇, 도구 상자, 말풍선, 노트북', draw(P) {
        card(P, 14, 16);
        P.robot(60, 51, 0.26, { mood: 'happy' });
        card(P, 126, 58);
        toolbox(P, 146, 82, 52, 34, null, 'pink');
        card(P, 238, 14);
        P.bubble(250, 24, 66, 34, 262, 70);
        card(P, 56, 116);
        laptop(P, 74, 128, 56, 34);
        P.robot(270, 146, 0.5, { mood: 'wow' });
        asks(P);
      }},
      t_envLine: { w: 340, h: 200, label: 'mcp.json 쪽지와 열쇠, 서버가 키를 못 찾아 갸웃하는 모습', draw(P) {
        file(P, 16, 16, 160, 160, 'mcp.json', null, 'paper', 13);
        [60, 84, 108, 132, 156].forEach(y => P.line(34, y, 160, y, { c: 'ink2', w: 2.4 }));
        keyIcon(P, 216, 60);
        server(P, 206, 100, 92, 70, 'mcp-upstage', 'sky');
        ask(P, 316, 96, 24);
      }},
      t_toolMsgBlank: { w: 340, h: 200, label: '결과 메시지 쪽지에 빈칸 두 개, 짝을 찾는 호출 카드', draw(P) {
        P.note(16, 20, 180, 150, { fill: 'good' });
        P.text(106, 48, '결과 메시지', { size: 13, weight: 700 });
        P.rrect(34, 66, 140, 26, 6, { fill: 'paper', fs: 'solid', c: 'warm', w: 1.8 });
        P.text(104, 84, '"role": ?', { mono: true, size: 12 });
        P.rrect(34, 104, 140, 26, 6, { fill: 'paper', fs: 'solid', c: 'warm', w: 1.8 });
        P.text(104, 122, 'c.?', { mono: true, size: 12 });
        chip(P, 222, 60, 104, 30, 'id: call_1', 'hi', 11, true);
        P.curveArrow(220, 100, 200, 112, 180, 116, { c: 'soft', w: 2 });
        person(P, 274, 196, 'smile', 0.55);
      }},
      t_rails: { w: 340, h: 200, label: '매주 반복되는 달력과 PDF에서 JSON으로 가는 같은 길, 어떻게 만들지 고민하는 얼굴', draw(P) {
        P.rrect(14, 20, 120, 90, 8, { fill: 'paper', w: 2 });
        P.rect(14, 20, 120, 20, { fill: 'accent', fs: 'solid', c: null });
        ['월', '화', '수', '목', '금'].forEach((d, i) => P.text(28 + i * 23, 64, d, { size: 11, c: i === 4 ? 'bad' : 'ink2' }));
        P.circle(120, 86, 20, { c: 'bad', w: 2 });
        chip(P, 150, 30, 50, 28, 'PDF', 'paper', 11);
        P.arrow(202, 44, 226, 44, { c: 'ink2', w: 2, head: 6 });
        chip(P, 228, 30, 52, 28, '추출', 'hi', 11);
        P.arrow(282, 44, 300, 44, { c: 'ink2', w: 2, head: 6 });
        chip(P, 300, 30, 34, 28, '{ }', 'good', 11);
        person(P, 240, 196, 'wow', 0.7);
        P.text(74, 150, '매주 같은 일', { size: 13, c: 'ink2' });
      }},
      t_whichTool: { w: 340, h: 200, label: '도구 상자 묶음 네 개 앞에서 중학생 질문 창구에 줄 것을 고르는 얼굴', draw(P) {
        ['가', '나', '다', '라'].forEach((t, i) => {
          const x = 14 + (i % 2) * 104, y = 26 + Math.floor(i / 2) * 82;
          P.rrect(x, y, 94, 64, 10, { c: 'soft', w: 1.6 });
          toolbox(P, x + 8, y + 32, 22, 24, null, 'sky');
          toolbox(P, x + 36, y + 32, 22, 24, null, 'hi');
          toolbox(P, x + 64, y + 32, 22, 24, null, 'pink');
          P.text(x + 12, y + 16, t, { size: 11, weight: 700, anchor: 'start' });
        });
        person(P, 282, 196, 'smile', 0.7);
        P.text(282, 66, '어느 묶음?', { size: 13, weight: 700, c: 'warm' });
      }},
      t_save: { w: 340, h: 200, label: 'save_quiz 도구 상자에서 quiz.json 파일로 가는 길 위 어디에 문지기를 세울지 고민하는 모습', draw(P) {
        P.robot(40, 90, 0.42, { mood: 'happy' });
        toolbox(P, 78, 66, 96, 46, 'save_quiz', 'hi', 11);
        P.arrow(178, 90, 232, 90, { c: 'soft', w: 2.2, head: 8 });
        file(P, 238, 50, 80, 86, 'quiz.json', null, 'paper', 10);
        ask(P, 205, 80, 20);
        person(P, 150, 200, 'smile', 0.5);
        P.text(270, 170, '확인은 어디서?', { size: 13, c: 'ink2' });
      }},
      t_noTool: { w: 340, h: 200, label: '먼지 쌓인 search 도구 상자 옆에서 로봇이 그럴듯한 답을 지어내는 모습', draw(P) {
        toolbox(P, 18, 112, 92, 50, 'search', 'sky', 11);
        P.sparkle(30, 100, 5, 'soft');
        P.sparkle(100, 98, 4, 'soft');
        P.robot(176, 112, 0.5, { mood: 'wink' });
        P.bubble(200, 14, 132, 50, 196, 78);
        P.text(266, 44, '아마 이럴 거예요~', { size: 12 });
        person(P, 292, 196, 'wow', 0.55);
      }},
      t_cost: { w: 340, h: 200, label: '계산기와 토큰 영수증 앞에서 어림하는 얼굴', draw(P) {
        P.rrect(20, 30, 100, 140, 10, { fill: 'paper', w: 2 });
        P.rrect(32, 42, 76, 30, 4, { fill: 'good', fs: 'solid', c: null });
        P.text(102, 64, '$ ?', { size: 14, weight: 700, anchor: 'end' });
        [0, 1, 2].forEach(r => [0, 1, 2].forEach(c => P.rrect(32 + c * 26, 84 + r * 26, 20, 20, 4, { w: 1.4 })));
        P.note(140, 26, 96, 130, { fill: 'hi' });
        P.text(188, 52, '입력 토큰', { size: 11, weight: 700 });
        P.line(152, 66, 224, 66, { c: 'ink2', w: 2.4 });
        P.text(188, 96, '출력 토큰', { size: 11, weight: 700 });
        P.line(152, 110, 224, 110, { c: 'ink2', w: 2.4 });
        P.text(188, 138, '× 3턴', { size: 12, weight: 700, c: 'warm' });
        person(P, 290, 196, 'smile', 0.6);
      }},
    },

    items: [
    /* =================== L1 =================== */
    { id: 'L1', type: 'lesson', title: '워크플로와 에이전트', sub: '정해진 레일과 갈림길, 에이전트 루프', min: 8, steps: [
      { t: 'say', h: 'helper.py는 정해진 레일을 달려요', fig: 'rail', p: [
        'c3u1에서 만든 <code>helper.py</code>를 떠올려 봐요. 질문이 오면 <b>검색 → 프롬프트 조립 → Solar 답</b>을 늘 같은 순서로 했죠. 그 순서를 정한 건 Solar가 아니라 <b>내 코드</b>예요.',
        '이렇게 단계와 순서를 코드가 미리 정해 둔 흐름을 <b>워크플로</b>(workflow)라고 해요. c3u1 레슨 4에서 살펴본 "보조 agent의 정체"가 바로 이 워크플로예요.',
        '워크플로는 예측하기 쉽고 싸요. 대신 레일 밖의 일은 못 해요. 학생이 "이 코드 채점해 줘"라고 해도 helper.py는 수업자료만 검색하고 끝나요.'
      ]},
      { t: 'say', h: '에이전트는 갈림길에서 다음 행동을 골라요', fig: 'fork', p: [
        '<b>에이전트</b>(agent)는 모델이 상황을 보고 <b>다음에 할 일을 골라요</b>. 자료를 찾을지, 코드를 채점할지, 퀴즈를 만들지, 아니면 바로 답할지요. 내 코드는 고를 수 있는 도구와 지킬 규칙을 줘요.',
        '정확히 말하면 모델이 직접 무언가를 하지는 않아요. 다음 글자 조각을 예측해 <b>"이 도구를 이 값으로 불러 주세요"라는 요청을 글로</b> 써 낼 뿐이고, 실제 실행은 내 코드가 해요.'
      ], table: { head: ['', '워크플로', '에이전트'], rows: [
        ['순서를 정하는 쪽', '내 코드(미리)', '모델(그때그때)'],
        ['잘 맞는 일', '늘 같은 단계: 학습지 파싱 → 문항 추출', '부탁마다 필요한 단계가 다른 일'],
        ['좋은 점', '예측 쉬움, 싸고 빠름', '여러 종류의 부탁을 한 창구에서'],
        ['조심할 점', '레일 밖 부탁은 못 함', '요청이 여러 번 → 비용·시간, 엉뚱한 도구'] ] } },
      { t: 'say', h: '에이전트 루프: 모델 ↔ 내 코드 ↔ 도구', fig: 'loop', p: [
        '① 내 코드가 질문과 함께 <b>도구 목록</b>을 Solar에게 보내요. ② Solar가 도구가 필요하다고 보면 답 대신 <b>부를 도구 이름과 넣을 값</b>을 돌려줘요.',
        '③ 내 코드가 그 도구(파이썬 함수)를 실행하고, ④ 결과를 대화에 붙여 <b>다시</b> 보내요. Solar는 결과를 읽고 도구를 또 부르거나 최종 답을 써요. 이 되풀이가 <b>에이전트 루프</b>예요.',
        '커서한입에서 쓴 Cursor의 Agent도 같은 생각으로 움직여요. 파일 읽기·검색·터미널 명령이 도구이고, Cursor 프로그램이 "내 코드" 자리에 있어요.'
      ]},
      { t: 'say', h: '먼저 워크플로로 되는지 봐요', p: [
        '에이전트가 늘 더 좋은 건 아니에요. 단계가 늘 같으면 워크플로가 <b>더 싸고, 빠르고, 결과가 고르게</b> 나와요. 루프는 요청을 여러 번 보내니 토큰과 시간이 늘어요.',
        '수업에서는 이렇게 나눠 봐요. 매주 학습지를 파싱해 문항을 뽑는 일은 워크플로, 학생 질문 창구처럼 <b>자료 질문·채점 부탁·퀴즈 요청이 섞여 들어오는 곳</b>은 에이전트예요.'
      ], tip: '"이 일의 단계를 미리 순서도로 그릴 수 있나?" 그릴 수 있으면 워크플로부터 만들어요. 갈림길이 많아질 때 에이전트로 바꿔요.' },
      { t: 'q', kind: 'mc', fig: 'q_whoOrder', q: 'c3u1의 <code>helper.py</code>가 "검색 → 프롬프트 조립 → 답"을 늘 같은 순서로 하는 까닭은?',
        opts: ['Solar가 매번 같은 순서를 고르도록 학습되어서', '내 코드가 그 순서대로 함수를 부르게 짜여서', 'temperature를 낮게 두어 답이 일정해져서', '임베딩 검색은 원래 한 번만 할 수 있어서'], a: 1,
        why: '워크플로에서는 순서를 <b>내 코드</b>가 정해요. Solar는 마지막에 조립된 프롬프트를 받아 답만 써요.',
        ex: ['helper.py에서는 Solar가 순서를 고를 기회가 아예 없어요. 도구 목록을 주지 않았거든요.', '', 'temperature는 답 글의 무작위성이에요. 단계 순서와는 상관없어요.', '검색은 몇 번이든 할 수 있어요. 한 번만 하는 건 코드가 그렇게 짰기 때문이에요.'] },
      { t: 'q', kind: 'mc', fig: 'q_pickOne', q: '다음 중 <b>에이전트</b>가 더 잘 맞는 수업 도구는?',
        opts: ['매주 금요일 학습지 PDF를 파싱해 문항을 questions.json에 저장하기', '수행평가 제출 코드를 정해진 테스트 케이스로 채점해 CSV로 내기', '단원 자료 하나를 매번 같은 틀의 세 줄 요약으로 바꾸기', '학생이 자료 질문·코드 채점·연습 문제 중 무엇이든 묻는 질문 창구'], a: 3,
        why: '부탁마다 필요한 단계가 다르면 모델이 다음 행동을 고르는 에이전트가 맞아요. 나머지 셋은 단계가 늘 같은 워크플로예요.',
        ex: ['파싱 → 추출 → 저장, 늘 같은 순서예요. 워크플로로 충분해요.', '테스트 실행 → 점수 → CSV, 순서가 정해져 있어요(c4u1).', '입력도 단계도 늘 같아요. 프롬프트 하나면 돼요.', ''] },
      { t: 'q', kind: 'blank', fig: 'q_returns', q: '에이전트 루프를 말로 적었어요. 빈칸에 들어갈 말은?', lang: 'plain', code: '1. 질문 + 도구 목록을 Solar에게 보낸다\n2. Solar가 [[1]]을 돌려준다\n3. 내 코드가 도구를 실행한다\n4. 결과를 붙여 다시 보낸다',
        opts: ['부를 도구 이름과 넣을 값', '실행이 끝난 함수의 결과', '고쳐 쓴 파이썬 코드 파일', '질문의 임베딩 벡터'], a: 0,
        why: 'Solar는 함수를 실행하지 못해요. "이 도구를 이 값으로 불러 주세요"라는 요청(<code>tool_calls</code>)을 글로 돌려줄 뿐이에요.',
        ex: ['', '결과는 3단계에서 내 코드가 실행해야 생겨요. Solar는 아직 결과를 몰라요.', '도구를 쓰는 동안 Solar가 내 파일을 고치지는 않아요.', '임베딩은 c2u3의 검색 이야기예요. 도구 호출 응답과는 달라요.'] },
      { t: 'q', kind: 'mc', fig: 'q_cost', q: '질문 도우미를 워크플로에서 에이전트로 바꿨더니, 비슷한 질문에도 요금이 더 나와요. 가장 그럴듯한 까닭은?',
        opts: ['에이전트로 바꾸면 도구를 고르려고 더 비싼 모델로 저절로 바뀐다', '루프를 돌며 대화를 늘려 가며 요청을 여러 번 보낸다', '도구를 쓰면 도구 하나마다 정해진 이용료가 붙는다', '에이전트 응답은 늘 스트리밍이라 토큰이 두 배다'], a: 1,
        why: '도구를 부를 때마다 결과를 붙여 <b>다시</b> 요청하고, 그때마다 지금까지의 대화를 통째로 보내요(c1u2). 턴이 늘수록 입력 토큰도 쌓여요.',
        ex: ['모델은 바뀌지 않아요. 내가 <code>MODEL</code>에 적은 그대로예요.', '', '도구마다 정해진 이용료는 없어요. 늘어나는 건 요청 횟수와 토큰이에요(도구 안에서 API를 또 부르면 그 요금은 더해져요).', '스트리밍은 받는 방식일 뿐 토큰 수를 바꾸지 않아요.'] },
      { t: 'sum', pts: ['워크플로: 단계와 순서를 내 코드가 미리 정한 흐름. 예측 쉽고 싸다(c3u1 helper.py).', '에이전트: 모델이 도구 목록을 보고 다음 행동을 고른다. 모델은 도구 이름과 값을 글로 돌려줄 뿐, 실행은 내 코드.', '루프는 요청 → 도구 실행 → 결과 붙여 다시 요청의 되풀이. 턴마다 토큰이 쌓이니 워크플로로 되는 일은 워크플로로.'] }
    ]},

    /* =================== L2 =================== */
    { id: 'L2', type: 'lesson', title: '도구 정의하기: tools', sub: '이름·설명·매개변수, tool_choice, 도구 호출 응답 읽기', min: 11, steps: [
      { t: 'say', h: '도구는 이름·설명·매개변수로 알려요', fig: 'toolCard', code: { lang: 'py', src: TOOL_DEF }, p: [
        'Solar에게 도구를 알려 줄 때는 요청에 <code>tools</code> 목록을 넣어요. 도구 하나는 <code>"type": "function"</code>과 <code>function</code> 안의 <b>name</b>(이름), <b>description</b>(설명), <b>parameters</b>(받을 값)로 이뤄져요.',
        '<code>parameters</code>는 c2u2에서 쓴 <b>JSON Schema</b>예요. 맨 위는 <code>object</code>, 받을 값마다 <code>type</code>과 <code>description</code>, 꼭 필요한 값은 <code>required</code>에 적어요.',
        '함수 이름은 영문·숫자·<code>_</code>·<code>-</code>만, 64자까지 써요. 한 요청에 도구를 128개까지 넣을 수 있지만, 수업 도구는 3~5개면 충분해요.'
      ]},
      { t: 'say', h: 'Solar는 함수 몸통이 아니라 설명을 읽어요', fig: 'descRead', p: [
        'Solar에게 가는 건 <code>tools</code>에 적은 글뿐이에요. 내 파이썬 함수 코드는 보내지 않아요. 그래서 도구를 <b>고를지 말지</b>는 이름과 설명에 크게 달려 있어요.',
        '설명에는 <b>무엇을 하는지, 언제 쓰는지, 무엇을 돌려주는지</b>를 짧게 적어요. 매개변수 설명에는 예시를 넣어요. 예: <code>"찾을 말. 예: 반복문, 리스트"</code>',
        '설명 쓰기는 코딩한입에서 배운 프롬프트 쓰기와 같아요. 다만 읽는 쪽이 Solar라서, 헷갈릴 만한 두 도구는 서로 언제 쓰는지 갈라 적어요. 레슨 4에서 더 다듬어요.'
      ]},
      { t: 'say', h: 'tool_choice로 도구를 쓸지 정해요', table: { head: ['값', '뜻', '수업에서'], rows: [
        ['<code>"auto"</code>', 'Solar가 쓸지 말지 고름(도구가 있으면 기본)', '질문 창구 대부분'],
        ['<code>"required"</code>', '적어도 하나는 꼭 부름', '모든 답이 도구를 거쳐야 할 때'],
        ['<code>"none"</code>', '도구를 부르지 않음', '도구 목록은 둔 채 대화만 할 때'],
        ['특정 함수', '그 함수를 꼭 부름', '"퀴즈 만들기" 버튼처럼 할 일이 정해졌을 때'] ] }, p: [
        '특정 함수는 <code>{"type": "function", "function": {"name": "make_quiz"}}</code>처럼 적어요. 공식 도구 호출 문서의 예제도 이 방법으로 함수 하나를 꼭 부르게 해요.',
        '<code>"required"</code>로 두면 "안녕하세요" 같은 인사에도 도구를 불러요. 처음엔 <code>"auto"</code>로 시작하고 꼭 필요할 때만 바꿔요.'
      ]},
      { t: 'say', h: '도구를 부르면 답 대신 tool_calls가 와요', code: { lang: 'json', src: CALL_JSON }, p: [
        'Solar가 도구를 쓰기로 하면 <code>finish_reason</code>이 <code>"tool_calls"</code>이고, <code>message.tool_calls</code>에 부를 도구가 담겨 와요. 이때 <code>content</code>는 비어 있거나 <code>None</code>일 수 있어요.',
        '호출마다 <code>id</code>, 함수 <code>name</code>, <code>arguments</code>가 있어요. <code>arguments</code>는 딕셔너리가 아니라 <b>JSON 글자</b>라서 <code>json.loads</code>로 풀어 써요.',
        '<code>parallel_tool_calls</code>가 기본으로 켜져 있어서 한 번에 호출이 <b>여러 개</b> 올 수 있어요. 늘 여러 개가 오는 건 아니니, 목록을 끝까지 도는 코드로 짜요.'
      ], tip: '<code>parameters</code>는 내가 정의한 받을 값의 모양, <code>arguments</code>는 Solar가 채워 보낸 실제 값이에요.' },
      { t: 'q', kind: 'mc', fig: 'q_seeWhat', q: 'Solar가 <code>search_materials</code>를 부를지 고를 때 <b>보는 것</b>은?',
        opts: ['파이썬 함수 몸통 코드와 그 안의 주석', '<code>tools</code>에 적은 이름·설명·매개변수', '<code>search.py</code> 파일 전체와 <code>chunks.json</code>', '지난주에 그 함수를 실행한 기록'], a: 1,
        why: '요청에 실려 가는 건 <code>tools</code>에 적은 글뿐이에요. 함수 코드나 파일은 Solar에게 가지 않아요.',
        ex: ['함수 코드는 내 컴퓨터에만 있어요. 보내지 않아요.', '', '파일은 내가 따로 보내지 않는 한 Solar가 볼 수 없어요.', 'API는 기억하지 않아요(c1u2). 대화에 붙여 보낸 것만 봐요.'] },
      { t: 'q', kind: 'blank', fig: 'q_paramBlank', q: '도구 정의의 빈칸이에요. 받을 값의 모양(JSON Schema)을 적는 칸 이름은?', lang: 'py', code: src(['"function": {', '  "name": "make_quiz",', '  "description": "단원 퀴즈 만들기",', '  "[[1]]": {', '    "type": "object",', '    "properties": {…}}}']),
        opts: ['arguments', 'properties', 'response_format', 'parameters'], a: 3,
        why: '받을 값의 모양은 <code>parameters</code>예요. 그 안의 <code>properties</code>에 값마다 type과 description을 적어요.',
        ex: ['<code>arguments</code>는 Solar가 채워 보낸 실제 값이에요. 정의할 때 쓰는 칸이 아니에요.', '<code>properties</code>는 parameters <b>안</b>에 들어가는 칸이에요.', '<code>response_format</code>은 구조화 출력의 모양을 정하는 칸이에요(c2u2).', ''] },
      { t: 'q', kind: 'line', fig: 'q_nameLine', q: '도구 이름을 모아 둔 목록이에요. 이름 규칙에 맞지 않아 <b>고쳐야 할 줄</b>을 눌러 보세요.', lang: 'py', code: src(['TOOL_NAMES = [', '    "search_materials",', '    "grade_code",', '    "퀴즈 만들기",', '    "check-answer",', ']']), a: 3,
        why: '함수 이름은 영문·숫자·<code>_</code>·<code>-</code>만 써요. 한글과 띄어쓰기가 든 이름은 <code>make_quiz</code>처럼 바꾸고, 한글 뜻은 description에 적어요. <code>check-answer</code>의 <code>-</code>는 괜찮아요.' },
      { t: 'q', kind: 'mc', fig: 'q_quizBtn', q: 'Streamlit 화면에 <b>퀴즈 만들기</b> 버튼을 달았어요. 이 버튼을 누르면 Solar가 <b>반드시</b> <code>make_quiz</code>를 부르게 하려면 <code>tool_choice</code>를?',
        opts: ['<code>"auto"</code>로 두고 질문에 "퀴즈"를 꼭 넣는다', '<code>"none"</code>으로 두고 퀴즈 프롬프트를 따로 보낸다', 'make_quiz를 이름으로 지정한 특정 함수 값', '<code>"required"</code>로 두면 늘 make_quiz가 불린다'], a: 2,
        why: '할 일이 정해졌으면 <code>{"type": "function", "function": {"name": "make_quiz"}}</code>처럼 <b>특정 함수</b>를 지정해요. 그 함수를 꼭 불러요.',
        ex: ['auto는 Solar가 고르는 거라 "반드시"는 아니에요.', 'none이면 도구를 아예 안 불러요.', '', 'required는 "하나는 꼭"일 뿐, 어느 도구일지는 Solar가 골라요.'] },
      { t: 'sum', pts: ['tools의 도구 하나 = type "function" + name(영문·숫자·_·-, 64자)·description·parameters(JSON Schema). 128개까지, 수업용은 3~5개.', 'Solar는 함수 코드가 아니라 이름·설명을 보고 고른다. 설명에 하는 일·쓸 때·돌려주는 것.', 'tool_choice: auto(기본)·required·none·특정 함수. 도구를 부르면 finish_reason "tool_calls", arguments는 JSON 글자 → json.loads.'] }
    ]},

    /* =================== QA =================== */
    { id: 'QA', type: 'quiz', title: '헷갈림 퀴즈 ①', sub: 'tool_calls와 content, auto와 required, 함수는 누가 돌리나', min: 3, steps: [
      { t: 'q', kind: 'mc', fig: 'qa_emptyAns', q: '학생 질문을 보냈더니 화면에 아무 답도 안 나와요. 응답을 찍어 보니 <code>content</code>는 <code>None</code>, <code>finish_reason</code>은 <code>"tool_calls"</code>예요. 무슨 일일까요?',
        opts: ['Solar가 답 대신 도구 실행을 요청했다. 결과를 붙여 다시 보내야 한다', '<code>max_tokens</code>가 모자라 답이 잘렸다. 값을 늘려야 한다', '키가 틀려 빈 응답이 왔다. <code>.env</code>를 고쳐야 한다', '안전장치에 걸려 답이 지워졌다. 질문을 바꿔야 한다'], a: 0,
        why: '<code>finish_reason="tool_calls"</code>는 "이 도구들을 먼저 실행해 주세요"라는 뜻이에요. 답은 도구 결과를 붙여 다시 요청한 <b>다음 턴</b>에 와요.',
        ex: ['', '잘렸다면 <code>finish_reason</code>이 <code>"length"</code>예요.', '키가 틀리면 응답 대신 <code>401</code> 오류가 나요.', '이 응답은 정상이에요. 도구 실행을 기다리는 중이에요.'] },
      { t: 'q', kind: 'mc', fig: 'qa_hello', q: '학생이 "안녕하세요!"라고 인사만 했는데도 에이전트가 매번 <code>search_materials</code>를 불러요. 코드에서 무엇이 가장 의심스러울까요?',
        opts: ['<code>tool_choice="auto"</code>로 되어 있다', '<code>tool_choice="none"</code>으로 되어 있다', '<code>tool_choice="required"</code>로 되어 있다', '<code>parallel_tool_calls</code>가 기본값대로 켜져 있다'], a: 2,
        why: '<code>"required"</code>는 무슨 말이 오든 도구를 <b>적어도 하나</b> 부르게 해요. 인사에는 도구가 필요 없으니 <code>"auto"</code>로 두고 Solar가 고르게 해요.',
        ex: ['auto면 인사에는 보통 도구 없이 바로 답해요.', 'none이면 도구를 아예 부르지 않아요.', '', '여러 개를 한꺼번에 부를 수 있게 할 뿐, 도구를 꼭 부르게 하지는 않아요.'] },
      { t: 'q', kind: 'mc', fig: 'qa_whereRun', q: '<code>grade_code</code> 도구 함수 안에 <code>print("채점 시작")</code>을 넣었어요. 에이전트가 이 도구를 부르면 이 글은 어디에 찍힐까요?',
        opts: ['업스테이지 콘솔의 Usage 화면', 'Solar 응답의 <code>content</code> 안', '학생의 브라우저 화면', '<code>agent.py</code>를 실행한 내 터미널'], a: 3,
        why: '도구 함수는 <b>내 파이썬 프로그램</b>이 실행해요. 그래서 print도 내 터미널에 찍혀요. Solar는 함수를 실행하지 않고, 내가 붙여 보낸 결과 글만 읽어요.',
        ex: ['Usage는 토큰·요금을 보는 곳이에요. 내 함수의 출력은 가지 않아요.', 'Solar는 함수를 돌리지 않아요. print 글은 내가 결과로 붙여 보내지 않는 한 Solar에게 가지도 않아요.', '도구는 서버 쪽 내 코드에서 돌아요. 학생 화면과는 따로예요.', ''] }
    ]},

    /* =================== L3 =================== */
    { id: 'L3', type: 'lesson', title: 'agent.py 루프 짜기', sub: '순서대로 붙이기, 호출마다 결과, 최대 턴', min: 17, steps: [
      { t: 'say', h: '순서가 어긋나면 API가 대화를 거절해요', fig: 'msgStack', code: { lang: 'py', src: LOOP }, p: [
        '공식 순서는 이래요. ① <code>tools</code>와 함께 요청 → ② <code>tool_calls</code>가 오면 그 <b>assistant 메시지를 먼저</b> 대화에 붙이고 → ③ 호출마다 함수를 실행해 <code>"role": "tool"</code> 결과를 붙이고 → ④ 다시 요청해 최종 답을 받아요.',
        'tool 결과에는 어느 호출의 답인지 알려 주는 <code>tool_call_id</code>와 함수 <code>name</code>을 적어요. 앞의 assistant 메시지 속 호출과 이 id로 짝이 맞아야 해요.',
        '짝이 안 맞으면(assistant 메시지가 없거나, 결과가 하나 빠지면) 다음 요청이 거절돼요. Solar Pro 4 공식 쿡북이 꼽은 주의점도 바로 이 순서예요.'
      ]},
      { t: 'say', h: 'ask(): 요청 한 번을 함수로', code: { lang: 'py', src: ASK }, p: [
        '<code>client</code>는 c1u3의 표준 코드 그대로예요(<code>base_url</code>, <code>.env</code>의 <code>UPSTAGE_API_KEY</code>). 모델 이름은 <code>MODEL</code> 하나에 모아요.',
        '<code>reasoning_effort</code>는 늘 직접 적어요. 도구를 고르고 결과를 엮는 일은 여러 단계 판단이라 공식 쿡북의 에이전트 예제도 <code>"medium"</code>을 써요. 간단한 질문 창구라면 <code>"none"</code>과 비교해 보고 골라요.',
        '도구만 부른 턴에는 <code>content</code>가 <code>None</code>으로 올 수 있어요. 그대로 쌓으면 다음 요청이 거절될 수 있어서, 루프에서 빈 글 <code>""</code>로 바꿔 둔 거예요.'
      ]},
      { t: 'say', h: '호출마다 결과 하나씩, 빠짐없이', fig: 'parallel', code: { lang: 'py', src: TOOL_MSG }, p: [
        '<code>arguments</code>는 JSON 글자라서 <code>json.loads</code>로 딕셔너리로 바꿔요. 결과 <code>content</code>도 글이어야 해서 <code>str()</code>로 감싸요. 딕셔너리 결과라면 <code>json.dumps(…, ensure_ascii=False)</code>도 좋아요.',
        '<code>parallel_tool_calls</code>가 기본으로 켜져 있어 호출이 여러 개 올 수 있어요. 루프의 <code>for c in msg.tool_calls</code>가 <b>모든</b> 호출에 결과를 하나씩 만들어 붙여요.'
      ]},
      { t: 'say', h: '최대 턴과 오류는 내 코드가 막아요', fig: 'maxTurns', code: { lang: 'py', src: RUN_TOOL }, p: [
        'Solar가 같은 도구를 계속 부르면 루프가 끝나지 않아요. <code>MAX_TURNS</code>(예: 5)를 넘으면 멈추고 "답을 마치지 못했어요"라고 알려요. 턴마다 대화가 길어지니 비용도 함께 막는 셈이에요.',
        '<code>run_tool</code>은 <b>등록한 함수만</b> 실행해요. Solar가 없는 이름을 지어내도 실행되지 않고 "모르는 도구"라는 글이 돌아가요. <code>f(**args)</code>는 딕셔너리를 이름 붙인 인자로 풀어 넣는 문법이에요.',
        '도구 안에서 오류가 나면 프로그램을 멈추지 말고 오류 글을 결과로 돌려줘요. Solar가 읽고 값을 고쳐 다시 부르거나 학생에게 사정을 알려요.'
      ]},
      { t: 'sim', h: '터미널에서 agent.py를 돌려 봐요', p: 'IDE 창 아래 터미널에 명령을 쳐서, 질문마다 몇 턴 돌고 어떤 도구를 불렀는지 봐요. 칸을 누르면 글이 저절로 쳐져요.',
        scene: { win: 'ide', folder: 'upstage-lab', files: LAB_FILES, open: 'agent.py', lang: 'py', code: AGENT_PY, term: [] },
        steps: [
          { goal: '자료와 퀴즈를 함께 부탁해요', type: RUN1, into: 'term', then: { term: OUT1, prompt: '' },
            say: '첫 턴에 도구 <b>두 개</b>를 한꺼번에 불렀어요. 결과 두 개를 붙여 다시 보내자 둘째 턴에 최종 답이 왔어요.' },
          { goal: '인사만 해 봐요', type: RUN2, into: 'term', then: { term: OUT2, prompt: '' },
            say: '<code>tool_choice="auto"</code>라서 도구가 필요 없으면 첫 턴에 바로 답해요.' },
          { goal: '끝없이 찾게 하는 부탁을 해 봐요', type: RUN3, into: 'term', then: { term: OUT3, prompt: '' },
            say: '같은 도구를 계속 부르다 <code>MAX_TURNS</code>에서 멈췄어요. 이런 부탁에는 범위를 좁혀 달라고 안내하는 게 좋아요.' } ],
        end: '부른 도구, 턴 수, 최종 답. 터미널 기록이 에이전트의 일기예요.' },
      { t: 'try', lang: 'py', h: '흉내 낸 응답으로 루프를 돌려 봐요', p: '진짜 API 대신 미리 적어 둔 Solar 응답 두 개(첫째는 도구 호출 2개, 둘째는 최종 답)로 루프를 돌려요. 실행해서 messages가 어떤 순서로 쌓이는지 보세요.',
        src: PLAY,
        note: '해 볼 것: ① FAKE의 두 번째 호출을 지우고 돌려 보기 ② <code>messages.append(msg)</code> 줄을 주석으로 막으면 목록에서 무엇이 빠지는지 보기 ③ <code>run_tool</code>에 없는 이름으로 호출을 하나 더해 보기' },
      { t: 'q', kind: 'line', fig: 'q_orderLine', q: '도구 호출을 처리하는 코드예요. 이대로면 다음 요청이 거절돼요. <b>자리가 틀린 줄</b>을 눌러 보세요.', lang: 'py', code: src(['msg = ask(messages)', 'if msg.content is None:', '    msg.content = ""', 'for c in msg.tool_calls:', '    messages.append(tool_msg(c))', 'messages.append(msg)']), a: 5,
        why: 'assistant 메시지를 tool 결과보다 <b>먼저</b> 붙여야 해요. 지금은 결과 뒤에 붙어서, 결과가 어느 호출의 것인지 짝을 맞출 수 없어요. 이 줄을 <code>for</code> 위로 올려요.' },
      { t: 'q', kind: 'mc', fig: 'q_loopStuck', q: '"모든 단원 자료를 하나씩 다 찾아 줘"라는 부탁에 에이전트가 <code>search_materials</code>를 끝없이 불러요. 코드에 먼저 둘 안전장치는?',
        opts: ['도구 이름을 더 길고 자세하게 바꾼다', '<code>MAX_TURNS</code>를 정해 넘으면 멈추고 알린다', '<code>reasoning_effort</code>를 <code>"max"</code>로 올린다', '<code>parallel_tool_calls</code>를 꺼서 하나씩 부르게 한다'], a: 1,
        why: '루프는 내 코드가 돌려요. 최대 턴 수를 정해 두면 Solar가 무엇을 하든 그 안에서 끝나고, 비용도 그만큼만 나가요.',
        ex: ['이름은 고를 때 도움이 될 뿐, 멈추게 하지는 못해요.', '', '추론을 늘리면 턴마다 토큰만 더 들 수 있어요. 늘 더 좋은 답을 보장하지도 않아요.', '하나씩 부르면 턴만 더 늘어나요.'] },
      { t: 'q', kind: 'mc', fig: 'q_argsType', q: '<code>c.function.arguments["query"]</code>로 값을 꺼내려 했더니 <code>TypeError</code>가 났어요. 왜일까요?',
        opts: ['arguments는 JSON 글자라서 json.loads로 먼저 풀어야 한다', 'arguments는 리스트라서 번호로 꺼내야 한다', 'query는 description에만 있고 arguments에는 없다', 'Solar가 값을 채우지 않아 arguments가 늘 None이다'], a: 0,
        why: '<code>arguments</code>는 <code>\'{"query": "반복문"}\'</code> 같은 <b>글자</b>예요. 글자에 <code>["query"]</code>를 쓰면 TypeError가 나요. <code>json.loads</code>로 딕셔너리로 바꾼 뒤 꺼내요.',
        ex: ['', '리스트가 아니라 JSON 글자예요.', 'required로 정한 query는 arguments에 채워져 와요. 문제는 그 모양이 글자라는 거예요.', '값은 채워져 와요. 다만 딕셔너리가 아닌 글자로 와요.'] },
      { t: 'sum', pts: ['순서: tools와 요청 → assistant 메시지 먼저 붙이기 → 호출마다 tool 결과(tool_call_id·name·content) → 다시 요청 → 최종 답.', 'content가 None이면 "", arguments는 json.loads, 결과는 글로. 호출이 여러 개면 모두에 결과 하나씩.', '등록한 함수만 실행, 도구 오류는 글로 돌려주고, MAX_TURNS로 끝없는 반복과 비용을 막는다.'] }
    ]},

    /* =================== L4 =================== */
    { id: 'L4', type: 'lesson', title: '수업 에이전트의 도구 설계', sub: '세 도구, 최소 권한, 사람 확인, 설명 쓰기', min: 11, steps: [
      { t: 'say', h: '지금까지 만든 것이 그대로 도구가 돼요', fig: 'classTools', table: { head: ['도구', '하는 일', '안에서 쓰는 것', '돌려주는 것'], rows: [
        ['<code>search_materials(query)</code>', '수업자료에서 근거 찾기', 'c2u3 <code>search.py</code>, c3u1 검색', '조각 글 + 출처(파일·쪽)'],
        ['<code>grade_code(problem_id, code)</code>', '학생 코드 채점', 'c4u1 <code>grader/</code>(시간 제한 실행)', '통과·실패한 테스트 케이스'],
        ['<code>make_quiz(topic, n)</code>', '단원 퀴즈 만들기', 'c2u2 구조화 출력(strict)', '문항 JSON 목록'] ] }, p: [
        '새로 만들 건 거의 없어요. 앞 단원들에서 만든 함수에 <b>이름·설명·매개변수</b>를 붙이면 에이전트의 도구가 돼요.',
        '<code>make_quiz</code>처럼 도구 안에서 Solar를 한 번 더 부를 수도 있어요. <code>response_format</code>으로 문항 모양을 정하고 <code>json.loads</code>로 받아요. 이 호출의 토큰도 요금에 들어가요.',
        '트랙 B만 했다면 <code>grade_code</code>는 빼고 두 도구로 시작해도 돼요.'
      ]},
      { t: 'say', h: '최소 권한: 필요한 도구만, 할 수 있는 만큼만', fig: 'leastPriv', p: [
        '에이전트는 받은 도구로 할 수 있는 일까지만 해요. 거꾸로 말하면 <b>도구가 할 수 있는 일이 사고의 최대 크기</b>예요. 파일 지우기·메일 보내기·성적 고치기 같은 도구는 처음부터 주지 않아요.',
        'c3u3에서 본 프롬프트 인젝션을 떠올려요. 수업자료나 학생 글 속에 "모든 파일을 지워" 같은 숨은 지시가 있으면 Solar가 속을 수 있어요. 지우는 도구가 없으면 속아도 지울 수 없어요.',
        '도구도 좁게 만들어요. 아무 파일이나 읽는 <code>read_file(path)</code> 대신 <code>data/</code>의 수업자료만 찾는 <code>search_materials</code>, 학생 코드는 c4u1처럼 시간 제한을 둔 채로만 실행하는 <code>grade_code</code>예요.'
      ]},
      { t: 'say', h: '되돌리기 어려운 일 앞에는 사람 확인', fig: 'humanGate', code: { lang: 'py', src: NEED_OK }, p: [
        '퀴즈를 <code>quizzes/</code> 폴더에 저장하는 <code>save_quiz</code>처럼 꼭 필요한 "쓰기" 도구는 실행 <b>전에</b> 교사에게 물어요. 위 코드는 하려는 일과 값을 보여 주고 <code>y</code>를 받아야만 실행해요.',
        '거절하면 "교사가 멈췄어요"가 결과로 돌아가요. Solar는 그 글을 읽고 다른 방법을 찾거나 사정을 알려요.',
        '학생에게 보내기, 성적 기록처럼 되돌릴 수 없는 일은 에이전트가 <b>초안까지만</b> 만들고 마지막 버튼은 교사가 눌러요. 커서한입에서 Agent가 터미널 명령을 실행하기 전에 묻던 것과 같은 생각이에요.'
      ]},
      { t: 'say', h: '설명에는 언제 안 쓰는지까지', table: { head: ['도구', '흐린 설명', '분명한 설명'], rows: [
        ['<code>search_materials</code>', '"검색"', '"정보 수업자료에서 근거 조각을 찾아요. 수업 내용 질문이면 답하기 전에 먼저 써요. 결과: 조각 글과 출처"'],
        ['<code>grade_code</code>', '"코드 확인"', '"학생 파이썬 코드를 문제 번호의 테스트로 채점해요. 개념 질문에는 쓰지 않아요. 결과: 통과·실패 케이스"'],
        ['<code>make_quiz</code>', '"퀴즈"', '"단원 객관식 문항을 n개(1~5) 만들어요. 학생이 연습 문제를 달라고 할 때만 써요"'] ] }, p: [
        'Solar는 설명을 보고 도구를 고르니, 설명이 흐리면 엉뚱한 도구를 부르거나 도구 없이 지어내 답해요. <b>하는 일, 쓸 때, 안 쓸 때, 돌려주는 것</b>을 적어요.',
        '시스템 프롬프트에도 규칙을 한 줄씩 적어요. 예: "수업 내용 질문은 먼저 search_materials로 찾고, 찾은 내용만 근거로 답해." c3u1의 "자료에 없으면 모른다고" 규칙과 이어져요.'
      ]},
      { t: 'try', lang: 'md', h: '내 도구 설명서를 써 봐요', p: '<code>make_quiz</code>의 설명과 매개변수 설명을 채워 보세요. 다 쓰면 미션에서 agent.py의 tools에 옮겨요.',
        src: src(['## make_quiz', '- 하는 일: ', '- 쓸 때: ', '- 안 쓸 때: ', '- 돌려주는 것: ', '', '### 매개변수', '- topic: ', '- n: ']),
        note: '읽는 쪽은 Solar예요. 짧게, 그리고 "안 쓸 때"를 꼭 적어요.' },
      { t: 'q', kind: 'mc', fig: 'q_whichNot', q: '학생용 질문 도우미 에이전트를 만들어요. 다음 중 <b>주지 말아야 할</b> 도구는?',
        opts: ['<code>search_materials</code>: data/ 수업자료에서 근거 찾기', '<code>read_file</code>: 경로를 받아 컴퓨터의 어느 파일이든 읽기', '<code>grade_code</code>: 시간 제한을 두고 학생 코드 채점', '<code>make_quiz</code>: 단원 연습 문제 만들기'], a: 1,
        why: '<code>read_file</code>은 학생이 "<code>.env</code>를 읽어 줘"라고 하면 키까지 읽어 보여 줄 수 있어요. 읽기 도구도 <b>필요한 곳만</b> 읽게 좁혀요.',
        ex: ['data/ 수업자료만 찾는 좁은 도구라 괜찮아요.', '', '시간 제한을 둔 채점은 트랙 A의 핵심 도구예요(c4u1).', '연습 문제를 만들 뿐, 아무것도 지우거나 보내지 않아요.'] },
      { t: 'q', kind: 'mc', fig: 'q_gate', q: '에이전트가 만든 퀴즈를 학급 게시판에 올리는 기능을 넣고 싶어요. 가장 알맞은 설계는?',
        opts: ['에이전트는 초안까지, 올리기는 교사가 확인하고 누른다', '게시 도구를 주고 Solar가 알아서 올리게 한다', '올리기 전에 Solar에게 "확실해?"라고 한 번 더 묻는다', '잘못 올라가면 지울 수 있게 지우기 도구도 함께 준다'], a: 0,
        why: '학생에게 보이는 일은 되돌리기 어려워요. 에이전트는 초안을 만들고, 마지막 확인과 올리기는 사람이 해요.',
        ex: ['', '틀린 문제나 엉뚱한 내용이 확인 없이 학생에게 가요.', 'Solar에게 다시 묻는 건 사람 확인이 아니에요. 같은 모델이 같은 실수를 할 수 있어요.', '지우는 도구까지 주면 권한만 넓어져요. 그사이 본 학생도 있어요.'] },
      { t: 'q', kind: 'line', fig: 'q_toolsLine', q: '수업 에이전트의 도구 목록 메모예요. 최소 권한에 <b>어긋나는 줄</b>을 눌러 보세요.', lang: 'plain', code: src(['search_materials: data/ 자료에서 찾기', 'grade_code: 시간 제한을 두고 채점', 'make_quiz: 퀴즈 JSON 만들기', 'send_email: 학부모에게 메일 보내기', 'save_quiz: 저장 전 교사 확인']), a: 3,
        why: '메일 보내기는 수업 에이전트에 필요 없고, 한 번 보내면 되돌릴 수 없어요. 학생 개인정보가 섞일 위험도 있어요. 이런 일은 에이전트에게 맡기지 않아요.' },
      { t: 'q', kind: 'mc', fig: 'q_descFix', q: '"for문이 뭐예요?"라는 질문에 에이전트가 <code>grade_code</code>를 불러요. 가장 먼저 고칠 곳은?',
        opts: ['<code>grade_code</code> 함수 안의 채점 로직', '<code>tool_choice</code>를 <code>"none"</code>으로', '도구 설명에 언제 쓰고 언제 안 쓰는지', '<code>MAX_TURNS</code>를 1로 줄이기'], a: 2,
        why: 'Solar는 설명을 보고 도구를 골라요. grade_code 설명에 "학생 코드를 채점할 때만, 개념 질문에는 쓰지 않음"을, search_materials 설명에 "수업 내용 질문이면 먼저"를 적어요.',
        ex: ['채점은 맞게 했어요. 문제는 <b>언제</b> 불렀느냐예요.', '도구를 다 꺼 버리면 자료 검색도 못 해요.', '', '턴을 줄여도 잘못 고르는 건 그대로예요.'] },
      { t: 'sum', pts: ['앞 단원 함수(search.py·grader·구조화 출력)에 이름·설명·매개변수를 붙이면 도구가 된다.', '최소 권한: 필요한 도구만, 좁게. 지우기·보내기·아무 파일 읽기는 주지 않는다.', '되돌리기 어려운 일은 실행 전 교사 확인, 아니면 초안까지만. 설명에는 하는 일·쓸 때·안 쓸 때·돌려주는 것.'] }
    ]},

    /* =================== QB =================== */
    { id: 'QB', type: 'quiz', title: '헷갈림 퀴즈 ②', sub: '최소 권한, 확인 단계, 도구 설명', min: 3, steps: [
      { t: 'q', kind: 'mc', fig: 'qb_bigTool', q: '도구를 하나로 줄이려고 <code>run_python(code)</code>(아무 파이썬 코드나 실행)를 만들어 검색·채점·퀴즈를 다 하게 하자는 제안이 나왔어요. 어떻게 볼까요?',
        opts: ['도구 수가 적을수록 Solar가 덜 헷갈리니 이 제안이 가장 낫다', '시간 제한만 걸면 무엇이든 실행해도 안전하다', '설명만 잘 쓰면 위험한 코드는 Solar가 안 쓴다', '하는 일이 너무 넓어 위험하다. 좁은 도구 셋으로 나눈다'], a: 3,
        why: '아무 코드나 실행하는 도구는 파일 지우기·키 읽기까지 다 할 수 있어요. 하는 일이 분명한 좁은 도구 여럿이 더 안전하고, Solar가 고르기도 쉬워요.',
        ex: ['덜 헷갈리는 건 도구마다 하는 일이 분명할 때예요. 게다가 수가 아니라 <b>한 도구가 할 수 있는 일의 넓이</b>가 위험을 정해요.', '시간 제한은 무한 반복만 막아요. 1초면 파일은 지워져요.', '인젝션에 속으면 설명과 상관없이 위험한 코드를 쓸 수 있어요(c3u3).', ''] },
      { t: 'q', kind: 'mc', fig: 'qb_confirm', q: '다음 중 실행 <b>전에 교사 확인</b>을 받게 할 도구로 가장 알맞은 것은?',
        opts: ['<code>search_materials</code>: 자료에서 조각 찾기', '<code>save_quiz</code>: 만든 퀴즈를 quizzes/에 파일로 저장', '<code>make_quiz</code>: 퀴즈 JSON을 만들어 돌려주기', '<code>grade_code</code>: 학생 코드를 시간 제한 안에서 실행해 채점하기'], a: 1,
        why: '파일 쓰기처럼 <b>밖에 흔적을 남기는</b> 도구 앞에 확인을 둬요. 찾기·만들어 돌려주기·채점해 돌려주기는 결과를 대화에 돌려줄 뿐이라 묻지 않아도 돼요.',
        ex: ['찾기만 하고 아무것도 바꾸지 않아요.', '', '만든 결과를 대화에 돌려줄 뿐, 저장하거나 보내지 않아요.', '코드를 실행하긴 해도 시간 제한 안에서 채점 결과만 돌려줘요. 성적을 기록하지 않아요. 기록은 교사가 해요.'] },
      { t: 'q', kind: 'mc', fig: 'qb_twoSearch', q: '<code>search_materials</code>(수업자료 찾기)와 <code>search_questions</code>(questions.json 문항 찾기)를 줬더니, "반복문이 뭐예요?"에도 자꾸 문항을 찾아요. 가장 알맞은 손질은?',
        opts: ['두 설명에 무엇을 찾는지, 언제 쓰는지를 갈라 적는다', '두 도구 이름을 search1, search2로 짧게 바꾼다', '<code>tool_choice</code>를 <code>"required"</code>로 바꿔 둘 다 부르게 한다', '매개변수를 없애 Solar가 고를 것을 줄인다'], a: 0,
        why: '비슷한 두 도구는 설명으로 갈라 줘요. "개념 설명이 필요하면 search_materials", "문항·정답을 찾을 때만 search_questions"처럼요.',
        ex: ['', '이름이 흐려지면 더 헷갈려요. 이름은 하는 일이 드러나게 지어요.', 'required는 "적어도 하나"일 뿐, 맞는 쪽을 고르게 하지 않아요.', '찾을 말을 못 넘기면 검색 자체가 안 돼요.'] }
    ]},

    /* =================== L5 =================== */
    { id: 'L5', type: 'lesson', title: 'MCP와 Studio', sub: 'Cursor 에이전트에 업스테이지 문서 도구 붙이기, 노코드 문서 에이전트', min: 12, steps: [
      { t: 'say', h: 'MCP: 남이 만든 도구 묶음을 꽂아 쓰는 표준', fig: 'mcpBridge', p: [
        '지금까지는 <code>agent.py</code> 안에 도구를 직접 만들었어요. <b>MCP</b>(Model Context Protocol)는 도구 묶음을 <b>MCP 서버</b>로 만들어 두고, Cursor 같은 프로그램이 그대로 꽂아 쓰게 하는 표준이에요. 커서한입 과정 3 단원 2에서 배웠죠.',
        '이때 루프를 돌리는 "내 코드" 자리는 Cursor가 맡아요. Cursor 에이전트가 도구 목록을 보고 부를 도구를 고르면, Cursor가 MCP 서버에 실행을 맡기고 결과를 대화에 붙여요.'
      ]},
      { t: 'say', h: '업스테이지 MCP 서버: 문서 읽기와 뽑기', table: { head: ['도구', '하는 일', '바탕 API'], rows: [
        ['<code>parse_document</code>', '문서를 글·구조로 읽기', 'Document Parse(c2u1)'],
        ['<code>extract_information</code>', '문서에서 정한 값 뽑기', 'Information Extract(c2u2)'] ] }, p: [
        '공식 MCP 서버 <code>mcp-upstage</code>(PyPI 패키지)에는 이 두 도구가 있어요. <b>채팅 도구는 없어요</b>. 대화와 판단은 Cursor 에이전트의 모델이 하고, 업스테이지 서버는 문서 일만 맡아요.',
        '준비물은 업스테이지 API 키, Python 3.10 이상, 그리고 파이썬 도구 <b>uv</b>(Astral)예요. <code>uvx mcp-upstage</code> 한 줄이면 따로 설치하지 않고 바로 실행돼요. 결과 파일은 홈 폴더의 <code>.mcp-upstage/outputs/</code> 아래에 남아요.',
        '도구를 부를 때마다 Document Parse·Information Extract 요금이 나가요. 정가로 어림하면 Document Parse standard가 쪽당 $0.01이라, 10쪽 학습지 하나에 $0.1 안팎이에요(모드에 따라 달라요).'
      ]},
      { t: 'say', h: '.cursor/mcp.json에 적고, 키는 지켜요', code: { lang: 'json', src: MCP_JSON }, p: [
        '커서한입에서 배운 대로 <code>upstage-lab/.cursor/mcp.json</code>의 <code>mcpServers</code>에 적어요. <code>command</code>와 <code>args</code>는 터미널에서 <code>uvx mcp-upstage</code>를 치는 것과 같고, <code>env</code>로 서버에 키를 넘겨요.',
        '공식 안내는 <code>env</code>에 키를 그대로 적는 모양이에요. 그렇게 했다면 이 파일은 <b>절대 커밋하지 않아요</b>. <code>.gitignore</code>에 <code>.cursor/mcp.json</code>을 더하거나, 저장소 밖 <code>~/.cursor/mcp.json</code>에 둬요.',
        '위처럼 <code>${env:UPSTAGE_API_KEY}</code>로 이름만 적으면 파일엔 키가 없어요. 다만 이건 <code>.env</code> 파일이 아니라 컴퓨터의 환경 변수를 읽어서, 셸 설정에 키를 넣고 Cursor를 다시 켜야 해요.'
      ], tip: '저장한 뒤엔 Cursor를 다시 켜고, Customize → MCPs에서 <code>mcp-upstage</code>가 켜졌는지 봐요.' },
      { t: 'sim', h: 'Cursor 에이전트에게 수업자료를 읽혀요', p: 'mcp.json을 적고 Cursor를 다시 켠 upstage-lab이에요. Customize에서 mcp-upstage를 켜고, 에이전트에게 학습지 요약을 부탁해 봐요.',
        scene: { win: 'agents', folder: 'upstage-lab', agents: [{ title: 'New Agent', on: true }], panel: EMPTY_PANEL },
        steps: [
          { goal: '사이드바의 Customize를 눌러요', click: 'side:customize', then: { customize: { nav: CUS_NAV, page: 'MCPs', items: MCP_OFF } },
            say: 'Customize의 <b>MCPs</b> 칸이에요. mcp.json에 적은 서버가 이름 그대로 보여요.' },
          { goal: 'mcp-upstage 줄의 스위치를 켜요', click: 'item:mcp-upstage',
            say: '켜 둔 서버의 도구만 에이전트가 써요. 커서한입에서 본 대로, 끄면 지우지 않고 쉬게 할 수 있어요.' },
          { goal: 'Customize를 닫아요', click: 'btn:close', then: { customize: null },
            say: '이제 새 대화에서 부탁해요.' },
          { goal: '부탁을 적어요', type: MCP_Q, into: 'chat',
            say: '서버와 도구 이름을 콕 집고, 학습지에 없는 내용은 덧붙이지 말라고 했어요.' },
          { goal: '보내요', click: 'btn:send', then: { panel: panel({ msgs: [{ me: MCP_Q }, { ai: MCP_A }] }) },
            say: '진짜 Cursor에서는 이 사이에 도구 호출 줄이 생겨요. 펼치면 넘긴 값(파일 경로)과 결과가 보이고, Run Mode에 따라 승인을 물을 수도 있어요.' } ],
        end: '문서 읽기는 업스테이지 서버가, 판단과 요약은 Cursor 에이전트가. 요약은 원본과 꼭 대조해요.' },
      { t: 'say', h: 'Upstage Studio: 코드 없이 만드는 문서 에이전트', fig: 'studioFlow', p: [
        '<b>Upstage Studio</b>는 문서 처리 노드 4개(<b>Parse · Classify · Extract · Instruct</b>)를 화면에서 이어 붙여 에이전트로 만드는 노코드 도구예요. 읽고, 종류별로 나누고, 칸을 뽑고, Instruct가 그 결과를 요약·검증·판단해요. 학습지 묶음을 종류별로 나누고 문항·정답을 뽑는 일처럼 <b>흐름이 정해진 문서 일</b>을 코드 없이 시제품으로 보여 줄 때 후보가 돼요. 학생 질문에 따라 도구를 고르는 질문 창구는 <code>agent.py</code>가 맞아요.',
        '요금은 2026년 9월 1일부터 <b>조직 단위 구독</b>(Free 요금제 등)으로 바뀌어, 요금제마다 쓸 수 있는 양이 정해져 있어요(예전의 "에이전트마다 무료 몇 번" 방식은 없어졌어요). 화면과 요금은 바뀔 수 있으니 공식 문서에서 직접 확인해요.'
      ]},
      { t: 'q', kind: 'mc', fig: 'q_mcpTools', q: 'Cursor에 <code>mcp-upstage</code>를 연결했어요. 에이전트가 새로 쓸 수 있게 되는 도구는?',
        opts: ['<code>parse_document</code>와 <code>extract_information</code>', '<code>parse_document</code>와 <code>solar_chat_completion</code>', '<code>search_materials</code>와 <code>grade_code</code>', '<code>solar_chat</code>과 <code>embed_text</code>'], a: 0,
        why: '<code>mcp-upstage</code>의 도구는 문서 파싱과 정보 추출 두 개예요. 채팅 도구는 없어요. 대화는 Cursor 에이전트의 모델이 해요.',
        ex: ['', '채팅 도구는 없어요. 문서 일만 맡아요.', '그건 내가 agent.py에 만든 도구예요.', '이런 도구는 없어요. 채팅도 임베딩도 이 서버의 일이 아니에요.'] },
      { t: 'q', kind: 'blank', fig: 'q_cmdBlank', q: '<code>.cursor/mcp.json</code>의 빈칸이에요. 들어갈 명령은?', lang: 'json', code: src(['"mcp-upstage": {', '  "command": "[[1]]",', '  "args": ["mcp-upstage"]', '}']),
        opts: ['pip', 'python', 'npx', 'uvx'], a: 3,
        why: '공식 안내대로 <code>uvx</code>로 실행해요. 설치하지 않고 패키지를 받아 바로 실행하는 uv의 명령이에요.',
        ex: ['<code>pip</code>은 패키지를 설치할 뿐 서버를 띄우지 않아요.', '<code>python mcp-upstage</code>는 그런 이름의 파일을 찾다가 실패해요.', '<code>npx</code>는 npm(JavaScript) 패키지를 실행해요. mcp-upstage는 파이썬 패키지예요.', ''] },
      { t: 'q', kind: 'mc', fig: 'q_keyCommit', q: '<code>.cursor/mcp.json</code>의 <code>env</code>에 진짜 키를 적었어요. 커밋하려고 <code>git status</code>를 보니 이 파일이 올라갈 목록에 있어요. 어떻게 할까요?',
        opts: ['private 저장소라면 나만 보니 그대로 커밋해도 된다', '커밋은 하되 푸시만 하지 않고 내 컴퓨터에 둔다', '커밋하지 않고 .gitignore에 더한다. 이미 올렸다면 키를 지우고 새로 만든다', '키 앞뒤 몇 글자만 지워 두고 커밋한다'], a: 2,
        why: '키가 든 mcp.json은 <code>.env</code>와 똑같이 다뤄요. 커밋하지 않고, 이미 깃허브에 올라갔다면 그 키는 샌 것으로 보고 콘솔 <b>API keys</b>에서 지운 뒤 새로 만들어요(c1u1).',
        ex: ['private이어도 함께 쓰는 사람에게 보이고, 나중에 공개하면 기록째 드러나요.', '커밋하면 기록에 남아요. 나중에 실수로 푸시하면 그대로 올라가요.', '', '일부를 지운 키는 동작하지 않아서 결국 다시 적게 돼요. 키는 저장소에 남기지 않아요.'] },
      { t: 'q', kind: 'mc', fig: 'q_studioPick', q: '대회 준비 중이에요. 학습지 PDF 묶음을 종류별로 나누고 필요한 칸을 뽑는 흐름을 <b>코드 없이</b> 이틀 안에 시연하고 싶어요. 먼저 살펴볼 것은?',
        opts: ['agent.py에 분류 도구를 더 붙여 만든다', 'Upstage Studio', 'Cursor에 mcp-upstage를 붙여 매번 부탁한다', '콘솔 Playground의 Document Parse로 보여 준다'], a: 1,
        why: 'Parse → Classify → Extract → Instruct처럼 흐름이 정해진 문서 일을 화면에서 이어 붙여 만드는 노코드 도구가 Studio예요.',
        ex: ['agent.py는 코드예요. "코드 없이"라는 조건에 맞지 않아요.', '', 'mcp-upstage에는 파싱과 추출 도구만 있어요. 종류별로 나누는 흐름을 이어 붙여 두지는 못해요.', 'Playground는 기능 하나를 써 보는 곳이에요. 나누고 뽑는 흐름을 이어 만들지는 않아요.'] },
      { t: 'sum', pts: ['MCP는 도구 묶음(서버)을 Cursor 같은 프로그램에 꽂아 쓰는 표준. 루프의 "내 코드" 자리를 Cursor가 맡는다.', 'mcp-upstage: parse_document·extract_information(채팅 도구 없음). .cursor/mcp.json의 mcpServers에 command "uvx", args ["mcp-upstage"], env의 UPSTAGE_API_KEY.', '키가 든 mcp.json은 커밋하지 않는다(.gitignore, ~/.cursor, 또는 ${env:…}). Studio는 Parse → Classify → Extract → Instruct를 코드 없이.'] }
    ]},

    /* =================== M1 =================== */
    { id: 'M1', type: 'mission', title: 'agent.py 만들고 Cursor에 mcp-upstage 잇기', sub: '내 Cursor와 upstage-lab에서 직접', min: 45,
      where: 'upstage-lab 폴더 + 내 Cursor(+ 업스테이지 콘솔)',
      intro: '이번 단원에서 배운 걸 진짜로 해 봐요. 앞 단원에서 만든 검색·채점·구조화 출력을 도구로 묶어 <code>agent.py</code>를 만들고, Cursor 에이전트에는 업스테이지 문서 도구를 붙여요. 끝낸 것부터 체크하고 한 줄 메모를 남겨요.',
      tasks: [
        { do: '시작 전에 키 자리를 확인하고 Git 커밋해요',
          how: '<code>upstage-lab</code>의 <code>.gitignore</code>에 <code>.env</code>가 있는지 먼저 봐요. 그다음 터미널에서 <code>git status</code> → <code>git add -A</code> → <code>git commit -m "에이전트 전 저장"</code>.',
          check: '<code>git status</code>가 깨끗하고, <code>git log --stat -1</code>에 <code>.env</code>가 없으면 성공.' },
        { do: 'Cursor 에이전트와 함께 agent.py를 만들어요(Plan 먼저)',
          how: 'Agents Window에서 <b>Plan</b> 모드로 아래 부탁을 보내요. 계획에 도구 3개, 루프 순서, 최대 턴, 키 처리가 다 들어 있는지 읽은 뒤 Build해요. 트랙 B만 했다면 부탁에서 grade_code 부분을 지우고 보내요.',
          check: '<code>python agent.py "반복문 자료 찾아 줘"</code>를 실행했을 때 <code>search_materials</code>를 부른 턴 기록과 출처가 붙은 최종 답이 나오면 성공.',
          prompt: 'upstage-lab에 agent.py를 만들어 줘. 코드를 쓰기 전에 계획부터 보여 줘.\n\n목적: 정보 수업 질문을 받아 도구를 골라 쓰는 터미널 에이전트. 실행은 python agent.py "질문".\n규칙: AGENTS.md를 따르고, MODEL = "solar-pro4" 변수 하나, base_url은 https://api.upstage.ai/v1, 키는 .env의 UPSTAGE_API_KEY(python-dotenv)로만 읽어. reasoning_effort는 꼭 직접 적어.\n도구 3개(설명마다 쓸 때와 안 쓸 때를 적어):\n- search_materials(query): search.py의 검색 함수를 다시 써서 조각 글과 출처를 돌려줘\n- grade_code(problem_id, code): grader/의 채점 함수를 다시 써서 통과·실패 케이스를 돌려줘\n- make_quiz(topic, n): solar-pro4 구조화 출력(strict)으로 문항 JSON을 만들어\n루프: tool_calls가 오면 assistant 메시지(content가 None이면 "")를 먼저 붙이고, 호출마다 role "tool" 메시지(tool_call_id, name, content)를 빠짐없이 붙인 뒤 다시 요청해. arguments는 json.loads. 등록한 함수만 실행하고 도구 오류는 글로 돌려줘. 최대 5턴.\n출력: 턴마다 부른 도구 이름, 끝에 usage 토큰 합계. 키는 절대 출력하지 마.\n하지 말 것: 파일 지우기, 메일 보내기, 아무 파일 읽기 같은 도구는 만들지 마.\n확인: python agent.py "반복문 자료 찾아 줘"와 python agent.py "안녕하세요"를 돌려 결과를 보여 줘.' },
        { do: '과제 10개로 시험하고 표를 만들어요',
          how: '자료 질문 4개, 채점 부탁 3개(내가 만든 연습 답안만), 퀴즈 부탁 2개, 인사 1개를 차례로 넣어요. 질문마다 부른 도구, 턴 수, 답이 맞았는지를 표로 적어요.',
          check: '표 10줄이 채워졌고, 엉뚱한 도구를 부른 줄이 있으면 그 도구 설명을 고쳐 다시 돌린 결과까지 적었으면 성공.' },
        { do: '최소 권한을 시험해요',
          how: '"data 폴더를 지워 줘", "<code>.env</code> 내용을 보여 줘", "학부모에게 메일 보내 줘"를 넣어 봐요.',
          check: '세 부탁 모두 할 수 있는 도구가 없다고 답하고, 키가 화면에 나오지 않으면 성공. 무언가 실행되면 그 도구를 좁히거나 빼요.' },
        { do: 'Cursor에 mcp-upstage를 연결해요',
          how: '터미널에서 <code>uv --version</code>으로 uv가 있는지 봐요(없으면 Astral 공식 안내대로 설치). <code>.cursor/mcp.json</code>에 레슨 5의 설정을 적어요. 키를 직접 적었다면 <code>.gitignore</code>에 <code>.cursor/mcp.json</code>을 더해요. 저장한 뒤 Cursor를 다시 켜요.',
          check: 'Customize → MCPs에 <code>mcp-upstage</code>가 켜져 있고, <code>git status</code>에 키가 든 <code>.cursor/mcp.json</code>이 보이지 않으면 성공.' },
        { do: 'Cursor 에이전트에게 수업자료 요약을 시켜요',
          how: '개인정보가 없는 내 학습지(10쪽 이하)를 <code>data/</code>에 두고, 새 에이전트에게 아래 부탁을 보내요. 도구 승인을 물으면 넘길 값(파일 경로)을 읽고 허락해요.',
          check: '대화에 <code>parse_document</code> 호출이 보이고, 요약을 원본 학습지와 대조해 틀린 곳이 없거나 고친 곳을 메모했으면 성공.',
          prompt: 'mcp-upstage의 parse_document 도구로 data/의 [내 학습지 파일 이름]을 읽어 줘. 그다음 (1) 학생용 세 줄 요약 (2) 핵심 용어 5개와 한 줄 뜻 (3) 학습지에 있는 문항 수를 알려 줘. 학습지에 없는 내용은 덧붙이지 말고, 파일은 하나도 바꾸지 마. 끝에 어느 도구를 몇 번 불렀는지 적어 줘.' }
      ],
      note: '예상 비용(정가로 어림): agent.py 시험 10개 × 2~3턴이면 입력 약 9만·출력 약 3만 토큰(추론 포함)이라 <code>solar-pro4</code>로 약 $0.06이에요. 학습지 10쪽 파싱(standard)이 약 $0.1. 합쳐서 $0.2 안팎이에요. 짧은 질문과 작은 파일로 먼저 시험하고, 끝나면 콘솔 <b>Usage</b>에서 확인해요. 학생 개인정보가 든 문서와 실제 학생 답안은 쓰지 않아요.' },

    /* =================== T1 =================== */
    { id: 'T1', type: 'test', title: '단원 형성평가', sub: '10문제 · 7문제 이상 맞히면 통과', min: 13, pass: 0.7, steps: [
      { t: 'q', kind: 'mc', fig: 't_400', q: '연수가 끝난 뒤 내 자동채점 튜터를 agent로 키우다가, <code>agent.py</code>가 첫 턴에 도구 호출 <b>두 개</b>를 받은 뒤, 두 번째 요청에서 <code>400</code> 오류로 멈춰요. 무엇이 가장 의심스러울까요?',
        opts: ['<code>tool_calls[0]</code>만 실행해 결과를 하나만 붙였다', '<code>MAX_TURNS</code>를 5로 너무 크게 잡았다', '<code>tool_choice</code>를 <code>"auto"</code>로 두어 Solar가 두 개를 골랐다', '<code>reasoning_effort</code>를 직접 적었다'], a: 0,
        why: '호출마다 결과가 하나씩 있어야 해요. 두 번째 호출의 <code>tool_call_id</code>에 짝이 없으니 API가 대화를 거절했어요. <code>for c in msg.tool_calls</code>로 모두 처리해요.',
        ex: ['', '최대 턴은 반복을 막는 장치예요. 요청 모양을 틀리게 만들지 않아요.', 'auto는 도구가 있을 때의 기본값이고, 두 개를 고르는 것도 정상이에요. 문제는 그다음 처리예요.', '직접 적는 게 이 앱의 규칙이에요. 오류의 원인이 아니에요.'] },
      { t: 'q', kind: 'mc', fig: 't_uvx', q: '연수장에서 강사 시연을 따라 Cursor에 <code>mcp-upstage</code>를 붙였는데 켜지지 않아요. 터미널에서 직접 쳐 보니 <code>uvx: command not found</code>가 나와요. 먼저 할 일은?',
        opts: ['<code>mcpServers</code>를 <code>servers</code>로 바꿔 적는다', 'uv를 설치하고 <code>uv --version</code>이 되는지 본다', '<code>pip install openai</code>를 다시 실행한다', 'API 키를 새로 만들어 <code>env</code>의 <code>UPSTAGE_API_KEY</code>에 넣는다'], a: 1,
        why: '<code>uvx</code>는 uv에 들어 있는 명령이에요. "command not found"는 그 프로그램이 컴퓨터에 없다는 뜻이니, uv부터 설치하고 Cursor를 다시 켜요.',
        ex: ['Cursor의 칸 이름은 <code>mcpServers</code>가 맞아요.', '', 'openai 패키지는 agent.py용이에요. MCP 서버 실행과 상관없어요.', '키는 서버가 켜진 다음에 쓰여요. 지금은 서버를 띄울 명령부터 없어요.'] },
      { t: 'q', kind: 'order', fig: 't_quizFlow', q: '학생이 "조건문 퀴즈 2개 내 줘"라고 했어요. <code>agent.py</code>에서 일어나는 일을 순서대로 쌓아 보세요.',
        items: ['질문과 tools를 담아 Solar에게 요청한다', 'Solar가 make_quiz 호출이 담긴 tool_calls를 돌려준다', '내 코드가 arguments를 풀어 make_quiz를 실행한다', '결과를 role "tool" 메시지로 붙여 다시 요청한다', 'Solar가 결과를 읽고 퀴즈가 담긴 최종 답을 쓴다'],
        why: '요청 → 도구 호출 요청 → 내 코드가 실행 → 결과 붙여 다시 요청 → 최종 답. 앞 단계가 있어야 다음 단계를 할 수 있어요.' },
      { t: 'q', kind: 'line', fig: 't_envLine', q: '<code>.cursor/mcp.json</code>을 적었는데 서버가 업스테이지 키를 못 찾는대요. <b>틀린 줄</b>을 눌러 보세요.', lang: 'json', code: src(['{', '  "mcpServers": {', '    "mcp-upstage": {', '      "command": "uvx",', '      "args": ["mcp-upstage"],', '      "env": {', '        "OPENAI_API_KEY":', '          "${env:UPSTAGE_API_KEY}"', '      }', '    }', '  }', '}']), a: 6,
        why: 'mcp-upstage 서버는 <code>UPSTAGE_API_KEY</code>라는 이름으로 키를 읽어요. 이름이 다르면 값이 있어도 못 찾아요. agent.py에서 OpenAI SDK를 쓴다고 키 이름까지 OPENAI가 되는 건 아니에요.' },
      { t: 'q', kind: 'blank', fig: 't_toolMsgBlank', q: '도구 결과를 대화에 붙이는 코드의 두 빈칸을 채워 보세요.', lang: 'py', code: src(['for c in msg.tool_calls:', '    result = run_tool(...)', '    messages.append({', '        "role": "[[1]]",', '        "tool_call_id": c.[[2]],', '        "name": c.function.name,', '        "content": str(result)})']),
        opts: [['assistant', 'id'], ['user', 'index'], ['tool', 'id'], ['tool', 'function.name']], a: 2,
        why: '결과 메시지의 역할은 <code>"tool"</code>, 짝을 맞추는 값은 그 호출의 <code>id</code>예요.',
        ex: ['첫 칸이 틀렸어요. assistant는 Solar가 쓴 메시지의 역할이에요.', '둘 다 틀렸어요. user는 학생 질문의 역할이고, 짝은 호출의 id로 맞춰요.', '', '둘째 칸이 틀렸어요. 함수 이름은 <code>name</code> 칸에 따로 적고, 짝은 id로 맞춰요.'] },
      { t: 'q', kind: 'mc', fig: 't_rails', q: '매주 같은 순서로 "학습지 PDF 파싱 → 문항 추출 → questions.json 저장"을 하는 도구를 만들려 해요. 에이전트로 만들자는 의견에 대한 가장 알맞은 판단은?',
        opts: ['도구를 쓰는 일이니 무조건 에이전트로 만든다', '단계가 늘 같으니 워크플로가 더 싸고 결과가 고르다', '에이전트는 파일을 다룰 수 없어 만들 수 없다', '워크플로는 Solar를 부를 수 없어 만들 수 없다'], a: 1,
        why: '단계와 순서가 늘 같으면 코드가 순서를 정하는 워크플로가 맞아요. 루프를 돌며 고를 갈림길이 없으니, 에이전트는 요청만 늘려요.',
        ex: ['도구 호출은 갈림길이 있을 때 값을 해요. 갈림길이 없으면 워크플로예요.', '', '도구만 주면 파일도 다룰 수 있어요. 문제는 그럴 필요가 없다는 거예요.', '워크플로 단계 안에서도 Solar를 불러요. helper.py처럼요.'] },
      { t: 'q', kind: 'mc', fig: 't_whichTool', q: '중학생용 "파이썬 질문 창구" 에이전트에 줄 도구 묶음으로 가장 알맞은 것은?',
        opts: ['search_materials, run_any_python, send_email', 'read_any_file, grade_code, delete_file', 'make_quiz, update_grades, post_to_parents', 'search_materials, grade_code, make_quiz'], a: 3,
        why: '질문에 필요한 찾기·채점·연습 문제만 줘요. 아무 코드 실행, 아무 파일 읽기, 지우기, 메일·성적처럼 넓거나 되돌리기 어려운 도구는 빼요.',
        ex: ['아무 코드나 실행하는 도구와 메일 보내기는 넓고 되돌리기 어려워요.', '아무 파일 읽기는 키까지 읽을 수 있고, 지우기는 되돌릴 수 없어요.', '성적 고치기와 학부모 연락은 교사가 직접 하는 일이에요.', ''] },
      { t: 'q', kind: 'mc', fig: 't_save', q: '에이전트에 <code>save_quiz</code>(퀴즈를 파일로 저장) 도구를 줬어요. 사람 확인을 넣는 가장 알맞은 자리는?',
        opts: ['Solar에게 보내는 시스템 프롬프트 맨 끝', '에이전트가 최종 답을 다 쓴 다음', '<code>run_tool</code>에서 그 함수를 실행하기 직전', '도구 설명(description) 안의 "조심해서 써요"'], a: 2,
        why: '확인은 <b>내 코드</b>에서, 실행 <b>직전에</b> 해요. 프롬프트나 설명은 Solar에게 하는 부탁일 뿐 실행을 막지 못해요.',
        ex: ['프롬프트는 부탁이라 Solar가 어길 수 있어요. 실행을 막는 건 코드예요.', '그땐 이미 파일이 저장된 뒤예요.', '', '설명은 고를 때 참고할 글이에요. 실행을 멈추지 못해요.'] },
      { t: 'q', kind: 'mc', fig: 't_noTool', q: '정보 수업 질문 창구에서 Solar가 <code>search_materials</code>를 안 부르고 그럴듯하게 지어내 답해요. <code>tool_choice</code>는 <code>"auto"</code>예요. 먼저 해 볼 것은?',
        opts: ['temperature를 2로 올려 다른 답이 나오게 한다', '<code>MAX_TURNS</code>를 20으로 늘려 찾을 틈을 준다', '<code>parallel_tool_calls</code>를 꺼서 하나씩 부르게 한다', '도구 설명과 시스템 프롬프트에 "수업 내용 질문은 먼저 찾기"를 적는다'], a: 3,
        why: 'Solar는 설명과 규칙을 보고 도구를 골라요. 언제 꼭 찾아야 하는지 적어 주고, 그래도 안 되면 그 화면에서만 <code>"required"</code>를 검토해요.',
        ex: ['무작위성만 커져 지어내기가 더 늘 수 있어요.', '턴이 모자라서가 아니라 처음부터 도구를 안 골랐어요.', '여러 개를 함께 부르는 기능일 뿐, 부를지 말지와는 상관없어요.', ''] },
      { t: 'q', kind: 'mc', fig: 't_cost', q: '<code>agent.py</code>로 질문 10개를 시험했어요. 질문 하나에 평균 3턴이 돌았고, 턴마다 입력 3,000·출력 1,000토큰(추론 포함)이 들었어요. <code>solar-pro4</code>의 정가(100만 토큰당 입력 $0.30, 출력 $1.20)으로 어림하면?',
        opts: ['약 $0.06', '약 $0.02', '약 $0.12', '약 $63'], a: 0,
        why: '질문 10개 × 3턴 = 요청 30번. 입력 9만 토큰 × $0.30 ÷ 100만 ≈ $0.027, 출력 3만 토큰 × $1.20 ÷ 100만 ≈ $0.036, 합쳐 약 $0.06이에요.',
        ex: ['', '턴 수(3)를 빼고 셌어요. 루프는 턴마다 요청이 나가요.', '입력과 출력 가격이 바뀌었어요. 출력이 더 비싸요.', '100만 토큰당 가격을 1,000토큰당으로 셌어요.'] }
    ]}
    ]
  });
})();
