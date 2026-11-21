import { Paragraph } from "@toss/tds-mobile";

import inviteSeat from "../assets/invite_seat.svg";

interface InviteSeatCardProps {
  onClick: () => void;
  disabled?: boolean;
}

/** 방 정원 밖의 격자 칸이에요. 빈 방석을 누르면 친구를 초대해요. */
const InviteSeatCard = ({ onClick, disabled }: InviteSeatCardProps) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className="relative h-[213px] w-full touch-manipulation appearance-none overflow-hidden rounded-lg! border-0 bg-(--adaptiveBackground) p-0 shadow-[0_0_4px_var(--adaptiveGrey300)] [-webkit-tap-highlight-color:transparent]"
  >
    <img
      src={inviteSeat}
      alt=""
      width={111}
      height={41}
      className="absolute top-[106px] left-1/2 max-w-none -translate-x-1/2"
    />
    <Paragraph
      typography="t7"
      fontWeight="medium"
      color="var(--adaptiveGrey500)"
      className="absolute inset-x-0 top-[182px] truncate px-2 text-center"
    >
      친구 초대하기
    </Paragraph>
  </button>
);

export default InviteSeatCard;
