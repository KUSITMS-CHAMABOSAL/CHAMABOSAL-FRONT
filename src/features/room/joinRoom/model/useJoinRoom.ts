import { useMutation, useQueryClient } from "@tanstack/react-query";

import { roomQueries } from "@/entities/room";
import { sessionQueries } from "@/entities/session";
import { logEvent } from "@/shared/lib/appsInToss";

import { joinRoom } from "../api/joinRoomApi";

/** 초대받은 방에 들어가요. 내 방 목록이 바뀌어서 내 정보를 다시 받아요. */
export const useJoinRoom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: joinRoom,
    onSuccess: ({ roomId, isNewUser }) => {
      if (isNewUser) logEvent("signup_complete", { entry: "invite" });
      // 다시 받기 전이라 참여 전 내 방 목록이에요. 이미 멤버였으면(200) 새 참여가 아니라 세지 않아요.
      const me = queryClient.getQueryData(sessionQueries.me().queryKey);
      if (me && !me.rooms.some(room => room.roomId === roomId))
        // 참여 응답에 방 인원이 없어서 오늘 탭을 받아요. 방 홈이 곧 쓸 값이라 캐시에도 남아요.
        void queryClient
          .fetchQuery(roomQueries.today(roomId))
          .then(today =>
            logEvent("invite_join_complete", {
              member_count_after: today.room.memberCount,
              is_second_room: me.rooms.length > 0,
            }),
          )
          .catch(() => {});
      return queryClient.invalidateQueries({ queryKey: sessionQueries.me().queryKey });
    },
  });
};
