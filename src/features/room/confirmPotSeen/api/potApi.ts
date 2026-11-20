import { request } from "@/shared/api";

/** 한 솥 축하를 몇 번째 솥까지 봤는지 저장해요. 저장값보다 작거나 같으면 그대로 성공해요. */
export const confirmPotSeen = (roomId: number, seenPotCount: number) =>
  request("PUT", `/api/rooms/${roomId}/members/me/seen-pot`, { seenPotCount });
