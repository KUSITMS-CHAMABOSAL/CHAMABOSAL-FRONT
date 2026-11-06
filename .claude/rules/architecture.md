# 아키텍처 (FSD) 규칙

> 🔖 = 팀에서 아직 확정하지 않은 항목입니다. 임의로 결정하지 말고 사용자에게 확인하세요.
> 상세 규칙: 스타일링 `styling.md`, 타입 `typescript.md`, 라우팅 `routing.md`, 앱인토스 `apps-in-toss.md`, 네이밍 `naming.md`, 커밋·브랜치·이슈 `commit.md`

## 프로젝트 개요

| 항목     | 내용                                                                 |
| ------ | ------------------------------------------------------------------ |
| 플랫폼    | 앱인토스 WebView 미니앱 (`@apps-in-toss/web-framework` 3.x)               |
| 빌드     | Vite + React 18 + TypeScript                                       |
| 렌더링    | CSR 전용 (앱인토스는 SSR 금지)                                              |
| UI     | TDS (`@toss/tds-mobile`, `@toss/tds-mobile-ait`) 우선, 부족한 부분만 직접 제작 |
| 스타일    | Tailwind CSS v4                                                    |
| 서버 상태  | TanStack Query                                                  |
| 라우터    | react-router (`createBrowserRouter`, loader 미사용 — 데이터는 TanStack Query)                                                    |
| SDK 목킹 | `@apps-in-toss/devtools` (브라우저에서 SDK 동작 흉내)                        |
| 클라이언트 상태 | 별도 라이브러리 없음. 서버 데이터는 TanStack Query, URL 상태는 라우터, 화면 상태는 `useState`. 멀리 떨어진 컴포넌트들이 공유하는 상태가 생길 때만 zustand를 슬라이스의 `model/`에 도입 |

---

## 레이어 구성

```
(root)
├── apps-in-toss.config.ts   앱인토스 설정 (appName, permissions, webBundleDir)
├── vite.config.ts           빌드 설정, @/ alias
├── tsconfig.app.json        @/ alias
└── src/
    ├── app/        레이어 6 (최상위) — 엔트리, Provider, 라우터 설정, 앱 시작 처리, 전역 스타일
    ├── pages/      레이어 5          — 라우트 하나에 대응하는 화면
    ├── widgets/    레이어 4          — 여러 feature/entity를 조합한 화면 단위 블록
    ├── features/   레이어 3          — 특정 기능 단위 (사용자 행동)
    ├── entities/   레이어 2          — 서비스의 핵심 비즈니스 객체 (데이터 + 표시용 UI)
    └── shared/     레이어 1 (최하위) — 도메인과 무관한 공통 자원
```

숫자가 클수록 상위 레이어입니다. 각 레이어의 역할은 아래 표를 따릅니다.

- FSD 레이어 규칙은 **`src/` 내부에만** 적용합니다. 루트 설정 파일은 대상이 아닙니다.
- `processes` 레이어는 사용하지 않습니다.
- Vite는 파일 기반 라우팅이 없는 SPA라서, FSD 원래 구성대로 `app`(앱 초기화·전역 설정)과 `pages`(라우트 화면)를 나눕니다.
- 앱인토스 빌드는 `dist`의 정적 번들만 사용하므로, `src/` 내부 구조는 배포에 영향을 주지 않습니다.

| 레이어 | 이 레이어에 넣는 것 | 이 레이어에 넣지 않는 것 |
| --- | --- | --- |
| `shared` | 도메인 개념이 전혀 없는 범용 UI/유틸/설정, 앱인토스 SDK 래퍼, API 클라이언트. 서비스 이름을 몰라도 이해되는 것들 | 보살, 방, 인증처럼 특정 화면이나 데이터 모델을 아는 코드 |
| `entities` | 서비스에 존재하는 비즈니스 "객체"(보살, 방, 멤버, 인증, 투표, 아이템)의 데이터 모델, 조회 로직, 그 객체를 그대로 보여주기만 하는 UI | 클릭 시 상태를 바꾸거나 서버에 변경을 요청하는 로직/UI |
| `features` | 사용자가 수행하는 하나의 "행동" — 인증 제출, 투표, 콕 찌르기, 아이템 구매 등. 그 행동에 필요한 전용 UI와 로직 | 여러 화면을 아우르는 레이아웃 구성 |
| `widgets` | 여러 `features`/`entities`를 배치해 화면의 한 영역(섹션)을 완성한 블록 | 라우팅 자체 |
| `pages` | 라우트 하나에 대응하는 화면. `widgets`/`features`를 배치만 함 | 조회·mutation 로직, 재사용 가능한 UI (하위 레이어로 내려보낼 것) |
| `app` | 엔트리(`main.tsx`), Provider(TDS, QueryClient), 라우터 설정, 앱 시작 처리(사용자 식별 등), 레이아웃(하단 탭바), 전역 스타일 | 특정 화면에만 쓰이는 코드 |

### 레이어 선택 판별법

**Q1. 도메인(서비스가 다루는 데이터)과 무관하게 다른 프로젝트에 그대로 복사해도 말이 되는가?**

→ 그렇다면 `shared`. (`cn`, 금액 포맷 함수, `EmptyState`, `MonthCalendar`, 앱인토스 공유/햅틱 래퍼 등)

**Q2. 사용자가 아무 행동도 하지 않아도, 그 "객체가 존재한다"는 사실만으로 필요한 코드인가? (명사)**

→ 그렇다면 `entities`. (보살 이미지, 상태 배지, 인증 카드, 공양미 게이지, 방 조회 쿼리)

**Q3. 클릭/입력 등 사용자 행동이 상태 변화나 서버 요청으로 이어지는가? 그리고 그 행동이 특정 화면/역할에 종속적인가? (동사)**

→ 그렇다면 `features`. (인증 폼, 투표하기, 내보내기, 구매하기, 알림 토글)

**Q4. 여러 `features`/`entities`를 한 화면 영역으로 배치만 하는가?**

→ 그렇다면 `widgets`. (홈의 "오늘의 보살들" 섹션, 곳간의 아이템 상점 영역)

**Q5. 라우트 경로에 대응되는 화면 자체인가?**

→ 그렇다면 `pages`.

**Q6. 앱 초기화나 전역 설정인가? (Provider, 라우터, 앱 시작 처리, 전역 스타일)**

→ 그렇다면 `app`.

### `entities` vs `features` 상세 비교

|  | `entities` | `features` |
| --- | --- | --- |
| 성격 | 명사 — "이 서비스에 어떤 객체가 있는가" | 동사 — "사용자가 무엇을 하는가" |
| 내용 | 데이터 모델(타입), 기본 조회 API/훅, 순수 표시용 UI | 폼, 도메인 로직, 사용자 액션이 포함된 전용 UI |
| 클릭 시 동작 | 없음 (표시만) | 있음 (상태 변경, API mutation, 시트/다이얼로그 오픈) |
| 재사용 범위 | 여러 feature/widget에서 공통 참조 | 특정 화면·역할에 종속 |
| 판별 테스트 | 이 코드를 지워도 "그 객체"라는 개념은 서비스에 여전히 존재하는가? → Yes면 entities | 이 코드를 지우면 그 "행동" 자체가 서비스에서 사라지는가? → Yes면 features |

**조합 예시 — 곳간 아이템 카드**

- `entities/item`의 `ItemCard`는 아이템 이미지, 가격, 보유 상태만 보여줍니다. 버튼 자리는 `action` 슬롯으로 비워 둡니다.
- `features/storehouse/buyItem`의 `BuyItemButton`이 구매 mutation을 갖고, widget에서 둘을 조합합니다.

```tsx
// widgets/storehouse/itemShop/ui/ItemShop.tsx
import { ItemCard } from "@/entities/item";                         // 표시는 entities
import { BuyItemButton } from "@/features/storehouse/buyItem";       // 행동은 features
import { EquipItemButton } from "@/features/storehouse/equipItem";

const ItemShop = ({ items }: ItemShopProps) => {
  return items.map((item) => (
    <ItemCard
      key={item.id}
      item={item}
      action={item.owned ? <EquipItemButton item={item} /> : <BuyItemButton item={item} />}
    />
  ));
};
```

즉 "보여주는 부분"은 `entities`, "그걸 감싸서 행동을 붙이는 부분"은 `features`, "둘을 배치하는 부분"은 `widgets`로 나눠 조합하는 것이 기본 패턴입니다.

---

## 폴더 경로 규칙

`{레이어}/{역할}/{기능명}` 형태로 중첩합니다.

```
features/{role}/{featureName}
widgets/{role}/{sectionName}
entities/{objectName}
```

- `{role}`: 그 기능이 속한 서비스 영역입니다. 아래 목록 중에서 고릅니다.
- `{featureName}` / `{sectionName}`: 실제로 하는 일을 나타내는 이름 (동사 + 목적어 권장).
- `entities`는 역할이 아니라 객체 단위로만 나눕니다 (역할 하위 폴더 없음).

| role | 범위 | 예시 |
| --- | --- | --- |
| `onboarding` | 인트로, 닉네임, 보살 받기 | `features/onboarding/nicknameForm` |
| `room` | 방 만들기, 초대, 참여, 나가기, 내보내기 | `features/room/createRoom`, `features/room/kickMember` |
| `home` | 홈 화면 섹션 (widgets 전용) | `widgets/home/todayBosals` |
| `member` | 멤버 간 상호작용 | `features/member/pokeMember` |
| `certification` | 번뇌 떨구기 인증, 반응 | `features/certification/submitCertification` |
| `vote` | 투표, 이마 톡톡, 방어권 | `features/vote/castVote`, `features/vote/tapForehead` |
| `storehouse` | 곳간 (구매, 착용) | `features/storehouse/buyItem` |
| `myBosal` | 내 보살 화면 | `widgets/myBosal/myRoomPanel` |
| `settings` | 알림 설정, 데이터 삭제 | `features/settings/notificationSetting` |

> 폴더명이 `use`로 시작하면 훅으로 오해받습니다. 방어권 사용은 `useShield`가 아니라 `applyShield`처럼 이름 짓습니다.

---

## 슬라이스 내부 하위 폴더

| 폴더 | 용도 | 파일명 규칙 |
| --- | --- | --- |
| `ui/` | 컴포넌트 | PascalCase (`BosalImage.tsx`) |
| `api/` | 서버 요청 함수, Query 키/옵션 (`entities`·`features`) | camelCase (`roomApi.ts`, `roomQueries.ts`) |
| `model/` | 상태, 커스텀 훅, 타입, 목업 데이터 | camelCase (`useSubmitCertification.ts`), 훅은 `use` 접두사 |
| `lib/` | 순수 유틸 함수 (부수효과 없음) | camelCase (`getVoteView.ts`) |
| `config/` | 상수, 메시지, 설정값 | camelCase 파일명, export는 대문자 SNAKE_CASE (`export const MAX_MEMBERS = 4`) |
| `assets/` | 그 슬라이스 전용 이미지/SVG (`entities/bosal` 등) | 소문자, `snake_case` 허용 (아이콘은 `naming.md`의 아이콘 규칙) |

> 모든 하위 폴더가 항상 필요한 건 아닙니다. 필요한 폴더만 만드세요.

`entities` 폴더도 동일한 하위 폴더 규칙을 따릅니다. 단 `ui/`에는 "표시용" 컴포넌트만 두고, 사용자 액션이 있는 컴포넌트는 만들지 않습니다 (그건 `features`에 둡니다).

**디자인 문구에 나오는 비즈니스 규칙은 반드시 `config/`의 상수로 둡니다.**

| 디자인 문구 | 상수 | 위치 |
| --- | --- | --- |
| 최대 4명까지 함께할 수 있어요 | `MAX_MEMBERS = 4` | `entities/room/config` |
| 참여중인 방이 2개에요 | `MAX_ROOMS = 2` | `entities/room/config` |
| 공양미 한 솥 300석, +30석 | `POT_CAPACITY`, `POT_REWARD` | `entities/room/config` |
| 9분동안 수정 및 삭제 | `EDIT_WINDOW_MINUTES = 10` 🔖 (남은 시간 표시로 추정) | `entities/certification/config` |
| 보살이 3명 이상 모이면 투표 | `MIN_VOTERS = 3` | `entities/vote/config` |
| 1/10 번 | `TAP_GOAL = 10` | `entities/vote/config` |
| 닉네임 3/8 | `NICKNAME_MAX_LENGTH = 8` | `features/onboarding/nicknameForm/config` |

### 서버 데이터는 어디서 가져오나

SSR이나 서버 컴포넌트가 없으므로 데이터 패칭은 전부 클라이언트에서 일어납니다. 위치는 아래처럼 고정합니다.

| 종류 | 위치 | 예시 |
| --- | --- | --- |
| 조회 요청 함수, Query 키, 조회 훅 | `entities/{object}/api/` | `roomApi.ts`, `roomQueries.ts`, `useRoomQuery.ts` |
| mutation 훅 (생성·수정·삭제), 성공 후 무효화할 쿼리 | `features/{role}/{featureName}/model/` | `useCastVote.ts` |
| 화면 조합 | `widgets`, `pages` | 조회 훅을 호출하고 결과를 entities/features 컴포넌트에 넘김 |

`pages`는 조합만 합니다. 요청 함수나 쿼리 정의를 `pages` 안에 직접 작성하지 않습니다.

---

## `index.ts` (배럴 파일) 작성 규칙

각 슬라이스(폴더) 최상단에 `index.ts`를 두고, **외부에서 실제로 쓰는 항목만** 재노출합니다. 이 파일이 그 슬라이스의 "공개 API" 역할을 합니다.

- 컴포넌트(default export) → `export { default as ComponentName } from "./ui/ComponentName";`
- named export (타입, 상수, 함수, 훅) → `export { name } from "./model/name";`
- 파일 하나를 통째로 재노출 → `export * from "./config/name";`

```tsx
// entities/bosal/index.ts
export * from "./config/bosal";
export type { BosalColor, BosalPose, BosalStatus } from "./model/types";
export { default as BosalImage } from "./ui/BosalImage";
export { default as BosalStatusBadge } from "./ui/BosalStatusBadge";
```

내부 구현 파일(`model/`, `lib/` 안의 헬퍼 등)은 굳이 다 재노출하지 않습니다. 외부에서 필요 없는 건 노출하지 않는 것이 원칙입니다.

---

## import 경로 규칙

절대경로 alias `@/`를 사용합니다 (`@/features/...`, `@/entities/...`, `@/shared/...`). 두 곳에 모두 설정해야 동작합니다.

`tsconfig.app.json`

```json
{
  "compilerOptions": {
    "paths": { "@/*": ["./src/*"] }
  }
}
```

`vite.config.ts`

```ts
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
});
```

**단, 참조 위치에 따라 상대경로/절대경로를 구분합니다.**

| 상황 | 사용 경로 |
| --- | --- |
| 같은 슬라이스 내부끼리 참조 (예: 같은 feature 폴더 안에서 `ui`가 `model`을 참조) | **상대경로** (`../model/...`) |
| 다른 슬라이스/레이어를 참조 (경계를 넘음) | **절대경로 + 배럴 파일** (`@/features/{role}/{featureName}`) |

슬라이스 밖에서 안으로 들어올 땐 반드시 `index.ts`를 거칩니다. 내부 경로를 직접 찌르지 않습니다.

```tsx
// ✅ 같은 슬라이스 내부: 상대경로
import { useCastVote } from "../model/useCastVote";

// ✅ 슬라이스 외부에서: 배럴 파일 경로
import { CastVoteButton } from "@/features/vote/castVote";

// ❌ 슬라이스 외부에서 내부 경로 직접 참조 금지
import CastVoteButton from "@/features/vote/castVote/ui/CastVoteButton";
```

이렇게 나누는 이유:

1. 슬라이스 내부는 나중에 폴더째로 옮기거나 리네이밍해도 alias를 안 건드리고 상대경로만 따라가면 됩니다.
2. 슬라이스 경계를 넘을 땐 항상 `index.ts`를 거치게 강제해서, 내부 파일 구조가 바뀌어도 외부 import가 깨지지 않습니다.

---

## FSD 단방향 의존 규칙

### 레이어 순서 (위 → 아래)

```
app
pages
widgets
features
entities
shared
```

상위 레이어는 하위 레이어를 참조할 수 있지만, 하위 레이어는 상위 레이어를 참조할 수 없습니다.

- ✅ `app` → `pages`, `widgets`, `features`, `entities`, `shared` 참조 가능
- ✅ `pages` → `widgets`, `features`, `entities`, `shared` 참조 가능
- ✅ `widgets` → `features`, `entities`, `shared` 참조 가능
- ✅ `features` → `entities`, `shared` 참조 가능
- ✅ `entities` → `shared` 참조 가능
- ❌ `shared` → `entities`, `features`, `widgets`, `pages`, `app` 참조 **불가**
- ❌ `entities` → `features`, `widgets`, `pages`, `app` 참조 **불가**
- ❌ `features` → `widgets`, `pages`, `app` 참조 **불가**
- ❌ `widgets` → `pages`, `app` 참조 **불가**
- ❌ `pages` → `app` 참조 **불가** (`paths.ts` 같은 경로 빌더가 페이지에서 필요하면 `shared/config`에 둡니다)

같은 레이어의 다른 슬라이스끼리 직접 참조하는 것도 원칙적으로 지양합니다. (예: `features/vote/castVote`가 `features/member/pokeMember`를 직접 import하지 않기) 공통으로 필요한 로직이 생기면 `entities`나 `shared`로 내려서 양쪽이 그걸 참조하게 만드세요. 두 행동을 한 화면에 함께 놓아야 하면 `widgets`에서 조합합니다.

이 규칙은 `eslint.config.js`의 `eslint-plugin-boundaries`로 강제합니다 (`pnpm lint`).

- 실제 파일 경로를 해석해서 검사하므로 상대경로, `@/` 절대경로, 동적 `import()`가 모두 같은 기준으로 걸립니다.
- 레이어 정의는 `boundaries/elements`에 있습니다. `features`·`widgets`는 `{role}/{slice}` 두 단계가 하나의 슬라이스이고, role이 다르면 이름이 같아도 다른 슬라이스입니다.
- 슬라이스 밖에서는 그 슬라이스의 `index.ts`만 import할 수 있습니다. `shared`는 세그먼트끼리, 그리고 모든 레이어에서 자유롭게 import할 수 있습니다.
- `src/` 안에 어느 레이어에도 속하지 않는 파일을 만들면 에러입니다 (`boundaries/no-unknown-files`).
- 앱인토스 SDK 제한은 레이어 문제가 아니라서 `no-restricted-imports`로 따로 막습니다.
- 규칙에 걸리면 우회하지 말고 구조를 고칩니다. 공통 로직은 하위 레이어로 내리고, 조합은 상위 레이어에서 합니다.

---

## 부록. 전체 폴더 구조

```
src/
├── app/
│   ├── main.tsx
│   ├── App.tsx
│   ├── bootstrap/          # 사용자 식별, 내비게이션 바 하트 버튼, 서버 시간 보정
│   ├── providers/          # TDSMobileAITProvider, QueryClientProvider
│   ├── router/             # routes.tsx, useTossBackHandler.ts, guards/
│   ├── layouts/            # RoomTabLayout(하단 탭바), PlainLayout
│   └── styles/             # index.css
│
├── pages/
│   ├── intro/          # IntroPage
│   ├── createRoom/     # CreateRoomPage
│   ├── invite/         # InvitePage
│   ├── home/           # HomePage
│   ├── certify/        # CertifyPage, CertifyResultPage
│   ├── vote/           # VotePage, TapTapPage
│   ├── storehouse/     # StorehousePage
│   ├── myBosal/        # MyBosalPage
│   └── legal/          # TermsPage, PrivacyPage
│
├── widgets/
│   ├── onboarding/joinSteps/          # 닉네임 → 보살 받기 (방 만들기·초대 공용)
│   ├── home/roomSummary/              # 방 제목 + 공양미 게이지 + 방 정보
│   ├── home/todayBosals/              # 보살 그리드 + 선택한 보살의 인증 카드
│   ├── home/myToday/                  # 내 오늘 카드
│   ├── certification/certifyResult/   # 결과 3종
│   ├── vote/voteBoard/                # VoteView 분기
│   ├── storehouse/itemShop/           # 착용 미리보기 + 카테고리 + 아이템 목록
│   └── myBosal/myRoomPanel/           # 보살 카드 + 인증 캘린더 + 설정
│
├── features/
│   ├── onboarding/nicknameForm/
│   ├── room/createRoom/
│   ├── room/joinRoom/
│   ├── room/shareInvite/
│   ├── room/leaveRoom/
│   ├── room/kickMember/
│   ├── room/renameNickname/
│   ├── member/pokeMember/
│   ├── certification/submitCertification/
│   ├── certification/editCertification/
│   ├── certification/reactCertification/
│   ├── vote/castVote/
│   ├── vote/tapForehead/
│   ├── vote/applyShield/
│   ├── storehouse/buyItem/
│   ├── storehouse/equipItem/
│   ├── settings/notificationSetting/
│   └── settings/deleteMyData/
│
├── entities/
│   ├── bosal/              # BosalImage, BosalCard, BosalStatusBadge, BosalGrid, assets/
│   ├── room/               # RoomIllustration, RicePotGauge, roomQueries, 방 규칙 상수
│   ├── member/             # MemberStatRow
│   ├── certification/      # CertificationCard
│   ├── vote/               # VoteCandidateCard, getVoteView
│   ├── item/               # ItemCard
│   └── session/            # 로그인 토큰, 내 정보
│
├── shared/
│   ├── api/                # client.ts, queryClient.ts
│   ├── ui/                 # EmptyState, InfoBox, GradientScreen, MonthCalendar
│   ├── lib/
│   │   ├── appsInToss/     # 앱인토스 SDK 래퍼 (auth, share, photos, haptic, notification, storage, screen, backEvent, errors)
│   │   └── cn.ts, formatWon.ts, formatDateTime.ts
│   ├── hooks/              # useServerCountdown, useFunnel
│   ├── config/             # env.ts, paths.ts, deepLinks.ts
│   ├── types/
│   └── assets/             # icons/, illustrations/
```
