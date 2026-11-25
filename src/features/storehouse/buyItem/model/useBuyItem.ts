import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ITEM_EQUIP_SCOPE, type ItemSlot, itemQueries } from "@/entities/item";
import { roomQueries } from "@/entities/room";
import { sessionQueries } from "@/entities/session";
import { logEvent } from "@/shared/lib/appsInToss";

import { purchaseDefenseTicket, purchaseItem } from "../api/purchaseApi";
import { SHIELD_PRICE } from "../config/price";

/** 데이터 트래킹 정의서의 `item_type` 값이에요. */
const SLOT_ITEM_TYPE = {
  HAT: "hat",
  FACE: "face",
  ACCESSORY: "accessory",
} as const satisfies Record<ItemSlot, string>;

/**
 * 꾸미기 아이템을 사요. 사면 서버가 바로 입혀요(같은 슬롯 아이템은 벗어요).
 * 곳간은 응답으로 바로 바꾸고, 착용이 보이는 내 정보와 오늘 탭은 다시 받아요.
 */
export const useBuyItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    // 구매 중에 곳간을 떠나도, 떠날 때의 착용 저장이 구매가 끝난 뒤에 나가요.
    scope: ITEM_EQUIP_SCOPE,
    mutationFn: purchaseItem,
    onSuccess: ({ riceBalance, equippedItemIds }, itemId) => {
      // 슬롯과 가격은 바꾸기 전 곳간 목록에서 읽어요.
      const item = queryClient
        .getQueryData(itemQueries.store().queryKey)
        ?.items.find(storeItem => storeItem.itemId === itemId);
      if (item)
        logEvent("item_purchase", {
          item_type: SLOT_ITEM_TYPE[item.slot],
          price: item.price,
          balance_after: riceBalance,
        });
      queryClient.setQueryData(
        itemQueries.store().queryKey,
        store =>
          store && {
            ...store,
            riceBalance,
            items: store.items.map(item => ({
              ...item,
              isOwned: item.isOwned || item.itemId === itemId,
              isEquipped: equippedItemIds.includes(item.itemId),
            })),
          },
      );
      void queryClient.invalidateQueries({ queryKey: sessionQueries.me().queryKey });
      void queryClient.invalidateQueries({ queryKey: roomQueries.all() });
    },
  });
};

/** 이마 방어권을 사요. */
export const useBuyDefenseTicket = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: purchaseDefenseTicket,
    onSuccess: ({ riceBalance }) => {
      logEvent("item_purchase", {
        item_type: "shield",
        price: SHIELD_PRICE,
        balance_after: riceBalance,
      });
      queryClient.setQueryData(
        itemQueries.store().queryKey,
        store =>
          store && {
            ...store,
            riceBalance,
            defenseTicket: { ...store.defenseTicket, status: "OWNED" as const },
          },
      );
    },
  });
};
