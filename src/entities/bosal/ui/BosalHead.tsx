import { cn } from "@/shared/lib";

import headTemplate from "../assets/bosal_head.svg?raw";
import {
  BOSAL_HEAD_PALETTE,
  BOSAL_HEAD_TEMPLATE,
  type BosalHeadPalette,
} from "../config/headPalette";
import type { BosalColor } from "../model/types";

interface BosalHeadProps {
  color: BosalColor;
  className?: string;
}

/** 원본 그림 크기예요. */
const HEAD_WIDTH = 41;
const HEAD_HEIGHT = 42;

const recolor = (palette: BosalHeadPalette) =>
  (Object.keys(BOSAL_HEAD_TEMPLATE) as (keyof BosalHeadPalette)[]).reduce(
    (svg, role) => svg.replaceAll(BOSAL_HEAD_TEMPLATE[role], palette[role]),
    headTemplate,
  );

// 그림 한 장의 색만 바꿔 색마다 미리 만들어 둬요.
// 인라인 SVG로 넣으면 카드마다 그라디언트 id가 겹쳐 모두 첫 카드 색이 되므로, 각자 이미지로 그려요.
const HEAD_SRC = Object.fromEntries(
  Object.entries(BOSAL_HEAD_PALETTE).map(([color, palette]) => [
    color,
    `data:image/svg+xml;charset=utf-8,${encodeURIComponent(recolor(palette))}`,
  ]),
) as Record<BosalColor, string>;

/** 눈 감은 보살의 머리만 그린 그림이에요. 한 솥 축하 순위 카드처럼 작은 자리에 써요. */
const BosalHead = ({ color, className }: BosalHeadProps) => (
  <img
    src={HEAD_SRC[color]}
    alt=""
    width={HEAD_WIDTH}
    height={HEAD_HEIGHT}
    draggable={false}
    className={cn("pointer-events-none select-none", className)}
  />
);

export default BosalHead;
