# index.html 핀치 줌 미차단

## 무엇이 다른지

- 기대값: 지도처럼 꼭 필요한 경우를 제외하고 제스처 확대·축소가 비활성화되어 있어야 합니다(비게임 출시 가이드).
- 실제 값: `index.html`의 viewport가 `width=device-width, initial-scale=1.0`이라 막혀 있지 않습니다. 앱인토스 문서에 따르면 기본값은 차단이 아니고, `apps-in-toss.config.ts`의 `webView` 옵션에도 관련 설정이 없습니다.

## 어디서 확인했는지

- `index.html` 6번째 줄
- `visual-aesthetics-qa` 스킬의 `scripts/page-audit.js` 측정값 `pinchZoomBlocked: false`
- [비게임 출시 가이드](https://developers-apps-in-toss.toss.im/checklist/app-nongame.md), [WebView 속성 제어하기](https://developers-apps-in-toss.toss.im/documentation/integration/props.md)

## 왜 지금 우리 코드에서 고치면 안 되는지

코드 문제이고 고치기는 쉽지만, 에이전트 세팅 PR과 목적이 달라 이슈 1개 = PR 1개 규칙에 따라 분리했습니다. 실제 차단 여부는 브라우저로 확인할 수 없어 QR 실기기 검증이 함께 필요합니다.

## 언제/누가 해결해야 하는지

- 프론트엔드 담당자가 출시 검수 전에 별도 이슈로 처리합니다.
- 수정 값은 문서 기준 `width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no`입니다.
- iOS와 Android 토스 앱에서 두 손가락 확대가 막히는지 확인하고 이 문서를 지웁니다.
