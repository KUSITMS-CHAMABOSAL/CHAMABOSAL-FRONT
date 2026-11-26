import { useState } from "react";

import { Button } from "@toss/tds-mobile";

import { useTodayQuery } from "@/entities/room";
import { useTabBarToast } from "@/shared/lib";

import { NICKNAME_VOTING_MESSAGE } from "../config/messages";
import RenameNicknameSheet from "./RenameNicknameSheet";

interface RenameNicknameButtonProps {
  roomId: number;
  roomName: string;
  nickname: string;
}

// 🔖 시안의 [닉네임 수정]은 글자가 흐려 비활성처럼 보여요. 지금은 누를 수 있게 두고 디자이너에게 확인해요.
/** [닉네임 수정] 버튼과 수정 바텀시트예요. 투표 중이면 시트 대신 바꿀 수 없다고 알려요. */
const RenameNicknameButton = ({ roomId, roomName, nickname }: RenameNicknameButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  /** 열 때마다 바꿔서 시트를 새로 그려요. 입력값과 오류가 지금 닉네임 기준으로 돌아가고, 닫히는 애니메이션은 유지돼요. */
  const [openCount, setOpenCount] = useState(0);
  const today = useTodayQuery(roomId);
  const openToast = useTabBarToast();

  const handleOpen = () => {
    void today.refetch();
    // 투표 중인지 아직 모르면 시트를 열어요. 저장할 때 서버가 투표 중이면 거절해요(ROOM_012).
    if (today.data?.room.hasVotingRound) return openToast(NICKNAME_VOTING_MESSAGE);
    setOpenCount(count => count + 1);
    setIsOpen(true);
  };

  return (
    <>
      <Button size="xlarge" color="dark" variant="weak" display="block" onClick={handleOpen}>
        닉네임 수정
      </Button>
      <RenameNicknameSheet
        key={openCount}
        open={isOpen}
        roomId={roomId}
        roomName={roomName}
        nickname={nickname}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};

export default RenameNicknameButton;
