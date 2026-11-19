/**
 * 이마 톡톡 화면의 배치예요. 시안(결과·이마톡톡-01, 375×812)에서 토스가 그리는 상단 바(94px)를 뺀 좌표예요.
 * 빛과 보살은 화면 가운데 세로선에 맞춰 그려요.
 */
export const STAGE = {
  /** 빛 원들의 중심 높이예요. */
  glowCenterY: 323,
  /** 보살 그림의 위쪽 끝이에요. 툴팁 꼬리도 여기를 가리켜요. */
  bosalTop: 220,
  /** 횟수와 문구 묶음의 위쪽 끝이에요. */
  countTop: 292,
} as const;

/** 보살 그림(머리부터 몸까지)의 크기와 안쪽 얼굴 위치예요. */
export const BOSAL = {
  width: 433,
  height: 684,
  face: { left: 123.5, top: 234.39, width: 193.507, height: 161.947 },
  /** 친 순간 시안-02에서 476×752로 커져요. 위쪽은 36px 올라가고 아래쪽은 32px 내려가는 기준점이에요. */
  pressedScale: 476 / 433,
  origin: "216.5px 362px",
} as const;

export type GlowKind = "base" | "teal" | "gold";

interface Glow {
  kind: GlowKind;
  /** 쉬는 상태(시안-01)의 지름이에요. */
  size: number;
  /** 친 순간(시안-02)의 지름이에요. */
  pressedSize: number;
  /** 쉬는 상태에는 보이지 않다가 친 순간에만 나타나는 원이에요. */
  pressedOnly?: boolean;
}

/** 빛 원들이에요. 아래부터 그리고, 첫 원만 보살 뒤에 깔려요. */
export const GLOWS: readonly Glow[] = [
  { kind: "base", size: 432, pressedSize: 406 },
  { kind: "teal", size: 336, pressedSize: 570 },
  { kind: "teal", size: 240, pressedSize: 264 },
  { kind: "gold", size: 240, pressedSize: 334 },
  { kind: "gold", size: 478, pressedSize: 478, pressedOnly: true },
];

/**
 * 친 순간 시안-02 모양으로 커졌다가 시안-01로 돌아오는 시간이에요.
 * 🔖 시안에 시간이 없어 목탁 타격과 비슷한 길이로 뒀어요. 프로토타입 값을 받으면 맞춰요.
 */
export const PULSE = {
  durationMs: 420,
  /** 커지는 데 쓰는 비율이에요. 나머지 동안 천천히 돌아와요. */
  peakAt: 0.3,
} as const;

/** 시안 주석: 툴팁 토스트로 2000ms 노출 */
export const TOOLTIP_MS = 2000;
