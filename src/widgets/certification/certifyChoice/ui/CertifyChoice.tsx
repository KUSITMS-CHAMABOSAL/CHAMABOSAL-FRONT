import type { CSSProperties } from "react";
import { Button, Tooltip, Top } from "@toss/tds-mobile";

import { useSafeAreaBottom } from "@/shared/lib/appsInToss";
import type { CertificationResult } from "@/shared/types";

import todayBosal from "../assets/illustration_today_bosal.svg";

interface CertifyChoiceProps {
  onSelect: (result: CertificationResult) => void;
}

/** 번뇌 떠올리기예요. 오늘의 보살 앞에서 참았어요·못 참았어요를 골라 작성 화면으로 가요. */
const CertifyChoice = ({ onSelect }: CertifyChoiceProps) => {
  const safeAreaBottom = useSafeAreaBottom();
  const style = { "--safe-area-bottom": `${safeAreaBottom}px` } as CSSProperties;

  return (
    // 하단 탭바 자리 위까지만 그려서 스크롤이 생기지 않게 해요. 넘치는 보살 아래쪽은 버튼 뒤 흰 바탕이 가려요.
    <main
      style={style}
      className="flex h-[calc(100svh-75px-var(--safe-area-bottom))] flex-col overflow-hidden bg-(--adaptiveBackground)"
    >
      <Top
        className="relative z-10"
        subtitleTop={<Top.SubtitleParagraph size={13}>오늘의 번뇌 기록</Top.SubtitleParagraph>}
        title={<Top.TitleParagraph size={28}>번뇌 떠올리기</Top.TitleParagraph>}
        subtitleBottom={<Top.SubtitleParagraph>오늘의 번뇌는 어땠나요?</Top.SubtitleParagraph>}
      />
      {/* 보살은 제목 바로 아래부터 남은 높이를 채워요. 화면이 길면 그림을 키우고(양옆을 조금 잘라요),
          짧으면 폭에 맞추고 아래를 잘라요. 시안 그림은 375×582예요. */}
      <div className="relative min-h-0 flex-1">
        <img
          src={todayBosal}
          alt=""
          width={375}
          height={582}
          className="absolute inset-0 size-full object-cover object-top"
        />
        {/* 말풍선 꼬리는 시안 그림 위에서 104px예요. 그림이 커진 비율(높이 104/582, 폭 104/375 중 큰 쪽)만큼 따라가요. */}
        <div className="absolute top-[max(17.87%,27.73vw)] left-1/2">
          <Tooltip open placement="top" size="medium" message="보아하니 득도가 멀지 않았구나">
            <span className="block size-px" />
          </Tooltip>
        </div>
      </div>
      {/* 버튼 뒤는 흰 바탕이고 위로 흐려져요. 버튼은 하단 탭바 바로 위예요(탭바 위 여백 16 + 바 59 + 9). */}
      <div className="fixed inset-x-0 bottom-0">
        <div className="h-9 bg-linear-to-b from-transparent to-(--adaptiveBackground)" />
        <div className="flex gap-2.75 bg-(--adaptiveBackground) px-5 pb-[calc(84px+var(--safe-area-bottom))]">
          <Button
            size="xlarge"
            color="danger"
            variant="weak"
            display="block"
            onClick={() => onSelect("FAILED")}
          >
            못 참았어요
          </Button>
          <Button
            size="xlarge"
            color="primary"
            variant="weak"
            display="block"
            onClick={() => onSelect("ENDURED")}
          >
            참았어요
          </Button>
        </div>
      </div>
    </main>
  );
};

export default CertifyChoice;
