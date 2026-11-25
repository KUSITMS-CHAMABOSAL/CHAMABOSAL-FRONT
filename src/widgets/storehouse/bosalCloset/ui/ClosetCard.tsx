import { memo } from "react";

import { Button } from "@toss/tds-mobile";

import type { BosalColor } from "@/entities/bosal";
import { ItemCard, ShieldImage } from "@/entities/item";
import { EquipItemButton } from "@/features/storehouse/equipItem";

import type { ClosetItem } from "../config/closetItems";
import ItemThumbnail from "./ItemThumbnail";

interface ClosetCardProps {
  item: ClosetItem;
  color: BosalColor;
  worn: boolean;
  buying: boolean;
  onBuy: (item: ClosetItem) => void;
  onToggle: (item: ClosetItem) => void;
}

/** 방어권은 "보유 2개"처럼 개수로, 꾸미기 아이템은 보유 중으로 보여줘요. 없으면 둘 다 미보유예요. */
const getStatus = (item: ClosetItem) => {
  if (item.kind === "shield") return item.count > 0 ? `보유 ${item.count}개` : "미보유";
  return item.isOwned ? "보유 중" : "미보유";
};

/**
 * 곳간 아이템 카드 한 장이에요.
 * 착용이 바뀌어도 착용 값이 그대로인 카드는 memo로 다시 그리지 않아요. 탭 숨김은 감싸는 쪽이 해요.
 */
const ClosetCard = ({ item, color, worn, buying, onBuy, onToggle }: ClosetCardProps) => (
  <ItemCard
    name={item.name}
    price={item.price}
    status={getStatus(item)}
    thumbnail={
      item.kind === "shield" ? (
        <div className="mt-1">
          <ShieldImage />
        </div>
      ) : (
        <ItemThumbnail color={color} code={item.code} />
      )
    }
    action={
      // 방어권은 보유 개수 제한이 없어 늘 살 수 있어요. 꾸미기 아이템은 보유하면 입어요.
      item.kind === "shield" || !item.isOwned ? (
        <Button
          size="small"
          display="block"
          variant="weak"
          loading={buying}
          onClick={() => onBuy(item)}
        >
          구매하기
        </Button>
      ) : (
        <EquipItemButton worn={worn} onClick={() => onToggle(item)} />
      )
    }
  />
);

export default memo(ClosetCard);
