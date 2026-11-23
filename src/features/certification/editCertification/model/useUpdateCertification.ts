import { useMutation, useQueryClient } from "@tanstack/react-query";

import { certificationQueries } from "@/entities/certification";
import { roomQueries } from "@/entities/room";

import { updateCertification } from "../api/certificationApi";
import type { CertificationUpdateRequest } from "./types";

/** 내 인증을 고쳐요. 결과와 금액이 바뀔 수 있어 오늘 탭과 캘린더를 다시 받아요. 공양미는 바뀌지 않아요. */
export const useUpdateCertification = (roomId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      certificationId,
      body,
    }: {
      certificationId: number;
      body: CertificationUpdateRequest;
    }) => updateCertification(certificationId, body),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: roomQueries.today(roomId).queryKey }),
        queryClient.invalidateQueries({ queryKey: certificationQueries.calendars(roomId) }),
      ]),
  });
};
