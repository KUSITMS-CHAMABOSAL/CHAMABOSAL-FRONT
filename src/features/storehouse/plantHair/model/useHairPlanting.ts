import { useSyncExternalStore } from "react";

import { HAIR_PLANT_PRICE } from "../config/plant";

interface HairPlantingState {
  /** 뽑혀서 비어 있는 머리카락 인덱스 */
  plucked: ReadonlySet<number>;
  rice: number;
}

// ponytail: 머리카락·공양미 API 스펙이 없어 화면 목업으로 시작해요. 새로고침하면 처음으로 돌아가요.
// 스펙이 나오면 조회 쿼리와 심기 mutation으로 바꿔요.
// 시안의 빈 자리(7·30·33번)에 확대 정렬을 확인할 양옆 자리(왼쪽 1·14번, 오른쪽 12번)를 더했어요.
// 공양미는 다섯 번 심고 여섯 번째에 '공양미가 부족해요'를 볼 수 있게 577석이에요.
let state: HairPlantingState = { plucked: new Set([1, 7, 12, 14, 30, 33]), rice: 577 };
const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export type PlantResult = "planted" | "notEnoughRice" | "notEmpty";

const plant = (index: number): PlantResult => {
  // 이미 심긴 자리에 다시 불려도 공양미를 깎지 않아요.
  if (!state.plucked.has(index)) return "notEmpty";
  if (state.rice < HAIR_PLANT_PRICE) return "notEnoughRice";
  const plucked = new Set(state.plucked);
  plucked.delete(index);
  state = { plucked, rice: state.rice - HAIR_PLANT_PRICE };
  listeners.forEach(listener => listener());
  return "planted";
};

/** 곳간과 나발 심기 화면이 같은 머리카락·공양미 상태를 봐요. */
export const useHairPlanting = () => {
  const { plucked, rice } = useSyncExternalStore(subscribe, () => state);
  return { plucked, rice, plant };
};
