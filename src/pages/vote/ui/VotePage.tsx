import { useParams } from "react-router";

import { getVoteView, useVoteTabQuery } from "@/entities/vote";
import { VoteBoard } from "@/widgets/vote/voteBoard";

/** 투표 탭이에요. 방의 투표 상태에 맞는 화면을 보여줘요. */
const VotePage = () => {
  const roomId = Number(useParams().roomId);
  const { data, error, refetch } = useVoteTabQuery(roomId);

  if (!data) {
    if (error) throw error;
    // 🔖 로딩 시안이 없어 아직 아무것도 그리지 않아요.
    return null;
  }

  return (
    // 높이를 화면만큼 잡지 않아요. 아래에 하단 탭바 자리가 따로 붙어서, 잡으면 그만큼 스크롤이 생겨요.
    <main className="bg-(--adaptiveBackground)">
      <VoteBoard roomId={roomId} view={getVoteView(data)} onVoteClosed={refetch} />
    </main>
  );
};

export default VotePage;
