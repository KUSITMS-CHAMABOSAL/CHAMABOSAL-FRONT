import { type CSSProperties, useEffect, useRef, useState } from "react";

import { FixedBottomCTA, Paragraph, Tooltip, Top } from "@toss/tds-mobile";

import { useForeheadTaps } from "@/features/vote/tapForehead";
import { cn } from "@/shared/lib";
import { triggerTapHaptic } from "@/shared/lib/appsInToss";

import glowBase from "../assets/glow_base.svg";
import glowGold from "../assets/glow_gold.svg";
import glowTeal from "../assets/glow_teal.svg";
import bosalBody from "../assets/tapped_bosal_body.svg";
import bosalFace from "../assets/tapped_bosal_face.svg";
import bosalHair from "../assets/tapped_bosal_hair.svg";
import { BOSAL, GLOWS, type GlowKind, PULSE, STAGE, TOOLTIP_MS } from "../config/scene";

interface ForeheadTapProps {
  roundId: number;
  /** 지목된 친구의 닉네임이에요. */
  nickname: string;
  /** [종료하기]예요. 친 횟수는 화면을 떠날 때 보내요. */
  onQuit: () => void;
}

const GLOW_SRC: Record<GlowKind, string> = { base: glowBase, teal: glowTeal, gold: glowGold };

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * 지금 모양에서 출발해 친 순간 모양을 거쳐 쉬는 모양으로 돌아와요.
 * 연타하면 앞 동작이 멈춘 자리에서 다시 출발해서 튀지 않아요.
 * Tailwind의 `scale-*`와 겹치지 않게 `transform` 대신 `scale` 속성을 움직여요.
 */
const pulse = (element: HTMLElement | null, pressed: Keyframe, rest: Keyframe) => {
  if (!element) return;
  const now = getComputedStyle(element);
  element.getAnimations().forEach(animation => animation.cancel());
  element.animate(
    [
      { scale: now.scale, opacity: now.opacity, easing: "cubic-bezier(0.33, 1, 0.68, 1)" },
      { ...pressed, offset: PULSE.peakAt, easing: "cubic-bezier(0.32, 0, 0.67, 0)" },
      rest,
    ],
    { duration: PULSE.durationMs },
  );
};

/** 쉬는 모양이에요. 친 순간에만 나타나는 원은 작고 투명하게 숨겨 둬요. */
const glowRest = (index: number): Keyframe =>
  GLOWS[index].pressedOnly ? { scale: "0.5", opacity: 0 } : { scale: "1", opacity: 1 };

/** 친 순간 시안-02의 크기예요. 원은 쉬는 크기로 그려 두고 늘려요. */
const glowPressed = (index: number): Keyframe => ({
  scale: String(GLOWS[index].pressedSize / GLOWS[index].size),
  opacity: 1,
});

/**
 * 정신 차려! 톡톡이에요. 투표 결과로 지목된 친구의 이마를 횟수 제한 없이 톡톡 쳐요.
 * 칠 때마다 빛과 보살이 시안-02 모양으로 커졌다 돌아오고, 짧은 햅틱과 툴팁(2초)이 따라와요.
 */
const ForeheadTap = ({ roundId, nickname, onQuit }: ForeheadTapProps) => {
  const { count, tap } = useForeheadTaps(roundId);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const tooltipTimer = useRef<number | undefined>(undefined);
  const bosalRef = useRef<HTMLDivElement>(null);
  const glowRefs = useRef<(HTMLImageElement | null)[]>([]);

  useEffect(() => () => window.clearTimeout(tooltipTimer.current), []);

  const handleTap = () => {
    tap();
    // 시안 주석: 클릭 시 짧은 햅틱 필요
    triggerTapHaptic();
    setTooltipOpen(true);
    window.clearTimeout(tooltipTimer.current);
    tooltipTimer.current = window.setTimeout(() => setTooltipOpen(false), TOOLTIP_MS);
    if (prefersReducedMotion()) return;
    pulse(bosalRef.current, { scale: String(BOSAL.pressedScale) }, { scale: "1" });
    GLOWS.forEach((_, index) =>
      pulse(glowRefs.current[index], glowPressed(index), glowRest(index)),
    );
  };

  const glow = (index: number) => {
    const { kind, size, pressedOnly } = GLOWS[index];
    return (
      <img
        key={index}
        ref={element => {
          glowRefs.current[index] = element;
        }}
        src={GLOW_SRC[kind]}
        alt=""
        width={size}
        height={size}
        className={cn(
          "absolute top-(--center-y) left-1/2 -mt-(--half) -ml-(--half) block size-(--size) max-w-none",
          pressedOnly && "scale-50 opacity-0",
        )}
        style={
          {
            "--center-y": `${STAGE.glowCenterY}px`,
            "--size": `${size}px`,
            "--half": `${size / 2}px`,
          } as CSSProperties
        }
      />
    );
  };

  return (
    <main className="relative min-h-svh overflow-hidden bg-[linear-gradient(var(--adaptiveBackground)_25%,var(--color-forehead-tap-bottom))]">
      {/* 화면 아무 곳이나 쳐도 이마를 톡톡해요. 제목과 [종료하기]는 이 위에 그려요. */}
      <button
        type="button"
        aria-label={`${nickname}보살 이마 톡톡하기, 지금 ${count}번`}
        onClick={handleTap}
        className="absolute inset-0 m-0 cursor-pointer touch-manipulation appearance-none overflow-hidden border-0 bg-transparent p-0 select-none [-webkit-tap-highlight-color:transparent]"
      >
        <span aria-hidden className="pointer-events-none absolute inset-0">
          {glow(0)}
          <div
            ref={bosalRef}
            className="absolute top-(--top) left-1/2 -ml-(--half) h-(--height) w-(--width) origin-(--origin)"
            style={
              {
                "--top": `${STAGE.bosalTop}px`,
                "--width": `${BOSAL.width}px`,
                "--half": `${BOSAL.width / 2}px`,
                "--height": `${BOSAL.height}px`,
                "--origin": BOSAL.origin,
              } as CSSProperties
            }
          >
            <img src={bosalBody} alt="" className="absolute inset-0 block size-full max-w-none" />
            <img src={bosalHair} alt="" className="absolute inset-0 block size-full max-w-none" />
            <img
              src={bosalFace}
              alt=""
              className="absolute top-(--face-top) left-(--face-left) block h-(--face-height) w-(--face-width) max-w-none"
              style={
                {
                  "--face-top": `${BOSAL.face.top}px`,
                  "--face-left": `${BOSAL.face.left}px`,
                  "--face-width": `${BOSAL.face.width}px`,
                  "--face-height": `${BOSAL.face.height}px`,
                } as CSSProperties
              }
            />
          </div>
          {GLOWS.slice(1).map((_, index) => glow(index + 1))}
        </span>
      </button>

      <Top
        className="pointer-events-none relative z-10"
        subtitleTop={<Top.SubtitleParagraph size={13}>오늘의 투표 결과</Top.SubtitleParagraph>}
        title={<Top.TitleParagraph size={28}>정신 차려! 톡톡</Top.TitleParagraph>}
        subtitleBottom={<Top.SubtitleParagraph>무제한으로 톡톡할 수 있어요</Top.SubtitleParagraph>}
      />

      {/* 툴팁 꼬리가 보살 머리 위쪽 끝을 가리켜요. */}
      <div
        className="pointer-events-none absolute top-(--top) left-1/2 z-10"
        style={{ "--top": `${STAGE.bosalTop}px` } as CSSProperties}
      >
        {/* 시안처럼 꼬리 끝이 머리 위쪽에 닿게, 상자와 대상 사이를 꼬리 높이(11px)만 둬요. */}
        {/* 툴팁은 body에 따로 그려지고 안쪽에서 탭을 받아서, 떠 있어도 톡톡이 지나가게 막아요. */}
        <Tooltip
          className="pointer-events-none! [&_*]:pointer-events-none!"
          open={tooltipOpen}
          placement="top"
          offset={11}
          message="번뇌가 모두 사라지도록 톡톡!"
        >
          <span className="block size-0" />
        </Tooltip>
      </div>

      <div
        role="status"
        className="pointer-events-none absolute top-(--top) left-1/2 z-10 flex w-[183px] -translate-x-1/2 flex-col items-center gap-4 text-center"
        style={{ "--top": `${STAGE.countTop}px` } as CSSProperties}
      >
        {/* Paragraph는 문자열 자식에만 색을 입혀서 숫자를 문자열로 넘겨요. */}
        <Paragraph typography="t1" fontWeight="bold" color="var(--color-on-fill)">
          {String(count)}
        </Paragraph>
        <Paragraph typography="t7" fontWeight="semibold" color="var(--color-on-fill)">
          {`오늘은 ${nickname}보살 톡톡!`}
        </Paragraph>
      </div>

      <FixedBottomCTA color="dark" background="none" onClick={onQuit}>
        종료하기
      </FixedBottomCTA>
    </main>
  );
};

export default ForeheadTap;
