import { Paragraph } from "@toss/tds-mobile";

import { STATUS_EXPRESSION } from "../config/art";
import type { BosalColor, BosalStatus } from "../model/types";
import BosalImage from "./BosalImage";
import BosalStatusBadge from "./BosalStatusBadge";

interface BosalCardProps {
  name: string;
  color: BosalColor;
  status: BosalStatus;
  /** 오늘 콕 찔린 횟수예요. 0이면 표시하지 않아요. */
  pokes: number;
}

/** 오늘의 보살 격자 카드예요. 누르지 않고 옆으로 넘겨서 그 보살의 카드를 봐요. */
const BosalCard = ({ name, color, status, pokes }: BosalCardProps) => (
  <div className="relative h-[213px] w-full overflow-hidden rounded-lg border border-solid border-(--adaptiveGrey300) bg-(--adaptiveGrey50) text-center">
    <div className="absolute inset-x-2.5 top-2.5 flex items-center justify-between">
      <BosalStatusBadge status={status} />
      {pokes > 0 && (
        <span className="rounded-full bg-(--adaptiveBackground) px-1.5 py-0.5">
          <Paragraph typography="st13" fontWeight="bold" color="var(--adaptiveGreyOpacity700)">
            {`👆${pokes}`}
          </Paragraph>
        </span>
      )}
    </div>
    <BosalImage
      color={color}
      expression={STATUS_EXPRESSION[status]}
      className="absolute top-9 left-[27px]"
    />
    <Paragraph
      typography="t7"
      fontWeight="medium"
      color="var(--adaptiveGrey900)"
      className="absolute inset-x-0 top-[181px] truncate px-2 text-center"
    >
      {name}
    </Paragraph>
  </div>
);

export default BosalCard;
