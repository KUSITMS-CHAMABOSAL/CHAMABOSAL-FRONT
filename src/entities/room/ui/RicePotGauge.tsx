import { type CSSProperties, useEffect, useLayoutEffect, useRef, useState } from "react";

import { Paragraph, ProgressBar } from "@toss/tds-mobile";

import { cn } from "@/shared/lib";

import riceBowl from "../assets/icon_rice_bowl.svg";

interface RicePotGaugeProps {
  /** 지금까지 모은 공양미(석)예요. */
  rice: number;
  /** 한 솥 용량(석)이에요. 서버 `pot.goalAmount` */
  capacity: number;
  /** 가득 채우면 다 같이 받는 공양미(석)예요. 서버 `pot.rewardAmount` */
  reward: number;
  /** 방을 만든 뒤 함께 참은 날 수예요. */
  days: number;
  /** 지난번에 본 뒤로 공양미가 들어왔으면 그때 찬 석이에요. 이 값에서 `rice`까지 차오르고 `+n석`이 떠올라요. */
  gainFrom?: number;
}

/** 화면이 자리 잡은 뒤 차오르기 시작해요. 들어오자마자 차오르면 놓쳐요. */
const FILL_DELAY_MS = 400;
/** TDS ProgressBar의 채움 전환(transform 0.5s ease-in-out)과 같아요. 밥그릇이 바 끝과 같이 움직여요. */
const FILL_MS = 500;
const FILL_EASING = "ease-in-out";

// 다 차오르면 밥그릇이 한 번 튀고, 옆에 `+n석`이 떠올랐다 사라져요.
const POP: Keyframe[] = [
  { transform: "scale(1)" },
  { transform: "scale(1.2)", offset: 0.4 },
  { transform: "scale(1)" },
];
const FLOAT_MS = 1200;
const FLOAT: Keyframe[] = [
  { opacity: 0, transform: "translateY(6px)" },
  { opacity: 1, transform: "translateY(0)", offset: 0.25 },
  { opacity: 1, transform: "translateY(0)", offset: 0.75 },
  { opacity: 0, transform: "translateY(-4px)" },
];

const BOWL_WIDTH = 26;
/** 밥그릇이 이보다 오른쪽이면 `+n석`을 밥그릇 왼쪽에 띄워요. 오른쪽에 띄우면 화면 밖으로 나가요. */
const FLOAT_FLIP_PROGRESS = 0.7;

/** 밥그릇 왼쪽 위치예요(시안 설명: 밥그릇 위치 = 바 폭 × 진행률 - 13). 양 끝에서는 바 안에 머물러요. */
const getBowlLeft = (trackWidth: number, progress: number) =>
  Math.min(Math.max(trackWidth * progress - BOWL_WIDTH / 2, 0), trackWidth - BOWL_WIDTH);

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * 공양미 한 솥 진행 바예요. 밥그릇이 진행 위치를 따라가요.
 * 공양미가 들어왔으면 이전 값에서 차오르고, 밥그릇 위로 `+n석`이 떠올라 들어온 걸 알려요.
 */
const RicePotGauge = ({ rice, capacity, reward, days, gainFrom }: RicePotGaugeProps) => {
  const toProgress = (value: number) => (capacity > 0 ? Math.min(value / capacity, 1) : 0);
  const gainKey = gainFrom !== undefined && gainFrom < rice ? `${gainFrom}:${rice}` : null;
  /** 차오르기를 시작한 공양미예요. 그 전까지는 이전 값으로 그려요. */
  const [filledKey, setFilledKey] = useState<string | null>(null);
  const isWaiting = gainKey !== null && filledKey !== gainKey && !prefersReducedMotion();
  const shown = isWaiting && gainFrom !== undefined ? gainFrom : rice;
  const progress = toProgress(shown);

  const trackRef = useRef<HTMLDivElement>(null);
  const bowlRef = useRef<HTMLDivElement>(null);
  const bowlImageRef = useRef<HTMLImageElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gainKey || prefersReducedMotion()) return;
    const timer = window.setTimeout(() => setFilledKey(gainKey), FILL_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [gainKey]);

  // 바는 TDS 전환으로 차올라요. 밥그릇은 `left`가 바로 바뀌어서, 이전 자리에서 `transform`으로 따라가게 해요.
  useLayoutEffect(() => {
    if (!gainKey || filledKey !== gainKey || gainFrom === undefined) return;
    const width = trackRef.current?.getBoundingClientRect().width ?? 0;
    const offset = getBowlLeft(width, toProgress(gainFrom)) - getBowlLeft(width, toProgress(rice));
    const move = bowlRef.current?.animate(
      [{ transform: `translateX(${offset}px)` }, { transform: "translateX(0)" }],
      { duration: FILL_MS, easing: FILL_EASING },
    );
    let pop: Animation | undefined;
    let float: Animation | undefined;
    const timer = window.setTimeout(() => {
      pop = bowlImageRef.current?.animate(POP, { duration: 360, easing: "ease-out" });
      float = floatRef.current?.animate(FLOAT, { duration: FLOAT_MS, easing: "ease-out" });
    }, FILL_MS);
    return () => {
      window.clearTimeout(timer);
      [move, pop, float].forEach(animation => animation?.cancel());
    };
    // 차오르기를 시작할 때 한 번만 재생해요.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filledKey]);

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
          {`${shown} `}
          <Paragraph.Text typography="t5" color="var(--adaptiveGrey400)">
            {`/ ${capacity}석`}
          </Paragraph.Text>
        </Paragraph>
      </div>
      <div ref={trackRef} className="relative mt-[3px] h-[34px]">
        {/* 따라가기(translate), 튀기(scale), 떠오르기를 각각 다른 요소에 걸어요. 같은 요소면 transform이 서로 덮어써요. */}
        <div
          ref={bowlRef}
          className="absolute top-[2px] left-[clamp(0px,calc(100%*var(--progress)-13px),calc(100%-26px))] mx-[1.3px]"
          style={{ "--progress": progress } as CSSProperties}
        >
          <img
            ref={bowlImageRef}
            src={riceBowl}
            alt=""
            width={23.4}
            height={22.14}
            className="block max-w-none origin-bottom select-none"
          />
          {gainKey && gainFrom !== undefined && (
            <div
              ref={floatRef}
              aria-hidden
              // 밥그릇 위에 띄우면 왼쪽에 있을 때 위의 큰 숫자(`150 / 300석`)와 겹쳐서, 밥그릇과 같은 줄 옆에 띄워요.
              className={cn(
                "pointer-events-none absolute top-[3px] w-max whitespace-nowrap opacity-0",
                progress > FLOAT_FLIP_PROGRESS ? "right-full mr-1" : "left-full ml-1",
              )}
            >
              <Paragraph typography="t7" fontWeight="bold" color="var(--adaptiveBlue600)">
                {`+${rice - gainFrom}석`}
              </Paragraph>
            </div>
          )}
        </div>
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
          {`+${reward}석`}
        </Paragraph>
      </div>
    </div>
  );
};

export default RicePotGauge;
