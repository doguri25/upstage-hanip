# 업스테이지한입 사실 기준표 (2026-10-16, 실제 콘솔·공식 문서 직접 대조)

레슨에 쓰는 업스테이지 사실은 **이 표가 기준**이다. 근거 메모는 `ref/upstage-docs/core.md`, `ref/upstage-docs/document-ai.md`, `ref/upstage-docs/context.md`(커밋하지 않음)에 있다.

> 2026-10-16 갱신: 공식 문서를 마크다운으로 직접 받아(`console.upstage.ai/llms.txt`가 가리키는 `*.md`, 메모는 `ref/upstage-docs/live/`) 대조했고, 로그인한 실제 콘솔 화면도 열어 메뉴를 확인했다. 아래 ⚠️ 표시는 그래도 공식 자료끼리 다르거나 직접 확인이 필요한 것이다. 레슨에서는 **흐리게 쓰거나 "직접 확인해요"** 로 돌린다.

## 1. 계정·콘솔·키·비용

| 항목 | 레슨에 쓰는 사실 | 근거 주소(sources에 넣을 것) |
| --- | --- | --- |
| 콘솔 | `console.upstage.ai`. 위쪽 막대: **Documentation · API Reference · Playground**. 로그인 뒤 왼쪽(조직 관리): 조직 이름(Default Organization) 아래 **API keys, Usage, Limits, Members**, **BILLING**(Credit, Payment), **Settings**. **Home 메뉴는 없다.** Playground 왼쪽: GENERATE **Chat** / PARSE **Document Parse, Document OCR** (2026-10-16 실제 화면) | https://console.upstage.ai/docs/getting-started |
| 시작 순서 | 가입 → API 키 만들기 → 첫 요청 → 다른 기능 둘러보기 | 같은 곳 |
| 무료 크레딧 | 새 계정 **$10**. 크레딧마다 유효 기간이 있다(Credit 화면: "Credits apply only during their valid period", 목록의 Valid period). 교육·비영리·연구기관은 Document Parse·Solar Pro 최대 1년 무료(AWS AI Initiative, 조건은 직접 확인) | 같은 곳, https://console.upstage.ai/docs/resources/faq |
| 월 사용 한도 | **Limits → Usage limit**: 조직의 월 사용 한도($), 달마다 초기화, **Set**. 결제 수단을 등록해야 켤 수 있음. 닿으면 `429 usage_limit_exceeded` | 실제 콘솔, https://console.upstage.ai/docs/resources/error-codes |
| API 키 만들기 | **API keys** 페이지 → **Create new key**(확정). 표 열 Name·Owner·Key·Created (UTC)·Last used (UTC), 키는 `up_****…`로 가려 보임. 아래에 Example codes. 키는 `up_`으로 시작 | 같은 곳 |
| 키 보관 | 환경 변수 이름 `UPSTAGE_API_KEY`. 코드에 직접 쓰지 않음. `.env` + `.gitignore` | https://github.com/UpstageAI/upstage-extensions-hub |
| Playground | 무료(FAQ: 로그인·결제 수단 없이). Chat에서 **Solar Pro 4·Mini 4를 고르면 질문이 Solar Chat 새 탭으로 열린다**. System Prompt·Reasoning Effort·Max Tokens·Temperature 칸은 곧 끝나는 옛 모델에서만 보임 → 매개변수 실험은 코드로. Document Parse 데모는 지금 로그인해야 됨(결과 탭 Preview·HTML·JSON, 설정 Mode·OCR Mode·Merge Multipage Tables·Chart Recognition). **Playground 입력은 모델 개선에 쓰일 수 있음**(API는 학습·저장 안 함) → 학생 정보 금지 | https://console.upstage.ai/docs/resources/faq |
| 크레딧이 떨어지면 | 결제 수단이 있으면 멈추지 않고 청구됨. 크레딧이 없고 결제 수단도 없으면 `401 api_key_is_blocked`(새 키로 안 풀림), 결제 실패 등은 `403 api_key_is_not_allowed` | https://console.upstage.ai/docs/resources/error-codes |
| 속도 제한 | **키마다가 아니라 조직(계정)마다**("All keys share the same limits"). Tier 0: `solar-pro4` 100 RPM·250,000 TPM, `solar-mini4` 100 RPM·50,000 TPM, Document Parse 3 RPS·500 PPM, IE 1 RPS·300 PPM, 임베딩 100 RPM·300,000 TPM. 크레딧을 사면 등급이 오를 수 있음(Limits에 지금 Tier 표시). 넘으면 `429 too_many_requests` → **"반 학생 30명이 한 계정으로 동시에 부르면 금방 걸려요"** | https://console.upstage.ai/docs/guides/rate-limits |

## 2. 모델 (2026-10-16 기준)

| 별칭(코드에 쓰는 이름) | 가리키는 버전 | 쓰임 | 비고 |
| --- | --- | --- | --- |
| `solar-pro4` | `solar-pro4-260806`(2026-08-06) | 대표 모델. 에이전트·문서·코딩에 강함. 컨텍스트 512K. 한국어·영어·일본어. 대화·추론·구조화 출력·도구 호출 | 학습 데이터 기준 2026-02 |
| `solar-mini4` | `solar-mini4-260922`(2026-09-22) | 가볍고 싼 모델. 컨텍스트 512K. 대화·추론·구조화 출력·도구 호출 | 35B(활성 3B) |
| `solar-embedding-2-query` / `solar-embedding-2-passage` | 2026-06-30 | 임베딩(질문용/문서용), 1,024차원 | 예전 `solar-embedding-1-large-*`는 2026-12-31 종료 |
| `document-parse` | `document-parse-260930` | 문서 → HTML·Markdown·글 | |
| `information-extract` | `information-extract-260904` | 스키마대로 값 뽑기 | Prebuilt 추출은 2026-05-06 지원 중단 |

- **끝난/끝나는 모델**: `solar-pro3`, `solar-pro2`, `solar-mini`는 **2026-10-30(KST) 서비스 종료** → `solar-pro4`·`solar-mini4`로. 인터넷의 옛 예제(`solar-pro3`, `solar-1-mini-chat`, `api.upstage.ai/v1/solar`)를 그대로 따라 하지 않게 가르친다. Groundedness Check(근거 확인 API)는 2025-10-21 지원 중단 → 레슨에서 쓰지 않는다(근거 확인은 프롬프트·코드로 직접 만든다).
- **별칭 vs 버전**: 코드에는 별칭(`solar-pro4`)을 쓰고, 응답의 `model`에는 실제 버전(`solar-pro4-260806`)이 찍힌다. 공식 안내도 별칭을 권한다. 코드에서는 `MODEL = "solar-pro4"`처럼 한곳에 모은다.
- 근거 주소: https://console.upstage.ai/docs/models , https://console.upstage.ai/docs/models/history , https://github.com/UpstageAI/Solar-Pro4-Cookbook

## 3. Chat Completions (Solar)

- OpenAI 호환. `base_url="https://api.upstage.ai/v1"`, 엔드포인트 `POST /chat/completions`. 파이썬은 `pip install openai` 후 `from openai import OpenAI`.
- 레슨 표준 코드(이 모양으로 통일):

```python
import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
client = OpenAI(
    api_key=os.environ["UPSTAGE_API_KEY"],
    base_url="https://api.upstage.ai/v1",
)
MODEL = "solar-pro4"

resp = client.chat.completions.create(
    model=MODEL,
    messages=[{"role": "user", "content": "안녕"}],
    reasoning_effort="none",
)
print(resp.choices[0].message.content)
```

- 메시지 역할: `system`, `user`, `assistant`, (도구 결과) `tool`. API는 대화를 기억하지 않는다 → 이전 대화를 매번 함께 보낸다.
- 응답: `choices[0].message.content`, `choices[0].finish_reason`(`stop` 정상 / `length` max_tokens에 걸림 / `tool_calls` 도구 호출), `usage.prompt_tokens`·`completion_tokens`·`total_tokens`, 추론을 하면 `usage.completion_tokens_details.reasoning_tokens`, `message.reasoning`(생각 글).
- 매개변수(`solar-pro4`, 2026-08 공식 쿡북):
  - `temperature` 0~2, 기본 1.0. 낮으면(0.2 이하) 일정하게, 높으면(0.8 이상) 다양하게. `top_p` 0~1, 기본 1.0 — 둘 중 하나만 조절하는 게 보통.
  - `max_tokens`: 만들 최대 토큰. **추론 토큰도 여기에 들어가서**, 너무 작으면 보이는 답이 비고 `finish_reason`이 `length`.
  - `stream=True`: 조각(`delta`)으로 받기. 추론이 켜져 있으면 `delta.reasoning`이 먼저 온다.
  - `reasoning_effort`: `"none"`·`"minimal"`(추론 끔), `"low"`·`"medium"`·`"high"`·`"xhigh"`·`"max"`(켬). **값을 빼거나 `null`이면 추론 꺼짐**(공식 Reasoning 문서, 확정). 옛 `solar-mini`는 이 값을 받지 않음(400). 추론을 켰는데 max_tokens가 모자라면 `content`는 `None`, `finish_reason`은 `length`. → 레슨 규칙: 의도를 코드에 드러내려고 **늘 직접 적는다**. 추출·분류·채점은 `"none"` + 낮은 temperature, 어려운 여러 단계 문제는 `"high"` + 넉넉한 max_tokens. 추론을 켜면 느려지고 토큰(돈)이 늘며, 늘 더 좋은 답을 보장하지는 않는다. (쿡북 실측: 같은 계산 문제에서 none 0.86초 오답, high 12.85초 정답)
- 구조화 출력: `response_format={"type":"json_schema","json_schema":{"name":…, "strict":True, "schema":{…}}}`. 모든 object에 `"additionalProperties": False`, 모든 속성을 `required`에. 결과는 `message.content`에 **JSON 글자**로 → `json.loads`.
- 오류(갈래는 `error.code`로): `400` 요청 모양 틀림, `401 invalid_api_key` 키 틀림·삭제됨, `401 api_key_is_blocked` 크레딧 없고 결제 수단 없음(새 키로 안 풀림), `403 api_key_is_not_allowed` 결제 실패 등으로 정지, `404` 주소 틀림, `405` HTTP 메서드 틀림(http로 보내면 301로 https에 넘겨짐), `413` 너무 큼, `415` 지원 안 하는 파일, `422` 파일 손상, `429 too_many_requests` 속도 제한 → `Retry-After`만큼 기다렸다 다시(지수 백오프 1·2·4초), `429 usage_limit_exceeded` 월 사용 한도에 닿음 → 다시 보내도 소용없음, `5xx`·`504` 서버 문제 → 잠시 뒤 다시. OpenAI SDK에서는 `openai.AuthenticationError`, `openai.RateLimitError` 등.
- 근거 주소: https://console.upstage.ai/docs/capabilities/generate/chat , https://console.upstage.ai/api/chat , https://console.upstage.ai/docs/resources/error-codes , https://github.com/UpstageAI/Solar-Pro4-Cookbook

## 4. 도구 호출 (Tool calling / Function calling)

- `tools=[{"type":"function","function":{"name","description","parameters"(JSON Schema)}}]`, `tool_choice`: `"auto"`(기본) / `"required"` / `"none"` / 특정 함수. 함수 이름은 영문·숫자·`_`·`-`, 64자 이하, 최대 128개.
- 반복: ① tools와 함께 요청 → ② 응답에 `tool_calls`가 오면(`finish_reason="tool_calls"`) **그 assistant 메시지를 먼저 대화에 붙이고** → ③ 호출마다 내 코드에서 함수 실행 → `{"role":"tool","tool_call_id":…, "name":…, "content":결과 글}`을 붙임(**호출 하나에 결과 하나씩, 빠짐없이**) → ④ 다시 요청 → 최종 답. `arguments`는 JSON 글자라 `json.loads`. 도구만 부른 턴에서 `content`가 `None`이면 `""`로 바꿔 둔다(안 그러면 다음 요청이 거절될 수 있다).
- `parallel_tool_calls` 기본 켜짐 → 돌아온 `tool_calls`를 **모두** 처리한다. 최대 턴 수를 정해 무한 반복을 막는다.
- 근거 주소: https://console.upstage.ai/docs/capabilities/generate/tool-calling , https://github.com/UpstageAI/Solar-Pro4-Cookbook

## 5. Document Parse

- `POST https://api.upstage.ai/v1/document-digitization`, multipart: `document`(파일), `model="document-parse"`, `output_formats`(예: `'["markdown"]'`; `text`·`html`·`markdown` 조합, 기본 html), `ocr`(`"auto"` 기본: 이미지만 OCR, 디지털 PDF·DOCX는 안의 글자 / `"force"`: 늘 OCR — 스캔본), `mode`(`"standard"` 기본·싸고 빠름 / `"enhanced"` 복잡한 표·차트·스캔, 더 비쌈 / `"auto"` 쪽마다 고름), `coordinates`(기본 true), `chart_recognition`(기본 true, 차트를 표로), `merge_multipage_tables`(기본 false), `base64_encoding`(예: `'["table"]'` 잘라낸 이미지).
- 표준 코드:

```python
import os, requests
URL = "https://api.upstage.ai/v1/document-digitization"
with open("unit3.pdf", "rb") as f:
    r = requests.post(URL,
        headers={"Authorization": f"Bearer {os.environ['UPSTAGE_API_KEY']}"},
        files={"document": f},
        data={"model": "document-parse",
              "output_formats": '["markdown"]'})
r.raise_for_status()
md = r.json()["content"]["markdown"]
```

- 응답: `content.markdown`·`content.html`·`content.text`(전체), `elements[]`(요소마다 `id`, `category`, `page`, `content{text,html,markdown}`, `coordinates`(0~1 비율 꼭짓점 4개)), `usage.pages`.
- 요소 `category` 13가지: `heading1`, `paragraph`, `list`, `table`, `figure`, `chart`, `equation`(LaTeX로), `caption`, `header`, `footer`, `index`, `footnote`, `code`(`<pre><code>`). 제목 깊이(소제목)는 enhanced 모드에서 `sub_category`(`h2`~`h6`)로 온다(확정) — `heading2` category는 없다.
- 쪽수: 동기 100쪽까지(**넘으면 `413`으로 거절**), 비동기 2,000쪽까지, 큰 문서는 비동기 `…/document-digitization/async` → `request_id` → `GET …/requests/{id}` 상태 확인 → 묶음(10쪽)마다 `download_url`(15분 유효). 결과 30일 보관.
- 파일: JPEG, PNG, BMP, TIFF, HEIC, WEBP, PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, CSV, TSV, **HWP, HWPX**. 크기 ⚠️ 입력 요구사항 문서는 동기 100MB·비동기 500MB, 오류 코드 표는 50MB → 레슨은 **"50MB 안으로, 작게 나눠 보내요"**.
- RAG·LLM에 넣을 때는 `markdown`, 웹 화면에 보일 때는 `html`을 권한다(공식 권장표).
- 콘솔 Playground에서 로그인하면(API 키 없이) 써 볼 수 있다. 결과는 Preview·HTML·JSON 탭, 요소마다 번호와 종류(예: "2 - Heading1"). 게스트 데모는 2026-10-16 현재 일시 중단.
- 근거 주소: https://console.upstage.ai/docs/capabilities/parse/document-parsing , https://console.upstage.ai/api/parse/document-parsing

## 6. Information Extract

- OpenAI SDK, `base_url="https://api.upstage.ai/v1/information-extraction"`, `model="information-extract"`, `messages=[{"role":"user","content":[{"type":"image_url","image_url":{"url":"data:application/octet-stream;base64,…"}}]}]`(파일을 base64로), `response_format={"type":"json_schema","json_schema":{"name":"…","schema":{…}}}`. 결과는 `choices[0].message.content` JSON 글자 → `json.loads`.
- 스키마 규칙: 맨 위는 `object`, **첫 단계 속성은 `string`·`integer`·`number`·`array`만**(첫 단계에 object 안 됨), **배열 안에 배열 안 됨**(배열 안 object는 됨 → 문항 목록에 씀), 속성마다 `type`과 `description`(설명이 정확도를 좌우). 동기: 100쪽, 속성 100개, 스키마 15,000자까지.
- 선택(베타): `extra_body={"confidence": True}` → 값마다 `"high"`/`"low"`(숫자 아님), `choices[0].message.tool_calls` 중 이름이 `additional_values`인 호출의 `arguments`에 온다. `"mode": "enhanced"`(복잡한 표·손글씨), `"location"`(+`location_granularity`), `"split"`. 스키마 자료형에 `boolean`도 된다.
- 스키마 자동 생성: `POST https://api.upstage.ai/v1/information-extraction/schema-generation`(견본 파일 3개까지). 레슨은 "문서에서 확인" 정도로만.
- 텍스트(이미 파싱한 글)에서 뽑을 때는 Solar의 구조화 출력(3절)도 쓸 수 있다: 파일·이미지 → IE, 글 → Solar 구조화 출력.
- 근거 주소: https://console.upstage.ai/docs/capabilities/extract/universal-extraction

## 7. 임베딩

- `client.embeddings.create(model="solar-embedding-2-passage", input=[…])`(문서 조각), `model="solar-embedding-2-query"`(질문). `base_url="https://api.upstage.ai/v1"`. 결과 `resp.data[i].embedding`(숫자 1,024개).
- 한 요청에 글 100개·합계 204,800토큰까지, 글 하나는 8k 컨텍스트. 조각은 짧게(수백 토큰). 같은 쪽(passage끼리 저장, query로 찾기)을 지킨다.
- 비교는 코사인 유사도(내적 ÷ 길이 곱). 업스테이지 임베딩은 길이가 1로 맞춰져 있어 내적만으로 된다는 설명이 있지만, 레슨 코드는 코사인 공식을 그대로 쓴다.
- 근거 주소: https://console.upstage.ai/api/embeddings , https://console.upstage.ai/docs/capabilities/embed

## 8. 가격 (정가, 2026-10-16 공식 가격표 ⚠️ 바뀔 수 있음, 부가세 별도)

지금 `solar-pro4`·`solar-mini4`는 할인 행사 중이라 실제로 내는 값은 더 낮을 수 있다 → 레슨은 **"정가 기준"** 으로 쓴다.

| 제품 | 가격 |
| --- | --- |
| `solar-pro4` | 100만 토큰당 입력 $0.30, 출력 $1.20 |
| `solar-mini4` | 100만 토큰당 입력 $0.10, 출력 $0.40 |
| 임베딩 2 | 100만 토큰당 $0.02 |
| Document Parse | 쪽당 standard $0.01, enhanced $0.03 |
| Information Extract | 쪽당 standard $0.04, enhanced $0.06 |

레슨에서는 "정가로 어림하면"으로 쓰고 근거 https://www.upstage.ai/pricing/api 를 단다. 어림 예: 20쪽 학습지 파싱 ≈ $0.2, 학생 30명 × 질문 10개 × (입력 2천 + 출력 3백 토큰) ≈ 입력 60만·출력 9만 토큰 ≈ `solar-pro4`로 약 $0.29.

## 9. 그 밖

- **langchain-upstage**(0.7.7): 기본 모델이 곧 끝나는 `solar-mini`, 기본 주소가 옛 `…/v1/solar`라서 쓰려면 `ChatUpstage(model="solar-pro4")`처럼 꼭 적는다. 레슨은 OpenAI SDK + requests를 기본으로 한다.
- **Upstage MCP 서버**(`mcp-upstage`, PyPI): 도구 `parse_document`, `extract_information`(채팅 도구는 없음). `uvx mcp-upstage`로 실행, 설정에 `UPSTAGE_API_KEY`. Cursor에서는 커서한입에서 배운 `.cursor/mcp.json`의 `mcpServers`에 넣는다. 근거 https://github.com/UpstageAI/mcp-upstage
- **Upstage Studio**: 문서 처리 에이전트를 화면에서 만드는 노코드 도구. 노드는 Parse·Classify·Extract·Instruct. 2026-09-01부터 조직 단위 구독 요금(Free 등). 근거 https://console.upstage.ai/docs/studio
- **Responses API**도 solar-pro4·mini4에서 된다는 안내가 있지만 레슨은 Chat Completions로 통일한다.
- 공식 쿡북: https://github.com/UpstageAI/cookbook (옛 모델 이름이 많으니 모델 이름을 바꿔 읽게 가르친다), https://github.com/UpstageAI/Solar-Pro4-Cookbook
