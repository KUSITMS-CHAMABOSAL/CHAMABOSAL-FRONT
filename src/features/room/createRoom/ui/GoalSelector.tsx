import { Paragraph } from "@toss/tds-mobile";

import { ROOM_GOAL_LABEL, ROOM_GOALS, type RoomGoal } from "@/entities/room";

import GoalOption from "./GoalOption";

interface GoalSelectorProps {
  /** 아직 고르지 않았으면 null이에요. */
  value: RoomGoal | null;
  onChange: (goal: RoomGoal) => void;
}

/** 절약 목표 4개를 2열로 놓고 하나를 고르게 해요. 처음에는 아무것도 고르지 않은 상태예요. */
const GoalSelector = ({ value, onChange }: GoalSelectorProps) => (
  <section className="flex flex-col gap-3 px-5">
    <Paragraph
      id="room-goal-label"
      typography="t6"
      fontWeight="medium"
      color="var(--adaptiveGrey900)"
    >
      절약 목표
    </Paragraph>
    <div
      role="radiogroup"
      aria-labelledby="room-goal-label"
      className="grid grid-cols-2 gap-x-[7px] gap-y-[13px]"
    >
      {ROOM_GOALS.map(goal => (
        <GoalOption
          key={goal}
          label={ROOM_GOAL_LABEL[goal]}
          selected={goal === value}
          onClick={() => onChange(goal)}
        />
      ))}
    </div>
  </section>
);

export default GoalSelector;
