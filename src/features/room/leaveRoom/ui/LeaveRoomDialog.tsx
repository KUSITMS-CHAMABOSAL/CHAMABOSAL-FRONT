import { ConfirmDialog } from "@toss/tds-mobile";

import { useLeavePreviewQuery } from "@/entities/room";

interface LeaveRoomDialogProps {
  open: boolean;
  roomId: number;
  roomName: string;
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

/**
 * 방 나가기 확인이에요. 첫 솥을 채우기 전이면 사라질 공양미를 알려요(설계서 33).
 * 이미 솥을 채워 차감이 없으면(0석) 그 문장을 숨겨요.
 */
// 시안 제목 "~에서 나가시겠어요?"는 문구 규칙(과도한 경어 금지)에 따라 "나갈까요?"로 바꿨어요.
// 🔖 공양미 문장의 위치와 문구는 GUI 시안 확인이 필요해요. 지금은 설계서 문장을 안내 앞에 붙였어요.
const LeaveRoomDialog = ({
  open,
  roomId,
  roomName,
  isPending,
  onClose,
  onConfirm,
}: LeaveRoomDialogProps) => {
  const riceToLose = useLeavePreviewQuery(roomId, open).data?.riceToLose ?? 0;

  return (
    <ConfirmDialog
      open={open}
      title={<ConfirmDialog.Title>{`${roomName}에서 나갈까요?`}</ConfirmDialog.Title>}
      description={
        <ConfirmDialog.Description>
          {riceToLose > 0 && `이 방에서 모은 공양미는 ${riceToLose}석 사라져요. `}
          사진은 바로 삭제되고, 기록은 &apos;떠난 보살&apos;로 남아요. 다시 들어와도 이번 달 지목
          횟수는 이어져요.
        </ConfirmDialog.Description>
      }
      cancelButton={<ConfirmDialog.CancelButton onClick={onClose}>닫기</ConfirmDialog.CancelButton>}
      confirmButton={
        <ConfirmDialog.ConfirmButton
          color="danger"
          variant="weak"
          loading={isPending}
          onClick={onConfirm}
        >
          나가기
        </ConfirmDialog.ConfirmButton>
      }
      onClose={onClose}
    />
  );
};

export default LeaveRoomDialog;
