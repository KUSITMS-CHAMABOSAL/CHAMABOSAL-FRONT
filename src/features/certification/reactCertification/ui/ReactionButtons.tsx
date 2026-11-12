import { Paragraph } from "@toss/tds-mobile";

import { cn } from "@/shared/lib";
import type { ReactionType } from "@/shared/types";

import thumbDown from "../assets/icon_thumbdown_fill.svg";
import thumbUp from "../assets/icon_thumbup_fill.svg";

const OPTIONS = [
  { value: "RICE", label: "잘 참았어요", icon: thumbUp },
  { value: "MOKTAK", label: "아쉬워요", icon: thumbDown },
] as const;

interface ReactionButtonsProps {
  value: ReactionType | null;
  /** 고른 리액션을 다시 누르면 null(취소)이에요. */
  onChange: (reaction: ReactionType | null) => void;
  disabled?: boolean;
}

// 🔖 "아쉬워요"를 골랐을 때 아이콘 색은 시안 확인 필요. 지금은 고른 쪽만 파란 배경이에요.
const ReactionButtons = ({ value, onChange, disabled }: ReactionButtonsProps) => (
  <div className="flex gap-[13px]">
    {OPTIONS.map(option => (
      <button
        key={option.value}
        type="button"
        disabled={disabled}
        aria-pressed={value === option.value}
        onClick={() => onChange(value === option.value ? null : option.value)}
        className={cn(
          "flex h-[46px] flex-1 touch-manipulation appearance-none items-center justify-center gap-2.5 rounded-sm! border-0 bg-(--adaptiveGrey50) p-0 [-webkit-tap-highlight-color:transparent]",
          value === option.value && "bg-(--adaptiveBlue50)",
        )}
      >
        <img src={option.icon} alt="" width={24} height={24} />
        <Paragraph typography="t7" color="var(--adaptiveGrey900)">
          {option.label}
        </Paragraph>
      </button>
    ))}
  </div>
);

export default ReactionButtons;
