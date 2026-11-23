import { useSyncExternalStore } from "react";

import { getStorageItem, setStorageItem } from "@/shared/lib/appsInToss";

const SEEN_KEY = "serviceTourSeen";

/** 온보딩을 본 적 있는지예요. 기기 저장소를 읽기 전에는 `undefined`예요. */
let seen: boolean | undefined;
let loading: Promise<void> | undefined;
const listeners = new Set<() => void>();

const setSeen = (value: boolean) => {
  seen = value;
  listeners.forEach(listener => listener());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  // 기기 저장소는 처음 구독할 때 한 번만 읽어요. 그 전에 온보딩을 마쳤으면 그 값을 둬요.
  loading ??= getStorageItem(SEEN_KEY).then(value => {
    if (seen === undefined) setSeen(value === "true");
  });
  return () => {
    listeners.delete(listener);
  };
};

/**
 * 온보딩을 끝까지 보거나 건너뛰었다고 기기에 남겨요. 처음 한 번만 보여주기 위해서예요.
 * 기기 저장에 실패해도 같은 실행 안에서는 다시 보여주지 않아요.
 */
export const markServiceTourSeen = async () => {
  setSeen(true);
  await setStorageItem(SEEN_KEY, "true");
};

/** 온보딩을 본 적 있는지예요. 기기 저장소를 읽는 동안은 `undefined`이고, 마치는 순간 바로 `true`가 돼요. */
export const useHasSeenServiceTour = () => useSyncExternalStore(subscribe, () => seen);
