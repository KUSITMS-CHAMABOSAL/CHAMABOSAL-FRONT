import { Paragraph } from "@toss/tds-mobile";

import BosalSilhouette from "./BosalSilhouette";

interface InviteBosalCardProps {
  onClick: () => void;
  disabled?: boolean;
}

/** 아직 아무도 없는 격자 칸이에요. 회색 보살을 누르면 친구를 초대해요. */
const InviteBosalCard = ({ onClick, disabled }: InviteBosalCardProps) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className="relative h-[213px] w-full touch-manipulation appearance-none overflow-hidden rounded-lg! border! border-dashed! border-(--adaptiveGrey300)! bg-(--adaptiveGrey100)! p-0 [-webkit-tap-highlight-color:transparent]"
  >
    <div className="absolute top-1/2 left-1/2 -translate-1/2">
      <BosalSilhouette height={138} />
    </div>
    <Paragraph
      typography="t7"
      fontWeight="medium"
      color="var(--adaptiveGrey700)"
      className="absolute inset-x-0 top-[181px] truncate px-2 text-center"
    >
      친구 초대하기
    </Paragraph>
  </button>
);

export default InviteBosalCard;
