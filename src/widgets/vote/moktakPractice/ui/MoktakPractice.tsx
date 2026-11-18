import { useEffect, useRef, useState } from "react";

import { FixedBottomCTA, Paragraph, Top, useToast } from "@toss/tds-mobile";

import { Moktak, useCompleteMoktak } from "@/features/vote/strikeMoktak";
import { isApiError } from "@/shared/api";
import { cn } from "@/shared/lib";

import { COMPLETE_DELAY_MS, PRACTICE_BACKGROUND } from "../config/scene";
import PracticeComplete from "./PracticeComplete";
import QuitPracticeSheet from "./QuitPracticeSheet";

interface MoktakPracticeProps {
  roundId: number;
  /** 친구들에게 받은 톡톡 합계예요. 이만큼 쳐야 수행이 끝나요. 수행 중 톡톡이 더 오면 늘어나요. */
  goal: number;
  /** 이미 수행을 마친 회차면 바로 완료 화면을 보여줘요. */
  alreadyDone: boolean;
  /** 확인 시트에서 [종료하기]를 눌렀을 때예요. */
  onQuit: () => void;
  onClaimBonus: () => void;
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
  const [count, setCount] = useState(0);
  const [quitOpen, setQuitOpen] = useState(false);
  const [completed, setCompleted] = useState(false);
  /** 완료를 저장하지 못했어요. 갇히지 않게 [종료하기]를 다시 보여줘요. */
  const [saveFailed, setSaveFailed] = useState(false);
  const { mutate: complete } = useCompleteMoktak(roundId);
  const { openToast } = useToast();
  const reachedGoal = count >= goal;
  /** 완료를 보내는 중이에요. 같은 프레임에 연타가 겹쳐도 한 번만 보내요. */
  const sending = useRef(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  /** 목표에 닿는 타격에서 한 번 완료를 보내요. */
  const finish = (finalCount: number) => {
    if (sending.current) return;
    sending.current = true;
    setSaveFailed(false);
    const startedAt = performance.now();
    complete(finalCount, {
      // 응답이 빨리 와도 마지막 타격이 끝날 시간(COMPLETE_DELAY_MS)은 채우고 넘어가요.
      onSuccess: () => {
        timer.current = window.setTimeout(
          () => setCompleted(true),
          Math.max(0, COMPLETE_DELAY_MS - (performance.now() - startedAt)),
        );
      },
      onError: error => {
        sending.current = false;
        setSaveFailed(true);
        // 수행 중 톡톡이 더 왔어요. 받은 톡톡을 다시 받으면 목표가 늘어 이어서 칠 수 있고,
        // 다시 받지 못해도 [종료하기]로 나갈 수 있어요.
        if (isApiError(error, "MOKTAK_004")) return;
        openToast("수행 결과를 저장하지 못했어요");
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

  // 이미 마친 회차는 바로 완료 화면이에요. 다시 받은 값도 반영하되, 치기 시작했다면 이번 저장 결과를 따라요.
  if (completed || (alreadyDone && count === 0))
    return <PracticeComplete onClaimBonus={onClaimBonus} onClose={onClose} />;

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
      {(!reachedGoal || saveFailed) && (
        <FixedBottomCTA color="dark" background="none" onClick={() => setQuitOpen(true)}>
          종료하기
        </FixedBottomCTA>
      )}
      <QuitPracticeSheet open={quitOpen} onQuit={onQuit} onClose={() => setQuitOpen(false)} />
    </main>
  );
};

export default MoktakPractice;
