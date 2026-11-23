import { request } from "@/shared/api";

/** 방장이 멤버를 내보내요. 내보낸 사람은 같은 방에 다시 들어올 수 없어요. */
export const kickMember = (roomId: number, memberId: number) =>
  request("DELETE", `/api/rooms/${roomId}/members/${memberId}`);
