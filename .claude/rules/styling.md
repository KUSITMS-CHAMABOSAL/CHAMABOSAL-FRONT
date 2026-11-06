---
paths:
  - "src/**/*.{ts,tsx,css}"
---

# 스타일링 규칙

## 무엇으로 만들지 고르는 순서

1. **TDS에 있으면 TDS를 씁니다.** `Top`, `TextField`, `TextArea`, `FixedBottomCTA`, `BottomSheet`, `ConfirmDialog`, `Toast`, `Badge`, `NumericSpinner`, `NumberKeypad`, `SegmentedControl`, `Tab`, `Switch`, `ListRow`, `TableRow`, `ProgressBar`, `Bubble` 등. TDS를 감싸기만 하는 래퍼 컴포넌트는 만들지 않습니다.
2. TDS에 없으면 해당 슬라이스의 `ui/`에서 **Tailwind로 직접 만듭니다.** (보살 캐릭터, 하단 탭바, 투표 캐러셀, 단상, 톡톡 인터랙션, 인증 캘린더 등)
3. Emotion은 TDS가 내부적으로 사용하는 의존성입니다. **앱 코드에서는 Emotion(`css`, `styled`)을 쓰지 않습니다.**

## Tailwind 사용 규칙

- 컴포넌트 스타일은 Tailwind 유틸리티 클래스만 사용합니다. 컴포넌트별 `.css`/`.module.css` 파일을 만들지 않습니다.
- **인라인 스타일(`style={{ ... }}`) 금지.** 유일한 예외는 동적 값을 CSS 변수로 넘기는 경우입니다. 이때도 스타일 자체는 클래스에서 정의합니다.
- 조건부/가변 클래스는 문자열 템플릿이나 삼항 연산자를 직접 이어붙이지 말고, 항상 **`clsx` + `tailwind-merge`로 만든 `cn` 유틸**을 통해 조합합니다. `cn`은 `shared/lib/cn.ts`에 한 곳에만 정의하고 전 레이어에서 이걸 import해서 씁니다.

인라인 스타일 예외 예시:

```tsx
// ✅ 허용: 값만 CSS 변수로 넘기고, 스타일은 클래스로
<div
  className="w-(--progress) bg-blue-500"
  style={{ "--progress": `${percent}%` } as React.CSSProperties}
/>

// ❌ 금지: 스타일 속성을 직접 작성
<div style={{ width: `${percent}%`, background: "#3182f6" }} />
```

`cn` 정의:

```tsx
// shared/lib/cn.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
```

```tsx
// ✅ cn으로 조합
<div className={cn("rounded-lg p-4", isSelected && "bg-blue-50", className)} />

// ❌ 직접 문자열 이어붙이기 금지
<div className={`rounded-lg p-4 ${isSelected ? "bg-blue-50" : ""} ${className}`} />
```

## arbitrary value

- `w-[123px]`, `text-[15px]` 같은 arbitrary value는 정말 필요할 때만 예외적으로 사용합니다. 값이 Tailwind 기본 스케일로 표현 가능하면 반드시 스케일 클래스를 씁니다.
  - 예: 간격 16px → `p-4`
- 조건부 스타일 로직이 복잡해지는 컴포넌트는 `shared/ui`가 아니라 해당 슬라이스의 `ui/`에 두고, 그 슬라이스 전용 variant로 관리합니다.

## 앱인토스 화면 규칙

- **라이트 모드만 지원합니다.** `color-scheme: light`로 고정하고 다크 모드 스타일을 작성하지 않습니다 (검수 항목).
- **11px 미만 텍스트를 쓰지 않습니다.** 디자인에 11px 미만 텍스트가 있으면 디자이너와 조정합니다.
- 하단 탭바와 하단 CTA는 safe area를 반영합니다 (`SafeArea` SDK 또는 TDS `FixedBottomCTA`).
