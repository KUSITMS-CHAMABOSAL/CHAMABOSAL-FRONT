import { request } from "@/shared/api";

import type { InvitePreview, TodayResponse } from "../model/types";

export const getToday = (roomId: number) =>
  request<TodayResponse>("GET", `/api/rooms/${roomId}/today`);

export const getInvitePreview = (token: string) =>
  request<InvitePreview>("GET", `/api/invites/${encodeURIComponent(token)}`);
