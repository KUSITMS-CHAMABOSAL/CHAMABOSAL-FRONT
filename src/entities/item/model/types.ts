export type ItemSlot = "HAT" | "FACE" | "ACCESSORY";

export interface StoreItem {
  /** 구매·착용 API에 써요. */
  itemId: number;
  /** 보살 캐릭터 이미지 매핑에 써요. */
  code: string;
  name: string;
  price: number;
  slot: ItemSlot;
  isOwned: boolean;
  isEquipped: boolean;
}

export interface DefenseTicketStatus {
  /** 미사용 방어권이 있으면 OWNED */
  status: "NONE" | "OWNED";
  /** 보유한 미사용 방어권 개수. 없으면 0 */
  count: number;
  /** 이번 주(회차 날짜 기준 월~일)에 방어권을 썼는지 */
  isUsedThisWeek: boolean;
}

/** GET /api/store */
export interface StoreResponse {
  /** 공양미 표시 잔액. 실제 잔액이 음수면 0 */
  riceBalance: number;
  defenseTicket: DefenseTicketStatus;
  /** 상점 노출 순서 */
  items: StoreItem[];
}
