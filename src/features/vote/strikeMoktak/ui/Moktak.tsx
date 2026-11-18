import { type MouseEvent, type PointerEvent, useEffect, useRef } from "react";

import { triggerTapHaptic } from "@/shared/lib/appsInToss";

import glowRing from "../assets/glow_ring.svg";
import mallet from "../assets/mallet.svg";
import moktak from "../assets/moktak.svg";
import { getStrikeMs, POSE, RIPPLE, STRIKE, STRIKE_EASING, STRIKE_HAPTIC } from "../config/motion";
import { useMoktakSound } from "../model/useMoktakSound";

type Pose = { rest: Keyframe; hit: Keyframe };

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * 지금 모양에서 출발해 친 순간을 거쳐 쉬는 자세로 돌아와요.
 * 앞 동작이 남아 있으면 그 자리에서 멈춘 모양(commitStyles)이 출발점이라 연타해도 튀지 않아요.
 */
const swing = (element: HTMLElement | null, pose: Pose, duration: number) => {
  if (!element) return null;
  const now = getComputedStyle(element);
  const animation = element.animate(
    [
      { transform: now.transform, opacity: now.opacity, easing: STRIKE_EASING.down },
      { ...pose.hit, offset: STRIKE.impactAt, easing: STRIKE_EASING.back },
      pose.rest,
    ],
    { duration },
  );
  // 끝나면 멈춰 둔 인라인 값을 지워 CSS의 쉬는 자세로 돌아가고, 합성 레이어도 놓아줘요.
  animation.onfinish = () => {
    element.style.removeProperty("transform");
    element.style.removeProperty("opacity");
  };
  return animation;
};

/**
 * 방망이가 닿는 순간부터 물결 세 겹을 뒤따라 퍼뜨려요.
 * 물결마다 요소를 새로 만들어서 연타해도 앞 물결이 끊기지 않고, 끝나면 지워요.
 * 물결은 작게(`RIPPLE.drawSize`) 그려 가운데에서 키워요.
 */
const ripple = (layer: HTMLElement | null, delayMs: number) => {
  if (!layer) return;
  RIPPLE.followMs.forEach(followMs => {
    if (layer.childElementCount >= RIPPLE.maxWaves) return;
    const wave = document.createElement("img");
    wave.src = glowRing;
    wave.alt = "";
    wave.width = RIPPLE.drawSize;
    wave.height = RIPPLE.drawSize;
    wave.className =
      "absolute top-1/2 left-1/2 -mt-[75px] -ml-[75px] block size-[150px] max-w-none opacity-0";
    layer.append(wave);
    const animation = wave.animate([...RIPPLE.keyframes], {
      duration: RIPPLE.durationMs,
      delay: delayMs + followMs,
      easing: RIPPLE.easing,
    });
    animation.onfinish = () => wave.remove();
  });
};

interface MoktakProps {
  /** 목표를 채웠거나 시트가 열려 칠 수 없을 때예요. */
  disabled?: boolean;
  /** 한 번 칠 때마다 불러요. 횟수는 쓰는 쪽이 세요. */
  onStrike: () => void;
}

/**
 * 누르는 즉시 목탁 소리와 햅틱이 한 번씩 나고, 방망이가 목탁을 치면 뒤에서 물결이 퍼져요.
 * 동작 길이는 앞 탭과의 간격에 맞춰서 빠르게 치면 빠르게, 천천히 치면 천천히 반응해요.
 * 좌표는 시안 화면(375px)에서 횟수 알림 아래(y 282)부터 잰 값이에요.
 */
const Moktak = ({ disabled = false, onStrike }: MoktakProps) => {
  const malletRef = useRef<HTMLDivElement>(null);
  const moktakRef = useRef<HTMLDivElement>(null);
  const rippleRef = useRef<HTMLDivElement>(null);
  const running = useRef<Animation[]>([]);
  const lastStrikeAt = useRef(-Infinity);
  const playSound = useMoktakSound();

  useEffect(() => () => running.current.forEach(animation => animation.cancel()), []);

  const strike = () => {
    if (disabled) return;
    // 소리와 햅틱이 가장 먼저예요. 기다리면 손끝과 소리가 어긋나요.
    playSound();
    // 목탁은 콕 찌르기(tap)보다 또렷해야 해서 한 단계 강한 짧은 햅틱을 써요.
    triggerTapHaptic(STRIKE_HAPTIC);
    onStrike();

    const now = performance.now();
    const duration = getStrikeMs(now - lastStrikeAt.current);
    lastStrikeAt.current = now;

    if (prefersReducedMotion()) return;
    running.current.forEach(animation => {
      animation.commitStyles();
      animation.cancel();
    });
    running.current = [
      swing(malletRef.current, POSE.mallet, duration),
      swing(moktakRef.current, POSE.moktak, duration),
    ].filter(animation => animation !== null);
    ripple(rippleRef.current, duration * STRIKE.impactAt);
  };

  // 손가락이 닿는 즉시 쳐요. click은 손을 뗄 때 와서 연타가 늦게 느껴져요.
  const onPointerDown = (event: PointerEvent) => {
    if (event.button === 0) strike();
  };
  // 키보드와 스크린 리더는 pointerdown이 없어 click(detail 0)으로 받아요.
  const onClick = (event: MouseEvent) => {
    if (event.detail === 0) strike();
  };

  return (
    <button
      type="button"
      aria-label="목탁 치기"
      disabled={disabled}
      onPointerDown={onPointerDown}
      onClick={onClick}
      // 가운데 맞춤은 margin이 아니라 self-center로 해요. TDS 전역 CSS가 button의 margin을 0으로 덮고,
      // 화면이 375px보다 좁을 때도 넘친 부분이 양쪽으로 같게 잘려요.
      className="relative block h-[480px] w-[375px] shrink-0 cursor-pointer touch-manipulation appearance-none self-center border-0 bg-transparent p-0 outline-none! select-none [-webkit-tap-highlight-color:transparent] focus-visible:outline-2! focus-visible:outline-offset-[-2px] focus-visible:outline-(color:--adaptiveBlue500)! focus-visible:outline-solid! disabled:cursor-default"
    >
      {/* 물결 층은 시안의 가장 큰 빛(지름 598) 자리예요. 물결은 그 가운데에서 작게 그려 키워요. */}
      <div
        ref={rippleRef}
        aria-hidden
        className="pointer-events-none absolute top-[-112px] left-[-112px] size-[598px]"
      />
      <div
        ref={moktakRef}
        className="pointer-events-none absolute top-[2.28px] left-[-4.16px] h-[420px] w-[382px] [transform:rotate(15deg)]"
      >
        <img
          src={moktak}
          alt=""
          className="absolute top-[-3.36px] left-[-18.95px] h-[480.59px] w-[420.048px] max-w-none"
        />
      </div>
      <div
        ref={malletRef}
        className="pointer-events-none absolute top-[148.67px] left-[324.95px] h-[336px] w-[80px] [transform:rotate(32deg)]"
      >
        <img
          src={mallet}
          alt=""
          className="absolute top-[-44.02px] left-[-60px] h-[456px] w-[200px] max-w-none"
        />
      </div>
    </button>
  );
};

export default Moktak;
