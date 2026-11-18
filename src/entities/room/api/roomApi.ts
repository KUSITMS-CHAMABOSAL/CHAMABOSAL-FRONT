import { request } from "@/shared/api";

import type { InvitePreview, NewColorResponse, TodayResponse } from "../model/types";

export const getToday = (roomId: number) =>
  request<TodayResponse>("GET", `/api/rooms/${roomId}/today`);

export const getInvitePreview = (token: string) =>
  request<InvitePreview>("GET", `/api/invites/${encodeURIComponent(token)}`);

/** 방 만들기 전에 내 보살 색을 뽑아요. 방을 만들 때 이 색을 그대로 보내요. */
export const getNewColor = () => request<NewColorResponse>("GET", "/api/rooms/new-color");
