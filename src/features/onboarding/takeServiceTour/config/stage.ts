import type { ControlTone } from "../model/types";

/**
 * 시안 좌표계예요.
 * 그림이 서로 겹쳐 배치돼 있어 이 비율 그대로 그리고, 화면 크기에 맞춰 통째로 줄이거나 늘려요.
 */
export const STAGE = { width: 375, height: 718 } as const;

export const MATCHED_LAYER = {
  title: "title",
  bosal: "bosal",
} as const;

export const CONTROL_TONES: readonly ControlTone[] = [
  "light",
  "dark",
  "dark",
  "dark",
  "light",
  "dark",
];

export const STEP_COUNT = CONTROL_TONES.length;
