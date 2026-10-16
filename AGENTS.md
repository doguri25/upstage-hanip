# 업스테이지한입 프로젝트 규칙

Claude Code와 Cursor가 모두 이 파일을 읽는다(Claude Code는 `CLAUDE.md`를 거쳐 읽는다).

## 말
- 설명·답변·계획·요약·질문은 모두 **한국어**로 한다. 코드 식별자, 명령어, 파일 이름, 오류 원문만 원래 글자로 둔다.
- 코드 주석, 커밋 메시지, 화면 문구도 한국어로 쓴다. 화면 문구는 친근한 선생님 말투(~해요).

## 구조
- 커서한입(`~/Projects/cursor-hanip`) 엔진을 복사해 시작했다. 공통 부분을 고치면 커서한입·코딩한입에도 필요한지 확인한다.
- `units/cXuY.js`: 과정 X, 단원 Y(5과정 15단원). 쓰는 규칙은 `SPEC.md`, 단원별 내용은 `docs/CURRICULUM.md`, 업스테이지 사실은 `docs/FACTS.md`. 다 쓰면 `node check-unit.js units/cXuY.js`가 오류·경고 0개여야 한다.
- `src/head.html`(CSS), `src/app.js`(화면), `src/views.js`(모의 화면: 업스테이지 콘솔·웹앱 `win:'web'`, Cursor 창, 미션, 연수 지도, 찾아보기), `src/simcore.js`(모의 화면 계산, 검사기와 함께 씀), `src/core.js`(손그림), `src/pyrun.js`(앱 안 파이썬 연습장, 코딩한입에서 가져옴), `src/training.js`(기반연수 15차시 ↔ 단원), `src/sw.js`, `src/app-info.js`(버전·확인한 날·변경 이력).
- `guide/*.js`: 찾아보기(모델·API·콘솔·코드·문제 해결·용어). 검사는 `node check-guide.js`.
- `ref/upstage-docs/`: 업스테이지 공식 자료에서 모은 메모(커밋하지 않음). `docs/FACTS.md`가 그 요약이자 기준표.
- `meta.mjs`: 단원 요약과 예상 시간. 단원 내용을 바꾸면 `node meta.mjs --write`.
- `python3 build.py` → `dist/`(미리보기 `index.html`, 시험용 `local.html`, 배포용 `web/`). `dist/`는 커밋하지 않는다.

## 확인
- 화면: `SIZES='[[1440,900]]' node fitcheck.mjs`(PC 칸 넘침), `ZOOM=1.12 SIZES='[[360,740]]' node wrapcheck.mjs`(휴대폰 가로 넘침 0개), `node simtest.mjs`(모의 화면 끝까지 눌러 보기).
- Playwright는 이 Mac의 크롬(`channel: 'chrome'`)을 쓴다. 다른 컴퓨터에서는 `PW`(playwright index.mjs 경로)·`CHROME`(실행 파일) 환경 변수(`pw.mjs`).

## 최신 유지
- 모델 이름·가격·화면이 자주 바뀐다. 단원마다 `checked`(공식 문서를 확인한 날)와 `sources`(공식 주소)를 둔다. 업스테이지 모델 기록(https://console.upstage.ai/docs/models/history)과 대조해 낡은 레슨을 고치고, `docs/FACTS.md`와 `src/app-info.js`의 `checked`도 맞춘다.

## 버전·배포
- 기능을 올릴 때마다 `src/app-info.js`의 `version`을 올리고 `history` 맨 앞에 한 줄 더한다. 새 기능은 두 번째 자리, 고침·다듬기는 세 번째 자리.
- 커밋 작성자는 `도구리 <195055055+doguri25@users.noreply.github.com>`(저장소 git 설정에 있다). 푸시는 사용자가 요청할 때만 한다.
