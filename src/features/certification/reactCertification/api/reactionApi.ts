import { request } from "@/shared/api";
import type { ReactionType } from "@/shared/types";

/** 같은 값으로 다시 보내도 그대로예요(재시도 안전). */
export const putMyReaction = (certificationId: number, type: ReactionType) =>
  request("PUT", `/api/certifications/${certificationId}/reactions/me`, { type });

/** 남긴 리액션이 없어도 성공해요(재시도 안전). */
export const deleteMyReaction = (certificationId: number) =>
  request("DELETE", `/api/certifications/${certificationId}/reactions/me`);
