import { request } from "@/shared/api";

import type { ReceivedTapsResponse, VoteTabStatusResponse } from "../model/types";

export const getVoteTab = (roomId: number) =>
  request<VoteTabStatusResponse>("GET", `/api/rooms/${roomId}/vote`);

export const getReceivedTaps = (roundId: number) =>
  request<ReceivedTapsResponse>("GET", `/api/rounds/${roundId}/taps/received`);
