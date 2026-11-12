import { useCallback } from "react";
import { useToast } from "@toss/tds-mobile";

import { useSafeAreaBottom } from "./appsInToss";

/** 하단 탭바가 차지하는 높이예요. `app/layouts/RoomTabBar`의 위 여백 16 + 바 59 */
const TAB_BAR_HEIGHT = 75;
const TOAST_SPACING = 8;

/** 탭바가 있는 화면의 토스트예요. TDS 기본 위치는 탭바에 가려져서 탭바 위로 올려요. */
export const useTabBarToast = () => {
  const { openToast } = useToast();
  const gap = TAB_BAR_HEIGHT + useSafeAreaBottom() + TOAST_SPACING;
  return useCallback((message: string) => openToast(message, { gap }), [openToast, gap]);
};
