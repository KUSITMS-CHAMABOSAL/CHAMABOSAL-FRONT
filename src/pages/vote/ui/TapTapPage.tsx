import { FullScreenLoader } from "@toss/tds-mobile";
import { useNavigate, useParams } from "react-router";

import { useReceivedTapsQuery } from "@/entities/vote";
import { paths } from "@/shared/config";
import { useTabBarToast } from "@/shared/lib";
import { MoktakPractice } from "@/widgets/vote/moktakPractice";

const BONUS_PAID_MESSAGE = "보너스 공양미가 지급됐어요";

/** 정신 차려! 톡톡(목탁 수행)이에요. 이 회차에 받은 톡톡 합계만큼 목탁을 쳐요. */
const TapTapPage = () => {
  const params = useParams();
  const roomId = Number(params.roomId);
  const roundId = Number(params.roundId);
  const navigate = useNavigate();
  const received = useReceivedTapsQuery(roundId);
  // 곳간에는 탭바가 있어서 탭바 위에 띄워요.
  const openToast = useTabBarToast();
  const toVote = () => navigate(paths.room.vote(roomId), { replace: true });

  // 처음 받지 못했을 때만 에러 화면이에요. 다시 받기만 실패하면 치던 화면을 그대로 둬요.
  // 🔖 톡톡 전달 전(isDelivered false) 시안이 없어 아직 따로 그리지 않아요.
  if (!received.data) {
    if (received.error) throw received.error;
    return <FullScreenLoader />;
  }

  return (
    <MoktakPractice
      roundId={roundId}
      goal={received.data.totalCount}
      alreadyDone={received.data.isMoktakDone}
      onQuit={toVote}
      onClose={toVote}
      // 시안: 보너스를 받으면 곳간으로 가요. 이번에 받은 공양미가 있을 때만 지급됐다고 알려요.
      onClaimBonus={riceEarned => {
        if (riceEarned > 0) openToast(BONUS_PAID_MESSAGE);
        navigate(paths.storehouse, { replace: true });
      }}
    />
  );
};

export default TapTapPage;
