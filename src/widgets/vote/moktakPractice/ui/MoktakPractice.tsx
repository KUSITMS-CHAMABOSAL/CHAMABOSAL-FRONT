import { useEffect, useRef, useState } from "react";

import { FixedBottomCTA, Paragraph, Top, useToast } from "@toss/tds-mobile";

import { Moktak, useCompleteMoktak } from "@/features/vote/strikeMoktak";
import { isApiError } from "@/shared/api";
import { cn, useLockScroll } from "@/shared/lib";
import { logEvent, useBackEvent } from "@/shared/lib/appsInToss";

import { COMPLETE_DELAY_MS, PRACTICE_BACKGROUND } from "../config/scene";
import PracticeComplete from "./PracticeComplete";
import QuitPracticeSheet from "./QuitPracticeSheet";

/**
 * [종료하기]를 다시 보내도 같은 결과인 거절이에요. 없는 회차, 멤버·지목 아님, 보상 없는 결과,
 * 받은 톡톡 없음, 수행 시간 지남(다음 투표 열림), 아직 전달 전이에요.
 */
const QUIT_FINAL_ERRORS = [
  "ROUND_001",
  "ROOM_002",
  "TAP_005",
  "MOKTAK_001",
  "MOKTAK_002",
  "MOKTAK_003",
  "MOKTAK_005",
];

interface MoktakPracticeProps {
  roundId: number;
  /** 친구들에게 받은 톡톡 합계예요. 이만큼 쳐야 수행이 끝나요. 수행 중 톡톡이 더 오면 늘어나요. */
  goal: number;
  /** 이미 수행을 마친 회차면 바로 완료 화면을 보여줘요. */
  alreadyDone: boolean;
  /** 확인 시트에서 [종료하기]를 눌러 친 횟수를 보낸 뒤예요. 다시 보내도 안 되는 거절이어도 불러요. */
  onQuit: () => void;
  /**
   * 완료 화면의 [보너스 공양미 받기]예요. 공양미는 완료를 보낼 때 이미 지급돼서, 이번에 받은 양(`riceEarned`)만 넘겨요.
   * 이미 마친 회차로 들어와 이번에 보내지 않았으면 0이에요.
   */
  onClaimBonus: (riceEarned: number) => void;
  /** 완료 화면의 [닫기]예요. */
  onClose: () => void;
}

/**
 * 정신 차려! 톡톡(목탁 수행)이에요. 받은 톡톡만큼 목탁을 치면 서버에 완료를 보내고 완료 화면으로 넘어가요.
 * 목표를 채우면 더 칠 수 없고 [종료하기]도 사라져요(시안 목탁-07).
 */
const MoktakPractice = ({
  roundId,
  goal,
  alreadyDone,
  onQuit,
  onClaimBonus,
  onClose,
}: MoktakPracticeProps) => {
  // 수행과 완료 화면 모두 한 화면이라 스크롤을 막아요.
  useLockScroll();
  const [count, setCount] = useState(0);
  const [quitOpen, setQuitOpen] = useState(false);
  const [completed, setCompleted] = useState(false);
  /** 완료를 저장하지 못했어요. 갇히지 않게 [종료하기]를 다시 보여줘요. */
  const [saveFailed, setSaveFailed] = useState(false);
  const { mutate: complete, isPending } = useCompleteMoktak(roundId);
  const { openToast } = useToast();
  const reachedGoal = count >= goal;
  /** 완료를 보내는 중이에요. 같은 프레임에 연타가 겹쳐도 한 번만 보내요. */
  const sending = useRef(false);
  const timer = useRef<number | undefined>(undefined);
  /** 이번 완료로 받은 공양미예요. */
  const riceEarned = useRef(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  /** 수행을 끝냈다고 세요. 받은 톡톡만큼 다 쳤는지가 `completed`예요. */
  const logSession = (tapCount: number) =>
    logEvent("tap_session_complete", {
      role: "receiver",
      tap_count: tapCount,
      completed: tapCount >= goal,
    });

  /** 목표에 닿는 타격에서 한 번 완료를 보내요. */
  const finish = (finalCount: number) => {
    if (sending.current) return;
    sending.current = true;
    setSaveFailed(false);
    const startedAt = performance.now();
    complete(finalCount, {
      // 응답이 빨리 와도 마지막 타격이 끝날 시간(COMPLETE_DELAY_MS)은 채우고 넘어가요.
      onSuccess: result => {
        riceEarned.current = result.riceEarned;
        logSession(finalCount);
        timer.current = window.setTimeout(
          () => setCompleted(true),
          Math.max(0, COMPLETE_DELAY_MS - (performance.now() - startedAt)),
        );
      },
      onError: () => {
        sending.current = false;
        setSaveFailed(true);
        openToast("수행 결과를 저장하지 못했어요");
      },
    });
  };

  /**
   * [종료하기]도 친 횟수를 보내야 서버가 이 회차 수행을 끝내요(받은 톡톡보다 적으면 보상 없이 끝나요).
   * 한 번도 치지 않았으면 서버 요청 없이 즉시 나가요.
   * 회차가 이미 끝나 다시 보내도 안 되는 거절이면 그대로 나가요. 투표 탭이 상태를 다시 받아 맞춰요.
   * 그 밖의 실패(네트워크·서버 오류)는 시트에 남아 다시 누르게 해요. 토스 뒤로가기로는 언제든 나갈 수 있어요.
   */
  const quit = () => {
    const tapCount = counted.current;
    if (tapCount === 0) {
      // 요청이 없으니 여기서 바로 세요.
      logSession(0);
      onQuit();
      return;
    }
    complete(tapCount, {
      onSuccess: () => {
        logSession(tapCount);
        onQuit();
      },
      onError: error => {
        if (isApiError(error, ...QUIT_FINAL_ERRORS)) return onQuit();
        // 🔖 실패 문구는 시안이 없어 임시예요.
        openToast("종료하지 못했어요. 다시 시도해 주세요");
      },
    });
  };

  /** 친 횟수예요. 화면이 다시 그려지기 전에 탭이 몰려도 빠짐없이 세려고 ref로도 들고 있어요. */
  const counted = useRef(0);

  const strike = () => {
    if (counted.current >= goal) return;
    counted.current += 1;
    setCount(counted.current);
    if (counted.current >= goal) finish(counted.current);
  };

  // 이미 마친 회차는 바로 완료 화면이에요. 치는 중에는 이번 저장 결과를 따르되,
  // 저장에 실패했는데 서버가 이미 마쳤다고 하면(다른 기기 등) 완료 화면으로 넘어가요.
  const showsComplete = completed || (alreadyDone && (count === 0 || saveFailed));
  /** [종료하기]를 누를 수 있는 동안이에요. 목표를 채워 완료를 보내는 중이면 숨겨요. */
  const canQuit = !reachedGoal || saveFailed;

  // 토스 뒤로가기도 [종료하기]처럼 확인 시트를 띄워요(한 번도 안 쳤어도). 시트가 열려 있으면 시트를 닫아요.
  // 완료 화면과 완료를 보내는 중에는 원래대로 뒤로 가요.
  useBackEvent(
    !showsComplete && canQuit
      ? () => {
          if (!quitOpen) return setQuitOpen(true);
          if (!isPending) setQuitOpen(false);
        }
      : undefined,
  );

  if (showsComplete)
    return (
      <PracticeComplete onClaimBonus={() => onClaimBonus(riceEarned.current)} onClose={onClose} />
    );

  return (
    <main className={cn("relative flex min-h-svh flex-col overflow-hidden", PRACTICE_BACKGROUND)}>
      {/* 친 순간 퍼지는 빛이 글자를 덮지 않게 목탁보다 위에 그려요. */}
      <Top
        className="relative z-10"
        subtitleTop={<Top.SubtitleParagraph size={13}>오늘의 투표 결과</Top.SubtitleParagraph>}
        title={<Top.TitleParagraph size={28}>정신 차려! 톡톡</Top.TitleParagraph>}
        subtitleBottom={
          <Top.SubtitleParagraph>친구들이 톡톡해준만큼 수행해야 해요</Top.SubtitleParagraph>
        }
      />
      <div
        role="status"
        aria-label={`${goal}번 중 ${count}번 쳤어요`}
        className="relative z-10 mx-auto mt-[9px] flex items-center gap-2 rounded-full bg-(--adaptiveBackground) px-4 py-2.5"
      >
        {/* Paragraph는 문자열 자식에만 색을 입혀서 숫자를 문자열로 넘겨요. */}
        <Paragraph typography="t5" fontWeight="semibold" color="var(--adaptiveBlue600)">
          {String(count)}
        </Paragraph>
        <Paragraph typography="t5" fontWeight="semibold" color="var(--adaptiveGrey700)">
          /
        </Paragraph>
        <Paragraph typography="t5" fontWeight="semibold" color="var(--adaptiveGrey700)">
          {`${goal}번`}
        </Paragraph>
      </div>
      <Moktak disabled={reachedGoal || quitOpen} onStrike={strike} />
      {canQuit && (
        <FixedBottomCTA color="dark" background="none" onClick={() => setQuitOpen(true)}>
          종료하기
        </FixedBottomCTA>
      )}
      <QuitPracticeSheet
        open={quitOpen}
        quitting={isPending}
        onQuit={quit}
        onClose={() => {
          if (!isPending) setQuitOpen(false);
        }}
      />
    </main>
  );
};

export default MoktakPractice;
