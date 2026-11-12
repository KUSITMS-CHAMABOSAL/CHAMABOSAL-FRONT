import type { BosalColor } from "@/entities/bosal";

// 🔖 시안에는 분홍(#ffe2e9)만 있어요. 나머지 색은 TDS 50 단계 색으로 맞췄고 디자이너 확인이 필요해요.
/** 보살 색마다 프로필 카드 아래쪽 그라데이션 색이에요. */
export const PROFILE_GRADIENT: Record<BosalColor, string> = {
  PINK: "to-(--adaptiveRed50)",
  YELLOW: "to-(--adaptiveYellow50)",
  PURPLE: "to-(--adaptivePurple50)",
  MINT: "to-(--adaptiveGreen50)",
};
