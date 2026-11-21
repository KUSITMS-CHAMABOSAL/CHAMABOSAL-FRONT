import { useEffect, useState } from "react";
import { Top } from "@toss/tds-mobile";

import { formatClock, secondsUntil } from "@/shared/lib";

interface VoteHeaderProps {
  closesAt: string;
  /** 남은 시간이 0이 되면 한 번 불러요. 마감된 상태를 다시 받아요. */
  onClosed: () => void;
}

/** 남은 시간을 다시 그리는 간격이에요. */
const TICK_MS = 1000;

// 🔖 서버 시간 보정(Environment.getServerTime)이 들어오면 기기 시각 대신 써요.
/** 투표 중·투표 완료 화면 위쪽이에요. 마감까지 남은 시간이 1초마다 줄어요. */
const VoteHeader = ({ closesAt, onClosed }: VoteHeaderProps) => {
  const [now, setNow] = useState(Date.now);
  const secondsLeft = secondsUntil(closesAt, now);
  const isClosed = secondsLeft === 0;

  useEffect(() => {
    if (isClosed) {
      onClosed();
      return;
    }
    const timer = window.setInterval(() => setNow(Date.now()), TICK_MS);
    return () => window.clearInterval(timer);
  }, [isClosed, onClosed]);

  return (
    <Top
      subtitleTop={
        <Top.SubtitleParagraph size={13} fontWeight="semibold" color="var(--adaptiveBlue600)">
          {`투표 마감까지 ${formatClock(secondsLeft)}`}
        </Top.SubtitleParagraph>
      }
      title={
        <Top.TitleParagraph size={28} color="var(--adaptiveGrey900)">
          오늘 가장 크게
          <br />
          흔들린 보살은?
        </Top.TitleParagraph>
      }
      subtitleBottom={<Top.SubtitleParagraph size={17}>익명투표로 진행돼요</Top.SubtitleParagraph>}
    />
  );
};

export default VoteHeader;
