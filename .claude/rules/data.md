---
paths:
  - "src/**/api/**"
  - "src/**/model/**"
  - "src/**/config/**"
---

# 데이터 규칙

앱인토스는 SSR이 금지된 CSR 전용이라 데이터 패칭은 전부 클라이언트에서 일어납니다. 위치는 고정입니다.

| 종류                                    | 위치                                   | 예시                                              |
| --------------------------------------- | -------------------------------------- | ------------------------------------------------- |
| 조회 요청 함수, Query 키, 조회 훅       | `entities/{object}/api/`               | `roomApi.ts`, `roomQueries.ts`, `useRoomQuery.ts` |
| mutation 훅, 성공 후 무효화할 쿼리      | `features/{role}/{featureName}/model/` | `useCastVote.ts`                                  |
| 화면 조합 (조회 훅 호출 후 하위에 넘김) | `widgets`, `pages`                     | 요청 함수나 쿼리를 `pages`에 쓰지 않음            |

## 상태

- 서버 데이터는 TanStack Query, URL 상태는 라우터, 화면 상태는 `useState`입니다.
- 별도 상태 라이브러리는 없습니다. 멀리 떨어진 컴포넌트들이 공유하는 상태가 생길 때만 zustand를 슬라이스의 `model/`에 도입합니다.
- 라우터 loader는 쓰지 않습니다. 데이터는 TanStack Query로 가져옵니다.

## 상수

디자인 문구에 나오는 비즈니스 규칙은 반드시 `config/`의 상수로 둡니다. 현재 상수 목록은 `find-code-location` 스킬의 `references/map.md`에 있습니다.
