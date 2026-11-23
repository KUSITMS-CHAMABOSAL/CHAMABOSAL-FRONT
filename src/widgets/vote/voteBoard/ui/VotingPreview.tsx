import { type CSSProperties, type ReactNode, useEffect } from "react";
import { Button, Tooltip } from "@toss/tds-mobile";

import type { VoteCandidate } from "@/entities/vote";
import { useTabBarToast } from "@/shared/lib";
import { useSafeAreaBottom } from "@/shared/lib/appsInToss";

import backgroundGlow from "../assets/background_glow.svg";
import pedestalTop from "../assets/pedestal_top.svg";
import CandidateReel from "./CandidateReel";
import VoteHeader from "./VoteHeader";

interface VotingPreviewProps {
  roomTabs: ReactNode;
  closesAt: string;
  candidates: VoteCandidate[];
  /** 인증하지 않아 투표권이 없으면 false예요. 후보는 볼 수 있고 투표하러 가기만 막혀요. */
  canVote: boolean;
  onVoteClosed: () => void;
  onStart: () => void;
}

/** 디자인 문구예요(투표-02 예외케이스). 들어올 때 토스트와 버튼 위 툴팁에 같이 써요. */
const NO_VOTING_RIGHT_MESSAGE = "번뇌 미인증 시 투표 참여가 불가능해요";

/** 투표하러 가기예요(시안 투표-02). 후보가 단상 위로 흘러가고, 버튼을 누르면 후보 고르기로 가요. */
const VotingPreview = ({
  roomTabs,
  closesAt,
  candidates,
  canVote,
  onVoteClosed,
  onStart,
}: VotingPreviewProps) => {
  const openToast = useTabBarToast();
  const safeAreaBottom = useSafeAreaBottom();

  // 투표권이 없으면 들어올 때 한 번 알려요(화면설계서 19 미인증자 토스트).
  useEffect(() => {
    if (!canVote) openToast(NO_VOTING_RIGHT_MESSAGE);
  }, [canVote, openToast]);

  return (
    <div style={{ "--safe-area-bottom": `${safeAreaBottom}px` } as CSSProperties}>
      {/* 아래쪽 빛이에요. 시안처럼 화면 아래에 붙고, 위아래를 뒤집은 타원이 흐려져 있어요. */}
      <img
        src={backgroundGlow}
        alt=""
        width={738}
        height={563}
        className="pointer-events-none fixed -bottom-[197px] left-1/2 -translate-x-1/2 -scale-y-100"
      />
      {/* 하단 탭바 자리(75px)를 뺀 높이에서 잘라요. 흐려지며 내려가는 단상 기둥 때문에 스크롤이 생기지 않아요. */}
      <div className="relative h-[calc(100svh-75px-var(--safe-area-bottom))] overflow-hidden">
        {roomTabs}
        <VoteHeader closesAt={closesAt} onClosed={onVoteClosed} />
        {/* 시안(웹뷰 높이 718px)보다 화면이 길면 남는 높이를 헤더와 카드 사이에 둬요.
            단상이 시안처럼 화면 아래에서 일정한 거리에 놓이고, 버튼·빛과 어긋나지 않아요. */}
        {/* 카드만 24px 올려요. 자리는 그대로 차지해서 단상 위치는 바뀌지 않아요. */}
        <div className="mt-[max(0px,calc(100svh-718px))] -translate-y-6">
          <CandidateReel candidates={candidates} />
        </div>
        {/* 단상이에요. 윗판 아래로 기둥이 흐려지며 내려가요. */}
        <div aria-hidden className="mt-[21px] flex flex-col items-center">
          <img src={pedestalTop} alt="" width={248} height={23} className="block" />
          <div className="relative h-[260px] w-[200px] overflow-hidden bg-linear-to-b from-[#d9d9d9] to-[#d9d9d9]/0">
            <div className="absolute inset-x-0 top-0 h-6 bg-[#c0c0c0] blur-[10px]" />
          </div>
        </div>
      </div>
      {/* 시안처럼 하단 탭바(75px) 위 4px에 떠 있어요. */}
      <div className="fixed inset-x-0 bottom-[calc(79px+var(--safe-area-bottom))] px-5">
        <Tooltip
          open={!canVote}
          size="small"
          placement="top"
          messageAlign="center"
          message={NO_VOTING_RIGHT_MESSAGE}
        >
          <Button size="xlarge" color="dark" display="block" disabled={!canVote} onClick={onStart}>
            투표하러 가기
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};

export default VotingPreview;
