---
paths:
  - "src/**/*.{ts,tsx}"
---

# 코드 규칙

레이어는 `app > pages > widgets > features > entities > shared` 순서입니다. 의존 방향, 슬라이스 간 import, 배럴 경유는 `pnpm lint`가 막습니다. 걸리면 우회하지 않고 구조를 고칩니다. 공통 로직은 `entities`나 `shared`로 내리고, 조합은 `widgets` 이상에서 합니다. 위치가 애매하면 `find-code-location` 스킬을 씁니다.

## Import

- 같은 슬라이스 안은 상대경로(`../model/...`), 경계를 넘으면 `@/` + 배럴(`@/features/vote/castVote`)을 씁니다.
- `index.ts`에는 외부에서 실제로 쓰는 항목만 재노출합니다. 컴포넌트는 `export { default as Name } from "./ui/Name";`, named export는 `export { name } from "./model/name";`, 파일 통째는 `export * from "./config/name";`로 내보냅니다.

## 이름

- 폴더는 `camelCase`입니다. `use`로 시작하는 폴더명은 훅으로 오해받으니 피합니다(`useShield` 대신 `applyShield`).
- 컴포넌트는 `PascalCase`, 파일명과 일치, 화살표 함수 + `export default`입니다. 라우트 페이지는 `Page`, 바텀시트는 `Sheet`, 다이얼로그는 `Dialog`로 끝냅니다.
- `.ts` 파일은 `camelCase`, 훅은 `use`로 시작합니다(`formatWon.ts`, `useCastVote.ts`).
- `config/`의 상수는 `SNAKE_CASE`로 내보냅니다.

## 타입

- `any` 금지입니다. 불가피하면 `unknown` + 타입 가드를 씁니다.
- API 응답과 도메인 타입은 슬라이스의 `model/types.ts`에 둡니다. 여러 슬라이스가 공유하는 범용 타입만 `shared/types`로 올립니다.
- props 타입은 컴포넌트 파일 상단에 `interface {ComponentName}Props`로 선언합니다.
- 같은 타입을 레이어마다 중복 정의하지 않고, 상위 레이어가 하위 타입을 import해 확장합니다.
- 상태가 여러 갈래인 화면은 판별 유니온 + 순수 함수로 만듭니다. 투표 탭의 9가지 화면은 `entities/vote/lib/getVoteView.ts`가 `VoteView`를 반환하고 위젯은 `switch (view.kind)`만 합니다.
