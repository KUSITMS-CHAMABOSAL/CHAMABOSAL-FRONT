import type { BosalExpression, ItemCode } from "@/entities/bosal";
import type { ItemSlot } from "@/entities/item";

export type ClosetTab = "all" | "hat" | "face" | "accessory" | "expression";

// 🔖 시안 탭은 전체·모자·얼굴·표정이에요. 서버의 ACCESSORY 슬롯(옥반지, 에너지파)을 보여줄 탭이 없어 '소품'을 더했어요.
export const CLOSET_TABS: readonly { value: ClosetTab; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "hat", label: "모자" },
  { value: "face", label: "얼굴" },
  { value: "accessory", label: "소품" },
  { value: "expression", label: "표정" },
];

export const SLOT_TAB: Record<ItemSlot, ClosetTab> = {
  HAT: "hat",
  FACE: "face",
  ACCESSORY: "accessory",
};

export type ClosetItem =
  | { kind: "shield"; id: string; name: string; price: number; isOwned: boolean }
  | {
      kind: "item";
      id: string;
      itemId: number;
      name: string;
      price: number;
      code: ItemCode;
      slot: ItemSlot;
      isOwned: boolean;
    }
  | { kind: "expression"; id: string; name: string; expression: BosalExpression };

export const EXPRESSION_ITEMS: readonly ClosetItem[] = [
  { kind: "expression", id: "patient", name: "참은 표정", expression: "patient" },
  { kind: "expression", id: "failed", name: "못 참은 표정", expression: "failed" },
  { kind: "expression", id: "poked", name: "찔린 표정", expression: "poked" },
];
