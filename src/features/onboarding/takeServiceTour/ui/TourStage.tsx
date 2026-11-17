import type { ReactNode } from "react";

import { cn } from "@/shared/lib";

interface TourStageProps {
  children: ReactNode;
  className?: string;
}

/**
 * 시안 좌표계(375×718)예요. 가로 가운데, 화면 아래에 붙여 `--tour-scale`만큼 줄이거나 늘려요.
 * 아래에 붙이는 건 ∨·[스킵하기]와 화면 아래로 잘리는 그림(보살, 목업, 밥 구름)이 시안처럼 화면 아래 끝을
 * 기준으로 놓이게 하려는 거예요. 비율이 달라 남는 높이는 상단 바 아래쪽 여백이 돼요.
 * 위치와 배율은 transform 하나로 걸어요. Tailwind `translate-*`, `scale-*`는 낮은 WebView에서 안 먹어요.
 */
const TourStage = ({ children, className }: TourStageProps) => (
  <div
    className={cn(
      "absolute bottom-0 left-1/2 h-[718px] w-[375px] origin-bottom [transform:translateX(-50%)_scale(var(--tour-scale))]",
      className,
    )}
  >
    {children}
  </div>
);

export default TourStage;
