/**
 * 목탁을 한 번 치는 동작이에요. 앞 탭과의 간격을 그대로 동작 길이로 써서,
 * 빠르게 치면 짧고 날카롭게, 천천히 치면 크게 휘둘러요.
 */
export const STRIKE = {
  /** 아무리 빨리 연타해도 이보다 짧아지지 않아요. */
  minMs: 140,
  /** 천천히 칠 때와 첫 번째 탭의 길이예요. */
  maxMs: 380,
  /**
   * 방망이가 목탁에 닿는 시점(동작 길이 대비)이에요. 소리와 햅틱은 누르는 즉시 나서,
   * 화면도 거의 바로(25~70ms) 닿도록 앞쪽에 둬요.
   */
  impactAt: 0.18,
} as const;

/**
 * 칠 때마다 울리는 햅틱 종류예요. `tap`은 실기기에서 거의 느껴지지 않아 한 단계 강한 짧은 종류를 써요.
 * 종류는 SDK 문서(Device.triggerHaptic)의 `HapticFeedbackType`이에요. 더 강하게 하려면 `basicMedium`을 시험해요.
 */
export const STRIKE_HAPTIC = "tickMedium";

/** 앞 탭과의 간격(ms)으로 이번 동작의 길이를 정해요. */
export const getStrikeMs = (intervalMs: number) =>
  Math.min(STRIKE.maxMs, Math.max(STRIKE.minMs, intervalMs));

/** 내려칠 때는 가속하고, 맞은 뒤에는 감속하며 돌아와요. */
export const STRIKE_EASING = {
  down: "cubic-bezier(0.55, 0, 0.9, 0.4)",
  back: "cubic-bezier(0.2, 0.8, 0.3, 1)",
} as const;

/**
 * 시안(이마톡톡-목탁 01 → 02)의 쉬는 자세와 친 순간이에요.
 * 방망이는 기울기 32° → -40°, 크기 80×336 → 56×236(0.7배)이고 중심이 왼쪽 위로 옮겨져요.
 * 목탁은 382 → 428(1.12배)로 커지고 투명도 0.8이 돼서 뒤쪽 물결이 비쳐요.
 */
export const POSE = {
  mallet: {
    rest: { transform: "translate(0px, 0px) rotate(32deg) scale(1)" },
    hit: { transform: "translate(-63.65px, -34.28px) rotate(-40deg) scale(0.7)" },
  },
  moktak: {
    rest: { transform: "rotate(15deg) scale(1)", opacity: 1 },
    hit: { transform: "rotate(14deg) scale(1.12)", opacity: 0.8 },
  },
} as const;

/**
 * 연못에 돌을 던진 것처럼 칠 때마다 목탁 뒤에서 보라색 물결이 퍼져요.
 * 물결 한 겹은 시안의 가장 큰 빛(지름 598)을 0.3배로 줄여 목탁 뒤에 숨겨 두었다가,
 * 시안 크기(1배)에 닿을 때까지 시안 색 그대로 진하게 퍼지고 그 뒤 1.15배까지 번지며 사라져요.
 * 세 겹이 시간차를 두고 뒤따라서 퍼지는 동안 시안처럼 세 겹이 겹쳐 보여요.
 * 연타하면 앞 물결이 끝나기 전에 새 물결이 겹쳐 이어져요.
 */
export const RIPPLE = {
  /** 물결 한 겹이 퍼져 사라지기까지예요. 치는 속도와 상관없이 같아요. */
  durationMs: 1100,
  /** 세 겹이 앞 겹을 뒤따르는 간격이에요. 첫 겹이 598에 닿을 때 시안처럼 498, 408 크기가 되게 맞췄어요. */
  followMs: [0, 75, 130],
  /** 동시에 남겨 두는 물결 수예요. 넘으면 가장 오래된 것부터 지워 연타해도 쌓이지 않아요. */
  maxWaves: 12,
  /** 물이 퍼지듯 처음엔 빠르고 바깥으로 갈수록 느려져요. */
  easing: "cubic-bezier(0.2, 0.6, 0.35, 1)",
  keyframes: [
    { transform: "scale(0.3)", opacity: 1 },
    { transform: "scale(1)", opacity: 1, offset: 0.6 },
    { transform: "scale(1.15)", opacity: 0 },
  ],
} as const;
