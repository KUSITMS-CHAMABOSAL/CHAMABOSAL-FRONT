/**
 * 나발 빠짐 설명 화면(시안 탈모설명-01~07)이 장면을 넘기는 시각이에요.
 * 순서와 간격은 디자이너가 준 프로토타입 녹화를 따랐어요. 01은 제목을 읽을 수 있게 1.5초 보여준 뒤 확대해요.
 * 녹화(01 기준): 02 확대 0.43초, 03 1.2초, 04 1.73초, 05 2.26초, 06 축소 2.9초, 07 카드 4.43초
 * 01 떨어짐 → 02 확대 → 03~05 빈 자리가 늘어남 → 06 축소 → 07 카드와 초록 보살
 */
export const GUIDE_SCENE_AT_MS = [0, 1500, 2600, 3200, 3800, 4800, 6300] as const;

export const GUIDE_LAST_SCENE = GUIDE_SCENE_AT_MS.length - 1;

/** 장면이 바뀔 때 확대·축소, 배경, 문구, 카드가 넘어가는 시간이에요. 녹화는 370~760ms예요. */
export const GUIDE_TRANSITION_MS = 500;

/**
 * 열 때 아래에서 올라오고 닫을 때 내려가는 시간이에요. 여는 움직임(`--animate-hair-guide-enter`)도 같은 450ms예요.
 * 여는 곡선은 닫는 곡선을 뒤집은 모양이라, 닫기를 거꾸로 재생한 것처럼 보여요.
 */
export const GUIDE_CLOSE_MS = 450;

/** [나발 심으러 가기]를 누르면 심기 화면 배경색으로 어두워지는 시간이에요. 심기 화면 내용이 나타나는 시간도 같아요. */
export const GUIDE_DIM_MS = 250;

/** 빈 자리 원이 나타나는 시간이에요. */
export const GUIDE_SLOT_FADE_MS = 400;

/**
 * 장면마다 빈 자리(머리카락 인덱스)예요. 시안 탈모설명-01~07의 점선 원 자리를 그대로 옮겼어요.
 * 시안 05(9곳)와 06(5곳)은 자리가 달라, 축소하면서 빈 자리도 바뀌어요.
 * 🔖 내 정보 API의 `nabal.fallenNumbers`로 바꿀지는 화면 흐름을 정할 때 정해요.
 */
export const GUIDE_PLUCKED_BY_SCENE: readonly ReadonlySet<number>[] = [
  [7],
  [7],
  [7, 30],
  [7, 30, 32],
  [4, 7, 20, 23, 29, 30, 32, 34, 36],
  [7, 20, 25, 29, 37],
  [7, 20, 25, 29, 37],
].map(indexes => new Set(indexes));

/** 07 카드 썸네일은 시안처럼 머리카락을 모두 그리고, 맨 위 가닥 위에 점선 링만 얹어요. */
export const GUIDE_CARD_PLUCKED: ReadonlySet<number> = new Set();

/**
 * 시안(375px)의 크기와 위치예요. 위치는 토스 상단 바(94px) 아래부터 잰 값이에요.
 * 회색 보살은 시안 `몸` 355.5px, 확대하면 562.69px이고 위쪽 끝은 그대로예요.
 * 초록 보살은 시안 `Group 37`(449.04px)이에요.
 */
export const GUIDE_LAYOUT = {
  copyTop: 169 - 94,
  figureTop: 301 - 94,
  figureWidth: 355.5,
  zoom: 562.69 / 355.5,
  cardTop: 325 - 94,
  /** 06에서 카드는 50px 아래(375)에 숨어 있다가 07에서 올라와요. */
  cardRise: 375 - 325,
  mintTop: 446 - 94,
  mintWidth: 449.04,
  /** 시안 06에는 초록 보살이 없어서, 카드처럼 아래에서 조금 올라오게 했어요. */
  mintRise: 40,
  /**
   * 녹화에서 문구가 바뀔 때 새 문구는 화면 아래쪽에서 올라오고, 이전 문구는 위로 올라가며 사라져요.
   * 녹화는 새 문구가 약 475px 아래에서 시작하지만 처음엔 투명해서, 보이는 구간만 남겼어요.
   */
  copyEnter: 300,
  copyExit: 40,
} as const;
