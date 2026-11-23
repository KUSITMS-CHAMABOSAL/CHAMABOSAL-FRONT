import { memo } from "react";

import { BosalImage, type BosalColor, type BosalExpression, type ItemCode } from "@/entities/bosal";

/** 시안의 썸네일 보살 높이예요. */
const THUMBNAIL_HEIGHT = 107;

interface ItemThumbnailProps {
  color: BosalColor;
  /** 아이템 카드면 그 아이템만 입혀요. */
  code?: ItemCode;
  expression?: BosalExpression;
}

/**
 * 아이템 카드의 흐린 보살이에요. 움직이지 않아서 표정 1장과 아이템 1개만 그려요.
 * 위쪽 착용 보살(`BosalFigure`)처럼 전부 미리 그려 두지 않아요. 카드가 17장이라 그림이 300개 가까이 돼요.
 * 착용을 바꿔도 썸네일은 그대로라 memo로 다시 그리지 않아요.
 */
const ItemThumbnail = ({ color, code, expression = "default" }: ItemThumbnailProps) => (
  <BosalImage
    dimmed
    color={color}
    expression={expression}
    items={code ? [code] : undefined}
    height={THUMBNAIL_HEIGHT}
    // 표정마다 그림 폭이 달라요(못 참은 표정은 땀방울). 보살 자리가 흔들리지 않게 폭을 고정해요.
    className="mt-3 w-[68px]"
  />
);

export default memo(ItemThumbnail);
