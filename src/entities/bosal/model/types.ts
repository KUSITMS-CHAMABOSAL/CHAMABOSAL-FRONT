export type { BosalColor } from "@/shared/types";

/** 시안 `부처` 컴포넌트의 표정이에요. 기본·참았음·못참았음·찔림 */
export type BosalExpression = "default" | "patient" | "failed" | "poked";

/** 오늘 인증 상태예요. 상태 뱃지와 표정을 정해요. */
export type BosalStatus = "unverified" | "patient" | "failed";

/**
 * 꾸미기 아이템 코드예요. GET /api/store 의 `items[].code`, 멤버의 `equippedItemCodes`
 * Swagger는 `code`를 문자열로만 정의해서(enum 없음) 2026-11-24 서버 응답의 13개를 옮겼어요.
 */
export type ItemCode =
  | "SANTA_HAT"
  | "HEADSET"
  | "RUDOLPH_HEADBAND"
  | "GYARU_HAIRPIN"
  | "SUNGLASSES"
  | "EYEBROW_PIERCING"
  | "LEOPARD_GLASSES"
  | "SANTA_BEARD"
  | "RUDOLPH_NOSE"
  | "DUCK_LIPS"
  | "BEAD_EARRING"
  | "JADE_RING"
  | "ENERGY_WAVE";
