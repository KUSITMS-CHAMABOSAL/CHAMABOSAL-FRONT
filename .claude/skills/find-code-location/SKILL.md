---
name: find-code-location
description: 새 파일, 컴포넌트, 훅, 슬라이스를 어느 FSD 레이어와 폴더에 둘지 판단할 때 사용합니다. 레이어 판별법, role 목록, 슬라이스 내부 구조, 목표 폴더 구조를 제공합니다.
---

# 코드 위치 판단

FSD 규칙은 `src/` 안에만 적용합니다. `processes` 레이어는 쓰지 않고, 빌드는 `dist`만 쓰므로 내부 구조는 배포에 영향이 없습니다.

## 레이어 고르기

위에서부터 처음 "예"가 나오는 곳에 둡니다.

| 질문                                                                             | 레이어     | 예                                         |
| -------------------------------------------------------------------------------- | ---------- | ------------------------------------------ |
| 도메인과 무관해서 다른 프로젝트에 그대로 복사해도 말이 되는가?                   | `shared`   | `cn`, `EmptyState`, 앱인토스 래퍼          |
| 사용자 행동 없이, 그 객체가 존재한다는 사실만으로 필요한가? (명사)               | `entities` | 보살 이미지, 인증 카드, 방 조회 쿼리       |
| 클릭·입력이 상태 변화나 서버 요청으로 이어지고 특정 화면·역할에 묶이는가? (동사) | `features` | 인증 폼, 투표하기, 내보내기, 구매하기      |
| 여러 `features`, `entities`를 한 화면 영역으로 배치만 하는가?                    | `widgets`  | 홈의 오늘의 보살들, 곳간 아이템 상점       |
| 라우트 경로에 대응되는 화면 자체인가?                                            | `pages`    | `HomePage`                                 |
| 앱 초기화나 전역 설정인가? (Provider, 라우터, 앱 시작 처리, 전역 스타일)         | `app`      | `TDSMobileAITProvider`, 하단 탭바 레이아웃 |

넣지 않는 것: `shared`에 보살·방·인증 같은 도메인 지식, `entities`에 클릭 시 상태를 바꾸거나 서버 변경을 요청하는 로직, `features`에 여러 화면을 아우르는 레이아웃, `widgets`에 라우팅, `pages`에 조회·mutation과 재사용 UI, `app`에 특정 화면 전용 코드.

## entities와 features가 헷갈릴 때

- 지워도 그 객체 개념이 서비스에 남으면 `entities`, 지우면 그 행동이 사라지면 `features`입니다.
- `entities`는 데이터 모델, 기본 조회, 표시용 UI만 갖고 여러 곳에서 공통 참조됩니다. 클릭 동작이 없습니다.
- `features`는 폼, 도메인 로직, 행동 UI를 갖고 특정 화면·역할에 종속됩니다.
- 조합 패턴: `entities/item`의 `ItemCard`는 표시만 하고 버튼 자리를 `action` 슬롯으로 비웁니다. `features/storehouse/buyItem`의 `BuyItemButton`이 mutation을 갖고, `widgets`가 둘을 조합합니다.
- 두 행동을 한 화면에 놓아야 하면 서로 import하지 않고 `widgets`에서 조합합니다.

## 경로

`features/{role}/{featureName}`, `widgets/{role}/{sectionName}`, `entities/{objectName}` 형태입니다. 이름은 실제로 하는 일(동사 + 목적어)로 짓고, `entities`는 역할 없이 객체 단위로만 나눕니다. `{role}`이 다르면 이름이 같아도 다른 슬라이스입니다.

## 슬라이스 내부

필요한 폴더만 만듭니다.

| 폴더      | 용도                               | 파일명                         |
| --------- | ---------------------------------- | ------------------------------ |
| `ui/`     | 컴포넌트 (`entities`는 표시용만)   | `BosalImage.tsx`               |
| `api/`    | 서버 요청 함수, Query 키/옵션      | `roomApi.ts`, `roomQueries.ts` |
| `model/`  | 상태, 커스텀 훅, 타입, 목업 데이터 | `useSubmitCertification.ts`    |
| `lib/`    | 부수효과 없는 순수 유틸            | `getVoteView.ts`               |
| `config/` | 상수, 메시지, 설정값               | `export const MAX_MEMBERS = 4` |
| `assets/` | 슬라이스 전용 이미지·SVG           | 소문자, `snake_case` 허용      |

role 목록, 비즈니스 상수, 목표 폴더 구조는 `references/map.md`를 읽습니다. 아직 없는 슬라이스를 만들 때나 이름을 정할 때 확인합니다.
