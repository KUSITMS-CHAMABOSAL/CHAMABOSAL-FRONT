/** 시안 좌표계(`STAGE`)의 정사각형 자리예요. */
interface Box {
  x: number;
  y: number;
  size: number;
}

/** 끝 자리(to)에 그려 둔 요소를 시작 자리(from)로 옮기는 transform이에요. 기준점은 왼쪽 위예요. */
const placeAt = (from: Box, to: Box) =>
  `translate(${from.x - to.x}px, ${from.y - to.y}px) scale(${from.size / to.size})`;

export const AT_REST = "translate(0px, 0px) scale(1)";

/** 02 → 03 봉투(✉️ 봉투)예요. 51px에서 222px로 커지며 올라가요. */
const ENVELOPE_START: Box = { x: 162, y: 266, size: 51 };
export const ENVELOPE_END: Box = { x: 77, y: 14, size: 222 };
export const ENVELOPE_FROM = placeAt(ENVELOPE_START, ENVELOPE_END);

/** 02 → 03 카드(Frame 73)의 윗변이 내려오는 거리예요. 131 → 254, 안의 그림은 제자리예요. */
export const CARD_REVEAL = 123;

/**
 * 06 → 07 이마 물결이에요. 같은 이름의 원끼리 이어져서 가장 작은 원이 가장 크게 퍼져요.
 * 07에서 쌓는 순서(아래부터)예요.
 */
export const RIPPLE_RINGS = [
  { name: "Ellipse 18", from: { x: 156, y: 333, size: 64 }, to: { x: 6, y: 153, size: 364 } },
  { name: "Ellipse 14", from: { x: 150, y: 328, size: 76 }, to: { x: 49, y: 203, size: 278 } },
  {
    name: "Ellipse 15",
    from: { x: 142, y: 320, size: 92 },
    to: { x: 78.404, y: 232.402, size: 219.192 },
  },
  {
    name: "Ellipse 17",
    from: { x: 137, y: 315, size: 102 },
    to: { x: 112.264, y: 266.262, size: 151.474 },
  },
].map(ring => ({ ...ring, fromTransform: placeAt(ring.from, ring.to) }));
