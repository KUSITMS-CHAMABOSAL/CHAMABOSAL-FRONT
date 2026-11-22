import { useMeQuery } from "@/entities/session";
import { useHasSeenServiceTour } from "@/features/onboarding/takeServiceTour";

/**
 * 보살 받기 다음에 온보딩을 보여줄지예요. 온보딩을 본 기록이 없고, 이 방 말고 참여 중인 방이 없을 때만 보여줘요.
 * 기기를 바꿔 기록이 사라져도 이미 방이 있는 사람(두 번째 방)은 건너뛰어요. 아직 모르면 보여주지 않아요.
 */
export const useNeedsServiceTour = (roomId?: number) => {
  const seen = useHasSeenServiceTour();
  const me = useMeQuery();
  return seen === false && !!me.data && me.data.rooms.every(room => room.roomId === roomId);
};
