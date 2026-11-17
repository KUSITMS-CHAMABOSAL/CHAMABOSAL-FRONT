import { Paragraph, Slider, SliderTooltip } from "@toss/tds-mobile";

import { POT_GOAL_MAX, POT_GOAL_MIN, POT_GOAL_STEP } from "@/entities/room";
import { cn } from "@/shared/lib";

import { estimatePotDays } from "../lib/estimatePotDays";

/** 지금 값 라벨이 양 끝 라벨과 겹치기 시작하는 비율이에요. */
const EDGE_RATIO = 0.18;

interface PotGoalSliderProps {
  value: number;
  memberLimit: number;
  onChange: (value: number) => void;
}

/** 목표 공양미 슬라이더예요. 손잡이 위에 지금 값, 아래에 예상 기간을 보여줘요. */
const PotGoalSlider = ({ value, memberLimit, onChange }: PotGoalSliderProps) => {
  const ratio = (value - POT_GOAL_MIN) / (POT_GOAL_MAX - POT_GOAL_MIN);
  const days = estimatePotDays(memberLimit, value);

  return (
    <section className="flex flex-col">
      <Paragraph
        className="px-5"
        typography="t6"
        fontWeight="semibold"
        color="var(--adaptiveGrey800)"
      >
        목표 공양미 설정
      </Paragraph>
      {/* 손잡이 폭(26)만큼 트랙 안쪽에서 지금 값 라벨이 손잡이를 따라가요. */}
      <div className="relative mt-3.5 h-5 px-5" aria-hidden>
        <Paragraph
          typography="t7"
          color="var(--adaptiveGrey600)"
          className={cn("absolute left-5", ratio < EDGE_RATIO && "invisible")}
        >
          {`${POT_GOAL_MIN}석`}
        </Paragraph>
        <Paragraph
          typography="t7"
          fontWeight="semibold"
          color="var(--adaptiveBlue600)"
          className="absolute left-[calc(37px+var(--ratio)*(100%-74px))] -translate-x-1/2"
          style={{ "--ratio": ratio } as React.CSSProperties}
        >
          {`${value}석`}
        </Paragraph>
        <Paragraph
          typography="t7"
          color="var(--adaptiveGrey600)"
          className={cn("absolute right-5", ratio > 1 - EDGE_RATIO && "invisible")}
        >
          {`${POT_GOAL_MAX}석`}
        </Paragraph>
      </div>
      <div className="px-6">
        <Slider
          value={value}
          minValue={POT_GOAL_MIN}
          maxValue={POT_GOAL_MAX}
          step={POT_GOAL_STEP}
          aria-label="목표 공양미"
          aria-valuetext={`${value}석, ${memberLimit}명이면 약 ${days}일 예상`}
          onValueChange={onChange}
          tooltip={
            <SliderTooltip
              placement="bottom"
              message={
                <span>
                  <span className="text-(color:--adaptiveGrey500)">{memberLimit}</span>명이면 약{" "}
                  <span className="text-(color:--adaptiveBlue600)">{days}</span>일 예상
                </span>
              }
            />
          }
        />
      </div>
    </section>
  );
};

export default PotGoalSlider;
