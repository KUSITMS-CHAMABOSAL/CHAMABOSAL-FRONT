import type { BosalStatus } from "@/entities/bosal";
import type { TodayMember } from "@/entities/room";

import type { BosalCardView } from "../model/types";

/** 격자 한 칸(빈자리는 null)을 캐러셀 카드 화면으로 바꿔요. */
export const getBosalCardView = (member: TodayMember | null): BosalCardView => {
  if (!member) return { kind: "waiting" };
  const { certification } = member;
  if (certification) return { kind: "certified", member, certification };
  return { kind: "unverified", member };
};

export const getBosalStatus = ({ certification }: TodayMember): BosalStatus => {
  if (!certification) return "unverified";
  return certification.result === "ENDURED" ? "patient" : "failed";
};

/** 닉네임 "민지" → "민지 보살" */
export const getBosalName = ({ nickname }: TodayMember) => `${nickname} 보살`;
