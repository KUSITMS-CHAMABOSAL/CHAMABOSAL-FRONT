import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * 화면에 도착하고 `delayMs` 뒤 한 번만 재생하는 연출이에요(02 → 03 봉투, 06 → 07 물결).
 * 끝나면 `played`를 켜서 끝 모양을 클래스로 남기고 애니메이션을 풀어요.
 * 재생 중에 다음 화면으로 넘기면 넘기기 쪽이 `finish()`해서 바로 끝 모양이 돼요.
 */
export const useArrivalMotion = (arrived: boolean, delayMs: number, play: () => Animation[]) => {
  const [played, setPlayed] = useState(false);
  const playRef = useRef(play);

  useEffect(() => {
    playRef.current = play;
  });

  useEffect(() => {
    if (!arrived || played) return;
    const timer = window.setTimeout(() => {
      if (prefersReducedMotion()) {
        setPlayed(true);
        return;
      }
      const animations = playRef.current();
      Promise.all(animations.map(animation => animation.finished))
        .then(() => {
          flushSync(() => setPlayed(true));
          animations.forEach(animation => animation.cancel());
        })
        .catch(() => {});
    }, delayMs);
    return () => window.clearTimeout(timer);
  }, [arrived, played, delayMs]);

  return played;
};
