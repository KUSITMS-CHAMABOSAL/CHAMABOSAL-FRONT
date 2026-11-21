import { type CSSProperties, useState } from "react";
import { Button, Tooltip } from "@toss/tds-mobile";

import type { VoteCandidate } from "@/entities/vote";
import { type VoteSubmitRequest, VoteConfirmSheet } from "@/features/vote/castVote";
import { useSafeAreaBottom } from "@/shared/lib/appsInToss";

import type { CandidateChoice, ChoiceKey } from "../model/types";
import CandidateCarousel from "./CandidateCarousel";
import VoteHeader from "./VoteHeader";

interface VotingChooseProps {
  roomId: number;
  roundId: number;
  closesAt: string;
  candidates: VoteCandidate[];
  onVoteClosed: () => void;
}

/** 디자인 문구예요(투표-03). 고르기 전 [투표하기] 위에 떠요. */
const CHOOSE_HINT = "가장 크게 흔들린 보살을 선택하세요";

/**
 * 후보 고르기예요(시안 투표-03~08). 첫 카드는 "오늘은 모두 보살"이고, 카드를 골라야 [투표하기]가 켜져요.
 * [투표하기]를 누르면 확인 시트가 열리고, 투표하면 투표 탭이 투표 완료로 바뀌어요.
 */
const VotingChoose = ({
  roomId,
  roundId,
  closesAt,
  candidates,
  onVoteClosed,
}: VotingChooseProps) => {
  const safeAreaBottom = useSafeAreaBottom();
  const [chosen, setChosen] = useState<ChoiceKey | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const choices: CandidateChoice[] = [
    { kind: "allBosal" },
    ...candidates.map(candidate => ({ kind: "member" as const, candidate })),
  ];
  const picked = candidates.find(candidate => candidate.memberId === chosen);
  // 투표 탭을 다시 받아 고른 후보가 목록에서 빠지면 고르기 전으로 돌아가요. 다른 대상으로 투표되지 않아요.
  const selected = chosen === "allBosal" || picked ? chosen : null;
  const target: VoteSubmitRequest = picked
    ? { targetType: "MEMBER", targetMemberId: picked.memberId }
    : { targetType: "ALL_BOSAL" };

  return (
    // 하단 탭바 자리(75px)를 뺀 높이를 채워요. 카드는 아래로 붙고, 남는 높이는 헤더와 카드 사이로 가요.
    <div
      style={{ "--safe-area-bottom": `${safeAreaBottom}px` } as CSSProperties}
      className="flex min-h-[calc(100svh-75px-var(--safe-area-bottom))] flex-col"
    >
      <VoteHeader closesAt={closesAt} onClosed={onVoteClosed} showAnonymousNotice={false} />
      {/* 시안처럼 카드 아래와 버튼 위 사이가 15px이에요. 버튼 위 끝이 탭바 자리 위 53px(아래 72px + 높이 56px - 탭바 75px)라 68px을 비워요.
          화면이 짧아도 헤더와 카드 사이는 시안의 14px보다 좁아지지 않아요. */}
      <div className="mt-auto pt-3.5 pb-[68px]">
        {/* 시안(투표-03)은 툴팁이 카드 아래에서 카드를 가리키고, 말풍선이 버튼 위에 겹쳐요. */}
        <Tooltip
          open={selected === null}
          size="small"
          placement="bottom"
          // 시안처럼 꼬리 끝이 카드에 7px 걸치고, 말풍선이 버튼 글자 바로 위에서 끝나요(카드 아래 끝에서 말풍선까지 1px).
          offset={1}
          messageAlign="center"
          message={CHOOSE_HINT}
        >
          <div>
            <CandidateCarousel
              choices={choices}
              selected={selected}
              // 같은 카드를 다시 누르면 고른 채로 둬요. 다른 카드를 누르면 바꿔요(화면설계서 20).
              onSelect={setChosen}
            />
          </div>
        </Tooltip>
      </div>
      {/* 시안처럼 하단 탭바(75px) 바로 위에 떠 있어요. */}
      <div className="fixed inset-x-0 bottom-[calc(72px+var(--safe-area-bottom))] px-5">
        {/* 시안은 고르기 전 버튼이 회색이에요. TDS 파란 버튼의 비활성은 연한 파랑이라 회색 버튼으로 바꿔요. */}
        <Button
          size="xlarge"
          display="block"
          color={selected === null ? "dark" : "primary"}
          variant={selected === null ? "weak" : "fill"}
          disabled={selected === null}
          onClick={() => setIsConfirmOpen(true)}
        >
          투표하기
        </Button>
      </div>
      <VoteConfirmSheet
        // 시트를 연 채로 고른 후보가 빠져도 닫아서 다른 대상으로 투표되지 않아요.
        open={isConfirmOpen && selected !== null}
        roomId={roomId}
        roundId={roundId}
        target={target}
        nickname={picked?.nickname}
        onClose={() => setIsConfirmOpen(false)}
      />
    </div>
  );
};

export default VotingChoose;
