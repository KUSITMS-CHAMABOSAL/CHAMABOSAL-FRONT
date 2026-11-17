import { type CSSProperties, useRef } from "react";

import { cn } from "@/shared/lib";

import bosalGrey from "../../assets/bosal_grey.svg";
import ring1 from "../../assets/ripple_ring_1.svg";
import ring2 from "../../assets/ripple_ring_2.svg";
import ring3 from "../../assets/ripple_ring_3.svg";
import ring4 from "../../assets/ripple_ring_4.svg";
import tapGlow from "../../assets/tap_glow.svg";
import { AT_REST, RIPPLE_RINGS } from "../../config/arrival";
import { EASE_IN_BACK, TOUR_MOTION } from "../../config/motion";
import { useArrivalMotion } from "../../model/useArrivalMotion";
import TourTitle from "../TourTitle";

interface TapStepProps {
  /** 이 화면으로 넘기기가 끝났는지예요. 끝나면 도착 연출을 시작해요. */
  arrived: boolean;
}

/** `RIPPLE_RINGS` 순서(07에서 아래부터)의 그림이에요. 06과 07의 같은 이름 원은 채움이 같아요. */
const RING_IMAGES = [ring1, ring2, ring3, ring4];

const ringStyles = RIPPLE_RINGS.map(
  ring =>
    ({
      "--ring-x": `${ring.to.x}px`,
      "--ring-y": `${ring.to.y}px`,
      "--ring-size": `${ring.to.size}px`,
      "--tour-from": ring.fromTransform,
    }) as CSSProperties,
);

/**
 * 온보딩-06 → 07 이마 톡톡이에요. 도착하면 이마의 원 4개가 한 번 퍼져요.
 * 원은 07 크기로 그려 두고 06 자리로 줄여 놓았다가 transform으로 키워요. 그림이 커져도 흐려지지 않아요.
 */
const TapStep = ({ arrived }: TapStepProps) => {
  const ringRefs = useRef<(HTMLDivElement | null)[]>([]);

  const played = useArrivalMotion(arrived, TOUR_MOTION.rippleDelayMs, () =>
    RIPPLE_RINGS.flatMap((ring, index) => {
      const element = ringRefs.current[index];
      if (!element) return [];
      return [
        element.animate([{ transform: ring.fromTransform }, { transform: AT_REST }], {
          duration: TOUR_MOTION.rippleMs,
          easing: EASE_IN_BACK,
          fill: "both",
        }),
      ];
    }),
  );

  return (
    <>
      <img
        src={tapGlow}
        alt=""
        className="absolute top-[7px] left-[-132px] size-[639px] max-w-none"
      />
      <img
        src={bosalGrey}
        alt=""
        className="absolute top-[214px] left-[-5px] h-[607.13px] w-[384.3px] max-w-none"
      />
      {RIPPLE_RINGS.map((ring, index) => (
        <div
          key={ring.name}
          ref={element => {
            ringRefs.current[index] = element;
          }}
          style={ringStyles[index]}
          className={cn(
            "absolute top-(--ring-y) left-(--ring-x) size-(--ring-size) origin-top-left",
            !played && "[transform:var(--tour-from)]",
          )}
        >
          <img src={RING_IMAGES[index]} alt="" className="size-full" />
        </div>
      ))}
      <TourTitle
        matched
        title="뽑힌 친구에게는 이마 톡톡!"
        description="이마를 톡톡 치면 욕구가 줄어든대요"
        className="top-[98px]"
      />
    </>
  );
};

export default TapStep;
