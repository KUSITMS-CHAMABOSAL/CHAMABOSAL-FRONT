import { type RefObject, useEffect, useState } from "react";

import { STAGE } from "../config/stage";

/**
 * 화면에 시안 좌표계를 넣을 배율이에요. 폭과 높이 중 먼저 닿는 쪽에 맞춰 줄이거나 늘려요.
 * 휴대폰 웹뷰는 시안과 비율이 거의 같아서 위아래 빈 곳 없이 채워져요.
 */
export const getStageScale = (element: HTMLElement) =>
  Math.min(element.clientWidth / STAGE.width, element.clientHeight / STAGE.height);

/** 화면 크기가 바뀌면 배율을 다시 재요. ResizeObserver는 관찰을 시작할 때도 한 번 불러요. */
export const useStageScale = (ref: RefObject<HTMLElement | null>) => {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(() => setScale(getStageScale(element)));
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  return scale;
};
