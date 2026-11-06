---
name: gen-test
description: 컴포넌트, 훅, 유틸의 회귀 테스트를 Vitest와 Testing Library로 작성하고 실행합니다. 테스트 추가나 테스트 도구 도입을 요청받았을 때 사용합니다.
argument-hint: "<대상 파일 경로>"
---

# 테스트 작성

## 준비 상태

- vitest 설치 여부: !`grep -c '"vitest"' package.json || true`
- test 스크립트: !`grep -c '"test":' package.json || true`

값이 `0`이면 `templates/README.md`의 도입 절차를 사용자에게 제안하고, 확인을 받은 뒤 진행합니다.

## 무엇을 테스트할지

쓰기 전에 대상의 사용자 관찰 동작을 목록으로 정리합니다. 위쪽일수록 효과가 큽니다.

| 대상                        | 방식                                                              |
| --------------------------- | ----------------------------------------------------------------- |
| `lib/`의 순수 함수          | 입력과 출력, 경계값. `getVoteView` 같은 판별 유니온은 모든 `kind` |
| 시간 계산                   | `vi.useFakeTimers`로 자정, 정오, 수정 가능 시간 경계              |
| `config/` 상수를 쓰는 판단  | 경계값 직전과 직후 (`MIN_VOTERS`, `TAP_GOAL` 등)                  |
| 조회·mutation 훅            | `renderHook`과 `QueryClientProvider`, 성공과 실패, 무효화할 쿼리  |
| 사용자 행동이 있는 컴포넌트 | render → `userEvent` → 보이는 결과                                |
| 앱인토스 래퍼               | 토스 앱 밖, `UNSUPPORTED_APP_VERSION`, 호출 실패 시 fallback      |

표시만 하는 컴포넌트, 레이아웃, 클래스 이름은 테스트하지 않습니다. 화면 모양은 `visual-aesthetics-qa`가 맡습니다.

## 환경 제약

- **TDS:** 앱인토스 환경 전용이라 jsdom에서 다이얼로그 같은 오버레이가 정리 단계에서 터집니다. 환경을 위장해 우회하지 않습니다. `vi.mock("@toss/tds-mobile", () => import("@/shared/test/tdsStubs"))`로 대체하고, 필요한 컴포넌트만 `tdsStubs.tsx`에 추가합니다. 실제 오버레이는 브라우저에서 확인합니다.
- **`TDSMobileAITProvider`:** 테스트에서 쓰지 않습니다. `renderWithProviders`는 `QueryClientProvider`만 감쌉니다.
- **앱인토스 SDK:** `vi.mock("@/shared/lib/appsInToss", ...)`로 래퍼를 대체합니다. 래퍼 자체를 테스트할 때만 `@apps-in-toss/web-framework`를 mock합니다.
- **네트워크:** 슬라이스의 `api/` 함수를 mock합니다. 실제 요청을 보내지 않습니다.
- **`happy-dom`:** TDS와 맞지 않아 쓰지 않습니다.

## 작성 규칙

- 대상 파일 옆에 `.test.ts(x)`로 둡니다. 같은 슬라이스는 상대경로, 공용 도구는 `@/shared/test/...`로 import합니다.
- `describe`, `it`, `expect`, `vi`는 `vitest`에서 직접 import합니다.
- 쿼리 우선순위: `getByRole` → `getByLabelText` → `getByText` → `getByTestId`.
- 비동기 UI는 `findBy*`나 `waitFor`를 씁니다.
- `it` 하나에 동작 하나만 검증하고, 이름은 한국어로 행동을 씁니다.
- 실패하는 테스트를 `skip`으로 숨기지 않습니다. 테스트와 코드 중 어느 쪽이 틀렸는지 판단해 고칩니다.

## 실행

1. `pnpm test <테스트 파일>`로 대상만 먼저 실행합니다.
2. 코드를 잠깐 망가뜨려 테스트가 실제로 실패하는지 한 번 확인하고 되돌립니다. 항상 통과하는 테스트는 지웁니다.
3. `pnpm lint`, `pnpm exec tsc -b`를 실행합니다.
