import type { TodayCertification, TodayMember } from "@/entities/room";

/** 캐러셀 한 장이 보여줄 화면이에요. */
export type BosalCardView =
  | { kind: "certified"; member: TodayMember; certification: TodayCertification }
  | { kind: "unverified"; member: TodayMember };
