import { isApiError } from "@/shared/api";

/** 방에서 나갔거나 내보내졌거나(ROOM_002) 방이 사라졌어요(ROOM_005). 설계서 09 [3] 더이상 참여하지 않는 방 */
export const isRoomGoneError = (error: unknown) => isApiError(error, "ROOM_005", "ROOM_002");
