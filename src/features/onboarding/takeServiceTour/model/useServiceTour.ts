import { type PointerEvent, useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

import { EASE_IN_BACK, SWIPE_MIN_DISTANCE, TOUR_MOTION } from "../config/motion";
import { CONTROL_TONES, STEP_COUNT } from "../config/stage";
import { animateMatchedLayers, measureMatchedLayers } from "./matchedLayers";
import { markServiceTourSeen } from "./seen";
import type { ControlTone } from "./types";
import { getStageScale } from "./useStageScale";

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * 온보딩 6장을 넘겨요. 위로 쓸거나 ∨를 누르면 다음 화면이 아래에서 밀고 올라와요(Push).
 * 뒤로 넘기기는 없어요.
 *
 * Web Animations API를 써요. scroll-snap은 뒤로 쓸면 되돌아가고 세게 튕기면 여러 장을 건너뛰어서
 * "뒤로 없음"을 지키기 어렵고, 같은 이름 레이어를 잇거나 도착한 뒤 연출을 시작하려면 끝나는 시점이 필요해서예요.
 * 손가락을 따라오지 않고 쓸기가 끝나면 시작해요. Figma 프로토타입도 드래그를 트리거로만 써요.
 */
export const useServiceTour = (onFinish: () => void) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<(HTMLElement | null)[]>([]);
  const toneRefs = useRef<Record<ControlTone, HTMLDivElement | null>>({ light: null, dark: null });

  const [step, setStep] = useState(0);
  const [settled, setSettled] = useState(true);
  const stepRef = useRef(0);
  const running = useRef<Animation[] | null>(null);
  const queued = useRef(false);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => () => running.current?.forEach(animation => animation.cancel()), []);

  const pageRef = (index: number) => (element: HTMLElement | null) => {
    pageRefs.current[index] = element;
  };
  const toneRef = (tone: ControlTone) => (element: HTMLDivElement | null) => {
    toneRefs.current[tone] = element;
  };

  const finish = useCallback(() => {
    void markServiceTourSeen();
    onFinish();
  }, [onFinish]);

  const nextRef = useRef<() => void>(() => {});

  const next = useCallback(() => {
    // 넘기는 중에 또 넘기면 끝나고 한 장 더 넘겨요. 여러 번 눌러도 한 장만 모아 둬요.
    if (running.current) {
      queued.current = true;
      return;
    }
    const from = stepRef.current;
    const to = from + 1;
    if (to >= STEP_COUNT) {
      finish();
      return;
    }

    const root = rootRef.current;
    const fromPage = pageRefs.current[from];
    const toPage = pageRefs.current[to];
    // 재생 중인 도착 연출(봉투, 물결)은 끝 모양으로 넘기고 떠나요.
    fromPage?.getAnimations({ subtree: true }).forEach(animation => animation.finish());

    const commit = () => {
      stepRef.current = to;
      flushSync(() => {
        setStep(to);
        setSettled(true);
      });
    };
    if (!root || !fromPage || !toPage || prefersReducedMotion()) {
      commit();
      return;
    }

    const distance = root.clientHeight;
    const scale = getStageScale(root);
    const pairs = measureMatchedLayers(fromPage, toPage);
    const timing: KeyframeAnimationOptions = {
      duration: TOUR_MOTION.pushMs,
      easing: EASE_IN_BACK,
      fill: "both",
    };

    const animations = [
      fromPage.animate(
        [{ transform: "translateY(0px)" }, { transform: `translateY(${-distance}px)` }],
        timing,
      ),
      toPage.animate(
        [
          { transform: `translateY(${distance}px)`, visibility: "visible" },
          { transform: "translateY(0px)", visibility: "visible" },
        ],
        timing,
      ),
      ...animateMatchedLayers(pairs, distance, scale, timing),
    ];

    // ∨와 [스킵하기]는 모든 화면에서 같은 자리라 움직이지 않고 색만 바뀌어요.
    const fromTone = CONTROL_TONES[from];
    const toTone = CONTROL_TONES[to];
    const fadeOut = toneRefs.current[fromTone];
    const fadeIn = toneRefs.current[toTone];
    if (fromTone !== toTone && fadeOut && fadeIn) {
      animations.push(
        fadeOut.animate([{ opacity: 1 }, { opacity: 0 }], timing),
        fadeIn.animate([{ opacity: 0 }, { opacity: 1 }], timing),
      );
    }

    running.current = animations;
    setSettled(false);
    Promise.all(animations.map(animation => animation.finished))
      .then(() => {
        commit();
        animations.forEach(animation => animation.cancel());
        running.current = null;
        if (queued.current) {
          queued.current = false;
          nextRef.current();
        }
      })
      .catch(() => {
        running.current = null;
      });
  }, [finish]);

  useEffect(() => {
    nextRef.current = next;
  }, [next]);

  const onPointerDown = (event: PointerEvent) => {
    swipeStart.current = { x: event.clientX, y: event.clientY };
  };

  const onPointerUp = (event: PointerEvent) => {
    const start = swipeStart.current;
    swipeStart.current = null;
    if (!start) return;
    const up = start.y - event.clientY;
    if (up >= SWIPE_MIN_DISTANCE && up > Math.abs(event.clientX - start.x)) next();
  };

  const onPointerCancel = () => {
    swipeStart.current = null;
  };

  return {
    rootRef,
    pageRef,
    toneRef,
    step,
    settled,
    next,
    skip: finish,
    swipeHandlers: { onPointerDown, onPointerUp, onPointerCancel },
  };
};
