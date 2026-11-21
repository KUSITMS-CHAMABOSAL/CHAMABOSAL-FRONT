import { type CSSProperties, useEffect, useState } from "react";
import { Button, Paragraph, Tooltip } from "@toss/tds-mobile";

import { useSafeAreaBottom } from "@/shared/lib/appsInToss";
import type { CertificationResult } from "@/shared/types";

import meditation from "../assets/illustration_meditation.svg";

interface CertifyResultProps {
  result: CertificationResult;
  /** 이 인증으로 전원이 인증해서 투표가 열렸어요. [투표 하기]가 함께 나와요. */
  isVoteStarted: boolean;
  onVote: () => void;
  onBackToRoom: () => void;
}

const MESSAGES: Record<CertificationResult, { title: string; description: string }> = {
  ENDURED: { title: "오늘도 번뇌 하나\n내려놓았어요", description: "장바구니 해탈 성공!" },
  FAILED: { title: "솔직하게 남겼어요\n내일 다시 참으면 돼요", description: "솔직함도 인증이에요" },
};

/** 시안 메모: 툴팁 2000ms 토스트 노출 */
const VOTE_TOOLTIP_MS = 2000;

/** 인증 완료예요. 참았는지에 따라 문구가 달라지고, 투표가 열렸으면 [투표 하기]를 함께 보여줘요. */
const CertifyResult = ({ result, isVoteStarted, onVote, onBackToRoom }: CertifyResultProps) => {
  const [isTooltipOpen, setIsTooltipOpen] = useState(isVoteStarted);
  const style = { "--safe-area-bottom": `${useSafeAreaBottom()}px` } as CSSProperties;
  const { title, description } = MESSAGES[result];

  useEffect(() => {
    const timer = setTimeout(() => setIsTooltipOpen(false), VOTE_TOOLTIP_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    // 하단 탭바가 아래에 자리(75px + safe area)를 따로 차지해요. 그만큼 빼서 스크롤이 생기지 않게 해요.
    // 문구는 버튼(56px) 위 남은 높이의 가운데에 둬요.
    <main
      style={style}
      className="flex h-[calc(100svh-75px-var(--safe-area-bottom))] flex-col justify-center overflow-hidden bg-(--adaptiveBackground) pb-14"
    >
      <div className="flex flex-col items-center gap-6 px-10 text-center">
        <img src={meditation} alt="" width={60} height={60} />
        <div className="flex flex-col gap-2.5">
          <Paragraph
            as="h1"
            typography="st5"
            fontWeight="bold"
            color="var(--adaptiveGrey900)"
            className="whitespace-pre-line"
          >
            {title}
          </Paragraph>
          <Paragraph typography="t7" fontWeight="semibold" color="var(--adaptiveGrey900)">
            {description}
          </Paragraph>
        </div>
      </div>
      {/* 버튼은 하단 탭바 바로 위예요. 툴팁은 시안처럼 버튼 줄 가운데에 떠요. */}
      <div className="fixed inset-x-0 bottom-[calc(72px+var(--safe-area-bottom))] px-5">
        <Tooltip
          open={isTooltipOpen}
          placement="top"
          size="small"
          message="모두가 인증해서 투표가 열렸어요"
        >
          <div className="flex gap-2">
            {isVoteStarted && (
              <Button
                size="xlarge"
                color="primary"
                variant="weak"
                className="shrink-0"
                onClick={onVote}
              >
                투표 하기
              </Button>
            )}
            <Button size="xlarge" display="block" className="flex-1" onClick={onBackToRoom}>
              방으로 돌아가기
            </Button>
          </div>
        </Tooltip>
      </div>
    </main>
  );
};

export default CertifyResult;
