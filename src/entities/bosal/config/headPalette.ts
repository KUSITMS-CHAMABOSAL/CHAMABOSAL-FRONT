import type { BosalColor } from "../model/types";

/** 보살 머리 그림의 색 역할이에요. */
export interface BosalHeadPalette {
  /** 얼굴 바탕, 귀, 머리카락 위쪽 */
  light: string;
  /** 머리카락 아래쪽 */
  mid: string;
  /** 눈, 입, 이마 점, 그림자 */
  dark: string;
  /** 코, 입술, 눈썹 */
  accent: string;
}

/**
 * `bosal_head.svg`(시안 한 솥 축하 2등 얼굴)에 칠해진 색이에요. 이 네 색만 쓰여서 보살 색으로 바꿔 끼워요.
 * 키는 대문자 hex 그대로예요. 파일을 다시 내보내면 값이 맞는지 확인해요.
 */
export const BOSAL_HEAD_TEMPLATE: BosalHeadPalette = {
  light: "#CBCBCB",
  mid: "#A7A7A7",
  dark: "#9E9E9E",
  accent: "#B1B1B1",
};

/** 보살 색마다 머리 그림에 칠할 색이에요. `bosal_{color}_default.svg`에서 같은 역할에 쓰인 색을 옮겼어요. */
export const BOSAL_HEAD_PALETTE: Record<BosalColor, BosalHeadPalette> = {
  YELLOW: { light: "#FFF5CD", mid: "#FFDC4F", dark: "#FFD015", accent: "#FFE98F" },
  PINK: { light: "#FFE2E9", mid: "#FB93AC", dark: "#FA7093", accent: "#FFBACA" },
  MINT: { light: "#B7F7F3", mid: "#4BD9D0", dark: "#29CAC0", accent: "#7FE9E2" },
  PURPLE: { light: "#E3DFFF", mid: "#AAA1FD", dark: "#9589F9", accent: "#C6BFFC" },
};
