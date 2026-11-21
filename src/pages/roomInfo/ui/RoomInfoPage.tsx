import { useNavigate, useParams } from "react-router";

import { useTodayQuery } from "@/entities/room";
import { paths } from "@/shared/config";
import { RoomInfo } from "@/widgets/room/roomInfo";

/** 방 정보예요. 방 홈의 [방 정보]로 들어와요. 홈과 같은 오늘 탭 응답을 써요. */
const RoomInfoPage = () => {
  const roomId = Number(useParams().roomId);
  const today = useTodayQuery(roomId);
  const navigate = useNavigate();

  // 주소로 바로 들어와 돌아갈 기록이 없으면 방 홈으로 가요.
  const goBack = () =>
    (window.history.state as { idx?: number } | null)?.idx
      ? navigate(-1)
      : navigate(paths.room.home(roomId), { replace: true });

  // 🔖 로딩·에러 시안이 없어 아직 아무것도 그리지 않아요.
  if (!today.data) {
    if (today.error) throw today.error;
    return null;
  }

  return <RoomInfo today={today.data} onBack={goBack} />;
};

export default RoomInfoPage;
