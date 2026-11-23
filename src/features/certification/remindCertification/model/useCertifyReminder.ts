import { useEffect, useState } from "react";

import { getStorageItem, setStorageItem } from "@/shared/lib/appsInToss";

/** 방마다 마지막으로 인증 전 안내를 띄운 회차예요. 같은 회차에는 다시 띄우지 않아요. */
const seenKey = (roomId: number) => `certifyReminderRound:${roomId}`;

/**
 * 인증 전 안내를 띄울지예요(설계서 09-1 [1]). 회차(하루)마다 처음 들어왔을 때 한 번만 띄워요.
 * 기기 저장소를 읽는 동안은 `undefined`예요. 다른 팝업이 이 안내 뒤에 뜨도록 기다리는 데 써요.
 * 저장에 실패하면 다음에 들어올 때 한 번 더 뜰 뿐이에요.
 */
export const useCertifyReminder = (roomId: number, roundId: number | null, eligible: boolean) => {
  const [seenRoundId, setSeenRoundId] = useState<number | null | undefined>(undefined);

  useEffect(() => {
    let active = true;
    void getStorageItem(seenKey(roomId)).then(value => {
      if (active) setSeenRoundId(value === null ? null : Number(value));
    });
    return () => {
      active = false;
    };
  }, [roomId]);

  const isOpen =
    seenRoundId === undefined ? undefined : eligible && roundId !== null && roundId !== seenRoundId;

  const close = () => {
    if (roundId === null) return;
    setSeenRoundId(roundId);
    void setStorageItem(seenKey(roomId), String(roundId));
  };

  return { isOpen, close };
};
