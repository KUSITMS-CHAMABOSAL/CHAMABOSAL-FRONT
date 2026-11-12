import { type RefObject, useCallback, useEffect, useRef, useState } from "react";

import { HAIR_CURLS } from "@/entities/bosal";

import { POKED_REACTION_MS } from "../config/motion";

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * 투표 미수행 디메리트로 머리카락이 뽑혀요. 다시 심기는 곳간의 `features/storehouse/plantHair`에서 해요.
 *
 * Web Animations API를 써요. 가닥마다 날아가는 방향이 달라 CSS 키프레임에 고정값을 쓸 수 없고,
 * 끝나는 시점(`finished`)에 상태를 바꿔야 해서예요.
 */
export const useHairLoss = (svgRef: RefObject<SVGSVGElement | null>) => {
  const [plucked, setPlucked] = useState<ReadonlySet<number>>(() => new Set());
  const [isOuch, setIsOuch] = useState(false);
  const inFlight = useRef(new Set<number>());
  const ouchTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(ouchTimer.current), []);

  // 뽑힌 상태가 반영된 뒤에 예약을 풀어요. 먼저 풀면 반영 전 사이에 같은 가닥을 다시 고를 수 있어요.
  useEffect(() => {
    plucked.forEach(index => inFlight.current.delete(index));
  }, [plucked]);

  const markPlucked = (index: number) => setPlucked(prev => new Set(prev).add(index));

  const pluck = useCallback(() => {
    const remaining = HAIR_CURLS.map((_, index) => index).filter(
      index => !plucked.has(index) && !inFlight.current.has(index),
    );
    if (remaining.length === 0) return;

    const index = remaining[Math.floor(Math.random() * remaining.length)];
    inFlight.current.add(index);

    setIsOuch(true);
    window.clearTimeout(ouchTimer.current);
    ouchTimer.current = window.setTimeout(() => setIsOuch(false), POKED_REACTION_MS);

    const hair = svgRef.current?.querySelector<SVGGElement>(`[data-hair="${index}"]`);
    if (!hair || prefersReducedMotion()) {
      markPlucked(index);
      return;
    }

    // 머리 중심(x≈44)에서 바깥쪽으로 튕겨 나가요.
    const direction = HAIR_CURLS[index][0] < 44 ? -1 : 1;
    hair
      .animate(
        [
          { transform: "translate(0, 0)" },
          { transform: "translate(0, 1.5px) scale(1.08, 0.88)", offset: 0.14 },
          { transform: "translate(0, -4px) scale(0.9, 1.15)", offset: 0.3 },
          {
            transform: `translate(${direction * 16}px, -34px) rotate(${direction * 120}deg) scale(0.9)`,
            opacity: 1,
            offset: 0.62,
          },
          {
            transform: `translate(${direction * 30}px, -18px) rotate(${direction * 240}deg) scale(0.7)`,
            opacity: 0,
          },
        ],
        { duration: 760, easing: "cubic-bezier(0.25, 0.6, 0.4, 1)", fill: "forwards" },
      )
      .finished.then(() => markPlucked(index))
      .catch(() => inFlight.current.delete(index));
  }, [plucked, svgRef]);

  return { plucked, isOuch, pluck };
};
