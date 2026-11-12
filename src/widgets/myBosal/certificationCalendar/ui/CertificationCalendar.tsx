import { useState } from "react";

import { IconButton, Paragraph, TableRow } from "@toss/tds-mobile";

import { useCalendarQuery, usePrefetchCalendar } from "@/entities/certification";
import { cn } from "@/shared/lib";
import type { CertificationResult } from "@/shared/types";

import { formatMonthLabel, getMonthGrid, shiftMonth } from "../lib/month";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];
const WEEKDAY_COLOR = (index: number) => {
  if (index === 0) return "var(--adaptiveRed500)";
  if (index === 6) return "var(--adaptiveBlue500)";
  return "var(--adaptiveGrey600)";
};

// 시안 색(민트·빨강 그라데이션)과 가장 가까운 TDS 색이에요.
const RESULT_STYLE: Record<CertificationResult, { circle: string; text: string; label: string }> = {
  ENDURED: {
    circle: "bg-conic-180 from-(--adaptiveGreen50) to-(--adaptiveGreen200)",
    text: "var(--adaptiveGreen700)",
    label: "참았어요.",
  },
  FAILED: {
    circle: "bg-conic-180 from-(--adaptiveRed100) to-(--adaptiveRed200)",
    text: "var(--adaptiveRed600)",
    label: "못 참았어요.",
  },
};

interface CertificationCalendarProps {
  roomId: number;
}

/**
 * 이 방의 내 인증 캘린더예요. 처음에는 서버 기준 이번 달을 보여주고, 화살표로 지난 달을 봐요.
 * 기기 시계가 아니라 서버가 준 `month`를 이번 달로 써요. 회차는 새벽 5시 기준이라 기기 날짜와 다를 수 있어요.
 */
const CertificationCalendar = ({ roomId }: CertificationCalendarProps) => {
  /** 보고 있는 달이에요. 비어 있으면 이번 달이에요. */
  const [month, setMonth] = useState<string>();
  const current = useCalendarQuery(roomId);
  const selected = useCalendarQuery(roomId, month);
  const thisMonth = current.data?.month;
  // 화살표로 넘길 수 있는 건 지난 달뿐이라 보고 있는 달의 이전 달을 미리 받아요.
  // 다음 달은 이미 보고 온 달이라 캐시에 있어요.
  usePrefetchCalendar(roomId, thisMonth ? shiftMonth(month ?? thisMonth, -1) : undefined);

  // 🔖 로딩·에러 시안이 없어 아직 아무것도 그리지 않아요.
  if (!thisMonth) return null;

  const shownMonth = month ?? thisMonth;
  // 다음 달을 받는 동안에는 이전 달 데이터가 남아 있어서, 달이 같을 때만 표시해요.
  const days = selected.data?.month === shownMonth ? selected.data.calendar : [];
  const results = new Map(days.map(day => [day.date, day.result]));
  const label = formatMonthLabel(shownMonth, thisMonth);
  const endured = days.filter(day => day.result === "ENDURED").length;
  const goToMonth = (next: string) => setMonth(next === thisMonth ? undefined : next);

  return (
    <section className="pt-3">
      <TableRow
        align="space-between"
        left={
          <Paragraph typography="t6" fontWeight="bold" color="var(--adaptiveGrey900)">
            인증 캘린더
          </Paragraph>
        }
        right={null}
      />
      <div className="mt-3.25 flex gap-2.75 px-5" aria-hidden>
        {(["ENDURED", "FAILED"] as const).map(result => (
          <div key={result} className="flex items-center gap-1.5">
            <span className={cn("size-4 rounded-full", RESULT_STYLE[result].circle)} />
            <Paragraph typography="t7" fontWeight="medium" color="var(--adaptiveGrey600)">
              {RESULT_STYLE[result].label}
            </Paragraph>
          </div>
        ))}
      </div>

      <div className="mx-5 mt-3.25 mb-4.75 rounded-xl bg-(--adaptiveBackground) px-1.75 pt-4.75 pb-4.25 shadow-[0_0_4px_var(--adaptiveGrey200)]">
        {/* 화살표는 누를 영역(48px)을 지키고, 아이콘(24px) 위치와 줄 높이만 시안에 맞춰요. */}
        <div className="-mx-1.25 flex h-6.75 items-center justify-between">
          <IconButton
            name="icon-arrow-back-ios-center-mono"
            color="var(--adaptiveGrey400)"
            iconSize={24}
            aria-label="이전 달"
            onClick={() => goToMonth(shiftMonth(shownMonth, -1))}
          />
          <Paragraph typography="t4" fontWeight="bold" color="var(--adaptiveGrey900)">
            {label}
          </Paragraph>
          <IconButton
            name="icon-arrow-back-ios-center-mono"
            color="var(--adaptiveGrey400)"
            iconSize={24}
            aria-label="다음 달"
            disabled={shownMonth >= thisMonth}
            className="rotate-180 disabled:opacity-30"
            onClick={() => goToMonth(shiftMonth(shownMonth, 1))}
          />
        </div>

        {/* 칸 42개를 하나씩 읽지 않도록 격자는 숨기고 요약을 읽혀요. */}
        <p className="sr-only" aria-live="polite">
          {`${label} 인증 기록, 참았어요 ${endured}일, 못 참았어요 ${days.length - endured}일`}
        </p>
        <div className="mt-5.5" aria-hidden>
          {/* 시안 높이(18px)에 맞추고 글자는 가운데에 둬요. 글자가 커지면 넘쳐도 잘리지 않아요. */}
          <div className="grid h-4.5 grid-cols-7 items-center text-center">
            {WEEKDAYS.map((weekday, index) => (
              <Paragraph
                key={weekday}
                typography="t6"
                fontWeight="semibold"
                color={WEEKDAY_COLOR(index)}
              >
                {weekday}
              </Paragraph>
            ))}
          </div>
          <div className="mt-2.75 grid grid-cols-7 gap-y-1">
            {getMonthGrid(shownMonth).flatMap(week =>
              week.map(({ date, inMonth }) => {
                // 앞뒤 달 날짜는 흐린 숫자만 그리고 인증 결과는 표시하지 않아요.
                const result = inMonth ? results.get(date) : undefined;
                const textColor = result
                  ? RESULT_STYLE[result].text
                  : inMonth
                    ? "var(--adaptiveGrey700)"
                    : "var(--adaptiveGrey400)";
                return (
                  <div key={date} className="flex h-8 justify-center">
                    <span
                      className={cn(
                        "flex size-8 items-center justify-center rounded-full",
                        result && RESULT_STYLE[result].circle,
                      )}
                    >
                      <Paragraph typography="t6" fontWeight="medium" color={textColor}>
                        {/* Paragraph는 문자열만 글자 스타일로 감싸서 숫자를 문자열로 넘겨요. */}
                        {String(Number(date.slice(-2)))}
                      </Paragraph>
                    </span>
                  </div>
                );
              }),
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CertificationCalendar;
