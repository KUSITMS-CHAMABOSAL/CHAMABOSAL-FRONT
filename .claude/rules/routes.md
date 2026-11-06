---
paths:
  - "src/pages/**"
  - "src/app/router/**"
  - "src/app/layouts/**"
  - "src/shared/config/**"
---

# 라우팅 규칙

라우터는 react-router `createBrowserRouter`이고, 설정(경로, 레이아웃, 가드)은 `app/router/`에 둡니다.

- `pages/{pageName}/`의 `*Page.tsx`는 `widgets`, `features`를 배치만 합니다. 재사용 UI와 조회·mutation 로직을 직접 쓰지 않습니다.
- 경로 문자열을 코드에 직접 쓰지 않고 `shared/config/paths.ts`의 빌더를 씁니다: `navigate(paths.room.vote(roomId))`. 하위 레이어에서도 이동해야 하므로 `shared`에 둡니다.
- 방에 속한 화면은 모두 `/rooms/:roomId/...` 아래에 둡니다. 탭 전환과 푸시 진입을 단순 페이지 이동으로 만들기 위해서입니다.
- 바텀시트와 다이얼로그는 라우트로 만들지 않고 컴포넌트 상태로 엽니다.
- 뒤로가기는 토스 기본 동작을 씁니다. 커스텀 핸들러(`backEvent`)는 등록하는 순간 기본 동작이 막히므로 만들지 않습니다.
  - 🔖 기본 뒤로가기가 React Router 기록을 되돌리는지, 첫 화면에서 미니앱을 닫는지는 QR 실기기로 확인합니다. 안 될 때만 `shared/lib/appsInToss`에 `backEvent`, `screen` 래퍼를 만들고 `app/router/`에서 처리합니다.
- 화면 안에 자체 뒤로가기 버튼을 만들지 않습니다. 토스 뒤로가기와 동시에 보이면 반려됩니다.

| 경로                            | 레이아웃 | 화면                                               |
| ------------------------------- | -------- | -------------------------------------------------- |
| `/`                             | —        | 진입 분기 (방 없음 → `/intro`, 있음 → 마지막 방)   |
| `/intro`                        | Plain    | 인트로                                             |
| `/rooms/new`                    | Plain    | 방 만들기 → 닉네임 → 보살 받기 → 초대 공유         |
| `/invite?code=`                 | Plain    | 초대 미리보기 → 닉네임 → 보살 받기 / 참여 불가 3종 |
| `/rooms/:roomId`                | 하단 탭  | 홈                                                 |
| `/rooms/:roomId/vote`           | 하단 탭  | 투표                                               |
| `/rooms/:roomId/vote/tap`       | 하단 탭  | 정신 차려! 톡톡                                    |
| `/rooms/:roomId/storehouse`     | 하단 탭  | 곳간                                               |
| `/rooms/:roomId/my`             | 하단 탭  | 내 보살                                            |
| `/rooms/:roomId/certify`        | Plain    | 번뇌 떨구기                                        |
| `/rooms/:roomId/certify/result` | 하단 탭  | 인증 결과                                          |
| `/terms`, `/privacy`            | Plain    | 약관                                               |
