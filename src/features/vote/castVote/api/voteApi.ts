import { request } from "@/shared/api";

import type { VoteSubmitRequest, VoteSubmitResponse } from "../model/types";

export const castVote = (roundId: number, body: VoteSubmitRequest) =>
  request<VoteSubmitResponse>("POST", `/api/rounds/${roundId}/votes`, body);
