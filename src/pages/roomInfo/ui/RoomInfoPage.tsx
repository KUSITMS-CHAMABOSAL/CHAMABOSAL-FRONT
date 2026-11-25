import { useNavigate, useParams } from "react-router";

import { isRoomGoneError, RoomGoneDialog, useTodayQuery } from "@/entities/room";
import { useMeQuery } from "@/entities/session";
import { paths } from "@/shared/config";
import { RoomInfo, RoomInfoSkeleton } from "@/widgets/room/roomInfo";

/** 방 정보예요. 방 홈의 [방 정보]로 들어와요. 홈과 같은 오늘 탭 응답을 써요. */
const RoomInfoPage = () => {
  const roomId = Number(useParams().roomId);
  const today = useTodayQuery(roomId);
  const me = useMeQuery();
  const navigate = useNavigate();

  // 보는 중에 내보내졌거나 방이 사라졌어요. 닫으면 방 목록을 다시 받아 진입 분기로 가요.
  const isRoomGone = isRoomGoneError(today.error);
  const leaveGoneRoom = () => void me.refetch().then(() => navigate(paths.root, { replace: true }));

  if (!today.data && !isRoomGone) {
    if (today.error) throw today.error;
    return <RoomInfoSkeleton />;
  }

  return (
    <>
      {today.data && <RoomInfo today={today.data} />}
      <RoomGoneDialog open={isRoomGone} onClose={leaveGoneRoom} />
    </>
  );
};

export default RoomInfoPage;
