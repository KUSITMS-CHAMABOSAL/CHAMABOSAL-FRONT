import { cn } from "@/shared/lib";

import { BOSAL_ART, BOSAL_ART_HEIGHT, BOSAL_ART_WIDTH } from "../config/art";
import type { BosalColor, BosalExpression } from "../model/types";

interface BosalImageProps {
  color: BosalColor;
  expression: BosalExpression;
  /** 렌더링 높이예요. 폭은 원본 비율로 따라가요. */
  height?: number;
  className?: string;
}

/** 보살 캐릭터 그림이에요. 표정마다 폭이 달라서 왼쪽 위를 기준으로 그려요. */
const BosalImage = ({
  color,
  expression,
  height = BOSAL_ART_HEIGHT,
  className,
}: BosalImageProps) => (
  <img
    src={BOSAL_ART[color][expression]}
    alt=""
    width={(BOSAL_ART_WIDTH[expression] * height) / BOSAL_ART_HEIGHT}
    height={height}
    draggable={false}
    className={cn("pointer-events-none max-w-none select-none", className)}
  />
);

export default BosalImage;
