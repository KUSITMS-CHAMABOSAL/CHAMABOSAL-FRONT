import { useNavigate, useParams } from "react-router";

import { Button, Paragraph } from "@toss/tds-mobile";

import { useVoteTabQuery } from "@/entities/vote";
import { paths } from "@/shared/config";

// 탭 이동을 위한 빈 화면이에요. 투표 화면 이슈에서 채워요.
const VotePage = () => {
  const roomId = Number(useParams().roomId);
  const navigate = useNavigate();
  const voteTab = useVoteTabQuery(roomId);
  const roundId = voteTab.data?.roundId ?? null;

  return (
    <main className="min-h-svh bg-(--adaptiveBackground)">
      {/* 🔖 실기기 테스트용 임시 진입 버튼이에요. 빌드에도 들어가니 투표 화면을 만들 때 꼭 지워요. */}
      <div className="flex flex-col gap-2 p-6">
        <Button
          display="block"
          disabled={roundId === null}
          onClick={() => roundId !== null && navigate(paths.room.tapTap(roomId, roundId))}
        >
          목탁 수행 테스트
        </Button>
        <Paragraph typography="t7" color="var(--adaptiveGrey600)">
          {voteTab.error
            ? "투표 탭 상태를 받지 못했어요"
            : `투표 탭 상태: ${voteTab.data?.status ?? "불러오는 중"} / 회차 ${roundId ?? "없음"}`}
        </Paragraph>
      </div>
    </main>
  );
};

export default VotePage;
