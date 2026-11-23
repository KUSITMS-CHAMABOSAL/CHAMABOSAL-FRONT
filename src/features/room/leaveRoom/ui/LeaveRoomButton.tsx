import { type ReactNode, useState } from "react";
import { useNavigate } from "react-router";

import { Button } from "@toss/tds-mobile";

import { useLeavePreviewQuery } from "@/entities/room";
import { paths } from "@/shared/config";
import { useTabBarToast } from "@/shared/lib";

import { useLeaveRoom } from "../model/useLeaveRoom";
import LeaveRoomDialog from "./LeaveRoomDialog";

interface LeaveRoomButtonProps {
  roomId: number;
  roomName: string;
  /** 기본 [나가기] 버튼 대신 그릴 트리거예요. 누르면 `open`을 불러요. */
  children?: (open: () => void) => ReactNode;
}

/** [나가기] 버튼과 확인 다이얼로그예요. 나가면 진입 분기로 가서 남은 방이나 첫 화면을 보여줘요. */
const LeaveRoomButton = ({ roomId, roomName, children }: LeaveRoomButtonProps) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { mutate: leave, isPending } = useLeaveRoom(roomId);
  // 확인 창이 열린 뒤 공양미 문장이 붙어 창 높이가 바뀌지 않게, 버튼이 보일 때 미리 받아요.
  const preview = useLeavePreviewQuery(roomId);
  const navigate = useNavigate();
  const openToast = useTabBarToast();

  const openConfirm = () => {
    setIsConfirmOpen(true);
    // 받아 둔 값이 오래됐으면 다시 받아요. 실제로 깎이는 양은 나가는 순간 서버가 정해요.
    if (preview.isStale) void preview.refetch();
  };

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
      {children ? (
        children(openConfirm)
      ) : (
        <Button size="xlarge" color="danger" variant="weak" display="block" onClick={openConfirm}>
          나가기
        </Button>
      )}
      <LeaveRoomDialog
        open={isConfirmOpen}
        roomName={roomName}
        riceToLose={preview.data?.riceToLose}
        isPending={isPending}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmLeave}
      />
    </>
  );
};

export default LeaveRoomButton;
