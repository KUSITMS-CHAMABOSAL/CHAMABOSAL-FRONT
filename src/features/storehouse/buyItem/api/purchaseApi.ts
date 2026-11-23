import { request } from "@/shared/api";

interface ItemPurchaseResponse {
  /** 산 뒤의 공양미 표시 잔액 */
  riceBalance: number;
  /** 구매 뒤 착용 중인 아이템 ID 전체. 산 아이템과 같은 슬롯에 있던 아이템은 빠져요. */
  equippedItemIds: number[];
}

interface DefenseTicketPurchaseResponse {
  /** 산 뒤 표시 잔액. 실제 잔액이 음수면 0 */
  riceBalance: number;
}

/** 꾸미기 아이템을 사요. 사면 바로 착용돼요. */
export const purchaseItem = (itemId: number) =>
  request<ItemPurchaseResponse>("POST", `/api/items/${itemId}/purchases`);

/** 이마 방어권을 사요. 보유 개수 제한은 없어요. */
export const purchaseDefenseTicket = () =>
  request<DefenseTicketPurchaseResponse>("POST", "/api/defense-tickets");
