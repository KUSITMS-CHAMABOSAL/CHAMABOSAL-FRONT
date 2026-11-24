import { memo } from "react";

import { cn } from "@/shared/lib";

import { BOSAL_ART, BOSAL_ART_HEIGHT, BOSAL_ART_WIDTH } from "../config/art";
import { getItemTransform, ITEM_ART } from "../config/items";
import type { BosalColor, ItemCode } from "../model/types";
import BosalHair from "./BosalHair";

const ITEMS = Object.entries(ITEM_ART) as [ItemCode, (typeof ITEM_ART)[ItemCode]][];

interface BosalFigureProps {
  color: BosalColor;
  /** 착용한 아이템이에요. 슬롯마다 하나씩이에요. */
  items?: readonly ItemCode[];
  /** 빠진 나발 번호 */
  pluckedHairs?: ReadonlySet<number>;
  className?: string;
}

const NO_PLUCKED: ReadonlySet<number> = new Set();
const NO_ITEMS: readonly ItemCode[] = [];

// 착용 아이템은 항상 렌더링하고 투명도만 바꿔요. 착용하는 순간 이미지를 불러오면 WebView에서 한 프레임 비어 보여요.
const itemClass = (worn: boolean) =>
  cn(
    "transition-[opacity,translate,scale] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none",
    worn ? "translate-y-0 scale-100 opacity-100" : "-translate-y-3 scale-90 opacity-0",
  );

/**
 * 곳간에서 아이템을 입혀 보는 보살이에요. 색별 그림 위에 나발과 착용 아이템을 겹쳐요.
 * 아이템 13개를 모두 그려 두고 투명도만 바꿔서, 바꿔 입을 때 그림을 새로 불러오지 않아요.
 */
const BosalFigure = ({
  color,
  items = NO_ITEMS,
  pluckedHairs = NO_PLUCKED,
  className,
}: BosalFigureProps) => (
  <svg
    viewBox={`0 0 88.58 ${BOSAL_ART_HEIGHT}`}
    className={cn("overflow-visible!", className)}
    aria-hidden
  >
    <image
      href={BOSAL_ART[color].default}
      width={BOSAL_ART_WIDTH.default}
      height={BOSAL_ART_HEIGHT}
    />
    <BosalHair color={color} fallenHairs={pluckedHairs} />

    {ITEMS.map(([code, art]) => (
      <g key={code} transform={getItemTransform(art)}>
        <g className={cn("origin-center transform-fill", itemClass(items.includes(code)))}>
          <image
            href={art.href}
            x={art.x}
            y={art.y}
            width={art.width}
            height={art.height}
            preserveAspectRatio="none"
          />
        </g>
      </g>
    ))}
  </svg>
);

// 아이템 13개와 나발 38가닥을 그려서, 같은 화면의 다른 상태가 바뀔 때 다시 그리지 않게 해요.
export default memo(BosalFigure);
