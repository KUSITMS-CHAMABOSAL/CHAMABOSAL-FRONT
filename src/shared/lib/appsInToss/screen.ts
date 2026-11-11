import { useSyncExternalStore } from "react";
import { SafeArea } from "@apps-in-toss/web-framework";

// 브릿지 호출이 실패하면 여백 없이(0) 그립니다.
const subscribe = (onChange: () => void) => {
  try {
    return SafeArea.subscribe({ onEvent: onChange });
  } catch {
    return () => {};
  }
};

const getBottomInset = () => {
  try {
    return SafeArea.get().bottom;
  } catch {
    return 0;
  }
};

/** 하단 홈 인디케이터에 가리지 않도록 비워야 하는 높이(px)입니다. */
export const useSafeAreaBottom = () => useSyncExternalStore(subscribe, getBottomInset);
