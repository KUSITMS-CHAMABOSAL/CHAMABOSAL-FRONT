import { Badge } from "@toss/tds-mobile";

import type { BosalStatus } from "../model/types";

const BADGE = {
  unverified: { label: "미인증", color: "elephant" },
  patient: { label: "참았어요", color: "blue" },
  failed: { label: "못 참았어요", color: "red" },
} as const;

// 시안은 10px 글자지만 11px 미만 금지 규칙에 따라 TDS Badge 가장 작은 크기를 써요.
const BosalStatusBadge = ({ status }: { status: BosalStatus }) => {
  const { label, color } = BADGE[status];
  return (
    <Badge size="xsmall" variant="fill" color={color}>
      {label}
    </Badge>
  );
};

export default BosalStatusBadge;
