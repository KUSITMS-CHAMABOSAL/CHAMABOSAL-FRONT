import { useState } from "react";

import type { ItemCode } from "@/entities/bosal";
import type { ItemSlot } from "@/entities/item";

export interface OutfitItem {
  code: ItemCode;
  slot: ItemSlot;
}

export interface Outfit {
  /** 슬롯마다 하나씩 입어요. 같은 슬롯의 다른 아이템을 입으면 바뀌어요. */
  items: Partial<Record<ItemSlot, ItemCode>>;
}

/**
 * 곳간에서 입어 보는 착용 상태예요. 처음에는 서버의 착용 아이템으로 시작해요.
 * 이미 입은 아이템을 다시 누르면 벗어요. 저장은 곳간을 떠날 때 `useSaveEquippedItems`로 한 번에 해요.
 */
export const useOutfit = (equipped: readonly OutfitItem[]) => {
  const [outfit, setOutfit] = useState<Outfit>(() => ({
    items: Object.fromEntries(equipped.map(({ slot, code }) => [slot, code])),
  }));

  const toggleItem = ({ code, slot }: OutfitItem) =>
    setOutfit(prev => ({
      items: { ...prev.items, [slot]: prev.items[slot] === code ? undefined : code },
    }));
  /** 산 아이템을 입혀요. 서버도 사는 순간 입혀요. */
  const wear = ({ code, slot }: OutfitItem) =>
    setOutfit(prev => ({ items: { ...prev.items, [slot]: code } }));

  return { outfit, toggleItem, wear };
};

/** 그릴 때 쓰는 착용 아이템 목록이에요. */
export const getWornItems = (outfit: Outfit) =>
  Object.values(outfit.items).filter((code): code is ItemCode => code !== undefined);
