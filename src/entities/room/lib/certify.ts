import type { TodayResponse } from "../model/types";

/** 지금 인증을 남길 수 있어요. 이미 인증했거나 이전 회차 투표가 끝나지 않았으면 못 해요. */
export const canCertify = ({ members, round }: TodayResponse) =>
  round.isCertificationOpen && !members.some(member => member.isMe && member.certification);
