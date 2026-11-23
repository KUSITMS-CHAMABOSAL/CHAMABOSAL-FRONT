import type { BosalExpression, ItemCode } from "@/entities/bosal";
import type { ItemSlot } from "@/entities/item";

export type ClosetTab = "all" | "hat" | "face" | "accessory" | "expression";

// 슬롯 이름은 기획 '코스튬 가격표'(HAT 모자 / FACE 얼굴 / ACCESSORY 악세사리)를 따라요.
// 탭 순서는 전체·모자·얼굴·악세사리·표정이에요(2026-11-24 확정).
export const CLOSET_TABS: readonly { value: ClosetTab; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "hat", label: "모자" },
  { value: "face", label: "얼굴" },
  { value: "accessory", label: "악세사리" },
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
