import { useState } from "react";

import { Button } from "@toss/tds-mobile";

import RenameNicknameSheet from "./RenameNicknameSheet";

interface RenameNicknameButtonProps {
  roomId: number;
  roomName: string;
  nickname: string;
}

// 🔖 시안의 [닉네임 수정]은 글자가 흐려 비활성처럼 보여요. 지금은 누를 수 있게 두고 디자이너에게 확인해요.
/** [닉네임 수정] 버튼과 수정 바텀시트예요. */
const RenameNicknameButton = ({ roomId, roomName, nickname }: RenameNicknameButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  /** 열 때마다 바꿔서 시트를 새로 그려요. 입력값과 오류가 지금 닉네임 기준으로 돌아가고, 닫히는 애니메이션은 유지돼요. */
  const [openCount, setOpenCount] = useState(0);

  return (
    <>
      <Button
        size="xlarge"
        color="dark"
        variant="weak"
        display="block"
        onClick={() => {
          setOpenCount(count => count + 1);
          setIsOpen(true);
        }}
      >
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
