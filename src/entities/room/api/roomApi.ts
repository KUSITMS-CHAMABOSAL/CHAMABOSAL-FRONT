import { request } from "@/shared/api";

import type { TodayResponse } from "../model/types";

export const getToday = (roomId: number) =>
  request<TodayResponse>("GET", `/api/rooms/${roomId}/today`);
