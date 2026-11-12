import { useMutation, useQueryClient } from "@tanstack/react-query";

import { certificationQueries } from "@/entities/certification";
import { roomQueries } from "@/entities/room";
import { sessionQueries } from "@/entities/session";

import { deleteCertification } from "../api/certificationApi";

/** 내 인증을 지워요. 공양미와 한 솥이 회수되니 오늘 탭, 캘린더, 내 정보를 다시 받아요. */
export const useDeleteCertification = (roomId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCertification,
    onSettled: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: roomQueries.today(roomId).queryKey }),
        queryClient.invalidateQueries({ queryKey: certificationQueries.calendars(roomId) }),
        queryClient.invalidateQueries({ queryKey: sessionQueries.me().queryKey }),
      ]),
  });
};
