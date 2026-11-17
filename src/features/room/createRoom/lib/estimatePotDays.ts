import { DAILY_CERTIFY_RICE, DAILY_TAP_RICE, DAILY_VOTE_RICE } from "@/entities/room";
import { MIN_VOTERS } from "@/entities/vote";

/**
 * 매일 모두 참여하면 한 솥을 채우는 데 걸리는 날이에요. 소수점은 올려요.
 * 하루 팀 적립은 인원 × (인증 10 + 투표 5) + (인원 − 1) × 톡톡 5석이고,
 * 투표가 없는 인원(2명)은 인원 × 인증 10석이에요.
 */
export const estimatePotDays = (memberLimit: number, potGoalAmount: number) => {
  const daily =
    memberLimit < MIN_VOTERS
      ? memberLimit * DAILY_CERTIFY_RICE
      : memberLimit * (DAILY_CERTIFY_RICE + DAILY_VOTE_RICE) + (memberLimit - 1) * DAILY_TAP_RICE;
  return Math.ceil(potGoalAmount / daily);
};
