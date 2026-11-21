import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router";

import type { VoteCandidate } from "@/entities/vote";
import { paths } from "@/shared/config";

import VotingPreview from "./VotingPreview";

interface VotingProps {
  roomId: number;
  /** 방 탭이에요. 미리보기에만 있고 후보 고르기에는 없어요(시안). */
  roomTabs: ReactNode;
  closesAt: string;
  candidates: VoteCandidate[];
  canVote: boolean;
  onVoteClosed: () => void;
}

/** 투표 중 화면의 단계예요. 주소는 같고 기록에 쌓아서 토스 뒤로가기로 미리보기에 돌아가요. */
interface VotingState {
  step?: "choose";
}

/** 투표 중이에요. 후보 미리보기에서 시작해 후보 고르기로 넘어가요. */
const Voting = ({ roomId, roomTabs, closesAt, candidates, canVote, onVoteClosed }: VotingProps) => {
  const navigate = useNavigate();
  const isChoosing = (useLocation().state as VotingState | null)?.step === "choose";

  // 후보 고르기는 다음 단계에서 채워요.
  if (isChoosing && canVote) return null;

  return (
    <VotingPreview
      roomTabs={roomTabs}
      closesAt={closesAt}
      candidates={candidates}
      canVote={canVote}
      onVoteClosed={onVoteClosed}
      onStart={() =>
        navigate(paths.room.vote(roomId), { state: { step: "choose" } satisfies VotingState })
      }
    />
  );
};

export default Voting;
