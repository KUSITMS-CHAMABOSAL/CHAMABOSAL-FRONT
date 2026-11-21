import { type CSSProperties, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Button, Paragraph, Tooltip } from "@toss/tds-mobile";

import { BosalHead } from "@/entities/bosal";
import { type RoundResultResponse, useRoundResultQuery } from "@/entities/vote";
import { useConfirmResultSeen } from "@/features/room/confirmResultSeen";
import { paths } from "@/shared/config";
import { cn, formatWon } from "@/shared/lib";
import { useSafeAreaBottom } from "@/shared/lib/appsInToss";

import moneyWithWings from "../assets/emoji_money_with_wings.svg";
import shield from "../assets/icon_shield_color.svg";
import glowDefended from "../assets/result_glow_defended.svg";
import glowPicked from "../assets/result_glow_picked.svg";
import glowSafe from "../assets/result_glow_safe.svg";
import ringDefended from "../assets/result_ring_defended.svg";
import ringDefendedInner from "../assets/result_ring_defended_inner.svg";
import ringPicked from "../assets/result_ring_picked.svg";
import statueBody from "../assets/statue_all_safe_body.svg";
import statueFace from "../assets/statue_all_safe_face.svg";

interface VoteResultProps {
  roomId: number;
  roundId: number;
  /** 아직 안 본 결과면 false예요. 결과를 그리면 봤다고 저장해요. */
  isSeen: boolean;
}

/** 결과마다 뒤의 빛이에요. 지목은 분홍, 방어는 파랑, 지목 없음은 하늘색이에요. */
const GLOW: Record<RoundResultResponse["resultType"], string> = {
  PICKED: glowPicked,
  DEFENDED: glowDefended,
  ALL_SAFE: glowSafe,
  ALL_BOSAL: glowSafe,
};

/** 툴팁을 띄워 두는 시간이에요(시안 메모 "툴팁 2000ms 토스트 노출"). */
const TOOLTIP_MS = 2000;

/** 투표 중에 나간 사람은 이름 대신 "떠난 보살"로 보여줘요(화면설계서 23). */
const LEFT_NAME = "떠난 보살";

/** 지목된 보살의 번뇌비 자리예요. 참았으면 "참았어요", 인증하지 않았으면 "미인증"이에요. */
const getPickedAmount = ({
  certificationResult,
  spentAmount,
}: NonNullable<RoundResultResponse["picked"]>) => {
  if (!certificationResult) return "미인증";
  if (certificationResult === "ENDURED") return "참았어요";
  return `-${formatWon(spentAmount ?? 0)}`;
};

/** 뽑힌 보살이 없을 때 득표를 "민지 보살 2표 · 하린 보살 2표"처럼 보여줘요. */
const getVoteSummary = ({ voteCounts, allBosalCount }: RoundResultResponse) =>
  [
    // 🔖 "오늘은 모두 보살" 득표를 적는 문구는 시안에 없어 임시로 같은 꼴로 적어요.
    ...(allBosalCount ? [`오늘은 모두 보살 ${allBosalCount}표`] : []),
    ...voteCounts.map(
      ({ nickname, count, isLeft }) => `${isLeft ? LEFT_NAME : `${nickname} 보살`} ${count}표`,
    ),
  ].join(" · ");

/**
 * 투표 결과예요(시안 투표-10~12). 지목된 보살과 번뇌비, 지목이 없으면 득표를 보여줘요.
 * 이마 톡톡을 보낼 수 있을 때만 [이마 톡톡 하러가기]가 켜져요. 방어했거나 지목이 없으면 툴팁으로 2초 알려요.
 */
const VoteResult = ({ roomId, roundId, isSeen }: VoteResultProps) => {
  const navigate = useNavigate();
  const safeAreaBottom = useSafeAreaBottom();
  const { data: result, error } = useRoundResultQuery(roundId);
  const { mutate: confirmSeen } = useConfirmResultSeen(roomId);
  const [isTooltipOpen, setIsTooltipOpen] = useState(true);
  const hasResult = result !== undefined;

  // 결과를 처음 그릴 때 한 번 봤다고 저장해요.
  useEffect(() => {
    if (hasResult && !isSeen) confirmSeen(roundId);
  }, [hasResult, isSeen, roundId, confirmSeen]);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsTooltipOpen(false), TOOLTIP_MS);
    return () => window.clearTimeout(timer);
  }, []);

  if (!result) {
    if (error) throw error;
    // 🔖 로딩 시안이 없어 아직 아무것도 그리지 않아요.
    return null;
  }

  const { resultType, picked } = result;
  const isDefended = resultType === "DEFENDED";
  const tooltip = isDefended
    ? `${picked?.nickname ?? ""}보살이 방어권을 사용했어요`
    : picked
      ? null
      : "오늘은 다 같이 참아냈어요";

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
        src={GLOW[resultType]}
        alt=""
        className="pointer-events-none absolute top-[calc(-24.2svh-var(--room-tabs-height,0px))] left-1/2 h-[122.7svh] w-[196.8vw] max-w-none -translate-x-1/2 -scale-y-100"
      />
      {/* 위치와 간격은 시안 웹뷰 높이(718px)에 대한 비율이에요. 화면이 길어도 같은 자리에 놓여 빈 곳이 몰리지 않아요.
          제목은 위에서 9.9%(71px)이고, 방 탭이 있으면 그 높이만큼 빼요. */}
      <div className="relative flex flex-col items-center gap-2.5 px-6 pt-[calc(9.9svh-var(--room-tabs-height,0px))] text-center">
        <Paragraph as="h2" typography="st5" fontWeight="bold" color="var(--adaptiveGrey900)">
          오늘의 투표 종료
        </Paragraph>
        <Paragraph typography="t7" fontWeight="semibold" color="var(--adaptiveGrey900)">
          다음 투표는 모든 보살이 인증하면 바로 열려요.
        </Paragraph>
      </div>
      {/* "오늘의 가장 흔들린 보살"은 위에서 27.7%(199px)예요. 제목 높이(58px)를 빼서 그 자리에 맞춰요. 사이 간격은 2.2%(16px)예요. */}
      <div className="relative mt-[calc(17.8svh-58px)] flex flex-col items-center gap-[2.2svh] text-center">
        <Paragraph typography="t7" fontWeight="semibold" color="var(--adaptiveBlue600)">
          오늘의 가장 흔들린 보살
        </Paragraph>
        {picked ? (
          <div
            className={cn(
              // 카드 안 위아래 여백 2.8%(20px), 요소 사이 1.4%(10px)예요.
              "flex flex-col items-center gap-[1.4svh] rounded-2xl border border-solid border-(--adaptiveGreyOpacity200) px-8 py-[2.8svh]",
              isDefended ? "bg-(--adaptiveBackground)" : "bg-(--adaptiveBackground)/80",
            )}
          >
            <span className="flex items-center gap-1.5 rounded-[14px] border border-solid border-(--adaptiveGreyOpacity200) bg-(--adaptiveGrey700) px-2.5 py-1.5">
              {picked.certificationResult === "FAILED" && (
                <span aria-hidden className="relative size-5">
                  <img
                    src={moneyWithWings}
                    alt=""
                    className="absolute inset-[4.54%_4.74%_4.54%_6.4%]"
                  />
                </span>
              )}
              <Paragraph typography="t7" fontWeight="bold" color="var(--adaptiveBackground)">
                {getPickedAmount(picked)}
              </Paragraph>
            </span>
            <div aria-hidden className="relative size-[91px]">
              {isDefended && (
                <img
                  src={ringDefendedInner}
                  alt=""
                  className="absolute top-[7px] left-[7.5px] size-[76px]"
                />
              )}
              <img
                src={isDefended ? ringDefended : ringPicked}
                alt=""
                className="absolute inset-[-8.79%] max-w-none"
              />
              <BosalHead
                color={picked.color}
                className={cn(
                  "absolute top-3.5 left-[15.5px] h-[61px] w-[60px]",
                  isDefended && "opacity-80",
                )}
              />
              {isDefended && (
                <img src={shield} alt="" className="absolute top-[60px] left-[60px] size-6" />
              )}
            </div>
            <Paragraph typography="t5" fontWeight="semibold" color="var(--adaptiveGrey900)">
              {picked.isLeft ? LEFT_NAME : picked.nickname}
            </Paragraph>
          </div>
        ) : (
          <>
            <div aria-hidden className="relative h-[101px] w-16">
              <img src={statueBody} alt="" className="absolute inset-0 size-full" />
              <img
                src={statueFace}
                alt=""
                className="absolute top-[32.67px] left-[16.03px] h-[24.19px] w-[32.68px]"
              />
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <Paragraph typography="t5" fontWeight="semibold" color="var(--adaptiveGrey900)">
                뽑힌 보살이 없어요
              </Paragraph>
              {getVoteSummary(result) && (
                <Paragraph
                  typography="t7"
                  fontWeight="semibold"
                  color="var(--adaptiveGreyOpacity600)"
                >
                  {getVoteSummary(result)}
                </Paragraph>
              )}
            </div>
          </>
        )}
        <Tooltip
          open={tooltip !== null && isTooltipOpen}
          size="small"
          placement="bottom"
          messageAlign="center"
          message={tooltip}
        >
          <Button
            size="medium"
            color={result.canTap ? "primary" : "dark"}
            variant={result.canTap ? "fill" : "weak"}
            disabled={!result.canTap}
            onClick={() => navigate(paths.room.foreheadTap(roomId, roundId))}
          >
            이마 톡톡 하러가기
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};

export default VoteResult;
