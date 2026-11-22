import { Paragraph } from "@toss/tds-mobile";

import { cn } from "@/shared/lib";

interface GoalOptionProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

/**
 * 절약 목표 하나를 고르는 버튼이에요. 시안(1-5)처럼 고르면 TDS 초록, 안 고르면 TDS 회색이에요.
 */
const GoalOption = ({ label, selected, onClick }: GoalOptionProps) => (
  <button
    type="button"
    role="radio"
    aria-checked={selected}
    onClick={onClick}
    className={cn(
      "flex h-[58px] appearance-none items-center justify-center rounded-[10px]! border border-solid p-0",
      selected
        ? "border-(--adaptiveGreen500) bg-(--adaptiveGreen50)"
        : "border-(--adaptiveGrey200) bg-(--adaptiveGrey50)",
    )}
  >
    <Paragraph
      typography="t6"
      fontWeight="medium"
      color={selected ? "var(--adaptiveGreen700)" : "var(--adaptiveGreyOpacity700)"}
    >
      {label}
    </Paragraph>
  </button>
);

export default GoalOption;
