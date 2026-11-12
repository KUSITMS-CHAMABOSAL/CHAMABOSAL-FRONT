import { request } from "@/shared/api";

/** 방에서 나가요. 방장이면 위임되고, 마지막 멤버면 방이 지워져요. */
export const leaveRoom = (roomId: number) => request("DELETE", `/api/rooms/${roomId}/members/me`);
