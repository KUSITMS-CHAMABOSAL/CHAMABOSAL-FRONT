import { type CSSProperties, useRef } from "react";

import { cn } from "@/shared/lib";

import bosalLarge from "../../assets/bosal_large.svg";
import envelope from "../../assets/envelope.svg";
import cardEnd from "../../assets/invite_card_end.svg";
import cardStart from "../../assets/invite_card_start.svg";
import { AT_REST, CARD_REVEAL, ENVELOPE_FROM } from "../../config/arrival";
import { EASE_IN_BACK, TOUR_MOTION } from "../../config/motion";
import { MATCHED_LAYER } from "../../config/stage";
import { useArrivalMotion } from "../../model/useArrivalMotion";
import TourTitle from "../TourTitle";

interface InviteStepProps {
  /** 이 화면으로 넘기기가 끝났는지예요. 끝나면 도착 연출을 시작해요. */
  arrived: boolean;
}

const envelopeStyle = { "--tour-from": ENVELOPE_FROM } as CSSProperties;

/**
 * 온보딩-02 → 03 방 만들고 초대예요. 도착하면 봉투가 커지며 올라가고 카드 윗변이 내려와요.
 *
 * 카드 윗변은 높이를 줄이지 않고 transform 한 쌍으로 내려요. 바깥 틀(둥근 모서리, 잘라내기)은 아래로,
 * 안쪽 그림은 같은 거리만큼 위로 옮겨 그림은 제자리에 둔 채 위쪽만 잘려 나가요.
 * 카드 배경 그라디언트도 03 높이에 맞게 바뀌어서 03 카드를 겹쳐 두고 나타나게 해요.
 */
const InviteStep = ({ arrived }: InviteStepProps) => {
  const cardFrameRef = useRef<HTMLDivElement>(null);
  const cardArtRef = useRef<HTMLDivElement>(null);
  const cardEndRef = useRef<HTMLImageElement>(null);
  const envelopeRef = useRef<HTMLDivElement>(null);

  const played = useArrivalMotion(arrived, TOUR_MOTION.envelopeDelayMs, () => {
    const timing: KeyframeAnimationOptions = {
      duration: TOUR_MOTION.envelopeMs,
      easing: EASE_IN_BACK,
      fill: "both",
    };
    const targets = [
      [cardFrameRef.current, "translateY(0px)", `translateY(${CARD_REVEAL}px)`],
      [cardArtRef.current, "translateY(0px)", `translateY(${-CARD_REVEAL}px)`],
      [envelopeRef.current, ENVELOPE_FROM, AT_REST],
    ] as const;
    const moves = targets.flatMap(([element, from, to]) =>
      element ? [element.animate([{ transform: from }, { transform: to }], timing)] : [],
    );
    const fade = cardEndRef.current?.animate([{ opacity: 0 }, { opacity: 1 }], timing);
    return fade ? [...moves, fade] : moves;
  });

  return (
    <>
      <div
        ref={cardFrameRef}
        className={cn(
          "absolute top-[37px] left-[39px] h-[394px] w-[297px] overflow-hidden rounded-xl",
          played && "[transform:translateY(123px)]",
        )}
      >
        <div
          ref={cardArtRef}
          className={cn("relative size-full", played && "[transform:translateY(-123px)]")}
        >
          <img src={cardStart} alt="" className="absolute inset-0 size-full" />
          <img
            ref={cardEndRef}
            src={cardEnd}
            alt=""
            className={cn("absolute inset-x-0 bottom-0 h-[271px] w-full", !played && "opacity-0")}
          />
        </div>
      </div>
      <TourTitle
        matched
        title={"방을 만들고,\n친구를 초대해요"}
        description="함께 참을 친구를 초대해, 수행을 함께해요"
        className="top-[455px]"
      />
      <div
        data-match={MATCHED_LAYER.bosal}
        className="absolute top-[298px] left-[145px] h-[133px] w-[84.5px] origin-top-left"
      >
        {/* 01의 큰 보살과 같은 그림이라 줄여 써요. */}
        <img src={bosalLarge} alt="" className="size-full" />
      </div>
      <div
        ref={envelopeRef}
        style={envelopeStyle}
        className={cn(
          "absolute top-[14px] left-[77px] size-[222px] origin-top-left",
          !played && "[transform:var(--tour-from)]",
        )}
      >
        <img
          src={envelope}
          alt=""
          className="absolute top-[32.7px] left-[11.1px] h-[156.6px] w-[199.81px] max-w-none"
        />
      </div>
    </>
  );
};

export default InviteStep;
