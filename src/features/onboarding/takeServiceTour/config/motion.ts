/**
 * Figma 프로토타입(★ [프론트 전달] GUI > 플로우 「온보딩」)에 설정된 전환 값이에요.
 * 모든 전환의 이징은 'Ease in back'이에요. 플러그인 API는 프리셋 이름만 줘서, 곡선 값은 Figma 프리셋 값을 옮겼어요.
 */
export const EASE_IN_BACK = "cubic-bezier(0.3, -0.05, 0.7, -0.5)";

export const TOUR_MOTION = {
  /** 화면 넘기기. 드래그 → Push(위로), 같은 이름 레이어는 제자리에서 이어져요(Match layers). */
  pushMs: 300,
  /** 02 → 03 봉투. 도착하고 50ms 뒤 Smart Animate */
  envelopeDelayMs: 50,
  envelopeMs: 400,
  /** 06 → 07 이마 물결. 도착하고 10ms 뒤 Smart Animate, 한 번만 재생 */
  rippleDelayMs: 10,
  rippleMs: 800,
} as const;

/** 위로 쓸었다고 볼 최소 거리(px)예요. 탭과 구분할 만큼만 둬요. */
export const SWIPE_MIN_DISTANCE = 30;
