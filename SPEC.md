# 업스테이지한입 단원 파일 규칙서

업스테이지한입은 **코딩한입·커서한입을 마친 정보 교사**가 업스테이지(Upstage) API로 수업 도구·LLM 서비스·에이전트를 만들 수 있게 돕는 학습앱이다. 목표는 둘이다.
1. **기반연수 통과**: 업스테이지·팀모노리스·한국컴퓨터교육학회 기반연수(2일, 15차시, 2일차는 트랙 A 자동채점+AI튜터 / 트랙 B 자료 기반 AI학습 챗봇)를 이해하고 실습을 끝까지 해낸다. 차시와 단원의 연결은 `src/training.js`.
2. **대회 출전**: 연수에서 만든 도구를 키워 공모전(기획서·수업 적용)과 해커톤(빠른 제작·시연)에 나간다.

배우는 사람은 한 명이다. 코딩한입에서 HTML·CSS·JS·파이썬 기초, 터미널, Git·GitHub를, 커서한입에서 Cursor(Agents Window·IDE·규칙 파일·Plan 모드·MCP·서브에이전트)를 배웠다. **프롬프트 쓰는 기초(역할·맥락·예시·형식 주기)는 이미 안다** — 다시 가르치지 않고 "코딩한입에서 배운 ○○"처럼 이어 준다. 컴퓨터는 집에서 Mac, 학교에서 Windows. 실습은 **Cursor + 파이썬**(연습 폴더 `upstage-lab`)으로 하고, 학교 PC처럼 설치가 막힌 곳은 Google Colab을 대안으로만 알려 준다.

단원 하나 = 파일 하나: `units/<id>.js`. 파일은 `HANIP.unit({...})`를 한 번만 부른다. 그림·말투·분량은 커서한입과 같다(커서한입 `units/c1u1.js` 참고).

## 0. 사실은 공식 문서에서만

- 업스테이지 모델 이름·API 주소·매개변수·요금·화면 메뉴는 **`ref/upstage-docs/`(공식 문서에서 모은 메모, 2026-10-16)** 에 있는 것만 쓴다. 기억이나 추측으로 쓰지 않는다. 메모에 없는 세부(버튼 위치·정확한 메뉴 이름 등)는 "화면 모양은 바뀔 수 있어요"처럼 흐리게 쓰거나 뺀다.
- 모델 이름(`solar-pro3` 등)과 가격은 자주 바뀐다. 꼭 필요할 때만, "지금은"·"2026년 10월 기준"을 붙여 쓴다. 코드에서는 모델 이름을 **변수 하나**(`MODEL = "…"`)에 모아 두는 습관을 가르친다.
- 업스테이지 콘솔은 영어 화면이다. 버튼·메뉴 이름은 **영어 그대로** 쓰고 처음 한 번 뜻을 풀어 준다(예: **Create API Key**(API 키 만들기)).
- 단원 머리에 `checked: { date:'2026-10-16' }`(공식 문서를 확인한 날)과 `sources`(근거 주소 배열)를 넣는다. 허용 주소: `console.upstage.ai/docs…`, `upstage.ai`, `github.com/UpstageAI…`, `pypi.org`, `docs.python.org`, `docs.streamlit.io`, `cursor.com`, 정부·공공기관(`moe.go.kr`, `msit.go.kr`, `keris.or.kr`, `korea.kr`, `pipc.go.kr`), 한국컴퓨터교육학회(`kace.re.kr`), `github.com/openai/openai-python`.
- 학생 개인정보·저작권·연령 제한 같은 제도 이야기는 `ref/upstage-docs/context.md`에 근거가 있는 것만, 단정하지 말고 "학교·교육청 지침을 먼저 확인해요"로 마무리한다.
- 앱은 업스테이지 공식 앱이 아니다. 회사·제품을 칭찬하거나 깎아내리지 말고 사실만 쓴다.

## 1. 파일 모양

```js
HANIP.unit({
  id: 'c1u2',                    // 과정1 단원2
  course: '과정 1 · 시작',
  title: '단원 2 · Solar로 보는 LLM의 원리',
  goals: ['…', '…', '…'],         // 배우는 것 3개(짧게)
  checked: { date: '2026-10-16' },
  sources: ['https://console.upstage.ai/docs/…', '…'],
  skip: [ 문제 3개 ],             // 과정 1만: '이미 알아요' 점검. 셋 다 맞히면 레슨을 건너뛴다
  figs: { … },
  items: [ /* 아래 순서 그대로 9개 */ ]
});
```

items 순서(고정): `L1`, `L2`, `QA`(헷갈림 퀴즈 ①), `L3`, `L4`, `QB`(헷갈림 퀴즈 ②), `L5`, `M1`(진짜 실습 미션), `T1`(단원 형성평가).

```js
{ id:'L1', type:'lesson', title:'…', sub:'…', min:12, steps:[ … ] }
{ id:'QA', type:'quiz',   title:'헷갈림 퀴즈 ①', sub:'…', min:4, steps:[ 문제 3개 ] }
{ id:'M1', type:'mission', title:'…', sub:'콘솔과 내 Cursor에서 직접', min:20, where:'업스테이지 콘솔 + upstage-lab 폴더', intro:'…', tasks:[ … ], note:'…' }
{ id:'T1', type:'test',   title:'단원 형성평가', sub:'10문제 · 7문제 이상 맞히면 통과', min:10, pass:0.7, steps:[ 문제 10개 ] }
```

`min`은 `node meta.mjs --write`가 내용으로 맞춘다(미션은 적은 값 그대로 = 실제로 해 보는 시간).

## 2. 단계(step) 종류

- 설명: `{ t:'say', h:'제목(한 문장, 요점)', fig:'그림이름', p:['문단 HTML', …], code:{lang, src, out?}, table:{head, rows}, tip:'기억해요 상자 HTML' }`
- 문제: `{ t:'q', kind, q:'질문 HTML', fig:'그림이름', … }` — **모든 문제에 fig**. mc는 `opts` 4개·`a`·`why`·`ex` 4개(정답 칸은 `''`), blank는 `code`에 `[[1]]`(빈칸 2개면 `opts`의 각 보기가 `['…','…']` 배열), line은 `a`가 틀린 줄 번호(0부터), order는 `items` 3~6개(올바른 순서로). 문제에 code가 있으면 `lang`도 쓴다.
- 정리: `{ t:'sum', pts:['…','…','…'] }` — 레슨 마지막에 하나.
- **모의 화면** `sim`: 3절.
- **연습장** `try`: 4절. `lang:'py'`(앱 안 파이썬), `'md'`(시스템 프롬프트·기획서·README 쓰기), `'html'`.

`lang`: `'py'`, `'json'`, `'md'`, `'html'`, `'css'`, `'js'`, `'sh'`(터미널: `$ `로 시작하는 줄이 명령), `'diff'`, `'plain'`, `'err'`. 코드는 **12줄 이하, 한 줄 40칸 안팎**(한글은 2칸). 긴 파이썬 줄은 괄호 안에서 줄을 나눈다.

### 단축키는 `<kbd>`로

Cursor 단축키가 나오면 HTML로 보이는 곳에 **`<kbd>mod+shift+p</kbd>`** 처럼 쓴다(앱이 Mac ⌘ / Windows Ctrl로 바꿔 보여 준다). 글자로 ⌘, Cmd+, Ctrl+를 직접 쓰지 않는다.

## 3. 모의 화면(sim)

앱 안에 화면을 단순하게 옮긴 가짜 화면을 그리고, 배우는 사람이 **진짜처럼 눌러 보게** 한다. AI도 API도 부르지 않는다. 미리 쓴 대본대로 화면이 바뀐다.

```js
{ t:'sim', h:'API 키를 만들어 봐요', p:'콘솔 왼쪽 메뉴에서 API Keys를 찾아 새 키를 만들어 보세요.',
  scene:{ win:'web', url:'console.upstage.ai', brand:'Upstage Console', nav:['Dashboard', 'Playground', 'API Keys'], page:'Dashboard', blocks:[ … ] },
  steps:[
    { goal:'API Keys 메뉴를 눌러요', click:'nav:API Keys', then:{ page:'API Keys', blocks:[ { k:'h', text:'API Keys', btns:['Create API Key'] }, … ] }, say:'…' },
    { goal:'키 이름을 적어요', type:'수업용', into:'f:name' },
    … ],
  end:'키는 비밀번호처럼 다뤄요.' }
```

- `steps` 2~8개. 동작 하나는 **`key`(단축키), `click`(화면의 한 곳 누르기), `type`(칸에 글 넣기) 중 하나만**.
  - `click`: 아래 **이름표**만 쓸 수 있다. 검사기가 그 순간 화면에 있는지 확인한다.
  - `type` + `into`: 칸을 누르면 글이 저절로 쳐진다.
  - `then`: 이 동작 뒤 장면에서 바꿀 칸만 적는다. 칸은 **통째로** 바뀌고 `null`이면 사라진다. 웹 창은 `then:{ set:{ <블록 id>: 값 } }`으로 field·select 값, toggle 켜짐, tabs·files 고른 것만 바꿀 수 있다(블록 목록을 다시 안 써도 됨).
  - `say`: 동작 뒤 화면 아래에 뜨는 한두 문장. `hint`: 막혔을 때 말(없으면 자동).
- `end`: 다 했을 때 한마디. `h`는 요점, `p`는 1~2문장 안내.
- 모의 화면은 레슨마다 0~2개. 모의 화면이 있는 레슨은 문제 3개 이상(없으면 4개 이상).
- 화면 밑에는 "실제 화면을 단순하게 옮긴 연습용이에요"가 늘 붙는다. **진짜와 다를 수 있는 세부는 만들어 넣지 않는다**(문서에 없는 메뉴·버튼을 지어내지 않는다. 확실하지 않으면 콘솔 대신 **내 Cursor·터미널 장면**으로 보여 준다).

### 3-1. 웹 창(`win:'web'`): 업스테이지 콘솔과 내가 만든 웹앱

`url`(주소창, 예: `console.upstage.ai`, `localhost:8501`), `title`(창 제목, 없으면 주소로 정함), `brand`(왼쪽 메뉴 위 글자), `nav`(왼쪽 메뉴: 글자 또는 `{ name, sub:true }`, `page`가 지금 메뉴), `blocks`(가운데 칸, 위에서 아래로), `aside`(오른쪽 칸, 예: 모델·매개변수), `dlg:{ title, blocks }`(대화 상자. 떠 있으면 그 안만 누를 수 있다), `menu:{ title, items }`(작은 고르기 메뉴), `toast`.

블록(`k`):

| k | 모양 | 칸 | 누르는 곳 |
| --- | --- | --- | --- |
| `h` | 제목 줄 | `text`, `sub`(HTML), `btns`, `plain`(첫 버튼도 흰색) | `b:<버튼>` |
| `p` | 흐린 설명 글 | `text`(HTML) | |
| `btns` | 버튼 줄(첫 버튼이 강조) | `btns`, `plain` | `b:<버튼>` |
| `field` | 입력칸 | `id`, `label`, `value`, `ph`, `area`, `mono` | `type` + `into:'f:<id>'` |
| `select` | 고르기 칸(`slider:0~1`이면 막대) | `id`, `label`, `value`, `slider` | `sel:<id>` → 보통 `then:{ menu:{…} }` |
| `toggle` | 켜고 끄는 스위치 | `id`, `label`, `on` | `tog:<id>`(누르면 저절로 바뀜) |
| `chat` | 대화(`me`·`ai`·`sys`) + 입력칸 | `msgs`, `input`, `ph`, `empty` | `type` + `into:'chat'`, `btn:send` |
| `tabs` | 탭 | `id`, `items`, `on` | `tab:<이름>`(id가 있으면 저절로 고름) |
| `code` | 결과·코드(어두운 상자) | `lang`, `src`, `label` | |
| `table` | 표 | `head`, `rows`, `pick`(줄 누르기) | `row:<첫 칸 글자>` |
| `files` | 파일 목록·올리기 칸 | `id`, `items`, `on`, `drop` | `file:<파일>` |
| `kv` | 이름: 값 목록 | `rows:[[이름, 값]]` | |
| `note` | 알림 상자 | `text`(HTML), `tone:'warn'｜'ok'｜'bad'` | |
| `secret` | 한 번만 보이는 키 | `value`, `btn` | `b:<버튼>` |
| `cards` | 카드 고르기 | `items:[{ id, title, desc, on }]` | `card:<id>` |
| `steps` | 진행 단계 | `items`, `on`(지금 번호, 0부터) | |
| `page` | 문서 한 쪽 미리보기(Document Parse) | `id`, `els:[{ cat, text, rows, items, on }]`, `show`(요소 테두리·이름표), `pick`, `label` | `el:<1부터 번호>`(id가 있으면 누른 요소가 저절로 강조, `set:{ <id>: 번호 }`도 됨) |

`page`의 `cat`은 Document Parse가 돌려주는 요소 이름(`ref/upstage-docs/document-ai.md`에 있는 이름만) 중 `heading1`, `paragraph`, `table`(`rows`), `figure`, `chart`, `list`(`items`), `caption`, `equation`, `footnote`, `header`, `footer` 등을 쓴다.

콘솔 장면을 그릴 때: 메뉴·버튼 이름은 문서 메모에 있는 것만. 없으면 `nav` 없이 가운데 블록만 그리고, 글은 "콘솔의 키 관리 화면"처럼 일반적으로 쓴다. **API 키는 늘 가짜**(`up_••••••••7f3a`처럼 가린 것)로.

### 3-2. Cursor 창(커서한입과 같다)

에이전트 코딩은 커서한입에서 배운 Cursor로 한다. `win:'ide'`(파일 목록·편집기·아래 터미널·오른쪽 에이전트 패널), `win:'agents'`(Agents Window), `win:'term'`(터미널만). 칸·이름표는 커서한입 SPEC 3절과 같다:
- IDE: `files`, `open`, `code`, `lang:'py'`, `ghost`, `inline`, `diff`, `panel`, `term:['$ python hello.py', '…']`(아래 터미널, `into:'term'`으로 명령을 친다 → `then:{ term:[…지난 줄 + 결과], prompt:'' }`).
- Agents Window: `agents`, `panel:{ mode:'Agent'|'Ask'|'Plan', model:'Auto', msgs:[{ me }|{ ai }|{ ai, run:'pip install openai' }|{ ai, btns:['Build'] }], input }`, `changes:[{ file, add, del }]`, `browser:{ url:'localhost:8501', html, links, console }`.
- 덮개: `palette`, `menu`, `toast`.
- 이름표: `btn:new-agent`, `agent:<제목>`, `file:<파일>`, `side:explorer`, `btn:send`, `btn:mode`, `btn:model`, `msg:<버튼>`, `chg:<버튼>`, `web:<이름>`, `btn:run`, `btn:skip`, `btn:accept`, `btn:reject`, `menu:<항목>`, `pal:<항목>`.

## 4. 연습장(try)

```js
{ t:'try', lang:'py', h:'채점 함수를 고쳐 봐요', p:'공백 때문에 틀렸다고 나오는 답을 맞게 채점해 보세요.',
  src:'def grade(ans, key):\n    return ans == key\n\nprint(grade(" 4", "4"))', note:'(선택) 결과 옆에 보일 한마디' }
```

- `lang:'py'`는 **앱 안의 초보자용 파이썬**으로 돈다(인터넷·패키지 없음). 쓸 수 있는 것: 변수, `if/for/while`, `def`(기본값 인자 가능, `*` 뒤 키워드 전용 인자는 안 됨), `try/except/raise`, 리스트·딕셔너리·튜플·집합, 컴프리헨션, `lambda`, `sorted(key=)`, 문자열 메서드, f-string, `import json/math/random/time`. **`class`, `openai`, `requests`, `os`, 파일 읽기는 안 된다** — 그런 코드는 설명(`say`)의 `code`나 미션에서 보여 준다.
- 검사기가 `src`를 앱 연습장과 진짜 `python3`로 둘 다 돌려 본다. 오류가 나면 안 되고(일부러 오류를 보여 줄 때만 `err:true`), 출력이 같아야 한다(무작위는 피한다).
- API 응답은 **딕셔너리로 흉내** 낸다: `resp = {"choices":[{"message":{"content":"…"}}], "usage":{…}}` → 응답에서 값 꺼내기, 채점·안전장치·검색 로직(코사인 유사도) 연습에 쓴다.
- `lang:'md'`: 시스템 프롬프트, 안전 규칙, 기획서·README 초안 쓰기. 쓰는 대로 바로 보인다.
- 레슨마다 0~1개. 쓸모 있을 때만.

## 5. 진짜 실습 미션(M1)

단원에서 배운 것을 **진짜 업스테이지 콘솔과 내 컴퓨터의 Cursor로** 해 보는 체크리스트다. 앱은 체크와 한 줄 메모만 저장한다.

```js
{ id:'M1', type:'mission', title:'Solar에게 첫 질문 보내기', sub:'콘솔과 내 Cursor에서 직접', min:20,
  where:'업스테이지 콘솔 + upstage-lab 폴더',
  intro:'이번 단원에서 배운 것을 진짜로 해 봐요. 끝낸 것부터 체크해요.',
  tasks:[
    { do:'…', how:'…', check:'…이 보이면 성공', prompt:'(선택) Cursor 에이전트에게 그대로 붙여 넣을 부탁 문장' },
    … ],
  note:'(선택) 주의할 점, 예상 비용' }
```

- tasks 3~6개. `do`(할 일), `how`(방법, 선택), `check`(끝났는지 스스로 확인하는 법), `prompt`(선택, 복사 버튼이 붙음 — **에이전트 코딩 연습**: Cursor 에이전트에게 맡길 부탁을 맥락·조건·확인 방법까지 담아 쓴다).
- 연습 폴더는 `upstage-lab`(단원이 지날수록 파일이 늘어난다: `hello_solar.py` → `parse.py` → `extract.py` → `search.py` → `helper.py` → `app.py` → `guard.py` → `grader/` → `tutor.py` → `study_bot/` → `agent.py` → `team.py`). 미션 시작 전에 Git 커밋하게 한다.
- **API 키 안전**: 키는 `.env`에만, `.gitignore`에 `.env`, 코드·스크린샷·채팅·깃허브에 절대 올리지 않는다. 키를 화면에 찍는 코드를 쓰지 않는다.
- **비용**: 호출이 많은 미션은 "지금 요금으로 대략 얼마"를 `ref/upstage-docs/`의 가격으로 어림해 적고, 작은 파일·짧은 글로 먼저 시험하게 한다.
- **학생 자료**: 학생 개인정보가 담긴 문서는 쓰지 않는다. 내 수업자료·공개 자료만.

## 6. 분량

- 레슨: 설명 3~5개 + 모의 화면 0~2개 + 연습장 0~1개 + 문제 3~5개 + 정리 1개.
- 헷갈림 퀴즈: 실제로 헷갈리는 짝(비슷한 모델·매개변수·개념)으로 3문제.
- 형성평가: 10문제. order·line 각 1개 이상, 빈칸 2개짜리 blank 1개 이상. 단원 전체를 고르게, 레슨과 다른 상황으로. **연수 실습 상황**(연수장에서 막히는 장면)을 2개 이상 넣는다.
- `skip`(과정 1만): 레슨 내용을 알면 맞히는 문제 3개.

## 7. 글쓰기

- 존댓말 "~해요"체, 친근한 선생님 말투. 마스코트 화자는 없다. 농담은 상황에 맞게, 비꼬지 않게.
- 배우는 사람은 코딩 초보가 아니다(코딩한입·커서한입 졸업). 파이썬 문법·터미널·Git·Cursor 조작은 다시 가르치지 않고 이어 준다. 대신 **LLM API·문서 AI·RAG·에이전트 쪽은 처음 보는 사람처럼 차근차근**, 늘 "왜 이렇게 하는지"와 "수업에서는 어떻게 쓰는지"를 함께.
- 예시는 **학교 수업 장면**으로(정보 교과 단원, 학습지, 수행평가, 파이썬 과제 채점, 학생 질문). 학생 이름은 가명.
- 한 문단 3문장 이하. `<b>`로 핵심, `<code>`로 파일·명령·모델 이름·매개변수, `<kbd>`로 단축키.
- 오답 보기는 실제로 할 만한 실수로. 정답 위치를 골고루.
- HTML로 해석되는 곳에서 `<`, `>`는 `&lt;` `&gt;`로.
- 제목 `h`, `pts`, 미션 글, `goals`는 닫는 태그가 있으면 HTML로, 없으면 글자 그대로 보인다.

## 8. 그림

`draw(P)`, 색 이름 `ink ink2 soft line paper accent hi warm good bad pink sky k s n t`, `P.rect/rrect/circle/ellipse/line/path/arrow/curveArrow/text/face/robot/bubble/note/sparkle/heart/drop/steam`(커서한입·코딩한입 그림과 같다). 손그림으로 단순하게(창 틀 + 칸 몇 개 + 표정). 문제 그림은 답을 알려 주지 않는다. 글자는 viewBox 안에, 서로 겹치지 않게(한글 1자 ≈ size×0.95, 영문 ≈ size×0.5). 단원 안에서 되풀이하는 도우미(창 틀, 문서 쪽지, 로봇, 서버 상자, 화살표 흐름)는 파일 위쪽에 함수로 만들어 쓴다.

## 9. 검사

- `node check-unit.js units/<id>.js` → 오류 0, 경고 0.
- `node meta.mjs --write`로 예상 시간 맞추기.
- `python3 build.py` 뒤 `SIZES='[[1440,900]]' node fitcheck.mjs`(PC 칸 넘침), `ZOOM=1.12 SIZES='[[360,740]]' node wrapcheck.mjs`(휴대폰 가로 넘침), `node simtest.mjs`(모의 화면 끝까지 눌러 보기).

## 10. 자주 하는 실수(피할 것)

- 문서에 없는 모델 이름·매개변수·메뉴를 지어내기. 옛 모델 이름을 지금 것처럼 쓰기.
- API 키를 코드에 직접 쓰는 예시(나쁜 예로 보여 줄 때는 `line` 문제처럼 "틀린 곳"으로만).
- "LLM은 생각한다/안다"처럼 사람처럼 말하기 → "다음 글자 조각을 예측한다"로 정확히.
- 순서 문제에서 두 항목을 바꿔도 말이 되는 경우. 정답 보기가 너무 넓게 말하는 경우. 문제 그림에 정답이 보이는 경우. ex[i]가 다른 보기를 설명하는 경우.

## 11. 찾아보기(guide/*.js)

찾아보기 탭의 항목. 파일마다 `HANIP.guide([ … ])`를 한 번 부른다. 분류마다 파일 하나: `guide/models.js`(모델), `guide/api.js`(API), `guide/console.js`(콘솔), `guide/code.js`(코드), `guide/trouble.js`(문제 해결), `guide/terms.js`(용어).

```js
HANIP.guide([
  { id:'temperature', cat:'API', title:'temperature', aka:['온도', '무작위성'],
    what:'답의 무작위성을 정해요. 낮으면 같은 질문에 비슷한 답, 높으면 더 다양한 답이 나와요.',
    code:'resp = client.chat.completions.create(\n    model=MODEL, messages=msgs,\n    temperature=0.2)', lang:'py',
    where:'API 요청의 매개변수, 콘솔 Playground 오른쪽', lesson:'c1u2', src:'https://console.upstage.ai/docs/…', checked:'2026-10-16' },
]);
```

- `cat`: `'모델'` | `'API'` | `'콘솔'` | `'코드'` | `'문제 해결'` | `'용어'`. `id`는 영어 소문자·하이픈, 전체에서 겹치지 않게.
- `code`(선택, 12줄 이하 파이썬 조각 — "코드 한 장"에 모여 보인다), `lang`(기본 `'py'`).
- 문제 해결 항목은 `title`을 증상으로("401 Unauthorized가 나와요"), `what`에 원인과 해결을 짧게.
- `lesson`: 이 내용을 다루는 단원 id. `src`: 근거 공식 주소(필수). `checked`: 확인한 날.
