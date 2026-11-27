import { useRef } from "react";

import { Paragraph } from "@toss/tds-mobile";

import { cn } from "@/shared/lib";
import type { ReactionType } from "@/shared/types";

import { ThumbDownIcon, ThumbUpIcon } from "../assets";

const OPTIONS = [
  {
    value: "GOOD",
    label: "잘 참았어요",
    Icon: ThumbUpIcon,
    iconColor: "text-(color:--adaptiveGreyOpacity400)",
    selected: "border-(--adaptiveBlue500) bg-(--adaptiveBlue50)",
    selectedIconColor: "text-(color:--adaptiveBlue400)",
    selectedText: "var(--adaptiveBlue600)",
  },
  {
    value: "BAD",
    label: "아쉬워요",
    Icon: ThumbDownIcon,
    iconColor: "text-(color:--adaptiveGrey400)",
    selected: "border-(--adaptiveRed500) bg-(--adaptiveRed50)",
    selectedIconColor: "text-(color:--adaptiveRed500)",
    selectedText: "var(--adaptiveRed500)",
  },
] as const;

// 시안 "인증반응_액션": 고르면 엄지가 위로 떠오르고(0.3s) 0.5s 머문 뒤 사라져요(0.25s).
const FLOAT_MS = 1050;
const FLOAT: Keyframe[] = [
  { opacity: 0, transform: "translateY(0)" },
  { opacity: 1, transform: "translateY(-20px)", offset: 300 / FLOAT_MS },
  { opacity: 1, transform: "translateY(-20px)", offset: 800 / FLOAT_MS },
  { opacity: 0, transform: "translateY(-20px)" },
];

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

interface ReactionButtonsProps {
  value: ReactionType | null;
  /** 고른 리액션을 다시 누르면 null(취소)이에요. */
  onChange: (reaction: ReactionType | null) => void;
  /** 리액션별 수예요. 시안 "잘 참았어요 1" */
  counts: Record<ReactionType, number>;
  /** 리액션을 받지 않는 때예요. 흐리게 그려서 누를 수 없다는 걸 보여줘요. */
  disabled?: boolean;
  /** 보내는 중이에요. 겹쳐 누르는 것만 막고 모양은 그대로 둬서, 누를 때마다 흐려지며 깜빡이지 않아요. */
  busy?: boolean;
}

const ReactionButtons = ({ value, onChange, counts, disabled, busy }: ReactionButtonsProps) => {
  const floats = useRef<Partial<Record<ReactionType, HTMLSpanElement | null>>>({});

  const select = (reaction: ReactionType) => {
    if (busy) return;
    const next = value === reaction ? null : reaction;
    // 누를 때마다 다시 재생해서 Web Animations API를 써요.
    if (next && !prefersReducedMotion())
      floats.current[next]?.animate(FLOAT, { duration: FLOAT_MS, easing: "ease-out" });
    onChange(next);
  };

  return (
    <div className="flex gap-3">
      {OPTIONS.map(({ value: option, label, Icon, ...style }) => {
        const isSelected = value === option;
        return (
          <button
            key={option}
            type="button"
            disabled={disabled}
            aria-disabled={disabled || busy}
            aria-pressed={isSelected}
            onClick={() => select(option)}
            className={cn(
              "flex h-14 flex-1 touch-manipulation appearance-none items-center justify-center gap-1.5 rounded-2xl! border border-solid border-(--adaptiveGreyOpacity200) bg-(--adaptiveGrey50) p-0 [-webkit-tap-highlight-color:transparent]",
              isSelected && style.selected,
              "disabled:opacity-40",
            )}
          >
            <span className="relative size-6" aria-hidden>
              <Icon
                className={cn(
                  "block size-6",
                  isSelected ? style.selectedIconColor : style.iconColor,
                )}
              />
              <span
                ref={node => {
                  floats.current[option] = node;
                }}
                className="pointer-events-none absolute inset-0 opacity-0"
              >
                <Icon className={cn("block size-6", style.selectedIconColor)} />
              </span>
            </span>
            <Paragraph
              typography="t6"
              fontWeight="semibold"
              color={isSelected ? style.selectedText : "var(--adaptiveGreyOpacity700)"}
            >
              {`${label} ${counts[option]}`}
            </Paragraph>
          </button>
        );
      })}
    </div>
  );
};

export default ReactionButtons;
