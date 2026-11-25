import { useEffect, useRef } from "react";

import { Paragraph } from "@toss/tds-mobile";

import { BosalHead, type BosalColor } from "@/entities/bosal";
import { triggerTapHaptic } from "@/shared/lib/appsInToss";

import shield from "../assets/icon_shield_color.svg";
import ringDefended from "../assets/result_ring_defended.svg";

interface ShieldDefendSceneProps {
  color: BosalColor;
  /** 연출이 끝났어요. 감춰서 뒤의 방어 결과를 보여줘요. */
  onEnd: () => void;
}

/** 방패가 이마에 닿는 시점이에요. 이때 보살이 눌리고 링이 퍼지고 "방어!"가 튀어요. */
const HIT_MS = 420;
/** 모두 끝나고 화면이 걷히기 시작하는 시점이에요. */
const FADE_AT_MS = 1500;
const FADE_MS = 300;

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * 방어권을 쓴 순간의 "방어!" 연출이에요(설계서 24 ①-2). 뒤에서는 결과가 방어로 바뀌어요.
 * 위에서 떨어진 방패가 보살 이마에 쾅 붙고, 파란 링이 퍼지며 "방어!"가 튀어요. 1.8초 뒤 걷혀요.
 * 🔖 시안이 없어 기존 방어 결과 그림(파란 링, 방패)으로 코드에서 만들었어요. 시안이 오면 맞춰요.
 */
const ShieldDefendScene = ({ color, onEnd }: ShieldDefendSceneProps) => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const bosalRef = useRef<HTMLDivElement>(null);
  const shieldRef = useRef<HTMLImageElement>(null);
  const burstRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const onEndRef = useRef(onEnd);
  useEffect(() => {
    onEndRef.current = onEnd;
  });

  useEffect(() => {
    // 동작 줄이기 설정이면 연출 없이 바로 결과를 보여줘요.
    if (prefersReducedMotion()) {
      onEndRef.current();
      return;
    }
    const at = (delay: number, duration: number, easing: string) =>
      ({ delay, duration, easing, fill: "backwards" }) as const;
    const animations = [
      // 방패: 위에서 크게 떨어져 이마에 닿고 살짝 튕겨요.
      shieldRef.current?.animate(
        [
          { transform: "translateY(-180px) scale(1.8) rotate(-20deg)", opacity: 0 },
          { opacity: 1, offset: 0.3 },
          { transform: "translateY(0) scale(0.9) rotate(0)", offset: 0.85 },
          { transform: "translateY(0) scale(1) rotate(0)", opacity: 1 },
        ],
        at(0, HIT_MS + 80, "cubic-bezier(0.55, 0, 1, 0.45)"),
      ),
      // 보살: 방패를 맞고 눌렸다 돌아와요.
      bosalRef.current?.animate(
        [
          { transform: "scale(1, 1)" },
          { transform: "scale(1.08, 0.9)", offset: 0.3 },
          { transform: "scale(0.97, 1.04)", offset: 0.65 },
          { transform: "scale(1, 1)" },
        ],
        at(HIT_MS, 360, "ease-out"),
      ),
      // 링: 닿은 자리에서 퍼지며 사라져요.
      burstRef.current?.animate(
        [
          { transform: "scale(0.6)", opacity: 0.9 },
          { transform: "scale(1.7)", opacity: 0 },
        ],
        { ...at(HIT_MS, 520, "cubic-bezier(0.22, 1, 0.36, 1)"), fill: "both" },
      ),
      // "방어!": 작게 시작해 크게 튀었다 자리를 잡아요.
      textRef.current?.animate(
        [
          { transform: "scale(0.4)", opacity: 0 },
          { transform: "scale(1.15)", opacity: 1, offset: 0.6 },
          { transform: "scale(1)", opacity: 1 },
        ],
        at(HIT_MS + 40, 320, "cubic-bezier(0.34, 1.56, 0.64, 1)"),
      ),
    ];
    const haptic = window.setTimeout(() => triggerTapHaptic("success"), HIT_MS);
    const fade = sceneRef.current?.animate([{ opacity: 1 }, { opacity: 0 }], {
      delay: FADE_AT_MS,
      duration: FADE_MS,
      easing: "ease-in",
      fill: "forwards",
    });
    // StrictMode에서 처음 건 연출을 취소하면 finished가 거부돼요. 그때는 끝으로 치지 않아요.
    fade?.finished.then(() => onEndRef.current()).catch(() => undefined);
    return () => {
      window.clearTimeout(haptic);
      animations.forEach(animation => animation?.cancel());
      fade?.cancel();
    };
  }, []);

  return (
    <div
      ref={sceneRef}
      role="status"
      aria-label="이마 방어권을 사용했어요"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-(--adaptiveBackground)/90"
    >
      <div className="relative size-[150px]">
        <div
          ref={burstRef}
          aria-hidden
          className="absolute inset-0 rounded-full border-4 border-solid border-(--adaptiveBlue400) opacity-0"
        />
        <img src={ringDefended} alt="" aria-hidden className="absolute inset-0 size-full" />
        <div ref={bosalRef} className="absolute inset-[22%] origin-bottom">
          <BosalHead color={color} className="size-full" />
        </div>
        {/* 방어 결과 그림처럼 이마 아래 오른쪽에 방패를 붙여요. */}
        <img
          ref={shieldRef}
          src={shield}
          alt=""
          aria-hidden
          className="absolute right-[14%] bottom-[14%] size-11"
        />
      </div>
      <div ref={textRef}>
        <Paragraph typography="t1" fontWeight="bold" color="var(--adaptiveBlue500)">
          방어!
        </Paragraph>
      </div>
    </div>
  );
};

export default ShieldDefendScene;
