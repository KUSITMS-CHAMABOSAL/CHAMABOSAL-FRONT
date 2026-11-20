import { request } from "@/shared/api";

import type {
  InvitePreview,
  NewColorResponse,
  PotCelebration,
  TodayResponse,
} from "../model/types";

export const getToday = (roomId: number) =>
  request<TodayResponse>("GET", `/api/rooms/${roomId}/today`);

export const getInvitePreview = (token: string) =>
  request<InvitePreview>("GET", `/api/invites/${encodeURIComponent(token)}`);

/** 방 만들기 전에 내 보살 색을 뽑아요. 방을 만들 때 이 색을 그대로 보내요. */
export const getNewColor = () => request<NewColorResponse>("GET", "/api/rooms/new-color");

/** `seq`번째로 다 채운 솥의 축하 화면이에요. 보통 오늘 탭의 `room.potCompletedCount`를 넣어요. */
export const getPotCelebration = (roomId: number, seq: number) =>
  request<PotCelebration>("GET", `/api/rooms/${roomId}/pots/${seq}`);
