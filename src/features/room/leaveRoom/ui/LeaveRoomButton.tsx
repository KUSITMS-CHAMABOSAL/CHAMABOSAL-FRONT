import { useState } from "react";
import { useNavigate } from "react-router";

import { Button } from "@toss/tds-mobile";

import { paths } from "@/shared/config";
import { useTabBarToast } from "@/shared/lib";

import { useLeaveRoom } from "../model/useLeaveRoom";
import LeaveRoomDialog from "./LeaveRoomDialog";

interface LeaveRoomButtonProps {
  roomId: number;
  roomName: string;
}

/** [나가기] 버튼과 확인 다이얼로그예요. 나가면 진입 분기로 가서 남은 방이나 첫 화면을 보여줘요. */
const LeaveRoomButton = ({ roomId, roomName }: LeaveRoomButtonProps) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { mutate: leave, isPending } = useLeaveRoom(roomId);
  const navigate = useNavigate();
  const openToast = useTabBarToast();

  const confirmLeave = () =>
    leave(undefined, {
      onSuccess: () => navigate(paths.root, { replace: true }),
      onError: () => {
        setIsConfirmOpen(false);
        openToast("방에서 나가지 못했어요. 잠시 후 다시 시도해 주세요");
      },
    });

  return (
    <>
      <Button
        size="xlarge"
        color="danger"
        variant="weak"
        display="block"
        onClick={() => setIsConfirmOpen(true)}
      >
        나가기
      </Button>
      <LeaveRoomDialog
        open={isConfirmOpen}
        roomName={roomName}
        isPending={isPending}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmLeave}
      />
    </>
  );
};

export default LeaveRoomButton;
