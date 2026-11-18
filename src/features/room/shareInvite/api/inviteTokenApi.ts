import { request } from "@/shared/api";

/** 내 초대 토큰이에요. 없으면 만들고(201), 있으면 그대로 돌려줘요(200). */
export const issueInviteToken = (roomId: number) =>
  request<{ inviteToken: string }>("POST", `/api/rooms/${roomId}/members/me/invite-token`);
