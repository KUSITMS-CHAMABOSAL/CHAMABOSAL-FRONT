import { useEffect } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { certificationQueries } from "./certificationQueries";

/**
 * 다음에 볼 달의 캘린더를 미리 받아둬요. 달을 넘기면 응답을 기다리지 않고 바로 보여요.
 * 이미 캐시에 있고 오래되지 않았으면 요청하지 않아요.
 */
export const usePrefetchCalendar = (roomId: number, month: string | undefined) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (month) void queryClient.prefetchQuery(certificationQueries.calendar(roomId, month));
  }, [queryClient, roomId, month]);
};
