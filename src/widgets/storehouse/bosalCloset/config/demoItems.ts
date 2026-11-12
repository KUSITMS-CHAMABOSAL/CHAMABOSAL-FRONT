import type { BosalExpression, BosalFaceItem, BosalHat } from "@/entities/bosal";

export type ClosetTab = "all" | "hat" | "face" | "expression";

export const CLOSET_TABS: readonly { value: ClosetTab; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "hat", label: "모자" },
  { value: "face", label: "얼굴" },
  { value: "expression", label: "표정" },
];

export type ClosetItem =
  | { kind: "shield"; id: string; name: string; price: number; owned: number }
  | { kind: "hat"; id: string; name: string; price: number; hat: BosalHat }
  | { kind: "faceItem"; id: string; name: string; price: number; faceItem: BosalFaceItem }
  | { kind: "expression"; id: string; name: string; expression: BosalExpression };

export const ITEM_TAB: Record<ClosetItem["kind"], ClosetTab> = {
  shield: "all",
  hat: "hat",
  faceItem: "face",
  expression: "expression",
};

// 데모용 목업이에요. 아이템 API 스펙이 나오면 entities/item 조회로 바꿔요.
export const DEMO_ITEMS: readonly ClosetItem[] = [
  { kind: "shield", id: "shield", name: "이마 방어권", price: 100, owned: 1 },
  { kind: "hat", id: "santaHat", name: "산타 모자", price: 100, hat: "santaHat" },
  { kind: "faceItem", id: "rudolphNose", name: "루돌프 코", price: 100, faceItem: "rudolphNose" },
  { kind: "expression", id: "patient", name: "참은 표정", expression: "patient" },
  { kind: "expression", id: "failed", name: "못 참은 표정", expression: "failed" },
  { kind: "expression", id: "poked", name: "찔린 표정", expression: "poked" },
];

export const DEMO_BOSAL_NAME = "윤지보살";
