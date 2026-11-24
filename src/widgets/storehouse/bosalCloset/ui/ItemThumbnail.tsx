import { memo } from "react";

import { BosalImage, type BosalColor, type ItemCode } from "@/entities/bosal";

/** 시안의 썸네일 보살 높이예요. */
const THUMBNAIL_HEIGHT = 107;

interface ItemThumbnailProps {
  color: BosalColor;
  /** 이 카드의 아이템이에요. 그 아이템만 입혀요. */
  code: ItemCode;
}

/**
 * 아이템 카드의 흐린 보살이에요. 움직이지 않아서 보살 1장과 아이템 1개만 그려요.
 * 위쪽 착용 보살(`BosalFigure`)처럼 아이템을 전부 미리 그려 두지 않아요. 카드가 많아 그림이 수백 개가 돼요.
 * 착용을 바꿔도 썸네일은 그대로라 memo로 다시 그리지 않아요.
 */
const ItemThumbnail = ({ color, code }: ItemThumbnailProps) => (
  <BosalImage
    dimmed
    color={color}
    expression="default"
    items={[code]}
    height={THUMBNAIL_HEIGHT}
    // 보살 그림 폭(68px)으로 고정해 카드 가운데에 놓아요.
    className="mt-3 w-[68px]"
  />
);

export default memo(ItemThumbnail);
