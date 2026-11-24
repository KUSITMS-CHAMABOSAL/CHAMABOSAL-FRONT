import { request } from "@/shared/api";

/** 착용 상태를 통째로 바꿔요. 목록에 없는 아이템은 벗고, 빈 배열이면 모두 벗어요. 슬롯마다 하나씩 0~3개 */
export const saveEquippedItems = (itemIds: number[]) =>
  request("PUT", "/api/users/me/equipped-items", { itemIds });
