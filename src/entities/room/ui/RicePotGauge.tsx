import type { CSSProperties } from "react";

import { Paragraph, ProgressBar } from "@toss/tds-mobile";

import riceBowl from "../assets/icon_rice_bowl.svg";
import { POT_REWARD } from "../config/pot";

interface RicePotGaugeProps {
  /** 지금까지 모은 공양미(석)예요. */
  rice: number;
  /** 한 솥 용량(석)이에요. 서버 `pot.goalAmount` */
  capacity: number;
  /** 방을 만든 뒤 함께 참은 날 수예요. */
  days: number;
}

/**
 * 공양미 한 솥 진행 바예요. 밥그릇이 진행 위치를 따라가요(시안 설명: 밥그릇 위치 = 바 폭 × 진행률 - 13).
 */
const RicePotGauge = ({ rice, capacity, days }: RicePotGaugeProps) => {
  const progress = capacity > 0 ? Math.min(rice / capacity, 1) : 0;
  return (
    <div className="flex flex-col px-6 pt-5 pb-[19px]">
      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between">
          <Paragraph typography="t7" fontWeight="semibold" color="var(--adaptiveGrey600)">
            공양미 한 솥
          </Paragraph>
          <Paragraph typography="t7" fontWeight="bold" color="var(--adaptiveBlue600)">
            {`${days}일째 `}
            <Paragraph.Text fontWeight="medium" color="var(--adaptiveGreyOpacity600)">
              같이 참는중
            </Paragraph.Text>
          </Paragraph>
        </div>
        <Paragraph typography="st5" fontWeight="bold" color="var(--adaptiveGrey900)">
          {`${rice} `}
          <Paragraph.Text typography="t5" color="var(--adaptiveGrey400)">
            {`/ ${capacity}석`}
          </Paragraph.Text>
        </Paragraph>
      </div>
      <div className="relative mt-[3px] h-[34px]">
        <img
          src={riceBowl}
          alt=""
          width={23.4}
          height={22.14}
          className="absolute top-[2px] left-[clamp(0px,calc(100%*var(--progress)-13px),calc(100%-26px))] mx-[1.3px] max-w-none select-none"
          style={{ "--progress": progress } as CSSProperties}
        />
        <ProgressBar
          progress={progress}
          size="normal"
          color="var(--adaptiveBlue500)"
          className="absolute inset-x-0 top-[29px]"
        />
      </div>
      <div className="mt-1.5 flex justify-end gap-1.5">
        <Paragraph typography="st12" fontWeight="semibold" color="var(--adaptiveGreyOpacity600)">
          가득 채우면 다 같이
        </Paragraph>
        <Paragraph typography="st12" fontWeight="bold" color="var(--adaptiveBlue600)">
          {`+${POT_REWARD}석`}
        </Paragraph>
      </div>
    </div>
  );
};

export default RicePotGauge;
