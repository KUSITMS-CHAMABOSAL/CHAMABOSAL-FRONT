import { queryOptions } from "@tanstack/react-query";

import { getStore } from "./itemApi";

/** 착용을 바꾸는 요청(구매, 착용 저장)은 이 순서 큐로 하나씩 보내요. 서버가 사는 순간 입히고, 착용 저장은 목록을 통째로 바꿔요. */
export const ITEM_EQUIP_SCOPE = { id: "item-equip" };

export const itemQueries = {
  store: () => queryOptions({ queryKey: ["item", "store"], queryFn: getStore }),
};
