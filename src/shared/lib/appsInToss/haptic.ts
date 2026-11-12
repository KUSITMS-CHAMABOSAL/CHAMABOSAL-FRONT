import { Device } from "@apps-in-toss/web-framework";

// 연타할 때 브릿지 호출이 쌓이지 않게 최소 간격을 둬요.
const MIN_INTERVAL_MS = 80;
let lastTriggeredAt = -Infinity;

/** 탭 피드백용 짧은 햅틱이에요. 지원하지 않는 환경이나 브릿지 실패는 조용히 무시해요. */
export const triggerTapHaptic = () => {
  const now = performance.now();
  if (now - lastTriggeredAt < MIN_INTERVAL_MS) return;
  lastTriggeredAt = now;
  try {
    Device.triggerHaptic({ type: "tap" }).catch(() => {});
  } catch {
    // 토스 앱 밖이거나 낮은 앱 버전이면 햅틱 없이 진행해요.
  }
};
