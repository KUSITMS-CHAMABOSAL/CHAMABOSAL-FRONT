import { useMemo } from "react";

import { cn } from "@/shared/lib";

import { BOSAL_ART, BOSAL_ART_HEIGHT, BOSAL_ART_WIDTH } from "../config/art";
import { getItemTransform, ITEM_ART, isItemCode } from "../config/items";
import type { BosalColor, BosalExpression } from "../model/types";
import BosalHair from "./BosalHair";

/** 나발 좌표의 기준 폭이에요. 표정마다 그림 폭이 달라도 머리는 왼쪽 위 기준으로 같은 자리예요. */
const HAIR_FRAME_WIDTH = BOSAL_ART_WIDTH.default;

interface BosalImageProps {
  color: BosalColor;
  expression: BosalExpression;
  /** 빠진 나발 번호(0~37)예요. 서버의 `fallenNabalNumbers`, `nabal.fallenNumbers` */
  fallenHairs?: readonly number[];
  /** 착용한 아이템 코드예요. 서버의 `equippedItemCodes`. 그림이 없는 코드는 빼요. */
  items?: readonly string[];
  /** 렌더링 높이예요. 폭은 원본 비율로 따라가요. */
  height?: number;
  className?: string;
}

/**
 * 보살 캐릭터 그림이에요. 표정마다 폭이 달라서 왼쪽 위를 기준으로 그려요.
 * 나발은 그림 파일에서 빼고 위에 따로 그려서, 빠진 나발만 비워요. 착용 아이템도 그 위에 겹쳐요.
 */
const BosalImage = ({
  color,
  expression,
  fallenHairs = [],
  items = [],
  height = BOSAL_ART_HEIGHT,
  className,
}: BosalImageProps) => {
  const scale = height / BOSAL_ART_HEIGHT;
  const fallen = useMemo(() => new Set(fallenHairs), [fallenHairs]);

  return (
    <span
      className={cn(
        "pointer-events-none relative inline-block max-w-none align-top select-none",
        className,
      )}
    >
      <img
        src={BOSAL_ART[color][expression]}
        alt=""
        width={BOSAL_ART_WIDTH[expression] * scale}
        height={height}
        draggable={false}
        className="block max-w-none"
      />
      <svg
        viewBox={`0 0 ${HAIR_FRAME_WIDTH} ${BOSAL_ART_HEIGHT}`}
        width={HAIR_FRAME_WIDTH * scale}
        height={height}
        className="absolute top-0 left-0 overflow-visible"
        aria-hidden
      >
        <BosalHair color={color} fallenHairs={fallen} />
        {items.filter(isItemCode).map(code => {
          const art = ITEM_ART[code];
          return (
            <image
              key={code}
              href={art.href}
              x={art.x}
              y={art.y}
              width={art.width}
              height={art.height}
              preserveAspectRatio="none"
              transform={getItemTransform(art)}
            />
          );
        })}
      </svg>
    </span>
  );
};

export default BosalImage;
