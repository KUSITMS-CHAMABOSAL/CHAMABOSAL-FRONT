import { useMeQuery } from "@/entities/session";
import { useHasSeenServiceTour } from "@/features/onboarding/takeServiceTour";

/**
 * 보살 받기 다음에 온보딩을 보여줄지예요. 온보딩을 본 기록이 없고, 이 방 말고 참여 중인 방이 없을 때만 보여줘요.
 * 기기를 바꿔 기록이 사라져도 이미 방이 있는 사람(두 번째 방)은 건너뛰어요.
 * 기록이나 내 정보를 읽는 동안은 `undefined`라 보살 받기 버튼이 기다려요.
 */
export const useNeedsServiceTour = (roomId?: number) => {
  const seen = useHasSeenServiceTour();
  const me = useMeQuery();
  if (seen === undefined) return undefined;
  if (seen) return false;
  if (me.data) return me.data.rooms.every(room => room.roomId === roomId);
  // 내 정보를 못 받으면 다른 방이 있는지 몰라요. 방 만들기·참여를 막지 않고 본 기록만으로 판단해요.
  if (me.error) return true;
  return undefined;
};
