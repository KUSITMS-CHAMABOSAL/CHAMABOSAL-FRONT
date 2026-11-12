import type { TodayCertification, TodayMember } from "@/entities/room";

/** 캐러셀 한 장이 보여줄 화면이에요. 빈자리는 친구 입장 전 카드예요. */
export type BosalCardView =
  | { kind: "waiting" }
  | { kind: "certified"; member: TodayMember; certification: TodayCertification }
  | { kind: "unverified"; member: TodayMember };
