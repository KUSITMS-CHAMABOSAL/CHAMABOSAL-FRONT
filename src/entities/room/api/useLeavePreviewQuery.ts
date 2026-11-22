import { useQuery } from "@tanstack/react-query";

import { roomQueries } from "./roomQueries";

/** 나가면 사라질 공양미예요. 나가기 확인을 열었을 때만 받아요. */
export const useLeavePreviewQuery = (roomId: number, enabled: boolean) =>
  useQuery({ ...roomQueries.leavePreview(roomId), enabled });
