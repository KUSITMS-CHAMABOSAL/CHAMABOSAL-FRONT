import { useEffect, useRef } from "react";
import { graniteEvent } from "@apps-in-toss/web-framework";

/**
 * 토스 뒤로가기를 가로채요. `onBack`을 넘기는 동안은 기본 뒤로가기가 막히고 `onBack`만 불려요.
 * `undefined`를 넘기면 구독을 풀어 원래대로 뒤로 가요.
 * 토스 WebView에서만 와요. 브릿지 호출이 실패하면(로컬 브라우저) 아무것도 하지 않아요.
 * iOS 스와이프 뒤로가기는 이 이벤트를 거치지 않아 막지 못해요.
 */
export const useBackEvent = (onBack: (() => void) | undefined) => {
  // 매번 다시 구독하지 않도록 최신 핸들러만 바꿔 끼워요.
  const onBackRef = useRef(onBack);
  useEffect(() => {
    onBackRef.current = onBack;
  });

  const enabled = onBack !== undefined;
  useEffect(() => {
    if (!enabled) return;
    try {
      return graniteEvent.addEventListener("backEvent", {
        onEvent: () => onBackRef.current?.(),
      });
    } catch {
      return;
    }
  }, [enabled]);
};
