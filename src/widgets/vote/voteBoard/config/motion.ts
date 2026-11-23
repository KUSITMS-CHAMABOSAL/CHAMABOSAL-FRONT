// 투표하러 가기 화면(시안 투표-02)의 후보 미리보기 움직임이에요.
// Figma 프로토타입은 0.4초 쉬고 4초 동안 EASE_OUT_BACK으로 왼쪽으로 한 번 흘러가 멈춰요.
// 쉬지 않고 같은 움직임을 반대 방향으로도 해서 왕복을 계속 되풀이해요. 시간과 곡선은 src/app/styles/index.css의 --animate-vote-reel에 있어요.

/** 카드 중심 사이 거리예요. 시안 카드 간격(209~232px)의 평균이에요. */
export const REEL_PITCH_PX = 220;

/** 한 번에 흘러가는 카드 수예요. 시안 1159px에 가장 가깝고, 멈출 때 카드가 가운데에 와요(220 × 5 = 1100px). */
export const REEL_STEPS = 5;

/** 끝까지 흘러가도 오른쪽이 비지 않도록 그리는 최소 카드 수예요. */
export const REEL_MIN_CARDS = REEL_STEPS + 3;

/** 카드마다 기울기(도)와 높이 차이(px)예요. 시안처럼 4장마다 반복해요. */
export const REEL_TILTS = [
  { rotate: 2, y: 8 },
  { rotate: -4, y: 0 },
  { rotate: 2, y: 8 },
  { rotate: -3, y: 1 },
] as const;
