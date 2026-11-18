import { request } from "@/shared/api";

import type { JoinRoomResponse } from "../model/types";

/**
 * 초대 링크로 방에 들어가요. 이미 멤버면 기존 멤버 정보를 돌려줘요(200).
 * 막히면 `ROOM_001`(방 2개) `ROOM_003`(가득 참) `ROOM_006`(들어갈 수 없음), 닉네임이 겹치면 `ROOM_004`예요.
 */
export const joinRoom = ({ token, nickname }: { token: string; nickname: string }) =>
  request<JoinRoomResponse>("POST", `/api/invites/${encodeURIComponent(token)}/join`, {
    nickname,
  });
