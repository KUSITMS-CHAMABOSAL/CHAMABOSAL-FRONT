import { useMutation, useQueryClient } from "@tanstack/react-query";

import { itemQueries } from "@/entities/item";
import { roomQueries } from "@/entities/room";
import { sessionQueries } from "@/entities/session";

import { purchaseDefenseTicket, purchaseItem } from "../api/purchaseApi";

/**
 * 꾸미기 아이템을 사요. 사면 서버가 바로 입혀요(같은 슬롯 아이템은 벗어요).
 * 곳간은 응답으로 바로 바꾸고, 착용이 보이는 내 정보와 오늘 탭은 다시 받아요.
 */
export const useBuyItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: purchaseItem,
    onSuccess: ({ riceBalance, equippedItemIds }, itemId) => {
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
    onSuccess: ({ riceBalance }) =>
      queryClient.setQueryData(
        itemQueries.store().queryKey,
        store =>
          store && {
            ...store,
            riceBalance,
            defenseTicket: { ...store.defenseTicket, status: "OWNED" as const },
          },
      ),
  });
};
