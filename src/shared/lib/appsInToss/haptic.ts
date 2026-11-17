import { Device, type HapticFeedbackType } from "@apps-in-toss/web-framework";

// 연타할 때 브릿지 호출이 쌓이지 않게 최소 간격을 둬요.
const MIN_INTERVAL_MS = 80;
let lastTriggeredAt = -Infinity;

/** 개발 서버에서만 햅틱 실패를 알려요. 실기기에서 햅틱이 안 느껴질 때 원인을 찾으려고 남겨요. */
const warnInDev = (error: unknown) => {
  if (import.meta.env.DEV) console.warn("햅틱 호출 실패", error);
};

/**
 * 탭 피드백용 짧은 햅틱이에요. 기본은 가장 가벼운 `tap`이고, 더 또렷해야 하면 종류를 넘겨요.
 * 지원하지 않는 환경이나 브릿지 실패는 조용히 무시해요.
 */
export const triggerTapHaptic = (type: HapticFeedbackType = "tap") => {
  const now = performance.now();
  if (now - lastTriggeredAt < MIN_INTERVAL_MS) return;
  lastTriggeredAt = now;
  try {
    Device.triggerHaptic({ type }).catch(warnInDev);
  } catch (error) {
    // 토스 앱 밖이거나 낮은 앱 버전이면 햅틱 없이 진행해요.
    warnInDev(error);
  }
};
