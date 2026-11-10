# 참아보살 프론트엔드

친구끼리 소비를 참았는지 인증하고 투표하는 앱인토스 WebView 미니앱입니다.

## AI 에이전트 사용법

이 저장소는 Claude Code 기준으로 설정되어 있습니다. 저장소를 받으면 별도 설치 없이 지침과 스킬이 적용됩니다.

### 지침이 로드되는 방식

토큰을 아끼기 위해 필요한 시점에만 로드합니다.

| 시점                | 위치                                                  | 내용                                     |
| ------------------- | ----------------------------------------------------- | ---------------------------------------- |
| 항상                | `CLAUDE.md`                                           | 판단 기준, 패키지 규칙, 완료 확인        |
| 해당 파일을 다룰 때 | `.claude/rules/*.md`                                  | 코드, UI, 데이터, 라우트, 앱인토스, 문서 |
| 작업에 맞을 때      | `.claude/skills/*/SKILL.md`                           | 판단 절차와 작업 절차                    |
| 스킬이 필요로 할 때 | `.claude/skills/find-code-location/references/map.md` | role, 상수, 목표 폴더 구조               |

`.claude/rules`는 각 파일의 `paths`에 맞는 파일을 읽거나 고칠 때 자동으로 붙습니다. 규칙을 외우거나 직접 불러올 필요가 없습니다.

### 스킬 쓰는 법

두 가지 방법이 있습니다.

- 직접 실행: `/gen-test src/entities/vote/lib/getVoteView.ts`
- 말로 요청: "이 함수 테스트 작성해줘". 설명이 맞는 스킬을 Claude가 고릅니다.

| 스킬                   | 언제 쓰나요                           | 입력                             | 코드 수정 |
| ---------------------- | ------------------------------------- | -------------------------------- | --------- |
| `find-code-location`   | 새 파일을 어디에 둘지 모를 때         | 만들려는 것 설명                 | 없음      |
| `figma-to-component`   | Figma 시안을 구현할 때                | Figma URL 또는 스크린샷          | 있음      |
| `interaction`          | 사용자 행동에 반응하는 모션을 만들 때 | 인터랙션 설명 또는 파일          | 있음      |
| `gen-test`             | 테스트를 작성할 때                    | 대상 파일 경로                   | 있음      |
| `check-rules`          | 올리기 전에 규칙 위반을 점검할 때     | 파일 경로, ref, 또는 생략        | 없음      |
| `check-security`       | PR 전이나 의존성을 추가한 뒤          | 파일 경로, ref, `all`, 또는 생략 | 없음      |
| `visual-aesthetics-qa` | 화면 구현을 마쳤거나 출시 전일 때     | 화면 경로 또는 파일              | 없음      |
| `refactor`             | 동작 변경 없이 구조를 정리할 때       | 파일 또는 폴더 경로              | 승인 범위 |
| `commit`               | 커밋 메시지와 단위를 정할 때          | 파일 경로 또는 생략              | 없음      |
| `issue-and-pr`         | 이슈, 브랜치, PR을 만들 때            | base 브랜치 또는 생략            | 없음      |
| `record-decision`      | 결정이나 외부 이슈를 기록할 때        | 기록할 내용                      | 문서만    |

일반 버그 리뷰는 기본 `/code-review`, 코드 단순화는 기본 `/simplify`를 씁니다.

### 스킬별 상세

**`find-code-location`**

`shared`, `entities`, `features`, `widgets`, `pages`, `app` 중 어디에 둘지 판별표로 정합니다. role 목록, 비즈니스 상수, 목표 폴더 구조도 제공합니다. 예: "방어권 사용 버튼은 어디에 둬?"

**`figma-to-component`**

- 필요한 것: Figma MCP 연결. 없으면 스크린샷 기준으로 진행하고 수치를 확인할 수 없다고 알려줍니다.
- 순서: 시안 읽기 → TDS 매핑표 확인 → 구현 → 브라우저 측정으로 시안과 대조.
- URL에 `node-id`가 있어야 합니다. Figma에서 해당 프레임을 선택한 뒤 링크를 복사합니다.
- 글자는 TDS `Paragraph` 토큰, 색은 `--adaptive*` CSS 변수를 씁니다. hex를 코드에 쓰지 않습니다.
- 토스가 그리는 상단 바와 TDS 기본 구조는 시안과 달라도 유지하고 결과에 보고합니다.
- 시안에 없는 loading, empty, error 상태는 만들지 않고 질문합니다.

**`interaction`**

- 목적(피드백, 상태, 입력)과 시안 범위(고정할 레이어와 움직일 레이어, 끝 화면)를 먼저 합의하고 CSS, scroll-snap, Web Animations API, 라이브러리, 영상 중 구현 방식을 고릅니다. 라이브러리는 scroll-snap이나 WAAPI로 만든 버전의 한계가 사용자에게 보일 때만 제안합니다.
- 항상 지키는 규칙만 스킬 본문에 두고, 실제로 걸렸던 문제는 `references/pitfalls.md`에 증상별로 모아 필요할 때만 읽습니다. 새로 걸린 문제는 그 표에 한 줄로 추가합니다.
- 단계 캡처(`capture-sequence.js`), 한 장 모아 보기(`contact-sheet.sh`), CPU 4배 감속 프레임 측정(`measure-frames.js`)을 `scripts/`의 파일로 실행합니다. 실제 WebView와 햅틱은 QR 실기기로 확인해야 합니다.

**`gen-test`**

- 테스트 도구가 아직 없습니다. 처음 쓰면 도입 절차를 제안하고, 승인 후 `templates/`의 설정으로 설치합니다.
- 순수 함수, 시간 경계, 상수 경계, 훅, 컴포넌트 순으로 우선합니다. 표시만 하는 컴포넌트는 테스트하지 않습니다.
- TDS는 앱인토스 환경 전용이라 jsdom에서 오버레이가 동작하지 않습니다. 테스트에서는 `tdsStubs`로 대체하고 실제 동작은 브라우저에서 확인합니다.

**`check-rules`**

린트가 잡지 못하는 위반을 봅니다. 레이어 역할, TDS 재구현, 경로 직접 사용, 인라인 스타일, 문구 등입니다. 읽기 전용이고 `위반`과 `확인하지 못한 것`을 보고합니다.

- 현재 변경 전체: `/check-rules`
- 파일 하나: `/check-rules src/widgets/home/todayBosals/ui/TodayBosals.tsx`
- 브랜치 전체: `/check-rules main`

**`check-security`**

- 스킬이 따로 떨어진 읽기 전용 에이전트(`context: fork`, `agent: Explore`)에서 실행되고 결과 표만 돌려줍니다. 검사 기준이 길어도 메인 대화에는 로드되지 않습니다.
- 앱 코드(비밀값, 외부 코드 실행, XSS, HTTP 통신, 토스 도메인 밖 렌더링, 딥링크, 기기 저장, 개인정보 로그, 권한, SDK 과호출), 의존성(`pnpm audit`, 새 패키지 출처, 설치 스크립트 허용), 빌드 설정을 앱인토스 출시 체크리스트와 `.claude/rules/toss.md` 기준으로 봅니다.
- 범위: 생략하면 `main` 이후 변경, `all`이면 전체입니다. 기본 `/security-review`는 일반 보안 리뷰이고 앱인토스 기준은 보지 않습니다.

**`visual-aesthetics-qa`**

- 필요한 것: 브라우저 도구(Playwright MCP 등), 성능 측정은 Chrome DevTools MCP 등. 없으면 해당 항목을 미확인으로 보고합니다.
- 360x640, 390x844에서 11px 미만 글자, 가로 넘침, 터치 영역, 이미지 크기, 핀치 줌 등을 측정합니다.
- 성능은 `pnpm build` 뒤 `pnpm preview`로 측정합니다. 코드를 수정하지 않습니다.
- 실제 safe area, 키보드, SDK 동작은 QR 실기기 테스트로 확인해야 합니다.

**`refactor`**

잘못된 레이어, 큰 페이지, 반복 UI, 책임 혼합을 찾아 후보 목록을 먼저 보여줍니다. 고른 항목만 적용하며 동작, props 이름, 라우트 경로는 바꾸지 않습니다.

**`commit`**

변경을 읽고 `{type}: {한국어 설명}` 메시지와 커밋 단위를 제안합니다. 커밋 실행은 요청할 때만 합니다. type은 `feat`, `fix`, `chore`, `docs`, `style`, `refactor`, `ui`입니다.

**`issue-and-pr`**

- 이슈 제목은 `[Type] 작업 내용`이고, 브랜치 유형과 영문 kebab-case 작업 내용을 적습니다.
- 이슈를 열면 `{type}/{이슈번호}-{작업내용}` 브랜치가 자동으로 만들어집니다. 브랜치를 직접 만들지 않습니다.
- PR은 템플릿을 채운 초안을 만들고, 요청하면 올립니다.

**`record-decision`**

구조·라이브러리 결정은 `docs/decisions/`, 외부 요인 이슈와 미루는 문제는 `docs/known-issues/`에 기록합니다.

### 추천 작업 흐름

1. `issue-and-pr`로 이슈를 만들고 생성된 브랜치로 이동합니다.
2. 새 파일이면 `find-code-location`, 시안이 있으면 `figma-to-component`로 구현합니다.
3. 로직이 있으면 `gen-test`로 테스트합니다.
4. `check-rules`와 `visual-aesthetics-qa`로 점검하고, 의존성을 추가했거나 PR 전이면 `check-security`도 돌립니다.
5. `commit`으로 커밋하고 `issue-and-pr`로 PR을 올립니다. CodeRabbit이 자동으로 리뷰합니다.

### PR 자동 리뷰

CodeRabbit이 `CLAUDE.md`, `.claude/rules`, `.coderabbit.yaml`을 기준으로 한국어로 리뷰합니다. 규칙을 바꾸면 리뷰 기준도 함께 바뀝니다.

### 지침을 고칠 때

- 규칙은 `.claude/rules`에 씁니다. 모든 작업에 필요한 내용만 `CLAUDE.md`에 둡니다.
- 린트와 훅이 막는 내용, 코드에서 바로 보이는 내용은 쓰지 않습니다.
- `CLAUDE.md`가 길어지면 매 작업의 토큰 비용이 늘어납니다. 추가하기 전에 일부 작업에만 필요한 내용인지 먼저 봅니다.
