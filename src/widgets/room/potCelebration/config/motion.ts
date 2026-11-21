/** 밥더미로 떨어지는 쌀알 수와 간격이에요. 한 알이 합쳐질 때마다 밥더미가 조금씩 커져요. */
export const RICE_DROP_COUNT = 24;
export const RICE_DROP_INTERVAL_MS = 110;
export const RICE_FALL_MS = 850;
/** 닿은 쌀알이 밥더미에 묻히듯 합쳐지는 시간이에요. */
export const RICE_MERGE_MS = 280;
/** 밥더미가 시안 크기의 이 비율에서 시작해 아래를 축으로 커져요. 처음엔 흰 그라데이션 바로 위로 낮은 봉우리만 보여요. */
export const PILE_START_SCALE = 0.78;

/**
 * Figma 프로토타입(인증-공양미가득-01 → 05)의 순위 등장 값이에요.
 * 앞 단계가 다 나오면 `waitMs`만큼 기다렸다가 0.3초 동안 `risePx` 아래에서 올라오며 나타나요(Smart Animate).
 * 플러그인 API는 이징 프리셋 이름만 줘서, 곡선 값은 Figma 프리셋 값을 옮겼어요.
 */
export const RANK_REVEAL_MS = 300;
const EASE_OUT = "cubic-bezier(0, 0, 0.58, 1)";
const EASE_OUT_BACK = "cubic-bezier(0.45, 1.45, 0.8, 1)";
/** 4등 이하 줄 → 3등 → 2등 → 1등 순서예요. */
export const RANK_REVEAL_STEPS = [
  { waitMs: 400, risePx: 0, easing: EASE_OUT },
  { waitMs: 400, risePx: 26, easing: EASE_OUT_BACK },
  { waitMs: 400, risePx: 46, easing: EASE_OUT_BACK },
  { waitMs: 600, risePx: 25, easing: EASE_OUT_BACK },
] as const;
