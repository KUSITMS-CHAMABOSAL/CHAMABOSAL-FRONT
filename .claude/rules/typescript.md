---
paths:
  - "src/**/*.{ts,tsx}"
---

# TypeScript 규칙

- `any` 사용 금지. 불가피하면 `unknown` + 타입 가드로 처리합니다.
- API 응답/도메인 데이터 타입은 해당 슬라이스의 `model/types.ts`에 정의합니다.
- 여러 슬라이스에서 공유되는 범용 타입만 `shared/types`로 올립니다.
- 컴포넌트 props 타입은 컴포넌트 파일 상단에 `interface {ComponentName}Props`로 선언합니다.
- 여러 레이어에 걸쳐 같은 타입을 중복 정의하지 않습니다. 상위 레이어가 하위 레이어의 타입을 import해서 확장하는 방향으로 갑니다 (레이어 의존 규칙 준수).
- 상태가 여러 갈래로 나뉘는 화면은 **판별 유니온 + 순수 함수**로 만듭니다. 예: 투표 탭의 9가지 화면은 `entities/vote/lib/getVoteView.ts`가 `VoteView`(`{ kind: 'locked' } | { kind: 'voting', ... } | ...`)를 반환하고, 위젯은 `switch (view.kind)`만 합니다.
