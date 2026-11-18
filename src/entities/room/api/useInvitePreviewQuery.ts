import { useQuery } from "@tanstack/react-query";

import { roomQueries } from "./roomQueries";

/** 초대 링크로 들어온 사람이 이 방에 들어갈 수 있는지예요. 막힌 경우도 `status`로 와요. 토큰이 없으면 요청하지 않아요. */
export const useInvitePreviewQuery = (token: string) =>
  useQuery({ ...roomQueries.invitePreview(token), enabled: token !== "" });
