import { useEffect, useState } from "react";

import { Badge, Button, ConfirmDialog, Paragraph, Tooltip } from "@toss/tds-mobile";

import { formatClock, secondsUntil, useTabBarToast } from "@/shared/lib";

import { SHIELD_USABLE_MINUTES } from "../config/shield";
import { getShieldErrorMessage, useApplyShield } from "../model/useApplyShield";

interface ShieldActionProps {
  roundId: number;
  /** 보유한 방어권 개수예요. */
  ticketCount: number;
  /** 방어권을 쓸 수 있는 마감 시각이에요. 톡톡 마감 뒤에 결과를 처음 열었으면 null이에요. */
  usableUntil: string | null;
  /** 지금 쓰면 서버가 받아 주는지예요. */
  canUse: boolean;
  /** 결과를 처음 보는 거라 안내 팝업을 띄워요. 앱을 열면 안 본 결과로 바로 오니 앱 진입 팝업이 돼요. */
  showIntro: boolean;
  /** 방어권을 썼어요. "방어!" 연출을 띄워요. */
  onDefended: () => void;
}

const TICK_MS = 1000;
/** 툴팁을 띄워 두는 시간이에요. 결과 화면의 다른 툴팁과 같아요(시안 메모 "툴팁 2000ms 토스트 노출"). */
const TOOLTIP_MS = 2000;

// 🔖 서버 시간 보정(Environment.getServerTime)이 들어오면 기기 시각 대신 써요.
/**
 * 톡톡 보살로 뽑힌 본인의 결과 화면 아래쪽이에요(시안 결과·이마톡톡-아이템사용제한-02, 03).
 * 결과를 처음 연 뒤 2분 동안 [이마 방어권 사용하기]가 켜지고, 남은 시간을 버튼 아래에 보여줘요.
 * 시간이 지나면 버튼을 끄고 툴팁으로 2초 알려요.
 * 처음 보는 결과면 안내 팝업(설계서 24 ①)을 먼저 띄워요. 방어권이 0개여도 띄우고 버튼만 꺼요.
 */
const ShieldAction = ({
  roundId,
  ticketCount,
  usableUntil,
  canUse,
  showIntro,
  onDefended,
}: ShieldActionProps) => {
  const [now, setNow] = useState(Date.now);
  const [tooltipClosed, setTooltipClosed] = useState(false);
  const secondsLeft = usableUntil ? secondsUntil(usableUntil, now) : 0;
  const isExpired = secondsLeft === 0;
  // 들어온 순간에만 정해요. 결과를 봤다고 저장하면 showIntro가 꺼져도 팝업은 닫을 때까지 둬요.
  const [isIntroOpen, setIsIntroOpen] = useState(() => showIntro && !isExpired);
  const { mutate: applyShield, isPending } = useApplyShield(roundId);
  const openToast = useTabBarToast();

  useEffect(() => {
    if (isExpired) return;
    const timer = window.setInterval(() => setNow(Date.now()), TICK_MS);
    return () => window.clearInterval(timer);
  }, [isExpired]);

  // 시간이 지난 순간부터 2초 동안 툴팁을 띄워요.
  useEffect(() => {
    if (!isExpired) return;
    const timer = window.setTimeout(() => setTooltipClosed(true), TOOLTIP_MS);
    return () => window.clearTimeout(timer);
  }, [isExpired]);

  const apply = () =>
    applyShield(undefined, {
      onSuccess: onDefended,
      onError: error => openToast(getShieldErrorMessage(error)),
    });

  return (
    <div className="flex flex-col items-center gap-1.5">
      <ConfirmDialog
        open={isIntroOpen}
        title={<ConfirmDialog.Title>오늘의 톡톡 보살로 뽑혔어요!</ConfirmDialog.Title>}
        description={
          <ConfirmDialog.Description>
            {`지금부터 단 ${SHIELD_USABLE_MINUTES}분 동안만\n이마 방어권을 사용할 수 있어요`}
          </ConfirmDialog.Description>
        }
        cancelButton={
          // 닫아도 남은 시간 동안 아래 버튼으로 쓸 수 있어요(설계서 24 ①-1).
          <ConfirmDialog.CancelButton onClick={() => setIsIntroOpen(false)}>
            괜찮아요
          </ConfirmDialog.CancelButton>
        }
        confirmButton={
          <ConfirmDialog.ConfirmButton
            disabled={isExpired || !canUse}
            onClick={() => {
              setIsIntroOpen(false);
              apply();
            }}
          >
            방어권 사용하기
          </ConfirmDialog.ConfirmButton>
        }
        onClose={() => setIsIntroOpen(false)}
      />
      <Paragraph
        typography="t7"
        fontWeight="semibold"
        color={isExpired ? "var(--adaptiveGreyOpacity500)" : "var(--adaptiveGreyOpacity800)"}
      >
        {`보유 방어권 ${ticketCount}개`}
      </Paragraph>
      <Tooltip
        open={isExpired && !tooltipClosed}
        size="small"
        placement="bottom"
        messageAlign="center"
        message={`아이템을 사용할 수 있는 ${SHIELD_USABLE_MINUTES}분이 지났어요`}
      >
        <Button
          size="medium"
          color="dark"
          disabled={isExpired || !canUse}
          loading={isPending}
          onClick={apply}
        >
          이마 방어권 사용하기
        </Button>
      </Tooltip>
      {/* 시안은 버튼 왼쪽이지만, 버튼 아래 가운데에 두기로 했어요(2026-11-24). */}
      {!isExpired && (
        <Badge size="large" color="red" variant="weak" aria-label="방어권을 쓸 수 있는 남은 시간">
          {/* "00:01:59"에서 시를 빼고 "01:59"로 보여줘요. 2분을 넘지 않아요. */}
          {formatClock(secondsLeft).slice(3)}
        </Badge>
      )}
    </div>
  );
};

export default ShieldAction;
