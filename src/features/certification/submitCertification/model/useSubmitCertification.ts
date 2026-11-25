import { useMutation, useQueryClient } from "@tanstack/react-query";

import { certificationQueries } from "@/entities/certification";
import { roomQueries } from "@/entities/room";
import { sessionQueries } from "@/entities/session";
import { logEvent } from "@/shared/lib/appsInToss";

import { createCertification } from "../api/certificationApi";
import type { CertificationCreateRequest } from "./types";

/**
 * 인증을 등록해요. 공양미와 한 솥, 회차 인증 수가 바뀌니 오늘 탭, 캘린더, 내 정보를 다시 받아요.
 * 오늘 탭을 다시 받으면 솥을 다 채웠는지(`entry.hasUnseenPotCelebration`)도 함께 와요.
 */
export const useSubmitCertification = (roomId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CertificationCreateRequest) => createCertification(roomId, body),
    // 다시 받기를 기다리지 않아요. 기다리면 "인증함"으로 바뀐 오늘 탭 때문에 작성 화면이 완료 화면보다 먼저 홈으로 가요.
    onSuccess: (_, body) => {
      // 인원, 같이 참은 날, 마지막 인증 여부는 다시 받기 전, 작성 화면이 쓰던 오늘 탭 값이에요.
      const today = queryClient.getQueryData(roomQueries.today(roomId).queryKey);
      if (today)
        logEvent("certify_complete", {
          result: body.result === "ENDURED" ? "endured" : "failed",
          has_photo: body.imageKey !== undefined,
          member_count: today.room.memberCount,
          room_day: today.room.daysTogether,
          is_last_certifier: today.me.isLastCertifier,
        });
      void queryClient.invalidateQueries({ queryKey: roomQueries.today(roomId).queryKey });
      void queryClient.invalidateQueries({ queryKey: certificationQueries.calendars(roomId) });
      void queryClient.invalidateQueries({ queryKey: sessionQueries.me().queryKey });
    },
  });
};
