import { request } from "@/shared/api";

import type { CreateRoomRequest, CreateRoomResponse } from "../model/types";

/** 방과 방장 멤버를 한 번에 만들어요. 참여 중인 방이 2개면 `ROOM_001`이에요. */
export const createRoom = (body: CreateRoomRequest) =>
  request<CreateRoomResponse>("POST", "/api/rooms", body);
