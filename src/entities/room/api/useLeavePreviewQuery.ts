import { useQuery } from "@tanstack/react-query";

import { roomQueries } from "./roomQueries";

/** 지금 나가면 사라질 공양미예요. */
export const useLeavePreviewQuery = (roomId: number) => useQuery(roomQueries.leavePreview(roomId));
