import { useEffect, useState } from "react";

import { getStorageItem, setStorageItem } from "@/shared/lib/appsInToss";

const SEEN_KEY = "serviceTourSeen";

/** 이번 실행에서 온보딩을 마쳤는지예요. 기기 저장에 실패해도 같은 실행 안에서는 다시 보여주지 않아요. */
let finishedThisLaunch = false;

/** 온보딩을 끝까지 보거나 건너뛰었다고 기기에 남겨요. 처음 한 번만 보여주기 위해서예요. */
export const markServiceTourSeen = async () => {
  finishedThisLaunch = true;
  await setStorageItem(SEEN_KEY, "true");
};

/** 온보딩을 본 적 있는지예요. 기기 저장소를 읽는 동안은 `undefined`예요. */
export const useHasSeenServiceTour = () => {
  const [seen, setSeen] = useState<boolean | undefined>(() =>
    finishedThisLaunch ? true : undefined,
  );

  useEffect(() => {
    if (finishedThisLaunch) return;
    let active = true;
    void getStorageItem(SEEN_KEY).then(value => {
      if (active) setSeen(finishedThisLaunch || value === "true");
    });
    return () => {
      active = false;
    };
  }, []);

  return seen;
};
