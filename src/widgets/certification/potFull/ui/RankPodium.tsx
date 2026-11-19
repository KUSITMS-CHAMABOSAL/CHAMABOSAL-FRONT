import type { CSSProperties } from "react";

import { Paragraph } from "@toss/tds-mobile";

import { cn } from "@/shared/lib";

import divider from "../assets/divider.svg";
import bosalFaceGrey from "../assets/bosal_face_grey.svg";
import bosalFaceOrange from "../assets/bosal_face_orange.svg";
import bosalFaceYellow from "../assets/bosal_face_yellow.svg";
import bosalHeadGrey from "../assets/bosal_head_grey.svg";
import bosalHeadOrange from "../assets/bosal_head_orange.svg";
import bosalHeadYellow from "../assets/bosal_head_yellow.svg";
import lotusFirst from "../assets/lotus_first.svg";
import lotusSecond from "../assets/lotus_second.svg";
import lotusThird from "../assets/lotus_third.svg";
import type { BosalColor, PotRank } from "../config/demoRanks";
import { RANK_REVEAL_INTERVAL_MS, RANK_REVEAL_START_MS } from "../config/motion";

interface RankPodiumProps {
  ranks: PotRank[];
  /** 쌀이 다 쌓이면 true가 되고, 그때부터 차례로 나와요. */
  revealed: boolean;
}

// 등수 배지(연꽃 색)는 등수를 따르고, 얼굴은 각자 부여받은 보살 색을 따라요(시안 주석).
const PODIUM = {
  1: { lotus: lotusFirst, color: "var(--adaptiveYellow600)" },
  2: { lotus: lotusSecond, color: "var(--adaptiveGrey500)" },
  3: { lotus: lotusThird, color: "var(--adaptiveOrange600)" },
} as const;
const BOSAL_FACE: Record<BosalColor, { head: string; face: string }> = {
  yellow: { head: bosalHeadYellow, face: bosalFaceYellow },
  grey: { head: bosalHeadGrey, face: bosalFaceGrey },
  orange: { head: bosalHeadOrange, face: bosalFaceOrange },
};
/** 왼쪽부터 2등, 1등, 3등 자리예요. */
const PODIUM_ORDER = [2, 1, 3] as const;

// 쌀이 다 쌓인 뒤 4등 → 3등 → 2등 → 1등 순서로 나와요. 고정된 값으로 한 번 재생하니 CSS 키프레임이면 충분해요.
// 나오기 전에는 opacity 0으로 자리만 잡아 둬서, 나올 때 레이아웃이 다시 계산되지 않아요.
const revealDelay = (rank: number) =>
  ({
    "--delay": `${RANK_REVEAL_START_MS + (4 - rank) * RANK_REVEAL_INTERVAL_MS}ms`,
  }) as CSSProperties;

const RiceAmount = ({ rice }: { rice: number }) => (
  <Paragraph typography="t7" fontWeight="medium" color="var(--adaptiveBlue600)">
    {`${rice}석`}
  </Paragraph>
);

const RankPodium = ({ ranks, revealed }: RankPodiumProps) => {
  const byRank = new Map(ranks.map(rank => [rank.rank, rank]));
  const fourth = byRank.get(4);

  return (
    <>
      <ol className="absolute inset-x-0 bottom-[373px] m-0! flex list-none items-end justify-center gap-2.5 p-0!">
        {PODIUM_ORDER.map(rank => {
          const entry = byRank.get(rank);
          if (!entry) return null;
          const look = PODIUM[rank];
          const bosal = BOSAL_FACE[entry.bosalColor];
          return (
            <li
              key={rank}
              className={cn(
                "flex w-[97px] flex-col items-center gap-2",
                rank === 1 && "mb-[30px]",
                revealed && "motion-safe:animate-rank-in",
                !revealed && "opacity-0",
              )}
              style={revealDelay(rank)}
            >
              <div className="flex items-center gap-1 rounded-[14px] bg-(--adaptiveBackground) px-2.5 py-1.5">
                <img src={look.lotus} alt="" width={15} height={15} />
                <Paragraph typography="t7" fontWeight="semibold" color={look.color}>
                  {`${rank}등`}
                </Paragraph>
              </div>
              <div className="flex w-full flex-col items-center gap-2.5 rounded-2xl bg-(--adaptiveBackground)/60 py-2.5">
                <div className="relative h-[41.85px] w-[41px]">
                  <img
                    src={bosal.head}
                    alt=""
                    width={41}
                    height={41.85}
                    className="absolute inset-0"
                  />
                  <img
                    src={bosal.face}
                    alt=""
                    width={20.97}
                    height={15.67}
                    className="absolute top-[21.17px] left-[10.28px]"
                  />
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <Paragraph typography="t6" fontWeight="semibold" color="var(--adaptiveGrey900)">
                    {entry.name}
                  </Paragraph>
                  <RiceAmount rice={entry.rice} />
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      {fourth && (
        <div
          className={cn(
            "absolute inset-x-0 bottom-[264px] flex flex-col items-center",
            revealed && "motion-safe:animate-rank-in",
            !revealed && "opacity-0",
          )}
          style={revealDelay(4)}
        >
          <img src={divider} alt="" width={335} height={1} />
          <div className="flex h-[42px] w-[277px] items-center justify-between">
            <Paragraph typography="t6" fontWeight="semibold" color="var(--adaptiveGrey900)">
              {fourth.name}
            </Paragraph>
            <RiceAmount rice={fourth.rice} />
          </div>
        </div>
      )}
    </>
  );
};

export default RankPodium;
