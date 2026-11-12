import { ConfirmDialog } from "@toss/tds-mobile";

interface LeaveRoomDialogProps {
  open: boolean;
  roomName: string;
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

// 시안 제목 "~에서 나가시겠어요?"는 문구 규칙(과도한 경어 금지)에 따라 "나갈까요?"로 바꿨어요.
const LeaveRoomDialog = ({
  open,
  roomName,
  isPending,
  onClose,
  onConfirm,
}: LeaveRoomDialogProps) => (
  <ConfirmDialog
    open={open}
    title={<ConfirmDialog.Title>{`${roomName}에서 나갈까요?`}</ConfirmDialog.Title>}
    description={
      <ConfirmDialog.Description>
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

export default LeaveRoomDialog;
