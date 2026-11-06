---
paths:
  - "src/**/*.{ts,tsx}"
---

# 라우팅 규칙

- 라우터 설정(경로와 페이지 연결, 레이아웃, 가드)은 `app/router/`에 둡니다.
- `pages/{pageName}/`의 `*Page.tsx`는 `widgets`/`features`를 배치만 합니다. 재사용 가능한 UI, 조회·mutation 로직을 직접 작성하지 않습니다 (`architecture.md`의 "서버 데이터는 어디서 가져오나" 참고).
- 경로 문자열을 코드에 직접 쓰지 않고 `shared/config/paths.ts`의 빌더를 씁니다. (`navigate(paths.room.vote(roomId))`) 하위 레이어인 features·widgets에서도 화면 이동을 해야 하므로 `app`이 아니라 `shared`에 둡니다.
- 방에 속한 화면은 모두 `/rooms/:roomId/...` 아래에 둡니다. 탭 전환과 푸시 알림 진입이 단순 페이지 이동이 되도록 하기 위해서입니다.
- **바텀시트와 다이얼로그는 라우트로 만들지 않습니다.** 컴포넌트 상태로 엽니다.
- 딥링크(`intoss://chamabosal/...`)로 진입할 수 있는 경로는 `shared/config/deepLinks.ts`에만 정의합니다. 초대 링크를 만드는 `features/room/shareInvite`도 이 파일을 쓰므로 `shared`에 둡니다. 이 목록이 콘솔 '앱 내 기능'에 등록할 스킴 목록과 같아야 합니다.
- 뒤로가기는 토스 내비게이션 바가 처리합니다. `app/router/useTossBackHandler.ts`에서 래퍼(`subscribeBackEvent`)로 토스 뒤로가기 이벤트를 받아 이전 화면으로 이동하고, **첫 화면에서는 `Screen.close()`로 미니앱을 종료**합니다 (검수 항목).
- 화면 안에 자체 뒤로가기 버튼을 만들지 않습니다. 토스 뒤로가기와 동시에 보이면 검수에서 반려됩니다.

| 경로 | 레이아웃 | 화면 |
| --- | --- | --- |
| `/` | — | 진입 분기 (방 없음 → `/intro`, 있음 → 마지막 방) |
| `/intro` | Plain | 인트로 |
| `/rooms/new` | Plain | 방 만들기 → 닉네임 → 보살 받기 → 초대 공유 |
| `/invite?code=` | Plain | 초대 미리보기 → 닉네임 → 보살 받기 / 참여 불가 3종 |
| `/rooms/:roomId` | 하단 탭 | 홈 |
| `/rooms/:roomId/vote` | 하단 탭 | 투표 |
| `/rooms/:roomId/vote/tap` | 하단 탭 | 정신 차려! 톡톡 |
| `/rooms/:roomId/storehouse` | 하단 탭 | 곳간 |
| `/rooms/:roomId/my` | 하단 탭 | 내 보살 |
| `/rooms/:roomId/certify` | Plain | 번뇌 떨구기 |
| `/rooms/:roomId/certify/result` | 하단 탭 | 인증 결과 |
| `/terms`, `/privacy` | Plain | 약관 |
