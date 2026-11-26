import { BottomSheet, Paragraph } from "@toss/tds-mobile";

import { BosalHead } from "@/entities/bosal";
import type { TodayMember } from "@/entities/room";
import { cn } from "@/shared/lib";

interface MemberSheetProps {
  /** 없으면 닫혀 있어요. 닫히는 동안에도 내용을 그리려고 마지막 멤버를 받아요. */
  member: TodayMember | null;
  open: boolean;
  roomName: string;
  onClose: () => void;
  /** 방장이 다른 멤버를 볼 때만 [내보내기]를 보여줘요. */
  canKick: boolean;
  /** 투표가 열린 뒤부터 결과 발표까지는 내보낼 수 없어요. */
  isKickDisabled: boolean;
  onKick: () => void;
}

/**
 * 멤버를 눌렀을 때 뜨는 시트예요(시안 3-4 내보내기). 누구나 이번 달 기록을 볼 수 있어요.
 * [내보내기]는 방장에게만, 자기 자신에게는 없어요(설계서 10).
 */
const MemberSheet = ({
  member,
  open,
  roomName,
  onClose,
  canKick,
  isKickDisabled,
  onKick,
}: MemberSheetProps) => (
  <BottomSheet
    open={open}
    onClose={onClose}
    cta={
      canKick && (
        <BottomSheet.CTA color="danger" variant="weak" disabled={isKickDisabled} onClick={onKick}>
          내보내기
        </BottomSheet.CTA>
      )
    }
  >
    {member && (
      // [내보내기]가 없으면 기록 박스가 시트 아래에 붙어서 좌우 여백만큼 띄워요.
      <div className={cn("flex flex-col gap-5 px-5 pt-3", !canKick && "pb-5")}>
        <div className="flex items-center gap-5">
          <BosalHead color={member.color} className="size-15 shrink-0" />
          <div className="flex min-w-0 flex-col gap-1.25">
            <Paragraph
              typography="t5"
              fontWeight="bold"
              color="var(--adaptiveGrey900)"
              className="truncate"
            >
              {member.nickname}
            </Paragraph>
            <Paragraph typography="t7" fontWeight="semibold" color="var(--adaptiveGreyOpacity700)">
              {roomName}
            </Paragraph>
          </div>
        </div>
        <div className="flex items-center rounded-2xl bg-(--adaptiveGrey50) py-5.75 text-center">
          <Stat value={`${member.monthlyEnduredCount}회`} label="이번달 참은 횟수" />
          <span aria-hidden className="h-16 w-px bg-(--adaptiveGreyOpacity200)" />
          <Stat value={`${member.monthlyPickedCount}번`} label="이번달 지목" />
        </div>
      </div>
    )}
  </BottomSheet>
);

const Stat = ({ value, label }: { value: string; label: string }) => (
  <div className="flex flex-1 flex-col gap-3.25">
    <Paragraph typography="t5" fontWeight="bold" color="var(--adaptiveGrey900)">
      {value}
    </Paragraph>
    <Paragraph typography="t7" fontWeight="medium" color="var(--adaptiveGreyOpacity700)">
      {label}
    </Paragraph>
  </div>
);

export default MemberSheet;
