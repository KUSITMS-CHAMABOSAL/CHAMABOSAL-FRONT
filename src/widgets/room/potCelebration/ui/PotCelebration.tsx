import { type CSSProperties, useState } from "react";
import { Button, Paragraph } from "@toss/tds-mobile";

import { BosalHead } from "@/entities/bosal";
import { useConfirmPotSeen } from "@/features/room/confirmPotSeen";
import type { PotCelebration as PotCelebrationData, PotContribution } from "@/entities/room";
import { cn } from "@/shared/lib";

import { CloseIcon, LotusIcon } from "../assets";
import background from "../assets/background_glow.svg";
import { RANK_REVEAL_MS, RANK_REVEAL_STEPS } from "../config/motion";
import RiceFall from "./RiceFall";

interface PotCelebrationProps {
  roomId: number;
  pot: PotCelebrationData;
  onClose: () => void;
  onShop: () => void;
}

/** 순위마다 시안의 배지 색이에요(금·은·동). 같은 석이면 같은 순위라 색도 같아요. 얼굴은 각자의 보살 색이에요. */
const RANK_BADGE_COLORS: Record<number, string> = {
  1: "text-(color:--adaptiveYellow600)",
  2: "text-(color:--adaptiveGrey500)",
  3: "text-(color:--adaptiveOrange600)",
};

/**
 * 4등 이하 줄 → 3등 → 2등 → 1등 단계마다 언제, 얼마나 아래에서, 어떤 곡선으로 나올지예요.
 * 4등 이하가 없으면 그 단계를 건너뛰고 3등부터 기다려요.
 */
const getRevealStyles = (hasRest: boolean) => {
  let at = 0;
  return RANK_REVEAL_STEPS.map((step, index) => {
    if (index === 0 && !hasRest) return undefined;
    at += step.waitMs;
    const style = {
      "--rank-delay": `${at}ms`,
      "--rank-rise": `${step.risePx}px`,
      "--rank-ease": step.easing,
    } as CSSProperties;
    at += RANK_REVEAL_MS;
    return style;
  });
};

interface RankCardProps {
  contribution: PotContribution;
  revealStyle?: CSSProperties;
  /** 쌀이 다 쌓이면 true가 되고, 그때부터 차례로 나와요. */
  revealed: boolean;
  className?: string;
}

const RankCard = ({ contribution, revealStyle, revealed, className }: RankCardProps) => {
  const badgeColor = RANK_BADGE_COLORS[contribution.rank] ?? RANK_BADGE_COLORS[3];
  return (
    <li
      style={revealStyle}
      className={cn(
        "flex w-[97px] flex-col items-center gap-2",
        revealed ? "motion-safe:animate-pot-rank-in" : "opacity-0",
        className,
      )}
    >
      <span
        className={cn(
          "flex items-center gap-1 rounded-[14px] bg-(--adaptiveBackground) px-2.5 py-1.5",
          badgeColor,
        )}
      >
        <LotusIcon aria-hidden className="size-[15px]" />
        <Paragraph typography="t7" fontWeight="semibold" color="currentColor">
          {`${contribution.rank}등`}
        </Paragraph>
      </span>
      <div className="flex w-full flex-col items-center gap-2.5 rounded-2xl bg-(--adaptiveBackground)/60 px-1 py-2.5">
        <BosalHead color={contribution.color} />
        <div className="flex w-full flex-col items-center gap-0.5">
          <Paragraph
            typography="t6"
            fontWeight="semibold"
            color="var(--adaptiveGrey900)"
            className="w-full truncate text-center!"
          >
            {contribution.nickname}
          </Paragraph>
          <Paragraph typography="t7" fontWeight="medium" color="var(--adaptiveBlue600)">
            {`${contribution.amount}석`}
          </Paragraph>
        </div>
      </div>
    </li>
  );
};

/** 한 솥 축하예요. 많이 넣은 3명은 시상대처럼, 4등부터는 아래 줄에 보여줘요. 닫거나 곳간으로 가면 본 것으로 저장해요. */
const PotCelebration = ({ roomId, pot, onClose, onShop }: PotCelebrationProps) => {
  const { mutate: confirmSeen, isPending } = useConfirmPotSeen(roomId);
  // 쌀알이 다 떨어져 밥더미가 차오른 뒤에 순위가 나와요. 나오기 전에는 자리만 잡아 둬요.
  const [isSettled, setIsSettled] = useState(false);
  const [first, second, third, ...rest] = pot.contributions;
  const [restStyle, thirdStyle, secondStyle, firstStyle] = getRevealStyles(rest.length > 0);

  // 저장에 실패해도 나가요. 안 본 축하로 남으면 다음에 방 홈에서 다시 떠요.
  const leave = (next: () => void) => confirmSeen(pot.seq, { onSettled: next });

  return (
    <main className="relative min-h-svh overflow-hidden bg-(--adaptiveBackground)">
      {/* 뒤의 빛이에요. 밥더미와 쌀알은 쌓이면서 커지도록 RiceFall이 그려요. */}
      <img
        src={background}
        alt=""
        width={375}
        height={812}
        className="pointer-events-none absolute inset-x-0 bottom-0 h-auto w-full"
      />
      <RiceFall onSettled={() => setIsSettled(true)} />
      {/* 본문은 화면 높이의 9.8%만큼 내려와요(888px 화면에서 87px). 기기 높이가 달라도 같은 비율에 놓여요. */}
      <div className="relative flex flex-col items-center gap-2.5 pt-[9.8svh] text-center">
        <Paragraph as="h1" typography="st5" fontWeight="bold" color="var(--adaptiveGrey900)">
          {"공양미 한 솥을\n다 채웠어요!"}
        </Paragraph>
        <Paragraph typography="t7" fontWeight="semibold" color="var(--adaptiveGrey900)">
          {"목표했던 공양미 "}
          <span className="text-(color:--adaptiveBlue600)!">{`${pot.goalAmount}석`}</span>
          {"을 모두 채웠어요"}
        </Paragraph>
      </div>
      <ol
        aria-label="많이 넣은 순서"
        role="list"
        className="relative mx-0! mt-6.25! mb-0! flex list-none justify-center gap-2.5 p-0!"
      >
        {second && (
          <RankCard
            contribution={second}
            revealStyle={secondStyle}
            revealed={isSettled}
            className="order-1 mt-7.5"
          />
        )}
        {first && (
          <RankCard
            contribution={first}
            revealStyle={firstStyle}
            revealed={isSettled}
            className="order-2"
          />
        )}
        {third && (
          <RankCard
            contribution={third}
            revealStyle={thirdStyle}
            revealed={isSettled}
            className="order-3 mt-7.5"
          />
        )}
      </ol>
      {rest.length > 0 && (
        <ol role="list" className="relative mx-0! mt-14.25! mb-0! list-none p-0! px-5!">
          {rest.map(contribution => (
            <li
              key={contribution.memberId}
              style={restStyle}
              className={cn(
                "border-0 border-t border-dashed border-(--adaptiveGreyOpacity200) py-3",
                isSettled ? "motion-safe:animate-pot-rank-in" : "opacity-0",
              )}
            >
              <div className="mx-auto flex w-[277px] items-center justify-between">
                <Paragraph typography="t6" fontWeight="semibold" color="var(--adaptiveGrey900)">
                  {contribution.nickname}
                </Paragraph>
                <Paragraph typography="t7" fontWeight="medium" color="var(--adaptiveBlue600)">
                  {`${contribution.amount}석`}
                </Paragraph>
              </div>
            </li>
          ))}
        </ol>
      )}
      {/* 솥 몸통을 덮는 흰 그라데이션 위에 버튼이 있어요. */}
      <div className="fixed inset-x-0 bottom-0 flex h-[190px] flex-col items-center justify-end gap-4.5 bg-linear-to-b from-transparent to-(--adaptiveBackground) to-40% pb-15">
        <Button size="medium" loading={isPending} onClick={() => leave(onShop)}>
          아이템 사러가기
        </Button>
        <button
          type="button"
          disabled={isPending}
          onClick={() => leave(onClose)}
          className="flex cursor-pointer appearance-none items-center gap-3 border-0 bg-transparent px-6 py-3.5"
        >
          <span className="flex size-5 items-center justify-center">
            <CloseIcon aria-hidden className="size-[13px] text-(color:--adaptiveGrey800)" />
          </span>
          <Paragraph typography="t6" fontWeight="semibold" color="var(--adaptiveGrey900)">
            닫기
          </Paragraph>
        </button>
      </div>
    </main>
  );
};

export default PotCelebration;
