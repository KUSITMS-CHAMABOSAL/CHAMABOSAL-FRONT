import { memo, type Ref } from "react";

import { cn } from "@/shared/lib";

import { BOSAL_ART, BOSAL_ART_HEIGHT, BOSAL_ART_WIDTH } from "../config/art";
import { getItemTransform, ITEM_ART } from "../config/items";
import type { BosalColor, BosalExpression, ItemCode } from "../model/types";
import BosalHair from "./BosalHair";

const EXPRESSIONS = Object.keys(BOSAL_ART_WIDTH) as BosalExpression[];
const ITEMS = Object.entries(ITEM_ART) as [ItemCode, (typeof ITEM_ART)[ItemCode]][];

interface BosalFigureProps {
  color: BosalColor;
  expression?: BosalExpression;
  /** 착용한 아이템이에요. 슬롯마다 하나씩이에요. */
  items?: readonly ItemCode[];
  /** 빠진 나발 번호 */
  pluckedHairs?: ReadonlySet<number>;
  /** 아이템 카드처럼 보살은 흐리게, 아이템만 또렷하게 보여줄 때 써요. */
  dimmed?: boolean;
  className?: string;
  /** 나발을 `data-hair`로 찾을 때 써요. */
  svgRef?: Ref<SVGSVGElement>;
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
 * 아이템을 입히는 보살이에요. 색별 그림 위에 나발과 착용 아이템을 겹쳐요.
 * 표정을 바꿀 때 그림을 새로 불러오지 않게 네 표정을 모두 두고 투명도만 바꿔요.
 */
const BosalFigure = ({
  color,
  expression = "default",
  items = NO_ITEMS,
  pluckedHairs = NO_PLUCKED,
  dimmed = false,
  className,
  svgRef,
}: BosalFigureProps) => (
  <svg
    ref={svgRef}
    viewBox={`0 0 88.58 ${BOSAL_ART_HEIGHT}`}
    className={cn("overflow-visible!", className)}
    aria-hidden
  >
    <g className={cn(dimmed && "opacity-60")}>
      {EXPRESSIONS.map(key => (
        <image
          key={key}
          href={BOSAL_ART[color][key]}
          width={BOSAL_ART_WIDTH[key]}
          height={BOSAL_ART_HEIGHT}
          className={cn(
            "transition-opacity duration-200 motion-reduce:transition-none",
            key === expression ? "opacity-100" : "opacity-0",
          )}
        />
      ))}
      <BosalHair color={color} fallenHairs={pluckedHairs} />
    </g>

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

// 그림 4장, 나발 38가닥, 아이템 13개를 그려서, 같은 화면의 다른 상태가 바뀔 때 다시 그리지 않게 해요.
export default memo(BosalFigure);
