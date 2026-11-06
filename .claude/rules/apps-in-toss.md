---
paths:
  - "src/**/*.{ts,tsx}"
  - "apps-in-toss.config.ts"
---

# 앱인토스 플랫폼 규칙

- **`@apps-in-toss/web-framework`는 `shared/lib/appsInToss/`에서만 import합니다.** 도메인과 무관한 플랫폼 계층입니다. 다른 레이어는 모두 `@/shared/lib/appsInToss`의 래퍼 함수를 씁니다. 🔖 ESLint `no-restricted-imports`로 강제
- 사용자 행동에 묶인 SDK 기능은 `features`가 이 래퍼를 호출하는 구조로 만듭니다. (예: `features/room/shareInvite` → `shareLink()`, `features/settings/notificationSetting` → `requestNotificationAgreement()`)
- 앱 시작 시 사용자 식별(`User.getAnonymousKey` 계열)은 사용자 행동이 아니므로 `app/bootstrap/`이 래퍼를 호출합니다. 이 앱은 토스 로그인을 쓰지 않으므로 `features/auth/tossLogin` 같은 슬라이스는 만들지 않습니다. 🔖
- 일반 브라우저처럼 토스 앱 밖에서 실행될 때의 처리도 래퍼 안에서 끝냅니다. 그래야 상위 레이어가 실행 환경을 몰라도 됩니다.
  - 로컬 개발: `@apps-in-toss/devtools`가 SDK를 목으로 대체합니다 (`vite.config.ts`에 연결됨). 래퍼에 목을 따로 작성하지 않습니다.
  - 지원하지 않는 토스 앱 버전이나 브릿지 호출 실패: 래퍼가 에러를 잡아 앱 공통 에러나 fallback 값으로 바꿉니다.
- SDK 3.x의 **도메인 객체 API**를 씁니다 (`Device.openCamera`, `Share.createLink`, `User.getAnonymousKey` 등). 개별 함수(`openCamera`, `getTossShareLink`)는 deprecated입니다.
- 도메인 객체 API는 토스 앱 버전이 낮으면 `UNSUPPORTED_APP_VERSION` 에러를 던집니다. `shared/lib/appsInToss/errors.ts`에서 앱 공통 에러로 바꿔 "토스 앱을 업데이트해 주세요" 안내로 연결합니다.
- 상단 내비게이션 바(앱 이름, 더보기, 닫기)는 토스가 그립니다. **직접 만들지 않습니다.** 앱이 추가할 수 있는 기능 버튼은 최대 1개(하트)이고, 등록은 `app/bootstrap/`에서 래퍼를 통해 한 번만 합니다.
- **진입 직후 바텀시트를 자동으로 띄우지 않습니다.** 알림 동의(`Notification.requestAgreement`)는 사용자가 [알림받기] 버튼을 눌렀을 때만 호출합니다.
- **권한(사진, 카메라)을 거부해도 나머지 기능은 동작해야 합니다.** 인증의 사진 항목은 선택 입력으로 둡니다.
- 공유 링크는 `intoss://` 스킴만 씁니다. `intoss-private://`를 쓰면 반려됩니다.
- **SDK를 짧은 시간에 반복 호출하지 않습니다.** 톡톡 햅틱은 `shared/lib/appsInToss/haptic.ts`에서 최소 간격을 두고, 서버 시간(`Environment.getServerTime`)은 앱 시작 시 한 번만 받아 시간 차이로 계산합니다.

## 설정 파일 (`apps-in-toss.config.ts`)

- 설정 파일 이름은 `apps-in-toss.config.ts`입니다 (SDK 3.x). `granite.config.ts`는 2.x 시절 파일이라 만들지 않습니다.
- `brand.primaryColor`는 문서상 deprecated지만 SDK 3.9.0의 `ait build`가 필수로 검사합니다. 지우지 않습니다.
- 권한(`permissions`)은 그 권한을 쓰는 기능을 구현하는 PR에서 함께 추가합니다. 선언된 권한은 검수에 쓰이므로, 쓰지 않는 권한은 선언하지 않습니다.
  - 예정: `photos: read`(인증 사진), `clipboard: write`(초대 링크 복사), `camera: access`(디자인에 카메라 촬영이 확정될 때만 🔖)
- 설정을 바꾸면 `vite build`가 아니라 `pnpm build` 전체(`tsc -b && vite build && ait build`)로 검증합니다.

## 기기 저장 (`Storage`)

- 기기 저장은 토스 계정과 동기화되지 않고 기기를 바꾸면 사라집니다. 사라져도 되는 편의 값만 저장합니다.
- 기기 저장 대상: 마지막으로 본 방 ID(방 목록에 없으면 첫 번째 방으로 대체), 알림 안내 카드 닫음 여부.
- 알림 동의 여부만 조회하는 API는 없습니다. 동의 결과는 서버에 기록하되, 토스 앱 설정에서 바뀔 수 있으므로 현재 동의 상태로 확정하지 않습니다.

## UI/UX 가이드 (검수 기준)

- 다이얼로그 왼쪽 버튼 문구는 [취소]가 아니라 [닫기]로 씁니다.
- '~시겠어요?', '~께' 같은 과도한 경어를 쓰지 않습니다. 모든 문구는 해요체입니다.
- 하단 탭바는 토스가 제공하는 플로팅 형태를 유지하고, 탭은 2~5개만 씁니다. 🔖 Figma `Nav.TabBar`가 이 형태와 맞는지 디자이너 확인 필요
