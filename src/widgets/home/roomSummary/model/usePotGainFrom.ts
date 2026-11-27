import { useEffect, useState } from "react";

import { getStorageItem, setStorageItem } from "@/shared/lib/appsInToss";

/** 방마다 마지막으로 본 솥이에요. `{다 채운 솥 수}:{찬 석}`으로 저장해요. */
const seenKey = (roomId: number) => `potSeen:${roomId}`;

/** 앱을 켜 둔 동안 본 값이에요. 기기 저장소보다 먼저 봐서, 저장소가 없는 개발 브라우저에서도 이 화면에서 늘면 알려요. */
const seenInSession = new Map<number, string>();

const parse = (value: string | null | undefined) => {
  const [seq, amount] = (value ?? "").split(":").map(Number);
  return Number.isInteger(seq) && Number.isInteger(amount) ? { seq, amount } : null;
};

/**
 * 지난번에 본 뒤로 솥에 공양미가 들어왔으면, 그때 찬 석을 돌려줘요. 게이지가 그 값에서 지금 값까지 차올라요.
 * 처음 보는 방이거나, 그 사이 솥을 다 채워 새 솥이 됐으면(한 솥 축하가 대신 알려요) 없어요.
 * 저장에 실패하면 다음에 들어올 때 한 번 더 차오를 뿐이에요.
 */
export const usePotGainFrom = (roomId: number, completedCount: number, amount: number) => {
  // 어느 방의 어느 값까지 차오르는지도 같이 들고 있어요. 방을 바꾼 직전에 이전 방 값으로 차오르지 않게 해요.
  const [gain, setGain] = useState<{ roomId: number; from: number; to: number }>();

  useEffect(() => {
    let active = true;
    const current = `${completedCount}:${amount}`;
    const remembered = seenInSession.get(roomId);

    const compare = (value: string | null | undefined) => {
      const seen = parse(value);
      if (active && seen?.seq === completedCount && seen.amount < amount)
        setGain({ roomId, from: seen.amount, to: amount });
      // 비교한 뒤에 기억해요. 저장소를 읽는 사이 다시 실행돼도(StrictMode 등) 이전 값과 비교해요.
      seenInSession.set(roomId, current);
      void setStorageItem(seenKey(roomId), current);
    };
    if (remembered !== undefined) compare(remembered);
    else void getStorageItem(seenKey(roomId)).then(compare);

    return () => {
      active = false;
    };
  }, [roomId, completedCount, amount]);

  return gain?.roomId === roomId && gain.to === amount ? gain.from : undefined;
};
