import { BottomSheet, Paragraph } from "@toss/tds-mobile";

import { BosalHead } from "@/entities/bosal";
import type { TodayMember } from "@/entities/room";

interface MemberSheetProps {
  /** 없으면 닫혀 있어요. 닫히는 동안에도 내용을 그리려고 마지막 멤버를 받아요. */
  member: TodayMember | null;
  open: boolean;
  roomName: string;
  onClose: () => void;
  onKick: () => void;
}

/** 방장이 멤버를 눌렀을 때 뜨는 시트예요(시안 3-4 내보내기). 이번 달 기록을 보고 내보낼 수 있어요. */
const MemberSheet = ({ member, open, roomName, onClose, onKick }: MemberSheetProps) => (
  <BottomSheet
    open={open}
    onClose={onClose}
    cta={
      <BottomSheet.CTA color="danger" variant="weak" onClick={onKick}>
        내보내기
      </BottomSheet.CTA>
    }
  >
    {member && (
      <div className="flex flex-col gap-5 px-5 pt-3">
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
