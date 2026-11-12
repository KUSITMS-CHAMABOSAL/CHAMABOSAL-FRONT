import { useCallback } from "react";
import { useToast } from "@toss/tds-mobile";

/**
 * 탭바가 있는 화면의 토스트예요. 화면 아래는 탭바와 캐러셀 버튼(콕 찌르기 등)이 차지해서,
 * 아래에 띄우면 방금 누른 버튼을 덮어요. 위에 띄워요.
 */
export const useTabBarToast = () => {
  const { openToast } = useToast();
  return useCallback((message: string) => openToast(message, { type: "top" }), [openToast]);
};
