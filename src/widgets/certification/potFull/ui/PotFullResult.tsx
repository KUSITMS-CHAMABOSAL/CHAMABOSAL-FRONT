import { useState } from "react";

import { Button, Paragraph, TextButton } from "@toss/tds-mobile";

import bottomFade from "../assets/bottom_fade.png";
import closeIcon from "../assets/icon_close_regular.svg";
import { DEMO_RANKS } from "../config/demoRanks";
import PotFullBackground from "./PotFullBackground";
import RankPodium from "./RankPodium";
import RiceFall from "./RiceFall";

interface PotFullResultProps {
  /** 방장이 정한 한 솥 목표 석수예요. */
  goal: number;
  onShop: () => void;
  onClose: () => void;
}

/**
 * 공양미 한 솥을 다 채운 결과 화면이에요. 상단 내비게이션 바는 토스가 그려요.
 * 위쪽 문구는 화면 위에, 밥더미·순위·버튼은 화면 아래에 붙여 기기 높이가 달라도 순위가 밥더미 위에 놓여요.
 * 배경은 시안 원본 그대로 두고 그 위에 쌀알 낙하만 얹어요. 쌀이 다 쌓인 뒤에 순위 카드가 나와요.
 */
const PotFullResult = ({ goal, onShop, onClose }: PotFullResultProps) => {
  const [isSettled, setIsSettled] = useState(false);

  return (
    <div className="relative h-svh overflow-hidden bg-(--adaptiveBackground)">
      <PotFullBackground />
      <RiceFall onSettled={() => setIsSettled(true)} />

      <div className="absolute inset-x-0 top-[47px] flex flex-col items-center gap-2.5 text-center">
        <Paragraph typography="st5" fontWeight="bold" color="var(--adaptiveGrey900)">
          공양미 한 솥을
          <br />다 채웠어요!
        </Paragraph>
        <Paragraph typography="t7" fontWeight="semibold" color="var(--adaptiveGrey900)">
          목표했던 공양미 <span className="text-(color:--adaptiveBlue600)!">{`${goal}석`}</span>을
          모두 채웠어요
        </Paragraph>
      </div>

      <RankPodium ranks={DEMO_RANKS} revealed={isSettled} />

      {/* 시안의 Top Gradient예요. 화면 아래를 흰색으로 덮어요. */}
      <img
        src={bottomFade}
        alt=""
        width={375}
        height={190}
        className="pointer-events-none absolute bottom-0 left-1/2 h-[190px] w-full max-w-none -translate-x-1/2 select-none"
      />
      <div className="absolute inset-x-0 bottom-[60px] flex flex-col items-center gap-[18px]">
        <Button size="medium" onClick={onShop}>
          아이템 사러가기
        </Button>
        <TextButton
          size="small"
          fontWeight="semibold"
          color="var(--adaptiveGrey900)"
          onClick={onClose}
          className="w-[133px]! items-center justify-center px-6! py-3.5!"
        >
          <img src={closeIcon} alt="" width={13} height={13} className="m-[3.5px] mr-[15.5px]" />
          닫기
        </TextButton>
      </div>
    </div>
  );
};

export default PotFullResult;
