import { useEffect, useRef, useState } from "react";

import { cn } from "@/shared/lib";

export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * 떠나는 연출을 보여준 뒤 이동해요. `leaving`은 떠나는 중인 모양이에요.
 * 떠나는 동안 다시 누르면 무시하고, 동작 줄이기에서는 바로 이동해요.
 */
export const useLeave = <Kind extends string>() => {
  const [leaving, setLeaving] = useState<Kind | null>(null);
  const timer = useRef<number>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const leave = (kind: Kind, ms: number, next: () => void) => {
    if (leaving) return;
    if (prefersReducedMotion()) return next();
    setLeaving(kind);
    timer.current = window.setTimeout(next, ms);
  };

  return { leaving, leave };
};

/**
 * 곳간 위에 겹친 화면을 아래로 내려보내며 흐리게 해요. 시간은 `--guide-close`(GUIDE_CLOSE_MS)예요.
 * `transform`을 늘 걸어 두어 안쪽 `fixed` 하단 버튼도 이 화면을 기준으로 같이 움직여요.
 */
export const slideDownClass = (closing: boolean) =>
  cn(
    "transition-[transform,opacity] duration-(--guide-close) ease-[cubic-bezier(0.32,0,0.67,0)] motion-reduce:transition-none",
    closing ? "[transform:translateY(100%)] opacity-0" : "[transform:translateY(0)]",
  );
