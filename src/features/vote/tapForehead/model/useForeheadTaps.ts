import { useEffect, useRef, useState } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { sessionQueries } from "@/entities/session";
import { voteQueries } from "@/entities/vote";

import { sendTaps, startTaps } from "../api/tapApi";

/**
 * 지목된 친구의 이마를 톡톡하는 횟수예요.
 * 들어오면 시작을 알리고, 화면을 떠날 때([종료하기], 뒤로 가기, 닫기) 친 횟수를 한 번 보내요.
 * 앱이 강제로 닫히면 보내지 못해요.
 */
export const useForeheadTaps = (roundId: number) => {
  const queryClient = useQueryClient();
  const [count, setCount] = useState(0);
  /** 떠나는 순간의 횟수를 읽으려고 ref로도 들고 있어요. */
  const counted = useRef(0);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    // 다시 보내도 성공해서, 개발 모드에서 두 번 붙어도 괜찮아요. 실패해도 톡톡은 칠 수 있게 둬요.
    startTaps(roundId).catch(() => {});
    return () => {
      mounted.current = false;
      // 개발 모드(StrictMode)는 떼자마자 다시 붙여요. 한 틱 뒤에도 떨어져 있을 때만 떠난 거예요.
      window.setTimeout(() => {
        if (mounted.current) return;
        sendTaps(roundId, counted.current)
          .then(() => {
            // 투표 탭 상태와 공양미가 바뀌어요.
            void queryClient.invalidateQueries({ queryKey: voteQueries.all() });
            void queryClient.invalidateQueries({ queryKey: sessionQueries.me().queryKey });
          })
          // 🔖 시안에 실패 안내가 없어요. 이미 보냈거나(TAP_003) 시간이 지난(TAP_004) 경우도 여기로 와요.
          .catch(() => {});
      });
    };
  }, [roundId, queryClient]);

  const tap = () => {
    counted.current += 1;
    setCount(counted.current);
  };

  return { count, tap };
};
