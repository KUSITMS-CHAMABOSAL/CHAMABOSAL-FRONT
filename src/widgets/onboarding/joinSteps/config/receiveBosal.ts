import type { BosalColor } from "@/entities/bosal";

/** 내 보살 받기 배경이에요. 시안(1-4 내 보살 받기_핑크·보라·옥색·노랑)의 155.6도 그라데이션이에요. */
export const RECEIVE_BACKGROUND: Record<BosalColor, string> = {
  PINK: "bg-[linear-gradient(155.62deg,white_0%,var(--adaptiveYellow50)_43.61%,var(--color-bosal-pink-glow)_99.68%)]",
  PURPLE:
    "bg-[linear-gradient(155.62deg,white_0%,var(--adaptiveBlue100)_43.61%,var(--color-purple-200)_99.68%)]",
  MINT: "bg-[linear-gradient(155.62deg,white_0%,var(--adaptiveBlue50)_43.61%,var(--color-bosal-mint-glow)_99.68%)]",
  YELLOW:
    "bg-[linear-gradient(155.62deg,white_0%,var(--color-bosal-yellow-mid)_43.61%,var(--color-bosal-yellow-glow)_99.68%)]",
};

/** 보살 오른쪽 위 꽃 색이에요. */
export const RECEIVE_TOP_FLOWER: Record<BosalColor, string> = {
  PINK: "text-bosal-pink-flower",
  PURPLE: "text-bosal-purple-flower",
  MINT: "text-bosal-mint-flower",
  YELLOW: "text-bosal-yellow-flower",
};

/** 보살 왼쪽 아래 흰 꽃이에요. 핑크만 조금 더 진해요. */
export const RECEIVE_BOTTOM_FLOWER: Record<BosalColor, string> = {
  PINK: "text-on-fill/30",
  PURPLE: "text-on-fill/20",
  MINT: "text-on-fill/20",
  YELLOW: "text-on-fill/20",
};
