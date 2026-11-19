import { useNavigate, useParams } from "react-router";

import { useRoundResultQuery } from "@/entities/vote";
import { paths } from "@/shared/config";
import { ForeheadTap } from "@/widgets/vote/foreheadTap";

/** 정신 차려! 톡톡(내가 친구에게)이에요. 투표 결과로 지목된 친구의 이마를 톡톡 쳐요. */
const ForeheadTapPage = () => {
  const params = useParams();
  const roomId = Number(params.roomId);
  const roundId = Number(params.roundId);
  const navigate = useNavigate();
  const result = useRoundResultQuery(roundId);

  // 🔖 로딩, 톡톡할 수 없는 결과(canTap false: 지목 없음·방어됨·투표 안 함 등) 시안이 없어 아직 따로 그리지 않아요.
  if (!result.data) {
    if (result.error) throw result.error;
    return null;
  }
  const { picked } = result.data;
  if (!picked) return null;

  return (
    <ForeheadTap
      roundId={roundId}
      nickname={picked.nickname}
      onQuit={() => navigate(paths.room.vote(roomId), { replace: true })}
    />
  );
};

export default ForeheadTapPage;
