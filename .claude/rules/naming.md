---
paths:
  - "src/**"
---

# 네이밍 규칙

## 폴더명

- 소문자로 시작하는 `camelCase`를 사용합니다.
- 예: `createRoom`, `submitCertification`, `todayBosals`

## 컴포넌트명 (`.tsx`)

- 대문자로 시작하는 `PascalCase`를 사용합니다.
- 컴포넌트명과 파일명을 일치시킵니다. (`BosalImage.tsx` 안의 컴포넌트명도 `BosalImage`)
- 라우트 페이지는 `Page`, 바텀시트는 `Sheet`, 다이얼로그는 `Dialog`로 끝냅니다. (`HomePage`, `VoteConfirmSheet`, `KickConfirmDialog`)
- 화살표 함수로 작성합니다.

```tsx
const BosalStatusBadge = ({ status }: BosalStatusBadgeProps) => {
  return <Badge>...</Badge>;
};

export default BosalStatusBadge;
```

## `.ts` 파일명 (hook, util 등)

- 소문자로 시작하는 `camelCase`를 사용합니다.
- 훅은 반드시 `use`로 시작해서 내보냅니다.
- 예: `formatWon.ts`, `getVoteView.ts`, `useCastVote.ts`

## 아이콘

- 파일명은 소문자로 작성합니다. 필요 시 `snake_case`를 허용합니다.
- 네이밍 규칙: `icon_{모양}_{방향(화살표인 경우)}_{fill|regular|thin}.svg`
  - 예: `icon_home_fill.svg`, `icon_home_regular.svg`, `icon_vote_fill.svg`
- 폴더의 `index.ts`에서는 파일명을 그대로 쓰지 않고, 컴포넌트 형태로 변환해서 내보냅니다.
  - `icon_home_regular.svg` → `HomeIcon`으로 export
  - `icon_arrow_left_fill.svg` → `ArrowLeftIcon`으로 export
- 사용하는 쪽에서는 컴포넌트처럼 불러와서 Tailwind 클래스로 색상/크기를 조절합니다.

```tsx
<HomeIcon className="size-6 text-gray-900" />
```
