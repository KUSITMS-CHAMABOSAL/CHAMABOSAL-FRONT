import { useState } from "react";

import { canCertify, type TodayResponse } from "@/entities/room";
import { MIN_VOTERS } from "@/entities/vote";
import {
  CertifyReminderDialog,
  useCertifyReminder,
} from "@/features/certification/remindCertification";
import { PotDecisionDialog, PotGoalNoticeDialog } from "@/features/room/decidePot";

interface EntryPopupsProps {
  today: TodayResponse;
  /** 한 솥 축하를 보고 막 돌아왔어요. 멤버에게 방장의 선택을 기다린다고 알려요. */
  isBackFromPotCelebration: boolean;
  onPotNoticeClose: () => void;
  onCertify: () => void;
  onRoomClosed: () => void;
  onError: (message: string) => void;
}

/**
 * 방 홈에 들어올 때 뜨는 팝업이에요(설계서 09, 09-1). 한 번에 하나만 띄워요.
 * 인증 전 안내가 먼저이고, 그다음 방장에게는 방을 이어갈지 고르는 팝업, 멤버에게는 목표 달성 안내예요.
 * 한 솥 축하는 이 화면에 오기 전에 레이아웃이 먼저 띄워요.
 * 방을 바꾸면 새로 그려야 해요. 방장의 선택 팝업은 들어올 때마다 한 번씩 떠요.
 */
const EntryPopups = ({
  today,
  isBackFromPotCelebration,
  onPotNoticeClose,
  onCertify,
  onRoomClosed,
  onError,
}: EntryPopupsProps) => {
  const { roomId, isOwner, memberCount } = today.room;
  // 투표가 열리지 않는 방(3명 미만)에서는 투표 참여를 안내할 이유가 없어요.
  const reminder = useCertifyReminder(
    roomId,
    today.round.roundId,
    canCertify(today) && memberCount >= MIN_VOTERS,
  );
  const [isDecisionDismissed, setIsDecisionDismissed] = useState(false);
  // 저장소를 읽는 동안에는 뒤 팝업도 기다려요. 먼저 떴다가 안내로 바뀌지 않게요.
  const isReminderSettled = reminder.isOpen === false;

  return (
    <>
      <CertifyReminderDialog
        open={reminder.isOpen === true}
        onClose={reminder.close}
        onCertify={() => {
          reminder.close();
          onCertify();
        }}
      />
      <PotDecisionDialog
        roomId={roomId}
        open={isReminderSettled && today.me.isPotDecisionPending && !isDecisionDismissed}
        onDismiss={() => setIsDecisionDismissed(true)}
        onRoomClosed={onRoomClosed}
        onError={onError}
      />
      <PotGoalNoticeDialog
        open={isReminderSettled && isBackFromPotCelebration && !isOwner}
        onClose={onPotNoticeClose}
      />
    </>
  );
};

export default EntryPopups;
