/** 밥더미로 떨어지는 쌀알 수와 간격이에요. 한 알이 합쳐질 때마다 밥더미가 조금씩 커져요. */
export const RICE_DROP_COUNT = 24;
export const RICE_DROP_INTERVAL_MS = 110;
export const RICE_FALL_MS = 850;
/** 닿은 쌀알이 밥더미에 묻히듯 합쳐지는 시간이에요. */
export const RICE_MERGE_MS = 280;
/** 밥더미가 시안 크기의 이 비율에서 시작해 아래를 축으로 커져요. 처음엔 흰 그라데이션 바로 위로 낮은 봉우리만 보여요. */
export const PILE_START_SCALE = 0.78;
/** 쌀이 다 쌓인 뒤 4등 → 3등 → 2등 → 1등 순서로 나와요. */
export const RANK_REVEAL_START_MS = 150;
export const RANK_REVEAL_INTERVAL_MS = 320;
