import { useNavigate, useParams } from "react-router";

import { useReceivedTapsQuery } from "@/entities/vote";
import { paths } from "@/shared/config";
import { MoktakPractice } from "@/widgets/vote/moktakPractice";

/** 정신 차려! 톡톡(목탁 수행)이에요. 이 회차에 받은 톡톡 합계만큼 목탁을 쳐요. */
const TapTapPage = () => {
  const params = useParams();
  const roomId = Number(params.roomId);
  const roundId = Number(params.roundId);
  const navigate = useNavigate();
  const received = useReceivedTapsQuery(roundId);
  const toVote = () => navigate(paths.room.vote(roomId), { replace: true });

  if (received.error) throw received.error;
  // 🔖 로딩, 톡톡 전달 전(isDelivered false), 받은 톡톡 0번 시안이 없어 아직 따로 그리지 않아요.
  if (!received.data) return null;

  return (
    <MoktakPractice
      roundId={roundId}
      goal={received.data.totalCount}
      alreadyDone={received.data.isMoktakDone}
      onQuit={toVote}
      onClose={toVote}
      // 시안: 보너스를 받으면 곳간으로 가요.
      onClaimBonus={() => navigate(paths.storehouse, { replace: true })}
    />
  );
};

export default TapTapPage;
