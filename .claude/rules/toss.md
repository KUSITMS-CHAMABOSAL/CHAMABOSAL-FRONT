---
paths:
  - "src/shared/lib/appsInToss/**"
  - "src/app/bootstrap/**"
  - "src/shared/config/deepLinks.ts"
  - "src/features/**"
  - "apps-in-toss.config.ts"
---

# 앱인토스 SDK 규칙

SDK는 3.x이고 `@apps-in-toss/web-framework`는 `shared/lib/appsInToss/`에서만 import합니다. 나머지는 `@/shared/lib/appsInToss` 래퍼를 씁니다. `pnpm lint`가 막으며 `app/bootstrap`도 예외가 아닙니다.

## 래퍼

- 사용자 행동에 묶인 SDK 기능은 `features`가 래퍼를 호출합니다(`features/room/shareInvite` → `shareLink()`, `features/settings/notificationSetting` → `requestNotificationAgreement()`).
- 로그인은 서버 스펙(`POST /api/auth/login`)대로 익명 키 인증 코드(`User.createAnonymousKeyAuthCode`)를 씁니다. 토스 로그인(`TossAuth.login`)과 `getAnonymousKey` 값 직접 전송은 쓰지 않습니다. 사용자 행동이 아니라 앱 시작과 첫 API 요청에 묶여 있어 `app/bootstrap/auth.ts`가 래퍼를 호출하고, `features/auth` 슬라이스는 만들지 않습니다.
- 토스 앱 밖에서 실행될 때의 처리도 래퍼 안에서 끝냅니다.
  - 로컬 개발은 `@apps-in-toss/devtools`가 SDK를 목으로 대체합니다. 래퍼에 목을 따로 쓰지 않습니다.
  - 지원하지 않는 앱 버전이나 브릿지 호출 실패는 래퍼가 잡아 앱 공통 에러나 fallback 값으로 바꿉니다.

## API

- SDK 3.x의 도메인 객체 API를 씁니다(`Device.openCamera`, `Share.createLink`, `User.getAnonymousKey`). 개별 함수(`openCamera`, `getTossShareLink`)는 deprecated입니다.
- 앱 버전이 낮으면 `UNSUPPORTED_APP_VERSION`을 던집니다. `shared/lib/appsInToss/errors.ts`에서 공통 에러로 바꿔 "토스 앱을 업데이트해 주세요" 안내로 연결합니다.
- SDK를 짧은 시간에 반복 호출하지 않습니다. 톡톡 햅틱은 `shared/lib/appsInToss/haptic.ts`에서 최소 간격을 두고, 서버 시간(`Environment.getServerTime`)은 앱 시작 시 한 번만 받아 시간 차이로 계산합니다.

## 딥링크

- 딥링크(`intoss://chamabosal/...`)로 진입할 수 있는 경로는 `shared/config/deepLinks.ts`에만 정의합니다. 초대 링크를 만드는 `features/room/shareInvite`도 이 파일을 씁니다. 코드에 링크 문자열을 직접 쓰지 않습니다.
- 이 목록은 콘솔 '앱 내 기능'에 등록할 스킴 목록과 같아야 합니다.
- 공유 링크는 `intoss://` 스킴만 씁니다. `intoss-private://`는 반려됩니다.

## 설정

- 설정 파일은 `apps-in-toss.config.ts`입니다. `granite.config.ts`는 2.x 파일이라 만들지 않습니다.
- `brand.primaryColor`는 문서상 deprecated지만 SDK 3.9.0의 `ait build`가 필수로 검사합니다. 지우지 않습니다.
- 권한(`permissions`)은 그 권한을 쓰는 기능의 PR에서 함께 추가합니다. 선언된 권한은 검수에 쓰이므로 쓰지 않는 권한은 선언하지 않습니다.
  - 예정: `photos: read`(인증 사진), `clipboard: write`(초대 링크 복사), `camera: access`(디자인에 카메라 촬영이 확정될 때만 🔖)
- 설정을 바꾸면 `vite build`가 아니라 `pnpm build` 전체(`tsc -b && vite build && ait build`)로 검증합니다.

## 기기 저장

- `Storage`는 토스 계정과 동기화되지 않고 기기를 바꾸면 사라집니다. 사라져도 되는 편의 값만 저장합니다.
- 저장 대상: 마지막으로 본 방 ID(방 목록에 없으면 첫 번째 방으로 대체), 알림 안내 카드 닫음 여부.
- 알림 동의 여부만 조회하는 API는 없습니다. 동의 결과는 서버에 기록하되, 토스 앱 설정에서 바뀔 수 있으므로 현재 상태로 확정하지 않습니다.
