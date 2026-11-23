import type { CSSProperties, ReactNode } from "react";
import { Paragraph } from "@toss/tds-mobile";

import { useSafeAreaBottom } from "@/shared/lib/appsInToss";

interface ResultSceneProps {
  /** 뒤의 빛 이미지예요. 결과마다 색이 달라요. */
  glow: string;
  title: ReactNode;
  description: ReactNode;
  /** "오늘의 가장 흔들린 보살" 아래 내용이에요. */
  children: ReactNode;
}

/**
 * 투표 결과와 투표 없음 화면의 공통 틀이에요(시안 투표-10~13). 배경 빛, 제목, "오늘의 가장 흔들린 보살"을 놓아요.
 * 위치와 간격은 시안 웹뷰 높이(718px)에 대한 비율이라 화면이 길어도 빈 곳이 아래로 몰리지 않아요.
 */
const ResultScene = ({ glow, title, description, children }: ResultSceneProps) => {
  const safeAreaBottom = useSafeAreaBottom();
  return (
    <div
      style={{ "--safe-area-bottom": `${safeAreaBottom}px` } as CSSProperties}
      // 배경이 시안처럼 화면 끝까지 이어지도록 아래 탭바 자리(75px)까지 채우고, 그만큼 아래 여백을 당겨 스크롤은 생기지 않아요.
      className="relative -mb-[calc(75px+var(--safe-area-bottom))] min-h-[calc(100svh-var(--room-tabs-height,0px))] overflow-hidden bg-linear-to-b from-(--adaptiveBackground) to-(--adaptiveGrey100)"
    >
      {/* 뒤의 빛이에요. 시안처럼 화면 맨 위에서부터 뒤집힌 타원이 흐려져 내려와요.
          크기와 위치는 시안 화면(375×718)에 대한 비율이라 화면이 길어지면 빛도 같이 늘어나요.
          너비 196.8%(738px), 높이 122.7%(881px), 위에서 -24.2%(-174px)이고, 방 탭이 있으면 그 높이만큼 더 올려요. */}
      <img
        src={glow}
        alt=""
        className="pointer-events-none absolute top-[calc(-24.2svh-var(--room-tabs-height,0px))] left-1/2 h-[122.7svh] w-[196.8vw] max-w-none -translate-x-1/2 -scale-y-100"
      />
      {/* 제목은 위에서 9.9%(71px)이고, 방 탭이 있으면 그 높이만큼 빼요.
          제목 칸을 17.8%(128px) 이상으로 잡아 제목이 두 줄이어도 "오늘의 가장 흔들린 보살"이 위에서 27.7%(199px)에 놓여요. */}
      <div className="relative px-6 pt-[calc(9.9svh-var(--room-tabs-height,0px))] text-center">
        <div className="flex min-h-[17.8svh] flex-col items-center gap-2.5">
          <Paragraph as="h2" typography="st5" fontWeight="bold" color="var(--adaptiveGrey900)">
            {title}
          </Paragraph>
          <Paragraph typography="t7" fontWeight="semibold" color="var(--adaptiveGrey900)">
            {description}
          </Paragraph>
        </div>
      </div>
      {/* 사이 간격은 2.2%(16px)예요. */}
      <div className="relative flex flex-col items-center gap-[2.2svh] text-center">
        <Paragraph typography="t7" fontWeight="semibold" color="var(--adaptiveBlue600)">
          오늘의 가장 흔들린 보살
        </Paragraph>
        {children}
      </div>
    </div>
  );
};

export default ResultScene;
