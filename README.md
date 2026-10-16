# 업스테이지한입

코딩한입·커서한입을 공부한 정보 교사가 **업스테이지(Upstage) Solar·Document Parse·Information Extract로 수업 도구와 에이전트를 만드는 법**을 한입씩 배우는 개인 학습앱(PWA)이다.
목표는 업스테이지·팀모노리스·한국컴퓨터교육학회 **기반연수(2일·15차시)를 이해하고 실습을 끝까지 해내는 것**, 그리고 그 도구로 **공모전·해커톤에 나가는 것**.

> 업스테이지의 공식 앱이 아니다. 제품 이름과 화면은 공부를 돕기 위해서만 쓴다.

## 내용

5과정 15단원(`docs/CURRICULUM.md`). 단원마다 레슨 5개 · 헷갈림 퀴즈 2개 · ★ 진짜 실습 미션 · 형성평가.

| 과정 | 단원 |
| --- | --- |
| 1 · 시작 | 소버린 AI와 업스테이지 콘솔 · Solar로 보는 LLM의 원리 · 파이썬으로 Solar 부르기 |
| 2 · 수업자료를 데이터로 | Document Parse · Information Extract · 임베딩과 검색 |
| 3 · AI 수업도구 만들기 | 내 수업자료 보조 에이전트(RAG) · 수업 도구의 4요소와 제작 절차 · 교실 안전장치 |
| 4 · 연수 2일차 트랙 | 트랙 A 파이썬 자동채점 · 트랙 A AI 튜터 · 트랙 B 자료 기반 AI 학습 챗봇 |
| 5 · 에이전트와 대회 | 도구를 쓰는 에이전트 · 멀티에이전트 · 공모전과 해커톤 |

- **모의 화면**: 업스테이지 콘솔(키 만들기, Playground, Document Parse), 내가 만든 웹앱(Streamlit), Cursor(에이전트 코딩)를 단순하게 옮겨 진짜처럼 눌러 본다. API를 부르지 않아 키도 돈도 들지 않는다.
- **파이썬 연습장**: 채점 함수, 응답 꺼내기, 조각 나누기, 코사인 유사도, 안전장치 검사를 앱 안에서 고쳐 실행한다(코딩한입의 초보자용 파이썬 실행기).
- **진짜 실습 미션**: 진짜 콘솔과 내 Cursor로 연습 폴더 `upstage-lab`을 단원마다 키워 간다. Cursor 에이전트에게 줄 부탁 문장을 복사할 수 있다.
- **연수 지도**: 기반연수 15차시마다 대비 단원, 2일차 트랙 고르기, 연수 전 준비물 체크리스트.
- **찾아보기**: 모델·API·콘솔·코드·문제 해결·용어. "코드 한 장"으로 베껴 쓸 파이썬 조각만 모아 본다.

## 만들기

```sh
python3 build.py        # dist/index.html(미리보기), dist/local.html(시험용), dist/web/(배포용 PWA)
node check-unit.js units/c1u1.js   # 단원 검사(오류·경고 0개)
node check-guide.js                # 찾아보기 검사
node meta.mjs --write              # 단원 예상 시간 맞추기
```

- `units/`: 단원 파일(`HANIP.unit({...})`). 규칙은 `SPEC.md`, 사실 기준은 `docs/FACTS.md`(2026-10-16 확인).
- `src/`: 화면(`head.html`, `app.js`, `views.js`), 모의 화면 계산(`simcore.js`), 그림(`core.js`), 파이썬 연습장(`pyrun.js`), 연수 일정(`training.js`), 서비스 워커(`sw.js`), 앱 정보(`app-info.js`).
- 화면 검사(Playwright): `fitcheck.mjs`(PC 칸 넘침), `wrapcheck.mjs`(휴대폰 가로 넘침), `simtest.mjs`(모의 화면 끝까지 누르기). 크롬·playwright 경로는 `pw.mjs`.
- 기록은 이 기기 localStorage(`upstage-hanip:v1`)에만 저장된다. 홈의 "진도 백업·옮기기"로 옮긴다.

Vercel에서는 `python3 build.py`로 만들고 `dist/web`을 올린다(`vercel.json`).
