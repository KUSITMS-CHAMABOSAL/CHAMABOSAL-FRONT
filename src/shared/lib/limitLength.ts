import type { SyntheticEvent } from "react";

/**
 * 입력값을 최대 길이로 잘라요. 한글을 조합하는 중에는 자르지 않고, 조합이 끝난 뒤(`compositionend`)에 다시 잘라요.
 * 조합 중에 자르거나 `maxLength`를 걸면 마지막 글자가 들어가지 않거나 깨져요.
 */
export const limitLength = (value: string, max: number, event: SyntheticEvent) => {
  const isComposing = "isComposing" in event.nativeEvent && event.nativeEvent.isComposing === true;
  return isComposing ? value : value.slice(0, max);
};
