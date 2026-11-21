import type { CSSProperties } from "react";
import { Paragraph } from "@toss/tds-mobile";

import { BosalHead, BosalStatusBadge } from "@/entities/bosal";
import type { VoteCandidate } from "@/entities/vote";

import { REEL_MIN_CARDS, REEL_PITCH_PX, REEL_STEPS, REEL_TILTS } from "../config/motion";
import { getCandidateStatus } from "../lib/candidateStatus";

interface CandidateReelProps {
  candidates: VoteCandidate[];
}

/** 카드 너비예요. 시안 162px */
const CARD_WIDTH = 162;

/**
 * 투표하러 가기 화면의 후보 미리보기예요. 카드가 옆으로 흘러가 튕기듯 멈추고, 반대로 돌아와 또 멈추기를 되풀이해요.
 * 끝까지 흘러가도 화면이 비지 않게 후보를 이어 붙여 그리고, 같은 후보가 반복되는 카드는 화면 읽기에서 빼요.
 */
const CandidateReel = ({ candidates }: CandidateReelProps) => {
  const rounds = Math.ceil(REEL_MIN_CARDS / candidates.length);
  const cards = Array.from({ length: rounds }, () => candidates).flat();
  const style = {
    "--reel-gap": `${REEL_PITCH_PX - CARD_WIDTH}px`,
    "--reel-distance": `-${REEL_PITCH_PX * REEL_STEPS}px`,
  } as CSSProperties;

  return (
    <div className="overflow-hidden py-3">
      {/* 첫 카드가 화면 가운데에서 시작해요. */}
      <ul
        role="list"
        aria-label="오늘의 후보"
        style={style}
        className="motion-safe:animate-vote-reel m-0! flex w-max list-none gap-(--reel-gap) p-0! pl-[calc(50vw-81px)]!"
      >
        {cards.map((candidate, index) => {
          const tilt = REEL_TILTS[index % REEL_TILTS.length];
          return (
            <li
              key={index}
              aria-hidden={index >= candidates.length || undefined}
              style={{ "--tilt": `${tilt.rotate}deg`, "--lift": `${tilt.y}px` } as CSSProperties}
              className="flex h-[168px] w-[162px] shrink-0 translate-y-(--lift) rotate-(--tilt) flex-col items-center gap-1 rounded-[10px] border border-solid border-(--adaptiveGreyOpacity200) bg-(--adaptiveBackground) p-3"
            >
              <BosalStatusBadge status={getCandidateStatus(candidate)} />
              <div className="flex h-[95px] w-full justify-center pt-2">
                <BosalHead color={candidate.color} className="h-[82px] w-20" />
              </div>
              <Paragraph typography="t6" fontWeight="bold" color="var(--adaptiveGrey900)">
                {`${candidate.nickname} 보살`}
              </Paragraph>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default CandidateReel;
