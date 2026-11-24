import { useEffect } from "react";

/**
 * 화면이 떠 있는 동안 문서 스크롤과 iOS의 튕기는 스크롤을 막아요. 한 화면으로 끝나는 연출 화면에 써요.
 * 떠나면 원래대로 돌려놔요.
 */
export const useLockScroll = () => {
  useEffect(() => {
    const { style } = document.documentElement;
    const previous = { overflow: style.overflow, overscrollBehavior: style.overscrollBehavior };
    style.overflow = "hidden";
    style.overscrollBehavior = "none";
    return () => {
      style.overflow = previous.overflow;
      style.overscrollBehavior = previous.overscrollBehavior;
    };
  }, []);
};
