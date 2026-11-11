---
paths:
  - "src/**/*.{tsx,css}"
  - "src/**/assets/**"
---

# UI 규칙

## 무엇으로 만들지

1. TDS에 있으면 TDS를 씁니다(`Top`, `TextField`, `TextArea`, `FixedBottomCTA`, `BottomSheet`, `ConfirmDialog`, `Toast`, `Badge`, `NumericSpinner`, `NumberKeypad`, `SegmentedControl`, `Tab`, `Switch`, `ListRow`, `TableRow`, `ProgressBar`, `Bubble` 등). TDS를 감싸기만 하는 래퍼는 만들지 않습니다.
2. 없으면 해당 슬라이스의 `ui/`에서 Tailwind로 만듭니다(보살 캐릭터, 하단 탭바, 투표 캐러셀, 단상, 톡톡 인터랙션, 인증 캘린더 등).
3. Emotion은 TDS 내부 의존성입니다. 앱 코드에서 `css`, `styled`를 쓰지 않습니다.

## Tailwind

- 유틸리티 클래스만 씁니다. 컴포넌트별 `.css`, `.module.css`를 만들지 않습니다.
- `style={{ ... }}` 금지입니다. 예외는 동적 값을 CSS 변수로 넘길 때뿐입니다: `className="w-(--progress)"` + `style={{ "--progress": value }}`
- 조건부 클래스는 항상 `shared/lib/cn.ts`의 `cn`으로 조합합니다. 문자열 템플릿이나 삼항을 이어붙이지 않습니다.
- `w-[123px]` 같은 arbitrary value는 정말 필요할 때만 씁니다. 기본 스케일로 표현되면 스케일 클래스를 씁니다(16px → `p-4`).
- 조건부 스타일이 복잡한 컴포넌트는 `shared/ui`가 아니라 슬라이스의 `ui/`에 두고 슬라이스 전용 variant로 관리합니다.
- TDS 전역 CSS와 Emotion 스타일은 레이어 밖이라 Tailwind 유틸리티를 이깁니다. 안 먹으면 `!`를 붙입니다(`overflow-visible!`, `m-0!`, `button`의 `rounded-lg!`, `Paragraph` 안 `span`의 색).
- 색 변수는 `text-(color:--adaptiveBlue600)`처럼 타입을 밝힙니다. `text-(--변수)`는 색으로 적용되지 않을 수 있습니다.
- preflight가 없어 직접 만든 `button`, `ol`에 브라우저 기본 배경·테두리·여백이 남습니다. `button`은 `appearance-none border-0 bg-transparent p-0`로 지웁니다. `ol`은 여백만 `m-0! p-0!`로 지우고, 순서 번호가 필요하면 `list-decimal`을 씁니다. 번호를 숨기려고 `list-none`을 쓰면 일부 스크린 리더가 목록으로 읽지 않으니 `role="list"`를 함께 붙입니다.
- 요소마다 CSS 변수를 받는 `@theme` 애니메이션은 `@theme inline`에 둡니다. 그냥 `@theme`의 `var()`는 `:root`에서 풀려 기본값이 됩니다.

## 앱인토스 검수 기준

- 라이트 모드만 지원합니다. `color-scheme: light`로 고정하고 다크 모드 스타일을 쓰지 않습니다.
- 11px 미만 텍스트를 쓰지 않습니다. 디자인에 있으면 디자이너와 조정합니다.
- 하단 탭바와 하단 CTA는 safe area를 반영합니다(`SafeArea` SDK 또는 TDS `FixedBottomCTA`).
- 상단 내비게이션 바는 토스가 그립니다. 직접 만들지 않습니다. 기능 버튼은 최대 1개(하트)이고 등록은 `app/bootstrap/`에서 래퍼로 한 번만 합니다.
- 하단 탭바는 토스 플로팅 형태를 유지하고 탭은 2~5개만 씁니다.
- 진입 직후 바텀시트를 자동으로 띄우지 않습니다. 알림 동의(`Notification.requestAgreement`)는 [알림받기] 버튼을 눌렀을 때만 호출합니다.
- 사진·카메라 권한을 거부해도 나머지 기능은 동작해야 합니다. 인증의 사진은 선택 입력입니다.

## 문구

- 모든 문구는 해요체입니다. '~시겠어요?', '~께' 같은 과도한 경어를 쓰지 않습니다.
- 다이얼로그 왼쪽 버튼은 [취소]가 아니라 [닫기]입니다.

## 아이콘

- 파일명은 `icon_{모양}_{방향(화살표만)}_{fill|regular|thin}.svg`입니다(`icon_home_fill.svg`, `icon_arrow_left_fill.svg`). 소문자이고 `snake_case`를 허용합니다.
- 폴더의 `index.ts`에서 컴포넌트 형태로 내보냅니다(`icon_home_regular.svg` → `HomeIcon`, `icon_arrow_left_fill.svg` → `ArrowLeftIcon`).
- 쓰는 쪽에서 Tailwind 클래스로 색과 크기를 조절합니다: `<HomeIcon className="size-6 text-gray-900" />`
