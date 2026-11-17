import { type ComponentType, type CSSProperties } from "react";

import { cn } from "@/shared/lib";

import { CONTROL_TONES } from "../config/stage";
import { useServiceTour } from "../model/useServiceTour";
import { useStageScale } from "../model/useStageScale";
import CertifyStep from "./steps/CertifyStep";
import IntroStep from "./steps/IntroStep";
import InviteStep from "./steps/InviteStep";
import OfferingStep from "./steps/OfferingStep";
import TapStep from "./steps/TapStep";
import VoteStep from "./steps/VoteStep";
import TourControls from "./TourControls";
import TourStage from "./TourStage";

/**
 * 시안 온보딩-01 ~ 08을 화면 6장으로 묶었어요. 02·03, 06·07은 한 화면 안의 연출이에요.
 * `arrived`는 이 화면으로 넘기기가 끝났는지예요. 도착하고 시작하는 연출(봉투, 물결)이 써요.
 */
const STEPS: ComponentType<{ arrived: boolean }>[] = [
  IntroStep,
  InviteStep,
  CertifyStep,
  VoteStep,
  TapStep,
  OfferingStep,
];

interface ServiceTourProps {
  /** 마지막 화면을 넘기거나 [스킵하기]를 눌렀을 때예요. 본 기록은 저장한 뒤 불러요. */
  onFinish: () => void;
}

/**
 * 처음 들어온 사용자에게 서비스를 소개하는 온보딩이에요(Figma 「[new] 온보딩」).
 * 6장을 모두 마운트해 두고 지금 화면만 보여요. 넘길 때 그림을 새로 불러오느라 비어 보이지 않아요.
 */
const ServiceTour = ({ onFinish }: ServiceTourProps) => {
  const { rootRef, pageRef, toneRef, step, settled, next, skip, swipeHandlers } =
    useServiceTour(onFinish);
  const scale = useStageScale(rootRef);

  return (
    <div
      ref={rootRef}
      style={{ "--tour-scale": scale } as CSSProperties}
      className="relative h-svh touch-none overflow-hidden bg-linear-to-b from-white to-(color:--adaptiveGreen50) select-none"
      {...swipeHandlers}
    >
      {STEPS.map((Step, index) => (
        <section
          key={index}
          ref={pageRef(index)}
          aria-hidden={index !== step}
          className={cn("absolute inset-0", index !== step && "invisible")}
        >
          <TourStage>
            <Step arrived={settled && index === step} />
          </TourStage>
        </section>
      ))}
      <TourStage className="pointer-events-none">
        <TourControls
          tone={CONTROL_TONES[step]}
          lightRef={toneRef("light")}
          darkRef={toneRef("dark")}
          onNext={next}
          onSkip={skip}
        />
      </TourStage>
    </div>
  );
};

export default ServiceTour;
