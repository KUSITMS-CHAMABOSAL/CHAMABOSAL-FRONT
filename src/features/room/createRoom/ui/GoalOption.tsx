import { Paragraph } from "@toss/tds-mobile";

import { cn } from "@/shared/lib";

interface GoalOptionProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

/**
 * 절약 목표 하나를 고르는 버튼이에요. Figma 컴포넌트 "Button"(299:15875)의 선택·미선택 두 상태예요.
 * 선택 안 된 상태의 회색은 시안 색(#f9fafc, #e0e4eb, #5c6475)과 가장 가까운 TDS 회색을 써요.
 */
const GoalOption = ({ label, selected, onClick }: GoalOptionProps) => (
  <button
    type="button"
    role="radio"
    aria-checked={selected}
    onClick={onClick}
    className={cn(
      "flex h-[58px] appearance-none items-center justify-center rounded-[10px]! border border-solid p-0",
      selected ? "border-mint-500 bg-mint-50" : "border-(--adaptiveGrey200) bg-(--adaptiveGrey50)",
    )}
  >
    <Paragraph
      typography="t6"
      fontWeight="medium"
      color={selected ? "var(--color-mint-700)" : "var(--adaptiveGrey600)"}
    >
      {label}
    </Paragraph>
  </button>
);

export default GoalOption;
